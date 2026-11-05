# AGENTS.md — `docs` (Documentation & Showcase)

## 1. Package Scope & Identity
`docs` is the official documentation, live interactive preview, sandbox, and theme showcase for RapiDoc.

- **Package Name**: `docs` (private workspace)
- **Framework**: [Astro 7](https://astro.build/) with [@astrojs/starlight](https://starlight.astro.build/)
- **Live Site**: `https://rapidocui.com`
- **Default Dev Port**: `4321` (`http://localhost:4321`)
- **Build Output**: `docs/dist/`

---

## 2. Architecture & Deep Integration

### Astro + Starlight Setup
- **Starlight Config**: Defined in `docs/astro.config.mjs`. Includes custom head scripts (Google Analytics `GTAG_ID`), customized sidebar groupings, and disabled 404 route handling for SPA fallback.
- **Component Overrides**:
  - `Header` -> `src/components/DocsHeader.astro`
  - `ThemeProvider` -> `src/components/ForceDarkTheme.astro`
  - `ThemeSelect` -> `src/components/EmptyComponent.astro`
- **Global Styles**: `src/styles/starlight-custom.css` (custom dark mode, high-contrast recipes, and layout polish).

### Automatic Rapidoc Build & Watch Pipeline
The `docs/astro.config.mjs` integrates Vite plugins that bridge `docs` and `packages/rapidoc`:
1. **Auto-Build on Start/Build (`build-rapidoc`)**:
   - Checks if `packages/rapidoc/dist/rapidoc-min.js` exists. If missing, triggers a Vite build of `packages/rapidoc`.
   - Copies `rapidoc-min.js` into `docs/dist/rapidoc/` and `docs/generated-docs/rapidoc/`.
2. **Live Unminified Source in Dev (`serve-rapidoc-in-dev`)**:
   - Dev middleware dynamically serves live unminified ESM directly from `packages/rapidoc/src/index.js` at `/rapidoc/rapidoc-min.js` and `/rapidoc/rapidoc.js`.
   - Preserves all `console.*` outputs, `debugger` breakpoints, and sourcemaps with exact line numbers for effortless debugging.
   - Watches `packages/rapidoc/src/` and triggers instant browser reload upon changes without needing slow bundle recompilation.
   - Watches `src/page-data/**/*.yaml` and triggers module cache invalidation and reload upon change.
3. **Aliases**:
   - `~` resolves to `packages/rapidoc/src`
   - `~/rapidoc` resolves to `packages/rapidoc/src/rapidoc.js`
   - `rapidoc` resolves to `packages/rapidoc/src/index.js`
   - `@rapidoc/prerender` resolves to `packages/rapidoc-prerender/src/index.js` (the prerender guide renders with it at build time)

---

## 3. Local Commands

Run these commands from `docs` (or from the monorepo root using `--workspace=docs`):

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Runs `astro dev --force` on `http://localhost:4321` with automatic RapiDoc rebuilds |
| `npm run stop` | Stops the running dev server or terminates background astro processes |
| `npm run build` | Builds the production static site into `docs/dist/` |
| `npm run preview` | Previews the built static site |

---

## 4. Directory Structure & Key Files

```text
docs/
├── src/
│   ├── assets/              # Logos, icons, and static graphics
│   ├── components/          # Astro & Starlight component overrides (DocsHeader, etc.)
│   ├── content/
│   │   └── docs/            # Starlight Markdown/MDX documentation pages
│   ├── content.config.ts    # Content collection schema loader
│   ├── layouts/             # Astro page layouts (e.g., example, full-screen, showcase)
│   ├── page-data/           # YAML data files for attributes, methods, slots, and events
│   ├── pages/
│   │   ├── examples/        # Dedicated theme, contrast, and feature demo pages
│   │   ├── sandbox.astro    # Interactive API sandbox
│   │   └── index.astro      # Custom landing page
│   ├── styles/              # Starlight CSS overrides and custom themes
│   └── utils/               # Helpers (e.g., googleAnalytics.ts)
├── public/
│   └── specs/               # Curated OpenAPI specs (petstore, large-spec, etc.)
├── astro.config.mjs         # Astro & Vite configuration and dev server middleware
└── package.json             # Workspace dependencies
```

---

## 5. Development Guidelines & Conventions

1. **Routing & Redirects**:
   - Maintain route redirects in `docs/astro.config.mjs` (e.g., `/mock-server` -> `/guides/mock`, `/styling` -> `/guides/theme`).
   - If relocating an existing documentation page, ensure a redirect is added.
2. **Page Aesthetics & Theming**:
   - The documentation and example pages are user-facing showcases for RapiDoc's capabilities.
   - Follow the design system rules in `starlight-custom.css`.
   - Maintain high contrast, responsive viewports, and clean UI aesthetics on all example pages.
3. **Spec Files**:
   - Store sample OpenAPI specifications in `docs/public/specs/`.
   - Ensure YAML/JSON specs used in benchmarks or live demos are valid OpenAPI 3.0 or 3.1 documents.
4. **Google Analytics**:
   - Google Analytics is initialized via `GTAG_ID` in `src/utils/googleAnalytics.ts`. Avoid hardcoding measurement IDs in individual pages.

---

## 6. Site Invariants

Rules that cross folder boundaries and are not visible from any single file. Check the code when
one of them stops being true, and update this list in the same change.

1. **Generated files in `src/page-data/`**: `rapidoc-build-info.{json,yaml}` are written by
   `scripts/capture-build-info.js`, which the `build` scripts of `rapidoc`, `@rapidoc/prerender` and
   `@rapidoc/mcp` run last (or `npm run build-info`). It records rapidoc's version, the size of
   `rapidoc-min.js` (`bundle`, which the pages print) and, under `packages`, every publishable
   package's `dist/*.js` sizes and `npm pack --dry-run` sizes (`RapiDocBuildInfo` in
   `rapidoc-build-info.ts`); `performance-benchmarks.yaml`
   is written by `tests/perf/benchmark.js` (sets `operations` per row) and
   `tests/perf/render-benchmark.js` (rebuilds every row from its `TEST_SPECS` and `specMeta`,
   dropping other rows and fields). Never hand-edit them; they, and the tracked
   `docs/generated-docs/rapidoc/rapidoc-min.js`, show as modified after those runs. The
   `build-rapidoc` plugin rebuilds the bundle only when `packages/rapidoc/dist/rapidoc-min.js` is
   missing, so run `npm run build:rapidoc` first when the component changed.
