import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs-extra';
import banner from 'vite-plugin-banner';
import pkg from './package.json';

export default defineConfig({
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'), // Example alias
    },
  },
  plugins: [
    banner(`/*!
     * @license
     * ${pkg.name} v${pkg.version}
     * (c) ${new Date().getFullYear()} ${pkg.author}
     * SPDX-License-Identifier: ${pkg.license}
     */`),
    {
      name: 'copy-rapidoc-min-js',
      closeBundle: async () => {
        const rapidocMinJs = 'rapidoc-min.js';
        const distRapidocMinJsPath = resolve(__dirname, 'dist', rapidocMinJs);
        const docsRapidocMinJsPath = resolve(__dirname, 'docs', rapidocMinJs);

        // Copy rapidoc-min.js to docs folder
        await fs.copy(distRapidocMinJsPath, docsRapidocMinJsPath);
        console.log('\x1b[36m%s\x1b[0m', `Copied from ${distRapidocMinJsPath} to ${docsRapidocMinJsPath}`);
      },
    },
  ],
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'], // host docs folder access as http://locahost:{port}/docs/list.html
    },
  },
  build: {
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
