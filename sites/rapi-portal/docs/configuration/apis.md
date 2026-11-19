---
title: APIs
description: Add OpenAPI specs to the portal - ids, titles, categories, versions and remote specs.
---

```yaml title="rapidoc.config.yaml"
apis:
  - id: shipments
    spec: ./specs/shipments.yaml
    category: Core
  - id: billing
    spec: https://api.acme.com/billing/openapi.json
    title: Billing
    description: Invoices and payments.
    category: Finance
```

| Key | Meaning |
| :--- | :--- |
| `id` | **Required.** Lowercase letters, digits and dashes. The reference page is `/apis/<id>`. Tabs (`api: <id>`) and embedded operations (`spec="<id>"`) refer to it. |
| `spec` | An OpenAPI 3.0, 3.1 or Swagger 2.0 file, relative to the config, or a URL. YAML or JSON. Required unless the API has `versions`. |
| `versions` | One spec per version, instead of `spec`. See [API versions](/docs/api-reference/versions/). |
| `title` | Default: `info.title` of the spec. |
| `description` | Default: `info.description` of the spec. Shown on the catalog card. |
| `category` | The group on the [catalog page](/docs/api-reference/catalog/). Default `General`. |

## What each API gets

- A reference page at `/apis/<id>`, with one page per tag below it: `/apis/<id>/<tag>`. See [Reference pages](/docs/api-reference/reference-pages/).
- A card in the catalog at `/catalog`.
- Its spec published at `/specs/<id>.<ext>`, so readers and tools can download it.
- Its operations in the site search.

## Versions

To publish several versions of one API, list a spec per version under `versions:`. The first is the default, at `/apis/<id>`; the others are at `/apis/<id>/<version>`, with a version picker on the reference page:

```yaml title="rapidoc.config.yaml"
apis:
  - id: payments
    versions:
      - ./specs/payments-v3.yaml
      - ./specs/payments-v2.yaml
```

See [API versions](/docs/api-reference/versions/).

## Local or remote specs

Local specs are read at build time. Relative `$ref`s to other files resolve, and the spec is published with the site.

A remote spec (a URL) is loaded by the reader's browser from where it is hosted. The build doesn't read it, so:

- Set `title` and `description` yourself; without them the catalog shows the id.
- Its operations are not in the site search.
- `rapidoc validate` and `rapidoc mock` skip it.
- [Access rules](/docs/access/access-rules/) can't protect it. Protect it where it is hosted.

## Changing an id

The id is in every URL of the API. To keep old links working after you rename one, add a [redirect](/docs/configuration/docs-search-redirects/#redirects).
