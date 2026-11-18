---
"@rapidoc/cli": patch
---

`rapidoc lint` has three new rules, all warnings by default: `parameter-description` (a parameter without a description), `response-error-schema` (a 4xx or 5xx response that should say what went wrong but has no schema; 401, 403, 404 and a few others may go without) and `schema-oneof-discriminator` (a `oneOf` or `anyOf` between object schemas with nothing to tell them apart). A spec that passed `--strict` may now fail it: turn a rule off with `--rule <name>=off` or `lint.rules` in the config.
