# Spec tooling: `rapidoc bundle` and `rapidoc lint` (design)

Status: `bundle` and `lint` done (2026-11-06). Phase 5 of `cli-overhaul.md`. `rapidoc diff` was considered and dropped:
see "Not in this phase".

Both commands work on plain OpenAPI files, with no portal and no config needed, and reuse `validate`'s
engine: `validate/bundle.js` loads a spec and every file its `$ref`s reach, with line and column numbers,
and `validate/report.js` prints pretty, JSON and SARIF. With a `rapidoc.config.*` in the folder, each
also takes `--api <id>` to work on that API's spec.

Order: **bundle** first (small, and it exercises the loader as a writer), then **lint**. One commit
each, each with its tests and docs.

## No new dependencies

Everything is `yaml` (loading, positions, writing), `@scalar/openapi-validator` (the strict check that
`validate` already runs) and code in this package. Libraries were weighed and set aside:

| For    | Library                                                | Why not                                                                                                                                       |
| :----- | :----------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| bundle | `@apidevtools/json-schema-ref-parser` (500 KB, mature) | rewrites other-file `$ref`s to point at _wherever the content first appeared_ (`#/paths/~1orders/get/responses/200/…`), not into `components` |
| bundle | `@scalar/json-magic`                                   | copies external files into an `x-ext/<hash>` block; pulls `undici` (8 MB)                                                                     |
| bundle | `@redocly/openapi-core`                                | writes proper `components`, but 2 MB and 13 dependencies for one command                                                                      |
| lint   | `@stoplight/spectral-core`                             | ~40 packages and its own ruleset format; our 16 rules are portal-specific and short                                                           |

If a fallback is ever wanted for `bundle`, `json-schema-ref-parser` is the one to pick.

## Code style

- **Modern JavaScript, ESM, typed with JSDoc** (`@typedef`, `@param`, `@returns`), as the rest of the
  CLI: no TypeScript build step in this package, and the types still show in editors. Shared shapes
  (`Finding`, `Rule`, `LintContext`) are declared once in `src/lint/types.js` and imported with
  `@import`.
- **One pass per job.** The loader already walks every node once and records its origin; `bundle`
  rewrites during that walk, and `lint` runs every rule over a single traversal that hands each rule the
  nodes it asked for (`operation`, `schema`, `parameter`, …), instead of 16 walks.
- **Small, pure functions.** Rules are `(node, context) → Finding[]` with no I/O; the command does the
  reading and printing. Each rule fits on one screen.
- **No classes where an object will do**; `Map`/`Set` for lookups; no mutation of the loaded spec
  (`bundle` builds a new tree).
- **Performance target**: Stripe's spec (6 MB, 500+ operations) lints in under a second after load,
  and bundles in the time it takes to parse it. `tests/perf/benchmark.js` gets a case for each.

## 1. `rapidoc bundle <spec>`

One file from a spec split over several, for tools that can't follow `$ref`s to other files.

```text
rapidoc bundle openapi.yaml -o dist/openapi.json
rapidoc bundle openapi.yaml --dereference > flat.yaml
rapidoc bundle --api orders -o dist/orders.yaml
```

- **Output**: `-o/--output <file>`, YAML or JSON by its extension; stdout without `-o` (YAML, or
  `--format json`). Keys keep their order; comments in the source are lost (the output is data).
- **Default: `$ref`s to other files become components.** A `$ref: ./schemas/Order.yaml` under a
  schema is copied to `components/schemas/Order` and the `$ref` becomes `#/components/schemas/Order`;
  likewise parameters, responses, request bodies, headers, examples, links, callbacks and path items,
  by the kind of place the `$ref` is written in (the walk knows where it is). The component's name is
  the target's file name without extension, or the last pointer segment for `file.yaml#/Order`; a name
  already taken by _different_ content gets `-2`, `-3`; the same target referenced twice is copied once.
  A `$ref` where the kind can't be told (under a vendor extension) is inlined.
