# RapiDoc logo

The RapiDoc logo for every RapiDoc product: the component, the portal, the CLI, their docs sites and READMEs. Copy these files; don't redraw or retype the logo.

| File | Size | Use |
| :--- | :--- | :--- |
| `rapidoc-lockup-light.svg` | 642 × 108 | Leaves and `<rapi-doc>` on light backgrounds. The leaves are outlined. |
| `rapidoc-lockup-dark.svg` | 642 × 108 | Leaves and `<rapi-doc>` on dark backgrounds. The leaves are filled. |
| `rapi-flow-lockup-light.svg` | 707 × 108 | Leaves and `<rapi-flow>`, the Arazzo workflow element, on light backgrounds. |
| `rapi-flow-lockup-dark.svg` | 707 × 108 | Leaves and `<rapi-flow>` on dark backgrounds. |
| `rapi-pdf-lockup-light.svg` | 642 × 108 | Leaves and `<rapi-pdf>`, the PDF element, on light backgrounds. |
| `rapi-pdf-lockup-dark.svg` | 642 × 108 | Leaves and `<rapi-pdf>` on dark backgrounds. |
| `rapidoc-leaves.svg` | 64 × 64 | Favicon, app icon, avatar: anywhere the full logo is too small. Works on light and dark. |

Each file is self-contained: no fonts, scripts or external references. The letters are outlines, so nothing has to load.

## Names

How the products are named in documentation, pages, sites, menus and READMEs.

| Product | Name | Tag, package, command |
| :--- | :--- | :--- |
| API reference component | **RapiDoc** | `<rapi-doc>`, `rapidoc` |
| Compact component | **RapiDoc Mini** | `<rapi-doc-mini>` |
| Arazzo workflow component | **RapiFlow** | `<rapi-flow>`, `rapidoc/flow` |
| PDF component | **RapiPdf** | `<rapi-pdf>`, `rapipdf` |
| Mock server | **RapiMock** | `@rapidoc/mock`, `rapidoc mock` |
| Developer portal | **RapiDoc Portal** | `@rapidoc/portal` |
| Command line | **RapiDoc CLI** | `@rapidoc/cli`, `rapidoc` |

- **Pattern**: "Rapi" and one word, each capitalized only at its first letter: RapiFlow, RapiPdf (not RapiPDF), RapiMock (no space). RapiDoc Mini is a smaller RapiDoc, so it keeps RapiDoc's name; the Portal and the CLI are RapiDoc's, so they carry it.
- **Never**: Rapidoc, RAPIDOC, Rapi-Doc, Rapi Mock, Rapi Flow, RapiDoc Mock, rapidoc-mini in prose.
- **Tools and features are not products**: describe them in lowercase ("the MCP server export", "pre-rendering", "the in-browser mock", "lint rules"); "RapiDoc Lint" and "RapiDoc MCP" are not names. "Developer portal" and "mock server" in lowercase are the generic things, never a product's name.
- **Integrations**: "RapiDoc for <host>" (RapiDoc for Hono, RapiDoc for FastAPI).
- **Name, tag, package, command**: the name in prose, headings, menus and page titles; the tag in code font for the element in HTML (`<rapi-flow>`); the package in code font for install and import; the command in code font. Domains and repositories are lowercase (`mock.rapidocui.com`, `rapi-mock-doc`).
- **"RapiDoc" is the component.** For the whole family say "the RapiDoc family" or "RapiDoc's tools".
- **Short forms** ("the mock", "the portal", "Mini") only in that product's own docs, after its full name on the page.
- **Sites**: each site's `site.title` is its product's name. Logo lockups show the tag (`<rapi-doc>`, `<rapi-flow>`); the text around them uses the name.
- **Changelogs** are history: entries written before a rename keep the old name.

### The two kinds of spec

RapiDoc's tools read two kinds of file, and the docs name them so a reader always knows which one is meant:

