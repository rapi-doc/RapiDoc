/**
 * Maps a normalized rapidoc.config.yaml onto Starlight integration options.
 */

import { fileURLToPath } from "node:url";
import { pagefindMergeIndex } from "../access/split-output.js";
import { portalHeadEntries } from "./page-head.js";

const componentPath = (name) => fileURLToPath(new URL(`../components/${name}`, import.meta.url));

export const THEME_CSS_MODULE = "virtual:rapidoc-portal/theme.css";
export const ROUTE_MIDDLEWARE_PATH = fileURLToPath(
  new URL("./route-middleware.js", import.meta.url),
);

/**
 * Starlight's sidebar: one group per documentation tab, in tab order. route-middleware.js shows only
 * the group of the current page's tab. Without documentation tabs, every page in docs/.
 *
 * @param {Array} tabs - Normalized `tabs`
 */
export function buildStarlightSidebar(tabs = []) {
  const docsTabs = tabs.filter((tab) => tab.kind === "docs");
  if (docsTabs.length === 0)
    return [{ label: "Documentation", autogenerate: { directory: "docs" } }];
  return docsTabs.map((tab) => ({ label: tab.label, items: tab.sidebar.map(withoutIcons) }));
}

// Starlight's sidebar schema is strict, so the portal's `icon` (drawn by PortalSidebarSublist) stays out.
function withoutIcons(item) {
  const entry = { ...item };
  delete entry.icon;
  return entry.items ? { ...entry, items: entry.items.map(withoutIcons) } : entry;
}

/** Pagefind search: off, on, or on with one merged bundle per protected zone (split-output.js). */
function pagefindOptions(portalConfig) {
  if (!portalConfig.search) return false;
  const mergeIndex = pagefindMergeIndex(portalConfig);
  return mergeIndex.length ? { mergeIndex } : true;
}

/**
 * Builds the options passed to starlight() for a portal.
 *
 * @param {object} portalConfig - Normalized rapidoc.config.yaml
 * @returns {object} Starlight user config
 */
export function createStarlightOptions(portalConfig) {
  const { site, docs } = portalConfig;

  return {
    title: site.title,
    ...(site.description && { description: site.description }),
    ...(site.favicon && { favicon: site.favicon }),
    disable404Route: true,
    sidebar: buildStarlightSidebar(portalConfig.tabs),
    routeMiddleware: [ROUTE_MIDDLEWARE_PATH],
    tableOfContents:
      docs.toc === false ? false : { minHeadingLevel: 2, maxHeadingLevel: 3, ...docs.toc },
    pagefind: pagefindOptions(portalConfig),
    // Starlight's own Footer stays: it renders prev/next links, the edit link and the last-updated
    // date. The site footer is rendered by PortalPageFrame below the whole shell.
    components: {
      Header: componentPath("PortalHeader.astro"),
      PageFrame: componentPath("PortalPageFrame.astro"),
      TwoColumnContent: componentPath("PortalTwoColumnContent.astro"),
      Sidebar: componentPath("PortalSidebar.astro"),
      ThemeProvider: componentPath("PortalThemeProvider.astro"),
      ThemeSelect: componentPath("PortalThemeSelect.astro"),
      PageTitle: componentPath("PortalPageTitle.astro"),
    },
    // theme.css files come after the portal theme, so their plain selectors win.
    customCss: [THEME_CSS_MODULE, ...portalConfig.theme.css],
    expressiveCode: {
      themes: ["github-dark", "github-light"],
      // Same corners and border as the callouts. Shell code too gets the code frame, so a header (lightly
      // tinted) shows only for a block with a title, never as an empty terminal title bar.
      defaultProps: { frame: "code" },
      // Shiki has no Markdoc grammar; Markdown highlighting fits ```markdoc examples best.
      shiki: { langAlias: { markdoc: "md", mdoc: "md" } },
      styleOverrides: {
        borderRadius: "var(--portal-radius)",
        borderColor: "var(--portal-border)",
        frames: {
          frameBoxShadowCssValue: "none",
          editorTabBarBackground: "color-mix(in oklab, var(--portal-fg) 5%, var(--portal-bg))",
          editorTabBarBorderBottomColor: "var(--portal-border)",
          editorActiveTabBackground: "transparent",
          editorActiveTabBorderColor: "transparent",
          editorActiveTabIndicatorTopColor: "transparent",
          editorActiveTabIndicatorBottomColor: "transparent",
          terminalTitlebarBackground: "color-mix(in oklab, var(--portal-fg) 5%, var(--portal-bg))",
          terminalTitlebarBorderBottomColor: "var(--portal-border)",
          terminalTitlebarDotsOpacity: "0",
        },
      },
    },
    // No <rapi-doc> on documentation pages: the RapiDoc bundle is loaded by the API reference pages only.
    head: portalHeadEntries(portalConfig),
  };
}
