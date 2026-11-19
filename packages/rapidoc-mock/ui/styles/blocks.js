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
  form.row {
    align-items: flex-start;
  }
  form.row button {
    /* level with the fields: below their labels */
    margin-top: var(--space-5);
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
  .legend dt {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }
  .legend dd {
    margin: var(--space-1) 0 0;
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
  .check {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    cursor: pointer;
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
