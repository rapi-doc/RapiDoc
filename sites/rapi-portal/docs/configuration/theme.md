---
title: Theme
description: Accent color, light and dark mode, and fonts.
---

```yaml title="rapidoc.config.yaml"
theme:
  primary: '#f76b39'
  mode: auto
  fonts:
    sans: { family: Inter }
    mono: { family: JetBrains Mono }
```

## Accent color

`primary` (default `#f76b39`) colors links, buttons, the active tab and sidebar item, and the API reference.

You pick one color, and the portal keeps it readable. At build time it derives the text variants from it so that accent text keeps WCAG AA contrast (4.5:1) on both the light and the dark background. Text on accent-filled buttons is black or white, whichever reads better. So a light brand color like yellow still gives readable links.

## Mode

`mode` is the theme a visitor sees until they pick one with the theme switcher:

- `auto` (default) follows the operating system.
- `light` or `dark` forces one.

Hide the switcher with `header.themeSwitcher: false`.

## Fonts

```yaml title="rapidoc.config.yaml"
theme:
  fonts:
    sans: { family: Inter }                                  # loaded from Google Fonts, weights 400-700
    mono: { family: JetBrains Mono, url: /fonts/mono.css }   # your own stylesheet
```

A `family` alone loads from Google Fonts. Add `url` to load it from another CDN or from a CSS file in `public/`. `sans` is the text font; `mono` is used for code.

## Your own CSS

```yaml title="rapidoc.config.yaml"
theme:
  css: ./styles/portal.css   # or a list of files
```

The files load on every page after the portal's own styles, so plain selectors win without `!important`. Paths are relative to `rapidoc.config.yaml`, and `rapidoc dev` reloads when they change.

The supported way in is the portal's CSS variables, for example:

```css title="styles/portal.css"
:root {
  --portal-radius: 0.75rem;   /* corners of cards, callouts and code blocks */
}
:root[data-theme="dark"] {
  --portal-bg: #30333c;          /* pages and sidebars */
  --portal-header-bg: #2c2d35;   /* header rows (frosted) and footer */
}
```

Text colors are `--portal-fg` (body text), `--portal-muted` (sidebar links and secondary text) and `--portal-sidebar-label` (the sidebars' group headings, a step fainter than the links). Set a new pair for each scheme, and keep each at 4.5:1 or more on `--portal-bg`.

This site uses that to put its pages in the colors of the `amber` theme of its API reference ([below](#api-reference-colors)).

Other selectors work too, but the portal's markup can change between releases.

## API reference colors

The API reference pages follow the portal theme: the same accent color, and light or dark with the rest of the page.

To give them one of RapiDoc's [built-in themes](https://rapidocui.com/docs/rapidoc/theming/prebuilt-themes/) instead, with its own accent, surfaces and headings, name it under `rapidoc:`:

```yaml title="rapidoc.config.yaml"
rapidoc:
  theme: amber   # ember | carbon | cobalt | jade | indigo | amber
```

The API reference pages then use the theme's colors, still light or dark with the rest of the site: the reference and its sidebar on the theme's background, the header and footer in its sidebar color, and its accent. The guides keep the portal's colors and `theme.primary`; to match them, set the same colors in [your own CSS](#your-own-css), as this site does. A `#hex` value sets only the accent, over the portal's colors. To change more of RapiDoc's look, see [RapiDoc attributes](/docs/api-reference/rapidoc-attributes/).
