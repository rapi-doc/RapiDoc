/**
 * Maps rapidoc.config.yaml into Astro + Starlight configuration.
 */

function generateStarlightCustomCss(primaryColor = '#f76b39') {
  return `
:root,
:root[data-theme='dark'] {
  --portal-bg: oklch(0.2613 0.0134 272.84);
  --portal-surface: oklch(0.2613 0.0134 272.84);
  --portal-card: oklch(0.2613 0.0134 272.84);
  --portal-border: #363636;
  --portal-border-subtle: rgba(255, 255, 255, 0.06);
  --portal-fg: #cccccc;
  --portal-muted: #8b949e;
  --portal-primary: ${primaryColor};
  --portal-header-height: 101px;

  /* Starlight unification */
  --sl-header-height: var(--portal-header-height, 101px) !important;
  --sl-nav-height: var(--portal-header-height, 101px) !important;
  --sl-color-bg: oklch(0.2613 0.0134 272.84);
  --sl-color-bg-nav: color-mix(in srgb, oklch(0.2613 0.0134 272.84) 92%, transparent);
  --sl-color-bg-sidebar: oklch(0.2613 0.0134 272.84);
  --sl-color-bg-inline-code: #3b3c45;
  --sl-color-black: oklch(0.2613 0.0134 272.84);
  --sl-color-gray-6: oklch(0.235 0.0134 272.84);
  --sl-color-gray-7: oklch(0.2613 0.0134 272.84);
  --sl-color-hairline: #363636;
  --sl-color-hairline-light: rgba(255, 255, 255, 0.04);
  --sl-color-white: #cccccc;
  --sl-color-gray-1: #e5e5e5;
  --sl-color-gray-2: #cccccc;
  --sl-color-gray-3: #8b949e;
  --sl-color-gray-4: #64748b;
  --sl-color-gray-5: #363636;

  --sl-color-accent: ${primaryColor};
  --sl-color-accent-low: color-mix(in srgb, ${primaryColor} 18%, transparent);
  --sl-color-accent-high: color-mix(in srgb, ${primaryColor} 80%, #ffffff);

  --sl-font-system: var(--font-regular, 'Open Sans', 'Segoe UI', Tahoma, Arial, sans-serif);
  --sl-font-mono: 'Roboto Mono', Monaco, 'Andale Mono', Consolas, monospace;
}

[data-theme='light'] {
  --portal-bg: #ffffff;
  --portal-surface: #f4f4f5;
  --portal-card: #f4f4f5;
  --portal-border: #e4e4e7;
  --portal-border-subtle: #f4f4f5;
  --portal-fg: #555555;
  --portal-muted: #71717a;

  --sl-color-bg: #ffffff;
  --sl-color-bg-nav: rgba(255, 255, 255, 0.95);
  --sl-color-bg-sidebar: #f4f4f5;
  --sl-color-bg-inline-code: #e2e8f0;
  --sl-color-black: #ffffff;
  --sl-color-white: #555555;
  --sl-color-gray-1: #111111;
  --sl-color-gray-2: #333333;
  --sl-color-gray-3: #555555;
  --sl-color-gray-4: #71717a;
  --sl-color-gray-5: #cbd5e1;
  --sl-color-gray-6: #f4f4f5;
  --sl-color-gray-7: #ffffff;
  --sl-color-hairline: #e4e4e7;
  --sl-color-hairline-light: rgba(0, 0, 0, 0.04);
  --sl-color-accent-low: #ffe3d6;
  --sl-color-accent: ${primaryColor};
  --sl-color-accent-high: #94300a;
}

body {
  background-color: var(--portal-bg, oklch(0.2613 0.0134 272.84)) !important;
  color: var(--portal-fg, #cccccc) !important;
  font-family: var(--sl-font-system);
}

/* Inline code tags styling across dark and light modes matching release_12_0_0 */
:not(pre) > code {
  background-color: var(--sl-color-bg-inline-code, #3b3c45) !important;
  color: var(--inline-code-fg, #c4c6d1) !important;
  border: 1px solid var(--portal-border, #363636) !important;
  padding: 0.15em 0.35em !important;
  border-radius: 4px !important;
  font-size: 0.875em !important;
}

[data-theme='light'] :not(pre) > code {
  background-color: #e2e8f0 !important;
  color: #334155 !important;
  border-color: #cbd5e1 !important;
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
    top: var(--portal-header-height, 101px) !important;
    height: calc(100vh - var(--portal-header-height, 101px)) !important;
    max-height: calc(100vh - var(--portal-header-height, 101px)) !important;
    display: flex !important;
    flex-direction: column !important;
    padding: 0 !important;
    overflow: hidden !important;
  }

  .sidebar-pane .sidebar-content {
    flex: 1 1 auto !important;
    height: 100% !important;
    min-height: 100% !important;
    max-height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: hidden !important;
    padding: 0 !important;
  }
}

.portal-docs-sidebar-root {
  height: 100% !important;
  min-height: 100% !important;
  flex: 1 1 auto !important;
  display: flex !important;
  flex-direction: column !important;
}

.portal-docs-sidebar-scroll {
  flex: 1 1 auto !important;
}

/* Right Sidebar (On this page / TOC) sticky positioning below custom header */
@media (min-width: 72rem) {
  .right-sidebar-container {
    top: 0 !important;
    height: calc(100vh - var(--portal-header-height, 101px)) !important;
    max-height: calc(100vh - var(--portal-header-height, 101px)) !important;
  }
  .right-sidebar {
    top: var(--portal-header-height, 101px) !important;
    height: calc(100vh - var(--portal-header-height, 101px)) !important;
    max-height: calc(100vh - var(--portal-header-height, 101px)) !important;
    padding-top: 1.5rem !important;
  }
}

mobile-starlight-toc {
  top: var(--portal-header-height, 101px) !important;
}

.portal-sidebar-docked-footer {
  height: 52px !important;
  min-height: 52px !important;
  max-height: 52px !important;
  box-sizing: border-box !important;
  display: flex !important;
  align-items: center !important;
  padding: 0 1.25rem !important;
  border-top: 1px solid var(--portal-border, #363636) !important;
  background: var(--portal-bg, oklch(0.2613 0.0134 272.84)) !important;
  flex-shrink: 0 !important;
  position: sticky !important;
  bottom: 0 !important;
  z-index: 20 !important;
}

.portal-sidebar-footer-link {
  color: var(--portal-muted, #8b949e) !important;
  text-decoration: none !important;
  font-size: 0.8125rem !important;
  font-weight: 500 !important;
  transition: color 0.15s ease !important;
  display: flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  width: 100% !important;
}

.portal-sidebar-footer-link:hover {
  color: var(--portal-fg, #cccccc) !important;
}

/* Documentation Content & Footer Alignment */
.main-pane {
  display: flex !important;
  flex-direction: column !important;
  min-height: calc(100vh - var(--portal-header-height, 101px)) !important;
}

.main-pane > main {
  display: flex !important;
  flex-direction: column !important;
  flex: 1 1 auto !important;
  min-height: 100% !important;
  padding: 0 !important;
}

/* Remove Starlight internal hairline divider between content panels */
.main-pane .content-panel + .content-panel {
  border-top: none !important;
}

/* Page title content panel */
.main-pane .content-panel:first-child {
  padding: 1.5rem var(--sl-content-pad-x, 1.5rem) 0 var(--sl-content-pad-x, 1.5rem) !important;
}

.main-pane .content-panel:first-child > .sl-container {
  max-width: var(--sl-content-width, 860px) !important;
  margin-inline: var(--sl-content-margin-inline, auto) !important;
}

/* Article & Footer content panel: stretch full height with zero bottom padding */
.main-pane .content-panel:last-child {
  display: flex !important;
  flex-direction: column !important;
  flex: 1 1 auto !important;
  padding: 0 !important;
}

.main-pane .content-panel:last-child > .sl-container {
  display: flex !important;
  flex-direction: column !important;
  flex: 1 1 auto !important;
  max-width: none !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* Constrain article markdown body to standard content width and margin */
.main-pane .sl-markdown-content {
  flex: 1 0 auto !important;
  max-width: var(--sl-content-width, 860px) !important;
  width: 100% !important;
  margin-inline: var(--sl-content-margin-inline, auto) !important;
  padding: 1.5rem var(--sl-content-pad-x, 1.5rem) !important;
  box-sizing: border-box !important;
}

/* Full-width docked footer spanning entire main pane */
.main-pane footer.portal-content-footer,
.main-pane .portal-content-footer {
  width: 100% !important;
  max-width: none !important;
  margin-top: auto !important;
  margin-bottom: 0 !important;
  border-top: 1px solid var(--portal-border, #363636) !important;
  padding: 0 !important;
  box-sizing: border-box !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: var(--portal-bg, oklch(0.2613 0.0134 272.84)) !important;
  height: 52px !important;
  min-height: 52px !important;
  max-height: 52px !important;
  flex-shrink: 0 !important;
}

/* Footer container lines up with main content's left/right margins */
.main-pane .portal-content-footer-container {
  width: 100% !important;
  max-width: var(--sl-content-width, 860px) !important;
  margin-inline: var(--sl-content-margin-inline, auto) !important;
  padding: 0 var(--sl-content-pad-x, 1.5rem) !important;
  box-sizing: border-box !important;
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 1rem !important;
  font-size: 0.8125rem !important;
}

.portal-content-footer-copy {
  white-space: nowrap !important;
  flex-shrink: 0 !important;
}

.portal-content-footer-links {
  display: flex !important;
  align-items: center !important;
  gap: 0.625rem !important;
  flex-wrap: nowrap !important;
  white-space: nowrap !important;
}

.portal-content-footer-link {
  white-space: nowrap !important;
}

.portal-content-footer-social {
  display: flex !important;
  align-items: center !important;
  gap: 0.75rem !important;
  flex-shrink: 0 !important;
}

html.portal-announcement-dismissed {
  --portal-header-height: 60px !important;
  --sl-header-height: 60px !important;
}
html.portal-announcement-dismissed #portal-announcement {
  display: none !important;
}

/* Documentation Sidebar Hover and Active Styling */
.sidebar-pane a {
  color: var(--portal-muted, #8b949e) !important;
  border-radius: 6px !important;
  transition: color 0.15s ease, background-color 0.15s ease !important;
}

.sidebar-pane a:hover {
  color: var(--portal-fg, #cccccc) !important;
  background-color: rgba(255, 255, 255, 0.06) !important;
}

[data-theme='light'] .sidebar-pane a:hover {
  color: #111111 !important;
  background-color: rgba(0, 0, 0, 0.05) !important;
}

[data-theme='light'] .portal-sidebar-docked-footer,
[data-theme='light'] footer.portal-content-footer,
[data-theme='light'] .portal-content-footer {
  background: #ffffff !important;
  border-color: #e4e4e7 !important;
}

.sidebar-pane a[aria-current="page"] {
  color: var(--portal-primary, ${primaryColor}) !important;
  background-color: color-mix(in srgb, var(--portal-primary, ${primaryColor}) 16%, transparent) !important;
  font-weight: 600 !important;
}

.sidebar-pane a[aria-current="page"] span {
  color: var(--portal-primary, ${primaryColor}) !important;
}
`;
}

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
