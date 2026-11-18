---
"@rapidoc/mock": patch
"@rapidoc/cli": patch
---

`rapidoc mock --stateful` serves a Mock UI at `/__mock/ui`: per API, the resources with their records in a table you can filter and sort, and every operation with its label (confident, needs review with the reason, plain mock), plus a reset button and a session field. `GET /__mock/model` returns the same as JSON.
