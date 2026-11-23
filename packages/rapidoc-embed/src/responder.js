// What a JavaScript server integration does with a request, apart from the framework's own calls: match
// the path against the contract's routes and produce the status, headers and body. @rapidoc/hono,
// @rapidoc/express and @rapidoc/fastify are this function plus a few lines each. Not part of the contract:
// ports in other languages write their own (the routes and pages they serve are the contract).
import {
  embedRoutes,
  normalizePath,
  renderHostPage,
  renderOAuthReceiverPage,
  uiPathOf,
} from "./core.js";

/** True when an `If-None-Match` header names `etag`: a list, weak validators (`W/"..."`) and `*` count. */
export function etagMatches(ifNoneMatch, etag) {
  if (!ifNoneMatch) return false;
  return String(ifNoneMatch)
    .split(",")
    .map((tag) => tag.trim().replace(/^W\//, ""))
    .some((tag) => tag === etag || tag === "*");
}

/**
 * @param {object} options the contract's options, plus `enabled` (false: answer nothing), `publicUiPath`
 *   (the page's whole path as the browser sees it, when a proxy strips a prefix) and `nonce`. `uiPath` is
 *   the path within the app or mount the integration is registered in.
 * @param {{ readAsset?: (file: string) => Uint8Array | Promise<Uint8Array> }} [runtime] how to read a file
 *   of rapidoc's dist folder. Without it the bundle cannot be served, and `assets` defaults to "cdn".
 * @returns {(request: { method?: string, path: string, mount?: string, ifNoneMatch?: string,
 *   nonce?: string }) => Promise<null | { status: number, headers: Record<string, string>,
 *   body: string | Uint8Array | null }>} null when the request is not for RapiDoc. `path` is the request's
 *   path within the mount, `mount` the prefix the framework took off it ("" at the top of the app).
 */
export function createResponder(options = {}, runtime = {}) {
  const { enabled = true, publicUiPath, nonce, uiPath, ...rest } = options;
  const readAsset = runtime.readAsset ?? null;
  const embedOptions = {
    assets: readAsset ? "bundled" : "cdn",
    ...rest,
    uiPath: normalizePath(uiPathOf({ uiPath })) || "/",
  };
  if (embedOptions.assets === "bundled" && !readAsset) {
    throw new TypeError(
      '@rapidoc/embed: cannot serve the bundle without a file system: use assets "cdn" or { scriptUrl }',
    );
  }
  const routes = new Map(embedRoutes(embedOptions).map((route) => [route.path, route]));
  const files = new Map();

  return async function respond(request) {
    const method = request.method ?? "GET";
    if (!enabled || (method !== "GET" && method !== "HEAD")) return null;
    const path = request.path.length > 1 ? request.path.replace(/\/+$/, "") : request.path;
    const route = routes.get(path || "/");
    if (!route) return null;

    if (route.kind === "file") {
      // The URL has no version in it, so the browser asks every time ("no-cache") and gets a 304 until a
      // deploy brings another build. The ETag is the file's SRI hash.
      const etag = `"${embedOptions.manifest?.files?.[route.file]?.integrity ?? route.file}"`;
      const headers = {
        "content-type": route.contentType,
        "cache-control": "no-cache",
        etag,
        "x-content-type-options": "nosniff",
      };
      if (etagMatches(request.ifNoneMatch, etag)) return { status: 304, headers, body: null };
      // Read once: the file is the installed rapidoc build and does not change while the app runs
      if (!files.has(route.file)) files.set(route.file, await readAsset(route.file));
      return { status: 200, headers, body: files.get(route.file) };
    }

    // Requests are matched on `uiPath`, the path within the mount; the URLs written into the pages are
    // public ones, so the mount's prefix goes in front (or `publicUiPath` replaces both behind a proxy).
    const render = route.kind === "page" ? renderHostPage : renderOAuthReceiverPage;
    const mount = request.mount ? normalizePath(request.mount) : "";
    const publicPath =
      publicUiPath !== undefined && publicUiPath !== null && publicUiPath !== ""
        ? normalizePath(publicUiPath)
        : `${mount}${normalizePath(embedOptions.uiPath)}`;
    const body = render({
      ...embedOptions,
      uiPath: publicPath || "/",
      nonce: request.nonce ?? nonce,
    });
    return {
      status: 200,
      headers: {
        "content-type": route.contentType,
        "cache-control": "no-cache",
        "x-content-type-options": "nosniff",
      },
      body,
    };
  };
}
