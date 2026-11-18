/**
 * The Mock UI: `<rapidoc-mock-ui>`, the page the mock server serves at `/__mock/ui`.
 *
 * An app shell (a header, a sidebar of sections, a content area) around what the stateful mode made of each spec
 * and what it holds now. Everything comes from the control API next to the page (`/__mock/model`, `/__mock/state`,
 * `/__mock/settings`, `/__mock/reset`), so the page knows nothing about a spec.
 *
 * - This file: the shell, the address (`#/<api id>/<section>[/<item>]`), and the calls to the control API.
 * - `views/`: one file per section, each a function from this element to its content.
 * - A new section is an entry in `SECTIONS` and a file in `views/`.
 *
 * Built by `vite build` into `dist/ui/mock-ui.js` with Lit bundled in.
 */
import { LitElement, html, nothing } from "lit";
import { icon } from "./icons.js";
import { LABELS } from "./labels.js";
import { styles } from "./styles.js";
import { dashboard } from "./views/dashboard.js";
import { operations } from "./views/operations.js";
import { resources } from "./views/resources.js";
import { settings } from "./views/settings.js";

/** The sidebar: groups of sections, each with the function that draws it. */
const SECTIONS = [
  { group: "Overview", items: [{ id: "dashboard", title: "Dashboard", view: dashboard }] },
  {
    group: "API",
    items: [
      { id: "resources", title: "Resources", view: resources },
      { id: "operations", title: "Operations", view: operations },
    ],
  },
  { group: "Server", items: [{ id: "settings", title: "Settings", view: settings }] },
];
const VIEWS = Object.fromEntries(
  SECTIONS.flatMap((group) => group.items.map((one) => [one.id, one])),
);
const SESSION_KEY = "rapidoc-mock-session";

export class RapidocMockUi extends LitElement {
  static styles = styles;

  static properties = {
    /** Where the control API is; default: beside this page (`/__mock`). */
    base: { type: String },
    apis: { state: true },
    server: { state: true },
    route: { state: true },
    records: { state: true },
    filter: { state: true },
    sort: { state: true },
    page: { state: true },
    selected: { state: true },
    detail: { state: true },
    sample: { state: true },
    labels: { state: true },
    groupBy: { state: true },
    session: { state: true },
    error: { state: true },
    notice: { state: true },
    busy: { state: true },
    menuOpen: { state: true },
  };

  constructor() {
    super();
    this.base = "";
    this.apis = null;
    this.server = null;
    this.route = { api: "", view: "dashboard", item: "" };
    this.records = [];
    this.filter = "";
    this.sort = { column: "", down: false };
    this.page = 0;
    this.selected = null;
    /** The resource or operation a detail page shows, as the control API describes it. */
    this.detail = null;
    /** A generated record of the resource in view: `{ seed, record }`. */
    this.sample = null;
    this.labels = new Set(Object.keys(LABELS));
    this.groupBy = "path";
    this.session = "";
    this.error = "";
    this.notice = "";
    this.busy = false;
    this.menuOpen = false;
    this.onHashChange = () => this.run(() => this.readAddress());
  }

  connectedCallback() {
    super.connectedCallback();
    // The page is at <prefix>/__mock/ui: the control API is one segment up, whatever the prefix
    if (!this.base) this.base = location.pathname.replace(/\/ui\/?$/, "");
    try {
      this.session = sessionStorage.getItem(SESSION_KEY) || "";
    } catch {
      // storage can be blocked; the session field then starts empty
    }
    window.addEventListener("hashchange", this.onHashChange);
    this.load();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("hashchange", this.onHashChange);
  }

