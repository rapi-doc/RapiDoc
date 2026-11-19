import { css } from "lit";

/** The app shell: the header, the sidebar, the content area, a page's title. */
export const shell = css`
  /* The shell: a header across the top, a sidebar, and the content beside it */
  header {
    flex: none;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-2) var(--space-3);
    padding-right: var(--space-4);
    min-height: 56px;
    background: var(--sidebar);
    box-shadow: var(--shadow-bar);
    position: relative;
    z-index: 3;
  }
  /* the brand block: as wide as the sidebar under it */
  .brand {
    align-self: stretch;
    display: flex;
    align-items: center;
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
    gap: var(--space-2);
  }
  .session input {
    width: 140px;
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
    font-size: 15px;
    font-weight: 500;
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
