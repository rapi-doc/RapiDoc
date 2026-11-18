---
"@rapidoc/cli": patch
"@rapidoc/mock": patch
---

`rapidoc lint` has two rules for examples, both `warn` by default. `example-named-map` reports a media type's `example` that is a map of named examples (`example: { "Calendar": { ... } }`), which belongs under `examples`. `example-matches-schema` reports request and response examples that do not fit their schema; it reads schemas with `@rapidoc/mock`, and where that package is not installed the rule is skipped and lint says so.
