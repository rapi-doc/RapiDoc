import { css } from 'lit-element';

/*
This file is reserved for any custom css that developers want to add to
customize their theme. Simply add your css to this file and yarn build.
*/

export default css`
  :host {
    --border-radius: 4px;
    --bg: #21272a;
    --bg2: #21272a;
    --bg3: #21272a;
    --light-bg: #21272a;
    --header-fg: #f2f4f8;
    --fg: #a2a9b0;
    --fg2: #a2a9b0;
    --fg3: #a2a9b0;
    --light-fg: #a2a9b0;
    --selection-bg: #4d5358;
    --selection-fg: #f2f4f8;
    --overlay-bg: rgba(0, 0, 0, 0.4);
    --border-color: #21272a;
    --light-border-color: #21272a;
    --code-border-color: transparent;
    --input-bg: rgba(255, 255, 255, 0.05);
    --placeholder-color: #ffffff;
    --hover-color: rgba(255, 255, 255, 0.05);
    --red: #ff8390;
    --light-red: #fff0f0;
    --pink: #90276b;
    --light-pink: #ffb2b9;
    --green: #7cda98;
    --light-green: #edfcf1;
    --blue: #5ac8fa;
    --light-blue: #eaf6fe;
    --orange: #ffcc00;
    --light-orange: #fcf0e9;
    --yellow: #886c00;
    --light-yellow: #fff3de;
    --purple: #6676d1;
    --brown: #cda400;
    --header-bg: #fff;
    --header-color-darker: #e7e9ee;
    --header-color-border: #ffffff;
    --nav-bg-color: #21272a;
    --nav-text-color: #a2a9b0;
    --nav-hover-bg-color: #21272a;
    --nav-hover-text-color: #f8f9fc;
    --nav-accent-color: #f2f4f8;
    --primary-color: #e7e9ee;
    --primary-color-invert: #21272a;
    --primary-color-trans: rgba(193, 199, 205, 0.8);
    --code-bg: rgba(255, 255, 255, 0.05);
    --code-fg: #a2a9b0;
    --inline-code-fg: #fa8c3d;
    --code-property-color: #ff8390;
    --code-keyword-color: #7cda98;
    --code-operator-color: #ffcc00;
  }

  /* main content container */
  .main-content-inner--read-mode {
    padding: 0 16px;
    padding-bottom: 16px;
  }
  .operations-root {
    max-width: 748px;
    margin: 0 auto;
  }
  .operations-root > section {
    padding-left: 0;
    padding-right: 0;
  }

  /* nav button */
  nav .nav-bar-path {
    font-size: 15px;
    line-height: 20px;
  }

  /* nav section header */
  nav .nav-bar-tag {
    font-size: 15px;
    line-height: 20px;
    text-transform: none !important;
    font-family: "FuturaPTWebMedium";
    margin-top: 16px;
    padding-bottom: 8px;
    cursor: auto !important;
    margin-left: 10px;
  }

  nav .nav-bar-tag.active {
    margin-top: 25px;
    padding-bottom: 8px;
  }

  nav {
    padding-bottom: 16px;
  }

  nav hr {
    margin-top: 24px !important;
    margin-bottom: -4px !important;
  }

  .operations-root > section {
    border-top: none !important;
  }

  .operations-root > section > .divider {
    display: none;
  }

  /* section header */
  section > .tag.title {
    margin-top: 80px;
    font-size: 36px;
    line-height: 48px;
    text-transform: none;
    font-family: "FuturaPTWebMedium";
    color: var(--header-fg);
  }

  /* section subheader */
  .expanded-endpoint-body > h2 {
    padding: 0;
    font-size: 28px;
    line-height: 40px;
    font-family: "FuturaPTWebMedium";
    color: var(--header-fg);
  }

  /* section subheader (custom content) */
  .m-markdown h1 {
    letter-spacing: 0.025em;
    font-size: 28px;
    line-height: 40px;
    font-family: "FuturaPTWebMedium";
    color: var(--header-fg);
  }

  section > .expanded-endpoint-body {
    padding-top: 0;
    padding-bottom: 64px;
  }
  section > .expanded-endpoint-body:last-child {
    padding-bottom: 0;
  }

  .req-res-title {
    font-size: 24px;
    line-height: 32px;
    font-weight: 400;
    text-transform: lowercase;
    color: var(--header-fg);
  }
  .req-res-title::first-letter {
    text-transform: uppercase;
  }

  .table-title {
    color: var(--header-fg);
  }

  button {
    --fg: #f2f4f8;
  }

  button.primary:hover {
    background-color: #fff;
  }

  .mono-font {
    --fg3: #f2f4f8;
  }

  .example textarea {
    --fg: #f2f4f8;
  }

  .request-panel table {
    --fg: #f2f4f8;
    padding: 16px;
    margin: 12px 0px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
  }
  .request-panel table td {
    border-top: none !important;
  }
  .request-panel table tr:last-child td {
    padding: 0 !important;
  }
  .request-panel table input {
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .tab-buttons {
    height: 40px;
    border-bottom: 1px solid transparent;
  }
  .tab-btn {
    font-size: 15px;
    text-transform: lowercase;
  }
  .tab-btn::first-letter {
    text-transform: uppercase;
  }
  .tab-btn.active {
    border-bottom: 2px solid #ff8390;
    border-radius: 0;
  }

  json-tree,
  schema-tree {
    --fg: #f2f4f8;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    border-top-left-radius: 0 !important;
    padding: 8px 16px;
    color: var(--fg);
  }
`;
