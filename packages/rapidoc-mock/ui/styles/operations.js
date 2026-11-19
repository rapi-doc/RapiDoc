import { css } from "lit";

/** Operations: the table of paths and methods, an operation's page and its responses. */
export const operations = css`
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
