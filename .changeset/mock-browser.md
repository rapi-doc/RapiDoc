---
"@rapidoc/mock": patch
---

The stateful mock's code no longer needs a Node module to make a UUID, and `src/browser.js` (`createBrowserMock`) runs the stateful mode in a page, answering the control API as a function. The Rapi Mock site uses it for its spec check; the server works as before.
