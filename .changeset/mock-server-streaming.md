---
"@rapidoc/mock": patch
"@rapidoc/cli": patch
---

`rapidoc mock` loads OpenAPI 3.2 specs and streams `itemSchema` responses (Server-Sent Events, JSON Lines, JSON Text Sequences) one item at a time, `--stream-interval` apart (default 300 ms): the example's items (`dataValue` lists and `serializedValue` text are read), else five generated items with numbered ids. JSON Lines request bodies are checked line by line against their `itemSchema`.
