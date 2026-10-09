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
    spec-url="https://petstore.swagger.io/v2/swagger.json"
    theme="dark"
    render-style="read"
  ></rapi-doc>
</body>
</html>
```

---

## Repository Architecture

This repository is structured as a **Monorepo** using workspaces, compatible with **Node/npm**, **pnpm**, and **Bun**:

```text
astro-rapidoc/
├── packages/
│   ├── rapidoc/                 # Core Web Component library (published as "rapidoc")
│   │   ├── src/                 # Web component source code (Lit + modern ESM)
│   │   ├── dist/                # Production bundle (rapidoc-min.js)
│   │   ├── package.json         # Library package config
│   │   └── vite.config.mjs      # Dedicated library build config
│   │
│   ├── rapidoc-cli/             # Command-line utility (lint, preview, bundle)
│   │   ├── src/                 # CLI source code
│   │   └── package.json
│   │
│   └── rapidoc-portal/          # PocketBase developer portal to host & secure specs
│       └── package.json
│
├── docs/                        # Astro documentation & showcase site (GitHub Pages)
│   ├── src/                     # Astro pages, components, and layouts
│   │   ├── pages/examples/      # Public showcase pages (code-highlight, petstore, etc.)
│   │   └── pages/tests/         # Internal test & edge-case pages
│   ├── public/
│   │   ├── specs/               # PUBLIC showcase specs (used by /examples)
│   │   └── specs-test/          # INTERNAL test specs (edge cases & parser fixtures)
│   │       └── parser/          # Malformed & validation test specs
│   ├── astro.config.mjs         # Astro site configuration
│   └── package.json             # Workspace package "docs"
│
├── tests/
│   └── visual/                  # Automated visual regression test suite (Playwright)
│
├── package.json                 # Monorepo root configuration (workspaces)
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

### 2. Development Server & Live Debugging
Start the local documentation and interactive examples showcase:
```bash
# Start dev server (http://localhost:4321)
npm run dev

# Stop background dev server
npm run stop
```
- Open `http://localhost:4321` in your browser.
- **Live Unminified ES Modules:** In development mode (`npm run dev`), the Astro dev server bypasses pre-compiled production bundles and serves live ES modules directly from `packages/rapidoc/src/index.js`.
- **Full DevTools & Console Visibility:** All `console.log`, `console.warn`, `console.error`, and `debugger` breakpoints remain completely intact with original file names and exact line numbers (e.g., `rapidoc.js:516`).
- **Instant Browser Reloading:** Component changes in `packages/rapidoc/src/` trigger immediate hot reloads without waiting for a full Rollup/Vite compilation cycle.

---

### 3. Build Process & Workspace Integration

This monorepo contains multiple packages: the core Web Component library (**`packages/rapidoc`**) and the documentation showcase site (**`docs`**). The build system coordinates them as follows:

