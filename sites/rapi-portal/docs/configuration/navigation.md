---
title: Navigation
description: Header tabs and the sidebar of each documentation tab.
---

`navigation` is the header's second row. Each entry is a tab, and the kind of tab comes from its keys.

```yaml title="rapidoc.config.yaml"
navigation:
  - label: Documentation       # documentation tab with its own sidebar
    icon: book
    items:
      - getting-started
      - label: Shipping
        items:
          - guides/first-shipment
          - { label: Ship states, href: /docs/ship-states }
      - label: Support
        collapsed: true
        autogenerate: support
  - label: Changelog           # documentation tab: every page in docs/changelog/
    autogenerate: changelog
  - label: Shipments           # API tab: one API's reference page
    icon: code
    api: shipments
  - label: API Catalog         # the catalog
    icon: squares-four
    catalog: true
  - label: Blog                # a link
    href: https://example.com/blog
```

## Tab kinds

| Key | Tab |
| :--- | :--- |
| `items` | Documentation tab; `items` is its sidebar. |
| `autogenerate: <folder>` | Documentation tab whose sidebar is every page in that folder of `docs/`. |
| `api: <id>` | The reference page of the API with that id, `/apis/<id>`. Add `version: <version>` to link to one of its [versions](/docs/api-reference/versions/) other than the default. |
| `catalog: true` | The API catalog, `/catalog`. |
| `href` | A link to another page or site. |

Every tab has a `label`, and can have an `icon` and a `badge`. Each tab must have exactly one of these keys; the build tells you when there are none or several.

## Sidebar items

Inside a documentation tab's `items`:

| Item | Meaning |
| :--- | :--- |
| `getting-started` | A doc page by its path in `docs/`, without the extension. The label is the page title. |
| `{ label: Intro, slug: getting-started }` | The same, with your own label. |
| `{ label: Status, href: https://... }` | A link. |
| `{ label: Guides, items: [...] }` | A group. Groups nest. |
| `{ label: Support, autogenerate: support }` | A group of every page in `docs/support/`. |
| `{ label: Orders API, api: orders }` | A link to an API's reference page. Add `version: v1` for one of its [versions](/docs/api-reference/versions/). |

Groups take `collapsed: true` to start closed, and any item can have a `badge` and an `icon`, a [Phosphor](https://phosphoricons.com) icon name shown before its label:

```yaml title="rapidoc.config.yaml"
navigation:
  - label: Documentation
    icon: book
    items:
      - label: Get started
        icon: rocket-launch      # any Phosphor icon name
        items:
          - { slug: getting-started, icon: lightning }
          - { label: Status, href: https://status.acme.com, icon: pulse }
```

A page needs the object form (`{ slug, icon }`) to have an icon. Pages of an `autogenerate` group have none; the group itself can.

## Which tab is active

The active tab is the one whose sidebar has the current page. Two rules decide the rest:

- Docs pages that are in no tab's sidebar belong to the **first documentation tab**.
- APIs without a tab of their own belong to the **catalog tab**.

Previous and next links at the bottom of a page stay inside the current tab.

## On small screens

Below 800px the tabs row is hidden. The menu button opens a drawer with the tabs, the header links, and the current tab's sidebar.