2. **Page data loaders**: each `src/page-data/*.ts` loads its sibling YAML with `readDataYaml`
   (resolved from `process.cwd()`, trying `src/page-data/` then `docs/src/page-data/`, throwing
   otherwise) and casts it without validation, so a wrong shape fails where a page reads it, not at
   import. `example-list.ts` and `tests.ts` are also read by `layouts/ExampleLayout.astro` and
   `utils/pageMeta.ts`. An entry with `hidden: true` is left out of `/api` (every section) and
   `/tests`.
3. **Page metadata and spec URLs** (`layouts/ExampleLayout.astro`, `utils/pageMeta.ts`,
   `utils/getSpecUrl.ts`): the slug is the last path segment (or the one before `index`);
   `isTestPath` decides test versus example for both the metadata and the spec folder. Test pages
   take title, description and `validates` from the `basic` and `advanced` sections of
   `tests.yaml`; example pages match an `href` in `example-list.yaml` that equals the path or ends
   with `/<slug>`, walking groups in order (top-level item, then its `subExamples`); page props win
   over both. `getSpecUrl` maps the slug to `/specs/<slug>.yaml` or `/specs-test/<slug>.yaml`
   unless `exampleToSpecMap` / `testToSpecMap` says otherwise, and does not check that the file
   exists: a missing spec builds fine and breaks in the browser.
4. **Controller panel (tuner)**: it renders when `showController` is `true`, or a `preset` other
   than `none` / `[]`, or a non-empty `controls` is given, and never with `showController={false}`.
   With preset `auto` (or none) and no `controls`, the whole preset list is replaced by the test's
   `validates` list, else `['minimal']`. `TestCaseLayout` defaults `autoRenderRapiDoc`,
   `showController` and `preset=['auto']` on. The tuner targets `rapidocProps.id || 'thedoc'` even
   when the page writes its own `<rapi-doc>`, so keep that id. Unknown preset names are skipped
   silently (`components/controller-registry.ts:resolveControlKeys`).
5. **Routes**: every `.md` / `.astro` under `src/pages/` is a route unless its name starts with
   `_`. Moving a page needs a redirect in `astro.config.mjs` and an update to whatever links it:
   `example-list.yaml`, `tests.yaml`, the `guides` array in `pages/guides/index.astro`,
   `page-data/nav.ts` for top-level routes, or the Starlight `sidebar` slug for an MDX page.
   `pages/sandbox.astro` is the one page outside `GlobalLayout`: it writes its own head, analytics
   and bundle tag, so the SEO rules in `GlobalLayout` do not apply to it.
6. **`/api` anchors**: attribute, event and extension rows use the bare name as id; method rows
   replace characters outside `[A-Za-z0-9_-]` with `-`; slot rows use `slot-<sanitized name>`;
   group ids come from `github-slugger`. Deep links elsewhere depend on these forms.
7. **Browser side effects worth knowing**: every page, Starlight `/docs/` pages included, loads
   Google Analytics; `components/ForceDarkTheme.astro` writes `starlight-theme=dark` to
   `localStorage` on every `/docs/` page; the tuners persist UI state in `localStorage` and
   `sessionStorage`; `pages/guides/mock.astro`'s testbed script calls `fetch` against the spec's
   `reqres.in` server and relies on the component's mock interception; `pages/guides/mini.astro`
   points a live `<rapi-doc-mini>` at a missing spec on purpose to show the error state.
