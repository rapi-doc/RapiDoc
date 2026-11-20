# AGENTS.md — `sites/rapidoc` (rapidocui.com on RapiDoc Portal)

rapidocui.com rebuilt with RapiDoc Portal, from this repository's own `@rapidoc/cli` and `@rapidoc/portal`. **In progress**: it has every page of the live site (the 50 documentation pages, home, product pages, sandbox, API reference, examples and test pages), and the docs pages' header and sidebar match the live site. Not done yet: the live site's redirects and its own 404 page (the portal's is used), and switching the deployment. The live site is still built from `docs/` (Astro and Starlight).

- **Not an npm workspace**, and nothing here is published to npm.
- **Preview**: `.github/workflows/publish-rapidoc-site-preview.yml` builds this folder and force-pushes the built files to the `main` branch of `rapi-doc/rapidoc-site-preview`, which GitHub Pages serves at `preview.rapidocui.com` (the workflow writes the `CNAME`; `public/` has none, because the site's own address is rapidocui.com). It runs on pushes to `master` and to the branch `portal-pages-and-rapidoc-site`, with the deploy key in the secret `RAPIDOC_SITE_PREVIEW_DEPLOY_KEY`. `site.noindex` keeps search engines out; remove it at the switch-over, not before.
- **Copies, for now**: `docs/` is a copy of `docs/src/content/docs/`, and the pages and what they import (`layouts/`, `components/`, `utils/`, `page-data/`, `styles/`) are copies of the files in `docs/src/`. Until the move is finished, a change to one of those files in `docs/src/` is not made here, and `page-data/rapidoc-build-info.*` is not refreshed by `npm run build-info`.
- **Docs pages** differ from the originals only in their imports: components come from `@rapidoc/portal/components`, never `@astrojs/starlight/components`, and the site's own from `components/`. `docs/index.mdx` is the page at `/docs` (the home page is `pages/index.astro`). The sidebar is `navigation` in the config: one tab per product.
- **The docs shell** is the portal's, made to look like the live site: its structure is config (`header.links` with the Products menu as `groups`, `header.tabs: sidebar` for the product list above the pages, `site.logo.badge` for the version, `footer: false`), and `styles/portal.css` sizes and colors it, with the portal's color tokens so the light theme works too. Where the portal and the live site differ in page furniture, the portal's own is kept (decided): its previous/next links, "On this page" list, page actions (Copy page), callouts without a default title, and the light/dark switcher (`theme.mode: dark` is only the first visit's theme). Change the Products menu in both `rapidoc.config.yaml` and `page-data/products.ts` (the site's own pages still draw their header from `components/SiteNavbar.astro`). The version in `site.logo.badge` is written by hand: update it with a release.
- **No Astro config**: the portal owns it. There are no Vite aliases or plugins, so files here differ from `docs/src/` in these ways: `ThemeDemo` imports RapiDoc's theme tokens by relative path (no `~` alias); data files and RapiDoc's source are found from `projectDir` (`virtual:rapidoc-portal/project`), not `process.cwd()`; `components/Icon.astro` finds Phosphor's icons itself; and pages load `/assets/rapidoc-min.js`, the bundle the portal publishes.

## Commands (from the repository root)

| Command | Purpose |
| :--- | :--- |
| `npm run dev:rapidoc-site` | Preview on `http://localhost:4329` |
| `npm run build:rapidoc-site` | Build to `sites/rapidoc/dist/` (ignored by git); builds the `rapidoc`, MCP, prerender and `rapipdf` packages first, which the pages load |

## Layout

```text
rapidoc.config.yaml   # site, header and the sidebar of each product
docs/                 # the documentation pages (MDX)
pages/                # the site's own pages: index (home), product pages, sandbox, api/[...element], examples/, tests/
layouts/ components/ utils/ page-data/ styles/   # what the pages import; styles/portal.css is the docs shell's look
public/               # favicon, images, Prism, specs/ and specs-test/ (the specs the examples and tests load)
```
