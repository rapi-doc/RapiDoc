<img alt="MrinDoc logo" src="https://github.com/mrin9/RapiPdf/blob/master/logo.png" width="60px" />

<p align="center">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square"/>
    <img src="https://img.shields.io/github/size/mrin9/rapipdf/dist/rapipdf-min.js.svg?colorB=blue&label=minified&style=flat-square">
    <img src="https://img.shields.io/github/size/mrin9/rapipdf/dist/rapipdf-min.js.gz.svg?colorB=blue&label=zip&style=flat-square">
</p>

# RapiPdf

Custom element for Open-API to PDF generation

## Features

- Supports Swagger 2.0 and OpenAPI 3.0
- Generate PDF using Web-Component
- Works with any framework or with no framework
- Plenty of customizing options, including selection of brand colors
- Supported on Chrome, FireFox and Safari. (Not yet tested on Edge)

## Documentation

[Check out the usage and examples](https://mrin9.github.io/RapiPdf/)

## Usage

One file, from a CDN or your own server:

```html
<script src="https://unpkg.com/rapipdf/dist/rapipdf-min.js"></script>
<rapi-pdf spec-url="https://petstore.swagger.io/v2/swagger.json"></rapi-pdf>
```

With a bundler, `import "rapipdf"` registers the element. This build is a few kilobytes and fetches the PDF generator the first time a PDF is asked for.

| Attribute                                                                            | What it does                                                     |
| :----------------------------------------------------------------------------------- | :--------------------------------------------------------------- |
| `spec-url`                                                                           | The spec: OpenAPI 3.x or Swagger 2.0, JSON or YAML               |
| `output`                                                                             | `open` (default) shows the PDF in a new tab; `download` saves it |
| `file-name`                                                                          | Name of the downloaded file (default `api-reference.pdf`)        |
| `pdf-title`, `pdf-footer-text`                                                       | Cover title and page footer                                      |
| `pdf-primary-color`, `pdf-alternate-color`                                           | The two colors of the PDF                                        |
| `pdf-schema-style`                                                                   | `object` (default) or `table`                                    |
| `pdf-sort-tags`                                                                      | `false` keeps the tags in the spec's order                       |
| `include-info`, `include-toc`, `include-security`, `include-api-details`             | `false` leaves the section out                                   |
| `include-example`, `include-api-list`                                                | `true` adds examples, and a closing list of operations           |
| `button-label`, `button-bg`, `button-color`, `input-bg`, `input-color`, `hide-input` | The element's own look                                           |

```js
const el = document.querySelector("rapi-pdf");
await el.generatePdf();            // open or download, as `output` says
await el.generatePdf(specObject);  // a spec object or spec text instead of spec-url
const blob = await el.getPdfBlob(); // the PDF itself, nothing opened or downloaded

el.addEventListener("pdf-generated", (e) => console.log(e.detail.output));
el.addEventListener("pdf-error", (e) => console.error(e.detail.error));
```

While a PDF is being made the element has the `generating` attribute and its button is disabled. If the browser blocks the new tab, the PDF is downloaded instead.

## In Node and on the command line

```js
import { writeFile } from "node:fs/promises";
import { generatePdf } from "rapipdf/node";

await writeFile("reference.pdf", await generatePdf("openapi.yaml", { pdfTitle: "Orders API" }));
```

The [`rapidoc`](https://www.npmjs.com/package/@rapidoc/cli) command does the same: `npx rapidoc pdf openapi.yaml`.

## Build Process

RapiPdf is built in the [RapiDoc monorepo](https://github.com/rapi-doc/RapiDoc) (`packages/rapipdf`), from its root:

```bash
npm install

# builds packages/rapipdf/dist: rapipdf-min.js (one file), rapipdf.js (ES module) and node.js
npm run build:rapipdf

# builds, then checks the generated PDFs against the baseline (needs Chrome)
npm run test:rapipdf

# development page on a Vite dev server
npm run dev --workspace=rapipdf
```
