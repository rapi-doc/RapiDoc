import { css } from 'lit';

export default css`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  .tr {
    display: flex;
    flex: none;
    width: 100%;
    box-sizing: content-box;
    border-bottom: 1px dotted transparent;
    transition: max-height 0.3s ease-out;
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
  .expanded-all-descr .key-descr .descr-expand-toggle {
    display: none;
  }

  .key-descr .descr-expand-toggle {
    display: inline-block;
    user-select: none;
    color: var(--fg);
    cursor: pointer;
    transform: rotate(45deg);
    transition: transform 0.2s ease;
    margin-right: 4px;
  }

  .key-descr .m-markdown-small {
    display: inline-block;
    vertical-align: top;
    max-width: 100%;
  }
  .key-descr .m-markdown-small p {
    display: inline;
    margin: 0;
  }
  .key-descr .m-markdown-small p + p {
    display: block;
    margin-top: 4px;
  }

  .key-descr .item-details {
    display: block;
    margin-top: 2px;
  }

  .expanded-descr .key-descr .descr-expand-toggle,
  .key-descr .descr-expand-toggle.expanded-descr {
    transform: rotate(270deg);
  }

  .key-descr .descr-expand-toggle:hover {
    color: var(--primary);
  }

  .expanded-descr .more-content {
    display: none;
  }

  .key-descr {
    font-family: var(--font-regular);
    color: var(--muted-foreground);
    flex-shrink: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    display: none;
  }
  .expanded-descr .key-descr {
    max-height: auto;
    overflow: hidden;
    display: none;
  }

  .xxx-of-key {
    font-size: calc(var(--font-size-small) - 2px);
    font-weight: bold;
    background: var(--primary);
    color: var(--primary-foreground);
    border-radius: var(--card-radius);
    line-height: calc(var(--font-size-small) + 6px);
    padding: 0px 5px;
    margin-bottom: 1px;
    display: inline-block;
  }

  .xxx-of-descr {
    font-family: var(--font-regular);
    color: var(--primary);
    font-size: calc(var(--font-size-small) - 1px);
    margin-inline-start: 2px;
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
  }
  .schema-root-type {
    cursor: auto;
    color: var(--card-foreground);
    font-weight: bold;
    text-transform: uppercase;
  }
  .toolbar-item:first-of-type {
    margin: 0 2px 0 0;
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
