import { css } from "lit";

/** The Schema tab's fields, and the last general pieces. */
export const schema = css`
  /* The Schema tab's fields: an object field opens to its own fields, indented on a darker band per level */
  table.fields td.field {
    padding-left: calc(8px + var(--depth, 0) * 22px);
    white-space: nowrap;
  }
  .expander,
  .expander-space {
    display: inline-flex;
    width: 20px;
    height: 20px;
    margin-right: var(--space-1);
    vertical-align: middle;
  }
  .expander {
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    background: none;
    color: var(--muted);
  }
  .expander:hover {
    color: var(--strong);
  }
  /* what opens under a row sits on a darker band (the fields of an object here, a category's rules in Lint) */
  table.fields tr.nested td {
    background: var(--inset);
  }
  table.fields tr.depth-2 td,
  table.fields tr.depth-3 td {
    background: color-mix(in oklab, var(--inset), black 12%);
  }
  td.seeded {
    min-width: 200px;
  }
  td.why {
    color: var(--muted);
    min-width: 180px;
  }
  /* an HTTP method as colored text: RapiDoc's hues, lightened to 4.5:1 or more on a card; the name is always written */
  .method {
    --m: var(--plain);
    display: inline-block;
    min-width: 52px;
    color: var(--m);
    font-family: var(--mono);
    font-size: var(--small);
    font-weight: 700;
    letter-spacing: 0.02em;
  }
  .method.get {
    --m: var(--method-get);
  }
  .method.post {
    --m: var(--method-post);
  }
  .method.put {
    --m: var(--method-put);
  }
  .method.patch {
    --m: var(--method-patch);
  }
  .method.delete {
    --m: var(--method-delete);
  }
  .method.head {
    --m: var(--method-head);
  }
  .method.options {
    --m: var(--method-options);
  }
  .method.query {
    --m: var(--method-query);
  }
  pre {
    margin: 0;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }
`;
