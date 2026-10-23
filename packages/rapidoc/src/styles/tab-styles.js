import { css } from 'lit';

export default css`
  .tab-panel {
    border: none;
  }
  .tabs,
  .tab-buttons {
    height: 30px;
    padding: 4px 4px 0 4px;
    border-bottom: 1px solid var(--border);
    align-items: stretch;
    overflow-y: hidden;
    overflow-x: auto;
    scrollbar-width: thin;

    &::-webkit-scrollbar {
      height: 1px;
      background: var(--border);
    }
  }

  .tab,
  .tab-btn {
    border: none;
    border-radius: 0;
    corner-shape: square;
    border-bottom: 2px solid transparent;
    color: var(--muted-foreground);
    background: transparent;
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    font-family: var(--font-sans);
    font-size: var(--font-size-small);
    margin-inline-end: 16px;
    padding: 2px 4px;
    transition: color 0.15s ease;

    &.tab-active,
    &.active {
      border-bottom: 2px solid var(--primary);
      font-weight: 600;
      color: var(--primary);
    }

    &:hover,
    &:focus-visible {
      outline: none;
      color: var(--primary);
    }
  }

  .tab-content {
    margin: -1px 0 0 0;
    position: relative;
    min-height: 50px;

    & .toolbar-btn {
      position: absolute;
      top: 12px;
      right: 8px;
    }
  }
`;
