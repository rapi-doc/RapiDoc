# AGENTS.md — `packages/rapidoc-cli` (Command Line Utility)

## 1. Package Scope & Identity

`packages/rapidoc-cli` provides the `rapidoc` command, the one tool users run: `rapidoc init` (scaffold a portal, optionally around existing OpenAPI files), `rapidoc dev` (local preview), `rapidoc build` (static portal build), `rapidoc serve` (serve a build with sign-in and access rules), `rapidoc mock` (mock server for the portal's APIs), `rapidoc validate` (OpenAPI validation), `rapidoc bundle` (one file from a spec split over several), `rapidoc preview` (one spec in `<rapi-doc>`, reloading on save), `rapidoc mcp export|serve` (a spec as MCP tools), `rapidoc doctor` (setup check) and `rapidoc migrate` (config migration from Redocly or Zudoku). Future tools (linting) belong here too.

- **Package Name**: `@rapidoc/cli`
- **Binary Name**: `rapidoc`
- **Entry Point**: `src/index.js` (the dispatcher)
- **Module Type**: ESM (`"type": "module"`)
- **Plans**: `design/cli-overhaul.md` (phases 1–4 done) and `design/spec-tooling.md` (phase 5: `bundle` done, `lint` next)

### Layout

```text
src/
├── index.js        # picks the command, prints help, runs it, maps thrown errors to exit codes
├── commands/       # one file per command: { name, usage, summary, description, positionals, options, examples, run }
└── lib/
    ├── args.js     # parseCommandArgs: node:util parseArgs + unknown-option suggestions, typed values, choices
    ├── errors.js   # UsageError (exit 2), ProblemError (exit 1)
    ├── help.js     # overview and per-command help, generated from the command declarations
    ├── output.js   # info / success / warn / error; icons only on a terminal without NO_COLOR; --quiet
    ├── engines.js  # loadPortal / tryLoadPortal / loadServer / loadMock (lazy imports)
    ├── prompt.js   # questions (@clack/prompts, imported lazily): canAsk, text, confirm, select, multiselect
    ├── ports.js    # startOnFreePort (serve, mock, preview), choosePort (dev): offer the next free port
    ├── open.js     # openBrowser (--open on dev and preview); RAPIDOC_OPEN_COMMAND swaps the opener in tests
    └── suggest.js  # "did you mean" for commands, options and choices
validate/           # rapidoc validate's engine (imported only by validate and bundle)
├── bundle.js       # loadFiles: a spec and the files its $refs reach (yaml, with positions); bundleSpec: the same with other-file $refs inlined, in-file ones kept, origin of every copied node
├── check.js        # checkSpec: @scalar/openapi-validator (strict) + path parameters; each error → file, line, column, JSON pointer
└── report.js       # pretty (terminal), json, sarif 2.1.0
bundle/             # rapidoc bundle's engine, over loadFiles (imported only by that command)
├── components.js   # toComponents: other-file $refs → components (#/components/<kind>/<name>; Swagger 2.0: definitions/parameters/responses), by the OpenAPI structure the walk knows; unknown kinds inlined
├── dereference.js  # dereference: every $ref inlined; CycleError (with the chain) on a recursive one
└── write.js        # formatFor (--format, else the output's extension), serialize (yaml without aliases, or json)
```

### Rules for commands

- Declare every option in the command's `options` (`type`, `kind: "port" | "int"`, `choices`, `default`,
  `required`, `negatable`, `short`, `value`, `description`); help comes from these, so never hand-write help.
- Options are kebab-case (`--out-dir`, `--mount-path`).
- Never call `process.exit` to fail: throw `UsageError` for a wrong command line (exit 2) and `ProblemError`
  for problems in the input (exit 1). The dispatcher prints them (`error: …` when piped).
- Print through `lib/output.js`: results and progress with `info`/`success` (stdout, hidden by `--quiet`),
  problems with `warn`/`error` (stderr). Pass emoji through `icon()` so piped output stays plain.
- Long-running commands (`dev`, `serve`, `mock`, `preview`) return after starting; they handle SIGINT/SIGTERM themselves.
- A command whose result goes to stdout as a document (`validate --format json`, `bundle` without `-o`, `mcp serve`) calls `setQuiet(true)` first, so nothing else lands there; it reports on stderr.
- Questions only through `lib/prompt.js`, and only when `canAsk()`: stdin and stdout are terminals, `CI`
  is unset, `--yes` (global) wasn't given. Otherwise use the default (`assumingYes()` for --yes) or throw a
  `UsageError` naming the option to pass. Every question needs an option that answers it. Ctrl+C throws
  `CancelledError` (exit 130). Tests script answers with `RAPIDOC_PROMPT_ANSWERS` (a JSON array; `null` is
  Ctrl+C): `tests/prompts.test.js`.
- A taken port: `serve` and `mock` start first and call `startOnFreePort` (so their own checks, such as a
  missing build, come first); `dev` uses `choosePort`, since Astro moves to a free port itself.
