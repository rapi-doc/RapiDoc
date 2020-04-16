import { html } from 'lit-element';

export default html`
<style>
  .tab-panel {
    border: none;
  }
  .tab-buttons {
    height:30px;
    border-bottom: 1px solid var(--light-border-color) ;
    align-items: stretch;
    overflow-y: hidden;
    overflow-x: auto;
    scrollbar-width: thin;
  }
  .tab-buttons::-webkit-scrollbar{
    height: 1px;
    background-color: var(--border-color);
  }
  .tab-btn {
    border: none;
    border-bottom: 3px solid transparent; 
    white-space: nowrap;
    background-color:transparent;
    cursor:pointer;
    outline:none;
    font-size:var(--font-size-small);
    margin-right:16px;
    padding:1px;
  }
  .tab-btn.active {
    border-bottom: 3px solid var(--primary-color); 
    font-weight:bold;
    color:var(--primary-color);
  }

  .tab-btn:hover {
    color:var(--primary-color);
  }
  .tab-content {
    margin:-1px 0 0 0;
    position:relative;
  }
</style>`;
