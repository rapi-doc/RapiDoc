import { css } from 'lit';

/**
 * Authentication: the security-scheme list in the Authentication section and the
 * security chips on each operation. Loaded by <rapi-doc> and <rapi-doc-mini>.
 */
export default css`
  /* Authentication: one list item per security scheme; OAuth flows nest inside their scheme. */
  .auth-list {
    margin: 0;
    padding: 0;
    list-style: none;
    border: 1px solid var(--border);
    border-radius: min(var(--radius), 0.5rem);
    font-size: var(--font-size-small);
    direction: ltr;
  }

  .auth-scheme {
    padding: var(--auth-scheme-padding);
    margin: 0;
    overflow-wrap: break-word;

    & + .auth-scheme {
      border-top: 1px solid var(--border);
    }
  }

  .auth-scheme-body {
    max-width: 500px;
  }

  .auth-flows {
    padding-left: calc(var(--auth-scheme-padding) * 4);
  }

  @media (max-width: 768px) {
    .auth-flows {
      padding-left: 0;
    }
  }

  /*
   * Operation security chips: a labeled line after the description. A value list (see param-list-styles),
   * so wrapped chips line up under the first chip and each "OR" stays at the end of its line.
   */
  .operation-security.value-list {
    align-items: start;
    margin-block: 12px;
    min-width: 0;
    max-width: 100%;
    font-size: var(--font-size-small);
    line-height: 1.5;
  }
  .security-label-group {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    /* Same height as a chip, so the label sits on the first line of chips */
    min-height: 2em;
  }
  .security-chips {
    row-gap: 4px;
    align-items: center;
  }
  .value-list-items.security-chips > li:not(:last-child)::after {
    content: 'OR';
  }
  .security-label {
    color: var(--muted-foreground);
    font-size: var(--label-heading-font-size);
    font-weight: var(--heading-weight);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .security-lock {
    flex: none;
    stroke: var(--muted-foreground);
  }
  .security-chip {
    display: inline-flex;
    min-width: 0;
    max-width: 100%;
    color: var(--card-foreground);
    border: 1px solid var(--border);
    border-left-width: 4px;

    &.has-details {
      cursor: pointer;
    }
    &.has-details:is(:hover, :focus-within) {
      color: var(--primary);
      border-color: var(--primary);
    }
  }
  .security-chip-label {
    display: block;
    max-width: 240px;
    padding: 2px 4px;
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
      outline-offset: 1px;
    }
  }

  /* Scheme details for a chip: a top-layer popover anchored below it (above when there is no room) */
  .security-popover {
    inset: auto;
    margin: 4px 8px 0 0;
    position-area: bottom span-right;
    position-try-fallbacks: flip-block;
    width: max-content;
    max-width: min(400px, calc(100vw - 16px));
    padding: 6px 8px;
    color: var(--card-foreground);
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: min(var(--radius), 0.5rem);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    font-family: var(--font-sans);
    font-size: var(--font-size-small);
    line-height: 1.5;
    text-align: start;
    overflow-wrap: anywhere;
    cursor: auto;
  }
`;
