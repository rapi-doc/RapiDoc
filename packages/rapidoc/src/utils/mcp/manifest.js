/**
 * Builds the MCP manifest: a plain JSON description of an API's tools that a runtime executes.
 * Pure, no dependencies; takes a raw OpenAPI 3.x / Swagger 2.0 object or the result of
 * `ProcessSpec` (`tags[].paths[]`).
 */
import {
  AUTH_TRANSPORT_HEADERS,
  assignToolNames,
  destructiveHintFor,
  operationToolName,
  sanitizeDescription,
  toSnakeCase,
} from "./common.js";
import { MANIFEST_VERSION, baseUrlEnvNames, credentialEnvNames } from "./runtime.js";
import { resolvePointer, toJsonSchema } from "./schema.js";
import { compileWorkflows } from "./workflows.js";
import { indexOperations, indexResolvedSpec } from "../arazzo/operations.js";

export { toJsonSchema, MANIFEST_VERSION };

const METHODS = ["get", "put", "post", "delete", "options", "head", "patch", "trace", "query"];
const SECURITY_KEYS = [
  "type",
  "description",
  "in",
  "name",
  "scheme",
  "bearerFormat",
  "openIdConnectUrl",
];

function isProcessedSpec(spec) {
  return (
    "specLoadError" in spec ||
    (Array.isArray(spec.tags) && spec.tags.some((t) => Array.isArray(t?.paths)))
  );
}

/**
 * Follows a `#/...` $ref within `spec` (a few hops, for refs to refs); anything else is returned as is.
 * A raw spec keeps its parameters, request bodies and path items as $refs to components; a processed
 * one (`<rapi-doc>`'s resolvedSpec) is already dereferenced.
 */
function follow(node, spec) {
  for (
    let hops = 0;
    hops < 10 && typeof node?.$ref === "string" && node.$ref.startsWith("#/");
    hops++
  ) {
    let target = spec;
    for (const segment of node.$ref.slice(2).split("/")) {
      const key = decodeURIComponent(segment).replace(/~1/g, "/").replace(/~0/g, "~");
      target = target?.[key];
    }
    if (!target || typeof target !== "object") return node;
    node = target;
  }
  return node;
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
          resource: p.rawOperation?.["x-mcp-resource"],
          parameters: Array.isArray(p.parameters) ? p.parameters : [],
          requestBody: p.requestBody || null,
          security: p.security,
          tag: tag.name || "",
        });
      }
    }
    return operations;
  }
  const params = (list) => (Array.isArray(list) ? list.map((p) => follow(p, spec)) : []);
  for (const [path, rawItem] of Object.entries(spec.paths || {})) {
    const item = follow(rawItem, spec);
    if (!item || typeof item !== "object") continue;
    const common = params(item.parameters);
    for (const method of METHODS) {
      const op = item[method];
      if (!op || typeof op !== "object") continue;
      const own = params(op.parameters);
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
        resource: op["x-mcp-resource"],
        parameters,
        requestBody: follow(op.requestBody, spec) || null,
        // Swagger 2.0: the media types a body or form is sent as
        consumes: Array.isArray(op.consumes) ? op.consumes : spec.consumes,
        security: op.security ?? spec.security,
        tag: Array.isArray(op.tags) ? op.tags[0] || "" : "",
      });
    }
  }
  return operations;
}

// Swagger 2.0 OAuth 2 `flow` names as OpenAPI 3 `flows` keys
const SWAGGER_FLOWS = {
  implicit: "implicit",
  password: "password",
  application: "clientCredentials",
  accessCode: "authorizationCode",
};

/**
 * A Swagger 2.0 security definition as an OpenAPI 3 security scheme: `type: basic` is HTTP Basic
 * (not a bearer token), and OAuth 2's `flow` becomes `flows`. An OpenAPI 3 scheme is returned as is.
 */
