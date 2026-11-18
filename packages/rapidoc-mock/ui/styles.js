import { css } from "lit";

/**
 * The Mock UI's styles: one dark theme, in the manner of a monitoring console. Slate surfaces without borders,
 * white headings over grey text, and RapiDoc's amber as the one accent (the brand block, the place you are, the
 * main action). Label colors come with text: a label is never told by color alone.
 */
export const styles = css`
  :host {
    --bg: #2f323b;
    --sidebar: #24262d;
    /* a panel on the page; opaque, so a sticky cell can use it */
    --card: #3a3c45;
    --hover: #444751;
    --inset: #282a32;
    --border: #4a4e5b;
    --line: #41444e;
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
    flex: 1;
    display: flex;
    min-height: 0;
  }
  .sidebar {
    flex: 0 0 210px;
    display: flex;
    flex-direction: column;
    padding: 12px 0 16px;
    background: var(--sidebar);
    overflow-y: auto;
  }
  .sidebar h2 {
    margin: 0;
    padding: 12px 15px 6px 25px;
    font-size: 14.5px;
    font-weight: 400;
    color: var(--strong);
  }
  .sidebar a {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 15px 8px 22px;
    border-left: 3px solid transparent;
    color: var(--fg);
    transition:
      color 0.15s,
      background 0.15s;
  }
  .sidebar a:hover {
    color: var(--strong);
    text-decoration: none;
  }
  .sidebar a.current {
    color: var(--strong);
    border-left-color: var(--primary);
    background: #1e2026;
  }
  .sidebar a.current .icon {
    color: var(--primary);
  }
  main {
    flex: 1;
    min-width: 0;
    overflow-y: auto;
    padding: 24px 30px 40px;
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
    border-radius: 3px;
    overflow: hidden;
  }
  .bar span {
    flex-basis: 0;
    background: currentColor;
    border-radius: 2px;
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
  .review {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .review li {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .review span {
    color: var(--muted);
  }
  .review code {
    overflow-wrap: anywhere;
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
  table.operations td.path,
  table.plain td.path {
    overflow-wrap: anywhere;
    min-width: 220px;
  }
  tr.group th {
    background: var(--inset);
    color: var(--strong);
    font-weight: 500;
    overflow-wrap: anywhere;
  }
  tr.group .count {
    margin-left: 8px;
    font-weight: 400;
  }
  td.example {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 12.5px;
    overflow-wrap: anywhere;
    max-width: 220px;
    color: var(--muted);
  }
  td.seeded {
    min-width: 200px;
  }
  td.why {
    color: var(--muted);
    min-width: 180px;
  }
  .method {
    font-weight: 700;
    font-size: 12px;
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
