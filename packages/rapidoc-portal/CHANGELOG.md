# @rapidoc/portal

## 1.0.0

### Major Changes

- aa3c878: RapiDoc and its family, in sync: RapiDoc Portal and the RapiDoc CLI (with the server, the mock, the prerenderer, the MCP builder and `create-rapidoc`), the integration contract (`@rapidoc/embed`) and RapiDoc for Hono, Express and Fastify were reviewed end to end together with `rapidoc` 15 and are 1.0.0, a new start for the family. The same names for the same things, one sidebar from `<rapi-doc>` to the portal, and safer defaults everywhere; names that were wrong or unclear were corrected once, with no old spellings kept: the portal site's "Upgrading from 0.2 to 1.0" page lists every change. From here they follow semver: a breaking change to the config, the CLI, the integration contract or an integration's options comes only in a new major version.

### Minor Changes

- 57367d1: Without `theme.primary`, a portal now uses the accents of RapiDoc's default theme, `amber`: `#f6a821` in dark mode and `#ab6534` with white text in light mode, on its own pages, the API reference and embedded operations (was `#f76b39` in both). Only the accent changes; the portal's surfaces stay its own. A portal that sets `theme.primary` keeps that color in both modes.
- 708f82e: With `site.url` set, a build writes a `robots.txt` that names the sitemap, so search engines and AI crawlers find every page. A `robots.txt` in the project's `public/` folder still replaces it, and `site.noindex` still writes one that keeps crawlers out.

### Patch Changes

