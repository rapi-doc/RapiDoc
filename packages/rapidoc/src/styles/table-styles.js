import { css } from 'lit';

export default css`
  .table-title {
    font-size: var(--font-size-small);
    font-weight: 600;
    vertical-align: middle;
    margin: 12px 0 4px 0;
  }

  /* Authentication: one list item per security scheme; OAuth flows nest inside their scheme. */
  .auth-list {
    margin: 0;
    padding: 0;
    list-style: none;
    border: 1px solid var(--border);
    border-radius: min(var(--radius), 0.5rem);
    font-size: var(--font-size-small);
    direction: ltr;
  }

  .auth-scheme {
    padding: var(--auth-scheme-padding);
    margin: 0;
    overflow-wrap: break-word;

    & + .auth-scheme {
      border-top: 1px solid var(--border);
    }
  }

  .auth-scheme-body {
    max-width: 500px;
  }

  .auth-flows {
    padding-left: calc(var(--auth-scheme-padding) * 4);
  }

  @media (max-width: 768px) {
    .auth-flows {
      padding-left: 0;
    }
  }
`;
