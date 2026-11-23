---
"rapidoc": patch
"@rapidoc/mcp": patch
"@rapidoc/prerender": patch
---

`rapidoc/flow` (`<rapi-flow>`) is 41 KB smaller (283 KB to 242 KB minified, 89 KB to 76 KB gzipped): Arazzo documents are now read with `js-yaml`, half the size of `yaml`. Values are read the same way (YAML 1.2, merge keys, no dates); a tag the reader does not know keeps its plain value, and stray control characters are dropped. `@rapidoc/mcp` depends on `js-yaml` in place of `yaml`, and `@rapidoc/prerender` on both. OpenAPI specs are read as before. In `rapidoc-min.js`, the syntax highlighter no longer carries grammars for Astro, Svelte, Vue, Objective-C, Perl, R and TOML. The first three are drawn as HTML and Objective-C as C; Perl, R and TOML code shows as plain text.
