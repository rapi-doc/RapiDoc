import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs-extra';
import bannerPlugin from 'vite-plugin-banner';
import minifyHTML from '@lit-labs/rollup-plugin-minify-html-literals';
import { visualizer } from 'rollup-plugin-visualizer';
import { build } from 'vite';
import pkg from './package.json'
import { transform } from 'esbuild';
import { watch } from 'fs';
import { globSync } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sharedPlugins = [
  minifyHTML({
    include: ['src/**/*.js'],
  }),
  bannerPlugin(`/*!
   * @license
   * ${pkg.name} v${pkg.version}
   * (c) ${new Date().getFullYear()} ${pkg.author}
   * SPDX-License-Identifier: ${pkg.license}
   */`),
   {
    // Minify the final generated ESM bundle using esbuild and drop console/debugger
    name: 'minifyEs',
    async generateBundle(options, bundle) {
      for (const fileName of Object.keys(bundle)) {
        const chunk = bundle[fileName];
        if (chunk.type === 'chunk') {
          const result = await transform(chunk.code, { 
            minify: true,
            drop: ['console', 'debugger'],
            format: 'esm',
          });
          chunk.code = result.code;
        }
      }
    },
  },
  ...(process.env.ANALYZE === 'true' ? [
    visualizer({
      filename: resolve(__dirname, 'dist/stats.html'),
      title: 'RapiDoc Bundle Analysis',
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap',
    })
  ] : []),
];

let rapidocBuilt = false;

export default defineConfig({
  // Astro Related config 
  srcDir: './docs/src',
  outDir: './docs/generated-docs',
  publicDir: './docs/public',
  site: 'https://rapidocweb.com',
  build: {
    format: 'file'
  },

  // Vite related config 
  vite: {
    resolve: {
      alias: { 
        '~': resolve(__dirname, './src'),
        'rapidoc': resolve(__dirname, './src/index.js')
      },
    },
    plugins: [
      {
        name: 'build-rapidoc',
        apply: 'build', // Only run during build, not during dev
        async buildStart() {
          if (rapidocBuilt) return;
          rapidocBuilt = true;
          await build({
            configFile: false,
            build: {
              lib: {
                entry: resolve(__dirname, 'src/index.js'),
                formats: ['es'],
                fileName: 'rapidoc-min',
              },
              outDir: resolve(__dirname, 'dist'),
              emptyOutDir: true,
              rolldownOptions: {
                output: {
                  minify: true,
                },
              },
            },
            resolve: {
              alias: {
                '~': resolve(__dirname, './src'),
                '~/rapidoc': resolve(__dirname, './src/rapidoc.js'),
              }
            },
            plugins: sharedPlugins
          });
          
          // After building WebComponent copy it to docs/generated-docs/rapidoc
          await fs.ensureDir(resolve(__dirname, 'docs/generated-docs/rapidoc'));
          await fs.copy(
            resolve(__dirname, 'dist/rapidoc-min.js'),
            resolve(__dirname, 'docs/generated-docs/rapidoc/rapidoc-min.js')
          );
        }
      },
      {
        name: 'serve-source-in-dev',
        apply: 'serve', // Only run during dev not build
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/rapidoc/rapidoc-min.js') {
              // Redirect to the source file in development
              req.url = '/src/index.js';
            }
            next();
          });

          // Astro dont watch for yaml changes out of the box. So This code Watch for yaml changes and relods in dev mode
          const yamlFiles = globSync(resolve(__dirname, './docs/src/data/**/*.yaml'));
          yamlFiles.forEach(file => {
            watch(file, (eventType) => {
              if (eventType === 'change') {
                server.moduleGraph.invalidateAll();
                const hot = server.hot || server.ws;
                hot.send({
                  type: 'full-reload',
                  path: '*'
                });
              }
            });
          });
        }
      }
    ],
  },
});