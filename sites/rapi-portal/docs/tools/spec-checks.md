---
title: Validate, lint and bundle
description: Check your portal's OpenAPI specs and Arazzo specs, lint what they need for good API pages, and bundle a spec split over several files, locally and in CI.
---

The RapiDoc CLI's spec commands work on a whole portal: run in a portal folder, they take the APIs from `rapidoc.config.*`. Every option, the output formats and the lint rules are in the [RapiDoc CLI docs](https://rapidocui.com/docs/cli/); this page covers what is particular to a portal.

```bash
npx rapidoc validate                       # every local OpenAPI spec in apis:, and the Arazzo specs
npx rapidoc lint                           # every API in rapidoc.config.*
npx rapidoc bundle --api orders -o dist/orders.yaml
```

A portal folder needs `@rapidoc/portal` installed, to read the `apis:` list; one spec or a URL needs `@rapidoc/cli` alone.

## Validate

`rapidoc validate` checks every local OpenAPI spec in `apis:` strictly against the OpenAPI Specification (required fields and types, path parameters, `$ref`s), with file, line and column for each error. It also warns about operations without an `operationId` (their page URLs change when their summary is edited), and checks that the steps of each Arazzo spec resolve against your APIs. [Every option](https://rapidocui.com/docs/cli/validate/).

## Lint

A valid spec can still make a poor portal: operations without an `operationId` get page URLs that change when their summary is edited, bodies without examples leave **Try** and the mock server with nothing to show, tags that aren't declared have no description for their sidebar group. `rapidoc lint` finds those, after running `validate`'s check. [The rules and options](https://rapidocui.com/docs/cli/lint/); `rapidoc lint --rules` prints them too.

Set severities in `rapidoc.config.yaml`, for every API or per API. Most specific wins: `--rule` on the command line, then the API's entry under `lint.apis`, then `lint.rules`, then the defaults.

```yaml title="rapidoc.config.yaml"
lint:
  rules:
    operation-description: warn
    no-unused-components: off
  apis:
    legacy: # an API that can't meet a rule yet
      operation-operationId: off
```

## Bundle

`rapidoc bundle` writes a spec split over several files as one document: every `$ref` to another file becomes a component. The portal itself follows `$ref`s across files, so it doesn't need this; code generators, gateways and review tools often do. `--api <id>` bundles the spec of an API in `rapidoc.config.*` (its default version) instead of a file. [Every option](https://rapidocui.com/docs/cli/bundle/).

## In CI

`validate` and `lint` exit with code `1` on errors (or warnings, with `--strict`), so they can gate a pull request; `lint` exits with `2` for a wrong rule name or severity. Projects created with `npm create rapidoc` have `npm run validate`.

```yaml title=".github/workflows/docs.yml"
# in a job's steps:
- run: npm ci
- run: npx rapidoc validate
- run: npx rapidoc lint --strict
- run: npx rapidoc build
```

To see the problems on the pull request itself, upload a SARIF report to GitHub code scanning:

```yaml title=".github/workflows/docs.yml"
permissions:
  security-events: write
# in a job's steps:
- run: npx rapidoc validate --format sarif > rapidoc.sarif || true
- uses: github/codeql-action/upload-sarif@v3
  with:
    sarif_file: rapidoc.sarif
```
