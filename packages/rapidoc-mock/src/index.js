import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getCookie } from 'hono/cookie';
import { serve } from '@hono/node-server';
import { createAuth, createVerifier, problem } from './auth.js';
import { createRouter } from './engine/router.js';
import { createResponder, parsePrefer } from './responses.js';
import { listOperations, loadSpec } from './spec.js';

export { tokenScopes } from './auth.js';

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
 * @param {string | string[]} [options.origin] - Origins allowed by CORS (default `*`; tokens travel in headers, not cookies)
 * @param {(line: string) => void} [options.log] - Request log; default console.log with a [rapidoc mock] prefix
 * @param {(line: string) => void} [options.warn] - Problems that don't stop the server; default console.warn
 * @returns {Promise<{app: Hono, apis: {id: string, title?: string, operations: number}[], skipped: {id: string, error: string}[], verifier: object | null}>}
 */
export async function createMockApp({
  apis,
  issuer,
  audience,
  seed = 1,
  origin = '*',
  log = (line) => console.log(`[rapidoc mock] ${line}`),
  warn = (line) => console.warn(`[rapidoc mock] ⚠️  ${line}`),
}) {
  const verifier = issuer ? await createVerifier({ issuer, audience }) : null;

  const loaded = [];
  const skipped = [];
  for (const api of apis) {
    try {
      const doc = await loadSpec(api.fullPath);
      const router = await createRouter(doc, { warn: (line) => warn(`${api.id}: ${line}`) });
      const byKey = new Map(listOperations(doc).map((op) => [`${op.method} ${op.path}`, op]));
      loaded.push({
        ...api,
        title: api.title ?? doc.info?.title,
        router,
        byKey,
        operations: byKey.size,
        auth: createAuth(doc, verifier),
        respond: createResponder(doc, { seed }),
      });
    } catch (err) {
      skipped.push({ id: api.id, error: err.message });
      warn(`${api.id}: not served: ${err.message.split('\n')[0]}`);
    }
  }
  if (apis.length && !loaded.length) throw new Error('No API could be loaded');

  const app = new Hono();
  app.use('*', cors({ origin, exposeHeaders: ['*'], maxAge: 600 }));
  app.get('/', (c) =>
    c.json({ apis: loaded.map(({ id, title, operations }) => ({ id, ...(title ? { title } : {}), url: `/${id}`, operations })) })
  );
  for (const api of loaded) {
    const handler = (c) => handle(c, api, { log, warn });
    app.all(`/${api.id}`, handler);
    app.all(`/${api.id}/*`, handler);
  }
  app.notFound((c) =>
    send(
      problem(
        404,
        'Not Found',
        `No API at ${new URL(c.req.url).pathname}. APIs: ${loaded.map((api) => `/${api.id}`).join(', ') || 'none'}.`
      )
    )
  );

  return { app, apis: loaded.map(({ id, title, operations }) => ({ id, title, operations })), skipped, verifier };
}

const send = ({ status, headers, body }) => new Response(body ?? null, { status, headers });

async function handle(c, api, { log, warn }) {
  const url = new URL(c.req.url);
  const path = url.pathname.slice(api.id.length + 1) || '/';
  const method = c.req.method.toLowerCase();
  const finish = (response, source) => {
    log(`${c.req.method} ${url.pathname}${url.search} → ${response.status}${source ? ` (${source})` : ''}`);
    return send(response);
  };

  let matched = api.router.match({ method, path });
  if (matched.status && method === 'head') matched = api.router.match({ method: 'get', path });
  if (matched.status === 404) return finish(problem(404, 'Not Found', `${api.id} has no operation at ${path}.`));
  if (matched.status === 405) {
    return finish(problem(405, 'Method Not Allowed', `${path} accepts ${matched.allow.join(', ')}.`, { Allow: matched.allow.join(', ') }));
  }

  const operation = api.byKey.get(`${matched.method} ${matched.path}`);
  const headers = Object.fromEntries(c.req.raw.headers);
  const request = { method, path, query: url.searchParams, headers, cookies: getCookie(c) };

  const denied = await api.auth.check(request, operation.operation);
  if (denied) return finish(denied, 'security');

  let body;
  try {
    body = await readBody(c, headers['content-type']);
  } catch {
    const what = /json/i.test(headers['content-type'] || '') ? 'is not valid JSON' : `could not be read as ${headers['content-type']}`;
    return finish(problem(400, 'Bad Request', `The request body ${what}.`));
  }
  const errors = api.router.validate({ method, path, query: url.search.slice(1), headers, body }, matched);
  if (errors?.length) {
    const status = operation.operation.responses?.['422'] && !operation.operation.responses?.['400'] ? 422 : 400;
    return finish(
      problem(status, 'Request does not match the API description', `${errors.length} problem(s) in the request.`, {}, { errors }),
      'validation'
    );
  }

  try {
    const response = await api.respond({
      operation: operation.operation,
      pointer: operation.pointer,
      head: method === 'head',
      prefer: parsePrefer(headers.prefer),
      accept: headers.accept,
    });
    return finish(response, response.source);
  } catch (err) {
    warn(`${c.req.method} ${url.pathname}: ${err.message}`);
    return finish(problem(500, 'Mock response failed', err.message));
  }
}

/** The request body as the validator wants it: parsed JSON, form fields (files as a short description), or text. */
async function readBody(c, contentType = '') {
  if (
    ['GET', 'HEAD', 'DELETE', 'OPTIONS'].includes(c.req.method) &&
    !c.req.header('content-length') &&
    !c.req.header('transfer-encoding')
  ) {
    return undefined;
  }
  if (/multipart\/form-data|application\/x-www-form-urlencoded/i.test(contentType)) {
    const form = await c.req.parseBody({ all: true });
    const describe = (value) => (value instanceof File ? `${value.name} (${value.size} bytes)` : value);
    return Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, Array.isArray(value) ? value.map(describe) : describe(value)])
    );
  }
  const text = await c.req.text();
  if (!text) return undefined;
  return /json/i.test(contentType) ? JSON.parse(text) : text;
}

/**
 * Starts the mock server.
 *
 * @param {object} options - createMockApp() options, plus:
 * @param {number} [options.port] - Default 4010 (0 picks a free port)
 * @param {string} [options.host] - Default 0.0.0.0
 */
export async function startMockServer({ port = DEFAULT_PORT, host = '0.0.0.0', ...options }) {
  const { app, apis, skipped, verifier } = await createMockApp(options);
  return new Promise((resolve, reject) => {
    const server = serve({ fetch: app.fetch, port, hostname: host }, (info) => {
      resolve({
        url: `http://${host === '0.0.0.0' ? 'localhost' : host}:${info.port}`,
        port: info.port,
        apis,
        skipped,
        verifier,
        close: () => new Promise((done) => server.close(() => done())),
      });
    });
    server.once('error', reject);
  });
}
