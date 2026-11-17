---
"rapidoc": patch
"@rapidoc/prerender": patch
"rapipdf": patch
---

Faster rendering of large specs: a schema's nested fields are built and rendered only when they are shown, so with `schema-expand-level` a collapsed field costs nothing until it is opened, and a response status's example and schema render only once that status is selected. The Stripe spec in read mode with `schema-expand-level="1"` now renders in under 5 seconds instead of over 20. Very large schemas are cut below depth 4 as they grow past the node budget, instead of being rebuilt shallower.