  /** A call to the control API, with the session the page looks at. */
  async call(path, { method = "GET", body } = {}) {
    const headers = {};
    if (this.session) headers["X-Mock-Session"] = this.session;
    if (body !== undefined) headers["Content-Type"] = "application/json";
    const response = await fetch(`${this.base}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!response.ok) {
      const problem = await response.json().catch(() => ({}));
      throw new Error(problem.detail || `${response.status} ${response.statusText}`);
    }
    return response.status === 204 ? null : response.json();
  }

  /** Runs an action with the busy state on; a failure becomes the error banner. */
  async run(action) {
    this.busy = true;
    try {
      await action();
      this.error = "";
    } catch (err) {
      this.error = err.message;
    }
    this.busy = false;
  }

  /** Reads the settings and the model, then shows what the address names. */
  load() {
    return this.run(async () => {
      try {
        this.server = await this.call("/settings");
        const { apis } = await this.call("/model");
        this.apis = apis;
      } catch (err) {
        this.apis = this.apis || [];
        await this.readAddress().catch(() => {});
        throw err;
      }
      await this.readAddress();
    });
  }

  /** The address as `{ api, view, item }`, with what is missing or unknown replaced by a default. */
  async readAddress() {
    const [api, view, ...item] = location.hash
      .replace(/^#\/?/, "")
      .split("/")
      .filter(Boolean)
      .map(decodeURIComponent);
    const known = this.apis?.find((one) => one.id === api) || this.apis?.[0];
    const next = {
      api: known?.id || "",
      view: VIEWS[view] ? view : "dashboard",
      item: item.join("/"),
    };
    if (next.view !== this.route.view || next.api !== this.route.api) {
      this.filter = "";
      this.page = 0;
      this.sort = { column: "", down: false };
    }
    this.menuOpen = false;
    // a confirmation belongs to the page it was given on
    if (next.view !== this.route.view) this.notice = "";
    if (next.view === "resources") {
      // `<Resource>` shows its records, `<Resource>/about` what the mock knows about it
      next.tab = next.item.endsWith("/about") ? "about" : "records";
      const asked = next.item.replace(/\/about$/, "");
      const list = known?.resources || [];
      const resource = list.find((one) => one.name === asked) || list[0];
      next.item = resource?.name || "";
      if (next.item !== this.route.item) {
        this.filter = "";
        this.page = 0;
        this.sort = { column: "", down: false };
        this.sample = null;
      }
    }
    this.route = next;
    this.detail = null;
    const at = (kind) =>
      `/model/${encodeURIComponent(next.api)}/${kind}/${encodeURIComponent(next.item)}`;
    if (next.view === "resources" && next.tab === "about" && next.item) {
      this.detail = await this.call(at("resources"));
    } else if (next.view === "resources") {
      await this.loadRecords();
    } else if (next.view === "operations" && next.item) {
      this.detail = await this.call(at("operations"));
    }
  }

  /** A freshly generated record of the resource in view; nothing is stored. */
  generateSample() {
    return this.run(async () => {
      const { api, item } = this.route;
      this.sample = await this.call(
        `/model/${encodeURIComponent(api)}/resources/${encodeURIComponent(item)}/sample`,
      );
    });
  }

  /** The address of a section (and an item in it) of the API in view, or of another API. */
  href(view, item = "", api = this.route.api) {
    return `#/${[api, view, item].filter(Boolean).map(encodeURIComponent).join("/")}`;
  }

  async loadRecords() {
    this.selected = null;
    const { api, item } = this.route;
    this.records =
      api && item
        ? await this.call(`/state/${encodeURIComponent(api)}/${encodeURIComponent(item)}`)
        : [];
  }

  get api() {
    return this.apis?.find((one) => one.id === this.route.api);
  }

  reset() {
    return this.run(async () => {
      await this.call(`/reset?api=${encodeURIComponent(this.route.api)}`, { method: "POST" });
      await this.load();
      this.notice = `${this.route.api} is back to its seed data${this.session ? ` for session ${this.session}` : ""}.`;
    });
  }

  /** New seed data for every API: `rows` records per resource, generated from `seed`. */
  reseed(rows, seed) {
    return this.run(async () => {
      await this.call("/reset", { method: "POST", body: { rows, seed } });
      await this.load();
      this.notice = `New seed data: ${rows} records per resource, seed ${seed}.`;
    });
  }

  setDelay(delay) {
    return this.run(async () => {
      this.server = await this.call("/settings", { method: "PATCH", body: { delay } });
      this.notice = delay
        ? `Every API response now waits ${delay} ms.`
        : "API responses are sent without delay.";
    });
  }

  setSession(value) {
    this.session = value.trim();
    try {
      sessionStorage.setItem(SESSION_KEY, this.session);
    } catch {
      // not kept across reloads then
    }
    this.notice = "";
    this.load();
  }

  render() {
    if (this.apis === null) return html`<p class="empty">Loading…</p>`;
    const api = this.api;
    const section = VIEWS[this.route.view];
    return html`
      <header>
        <button
          class="menu icon-button"
          aria-label="Sections"
          aria-expanded=${this.menuOpen ? "true" : "false"}
          @click=${() => (this.menuOpen = !this.menuOpen)}
        >
          ${icon("menu")}
        </button>
        <a class="brand" href=${this.href("dashboard")}>RapiDoc <b>Mock</b></a>
        ${
          this.apis.length
            ? html`
              <select
                class="api"
                aria-label="API"
                @change=${(e) => (location.hash = this.href(this.route.view, "", e.target.value))}
              >
                ${this.apis.map(
                  (one) =>
                    html`<option value=${one.id} ?selected=${one.id === api?.id}>
                      ${one.title || one.id} (/${one.id})
                    </option>`,
                )}
              </select>
            `
            : nothing
        }
        <span class="grow"></span>
        <label class="session">
          <span>Session</span>
          <input
            type="text"
            placeholder="default data"
            title="The X-Mock-Session value whose data is shown"
            .value=${this.session}
            @change=${(e) => this.setSession(e.target.value)}
          />
        </label>
        <button @click=${() => this.load()} ?disabled=${this.busy}>Refresh</button>
        <button class="primary" @click=${() => this.reset()} ?disabled=${this.busy || !api}>
          Reset data
        </button>
      </header>
      <div class="shell">
        <nav class=${this.menuOpen ? "sidebar open" : "sidebar"} aria-label="Sections">
          ${SECTIONS.map(
            (group) => html`
              <h2>${group.group}</h2>
              ${group.items.map(
                (one) => html`
                  <a
                    href=${this.href(one.id)}
                    class=${one.id === this.route.view ? "current" : ""}
                    aria-current=${one.id === this.route.view ? "page" : "false"}
                  >
                    ${icon(one.id)} ${one.title}
                  </a>
                `,
              )}
            `,
          )}
        </nav>
        <main>
          ${this.error ? html`<p class="banner error" role="alert">${this.error}</p>` : nothing}
          ${this.notice ? html`<p class="banner" role="status">${this.notice}</p>` : nothing}
          ${
            api || (this.route.view === "settings" && this.server)
              ? section.view(this)
              : this.error
                ? nothing
                : html`<p class="empty">
                  No API keeps state. Start the mock with <code>--stateful</code>.
                </p>`
          }
        </main>
      </div>
    `;
  }
}

customElements.define("rapidoc-mock-ui", RapidocMockUi);
