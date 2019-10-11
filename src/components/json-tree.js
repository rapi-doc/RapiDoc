import { LitElement, html } from 'lit-element';
import FontStyles from '@/styles/font-styles';

export default class JsonTree extends LitElement {
  /* eslint-disable indent */
  render() {
    return html`
      ${FontStyles}
      <style>
        .tree{
          font-family: var(--font-mono);
          font-size:var(--font-mono-size);
          display:inline-block;
          overflow:hidden;
          word-break: break-all;
          width:100%;
        }
        .left-bracket{
          display:inline-block;
          padding: 0 20px 0 0;
          cursor:pointer;
          border: 1px solid transparent;
          border-radius:3px;
        }
        .left-bracket:hover{
          color:var(--primary-color);
          background-color:var(--hover-color);
          border: 1px solid var(--border-color);
        }
        .inside-bracket{
          padding-left:12px;
          border-left:1px dotted var(--border-color);
        }
        .string{color:#86b300;}
        .number{color:#47afe8;}
        .null{color:orangered;}
        .boolean{color:#b96ff1}
        .object{color:var(--fg)}
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
      </style>
      <div class="tree">
        <div class='toolbar'> 
          <div style="flex:1"></div>
          <div class='toolbar-item' @click='${this.toggleDescrExpand}'> 
            Copy
          </div>
        </div>
        ${this.generateTree(this.data)}
      </div>  
    `;
  }

  generateTree(data) {
    if (data === null) {
      return html`<div class="null" style="display:inline;">null</div>`;
    }
    if (typeof data === 'object') {
      const detailType = Array.isArray(data) ? 'array' : 'pure_object';
      if (Object.keys(data).length === 0) {
        return html`${(Array.isArray(data) ? '[ ]' : '{ }')}`;
      }
      return html`
      <div class="left-bracket expanded ${detailType === 'array' ? 'array' : 'object'} " @click="${this.toggleExpand}" > ${detailType === 'array' ? '[' : '{'}</div>
        <div class="inside-bracket">
        ${Object.keys(data).map((key) => html`<div class="item"> ${detailType === 'pure_object' ? html`${key}:` : ''}${this.generateTree(data[key])}</div>`)}
        </div>
      <div class="right-bracket">${detailType === 'array' ? '],' : '},'}</div>
      `;
    }

    return typeof data === 'string' ? html`<span class="${typeof data}">"${data}"</span>,` : html`<span class="${typeof data}">${data}</span>,`;
  }
  /* eslint-enable indent */

  static get properties() {
    return {
      data: { type: Object },
    };
  }

  toggleExpand(e) {
    if (e.target.classList.contains('expanded')) {
      e.target.classList.add('collapsed');
      e.target.classList.remove('expanded');
      e.target.innerHTML = e.target.classList.contains('array') ? '[...]' : '{...}';
      e.target.nextElementSibling.style.display = 'none';
      e.target.nextElementSibling.nextElementSibling.style.display = 'none';
    } else {
      e.target.classList.remove('collapsed');
      e.target.classList.add('expanded');
      e.target.innerHTML = e.target.classList.contains('array') ? '[' : '{';
      e.target.nextElementSibling.style.display = 'block';
      e.target.nextElementSibling.nextElementSibling.style.display = 'block';
    }

    // console.log(e.target.parentElement.querySelectorAll(":scope > .inside-bracket"));
  }
}
// Register the element with the browser
customElements.define('json-tree', JsonTree);
