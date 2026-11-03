# MCP Server Code Generators

## Overview

Six template-string builders, one per target language, that turn the tool and resource lists
from `../common.js` (`extractMcpOperations`) into the source of a stand-alone MCP server plus its
packaging files. `src/utils/mcp-generator.js` picks one module per
`options.target`; `<rapi-doc>` offers the result as its MCP server download.

Not owned here: extraction, naming and token estimates (`../common.js`). Nothing here runs the
generated code; HTTP calls, environment reads and stdio transports exist only in the emitted
strings.

## Interface

Each module exports a server builder,
`(metadata, tools, resources, options = {}) -> string`, and a files builder,
`(serverCode, metadata[, options]) -> { [relativePath]: content }` (source file, packaging file,
`README.md`). `options.serverName` is the only option read.

- `typescript.js`: `generateTypeScriptMcpServer`, `generateTypeScriptFiles`;
  `@modelcontextprotocol/sdk` with `zod`.
- `python.js`: `generatePythonFastMcpServer`, `generatePythonFiles`; `fastmcp` with `urllib`.
- `go.js`: `generateGoMcpServer`, `generateGoFiles`; `mark3labs/mcp-go`.
- `csharp.js`: `generateCSharpMcpServer`, `generateCSharpFiles`;
  `ModelContextProtocol.NET.Server`.
- `rust.js`: `generateRustMcpServer`, `generateRustFiles`; `mcp-sdk` with `tokio` and `reqwest`.
- `java.js`: `generateJavaMcpServer`, `generateJavaFiles`; Spring Boot `Function` beans with
  `RestClient`.

## Invariants

- **Pure.** Output depends only on the arguments and the `../common.js` helpers; no module-level
  mutable state.
- **Input contract.** Items come from `extractMcpOperations`: `method` upper-case, names already
  snake-cased, parameters with `in` of `path`, `query`, `header` or `body`. Names are not
  re-sanitized here, and escaping of interpolated strings differs by target.
- **Server source header.** Only the server source file embeds the `estimateTokenCost` result
  as a comment; packaging files and emitted READMEs do not.
- **Base URL.** `metadata.servers[0].url`, else `http://localhost:3000`, overridable at run time
  by the `API_BASE_URL` environment variable.
- **Auth is Bearer only.** Tools take an optional per-call key (`apiKey` or
  `api_key`) that overrides the `API_KEY` environment variable and is sent as
  `Authorization: Bearer <key>`. No other auth scheme is emitted.
- **Parameters.** Path parameters are URL-escaped in every target; `in: "header"` parameters
  are sent as request headers; only `POST`, `PUT` and `PATCH` send a JSON body, built from the
  `in: "body"` parameters and keyed by the original `p.name`.
- **Known gap.** `generateJavaFiles` always names the file `RapiDocMcpServer.java`, while the
  class is `toPascalCase(options.serverName || "RapiDocMcpServer")`, so a custom `serverName`
  produces a file and class name mismatch.

## Side Effects

- None in these modules: no network, DOM, storage or console. The emitted programs make HTTP
  requests and read `API_KEY` and `API_BASE_URL`.

## Verification

- `npm run test:unit` from the repo root. `tests/unit/mcp-generator.test.js` exercises every
  target through `src/utils/mcp-generator.js`.
- After editing, `npm run lint` and `npm run format-fix`.
