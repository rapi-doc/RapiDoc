# Config batch 1: sub-path hosting, head entries, custom CSS, SEO, LLM output (design)

Status: approved and implemented (2026-10-29), uncommitted.

Where the build differs from the text below:

- `site.image` as a file without `site.url` is a config error, not a warning (the config has no warning channel).
- Base links also cover `href`/`src` in raw HTML (Markdown) and MDX JSX string attributes (`<img src="/a.png">`),
  since migrated Zudoku pages use them; only paths in JSX expressions (`src={...}`) are left as written.
- `noindex` builds without Astro's `site`, so there is also no canonical link.
- A page titled like the site shows the site title alone (the home page keeps its own title in the template).
- `rapidoc serve` of a static build (no `auth`, no manifest) doesn't know the base path: it needs
  `--mount-path` to serve under one.
- The page actions are a "Copy page" button and a disclosure menu (View as Markdown, Open in ChatGPT,
  Open in Claude), in a Starlight `PageTitle` override (`components/PortalPageTitle.astro`).

Four additions that Zudoku and Redocly both have and the portal lacks. Each is plain YAML, optional, and
changes nothing for a config that doesn't use it. The comparison that picked them: Zudoku 0.93
(`basePath`, `metadata`, `docs.llms`, `docs.publishMarkdown`, `aiAssistants`) and Redocly `@redocly/config`
0.69 (`scripts`, `links`, `seo`, `seo.llmstxt`, `navigation.actions`).

```yaml
site:
  title: Acme Developers
  url: https://acme.com/developers      # 1. the path part (/developers) is where the portal is served
  image: /social-card.png               # 4. preview image for links shared in Slack, X, LinkedIn
  titleTemplate: '%s · Acme Developers' # 4. browser tab and search result titles
  noindex: true                         # 4. keep search engines out (staging, internal portals)

head:                                   # 2. tags added to every page
  - script: { src: https://plausible.io/js/script.js, defer: true, data-domain: acme.com }
  - meta: { name: google-site-verification, content: abc123 }

theme:
  css: ./styles/portal.css              # 3. your stylesheet, loaded after the portal's

llms:                                   # 5. on by default; llms: false turns all of it off
  description: Acme's APIs for payments and payouts.
  pageActions: [copy, markdown, chatgpt, claude]
```

---

## 1. Sub-path hosting: from `site.url`

**Config.** No new key. When `site.url` has a path, the portal is served under it:
`url: https://acme.com/developers` → every page is under `/developers/`. Without a path (or without
`site.url`), the portal is served from `/`, as today.

- Why not a separate `basePath` key (Zudoku's): the public URL and the path it is served under can't
  disagree if they are one value, and `site.url` is already needed for canonical links and the sitemap.
  (Approved 2026-10-29.)
- The base path is always the path the **browser** sees. Links, assets and the sign-in callback are
  resolved by the browser, so a portal at `https://acme.com/sales/developers` must link to
  `/sales/developers/...`; a shorter base would send readers outside the portal.

**What you keep writing as root paths.** Every path in the config and in the docs stays relative to the
portal, not the host. You write `/docs/intro`, the page links to `/developers/docs/intro`:

| Where                                                                        | Written as             | Becomes                                |
| :--------------------------------------------------------------------------- | :--------------------- | :------------------------------------- |
| `navigation`, `header.links`, `footer`, `site.logo.href`, `site.banner.href` | `/docs/intro`          | `/developers/docs/intro`               |
| Links and images in `.md`, `.mdx`, `.markdoc` pages                          | `[Intro](/docs/intro)` | `/developers/docs/intro`               |
| `redirects[].from` / `to`                                                    | `/old` → `/docs/new`   | both under `/developers`               |
| `access.rules[].path`                                                        | `/docs/internal/**`    | matches `/developers/docs/internal/**` |
| `head`, `site.image`, `site.favicon`, `site.logo.src`                        | `/logo.svg`            | `/developers/logo.svg`                 |
| Full URLs (`https://…`)                                                      | unchanged              | unchanged                              |

**Build changes.**

- Astro `base` set from the path; `site` from the origin.
- The portal's own links (catalog, API pages, specs at `/specs/<id>`, `/_rapidoc/assets/`, the RapiDoc bundle,
  the OAuth receiver, search index, Pagefind) go through one `withBase()` helper. About 15 files build such
  paths today (`normalizer.js`, `PortalUserMenu.astro`, `api-reference.astro`, `sync-assets.js`,
  `split-output.js`, `rules.js`, `astro-integration.js`, …).
