---
title: Header
description: The header - links, buttons, dropdowns, mega-menus, where the tabs go and the theme switcher.
---

The header has two rows:

1. **Row 1**: the logo, the search, `header.links` and the theme switcher.
2. **Row 2**: one tab per `navigation` entry. See [Navigation](/docs/configuration/navigation/).

On narrow screens both rows collapse into the menu.

To list the tabs above the sidebar instead of in a second row, see [Tabs above the sidebar](#tabs-above-the-sidebar).

```yaml title="rapidoc.config.yaml"
header:
  links:
    - label: Status
      href: https://status.acme.com
    - label: Resources
      items:
        - { label: Changelog, href: /docs/changelog }
        - { label: Support, href: /docs/support }
    - label: Sign up
      href: https://dashboard.acme.com/signup
      style: primary
```

## Links and buttons

A link has a `label` and an `href`. `style` makes it a button:

| `style` | Looks like |
| :--- | :--- |
| `link` (default) | Plain text link |
| `button` | Outlined button |
| `primary` | Filled button in the accent color |

Add an `icon` to show a Phosphor icon before the label.

Two more keys work on any link, with or without a dropdown:

| Key | Meaning |
| :--- | :--- |
| `badge` | A small label after the text, such as `New` or `Beta`. |
| `position` | `start` puts the link after the logo, left of the search. `end` (default) keeps it right of the search. |

```yaml title="rapidoc.config.yaml"
header:
  links:
    - { label: Docs, href: /docs, position: start }
    - { label: Changelog, href: /docs/changelog, position: start, badge: New }
    - { label: GitHub, href: https://github.com/acme, icon: github-logo, style: button }
```

## Dropdown menus

A link with `items` instead of `href` opens a menu. How it looks follows from what you write: start with a list of links, and add to it when you need more.

### A simple list

Items with only a `label` and an `href` make a narrow, one-column list:

```yaml title="rapidoc.config.yaml"
header:
  links:
    - label: Resources
      items:
        - { label: Changelog, href: /docs/changelog }
        - { label: Status, href: https://status.acme.com }
        - { label: Support, href: /docs/support }
```

### Cards

Give any item an `icon` or a `description`, and the menu becomes cards, two across:

```yaml title="rapidoc.config.yaml"
header:
  links:
    - label: Solutions
      items:
        - label: Getting Started
          icon: rocket
          description: Quickstart guide and tutorials
          href: /docs/getting-started
        - label: Payments API
          icon: credit-card
          description: Charge cards and wallets
          href: /apis/payments
          badge: New
```

A card without an `icon` gets a default one. A card can have its own `items`: shortcut links shown under it.

### More or fewer columns

`columns` sets how many items sit side by side, from 1 to 4. Without it, a simple list has 1 column and cards have 2.

```yaml title="rapidoc.config.yaml"
header:
  links:
    - label: Solutions
      columns: 3
      items:
        - { label: Getting Started, icon: rocket, description: Quickstart guide, href: /docs/getting-started }
        - { label: Payments API, icon: credit-card, description: Charge cards, href: /apis/payments }
        - { label: Webhooks, icon: webhooks-logo, description: Get notified, href: /docs/webhooks }
```

### Columns with headings

When each column needs a title, use `groups` instead of `items`. Every group is a column: its `label` is the heading and its `items` are listed under it. A group can hold cards or plain links.

```yaml title="rapidoc.config.yaml"
header:
  links:
    - label: Products
      groups:
        - label: APIs
          items:
            - label: Payments
              icon: credit-card
              description: Charge cards and wallets
              href: /apis/payments
              badge: v2
        - label: Guides
          items:
            - { label: Quickstart, href: /docs/quickstart }
            - { label: Webhooks, href: /docs/webhooks }
      footer:
        label: See all products
        href: /catalog
```

A link takes `items` or `groups`, not both, and `columns` goes with `items` only: the build stops with a message otherwise.

### Menu keys

| Key | On | Meaning |
| :--- | :--- | :--- |
| `items` | The link | The menu's items, as a list or as cards. |
| `columns` | The link | Items side by side, 1 to 4 (with `items`). |
| `groups` | The link | Columns with headings: `{ label, items }` each (instead of `items`). |
| `footer` | The link | One link under the whole menu: `{ label, href, icon }`. |
| `label`, `href` | An item | **Required.** An `href` on another site opens in a new tab. |
| `icon` | An item | Phosphor icon name. |
| `description` | An item | One line under the label. |
| `badge` | An item | Small label next to the item: `New`, or `{ text: Beta, variant: caution }`. |
| `items` | An item | Shortcut links under a card: `{ label, href, icon }`. |

On narrow screens a menu's items are listed under the link's label, without columns or group headings.

The menus follow the WAI-ARIA disclosure pattern: they open on click or Enter, close on Escape, and focus alone never opens them.

## Tabs above the sidebar

By default the `navigation` tabs are a second row of the header. With `tabs: sidebar` that row is gone, and the tabs are listed above the pages in the sidebar, each with its icon and the current one marked. This suits a site whose tabs are products or sections a reader switches between while reading.

```yaml title="rapidoc.config.yaml"
header:
  tabs: sidebar
```

The list shows on documentation and API reference pages, which have a sidebar. Pages without one, such as the catalog, show no tabs, so link to the sections from `header.links` as well.

## Icons

Every icon name in the config is a [Phosphor](https://phosphoricons.com) icon name: `book`, `code`, `rocket`, `package`, `lightning`, `github-logo`, and so on. An unknown name shows a question mark and a build warning.
