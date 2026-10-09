# AGENTS.md — `docs` (Documentation & Showcase)

## 1. Package Scope & Identity
`docs` is the official documentation, live interactive preview, sandbox, and theme showcase for RapiDoc.

- **Package Name**: `docs` (private workspace)
- **Framework**: [Astro 7](https://astro.build/) with [@astrojs/starlight](https://starlight.astro.build/)
- **Live Site**: `https://rapidocweb.com`
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
   - Dev middleware dynamically serves live unminified ESM directly from `packages/rapidoc/src/index.ts` at `/rapidoc/rapidoc-min.js` and `/rapidoc/rapidoc.js`.
   - Preserves all `console.*` outputs, `debugger` breakpoints, and sourcemaps with exact line numbers for effortless debugging.
   - Watches `packages/rapidoc/src/` and triggers instant browser reload upon changes without needing slow bundle recompilation.
   - Watches `src/page-data/**/*.yaml` and triggers module cache invalidation and reload upon change.
3. **Aliases**:
   - `~` resolves to `packages/rapidoc/src`
   - `~/rapidoc` resolves to `packages/rapidoc/src/rapidoc.ts`
   - `rapidoc` resolves to `packages/rapidoc/src/index.ts`

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
