import path from "node:path";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { serve } from "@hono/node-server";
import { decide, allows, visibleZones } from "./access.js";
import {
  createProviderSource,
  discoverProvider,
  discoveryErrorText,
  isUnreachable,
} from "./auth/oidc.js";
import { AUTH_PREFIX, registerAuthRoutes } from "./auth/routes.js";
import { cookieNames, createSealer } from "./auth/session.js";
import { registerMcpRoutes } from "./mcp.js";
import { createSearch, SEARCH_PREFIX } from "./search.js";
import { loadSettings, SettingsError } from "./settings.js";
import {
  candidateFiles,
  fileResponse,
  findFile,
  NO_STORE,
  publicCacheControl,
  textResponse,
  tooLarge,
} from "./static.js";

// The public API: createApp(), startServer() and SettingsError (what both throw for a build or an
// environment they can't serve). The settings object itself holds secrets and stays inside the package.
export { SettingsError } from "./settings.js";

/**
 * `rapidoc serve`: serves a built portal (`rapidoc build`) and, when it has `auth`, signs readers in
 * through OpenID Connect and enforces the access zones the build assigned to every file.
 *
 *   dist/public/      served to everyone
 *   dist/protected/   served when the reader's session may see the file's zone (rapidoc-server.json)
 *
 * A build without rapidoc-server.json is served as plain static files.
 *
 * Under a base path (the path of site.url), requests arrive under the mount path (the base path, unless a proxy
 * strips part of it). mount() takes the mount path off before the routes below see a request, so they work with
 * paths relative to the portal; URLs the server sends back (redirects, the sign-in callback) get the base path.
 */

const ACCESS_DENIED_PAGE = "_rapidoc/access-denied/index.html";
/** The portal's 404 page (or the project's own), always public. */
const NOT_FOUND_PAGE = "404.html";

/**
 * The answer for an address with no file: the site's 404 page for a browser asking for a page, a plain
 * "Not found" for anything else (a script, an image, a JSON request) or a build without that page.
 */
function notFound(c, publicDir) {
  const url = new URL(c.req.url);
  const asksForPage =
    !/\.[a-z0-9]+$/i.test(url.pathname) && (c.req.header("accept") || "").includes("text/html");
  const page = asksForPage && findFile(publicDir, [NOT_FOUND_PAGE]);
  return page
    ? fileResponse(c.req.raw, page.full, { status: 404, cacheControl: NO_STORE })
    : textResponse(404, "Not found");
}
const MAX_CHECK_PATHS = 500;
const MAX_CHECK_BODY = 64 * 1024;
/** Hosts a request can only come from on this machine: the request's own origin is trusted for these. */
const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

/**
 * Headers on every response: no MIME sniffing, a referrer without the path for other sites, HTTPS only
 * once the portal's public URL is https, and which sites may frame it (settings.frameAncestors).
 */
function securityHeaders(settings) {
  const https = (settings.publicUrl || "").startsWith("https:");
  return async (c, next) => {
    await next();
    const headers = c.res.headers;
    if (!headers.has("x-content-type-options")) headers.set("x-content-type-options", "nosniff");
    headers.set("referrer-policy", "strict-origin-when-cross-origin");
    if (https) headers.set("strict-transport-security", "max-age=31536000");
    if (settings.frameAncestors)
      headers.set("content-security-policy", `frame-ancestors ${settings.frameAncestors}`);
  };
}

/**
 * What createApp() and startServer() say about the server they made: how it serves the build, in values
 * that are safe to print. Never a secret (the session key, the client secret) and never the manifest.
 *
 * @typedef {object} ServerSummary
 * @property {"static" | "portal"} mode - `static`: a build without rapidoc-server.json, served as plain files
 * @property {string} basePath - Path of the portal in the addresses a browser sees ('' at the root)
 * @property {string} mountPath - Path requests arrive under (the base path, unless a proxy strips part of it)
 * @property {string | null} publicUrl - The portal's public origin (site.url, RAPIDOC_PUBLIC_URL), or null
 * @property {string | null} issuer - The sign-in provider, or null without sign-in
 * @property {string | null} clientId - The client ID the portal signs in with, or null without sign-in
 * @property {boolean} providerReady - Whether the provider was discovered at start-up. False without sign-in,
 *   and when the provider could not be reached: the server then discovers it when a reader signs in
 * @property {{files: number, zones: number} | null} access - Protected files, and the zones they are in
 *   (the public zone not counted); null in `static` mode
 * @property {{enabled: boolean, tools: number}} mcp - `enabled`: false with RAPIDOC_MCP=off; `tools`: tools served at /mcp
 */

