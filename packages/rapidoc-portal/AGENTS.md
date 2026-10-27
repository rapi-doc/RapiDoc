# AGENTS.md — `packages/rapidoc-portal` (`@rapidoc/portal`)

## 1. Package Scope & Identity
`packages/rapidoc-portal` is the core engine for **`@rapidoc/portal`**, a modern, docs-as-code developer portal framework that turns OpenAPI specifications, Markdoc, Markdown, and MDX into high-performance developer portals using the RapiDoc Web Component.

- **Package Name**: `@rapidoc/portal`
- **Module Type**: ESM (`"type": "module"`)
- **Entry Point**: `src/index.js` (subpath exports: `./config`, `./markdoc`, `./search`, `./components`)
- **Status**: Active development across Milestones 1 to 6

---

## 2. Core Functional Responsibilities (Milestones 1–6)
1. **Strict Configuration (v2)**: Reads `rapidoc.config.yaml` (also `.yml/.json/.js/.mjs/.ts`) against the strict zod schema in `src/config/schema.js`; unknown keys fail with their path and a hint (`errors.js`). `normalizer.js` resolves `navigation` into header tabs (each documentation tab with its Starlight sidebar and the URL prefixes it covers). Redocly and Zudoku key names live only in `migrator.js` (`rapidoc migrate --from redocly|zudoku`). Get user approval before changing the config contract, then run `npm run schema` to regenerate `schema.json` (a test checks it).
2. **First-Class Markdoc**: `.markdoc` docs are synced as `.mdoc` and rendered by `@astrojs/markdoc` with `src/markdoc/astro-config.js` (Starlight's Markdoc preset + the portal tags as Starlight components in `src/markdoc/components/`; `api-operation` → `<rapi-doc-mini>`). `src/markdoc/tags.js` holds the same tags as plain HTML for the `compileMarkdoc()` API; keep both in step.
3. **Portal Layout Shell**: Delivers top navigation, collapsible sidebar navigation, breadcrumbs, and Table of Contents with scroll-spy.
4. **RapiDoc Web Component Bridge**: Mounts `<rapi-doc>` for interactive API reference viewing and embeds live operations in guides.
5. **Full-Text Client Search**: Build-time indexing of prose and OpenAPI schemas via Pagefind.
6. **SSG & Dev Engine**: Hot module reloading during development (`rapidoc dev`) and 100% static asset compilation for CDN hosting (`rapidoc build`).
7. **Sign-in and access rules**: `auth` (OpenID Connect provider, no secrets) and `access` (rules → zones) in the config. With `auth`, `buildPortal()` splits the output into `public/`, `protected/` and `rapidoc-server.json` (`src/access/split-output.js`), which `@rapidoc/server` (`rapidoc serve`) enforces. Pages stay static: the header's sign-in slot and lock icons (`components/PortalUserMenu.astro`) ask the server at runtime. Design: `design/auth-phase-1.md`.

---

## 3. Local Commands

Run these commands from `packages/rapidoc-portal`:

| Command | Purpose |
| :--- | :--- |
| `npm test` | Runs `tests/**/*.test.js` serially (`--test-concurrency=1`) |
| `npm run schema` | Regenerates `schema.json` (JSON Schema of `rapidoc.config.yaml`) from `src/config/schema.js` |
| `npm run layout:baseline` | Runs `tests/layout.test.js` and writes `tests/layout/measurements.json` plus screenshots (git-ignored) to `tests/layout/` |

From the monorepo root, `npm run test:portal` runs the portal, CLI, and `create-rapidoc` suites together.

**Layout rules** (`tests/layout.test.js`): builds `demo-api-portal`, serves it, and measures the app shell in headless Chrome (skipped if no Chrome is found) for each page kind (landing, docs, API) at 1440, 1024 and 375px wide. The same build is audited with axe-core (WCAG 2.1 A/AA; serious and critical violations fail; `<rapi-doc>` is excluded) at desktop in both themes and at 375px in dark, has a whole-visit layout-shift budget of 0.1, and the header menus and drawer are driven with the keyboard. Rules tagged `todo: { <kind>: 'Phase N' }` describe the target shell and are reported but not enforced. When a change makes one pass, remove its tag. Re-run `npm run layout:baseline` after layout changes so the `measurements.json` diff shows what moved.

---

## 4. Build Engine (`src/engine/`)

`buildPortal()` and `startDevServer()` (used by `rapidoc build` / `rapidoc dev`) share one pipeline. Full description: `README.md` → "How a build works".

| File | Role |
| :--- | :--- |
| `build-portal.js` | `buildPortal(projectDir, { outDir, keepWorkspace })`: workspace → `astro build` → always remove workspace |
| `dev-server.js` | `startDevServer(projectDir, { port, keepWorkspace })`: workspace → `astro dev`, watches docs/config/specs, cleans up on stop/SIGINT/SIGTERM |
| `temp-workspace.js` | Creates/removes the run's workspace `<project>/.rapidoc-temp/<dev\|build>-<pid>-<n>/` (node_modules symlink, `package.json`, content config, docs copy, public assets); removes folders of runs whose process has exited |
| `sync-docs.js` | Idempotent docs mirror + normalization (frontmatter title, `.md`/`.mdx` dedupe, Zudoku rewrites, component auto-imports) |
| `sync-assets.js` | Specs, `rapidoc-min.js` (throws if missing or stale — never rebuilds), `search-index.json` |
| `astro-integration.js` | Inline Astro config: Markdoc + Starlight + injected routes for `src/pages/*.astro` + virtual modules |
| `starlight-options.js` / `theme-css.js` | Config → Starlight options (sidebar: one group per documentation tab) / `styles/portal-theme.css` with tokens filled in |
| `route-middleware.js` | Starlight route middleware: keeps only the current tab's sidebar group, drops prev/next links into other tabs |
| `../access/rules.js` | Rule patterns (`*` one segment, `**` any), allow → zone id, first-match zone matcher |
| `../access/split-output.js` | After `astro build` (only with `auth`): moves non-public files to `protected/`, splits `search-index.json` and Pagefind per zone, filters the sitemap, writes `rapidoc-server.json`; fails on a rule that matches nothing and then removes the output |

**App shell**. Every page has the same frame: sticky header, optional sticky sidebar, full-width footer, page scroll. Pages Starlight does not render (catalog, API reference) use `components/PortalLayout.astro`. API reference pages are always `/apis/<id>[/<tag>]` (route `/apis/[...apiRoute]`); `/apis` redirects to `/catalog`. The home page is the project's `docs/index.*` rendered by Starlight (usually `template: splash`); without one, `/` redirects to the first tab (`pages/first-tab-redirect.astro`). Docs pages use these Starlight component overrides, set in `starlight-options.js`:
- `PortalPageFrame.astro` (`PageFrame`): sticky header, then a grid of [sticky full-height sidebar | content], then the full-width `PortalFooter`. The page scrolls; at the end the footer pushes the sidebar up. Below 50rem the sidebar is Starlight's popover, opened by the header's menu button.
- `PortalTwoColumnContent.astro` (`TwoColumnContent`): sticky "On this page" column.
- `PortalThemeProvider.astro` (`ThemeProvider`): applies `theme.mode` for visitors who have not picked a theme (same script as `PortalLayout`, from `components/theme-script.js`).
- `PortalSidebar.astro` (`Sidebar`): Starlight's sidebar, with the header links above it on narrow screens.
- `PortalHeader.astro` (`Header`): banner (`site.banner`), row 1 (logo, search, `header.links`, theme switcher), row 2 (`config.tabs`, active tab from `activeTab()` in `components/header-nav.js`). Below 50rem the tabs row is hidden and the menus list the tabs. Starlight's own `Footer` is kept for prev/next, edit link and last-updated.
- Header height is CSS-only: `--sl-nav-height` = `--portal-banner-height` + `--portal-navbar-height` + `--portal-tabs-height` (`portal-theme.css`). Keep every row fixed-height; never measure the header in JS.
- Accent colors: `--portal-primary` for fills, borders and icons; `--portal-primary-text` for text; `--portal-on-primary` for text on a primary fill; `--portal-primary-tint` behind accent text. The text variants are computed from `theme.primary` by `engine/accent-colors.js` so they pass 4.5:1; never use `--portal-primary` as a text color.
- Header menus follow the WAI-ARIA disclosure navigation pattern (trigger `aria-expanded`/`aria-controls`, no `role="menu"`); focus alone never opens a panel.
- `portal-theme.css` is unlayered, so it already beats Starlight's `@layer starlight.*` rules. Don't use `!important`.

Invariants:
- **No leftovers**: the only thing a run may leave in the project is the output folder. Never write elsewhere in the user's project or into this package.
- **No cwd coupling**: pages and components read config via `import portalConfig from 'virtual:rapidoc-portal/config'`, never from `process.cwd()`. The only `process.chdir` is in `build-portal.js`: into the workspace for the duration of `astro build` (restored in `finally`), because Astro places its prerender chunks relative to the cwd and they must resolve dependencies through the workspace's `node_modules`.
- **One workspace per run**: a run never deletes another live run's folder (dev servers and builds run side by side); dev servers also remove theirs in a process `exit` handler, because Astro's own SIGTERM handler exits before an async stop finishes.
- **Workspace location**: must stay inside the project. The OS temp folder does not work — Astro only compiles `.astro` files that share a parent folder with the root — and a folder inside `node_modules` makes Vite treat the pages as dependencies.
- **Workspace `package.json` is required**: Astro reads its dependencies to decide which packages (Starlight) to bundle for SSR.
- **Nothing protected in `public/`**: with `auth`, no text of a protected page may reach `dist/public/` (pages, search indexes, sitemap, JS). Never put protected content into a client script or the virtual config module's client imports; `tests/access.test.js` checks the demo build for leaks.
- **Specs are published at `/specs/<api id><ext>`** (`api.specUrl`), so an access rule for `/apis/<id>` also covers the spec. Use `api.specUrl`; never build spec URLs from file names.

---

## 5. Architectural Guidelines
- Maintain strict modularity and zero runtime coupling to external databases.
- Adhere to the monorepo-wide code style rules defined in the root `AGENTS.md` (Node.js >= 22.12.0, ESM, 2 spaces, Prettier).
- Provide clean programmatic APIs exported from this package for CLI and integration use.

---

## 6. API Reference Pages (RapiDoc Static + headless `<rapi-doc>`)

API pages use the same app shell as the docs (`PortalLayout.astro`; full pattern: `.claude/skills/rapidoc-static-navigation/SKILL.md`):

1. **Separate navigation and content**: never render RapiDoc's own sidebar or header (`show-side-nav="false"`, `show-header="false"`). The sidebar is static HTML from `getNavBarHtml(spec, options)` (`rapidoc/static`), in its own `.portal-sidebar.nav-bar` element inside the layout's sticky sidebar, because `getNavCss()` styles its scope element.
2. **The page scrolls**: `<rapi-doc auto-height="true">` in the normal page flow, sticky sidebar, full-width footer below. Never lock the viewport or give the content its own scroll box. The sidebar's `.nav-scroll` scrolls on its own.
3. **Sticky header offset and theme**: `html { scroll-padding-top }` (set by `PortalLayout`) is RapiDoc's scroll offset (or `scroll-offset="<px>"`); `color-scheme="auto"` follows the portal theme.
4. **Sync**: `rapiDocEl.bindNavBar(navEl)`, which keeps the active link in view inside the sidebar without scrolling the page.
5. **Bundle**: `rapidoc-min.js` is loaded by API pages only, never from the Starlight `head`.

---

## 7. Dogfood Repo Sync (`demo-api-portal`)

`demo-api-portal` is a separate git repo (sibling checkout at `../demo-api-portal`, i.e. `/Users/mrin/work/demo-api-portal`) that consumes `@rapidoc/portal` as a real user would. It must always build against the current portal code.

1. **When to sync**: any change to the user-facing contract — `rapidoc.config.yaml` structure or keys (`src/config/schema.js`, `normalizer.js`, `loader.js`, `migrator.js`), Markdoc tags or their attributes (`src/markdoc/`), docs/spec folder conventions, or `rapidoc` CLI commands and flags.
2. **What to update**: `demo-api-portal/rapidoc.config.yaml`, affected files in `demo-api-portal/docs/` and `specs/`, and its `README.md` if it documents the changed behaviour. Also update the scaffold templates in `packages/create-rapidoc` so new projects match.
3. **Verify**: run `npm run test:portal` from this monorepo — `tests/config.test.js`, `tests/engine.test.js`, `tests/markdoc.test.js`, `tests/search.test.js`, and `rapidoc-cli/tests/cli.test.js` load and build `demo-api-portal` directly (override its location with `RAPIDOC_DEMO_PORTAL_DIR`). `engine.test.js` also asserts a build leaves the demo folder unchanged.
4. **Git**: the demo repo has its own history. Never commit there unless asked; leave its changes uncommitted for review, and do not touch its generated `dist/` or a leftover `.rapidoc-temp/` by hand.
