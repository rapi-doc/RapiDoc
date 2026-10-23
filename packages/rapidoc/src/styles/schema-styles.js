import { css } from 'lit';

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

    & .descr-expand-toggle {
      flex: none;
      width: 1em;
      text-align: center;
      user-select: none;
      color: var(--foreground);
      cursor: pointer;
      transform: rotate(45deg);
      transition: transform 0.2s ease;
      border-radius: 2px;

      &:hover {
        color: var(--primary);
      }

      &:focus-visible {
        outline: 2px solid var(--primary);
      }

      /* keep the slot so descriptions line up whether or not a row has an arrow */
      &[hidden] {
        display: inline-block;
        visibility: hidden;
      }
    }

    & .descr-body {
      flex: 1;
      min-width: 0;

      & .item-details {
        margin-top: 2px;
      }

      & .descr-more {
        display: none;
      }
    }

    /* constraint chips and array limits: "Allowed:", "Min Items:" … then the value in mono */
    & .descr-label,
    & b {
      font-weight: 600;
    }
    & .descr-value {
      font-family: var(--font-mono);
      font-size: var(--font-size-small);
      line-height: 1; /* the mono font's metrics would otherwise make the line 1px taller */
    }
  }

  .expanded-descr .key-descr .descr-expand-toggle {
    transform: rotate(270deg);
  }

  /* hidden, not removed, so switching to multiline doesn't shift the descriptions sideways */
  .expanded-all-descr .key-descr .descr-expand-toggle {
    visibility: hidden;
  }

  /* a row expanded by clicking collapses again on click */
  .collapsed-all-descr .tr.expanded-descr .descr-body {
    cursor: pointer;
  }

  /* Collapsed rows: only the first block (or the chips), on one line, with a colored ellipsis when it is cut off */
  .collapsed-all-descr .tr:not(.expanded-descr) .descr-body {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--primary);
    font-weight: 700;
    cursor: pointer;

    & > :first-child {
      display: inline;
      margin: 0;
      padding: 0;
      white-space: inherit;
      color: var(--foreground);
      font-weight: 400;
    }
    & > :is(ul, ol):first-child > li {
      display: inline;
    }
    & > :is(ul, ol):first-child > li:not(:first-child),
    & > :not(:first-child):not(.descr-more) {
      display: none;
    }
  }

  /*
   * Where scroll-state queries work, a button-style "…" badge covers the ellipsis, only on rows that are cut off.
   * The ellipsis stays underneath, so a row whose scroll state Chrome doesn't update still shows a cue.
   */
  @supports (container-type: scroll-state) {
    .collapsed-all-descr .tr:not(.expanded-descr) .descr-body {
      container-type: scroll-state;
      position: relative;

      &:not(.has-more) {
        cursor: auto;
      }
    }
    @container scroll-state(scrollable: inline-end) {
      .descr-body > * {
        cursor: pointer;
      }
      .key-descr .descr-body > .descr-more {
        display: inline-block;
        position: absolute;
        top: 1px;
        right: 0;
        padding: 0 4px;
        line-height: calc(var(--font-size-small) + 2px);
        color: var(--primary);
        font-weight: 700;
        background: color-mix(in srgb, var(--primary) 18%, var(--background));
        border: 1px solid color-mix(in srgb, var(--primary) 55%, transparent);
        border-radius: 2px;
        box-shadow: -10px 0 6px -2px var(--background);
      }
      .tr:hover .key-descr .descr-body > .descr-more {
        background: var(--primary);
        color: var(--primary-foreground);
      }
    }
  }

  .xxx-of-key {
    font-size: calc(var(--font-size-small) - 3px);
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
    font-size: calc(var(--font-size-small) - 2px);
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
