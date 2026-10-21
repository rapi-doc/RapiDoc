/**
 * Generates the Astro template files for the .rapidoc engine workspace.
 */

export function generateAstroConfigMjs({ siteTitle, primaryColor = '#f76b39', sidebarConfigJson }) {
  return `import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://developer.portal',
  build: {
    format: 'directory',
  },
  integrations: [
    starlight({
      title: ${JSON.stringify(siteTitle)},
      disable404Route: true,
      sidebar: ${sidebarConfigJson},
      components: {
        Header: './src/components/PortalHeader.astro',
        Footer: './src/components/PortalFooter.astro',
      },
      customCss: ['./src/styles/starlight-custom.css'],
      expressiveCode: {
        themes: ['github-dark', 'github-light'],
      },
      head: [
        {
          tag: 'script',
          attrs: {
            type: 'module',
            src: '/assets/rapidoc-min.js',
          },
        },
      ],
    }),
  ],
});
`;
}

export function generateContentConfigTs() {
  return `import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema(),
  }),
};
`;
}

export function generateApiRouteAstro() {
  return `---
import '../styles/starlight-custom.css';
import PortalHeader from '../components/PortalHeader.astro';
import { getNavBarHtml, getNavCss, getThemeTokensCss, toKebabCase } from 'rapidoc/static';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'yaml';

export async function getStaticPaths() {
  const configPath = path.resolve(process.cwd(), 'rapidoc.portal.json');
  const portalConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  const paths = [];

  for (const api of portalConfig.apis || []) {
    const cleanBasePath = (api.path || \`/apis/\${api.id}\`).replace(/^\\//, '');

    // 1. Root API route (e.g. apis/shipments)
    paths.push({
      params: { apiRoute: cleanBasePath },
      props: { api, portalConfig, activeTagSlug: '', currentPath: api.path },
    });

    // 2. Parse spec tags to generate tag sub-pages (e.g. apis/shipments/shipment-management)
    let specData = null;
    if (!api.isRemote && api.fullPath && fs.existsSync(api.fullPath)) {
      try {
        const raw = fs.readFileSync(api.fullPath, 'utf8');
        try {
          specData = JSON.parse(raw);
        } catch {
          specData = yaml.parse(raw);
        }
      } catch {
        // Fall through
      }
    }

    if (specData) {
      const tagsList = [];
      if (specData.tags && Array.isArray(specData.tags)) {
        specData.tags.forEach((t) => {
          if (t && t.name) tagsList.push(t);
        });
      } else if (specData.paths) {
        const seenTags = new Set();
        Object.values(specData.paths).forEach((p) => {
          if (!p || typeof p !== 'object') return;
          ['get', 'post', 'put', 'delete', 'patch'].forEach((m) => {
            if (p[m]?.tags && Array.isArray(p[m].tags)) {
              p[m].tags.forEach((t) => seenTags.add(t));
            }
          });
        });
        seenTags.forEach((name) => tagsList.push({ name }));
      }

      for (const t of tagsList) {
        const tagSlug = toKebabCase(t.name);
        if (!tagSlug || tagSlug === 'general') continue;
        const tagRoute = \`\${cleanBasePath}/\${tagSlug}\`;
        paths.push({
          params: { apiRoute: tagRoute },
          props: {
            api,
            portalConfig,
            activeTagSlug: tagSlug,
            currentPath: \`\${api.path}/\${tagSlug}\`,
          },
        });
      }
    }
  }

  return paths;
}

const { api, portalConfig, activeTagSlug = '', currentPath = api.path } = Astro.props;

let specInput = api.root;
const specFileName = api.fullPath ? path.basename(api.fullPath) : \`\${api.id}.json\`;
const specUrl = api.isRemote ? api.root : \`/specs/\${specFileName}\`;

if (!api.isRemote && api.fullPath && fs.existsSync(api.fullPath)) {
  const raw = fs.readFileSync(api.fullPath, 'utf8');
  try {
    specInput = JSON.parse(raw);
  } catch {
    try {
      specInput = yaml.parse(raw);
    } catch {
      specInput = raw;
    }
  }
}

const themePreset = portalConfig.rapidoc?.theme || 'amber';
const initialColorScheme = portalConfig.rapidoc?.['color-scheme'] || 'dark';

let sidebarNavHtml = '';
try {
  sidebarNavHtml = await getNavBarHtml(specInput, {
    basePath: api.path,
    activeHref: currentPath,
    routingMode: 'tag-pages',
    includeSearch: true,
    searchPlaceholder: 'Filter endpoints...',
    itemClassName: 'portal-sidebar-op-item',
  });
} catch (err) {
  sidebarNavHtml = \`<div style="padding: 1.5rem; color: #ef4444;">Failed to render navigation: \${err.message}</div>\`;
}

const navCss = getNavCss('.portal-sidebar');
const themeTokensCss = getThemeTokensCss({ theme: themePreset });
---

<!doctype html>
<html lang="en" data-theme={initialColorScheme}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{api.title || \`\${api.id} API\`} — {portalConfig.site?.title || 'Developer Portal'}</title>
    <style set:html={themeTokensCss}></style>
    <style set:html={navCss}></style>
    <script type="module" src="/assets/rapidoc-min.js"></script>
    <style is:global>
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        max-height: 100vh;
        overflow: hidden;
        background-color: var(--portal-bg, #0b0f19);
        color: var(--portal-fg, #f8fafc);
        font-family: var(--font-regular, system-ui, sans-serif);
        display: flex;
        flex-direction: column;
      }
      .portal-container {
        display: grid;
        grid-template-columns: 280px minmax(0, 1fr);
        flex: 1 1 0%;
        min-height: 0;
        height: 100%;
        overflow: hidden;
        width: 100%;
      }
      .portal-sidebar {
        width: 280px;
        min-width: 280px;
        max-width: 280px;
        height: 100%;
        max-height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        border-right: 1px solid var(--portal-border, rgba(255, 255, 255, 0.08));
        background-color: var(--portal-bg, #0b0f19);
        box-sizing: border-box;
      }
      .portal-sidebar .nav-scroll {
        flex: 1 1 0%;
        min-height: 0;
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        overscroll-behavior: contain;
        padding: 8px 0;
        box-sizing: border-box;
        scrollbar-width: thin;
      }
      .portal-main {
        flex: 1 1 0%;
        height: 100%;
        max-height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        overscroll-behavior: contain;
        scroll-behavior: smooth;
        padding: 0;
        scrollbar-width: thin;
        background-color: var(--portal-bg, #0b0f19);
      }
      rapi-doc {
        display: block;
        width: 100%;
        padding: 24px 32px;
        box-sizing: border-box;
      }
    </style>
  </head>
  <body>
    <PortalHeader portalConfig={portalConfig} />

    <div class="portal-container">
      <aside class="portal-sidebar nav-bar" aria-label="API Navigation">
        <Fragment set:html={sidebarNavHtml} />
      </aside>

      <main class="portal-main">
        <rapi-doc
          spec-url={specUrl}
          color-scheme={initialColorScheme}
          theme={themePreset}
          show-side-nav="false"
          show-header="false"
          update-route="false"
          render-style="read"
          auto-height="true"
          allow-authentication="true"
          allow-server-selection="false"
          allow-try="true"
          schema-style="table"
          use-path-in-nav-bar="true"
          nav-item-spacing="compact"
          goto-path={activeTagSlug ? activeTagSlug : undefined}
        ></rapi-doc>
      </main>
    </div>

    <script is:inline>
      document.addEventListener('DOMContentLoaded', () => {
        const sidebar = document.querySelector('.portal-sidebar');
        const rapiDocEl = document.querySelector('rapi-doc');
        if (!sidebar || !rapiDocEl) return;

        // Sync clicks from static sidebar to internal rapidoc elements
        sidebar.addEventListener('click', (e) => {
          const link = e.target.closest('.portal-sidebar-op-item, .nav-bar-path');
          if (!link) return;

          const href = link.getAttribute('href');
          if (!href) return;

          const hashIdx = href.indexOf('#');
          const elementId = hashIdx !== -1 ? href.substring(hashIdx + 1) : '';
          if (!elementId) return;

          const targetEl = rapiDocEl.shadowRoot?.getElementById(elementId) ||
                           rapiDocEl.shadowRoot?.querySelector('[data-op-slug="' + CSS.escape(elementId) + '"]') ||
                           rapiDocEl.shadowRoot?.querySelector('[id$="--' + CSS.escape(elementId) + '"]');

          if (targetEl || elementId === 'overview') {
            e.preventDefault();
            window.history.pushState(null, '', href);
            sidebar.querySelectorAll('.active').forEach((el) => el.classList.remove('active'));
            link.classList.add('active');

            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else if (typeof rapiDocEl.scrollToPath === 'function') {
              rapiDocEl.scrollToPath(elementId);
            }
          }
        });

        // Tag expand / collapse chevron
        sidebar.addEventListener('click', (e) => {
          const chevron = e.target.closest('.nav-bar-tag-icon');
          if (!chevron) return;
          const tagParent = chevron.closest('.nav-bar-tag-and-paths');
          if (tagParent) {
            tagParent.classList.toggle('expanded');
            tagParent.classList.toggle('collapsed');
          }
        });

        // Main content scroll -> update sidebar active item
        rapiDocEl.addEventListener('nav-active-change', (e) => {
          const targetId = e.detail?.id || e.detail?.elementId;
          if (!targetId) return;

          sidebar.querySelectorAll('.active').forEach((el) => el.classList.remove('active'));
          const matchingLink = document.getElementById('link-' + targetId) ||
            sidebar.querySelector('.nav-bar-path[data-content-id="' + CSS.escape(targetId) + '"]') ||
            sidebar.querySelector('.nav-bar-path[data-op-slug="' + CSS.escape(targetId) + '"]') ||
            sidebar.querySelector('.nav-bar-path[data-content-id$="--' + CSS.escape(targetId) + '"]');

          if (matchingLink) {
            matchingLink.classList.add('active');
            const navScroll = sidebar.querySelector('.nav-scroll');
            if (navScroll) {
              const itemRect = matchingLink.getBoundingClientRect();
              const scrollRect = navScroll.getBoundingClientRect();
              if (itemRect.top < scrollRect.top + 20 || itemRect.bottom > scrollRect.bottom - 40) {
                const targetTop = itemRect.top - scrollRect.top + navScroll.scrollTop - 40;
                navScroll.scrollTo({ top: targetTop, behavior: 'smooth' });
              }
            }
          }
        });
      });
    </script>
  </body>
</html>
`;
}

