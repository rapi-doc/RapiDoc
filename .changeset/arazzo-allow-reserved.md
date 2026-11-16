---
"rapidoc": minor
"@rapidoc/mcp": patch
---

Workflow runs and MCP tools honor `allowReserved` on OpenAPI query parameters, and `<rapi-flow>` supports the `x-allowReserved` extension of Arazzo (as Redocly Respect defines it) on a step's query parameter: reserved characters such as `:` and `/` in the value are sent unencoded (all but `#`).
