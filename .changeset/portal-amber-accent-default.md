---
"@rapidoc/portal": minor
---

Without `theme.primary`, a portal now uses the accents of RapiDoc's default theme, `amber`: `#f6a821` in dark mode and `#ab6534` with white text in light mode, on its own pages, the API reference and embedded operations (was `#f76b39` in both). Only the accent changes; the portal's surfaces stay its own. A portal that sets `theme.primary` keeps that color in both modes.
