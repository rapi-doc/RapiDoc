import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import bannerPlugin from "vite-plugin-banner";
import pkg from "./package.json" with { type: "json" };
import { thirdPartyLicenses, LICENSE_FILE_SUFFIX } from "../../scripts/third-party-licenses.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// dist/rapipdf-min.js: <rapi-pdf> as one self-contained file (pdfmake, its fonts and the spec parser
// bundled in). A classic script, so `<script src>` works with or without type="module", as it did
// in 2.x. vite.config.es.mjs builds the ES module that loads the heavy part on first use.
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  return {
    plugins: [
      bannerPlugin((fileName) =>
        fileName.endsWith(".js")
          ? `/*!
 * @license
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * SPDX-License-Identifier: ${pkg.license}
 * Bundled third-party code and its licenses: ${fileName}${LICENSE_FILE_SUFFIX}
 */`
          : null,
      ),
      // <bundle>.LICENSE.txt: notices of the npm packages bundled in, which minification strips.
      thirdPartyLicenses({ owner: `${pkg.name} ${pkg.version}` }),
    ],
    build: {
      sourcemap: isDev,
      minify: !isDev,
      lib: {
        entry: resolve(__dirname, "src/index.js"),
        formats: ["iife"],
        name: "RapiPdfModule",
        fileName: () => "rapipdf-min.js",
      },
      rollupOptions: {
        // One file: the generator the element imports on first use is inlined
        output: { inlineDynamicImports: true, exports: "named" },
      },
      outDir: resolve(__dirname, "dist"),
      emptyOutDir: true,
    },
  };
});
