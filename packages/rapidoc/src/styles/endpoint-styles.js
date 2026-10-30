import { css } from "lit";

export default css`
  .only-large-screen {
    display: none;
  }
  .endpoint-head {
    & .path {
      display: flex;
      font-family: var(--font-mono);
      font-size: var(--font-size-small);
      align-items: center;
      overflow-wrap: break-word;
      word-break: break-all;
    }

    & .descr {
      font-size: var(--font-size-small);
      color: var(--muted-foreground);
      font-weight: 400;
      align-items: center;
      overflow-wrap: break-word;
      word-break: break-all;
      display: none;
      margin-inline-start: auto;
      padding-inline-start: 16px;
    }
  }

  .external-docs-box {
    background: var(--muted);
    padding: 2px 8px 8px 8px;
    margin: 8px 0;
    border-radius: min(var(--radius), 0.5rem);
  }

  .external-docs-link {
    font-family: var(--font-mono);
    font-size: var(--font-size-small);
  }

  .external-docs-arrow {
    transform: rotate(270deg) scale(1.5);
    display: inline-block;
    margin-left: 5px;
  }

  .section-expand-collapse-container {
    display: flex;
    justify-content: flex-end;
    gap: 4px;
  }

  /* a block, so it fills the callback box less its indent; width: 100% plus the margin overflowed the box */
  .callback-operation-list {
    margin-left: 16px;
  }

  .callback-operation-item {
    margin-top: 12px;
  }
  /* a callback sits in the request column, too narrow to put its request and response side by side in row layout */
  .callback-operation-item > .expanded-req-resp-container {
    flex-direction: column !important;
  }

  .callback-operation-header {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .callback-method {
    width: 70px;
    border: none;
    margin: 0;
    padding: 0;
    line-height: 20px;
    vertical-align: baseline;
    text-align: left;
  }

  /*
   * Read mode: tag groups and tags. One thin neutral rule above each section. A tag group is a small muted
   * uppercase label (like the sidebar's group headers) that sits directly above its first tag, so the two
   * read as one block under a single rule.
   */
  .read-mode-group,
  .read-mode-tag {
    border-top: 1px solid var(--border);
  }

  .section-gap--read-mode:is(.read-mode-group, .read-mode-tag) {
    padding-top: 24px;
  }

  .section-gap--read-mode.read-mode-group {
    margin-top: 24px;
    padding-bottom: 0;
  }

  .section-gap--read-mode.read-mode-group + .read-mode-tag {
    border-top: none;
    padding-top: 0.5em;
  }

  .rapidoc-heading.title.tag-group {
    margin: 0;
    font-size: var(--font-size-regular);
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted-foreground);
  }

  /* The first operation of a tag has no divider above it (the tag's rule is enough), only space */
  .expanded-endpoint-body[data-first-operation-in-tag='true'] {
    margin-top: 32px;
  }

  .tag-group-description {
    margin-top: 0.5em;
    color: var(--muted-foreground);
  }

  .m-endpoint {
    border-radius: min(var(--radius), 1rem);
    --method-color: var(--method-default);
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
  .m-endpoint > .endpoint-head:hover,
  .m-endpoint > .endpoint-head.expanded {
    border-color: var(--method-color, var(--method-default));
    background: color-mix(in srgb, var(--method-color, var(--method-default)) 10%, transparent);
  }
  .m-endpoint > .endpoint-head.put:hover,
  .m-endpoint > .endpoint-head.put.expanded {
    border-color: var(--method-put);
    background: color-mix(in srgb, var(--method-put) 10%, transparent);
  }
  .m-endpoint > .endpoint-head.post:hover,
  .m-endpoint > .endpoint-head.post.expanded {
    border-color: var(--method-post);
    background: color-mix(in srgb, var(--method-post) 10%, transparent);
  }
  .m-endpoint > .endpoint-head.get:hover,
  .m-endpoint > .endpoint-head.get.expanded {
    border-color: var(--method-get);
    background: color-mix(in srgb, var(--method-get) 10%, transparent);
  }
  .m-endpoint > .endpoint-head.delete:hover,
  .m-endpoint > .endpoint-head.delete.expanded {
    border-color: var(--method-delete);
    background: color-mix(in srgb, var(--method-delete) 10%, transparent);
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
  .m-endpoint > .endpoint-head.trace:hover,
  .m-endpoint > .endpoint-head.trace.expanded {
    border-color: var(--pink);
    background: color-mix(in srgb, var(--pink) 10%, transparent);
  }
  .m-endpoint > .endpoint-head.query:hover,
  .m-endpoint > .endpoint-head.query.expanded {
    border-color: var(--purple);
    background: color-mix(in srgb, var(--purple) 10%, transparent);
  }
  .m-endpoint > .endpoint-head.copy:hover,
  .m-endpoint > .endpoint-head.copy.expanded,
  .m-endpoint > .endpoint-head.purge:hover,
  .m-endpoint > .endpoint-head.purge.expanded {
    border-color: var(--method-color, var(--method-default));
    background: color-mix(in srgb, var(--method-color, var(--method-default)) 10%, transparent);
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
    border-color: var(--method-color, var(--method-default));
    border-bottom-left-radius: min(var(--radius), 1rem);
    border-bottom-right-radius: min(var(--radius), 1rem);
    box-shadow: 0px 4px 3px -3px rgba(0, 0, 0, 0.15);
  }
  .m-endpoint .endpoint-body.get {
    border-color: var(--method-get);
  }
  .m-endpoint .endpoint-body.post {
    border-color: var(--method-post);
  }
  .m-endpoint .endpoint-body.put {
    border-color: var(--method-put);
  }
  .m-endpoint .endpoint-body.delete {
    border-color: var(--method-delete);
  }
  .m-endpoint .endpoint-body.patch {
    border-color: var(--method-patch);
  }
  .m-endpoint .endpoint-body.head {
    border-color: var(--method-head);
  }
  .m-endpoint .endpoint-body.options {
    border-color: var(--method-options);
  }
  .m-endpoint .endpoint-body.trace {
    border-color: var(--method-trace);
  }
  .m-endpoint .endpoint-body.query {
    border-color: var(--method-query);
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
    overflow-wrap: anywhere;
  }

  .endpoint-head .method {
    padding: 2px 5px;
    box-sizing: border-box;
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
    border: 2px solid var(--method-color, var(--method-default));
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
  .endpoint-head .method.trace {
    border: 2px solid var(--method-trace);
  }
  .endpoint-head .method.query {
    border: 2px solid var(--method-query);
  }
  .endpoint-head .method.copy {
    border: 2px solid var(--method-default);
  }
  .endpoint-head .method.purge {
    border: 2px solid var(--method-default);
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
  .trace {
    --method-color: var(--method-trace);
  }
  .query {
    --method-color: var(--method-query);
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
  .copy {
    --method-color: var(--method-default);
  }
  .purge {
    --method-color: var(--method-default);
  }

  /* No flex-wrap: in a wrapping column each line is as wide as its widest content, so stretched
     request/response panels would overflow narrow screens instead of fitting the container. */
  .req-resp-container {
    display: flex;
    margin-top: 16px;
    align-items: stretch;
    flex-direction: column;
    border-top: 1px solid var(--border);
    min-width: 0;
  }

  .expanded-req-resp-container {
    display: flex;
    margin-top: 16px;
    align-items: stretch;
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
    border-color: var(--destructive);
  }
  .trace .view-mode-request {
    border-color: var(--pink);
  }
  .query .view-mode-request {
    border-color: var(--purple);
  }
  .copy .view-mode-request,
  .purge .view-mode-request {
    border-color: var(--method-color, var(--method-default));
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
      flex-direction: row;
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
      border-color: color-mix(in srgb, var(--destructive) 50%, transparent);
    }
    .trace .expanded-endpoint-body .request-panel,
    .trace .expanded-req-resp-container .request-panel {
      border-color: color-mix(in srgb, var(--pink) 50%, transparent);
    }
    .query .expanded-endpoint-body .request-panel,
    .query .expanded-req-resp-container .request-panel {
      border-color: color-mix(in srgb, var(--purple) 50%, transparent);
    }
    .copy .expanded-endpoint-body .request-panel,
    .copy .expanded-req-resp-container .request-panel,
    .purge .expanded-endpoint-body .request-panel,
    .purge .expanded-req-resp-container .request-panel {
      border-color: color-mix(in srgb, var(--method-color, var(--method-default)) 50%, transparent);
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
