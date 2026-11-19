# rapipdf

## 3.0.1

### Patch Changes

- cc15663: Faster rendering of large specs: a schema's nested fields are built and rendered only when they are shown, so with `schema-expand-level` a collapsed field costs nothing until it is opened, and a response status's example and schema render only once that status is selected. The Stripe spec in read mode with `schema-expand-level="1"` now renders in under 5 seconds instead of over 20. Very large schemas are cut below depth 4 as they grow past the node budget, instead of being rebuilt shallower.
- 90d213f: XML examples name array items by the items' `xml.name` (else the property's name) instead of their index (`<0>`), also when the array or its items have an example; unwrapped arrays put the items directly in the parent element.

## 3.0.0

### Major Changes

- f4364a5: RapiPdf 3: rebuilt in the RapiDoc repository on the parser and schema code of `<rapi-doc>`, with a Node entry and new output options.

  - **Node**: `rapipdf/node` exports `generatePdf(spec, options)`, which returns the PDF as a Buffer from a file, a URL, spec text or a spec object. The `rapidoc pdf` command of `@rapidoc/cli` uses it.
  - **Output**: `output="download"` saves the PDF instead of opening it (`file-name` names the file), and `getPdfBlob()` returns it without opening or downloading anything. The tab is opened at the click, before the spec is fetched, so browsers no longer block it; if one does, the PDF is downloaded.
  - **Events and state**: `pdf-generated` and `pdf-error` events, a `generating` attribute while a PDF is being made, and `generatePdf()` returns a promise that rejects when the spec can't be loaded.
  - **Specs**: OpenAPI 3.1 is supported, and a spec split over several files is followed (Swagger 2.0 too). Loading uses `@scalar/openapi-parser` in place of `swagger-client` and `swagger2openapi`.
  - **Schemas**: `anyOf` and `oneOf` are printed as options, with type lists and `nullable` (`string | null`), `additionalProperties`, formats (`int64`, `date-time`), and defaults of `false` and `0`. Very deep schemas are cut off instead of growing without limit.
  - **Fixes**: request bodies shared by several operations were left out; the API list repeated every tag once per path; named examples printed their names instead of their values; an array request body printed nothing in the table style; inline code had no monospace font; `trace` operations were skipped.
  - **Builds**: `dist/rapipdf-min.js` stays one self-contained script for `<script src>`. `import "rapipdf"` now gets an ES module of a few kilobytes that fetches the generator the first time a PDF is asked for, and the package has TypeScript types.

  Breaking:

  - A spec passed to `generatePdf(spec)` is used instead of `spec-url`; before, it was ignored when `spec-url` was set.
  - A file that is not an OpenAPI or Swagger document (no `openapi` or `swagger` field) is rejected.
  - Raw HTML in descriptions is printed as its text, and images as their alt text.
  - Wording follows `<rapi-doc>`: `Min 1 chars` for `min:1 chars`, `READ ONLY` for `READ-ONLY` (now from the labels, so it can be translated), `{recursive: Pet}` for `{recursive}`.
  - The package's `main` is `dist/rapipdf-min.js` (was `src/rapipdf.js`), and `pdfmake` is a dependency, used by `rapipdf/node`.
  - The attributes `pdf-cover-text`, `pdf-security-text` and `pdf-api-text` are gone; they were read but never used.
