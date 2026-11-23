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

First stable release, ready for production: RapiDoc Portal and the RapiDoc CLI (with the server, the mock, the prerenderer, the MCP builder and `create-rapidoc`), the integration contract (`@rapidoc/embed`) and RapiDoc for Hono, Express and Fastify are 1.0.0. From here they follow semver: a breaking change to the config, the CLI, the integration contract or an integration's options comes only in a new major version. Before the promise, names that were wrong or unclear were corrected and defaults made safer: the portal site's "Upgrading from 0.2 to 1.0" page lists every change.
