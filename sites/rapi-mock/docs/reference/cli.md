---
title: CLI options
description: Every option of rapidoc mock.
tableOfContents: false
---

```bash
npx rapidoc mock [dir|spec...] [options]
```

A portal folder mocks the local specs in its `apis:`. A folder without `rapidoc.config.yaml` is mocked file by file, as are spec files given by name. Each API is served under `/<api id>`.

A spec can also be an `http://` or `https://` address, read once at start: a published spec, or the one your API's own server serves. It is named after its file, like a local one:

```bash
npx rapidoc mock https://example.com/specs/orders-api.yaml --stateful   # served under /orders-api
npx rapidoc mock http://localhost:8000/openapi.json                     # served under /openapi
```

Relative `$ref`s in it are read from the same server. A `$ref` to another server is read only when that server is on the public internet, not `localhost` or a private network. With `--stateful`, `mock.config.yaml` is looked for in the current folder (or name it with `--mock-config`).

| Option | Environment variable | Meaning |
| :--- | :--- | :--- |
| `--port <number>` | | Port to listen on. Default `4010`; if it is taken, the next free port is offered. |
| `--host <host>` | | Address to listen on. Default `localhost`: this machine only. In a container or on a shared test server, pass `--host 0.0.0.0`; the mock and its [control API](/docs/reference/control-api/) are then open to that network. |
| `--stateful` | | [Keep state](/docs/state/overview/): writes change stored records that reads and lists return. |
| `--rows <number>` | | With `--stateful`: seed records per resource. Default `10`. |
| `--seed <number>` | | Seed for generated data. Default `1`. |
| `--mock-config <file>` | | With `--stateful`: your [corrections](/docs/correcting/config-file/). Default: `mock.config.yaml` beside the spec or in the folder. |
| `--delay <ms>` | | Wait this long before every API response. Default `0`. |
| `--stream-interval <ms>` | | Gap between the items of a streamed response. Default `300`. |
| `--issuer <url>` | `RAPIDOC_MOCK_ISSUER` | OpenID Connect issuer whose access tokens are accepted. |
| `--audience <id>` | `RAPIDOC_MOCK_AUDIENCE` | The `aud` tokens must have. |

## Related commands

| Command | Use |
| :--- | :--- |
| `rapidoc lint <spec> --stateful` | Report what the mock had to assume about a spec. See [Lint your spec](/docs/correcting/lint/). |
| `rapidoc validate <spec>` | Check that a spec is valid OpenAPI. |
| `rapidoc bundle <spec>` | Make one file from a spec split over several. |

The other commands of the `rapidoc` CLI are documented at [rapidocui.com](https://rapidocui.com/docs/cli/).
