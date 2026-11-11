# AGENTS.md — `integrations/rapidoc-dotnet` (`RapiDoc.AspNetCore` on NuGet)

## 1. Scope & Identity

RapiDoc for ASP.NET Core: `app.MapRapiDoc()` serves the reference, the OAuth return page and the bundle. Like the Python package, it is a port of the contract of `@rapidoc/embed` checked with the shared fixtures.

- **Package**: `RapiDoc.AspNetCore`, namespace `RapiDoc.AspNetCore`. Targets `net8.0` (it runs on every later ASP.NET Core) with only the shared framework as a dependency.
- **Not an npm workspace.** It lives under `integrations/`, with its own toolchain (the .NET SDK, xunit) and its own version in the project file. Changesets and the npm release workflow do not see it; `npm run lint`, `format` and the `test:*` scripts do not cover it. `.github/workflows/publish-dotnet.yml` runs its tests (.NET 8 and 10) on changes, and publishes to nuget.org with trusted publishing when run by hand with "publish" ticked; nuget.org trusts that file name and the `nuget` environment.
- **Meant to be able to move to a repository of its own.** The only links to the monorepo are the two defaults noted below.

| File | Role |
| :--- | :--- |
| `src/RapiDoc.AspNetCore/RapiDocContract.cs` | The contract in C#: a port of `packages/rapidoc-embed/src/core.js`, same function for function. No ASP.NET Core type |
| `src/RapiDoc.AspNetCore/RapiDocOptions.cs` | `RapiDocOptions` and `RapiDocAssets`: the contract's options in .NET naming |
| `src/RapiDoc.AspNetCore/RapiDocEndpointRouteBuilderExtensions.cs` | `MapRapiDoc`: maps the contract's routes as endpoints, adds `PathBase` and a route group's prefix to the page's URLs; `RapiDocBundle` reads the embedded files |
| `src/RapiDoc.AspNetCore/assets/` | One rapidoc release: `rapidoc-min.js`, its license file, `integration.json`. Not in git; embedded in the assembly |
| `RAPIDOC_VERSION` | The rapidoc release a published package carries. Raise it, and `<Version>` in the project file, to ship a newer bundle |
| `scripts/sync-assets.sh` | Fills `assets/` from `packages/rapidoc/dist` (default), another folder, or the npm registry (`--npm`, the version in `RAPIDOC_VERSION`) |
| `tests/RapiDoc.AspNetCore.Tests/` | `ConformanceTests` (the shared fixtures) and `EndpointTests` (a real app on the in-memory test server) |
| `examples/Example/` | A minimal API with `MapOpenApi()` (launch config `dotnet-example`, port 4407) |

---

## 2. Boundaries and Invariants

- **`RapiDocContract.cs` and `core.js` change together.** Any change to the contract's output is made in `@rapidoc/embed` first (new contract version, regenerated fixtures), then ported here until `ConformanceTests` passes. Never adjust a fixture to fit the port.
- **`RapiDocContract` takes the contract's option names** (`uiPath`, `specUrl`, `scriptUrl`) as a `JsonObject`, because the fixtures are read as they are. .NET naming is translated in `MapRapiDoc`.
- **JSON is written by the port's own writer**, not `System.Text.Json`'s: that one escapes non-ASCII and HTML characters, and the fixtures need what JavaScript's `JSON.stringify` writes.
- **No `\u` escape sequences in the C# sources.** Some editing tools turn them into the character itself; build them (`Escape("003c")`, `(char)0x2028`) as the contract file does.
- **The three asset files come from one rapidoc release**; `integration.json` carries the bundle's SRI hash, which is also the ETag. The build fails without them.
- **Monorepo defaults**: the tests find the fixtures by walking up to `packages/rapidoc-embed/conformance/fixtures` (override with `RAPIDOC_CONFORMANCE_DIR`), and `sync-assets.sh` reads `packages/rapidoc/dist`. In a repository of its own, the fixtures would be copied in and the assets synced with `--npm`.
- **No HTML outside `RapiDocContract.cs`**, and handlers are plain `RequestDelegate`s (no reflection-based binding).
- **Warnings are errors**, and public members need XML doc comments.

---

## 3. Commands (from this folder)

| Command | Purpose |
| :--- | :--- |
| `scripts/sync-assets.sh --npm` | Download the rapidoc release in `RAPIDOC_VERSION` (or, without `--npm`, copy the local build) |
| `dotnet test -f net10.0` | Conformance fixtures and endpoint tests on one runtime (`dotnet test` needs .NET 8 and 10 installed) |
| `dotnet run --project examples/Example --urls http://localhost:4407` | Run the example |
| `dotnet pack src/RapiDoc.AspNetCore -c Release -o artifacts` | Build the NuGet package |

**Releasing**: the steps are in `README.md`, "Releasing (for maintainers)". In short: raise `<Version>` in the project file (and `RAPIDOC_VERSION` for a newer bundle), merge, then run the ".NET package" workflow with "publish" ticked.
