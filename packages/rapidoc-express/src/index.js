// @rapidoc/express: an Express middleware over the responder of @rapidoc/embed. It also runs under Connect
// and a plain node:http server, since it only reads `req.method`, `req.url` and the request headers.
import { createResponder, rapidocManifest } from "@rapidoc/embed";
import { readAsset } from "@rapidoc/embed/node";

/**
 * `app.use(rapidoc({ specUrl: "/openapi.json" }))` serves an API reference at `path` (default `/docs`).
 * It answers GET and HEAD on that path and the files under it, and calls `next()` for everything else.
 * Mounted under a prefix, `app.use("/api", rapidoc())`, the page's URLs include the prefix.
 */
export function rapidoc(options = {}) {
  const { nonce, ...rest } = options;
  const respond = createResponder(typeof nonce === "function" ? rest : options, { readAsset });

  return function rapidocMiddleware(req, res, next) {
    // Under a mount point Express strips it from req.url and keeps it in req.baseUrl
    const path = (req.path ?? new URL(req.url, "http://localhost").pathname) || "/";
    const mount = req.baseUrl ?? "";
    respond({
      method: req.method,
      path,
      ifNoneMatch: req.headers["if-none-match"],
      publicPath: mount && !options.publicPath ? `${mount}${options.path ?? "/docs"}` : undefined,
      nonce: typeof nonce === "function" ? nonce(req, res) : undefined,
    })
      .then((response) => {
        if (!response) return next?.();
        res.writeHead(response.status, response.headers);
        res.end(req.method === "HEAD" ? undefined : (response.body ?? undefined));
      })
      .catch((error) => (next ? next(error) : res.destroy(error)));
  };
}

/** The version of rapidoc this package serves. */
export const rapidocVersion = rapidocManifest.version;
