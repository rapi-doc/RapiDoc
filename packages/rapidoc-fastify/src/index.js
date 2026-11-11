// @rapidoc/fastify: a Fastify plugin over the responder of @rapidoc/embed.
import { createResponder, embedRoutes, rapidocManifest, uiPathOf } from "@rapidoc/embed";
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
  const prefix = (fastify.prefix ?? "").replace(/\/+$/, "");
  const publicUiPath = rest.publicUiPath ?? rest.publicPath ?? `${prefix}${uiPathOf(rest)}`;

  for (const route of embedRoutes(rest)) {
    fastify.route({
      method: ["GET", "HEAD"],
      url: route.path,
      schema: { hide: true },
      async handler(request, reply) {
        const response = await respond({
          method: request.method,
          path: route.path,
          ifNoneMatch: request.headers["if-none-match"],
          publicUiPath,
          nonce: typeof nonce === "function" ? nonce(request, reply) : nonce,
        });
        reply.code(response.status).headers(response.headers);
        return reply.send(response.body ?? "");
      },
    });
  }
}

export default rapidoc;

/** The version of rapidoc this package serves. */
export const rapidocVersion = rapidocManifest.version;
