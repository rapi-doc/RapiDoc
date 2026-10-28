import { css } from 'lit';

/**
 * Authentication: the security-scheme list in the Authentication section and the
 * security chips on each operation. Loaded by <rapi-doc> and <rapi-doc-mini>.
 */
export default css`
  /* Authentication: one list item per security scheme; OAuth flows nest inside their scheme. */
  .auth-status {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .auth-list {
    container-type: inline-size;
    margin: 0;
    padding: 0;
    list-style: none;
    border: 1px solid var(--border);
    border-radius: min(var(--radius), 0.5rem);
    /* Card surface, same as .param-list */
    background: color-mix(in srgb, var(--card) 80%, transparent);
    font-size: var(--font-size-small);
    line-height: 1.5;
    direction: ltr;
  }

  .auth-scheme {
    padding: calc(var(--auth-scheme-padding) * 1.5);
    margin: 0;
    overflow-wrap: break-word;

    & + .auth-scheme {
      border-top: 1px solid var(--border);
    }
  }

  /* Each block of a scheme (header, description, hint, controls, flows) is spaced by the same gap */
  .auth-scheme-body,
  .oauth-flow {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75em;

    & > * {
      margin: 0;
      max-width: 100%;
    }
  }

  .auth-scheme-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5em;
  }

  .auth-scheme-title {
    font-size: var(--font-size-regular);
    font-weight: 600;
  }

  /* Prose (description, "Send X in header") keeps a readable line length */
  .auth-scheme-body > .m-markdown,
  .auth-hint,
  .auth-host-note {
    max-width: 70ch;
  }

  /* "Use a different token" under a host note: a text link, not a full-size button */
  .auth-host-toggle {
    font-size: var(--font-size-small);
  }

  /*
   * Inputs and their button on a grid of equal columns (12em-16em), so a field that wraps to the next
   * line keeps the width of the one above it; the button sits at the start of its cell.
   */
  .auth-controls {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(12em, 16em));
    align-items: center;
    gap: 0.5em;
    width: 100%;

    & > :is(input, select) {
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
    }

    & > .btn {
      justify-self: start;
    }
  }

  /* OAuth flows: one after another, each opened by its heading and parted from the previous one by a dashed rule */
  .oauth-flow {
    padding-block: 1.25em;

    & + .oauth-flow {
      border-top: 1px dashed var(--border);
    }

    &:last-child {
      padding-bottom: 0;
    }

    & > .tiny-title {
      margin: 0;
    }
  }

  .oauth-urls {
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
    gap: 0.25em 1.5em;

    & > dt {
      color: var(--muted-foreground);
    }

    & > dd {
      margin: 0;
      overflow-wrap: anywhere;
    }
  }

  .oauth-scopes-label {
    color: var(--muted-foreground);
    margin-bottom: -0.25em;
  }

  .oauth-scopes {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }

  /* Scope value in the foreground color, its description muted, with a dash between */
  .oauth-scope-name {
    color: var(--foreground);
  }

  .oauth-scope-descr {
    color: var(--muted-foreground);

    &::before {
      content: '– ';
    }
  }

  /* Toggle + its text; the text wraps beside the toggle, not under it. The toggle is 1.5em tall,
     the same as one line of text here, so it lines up with the first line. */
  .auth-toggle {
    display: inline-flex;
    align-items: flex-start;
    gap: 0.625em;
    cursor: pointer;
  }

  .oauth-resp-display:empty {
    display: none;
  }

  /* Narrow containers: fields take the full row; URL labels stack above their values */
  @container (max-width: 30rem) {
    .auth-controls {
      grid-template-columns: minmax(0, 1fr);
    }

    .oauth-urls {
      grid-template-columns: minmax(0, 1fr);

      & > dd + dt {
        margin-top: 0.375em;
      }
    }
  }

  /*
   * Operation security: a lock, then a row of chips right under the method and path, one per alternative,
   * with "OR" between them. The lock marks the row as authorization (and links to the Authentication
   * section when that is shown); a chip opens its details popover on hover or focus.
   */
  .operation-security {
    display: flex;
    align-items: flex-start;
    gap: 0.375em;
    margin: 0 0 12px;
    min-width: 0;
    max-width: 100%;
    font-size: var(--font-size-small);
    line-height: 1.25;
  }
  .security-chips {
    align-items: center;
    row-gap: 6px;

    /* Keeps "OR" centered on the chip beside it */
    & > li {
      display: inline-flex;
      align-items: center;
    }
  }
  .value-list-items.security-chips > li:not(:last-child)::after {
    content: 'OR';
    margin-inline: 0.625em;
    font-size: var(--font-size-xs);
    letter-spacing: 0.04em;
  }
  .security-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.375em;
    min-width: 0;
    max-width: 100%;
    padding: 0.25em 0.625em;
    color: var(--foreground);
    background: color-mix(in srgb, var(--card) 80%, transparent);
    border: 1px solid var(--input);
    /* Same radius as buttons, inputs and the popover it opens */
    border-radius: var(--radius);
    transition:
      color 0.15s ease,
      border-color 0.15s ease;

    &.has-details {
      cursor: pointer;
    }
    &.has-details:is(:hover, :focus-within) {
      color: var(--primary);
      border-color: var(--primary);
    }
  }
  /* Same size as a chip (and .btn-sm), so it lines up with the first row of chips */
  .security-lock-btn {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: calc(1.75em + 2px);
    height: calc(1.75em + 2px);
    color: var(--muted-foreground);
    border-radius: var(--radius);
  }
  a.security-lock-btn {
    transition:
      color 0.15s ease,
      background-color 0.15s ease;

    &:hover {
      color: var(--foreground);
      background: var(--muted);
    }
    &:focus-visible {
      outline: none;
      box-shadow: var(--focus-shadow);
    }
  }
  .security-lock {
    width: 1.25em;
    height: 1.25em;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .security-chip-label {
    display: block;
    max-width: 240px;
    padding: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: inherit;
    text-decoration: none;
    font: inherit;
    background: none;
    border: none;
    border-radius: 0;
    cursor: inherit;

    &:focus-visible {
      outline: 2px solid var(--ring);
      outline-offset: 2px;
    }
  }

  /* Scheme details for a chip: a top-layer popover anchored below it (above when there is no room) */
  /* Left edge on the chip's left edge, 6px below it; a page-colored surface with a thin border and a soft, tight shadow */
  .security-popover {
    inset: auto;
    margin: 6px 0 6px 0;
    position-area: bottom span-right;
    position-try-fallbacks: flip-block;
    width: max-content;
    max-width: min(400px, calc(100vw - 16px));
    padding: 0.75em 1em;
    color: var(--foreground);
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.06),
      0 4px 12px rgba(0, 0, 0, 0.08);
    font-family: var(--font-sans);
    font-size: var(--font-size-description);
    line-height: 1.5;
    text-align: start;
    overflow-wrap: anywhere;
    cursor: auto;
  }
`;
