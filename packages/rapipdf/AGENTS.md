# AGENTS.md — `packages/rapipdf` (`rapipdf`)

## 1. Package Scope & Identity

`packages/rapipdf` publishes RapiPdf, which turns an OpenAPI or Swagger 2.0 spec into a PDF: the `<rapi-pdf>` web component in the browser, and `rapipdf/node` in Node (behind `rapidoc pdf`). It was moved here from `github.com/mrin9/RapiPdf` at 2.2.1 and rebuilt on Vite, `@scalar/openapi-parser`, pdfmake 0.3 and RapiDoc's schema utilities.

- **Package Name**: `rapipdf`, on its own semver
- **Module Type**: ESM (`"type": "module"`)
- **Entry Points and builds** (`npm run build` runs the three Vite configs):
  - `src/index.js` → `dist/rapipdf-min.js` (`vite.config.mjs`): the element as one self-contained classic script. `<script src>` works with or without `type="module"`, as in 2.x; it is `main`, `unpkg` and `jsdelivr`.
  - `src/index.js` → `dist/rapipdf.js` + `dist/chunks/` (`vite.config.es.mjs`): the element as an ES module (`import "rapipdf"`). The element is a few kilobytes; the generator is a chunk fetched the first time a PDF is asked for.
  - `src/node.js` → `dist/node.js` (`vite.config.node.mjs`): `rapipdf/node`.
  - Types: `src/rapipdf.d.ts` (the element), `src/node.d.ts`.
- **Dependencies**: `pdfmake` (0.3), used at runtime by `rapipdf/node` only and left external there. `@scalar/openapi-parser`, `yaml` and `marked` are `devDependencies`, bundled by Vite into every build; the browser builds also carry pdfmake's browser build.

## 2. Source Layout

Three layers: loading a spec, turning it into a pdfmake document definition (the core), and rendering that definition.

