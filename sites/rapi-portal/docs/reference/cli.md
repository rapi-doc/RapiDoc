---
title: CLI
description: Every rapidoc command and option.
sidebar:
  order: 1
---

```bash
rapidoc <command> [options]
```

The command comes from the npm package `@rapidoc/cli`. In a project that has it installed, run it as `npx rapidoc <command>` or through the `npm run` scripts. Without it, run `npx @rapidoc/cli <command>`: `npx rapidoc` would look for the npm package `rapidoc`, the `<rapi-doc>` web component, which has no command.

| Command | Does |
| :--- | :--- |
| `init [dir]` | Scaffolds a portal in `dir` (default: the current folder), using the OpenAPI files already there. |
| `dev [dir]` | Starts the dev server with live reload on `http://localhost:4321`. |
| `build [dir]` | Builds the static portal into `dist/`. |
| `serve [dist]` | Serves a built portal, with sign-in and access rules. Default folder `dist`. |
| `preview <spec>` | Shows one spec (a file or URL) in `<rapi-doc>` on `http://localhost:4000`, reloading when a file in its folder changes. No portal needed. |
| `mock [dir \| spec...]` | Mock server for a portal's APIs, a folder of specs, or spec files, each under `/<api id>`. |
| `validate [spec \| dir]` | Validates one spec (a file or URL), or every spec and workflow file in a portal ([Validate](/docs/tools/validate/), [every option](https://rapidocui.com/docs/cli/validate/)). |
| `lint [spec \| dir]` | Checks what a spec needs to make a good portal: operationIds, summaries, examples, security, declared tags ([Lint](/docs/tools/lint/), [every option](https://rapidocui.com/docs/cli/lint/)). |
| `bundle <spec>` | Writes a spec split over several files as one: other-file `$ref`s become components ([Bundle](/docs/tools/bundle/), [every option](https://rapidocui.com/docs/cli/bundle/)). |
| `pdf <spec>` | Writes the API reference of a spec as a PDF; `--api <id>` takes an API of the portal ([every option](https://rapidocui.com/docs/cli/pdf/)). Needs `rapipdf`. |
| `mcp export <spec>` | Writes an MCP server project for the spec ([MCP server](/docs/tools/mcp-server/#from-the-command-line), [every option](https://rapidocui.com/docs/cli/mcp/)). |
| `mcp serve <spec>` | Runs that MCP server over stdio, without writing files. |
| `migrate [--from <src>]` | Writes `rapidoc.config.yaml` from a `zudoku` or `redocly` project (found in the folder when `--from` is left out). |
| `doctor [dir]` | Checks Node, the packages' versions, the portal config and the browser bundle; `--format json` for bug reports. |
| `completion <zsh \| bash \| fish>` | Prints a completion script for the shell ([Shell completion](https://rapidocui.com/docs/cli/reference/#shell-completion)). |
| `help [command]` | Shows help, or one command's options and examples (same as `rapidoc <command> --help`). |
| `--version`, `-v` | Shows the version. |

Options and arguments can come in any order (`rapidoc build --out-dir public ./portal`). A misspelled command or option is an error with a suggestion (`Unknown option --outdir. Did you mean --out-dir?`).

## Options of the portal commands

| Option | Commands | Meaning |
| :--- | :--- | :--- |
| `--out-dir <path>` | build | Output folder. Default `dist`. |
| `--port <number>` | dev, serve, mock | dev: default `4321`; serve: `$PORT` or `8080`; mock: `4010`. |
| `--host <host>` | serve, mock | Address to listen on. Default `$HOST` (serve), else `0.0.0.0`. |
| `--open` | dev | Open the page in the browser. |
| `--mount-path <path>` | serve | Path requests arrive under, when a proxy strips part of the portal's path. Default `$RAPIDOC_MOUNT_PATH`, else the path of `site.url`. |
| `--issuer <url>`, `--audience <id>` | mock | OpenID Connect issuer and audience of accepted tokens ([Mock server](/docs/tools/mock-server/#real-token-checks)). |
| `--debug` | dev, build | Keep the temporary build workspace and print its path. |
| `--title <title>` | init | Site title. |
| `--spec <file>` | init | An OpenAPI file to include; repeat for more. Default: every one found in the folder. |
| `--starter-spec` | init | Use the starter spec instead of the OpenAPI files found. |
| `--force`, `-f` | init | Overwrite existing files (in a terminal, lists them and asks first). |
| `--no-install` | init | Skip `npm install`. |
| `--from <src>` | migrate | `zudoku` or `redocly` ([Migrating](/docs/tools/migrate/)). |
| `--format pretty \| json` | doctor | `json` for bug reports. |
| `--help`, `-h` | all | Show the command's help instead of running it. |
| `--quiet`, `-q` | all | Print errors and warnings only. |
| `--yes`, `-y` | all | Don't ask anything: take the default answer to every question. |

The options of `preview`, `validate`, `lint`, `bundle`, `pdf` and `mcp`, which work on any spec, are in the RapiDoc docs: [All Commands & Options](https://rapidocui.com/docs/cli/reference/).

## Questions

In a terminal, commands ask for what their options don't say, and `rapidoc` alone shows a menu of the common commands. When the output is piped, `CI` is set, or `--yes` is given, they never ask: they use the defaults, or stop and name the option to pass. Every question has an option, so any run can be scripted.

| Command | Asks | Option that answers it |
| :--- | :--- | :--- |
| `init` | The site title, which of the OpenAPI files found to include, whether to run `npm install`. Then prints the command that does the same without questions. | `--title`, `--spec` / `--starter-spec`, `--no-install` |
| `init --force` | Whether to replace the existing files it lists. | `--yes` |
| `migrate` | Which project to migrate, when `--from` is left out (it looks for `redocly.yaml` and `zudoku.config.*`); whether to replace an existing `rapidoc.config.yaml`. | `--from`, `--yes` |
| `dev`, `serve`, `mock` | Whether to use the next free port when the port is taken. Without a terminal, `serve` and `mock` stop (`dev` moves to a free port by itself). | `--port`, `--yes` |

`Ctrl+C` on a question cancels the command (exit code `130`).

## Exit codes, packages and shell completion

`0` success, `1` a problem in the input (an invalid spec or config, a failed build, a missing package), `2` a wrong command line, `130` cancelled at a question. The CLI loads `@rapidoc/portal`, `@rapidoc/server` and `@rapidoc/mock` only for the commands that need them, and `rapidoc completion zsh|bash|fish` prints a completion script. Each is described in [All Commands & Options](https://rapidocui.com/docs/cli/reference/).

## Examples

```bash
rapidoc init my-portal --title "Acme Developer Portal"
rapidoc dev
rapidoc build ./my-api-portal
rapidoc serve dist --port 8080
rapidoc mock --issuer https://example.us.auth0.com/ --audience https://api.example.com
rapidoc mock ./specs --port 4011
rapidoc validate ./specs/orders-api.yaml
rapidoc lint --strict
rapidoc bundle ./specs/orders-api.yaml -o dist/orders-api.json
rapidoc migrate --from zudoku
```
