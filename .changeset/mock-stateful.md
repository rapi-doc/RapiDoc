---
"@rapidoc/mock": patch
"@rapidoc/cli": patch
---

`rapidoc mock --stateful` keeps data like a real server: it works out resources, keys and relations from the spec, seeds each resource with records (`--rows`, default 10) whose references point at each other, and then creates, updates and deletes change stored records that reads and lists return, in the response shape the spec defines. Operations that fit no resource answer as before. An `X-Mock-Session` header gives a caller its own copy of the data.
