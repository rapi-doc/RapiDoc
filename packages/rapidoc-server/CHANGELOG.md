# @rapidoc/server

## 1.0.0

### Major Changes

- aa3c878: RapiDoc and its family, in sync: RapiDoc Portal and the RapiDoc CLI (with the server, the mock, the prerenderer, the MCP builder and `create-rapidoc`), the integration contract (`@rapidoc/embed`) and RapiDoc for Hono, Express and Fastify were reviewed end to end together with `rapidoc` 15 and are 1.0.0, a new start for the family. The same names for the same things, one sidebar from `<rapi-doc>` to the portal, and safer defaults everywhere; names that were wrong or unclear were corrected once, with no old spellings kept: the portal site's "Upgrading from 0.2 to 1.0" page lists every change. From here they follow semver: a breaking change to the config, the CLI, the integration contract or an integration's options comes only in a new major version.

### Patch Changes

- aa3c878: MCP servers read their settings from `MCP_` variables only, the same in an exported server, `rapidoc mcp serve` and the `/mcp` endpoint of `rapidoc serve`: a security scheme's credential is `MCP_AUTH_<SCHEME>` (`MCP_AUTH_<SCHEME>_USERNAME` and `MCP_AUTH_<SCHEME>_PASSWORD` for HTTP Basic), the base URL is `MCP_BASE_URL` (`MCP_BASE_URL_<SOURCE>` each when a server has several APIs) and the host allow-list is `MCP_EXTERNAL_HOSTS`. The old names (`<SCHEME>`, `API_KEY`, `API_BASE_URL`, `EXTERNAL_HOSTS`) are no longer read, so a scheme called `token` or `path` can no longer send `$TOKEN` or `$PATH` to an API, and two schemes that would share a variable stop the export with a message. Tool names are now always valid and stable: at most 64 characters, never empty for a non-Latin `operationId`, and a name two operations share ends in a short hash of the operation instead of `_2`, so reordering the spec renames nothing. Every operation is a tool with all its parameters; a `GET` becomes an MCP resource as well only with `x-mcp-resource: true`, no longer because of its path. Swagger 2.0 specs get HTTP Basic for `type: basic` and a form body for `formData` parameters. A spec with a relative server URL or none is resolved against the address it was loaded from; read from a file, the manifest has no base URL, `rapidoc mcp export` and `rapidoc mcp serve` say that one is required, and a tool call without one fails with that message instead of calling `http://localhost`. The runtime refuses a manifest version it does not know, `<rapi-doc>`'s `mcp` attribute shows the export button for `true` only, and `@rapidoc/mcp` no longer exports `parseMcpEnabled`.
- aa3c878: Security fixes. `@rapidoc/server`: the sign-in cookie, which `/_rapidoc/auth/login` gives any visitor, was accepted as a session, opening pages for all signed-in readers without signing in (pages limited to groups or emails were not affected); every sealed cookie and token now has one use. The server also refuses a build whose `protected/` folder has no `rapidoc-server.json`, needs a public URL (`site.url` or `RAPIDOC_PUBLIC_URL`) to sign readers in anywhere but `localhost`, limits request bodies, and sends `frame-ancestors` (`RAPIDOC_FRAME_ANCESTORS`), referrer and HSTS headers. `rapidoc` and `@rapidoc/prerender`: HTML in descriptions is reduced to a fixed list of elements and attributes, in every browser and in pre-rendered pages, where it was not sanitized at all; `javascript:` addresses from a spec are no longer links; a spec value can no longer pass for a template in the prerenderer. `rapidoc build` refuses an output folder that is, holds or is inside a source folder (`--out-dir public` emptied `public/`). `rapidoc mock` and `rapidoc dev` listen on `localhost` by default (`--host 0.0.0.0` for a container or a shared server; `dev` has `--host` now), and the mock takes an imported spec only from a program on its machine or its own page, never from another site's page or through a proxy, and does not let it read other local files.
- aa3c878: Clean-up of the server's and the mock's JavaScript API and a few behaviours before 1.0. `createApp()` and `startServer()` of `@rapidoc/server` return a `summary` (mode, paths, public URL, issuer, client ID, `providerReady`, counts of protected files and zones, MCP tools) in place of the internal `settings` object and the separate `mcp` value, so no secret can be read from what they return; `loadSettings` is no longer exported. `rapidoc serve` now starts when the sign-in provider is down: public pages are served, sign-in ends on the sign-in error page, and the server finds the provider again when a reader signs in; a wrong issuer still stops the start. `/_rapidoc/access/check` no longer tells a signed-out reader which paths exist, and the server's log has the reader's id only, not the email. `@rapidoc/mock` exports only `createMockApp`, `startMockServer` and `DEFAULT_PORT`; neither function returns the token `verifier` any more, and the helpers `rapidoc lint` uses (`exampleError`, `configFor`, `statefulFindings`, `statefulReport`) moved to `@rapidoc/mock/internal`, which is not public API (`tokenScopes`, `CONTROL_PREFIX`, `CONFIG_FILE`, `STATEFUL_RULES`, `ImportError` and `isLocalCaller` are gone from the entry). In the mock, a `security` requirement that names a scheme the spec does not define now answers 401 (it was left open) with a warning at start, each API keeps at most 1000 `X-Mock-Session` sessions (the one used longest ago is dropped first), and a malformed percent-escape in a `/__mock` path answers 400, not 500.
- Updated dependencies [aa3c878]
- Updated dependencies [aa3c878]
- Updated dependencies [aa3c878]
  - @rapidoc/mcp@1.0.0

