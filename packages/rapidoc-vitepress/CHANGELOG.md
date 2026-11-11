# @rapidoc/vitepress

## 0.1.1

### Patch Changes

- 5c535eb: The API sections of Starlight and VitePress sidebars now show each operation's HTTP method (GET, POST, DEL) in RapiDoc's colours and strike deprecated operations through; the Starlight "deprecated" badge is replaced by that mark. `@rapidoc/vitepress` also escapes tag and operation names from the spec, which VitePress writes as HTML. `@rapidoc/embed` adds the shared helpers as `@rapidoc/embed/sidebar`. The `methods` option (`sidebar.methods` in Starlight) picks the style: `as-colored-text` (default), `as-plain-text`, `as-colored-block`, or `false` for none.
- 5c535eb: The option `path` is now `uiPath` (and `publicPath` is `publicUiPath`), so its name says which path it is: the URL path the reference page is served at. The old names still work. The integration contract is version 2. `rapidocSidebar` of `@rapidoc/vitepress` takes one options object, `{ spec, uiPath, methods, collapsed }`; the form `(spec, link, options)` still works.
- Updated dependencies [5c535eb]
- Updated dependencies [5c535eb]
  - @rapidoc/embed@0.3.0

## 0.1.0

### Minor Changes

- 4aaf108: Three new integrations. `@rapidoc/express`: `app.use(rapidoc({ specUrl }))` serves the API reference from an Express app (also Connect and plain `node:http`). `@rapidoc/fastify`: `fastify.register(rapidoc, { specUrl })` does the same as a Fastify plugin, with its routes hidden from `@fastify/swagger`. `@rapidoc/vitepress`: `withRapidoc` and `rapidocSidebar` for the config and a `RapidocReference` component, for API reference pages in a VitePress site with the operations in its sidebar.

### Patch Changes

- Updated dependencies [e5cd554]
- Updated dependencies [4aaf108]
  - rapidoc@12.2.1
  - @rapidoc/embed@0.2.0
