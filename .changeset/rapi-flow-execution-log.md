---
"rapidoc": patch
---

RapiFlow's run log is the **Execution Log**: each entry is one row of number, step, method and URL, HTTP status, ✓ or ✗, and an expander; opening it shows "Check Failed: <criterion>" (the label in red) with its action, the attempt and "mocked response". A Single line / Multiline switch (CSS part `log-toggle`) keeps rows on one line with fixed columns and the URL shortened, or lets them wrap. The workflow's error text under the log sits on a darker background.
