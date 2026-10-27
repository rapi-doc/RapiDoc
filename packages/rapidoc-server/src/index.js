import path from 'node:path';
import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { serve } from '@hono/node-server';
import { decide, allows, visibleZones } from './access.js';
import { discoverProvider } from './auth/oidc.js';
import { AUTH_PREFIX, registerAuthRoutes } from './auth/routes.js';
import { cookieNames, createSealer } from './auth/session.js';
import { createSearch, SEARCH_PREFIX } from './search.js';
import { loadSettings, SettingsError } from './settings.js';
import { candidateFiles, fileResponse, findFile, NO_STORE, publicCacheControl, textResponse } from './static.js';

export { loadSettings, SettingsError } from './settings.js';

/**
 * `rapidoc serve`: serves a built portal (`rapidoc build`) and, when it has `auth`, signs readers in
 * through OpenID Connect and enforces the access zones the build assigned to every file.
 *
 *   dist/public/      served to everyone
 *   dist/protected/   served when the reader's session may see the file's zone (rapidoc-server.json)
 *
 * A build without rapidoc-server.json is served as plain static files.
 */

const ACCESS_DENIED_PAGE = '_rapidoc/access-denied/index.html';
const MAX_CHECK_PATHS = 500;
const MAX_CHECK_BODY = 64 * 1024;

/**
 * Builds the app. Discovers the sign-in provider first, so a wrong issuer fails here, not on the first sign-in.
 *
 * @param {object} options
 * @param {string} options.distDir - Output of `rapidoc build`
 * @param {Record<string, string | undefined>} [options.env] - Default process.env
 * @param {(line: string) => void} [options.log] - Default console.log with a [rapidoc serve] prefix
 * @returns {Promise<{app: Hono, settings: object}>}
 */
