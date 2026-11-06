# `rapidoc` CLI overhaul (design)

Status: phase 1 done (2026-11-06), uncommitted; phases 2–6 proposed.

`@rapidoc/cli` covers the portal workflow (`init`, `dev`, `build`, `serve`, `mock`, `validate`, `migrate`)
and loads the heavy engines (`@rapidoc/portal`, `@rapidoc/server`, `@rapidoc/mock`) only when a command
needs them. That stays. What this plan changes is everything around the commands: how arguments are read,
how help and errors look, when the CLI asks questions, how much `validate` can be trusted, and a few
commands people expect from an API toolkit.

## What is wrong today

Found by running the CLI (version 0.1.0, `src/index.js`, one 630-line file with hand-written parsing):

- **Arguments**: the folder must come right after the command (`args[1]`); unknown and misspelled flags
  are ignored (`--outdir`, `--strcit`); `--port abc` becomes `NaN`; `rapidoc biuld` prints the general
  help; `rapidoc build --help` runs a build. Flag style is mixed (`--outDir`, `--mount-path`).
- **`validate`** passes a spec without `info.version` (required by OpenAPI): `@scalar/openapi-parser`'s
  `validate` is lenient. Errors print as a raw object (`[ { message: 'type must be object', path:
  '/paths' } ]`), with no file, line or column.
- **Output and exit codes**: every failure exits 1; output has emoji and no plain or machine-readable
  mode, so CI logs are noisy and nothing can consume the results.
- **Questions**: only `init` asks one (the title); `create-rapidoc` has its own copy of the argument
  handling.

## Principles

1. **Every question is also a flag.** A wizard fills in missing flags; it never offers something a flag
   can't say. After a wizard, print the equivalent one-line command.
2. **Never ask without a terminal.** No prompt when stdin isn't a TTY, `CI` is set, or `--yes` is given:
   use the default, or fail with a message naming the flag to pass.
3. **Commands that have what they need just run.** `dev`, `build`, `serve`, `validate` with their
   arguments never ask anything.
4. **Exit codes mean something**: `0` success; `1` the input has problems (invalid spec, config error,
   failed build); `2` the command line is wrong (unknown command or flag, bad value).
5. **Output adapts**: icons and colour only on a terminal, none with `NO_COLOR` or when piped;
   `--quiet` keeps errors only; `--format json` where results are data (`validate`, `lint`, `doctor`).
6. **Few dependencies.** `node:util` `parseArgs` for arguments (no library). One new dependency for
   prompts (`@clack/prompts`: small, checkboxes and spinners), imported only when the CLI asks.

## Architecture

```text
packages/rapidoc-cli/src/
├── index.js            # dispatcher: picks the command, prints help, maps errors to exit codes
├── commands/           # one file per command: { name, summary, usage, options, run(ctx) }
│   ├── init.js  dev.js  build.js  serve.js  mock.js  validate.js  migrate.js
│   └── preview.js  mcp.js  doctor.js  (later phases)
└── lib/
    ├── args.js         # parseArgs per command, positionals anywhere, typed values, "did you mean"
    ├── output.js       # info/success/warn/error, TTY and NO_COLOR aware, --quiet, json mode
    ├── prompt.js       # the only importer of @clack/prompts; refuses to ask without a TTY
    ├── engines.js      # loadPortal / tryLoadPortal / loadServer / loadMock (moved, unchanged)
    └── errors.js       # UsageError (exit 2), ProblemError (exit 1)
```

Each command declares its options once; `index.js` generates `rapidoc <command> --help` and the
overview from those declarations, so help can't drift from behaviour. The lazy-loading rules in
`AGENTS.md` (never import the engines at the top) carry over to `lib/engines.js`.

`create-rapidoc` keeps the scaffolding (`create-rapidoc/scaffold`) and gains the init wizard
(`create-rapidoc/wizard`), so `npm create rapidoc` and `rapidoc init` ask the same questions.

## Phases

Each phase is its own commit (or a few), passes `npm run test:portal`, and updates the docs listed under
"Docs and examples".

### Phase 1: foundation (no new features)

Done as described, plus: `rapidoc help <command>`; `--help` anywhere on a line wins over mistakes on it;
a folder and spec files together for `mock` is a usage error (exit 2); validate errors print one per line
(`message  (at /path)`) instead of a raw object.

- Split `index.js` into `commands/` and `lib/` as above; behaviour unchanged except what this list says.
- `parseArgs` per command: positionals anywhere (`rapidoc build --out-dir x ./portal`), unknown flags
  are errors with a suggestion (`Unknown option --outdir. Did you mean --out-dir?`), numbers and enums
  checked (`--port abc` → exit 2).
- Unknown command → `Unknown command "biuld". Did you mean "build"?`, exit 2.
- `rapidoc <command> --help` prints that command's usage, options and examples; `--help` never runs it.
- Rename `--outDir` to `--out-dir`. The CLI isn't on npm yet, so no alias; update the docs and demo
  scripts that use it.
- `lib/output.js`, `--quiet`, `NO_COLOR`; exit codes 0/1/2.
- Tests: the 13 existing CLI tests unchanged in meaning; new ones for parsing, help, suggestions, exit
  codes, `NO_COLOR` and piped output.

