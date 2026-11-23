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
import {
  buildMcpManifest,
  createMcpRuntime,
  credentialsFromEnv,
  writeMcpProject,
} from "@rapidoc/mcp";

// The spec as an object. For a YAML file, parse it with a YAML package of your choice
// (`npm install yaml`, then `parse(text)`); this package does not bring one for specs.
const spec = JSON.parse(readFileSync("openapi.json", "utf8"));
const manifest = buildMcpManifest(spec, { serverName: "petstore" });

const runtime = createMcpRuntime(manifest, {
  // { api_key: process.env.MCP_AUTH_API_KEY, ... }: one MCP_AUTH_<SCHEME> per security scheme
  credentials: credentialsFromEnv(manifest, process.env),
});
const result = await runtime.callTool("get_pet_by_id", { petId: 1 });

const files = writeMcpProject(manifest); // path → text
```

## What a manifest holds

- **Tools**: one per operation, GET included, with all its parameters. Names are the `operationId` in snake_case (else method and path), at most 64 characters, and do not change when the spec is reordered: a name that is too long, or that two operations share, ends in a short hash of the name or of the operation's method and path.
- **Resources**: only operations marked `x-mcp-resource: true` (a GET without required parameters). They stay tools as well.
- **Base URL**: the spec's first server. A relative one (`/api/v1`), or none, is resolved against `options.specUrl`, the address the spec was loaded from. Without it the source has no `baseUrl`: pass `baseUrls` to the runtime, or a tool call answers with an error (it never calls `localhost`).
- **Swagger 2.0** works as input: `type: basic` is HTTP Basic and `formData` parameters are a form body.

## Environment variables

The exported server, `rapidoc mcp serve` and `@rapidoc/server`'s `/mcp` read the same variables, all with the `MCP_` prefix (`credentialsFromEnv`, `baseUrlsFromEnv`, `externalHostsFromEnv`):

| Variable                                                   | What it is                                                                                               |
| :--------------------------------------------------------- | :------------------------------------------------------------------------------------------------------- |
| `MCP_AUTH_<SCHEME>`                                        | A security scheme's credential (API key or bearer token); `<SCHEME>` is the scheme id in UPPER_SNAKE     |
| `MCP_AUTH_<SCHEME>_USERNAME`, `MCP_AUTH_<SCHEME>_PASSWORD` | The same for an HTTP Basic scheme                                                                        |
| `MCP_BASE_URL`                                             | The API's base URL, for a server with one API                                                            |
| `MCP_BASE_URL_<SOURCE>`                                    | Each API's base URL, for a server with several (workflows over more than one API)                        |
| `MCP_EXTERNAL_HOSTS`                                       | Hosts, comma-separated (`*` for any), that a workflow's `x-operation` URL computed at run time may go to |

Two schemes whose ids give the same variable (`api-key` and `apiKey`) make `buildMcpManifest` throw, naming both.

Types are in `src/index.d.ts`. The guide: [rapidocui.com/docs/mcp/server](https://rapidocui.com/docs/mcp/server/).

## Development

The source lives in `packages/rapidoc/src` (`utils/mcp-generator.js`, `utils/mcp/`, `utils/arazzo/`), shared with the browser elements. `src/index.js` is only this package's entry; `npm run build` bundles it into `dist/index.js` with `js-yaml` (Arazzo parsing) left external.

---

Part of the [RapiDoc family](https://rapidocui.com) of open-source tools for OpenAPI and Arazzo: [RapiDoc](https://rapidocui.com/rapidoc/) (`<rapi-doc>`), [RapiFlow](https://flow.rapidocui.com/), [RapiDoc Portal](https://portal.rapidocui.com/), [RapiMock](https://mock.rapidocui.com/), [RapiPdf](https://rapidocui.com/rapipdf/), the [RapiDoc CLI](https://rapidocui.com/cli/) and [integrations](https://rapidocui.com/integrations/) for Express, Fastify, Hono, FastAPI, ASP.NET Core, Go, Starlight, VitePress and Docusaurus.
