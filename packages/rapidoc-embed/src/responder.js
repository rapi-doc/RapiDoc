// What a JavaScript server integration does with a request, apart from the framework's own calls: match
// the path against the contract's routes and produce the status, headers and body. @rapidoc/hono,
// @rapidoc/express and @rapidoc/fastify are this function plus a few lines each. Not part of the contract:
// ports in other languages write their own (the routes and pages they serve are the contract).
import { embedRoutes, renderHostPage, renderOAuthReceiverPage, uiPathOf } from "./core.js";

/**
 * @param {object} options the contract's options, plus `enabled` (false: answer nothing), `publicUiPath`
 *   (the path as the browser sees it, when it differs from `uiPath`) and `nonce`
 * @param {{ readAsset?: (file: string) => Uint8Array | Promise<Uint8Array> }} [runtime] how to read a file
 *   of rapidoc's dist folder. Without it the bundle cannot be served, and `assets` defaults to "cdn".
 * @returns {(request: { method?: string, path: string, ifNoneMatch?: string, publicUiPath?: string,
 *   nonce?: string }) => Promise<null | { status: number, headers: Record<string, string>,
 *   body: string | Uint8Array | null }>} null when the request is not for RapiDoc
 */
export function createResponder(options = {}, runtime = {}) {
  // `path` and `publicPath` are the names these two options had before contract version 2
  const { enabled = true, publicUiPath, publicPath, nonce, path, uiPath, ...rest } = options;
  const readAsset = runtime.readAsset ?? null;
  const embedOptions = {
    assets: readAsset ? "bundled" : "cdn",
    ...rest,
    uiPath: uiPathOf({ uiPath, path }),
  };
  const fixedPublicPath = publicUiPath ?? publicPath;
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
    const route = routes.get(path);
    if (!route) return null;

    if (route.kind === "file") {
      const etag = `"${embedOptions.manifest?.files?.[route.file]?.integrity ?? route.file}"`;
      const headers = {
        "content-type": route.contentType,
        "cache-control": "public, max-age=3600",
        etag,
      };
      if (request.ifNoneMatch === etag) return { status: 304, headers, body: null };
      // Read once: the file is the installed rapidoc build and does not change while the app runs
      if (!files.has(route.file)) files.set(route.file, await readAsset(route.file));
      return { status: 200, headers, body: files.get(route.file) };
    }

    // Requests are matched on `uiPath`; the URLs written into the pages use the public path, which differs
    // behind a proxy that strips a prefix or under a router mounted at a prefix.
    const render = route.kind === "page" ? renderHostPage : renderOAuthReceiverPage;
    const body = render({
      ...embedOptions,
      uiPath: request.publicUiPath ?? request.publicPath ?? fixedPublicPath ?? embedOptions.uiPath,
      nonce: request.nonce ?? nonce,
    });
    return {
      status: 200,
      headers: { "content-type": route.contentType, "cache-control": "no-cache" },
      body,
    };
  };
}
