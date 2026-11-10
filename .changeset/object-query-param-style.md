---
"rapidoc": patch
"@rapidoc/prerender": patch
---

Try It sends object query parameters as their `style` and `explode` say: `pageNo=1&pageSize=20` for the default exploded `form`, `request=pageNo,1,pageSize,20` with `explode: false`, and `request[pageNo]=1` only for `style: deepObject` (before, every object was sent with brackets).
