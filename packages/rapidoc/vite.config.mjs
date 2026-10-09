import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import bannerPlugin from 'vite-plugin-banner';
import minifyHTML from '@lit-labs/rollup-plugin-minify-html-literals';
import { visualizer } from 'rollup-plugin-visualizer';
import { transform } from 'esbuild';
import pkg from './package.json' with { type: 'json' };
import { captureBuildInfo } from '../../scripts/capture-build-info.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development' || process.env.NODE_ENV === 'development';

  return {
    plugins: [
      ...(!isDev
        ? [
            minifyHTML({
              include: ['src/**/*.{js,ts}'],
            }),
          ]
        : []),
      bannerPlugin(`/*!
 * @license
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * SPDX-License-Identifier: ${pkg.license}
 */`),
      ...(!isDev
        ? [
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
          ]
        : []),
      {
        name: 'record-build-info',
        closeBundle() {
          captureBuildInfo();
        },
      },
      ...(process.env.ANALYZE === 'true'
        ? [
            visualizer({
              filename: resolve(__dirname, 'dist/stats.html'),
              title: 'RapiDoc Bundle Analysis',
              open: true,
              gzipSize: true,
              brotliSize: true,
              template: 'treemap',
            }),
          ]
        : []),
    ],
    resolve: {
      alias: {
        '~': resolve(__dirname, './src'),
        '~/rapidoc': resolve(__dirname, './src/rapidoc.ts'),
      },
    },
    build: {
      sourcemap: isDev,
      minify: !isDev,
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        formats: ['es'],
        fileName: () => 'rapidoc-min.js',
      },
      outDir: resolve(__dirname, 'dist'),
      emptyOutDir: true,
    },
  };
});
