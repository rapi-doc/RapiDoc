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

### 2. Development Server
Start the local documentation and examples server:
```bash
# Start dev server
npm run dev

# Stop background dev server
npm run stop
```
- Open `http://localhost:4321` in your browser.
- **Instant HMR:** During development, the server maps directly to `packages/rapidoc/src/index.js`. Any edit you make to RapiDoc's component source reloads immediately in your browser without requiring a rebuild!

### 3. Building

| Command | Description |
|---|---|
| `npm run dev` | Starts the Astro development server. |
| `npm run stop` | Stops the running Astro development server. |
| `npm run build` | Builds both the `rapidoc` web component library and the `docs` site. |
| `npm run build:rapidoc` | Builds only the RapiDoc web component (`packages/rapidoc/dist/rapidoc-min.js`). |
| `npm run build:docs` | Builds only the Astro documentation site (`docs/generated-docs/`). |
| `npm run build:size` | Builds RapiDoc with a visual bundle analyzer report (`dist/stats.html`). |
| `npm run preview` | Previews the built production documentation site locally. |

### 4. Code Quality & Linting

```bash
# Run ESLint on packages/rapidoc
npm run lint

# Run Lit Analyzer for Web Component template validation
npm run analyze

# Check code formatting with Prettier
npm run format

# Automatically fix code formatting
npm run format-fix
```

### 5. Publishing to npm

To publish a new version of the core `rapidoc` package to npm:

1. **Bump Version:** Update `"version"` in `packages/rapidoc/package.json` (e.g. `9.3.9`).
2. **Build Library Bundle:**
   ```bash
   npm run build:rapidoc
   ```
3. **Publish to npm Registry:**
   ```bash
   npm run publish:rapidoc
   ```
   *(Or navigate into `cd packages/rapidoc && npm publish`)*.

---

## Documentation Site & GitHub Pages Deployment

The documentation site is built with modern **Astro** using clean, extensionless URLs (`/api`, `/examples`, `/list`, `/quickstart`).

### Deployment via GitHub Actions
When code is pushed to `master` or `main`, the [deploy-docs.yml](file:///Users/mrin/work/astro-rapidoc/.github/workflows/deploy-docs.yml) GitHub Action automatically:
1. Compiles the `rapidoc` library bundle.
2. Builds the documentation site (`npm run build:docs`).
3. Deploys the static output (`docs/generated-docs/`) directly to **GitHub Pages**.

> **Note on GitHub Pages Configuration:**
> In repository settings under **Settings → Pages**, set **Source** to **GitHub Actions**. This keeps the repository clean by eliminating the need to commit compiled static HTML files into git branches.

---

## Specs Organization

OpenAPI specs are organized inside `docs/public/` based on their visibility and purpose:

* **`docs/public/specs/`**: Public showcase specs referenced in [example-list.yaml](file:///Users/mrin/work/astro-rapidoc/docs/src/data/example-list.yaml) and displayed on `rapidocui.com` (e.g., `petstore.yaml`, `code-highlight.yaml`, `auth.yaml`).
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
