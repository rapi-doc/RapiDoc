# Goldfish Annotated Review Report: round 1

**Status: resolved.** Every PROPOSE FIX item was accepted and applied (26 items, all four pages, plus the
same "default row" label in `sites/rapi-flow/docs/running.mdx`). R6 stays contested; the DECLINE items
(R8, F6, P7, M9) were not changed. Applied differently from the text below:

- **M1:** the Petstore spec needs a bearer token on every pet operation and requires `photoUrls`, so
  the quickstart uses the RapiMock site's own sample, `https://mock.rapidocui.com/spec-check/example.yaml`
  (City Library, no security). The output, the POST response and the list count on the page come from a
  real run of those commands.
- **F4:** the RapiFlow quickstart now has two sections ("Your own files", "Next steps"), so it shows
  "On this page" again (rule: off only for pages with fewer than two sections).

Round 1 was not clean (3 Blockers, 20 Majors), so the loop needs two clean rounds after it.

**Targets** (full file each), reviewed against `docs-review/quickstart-standard.md`:

| Page | File | Reviewers run | Blockers | Majors | Nits |
| :--- | :--- | :--- | :--- | :--- | :--- |
| RapiDoc | `sites/rapidoc/docs/rapidoc/get-started/quickstart.mdx` | 4 of 4 | 0 | 5 | 9 |
| RapiFlow | `sites/rapi-flow/docs/quickstart.mdx` | 4 of 4 | 0 | 5 | 8 |
| RapiDoc Portal | `sites/rapi-portal/docs/getting-started/quickstart.markdoc` | 4 of 4 | 1 | 4 | 9 |
| RapiMock | `sites/rapi-mock/docs/getting-started/quickstart.md` | 4 of 4 | 2 | 6 | 9 |

Reviewers: Comprehension, Codebase details, Style, Structural. All 16 completed. Findings raised by
several reviewers are merged; the count after each says how many raised it. Severity is the highest any
of them gave.

Categories: **PROPOSE FIX** (valid, edit below), **CONTEST** (wrong, with evidence the reviewer could
read), **ESCALATE** (needs your call), **DECLINE** (nit, recorded, not fixed).

What every reviewer confirmed as correct is not repeated here: commands, attributes, defaults, ports,
bundle paths, file names and links all match the source on all four pages, with the exceptions below.

---

## RapiDoc quickstart

### R1. No opening (🟡 Major, 4 reviewers) — PROPOSE FIX
- **Scope:** before `<Steps>` (line 8).
- **Discrepancy:** the body starts at the steps. What the reader will have and what they need (a browser; a spec; CORS for a spec on another domain) appear only in the frontmatter or in step 3.
- **Edit:** add before `<Steps>`: "In one HTML file, `<rapi-doc>` shows an interactive reference for an OpenAPI spec: navigation, search, schemas and a **Try** console. You need a browser; the first step uses a sample spec, and step 3 swaps in yours."

### R2. A local spec fails from `file://` (🟡 Major, 2) — PROPOSE FIX
- **Scope:** steps 2–3 (lines 29–31).
- **Discrepancy:** opening the file from disk works with the hosted sample, but step 3 invites a local `openapi.yaml`, which a browser won't fetch from a `file://` page. The page never says to serve the folder.
- **Edit:** step 3 ends: "A spec next to the page needs the page served over HTTP, not opened from disk: run any static server in the folder, such as `npx serve`."

### R3. Step 3 has no result; `spec-url` marked late (🟢 Nit, 3) — PROPOSE FIX
- **Edit:** step 1 says "points `<rapi-doc>` at a sample spec (you'll use yours in step 3)"; step 3 adds "Reload: your API's operations replace the Petstore's."

### R4. "Make it yours" lists options the steps don't use (🟡 Major, 4) — PROPOSE FIX
- **Scope:** lines 88–110.
- **Discrepancy:** the standard's Short rule: options beyond the steps are linked, not listed. The five-row table repeats the reference and will drift.
- **Edit:** keep the example element, drop the table, and end with: "Every attribute is on the [Attributes](/docs/rapidoc/reference/) page, with links to methods, events and slots; colors and fonts are in [Theming Overview](/docs/rapidoc/theming/overview/)." Rename the heading to "Common attributes". (Also covers the "API reference" link promising more than its page shows, 🟢, 3 reviewers.)

