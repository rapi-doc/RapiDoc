# @rapidoc/portal

A docs-as-code developer portal engine. Point it at a folder of OpenAPI specs and Markdown / MDX / Markdoc guides, describe the site in `rapidoc.config.yaml`, and it produces a static portal:

- **Home page** from `docs/index.md` / `.mdx` / `.markdoc` (without one, `/` opens the first tab)
- **API catalog** (`/catalog`) grouped by category
- **Interactive API reference** for each spec, rendered by the [RapiDoc](../rapidoc) web component, with a static sidebar that stays in view while the page scrolls
- **Guides** (`/docs/...`) rendered by [Astro Starlight](https://starlight.astro.build/)
- **Full-text search** across guides and API operations

You normally use it through the `rapidoc` CLI (`@rapidoc/cli`); this package is the engine behind `rapidoc dev` and `rapidoc build`. Install both in a portal project (`npm install -D @rapidoc/cli @rapidoc/portal`): the CLI lists this package as an optional peer and loads it only for portal commands.

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

Start one with `npm create rapidoc@latest my-portal`, or `npx rapidoc init` in a repo that already has OpenAPI files. The `rapi-portal-demo` repository (checked out next to this monorepo) is the full reference project and is what this repo's tests build.

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
  url: https://cosmocargo.dev # canonical URLs and sitemap; a path (https://acme.com/developers) is where the portal is served
  logo:
    src: /logo.svg # in public/; or { light: ..., dark: ... }
    text: COSMO CARGO # wordmark next to the image
  favicon: /favicon.svg
  image: /social-card.png # preview image for shared links (og:image); needs url; 1200 x 630
  titleTemplate: '%s · Cosmo Cargo' # %s is the page title (default '%s | <title>')
  noindex: false # true: a robots noindex tag on every page, a robots.txt that disallows all, no sitemap
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
  css: ./styles/portal.css # or a list; loaded after the portal's own styles

head: # tags added to the <head> of every page
  - script: { src: https://plausible.io/js/script.js, defer: true, data-domain: cosmocargo.dev }
  - script: window.dataLayer = window.dataLayer || []; # a string is an inline script
  - meta: { name: google-site-verification, content: abc123 }
  - link: { rel: preconnect, href: https://api.cosmocargo.dev }

header: # row 1, right of the search
  themeSwitcher: true
  links:
    - label: Solutions
      items: # dropdown; an icon or description makes it a mega-menu
        - label: Tracking
          icon: globe # any Phosphor icon name: https://phosphoricons.com
          description: Real-time tracking
          href: /docs/tracking
          items: [{ label: Webhooks, icon: webhooks-logo, href: /docs/webhooks }]
    - label: Login
      href: /login
      style: button # link (default) | button | primary

navigation: # row 2: one tab per entry
  - label: Documentation
    icon: book
    items: # this tab's sidebar
      - getting-started # doc page (path in docs/, no extension); label = page title
      - label: Shipping
        icon: truck # any sidebar item can have an icon
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
    icon: squares-four
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
llms: # on by default; false turns it off
  description: Interstellar shipping APIs. # top of /llms.txt (default site.description)
  pageActions: [copy, markdown, chatgpt, claude] # buttons by each docs page title; false hides them
redirects:
  - { from: /old-page, to: /docs/new-page }
```

Every API reference page is `/apis/<id>` (with one page per tag below it), and `/apis` redirects to the catalog. An API with `versions:` instead of `spec:` has one spec per version: the first at `/apis/<id>`, the others at `/apis/<id>/<version>`, with a version picker in the API sidebar (`design/api-versioning.md`). To keep an older URL working, add a `redirects` entry; `rapidoc migrate` does this for APIs that had a custom `path`. Docs pages in no tab's sidebar belong to the first documentation tab; APIs without a tab of their own belong to the catalog tab. The portal sets some `<rapi-doc>` attributes itself (`spec-url`, `show-header`, `show-side-nav`, `auto-height`, `update-route`, `goto-path`, `color-scheme`, `primary-color`); setting them under `rapidoc:` is an error that names the key to use instead.

**Served under a path.** When `site.url` has a path (`https://acme.com/developers`), every page is under it. Paths in the config and in docs pages stay relative to the portal (`/docs/intro`); links get the path when they are rendered: Markdown, MDX and Markdoc links and images, `href`/`src` in raw HTML and MDX JSX (`<img src="/a.png">`), the portal's components, and Starlight's hero buttons. Paths built in a JSX expression (`src={...}`) are left as written. `rapidoc serve` serves the build under the same path, and the OIDC callback becomes `<site.url>/_rapidoc/auth/callback`. Behind a proxy that strips part of the path, tell the server where requests arrive: `rapidoc serve dist --mount-path /developers` (or `RAPIDOC_MOUNT_PATH`); links keep the full path (`design/config-batch-1.md`).

**LLM output.** Each docs page is also published as Markdown at `/docs/<page>.md` (`/index.md` for the home page): frontmatter removed, Markdoc tags and the portal's MDX components turned into plain Markdown (callouts into quotes, `{% api-operation %}` into the method, path and a link to the API page). `/llms.txt` lists the pages by tab and the APIs with their spec URLs; `/llms-full.txt` holds every page's Markdown. With access rules, both list public pages only, and a protected page's `.md` is protected like the page. The page actions next to a docs page title copy the Markdown, open it, or open ChatGPT or Claude with a prompt to read it (not on protected pages).

Text in the accent color is derived from `theme.primary` at build time so that it keeps WCAG AA contrast (4.5:1) in both themes, and text on accent-filled buttons is black or white, whichever reads better.

The schema lives in [`src/config/schema.js`](src/config/schema.js). After changing it, run `npm run schema` to regenerate `schema.json`.

### Migrating

`rapidoc migrate --from redocly|zudoku` writes a `rapidoc.config.yaml` from a Redocly project (`redocly.yaml` + `sidebars.yaml`) or a Zudoku config, and lists anything the conversion could not resolve. Redocly's sidebars become a Documentation tab, its APIs an API Catalog tab, and `theme.openapi` the theme and `rapidoc:` attributes; Zudoku's top-level navigation items are the tabs. Zudoku's `basePath` (with `canonicalUrlOrigin`) becomes the path of `site.url` and `metadata.title` a `titleTemplate`; Redocly's `seo.siteUrl`, `seo.image` and `seo.projectTitle` become `site.url`, `site.image` and `titleTemplate`, and `scripts.head` and `links` become `head` entries. Only the migrator knows Redocly's and Zudoku's key names.

### Sign-in and access rules

`auth` signs readers in through any OpenID Connect provider (Okta, Microsoft Entra ID, Google Workspace, Keycloak, Authentik, Zitadel, Auth0, Ping, Cognito). `access` decides who may read which pages, APIs and files. Both are optional; they need `rapidoc serve` (`@rapidoc/server`), because a static host can't check who is asking.

```yaml
auth:
  issuer: https://acme.okta.com/oauth2/default # or RAPIDOC_AUTH_ISSUER
  clientId: portal-web # or RAPIDOC_AUTH_CLIENT_ID
  scopes: [openid, profile, email, groups] # default: openid, profile, email
  claims: { groups: groups } # claim with groups or roles; dotted paths work (realm_access.roles)
  session: { maxAge: 8h } # 30m, 8h, 7d
  logout: local # idp: also sign out at the provider
  label: Sign in with Okta
  audience: https://api.acme.com # API the access token is for; sent as `audience` at sign-in (Auth0)
  tryIt: true # Try in the API reference sends the signed-in reader's access token

access:
  default: public # public | signed-in | { groups, emails } for anything no rule matches
  rules: # top to bottom; the first rule whose path matches decides
    - path: /docs/partners/** # * = one path segment, ** = any number
      allow: signed-in
    - path: /apis/billing/** # an API's spec and embedded operations follow /apis/<id>
      allow: { groups: [billing-team] }
    - path: /docs/internal/**
      allow: { emails: ['*@acme.com'] } # verified emails only
```

- **Secrets are environment variables of `rapidoc serve`, never config keys:** `RAPIDOC_SESSION_SECRET` (32+ characters, encrypts the session cookie; the same value on every instance) and `RAPIDOC_AUTH_CLIENT_SECRET` (leave unset for a public client). `RAPIDOC_PUBLIC_URL` is the portal's external URL (default `site.url`). Register `<that URL>/_rapidoc/auth/callback` as the redirect URL at the provider.
- **Build output:** with `auth`, `rapidoc build` writes `dist/public/` (safe to host anywhere, holds no protected content), `dist/protected/` and `dist/rapidoc-server.json`. Run `rapidoc serve dist`. Without `auth` the output is the usual static site.
- **What is protected:** pages, specs and files from `public/`, search results (both search indexes are split per zone), and the sitemap. Locked links stay visible in menus and the catalog with a lock icon. Build assets (`/_rapidoc/assets/`), the RapiDoc bundle, the logo and the favicon are always public; `/_rapidoc/` is reserved for the portal.
- **Build checks:** a rule that matches no page or file fails the build (a typo would otherwise leave content public). Warnings: a protected API whose spec is a URL (protect it at that origin), and a public page that embeds an operation of a protected API.
- **Try with the reader's token (`tryIt`):** `rapidoc serve` keeps the access token from the sign-in (never the ID or refresh token) and hands it to the page, which fills it into each API reference's and embedded operation's Authentication section: the spec's first `oauth2` / `openIdConnect` scheme, else its first http `bearer` scheme. Try then calls the API with `Authorization: Bearer …`, and the API's own permission check answers 200 or 403. The token lives in page memory only. Without a provider-side audience (Okta's per-API authorization servers, Entra ID's API scopes in `scopes`), leave `audience` out.
- **OAuth return page:** every portal build has `/oauth-receiver.html`, the page RapiDoc's **Authorize** button returns to, so a provider needs one redirect URL for the whole portal (`<portal>/oauth-receiver.html`).
- `rapidoc dev` does not enforce the rules; test them with `rapidoc build && rapidoc serve dist`.
- **Groups:** some providers only send groups when asked for a scope (Okta: `groups`). With Microsoft Entra ID, prefer app roles (`claims: { groups: roles }`): the `groups` claim holds IDs and is dropped for users in many groups. `rapidoc serve` logs a hint when rules use groups but a sign-in carries none.
- **SAML-only providers:** put an OIDC broker in front (Keycloak, Authentik, Zitadel, Ory Polis).

---

## Writing guides

- **Markdown (`.md`)**: a first `# Heading` becomes the page title when there's no frontmatter `title`.
- **MDX (`.mdx`)**: portal components can be used without importing them: `Callout`, `Card` (+ `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`), `Badge`, `Button`, `Link`, `Steps`, `Tabs`, `TabItem`, `OpenPlaygroundButton`. Starlight components (`Aside`, `CardGrid`, `LinkCard`, `FileTree`, ...) and `Icon` (`<Icon name="rocket" />`, a [Phosphor](https://phosphoricons.com) icon at 24px, or `size={16}`) are exported from `@rapidoc/portal/components`.
- **Markdoc (`.markdoc`)**: rendered by Astro's Markdoc integration with Starlight's components, so headings, the table of contents and code blocks work as in Markdown. Tags:
  - `{% callout type="info|tip|warning|danger" title="..." icon="..." %}`, `{% tabs %}{% tab name="..." %}`, `{% steps %}{% step title="..." %}`, `{% card-grid %}{% card title="..." icon="..." href="..." %}`, `{% badge text="..." variant="..." /%}`. Card icons are [Phosphor](https://phosphoricons.com) names, like every icon name in the config.
  - `{% api-operation spec="<api id>" path="/shipments" method="post" title="..." /%}` embeds one live, interactive operation (`<rapi-doc-mini>`). `spec` is the `id` of an entry in `apis:`; an unknown id shows a notice on the page and a build warning. Pages with an embed load the RapiDoc bundle; other docs pages don't.
  - Starlight's own Markdoc tags (`aside`, `tabitem`, `cardgrid`, `linkcard`, `filetree`, ...) work too.
  - Tags inside a code fence show as text but are still checked; ` ```markdoc {% process=false %} ` skips the check (for tags from elsewhere). `markdoc` fences are highlighted as Markdown.
- **Callouts** look the same however they are written: `{% callout %}` or `{% aside %}` in Markdoc, `<Callout>` or `<Aside>` in MDX, and `:::tip` blocks in Markdown and MDX (title as `:::tip[Title]` or `:::tip{title="Title"}`). Types: `note`, `info`, `tip`, `success`, `caution`, `warning`, `danger`, and Zudoku's `sparkles`, `rocket`, `settings`, `zap`, `lock`, `megaphone`; `icon` picks any other Phosphor icon.
- If both `page.md` and `page.mdx` exist, the `.mdx` one is used.
- Zudoku imports (`zudoku/ui/...`) and `<Stepper>` are rewritten automatically, so migrated docs work as-is.

---

## How a build works

`rapidoc build` (or `buildPortal()`) runs these steps:

1. **Load and validate** `rapidoc.config.yaml` ([`src/config/`](src/config/)).
2. **Create a temporary workspace** at `<project>/.rapidoc-temp/<dev|build>-<pid>-<n>/`, one per run, so a build never disturbs a running `rapidoc dev`. It holds only what Astro needs on disk: a normalized copy of `docs/` (`docs/index.*` becomes the home page), the project's `public/` folder, the specs, the `rapidoc-min.js` bundle and the search index ([`src/engine/temp-workspace.js`](src/engine/temp-workspace.js), [`sync-docs.js`](src/engine/sync-docs.js), [`sync-assets.js`](src/engine/sync-assets.js)).
3. **Run Astro + Starlight** with an inline config. The portal pages ([`src/pages/`](src/pages/)) and components ([`src/components/`](src/components/)) come straight from this package; they read the config and theme through the virtual modules `virtual:rapidoc-portal/config` and `virtual:rapidoc-portal/theme.css` ([`src/engine/astro-integration.js`](src/engine/astro-integration.js)).
4. **Write the static site** to `<project>/dist/` (or `--outDir`). With `auth`, the output is then split by the access rules into `public/`, `protected/` and `rapidoc-server.json` for `rapidoc serve` ([`src/access/split-output.js`](src/access/split-output.js)); if that fails, the output folder is removed rather than left unsplit.
5. **Delete the workspace** (and `.rapidoc-temp/` once no other run uses it), even when the build fails. Your project folder ends up exactly as it was, plus `dist/`.

`rapidoc dev` does steps 1–3 and serves the site on `http://localhost:4321`. It watches the project: guide edits appear immediately; changes to `rapidoc.config.yaml` or a spec restart the server. Its workspace is removed when the server stops, however it stops (`stop()`, Ctrl+C, SIGTERM).

A run killed before it can clean up (`kill -9`, a crash) leaves its folder behind; the next run removes the folders of processes that are no longer running. Add `.rapidoc-temp/` to your `.gitignore` (projects created with `create-rapidoc` already do).

> **Why not the OS temp folder?** Astro only compiles `.astro` files (Starlight's and this package's) that share a parent folder with the site root, so the workspace has to live next to your project.

`rapidoc dev` and `rapidoc build` warn about operations without an `operationId`: their links (`/apis/<id>/<tag>#<operation>`) are built from the summary, so they change when the summary is edited. Every operation can also be linked by its method and path (`#get-orders-orderid`), which only changes with the endpoint.

### Validating specs

`rapidoc validate` checks every local spec in `apis:` against the OpenAPI schema (relative `$ref`s to other files resolve), prints the same `operationId` warnings, and exits with code 1 when a spec has errors, so it can gate CI. `rapidoc validate <file>` checks a single spec. Projects created with `create-rapidoc` have it as `npm run validate`.

---

## Programmatic API

```js
import { buildPortal, startDevServer, loadConfig } from '@rapidoc/portal';

const result = await buildPortal('./my-portal', { outDir: 'dist' });
// { success, apisCount, outDir, durationMs, access? }  access (with auth): { protectedPages, protectedFiles, zones, warnings }

const server = await startDevServer('./my-portal', { port: 4321 });
await server.stop(); // stops Astro and removes its workspace

const { config } = await loadConfig('./my-portal'); // normalized config
```

Both `buildPortal` and `startDevServer` accept `keepWorkspace: true` (CLI: `--debug`) to leave the run's workspace in `.rapidoc-temp/` for inspecting the generated Astro project.

Other exports: config helpers (`normalizeConfig`, `migrateConfig`, `RapidocConfigSchema`), Markdoc (`compileMarkdoc`, `markdocTags`), search (`buildSearchIndex`, `searchRecords`), and spec checks (`checkPortalSpecs`, `checkApiSpec`).

---

## Source layout

```text
src/
├── config/        Strict schema (schema.js → schema.json), errors, loader, normalizer (tabs, sidebars), migrator (Redocly/Zudoku)
├── engine/
│   ├── build-portal.js        buildPortal(): workspace → astro build → cleanup
│   ├── dev-server.js          startDevServer(): workspace → astro dev → watch → cleanup
│   ├── temp-workspace.js      Create / remove <project>/.rapidoc-temp/<run>/
│   ├── sync-docs.js           Copy + normalize docs into the workspace
│   ├── sync-assets.js         Specs, rapidoc-min.js (fails if stale), search index, robots.txt (noindex)
│   ├── llms.js                /docs/<page>.md, /llms.txt, /llms-full.txt (`llms`)
│   ├── page-head.js           Head entries (fonts, og:image, robots, `head`), Open Graph, titles from titleTemplate
│   ├── base-links.js          Base path for links and images in Markdown and MDX
│   ├── astro-integration.js   Inline Astro config, injected routes, virtual modules
│   ├── starlight-options.js   Config → Starlight options and sidebar (one group per documentation tab)
│   ├── route-middleware.js    Shows the current tab's sidebar group; prev/next stay inside the tab
│   └── theme-css.js           Renders styles/portal-theme.css for the config
├── access/
│   ├── rules.js               Rule patterns, allows → zones, first-match zone matcher
│   └── split-output.js        public/ + protected/ + rapidoc-server.json, search and sitemap per zone
├── pages/         catalog, api-reference, first-tab-redirect, rapidoc-notice (access denied, sign-in error) (.astro)
├── components/    Portal header/footer/sidebar/search/user menu and MDX components
├── styles/        portal-theme.css
├── markdoc/       Markdoc tags, nodes, compiler
└── search/        Search index builder
```

## Development (in the RapiDoc monorepo)

```bash
npm run build:rapidoc   # the engine refuses a missing or stale rapidoc-min.js
npm run test:portal     # portal, CLI and create-rapidoc tests (builds rapidoc first)
```

The tests build the sibling `../rapi-portal-demo` checkout; set `RAPIDOC_DEMO_PORTAL_DIR` to use another location.
