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
    --_desc-threshold-default: 75;
    --_field-threshold-default: 48;
  }
  @container (max-width: 650px) {
    :host {
      --_desc-threshold-default: 45;
      --_field-threshold-default: 32;
    }
  }
  @container (min-width: 1200px) {
    :host {
      --_desc-threshold-default: 95;
      --_field-threshold-default: 55;
    }
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
    font-family: var(--font-regular);
    color: var(--muted-foreground);
    flex-shrink: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    display: none;

    & .descr-expand-toggle {
      display: inline-block;
      user-select: none;
      color: var(--foreground);
      cursor: pointer;
      transform: rotate(45deg);
      transition: transform 0.2s ease;
      margin-right: 4px;
      border-radius: 2px;

      &:hover {
        color: var(--primary);
      }

      &:focus-visible {
        outline: 2px solid var(--primary);
      }

      &.expanded-descr {
        transform: rotate(270deg);
      }
    }

    & .m-markdown-small {
      display: inline-block;
      vertical-align: top;
      max-width: 100%;

      & p {
        display: inline;
        margin: 0;

        & + p {
          display: block;
          margin-top: 4px;
        }
      }
    }

    & .item-details {
      display: block;
      margin-top: 2px;
    }
  }

  .expanded-descr {
    & .key-descr {
      max-height: auto;
      overflow: hidden;
      display: none;

      & .descr-expand-toggle {
        transform: rotate(270deg);
      }
    }

    & .more-content {
      display: none;
    }
  }

  .expanded-all-descr .key-descr .descr-expand-toggle {
    display: none;
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
    font-family: var(--font-regular);
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
    color: var(--red);
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
      display: block;
    }
    .expanded-descr .key-descr {
      display: block;
    }
  }
`;
