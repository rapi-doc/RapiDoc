import { css } from 'lit';

export default css`
  #advanced-search-btn {
    display: none;
  }
  #nav-bar-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    font-size: 36px;
    line-height: 30px;
    width: 50px;
    height: 50px;
    background: var(--bg2);
    color: var(--fg1);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    cursor: pointer;
    z-index: 10;
    box-shadow:
      0 12px 16px 0 rgba(0, 0, 0, 0.24),
      0 17px 50px 0 rgba(0, 0, 0, 0.19);
    &:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
  }
  .nav-bar {
    width: 0;
    height: 100%;
    overflow: hidden;
    color: var(--nav-text-color);
    background: var(--nav-bg-color);
    background-blend-mode: multiply;
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
    height: 60px;
    width: auto;
    padding: 16px 16px 0 16px;
    object-fit: contain;
  }
  .nav-scroll {
    overflow-x: hidden;
    overflow-y: auto;
    overflow-y: overlay;
    scrollbar-width: thin;
    scrollbar-color: var(--nav-hover-bg-color) transparent;
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
    margin-right: 10px;
  }
  .nav-bar-collapse-all {
    transform: rotate(270deg);
    cursor: pointer;
  }
  .nav-bar-expand-all:hover,
  .nav-bar-collapse-all:hover {
    color: var(--primary-color);
  }

  .nav-bar-tag-icon {
    color: var(--nav-text-color);
    font-size: 20px;
  }
  .nav-bar-tag-icon:hover {
    color: var(--nav-hover-text-color);
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
    width: var(--scroll-bar-width, 8px);
  }
  .nav-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .nav-scroll::-webkit-scrollbar-thumb {
    background: var(--nav-hover-bg-color);
  }

  .nav-bar-tag {
    font-size: var(--font-size-regular);
    color: var(--nav-accent-color);
    border-left: 4px solid transparent;
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
    border-radius: 4px;
    color: var(--nav-text-color);
    background: transparent;
    border-left: 4px solid transparent;
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
    color: var(--nav-text-color);
    padding: var(--nav-item-padding);
    font-weight: bold;
  }
  .nav-bar-section.operations {
    cursor: pointer;
  }
  .nav-bar-section.operations:hover {
    color: var(--nav-hover-text-color);
    background: var(--nav-hover-bg-color);
  }

  .nav-bar-section:first-child {
    display: none;
  }
  .nav-bar-h2 {
    padding-left: 28px;
  }

  .nav-bar-h1.left-bar.active,
  .nav-bar-h2.left-bar.active,
  .nav-bar-info.left-bar.active,
  .nav-bar-tag.left-bar.active,
  .nav-bar-path.left-bar.active,
  .nav-bar-section.left-bar.operations.active {
    border-left: 4px solid var(--nav-accent-color);
    color: var(--nav-hover-text-color);
  }

  .nav-bar-h1.colored-block.active,
  .nav-bar-h2.colored-block.active,
  .nav-bar-info.colored-block.active,
  .nav-bar-tag.colored-block.active,
  .nav-bar-path.colored-block.active,
  .nav-bar-section.colored-block.operations.active {
    background: var(--nav-accent-color);
    color: var(--nav-accent-text-color);
    border-radius: 0;
  }

  .nav-bar-h1:hover,
  .nav-bar-h2:hover,
  .nav-bar-info:hover,
  .nav-bar-tag:hover,
  .nav-bar-path:hover {
    color: var(--nav-hover-text-color);
    background: var(--nav-hover-bg-color);
  }
`;
