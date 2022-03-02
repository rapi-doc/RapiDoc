import { css } from 'lit';

/*
This file is reserved for any custom css that developers want to add to
customize their theme. Simply add your css to this file and yarn build.
*/

export default css`
  .tree {
    background-color: var(--color-ground-dark);
  }

  .expanded-endpoint-body > * {
    width: 50%;
  }

  .expanded-req-resp-container {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: calc(var(--base-gap) * 6);
  }

  .m-btn {
    border-radius: 1000px;
    padding: var(--base-gap) calc(var(--base-gap) * 1.5);
    font-size: 1rem;
  }

  .m-btn.thin-border { border-width: 2px; }

  pre,
  select,
  textarea,
  input[type="text"],
  input[type="password"],
  input[type="file"] {
    border-radius: 1000px;
    border: 2px solid var(--color-primary);
    padding: var(--base-gap) calc(var(--base-gap) * 1.5);
    transition: border, background-color 250ms;
  }

  pre,
  select,
  textarea,
  input[type="text"]:focus,
  input[type="password"]:focus,
  input[type="file"]:focus {
    background-color: var(--color-ground-x-dark);
    box-shadow: 0 8px 16px rgb(var(--color-primary) / 30%);
    border-width: 2px;
  }
`;
