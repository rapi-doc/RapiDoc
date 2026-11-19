---
title: Migrating
description: Move a Zudoku or Redocly portal to RapiDoc Portal.
---

`rapidoc migrate` reads your existing portal's config and writes a `rapidoc.config.yaml` next to it.

```bash
npx @rapidoc/cli migrate                  # finds redocly.yaml or zudoku.config.* and asks to confirm
npx @rapidoc/cli migrate --from zudoku
npx @rapidoc/cli migrate --from redocly
```

Run it in the project folder. Use `npx @rapidoc/cli`, not `npx rapidoc`: before the CLI is installed, `npx rapidoc` looks for the npm package `rapidoc`, the `<rapi-doc>` web component, which has no command. Without `--from` it looks for a Redocly (`redocly.yaml`) or Zudoku (`zudoku.config.*`) config and asks before migrating it; in CI or a script, pass `--from` (or `--yes` to take the one found). An existing `rapidoc.config.yaml` is replaced, after asking in a terminal. It lists anything it could not convert; fix those before you build.

:::caution
It overwrites an existing `rapidoc.config.yaml`. Commit or copy yours first.
:::

## From Zudoku

Reads `zudoku.config.ts`, `.mjs` or `.js`.

- Zudoku's top-level navigation items become the header tabs.
- The APIs become entries in `apis:`. APIs that had a custom path get a [redirect](/docs/configuration/docs-search-redirects/#redirects), because every reference page is `/apis/<id>`.
- An `input` list (one spec per version) becomes [`versions:`](/docs/api-reference/versions/), and each version's old URL gets a redirect. An input with `?prefix=`, which shows part of one file as a version, isn't supported: the query is dropped, so that version shows the whole file, and the migration warns about it.
- Imports from `zudoku/ui/...` and `<Stepper>` in MDX pages are rewritten at build time, so the pages work as they are.
- Zudoku's callout types (`info`, `warning`, `sparkles`, `rocket`, ...) render as before.
- `basePath` with `canonicalUrlOrigin` becomes the path of [`site.url`](/docs/configuration/site/#serving-under-a-path); a `basePath` without the origin gets a warning to set `site.url`. A `metadata.title` with `%s` becomes `site.titleTemplate`.

## From Redocly

Reads `redocly.yaml`, plus `sidebars.yaml` if it is there.

- The sidebars become a Documentation tab.
- The APIs become an API Catalog tab.
- `theme.openapi` becomes the theme and [`rapidoc:` attributes](/docs/api-reference/rapidoc-attributes/).
- `seo.siteUrl`, `seo.image` and `seo.projectTitle` become `site.url`, `site.image` and `site.titleTemplate`; `scripts.head` and `links` become [`head`](/docs/configuration/site/#head-tags) entries.

## After migrating

Install the CLI and the portal engine in the project, then check and preview the result:

```bash
npm install -D @rapidoc/cli @rapidoc/portal
npx rapidoc validate
npx rapidoc dev
```

Then check the header tabs and sidebars, and move remaining settings by hand with the [configuration reference](/docs/reference/config/).
