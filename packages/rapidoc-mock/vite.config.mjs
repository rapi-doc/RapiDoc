import { defineConfig } from "vite";
import { existsSync, readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** The folder of an installed package, from here upward (the workspace root holds them). */
function packageDir(name) {
  for (let dir = __dirname; ; dir = dirname(dir)) {
    const candidate = resolve(dir, "node_modules", name);
    if (existsSync(resolve(candidate, "package.json"))) return candidate;
    if (dir === dirname(dir)) throw new Error(`${name} is not installed`);
  }
}

/** The packages bundled into the Mock UI: their licenses go out with it. */
const BUNDLED = [
  "lit",
  "lit-html",
  "lit-element",
  "@lit/reactive-element",
  "@tanstack/table-core",
  "@tanstack/store",
  "@phosphor-icons/core",
];

/** Writes `mock-ui.LICENSE.txt` beside the bundle: each bundled package's version, license and notice. */
const licenses = () => ({
  name: "mock-ui-licenses",
  generateBundle() {
    const source = BUNDLED.map((name) => {
      const dir = packageDir(name);
      const { version, license } = JSON.parse(readFileSync(resolve(dir, "package.json"), "utf8"));
      const text = readFileSync(resolve(dir, "LICENSE"), "utf8").trim();
      return `${name}@${version} (${license})\n\n${text}`;
    }).join("\n\n----------------------------------------\n\n");
    this.emitFile({ type: "asset", fileName: "mock-ui.LICENSE.txt", source: `${source}\n` });
  },
});

// The Mock UI (`ui/`, a Lit element) as one browser file, `dist/ui/mock-ui.js`, which the mock server serves at
// `/__mock/ui/mock-ui.js`. Lit is bundled in: the server itself (`src/`) is published as source and needs no build.
export default defineConfig({
  plugins: [licenses()],
  // A library build keeps `process.env.NODE_ENV` as written, and a browser has no `process`: TanStack Table reads
  // it for its development checks
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  build: {
    lib: {
      entry: resolve(__dirname, "ui/mock-ui.js"),
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "mock-ui.js",
        banner:
          "/*! Mock UI of @rapidoc/mock (MIT). Includes Lit, Copyright Google LLC, BSD-3-Clause, and TanStack Table, Copyright Tanner Linsley, MIT: see mock-ui.LICENSE.txt */",
      },
    },
    outDir: resolve(__dirname, "dist/ui"),
    emptyOutDir: true,
  },
});
