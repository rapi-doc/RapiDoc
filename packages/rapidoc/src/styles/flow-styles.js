import { css } from "lit";

/**
 * Styles for the workflow diagram drawn by utils/arazzo/svg.js. Shared by <rapi-flow> and by
 * build-time pages (rapidoc/static `getFlowCss()`), so selectors are plain classes, not :host.
 */
export default css`
  .rf-svg {
    display: block;
    max-width: 100%;
    height: auto;
    font-family: var(--font-sans);
    font-size: var(--font-size-description);
    overflow: visible;
  }
  .rf-node rect {
    fill: var(--card);
    stroke: var(--border);
    stroke-width: 1.25;
  }
  .rf-io rect {
    fill: var(--muted);
  }
  .rf-title {
    fill: var(--foreground);
    font-weight: 600;
    font-size: var(--font-size-regular);
  }
  .rf-sub,
  .rf-io-names {
    fill: var(--muted-foreground);
  }
  .rf-io-title,
  .rf-criteria {
    fill: var(--muted-foreground);
    font-size: var(--font-size-xs);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .rf-criteria {
    text-transform: none;
    letter-spacing: normal;
  }
  .rf-path,
  .rf-method,
  .rf-unresolved {
    font-family: var(--font-mono);
    font-size: var(--font-size-small);
  }
  .rf-path {
    fill: var(--foreground);
  }
  .rf-method {
    font-weight: 700;
    fill: var(--method-default);
  }
  .rf-method-get { fill: var(--method-get); }
  .rf-method-post { fill: var(--method-post); }
  .rf-method-put { fill: var(--method-put); }
  .rf-method-delete { fill: var(--method-delete); }
  .rf-method-patch { fill: var(--method-patch); }
  .rf-method-head { fill: var(--method-head); }
  .rf-method-options { fill: var(--method-options); }
  .rf-method-trace { fill: var(--method-trace); }
  .rf-method-query { fill: var(--method-query); }
  .rf-unresolved {
    fill: var(--muted-foreground);
    font-style: italic;
  }
  .rf-clickable {
    cursor: pointer;
    outline: none;
  }
  .rf-clickable:hover rect,
  .rf-clickable:focus-visible rect {
    stroke: var(--primary);
    stroke-width: 2;
  }
  .rf-selected rect {
    stroke: var(--primary);
    stroke-width: 2;
  }
  .rf-seq {
    fill: none;
    stroke: var(--muted-foreground);
    stroke-width: 1.25;
  }
  .rf-head-seq {
    fill: var(--muted-foreground);
  }
  .rf-data {
    fill: none;
    stroke: var(--primary);
    stroke-width: 1.5;
    stroke-dasharray: 5 4;
  }
  .rf-head-data {
    fill: var(--primary);
  }
  .rf-data.rf-to-output {
    stroke: var(--muted-foreground);
  }
  .rf-head-output {
    fill: var(--muted-foreground);
  }
  .rf-sep {
    fill: none;
    stroke: var(--border);
    stroke-width: 1;
  }
  .rf-row {
    font-size: var(--font-size-small);
  }
  .rf-in-name,
  .rf-out-name,
  .rf-bind-name,
  .rf-bind-val,
  .rf-act-when,
  .rf-act-then {
    fill: var(--foreground);
  }
  .rf-bind-name,
  .rf-bind-val,
  .rf-kw,
  .rf-in-type,
  .rf-in-default,
  .rf-in-enum {
    font-family: var(--font-mono);
  }
  .rf-in-type,
  .rf-in-default,
  .rf-in-enum,
  .rf-more,
  .rf-tag,
  .rf-sec-title {
    fill: var(--muted-foreground);
  }
  .rf-kw {
    font-weight: 600;
  }
  .rf-kw-step {
    fill: var(--primary);
  }
  .rf-kw-input {
    fill: var(--blue);
  }
  .rf-kw-value,
  .rf-kw-expression {
    fill: var(--muted-foreground);
  }
  .rf-req {
    fill: var(--destructive);
    font-size: var(--font-size-xs);
    font-weight: 600;
  }
  .rf-more,
  .rf-tag,
  .rf-sec-title {
    font-size: var(--font-size-xs);
  }
  .rf-sec-title {
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .rf-shadowed {
    opacity: 0.45;
  }
  .rf-data-label rect {
    fill: var(--background);
    stroke: var(--primary);
    stroke-width: 1;
  }
  .rf-data-label text,
  .rf-action text {
    fill: var(--foreground);
    font-size: var(--font-size-xs);
  }
  .rf-goto {
    fill: none;
    stroke-width: 1.5;
  }
  .rf-goto.rf-success {
    stroke: var(--green);
  }
  .rf-goto.rf-failure {
    stroke: var(--destructive);
  }
  .rf-head-success {
    fill: var(--green);
  }
  .rf-head-failure {
    fill: var(--destructive);
  }
  .rf-action rect {
    fill: var(--background);
    stroke-width: 1.25;
  }
  .rf-action.rf-success rect {
    stroke: var(--green);
  }
  .rf-action.rf-failure rect {
    stroke: var(--destructive);
  }
`;
