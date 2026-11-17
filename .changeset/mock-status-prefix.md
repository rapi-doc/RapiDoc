---
"rapidoc": minor
"@rapidoc/prerender": patch
"@rapidoc/mcp": patch
---

`mock-server-status-code` takes the strategy in front of the codes (`random:200, 500`, `cycle:503, 503, 200`), also per operation in its JSON map, and a list without a prefix is now used in turn (`cycle`) instead of always answering its first code; each operation's cycle starts again when the codes change. `mock-server-status-strategy` (now defaulting to `cycle`) and its `first` value are deprecated. In RapiFlow, an Arazzo step's `x-mock-server-status-code` prefills its Mock Response Status field, each field takes the same prefix, and the separate "in turn / at random" select is gone.
