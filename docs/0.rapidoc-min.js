(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{101:function(t,e){if("undefined"==typeof esprima){var r=new Error("Cannot find module 'esprima'");throw r.code="MODULE_NOT_FOUND",r}t.exports=esprima},110:function(t,e){},112:function(t,e){},127:function(t,e){},137:function(t,e,r){"use strict";r.r(e);r(65);var a=r(0),i=r(8);customElements.define("m-logo",class extends a.a{render(){return a.c`<svg xmlns="http://www.w3.org/2000/svg" viewBox="1 0 511 512"><path d="M350.96 411.023C315.914 471.395 250.566 512 175.73 512S35.547 471.395.5 411.023c25.64-44.16 67.488-77.746 117.4-92.598 18.32-5.457 37.73-8.383 57.82-8.383 64.27 0 121.527 29.945 158.62 76.637a202.91 202.91 0 0 1 16.609 24.344zm0 0" fill="#adc165"/><path d="M334.352 386.68c-57.172 16.984-121.246 8.652-173.89-28.223-16.465-11.527-30.68-25.05-42.55-40.03 18.32-5.457 37.73-8.383 57.82-8.383 64.27 0 121.527 29.945 158.62 76.637zm77.172 32.18H85.195a7.84 7.84 0 0 1-7.84-7.84 7.84 7.84 0 0 1 7.84-7.836h326.328a7.84 7.84 0 0 1 7.84 7.84 7.84 7.84 0 0 1-7.84 7.836zm0 0" fill="#99aa52"/><path d="M374.32 337.773c-1.086 10.242-2.97 20.414-5.62 30.426-67.48 17.906-142.39.406-195.31-52.512-52.922-52.9-70.418-127.828-52.512-195.31 51.11-13.555 106.496-6.812 153.34 20.258 15 8.664 29.133 19.418 41.97 32.254 45.066 45.07 64.445 106.1 58.133 164.883zm0 0" fill="#ffc73b"/><path d="M374.32 337.773c-51.195-29.6-89.03-81.246-98.824-144.207-2.793-17.937-3.137-35.695-1.277-52.93 15 8.664 29.133 19.418 41.97 32.254 45.066 45.07 64.445 106.1 58.133 164.883zm37.203 81.086c-2.008 0-4.012-.762-5.543-2.293l-230.75-230.75a7.84 7.84 0 0 1 11.086-11.086l230.75 230.75c3.06 3.063 3.06 8.023 0 11.086-1.53 1.53-3.54 2.293-5.543 2.293zm0 0" fill="#efb025"/><path d="M310.543 175.23c0 74.84 40.605 140.184 100.98 175.234C471.895 315.418 512.5 250.07 512.5 175.23S471.898 35.047 411.523 0c-60.375 35.047-100.98 100.395-100.98 175.23zm0 0" fill="#ff903e"/><path d="M411.523 418.86a7.84 7.84 0 0 1-7.84-7.836V84.69c0-4.328 3.512-7.84 7.84-7.84s7.84 3.512 7.84 7.84v326.332a7.84 7.84 0 0 1-7.84 7.836zm0 0" fill="#e87425"/></svg>`}});var o={color:{inputReverseFg:"#fff",inputReverseBg:"#333",headerBg:"#444",getRgb:function(t){if(0===t.indexOf("#")&&(t=t.slice(1)),3===t.length&&(t=t[0]+t[0]+t[1]+t[1]+t[2]+t[2]),6!==t.length)throw new Error("Invalid HEX color.");return{r:parseInt(t.slice(0,2),16),g:parseInt(t.slice(2,4),16),b:parseInt(t.slice(4,6),16)}},invert:function(t){let e=this.getRgb(t);return.299*e.r+.587*e.g+.114*e.b>186?"#333":"#fff"},opacity:function(t,e){let r=this.getRgb(t);return`rgba(${r.r}, ${r.r}, ${r.r}, ${e})`},brightness(t,e){let r=this.getRgb(t);return r.r=r.r+e,r.g=r.g+e,r.b=r.b+e,r.r>255?r.r=255:r.r<0&&(r.r=0),r.g>255?r.g=255:r.g<0&&(r.g=0),r.b>255?r.b=255:r.b<0&&(r.b=0),`#${r.r.toString(16).padStart(2,"0")}${r.g.toString(16).padStart(2,"0")}${r.b.toString(16).padStart(2,"0")}`}}},n=r(10),l=r.n(n),s=a.c`<style>.regular-font{font-family:var(--font-regular);}
    .mono-font{font-family:var(--font-mono);}
    .title{font-size:32px;}
    .sub-title{font-size: 18px;}
    h1{ font-family:var(--font-regular); font-size:20px; letter-spacing:normal; }
    h2{ font-family:var(--font-regular); font-size:18px; letter-spacing:normal; }
    h3{ font-family:var(--font-regular); font-size:16px; letter-spacing:normal; }
    h4{ font-family:var(--font-regular); font-size:15px; letter-spacing:normal; }
    h5{ font-family:var(--font-regular); font-size:14px; letter-spacing:normal; }
    h6{ font-family:var(--font-regular); font-size:14px; letter-spacing:normal; }

    h1,h2,h3,h4,h5,h5{
      margin-block-end: 0.2em;
    }
    p { margin-block-start: 0.5em; }
    code,
    pre{
      font-family: var(--font-mono);
    }

    /* Markdown */
    /*
    .m-markdown p:only-child{
        color:var(--light-fg);
        font-size:12px;
        line-height:normal;
        margin-top:0;
    }
    */
    .m-markdown li,
    .m-markdown p,
    .m-markdown span{
        line-height:28px;
        font-size:14px;
    }
    .m-markdown-small p,
    .m-markdown-small span,
    .m-markdown-small li{
      color:var(--light-fg);
      font-size:12px;
      line-height:14px;
      margin-top:0;
    }
    .m-markdown-small ul,
    .m-markdown-small ol{
      padding-inline-start: 20px;
    }



    .m-markdown code{
        background-color: rgba(0, 0, 0, 0.02);
        padding: 0px 6px;
        border: 1px solid var(--light-border-color);
        border-radius: 3px;
        color: var(--fg);
        font-size: 12px;
    }

    .m-markdown pre{
        white-space: pre-wrap;
        background-color: var(--pre-bg);
        color:var(--pre-fg);
        padding: 12px 14px 15px 14px;
        overflow-x: auto;
        line-height: normal;
        border-radius: 4px;
        border: 1px solid var(--pre-border-color);
    }
    .m-markdown pre code {
        border:none;
        background-color:transparent;
        color: var(--code-fg);
    }
    .m-markdown ul,
    .m-markdown ol{
        padding-inline-start:30px
    }
    .m-markdown a{color:var(--link-color)}
    .m-markdown img{max-width:100%}

    /* Markdown table */

    .m-markdown table {
      border-spacing: 0;  
      border-collapse: separate;
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      margin: 0;
      max-width: 100%;
    }
    .m-markdown tr:first-child td,
    .m-markdown tr:first-child th {
        border-top: 0 none;
    }
    .m-markdown td, 
    .m-markdown th{
      font-size: 12px;
      line-height: 16px;
      padding: 4px 5px 4px;
      text-align: left;
      vertical-align: top;
    }

    .m-markdown th {
      color: var(--fg2);
      font-size: 12px;
      line-height:30px;
      font-weight: 600;
      letter-spacing: normal;
      background-color: var(--bg2);
      vertical-align: bottom;
      border-bottom: 1px solid var(--border-color);
    }</style>`;customElements.define("json-tree",class extends a.a{render(){return a.c`${s}<style>.tree{
          font-family: var(--font-mono);
          font-size:12px;
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
        .object{color:var(--fg)}</style><div class="tree">${this.generateTree(this.data)}</div>`}static get properties(){return{data:{type:Object}}}generateTree(t){if(null===t)return a.c`<div class="null" style="display:inline;">null</div>`;if("object"==typeof t){let e=Array.isArray(t)?"array":"pure_object";return 0===Object.keys(t).length?a.c`${Array.isArray(t)?"[ ]":"{ }"}`:a.c`<div class="left-bracket expanded ${"array"===e?"array":"object"}" @click="${this.toggleExpand}">${"array"===e?"[":"{"}</div><div class="inside-bracket">${Object.keys(t).map(r=>a.c`<div class="item">${"pure_object"===e?a.c`${r}:`:""}${this.generateTree(t[r])}</div>`)}</div><div class="right-bracket">${"array"===e?"]":"}"}</div>`}return"string"==typeof t?a.c`<span class="${typeof t}">"${t}"</span>`:a.c`<span class="${typeof t}">${t}</span>`}toggleExpand(t){console.log(t.target.nextElementSibling),t.target.classList.contains("expanded")?(t.target.classList.add("collapsed"),t.target.classList.remove("expanded"),t.target.innerHTML=t.target.classList.contains("array")?"[...]":"{...}",t.target.nextElementSibling.style.display="none",t.target.nextElementSibling.nextElementSibling.style.display="none"):(t.target.classList.remove("collapsed"),t.target.classList.add("expanded"),t.target.innerHTML=t.target.classList.contains("array")?"[":"{",t.target.nextElementSibling.style.display="block",t.target.nextElementSibling.nextElementSibling.style.display="block")}});customElements.define("schema-tree",class extends a.a{render(){return a.c`${s}<style>.tree{
          font-family: var(--font-mono);
          font-size:12px;
          display:inline-block;
          overflow:hidden;
          width:100%;
        }
        .item{
          white-space: nowrap;
          display: table;
        }
        .item-key{
          display:inline;
        }
        .item-value{
          display: table-cell;
          white-space: normal;
        }
        .item-type{
          display: table-cell;
        }
        .obj-descr{
          color:var(--light-fg);
          font-family:var(--font-regular);
          display:inline;
          white-space:normal;
        }
        .item-descr{
          color:var(--light-fg);
          display: table-cell;
          padding-left:12px;
          min-width: 125px;
          font-family:var(--font-regular);
        }
        .descr-expander{
          display: table-cell;
          cursor:pointer;
          color:orange;
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
        /*
        .m-markdown > p{
          margin-block-start:0;
          margin-block-end:5px;
        }
        */
        .stri, .string{color:#86b300;}
        .inte, .numb, .number{color:#47afe8;}
        .null {color:orangered;}
        .bool, .boolean{color:#b96ff1}
        .enum {color:orange}
        @media only screen and (min-width: 768px){
          .item-descr{
            padding-left:24px;
          }
        }</style><div class="tree">${this.generateTree(this.data)}</div>`}static get properties(){return{data:{type:Object}}}generateTree(t){if(null===t)return a.c`<div class="null" style="display:inline;">null</div>`;if("object"==typeof t){let e=Array.isArray(t)?"array":"pure_object";return 0===Object.keys(t).length?a.c`${Array.isArray(t)?"[ ]":"{ }"}`:1===Object.keys(t).length&&":description"===Object.keys(t)[0]?a.c`{ } <span class="obj-descr">${t[":description"]}</span>`:"array"===e&&"~|~"===t[0]?a.c`[ ]`:a.c`<div class="left-bracket expanded ${"array"===e?"array":"object"}" @click="${this.toggleExpand}">${"array"===e?"[":"{"}</div>${t[":description"]?a.c`<span class="obj-descr obj-content-part">${t[":description"]}</span>`:""}<div class="inside-bracket obj-content-part">${Object.keys(t).map(r=>a.c`${":description"!==r?a.c`<div class="item"><span class="item-key">${"pure_object"===e?a.c`${r}:`:""} </span>${this.generateTree(t[r])}</div>`:""}`)}</div><div class="right-bracket obj-content-part">${"array"===e?"]":"}"}</div>`}return a.c`<span class="item-value">${t?a.c`${t.split("~|~").map((t,e)=>a.c`${t?a.c`<div class="${0==e?"item-type "+t.substring(0,4):"m-markdown-small item-descr"}">${0==e?a.c`${t}`:a.c`${Object(i.a)(l()(t))}`}</div>`:""}`)}`:""}</span>`}toggleExpand(t){t.target.classList.contains("expanded")?(t.target.classList.add("collapsed"),t.target.classList.remove("expanded"),t.target.innerHTML=t.target.classList.contains("array")?"[...]":"{...}",t.target.parentNode.querySelectorAll(":scope > .obj-content-part").forEach(t=>t.style.display="none")):(t.target.classList.remove("collapsed"),t.target.classList.add("expanded"),t.target.innerHTML=t.target.classList.contains("array")?"[":"{",t.target.parentNode.querySelectorAll(":scope > .obj-content-part").forEach(t=>t.style.display=t.classList.contains("obj-descr")?"inline":"block"))}toggleDescr(){console.log("descr")}});customElements.define("tag-input",class extends a.a{render(){return a.c`<div class="tags" tabindex="0" contenteditable="true"><input type="text" class="editor" @paste="${this.afterPaste}" @keydown="${this.afterKeyDown}" placeholder="${this.placeholder}"></div>`}static get styles(){return[a.b`.tags{
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
        border:1px solid var(--border-color);
        background-color:var(--bg2);
        color:var(--fg2);
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
        background:var(--input-bg);
        color:var(--fg);
        min-width:60px;
        outline: none;
        line-height: inherit;
        font-family:inherit;
        font-size:inherit;
      }
      .editor::placeholder {
        color: var(--placeholder-color);
        opacity:1;
      }`]}static get properties(){return{placeholder:{type:String}}}afterPaste(t){let e=(t.clipboardData||window.clipboardData).getData("Text");console.log(e)}afterKeyDown(t){if(13===t.keyCode){t.stopPropagation(),t.preventDefault();let e=document.createElement("span");""!==t.target.value.trim()&&(e.innerText=t.target.value,t.target.value="",e.classList.add("tag"),e.setAttribute("contenteditable","false"),this.shadowRoot.querySelector(".tags").insertBefore(e,t.target))}else 8===t.keyCode&&0===t.target.selectionStart&&t.target.previousSibling&&t.target.previousSibling.remove()}getValues(){let t=[],e=this.shadowRoot.querySelectorAll(".tag");for(let r of e)t.push(r.innerText);return t}});var d=a.c`<style>.m-table {
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
  font-size: 12px;
  line-height: 16px;
  padding: 4px 5px 4px;
  text-align: left;
  vertical-align: top;
}

.m-table th {
  color: var(--fg2);
  font-size: 12px;
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
  font-size:12px;
  font-weight:bold;
  vertical-align: middle;
  margin: 12px 0 4px 0;
}</style>`,p=a.c`<style>.row, .col{
    display:flex;
  } 
  .row{
    align-items:center;
    flex-direction: row;
  }
  .col{
    align-items:stretch;
    flex-direction: column;
  }</style>`,c=a.c`<style>input, select, button {
  font-family: var(--font-regular);
  font-weight:400;
  color:var(--fg);
}

/* Button */
.m-btn{
  border-radius: var(--border-radius);
  font-weight: 600;
  display: inline-block;
  padding: 6px 16px;
  font-size: 12px;
  outline: 0;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  background-color:var(--primary-color);
  color:var(--primary-text);
  border: 1px solid var(--primary-color);
  transition: background-color 0.2s;
  user-select: none;
  cursor: pointer;
}

.m-btn.large{padding:8px 14px;}
.m-btn.small{padding:5px 12px;}
.m-btn.circle{border-radius:50%;}
.m-btn:hover{ background-color: var(--primary-color)}

/* Form Inputs */
textarea,
input[type="file"],
input[type="text"],
input[type="password"]{
  border-radius:var(--border-radius);
  border:1px solid var(--input-border-color);
  background:var(--input-bg);
  color:var(--fg);
  transition: border .2s;
  outline: none;
  font-size:13px;
  padding:6px 5px;
  box-sizing: border-box;
}

textarea.mono,
input[type="text"].mono,
input[type="password"].mono{
  font-family: var(--font-mono); 
  font-size:12px;
}

input[type="text"].large,
input[type="password"].large {
    padding:10px 8px;
    font-size:13px;
}


textarea::placeholder,
input[type="text"]::placeholder,
input[type="password"]::placeholder {
    color: var(--placeholder-color);
    opacity:1;
}

textarea:focus,
input[type="text"]:focus,
input[type="password"]:focus,
textarea:active,
input[type="text"]:active,
input[type="password"]:active {
    border:1px solid var(--primary-color);
}

textarea.reverse,
input.reverse[type="text"],
input.reverse[type="password"]{
  background:${o.color.inputReverseBg};
  color:${o.color.inputReverseFg};
  border:1px solid var(--primary-color); 
}

textarea.reverse:focus,
input.reverse[type="text"]:focus,
input.reverse[type="password"]:focus,
textarea.reverse:active,
input.reverse[type="text"]:active,
input.reverse[type="password"]:active{
    border:1px solid var(--primary-color);
}

textarea.reverse::placeholder,
input.reverse::placeholder{
    color: #666;
}

textarea::-webkit-scrollbar-track{
    background-color: transparent;
}
  
textarea::-webkit-scrollbar{
    width: 8px;
    height: 8px;
    background-color: transparent;
}
 
textarea::-webkit-scrollbar-thumb {
    background-color: rgba(50,50,50, .5);
}</style>`,u=a.c`<style>a{ color: var(--link-color); }
.border{
  border:1px solid var(--border-color);
  border-radius: var(--border-radius);
}
.light-border{
  border:1px solid var(--light-border-color);
  border-radius: var(--border-radius);
}</style>`;function h(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,r={hasCircularRefs:"circular"===t.type,format:t.format?t.format:"",pattern:t.pattern&&!t.enum?t.pattern:"",readOnly:t.readOnly?"🆁 ":"",writeOnly:t.writeOnly?"🆆 ":"",depricated:t.deprecated?"❌ ":"",default:0==t.default?"0 ":t.default?t.default:"",type:"",arrayType:"",allowedValues:"",constrain:"",html:""};if(r.hasCircularRefs)return r;if(t.enum){let e="";t.enum.map(function(t){e+=`${t}, `}),r.type="enum",r.allowedValues=e.slice(0,-2)}else t.type&&(r.type=t.type);if("array"===t.type&&t.items){let e=t.items;if(r.arrayType=`${t.type} of ${e.type}`,r.default=0==e.default?"0 ":e.default?e.default:"",e.enum){let t="";e.enum.map(function(e){t+=`${e}, `}),r.allowedValues=t.slice(0,-2)}}else"integer"===t.type||"number"===t.type?(void 0!==t.minimum&&void 0!==t.maximum?r.constrain=`${t.exclusiveMinimum?">":""}${t.minimum} ⋯ ${t.exclusiveMaximum?"<":""} ${t.maximum}`:void 0!==t.minimum&&void 0===t.maximum?r.constrain=`${t.exclusiveMinimum?">":"≥"}${t.minimum}`:void 0===t.minimum&&void 0!==t.maximum&&(r.constrain=`${t.exclusiveMaximum?"<":"≤"}${t.maximum}`),void 0!==t.multipleOf&&(r.constrain=`(multiple of ${t.multipleOf})`)):"string"===t.type&&(void 0!==t.minLength&&void 0!==t.maxLength?r.constrain=`(${t.minLength} to ${t.maxLength} chars)`:void 0!==t.minLength&&void 0===t.maxLength?r.constrain=`(min:${t.minLength} chars)`:void 0===t.minLength&&void 0!==t.maxLength&&(r.constrain=`(max:${t.maxLength} chars)`));e&&(e.readOnly&&(r.readOnly="🆁 "),e.writeOnly&&(r.writeOnly="🆆 "),e.deprecated&&(r.deprecated="❌ "));let a=`${r.type}`;return r.allowedValues&&(a+=`:(${r.allowedValues})`),r.readOnly&&(a+=" 🆁"),r.writeOnly&&(a+=" 🆆"),r.deprecated&&(a+=" ❌"),r.constrain&&(a+=` ${r.constrain}`),r.format&&(a+=` ${r.format}`),r.pattern&&(a+=` ${r.pattern}`),r.html=a,r}function f(t,e){if(null!=t){if("object"===t.type||t.properties){t.description&&(e[":description"]=t.description);for(let r in t.properties)e[r]=f(t.properties[r],{})}else if("array"===t.type||t.items)e=[f(t.items,{})];else{if(!t.allOf)return`${h(t).html}~|~${t.description?t.description:""}`;{if(1===t.allOf.length){if(t.allOf[0]){let e={readOnly:t.readOnly,writeOnly:t.writeOnly,deprecated:t.deprecated};return`${h(t.allOf[0],e).html}~|~${t.description?t.description:""}`}return`string~|~${t.description?t.description:""}`}let r={};t.allOf.map(function(t){if(t&&t.properties){let e=f(t,{});Object.assign(r,e)}}),e=r}}return e}}function v(t,e,r,a,i){let o=[];if(t)for(let e in t){let r="";r=a.toLowerCase().includes("json")&&"text"===i?JSON.stringify(t[e].value,void 0,2):t[e].value,o.push({exampleType:a,exampleValue:r})}else if(e){let t="";t=a.toLowerCase().includes("json")&&"text"===i?JSON.stringify(e,void 0,2):e,o.push({exampleType:a,exampleValue:t})}if(0==o.length)if(r)if(a.toLowerCase().includes("json")||a.toLowerCase().includes("*/*")){let t=function t(e,r){let a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};if(null==e)return;if("object"===e.type||e.properties)for(let i in e.properties)e.properties[i].deprecated||e.properties[i].readOnly&&!a.includeReadOnly||e.properties[i].writeOnly&&!a.includeWriteOnly||(r[i]=t(e.properties[i],{},a));else if("array"===e.type||e.items)r=[t(e.items,{},a)];else{if(!e.allOf)return g(e);{if(1===e.allOf.length)return e.allOf[0]?g(e.allOf[0]):"string";let i={};e.allOf.map(function(e){if(e&&e.type){let r=t(e,{},a);Object.assign(i,r)}}),r=i}}return r}(r,{},{includeReadOnly:!0,includeWriteOnly:!0,deprecated:!0});o.push({exampleType:a,exampleValue:"text"===i?JSON.stringify(t,void 0,2):t})}else o.push({exampleType:a,exampleValue:""});else o.push({exampleType:a,exampleValue:""});return o}function g(t){if(t.example)return t.example;if(0===Object.keys(t).length)return null;switch(t.format||t.type||(t.enum?"enum":null)){case"int32":case"int64":case"integer":return 0;case"float":case"double":case"number":return.5;case"string":return t.enum?t.enum[0]:t.pattern?t.pattern:"string";case"byte":return btoa("string");case"binary":return"binary";case"boolean":return!1;case"date":return new Date(0).toISOString().split("T")[0];case"date-time":case"dateTime":return new Date(0).toISOString();case"password":return"password";case"enum":return t.enum[0];case"uri":return"http://example.com";case"uuid":return"3fa85f64-5717-4562-b3fc-2c963f66afa6";case"email":return"user@example.com";case"hostname":return"example.com";case"ipv4":return"198.51.100.42";case"ipv6":return"2001:0db8:5b96:0000:0000:426f:8e17:642a";case"circular":return"CIRCULAR REF";default:return t.nullable?null:(console.warn("Unknown schema value",t),"?")}}function y(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;const e=new WeakSet;return(r,a)=>{if("object"==typeof a&&null!==a){if(e.has(a)){if(t>0)return{};{let r=JSON.parse(JSON.stringify(a,y(t+1)));return e.add(r),r}}e.add(a)}return a}}r(74);function x(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{},a=Object.keys(r);"function"==typeof Object.getOwnPropertySymbols&&(a=a.concat(Object.getOwnPropertySymbols(r).filter(function(t){return Object.getOwnPropertyDescriptor(r,t).enumerable}))),a.forEach(function(e){b(t,e,r[e])})}return t}function b(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}customElements.define("api-request",class extends a.a{render(){return a.c`${d} ${c} ${s} ${p} ${u}<style>.title{
        font-family:var(--font-regular);
        font-size:var(--title-font-size);
        font-weight:bold;
        margin-bottom:16px;
      }
      .param-name,
      .param-type{
        margin: 1px 0;
        text-align: right;
        line-height: 12px;
      }
      .param-name{
        color: var(--fg); 
        font-family: var(--font-mono);
      }
      .param-type{
        color: var(--light-fg); 
        font-family: var(--font-regular);
      }
      .param-constraint{
        min-width:100px;
      }
      .param-constraint:empty{
        display:none;
      }
      .top-gap{margin-top:24px;}
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
        font-size:12px;
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
      .link{
        font-size:12px;
        text-decoration: underline;
        color:var(--link-color);
        font-family:var(--font-mono);
        margin-bottom:2px;
        
      }
      .textarea {
        min-height:180px; 
        padding:5px;
      }

      .response-message.error{
        color:var(--error-color);
        font-weight:bold;
        text-overflow: ellipsis;
      }
      .response-message.success{
        color:var(--success-color);
        font-weight:bold;
        text-overflow: ellipsis;
      }

      @media only screen and (min-width: 768px){
        .textarea {
          padding:16px;
        }
      }</style><div class="col regular-font request-panel"><div class="title">REQUEST</div>${this.inputParametersTemplate("path")} ${this.inputParametersTemplate("query")} ${this.requestBodyTemplate()} ${this.inputParametersTemplate("header")} ${this.inputParametersTemplate("cookie")} ${"false"===this.allowTry?"":a.c`${this.apiCallTemplate()}`}</div>`}constructor(){super(),this.responseMessage="",this.responseStatus="success",this.responseHeaders="",this.responseText="",this.responseUrl="",this.curlSyntax=""}static get properties(){return{server:{type:String},apiKeyName:{type:String,attribute:"api-key-name"},apiKeyValue:{type:String,attribute:"api-key-value"},apiKeyLocation:{type:String,attribute:"api-key-location"},method:{type:String},path:{type:String},parameters:{type:Array},request_body:{type:Object},responseMessage:{type:String,attribute:!1},responseText:{type:String,attribute:!1},responseHeaders:{type:String,attribute:!1},responseStatus:{type:String,attribute:!1},responseUrl:{type:String,attribute:!1},allowTry:{type:String,attribute:"allow-try"}}}inputParametersTemplate(t){let e="",r=this.parameters?this.parameters.filter(e=>e.in===t):[];if(0==r.length)return"";"path"===t?e="PATH PARAMETERS":"query"===t?e="QUERY-STRING PARAMETERS":"header"===t?e="REQUEST HEADERS":"cookie"===t&&(e="COOKIES");const o=[];for(const e of r){let r=h(e.schema),n="";n="0"==e.example?"0":r.default,o.push(a.c`<tr><td style="min-width:100px;"><div class="param-name">${e.required?a.c`<span style="color:orangered">*</span>`:""}${e.name}</div><div class="param-type">${"array"===r.type?`${r.arrayType}`:`${r.type}${r.format?` (${r.format})`:""}`}</div></td><td style="min-width:100px;">${"array"===r.type?a.c`<tag-input class="request-param" style="width:100%;font-size:13px;background:var(--input-bg);line-height:13px;" data-ptype="${t}" data-pname="${e.name}" data-array="true" placeholder="add-multiple\u23ce"></tag-input>`:a.c`<input type="text" style="width:100%" class="request-param" data-pname="${e.name}" data-ptype="${t}" data-array="false" value="${n}">`}</td><td><div class="param-constraint">${r.constrain?a.c`${r.constrain}<br>`:""} ${r.allowedValues?a.c`${r.allowedValues}`:""}</div></td></tr>${e.description?a.c`<tr><td style="border:none"></td><td colspan="2" style="border:none; margin-top:0; padding:0 5px;"><span class="m-markdown-small">${Object(i.a)(l()(e.description))}</span></td></tr>`:""}`)}return a.c`<div class="table-title top-gap">${e}</div><div style="display:block; overflow-x:auto; max-width:100%;"><table class="m-table" style="width:100%; word-break:break-word;;">${o}</table></div>`}requestBodyTemplate(){if(!this.request_body)return"";if(0==Object.keys(this.request_body).length)return"";let t=0,e={},r=this.request_body.description?a.c`<div class="m-markdown">${Object(i.a)(l()(this.request_body.description))}</div>`:"",o="",n="";const s=[];let d=!1,p="",c=this.request_body.content;for(let r in c){r.includes("json")?e[r]="json":r.includes("xml")?e[r]="xml":r.includes("text/plain")?e[r]="text":r.includes("form-urlencoded")?e[r]="form-urlencoded":r.includes("multipart/form-data")&&(e[r]="multipart-form-data");let u=c[r],h="";if(r.includes("json")||r.includes("xml")||r.includes("text/plain")){try{u.schema=JSON.parse(JSON.stringify(u.schema,y()))}catch(t){return void console.error("Unable to resolve circular refs in schema",u.schema)}p=f(u.schema,{}),h=v(u.examples,u.example,u.schema,r,"text"),o+=`\n          <textarea \n            class="textarea mono request-body-param ${e[r]}" \n            data-ptype="${r}" \n            style="display:${"json"===e[r]?"block":"none"}; \n          ">${h[0].exampleValue}</textarea>`}else if(r.includes("form")||r.includes("multipart-form")){d=!0;for(const t in u.schema.properties){const e=u.schema.properties[t],r=e.type,o="array"===e.type?e.items.type:"";s.push(a.c`<tr><td style="min-width:100px;"><div class="param-name">${t}</div><div class="param-type">${"array"===r?`${r} of ${o}`:`${r} ${e.format?` (${e.format})`:""}`}</div></td><td style="min-width:100px;">${"array"===r?a.c`<tag-input class="request-form-param" style="width:100%;font-size:13px;background:var(--input-bg);line-height:13px;" data-ptype="${r}" data-pname="${t}" data-array="true" placeholder="add-multiple\u23ce"></tag-input>`:a.c`<input type="${"binary"===e.format?"file":"text"}" style="width:100%" class="request-form-param" data-pname="${t}" data-ptype="${r}" data-array="false">`}</td><td><div class="param-constraint"></div></td></tr>${e.description?a.c`<tr><td style="border:none"></td><td colspan="2" style="border:none; margin-top:0; padding:0 5px;"><span class="m-markdown-small">${Object(i.a)(l()(e.description))}</span></td></tr>`:""}`)}n=a.c`<form class="${e[r]}" onsubmit="event.preventDefault();"><table style="width: 100%" class="m-table">${s}</table></form>`}t++}return a.c`<div class="table-title top-gap ${d?"form_data":"body_data"}">${d?"FORM":"BODY"} DATA ${this.request_body.required?"(required)":""}</div>${r} ${d?a.c`${n}`:a.c`<div class="tab-panel col" style="border-width:0; min-height:200px"><div id="tab_buttons" class="tab-buttons row" @click="${this.activateTab}"><button class="tab-btn active" content_id="tab_example">EXAMPLE</button> <button class="tab-btn" content_id="tab_model">MODEL</button><div style="flex:1"></div><div style="color:var(--light-fg); align-self:center; font-size:12px; margin-top:8px;">${1==t?`\n                ${Object.keys(e)[0]}\n              `:a.c`${Object.keys(e).map(t=>a.c`${"json"===e[t]?a.c`<input type="radio" name="request_body_type" value="${e[t]}" @change="${this.onMimeTypeChange}" checked="checked" style="margin:0 0 0 8px">`:a.c`<input type="radio" name="request_body_type" value="${e[t]}" @change="${this.onMimeTypeChange}" style="margin:0 0 0 8px">`} ${e[t]}`)}`}</div></div><div id="tab_example" class="tab-content col" style="flex:1;">${Object(i.a)(o)}</div><div id="tab_model" class="tab-content col" style="flex:1;display:none"><schema-tree class="border" style="padding:16px;" .data="${p}"></schema-tree></div></div>`}`}apiCallTemplate(){return a.c`<div style="display:flex; align-items: center; margin:16px 0; font-size:12px;"><div style="display:flex; flex-direction:column; margin:0; width:calc(100% - 60px);"><div style="display:flex;flex-direction:row;overflow:hidden;"><div style="font-weight:bold;">API_Server:</div>${this.server?a.c`${this.server}`:a.c`<div style="font-weight:bold;color:var(--error-color)">Not Set</div>`}</div><div style="display:flex;flex-direction:row;overflow:hidden;line-height:16px;color:var(--fg2)">${this.apiKeyValue&&this.apiKeyName?a.c`<div style="font-weight:bold;color:var(--success-color)">Authentication: &nbsp;</div>send<div style="font-family:var(--font-mono); color:var(--fg)">'${this.apiKeyName}'</div>in<div style="font-family:var(--font-mono); color:var(--fg)">'${this.apiKeyLocation}'</div>with value<div style="font-family:var(--font-mono); color:var(--fg)">'${this.apiKeyValue.substring(0,3)+"***"}'</div>`:a.c`<div style="color:var(--light-fg)">No Authentication Token provided</div>`}</div></div><button class="m-btn" style="padding: 6px 0px;width:60px" @click="${this.onTryClick}">TRY</button></div>${""===this.responseMessage?"":a.c`<div class="row" style="font-size:12px; margin:5px 0"><div class="response-message ${this.responseStatus}">Response Status: ${this.responseMessage}</div><div style="flex:1"></div><button class="m-btn" style="padding: 6px 0px;width:60px" @click="${this.clearResponseData}">CLEAR</button></div><div class="tab-panel col" style="border-width:0; min-height:200px"><div id="tab_buttons" class="tab-buttons row" @click="${this.activateTab}"><button class="tab-btn active" content_id="tab_response_text">RESPONSE TEXT</button> <button class="tab-btn" content_id="tab_response_headers">RESPONSE HEADERS</button> <button class="tab-btn" content_id="tab_curl">CURL</button></div><div id="tab_response_text" class="tab-content col" style="flex:1;"><textarea class="mono" style="min-height:180px; padding:16px;">${this.responseText}</textarea></div><div id="tab_response_headers" class="tab-content col" style="flex:1;display:none"><textarea class="mono" style="min-height:180px; padding:16px; white-space:nowrap;">${this.responseHeaders}</textarea></div><div id="tab_curl" class="tab-content col" style="flex:1;display:none"><code style="min-height:180px; padding:16px;font-size:12px; border:1px solid var(--input-border-color);overflow: scroll;word-break: break-word;">${this.curlSyntax}</code></div></div>`}`}activateTab(t){if(t.target.classList.contains("active")||!1===t.target.classList.contains("tab-btn"))return;let e=t.currentTarget.parentNode.querySelector(".tab-btn.active"),r=t.target;e.classList.remove("active"),t.target.classList.add("active");let a=this.shadowRoot.getElementById(r.attributes.content_id.value),i=t.currentTarget.parentNode.querySelectorAll(".tab-content");a&&(a.style.display="flex",i.forEach(function(t){t.attributes.id.value!==r.attributes.content_id.value&&(t.style.display="none")}))}onMimeTypeChange(t){[...t.target.closest(".tab-panel").querySelectorAll("textarea.request-body-param")].map(function(e){e.style.display=e.classList.contains(t.target.value)?"block":"none"})}onTryClick(t){let e=this,r="",a="",i="",o="",n=t.target.closest(".request-panel"),l=[...n.querySelectorAll(".request-param[data-ptype='path']")],s=[...n.querySelectorAll(".request-param[data-ptype='query']")],d=[...n.querySelectorAll(".request-param[data-ptype='header']")],p=[...n.querySelectorAll(".request-form-param")],c=[...n.querySelectorAll(".request-body-param")],u=e.path,h={mode:"cors",method:this.method.toUpperCase(),headers:{}};if(l.map(function(t){u=u.replace("{"+t.dataset.pname+"}",t.value)}),s.length>0){let t=new URLSearchParams("");s.map(function(e){if("false"===e.dataset.array)""!==e.value&&t.append(e.dataset.pname,e.value);else{let r=e.getValues();for(let a of r)t.append(e.dataset.pname,a)}}),u=`${u}?${t.toString()}`}if(this.apiKeyValue&&this.apiKeyName&&"query"===this.apiKeyLocation&&(u=`${u}&${this.apiKeyName}=${this.apiKeyValue}`),u=`${this.server.replace(/\/$/,"")}${u}`,r=`curl -X ${this.method.toUpperCase()} "${u}" `,d.map(function(t){t.value&&(h.headers[t.dataset.pname]=t.value,a+=` -H "${h.headers[t.dataset.pname]}: ${t.value}"`)}),this.apiKeyValue&&this.apiKeyName&&"header"===this.apiKeyLocation&&(h.headers[this.apiKeyName]=this.apiKeyValue,a+=` -H "${this.apiKeyName}: ${this.apiKeyValue}"`),p.length>=1){let t=n.querySelector("form");const e=new URLSearchParams,r=new FormData;p.map(function(t){if("false"===t.dataset.array)"file"!==t.type?""!==t.value&&(e.append(t.dataset.pname,t.value),r.append(t.dataset.pname,t.value),o+=` -F "${t.dataset.pname}=${t.value}"`):t.files[0]&&(e.append(t.dataset.pname,t.files[0]),r.append(t.dataset.pname,t.files[0]),o+=` -F "${t.dataset.pname}=@${t.value}"`);else{let a=t.getValues();for(let i of a)e.append(t.dataset.pname,i),r.append(t.dataset.pname,i),o+=` -F "${t.dataset.pname}=${i}"`}}),t.classList.contains("form-urlencoded")?(h.headers["Content-Type"]="application/x-www-form-urlencoded; charset=utf-8",a+=' -H "Content-Type: application/x-www-form-urlencoded"',h.body=e):(a+=' -H "Content-Type: multipart/form-data"',h.body=r)}if(c.length>=1)if(1===c.length)h.headers["Content-Type"]=c[0].dataset.ptype,a+=` -H "Content-Type: ${c[0].dataset.ptype}"`,h.body=c[0].value,i=` -d ${JSON.stringify(c[0].value.replace(/(\r\n|\n|\r)/gm,""))}`;else{let e=t.target.closest(".request-panel").querySelector("input[name='request_body_type']:checked"),r=null===e?"json":e.value,o="";"json"===r?(o=n.querySelector(".request-body-param.json").value,h.headers["Content-Type"]="application/json; charset=utf-8",a+=' -H "Content-Type: application/json"'):"xml"===r?(o=n.querySelector(".request-body-param.xml").value,h.headers["Content-Type"]="application/xml; charset=utf-8",a+=' -H "Content-Type: application/xml"'):"text"===r&&(o=n.querySelector(".request-body-param.text").value,h.headers["Content-Type"]="text/plain; charset=utf-8",a+=' -H "Content-Type: text/plain"'),h.body=o,i=` -d ${JSON.stringify(o.replace(/(\r\n|\n|\r)/gm,""))}`}e.responseUrl="",e.responseHeaders="",e.responseText="",e.curlSyntax="",e.responseStatus="success",e.responseMessage="",fetch(u,h).then(function(t){e.curlSyntax=`${r} ${a} ${i} ${o}`,e.responseStatus=t.ok?"success":"error",e.responseMessage=`${t.statusText}:${t.status}`,e.responseUrl=t.url,t.headers.forEach(function(t,r){e.responseHeaders=e.responseHeaders+`${r.trim()}: ${t}`+"\n"});let n=t.headers.get("content-type");n&&n.includes("json")?t.json().then(function(t){e.responseText=JSON.stringify(t,null,2)}):t.text().then(function(t){e.responseText=t})}).catch(function(t){e.responseMessage=t.message+" (CORS or Network Issue)"})}clearResponseData(){this.responseUrl="",this.responseHeaders="",this.responseText="",this.responseStatus="success",this.responseMessage=""}});customElements.define("api-response",class extends a.a{render(){return a.c`${s} ${p} ${d} ${c}<style>.title{
        font-family:var(--font-regular);
        font-size:var(--title-font-size);
        font-weight:bold;
        margin-bottom:8px;
      }
      .resp-head{
        vertical-align: middle;
        padding:16px 0 8px;
      }
      .resp-head.divider{border-top: 1px solid var(--border-color);}
      .resp-status{ 
        font-weight:bold;
      }
      .top-gap{margin-top:16px;}
      .tab-buttons{
        height:30px;
        border-bottom: 1px solid var(--light-border-color) ;
        align-items: stretch;
      }
      .tab-btn{
        color:var(--fg);
        border:none;
        background-color:transparent;
        cursor:pointer;
        padding:1px;
        outline:none;
        font-size:12px;
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
      .tree{
        padding:16px 2px;
      }
      @media only screen and (min-width: 768px){
        .tree {
          padding:16px;
        }
      }</style><div class="col regular-font"><div class="title">RESPONSE</div>${this.responseTemplate()}</div>`}static get properties(){return{responses:{type:Object}}}responseTemplate(){let t={},e={},r="",i={};for(let a in this.responses){let o={},n=0;for(let e in this.responses[a].content){let i=this.responses[a].content[e];try{i.schema&&(i.schema=JSON.parse(JSON.stringify(i.schema,y(0))))}catch(t){return void console.error("Unable to resolve circular refs in schema",i.schema)}let l=f(i.schema,{}),s=v(i.examples,i.example,i.schema,e,"json");o[e]={description:this.responses[a].description,examples:s,schemaTree:l},console.log(e),e.includes("json")&&(r=e),t[a]=e,n++}let l=[];for(let t in this.responses[a].headers)l.push(x({name:t},this.responses[a].headers[t]));e[a]=l,i[a]=o}return a.c`${Object.keys(this.responses).map((t,e)=>a.c`<div class="resp-head ${0===e?"top-gap":"divider"}"><span class="resp-status">${t}:</span> <span class="resp-descr">${this.responses[t].description}</span></div>${Object.keys(i[t]).map(e=>a.c`<div class="tab-panel col" style="border-width:0; min-height:200px"><div id="${t}_${e}_tab-buttons" @click="${this.activateTab}" class="tab-buttons row"><button class="tab-btn active" content_id="${t}_${e}_example">EXAMPLE</button> <button class="tab-btn" content_id="${t}_${e}_model">MODEL</button><div style="flex:1"></div><div style="align-self:center;font-size:12px;">${e}</div></div><div id="${t}_${e}_example" class="tab-content col" style="flex:1;"><json-tree class="border tree" .data="${i[t][e].examples[0].exampleValue}"></json-tree></div><div id="${t}_${e}_model" class="tab-content col" style="flex:1;display:none"><schema-tree class="border tree" .data="${i[t][e].schemaTree}"></schema-tree></div></div>`)}`)}`}activateTab(t){if(t.target.classList.contains("active")||!1===t.target.classList.contains("tab-btn"))return;t.currentTarget.parentNode.querySelector(".tab-btn.active").classList.remove("active"),t.target.classList.add("active");let e=t.target.attributes.content_id.value,r=t.currentTarget.parentNode.querySelectorAll(".tab-content");e&&r.forEach(function(t){t.style.display=t.attributes.id.value===e?"flex":"none"})}});customElements.define("end-point",class extends a.a{render(){return a.c`${s}<style></style>${window.innerWidth>=768?a.c`${"row"===this.layout?a.c`<style>.request{ border-width: 0 1px 0 0; }</style>`:a.c`<style>.request{ border-width: 0 0 1px 0; }</style>`}`:""}<div class="m-endpoint regular-font ${this.path.method} ${this.path.expanded?"expanded":"collapsed"}"><!-- Endpoint Head --><div @click="${this.toggleExpand}" class="head ${this.path.method} ${this.path.expanded?"expanded":"collapsed"}"><div class="method ${this.path.method}">${this.path.method}</div><div class="path ${this.path.deprecated?"deprecated":""}">${this.path.path}</div>${this.path.deprecated?a.c`<span style="font-size:12px; text-transform:uppercase; font-weight:bold; color:orangered; margin:2px 0 0 5px;">deprecated</span>`:""}<div class="only-large-screen" style="min-width:60px; flex:1"></div><div class="descr">${this.path.summary}</div></div><!-- Endpoint Body --> ${this.path.expanded?a.c`<div class="body ${this.path.method}">${this.path.summary||this.path.description?a.c`<div class="summary"><div class="title">${this.path.summary}</div>${this.path.summary!==this.path.description?a.c`<div class="m-markdown">${Object(i.a)(l()(this.path.description?this.path.description:""))}</div>`:""}</div>`:""}<div class="req-resp-container"><api-request class="request" server="${this.server}" method="${this.path.method}" , path="${this.path.path}" api-key-name="${this.apiKeyName}" api-key-value="${this.apiKeyValue}" api-key-location="${this.apiKeyLocation}" .parameters="${this.path.parameters}" .request_body="${this.path.requestBody}" allow-try="${this.allowTry}"></api-request><api-response class="response" .responses="${this.path.responses}"></api-response></div></div>`:""}</div>`}static get styles(){return[a.b`.only-large-screen {
      display:none;
    }

    .head .path{
      display: flex;
      font-family:var(--font-mono);
      font-size: 12px;
      align-items: center;
      overflow-wrap: break-word;
      word-break: break-all;
    }

    .head .descr{
      font-size: 12px;
      color:var(--light-fg);
      font-weight:400;
      align-items: center;
      overflow-wrap: break-word;
      word-break: break-all;
      display:none;
    }

    .m-endpoint.expanded{margin-bottom:16px; }
    .m-endpoint > .head{
      border-width:1px 1px 1px 5px;
      border-style:solid;
      border-color:transparent;
      border-top-color:var(--light-border-color);
      display:flex;
      padding:6px 16px;
      align-items: center;
      cursor: pointer;
    }
    .m-endpoint > .head.put:hover,
    .m-endpoint > .head.put.expanded{
      border-color:var(--put-color); 
      background-color:var(--light-put-color); 
    }
    .m-endpoint > .head.post:hover,
    .m-endpoint > .head.post.expanded{
      border-color:var(--post-color); 
      background-color:var(--light-post-color); 
    }
    .m-endpoint > .head.get:hover,
    .m-endpoint > .head.get.expanded{
      border-color:var(--get-color); 
      background-color:var(--light-get-color); 
    }
    .m-endpoint > .head.delete:hover,
    .m-endpoint > .head.delete.expanded{
      border-color:var(--delete-color); 
      background-color:var(--light-delete-color); 
    }
    .m-endpoint > .head.patch:hover,
    .m-endpoint > .head.patch.expanded{
      border-color:var(--patch-color); 
      background-color:var(--light-patch-color); 
    }
    .m-endpoint .body {
      flex-wrap:wrap;
      padding:16px 0px 0 0px;
      border-width:0px 1px 1px 5px;
      border-style:solid;
      box-shadow: 0px 4px 3px -3px rgba(0, 0, 0, 0.15);
    }
    .m-endpoint .body.delete{ border-color:var(--delete-color); }
    .m-endpoint .body.patch{ border-color:var(--patch-color); }
    .m-endpoint .body.put{ border-color:var(--put-color); }
    .m-endpoint .body.post{border-color:var(--post-color);}
    .m-endpoint .body.get{ border-color:var(--get-color); }

    .head .deprecated{
      text-decoration: line-through red;
    }

    .summary{
      padding:8px 8px;
    }
    .summary .title{
      font-size:18px;
      margin-bottom: 6px;
      word-break: break-all;
    }

    .method{
      padding:2px 5px;
      vertical-align: middle;
      height: 20px;
      line-height: 20px;
      min-width: 48px;
      border-radius: 2px;
      display:inline-block;
      font-size:12px;
      text-align: center;
      font-weight: bold;
      text-transform:uppercase;
      margin-right:5px;
    }
    .method.delete{ border: 2px solid var(--delete-color);}
    .method.patch{ border: 2px solid var(--patch-color); }
    .method.put{ border: 2px solid var(--put-color); }
    .method.post{ border: 2px solid var(--post-color); }
    .method.get{ border: 2px solid var(--get-color); }

    .req-resp-container{
      display: flex;
      margin-top:16px;
      align-items: stretch;
      flex-wrap: wrap;
      flex-direction: column;
      border-top:1px solid var(--light-border-color);
    }
    .request,
    .response{
      flex:1; 
      min-height:100px;
      padding:16px 8px;
      overflow:hidden;
    }
    .request{
      border-width:0 0 1px 0;
      border-style:dashed;
    }
    .patch .request{ 
      border-color:var(--patch-color); 
    }
    .put .request{ 
      border-color:var(--put-color); 
    }
    .post .request{ 
      border-color:var(--post-color); 
    }
    .get .request{ 
      border-color:var(--get-color); 
    }
    .delete .request{ 
      border-color:var(--delete-color); 
    }


    @media only screen and (min-width: 768px){
      .head .path{
        font-size: 14px;
        min-width:400px;
      }
      .head .descr{
        display: flex;
      }
      .only-large-screen{
        display:block;
      }
      .req-resp-container{
        flex-direction: var(--layout, row);
      }
      .request{
        border-width:0 1px 0 0;
        padding:16px 24px;
      }
      .response{
        padding:16px 24px;
      } 
      .summary{
        padding:8px 24px;
      }
    }`]}static get properties(){return{server:{type:String},apiKeyName:{type:String,attribute:"api-key-name"},apiKeyValue:{type:String,attribute:"api-key-value"},apiKeyLocation:{type:String,attribute:"api-key-location"},layout:{type:String},path:{type:Object},allowTry:{type:String,attribute:"allow-try"}}}toggleExpand(){this.path.expanded=!this.path.expanded,this.requestUpdate()}});customElements.define("end-points",class extends a.a{render(){return a.c`${this.paths.filter(t=>!this.matchPaths||`${t.method} ${t.path}`.includes(this.matchPaths)).map(t=>a.c`<end-point server="${this.server}" api-key-name="${this.apiKeyName}" api-key-value="${this.apiKeyValue}" api-key-location="${this.apiKeyLocation}" layout="${this.layout}" .path="${t}" allow-try="${this.allowTry}"></end-point>`)}`}static get properties(){return{server:{type:String},apiKeyName:{type:String,attribute:"api-key-name"},apiKeyValue:{type:String,attribute:"api-key-value"},apiKeyLocation:{type:String,attribute:"api-key-location"},layout:{type:String},paths:{type:Object},matchPaths:{type:String,attribute:"match-paths"},allowTry:{type:String,attribute:"allow-try"}}}});customElements.define("security-schemes",class extends a.a{render(){return a.c`${s} ${d} ${c}<style>.url{
        display: inline-flex;
        color: #999;
        max-width: 220px;
        overflow-wrap: break-word;
        word-break: break-all;
      }</style><div>AUTHENTICATION</div><table style="width:auto" class="m-table"><tr><th>Type</th><th>Authentication Procedure</th></tr>${Object.keys(this.schemes).map(t=>a.c`<tr><td><div style="font-weight:bold">${this.schemes[t].type}: ${this.schemes[t].scheme}</div>${this.schemes[t].description?a.c`<div class="m-markdown">${Object(i.a)(l()(this.schemes[t].description))}</div>`:""}</td><td>${"apiKey"===this.schemes[t].type?a.c`Send <code>'${this.schemes[t].name}'</code> in <code>'${this.schemes[t].in}'</code> with the given value<div class="api-key" data-type="${this.schemes[t].type}" data-in="${this.schemes[t].in}" data-name="${this.schemes[t].name}" style="margin:5px 0"><input type="text" name="token" style="width:202px;" placeholder="api-token"> <button class="m-btn" data-action="${this.keyValue?"CLEAR":"SET"}" @click="${this.dispatchChange}">${this.keyValue?"CLEAR":"SET"}</button></div>`:""} ${"http"===this.schemes[t].type&&"basic"===this.schemes[t].scheme?a.c`Send <code>'Authorization'</code> in header which will contains the word <code>'Basic'</code> followed by a space and a base64-encoded string username:password.<div class="api-key" data-type="${this.schemes[t].type}" data-scheme="${this.schemes[t].scheme}" data-in="header" data-name="Authorization" style="margin:15px 0"><input type="text" name="username" style="width:100px;" placeholder="username"> <input type="text" name="password" style="width:100px;" placeholder="password"> <button class="m-btn" data-action="${this.keyValue?"CLEAR":"SET"}" @click="${this.dispatchChange}">${this.keyValue?"CLEAR":"SET"}</button></div>`:""} ${"http"===this.schemes[t].type&&"bearer"===this.schemes[t].scheme?a.c`Send <code>'Authorization'</code> in header which will contains the word <code>'Bearer'</code> followed by a space and a Token String.<div class="api-key" data-type="${this.schemes[t].type}" data-scheme="${this.schemes[t].scheme}" data-in="header" data-name="Authorization" style="margin:15px 0"><input type="text" name="token" style="width:202px;" placeholder="api-token"> <button class="m-btn" data-action="${this.keyValue?"CLEAR":"SET"}" @click="${this.dispatchChange}">${this.keyValue?"CLEAR":"SET"}</button></div>`:""} ${"oauth2"===this.schemes[t].type?a.c`<div>${Object.keys(this.schemes[t].flows).map(e=>a.c`${this.schemes[t].flows[e].authorizationUrl?a.c`<div><b>Auth URL:</b> <code class="url">${this.schemes[t].flows[e].authorizationUrl}</code></div>`:""} ${this.schemes[t].flows[e].tokenUrl?a.c`<div><b>Token URL:</b> <code class="url">${this.schemes[t].flows[e].tokenUrl}</code></div>`:""} ${this.schemes[t].flows[e].refreshUrl?a.c`<div><b>Refresh URL:</b> <code class="url">${this.schemes[t].flows[e].refreshUrl}</code></div>`:""}<div class="oauth" style="margin:5px 0"><input type="text" name="client" style="width:100px;" placeholder="client-id"> <input type="text" name="secret" style="width:100px;" placeholder="client-secret"></div>`)}</div>`:""}</td></tr>`)}</table>`}static get properties(){return{schemes:{type:Object},keyValue:{type:String}}}dispatchChange(t){let e=t.target.closest(".api-key");if(!e)return;let r=e.dataset.type,a=e.dataset.in,i=e.dataset.name;if("CLEAR"===t.target.dataset.action){this.keyValue="";let t=e.querySelector("input[name=token]");t&&(t.value="")}else if("apiKey"===r){let t=e.querySelector("input[name=token]");t&&(this.keyValue=t.value)}else if("http"===r){let t=e.dataset.scheme;if("basic"===t){let t=e.querySelector("input[name=username]"),r=e.querySelector("input[name=password]");t&&r&&(this.keyValue="Basic "+btoa(t.value+":"+r.value))}else if("bearer"===t){let t=e.querySelector("input[name=token]");t&&(this.keyValue="Bearer "+t.value)}}let o=new CustomEvent("change",{detail:{keyType:r,keyName:i,keyValue:this.keyValue,keyLocation:a}});this.dispatchEvent(o)}});var $=r(38),m=r.n($),w=r(64),S=r.n(w);var L=r(39),C=r.n(L);r(136);class k extends a.a{render(){return a.c`${s} ${c} ${p} ${d} ${"dark"===this.theme?a.c`<style>:host{
          --bg:#333;
          --bg2:#444;
          --fg:#bbb;
          --fg2:#aaa;
          --light-fg:#777;
          --very-light-fg:#666;
          --pre-border-color:#666;
          --pre-fg:#fff;
          --pre-bg:#222;
          --code-fg:#ccc;
          --code-bg:transparent;
          --border-color:#666;
          --input-bg:#303030;
          --input-border-color:#297aa2;
          --placeholder-color:#666;
          --light-border-color:#444;
          --light-get-color:#2a2a2a;
          --light-put-color:#2a2a2a;
          --light-post-color:#2a2a2a;
          --light-delete-color:#2a2a2a;
          --light-patch-color:#2a2a2a;
          --hover-color:#2a2a2a;
        }</style>`:a.c`<style>:host{
          --bg:#fff;
          --bg2:#fafafa;
          --fg:#333;
          --fg2:#565656;
          --light-fg:#999;
          --very-light-fg:#bbb;
          --pre-border-color:#000;
          --pre-fg:#ccc;
          --pre-bg:#263238;
          --code-fg:#ccc;
          --code-bg:transparent;
          --border-color:#ccc;
          --input-bg:#fff;
          --input-border-color:#C5D9E8;
          --placeholder-color:#dedede;
          --light-border-color:#eee;
          --light-get-color:#eff8fd;
          --light-put-color:#fff5e6;
          --light-post-color:#fbfff0;
          --light-delete-color:#fff0f0;
          --light-patch-color:#fff5cc;
          --hover-color:#f7f7f7;
        }</style>`}<style>:host{
          --error-color:#ff3333;
          --success-color:#47AFE8;
          --hover-bg:#f7f7f7;
          --get-color:#47AFE8;
          --put-color:#FF9900;
          --post-color:#99CC00;
          --delete-color:#F06560;
          --patch-color:#fc0;
          --link-color:#47AFE8;
          --primary-color:${this.primaryColor?`${this.primaryColor}`:"#FF791A"};
          --dark-primary-color:${o.color.brightness(this.primaryColor?this.primaryColor:"#FF791A",-30)};
          --primary-text:${this.primaryColor?`${o.color.invert(this.primaryColor)}`:"#ffffff"};
          --header-bg:${this.headerColor?`${this.headerColor}`:"#444"};
          --header-fg:${this.headerColor?`${o.color.invert(this.headerColor)}`:"#ccc"};
          --layout:${this.layout?`${this.layout}`:"row"};
          --font-mono:${this.monoFont?`${this.monoFont}`:"Monaco, 'Andale Mono', 'Roboto Mono', Consolas"}; 
          --font-regular:${this.regularFont?`${this.regularFont}`:"rapidoc, Helvetica, Arial"};
          --title-font-size:16px;
          --border-radius:2px;

          display:block;
          min-width:375px;
          width:100%;
          height:100%;
          margin:0;
          padding:0;
          overflow: auto;
          letter-spacing:normal;
          color:var(--fg);
          background-color:var(--bg);
          font-family:var(--font-regular);
        }

        .body-container{ 
          margin:0;
        }
        .section-gap { 
          padding: 24px 8px 8px 8px; 
        }

        .logo { 
          height:36px;
          width:36px;
          margin-left:5px; 
        }
        .only-large-screen-flex,
        .only-large-screen{
          display:none;
        }
        .header-title{
          font-size:24px; padding:0 8px;
        }
        .tag{
          text-transform: uppercase;
        }
        .header{
          background-color:var(--header-bg);
          color:var(--header-fg);
        }

        input.header-input{
          background:${this.headerColor?o.color.brightness(this.headerColor,-20):o.color.inputReverseBg};
          color:var(--header-fg);
          border:1px solid var(--dark-primary-color);
          flex:1; 
          padding-right:24px;
          border-radius:3px;
        }
        input.header-input::placeholder {
          opacity:0.4;
        }


        @media only screen and (min-width: 768px){
          .only-large-screen{
            display:block;
          }
          .only-large-screen-flex{
            display:flex;
          }
          .body-container{ 
            margin:0 16px;
          }
          .section-gap { 
            padding: 24px 24px 8px 24px; 
          }
        }</style>${"false"===this.showHeader?"":a.c`<div class="row header regular-font" style="padding:8px 4px 8px 4px;min-height:48px;position:sticky;top:0;flex:1"><div class="only-large-screen-flex" style="align-items: center;"><slot name="logo" class="logo"><m-logo style="height:36px;width:36px;margin-left:5px"></m-logo></slot><div class="header-title">${this.headingText}</div></div><div style="margin: 0px 8px;display:flex;flex:1">${"false"===this.allowSpecUrlLoad?"":a.c`<input id="spec-url" type="text" class="header-input" placeholder="Spec URL" value="${this.specUrl?this.specUrl:""}" @change="${this.onSepcUrlChange}"><div style="margin: 6px 5px 0 -24px; font-size:18px; cursor:pointer;">&#x23ce;</div>`} ${"false"===this.allowSpecFileLoad?"":a.c`<input id="spec-file" type="file" style="display:none" value="${this.specFile?this.specFile:""}" @change="${this.onSepcFileChange}"> <button class="m-btn only-large-screen" style="margin-left:10px;" @click="${this.onFileLoadClick}">LOCAL JSON FILE</button>`} ${"false"===this.allowSearch?"":a.c`<input id="search" class="header-input" type="text" placeholder="search" @change="${this.onSearchChange}" style="max-width:130px;margin-left:10px;"><div style="margin: 6px 5px 0 -24px; font-size:18px; cursor:pointer;">&#x23ce;</div>`}</div></div>`}<div class="body-container regular-font"><slot></slot>${"false"!==this.showInfo&&this.resolvedSpec&&this.resolvedSpec.info?a.c`<div class="section-gap"><div class="title">${this.resolvedSpec.info.title} ${this.resolvedSpec.info.version?a.c`<span style="font-size:14px;font-weight:bold">${this.resolvedSpec.info.version}</span>`:""}</div>${this.resolvedSpec.info.description?a.c`${Object(i.a)(`<div class='m-markdown regular-font'>${l()(this.resolvedSpec.info.description)}</div>`)}`:""}</div>`:""} ${"false"!==this.allowTry&&this.resolvedSpec&&this.resolvedSpec.servers&&0!==this.resolvedSpec.servers.length?a.c`<div class="sub-title regular-font section-gap"><a id="api_server_options">API SERVER:</a><div style="margin: 8px 0; font-size:12px">${this.resolvedSpec.servers.map(t=>a.c`<input type="radio" name="api_server" value="${t.url}" @change="${this.onApiServerChange}" checked="checked" style="margin:0 0 5px 8px"> ${t.url}<br>`)}</div></div>`:""} ${"false"!==this.allowAuthentication&&this.resolvedSpec&&this.resolvedSpec.securitySchemes?a.c`<div class="sub-title regular-font section-gap"><security-schemes .schemes="${this.resolvedSpec.securitySchemes}" @change="${this.onSecurityChange}"></security-schemes></div>`:""} ${this.resolvedSpec&&this.resolvedSpec.tags?a.c`${this.resolvedSpec.tags.map(t=>a.c`<div class="sub-title tag regular-font section-gap">${t.name}</div><div style="margin:4px 20px">${Object(i.a)(`<div class='m-markdown regular-font'>${l()(t.description?t.description:"")}</div>`)}</div><end-points server="${this.server?this.server:""}" api-key-name="${this.apiKeyName?this.apiKeyName:""}" api-key-value="${this.apiKeyValue?this.apiKeyValue:""}" api-key-location="${this.apiKeyLocation?this.apiKeyLocation:""}" layout="${this.layout?this.layout:"row"}" .paths="${t.paths}" allow-try="${this.allowTry}" match-paths="${this.matchPaths}"></end-points>`)}`:""}<slot name="footer"></slot></div>`}static get properties(){return{specUrl:{type:String,attribute:"spec-url"},specFile:{type:String,attribute:!1},server:{type:String},matchPaths:{type:String,attribute:"match-paths"},headingText:{type:String,attribute:"heading-text"},headerColor:{type:String,attribute:"header-color"},primaryColor:{type:String,attribute:"primary-color"},regularFont:{type:String,attribute:"regular-font"},monoFont:{type:String,attribute:"mono-font"},showHeader:{type:String,attribute:"show-header"},showInfo:{type:String,attribute:"show-info"},allowAuthentication:{type:String,attribute:"allow-authentication"},allowTry:{type:String,attribute:"allow-try"},allowSpecUrlLoad:{type:String,attribute:"allow-spec-url-load"},allowSpecFileLoad:{type:String,attribute:"allow-spec-file-load"},allowSearch:{type:String,attribute:"allow-search"},layout:{type:String},theme:{type:String},logoUrl:{type:String,attribute:"logo-url"},apiKeyName:{type:String,attribute:"api-key-name"},apiKeyValue:{type:String,attribute:"api-key-value"},apiKeyLocation:{type:String,attribute:"api-key-location"}}}attributeChangedCallback(t,e,r){"spec-url"==t&&(console.log("url changed"),e!==r&&this.loadSpec(r)),super.attributeChangedCallback(t,e,r)}onSepcUrlChange(t){this.setAttribute("spec-url",this.shadowRoot.getElementById("spec-url").value)}onSepcFileChange(t){let e=this;this.setAttribute("spec-file",this.shadowRoot.getElementById("spec-file").value);let r=t.target.files[0],a=new FileReader;a.onload=function(t){try{let t=JSON.parse(a.result);e.loadSpec(t),e.shadowRoot.getElementById("spec-url").value=""}catch(t){alert("Unable to read or parse json"),console.log("Unable to read or parse json")}},a.readAsText(r)}onFileLoadClick(){this.shadowRoot.getElementById("spec-file").click()}onApiServerChange(){let t=this.shadowRoot.querySelector("input[name='api_server']:checked");null!==t&&(this.server=t.value)}onSecurityChange(t){this.apiKeyName=t.detail.keyName,this.apiKeyValue=t.detail.keyValue,this.apiKeyLocation=t.detail.keyLocation}onSearchChange(t){this.matchPaths=t.target.value}loadSpec(t){let e=this;t&&(this.apiKeyName="",this.apiKeyValue="",this.apiKeyLocation="",this.server="",this.matchPaths="",function(t){let e,r={patch:!0,warnOnly:!0};return(e="string"==typeof t?m.a.convertUrl(t,r):m.a.convertObj(t,r)).then(function(t){return console.info("%c Convertion to OpenAPI 3.0 - Success !!! ","color:cornflowerblue"),S.a.dereference(t.openapi)}).then(function(e){console.info("%c OpenAPI 3.0 Dereferencing - Success !!! ","color:cornflowerblue");let r=["get","put","post","delete","patch","options","head"],a=[],i=0;for(let t in e.paths){let o=e.paths[t].parameters,n={summary:e.paths[t].summary,description:e.paths[t].description,servers:e.paths[t].servers?e.paths[t].servers:[],parameters:e.paths[t].parameters?e.paths[t].parameters:[]};r.forEach(function(r){let l,s,d;if(e.paths[t][r]){let p=e.paths[t][r];if(p.tags)s=p.tags[0],e.tags&&(d=e.tags.find(function(t){return t.name===s}));else{let e=t.indexOf("/",1);-1===e?e=t.length-1:e-=1,s=t.substr(1,e)}(l=a.find(t=>t.name==s))||(l={show:!0,name:s,description:d?d.description:"",paths:[]},a.push(l));let c=p.summary?p.summary:"",u=p.description?p.description:"";if(!c&&u)if(u.length>100){let t=-1;(-1===(t=u.indexOf("\n"))||t>100)&&(t=u.indexOf(". ")),(-1===t||t>100)&&(t=u.indexOf(".")),c=-1===t||t>100?u:u.substr(0,t)}else c=u;let h=[];h=o?p.parameters?o.filter(t=>{if(!p.parameters.some(e=>t.name===e.name&&t.in===e.in))return t}).concat(p.parameters):o.slice(0):p.parameters?p.parameters.slice(0):[],l.paths.push({show:!0,expanded:!1,expandedAtLeastOnce:!1,summary:c,method:r,description:p.description,path:t,operationId:p.operationId,requestBody:p.requestBody,parameters:h,servers:p.servers?n.servers.concat(p.servers):n.servers,responses:p.responses,deprecated:p.deprecated,security:p.security,commonSummary:n.summary,commonDescription:n.description}),i++}})}let o={},n=[];o=e.components?e.components.securitySchemes:{},e.servers&&e.servers.map(function(e){if(e.url&&"/"===e.url.substr(0,1)){let r=t.split("/");e.url=r[0]+"//"+r[2]+e.url}}),n=e.servers;let l={info:e.info,tags:a,externalDocs:e.externalDocs,securitySchemes:o,servers:n,basePath:e.basePath,totalPathCount:i};return Promise.resolve(l)}).catch(function(t){alert(t),console.error(t)})}(t).then(function(t){null==t&&console.error("Onoes! The API is invalid. "),console.log(t),e.afterSpecParsedAndValidated(t)}).catch(function(t){e.loading=!1,alert("The API Spec is invalid or not readable "),console.error("Onoes! The API is invalid. "+t.message)}))}afterSpecParsedAndValidated(t){arguments.length>1&&void 0!==arguments[1]&&arguments[1];let e=this;this.resolvedSpec=C()(t),this.resolvedSpecMaster=C()(t),this.requestUpdate(),window.setTimeout(function(){e.onApiServerChange()},0)}}customElements.define("rapi-doc",k);e.default={RapiDoc:k}},32:function(t,e,r){e=t.exports=r(66)(!1);var a=r(67),i=a(r(68)),o=a(r(69)),n=a(r(70)),l=a(r(71));e.push([t.i,"@font-face {\n  font-family: 'rapidoc';\n  src: url("+i+") format(\"woff2\");\n  font-weight: 400;\n  font-style: normal; }\n\n@font-face {\n  font-family: 'rapidoc';\n  src: url("+o+") format(\"woff2\");\n  font-weight: 500;\n  font-style: normal; }\n\n@font-face {\n  font-family: 'roboto-mono';\n  src: url("+n+") format(\"woff2\");\n  font-weight: 400;\n  font-style: normal; }\n\n@font-face {\n  font-family: 'roboto-mono';\n  src: url("+l+') format("woff2");\n  font-weight: 500;\n  font-style: normal; }\n\nbody, html {\n  width: 100%;\n  height: 100%;\n  margin: 0;\n  padding: 0; }\n  body::-webkit-scrollbar, html::-webkit-scrollbar {\n    width: 8px;\n    height: 8px; }\n  body::-webkit-scrollbar-track, html::-webkit-scrollbar-track {\n    background-color: transparent; }\n  body::-webkit-scrollbar-thumb, html::-webkit-scrollbar-thumb {\n    background-color: rgba(0, 0, 0, 0.4);\n    border-radius: 3px; }\n',""])},65:function(t,e,r){var a=r(32);"string"==typeof a&&(a=[[t.i,a,""]]);var i={hmr:!0,transform:void 0,insertInto:void 0},o=r(72)(a,i);a.locals&&(t.exports=a.locals),t.hot.accept(32,function(){var e=r(32);if("string"==typeof e&&(e=[[t.i,e,""]]),!function(t,e){var r,a=0;for(r in t){if(!e||t[r]!==e[r])return!1;a++}for(r in e)a--;return 0===a}(a.locals,e.locals))throw new Error("Aborting CSS HMR due to changed css-modules locals.");o(e)}),t.hot.dispose(function(){o()})},68:function(t,e,r){t.exports=r.p+"rapidoc-regular.woff2"},69:function(t,e,r){t.exports=r.p+"rapidoc-semi-bold.woff2"},70:function(t,e,r){t.exports=r.p+"roboto-mono-regular.woff2"},71:function(t,e,r){t.exports=r.p+"roboto-mono-bold.woff2"}},[[137,1,2]]]);
//# sourceMappingURL=0.rapidoc-min.js.map