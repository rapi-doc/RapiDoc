import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
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

export default defineConfig({
  srcDir: './src',
  outDir: './dist',
  publicDir: './public',
  site: 'https://rapidocweb.com',
  build: {
    format: 'directory',
  },
  devToolbar: {
    enabled: false,
  },
  redirects: {
    '/css': '/guides/css',
    '/slots': '/guides/slots',
    '/mini': '/guides/mini',
    '/mock': '/guides/mock',
    '/oauth': '/guides/oauth',
    '/theme': '/guides/theme',
    '/perf': '/tests/performance',
    '/font': '/examples/font',
    '/examples/font-size': '/examples/font',
    '/examples/render-read-light': '/examples/render-styles',
    '/examples/render-view-light': '/examples/render-styles',
    '/examples/schema-table': '/examples/schema-styles',
    '/examples/schema-tab-default': '/examples/schema-styles',
    '/examples/search-by-params': '/examples/search',
    '/examples/mock': '/examples/reqres',
    '/examples/header-color': '/examples/themes',
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
            gtag('config', '${GTAG_ID}');
          `,
        },
      ],
      logo: {
        src: './src/assets/logo.png',
      },
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/rapi-doc/RapiDoc' }],
      customCss: ['./src/styles/starlight-custom.css'],
      components: {
        Header: './src/components/DocsHeader.astro',
        ThemeProvider: './src/components/ForceDarkTheme.astro',
        ThemeSelect: './src/components/EmptyComponent.astro',
      },
      expressiveCode: {
        themes: ['github-dark'],
        useStarlightDarkModeSwitch: false,
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', slug: 'docs' },
            { label: 'Quickstart & Frameworks', slug: 'docs/get-started/quickstart' },
            { label: 'OpenAPI Spec Support', slug: 'docs/get-started/openapi-support' },
          ],
        },
        {
          label: 'Theming & Deep Styling',
          items: [
            { label: 'Theming Overview', slug: 'docs/theming/overview' },
            { label: 'CSS Parts (::part)', slug: 'docs/theming/css-parts' },
            { label: 'Pre-built Themes & Recipes', slug: 'docs/theming/prebuilt-themes' },
          ],
        },
        {
          label: 'Programmatic API',
          items: [
            { label: 'JavaScript API & Lifecycle', slug: 'docs/programmatic-api/lifecycle-and-methods' },
            { label: 'Event Hooks & Interception', slug: 'docs/programmatic-api/event-hooks' },
          ],
        },
        {
          label: 'Performance Tips',
          items: [
            { label: 'Large Spec Optimization', slug: 'docs/performance/large-specs' },
            { label: 'Render Modes & Benchmarks', slug: 'docs/performance/render-modes' },
          ],
        },
        {
          label: 'Advanced Guides',
          items: [
            { label: 'In-Browser Mock Server', slug: 'docs/advanced/mock-server' },
            { label: 'OAuth 2.0 Integration', slug: 'docs/advanced/oauth-setup' },
            { label: 'Markdown Headings in Navbar', slug: 'docs/advanced/markdown-headings' },
            { label: 'Markdown Links & Navigation', slug: 'docs/advanced/linking-and-navigation' },
            { label: 'HTML Slots & Custom UI', slug: 'docs/advanced/slots-and-markdown' },
            { label: 'RapiDoc Mini Widget', slug: 'docs/advanced/rapidoc-mini' },
          ],
        },
      ],
    }),
  ],
  vite: {
    resolve: {
      alias: {
        '~': rapidocSrcPath,
        '~/rapidoc': resolve(rapidocSrcPath, 'rapidoc.js'),
        '~/rapidoc-mini': resolve(rapidocSrcPath, 'rapidoc-mini.js'),
        '~/oauth-receiver': resolve(rapidocSrcPath, 'oauth-receiver.js'),
        rapidoc: resolve(rapidocSrcPath, 'index.js'),
      },
    },
    server: {
      fs: {
        allow: ['..'],
      },
    },
    plugins: [
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

          // Watch rapidoc source changes and trigger page reload
          watch(rapidocSrcPath, { recursive: true }, () => {
            const hot = server.hot || server.ws;
            hot?.send({
              type: 'full-reload',
              path: '*',
            });
          });

          // Watch yaml changes and trigger reload
          const yamlFiles = globSync(resolve(__dirname, './src/page-data/**/*.yaml'));
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
