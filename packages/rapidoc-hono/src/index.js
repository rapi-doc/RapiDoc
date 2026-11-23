// @rapidoc/hono for Node, Bun and Deno: serves the page and the rapidoc bundle that is installed with
// this package. On runtimes without a file system (Cloudflare Workers), import "@rapidoc/hono/edge".
import * as embed from "@rapidoc/embed";
import { readAsset } from "@rapidoc/embed/node";
import { createRapidocMiddleware } from "./middleware.js";

/**
 * Hono middleware that serves an API reference: `app.use(rapidoc({ specUrl: "/openapi.json" }))`.
 * It answers GET and HEAD on `uiPath` (default `/docs`) and the files under it, and passes on the rest.
 * `uiPath` is the path within the app: under `basePath("/v1")` or `app.route("/v1", sub)` the page is at
 * `/v1/docs`.
 */
export function rapidoc(options = {}) {
  return createRapidocMiddleware(options, { embed, readAsset });
}

/** The version of rapidoc this package serves. */
export const rapidocVersion = embed.rapidocManifest.version;
