---
"rapidoc": patch
"@rapidoc/mcp": patch
"@rapidoc/cli": patch
"@rapidoc/server": patch
---

MCP export: safer defaults and a host configuration that works as copied.

- The host configuration file in the export is now `mcp.json` (was `claude_desktop_config.json`): the same `mcpServers` entry, under a name that is not tied to one app.
- `mcp.json` gives `server.ts` an absolute path (a placeholder to replace in the browser export; the real path from `rapidoc mcp export`). A host starts the server from its own directory, so the relative path was not found.
- `POST` tools no longer carry `destructiveHint: false`: the hint is left out, so hosts assume the tool may be destructive and can ask first.
- `API_KEY` is a fallback only when the API has one security scheme. With several, each scheme needs its own variable, so one key is never sent as every scheme's credential.
- A path argument of `.` or `..` is rejected, since URL parsing would resolve it to another path.
- A server name that already ends in `-mcp` downloads as `<name>.zip`, not `<name>-mcp.zip` twice over (`my-api-mcp-mcp.zip`).
- `/status` is no longer treated as reference data, and `x-mcp-resource: true | false` on an operation decides whether it is a resource or a tool.
