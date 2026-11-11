---
"@rapidoc/embed": patch
"@rapidoc/starlight": patch
"@rapidoc/vitepress": patch
---

The API sections of Starlight and VitePress sidebars now show each operation's HTTP method (GET, POST, DEL) in RapiDoc's colours and strike deprecated operations through; the Starlight "deprecated" badge is replaced by that mark. `@rapidoc/vitepress` also escapes tag and operation names from the spec, which VitePress writes as HTML. `@rapidoc/embed` adds the shared helpers as `@rapidoc/embed/sidebar`. The `methods` option (`sidebar.methods` in Starlight) picks the style: `as-colored-text` (default), `as-plain-text`, `as-colored-block`, or `false` for none.