function normalizeScheme(scheme) {
  if (scheme.type === "basic") return { ...scheme, type: "http", scheme: "basic" };
  if (scheme.type === "oauth2" && !scheme.flows && scheme.flow) {
    const flow = {};
    for (const key of ["authorizationUrl", "tokenUrl", "scopes"]) {
      if (scheme[key] !== undefined) flow[key] = scheme[key];
    }
    return { ...scheme, flows: { [SWAGGER_FLOWS[scheme.flow] || scheme.flow]: flow } };
  }
  return scheme;
}

/** The spec's security schemes as `{ id: { type, in, name, scheme, ... } }`, from either shape. */
function collectSecuritySchemes(spec, processed) {
  const out = {};
  const add = (id, raw) => {
    if (!raw || typeof raw !== "object" || !raw.type) return;
    const scheme = normalizeScheme(raw);
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

const isHttpUrl = (url) => /^https?:\/\//i.test(String(url || ""));

/**
 * The API's base URL, absolute, or undefined when the document does not say where the API is.
 * The first server's URL with its variables' defaults (Swagger 2.0: `schemes`, `host` and
 * `basePath`); a relative one (`/api/v1`), or none at all (OpenAPI's default server is `/`), is
 * resolved against `specUrl`, the address the document was loaded from, else against the page's
 * address in a browser, as `<rapi-doc>` does. Without either it stays unset: the runtime then
 * needs a base URL (`baseUrls`, `MCP_BASE_URL`) and refuses to guess one.
 */
function baseUrlOf(spec, processed, specUrl) {
  const server = spec.servers?.[0];
  let url = "";
  if (server?.url) {
    url = String(server.url).trim();
    for (const [name, v] of Object.entries(server.variables || {})) {
      url = url.split(`{${name}}`).join(String(v?.default ?? v?.enum?.[0] ?? ""));
    }
  } else if (!processed && spec.host) {
    const scheme =
      spec.schemes?.[0] || (isHttpUrl(specUrl) ? new URL(specUrl).protocol.slice(0, -1) : "https");
    url = `${scheme}://${spec.host}${spec.basePath || ""}`;
  } else if (!processed && spec.basePath) {
    url = String(spec.basePath);
  }
  if (isHttpUrl(url)) return url;
  const page = globalThis.location?.href;
  const from = isHttpUrl(specUrl) ? specUrl : isHttpUrl(page) ? page : "";
  if (!from) return undefined;
  try {
    const resolved = new URL(url || "/", from).href;
    return isHttpUrl(resolved) ? resolved.replace(/\/$/, "") : undefined;
  } catch {
    return undefined;
  }
}

/** One source of the manifest; `baseUrl` is left out when the document gives none. */
function sourceOf(spec, processed, specUrl) {
  const baseUrl = baseUrlOf(spec, processed, specUrl);
  return {
    ...(baseUrl && { baseUrl }),
    securitySchemes: collectSecuritySchemes(spec, processed),
  };
}

/**
 * Throws when two things of the manifest would read the same environment variable: two security
 * schemes (`api-key` and `apiKey` are both `MCP_AUTH_API_KEY`; a Basic scheme `x` and a scheme
 * `x_username`), or two sources (`MCP_BASE_URL_<SOURCE>`). Sharing a variable silently would send
 * one scheme's credential as another's.
 */
function checkEnvNames(sources) {
  const manifest = { sources };
  const owner = new Map();
  const claim = (variable, what) => {
    const other = owner.get(variable);
    if (other && other !== what) {
      throw new Error(
        `${other} and ${what} would both read the environment variable ${variable}: rename one of them in the OpenAPI document`,
      );
    }
    owner.set(variable, what);
  };
  for (const [id, names] of Object.entries(credentialEnvNames(manifest))) {
    for (const variable of names) claim(variable, `security scheme "${id}"`);
  }
  owner.clear();
  for (const [name, variable] of Object.entries(baseUrlEnvNames(manifest))) {
    claim(variable, `source "${name}"`);
  }
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
 * @param {object|string} [options.arazzo] a parsed Arazzo document (or JSON text) whose workflows
 *   become tools; its first OpenAPI source description is this API
 * @param {(problem: { level: string, path: string, message: string }) => void} [options.onProblem]
 *   receives one entry per workflow the runtime cannot run, which is left out
 * @param {string} [options.sourceName] the key of the API in `sources`: the Arazzo document's
 *   first OpenAPI source name, else `api`
 * @param {Record<string, object>} [options.sources] the other OpenAPI documents the Arazzo
 *   document's workflows use, by source description name; each becomes a manifest source and its
 *   operations resolve for workflow steps
 * @param {string} [options.specUrl] the http(s) address the document was loaded from: a relative
 *   server URL (or none) is resolved against it. Without it (a file, an object) such a document
 *   gives a source with no `baseUrl`, and the runtime needs one (`baseUrls`, `MCP_BASE_URL`)
 * @param {Record<string, string>} [options.sourceUrls] the same for `options.sources`, by name
 * @param {string} [options.toolNamePrefix] put in front of every tool name (a portal's
 *   `<api id>_`), before names are cut to 64 characters and made unique
 * @param {boolean} [options.includeInternal] keep `x-internal` / `x-hidden` operations
 * @param {boolean} [options.includeDeprecated] keep deprecated operations
 * @param {boolean} [options.includeOperations] `false` leaves the operations out: a manifest of the
 *   Arazzo document's workflow tools alone (the sources stay, the runtime needs them)
 * @throws {Error} when two security schemes (or two sources) would read the same environment
 *   variable, such as `api-key` and `apiKey`
 * @returns {object} the manifest: `{ manifestVersion, server, sources, tools, resources,
 *   workflows }`. A workflow tool has `workflow` (its id in `workflows`) instead of `operation`. Each tool has `name`, `description`, `inputSchema` (JSON Schema; parameters by
 *   name plus `body`), `annotations` (`readOnlyHint`, `destructiveHint`, `idempotentHint`) and
 *   `operation` (`source`, `method`, `path`, `params` [{ name, in, arg?, contentType? }],
 *   `security`).
 */
export function buildMcpManifest(spec, options = {}) {
  const src = spec && typeof spec === "object" ? spec : {};
  const processed = isProcessedSpec(src);
  const { includeInternal = false, includeDeprecated = false, includeOperations = true } = options;
  const info = src.info || {};
  const title = info.title || "OpenAPI MCP Server";
  const arazzo = typeof options.arazzo === "string" ? JSON.parse(options.arazzo) : options.arazzo;
  const firstSource = (arazzo?.sourceDescriptions || []).find(
    (s) => s?.name && (!s.type || s.type === "openapi"),
  );
  const sourceName = options.sourceName || firstSource?.name || "api";
  const securitySchemes = collectSecuritySchemes(src, processed);
  // Header, query and cookie parameters that carry a credential are the runtime's business
  const credentialParams = new Set(
    Object.values(securitySchemes)
      .filter((s) => s.type === "apiKey" && s.name)
      .map((s) => `${s.in || "header"}:${String(s.name).toLowerCase()}`),
  );

  // Operation tools without their names: names are given at the end, over all tools at once
  const drafts = [];
  const seenOperations = new Set();

  for (const op of includeOperations ? collectOperations(src, processed) : []) {
    if (op.isWebhook) continue;
    if (op.internal && !includeInternal) continue;
    if (op.deprecated && !includeDeprecated) continue;
    // <rapi-doc>'s processed spec lists an operation once per tag it has
    const key = `${op.method.toUpperCase()} ${op.path}`;
    if (seenOperations.has(key)) continue;
    seenOperations.add(key);

    const properties = {};
    const required = [];
    const params = [];
    // Swagger 2.0 `in: formData` parameters: the fields of one form body
    const form = { properties: {}, required: [], multipart: false };
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
      if (where === "formData") {
        const isFile = p.type === "file";
        const schema = isFile ? { type: "string" } : parameterSchema(p, src);
        if (p.description) schema.description = sanitizeDescription(p.description);
        form.properties[p.name] = schema;
        if (p.required) form.required.push(p.name);
        if (isFile) form.multipart = true;
        continue;
      }
      let arg = p.name;
      if (arg in properties) arg = `${p.name}_${where}`;
      const schema = parameterSchema(p, src);
      if (p.description) schema.description = sanitizeDescription(p.description);
      properties[arg] = schema;
      if (p.required || where === "path") required.push(arg);
      const param = arg === p.name ? { name: p.name, in: where } : { name: p.name, in: where, arg };
      if (where === "query" && p.allowReserved === true) param.allowReserved = true;
      params.push(param);
    }
    if (Object.keys(form.properties).length && !properties.body) {
      const consumes = (op.consumes || []).map((t) => String(t).toLowerCase());
      const urlencoded = "application/x-www-form-urlencoded";
      const contentType =
        form.multipart ||
        (consumes.includes("multipart/form-data") && !consumes.includes(urlencoded))
          ? "multipart/form-data"
          : urlencoded;
      properties.body = { type: "object", properties: form.properties };
      if (form.required.length) {
        properties.body.required = form.required;
        required.push("body");
      }
      params.push({ name: "body", in: "body", contentType });
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
    drafts.push({
      name: operationToolName(op.operationId, op.method, op.path),
      key,
      // Opt-in only: `x-mcp-resource: true` on a GET that needs no argument. The operation stays
      // a tool as well, since many hosts leave resources for the user to attach.
      resource: op.resource === true && isGet && !required.length,
      tool: {
        description,
        inputSchema,
        annotations: {
          readOnlyHint: isGet,
          ...destructiveHintFor([op.method]),
          idempotentHint: ["get", "put", "delete"].includes(op.method),
        },
        operation,
      },
    });
  }

  const workflows = {};
  const sources = { [sourceName]: sourceOf(src, processed, options.specUrl) };
  if (arazzo && typeof arazzo === "object") {
    const indexes = new Map([
      [sourceName, processed ? indexResolvedSpec(src) : indexOperations(src)],
    ]);
    for (const [name, doc] of Object.entries(options.sources || {})) {
      if (name === sourceName || !doc || typeof doc !== "object") continue;
      const docProcessed = isProcessedSpec(doc);
      indexes.set(name, docProcessed ? indexResolvedSpec(doc) : indexOperations(doc));
      sources[name] = sourceOf(doc, docProcessed, options.sourceUrls?.[name]);
    }
    const compiled = compileWorkflows(arazzo, {
      sources: indexes,
      schemes: Object.fromEntries(
        Object.entries(sources).map(([name, s]) => [name, s.securitySchemes]),
      ),
      onProblem: options.onProblem,
    });
    for (const { name, ...tool } of compiled.tools) {
      drafts.push({ name, key: `workflow ${tool.workflow}`, resource: false, tool });
    }
    Object.assign(workflows, compiled.workflows);
  }
  checkEnvNames(sources);

  const names = assignToolNames(drafts, options.toolNamePrefix || "");
  const tools = [];
  const resources = [];
  drafts.forEach((draft, i) => {
    const name = names[i];
    tools.push({ name, ...draft.tool });
    if (draft.resource) {
      resources.push({
        name,
        uri: `reference://${name.replace(/^get_/, "").replace(/_/g, "-")}`,
        description: draft.tool.description,
        mimeType: "application/json",
        operation: draft.tool.operation,
      });
    }
  });

  return {
    manifestVersion: MANIFEST_VERSION,
    server: {
      name: toSnakeCase(options.serverName || title, "api_mcp_server"),
      version: info.version || "1.0.0",
      description: sanitizeDescription(info.description || ""),
    },
    sources,
    tools,
    resources,
    workflows,
  };
}
