import { Hono } from "hono";
import { cors } from "hono/cors";
import { getCookie } from "hono/cookie";
import { METHODS as NODE_METHODS } from "node:http";
import { serve } from "@hono/node-server";
import { createAuth, createVerifier, problem } from "./auth.js";
import { control, CONTROL_PREFIX } from "./control.js";
import { createRuntime } from "./runtime.js";
import { serveUi } from "./ui.js";
import { createRouter } from "./engine/router.js";
import { createResponder, itemValidator, parsePrefer } from "./responses.js";
import { listOperations, loadSpec, pointerSegment, resolve } from "./spec.js";
import { CONFIG_FILE, configFor } from "./stateful/config.js";
import { createStateful, SESSION_HEADER } from "./stateful/handlers.js";
import { DEFAULT_STREAM_INTERVAL, parseStreamBody, streamKind, timedStream } from "./stream.js";

export { tokenScopes } from "./auth.js";
export { CONTROL_PREFIX } from "./control.js";
export { exampleError } from "./examples.js";
export { CONFIG_FILE, configFor } from "./stateful/config.js";
export { STATEFUL_RULES, statefulFindings, statefulReport } from "./stateful/findings.js";

export const DEFAULT_PORT = 4010;

/**
 * `rapidoc mock`: serves every API on one port, each under `/<api id>/`, with responses from the spec's examples
 * (else data generated from its schemas with a fixed seed), request validation, and the operation's `security`
 * enforced: API keys must be present; bearer and OAuth tokens are verified against the issuer and must carry the
 * operation's scopes (401 without a valid token, 403 without the permission).
 *
 * @param {object} options
 * @param {{id: string, fullPath: string, title?: string}[]} options.apis - Local specs; `id` is the path prefix, `title`
 *   defaults to the spec's info.title
 * @param {string} [options.issuer] - OpenID Connect issuer whose tokens are accepted; unset: bearer tokens unchecked
 * @param {string} [options.audience] - Required `aud` of tokens
 * @param {number} [options.seed] - Seed for generated data (default 1)
 * @param {boolean | { rows?: number | Record<string, number>, config?: object, configFile?: string }} [options.stateful] - Keep state: the operations
 *   the classifier maps to a resource (create, read, update, delete, list) work on stored records, seeded from
 *   the spec (`rows` per resource, default 10); the rest answer as without it. A request's `X-Mock-Session`
 *   header gives it its own copy of the data. `config`: the user's corrections, as `mock.config.yaml` holds
 *   them, parsed (`{ resources, operations }`, or `{ apis: { <id>: ... } }`); `configFile`: its name, for messages.
 * @param {number} [options.delay] - Milliseconds every API response waits before it is sent (default 0), to see
 *   loading states in a client. The control API (`PATCH /__mock/settings`) can change it while the mock runs.
 * @param {number} [options.streamInterval] - Gap in ms between the items of a streamed response (OpenAPI 3.2
 *   `itemSchema`: Server-Sent Events, JSON Lines); default 300
 * @param {string | string[]} [options.origin] - Origins allowed by CORS (default `*`; tokens travel in headers, not cookies)
 * @param {(line: string) => void} [options.log] - Request log; default console.log with a [rapidoc mock] prefix
 * @param {(line: string) => void} [options.warn] - Problems that don't stop the server; default console.warn
 * @returns {Promise<{app: Hono, apis: {id: string, title?: string, operations: number, stateful?: object}[], skipped: {id: string, error: string}[], verifier: object | null}>}
 */
