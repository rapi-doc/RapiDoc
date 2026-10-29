# AGENTS.md — RapiDoc Monorepo

Welcome to the RapiDoc monorepo. This document establishes the foundational architecture, system boundaries, build and test workflows, and coding conventions across the repository for autonomous agents and human developers.

---

## 1. Monorepo Architecture & Directory Structure

This repository is managed as an **npm workspaces** monorepo running on **Node.js >= 22.12.0** with native **ECMAScript Modules (ESM)** (`"type": "module"`).

```text
rapidoc/
├── packages/
│   ├── rapidoc/          # Core RapiDoc Web Component library (Lit, Vite)
│   ├── rapidoc-cli/      # The `rapidoc` command (@rapidoc/cli): init, dev, build, serve, mock, validate, migrate
│   ├── rapidoc-portal/   # Developer portal framework for OpenAPI & Markdoc (@rapidoc/portal)
│   ├── rapidoc-server/   # Serves a built portal with OIDC sign-in and access rules (@rapidoc/server, `rapidoc serve`)
│   ├── rapidoc-mock/     # Mock server for the portal's APIs, with OAuth scope checks (@rapidoc/mock, `rapidoc mock`)
│   └── create-rapidoc/   # Scaffolding CLI for new portals (npm create rapidoc)
├── docs/                 # Documentation & interactive showcase site (Astro 7 + Starlight)
├── tests/
│   ├── unit/             # Node.js built-in test runner unit tests (*.test.js)
│   ├── component/        # Component-level tests
│   ├── e2e/              # End-to-end browser tests
│   ├── perf/             # Spec loading, parsing, and rendering benchmarks (playwright-core)
│   └── visual/           # Visual regression test suites
├── brand/                # RapiDoc logo SVGs for every product (light, dark, favicon) and how to use them
├── docker/               # Dockerfile and Nginx deployment assets
├── scripts/              # Monorepo build and metric utilities (e.g., capture-build-info.js, test-loader.mjs)
├── .github/              # GitHub Actions workflows (CI / GitHub Pages deployment)
├── .claude/              # Claude Code subagents (.claude/agents/) and skills (.claude/skills/)
├── eslint.config.js      # Monorepo flat ESLint configuration
├── .prettierrc           # Monorepo Prettier configuration
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
  - `rapidoc` is published to npm as a standalone, zero-runtime-dependency bundle for end users (`dist/rapidoc-min.js`).
  - Third-party runtime dependencies (e.g., `lit`, `@scalar/openapi-parser`, `marked`, `microlighter`, `github-slugger`) are bundled directly into `dist/rapidoc-min.js` via Vite.
  - Never import code from `docs/` or other sub-packages into `packages/rapidoc`.
- **Documentation Site (`docs`)**:
  - Consumes `packages/rapidoc` via npm workspaces (`"rapidoc": "*"`).
  - Aliases `rapidoc` and `~` to `../packages/rapidoc/src/` in development for instantaneous hot reloading.
  - The Astro dev server and build pipeline automatically compile `packages/rapidoc` into `rapidoc-min.js` if missing.
- **CLI & Portal (`packages/rapidoc-cli` [@rapidoc/cli], `packages/rapidoc-portal` [@rapidoc/portal])**:
  - Maintain clean boundaries. `@rapidoc/cli` (bin `rapidoc`) is the single command users run: `init`, `dev`, `build`, `validate`, `migrate`, and later tools such as linting and mocking. `@rapidoc/portal` is the docs-as-code developer portal engine and library.
  - `@rapidoc/portal` is an **optional peer** of the CLI, imported lazily: only `dev`, `build`, `migrate` and folder-wide `validate` load it, so `rapidoc init` and `rapidoc validate <spec>` work without Astro installed. Never import it at the top of the CLI.
  - `@rapidoc/server` (behind `rapidoc serve`) is the CLI's other optional peer, also imported lazily. It depends only on the build output (`dist/public/`, `dist/protected/`, `dist/rapidoc-server.json`), never on `@rapidoc/portal` or Astro; the portal writes that layout in `src/access/split-output.js`. Secrets (session key, client secret) are environment variables of the server, never config keys.
  - `rapidoc init` reuses `create-rapidoc`'s `scaffoldProject`/`findOpenApiSpecs` (`create-rapidoc/scaffold`); keep scaffolding logic only there.
  - `@rapidoc/mock` (behind `rapidoc mock`) is the CLI's third optional peer, imported lazily. It reads only spec files (the CLI passes the `apis:` from `loadConfig`), never `@rapidoc/portal` or Astro, and keeps its third-party mock libraries (openapi-backend, json-schema-faker) behind `src/engine/`.
  - Internal dependency ranges are pinned (`rapidoc ^12.0.0` in the portal, `@rapidoc/portal ^0.1.0`, `@rapidoc/server ^0.1.0` and `@rapidoc/mock ^0.1.0` as the CLI's peers), never `*`.

### Build Artifact Hygiene

- **Never commit generated build output**:
  - `packages/rapidoc/dist/`
  - `docs/dist/`
  - `docs/.astro/`
  - `node_modules/`
  - Temporary benchmark or visual regression runs
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

| Command                 | Scope              | Description                                                                            |
| :---------------------- | :----------------- | :------------------------------------------------------------------------------------- |
| `npm run build`         | Monorepo           | Sequentially builds `rapidoc` (via Vite) and `docs` (via Astro).                       |
| `npm run build:rapidoc` | `packages/rapidoc` | Builds `dist/rapidoc-min.js` and `dist/rapidoc-static-min.js` (`rapidoc/static`) with Vite. |
| `npm run build:rapidoc:dev` | `packages/rapidoc` | Builds an unminified bundle with sourcemaps and console logs intact.               |
| `npm run build:size`    | `packages/rapidoc` | Builds RapiDoc with `ANALYZE=true` generating visualizer treemap in `dist/stats.html`. |
| `npm run build:docs`    | `docs`             | Builds the Astro Starlight documentation site to `docs/dist/`.                         |
| `npm run build:demo`    | `../rapi-portal-demo` | Builds `rapidoc`, then the sibling `rapi-portal-demo` checkout with the `rapidoc` CLI into `../rapi-portal-demo/dist/`. |
| `npm run prerender:demo` | Monorepo          | Runs `scripts/prerender-demo.mjs`.                                                     |

### Testing & Benchmarking

| Command               | Target   | Runner / Details                                                                                                                                           |
| :-------------------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run test:unit`   | Monorepo | Executes all unit tests in `tests/unit/*.test.js` using Node.js native test runner (`node:test` + `node:assert`), loaded via `scripts/test-loader.mjs`.    |
| `npm run test:component` | Monorepo | Runs `tests/component/*.test.js`.                                                                                                                       |
| `npm run test:e2e`    | Monorepo | Runs `tests/e2e/*.test.js`.                                                                                                                                |
| `npm run test:visual` | Monorepo | Runs visual regression tests in `tests/visual/*.test.js`.                                                                                                  |
| `npm run test:all`    | Monorepo | Runs `test:unit`, `test:component`, `test:e2e`, and `test:visual` in sequence.                                                                             |
| `npm run test:portal` | Portal/CLI | Runs `tests/**/*.test.js` in `rapidoc-portal`, `rapidoc-cli`, `rapidoc-server`, `rapidoc-mock`, and `create-rapidoc` (serially, `--test-concurrency=1`). |
| `npm run test:parser` | Monorepo | Runs `tests/perf/benchmark.js` to measure OpenAPI spec parsing, circular ref handling, and dereferencing times across Bookstore, Stripe, and GitHub specs. |
| `npm run test:perf`   | Monorepo | Runs `tests/perf/render-benchmark.js` measuring headless browser rendering performance across Focused, View, and Read modes.                               |