- aa3c878: Clean-up before 1.0, with no old names kept. Markdoc tags: `{% api-operation %}` takes the API's id as `api` (was `spec`), `{% workflow %}` takes the `workflows:` entry's id as `document` (was `file`), `{% tab %}` takes `label` only (`name` is gone), and `{% card-grid columns=N %}` now sets the number of columns (1 to 4, default 3; it was ignored and always 2). An old attribute fails the build as an unknown attribute. `@rapidoc/portal` no longer exports the unused second Markdoc renderer (`compileMarkdoc`, `compileDocFile`, `createMarkdocConfig`, `markdocTags`, `extractHeadings`, the `./markdoc` subpath) or `searchRecords`; `resolveConfig` replaces `normalizeConfig` as the config helper. The header and footer for a page with its own document are imported under their real names, `@rapidoc/portal/components/PortalPageHeader.astro` and `PortalPageFooter.astro` (were `PortalHeader.astro` and `PortalFooter.astro`), and the paths the build's workspace imports moved under `@rapidoc/portal/internal/`. Without `site.url`, pages no longer get a canonical link and a sitemap on the placeholder domain `developer.portal`: a build has neither and prints one note that both need `site.url`. `rapidoc migrate` takes the project folder (`rapidoc migrate [dir]`) and `--force` / `-f`; when `rapidoc.config.yaml` exists and it cannot ask (no terminal, or `--yes`), it stops unless `--force` is given. `@rapidoc/cli` has an `exports` field: it is a command, and none of its files can be imported. New portals from `create-rapidoc` and `rapidoc init` use the new attribute names.
- 7c9a56d: The sidebars' group headings and section labels, in the guides and the API reference, are a step fainter than the links, so the links read first. Their color is the new `--portal-sidebar-label` token (4.5:1 or more on the default themes).
- aa3c878: Clean-up of `@rapidoc/prerender` before 1.0.0. Options have one name each, the name of `<rapi-doc>`'s property: `usePathInNav` is now `usePathInNavBar`, `renderSchema`'s `style` is `schemaStyle`, the API key option is `apiKeyName`, and `getNavFilterHtml` takes `searchPlaceholder` only. Every option that is an attribute of `<rapi-doc>` can also be written in kebab-case, in every function, and an option name a function does not know is an error that lists the valid ones (`renderRapiDoc` still passes any other attribute on to the element). `renderRapiDoc` writes an attribute only for an option you passed and renders with the element's own defaults, so the defaults are now `layout: "row"`, `schemaStyle: "tree"` and `allowAdvancedSearch: true`; pass the old values (`"column"`, `"table"`, `false`) to keep them. A spec that cannot be loaded throws an error that says what was being loaded and why, in place of an almost empty result, and a path that is not a file is `file not found`, not a request to `http://localhost`. `getSpecNavigation` returns exactly the documented fields of an operation. A closing slash on `basePath` no longer gives two forms of link. Removed from the exports: the default export, `resolveSpecInput`, `renderNavBarHtml`, `renderTemplateToString`, `escapeHtml` and `getMethodBadge` (use `getNavBarHtml`; the others are internal), the types `RapiDocOptions` and `RenderNavBarHtmlOptions` (now `RenderRapiDocOptions` and `NavBarOptions`), and the `theme` and `colorScheme` options of `getBundledCss`, which did nothing. In RapiDoc Portal, a build now fails, naming the API and the spec, when a spec cannot be read, parsed or fetched, where it used to publish the API page with an empty sidebar; `rapidoc dev` shows the error on that API's page. An API whose `spec` is a URL gets its tag pages (the sidebar's links to them returned 404), from one fetch at build time. Search results for operations open the operation: they link to its tag's page and anchor as the sidebar does, and operations marked `x-internal` or `x-hidden` are not in the index. The "RapiDoc bundle is missing" error tells npm users to reinstall `rapidoc`.
- aa3c878: Security fixes. `@rapidoc/server`: the sign-in cookie, which `/_rapidoc/auth/login` gives any visitor, was accepted as a session, opening pages for all signed-in readers without signing in (pages limited to groups or emails were not affected); every sealed cookie and token now has one use. The server also refuses a build whose `protected/` folder has no `rapidoc-server.json`, needs a public URL (`site.url` or `RAPIDOC_PUBLIC_URL`) to sign readers in anywhere but `localhost`, limits request bodies, and sends `frame-ancestors` (`RAPIDOC_FRAME_ANCESTORS`), referrer and HSTS headers. `rapidoc` and `@rapidoc/prerender`: HTML in descriptions is reduced to a fixed list of elements and attributes, in every browser and in pre-rendered pages, where it was not sanitized at all; `javascript:` addresses from a spec are no longer links; a spec value can no longer pass for a template in the prerenderer. `rapidoc build` refuses an output folder that is, holds or is inside a source folder (`--out-dir public` emptied `public/`). `rapidoc mock` and `rapidoc dev` listen on `localhost` by default (`--host 0.0.0.0` for a container or a shared server; `dev` has `--host` now), and the mock takes an imported spec only from a program on its machine or its own page, never from another site's page or through a proxy, and does not let it read other local files.
- aa3c878: The sidebar has a new look with three levels: upper-case section labels (Overview, tag groups, Components, or the tags themselves when there are no tag groups), rows with icons for the API title, servers and authentication, and compact operation rows under a guide line with the method first. The current item is a filled block. A tag's name opens a closed tag as well as going to its section. `nav-item-spacing` is removed (set `--sidebar-item-padding` instead), tag groups no longer collapse, and `show-method-in-nav-bar` now defaults to `as-colored-text`. See the v14 to v15 migration guide. RapiDoc Portal's docs sidebar takes the same three levels: a tab's top-level groups are section labels, their items rows with icons, deeper items compact rows under a guide line.
- Updated dependencies [aa3c878]
- Updated dependencies [aa3c878]
- Updated dependencies [f0c81ab]
- Updated dependencies [aa3c878]
- Updated dependencies [aa3c878]
- Updated dependencies [aa3c878]
- Updated dependencies [aa3c878]
- Updated dependencies [aa3c878]
  - rapidoc@15.0.0
  - @rapidoc/mcp@1.0.0
  - @rapidoc/prerender@1.0.0

## 0.2.6

### Patch Changes

- 085fd99: On API reference pages, the tabs above the sidebar (`header.tabs: sidebar` or `sidebar-select`) sit inside the sidebar with the same spacing as in the guides' sidebar, instead of against its left edge, and the `sidebar-select` list opens over the endpoint filter instead of under it.
  The tab rows have their own line height, so they are the same size on docs pages and API reference pages.
- c140a01: `rapidoc dev` can point links to other sites at local dev servers: set `RAPIDOC_DEV_LINKS="https://example.com=http://localhost:4321,..."` and links to those addresses in the pages it serves go to the local servers, so sites that link to each other can be tested together. Builds are not affected.
- 384844c: With `header.tabs: sidebar` or `sidebar-select`, a portal with one navigation tab shows no tab list or switcher above the sidebar: there is nothing to switch between.
- daa38ee: A project's own page that brings its own document can now take the portal's footer, as it takes the header: `import PortalFooter from '@rapidoc/portal/components/PortalFooter.astro'`.
- dff1c76: A portal can have its own pages: every `.astro` file in a `pages/` folder next to `rapidoc.config.yaml` becomes a page at its path (`pages/pricing.astro` is `/pricing`, `pages/index.astro` the home page, with `docs/index.*` then the page at `/docs`, `pages/items/[id].astro` a page per item). A page takes the portal's header, footer and theme from `PortalLayout`, or writes its own document and takes only the title, favicon and `head:` entries from `@rapidoc/portal/components/PortalHead.astro`. A page with its own document can also take the portal's header alone, from `@rapidoc/portal/components/PortalHeader.astro`, so a site has one header on every page. Pages and components can read the project's files through `projectDir` of `virtual:rapidoc-portal/project`. The search index now lists a folder's `index` page at the folder's address (`/docs/guides`, not `/docs/guides/index`). A page on one of the portal's own routes stops the build, and `rapidoc dev` restarts when a page is added or removed.

  The header has new options. A dropdown whose items are plain links (a label and an href only) is now a simple one-column list, as documented, not a grid of cards with a default icon. `columns` (1 to 4) sets how many items sit side by side. A dropdown can be columns with headings (`groups` instead of `items`) and can end with a link (`footer`). Any link can have a `badge` and can sit after the logo, left of the search (`position: start`). `site.logo.badge` puts a small label next to the logo. `header.tabs: sidebar` lists the navigation tabs above the sidebar's pages instead of in a second header row. A header link's `icon` is now shown, as the documentation said. When two header links cover the page's address (`/docs` and `/docs/quickstart` on the quickstart page), only the closer one is marked as current, not both.

  A navigation tab with `autogenerate` whose first page is a folder's `index` file now links to that folder's page, not to an address ending in `/index/`.

  Every portal has a 404 page: the build writes `404.html`, in the portal's frame, with links to the home page, the search and the navigation tabs. Static hosts show it for an address that has no page, and `rapidoc serve` now answers a browser's request for a missing page with it (other requests still get a plain "Not found"). A project replaces it with its own `pages/404.astro`.

  Search: a project's own pages are in the search, under a Pages filter, read from the pages as built, or in `rapidoc dev` from the running server just after it starts (a page opts out with `<meta name="portal-search" content="off">`). The search dialog offers a filter only for a kind of result the site has, so a portal without APIs no longer shows "API Operations". Results from MDX pages no longer show their `import` lines, and a name written as code, such as `<rapi-doc>`, is kept in titles and text where it was dropped as if it were an HTML tag. A search for more than one word now works: the dialog looked for the whole query as one phrase, so "payments webhook" found nothing unless those words stood together. A name is found with or without its hyphens ("rapidoc" finds `<rapi-doc>`), and a word with special characters, such as "c++", no longer breaks the search. Each documentation result says which navigation tab its page is in ("Guides", "Reference") where it said "Documentation" for all of them, and a search for a tab's name finds that tab's pages.

- 420a5ad: A sidebar link to another site opens in a new tab and shows an arrow after its label, as the header's menus do.
- 5389026: `header.tabs: sidebar-select` shows the current navigation tab in one row above the sidebar's pages, opening the list of every tab, so a portal with many tabs keeps its pages near the top.
- 23aad8f: A navigation tab can set the header's logo for its pages (`logo: { src, alt, badge }`), for a portal whose tabs are products with logos and versions of their own.
- 05c59b1: A code block with `frame="terminal"` is drawn as a terminal window: red, yellow and green window dots, then its title. Other code blocks keep the plain code frame.
- e18c68f: A page's frontmatter `title` keeps tag names as written: `title: Pairing with <rapi-doc>` no longer shows as "Pairing with". A title taken from the page's `# heading` still drops its HTML.
- Updated dependencies [e18c68f]
  - rapidoc@14.2.1
  - @rapidoc/mcp@0.2.6
  - @rapidoc/prerender@0.2.6

## 0.2.5

### Patch Changes

- @rapidoc/mcp@0.2.5
  - @rapidoc/prerender@0.2.5

## 0.2.4

### Patch Changes

- Updated dependencies [5f050fe]
- Updated dependencies [90d213f]
- Updated dependencies [cc15663]
- Updated dependencies [90d213f]
- Updated dependencies [a84c379]
- Updated dependencies [90d213f]
- Updated dependencies [5f050fe]
- Updated dependencies [90d213f]
- Updated dependencies [90d213f]
- Updated dependencies [90d213f]
- Updated dependencies [90d213f]
- Updated dependencies [90d213f]
- Updated dependencies [90d213f]
- Updated dependencies [90d213f]
- Updated dependencies [90d213f]
- Updated dependencies [90d213f]
  - rapidoc@14.2.0
  - @rapidoc/prerender@0.2.4
  - @rapidoc/mcp@0.2.4

## 0.2.3

### Patch Changes

- 0bf29c6: Navigation icons (sidebar items, header and mobile tabs) use Phosphor's regular weight at 16px, a lighter 1px line, instead of bold. `Icon` takes a `weight` prop to choose it.
- 94dccbd: `rapidoc.theme` with a RapiDoc preset (`amber`, `jade`, ...) now applies to the API reference pages: the page, its sidebar, header and footer take the preset's background, border, sidebar color and accent instead of `theme.primary` and the portal's background. Without it the pages look as before; a `#hex` value still sets only the accent.

  The header rows and the footer now share a color, `--portal-header-bg` (the header frosted, the footer solid), and the sidebars take the page's background: in the light theme the header and footer are the light grey the docs sidebar used to be, and the sidebar is white. Set `--portal-header-bg` in a `theme.css` stylesheet to change it.

  The "On this page" column keeps the width of the left sidebar (18.75rem, `--portal-toc-width` to change it) instead of growing with the screen; the page text stays centered in the space between them.

  The header's dropdown menus are lighter: duotone icons without a colored box, grey and the accent on hover; smaller titles (0.85rem, weight 500) and descriptions (0.75rem); no border on a hovered item.

- Updated dependencies [98324b0]
- Updated dependencies [c291fe9]
  - rapidoc@14.1.0
  - @rapidoc/prerender@0.2.3
  - @rapidoc/mcp@0.2.3

## 0.2.2

### Patch Changes

- Updated dependencies [43a6655]
- Updated dependencies [a6748e6]
  - rapidoc@14.0.0
  - @rapidoc/prerender@0.2.2
  - @rapidoc/mcp@0.2.2

## 0.2.1

### Patch Changes

- Updated dependencies [69f5544]
- Updated dependencies [69f5544]
- Updated dependencies [69f5544]
- Updated dependencies [bccc7a7]
- Updated dependencies [69f5544]
- Updated dependencies [d6837bc]
  - rapidoc@13.1.0
  - @rapidoc/mcp@0.2.1
  - @rapidoc/prerender@0.2.1

## 0.2.0

### Patch Changes

- 5066e13: `<rapi-doc>` and `<rapi-doc-mini>` choose which operations to show with one attribute, `filter-operations`, replacing `match-paths`, `match-type` and `remove-endpoints-with-badge-label-as` (removed). Terms are operationIds, `GET /path`, paths, `*` / `**` path globs, `tag:`, `badge:` and `deprecated`, with `!` to leave out; shown operations keep the order of the first term they match. Matching is exact: a v12 `match-paths` prefix becomes a glob (`/pet/**`). `@rapidoc/prerender` takes `filterOperations` in place of `matchPaths`, `matchType` and `removeEndpointsWithBadgeLabelAs`, and the portal's `{% api-operation %}` tag uses `filter-operations`. See the v12 to v13 migration guide.
- 3777ceb: `<rapi-flow>`: a step's values are grouped under Path params, Query params, Header params, Cookie params and Request body (with its content type) headings, body fields without the `body.` prefix, and a value from an earlier step reads `← from <step>.<output>`; gotos and retries draw lines from their action line (a goto's labelled with its name, a retry's with "retry 3× @ 2s", looping back into its step); an end action is an END pill, red on failure and green on success; the outputs box reads `<output> ← <step>.<output>` like a step's values, without the From step column; actions a step inherits from the workflow are tagged "Inherited" in violet, and the compact view draws their goto and retry lines too, a retry loop around the height of its step; neither view draws lines for values passed between steps any more (each value names its step), the compact view lists each step's values under the same headings as the expanded view, lines have rounded corners, and the On success / On failure headings say when they apply ("if all checks pass", "if any check fails"), and a step with no failure action shows the default, an outlined END pill marked "(default)". The diagram has no legend any more (next-step arrows are green like gotos on success, gotos on failure red, retries orange, and every goto or retry line is labelled), which also fixes the portal's `{% workflow %}` tag failing the build on a workflow with a retry; a literal value reads `const`, as Arazzo calls it. An action's `→` is in the color of what it leads to (orange retry, green on success, red on failure), and the `←` before a value from a step in the step color. A workflow run in `<rapi-flow>` has a Stop button and stops after 50 steps, saying which goto it kept going round; the MCP workflow runtime takes `maxStepRuns` and an AbortSignal (`signal`) for the same. The run log starts with the inputs the run was given, its entries show a bordered + / − to unfold and fold them, and the Mock Response Status section says how to use it and starts folded. A colored dot on the step box marks where each goto or retry line leaves it. In `<rapi-doc>`, the menu button of narrow layouts is a smaller button with a drawn icon that turns into an × while the menu is open, and the open menu casts a shadow over the content. While `mock-server="true"`, `<rapi-doc>`'s button reads "TRY (Mock)", and `<rapi-flow>`'s reads "Run workflow (Mock) →" while its tied `<rapi-doc>` mocks; the run button ends in → instead of starting with ▶. `<rapi-flow>` has a new `server-is-mock` attribute for runs against a mock server (`rapidoc mock`, Prism); Mock Response Status shows only when a mock answers, the tied `<rapi-doc>`'s or that server. `<rapi-flow>`'s header puts the workflow picker (or id) and the view switch on one row, above the summary and description. `<rapi-doc>`'s `show-side-nav` takes `floating`: the menu button and slide-over menu at every width, so the content takes the whole width. A `<rapi-flow>` diagram shrinks to fit a narrow pane only down to 85%, then scrolls, so its text stays readable; `renderArazzoWorkflow` takes `minScale` for the same. `<rapi-flow>` has a new `allow-arazzo-url-load` attribute: a box to load any Arazzo document by URL, with a tied `<rapi-doc>` loading its first OpenAPI source. A URL that fails to load keeps the current document and `<rapi-doc>`, with the error under the box; without the box, the document's URL shows as text above the diagram. `<rapi-flow>` has `mcp` and `mcp-server-name` attributes and an Export MCP Server button: an MCP server with one tool per workflow, across every API source of the Arazzo document, and no tool per operation (`generateMcpServer()` / `downloadMcpServer()` from code). `<rapi-doc>`'s `downloadMcpServer({ includeOperations: false })` names its file `<server-name>-workflows-mcp.zip`. The Arazzo URL box, and `<rapi-doc>`'s spec URL and filter boxes in its header, no longer show the browser's autocomplete history, and keep their colors when a browser autofills them. The MCP workflow runtime fills in inputs the caller left out from their `default`, as the run form does. The diagram's first box lists the document's API sources (`sourceDescriptions`: name, type, URL) above the inputs, and the flow graph has them as `sources`. `renderFlowDiagram` takes `stepClasses` to add classes to step boxes by step id. The diagram and the MCP workflow compiler read criteria and actions with the same code, so they agree on which actions apply. The run panel's buttons, inputs and selects use `<rapi-doc>`'s control styles (`.btn` sizes and variants), and compact step boxes are at least as wide as expanded ones. A `<rapi-doc>` or `<rapi-doc-mini>` with no spec (no `spec-url`, nothing loading) shows a hint after a moment (`Set spec-url, or call loadSpec()`, part `no-spec`) instead of a blank.
- Updated dependencies [5066e13]
- Updated dependencies [2a645cc]
- Updated dependencies [2a645cc]
- Updated dependencies [2a645cc]
- Updated dependencies [2a645cc]
- Updated dependencies [3777ceb]
- Updated dependencies [2a645cc]
- Updated dependencies [2a645cc]
- Updated dependencies [2a645cc]
- Updated dependencies [2a645cc]
- Updated dependencies [2a645cc]
- Updated dependencies [2a645cc]
- Updated dependencies [2a645cc]
  - rapidoc@13.0.0
  - @rapidoc/prerender@0.2.0
  - @rapidoc/mcp@0.2.0

## 0.1.7

### Patch Changes

- 3927554: `rapidoc dev` and `rapidoc build` no longer print `The collection "i18n" does not exist or is empty` on every run. The portal now defines Starlight's i18n collection, with an empty English entry that changes no interface text.
- 53ac5d2: Links and clickable values follow one style. Links in descriptions use the theme's accent instead of blue, with a quiet underline that turns solid on hover and focus; other links (contact, license, external docs) are underlined on hover. Allowed values and examples that fill a parameter are compact accent links with a dotted underline, and plain text when Try is off. A new `--primary-text` token (`--primary-text-dark`, `--primary-text-light`) is the accent as readable text, computed for every theme and for a hex `primary-color`. In the portal, links in guides keep an underline, but a quiet one that turns solid on hover.
- 20cd0f1: `RAPIDOC_MCP=off` turns off the MCP endpoint of `rapidoc serve`: no `/mcp` and no agent tokens, and the user menu hides its "connect an AI agent" section. `on` is the default; any other value stops the server, so a typo can't leave `/mcp` on. `rapidoc serve` says `MCP: off` when it starts.
- Updated dependencies [53ac5d2]
  - rapidoc@12.3.0
  - @rapidoc/prerender@0.1.7
  - @rapidoc/mcp@0.1.7

## 0.1.6

### Patch Changes

- 3d9a081: `.mdx` pages can import your own Astro components and modules from the project with a relative path, such as `import Hello from '../components/Hello.astro'`. These imports failed before, because the portal builds from a copy of `docs/`. Importing a React, Vue or Svelte component stops the build with an error that names the page and the import.
- @rapidoc/mcp@0.1.6
  - @rapidoc/prerender@0.1.6

## 0.1.5

### Patch Changes

- 3e15e56: A closed `site.banner` stays closed after a reload and on later visits, until its message or link changes. Before, it came back on every reload.
- ef165dc: API reference pages use `<rapi-doc>`'s own `scale="default"` instead of `lg`. Body text and headings keep the portal's sizes; code, descriptions and small labels are 1–2px smaller (code 13px instead of 15px). Set `scale: lg` under `rapidoc:` to keep the previous sizes.
- 918988a: The "On this page" rail bends with rounded curves at nested headings, and its highlight covers every section on screen, growing, shrinking and gliding along the rail as the page scrolls instead of jumping (no animation with reduced motion).
- Updated dependencies [7f698d8]
- Updated dependencies [5931b08]
- Updated dependencies [11e945c]
- Updated dependencies [2ddb480]
- Updated dependencies [6283526]
- Updated dependencies [0095bb9]
  - rapidoc@12.1.2
  - @rapidoc/prerender@0.1.5
  - @rapidoc/mcp@0.1.5

## 0.1.4

### Patch Changes

- c109c23: A portal without `navigation:` builds again: its default sidebar (every page in `docs/`) uses the group format current Starlight versions require.
- 98c5872: Uses Starlight 0.42.10.
- @rapidoc/mcp@0.1.4
  - @rapidoc/prerender@0.1.4

## 0.1.3

### Patch Changes

- fa36d7d: `{% api-operation %}` takes `collapsed=true`: the embed shows only the operation's method and path, and opens when the reader clicks it.
- Updated dependencies [691aeff]
- Updated dependencies [9deb938]
  - rapidoc@12.1.1
  - @rapidoc/prerender@0.1.3
  - @rapidoc/mcp@0.1.3

## 0.1.2

### Patch Changes

- @rapidoc/mcp@0.1.2
  - @rapidoc/prerender@0.1.2
