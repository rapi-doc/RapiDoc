import { css } from "lit";

export default css`
  #api-title .version {
    display: inline-block;
    vertical-align: middle;
    margin-inline-start: 0.5em;
    padding: 0.125em 0.5em;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--muted);
    color: var(--muted-foreground);
    font-family: var(--font-mono);
    font-size: var(--font-size-small);
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: normal;
  }

  #api-info {
    font-size: calc(var(--font-size-regular) - 1px);
    margin-top: 8px;
  }

  #api-info span:before {
    content: '|';
    display: inline-block;
    opacity: 0.5;
    width: 15px;
    text-align: center;
  }
  #api-info span:first-child:before {
    content: '';
    width: 0px;
  }

  /* An element without a spec (no spec-url, nothing loading): fades in after a moment, so a page
     that loads the spec from script never shows it */
  .no-spec {
    margin: 1rem;
    padding: 12px;
    border: 1px dashed var(--border);
    border-radius: var(--radius);
    color: var(--muted-foreground);
    font-size: var(--font-size-small);
    opacity: 0;
    animation: no-spec-show 0.2s ease-in 1.5s forwards;
  }
  .no-spec code {
    font-family: var(--font-mono);
    color: var(--foreground);
  }
  @keyframes no-spec-show {
    to {
      opacity: 1;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .no-spec {
      animation-duration: 0s;
    }
  }
`;
