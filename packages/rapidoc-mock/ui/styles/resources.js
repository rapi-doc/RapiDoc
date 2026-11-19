import { css } from "lit";

/** The Resources panel: the list, the toolbar, the records with their drawer, the Schema tab's body. */
export const resources = css`
  /*
   * Resources: one panel below the title, like a small app of its own. The list of resources on the left (the
   * darker side, as the app's sidebar), the tabs and the filter on one row, the records under them; each part
   * scrolls on its own, so the records stay in view. A selected record opens in a drawer over the table.
   */
  .resources-panel {
    display: flex;
    flex: 1 1 0;
    min-height: 360px;
    gap: 0;
    border-radius: 3px;
    overflow: hidden;
    background: var(--card);
  }
  .resources-panel > .list {
    /* positioned, so what is placed inside it (a visually hidden label) scrolls and clips with it, and never
       makes the page taller than the window */
    position: relative;
    align-self: stretch;
    overflow-y: auto;
    border-radius: 0;
    box-shadow: inset -1px 0 0 var(--line);
  }
  .resources-panel > .pane {
    min-height: 0;
    gap: 0;
  }
  .resources-panel .toolbar {
    flex: none;
    gap: var(--space-2) var(--space-4);
    padding: 0 var(--space-4);
    min-height: 52px;
    border-bottom: 1px solid var(--line);
  }
  .toolbar .tabs {
    align-self: stretch;
    border-bottom: 0;
  }
  .toolbar .tabs a {
    display: flex;
    align-items: center;
    margin-bottom: 0;
  }
  .toolbar input[type="search"] {
    width: 240px;
  }
  .resources-panel .pager,
  .resources-panel .pane > .empty {
    padding: 0 var(--space-4) var(--space-3);
  }
  .records-body,
  .pane-body {
    flex: 1 1 0;
    min-height: 0;
  }
  .pane > .records-body,
  .pane > .pane-body {
    flex-shrink: 1;
  }
  /* not positioned: a record's drawer is placed by the app shell, over the page's whole height */
  .records-body {
    display: flex;
  }
  .scroll-frame {
    position: relative;
    flex: 1 1 0;
    min-width: 0;
    display: flex;
  }
  .scroll-frame > .scroll.records {
    flex: 1 1 0;
    min-width: 0;
    max-height: none;
    border-radius: 0;
  }
  /* columns scrolled under the pinned key column: a shadow along its edge, the whole height of the table */
  .scroll-frame::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: var(--key-width, 0);
    width: 12px;
    pointer-events: none;
    background: linear-gradient(to right, var(--shade), transparent);
    opacity: 0;
    transition: opacity 0.15s;
    z-index: 4;
  }
  .scroll-frame.scrolled-x::before {
    opacity: 1;
  }
  /* columns hidden on the right: a shadow at that edge says the table goes on */
  .scroll-frame::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 16px;
    pointer-events: none;
    background: linear-gradient(to left, var(--shade), transparent);
    opacity: 0;
    transition: opacity 0.15s;
    z-index: 4;
  }
  .scroll-frame.more-x::after {
    opacity: 1;
  }
  /*
   * A drawer (components/parts.js) over the right of the positioned box it is in: one surface with a shadow. Its
   * content scrolls under a close button that floats in the top-right corner.
   */
  .drawer {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 6;
    width: min(var(--drawer-width, 420px), 92%);
    background: var(--card);
    box-shadow: var(--shadow-drawer);
  }
  /* an operation's response sample: wider, over the right of the page below the header */
  .drawer.response {
    --drawer-width: 520px;
  }
  .drawer h3 {
    margin: var(--space-1) 48px var(--space-2) 0;
  }
  .drawer-body {
    height: 100%;
    overflow: auto;
    padding: var(--space-4) var(--space-5);
  }
  /* what a drawer shows is on its surface: no panel inside the panel */
  .drawer .drawer-body pre {
    margin: 0;
    padding: 0;
    border-radius: 0;
    background: none;
  }
  /* a sample in a drawer is as long as it is: the drawer scrolls, to its bottom */
  .drawer .drawer-body pre.sample {
    max-height: none;
    overflow: visible;
    margin-top: var(--space-3);
  }
  .drawer .close {
    position: absolute;
    top: 10px;
    right: 14px;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    padding: 0;
    border-radius: 50%;
    background: var(--hover);
    border-color: var(--border);
    box-shadow: 0 2px 8px rgb(0 0 0 / 35%);
  }
  .drawer .close .icon {
    width: 14px;
    height: 14px;
  }
  .pane-body {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    padding: var(--space-4);
    overflow-y: auto;
  }
  .pane-body > * {
    flex-shrink: 0;
  }
  /* what a resource with no fields is instead */
  .empty-shape {
    max-width: 760px;
  }
  .empty-shape p {
    margin: 0 0 var(--space-2);
  }
  /* inside the panel a card is a part of it: a step darker, so it still reads as a group */
  .pane-body .card {
    background: color-mix(in oklab, var(--surface), white 3%);
  }
`;
