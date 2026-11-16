---
"@rapidoc/cli": patch
---

New command `rapidoc pdf <spec>`: writes the API reference of a spec as a PDF (a cover page, a table of contents, the security schemes and every operation), the document `<rapi-pdf>` makes in the browser. Options choose the sections, the schema style, title, footer, colors, labels (`--labels`, for another language) and fonts (`--font`, for text Roboto has no glyphs for). It needs `rapipdf` 3 installed next to the CLI.
