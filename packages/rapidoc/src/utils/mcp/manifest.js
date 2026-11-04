/**
 * Builds the MCP manifest: a plain JSON description of an API's tools that a runtime executes.
 * Pure, no dependencies; takes a raw OpenAPI 3.x / Swagger 2.0 object or the result of
 * `ProcessSpec` (`tags[].paths[]`).
 */
import {
  AUTH_TRANSPORT_HEADERS,
  deriveToolName,
  sanitizeDescription,
  toSnakeCase,
} from "./common.js";

export const MANIFEST_VERSION = 1;

const METHODS = ["get", "put", "post", "delete", "options", "head", "patch", "trace", "query"];
const RESOURCE_PATH_HINTS = [
  "/reference",
  "/currencies",
  "/countries",
  "/tiers",
  "/categories",
  "/status",
  "/schema",
];
// JSON Schema keywords copied as they are; everything else (examples, xml, x-*, ...) is dropped
const SCHEMA_KEYWORDS = new Set([
  "type",
  "title",
  "description",
  "default",
  "enum",
  "const",
  "format",
  "multipleOf",
  "maximum",
  "exclusiveMaximum",
  "minimum",
  "exclusiveMinimum",
  "maxLength",
  "minLength",
  "pattern",
  "maxItems",
  "minItems",
  "uniqueItems",
  "maxProperties",
  "minProperties",
  "required",
]);
const SCHEMA_SUBSCHEMAS = new Set(["items", "additionalProperties", "not"]);
const SCHEMA_LISTS = new Set(["allOf", "anyOf", "oneOf"]);
const SECURITY_KEYS = [
  "type",
  "description",
  "in",
  "name",
  "scheme",
  "bearerFormat",
  "openIdConnectUrl",
];

function resolvePointer(root, ref) {
  if (typeof ref !== "string" || !ref.startsWith("#/")) return undefined;
  return ref
    .slice(2)
    .split("/")
    .map((s) => decodeURIComponent(s).replace(/~1/g, "/").replace(/~0/g, "~"))
    .reduce((node, key) => (node && typeof node === "object" ? node[key] : undefined), root);
}

/**
 * An OpenAPI schema as JSON Schema for a tool argument: `$ref`s inlined, `nullable` folded into
 * `type`, read-only properties dropped (they never go in a request), and non-schema keys removed.
 * A schema reached again on the same branch (a cycle) is cut to its bare type.
 */
export function toJsonSchema(schema, root, stack = new Set()) {
  if (!schema || typeof schema !== "object") return {};
  if (schema.$ref) {
    const target = resolvePointer(root, schema.$ref);
    if (!target || typeof target !== "object") {
      return { description: `See ${schema.$ref}` };
    }
    return toJsonSchema(target, root, stack);
  }
  if (stack.has(schema)) return schema.type ? { type: schema.type } : {};
  stack.add(schema);
  const out = {};
  let nullable = false;
  for (const [key, value] of Object.entries(schema)) {
    if (key === "properties" && value && typeof value === "object") {
      out.properties = {};
      for (const [name, prop] of Object.entries(value)) {
        if (prop?.readOnly === true) continue;
        out.properties[name] = toJsonSchema(prop, root, stack);
      }
    } else if (SCHEMA_SUBSCHEMAS.has(key)) {
      out[key] = typeof value === "object" ? toJsonSchema(value, root, stack) : value;
    } else if (SCHEMA_LISTS.has(key) && Array.isArray(value)) {
      out[key] = value.map((s) => toJsonSchema(s, root, stack));
    } else if (key === "nullable") {
      nullable = value === true;
    } else if (SCHEMA_KEYWORDS.has(key)) {
      out[key] = value;
    }
  }
  stack.delete(schema);
  if (out.properties && Array.isArray(out.required)) {
    out.required = out.required.filter((name) => name in out.properties);
    if (!out.required.length) delete out.required;
  }
  // OpenAPI 3.0 booleans: exclusiveMinimum: true means "minimum is exclusive"
  for (const [flag, bound] of [
    ["exclusiveMinimum", "minimum"],
    ["exclusiveMaximum", "maximum"],
  ]) {
    if (typeof out[flag] === "boolean") {
      if (out[flag] && out[bound] !== undefined) {
        out[flag] = out[bound];
        delete out[bound];
      } else delete out[flag];
    }
  }
  if (nullable && out.type && ![].concat(out.type).includes("null")) {
    out.type = [].concat(out.type, "null");
  }
  return out;
}

function isProcessedSpec(spec) {
  return (
    "specLoadError" in spec ||
    (Array.isArray(spec.tags) && spec.tags.some((t) => Array.isArray(t?.paths)))
  );
}

