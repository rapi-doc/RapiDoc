---
title: Markdown
description: Write guides in plain Markdown - titles, frontmatter, links, images and code.
---

Plain Markdown (`.md`) is the simplest way to write a guide. Every file in `docs/` is a page. Pick a format per page: Markdown, [Markdoc](/docs/writing/markdoc/) or [MDX](/docs/writing/mdx/) can sit side by side.

## Title and frontmatter

```markdown title="docs/authentication.md"
---
title: Authentication
description: Get an access token and send it with every request.
---

Every request needs an access token...
```

Without a `title` in the frontmatter, a first `# Heading` becomes the page title. So a README-style file works as-is:

```markdown title="docs/authentication.md"
# Authentication

Every request needs an access token...
```

These frontmatter keys work too:

| Key | Does |
| :--- | :--- |
| `description` | The page's description, used by search engines and link previews. |
| `sidebar` | The page's sidebar link: `label`, `order` and `badge`. |
| `tableOfContents` | Overrides `docs.toc` for this page. `false` hides "On this page". |
| `template: splash` | A full-width page without sidebars, for a landing page. |
| `hero` | A title block with a tagline, an image and action links, for a landing page. See [Landing pages](#landing-pages). |
| `draft` | `true` leaves the page out of `rapidoc build`. |
| `pagefind` | `false` keeps the page out of search. |

## Landing pages

A page with `template: splash` and a `hero` is a landing page, like this site's home page. Any page in `docs/` can be one; point a [link tab](/docs/configuration/navigation/) at it to give it its own tab.

```markdown title="docs/solutions.md"
---
title: Solutions
template: splash
hero:
  layout: stacked
  title: Ship faster with<br><mark>our APIs</mark>
  tagline: Prices, bookings and tracking for every parcel.
  image:
    html: <img src="/images/hero.png" alt="A booked shipment and its tracking timeline" width="520" height="460">
  actions:
    - text: Get started
      link: /docs/getting-started/quickstart/
    - text: Browse the APIs
      link: /catalog/
      variant: secondary
---
```

| Key | Does |
| :--- | :--- |
| `hero.title` | The large heading; without it, the page `title`. Inline HTML works: `<br>` breaks the line, `<mark>` shows gradient text. |
| `hero.tagline` | The text under the heading. Inline HTML works. |
| `hero.image` | `html`: an `<img>` of a file in `public/`, or an inline SVG. Starlight's `file`, `dark` and `light` keys take a path relative to the page. |
| `hero.actions` | Buttons: `text`, `link`, `variant` (`primary`, `secondary` or `minimal`) and `icon`. |
| `hero.layout` | `split` (default): the text left and the image right; without an image the text takes the full width. `stacked`: the text and buttons centred, the image below them. |

On phones both layouts are one column, with the image below the text.

## Links

Link to other guides by URL: `[Errors](/docs/errors/)`. Link to an API reference page with `/apis/<id>`, to one tag with `/apis/<id>/<tag>`, and to one operation with its anchor:

```markdown
See [Create a shipment](/apis/shipments/shipments#create-shipment).
```

## Images

Put images in `public/` and use their path from the site root:

```markdown
![Label example](/images/label.png)
```

## Code

Fenced code blocks are highlighted by [Expressive Code](https://expressive-code.com), with a copy button. Add a title, mark lines, or show a terminal frame:

````markdown
```js title="client.js" {2}
const res = await fetch('https://api.acme.com/v1/orders', {
  headers: { Authorization: `Bearer ${token}` },
});
```

```bash
npm install @acme/sdk
```
````

## Callouts

Highlight a note, tip or warning with a `:::` block:

```markdown
:::tip[Use idempotency keys]
Retrying a POST with the same key never creates a second order.
:::
```

:::tip[Use idempotency keys]
Retrying a POST with the same key never creates a second order.
:::

More types and options: [Callouts](/docs/writing/callouts/).

## Tables, lists, and the rest

GitHub-flavored Markdown works: tables, task lists, strikethrough, autolinks and footnotes.
