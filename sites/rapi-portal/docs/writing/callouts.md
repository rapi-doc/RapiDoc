---
title: Callouts
description: Notes, tips and warnings - one look whether you write them in Markdown, MDX or Markdoc.
---

A callout looks the same whichever way you write it, so pick the syntax of the page's format.

| Format | Syntax |
| :--- | :--- |
| Markdown, MDX | `:::tip` ... `:::` |
| MDX | `<Callout type="tip">` or `<Aside type="tip">` |
| Markdoc | `{% callout type="tip" %}` or `{% aside type="tip" %}` |

## Markdown blocks

```markdown
:::note
A plain note.
:::

:::caution[Rate limits]
More than 100 requests a second get a 429.
:::

:::danger{title="Irreversible"}
Deleting an account removes all its data.
:::
```

:::note
A plain note.
:::

:::caution[Rate limits]
More than 100 requests a second get a 429.
:::

:::danger{title="Irreversible"}
Deleting an account removes all its data.
:::

The title goes in square brackets, `:::tip[Title]`, or in braces, `:::tip{title="Title"}`.

## Types

| Type | Icon |
| :--- | :--- |
| `note`, `info` | info |
| `tip` | lightbulb |
| `success` | check circle |
| `caution`, `warning` | warning |
| `danger` | shield warning |
| `sparkles` | sparkle |
| `rocket` | rocket |
| `settings` | gear |
| `zap` | lightning |
| `lock` | lock |
| `megaphone` | megaphone |

Zudoku's names (`info`, `warning`, `sparkles`, ...) work too, so migrated pages render as they did.

:::rocket[New in v2]
The `rocket`, `sparkles`, `zap` and `megaphone` types suit announcements.
:::

## Another icon

`icon` picks any [Phosphor](https://phosphoricons.com) icon:

```mdx
<Callout type="info" icon="clock" title="Takes a few minutes">
  Label generation runs in the background.
</Callout>
```
