---
title: API catalog
description: The /catalog page - every API, grouped by category.
---

`/catalog` lists every API of the portal as a card, grouped by `category`. Each card shows the API's title, version and description, and links to its reference page.

```yaml title="rapidoc.config.yaml"
apis:
  - id: shipments
    spec: ./specs/shipments.yaml
    category: Shipping
  - id: tracking
    spec: ./specs/tracking.yaml
    category: Shipping
  - id: billing
    spec: ./specs/billing.yaml
    category: Finance
```

| Card | Comes from |
| :--- | :--- |
| Title | `title` in `apis:`, else `info.title` of the spec |
| Version | `info.version` of the spec. For an API with [versions](/docs/api-reference/versions/): the default version's label and how many versions there are. |
| Description | `description` in `apis:`, else `info.description` of the spec |
| Group | `category` in `apis:`, default `General` |

## A tab for the catalog

```yaml title="rapidoc.config.yaml"
navigation:
  - label: API Catalog
    icon: squares-four
    catalog: true
```

APIs that don't have a tab of their own belong to the catalog tab: on their reference pages, the catalog tab is the active one.

`/apis` always redirects to `/catalog`.

## With access rules

APIs a reader may not open stay in the catalog with a lock icon, so readers know they exist and can sign in. See [Access rules](/docs/access/access-rules/).
