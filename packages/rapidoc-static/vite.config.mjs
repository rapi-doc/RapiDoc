import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// `@rapidoc/static` for Node: this package's renderer plus the templates, components, styles and
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
      entry: resolve(__dirname, "src/index.js"),
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        /^node:/,
        "lit",
        /^lit\//,
        "@scalar/openapi-parser",
        "marked",
        "yaml",
        "github-slugger",
        /^microlighter/,
      ],
      output: {
        entryFileNames: "index.js",
      },
    },
    outDir: resolve(__dirname, "dist"),
  },
});
