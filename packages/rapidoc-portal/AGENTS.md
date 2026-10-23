# AGENTS.md — `packages/rapidoc-portal` (`@rapidoc/portal`)

## 1. Package Scope & Identity
`packages/rapidoc-portal` is the core engine for **`@rapidoc/portal`**, a modern, docs-as-code developer portal framework that turns OpenAPI specifications, Markdoc, Markdown, and MDX into high-performance developer portals using the RapiDoc Web Component.

- **Package Name**: `@rapidoc/portal`
- **Module Type**: ESM (`"type": "module"`)
- **Entry Point**: `src/index.js` (subpath exports: `./config`, `./markdoc`, `./search`, `./components`)
- **Status**: Active development across Milestones 1 to 6

---

## 2. Core Functional Responsibilities (Milestones 1–6)
1. **Tolerant Configuration Parser**: Reads `rapidoc.config.yaml` / `rapidoc.config.ts`, supporting Redocly and Zudoku aliases transparently (`root`/`input`, `navigation`/`sidebars`).
2. **First-Class Markdoc Processor**: Parses `.markdoc` and `.md` into safe ASTs with built-in tags (`callout`, `tabs`, `steps`, `card-grid`, `api-operation`).
3. **Portal Layout Shell**: Delivers top navigation, collapsible sidebar navigation, breadcrumbs, and Table of Contents with scroll-spy.
4. **RapiDoc Web Component Bridge**: Mounts `<rapi-doc>` for interactive API reference viewing and embeds live operations in guides.
5. **Full-Text Client Search**: Build-time indexing of prose and OpenAPI schemas via Pagefind.
6. **SSG & Dev Engine**: Hot module reloading during development (`rapidoc dev`) and 100% static asset compilation for CDN hosting (`rapidoc build`).

---

## 3. Local Commands

Run these commands from `packages/rapidoc-portal`:

| Command | Purpose |
| :--- | :--- |
| `npm test` | Runs `tests/**/*.test.js` serially (`--test-concurrency=1`) |

From the monorepo root, `npm run test:portal` runs the portal, CLI, and `create-rapidoc` suites together.

---

## 4. Build Engine (`src/engine/`)

`buildPortal()` and `startDevServer()` (used by `rapidoc build` / `rapidoc dev`) share one pipeline. Full description: `README.md` → "How a build works".

| File | Role |
| :--- | :--- |
| `build-portal.js` | `buildPortal(projectDir, { outDir, keepWorkspace })`: workspace → `astro build` → always remove workspace |
| `dev-server.js` | `startDevServer(projectDir, { port, keepWorkspace })`: workspace → `astro dev`, watches docs/config/specs, cleans up on stop/SIGINT/SIGTERM |
| `temp-workspace.js` | Creates/removes `<project>/.rapidoc-temp/` (node_modules symlink, `package.json`, content config, docs copy, public assets) |
| `sync-docs.js` | Idempotent docs mirror + normalization (frontmatter title, `.md`/`.mdx` dedupe, Zudoku rewrites, component auto-imports) |
| `sync-assets.js` | Specs, `rapidoc-min.js` (throws if missing or stale — never rebuilds), `search-index.json` |
| `astro-integration.js` | Inline Astro config: Starlight + injected routes for `src/pages/*.astro` + virtual modules |
| `starlight-options.js` / `theme-css.js` | Config → Starlight options / `styles/portal-theme.css` with tokens filled in |

Invariants:
- **No leftovers**: the only thing a run may leave in the project is the output folder. Never write elsewhere in the user's project or into this package.
- **No cwd coupling**: pages and components read config via `import portalConfig from 'virtual:rapidoc-portal/config'`, never from `process.cwd()`. The only `process.chdir` is in `build-portal.js`: into the workspace for the duration of `astro build` (restored in `finally`), because Astro places its prerender chunks relative to the cwd and they must resolve dependencies through the workspace's `node_modules`.
- **Workspace location**: must stay inside the project. The OS temp folder does not work — Astro only compiles `.astro` files that share a parent folder with the root — and a folder inside `node_modules` makes Vite treat the pages as dependencies.
- **Workspace `package.json` is required**: Astro reads its dependencies to decide which packages (Starlight) to bundle for SSR.

---

## 5. Architectural Guidelines
- Maintain strict modularity and zero runtime coupling to external databases.
- Adhere to the monorepo-wide code style rules defined in the root `AGENTS.md` (Node.js >= 22.12.0, ESM, 2 spaces, Prettier).
- Provide clean programmatic APIs exported from this package for CLI and integration use.

---

## 6. RapiDoc Static & Independent Scrolling Invariants

When implementing or modifying API documentation layouts in `@rapidoc/portal` (full worked pattern with CSS and sync script: `.claude/skills/rapidoc-static-navigation/SKILL.md`):

1. **Strict Separation of Navigation & Content**:
   - **Never** render an internal sidebar inside `<rapi-doc>` (`show-side-nav="false"` and `show-header="false"` are strictly mandatory).
   - Generate the sidebar statically at build time using `getNavBarHtml(spec, options)` from `rapidoc/static` into the outer portal layout (`.portal-sidebar`).
2. **Independent Scrolling Shell**:
   - The root viewport must be locked (`height: 100%; max-height: 100vh; overflow: hidden`).
   - Navigation (`.portal-sidebar .nav-scroll`) and API content (`.portal-main`) must be isolated sibling scroll containers with `overflow-y: auto` and `overscroll-behavior: contain`.
3. **Decoupled Scroll Synchronization**:
   - Nav clicks scroll the main content via `targetEl.scrollIntoView()` or `rapiDocEl.scrollToPath(id)`.
   - Content scrolling syncs the sidebar by listening to `nav-active-change` events emitted by `<rapi-doc>`.

---

## 7. Dogfood Repo Sync (`demo-api-portal`)

`demo-api-portal` is a separate git repo (sibling checkout at `../demo-api-portal`, i.e. `/Users/mrin/work/demo-api-portal`) that consumes `@rapidoc/portal` as a real user would. It must always build against the current portal code.

1. **When to sync**: any change to the user-facing contract — `rapidoc.config.yaml` structure or keys (`src/config/schema.js`, `normalizer.js`, `loader.js`, `migrator.js`), Markdoc tags or their attributes (`src/markdoc/`), docs/spec folder conventions, or `rapidoc` CLI commands and flags.
2. **What to update**: `demo-api-portal/rapidoc.config.yaml`, affected files in `demo-api-portal/docs/` and `specs/`, and its `README.md` if it documents the changed behaviour. Also update the scaffold templates in `packages/create-rapidoc` so new projects match.
3. **Verify**: run `npm run test:portal` from this monorepo — `tests/config.test.js`, `tests/engine.test.js`, `tests/markdoc.test.js`, `tests/search.test.js`, and `rapidoc-cli/tests/cli.test.js` load and build `demo-api-portal` directly (override its location with `RAPIDOC_DEMO_PORTAL_DIR`). `engine.test.js` also asserts a build leaves the demo folder unchanged.
4. **Git**: the demo repo has its own history. Never commit there unless asked; leave its changes uncommitted for review, and do not touch its generated `dist/` or a leftover `.rapidoc-temp/` by hand.
