import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs-extra';
import bannerPlugin from 'vite-plugin-banner';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import { build } from 'vite';
import pkg from './package.json' assert { type: "json" };
import { transform } from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sharedPlugins = [
  minifyHTML.default({
    include: ["./src/*", "./src/styles/*", "./src/templates/*", "./src/components/*"],
    exclude: ["./src/utils/*"]
  }),
  bannerPlugin(`/*!
   * @license
   * ${pkg.name} v${pkg.version}
   * (c) ${new Date().getFullYear()} ${pkg.author}
   * SPDX-License-Identifier: ${pkg.license}
   */`),
   {
    // This plugin is added coz in vite library mode The generated bundle is not minified 
    name: 'minifyEs',
    renderChunk: {
      order: 'post',
      async handler(code, chunk, outputOptions) {
        return await transform(code, { 
          minify: true,
          drop: ['console','debugger'],
          format: 'esm',
        });
      },
    },
  }
];

export default defineConfig({
  // Astro Related config 
  srcDir: './docs/src',
  outDir: './docs/dist',
  publicDir: './docs/public',
  site: 'https://rapidocweb.com',
  build: {
    format: 'file'
  },

  // Vite related config 
  vite: {
    resolve: {
      alias: { 
        '~': resolve(__dirname, './src')
      },
    },
    plugins: [
      {
        name: 'build-rapidoc',
        apply: 'build', // Only run during build, not during dev
        async buildStart() {
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
            },
            resolve: {
              alias: {
                '~': resolve(__dirname, './src'),
                '~/rapidoc': resolve(__dirname, './src/rapidoc.js'),
              }
            },
            plugins: sharedPlugins
          });
          
          // After building WebComponent copy it to docs/dist/assets
          await fs.ensureDir(resolve(__dirname, 'docs/dist/assets'));
          await fs.copy(
            resolve(__dirname, 'dist/rapidoc-min.js'),
            resolve(__dirname, 'docs/dist/assets/rapidoc-min.js')
          );
        }
      },
      {
        name: 'serve-source-in-dev',
        apply: 'serve', // Only run during dev not build
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/assets/rapidoc-min.js') {
              // Redirect to the source file in development
              req.url = '/src/index.js';
            }
            next();
          });
        }
      }
    ],
  },
});