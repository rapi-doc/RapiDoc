# Goldfish Annotated Review Report: round 3

**Status: resolved, loop ended.** All PROPOSE FIX items were applied (D7–D9, F13–F14, P12–P15,
M15–M19); the DECLINE items were not changed. D7's churn was resolved with the compromise above: step 3
names both cases, and the Troubleshooting row stays. M18 also dropped the line on request validation
from "Without state" (it's on What it answers). After round 3 the user chose to apply the fixes and end
the loop: **accepted at churn after 3 rounds**, not converged (no round was clean).

**Targets:** the same four quickstarts, after round 2's fixes, against `docs-review/quickstart-standard.md`.
All 16 reviewers completed.

| Page | Blockers | Majors (open) | Trend of open Majors, rounds 1 → 2 → 3 |
| :--- | :--- | :--- | :--- |
| RapiDoc | 0 | 2 | 5 → 5 → 2 |
| RapiFlow | 0 | 1 | 5 → 4 → 1 |
| RapiDoc Portal | 0 | 4 | 4 → 2 → 4 |
| RapiMock | 0 | 6 | 6 → 4 → 6 |

**Not clean**, and one finding is **churn**: D7 below sits where round 2 applied D2, and undoing D2
would resolve it. Every reviewer again confirmed the commands, printed output, responses, labels and
links against the source; what is left is mostly placement, density and wording.

**Settled, not reopened:** RapiMock's step 3 being two calls (M9, flagged again by 3 reviewers); the
Dockerfile in the RapiDoc quickstart (R6).

---

## RapiDoc quickstart

### D7. Step 3 doesn't say how to use a spec file from your computer (🟡 Major, 4 reviewers) — PROPOSE FIX · CHURN
- **Scope:** lines 8, 33 and 48.
- **Discrepancy:** the opening sends readers with a local file to step 3, but the instructions (serve the folder, open the printed address, `spec-url="openapi.yaml"`) are only in the Troubleshooting table, where round 2's D2 moved them to keep step 3 one action.
- **Edit (compromise):** step 3 names the two cases in one sentence each: "For a spec on a server, use its URL. For a file, put it next to `index.html`, run `npx serve` in that folder, open the address it prints and set `spec-url="openapi.yaml"`." The Troubleshooting row stays as the fallback.

### D8. "Without a CDN" edits `index.html` after copying it (🟡 Major, 1; 🟢 2) — PROPOSE FIX
- **Edit:** the edit goes before the copy: "In `index.html`, set the script's `src` to `rapidoc-min.js` and `spec-url` to `openapi.yaml`, then copy:".

### D9. Nits — PROPOSE FIX
- Opening: "Build one HTML file that shows RapiDoc's interactive reference…"; the prerequisite as a full sentence ("…a local web server, such as `npx serve`, which needs Node.js").
- Line 31: name the host (`petstore3.swagger.io`).
- Line 38: "keep its default `display: flex`".
- Line 48: "browsers block a page opened from disk (`file://`) from reading other files".

---

## RapiFlow quickstart

### F13. "attempt 2" is inside the closed row (🟡 Major, 2) — PROPOSE FIX
- **Scope:** line 49 (round 2's F8 text was wrong here).
- **Discrepancy:** successful rows stay closed (`<details ?open=${e.outcome === "failure"}>`), and `attempt 2` is in the row's detail.
- **Edit:** "…the second attempt gets a 200: its row shows ✓, and opening it shows `attempt 2`."

### F14. Nits — PROPOSE FIX
- Line 8: "you run it" for "you run it step by step" (one press runs the whole workflow).
- Line 45: "the picker at the top of `<rapi-flow>`".
- Line 47: "Open a row to see the response (and, for `placeOrder`, the request body)"; quote `HTTP 200`.
- Line 51: "opens to show the failed check".

---

## RapiDoc Portal quickstart

### P12. In an existing repository, `init` uses your `docs/` folder and every spec it finds (🟡 Major, 1) — PROPOSE FIX
- **Discrepancy:** the starter pages go into the repo's `docs/`, and every `.md`/`.mdx`/`.markdoc` there becomes a portal page (MDX with React imports stops the build). `init` preselects every OpenAPI file it finds (3 levels deep, fixtures included).
- **Edit:** one paragraph after the `init` command: "Every Markdown, MDX and Markdoc file in `docs/` becomes a portal page, so a repository with its own docs there may want the portal in a subfolder. `init` lists every OpenAPI file it finds; untick the ones you don't want, or pass `--spec <file>`."

### P13. The no-scripts path misses `preview` and the `dev` flags (🟡 Major, 1) — PROPOSE FIX
- **Edit:** "…use `npx rapidoc dev`, `npx rapidoc build`, `npx rapidoc validate` and `npx serve dist` in place of the `npm run` commands on this page."

### P14. Step 4's repair is unclear and dense; the option list is partial (🟡 Major, 3 findings from 1 reviewer) — PROPOSE FIX
- Line 60: name the tag: "it embeds the example's `GET /items` with an `{% api-operation %}` tag under **Try It**: change its `path` and `method`… or delete that section." Link renaming to `/docs/configuration/apis/#changing-an-id`, and say the tab keeps its label "Core API" until you change `label` under `navigation:`.
- Line 98: "All options of `init` are in the [CLI reference](/docs/reference/cli/)." (the list left out `--starter-spec` and `--no-install`).
- Line 43: "Try sends requests to the example's placeholder servers, so they fail." as its own sentence.

### P15. Nits — PROPOSE FIX
- Line 32: `npm start` runs `rapidoc serve` (a build with sign-in): link [rapidoc serve](/docs/deploy/rapidoc-serve/).
- Line 98: define `.rapidoc-temp/` ("the dev server's and build's temporary folder").
- Line 86: the questions in their real order (title, specs, install), asked in a terminal.
- Line 128: "In a terminal it asks to use the next free port; otherwise it picks one and prints the address."

### P16. Recorded, not fixed (🟢) — DECLINE
- Step 6's three parts; the tree's notation; the `init` result line; `render.yaml` with an existing `package.json`; "Stop the dev server" (harmless); the full list of build outputs.

---

## RapiMock quickstart

### M15. The opening describes the product, not the end state, and overstates "your own file" (🟡 Major, 2) — PROPOSE FIX
- **Edit:** "At the end, a mock of a sample library API runs on your computer, holding an author you created. You need Node.js 22.12 or later, an internet connection and `curl` (the commands are for macOS and Linux shells). The steps are written for the [sample spec](…); with your own OpenAPI 3.0–3.2 file, use its file name and one of its paths."

### M16. Step 2 is too dense and carries a variant (🟡 Major, 2) — PROPOSE FIX
- **Edit:** step 2 keeps the command, the printed lines, "leave it running", and two short sentences: what `--stateful` keeps; the labels with the How it works link, naming the one `needs review` (`listBooks`: its `sortedBy` parameter matches no field). The own-spec sentence moves to "More than one spec".

### M17. "`security` is checked: any bearer token passes" reads as a contradiction (🟡 Major, 1) — PROPOSE FIX
- **Edit:** "Operations with `security` need a bearer token; without an issuer, any token is accepted unverified."

### M18. The variant sections are reference material (🟡 Major, 2) — PROPOSE FIX
- **Edit:** "More than one spec": the two commands, the own-spec line from step 2, and the [CLI options](/docs/reference/cli/) link. "Without state": two sentences and the [What it answers](/docs/responses/what-it-answers/) link, with M17's wording.

### M19. Nits — PROPOSE FIX
- Line 34: `Ctrl+C` in code font. Line 26: "The output includes:". Line 86: link text "In JavaScript, without a port".

### M20. Recorded, not fixed (🟢) — DECLINE
- Step 3 as two steps (settled M9). A `mock.config.yaml` in the folder changing the counts. Defining "action".
