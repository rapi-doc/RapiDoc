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
    --card: #f2f2f3;
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
    min-height: 100%;
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
    font-size: 16px;
  }
  h2 {
    font-size: 18px;
  }
  h3 {
    font-size: 15px;
  }
  code,
  pre,
  td.json,
  td.path {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 12.5px;
  }
  button,
  input {
    font: inherit;
    color: inherit;
  }
  button {
    cursor: pointer;
    padding: 5px 12px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--card);
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
  input[type="search"] {
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

  header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px 14px;
    padding: 10px 16px;
    border-bottom: 1px solid var(--border);
    background: var(--card);
  }
  .session {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: 12px;
  }
  .session input {
    width: 150px;
  }
  .banner {
    margin: 0;
    padding: 8px 16px;
    background: var(--ok-bg);
    color: var(--ok);
  }
  .banner.error {
    background: transparent;
    color: var(--error);
    border-bottom: 1px solid var(--border);
  }

  .apis {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px 16px 0;
  }
  .api {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 6px 12px;
    background: var(--bg);
  }
  .api span {
    color: var(--muted);
    font-size: 12px;
  }
  .api.current {
    border-color: var(--accent-text);
    box-shadow: inset 0 0 0 1px var(--accent-text);
  }
  .summary {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 16px;
    padding: 12px 16px;
  }
  .badge {
    display: inline-block;
    padding: 1px 8px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
  }
  .badge.confident {
    background: var(--ok-bg);
    color: var(--ok);
  }
  .badge.needsReview {
    background: var(--warn-bg);
    color: var(--warn);
  }
  .badge.plainMock {
    background: var(--plain-bg);
    color: var(--plain);
  }

  .tabs {
    display: flex;
    gap: 4px;
    padding: 0 16px;
    border-bottom: 1px solid var(--border);
  }
  .tab {
    border: 0;
    border-bottom: 2px solid transparent;
    border-radius: 0;
    background: none;
    padding: 8px 12px;
    color: var(--muted);
  }
  .tab.current {
    border-bottom-color: var(--accent-text);
    color: var(--fg);
    font-weight: 600;
  }

  .split {
    display: flex;
    flex: 1;
    min-height: 0;
  }
  .resources {
    flex: 0 0 230px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 12px 8px;
    border-right: 1px solid var(--border);
    overflow-y: auto;
  }
  .resources button {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    border: 0;
    background: none;
    text-align: left;
    padding: 6px 10px;
  }
  .resources button:hover {
    background: var(--card);
  }
  .resources button.current {
    background: var(--card);
    font-weight: 600;
    box-shadow: inset 3px 0 0 var(--accent-text);
  }
  .resources .name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .resources .count {
    color: var(--muted);
    font-variant-numeric: tabular-nums;
  }
  main {
    flex: 1;
    min-width: 0;
    padding: 14px 16px 24px;
  }
  main.empty,
  p.empty {
    color: var(--muted);
    padding: 32px 16px;
    margin: 0;
  }
  .about,
  .tools {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 14px;
    margin-bottom: 12px;
  }
  .tools input[type="search"] {
    width: 260px;
    max-width: 100%;
  }
  .check {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
  }

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
  tbody tr:last-child td {
    border-bottom: 0;
  }
  th {
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
  table.operations td {
    white-space: normal;
    max-width: none;
  }
  table.operations td.path {
    overflow-wrap: anywhere;
    min-width: 240px;
    width: 40%;
  }
  td.why {
    color: var(--muted);
    min-width: 180px;
  }
  .method {
    font-weight: 700;
    font-size: 12px;
  }
  .pager {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 12px;
  }
  .detail {
    margin-top: 16px;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px;
    background: var(--card);
  }
  pre {
    margin: 0;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
  }

  @media (max-width: 720px) {
    .split {
      flex-direction: column;
    }
    .resources {
      flex: none;
      flex-direction: row;
      flex-wrap: wrap;
      border-right: 0;
      border-bottom: 1px solid var(--border);
    }
    .session {
      margin-left: 0;
    }
    #session-help {
      display: none;
    }
  }
`;
