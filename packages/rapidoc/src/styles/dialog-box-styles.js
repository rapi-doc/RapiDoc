import { css } from 'lit';

export default css`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  .dialog-box {
    position: absolute;
    top: 100px;
    background: var(--card);
    padding: 0;
    color: var(--card-foreground);
    border-radius: var(--card-radius);
    max-height: 70vh;
    height: 70vh;
    max-width: 70vw;
    width: 70vw;
    border: 1px solid var(--border);
    overflow: hidden;
    box-shadow:
      0 14px 28px rgba(0, 0, 0, 0.25),
      0 10px 10px rgba(0, 0, 0, 0.22);
  }

  .dialog-box-header {
    position: sticky;
    top: 0;
    align-self: stretch;
    z-index: 10;
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    padding: 0px 16px;
    min-height: 60px;
    max-height: 60px;
    border-bottom: 1px solid var(--border);
    overflow: hidden;
    border-top-left-radius: var(--card-radius);
    border-top-right-radius: var(--card-radius);
  }

  .dialog-box-header button {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
    color: var(--foreground);
    border: none;
    outline: none;
    background: transparent;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 50%;
    margin-inline-end: -8px;
  }
  .dialog-box-header button:hover {
    border-color: var(--primary);
  }

  .dialog-box-content {
    padding: 1rem;
    display: block;
    overflow: auto;
    height: 100%;
  }

  .dialog-box-title {
    flex-grow: 1;
    font-size: 24px;
  }
`;
