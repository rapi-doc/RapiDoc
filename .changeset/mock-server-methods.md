---
"@rapidoc/mock": patch
"@rapidoc/cli": patch
---

`rapidoc mock` serves OpenAPI 3.2 `QUERY` operations and the methods under `additionalOperations` (`PURGE`, `COPY`, ...): routed, validated, listed in `Allow` on a 405 and allowed by CORS. It warns at start about a method Node's HTTP server can't receive.
