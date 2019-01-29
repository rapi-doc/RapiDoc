import { LitElement, html } from 'lit-element'; 
import vars from '@/styles/vars';
// Create your custom component
export default class JsonTree extends LitElement {
  render() {
    return html`
      <style>
        .tree{
          font-family: var(--font-mono);
          font-size:12px;
          display:inline-block;
          overflow:hidden;
          width:100%;
        }
        .item{
          white-space: nowrap;
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
      </style>
      <div class="tree">
        ${this.generateTree(this.data)}
      </div>  
    `
  }

  static get properties() {
    return {
      data:{type: Object}
    };
  }

  generateTree(data){
    if (data===null){
      return html`<div class="null" style="display:inline;">null</div>`
    }
    if (typeof data === 'object'){
      let detailType = Array.isArray(data)?"array":"pure_object";
      if (Object.keys(data).length===0){
        return html`${ (Array.isArray(data)?'[ ]':'{ }') }`
      }
      return html`
      <div class="left-bracket expanded ${detailType==='array'?'array':'object'} " @click="${this.toggleExpand}" > ${detailType==='array'?'[':'{'}</div>
        <div class="inside-bracket">
        ${Object.keys(data).map(key => 
          html`<div class="item"> ${detailType==='pure_object'?html`${key}:`:``}${this.generateTree(data[key])}</div>`
        )}
        </div>
      <div class="right-bracket">${detailType==='array'?']':'}'}</div>
      `
    }
    else{
      return typeof data==='string'?html`<span class="${typeof data}">"${data}"</span>`: html`<span class="${typeof data}">${data}</span>`;
    }

  }

  toggleExpand(e){
    console.log(e.target.nextElementSibling);
    if (e.target.classList.contains("expanded")){
      e.target.classList.add("collapsed");
      e.target.classList.remove("expanded");
      e.target.innerHTML = e.target.classList.contains("array")? "[...]":"{...}";
      e.target.nextElementSibling.style.display = "none";
      e.target.nextElementSibling.nextElementSibling.style.display= "none";
    }
    else{
      e.target.classList.remove("collapsed");
      e.target.classList.add("expanded");
      e.target.innerHTML = e.target.classList.contains("array")? "[":"{";
      e.target.nextElementSibling.style.display = "block";
      e.target.nextElementSibling.nextElementSibling.style.display= "block";
    }

    //console.log(e.target.parentElement.querySelectorAll(":scope > .inside-bracket"));
  }
}
// Register the element with the browser
customElements.define('json-tree', JsonTree);