### R5. npm import breaks server rendering (🟡 Major, 2) — PROPOSE FIX
- **Scope:** line 41.
- **Discrepancy:** `import 'rapidoc'` needs `window`; with Next.js or Nuxt it crashes on the server. The linked front-end page says so, this one doesn't.
- **Edit:** "…use it in your markup as above. With server rendering (Next.js, Nuxt, SvelteKit) import it in the browser only: see [Front-End Frameworks](/docs/integrations/front-end/)."

### R6. Dockerfile in a quickstart (🟡 Major, 1) — CONTEST
- **Justification:** the standard allows "a variant (another way to start)" after the steps; self-hosting is that variant, and the Dockerfile is its smallest complete form. No other page on the site covers serving RapiDoc from a container, so moving it would leave nothing to link to.

### R7. Small accuracy and placement fixes (🟢 Nit) — PROPOSE FIX
- Line 65: the CDN pin note sits in the npm section → move it to just after the steps.
- Line 69: "makes no outside calls: only your spec and the API" contradicts itself → "fetches nothing from third parties; it calls only your spec's URL and the API it describes."
- Line 76: "the same two files and your page" → "the bundle, its license notice, your page and your spec".
- Lines 76/84/94: one path form → `src="rapidoc-min.js"`, `spec-url="openapi.yaml"` throughout.
- Line 114: link text "Front-end frameworks" → "Front-End Frameworks" (the page title, as the other links use).