- A remark/rehype step prefixes root-relative links and images in docs pages (Astro doesn't do this for
  Markdown content).
- `rapidoc dev` serves under the base path too, so links behave the same before you deploy.

**Server (`rapidoc serve`).** `rapidoc-server.json` records the base path; the server mounts everything
under it, including `/_rapidoc/auth/*`. The OIDC callback becomes
`https://acme.com/developers/_rapidoc/auth/callback`: the sign-in docs must say to register that URL.

**Behind a proxy that strips part of the path.** A gateway or ingress may route
`acme.com/sales/*` to a service and strip `/sales`, so the portal's server receives `/developers/...` while
the browser is on `/sales/developers/...`. The build doesn't change (links stay `/sales/developers/...`).
Only the server needs to know where requests arrive:

```bash
rapidoc serve dist --mount-path /developers     # or RAPIDOC_MOUNT_PATH=/developers
```

- `--mount-path` (default: the base path) is the path the server answers under. Every URL the server
  produces (redirects, the OIDC callback, sign-in return URLs) still uses the base path from `site.url`.
- Explicit rather than read from `X-Forwarded-Prefix`: the prefix decides the OIDC redirect URI, so it
  shouldn't come from a request header.
- Static hosts need nothing: point the proxy at the built files.

## 2. Head entries: `head`

Tags added to the `<head>` of every page: docs pages, the catalog and API pages. For analytics, site
verification, preconnects, extra fonts.

```yaml
head:
  - script: { src: https://www.googletagmanager.com/gtag/js?id=G-XXXX, async: true }
  - script: |                         # a string is an inline script
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-XXXX');
  - link: { rel: preconnect, href: https://api.acme.com }
  - meta: { name: google-site-verification, content: abc123 }
```

- Each entry has exactly one of `script`, `link`, `meta`. Attribute values are strings or `true`.
- `script` is an attribute object (an external script) or a string (inline).
- Order is kept; entries come after the portal's own tags.
- Why not Redocly's per-provider `analytics.ga`, `analytics.segment`, …: one generic list covers every
  provider, and new providers need no portal change. Why not Starlight's `{ tag, attrs, content }`: shorter
  to write, and only the three tags people actually add.
- Not added: `body` scripts (no request yet), cookie consent (a consent tool goes in `head` like any script).

## 3. Custom CSS: `theme.css`

```yaml
theme:
  css: ./styles/portal.css     # or a list of files
```

- Paths relative to the config. Loaded on every page after the portal theme, so plain selectors win
  without `!important`.
- The portal's CSS variables (`--portal-primary`, `--portal-radius`, `--portal-navbar-height`, …) are the
  supported things to override; the README lists them. Other selectors work but can change between
  releases.
- `rapidoc dev` reloads on change.

## 4. SEO: `site.image`, `site.titleTemplate`, `site.noindex`

- **`site.image`**: a file in `public/` or a URL. Adds `og:image` and `twitter:card: summary_large_image`.
  A path becomes an absolute URL from `site.url`; without `site.url` the build warns and leaves it out
  (preview services need absolute URLs). Recommended size 1200 × 630.
- **`site.titleTemplate`**: `%s` is the page title. Default `'%s | <site.title>'` (today's Starlight
  format). The home page uses `site.title` alone.
- **`site.noindex: true`**: `<meta name="robots" content="noindex, nofollow">` on every page, a
  `robots.txt` that disallows everything, and no sitemap.
- Also fixed regardless of the keys: the catalog and API pages get the same Open Graph tags as docs pages
  (`og:title`, `og:description`, `og:url`, `og:site_name`). Today only Starlight's pages have them.
- Not added: `keywords` (search engines ignore it), JSON-LD, per-page `seo` frontmatter beyond Starlight's.

