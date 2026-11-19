import { html, nothing } from "lit";
import { opens, pageTitle, segmented } from "../components/parts.js";
import { Screen } from "../components/screen.js";
import { actionName } from "../format.js";
import { LABELS, LABEL_COLORS, LABEL_HELP, badge, method } from "../labels.js";
import "./operation-detail.js";

/** A path that breaks only after a slash: `/v3/applications/redirect-uris` never splits inside a word. */
const breakable = (path) =>
  path
    .split("/")
    .map((part, index) =>
      index
        ? html`/<wbr /><span class="nowrap">${part}</span>`
        : html`<span class="nowrap">${part}</span>`,
    );

/** What each method does to a record unless it says otherwise: the action is then not written again. */
const USUAL = { POST: "create", PUT: "update", PATCH: "patch", DELETE: "delete" };

/**
 * An operation's action when the method does not already say it: always for a GET (it lists or reads one), and
 * for the others only when it is not their usual one (a POST that updates). "create many" for `createMany`.
 */
const actionOf = (op) =>
  op.method === "GET" || USUAL[op.method] !== op.action ? actionName(op.action) : "";

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
      .operations=${api.operations}
      .resources=${api.resources}
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
    ${pageTitle(
      "operations",
      "Operations",
      "Every operation of the spec, with what the mock does for it.",
      api.operations.length,
    )}
    <div class="row">
      <input
        type="search"
        placeholder="Filter operations"
        aria-label="Filter operations"
        .value=${this.filter}
        @input=${(e) => (this.filter = e.target.value)}
      />
      ${segmented(
        "Group by",
        [
          ["path", "By path"],
          ["resource", "By resource"],
        ],
        this.groupBy,
        (value) => (this.groupBy = value),
      )}
      <div class="label-filters" role="group" aria-label="Labels shown">
        ${Object.keys(LABELS).map(
          (label) => html`
            <label class=${api.labels[label] ? "label-filter" : "label-filter none"} title=${LABEL_HELP[label]}>
              <input
                type="checkbox"
                ?disabled=${!api.labels[label]}
                .checked=${this.labels.has(label)}
                @change=${() => toggle(label)}
              />
              <span class="dot" style="--dot: ${LABEL_COLORS[label]}"></span>
              ${LABELS[label]}
              <span class="count">${api.labels[label]}</span>
            </label>
          `,
        )}
      </div>
      <span class="grow"></span>
      <span class="hint">${rows.length} of ${api.operations.length} operations</span>
    </div>
    ${
      rows.length
        ? html`
          <div class="scroll fill">
            <table class="operations">
              <thead>
                <tr>
                  <th class=${byResource ? "" : "col-path"}>${byResource ? "Resource" : "Path"}</th>
                  <th>Method</th>
                  ${byResource ? html`<th class="col-path">Path</th>` : ""}
                  <th>${byResource ? "Does" : "Resource"}</th>
                  <th>Label</th>
                  <th class="col-why">Why</th>
                </tr>
              </thead>
              ${groups.map(
                (group) => html`
                  <tbody>
                    ${group.operations.map(
                      (op, index) => html`
                        <tr
                          class="opens"
                          title=${op.summary || op.id}
                          @click=${
                            // a click on the path cell lands on the first row, whose operation the path opens
                            opens(() => (location.hash = app.href("operations", op.id))).click
                          }
                        >
                          ${
                            index === 0
                              ? html`<th
                                  class="group"
                                  scope="rowgroup"
                                  rowspan=${group.operations.length}
                                >
                                  ${
                                    byResource
                                      ? group.title
                                        ? html`<a href=${app.href("resources", group.title)}
                                            >${group.title}</a
                                          >`
                                        : html`<span class="hint">No state</span>`
                                      : html`<a
                                          class="path-link"
                                          href=${app.href("operations", op.id)}
                                          title="Open ${group.title}: its methods are tabs there"
                                          ><code>${breakable(group.title)}</code></a
                                        >`
                                  }
                                </th>`
                              : nothing
                          }
                          <td>
                            <a
                              class="method-link"
                              href=${app.href("operations", op.id)}
                              aria-label="Details of ${op.method} ${op.path}"
                              >${method(op.method)}</a
                            >
                          </td>
                          ${byResource ? html`<td class="path"><code>${breakable(op.path)}</code></td>` : ""}
                          <td>
                            ${
                              op.action === "none"
                                ? html`<span class="hint">no state</span>`
                                : byResource
                                  ? actionName(op.action)
                                  : html`<a href=${app.href("resources", op.resource)}>${op.resource}</a>
                                    ${actionOf(op) ? html`<span class="hint">${actionOf(op)}</span>` : nothing}`
                            }
                          </td>
                          <td>${badge(op.label)}</td>
                          <td class="why">${op.why || ""}</td>
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
