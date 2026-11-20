---
"@rapidoc/mock": patch
---

The Mock UI has an Import spec page in its sidebar: add a spec to the running mock from an address, a file or pasted text, and it is served at once under its own path, with state, until the mock stops; imported specs are listed with a Remove button. The control API has the same: `POST /__mock/apis` with `{ "url": ... }` or `{ "text": ..., "name": ... }`, and `DELETE /__mock/apis/<id>`. Importing is accepted only from the machine the mock runs on.
