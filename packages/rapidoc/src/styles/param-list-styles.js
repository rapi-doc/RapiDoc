import { css } from 'lit';

/**
 * Parameter lists: one `<li class="param">` per parameter on a shared three-column grid
 * (label | input | constraint). Each row is a subgrid, so columns line up across rows and
 * every row draws its own full-width border. Stacks to one column on narrow containers.
 */
export default css`
  .param-list-container {
    container-type: inline-size;
  }

  .param-list {
    display: grid;
    grid-template-columns: var(--param-label-width) minmax(10rem, 1fr) minmax(0, 1.5fr);
    margin: 0;
    padding: 0;
    list-style: none;
    border: 1px solid var(--border);
    border-radius: min(var(--radius), 0.5rem);
    font-size: var(--font-size-small);
    line-height: calc(var(--font-size-small) + 4px);
    word-break: break-word;
    direction: ltr;
  }

  .param {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
    column-gap: var(--param-gap);
    row-gap: var(--param-row-gap);
    padding: var(--param-padding);
    margin: 0;

    & + .param {
      border-top: 1px solid var(--border);
    }
  }

  .param-label {
    grid-column: 1;
    grid-row: 1 / span 2;
    min-width: 0;
  }

  .param-input {
    grid-column: 2;
    min-width: 0;
  }

  /* Constraints: label/value pairs; the labels share one column, so all values start at the same place */
  .param-constraint {
    grid-column: 3;
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
    align-content: start;
    column-gap: var(--value-list-label-gap);
    row-gap: var(--param-row-gap);
    min-width: 0;
    margin: 0;

    & > dd {
      min-width: 0;
      margin: 0;
    }
  }

  .param-details {
    grid-column: 2 / -1;
    min-width: 0;

    &:not(:has(*)) {
      display: none;
    }
  }

  /* Without a constraint, the input takes both right-hand columns; without an input, the constraint does. */
  .param:not(:has(.param-constraint)) .param-input,
  .param:not(:has(.param-input)) .param-constraint {
    grid-column: 2 / -1;
  }

  .param-name,
  .param-type {
    margin: 1px 0;
    text-align: right;
    line-height: 1.35;
  }

  .param-name {
    color: var(--foreground);
    font-family: var(--font-mono);

    &.deprecated {
      color: var(--destructive);
    }
  }

  .param-required {
    color: var(--destructive);
  }

  .param-deprecated-icon {
    stroke: var(--destructive);
    margin-right: -6px;
  }

  .param-type {
    color: var(--muted-foreground);
    font-family: var(--font-sans);
  }

  .param-constraint-label {
    font-weight: 600;
    color: var(--muted-foreground);
  }

  /*
   * Label + values (Allowed values, Examples): wrapped lines hang under the first value,
   * and each separator stays at the end of its line.
   */
  .value-list {
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
    column-gap: var(--value-list-label-gap);
    align-items: baseline;
  }

  .value-list-items {
    display: flex;
    flex-wrap: wrap;
    row-gap: var(--value-list-row-gap);
    margin: 0;
    padding: 0;
    list-style: none;

    & > li {
      margin: 0;
    }

    & > li:not(:last-child)::after {
      content: '┃';
      margin-inline: var(--value-list-gap);
      color: var(--muted-foreground);
    }
  }

  /* Long-format examples: no marker (a triangle reads as a toggle), each entry set off by a thin rule */
  .param-example-list {
    margin: var(--param-row-gap) 0 0;
    padding: 0;
    list-style: none;

    & > li {
      margin: 0 0 var(--param-row-gap);
      padding-inline-start: var(--param-padding);
      border-inline-start: 2px solid var(--border);
    }

    /* The accent appears only when the example can be applied (hover or keyboard focus on its link) */
    & > li:is(:hover, :focus-within) {
      border-inline-start-color: var(--primary);
    }
  }

  @container (max-width: 36rem) {
    .param-list {
      grid-template-columns: minmax(0, 1fr);
    }

    .param-label,
    .param-input,
    .param-constraint,
    .param-details,
    .param:not(:has(.param-constraint)) .param-input,
    .param:not(:has(.param-input)) .param-constraint {
      grid-column: 1;
      grid-row: auto;
    }

    .param-label {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: var(--param-gap);
    }

    .param-name,
    .param-type {
      text-align: start;
    }
  }
`;
