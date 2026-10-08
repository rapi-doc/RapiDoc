import { css } from 'lit';

export default css`
  #advanced-search-btn {
    display: none;
    margin-left: 5px;
    padding: 6px 8px;
    width: 75px;
  }
  .btn-clear-filter {
    margin-left: 5px;
    color: var(--muted-foreground);
    width: 75px;
    padding: 6px 8px;
  }
  .nav-bar-header {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transition:
      box-shadow 0.2s ease,
      background 0.2s ease;
  }
  @container scroll-state(scrollable: top) {
    .nav-bar-header {
      box-shadow:
        0 4px 12px -2px rgba(0, 0, 0, 0.25),
        0 2px 4px -1px rgba(0, 0, 0, 0.15);
    }
  }
  .nav-bar-search-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: stretch;
    padding: 8px 16px 12px 16px;
    box-sizing: border-box;
    width: 100%;
  }
  .nav-bar-search-container.has-bottom-border {
    border-bottom: 1px solid var(--muted);
  }
  .nav-bar-search-input-wrapper {
    display: flex;
    flex: 1;
    position: relative;
    line-height: 22px;
  }
  .nav-bar-search-input {
    width: 100%;
    padding: 6px 28px 6px 10px;
    color: var(--foreground);
    border: 1px solid var(--input-border);
    border-radius: var(--radius);
    background: var(--input-background);
    font-size: calc(var(--font-size-small) + 1px);
    box-sizing: border-box;
    transition:
      border-color 0.2s,
      box-shadow 0.2s;
  }
  .nav-bar-search-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary) 25%, transparent);
  }
  .nav-bar-search-icon {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    font-size: var(--font-size-regular);
    cursor: pointer;
    color: var(--muted-foreground);
    opacity: 0.6;
    user-select: none;
  }
  .nav-bar-search-icon:hover {
    opacity: 1;
    color: var(--foreground);
  }
  #nav-bar-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    font-size: 36px;
    line-height: 30px;
    width: 50px;
    height: 50px;
    background: var(--card);
    color: var(--foreground);
    border: 1px solid var(--border);
    border-radius: 4px;
    cursor: pointer;
    z-index: 10;
    box-shadow:
      0 12px 16px 0 rgba(0, 0, 0, 0.24),
      0 17px 50px 0 rgba(0, 0, 0, 0.19);
    &:hover {
      border-color: var(--primary);
      color: var(--primary);
    }
  }
  .nav-bar {
    width: 0;
    height: 100%;
    overflow: hidden;
    color: var(--muted-foreground);
    background: var(--background);
    background-blend-mode: multiply;
    border-right: 1px solid var(--border);
    line-height: calc(var(--font-size-small) + 4px);
    position: relative;
    flex-direction: column;
    flex-wrap: nowrap;
    word-break: break-word;
    &.floating-nav {
      position: absolute;
      top: 0;
      left: 0;
      width: 330px;
      overflow: scroll;
      z-index: 5;
    }
  }

  .nav-bar-info:focus-visible,
  .nav-bar-tag:focus-visible,
  .nav-bar-path:focus-visible {
    outline: 1px solid;
    box-shadow: none;
    outline-offset: -4px;
  }
  .nav-bar-expand-all:focus-visible,
  .nav-bar-collapse-all:focus-visible,
  .nav-bar-tag-icon:focus-visible {
    outline: 1px solid;
    box-shadow: none;
    outline-offset: 2px;
  }
  ::slotted([slot='nav-logo']) {
    max-height: var(--nav-logo-max-height, 60px);
    width: auto;
    padding: 16px 16px 0 16px;
    object-fit: contain;
  }
  .nav-scroll {
    overflow-x: hidden;
    overflow-y: auto;
    overflow-y: overlay;
    scrollbar-width: thin;
    scrollbar-color: var(--muted) transparent;
    scroll-padding-top: 60px;
    container-type: scroll-state;
  }

  .nav-bar-tag {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
  }
  .nav-bar.read .nav-bar-tag-icon {
    display: none;
  }
  .nav-bar-paths-under-tag {
    overflow: hidden;
    transition:
      max-height 0.2s ease-out,
      visibility 0.3s;
  }
  .collapsed .nav-bar-paths-under-tag {
    visibility: hidden;
    max-height: 0;
  }

  .nav-bar-expand-all {
    transform: rotate(90deg);
    cursor: pointer;
    margin-inline-end: 10px;
  }
  .nav-bar-collapse-all {
    transform: rotate(270deg);
    cursor: pointer;
  }
  .nav-bar-expand-all:hover,
  .nav-bar-collapse-all:hover {
    color: var(--primary);
  }

  .nav-bar-tag-icon {
    color: var(--muted-foreground);
    font-size: 20px;
  }
  .nav-bar-tag-icon:hover {
    color: var(--foreground);
  }
  .nav-bar.focused .nav-bar-tag-and-paths.collapsed .nav-bar-tag-icon::after {
    content: '⌵';
    width: 16px;
    height: 16px;
    text-align: center;
    display: inline-block;
    transform: rotate(-90deg);
    transition: transform 0.2s ease-out 0s;
  }
  .nav-bar.focused .nav-bar-tag-and-paths.expanded .nav-bar-tag-icon::after {
    content: '⌵';
    width: 16px;
    height: 16px;
    text-align: center;
    display: inline-block;
    transition: transform 0.2s ease-out 0s;
  }
  .nav-scroll::-webkit-scrollbar {
    width: 8px;
  }
  .nav-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .nav-scroll::-webkit-scrollbar-thumb {
    background: var(--muted);
  }

  .nav-bar-tag {
    font-size: var(--font-size-regular);
    color: var(--primary);
    border-inline-start: 4px solid transparent;
    font-weight: bold;
    padding: 15px 15px 15px 10px;
    text-transform: capitalize;
  }

  .nav-bar-components,
  .nav-bar-h1,
  .nav-bar-h2,
  .nav-bar-info,
  .nav-bar-tag,
  .nav-bar-path {
    display: flex;
    cursor: pointer;
    width: 100%;
    border: none;
    color: var(--muted-foreground);
    background: transparent;
    border-inline-start: 4px solid transparent;
  }

  .nav-bar-h1,
  .nav-bar-h2,
  .nav-bar-path {
    font-size: calc(var(--font-size-small) + 1px);
    padding: var(--nav-item-padding);
  }
  .nav-bar-path.small-font {
    font-size: var(--font-size-small);
  }

  .nav-bar-info {
    font-size: var(--font-size-regular);
    padding: 16px 10px;
    font-weight: bold;
  }
  .nav-bar-section {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: var(--font-size-small);
    color: var(--muted-foreground);
    padding: var(--nav-item-padding);
    font-weight: bold;
  }
  .nav-bar-section.operations {
    cursor: pointer;
  }
  .nav-bar-section.operations:hover {
    color: var(--foreground);
    background: var(--muted);
  }

  .nav-bar-section:first-child {
    display: none;
  }
  .nav-bar-h2 {
    padding-inline-start: 28px;
  }

  .nav-bar-h1.left-bar.active,
  .nav-bar-h2.left-bar.active,
  .nav-bar-info.left-bar.active,
  .nav-bar-tag.left-bar.active,
  .nav-bar-path.left-bar.active,
  .nav-bar-section.left-bar.operations.active {
    border-inline-start: 4px solid var(--primary);
    color: var(--primary);
  }

  .nav-bar-h1.left-bar.active:hover,
  .nav-bar-h2.left-bar.active:hover,
  .nav-bar-info.left-bar.active:hover,
  .nav-bar-tag.left-bar.active:hover,
  .nav-bar-path.left-bar.active:hover,
  .nav-bar-section.left-bar.operations.active:hover {
    color: var(--primary);
  }

  .nav-bar-h1.colored-block.active,
  .nav-bar-h2.colored-block.active,
  .nav-bar-info.colored-block.active,
  .nav-bar-tag.colored-block.active,
  .nav-bar-path.colored-block.active,
  .nav-bar-section.colored-block.operations.active {
    background: var(--primary);
    color: var(--primary-foreground);
  }

  .nav-bar-h1.colored-block.active:hover,
  .nav-bar-h2.colored-block.active:hover,
  .nav-bar-info.colored-block.active:hover,
  .nav-bar-tag.colored-block.active:hover,
  .nav-bar-path.colored-block.active:hover,
  .nav-bar-section.colored-block.operations.active:hover {
    background: var(--primary);
    color: var(--primary-foreground);
  }

  .nav-bar-h1:hover,
  .nav-bar-h2:hover,
  .nav-bar-info:hover,
  .nav-bar-tag:hover,
  .nav-bar-path:hover {
    color: var(--foreground);
    background: var(--muted);
  }
`;
