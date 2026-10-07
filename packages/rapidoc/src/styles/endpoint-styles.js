import { css } from 'lit';

export default css`
  .only-large-screen {
    display: none;
  }
  .endpoint-head .path {
    display: flex;
    font-family: var(--font-mono);
    font-size: var(--font-size-small);
    align-items: center;
    overflow-wrap: break-word;
    word-break: break-all;
  }

  .endpoint-head .descr {
    font-size: var(--font-size-small);
    color: var(--muted-foreground);
    font-weight: 400;
    align-items: center;
    overflow-wrap: break-word;
    word-break: break-all;
    display: none;
  }

  .m-endpoint {
    border-radius: min(var(--radius), 1rem);
  }
  .m-endpoint.expanded {
    margin-bottom: 16px;
  }
  .m-endpoint > .endpoint-head {
    border-width: 1px 1px 1px 5px;
    border-style: solid;
    border-color: transparent;
    border-top-color: var(--border);
    border-radius: min(var(--radius), 1rem);
    display: flex;
    padding: 6px 16px;
    align-items: center;
    cursor: pointer;
  }
  .m-endpoint > .endpoint-head.expanded {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .m-endpoint > .endpoint-head.put:hover,
  .m-endpoint > .endpoint-head.put.expanded {
    border-color: var(--orange);
    background: color-mix(in srgb, var(--orange) 10%, transparent);
  }
  .m-endpoint > .endpoint-head.post:hover,
  .m-endpoint > .endpoint-head.post.expanded {
    border-color: var(--green);
    background: color-mix(in srgb, var(--green) 10%, transparent);
  }
  .m-endpoint > .endpoint-head.get:hover,
  .m-endpoint > .endpoint-head.get.expanded {
    border-color: var(--blue);
    background: color-mix(in srgb, var(--blue) 10%, transparent);
  }
  .m-endpoint > .endpoint-head.delete:hover,
  .m-endpoint > .endpoint-head.delete.expanded {
    border-color: var(--red);
    background: color-mix(in srgb, var(--red) 10%, transparent);
  }

  .m-endpoint > .endpoint-head.head:hover,
  .m-endpoint > .endpoint-head.head.expanded,
  .m-endpoint > .endpoint-head.patch:hover,
  .m-endpoint > .endpoint-head.patch.expanded,
  .m-endpoint > .endpoint-head.options:hover,
  .m-endpoint > .endpoint-head.options.expanded {
    border-color: var(--yellow);
    background: color-mix(in srgb, var(--yellow) 10%, transparent);
  }

  .m-endpoint > .endpoint-head.deprecated:hover,
  .m-endpoint > .endpoint-head.deprecated.expanded {
    border-color: var(--border);
    filter: opacity(0.6);
  }

  .m-endpoint .endpoint-body {
    flex-wrap: wrap;
    padding: 16px 0px 0 0px;
    border-width: 0px 1px 1px 5px;
    border-style: solid;
    border-bottom-left-radius: min(var(--radius), 1rem);
    border-bottom-right-radius: min(var(--radius), 1rem);
    box-shadow: 0px 4px 3px -3px rgba(0, 0, 0, 0.15);
  }
  .m-endpoint .endpoint-body.delete {
    border-color: var(--red);
  }
  .m-endpoint .endpoint-body.put {
    border-color: var(--orange);
  }
  .m-endpoint .endpoint-body.post {
    border-color: var(--green);
  }
  .m-endpoint .endpoint-body.get {
    border-color: var(--blue);
  }
  .m-endpoint .endpoint-body.head,
  .m-endpoint .endpoint-body.patch,
  .m-endpoint .endpoint-body.options {
    border-color: var(--yellow);
  }

  .m-endpoint .endpoint-body.deprecated {
    border-color: var(--border);
    filter: opacity(0.6);
  }

  .endpoint-head .deprecated {
    color: var(--muted-foreground);
    filter: opacity(0.6);
  }

  .summary {
    padding: 8px 8px;
  }
  .summary .title {
    font-size: calc(var(--font-size-regular) + 2px);
    margin-bottom: 6px;
    word-break: break-all;
  }

  .endpoint-head .method {
    padding: 2px 5px;
    vertical-align: middle;
    font-size: var(--font-size-small);
    height: calc(var(--font-size-small) + 16px);
    line-height: calc(var(--font-size-small) + 8px);
    width: 60px;
    border-radius: var(--radius);
    display: inline-block;
    text-align: center;
    font-weight: bold;
    text-transform: uppercase;
    margin-inline-end: 5px;
  }
  .endpoint-head .method.delete {
    border: 2px solid var(--red);
  }
  .endpoint-head .method.put {
    border: 2px solid var(--orange);
  }
  .endpoint-head .method.post {
    border: 2px solid var(--green);
  }
  .endpoint-head .method.get {
    border: 2px solid var(--blue);
  }
  .endpoint-head .method.get.deprecated {
    border: 2px solid var(--border);
  }
  .endpoint-head .method.head,
  .endpoint-head .method.patch,
  .endpoint-head .method.options {
    border: 2px solid var(--yellow);
  }

  .req-resp-container {
    display: flex;
    margin-top: 16px;
    align-items: stretch;
    flex-wrap: wrap;
    flex-direction: column;
    border-top: 1px solid var(--border);
  }

  .expanded-req-resp-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 0;
  }

  .view-mode-request,
  api-response.view-mode {
    flex: 1;
    min-height: 100px;
    padding: 16px 8px;
    overflow: hidden;
  }
  .view-mode-request {
    border-width: 0 0 1px 0;
    border-style: dashed;
  }

  .head .view-mode-request,
  .patch .view-mode-request,
  .options .view-mode-request {
    border-color: var(--yellow);
  }
  .put .view-mode-request {
    border-color: var(--orange);
  }
  .post .view-mode-request {
    border-color: var(--green);
  }
  .get .view-mode-request {
    border-color: var(--blue);
  }
  .delete .view-mode-request {
    border-color: var(--red);
  }

  @container (min-width: 860px) {
    .only-large-screen {
      display: block;
    }
    .endpoint-head .path {
      font-size: var(--font-size-regular);
    }
    .endpoint-head .descr {
      display: flex;
    }
    .endpoint-head .m-markdown-small,
    .descr .m-markdown-small {
      display: block;
    }
    .req-resp-container {
      flex-direction: var(--layout, row);
      flex-wrap: nowrap;
    }
    :host([layout='column']) .req-resp-container,
    .req-resp-container.column-layout {
      flex-direction: column !important;
    }
    :host([layout='column']) .view-mode-request,
    .view-mode-request.column-layout {
      border-width: 0 0 1px 0;
    }
    :host([layout='row']) .expanded-req-resp-container,
    .expanded-req-resp-container.row-layout {
      flex-direction: row;
    }
    :host([layout='row']) .expanded-req-resp-container > api-request,
    :host([layout='row']) .expanded-req-resp-container > api-response,
    .expanded-req-resp-container.row-layout > api-request,
    .expanded-req-resp-container.row-layout > api-response {
      flex: 1 1 0%;
      min-width: 0;
    }
    api-response.view-mode {
      padding: 16px;
    }
    .view-mode-request.row-layout {
      border-width: 0 1px 0 0;
      padding: 16px;
    }
    .summary {
      padding: 8px 16px;
    }
  }
`;