export async function createMockApp({
  apis,
  issuer,
  audience,
  seed = 1,
  stateful = false,
  delay = 0,
  streamInterval = DEFAULT_STREAM_INTERVAL,
  origin = "*",
  log = (line) => console.log(`[rapidoc mock] ${line}`),
  warn = (line) => console.warn(`[rapidoc mock] ⚠️  ${line}`),
}) {
  const verifier = issuer ? await createVerifier({ issuer, audience }) : null;
  // What the control API may change while the mock runs (see control.js); nothing here is saved
  const settings = {
    delay: Math.max(0, Number(delay) || 0),
    seed,
    rows: (stateful && stateful.rows) || 10,
  };

  const loaded = [];
  const skipped = [];
  for (const api of apis) {
    try {
      if (api.id === CONTROL_PREFIX)
        throw new Error(
          `/${CONTROL_PREFIX} is the mock's own control API; give the API another id`,
        );
      const doc = await loadSpec(api.fullPath);
      const router = await createRouter(doc, { warn: (line) => warn(`${api.id}: ${line}`) });
      const operations = listOperations(doc);
      const byKey = new Map(operations.map((op) => [`${op.method} ${op.path}`, op]));
      // Node's HTTP parser accepts a fixed list of methods (QUERY, PURGE, COPY, ... are in it)
      for (const op of operations) {
        if (!NODE_METHODS.includes(op.method.toUpperCase()))
          warn(
            `${api.id}: ${op.method.toUpperCase()} ${op.path} can't be called: Node's HTTP server doesn't accept the method ${op.method.toUpperCase()}`,
          );
      }
      let state = null;
      if (stateful) {
        try {
          const apiIds = apis.map((one) => one.id);
          const { section, warnings } = configFor(stateful.config, api.id, apiIds);
          state = await createStateful(doc, { seed, rows: stateful.rows, config: section });
          state.config = section; // kept for new seed data (POST /__mock/reset with rows or seed)
          // What the config says and the spec no longer has: skipped, and said, never dropped silently
          for (const line of [...warnings, ...state.configWarnings]) {
            warn(`${stateful.configFile || CONFIG_FILE}: ${api.id}: ${line}`);
          }
          const failed = Object.entries(state.report.failed || {});
          if (failed.length) {
            warn(
              `${api.id}: no seed data for ${failed.length} resource(s), which start empty: ${failed
                .slice(0, 3)
                .map(([name, why]) => `${name} (${why})`)
                .join("; ")}${failed.length > 3 ? "; ..." : ""}`,
            );
          }
        } catch (err) {
          warn(`${api.id}: served without state: ${err.message.split("\n")[0]}`);
        }
      }
      loaded.push({
        ...api,
        state,
        title: api.title ?? doc.info?.title,
        router,
        byKey,
        operations: byKey.size,
        auth: createAuth(doc, verifier),
        respond: createResponder(doc, { seed }),
        doc,
      });
    } catch (err) {
      skipped.push({ id: api.id, error: err.message });
      warn(`${api.id}: not served: ${err.message.split("\n")[0]}`);
    }
  }
  if (apis.length && !loaded.length) throw new Error("No API could be loaded");

  const runtime = createRuntime({
    settings,
    started: { stateful: Boolean(stateful), issuer, audience, streamInterval },
  });
  const app = new Hono();
  // Every method the APIs use (OpenAPI 3.2 QUERY and additionalOperations included) passes CORS preflight
  const allowMethods = [
    ...new Set([
      "GET",
      "HEAD",
      "PUT",
      "POST",
      "DELETE",
      "PATCH",
      ...loaded.flatMap((api) => api.router.methods),
    ]),
  ];
  app.use("*", cors({ origin, allowMethods, exposeHeaders: ["*"], maxAge: 600 }));
  app.get("/", (c) =>
    c.json({
      apis: loaded.map(({ id, title, operations }) => ({
        id,
        ...(title ? { title } : {}),
        url: `/${id}`,
        operations,
      })),
    }),
  );
  // The mock's own endpoints: health, and the stored records of the stateful mode (see control.js)
  const controlHandler = async (c) => {
    const url = new URL(c.req.url);
    const segments = url.pathname.split("/").filter(Boolean).slice(1).map(decodeURIComponent);
    if (segments[0] === "ui" && c.req.method === "GET") {
      return send(await serveUi(segments.slice(1), url.pathname.endsWith("/")));
    }
    const response = await control(
      {
        method: c.req.method,
        segments,
        query: url.searchParams,
        session: c.req.header(SESSION_HEADER),
        body: () => c.req.json(),
      },
      loaded,
      runtime,
    );
    log(`${c.req.method} ${url.pathname}${url.search} → ${response.status} (control)`);
    return send(response);
  };
  app.all(`/${CONTROL_PREFIX}`, controlHandler);
  app.all(`/${CONTROL_PREFIX}/*`, controlHandler);
  for (const api of loaded) {
    const handler = (c) => handle(c, api, { log, warn, streamInterval, settings });
    app.all(`/${api.id}`, handler);
    app.all(`/${api.id}/*`, handler);
  }
  app.notFound((c) =>
    send(
      problem(
        404,
        "Not Found",
        `No API at ${new URL(c.req.url).pathname}. APIs: ${loaded.map((api) => `/${api.id}`).join(", ") || "none"}.`,
      ),
    ),
  );

  return {
    app,
    apis: loaded.map(({ id, title, operations, state }) => ({
      id,
      title,
      operations,
      ...(state ? { stateful: statefulSummary(state) } : {}),
    })),
    skipped,
    verifier,
  };
}

