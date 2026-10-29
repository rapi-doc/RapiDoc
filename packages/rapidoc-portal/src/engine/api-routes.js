import fs from "node:fs";
import yaml from "yaml";
import { getSpecNavigation, toKebabCase } from "rapidoc/static";
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

/**
 * Slugs of a spec's tag pages: the tags the sidebar links to (getNavBarHtml), including tags that operations
 * use without declaring them in the spec's top-level `tags`.
 */
export async function tagSlugsOf(specData) {
  if (!specData) return [];
  try {
    const { tags } = await getSpecNavigation(specData);
    return [...new Set(tags.map((t) => toKebabCase(t.name)))].filter(
      (slug) => slug && slug !== "general",
    );
  } catch {
    return []; // the API keeps its overview page
  }
}

/**
 * @param {object[]} apis - Normalized `apis` (normalizer.js)
 * @returns {Promise<Array<{params: {apiRoute: string}, props: object}>>} Props: api, version, versionTags
 *   (tag slugs per version, in `api.versions` order), activeTagSlug, currentPath, or redirectTo.
 */
export async function apiReferencePaths(apis = []) {
  const paths = [];
  const route = (urlPath) => urlPath.slice(`${API_PATH}/`.length);

  for (const api of apis) {
    const versionTags = [];
    for (const version of api.versions)
      versionTags.push(await tagSlugsOf(readVersionSpec(version)));
    const [defaultTags] = versionTags;

    api.versions.forEach((version, i) => {
      if (!version.isDefault && defaultTags.includes(version.version)) {
        throw new Error(
          `API "${api.id}": version "${version.version}" has the URL of a tag page of the default version (${version.path}); give it another version in apis.`,
        );
      }
      const page = { api, version, versionTags };
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
