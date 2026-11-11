---
"@rapidoc/express": minor
"@rapidoc/fastify": minor
"@rapidoc/vitepress": minor
---

Three new integrations. `@rapidoc/express`: `app.use(rapidoc({ specUrl }))` serves the API reference from an Express app (also Connect and plain `node:http`). `@rapidoc/fastify`: `fastify.register(rapidoc, { specUrl })` does the same as a Fastify plugin, with its routes hidden from `@fastify/swagger`. `@rapidoc/vitepress`: `withRapidoc` and `rapidocSidebar` for the config and a `RapidocReference` component, for API reference pages in a VitePress site with the operations in its sidebar.
