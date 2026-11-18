---
title: CLI options
description: Every option of rapidoc mock.
---

```bash
npx rapidoc mock [dir|spec...] [options]
```

A portal folder mocks the local specs in its `apis:`. A folder without `rapidoc.config.yaml` is mocked file by file, as are spec files given by name. Each API is served under `/<api id>`.

| Option | Environment variable | Meaning |
| :--- | :--- | :--- |
| `--port <number>` | | Port to listen on. Default `4010`; if it is taken, the next free port is offered. |
| `--host <host>` | | Address to listen on. Default `0.0.0.0`. |
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
