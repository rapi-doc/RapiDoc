---
title: Validate
description: Check your portal's OpenAPI specs and workflow files against the specification, locally and in CI.
---

```bash
npx rapidoc validate                       # every local spec in apis:, and the workflow files
npx rapidoc validate ./specs/orders.yaml   # one file
```

In a portal folder, `rapidoc validate` checks every local spec in `apis:` strictly against the OpenAPI Specification (required fields and types, path parameters, `$ref`s), with file, line and column for each error. It also warns about operations without an `operationId` (their page URLs change when their summary is edited), and checks that the steps of each workflow file resolve against your APIs.

What it checks, its output and its options (`--format json | sarif`, `--strict`, `--remote`) are described on the [rapidoc validate](https://rapidocui.com/docs/cli/validate/) page of the RapiDoc docs.

## In CI

It exits with code `1` when a spec has errors (or warnings, with `--strict`), so it can gate a pull request:

```yaml title=".github/workflows/docs.yml"
# in a job's steps:
- run: npm ci
- run: npx rapidoc validate
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

Projects created with `npm create rapidoc` have it as `npm run validate`.

Validating one file needs only `@rapidoc/cli`. Validating a whole portal also reads the config, so it needs `@rapidoc/portal`.
