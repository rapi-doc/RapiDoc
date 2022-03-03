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

  .response-panel {
    margin-top: 0;
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

  ::-webkit-scrollbar,
  textarea::-webkit-scrollbar,
  pre::-webkit-scrollbar,
  .nav-scroll::-webkit-scrollbar,
  .tab-buttons::-webkit-scrollbar,
  .main-content::-webkit-scrollbar {
    width: var(--scrollbar-width);
    height: var(--scrollbar-width);
  }

  ::-webkit-scrollbar-thumb,
  textarea::-webkit-scrollbar-thumb,
  pre::-webkit-scrollbar-thumb,
  .nav-scroll::-webkit-scrollbar-thumb,
  .tab-buttons::-webkit-scrollbar-thumb,
  .main-content::-webkit-scrollbar-thumb {
    background-color: var(--scrollbar-thumb-bg-color);
    background-clip: var(--scrollbar-thumb-bg-clip);
    border-radius: var(--scrollbar-thumb-border-radius);
    border: var(--scrollbar-thumb-border);
  }

  ::-webkit-scrollbar-thumb:hover,
  textarea::-webkit-scrollbar-thumb:hover,
  pre::-webkit-scrollbar-thumb:hover,
  .nav-scroll::-webkit-scrollbar-thumb:hover,
  .tab-buttons::-webkit-scrollbar-thumb:hover,
  .main-content::-webkit-scrollbar-thumb:hover {
    background-color: var(--scrollbar-thumb-bg-color-hover);
  }

  ::-webkit-scrollbar-track,
  textarea::-webkit-scrollbar-track,
  pre::-webkit-scrollbar-track,
  .nav-scroll::-webkit-scrollbar-track,
  .tab-buttons::-webkit-scrollbar-track,
  .main-content::-webkit-scrollbar-track {
    background: var(--scrollbar-track-background);
  }

  ::-webkit-scrollbar-corner, 
  textarea::-webkit-scrollbar-corner, 
  pre::-webkit-scrollbar-corner, 
  .nav-scroll::-webkit-scrollbar-corner, 
  .tab-buttons::-webkit-scrollbar-corner, 
  .main-content::-webkit-scrollbar-corner {
    background: transparent;
  }
  
  textarea::-webkit-resizer {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 52.9 52.9' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3CclipPath clipPathUnits='userSpaceOnUse' id='a'%3E%3Cpath d='m.2 46.6 46.5.4V2' fill='none' stroke='%23000' stroke-width='.3'/%3E%3C/clipPath%3E%3C/defs%3E%3Cg clip-path='url(%23a)' transform='translate(4.2 4.2)' fill='none' stroke-width='1.3'%3E%3Cpath d='M-2.9 54 54-2.6' stroke='%23191919'/%3E%3Cpath d='M-2.1 54.8 54.6-1.7' stroke='%23e7e7e7'/%3E%3Cpath d='M3 59.4 59.9 2.9' stroke='%23191919'/%3E%3Cpath d='M3.8 60.2 60.5 3.7' stroke='%23e7e7e7'/%3E%3Cpath d='M8.5 64.6 65.2 8.2' stroke='%23191919'/%3E%3Cpath d='M9.2 65.4 66 9' stroke='%23e7e7e7'/%3E%3Cpath d='m13.8 69.8 56.8-56.4' stroke='%23191919'/%3E%3Cpath d='m14.6 70.7 56.7-56.5' stroke='%23e7e7e7'/%3E%3C/g%3E%3C/svg%3E");
  }
  textarea::placeholder {
    opacity: 1;
    transition: opacity var(--animation-time-basic) ease-in-out;
  }
  textarea:focus::placeholder {
    opacity: 0;
  }

  textarea::-webkit-scrollbar-thumb:hover {
    background-color: var(--scrollbar-thumb-bg-color-hover);
  }
`;
