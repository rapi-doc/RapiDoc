---
title: Customizing the portal
description: Every way to change how the portal looks and behaves - brand, layout, your own CSS, components in guides, API reference options and build scripts.
---

A portal looks like your product without forking the framework. Each layer below has its own page; this one shows what goes where.

## Brand and layout: `rapidoc.config.yaml`

| Change | Where |
| :--- | :--- |
| Accent color, light and dark mode, fonts | [Theme](/docs/configuration/theme/) |
| Logo (light and dark), favicon, link previews, announcement banner | [Site](/docs/configuration/site/) |
| Header links, buttons, dropdowns and mega-menus | [Header](/docs/configuration/header/) |
| Tabs and their sidebars, with icons and badges | [Navigation](/docs/configuration/navigation/) |
| Call to action, link columns, newsletter sign-up, social links | [Footer](/docs/configuration/footer/) |
| Analytics, site verification and other `<head>` tags | [Head tags](/docs/configuration/site/#head-tags) |

From the one accent color, the portal derives its text and button variants so that accent text keeps 4.5:1 contrast in both themes.

## Your own CSS

`theme.css` loads your stylesheets on every page, after the portal's own, so plain selectors win. The portal's CSS variables are the stable way in: corners, colors and spacing. See [Your own CSS](/docs/configuration/theme/#your-own-css).

## Components in guides

- **MDX**: callouts, cards, tabs, steps, badges, buttons and icons, with no imports. See [MDX](/docs/writing/mdx/).
- **Your own components**: `.mdx` pages can import Astro components (`.astro`) from your project, such as `components/Hello.astro`. See [Your own components](/docs/writing/mdx/#your-own-components).
- **Markdoc**: the same building blocks as tags, for pages that stay plain text. See [Markdoc](/docs/writing/markdoc/).
- **Live API operations** inside a guide, with Try. See [Embedding operations](/docs/writing/embedding-operations/).
- **Arazzo workflows** drawn as diagrams. See [Workflows](/docs/configuration/workflows/).

## API reference pages

Each reference page is rendered by the [RapiDoc](https://rapidocui.com) web component. The `rapidoc` key sets its attributes for every reference page: render style, schema style and expand level, Try and server selection, font size, and anything else in the [RapiDoc API reference](https://rapidocui.com/api). See [RapiDoc attributes](/docs/api-reference/rapidoc-attributes/).

## Build scripts

`@rapidoc/portal` builds, serves and checks portals from your own Node.js scripts: generate specs or pages before a build, or run several portals from one CI job. See [Programmatic API](/docs/reference/programmatic-api/).
