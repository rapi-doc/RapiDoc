---
"@rapidoc/mock": patch
"@rapidoc/cli": patch
---

The Mock UI has detail pages. A resource's About tab shows its fields with how each is seeded ("a first name", "the id of an Owner record", "shaped like the example"), its links to other resources, the operations on it, and generates a sample record without storing it. An operation's Details page says what the mock does for it in a sentence, what it uses each parameter for, what the request and each response hold, and shows a sample response. The same is available as JSON under `GET /__mock/model/<api>/resources/<Resource>` (and `/sample`) and `GET /__mock/model/<api>/operations/<id>`.
