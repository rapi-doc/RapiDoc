/**
 * Maps a normalized rapidoc.config.yaml onto Starlight integration options.
 */

import { fileURLToPath } from 'node:url';
import { pagefindMergeIndex } from '../access/split-output.js';

const componentPath = (name) => fileURLToPath(new URL(`../components/${name}`, import.meta.url));

export const THEME_CSS_MODULE = 'virtual:rapidoc-portal/theme.css';
export const ROUTE_MIDDLEWARE_PATH = fileURLToPath(new URL('./route-middleware.js', import.meta.url));

/**
 * Starlight's sidebar: one group per documentation tab, in tab order. route-middleware.js shows only
 * the group of the current page's tab. Without documentation tabs, every page in docs/.
 *
 * @param {Array} tabs - Normalized `tabs`
 */
export function buildStarlightSidebar(tabs = []) {
  const docsTabs = tabs.filter((tab) => tab.kind === 'docs');
  if (docsTabs.length === 0) return [{ label: 'Documentation', autogenerate: { directory: 'docs' } }];
  return docsTabs.map((tab) => ({ label: tab.label, items: tab.sidebar }));
}

/**
 * <link> head entries for the configured web fonts.
 */
export function fontHeadEntries(fonts = {}) {
  const urls = [fonts.sans?.url, fonts.mono?.url].filter(Boolean);
  if (urls.length === 0) return [];
  return [
    { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
    { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' } },
    ...urls.map((href) => ({ tag: 'link', attrs: { rel: 'stylesheet', href } })),
  ];
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
    tableOfContents: docs.toc === false ? false : { minHeadingLevel: 2, maxHeadingLevel: 3, ...docs.toc },
    pagefind: pagefindOptions(portalConfig),
    // Starlight's own Footer stays: it renders prev/next links, the edit link and the last-updated
    // date. The site footer is rendered by PortalPageFrame below the whole shell.
    components: {
      Header: componentPath('PortalHeader.astro'),
      PageFrame: componentPath('PortalPageFrame.astro'),
      TwoColumnContent: componentPath('PortalTwoColumnContent.astro'),
      Sidebar: componentPath('PortalSidebar.astro'),
      ThemeProvider: componentPath('PortalThemeProvider.astro'),
      ThemeSelect: componentPath('PortalThemeSelect.astro'),
    },
    customCss: [THEME_CSS_MODULE],
    expressiveCode: {
      themes: ['github-dark', 'github-light'],
    },
    // No <rapi-doc> on documentation pages: the RapiDoc bundle is loaded by the API reference pages only.
    head: fontHeadEntries(portalConfig.theme.fonts),
  };
}
