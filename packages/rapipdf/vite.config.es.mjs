import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { transform } from "esbuild";
import baseConfig from "./vite.config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

// dist/rapipdf.js: <rapi-pdf> as an ES module for bundlers and `<script type="module">`. The element
// itself is a few kilobytes; the generator (spec parser, pdfmake, fonts) is a separate chunk under
// dist/chunks/ that is fetched the first time a PDF is asked for. Same plugins as the main build.
export default defineConfig((env) => {
  const base = baseConfig(env);
  return {
    ...base,
    plugins: [
      ...base.plugins,
      // Vite leaves an ES library build unminified
      ...(base.build.minify
        ? [
            {
              name: "minifyEs",
              async generateBundle(options, bundle) {
                for (const chunk of Object.values(bundle)) {
                  if (chunk.type !== "chunk") continue;
                  chunk.code = (await transform(chunk.code, { minify: true, format: "esm" })).code;
                }
              },
            },
          ]
        : []),
    ],
    build: {
      ...base.build,
      emptyOutDir: false,
      lib: {
        entry: resolve(__dirname, "src/index.js"),
        formats: ["es"],
        fileName: () => "rapipdf.js",
      },
      rollupOptions: {
        output: { chunkFileNames: "chunks/[name]-[hash].js" },
      },
    },
  };
});
