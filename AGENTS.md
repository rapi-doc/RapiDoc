# AGENTS.md — RapiDoc Monorepo

Welcome to the RapiDoc monorepo. This document establishes the foundational architecture, system boundaries, build and test workflows, and coding conventions across the repository for autonomous agents and human developers.

---

## 1. Monorepo Architecture & Directory Structure

This repository is managed as an **npm workspaces** monorepo running on **Node.js >= 22.12.0** with native **ECMAScript Modules (ESM)** (`"type": "module"`).

```text
rapidoc/
├── packages/
│   ├── rapidoc/          # Core RapiDoc Web Component library (Lit, Vite)
│   ├── rapidoc-cli/      # The `rapidoc` command (@rapidoc/cli): init, dev, build, serve, preview, mock, validate, lint, bundle, mcp, migrate, doctor, completion
│   ├── rapidoc-portal/   # Developer portal framework for OpenAPI & Markdoc (@rapidoc/portal)
│   ├── rapidoc-server/   # Serves a built portal with OIDC sign-in and access rules (@rapidoc/server, `rapidoc serve`)
│   ├── rapidoc-mock/     # Mock server for the portal's APIs, with OAuth scope checks (@rapidoc/mock, `rapidoc mock`)
│   ├── rapidoc-prerender/ # Build-time renderer: pre-rendered <rapi-doc>, sidebar HTML, Arazzo SVG (@rapidoc/prerender)
│   ├── rapidoc-embed/    # Integration contract: standard host page for <rapi-doc>, routes, conformance fixtures (@rapidoc/embed)
│   ├── rapidoc-hono/     # RapiDoc for Hono: middleware over @rapidoc/embed (@rapidoc/hono)
│   ├── rapidoc-starlight/ # RapiDoc for Starlight: API reference pages in the site's layout and sidebar (@rapidoc/starlight)
│   ├── rapidoc-mcp/      # MCP manifest builder, runtime and project writer for Node (@rapidoc/mcp), built from rapidoc/src
│   └── create-rapidoc/   # Scaffolding CLI for new portals (npm create rapidoc)
├── integrations/         # RapiDoc integrations in other languages, each with its own toolchain; not npm workspaces
│   └── rapidoc-python/   # RapiDoc for Python web frameworks: FastAPI and Starlette (PyPI: rapidoc)
├── docs/                 # Documentation & interactive showcase site (Astro 7 + Starlight)
├── tests/
│   ├── unit/             # Node.js built-in test runner unit tests (*.test.js)
│   ├── component/        # Component-level tests
│   ├── e2e/              # End-to-end browser tests
│   └── perf/             # Spec loading, parsing, and rendering benchmarks (playwright-core)
├── brand/                # RapiDoc logo SVGs for every product (light, dark, favicon) and how to use them
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
  - Never import code from `docs/` or other sub-packages into `packages/rapidoc`.
  - Its public API reference is written once, in `src/rapidoc.ts`: each attribute is a `@property` declaration with a union type for its allowed values, its initial value as the default, and a doc comment (`@group`, and optionally `@default`, `@example`, `@hidden`); public methods have a doc comment with `@public`; events, slots and removed attributes are `@fires`, `@slot` and `@deprecatedAttr` tags on the class. `scripts/rapidoc-api.js` reads that with the TypeScript parser. The docs `/api` page renders the result, and every build turns it into `dist/` metadata (`scripts/rapidoc-metadata.js`): `rapidoc-options.schema.json`, `custom-elements.json`, `rapidoc.d.ts` (+ `react.d.ts`, `vue.d.ts`), `oauth-receiver.html` and `integration.json` (version, files, SRI hashes). An attribute without a description and `@group` (or `@internal`) fails the build and `tests/unit/api-manifest.test.js`.
- **Integrations (`packages/rapidoc-embed` [@rapidoc/embed])**:
  - The contract every RapiDoc integration (framework middleware, docs-site plugin, tool extension) implements: options, routes and the host page's HTML. `src/core.js` has no imports; its output is fixed by `conformance/fixtures/`, which ports in other languages also run. Changing that output needs a new contract version.
  - Depends only on `rapidoc` (`integration.json` and the bundle files). Framework-specific integrations are separate packages that depend on it.
  - **Naming**: an npm integration is `@rapidoc/<host>` (`@rapidoc/hono`), named after the framework or site generator with no `integration-` prefix; its description starts with "RapiDoc for <host>" and its keywords include `rapidoc-integration`, which is how the integrations are listed on npm. In another language it is one package per language named `rapidoc`, with a module per framework (`rapidoc.fastapi`).
  - `packages/rapidoc-hono` [@rapidoc/hono] is the reference integration for JavaScript server frameworks: a middleware that maps the contract's routes to Hono, with `hono` as a peer. It writes no HTML of its own, and its `./edge` entry imports no Node module.
  - `packages/rapidoc-starlight` [@rapidoc/starlight] is the reference integration for documentation sites: a Starlight plugin that injects one page per API (`<rapi-doc>` in Starlight's layout, the spec inlined) and adds the API's tags and operations to Starlight's sidebar, from `@rapidoc/prerender`'s `getSpecNavigation`. `@astrojs/starlight` and `astro` are peers. Its tests build `example/`, so `@rapidoc/prerender` must be built first.
  - `integrations/rapidoc-python` (Python, `rapidoc` on PyPI; `rapidoc.fastapi`, `rapidoc.starlette`) is the reference integration for other languages: `contract.py` is a port of `@rapidoc/embed`'s `core.js` and passes the same fixtures. It is not an npm workspace: the npm scripts (`lint`, `format`, `test:*`), Changesets and the release workflow do not cover it; its commands are in its own `AGENTS.md`, and `.github/workflows/publish-python.yml` tests it and publishes it to PyPI. A change to the contract's output is made in `@rapidoc/embed` first, then ported.
- **Node packages built from the core source (`packages/rapidoc-prerender`, `packages/rapidoc-mcp`)**:
  - `@rapidoc/prerender` owns its renderer (`src/`) and renders the templates, components and styles of `packages/rapidoc/src`; `@rapidoc/mcp` is only an entry over the MCP code there. Both bundle that source by relative path and publish `dist/` plus types only. The dependency runs one way: nothing in `packages/rapidoc/src` imports them.
  - Both must be built before the portal, server or `prerender:demo` use them in the monorepo: `npm run build:prerender`, `npm run build:mcp` (`pretest:portal`, `build` and `build:demo` run them).
- **Documentation Site (`docs`)**:
  - Consumes `packages/rapidoc` via npm workspaces (`"rapidoc": "*"`).
  - Aliases `rapidoc` and `~` to `../packages/rapidoc/src/` in development for instantaneous hot reloading.
  - The Astro dev server and build pipeline automatically compile `packages/rapidoc` into `rapidoc-min.js` if missing.
- **CLI & Portal (`packages/rapidoc-cli` [@rapidoc/cli], `packages/rapidoc-portal` [@rapidoc/portal])**:
  - Maintain clean boundaries. `@rapidoc/cli` (bin `rapidoc`) is the single command users run: `init`, `dev`, `build`, `serve`, `preview`, `mock`, `validate`, `lint`, `bundle`, `mcp`, `migrate`, `doctor`, `completion`. `@rapidoc/portal` is the docs-as-code developer portal engine and library.
  - `@rapidoc/portal` is an **optional peer** of the CLI, imported lazily: only `dev`, `build`, `migrate` and folder-wide `validate` load it, so `rapidoc init` and `rapidoc validate <spec>` work without Astro installed. Never import it at the top of the CLI.
  - `@rapidoc/server` (behind `rapidoc serve`) is the CLI's other optional peer, also imported lazily. It depends only on the build output (`dist/public/`, `dist/protected/`, `dist/rapidoc-server.json`), never on `@rapidoc/portal` or Astro; the portal writes that layout in `src/access/split-output.js`. Secrets (session key, client secret) are environment variables of the server, never config keys.
  - `rapidoc init` reuses `create-rapidoc`'s `scaffoldProject`/`findOpenApiSpecs` (`create-rapidoc/scaffold`); keep scaffolding logic only there.
  - `@rapidoc/mock` (behind `rapidoc mock`) is the CLI's third optional peer, imported lazily. It reads only spec files (the CLI passes the `apis:` from `loadConfig`), never `@rapidoc/portal` or Astro, and keeps its third-party mock libraries (openapi-backend, json-schema-faker) behind `src/engine/`.
  - `@modelcontextprotocol/sdk` is the CLI's fourth optional peer, for `rapidoc mcp serve` only (imported lazily). The CLI's own dependencies stay light: `@rapidoc/mcp`, `rapidoc` (the browser bundle `preview` serves), `@scalar/openapi-validator`, `yaml`, `@clack/prompts`, `create-rapidoc`.
  - `@rapidoc/mcp` is RapiDoc's MCP code built for Node (the portal build and `@rapidoc/server` use it). Its source stays in `packages/rapidoc/src` (`utils/mcp-generator.js`, `utils/mcp/`, `utils/arazzo/`), shared with `<rapi-doc>`'s Export MCP Server button and `<rapi-flow>`; `packages/rapidoc-mcp` holds only the entry and build. That shared code is headless: `tests/unit/headless-boundary.test.js` fails if it imports Lit, elements, templates, styles or an unlisted package.
  - Internal dependency ranges are pinned (`rapidoc ^12.1.0`, `@rapidoc/prerender ^0.1.0` and `@rapidoc/mcp ^0.1.0` in the portal, `@rapidoc/mcp ^0.1.0` in the server, `@rapidoc/portal ^0.1.0`, `@rapidoc/server ^0.1.0` and `@rapidoc/mock ^0.1.0` as the CLI's peers, `rapidoc ^12.1.0` and `@rapidoc/mcp ^0.1.0` as its dependencies), never `*`.

### Build Artifact Hygiene

- **Never commit generated build output**:
  - `packages/rapidoc/dist/`
  - `docs/dist/`
  - `docs/.astro/`
  - `node_modules/`
  - Temporary benchmark runs
- Keep `dist` files out of Git commits. Production bundles are generated by CI/CD (`.github/workflows/deploy-docs.yml`).
- **CRITICAL**: `packages/rapidoc/dist/rapidoc-min.js` is tracked at an older git commit. **DO NOT** run `git checkout` or `git restore` on `packages/rapidoc/dist/rapidoc-min.js` to clear `git status`, as that reverts it to an obsolete bundle lacking `OperationSlugger` and `nav-active-change`, breaking portal navigation. Always build it using `npm run build:rapidoc`.

---

## 3. Build, Dev, and Test Commands

All primary scripts are runnable from the repository root via npm:

### Development & Live Preview

| Command           | Workspace | Description                                                                                                                         |
| :---------------- | :-------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`     | `docs`    | Launches Astro documentation & showcase dev server (default: `http://localhost:4321`) with live watcher on `packages/rapidoc/src/`. |
| `npm run stop`    | `docs`    | Stops the running Astro dev server or terminates background dev processes.                                                          |
| `npm run preview` | `docs`    | Previews the production build of the documentation site.                                                                            |

