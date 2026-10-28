/**
 * Copies the non-doc files a portal needs into the temp workspace's public/ folder:
 * OpenAPI specs, the RapiDoc web component bundle, and the full-text search index.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSearchIndex } from '../search/indexer.js';

/** Markers that only exist in RapiDoc bundles new enough for portal navigation sync. */
const REQUIRED_BUNDLE_MARKERS = ['nav-active-change', 'slugger'];

export class StaleRapidocBundleError extends Error {
  constructor(bundlePath, reason) {
    super(`RapiDoc bundle is ${reason}: ${bundlePath}\nRun \`npm run build:rapidoc\` from the RapiDoc monorepo root and try again.`);
    this.name = 'StaleRapidocBundleError';
  }
}

/**
 * Copies every local spec referenced in `apis:` to public/specs/<api id><ext> (its `specUrl`).
 */
export function copySpecs(portalConfig, publicDir) {
  fs.mkdirSync(path.join(publicDir, 'specs'), { recursive: true });
  for (const api of portalConfig.apis || []) {
    if (!api.isRemote && api.fullPath && fs.existsSync(api.fullPath)) {
      fs.copyFileSync(api.fullPath, path.join(publicDir, api.specUrl));
    }
  }
}

function newestMtimeMs(dir) {
  let newest = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true, recursive: true })) {
    if (entry.isFile()) newest = Math.max(newest, fs.statSync(path.join(entry.parentPath, entry.name)).mtimeMs);
  }
  return newest;
}

/**
 * Finds the `rapidoc` package's dist/rapidoc-min.js and throws if it is missing or stale.
 * "Stale" means it lacks portal navigation support, or (in a source checkout) is older than src/.
 */
export function resolveRapidocBundle() {
  const bundlePath = fileURLToPath(import.meta.resolve('rapidoc'));
  if (!fs.existsSync(bundlePath)) throw new StaleRapidocBundleError(bundlePath, 'missing');

  const content = fs.readFileSync(bundlePath, 'utf8');
  if (!REQUIRED_BUNDLE_MARKERS.every((marker) => content.includes(marker))) {
    throw new StaleRapidocBundleError(bundlePath, 'outdated (no portal navigation support)');
  }

  const srcDir = path.resolve(path.dirname(bundlePath), '../src');
  if (fs.existsSync(srcDir) && newestMtimeMs(srcDir) > fs.statSync(bundlePath).mtimeMs) {
    throw new StaleRapidocBundleError(bundlePath, 'older than its source');
  }

  return bundlePath;
}

/** Where RapiDoc's OAuth popup returns to (the `oauth-receiver` attribute of every RapiDoc element). */
export const OAUTH_RECEIVER_PATH = '/oauth-receiver.html';

const OAUTH_RECEIVER_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex" />
    <title>Signing in…</title>
    <script type="module" src="/assets/rapidoc-min.js"></script>
  </head>
  <body>
    <oauth-receiver></oauth-receiver>
  </body>
</html>
`;

/**
 * Copies the RapiDoc bundle to public/assets/rapidoc-min.js, and writes public/oauth-receiver.html, the page
 * RapiDoc's OAuth popup (Authorize button) returns to. One page at the site root, so an OAuth provider needs one
 * redirect URL for the whole portal.
 */
export function copyRapidocBundle(publicDir) {
  const assetsDir = path.join(publicDir, 'assets');
  fs.mkdirSync(assetsDir, { recursive: true });
  fs.copyFileSync(resolveRapidocBundle(), path.join(assetsDir, 'rapidoc-min.js'));
  fs.writeFileSync(path.join(publicDir, OAUTH_RECEIVER_PATH), OAUTH_RECEIVER_HTML, 'utf8');
}

/**
 * Writes public/search-index.json covering the docs and the OpenAPI specs.
 */
export function writeSearchIndex(portalConfig, projectDir, docFiles, publicDir) {
  const searchIndex = buildSearchIndex(portalConfig, projectDir, docFiles);
  fs.writeFileSync(path.join(publicDir, 'search-index.json'), JSON.stringify(searchIndex), 'utf8');
}
