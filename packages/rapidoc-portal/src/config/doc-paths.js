/**
 * Docs files and their pages: which files of docs/ are pages, and the address each gets. The one place
 * for these rules; the config (navigation), the docs sync, the search index and the llms output use it.
 *
 *   quickstart.md          /docs/quickstart/
 *   guides/index.mdx       /docs/guides/         a folder's index page is the folder's page
 *   index.markdoc          /                     the home page, or /docs/ when the project has its own
 *                                                (pages/index.astro: `docs.home` is false)
 */

import path from "node:path";

/** What a docs page can be written in. Synced .markdoc files are .mdoc in the workspace. */
export const DOC_EXTENSIONS = [".md", ".mdx", ".markdoc"];

const DOC_EXTENSION = /\.(md|mdx|markdoc|mdoc)$/i;
const HOME_DOC = /^index\.(md|mdx|markdoc)$/i;

const toPosix = (filePath) => filePath.split(path.sep).join("/");

export function isDocFile(fileName) {
  return DOC_EXTENSIONS.includes(path.extname(fileName).toLowerCase());
}

/** docs/index.*: the file at the root of docs/, not a folder's index page. */
export function isHomeDocFile(relPath) {
  return HOME_DOC.test(toPosix(relPath));
}

/**
 * A page's slug from its path in docs/ or from a slug as written in the config:
 * `guides/first-shipment.md` and `/guides/first-shipment/` → `guides/first-shipment`;
 * `guides/index.md` → `guides`; `index.md` → ``.
 */
export function docSlug(relPathOrSlug) {
  return toPosix(relPathOrSlug)
    .replace(/^\/+|\/+$/g, "")
    .replace(DOC_EXTENSION, "")
    .replace(/(^|\/)index$/, "");
}

/** `guides` → `/docs/guides/`; `` → `/docs/`. */
export function docUrl(slug) {
  return slug ? `/docs/${slug}/` : "/docs/";
}

/**
 * The address of a file of docs/.
 *
 * @param {string} relPath - The file's path in docs/
 * @param {{ home?: boolean }} [options] - home: docs/index.* is the home page (default true), else /docs/
 */
export function docPageUrl(relPath, { home = true } = {}) {
  return home && isHomeDocFile(relPath) ? "/" : docUrl(docSlug(relPath));
}
