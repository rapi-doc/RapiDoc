import vars from './vars';
import {html} from 'lit-element'; 

export default html`
<style>
.m-table {
  border-spacing: 0;  
  border-collapse: separate;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  margin: 0;
  max-width: 100%;
}
.m-table tr:first-child td,
.m-table tr:first-child th {
    border-top: 0 none;
}
.m-table td, 
.m-table th{
  font-size: var(--small-font-size);
  line-height: 16px;
  padding: 4px 5px 4px;
  text-align: left;
  vertical-align: top;
}

.m-table th {
  color: var(--fg2);
  font-size: var(--small-font-size);
  line-height:30px;
  font-weight: 600;
  letter-spacing: normal;
  background-color: var(--bg2);
  vertical-align: bottom;
  border-bottom: 1px solid var(--border-color);
}

.m-table > tbody >tr > td,
.m-table > tr > td{
  border-top: 1px solid var(--light-border-color);
  text-overflow: ellipsis;
  overflow: hidden;
}
.table-title{
  font-size:var(--small-font-size);
  font-weight:bold;
  vertical-align: middle;
  margin: 12px 0 4px 0;
}

</style>`