/** @returns {ServerSummary} */
function summaryOf(settings, { mcp, providerReady = false }) {
  const zones = settings.manifest ? Object.keys(settings.manifest.access.zones) : [];
  return {
    mode: settings.mode,
    basePath: settings.basePath,
    mountPath: settings.mountPath,
    publicUrl: settings.publicUrl || null,
    issuer: settings.auth?.issuer || null,
    clientId: settings.auth?.clientId || null,
    providerReady,
    access: settings.manifest
      ? {
          files: Object.keys(settings.manifest.files || {}).length,
          zones: zones.filter((zone) => zone !== "public").length,
        }
      : null,
    mcp: { enabled: settings.mcp !== false, tools: mcp.count },
  };
}

/**
 * Builds the app. Discovers the sign-in provider first, so a wrong issuer fails here, not on the first
 * sign-in. A provider that can't be reached (no connection, a timeout, a 5xx answer) does not stop the
 * portal: the app is built, public pages are served, and the provider is discovered when a reader signs in.
 *
 * @param {object} options
 * @param {string} options.distDir - Output of `rapidoc build`
 * @param {Record<string, string | undefined>} [options.env] - Default process.env
 * @param {(line: string) => void} [options.log] - Default console.log with a [rapidoc serve] prefix
 * @param {string} [options.mountPath] - Path requests arrive under (default $RAPIDOC_MOUNT_PATH, else the base path)
 * @returns {Promise<{app: Hono, summary: ServerSummary}>}
 */
