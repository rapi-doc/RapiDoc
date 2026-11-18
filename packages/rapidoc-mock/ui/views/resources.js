import { html, nothing } from "lit";

const PAGE_SIZE = 25;

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

/** The columns of the records in view: the key first, then every field in the order records show it. */
function columnsOf(records, key) {
  const seen = new Set();
  for (const record of records) for (const field of Object.keys(record)) seen.add(field);
  const all = [...seen];
  return key && seen.has(key) ? [key, ...all.filter((field) => field !== key)] : all;
}

/** Resources: the records the mock stores, one resource at a time. */
export function resources(host) {
  const api = host.api;
  if (!api.resources.length) {
    return html`
      <div class="title"><h1>Resources</h1></div>
      <p class="empty">
        The mock found no resource in this spec: every operation answers as a plain mock.
      </p>
    `;
  }
  const resource = api.resources.find((one) => one.name === host.route.item);
  const columns = columnsOf(host.records, resource?.key);
  const text = host.filter.trim().toLowerCase();
  const rows = text
    ? host.records.filter((record) => JSON.stringify(record).toLowerCase().includes(text))
    : [...host.records];
  const { column, down } = host.sort;
  if (column) rows.sort((a, b) => compare(a[column], b[column]) * (down ? -1 : 1));
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const page = Math.min(host.page, pages - 1);
  const shown = rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const sortBy = (name) => {
    host.sort = { column: name, down: host.sort.column === name && !host.sort.down };
    host.page = 0;
  };

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
              href=${host.href("resources", one.name)}
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
        <div class="row">
          <input
            type="search"
            placeholder="Filter records"
            aria-label="Filter records"
            .value=${host.filter}
            @input=${(e) => {
              host.filter = e.target.value;
              host.page = 0;
            }}
          />
          <span class="hint">${rows.length} of ${host.records.length} records</span>
        </div>
        ${
          rows.length
            ? html`
              <div class="scroll records">
                <table>
                  <thead>
                    <tr>
                      ${columns.map(
                        (name) => html`
                          <th
                            class=${name === resource?.key ? "key" : ""}
                            aria-sort=${
                              column === name ? (down ? "descending" : "ascending") : "none"
                            }
                          >
                            <button @click=${() => sortBy(name)}>
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
                          class=${record === host.selected ? "current" : ""}
                          @click=${() => (host.selected = record)}
                          @keydown=${(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              host.selected = record;
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
                            const key = name === resource?.key ? " key" : "";
                            return html`<td class=${kind + key}>${cellText(value)}</td>`;
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
                    <div class="row pager">
                      <button ?disabled=${page === 0} @click=${() => (host.page = page - 1)}>
                        Previous
                      </button>
                      <span>Page ${page + 1} of ${pages}</span>
                      <button
                        ?disabled=${page >= pages - 1}
                        @click=${() => (host.page = page + 1)}
                      >
                        Next
                      </button>
                    </div>
                  `
                  : nothing
              }
            `
            : html`<p class="empty">
              ${host.records.length ? "No record matches the filter." : "No records."}
            </p>`
        }
        ${
          host.selected
            ? html`
              <aside class="card detail" aria-label="Record">
                <div class="row">
                  <h3>
                    ${resource?.name} ${resource?.key ? cellText(host.selected[resource.key]) : ""}
                  </h3>
                  <span class="grow"></span>
                  <button @click=${() => (host.selected = null)}>Close</button>
                </div>
                <pre>${JSON.stringify(host.selected, null, 2)}</pre>
              </aside>
            `
            : nothing
        }
      </div>
    </div>
  `;
}
