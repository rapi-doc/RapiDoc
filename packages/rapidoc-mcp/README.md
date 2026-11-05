# @rapidoc/mcp

Turns OpenAPI documents (and Arazzo workflows) into [MCP](https://modelcontextprotocol.io) tools, in Node:

- **`buildMcpManifest(spec, options)`**: one tool per operation, with JSON Schema arguments and MCP safety annotations, plus one tool per Arazzo workflow when `options.arazzo` is given.
- **`createMcpRuntime(manifest, options)`**: lists and calls those tools with `fetch`, workflows included.
- **`writeMcpProject(manifest)`** / **`generateMcpServer(spec, options)`**: the files of a stdio MCP server, the same project `<rapi-doc>`'s **Export MCP Server** button downloads.

It is the code `<rapi-doc>` and `<rapi-flow>` use in the browser, built for Node without Lit or any element. `@rapidoc/portal` uses it to write a portal's MCP manifests, and `@rapidoc/server` to run them at `/mcp`.

## Use

```bash
npm install @rapidoc/mcp
```

```javascript
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { buildMcpManifest, createMcpRuntime, writeMcpProject } from "@rapidoc/mcp";

const spec = parse(readFileSync("openapi.yaml", "utf8"));
const manifest = buildMcpManifest(spec, { serverName: "petstore" });

const runtime = createMcpRuntime(manifest, { credentials: { api_key: process.env.API_KEY } });
const result = await runtime.callTool("get_pet_by_id", { petId: 1 });

const files = writeMcpProject(manifest); // path → text
```

Types are in `src/index.d.ts`. The guide: [rapidocui.com/advanced/mcp-server](https://rapidocui.com/advanced/mcp-server/).

## Development

The source lives in `packages/rapidoc/src` (`utils/mcp-generator.js`, `utils/mcp/`, `utils/arazzo/`), shared with the browser elements. `src/index.js` is only this package's entry; `npm run build` bundles it into `dist/index.js` with `yaml` left external.