export function generateCatalogAstro() {
  return `---
import '../styles/starlight-custom.css';
import PortalHeader from '../components/PortalHeader.astro';
import PortalFooter from '../components/PortalFooter.astro';
import fs from 'node:fs';
import path from 'node:path';

const configPath = path.resolve(process.cwd(), 'rapidoc.portal.json');
const portalConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const apis = portalConfig.apis || [];

const categorized = new Map();
for (const api of apis) {
  const cat = api.category || 'General';
  if (!categorized.has(cat)) categorized.set(cat, []);
  categorized.get(cat).push(api);
}
---

<!doctype html>
<html lang="en" data-theme="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>API Catalog — {portalConfig.site?.title || 'Developer Portal'}</title>
    <style>
      html, body {
        margin: 0;
        padding: 0;
        background-color: var(--portal-bg, #0b0f19);
        color: var(--portal-fg, #f8fafc);
        font-family: var(--sl-font-system, system-ui, sans-serif);
      }
      .catalog-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 3rem 1.5rem 5rem;
      }
      .catalog-hero {
        text-align: center;
        margin-bottom: 3.5rem;
      }
      .catalog-hero h1 {
        font-size: 2.75rem;
        font-weight: 800;
        margin-bottom: 0.75rem;
      }
      .catalog-hero p {
        font-size: 1.25rem;
        color: var(--portal-muted, #94a3b8);
      }
      .catalog-section {
        margin-bottom: 3rem;
      }
      .category-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 1.25rem;
        border-bottom: 1px solid var(--portal-border, rgba(255, 255, 255, 0.08));
        padding-bottom: 0.5rem;
      }
      .api-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1.5rem;
      }
      .api-card {
        display: flex;
        flex-direction: column;
        padding: 1.5rem;
        border-radius: 12px;
        background: var(--portal-surface, #111827);
        border: 1px solid var(--portal-border, rgba(255, 255, 255, 0.08));
        text-decoration: none;
        transition: transform 0.2s ease, border-color 0.2s ease;
      }
      .api-card:hover {
        transform: translateY(-3px);
        border-color: var(--portal-primary, #f76b39);
      }
      .api-card-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.75rem;
      }
      .api-badge {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        background: color-mix(in srgb, var(--portal-primary, #f76b39) 15%, transparent);
        color: var(--portal-primary, #f76b39);
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
      }
      .api-version {
        font-size: 0.8rem;
        color: var(--portal-muted, #94a3b8);
      }
      .api-card-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--portal-fg, #ffffff);
        margin: 0 0 0.5rem;
      }
      .api-card-desc {
        font-size: 0.95rem;
        color: var(--portal-muted, #94a3b8);
        flex: 1;
        line-height: 1.5;
        margin-bottom: 1rem;
      }
      .api-card-footer {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--portal-primary, #f76b39);
      }
    </style>
  </head>
  <body>
    <PortalHeader portalConfig={portalConfig} />

    <div class="catalog-container">
      <div class="catalog-hero">
        <h1>API Catalog</h1>
        <p>Discover, explore, and integrate with our comprehensive developer APIs.</p>
      </div>

      {Array.from(categorized.entries()).map(([category, items]) => (
        <section class="catalog-section">
          <h2 class="category-title">{category}</h2>
          <div class="api-grid">
            {items.map((api) => (
              <a href={api.path || \`/apis/\${api.id}\`} class="api-card">
                <div class="api-card-header">
                  <span class="api-badge">{api.category || 'REST'}</span>
                  {api.version && <span class="api-version">{api.version}</span>}
                </div>
                <h3 class="api-card-title">{api.title || api.id}</h3>
                <p class="api-card-desc">{api.description || 'Interactive OpenAPI documentation and live request testing.'}</p>
                <div class="api-card-footer">
                  <span>Explore Reference &rarr;</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>

    <PortalFooter portalConfig={portalConfig} />
  </body>
</html>
`;
}

