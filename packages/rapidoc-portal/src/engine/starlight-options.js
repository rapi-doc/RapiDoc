/**
 * Maps a normalized rapidoc.config.yaml onto Starlight integration options.
 */

import { fileURLToPath } from 'node:url';

const componentPath = (name) => fileURLToPath(new URL(`../components/${name}`, import.meta.url));

export const THEME_CSS_MODULE = 'virtual:rapidoc-portal/theme.css';

/**
 * Converts portal navigation items to Starlight sidebar format.
 * Documentation sidebar contains only narrative docs/guides by default.
 *
 * @param {Array} navigation - rapidoc.config.yaml navigation array
 * @param {Array} apis - rapidoc.config.yaml apis array
 * @param {object} [options] - Optional sidebar builder flags
 * @param {boolean} [options.includeApis=false] - Whether to include API Reference in sidebar
 * @returns {Array} Starlight sidebar configuration
 */
export function buildStarlightSidebar(navigation = [], apis = [], options = {}) {
  const sidebar = [];

  // 1. Guides & Narrative Docs navigation
  for (const group of navigation) {
    if (group.title && group.items) {
      const groupItems = (group.items || []).map((item) => {
        const link = item.path || item.href || (item.slug ? `/docs/${item.slug}` : '');
        return {
          label: item.label || item.title || 'Untitled',
          link: link.replace(/^\/?docs\/?/, '/docs/'),
        };
      });

      sidebar.push({
        label: group.title,
        items: groupItems,
      });
    } else if (group.label && (group.path || group.href)) {
      sidebar.push({
        label: group.label,
        link: (group.path || group.href).replace(/^\/?docs\/?/, '/docs/'),
      });
    }
  }

  // 2. APIs & Reference section (only if explicitly enabled via options.includeApis)
  if (options.includeApis && apis && apis.length > 0) {
    const apiItems = apis.map((api) => ({
      label: api.title || `${api.id} API`,
      link: api.path || `/apis/${api.id}`,
      badge: api.category ? { text: api.category, variant: 'note' } : undefined,
    }));

    sidebar.push({
      label: 'API Reference',
      items: apiItems,
    });
  }

  return sidebar;
}

/**
 * Builds font <link> head entries for a configured web font.
 */
function fontHeadEntries(fontConfig) {
  if (!fontConfig?.url) return [];
  const entries = [
    { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
    { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' } },
    { tag: 'link', attrs: { rel: 'stylesheet', href: fontConfig.url } },
  ];
  if (fontConfig.monoUrl) {
    entries.push({ tag: 'link', attrs: { rel: 'stylesheet', href: fontConfig.monoUrl } });
  }
  return entries;
}

/**
 * Builds the options passed to starlight() for a portal.
 *
 * @param {object} portalConfig - Normalized rapidoc.config.yaml
 * @returns {object} Starlight user config
 */
export function createStarlightOptions(portalConfig) {
  const site = portalConfig.site || {};

  const head = [{ tag: 'script', attrs: { type: 'module', src: '/assets/rapidoc-min.js' } }];
  if (site.announcement?.text) {
    head.push({ tag: 'meta', attrs: { name: 'announcement:text', content: site.announcement.text } });
  }
  head.push(...fontHeadEntries(portalConfig.theme?.font));

  return {
    title: site.title || 'Developer Portal',
    disable404Route: true,
    sidebar: buildStarlightSidebar(portalConfig.navigation || [], portalConfig.apis || []),
    components: {
      Header: componentPath('PortalHeader.astro'),
      Footer: componentPath('PortalFooter.astro'),
      Sidebar: componentPath('PortalDocsSidebar.astro'),
    },
    customCss: [THEME_CSS_MODULE],
    expressiveCode: {
      themes: ['github-dark', 'github-light'],
    },
    head,
  };
}
