import { css } from "lit";

/**
 * Tabs: a row of text tabs over a 1px rule. The active tab's 2px underline sits on that rule.
 * Controls that belong to the whole tab set (e.g. the media-type select) go at the end of the
 * row with .tab-bar-end, flush with the right edge of the content below.
 */
export default css`
  .tab-panel {
    min-width: 0;
  }

  .tabs,
  .tab-buttons {
    display: flex;
    align-items: center;
    gap: 1.25em;
    min-height: 2.5em;
    /* The rule is an inset shadow so the active tab's underline paints over it */
    box-shadow: inset 0 -1px 0 var(--border);
    font-size: var(--font-size-small);
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .tab,
  .tab-btn {
    align-self: stretch;
    flex: none;
    margin: 0;
    padding: 0 0.125em;
    font-family: var(--font-sans);
    font-size: inherit;
    font-weight: 600;
    letter-spacing: 0.04em;
    white-space: nowrap;
    color: var(--muted-foreground);
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    border-radius: 0;
    cursor: pointer;
    transition:
      color 0.15s ease,
      border-color 0.15s ease;

    &:hover {
      color: var(--foreground);
    }

    &.tab-active,
    &.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
    }

    &:focus-visible {
      outline: 2px solid var(--ring);
      outline-offset: -2px;
    }
  }

  /* Pushed to the end of the tab row */
  .tab-bar-end {
    flex: none;
    margin-inline-start: auto;
    color: var(--muted-foreground);
  }

  /* Compact select in a tab row or example header: same height as .btn-sm, quieter than a form field */
  select.select-sm {
    max-width: 100%;
    padding: 0.3em 0.75em;
    font-size: var(--font-size-small);
    background-color: transparent;
  }
  @supports not (appearance: base-select) {
    select.select-sm {
      padding-right: 2em;
    }
  }

  /* Example picker: its own line above the example, aligned with the content's left edge */
  .example-select {
    display: flex;
    width: fit-content;
    margin-bottom: 0.75em;
  }

  .tab-content {
    position: relative;
    min-width: 0;
    min-height: 50px;
    padding-top: 0.75em;

    & .toolbar-btn {
      position: absolute;
      top: 12px;
      right: 8px;
    }
  }
`;
