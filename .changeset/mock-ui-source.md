---
"@rapidoc/mock": patch
---

Mock UI: `<rapidoc-mock-ui>` takes a `source` property, the control API as a function (`({ method, path, body, session }) => ({ status, data })`), so the same UI can show a mock that runs in the page instead of on a server. Without it the UI reads the control API over HTTP as before.
