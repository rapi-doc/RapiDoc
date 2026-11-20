import { css } from "lit";

/** The app shell: the header, the sidebar, the content area, a page's title. */
export const shell = css`
  /* The shell: a header across the top, a sidebar, and the content beside it */
  header {
    flex: none;
    display: flex;
    /* one row on any screen wider than a phone's: the API picker and the session field give up their room
       first, the brand block and the buttons never (narrow.js lets it wrap on a phone) */
    flex-wrap: nowrap;
    align-items: center;
    gap: var(--space-2) var(--space-3);
    padding-right: var(--space-4);
    min-height: 56px;
    background: var(--sidebar);
    position: relative;
    z-index: 3;
  }
  /* the brand block: as wide as the sidebar under it */
  .brand {
    align-self: stretch;
    display: flex;
    align-items: center;
    flex: none;
    width: 210px;
    padding: 0 var(--space-5);
    margin-right: var(--space-2);
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
  .select.api {
    flex: 0 1 280px;
    min-width: 140px;
  }
  header > button {
    flex: none;
  }
  header .session span {
    color: var(--muted);
  }
  .session {
    flex: 0 1 auto;
    display: flex;
    align-items: center;
    gap: var(--space-2);
    min-width: 0;
  }
  .session input {
    flex: 0 1 140px;
    width: 140px;
    min-width: 96px;
  }
  /* Where the row is short, the word "Session" goes from sight: the field's placeholder and title say what it
     is, and the word stays its name for a screen reader */
  @media (max-width: 1100px) {
    header .session span {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
  }
  .icon-button {
    padding: 6px var(--space-2);
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
    padding: 6px 0 var(--space-4);
    background: var(--sidebar);
    overflow-y: auto;
  }
  .sidebar h2 {
    margin: 0;
    padding: var(--space-5) var(--space-4) var(--space-2) var(--space-5);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--strong);
  }
  .sidebar a {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4) var(--space-2) var(--space-5);
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
    /* what is placed out of the flow inside it (a label only a screen reader reads) scrolls with it, and
       never makes the page itself scroll */
    position: relative;
    flex: 1;
    min-width: 0;
    overflow-y: auto;
    padding: var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
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
    padding-bottom: var(--space-4);
    border-bottom: 1px solid var(--line);
  }
  /* how many there are, beside a page's title: a figure in the muted color, not a badge (a badge asks for a look) */
  .title-count {
    margin-left: var(--space-1);
    color: var(--muted);
    font-size: 16px;
    font-weight: 400;
    font-variant-numeric: tabular-nums;
  }
  .title p {
    color: var(--muted);
    margin-top: var(--space-1);
  }
  /* a page's mark: its section's icon, large and in the accent, at the right of the title */
  .title.with-icon {
    display: flex;
    align-items: center;
    gap: var(--space-4);
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
    padding: var(--space-2) var(--space-3);
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
    padding: var(--space-5) 0;
  }
`;