- Don't import heavy modules at the top of a command file: every command module is loaded for help
  (`validate` imports `@scalar/openapi-parser` inside `run`).

---

## 2. Technology Stack & Dependencies

- **Runtime**: Node.js >= 22.12.0
- **`rapidoc` and `@rapidoc/mcp`** (dependencies): `preview` serves `rapidoc`'s `dist/rapidoc-min.js`; `mcp` builds manifests and projects with `@rapidoc/mcp`, from the spec loaded by `validate/bundle.js` (other-file `$ref`s inlined).
- **MCP SDK**: `@modelcontextprotocol/sdk`, a fourth **optional peer**, for `mcp serve` only, through `loadMcpSdk()`. `mcp serve` writes the MCP protocol on stdout, so it sets quiet and reports on stderr. Tests simulate a missing SDK with `RAPIDOC_MCP_SDK_MODULE`.
- **Validation**: `@scalar/openapi-validator` (strict: the official OpenAPI 2.0–3.2 schemas, path and cookie parameter rules) and `yaml` (parsing with line and column numbers). Not `@scalar/openapi-parser`'s `validate`: it fills in defaults first, so a missing `info.version` passes. In-file `$ref`s stay `$ref`s when validating: dereferencing recursive schemas overflows the stack on OpenAPI 3.0.
- **Scaffolding**: `create-rapidoc` (`create-rapidoc/scaffold`: `scaffoldProject`, `findOpenApiSpecs`), imported lazily by `init`
- **Portal Engine**: `@rapidoc/portal`, an **optional peer dependency** (`^0.1.0`). Load it only through `loadPortal()` / `tryLoadPortal()` (dynamic `import()`), never with a top-level import: `dev`, `build`, `migrate` and folder-wide `validate` need it and print `npm install -D @rapidoc/portal` when it is missing; `init` and single-spec `validate` work without it. Tests simulate a missing engine with `RAPIDOC_PORTAL_MODULE`.
- **Server**: `@rapidoc/server`, the other **optional peer dependency** (`^0.1.0`), behind `rapidoc serve` only. Load it only through `loadServer()` (dynamic `import()`); when missing, `serve` prints `npm install @rapidoc/server`. Tests simulate a missing server with `RAPIDOC_SERVER_MODULE`. `serve` prints the server's `SettingsError` problems (missing secrets, unreachable provider) and exits 1.
- **Mock server**: `@rapidoc/mock`, the third **optional peer dependency** (`^0.1.0`), behind `rapidoc mock` only. Load it only through `loadMock()`; when missing, `mock` prints `npm install -D @rapidoc/mock`. Tests simulate a missing mock with `RAPIDOC_MOCK_MODULE`. `mock [dir]` with a `rapidoc.config.*` reads `apis:` with `loadPortal().loadConfig` (so it needs the portal engine) and passes `{ id, title, fullPath }` of the local specs: every version, the default under `/<id>` and the others under `/<id>/<version>` (listed first, because the mock server tries APIs in order). A folder without a config is scanned with `findOpenApiSpecs` (`create-rapidoc/scaffold`, imported lazily, as in `init`), and `mock a.yaml b.yaml …` takes the files given; both name each API after its file (`mockApisFromFiles`: slug of the file name, parent folders added until colliding ids differ) and must never load the portal engine (tested with `RAPIDOC_PORTAL_MODULE` pointing at a missing module). The config check (`hasPortalConfig`) mirrors the portal's `CONFIG_CANDIDATES`: keep them in step. Issuer and audience come from `--issuer`/`--audience` or `RAPIDOC_MOCK_ISSUER`/`RAPIDOC_MOCK_AUDIENCE`.
- **Shebang**: `#!/usr/bin/env node`

---

## 3. Local Commands

Run these commands from `packages/rapidoc-cli`:

| Command                    | Purpose                                                                                                                                                                                                                                                            |
| :------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm start`                | Executes `node src/index.js`                                                                                                                                                                                                                                       |
| `node src/index.js <args>` | Directly test CLI arguments during development                                                                                                                                                                                                                     |
| `npm test`                 | Runs `tests/**/*.test.js` (`cli.test.js`: commands end to end; `args.test.js`: parsing, help, exit codes; `validate.test.js`; `prompts.test.js`: questions; `tools.test.js`: preview, mcp, doctor; `bundle.test.js`: bundle, fixtures in `tests/fixtures/bundle/`) |

---

## 4. Coding & Architecture Guidelines

1. **Pure Node ESM**: Use native Node.js APIs (e.g., `node:fs`, `node:path`, `node:process`).
2. **CLI Output & Error Handling**:
   - Provide clean, readable terminal output.
   - Exit codes: `0` success, `1` problems in the input (spec, config, build, missing engine), `2` a wrong command line.
   - Gracefully handle file reading errors, network timeouts, and OpenAPI parse errors.
3. **Execution Permissions**:
   - Ensure `src/index.js` retains executable permissions (`chmod +x src/index.js`).
