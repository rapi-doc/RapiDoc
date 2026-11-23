# @rapidoc/cli

The `rapidoc` command: build a developer portal from OpenAPI specs and Markdown guides, and work with the specs themselves (preview, mock, validate, lint, bundle, MCP).

Docs: [portal.rapidocui.com](https://portal.rapidocui.com)

## Install

```bash
npm install -D @rapidoc/cli @rapidoc/portal
```

Or start a new portal, with both packages already listed:

```bash
npm create rapidoc@latest my-portal
```

Node.js 22.12 or later.

## Commands

| Command                              | What it does                                                                             |
| :----------------------------------- | :--------------------------------------------------------------------------------------- |
| `rapidoc init [dir]`                 | Scaffolds a portal, using the OpenAPI files already in the folder                        |
| `rapidoc dev [dir]`                  | Development server with live reload                                                      |
| `rapidoc build [dir]`                | Builds the static portal into `dist/`                                                    |
| `rapidoc serve [dist]`               | Serves a built portal and enforces sign-in and access rules                              |
| `rapidoc preview <spec>`             | Shows one spec in `<rapi-doc>`, reloading on save (no portal needed)                     |
| `rapidoc mock [dir\|spec…]`          | Mock server for the portal's APIs, each under `/<api id>`                                |
| `rapidoc validate [spec\|dir]`       | Validates one OpenAPI 2.0 / 3.x spec, or every spec in the portal                        |
| `rapidoc lint [spec\|dir]`           | Checks what a spec needs for a good portal: operationIds, summaries, examples            |
| `rapidoc bundle <spec>`              | Joins a spec split over several files into one                                           |
| `rapidoc pdf <spec>`                 | Writes the API reference of a spec as a PDF (needs `rapipdf`)                            |
| `rapidoc mcp <export\|serve> <spec>` | Turns a spec into MCP tools: export a server project, or serve over stdio                |
| `rapidoc migrate [dir]`              | Converts a Redocly or Zudoku project to `rapidoc.config.yaml` (`--force` to replace one) |
| `rapidoc doctor [dir]`               | Checks Node, package versions, the portal config and the browser bundle                  |
| `rapidoc completion <shell>`         | Prints a completion script for zsh, bash or fish                                         |

`rapidoc <command> --help` lists a command's options and examples. In a terminal, commands ask for what their options don't say; in CI, piped, or with `--yes` they never ask.

## Optional packages

The CLI loads these only for the commands that need them:

| Package                     | Needed by                                                    |
| :-------------------------- | :----------------------------------------------------------- |
| `@rapidoc/portal`           | `dev`, `build`, `migrate`, folder-wide `validate` and `mock` |
| `@rapidoc/server`           | `serve`                                                      |
| `@rapidoc/mock`             | `mock`                                                       |
| `@modelcontextprotocol/sdk` | `mcp serve`                                                  |

## Exit codes

`0` success, `1` problems in the input (specs, config, build), `2` a wrong command line.

## License

MIT

---

Part of the [RapiDoc family](https://rapidocui.com) of open-source tools for OpenAPI and Arazzo: [RapiDoc](https://rapidocui.com/rapidoc/) (`<rapi-doc>`), [RapiFlow](https://flow.rapidocui.com/), [RapiDoc Portal](https://portal.rapidocui.com/), [RapiMock](https://mock.rapidocui.com/), [RapiPdf](https://rapidocui.com/rapipdf/), the [RapiDoc CLI](https://rapidocui.com/cli/) and [integrations](https://rapidocui.com/integrations/) for Express, Fastify, Hono, FastAPI, ASP.NET Core, Go, Starlight, VitePress and Docusaurus.