/** Every operation with the fields the manifest needs, from either spec shape. */
function collectOperations(spec, processed) {
  const operations = [];
  if (processed) {
    for (const tag of spec.tags || []) {
      for (const p of tag.paths || []) {
        operations.push({
          method: String(p.method || "get").toLowerCase(),
          path: p.path || "",
          operationId: p.rawOperation?.operationId || "",
          summary: p.summary || "",
          description: p.description || "",
          deprecated: p.deprecated === true,
          isWebhook: p.isWebhook === true,
          internal: p.xInternal === true || p.xHidden === true,
          parameters: Array.isArray(p.parameters) ? p.parameters : [],
          requestBody: p.requestBody || null,
          security: p.security,
          tag: tag.name || "",
        });
      }
    }
    return operations;
  }
  for (const [path, item] of Object.entries(spec.paths || {})) {
    if (!item || typeof item !== "object") continue;
    const common = Array.isArray(item.parameters) ? item.parameters : [];
    for (const method of METHODS) {
      const op = item[method];
      if (!op || typeof op !== "object") continue;
      const own = Array.isArray(op.parameters) ? op.parameters : [];
      // Path-level parameters apply unless the operation redefines them (same name and location)
      const parameters = common
        .filter((c) => !own.some((o) => o?.name === c?.name && o?.in === c?.in))
        .concat(own);
      operations.push({
        method,
        path,
        operationId: op.operationId || "",
        summary: op.summary || "",
        description: op.description || "",
        deprecated: op.deprecated === true,
        isWebhook: false,
        internal:
          op["x-internal"] === true ||
          op["x-hidden"] === true ||
          item["x-internal"] === true ||
          item["x-hidden"] === true,
        parameters,
        requestBody: op.requestBody || null,
        security: op.security ?? spec.security,
        tag: Array.isArray(op.tags) ? op.tags[0] || "" : "",
      });
    }
  }
  return operations;
}

/** The spec's security schemes as `{ id: { type, in, name, scheme, ... } }`, from either shape. */
function collectSecuritySchemes(spec, processed) {
  const out = {};
  const add = (id, scheme) => {
    if (!scheme || typeof scheme !== "object" || !scheme.type) return;
    const entry = {};
    for (const key of SECURITY_KEYS) if (scheme[key] !== undefined) entry[key] = scheme[key];
    if (scheme.type === "oauth2" && scheme.flows && typeof scheme.flows === "object") {
      entry.flows = scheme.flows;
    }
    out[id] = entry;
  };
  if (processed) {
    for (const s of spec.securitySchemes || []) {
      // The scheme <rapi-doc>'s api-key attributes inject is the page's, not the API's
      if (s?.securitySchemeId && s.securitySchemeId !== "_rapidoc_api_key") {
        add(s.securitySchemeId, s.type === "apiKey" ? s : { ...s, in: undefined, name: undefined });
      }
    }
  } else {
    const schemes = spec.components?.securitySchemes || spec.securityDefinitions || {};
    for (const [id, scheme] of Object.entries(schemes)) {
      add(id, scheme?.$ref ? resolvePointer(spec, scheme.$ref) : scheme);
    }
  }
  return out;
}

function baseUrlOf(spec, processed) {
  const server = spec.servers?.[0];
  if (server?.url) {
    let url = String(server.url);
    for (const [name, v] of Object.entries(server.variables || {})) {
      url = url.split(`{${name}}`).join(String(v?.default ?? v?.enum?.[0] ?? ""));
    }
    return url;
  }
  if (!processed && spec.host) {
    return `${spec.schemes?.[0] || "https"}://${spec.host}${spec.basePath || ""}`;
  }
  return "http://localhost";
}

/** A parameter's schema, from `schema`, `content` or Swagger 2.0's inline type keywords. */
function parameterSchema(param, root) {
  if (param.schema) return toJsonSchema(param.schema, root);
  if (param.content && typeof param.content === "object") {
    const first = Object.values(param.content)[0];
    if (first?.schema) return toJsonSchema(first.schema, root);
  }
  const inline = {};
  for (const key of [
    "type",
    "format",
    "enum",
    "items",
    "default",
    "minimum",
    "maximum",
    "pattern",
  ]) {
    if (param[key] !== undefined) inline[key] = param[key];
  }
  return inline.type ? toJsonSchema(inline, root) : { type: "string" };
}

function bodyContent(requestBody) {
  const content = requestBody?.content;
  if (!content || typeof content !== "object") return null;
  const types = Object.keys(content);
  const pick =
    types.find((t) => t === "application/json") ||
    types.find((t) => t.endsWith("+json")) ||
    types.find((t) => t === "application/x-www-form-urlencoded") ||
    types.find((t) => t === "multipart/form-data") ||
    types[0];
  return pick ? { contentType: pick, schema: content[pick]?.schema } : null;
}