/** What the stateful mode made of an API: its resources with their record counts, and the operations by label. */
const statefulSummary = ({ model, report, labels }) => ({
  resources: report.records,
  ...labels,
  review: model.review,
});

/** The Response: a streamed body (one chunk per item, `interval` ms apart) when the responder gave chunks */
const send = ({ status, headers, body, stream }, interval) =>
  new Response(stream?.length ? timedStream(stream, interval) : (body ?? null), {
    status,
    headers,
  });

async function handle(c, api, { log, warn, streamInterval = DEFAULT_STREAM_INTERVAL, settings }) {
  const url = new URL(c.req.url);
  const path = url.pathname.slice(api.id.length + 1) || "/";
  const method = c.req.method.toLowerCase();
  const finish = async (response, source) => {
    log(
      `${c.req.method} ${url.pathname}${url.search} → ${response.status}${source ? ` (${source})` : ""}`,
    );
    if (settings?.delay > 0) await new Promise((done) => setTimeout(done, settings.delay));
    return send(response, streamInterval);
  };

  let matched = api.router.match({ method, path });
  if (matched.status && method === "head") matched = api.router.match({ method: "get", path });
  if (matched.status === 404)
    return finish(problem(404, "Not Found", `${api.id} has no operation at ${path}.`));
  if (matched.status === 405) {
    return finish(
      problem(405, "Method Not Allowed", `${path} accepts ${matched.allow.join(", ")}.`, {
        Allow: matched.allow.join(", "),
      }),
    );
  }

  const operation = api.byKey.get(`${matched.method} ${matched.path}`);
  const headers = Object.fromEntries(c.req.raw.headers);
  const request = { method, path, query: url.searchParams, headers, cookies: getCookie(c) };

  const denied = await api.auth.check(request, operation.operation);
  if (denied) return finish(denied, "security");

  let body;
  try {
    body = await readBody(c, headers["content-type"]);
  } catch {
    const what = /json/i.test(headers["content-type"] || "")
      ? "is not valid JSON"
      : `could not be read as ${headers["content-type"]}`;
    return finish(problem(400, "Bad Request", `The request body ${what}.`));
  }
  const errors =
    streamBodyErrors(api, operation, headers["content-type"], body) ??
    api.router.validate({ method, path, query: url.search.slice(1), headers, body }, matched);
  if (errors?.length) {
    const status =
      operation.operation.responses?.["422"] && !operation.operation.responses?.["400"] ? 422 : 400;
    return finish(
      problem(
        status,
        "Request does not match the API description",
        `${errors.length} problem(s) in the request.`,
        {},
        { errors },
      ),
      "validation",
    );
  }

  const prefer = parsePrefer(headers.prefer);
  // A caller that asks for a response by code or example gets it as written; nothing is stored or read
  if (api.state && !prefer.code && !prefer.example) {
    try {
      const response = await api.state.handle({
        method,
        template: matched.path,
        path,
        query: url.searchParams,
        body,
        operation: operation.operation,
        session: headers[SESSION_HEADER],
        head: method === "head",
        respond: (asked = {}) =>
          api.respond({
            operation: operation.operation,
            pointer: operation.pointer,
            prefer: asked,
            accept: headers.accept,
          }),
      });
      if (response) return finish(response, response.source);
    } catch (err) {
      warn(`${c.req.method} ${url.pathname}: answered without state: ${err.message}`);
    }
  }

  try {
    const response = await api.respond({
      operation: operation.operation,
      pointer: operation.pointer,
      head: method === "head",
      prefer,
      accept: headers.accept,
    });
    return finish(response, response.source);
  } catch (err) {
    warn(`${c.req.method} ${url.pathname}: ${err.message}`);
    return finish(problem(500, "Mock response failed", err.message));
  }
}

