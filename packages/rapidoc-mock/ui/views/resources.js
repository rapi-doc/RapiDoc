import { html, nothing } from "lit";
import { keyed } from "lit/directives/keyed.js";
import { Screen } from "../components/screen.js";
import { cellText } from "../components/table.js";
import "../components/table.js";
import "./resource-about.js";

/** The columns of the records in view: the key first, then every field in the order records show it. */
function columnsOf(records, key) {
  const seen = new Set();
  for (const record of records) for (const field of Object.keys(record)) seen.add(field);
  const all = [...seen];
  const ordered = key && seen.has(key) ? [key, ...all.filter((field) => field !== key)] : all;
  return ordered.map((id) => ({
    id,
    // the parents a record was stored under (handlers.js PARENTS)
    header: id === "$parents" ? "under" : id,
    key: id === key,
  }));
}

const NONE = [];

/**
 * Resources: the records the mock stores, one resource at a time, and (the About tab) what the mock knows about
 * the resource. Keeps the records it loaded; the table keeps their filter, order, page and selection.
 */
export class MockResources extends Screen {
  static properties = {
    app: { attribute: false },
    api: { attribute: false },
    /** The resource in view, and its tab: "records" or "about". */
    name: { type: String },
    tab: { type: String },
    busy: { type: Boolean },
    /** Changes when the mock's data may have: the records are read again. */
    version: { type: Number },
    records: { state: true },
    columns: { state: true },
  };

  constructor() {
    super();
    this.records = [];
    this.columns = [];
  }

  get resource() {
    return this.api?.resources.find((one) => one.name === this.name);
  }

  updated(changed) {
    if (["api", "name", "tab", "version"].some((one) => changed.has(one)) && this.tab !== "about")
      this.loadRecords();
  }

  async loadRecords() {
    const { api, name, app } = this;
    if (!api || !name) return;
    const asked = (this.asked = `${api.id}/${name}`);
    await app.run(async () => {
      const records = await app.call(
        `/state/${encodeURIComponent(api.id)}/${encodeURIComponent(name)}`,
      );
      // an answer for a resource that is no longer in view is dropped
      if (asked !== this.asked) return;
      this.records = records;
      this.columns = columnsOf(records, this.resource?.key);
      this.loaded = asked;
    });
  }

  render() {
    const { api, app, resource } = this;
    // the records of the resource before this one are not shown while this one's are on their way
    const current = this.loaded === `${api.id}/${this.name}`;
    if (!api.resources.length) {
      return html`
        <div class="title"><h1>Resources</h1></div>
        <p class="empty">
          The mock found no resource in this spec: every operation answers as a plain mock.
        </p>
      `;
    }
    return html`
      <div class="title">
        <h1>Resources</h1>
        <p>The records this mock stores, worked out from the spec's schemas and paths.</p>
      </div>
      <div class="split">
        <nav class="list" aria-label="Resources">
          ${api.resources.map(
            (one) => html`
              <a
                href=${app.href("resources", one.name)}
                class=${one.name === resource?.name ? "current" : ""}
                aria-current=${one.name === resource?.name ? "true" : "false"}
              >
                <span class="name">${one.name}</span>
                <span class="count">${one.records}</span>
              </a>
            `,
          )}
        </nav>
        <div class="pane">
          <div class="row">
            <h2>${resource?.name}</h2>
            <code>${resource?.path || "no item path"}</code>
            <span>key: <code>${resource?.key || "none"}</code></span>
            ${
              resource?.review
                ? html`<span class="badge needsReview">Needs review</span>
                  <span class="hint">${resource.review}</span>`
                : nothing
            }
          </div>
          <div class="tabs" role="tablist">
            ${[
              ["records", "Records", resource?.name],
              ["about", "About", `${resource?.name}/about`],
            ].map(
              ([tab, title, item]) => html`
                <a
                  role="tab"
                  href=${app.href("resources", item)}
                  class=${this.tab === tab ? "current" : ""}
                  aria-selected=${this.tab === tab ? "true" : "false"}
                  >${title}</a
                >
              `,
            )}
          </div>
          ${
            // one element per resource: a filter or a sort order does not follow to the next one
            keyed(
              `${api.id}/${this.name}/${this.tab}`,
              this.tab === "about"
                ? html`<rapidoc-mock-resource-about
                    .app=${app}
                    .api=${api.id}
                    .name=${this.name}
                    .busy=${this.busy}
                    .version=${this.version}
                  ></rapidoc-mock-resource-about>`
                : html`<rapidoc-mock-table
                    .rows=${current ? this.records : NONE}
                    .columns=${current ? this.columns : NONE}
                    .detail=${(record, close) => html`
                      <aside class="card detail" aria-label="Record">
                        <div class="row">
                          <h3>
                            ${resource?.name} ${resource?.key ? cellText(record[resource.key]) : ""}
                          </h3>
                          <span class="grow"></span>
                          <button @click=${close}>Close</button>
                        </div>
                        <pre>${JSON.stringify(record, null, 2)}</pre>
                      </aside>
                    `}
                  ></rapidoc-mock-table>`,
            )
          }
        </div>
      </div>
    `;
  }
}

customElements.define("rapidoc-mock-resources", MockResources);