| File                                                | Role                                                                                                                                                                       |
| :-------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/core/index.js`                                 | The headless core's entry: `buildDocDefinition(spec, options)`, `buildSpecModel`, `markdownToPdfmake`, `DEFAULT_OPTIONS`, `DEFAULT_LOCALIZE`                               |
| `src/core/doc-definition.js`                        | `buildDocDefinition`: options and defaults, styles, the sections in order, the footer                                                                                      |
| `src/core/spec-model.js`                            | `buildSpecModel`: operations grouped by tag, with path-level parameters merged in                                                                                          |
| `src/core/sections.js`                              | The sections: info, security, operations (parameters, request body, responses, examples), API list                                                                         |
| `src/core/schema-tree.js`                           | Schemas as an object tree or a table, drawn from RapiDoc's `schemaToAST`; parameter type labels                                                                            |
| `src/core/markdown.js`                              | Markdown to pdfmake nodes, from marked's tokens (no HTML, no DOM)                                                                                                          |
| `src/core/localize.js`, `src/core/table-layouts.js` | Default labels; pdfmake table layouts                                                                                                                                      |
| `src/load-spec.js`                                  | `loadSpec(input, { plugins })`: load, convert Swagger 2.0, dereference, break cycles, merge `allOf`. Environment-neutral: the caller passes the plugins that fetch or read |
| `src/load-browser.js`                               | `loadSpecInBrowser(spec)`: `loadSpec` with the browser fetch plugin                                                                                                        |
| `src/render-browser.js`                             | pdfmake's browser build and the fonts: `createPdf(def)`, `openPdf(def)`                                                                                                    |
| `src/node.js`                                       | `rapipdf/node`: `loadSpecFile` (files and URLs), `renderPdf` (pdfmake's Node build, fonts from its virtual file system), `generatePdf(spec, options)`                      |
| `src/generate.js`                                   | What the element imports on first use: loader, core and pdfmake together (`createPdfDocument`). The split point of the ES build                                            |
| `src/rapipdf.js`                                    | The `<rapi-pdf>` element (plain `HTMLElement`, no Lit): attributes to options, `generatePdf()`                                                                             |
| `src/vfs_fonts.js`                                  | Roboto and Roboto Mono, base64 (about 0.8 MB; generated, not edited by hand)                                                                                               |

## 3. Boundaries

- **Self-contained browser builds.** `dist/rapipdf-min.js` needs nothing else, and `dist/rapipdf.js` only its own chunks. A library the browser needs is a `devDependency` that Vite bundles, and the `.LICENSE.txt` beside each file (written by every build) lists it.
- **`src/rapipdf.js` stays light.** It imports only `core/localize.js` statically; everything heavy goes through `import("./generate.js")`. A static import of the core, the loader or pdfmake there puts two megabytes back into the ES entry (`tests/element.test.js` checks the generator is fetched only on use).
- **The element's contract**: `generatePdf(spec?)` opens the PDF in a new tab, or downloads it (`output="download"`, or when the browser blocks the tab); the tab is opened before anything is awaited, while the user's click still allows it. `getPdfBlob(spec?)` returns the PDF and touches nothing else. Both reject on failure. Each run sets the `generating` attribute, disables the button, and ends with a `pdf-generated` (`detail.output`) or `pdf-error` (`detail.error`) event that bubbles out of the element. A spec passed to a method wins over `spec-url`.
- **One runtime dependency, `pdfmake`, for `rapipdf/node`.** pdfmake's Node build reads data files from its own folder, so `vite.config.node.mjs` leaves it external and bundles everything else. Don't add another without the same kind of reason.
- **Node renders with both access policies closed.** `renderPdf` lets pdfmake read only the font files the caller named, and download nothing: the document comes from a spec someone else may have written.
- **The element and Node must make the same PDF.** Both call `loadSpec` and `buildDocDefinition` and embed the same fonts (`src/vfs_fonts.js`); only the fetching and the pdfmake build differ. A new option goes into `DEFAULT_OPTIONS` (core), then gets an attribute in `src/rapipdf.js`, a field in `src/node.d.ts` and a flag in `packages/rapidoc-cli/src/commands/pdf.js`.
- **The core is headless.** Nothing under `src/core/` touches the DOM, the network, files or pdfmake; it takes a resolved spec and returns plain data (plus the footer and table-layout functions). That is what lets Node build the same PDF, and what `tests/baseline.test.js` and `tests/core.test.js` run without a browser. Keep `window`, `document`, `fetch` and `pdfmake` in the load and render files.
- **Markdown never becomes HTML.** `markdown.js` maps marked's tokens to pdfmake nodes; raw HTML in a description is reduced to its text, and images to their alt text.
- **No empty text for spacing.** pdfmake 0.3 gives an empty text node the height of a line. The few empty nodes that must exist (a table's first row for `colSpan`, a page break) carry `lineHeight: 0`, and `buildDocDefinition` removes `""` placeholders from every list of blocks.
- **Imports from outside the package**, bundled by relative path from `packages/rapidoc/src/utils/`: `spec-loader.js` (the fetch plugin for `load()` and `breakCircularRefs`, in `src/load-spec.js` and `src/load-browser.js`) and `schema-utils.js` (`schemaToAST`, `getTypeInfo`, `typeLabel`, `flattenAllOf`, in `src/core/schema-tree.js`). So `<rapi-pdf>` and `<rapi-doc>` load specs and read schemas the same way. Both files are headless (`tests/unit/headless-boundary.test.js`); a change to either needs `rapipdf` in its changeset, and can change the baseline. Nothing imports this package.
- **Schemas are read through RapiDoc's AST.** `schema-tree.js` never interprets a schema itself: `schemaToAST` decides what is an object, an array, a value or a choice (anyOf/oneOf, an OpenAPI 3.1 type list), merges `allOf`, marks a schema inside itself (`{recursive: Name}`) and cuts off very deep or very large schemas (`{…}`). The file only turns those nodes into the two PDF layouts. Code that reads `properties` directly (form-data fields) goes through `flattenAllOf` first.
- **Text from RapiDoc's utilities is cleaned for the PDF fonts.** They join alternatives with `┃` and mark arrays with `⮕`, and object descriptions carry HTML; Roboto has no glyph for those characters. `schema-tree.js` rewrites them (`asTypes`, `asList`, `plainText`). A new symbol in that output needs the same treatment.
- **A Swagger 2.0 spec split over files**: the converted entry document replaces the entry file in the loaded filesystem before dereferencing. Dereferencing the converted document alone loses the other files.
- **The PDF's content is fixed by `tests/fixtures/baseline/`**: the serialized document definition for each spec in `tests/fixtures/specs/` under four option sets. It started as the output of the published 2.2.1 bundle. A change that alters the PDF on purpose regenerates the affected files in the same change and says so: `RAPIPDF_BASELINE_DIR=packages/rapipdf/tests/fixtures/baseline node --test packages/rapipdf/tests/baseline.test.js` (or another folder, to diff first).

## 4. Commands and Tests

| Command                        | Purpose                                                                                                                |
| :----------------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| `npm run build:rapipdf` (root) | Builds `dist/rapipdf-min.js`, `dist/rapipdf.js` (+ `dist/chunks/`) and `dist/node.js`, and updates the docs build info |
| `npm run test:rapipdf` (root)  | Builds, then runs `tests/*.test.js`: the core in Node, the element in headless Chrome (`CHROME_PATH` picks the binary) |
| `npm run dev` (here)           | Vite dev server with `index.html`, a page of `<rapi-pdf>` elements over the fixture specs                              |

- `tests/baseline.test.js` (Node, from source): every fixture spec under every option set against the baseline.
- `tests/core.test.js` (Node, from source): `loadSpec`, `buildSpecModel`, `buildDocDefinition` and `markdownToPdfmake` on small inline specs.
- `tests/element.test.js` (headless Chrome, built files, once per browser build): a real PDF in a new tab, download and its file name, the blocked-tab fallback, `getPdfBlob`, events and the busy state, listeners, a spec that can't be loaded, and that the ES build fetches the generator only on use.
- `tests/node.test.js` (Node, from source): `rapipdf/node` on files, spec text, a split Swagger 2.0 spec, a custom font, and the closed access policies.
