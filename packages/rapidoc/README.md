<p align="center">
  <img alt="RapiDoc logo" src="https://github.com/rapi-doc/RapiDoc/blob/master/logo.png" width="80px" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square"/>

</p>        

# RapiDoc

**Custom Element for OpenAPI / Swagger Spec Viewing**

RapiDoc is a fast, responsive, and customizable Web Component that renders beautiful, interactive API documentation from OpenAPI (Swagger) specifications.

---

## Features

- **OpenAPI Support:** Full support for OpenAPI 3.0.x, 3.1.x, and Swagger 2.0.
- **Framework Agnostic:** Works with plain HTML, React, Vue, Angular, Svelte, or Lit.
- **Built-in API Console:** Call and test APIs directly from the documentation.
- **Usability First:**
  - Models and examples expanded by default — no endless clicking to reveal schemas.
  - Pre-populated sample data in request fields.
  - Side-by-side request and response view for quick comparison.
- **Branding & Theming:**
  - Dark and Light themes out of the box.
  - Easily customizable brand colors, typography, logos, and header styling.
- **Customizable Layouts:**
  - Three distinct rendering styles: `read`, `view`, and `focused`.
  - Inject custom content using web component slots (`fixed-header`, `overview`, `servers`, `auth`).
- **Fast & Lightweight:** Built using [Lit](https://lit.dev/) with zero unnecessary overhead.

---

## Quick Usage

Include the script in your HTML page and use the `<rapi-doc>` custom element:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script type="module" src="https://unpkg.com/rapidoc/dist/rapidoc-min.js"></script>
</head>
<body>
  <rapi-doc
    spec-url="https://petstore3.swagger.io/api/v3/openapi.json"
    color-scheme="dark"
    render-style="read"
  ></rapi-doc>
</body>
</html>
```

---

## Repository Architecture

This repository is a monorepo built on **npm workspaces** (`packages/*`); the sites in `sites/` are built from it:

```text
rapidoc/
├── packages/
│   ├── rapidoc/                 # Core web component library (npm "rapidoc"): <rapi-doc>, <rapi-doc-mini>
│   │   ├── src/                 # Lit 3 source; each folder has a README.md contract
│   │   ├── dist/                # rapidoc-min.js and rapidoc-flow-min.js ("rapidoc/flow"), both for browsers
│   │   ├── vite.config.mjs      # Browser bundle build
│   │   └── vite.config.flow.mjs # <rapi-flow> bundle build
│   │
│   ├── rapidoc-prerender/       # @rapidoc/prerender: build-time renderer (pre-rendered <rapi-doc>, sidebar HTML) for Node
│   ├── rapidoc-mcp/             # @rapidoc/mcp: MCP manifest builder, runtime and project writer for Node
│   │
│   ├── rapidoc-cli/             # @rapidoc/cli, the `rapidoc` command: init, dev, build, serve, mock, validate, migrate
│   ├── rapidoc-portal/          # @rapidoc/portal: docs-as-code developer portal for OpenAPI and Markdoc (Astro)
│   ├── rapidoc-server/          # @rapidoc/server: serves a built portal with OpenID Connect sign-in and access rules
│   ├── rapidoc-mock/            # @rapidoc/mock: mock server for a portal's APIs, with OAuth scope checks
│   └── create-rapidoc/          # create-rapidoc: scaffolds a new portal (npm create rapidoc)
│
├── sites/                       # The RapiDoc sites, built with RapiDoc Portal
│   ├── rapidoc/                 # rapidocui.com: docs, feature pages, examples, tests
│   │   └── public/
│   │       ├── specs/           # Public showcase specs (used by /examples)
│   │       └── specs-test/      # Internal edge-case specs
│   │           └── parser/      # Malformed and invalid specs for validation tests
│   ├── rapi-flow/               # flow.rapidocui.com
│   ├── rapi-mock/               # mock.rapidocui.com
│   ├── rapi-portal/             # portal.rapidocui.com
│   └── shared/                  # Header, footer, themes and the element reference all four use
│
├── tests/                       # See tests/README.md
│   ├── unit/                    # Node test runner: parser, schema, templates, static renderer
│   ├── component/               # Lit component tests
│   ├── e2e/                     # Functional tests in a headless browser (playwright-core)
│   ├── perf/                    # Spec parsing and rendering benchmarks
│   ├── fixtures/                # Shared specs and the HTML test harness
│   └── helpers/                 # Test server and browser helpers
│
├── scripts/                     # Build info capture, demo prerender, test loader
├── docker/                      # Dockerfile and Nginx config for hosting RapiDoc
├── brand/                       # Logo SVGs and usage notes
├── package.json                 # Monorepo root: npm workspaces (packages/*) and scripts
├── AGENTS.md                    # Guidance for contributors and coding agents
└── README.md
```

---

## Development & Build Instructions

### Prerequisites

- **Node.js**: `>= 22.12.0` (or [Bun](https://bun.sh/))
- **npm** (or `bun`)

### 1. Installation

Clone the repository and install dependencies across all workspaces:

```bash
git clone https://github.com/rapi-doc/RapiDoc.git
cd RapiDoc
npm install
```

### 2. Development Server

Start rapidocui.com locally, with its documentation and interactive examples:

```bash
npm run dev:rapidoc-site
```

- Open `http://localhost:4329` in your browser. `npm run dev` starts all four sites side by side instead.
- The pages load the built bundle (`/assets/rapidoc-min.js`): after changing `packages/rapidoc/src/`, run `npm run build:rapidoc` (or `npm run build:rapidoc:dev` for unminified code with `console.*` logging and source maps) and reload.

---

### 3. Build Process

#### Core Library Production Build (`npm run build:rapidoc`)

- **Workspace:** `packages/rapidoc`
- **Output:** `packages/rapidoc/dist/rapidoc-min.js`
- Compiles the RapiDoc custom element in library mode using [Vite](https://vitejs.dev/).
- Inlines and bundles runtime dependencies (`lit`, `@scalar/openapi-parser`, `marked`, `microlighter`, `github-slugger`) into a standalone bundle with **zero runtime external dependencies**.
- Minifies Lit templates using `@lit-labs/rollup-plugin-minify-html-literals`.
- Strips `console.*` and `debugger` calls via a custom esbuild transform for optimal performance and clean production distribution.
- Injects the license and version header banner.

#### Core Library Development Build (`npm run build:rapidoc:dev`)

- **Workspace:** `packages/rapidoc`
- **Output:** `packages/rapidoc/dist/rapidoc-min.js` + `packages/rapidoc/dist/rapidoc-min.js.map`
- Compiles the standalone library bundle with `mode: 'development'`.
- Disables template and esbuild minification, preserves all `console` and `debugger` statements, and emits full external source maps.
- Useful when you need to test the bundled `<rapi-doc>` script tag artifact in external standalone HTML pages or apps with full DevTools logging.

#### Site Build (`npm run build`)

- **Scope:** Root monorepo
- Same as `npm run build:rapidoc-site`: builds the packages rapidocui.com loads (`rapidoc`, `@rapidoc/mcp`, `@rapidoc/prerender`, `rapipdf`), then the site to `sites/rapidoc/dist/`. The portal copies `rapidoc-min.js` into the site as `/assets/rapidoc-min.js`.

---

### 4. NPM Command Reference

All primary commands can be run from the root of the repository:

#### Development

| Command                    | Workspace       | Description                                                                 |
| -------------------------- | --------------- | --------------------------------------------------------------------------- |
| `npm run dev`              | `sites/*`       | Runs the four sites' dev servers side by side (rapidocui.com on port 4329). |
| `npm run dev:rapidoc-site` | `sites/rapidoc` | Runs rapidocui.com alone on `http://localhost:4329`.                        |

#### Building

| Command                     | Workspace       | Description                                                                                           |
| --------------------------- | --------------- | ----------------------------------------------------------------------------------------------------- |
| `npm run build`             | `sites/rapidoc` | Builds the packages rapidocui.com loads, then the site to `sites/rapidoc/dist/`.                      |
| `npm run build:rapidoc`     | `rapidoc`       | Compiles production, minified Web Component bundle to `packages/rapidoc/dist/rapidoc-min.js`.         |
| `npm run build:rapidoc:dev` | `rapidoc`       | Compiles unminified Web Component bundle with source maps & console logs to `packages/rapidoc/dist/`. |
| `npm run build:size`        | `rapidoc`       | Builds RapiDoc with `ANALYZE=true` and opens an interactive bundle visualizer (`dist/stats.html`).    |

#### Testing & Benchmarks

| Command               | Workspace | Description                                                                                              |
| --------------------- | --------- | -------------------------------------------------------------------------------------------------------- |
| `npm run test:unit`   | Monorepo  | Runs Node.js native unit tests (`tests/unit/*.test.js`) for schema parsers and AST converters.           |
| `npm run test:parser` | Monorepo  | Runs spec parsing, circular ref, and dereferencing benchmarks (`tests/perf/benchmark.js`).               |
| `npm run test:perf`   | Monorepo  | Measures headless browser rendering performance across render styles (`tests/perf/render-benchmark.js`). |

#### Code Quality & Formatting

| Command              | Workspace | Description                                                                      |
| -------------------- | --------- | -------------------------------------------------------------------------------- |
| `npm run lint`       | Monorepo  | Runs oxlint (default rules, no config) across packages, tests and scripts.       |
| `npm run format`     | Monorepo  | Checks formatting with oxfmt (default style) across packages, tests and scripts. |
| `npm run format-fix` | Monorepo  | Formats the same files with oxfmt.                                               |

Releases go through Changesets and the release workflow (`AGENTS.md` §6), never `npm publish` by hand.

---

## rapidocui.com & GitHub Pages Deployment

When code that rapidocui.com is built from is pushed to `master`, the [deploy-docs.yml](../../.github/workflows/deploy-docs.yml) GitHub Action builds the site (`npm run build:rapidoc-site`) and deploys `sites/rapidoc/dist/` to **GitHub Pages**. The RapiFlow, RapiMock and RapiDoc Portal sites are published by their own workflows.

---

## Specs Organization

OpenAPI specs are organized inside `sites/rapidoc/public/` based on their visibility and purpose:

- **`specs/`**: Public showcase specs referenced in `sites/rapidoc/page-data/example-list.yaml` and displayed on `rapidocui.com` (e.g., `petstore.yaml`, `code-highlight.yaml`, `auth.yaml`).
- **`specs-test/`**: Internal edge-case and boundary specs used for UI verification and regression tests (e.g., `circular-refs.yaml`, `xxx-of-combinations.yaml`).
- **`specs-test/parser/`**: Malformed or invalid specs used to test CLI validation and error reporting (e.g., `invalid-syntax.yaml`, `missing-info.yaml`, `broken-ref.yaml`).

---

## Roadmap

- [x] Modernize project dependencies (Vite + Astro + Node 22+)
- [x] Restructure as a multi-package Monorepo
- [ ] Build `rapidoc-cli` for OpenAPI linting and local zero-config previews
- [x] Build `rapidoc-portal`, a docs-as-code developer portal, with sign-in (`rapidoc-server`) and mocking (`rapidoc-mock`)
- [ ] Automated visual regression testing suite with Playwright
- [ ] Web Content Accessibility Guidelines (WCAG 2.1) compliance enhancements

---

## Architecture Contract

What this package exposes, what must stay true, and what touches the outside world. Each folder
under `src/` has its own `README.md` contract with the detail; this section covers the package as
a whole.

### Overview

`packages/rapidoc` is a Lit 3 web component library built by Vite into two ES module bundles. It
has no runtime dependencies: its libraries are `devDependencies` bundled into those files. Each
build writes `dist/<bundle>.LICENSE.txt`, the list of bundled packages with their versions and
license notices, and the bundle's banner names it:

- `dist/rapidoc-min.js` (`vite.config.mjs`, entry `src/index.js`): registers `<rapi-doc>`,
  `<rapi-doc-mini>` and `<oauth-receiver>` on import. Production builds are minified, carry the
  license banner, and have `console.*` and `debugger` removed.
- `dist/rapidoc-flow-min.js` (`vite.config.flow.mjs`, entry `src/flow.js`), exported as
  `rapidoc/flow`: registers `<rapi-flow>`, the Arazzo workflow diagram, with the workflow runtime
  that runs them in the browser. It bundles its own copy of Lit and `yaml`, so pages that do not
  load it pay nothing; `rapidoc-min.js` carries no Arazzo runtime.

Two Node packages are built from this source: `@rapidoc/prerender` (`packages/rapidoc-prerender`), the
build-time renderer that renders these templates and components to HTML, and `@rapidoc/mcp`
(`packages/rapidoc-mcp`), the MCP code in `src/utils/` (`mcp-generator.js`, `mcp/`, `arazzo/`).
Nothing in `src/` imports either package.

```text
spec-url / inline spec ──▶ utils/spec-parser.js ProcessSpec (load, upgrade, dereference, group)
        │                    └─ dispatches before-render on the host
        ▼ resolvedSpec
<rapi-doc> (src/rapidoc.ts) ──▶ templates/ ──▶ components/ (<api-request>, <api-response>, schema views)
        ├── events: spec-loaded, nav-active-change   (components: before-try, after-try, request-aborted)
        └── utils/mock-interceptor.js patches fetch / XMLHttpRequest while mock-server="true"

@rapidoc/prerender ──▶ the same templates and components, serialized by its serializer.js
                    renderTemplateToString (no DOM)
```

### Folder Contracts

- [`src/`](./src/README.md): the three custom elements and the bundle entry.
- [`src/components/`](./src/components/README.md): nested elements for request, response and
  schema panels.
- [`src/templates/`](./src/templates/README.md): Lit `html` functions bound to the host.
- [`src/utils/`](./src/utils/README.md): spec pipeline, stable anchors, schema, request and mock
  helpers; [`utils/mcp/`](./src/utils/mcp/README.md) for the MCP manifest, runtime and exported
  project;
  [`utils/arazzo/`](./src/utils/arazzo/README.md) for Arazzo workflow diagrams.
- [`src/styles/`](./src/styles/README.md): stylesheets and the theme-token contract.
- [`../rapidoc-prerender/src/`](../rapidoc-prerender/src/README.md): the `@rapidoc/prerender` renderer, a
  separate package that renders this folder's templates.

### Global Invariants

- **No runtime dependencies for browser users**: everything is bundled into
  `dist/rapidoc-min.js`.
- **One spec shape**: `ProcessSpec` never rejects. It resolves to the parsed spec
  (`info`, `tags`, `tagGroups`, `components`, `securitySchemes`, `servers`, ...) or to a result
  with `specLoadError: true`, and templates, components and the static renderer all read it as
  `this.resolvedSpec`.
- **Stable anchors**: operation ids come from `utils/slugger.js` `OperationSlugger`; the static
  sidebar and `@rapidoc/portal` depend on them and on `nav-active-change`, so changing the rules is
  a breaking change (see `src/utils/README.md`).
- **Boolean-like attributes are strings** (`allow-try="false"`) and are compared as strings.
- **Semantic headings and parts**, **theme tokens** and **DSD hydration** follow
  `packages/rapidoc/AGENTS.md` §5 and are checked by `tests/unit/semantic-markup.test.js` and
  `tests/unit/css-variables.test.js`.
- **Markdown** passes through `utils/sanitize.js` before `unsafeHTML`. In Node there is no
  `DOMParser`, so the static renderer's markdown is not sanitized.

### Global Side Effects

- **Network**: spec and external `$ref` fetches, Try requests from `<api-request>`, OAuth token
  requests and the sign-in popup.
- **Global patching**: the mock server replaces `window.fetch` and three `XMLHttpRequest`
  prototype methods and restores them on disable; importing `@rapidoc/prerender` installs or wraps
  `customElements.define`; importing the elements configures the global `marked` instance.
- **Storage and messaging**: `localStorage["rapidoc"]` with `persist-auth="true"`; OAuth replies
  via `window.opener.postMessage` and a `BroadcastChannel`.
- **URL and history**: `<rapi-doc>` replaces the location hash when `update-route="true"`;
  `bindNavBar` pushes or replaces history for portal sidebars.

### Verification

From the monorepo root: `npm run test:unit`, then `npm run lint` and `npm run format-fix`. After
any change under `src/`, run `npm run build:rapidoc`; never restore `dist/rapidoc-min.js` from git.

---

## License

MIT © [Mrinmoy Majumdar](https://github.com/mrin9)

---

Part of the [RapiDoc family](https://rapidocui.com) of open-source tools for OpenAPI and Arazzo: [RapiDoc](https://rapidocui.com/rapidoc/) (`<rapi-doc>`), [RapiFlow](https://flow.rapidocui.com/), [RapiDoc Portal](https://portal.rapidocui.com/), [RapiMock](https://mock.rapidocui.com/), [RapiPdf](https://rapidocui.com/rapipdf/), the [RapiDoc CLI](https://rapidocui.com/cli/) and [integrations](https://rapidocui.com/integrations/) for Express, Fastify, Hono, FastAPI, ASP.NET Core, Go, Starlight, VitePress and Docusaurus.
