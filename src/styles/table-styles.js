import vars from './vars';
import {html} from 'lit-element'; 

export default html`
<style>
table {
  border-spacing: 0;
}
td, th {
  display: table-cell;
  vertical-align: inherit;
}

.m-table {
  border-collapse: separate;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  color: ${vars.color.tableFg};
  margin: 0;
  max-width: 100%;
}

.m-table tr:first-child td,
.m-table tr:first-child th {
    border-top: 0 none;
}
.m-table td, 
.m-table th{
    font-size: 12px;
    line-height: 16px;
    padding: 4px 5px 4px;
    text-align: left;
    vertical-align: top;
}

.m-table th {
    color: ${vars.color.tableFg};
    font-size: 12px;
    line-height:30px;
    font-weight: 600;
    letter-spacing: normal;
    background-color: ${vars.color.tableHeaderBg};
    vertical-align: bottom;
    border-bottom: 1px solid var(--border-color);
}

.m-table > tbody >tr > td,
.m-table > tr > td{
    border-top: 1px solid var(--light-border-color);
    text-overflow: ellipsis;
    overflow: hidden;
}

.m-table tr:hover{
    background-color: var(--hover-color);
}
.table-title{
    font-size:12px;
    color:${vars.color.tableTitleFg};
    font-weight:bold;
    vertical-align: middle;
    margin: 12px 0 4px 0;
}

</style>`
