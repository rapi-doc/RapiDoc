/**
 * HTML App-Shell Template Generator
 * Produces complete static HTML documents matching Zudoku's aesthetic with:
 * - Sticky top announcement banner
 * - 2-row frosted glass header
 * - 3-column body layout (docs | wide | landing presets)
 * - Unified contextual sidebar (switching between doc tree and API operation badges)
 * - Right-hand API Metadata Sidecar (Servers, Contact, License) or TOC scroll-spy
 * - Multi-column responsive footer
 * - Full-Text search modal (⌘K / Ctrl+K)
 */

import { renderNavBarHtml } from 'rapidoc/static';

/**
 * Escapes HTML characters.
 */
function escapeHtml(str = '') {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/**
 * Generates the complete HTML document wrapping the page content.
 *
 * @param {object} options
 * @param {object} options.config - Normalized RapiDoc Portal configuration
 * @param {string} options.title - Page title
 * @param {string} options.description - Page meta description
 * @param {string} options.content - Pre-rendered body content HTML
 * @param {Array<{ id: string, title: string, level: number }>} [options.toc] - TOC headings
 * @param {string} [options.currentPath] - Current route path (e.g. /docs/getting-started)
 * @param {string} [options.layout] - Layout preset ('docs' | 'wide' | 'landing')
 * @param {string} [options.baseAssetsPath] - Relative path prefix to assets directory
 * @param {object} [options.pager] - Previous and next page metadata ({ prev, next })
 * @param {string} [options.heroImage] - Optional hero banner image URL
 * @param {boolean} [options.isApiPage=false] - True when rendering an OpenAPI reference page
 * @param {string} [options.sidebarNavHtml=''] - Pre-rendered sidebar navigation HTML
 * @param {object} [options.apiSidecar=null] - Extracted OpenAPI metadata for right sidecar
 * @returns {string} Full HTML document string
 */
export function generateShell({
  config,
  title,
  description = '',
  content,
  toc = [],
  currentPath = '/',
  layout = 'docs',
  baseAssetsPath = './assets',
  pager = null,
  heroImage = null,
  isApiPage = false,
  sidebarNavHtml = '',
  spec = null,
  apiSidecar = null,
}) {
  const site = config.site || {};
  const pageTitle = title ? `${title} — ${site.title || 'Developer Portal'}` : site.title || 'Developer Portal';
  const metaDescription = description || site.description || site.tagline || '';
  const currentLayout = layout || 'docs';
  const showToc = !isApiPage && currentLayout === 'docs' && config.docs?.toc !== false && toc && toc.length > 0;
  const showApiSidecar = isApiPage && currentLayout !== 'landing' && apiSidecar;

  // 1. Announcement Banner Markup
  let announcementHtml = '';
  if (site.announcement?.text) {
    const ann = site.announcement;
    const bgStyle = ann.bgColor ? `--portal-announcement-bg: ${ann.bgColor};` : '';
    const fgStyle = ann.textColor ? `--portal-announcement-fg: ${ann.textColor};` : '';
    const styleAttr = bgStyle || fgStyle ? `style="${bgStyle} ${fgStyle}"` : '';

    announcementHtml = `
  <aside class="portal-announcement" ${styleAttr} role="alert">
    <div class="portal-announcement-content">
      <span>${escapeHtml(ann.text)}</span>
      ${ann.link ? `<a href="${ann.link}">Learn more &rarr;</a>` : ''}
    </div>
    ${ann.dismissible !== false ? '<button class="portal-announcement-close" aria-label="Dismiss">&times;</button>' : ''}
  </aside>`;
  }

  // 2. Row 1 Header Actions (Supporting Zudoku-style Mega-Menus and Links)
  const headerLinks = site.headerLinks || [
    { label: 'Documentation', path: '/docs/documentation' },
    { label: 'Shipments', path: '/apis/shipments' },
    { label: 'API Catalog', path: '/catalog' },
  ];

  const headerLinksHtml = headerLinks
    .map((link) => {
      if (link.items && link.items.length > 0) {
        const subItemsHtml = link.items
          .map(
            (item) => `
            <a href="${escapeHtml(item.href || item.path || '#')}" class="portal-mega-menu-item">
              ${item.icon ? `<span class="portal-mega-menu-icon">${escapeHtml(item.icon)}</span>` : ''}
              <div class="portal-mega-menu-text">
                <div class="portal-mega-menu-title">${escapeHtml(item.title || item.label)}</div>
                ${item.description ? `<div class="portal-mega-menu-desc">${escapeHtml(item.description)}</div>` : ''}
              </div>
            </a>`
          )
          .join('');

        return `
        <div class="portal-nav-dropdown">
          <button type="button" class="portal-nav-link portal-dropdown-trigger" aria-haspopup="true" aria-expanded="false">
            <span>${escapeHtml(link.label)}</span>
            <span class="portal-dropdown-chevron">⌵</span>
          </button>
          <div class="portal-mega-menu">
            <div class="portal-mega-menu-grid">
              ${subItemsHtml}
            </div>
          </div>
        </div>`;
      }
      if (link.href) {
        return `<a href="${escapeHtml(link.href)}" target="_blank" rel="noopener" class="portal-nav-link">${escapeHtml(link.label)}</a>`;
      }
      return `<a href="${escapeHtml(link.path)}" class="portal-nav-link">${escapeHtml(link.label)}</a>`;
    })
    .join('');

  // 3. Row 2 Header Subnav Category Tabs (Matching Zudoku: Documentation | Shipments | API Catalog)
  const subnavTabs = [];
  subnavTabs.push({
    title: 'Documentation',
    path: '/docs/documentation',
    active: currentPath.startsWith('/docs') || currentPath === '/',
  });

  // Display primary API in header tabs (e.g. Shipments)
  const primaryApi = config.apis?.find((a) => a.id === 'shipments') || config.apis?.[0];
  if (primaryApi) {
    subnavTabs.push({
      title: primaryApi.title || 'Shipments',
      path: primaryApi.path,
      active: currentPath === primaryApi.path || currentPath.startsWith(`${primaryApi.path}/`),
    });
  }

  // Display API Catalog tab
  if (config.catalog) {
    const catalogPath = config.catalog.path || '/catalog';
    subnavTabs.push({
      title: config.catalog.label || 'API Catalog',
      path: catalogPath,
      active: currentPath === catalogPath || currentPath === '/apis',
    });
  }

  const subnavHtml = subnavTabs
    .map((tab) => `<a href="${escapeHtml(tab.path)}" class="portal-subnav-tab ${tab.active ? 'active' : ''}">${escapeHtml(tab.title)}</a>`)
    .join('');

  // 4. Left Sidebar Navigation Markup (Contextual: Doc tree OR OpenAPI operations tree)
  let sidebarContentHtml = '';

  if (isApiPage) {
    if (sidebarNavHtml) {
      sidebarContentHtml = sidebarNavHtml;
    } else if (spec) {
      sidebarContentHtml = renderNavBarHtml(spec, {
        activeHref: currentPath,
        includeSearch: true,
        searchPlaceholder: 'Filter endpoints...',
        backToDocsHref: '',
        backToDocsLabel: 'Documentation',
        itemClassName: 'portal-sidebar-op-item',
      });
    }
  } else {
    // Documentation Navigation Tree (Matching Core RapiDoc Navbar - Image 1 & 2)
    const docGroupsHtml = (config.navigation || [])
      .map((group) => {
        const itemsHtml = (group.items || [])
          .map((item) => {
            const isActive = item.path === currentPath;
            const badgeHtml = item.type === 'api' ? '<span class="nav-method as-colored-block get">API</span>' : '';
            return `
              <a href="${escapeHtml(item.path)}" class="nav-bar-path ${isActive ? 'active' : ''}" data-path="${escapeHtml(item.path)}">
                <span class="nav-bar-path-label">${escapeHtml(item.label)}</span>
                ${badgeHtml}
              </a>`;
          })
          .join('');

        return `
          <div class="nav-bar-tag-group expanded">
            <div class="nav-bar-tag-group-header" tabindex="0">
              <span class="nav-bar-tag-group-title">${escapeHtml(group.title)}</span>
              <span class="nav-bar-tag-group-icon"></span>
            </div>
            <div class="nav-bar-tags-under-group">
              ${itemsHtml}
            </div>
          </div>`;
      })
      .join('');

    sidebarContentHtml = `
      <div class="nav-bar-header">
        <div class="nav-bar-search-container">
          <div class="nav-bar-search-input-wrapper">
            <input type="text" placeholder="Filter..." class="nav-bar-search-input portal-filter-input" aria-label="Filter documentation" />
            <span class="nav-bar-search-icon">🔍</span>
          </div>
          <button type="button" class="portal-search-btn" id="advanced-search-btn">SEARCH</button>
        </div>
      </div>
      <div class="nav-scroll">
        ${docGroupsHtml}
      </div>`;
  }

  // 5. Right Sidebar Markup (TOC OR API Metadata Sidecar)
  let rightSidebarHtml = '';

  if (showApiSidecar && apiSidecar) {
    // API Sidecar (Zudoku Screenshot 3)
    const serversHtml = (apiSidecar.servers || [])
      .map(
        (s) => `
        <div class="portal-server-card">
          <div class="portal-server-desc">${escapeHtml(s.description || 'Server')}</div>
          <div class="portal-server-url-row">
            <code class="portal-server-url">${escapeHtml(s.url)}</code>
            <button class="portal-copy-btn" data-copy="${escapeHtml(s.url)}" title="Copy URL" aria-label="Copy server URL">📋</button>
          </div>
        </div>`
      )
      .join('');

    rightSidebarHtml = `
    <aside class="portal-toc portal-api-sidecar" aria-label="API Metadata">
      <div class="portal-sidecar-section">
        <div class="portal-sidecar-title">METADATA</div>
        <div class="portal-sidecar-meta">
          ${apiSidecar.version ? `<div class="portal-sidecar-item"><span class="portal-sidecar-label">Version</span> <span class="portal-sidecar-value">${escapeHtml(apiSidecar.version)}</span></div>` : ''}
          ${apiSidecar.license ? `<div class="portal-sidecar-item"><span class="portal-sidecar-label">License</span> <span class="portal-sidecar-value">${apiSidecar.license.url ? `<a href="${escapeHtml(apiSidecar.license.url)}" target="_blank" rel="noopener">${escapeHtml(apiSidecar.license.name || 'License')}</a>` : escapeHtml(apiSidecar.license.name)}</span></div>` : ''}
          ${apiSidecar.termsOfService ? `<div class="portal-sidecar-item"><a href="${escapeHtml(apiSidecar.termsOfService)}" target="_blank" rel="noopener" class="portal-sidecar-link">Terms of Service</a></div>` : ''}
        </div>
      </div>

      ${
        apiSidecar.contact
          ? `<div class="portal-sidecar-section">
              <div class="portal-sidecar-title">CONTACT</div>
              <div class="portal-sidecar-meta">
                ${apiSidecar.contact.name ? `<div class="portal-sidecar-contact-name">${escapeHtml(apiSidecar.contact.name)}</div>` : ''}
                ${apiSidecar.contact.email ? `<div><a href="mailto:${escapeHtml(apiSidecar.contact.email)}" class="portal-sidecar-link">✉️ ${escapeHtml(apiSidecar.contact.email)}</a></div>` : ''}
                ${apiSidecar.contact.url ? `<div><a href="${escapeHtml(apiSidecar.contact.url)}" target="_blank" rel="noopener" class="portal-sidecar-link">🔗 Support Portal</a></div>` : ''}
              </div>
            </div>`
          : ''
      }

      ${
        serversHtml
          ? `<div class="portal-sidecar-section">
              <div class="portal-sidecar-title">SERVERS</div>
              <div class="portal-sidecar-servers">${serversHtml}</div>
            </div>`
          : ''
      }
    </aside>`;
  } else if (showToc) {
    const tocItemsHtml = toc
      .map(
        (heading) => `
        <li class="portal-toc-item level-${heading.level}">
          <a href="#${escapeHtml(heading.id)}" class="portal-toc-link">${escapeHtml(heading.title)}</a>
        </li>`
      )
      .join('');

    rightSidebarHtml = `
    <aside class="portal-toc" aria-label="Table of Contents">
      <div class="portal-toc-title">On this page</div>
      <ul class="portal-toc-list">
        ${tocItemsHtml}
      </ul>
    </aside>`;
  }

  // 6. Pagination Pager Markup
  let pagerHtml = '';
  if (pager && (pager.prev || pager.next)) {
    pagerHtml = `
    <nav class="portal-pager" aria-label="Pagination Navigation">
      ${
        pager.prev
          ? `<a href="${escapeHtml(pager.prev.path)}" class="portal-pager-btn prev">
              <span class="portal-pager-label">&larr; Previous</span>
              <span class="portal-pager-title">${escapeHtml(pager.prev.label)}</span>
            </a>`
          : '<div></div>'
      }
      ${
        pager.next
          ? `<a href="${escapeHtml(pager.next.path)}" class="portal-pager-btn next" style="margin-left: auto;">
              <span class="portal-pager-label">Next &rarr;</span>
              <span class="portal-pager-title">${escapeHtml(pager.next.label)}</span>
            </a>`
          : '<div></div>'
      }
    </nav>`;
  }

  // 7. Hero Banner Markup
  const heroHtml = heroImage
    ? `<div class="portal-hero-banner"><img src="${escapeHtml(heroImage)}" alt="${escapeHtml(title || 'Banner')}" /></div>`
    : '';

  // 8. Multi-Column Footer Markup & Streamlined In-Pane Content Footer
  let footerHtml = '';
  let contentFooterHtml = '';
  const footer = site.footer || config.footer;
  const footerMode = footer?.mode || 'auto';

  if (footer && footerMode !== 'none') {
    const columnsHtml = (footer.columns || [])
      .map(
        (col) => `
        <div class="portal-footer-col">
          <div class="portal-footer-heading">${escapeHtml(col.title)}</div>
          <ul class="portal-footer-links">
            ${(col.links || [])
              .map((link) => {
                const isExternal = link.href?.startsWith('http') || link.path?.startsWith('http');
                const href = link.href || link.path || '#';
                return `
              <li>
                <a href="${escapeHtml(href)}" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''}>
                  <span>${escapeHtml(link.label)}</span>
                  ${isExternal ? '<svg class="portal-external-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>' : ''}
                </a>
              </li>`;
              })
              .join('')}
          </ul>
        </div>`
      )
      .join('');

    const socialIcons = {
      github: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`,
      x: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
      twitter: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
      discord: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`,
    };

    const socialHtml = (footer.social || [])
      .map((s) => {
        const key = (s.icon || s.name || '').toLowerCase();
        return `
        <a href="${escapeHtml(s.href)}" target="_blank" rel="noopener noreferrer" class="portal-social-link" title="${escapeHtml(s.name || s.icon || '')}" aria-label="${escapeHtml(s.name || s.icon || '')}">
          ${socialIcons[key] || `<span class="portal-social-icon">${escapeHtml(s.icon || s.name || '')}</span>`}
        </a>`;
      })
      .join('');

    footerHtml = `
    <footer class="portal-footer" role="contentinfo">
      <div class="portal-footer-container">
        <div class="portal-footer-grid-wrapper">
          <div class="portal-footer-grid" style="--columns: ${(footer.columns || []).length}">
            ${columnsHtml}
          </div>
        </div>
        <div class="portal-footer-bottom">
          <div class="portal-footer-brand">
            <span class="portal-footer-brand-name">${escapeHtml(site.title || '')}</span>
          </div>
          <div class="portal-footer-copy">${escapeHtml(footer.copyright || '')}</div>
          <div class="portal-footer-social">
            ${socialHtml}
          </div>
        </div>
      </div>
    </footer>`;

    let candidateLinks = (footer.columns || [])
      .flatMap((c) => c.links || [])
      .filter((l) =>
        ['privacy', 'terms', 'security', 'status', 'support', 'docs', 'api reference', 'features'].includes((l.label || '').toLowerCase())
      )
      .slice(0, 5);

    if (candidateLinks.length === 0 && footer.columns) {
      candidateLinks = (footer.columns || [])
        .map((c) => (c.links || [])[0])
        .filter(Boolean)
        .slice(0, 4);
    }

    const compactLinksHtml = candidateLinks
      .map(
        (l) =>
          `<a href="${escapeHtml(l.href || l.path || '#')}" ${l.href?.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''} class="portal-content-footer-link">${escapeHtml(l.label)}</a>`
      )
      .join('<span class="portal-content-footer-dot">&bull;</span>');

    contentFooterHtml = `
    <footer class="portal-content-footer" role="contentinfo">
      <div class="portal-content-footer-container">
        <div class="portal-content-footer-copy">${escapeHtml(footer.copyright || '')}</div>
        ${compactLinksHtml ? `<div class="portal-content-footer-links">${compactLinksHtml}</div>` : ''}
        ${socialHtml ? `<div class="portal-content-footer-social">${socialHtml}</div>` : ''}
      </div>
    </footer>`;
  }

  const pageContent = content;

  // Dynamic CSS variables for primary and link colors
  const customStyles = [];
  if (config.rapidoc?.['primary-color']) {
    customStyles.push(`--portal-primary: ${escapeHtml(config.rapidoc['primary-color'])};`);
  }
  if (config.rapidoc?.['link-color']) {
    customStyles.push(`--portal-link: ${escapeHtml(config.rapidoc['link-color'])};`);
  }
  const dynamicStyleTag = customStyles.length > 0 ? `<style>:root { ${customStyles.join(' ')} }</style>` : '';

  // 9. Assemble Full HTML Document
  return `<!DOCTYPE html>
<html lang="en" data-theme="${config.rapidoc?.theme || 'dark'}" class="${currentLayout === 'landing' ? 'portal-html-landing' : ''}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  ${metaDescription ? `<meta name="description" content="${escapeHtml(metaDescription)}">` : ''}
  <link rel="icon" href="${escapeHtml(site.favicon || '/favicon.ico')}">
  <link rel="stylesheet" href="${escapeHtml(baseAssetsPath)}/rapidoc-nav.css">
  <link rel="stylesheet" href="${escapeHtml(baseAssetsPath)}/portal.css">
  ${dynamicStyleTag}
  <script type="module" src="${escapeHtml(baseAssetsPath)}/rapidoc-min.js"></script>
</head>
<body data-assets-base="${escapeHtml(baseAssetsPath)}" class="${currentLayout === 'landing' ? 'portal-body-landing' : ''}">
  <header class="portal-header-wrapper">
    ${announcementHtml}

    <!-- Row 1: Brand, Search, Top Links & Theme Toggle -->
    <div class="portal-header-top">
      <a href="${escapeHtml(site.logo?.href || '/')}" class="portal-brand">
        ${site.logo?.light ? `<img src="${escapeHtml(site.logo.light)}" alt="${escapeHtml(site.logo.alt || site.title)}" class="portal-brand-logo" />` : ''}
        ${site.logo?.icon ? `<span class="portal-brand-icon">${escapeHtml(site.logo.icon)}</span>` : ''}
        <span>${escapeHtml(site.logo?.text || site.title || 'Developer Portal')}</span>
      </a>

      <button class="portal-search-trigger" aria-label="Search documentation" type="button">
        <span>🔍 Search</span>
        <kbd class="portal-search-kbd">⌘K</kbd>
      </button>

      <div class="portal-header-actions">
        ${headerLinksHtml}
        <button class="portal-theme-toggle" type="button" aria-label="Toggle theme">
          <span class="portal-theme-icon">🌙</span>
        </button>
      </div>
    </div>

    <!-- Row 2: Secondary Category Tabs -->
    <nav class="portal-header-subnav" aria-label="Main Section Tabs">
      ${subnavHtml}
    </nav>
  </header>

  <div class="portal-container portal-layout-${escapeHtml(currentLayout)} ${isApiPage ? 'portal-api-view' : ''}">
    ${
      currentLayout !== 'landing'
        ? `<aside class="portal-sidebar nav-bar" aria-label="Sidebar Navigation">
            <div class="portal-sidebar-body">
              ${sidebarContentHtml}
            </div>
            <div class="portal-sidebar-docked-footer">
              ${
                isApiPage
                  ? `<a href="/docs/documentation" class="portal-sidebar-footer-link">
                      <span class="nav-bar-path-label">&larr; Documentation</span>
                    </a>`
                  : `<a href="${escapeHtml(primaryApi?.path || '/apis/shipments')}" class="portal-sidebar-footer-link">
                      <span class="nav-bar-path-label">See ${escapeHtml(primaryApi?.title || 'Shipment API')} &rarr;</span>
                    </a>`
              }
            </div>
          </aside>`
        : ''
    }

    <main class="portal-main">
      <div class="portal-main-inner">
        <article class="portal-content-wrapper ${isApiPage ? 'portal-api-content-wrapper' : 'portal-prose'}">
          ${heroHtml}
          ${pageContent}
          ${pagerHtml}
        </article>
        ${currentLayout !== 'landing' && contentFooterHtml ? (footerMode === 'columns' ? footerHtml : contentFooterHtml) : ''}
      </div>
    </main>

    ${rightSidebarHtml}
  </div>

  ${currentLayout === 'landing' && footerHtml ? (footerMode === 'compact' ? contentFooterHtml : footerHtml) : ''}

  <!-- Full-Text Search Modal (⌘K / Ctrl+K) -->
  <div id="portal-search-modal" class="portal-search-modal-backdrop hidden" role="dialog" aria-modal="true" aria-label="Search Documentation">
    <div class="portal-search-modal-dialog">
      <div class="portal-search-modal-header">
        <span class="portal-search-modal-icon">🔍</span>
        <input
          type="search"
          class="portal-search-modal-input"
          placeholder="Search documentation, guides, and APIs..."
          aria-label="Search"
          autocomplete="off"
          spellcheck="false"
        />
        <button class="portal-search-modal-close" aria-label="Close search">&times;</button>
      </div>
      <div class="portal-search-modal-filters">
        <button type="button" class="portal-search-filter-btn active" data-filter="all">All</button>
        <button type="button" class="portal-search-filter-btn" data-filter="doc">Guides & Docs</button>
        <button type="button" class="portal-search-filter-btn" data-filter="api">API Operations</button>
      </div>
      <div class="portal-search-modal-body">
        <div class="portal-search-modal-results" role="listbox"></div>
        <div class="portal-search-modal-empty hidden">No results found for "<span class="portal-search-empty-query"></span>"</div>
        <div class="portal-search-modal-hint">Type keywords to search across guides, tutorials, and APIs...</div>
      </div>
      <div class="portal-search-modal-footer">
        <div class="portal-search-footer-hint"><kbd class="portal-kbd">↑</kbd><kbd class="portal-kbd">↓</kbd> <span>Navigate</span></div>
        <div class="portal-search-footer-hint"><kbd class="portal-kbd">↵</kbd> <span>Select</span></div>
        <div class="portal-search-footer-hint"><kbd class="portal-kbd">ESC</kbd> <span>Close</span></div>
      </div>
    </div>
  </div>

  <script src="${escapeHtml(baseAssetsPath)}/portal.js"></script>
</body>
</html>`;
}
