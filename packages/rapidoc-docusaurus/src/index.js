// @rapidoc/docusaurus, the plugin (Node): reads the OpenAPI documents named in its options and hands them
// to the `RapidocReference` component of ./client.js, which draws the page. `rapidocSidebar` lists an
// API's operations for sidebars.js.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
// The ./sidebar entry, not the package root: Docusaurus loads this file with require(), and the root
// imports a JSON file in a way that only works with import
import { operationClass, sidebarCss, sidebarMethods } from "@rapidoc/embed/sidebar";

export const PLUGIN_NAME = "rapidoc-docusaurus";
/** The route of the OAuth return page, under the site's baseUrl. */
export const OAUTH_RECEIVER_PATH = "rapidoc/oauth-receiver";

const isUrl = (value) => /^https?:\/\//i.test(value);

/** The OpenAPI document as an object: from a file (JSON or YAML, relative to `root`), a URL or as given. */
export async function loadSpec(spec, root = process.cwd()) {
  if (spec && typeof spec === "object") return spec;
  if (typeof spec !== "string" || spec === "") {
    throw new TypeError("@rapidoc/docusaurus: a spec is a file path, a URL or an object");
  }
  let text;
  if (isUrl(spec)) {
    const response = await fetch(spec);
    if (!response.ok) throw new Error(`@rapidoc/docusaurus: ${spec} answered ${response.status}`);
    text = await response.text();
  } else {
    const file = path.resolve(root, spec);
    if (!fs.existsSync(file)) throw new Error(`@rapidoc/docusaurus: spec file not found: ${file}`);
    text = fs.readFileSync(file, "utf8");
  }
  const document = parse(text);
  if (!document || typeof document !== "object") {
    throw new Error(`@rapidoc/docusaurus: ${spec} is not an OpenAPI document`);
  }
  return document;
}

/** The method in front of each operation link, in RapiDoc's colours, and deprecated ones struck through. */
export const SIDEBAR_CSS = sidebarCss({
  // Docusaurus puts a sidebar item's className on its <li>
  label: (className) => `.${className} > .menu__link::before`,
  text: (className) => `.${className} > .menu__link`,
  dark: "[data-theme='dark']",
});

const operationLabel = (operation) => operation.summary || `${operation.method} ${operation.path}`;

/**
 * Sidebar items for one API: an overview item, then a category per tag with a link per operation. Links
 * point into the API's page (`<uiPath>#<operation id>`). In sidebars.js use rapidocSidebarSync.
 *
 * @param {object} options
 * @param {string | object} options.spec a file (relative to `root`, default the working directory), a URL
 *   or the document. Read when the site is built.
 * @param {string} options.uiPath the URL path of the page that shows the API, for example `/docs/api`
 * @param {string} [options.docId] the id of the doc that holds the page (`api` for docs/api.mdx).
 *   Docusaurus shows a sidebar only on docs that are in it, so with `docId` the overview item is that
 *   doc; without it, a plain link.
 * @param {boolean | string} [options.methods] how each operation's HTTP method is shown:
 *   "as-colored-text" (default), "as-plain-text", "as-colored-block", or false for none
 * @param {boolean} [options.collapsed] start the tag categories collapsed
 * @param {string} [options.root]
 */
export async function rapidocSidebar(options = {}) {
  const { spec, uiPath: link } = options;
  if (typeof link !== "string" || link === "") {
    throw new TypeError(
      '@rapidoc/docusaurus: rapidocSidebar needs `uiPath`, for example "/docs/api"',
    );
  }
  const methods = sidebarMethods(options.methods);
  const document = await loadSpec(spec, options.root);
  // Imported here, not at the top: Docusaurus loads plugins and sidebars.js with require(), and
  // @rapidoc/prerender can only be imported
  const { getSpecNavigation } = await import("@rapidoc/prerender");
  const navigation = await getSpecNavigation(structuredClone(document));
  const tags = navigation.tagGroups.length
    ? [...navigation.tagGroups.flatMap((group) => group.tags), ...navigation.remainingTags]
    : navigation.tags;
  // #overview is the hash <rapi-doc> sets when it opens
  const items = [
    options.docId
      ? { type: "doc", id: options.docId, label: "Overview" }
      : { type: "link", label: "Overview", href: `${link}#overview` },
  ];
  for (const tag of tags) {
    if (tag.paths.length === 0) continue;
    items.push({
      type: "category",
      label: tag.displayName || tag.name,
      collapsed: options.collapsed ?? false,
      items: tag.paths.map((operation) => ({
        type: "link",
        label: operationLabel(operation),
        href: `${link}#${operation.elementId}`,
        className: operationClass(operation, methods),
      })),
    });
  }
  return items;
}

/**
 * `rapidocSidebar` for sidebars.js, which Docusaurus loads without waiting for promises: the same options,
 * the items returned directly. It reads the spec in a short-lived Node process, so it takes a moment at
 * start-up.
 *
 *     items: rapidocSidebarSync({ spec: "./openapi.yaml", uiPath: "/docs/api", docId: "api" })
 */
export function rapidocSidebarSync(options = {}) {
  const output = execFileSync(
    process.execPath,
    [fileURLToPath(new URL("./sidebar-cli.js", import.meta.url))],
    {
      input: JSON.stringify({ root: process.cwd(), ...options }),
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    },
  );
  return JSON.parse(output);
}

/**
 * The Docusaurus plugin: `plugins: [["@rapidoc/docusaurus", { apis: { pets: "./openapi.yaml" } }]]`.
 * `apis` names the OpenAPI documents the pages show (`<RapidocReference api="pets" />`); each is a file
 * relative to the site folder, a URL or an object, read at build time.
 */
export default function rapidocDocusaurus(context, options = {}) {
  const apis = options.apis ?? {};
  const root = context.siteDir;
  return {
    name: PLUGIN_NAME,

    async loadContent() {
      const specs = {};
      for (const [name, spec] of Object.entries(apis)) specs[name] = await loadSpec(spec, root);
      return specs;
    },

    async contentLoaded({ content, actions }) {
      // One file per API, loaded only by the page that shows it, and an index the component imports
      // as `@generated/rapidoc-docusaurus/default/specs`.
      const loaders = [];
      for (const [name, document] of Object.entries(content)) {
        const file = `spec-${name.replace(/[^\w-]/g, "_")}.json`;
        await actions.createData(file, JSON.stringify(document));
        loaders.push(`  ${JSON.stringify(name)}: () => import("./${file}"),`);
      }
      await actions.createData(
        "specs.js",
        `export const specs = {\n${loaders.join("\n")}\n};\nexport const oauthReceiver = ${JSON.stringify(OAUTH_RECEIVER_PATH)};\n`,
      );
      actions.addRoute({
        path: `${context.baseUrl.replace(/\/+$/, "")}/${OAUTH_RECEIVER_PATH}`,
        component: "@rapidoc/docusaurus/oauth-receiver",
        exact: true,
      });
    },

    // The sidebar is on every docs page, so the styles of its method labels are too
    injectHtmlTags() {
      return { headTags: [{ tagName: "style", innerHTML: SIDEBAR_CSS }] };
    },

    getPathsToWatch() {
      return Object.values(apis)
        .filter((spec) => typeof spec === "string" && !isUrl(spec))
        .map((spec) => path.resolve(root, spec));
    },
  };
}
