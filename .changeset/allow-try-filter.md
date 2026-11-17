---
"rapidoc": minor
"@rapidoc/prerender": patch
---

`allow-try` takes the terms of `filter-operations` besides `true` and `false`: `allow-try="!deprecated !tag:pending-implementation"` keeps Try on only for the operations they select; the others keep their request documentation and show a disabled TRY DISABLED button (CSS part `btn-try-disabled`) with the reason next to it in grey, such as "Try is off for operations tagged pending-implementation" (part `try-disabled-reason`). `badge:` terms (in `filter-operations` and `allow-try`) also match OpenAPI 3.2 tags of `kind: badge`, by label or name.
