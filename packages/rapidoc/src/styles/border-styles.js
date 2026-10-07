import { css } from 'lit';

export default css`
  .border-top {
    border-top: 1px solid var(--border);
  }
  .border {
    border: 1px solid var(--border);
    border-radius: var(--card-radius);
  }
  .light-border {
    border: 1px solid var(--border);
    border-radius: var(--card-radius);
  }
  .pad-8-16 {
    padding: 8px 16px;
  }
  .pad-top-8 {
    padding-top: 8px;
  }
  .mar-top-8 {
    margin-top: 8px;
  }
`;
