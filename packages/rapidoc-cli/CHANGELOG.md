# @rapidoc/cli

## 0.2.2

### Patch Changes

- f4364a5: New command `rapidoc pdf <spec>`: writes the API reference of a spec as a PDF (a cover page, a table of contents, the security schemes and every operation), the document `<rapi-pdf>` makes in the browser. Options choose the sections, the schema style, title, footer, colors, labels (`--labels`, for another language) and fonts (`--font`, for text Roboto has no glyphs for). It needs `rapipdf` 3 installed next to the CLI.
- Updated dependencies [43a6655]
- Updated dependencies [f4364a5]
- Updated dependencies [a6748e6]
  - rapidoc@14.0.0
  - rapipdf@3.0.0
  - @rapidoc/portal@0.2.2
  - create-rapidoc@0.2.2
  - @rapidoc/mcp@0.2.2
  - @rapidoc/mock@0.2.2
  - @rapidoc/server@0.2.2

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
- Updated dependencies [bccc7a7]
- Updated dependencies [69f5544]
- Updated dependencies [d6837bc]
  - rapidoc@13.1.0
  - @rapidoc/mcp@0.2.1
  - @rapidoc/server@0.2.1
  - create-rapidoc@0.2.1
  - @rapidoc/mock@0.2.1
  - @rapidoc/portal@0.2.1

## 0.2.0

### Patch Changes

- Updated dependencies [5066e13]
- Updated dependencies [2a645cc]
- Updated dependencies [2a645cc]
- Updated dependencies [2a645cc]
- Updated dependencies [2a645cc]
- Updated dependencies [3777ceb]
- Updated dependencies [2a645cc]
- Updated dependencies [2a645cc]
- Updated dependencies [2a645cc]
- Updated dependencies [2a645cc]
- Updated dependencies [2a645cc]
- Updated dependencies [2a645cc]
- Updated dependencies [2a645cc]
  - rapidoc@13.0.0
  - @rapidoc/portal@0.2.0
  - @rapidoc/mcp@0.2.0
  - create-rapidoc@0.2.0
  - @rapidoc/mock@0.2.0
  - @rapidoc/server@0.2.0

## 0.1.7

### Patch Changes

- 20cd0f1: `RAPIDOC_MCP=off` turns off the MCP endpoint of `rapidoc serve`: no `/mcp` and no agent tokens, and the user menu hides its "connect an AI agent" section. `on` is the default; any other value stops the server, so a typo can't leave `/mcp` on. `rapidoc serve` says `MCP: off` when it starts.
- Updated dependencies [3927554]
- Updated dependencies [53ac5d2]
- Updated dependencies [20cd0f1]
- Updated dependencies [7cbc0b6]
  - @rapidoc/portal@0.1.7
  - rapidoc@12.3.0
  - @rapidoc/server@0.1.7
  - create-rapidoc@0.1.7
  - @rapidoc/mcp@0.1.7
  - @rapidoc/mock@0.1.7

## 0.1.6

### Patch Changes

- Updated dependencies [3d9a081]
- Updated dependencies [ae8e490]
  - @rapidoc/portal@0.1.6
  - @rapidoc/server@0.1.6
  - create-rapidoc@0.1.6
  - @rapidoc/mcp@0.1.6
  - @rapidoc/mock@0.1.6

## 0.1.5

### Patch Changes

- Updated dependencies [f823eae]
- Updated dependencies [7f698d8]
- Updated dependencies [5931b08]
- Updated dependencies [11e945c]
- Updated dependencies [3e15e56]
- Updated dependencies [ef165dc]
- Updated dependencies [2ddb480]
- Updated dependencies [918988a]
- Updated dependencies [6283526]
- Updated dependencies [0095bb9]
  - create-rapidoc@0.1.5
  - rapidoc@12.1.2
  - @rapidoc/portal@0.1.5
  - @rapidoc/mcp@0.1.5
  - @rapidoc/mock@0.1.5
  - @rapidoc/server@0.1.5

## 0.1.4

### Patch Changes

- Updated dependencies [c109c23]
- Updated dependencies [98c5872]
  - @rapidoc/portal@0.1.4
  - create-rapidoc@0.1.4
  - @rapidoc/mcp@0.1.4
  - @rapidoc/mock@0.1.4
  - @rapidoc/server@0.1.4

## 0.1.3

### Patch Changes

- Updated dependencies [691aeff]
- Updated dependencies [fa36d7d]
- Updated dependencies [9deb938]
  - rapidoc@12.1.1
  - @rapidoc/portal@0.1.3
  - create-rapidoc@0.1.3
  - @rapidoc/mcp@0.1.3
  - @rapidoc/mock@0.1.3
  - @rapidoc/server@0.1.3

## 0.1.2

### Patch Changes

- Updated dependencies [dd8998d]
  - create-rapidoc@0.1.2
  - @rapidoc/mcp@0.1.2
  - @rapidoc/mock@0.1.2
  - @rapidoc/portal@0.1.2
  - @rapidoc/server@0.1.2
