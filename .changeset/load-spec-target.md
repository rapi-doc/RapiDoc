---
"rapidoc": patch
---

After `loadSpec()`, the Download / View OpenAPI spec buttons and the header's spec URL box point at the spec just loaded, not the `spec-url` attribute. A spec loaded as an object hides the spec download buttons, and a `match-paths` change re-filters the spec loaded last instead of reloading `spec-url`.
