---
"@rapidoc/portal": patch
---

API reference pages use `<rapi-doc>`'s own `scale="default"` instead of `lg`. Body text and headings keep the portal's sizes; code, descriptions and small labels are 1–2px smaller (code 13px instead of 15px). Set `scale: lg` under `rapidoc:` to keep the previous sizes.
