---
title: RapiDoc attributes
description: Change how API reference pages render with the rapidoc key.
---

The reference pages are the `<rapi-doc>` web component. The `rapidoc:` key sets its attributes for every API reference page:

```yaml title="rapidoc.config.yaml"
rapidoc:
  render-style: read        # read | view | focused
  schema-style: tree        # tree | table
  default-schema-tab: example
  schema-expand-level: 2
  allow-server-selection: true
  font-size: largest
```

Values are strings, numbers or booleans. Every attribute is described in the [RapiDoc API reference](https://rapidocui.com/api). `theme` picks one of RapiDoc's built-in themes for the reference pages (see [API reference colors](/docs/configuration/theme/#api-reference-colors)).

## Portal defaults

Without a `rapidoc:` key, the portal uses:

| Attribute | Default |
| :--- | :--- |
| `render-style` | `read` |
| `schema-style` | `table` |
| `scale` | `default` |
| `allow-try` | `true` |
| `allow-authentication` | `true` |
| `allow-server-selection` | `false` |
| `show-method-in-nav-bar` | `as-colored-text` |
| `use-path-in-nav-bar` | `false` |

Your `rapidoc:` values replace these.

## The API sidebar

The sidebar of an API reference page is drawn by the portal, not by `<rapi-doc>` (its own navigation is hidden). Two navigation attributes still apply to it:

```yaml title="rapidoc.config.yaml"
rapidoc:
  show-method-in-nav-bar: as-colored-block  # as-colored-text (default) | as-colored-block | as-plain-text | false
  use-path-in-nav-bar: true                 # show each operation's path instead of its summary
```

| `show-method-in-nav-bar` | Shows |
| :--- | :--- |
| `as-colored-text` | The method in its color: `GET`, `POST`, `DELETE`. |
| `as-colored-block` | A colored three-letter badge: `GET`, `POS`, `DEL`. |
| `as-plain-text` | The method in the text color. |
| `false` | No method. |

Other navigation attributes, such as `nav-item-spacing` or `nav-bg-color`, have no effect: change the sidebar's look with [your own CSS](/docs/configuration/theme/#your-own-css).

## Attributes the portal sets itself

Some attributes are part of the portal's layout, so setting them under `rapidoc:` is an error. The message names the key to use instead:

| Attribute | Use instead |
| :--- | :--- |
| `spec-url` | `apis[].spec` |
| `primary-color` | `theme.primary` |
| `color-scheme` | `theme.mode` |
| `show-header`, `show-side-nav` | (the portal draws its own header and sidebar) |
| `update-route`, `goto-path`, `auto-height`, `oauth-receiver` | (set by the page) |
