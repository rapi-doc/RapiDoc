---
"@rapidoc/mock": patch
---

The sentences the mock writes about a spec put the names they take from it in backticks: what an operation does ("Lists the stored `Owner` records, filtered by `lastName`."), a review note ("returns inline objects; assumed to be `destination`") and a parameter's role, in `/__mock/model` and its detail endpoints. The Mock UI shows those names as code, so a resource called `destination` or `user` can't be read as a word of the sentence. `rapidoc lint --stateful` prints its findings as before, without the marks.
