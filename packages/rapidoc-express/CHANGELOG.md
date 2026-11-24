# @rapidoc/express

## 1.0.0

### Major Changes

- aa3c878: RapiDoc and its family, in sync: RapiDoc Portal and the RapiDoc CLI (with the server, the mock, the prerenderer, the MCP builder and `create-rapidoc`), the integration contract (`@rapidoc/embed`) and RapiDoc for Hono, Express and Fastify were reviewed end to end together with `rapidoc` 15 and are 1.0.0, a new start for the family. The same names for the same things, one sidebar from `<rapi-doc>` to the portal, and safer defaults everywhere; names that were wrong or unclear were corrected once, with no old spellings kept: the portal site's "Upgrading from 0.2 to 1.0" page lists every change. From here they follow semver: a breaking change to the config, the CLI, the integration contract or an integration's options comes only in a new major version.

### Patch Changes

- aa3c878: Clean-up before 1.0.0 of the integration contract and RapiDoc for Hono, Express and Fastify. `uiPath` now means the same everywhere: the path within the app, router or plugin the integration is registered in. RapiDoc for Hono follows it, so under `basePath("/v1")`, `app.route("/v1", sub)` or `app.use("/v1/*", ...)` the page is at `/v1/docs` with correct links, and a `uiPath` that held the full path must drop the prefix. The 0.x names are removed: the options `path` (use `uiPath`) and `publicPath` (use `publicUiPath`), and the export `DEFAULT_PATH` (use `DEFAULT_UI_PATH`); a request to `createResponder` takes `mount`, the prefix the framework took off the path, in place of a per-request `publicUiPath`. An option that is an empty string counts as not set (`lang: ""` is `en`, `assets: ""` is `bundled`; the site root is `uiPath: "/"`). The bundle is served with `cache-control: no-cache` and its ETag in place of `max-age=3600`, so browsers load a new RapiDoc build on the first visit after a deploy and get a 304 otherwise; `If-None-Match` may be a list or a weak validator, and every response has `x-content-type-options: nosniff`. RapiDoc for Express and Fastify build correct links for a `uiPath` without a leading slash under a mount point or prefix, and RapiDoc for Fastify also answers at `{uiPath}/`. Peer ranges have upper bounds: `hono ^4`, `express ^4 || ^5`, `fastify ^4 || ^5`. `@rapidoc/embed/sidebar` has its own types. The contract (still version 2) now compares a page's inline spec as parsed JSON and the rest byte for byte, and has six more fixtures.
- Updated dependencies [aa3c878]
- Updated dependencies [aa3c878]
  - @rapidoc/embed@1.0.0

## 0.1.1

### Patch Changes

- 5c535eb: The option `path` is now `uiPath` (and `publicPath` is `publicUiPath`), so its name says which path it is: the URL path the reference page is served at. The old names still work. The integration contract is version 2. `rapidocSidebar` of `@rapidoc/vitepress` takes one options object, `{ spec, uiPath, methods, collapsed }`; the form `(spec, link, options)` still works.
- Updated dependencies [5c535eb]
- Updated dependencies [5c535eb]
  - @rapidoc/embed@0.3.0

## 0.1.0

### Minor Changes

- 4aaf108: Three new integrations. `@rapidoc/express`: `app.use(rapidoc({ specUrl }))` serves the API reference from an Express app (also Connect and plain `node:http`). `@rapidoc/fastify`: `fastify.register(rapidoc, { specUrl })` does the same as a Fastify plugin, with its routes hidden from `@fastify/swagger`. `@rapidoc/vitepress`: `withRapidoc` and `rapidocSidebar` for the config and a `RapidocReference` component, for API reference pages in a VitePress site with the operations in its sidebar.

### Patch Changes

- Updated dependencies [4aaf108]
  - @rapidoc/embed@0.2.0
