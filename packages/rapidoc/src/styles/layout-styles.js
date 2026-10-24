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
    font-family: var(--font-sans);
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

  :host([auto-height]),
  :host([auto-height='true']) {
    height: auto;
    overflow: visible;
  }
  :host([auto-height]) .body,
  :host([auto-height='true']) .body {
    height: auto;
    overflow: visible;
  }
  :host([auto-height]) .main-content,
  :host([auto-height='true']) .main-content {
    height: auto;
    overflow: visible;
  }

  .main-content-inner--view-mode {
    padding: 0 8px;
  }

  .main-content-inner--read-mode {
    padding: 0 8px;
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
    scroll-margin-top: var(--scroll-margin-top);
  }

  :host([auto-height]) .main-content-inner--read-mode,
  :host([auto-height='true']) .main-content-inner--read-mode {
    padding-bottom: 40px;
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
  .main-header {
    background: var(--background);
    color: var(--foreground);
    padding: 8px 4px;
    min-height: 48px;
  }
  .main-header-controls {
    margin: 0 8px;
    display: flex;
    flex: 1;
    align-items: center;
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
    border-radius: min(var(--radius), 0.5rem);
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

  .downloads-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    justify-content: flex-start;
    margin: 12px 0;
  }
  .download-btn {
    min-width: 170px;
    height: 32px;
    line-height: 30px;
    padding: 0 14px;
    white-space: nowrap;
    vertical-align: middle;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }
  .download-btn.view-spec {
    min-width: 190px;
  }
  .download-select {
    min-width: 180px;
    height: 32px;
    line-height: 30px;
    padding: 0 14px;
    white-space: nowrap;
    vertical-align: middle;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    cursor: pointer;
  }

  .header-action-icon {
    margin: 6px 5px 0 -24px;
    font-size: var(--font-size-regular);
    cursor: pointer;
    user-select: none;
  }

  #spec-not-found {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed var(--border);
    padding: 12px;
    overflow-wrap: anywhere;
    font-size: var(--font-size-small);
    color: var(--destructive);
    font-family: var(--font-mono);
  }

  .server-opt-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin: 4px 0;
  }
  .server-opt-row input[type='radio'],
  .server-opt-row label {
    cursor: pointer;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
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
      width: var(--sidebar-width);
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
