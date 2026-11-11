// The Hono side of the integration contract: maps the routes of @rapidoc/embed to a middleware.
// No imports and no Node API here, so both entries share it: ./index.js (reads the bundle from disk) and ./edge.js
// (no file system; the bundle comes from the CDN or a URL of your own).
const pathOf = (url) => {
  const pathname = new URL(url).pathname;
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
};

/**
 * @param {object} options the options of the integration contract, plus `publicPath` and a `nonce` function
 * @param {object} runtime `{ embed, readAsset, defaultAssets }`: the render functions bound to a rapidoc
 *   manifest, how to read a bundled file (null where there is no file system) and the default for `assets`
 */
export function createRapidocMiddleware(options = {}, runtime) {
  const { enabled = true, publicPath, nonce, ...rest } = options;
  const embedOptions = { assets: runtime.defaultAssets, ...rest };
  if (embedOptions.assets === "bundled" && !runtime.readAsset) {
    throw new TypeError(
      '@rapidoc/hono/edge cannot serve the bundle: use assets "cdn" (the default) or { scriptUrl }',
    );
  }

  // Requests are matched against `path`; the URLs written into the pages use `publicPath`, which differs
  // only behind a proxy that strips a prefix.
  const pageOptions = { ...embedOptions, path: publicPath ?? embedOptions.path };
  const routes = new Map(
    runtime.embed.embedRoutes(embedOptions).map((route) => [route.path, route]),
  );
  const files = new Map();

  return async function rapidoc(c, next) {
    if (!enabled || (c.req.method !== "GET" && c.req.method !== "HEAD")) return next();
    const route = routes.get(pathOf(c.req.url));
    if (!route) return next();

    if (route.kind === "file") {
      // Read once: the file is the installed rapidoc build and does not change while the app runs
      if (!files.has(route.file)) files.set(route.file, await runtime.readAsset(route.file));
      const etag = `"${runtime.embed.rapidocManifest.files[route.file]?.integrity ?? route.file}"`;
      if (c.req.header("if-none-match") === etag) return c.body(null, 304, { etag });
      return c.body(files.get(route.file), 200, {
        "content-type": route.contentType,
        "cache-control": "public, max-age=3600",
        etag,
      });
    }

    const pageNonce = typeof nonce === "function" ? nonce(c) : nonce;
    const render =
      route.kind === "page" ? runtime.embed.renderHostPage : runtime.embed.renderOAuthReceiverPage;
    return c.body(render({ ...pageOptions, nonce: pageNonce }), 200, {
      "content-type": route.contentType,
      "cache-control": "no-cache",
    });
  };
}
