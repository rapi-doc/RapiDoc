import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { tokens } from "../../../packages/rapidoc-mock/ui/styles/tokens.js";
import { thirdPartyLicenses } from "../../../scripts/third-party-licenses.js";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "../public/spec-check");
const mockUi = resolve(here, "../../../packages/rapidoc-mock/dist/ui");

/** Where the page takes the Mock UI's design tokens: a comment in its `:root` rule, replaced at build time. */
const TOKENS = "/* mock-ui-tokens */";

/** The files that are copied as they are: the example, and the Mock UI as the mock builds it. */
const COPIED = [
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
 * - `index.html`: the page, with the Mock UI's design tokens written into its `:root` rule.
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
        // the page itself, with the Mock UI's tokens written in, so its colors are always the Mock UI's
        const page = readFileSync(resolve(here, "index.html"), "utf8");
        if (!page.includes(TOKENS)) throw new Error(`index.html has no ${TOKENS} to replace`);
        // a function, so a "$" in the tokens is never read as a replacement pattern
        writeFileSync(resolve(out, "index.html"), page.replace(TOKENS, () => tokens.trim()));
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
