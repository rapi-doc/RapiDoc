import { LitElement, html } from 'lit-element'; 
import vars from '@/styles/vars';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import marked from 'marked';
import ApiRequest from '@/components/api-request'; 
import ApiResponse from '@/components/api-response'; 
import FontStyles from '@/styles/font-styles';

// Create your custom component
export default class EndPoint extends LitElement {
  render() {
    return html`
     ${FontStyles}
    <style>
      .m-endpoint.expanded{
        margin-bottom:16px; 
      }
      .m-endpoint > .head{
        border-width:1px 1px 1px 5px;
        border-style:solid;
        border-color:transparent;
        border-top-color:var(--light-border-color);
        display:flex;
        padding:6px 16px;
        align-items: baseline;
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
        border: 1px solid var(--patch-color); 
        background-color:var(--light-patch-color); 
      }
      .m-endpoint .body {
        flex-wrap:wrap;
        padding:16px 0px 0 0px;
        border-width:0px 1px 1px 5px;
        border-style:solid;
        box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.15);
      }
      .m-endpoint .body.delete{ border-color:var(--delete-color); }
      .m-endpoint .body.patch{ border-color:var(--patch-color); }
      .m-endpoint .body.put{ border-color:var(--put-color); }
      .m-endpoint .body.post{border-color:var(--post-color);}
      .m-endpoint .body.get{ border-color:var(--get-color); }

      .head .path{
        display: inline-block;
        font-family: monospace;
        align-items: center;
        word-wrap: break-word;
        min-width:400px;
      }

      .head .descr{
        font-size: 12px;
        color:var(--light-fg);
        font-weight:400;
        overflow: hidden;
        display: inline-block;
        align-items: center;

      }

      .body .summary{
        padding:8px 24px;
      }
      .body .summary .title{
        font-size:20px;
        margin-bottom: 6px;
        white-space:nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .head .depricated{
        text-decoration: line-through red;
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
        flex-direction: var(--layout, row);
        border-top:1px solid var(--light-border-color);
      }
      .request,
      .response{
        flex:1; 
        min-height:100px;
        padding:16px 24px;
        overflow:hidden;
      }
      ${this.layout==='row'?
      html`
      .patch .request{ border-right: 1px solid var(--patch-color); }
      .put .request{ border-right: 1px solid var(--put-color); }
      .post .request{ border-right: 1px solid var(--post-color); }
      .get .request{ border-right: 1px solid var(--get-color); }
      .delete .request{ border-right: 1px solid var(--delete-color); }
      `:
      html`
      .patch .request{ border-bottom: 1px dashed var(--patch-color); }
      .put .request{ border-bottom: 1px dashed var(--put-color); }
      .post .request{ border-bottom: 1px dashed var(--post-color); }
      .get .request{ border-bottom: 1px dashed var(--get-color); }
      .delete .request{ border-bottom: 1px dashed var(--delete-color); }
      `
      }

    </style>
      
    <div  class='m-endpoint regular-font ${this.path.method} ${this.path.expanded?'expanded':'collapsed'}'>
      
      <!-- Endpoint Head -->
      <div @click="${this.toggleExpand}" class='head ${this.path.method} ${this.path.expanded?'expanded':'collapsed'}'>
        <div class="method ${this.path.method}" > ${this.path.method} </div> 
        <div class="path ${this.path.depricated?'depricated':''}"> ${this.path.path} </div>
          ${this.path.depricated?html`<span style="font-size:12px; text-transform:uppercase; font-weight:bold; color:orangered; margin:2px 0 0 5px;"> Depricated </span>`:''}
        <div style="min-width:60px; flex:1"></div>
        <div class="descr"> ${this.path.summary} </div>
      </div>
      
      <!-- Endpoint Body -->
      ${this.path.expanded?html`
      <div class='body ${this.path.method}'>
        ${this.path.summary || this.path.description?html`
          <div class="summary">
            <div class="title">${this.path.summary}</div>
            ${this.path.summary !== this.path.description?html`
              <div class="m-markdown"> 
                ${unsafeHTML(marked(this.path.description?this.path.description:''))}
              </div>`
            :''}  
          </div>`
        :``}
        <div class='req-resp-container'> 
          <api-request  class="request"  .parameters="${this.path.parameters}" .request_body="${this.path.requestBody}"  ></api-request>
          <api-response class="response" .responses="${this.path.responses}"></api-response>
        </div>
      </div>`
    :``}

    </div>`
  }

  static get properties() {
    return {
      path:{type:Object},
      layout:{type:String}
    };
  }

  toggleExpand(){
    this.path.expanded = !this.path.expanded;
    console.log(this.path);
    this.requestUpdate();
  }
}
// Register the element with the browser
customElements.define('end-point', EndPoint);