### Quality & Formatting

| Command              | Scope              | Description                                                                       |
| :------------------- | :----------------- | :-------------------------------------------------------------------------------- |
| `npm run lint`       | `packages/rapidoc` | Runs ESLint (`eslint './src/**/*.{js,ts}'`) with Lit and Prettier plugins.        |
| `npm run format`     | Monorepo           | Checks code formatting against `.prettierrc` for `packages/` and `docs/src/`.     |
| `npm run format-fix` | Monorepo           | Automatically formats code using Prettier across `packages/` and `docs/src/`.     |
| `npm run analyze`    | `packages/rapidoc` | Runs `lit-analyzer src` to validate Lit component templates, bindings, and types. |

---

## 4. Coding Styles & Conventions

### Prettier & ESLint Configuration

The project adheres strictly to `.prettierrc` and `eslint.config.js`:

- **Indentation**: 2 spaces (no tabs).
- **Quotes**: Single quotes (`'`) for JS/TS; standard HTML/JSX attribute quotes.
- **Semicolons**: Always required (`semi: true`).
- **Trailing Commas**: ES5 style (`trailingComma: 'es5'`).
- **Print Width**: 140 characters.
- **ESLint Plugins**: Flat config using `@eslint/js`, `eslint-plugin-lit`, and `eslint-plugin-prettier`.
- **Console / Debugger**: `no-console` and `no-debugger` are enforced as warnings in production, and automatically stripped from the final bundle by the custom Vite esbuild transform.

