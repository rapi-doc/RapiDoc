import { html } from "lit";
import { LABELS } from "../labels.js";

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

/** Operations: every operation with what the mock does for it, and its label. */
export function operations(host) {
  const api = host.api;
  const text = host.filter.trim().toLowerCase();
  const rows = api.operations.filter(
    (op) =>
      host.labels.has(op.label) &&
      (!text ||
        `${op.method} ${op.path} ${op.id} ${op.resource || ""} ${op.why || ""}`
          .toLowerCase()
          .includes(text)),
  );
  const byResource = host.groupBy === "resource";
  const groups = grouped(rows, host.groupBy);
  const toggle = (label) => {
    const next = new Set(host.labels);
    if (next.has(label)) next.delete(label);
    else next.add(label);
    host.labels = next;
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
        .value=${host.filter}
        @input=${(e) => (host.filter = e.target.value)}
      />
      <div class="segmented" role="group" aria-label="Group by">
        ${[
          ["path", "By path"],
          ["resource", "By resource"],
        ].map(
          ([value, title]) => html`
            <button
              class=${host.groupBy === value ? "current" : ""}
              aria-pressed=${host.groupBy === value ? "true" : "false"}
              @click=${() => (host.groupBy = value)}
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
              .checked=${host.labels.has(label)}
              @change=${() => toggle(label)}
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
                  ${byResource ? html`<th>Path</th>` : ""}
                  <th>Does</th>
                  <th>Label</th>
                  <th>Why</th>
                </tr>
              </thead>
              ${groups.map(
                (group) => html`
                  <tbody>
                    <tr class="group">
                      <th colspan=${byResource ? 5 : 4} scope="rowgroup">
                        ${
                          byResource
                            ? group.title
                              ? html`<a href=${host.href("resources", group.title)}>${group.title}</a>`
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
                                  <a href=${host.href("resources", op.resource)}>${op.resource}</a>`
                            }
                          </td>
                          <td><span class="badge ${op.label}">${LABELS[op.label]}</span></td>
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
