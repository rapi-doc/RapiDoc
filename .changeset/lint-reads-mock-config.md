---
"@rapidoc/cli": patch
"@rapidoc/mock": patch
---

`rapidoc lint --stateful` reads `mock.config.yaml` (beside the spec or in the folder, or `--mock-config <file>`): what you have stated there, a resource's key or an operation's action, is no longer reported. An entry of the file that no longer fits the spec is reported as `mock-config`. The file is read only when a `stateful-*` rule is on.
