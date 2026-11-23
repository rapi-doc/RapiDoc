# AGENTS.md — RapiDoc Monorepo

Welcome to the RapiDoc monorepo. This document establishes the foundational architecture, system boundaries, build and test workflows, and coding conventions across the repository for autonomous agents and human developers.

---

## 1. Monorepo Architecture & Directory Structure

This repository is managed as an **npm workspaces** monorepo running on **Node.js >= 22.12.0** with native **ECMAScript Modules (ESM)** (`"type": "module"`).

```text
rapidoc/
├── packages/
│   ├── rapidoc/          # Core RapiDoc Web Component library (Lit, Vite)
│   ├── rapidoc-cli/      # The `rapidoc` command (@rapidoc/cli): init, dev, build, serve, preview, mock, validate, lint, bundle, pdf, mcp, migrate, doctor, completion
│   ├── rapidoc-portal/   # Developer portal framework for OpenAPI & Markdoc (@rapidoc/portal)
│   ├── rapidoc-server/   # Serves a built portal with OIDC sign-in and access rules (@rapidoc/server, `rapidoc serve`)
│   ├── rapidoc-mock/     # Mock server for the portal's APIs, with OAuth scope checks (@rapidoc/mock, `rapidoc mock`)
│   ├── rapidoc-prerender/ # Build-time renderer: pre-rendered <rapi-doc>, sidebar HTML, Arazzo SVG (@rapidoc/prerender)
│   ├── rapidoc-embed/    # Integration contract: standard host page for <rapi-doc>, routes, conformance fixtures (@rapidoc/embed)
│   ├── rapidoc-hono/     # RapiDoc for Hono: middleware over @rapidoc/embed (@rapidoc/hono)
│   ├── rapidoc-express/  # RapiDoc for Express (@rapidoc/express)
│   ├── rapidoc-fastify/  # RapiDoc for Fastify (@rapidoc/fastify)
│   ├── rapidoc-vitepress/ # RapiDoc for VitePress: config wrapper, sidebar helper, page component (@rapidoc/vitepress)
│   ├── rapidoc-docusaurus/ # RapiDoc for Docusaurus: plugin, sidebar helper, page component (@rapidoc/docusaurus)
│   ├── rapidoc-starlight/ # RapiDoc for Starlight: API reference pages in the site's layout and sidebar (@rapidoc/starlight)
│   ├── rapipdf/          # RapiPdf: the <rapi-pdf> web component, an OpenAPI spec to a PDF (rapipdf)
│   ├── rapidoc-mcp/      # MCP manifest builder, runtime and project writer for Node (@rapidoc/mcp), built from rapidoc/src
│   └── create-rapidoc/   # Scaffolding CLI for new portals (npm create rapidoc)
├── integrations/         # RapiDoc integrations in other languages, each with its own toolchain; not npm workspaces
│   ├── rapidoc-python/   # RapiDoc for Python web frameworks: FastAPI and Starlette (PyPI: rapidoc)
│   └── rapidoc-dotnet/   # RapiDoc for ASP.NET Core (NuGet: RapiDoc.AspNetCore)
├── sites/
│   ├── rapi-mock/        # The RapiMock product and documentation site (mock.rapidocui.com), built with RapiDoc Portal
│   ├── shared/           # Code more than one site uses: the element reference component and its data
│   ├── rapi-flow/        # The RapiFlow documentation site (flow.rapidocui.com), built with RapiDoc Portal
│   ├── rapi-portal/      # The RapiDoc Portal product and documentation site (portal.rapidocui.com), built with RapiDoc Portal
│   └── rapidoc/          # rapidocui.com, built with RapiDoc Portal (published by deploy-docs.yml)
├── tests/
│   ├── unit/             # Node.js built-in test runner unit tests (*.test.js)
│   ├── component/        # Component-level tests
│   ├── e2e/              # End-to-end browser tests
│   └── perf/             # Spec loading, parsing, and rendering benchmarks (playwright-core)
├── brand/                # RapiDoc logo SVGs for every product (light, dark, favicon), how to use them, and the product names
├── docker/               # Dockerfile and Nginx deployment assets
├── scripts/              # Monorepo build and metric utilities (e.g., capture-build-info.js, test-loader.mjs)
├── .github/              # GitHub Actions workflows (CI / GitHub Pages deployment)
├── .claude/              # Claude Code subagents (.claude/agents/) and skills (.claude/skills/)
├── package.json          # Root workspace definition and monorepo scripts
├── CLAUDE.md             # Claude Code entry point (imports this file)
└── AGENTS.md             # This file (Root Agent Guidelines)
```

---

## 2. System Boundaries & Invariants

