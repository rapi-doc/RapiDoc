/**
 * The spec check page (`/spec-check/` of the Rapi Mock site): takes a spec as text, runs `checkSpec` on it, and
 * shows the result in the Mock UI (`<rapidoc-mock-ui>`, the same file the mock server serves, here with the
 * in-page mock as its `source`, which also answers with the lint result: the UI's Lint section and the Lint card
 * of its Dashboard). The spec is kept in this browser's storage, so
 * a reload finds it again; nothing leaves the page.
 *
 * A spec can also come from an address (the field over the box, a link dropped on the box, or `?url=` in the
 * page's address, which makes a check a link to share). The browser fetches it from that address and from
 * nowhere else: never through a server of ours, so it works only where that server lets other sites read it
 * (CORS). The page's address then keeps `?url=`, so a reload fetches the spec again, as it is now.
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

/** The control API of a mock that could not start: no API, and the lint result with why. */
const noMock =
  (checked) =>
  async ({ path }) => ({
    status: 200,
    data: path.startsWith("/model")
      ? { apis: [] }
      : path.startsWith("/settings")
        ? { lint: true }
        : path.startsWith("/lint")
          ? {
              linted: checked.linted,
              problems: checked.problems,
              summary: checked.summary,
              mockError: checked.mockError,
            }
          : null,
  });

/** Runs the check on a spec and shows what came of it. */
async function run({ text, name, url }) {
  if (!text.trim()) return showStart("Paste a spec, drop a file, or try the example.");
  $("check").disabled = true;
  $("check").textContent = "Checking…";
  // let the button show before the work starts: a large spec takes a few seconds
  await new Promise((resolve) => setTimeout(resolve, 20));
  const id = idFrom(name || "");
  let checked;
  try {
    checked = await checkSpec(text, { id });
  } catch (err) {
    return showStart(`The check failed: ${err.message.split("\n")[0]}`);
  }
  const kept = remember({ text, name, ...(url ? { url } : {}) });

  $("name").textContent = checked.title || name || "your spec";
  $("version").textContent = [
    checked.version && `OpenAPI ${checked.version}`.replace("OpenAPI Swagger", "Swagger"),
    kept ? "" : "too large to keep: a reload starts over",
  ]
    .filter(Boolean)
    .join(" · ");

  // the same Mock UI the server serves, reading the mock that runs in this page; without a mock (a spec it
  // can't start on) it has no API and shows the lint result alone
  const ui = node("rapidoc-mock-ui");
  ui.source = checked.mock?.source ?? noMock(checked);
  // errors are shown at once: the Lint section opens, unless the address already names a page (a reload)
  if (checked.mock && !location.hash && checked.problems.some((one) => one.severity === "error"))
    history.replaceState(null, "", `#/${encodeURIComponent(id)}/lint`);
  $("ui").replaceChildren(ui);
  $("start").hidden = true;
  $("result").hidden = false;
}

/** The file name at the end of an address, for the API's id: `.../petstore.yaml?raw=1` -> `petstore.yaml`. */
const nameFrom = (url) => {
  const last = url.pathname.split("/").filter(Boolean).pop() || url.hostname;
  try {
    return decodeURIComponent(last);
  } catch {
    return last;
  }
};

/** An address as typed, or null when it is not an http(s) one. */
function addressOf(text) {
  try {
    const url = new URL(String(text).trim());
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

/**
 * Fetches a spec from an address and checks it. Its own request, without cookies: the server sees the address
 * and nothing of this page. A failure says why, in words that point at what to do.
 */
async function loadUrl(text) {
  const url = addressOf(text);
  $("url").value = String(text).trim();
  if (!url) return showStart("That is not an http or https address.");
  if (url.protocol === "http:" && location.protocol === "https:")
    return showStart(
      "This page is served over https, so the browser does not fetch from an http address. Use its https address, or download the file and drop it here.",
    );
  $("load").disabled = true;
  $("load").textContent = "Loading…";
  let response;
  try {
    response = await fetch(url, { credentials: "omit", cache: "no-store" });
  } catch {
    return showStart(
      `${url.host} could not be read from this page. Its server may not let other sites read it (CORS), or it may be out of reach. Download the file and drop it here instead.`,
    );
  } finally {
    $("load").disabled = false;
    $("load").textContent = "Load";
  }
  if (!response.ok)
    return showStart(`${url.host} answered ${response.status} ${response.statusText}`.trim() + ".");
  const body = await response.text();
  $("text").value = body;
  // the address keeps the spec's address, so the check can be shared and a reload fetches it again
  history.replaceState(null, "", `${location.pathname}?url=${encodeURIComponent(url.href)}${location.hash}`);
  await run({ text: body, name: nameFrom(url), url: url.href });
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
$("from-url").addEventListener("submit", (event) => {
  event.preventDefault();
  history.replaceState(null, "", location.pathname);
  loadUrl($("url").value);
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
  const file = event.dataTransfer.files[0];
  if (file) return readFile(file);
  // a link dragged from another page: its address
  const link = event.dataTransfer.getData("text/uri-list").split("\n").find((line) => line && !line.startsWith("#"));
  const address = link || event.dataTransfer.getData("text/plain");
  if (addressOf(address)) loadUrl(address);
});

// The page opened with ?url=: that spec, fetched now. Otherwise a reload: the spec this browser kept is checked
// again. Either way the address still says which page was open.
const asked = new URLSearchParams(location.search).get("url");
const kept = remembered();
if (asked) loadUrl(asked);
else if (kept) {
  $("text").value = kept.text;
  if (kept.url) $("url").value = kept.url;
  run(kept);
}
