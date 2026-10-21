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
        background-color: var(--background, #0f172a);
        color: var(--foreground, #cccccc);
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
        border-right: 1px solid var(--border, #2d3748);
        background-color: var(--background, #0f172a);
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
        background-color: var(--background, #0f172a);
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

        // Navigation click -> scroll to endpoint
        sidebar.addEventListener('click', (e) => {
          const link = e.target.closest('.nav-bar-path, .nav-bar-info, .nav-bar-tag, .nav-bar-tag-title');
          if (!link) return;
          if (e.target.closest('.nav-bar-tag-icon')) return;

          const href = link.getAttribute('href') || link.getAttribute('data-tag-href');
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
        background-color: var(--sl-color-black, #0f172a);
        color: var(--sl-color-white, #ffffff);
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
        color: #94a3b8;
      }
      .catalog-section {
        margin-bottom: 3rem;
      }
      .category-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 1.25rem;
        border-bottom: 1px solid #334155;
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
        background: #1e293b;
        border: 1px solid #334155;
        text-decoration: none;
        transition: transform 0.2s ease, border-color 0.2s ease;
      }
      .api-card:hover {
        transform: translateY(-3px);
        border-color: var(--sl-color-accent, #f76b39);
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
        background: rgba(247, 107, 57, 0.15);
        color: var(--sl-color-accent, #f76b39);
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
      }
      .api-version {
        font-size: 0.8rem;
        color: #94a3b8;
      }
      .api-card-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: #ffffff;
        margin: 0 0 0.5rem;
      }
      .api-card-desc {
        font-size: 0.95rem;
        color: #94a3b8;
        flex: 1;
        line-height: 1.5;
        margin-bottom: 1rem;
      }
      .api-card-footer {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--sl-color-accent, #f76b39);
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
  </body>
</html>
`;
}

export function generateIndexAstro() {
  return `---
return Astro.redirect('/docs/documentation');
---
`;
}
