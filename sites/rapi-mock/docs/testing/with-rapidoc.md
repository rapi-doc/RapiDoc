---
title: With RapiDoc, RapiFlow and MCP
description: Point Try in <rapi-doc>, Arazzo workflows and an MCP server at RapiMock.
---

## Try, in `<rapi-doc>`

List the mock first in the spec's `servers`, so **Try** sends requests to it:

```yaml
servers:
  - url: http://localhost:4010/openapi
    description: Mock (rapidoc mock)
  - url: https://api.example.com
```

With OAuth, sign in through **Authorize** in `<rapi-doc>` as usual: the mock checks the token like the real API would.

## Arazzo workflows

A workflow that creates something in one step and reads it in the next needs a mock that remembers. Run the mock with `--stateful`, and set `server-url` on [`<rapi-flow>`](https://rapidocui.com/docs/rapi-flow/running/) to the mock's address.

## An MCP server

To let an AI agent work against the mock:

```bash
npx rapidoc mcp serve openapi.yaml --base-url http://localhost:4010/openapi
```