### R8. Recorded, not fixed (🟢 Nit) — DECLINE
- `body { margin: 0 }` is redundant (RapiDoc resets it when it is the body's child): harmless, and the page stays correct without that hidden behavior.
- Sizing aside doesn't explain why `display: block` clips: the advice is enough for a quickstart.
- `allow-try` also takes filter terms: gone with R4.
- A troubleshooting table: optional in the standard; R2 and R5 cover the likely failures.
- Saying Try calls the public Swagger Petstore: minor.

---

## RapiFlow quickstart

### F1. "default row" is "Every step" in the UI, and the section is folded (🟡 Major, 4) — PROPOSE FIX
- **Scope:** line 50, and the same wording in `running.mdx` lines 25 and 28.
- **Discrepancy:** `renderStatusCodes` in `rapi-flow.ts` labels the row **Every step**; Mock Response Status is a closed `<details>` until a status is set.
- **Edit:** "Open **Mock Response Status** and type `503, 200` in the `placeOrder` row … type `404` in the **Every step** row". Same label in `running.mdx`.

### F2. Opening doesn't say what the reader needs (🟡 Major, 3) — PROPOSE FIX
- **Edit:** line 9 becomes: "You will have a workflow drawn next to its API reference, and run it step by step against a mock that answers from the spec. You need a browser and an internet connection: the page loads RapiDoc from unpkg and the sample files from rapidocui.com. Open the file directly or from any local server."

### F3. "Arazzo" and `sourceDescriptions` not defined (🟡 Major, 4) — PROPOSE FIX
- **Edit:** step 1: "…the Petstore spec and its Arazzo file (the [OpenAPI Initiative's format](https://spec.openapis.org/arazzo/latest.html) for multi-step API workflows)". Step 5: "`sourceDescriptions` (the OpenAPI files the workflow calls)".

### F4. Step 5 is a variant with three edits and no result; step 4 is two runs (🟡 Major, 3) — PROPOSE FIX
- **Edit:** split step 4 into "Make a step retry" and "End the workflow early". Move "Use your own files" after `</Steps>` as an H2 "Your own files", together with the Aside and the bundler variant, and add its result ("your first workflow is drawn; with several, a picker appears"). Say "`spec-url` on `<rapi-doc>`" (`<rapi-flow>` has its own `spec-url`), and soften "whose `sourceDescriptions` name it" to "that lists it in `sourceDescriptions`", linking [Pairing](/docs/pairing/) for the exact rule.

### F5. Small fixes (🟢 Nit) — PROPOSE FIX
- Line 48: mention the **Inputs** form ("leave the inputs as they are"); "lights up" → "is highlighted".
- Line 50: "the workflow's `retry` action" → "the step's `retry` action".
- Line 57: "from the reader's browser" → "from the visitor's browser".
- Line 60: add `npm install rapidoc` as a command.
- Lines 69–74: link text matches page titles ("Running Workflows", "Arazzo Extensions", "Slots & Styling", "API Reference", "RapiFlow feature page").
- Line 3: " - " → ":".
- Line 9: drop "In a few minutes".

### F6. Recorded, not fixed (🟢 Nit) — DECLINE
- Unversioned unpkg URLs: deliberate for a first try; the RapiDoc quickstart covers pinning.
- Clicking a step scrolls the page away from the diagram: true, minor.
- The log row's step number and id aren't listed: harmless.

---

## RapiDoc Portal quickstart

### P1. The config error doesn't suggest keys for typos (🔴 Blocker, 1) — PROPOSE FIX
- **Scope:** line 127 (Troubleshooting).
- **Discrepancy:** `config/errors.js` suggests a key only for the fixed list of other portals' key names (`KEY_HINTS`) and `apis[].path`; a typo such as `titel` gets only `unknown key "titel"`. Verified.
- **Edit:** "The error names the key and its path; for a key from another portal tool (Redocly, Zudoku) it names the key to use instead."

### P2. Try "sends a real request", but the starter's servers are placeholders (🟡 Major, 3) — PROPOSE FIX
- **Scope:** line 43.
- **Discrepancy:** `STARTER_SPEC` servers are `api.example.com` and `sandbox.example.com`; the first Try fails, in the step meant to show success.
- **Edit:** "…with a **Try** button on each operation (the example's servers are placeholders, so its requests fail until your own spec is in)".

### P3. Renaming the id misses the home page, the guide's embed and the header item (🟡 Major, 4) — PROPOSE FIX
- **Scope:** line 58.
- **Discrepancy:** `core` is also in `docs/index.markdoc` (hero link `/apis/core`), `docs/guides/overview.markdoc` (`spec="core"`) and the header's "Core API" item. Following the page leaves a broken button and a broken embed.
- **Edit:** shorten step 4 to the action and its result ("Reload `/apis/core/`: it now shows your API."), then one sentence: "To rename the API or its tab, search the project for `core` and `Core API`: the id is in `navigation:`, the header, the home page and the starter guide ([APIs](/docs/configuration/apis/))."

### P4. `site.title` doesn't change the home page title (🟡 Major, 1) — PROPOSE FIX
- **Scope:** lines 42 and 64.
- **Discrepancy:** the home page hero title is the frontmatter `title` of `docs/index.markdoc` (`STARTER_HOME`), not `site.title`. Verified.
- **Edit:** step 5: "Change `site.title` in `rapidoc.config.yaml` for the header and the browser tab, and `title` at the top of `docs/index.markdoc` for the home page." Step heading "Change the title".

### P5. Product names (🟡 Major, 2) — PROPOSE FIX
- **Discrepancy:** the body never says RapiDoc Portal or RapiDoc CLI, only short forms (`brand/README.md`: short forms only after the full name).
- **Edit:** line 6 "…you'll have a RapiDoc Portal running…"; line 32 "the `rapidoc` command (RapiDoc CLI, `@rapidoc/cli`) and the portal engine (`@rapidoc/portal`)"; line 99 "which is RapiDoc, the `<rapi-doc>` web component".

### P6. Small fixes (🟢 Nit) — PROPOSE FIX
- Line 88: init's scripts → "with the starter's scripts (`dev`, `build`, `start`, `validate`, `preview`)".
- Line 86: init asks which specs only when it finds some, and about installing only without a `package.json`.
- Line 88: "as in steps 2 and 3 above" → name the steps.
- Line 52: the excerpt's `title="rapidoc.config.yaml"` → drop the title (the lead-in names the file).
- Line 74: "`npm run preview` (serves `dist/` with the `serve` package; npm may ask to download it)".
- Lines 6, 32: drop "In a few minutes" and "It takes a minute or two".
- Next steps: on the existing-`package.json` path there is no `validate` script → "`npm run validate` (or `npx rapidoc validate`)".

### P7. Recorded, not fixed (🟢 Nit) — DECLINE
- Step 4 and step 6 hold several actions: P3 shortens step 4; step 6 (stop, build, preview, upload) reads as one task.
- `npm install` also installs `@rapidoc/server`; the `.gitignore` comment lists 4 of 6 entries; `doctor` checks more than listed; render.yaml with an existing `package.json`: all accurate enough for a quickstart.
- Chained colons, the skip link's wording: style preference.

---

## RapiMock quickstart

### M1. The spec the steps need is never given (🔴 Blocker, 4) — PROPOSE FIX
- **Scope:** lines 6, 17, 20–34.
- **Discrepancy:** steps 2–3 need a file named `openapi.yaml` with a `/pets` collection that accepts `{"name":"Biscuit"}`, and the printed counts (3 resources, 30 records, 14/2/3) belong to one unnamed spec. With any other spec step 3 returns 404 or 400. The site has no pets spec (its only sample is the City Library `example.yaml`).
- **Edit:** use a spec the reader can fetch: `npx rapidoc mock https://rapidocui.com/specs/petstore.yaml --stateful` (a URL works, per the CLI options page), served under `/petstore`. Run it here, and copy the real printed lines and the real responses into the page. Keep a line on using your own file.

### M2. The printed output is an unmarked excerpt (🔴 Blocker, 4) — PROPOSE FIX
- **Scope:** lines 20–25.
- **Edit:** introduce it as "Among what it prints:", and include the per-API line, which confirms the address. Use the real output from M1.

### M3. No outcome sentence; RapiMock never named in the body (🟡 Major, 4) — PROPOSE FIX
- **Edit:** line 6 becomes: "RapiMock turns an OpenAPI spec into a mock API on your computer that remembers what you create. You need Node.js 22.12 or later; the steps use a sample spec, and work the same with your own OpenAPI 3.0, 3.1 or 3.2 file."

### M4. `--stateful`, "seeded" and the three labels undefined (🟡 Major, 4) — PROPOSE FIX
- **Edit:** step 2: "`--stateful` keeps records: it starts each resource with 10 generated ones (seeded), and what you create, change or delete shows up in later reads. It labels each operation stateful, needs review or static: see [Keeping state](/docs/state/overview/)."

### M5. No Next steps (🟡 Major, 4) — PROPOSE FIX
- **Edit:** add "## Next steps": [Keeping state](/docs/state/overview/), [Seed data](/docs/state/seed-data/), [Picking a response](/docs/responses/picking-a-response/), [Tokens and scopes](/docs/responses/tokens-and-scopes/), [CLI options](/docs/reference/cli/), [Tests in JavaScript](/docs/testing/javascript/).

### M6. The portal-folder line needs an uninstalled package and undefined terms (🟡 Major, 4) — PROPOSE FIX
- **Scope:** line 45.
- **Discrepancy:** with no argument, `rapidoc mock` uses the current folder: a RapiDoc Portal folder needs `@rapidoc/portal` installed; any other folder is scanned for OpenAPI files. The page names neither.
- **Edit:** "`npx rapidoc mock` with no argument mocks the current folder: every OpenAPI file in it, or, in a [RapiDoc Portal](https://portal.rapidocui.com/) project, the APIs in its config (needs `@rapidoc/portal`)." Shorten "More than one spec" to the examples and link [CLI options](/docs/reference/cli/) for `--port` and name clashes.

### M7. Step 3 result too thin (🟡 Major, 1) — PROPOSE FIX
- **Edit:** show the POST's response (status and the new record with its id) and say the list now has 11 pets: from the real run in M1.

### M8. Small fixes (🟢 Nit) — PROPOSE FIX
- Line 14: "Start it" → "Start the mock server".
- Line 20: "(or the port it offers if 4010 is taken)".
- Line 30: `localhost:4010` → `http://localhost:4010`, as elsewhere.
- Line 38: step 4's result ("the Resources section lists Pet with its records").
- Line 52: "token checks work the same" → "`security` checks are the same (any bearer token passes unless you set an issuer)"; "answered on its own" → "nothing is stored: each call gets the spec's example or generated data".
- Line 11: "in your project folder (run `npm init -y` first in an empty one)".

### M9. Recorded, not fixed (🟢 Nit) — DECLINE
- Step 3 is two calls: they are one check (create, then read back).
- Variant headings at H2 next to numbered steps: M5's Next steps closes the sequence.
- Folder scanning goes 3 levels deep and may report Swagger 2.0 files as not served: reference detail.
