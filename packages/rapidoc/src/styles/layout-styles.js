import { css } from 'lit';

export default css`
  rapi-doc:not(:defined) {
    display: none;
  }
  :host {
    all: initial;
    display: flex;
    flex-direction: column;
    min-width: 360px;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    letter-spacing: normal;
    color: var(--foreground);
    background: var(--background);
    font-family: var(--font-regular);
    container-type: inline-size;
  }
  :where(button, input[type='checkbox'], [tabindex='0']):focus-visible {
    box-shadow: var(--focus-shadow);
  }
  :where(input[type='text'], input[type='password'], select, textarea):focus-visible {
    border-color: var(--primary);
  }
  .body {
    position: relative;
    display: flex;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: var(--background);
  }
  .main-content {
    margin: 0;
    padding: 0;
    display: block;
    flex: 1;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
    container-type: inline-size;
  }

  .main-content-inner--view-mode {
    padding: 0 8px;
  }

  .main-content-inner--read-mode {
    padding-bottom: min(70vh, 600px);
  }
  .main-content::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  .main-content::-webkit-scrollbar-track {
    background: transparent;
  }
  .main-content::-webkit-scrollbar-thumb {
    background: var(--border);
  }

  .section-gap.section-tag {
    border-bottom: 1px solid var(--border);
  }
  .section-gap,
  .section-gap--focused-mode,
  .section-gap--read-mode {
    padding: 0px 4px;
  }
  .section-tag-header {
    position: relative;
    cursor: n-resize;
    padding: 12px 0;
  }
  .collapsed .section-tag-header:hover {
    cursor: s-resize;
  }

  .section-tag-header:hover {
    background-image: linear-gradient(to right, rgba(0, 0, 0, 0), var(--border), rgba(0, 0, 0, 0));
  }

  .section-tag-header:hover::after {
    position: absolute;
    margin-left: -24px;
    font-size: 20px;
    top: calc(50% - 14px);
    color: var(--primary);
    content: '⬆';
  }

  .collapsed .section-tag-header::after {
    position: absolute;
    margin-left: -24px;
    font-size: 20px;
    top: calc(50% - 14px);
    color: var(--border);
    content: '⬇';
  }
  .collapsed .section-tag-header:hover::after {
    color: var(--primary);
  }

  .collapsed .section-tag-body {
    display: none;
  }

  .section-gap.section-tag-group {
    border-bottom: 2px solid var(--border);
    margin-top: 24px;
    margin-bottom: 8px;
  }
  .section-tag-group-header {
    position: relative;
    cursor: pointer;
    padding: 16px 0 8px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
  }
  .section-tag-group-header:hover {
    background-image: linear-gradient(to right, rgba(0, 0, 0, 0), var(--border), rgba(0, 0, 0, 0));
  }
  .section-tag-group.collapsed .section-tag-group-body {
    display: none;
  }
  .section-tag-group-body {
    padding-inline-start: 12px;
    border-inline-start: 2px solid var(--border);
    margin-inline-start: 4px;
  }
  .section-tag-group-icon {
    font-size: 14px;
    color: var(--muted-foreground);
    width: 16px;
    height: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .section-tag-group-icon::after {
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
  .section-tag-group.collapsed .section-tag-group-icon::after {
    transform: rotate(-90deg);
  }
  ::slotted([slot='fixed-header']) {
    padding: 4px 12px;
    max-height: 40px;
    overflow: hidden;
    background: var(--background);
    color: var(--foreground);
    text-align: center;
  }
  ::slotted([slot='logo']) {
    height: 36px;
    width: auto;
    object-fit: contain;
    margin-left: 5px;
  }
  .only-large-screen-flex,
  .only-large-screen {
    display: none;
  }
  .tag.title {
    text-transform: uppercase;
  }
  .main-header {
    background: var(--background);
    color: var(--foreground);
  }
  .header-title {
    font-size: calc(var(--font-size-regular) + 8px);
    padding: 0 8px;
  }
  input.header-input {
    background: var(--input-background);
    color: var(--foreground);
    border: 1px solid var(--border);
    flex: 1;
    padding-right: 24px;
    border-radius: 3px;
  }
  input.header-input::placeholder {
    opacity: 0.4;
  }
  .loader {
    margin: 16px auto 16px auto;
    border: 4px solid var(--muted);
    border-radius: 50%;
    border-top: 4px solid var(--primary);
    width: 36px;
    height: 36px;
    animation: spin 2s linear infinite;
  }
  .expanded-endpoint-body {
    position: relative;
    padding: 6px 0px;
  }
  .expanded-endpoint-body .tag-description {
    background: var(--code-bg);
    border-radius: var(--card-radius);
    transition: max-height 0.2s ease-out;
  }
  .expanded-endpoint-body .tag-icon {
    transition: transform 0.2s ease-out;
  }
  .expanded-endpoint-body .tag-icon.expanded {
    transform: rotate(180deg);
  }
  .divider {
    border-top: 2px solid var(--border);
    margin: 24px 0;
    width: 100%;
  }

  .tooltip {
    cursor: pointer;
    border: 1px solid var(--border);
    border-left-width: 4px;
    margin-left: 2px;
  }
  .tooltip a {
    color: var(--card-foreground);
    text-decoration: none;
  }
  .tooltip-text {
    color: var(--card-foreground);
    max-width: 400px;
    position: absolute;
    z-index: 1;
    background: var(--card);
    visibility: hidden;

    overflow-wrap: break-word;
  }
  .tooltip:hover {
    color: var(--primary);
    border-color: var(--primary);
  }
  .tooltip:hover a:hover {
    color: var(--primary);
  }

  .tooltip:hover .tooltip-text {
    visibility: visible;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .nav-method {
    font-weight: bold;
    margin-inline-start: auto;
    flex-shrink: 0;
    font-size: calc(var(--font-size-small) - 2px);
    white-space: nowrap;
  }
  .nav-method.false {
    display: none;
  }

  .nav-method.as-colored-text {
    color: var(--method-default);
  }
  .nav-method.as-colored-text.get {
    color: var(--nav-get-color, var(--method-get));
  }
  .nav-method.as-colored-text.put {
    color: var(--nav-put-color, var(--method-put));
  }
  .nav-method.as-colored-text.post {
    color: var(--nav-post-color, var(--method-post));
  }
  .nav-method.as-colored-text.delete {
    color: var(--nav-delete-color, var(--method-delete));
  }
  .nav-method.as-colored-text.head {
    color: var(--nav-head-color, var(--method-head));
  }
  .nav-method.as-colored-text.patch {
    color: var(--nav-patch-color, var(--method-patch));
  }
  .nav-method.as-colored-text.options {
    color: var(--nav-options-color, var(--method-options));
  }
  .nav-method.as-colored-text.trace {
    color: var(--nav-trace-color, var(--method-trace));
  }
  .nav-method.as-colored-text.query {
    color: var(--nav-query-color, var(--method-query));
  }
  .nav-method.as-colored-text.copy {
    color: var(--nav-copy-color, var(--method-copy, var(--method-default)));
  }
  .nav-method.as-colored-text.purge {
    color: var(--nav-purge-color, var(--method-purge, var(--method-default)));
  }

  .nav-method.as-colored-block {
    padding: 1px 4px;
    min-width: 32px;
    text-align: center;
    border-radius: var(--radius);
    color: var(--nav-method-badge-fg, var(--method-badge-fg, #000));
    background: var(--method-default);
    font-weight: 700;
  }
  :host([color-scheme='light']) .nav-method.as-colored-block {
    color: var(--nav-method-badge-fg, var(--method-badge-fg, #fff));
  }
  @media (prefers-color-scheme: light) {
    :host([color-scheme='system']) .nav-method.as-colored-block {
      color: var(--nav-method-badge-fg, var(--method-badge-fg, #fff));
    }
  }
  .colored-block .nav-method.as-colored-block {
    outline: 1px solid;
  }

  .nav-method.as-colored-block.get {
    background: var(--nav-get-color, var(--method-get));
  }
  .nav-method.as-colored-block.put {
    background: var(--nav-put-color, var(--method-put));
  }
  .nav-method.as-colored-block.post {
    background: var(--nav-post-color, var(--method-post));
  }
  .nav-method.as-colored-block.delete {
    background: var(--nav-delete-color, var(--method-delete));
  }
  .nav-method.as-colored-block.head {
    background: var(--nav-head-color, var(--method-head));
  }
  .nav-method.as-colored-block.patch {
    background: var(--nav-patch-color, var(--method-patch));
  }
  .nav-method.as-colored-block.options {
    background: var(--nav-options-color, var(--method-options));
  }
  .nav-method.as-colored-block.trace {
    background: var(--nav-trace-color, var(--method-trace));
  }
  .nav-method.as-colored-block.query {
    background: var(--nav-query-color, var(--method-query));
  }
  .nav-method.as-colored-block.copy {
    background: var(--nav-copy-color, var(--method-copy, var(--method-default)));
  }
  .nav-method.as-colored-block.purge {
    background: var(--nav-purge-color, var(--method-purge, var(--method-default)));
  }

  @container (min-width: 768px) {
    .nav-bar {
      width: 260px;
      display: flex;
    }
    #nav-bar-btn {
      display: none;
    }
    #advanced-search-btn {
      display: block;
    }
    .only-large-screen {
      display: block;
    }
    .only-large-screen-flex {
      display: flex;
    }
    .section-gap {
      padding: 0 0 0 24px;
    }
    .section-gap--focused-mode {
      padding: 24px 8px;
    }
    .section-gap--read-mode {
      padding: 24px 8px;
    }
    .endpoint-body {
      position: relative;
      padding: 36px 0 48px 0;
    }
  }

  @container (min-width: 1024px) {
    .nav-bar {
      width: var(--nav-width, 18.75rem);
      display: flex;
    }
    #nav-bar-btn {
      display: none;
    }
    #advanced-search-btn {
      display: block;
    }
    .section-gap--focused-mode {
      padding: 12px 80px 12px 80px;
    }
    .section-gap--read-mode {
      padding: 24px 80px 12px 80px;
    }
  }
`;
