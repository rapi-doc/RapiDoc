import { LitElement, html } from 'lit-element'; 
// Create your custom component
export default class MultiSelect extends LitElement {
  render() {
    return html`
    <style>
      :host{
        display:block;
        border-radius:2px;
        border:1px solid gray;
        position:relative;
      }
      .input-cointainer{
        display:flex;
        align-items: stretch;
        min-height:26px;
        min-width:100px;
        border-radius:2px 0 0 2px;
        width:100%;
      }
      .arrow{
        width:20px;
        background-color:orangered;
        cursor:pointer;
        border-radius:0 2px 2px 0;
      }
      .popup{
        border:1px solid gray;
        display:none;
        flex-direction:column;
        max-height:200px;
        border-radius:0 0 2px 2px;
        position:absolute;
        width:100%;
        margin: -1px;
        background-color:#fdfdfd;
      }
      .option{
        margin:0;
        border-top:1px solid lightgray;
        font-size:12px;
        padding:5px;
      }
      input{
        padding:5px;
        border:none;
        outline:none;
        width:calc(100% - 20px);
      }

    </style>
    <div class="input-cointainer">
      <input type="text"><div class="arrow" @click="${this.toggleList}"> </div>
    </div>
    <div class="popup"> 
      <div class="option"> Option 1</div>
      <div class="option"> Option 2</div>
      <div class="option"> Option 3</div>
    </div>

    `
  }
  constructor() {
    super();
    // Initialize properties 
    this.open = false;
  }

  static get properties() {
    return {
      items: {type: Array},
      open : {type: Boolean}
    };
  }

  outsideClickListener(event){
    console.log("event path", event.composedPath()[1].classList )
    if (event.composedPath().includes("div.popup") === false){
      /*
      let popupEl = me.shadowRoot.querySelector(".popup");
      if (popupEl){
        popupEl.style.display = 'none'
      }
      */
      //document.removeEventListener('click', this.outsideClickListener)
    }
    /*
    if (event.target.closest(".popup") === null) {
      let popupEl = me.shadowRoot.querySelector(".popup");
      if (popupEl){
        popupEl.style.display = 'none'
      }
      document.removeEventListener('click', outsideClickListener)
    }
    */
  }


  toggleList(){
    let me = this;
    let popupEl = this.shadowRoot.querySelector(".popup");
    popupEl.style.width = this.shadowRoot.querySelector(":scope div").clientWidth+"px";
    popupEl.style.display = this.open?"none":"flex";
    this.open = !this.open;
    if (this.open){
      document.addEventListener('mousedown', this.outsideClickListener)
    } 
    


  }



}
// Register the element with the browser
customElements.define('multi-select', MultiSelect);