#### Core Library Production Build (`npm run build:rapidoc`)
- **Workspace:** `packages/rapidoc`
- **Output:** `packages/rapidoc/dist/rapidoc-min.js`
- Compiles the RapiDoc custom element in library mode using [Vite 6](https://vitejs.dev/).
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

#### Full Monorepo Build (`npm run build`)
- **Scope:** Root monorepo
- Sequentially executes `npm run build:rapidoc` followed by `npm run build:docs`.

---

### 4. How Astro Docs Consumes RapiDoc (`rapidoc-min.js`)

Astro documentation and example pages include the component via `<script type="module" src="/rapidoc/rapidoc-min.js"></script>`. How this URL is resolved depends on whether you are developing locally or generating a production build:

1. **During Local Development (`npm run dev`):**
   - The Astro dev server middleware (in `docs/astro.config.mjs`) **intercepts** all requests for `/rapidoc/rapidoc-min.js` (and `/rapidoc/rapidoc.js`).
   - Instead of reading any pre-built static file, it directly imports and serves `packages/rapidoc/src/index.js` live through Vite's module pipeline.
   - You get instant HMR, unminified source code, active `console.*` logging, and sourcemaps with exact line numbers in browser DevTools. Neither `dist/` nor `generated-docs/` is served during development.

2. **During Production Site Build (`npm run build:docs` / `npm run build`):**
   - The custom `build-rapidoc` Vite plugin in `docs/astro.config.mjs` runs during build initialization:
     1. It verifies that `packages/rapidoc/dist/rapidoc-min.js` is compiled (triggering a Vite library build if missing).
     2. It copies `packages/rapidoc/dist/rapidoc-min.js` into **`docs/dist/rapidoc/rapidoc-min.js`**, so that the static site deployed to GitHub Pages serves the production bundle.
     3. If the local **`docs/generated-docs/`** directory exists, it also synchronizes `rapidoc-min.js` into **`docs/generated-docs/rapidoc/rapidoc-min.js`** to keep the static snapshot folder up to date with the newly built component.

---

### 5. NPM Command Reference

All primary commands can be run from the root of the repository:

#### Development & Live Preview
| Command | Workspace | Description |
|---|---|---|
| `npm run dev` | `docs` | Launches Astro documentation & showcase dev server (`http://localhost:4321`) with live unminified RapiDoc ESM directly from source. |
| `npm run stop` | `docs` | Terminates background Astro dev server processes. |
| `npm run preview` | `docs` | Previews the production build of the documentation site (`docs/dist`) locally. |

#### Building
| Command | Workspace | Description |
|---|---|---|
| `npm run build` | Monorepo | Sequentially builds production RapiDoc library bundle and the Astro documentation site. |
| `npm run build:rapidoc` | `rapidoc` | Compiles production, minified Web Component bundle to `packages/rapidoc/dist/rapidoc-min.js`. |
| `npm run build:rapidoc:dev` | `rapidoc` | Compiles unminified Web Component bundle with source maps & console logs to `packages/rapidoc/dist/`. |
| `npm run build:docs` | `docs` | Builds the production Astro documentation site into `docs/dist/` (and syncs bundle to `generated-docs/`). |
| `npm run build:size` | `rapidoc` | Builds RapiDoc with `ANALYZE=true` and opens an interactive bundle visualizer (`dist/stats.html`). |

#### Testing & Benchmarks
| Command | Workspace | Description |
|---|---|---|
| `npm run test:unit` | Monorepo | Runs Node.js native unit tests (`tests/unit/*.test.js`) for schema parsers and AST converters. |
| `npm run test:perf` | Monorepo | Runs spec parsing, circular ref, and dereferencing benchmarks (`tests/perf/benchmark.js`). |
| `npm run test:render` | Monorepo | Measures headless browser rendering performance across render styles using Puppeteer (`tests/perf/render-benchmark.js`). |

#### Code Quality & Formatting
| Command | Workspace | Description |
|---|---|---|
| `npm run lint` | `rapidoc` | Runs ESLint on `packages/rapidoc/src/**/*.js` with Lit rules. |
| `npm run analyze` | `rapidoc` | Runs Lit Analyzer to validate custom element templates and bindings. |
| `npm run format` | Monorepo | Checks code formatting against `.prettierrc` across packages and docs. |
| `npm run format-fix` | Monorepo | Automatically formats code using Prettier across packages and docs. |

#### Publishing
| Command | Workspace | Description |
|---|---|---|
| `npm run publish:rapidoc` | `rapidoc` | Publishes the `rapidoc` package to the npm registry. |

---

## Documentation Site & GitHub Pages Deployment

The documentation site is built with modern **Astro** using clean, extensionless URLs (`/api`, `/examples`, `/list`, `/quickstart`).

### Deployment via GitHub Actions
When code is pushed to `master` or `main`, the [deploy-docs.yml](file:///Users/mrin/work/astro-rapidoc/.github/workflows/deploy-docs.yml) GitHub Action automatically:
1. Compiles the `rapidoc` library bundle (`packages/rapidoc/dist/rapidoc-min.js`).
2. Builds the Astro documentation site into `docs/dist/` (`npm run build`).
3. Deploys the static output directory (`docs/dist/`) directly to **GitHub Pages** using `@actions/deploy-pages`.

> **Note on GitHub Pages Configuration:**
> In repository settings under **Settings → Pages**, set **Source** to **GitHub Actions**. This keeps the repository clean by eliminating the need to commit compiled static HTML files into git branches.

---

## Specs Organization

OpenAPI specs are organized inside `docs/public/` based on their visibility and purpose:

* **`docs/public/specs/`**: Public showcase specs referenced in [example-list.yaml](file:///Users/mrin/work/astro-rapidoc/docs/src/data/example-list.yaml) and displayed on `rapidocweb.com` (e.g., `petstore.yaml`, `code-highlight.yaml`, `auth.yaml`).
* **`docs/public/specs-test/`**: Internal edge-case and boundary specs used for UI verification and regression tests (e.g., `circular-refs.yaml`, `xxx-of-combinations.yaml`).
* **`docs/public/specs-test/parser/`**: Malformed or invalid specs used to test CLI validation and error reporting (e.g., `invalid-syntax.yaml`, `missing-info.yaml`, `broken-ref.yaml`).

---

## Roadmap

- [x] Modernize project dependencies (Vite + Astro + Node 22+)
- [x] Restructure as a multi-package Monorepo
- [ ] Build `rapidoc-cli` for OpenAPI linting and local zero-config previews
- [ ] Build `rapidoc-portal` with PocketBase for developer API portals
- [ ] Automated visual regression testing suite with Playwright
- [ ] Web Content Accessibility Guidelines (WCAG 2.1) compliance enhancements

---

## License

MIT © [Mrinmoy Majumdar](https://github.com/mrin9)