## 5. LLM output: `llms`

On by default, because the docs are Markdown already and both Zudoku and Redocly ship it.
`llms: false` turns all of it off.

```yaml
llms:
  description: Acme's APIs for payments and payouts.   # default: site.description
  pageActions: [copy, markdown, chatgpt, claude]       # default: all four; false hides the buttons
```

**What the build publishes.**

| URL               | Content                                                                                                                                                 |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/docs/<page>.md` | Each docs page as Markdown, frontmatter removed                                                                                                         |
| `/llms.txt`       | Title, `llms.description`, then one section per navigation tab listing its pages (`.md` links), then the APIs with their spec URLs (`/specs/<id>.yaml`) |
| `/llms-full.txt`  | Every page's Markdown in navigation order                                                                                                               |

**Markdoc and MDX to Markdown.** Page sources are converted, not rendered:

- `{% api-operation %}` → `` `POST /shipments` Create a shipment `` linking to the API page.
- Callouts (`{% callout %}`, `:::note`, `<Aside>`, `<Callout>`) → `> **Note:** …`.
- Cards → a list of links. Other portal tags keep their inner text.
- MDX `import`/`export` lines are dropped; unknown components are left as written.

**Page actions.** A small button group next to each docs page title:

- `copy`: copy the page's Markdown.
- `markdown`: open the `.md` file.
- `chatgpt`, `claude`: open the assistant with a prompt to read the page's `.md` URL.

**With sign-in.**

- `/llms.txt` and `/llms-full.txt` list **public pages only**. Zudoku does the same by default
  (`includeProtected: false`).
- A protected page's `.md` goes to `dist/protected/` with the page, through the same access rule: a rule
  for `/docs/internal/**` covers `/docs/internal/x.md`, and an exact rule for `/docs/x` also covers
  `/docs/x.md`. A test checks that no protected text reaches a public `.md` or `llms*.txt`.
- On protected pages `chatgpt` and `claude` are hidden: the assistant can't sign in. `copy` and `markdown`
  still work for the signed-in reader. Redocly does the same.

**Not added:** a docs MCP server, an AI chat assistant (both are hosted features), and `llms.txt` sections
per access zone.

---

## 6. Everything that changes with it

- `schema.js` (+ `npm run schema` for `schema.json`), `normalizer.js`, the README's config reference.
- `rapidoc migrate`:
  - from Zudoku: `basePath` (into `site.url`'s path when `canonicalUrlOrigin` is set, else a warning),
    `metadata.title`, `docs.llms.llmsTxt: false` → `llms: false`
  - from Redocly: `seo.image`, `seo.projectTitle` → `titleTemplate`, `scripts.head`, `links`
- `rapi-portal-demo`: Rapid Parcels gets `site.image` and `theme.css`; Cosmo Cargo stays as is, so the
  defaults stay tested.
- `create-rapidoc` templates: the new keys as comments.
- `rapi-portal-doc`: a page for each feature.
- Tests:
  - Base path: a fixture built under a path checks every link, asset, spec URL, redirect, and that
    `rapidoc serve` signs in under the path, both with and without `--mount-path`.
  - `head` entries and `theme.css` appear on docs, catalog and API pages.
  - Open Graph tags; `noindex` → robots meta, `robots.txt`, no sitemap.
  - `.md`, `llms.txt` and `llms-full.txt` contents; the access test extended to them.

## 7. Order and size

1. SEO keys, `head`, `theme.css`: small, independent of each other.
2. `llms`: medium; most of it is the Markdoc/MDX-to-Markdown conversion.
3. Sub-path hosting: the largest; it touches links in the portal, the server and the sign-in flow.

## 8. Decisions for approval

1. ~~Base path from `site.url`'s path, or a separate `site.basePath`?~~ Approved: from `site.url`, plus
   `rapidoc serve --mount-path` for proxies that strip part of the path.
2. `head` with `script` / `link` / `meta` entries: approved.
3. `theme.css` (string or list): approved.
4. `site.image`, `site.titleTemplate`, `site.noindex`: approved.
5. `llms` on by default, with `description` and `pageActions`; public pages only in `llms*.txt`: approved.
