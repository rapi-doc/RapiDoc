---
"rapidoc": major
"@rapidoc/prerender": patch
"@rapidoc/portal": patch
---

The sidebar has a new look with three levels: upper-case section labels (Overview, tag groups, Components, or the tags themselves when there are no tag groups), rows with icons for the API title, servers and authentication, and compact operation rows under a guide line with the method first. The current item is a filled block. A tag's name opens a closed tag as well as going to its section. `nav-item-spacing` is removed (set `--sidebar-item-padding` instead), tag groups no longer collapse, and `show-method-in-nav-bar` now defaults to `as-colored-text`. See the v14 to v15 migration guide. RapiDoc Portal's docs sidebar takes the same three levels: a tab's top-level groups are section labels, their items rows with icons, deeper items compact rows under a guide line.
