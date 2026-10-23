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
 * Copies every local spec referenced in `apis:` to public/specs/<file name>.
 */
export function copySpecs(portalConfig, publicDir) {
  const specsDir = path.join(publicDir, 'specs');
  fs.mkdirSync(specsDir, { recursive: true });
  for (const api of portalConfig.apis || []) {
    if (!api.isRemote && api.fullPath && fs.existsSync(api.fullPath)) {
      fs.copyFileSync(api.fullPath, path.join(specsDir, path.basename(api.fullPath)));
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

/**
 * Copies the RapiDoc bundle to public/assets/rapidoc-min.js.
 */
export function copyRapidocBundle(publicDir) {
  const assetsDir = path.join(publicDir, 'assets');
  fs.mkdirSync(assetsDir, { recursive: true });
  fs.copyFileSync(resolveRapidocBundle(), path.join(assetsDir, 'rapidoc-min.js'));
}

/**
 * Writes public/search-index.json covering the docs and the OpenAPI specs.
 */
export function writeSearchIndex(portalConfig, projectDir, docFiles, publicDir) {
  const searchIndex = buildSearchIndex(portalConfig, projectDir, docFiles);
  fs.writeFileSync(path.join(publicDir, 'search-index.json'), JSON.stringify(searchIndex), 'utf8');
}
