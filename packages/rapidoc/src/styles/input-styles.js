import { css } from 'lit';

export default css`
  /* Button */
  .m-btn {
    border-radius: var(--radius);
    font-weight: 600;
    display: inline-block;
    padding: 0.4em 1em;
    font-size: var(--font-size-small);
    outline: 0;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    border: 1px solid var(--primary);
    background: color-mix(in srgb, var(--primary) 12%, transparent);
    color: var(--primary);
    user-select: none;
    cursor: pointer;
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.12),
      0 1px 2px rgba(0, 0, 0, 0.24);
    transition:
      background 0.2s ease,
      color 0.2s ease,
      border-color 0.2s ease,
      transform 0.1s ease;
  }
  .m-btn:hover {
    background: color-mix(in srgb, var(--primary) 28%, transparent);
    color: var(--foreground);
  }
  .m-btn.primary {
    background: var(--primary);
    color: var(--primary-foreground);
  }
  .m-btn.primary:hover {
    background: var(--primary);
    filter: brightness(110%);
    color: var(--primary-foreground);
  }
  .m-btn.thin-border {
    border-width: 1px;
  }
  .m-btn.large {
    padding: 0.55em 1.1em;
  }
  .m-btn.small {
    padding: 0.35em 0.85em;
  }
  .m-btn.tiny {
    padding: 0.3em 0.5em;
  }
  .m-btn.circle {
    border-radius: 50%;
  }
  .m-btn.nav {
    border: 1px solid var(--primary);
  }
  .m-btn.nav:hover {
    background: var(--primary);
  }
  .m-btn:disabled {
    background: var(--muted);
    color: var(--muted-foreground);
    border-color: var(--border);
    cursor: not-allowed;
    opacity: 0.4;
  }
  .m-btn:active {
    filter: brightness(85%);
    transform: scale(0.97);
    transition: scale 0s;
  }
  .toolbar-btn {
    cursor: pointer;
    padding: 4px;
    margin: 0 2px;
    font-size: var(--font-size-small);
    min-width: 50px;
    color: var(--primary-foreground);
    border-radius: var(--radius);
    border: none;
    background: var(--primary);
  }

  input,
  textarea,
  select,
  pre {
    color: var(--foreground);
    outline: none;
    background: var(--input-background);
    border: 1px solid var(--input-border);
    border-radius: var(--radius);
  }
  textarea,
  pre {
    border-radius: var(--card-radius);
  }
  button {
    font-family: var(--font-regular);
    color: var(--foreground);
  }

  /* Form Inputs */
  pre,
  select,
  textarea,
  input[type='file'],
  input[type='text'],
  input[type='password'] {
    font-family: var(--font-mono);
    font-weight: 400;
    font-size: var(--font-size-small);
    transition: border 0.2s;
    padding: 6px 5px;
  }

  select {
    font-family: var(--font-regular);
    padding: 5px 30px 5px 5px;
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

  textarea::placeholder,
  input[type='text']::placeholder,
  input[type='password']::placeholder {
    color: var(--muted-foreground);
    opacity: 1;
  }

  input[type='file'] {
    font-family: var(--font-regular);
    padding: 2px;
    cursor: pointer;
    background: var(--input-background);
    border: 1px solid var(--input-border);
    border-radius: var(--radius);
    min-height: calc(var(--font-size-small) + 1.125rem);
  }

  input[type='file']::file-selector-button,
  input[type='file']::-webkit-file-upload-button {
    font-family: var(--font-regular);
    font-size: var(--font-size-small);
    outline: none;
    cursor: pointer;
    padding: 3px 8px;
    border: 1px solid var(--primary);
    background: var(--primary);
    color: var(--primary-foreground);
    border-radius: var(--radius);
    -webkit-appearance: none;
  }

  pre,
  textarea {
    scrollbar-width: thin;
    scrollbar-color: var(--input-border) var(--input-background);
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
    background: var(--input-border);
  }

  .link {
    font-size: var(--font-size-small);
    text-decoration: underline;
    color: var(--blue);
    font-family: var(--font-mono);
    margin-bottom: 2px;
  }

  /* Toggle Body */
  input[type='checkbox'] {
    appearance: none;
    display: inline-block;
    background: var(--muted);
    border: 1px solid var(--border);
    border-radius: 9px;
    cursor: pointer;
    height: 18px;
    position: relative;
    transition:
      border 0.25s 0.15s,
      box-shadow 0.25s 0.3s,
      padding 0.25s;
    min-width: 36px;
    width: 36px;
    vertical-align: top;
  }
  /* Toggle Thumb */
  input[type='checkbox']:after {
    position: absolute;
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: 8px;
    content: '';
    top: 0px;
    left: 0px;
    right: 16px;
    display: block;
    height: 16px;
    transition:
      border 0.25s 0.15s,
      left 0.25s 0.1s,
      right 0.15s 0.175s;
  }

  /* Toggle Body - Checked */
  input[type='checkbox']:checked {
    background: var(--green);
    border-color: var(--green);
  }
  /* Toggle Thumb - Checked*/
  input[type='checkbox']:checked:after {
    border: 1px solid var(--green);
    left: 16px;
    right: 1px;
    transition:
      border 0.25s,
      left 0.15s 0.25s,
      right 0.25s 0.175s;
  }
`;
