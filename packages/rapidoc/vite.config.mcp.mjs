import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// `rapidoc/mcp`: the manifest builder, runtime and project writer for Node, nothing from Lit.
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
      entry: resolve(__dirname, "src/mcp.js"),
      formats: ["es"],
    },
    rollupOptions: {
      external: [/^node:/],
      output: {
        entryFileNames: "rapidoc-mcp-min.js",
      },
    },
    outDir: resolve(__dirname, "dist"),
  },
});
