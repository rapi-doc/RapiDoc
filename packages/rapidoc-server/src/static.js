import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { getMimeType } from "hono/utils/mime";

/**
 * Maps URL paths to built files and streams them. A built portal uses directory URLs
 * (`/docs/intro/` → docs/intro/index.html); `/docs/intro` is served the same way.
 */

export const NO_STORE = "private, no-store";
const IMMUTABLE = "public, max-age=31536000, immutable";
const REVALIDATE = "public, max-age=0, must-revalidate";

/**
 * URL path → relative file paths to try, or null when the path is invalid (bad encoding, `..`, NUL).
 *
 * @param {string} urlPath - Pathname as received (still percent-encoded)
 */
export function candidateFiles(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }
  if (decoded.includes("\0") || decoded.includes("\\")) return null;
  const segments = decoded.split("/").filter(Boolean);
  if (segments.some((segment) => segment === ".." || segment === ".")) return null;
  const rel = segments.join("/");
  if (!rel) return ["index.html"];
  return decoded.endsWith("/") ? [`${rel}/index.html`] : [rel, `${rel}/index.html`];
}

/** First candidate that is a file inside `root`. */
export function findFile(root, candidates) {
  if (!root) return null;
  for (const rel of candidates) {
    const full = path.join(root, rel);
    if (!full.startsWith(root + path.sep)) continue;
    try {
      if (fs.statSync(full).isFile()) return { rel, full };
    } catch {
      // not there
    }
  }
  return null;
}

/** Cache-Control for a public file: hashed build assets (`_rapidoc/assets/`) are immutable, the rest revalidates. */
export function publicCacheControl(rel) {
  return rel.startsWith("_rapidoc/assets/") ? IMMUTABLE : REVALIDATE;
}

/**
 * Streams a file. `cacheControl` NO_STORE also sets `Vary: Cookie`, for anything that depends on the session.
 *
 * @param {Request} request
 * @param {string} full - Absolute file path
 */
export function fileResponse(request, full, { status = 200, cacheControl = REVALIDATE } = {}) {
  const headers = new Headers({
    "content-type": getMimeType(full) || "application/octet-stream",
    "content-length": String(fs.statSync(full).size),
    "cache-control": cacheControl,
    "x-content-type-options": "nosniff",
  });
  if (cacheControl === NO_STORE) headers.set("vary", "Cookie");
  const body = request.method === "HEAD" ? null : Readable.toWeb(fs.createReadStream(full));
  return new Response(body, { status, headers });
}

export function textResponse(status, text, extraHeaders = {}) {
  return new Response(text, {
    status,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": NO_STORE,
      vary: "Cookie",
      ...extraHeaders,
    },
  });
}
