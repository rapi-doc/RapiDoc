/**
 * Copies the non-doc files a portal needs into the temp workspace's public/ folder:
 * OpenAPI specs, the RapiDoc web component bundle, and the full-text search index.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSearchIndex } from "../search/indexer.js";

/** Markers that only exist in RapiDoc bundles new enough for portal navigation sync. */
const REQUIRED_BUNDLE_MARKERS = ["nav-active-change", "slugger"];

export class StaleRapidocBundleError extends Error {
  constructor(bundlePath, reason) {
    super(
      `RapiDoc bundle is ${reason}: ${bundlePath}\nRun \`npm run build:rapidoc\` from the RapiDoc monorepo root and try again.`,
    );
    this.name = "StaleRapidocBundleError";
  }
}

/**
 * Copies every local spec referenced in `apis:` to its `specUrl` (public/specs/<api id><ext> for the default
 * version, public/specs/<api id>/<version><ext> for the others) and, for a versioned API, to the
 * `pinnedSpecUrl` of each version.
 */
export function copySpecs(portalConfig, publicDir) {
  fs.mkdirSync(path.join(publicDir, "specs"), { recursive: true });
  for (const api of portalConfig.apis || []) {
    for (const version of api.versions) {
      if (version.isRemote || !version.fullPath || !fs.existsSync(version.fullPath)) continue;
      for (const url of new Set([version.specUrl, version.pinnedSpecUrl].filter(Boolean))) {
        const target = path.join(publicDir, url);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.copyFileSync(version.fullPath, target);
      }
    }
  }
}

/** Copies every Arazzo file of `workflows:` to its `url` (public/workflows/<id>.arazzo<ext>). */
export function copyWorkflows(portalConfig, publicDir) {
  for (const workflow of portalConfig.workflows || []) {
    if (!fs.existsSync(workflow.fullPath)) continue;
    const target = path.join(publicDir, workflow.url);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(workflow.fullPath, target);
  }
}

const isHidden = (relativePath) =>
  relativePath.split(path.sep).some((part) => part.startsWith("."));

/**
 * Newest modification time of the files under `dir`. Dotfiles and dot-folders (Finder's .DS_Store, editor
 * settings) are not source, so they are skipped: opening src/ in Finder must not make the bundle look stale.
 */
export function newestSourceMtimeMs(dir) {
  let newest = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile()) continue;
    const file = path.join(entry.parentPath, entry.name);
    if (isHidden(path.relative(dir, file))) continue;
    newest = Math.max(newest, fs.statSync(file).mtimeMs);
  }
  return newest;
}

/**
 * True when `bundlePath` is in a source checkout of rapidoc (the monorepo, where node_modules/rapidoc is
 * a symlink to packages/rapidoc), false when it is an installed package. An installed package's files
 * get their install time as mtime, a few milliseconds apart, so comparing them says nothing.
 */
export function isSourceCheckout(bundlePath) {
  return !fs.realpathSync(bundlePath).split(path.sep).includes("node_modules");
}

/**
 * Finds the `rapidoc` package's dist/rapidoc-min.js and throws if it is missing or stale.
 * "Stale" means it lacks portal navigation support, or (in a source checkout) is older than src/.
 */
export function resolveRapidocBundle() {
  const bundlePath = fileURLToPath(import.meta.resolve("rapidoc"));
  if (!fs.existsSync(bundlePath)) throw new StaleRapidocBundleError(bundlePath, "missing");

  const content = fs.readFileSync(bundlePath, "utf8");
  if (!REQUIRED_BUNDLE_MARKERS.every((marker) => content.includes(marker))) {
    throw new StaleRapidocBundleError(bundlePath, "outdated (no portal navigation support)");
  }

  const srcDir = path.resolve(path.dirname(bundlePath), "../src");
  if (
    isSourceCheckout(bundlePath) &&
    fs.existsSync(srcDir) &&
    newestSourceMtimeMs(srcDir) > fs.statSync(bundlePath).mtimeMs
  ) {
    throw new StaleRapidocBundleError(bundlePath, "older than its source");
  }

  return bundlePath;
}

/**
 * Copies a RapiDoc bundle with its `<bundle>.LICENSE.txt` (the notices of the third-party code built into
 * it, which the bundle's banner points to), when the build wrote one.
 */
function copyBundle(bundlePath, target) {
  fs.copyFileSync(bundlePath, target);
  const notices = `${bundlePath}.LICENSE.txt`;
  if (fs.existsSync(notices)) fs.copyFileSync(notices, `${target}.LICENSE.txt`);
}

/** The URL of the <rapi-flow> bundle, copied only for portals with `workflows:`. */
export const FLOW_BUNDLE_PATH = "/assets/rapidoc-flow-min.js";

/**
 * Copies rapidoc's dist/rapidoc-flow-min.js (the <rapi-flow> element, which draws and runs
 * workflows) to public/assets/, when the portal has `workflows:`. The bundle is built with
 * rapidoc-min.js, so resolveRapidocBundle() already checked that the build is current.
 */
export function copyRapidocFlowBundle(portalConfig, publicDir) {
  if (!portalConfig.workflows?.length) return;
  const bundlePath = fileURLToPath(import.meta.resolve("rapidoc/flow"));
  if (!fs.existsSync(bundlePath)) throw new StaleRapidocBundleError(bundlePath, "missing");
  fs.mkdirSync(path.join(publicDir, "assets"), { recursive: true });
  copyBundle(bundlePath, path.join(publicDir, FLOW_BUNDLE_PATH));
}

/** Where RapiDoc's OAuth popup returns to (the `oauth-receiver` attribute of every RapiDoc element). */
export const OAUTH_RECEIVER_PATH = "/oauth-receiver.html";

const OAUTH_RECEIVER_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex" />
    <title>Signing in…</title>
    <script type="module" src="assets/rapidoc-min.js"></script>
  </head>
  <body>
    <oauth-receiver></oauth-receiver>
  </body>
</html>
`;

/**
 * Copies the RapiDoc bundle to public/assets/rapidoc-min.js (with its .LICENSE.txt), and writes public/oauth-receiver.html, the page
 * RapiDoc's OAuth popup (Authorize button) returns to. One page at the site root, so an OAuth provider needs one
 * redirect URL for the whole portal.
 */
export function copyRapidocBundle(publicDir) {
  const assetsDir = path.join(publicDir, "assets");
  fs.mkdirSync(assetsDir, { recursive: true });
  copyBundle(resolveRapidocBundle(), path.join(assetsDir, "rapidoc-min.js"));
  fs.writeFileSync(path.join(publicDir, OAUTH_RECEIVER_PATH), OAUTH_RECEIVER_HTML, "utf8");
}

/**
 * With `site.noindex`, writes a public/robots.txt that keeps every crawler out, unless the project has its
 * own robots.txt.
 */
export function writeRobotsTxt(portalConfig, publicDir) {
  const file = path.join(publicDir, "robots.txt");
  if (portalConfig.site.noindex && !fs.existsSync(file))
    fs.writeFileSync(file, "User-agent: *\nDisallow: /\n", "utf8");
}

/**
 * Writes public/search-index.json covering the docs and the OpenAPI specs.
 */
export function writeSearchIndex(portalConfig, projectDir, docFiles, publicDir) {
  const searchIndex = buildSearchIndex(portalConfig, projectDir, docFiles);
  fs.writeFileSync(path.join(publicDir, "search-index.json"), JSON.stringify(searchIndex), "utf8");
}