export async function createApp({
  distDir,
  env = process.env,
  log = (line) => console.log(`[rapidoc serve] ${line}`),
  mountPath,
}) {
  const settings = loadSettings(distDir, env, { mountPath });
  const base = settings.basePath;
  const app = new Hono();
  app.get("/_rapidoc/health", (c) => c.json({ ok: true }));
  app.use("*", securityHeaders(settings));

  if (settings.mode === "static") {
    const mcp = settings.mcp
      ? registerMcpRoutes(app, {
          settings,
          sealer: null,
          userOf: async () => null,
          originOf: (c) => new URL(c.req.url).origin,
          base,
          env,
          log,
        })
      : { count: 0, off: true };
    app.on(["GET", "HEAD"], "*", (c) => {
      const candidates = candidateFiles(new URL(c.req.url).pathname);
      if (!candidates) return textResponse(400, "Bad request");
      const file = findFile(settings.publicDir, candidates);
      return file
        ? fileResponse(c.req.raw, file.full, { cacheControl: publicCacheControl(file.rel) })
        : notFound(c, settings.publicDir);
    });
    return { app: mount(app, settings.mountPath), summary: summaryOf(settings, { mcp }) };
  }

  const { manifest } = settings;
  const zones = manifest.access.zones;
  const search = createSearch(settings);
  const sealer = settings.auth ? createSealer(settings.auth.sessionSecret) : null;
  const originOf = (c) => settings.publicUrl || new URL(c.req.url).origin;

  // Sign-in needs the portal's real address: the callback URL, and cookies that are Secure and bound to the
  // host. Without a public URL the server would take both from the request, which behind a proxy is plain
  // http and whatever Host header arrived. So that fallback is for a local run only.
  if (settings.auth && !settings.publicUrl) {
    let warned = false;
    app.use("*", async (c, next) => {
      if (LOOPBACK_HOSTS.has(new URL(c.req.url).hostname)) return next();
      if (!warned) {
        warned = true;
        log(
          "refusing requests: this portal has sign-in but no public URL. Set site.url in rapidoc.config.yaml (and rebuild) or RAPIDOC_PUBLIC_URL",
        );
      }
      return textResponse(
        500,
        "This portal has sign-in but no public URL. Set site.url in rapidoc.config.yaml or RAPIDOC_PUBLIC_URL.",
      );
    });
  }

  let provider = null;
  if (settings.auth) {
    try {
      provider = await discoverProvider(settings.auth);
    } catch (err) {
      // A wrong issuer is a mistake to fix before the portal runs. A provider that is down is not: public
      // pages are served, and sign-in works once the provider answers.
      if (!isUnreachable(err))
        throw new SettingsError([
          `Sign-in provider ${settings.auth.issuer} could not be discovered: ${discoveryErrorText(err)}`,
        ]);
      log(
        `sign-in provider ${settings.auth.issuer} can't be reached (${discoveryErrorText(err)}): serving public pages; sign-in will work once the provider answers`,
      );
    }
  }
  const providerSource = settings.auth
    ? createProviderSource(settings.auth, { provider, log })
    : null;
  const providerReady = Boolean(provider);

  /** The session user, read once per request. */
  const userOf = async (c) => {
    if (!sealer) return null;
    if (c.get("user") === undefined) {
      const name = cookieNames(originOf(c).startsWith("https:")).session;
      const session = await sealer.open(getCookie(c, name), "session");
      // A session is what the callback sealed: it always names its user
      c.set("user", session && typeof session.sub === "string" && session.sub ? session : null);
    }
    return c.get("user");
  };

  if (settings.auth)
    registerAuthRoutes(app, { settings, providerSource, sealer, userOf, originOf, base, log });

  // RAPIDOC_MCP=off: no /mcp and no agent tokens (both routes are then unknown, 404)
  const mcp = settings.mcp
    ? registerMcpRoutes(app, { settings, zones, sealer, userOf, originOf, base, env, log })
    : { count: 0, off: true };

  // Which of these paths would the reader be refused? (lock icons on links; PortalUserMenu.astro)
  app.post("/_rapidoc/access/check", tooLarge(MAX_CHECK_BODY), async (c) => {
    const body = await c.req.text();
    let paths;
    try {
      paths = JSON.parse(body).paths;
    } catch {
      return c.json({ error: 'expected { "paths": [...] }' }, 400);
    }
    if (!Array.isArray(paths)) return c.json({ error: 'expected { "paths": [...] }' }, 400);
    const user = await userOf(c);
    // A reader who may not see the default zone gets the same answer for a path with no file as for a
    // protected one, as the GET handler below gives: the answer never says which paths exist.
    const hidesMissing = !allows(zones[manifest.access.defaultZone], user);
    const locked = paths
      .slice(0, MAX_CHECK_PATHS)
      .filter((p) => typeof p === "string" && p.startsWith("/"))
      .filter((p) => {
        // Links in the page carry the base path; zones are for paths relative to the portal.
        const relative = withoutBase(p);
        if (relative === null) return false; // outside the portal: another site's page, never locked here
        const zone = zoneOfPath(relative);
        return zone === null ? hidesMissing : !allows(zones[zone], user);
      });
    c.header("cache-control", NO_STORE);
    c.header("vary", "Cookie");
    return c.json({ locked });
  });

  app.get("/search-index.json", async (c) => {
    const index = search.mergedIndex(
      visibleZones(zones, await userOf(c)).filter((zone) => zone !== "public"),
    );
    if (!index) return textResponse(404, "Not found");
    c.header("cache-control", NO_STORE);
    c.header("vary", "Cookie");
    return c.json(index);
  });

  app.on(["GET", "HEAD"], `${SEARCH_PREFIX}:zone/pagefind/*`, async (c) => {
    const zone = c.req.param("zone");
    if (!(zone in zones)) return textResponse(404, "Not found");
    const rest = new URL(c.req.url).pathname.slice(`${SEARCH_PREFIX}${zone}/pagefind/`.length);
    const candidates = candidateFiles(`/${rest}`);
    if (!candidates) return textResponse(400, "Bad request");
    const dir = search.pagefindDir(zone, allows(zones[zone], await userOf(c)));
    const file = findFile(dir, candidates.slice(0, 1));
    return file
      ? fileResponse(c.req.raw, file.full, { cacheControl: NO_STORE })
      : textResponse(404, "Not found");
  });

  /** Zone of a URL path: a protected file's zone, `public` for a public file, null when nothing is there. */
  function zoneOfPath(urlPath) {
    const candidates = candidateFiles(urlPath);
    if (!candidates) return null;
    if (findFile(settings.publicDir, candidates)) return "public";
    const file = findFile(settings.protectedDir, candidates);
    return file ? manifest.files[file.rel] || null : null;
  }

  const wantsHtml = (c, rel) =>
    rel ? rel.endsWith(".html") : (c.req.header("accept") || "").includes("text/html");

  /** Signed out → sign-in (pages) or 401; signed in without access → access-denied page or 403. */
  async function refuse(c, decision, rel) {
    const url = new URL(c.req.url);
    if (decision === "sign-in") {
      if (!settings.auth) return textResponse(401, "Sign-in required");
      if (!wantsHtml(c, rel)) return textResponse(401, "Sign-in required");
      return new Response(null, {
        status: 302,
        headers: {
          location: `${base}${AUTH_PREFIX}/login?returnTo=${encodeURIComponent(base + url.pathname + url.search)}`,
          "cache-control": NO_STORE,
          vary: "Cookie",
        },
      });
    }
    const user = await userOf(c);
    log(`access denied: ${user?.sub} ${url.pathname}`);
    const page = wantsHtml(c, rel) && findFile(settings.publicDir, [ACCESS_DENIED_PAGE]);
    return page
      ? fileResponse(c.req.raw, page.full, { status: 403, cacheControl: NO_STORE })
      : textResponse(403, "Access denied");
  }

  app.on(["GET", "HEAD"], "*", async (c) => {
    const candidates = candidateFiles(new URL(c.req.url).pathname);
    if (!candidates) return textResponse(400, "Bad request");

    const publicFile = findFile(settings.publicDir, candidates);
    if (publicFile)
      return fileResponse(c.req.raw, publicFile.full, {
        cacheControl: publicCacheControl(publicFile.rel),
      });

    const user = await userOf(c);
    const protectedFile = findFile(settings.protectedDir, candidates);
    // A protected file without a zone (e.g. the zones' search folders) is never served directly.
    const zone = protectedFile && manifest.files[protectedFile.rel];
    if (zone) {
      const decision = decide(zones, zone, user);
      if (decision === "allow")
        return fileResponse(c.req.raw, protectedFile.full, { cacheControl: NO_STORE });
      return refuse(c, decision, protectedFile.rel);
    }

    // Nothing there. Readers who may not see the default zone can't tell missing from protected.
    const decision = decide(zones, manifest.access.defaultZone, user);
    return decision === "allow" ? notFound(c, settings.publicDir) : refuse(c, decision, null);
  });

  app.all("*", () => textResponse(405, "Method not allowed", { allow: "GET, HEAD" }));
  return {
    app: mount(app, settings.mountPath),
    summary: summaryOf(settings, { mcp, providerReady }),
  };

  /** `/developers/docs/a/` → `/docs/a/`; null for a path outside the portal. */
  function withoutBase(urlPath) {
    if (!base) return urlPath;
    if (urlPath === base) return "/";
    return urlPath.startsWith(`${base}/`) ? urlPath.slice(base.length) : null;
  }
}

