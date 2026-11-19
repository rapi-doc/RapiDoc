import { css } from "lit";

/** Lint: the Dashboard's card, the section's figures, its list of categories and its findings. */
export const lint = css`
  /* Lint: the summary's rows (a category or a rule, the share that passed, what was found) and the findings */
  /* a section's count: a small outlined badge at the end of its line */
  .sidebar a .count {
    margin-left: auto;
    padding: 0 6px;
    border: 1px solid var(--border);
    border-radius: 4px;
    font-size: 12px;
    line-height: 18px;
  }
  .errors,
  .sidebar a .count.errors,
  .severity.error {
    color: var(--error);
  }
  .warnings,
  .severity.warning {
    color: var(--warning);
  }
  .clean {
    color: var(--ok);
  }
  /* The Dashboard's Lint card: the ring and the counts on the left, one aligned table of categories beside them */
  .lint-card-body {
    display: grid;
    grid-template-columns: 200px minmax(0, 1fr);
    gap: var(--space-5);
    align-items: start;
  }
  .lint-card-total {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding-top: 6px;
    text-align: center;
  }
  .lint-card-total .hint {
    margin: 0;
  }
  .ring-share {
    fill: var(--strong);
    font-size: 14px;
    font-weight: 600;
    text-anchor: middle;
    dominant-baseline: central;
  }
  .lint-card-counts {
    display: flex;
    gap: var(--space-4);
    margin-top: 6px;
    color: var(--muted);
  }
  .lint-card-counts b {
    font-size: 20px;
    font-weight: 600;
    color: var(--strong);
  }
  .lint-card-counts b.errors {
    color: var(--error);
  }
  .lint-card-counts b.warnings {
    color: var(--warning);
  }
  table.lint-categories td,
  table.lint-categories th {
    padding-top: var(--space-2);
    padding-bottom: var(--space-2);
    vertical-align: middle;
  }
  table.lint-categories th.number,
  table.lint-categories td.number {
    text-align: right;
    white-space: nowrap;
  }
  table.lint-categories .meter-cell {
    width: 30%;
  }
  table.lint-categories a {
    color: var(--strong);
  }
  @media (max-width: 760px) {
    /* no room for a page's mark beside its title */
    .title.with-icon > .icon {
      display: none;
    }
    .lint-card-body {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  .lint-rows {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .lint-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 70px 38px minmax(84px, auto);
    align-items: center;
    gap: var(--space-2);
    padding: 6px var(--space-3) 6px var(--space-2);
    border-left: 3px solid transparent;
    color: var(--strong);
  }
  .lint-row:hover {
    background: var(--hover);
    text-decoration: none;
  }
  .lint-row.current {
    background: var(--hover);
    border-left-color: var(--primary);
  }
  /* the row you are on: its name in the accent, as the sidebar's */
  .lint-row.current .label {
    color: var(--accent-text);
  }
  .lint-row.rule {
    font-size: var(--small);
    color: var(--fg);
  }
  .lint-row.rule .label {
    font-family: var(--mono);
    overflow-wrap: anywhere;
  }
  /* The Lint section's list: one set of columns for every row, so the meters line up, rules included */
  .side.lint-rows {
    display: grid;
    grid-template-columns: 14px minmax(0, 1fr) 70px 38px auto;
    gap: 2px var(--space-2);
  }
  .side.lint-rows .lint-row,
  .lint-rules {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
  }
  .lint-rules {
    row-gap: 2px;
    padding: var(--space-1) 0;
    background: var(--inset);
  }
  .lint-rules .label {
    padding-left: var(--space-2);
  }
  /* a rule's meter, under its category's: a dimmer green on a lighter track */
  .lint-rules {
    --meter: color-mix(in srgb, var(--ok) 60%, var(--inset));
  }
  .lint-rules .bars.meter {
    background: var(--line);
  }
  .arrow {
    display: flex;
    margin-left: -4px;
    color: var(--muted);
  }
  .lint-row:hover .arrow {
    color: var(--strong);
  }
  /* the arrow of something that opens (components/parts.js): it points right, and down while open */
  .twist {
    display: inline-flex;
  }
  .twist .icon {
    width: 14px;
    height: 14px;
    transition: transform 0.12s;
  }
  .twist.open .icon {
    transform: rotate(90deg);
  }
  .share,
  .found {
    text-align: right;
    font-size: var(--small);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .share {
    color: var(--fg);
  }
  /* at least a screen tall: picking a row with few findings must not shorten the page and move the list */
  /*
   * Lint below the cards, on a grid: what is in view and what it checks over the list of categories; what it
   * found and the filters over the findings. Wide, the two parts sit side by side and both lists start on one
   * line; narrow, each part stays with its list: check, list, found and filters, findings.
   */
  .lint-layout {
    display: grid;
    grid-template-columns: 400px minmax(0, 1fr);
    /* the top row keeps one height whatever is picked, so the lists below never move */
    grid-template-rows: 84px auto;
    grid-template-areas:
      "head controls"
      "side pane";
    align-items: stretch;
    gap: var(--space-3) var(--space-5);
    min-height: calc(100vh - 80px);
    align-content: start;
  }
  .lint-layout > .lint-head {
    grid-area: head;
    min-height: 0;
    overflow: hidden;
  }
  /* what is checked: two lines at most, the whole of it on hover */
  .lint-head .checks {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
  }
  .lint-layout > .lint-controls {
    grid-area: controls;
  }
  .lint-layout > .side {
    grid-area: side;
    align-self: start;
    padding: var(--space-2) 0;
  }
  .lint-layout > .pane {
    grid-area: pane;
    align-self: start;
  }
  /* what was found, level with the name; the filters at the bottom, level with the top of the lists */
  .lint-controls {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--space-2);
  }
  .lint-controls .row {
    flex-wrap: nowrap;
    gap: var(--space-2);
  }
  .lint-controls input[type="search"] {
    flex: 1 1 140px;
    min-width: 0;
    width: auto;
  }
  .lint-controls .segmented button {
    padding-left: var(--space-2);
    padding-right: var(--space-2);
  }
  .lint-controls .hint {
    flex: none;
    white-space: nowrap;
  }
  /* Lint's figures: the share passed beside a ring; errors and warnings beside where they are */
  .lint-cards {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }
  .lint-stat {
    flex-direction: row;
    align-items: center;
    gap: var(--space-5);
  }
  /* the figure and its label; what charts it takes the rest of the card */
  .lint-stat > .figure {
    display: flex;
    flex-direction: column;
    flex: none;
  }
  .ring {
    flex: none;
  }
  .ring circle {
    fill: none;
  }
  .ring .fill {
    stroke: var(--ok);
    stroke-linecap: butt;
  }
  /* how errors or warnings split by category: one bar of blocks, 2px apart, over a key */
  .split-by {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }
  .lint-stat .key {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: var(--space-1) var(--space-3);
    font-size: var(--small);
  }
  .lint-stat .key li {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }
  .lint-stat .key .swatch {
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: 0;
  }
  .lint-stat .key .name {
    color: var(--fg);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .lint-stat .key .value {
    margin-left: auto;
    color: var(--muted);
    font-variant-numeric: tabular-nums;
  }
  .lint-stat .none {
    margin: 0;
    color: var(--ok);
  }
  .lint-head {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }
  .lint-head h2 {
    margin-bottom: 2px;
  }
  .lint-head p {
    margin: 0;
  }
  .found-line {
    font-weight: 500;
  }
  ol.findings {
    margin: 0;
    padding: 0;
    gap: 0;
    list-style: none;
  }
  .findings li {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: var(--space-2) var(--space-5);
    border-bottom: 1px solid var(--line);
  }
  .findings li:last-child {
    border-bottom: 0;
  }
  .findings .meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1) var(--space-2);
    font-size: var(--small);
    color: var(--muted);
  }
  .severity {
    font-weight: 500;
  }
  .findings .where {
    color: var(--muted);
    overflow-wrap: anywhere;
  }
  @media (max-width: 1100px) {
    .lint-layout {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: none;
      grid-template-areas: "head" "side" "controls" "pane";
    }
  }
`;
