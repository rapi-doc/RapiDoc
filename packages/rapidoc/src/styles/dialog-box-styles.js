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
    background: var(--bg2);
    padding: 0;
    color: var(--fg2);
    border-radius: 4px;
    max-height: 70vh;
    height: 70vh;
    max-width: 70vw;
    width: 70vw;
    border: 1px solid var(--border-color);
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
    border-bottom: 1px solid var(--light-border-color);
    overflow: hidden;
  }

  .dialog-box-header button {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
    color: var(--fg);
    border: none;
    outline: none;
    background: transparent;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 50%;
    margin-right: -8px;
  }
  .dialog-box-header button:hover {
    border-color: var(--primary-color);
  }

  .dialog-box-content {
    padding: 16px;
    display: block;
    overflow: auto;
    height: 100%;
  }

  .dialog-box-title {
    flex-grow: 1;
    font-size: 24px;
  }
`;
