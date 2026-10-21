/**
 * Maps rapidoc.config.yaml into Astro + Starlight configuration.
 */

import path from 'node:path';

/**
 * Converts a hex color into an HSL-friendly or CSS custom properties palette for Starlight.
 */
function generateStarlightCustomCss(primaryColor = '#f76b39', themePreset = 'amber') {
  return `
:root,
:root[data-theme='dark'] {
  --portal-bg: #0b0f19;
  --portal-surface: #111827;
  --portal-card: #151d30;
  --portal-border: rgba(255, 255, 255, 0.08);
  --portal-border-subtle: rgba(255, 255, 255, 0.04);
  --portal-fg: #f8fafc;
  --portal-muted: #94a3b8;
  --portal-primary: ${primaryColor};
  --portal-header-height: 98px;

  /* Starlight unification */
  --sl-color-bg: #0b0f19;
  --sl-color-bg-nav: rgba(11, 15, 25, 0.92);
  --sl-color-bg-sidebar: #0b0f19;
  --sl-color-black: #0b0f19;
  --sl-color-gray-6: #111827;
  --sl-color-gray-7: #0b0f19;
  --sl-color-hairline: rgba(255, 255, 255, 0.08);
  --sl-color-hairline-light: rgba(255, 255, 255, 0.04);
  --sl-color-white: #f8fafc;
  --sl-color-gray-1: #f1f5f9;
  --sl-color-gray-2: #cbd5e1;
  --sl-color-gray-3: #94a3b8;
  --sl-color-gray-4: #64748b;
  --sl-color-gray-5: #475569;

  --sl-color-accent: ${primaryColor};
  --sl-color-accent-low: color-mix(in srgb, ${primaryColor} 18%, transparent);
  --sl-color-accent-high: color-mix(in srgb, ${primaryColor} 80%, #ffffff);

  --sl-font-system: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  --sl-font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

[data-theme='light'] {
  --portal-bg: #f8fafc;
  --portal-surface: #ffffff;
  --portal-card: #ffffff;
  --portal-border: rgba(0, 0, 0, 0.08);
  --portal-fg: #0f172a;
  --portal-muted: #64748b;

  --sl-color-bg: #f8fafc;
  --sl-color-bg-nav: rgba(255, 255, 255, 0.92);
  --sl-color-bg-sidebar: #f8fafc;
  --sl-color-black: #ffffff;
  --sl-color-white: #0f172a;
  --sl-color-accent-low: #ffe3d6;
  --sl-color-accent: ${primaryColor};
  --sl-color-accent-high: #94300a;
}

body {
  background-color: var(--portal-bg, #0b0f19) !important;
  color: var(--portal-fg, #f8fafc) !important;
  font-family: var(--sl-font-system);
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

/* Sticky Portal Header in Starlight */
header.header {
  position: sticky !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  padding: 0 !important;
  height: auto !important;
  max-height: none !important;
  background: transparent !important;
  border-bottom: none !important;
  z-index: 1000 !important;
}

.page.sl-flex {
  padding-top: 0 !important;
}

.main-frame {
  padding-top: 0 !important;
}

@media (min-width: 50rem) {
  .sidebar-pane {
    top: var(--portal-header-height, 98px) !important;
    height: calc(100vh - var(--portal-header-height, 98px)) !important;
  }
}

html.portal-announcement-dismissed {
  --portal-header-height: 60px !important;
}
html.portal-announcement-dismissed #portal-announcement {
  display: none !important;
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
