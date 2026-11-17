import $RefParser from "@apidevtools/json-schema-ref-parser";
import addFormats from "ajv-formats";
import { OpenAPIBackend } from "openapi-backend";
import { listOperations } from "../spec.js";

/**
 * Routing and request validation, backed by openapi-backend. This file is the only one that imports it: swap
 * the library here and keep the interface:
 *
 *   router.match({ method, path })        → { method, path } | { status: 404 } | { status: 405, allow }
 *   router.methods                        → every method the API uses, upper case (QUERY, PURGE, ... included)
 *   router.validate(request, matched)     → [{ in, path, message }] (empty when valid), or null when this
 *                                           operation's validator could not be built
 *
 * `request` is `{ method, path, query, headers, body }`: query as the raw query string, header names in
 * lower case, body parsed (JSON value, or an object for form bodies) or undefined.
 */

// The methods openapi-backend routes. Others (OpenAPI 3.2's QUERY, additionalOperations such as PURGE) are
// registered with it as `post` operations under a path that names the method: OTHER_PREFIX/QUERY/orders.
const BACKEND_METHODS = new Set([
  "get",
  "put",
  "post",
  "delete",
  "options",
  "head",
  "patch",
  "trace",
]);
const OTHER_PREFIX = "/__rapidoc_method__";
const otherPath = (method, path) => `${OTHER_PREFIX}/${method.toUpperCase()}${path}`;

// OpenAPI formats that JSON Schema doesn't define; accepted as they come.
const OPENAPI_FORMATS = ["int32", "int64", "float", "double", "byte", "binary", "password"];

/**
 * @param {object} doc - Bundled OpenAPI document (loadSpec)
 * @param {object} [options]
 * @param {(line: string) => void} [options.warn]
 */
export async function createRouter(doc, { warn = () => {} } = {}) {
  // openapi-backend needs an operationId on every operation; give the ones without one a stable id.
  const copy = structuredClone(doc);
  const otherMethods = new Set();
  for (const { method, path, operation } of listOperations(copy)) {
    operation.operationId ??= `${method} ${path}`;
    if (BACKEND_METHODS.has(method)) continue;
    // QUERY and additionalOperations: a `post` under OTHER_PREFIX/<METHOD><path>, with the path's parameters
    otherMethods.add(method);
    copy.paths[otherPath(method, path)] = {
      ...(copy.paths[path]?.parameters ? { parameters: copy.paths[path].parameters } : {}),
      post: operation,
    };
  }
  const definition = await $RefParser.dereference(copy, { dereference: { circular: true } });
  // openapi-backend validates application/json bodies only; check other JSON types (merge-patch+json,
  // vnd.api+json) against their own schema too.
  for (const { operation } of listOperations(definition)) {
    const content = operation.requestBody?.content;
    const json =
      content &&
      !content["application/json"] &&
      Object.keys(content).find((type) => /[/+]json\b/i.test(type) && !content[type].itemSchema);
    if (json) content["application/json"] = content[json];
  }

  const api = new OpenAPIBackend({
    definition,
    // quick: no document validation (it knows only the 3.0 meta-schema; the portal validates specs) and
    // validators compiled on first use, so one schema it can't compile costs one operation, not the API.
    quick: true,
    validate: true,
    ajvOpts: { logger: false },
    customizeAjv: (ajv) => {
      addFormats(ajv);
      for (const format of OPENAPI_FORMATS) ajv.addFormat(format, true);
      return ajv;
    },
  });
  await api.init();
  const { router, validator } = api;
  const operations = router.getOperations();
  const methods = [...new Set(operations.map((op) => op.method))];
  const unvalidated = new Set();

  /** The backend operation for a request: its own for the eight methods it knows, else the OTHER_PREFIX one */
  const backendMatch = (method, path) =>
    BACKEND_METHODS.has(method)
      ? router.matchOperation({ method, path, headers: {} })
      : router.matchOperation({ method: "post", path: otherPath(method, path), headers: {} });
  const originalPath = (operation, method) =>
    BACKEND_METHODS.has(method)
      ? operation.path
      : operation.path.slice(otherPath(method, "").length);

  return {
    /** Every method the API uses, in upper case: for CORS (Access-Control-Allow-Methods) */
    methods: [...new Set([...methods, ...otherMethods])].map((m) => m.toUpperCase()),

    match({ method, path }) {
      if (path.startsWith(OTHER_PREFIX)) return { status: 404 };
      const operation = backendMatch(method, path);
      if (operation) return { method, path: originalPath(operation, method) };
      const allow = [...methods, ...otherMethods]
        .filter((other) => backendMatch(other, path))
        .map((m) => m.toUpperCase());
      return allow.length ? { status: 405, allow } : { status: 404 };
    },

    validate(request, matched) {
      const other = !BACKEND_METHODS.has(matched.method);
      const operation = operations.find((op) =>
        other
          ? op.method === "post" && op.path === otherPath(matched.method, matched.path)
          : op.method === matched.method && op.path === matched.path,
      );
      if (!operation || unvalidated.has(operation.operationId)) return null;
      let result;
      try {
        result = validator.validateRequest(
          other
            ? { ...request, method: "post", path: otherPath(matched.method, request.path) }
            : request,
          operation,
        );
      } catch (err) {
        unvalidated.add(operation.operationId);
        warn(
          `${matched.method.toUpperCase()} ${matched.path}: requests are not validated (${err.message.split("\n")[0]})`,
        );
        return null;
      }
      return (result.errors || []).map((error) => {
        const [, where = "request", ...rest] = (error.instancePath || "").split("/");
        const place = where === "requestBody" ? "body" : where;
        const path = rest.join("/");
        const detail =
          error.keyword === "required" ? `missing ${error.params.missingProperty}` : error.message;
        return { in: place, ...(path ? { path: `/${path}` } : {}), message: detail };
      });
    },
  };
}
