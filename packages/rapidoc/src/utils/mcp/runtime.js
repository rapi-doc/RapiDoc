/**
 * RapiDoc MCP runtime: executes the operation tools of an MCP manifest (see manifest.js) with
 * `fetch`, so the same code runs in Node, browsers and edge workers. Workflow tools are run by
 * workflow-runtime.js, plugged in through the `runWorkflow` option, so pages and exports without
 * workflows carry no Arazzo code.
 *
 * This file is copied verbatim into every exported MCP server project as `runtime.js`, so it
 * imports nothing and relies only on `fetch`, `URLSearchParams`, `TextEncoder` and `btoa`.
 */

/** @param {string} text UTF-8 text as base64 */
function base64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function serialize(value) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") return JSON.stringify(value);
  return String(value);
}

// RFC 3986 reserved characters a query value with allowReserved keeps as they are, all but "#",
// which would end the URL's query (encodeURIComponent already leaves ! ' ( ) * alone)
const RESERVED_ESCAPES = /%(3A|2F|3F|5B|5D|40|24|26|2B|2C|3B|3D)/gi;

/** A query value percent-encoded except for the reserved characters (OpenAPI `allowReserved`). */
function encodeAllowReserved(value) {
  return encodeURIComponent(value).replace(RESERVED_ESCAPES, (m) => decodeURIComponent(m));
}

/** The host (with port) of an absolute http or https URL, lower-case, or "" for anything else. */
function httpHost(url) {
  try {
    const u = new URL(String(url));
    return u.protocol === "http:" || u.protocol === "https:" ? u.host.toLowerCase() : "";
  } catch {
    return "";
  }
}

/**
 * The hosts a workflow names: its sources' base URLs (the manifest's and `baseUrls`) and the
 * x-operation URLs written out in its steps. A URL computed at run time may go only to these,
 * unless the runtime's `externalHosts` allows more.
 */
function knownHosts(manifest, baseUrls = {}) {
  const hosts = new Set();
  const add = (url) => {
    const host = httpHost(url);
    if (host) hosts.add(host);
  };
  for (const source of Object.values(manifest.sources || {})) add(source?.baseUrl);
  for (const url of Object.values(baseUrls)) add(url);
  for (const workflow of Object.values(manifest.workflows || {})) {
    for (const step of workflow?.steps || []) {
      const url = step?.operation?.url;
      if (url && !String(url).includes("$")) add(url);
    }
  }
  return hosts;
}

/**
 * The URL an x-operation step calls, checked: absolute http or https, and, when it was computed
 * from expressions (an input, a response), on a host the workflow names or `externalHosts` lists
 * (`"*"` for any). Otherwise an MCP server would fetch whatever URL an agent or an API hands it.
 */
function externalUrl(manifest, operation, options) {
  const url = String(options.url ?? operation.url);
  const host = httpHost(url);
  if (!host) throw new Error(`x-operation URL "${url}" is not an absolute http or https URL`);
  if (!String(operation.url).includes("$")) return url;
  const allowed = (options.externalHosts || []).map((h) => String(h).toLowerCase());
  if (allowed.includes("*") || allowed.includes(host) || allowed.includes(new URL(url).hostname)) {
    return url;
  }
  if ((options.knownHosts || knownHosts(manifest, options.baseUrls)).has(host)) return url;
  throw new Error(
    `x-operation URL host ${host} is not allowed: a URL computed at run time may only go to a host the workflow names, unless the runtime's externalHosts lists it`,
  );
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

/** The environment variable name that holds a scheme's credential: `petstore_auth` → `PETSTORE_AUTH`. */
export function envNameFor(schemeId) {
  const name = String(schemeId || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .toUpperCase();
  return name || "API_KEY";
}

/**
 * Credentials for every security scheme in the manifest, read from environment variables:
 * `<SCHEME>` (the scheme id in upper snake case). `API_KEY` is a fallback only when the manifest
 * has one scheme: with several, one key would be sent as every scheme's credential. HTTP Basic takes
 * `<SCHEME>` as `user:password`, or `<SCHEME>_USERNAME` and `<SCHEME>_PASSWORD`.
 *
 * @param {object} manifest
 * @param {Record<string, string|undefined>} env such as `process.env`
 * @returns {Record<string, string|{ username: string, password: string }>}
 */
export function credentialsFromEnv(manifest, env = {}) {
  const credentials = {};
  const schemeIds = new Set(
    Object.values(manifest.sources || {}).flatMap((s) => Object.keys(s.securitySchemes || {})),
  );
  const fallback = schemeIds.size === 1 ? env.API_KEY : undefined;
  for (const source of Object.values(manifest.sources || {})) {
    for (const [id, scheme] of Object.entries(source.securitySchemes || {})) {
      const key = envNameFor(id);
      if (scheme.type === "http" && String(scheme.scheme).toLowerCase() === "basic") {
        if (env[`${key}_USERNAME`] !== undefined) {
          credentials[id] = {
            username: env[`${key}_USERNAME`],
            password: env[`${key}_PASSWORD`] || "",
          };
          continue;
        }
      }
      const value = env[key] ?? fallback;
      if (value !== undefined && value !== "") credentials[id] = value;
    }
  }
  return credentials;
}

/** Sets a header, replacing one of the same name in any case. */
function setHeader(headers, name, value) {
  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === name.toLowerCase()) delete headers[key];
  }
  headers[name] = value;
}

