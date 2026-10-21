# AGENTS.md — `packages/rapidoc-portal` (`@rapidoc/portal`)

## 1. Package Scope & Identity
`packages/rapidoc-portal` is the core engine for **`@rapidoc/portal`**, a modern, docs-as-code developer portal framework that turns OpenAPI specifications, Markdoc, Markdown, and MDX into high-performance developer portals using the RapiDoc Web Component.

- **Package Name**: `@rapidoc/portal`
- **Module Type**: ESM (`"type": "module"`)
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
| `npm run dev` | Development server / test runner |

---

## 4. Architectural Guidelines
- Maintain strict modularity and zero runtime coupling to external databases.
- Adhere to the monorepo-wide code style rules defined in the root `AGENTS.md` (Node.js >= 22.12.0, ESM, 2 spaces, Prettier).
- Provide clean programmatic APIs exported from this package for CLI and integration use.

---

## 5. RapiDoc Static & Independent Scrolling Invariants

When implementing or modifying API documentation layouts in `@rapidoc/portal`:

1. **Strict Separation of Navigation & Content**:
   - **Never** render an internal sidebar inside `<rapi-doc>` (`show-side-nav="false"` and `show-header="false"` are strictly mandatory).
   - Generate the sidebar statically at build time using `getNavBarHtml(spec, options)` from `rapidoc/static` into the outer portal layout (`.portal-sidebar`).
2. **Independent Scrolling Shell**:
   - The root viewport must be locked (`height: 100%; max-height: 100vh; overflow: hidden`).
   - Navigation (`.portal-sidebar .nav-scroll`) and API content (`.portal-main`) must be isolated sibling scroll containers with `overflow-y: auto` and `overscroll-behavior: contain`.
3. **Decoupled Scroll Synchronization**:
   - Nav clicks scroll the main content via `targetEl.scrollIntoView()` or `rapiDocEl.scrollToPath(id)`.
   - Content scrolling syncs the sidebar by listening to `nav-active-change` events emitted by `<rapi-doc>`.
