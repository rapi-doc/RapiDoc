# Goldfish Annotated Review Report: round 2

**Status: resolved (auto accept).** Every PROPOSE FIX item was applied: D1–D5, F7–F11, P8–P10, M10–M13.
P8's rename list went to `sites/rapi-portal/docs/configuration/apis.md` ("Changing an id"). The
DECLINE items and the settled R6/M9 were not changed. The RapiMock POST response on the page is from a
fresh run with `curl -i`.

**Targets:** the same four quickstarts, after round 1's fixes, against `docs-review/quickstart-standard.md`.

| Page | Reviewers run | Blockers | Majors (open) | Nits |
| :--- | :--- | :--- | :--- | :--- |
| RapiDoc | 4 of 4 | 0 | 5 | 10 |
| RapiFlow | 4 of 4 | 0 | 4 | 12 |
| RapiDoc Portal | 4 of 4 | 0 | 2 | 14 |
| RapiMock | 4 of 4 | 0 | 4 | 16 |

**Round 2 is not clean** (open Majors), so the loop continues. No Blockers: every reviewer confirmed the
commands, attributes, printed output, responses and links against the source.

**Settled, not reopened:** the Dockerfile in the RapiDoc quickstart (R6, contested in round 1) and
RapiMock's step 3 being two calls (M9, declined in round 1) came up again; both stay settled.
**Reopened:** RapiDoc's "Common attributes" (round 1's R4 trimmed it, 3 reviewers still flag it, so that
fix didn't go far enough).

---

## RapiDoc quickstart

### D1. Step 3 needs Node.js and a server the opening doesn't mention (🟡 Major, 4 reviewers) — PROPOSE FIX
- **Scope:** line 8 against line 33.
- **Edit:** the opening adds: "To use a spec file from your computer in step 3, you also need a local web server, such as `npx serve` (Node.js)."

### D2. Step 3 holds an action plus three conditions; the local-spec path isn't runnable; Try needs CORS on your API (🟡 Major, 3) — PROPOSE FIX
- **Scope:** line 33.
- **Discrepancy:** step 3 is replace + reload + CORS for the spec + serving a local file, with no `spec-url` value or address for the local case. Once your spec loads, **Try** calls your API from the browser, which needs CORS too: the likeliest error right after step 3, not mentioned.
- **Edit:** step 3 keeps the action and its result. A **Troubleshooting** table after the steps gets three rows:
  - the spec doesn't load from another domain → that server must allow cross-origin requests ([Loading Your Spec](/docs/rapidoc/get-started/openapi-support/#from-a-url));
  - a spec file next to the page doesn't load → serve the folder (`npx serve`), open the address it prints, and use `spec-url="openapi.yaml"`;
  - **Try** fails with a network error → your API must allow cross-origin requests from the page, including the `Authorization` header.

### D3. "Common attributes" still lists options the steps don't use (🟡 Major, 3; reopened R4) — PROPOSE FIX
- **Scope:** lines 90–104.
- **Edit:** remove the section; Next steps gains "[Attributes](/docs/rapidoc/reference/): every attribute, such as `theme`, `color-scheme`, `render-style` and `allow-try`, with links to methods, events and slots."

### D4. "Without a CDN": the copy step and the Dockerfile assume different folders (🟡 Major, 2) — PROPOSE FIX
- **Scope:** lines 69–88.
- **Discrepancy:** `cp … public/` fails without the folder and assumes the page is in it; the Dockerfile copies from `node_modules/` and the build root instead.
- **Edit:** one layout: "Put the page, your spec and the bundle in one folder, here `public/`": `mkdir -p public` then the `cp`; the Dockerfile copies `public/` (`COPY public/ /usr/share/nginx/html/`). One term, "license notices", throughout.

