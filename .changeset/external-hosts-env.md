---
"@rapidoc/cli": patch
"@rapidoc/server": patch
"@rapidoc/mcp": patch
---

`rapidoc mcp serve` and `rapidoc serve` read `EXTERNAL_HOSTS`, as the exported MCP server does: the hosts, comma-separated (`*` for any), that a workflow step's `x-operation` URL computed at run time may call besides those the workflow names. `@rapidoc/mcp` exports `externalHostsFromEnv`.
