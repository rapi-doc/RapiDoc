---
"@rapidoc/mock": patch
"@rapidoc/cli": patch
---

`rapidoc mock --stateful` reads `mock.config.yaml` beside the spec: your corrections to what the mock worked out. `resources.<Name>.key` names a resource's key, and a dotted path such as `metadata.name` reaches inside the record; `operations.<id>` sets an operation's `resource`, `action` and where its `key` comes from (`path.x`, `query.x`, `body.x`), or `action: none`. With several APIs the sections go under `apis.<api id>`. An entry that no longer fits the spec is skipped and named when the mock starts. `--mock-config <file>` names another file.