### D5. Small fixes (🟢 Nit) — PROPOSE FIX
- Name the sample once ("the sample Petstore spec") in step 1, and drop the repeated hand-off and feature list in the opening (lines 8, 12, 31).
- Line 41: say why to pin ("a new major version can change attributes").
- Line 38: "set a height and don't override `display`: with `display: block` …".
- Line 71: "RapiDoc loads nothing from a third-party host; requests go to your spec's URL and the servers it names."
- Line 45: two sentences ("…in the browser only. See …").

### D6. Recorded, not fixed (🟢 Nit) — DECLINE
- `/examples/` "every feature" and Common Tasks wording: descriptions of other pages, fine as is.
- Unchecked: whether rapidocui.com sends CORS headers for the sample spec (opened from `file://`). The live site serves it to the current quickstart already; checked separately below.

---

## RapiFlow quickstart

### F7. The workflow picker is described wrongly (🟡 Major, 3) — PROPOSE FIX
- **Scope:** line 57 (and step 2).
- **Discrepancy:** the picker shows whenever the file has several workflows (`rapi-flow.ts` 2004–2007); the sample has four, so it is already there in step 2.
- **Edit:** step 2: "The header's picker switches between the file's four workflows; `workflow-id` picks the one shown first." "Your own files": "Without `workflow-id`, the first workflow is shown."

### F8. Step 5 doesn't say what the reader sees (🟡 Major, 2) — PROPOSE FIX
- **Edit:** "…`findAvailable` fails: its log row shows ✗ and opens on the failed check (`→ end`), and an error that the workflow failed at `findAvailable` takes the place of the outputs." Step 4 likewise: "the first `placeOrder` row shows ✗ and `→ retry`, the second ✓."

### F9. Local files fail when the page is opened from disk (🟡 Major, 1) — PROPOSE FIX
- **Edit:** opening: "Open the file directly; with your own local files later, serve the folder from a local server." "Your own files" adds the same.

### F10. "Your own files" is one dense paragraph (🟡 Major, 1) — PROPOSE FIX
- **Edit:** a short list: set `spec-url` on `<rapi-doc>`; set `arazzo-url` on `<rapi-flow>` to a file that lists the spec in `sourceDescriptions` (see [Pairing](/docs/pairing/)); drop `workflow-id` to show the first workflow; serve both files from a local server or a host that allows cross-origin requests.

### F11. Small fixes (🟢 Nit) — PROPOSE FIX
- "next to its API reference" → "above" (lines 3, 8), matching "the reference below".
- Line 45: the reference scrolls inside its own box: "scroll down: the reference below shows its operation".
- Line 47: the log row starts with the step id: "with the step, its method and URL, the status and ✓"; drop "is highlighted while its request is in flight" (the mock answers at once).
- Line 63: "replace the two script tags with these imports".
- Line 60: "from the browser" for "from the visitor's browser".
- Bundler install under its own heading "With a bundler".

### F12. Recorded, not fixed (🟢 Nit) — DECLINE
- Steps 4 and 5 each "open, type, run": one task each, after round 1's split.
- "Clear the `placeOrder` row" is not strictly needed: it keeps the run clean.
- Defining `retry`/`onFailure`: step 4 and 5 now say what happens (F8).
- Unchecked: that the published `rapidoc` on unpkg has `rapidoc-flow-min.js`: checked separately below.

---

## RapiDoc Portal quickstart

### P8. After the swap, the starter guide's embed shows nothing (🟡 Major, 2) — PROPOSE FIX
- **Scope:** lines 58–60.
- **Discrepancy:** `docs/guides/overview.markdoc` still embeds `GET /items` of `core`; with your spec it renders empty, silently (`ApiOperation.astro` warns only on a missing API).
- **Edit:** step 4 ends: "The starter guide `docs/guides/overview.markdoc` embeds the example's `GET /items`: change its `path` and `method` to one of your operations, or delete that section." The rename sentence becomes a link: "To rename the API, see [APIs](/docs/configuration/apis/)" (and add the four places to that page).

