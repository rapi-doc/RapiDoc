// The Hono side of a RapiDoc integration: hands the request to the responder of @rapidoc/embed and turns
// its answer into a Hono response. No Node API here, so both entries share it: ./index.js (reads the
// bundle from disk) and ./edge.js (no file system; the bundle comes from the CDN or a URL of your own).

/**
 * The prefix the middleware is registered under: `/v1` after `new Hono().basePath("/v1")`,
 * `app.route("/v1", sub)` or `app.use("/v1/*", ...)`, and nothing at the top of the app. Hono keeps it in
 * the route's path (`/v1/*`); the values come from the request's path, so `/:tenant/*` works too.
 */
function mountOf(c) {
  const pattern = (c.req.routePath ?? "").split("/").filter(Boolean);
  if (pattern.at(-1) !== "*") return "";
  return c.req.path.split("/").slice(0, pattern.length).join("/");
}

/**
 * @param {object} options the options of the integration contract, plus `enabled`, `publicUiPath` and a
 *   `nonce` that may be a function of the request. `uiPath` is the path within the app or sub-app the
 *   middleware is registered in.
 * @param {object} runtime `{ embed, readAsset }`: @rapidoc/embed, and how to read a bundled file (null
 *   where there is no file system)
 */
export function createRapidocMiddleware(options = {}, runtime) {
  const { nonce, ...rest } = options;
  const respond = runtime.embed.createResponder(
    typeof nonce === "function" ? rest : options,
    runtime.readAsset ? { readAsset: runtime.readAsset } : {},
  );

  return async function rapidoc(c, next) {
    const mount = mountOf(c);
    const response = await respond({
      method: c.req.method,
      path: c.req.path.slice(mount.length) || "/",
      mount,
      ifNoneMatch: c.req.header("if-none-match"),
      nonce: typeof nonce === "function" ? nonce(c) : undefined,
    });
    if (!response) return next();
    return c.body(response.body, response.status, response.headers);
  };
}