/**
 * Sends one credential the way its scheme says: an API key in its header, query parameter or
 * cookie, HTTP Basic from "user:password" or `{ username, password }`, and a bearer token for
 * http bearer, oauth2 and openIdConnect. A later credential for the same place replaces an earlier one.
 */
function applyCredential(scheme, credential, target) {
  const token =
    typeof credential === "string" ? credential : credential?.token || credential?.accessToken;
  if (scheme.type === "apiKey") {
    const value = serialize(credential);
    if (scheme.in === "query") target.query.set(scheme.name, value);
    else if (scheme.in === "cookie") {
      const prefix = `${scheme.name}=`;
      const kept = target.cookies.filter((c) => !c.startsWith(prefix));
      target.cookies.splice(0, target.cookies.length, ...kept, prefix + encodeURIComponent(value));
    } else setHeader(target.headers, scheme.name || "Authorization", value);
  } else if (scheme.type === "http" && String(scheme.scheme).toLowerCase() === "basic") {
    const pair =
      typeof credential === "string"
        ? credential
        : `${credential?.username ?? ""}:${credential?.password ?? ""}`;
    setHeader(target.headers, "Authorization", `Basic ${base64(pair)}`);
  } else if (token) {
    setHeader(target.headers, "Authorization", `Bearer ${serialize(token)}`);
  }
}

/**
 * The hosts `EXTERNAL_HOSTS` lists (comma-separated; `*` for any), as createMcpRuntime's
 * `externalHosts`: where a workflow's x-operation URL computed at run time may go besides the
 * hosts the workflow names. Every server that runs workflows reads the same variable.
 *
 * @param {Record<string, string|undefined>} env such as `process.env`
 * @returns {string[]}
 */
export function externalHostsFromEnv(env = {}) {
  return String(env.EXTERNAL_HOSTS || "")
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean);
}

/**
 * Adds the credentials a security requirement asks for. `security` is a list of alternatives,
 * each `{ schemeId: scopes }`; the first alternative every credential of which is known is used.
 * With none fully known, nothing is sent when an alternative is empty (anonymous access), else
 * the first alternative is applied as far as credentials go, so the API's 401 says what is missing.
 */
function applySecurity(security, schemes, credentials, target) {
  if (!Array.isArray(security) || !security.length) return;
  const known = (alt) => Object.keys(alt).every((id) => credentials[id] !== undefined);
  let chosen = security.find(known);
  if (!chosen) {
    if (security.some((alt) => !Object.keys(alt).length)) return;
    chosen = security[0];
  }
  for (const id of Object.keys(chosen)) {
    const scheme = schemes?.[id];
    const credential = credentials[id];
    if (scheme && credential !== undefined) applyCredential(scheme, credential, target);
  }
}

/**
 * Adds a workflow step's `x-security` credentials, after the operation's own, in order: where
 * two set the same header, query parameter or cookie, the later one wins. Each entry is
 * `{ scheme, values }` with its values filled in (`apiKey`, `username` and `password`, or
 * `token`); an entry whose values are missing (an input not given) sends nothing.
 */
