import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
    },
  },
  build: {
    ssr: true,
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/static/index.js"),
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
        "microlighter",
      ],
      output: {
        entryFileNames: "rapidoc-static-min.js",
      },
    },
    outDir: resolve(__dirname, "dist"),
  },
});