### Component Design & Lit Guidelines (`packages/rapidoc`)

- Implement web components using **Lit 3** (`LitElement`, `html`, `css`).
- Use **Shadow DOM** for strict style and DOM encapsulation.
- Expose styling extension points via **CSS Shadow Parts** (`::part(...)`) and **CSS Custom Properties** (e.g. `--bg`, `--fg`, `--primary-color`).
- Keep components responsive, accessible, and fast with large OpenAPI schemas. Avoid unnecessary DOM allocations.

### Documentation & Astro Guidelines (`docs`)

- Built with **Astro 7** and **Starlight**.
- Documentation content resides in `src/content/docs/`.
- Dynamic and interactive demo pages reside in `src/pages/` and `src/pages/examples/`.
- YAML configuration for attributes and methods lives in `src/page-data/`.
- Ensure redirects in `docs/astro.config.mjs` are maintained when reorganizing routes.

---

## 5. Agent Workflow Rules

When executing tasks in this repository, follow these rules:

1. **Verify Before and After**:
   - Before modifying core parser or schema logic, run `npm run test:unit`.
   - After completing edits, run `npm run test:unit` and `npm run format-fix` to maintain code health.
2. **Respect Package Boundaries**:
   - Refer to nested `AGENTS.md` files in subdirectories for package-specific context:
     - [`packages/rapidoc/AGENTS.md`](packages/rapidoc/AGENTS.md)
     - [`docs/AGENTS.md`](docs/AGENTS.md)
     - [`packages/rapidoc-cli/AGENTS.md`](packages/rapidoc-cli/AGENTS.md)
     - [`packages/rapidoc-server/AGENTS.md`](packages/rapidoc-server/AGENTS.md)
     - [`packages/rapidoc-mock/AGENTS.md`](packages/rapidoc-mock/AGENTS.md)
     - [`packages/rapidoc-portal/AGENTS.md`](packages/rapidoc-portal/AGENTS.md)
     - [`packages/create-rapidoc/AGENTS.md`](packages/create-rapidoc/AGENTS.md)
   - After changing portal, CLI, server or mock code, run `npm run test:portal`.
3. **No Unsolicited File Deletions**:
   - Preserve existing public specs (`docs/public/specs/`)
4. **Commits and Git State**:
   - **Never run `git commit` unless explicitly instructed by the user.** Keep all working tree changes uncommitted for user review.
   - Never commit `dist/` or other build artifacts to Git.
