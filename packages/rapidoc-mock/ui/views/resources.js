import { html, nothing } from "lit";
import { keyed } from "lit/directives/keyed.js";
import { drawer, pageTitle } from "../components/parts.js";
import { Screen } from "../components/screen.js";
import { count, valueText } from "../format.js";
import { badge } from "../labels.js";
import "../components/table.js";
import "./resource-schema.js";

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
 * How many records a resource holds: muted while it is what the seed data had, marked with the difference once
 * requests (or a restore) changed it. A reset goes back to the seed count.
 */
function recordCount({ records, seeded }) {
  const changed = seeded !== undefined && records !== seeded;
  const delta = records - seeded;
  return html`<span
    class="count${changed ? " changed" : ""}"
    title=${
      changed
        ? `${records} now, ${seeded} in the seed data`
        : `${count(records, "record")}, as seeded`
    }
    >${records}${changed ? html` <small>(${delta > 0 ? "+" : ""}${delta})</small>` : nothing}</span
  >`;
}

/**
 * Resources: the records the mock stores, one resource at a time, and (the Schema tab) what the mock knows about
 * the resource. Keeps the records it loaded; the table keeps their filter, order, page and selection.
 */
export class MockResources extends Screen {
  static properties = {
    app: { attribute: false },
    api: { attribute: false },
    /** The resource in view, and its tab: "records" or "schema". */
    name: { type: String },
    tab: { type: String },
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
    if (["api", "name", "tab", "version"].some((one) => changed.has(one)) && this.tab !== "schema")
      this.loadRecords();
  }

  loadRecords() {
    const { api, name } = this;
    if (!api || !name) return;
    const asked = `${api.id}/${name}`;
    this.read(
      "records",
      `/state/${encodeURIComponent(api.id)}/${encodeURIComponent(name)}`,
      (records) => {
        this.records = records;
        this.columns = columnsOf(records, this.resource?.key);
        this.loaded = asked;
      },
    );
  }

  render() {
    const { api, app, resource } = this;
    // the records of the resource before this one are not shown while this one's are on their way
    const current = this.loaded === `${api.id}/${this.name}`;
    if (!api.resources.length) {
      return html`
        ${pageTitle("resources", "Resources")}
        <p class="empty">
          The mock found no resource in this spec: every operation is static, answered from examples or generated data.
        </p>
      `;
    }
    // the tabs, and what needs review: one row with the records' filter (the list shows which resource it is)
    const heading = html`
      <nav class="tabs" role="tablist" aria-label=${resource?.name || "Resource"}>
        ${[
          ["records", "Records", resource?.name],
          ["schema", "Schema", `${resource?.name}/schema`],
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
      </nav>
      ${resource?.review ? badge("needsReview", resource.review) : nothing}
    `;
    return html`
      ${pageTitle(
        "resources",
        "Resources",
        "The records this mock stores, worked out from the spec's schemas and paths.",
        api.resources.length,
      )}
      <div class="resources-panel">
        <nav class="list" aria-label="Resources">
          ${api.resources.map(
            (one) => html`
              <a
                href=${app.href("resources", one.name)}
                class=${one.name === resource?.name ? "current" : ""}
                aria-current=${one.name === resource?.name ? "true" : "false"}
              >
                <span class="name">${one.name}</span>
                ${
                  one.review
                    ? html`<span class="review-dot" title="Needs review: ${one.review}"
                        ><span class="visually-hidden">needs review</span></span
                      >`
                    : nothing
                }
                ${recordCount(one)}
              </a>
            `,
          )}
        </nav>
        <div class="pane">
          ${
            // one element per resource: a filter or a sort order does not follow to the next one
            keyed(
              `${api.id}/${this.name}/${this.tab}`,
              this.tab === "schema"
                ? html`<div class="row toolbar">${heading}</div>
                    <div class="pane-body">
                      <rapidoc-mock-resource-schema
                        .app=${app}
                        .api=${api.id}
                        .name=${this.name}
                        .version=${this.version}
                      ></rapidoc-mock-resource-schema>
                    </div>`
                : current && this.records.length && !this.columns.length
                  ? html`<div class="row toolbar">${heading}</div>
                      <div class="pane-body">
                        <div class="empty-shape">
                          <p>
                            The mock holds ${this.records.length} ${resource?.name} records, and every one is
                            empty: it found no fields in the resource's schema.
                          </p>
                          <p class="hint">
                            The <a href=${app.href("resources", `${resource?.name}/schema`)}>Schema</a> tab says
                            what the schema is instead.
                          </p>
                        </div>
                      </div>`
                  : html`<rapidoc-mock-table
                    .lead=${heading}
                    .rows=${current ? this.records : NONE}
                    .columns=${current ? this.columns : NONE}
                    .detail=${(record, close) =>
                      drawer(
                        {
                          label: `${resource?.name} ${resource?.key ? valueText(record[resource.key]) : "record"}`,
                          onClose: close,
                          kind: "record",
                        },
                        html`<pre>${JSON.stringify(record, null, 2)}</pre>`,
                      )}
                  ></rapidoc-mock-table>`,
            )
          }
        </div>
      </div>
    `;
  }
}

customElements.define("rapidoc-mock-resources", MockResources);
