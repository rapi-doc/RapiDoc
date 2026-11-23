import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// `@rapidoc/prerender` for Node: this package's renderer plus the templates, components, styles and
// utilities it uses from packages/rapidoc/src (whose files import each other through `~`). The
// third-party packages stay external; they are this package's dependencies.
export default defineConfig({
  resolve: {
    alias: {
      "~": resolve(__dirname, "../rapidoc/src"),
    },
  },
  build: {
    ssr: true,
    lib: {
      // `internal` is `@rapidoc/prerender/internal`: for the other RapiDoc packages, not public API
      entry: {
        index: resolve(__dirname, "src/index.js"),
        internal: resolve(__dirname, "src/internal.js"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        /^node:/,
        "lit",
        /^lit\//,
        "@scalar/openapi-parser",
        "marked",
        "js-yaml",
        "yaml",
        "github-slugger",
        /^microlighter/,
      ],
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
      },
    },
    outDir: resolve(__dirname, "dist"),
  },
});
