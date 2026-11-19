import { css } from "lit";

/** Narrow screens: one column, the sidebar as a menu. */
export const narrow = css`
  @media (max-width: 760px) {
    /* Lint's filter takes a line of its own over the severity buttons */
    .lint-controls .row {
      flex-wrap: wrap;
    }
    .lint-controls input[type="search"] {
      flex-basis: 100%;
    }
    .menu {
      display: inline-block;
      margin-left: var(--space-3);
    }
    .brand {
      width: auto;
      min-height: 48px;
      padding: 0 var(--space-4);
      order: -1;
    }
    header {
      padding-bottom: var(--space-2);
    }
    .sidebar {
      display: none;
    }
    .sidebar.open {
      display: flex;
      position: absolute;
      z-index: 2;
      top: 0;
      left: 0;
      bottom: 0;
      box-shadow: 4px 0 16px rgb(0 0 0 / 45%);
    }
    .shell {
      position: relative;
    }
    main {
      padding: var(--space-4);
    }
    .resources-panel {
      flex-direction: column;
    }
    .list {
      flex: none;
      flex-direction: row;
      flex-wrap: wrap;
      align-self: stretch;
    }
    /* one page that scrolls as a whole: the boxes of the wide layout would be too small */
    .resources-panel {
      flex: none;
    }
    .resources-panel > .list {
      overflow: visible;
    }
    .records-body {
      flex-direction: column;
    }
    .scroll-frame {
      flex: none;
    }
    .scroll-frame > .scroll.records {
      flex: none;
      max-height: 70vh;
    }
    .records-body > .drawer {
      position: relative;
      width: auto;
      box-shadow: none;
      border-top: 1px solid var(--line);
    }
    /* a record's drawer is as tall as the record here, under the table; a response's still covers the page
       and scrolls inside */
    .records-body > .drawer .drawer-body {
      height: auto;
    }
    .pane-body {
      overflow: visible;
    }
    .session span {
      display: none;
    }
    .session input {
      width: 110px;
    }
    .select.api {
      width: 160px;
    }
  }
`;
