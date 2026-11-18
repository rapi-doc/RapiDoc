import { html } from "lit";
import { Screen } from "../components/screen.js";
import { LABELS, badge } from "../labels.js";
import "./operation-detail.js";

/** How the list was last grouped: a choice of the reader's, kept while the page is open. */
let lastGroupBy = "path";

/** Operations in groups: `[{ title, operations }]`, by path as the spec orders them, or by resource. */
function grouped(operations, by) {
  const groups = new Map();
  for (const op of operations) {
    const title = by === "resource" ? op.resource || "" : op.path;
    if (!groups.has(title)) groups.set(title, []);
    groups.get(title).push(op);
  }
  const list = [...groups].map(([title, ops]) => ({ title, operations: ops }));
  // by resource: the resources first, by name; what keeps no state last
  if (by === "resource") {
    list.sort((a, b) => (a.title === "") - (b.title === "") || a.title.localeCompare(b.title));
  }
  return list;
}

/**
 * Operations: every operation with what the mock does for it, and its label; or one operation's details.
 * Keeps its filter, the labels shown and the grouping, also while one operation is looked at.
 */
export class MockOperations extends Screen {
  static properties = {
    app: { attribute: false },
    api: { attribute: false },
    /** The id of the operation whose details are shown; empty for the list. */
    operation: { type: String },
    /** A label to show alone, as the address asks (`?label=needsReview`). */
    only: { type: String },
    version: { type: Number },
    filter: { state: true },
    labels: { state: true },
    groupBy: { state: true },
  };

  constructor() {
    super();
    this.operation = "";
    this.only = "";
    this.filter = "";
    this.labels = new Set(Object.keys(LABELS));
    this.groupBy = lastGroupBy;
  }

  willUpdate(changed) {
    if (changed.has("only") && LABELS[this.only]) this.labels = new Set([this.only]);
    if (changed.has("groupBy")) lastGroupBy = this.groupBy;
  }

  render() {
    const { app, api } = this;
    if (this.operation) {
      return html`<rapidoc-mock-operation-detail
      .app=${app}
      .api=${api.id}
      .operation=${this.operation}
      .version=${this.version}
    ></rapidoc-mock-operation-detail>`;
    }
    const text = this.filter.trim().toLowerCase();
    const rows = api.operations.filter(
      (op) =>
        this.labels.has(op.label) &&
        (!text ||
          `${op.method} ${op.path} ${op.id} ${op.resource || ""} ${op.why || ""}`
            .toLowerCase()
            .includes(text)),
    );
    const byResource = this.groupBy === "resource";
    const groups = grouped(rows, this.groupBy);
    const toggle = (label) => {
      const next = new Set(this.labels);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      this.labels = next;
    };

    return html`
    <div class="title">
      <h1>Operations</h1>
      <p>Every operation of the spec, with what the mock does for it.</p>
    </div>
    <div class="row">
      <input
        type="search"
        placeholder="Filter operations"
        aria-label="Filter operations"
        .value=${this.filter}
        @input=${(e) => (this.filter = e.target.value)}
      />
      <div class="segmented" role="group" aria-label="Group by">
        ${[
          ["path", "By path"],
          ["resource", "By resource"],
        ].map(
          ([value, title]) => html`
            <button
              class=${this.groupBy === value ? "current" : ""}
              aria-pressed=${this.groupBy === value ? "true" : "false"}
              @click=${() => (this.groupBy = value)}
            >
              ${title}
            </button>
          `,
        )}
      </div>
      ${Object.keys(LABELS).map(
        (label) => html`
          <label class="check">
            <input
              type="checkbox"
              .checked=${this.labels.has(label)}
              @change=${() => toggle(label)}
            />
            ${badge(label)}
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
                  ${byResource ? html`<th>Path</th>` : ""}
                  <th>Does</th>
                  <th>Label</th>
                  <th>Why</th>
                  <th><span class="visually-hidden">Details</span></th>
                </tr>
              </thead>
              ${groups.map(
                (group) => html`
                  <tbody>
                    <tr class="group">
                      <th colspan=${byResource ? 6 : 5} scope="rowgroup">
                        ${
                          byResource
                            ? group.title
                              ? html`<a href=${app.href("resources", group.title)}>${group.title}</a>`
                              : "No state"
                            : html`<code>${group.title}</code>`
                        }
                        <span class="count">${group.operations.length}</span>
                      </th>
                    </tr>
                    ${group.operations.map(
                      (op) => html`
                        <tr title=${op.summary || op.id}>
                          <td>
                            <span class="method ${op.method.toLowerCase()}">${op.method}</span>
                          </td>
                          ${byResource ? html`<td class="path">${op.path}</td>` : ""}
                          <td>
                            ${
                              op.action === "none"
                                ? html`<span class="hint">no state</span>`
                                : html`${op.action}
                                  <a href=${app.href("resources", op.resource)}>${op.resource}</a>`
                            }
                          </td>
                          <td>${badge(op.label)}</td>
                          <td class="why">${op.why || ""}</td>
                          <td>
                            <a
                              href=${app.href("operations", op.id)}
                              aria-label="Details of ${op.method} ${op.path}"
                              >Details</a
                            >
                          </td>
                        </tr>
                      `,
                    )}
                  </tbody>
                `,
              )}
            </table>
          </div>
        `
        : html`<p class="empty">No operation matches.</p>`
    }
  `;
  }
}

customElements.define("rapidoc-mock-operations", MockOperations);
