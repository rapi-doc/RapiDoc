---
"@rapidoc/cli": patch
---

`rapidoc lint` has fifteen more rules. Mistakes that break Try and the mock: `no-ambiguous-paths`, `operation-parameters-unique`, `path-not-include-query`, `no-enum-type-mismatch` (errors by default), `no-path-trailing-slash`, `no-empty-servers`, `no-server-trailing-slash`, `no-required-undefined-properties` and `description-html-removed`, which reports HTML in a description that the reference removes (warnings). Conventions, off by default: `operation-singular-tag`, `tags-alphabetical`, `no-http-verbs-in-paths`, and three that need no setting because they hold names to the casing most of the spec already uses: `property-casing-consistent`, `parameter-casing-consistent` and `operationId-casing-consistent`.
