---
title: Workflows
description: Add Arazzo workflow files to the portal - drawn as diagrams in your docs, runnable from the browser, and exported as MCP tools.
---

```yaml title="rapidoc.config.yaml"
workflows:
  - file: ./workflows/checkout.arazzo.yaml
  - id: returns
    file: ./workflows/returns-and-refunds.arazzo.yaml
    sources:
      storeAPI: orders
```

| Key | Meaning |
| :--- | :--- |
| `file` | **Required.** An [Arazzo 1.x](https://spec.openapis.org/arazzo/latest.html) file, YAML or JSON, relative to the config. |
| `id` | Lowercase letters, digits and dashes. Default: the file name without `.arazzo.yaml`. The `workflow` tag refers to it (`file="<id>"`), and the file is published at `/workflows/<id>.arazzo.yaml`. |
| `sources` | Which API in `apis:` each of the file's source descriptions is: `<source name>: <api id>`. A source whose name is already an API id needs no entry. |

## What a workflow file gets

- Its workflows can be drawn in any docs page with [`{% workflow %}`](/docs/writing/markdoc/#workflow): a diagram of the steps, the values passed between them and the success and failure actions, generated at build time.
- **Run workflow** on that diagram runs the steps from the reader's browser against the servers in the specs, with the credentials the reader types in.
- The portal's MCP export turns each workflow into one tool, with the workflow's inputs as the tool's arguments.

## Sources

An Arazzo file names the APIs it uses in `sourceDescriptions`. The portal resolves each source to one of your APIs and reads the operations from that API's spec (its default [version](/docs/api-reference/versions/)), so the `url` in the file does not have to be reachable at build time:

```yaml title="workflows/checkout.arazzo.yaml"
sourceDescriptions:
  - name: orders            # an API id: resolves to apis[].id "orders"
    url: ../specs/orders.yaml
    type: openapi
  - name: storeAPI          # not an API id: map it in sources
    url: https://example.com/store.json
    type: openapi
```

The `url` still matters when a reader runs the workflow from a docs page: the first source is replaced by the API's published spec, and the others are fetched relative to the published workflow file. Writing them relative to the file (`../specs/orders.yaml`) works both on disk and once published.

## Run against the mock

**Run workflow** sends each step's request to the first server of that step's API, from the reader's browser. List [`rapidoc mock`](/docs/tools/mock-server/) first in each spec's `servers`, and every workflow on your docs pages runs with no backend:

```yaml title="specs/orders.yaml"
servers:
  - url: http://localhost:4010/orders
    description: Mock server (rapidoc mock)
  - url: https://api.acme.com/v1
```

```bash
npx rapidoc mock
```

A workflow that spans several APIs works the same way: each API answers under its own `/<api id>`.

- **Credentials**: the run panel has one field per security scheme of the workflow's APIs. Values stay in the page. Started with `--issuer`, the mock checks a pasted token's signature, audience and scopes, so a step the reader isn't allowed to call fails with `403`, and the workflow follows its `onFailure` actions.
- **Failure paths**: the mock answers each operation's documented success response. To walk a failure branch, open **Mock Response Status** in the run panel and give a step the status it should get (`404`, or `503, 200` for a first attempt that fails and a retry that succeeds); the run sends it to the mock as `Prefer: code=<status>`.
- **Before you publish**: move the real server first, or the published portal runs workflows against `localhost`.

## Checks

`rapidoc validate`, `rapidoc dev` and `rapidoc build` warn about a workflow the runtime cannot run and leave it out of the MCP export: a step whose operation is not in the API's spec, a source that matches no API, a step that calls another workflow, or `regex`, `jsonpath` and `xpath` criteria (only simple conditions such as `$statusCode == 200` run for now). The diagram still draws such a workflow.

## Access

With [sign-in and access rules](/docs/access/overview/), a workflow file follows its APIs: it is public when every API it uses is public, else it is served from the zone of the first API that is not.
