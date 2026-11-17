---
"rapidoc": patch
"@rapidoc/prerender": patch
"rapipdf": patch
---

XML examples name array items by the items' `xml.name` (else the property's name) instead of their index (`<0>`), also when the array or its items have an example; unwrapped arrays put the items directly in the parent element.