Size: medium. Everything later builds on it.

### Phase 2: questions where they help

- **`init` wizard** (terminal only): title → which of the specs found to include (checkboxes; default
  all) → run `npm install`? Then print the equivalent command, e.g.
  `rapidoc init docs --title "Acme" --spec specs/orders.yaml --no-install`. New flag `--spec <file>`
  (repeatable) to pick specs without the wizard.
- **Destructive confirm**: `init --force` over existing files lists them and asks; `--yes` skips.
- **`migrate` without `--from`**: look for a Redocly (`redocly.yaml`) or Zudoku (`zudoku.config.*`)
  project and ask to migrate it; without a terminal, exit 2 naming `--from`.
- **Busy port** (`dev`, `serve`, `mock`): ask to use the next free port; without a terminal, fail as today.
- **`rapidoc` alone in a terminal**: a short menu (Start the dev server, Build, Validate specs, Run the
  mock server, Create a portal here, Show help). Not in a terminal: the help, as today.
- Tests drive the wizard through `prompt.js` with scripted answers; a test asserts no prompt is shown
  when stdin isn't a TTY.

Later candidates for the wizard (they need scaffold changes, so not in this phase): accent colour,
add sign-in (`auth:` stub), add a mock server script.

Size: medium.

### Phase 3: a `validate` people can trust

- **Stricter checks**: validate against the official OpenAPI 3.0 and 3.1 JSON Schemas (vendored) with
  `ajv` (already used by `@rapidoc/mock`), in addition to the parser's own checks, so `info.version`,
  bad `paths` keys and the like are caught. Swagger 2.0 keeps the parser's checks.
- **Locations**: map each error's JSON pointer to `file:line:col` with the `yaml` library's
  `parseDocument` ranges (JSON specs too), and print `specs/orders.yaml:12:5  info.version is
  required  (#/info)`, which terminals and editors make clickable. Errors in `$ref`'d files point into
  those files.
- **`--format pretty|json|sarif`**: `json` for scripts, `sarif` so GitHub code scanning shows the
  problems on pull requests.
- **`--strict`**: warnings (broken links, workflow sources that match no API) fail too.
- **`--remote`**: also fetch and check remote specs (skipped today).
- Tests: fixtures for each error kind, locations in YAML and JSON, each format, `--strict`.

Size: medium to large (the location mapping is the careful part).

### Phase 4: new everyday commands

- **`rapidoc preview <spec>`**: zero-config viewer. Serves one spec in `<rapi-doc>` (the browser bundle,
  no Astro) on a local port, reloads on save, `--open` opens the browser. The roadmap's "local
  zero-config previews".
- **`rapidoc mcp export <spec> [--out-dir dir]`**: writes the MCP server project with `@rapidoc/mcp`
  (the same files as `<rapi-doc>`'s Export MCP Server button). **`rapidoc mcp serve <spec>`**: runs it
  over stdio, for adding an API to an AI agent without generating files. `--arazzo <file>` adds
  workflow tools.
- **`rapidoc doctor`**: Node version; versions of the CLI, portal, server and mock, and mismatched
  ranges; the config file found and whether it loads; whether the `rapidoc` bundles are built.
  `--format json` for bug reports.
- `dev --open`.

Size: medium (each command is small; `preview` needs a tiny static server with live reload).

### Phase 5: spec tooling (each gets its own short design first)

- **`rapidoc lint`**: rules for what a portal needs (operationId, summaries, examples, naming, unused
  components, security on write operations), a small rules file to turn them on and off, the same
  output formats as `validate`.
- **`rapidoc bundle <spec>`**: resolve `$ref`s into one file.
- **`rapidoc diff <old> <new>`**: breaking changes between two versions of a spec; pairs with
  `apis[].versions`, and CI can fail a change that breaks an API without a new version.

Size: large.

### Phase 6: polish

- Shell completion (`rapidoc completion zsh|bash|fish`), generated from the command declarations.
- A `files` list in `package.json`, so the published package holds `src/` only (not `design/`, `tests/`).

## Docs and examples to update

- `rapi-portal-doc`: `docs/reference/cli.md` (every phase), `docs/tools/validate.md` (phase 3),
  `docs/tools/migrate.md` (phase 2), `docs/tools/mcp-server.md` (phase 4), the quickstart (phase 2),
  plus new pages for `preview`, `doctor`, `lint`, `bundle`, `diff`.
- `packages/rapidoc-cli/AGENTS.md`: the new layout, principles and exit codes (phase 1).
- `rapi-portal-demo`: scripts that pass `--outDir` (phase 1).

## Open questions

1. **Prompts dependency**: `@clack/prompts`, or stay on `node:readline` and give up checkboxes?
2. **Menu for `rapidoc` alone**: wanted, or keep printing help?
3. **Strict validation**: official schemas with `ajv` (proposed), or another validator?
4. **SARIF in phase 3**, or wait until someone asks?
5. **Order after phase 1**: phase 2 (questions) or phase 3 (validate) first? Phase 3 matters more for CI
   users; phase 2 for first-time users.
