---
"@rapidoc/cli": major
"@rapidoc/portal": major
"@rapidoc/server": major
"@rapidoc/mock": major
"@rapidoc/prerender": major
"@rapidoc/mcp": major
"create-rapidoc": major
"@rapidoc/embed": major
"@rapidoc/hono": major
"@rapidoc/express": major
"@rapidoc/fastify": major
---

RapiDoc and its family, in sync: RapiDoc Portal and the RapiDoc CLI (with the server, the mock, the prerenderer, the MCP builder and `create-rapidoc`), the integration contract (`@rapidoc/embed`) and RapiDoc for Hono, Express and Fastify were reviewed end to end together with `rapidoc` 15 and are 1.0.0, a new start for the family. The same names for the same things, one sidebar from `<rapi-doc>` to the portal, and safer defaults everywhere; names that were wrong or unclear were corrected once, with no old spellings kept: the portal site's "Upgrading from 0.2 to 1.0" page lists every change. From here they follow semver: a breaking change to the config, the CLI, the integration contract or an integration's options comes only in a new major version.
