---
"rapidoc": minor
"@rapidoc/prerender": patch
---

`<rapi-flow>` shows the Arazzo document's URL (the URL box with its Load button, or the URL as text) and the API sources it names in one card above the diagram (parts `document` and `sources`); the diagram's first box holds the workflow's inputs alone. `renderArazzoWorkflow` takes `showSources: false` to leave the sources out of the diagram; by default they are still listed above the inputs.
