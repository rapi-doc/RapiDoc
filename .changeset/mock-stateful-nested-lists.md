---
"@rapidoc/mock": patch
"@rapidoc/cli": patch
---

`rapidoc mock --stateful` keeps state for more operations: lists and creates under a parent path (`/grants/{grant_id}/calendars`), and operations that return a part of the record's schema (a list of `calendar_common` where a read returns `calendar`). Paging, sorting and field-selection parameters such as `page_token`, `orderBy` and `select` no longer mark a list for review.
