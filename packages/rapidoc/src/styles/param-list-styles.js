import { css } from "lit";

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
    /* Card surface: --card, partly transparent so a background gradient shows through */
    background: color-mix(in srgb, var(--card) 80%, transparent);
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

  /*
   * Single-line controls match the two-line label (name over type: 2 x 1.35em + 3px). A fixed line-height
   * keeps mono and sans controls the same height: 1.25em + 2 x 0.75em + 2px border = 2.75em + 2px.
   * <tag-input> and file inputs reach the same height in tag-input.ts and input-styles.js.
   */
  .param-input :is(input[type='text'], input[type='password'], select) {
    line-height: 1.25;
    padding: 0.75em;
  }

  /* Room for the background-image arrow where the native select is still drawn */
  @supports not (appearance: base-select) {
    .param-input select {
      padding-right: 2.25em;
    }
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

  /*
   * Clickable values (allowed values, examples): small mono chips that fill the parameter's input.
   * Buttons, not links: a tinted hover instead of an underline. Read-only (disabled) when try-it is off.
   */
  .value-chip {
    display: inline-block;
    max-width: 100%;
    margin: 0;
    padding: 0 0.4em;
    font: inherit;
    font-family: var(--font-mono);
    line-height: inherit;
    text-align: start;
    overflow-wrap: anywhere;
    color: var(--foreground);
    background: color-mix(in srgb, var(--foreground) 6%, transparent);
    border: none;
    border-radius: var(--radius);
    cursor: pointer;
    transition:
      background-color 0.15s ease,
      color 0.15s ease;

    &:hover {
      color: var(--primary);
      background: color-mix(in srgb, var(--primary) 14%, transparent);
    }
    &:focus-visible {
      outline: none;
      box-shadow: var(--focus-shadow);
    }
    &:disabled {
      color: var(--foreground);
      background: color-mix(in srgb, var(--foreground) 6%, transparent);
      cursor: text;
      user-select: text;
    }
  }

  /* A list of chips is spaced apart instead of using the ┃ separators */
  .value-list-items:has(> li > .value-chip) {
    column-gap: 0.375em;

    & > li::after {
      content: none;
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
