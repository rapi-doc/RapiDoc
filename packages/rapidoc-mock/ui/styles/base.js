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
  input,
  select {
    font: inherit;
    color: inherit;
  }
  /* Controls in the manner of <rapi-doc>: buttons and tabs in semibold small caps, joined buttons with an
     amber current one, a select with its own caret, a checkbox as a switch that turns green */
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
  :focus-visible {
    outline: 2px solid var(--accent-text);
    outline-offset: 2px;
  }
  input[type="text"],
  input[type="search"],
  input[type="number"],
  select {
    padding: var(--space-1) var(--space-2);
    border: 1px solid var(--border);
    border-radius: 3px;
    background: var(--inset);
    min-width: 0;
  }
  select {
    appearance: none;
    padding-right: var(--space-5);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256' fill='%23949ba2'%3E%3Cpath d='M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 9px center;
    background-size: 14px;
    cursor: pointer;
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
  input:focus,
  select:focus {
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
