---
title: Bundle
description: Join a spec split over several files into one, for tools that can't follow $refs to other files.
---

```bash
npx rapidoc bundle --api orders -o dist/orders.yaml   # an API of rapidoc.config.*
npx rapidoc bundle specs/orders.yaml -o dist/orders.json
```

`rapidoc bundle` loads a spec and every file its `$ref`s reach, and writes one document: every `$ref` to another file becomes a component. The portal itself follows `$ref`s across files, so it doesn't need this; code generators, gateways and review tools often do.

`--api <id>` bundles the spec of an API in `rapidoc.config.*` (its default version) instead of a file, and needs `@rapidoc/portal`. What the bundle contains, how components are named, and the other options (`--dereference`, `--format`, `--no-validate`, `--remote`) are on the [rapidoc bundle](https://rapidocui.com/docs/cli/bundle/) page of the RapiDoc docs.
