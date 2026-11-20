import { css, unsafeCSS } from "lit";
import { tokens } from "./tokens.js";

/** The host, the elements and the controls: type, links, buttons, fields, tabs of every section. */
export const base = css`
  :host {
    ${unsafeCSS(tokens)}
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
  /* the heading of a section of a page, as <rapi-doc>'s Request and Response: compact semibold caps. A name
     from the spec inside one (a resource, a rule) keeps its case (.keep-case). */
  main h2,
  main h3,
  main h4 {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  main h2 code,
  main h3 code,
  .keep-case {
    letter-spacing: 0;
    text-transform: none;
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
    font-family: var(--mono);
    font-size: var(--small);
  }
  button,
  input {
    font: inherit;
    color: inherit;
  }
  /* Controls in the manner of <rapi-doc>: buttons and tabs in semibold small caps, joined buttons with an
     amber current one, a select drawn by the app (components/select.js), a checkbox as a switch that turns green */
  button {
    cursor: pointer;
    padding: var(--space-1) var(--space-3);
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border: 1px solid var(--border-strong);
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
  /* the main action keeps a little weight: it is dark text on amber */
  button.primary {
    background: var(--primary);
    border-color: var(--primary);
    color: var(--primary-fg);
    font-weight: 500;
  }
  /* a button that is a column's name, an arrow or a close mark is not a labelled action: its own type */
  th button,
  button.expander,
  button.close,
  button.icon-button {
    font-size: inherit;
    letter-spacing: 0;
    text-transform: none;
  }
  button.primary:hover:not(:disabled) {
    background: var(--primary-hover);
    border-color: var(--primary-hover);
    color: var(--primary-fg);
  }
  /* A select: a button that names the choice, and its list under it, over the page */
  .select {
    position: relative;
    display: inline-block;
    min-width: 0;
  }
  .select-button {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    width: 100%;
    padding: var(--space-1) var(--space-2);
    border-color: var(--border);
    background: var(--inset);
    color: var(--strong);
    font-size: inherit;
    line-height: 18px;
    letter-spacing: 0;
    text-transform: none;
    text-align: left;
  }
  .select-button[aria-expanded="true"] {
    border-color: var(--primary);
  }
  .select-value {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .select-button .icon {
    flex: none;
    color: var(--muted);
  }
  .select-list {
    position: absolute;
    top: calc(100% + var(--space-1));
    left: 0;
    z-index: 30;
    min-width: 100%;
    max-height: min(60vh, 420px);
    margin: 0;
    padding: var(--space-1);
    overflow-y: auto;
    list-style: none;
    border: 1px solid var(--border-strong);
    border-radius: 4px;
    background: var(--card);
    box-shadow: var(--shadow-menu);
  }
  .select-list li {
    display: flex;
    align-items: baseline;
    gap: var(--space-4);
    padding: 6px var(--space-3);
    border-radius: 3px;
    white-space: nowrap;
    cursor: pointer;
  }
  .select-list li.active {
    background: var(--hover);
    color: var(--strong);
  }
  .select-list li[aria-selected="true"] .select-label {
    color: var(--accent-text);
  }
  .select-hint {
    margin-left: auto;
    color: var(--muted);
    font-family: var(--mono);
    font-size: var(--small);
  }
  :focus-visible {
    outline: 2px solid var(--accent-text);
    outline-offset: 2px;
  }
  /* a field is as tall as a button (28px), so the two line up side by side */
  input[type="text"],
  input[type="search"],
  input[type="number"],
  input[type="url"] {
    padding: var(--space-1) var(--space-2);
    border: 1px solid var(--border);
    border-radius: 3px;
    background: var(--inset);
    line-height: 18px;
    min-width: 0;
  }
  /* a checkbox is a switch: off grey, on green, its knob sliding across */
  input[type="checkbox"] {
    appearance: none;
    position: relative;
    flex: none;
    width: 30px;
    height: 16px;
    margin: 0;
    vertical-align: middle;
    background: var(--inset);
    border: 1px solid var(--border-strong);
    border-radius: 999px;
    cursor: pointer;
    transition:
      background 0.2s,
      border-color 0.2s;
  }
  input[type="checkbox"]::after {
    content: "";
    position: absolute;
    top: 1px;
    left: 1px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--fg);
    transition: transform 0.2s;
  }
  input[type="checkbox"]:checked {
    background: var(--ok);
    border-color: var(--ok);
  }
  input[type="checkbox"]:checked::after {
    transform: translateX(14px);
    background: var(--primary-fg);
  }
  @media (prefers-reduced-motion: reduce) {
    input[type="checkbox"],
    input[type="checkbox"]::after {
      transition: none;
    }
  }
  input:focus {
    border-color: var(--primary);
    outline: none;
  }
  ::placeholder {
    color: var(--placeholder);
  }
  .grow {
    flex: 1;
  }
  .hint {
    color: var(--muted);
    font-size: var(--small);
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
`;
