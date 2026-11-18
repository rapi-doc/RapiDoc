/**
 * The Mock UI: `<rapidoc-mock-ui>`, the page the mock server serves at `/__mock/ui`.
 *
 * It shows what the stateful mode made of each spec and what it holds now: the resources with their records, and
 * every operation with its label (confident, needs review, plain mock). Everything comes from the control API
 * next to the page (`/__mock/model`, `/__mock/state`, `/__mock/reset`), so the page knows nothing about a spec.
 *
 * Built by `vite build` into `dist/ui/mock-ui.js` with Lit bundled in.
 */
import { LitElement, html, nothing } from "lit";
import { styles } from "./styles.js";

const PAGE_SIZE = 25;
const LABELS = {
  confident: "Confident",
  needsReview: "Needs review",
  plainMock: "Plain mock",
};
const SESSION_KEY = "rapidoc-mock-session";

/** A cell's text: plain for a simple value, compact JSON for an object or a list. */
const cellText = (value) => {
  if (value === null) return "null";
  if (value === undefined) return "";
  return typeof value === "object" ? JSON.stringify(value) : String(value);
};

const compare = (a, b) => {
  if (a === b) return 0;
  if (a === undefined || a === null) return 1;
  if (b === undefined || b === null) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return cellText(a).localeCompare(cellText(b), undefined, { numeric: true });
};

export class RapidocMockUi extends LitElement {
  static styles = styles;

  static properties = {
    /** Where the control API is; default: beside this page (`/__mock`). */
    base: { type: String },
    apis: { state: true },
    apiId: { state: true },
    tab: { state: true },
    resource: { state: true },
    records: { state: true },
    filter: { state: true },
    sort: { state: true },
    page: { state: true },
    selected: { state: true },
    labels: { state: true },
    session: { state: true },
    error: { state: true },
    notice: { state: true },
    busy: { state: true },
  };

  constructor() {
    super();
    this.base = "";
    this.apis = null;
    this.apiId = "";
    this.tab = "resources";
    this.resource = "";
    this.records = [];
    this.filter = "";
    this.sort = { column: "", down: false };
    this.page = 0;
    this.selected = null;
    this.labels = new Set(Object.keys(LABELS));
    this.session = "";
    this.error = "";
    this.notice = "";
    this.busy = false;
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
    this.load();
  }

  /** A call to the control API, with the session the page looks at. */
  async call(path, options = {}) {
    const response = await fetch(`${this.base}${path}`, {
      ...options,
      headers: this.session ? { "X-Mock-Session": this.session } : {},
    });
    if (!response.ok) {
      const problem = await response.json().catch(() => ({}));
      throw new Error(problem.detail || `${response.status} ${response.statusText}`);
    }
    return response.status === 204 ? null : response.json();
  }

  /** Reads the model, keeps the API and resource in view when they still exist, and reads the records. */
  async load() {
    this.busy = true;
    try {
      const { apis } = await this.call("/model");
      this.apis = apis;
      this.error = "";
      const api = apis.find((one) => one.id === this.apiId) || apis[0];
      this.apiId = api?.id || "";
      const resource =
        api?.resources.find((one) => one.name === this.resource) || api?.resources[0];
      this.resource = resource?.name || "";
      await this.loadRecords();
    } catch (err) {
      this.apis = this.apis || [];
      this.error = err.message;
    }
    this.busy = false;
  }

  async loadRecords() {
    this.selected = null;
    if (!this.apiId || !this.resource) {
      this.records = [];
      return;
    }
    this.records = await this.call(
      `/state/${encodeURIComponent(this.apiId)}/${encodeURIComponent(this.resource)}`,
    );
  }

  get api() {
    return this.apis?.find((one) => one.id === this.apiId);
  }

  async pickApi(id) {
    this.apiId = id;
    this.resource = this.api?.resources[0]?.name || "";
    this.filter = "";
    this.page = 0;
    this.sort = { column: "", down: false };
    await this.loadRecords().catch((err) => (this.error = err.message));
  }

  async pickResource(name) {
    this.resource = name;
    this.filter = "";
    this.page = 0;
    this.sort = { column: "", down: false };
    await this.loadRecords().catch((err) => (this.error = err.message));
  }

