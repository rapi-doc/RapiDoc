---
"@rapidoc/cli": patch
"@rapidoc/mock": patch
---

`rapidoc lint --stateful` reports what the stateful mock (`rapidoc mock --stateful`) had to assume about a spec or could not map, at its place in the spec: a resource without a visible key, a list filter that matches no field, a write that fits no resource, a reference to a resource the spec doesn't have, records described by an inline schema, and other assumptions about operations. These are seven `stateful-*` rules, off by default; `--stateful` turns six on as warnings, and each can be set by name. They need `@rapidoc/mock` installed.
