---
"rapidoc": patch
"@rapidoc/prerender": patch
---

Operation badges (`x-badges` and OpenAPI 3.2 `kind: badge` tags) use the shared badge style (2px radius, 4px padding, weight 500) in the badge's colour, with the same 15% tint in every render style; the base badge's padding, radius and weight change accordingly, and the unused `.badge-sm` and `.btn-destructive` styles are gone.
