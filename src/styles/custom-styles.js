import { css } from 'lit';

/*
This file is reserved for any custom css that developers want to add to
customize their theme. Simply add your css to this file and yarn build.
*/

export default css`
  /* --- Containers --- */
  
  api-request {
    min-width: 0;
  }

  .expanded-endpoint-body > * {
    width: 50%;
  }

  .expanded-endpoint-body > h3 {
    margin-bottom: calc(var(--base-gap) * 2);
  }

  .expanded-req-resp-container {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: calc(var(--base-gap) * 6);
  }

  /* --- Buttons --- */

  .m-btn {
    border-radius: 30px;
    padding: var(--base-gap) calc(var(--base-gap) * 1.5);
    font-size: 1rem;
  }

  .m-btn.thin-border { border-width: 2px; }

  .tab-buttons {
    margin-bottom: var(--base-gap);
    border: none;
  }
  
  .tab-btn {
    border-radius: 0;
  }

  /* --- Inputs --- */

  pre,
  select,
  textarea,
  input[type="text"],
  input[type="password"],
  input[type="file"] {
    border-radius: 30px;
    border: 2px solid var(--color-primary);
    padding: var(--base-gap) calc(var(--base-gap) * 1.5);
    transition: border, background-color 250ms;
  }
  
  textarea {
    border-radius: 10px;
  }

  pre:focus,
  select:focus,
  textarea:focus,
  input[type="text"]:focus,
  input[type="password"]:focus,
  input[type="file"]:focus {
    background-color: var(--color-ground-x-dark);
    box-shadow: 0 8px 16px rgb(var(--color-primary) / 30%);
    border-width: 2px;
  }

  .m-markdown pre {
    border-radius: var(--border-radius);
  }

  /* --- Tables --- */

  .m-table td,
  .m-table th {
    padding: 6px 5px;
  }

  
  

  /* --- Other --- */
  
  .tree, json-tree {
    background-color: var(--bg2);
    padding: calc(var(--base-gap) * 1.5);
    border-radius: var(--border-radius);
  }
  
  .tree code {
    line-break: anywhere;
  }
  
  .example-panel select {
    margin-bottom: var(--base-gap) !important;
  }
  
  .nav-bar-tag:hover {
    color: var(--nav-accent-color);
  }
`;
