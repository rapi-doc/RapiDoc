/**
 * `<rapidoc-mock-table>`: a table of records with its own filter, sort order, page and selected row.
 *
 * - The behaviour is TanStack Table's (`@tanstack/table-core`, bundled): which rows match, their order, the page.
 * - The markup and the styles are ours (`table` rules in `styles.js`): a sticky header row and key column.
 * - It works on the rows it is given. A list longer than what was loaded needs the server to filter and sort.
 *
 * Properties: `rows` (the records), `columns` (`[{ id, header, key }]`, `key` marks the key column), `noun`
 * ("records"), `pageSize`, and `detail` (a function from the selected record to what is shown under the table).
 * Keep `rows` and `columns` the same arrays between changes: a new array is new data to the table.
 */
import { html, nothing } from "lit";
import {
  columnFilteringFeature,
  constructTable,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
} from "@tanstack/table-core";
import { storeReactivityBindings } from "@tanstack/table-core/store-reactivity-bindings";
import { Screen } from "./screen.js";

/** A cell's text: plain for a simple value, compact JSON for an object or a list. */
export const cellText = (value) => {
  if (value === null) return "null";
  if (value === undefined) return "";
  return typeof value === "object" ? JSON.stringify(value) : String(value);
};

/** Ascending order of two cell values: numbers as numbers, the rest as text; nothing goes last. */
const compare = (a, b) => {
  if (a === b) return 0;
  if (a === undefined || a === null) return 1;
  if (b === undefined || b === null) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return cellText(a).localeCompare(cellText(b), undefined, { numeric: true });
};

/** What the table can do. Grouping, column pinning and the like are features to add here. */
const FEATURES = tableFeatures({
  coreReactivityFeature: storeReactivityBindings(),
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
});

const columnDefs = (columns) =>
  columns.map((column) => ({
    id: column.id,
    accessorFn: (record) => record[column.id],
    meta: column,
    sortFn: (a, b, id) => compare(a.getValue(id), b.getValue(id)),
    sortDescFirst: false,
  }));

export class MockTable extends Screen {
  static properties = {
    rows: { attribute: false },
    columns: { attribute: false },
    noun: { type: String },
    pageSize: { type: Number, attribute: "page-size" },
    detail: { attribute: false },
  };

  constructor() {
    super();
    this.rows = [];
    this.columns = [];
    this.noun = "records";
    this.pageSize = 25;
    this.detail = null;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.subscription?.unsubscribe();
    this.subscription = null;
  }

  willUpdate(changed) {
    if (!this.table) {
      this.table = constructTable({
        features: FEATURES,
        data: this.rows,
        columns: columnDefs(this.columns),
        getRowId: (record, index) => String(index),
        enableMultiRowSelection: false,
        getColumnCanGlobalFilter: () => true,
        globalFilterFn: (row, id, text) => {
          const wanted = String(text).trim().toLowerCase();
          return !wanted || cellText(row.getValue(id)).toLowerCase().includes(wanted);
        },
        initialState: { pagination: { pageIndex: 0, pageSize: this.pageSize } },
      });
    } else if (changed.has("rows") || changed.has("columns")) {
      this.table.setOptions((old) => ({
        ...old,
        data: this.rows,
        columns: changed.has("columns") ? columnDefs(this.columns) : old.columns,
      }));
      // rows are known by their place in the list: a selection does not carry over to new data
      this.table.resetRowSelection(true);
    }
    // the table's state (filter, sort, page, selection) is its own: a change draws the element again
    this.subscription ??= this.table.store.subscribe(() => this.requestUpdate());
  }

  render() {
    const table = this.table;
    const matching = table.getPrePaginatedRowModel().rows.length;
    const pages = Math.max(1, table.getPageCount());
    const page = Math.min(table.store.state.pagination.pageIndex, pages - 1);
    const headers = table.getHeaderGroups()[0]?.headers || [];
    const selected = table.getSelectedRowModel().rows[0];
    const select = (row) => row.toggleSelected(true);
    return html`
      <div class="row">
        <input
          type="search"
          placeholder="Filter ${this.noun}"
          aria-label="Filter ${this.noun}"
          .value=${table.store.state.globalFilter || ""}
          @input=${(e) => table.setGlobalFilter(e.target.value)}
        />
        <span class="hint">${matching} of ${this.rows.length} ${this.noun}</span>
      </div>
      ${
        matching
          ? html`
            <div class="scroll records">
              <table>
                <thead>
                  <tr>
                    ${headers.map(({ column }) => {
                      const sorted = column.getIsSorted();
                      const { header, key } = column.columnDef.meta;
                      return html`
                        <th
                          class=${key ? "key" : ""}
                          aria-sort=${sorted ? `${sorted}ending` : "none"}
                        >
                          <button @click=${() => column.toggleSorting()}>
                            ${header ?? column.id} ${sorted ? (sorted === "desc" ? "▼" : "▲") : nothing}
                          </button>
                        </th>
                      `;
                    })}
                  </tr>
                </thead>
                <tbody>
                  ${table.getRowModel().rows.map(
                    (row) => html`
                      <tr
                        tabindex="0"
                        class=${row.getIsSelected() ? "current" : ""}
                        @click=${() => select(row)}
                        @keydown=${(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            select(row);
                          }
                        }}
                      >
                        ${row.getAllCells().map((cell) => {
                          const value = cell.getValue();
                          const kind =
                            value === null || value === undefined
                              ? "none"
                              : typeof value === "object"
                                ? "json"
                                : typeof value;
                          const key = cell.column.columnDef.meta.key ? " key" : "";
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
                    <button
                      ?disabled=${!table.getCanPreviousPage()}
                      @click=${() => table.previousPage()}
                    >
                      Previous
                    </button>
                    <span>Page ${page + 1} of ${pages}</span>
                    <button ?disabled=${!table.getCanNextPage()} @click=${() => table.nextPage()}>
                      Next
                    </button>
                  </div>
                `
                : nothing
            }
          `
          : html`<p class="empty">
            ${this.rows.length ? `No ${this.noun} match the filter.` : `No ${this.noun}.`}
          </p>`
      }
      ${
        selected && this.detail
          ? this.detail(selected.original, () => table.resetRowSelection(true))
          : nothing
      }
    `;
  }
}

customElements.define("rapidoc-mock-table", MockTable);
