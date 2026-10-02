import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import bannerPlugin from 'vite-plugin-banner';
import minifyHTML from '@lit-labs/rollup-plugin-minify-html-literals';
import { visualizer } from 'rollup-plugin-visualizer';
import { transform } from 'esbuild';
import pkg from './package.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
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
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, './src'),
      '~/rapidoc': resolve(__dirname, './src/rapidoc.js'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      formats: ['es'],
      fileName: () => 'rapidoc-min.js',
    },
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
});
