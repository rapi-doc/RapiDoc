// @rapidoc/starlight: a Starlight plugin that adds an API reference page per OpenAPI document, drawn by
// <rapi-doc> inside Starlight's layout, with the API's tags and operations in Starlight's sidebar.
import { fileURLToPath } from "node:url";
import { resolveApis, SIDEBAR_CSS } from "./apis.js";

const VIRTUAL_ID = "virtual:rapidoc-starlight";
const entry = (file) => fileURLToPath(new URL(file, import.meta.url));

/** The Astro integration the plugin adds: one route per API, its OAuth return page, and the pages' data. */
function rapidocIntegration(apis) {
  return {
    name: "@rapidoc/starlight",
    hooks: {
      "astro:config:setup"({ injectRoute, updateConfig }) {
        for (const api of apis) {
          injectRoute({
            pattern: api.uiPath,
            entrypoint: entry("./ApiPage.astro"),
            prerender: true,
          });
          injectRoute({
            pattern: `${api.uiPath}/oauth-receiver`,
            entrypoint: entry("./OAuthReceiver.astro"),
            prerender: true,
          });
        }
        updateConfig({
          vite: {
            plugins: [
              {
                name: "rapidoc-starlight-data",
                resolveId: (id) => (id === VIRTUAL_ID ? `\0${VIRTUAL_ID}` : undefined),
                load: (id) =>
                  id === `\0${VIRTUAL_ID}`
                    ? `export const apis = ${JSON.stringify(apis)};`
                    : undefined,
              },
            ],
          },
        });
      },
    },
  };
}

/**
 * `starlight({ plugins: [starlightRapidoc({ uiPath: "/api", spec: "./openapi.yaml" })] })`, or
 * `starlightRapidoc({ apis: [...] })` for several APIs.
 */
export default function starlightRapidoc(userOptions) {
  return {
    name: "@rapidoc/starlight",
    hooks: {
      async "config:setup"({ config, astroConfig, updateConfig, addIntegration }) {
        const { apis, sidebar } = await resolveApis(userOptions, {
          root: fileURLToPath(astroConfig.root),
          base: astroConfig.base,
          trailingSlash: astroConfig.trailingSlash,
        });
        if (sidebar.length > 0) {
          updateConfig({
            sidebar: [...(config.sidebar ?? []), ...sidebar],
            // the sidebar is on every page, so its styles are too
            head: [...(config.head ?? []), { tag: "style", content: SIDEBAR_CSS }],
          });
        }
        addIntegration(rapidocIntegration(apis));
      },
    },
  };
}