All agents must strictly adhere to the following system boundaries:

### Node.js & Module System

- **Node.js Version**: `>=22.12.0`. Do not use APIs or syntax incompatible with Node 22+.
- **Pure ESM**: All packages, scripts, and configuration files must use ESM syntax (`import`/`export`). Never use CommonJS (`require()`, `module.exports`).

### Package Isolation & Dependencies

- **Core Library Independence (`packages/rapidoc`)**:
  - `rapidoc` is published to npm as standalone browser bundles (`dist/rapidoc-min.js`, `dist/rapidoc-flow-min.js`) with an empty `dependencies` list: its libraries are `devDependencies`, bundled by Vite. Which ones are bundled: `dist/<bundle>.LICENSE.txt`, written by every build with each bundled package's version, license and notice. Copies of a bundle (the portal's `public/assets/`, the docs site's `dist/rapidoc/`) take that file along. Never add a runtime dependency or a Node-only export to it; Node entry points are separate packages (`@rapidoc/prerender`, `@rapidoc/mcp`).
  - Third-party runtime dependencies (e.g., `lit`, `@scalar/openapi-parser`, `marked`, `microlighter`, `github-slugger`) are bundled directly into `dist/rapidoc-min.js` via Vite.
  - Never import code from `sites/` or other sub-packages into `packages/rapidoc`.
  - Its public API reference is written once, in the element sources (`src/rapidoc.ts`, and likewise `src/rapidoc-mini.ts` and `src/rapi-flow.ts`, listed in `ELEMENTS` of `scripts/rapidoc-api.js`). In `rapidoc.ts`: each attribute is a `@property` declaration with a union type for its allowed values, its initial value as the default, and a doc comment (`@group`, and optionally `@default`, `@example`, `@hidden`); public methods have a doc comment with `@public`; events and slots are `@fires` and `@slot` tags on the class. A removed attribute is not in the source or the reference: it goes in its version's migration guide and in the "Removed attributes" page (`sites/rapidoc/docs/rapidoc/migration/removed-attributes.mdx`), which is where a search for an old name lands. `scripts/rapidoc-api.js` reads that with the TypeScript parser. The docs `/api` page renders the result, and every build turns it into `dist/` metadata (`scripts/rapidoc-metadata.js`): `rapidoc-options.schema.json` (of `<rapi-doc>`), `custom-elements.json` and the types `rapidoc.d.ts`, `flow.d.ts`, `react.d.ts`, `vue.d.ts` (all three elements), `oauth-receiver.html` and `integration.json` (version, files, SRI hashes). An attribute without a description and `@group` (or `@internal`) fails the build and `tests/unit/api-manifest.test.js`.
