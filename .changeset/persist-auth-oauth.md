---
"rapidoc": patch
"@rapidoc/prerender": patch
---

`persist-auth="true"` keeps an OAuth access token across page reloads, until it expires (`expires_in`). Only the token is stored, never the client secret or Basic credentials.
