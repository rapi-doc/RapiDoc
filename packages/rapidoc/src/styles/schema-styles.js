import { css } from "lit";

export default css`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  :host {
    container-type: inline-size;
    interpolate-size: allow-keywords;
  }
  .tr {
    display: flex;
    flex: none;
    width: 100%;
    box-sizing: content-box;
    border-bottom: 1px dotted transparent;
    transition: max-height 0.3s ease-out;

    &.expanded-descr {
      max-height: 3000px;

      @supports (interpolate-size: allow-keywords) {
        max-height: max-content;
      }
    }
  }
  .td {
    display: block;
    flex: 0 0 auto;
  }
  .key {
    font-family: var(--font-mono);
    white-space: normal;
    word-break: break-all;
  }

  .collapsed-all-descr .key {
    overflow: hidden;
  }
  .key-descr {
    font-family: var(--font-sans);
    color: var(--muted-foreground);
    flex-shrink: 1;
    min-width: 0;
    gap: 4px;
    align-items: flex-start;
    overflow: hidden;
    display: none;

    /* in the description box's start padding, so descriptions line up whether or not a row shows its arrow */
    & .descr-expand-toggle {
      position: absolute;
      top: 0;
      inset-inline-start: 0;
      width: 1em;
      text-align: center;
      user-select: none;
      color: var(--foreground);
      font-weight: 400;
      cursor: pointer;
      transform: rotate(45deg);
      transition: transform 0.2s ease;
      border-radius: 2px;
      visibility: hidden;

      &:hover {
        color: var(--primary);
      }

      &:focus-visible {
        outline: 2px solid var(--primary);
      }
    }

    & .descr-body {
      flex: 1;
      min-width: 0;
      position: relative;
      padding-inline-start: calc(1em + 4px);

      /* the arrow comes first, so the first block is no longer :first-child for the markdown margins */
      & > .descr-expand-toggle + * {
        margin-top: 0;
      }

      & .item-details {
        margin-top: 2px;
      }

      & .descr-chip {
        display: inline-block;
        line-break: anywhere;
        margin-right: 8px;
      }

      /* one-line stand-in for a table, code block, HTML block or blockquote; shown only in collapsed rows */
      & .descr-summary {
        display: none;
      }
      & .descr-placeholder {
        color: var(--muted-foreground);
      }
    }

    /* constraint chips and array limits: "Allowed:", "Min Items:" … then the value in mono */
    & .descr-label,
    & b {
      font-weight: 500;
      font-size: var(--font-size-xs);
      color: var(--primary);
    }
    & .descr-value {
      font-family: var(--font-mono);
      font-size: var(--font-size-small);
      line-height: 1; /* the mono font's metrics would otherwise make the line 1px taller */
    }
  }

  /* -90deg rather than 270deg: same direction, but it turns anticlockwise to expand and clockwise to collapse */
  .expanded-descr .key-descr .descr-expand-toggle {
    transform: rotate(-90deg);
  }

  /*
   * The arrow shows when the row has hidden content, and on an expanded row so it can be collapsed again.
   * Rows cut off for length get it from the scroll-state query below.
   */
  .key-descr .descr-body.has-more > .descr-expand-toggle,
  .tr.expanded-descr .key-descr .descr-expand-toggle {
    visibility: visible;
  }

  /* hidden, not removed, so switching to multiline doesn't shift the descriptions sideways */
  .expanded-all-descr .tr .key-descr .descr-body > .descr-expand-toggle {
    visibility: hidden;
  }

  /* a row expanded by clicking collapses again on click */
  .collapsed-all-descr .tr.expanded-descr .descr-body {
    cursor: pointer;
  }

  /* Collapsed rows: only the first block (or the chips), on one line, with a plain ellipsis (in the text color) when it is cut off */
  .collapsed-all-descr .tr:not(.expanded-descr) .descr-body {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--foreground);

    /* only rows that expand on click look clickable; cut-off rows get the pointer from the scroll-state query below */
    &.has-more {
      cursor: pointer;
    }

    /* the first block after the arrow */
    & > .descr-expand-toggle + * {
      display: inline;
      margin: 0;
      padding: 0;
      white-space: inherit;
    }
    & > .descr-expand-toggle + :is(ul, ol) > li {
      display: inline;
    }
    /* a heading on the one line reads as the description, not as a section title */
    & > .descr-expand-toggle + :is(h1, h2, h3, h4, h5, h6) {
      font-size: var(--font-size-description);
      line-height: inherit;
      font-weight: 600;
    }
    /* inline so a long chip is cut mid-text: an inline-block chip is dropped whole, leaving the ellipsis far from the edge */
    & .descr-chip {
      display: inline;
    }
    & > .descr-expand-toggle + :is(ul, ol) > li:not(:first-child),
    & > .descr-expand-toggle + * ~ * {
      display: none;
    }
  }

  /* Where scroll-state queries work (Chromium), a row whose line is cut off shows the arrow too */
  @supports (container-type: scroll-state) {
    .collapsed-all-descr .tr:not(.expanded-descr) .descr-body {
      container-type: scroll-state;
    }
    @container scroll-state(scrollable: inline-end) {
      .descr-body > * {
        cursor: pointer;
      }
      .descr-body > .descr-expand-toggle {
        visibility: visible;
      }
    }
  }

  .xxx-of-key {
    font-size: var(--font-size-xs);
    line-height: calc(var(--font-size-small) + 1px);
    padding: 1px 6px;
    border-radius: var(--radius);
    corner-shape: squircle;
    border: 1px solid var(--primary);
    background: color-mix(in srgb, var(--primary) 12%, transparent);
    color: var(--primary);
    margin-bottom: 1px;
    display: inline-block;
    vertical-align: middle;
  }

  .xxx-of-descr {
    font-family: var(--font-sans);
    color: var(--primary);
    font-size: var(--font-size-xs);
    margin-inline-start: 4px;
    vertical-align: middle;
  }

  .stri,
  .string,
  .uri,
  .url,
  .byte,
  .bina,
  .date,
  .pass,
  .ipv4,
  .ipv4,
  .uuid,
  .emai,
  .host {
    color: var(--green);
  }
  .inte,
  .numb,
  .number,
  .int6,
  .int3,
  .floa,
  .doub,
  .deci .blue {
    color: var(--blue);
  }
  .null {
    color: var(--destructive);
  }
  .bool,
  .boolean {
    color: var(--orange);
  }
  .enum {
    color: var(--purple);
  }
  .cons {
    color: var(--purple);
  }
  .recu {
    color: var(--brown);
  }
  .toolbar {
    display: flex;
    width: 100%;
    padding: 2px 0;
    color: var(--primary);
  }
  .toolbar-item {
    cursor: pointer;
    padding: 5px 0;
    margin: 0 2px;

    &:first-of-type {
      margin: 0 2px 0 0;
    }
  }
  .schema-root-type {
    cursor: auto;
    color: var(--muted-foreground);
    font-weight: 600;
    text-transform: uppercase;
  }

  @container (min-width: 500px) {
    .key-descr {
      display: flex;
    }
  }
`;