### P9. In an existing repository, `init` keeps your `.gitignore` and adds no scripts (🟡 Major, 1) — PROPOSE FIX
- **Edit:** the existing-`package.json` bullet adds: "`init` adds no scripts: use `npx rapidoc dev`, `npx rapidoc build` and `npx rapidoc validate`." After it: "`init` keeps an existing `.gitignore`: add `dist/` and `.rapidoc-temp/` to it."

### P10. Small fixes (🟢 Nit) — PROPOSE FIX
- Line 32: also name `@rapidoc/server` ("and the server, `@rapidoc/server`, for `npm start`").
- Step 5: add its result ("the server restarts; the header and the home page show the new title"); drop the Writing guides link there (it's in Next steps).
- Line 74: `npm run preview` prints the address to open.
- Line 96: `--yes` is a global option: "Its options (`--spec`, `--title`, `--force`) and the global `--yes` are in the CLI reference."
- Line 115: `.gitignore` comment ends with ", …".
- Line 124: "run it through `npm run` or `npx rapidoc`".
- Line 127: "`npm run dev` or `npm run build` stops with an error in `rapidoc.config.yaml`".
- Line 128: `npx @rapidoc/cli doctor` (works before the CLI is installed).

### P11. Recorded, not fixed (🟢 Nit) — DECLINE
- Step 6 (build, preview, upload) as one step; the opening's sentence rhythm; "You should see"; **Try** vs `TRY`; `init`'s search depth and the tree when `init` uses your specs: minor or reference detail.

---

## RapiMock quickstart

### M10. Step 3 needs a second terminal (🟡 Major, 2) — PROPOSE FIX
- **Edit:** step 2 ends: "Leave it running, and use a second terminal for the next steps. Ctrl+C stops it."

### M11. The labels link to a page that doesn't explain them (🟡 Major, 2) — PROPOSE FIX
- **Discrepancy:** `/docs/state/overview/` never mentions stateful, needs review or static; `/docs/getting-started/how-it-works/` has the table. The printed "1 needs review" reads like a warning.
- **Edit:** "…labels each operation `stateful`, `needs review` (it works, but the mock guessed something the spec left open) or `static`: see [How it works](/docs/getting-started/how-it-works/). The sample's one `needs review` is expected." Next steps: Keeping state's description drops "and the labels".

### M12. "Names that clash" isn't on the CLI options page (🟡 Major, 1) — PROPOSE FIX
- **Edit:** drop "names that clash" from the sentence (the rule was on this page in round 1; it's reference detail).

### M13. Small fixes (🟢 Nit) — PROPOSE FIX
- Opening: "a mock API … that, with `--stateful`, remembers what you create"; needs: "Node.js 22.12 or later, an internet connection (the sample spec is fetched at start) and `curl`"; link the sample spec.
- Line 22: name the resources at first use ("each resource, here Author, Book and Loan"); "seed records" for "the seed" (the CLI's `--seed` means something else).
- Line 24: "if that port is taken, it asks to use the next free one; then use the address it prints".
- Line 37: `curl -i`, and show the response as printed (indented over several lines).
- Line 63: "the local specs in its config"; "`http://localhost:4010/` lists the APIs served".
- Line 67: link "set an issuer" to [Tokens and scopes](/docs/responses/tokens-and-scopes/).
- Step 4 heading "Open the Mock UI".

### M14. Recorded, not fixed (🟢 Nit) — DECLINE
- Step 3 as two steps (settled M9). `curl` quoting on Windows cmd: the page names `curl` (M13); a PowerShell variant is beyond a quickstart. Wording preferences ("Among what it prints", "the id it gave it").

---

## Checks outside the reviewers' reach
Two reviewers could not check live hosts. Both checked, both fine:
- `https://unpkg.com/rapidoc/dist/rapidoc-flow-min.js` resolves to `rapidoc@14.2.0` and returns 200.
- `petstore.yaml`, `petstore.arazzo.yaml` (rapidocui.com) and `example.yaml` (mock.rapidocui.com) all send
  `access-control-allow-origin: *`, so the quickstarts work opened from disk.
