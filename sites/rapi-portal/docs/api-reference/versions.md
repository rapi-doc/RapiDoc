---
title: API versions
description: Publish several versions of one API, each with its own URLs, and a version picker on the reference page.
---

An API can have one spec per version. Each version gets its own reference pages, and a version picker at the top of the API's sidebar switches between them. Readers land on the current version; older ones stay one click away.

```yaml title="rapidoc.config.yaml"
apis:
  - id: payments
    title: Payments API
    versions:
      - spec: ./specs/payments-v3.yaml
        version: v3
        label: v3 (latest)
      - spec: ./specs/payments-v2.yaml
        version: v2
      - ./specs/payments-v1.yaml
```

Use `versions:` instead of `spec:`: an API has one or the other. **The first version is the default.**

| Key | Meaning |
| :--- | :--- |
| `spec` | **Required.** The OpenAPI file of this version, relative to the config, or a URL. |
| `version` | The version's part of the URL: lowercase letters, digits, dots and dashes (`v2`, `2.1.0`, `2024-06-01`). Default: `info.version` of the spec. Required when `spec` is a URL. |
| `label` | The text in the version picker. Default: `info.version` of the spec. |

A version can also be just the path of its spec, like `./specs/payments-v1.yaml` above: its `version` and `label` both come from the spec's `info.version`. If that isn't a valid URL part (`Version 1`, say), the build asks you to set `version`.

`title`, `description` and `category` belong to the API, not a version. Their defaults come from the spec of the default version.

## URLs

| URL | Shows |
| :--- | :--- |
| `/apis/<id>`, `/apis/<id>/<tag>` | The default version. |
| `/apis/<id>/<version>`, `/apis/<id>/<version>/<tag>` | Every other version. |
| `/apis/<id>/<default version>/...` | Redirects to the same page without the version, and keeps the `#operation`. |

So `/apis/payments` always shows the current version, and existing links keep working when you add versions. A link that names a version, such as `/apis/payments/v3/charges`, keeps working too: while v3 is the default it redirects to `/apis/payments/charges`, and once v4 takes over it is v3's own page.

A version can't have the same name as a tag page of the default version: `version: refunds` next to a default version with a `Refunds` tag would share `/apis/payments/refunds`, and the build stops with an error.

## The version picker

The picker sits at the top of the API's sidebar, above the endpoint filter, when the API has more than one version. Choosing a version opens the same tag, and the same operation, in that version when it has the tag, and the version's overview when it doesn't.

Pages of a version other than the default start with a note that names the current version and links to it.

## Specs

The default version's spec is published at `/specs/<id>.<ext>`, as for an API with one spec. Every version is also at `/specs/<id>/<version>.<ext>`, so a tool that needs one version, such as a client generator, has a URL that doesn't change when the default does.

## Navigation, catalog, search and embeds

- **Navigation**: `api: payments` links to the default version. Add `version:` to link to another one, for example a tab for an older version that many readers still use:

  ```yaml
  navigation:
    - label: Payments
      api: payments
    - label: Payments v2
      api: payments
      version: v2
  ```

  A tab for one version is the current tab on that version's pages; the API's other pages belong to its main tab.
- **Catalog**: one card per API, linking to the default version and showing its label and how many versions there are.
- **Search**: finds operations of every version. Results from a version other than the default say which version they are from.
- **Embedded operations**: `{% api-operation spec="payments" ... /%}` shows the operation from the default version; add `version="v2"` for another one. See [Embedding operations](/docs/writing/embedding-operations/).

## Access rules

A rule on `/apis/<id>/**` covers every version of the API and every version's spec. To protect only one version, for example a beta, write a rule for its URLs:

```yaml title="rapidoc.config.yaml"
access:
  rules:
    - path: /apis/payments/v4-beta/**
      allow:
        groups: [beta-testers]
```

Each spec follows the pages of its version, so `/specs/payments/v4-beta.yaml` is protected with them. See [Access rules](/docs/access/access-rules/).

## Coming from Zudoku

`rapidoc migrate --from zudoku` turns an `input` list into `versions:`: plain paths stay paths, and `{ path, label, input }` becomes `{ version, label, spec }`. Old version URLs get redirects. A `?prefix=` input, which shows part of one file as a version, isn't supported: the migration drops the query and warns. See [Migrate](/docs/tools/migrate/).
