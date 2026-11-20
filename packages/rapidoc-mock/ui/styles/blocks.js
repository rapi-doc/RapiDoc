import { css } from "lit";

/** What sections are built from: cards, figures, badges, bars, tabs, button groups. */
export const blocks = css`
  /* Building blocks of the views */
  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-2) var(--space-3);
  }
  /* Labelled fields with their button: each field is a name, the field and a note under it, in columns, and the
     button sits on the fields' row whatever is over or under them */
  .field-row {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: auto auto auto;
    justify-content: start;
    align-items: center;
    gap: var(--space-1) var(--space-3);
  }
  .field-row > .stack {
    display: contents;
  }
  .field-row > button {
    grid-row: 2;
  }
  .row input[type="search"] {
    width: 260px;
    max-width: 100%;
  }
  .stack {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
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
    gap: var(--space-3);
    padding: var(--space-4) var(--space-5) var(--space-4);
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
    gap: var(--space-4);
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
    padding: 0 var(--space-2);
    border: 1px solid currentColor;
    border-radius: 3px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
  }
  /* a label is its color as text and outline, with no fill (its part of a bar is filled with it: labels.js) */
  .badge.confident {
    color: var(--ok);
  }
  .badge.needsReview {
    color: var(--warn);
  }
  .badge.plainMock {
    color: var(--plain);
  }
  /*
   * A bar split into parts (components/parts.js): each part as wide as its share, 2px apart, square ends. As a
   * meter it is measured against a whole: the rest of the bar is its track.
   */
  .bars {
    display: flex;
    gap: 2px;
    height: var(--bar-height, 8px);
    overflow: hidden;
  }
  .bars > span {
    flex-basis: 0;
    min-width: 3px;
  }
  .bars.meter {
    gap: 0;
    background: var(--inset);
  }
  .bars.meter > span {
    min-width: 0;
  }
  .legend {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-3) var(--space-5);
    margin: 0;
  }
  /* a label of the legend: its badge, count and share, and what it means; a link to its operations, which
     lights up under the pointer as a card that leads somewhere does */
  .legend-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    margin: calc(-1 * var(--space-2));
    padding: var(--space-2);
    border-radius: 3px;
    color: var(--fg);
    transition: background 0.15s;
  }
  a.legend-item:hover {
    background: var(--hover);
    text-decoration: none;
  }
  .legend-head {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }
  .legend-head b {
    color: var(--strong);
  }
  .legend-help {
    color: var(--muted);
    font-size: var(--small);
  }
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }
  .chips a {
    display: inline-flex;
    gap: var(--space-2);
    padding: 3px var(--space-2);
    border: 1px solid var(--border-strong);
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
    gap: var(--space-1);
    border-bottom: 1px solid var(--line);
  }
  .tabs a {
    padding: 6px var(--space-3);
    color: var(--muted);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
  }
  .tabs a:hover {
    text-decoration: none;
    color: var(--fg);
  }
  .tabs a.current {
    color: var(--accent-text);
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
  /* a note that names something to type (a header, a command): that part stands out of the grey sentence */
  .note code {
    padding: 1px 6px;
    border-radius: 3px;
    background: var(--inset);
    color: var(--fg);
    white-space: nowrap;
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
    padding: var(--space-3);
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
    position: relative;
    border-color: var(--primary);
    background: color-mix(in oklab, var(--primary) 14%, transparent);
    color: var(--accent-text);
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
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    border-left: 3px solid transparent;
    color: var(--fg);
  }
  .list a:hover {
    color: var(--strong);
    text-decoration: none;
  }
  .list a.current {
    background: var(--card);
    color: var(--accent-text);
    border-left-color: var(--primary);
  }
  /* a resource that needs review: a dot beside its name, the reason on hover */
  /* Import spec: a box to paste a spec in, and one to drop a file on */
  textarea {
    width: 100%;
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--border);
    border-radius: 3px;
    background: var(--inset);
    color: var(--fg);
    font: var(--small) / 1.5 var(--mono);
    resize: vertical;
  }
  textarea:focus {
    border-color: var(--primary);
    outline: none;
  }
  .drop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-5);
    border: 1px dashed var(--border-strong);
    border-radius: 3px;
    background: var(--inset);
    color: var(--muted);
  }
  .drop.over {
    border-color: var(--primary);
    color: var(--strong);
  }
  /* a thing the mock assumed: a dot in the Needs review color and the word, in a tag */
  .review-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: var(--warn);
  }
  .review-tag .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--warn);
  }
  /* the dot alone, beside a name in a table, and what was assumed, in that table's Needs review column */
  .review-mark {
    display: inline-block;
    width: 7px;
    height: 7px;
    margin-left: var(--space-1);
    border-radius: 50%;
    background: var(--warn);
    vertical-align: 1px;
  }
  td.to-review {
    color: var(--warn);
  }
  /* an action written as a link: it does something on the page, so it is a button */
  button.link {
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font-size: inherit;
    letter-spacing: 0;
    text-transform: none;
  }
  button.link:hover:not(:disabled) {
    color: var(--primary-hover);
    text-decoration: underline;
  }
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
    gap: var(--space-3);
  }
`;
