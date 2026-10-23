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
    color: var(--foreground);
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
    border: 1px solid var(--input);
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
    border-color: var(--sidebar-ring);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--sidebar-ring) 25%, transparent);
  }
  .nav-bar-search-icon {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    font-size: var(--font-size-regular);
    cursor: pointer;
    color: var(--foreground);
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
    color: var(--sidebar-foreground);
    background: var(--sidebar);
    background-blend-mode: multiply;
    border-right: 1px solid var(--sidebar-border);
    line-height: calc(var(--font-size-small) + 4px);
    font-size: calc(var(--font-size-small) + 1px);
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
    max-height: var(--sidebar-logo-max-height);
    overflow: hidden;
    box-sizing: border-box;
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
  .nav-bar-paths-under-tag {
    overflow: hidden;
    padding-left: 10px;
  }
  .collapsed .nav-bar-paths-under-tag,
  .nav-bar-tag-and-paths.collapsed .nav-bar-paths-under-tag {
    display: none;
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

  .nav-bar-tag-icon,
  .nav-bar-tag-group-icon {
    font-size: 14px;
    color: var(--foreground);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    line-height: 1;
    user-select: none;
    transition: color 0.15s ease;
  }
  .nav-bar-tag-icon:hover,
  .nav-bar-tag-group-icon:hover {
    color: var(--foreground);
  }

  .nav-bar-tag-icon::after,
  .nav-bar-tag-group-icon::after {
    content: '';
    width: 14px;
    height: 14px;
    display: inline-block;
    background-color: currentColor;
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='black' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E");
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='black' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E");
    -webkit-mask-size: 14px 14px;
    mask-size: 14px 14px;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-position: center;
    transition: transform 0.2s ease-out 0s;
    transform-origin: center;
  }

  .nav-bar-tag-and-paths.collapsed .nav-bar-tag-icon::after,
  .nav-bar-tag-group.collapsed .nav-bar-tag-group-icon::after {
    transform: rotate(-90deg);
  }

  .nav-bar-tag-and-paths.expanded .nav-bar-tag-icon::after,
  .nav-bar-tag-group.expanded .nav-bar-tag-group-icon::after {
    transform: rotate(0deg);
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
  .nav-bar-tag-group {
    margin-top: 6px;
    margin-bottom: 2px;
  }
  .nav-bar-tag-group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 15px 4px 6px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--foreground);
    cursor: pointer;
    user-select: none;
    border-inline-start: 4px solid transparent;
    transition:
      border-color 0.15s ease,
      color 0.15s ease;
  }
  .nav-bar-tag-group-header:hover {
    color: var(--foreground);
  }
  .nav-bar-tag-group-title {
    flex: 1;
    min-width: 0;
  }
  .nav-bar-tag-group.collapsed .nav-bar-tags-under-group {
    display: none;
  }
  .nav-bar-tags-under-group {
    border-inline-start: 1px solid var(--border);
    margin-inline-start: 10px;
  }

  .nav-bar-tag {
    color: var(--primary);
    border-inline-start: 4px solid transparent;
    font-weight: 600;
    padding: 10px 15px 10px 10px;
    text-transform: capitalize;
    min-width: 0;
  }
  .nav-bar-tag a,
  .nav-bar-tag-title,
  a.nav-bar-tag-title {
    color: inherit;
    text-decoration: none;
    flex: 1;
    min-width: 0;
  }
  .nav-bar-tag a:hover,
  .nav-bar-tag-title:hover,
  a.nav-bar-tag-title:hover {
    color: inherit;
    text-decoration: none;
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
    color: var(--foreground);
    background: transparent;
    border-inline-start: 4px solid transparent;
    transition:
      background 0.15s ease,
      color 0.15s ease;
  }

  .nav-bar-path,
  a.nav-bar-path {
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-width: 0;
    box-sizing: border-box;
    text-decoration: none;
  }

  .nav-bar-path:hover,
  a.nav-bar-path:hover {
    text-decoration: none;
  }

  .nav-bar-path > * {
    pointer-events: none;
  }

  .nav-bar-path.deprecated {
    filter: opacity(0.5);
  }

  .portal-sidebar-footer-link {
    padding: 16px 12px;
  }

  .nav-bar-path-label {
    display: flex;
    align-items: baseline;
    min-width: 0;
    flex: 1;
  }

  .nav-bar-webhook {
    font-weight: bold;
    margin-right: 8px;
    font-size: calc(var(--font-size-small) - 2px);
    flex-shrink: 0;
  }

  .nav-method {
    font-weight: bold;
    margin-inline-start: auto;
    flex-shrink: 0;
    font-size: calc(var(--font-size-small) - 2px);
    white-space: nowrap;

    &.false {
      display: none;
    }
  }

  .nav-method.as-colored-text {
    color: var(--method-default);
  }
  .nav-method.as-colored-text.get {
    color: var(--method-get);
  }
  .nav-method.as-colored-text.put {
    color: var(--method-put);
  }
  .nav-method.as-colored-text.post {
    color: var(--method-post);
  }
  .nav-method.as-colored-text.delete {
    color: var(--method-delete);
  }
  .nav-method.as-colored-text.head {
    color: var(--method-head);
  }
  .nav-method.as-colored-text.patch {
    color: var(--method-patch);
  }
  .nav-method.as-colored-text.options {
    color: var(--method-options);
  }
  .nav-method.as-colored-text.trace {
    color: var(--method-trace);
  }
  .nav-method.as-colored-text.query {
    color: var(--method-query);
  }
  .nav-method.as-colored-text.copy {
    color: var(--method-default);
  }
  .nav-method.as-colored-text.purge {
    color: var(--method-default);
  }

  .nav-method.as-colored-block {
    padding: 1px 4px;
    min-width: 32px;
    text-align: center;
    border-radius: 4px;
    color: var(--method-badge-fg);
    background: var(--method-default);
    font-weight: 600;
  }
  :host([color-scheme='light']) .nav-method.as-colored-block {
    color: var(--method-badge-fg);
  }
  @media (prefers-color-scheme: light) {
    :host([color-scheme='system']) .nav-method.as-colored-block {
      color: var(--method-badge-fg);
    }
  }
  .colored-block .nav-method.as-colored-block {
    outline: 1px solid;
  }

  .nav-method.as-colored-block.get {
    background: var(--method-get);
  }
  .nav-method.as-colored-block.put {
    background: var(--method-put);
  }
  .nav-method.as-colored-block.post {
    background: var(--method-post);
  }
  .nav-method.as-colored-block.delete {
    background: var(--method-delete);
  }
  .nav-method.as-colored-block.head {
    background: var(--method-head);
  }
  .nav-method.as-colored-block.patch {
    background: var(--method-patch);
  }
  .nav-method.as-colored-block.options {
    background: var(--method-options);
  }
  .nav-method.as-colored-block.trace {
    background: var(--method-trace);
  }
  .nav-method.as-colored-block.query {
    background: var(--method-query);
  }
  .nav-method.as-colored-block.copy {
    background: var(--method-default);
  }
  .nav-method.as-colored-block.purge {
    background: var(--method-default);
  }

  .nav-bar-h1,
  .nav-bar-h2,
  .nav-bar-path {
    font-weight: 400;
    padding: var(--sidebar-item-padding);
  }

  .nav-bar-info {
    padding: 12px 10px;
    font-weight: 600;
  }
  .nav-bar-section {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: var(--foreground);
    padding: var(--sidebar-item-padding);
    font-weight: 700;
  }
  .nav-bar-section.operations {
    display: none !important;
  }

  .nav-bar-section:first-child {
    display: none;
  }
  .nav-bar-h2 {
    padding-inline-start: 28px;
  }

  /* Active item indicator - always left-bar style */
  .nav-bar-h1.active,
  .nav-bar-h2.active,
  .nav-bar-info.active,
  .nav-bar-tag.active,
  .nav-bar-path.active,
  .nav-bar-section.operations.active,
  .nav-bar-h1.left-bar.active,
  .nav-bar-h2.left-bar.active,
  .nav-bar-info.left-bar.active,
  .nav-bar-tag.left-bar.active,
  .nav-bar-path.left-bar.active,
  .nav-bar-section.left-bar.operations.active {
    border-inline-start: 4px solid var(--sidebar-primary);
    color: var(--sidebar-primary);
  }

  .nav-bar-h1.active:hover,
  .nav-bar-h2.active:hover,
  .nav-bar-info.active:hover,
  .nav-bar-tag.active:hover,
  .nav-bar-path.active:hover,
  .nav-bar-section.operations.active:hover,
  .nav-bar-h1.left-bar.active:hover,
  .nav-bar-h2.left-bar.active:hover,
  .nav-bar-info.left-bar.active:hover,
  .nav-bar-tag.left-bar.active:hover,
  .nav-bar-path.left-bar.active:hover,
  .nav-bar-section.left-bar.operations.active:hover {
    color: var(--sidebar-primary);
  }

  /* Highlight collapsed parents using modern CSS :has() */
  .nav-bar-tag-and-paths.collapsed:has(.nav-bar-path.active) > .nav-bar-tag {
    border-inline-start-color: var(--sidebar-primary);
    color: var(--sidebar-primary);
  }

  .nav-bar-tag-group.collapsed:has(.active) > .nav-bar-tag-group-header {
    border-inline-start-color: var(--sidebar-primary);
    color: var(--sidebar-primary);
  }

  .nav-bar-tag-and-paths.collapsed:has(.nav-bar-path.active) > .nav-bar-tag:hover,
  .nav-bar-tag-group.collapsed:has(.active) > .nav-bar-tag-group-header:hover {
    color: var(--sidebar-primary);
  }

  .nav-bar-h1:hover,
  .nav-bar-h2:hover,
  .nav-bar-info:hover,
  .nav-bar-tag:hover,
  .nav-bar-path:hover {
    color: var(--sidebar-accent-foreground);
    background: var(--sidebar-accent);
  }

  /* nav-item-overflow: ellipsis (default) vs wrap */
  :host([nav-item-overflow='ellipsis']) .nav-bar-tag-group-title,
  :host(:not([nav-item-overflow])) .nav-bar-tag-group-title,
  .overflow-ellipsis .nav-bar-tag-group-title,
  :host([nav-item-overflow='ellipsis']) .nav-bar-tag-title,
  :host(:not([nav-item-overflow])) .nav-bar-tag-title,
  .overflow-ellipsis .nav-bar-tag-title,
  :host([nav-item-overflow='ellipsis']) .nav-bar-path-label,
  :host(:not([nav-item-overflow])) .nav-bar-path-label,
  .overflow-ellipsis .nav-bar-path-label,
  :host([nav-item-overflow='ellipsis']) .nav-bar-info,
  :host(:not([nav-item-overflow])) .nav-bar-info,
  .overflow-ellipsis .nav-bar-info,
  :host([nav-item-overflow='ellipsis']) .nav-bar-section-title,
  :host(:not([nav-item-overflow])) .nav-bar-section-title,
  .overflow-ellipsis .nav-bar-section-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }

  :host([nav-item-overflow='wrap']) .nav-bar-tag-group-title,
  .overflow-wrap .nav-bar-tag-group-title,
  :host([nav-item-overflow='wrap']) .nav-bar-tag-title,
  .overflow-wrap .nav-bar-tag-title,
  :host([nav-item-overflow='wrap']) .nav-bar-path-label,
  .overflow-wrap .nav-bar-path-label,
  :host([nav-item-overflow='wrap']) .nav-bar-info,
  .overflow-wrap .nav-bar-info,
  :host([nav-item-overflow='wrap']) .nav-bar-section-title,
  .overflow-wrap .nav-bar-section-title {
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
    word-break: break-word;
  }
`;
