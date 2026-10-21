/**
 * Maps rapidoc.config.yaml into Astro + Starlight configuration.
 */

import path from 'node:path';

/**
 * Converts a hex color into an HSL-friendly or CSS custom properties palette for Starlight.
 */
function generateStarlightCustomCss(primaryColor = '#f76b39', themePreset = 'amber') {
  return `
:root {
  --sl-color-accent-low: #36170c;
  --sl-color-accent: ${primaryColor};
  --sl-color-accent-high: #ffad85;
  --sl-color-white: #ffffff;
  --sl-font-system: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  --sl-font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

[data-theme='light'] {
  --sl-color-accent-low: #ffe3d6;
  --sl-color-accent: ${primaryColor};
  --sl-color-accent-high: #94300a;
}

/* Seamless RapiDoc full-viewport and embedded container styling */
.rapidoc-fullscreen-portal {
  width: 100%;
  min-height: calc(100vh - var(--sl-nav-height, 64px));
  margin: 0;
  padding: 0;
}

.portal-rapidoc-embed {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  margin: 1.5rem 0;
}
`;
}

/**
 * Converts portal navigation items to Starlight sidebar format.
 *
 * @param {Array} navigation - rapidoc.config.yaml navigation array
 * @param {Array} apis - rapidoc.config.yaml apis array
 * @returns {Array} Starlight sidebar configuration
 */
export function buildStarlightSidebar(navigation = [], apis = []) {
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

  // 2. APIs & Reference section
  if (apis && apis.length > 0) {
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
 * Builds the full Starlight configuration object from normalized rapidoc.config.yaml.
 *
 * @param {object} portalConfig - Normalized rapidoc.config.yaml
 * @returns {object} Starlight user config
 */
export function createStarlightConfig(portalConfig) {
  const site = portalConfig.site || {};
  const primaryColor = portalConfig.rapidoc?.['primary-color'] || '#f76b39';
  const themePreset = portalConfig.rapidoc?.theme || 'amber';

  const socialLinks = [];
  if (site.footer?.social) {
    for (const item of site.footer.social) {
      if (item.href && item.icon) {
        socialLinks.push({
          icon: item.icon.toLowerCase(),
          label: item.icon,
          href: item.href,
        });
      }
    }
  }

  const sidebar = buildStarlightSidebar(portalConfig.navigation || [], portalConfig.apis || []);

  const starlightConfig = {
    title: site.title || 'Developer Portal',
    description: site.description || site.tagline || '',
    social: socialLinks,
    sidebar,
    customCss: ['./src/styles/starlight-custom.css'],
    expressiveCode: {
      themes: ['github-dark', 'github-light'],
      styleOverrides: {
        borderRadius: '8px',
      },
    },
  };

  // Add announcement if configured
  if (site.announcement?.text) {
    starlightConfig.head = [
      ...(starlightConfig.head || []),
      {
        tag: 'meta',
        attrs: {
          name: 'announcement:text',
          content: site.announcement.text,
        },
      },
    ];
  }

  return {
    starlightConfig,
    customCssContent: generateStarlightCustomCss(primaryColor, themePreset),
  };
}