  async reset() {
    this.busy = true;
    try {
      await this.call(`/reset?api=${encodeURIComponent(this.apiId)}`, { method: "POST" });
      this.notice = `${this.apiId} is back to its seed data${this.session ? ` for session ${this.session}` : ""}.`;
      await this.load();
    } catch (err) {
      this.error = err.message;
    }
    this.busy = false;
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

  sortBy(column) {
    this.sort = { column, down: this.sort.column === column && !this.sort.down };
    this.page = 0;
  }

  toggleLabel(label) {
    const next = new Set(this.labels);
    if (next.has(label)) next.delete(label);
    else next.add(label);
    this.labels = next;
  }

  /** The columns of the records in view: the key first, then every field in the order records show it. */
  columns(key) {
    const seen = new Set();
    for (const record of this.records) for (const field of Object.keys(record)) seen.add(field);
    const all = [...seen];
    return key && seen.has(key) ? [key, ...all.filter((field) => field !== key)] : all;
  }

  render() {
    if (this.apis === null) return html`<main class="empty">Loading…</main>`;
    return html`
      <header>
        <h1>RapiDoc Mock</h1>
        <label class="session">
          Session
          <input
            type="text"
            placeholder="default data"
            .value=${this.session}
            @change=${(e) => this.setSession(e.target.value)}
            aria-describedby="session-help"
          />
        </label>
        <span id="session-help" class="hint">The X-Mock-Session value to look at</span>
        <span class="grow"></span>
        <button @click=${() => this.load()} ?disabled=${this.busy}>Refresh</button>
        <button class="primary" @click=${() => this.reset()} ?disabled=${this.busy || !this.api}>
          Reset data
        </button>
      </header>
      ${this.error ? html`<p class="banner error" role="alert">${this.error}</p>` : nothing}
      ${this.notice ? html`<p class="banner" role="status">${this.notice}</p>` : nothing}
      ${this.api ? this.renderApi() : this.renderNoState()}
    `;
  }

  renderNoState() {
    if (this.error) return nothing;
    return html`<main class="empty">No API keeps state.</main>`;
  }

  renderApi() {
    const api = this.api;
    return html`
      <nav class="apis" aria-label="APIs">
        ${this.apis.map(
          (one) => html`
            <button
              class=${one.id === api.id ? "api current" : "api"}
              aria-current=${one.id === api.id ? "true" : "false"}
              @click=${() => this.pickApi(one.id)}
            >
              <strong>${one.title || one.id}</strong>
              <span>/${one.id}</span>
            </button>
          `,
        )}
      </nav>
      <section class="summary" aria-label="Summary">
        <span><b>${api.resources.length}</b> resources</span>
        <span><b>${api.resources.reduce((sum, one) => sum + one.records, 0)}</b> records</span>
        ${Object.keys(LABELS).map(
          (label) =>
            html`<span class="badge ${label}">${api.labels[label]} ${LABELS[label].toLowerCase()}</span>`,
        )}
      </section>
      <div class="tabs" role="tablist">
        ${["resources", "operations"].map(
          (tab) => html`
            <button
              role="tab"
              aria-selected=${this.tab === tab ? "true" : "false"}
              class=${this.tab === tab ? "tab current" : "tab"}
              @click=${() => {
                this.tab = tab;
                this.filter = "";
              }}
            >
              ${tab === "resources" ? "Resources" : `Operations (${api.operations.length})`}
            </button>
          `,
        )}
      </div>
      ${this.tab === "resources" ? this.renderResources(api) : this.renderOperations(api)}
    `;
  }

  renderResources(api) {
    if (!api.resources.length) {
      return html`<main class="empty">
        The mock found no resource in this spec: every operation answers as a plain mock.
      </main>`;
    }
    const resource = api.resources.find((one) => one.name === this.resource);
    const columns = this.columns(resource?.key);
    const text = this.filter.trim().toLowerCase();
    let rows = text
      ? this.records.filter((record) => JSON.stringify(record).toLowerCase().includes(text))
      : [...this.records];
    const { column, down } = this.sort;
    if (column) rows.sort((a, b) => compare(a[column], b[column]) * (down ? -1 : 1));
    const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    const page = Math.min(this.page, pages - 1);
    const shown = rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
    return html`
      <div class="split">
        <nav class="resources" aria-label="Resources">
          ${api.resources.map(
            (one) => html`
              <button
                class=${one.name === this.resource ? "current" : ""}
                aria-current=${one.name === this.resource ? "true" : "false"}
                @click=${() => this.pickResource(one.name)}
              >
                <span class="name">${one.name}</span>
                <span class="count">${one.records}</span>
              </button>
            `,
          )}
        </nav>
        <main>
          <div class="about">
            <h2>${resource?.name}</h2>
            <code>${resource?.path || "no item path"}</code>
            <span>key: <code>${resource?.key || "none"}</code></span>
            ${
              resource?.review
                ? html`<span class="badge needsReview" title=${resource.review}>Needs review</span>
                  <span class="hint">${resource.review}</span>`
                : nothing
            }
          </div>
          <div class="tools">
            <input
              type="search"
              placeholder="Filter records"
              aria-label="Filter records"
              .value=${this.filter}
              @input=${(e) => {
                this.filter = e.target.value;
                this.page = 0;
              }}
            />
            <span class="hint">${rows.length} of ${this.records.length} records</span>
          </div>
          ${
            rows.length
              ? html`
                <div class="scroll">
                  <table>
                    <thead>
                      <tr>
                        ${columns.map(
                          (name) => html`
                            <th aria-sort=${column === name ? (down ? "descending" : "ascending") : "none"}>
                              <button @click=${() => this.sortBy(name)}>
                                ${name === "$parents" ? "under" : name}
                                ${column === name ? (down ? "▼" : "▲") : nothing}
                              </button>
                            </th>
                          `,
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      ${shown.map(
                        (record) => html`
                          <tr
                            tabindex="0"
                            class=${record === this.selected ? "current" : ""}
                            @click=${() => (this.selected = record)}
                            @keydown=${(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                this.selected = record;
                              }
                            }}
                          >
                            ${columns.map((name) => {
                              const value = record[name];
                              const kind =
                                value === null || value === undefined
                                  ? "none"
                                  : typeof value === "object"
                                    ? "json"
                                    : typeof value;
                              return html`<td class=${kind}>${cellText(value)}</td>`;
                            })}
                          </tr>
                        `,
                      )}
                    </tbody>
                  </table>
                </div>
                ${
                  pages > 1
                    ? html`
                      <div class="pager">
                        <button ?disabled=${page === 0} @click=${() => (this.page = page - 1)}>
                          Previous
                        </button>
                        <span>Page ${page + 1} of ${pages}</span>
                        <button
                          ?disabled=${page >= pages - 1}
                          @click=${() => (this.page = page + 1)}
                        >
                          Next
                        </button>
                      </div>
                    `
                    : nothing
                }
              `
              : html`<p class="empty">
                ${this.records.length ? "No record matches the filter." : "No records."}
              </p>`
          }
          ${
            this.selected
              ? html`
                <aside class="detail" aria-label="Record">
                  <div class="about">
                    <h3>
                      ${resource?.name}
                      ${resource?.key ? cellText(this.selected[resource.key]) : ""}
                    </h3>
                    <span class="grow"></span>
                    <button @click=${() => (this.selected = null)}>Close</button>
                  </div>
                  <pre>${JSON.stringify(this.selected, null, 2)}</pre>
                </aside>
              `
              : nothing
          }
        </main>
      </div>
    `;
  }

  renderOperations(api) {
    const text = this.filter.trim().toLowerCase();
    const rows = api.operations.filter(
      (op) =>
        this.labels.has(op.label) &&
        (!text ||
          `${op.method} ${op.path} ${op.id} ${op.resource || ""} ${op.why || ""}`
            .toLowerCase()
            .includes(text)),
    );
    return html`
      <main class="wide">
        <div class="tools">
          <input
            type="search"
            placeholder="Filter operations"
            aria-label="Filter operations"
            .value=${this.filter}
            @input=${(e) => (this.filter = e.target.value)}
          />
          ${Object.keys(LABELS).map(
            (label) => html`
              <label class="check">
                <input
                  type="checkbox"
                  .checked=${this.labels.has(label)}
                  @change=${() => this.toggleLabel(label)}
                />
                <span class="badge ${label}">${LABELS[label]}</span>
              </label>
            `,
          )}
          <span class="hint">${rows.length} of ${api.operations.length} operations</span>
        </div>
        ${
          rows.length
            ? html`
              <div class="scroll">
                <table class="operations">
                  <thead>
                    <tr>
                      <th>Method</th>
                      <th>Path</th>
                      <th>Does</th>
                      <th>Label</th>
                      <th>Why</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${rows.map(
                      (op) => html`
                        <tr>
                          <td><span class="method ${op.method.toLowerCase()}">${op.method}</span></td>
                          <td class="path" title=${op.summary || op.id}>${op.path}</td>
                          <td>
                            ${
                              op.action === "none"
                                ? html`<span class="hint">no state</span>`
                                : html`${op.action} <b>${op.resource}</b>`
                            }
                          </td>
                          <td><span class="badge ${op.label}">${LABELS[op.label]}</span></td>
                          <td class="why">${op.why || ""}</td>
                        </tr>
                      `,
                    )}
                  </tbody>
                </table>
              </div>
            `
            : html`<p class="empty">No operation matches.</p>`
        }
      </main>
    `;
  }
}

customElements.define("rapidoc-mock-ui", RapidocMockUi);
