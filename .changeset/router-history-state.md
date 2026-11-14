---
"rapidoc": patch
"@rapidoc/prerender": patch
---

`<rapi-doc>` (with `update-route`) and the portal's prerendered sidebar (`bindNavBar`) keep `history.state` when they rewrite the address hash. A single-page app's router (Vue Router, React Router) keeps its history data, such as scroll positions, and Vue Router no longer warns that `history.state` was replaced.
