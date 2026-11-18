---
"@rapidoc/mock": patch
---

`rapidoc mock --stateful` no longer takes a record for a wrapper because it holds another object under `payload`, `data`, `result` or `item`. An object is a record when it has a key of its own (`id`, `key`, `uuid`, `slug`, or one named after it, such as `messageId` on `Message`), or when its item path addresses one of its fields (`/tags/{slug}` and `slug`). Gmail's messages (an `id` and a `payload` part) now keep state. A wrapper's own `request_id` does not count.
