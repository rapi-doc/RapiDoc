# @rapidoc/hono

## 0.1.2

### Patch Changes

- 5c535eb: The option `path` is now `uiPath` (and `publicPath` is `publicUiPath`), so its name says which path it is: the URL path the reference page is served at. The old names still work. The integration contract is version 2. `rapidocSidebar` of `@rapidoc/vitepress` takes one options object, `{ spec, uiPath, methods, collapsed }`; the form `(spec, link, options)` still works.
- Updated dependencies [5c535eb]
- Updated dependencies [5c535eb]
  - @rapidoc/embed@0.3.0

## 0.1.1

### Patch Changes

- 4aaf108: `@rapidoc/embed` adds `createResponder(options, { readAsset })`: it matches a request against the routes and returns the status, headers and body, so a server integration only passes the request in and the response out. `@rapidoc/hono` now runs on it, with no change in behaviour.
- Updated dependencies [4aaf108]
  - @rapidoc/embed@0.2.0

## 0.1.0

### Minor Changes

- 63e6218: New package `@rapidoc/hono`: serve a RapiDoc API reference from a Hono app with `app.use(rapidoc({ specUrl: "/openapi.json" }))`. It serves the page, the bundle and the OAuth return page at `/docs`, takes any `<rapi-doc>` attribute through `options`, and has an `@rapidoc/hono/edge` entry for Cloudflare Workers.

### Patch Changes

- Updated dependencies [5a1e064]
  - @rapidoc/embed@0.1.0
