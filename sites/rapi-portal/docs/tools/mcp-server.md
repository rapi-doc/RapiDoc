---
title: MCP server for agents
description: Every portal build carries its APIs and workflows as MCP tools; rapidoc serve hosts them at /mcp for AI agents, with the reader's own access.
---

AI agents can use your APIs the way readers do. `rapidoc build` turns every local OpenAPI spec and every workflow of its Arazzo specs into [MCP](https://modelcontextprotocol.io) tool manifests, and `rapidoc serve` hosts them at `/mcp`: one endpoint for the whole portal, with the same access rules as the pages.

```text
dist/mcp/<api id>.json              the API's operations as tools, named <api id>_<operation>
dist/mcp/workflows/<id>.json        each workflow of the file as one tool, its inputs as the arguments
```

Nothing to configure: a build has the manifests whenever it has OpenAPI specs on disk (one given as a URL is left out).

## Connect an agent

With [`rapidoc serve`](/docs/deploy/rapidoc-serve/), the portal's MCP endpoint is `https://<your portal>/mcp` (Streamable HTTP).

An app that supports Streamable HTTP connects to that URL directly. In Cursor, add it to `.cursor/mcp.json`; in Claude Code, run one command:

```json title=".cursor/mcp.json"
{
  "mcpServers": {
    "acme-portal": { "url": "https://developers.acme.com/mcp" }
  }
}
```

```bash
claude mcp add --transport http acme-portal https://developers.acme.com/mcp
```

An app that speaks stdio only, such as Claude Desktop, connects through [mcp-remote](https://www.npmjs.com/package/mcp-remote), a small program the app starts that forwards to the URL. This goes in Claude Desktop's own settings file:

```json title="claude_desktop_config.json"
{
  "mcpServers": {
    "acme-portal": {
      "command": "npx",
      "args": ["mcp-remote", "https://developers.acme.com/mcp"]
    }
  }
}
```

Other stdio-only apps take the same `mcpServers` entry in their own configuration file.

Without a token, the agent sees the public APIs and calls them without a reader's access token. A key set in the server's environment (see [Credentials of other kinds](#credentials-of-other-kinds)) is still sent, for every agent.

## Agents that sign in

On a portal with [sign-in](/docs/access/overview/), a signed-in reader opens the user menu and picks **Connect an AI agent**. **Get token** mints a token for their agents and shows the command that uses it:

```bash
npx mcp-remote https://developers.acme.com/mcp --header "Authorization: Bearer <token>"
```

With the token, the agent:

- sees the tools of every API the reader may see, and the workflows whose APIs they may all see;
- with [`auth.tryIt`](/docs/access/try-it/), calls the APIs with the reader's own access token, so the API's permission check applies to the agent as it does to **Try**.

The token is the reader's session (sealed like the cookies, never a copy of them) and lasts as long as the session. It opens exactly what the reader can see; a reader can't give an agent more than they have.

The reader's access token inside it is not refreshed. It usually expires sooner than the session; after that the agent still sees its tools, but its calls go out without that token and the API answers `401`. The reader then gets a new token from the menu.

## Credentials of other kinds

The reader's access token fills `oauth2`, `openIdConnect` and HTTP `bearer` schemes. For an API that takes an API key or HTTP Basic, set the credential in the environment of `rapidoc serve`, named like the exported project's: `MCP_AUTH_<SCHEME>`, with the scheme id in upper snake case (the scheme `partner_key` or `partnerKey` reads `MCP_AUTH_PARTNER_KEY`), and `MCP_AUTH_<SCHEME>_USERNAME` and `MCP_AUTH_<SCHEME>_PASSWORD` for Basic. Every agent then calls that API with the same key, with or without a token. The server sends an API nothing but these variables, whatever a spec calls its schemes.

## Where the API is

Tool calls go to the first server of each API's spec. A spec with a relative server URL (`/api/v1`) or no `servers` does not say where the API is: the tools of that API are left out of `/mcp`, and `rapidoc serve` logs which API and which variable when it starts. Set `MCP_BASE_URL_<API ID>` (the API's id in upper snake case, such as `MCP_BASE_URL_ORDERS`; `MCP_BASE_URL` when the portal has one API) to give the URL. The same variable overrides a spec's server, for example to send an environment's agents to its own API.

## From the command line

For an API that isn't in a portal, or to try its tools before building one, the CLI turns any OpenAPI spec into an MCP server:

```bash
npx rapidoc mcp export openapi.yaml --out-dir orders-mcp   # writes the server project
npx rapidoc mcp serve openapi.yaml                         # runs it over stdio, no files
```

`--base-url http://localhost:4010/orders` sends the calls to [`rapidoc mock`](/docs/tools/mock-server/), and `--arazzo flows.arazzo.yaml` adds the workflows as tools. The options, the credentials it reads and the agent configuration are on the [rapidoc mcp](https://rapidocui.com/docs/cli/mcp/) and [MCP Server](https://rapidocui.com/docs/mcp/) pages of the RapiDoc docs.

## Exported servers

Readers can also download a standalone MCP server for one API from its reference page (**Export MCP server**, with `rapidoc.mcp: true`): a small stdio server with the same manifest and runtime, for agents that run where the portal can't be reached.

## Static hosting, and turning it off

The `/mcp` endpoint needs `rapidoc serve`: a static host only returns files, so a portal on GitHub Pages, Netlify or S3 has no endpoint. Agents can still use its APIs through [exported servers](#exported-servers) or [`rapidoc mcp serve`](#from-the-command-line), which run on the agent's machine.

To serve a portal with `rapidoc serve` but without the endpoint, set `RAPIDOC_MCP=off` in its environment: no `/mcp`, no agent tokens, and no "connect an AI agent" section in the user menu. `rapidoc serve` prints `MCP: off` when it starts.
