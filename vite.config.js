//@ts-check1
import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs-extra';
import banner from 'vite-plugin-banner';
import pkg from './package.json';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import { transform } from 'esbuild';

export default defineConfig({
  resolve: {
    alias: {
      '~': resolve(__dirname, './src'), // Example alias
    },
  },
  plugins: [
    minifyHTML.default({
      include:["./src/*", "./src/styles/*", "./src/templates/*", "./src/components/*"],
      exclude:["./src/utils/*"]
    }),
    banner(`/*!
     * @license
     * ${pkg.name} v${pkg.version}
     * (c) ${new Date().getFullYear()} ${pkg.author}
     * SPDX-License-Identifier: ${pkg.license}
     */`),
    {
      name: 'copy-rapidoc-min-js-to-docs',
      closeBundle: async () => {
        const rapidocMinJs = 'rapidoc-min.js';
        const distRapidocMinJsPath = resolve(__dirname, 'dist', rapidocMinJs);
        const docsRapidocMinJsPath = resolve(__dirname, 'docs', rapidocMinJs);

        // Copy rapidoc-min.js to docs folder
        await fs.copy(distRapidocMinJsPath, docsRapidocMinJsPath);
        console.log('\x1b[36m%s\x1b[0m', `Copied from ${distRapidocMinJsPath} to ${docsRapidocMinJsPath}`);
      },
    },
    {
      name: 'minifyEs',
      renderChunk: {
        order: 'post',
        async handler(code, chunk, outputOptions) {
          if (outputOptions.format === 'es' && chunk.fileName.endsWith('-min.js')) {
            return await transform(code, { minify: true });
          }
          return code;
        },
      }
    }
  ],
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'], // host docs folder access as http://locahost:{port}/docs/list.html
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      formats: ['es', 'esm'],
      fileName: (format) => ({
        es: `${pkg.name}.js`,
        esm: `${pkg.name}-min.js`,
      })[format]
    },
    sourcemap: true,
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: undefined, // ensures no chunking
        entryFileNames: `rapidoc-min.js`, // For entry points
        chunkFileNames: 'rapidoc-min-[hash].js', // For code-split chunks with hashes
      },
    },
  },
});
