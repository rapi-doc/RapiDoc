import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightSidebarTopics from 'starlight-sidebar-topics';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs-extra';
import { watch } from 'fs';
import { globSync } from 'glob';
import { build as viteBuild } from 'vite';
import { GTAG_ID } from './src/utils/googleAnalytics.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rapidocPkgPath = resolve(__dirname, '../packages/rapidoc');
const rapidocSrcPath = resolve(rapidocPkgPath, 'src');
const rapidocDistFile = resolve(rapidocPkgPath, 'dist/rapidoc-min.js');

let rapidocBuilt = false;

// Phosphor's SVG folders (assets/<weight>/), read at build time by src/components/Icon.astro through the
// virtual module below: a path resolved here, in Node, rather than in the bundled component.
const phosphorIconsDir = fileURLToPath(new URL('../assets/', import.meta.resolve('@phosphor-icons/core')));

export default defineConfig({
  srcDir: './src',
  outDir: './dist',
  publicDir: './public',
  site: 'https://rapidocui.com',
  build: {
    format: 'directory',
  },
  devToolbar: {
    enabled: false,
  },
  redirects: {
    // The Arazzo examples, renamed
    '/examples/arazzo-flow': '/examples/arazzo',
    '/examples/arazzo-flow-multi': '/examples/arazzo-multi',
    '/css': '/docs/theming/css-parts/',
    '/slots': '/docs/customizing/slots/',
    '/mini': '/rapidoc-mini/',
    '/mock': '/docs/mocking/in-browser/',
    '/oauth': '/docs/authentication/oauth/',
    '/theme': '/docs/theming/overview/',
    '/workflows': '/rapi-flow/',
    '/perf': '/tests/performance',
    '/tests/filtering-paths': '/examples/filter-operations',
    '/examples/filtering-paths': '/examples/filter-operations',
    '/guide/prerender': '/docs/performance/prerender/',
    '/prerender': '/docs/performance/prerender/',
    '/docs/advanced/mock-server': '/docs/mocking/in-browser/',
    '/docs/advanced/oauth-setup': '/docs/authentication/oauth/',
    '/docs/advanced/mcp-server': '/docs/ai/mcp-server/',
    '/docs/advanced/workflows': '/docs/rapi-flow/',
    '/docs/advanced/rapidoc-mini': '/docs/rapidoc-mini/',
    // The Components group, split into a group per element
    '/docs/components/workflows': '/docs/rapi-flow/',
    '/docs/components/rapidoc-mini': '/docs/rapidoc-mini/',
    '/docs/advanced/command-line': '/docs/cli/',
    '/docs/advanced/slots-and-markdown': '/docs/customizing/slots/',
    '/docs/advanced/markdown-headings': '/docs/customizing/markdown-headings/',
    '/docs/advanced/linking-and-navigation': '/docs/customizing/linking/',
    // The framework, command-line and integration pages, split into the Integrations and CLI topics
    '/docs/get-started/frameworks': '/docs/integrations/',
    '/docs/get-started/build-an-integration': '/docs/integrations/build-your-own/',
    '/docs/tools/command-line': '/docs/cli/',
    // The guides, folded into the docs (Common Tasks lists them), and the custom Quickstart
    '/guides': '/docs/guides/',
    '/guides/theme': '/docs/theming/overview/',
    '/guides/css': '/docs/theming/css-parts/',
    '/guides/slots': '/docs/customizing/slots/',
    '/guides/oauth': '/docs/authentication/oauth/',
    '/guides/mock': '/docs/mocking/in-browser/',
    '/guides/mcp': '/docs/ai/mcp-server/',
    '/guides/prerender': '/docs/performance/prerender/',
    '/quickstart': '/docs/get-started/quickstart/',
    // The Mini and RapiFlow guides, now their product pages
    '/guides/mini': '/rapidoc-mini/',
    '/guides/workflows': '/rapi-flow/',
    // The hand-written reference tables, replaced by pages generated from the elements' source
    '/docs/rapidoc-mini/attributes': '/api/rapi-doc-mini/',
    '/docs/rapi-flow/reference': '/api/rapi-flow/',
  },
  integrations: [
    starlight({
      title: 'RapiDoc',
      disable404Route: true,
      head: [
        {
          tag: 'script',
          attrs: {
            async: true,
            src: `https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`,
          },
        },
        {
          tag: 'script',
          content: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            (function() {
              var path = window.location.pathname.replace(/\\/+$/, '');
              var segs = path.split('/').filter(Boolean);
              var docTitle = (document.title || '').replace(/\\s*\\|\\s*RapiDoc$/i, '').trim();
              if (!docTitle && segs.length > 0) {
                var last = segs[segs.length - 1];
                docTitle = last.split('-').map(function(w){ return w.charAt(0).toUpperCase() + w.slice(1); }).join(' ');
              }
              var gaTitle = docTitle ? 'Docs / ' + docTitle : 'Docs';
              gtag('config', '${GTAG_ID}', {
                page_title: gaTitle,
                content_group: 'Docs',
              });
            })();
          `,
        },
      ],
      logo: {
        light: './src/assets/rapidoc-lockup-light.svg',
        dark: './src/assets/rapidoc-lockup-dark.svg',
        alt: 'RapiDoc',
        replacesTitle: true,
      },
      favicon: '/favicon.svg',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/rapi-doc/RapiDoc' }],
      customCss: ['./src/styles/tokens.css', './src/styles/starlight-custom.css'],
      components: {
        Header: './src/components/DocsHeader.astro',
        // The product switcher with Phosphor icons, above Starlight's sidebar (replaces the plugin's)
        Sidebar: './src/components/DocsSidebar.astro',
        ThemeProvider: './src/components/ForceDarkTheme.astro',
        ThemeSelect: './src/components/EmptyComponent.astro',
      },
      // The RapiDoc Portal's code blocks: the asides' corners and border, a lightly tinted title bar
      // only on blocks with a title, and no terminal dots.
      expressiveCode: {
        themes: ['github-dark'],
        useStarlightDarkModeSwitch: false,
        defaultProps: { frame: 'code' },
        shiki: { langAlias: { markdoc: 'md', mdoc: 'md' } },
        styleOverrides: {
          borderRadius: 'var(--rd-radius)',
          borderColor: 'var(--rd-docs-border)',
          frames: {
            frameBoxShadowCssValue: 'none',
            editorTabBarBackground: 'color-mix(in oklab, var(--rd-docs-fg) 5%, var(--rd-docs-bg))',
            editorTabBarBorderBottomColor: 'var(--rd-docs-border)',
            editorActiveTabBackground: 'transparent',
            editorActiveTabBorderColor: 'transparent',
            editorActiveTabIndicatorTopColor: 'transparent',
            editorActiveTabIndicatorBottomColor: 'transparent',
            terminalTitlebarBackground: 'color-mix(in oklab, var(--rd-docs-fg) 5%, var(--rd-docs-bg))',
            terminalTitlebarBorderBottomColor: 'var(--rd-docs-border)',
            terminalTitlebarDotsOpacity: '0',
          },
        },
      },
      // A sidebar per product (starlight-sidebar-topics): the switcher at the top of the sidebar
      // (components/DocsSidebar.astro; icons are Phosphor names, as in page-data/products.ts) lists these topics, and each page shows the sidebar of the topic it belongs to. Every page under
      // content/docs/ must be in one topic's items, or the build fails; a page listed in two topics shows
      // the first one's sidebar, so list each page once.
      plugins: [
        starlightSidebarTopics([
          {
            label: 'RapiDoc',
            link: '/docs/',
            icon: 'file-code',
            items: [
              {
                label: 'Getting Started',
                items: [
                  { label: 'Introduction', slug: 'docs' },
                  { label: 'Quickstart', slug: 'docs/get-started/quickstart' },
                  { label: 'Common Tasks', slug: 'docs/guides' },
                  { label: 'Packages', slug: 'docs/get-started/packages' },
                  { label: 'Loading Your Spec', slug: 'docs/get-started/openapi-support' },
                ],
              },
              {
                label: 'Theming & Styling',
                items: [
                  { label: 'Theming Overview', slug: 'docs/theming/overview' },
                  { label: 'Built-in Themes', slug: 'docs/theming/prebuilt-themes' },
                  { label: 'CSS Parts & Variables', slug: 'docs/theming/css-parts' },
                ],
              },
              {
                label: 'Customizing Content',
                items: [
                  { label: 'HTML Slots', slug: 'docs/customizing/slots' },
                  { label: 'Markdown Headings in the Sidebar', slug: 'docs/customizing/markdown-headings' },
                  { label: 'Links & Navigation', slug: 'docs/customizing/linking' },
                ],
              },
              {
                label: 'Authentication',
                items: [{ label: 'OAuth 2.0', slug: 'docs/authentication/oauth' }],
              },
              {
                label: 'JavaScript API',
                items: [
                  { label: 'Methods', slug: 'docs/programmatic-api/lifecycle-and-methods' },
                  { label: 'Events', slug: 'docs/programmatic-api/event-hooks' },
                ],
              },
              {
                label: 'Performance',
                items: [
                  { label: 'Render Modes', slug: 'docs/performance/render-modes' },
                  { label: 'Large Specs', slug: 'docs/performance/large-specs' },
                  { label: 'Pre-rendering', slug: 'docs/performance/prerender' },
                ],
              },
              {
                label: 'Mocking',
                items: [
                  { label: 'Overview', slug: 'docs/mocking/overview' },
                  { label: 'In-Browser Mock', slug: 'docs/mocking/in-browser' },
                  { label: 'Mock Server', slug: 'docs/mocking/mock-server' },
                ],
              },
              {
                label: 'AI & MCP',
                items: [{ label: 'MCP Server', slug: 'docs/ai/mcp-server' }],
              },
              {
                label: 'Reference',
                items: [
                  { label: 'API Reference', link: '/api/' },
                  { label: 'Examples', link: '/examples/' },
                ],
              },
              {
                label: 'Migration Guides',
                collapsed: true,
                items: [
                  { label: 'v13 to v14', slug: 'docs/migration/v13-to-v14' },
                  { label: 'v12 to v13', slug: 'docs/migration/v12-to-v13' },
                  { label: 'v11 to v12', slug: 'docs/migration/v11-to-v12' },
                  { label: 'v10 to v11', slug: 'docs/migration/v10-to-v11' },
                ],
              },
            ],
          },
          {
            label: 'RapiDoc Mini',
            link: '/docs/rapidoc-mini/',
            icon: 'puzzle-piece',
            items: [
              { label: 'Overview', slug: 'docs/rapidoc-mini' },
              { label: 'API Reference', link: '/api/rapi-doc-mini/' },
              { label: 'Live Demos', link: '/rapidoc-mini/' },
            ],
          },
          {
            label: 'RapiFlow',
            link: '/docs/rapi-flow/',
            icon: 'path',
            items: [
              { label: 'Overview', slug: 'docs/rapi-flow' },
              { label: 'Pairing with <rapi-doc>', slug: 'docs/rapi-flow/pairing' },
              { label: 'Running Workflows', slug: 'docs/rapi-flow/running' },
              { label: 'Arazzo Extensions', slug: 'docs/rapi-flow/extensions' },
              { label: 'Slots & Styling', slug: 'docs/rapi-flow/styling' },
              { label: 'API Reference', link: '/api/rapi-flow/' },
              { label: 'Live Demo', link: '/rapi-flow/' },
            ],
          },
          {
            label: 'RapiPdf',
            link: '/docs/rapipdf/',
            icon: 'file-pdf',
            items: [
              { label: 'Overview', slug: 'docs/rapipdf' },
              { label: 'In Node', slug: 'docs/rapipdf/node' },
              { label: 'API Reference', link: '/api/rapi-pdf/' },
              { label: 'Live Demo', link: '/rapipdf/' },
            ],
          },
          {
            label: 'RapiDoc CLI',
            link: '/docs/cli/',
            icon: 'terminal',
            items: [
              { label: 'Overview', slug: 'docs/cli' },
              {
                label: 'Commands',
                items: [
                  { label: 'preview', slug: 'docs/cli/preview' },
                  { label: 'validate', slug: 'docs/cli/validate' },
                  { label: 'lint', slug: 'docs/cli/lint' },
                  { label: 'bundle', slug: 'docs/cli/bundle' },
                  { label: 'pdf', slug: 'docs/cli/pdf' },
                  { label: 'mock', slug: 'docs/cli/mock' },
                  { label: 'mcp', slug: 'docs/cli/mcp' },
                ],
              },
              { label: 'All Commands & Options', slug: 'docs/cli/reference' },
              {
                label: 'Portal Commands',
                link: 'https://portal.rapidocui.com/docs/reference/cli/',
                attrs: { target: '_blank' },
              },
            ],
          },
          {
            label: 'Integrations',
            link: '/docs/integrations/',
            icon: 'plug',
            items: [
              { label: 'Overview', slug: 'docs/integrations' },
              { label: 'Front-End Frameworks', slug: 'docs/integrations/front-end' },
              {
                label: 'Server Frameworks',
                items: [
                  { label: 'Hono, Express & Fastify', slug: 'docs/integrations/node' },
                  { label: 'FastAPI & Starlette', slug: 'docs/integrations/python' },
                  { label: 'ASP.NET Core', slug: 'docs/integrations/dotnet' },
                  { label: 'Go', slug: 'docs/integrations/go' },
                ],
              },
              { label: 'Documentation Sites', slug: 'docs/integrations/docs-sites' },
              { label: 'Build an Integration', slug: 'docs/integrations/build-your-own' },
            ],
          },
          {
            label: 'Developer Portal',
            link: 'https://portal.rapidocui.com/',
            icon: 'layout',
            attrs: { target: '_blank' },
          },
        ]),
      ],
    }),
  ],
  vite: {
    resolve: {
      alias: {
        '~': rapidocSrcPath,
        '~/rapidoc': resolve(rapidocSrcPath, 'rapidoc.ts'),
        '~/rapidoc-mini': resolve(rapidocSrcPath, 'rapidoc-mini.ts'),
        '~/oauth-receiver': resolve(rapidocSrcPath, 'oauth-receiver.ts'),
        '@rapidoc/prerender': resolve(rapidocSrcPath, '../../rapidoc-prerender/src/index.js'),
        'rapidoc/flow': resolve(rapidocSrcPath, 'flow.js'),
        // <rapi-pdf> from its source, like rapidoc: the /rapipdf page's demo (the generator is a lazy chunk)
        rapipdf: resolve(__dirname, '../packages/rapipdf/src/index.js'),
        rapidoc: resolve(rapidocSrcPath, 'index.js'),
      },
      // Starlight default-imports js-yaml 4; bundled, it resolves to Starlight's copy, not a hoisted js-yaml 5 (no default export).
      // Astro's prerender chunk imports cookie 2 (`parseCookie`); bundled, it resolves to Astro's copy, not the
      // hoisted cookie 0.7 that express (via @modelcontextprotocol/sdk) puts at the repo root.
      noExternal: ['js-yaml', 'cookie'],
    },
    server: {
      fs: {
        allow: ['..'],
      },
    },
    plugins: [
      {
        name: 'docs-icons',
        resolveId(id) {
          return id === 'virtual:docs-icons' ? '\0virtual:docs-icons' : null;
        },
        load(id) {
          return id === '\0virtual:docs-icons' ? `export const iconsDir = ${JSON.stringify(phosphorIconsDir)};` : null;
        },
      },
      {
        name: 'build-rapidoc',
        apply: 'build',
        async buildStart() {
          if (rapidocBuilt) return;
          rapidocBuilt = true;

          // If rapidoc hasn't been built yet, build it using its vite config
          if (!fs.existsSync(rapidocDistFile)) {
            await viteBuild({
              configFile: resolve(rapidocPkgPath, 'vite.config.mjs'),
            });
          }

          // Copy rapidoc-min.js to docs output directory (dist)
          await fs.ensureDir(resolve(__dirname, 'dist/rapidoc'));
          await fs.copy(rapidocDistFile, resolve(__dirname, 'dist/rapidoc/rapidoc-min.js'));
          // and the notices of the third-party code bundled into it, which its banner points to
          if (fs.existsSync(`${rapidocDistFile}.LICENSE.txt`)) {
            await fs.copy(
              `${rapidocDistFile}.LICENSE.txt`,
              resolve(__dirname, 'dist/rapidoc/rapidoc-min.js.LICENSE.txt'),
            );
          }

          // Automatically sync rapidoc-min.js to generated-docs as well
          const genDocsDir = resolve(__dirname, 'generated-docs');
          if (fs.existsSync(genDocsDir)) {
            const genRapidocDir = resolve(genDocsDir, 'rapidoc');
            await fs.ensureDir(genRapidocDir);
            await fs.copy(rapidocDistFile, resolve(genRapidocDir, 'rapidoc-min.js'));
          }
        },
      },
      {
        name: 'serve-rapidoc-in-dev',
        apply: 'serve',
        async configureServer(server) {
          // Serve live unminified RapiDoc module directly from src
          server.middlewares.use((req, res, next) => {
            const pathname = req.url ? req.url.split('?')[0] : '';
            if (pathname === '/rapidoc/rapidoc-min.js' || pathname === '/rapidoc/rapidoc.js') {
              res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
              res.setHeader('Cache-Control', 'no-cache');
              res.end(`import '/@fs${resolve(rapidocSrcPath, 'index.js')}';\n`);
              return;
            }
            next();
          });

          // Watch rapidoc source changes and trigger page reload. Invalidate the changed module first and
          // debounce: this watcher can fire before Vite's own, and reloading then serves a mix of new and
          // stale cached modules (e.g. a new font-styles.js with an old theme-tokens.js).
          let reloadTimer;
          watch(rapidocSrcPath, { recursive: true }, (_event, filename) => {
            const moduleGraph = server.environments?.client?.moduleGraph ?? server.moduleGraph;
            if (filename) {
              for (const mod of moduleGraph.getModulesByFile(resolve(rapidocSrcPath, filename)) ?? []) {
                moduleGraph.invalidateModule(mod);
              }
            }
            clearTimeout(reloadTimer);
            reloadTimer = setTimeout(() => {
              const hot = server.hot || server.ws;
              hot?.send({
                type: 'full-reload',
                path: '*',
              });
            }, 150);
          });

          // Watch yaml changes and trigger reload
          // rapidoc.ts is here too: the /api page is built from its declarations and doc comments
          const yamlFiles = [
            ...globSync(resolve(__dirname, './src/page-data/**/*.yaml')),
            resolve(rapidocSrcPath, 'rapidoc.ts'),
          ];
          yamlFiles.forEach((file) => {
            watch(file, (eventType) => {
              if (eventType === 'change') {
                server.moduleGraph.invalidateAll();
                const hot = server.hot || server.ws;
                hot.send({
                  type: 'full-reload',
                  path: '*',
                });
              }
            });
          });
        },
      },
    ],
  },
});
