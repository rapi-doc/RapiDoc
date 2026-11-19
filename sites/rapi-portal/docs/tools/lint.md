---
title: Lint
description: Check what your portal's specs need to make good API pages, beyond being valid OpenAPI.
---

```bash
npx rapidoc lint                          # every API in rapidoc.config.*
npx rapidoc lint --strict --format sarif > rapidoc.sarif
```

A valid spec can still make a poor portal: operations without an `operationId` get page URLs that change when their summary is edited, bodies without examples leave **Try** and the mock server with nothing to show, tags that aren't declared have no description for their sidebar group. `rapidoc lint` finds those, after running [`validate`](/docs/tools/validate/)'s check.

The rules, their defaults, the output and the options are on the [rapidoc lint](https://rapidocui.com/docs/cli/lint/) page of the RapiDoc docs (`rapidoc lint --rules` prints them too).

## Settings

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

## In CI

Exit code `1` on errors (or warnings with `--strict`), `2` for a wrong rule name or severity:

```yaml title=".github/workflows/docs.yml"
# in a job's steps:
- run: npx rapidoc lint --strict
```

Upload a SARIF report to see the findings on the pull request, as the [Validate](/docs/tools/validate/#in-ci) page shows.

A portal folder needs `@rapidoc/portal`, to read the `apis:` list; one spec or a URL needs `@rapidoc/cli` alone.
