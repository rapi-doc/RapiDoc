---
"@rapidoc/mock": patch
"@rapidoc/cli": patch
---

The Mock UI has a Lint section and a Lint card on its Dashboard: what `rapidoc lint --stateful` finds in the spec, with the share of checks that passed, the categories and rules, and every finding, each view with its own address. `rapidoc mock --stateful` lints a spec when the page first asks; the result is also at the new control endpoint `GET /__mock/lint/<api id>`. `createMockApp` takes the linter as its `lint` option (the mock has no lint rules of its own), and `/__mock/settings` says whether there is one.