function applyStepSecurity(entries, target) {
  const given = (v) => v !== undefined && v !== null && v !== "";
  for (const { scheme, values = {} } of entries || []) {
    if (!scheme) continue;
    let credential;
    if (scheme.type === "apiKey") credential = values.apiKey;
    else if (scheme.type === "http" && String(scheme.scheme).toLowerCase() === "basic") {
      if (given(values.username) || given(values.password)) {
        credential = {
          username: serialize(values.username ?? ""),
          password: serialize(values.password ?? ""),
        };
      }
    } else credential = given(values.token) ? values.token : values.accessToken;
    if (given(credential)) applyCredential(scheme, credential, target);
  }
}

/**
 * The HTTP request a tool call makes, without sending it.
 *
 * @param {object} manifest
 * @param {object} operation a tool's or resource's `operation`
 * @param {object} args the tool arguments
 * @param {object} [options]
 * @param {object} [options.credentials] by security scheme id
 * @param {Record<string, string>} [options.baseUrls] by source name, overriding the manifest
 * @param {string} [options.url] an x-operation step's URL with its expressions filled in
 * @param {string[]} [options.externalHosts] hosts an x-operation URL computed at run time may go
 *   to besides those the workflow names; `"*"` allows any
 * @param {object[]} [options.security] a workflow step's `x-security` credentials, values filled
 *   in (`{ scheme, values }`), sent after the operation's own
 * @returns {{ url: string, method: string, headers: Record<string, string>, body?: string }}
 */
export function buildRequest(manifest, operation, args = {}, options = {}) {
  const source = manifest.sources?.[operation.source] || {};
  // An x-operation step names its own URL, no source
  const base = operation.url
    ? ""
    : String(options.baseUrls?.[operation.source] || source.baseUrl || "").replace(/\/$/, "");
  const headers = {};
  const query = new URLSearchParams();
  // Query parameters with allowReserved, as "name=value" pairs: URLSearchParams would encode them
  const reservedQuery = [];
  const cookies = [];
  let path = operation.url ? externalUrl(manifest, operation, options) : operation.path || "";
  let body;
  for (const p of operation.params || []) {
    const value = args[p.arg || p.name];
    if (value === undefined || value === null) continue;
    if (p.in === "path") {
      const segment = serialize(value);
      // Percent-encoding keeps "/" inside the segment, but "." and ".." are dot segments that URL
      // parsing resolves: "/orders/../items" would call "/items"
      if (segment === "." || segment === "..") {
        throw new Error(`Path parameter ${p.name} can't be "${segment}"`);
      }
      path = path.split(`{${p.name}}`).join(encodeURIComponent(segment));
    } else if (p.in === "query") {
      for (const v of Array.isArray(value) ? value : [value]) {
        if (p.allowReserved) {
          reservedQuery.push(`${encodeURIComponent(p.name)}=${encodeAllowReserved(serialize(v))}`);
        } else query.append(p.name, serialize(v));
      }
    } else if (p.in === "header") {
      headers[p.name] = serialize(value);
    } else if (p.in === "cookie") {
      cookies.push(`${p.name}=${encodeURIComponent(serialize(value))}`);
    } else if (p.in === "body") {
      body = { contentType: p.contentType || "application/json", value };
    }
  }
  const missing = path.match(/\{[^}]+\}/g);
  if (missing) throw new Error(`Missing path parameter ${missing.join(", ")}`);

  const target = { headers, query, cookies };
  applySecurity(operation.security, source.securitySchemes, options.credentials || {}, target);
  applyStepSecurity(options.security, target);

  const request = { url: base + path, method: operation.method || "GET", headers };
  const qs = [query.toString(), ...reservedQuery].filter(Boolean).join("&");
  if (qs) request.url += (request.url.includes("?") ? "&" : "?") + qs;
  if (cookies.length) headers.Cookie = cookies.join("; ");
  if (!Object.keys(headers).some((h) => h.toLowerCase() === "accept")) {
    headers.Accept = "application/json";
  }
  if (body) {
    if (body.contentType === "application/x-www-form-urlencoded") {
      const form = new URLSearchParams();
      for (const [k, v] of Object.entries(body.value || {})) form.append(k, serialize(v));
      request.body = form.toString();
      headers["Content-Type"] = body.contentType;
    } else {
      request.body = typeof body.value === "string" ? body.value : JSON.stringify(body.value);
      headers["Content-Type"] = body.contentType.startsWith("multipart/")
        ? "application/json"
        : body.contentType;
    }
  }
  return request;
}

function errorResult(text) {
  return { isError: true, content: [{ type: "text", text }] };
}

