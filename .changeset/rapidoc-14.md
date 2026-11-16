---
"rapidoc": major
---

RapiDoc 14: the code of `<rapi-doc>` that loads a spec and reads its schemas is now shared with RapiPdf. `rapipdf` 3 (the `<rapi-pdf>` element and the `rapidoc pdf` command) is built on the same loader and the same schema tree, so a PDF and the page read a spec the same way, and a fix to either reaches both.

Nothing changes for a page that uses `<rapi-doc>`, `<rapi-doc-mini>` or `<rapi-flow>`: no attribute, method, event, slot, part or CSS variable was added, renamed or removed. Upgrade from 13 without edits; the packages that depend on `rapidoc` move to `^14.0.0` with it.
