import { css } from "lit";

/** Operations: the table of paths and methods, an operation's page and its responses. */
export const operations = css`
  /* Which labels are listed: each a name with its color as a dot and its count, without a frame, so the bar
     has one framed control (the filter) and one group of buttons. One that is off is dimmed, its dot hollow. */
  .label-filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-1);
  }
  .label-filter {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: var(--space-1) var(--space-2);
    border-radius: 3px;
    color: var(--fg);
    font-size: var(--small);
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
  }
  /* the checkbox is there for the keyboard and a screen reader; the dot shows its state */
  .label-filter input[type="checkbox"] {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }
  .label-filter:hover {
    background: var(--hover);
    color: var(--strong);
  }
  .label-filter:has(:focus-visible) {
    outline: 2px solid var(--accent-text);
    outline-offset: 1px;
  }
  .label-filter .dot {
    width: 8px;
    height: 8px;
    border: 1px solid var(--dot);
    border-radius: 50%;
    background: var(--dot);
  }
  .label-filter .count {
    color: var(--muted);
    font-variant-numeric: tabular-nums;
  }
  /* a label no operation has: still named, with its 0, but nothing to turn on or off */
  .label-filter.none {
    color: var(--muted);
    cursor: default;
  }
  .label-filter.none:hover {
    background: none;
    color: var(--muted);
  }
  .label-filter.none .dot {
    opacity: 0.5;
  }
  .label-filter:has(input:not(:checked)) {
    color: var(--muted);
    text-decoration: line-through;
  }
  .label-filter:has(input:not(:checked)) .dot {
    background: none;
  }
  /* Operations: the path (or resource) once, beside the rows of its methods; a line between groups */
  .nowrap {
    white-space: nowrap;
  }
  /* the path gets the room to stay on one line where it can; why wraps */
  table.operations .col-path {
    width: 34%;
  }
  table.operations .col-why {
    width: 36%;
  }
  /* a row opens its operation's page: anywhere on it, or its method (the link a keyboard reaches) */
  table.operations tr.opens th.group {
    cursor: pointer;
  }
  /* the path stands for all its operations: hovering it lights them all */
  table.operations tbody:has(th.group:hover) td,
  table.operations tbody:has(th.group:hover) th.group {
    background: var(--hover);
  }
  table.operations .path-link {
    color: var(--fg);
  }
  table.operations .path-link:hover {
    color: var(--accent-text);
    text-decoration: none;
  }
  table.operations th.group {
    vertical-align: top;
    min-width: 220px;
    color: var(--fg);
    font-weight: 400;
    text-align: left;
    overflow-wrap: break-word;
    white-space: normal;
    border-right: 1px solid var(--line);
  }
  table.operations tbody + tbody {
    border-top: 1px solid var(--border);
  }
  .op-title {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-2);
  }
  .op-title .method {
    min-width: 0;
    font-size: inherit;
  }
  /* a method as a tab: as wide as its name, with the padding every tab has (its badge's column width is for
     tables, where methods line up) */
  .tabs.methods a .method {
    min-width: 0;
  }
  .status {
    font-family: var(--mono);
    font-weight: 600;
  }
  .status.s2 {
    color: var(--ok);
  }
  .status.s4,
  .status.s5 {
    color: var(--error);
  }
  .status.s3,
  .status.sd {
    color: var(--plain);
  }
  /* the response whose sample is shown, as the records table marks the record shown */
  table.responses tr.current td:first-child {
    box-shadow: inset 3px 0 0 var(--primary);
  }
  .method-link:hover {
    text-decoration: none;
  }
  .method-link:hover .method {
    text-decoration: underline;
  }
  td.example {
    font-family: var(--mono);
    font-size: var(--small);
    overflow-wrap: anywhere;
    max-width: 220px;
    color: var(--muted);
  }
`;
