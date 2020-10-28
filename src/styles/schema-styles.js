import { css } from 'lit-element';

export default css`
.tr {
  display: flex;
  flex: none;
  width: 100%;
  border-bottom: 1px dotted transparent;
}
.td {
  display: block;
  flex: 0 0 auto;
  box-sizing: border-box;
}
.key {
  font-family: var(--font-mono);
  white-space: normal;
  word-break: break-all;
}

.collapsed-descr .key{
  overflow:hidden;
}

.key-descr {
  font-family:var(--font-regular);
  color:var(--light-fg);
  flex-shrink: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  display: none;
}
.expanded-descr .key-descr{
  max-height:auto;
  overflow:hidden;
  display: none;
}
.collapsed-descr .tr {
  max-height:20px;
}

.tr.xxx-of{
  border-top: 1px dotted var(--primary-color);
}

.xxx-of-key {
  font-size: calc(var(--font-size-small) - 2px); 
  font-weight:bold; 
  background-color:var(--primary-color); 
  color:var(--primary-color-invert); 
  border-radius:2px;
  line-height:calc(var(--font-size-small) + 6px);
  padding:0px 5px; 
  margin-bottom:1px; 
  display:inline-block;
}

.stri, .string, .uri, .url, .byte, .bina, .date, .pass, .ipv4, .ipv4, .uuid, .emai, .host {color:var(--green);}
.inte, .numb, .number, .int6, .int3, .floa, .doub, .deci .blue {color:var(--blue);}
.null {color:var(--red);}
.bool, .boolean{color:var(--purple)}
.enum {color:var(--orange)}
.recu {color:var(--brown)}
.toolbar {
  display:flex;
  width:100%;
  padding: 2px 0;
  color:var(--primary-color);
}
.toolbar-item{
  cursor:pointer;
  padding:5px 0;
  margin:0 2px;
}
.toolbar-item:first-of-type { margin:0 2px 0 0;}

@media only screen and (min-width: 500px) {
  .key-descr {
    display: block;
  }
  .expanded-descr .key-descr{
    display: block;
  }
}
`;