| The file | Name | Not |
| :--- | :--- | :--- |
| An OpenAPI (or Swagger 2.0) file: an API's operations, schemas, servers | **OpenAPI spec** | "API spec", "OpenAPI file", "OpenAPI document" |
| An Arazzo file: workflows that call the operations of one or more OpenAPI specs | **Arazzo spec** | "Arazzo file", "Arazzo document", "workflow file" |

- **A bare "spec"** is the OpenAPI spec, and only where Arazzo specs don't come up. Wherever they do (all of RapiFlow's docs, workflows in RapiDoc Portal, the MCP export, `rapidoc validate`), say "OpenAPI spec" or "Arazzo spec" every time. Placeholders in code (`<spec>`, a `spec` variable) stay as they are.
- **A workflow** is one workflow inside an Arazzo spec, never the file.
- **The standards** are the OpenAPI Specification and the Arazzo Specification, capitalized.
- Attribute, key and tag names stay as they are (`spec-url`, `arazzo-url`, `workflows:`, `{% workflow file= %}`).

## Using it

- **Light and dark**: use the file for the background it sits on. In a RapiDoc portal:

  ```yaml
  site:
    logo:
      src: { light: /rapidoc-lockup-light.svg, dark: /rapidoc-lockup-dark.svg }
    favicon: /rapidoc-leaves.svg
  ```

  In a GitHub README:

  ```html
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="brand/rapidoc-lockup-dark.svg" />
    <img src="brand/rapidoc-lockup-light.svg" alt="RapiDoc" height="48" />
  </picture>
  ```

- **Size**: set the height and let the width follow. Below about 24px tall, use `rapidoc-leaves.svg` instead of the lockup.
- **Space**: keep clear space around the lockup of at least the height of the `<` bracket.
- **Don't** recolour, stretch, outline, add effects, or set `<rapi-doc>` in another font.

## Colours

| Part | Light | Dark |
| :--- | :--- | :--- |
| `rapi-doc` | `#1a1a1a` | `#f2f2f2` |
| `<` `>` and the orange leaf | `#ff791a` | `#ff791a` |
| Orange leaf stem | `#d9600a` | `#d9600a` |
| Yellow leaf | `#ffc73b`, `#efb025` | `#ffc73b`, `#efb025` |
| Green leaf | `#adc165`, `#99aa52` | `#adc165`, `#99aa52` |
| Leaf outlines (light only) | `#1a1a1a` | none |

`#ff791a` is also RapiDoc's default `primary-color`.

## How it was made

- **Letters**: [Sono](https://github.com/sursly/sono) by Tyler Finck (SIL Open Font License 1.1), Bold (700) with the `MONO` axis at 1, converted to outlines and spaced by hand.
- **Brackets**: drawn, not taken from the font: round-capped strokes opening at 105°, 23% taller than Sono's own bracket, centred on the lowercase letters.
- **`<rapi-flow>` lockups**: the `<rapi-doc>` lockups with `doc` replaced by `flow`, set in the same Sono Bold at the same size (100px, 0.05 per font unit) and baseline (y 79.5), spaced like `doc` (about 57px apart), and the closing bracket moved to keep its gap; `rapi-` and the leaves are unchanged.
- **`<rapi-pdf>` lockups**: the `<rapi-doc>` lockups with `doc` replaced by `pdf`, made from letters already in the lockups (the `p` of `rapi`, the `d` of `doc`, the `f` of `flow`), each centred where `doc`'s letters sit, so the width and the brackets are `<rapi-doc>`'s.
- **Leaves**: the original RapiDoc mark (`packages/rapidoc/src/templates/logo-template.js`, outlined version in `docs/public/assets/images/logo-outline.svg`), with the orange leaf recoloured to `#ff791a`.

The SVGs open in Figma, Illustrator or Inkscape for later changes. The `<rapi-doc>` component's built-in logo (`logo-template.js`) still uses the earlier leaf orange (`#ff903e`).
