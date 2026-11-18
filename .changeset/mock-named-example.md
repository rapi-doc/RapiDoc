---
"@rapidoc/mock": patch
---

`rapidoc mock` reads an `example` that was written as a map of named examples (`example: { "Calendar": { ... } }`, which belongs under `examples`): the response is the value under the name, not the map. It does so only when the response schema confirms it.
