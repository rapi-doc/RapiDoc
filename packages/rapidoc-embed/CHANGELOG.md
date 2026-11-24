# @rapidoc/embed

## 1.0.0

### Major Changes

- aa3c878: RapiDoc and its family, in sync: RapiDoc Portal and the RapiDoc CLI (with the server, the mock, the prerenderer, the MCP builder and `create-rapidoc`), the integration contract (`@rapidoc/embed`) and RapiDoc for Hono, Express and Fastify were reviewed end to end together with `rapidoc` 15 and are 1.0.0, a new start for the family. The same names for the same things, one sidebar from `<rapi-doc>` to the portal, and safer defaults everywhere; names that were wrong or unclear were corrected once, with no old spellings kept: the portal site's "Upgrading from 0.2 to 1.0" page lists every change. From here they follow semver: a breaking change to the config, the CLI, the integration contract or an integration's options comes only in a new major version.

### Patch Changes

- aa3c878: Clean-up before 1.0.0 of the integration contract and RapiDoc for Hono, Express and Fastify. `uiPath` now means the same everywhere: the path within the app, router or plugin the integration is registered in. RapiDoc for Hono follows it, so under `basePath("/v1")`, `app.route("/v1", sub)` or `app.use("/v1/*", ...)` the page is at `/v1/docs` with correct links, and a `uiPath` that held the full path must drop the prefix. The 0.x names are removed: the options `path` (use `uiPath`) and `publicPath` (use `publicUiPath`), and the export `DEFAULT_PATH` (use `DEFAULT_UI_PATH`); a request to `createResponder` takes `mount`, the prefix the framework took off the path, in place of a per-request `publicUiPath`. An option that is an empty string counts as not set (`lang: ""` is `en`, `assets: ""` is `bundled`; the site root is `uiPath: "/"`). The bundle is served with `cache-control: no-cache` and its ETag in place of `max-age=3600`, so browsers load a new RapiDoc build on the first visit after a deploy and get a 304 otherwise; `If-None-Match` may be a list or a weak validator, and every response has `x-content-type-options: nosniff`. RapiDoc for Express and Fastify build correct links for a `uiPath` without a leading slash under a mount point or prefix, and RapiDoc for Fastify also answers at `{uiPath}/`. Peer ranges have upper bounds: `hono ^4`, `express ^4 || ^5`, `fastify ^4 || ^5`. `@rapidoc/embed/sidebar` has its own types. The contract (still version 2) now compares a page's inline spec as parsed JSON and the rest byte for byte, and has six more fixtures.
- Updated dependencies [aa3c878]
- Updated dependencies [aa3c878]
- Updated dependencies [f0c81ab]
- Updated dependencies [aa3c878]
- Updated dependencies [aa3c878]
- Updated dependencies [aa3c878]
  - rapidoc@15.0.0

## 0.3.2

### Patch Changes

- Updated dependencies [43a6655]
- Updated dependencies [a6748e6]
  - rapidoc@14.0.0

## 0.3.1

### Patch Changes

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

## 0.3.0

### Minor Changes

- 5c535eb: The option `path` is now `uiPath` (and `publicPath` is `publicUiPath`), so its name says which path it is: the URL path the reference page is served at. The old names still work. The integration contract is version 2. `rapidocSidebar` of `@rapidoc/vitepress` takes one options object, `{ spec, uiPath, methods, collapsed }`; the form `(spec, link, options)` still works.

### Patch Changes

- 5c535eb: The API sections of Starlight and VitePress sidebars now show each operation's HTTP method (GET, POST, DEL) in RapiDoc's colours and strike deprecated operations through; the Starlight "deprecated" badge is replaced by that mark. `@rapidoc/vitepress` also escapes tag and operation names from the spec, which VitePress writes as HTML. `@rapidoc/embed` adds the shared helpers as `@rapidoc/embed/sidebar`. The `methods` option (`sidebar.methods` in Starlight) picks the style: `as-colored-text` (default), `as-plain-text`, `as-colored-block`, or `false` for none.

## 0.2.0

### Minor Changes

- 4aaf108: `@rapidoc/embed` adds `createResponder(options, { readAsset })`: it matches a request against the routes and returns the status, headers and body, so a server integration only passes the request in and the response out. `@rapidoc/hono` now runs on it, with no change in behaviour.

### Patch Changes

- Updated dependencies [e5cd554]
  - rapidoc@12.2.1

## 0.1.0

### Minor Changes

- 5a1e064: `rapidoc` now publishes metadata for tools and integrations in `dist/`: TypeScript types (`rapidoc`, `rapidoc/react`, `rapidoc/vue`), a JSON Schema of every attribute (`rapidoc/options.schema.json`), a Custom Elements Manifest, `oauth-receiver.html`, and `integration.json` with the SRI hash of each file. New package `@rapidoc/embed`: the shared core for RapiDoc plugins (frameworks, docs sites, tools), which renders the standard host page for `<rapi-doc>` and comes with conformance fixtures for ports in other languages.

### Patch Changes

- Updated dependencies [5a1e064]
  - rapidoc@12.2.0
