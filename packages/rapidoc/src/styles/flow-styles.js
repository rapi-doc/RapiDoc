import { css } from "lit";

/**
 * Styles for the workflow diagram drawn by utils/arazzo/svg.js. Shared by <rapi-flow> and by
 * build-time pages (@rapidoc/prerender `getFlowCss()`), so selectors are plain classes, not :host.
 */
export default css`
  /* Private: the step color, and the color of each kind of action line with the text that sits on
     it. A kind class (rf-success, rf-failure, rf-retry) sets them on lines, arrowheads, line
     labels and END pills alike */
  .rf-svg {
    --rf-step: color-mix(in srgb, var(--primary) 65%, var(--foreground));
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
    fill: var(--rf-step);
    font-weight: 600;
    font-size: var(--font-size-regular);
  }
  .rf-sub {
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
  .rf-jump,
  .rf-clickable {
    cursor: pointer;
    outline: none;
  }
  .rf-jump:hover .rf-step-name,
  .rf-jump:focus-visible .rf-step-name {
    text-decoration: underline;
  }
  /* A step box under the pointer or focus, selected, linked by hover (<rapi-flow>: a step with
     its rows in the outputs box) or running (<rapi-flow>: its request is in flight, dashed and
     moving) */
  .rf-clickable:hover rect,
  .rf-clickable:focus-visible rect,
  .rf-selected rect,
  .rf-step.rf-linked rect,
  .rf-step.rf-running rect {
    stroke: var(--primary);
    stroke-width: 2;
  }
  .rf-step.rf-running rect {
    stroke-dasharray: 6 4;
    animation: rf-march 1s linear infinite;
  }
  @keyframes rf-march {
    to {
      stroke-dashoffset: -20;
    }
  }
  /* Next step: green, as success; the lines of actions are green, red or orange too, so the
     colors explain themselves and the diagram needs no legend */
  .rf-seq {
    fill: none;
    stroke: var(--green);
    stroke-width: 1.25;
  }
  .rf-head-seq {
    fill: var(--green);
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
  .rf-src-type,
  .rf-src-url,
  .rf-kw,
  .rf-in-type,
  .rf-in-default,
  .rf-in-enum {
    font-family: var(--font-mono);
  }
  .rf-in-type,
  .rf-in-default,
  .rf-in-enum,
  .rf-src-type,
  .rf-src-url,
  .rf-out-from,
  .rf-act-name,
  .rf-more,
  .rf-tag,
  .rf-sec-title {
    fill: var(--muted-foreground);
  }
  .rf-kw {
    font-weight: 600;
  }
  /* Step names are the step color wherever they appear (box titles, value lines, outputs), and
     so is the "←" before a value from a step */
  /* --primary mixed toward the text color keeps the hue and reads at 4.5:1 on light cards */
  .rf-step-name,
  .rf-kw-step,
  .rf-from-arrow,
  .rf-row.rf-linked .rf-out-name {
    fill: var(--rf-step);
  }
  .rf-io .rf-sep {
    stroke: var(--muted-foreground);
    stroke-opacity: 0.35;
  }
  .rf-out-from {
    font-family: var(--font-mono);
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
  .rf-tag.rf-inherited {
    fill: color-mix(in srgb, var(--purple) 65%, var(--foreground));
    font-weight: 600;
  }
  .rf-sec-title {
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .rf-check-type {
    fill: var(--muted-foreground);
  }
  .rf-check-type,
  .rf-check {
    font-family: var(--font-mono);
  }
  .rf-check {
    fill: var(--foreground);
  }
  /* Dark text on green and orange, white on red */
  .rf-success {
    --rf-kind: var(--green);
    --rf-on-kind: #18181b;
  }
  .rf-failure {
    --rf-kind: var(--destructive);
    --rf-on-kind: #ffffff;
  }
  .rf-retry {
    --rf-kind: var(--orange);
    --rf-on-kind: #18181b;
  }
  .rf-goto {
    fill: none;
    stroke: var(--rf-kind);
    stroke-width: 1.5;
  }
  .rf-goto.rf-retry {
    stroke-dasharray: 5 4;
  }
  .rf-head,
  .rf-act-arrow,
  .rf-line-start {
    fill: var(--rf-kind);
  }
  /* The dot where an action line leaves its box: ringed in the card color so it stands off the
     box's border */
  .rf-line-start {
    stroke: var(--card);
    stroke-width: 1.5;
  }
  /* An action line's name, on the line, in the line's color */
  .rf-goto-label rect {
    fill: var(--rf-kind);
    stroke: none;
  }
  .rf-goto-label text {
    fill: var(--rf-on-kind);
    font-size: var(--font-size-xs);
    font-weight: 600;
  }
  /* An end action in a step box: an END pill, red on failure and green on success, as the goto
     lines. After the box's rect rules (hover, focus, a run), with the same specificity, so they
     do not restyle it */
  .rf-node rect.rf-end-pill {
    fill: var(--rf-kind);
    stroke: none;
  }
  .rf-end {
    fill: var(--rf-on-kind);
    font-size: var(--font-size-xs);
    font-weight: 700;
    letter-spacing: 0.04em;
  }
  /* The default end of a step with no failure action: an outlined END pill */
  .rf-node rect.rf-end-pill.rf-default {
    fill: none;
    stroke: var(--rf-kind);
    stroke-width: 1;
  }
  .rf-end.rf-default {
    fill: var(--rf-kind);
  }
  .rf-sec-note {
    fill: var(--muted-foreground);
    font-size: var(--font-size-xs);
    text-transform: none;
    letter-spacing: 0;
  }
`;
