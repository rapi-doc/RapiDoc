import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import pkg from "./package.json" with { type: "json" };
import { thirdPartyLicenses } from "../../scripts/third-party-licenses.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// `rapipdf/node` for Node: the loader, the core and the fonts in one file. pdfmake stays external
// (the package's one runtime dependency): its Node build reads data files from its own folder.
export default defineConfig({
  // node.js.LICENSE.txt: notices of the npm packages bundled in
  plugins: [thirdPartyLicenses({ owner: `${pkg.name} ${pkg.version}` })],
  build: {
    ssr: true,
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/node.js"),
      formats: ["es"],
    },
    rollupOptions: {
      external: [/^node:/, "pdfmake"],
      output: {
        entryFileNames: "node.js",
      },
    },
    outDir: resolve(__dirname, "dist"),
  },
  ssr: {
    // Everything else is bundled, so installing rapipdf brings in pdfmake only
    noExternal: true,
  },
});
