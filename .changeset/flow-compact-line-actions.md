---
"rapidoc": patch
"@rapidoc/prerender": patch
---

The compact view of a workflow diagram (`<rapi-flow view="compact">`, and `{% workflow %}` diagrams in compact view) lists the actions that draw a line, its gotos and retries, under their On success / On failure heading, and each line leaves from its action row, so a line always says when it is taken. Ends, checks and outputs stay in the expanded view.
