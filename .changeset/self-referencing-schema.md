---
"rapidoc": patch
"@rapidoc/prerender": patch
---

A schema that contains itself is marked as recursive at the property that refers back to it. In some specs the marker landed one level down, so the property was drawn as an object with a single `$ref` member.
