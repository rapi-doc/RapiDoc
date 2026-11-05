import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import baseConfig from "./vite.config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

// <rapi-flow> ships as its own file (rapidoc/flow), so rapidoc-min.js carries no Arazzo code.
// Same plugins as the main build.
export default defineConfig((env) => {
  const base = baseConfig(env);
  return {
    ...base,
    build: {
      ...base.build,
      emptyOutDir: false,
      lib: {
        entry: resolve(__dirname, "src/flow.js"),
        formats: ["es"],
        fileName: () => "rapidoc-flow-min.js",
      },
    },
  };
});
