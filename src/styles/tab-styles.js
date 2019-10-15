import { html } from 'lit-element';

export default html`
<style>
  .tab-panel{
    border: none;
  }
  .tab-buttons{
    height:30px;
    border-bottom: 1px solid var(--light-border-color) ;
    align-items: stretch;
  }
  .tab-btn{
    border:none;
    background-color:transparent;
    cursor:pointer;
    outline:none;
    font-size:var(--font-size-small);
    margin-right:16px;
    padding:1px;
  }
  .tab-btn.active{
    border-bottom: 3px solid var(--primary-color); 
    font-weight:bold;
    color:var(--primary-color);
  }

  .tab-btn:hover{
    color:var(--primary-color);
  }
  .tab-content{
    margin:-1px 0 0 0;
  }
</style>`;