/**
 * The portal's routes under `mountPath`: the mount path comes off each request's URL before `portal` sees it.
 * `/developers` redirects to `/developers/`; anything outside the mount path is a 404.
 */
function mount(portal, mountPath) {
  if (!mountPath) return portal;
  const app = new Hono();
  app.get("/_rapidoc/health", (c) => c.json({ ok: true }));
  app.all("*", (c) => {
    const url = new URL(c.req.url);
    if (url.pathname === mountPath) return c.redirect(`${mountPath}/${url.search}`, 301);
    if (!url.pathname.startsWith(`${mountPath}/`)) return textResponse(404, "Not found");
    url.pathname = url.pathname.slice(mountPath.length);
    return portal.fetch(new Request(url, c.req.raw));
  });
  return app;
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
 * @param {string} [options.mountPath] - See createApp()
 * @returns {Promise<{url: string, port: number, summary: ServerSummary, close: () => Promise<void>}>}
 *   `summary`: see createApp()
 */
export async function startServer({ distDir, port, host, env = process.env, log, mountPath } = {}) {
  const { app, summary } = await createApp({
    distDir: path.resolve(distDir || "dist"),
    env,
    log,
    mountPath,
  });
  const listenPort = Number(port ?? env.PORT ?? 8080);
  const hostname = host || env.HOST || "0.0.0.0";
  return new Promise((resolve, reject) => {
    const server = serve({ fetch: app.fetch, port: listenPort, hostname }, (info) => {
      resolve({
        url: `http://${hostname === "0.0.0.0" ? "localhost" : hostname}:${info.port}${summary.mountPath ? `${summary.mountPath}/` : ""}`,
        port: info.port,
        summary,
        close: () => new Promise((done) => server.close(() => done())),
      });
    });
    server.once("error", reject);
  });
}
