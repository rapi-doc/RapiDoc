import { css } from "lit";

/** Tables: the plain ones, the records table with its pinned key column, rows that open. */
export const tables = css`
  /* Tables */
  .scroll {
    overflow-x: auto;
    border-radius: 3px;
    background: var(--card);
  }
  /* a table inside a panel is part of it */
  .card .scroll {
    margin: 0 -8px;
  }
  table {
    border-collapse: collapse;
    width: 100%;
  }
  th,
  td {
    padding: var(--space-2) var(--space-3);
    text-align: left;
    border-bottom: 1px solid var(--line);
    vertical-align: top;
  }
  table > :last-child > tr:last-child > * {
    border-bottom: 0;
  }
  /* a column's heading: quiet, so the rows are what is read. Muted small caps in a regular weight; a heading
     that is a field's name from the spec (the records table's, which sort) keeps its case. */
  thead th {
    background: var(--table-head);
    color: var(--muted);
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    white-space: nowrap;
    border-bottom-color: var(--border);
  }
  th button {
    border: 0;
    background: none;
    padding: 0;
    font-size: var(--small);
    font-weight: 400;
    letter-spacing: 0;
    text-transform: none;
    color: var(--muted);
  }
  th button:hover:not(:disabled) {
    color: var(--strong);
  }
  td {
    max-width: 280px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  td.number {
    font-variant-numeric: tabular-nums;
  }
  /* Records: the header row stays at the top and the key column at the left while the rest scrolls */
  .scroll.records {
    overflow: auto;
  }
  /* A table that fills the rest of the page and scrolls on its own: the page's title, its filters and the
     table's header stay in view */
  .scroll.fill {
    flex: 1 1 0;
    min-height: 260px;
    overflow: auto;
  }
  /* a table that scrolls in its own box keeps its header row at the top */
  .fill thead th,
  .records thead th {
    position: sticky;
    top: 0;
    z-index: 2;
  }
  .records .key {
    position: sticky;
    left: 0;
    z-index: 1;
    background: var(--card);
    box-shadow: inset -1px 0 0 var(--line);
  }
  /* a key is an identifier: in the monospace font at the small size, as a cell of JSON is */
  .records tbody .key {
    font-family: var(--mono);
    font-size: var(--small);
  }
  /* a column's sort mark: a caret after its name */
  th button .icon {
    margin-left: 2px;
    vertical-align: -2px;
  }
  .records thead .key {
    z-index: 3;
    background: var(--table-head);
    color: var(--muted);
  }
  .records tbody tr:hover .key,
  .records tbody tr.current .key {
    background: var(--hover);
  }
  /* the pinned key column: a bright edge down its rows (its heading has none: the key tag marks it), and a
     shadow on the columns under it once they scroll */
  .records tbody .key {
    box-shadow: inset -2px 0 0 var(--key-edge);
  }
  .records thead .key {
    box-shadow: none;
  }
  .records tbody tr.current .key {
    box-shadow:
      inset 3px 0 0 var(--primary),
      inset -2px 0 0 var(--key-edge);
  }
  /* the record in the drawer: its row in the accent color, with a bar at its left edge, key column or not */
  .records tbody tr.current td {
    color: var(--accent-text);
  }
  .records tbody tr.current td:first-child:not(.key) {
    box-shadow: inset 3px 0 0 var(--primary);
  }
  .records thead .tag {
    margin-left: var(--space-1);
    font-weight: 400;
  }
  td.none,
  td.json {
    color: var(--muted);
  }
  /* a row that opens something (components/parts.js) or can be picked: the pointer, and a highlight under it;
     the row that is picked keeps the highlight */
  tbody tr[tabindex],
  tbody tr.opens > td {
    cursor: pointer;
  }
  tbody tr[tabindex]:hover,
  tbody tr.opens:hover > td,
  tbody tr.current {
    background: var(--hover);
  }
  table.operations td,
  table.plain td {
    white-space: normal;
    max-width: none;
  }
  table.plain td.path {
    overflow-wrap: anywhere;
    min-width: 220px;
  }
  table.operations td.path {
    overflow-wrap: break-word;
    min-width: 220px;
  }
`;
