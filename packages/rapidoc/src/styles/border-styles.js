import { css } from "lit";

export default css`
  .border-top {
    border-top: 1px solid var(--border);
  }
  .border {
    border: 1px solid var(--border);
    border-radius: min(var(--radius), 0.5rem);
  }
  .mar-top-8 {
    margin-top: 8px;
  }
`;
