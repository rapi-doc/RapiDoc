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
    border: 2px solid var(--method-delete);
  }
  .endpoint-head .method.put {
    border: 2px solid var(--method-put);
  }
  .endpoint-head .method.post {
    border: 2px solid var(--method-post);
  }
  .endpoint-head .method.get {
    border: 2px solid var(--method-get);
  }
  .endpoint-head .method.get.deprecated {
    border: 2px solid var(--border);
  }
  .endpoint-head .method.head {
    border: 2px solid var(--method-head);
  }
  .endpoint-head .method.patch {
    border: 2px solid var(--method-patch);
  }
  .endpoint-head .method.options {
    border: 2px solid var(--method-options);
  }

  .head {
    --method-color: var(--method-head);
  }
  .patch {
    --method-color: var(--method-patch);
  }
  .options {
    --method-color: var(--method-options);
  }
  .put {
    --method-color: var(--method-put);
  }
  .post {
    --method-color: var(--method-post);
  }
  .get {
    --method-color: var(--method-get);
  }
  .delete {
    --method-color: var(--method-delete);
  }

  .req-resp-container {
    display: flex;
    margin-top: 16px;
    align-items: stretch;
    flex-wrap: wrap;
    flex-direction: column;
    border-top: 1px solid var(--border);
    min-width: 0;
  }

  .expanded-req-resp-container {
    display: flex;
    margin-top: 16px;
    align-items: stretch;
    flex-wrap: wrap;
    flex-direction: column;
    border-top: none;
    min-width: 0;
  }

  .request-panel,
  .view-mode-request,
  api-response {
    flex: 1 1 auto;
    min-height: 100px;
    min-width: 0;
    padding: 16px 8px;
    overflow: hidden;
    box-sizing: border-box;
  }

  /* View Mode: dashed bottom divider when in column layout */
  .m-endpoint .request-panel,
  .m-endpoint .view-mode-request {
    display: flex;
    flex-direction: column;
    border-width: 0 0 1px 0;
    border-style: dashed;
    border-color: var(--method-color, var(--primary));
  }

  /* Read & Focused Mode: in column layout there should NOT be any dotted line */
  .expanded-endpoint-body .request-panel,
  .expanded-req-resp-container .request-panel {
    display: flex;
    flex-direction: column;
    border: none;
    border-width: 0;
  }

  /* Explicit method color assignments for View Mode */
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
    .req-resp-container,
    .expanded-req-resp-container {
      flex-direction: var(--layout, row);
      flex-wrap: nowrap;
    }
    :host([layout='column']) .req-resp-container,
    :host([layout='column']) .expanded-req-resp-container,
    .req-resp-container.column-layout,
    .expanded-req-resp-container.column-layout {
      flex-direction: column !important;
    }

    /* Column layout overrides */
    :host([layout='column']) .m-endpoint .request-panel,
    :host([layout='column']) .view-mode-request,
    .m-endpoint .request-panel.column-layout,
    .view-mode-request.column-layout {
      border-width: 0 0 1px 0;
      padding: 16px 8px;
    }
    :host([layout='column']) .expanded-endpoint-body .request-panel,
    :host([layout='column']) .expanded-req-resp-container .request-panel,
    .expanded-endpoint-body .request-panel.column-layout,
    .expanded-req-resp-container .request-panel.column-layout {
      border: none !important;
      border-width: 0 !important;
      padding: 16px 8px;
    }

    :host([layout='row']) .req-resp-container,
    :host([layout='row']) .expanded-req-resp-container,
    .req-resp-container.row-layout,
    .expanded-req-resp-container.row-layout {
      flex-direction: row;
    }
    :host([layout='row']) .request-panel,
    :host([layout='row']) .view-mode-request,
    :host([layout='row']) api-response,
    .req-resp-container.row-layout .request-panel,
    .req-resp-container.row-layout .view-mode-request,
    .req-resp-container.row-layout api-response,
    .expanded-req-resp-container.row-layout .request-panel,
    .expanded-req-resp-container.row-layout .view-mode-request,
    .expanded-req-resp-container.row-layout api-response {
      flex: 1 1 0%;
      min-width: 0;
    }

    /* Row layout divider in View Mode: full accent color */
    :host([layout='row']) .m-endpoint .request-panel.row-layout,
    :host([layout='row']) .view-mode-request.row-layout,
    .m-endpoint .request-panel.row-layout,
    .view-mode-request.row-layout {
      border-width: 0 1px 0 0;
      border-style: dashed;
      border-color: var(--method-color, var(--primary));
      padding: 16px 20px 16px 8px;
    }

    /* Row layout divider in Read & Focused Mode: light shade of accent color (50% transparency) */
    :host([layout='row']) .expanded-endpoint-body .request-panel.row-layout,
    :host([layout='row']) .expanded-req-resp-container.row-layout .request-panel,
    .expanded-endpoint-body .request-panel.row-layout,
    .expanded-req-resp-container.row-layout .request-panel {
      border-width: 0 1px 0 0;
      border-style: dashed;
      border-color: color-mix(in srgb, var(--method-color, var(--primary)) 50%, transparent);
      padding: 16px 20px 16px 8px;
    }

    /* Direct 50% opacity overrides for Read / Focused Mode */
    .head .expanded-endpoint-body .request-panel,
    .head .expanded-req-resp-container .request-panel {
      border-color: color-mix(in srgb, var(--yellow) 50%, transparent);
    }
    .patch .expanded-endpoint-body .request-panel,
    .patch .expanded-req-resp-container .request-panel {
      border-color: color-mix(in srgb, var(--yellow) 50%, transparent);
    }
    .options .expanded-endpoint-body .request-panel,
    .options .expanded-req-resp-container .request-panel {
      border-color: color-mix(in srgb, var(--yellow) 50%, transparent);
    }
    .put .expanded-endpoint-body .request-panel,
    .put .expanded-req-resp-container .request-panel {
      border-color: color-mix(in srgb, var(--orange) 50%, transparent);
    }
    .post .expanded-endpoint-body .request-panel,
    .post .expanded-req-resp-container .request-panel {
      border-color: color-mix(in srgb, var(--green) 50%, transparent);
    }
    .get .expanded-endpoint-body .request-panel,
    .get .expanded-req-resp-container .request-panel {
      border-color: color-mix(in srgb, var(--blue) 50%, transparent);
    }
    .delete .expanded-endpoint-body .request-panel,
    .delete .expanded-req-resp-container .request-panel {
      border-color: color-mix(in srgb, var(--red) 50%, transparent);
    }

    :host([layout='row']) api-response,
    .req-resp-container.row-layout api-response,
    .expanded-req-resp-container.row-layout api-response {
      padding: 16px 8px 16px 20px;
    }
    .summary {
      padding: 8px 16px;
    }
  }
`;