- **Integrations (`packages/rapidoc-embed` [@rapidoc/embed])**:
  - The contract every RapiDoc integration (framework middleware, docs-site plugin, tool extension) implements: options, routes and the host page's HTML. `src/core.js` has no imports; its output is fixed by `conformance/fixtures/`, which ports in other languages also run. Changing the expected output of an existing fixture, or an option's name, needs a new contract version (`CONTRACT_VERSION` in `src/core.js` and in each port). Three numbers are independent: that contract version, the version of the `@rapidoc/embed` package, and the `contract` field of rapidoc's `dist/integration.json` (the format of that file, set in `scripts/rapidoc-metadata.js`). Ports compare a page byte for byte, except the inline spec, which is compared as parsed JSON. `uiPath` is the path within the app or mount in every integration; `createResponder` takes the mount's prefix (`mount`) and puts it in front in the pages.
  - Depends only on `rapidoc` (`integration.json` and the bundle files). Framework-specific integrations are separate packages that depend on it.
  - **Naming**: an npm integration is `@rapidoc/<host>` (`@rapidoc/hono`), named after the framework or site generator with no `integration-` prefix; its description starts with "RapiDoc for <host>" and its keywords include `rapidoc-integration`, which is how the integrations are listed on npm. In another language it is one package per language named `rapidoc`, with a module per framework (`rapidoc.fastapi`).
  - `packages/rapidoc-hono` [@rapidoc/hono] is the reference integration for JavaScript server frameworks: a middleware that maps the contract's routes to Hono, with `hono` as a peer. It writes no HTML of its own, and its `./edge` entry imports no Node module. `@rapidoc/express` and `@rapidoc/fastify` are the same shape: each hands the request to `createResponder` of `@rapidoc/embed`, which matches the routes and produces status, headers and body, so a JavaScript server integration is a few dozen lines.
  - `packages/rapidoc-starlight` [@rapidoc/starlight] is the reference integration for documentation sites: a Starlight plugin that injects one page per API (`<rapi-doc>` in Starlight's layout, the spec inlined) and adds the API's tags and operations to Starlight's sidebar, from `@rapidoc/prerender`'s `getSpecNavigation`. `@astrojs/starlight` and `astro` are peers. Its tests build `example/`, so `@rapidoc/prerender` must be built first. `packages/rapidoc-vitepress` [@rapidoc/vitepress] does the same for VitePress, which has no plugin API: the user wraps the config (`withRapidoc`), builds the sidebar (`rapidocSidebar`) and puts the `RapidocReference` component on a page. `packages/rapidoc-docusaurus` [@rapidoc/docusaurus] is the same idea for Docusaurus: a plugin for the specs, `rapidocSidebarSync` for `sidebars.js`, and a React `RapidocReference`. Docusaurus is an optional peer and is not installed in the monorepo, so its component is checked by hand in a real site (its `AGENTS.md` says how). All three put the HTTP method in front of each operation link and strike deprecated ones through, with the classes and CSS of `@rapidoc/embed/sidebar`; the theme still draws the sidebar, so each plugin passes that theme's selectors.
  - `integrations/rapidoc-python` (Python, `rapidoc` on PyPI; `rapidoc.fastapi`, `rapidoc.starlette`) is the reference integration for other languages: `contract.py` is a port of `@rapidoc/embed`'s `core.js` and passes the same fixtures. It is not an npm workspace: the npm scripts (`lint`, `format`, `test:*`), Changesets and the release workflow do not cover it; its commands are in its own `AGENTS.md`, and `.github/workflows/publish-python.yml` tests it and publishes it to PyPI. A change to the contract's output is made in `@rapidoc/embed` first, then ported.
  - `integrations/rapidoc-dotnet` (C#, `RapiDoc.AspNetCore` on NuGet; `app.MapRapiDoc()`) is the same for ASP.NET Core: `RapiDocContract.cs` is the port and passes the same fixtures, the bundle is embedded in the assembly, and `.github/workflows/publish-dotnet.yml` tests it (.NET 8 and 10) and publishes it to nuget.org. Not an npm workspace either; its commands are in its own `AGENTS.md`.
  - RapiDoc for Go is not in this repository: it is `github.com/rapi-doc/rapidoc-go` (a `net/http` handler, standard library only), because a Go import path is the repository path and `go get` runs no build step, so the bundle and a copy of the fixtures are committed there. After a contract change or a rapidoc release, run its `scripts/sync.sh` there and tag a new version.
- **Node packages built from the core source (`packages/rapidoc-prerender`, `packages/rapidoc-mcp`)**:
  - `@rapidoc/prerender` owns its renderer (`src/`) and renders the templates, components and styles of `packages/rapidoc/src`; `@rapidoc/mcp` is only an entry over the MCP code there. Both bundle that source by relative path and publish `dist/` plus types only. The dependency runs one way: nothing in `packages/rapidoc/src` imports them.
  - Both must be built before the portal, server or `prerender:demo` use them in the monorepo: `npm run build:prerender`, `npm run build:mcp` (`pretest:portal`, `build` and `build:demo` run them). `pretest:portal` also builds `rapipdf`, for the CLI's `pdf` tests, and the Mock UI of `@rapidoc/mock` (`npm run build:mock`).
- **RapiPdf (`packages/rapipdf` [rapipdf])**:
  - The `<rapi-pdf>` web component (plain `HTMLElement`, no Lit), moved here from `github.com/mrin9/RapiPdf` at 2.2.1. It publishes three builds: `dist/rapipdf-min.js`, the self-contained browser bundle as a classic script (pdfmake, its fonts and the spec parser bundled in); `dist/rapipdf.js`, the same element as an ES module that fetches the generator (`dist/chunks/`) on first use; and `dist/node.js` (`rapipdf/node`: `generatePdf(spec, options)` returns the PDF as a Buffer), which `rapidoc pdf` uses. `pdfmake` is its one runtime dependency, for the Node entry only: pdfmake's Node build reads data files from its own folder, so it isn't bundled. Everything else is a `devDependency`, bundled by Vite.
  - Specs are loaded with `@scalar/openapi-parser`, like `<rapi-doc>`: and schemas are read through RapiDoc's `schemaToAST`: it bundles `packages/rapidoc/src/utils/spec-loader.js` and `schema-utils.js` by relative path, and imports nothing else from other packages.
  - Three layers: loading (`src/load-spec.js`), the headless core (`src/core/`: a resolved spec in, a pdfmake document definition out, no DOM, network or pdfmake) and rendering (`src/render-browser.js`). Keep the core headless: Node builds the same PDF from it.
  - Its output is fixed by `tests/fixtures/baseline/` (serialized document definitions, started from 2.2.1's); `npm run test:rapipdf` compares. A change that alters the PDF on purpose updates the baseline with it.
- **CLI & Portal (`packages/rapidoc-cli` [@rapidoc/cli], `packages/rapidoc-portal` [@rapidoc/portal])**:
  - Maintain clean boundaries. `@rapidoc/cli` (bin `rapidoc`) is the single command users run: `init`, `dev`, `build`, `serve`, `preview`, `mock`, `validate`, `lint`, `bundle`, `pdf`, `mcp`, `migrate`, `doctor`, `completion`. `@rapidoc/portal` is the docs-as-code developer portal engine and library.
  - `@rapidoc/portal` is an **optional peer** of the CLI, imported lazily: only `dev`, `build`, `migrate` and folder-wide `validate` load it, so `rapidoc init` and `rapidoc validate <spec>` work without Astro installed. Never import it at the top of the CLI.
  - `@rapidoc/server` (behind `rapidoc serve`) is the CLI's other optional peer, also imported lazily. It depends only on the build output (`dist/public/`, `dist/protected/`, `dist/rapidoc-server.json`), never on `@rapidoc/portal` or Astro; the portal writes that layout in `src/access/split-output.js`. Secrets (session key, client secret) are environment variables of the server, never config keys.
  - `rapidoc init` reuses `create-rapidoc`'s `scaffoldProject`/`findOpenApiSpecs` (`create-rapidoc/scaffold`); keep scaffolding logic only there.
  - `@rapidoc/mock` (behind `rapidoc mock`) is the CLI's third optional peer, imported lazily. It reads only spec files (the CLI passes the `apis:` from `loadConfig`), never `@rapidoc/portal` or Astro, and keeps its third-party mock libraries (openapi-backend, json-schema-faker) behind `src/engine/`. Its one built file is the Mock UI (`ui/`, Lit elements bundled into `dist/ui/` with Lit and TanStack Table); `lit`, `@tanstack/table-core` and `vite` are its devDependencies only.
  - `rapipdf` (behind `rapidoc pdf`) is the CLI's fifth optional peer, imported lazily as `rapipdf/node`. It reads only the spec; `--api <id>` takes the spec's location from the portal config.
  - `@modelcontextprotocol/sdk` is the CLI's fourth optional peer, for `rapidoc mcp serve` only (imported lazily). The CLI's own dependencies stay light: `@rapidoc/mcp`, `rapidoc` (the browser bundle `preview` serves), `@scalar/openapi-validator`, `yaml`, `@clack/prompts`, `create-rapidoc`.
  - `@rapidoc/mcp` is RapiDoc's MCP code built for Node (the portal build and `@rapidoc/server` use it). Its source stays in `packages/rapidoc/src` (`utils/mcp-generator.js`, `utils/mcp/`, `utils/arazzo/`), shared with `<rapi-doc>`'s Export MCP Server button and `<rapi-flow>`; `packages/rapidoc-mcp` holds only the entry and build. That shared code is headless: `tests/unit/headless-boundary.test.js` fails if it imports Lit, elements, templates, styles or an unlisted package.
  - Internal dependency ranges are caret ranges on the current release (`rapidoc ^15.0.0` in the portal, the CLI, `@rapidoc/embed` and the docs-site integrations, after this release; the fixed group's own version between its packages; `rapipdf ^3.0.0` as the CLI's peer), never `*`. `changeset version` writes them (§6); the manifests hold the exact values.

- **RapiMock site (`sites/rapi-mock`)**:
  - The product and documentation site of the mock server, named **RapiMock**, for `mock.rapidocui.com`. Built with RapiDoc Portal from this repository's own `@rapidoc/cli` and `@rapidoc/portal` (`npm run dev:mock-site`, `npm run build:mock-site`); it is not an npm workspace and publishes nothing to npm.
  - Its source lives here so a change to the mock and its documentation land in one pull request. A separate repository, `rapi-mock-doc`, only publishes the built site with GitHub Pages: `.github/workflows/publish-mock-site.yml` here builds it and pushes the files there.
  - It is where the mock's documentation grows. rapidocui.com has only the mock's feature page (`sites/rapidoc/pages/rapi-mock.astro`), which links to it. Its own rules are in `sites/rapi-mock/AGENTS.md`.

- **Shared site code (`sites/shared`)**: what more than one site uses: the element reference component (`components/ElementReference.astro`) and its data (`element-api.ts`, reading the element sources with `scripts/rapidoc-api.js`), used by `sites/rapidoc` and `sites/rapi-flow`. `styles/header.css` is the header of all four sites (rapidocui.com's layout) `styles/footer.css` lines their footer up with it, `styles/content.css` widens pages without "On this page", `styles/code.css` gives docs code blocks 4px corners and terminal blocks a slimmer title bar (like the feature pages' `CodeBlock`), `styles/dark.css` is the dark theme of all four (rapidocui.com's navy, also on the API reference and embedded operations and workflows) and `styles/light.css` the light one (the orange of RapiDoc's `amber` theme, on white), all imported first by each site's `styles/portal.css`; the footer's columns are the same `footer` block in each site's config. A docs page imports it by relative path; it finds the repository from the site's folder (`virtual:rapidoc-portal/project`, two levels down), never from its own location, which a build bundles away.

- **RapiFlow site (`sites/rapi-flow`)**:
  - The documentation site of RapiFlow (`<rapi-flow>`), for `flow.rapidocui.com`, and the home of RapiDoc's Arazzo support across the family. Set up like the RapiMock site: built from this repository's own CLI and portal (`npm run dev:flow-site`, `npm run build:flow-site`), not an npm workspace, and published by `.github/workflows/publish-flow-site.yml`, which pushes the built files to `rapi-flow-doc`.
  - Docs only: RapiFlow's feature page, API reference and examples stay on rapidocui.com. A change to `<rapi-flow>` or `src/utils/arazzo/` updates its pages in the same pull request. Its own rules are in `sites/rapi-flow/AGENTS.md`.

- **RapiDoc Portal site (`sites/rapi-portal`)**:
  - The product and documentation site of RapiDoc Portal, for `portal.rapidocui.com`, set up like the RapiMock site: built from this repository's own CLI and portal (`npm run dev:portal-site`, `npm run build:portal-site`), not an npm workspace, and published by `.github/workflows/publish-portal-site.yml`, which pushes the built files to `rapi-portal-doc`. It moved here from that repository, which now only publishes.
  - Portal, server and CLI documentation for portal users goes there, in the same pull request as the change. Its own rules are in `sites/rapi-portal/AGENTS.md`.

### Build Artifact Hygiene

- **Never commit generated build output**:
  - `packages/rapidoc/dist/`
  - `sites/*/dist/`
  - `node_modules/`
  - Temporary benchmark runs
- Keep `dist` files out of Git commits. Production bundles are generated by CI/CD (`.github/workflows/deploy-docs.yml` builds rapidocui.com from `sites/rapidoc`).
- **CRITICAL**: `packages/rapidoc/dist/rapidoc-min.js` is tracked at an older git commit. **DO NOT** run `git checkout` or `git restore` on `packages/rapidoc/dist/rapidoc-min.js` to clear `git status`, as that reverts it to an obsolete bundle lacking `OperationSlugger` and `nav-active-change`, breaking portal navigation. Always build it using `npm run build:rapidoc`.

---

## 3. Build, Dev, and Test Commands

All primary scripts are runnable from the repository root via npm:

### Development & Live Preview

| Command           | Workspace | Description                                                                                                                         |
| :---------------- | :-------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`     | `sites/*` | Same as `npm run dev:sites`: the four sites' dev servers side by side (below). |

### Build Commands

| Command                     | Scope                 | Description                                                                                                             |
| :-------------------------- | :-------------------- | :---------------------------------------------------------------------------------------------------------------------- |
| `npm run build`             | `sites/rapidoc`       | Same as `npm run build:rapidoc-site`: builds the packages rapidocui.com loads, then the site to `sites/rapidoc/dist/`. |
| `npm run build:rapidoc`     | `packages/rapidoc`    | Builds `dist/rapidoc-min.js` and `dist/rapidoc-flow-min.js` (`rapidoc/flow`) with Vite. |
| `npm run build:prerender`      | `packages/rapidoc-prerender` | Builds `@rapidoc/prerender` (`dist/index.js`); the portal and `prerender:demo` use it. |
| `npm run build:mcp`         | `packages/rapidoc-mcp` | Builds `@rapidoc/mcp` (`dist/index.js`); the portal and server import it, so `pretest:portal` and `build:demo` run it. |
| `npm run build:rapipdf`     | `packages/rapipdf`    | Builds `dist/rapipdf-min.js` and `dist/rapipdf.js` (`<rapi-pdf>`, classic script and ES module) and `dist/node.js` (`rapipdf/node`) with Vite. |
| `npm run build:mock`        | `packages/rapidoc-mock` | Builds the Mock UI (`dist/ui/mock-ui.js`, Lit elements with Lit and TanStack Table bundled in), which `rapidoc mock --stateful` serves at `/__mock/ui`. The server itself is published as source. |
| `npm run dev:mock-ui`       | `packages/rapidoc-mock` | Builds the Mock UI, then runs `rapidoc mock --stateful` on three test specs (PetClinic, Nylas, RealWorld) at `http://localhost:4411/__mock/ui`. After a change under `ui/`, `npm run build:mock` and reload; after one under `src/`, restart it. |
| `npm run build:packages`   | Monorepo              | Builds everything the packages publish: `rapidoc`, `@rapidoc/mcp`, `@rapidoc/prerender`, `rapipdf`, the Mock UI of `@rapidoc/mock` and the portal's `schema.json` (the release workflow runs it). |
| `npm run changeset`        | Monorepo              | Adds a changeset for the packages a pull request changes (§6). `npm run version-packages` applies them; the release workflow runs it. |
| `npm run build-info`       | Monorepo              | Rewrites `sites/rapidoc/page-data/rapidoc-build-info.{json,yaml}`: version, bundle sizes and npm package sizes of every package (the package builds run it last). |
| `npm run build:rapidoc:dev` | `packages/rapidoc`    | Builds an unminified bundle with sourcemaps and console logs intact.                                                    |
| `npm run build:size`        | `packages/rapidoc`    | Builds RapiDoc with `ANALYZE=true` generating visualizer treemap in `dist/stats.html`.                                  |
| `npm run dev:sites`         | `sites/*`             | Runs the four sites' dev servers side by side (rapidocui.com 4329, RapiFlow 4330, RapiMock 4327, Portal 4328) with `RAPIDOC_DEV_LINKS` set, so links between them stay local (`scripts/dev-sites.mjs`). |
| `npm run build:mock-site`   | `sites/rapi-mock`     | Builds the RapiMock site to `sites/rapi-mock/dist/` with this repository's CLI and portal (`npm run dev:mock-site` previews it on port 4327). Both first run `npm run build:spec-check`: the site's spec check (`/spec-check/`), the validator, lint rules and stateful mock bundled for a browser, shown in the Mock UI. |
| `npm run build:flow-site`   | `sites/rapi-flow`     | Builds the RapiFlow site to `sites/rapi-flow/dist/` with this repository's CLI and portal (`npm run dev:flow-site` previews it on port 4330). |
| `npm run build:portal-site` | `sites/rapi-portal`   | Builds the RapiDoc Portal site to `sites/rapi-portal/dist/` with this repository's CLI and portal (`npm run dev:portal-site` previews it on port 4328; `npm run mock:portal-site` runs the mock its example API calls). |
| `npm run build:demo`        | `../rapi-portal-demo` | Builds `rapidoc`, then the sibling `rapi-portal-demo` checkout with the `rapidoc` CLI into `../rapi-portal-demo/dist/`. |
| `npm run prerender:demo`    | Monorepo              | Runs `scripts/prerender-demo.mjs`.                                                                                      |

### Testing & Benchmarking

| Command                  | Target     | Runner / Details                                                                                                                                           |
| :----------------------- | :--------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run test:unit`      | Monorepo   | Executes all unit tests in `tests/unit/*.test.js` using Node.js native test runner (`node:test` + `node:assert`), loaded via `scripts/test-loader.mjs`.    |
| `npm run test:component` | Monorepo   | Runs `tests/component/*.test.js`.                                                                                                                          |
| `npm run test:e2e`       | Monorepo   | Runs `tests/e2e/*.test.js`.                                                                                                                                |
| `npm run test:all`       | Monorepo   | Runs `test:unit`, `test:component` and `test:e2e` in sequence.                                                                                             |
| `npm run test:portal`    | Portal/CLI | Runs `tests/**/*.test.js` in `rapidoc-portal`, `rapidoc-cli`, `rapidoc-server`, `rapidoc-mock`, `create-rapidoc`, `rapidoc-embed` and the integrations (`rapidoc-hono`, `rapidoc-express`, `rapidoc-fastify`, `rapidoc-starlight`, `rapidoc-vitepress`, `rapidoc-docusaurus`) (serially, `--test-concurrency=1`).   |
| `npm run test:rapipdf`   | `rapipdf`  | Builds `rapipdf`, then runs `packages/rapipdf/tests/*.test.js`: the document definitions against the baseline, the core's unit tests and `rapipdf/node` in Node, the element in headless Chrome. |
| `npm run test:parser`    | Monorepo   | Runs `tests/perf/benchmark.js` to measure OpenAPI spec parsing, circular ref handling, and dereferencing times across Bookstore, Stripe, and GitHub specs. |
| `npm run test:perf`      | Monorepo   | Runs `tests/perf/render-benchmark.js` measuring headless browser rendering performance across Focused, View, and Read modes.                               |

### Quality & Formatting

| Command              | Scope    | Description                                                                          |
| :------------------- | :------- | :----------------------------------------------------------------------------------- |
| `npm run lint`       | Monorepo | Runs oxlint on `packages/`, `tests/` and `scripts/`; any warning fails. |
| `npm run format`     | Monorepo | Checks oxfmt formatting of the same folders (fixtures and generated JSON excluded).  |
| `npm run format-fix` | Monorepo | Formats the same folders with oxfmt.                                                 |

---

## 4. Coding Styles & Conventions

### Linting & Formatting (oxlint, oxfmt)

Both tools run with their defaults. oxlint has no config file; oxfmt's `.oxfmtrc.json` sets only `embeddedLanguageFormatting: "off"`. Don't add other options. The style is whatever `npm run format-fix` produces (2 spaces, double quotes, semicolons, trailing commas, 100-character lines).

- **Templates kept as-is**: with embedded formatting on, oxfmt rewrites the HTML and CSS inside Lit `html`/`css` templates, which changes what `<rapi-doc>` renders (whitespace between inline elements, CSS quotes).
- **Suppressions**: only when a finding is intentional, as `// oxlint-disable-next-line <rule> -- <reason>` (or `oxlint-disable-line`). `// prettier-ignore` keeps oxfmt off one statement.
- **Not formatted**: `.mdx` (oxfmt 0.x moves content out of JSX blocks such as `<Steps>`), `fixtures/` folders, and generated JSON (`packages/rapidoc-portal/schema.json`, `tests/layout/measurements.json`); the excludes are in the `format` scripts.
- **Lit templates**: no static checker (the linter has no Lit rules); the unit, component and e2e tests render them.
- **Console / Debugger**: stripped from the production bundle by the custom Vite transform.

### Product Names

Name the products as `brand/README.md` ("Names") sets out, in docs, pages, sites, menus, READMEs and package descriptions: **RapiDoc**, **RapiDoc Mini**, **RapiFlow**, **RapiPdf**, **RapiMock**, **RapiDoc Portal**, **RapiDoc CLI**; integrations are "RapiDoc for <host>". Never Rapidoc, Rapi Mock, RapiPDF or "Developer Portal" as a name; tags, packages and commands go in code font.

### Component Design & Lit Guidelines (`packages/rapidoc`)

- Implement web components using **Lit 3** (`LitElement`, `html`, `css`).
- Use **Shadow DOM** for strict style and DOM encapsulation.
- Expose styling extension points via **CSS Shadow Parts** (`::part(...)`) and **CSS Custom Properties** (e.g. `--bg`, `--fg`, `--primary-color`).
- Keep components responsive, accessible, and fast with large OpenAPI schemas. Avoid unnecessary DOM allocations.

---

## 5. Agent Workflow Rules

When executing tasks in this repository, follow these rules:

1. **Verify Before and After**:
   - Before modifying core parser or schema logic, run `npm run test:unit`.
   - After completing edits, run `npm run test:unit`, `npm run lint` and `npm run format-fix` to maintain code health.
2. **Respect Package Boundaries**:
   - Refer to nested `AGENTS.md` files in subdirectories for package-specific context:
     - [`packages/rapidoc/AGENTS.md`](packages/rapidoc/AGENTS.md)
     - [`packages/rapidoc-cli/AGENTS.md`](packages/rapidoc-cli/AGENTS.md)
     - [`packages/rapidoc-server/AGENTS.md`](packages/rapidoc-server/AGENTS.md)
     - [`packages/rapidoc-mock/AGENTS.md`](packages/rapidoc-mock/AGENTS.md)
     - [`packages/rapidoc-prerender/AGENTS.md`](packages/rapidoc-prerender/AGENTS.md)
     - [`packages/rapidoc-mcp/AGENTS.md`](packages/rapidoc-mcp/AGENTS.md)
     - [`packages/rapipdf/AGENTS.md`](packages/rapipdf/AGENTS.md)
     - [`packages/rapidoc-portal/AGENTS.md`](packages/rapidoc-portal/AGENTS.md)
     - [`packages/create-rapidoc/AGENTS.md`](packages/create-rapidoc/AGENTS.md)
     - [`packages/rapidoc-embed/AGENTS.md`](packages/rapidoc-embed/AGENTS.md)
     - [`packages/rapidoc-hono/AGENTS.md`](packages/rapidoc-hono/AGENTS.md)
     - [`packages/rapidoc-starlight/AGENTS.md`](packages/rapidoc-starlight/AGENTS.md)
     - [`packages/rapidoc-express/AGENTS.md`](packages/rapidoc-express/AGENTS.md)
     - [`packages/rapidoc-fastify/AGENTS.md`](packages/rapidoc-fastify/AGENTS.md)
     - [`packages/rapidoc-vitepress/AGENTS.md`](packages/rapidoc-vitepress/AGENTS.md)
     - [`packages/rapidoc-docusaurus/AGENTS.md`](packages/rapidoc-docusaurus/AGENTS.md)
     - [`integrations/rapidoc-python/AGENTS.md`](integrations/rapidoc-python/AGENTS.md)
     - [`integrations/rapidoc-dotnet/AGENTS.md`](integrations/rapidoc-dotnet/AGENTS.md)
     - [`sites/rapi-mock/AGENTS.md`](sites/rapi-mock/AGENTS.md)
     - [`sites/rapi-flow/AGENTS.md`](sites/rapi-flow/AGENTS.md)
     - [`sites/rapi-portal/AGENTS.md`](sites/rapi-portal/AGENTS.md)
     - [`sites/rapidoc/AGENTS.md`](sites/rapidoc/AGENTS.md)
   - After changing portal, CLI, server or mock code, run `npm run test:portal`.
3. **No Unsolicited File Deletions**:
   - Preserve existing public specs (`sites/rapidoc/public/specs/`, `specs-test/`): the examples load them and the unit, mock and perf tests read them
4. **Commits and Git State**:
   - **Never run `git commit` unless explicitly instructed by the user.** Keep all working tree changes uncommitted for user review.
   - Never commit `dist/` or other build artifacts to Git.

---

## 6. Releasing (Changesets)

Versions and npm publishing go through [Changesets](https://changesets.dev) (`.changeset/config.json`) and `.github/workflows/release.yml`. Never run `npm publish` by hand.

- **Version tracks**:
  - `rapidoc` (the web component) has its own semver: a major means `<rapi-doc>` changed in a way its users see.
  - `@rapidoc/cli`, `portal`, `server`, `mock`, `prerender`, `mcp` and `create-rapidoc` are one `fixed` group: every release bumps all seven to the same version. Stable since 1.0.0 (released with `rapidoc` 15): a major means a breaking change to the config, a Markdoc tag, a CLI command or flag, or a package's API; a minor adds; a patch fixes.
  - `rapipdf` (the `<rapi-pdf>` web component) has its own semver too, continuing from 2.2.1.
  - `@rapidoc/embed` and each integration (`@rapidoc/hono`, `@rapidoc/express`, `@rapidoc/fastify`, `@rapidoc/starlight`, `@rapidoc/vitepress`, `@rapidoc/docusaurus`) have their own semver, outside the group: integrations should not re-release with every portal release. A change to the output of its `src/core.js` is a new contract version and a breaking release. `@rapidoc/embed`, `@rapidoc/hono`, `@rapidoc/express` and `@rapidoc/fastify` are stable (1.x, from the same release as the group's 1.0.0). The docs-site integrations (`@rapidoc/starlight`, `@rapidoc/vitepress`, `@rapidoc/docusaurus`) are still 0.x: they follow their host frameworks, so a minor may break and a patch fixes or adds; each goes to 1.0.0 on its own. A new major of `rapidoc` is a **minor** release of `@rapidoc/embed` and of every integration, not a major: `rapidoc` has a new major several times a year, and an integration's own API (its options and routes) does not change with it. Their READMEs say that they serve RapiDoc's current major. Write that changeset by hand (`minor` for embed and each integration) in the pull request that releases the new `rapidoc` major: Changesets alone would make it a patch.
- **Every pull request that changes a published package adds a changeset**: `npm run changeset`, pick the packages and the bump, write one changelog line in the user's terms. Changes that release nothing (the sites, tests, tooling) need none.
- **`rapidoc` source is also in `@rapidoc/prerender` and `@rapidoc/mcp`**: both bundle `packages/rapidoc/src` at build time, which Changesets can't see. A change to its templates, components or styles (prerender) or to `utils/mcp/` and `utils/arazzo/` (mcp) needs those packages in its changeset too, so the portal's pre-rendered HTML and the `rapidoc-min.js` that takes it over come from the same source. `rapipdf` bundles `utils/spec-loader.js` and `utils/schema-utils.js` the same way, so a change to either needs `rapipdf` in its changeset.
- **The flow**: changesets merged to `master` → the workflow opens or updates the "chore: release packages" pull request (`npm run version-packages`: versions, changelogs, internal ranges, lockfile). Merging it → the workflow builds (`npm run build:packages`), runs `test:unit`, packs, publishes with npm trusted publishing (no token), and creates git tags and GitHub releases.
- **Internal ranges** are updated by `changeset version` (`updateInternalDependencies: patch`); don't edit them by hand.