## 0.2.6

### Patch Changes

- dff1c76: A portal can have its own pages: every `.astro` file in a `pages/` folder next to `rapidoc.config.yaml` becomes a page at its path (`pages/pricing.astro` is `/pricing`, `pages/index.astro` the home page, with `docs/index.*` then the page at `/docs`, `pages/items/[id].astro` a page per item). A page takes the portal's header, footer and theme from `PortalLayout`, or writes its own document and takes only the title, favicon and `head:` entries from `@rapidoc/portal/components/PortalHead.astro`. A page with its own document can also take the portal's header alone, from `@rapidoc/portal/components/PortalHeader.astro`, so a site has one header on every page. Pages and components can read the project's files through `projectDir` of `virtual:rapidoc-portal/project`. The search index now lists a folder's `index` page at the folder's address (`/docs/guides`, not `/docs/guides/index`). A page on one of the portal's own routes stops the build, and `rapidoc dev` restarts when a page is added or removed.

  The header has new options. A dropdown whose items are plain links (a label and an href only) is now a simple one-column list, as documented, not a grid of cards with a default icon. `columns` (1 to 4) sets how many items sit side by side. A dropdown can be columns with headings (`groups` instead of `items`) and can end with a link (`footer`). Any link can have a `badge` and can sit after the logo, left of the search (`position: start`). `site.logo.badge` puts a small label next to the logo. `header.tabs: sidebar` lists the navigation tabs above the sidebar's pages instead of in a second header row. A header link's `icon` is now shown, as the documentation said. When two header links cover the page's address (`/docs` and `/docs/quickstart` on the quickstart page), only the closer one is marked as current, not both.

  A navigation tab with `autogenerate` whose first page is a folder's `index` file now links to that folder's page, not to an address ending in `/index/`.

  Every portal has a 404 page: the build writes `404.html`, in the portal's frame, with links to the home page, the search and the navigation tabs. Static hosts show it for an address that has no page, and `rapidoc serve` now answers a browser's request for a missing page with it (other requests still get a plain "Not found"). A project replaces it with its own `pages/404.astro`.

  Search: a project's own pages are in the search, under a Pages filter, read from the pages as built, or in `rapidoc dev` from the running server just after it starts (a page opts out with `<meta name="portal-search" content="off">`). The search dialog offers a filter only for a kind of result the site has, so a portal without APIs no longer shows "API Operations". Results from MDX pages no longer show their `import` lines, and a name written as code, such as `<rapi-doc>`, is kept in titles and text where it was dropped as if it were an HTML tag. A search for more than one word now works: the dialog looked for the whole query as one phrase, so "payments webhook" found nothing unless those words stood together. A name is found with or without its hyphens ("rapidoc" finds `<rapi-doc>`), and a word with special characters, such as "c++", no longer breaks the search. Each documentation result says which navigation tab its page is in ("Guides", "Reference") where it said "Documentation" for all of them, and a search for a tab's name finds that tab's pages.

