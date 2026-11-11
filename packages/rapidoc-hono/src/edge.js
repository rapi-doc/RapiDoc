// @rapidoc/hono for runtimes without a file system (Cloudflare Workers, Vercel Edge). Same middleware;
// the browser loads the pinned rapidoc version from the CDN, checked against its SRI hash.
import * as embed from "@rapidoc/embed";
import { createRapidocMiddleware } from "./middleware.js";

export function rapidoc(options = {}) {
  return createRapidocMiddleware(options, { embed, readAsset: null, defaultAssets: "cdn" });
}

export const rapidocVersion = embed.rapidocManifest.version;
