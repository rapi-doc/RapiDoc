# AGENTS.md — `packages/rapidoc-cli` (Command Line Utility)

## 1. Package Scope & Identity

`packages/rapidoc-cli` provides the `rapidoc` command, the one tool users run: `rapidoc init` (scaffold a portal, optionally around existing OpenAPI files), `rapidoc dev` (local preview), `rapidoc build` (static portal build), `rapidoc serve` (serve a build with sign-in and access rules), `rapidoc mock` (mock server for the portal's APIs), `rapidoc validate` (OpenAPI validation), and `rapidoc migrate --from redocly|zudoku` (config migration). Future tools (linting) belong here too.

- **Package Name**: `@rapidoc/cli`
- **Binary Name**: `rapidoc`
- **Entry Point**: `src/index.js` (the dispatcher)
- **Module Type**: ESM (`"type": "module"`)
- **Plan**: `design/cli-overhaul.md` (phase 1, the foundation below, is done)

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
    └── suggest.js  # "did you mean" for commands, options and choices
validate/           # rapidoc validate's engine (imported only by that command)
├── bundle.js       # load a spec and the files its $refs reach (yaml, with positions); inline other-file $refs, keep in-file ones; origin of every copied node
├── check.js        # checkSpec: @scalar/openapi-validator (strict) + path parameters; each error → file, line, column, JSON pointer
└── report.js       # pretty (terminal), json, sarif 2.1.0
```

### Rules for commands

- Declare every option in the command's `options` (`type`, `kind: "port" | "int"`, `choices`, `default`,
  `required`, `negatable`, `short`, `value`, `description`); help comes from these, so never hand-write help.
- Options are kebab-case (`--out-dir`, `--mount-path`).
- Never call `process.exit` to fail: throw `UsageError` for a wrong command line (exit 2) and `ProblemError`
  for problems in the input (exit 1). The dispatcher prints them (`error: …` when piped).
- Print through `lib/output.js`: results and progress with `info`/`success` (stdout, hidden by `--quiet`),
  problems with `warn`/`error` (stderr). Pass emoji through `icon()` so piped output stays plain.
- Long-running commands (`dev`, `serve`, `mock`) return after starting; they handle SIGINT/SIGTERM themselves.
- Don't import heavy modules at the top of a command file: every command module is loaded for help
  (`validate` imports `@scalar/openapi-parser` inside `run`).

---

## 2. Technology Stack & Dependencies

- **Runtime**: Node.js >= 22.12.0
- **Validation**: `@scalar/openapi-validator` (strict: the official OpenAPI 2.0–3.2 schemas, path and cookie parameter rules) and `yaml` (parsing with line and column numbers). Not `@scalar/openapi-parser`'s `validate`: it fills in defaults first, so a missing `info.version` passes. In-file `$ref`s stay `$ref`s when validating: dereferencing recursive schemas overflows the stack on OpenAPI 3.0.
- **Scaffolding**: `create-rapidoc` (`create-rapidoc/scaffold`: `scaffoldProject`, `findOpenApiSpecs`), imported lazily by `init`
- **Portal Engine**: `@rapidoc/portal`, an **optional peer dependency** (`^0.1.0`). Load it only through `loadPortal()` / `tryLoadPortal()` (dynamic `import()`), never with a top-level import: `dev`, `build`, `migrate` and folder-wide `validate` need it and print `npm install -D @rapidoc/portal` when it is missing; `init` and single-spec `validate` work without it. Tests simulate a missing engine with `RAPIDOC_PORTAL_MODULE`.
- **Server**: `@rapidoc/server`, the other **optional peer dependency** (`^0.1.0`), behind `rapidoc serve` only. Load it only through `loadServer()` (dynamic `import()`); when missing, `serve` prints `npm install @rapidoc/server`. Tests simulate a missing server with `RAPIDOC_SERVER_MODULE`. `serve` prints the server's `SettingsError` problems (missing secrets, unreachable provider) and exits 1.
- **Mock server**: `@rapidoc/mock`, the third **optional peer dependency** (`^0.1.0`), behind `rapidoc mock` only. Load it only through `loadMock()`; when missing, `mock` prints `npm install -D @rapidoc/mock`. Tests simulate a missing mock with `RAPIDOC_MOCK_MODULE`. `mock [dir]` with a `rapidoc.config.*` reads `apis:` with `loadPortal().loadConfig` (so it needs the portal engine) and passes `{ id, title, fullPath }` of the local specs: every version, the default under `/<id>` and the others under `/<id>/<version>` (listed first, because the mock server tries APIs in order). A folder without a config is scanned with `findOpenApiSpecs` (`create-rapidoc/scaffold`, imported lazily, as in `init`), and `mock a.yaml b.yaml …` takes the files given; both name each API after its file (`mockApisFromFiles`: slug of the file name, parent folders added until colliding ids differ) and must never load the portal engine (tested with `RAPIDOC_PORTAL_MODULE` pointing at a missing module). The config check (`hasPortalConfig`) mirrors the portal's `CONFIG_CANDIDATES`: keep them in step. Issuer and audience come from `--issuer`/`--audience` or `RAPIDOC_MOCK_ISSUER`/`RAPIDOC_MOCK_AUDIENCE`.
- **Shebang**: `#!/usr/bin/env node`

---

## 3. Local Commands

Run these commands from `packages/rapidoc-cli`:

| Command                    | Purpose                                                                                                   |
| :------------------------- | :-------------------------------------------------------------------------------------------------------- |
| `npm start`                | Executes `node src/index.js`                                                                              |
| `node src/index.js <args>` | Directly test CLI arguments during development                                                            |
| `npm test`                 | Runs `tests/**/*.test.js` (`cli.test.js`: commands end to end; `args.test.js`: parsing, help, exit codes) |

---

## 4. Coding & Architecture Guidelines

1. **Pure Node ESM**: Use native Node.js APIs (e.g., `node:fs`, `node:path`, `node:process`).
2. **CLI Output & Error Handling**:
   - Provide clean, readable terminal output.
   - Exit codes: `0` success, `1` problems in the input (spec, config, build, missing engine), `2` a wrong command line.
   - Gracefully handle file reading errors, network timeouts, and OpenAPI parse errors.
3. **Execution Permissions**:
   - Ensure `src/index.js` retains executable permissions (`chmod +x src/index.js`).
