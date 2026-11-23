import { css } from "lit";

export default css`
  #advanced-search-btn {
    display: none;
    margin-inline-start: 5px;
    width: 75px;
  }
  .btn-clear-filter {
    margin-inline-start: 5px;
    color: var(--foreground);
    width: 75px;
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
  /* Wrapper in the selector so it outranks input-styles' input[type='text'] padding (room for the icon) */
  .nav-bar-search-input-wrapper .nav-bar-search-input {
    width: 100%;
    line-height: 1.25;
    padding-block: 0.45em;
    padding-inline: 10px 28px;
    color: var(--foreground);
    border: 1px solid var(--input);
    border-radius: var(--radius);
    background: var(--input-background);
    /* Inputs do not inherit the page font; getNavCss() puts this on a page, outside the element's input styles. */
    font-family: inherit;
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
    inset-inline-end: 8px;
    top: 50%;
    transform: translateY(-50%);
    font-size: var(--font-size-regular);
    cursor: pointer;
    color: var(--foreground);
    opacity: 0.6;
    user-select: none;
  }
  /* The static nav's filter icon is a single-colour SVG (magnifying glass), not a glyph. */
  svg.nav-bar-search-icon {
    cursor: default;
    pointer-events: none;
  }
  .nav-bar-search-icon:hover {
    opacity: 1;
    color: var(--foreground);
  }
  /* The menu button of narrow layouts: three lines that turn into an × while the menu is open */
  #nav-bar-btn {
    position: absolute;
    top: 16px;
    inset-inline-end: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    background: var(--card);
    color: var(--muted-foreground);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    cursor: pointer;
    z-index: 10;
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.12),
      0 4px 12px rgba(0, 0, 0, 0.16);
    transition:
      color 0.15s ease,
      border-color 0.15s ease;
    & svg {
      width: 20px;
      height: 20px;
      overflow: visible;
    }
    &:hover {
      color: var(--foreground);
      border-color: var(--muted-foreground);
    }
    &:focus-visible {
      outline: none;
      box-shadow: var(--focus-shadow);
    }
    &:has(+ .nav-bar.floating-nav) {
      color: var(--primary);
      border-color: var(--primary);
    }
  }
  .nav-bar-btn-line {
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    transform-box: fill-box;
    transform-origin: center;
    transition:
      transform 0.2s ease,
      opacity 0.15s ease;
  }
  #nav-bar-btn:has(+ .nav-bar.floating-nav) .nav-bar-btn-line {
    &:nth-child(1) {
      transform: translateY(5px) rotate(45deg);
    }
    &:nth-child(2) {
      opacity: 0;
    }
    &:nth-child(3) {
      transform: translateY(-5px) rotate(-45deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .nav-bar-btn-line,
    .nav-bar.floating-nav {
      transition: none;
      animation: none;
    }
  }
  /* show-side-nav="floating": the menu button and slide-over menu at every width. These beat the
     wide-layout rules of layout-styles.js (which dock the sidebar and hide the button) by
     specificity, so the order of the style sheets does not matter */
  .body.nav-floating #nav-bar-btn {
    display: flex;
  }
  .body.nav-floating .nav-bar:not(.floating-nav) {
    width: 0;
    border-inline-end: 0;
  }
  @keyframes nav-slide-in {
    from {
      transform: translateX(-12px);
      opacity: 0;
    }
  }
  @keyframes nav-slide-in-rtl {
    from {
      transform: translateX(12px);
      opacity: 0;
    }
  }
  .nav-bar {
    width: 0;
    height: 100%;
    overflow: hidden;
    color: var(--sidebar-foreground);
    background: var(--sidebar);
    background-blend-mode: multiply;
    border-inline-end: 1px solid var(--sidebar-border);
    /* Same size as body text (14px by default), like most API references; 20px line height at that size. */
    font-size: var(--font-size-regular);
    line-height: calc(var(--font-size-regular) + 6px);
    position: relative;
    flex-direction: column;
    flex-wrap: nowrap;
    word-break: break-word;
    /* Open over the content on narrow layouts: lifted by a shadow on its open side, sliding in */
    &.floating-nav {
      position: absolute;
      top: 0;
      inset-inline-start: 0;
      width: 330px;
      overflow: scroll;
      z-index: 5;
      box-shadow:
        8px 0 24px -6px rgba(0, 0, 0, 0.45),
        2px 0 6px -2px rgba(0, 0, 0, 0.25);
      animation: nav-slide-in 0.18s ease-out;
    }
    /* Right-to-left: it opens from the right, so the shadow and the slide are mirrored */
    &.floating-nav:dir(rtl) {
      box-shadow:
        -8px 0 24px -6px rgba(0, 0, 0, 0.45),
        -2px 0 6px -2px rgba(0, 0, 0, 0.25);
      animation-name: nav-slide-in-rtl;
    }
  }

  /* ---------------------------------------------------------------------------------------------
     Items. Three levels, each with its own look:
     1. Section labels: small upper-case text, not links (Overview, each x-tagGroups group,
        Components). Without tag groups the tags themselves take this place (.tags-as-labels),
        but stay a link (the name) and a toggle (the arrow).
     2. Rows with a leading icon: the API title, API Servers, Authentication, and tags in a group.
     3. Operations and headings: compact rows under a guide line; the method leads the row.
     The current item is a filled block; a closed tag that holds it turns to the accent.
     --------------------------------------------------------------------------------------------- */
  .nav-bar-info:focus-visible,
  .nav-bar-tag:focus-visible,
  .nav-bar-tag-title:focus-visible,
  .nav-bar-path:focus-visible,
  .nav-bar-h1:focus-visible,
  .nav-bar-h2:focus-visible,
  .nav-bar-tag-icon:focus-visible {
    outline: 2px solid var(--sidebar-ring);
    outline-offset: -2px;
    box-shadow: none;
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
    padding: 0 10px 24px;
    box-sizing: border-box;
  }
  /* The sticky header spans the full width, outside the items' inset */
  .nav-scroll > .nav-bar-header {
    margin-inline: -10px;
    width: auto;
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

  /* --- Level 1: section labels --- */
  .nav-bar-section-label {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 10px 6px;
    margin-top: 22px;
    font-size: var(--font-size-xs);
    font-weight: 600;
    line-height: 1.4;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--sidebar-label-foreground);
    cursor: default;
    user-select: none;
  }
  .nav-scroll > .nav-bar-section-label:first-child,
  .nav-bar-header + .nav-bar-section-label {
    margin-top: 8px;
  }
  .nav-bar-tag-group {
    margin-top: 22px;
  }
  .nav-bar-tag-group > .nav-bar-section-label {
    margin-top: 0;
  }

  /* --- Every item --- */
  .nav-bar-info,
  .nav-bar-tag,
  .nav-bar-path,
  .nav-bar-h1,
  .nav-bar-h2 {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    /* Border-box and no underline here too: getNavCss() (@rapidoc/prerender) styles these on a page
       without the component's global box-sizing reset and link styles */
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    border: none;
    border-radius: var(--radius);
    color: var(--sidebar-foreground);
    background: transparent;
    font-weight: 400;
    text-decoration: none;
    cursor: pointer;
    transition:
      background 0.15s ease,
      color 0.15s ease;
  }
  a.nav-bar-info:hover,
  a.nav-bar-path:hover,
  a.nav-bar-tag:hover {
    text-decoration: none;
  }
  .nav-bar-info:hover,
  .nav-bar-tag:hover,
  .nav-bar-path:hover,
  .nav-bar-h1:hover,
  .nav-bar-h2:hover {
    color: var(--sidebar-accent-foreground);
    background: var(--sidebar-accent);
  }
  .nav-bar-info.active,
  .nav-bar-tag.active,
  .nav-bar-path.active,
  .nav-bar-h1.active,
  .nav-bar-h2.active {
    /* the accent, not a heavier weight: the text keeps its width, so nothing shifts */
    color: var(--sidebar-primary);
    background: var(--sidebar-active-background);
  }

  /* --- Level 2: rows with an icon --- */
  .nav-bar-info {
    min-height: 36px;
    padding: 0 10px;
  }
  .nav-bar-icon {
    flex: none;
    width: 18px;
    height: 18px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.6;
    stroke-linecap: round;
    stroke-linejoin: round;
    color: color-mix(in srgb, var(--sidebar-foreground) 60%, transparent);
    transition: color 0.15s ease;
  }
  .nav-bar-info:hover .nav-bar-icon {
    color: var(--sidebar-accent-foreground);
  }
  .nav-bar-info.active .nav-bar-icon {
    color: var(--sidebar-primary);
  }
  .nav-bar-info-title,
  .nav-bar-tag-title,
  .nav-bar-tag-group-title {
    flex: 1;
    min-width: 0;
    color: inherit;
    text-decoration: none;
  }

  /* A tag: its name is a link to its section, its arrow a button beside it. A tag with nothing to open
     (description-only, a component) is a link itself. */
  .nav-bar-tag {
    min-height: 36px;
    padding-inline: 10px 4px;
  }
  div.nav-bar-tag {
    padding-inline-start: 0;
    cursor: default;
  }
  /* The link fills the row up to the arrow, so the whole name is one target */
  div.nav-bar-tag > a.nav-bar-tag-title {
    display: flex;
    align-items: center;
    align-self: stretch;
    padding-inline-start: 10px;
    border-radius: inherit;
    cursor: pointer;
  }
  a.nav-bar-tag-title,
  .nav-bar-tag a {
    color: inherit;
    text-decoration: none;
  }
  .nav-bar-tag-and-paths.collapsed:has(.nav-bar-path.active) > .nav-bar-tag {
    color: var(--sidebar-primary);
  }
  .nav-bar-tag-icon {
    /* a <button>: none of the browser's own look */
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: var(--radius);
    color: color-mix(in srgb, var(--sidebar-foreground) 60%, transparent);
    cursor: pointer;
    user-select: none;
    transition:
      background 0.15s ease,
      color 0.15s ease;
  }
  .nav-bar-tag-icon:hover {
    color: var(--sidebar-accent-foreground);
    background: color-mix(in srgb, var(--sidebar-foreground) 12%, transparent);
  }
  .nav-bar-tag-icon::after {
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
  .nav-bar-tag-and-paths.collapsed .nav-bar-tag-icon::after {
    transform: rotate(-90deg);
  }
  .nav-bar-tag-and-paths.collapsed .nav-bar-tag-icon:dir(rtl)::after {
    transform: rotate(90deg);
  }

  /* Collapsing a tag slides its operations shut: height auto -> 0 (interpolate-size lets the
     keyword animate; browsers without it switch at once). The body goes visibility: hidden once
     closed, so its links leave the tab order; opening shows it at once. */
  .nav-bar-paths-under-tag {
    interpolate-size: allow-keywords;
    height: auto;
    overflow: hidden;
    transition:
      height 0.25s ease,
      visibility 0s;
  }
  .nav-bar-tag-and-paths.collapsed .nav-bar-paths-under-tag {
    height: 0;
    visibility: hidden;
    transition:
      height 0.25s ease,
      visibility 0s linear 0.25s;
  }
  @media (prefers-reduced-motion: reduce) {
    .nav-bar-paths-under-tag,
    .nav-bar-tag-icon::after {
      transition: none;
    }
  }

  /* --- Level 3: indented under a guide line, the current item ticked on it --- */
  .nav-bar-paths-under-tag,
  .overview-headers {
    position: relative;
    padding-inline-start: 11px;
  }
  /* Under the tag's name (tags have no icon) or under the API title's icon */
  .nav-bar-paths-under-tag {
    margin-inline-start: 10px;
  }
  .overview-headers {
    margin-inline-start: 19px;
  }
  .nav-bar-paths-under-tag::before,
  .overview-headers::before {
    content: '';
    position: absolute;
    inset-inline-start: 0;
    top: 2px;
    bottom: 2px;
    width: 1px;
    background: var(--sidebar-border);
  }
  .nav-bar-paths-under-tag > .nav-bar-path.active::before,
  .overview-headers > .active::before {
    content: '';
    position: absolute;
    inset-inline-start: -11px;
    width: 1px;
    height: 18px;
    background: var(--sidebar-primary);
  }
  .nav-bar-path,
  .nav-bar-h1,
  .nav-bar-h2 {
    min-height: 30px;
    padding: var(--sidebar-item-padding);
    gap: 8px;
  }
  .nav-bar-h2 {
    padding-inline-start: 22px;
  }
  .nav-bar-path > * {
    pointer-events: none;
  }
  .nav-bar-path.deprecated .nav-bar-path-label {
    text-decoration: line-through;
    opacity: 0.55;
  }
  .nav-bar-path-label {
    display: block;
    min-width: 0;
    flex: 1;
  }

  /* --- No tag groups: the tags are the section labels, still a link and an arrow --- */
  .tags-as-labels .nav-bar-tag-and-paths {
    margin-top: 18px;
  }
  .tags-as-labels .nav-bar-tag-and-paths > .nav-bar-tag {
    min-height: 30px;
    font-size: var(--font-size-xs);
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--sidebar-label-foreground);
  }
  .tags-as-labels .nav-bar-tag-and-paths > .nav-bar-tag:hover {
    color: var(--sidebar-accent-foreground);
  }
  .tags-as-labels .nav-bar-tag-and-paths > .nav-bar-tag.active,
  .tags-as-labels .nav-bar-tag-and-paths.collapsed:has(.nav-bar-path.active) > .nav-bar-tag {
    color: var(--sidebar-primary);
  }
  .tags-as-labels .nav-bar-tag-and-paths > .nav-bar-tag .nav-bar-tag-icon {
    width: 24px;
    height: 24px;
  }
  .tags-as-labels .nav-bar-tag-and-paths > .nav-bar-paths-under-tag {
    margin-inline-start: 0;
    padding-inline-start: 0;
    padding-top: 2px;
  }
  .tags-as-labels .nav-bar-tag-and-paths > .nav-bar-paths-under-tag::before,
  .tags-as-labels .nav-bar-tag-and-paths > .nav-bar-paths-under-tag > .nav-bar-path.active::before {
    display: none;
  }

  .portal-sidebar-footer-link {
    padding: 16px 12px;
  }

  /* show-badges-in-nav-bar="dot": the operation shows a badge (part nav-badge-dot to restyle it) */
  .nav-badge-dot {
    flex: none;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    align-self: center;
    margin-inline-end: 4px;
  }

  .nav-bar-webhook {
    font-weight: bold;
    margin-inline-end: 6px;
    font-size: var(--font-size-xs);
    flex-shrink: 0;
    opacity: 0.7;
  }

  /* A path in place of the summary (use-path-in-nav-bar); also in the static navigation, which has no font styles */
  .nav-bar-path-label .mono-font {
    font-family: var(--font-mono);
  }

  /* show-method-in-nav-bar: the method leads the row, in a column of its own */
  .nav-method {
    flex: none;
    min-width: 3.6em;
    font-family: var(--font-mono);
    font-size: calc(var(--font-size-xs) - 1px);
    font-weight: 700;
    line-height: 1.4;
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
    min-width: 32px;
    padding: 1px 4px;
    box-sizing: border-box;
    text-align: center;
    border-radius: 4px;
    color: var(--method-badge-fg);
    background: var(--method-default);
    font-weight: 600;
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

  /* nav-item-overflow: ellipsis (default) vs wrap; section labels always cut off */
  .nav-bar-section-label,
  :host([nav-item-overflow='ellipsis']) :is(.nav-bar-tag-group-title, .nav-bar-tag-title, .nav-bar-path-label, .nav-bar-info-title),
  :host(:not([nav-item-overflow])) :is(.nav-bar-tag-group-title, .nav-bar-tag-title, .nav-bar-path-label, .nav-bar-info-title),
  .overflow-ellipsis :is(.nav-bar-tag-group-title, .nav-bar-tag-title, .nav-bar-path-label, .nav-bar-info-title) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :host([nav-item-overflow='wrap']) :is(.nav-bar-tag-title, .nav-bar-path-label, .nav-bar-info-title),
  .overflow-wrap :is(.nav-bar-tag-title, .nav-bar-path-label, .nav-bar-info-title) {
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
    word-break: break-word;
  }
  :host([nav-item-overflow='wrap']) :is(.nav-bar-info, .nav-bar-tag, .nav-bar-path, .nav-bar-h1, .nav-bar-h2),
  .overflow-wrap :is(.nav-bar-info, .nav-bar-tag, .nav-bar-path, .nav-bar-h1, .nav-bar-h2) {
    padding-block: 5px;
  }
`;
