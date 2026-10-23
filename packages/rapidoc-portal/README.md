# @rapidoc/portal

A docs-as-code developer portal engine. Point it at a folder of OpenAPI specs and Markdown / MDX / Markdoc guides, describe the site in `rapidoc.config.yaml`, and it produces a static portal:

- **Home page** introducing the portal and its APIs
- **API catalog** (`/catalog`) grouped by category
- **Interactive API reference** for each spec, rendered by the [RapiDoc](../rapidoc) web component, with a static sidebar that stays in view while the page scrolls
- **Guides** (`/docs/...`) rendered by [Astro Starlight](https://starlight.astro.build/)
- **Full-text search** across guides and API operations

You normally use it through the `rapidoc` CLI (`@rapidoc/cli`); this package is the engine behind `rapidoc dev` and `rapidoc build`.

---

## Project layout

```text
my-portal/
├── rapidoc.config.yaml     # Site, APIs, navigation, theme
├── specs/                  # OpenAPI 3.0 / 3.1 / Swagger 2.0 files (YAML or JSON)
│   └── orders.yaml
└── docs/                   # Guides: .md, .mdx, .markdoc (sub-folders become URL segments)
    ├── getting-started.md
    └── guides/
        └── checkout.mdx
```

Start one with `npm create rapidoc@latest my-portal`. The `demo-api-portal` repository (checked out next to this monorepo) is the full reference project and is what this repo's tests build.

---

## Configuration (`rapidoc.config.yaml`)

The engine also accepts `rapidoc.config.{yml,json,js,mjs,ts}`, and reads Redocly (`redocly.yaml`) and Zudoku (`zudoku.config.*`) configs as fallbacks.

```yaml
site:
  title: Cosmo Cargo Inc.
  description: Interstellar shipping APIs.
  logo: /assets/logo.svg            # or { light, dark, alt, href }
  announcement:                     # optional banner
    text: Inter-galactic shipping is live!
    link: /docs/shipping-process
  headerLinks:                      # top navigation; `items` makes a dropdown
    - label: Documentation
      href: /docs/documentation
    - label: API Catalog
      href: /catalog
  footer:
    columns: [{ title: Company, links: [{ label: About, href: /about }] }]
    social: [{ icon: github, href: https://github.com/acme }]

apis:                               # list (Zudoku style) or map (Redocly style)
  - id: shipments
    title: Shipment API
    root: ./specs/shipments.json    # also accepted: input, spec
    path: /apis/shipments           # URL of the reference page
    category: Core                  # catalog grouping

docs:
  dir: ./docs                       # default ./docs

navigation:                         # guide sidebar (alias: sidebars)
  - title: Getting Started
    items:
      - label: Introduction
        path: /docs/getting-started

rapidoc:                            # reference-page options currently honored:
  primary-color: "#f76b39"          # portal accent color
  color-scheme: dark                # initial color scheme of reference pages
  theme: amber                      # RapiDoc theme preset

theme:
  font:
    name: Inter
    url: https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap
    monoName: JetBrains Mono        # optional, with monoUrl
```

The full, validated schema lives in [`src/config/schema.js`](src/config/schema.js).

---

## Writing guides

- **Markdown (`.md`)**: a first `# Heading` becomes the page title when there's no frontmatter `title`.
- **MDX (`.mdx`)**: portal components can be used without importing them: `Callout`, `Card` (+ `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`), `Badge`, `Button`, `Link`, `Steps`, `Tabs`, `TabItem`, `OpenPlaygroundButton`. Starlight components (`Aside`, `CardGrid`, `LinkCard`, `FileTree`, ...) are exported from `@rapidoc/portal/components`.
- **Markdoc (`.markdoc`)**: rendered by Astro's Markdoc integration with Starlight's components, so headings, the table of contents and code blocks work as in Markdown. Tags:
  - `{% callout type="info|tip|warning|danger" title="..." %}`, `{% tabs %}{% tab name="..." %}`, `{% steps %}{% step title="..." %}`, `{% card-grid %}{% card title="..." icon="..." href="..." %}`, `{% badge text="..." variant="..." /%}`. Card icons are [Starlight icon names](https://starlight.astro.build/reference/icons/).
  - `{% api-operation spec="<api id>" path="/shipments" method="post" title="..." /%}` embeds one live, interactive operation (`<rapi-doc-mini>`). `spec` is the `id` of an entry in `apis:`; an unknown id shows a notice on the page and a build warning. Pages with an embed load the RapiDoc bundle; other docs pages don't.
  - Starlight's own Markdoc tags (`aside`, `tabitem`, `cardgrid`, `linkcard`, `filetree`, ...) work too.
- If both `page.md` and `page.mdx` exist, the `.mdx` one is used.
- Zudoku imports (`zudoku/ui/...`) and `<Stepper>` are rewritten automatically, so migrated docs work as-is.

---

## How a build works

`rapidoc build` (or `buildPortal()`) runs these steps:

1. **Load and validate** `rapidoc.config.yaml` ([`src/config/`](src/config/)).
2. **Create a temporary workspace** at `<project>/.rapidoc-temp/`. It holds only what Astro needs on disk: a normalized copy of `docs/`, the specs, the `rapidoc-min.js` bundle and the search index ([`src/engine/temp-workspace.js`](src/engine/temp-workspace.js), [`sync-docs.js`](src/engine/sync-docs.js), [`sync-assets.js`](src/engine/sync-assets.js)).
3. **Run Astro + Starlight** with an inline config. The portal pages ([`src/pages/`](src/pages/)) and components ([`src/components/`](src/components/)) come straight from this package; they read the config and theme through the virtual modules `virtual:rapidoc-portal/config` and `virtual:rapidoc-portal/theme.css` ([`src/engine/astro-integration.js`](src/engine/astro-integration.js)).
4. **Write the static site** to `<project>/dist/` (or `--outDir`).
5. **Delete `.rapidoc-temp/`**, even when the build fails. Your project folder ends up exactly as it was, plus `dist/`.

`rapidoc dev` does steps 1–3 and serves the site on `http://localhost:4321`. It watches the project: guide edits appear immediately; changes to `rapidoc.config.yaml` or a spec restart the server. `.rapidoc-temp/` is removed when the server stops (including Ctrl+C).

Add `.rapidoc-temp/` to your `.gitignore` in case a run is killed before it can clean up (projects created with `create-rapidoc` already do).

> **Why not the OS temp folder?** Astro only compiles `.astro` files (Starlight's and this package's) that share a parent folder with the site root, so the workspace has to live next to your project.

---

## Programmatic API

```js
import { buildPortal, startDevServer, loadConfig } from '@rapidoc/portal';

const result = await buildPortal('./my-portal', { outDir: 'dist' });
// { success, apisCount, outDir, durationMs }

const server = await startDevServer('./my-portal', { port: 4321 });
await server.stop(); // stops Astro and removes .rapidoc-temp/

const { config } = await loadConfig('./my-portal'); // normalized config
```

Both `buildPortal` and `startDevServer` accept `keepWorkspace: true` (CLI: `--debug`) to leave `.rapidoc-temp/` in place for inspecting the generated Astro project.

Other exports: config helpers (`normalizeConfig`, `migrateConfig`, `RapidocConfigSchema`), Markdoc (`compileMarkdoc`, `markdocTags`), and search (`buildSearchIndex`, `searchRecords`).

---

## Source layout

```text
src/
├── config/        Config loading, normalization, schema, Redocly/Zudoku migration
├── engine/
│   ├── build-portal.js        buildPortal(): workspace → astro build → cleanup
│   ├── dev-server.js          startDevServer(): workspace → astro dev → watch → cleanup
│   ├── temp-workspace.js      Create / remove <project>/.rapidoc-temp/
│   ├── sync-docs.js           Copy + normalize docs into the workspace
│   ├── sync-assets.js         Specs, rapidoc-min.js (fails if stale), search index
│   ├── astro-integration.js   Inline Astro config, injected routes, virtual modules
│   ├── starlight-options.js   Config → Starlight options and sidebar
│   └── theme-css.js           Renders styles/portal-theme.css for the config
├── pages/         home, catalog, api-reference, docs-index-redirect (.astro)
├── components/    Portal header/footer/sidebar/search and MDX components
├── styles/        portal-theme.css
├── markdoc/       Markdoc tags, nodes, compiler
└── search/        Search index builder
```

## Development (in the RapiDoc monorepo)

```bash
npm run build:rapidoc   # the engine refuses a missing or stale rapidoc-min.js
npm run test:portal     # portal, CLI and create-rapidoc tests (builds rapidoc first)
```

The tests build the sibling `../demo-api-portal` checkout; set `RAPIDOC_DEMO_PORTAL_DIR` to use another location.
