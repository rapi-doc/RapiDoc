import { html } from 'lit-element';

export default html`
  <style>
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
      color:var(--primary-color);
      border-top: 1px dotted var(--primary-color);
    }

    .xxx-of-key {
      font-size:10px; 
      font-weight:bold; 
      background-color:var(--primary-color); 
      color:var(--primary-text); 
      border-radius:2px;
      line-height:18px;
      padding:0px 5px; 
      margin-bottom:1px; 
      display:inline-block;
    }

    .stri, .string, .uri, .url, .byte, .bina, .date, .pass, .ipv4, .ipv4, .uuid, .emai, .host {color:#86b300;}
    .inte, .numb, .number, .int6, .int3, .floa, .doub, .deci .blue {color:#47afe8;}
    .null {color:orangered;}
    .bool, .boolean{color:#b96ff1}
    .enum {color:orange}
    .recu {color:#D4AC0D}
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
    .seperator{
      width:1px;
      align-self:streatch;
      border-left: 1px solid var(--border-color);
      margin : 5px 5px;
    }

    @media only screen and (min-width: 500px) {
      .key-descr {
        display: block;
      }
      .expanded-descr .key-descr{
        display: block;
      }
    }
  </style>
`;