- @rapidoc/mcp@0.2.6

## 0.2.5

### Patch Changes

- @rapidoc/mcp@0.2.5

## 0.2.4

### Patch Changes

- Updated dependencies [a84c379]
  - @rapidoc/mcp@0.2.4

## 0.2.3

### Patch Changes

- @rapidoc/mcp@0.2.3

## 0.2.2

### Patch Changes

- @rapidoc/mcp@0.2.2

## 0.2.1

### Patch Changes

- 69f5544: `rapidoc mcp serve` and `rapidoc serve` read `EXTERNAL_HOSTS`, as the exported MCP server does: the hosts, comma-separated (`*` for any), that a workflow step's `x-operation` URL computed at run time may call besides those the workflow names. `@rapidoc/mcp` exports `externalHostsFromEnv`.
- d6837bc: MCP export: safer defaults and a host configuration that works as copied.

  - The host configuration file in the export is now `mcp.json` (was `claude_desktop_config.json`): the same `mcpServers` entry, under a name that is not tied to one app.
  - `mcp.json` gives `server.ts` an absolute path (a placeholder to replace in the browser export; the real path from `rapidoc mcp export`). A host starts the server from its own directory, so the relative path was not found.
  - `POST` tools no longer carry `destructiveHint: false`: the hint is left out, so hosts assume the tool may be destructive and can ask first.
  - `API_KEY` is a fallback only when the API has one security scheme. With several, each scheme needs its own variable, so one key is never sent as every scheme's credential.
  - A path argument of `.` or `..` is rejected, since URL parsing would resolve it to another path.
  - A server name that already ends in `-mcp` downloads as `<name>.zip`, not `<name>-mcp.zip` twice over (`my-api-mcp-mcp.zip`).
  - `/status` is no longer treated as reference data, and `x-mcp-resource: true | false` on an operation decides whether it is a resource or a tool.

- Updated dependencies [69f5544]
- Updated dependencies [69f5544]
- Updated dependencies [69f5544]
- Updated dependencies [69f5544]
- Updated dependencies [d6837bc]
  - @rapidoc/mcp@0.2.1

## 0.2.0

### Patch Changes

- Updated dependencies [3777ceb]
  - @rapidoc/mcp@0.2.0

## 0.1.7

### Patch Changes

- 20cd0f1: `RAPIDOC_MCP=off` turns off the MCP endpoint of `rapidoc serve`: no `/mcp` and no agent tokens, and the user menu hides its "connect an AI agent" section. `on` is the default; any other value stops the server, so a typo can't leave `/mcp` on. `rapidoc serve` says `MCP: off` when it starts.
- @rapidoc/mcp@0.1.7

## 0.1.6

### Patch Changes

- ae8e490: Email access rules (`allow: { emails }`) only match an email the provider marks as verified: `email_verified: true`, or `xms_edov: true` on Microsoft Entra ID. An email without `email_verified` used to count as verified. Microsoft Entra ID sends no `email_verified`, so email rules for Entra ID users need the optional claim `xms_edov` (or app roles in place of email rules). `rapidoc serve` logs a hint when a sign-in's email can't match email rules.
- @rapidoc/mcp@0.1.6

## 0.1.5

### Patch Changes

- @rapidoc/mcp@0.1.5

## 0.1.4

### Patch Changes

- @rapidoc/mcp@0.1.4

## 0.1.3

### Patch Changes

- @rapidoc/mcp@0.1.3

## 0.1.2

### Patch Changes

- @rapidoc/mcp@0.1.2
