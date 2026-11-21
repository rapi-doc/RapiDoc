---
"@rapidoc/portal": patch
"@rapidoc/server": patch
"create-rapidoc": patch
---

A portal can have its own pages: every `.astro` file in a `pages/` folder next to `rapidoc.config.yaml` becomes a page at its path (`pages/pricing.astro` is `/pricing`, `pages/index.astro` the home page, with `docs/index.*` then the page at `/docs`, `pages/items/[id].astro` a page per item). A page takes the portal's header, footer and theme from `PortalLayout`, or writes its own document and takes only the title, favicon and `head:` entries from `@rapidoc/portal/components/PortalHead.astro`. A page with its own document can also take the portal's header alone, from `@rapidoc/portal/components/PortalHeader.astro`, so a site has one header on every page. Pages and components can read the project's files through `projectDir` of `virtual:rapidoc-portal/project`. The search index now lists a folder's `index` page at the folder's address (`/docs/guides`, not `/docs/guides/index`). A page on one of the portal's own routes stops the build, and `rapidoc dev` restarts when a page is added or removed.

The header has new options. A dropdown whose items are plain links (a label and an href only) is now a simple one-column list, as documented, not a grid of cards with a default icon. `columns` (1 to 4) sets how many items sit side by side. A dropdown can be columns with headings (`groups` instead of `items`) and can end with a link (`footer`). Any link can have a `badge` and can sit after the logo, left of the search (`position: start`). `site.logo.badge` puts a small label next to the logo. `header.tabs: sidebar` lists the navigation tabs above the sidebar's pages instead of in a second header row. A header link's `icon` is now shown, as the documentation said. When two header links cover the page's address (`/docs` and `/docs/quickstart` on the quickstart page), only the closer one is marked as current, not both.

A navigation tab with `autogenerate` whose first page is a folder's `index` file now links to that folder's page, not to an address ending in `/index/`.

Every portal has a 404 page: the build writes `404.html`, in the portal's frame, with links to the home page, the search and the navigation tabs. Static hosts show it for an address that has no page, and `rapidoc serve` now answers a browser's request for a missing page with it (other requests still get a plain "Not found"). A project replaces it with its own `pages/404.astro`.
