import fs from "node:fs";
import yaml from "yaml";
import { getSpecNavigation, toKebabCase } from "@rapidoc/prerender";
import { resolveSpecInput } from "@rapidoc/prerender/internal";
import { API_PATH } from "../config/normalizer.js";

/**
 * The pages of the API reference route (/apis/[...apiRoute], pages/api-reference.astro). Each version of an
 * API has an overview and one page per tag; the default version is at /apis/<id>, the others at
 * /apis/<id>/<version>. For a versioned API, /apis/<id>/<default version>[/<tag>] redirects to the
 * unversioned page, so a link pinned to a version keeps working after another version becomes the default.
 */

/** A version's local spec as an object, or null when it is remote or cannot be read. */
export function readVersionSpec(version) {
  if (version.isRemote || !version.fullPath || !fs.existsSync(version.fullPath)) return null;
  const raw = fs.readFileSync(version.fullPath, "utf8");
  try {
    return JSON.parse(raw);
  } catch {
    try {
      return yaml.parse(raw);
    } catch {
      return null;
    }
  }
}

/** Parsed specs of this process, so a build reads each spec once for its page list and all its sidebars. */
const loadedSpecs = new Map();

/**
 * A version's spec, loaded and parsed for the sidebar (`renderNavBarHtml`) and the page list: a local
 * file is read again when it changes; a remote spec (`spec:` is a URL) is fetched once per run, so a
 * running dev server keeps the copy it fetched.
 *
 * Throws, naming the API and the spec, when the spec cannot be read, fetched or parsed. A build stops
 * there: an API page without its sidebar is never written.
 */
export function loadVersionSpec(api, version) {
  const location = version.fullPath || version.spec;
  let key = location;
  if (!version.isRemote && fs.existsSync(location)) key += `:${fs.statSync(location).mtimeMs}`;
  if (!loadedSpecs.has(key)) {
    const loading = resolveSpecInput(location).catch((err) => {
      loadedSpecs.delete(key); // the next request tries again
      const which = api.versioned
        ? `API "${api.id}", version "${version.version}"`
        : `API "${api.id}"`;
      const said = err.message.replace(/^Cannot load the OpenAPI spec/, "cannot load its spec");
      throw new Error(`${which}: ${said}`, { cause: err });
    });
    loadedSpecs.set(key, loading);
  }
  return loadedSpecs.get(key);
}

/**
 * Slugs of a spec's tag pages: the tags the sidebar links to (getNavBarHtml), including tags that operations
 * use without declaring them in the spec's top-level `tags`.
 *
 * @param {object} spec - A spec object, or the parsed model of `loadVersionSpec`
 */
export async function tagSlugsOf(spec) {
  const { tags } = await getSpecNavigation(spec);
  return [...new Set(tags.map((t) => toKebabCase(t.name)))].filter(
    (slug) => slug && slug !== "general",
  );
}

/**
 * A spec that cannot be loaded (a local file that does not parse, a URL that does not answer) throws,
 * which stops a build. With `deferSpecErrors` (the dev server) the API keeps its overview page, whose
 * props carry `specError`, so only that page shows the error.
 *
 * @param {object[]} apis - Normalized `apis` (normalizer.js)
 * @param {{ deferSpecErrors?: boolean }} [options]
 * @returns {Promise<Array<{params: {apiRoute: string}, props: object}>>} Props: api, version, versionTags
 *   (tag slugs per version, in `api.versions` order), activeTagSlug, currentPath, or redirectTo; with
 *   `deferSpecErrors`, also specError.
 */
export async function apiReferencePaths(apis = [], { deferSpecErrors = false } = {}) {
  const paths = [];
  const route = (urlPath) => urlPath.slice(`${API_PATH}/`.length);

  for (const api of apis) {
    const versionTags = [];
    const specErrors = [];
    for (const version of api.versions) {
      try {
        versionTags.push(await tagSlugsOf(await loadVersionSpec(api, version)));
        specErrors.push(undefined);
      } catch (err) {
        if (!deferSpecErrors) throw err;
        versionTags.push([]);
        specErrors.push(err.message);
      }
    }
    const [defaultTags] = versionTags;

    api.versions.forEach((version, i) => {
      if (!version.isDefault && defaultTags.includes(version.version)) {
        throw new Error(
          `API "${api.id}": version "${version.version}" has the URL of a tag page of the default version (${version.path}); give it another version in apis.`,
        );
      }
      const page = { api, version, versionTags };
      if (specErrors[i]) page.specError = specErrors[i];
      paths.push({
        params: { apiRoute: route(version.path) },
        props: { ...page, activeTagSlug: "", currentPath: version.path },
      });
      for (const tagSlug of versionTags[i]) {
        const currentPath = `${version.path}/${tagSlug}`;
        paths.push({
          params: { apiRoute: route(currentPath) },
          props: { ...page, activeTagSlug: tagSlug, currentPath },
        });
      }
      if (api.versioned && version.isDefault) {
        const pinned = `${api.path}/${version.version}`;
        for (const suffix of ["", ...versionTags[i].map((tag) => `/${tag}`)]) {
          paths.push({
            params: { apiRoute: route(pinned + suffix) },
            props: { ...page, redirectTo: version.path + suffix },
          });
        }
      }
    });
  }
  return paths;
}
