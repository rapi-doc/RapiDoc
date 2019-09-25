import { html } from 'lit-element';

export default html`
<style>
  .row, .col{
    display:flex;
  } 
  .row{
    align-items:center;
    flex-direction: row;
  }
  .col{
    align-items:stretch;
    flex-direction: column;
  }
</style>`;
