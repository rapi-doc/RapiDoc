---
"@rapidoc/mock": patch
"@rapidoc/cli": patch
---

The Mock UI (`/__mock/ui`) is now an app with a sidebar: a Dashboard per API, Resources, Operations (grouped by path or by resource) and Settings, each with its own address. Settings makes new seed data with another number of records or seed, and sets a response delay. `rapidoc mock --delay <ms>` waits before every API response; `GET` and `PATCH /__mock/settings` read and change it while the mock runs, and `POST /__mock/reset` with `{ "rows": 25, "seed": 7 }` makes new seed data.
