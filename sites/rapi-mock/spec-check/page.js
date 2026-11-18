/**
 * The spec check page (`/spec-check/` of the Rapi Mock site): takes a spec as text, runs `checkSpec` on it, and
 * shows the result in the Mock UI (`<rapidoc-mock-ui>`, the same file the mock server serves, here with the
 * in-page mock as its `source`) with the lint findings beside it. The spec is kept in this browser's storage, so
 * a reload finds it again; nothing leaves the page.
 */
import { checkSpec } from "./check.js";

const STORE_KEY = "rapi-mock-spec-check";
const $ = (id) => document.getElementById(id);

/** A node with text and attributes; text is never read as HTML. */
function node(tag, text, attributes = {}) {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  return element;
}

/** The API's id, as `rapidoc mock` names it after the spec's file (orders-api.yaml -> orders-api). */
const idFrom = (name) =>
  name
    .replace(/\.(ya?ml|json)$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "api";

function remember(spec) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(spec));
    return true;
  } catch {
    return false; // storage is blocked or the spec is too large for it: a reload starts over
  }
}

function remembered() {
  try {
    const spec = JSON.parse(localStorage.getItem(STORE_KEY));
    return typeof spec?.text === "string" ? spec : null;
  } catch {
    return null;
  }
}

function forget() {
  try {
    localStorage.removeItem(STORE_KEY);
  } catch {
    // nothing was kept
  }
}

function showStart(problem = "") {
  $("result").hidden = true;
  $("start").hidden = false;
  $("ui").replaceChildren();
  $("problem").textContent = problem;
  $("problem").hidden = !problem;
  $("check").disabled = false;
  $("check").textContent = "Check this spec";
}

function showFindings(open) {
  $("findings").hidden = !open;
  $("lint").setAttribute("aria-expanded", String(open));
}

/** Runs the check on a spec and shows what came of it. */
async function run({ text, name }) {
  if (!text.trim()) return showStart("Paste a spec, drop a file, or try the example.");
  $("check").disabled = true;
  $("check").textContent = "Checking…";
  // let the button show before the work starts: a large spec takes a few seconds
  await new Promise((resolve) => setTimeout(resolve, 20));
  let checked;
  try {
    checked = await checkSpec(text, { id: idFrom(name || "") });
  } catch (err) {
    return showStart(`The check failed: ${err.message.split("\n")[0]}`);
  }
  const kept = remember({ text, name });

  const errors = checked.problems.filter((one) => one.severity === "error").length;
  const warnings = checked.problems.length - errors;
  $("name").textContent = checked.title || name || "your spec";
  $("version").textContent = [
    checked.version && `OpenAPI ${checked.version}`.replace("OpenAPI Swagger", "Swagger"),
    kept ? "" : "too large to keep: a reload starts over",
  ]
    .filter(Boolean)
    .join(" · ");
  const what = checked.linted ? "Lint" : "Not valid OpenAPI";
  $("lint").textContent = checked.problems.length
    ? `${what}: ${errors} error(s), ${warnings} warning(s)`
    : "Lint: no findings";
  $("lint").className = errors ? "count error" : checked.problems.length ? "count" : "count ok";
  $("lint").disabled = !checked.problems.length;
  $("findings-title").textContent = checked.linted
    ? `Lint findings (${checked.problems.length})`
    : `Not valid OpenAPI (${checked.problems.length})`;
  $("list").replaceChildren(
    ...checked.problems.map((one) => {
      const item = node("li");
      const meta = node("div", undefined, { class: "meta" });
      meta.append(
        node("span", one.severity, { class: `severity ${one.severity}` }),
        node("code", one.rule),
        node("span", `line ${one.line}`),
      );
      item.append(meta, node("div", one.message));
      if (one.pointer.length) item.append(node("code", one.pointer.join(" › "), { class: "where muted" }));
      return item;
    }),
  );

  if (checked.mock) {
    // the same Mock UI the server serves, reading the mock that runs in this page
    const ui = node("rapidoc-mock-ui");
    ui.source = checked.mock.source;
    $("ui").replaceChildren(ui);
    // errors are shown at once; warnings wait behind the button in the strip
    showFindings(errors > 0);
  } else {
    const note = node("div", undefined, { class: "intro" });
    note.append(
      node("h1", "The mock can't start on this spec"),
      node("p", checked.mockError, { class: "problem" }),
      node(
        "p",
        checked.problems.length
          ? "What the check found is listed here. Fix the errors and check the spec again."
          : "Rapi Mock reads OpenAPI 3.0, 3.1 and 3.2.",
        { class: "muted" },
      ),
    );
    $("ui").replaceChildren(note);
    showFindings(checked.problems.length > 0);
  }
  $("start").hidden = true;
  $("result").hidden = false;
}

async function readFile(file) {
  if (!file) return;
  $("text").value = await file.text();
  await run({ text: $("text").value, name: file.name });
}

$("check").addEventListener("click", () => {
  history.replaceState(null, "", location.pathname);
  run({ text: $("text").value, name: "" });
});
$("choose").addEventListener("click", () => $("file").click());
$("file").addEventListener("change", (event) => {
  history.replaceState(null, "", location.pathname);
  readFile(event.target.files[0]);
});
$("example").addEventListener("click", async () => {
  const response = await fetch("example.yaml");
  if (!response.ok) return showStart("The example could not be loaded.");
  $("text").value = await response.text();
  history.replaceState(null, "", location.pathname);
  run({ text: $("text").value, name: "city-library.yaml" });
});
$("another").addEventListener("click", () => {
  forget();
  history.replaceState(null, "", location.pathname);
  showStart();
  $("text").focus();
});
$("lint").addEventListener("click", () => showFindings($("findings").hidden));
$("close-findings").addEventListener("click", () => showFindings(false));

const box = $("text");
for (const type of ["dragenter", "dragover"])
  box.addEventListener(type, (event) => {
    event.preventDefault();
    box.classList.add("over");
  });
for (const type of ["dragleave", "drop"])
  box.addEventListener(type, () => box.classList.remove("over"));
box.addEventListener("drop", (event) => {
  event.preventDefault();
  history.replaceState(null, "", location.pathname);
  readFile(event.dataTransfer.files[0]);
});

// A reload: the spec this browser kept is checked again, and the address still says which page was open
const kept = remembered();
if (kept) {
  $("text").value = kept.text;
  run(kept);
}
