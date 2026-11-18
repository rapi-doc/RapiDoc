/**
 * The Mock UI: `<rapidoc-mock-ui>`, the page the mock server serves at `/__mock/ui`.
 *
 * An app shell (a header, a sidebar of sections, a content area) around what the stateful mode made of each spec
 * and what it holds now. Everything comes from the control API next to the page (`/__mock/model`, `/__mock/state`,
 * `/__mock/settings`, `/__mock/reset`), so the page knows nothing about a spec.
 *
 * - This file: the shell, the address (`#/<api id>/<section>[/<item>]`), and the calls to the control API. It
 *   keeps what every section shares: the APIs, the server's settings, the session, the banners.
 * - `views/`: one element per section, and the detail pages. Each keeps its own state (what it loaded, its
 *   filter) and gets this element as `app`, for the calls and the addresses.
 * - `components/`: what sections share: `screen.js` (the base of these elements), `table.js` (the records table).
 * - A new section is an entry in `SECTIONS` and an element in `views/`.
 *
 * Built by `vite build` into `dist/ui/mock-ui.js` with Lit bundled in.
 */
import { LitElement, html, nothing } from "lit";
import { icon } from "./icons.js";
import { styles } from "./styles.js";
import "./views/dashboard.js";
import "./views/operations.js";
import "./views/resources.js";
import "./views/settings.js";

/** The sidebar: groups of sections, each with the function that places its element. */
const SECTIONS = [
  {
    group: "Overview",
    items: [
      {
        id: "dashboard",
        title: "Dashboard",
        view: (app) =>
          html`<rapidoc-mock-dashboard .app=${app} .api=${app.api}></rapidoc-mock-dashboard>`,
      },
    ],
  },
  {
    group: "API",
    items: [
      {
        id: "resources",
        title: "Resources",
        view: (app) =>
          html`<rapidoc-mock-resources
            .app=${app}
            .api=${app.api}
            .name=${app.route.item}
            .tab=${app.route.tab}
            .busy=${app.busy}
            .version=${app.version}
          ></rapidoc-mock-resources>`,
      },
      {
        id: "operations",
        title: "Operations",
        view: (app) =>
          html`<rapidoc-mock-operations
            .app=${app}
            .api=${app.api}
            .operation=${app.route.item}
            .only=${app.route.query.get("label") || ""}
            .version=${app.version}
          ></rapidoc-mock-operations>`,
      },
    ],
  },
  {
    group: "Server",
    items: [
      {
        id: "settings",
        title: "Settings",
        view: (app) =>
          html`<rapidoc-mock-settings
            .app=${app}
            .server=${app.server}
            .busy=${app.busy}
          ></rapidoc-mock-settings>`,
      },
    ],
  },
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
    version: { state: true },
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
    this.route = { api: "", view: "dashboard", item: "", query: new URLSearchParams() };
    /** Counts the times the model was read: a section reads what it shows again when this changes. */
    this.version = 0;
    this.session = "";
    this.error = "";
    this.notice = "";
    this.busy = false;
    this.menuOpen = false;
    this.onHashChange = () => this.readAddress();
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

  /** Runs an action with the busy state on; a failure becomes the error banner. Sections use it for their calls. */
  async run(action) {
    this.running = (this.running || 0) + 1;
    this.busy = true;
    try {
      await action();
      this.error = "";
    } catch (err) {
      this.error = err.message;
    }
    this.running -= 1;
    this.busy = this.running > 0;
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
        this.readAddress();
        throw err;
      }
      this.readAddress();
      this.version += 1;
    });
  }

  /** The address as `{ api, view, item, query }`, with what is missing or unknown replaced by a default. */
  readAddress() {
    const [path, query = ""] = location.hash.replace(/^#\/?/, "").split("?");
    const [api, view, ...item] = path.split("/").filter(Boolean).map(decodeURIComponent);
    const known = this.apis?.find((one) => one.id === api) || this.apis?.[0];
    const next = {
      api: known?.id || "",
      view: VIEWS[view] ? view : "dashboard",
      item: item.join("/"),
      query: new URLSearchParams(query),
    };
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
    }
    this.route = next;
  }

  /** The address of a section (and an item in it) of the API in view, or of another API. */
  href(view, item = "", api = this.route.api, query) {
    const path = [api, view, item].filter(Boolean).map(encodeURIComponent).join("/");
    return `#/${path}${query ? `?${new URLSearchParams(query)}` : ""}`;
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
        <a class="brand" href=${this.href("dashboard")}>Rapi<b>Mock</b></a>
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