/**
 * @param {object} spec Raw OpenAPI / Swagger object, or `ProcessSpec`'s result
 * @param {object} [options]
 * @param {string} [options.serverName] the MCP server's name; defaults to the API title
 * @param {string} [options.sourceName="api"] the key of the API in `sources`
 * @param {boolean} [options.includeInternal] keep `x-internal` / `x-hidden` operations
 * @param {boolean} [options.includeDeprecated] keep deprecated operations
 * @returns {object} the manifest: `{ manifestVersion, server, sources, tools, resources,
 *   workflows }`. Each tool has `name`, `description`, `inputSchema` (JSON Schema; parameters by
 *   name plus `body`), `annotations` (`readOnlyHint`, `destructiveHint`, `idempotentHint`) and
 *   `operation` (`source`, `method`, `path`, `params` [{ name, in, arg?, contentType? }],
 *   `security`).
 */
export function buildMcpManifest(spec, options = {}) {
  const src = spec && typeof spec === "object" ? spec : {};
  const processed = isProcessedSpec(src);
  const { includeInternal = false, includeDeprecated = false } = options;
  const info = src.info || {};
  const title = info.title || "OpenAPI MCP Server";
  const sourceName = toSnakeCase(options.sourceName || "api") || "api";
  const securitySchemes = collectSecuritySchemes(src, processed);
  // Header, query and cookie parameters that carry a credential are the runtime's business
  const credentialParams = new Set(
    Object.values(securitySchemes)
      .filter((s) => s.type === "apiKey" && s.name)
      .map((s) => `${s.in || "header"}:${String(s.name).toLowerCase()}`),
  );

  const tools = [];
  const resources = [];
  const usedNames = new Map();

  for (const op of collectOperations(src, processed)) {
    if (op.isWebhook) continue;
    if (op.internal && !includeInternal) continue;
    if (op.deprecated && !includeDeprecated) continue;

    const properties = {};
    const required = [];
    const params = [];
    for (const p of op.parameters) {
      if (!p?.name) continue;
      const where = p.in || "query";
      const lower = String(p.name).toLowerCase();
      if (where === "header" && AUTH_TRANSPORT_HEADERS.has(lower)) continue;
      if (credentialParams.has(`${where}:${lower}`)) continue;
      if (where === "body") {
        // Swagger 2.0 body parameter
        const schema = parameterSchema(p, src);
        if (p.description) schema.description = sanitizeDescription(p.description);
        properties.body = schema;
        if (p.required) required.push("body");
        params.push({ name: "body", in: "body", contentType: "application/json" });
        continue;
      }
      if (where === "formData") continue;
      let arg = p.name;
      if (arg in properties) arg = `${p.name}_${where}`;
      const schema = parameterSchema(p, src);
      if (p.description) schema.description = sanitizeDescription(p.description);
      properties[arg] = schema;
      if (p.required || where === "path") required.push(arg);
      params.push(arg === p.name ? { name: p.name, in: where } : { name: p.name, in: where, arg });
    }
    const body = bodyContent(op.requestBody);
    if (body) {
      const schema = body.schema ? toJsonSchema(body.schema, src) : { type: "object" };
      if (op.requestBody.description) {
        schema.description = sanitizeDescription(op.requestBody.description);
      }
      properties.body = schema;
      if (op.requestBody.required) required.push("body");
      params.push({ name: "body", in: "body", contentType: body.contentType });
    }
    const inputSchema = { type: "object", properties };
    if (required.length) inputSchema.required = required;

    let name = toSnakeCase(op.operationId || deriveToolName(op.method, op.path));
    const seen = usedNames.get(name) || 0;
    usedNames.set(name, seen + 1);
    if (seen) name = `${name}_${seen + 1}`;

    const description = sanitizeDescription(
      op.summary || op.description || `${op.method.toUpperCase()} ${op.path}`,
    );
    const operation = {
      source: sourceName,
      method: op.method.toUpperCase(),
      path: op.path,
      params,
      security: Array.isArray(op.security)
        ? op.security.filter((s) => s && typeof s === "object")
        : [],
    };
    const isGet = op.method === "get";
    const isResource =
      isGet && !required.length && RESOURCE_PATH_HINTS.some((hint) => op.path.includes(hint));
    if (isResource) {
      resources.push({
        name,
        uri: `reference://${name.replace(/^get_/, "").replace(/_/g, "-")}`,
        description,
        mimeType: "application/json",
        operation,
      });
      continue;
    }
    tools.push({
      name,
      description,
      inputSchema,
      annotations: {
        readOnlyHint: isGet,
        // POST adds; PUT, PATCH and DELETE change or remove what is there
        destructiveHint: ["put", "patch", "delete"].includes(op.method),
        idempotentHint: ["get", "put", "delete"].includes(op.method),
      },
      operation,
    });
  }

  return {
    manifestVersion: MANIFEST_VERSION,
    server: {
      name: toSnakeCase(options.serverName || title),
      version: info.version || "1.0.0",
      description: sanitizeDescription(info.description || ""),
    },
    sources: { [sourceName]: { baseUrl: baseUrlOf(src, processed), securitySchemes } },
    tools,
    resources,
    workflows: {},
  };
}