/**
 * @param {object} manifest from buildMcpManifest()
 * @param {object} [options]
 * @param {typeof fetch} [options.fetch] defaults to the global fetch
 * @param {object} [options.credentials] by security scheme id: an API key or token string, or
 *   `{ username, password }` for HTTP Basic
 * @param {Record<string, string>} [options.baseUrls] by source name, overriding the manifest
 * @param {string[]} [options.externalHosts] hosts a workflow's x-operation URL computed at run
 *   time (from an input or a response) may go to, besides the hosts the workflow names (its
 *   sources' and its written-out x-operation URLs'); `["*"]` allows any, as in a browser page
 * @param {Function} [options.runWorkflow] `(runtime, tool, args, hooks) => Promise<result>` from
 *   workflow-runtime.js; without it a workflow tool answers with an error result
 * @returns {{ manifest: object, listTools(): object[], listResources(): object[],
 *   callTool(name: string, args?: object, hooks?: object): Promise<object>,
 *   readResource(uri: string): Promise<object>, execute(operation: object, args: object,
 *   extra?: { headers?: object, security?: object[], url?: string }): Promise<object> }} MCP results: `callTool` returns `{ content, structuredContent?,
 *   isError? }`, `readResource` returns `{ contents }`. `execute` sends one operation and returns
 *   `{ request, response, headers, text, data }` or `{ request?, error }`, for workflow runners.
 */
export function createMcpRuntime(manifest, options = {}) {
  const fetchImpl = options.fetch || globalThis.fetch;
  const requestOptions = {
    credentials: options.credentials || {},
    baseUrls: options.baseUrls || {},
    externalHosts: options.externalHosts || [],
    knownHosts: knownHosts(manifest, options.baseUrls),
  };
  const tools = new Map((manifest.tools || []).map((t) => [t.name, t]));
  const resources = new Map((manifest.resources || []).map((r) => [r.uri, r]));

  async function send(operation, args, extra = {}) {
    let request;
    try {
      request = buildRequest(manifest, operation, args, {
        ...requestOptions,
        security: extra.security,
        url: extra.url,
      });
      if (extra.headers) request.headers = { ...request.headers, ...extra.headers };
    } catch (err) {
      return { error: errorResult(err.message) };
    }
    let response;
    try {
      response = await fetchImpl(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });
    } catch (err) {
      return { request, error: errorResult(`Request failed: ${err.message}`) };
    }
    const text = await response.text();
    const headers = {};
    if (typeof response.headers?.forEach === "function") {
      response.headers.forEach((v, k) => (headers[k] = v));
    }
    return { request, response, headers, text, data: parseJson(text) };
  }

  const runtime = {
    manifest,
    execute: send,
    listTools() {
      return [...tools.values()].map(({ name, description, inputSchema, annotations }) => ({
        name,
        description,
        inputSchema,
        annotations,
      }));
    },
    listResources() {
      return [...resources.values()].map(({ name, uri, description, mimeType }) => ({
        name,
        uri,
        description,
        mimeType,
      }));
    },
    async callTool(name, args = {}, hooks = {}) {
      const tool = tools.get(name);
      if (!tool) return errorResult(`Unknown tool "${name}"`);
      if (tool.workflow) {
        if (!options.runWorkflow) {
          return errorResult(
            `Tool "${name}" is a workflow; this runtime was created without workflow support`,
          );
        }
        return options.runWorkflow(runtime, tool, args, hooks);
      }
      if (!tool.operation) return errorResult(`Tool "${name}" has nothing to run`);
      const { error, response, text, data } = await send(tool.operation, args || {});
      if (error) return error;
      const pretty = data === undefined ? text : JSON.stringify(data, null, 2);
      if (!response.ok) {
        return errorResult(
          `HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ""}\n${pretty}`,
        );
      }
      const result = { content: [{ type: "text", text: pretty }] };
      if (data && typeof data === "object" && !Array.isArray(data)) result.structuredContent = data;
      return result;
    },
    async readResource(uri) {
      const resource = resources.get(uri);
      if (!resource) throw new Error(`Unknown resource "${uri}"`);
      const { error, response, text } = await send(resource.operation, {});
      if (error) throw new Error(error.content[0].text);
      if (!response.ok) throw new Error(`HTTP ${response.status} reading ${uri}: ${text}`);
      return { contents: [{ uri, mimeType: resource.mimeType || "application/json", text }] };
    },
  };
  return runtime;
}
