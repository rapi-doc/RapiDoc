// The Hono side of a RapiDoc integration: hands the request to the responder of @rapidoc/embed and turns
// its answer into a Hono response. No Node API here, so both entries share it: ./index.js (reads the
// bundle from disk) and ./edge.js (no file system; the bundle comes from the CDN or a URL of your own).

/**
 * @param {object} options the options of the integration contract, plus `enabled`, `publicUiPath` and a
 *   `nonce` that may be a function of the request
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
    const response = await respond({
      method: c.req.method,
      path: new URL(c.req.url).pathname,
      ifNoneMatch: c.req.header("if-none-match"),
      nonce: typeof nonce === "function" ? nonce(c) : undefined,
    });
    if (!response) return next();
    return c.body(response.body, response.status, response.headers);
  };
}
