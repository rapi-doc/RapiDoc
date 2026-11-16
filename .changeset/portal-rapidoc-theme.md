---
"@rapidoc/portal": patch
---

`rapidoc.theme` with a RapiDoc preset (`amber`, `jade`, ...) now applies to the API reference pages: the page, its sidebar, header and footer take the preset's background, border, sidebar color and accent instead of `theme.primary` and the portal's background. Without it the pages look as before; a `#hex` value still sets only the accent.

The header rows and the footer now share a color, `--portal-header-bg` (the header frosted, the footer solid), and the sidebars take the page's background: in the light theme the header and footer are the light grey the docs sidebar used to be, and the sidebar is white. Set `--portal-header-bg` in a `theme.css` stylesheet to change it.

The "On this page" column keeps the width of the left sidebar (18.75rem, `--portal-toc-width` to change it) instead of growing with the screen; the page text stays centered in the space between them.