### Build Commands

| Command                     | Scope                 | Description                                                                                                             |
| :-------------------------- | :-------------------- | :---------------------------------------------------------------------------------------------------------------------- |
| `npm run build`             | Monorepo              | Sequentially builds `rapidoc` (via Vite) and `docs` (via Astro).                                                        |
| `npm run build:rapidoc`     | `packages/rapidoc`    | Builds `dist/rapidoc-min.js` and `dist/rapidoc-flow-min.js` (`rapidoc/flow`) with Vite. |
| `npm run build:prerender`      | `packages/rapidoc-prerender` | Builds `@rapidoc/prerender` (`dist/index.js`); the portal, the docs guide's build and `prerender:demo` use it. |
| `npm run build:mcp`         | `packages/rapidoc-mcp` | Builds `@rapidoc/mcp` (`dist/index.js`); the portal and server import it, so `pretest:portal` and `build:demo` run it. |
| `npm run build:packages`   | Monorepo              | Builds everything the packages publish: `rapidoc`, `@rapidoc/mcp`, `@rapidoc/prerender` and the portal's `schema.json` (the release workflow runs it). |
| `npm run changeset`        | Monorepo              | Adds a changeset for the packages a pull request changes (§6). `npm run version-packages` applies them; the release workflow runs it. |
| `npm run build-info`       | Monorepo              | Rewrites `docs/src/page-data/rapidoc-build-info.{json,yaml}`: version, bundle sizes and npm package sizes of every package (the package builds run it last). |
| `npm run build:rapidoc:dev` | `packages/rapidoc`    | Builds an unminified bundle with sourcemaps and console logs intact.                                                    |
| `npm run build:size`        | `packages/rapidoc`    | Builds RapiDoc with `ANALYZE=true` generating visualizer treemap in `dist/stats.html`.                                  |
| `npm run build:docs`        | `docs`                | Builds the Astro Starlight documentation site to `docs/dist/`.                                                          |
| `npm run build:demo`        | `../rapi-portal-demo` | Builds `rapidoc`, then the sibling `rapi-portal-demo` checkout with the `rapidoc` CLI into `../rapi-portal-demo/dist/`. |
| `npm run prerender:demo`    | Monorepo              | Runs `scripts/prerender-demo.mjs`.                                                                                      |

