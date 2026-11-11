---
"@rapidoc/embed": minor
"@rapidoc/hono": patch
"@rapidoc/express": patch
"@rapidoc/fastify": patch
"@rapidoc/starlight": patch
"@rapidoc/vitepress": patch
---

The option `path` is now `uiPath` (and `publicPath` is `publicUiPath`), so its name says which path it is: the URL path the reference page is served at. The old names still work. The integration contract is version 2. `rapidocSidebar` of `@rapidoc/vitepress` takes one options object, `{ spec, uiPath, methods, collapsed }`; the form `(spec, link, options)` still works.
