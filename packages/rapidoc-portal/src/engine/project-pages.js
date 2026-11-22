/**
 * A project's own pages: every .astro file under <project>/pages/ is a route of the portal, named
 * after its path as in Astro (`pages/pricing.astro` → /pricing, `pages/demo/index.astro` → /demo,
 * `pages/api/[...element].astro` → /api/[...element]). Files and folders that start with `_` or `.`
 * are not pages, so a page's helpers can sit next to it.
 *
 * The portal's own routes are reserved: a page that would take one stops the build. pages/index.astro
 * is the home page; docs/index.*, the home page otherwise, is then the page at /docs (config/normalizer.js).
 * pages/404.astro replaces the portal's 404 page (pages/not-found.astro).
 */

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const PAGES_DIRNAME = "pages";

const isHidden = (name) => name.startsWith("_") || name.startsWith(".");

function listAstroFiles(dir, relDir = "") {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (isHidden(entry.name)) continue;
    const relPath = path.join(relDir, entry.name);
    if (entry.isDirectory()) files.push(...listAstroFiles(path.join(dir, entry.name), relPath));
    else if (entry.name.endsWith(".astro")) files.push(relPath);
  }
  return files;
}

/** `examples/auth.astro` → `/examples/auth`; `index.astro` → `/`. */
export function routePattern(relPath) {
  const segments = relPath.replace(/\.astro$/, "").split(path.sep);
  if (segments.at(-1) === "index") segments.pop();
  return `/${segments.join("/")}`;
}

const isUnder = (pattern, prefix) => pattern === prefix || pattern.startsWith(`${prefix}/`);

/** Why the portal keeps this route for itself, or undefined when a project page may have it. */
function reservedReason(pattern, config) {
  if (isUnder(pattern, "/docs")) return "/docs is for the pages of docs/";
  if (isUnder(pattern, "/apis")) return "/apis is for the API reference";
  if (pattern === "/catalog") return "/catalog is the API catalog";
  if (isUnder(pattern, "/_rapidoc")) return "/_rapidoc is for the portal's own files";
  if (config.redirects.some((redirect) => redirect.from === pattern))
    return "`redirects` has an entry from this path";
}

/**
 * @param {string} projectDir - Folder containing rapidoc.config.yaml
 * @param {object} config - Normalized rapidoc.config.yaml
 * @returns {{ pattern: string, file: string, entrypoint: URL }[]} Sorted by route; `file` is the absolute path
 * @throws {Error} Naming every page whose route is reserved or taken by another page
 */
export function listProjectPages(projectDir, config) {
  const pagesDir = path.join(projectDir, PAGES_DIRNAME);
  const pages = listAstroFiles(pagesDir)
    .map((relPath) => {
      const file = path.join(pagesDir, relPath);
      // A file URL, not a path string: Astro reads a string entrypoint as relative to its root.
      return { pattern: routePattern(relPath), file, entrypoint: pathToFileURL(file), relPath };
    })
    .sort((a, b) => a.pattern.localeCompare(b.pattern));

  const problems = [];
  const byPattern = new Map();
  for (const page of pages) {
    const name = `${PAGES_DIRNAME}/${page.relPath.split(path.sep).join("/")}`;
    const reason = reservedReason(page.pattern, config);
    if (reason) problems.push(`${name}: ${reason}`);
    const other = byPattern.get(page.pattern);
    if (other) problems.push(`${name}: ${other} is the same page (${page.pattern})`);
    else byPattern.set(page.pattern, name);
  }
  if (problems.length > 0)
    throw new Error(`These pages can't be built:\n${problems.map((p) => `  - ${p}`).join("\n")}`);

  return pages.map(({ pattern, file, entrypoint }) => ({ pattern, file, entrypoint }));
}
