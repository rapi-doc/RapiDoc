---
"rapidoc": minor
---

`<rapi-flow update-route="true">` keeps the shown workflow and the selected step in the page's address as `?workflow=<id>&step=<id>`, so a link opens that workflow with the step selected, scrolled into view and its operation shown in the paired `<rapi-doc>` or `<rapi-doc-mini>`. It uses the query string, leaving the hash to `<rapi-doc>`, and keeps `history.state` for routers.
