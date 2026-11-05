/**
 * RapiDoc MCP runtime: executes the tools of an MCP manifest (see manifest.js) with `fetch`, so
 * the same code runs in Node, browsers and edge workers. Operation tools make one request;
 * workflow tools run the compiled Arazzo steps (see workflows.js): expressions, success
 * criteria, success and failure actions (end, goto, retry) and outputs.
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

// ---- Arazzo runtime expressions ----

/** RFC 6901 JSON pointer lookup; "" is the whole value. */
function pointer(value, path) {
  if (!path) return value;
  let node = value;
  for (const raw of path.split("/").slice(1)) {
    const key = raw.replace(/~1/g, "/").replace(/~0/g, "~");
    if (node === null || typeof node !== "object") return undefined;
    node = node[key];
  }
  return node;
}

function walk(value, keys) {
  let node = value;
  for (const key of keys) {
    if (node === null || typeof node !== "object") return undefined;
    node = node[key];
  }
  return node;
}

/**
 * One Arazzo runtime expression against the step context: `$inputs.x`, `$steps.id.outputs.x`,
 * `$statusCode`, `$response.body` (`#/pointer`), `$response.header.Name`, `$request.body`,
 * `$request.header.Name`, `$url`, `$method`.
 */
export function evaluateExpression(expr, ctx) {
  const m = String(expr).match(/^\$([A-Za-z]+)((?:\.[^.#\s]+)*)(?:#(.*))?$/);
  if (!m) return undefined;
  const [, root, dotted, ptr] = m;
  const keys = dotted ? dotted.slice(1).split(".") : [];
  switch (root) {
    case "inputs":
      return walk(ctx.inputs || {}, keys);
    case "steps":
      return walk(ctx.steps || {}, keys);
    case "statusCode":
      return ctx.response?.status;
    case "url":
      return ctx.request?.url;
    case "method":
      return ctx.request?.method;
    case "response":
    case "request": {
      const msg = ctx[root];
      if (!msg) return undefined;
      const [part, ...rest] = keys;
      if (part === "body") return walk(pointer(msg.body, ptr || ""), rest);
      if (part === "header" || part === "headers") {
        const name = rest.join(".").toLowerCase();
        const headers = msg.headers || {};
        const hit = Object.keys(headers).find((h) => h.toLowerCase() === name);
        return hit === undefined ? undefined : headers[hit];
      }
      if (part === "query" || part === "path") return walk(msg[part] || {}, rest);
      return undefined;
    }
    default:
      return undefined;
  }
}

const WHOLE_EXPRESSION = /^\$[A-Za-z][^\s{}]*$/;

/** A parameter or payload value with its expressions filled in; `{$expr}` inside text is interpolated. */
export function resolveValue(value, ctx) {
  if (typeof value === "string") {
    if (WHOLE_EXPRESSION.test(value)) return evaluateExpression(value, ctx);
    return value.replace(/\{(\$[^{}]+)\}/g, (_, expr) => {
      const v = evaluateExpression(expr, ctx);
      return v === undefined || v === null ? "" : serialize(v);
    });
  }
  if (Array.isArray(value)) return value.map((v) => resolveValue(v, ctx));
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = resolveValue(v, ctx);
    return out;
  }
  return value;
}

// ---- Simple conditions: `$statusCode == 200 && $response.body#/status != 'placed'` ----

function tokenize(condition) {
  const tokens = [];
  const re =
    /\s*(?:(&&|\|\||==|!=|<=|>=|<|>|!|\(|\))|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(-?\d+(?:\.\d+)?)|(\$[^\s()&|=!<>]+)|(true|false|null))/y;
  let last = 0;
  for (;;) {
    re.lastIndex = last;
    const m = re.exec(condition);
    if (!m) break;
    last = re.lastIndex;
    if (m[1]) tokens.push({ op: m[1] });
    else if (m[2]) tokens.push({ value: m[2].slice(1, -1).replace(/\\(.)/g, "$1") });
    else if (m[3]) tokens.push({ value: Number(m[3]) });
    else if (m[4]) tokens.push({ expr: m[4] });
    else if (m[5]) tokens.push({ value: m[5] === "true" ? true : m[5] === "false" ? false : null });
  }
  if (condition.slice(last).trim()) throw new Error(`Cannot parse condition "${condition}"`);
  return tokens;
}

/** `==` in a simple condition: null and a missing value are the same; numbers and strings compare as text. */
function looseEquals(a, b) {
  if (a === b) return true;
  const missing = (v) => v === null || v === undefined;
  if (missing(a) || missing(b)) return missing(a) && missing(b);
  if (typeof a === "object" || typeof b === "object")
    return JSON.stringify(a) === JSON.stringify(b);
  return String(a) === String(b);
}

/** Evaluates a simple Arazzo condition. Throws when it cannot be parsed. */
export function evaluateCondition(condition, ctx) {
  const tokens = tokenize(condition);
  let i = 0;
  const peek = () => tokens[i];
  const takeOp = (...ops) => (peek()?.op && ops.includes(peek().op) ? tokens[i++].op : null);
  const unary = () => {
    if (takeOp("!")) return !unary();
    if (takeOp("(")) {
      const v = or();
      if (!takeOp(")")) throw new Error(`Missing ) in "${condition}"`);
      return v;
    }
    const t = tokens[i++];
    if (!t || t.op) throw new Error(`Unexpected ${t ? t.op : "end"} in "${condition}"`);
    return t.expr !== undefined ? evaluateExpression(t.expr, ctx) : t.value;
  };
  const cmp = () => {
    const left = unary();
    const op = takeOp("==", "!=", "<=", ">=", "<", ">");
    if (!op) return left;
    const right = unary();
    if (op === "==") return looseEquals(left, right);
    if (op === "!=") return !looseEquals(left, right);
    const [a, b] = [Number(left), Number(right)];
    if (op === "<") return a < b;
    if (op === ">") return a > b;
    if (op === "<=") return a <= b;
    return a >= b;
  };
  const and = () => {
    let v = cmp();
    while (takeOp("&&")) v = cmp() && v;
    return v;
  };
  const or = () => {
    let v = and();
    while (takeOp("||")) v = and() || v;
    return v;
  };
  const result = or();
  if (i < tokens.length) throw new Error(`Unexpected ${tokens[i].op ?? "token"} in "${condition}"`);
  return Boolean(result);
}

function errorResult(text) {
  return { isError: true, content: [{ type: "text", text }] };
}

const MAX_STEP_RUNS = 1000;

/**
 * @param {object} manifest from buildMcpManifest()
 * @param {object} [options]
 * @param {typeof fetch} [options.fetch] defaults to the global fetch
 * @param {object} [options.credentials] by security scheme id: an API key or token string, or
 *   `{ username, password }` for HTTP Basic
 * @param {Record<string, string>} [options.baseUrls] by source name, overriding the manifest
 * @param {(ms: number) => Promise<void>} [options.sleep] waits between retries (tests pass a stub)
 * @returns {{ manifest: object, listTools(): object[], listResources(): object[],
 *   callTool(name: string, args?: object, hooks?: { onStep }): Promise<object>,
 *   readResource(uri: string): Promise<object> }} MCP results: `callTool` returns
 *   `{ content, structuredContent?, isError? }`, `readResource` returns `{ contents }`. For a
 *   workflow tool, `onStep` is called after every step run with `{ workflowId, stepId, attempt,
 *   outcome, request, response, outputs, failedCriterion, action }`.
 */
export function createMcpRuntime(manifest, options = {}) {
  const fetchImpl = options.fetch || globalThis.fetch;
  const sleep = options.sleep || ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
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

  async function runWorkflow(tool, args, hooks = {}) {
    const workflow = manifest.workflows?.[tool.workflow];
    if (!workflow) return errorResult(`Workflow "${tool.workflow}" is not in the manifest`);
    const inputs = args || {};
    const required = (workflow.inputs?.required || []).filter((name) => inputs[name] === undefined);
    if (required.length) return errorResult(`Missing input ${required.join(", ")}`);

    const steps = workflow.steps;
    const indexOf = (stepId) => steps.findIndex((s) => s.stepId === stepId);
    const stepsCtx = {};
    const attempts = new Map();
    let index = 0;
    let runs = 0;
    while (index >= 0 && index < steps.length) {
      if (++runs > MAX_STEP_RUNS) {
        return errorResult(`Workflow ${workflow.workflowId} ran more than ${MAX_STEP_RUNS} steps`);
      }
      const step = steps[index];
      const attempt = (attempts.get(step.stepId) || 0) + 1;
      attempts.set(step.stepId, attempt);
      const ctx = { inputs, steps: stepsCtx };
      const stepArgs = {};
      for (const p of step.parameters || []) stepArgs[p.name] = resolveValue(p.value, ctx);
      if (step.requestBody) {
        let payload = resolveValue(step.requestBody.payload, ctx);
        for (const r of step.requestBody.replacements || []) {
          payload = replaceAt(payload, r.target, resolveValue(r.value, ctx));
        }
        stepArgs.body = payload;
      }
      const sent = await send(step.operation, stepArgs);
      const stepCtx = {
        ...ctx,
        request: sent.request && {
          url: sent.request.url,
          method: sent.request.method,
          headers: sent.request.headers,
          body: stepArgs.body,
        },
        response: sent.response && {
          status: sent.response.status,
          headers: sent.headers,
          body: sent.data === undefined ? sent.text : sent.data,
        },
      };
      let failedCriterion = sent.error ? sent.error.content[0].text : "";
      if (!failedCriterion) {
        for (const c of step.successCriteria || []) {
          let ok;
          try {
            ok = evaluateCondition(c.condition, stepCtx);
          } catch (err) {
            ok = false;
            failedCriterion = err.message;
          }
          if (!ok) {
            failedCriterion ||= c.condition;
            break;
          }
        }
      }
      const outcome = failedCriterion ? "failure" : "success";
      let outputs;
      if (outcome === "success") {
        outputs = {};
        for (const [name, expr] of Object.entries(step.outputs || {})) {
          outputs[name] = resolveValue(expr, stepCtx);
        }
        stepsCtx[step.stepId] = { outputs };
      }
      const candidates = outcome === "success" ? step.onSuccess : step.onFailure;
      const action = (candidates || []).find((a) =>
        (a.criteria || []).every((c) => {
          try {
            return evaluateCondition(c.condition, stepCtx);
          } catch {
            return false;
          }
        }),
      );
      hooks.onStep?.({
        workflowId: workflow.workflowId,
        stepId: step.stepId,
        attempt,
        outcome,
        request: stepCtx.request,
        response: stepCtx.response,
        outputs,
        failedCriterion: failedCriterion || undefined,
        action: action ? { type: action.type, name: action.name, stepId: action.stepId } : null,
      });

      const failure = (why) =>
        errorResult(
          `Workflow ${workflow.workflowId} failed at step ${step.stepId}: ${why}` +
            (stepCtx.response
              ? `\nHTTP ${stepCtx.response.status}\n${serialize(stepCtx.response.body)}`
              : ""),
        );
      if (outcome === "success") {
        if (!action) index++;
        else if (action.type === "end") break;
        else if (action.type === "goto") index = indexOf(action.stepId);
        else index++;
        continue;
      }
      if (!action || action.type === "end") return failure(failedCriterion);
      if (action.type === "goto") {
        index = indexOf(action.stepId);
        continue;
      }
      // retry
      const target = action.stepId ? indexOf(action.stepId) : index;
      const key = `${step.stepId}:${action.name}`;
      const tried = (attempts.get(key) || 0) + 1;
      attempts.set(key, tried);
      if (tried > (action.retryLimit ?? 1)) {
        return failure(`${failedCriterion} (after ${action.retryLimit ?? 1} retries)`);
      }
      if (action.retryAfter) await sleep(action.retryAfter * 1000);
      index = target;
    }

    const outputs = {};
    for (const [name, expr] of Object.entries(workflow.outputs || {})) {
      outputs[name] = resolveValue(expr, { inputs, steps: stepsCtx });
    }
    return {
      content: [{ type: "text", text: JSON.stringify(outputs, null, 2) }],
      structuredContent: outputs,
    };
  }

  return {
    manifest,
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
      if (tool.workflow) return runWorkflow(tool, args, hooks);
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
}

/** Sets the value at a JSON pointer inside a payload (an Arazzo request body replacement). */
function replaceAt(payload, target, value) {
  const keys = String(target)
    .split("/")
    .slice(1)
    .map((k) => k.replace(/~1/g, "/").replace(/~0/g, "~"));
  if (!keys.length) return value;
  const root = Array.isArray(payload) ? [...payload] : { ...payload };
  let node = root;
  for (const [i, key] of keys.entries()) {
    if (i === keys.length - 1) {
      node[key] = value;
      break;
    }
    const next = node[key];
    node[key] = Array.isArray(next) ? [...next] : { ...next };
    node = node[key];
  }
  return root;
}