/**
 * Problems in a streamed request body (OpenAPI 3.2 `itemSchema`, JSON Lines or JSON Text Sequences): a line that
 * isn't JSON, or an item that misses the item schema (`path` starts with `/<line>`). Null when the body is not a
 * stream of the operation's (the router validates it then).
 */
function streamBodyErrors(api, operation, contentType, body) {
  const kind = streamKind(contentType);
  if ((kind !== "jsonl" && kind !== "json-seq") || typeof body !== "string") return null;
  const content = resolve(
    api.doc,
    operation.operation.requestBody,
    `${operation.pointer}/requestBody`,
  ).node?.content;
  const type =
    content &&
    Object.keys(content).find(
      (key) =>
        key.split(";")[0].trim().toLowerCase() === contentType.split(";")[0].trim().toLowerCase(),
    );
  const pointer = `${operation.pointer}/requestBody/content/${pointerSegment(type || "")}`;
  const media = type && resolve(api.doc, content[type], pointer).node;
  if (!media?.itemSchema) return null;
  let items;
  try {
    items = parseStreamBody(body, contentType);
  } catch (err) {
    return [{ in: "body", message: err.message }];
  }
  const validate = itemValidator(api.doc, media.itemSchema, `${pointer}/itemSchema`);
  if (!validate) return [];
  const errors = [];
  items.forEach((item, i) => {
    if (validate(item)) return;
    for (const error of validate.errors) {
      const message =
        error.keyword === "required" ? `missing ${error.params.missingProperty}` : error.message;
      errors.push({
        in: "body",
        path: `/${i + 1}${error.instancePath}`,
        message: `item ${i + 1}: ${message}`,
      });
    }
  });
  return errors;
}

/** The request body as the validator wants it: parsed JSON, form fields (files as a short description), or text. */
async function readBody(c, contentType = "") {
  if (
    ["GET", "HEAD", "DELETE", "OPTIONS"].includes(c.req.method) &&
    !c.req.header("content-length") &&
    !c.req.header("transfer-encoding")
  ) {
    return undefined;
  }
  if (/multipart\/form-data|application\/x-www-form-urlencoded/i.test(contentType)) {
    const form = await c.req.parseBody({ all: true });
    const describe = (value) =>
      value instanceof File ? `${value.name} (${value.size} bytes)` : value;
    return Object.fromEntries(
      Object.entries(form).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.map(describe) : describe(value),
      ]),
    );
  }
  const text = await c.req.text();
  if (!text) return undefined;
  // A stream (JSON Lines, JSON Text Sequences, SSE) stays text: streamBodyErrors reads it line by line
  if (streamKind(contentType)) return text;
  return /json/i.test(contentType) ? JSON.parse(text) : text;
}

/**
 * Starts the mock server.
 *
 * @param {object} options - createMockApp() options, plus:
 * @param {number} [options.port] - Default 4010 (0 picks a free port)
 * @param {string} [options.host] - Default 0.0.0.0
 */
export async function startMockServer({ port = DEFAULT_PORT, host = "0.0.0.0", ...options }) {
  const { app, apis, skipped, verifier } = await createMockApp(options);
  return new Promise((resolve, reject) => {
    const server = serve({ fetch: app.fetch, port, hostname: host }, (info) => {
      resolve({
        url: `http://${host === "0.0.0.0" ? "localhost" : host}:${info.port}`,
        port: info.port,
        apis,
        skipped,
        verifier,
        close: () => new Promise((done) => server.close(() => done())),
      });
    });
    server.once("error", reject);
  });
}