- **In-file `$ref`s stay as they are.** A `$ref` inside a copied file that points within that file is
  rewritten to the new component (it's the same target, so the same name).
- **`--dereference`**: no `$ref`s at all. A recursive schema can't be inlined: exit 1 naming the cycle
  (`#/components/schemas/Node → properties/children/items → #/components/schemas/Node`). The default
  mode handles cycles, since they stay `$ref`s.
- **`--remote`** fetches remote `$ref`s, as in `validate`; without it a remote `$ref` is left as is
  and listed as a warning on stderr.
- **Checked before written**: the result goes through `validate`'s strict check; a failure prints the
  errors and exits 1 with nothing written. `--no-validate` skips the check (for a spec that's known
  invalid and being bundled to fix it).
- **Swagger 2.0**: `definitions`, `parameters`, `responses` instead of `components/*`. Supported, same
  rules, different target paths.

### Code

```text
src/bundle/
├── components.js   # rewrite(bundle, { kind }) → new tree with other-file $refs as components
├── dereference.js  # inline every $ref; throws CycleError with the chain
└── write.js        # toYaml / toJson (yaml's stringify, key order kept), -o or stdout
src/commands/bundle.js
```

`validate/bundle.js` gains a `mode` (`"inline"`, today's behaviour, used by `validate`; `"keep"`, which
loads every file but leaves the `$ref`s for `components.js` to rewrite). The kind of a `$ref`'s
location comes from the pointer: `…/schema`, `…/items`, `…/properties/*`, `…/allOf/*` → schema;
`…/parameters/*` → parameter; `…/responses/*` → response; and so on, a small table.

Tests (`tests/bundle.test.js`): a spec split over three files bundles to one that validates; the same
target twice is one component; a name collision gets `-2`; in-file refs in a copied file are rewritten;
`--dereference` flattens and reports a cycle; `-o` picks the format by extension; Swagger 2 targets.

## 2. `rapidoc lint [spec | dir]`

What a spec needs to make a good portal, beyond being valid OpenAPI. Same output as `validate`
(file:line:col, `--format pretty|json|sarif`, `--strict` fails on warnings), so it drops into the same
CI step and code-scanning upload.

```text
rapidoc lint openapi.yaml
rapidoc lint                      # every API in rapidoc.config.*, or every spec in the folder
rapidoc lint openapi.yaml --rule operation-summary=off --format sarif
```

- **Validation first**: `lint` runs `validate`'s check and reports its errors under the rule
  `spec-valid` (always an error, can't be turned off). An invalid spec is not linted further, so one CI
  step is enough.
- **Rules**, severity `error`, `warn` or `off` (default in the last column). The _Why_ column is what
  the portal does with it; names follow Redocly's where one exists, so a team moving over finds them.

  | Rule                             | Checks                                                                                | Why                                              | Default |
  | :------------------------------- | :------------------------------------------------------------------------------------ | :----------------------------------------------- | :------ |
  | `operation-operationId`          | every operation has one                                                               | stable URLs (`OperationSlugger`), MCP tool names | warn    |
  | `operation-operationId-unique`   | no two the same                                                                       | two operations would share a page and a tool     | error   |
  | `operation-operationId-url-safe` | letters, digits, `_`, `-`, `.`                                                        | used in URLs                                     | warn    |
  | `operation-summary`              | every operation has a summary                                                         | sidebar label, MCP tool title                    | warn    |
  | `operation-description`          | operations have a description                                                         | MCP tool descriptions, readers                   | off     |
  | `operation-tag-defined`          | tags used are in top-level `tags`                                                     | sidebar groups and their descriptions            | warn    |
  | `tag-description`                | top-level tags have a description                                                     | the group's intro on the page                    | off     |
  | `operation-2xx-response`         | at least one 2xx or 3xx response                                                      | Try shows nothing to expect                      | warn    |
  | `operation-4xx-response`         | at least one 4xx response                                                             | readers don't see error shapes                   | off     |
  | `security-defined`               | POST, PUT, PATCH, DELETE have `security` (own or global)                              | Try and the mock need it; MCP marks them         | warn    |
  | `security-scheme-defined`        | schemes used are declared                                                             | Try's auth panel                                 | error   |
  | `no-unused-components`           | every component is referenced                                                         | dead docs                                        | warn    |
  | `media-example`                  | request and response bodies have an example (`example`, `examples`, or in the schema) | Try's sample body; the mock's responses          | warn    |
  | `path-kebab-case`                | path segments other than parameters are kebab-case                                    | naming                                           | off     |
  | `no-server-example-com`          | servers aren't example.com or localhost                                               | Try would call nowhere                           | warn    |
  | `info-contact` / `info-license`  | present                                                                               | the portal's API page header                     | off     |

  Defaults lean on `warn` so a first `lint` of an existing spec doesn't fail CI; `--strict` makes them
  count.

- **Configuring**, most specific wins: `--rule name=severity` (repeatable) › `lint:` in
  `rapidoc.config.*` › the defaults. In the config:

  ```yaml
  lint:
    rules:
      operation-description: warn
      no-unused-components: off
    apis: # per API id, for one that can't meet a rule yet
      legacy:
        operation-operationId: off
  ```

  The `lint` key is added to the portal's config schema (so `rapidoc build` accepts it) and read by the
  CLI from the raw file with `yaml`, so `rapidoc lint` needs no portal engine. An unknown rule name is
  a `UsageError` with a "did you mean".

- **Not in v1**: custom rules in JavaScript, disabling a rule on one operation (`x-lint-ignore`),
  autofix. All three fit the rule shape below and can come later.

### Code

```text
src/lint/
├── types.js        # @typedef Finding { pointer, message }, Rule { name, default, on, check }, LintContext
├── rules/          # one file per rule, exporting a Rule; rules/index.js lists them
├── traverse.js     # one walk of the spec: calls rule.check for each node kind it asked for (`on`)
├── config.js       # severities from --rule, lint: in the config, defaults; validates rule names
└── run.js          # lint(bundle, severities) → findings with file:line:col, through locate/position
src/commands/lint.js
```

A rule:

```js
/** @type {import("../types.js").Rule} */
export default {
  name: "operation-summary",
  default: "warn",
  on: ["operation"],
  check: (op, { pointer }) =>
    op.summary?.trim() ? [] : [{ pointer, message: "Operation has no summary" }],
};
```

`traverse.js` yields `{ kind, node, pointer, path, method }` for `info`, `server`, `tag`, `pathItem`,
`operation`, `parameter`, `requestBody`, `response`, `mediaType`, `schema`, `securityScheme`,
`component`; `$ref`s are followed in-document for the checks that need the target (a `media-example`
looking into a referenced schema), with a visited set per rule invocation.

`validate/report.js` gains the rule name on each finding (the SARIF `ruleId`, a column in pretty).

Tests (`tests/lint.test.js`): one small fixture per rule that trips it and one that passes; the
`spec-valid` gate; `--rule` and the config key, with precedence; per-API overrides; `--strict`; SARIF
has a `rules` list with each rule's description.

## Not in this phase

- **`rapidoc diff <old> <new>`** (breaking changes between two versions): dropped. The portal
  documents an API rather than governing it; teams that care about breaking changes already run oasdiff
  (Go, not on npm) in the API's own CI, and nobody has asked. Revisit if a "what changed between v1 and
  v2" page is wanted in the portal; the comparison engine would come with that feature.
- **Replacing `@scalar/openapi-parser` in `<rapi-doc>`**: the Scalar stack is ~60 KB unminified of
  the bundle, 43 KB of it the Swagger 2 → 3 upgrader. If the loader behind `bundle` and `lint` proves
  itself, a headless resolver in `packages/rapidoc/src/utils` could serve the CLI, the portal build and
  `spec-parser.js` alike (one `$ref` semantics everywhere; the `manifest.js` fix of 2026-11-06 came from
  having two) and drop the 17 KB parser, keeping the upgrader. Separate design when that's wanted.

## Open questions

1. **`lint` runs `validate` first** (one CI step, proposed), or are the two kept separate?
2. **Lint rules in `rapidoc.config.*`** (`lint:` key, proposed), or a separate `rapidoc-lint.yaml`?
3. **`bundle` default**: other-file `$ref`s into components (proposed, like Redocly), or inlined (what
   `validate` does internally)?
