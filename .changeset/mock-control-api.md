---
"@rapidoc/mock": patch
"@rapidoc/cli": patch
---

`rapidoc mock` has its own endpoints under `/__mock`, for tests in any language: `GET /__mock/health` (ready check), and with `--stateful` `POST /__mock/reset` (back to the seed data), `GET /__mock/state` (the stored records, down to one record), `POST /__mock/snapshot` and `POST /__mock/restore` (save the records and put them back, or load data a test wrote). They follow the `X-Mock-Session` header. An API can no longer have the id `__mock`.
