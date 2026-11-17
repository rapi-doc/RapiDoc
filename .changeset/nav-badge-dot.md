---
"rapidoc": minor
"@rapidoc/prerender": patch
---

Sidebar items whose operation shows a badge (`x-badges`, or an OpenAPI 3.2 tag of `kind: badge`) get a small dot in the first badge's color, with the badges in its tooltip and accessible label: `show-badges-in-nav-bar`, `dot` by default, `false` to turn it off (CSS part `nav-badge-dot`). Badges with `color: none` are left out. `@rapidoc/prerender`'s `getNavBarHtml` draws the same dot (`showBadgesInNavBar`).
