---
"rapidoc": patch
"@rapidoc/prerender": patch
---

Try shows where a request is: a status line ("Waiting for <url>… 3.4 s", "The server is taking a while" after 10 s, "Streaming… 3 events") with a spinner on the same line, and a CANCEL button (STOP for streams). A request that fails no longer leaves the ⌛ in the response; it says the server couldn't be reached (or blocked the page with CORS). The response area only ever holds what the server sent. CSS parts: `btn-stop` (was `btn-stop-stream`), `response-status-line`, `response-spinner`.
