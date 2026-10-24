# @rapidoc/portal

A docs-as-code developer portal engine. Point it at a folder of OpenAPI specs and Markdown / MDX / Markdoc guides, describe the site in `rapidoc.config.yaml`, and it produces a static portal:

- **Home page** from `docs/index.md` / `.mdx` / `.markdoc` (without one, `/` opens the first tab)
- **API catalog** (`/catalog`) grouped by category
- **Interactive API reference** for each spec, rendered by the [RapiDoc](../rapidoc) web component, with a static sidebar that stays in view while the page scrolls
- **Guides** (`/docs/...`) rendered by [Astro Starlight](https://starlight.astro.build/)
- **Full-text search** across guides and API operations

You normally use it through the `rapidoc` CLI (`@rapidoc/cli`); this package is the engine behind `rapidoc dev` and `rapidoc build`.

---

## Project layout

```text
my-portal/
├── rapidoc.config.yaml     # Site, header, navigation tabs, theme, APIs
├── public/                 # Static files served from / (logo, favicon, images)
├── specs/                  # OpenAPI 3.0 / 3.1 / Swagger 2.0 files (YAML or JSON)
│   └── orders.yaml
└── docs/                   # Guides: .md, .mdx, .markdoc (sub-folders become URL segments)
    ├── index.markdoc       # the home page (optional)
    ├── getting-started.md
    └── guides/
        └── checkout.mdx
```

Start one with `npm create rapidoc@latest my-portal`. The `demo-api-portal` repository (checked out next to this monorepo) is the full reference project and is what this repo's tests build.

---

## Configuration (`rapidoc.config.yaml`)

The header has two rows. Row 1 holds the logo, the search, `header.links` and the theme switcher. Row 2 has one tab per `navigation` entry, and each documentation tab has its own sidebar. On narrow screens both rows collapse into the menu.

Conventions: `label` is the text of anything clickable, `href` is any URL, and `items` are children (dropdown items, mega-menu links, sidebar groups). A navigation item's kind comes from its keys: `slug` (or a plain string), `href`, `items`, `autogenerate`, `api` or `catalog`.

The schema is strict: an unknown key fails the build with its path, e.g. `navigation[0].items[2]: unknown key "path" (use href (links) or slug (doc pages))`. Add the comment on the first line below for autocomplete in editors (the JSON Schema ships as `@rapidoc/portal/schema.json`). The engine also reads `rapidoc.config.{yml,json,js,mjs,ts}`.

```yaml
# yaml-language-server: $schema=./node_modules/@rapidoc/portal/schema.json
site:
  title: Cosmo Cargo Inc.
  description: Interstellar shipping APIs.
  url: https://cosmocargo.dev # canonical URLs and sitemap
  logo:
    src: /logo.svg # in public/; or { light: ..., dark: ... }
    text: COSMO CARGO # wordmark next to the image
  favicon: /favicon.svg
  banner: # announcement bar above the header
    message: Inter-galactic shipping is live!
    href: /docs/shipping-process
    dismissible: true
    background: '#f76b39'
    color: '#000000'

theme:
  primary: '#f76b39' # accent color, also used by the API reference
  mode: auto # auto | dark | light, until the visitor picks one
  fonts: # a family alone loads from Google Fonts (weights 400-700)
    sans: { family: Inter }
    mono: { family: JetBrains Mono, url: /fonts/mono.css } # url: another CDN or a CSS file in public/

header: # row 1, right of the search
  themeSwitcher: true
  links:
    - label: Solutions
      items: # dropdown; an icon or description makes it a mega-menu
        - label: Tracking
          icon: satellite
          description: Real-time tracking
          href: /docs/tracking
          items: [{ label: Webhooks, icon: server, href: /docs/webhooks }]
    - label: Login
      href: /login
      style: button # link (default) | button | primary

navigation: # row 2: one tab per entry
  - label: Documentation
    icon: book
    items: # this tab's sidebar
      - getting-started # doc page (path in docs/, no extension); label = page title
      - label: Shipping
        items:
          - guides/first-shipment
          - { label: Ship States, href: /docs/ship-states }
      - label: Support
        collapsed: true
        autogenerate: support # every page in docs/support/
  - label: Shipments
    icon: code
    api: shipments # the API's reference page
  - label: API Catalog
    icon: grid
    catalog: true # /catalog, APIs grouped by category
  - label: Blog
    href: https://example.com/blog

apis:
  - id: shipments # reference page /apis/shipments; also used by `api:` and {% api-operation spec="..." %}
    spec: ./specs/shipments.json # file or URL
    category: Core # catalog group (default General)
    # title, description               # default: info.title / info.description of the spec

docs:
  dir: ./docs # default ./docs
  toc: { minHeadingLevel: 2, maxHeadingLevel: 3 } # or false
  editUrl: https://github.com/acme/portal/edit/main/docs/ # adds "Edit page" links

footer: # or false
  cta: # call-to-action band at the top of the footer
    title: Ready to ship?
    description: Book your first shipment in minutes.
    links: # up to 3; the first is a filled button unless style says otherwise
      - { label: Get started, href: /docs/guides/first-shipment }
      - { label: Contact sales, href: /contact, style: button } # primary | button
  newsletter: # email sign-up under the footer logo
    action: https://example.com/subscribe # your newsletter service's form endpoint (POST)
    field: EMAIL # name of the email field it expects (default email)
    title: Newsletter # default; also description, button (default Subscribe)
  columns: [{ title: Company, links: [{ label: About, href: /about }] }]
  social: [{ icon: github, href: https://github.com/acme }] # github, x, discord, linkedin, youtube
  copyright: © 2026 Cosmo Cargo, Inc.
  branding: true # "Powered by RapiDoc"

rapidoc: # <rapi-doc> attributes for the API reference pages
  render-style: read
  schema-style: tree

search: true
redirects:
  - { from: /old-page, to: /docs/new-page }
```

Every API reference page is `/apis/<id>` (with one page per tag below it), and `/apis` redirects to the catalog. To keep an older URL working, add a `redirects` entry; `rapidoc migrate` does this for APIs that had a custom `path`. Docs pages in no tab's sidebar belong to the first documentation tab; APIs without a tab of their own belong to the catalog tab. The portal sets some `<rapi-doc>` attributes itself (`spec-url`, `show-header`, `show-side-nav`, `auto-height`, `update-route`, `goto-path`, `color-scheme`, `primary-color`); setting them under `rapidoc:` is an error that names the key to use instead.

Text in the accent color is derived from `theme.primary` at build time so that it keeps WCAG AA contrast (4.5:1) in both themes, and text on accent-filled buttons is black or white, whichever reads better.

The schema lives in [`src/config/schema.js`](src/config/schema.js). After changing it, run `npm run schema` to regenerate `schema.json`.

### Migrating

`rapidoc migrate --from redocly|zudoku` writes a `rapidoc.config.yaml` from a Redocly project (`redocly.yaml` + `sidebars.yaml`) or a Zudoku config, and lists anything the conversion could not resolve. Redocly's sidebars become a Documentation tab, its APIs an API Catalog tab, and `theme.openapi` the theme and `rapidoc:` attributes; Zudoku's top-level navigation items are the tabs. Only the migrator knows Redocly's and Zudoku's key names.

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
2. **Create a temporary workspace** at `<project>/.rapidoc-temp/`. It holds only what Astro needs on disk: a normalized copy of `docs/` (`docs/index.*` becomes the home page), the project's `public/` folder, the specs, the `rapidoc-min.js` bundle and the search index ([`src/engine/temp-workspace.js`](src/engine/temp-workspace.js), [`sync-docs.js`](src/engine/sync-docs.js), [`sync-assets.js`](src/engine/sync-assets.js)).
3. **Run Astro + Starlight** with an inline config. The portal pages ([`src/pages/`](src/pages/)) and components ([`src/components/`](src/components/)) come straight from this package; they read the config and theme through the virtual modules `virtual:rapidoc-portal/config` and `virtual:rapidoc-portal/theme.css` ([`src/engine/astro-integration.js`](src/engine/astro-integration.js)).
4. **Write the static site** to `<project>/dist/` (or `--outDir`).
5. **Delete `.rapidoc-temp/`**, even when the build fails. Your project folder ends up exactly as it was, plus `dist/`.

`rapidoc dev` does steps 1–3 and serves the site on `http://localhost:4321`. It watches the project: guide edits appear immediately; changes to `rapidoc.config.yaml` or a spec restart the server. `.rapidoc-temp/` is removed when the server stops (including Ctrl+C).

Add `.rapidoc-temp/` to your `.gitignore` in case a run is killed before it can clean up (projects created with `create-rapidoc` already do).

> **Why not the OS temp folder?** Astro only compiles `.astro` files (Starlight's and this package's) that share a parent folder with the site root, so the workspace has to live next to your project.

`rapidoc dev` and `rapidoc build` warn about operations without an `operationId`: their links (`/apis/<id>/<tag>#<operation>`) are built from the summary, so they change when the summary is edited. Every operation can also be linked by its method and path (`#get-orders-orderid`), which only changes with the endpoint.

### Validating specs

`rapidoc validate` checks every local spec in `apis:` against the OpenAPI schema (relative `$ref`s to other files resolve), prints the same `operationId` warnings, and exits with code 1 when a spec has errors, so it can gate CI. `rapidoc validate <file>` checks a single spec. Projects created with `create-rapidoc` have it as `npm run validate`.

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

Other exports: config helpers (`normalizeConfig`, `migrateConfig`, `RapidocConfigSchema`), Markdoc (`compileMarkdoc`, `markdocTags`), search (`buildSearchIndex`, `searchRecords`), and spec checks (`checkPortalSpecs`, `checkApiSpec`).

---

## Source layout

```text
src/
├── config/        Strict schema (schema.js → schema.json), errors, loader, normalizer (tabs, sidebars), migrator (Redocly/Zudoku)
├── engine/
│   ├── build-portal.js        buildPortal(): workspace → astro build → cleanup
│   ├── dev-server.js          startDevServer(): workspace → astro dev → watch → cleanup
│   ├── temp-workspace.js      Create / remove <project>/.rapidoc-temp/
│   ├── sync-docs.js           Copy + normalize docs into the workspace
│   ├── sync-assets.js         Specs, rapidoc-min.js (fails if stale), search index
│   ├── astro-integration.js   Inline Astro config, injected routes, virtual modules
│   ├── starlight-options.js   Config → Starlight options and sidebar (one group per documentation tab)
│   ├── route-middleware.js    Shows the current tab's sidebar group; prev/next stay inside the tab
│   └── theme-css.js           Renders styles/portal-theme.css for the config
├── pages/         catalog, api-reference, first-tab-redirect (.astro)
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
