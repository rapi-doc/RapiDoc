import { LitElement, html, css } from 'lit-element'; 

export default class TagInput extends LitElement {
  render() {
    return html`
    
    <div class='tags' tabindex="0" contenteditable="true">
      <input type="text" class='editor' @paste="${this.afterPaste}" @keydown="${this.afterKeyDown}" placeholder="${this.placeholder}"/>
    </div>
  `
  }
  static get styles() {
    return [ css`
      .tags{
        display:flex;
        flex-wrap: wrap;
        outline: none;
        padding:0;
        border-radius:var(--border-radius);
        border:1px solid var(--input-border-color);
        cursor:text;
        overflow:hidden;
      }
      .tag, .editor{
        padding:3px;
        margin:2px;
      }
      .tag{
        border:1px solid lightgray;
        background-color:#fafafa;
        border-radius:var(--border-radius);
        word-break: break-all;
        cursor: none;
      }
      .tag:hover ~ #cursor {
        display: block;
      }
      .editor{
        flex:1;
        border:1px solid transparent;
        min-width:60px;
        outline: none;
        line-height: inherit;
        font-family:inherit;
        font-size:inherit;
        color:inherit;
      }
      .editor::placeholder {
        color: var(--placeholder-color);
        opacity:1;
      }
    `]
  }

  static get properties() {
    return {
      placeholder:{ type: String },
    };
  }

  afterPaste(e){
    let clipboardData = e.clipboardData || window.clipboardData;
    let pastedData = clipboardData.getData('Text');
    console.log(pastedData);
  }

  afterKeyDown(e){
    if (e.keyCode === 13) {
      e.stopPropagation();
      e.preventDefault();
      let spanEl = document.createElement('span');
      if (e.target.value.trim()!==''){
        spanEl.innerText = e.target.value;
        e.target.value='';
        spanEl.classList.add('tag');
        spanEl.setAttribute("contenteditable","false");
        this.shadowRoot.querySelector(".tags").insertBefore(spanEl, e.target);
      }
    }
    else if (e.keyCode === 8){
      if (e.target.selectionStart === 0 && e.target.previousSibling){
        e.target.previousSibling.remove();
      }
    }
  }

  getValues(){
    let vals = [];
    let tags = this.shadowRoot.querySelectorAll(".tag");
    for(let tagEl of tags){
      vals.push(tagEl.innerText);
    }
    return vals;
  }
}
// Register the element with the browser
customElements.define('tag-input', TagInput);