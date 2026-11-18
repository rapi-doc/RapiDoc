import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { thirdPartyLicenses } from "../../../scripts/third-party-licenses.js";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "../public/spec-check");
const mockUi = resolve(here, "../../../packages/rapidoc-mock/dist/ui");

/** The files of the page that are not bundled: the page itself, the example, and the Mock UI as the mock builds it. */
const COPIED = [
  [resolve(here, "index.html"), "index.html"],
  [resolve(here, "example.yaml"), "example.yaml"],
  [resolve(mockUi, "mock-ui.js"), "mock-ui.js"],
  [resolve(mockUi, "mock-ui.LICENSE.txt"), "mock-ui.LICENSE.txt"],
];

/**
 * The spec check of the Rapi Mock site, built into `public/spec-check/` (ignored by git), which the portal
 * copies to the site as `/spec-check/`.
 *
 * - `spec-check.js`: `page.js` with the validator, the lint rules and the mock bundled in, from this repository's
 *   own packages. Its third-party notices go to `spec-check.js.LICENSE.txt`.
 * - `mock-ui.js`: the Mock UI, copied from `packages/rapidoc-mock/dist/ui` (run `npm run build:mock` first). The
 *   site has no copy of its source and no build of its own for it.
 */
export default defineConfig({
  root: here,
  logLevel: "warn",
  // a library build keeps `process.env.NODE_ENV` as written, and a browser has no `process`
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  plugins: [
    thirdPartyLicenses({ owner: "the Rapi Mock spec check" }),
    {
      name: "spec-check-files",
      closeBundle() {
        mkdirSync(out, { recursive: true });
        for (const [from, name] of COPIED) copyFileSync(from, resolve(out, name));
      },
    },
  ],
  build: {
    lib: { entry: resolve(here, "page.js"), formats: ["es"], fileName: () => "spec-check.js" },
    outDir: out,
    emptyOutDir: true,
    target: "es2022",
  },
});
