# @rapidoc/server

## 0.2.5

### Patch Changes

- @rapidoc/mcp@0.2.5

## 0.2.4

### Patch Changes

- Updated dependencies [a84c379]
  - @rapidoc/mcp@0.2.4

## 0.2.3

### Patch Changes

- @rapidoc/mcp@0.2.3

## 0.2.2

### Patch Changes

- @rapidoc/mcp@0.2.2

## 0.2.1

### Patch Changes

- 69f5544: `rapidoc mcp serve` and `rapidoc serve` read `EXTERNAL_HOSTS`, as the exported MCP server does: the hosts, comma-separated (`*` for any), that a workflow step's `x-operation` URL computed at run time may call besides those the workflow names. `@rapidoc/mcp` exports `externalHostsFromEnv`.
- d6837bc: MCP export: safer defaults and a host configuration that works as copied.

  - The host configuration file in the export is now `mcp.json` (was `claude_desktop_config.json`): the same `mcpServers` entry, under a name that is not tied to one app.
  - `mcp.json` gives `server.ts` an absolute path (a placeholder to replace in the browser export; the real path from `rapidoc mcp export`). A host starts the server from its own directory, so the relative path was not found.
  - `POST` tools no longer carry `destructiveHint: false`: the hint is left out, so hosts assume the tool may be destructive and can ask first.
  - `API_KEY` is a fallback only when the API has one security scheme. With several, each scheme needs its own variable, so one key is never sent as every scheme's credential.
  - A path argument of `.` or `..` is rejected, since URL parsing would resolve it to another path.
  - A server name that already ends in `-mcp` downloads as `<name>.zip`, not `<name>-mcp.zip` twice over (`my-api-mcp-mcp.zip`).
  - `/status` is no longer treated as reference data, and `x-mcp-resource: true | false` on an operation decides whether it is a resource or a tool.

- Updated dependencies [69f5544]
- Updated dependencies [69f5544]
- Updated dependencies [69f5544]
- Updated dependencies [69f5544]
- Updated dependencies [d6837bc]
  - @rapidoc/mcp@0.2.1

## 0.2.0

### Patch Changes

- Updated dependencies [3777ceb]
  - @rapidoc/mcp@0.2.0

## 0.1.7

### Patch Changes

- 20cd0f1: `RAPIDOC_MCP=off` turns off the MCP endpoint of `rapidoc serve`: no `/mcp` and no agent tokens, and the user menu hides its "connect an AI agent" section. `on` is the default; any other value stops the server, so a typo can't leave `/mcp` on. `rapidoc serve` says `MCP: off` when it starts.
- @rapidoc/mcp@0.1.7

## 0.1.6

### Patch Changes

- ae8e490: Email access rules (`allow: { emails }`) only match an email the provider marks as verified: `email_verified: true`, or `xms_edov: true` on Microsoft Entra ID. An email without `email_verified` used to count as verified. Microsoft Entra ID sends no `email_verified`, so email rules for Entra ID users need the optional claim `xms_edov` (or app roles in place of email rules). `rapidoc serve` logs a hint when a sign-in's email can't match email rules.
- @rapidoc/mcp@0.1.6

## 0.1.5

### Patch Changes

- @rapidoc/mcp@0.1.5

## 0.1.4

### Patch Changes

- @rapidoc/mcp@0.1.4

## 0.1.3

### Patch Changes

- @rapidoc/mcp@0.1.3

## 0.1.2

### Patch Changes

- @rapidoc/mcp@0.1.2
