import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// `@rapidoc/mcp` for Node: bundles the shared MCP and Arazzo code from packages/rapidoc/src (no Lit,
// no element; tests/unit/headless-boundary.test.js keeps it that way) and leaves `yaml` external.
export default defineConfig({
  build: {
    ssr: true,
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      formats: ["es"],
    },
    rollupOptions: {
      external: [/^node:/, "yaml"],
      output: {
        entryFileNames: "index.js",
      },
    },
    outDir: resolve(__dirname, "dist"),
  },
});
