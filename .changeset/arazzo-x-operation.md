---
"rapidoc": minor
"@rapidoc/mcp": patch
"@rapidoc/prerender": patch
---

`<rapi-flow>` supports the `x-operation` extension of Arazzo (as Redocly Respect defines it): a step that calls a URL outside the workflow's API sources, written out or taken from an input or an earlier step's response. The diagram draws it dashed with an "external" tag; runs and MCP exports call it. In an exported MCP server, a URL computed at run time goes only to a host the workflow names, unless `EXTERNAL_HOSTS` (or the runtime's `externalHosts` option) allows more.
