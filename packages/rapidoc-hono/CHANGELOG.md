# @rapidoc/hono

## 0.1.0

### Minor Changes

- 63e6218: New package `@rapidoc/hono`: serve a RapiDoc API reference from a Hono app with `app.use(rapidoc({ specUrl: "/openapi.json" }))`. It serves the page, the bundle and the OAuth return page at `/docs`, takes any `<rapi-doc>` attribute through `options`, and has an `@rapidoc/hono/edge` entry for Cloudflare Workers.

### Patch Changes

- Updated dependencies [5a1e064]
  - @rapidoc/embed@0.1.0
