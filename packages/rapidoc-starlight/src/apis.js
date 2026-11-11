// What the plugin works out at build time, with no Astro or Starlight import: the options as given become,
// per API, the spec (loaded from a file, a URL or an object), the attributes of <rapi-doc> and the sidebar
// entries for its tags and operations.
import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { normalizePath, toAttributes, inlineJson } from "@rapidoc/embed/core";
import { operationClass, sidebarCss, sidebarMethods } from "@rapidoc/embed/sidebar";
import { getSpecNavigation } from "@rapidoc/prerender";

/**
 * How <rapi-doc> sits in a Starlight page: Starlight's sidebar and header replace its own, the page
 * scrolls instead of the element, and its colours follow the site's light and dark themes.
 */
export const PAGE_ATTRIBUTES = {
  "render-style": "focused",
  "show-header": "false",
  "show-side-nav": "false",
  "auto-height": "true",
  "color-scheme": "auto",
  "allow-spec-url-load": "false",
  "allow-spec-file-load": "false",
};

const isUrl = (value) => /^https?:\/\//i.test(value);

/** The OpenAPI document as an object: from a file (JSON or YAML, relative to `root`), a URL or as given. */
export async function loadSpec(spec, root) {
  if (spec && typeof spec === "object") return spec;
  if (typeof spec !== "string" || spec === "") {
    throw new TypeError(
      "@rapidoc/starlight: each API needs `spec`: a file path, a URL or an object",
    );
  }
  let text;
  if (isUrl(spec)) {
    const response = await fetch(spec);
    if (!response.ok) {
      throw new Error(`@rapidoc/starlight: ${spec} answered ${response.status}`);
    }
    text = await response.text();
  } else {
    const file = path.resolve(root, spec);
    if (!fs.existsSync(file)) throw new Error(`@rapidoc/starlight: spec file not found: ${file}`);
    text = fs.readFileSync(file, "utf8");
  }
  const document = parse(text);
  if (!document || typeof document !== "object") {
    throw new Error(`@rapidoc/starlight: ${spec} is not an OpenAPI document`);
  }
  return document;
}

/** `/docs/api/` → `/docs/api`; `uiPath` is required, and the site root is not allowed (Starlight owns it). */
function apiUiPath(api) {
  // `path` was this option's name in 0.1
  const normalized = normalizePath(api.uiPath ?? api.path ?? "");
  if (normalized === "") {
    throw new TypeError('@rapidoc/starlight: each API needs `uiPath`, for example "/api"');
  }
  return normalized;
}

/** A page URL under the site's `base`, with the trailing slash the site uses. */
export function pageUrl(base, pagePath, trailingSlash = "ignore") {
  const prefix = normalizePath(base ?? "/");
  return `${prefix}${pagePath}${trailingSlash === "never" ? "" : "/"}`;
}

/** The method in front of each operation link, in RapiDoc's colours, and deprecated ones struck through. */
export const SIDEBAR_CSS = sidebarCss({
  label: (className) => `a.${className}::before`,
  text: (className) => `a.${className} > span`,
  dark: ":root[data-theme='dark']",
  // Starlight fills the current item with its accent colour
  active: "a.rapidoc-op[aria-current='page']::before",
});

const operationLabel = (operation) => operation.summary || `${operation.method} ${operation.path}`;

function tagItems(tag, href, methods) {
  return tag.paths.map((operation) => ({
    label: operationLabel(operation),
    link: `${href}#${operation.elementId}`,
    attrs: {
      "data-rapidoc-op": operation.elementId,
      "data-method": operation.method,
      // the method label and the deprecated mark are drawn by SIDEBAR_CSS from these classes
      class: operationClass(operation, methods),
      ...(operation.deprecated ? { title: "Deprecated" } : {}),
    },
  }));
}

/**
 * The Starlight sidebar group of one API: an overview link, then a group per tag with its operations.
 * Links point into the API's page (`#<operation id>`); <rapi-doc> shows the operation the hash names.
 */
export function sidebarGroup(api, navigation, href) {
  const tags = navigation.tagGroups.length
    ? [...navigation.tagGroups.flatMap((group) => group.tags), ...navigation.remainingTags]
    : navigation.tags;
  const items = [{ label: "Overview", link: href, attrs: { "data-rapidoc-op": "overview" } }];
  for (const tag of tags) {
    if (tag.paths.length === 0) continue;
    items.push({
      label: tag.displayName || tag.name,
      collapsed: api.sidebar?.collapsed ?? false,
      items: tagItems(tag, href, api.sidebar?.methods),
    });
  }
  return { label: api.label ?? api.title, collapsed: false, items };
}

/**
 * Resolves the plugin's options against the site.
 * @returns {Promise<{ apis: object[], sidebar: object[] }>} `apis` is what the pages render (JSON-safe);
 *   `sidebar` is the groups to append to Starlight's sidebar.
 */
export async function resolveApis(userOptions, site) {
  const list = Array.isArray(userOptions?.apis)
    ? userOptions.apis
    : userOptions
      ? [userOptions]
      : [];
  if (list.length === 0) {
    throw new TypeError("@rapidoc/starlight: give at least one API: { uiPath, spec }");
  }
  const apis = [];
  const sidebar = [];
  const seen = new Set();
  for (const given of list) {
    const pagePath = apiUiPath(given);
    if (seen.has(pagePath)) {
      throw new TypeError(`@rapidoc/starlight: two APIs use the uiPath ${pagePath}`);
    }
    seen.add(pagePath);
    if (given.sidebar) sidebarMethods(given.sidebar.methods); // fail on a wrong value before building

    const spec = await loadSpec(given.spec, site.root);
    const navigation = await getSpecNavigation(structuredClone(spec));
    const title = given.title ?? navigation.title ?? "API Reference";
    const href = pageUrl(site.base, pagePath, site.trailingSlash);
    const receiver = pageUrl(site.base, `${pagePath}/oauth-receiver`, site.trailingSlash);

    // The contract's attribute rules (names, booleans, sorting); the page defaults first, the user's last
    const attributes = Object.fromEntries(
      toAttributes({
        uiPath: pagePath,
        options: {
          ...PAGE_ATTRIBUTES,
          "oauth-receiver": receiver,
          ...(isUrl(given.spec) ? { "spec-url": given.spec } : {}),
          ...given.options,
        },
      }),
    );

    const api = { uiPath: pagePath, title, attributes, specJson: inlineJson(spec) };
    apis.push(api);
    if (given.sidebar !== false) {
      sidebar.push(sidebarGroup({ ...given, title }, navigation, href));
    }
  }
  return { apis, sidebar };
}
