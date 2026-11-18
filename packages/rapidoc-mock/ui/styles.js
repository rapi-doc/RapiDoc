import { css } from "lit";

/**
 * The Mock UI's styles. Colors follow RapiDoc's default (amber) theme in both schemes, by the reader's system
 * setting. Label colors come with text: a label is never told by color alone.
 */
export const styles = css`
  :host {
    --bg: #ffffff;
    --fg: #2a2d35;
    --muted: #5d6270;
    --card: #f5f5f6;
    --sidebar: #fafafa;
    --border: #dedfe1;
    --primary: #ff791a;
    --primary-fg: #000000;
    --accent-text: #a84a00;
    --ok: #0b6b3a;
    --ok-bg: #dff3e7;
    --warn: #7a4a00;
    --warn-bg: #fdeccb;
    --plain: #4a4f5c;
    --plain-bg: #e8e9ec;
    --error: #c81e1e;
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
    background: var(--bg);
    color: var(--fg);
    font:
      14px/1.45 system-ui,
      -apple-system,
      "Segoe UI",
      Roboto,
      sans-serif;
  }
  @media (prefers-color-scheme: dark) {
    :host {
      --bg: #30333c;
      --fg: #dfe2e7;
      --muted: #a9aebb;
      --card: #383b43;
      --sidebar: #2c2d35;
      --border: #4a4d57;
      --primary: #f6a821;
      --accent-text: #f6a821;
      --ok: #8fe0b0;
      --ok-bg: #24463a;
      --warn: #f8cf7c;
      --warn-bg: #4d3f22;
      --plain: #c8ccd6;
      --plain-bg: #454852;
      --error: #f98080;
    }
  }
  * {
    box-sizing: border-box;
  }
  h1,
  h2,
  h3 {
    margin: 0;
    font-weight: 600;
  }
  h1 {
    font-size: 22px;
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
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg);
    white-space: nowrap;
  }
  button:hover:not(:disabled) {
    border-color: var(--muted);
  }
  button:disabled {
    cursor: default;
    opacity: 0.55;
  }
  button.primary {
    background: var(--primary);
    border-color: var(--primary);
    color: var(--primary-fg);
    font-weight: 600;
  }
  :focus-visible {
    outline: 2px solid var(--accent-text);
    outline-offset: 2px;
  }
  input[type="text"],
  input[type="search"],
  input[type="number"],
  select {
    padding: 5px 9px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg);
    min-width: 0;
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
    padding: 10px 16px;
    border-bottom: 1px solid var(--border);
    background: var(--sidebar);
  }
  .brand {
    color: var(--fg);
    font-size: 16px;
    margin-right: 8px;
  }
  .brand b {
    color: var(--accent-text);
  }
  .brand:hover {
    text-decoration: none;
  }
  select.api {
    max-width: 280px;
    font-weight: 600;
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
    gap: 2px;
    padding: 6px 10px 16px;
    border-right: 1px solid var(--border);
    background: var(--sidebar);
    overflow-y: auto;
  }
  .sidebar h2 {
    margin: 14px 8px 4px;
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .sidebar a {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 10px;
    border-radius: 6px;
    color: var(--fg);
  }
  .sidebar a:hover {
    background: var(--card);
    text-decoration: none;
  }
  .sidebar a.current {
    background: var(--card);
    font-weight: 600;
    box-shadow: inset 3px 0 0 var(--accent-text);
  }
  main {
    flex: 1;
    min-width: 0;
    overflow-y: auto;
    padding: 20px 24px 40px;
    display: flex;
    flex-direction: column;
    gap: 16px;
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
  .title p {
    color: var(--muted);
    margin-top: 2px;
  }
  .banner {
    padding: 8px 12px;
    border-radius: 6px;
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
    padding: 16px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--bg);
  }
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
  }
  .stat {
    gap: 0;
    color: var(--fg);
  }
  .stat:hover {
    border-color: var(--muted);
    text-decoration: none;
  }
  .stat b {
    font-size: 28px;
    line-height: 1.2;
    font-variant-numeric: tabular-nums;
  }
  .stat span {
    color: var(--muted);
  }
  .badge {
    display: inline-block;
    padding: 1px 8px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
  }
  .badge.confident,
  .bar .confident {
    background: var(--ok-bg);
    color: var(--ok);
  }
  .badge.needsReview,
  .bar .needsReview {
    background: var(--warn-bg);
    color: var(--warn);
  }
  .badge.plainMock,
  .bar .plainMock {
    background: var(--plain-bg);
    color: var(--plain);
  }
  .bar {
    display: flex;
    gap: 2px;
    height: 14px;
    border-radius: 7px;
    overflow: hidden;
  }
  .bar span {
    flex-basis: 0;
    border: 1px solid currentColor;
    border-radius: 3px;
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
    border: 1px solid var(--border);
    border-radius: 999px;
    color: var(--fg);
  }
  .chips a:hover {
    border-color: var(--muted);
    text-decoration: none;
  }
  .tabs {
    display: flex;
    gap: 4px;
    border-bottom: 1px solid var(--border);
  }
  .tabs a {
    padding: 6px 12px;
    color: var(--muted);
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
  }
  .tabs a:hover {
    text-decoration: none;
    color: var(--fg);
  }
  .tabs a.current {
    color: var(--fg);
    font-weight: 600;
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
    border-radius: 6px;
    background: var(--card);
  }
  .segmented {
    display: inline-flex;
  }
  .segmented button {
    border-radius: 0;
    margin-left: -1px;
  }
  .segmented button:first-child {
    border-radius: 6px 0 0 6px;
    margin-left: 0;
  }
  .segmented button:last-child {
    border-radius: 0 6px 6px 0;
  }
  .segmented button.current {
    background: var(--card);
    font-weight: 600;
    box-shadow: inset 0 -2px 0 var(--accent-text);
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
  }
  .list a {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    padding: 6px 10px;
    border-radius: 6px;
    color: var(--fg);
  }
  .list a:hover {
    background: var(--card);
    text-decoration: none;
  }
  .list a.current {
    background: var(--card);
    font-weight: 600;
    box-shadow: inset 3px 0 0 var(--accent-text);
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
    border: 1px solid var(--border);
    border-radius: 8px;
  }
  table {
    border-collapse: collapse;
    width: 100%;
  }
  th,
  td {
    padding: 6px 10px;
    text-align: left;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
  }
  table > :last-child > tr:last-child > * {
    border-bottom: 0;
  }
  thead th {
    background: var(--card);
    font-weight: 600;
    white-space: nowrap;
  }
  th button {
    border: 0;
    background: none;
    padding: 0;
    font-weight: 600;
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
    background: var(--bg);
    box-shadow: inset -1px 0 0 var(--border);
  }
  .records thead .key {
    z-index: 3;
    background: var(--card);
  }
  .records tbody tr:hover .key,
  .records tbody tr.current .key {
    background: var(--card);
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
    background: var(--card);
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
    background: var(--sidebar);
    font-weight: 600;
    border-top: 1px solid var(--border);
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
  .detail {
    background: var(--card);
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
      box-shadow: 4px 0 16px rgb(0 0 0 / 25%);
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