export async function createApp({ distDir, env = process.env, log = (line) => console.log(`[rapidoc serve] ${line}`) }) {
  const settings = loadSettings(distDir, env);
  const app = new Hono();
  app.get('/_rapidoc/health', (c) => c.json({ ok: true }));

  if (settings.mode === 'static') {
    app.on(['GET', 'HEAD'], '*', (c) => {
      const candidates = candidateFiles(new URL(c.req.url).pathname);
      if (!candidates) return textResponse(400, 'Bad request');
      const file = findFile(settings.publicDir, candidates);
      return file ? fileResponse(c.req.raw, file.full, { cacheControl: publicCacheControl(file.rel) }) : textResponse(404, 'Not found');
    });
    return { app, settings };
  }

  const { manifest } = settings;
  const zones = manifest.access.zones;
  const search = createSearch(settings);
  const sealer = settings.auth ? createSealer(settings.auth.sessionSecret) : null;
  const originOf = (c) => settings.publicUrl || new URL(c.req.url).origin;

  let provider = null;
  if (settings.auth) {
    try {
      provider = await discoverProvider(settings.auth);
    } catch (err) {
      throw new SettingsError([`Sign-in provider ${settings.auth.issuer} could not be discovered: ${err.message}`]);
    }
  }

  /** The session user, read once per request. */
  const userOf = async (c) => {
    if (!sealer) return null;
    if (c.get('user') === undefined) {
      const name = cookieNames(originOf(c).startsWith('https:')).session;
      c.set('user', (await sealer.open(getCookie(c, name))) || null);
    }
    return c.get('user');
  };

  if (settings.auth) registerAuthRoutes(app, { settings, provider, sealer, userOf, originOf, log });

  // Which of these paths would the reader be refused? (lock icons on links; PortalUserMenu.astro)
  app.post('/_rapidoc/access/check', async (c) => {
    const body = await c.req.text();
    if (body.length > MAX_CHECK_BODY) return c.json({ error: 'too large' }, 413);
    let paths;
    try {
      paths = JSON.parse(body).paths;
    } catch {
      return c.json({ error: 'expected { "paths": [...] }' }, 400);
    }
    if (!Array.isArray(paths)) return c.json({ error: 'expected { "paths": [...] }' }, 400);
    const user = await userOf(c);
    const locked = paths
      .slice(0, MAX_CHECK_PATHS)
      .filter((p) => typeof p === 'string' && p.startsWith('/'))
      .filter((p) => {
        const zone = zoneOfPath(p);
        return zone !== null && !allows(zones[zone], user);
      });
    c.header('cache-control', NO_STORE);
    c.header('vary', 'Cookie');
    return c.json({ locked });
  });

  app.get('/search-index.json', async (c) => {
    const index = search.mergedIndex(visibleZones(zones, await userOf(c)).filter((zone) => zone !== 'public'));
    if (!index) return textResponse(404, 'Not found');
    c.header('cache-control', NO_STORE);
    c.header('vary', 'Cookie');
    return c.json(index);
  });

  app.on(['GET', 'HEAD'], `${SEARCH_PREFIX}:zone/pagefind/*`, async (c) => {
    const zone = c.req.param('zone');
    if (!(zone in zones)) return textResponse(404, 'Not found');
    const rest = new URL(c.req.url).pathname.slice(`${SEARCH_PREFIX}${zone}/pagefind/`.length);
    const candidates = candidateFiles(`/${rest}`);
    if (!candidates) return textResponse(400, 'Bad request');
    const dir = search.pagefindDir(zone, allows(zones[zone], await userOf(c)));
    const file = findFile(dir, candidates.slice(0, 1));
    return file ? fileResponse(c.req.raw, file.full, { cacheControl: NO_STORE }) : textResponse(404, 'Not found');
  });

  /** Zone of a URL path: a protected file's zone, `public` for a public file, null when nothing is there. */
  function zoneOfPath(urlPath) {
    const candidates = candidateFiles(urlPath);
    if (!candidates) return null;
    if (findFile(settings.publicDir, candidates)) return 'public';
    const file = findFile(settings.protectedDir, candidates);
    return file ? manifest.files[file.rel] || null : null;
  }

  const wantsHtml = (c, rel) => (rel ? rel.endsWith('.html') : (c.req.header('accept') || '').includes('text/html'));

  /** Signed out → sign-in (pages) or 401; signed in without access → access-denied page or 403. */
  async function refuse(c, decision, rel) {
    const url = new URL(c.req.url);
    if (decision === 'sign-in') {
      if (!settings.auth) return textResponse(401, 'Sign-in required');
      if (!wantsHtml(c, rel)) return textResponse(401, 'Sign-in required');
      return new Response(null, {
        status: 302,
        headers: {
          location: `${AUTH_PREFIX}/login?returnTo=${encodeURIComponent(url.pathname + url.search)}`,
          'cache-control': NO_STORE,
          vary: 'Cookie',
        },
      });
    }
    const user = await userOf(c);
    log(`access denied: ${user?.sub} ${url.pathname}`);
    const page = wantsHtml(c, rel) && findFile(settings.publicDir, [ACCESS_DENIED_PAGE]);
    return page ? fileResponse(c.req.raw, page.full, { status: 403, cacheControl: NO_STORE }) : textResponse(403, 'Access denied');
  }

  app.on(['GET', 'HEAD'], '*', async (c) => {
    const candidates = candidateFiles(new URL(c.req.url).pathname);
    if (!candidates) return textResponse(400, 'Bad request');

    const publicFile = findFile(settings.publicDir, candidates);
    if (publicFile) return fileResponse(c.req.raw, publicFile.full, { cacheControl: publicCacheControl(publicFile.rel) });

    const user = await userOf(c);
    const protectedFile = findFile(settings.protectedDir, candidates);
    // A protected file without a zone (e.g. the zones' search folders) is never served directly.
    const zone = protectedFile && manifest.files[protectedFile.rel];
    if (zone) {
      const decision = decide(zones, zone, user);
      if (decision === 'allow') return fileResponse(c.req.raw, protectedFile.full, { cacheControl: NO_STORE });
      return refuse(c, decision, protectedFile.rel);
    }

    // Nothing there. Readers who may not see the default zone can't tell missing from protected.
    const decision = decide(zones, manifest.access.defaultZone, user);
    return decision === 'allow' ? textResponse(404, 'Not found') : refuse(c, decision, null);
  });

  app.all('*', () => textResponse(405, 'Method not allowed', { allow: 'GET, HEAD' }));
  return { app, settings };
}

/**
 * Starts the server.
 *
 * @param {object} options
 * @param {string} options.distDir
 * @param {number} [options.port] - Default $PORT or 8080
 * @param {string} [options.host] - Default $HOST or 0.0.0.0
 * @param {Record<string, string | undefined>} [options.env]
 * @param {(line: string) => void} [options.log]
 * @returns {Promise<{url: string, port: number, settings: object, close: () => Promise<void>}>}
 */
export async function startServer({ distDir, port, host, env = process.env, log } = {}) {
  const { app, settings } = await createApp({ distDir: path.resolve(distDir || 'dist'), env, log });
  const listenPort = Number(port ?? env.PORT ?? 8080);
  const hostname = host || env.HOST || '0.0.0.0';
  return new Promise((resolve, reject) => {
    const server = serve({ fetch: app.fetch, port: listenPort, hostname }, (info) => {
      resolve({
        url: `http://${hostname === '0.0.0.0' ? 'localhost' : hostname}:${info.port}`,
        port: info.port,
        settings,
        close: () => new Promise((done) => server.close(() => done())),
      });
    });
    server.once('error', reject);
  });
}
