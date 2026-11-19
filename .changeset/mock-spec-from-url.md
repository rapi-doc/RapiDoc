---
"@rapidoc/cli": patch
"@rapidoc/mock": patch
---

`rapidoc mock` takes a spec's http(s) address as well as a file: `rapidoc mock https://example.com/orders-api.yaml` serves it under `/orders-api`, read once at start, with the files its relative `$ref`s name on the same server. An address on `localhost` or a private network works when you name it (your API server's own `/openapi.json`); a `$ref` from a spec to such an address is still refused. The Mock UI's header also stays on one row on any screen wider than a phone's.