export function generateIndexAstro() {
  return `---
import '../styles/starlight-custom.css';
import PortalHeader from '../components/PortalHeader.astro';
import PortalFooter from '../components/PortalFooter.astro';
import DualToneIcon from '../components/DualToneIcon.astro';
import fs from 'node:fs';
import path from 'node:path';

const configPath = path.resolve(process.cwd(), 'rapidoc.portal.json');
const portalConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const site = portalConfig.site || {};
const apis = portalConfig.apis || [];
const configFeaturedIds = site.featuredApis || site.highlightedApis || site.pinnedApis || [];
const highlightedApis = apis.filter((a) => a.featured || a.highlighted || a.pinned || configFeaturedIds.includes(a.id));
const firstHighlightedApi = highlightedApis[0];
const remainingFeaturedApis = highlightedApis.length > 1 ? highlightedApis.slice(1) : apis.slice(0, 6);
---

<!doctype html>
<html lang="en" data-theme="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{site.title || 'Developer Portal'} — Universal API Platform</title>
    <style>
      html, body {
        margin: 0;
        padding: 0;
        background-color: var(--portal-bg, #0b0f19);
        color: var(--portal-fg, #f8fafc);
        font-family: var(--sl-font-system, system-ui, sans-serif);
      }
      main {
        overflow-x: clip;
      }

      /* Hero Section */
      .landing-hero {
        position: relative;
        padding: 4.5rem 1.5rem 5.5rem;
        max-width: 1240px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .landing-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.35rem 0.85rem;
        border-radius: 9999px;
        background: color-mix(in srgb, var(--portal-primary, #f76b39) 14%, transparent);
        border: 1px solid color-mix(in srgb, var(--portal-primary, #f76b39) 30%, transparent);
        color: var(--portal-primary, #f76b39);
        font-size: 0.8125rem;
        font-weight: 600;
        margin-bottom: 1.75rem;
      }

      .landing-title {
        font-size: clamp(2.5rem, 5vw, 4rem);
        font-weight: 800;
        letter-spacing: -0.03em;
        line-height: 1.15;
        max-width: 960px;
        margin: 0 0 1.25rem;
        background: linear-gradient(135deg, #ffffff 40%, #94a3b8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .landing-subtitle {
        font-size: clamp(1.1rem, 2vw, 1.25rem);
        color: var(--portal-muted, #94a3b8);
        max-width: 720px;
        line-height: 1.6;
        margin: 0 0 2.5rem;
      }

      .landing-cta-group {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 3.5rem;
      }

      .landing-btn-primary {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.875rem 1.75rem;
        border-radius: 10px;
        background: var(--portal-primary, #f76b39);
        color: #000000;
        font-weight: 700;
        font-size: 0.95rem;
        text-decoration: none;
        transition: transform 0.15s ease, filter 0.15s ease;
      }
      .landing-btn-primary:hover {
        transform: translateY(-2px);
        filter: brightness(1.1);
      }

      .landing-btn-secondary {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.875rem 1.75rem;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--portal-border, rgba(255, 255, 255, 0.12));
        color: var(--portal-fg, #ffffff);
        font-weight: 600;
        font-size: 0.95rem;
        text-decoration: none;
        transition: all 0.15s ease;
      }
      .landing-btn-secondary:hover {
        background: rgba(255, 255, 255, 0.09);
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
      }

      /* Cypress-Style Interactive Code Card */
      .landing-code-card {
        width: 100%;
        max-width: 820px;
        background: var(--portal-surface, #111827);
        border: 1px solid var(--portal-border, rgba(255, 255, 255, 0.08));
        border-radius: 14px;
        box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7);
        overflow: hidden;
        text-align: left;
      }

      .landing-code-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1.25rem;
        background: rgba(255, 255, 255, 0.02);
        border-bottom: 1px solid var(--portal-border, rgba(255, 255, 255, 0.06));
      }

      .landing-dots {
        display: flex;
        gap: 0.45rem;
      }
      .landing-dot {
        width: 11px;
        height: 11px;
        border-radius: 50%;
      }
      .landing-dot.red { background: #ef4444; }
      .landing-dot.yellow { background: #eab308; }
      .landing-dot.green { background: #22c55e; }

      .landing-code-title {
        font-size: 0.8125rem;
        color: var(--portal-muted, #94a3b8);
        font-family: var(--sl-font-mono, monospace);
      }

      .landing-code-body {
        padding: 1.25rem 1.5rem;
        font-family: var(--sl-font-mono, monospace);
        font-size: 0.875rem;
        line-height: 1.7;
        overflow-x: auto;
        margin: 0;
      }
      .code-comment { color: #64748b; }
      .code-keyword { color: #f43f5e; font-weight: 600; }
      .code-string { color: #34d399; }
      .code-prop { color: #38bdf8; }
      .code-val { color: #fbbf24; }

      /* 3-Column Features Section */
      .landing-features-section {
        max-width: 1240px;
        margin: 0 auto;
        padding: 2rem 1.5rem 5rem;
      }

      .section-header {
        text-align: center;
        margin-bottom: 3.5rem;
      }
      .section-badge {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--portal-primary, #f76b39);
        margin-bottom: 0.5rem;
      }
      .section-title {
        font-size: 2.25rem;
        font-weight: 800;
        margin: 0 0 0.75rem;
        letter-spacing: -0.02em;
      }
      .section-desc {
        font-size: 1.125rem;
        color: var(--portal-muted, #94a3b8);
        max-width: 600px;
        margin: 0 auto;
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 1.5rem;
      }

      .feature-card {
        padding: 2rem;
        border-radius: 14px;
        background: var(--portal-surface, #111827);
        border: 1px solid var(--portal-border, rgba(255, 255, 255, 0.08));
        transition: transform 0.2s ease, border-color 0.2s ease;
      }
      .feature-card:hover {
        transform: translateY(-3px);
        border-color: rgba(255, 255, 255, 0.16);
      }

      .feature-icon-box {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.25rem;
      }
      .feature-card:nth-child(1) .feature-icon-box { background: rgba(56, 189, 248, 0.14); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.28); }
      .feature-card:nth-child(2) .feature-icon-box { background: rgba(245, 158, 11, 0.14); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.28); }
      .feature-card:nth-child(3) .feature-icon-box { background: rgba(52, 211, 153, 0.14); color: #34d399; border: 1px solid rgba(52, 211, 153, 0.28); }

      .feature-title {
        font-size: 1.25rem;
        font-weight: 700;
        margin: 0 0 0.5rem;
        color: var(--portal-fg, #ffffff);
      }
      .feature-text {
        font-size: 0.9375rem;
        line-height: 1.6;
        color: var(--portal-muted, #94a3b8);
        margin: 0;
      }

      /* Featured APIs Section */
      .landing-apis-section {
        max-width: 1240px;
        margin: 0 auto;
        padding: 0 1.5rem 5rem;
      }
      .apis-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        gap: 1.5rem;
      }
      .landing-api-card {
        padding: 1.5rem;
        border-radius: 12px;
        background: var(--portal-surface, #111827);
        border: 1px solid var(--portal-border, rgba(255, 255, 255, 0.08));
        text-decoration: none;
        display: flex;
        flex-direction: column;
        transition: transform 0.2s ease, border-color 0.2s ease;
      }
      .landing-api-card:hover {
        transform: translateY(-3px);
        border-color: var(--portal-primary, #f76b39);
      }
      .landing-api-badge {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--portal-primary, #f76b39);
        text-transform: uppercase;
        margin-bottom: 0.5rem;
      }
      .landing-api-title {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--portal-fg, #ffffff);
        margin: 0 0 0.5rem;
      }
      .landing-api-desc {
        font-size: 0.9rem;
        color: var(--portal-muted, #94a3b8);
        line-height: 1.5;
        flex: 1;
        margin: 0 0 1rem;
      }
      .landing-api-arrow {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--portal-primary, #f76b39);
      }
    </style>
  </head>
  <body>
    <PortalHeader portalConfig={portalConfig} />

    <main>
      <!-- Hero -->
      <section class="landing-hero">
        <div class="landing-badge">
          <span>✨</span>
          <span>Interstellar Shipping Active for 3025</span>
        </div>

        <h1 class="landing-title">
          Universal Developer Platform for Galactic Logistics
        </h1>

        <p class="landing-subtitle">
          Integrate quantum telemetry, automated planetary customs, warp manifests, and FTL cargo transport with robust OpenAPI developer tooling.
        </p>

        <div class="landing-cta-group">
          <a href="/docs/documentation" class="landing-btn-primary">
            <span>Read Docs</span>
            <span>&rarr;</span>
          </a>
          <a href="/catalog" class="landing-btn-secondary">
            <span>API Catalog</span>
          </a>
          {firstHighlightedApi && (
            <a href={firstHighlightedApi.path || \`/apis/\${firstHighlightedApi.id}\`} class="landing-btn-secondary">
              <span>{firstHighlightedApi.title || firstHighlightedApi.id} Reference</span>
            </a>
          )}
        </div>

        <!-- Live Code Card -->
        <div class="landing-code-card">
          <div class="landing-code-header">
            <div class="landing-dots">
              <span class="landing-dot red"></span>
              <span class="landing-dot yellow"></span>
              <span class="landing-dot green"></span>
            </div>
            <span class="landing-code-title">POST /v1/shipments/quantum-route</span>
            <div></div>
          </div>
          <pre class="landing-code-body"><code><span class="code-comment">// Dispatch an FTL container with sub-light radar tracking</span>
<span class="code-keyword">curl</span> -X POST https://api.cosmocargo.space/v1/shipments \\
  -H <span class="code-string">"Authorization: Bearer cosmo_sec_89f02a"</span> \\
  -H <span class="code-string">"Content-Type: application/json"</span> \\
  -d '&#123;
    <span class="code-prop">"origin"</span>: <span class="code-string">"Sol-Station-Alpha"</span>,
    <span class="code-prop">"destination"</span>: <span class="code-string">"Kepler-452b-Colony"</span>,
    <span class="code-prop">"cargo"</span>: &#123; <span class="code-prop">"class"</span>: <span class="code-string">"Quantum-Cores"</span>, <span class="code-prop">"mass_tons"</span>: <span class="code-val">42.5</span> &#125;,
    <span class="code-prop">"warp_lane"</span>: <span class="code-string">"Hyperlane-Route-Sigma-9"</span>
  &#125;'</code></pre>
        </div>
      </section>

      <!-- 3-Column Features -->
      <section class="landing-features-section">
        <div class="section-header">
          <div class="section-badge">Platform Capabilities</div>
          <h2 class="section-title">Built for Interstellar Velocity</h2>
          <p class="section-desc">Reliable logistics infrastructure engineered to scale from planetary orbits to deep space colonies.</p>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon-box">
              <DualToneIcon name="satellite" size={24} />
            </div>
            <h3 class="feature-title">Quantum-Entangled Tracking</h3>
            <p class="feature-text">Real-time telemetry streams across light-years with zero packet loss and sub-millisecond precision.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon-box">
              <DualToneIcon name="zap" size={24} />
            </div>
            <h3 class="feature-title">Automated Warp Routing</h3>
            <p class="feature-text">Dynamic trajectory calculations avoiding asteroid belts, gravity wells, and unpredictable solar storm corridors.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon-box">
              <DualToneIcon name="box" size={24} />
            </div>
            <h3 class="feature-title">Declarative Manifests</h3>
            <p class="feature-text">Automated planetary quarantine clearance and multi-sector customs compliance verification via webhooks.</p>
          </div>
        </div>
      </section>

      <!-- Featured APIs -->
      <section class="landing-apis-section">
        <div class="section-header">
          <div class="section-badge">Explore References</div>
          <h2 class="section-title">Featured Developer APIs</h2>
          <p class="section-desc">Interactive OpenAPI 3.1 documentation with live request testing and zero-latency client hydration.</p>
        </div>

        <div class="apis-grid">
          {remainingFeaturedApis.map((api) => (
            <a href={api.path || \`/apis/\${api.id}\`} class="landing-api-card">
              <div class="landing-api-badge">{api.category || 'Core'}</div>
              <h3 class="landing-api-title">{api.title || \`\${api.id} API\`}</h3>
              <p class="landing-api-desc">{api.description || 'Interactive OpenAPI documentation with live sandbox execution.'}</p>
              <div class="landing-api-arrow">Explore Reference &rarr;</div>
            </a>
          ))}
        </div>
      </section>
    </main>

    <PortalFooter portalConfig={portalConfig} />
  </body>
</html>
`;
}
