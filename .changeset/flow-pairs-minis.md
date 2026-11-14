---
"rapidoc": minor
---

`<rapi-flow for="…">` takes several element ids, one `<rapi-doc>` or `<rapi-doc-mini>` per OpenAPI source of the Arazzo document (paired by an `arazzo-source` attribute, else by spec URL). Each element supplies its API's spec, server, credentials and in-browser mock, so a workflow that calls several APIs runs fully mocked in the page; a paired mini is filtered to the workflow's calls to its API, in step order, and clicking a step shows its operation there. New `showOperation(operation)` method on `<rapi-doc-mini>`, and a `spec-url` and `filter-operations` set together load the spec once.
