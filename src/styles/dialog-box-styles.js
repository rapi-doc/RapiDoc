import { css } from 'lit-element';

export default css`
  .dialog-box-overlay {
    background-color: rgba(0, 0, 0, 0.4);
    position: fixed;
    z-index: 999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  
  .dialog-box {
    background-color: white;
    margin: 5% auto;
    border: 1px solid #888;
    width: 60vw;
    border-radius: 5px;
  }
  
  .dialog-box-header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e4e4e4;
    padding: 1rem;
  }
  
  .dialog-box-header button {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
    color: #000;
    text-shadow: 0 1px 0 #fff;
    opacity: .5;
    border: none;
    background-color: white;
    transition: all .2s;
    border-radius: 2px;
  }
  
  .dialog-box-header button:hover {
    color: white;
    background-color: var(--primary-color);
  }
  
  .dialog-box-title {
    flex-grow: 1;
  }
  
  h4.dialog-box-title {
    margin: 0;
    padding: 0;
  }
  
  .dialog-box-content {
    padding: 1rem;
    max-height: 80vh;
    overflow: auto;
  }
`;
