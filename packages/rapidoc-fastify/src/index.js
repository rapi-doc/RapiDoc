// @rapidoc/fastify: a Fastify plugin over the responder of @rapidoc/embed.
import { createResponder, embedRoutes, rapidocManifest } from "@rapidoc/embed";
import { readAsset } from "@rapidoc/embed/node";

/**
 * `fastify.register(rapidoc, { specUrl: "/openapi.json" })` serves an API reference at `uiPath` (default
 * `/docs`). Registered with a `prefix`, the routes and the page's URLs include it. The routes are hidden
 * from @fastify/swagger.
 */
export async function rapidoc(fastify, options = {}) {
  const { nonce, prefix: _prefix, ...rest } = options;
  if (rest.enabled === false) return;
  const respond = createResponder(rest, { readAsset });
  const mount = fastify.prefix ?? "";
  const config = fastify.initialConfig ?? {};
  const ignoresTrailingSlash =
    config.routerOptions?.ignoreTrailingSlash ?? config.ignoreTrailingSlash ?? false;

  for (const route of embedRoutes(rest)) {
    // The contract serves the page at `{uiPath}/` too. At the root of the plugin Fastify adds that route
    // itself (`prefixTrailingSlash`), and an instance that ignores trailing slashes needs no second one.
    const urls =
      route.kind === "page" && route.path !== "/" && !ignoresTrailingSlash
        ? [route.path, `${route.path}/`]
        : [route.path];
    for (const url of urls) {
      fastify.route({
        method: ["GET", "HEAD"],
        url,
        schema: { hide: true },
        async handler(request, reply) {
          const response = await respond({
            method: request.method,
            path: route.path,
            mount,
            ifNoneMatch: request.headers["if-none-match"],
            nonce: typeof nonce === "function" ? nonce(request, reply) : nonce,
          });
          reply.code(response.status).headers(response.headers);
          return reply.send(response.body ?? "");
        },
      });
    }
  }
}

export default rapidoc;

/** The version of rapidoc this package serves. */
export const rapidocVersion = rapidocManifest.version;
