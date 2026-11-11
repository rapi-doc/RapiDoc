// @rapidoc/vitepress, the config side (Node): `withRapidoc` adds what the site needs to draw an API
// reference with <rapi-doc>, and `rapidocSidebar` lists an API's operations for the theme's sidebar.
// The page itself is drawn by the component in ./client.js.
import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { renderOAuthReceiverPage } from "@rapidoc/embed";
import { getSpecNavigation } from "@rapidoc/prerender";

const VIRTUAL_ID = "virtual:rapidoc-vitepress";
/** Where the OAuth return page is served, under the site's base. */
export const OAUTH_RECEIVER_PATH = "rapidoc/oauth-receiver.html";

const isUrl = (value) => /^https?:\/\//i.test(value);

/** The OpenAPI document as an object: from a file (JSON or YAML, relative to `root`), a URL or as given. */
export async function loadSpec(spec, root = process.cwd()) {
  if (spec && typeof spec === "object") return spec;
  if (typeof spec !== "string" || spec === "") {
    throw new TypeError("@rapidoc/vitepress: a spec is a file path, a URL or an object");
  }
  let text;
  if (isUrl(spec)) {
    const response = await fetch(spec);
    if (!response.ok) throw new Error(`@rapidoc/vitepress: ${spec} answered ${response.status}`);
    text = await response.text();
  } else {
    const file = path.resolve(root, spec);
    if (!fs.existsSync(file)) throw new Error(`@rapidoc/vitepress: spec file not found: ${file}`);
    text = fs.readFileSync(file, "utf8");
  }
  const document = parse(text);
  if (!document || typeof document !== "object") {
    throw new Error(`@rapidoc/vitepress: ${spec} is not an OpenAPI document`);
  }
  return document;
}

const operationLabel = (operation) => operation.summary || `${operation.method} ${operation.path}`;

/**
 * Sidebar items for one API, for `themeConfig.sidebar`: an overview link, then a group per tag with a
 * link per operation. Links point into the API's page (`<link>#<operation id>`).
 * @param {string | object} spec a file (relative to `options.root`, default the working directory), a URL or the document
 * @param {string} link the page that shows the API, for example `/api`
 * @param {{ root?: string, collapsed?: boolean }} [options]
 */
export async function rapidocSidebar(spec, link, options = {}) {
  const document = await loadSpec(spec, options.root);
  const navigation = await getSpecNavigation(structuredClone(document));
  const tags = navigation.tagGroups.length
    ? [...navigation.tagGroups.flatMap((group) => group.tags), ...navigation.remainingTags]
    : navigation.tags;
  // #overview is the hash <rapi-doc> sets when it opens, so only one sidebar link is active at a time
  const items = [{ text: "Overview", link: `${link}#overview` }];
  for (const tag of tags) {
    if (tag.paths.length === 0) continue;
    items.push({
      text: tag.displayName || tag.name,
      ...(options.collapsed === undefined ? {} : { collapsed: options.collapsed }),
      items: tag.paths.map((operation) => ({
        text: operationLabel(operation),
        link: `${link}#${operation.elementId}`,
      })),
    });
  }
  return items;
}

/** The Vite plugin: the specs by name for the client component, and the OAuth return page in dev. */
function rapidocVitePlugin(apis, root) {
  let base = "/";
  return {
    name: "rapidoc-vitepress",
    configResolved(config) {
      base = config.base;
    },
    resolveId: (id) => (id === VIRTUAL_ID ? `\0${VIRTUAL_ID}` : undefined),
    async load(id) {
      if (id !== `\0${VIRTUAL_ID}`) return undefined;
      const specs = {};
      for (const [name, spec] of Object.entries(apis)) {
        specs[name] = await loadSpec(spec, root);
        if (typeof spec === "string" && !isUrl(spec)) this.addWatchFile(path.resolve(root, spec));
      }
      return `export const specs = ${JSON.stringify(specs)};\nexport const oauthReceiver = ${JSON.stringify(OAUTH_RECEIVER_PATH)};`;
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.split("?")[0] !== `${base}${OAUTH_RECEIVER_PATH}`) return next();
        res.setHeader("content-type", "text/html; charset=utf-8");
        res.end(renderOAuthReceiverPage({ assets: "cdn" }));
      });
    },
  };
}

/**
 * Wraps a VitePress config: `export default withRapidoc(defineConfig({ ... }), { apis: { pets: "./openapi.yaml" } })`.
 * - `apis` names the OpenAPI documents the pages show (`<RapidocReference api="pets" />`); each is a file
 *   relative to the project root, a URL or an object, read at build time.
 * - Tags starting with `rapi-` are left to the browser, so `<rapi-doc-mini>` can be written in Markdown.
 * - The OAuth return page is written to `rapidoc/oauth-receiver.html`.
 */
export function withRapidoc(config = {}, options = {}) {
  const apis = options.apis ?? {};
  const root = options.root ?? process.cwd();
  const userIsCustomElement = config.vue?.template?.compilerOptions?.isCustomElement;
  const userBuildEnd = config.buildEnd;
  const noExternal = config.vite?.ssr?.noExternal;
  return {
    ...config,
    vue: {
      ...config.vue,
      template: {
        ...config.vue?.template,
        compilerOptions: {
          ...config.vue?.template?.compilerOptions,
          isCustomElement: (tag) => tag.startsWith("rapi-") || Boolean(userIsCustomElement?.(tag)),
        },
      },
    },
    vite: {
      ...config.vite,
      plugins: [...(config.vite?.plugins ?? []), rapidocVitePlugin(apis, root)],
      ssr: {
        ...config.vite?.ssr,
        // The client component imports a virtual module, so it has to go through Vite on the server too
        noExternal:
          noExternal === true
            ? true
            : [
                ...(Array.isArray(noExternal) ? noExternal : noExternal ? [noExternal] : []),
                "@rapidoc/vitepress",
              ],
      },
    },
    async buildEnd(siteConfig) {
      await userBuildEnd?.(siteConfig);
      const file = path.join(siteConfig.outDir, OAUTH_RECEIVER_PATH);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      // The bundle the pages load is hashed by Vite, so this page loads the same rapidoc version from the CDN
      fs.writeFileSync(file, renderOAuthReceiverPage({ assets: "cdn" }));
    },
  };
}
