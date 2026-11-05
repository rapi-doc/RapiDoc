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
 * `<SCHEME>` (the scheme id in upper snake case), else `API_KEY` for any scheme. HTTP Basic takes
 * `<SCHEME>` as `user:password`, or `<SCHEME>_USERNAME` and `<SCHEME>_PASSWORD`.
 *
 * @param {object} manifest
 * @param {Record<string, string|undefined>} env such as `process.env`
 * @returns {Record<string, string|{ username: string, password: string }>}
 */
export function credentialsFromEnv(manifest, env = {}) {
  const credentials = {};
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
      const value = env[key] ?? env.API_KEY;
      if (value !== undefined && value !== "") credentials[id] = value;
    }
  }
  return credentials;
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
    if (!scheme || credential === undefined) continue;
    const token =
      typeof credential === "string" ? credential : credential?.token || credential?.accessToken;
    if (scheme.type === "apiKey") {
      const value = serialize(credential);
      if (scheme.in === "query") target.query.set(scheme.name, value);
      else if (scheme.in === "cookie")
        target.cookies.push(`${scheme.name}=${encodeURIComponent(value)}`);
      else target.headers[scheme.name || "Authorization"] = value;
    } else if (scheme.type === "http" && String(scheme.scheme).toLowerCase() === "basic") {
      const pair =
        typeof credential === "string"
          ? credential
          : `${credential?.username ?? ""}:${credential?.password ?? ""}`;
      target.headers.Authorization = `Basic ${base64(pair)}`;
    } else if (token) {
      // http bearer, oauth2 and openIdConnect all send a bearer token
      target.headers.Authorization = `Bearer ${token}`;
    }
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
 * @returns {{ url: string, method: string, headers: Record<string, string>, body?: string }}
 */
export function buildRequest(manifest, operation, args = {}, options = {}) {
  const source = manifest.sources?.[operation.source] || {};
  const base = String(options.baseUrls?.[operation.source] || source.baseUrl || "").replace(
    /\/$/,
    "",
  );
  const headers = {};
  const query = new URLSearchParams();
  const cookies = [];
  let path = operation.path || "";
  let body;
  for (const p of operation.params || []) {
    const value = args[p.arg || p.name];
    if (value === undefined || value === null) continue;
    if (p.in === "path") {
      path = path.split(`{${p.name}}`).join(encodeURIComponent(serialize(value)));
    } else if (p.in === "query") {
      for (const v of Array.isArray(value) ? value : [value]) query.append(p.name, serialize(v));
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

  applySecurity(operation.security, source.securitySchemes, options.credentials || {}, {
    headers,
    query,
    cookies,
  });

  const request = { url: base + path, method: operation.method || "GET", headers };
  const qs = query.toString();
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
 * @param {Function} [options.runWorkflow] `(runtime, tool, args, hooks) => Promise<result>` from
 *   workflow-runtime.js; without it a workflow tool answers with an error result
 * @returns {{ manifest: object, listTools(): object[], listResources(): object[],
 *   callTool(name: string, args?: object, hooks?: object): Promise<object>,
 *   readResource(uri: string): Promise<object>, execute(operation: object, args: object):
 *   Promise<object> }} MCP results: `callTool` returns `{ content, structuredContent?,
 *   isError? }`, `readResource` returns `{ contents }`. `execute` sends one operation and returns
 *   `{ request, response, headers, text, data }` or `{ request?, error }`, for workflow runners.
 */
export function createMcpRuntime(manifest, options = {}) {
  const fetchImpl = options.fetch || globalThis.fetch;
  const requestOptions = {
    credentials: options.credentials || {},
    baseUrls: options.baseUrls || {},
  };
  const tools = new Map((manifest.tools || []).map((t) => [t.name, t]));
  const resources = new Map((manifest.resources || []).map((r) => [r.uri, r]));

  async function send(operation, args) {
    let request;
    try {
      request = buildRequest(manifest, operation, args, requestOptions);
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
