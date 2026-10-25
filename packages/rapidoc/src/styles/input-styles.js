import { css } from 'lit';

export default css`
  /* =========================================================================
     1. BUTTONS (.btn)
     ========================================================================= */
  /*
   * Control sizes. Every button, input and select uses one of these; don't add one-off padding.
   * All are line-height 1.25 + vertical padding + a 1px border, in em of --font-size-small, so they
   * follow the scale attribute (default-scale heights in brackets):
   *   - Default  .btn, input, select       2.15em + 2px (~28px)  panel-level actions and form fields
   *   - Small    .btn-sm, select.select-sm 1.85em + 2px (~24px)  controls inside a panel: Copy, ADD,
   *                                                              response codes, media-type/example pickers
   *   - Param    inputs in a parameter row 2.75em + 2px (~35px)  matches the two-line parameter label
   *                                                              (param-list-styles.js)
   * A fixed line-height keeps mono inputs and sans buttons the same height on every OS font.
   * Buttons are flat: variants differ by fill and border only, never by shadow.
   */
  .btn {
    border-radius: var(--radius);
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.45em 1em;
    font-size: var(--font-size-small);
    outline: 0;
    line-height: 1.25;
    vertical-align: middle;
    text-align: center;
    white-space: nowrap;
    border: 1px solid var(--primary);
    background: color-mix(in srgb, var(--primary) 12%, transparent);
    color: var(--primary);
    user-select: none;
    cursor: pointer;
    transition:
      background 0.2s ease,
      color 0.2s ease,
      border-color 0.2s ease,
      transform 0.1s ease;

    &:hover {
      background: color-mix(in srgb, var(--primary) 28%, transparent);
      color: var(--foreground);
    }

    &:disabled {
      background: var(--muted);
      color: var(--muted-foreground);
      border-color: var(--border);
      cursor: not-allowed;
      opacity: 0.4;
      box-shadow: none;
    }

    &:active {
      filter: brightness(85%);
      transform: scale(0.97);
      transition: scale 0s;
    }

    &:focus-visible {
      outline: none;
      box-shadow: var(--focus-shadow);
    }
  }

  /* Primary Variant (High-priority action: e.g. Try-it, Save, Load) */
  .btn-primary,
  .btn.primary {
    background: var(--primary);
    border-color: var(--primary);
    color: var(--primary-foreground);

    &:hover {
      background: var(--primary);
      filter: brightness(110%);
      color: var(--primary-foreground);
    }
  }

  /* Secondary Variant (Muted surface action) */
  .btn-secondary,
  .btn.secondary {
    background: var(--muted);
    border-color: var(--border);
    color: var(--foreground);
    box-shadow: none;

    &:hover {
      background: color-mix(in srgb, var(--muted) 80%, var(--foreground));
      color: var(--foreground);
    }
  }

  /*
   * Outline Variant: the form-field border (--input) and a faint fill, so it reads as the same size as a
   * filled button and matches the input it usually sits next to
   */
  .btn-outline,
  .btn.thin-border {
    border-width: 1px;
    border-color: var(--input);
    background: color-mix(in srgb, var(--foreground) 5%, transparent);
    color: var(--foreground);
    box-shadow: none;

    &:hover {
      background: var(--muted);
      border-color: var(--muted-foreground);
      color: var(--foreground);
    }
  }

  /* Ghost Variant (Borderless, transparent until hover) */
  .btn-ghost,
  .btn.ghost {
    border-color: transparent;
    background: transparent;
    color: var(--muted-foreground);
    box-shadow: none;

    &:hover {
      background: var(--muted);
      color: var(--foreground);
    }
  }

  /* Destructive Variant (Danger / Clear / Reset actions) */
  .btn-destructive,
  .btn.destructive {
    border-color: var(--method-delete);
    background: color-mix(in srgb, var(--method-delete) 15%, transparent);
    color: var(--method-delete);

    &:hover {
      background: var(--method-delete);
      color: #ffffff;
    }
  }

  /* Link Variant */
  .btn-link,
  .btn.link {
    border-color: transparent;
    background: transparent;
    color: var(--blue);
    box-shadow: none;
    text-decoration: underline;
    padding: 0;
  }

  /* Sizes */
  .btn-lg,
  .btn.large {
    padding: 0.55em 1.1em;
    font-size: var(--font-size-regular);
  }
  /* Small: same size as the file input's Choose File button */
  .btn-sm,
  .btn.small {
    padding: 0.3em 0.75em;
    font-size: var(--font-size-small);
  }
  .btn-xs,
  .btn.tiny {
    padding: 0.2em 0.5em;
    font-size: var(--font-size-xs);
  }
  .btn-icon,
  .btn.circle {
    border-radius: 50%;
    padding: 0.35em;
    width: calc(2.15em + 2px);
    height: calc(2.15em + 2px);
    min-width: calc(2.15em + 2px);
  }
  .btn.nav {
    border: 1px solid var(--primary);

    &:hover {
      background: var(--primary);
    }
  }

  /* =========================================================================
     2. BADGES (.badge)
     ========================================================================= */
  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius);
    padding: 2px 6px;
    font-size: var(--font-size-xs);
    font-weight: 600;
    line-height: 1;
    white-space: nowrap;
    border: 1px solid transparent;
    background: var(--primary);
    color: var(--primary-foreground);
    user-select: none;
  }
  .badge-secondary {
    background: var(--muted);
    color: var(--foreground);
    border-color: var(--border);
  }
  .badge-outline {
    background: transparent;
    color: var(--foreground);
    border-color: var(--border);
  }
  .badge-destructive {
    background: color-mix(in srgb, var(--method-delete) 15%, transparent);
    color: var(--method-delete);
    border-color: var(--method-delete);
  }
  .badge-sm {
    padding: 1px 4px;
    font-size: var(--font-size-xs);
  }

  /* =========================================================================
     3. FORM INPUTS (.input)
     ========================================================================= */
  .input,
  input,
  textarea,
  select,
  pre {
    color: var(--foreground);
    outline: none;
    background: var(--input-background);
    border: 1px solid var(--input);
    border-radius: var(--radius);
  }
  textarea,
  pre {
    border-radius: min(var(--radius), 0.5rem);
  }
  pre {
    background: var(--code-bg);
  }
  button {
    font-family: var(--font-sans);
    color: var(--foreground);
  }

  /* Form Inputs */
  .input,
  pre,
  select,
  textarea,
  input[type='file'],
  input[type='text'],
  input[type='password'] {
    font-family: var(--font-mono);
    font-weight: 400;
    font-size: var(--font-size-small);
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
    padding: 6px 8px;
  }

  /* Single-line fields: same height as .btn (see above); middle-aligned so mono and sans baselines don't offset them */
  .input,
  select,
  input[type='text'],
  input[type='password'] {
    line-height: 1.25;
    padding: 0.45em 0.75em;
    vertical-align: middle;
  }

  .input:focus,
  .input:focus-visible,
  input[type='text']:focus,
  input[type='text']:focus-visible,
  input[type='password']:focus,
  input[type='password']:focus-visible,
  textarea:focus,
  textarea:focus-visible {
    border-color: var(--primary);
    box-shadow: var(--focus-shadow);
  }

  .input-sm {
    padding: 0.3em 0.5em;
    font-size: var(--font-size-small);
  }

  select {
    font-family: var(--font-sans);
    padding-right: 2.25em;
    background-image: url('data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%3E%3Cpath%20d%3D%22M10.3%203.3L6%207.6%201.7%203.3A1%201%200%2000.3%204.7l5%205a1%201%200%20001.4%200l5-5a1%201%200%2010-1.4-1.4z%22%20fill%3D%22%23777777%22%2F%3E%3C%2Fsvg%3E');
    background-position: calc(100% - 5px) center;
    background-repeat: no-repeat;
    background-size: 10px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    cursor: pointer;
  }

  select:hover {
    border-color: var(--primary);
  }

  @supports (appearance: base-select) {
    select,
    select::picker(select) {
      appearance: base-select;
    }

    select {
      background-image: none;
      padding-right: 0.75em;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
    }

    select:focus-visible {
      outline: none;
      border-color: var(--primary);
      box-shadow: var(--focus-shadow);
    }

    select::picker(select) {
      background: var(--input-background);
      color: var(--foreground);
      border: 1px solid var(--input);
      border-radius: var(--radius);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
      padding: 4px;
      font-family: var(--font-sans);
      font-size: var(--font-size-small);
      scrollbar-width: thin;
      scrollbar-color: var(--input) var(--input-background);
    }

    select option {
      display: flex;
      align-items: center;
      padding: 4px 6px;
      border-radius: var(--radius);
      color: var(--foreground);
      background: transparent;
      cursor: pointer;
      font-family: var(--font-sans);
      font-size: var(--font-size-small);
      transition:
        background 0.15s ease,
        color 0.15s ease;
    }

    select option:hover,
    select option:focus-visible {
      background: var(--primary);
      color: var(--primary-foreground);
    }

    select option:checked {
      background: color-mix(in srgb, var(--primary) 8%, transparent);
      color: var(--foreground);
      font-weight: 500;
    }

    select option:checked:hover,
    select option:checked:focus-visible {
      background: var(--primary);
      color: var(--primary-foreground);
    }

    select::picker-icon {
      content: '';
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 12px;
      height: 12px;
      margin-left: 8px;
      background-color: var(--muted-foreground);
      -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")
        no-repeat center / contain;
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")
        no-repeat center / contain;
      transform-origin: center center;
      transition:
        transform 0.2s ease,
        background-color 0.15s ease;
    }

    select:hover::picker-icon {
      background-color: var(--primary);
    }

    select:open::picker-icon {
      transform: rotate(180deg);
    }

    select option::checkmark {
      content: '➜';
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      margin-right: 8px;
      line-height: 1;
      font-size: var(--font-size-xs);
      color: var(--primary);
      flex-shrink: 0;
    }

    select option:not(:checked)::checkmark {
      visibility: hidden;
    }

    select option:hover::checkmark,
    select option:focus-visible::checkmark,
    select option:checked:hover::checkmark,
    select option:checked:focus-visible::checkmark {
      color: var(--primary-foreground);
    }
  }

  textarea::placeholder,
  input[type='text']::placeholder,
  input[type='password']::placeholder {
    color: var(--muted-foreground);
    opacity: 1;
  }

  /* Outer box: 2px border + (0.9em - 2px) + inner button (1.85em + 2px) = 2.75em + 2px, the text-input height */
  input[type='file'] {
    font-family: var(--font-sans);
    padding: calc(0.45em - 1px);
    cursor: pointer;
    background: var(--input-background);
    border: 1px solid var(--input);
    border-radius: var(--radius);
  }

  input[type='file']::file-selector-button,
  input[type='file']::-webkit-file-upload-button {
    font-family: var(--font-sans);
    font-size: var(--font-size-small);
    outline: none;
    cursor: pointer;
    line-height: 1.25;
    padding: 0.3em 0.75em;
    border: 1px solid var(--primary);
    background: var(--primary);
    color: var(--primary-foreground);
    border-radius: var(--radius);
    -webkit-appearance: none;
  }

  pre,
  textarea {
    scrollbar-width: thin;
    scrollbar-color: var(--input) var(--input-background);
  }

  pre::-webkit-scrollbar,
  textarea::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  pre::-webkit-scrollbar-track,
  textarea::-webkit-scrollbar-track {
    background: var(--input-background);
  }

  pre::-webkit-scrollbar-thumb,
  textarea::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: var(--input);
  }

  .link {
    font-size: var(--font-size-small);
    text-decoration: underline;
    color: var(--blue);
    font-family: var(--font-mono);
    margin-bottom: 2px;
  }

  /*
   * Checkboxes render as a switch: a 3em x 1.5em track with a round thumb that slides 1.5em when checked.
   * Sized in em of --font-size-small, so it follows the scale attribute.
   */
  input[type='checkbox'] {
    appearance: none;
    position: relative;
    flex: none;
    box-sizing: border-box;
    width: 3em;
    height: 1.5em;
    margin: 0;
    font-size: var(--font-size-small);
    vertical-align: middle;
    background: var(--muted);
    border: 1px solid var(--input);
    border-radius: 999px;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease;

    &::after {
      content: '';
      position: absolute;
      top: 1px;
      left: 1px;
      width: calc(1.5em - 4px);
      height: calc(1.5em - 4px);
      border-radius: 50%;
      background: var(--background);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      transition: transform 0.2s ease;
    }

    &:checked {
      background: var(--green);
      border-color: var(--green);
    }

    &:checked::after {
      transform: translateX(1.5em);
    }

    &:focus-visible {
      outline: none;
      box-shadow: var(--focus-shadow);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (prefers-reduced-motion: reduce) {
      &,
      &::after {
        transition: none;
      }
    }
  }
`;
