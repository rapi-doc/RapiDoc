/**
 * `<rapidoc-mock-table>`: a table of records with its own filter, sort order, page and selected row.
 *
 * - The behaviour is TanStack Table's (`@tanstack/table-core`, bundled): which rows match, their order, the page.
 * - The markup and the styles are ours (`table` rules in `styles.js`): a sticky header row and key column.
 * - It works on the rows it is given. A list longer than what was loaded needs the server to filter and sort.
 *
 * Properties: `rows` (the records), `columns` (`[{ id, header, key }]`, `key` marks the key column), `noun`
 * ("records"), `pageSize`, `detail` (a function from the selected record to what is shown in a panel beside the
 * table) and `lead` (what goes in front of the filter, on its row: the page's title and tabs).
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
import { valueText } from "../format.js";
import { icon } from "../icons.js";
import { Screen } from "./screen.js";

/** Ascending order of two cell values: numbers as numbers, the rest as text; nothing goes last. */
const compare = (a, b) => {
  if (a === b) return 0;
  if (a === undefined || a === null) return 1;
  if (b === undefined || b === null) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return valueText(a).localeCompare(valueText(b), undefined, { numeric: true });
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
    lead: { attribute: false },
  };

  constructor() {
    super();
    this.rows = [];
    this.columns = [];
    this.noun = "records";
    this.pageSize = 25;
    this.detail = null;
    this.lead = nothing;
  }

  /** Brings a newly picked record's panel into view (on a narrow screen it sits under the table), and marks
   * the edges the table can scroll past. */
  updated() {
    const box = this.querySelector(".scroll.records");
    if (box) this.markEdges(box);
    const picked = this.table?.getSelectedRowModel().rows[0]?.id;
    if (picked !== undefined && picked !== this.shownRow) {
      this.querySelector(".records-body > .drawer")?.scrollIntoView({ block: "nearest" });
    }
    this.shownRow = picked;
  }

  /**
   * Marks how far the table is scrolled sideways: `scrolled-x` once columns are under the pinned key column (it
   * casts a shadow on them), `more-x` while columns are hidden on the right (a shadow at that edge).
   */
  markEdges(box) {
    // on the frame around the box: its shadow at the right edge must not scroll with the table
    const frame = box.parentElement;
    // the shadow of the pinned key column is drawn by the frame, over the whole height, at the column's edge
    // (a cell clips what it draws outside itself, so a cell's own shadow would end at the header)
    const key = box.querySelector("thead th.key");
    frame.style.setProperty("--key-width", `${key ? key.offsetWidth : 0}px`);
    frame.classList.toggle("scrolled-x", Boolean(key) && box.scrollLeft > 0);
    frame.classList.toggle("more-x", box.scrollLeft + box.clientWidth < box.scrollWidth - 1);
  }

  onScroll(event) {
    this.markEdges(event.currentTarget);
  }

  connectedCallback() {
    super.connectedCallback();
    // the room the table has changes with the window
    this.onResize ??= () => {
      const box = this.querySelector(".scroll.records");
      if (box) this.markEdges(box);
    };
    window.addEventListener("resize", this.onResize);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("resize", this.onResize);
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
          return !wanted || valueText(row.getValue(id)).toLowerCase().includes(wanted);
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
      <div class="row toolbar">
        ${this.lead}
        <span class="grow"></span>
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
            <div
              class="records-body"
              @keydown=${
                // Esc closes the record's drawer from the row that opened it, where the focus stays
                (e) => e.key === "Escape" && selected && table.resetRowSelection(true)
              }
            >
            <div class="scroll-frame">
            <div class="scroll records" @scroll=${this.onScroll}>
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
                            ${header ?? column.id}${
                              key
                                ? html` <span class="tag" title="The key: a record is found by it">key</span>`
                                : nothing
                            }
                            ${sorted ? icon(sorted === "desc" ? "descending" : "ascending", 12) : nothing}
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
                          return html`<td class=${kind + key}>${valueText(value)}</td>`;
                        })}
                      </tr>
                    `,
                  )}
                </tbody>
              </table>
            </div>
            </div>
            ${
              selected && this.detail
                ? this.detail(selected.original, () => table.resetRowSelection(true))
                : nothing
            }
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
    `;
  }
}

customElements.define("rapidoc-mock-table", MockTable);