### Testing & Benchmarking

| Command                  | Target     | Runner / Details                                                                                                                                           |
| :----------------------- | :--------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run test:unit`      | Monorepo   | Executes all unit tests in `tests/unit/*.test.js` using Node.js native test runner (`node:test` + `node:assert`), loaded via `scripts/test-loader.mjs`.    |
| `npm run test:component` | Monorepo   | Runs `tests/component/*.test.js`.                                                                                                                          |
| `npm run test:e2e`       | Monorepo   | Runs `tests/e2e/*.test.js`.                                                                                                                                |
| `npm run test:all`       | Monorepo   | Runs `test:unit`, `test:component` and `test:e2e` in sequence.                                                                                             |
| `npm run test:portal`    | Portal/CLI | Runs `tests/**/*.test.js` in `rapidoc-portal`, `rapidoc-cli`, `rapidoc-server`, `rapidoc-mock`, `create-rapidoc`, `rapidoc-embed`, `rapidoc-hono` and `rapidoc-starlight` (serially, `--test-concurrency=1`).   |
| `npm run test:parser`    | Monorepo   | Runs `tests/perf/benchmark.js` to measure OpenAPI spec parsing, circular ref handling, and dereferencing times across Bookstore, Stripe, and GitHub specs. |
| `npm run test:perf`      | Monorepo   | Runs `tests/perf/render-benchmark.js` measuring headless browser rendering performance across Focused, View, and Read modes.                               |

### Quality & Formatting

| Command              | Scope    | Description                                                                          |
| :------------------- | :------- | :----------------------------------------------------------------------------------- |
| `npm run lint`       | Monorepo | Runs oxlint on `packages/`, `docs/src/`, `tests/` and `scripts/`; any warning fails. |
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

### Component Design & Lit Guidelines (`packages/rapidoc`)

- Implement web components using **Lit 3** (`LitElement`, `html`, `css`).
- Use **Shadow DOM** for strict style and DOM encapsulation.
- Expose styling extension points via **CSS Shadow Parts** (`::part(...)`) and **CSS Custom Properties** (e.g. `--bg`, `--fg`, `--primary-color`).
- Keep components responsive, accessible, and fast with large OpenAPI schemas. Avoid unnecessary DOM allocations.

### Documentation & Astro Guidelines (`docs`)

- Built with **Astro 7** and **Starlight**.
- Documentation content resides in `src/content/docs/`.
- Dynamic and interactive demo pages reside in `src/pages/` and `src/pages/examples/`.
- YAML page data lives in `src/page-data/`. The attribute, method, event and slot reference is not there: it is read from the doc comments of `packages/rapidoc/src/rapidoc.ts`.
- Ensure redirects in `docs/astro.config.mjs` are maintained when reorganizing routes.

---

## 5. Agent Workflow Rules

When executing tasks in this repository, follow these rules:

1. **Verify Before and After**:
   - Before modifying core parser or schema logic, run `npm run test:unit`.
   - After completing edits, run `npm run test:unit`, `npm run lint` and `npm run format-fix` to maintain code health.
2. **Respect Package Boundaries**:
   - Refer to nested `AGENTS.md` files in subdirectories for package-specific context:
     - [`packages/rapidoc/AGENTS.md`](packages/rapidoc/AGENTS.md)
     - [`docs/AGENTS.md`](docs/AGENTS.md)
     - [`packages/rapidoc-cli/AGENTS.md`](packages/rapidoc-cli/AGENTS.md)
     - [`packages/rapidoc-server/AGENTS.md`](packages/rapidoc-server/AGENTS.md)
     - [`packages/rapidoc-mock/AGENTS.md`](packages/rapidoc-mock/AGENTS.md)
     - [`packages/rapidoc-prerender/AGENTS.md`](packages/rapidoc-prerender/AGENTS.md)
     - [`packages/rapidoc-mcp/AGENTS.md`](packages/rapidoc-mcp/AGENTS.md)
     - [`packages/rapidoc-portal/AGENTS.md`](packages/rapidoc-portal/AGENTS.md)
     - [`packages/create-rapidoc/AGENTS.md`](packages/create-rapidoc/AGENTS.md)
     - [`packages/rapidoc-embed/AGENTS.md`](packages/rapidoc-embed/AGENTS.md)
     - [`packages/rapidoc-hono/AGENTS.md`](packages/rapidoc-hono/AGENTS.md)
     - [`packages/rapidoc-starlight/AGENTS.md`](packages/rapidoc-starlight/AGENTS.md)
     - [`integrations/rapidoc-python/AGENTS.md`](integrations/rapidoc-python/AGENTS.md)
   - After changing portal, CLI, server or mock code, run `npm run test:portal`.
3. **No Unsolicited File Deletions**:
   - Preserve existing public specs (`docs/public/specs/`)
4. **Commits and Git State**:
   - **Never run `git commit` unless explicitly instructed by the user.** Keep all working tree changes uncommitted for user review.
   - Never commit `dist/` or other build artifacts to Git.

---

## 6. Releasing (Changesets)

Versions and npm publishing go through [Changesets](https://changesets.dev) (`.changeset/config.json`) and `.github/workflows/release.yml`. Never run `npm publish` by hand.

- **Version tracks**:
  - `rapidoc` (the web component) has its own semver: a major means `<rapi-doc>` changed in a way its users see.
  - `@rapidoc/cli`, `portal`, `server`, `mock`, `prerender`, `mcp` and `create-rapidoc` are one `fixed` group: every release bumps all seven to the same version. While they are 0.x, a minor (0.2.0) is breaking and a patch is a fix or an addition; they go to 1.0.0 together.
  - `@rapidoc/embed` and each integration (`@rapidoc/hono`, `@rapidoc/starlight`) have their own semver, outside the group: integrations should not re-release with every portal release. A change to the output of its `src/core.js` is a new contract version and a breaking release.
- **Every pull request that changes a published package adds a changeset**: `npm run changeset`, pick the packages and the bump, write one changelog line in the user's terms. Changes that release nothing (docs site, tests, tooling) need none.
- **`rapidoc` source is also in `@rapidoc/prerender` and `@rapidoc/mcp`**: both bundle `packages/rapidoc/src` at build time, which Changesets can't see. A change to its templates, components or styles (prerender) or to `utils/mcp/` and `utils/arazzo/` (mcp) needs those packages in its changeset too, so the portal's pre-rendered HTML and the `rapidoc-min.js` that takes it over come from the same source.
- **The flow**: changesets merged to `master` → the workflow opens or updates the "chore: release packages" pull request (`npm run version-packages`: versions, changelogs, internal ranges, lockfile). Merging it → the workflow builds (`npm run build:packages`), runs `test:unit`, packs, publishes with npm trusted publishing (no token), and creates git tags and GitHub releases.
- **Internal ranges** are updated by `changeset version` (`updateInternalDependencies: patch`); don't edit them by hand.
