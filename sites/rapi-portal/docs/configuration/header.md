---
title: Header
description: The first header row - links, buttons, dropdowns, mega-menus and the theme switcher.
---

The header has two rows:

1. **Row 1**: the logo, the search, `header.links` and the theme switcher.
2. **Row 2**: one tab per `navigation` entry. See [Navigation](/docs/configuration/navigation/).

On narrow screens both rows collapse into the menu.

```yaml title="rapidoc.config.yaml"
header:
  themeSwitcher: true
  links:
    - label: Status
      href: https://status.acme.com
    - label: Solutions
      items:
        - label: Tracking
          icon: globe
          description: Real-time tracking
          href: /docs/tracking
          items:
            - { label: Webhooks, icon: webhooks-logo, href: /docs/webhooks }
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

## Dropdowns and mega-menus

A link with `items` instead of `href` opens a dropdown. When any item has an `icon` or a `description`, the dropdown becomes a mega-menu with a card per item.

Each mega-menu item can have its own `items`: shortcut links shown under it.

| Item key | Meaning |
| :--- | :--- |
| `label`, `href` | **Required.** |
| `icon` | Phosphor icon name. |
| `description` | One line under the label. |
| `badge` | Small label next to the item: `New`, or `{ text: Beta, variant: caution }`. |
| `items` | Shortcut links: `{ label, href, icon }`. |

The menus follow the WAI-ARIA disclosure pattern: they open on click or Enter, close on Escape, and focus alone never opens them.

## Icons

Every icon name in the config is a [Phosphor](https://phosphoricons.com) icon name: `book`, `code`, `rocket`, `package`, `lightning`, `github-logo`, and so on. An unknown name shows a question mark and a build warning.
