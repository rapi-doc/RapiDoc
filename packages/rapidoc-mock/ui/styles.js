import { css } from "lit";

/**
 * The Mock UI's styles: one dark theme, in the manner of a monitoring console. Slate surfaces without borders,
 * white headings over grey text, and RapiDoc's amber as the one accent (the brand block, the place you are, the
 * main action). Label colors come with text: a label is never told by color alone.
 */
export const styles = css`
  :host {
    /*
     * The surfaces: one base, the page, and every other shade mixed from it, so they move together and keep
     * their steps. Darker is further back (the sidebar, a well of raw content such as code), lighter is raised
     * (a card, a row under the pointer). Change --surface, not the shades.
     */
    --surface: #2a2c34;
    --bg: var(--surface);
    --sidebar: color-mix(in oklab, var(--surface), black 15%);
    /* a link of the sidebar under the pointer is lighter, the page you are on darker, with the amber bar */
    --sidebar-hover: color-mix(in oklab, var(--surface), white 3%);
    --sidebar-current: color-mix(in oklab, var(--surface), black 23%);
    --inset: color-mix(in oklab, var(--surface), black 10%);
    /* a panel on the page; opaque, so a sticky cell can use it */
    --card: color-mix(in oklab, var(--surface), white 6%);
    --hover: color-mix(in oklab, var(--surface), white 12%);
    --line: color-mix(in oklab, var(--surface), white 13%);
    --border: color-mix(in oklab, var(--surface), white 16%);
    /* the edge of a pinned column: brighter than any line, so it reads as an edge, not a row's border */
    --key-edge: color-mix(in oklab, var(--surface), white 35%);
    --fg: #c0c4c8;
    --strong: #ffffff;
    --muted: #949ba2;
    --primary: #f6a821;
    --primary-fg: #24262d;
    --accent-text: #f6a821;
    /* the three labels: green, a light red (amber is the accent, so it can't mark a warning), grey */
    --ok: #68cc97;
    --ok-bg: #24463a;
    --warn: #fa82a2;
    --plain: #b4b9c4;
    --error: #f98080;
    /*
     * Series colors for a chart that splits a whole: the first three of the dataviz categorical palette's dark
     * steps, which tell apart in any pair, also with colorblind eyes, on --card. More parts than three fold into
     * an "Other" in --series-other. A chart's key names every part, so color is never the only label.
     */
    --series-1: #3987e5;
    --series-2: #d95926;
    --series-3: #199e70;
    --series-other: #6b7079;
    color-scheme: dark;
    accent-color: var(--primary);
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
    background: var(--bg);
    color: var(--fg);
    font:
      14px/1.5 Roboto,
      system-ui,
      -apple-system,
      "Segoe UI",
      sans-serif;
  }
  * {
    box-sizing: border-box;
  }
  h1,
  h2,
  h3 {
    margin: 0;
    font-weight: 500;
    color: var(--strong);
  }
  h1 {
    font-size: 24px;
  }
  h2 {
    font-size: 16px;
  }
  h3 {
    font-size: 15px;
  }
  p {
    margin: 0;
  }
  a {
    color: var(--accent-text);
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  code,
  pre,
  td.json,
  td.path {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 12.5px;
  }
  button,
  input,
  select {
    font: inherit;
    color: inherit;
  }
  button {
    cursor: pointer;
    padding: 5px 12px;
    border: 1px solid #616779;
    border-radius: 3px;
    background: transparent;
    white-space: nowrap;
    transition:
      border-color 0.15s,
      color 0.15s,
      background 0.15s;
  }
  button:hover:not(:disabled) {
    border-color: var(--muted);
    color: var(--strong);
  }
  button:disabled {
    cursor: default;
    opacity: 0.55;
  }
  button.primary {
    background: var(--primary);
    border-color: var(--primary);
    color: var(--primary-fg);
    font-weight: 500;
  }
  button.primary:hover:not(:disabled) {
    background: #ffb93a;
    border-color: #ffb93a;
    color: var(--primary-fg);
  }
  :focus-visible {
    outline: 2px solid var(--accent-text);
    outline-offset: 2px;
  }
  input[type="text"],
  input[type="search"],
  input[type="number"],
  select {
    padding: 5px 10px;
    border: 1px solid var(--border);
    border-radius: 3px;
    background: var(--inset);
    min-width: 0;
  }
  input:focus,
  select:focus {
    border-color: var(--primary);
    outline: none;
  }
  ::placeholder {
    color: #7b828b;
  }
  .grow {
    flex: 1;
  }
  .hint {
    color: var(--muted);
    font-size: 12.5px;
  }
  .count {
    color: var(--muted);
    font-variant-numeric: tabular-nums;
  }
  /* a resource's count once requests changed it from the seed data */
  .count.changed {
    color: var(--accent-text);
    font-weight: 600;
  }
  .count small {
    font-size: 11.5px;
    font-weight: 400;
  }
  .icon {
    flex: none;
    vertical-align: -3px;
  }

  /* The shell: a header across the top, a sidebar, and the content beside it */
  header {
    flex: none;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 12px;
    padding-right: 16px;
    min-height: 56px;
    background: var(--sidebar);
    box-shadow: 0 1px 6px rgb(0 0 0 / 35%);
    position: relative;
    z-index: 3;
  }
  /* the brand block: as wide as the sidebar under it */
  .brand {
    align-self: stretch;
    display: flex;
    align-items: center;
    width: 210px;
    padding: 0 22px;
    margin-right: 8px;
    background: var(--primary);
    color: var(--primary-fg);
    font-size: 17px;
    font-weight: 500;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .brand b {
    font-weight: 300;
    margin-left: 0.45em;
  }
  .brand:hover {
    text-decoration: none;
  }
  select.api {
    max-width: 280px;
    color: var(--strong);
  }
  header .session span {
    color: var(--muted);
  }
  .session {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .session input {
    width: 140px;
  }
  .icon-button {
    padding: 6px 8px;
    line-height: 0;
  }
  .menu {
    display: none;
  }
  .shell {
    position: relative;
    flex: 1;
    display: flex;
    min-height: 0;
  }
  /*
   * The sidebar in three steps of contrast: a group's name bright, its sections muted, the section you are on
   * bright again with the amber bar. Space above each group sets the groups apart.
   */
  .sidebar {
    flex: 0 0 210px;
    display: flex;
    flex-direction: column;
    padding: 6px 0 16px;
    background: var(--sidebar);
    overflow-y: auto;
  }
  .sidebar h2 {
    margin: 0;
    padding: 20px 15px 8px 25px;
    font-size: 15px;
    font-weight: 500;
    color: var(--strong);
  }
  .sidebar a {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 15px 9px 22px;
    border-left: 3px solid transparent;
    color: var(--muted);
    transition:
      color 0.15s,
      background 0.15s;
  }
  .sidebar a:hover {
    color: var(--fg);
    text-decoration: none;
    background: var(--sidebar-hover);
  }
  .sidebar a.current {
    color: var(--accent-text);
    border-left-color: var(--primary);
    background: var(--sidebar-current);
  }
  .sidebar a.current .icon {
    color: var(--primary);
  }
  main {
    flex: 1;
    min-width: 0;
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  /* the content scrolls as a whole: nothing in it gives up height to fit */
  main > *,
  .pane > *,
  .screen > * {
    flex-shrink: 0;
  }
  /* A section or a part of one (components/screen.js): no box of its own, its content is laid out in its place */
  .screen {
    display: contents;
  }
  /* a page's heading: its name, a line about it, and a rule under both */
  .title {
    padding-bottom: 16px;
    border-bottom: 1px solid var(--line);
  }
  .title p {
    color: var(--muted);
    margin-top: 4px;
  }
  /* a page's mark: its section's icon, large and in the accent, at the right of the title */
  .title.with-icon {
    display: flex;
    align-items: center;
    gap: 18px;
  }
  .title.with-icon > .icon {
    flex: none;
    order: 1;
    margin-left: auto;
    color: var(--accent-text);
  }
  .title.with-icon > div {
    min-width: 0;
  }
  /* a figure with its thing's icon on the right, muted: it fills the card's empty side, not the eye */
  .stat.with-icon {
    position: relative;
    padding-right: 72px;
  }
  .stat.with-icon > .icon {
    position: absolute;
    top: 50%;
    right: 22px;
    transform: translateY(-50%);
    color: var(--accent-text);
  }
  .banner {
    padding: 10px 14px;
    border-radius: 3px;
    background: var(--ok-bg);
    color: var(--ok);
  }
  .banner.error {
    background: transparent;
    color: var(--error);
    border: 1px solid var(--error);
  }
  .empty {
    color: var(--muted);
    padding: 24px 0;
  }

  /* Building blocks of the views */
  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 14px;
  }
  form.row {
    align-items: flex-start;
  }
  form.row button {
    /* level with the fields: below their labels */
    margin-top: 24px;
  }
  .row input[type="search"] {
    width: 260px;
    max-width: 100%;
  }
  .stack {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .stack input {
    width: 170px;
  }
  .stack code {
    color: var(--muted);
  }
  .card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px 20px 18px;
    border-radius: 3px;
    background: var(--card);
  }
  .card h2,
  .card h3 {
    font-size: 16px;
  }
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 18px;
  }
  .stat {
    gap: 0;
    color: var(--fg);
    transition: background 0.15s;
  }
  .stat:hover {
    background: var(--hover);
    text-decoration: none;
  }
  .stat b {
    font-size: 32px;
    font-weight: 500;
    line-height: 1.2;
    color: var(--strong);
    font-variant-numeric: tabular-nums;
  }
  .stat span {
    color: var(--muted);
  }
  /* a figure that leads nowhere */
  div.stat:hover {
    background: var(--card);
  }
  .badge {
    display: inline-block;
    padding: 0 8px;
    border: 1px solid currentColor;
    border-radius: 3px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
  }
  /* a label is its color as text and outline, with no fill; the bar's parts are filled with it */
  .badge.confident,
  .bar .confident {
    color: var(--ok);
  }
  .badge.needsReview,
  .bar .needsReview {
    color: var(--warn);
  }
  .badge.plainMock,
  .bar .plainMock {
    color: var(--plain);
  }
  .bar {
    display: flex;
    gap: 2px;
    height: 10px;
    border-radius: 0;
    overflow: hidden;
  }
  .bar span {
    flex-basis: 0;
    background: currentColor;
    border-radius: 0;
  }
  .legend {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px 20px;
    margin: 0;
  }
  .legend dt {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .legend dd {
    margin: 4px 0 0;
    color: var(--muted);
    font-size: 12.5px;
  }
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .chips a {
    display: inline-flex;
    gap: 8px;
    padding: 3px 10px;
    border: 1px solid #616779;
    border-radius: 3px;
    color: var(--fg);
  }
  .chips a:hover {
    border-color: var(--muted);
    color: var(--strong);
    text-decoration: none;
  }
  .tabs {
    display: flex;
    gap: 4px;
    border-bottom: 1px solid var(--line);
  }
  .tabs a {
    padding: 6px 12px;
    color: var(--muted);
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
  }
  .tabs a:hover {
    text-decoration: none;
    color: var(--strong);
  }
  .tabs a.current {
    color: var(--strong);
    border-bottom-color: var(--accent-text);
  }
  .tag {
    display: inline-block;
    padding: 0 6px;
    border: 1px solid var(--border);
    border-radius: 4px;
    font-size: 11.5px;
    color: var(--muted);
    white-space: nowrap;
  }
  .facts {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .wrap {
    overflow-wrap: anywhere;
  }
  h1 code {
    font-size: 0.85em;
  }
  pre.sample {
    max-height: 360px;
    overflow: auto;
    padding: 12px;
    border-radius: 3px;
    background: var(--inset);
  }
  .segmented {
    display: inline-flex;
  }
  .segmented button {
    border-radius: 0;
    margin-left: -1px;
  }
  .segmented button:first-child {
    border-radius: 3px 0 0 3px;
    margin-left: 0;
  }
  .segmented button:last-child {
    border-radius: 0 3px 3px 0;
  }
  .segmented button.current {
    background: var(--card);
    color: var(--strong);
    box-shadow: inset 0 -2px 0 var(--primary);
  }
  .check {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
  }

  /* Resources: a list of resources beside the records of one */
  .split {
    display: flex;
    gap: 20px;
    min-height: 0;
  }
  .list {
    flex: 0 0 210px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    align-self: flex-start;
    padding: 6px 0;
    border-radius: 3px;
    background: var(--sidebar);
  }
  .list a {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    padding: 7px 12px;
    border-left: 3px solid transparent;
    color: var(--fg);
  }
  .list a:hover {
    color: var(--strong);
    text-decoration: none;
  }
  .list a.current {
    background: var(--card);
    color: var(--strong);
    border-left-color: var(--primary);
  }
  /* a resource that needs review: a dot beside its name, the reason on hover */
  .list .review-dot {
    position: relative;
    flex: none;
    width: 7px;
    height: 7px;
    margin-left: auto;
    border-radius: 50%;
    background: var(--warn);
    align-self: center;
  }
  .list .name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .pane {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /*
   * Resources: one panel below the title, like a small app of its own. The list of resources on the left (the
   * darker side, as the app's sidebar), the tabs and the filter on one row, the records under them; each part
   * scrolls on its own, so the records stay in view. A selected record opens in a drawer over the table.
   */
  .split.resources {
    flex: 1 1 0;
    min-height: 360px;
    gap: 0;
    border-radius: 3px;
    overflow: hidden;
    background: var(--card);
  }
  .split.resources > .list {
    /* positioned, so what is placed inside it (a visually hidden label) scrolls and clips with it, and never
       makes the page taller than the window */
    position: relative;
    align-self: stretch;
    overflow-y: auto;
    border-radius: 0;
    box-shadow: inset -1px 0 0 var(--line);
  }
  .split.resources > .pane {
    min-height: 0;
    gap: 0;
  }
  .split.resources .toolbar {
    flex: none;
    gap: 8px 16px;
    padding: 0 16px;
    min-height: 52px;
    border-bottom: 1px solid var(--line);
  }
  .toolbar .tabs {
    align-self: stretch;
    border-bottom: 0;
  }
  .toolbar .tabs a {
    display: flex;
    align-items: center;
    margin-bottom: 0;
  }
  .toolbar input[type="search"] {
    width: 240px;
  }
  .split.resources .pager,
  .split.resources .pane > .empty {
    padding: 0 16px 12px;
  }
  .records-body,
  .pane-body {
    flex: 1 1 0;
    min-height: 0;
  }
  .pane > .records-body,
  .pane > .pane-body {
    flex-shrink: 1;
  }
  .records-body {
    position: relative;
    display: flex;
  }
  .scroll-frame {
    position: relative;
    flex: 1 1 0;
    min-width: 0;
    display: flex;
  }
  .scroll-frame > .scroll.records {
    flex: 1 1 0;
    min-width: 0;
    max-height: none;
    border-radius: 0;
  }
  /* columns scrolled under the pinned key column: a shadow along its edge, the whole height of the table */
  .scroll-frame::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: var(--key-width, 0);
    width: 12px;
    pointer-events: none;
    background: linear-gradient(to right, rgb(0 0 0 / 40%), transparent);
    opacity: 0;
    transition: opacity 0.15s;
    z-index: 4;
  }
  .scroll-frame.scrolled-x::before {
    opacity: 1;
  }
  /* columns hidden on the right: a shadow at that edge says the table goes on */
  .scroll-frame::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 16px;
    pointer-events: none;
    background: linear-gradient(to left, rgb(0 0 0 / 40%), transparent);
    opacity: 0;
    transition: opacity 0.15s;
    z-index: 4;
  }
  .scroll-frame.more-x::after {
    opacity: 1;
  }
  /*
   * A selected record: a drawer over the right of the table, one surface with a shadow. Its content scrolls under
   * a close button that floats in the top-right corner.
   */
  .records-body > .drawer {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 6;
    width: min(420px, 90%);
    background: var(--card);
    box-shadow: -10px 0 24px rgb(0 0 0 / 45%);
  }
  /* an operation's response sample: the same drawer, over the right of the page below the header; it stays put
     while the page scrolls */
  .response-drawer {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 6;
    width: min(520px, 92%);
    background: var(--card);
    box-shadow: -10px 0 24px rgb(0 0 0 / 45%);
  }
  .response-drawer h3 {
    margin: 4px 48px 8px 0;
  }
  .response-drawer pre.sample {
    margin: 12px 0 0;
    padding: 0;
    border-radius: 0;
    background: none;
  }
  .drawer-body {
    height: 100%;
    overflow: auto;
    padding: 16px 20px;
  }
  .records-body .drawer pre {
    margin: 0;
    padding: 0;
    border-radius: 0;
    background: none;
  }
  .drawer .close {
    position: absolute;
    top: 10px;
    right: 14px;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    padding: 0;
    border-radius: 50%;
    background: var(--hover);
    border-color: var(--border);
    box-shadow: 0 2px 8px rgb(0 0 0 / 35%);
  }
  .drawer .close .icon {
    width: 14px;
    height: 14px;
  }
  .pane-body {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 16px;
    overflow-y: auto;
  }
  .pane-body > * {
    flex-shrink: 0;
  }
  /* what a resource with no fields is instead */
  .empty-shape {
    max-width: 760px;
  }
  .empty-shape p {
    margin: 0 0 8px;
  }
  /* inside the panel a card is a part of it: a step darker, so it still reads as a group */
  .pane-body .card {
    background: color-mix(in oklab, var(--surface), white 3%);
  }

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
    color: var(--accent-text);
  }
  .clean {
    color: var(--ok);
  }
  /* The Dashboard's Lint card: the ring and the counts on the left, one aligned table of categories beside them */
  .lint-card-body {
    display: grid;
    grid-template-columns: 200px minmax(0, 1fr);
    gap: 24px;
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
    gap: 18px;
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
    color: var(--accent-text);
  }
  table.lint-categories td,
  table.lint-categories th {
    padding-top: 7px;
    padding-bottom: 7px;
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
  /* in a cell the bar is a block of the cell's width (it is inline, sized by a grid, elsewhere) */
  table.lint-categories .meter {
    display: block;
  }
  table.lint-categories a {
    color: var(--strong);
  }
  table.lint-categories tr.opens {
    cursor: pointer;
  }
  table.lint-categories tbody tr:hover td {
    background: var(--hover);
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
  .lint-total b {
    margin-right: 4px;
    font-size: 32px;
    font-weight: 500;
    line-height: 1.2;
    color: var(--strong);
  }
  .lint-rows {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .lint-rows.columns {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 2px 24px;
    margin: 0 -12px;
  }
  .lint-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 70px 38px minmax(84px, auto);
    align-items: center;
    gap: 10px;
    padding: 6px 12px 6px 9px;
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
  .lint-row.rule {
    font-size: 12.5px;
    color: var(--fg);
  }
  .lint-row.rule .label {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    overflow-wrap: anywhere;
  }
  /* The Lint section's list: one set of columns for every row, so the meters line up, rules included */
  .side.lint-rows {
    display: grid;
    grid-template-columns: 14px minmax(0, 1fr) 70px 38px auto;
    gap: 2px 10px;
  }
  .side.lint-rows .lint-row,
  .lint-rules {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
  }
  .lint-rules {
    row-gap: 2px;
    padding: 4px 0;
    background: var(--inset);
  }
  .lint-rules .label {
    padding-left: 10px;
  }
  .lint-rules .meter {
    background: var(--line);
  }
  .lint-rules .meter span {
    background: color-mix(in srgb, var(--ok) 60%, var(--inset));
  }
  .arrow {
    display: flex;
    margin-left: -4px;
    color: var(--muted);
  }
  .arrow .icon {
    width: 14px;
    height: 14px;
    transition: transform 0.12s;
  }
  .lint-row.open .arrow .icon {
    transform: rotate(90deg);
  }
  .lint-row:hover .arrow {
    color: var(--strong);
  }
  .meter {
    height: 6px;
    border-radius: 0;
    background: var(--inset);
    overflow: hidden;
  }
  .meter span {
    display: block;
    height: 100%;
    background: var(--ok);
  }
  .share,
  .found {
    text-align: right;
    font-size: 12.5px;
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
  .split.lint {
    display: grid;
    grid-template-columns: 400px minmax(0, 1fr);
    /* the top row keeps one height whatever is picked, so the lists below never move */
    grid-template-rows: 84px auto;
    grid-template-areas:
      "head controls"
      "side pane";
    align-items: stretch;
    gap: 14px 20px;
    min-height: calc(100vh - 80px);
    align-content: start;
  }
  .split.lint > .lint-head {
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
  .split.lint > .lint-controls {
    grid-area: controls;
  }
  .split.lint > .side {
    grid-area: side;
    align-self: start;
    padding: 8px 0;
  }
  .split.lint > .pane {
    grid-area: pane;
    align-self: start;
  }
  /* what was found, level with the name; the filters at the bottom, level with the top of the lists */
  .lint-controls {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 8px;
  }
  .lint-controls .row {
    flex-wrap: nowrap;
    gap: 10px;
  }
  .lint-controls input[type="search"] {
    flex: 1 1 140px;
    min-width: 0;
    width: auto;
  }
  .lint-controls .segmented button {
    padding-left: 10px;
    padding-right: 10px;
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
    gap: 20px;
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
    gap: 10px;
  }
  .segments {
    display: flex;
    gap: 2px;
    height: 8px;
  }
  .segments span {
    flex-basis: 0;
    min-width: 3px;
    border-radius: 0;
  }
  .lint-stat .key {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 4px 14px;
    font-size: 12.5px;
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
    gap: 4px;
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
    padding: 10px 20px;
    border-bottom: 1px solid var(--line);
  }
  .findings li:last-child {
    border-bottom: 0;
  }
  .findings .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 10px;
    font-size: 12.5px;
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
    .split.lint {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: none;
      grid-template-areas: "head" "side" "controls" "pane";
    }
  }

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
    padding: 9px 12px;
    text-align: left;
    border-bottom: 1px solid var(--line);
    vertical-align: top;
  }
  table > :last-child > tr:last-child > * {
    border-bottom: 0;
  }
  thead th {
    background: var(--card);
    color: var(--strong);
    font-weight: 700;
    white-space: nowrap;
    border-bottom-color: var(--border);
  }
  th button {
    border: 0;
    background: none;
    padding: 0;
    font-weight: 700;
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
    max-height: max(260px, calc(100vh - 290px));
  }
  /* A table that fills the rest of the page and scrolls on its own: the page's title, its filters and the
     table's header stay in view */
  .scroll.fill {
    flex: 1 1 0;
    min-height: 260px;
    overflow: auto;
  }
  .fill thead th {
    position: sticky;
    top: 0;
    z-index: 2;
  }
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
    color: var(--strong);
    box-shadow: inset -1px 0 0 var(--line);
  }
  .records thead .key {
    z-index: 3;
    background: var(--card);
  }
  .records tbody tr:hover .key,
  .records tbody tr.current .key {
    background: var(--hover);
  }
  .records tbody tr.current .key {
    box-shadow:
      inset 3px 0 0 var(--primary),
      inset -1px 0 0 var(--line);
  }
  /* the pinned key column: a bright edge always, and a shadow on the columns under it once they scroll */
  .records .key,
  .records thead .key {
    box-shadow: inset -2px 0 0 var(--key-edge);
  }
  .records tbody tr.current .key {
    box-shadow:
      inset 3px 0 0 var(--primary),
      inset -2px 0 0 var(--key-edge);
  }
  .records thead .tag {
    margin-left: 4px;
    font-weight: 400;
  }
  td.none,
  td.json {
    color: var(--muted);
  }
  tbody tr[tabindex] {
    cursor: pointer;
  }
  tbody tr[tabindex]:hover,
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
  table.operations tr.opens td,
  table.operations tr.opens th.group {
    cursor: pointer;
  }
  /* the path stands for all its operations: hovering it lights them all */
  table.operations tbody:has(th.group:hover) td,
  table.operations tbody:has(th.group:hover) th.group {
    background: var(--hover);
  }
  table.operations .path-link {
    color: var(--strong);
  }
  table.operations .path-link:hover {
    color: var(--accent-text);
    text-decoration: none;
  }
  table.operations th.group {
    vertical-align: top;
    min-width: 220px;
    color: var(--strong);
    font-weight: 500;
    text-align: left;
    overflow-wrap: break-word;
    white-space: normal;
    border-right: 1px solid var(--line);
  }
  table.operations tbody + tbody {
    border-top: 1px solid var(--border);
  }
  /* the operation under the pointer: its own cells, not the path beside it, which stands for every operation of
     the path (it belongs to the first row's markup, so a row's :hover would light that row from anywhere on it) */
  table.operations tbody tr:has(td:hover) td {
    background: var(--hover);
  }
  .op-title {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
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
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
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
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 12.5px;
    overflow-wrap: anywhere;
    max-width: 220px;
    color: var(--muted);
  }
  /* The Schema tab's fields: an object field opens to its own fields, indented on a darker band per level */
  table.fields td.field {
    padding-left: calc(8px + var(--depth, 0) * 22px);
    white-space: nowrap;
  }
  .expander,
  .expander-space {
    display: inline-flex;
    width: 20px;
    height: 20px;
    margin-right: 4px;
    vertical-align: middle;
  }
  .expander {
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    background: none;
    color: var(--muted);
  }
  .expander:hover {
    color: var(--strong);
  }
  .expander .icon {
    width: 14px;
    height: 14px;
    transition: transform 0.12s;
  }
  .expander.open .icon {
    transform: rotate(90deg);
  }
  table.fields tr.nested td {
    background: var(--inset);
  }
  table.fields tr.depth-2 td,
  table.fields tr.depth-3 td {
    background: color-mix(in oklab, var(--inset), black 12%);
  }
  td.seeded {
    min-width: 200px;
  }
  td.why {
    color: var(--muted);
    min-width: 180px;
  }
  /* an HTTP method as colored text: RapiDoc's hues, lightened to 4.5:1 or more on a card; the name is always written */
  .method {
    --m: var(--plain);
    display: inline-block;
    min-width: 52px;
    color: var(--m);
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 12.5px;
    font-weight: 700;
    letter-spacing: 0.02em;
  }
  .method.get {
    --m: #8ab4ff;
  }
  .method.post {
    --m: #7dd8a8;
  }
  .method.put {
    --m: #f7b03c;
  }
  .method.patch {
    --m: #c4b5fd;
  }
  .method.delete {
    --m: #ff9696;
  }
  .method.head {
    --m: #eab308;
  }
  .method.options {
    --m: #22d3ee;
  }
  .method.query {
    --m: #a5b4fc;
  }
  .detail pre {
    padding: 12px;
    border-radius: 3px;
    background: var(--inset);
  }
  pre {
    margin: 0;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }

  @media (max-width: 760px) {
    /* Lint's filter takes a line of its own over the severity buttons */
    .lint-controls .row {
      flex-wrap: wrap;
    }
    .lint-controls input[type="search"] {
      flex-basis: 100%;
    }
    .menu {
      display: inline-block;
      margin-left: 12px;
    }
    .brand {
      width: auto;
      min-height: 48px;
      padding: 0 16px;
      order: -1;
    }
    header {
      padding-bottom: 8px;
    }
    .sidebar {
      display: none;
    }
    .sidebar.open {
      display: flex;
      position: absolute;
      z-index: 2;
      top: 0;
      left: 0;
      bottom: 0;
      box-shadow: 4px 0 16px rgb(0 0 0 / 45%);
    }
    .shell {
      position: relative;
    }
    main {
      padding: 16px;
    }
    .split {
      flex-direction: column;
    }
    .list {
      flex: none;
      flex-direction: row;
      flex-wrap: wrap;
      align-self: stretch;
    }
    /* one page that scrolls as a whole: the boxes of the wide layout would be too small */
    .split.resources {
      flex: none;
    }
    .split.resources > .list {
      overflow: visible;
    }
    .records-body {
      flex-direction: column;
    }
    .scroll-frame {
      flex: none;
    }
    .scroll-frame > .scroll.records {
      flex: none;
      max-height: 70vh;
    }
    .records-body > .drawer {
      position: relative;
      width: auto;
      box-shadow: none;
      border-top: 1px solid var(--line);
    }
    .drawer-body {
      height: auto;
    }
    .pane-body {
      overflow: visible;
    }
    .session span {
      display: none;
    }
    .session input {
      width: 110px;
    }
    select.api {
      max-width: 160px;
    }
  }
`;
