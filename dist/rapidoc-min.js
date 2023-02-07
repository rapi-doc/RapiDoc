/*! RapiDoc 9.3.5-beta | Author - Mrinmoy Majumdar | License information can be found in rapidoc-min.js.LICENSE.txt  */
(()=>{var e,t,r={205:(e,t,r)=>{"use strict";const n=window,o=n.ShadowRoot&&(void 0===n.ShadyCSS||n.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,a=Symbol(),i=new WeakMap;class s{constructor(e,t,r){if(this._$cssResult$=!0,r!==a)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(o&&void 0===e){const r=void 0!==t&&1===t.length;r&&(e=i.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&i.set(t,e))}return e}toString(){return this.cssText}}const l=e=>new s("string"==typeof e?e:e+"",void 0,a),c=(e,...t)=>{const r=1===e.length?e[0]:t.reduce(((t,r,n)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+e[n+1]),e[0]);return new s(r,e,a)},p=o?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const r of e.cssRules)t+=r.cssText;return l(t)})(e):e;var d;const u=window,h=u.trustedTypes,f=h?h.emptyScript:"",m=u.reactiveElementPolyfillSupport,g={toAttribute(e,t){switch(t){case Boolean:e=e?f:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=null!==e;break;case Number:r=null===e?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch(e){r=null}}return r}},y=(e,t)=>t!==e&&(t==t||e==e),v={attribute:!0,type:String,converter:g,reflect:!1,hasChanged:y};class b extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(e){var t;this.finalize(),(null!==(t=this.h)&&void 0!==t?t:this.h=[]).push(e)}static get observedAttributes(){this.finalize();const e=[];return this.elementProperties.forEach(((t,r)=>{const n=this._$Ep(r,t);void 0!==n&&(this._$Ev.set(n,r),e.push(n))})),e}static createProperty(e,t=v){if(t.state&&(t.attribute=!1),this.finalize(),this.elementProperties.set(e,t),!t.noAccessor&&!this.prototype.hasOwnProperty(e)){const r="symbol"==typeof e?Symbol():"__"+e,n=this.getPropertyDescriptor(e,r,t);void 0!==n&&Object.defineProperty(this.prototype,e,n)}}static getPropertyDescriptor(e,t,r){return{get(){return this[t]},set(n){const o=this[e];this[t]=n,this.requestUpdate(e,o,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)||v}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const e=Object.getPrototypeOf(this);if(e.finalize(),void 0!==e.h&&(this.h=[...e.h]),this.elementProperties=new Map(e.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const e=this.properties,t=[...Object.getOwnPropertyNames(e),...Object.getOwnPropertySymbols(e)];for(const r of t)this.createProperty(r,e[r])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const e of r)t.unshift(p(e))}else void 0!==e&&t.push(p(e));return t}static _$Ep(e,t){const r=t.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof e?e.toLowerCase():void 0}u(){var e;this._$E_=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(e=this.constructor.h)||void 0===e||e.forEach((e=>e(this)))}addController(e){var t,r;(null!==(t=this._$ES)&&void 0!==t?t:this._$ES=[]).push(e),void 0!==this.renderRoot&&this.isConnected&&(null===(r=e.hostConnected)||void 0===r||r.call(e))}removeController(e){var t;null===(t=this._$ES)||void 0===t||t.splice(this._$ES.indexOf(e)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((e,t)=>{this.hasOwnProperty(t)&&(this._$Ei.set(t,this[t]),delete this[t])}))}createRenderRoot(){var e;const t=null!==(e=this.shadowRoot)&&void 0!==e?e:this.attachShadow(this.constructor.shadowRootOptions);return((e,t)=>{o?e.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet)):t.forEach((t=>{const r=document.createElement("style"),o=n.litNonce;void 0!==o&&r.setAttribute("nonce",o),r.textContent=t.cssText,e.appendChild(r)}))})(t,this.constructor.elementStyles),t}connectedCallback(){var e;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(e=this._$ES)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostConnected)||void 0===t?void 0:t.call(e)}))}enableUpdating(e){}disconnectedCallback(){var e;null===(e=this._$ES)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostDisconnected)||void 0===t?void 0:t.call(e)}))}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$EO(e,t,r=v){var n;const o=this.constructor._$Ep(e,r);if(void 0!==o&&!0===r.reflect){const a=(void 0!==(null===(n=r.converter)||void 0===n?void 0:n.toAttribute)?r.converter:g).toAttribute(t,r.type);this._$El=e,null==a?this.removeAttribute(o):this.setAttribute(o,a),this._$El=null}}_$AK(e,t){var r;const n=this.constructor,o=n._$Ev.get(e);if(void 0!==o&&this._$El!==o){const e=n.getPropertyOptions(o),a="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==(null===(r=e.converter)||void 0===r?void 0:r.fromAttribute)?e.converter:g;this._$El=o,this[o]=a.fromAttribute(t,e.type),this._$El=null}}requestUpdate(e,t,r){let n=!0;void 0!==e&&(((r=r||this.constructor.getPropertyOptions(e)).hasChanged||y)(this[e],t)?(this._$AL.has(e)||this._$AL.set(e,t),!0===r.reflect&&this._$El!==e&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(e,r))):n=!1),!this.isUpdatePending&&n&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((e,t)=>this[t]=e)),this._$Ei=void 0);let t=!1;const r=this._$AL;try{t=this.shouldUpdate(r),t?(this.willUpdate(r),null===(e=this._$ES)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostUpdate)||void 0===t?void 0:t.call(e)})),this.update(r)):this._$Ek()}catch(e){throw t=!1,this._$Ek(),e}t&&this._$AE(r)}willUpdate(e){}_$AE(e){var t;null===(t=this._$ES)||void 0===t||t.forEach((e=>{var t;return null===(t=e.hostUpdated)||void 0===t?void 0:t.call(e)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(e){return!0}update(e){void 0!==this._$EC&&(this._$EC.forEach(((e,t)=>this._$EO(t,this[t],e))),this._$EC=void 0),this._$Ek()}updated(e){}firstUpdated(e){}}var x;b.finalized=!0,b.elementProperties=new Map,b.elementStyles=[],b.shadowRootOptions={mode:"open"},null==m||m({ReactiveElement:b}),(null!==(d=u.reactiveElementVersions)&&void 0!==d?d:u.reactiveElementVersions=[]).push("1.6.1");const w=window,k=w.trustedTypes,$=k?k.createPolicy("lit-html",{createHTML:e=>e}):void 0,S=`lit$${(Math.random()+"").slice(9)}$`,A="?"+S,E=`<${A}>`,O=document,C=(e="")=>O.createComment(e),T=e=>null===e||"object"!=typeof e&&"function"!=typeof e,j=Array.isArray,I=e=>j(e)||"function"==typeof(null==e?void 0:e[Symbol.iterator]),P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,R=/>/g,L=RegExp(">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)","g"),B=/'/g,F=/"/g,D=/^(?:script|style|textarea|title)$/i,z=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),q=z(1),N=(z(2),Symbol.for("lit-noChange")),U=Symbol.for("lit-nothing"),M=new WeakMap,H=O.createTreeWalker(O,129,null,!1),W=(e,t)=>{const r=e.length-1,n=[];let o,a=2===t?"<svg>":"",i=P;for(let t=0;t<r;t++){const r=e[t];let s,l,c=-1,p=0;for(;p<r.length&&(i.lastIndex=p,l=i.exec(r),null!==l);)p=i.lastIndex,i===P?"!--"===l[1]?i=_:void 0!==l[1]?i=R:void 0!==l[2]?(D.test(l[2])&&(o=RegExp("</"+l[2],"g")),i=L):void 0!==l[3]&&(i=L):i===L?">"===l[0]?(i=null!=o?o:P,c=-1):void 0===l[1]?c=-2:(c=i.lastIndex-l[2].length,s=l[1],i=void 0===l[3]?L:'"'===l[3]?F:B):i===F||i===B?i=L:i===_||i===R?i=P:(i=L,o=void 0);const d=i===L&&e[t+1].startsWith("/>")?" ":"";a+=i===P?r+E:c>=0?(n.push(s),r.slice(0,c)+"$lit$"+r.slice(c)+S+d):r+S+(-2===c?(n.push(void 0),t):d)}const s=a+(e[r]||"<?>")+(2===t?"</svg>":"");if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==$?$.createHTML(s):s,n]};class V{constructor({strings:e,_$litType$:t},r){let n;this.parts=[];let o=0,a=0;const i=e.length-1,s=this.parts,[l,c]=W(e,t);if(this.el=V.createElement(l,r),H.currentNode=this.el.content,2===t){const e=this.el.content,t=e.firstChild;t.remove(),e.append(...t.childNodes)}for(;null!==(n=H.nextNode())&&s.length<i;){if(1===n.nodeType){if(n.hasAttributes()){const e=[];for(const t of n.getAttributeNames())if(t.endsWith("$lit$")||t.startsWith(S)){const r=c[a++];if(e.push(t),void 0!==r){const e=n.getAttribute(r.toLowerCase()+"$lit$").split(S),t=/([.?@])?(.*)/.exec(r);s.push({type:1,index:o,name:t[2],strings:e,ctor:"."===t[1]?Y:"?"===t[1]?X:"@"===t[1]?ee:Z})}else s.push({type:6,index:o})}for(const t of e)n.removeAttribute(t)}if(D.test(n.tagName)){const e=n.textContent.split(S),t=e.length-1;if(t>0){n.textContent=k?k.emptyScript:"";for(let r=0;r<t;r++)n.append(e[r],C()),H.nextNode(),s.push({type:2,index:++o});n.append(e[t],C())}}}else if(8===n.nodeType)if(n.data===A)s.push({type:2,index:o});else{let e=-1;for(;-1!==(e=n.data.indexOf(S,e+1));)s.push({type:7,index:o}),e+=S.length-1}o++}}static createElement(e,t){const r=O.createElement("template");return r.innerHTML=e,r}}function G(e,t,r=e,n){var o,a,i,s;if(t===N)return t;let l=void 0!==n?null===(o=r._$Co)||void 0===o?void 0:o[n]:r._$Cl;const c=T(t)?void 0:t._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(a=null==l?void 0:l._$AO)||void 0===a||a.call(l,!1),void 0===c?l=void 0:(l=new c(e),l._$AT(e,r,n)),void 0!==n?(null!==(i=(s=r)._$Co)&&void 0!==i?i:s._$Co=[])[n]=l:r._$Cl=l),void 0!==l&&(t=G(e,l._$AS(e,t.values),l,n)),t}class K{constructor(e,t){this.u=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}v(e){var t;const{el:{content:r},parts:n}=this._$AD,o=(null!==(t=null==e?void 0:e.creationScope)&&void 0!==t?t:O).importNode(r,!0);H.currentNode=o;let a=H.nextNode(),i=0,s=0,l=n[0];for(;void 0!==l;){if(i===l.index){let t;2===l.type?t=new J(a,a.nextSibling,this,e):1===l.type?t=new l.ctor(a,l.name,l.strings,this,e):6===l.type&&(t=new te(a,this,e)),this.u.push(t),l=n[++s]}i!==(null==l?void 0:l.index)&&(a=H.nextNode(),i++)}return o}p(e){let t=0;for(const r of this.u)void 0!==r&&(void 0!==r.strings?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}}class J{constructor(e,t,r,n){var o;this.type=2,this._$AH=U,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=n,this._$Cm=null===(o=null==n?void 0:n.isConnected)||void 0===o||o}get _$AU(){var e,t;return null!==(t=null===(e=this._$AM)||void 0===e?void 0:e._$AU)&&void 0!==t?t:this._$Cm}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=G(this,e,t),T(e)?e===U||null==e||""===e?(this._$AH!==U&&this._$AR(),this._$AH=U):e!==this._$AH&&e!==N&&this.g(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):I(e)?this.k(e):this.g(e)}O(e,t=this._$AB){return this._$AA.parentNode.insertBefore(e,t)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}g(e){this._$AH!==U&&T(this._$AH)?this._$AA.nextSibling.data=e:this.T(O.createTextNode(e)),this._$AH=e}$(e){var t;const{values:r,_$litType$:n}=e,o="number"==typeof n?this._$AC(e):(void 0===n.el&&(n.el=V.createElement(n.h,this.options)),n);if((null===(t=this._$AH)||void 0===t?void 0:t._$AD)===o)this._$AH.p(r);else{const e=new K(o,this),t=e.v(this.options);e.p(r),this.T(t),this._$AH=e}}_$AC(e){let t=M.get(e.strings);return void 0===t&&M.set(e.strings,t=new V(e)),t}k(e){j(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let r,n=0;for(const o of e)n===t.length?t.push(r=new J(this.O(C()),this.O(C()),this,this.options)):r=t[n],r._$AI(o),n++;n<t.length&&(this._$AR(r&&r._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){var r;for(null===(r=this._$AP)||void 0===r||r.call(this,!1,!0,t);e&&e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){var t;void 0===this._$AM&&(this._$Cm=e,null===(t=this._$AP)||void 0===t||t.call(this,e))}}class Z{constructor(e,t,r,n,o){this.type=1,this._$AH=U,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=o,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=U}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(e,t=this,r,n){const o=this.strings;let a=!1;if(void 0===o)e=G(this,e,t,0),a=!T(e)||e!==this._$AH&&e!==N,a&&(this._$AH=e);else{const n=e;let i,s;for(e=o[0],i=0;i<o.length-1;i++)s=G(this,n[r+i],t,i),s===N&&(s=this._$AH[i]),a||(a=!T(s)||s!==this._$AH[i]),s===U?e=U:e!==U&&(e+=(null!=s?s:"")+o[i+1]),this._$AH[i]=s}a&&!n&&this.j(e)}j(e){e===U?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=e?e:"")}}class Y extends Z{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===U?void 0:e}}const Q=k?k.emptyScript:"";class X extends Z{constructor(){super(...arguments),this.type=4}j(e){e&&e!==U?this.element.setAttribute(this.name,Q):this.element.removeAttribute(this.name)}}class ee extends Z{constructor(e,t,r,n,o){super(e,t,r,n,o),this.type=5}_$AI(e,t=this){var r;if((e=null!==(r=G(this,e,t,0))&&void 0!==r?r:U)===N)return;const n=this._$AH,o=e===U&&n!==U||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,a=e!==U&&(n===U||o);o&&this.element.removeEventListener(this.name,this,n),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,r;"function"==typeof this._$AH?this._$AH.call(null!==(r=null===(t=this.options)||void 0===t?void 0:t.host)&&void 0!==r?r:this.element,e):this._$AH.handleEvent(e)}}class te{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){G(this,e)}}const re=w.litHtmlPolyfillSupport;null==re||re(V,J),(null!==(x=w.litHtmlVersions)&&void 0!==x?x:w.litHtmlVersions=[]).push("2.6.1");var ne,oe;class ae extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,t;const r=super.createRenderRoot();return null!==(e=(t=this.renderOptions).renderBefore)&&void 0!==e||(t.renderBefore=r.firstChild),r}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,r)=>{var n,o;const a=null!==(n=null==r?void 0:r.renderBefore)&&void 0!==n?n:t;let i=a._$litPart$;if(void 0===i){const e=null!==(o=null==r?void 0:r.renderBefore)&&void 0!==o?o:null;a._$litPart$=i=new J(t.insertBefore(C(),e),e,void 0,null!=r?r:{})}return i._$AI(e),i})(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),null===(e=this._$Do)||void 0===e||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._$Do)||void 0===e||e.setConnected(!1)}render(){return N}}ae.finalized=!0,ae._$litElement$=!0,null===(ne=globalThis.litElementHydrateSupport)||void 0===ne||ne.call(globalThis,{LitElement:ae});const ie=globalThis.litElementPolyfillSupport;null==ie||ie({LitElement:ae});function se(){return{async:!1,baseUrl:null,breaks:!1,extensions:null,gfm:!0,headerIds:!0,headerPrefix:"",highlight:null,langPrefix:"language-",mangle:!0,pedantic:!1,renderer:null,sanitize:!1,sanitizer:null,silent:!1,smartypants:!1,tokenizer:null,walkTokens:null,xhtml:!1}}(null!==(oe=globalThis.litElementVersions)&&void 0!==oe?oe:globalThis.litElementVersions=[]).push("3.2.2");let le={async:!1,baseUrl:null,breaks:!1,extensions:null,gfm:!0,headerIds:!0,headerPrefix:"",highlight:null,langPrefix:"language-",mangle:!0,pedantic:!1,renderer:null,sanitize:!1,sanitizer:null,silent:!1,smartypants:!1,tokenizer:null,walkTokens:null,xhtml:!1};const ce=/[&<>"']/,pe=new RegExp(ce.source,"g"),de=/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,ue=new RegExp(de.source,"g"),he={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},fe=e=>he[e];function me(e,t){if(t){if(ce.test(e))return e.replace(pe,fe)}else if(de.test(e))return e.replace(ue,fe);return e}const ge=/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;function ye(e){return e.replace(ge,((e,t)=>"colon"===(t=t.toLowerCase())?":":"#"===t.charAt(0)?"x"===t.charAt(1)?String.fromCharCode(parseInt(t.substring(2),16)):String.fromCharCode(+t.substring(1)):""))}const ve=/(^|[^\[])\^/g;function be(e,t){e="string"==typeof e?e:e.source,t=t||"";const r={replace:(t,n)=>(n=(n=n.source||n).replace(ve,"$1"),e=e.replace(t,n),r),getRegex:()=>new RegExp(e,t)};return r}const xe=/[^\w:]/g,we=/^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;function ke(e,t,r){if(e){let e;try{e=decodeURIComponent(ye(r)).replace(xe,"").toLowerCase()}catch(e){return null}if(0===e.indexOf("javascript:")||0===e.indexOf("vbscript:")||0===e.indexOf("data:"))return null}t&&!we.test(r)&&(r=function(e,t){$e[" "+e]||(Se.test(e)?$e[" "+e]=e+"/":$e[" "+e]=je(e,"/",!0));const r=-1===(e=$e[" "+e]).indexOf(":");return"//"===t.substring(0,2)?r?t:e.replace(Ae,"$1")+t:"/"===t.charAt(0)?r?t:e.replace(Ee,"$1")+t:e+t}(t,r));try{r=encodeURI(r).replace(/%25/g,"%")}catch(e){return null}return r}const $e={},Se=/^[^:]+:\/*[^/]*$/,Ae=/^([^:]+:)[\s\S]*$/,Ee=/^([^:]+:\/*[^/]*)[\s\S]*$/;const Oe={exec:function(){}};function Ce(e){let t,r,n=1;for(;n<arguments.length;n++)for(r in t=arguments[n],t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e}function Te(e,t){const r=e.replace(/\|/g,((e,t,r)=>{let n=!1,o=t;for(;--o>=0&&"\\"===r[o];)n=!n;return n?"|":" |"})).split(/ \|/);let n=0;if(r[0].trim()||r.shift(),r.length>0&&!r[r.length-1].trim()&&r.pop(),r.length>t)r.splice(t);else for(;r.length<t;)r.push("");for(;n<r.length;n++)r[n]=r[n].trim().replace(/\\\|/g,"|");return r}function je(e,t,r){const n=e.length;if(0===n)return"";let o=0;for(;o<n;){const a=e.charAt(n-o-1);if(a!==t||r){if(a===t||!r)break;o++}else o++}return e.slice(0,n-o)}function Ie(e){e&&e.sanitize&&!e.silent&&console.warn("marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options")}function Pe(e,t){if(t<1)return"";let r="";for(;t>1;)1&t&&(r+=e),t>>=1,e+=e;return r+e}function _e(e,t,r,n){const o=t.href,a=t.title?me(t.title):null,i=e[1].replace(/\\([\[\]])/g,"$1");if("!"!==e[0].charAt(0)){n.state.inLink=!0;const e={type:"link",raw:r,href:o,title:a,text:i,tokens:n.inlineTokens(i)};return n.state.inLink=!1,e}return{type:"image",raw:r,href:o,title:a,text:me(i)}}class Re{constructor(e){this.options=e||le}space(e){const t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){const t=this.rules.block.code.exec(e);if(t){const e=t[0].replace(/^ {1,4}/gm,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?e:je(e,"\n")}}}fences(e){const t=this.rules.block.fences.exec(e);if(t){const e=t[0],r=function(e,t){const r=e.match(/^(\s+)(?:```)/);if(null===r)return t;const n=r[1];return t.split("\n").map((e=>{const t=e.match(/^\s+/);if(null===t)return e;const[r]=t;return r.length>=n.length?e.slice(n.length):e})).join("\n")}(e,t[3]||"");return{type:"code",raw:e,lang:t[2]?t[2].trim().replace(this.rules.inline._escapes,"$1"):t[2],text:r}}}heading(e){const t=this.rules.block.heading.exec(e);if(t){let e=t[2].trim();if(/#$/.test(e)){const t=je(e,"#");this.options.pedantic?e=t.trim():t&&!/ $/.test(t)||(e=t.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:e,tokens:this.lexer.inline(e)}}}hr(e){const t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:t[0]}}blockquote(e){const t=this.rules.block.blockquote.exec(e);if(t){const e=t[0].replace(/^ *>[ \t]?/gm,""),r=this.lexer.state.top;this.lexer.state.top=!0;const n=this.lexer.blockTokens(e);return this.lexer.state.top=r,{type:"blockquote",raw:t[0],tokens:n,text:e}}}list(e){let t=this.rules.block.list.exec(e);if(t){let r,n,o,a,i,s,l,c,p,d,u,h,f=t[1].trim();const m=f.length>1,g={type:"list",raw:"",ordered:m,start:m?+f.slice(0,-1):"",loose:!1,items:[]};f=m?`\\d{1,9}\\${f.slice(-1)}`:`\\${f}`,this.options.pedantic&&(f=m?f:"[*+-]");const y=new RegExp(`^( {0,3}${f})((?:[\t ][^\\n]*)?(?:\\n|$))`);for(;e&&(h=!1,t=y.exec(e))&&!this.rules.block.hr.test(e);){if(r=t[0],e=e.substring(r.length),c=t[2].split("\n",1)[0].replace(/^\t+/,(e=>" ".repeat(3*e.length))),p=e.split("\n",1)[0],this.options.pedantic?(a=2,u=c.trimLeft()):(a=t[2].search(/[^ ]/),a=a>4?1:a,u=c.slice(a),a+=t[1].length),s=!1,!c&&/^ *$/.test(p)&&(r+=p+"\n",e=e.substring(p.length+1),h=!0),!h){const t=new RegExp(`^ {0,${Math.min(3,a-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ \t][^\\n]*)?(?:\\n|$))`),n=new RegExp(`^ {0,${Math.min(3,a-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),o=new RegExp(`^ {0,${Math.min(3,a-1)}}(?:\`\`\`|~~~)`),i=new RegExp(`^ {0,${Math.min(3,a-1)}}#`);for(;e&&(d=e.split("\n",1)[0],p=d,this.options.pedantic&&(p=p.replace(/^ {1,4}(?=( {4})*[^ ])/g,"  ")),!o.test(p))&&!i.test(p)&&!t.test(p)&&!n.test(e);){if(p.search(/[^ ]/)>=a||!p.trim())u+="\n"+p.slice(a);else{if(s)break;if(c.search(/[^ ]/)>=4)break;if(o.test(c))break;if(i.test(c))break;if(n.test(c))break;u+="\n"+p}s||p.trim()||(s=!0),r+=d+"\n",e=e.substring(d.length+1),c=p.slice(a)}}g.loose||(l?g.loose=!0:/\n *\n *$/.test(r)&&(l=!0)),this.options.gfm&&(n=/^\[[ xX]\] /.exec(u),n&&(o="[ ] "!==n[0],u=u.replace(/^\[[ xX]\] +/,""))),g.items.push({type:"list_item",raw:r,task:!!n,checked:o,loose:!1,text:u}),g.raw+=r}g.items[g.items.length-1].raw=r.trimRight(),g.items[g.items.length-1].text=u.trimRight(),g.raw=g.raw.trimRight();const v=g.items.length;for(i=0;i<v;i++)if(this.lexer.state.top=!1,g.items[i].tokens=this.lexer.blockTokens(g.items[i].text,[]),!g.loose){const e=g.items[i].tokens.filter((e=>"space"===e.type)),t=e.length>0&&e.some((e=>/\n.*\n/.test(e.raw)));g.loose=t}if(g.loose)for(i=0;i<v;i++)g.items[i].loose=!0;return g}}html(e){const t=this.rules.block.html.exec(e);if(t){const e={type:"html",raw:t[0],pre:!this.options.sanitizer&&("pre"===t[1]||"script"===t[1]||"style"===t[1]),text:t[0]};if(this.options.sanitize){const r=this.options.sanitizer?this.options.sanitizer(t[0]):me(t[0]);e.type="paragraph",e.text=r,e.tokens=this.lexer.inline(r)}return e}}def(e){const t=this.rules.block.def.exec(e);if(t){const e=t[1].toLowerCase().replace(/\s+/g," "),r=t[2]?t[2].replace(/^<(.*)>$/,"$1").replace(this.rules.inline._escapes,"$1"):"",n=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline._escapes,"$1"):t[3];return{type:"def",tag:e,raw:t[0],href:r,title:n}}}table(e){const t=this.rules.block.table.exec(e);if(t){const e={type:"table",header:Te(t[1]).map((e=>({text:e}))),align:t[2].replace(/^ *|\| *$/g,"").split(/ *\| */),rows:t[3]&&t[3].trim()?t[3].replace(/\n[ \t]*$/,"").split("\n"):[]};if(e.header.length===e.align.length){e.raw=t[0];let r,n,o,a,i=e.align.length;for(r=0;r<i;r++)/^ *-+: *$/.test(e.align[r])?e.align[r]="right":/^ *:-+: *$/.test(e.align[r])?e.align[r]="center":/^ *:-+ *$/.test(e.align[r])?e.align[r]="left":e.align[r]=null;for(i=e.rows.length,r=0;r<i;r++)e.rows[r]=Te(e.rows[r],e.header.length).map((e=>({text:e})));for(i=e.header.length,n=0;n<i;n++)e.header[n].tokens=this.lexer.inline(e.header[n].text);for(i=e.rows.length,n=0;n<i;n++)for(a=e.rows[n],o=0;o<a.length;o++)a[o].tokens=this.lexer.inline(a[o].text);return e}}}lheading(e){const t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:"="===t[2].charAt(0)?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){const t=this.rules.block.paragraph.exec(e);if(t){const e="\n"===t[1].charAt(t[1].length-1)?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:e,tokens:this.lexer.inline(e)}}}text(e){const t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){const t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:me(t[1])}}tag(e){const t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&/^<a /i.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&/^<\/a>/i.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&/^<(pre|code|kbd|script)(\s|>)/i.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&/^<\/(pre|code|kbd|script)(\s|>)/i.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:this.options.sanitize?"text":"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,text:this.options.sanitize?this.options.sanitizer?this.options.sanitizer(t[0]):me(t[0]):t[0]}}link(e){const t=this.rules.inline.link.exec(e);if(t){const e=t[2].trim();if(!this.options.pedantic&&/^</.test(e)){if(!/>$/.test(e))return;const t=je(e.slice(0,-1),"\\");if((e.length-t.length)%2==0)return}else{const e=function(e,t){if(-1===e.indexOf(t[1]))return-1;const r=e.length;let n=0,o=0;for(;o<r;o++)if("\\"===e[o])o++;else if(e[o]===t[0])n++;else if(e[o]===t[1]&&(n--,n<0))return o;return-1}(t[2],"()");if(e>-1){const r=(0===t[0].indexOf("!")?5:4)+t[1].length+e;t[2]=t[2].substring(0,e),t[0]=t[0].substring(0,r).trim(),t[3]=""}}let r=t[2],n="";if(this.options.pedantic){const e=/^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(r);e&&(r=e[1],n=e[3])}else n=t[3]?t[3].slice(1,-1):"";return r=r.trim(),/^</.test(r)&&(r=this.options.pedantic&&!/>$/.test(e)?r.slice(1):r.slice(1,-1)),_e(t,{href:r?r.replace(this.rules.inline._escapes,"$1"):r,title:n?n.replace(this.rules.inline._escapes,"$1"):n},t[0],this.lexer)}}reflink(e,t){let r;if((r=this.rules.inline.reflink.exec(e))||(r=this.rules.inline.nolink.exec(e))){let e=(r[2]||r[1]).replace(/\s+/g," ");if(e=t[e.toLowerCase()],!e){const e=r[0].charAt(0);return{type:"text",raw:e,text:e}}return _e(r,e,r[0],this.lexer)}}emStrong(e,t,r=""){let n=this.rules.inline.emStrong.lDelim.exec(e);if(!n)return;if(n[3]&&r.match(/[\p{L}\p{N}]/u))return;const o=n[1]||n[2]||"";if(!o||o&&(""===r||this.rules.inline.punctuation.exec(r))){const r=n[0].length-1;let o,a,i=r,s=0;const l="*"===n[0][0]?this.rules.inline.emStrong.rDelimAst:this.rules.inline.emStrong.rDelimUnd;for(l.lastIndex=0,t=t.slice(-1*e.length+r);null!=(n=l.exec(t));){if(o=n[1]||n[2]||n[3]||n[4]||n[5]||n[6],!o)continue;if(a=o.length,n[3]||n[4]){i+=a;continue}if((n[5]||n[6])&&r%3&&!((r+a)%3)){s+=a;continue}if(i-=a,i>0)continue;a=Math.min(a,a+i+s);const t=e.slice(0,r+n.index+(n[0].length-o.length)+a);if(Math.min(r,a)%2){const e=t.slice(1,-1);return{type:"em",raw:t,text:e,tokens:this.lexer.inlineTokens(e)}}const l=t.slice(2,-2);return{type:"strong",raw:t,text:l,tokens:this.lexer.inlineTokens(l)}}}}codespan(e){const t=this.rules.inline.code.exec(e);if(t){let e=t[2].replace(/\n/g," ");const r=/[^ ]/.test(e),n=/^ /.test(e)&&/ $/.test(e);return r&&n&&(e=e.substring(1,e.length-1)),e=me(e,!0),{type:"codespan",raw:t[0],text:e}}}br(e){const t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e){const t=this.rules.inline.del.exec(e);if(t)return{type:"del",raw:t[0],text:t[2],tokens:this.lexer.inlineTokens(t[2])}}autolink(e,t){const r=this.rules.inline.autolink.exec(e);if(r){let e,n;return"@"===r[2]?(e=me(this.options.mangle?t(r[1]):r[1]),n="mailto:"+e):(e=me(r[1]),n=e),{type:"link",raw:r[0],text:e,href:n,tokens:[{type:"text",raw:e,text:e}]}}}url(e,t){let r;if(r=this.rules.inline.url.exec(e)){let e,n;if("@"===r[2])e=me(this.options.mangle?t(r[0]):r[0]),n="mailto:"+e;else{let t;do{t=r[0],r[0]=this.rules.inline._backpedal.exec(r[0])[0]}while(t!==r[0]);e=me(r[0]),n="www."===r[1]?"http://"+r[0]:r[0]}return{type:"link",raw:r[0],text:e,href:n,tokens:[{type:"text",raw:e,text:e}]}}}inlineText(e,t){const r=this.rules.inline.text.exec(e);if(r){let e;return e=this.lexer.state.inRawBlock?this.options.sanitize?this.options.sanitizer?this.options.sanitizer(r[0]):me(r[0]):r[0]:me(this.options.smartypants?t(r[0]):r[0]),{type:"text",raw:r[0],text:e}}}}const Le={newline:/^(?: *(?:\n|$))+/,code:/^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,fences:/^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?=\n|$)|$)/,hr:/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,heading:/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,blockquote:/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,list:/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/,html:"^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))",def:/^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/,table:Oe,lheading:/^((?:.|\n(?!\n))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,_paragraph:/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,text:/^[^\n]+/,_label:/(?!\s*\])(?:\\.|[^\[\]\\])+/,_title:/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/};Le.def=be(Le.def).replace("label",Le._label).replace("title",Le._title).getRegex(),Le.bullet=/(?:[*+-]|\d{1,9}[.)])/,Le.listItemStart=be(/^( *)(bull) */).replace("bull",Le.bullet).getRegex(),Le.list=be(Le.list).replace(/bull/g,Le.bullet).replace("hr","\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def","\\n+(?="+Le.def.source+")").getRegex(),Le._tag="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Le._comment=/<!--(?!-?>)[\s\S]*?(?:-->|$)/,Le.html=be(Le.html,"i").replace("comment",Le._comment).replace("tag",Le._tag).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Le.paragraph=be(Le._paragraph).replace("hr",Le.hr).replace("heading"," {0,3}#{1,6} ").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Le._tag).getRegex(),Le.blockquote=be(Le.blockquote).replace("paragraph",Le.paragraph).getRegex(),Le.normal=Ce({},Le),Le.gfm=Ce({},Le.normal,{table:"^ *([^\\n ].*\\|.*)\\n {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"}),Le.gfm.table=be(Le.gfm.table).replace("hr",Le.hr).replace("heading"," {0,3}#{1,6} ").replace("blockquote"," {0,3}>").replace("code"," {4}[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Le._tag).getRegex(),Le.gfm.paragraph=be(Le._paragraph).replace("hr",Le.hr).replace("heading"," {0,3}#{1,6} ").replace("|lheading","").replace("table",Le.gfm.table).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Le._tag).getRegex(),Le.pedantic=Ce({},Le.normal,{html:be("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment",Le._comment).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Oe,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:be(Le.normal._paragraph).replace("hr",Le.hr).replace("heading"," *#{1,6} *[^\n]").replace("lheading",Le.lheading).replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").getRegex()});const Be={escape:/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,autolink:/^<(scheme:[^\s\x00-\x1f<>]*|email)>/,url:Oe,tag:"^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",link:/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,reflink:/^!?\[(label)\]\[(ref)\]/,nolink:/^!?\[(ref)\](?:\[\])?/,reflinkSearch:"reflink|nolink(?!\\()",emStrong:{lDelim:/^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,rDelimAst:/^(?:[^_*\\]|\\.)*?\_\_(?:[^_*\\]|\\.)*?\*(?:[^_*\\]|\\.)*?(?=\_\_)|(?:[^*\\]|\\.)+(?=[^*])|[punct_](\*+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|(?:[^punct*_\s\\]|\\.)(\*+)(?=[^punct*_\s])/,rDelimUnd:/^(?:[^_*\\]|\\.)*?\*\*(?:[^_*\\]|\\.)*?\_(?:[^_*\\]|\\.)*?(?=\*\*)|(?:[^_\\]|\\.)+(?=[^_])|[punct*](\_+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/},code:/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,br:/^( {2,}|\\)\n(?!\s*$)/,del:Oe,text:/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,punctuation:/^([\spunctuation])/};function Fe(e){return e.replace(/---/g,"—").replace(/--/g,"–").replace(/(^|[-\u2014/(\[{"\s])'/g,"$1‘").replace(/'/g,"’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g,"$1“").replace(/"/g,"”").replace(/\.{3}/g,"…")}function De(e){let t,r,n="";const o=e.length;for(t=0;t<o;t++)r=e.charCodeAt(t),Math.random()>.5&&(r="x"+r.toString(16)),n+="&#"+r+";";return n}Be._punctuation="!\"#$%&'()+\\-.,/:;<=>?@\\[\\]`^{|}~",Be.punctuation=be(Be.punctuation).replace(/punctuation/g,Be._punctuation).getRegex(),Be.blockSkip=/\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g,Be.escapedEmSt=/(?:^|[^\\])(?:\\\\)*\\[*_]/g,Be._comment=be(Le._comment).replace("(?:--\x3e|$)","--\x3e").getRegex(),Be.emStrong.lDelim=be(Be.emStrong.lDelim).replace(/punct/g,Be._punctuation).getRegex(),Be.emStrong.rDelimAst=be(Be.emStrong.rDelimAst,"g").replace(/punct/g,Be._punctuation).getRegex(),Be.emStrong.rDelimUnd=be(Be.emStrong.rDelimUnd,"g").replace(/punct/g,Be._punctuation).getRegex(),Be._escapes=/\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g,Be._scheme=/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/,Be._email=/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/,Be.autolink=be(Be.autolink).replace("scheme",Be._scheme).replace("email",Be._email).getRegex(),Be._attribute=/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/,Be.tag=be(Be.tag).replace("comment",Be._comment).replace("attribute",Be._attribute).getRegex(),Be._label=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,Be._href=/<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/,Be._title=/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/,Be.link=be(Be.link).replace("label",Be._label).replace("href",Be._href).replace("title",Be._title).getRegex(),Be.reflink=be(Be.reflink).replace("label",Be._label).replace("ref",Le._label).getRegex(),Be.nolink=be(Be.nolink).replace("ref",Le._label).getRegex(),Be.reflinkSearch=be(Be.reflinkSearch,"g").replace("reflink",Be.reflink).replace("nolink",Be.nolink).getRegex(),Be.normal=Ce({},Be),Be.pedantic=Ce({},Be.normal,{strong:{start:/^__|\*\*/,middle:/^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,endAst:/\*\*(?!\*)/g,endUnd:/__(?!_)/g},em:{start:/^_|\*/,middle:/^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,endAst:/\*(?!\*)/g,endUnd:/_(?!_)/g},link:be(/^!?\[(label)\]\((.*?)\)/).replace("label",Be._label).getRegex(),reflink:be(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Be._label).getRegex()}),Be.gfm=Ce({},Be.normal,{escape:be(Be.escape).replace("])","~|])").getRegex(),_extended_email:/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,url:/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/}),Be.gfm.url=be(Be.gfm.url,"i").replace("email",Be.gfm._extended_email).getRegex(),Be.breaks=Ce({},Be.gfm,{br:be(Be.br).replace("{2,}","*").getRegex(),text:be(Be.gfm.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()});class ze{constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||le,this.options.tokenizer=this.options.tokenizer||new Re,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const t={block:Le.normal,inline:Be.normal};this.options.pedantic?(t.block=Le.pedantic,t.inline=Be.pedantic):this.options.gfm&&(t.block=Le.gfm,this.options.breaks?t.inline=Be.breaks:t.inline=Be.gfm),this.tokenizer.rules=t}static get rules(){return{block:Le,inline:Be}}static lex(e,t){return new ze(t).lex(e)}static lexInline(e,t){return new ze(t).inlineTokens(e)}lex(e){let t;for(e=e.replace(/\r\n|\r/g,"\n"),this.blockTokens(e,this.tokens);t=this.inlineQueue.shift();)this.inlineTokens(t.src,t.tokens);return this.tokens}blockTokens(e,t=[]){let r,n,o,a;for(e=this.options.pedantic?e.replace(/\t/g,"    ").replace(/^ +$/gm,""):e.replace(/^( *)(\t+)/gm,((e,t,r)=>t+"    ".repeat(r.length)));e;)if(!(this.options.extensions&&this.options.extensions.block&&this.options.extensions.block.some((n=>!!(r=n.call({lexer:this},e,t))&&(e=e.substring(r.raw.length),t.push(r),!0)))))if(r=this.tokenizer.space(e))e=e.substring(r.raw.length),1===r.raw.length&&t.length>0?t[t.length-1].raw+="\n":t.push(r);else if(r=this.tokenizer.code(e))e=e.substring(r.raw.length),n=t[t.length-1],!n||"paragraph"!==n.type&&"text"!==n.type?t.push(r):(n.raw+="\n"+r.raw,n.text+="\n"+r.text,this.inlineQueue[this.inlineQueue.length-1].src=n.text);else if(r=this.tokenizer.fences(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.heading(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.hr(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.blockquote(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.list(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.html(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.def(e))e=e.substring(r.raw.length),n=t[t.length-1],!n||"paragraph"!==n.type&&"text"!==n.type?this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title}):(n.raw+="\n"+r.raw,n.text+="\n"+r.raw,this.inlineQueue[this.inlineQueue.length-1].src=n.text);else if(r=this.tokenizer.table(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.lheading(e))e=e.substring(r.raw.length),t.push(r);else{if(o=e,this.options.extensions&&this.options.extensions.startBlock){let t=1/0;const r=e.slice(1);let n;this.options.extensions.startBlock.forEach((function(e){n=e.call({lexer:this},r),"number"==typeof n&&n>=0&&(t=Math.min(t,n))})),t<1/0&&t>=0&&(o=e.substring(0,t+1))}if(this.state.top&&(r=this.tokenizer.paragraph(o)))n=t[t.length-1],a&&"paragraph"===n.type?(n.raw+="\n"+r.raw,n.text+="\n"+r.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=n.text):t.push(r),a=o.length!==e.length,e=e.substring(r.raw.length);else if(r=this.tokenizer.text(e))e=e.substring(r.raw.length),n=t[t.length-1],n&&"text"===n.type?(n.raw+="\n"+r.raw,n.text+="\n"+r.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=n.text):t.push(r);else if(e){const t="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(t);break}throw new Error(t)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){let r,n,o,a,i,s,l=e;if(this.tokens.links){const e=Object.keys(this.tokens.links);if(e.length>0)for(;null!=(a=this.tokenizer.rules.inline.reflinkSearch.exec(l));)e.includes(a[0].slice(a[0].lastIndexOf("[")+1,-1))&&(l=l.slice(0,a.index)+"["+Pe("a",a[0].length-2)+"]"+l.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;null!=(a=this.tokenizer.rules.inline.blockSkip.exec(l));)l=l.slice(0,a.index)+"["+Pe("a",a[0].length-2)+"]"+l.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);for(;null!=(a=this.tokenizer.rules.inline.escapedEmSt.exec(l));)l=l.slice(0,a.index+a[0].length-2)+"++"+l.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex),this.tokenizer.rules.inline.escapedEmSt.lastIndex--;for(;e;)if(i||(s=""),i=!1,!(this.options.extensions&&this.options.extensions.inline&&this.options.extensions.inline.some((n=>!!(r=n.call({lexer:this},e,t))&&(e=e.substring(r.raw.length),t.push(r),!0)))))if(r=this.tokenizer.escape(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.tag(e))e=e.substring(r.raw.length),n=t[t.length-1],n&&"text"===r.type&&"text"===n.type?(n.raw+=r.raw,n.text+=r.text):t.push(r);else if(r=this.tokenizer.link(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.reflink(e,this.tokens.links))e=e.substring(r.raw.length),n=t[t.length-1],n&&"text"===r.type&&"text"===n.type?(n.raw+=r.raw,n.text+=r.text):t.push(r);else if(r=this.tokenizer.emStrong(e,l,s))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.codespan(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.br(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.del(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.autolink(e,De))e=e.substring(r.raw.length),t.push(r);else if(this.state.inLink||!(r=this.tokenizer.url(e,De))){if(o=e,this.options.extensions&&this.options.extensions.startInline){let t=1/0;const r=e.slice(1);let n;this.options.extensions.startInline.forEach((function(e){n=e.call({lexer:this},r),"number"==typeof n&&n>=0&&(t=Math.min(t,n))})),t<1/0&&t>=0&&(o=e.substring(0,t+1))}if(r=this.tokenizer.inlineText(o,Fe))e=e.substring(r.raw.length),"_"!==r.raw.slice(-1)&&(s=r.raw.slice(-1)),i=!0,n=t[t.length-1],n&&"text"===n.type?(n.raw+=r.raw,n.text+=r.text):t.push(r);else if(e){const t="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(t);break}throw new Error(t)}}else e=e.substring(r.raw.length),t.push(r);return t}}class qe{constructor(e){this.options=e||le}code(e,t,r){const n=(t||"").match(/\S*/)[0];if(this.options.highlight){const t=this.options.highlight(e,n);null!=t&&t!==e&&(r=!0,e=t)}return e=e.replace(/\n$/,"")+"\n",n?'<pre><code class="'+this.options.langPrefix+me(n)+'">'+(r?e:me(e,!0))+"</code></pre>\n":"<pre><code>"+(r?e:me(e,!0))+"</code></pre>\n"}blockquote(e){return`<blockquote>\n${e}</blockquote>\n`}html(e){return e}heading(e,t,r,n){if(this.options.headerIds){return`<h${t} id="${this.options.headerPrefix+n.slug(r)}">${e}</h${t}>\n`}return`<h${t}>${e}</h${t}>\n`}hr(){return this.options.xhtml?"<hr/>\n":"<hr>\n"}list(e,t,r){const n=t?"ol":"ul";return"<"+n+(t&&1!==r?' start="'+r+'"':"")+">\n"+e+"</"+n+">\n"}listitem(e){return`<li>${e}</li>\n`}checkbox(e){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox"'+(this.options.xhtml?" /":"")+"> "}paragraph(e){return`<p>${e}</p>\n`}table(e,t){return t&&(t=`<tbody>${t}</tbody>`),"<table>\n<thead>\n"+e+"</thead>\n"+t+"</table>\n"}tablerow(e){return`<tr>\n${e}</tr>\n`}tablecell(e,t){const r=t.header?"th":"td";return(t.align?`<${r} align="${t.align}">`:`<${r}>`)+e+`</${r}>\n`}strong(e){return`<strong>${e}</strong>`}em(e){return`<em>${e}</em>`}codespan(e){return`<code>${e}</code>`}br(){return this.options.xhtml?"<br/>":"<br>"}del(e){return`<del>${e}</del>`}link(e,t,r){if(null===(e=ke(this.options.sanitize,this.options.baseUrl,e)))return r;let n='<a href="'+e+'"';return t&&(n+=' title="'+t+'"'),n+=">"+r+"</a>",n}image(e,t,r){if(null===(e=ke(this.options.sanitize,this.options.baseUrl,e)))return r;let n=`<img src="${e}" alt="${r}"`;return t&&(n+=` title="${t}"`),n+=this.options.xhtml?"/>":">",n}text(e){return e}}class Ne{strong(e){return e}em(e){return e}codespan(e){return e}del(e){return e}html(e){return e}text(e){return e}link(e,t,r){return""+r}image(e,t,r){return""+r}br(){return""}}class Ue{constructor(){this.seen={}}serialize(e){return e.toLowerCase().trim().replace(/<[!\/a-z].*?>/gi,"").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g,"").replace(/\s/g,"-")}getNextSafeSlug(e,t){let r=e,n=0;if(this.seen.hasOwnProperty(r)){n=this.seen[e];do{n++,r=e+"-"+n}while(this.seen.hasOwnProperty(r))}return t||(this.seen[e]=n,this.seen[r]=0),r}slug(e,t={}){const r=this.serialize(e);return this.getNextSafeSlug(r,t.dryrun)}}class Me{constructor(e){this.options=e||le,this.options.renderer=this.options.renderer||new qe,this.renderer=this.options.renderer,this.renderer.options=this.options,this.textRenderer=new Ne,this.slugger=new Ue}static parse(e,t){return new Me(t).parse(e)}static parseInline(e,t){return new Me(t).parseInline(e)}parse(e,t=!0){let r,n,o,a,i,s,l,c,p,d,u,h,f,m,g,y,v,b,x,w="";const k=e.length;for(r=0;r<k;r++)if(d=e[r],this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[d.type]&&(x=this.options.extensions.renderers[d.type].call({parser:this},d),!1!==x||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(d.type)))w+=x||"";else switch(d.type){case"space":continue;case"hr":w+=this.renderer.hr();continue;case"heading":w+=this.renderer.heading(this.parseInline(d.tokens),d.depth,ye(this.parseInline(d.tokens,this.textRenderer)),this.slugger);continue;case"code":w+=this.renderer.code(d.text,d.lang,d.escaped);continue;case"table":for(c="",l="",a=d.header.length,n=0;n<a;n++)l+=this.renderer.tablecell(this.parseInline(d.header[n].tokens),{header:!0,align:d.align[n]});for(c+=this.renderer.tablerow(l),p="",a=d.rows.length,n=0;n<a;n++){for(s=d.rows[n],l="",i=s.length,o=0;o<i;o++)l+=this.renderer.tablecell(this.parseInline(s[o].tokens),{header:!1,align:d.align[o]});p+=this.renderer.tablerow(l)}w+=this.renderer.table(c,p);continue;case"blockquote":p=this.parse(d.tokens),w+=this.renderer.blockquote(p);continue;case"list":for(u=d.ordered,h=d.start,f=d.loose,a=d.items.length,p="",n=0;n<a;n++)g=d.items[n],y=g.checked,v=g.task,m="",g.task&&(b=this.renderer.checkbox(y),f?g.tokens.length>0&&"paragraph"===g.tokens[0].type?(g.tokens[0].text=b+" "+g.tokens[0].text,g.tokens[0].tokens&&g.tokens[0].tokens.length>0&&"text"===g.tokens[0].tokens[0].type&&(g.tokens[0].tokens[0].text=b+" "+g.tokens[0].tokens[0].text)):g.tokens.unshift({type:"text",text:b}):m+=b),m+=this.parse(g.tokens,f),p+=this.renderer.listitem(m,v,y);w+=this.renderer.list(p,u,h);continue;case"html":w+=this.renderer.html(d.text);continue;case"paragraph":w+=this.renderer.paragraph(this.parseInline(d.tokens));continue;case"text":for(p=d.tokens?this.parseInline(d.tokens):d.text;r+1<k&&"text"===e[r+1].type;)d=e[++r],p+="\n"+(d.tokens?this.parseInline(d.tokens):d.text);w+=t?this.renderer.paragraph(p):p;continue;default:{const e='Token with "'+d.type+'" type was not found.';if(this.options.silent)return void console.error(e);throw new Error(e)}}return w}parseInline(e,t){t=t||this.renderer;let r,n,o,a="";const i=e.length;for(r=0;r<i;r++)if(n=e[r],this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[n.type]&&(o=this.options.extensions.renderers[n.type].call({parser:this},n),!1!==o||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(n.type)))a+=o||"";else switch(n.type){case"escape":case"text":a+=t.text(n.text);break;case"html":a+=t.html(n.text);break;case"link":a+=t.link(n.href,n.title,this.parseInline(n.tokens,t));break;case"image":a+=t.image(n.href,n.title,n.text);break;case"strong":a+=t.strong(this.parseInline(n.tokens,t));break;case"em":a+=t.em(this.parseInline(n.tokens,t));break;case"codespan":a+=t.codespan(n.text);break;case"br":a+=t.br();break;case"del":a+=t.del(this.parseInline(n.tokens,t));break;default:{const e='Token with "'+n.type+'" type was not found.';if(this.options.silent)return void console.error(e);throw new Error(e)}}return a}}function He(e,t,r){if(null==e)throw new Error("marked(): input parameter is undefined or null");if("string"!=typeof e)throw new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected");if("function"==typeof t&&(r=t,t=null),Ie(t=Ce({},He.defaults,t||{})),r){const n=t.highlight;let o;try{o=ze.lex(e,t)}catch(e){return r(e)}const a=function(e){let a;if(!e)try{t.walkTokens&&He.walkTokens(o,t.walkTokens),a=Me.parse(o,t)}catch(t){e=t}return t.highlight=n,e?r(e):r(null,a)};if(!n||n.length<3)return a();if(delete t.highlight,!o.length)return a();let i=0;return He.walkTokens(o,(function(e){"code"===e.type&&(i++,setTimeout((()=>{n(e.text,e.lang,(function(t,r){if(t)return a(t);null!=r&&r!==e.text&&(e.text=r,e.escaped=!0),i--,0===i&&a()}))}),0))})),void(0===i&&a())}function n(e){if(e.message+="\nPlease report this to https://github.com/markedjs/marked.",t.silent)return"<p>An error occurred:</p><pre>"+me(e.message+"",!0)+"</pre>";throw e}try{const r=ze.lex(e,t);if(t.walkTokens){if(t.async)return Promise.all(He.walkTokens(r,t.walkTokens)).then((()=>Me.parse(r,t))).catch(n);He.walkTokens(r,t.walkTokens)}return Me.parse(r,t)}catch(e){n(e)}}He.options=He.setOptions=function(e){var t;return Ce(He.defaults,e),t=He.defaults,le=t,He},He.getDefaults=se,He.defaults=le,He.use=function(...e){const t=He.defaults.extensions||{renderers:{},childTokens:{}};e.forEach((e=>{const r=Ce({},e);if(r.async=He.defaults.async||r.async,e.extensions&&(e.extensions.forEach((e=>{if(!e.name)throw new Error("extension name required");if(e.renderer){const r=t.renderers[e.name];t.renderers[e.name]=r?function(...t){let n=e.renderer.apply(this,t);return!1===n&&(n=r.apply(this,t)),n}:e.renderer}if(e.tokenizer){if(!e.level||"block"!==e.level&&"inline"!==e.level)throw new Error("extension level must be 'block' or 'inline'");t[e.level]?t[e.level].unshift(e.tokenizer):t[e.level]=[e.tokenizer],e.start&&("block"===e.level?t.startBlock?t.startBlock.push(e.start):t.startBlock=[e.start]:"inline"===e.level&&(t.startInline?t.startInline.push(e.start):t.startInline=[e.start]))}e.childTokens&&(t.childTokens[e.name]=e.childTokens)})),r.extensions=t),e.renderer){const t=He.defaults.renderer||new qe;for(const r in e.renderer){const n=t[r];t[r]=(...o)=>{let a=e.renderer[r].apply(t,o);return!1===a&&(a=n.apply(t,o)),a}}r.renderer=t}if(e.tokenizer){const t=He.defaults.tokenizer||new Re;for(const r in e.tokenizer){const n=t[r];t[r]=(...o)=>{let a=e.tokenizer[r].apply(t,o);return!1===a&&(a=n.apply(t,o)),a}}r.tokenizer=t}if(e.walkTokens){const t=He.defaults.walkTokens;r.walkTokens=function(r){let n=[];return n.push(e.walkTokens.call(this,r)),t&&(n=n.concat(t.call(this,r))),n}}He.setOptions(r)}))},He.walkTokens=function(e,t){let r=[];for(const n of e)switch(r=r.concat(t.call(He,n)),n.type){case"table":for(const e of n.header)r=r.concat(He.walkTokens(e.tokens,t));for(const e of n.rows)for(const n of e)r=r.concat(He.walkTokens(n.tokens,t));break;case"list":r=r.concat(He.walkTokens(n.items,t));break;default:He.defaults.extensions&&He.defaults.extensions.childTokens&&He.defaults.extensions.childTokens[n.type]?He.defaults.extensions.childTokens[n.type].forEach((function(e){r=r.concat(He.walkTokens(n[e],t))})):n.tokens&&(r=r.concat(He.walkTokens(n.tokens,t)))}return r},He.parseInline=function(e,t){if(null==e)throw new Error("marked.parseInline(): input parameter is undefined or null");if("string"!=typeof e)throw new Error("marked.parseInline(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected");Ie(t=Ce({},He.defaults,t||{}));try{const r=ze.lexInline(e,t);return t.walkTokens&&He.walkTokens(r,t.walkTokens),Me.parseInline(r,t)}catch(e){if(e.message+="\nPlease report this to https://github.com/markedjs/marked.",t.silent)return"<p>An error occurred:</p><pre>"+me(e.message+"",!0)+"</pre>";throw e}},He.Parser=Me,He.parser=Me.parse,He.Renderer=qe,He.TextRenderer=Ne,He.Lexer=ze,He.lexer=ze.lex,He.Tokenizer=Re,He.Slugger=Ue,He.parse=He;He.options,He.setOptions,He.use,He.walkTokens,He.parseInline,Me.parse,ze.lex;var We=r(325),Ve=r.n(We);r(874),r(433),r(335),r(980),r(385),r(854),r(945),r(366),r(277),r(712),r(251),r(358),r(46),r(503),r(57),r(16);const Ge=c`
  .hover-bg:hover{
    background: var(--bg3);
  }
  ::selection {
    background: var(--selection-bg);
    color: var(--selection-fg);
  }
  .regular-font{ 
    font-family:var(--font-regular); 
  }
  .mono-font { 
    font-family:var(--font-mono); 
  }
  .title { 
    font-size: calc(var(--font-size-small) + 18px);
    font-weight: normal 
  }
  .sub-title{ font-size: 20px;}
  .req-res-title {
    font-family: var(--font-regular);
    font-size: calc(var(--font-size-small) + 4px);
    margin-bottom:8px;
    text-align:left;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
  }
  .tiny-title { 
    font-size:calc(var(--font-size-small) + 1px); 
    font-weight:bold; 
  }
  .regular-font-size { font-size: var(--font-size-regular); }
  .small-font-size { font-size: var(--font-size-small); }
  .upper { font-size: 14px; text-transform: uppercase; }
  .operation-tag { font-size: 16px; line-height: 18px; color: #A1A8B3; }
  .primary-text{ color: var(--primary-color); }
  .bold-text { font-weight:bold; }
  .gray-text { color: var(--light-fg); }
  .red-text {color: var(--red)}
  .blue-text {color: var(--blue)}
  .multiline {
    overflow: scroll;
    max-height: var(--resp-area-height, 400px);
    color: var(--fg3);  
  }
  .method-fg.put { color: var(--put-color); }
  .method-fg.post { color: var(--post-color); }
  .method-fg.get { color: var(--get-color); }
  .method-fg.delete { color: var(--delete-color); }
  .method-fg.options, 
  .method-fg.head, 
  .method-fg.patch { 
    color: var(--yellow); 
  }

  h1{ font-family:var(--font-regular); font-size:2em; padding-top: 0.73em; letter-spacing:normal; font-weight:normal; }
  h2{ font-family:var(--font-regular); font-size:1.375em; padding-top: 0.73em; letter-spacing:normal; font-weight:normal; }
  h3{ font-family:var(--font-regular); font-size:1.375em; padding-top: 0.73em; letter-spacing:normal; font-weight:normal; }
  h4{ font-family:var(--font-regular); font-size:1.35em; padding-top: 0.73em; letter-spacing:normal; font-weight:normal; }
  h5{ font-family:var(--font-regular); font-size:1.25em; padding-top: 0.73em; letter-spacing:normal; font-weight:normal; }
  h6{ font-family:var(--font-regular); font-size:1.25em; padding-top: 0.73em; letter-spacing:normal; font-weight:normal; }

  h1,h2,h3,h4,h5,h5{
    margin-block-end: 0.2em;
  }
  a { color: var(--rebel-pink); cursor:pointer; }
  a.inactive-link { 
    color:var(--fg);
    text-decoration: none;
    cursor:text;
  }
  
  code,
  pre {
    margin: 0px;
    font-family: var(--font-mono);
    font-size: calc(var(--font-size-mono) - 1px);
  }

  .m-markdown blockquote {
    padding: 5px 20px;
    width: 100%;
    margin: 20px 0;
    border-radius: 4px;
    align-items: center;
    background: #f8f7fc;
    border: 1px solid #ccced8;
    grid-template-columns: 20px 1fr;
  }

  .m-markdown,
  .m-markdown-small {
    display:block;
  }

  .m-markdown p,
  .m-markdown span {
    font-size: var(--font-size-regular);
  }
  .m-markdown li {
    font-size: var(--font-size-regular);
    line-height:calc(var(--font-size-regular) + 10px);
  }
  
  .m-markdown-small p,
  .m-markdown-small span,
  .m-markdown-small li {
    font-size: var(--font-size-small);
    line-height: calc(var(--font-size-small) + 6px);
  }
  .m-markdown-small li {
    line-height: calc(var(--font-size-small) + 8px);
  }

  code {
    background-color: #f6f8fa;
    border-radius: 4px;
    margin: 0;
    padding: 0.2em 0.4em;
  }

  .m-markdown code span {
    font-size:var(--font-size-mono);
  }

  .m-markdown-small code {
    font-size: calc(var(--font-size-mono) - 1px);
  }

  .m-markdown-small pre,
  .m-markdown pre {
    overflow-x: auto;
    line-height: normal;
    border-radius: 2px;
    border: 1px solid var(--code-border-color);
  }

  .m-markdown pre {
    paddingBlock: 16px;
    paddingInline: 32px;
    background-color: #F8F7FC;
    border: 1px solid #E7E9EE;
    color:var(--code-fg);
  }

  .m-markdown-small pre {
    margin-top: 4px;
    padding: 2px 4px;
    background-color: var(--bg3);
    color: var(--fg2);
  }

  .m-markdown-small pre code,
  .m-markdown pre code {
    border:none;
    padding:0;
  }

  .m-markdown pre code {
    color: #DC5A41;
    background-color: var(--code-bg);
    background-color: transparent;
  }

  .m-markdown-small pre code {
    color: var(--fg2);
    background-color: var(--bg3);
  }

  .m-markdown ul,
  .m-markdown ol {
    padding-inline-start: 30px;
  }

  .m-markdown-small ul,
  .m-markdown-small ol {
    padding-inline-start: 20px;
  }

  .m-markdown-small a,
  .m-markdown a {
    color:var(--rebel-pink);
    text-decoration: none;
  }

  .m-markdown-small img,
  .m-markdown img { 
    max-width: 100%; 
  }

  /* Markdown table */

  .m-markdown-small table,
  .m-markdown table {
    border-spacing: 0;
    margin: 10px 0;
    border-collapse: separate;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    font-size: calc(var(--font-size-small) + 1px);
    line-height: calc(var(--font-size-small) + 4px);
    max-width: 100%;
  }

  .m-markdown-small table {
    font-size: var(--font-size-small);
    line-height: calc(var(--font-size-small) + 2px);
    margin: 8px 0;
  }

  .m-markdown-small td, 
  .m-markdown-small th,
  .m-markdown td, 
  .m-markdown th {
    vertical-align: top;
    border-top: 1px solid var(--border-color);
    line-height: calc(var(--font-size-small) + 4px);
  }

  .m-markdown-small tr:first-child th,
  .m-markdown tr:first-child th {
    border-top: 0 none;
  }

  .m-markdown th, 
  .m-markdown td { 
    padding: 10px 12px; 
  }

  .m-markdown-small th,
  .m-markdown-small td { 
    padding: 8px 8px; 
  }

  .m-markdown th,
  .m-markdown-small th {
    font-weight: 600;
    background-color: var(--bg2);
    vertical-align: middle;
  }

  .m-markdown-small table code {
    font-size: calc(var(--font-size-mono) - 2px);
  }

  .m-markdown table code {
    font-size: calc(var(--font-size-mono) - 1px);
  }

  .m-markdown hr{
    border: 1px solid var(--border-color);
  }
`,Ke=c`
/* Button */
.m-btn {
  border-radius: var(--border-radius);
  font-weight: 400;
  display: inline-block;
  padding: 6px 16px;
  font-size: var(--font-size-small);
  outline: 0;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  border: 2px solid var(--primary-color);
  background-color:transparent;
  transition: background-color 0.2s;
  user-select: none;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
}
.m-btn.primary {
  background-color: var(--primary-color);
  color: var(--primary-color-invert);
}
.m-btn.thin-border { border-width: 1px; }
.m-btn.large { padding:8px 14px; }
.m-btn.small { padding:5px 12px; }
.m-btn.tiny { padding:5px 6px; }
.m-btn.circle { border-radius: 50%; }
.m-btn:hover { 
  background-color: var(--primary-color);
  color: var(--primary-color-invert);
}
.m-btn.nav { border: 2px solid var(--nav-accent-color); }
.m-btn.nav:hover { 
  background-color: var(--nav-accent-color);
}
.m-btn:disabled{ 
  background-color: var(--bg3);
  color: var(--fg3);
  border-color: var(--fg3);
  cursor: not-allowed;
  opacity: 0.4;
}
.toolbar-btn{
  cursor: pointer;
  padding: 4px;
  margin:0 2px;
  font-size: var(--font-size-small);
  min-width: 50px;
  color: var(--primary-color-invert);
  border-radius: 2px;
  border: none;
  background-color: var(--primary-color);
}

input, textarea, select, pre {
  color: #000000;
  outline: none;
  background-color: var(--input-bg);
  border: 1px solid #B9B9B9;
  border-radius: var(--border-radius);
}
button {
  font-family: var(--font-regular);
}

/* Form Inputs */
pre,
select,
textarea,
input[type="file"],
input[type="text"],
input[type="password"] {
  font-family: var(--font-regular);
  font-weight: 400;
  font-size: var(--font-size-regular);
  transition: border .2s;
  padding: 6px 8px;
  line-height: 140%;
}

select {
  font-family: var(--font-regular);
  padding: 5px 30px 5px 5px;
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%3E%3Cpath%20d%3D%22M10.3%203.3L6%207.6%201.7%203.3A1%201%200%2000.3%204.7l5%205a1%201%200%20001.4%200l5-5a1%201%200%2010-1.4-1.4z%22%20fill%3D%22%23777777%22%2F%3E%3C%2Fsvg%3E"); 
  background-position: calc(100% - 5px) center;
  background-repeat: no-repeat;  
  background-size: 10px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
}

select:hover {
  border-color: var(--primary-color);
}

input[type="text"]:hover {
  border-color: var(--fg2);
}

textarea::placeholder,
input[type="text"]::placeholder,
input[type="password"]::placeholder {
  color: var(--placeholder-color);
  opacity:1;
}

select:focus,
textarea:focus,
input[type="text"]:focus,
input[type="password"]:focus,
textarea:active,
input[type="text"]:active,
input[type="password"]:active {
  border-color: #3B3B3B;
  box-shadow: 0px 0px 0px 1px #FFFFFF, 0px 0px 0px 3px #B9B9B9;
}

input[type="file"]{
  font-family: var(--font-regular);
  padding:2px;
  cursor:pointer;
  border: 1px solid var(--primary-color);
  min-height: calc(var(--font-size-small) + 18px);
}

input[type="file"]::-webkit-file-upload-button {
  font-family: var(--font-regular);
  font-size: var(--font-size-small);
  outline: none;
  cursor:pointer;
  padding: 3px 8px;
  border: 1px solid var(--primary-color);
  background-color: var(--primary-color);
  color: var(--primary-color-invert);
  border-radius: var(--border-radius);;
  -webkit-appearance: none;
}

pre,
textarea {
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) var(--input-bg);
}

pre::-webkit-scrollbar,
textarea::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

pre::-webkit-scrollbar-track,
textarea::-webkit-scrollbar-track {
  background:var(--input-bg);
}
 
pre::-webkit-scrollbar-thumb,
textarea::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background-color: var(--border-color);
}

.link {
  font-size:var(--font-size-small);
  text-decoration: underline;
  color:var(--rebel-pink);
  font-family:var(--font-mono);
  margin-bottom:2px;
}

/* Toggle Body */
input[type="checkbox"] {
  appearance: none;
  display: inline-block;
  background-color: var(--light-bg);
  border: 1px solid var(--light-bg);
  border-radius: 9px;
  cursor: pointer;
  height: 18px;
  position: relative;
  transition: border .25s .15s, box-shadow .25s .3s, padding .25s;
  min-width: 36px;
  width: 36px;
  vertical-align: top;
}
/* Toggle Thumb */
input[type="checkbox"]:after {
  position: absolute;
  background-color: var(--bg);
  border: 1px solid var(--light-bg);
  border-radius: 8px;
  content: '';
  top: 0px;
  left: 0px;
  right: 16px;
  display: block;
  height: 16px;
  transition: border .25s .15s, left .25s .1s, right .15s .175s;
}

/* Toggle Body - Checked */
input[type="checkbox"]:checked {
  background-color: var(--green);
  border-color: var(--green);
}
/* Toggle Thumb - Checked*/
input[type="checkbox"]:checked:after {
  border: 1px solid var(--green);
  left: 16px;
  right: 1px;
  transition: border .25s, left .15s .25s, right .25s .175s;
}`,Je=c`
  .flex,
  .row,
  .col,
  .row-api {
    display: flex;
  }
  .row-api {
    flex: 1fr 1fr;
    align-items: center;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-evenly;
  }
  .row {
    align-items: center;
  }
  .col {
    align-items: stretch;
    flex-direction: column;
  }
  .row-api-left {
    min-width: 288px;
    max-width: 720px;
    flex: 2 1 0%;
    justify-content: flex-end;
    padding-right: 32px;
  }
  .row-api-right {
    min-width: 0;
    max-width: 702px;
    flex: 1;
    justify-content: flex-start;
    border-left: 1px solid #E7E9EE;
  }
  .row-api-right-box{
    text-align:left; 
    direction:ltr; 
    margin-block: 32px 24px; 
    padding-left: 32px;
  }

  @media (max-width: 1280px) {
    .row-api {
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
    }
    .row-api-right-box{
      padding-left: 0px;
    }

    .row-api-left,
    .row-api-right {
      max-width: unset;
      width: 100%;
      border: none;
      padding: 10px;
    }
  }
`,Ze=c`
.m-table {
  border-spacing: 0;  
  border-collapse: separate;
  border: 1px solid var(--light-border-color);
  border-radius: var(--border-radius);
  margin: 0;
  max-width: 100%;
  direction: ltr;
}
.m-table tr:first-child td,
.m-table tr:first-child th {
    border-top: 0 none;
}
.m-table td, 
.m-table th {
  font-size: var(--font-size-small);
  line-height: calc(var(--font-size-small) + 4px);
  padding: 4px 5px 4px;
  vertical-align: top;
}

.m-table.padded-12 td, 
.m-table.padded-12 th {
  padding: 12px;
}

.m-table td:not([align]), 
.m-table th:not([align]) {
  text-align: left;
}

.m-table th {
  color: var(--fg2);
  font-size: var(--font-size-small);
  line-height: calc(var(--font-size-small) + 18px);
  font-weight: 600;
  letter-spacing: normal;
  background-color: var(--bg2);
  vertical-align: bottom;
  border-bottom: 1px solid var(--light-border-color);
}

.m-table > tbody > tr > td,
.m-table > tr > td {
  border-top: 1px solid var(--light-border-color);
  text-overflow: ellipsis;
  overflow: hidden;
}
.table-title {
  font-size: 16px;
  font-weight: 400;
  line-height: 18px;
}
`,Ye=c`
.only-large-screen { display:none; }
.endpoint-head .path{
  display: flex;
  font-family:var(--font-mono);
  font-size: var(--font-size-small);
  align-items: center;
  overflow-wrap: break-word;
  word-break: break-all;
}

.endpoint-head .descr {
  font-size: var(--font-size-small);
  color:var(--light-fg);
  font-weight:400;
  align-items: center;
  overflow-wrap: break-word;
  word-break: break-all;
  display:none;
}

.m-endpoint.expanded{margin-bottom:16px; }
.m-endpoint > .endpoint-head{
  border-width:1px 1px 1px 5px;
  border-style:solid;
  border-color:transparent;
  border-top-color:var(--light-border-color);
  display:flex;
  padding:6px 16px;
  align-items: center;
  cursor: pointer;
}
.m-endpoint > .endpoint-head.put:hover,
.m-endpoint > .endpoint-head.put.expanded{
  color:var(--put-color); 
  background-color:var(--put-bg-color);
  border-color:var(--put-border-color);
}
.m-endpoint > .endpoint-head.post:hover,
.m-endpoint > .endpoint-head.post.expanded {
  color:var(--post-color);
  background-color:var(--post-bg-color);
  border-color:var(--post-border-color);
}
.m-endpoint > .endpoint-head.get:hover,
.m-endpoint > .endpoint-head.get.expanded {
  color:var(--get-color); 
  background-color:var(--get-bg-color);
  border-color:var(--get-border-color);
}
.m-endpoint > .endpoint-head.delete:hover,
.m-endpoint > .endpoint-head.delete.expanded {
  color:var(--delete-color); 
  background-color:var(--delete-bg-color);
  border-color:var(--delete-border-color);
}

.m-endpoint > .endpoint-head.head:hover,
.m-endpoint > .endpoint-head.head.expanded,
.m-endpoint > .endpoint-head.patch:hover,
.m-endpoint > .endpoint-head.patch.expanded,
.m-endpoint > .endpoint-head.options:hover,
.m-endpoint > .endpoint-head.options.expanded {
  border-color:var(--yellow); 
  background-color:var(--light-yellow); 
}

.m-endpoint > .endpoint-head.deprecated:hover,
.m-endpoint > .endpoint-head.deprecated.expanded {
  border-color:var(--border-color); 
  filter:opacity(0.6);
}

.m-endpoint .endpoint-body {
  flex-wrap:wrap;
  padding:16px 0px 0 0px;
}
.m-endpoint .endpoint-body.delete{ border-color:var(--delete-border-color); }
.m-endpoint .endpoint-body.put{ border-color:var(--put-border-color); }
.m-endpoint .endpoint-body.post{ border-color:var(--post-border-color); }
.m-endpoint .endpoint-body.get{ border-color:var(--get-border-color); }
.m-endpoint .endpoint-body.head,
.m-endpoint .endpoint-body.patch,
.m-endpoint .endpoint-body.options { 
  border-color:var(--yellow); 
}

.m-endpoint .endpoint-body.deprecated{ 
  border-color:var(--border-color);
  filter:opacity(0.6);
}

.endpoint-head .deprecated{
  color: var(--light-fg);
  filter:opacity(0.6);
}

.summary{
  padding: 24px 16px;
}
.summary .title{
  font-size: 28px;
  margin-bottom: 24px;
  word-break: break-all;
}

.path-description p {
    font-size: 18px;
    line-height: 24px;
    margin: 0;
}

.endpoint-head .method{
  padding:2px 5px;
  vertical-align: middle;
  font-size:var(--font-size-small);
  height: calc(var(--font-size-small) + 16px);
  line-height: calc(var(--font-size-small) + 8px);
  width: 60px;
  border-radius: 2px;
  display:inline-block;
  text-align: center;
  font-weight: bold;
  text-transform:uppercase;
  margin-right:5px;
}
.endpoint-head .method.delete{ border: 2px solid var(--delete-border-color);}
.endpoint-head .method.put{ border: 2px solid var(--put-border-color); }
.endpoint-head .method.post{ border: 2px solid var(--post-border-color); }
.endpoint-head .method.get{ border: 2px solid var(--get-border-color); }
.endpoint-head .method.get.deprecated{ border: 2px solid var(--border-color); }
.endpoint-head .method.head,
.endpoint-head .method.patch,
.endpoint-head .method.options { 
  border: 2px solid var(--yellow); 
}

.req-resp-container {
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  flex-direction: column;
  border-top:1px solid var(--light-border-color);
}

.view-mode-request,
api-response.view-mode {
  flex:1; 
  min-height:100px;
  padding: 0 16px 24px 16px;
  overflow:hidden;
}
.view-mode-request {
  border-width: 0;
  border-style:dashed;
}

.head .view-mode-request,
.patch .view-mode-request,
.options .view-mode-request { 
  border-color:var(--yellow); 
}
.put .view-mode-request { 
  border-color:var(--put-color); 
}
.post .view-mode-request { 
  border-color:var(--post-color); 
}
.get .view-mode-request { 
  border-color:var(--get-color); 
}
.delete .view-mode-request { 
  border-color:var(--delete-color); 
}

blockquote {
  padding: 20px;
}

blockquote h3 {
  margin: 0;
  padding: 0;
}

blockquote.warning {
  border-left: 3px solid #f0ad4e;
  background-color: #fcf8f2;
}

blockquote.warning h3 {
  color: #f0ad4e;
}

blockquote.danger {
  border-left: 3px solid #d9534f;
  background-color: #fdf7f7;
}

blockquote.danger h3 {
  color: #d9534f;
}

blockquote.info {
  border-left: 3px solid #5bc0de;
  background-color: #e3edf2;
}

blockquote.info h3 {
  color: #5bc0de;
}

blockquote.success {
  border-left: 3px solid #50af51;
  background-color: #f3f8f3;
}

blockquote.success h3 {
  color: #50af51;
}

pre {
  overflow: scroll;
  max-height: 1000px;
  margin-top: 15px!important;
  margin-bottom: 15px!important;
}

table {
  border-spacing: 0px;
  border-collapse: collapse;
}

table th {
  border: 1px solid #dfe2e5;
  padding: 6px 13px;
}

table td {
  border: 1px solid #dfe2e5;
  padding: 6px 13px;
}

@media only screen and (min-width: 1024px) {
  .only-large-screen { display:block; }
  .endpoint-head .path{
    font-size: var(--font-size-regular);
  }
  .endpoint-head .descr{
    display: flex;
  }
  .endpoint-head .m-markdown-small,
  .descr .m-markdown-small{
    display:block;
  }
  .req-resp-container{
    flex-direction: var(--layout, row);
    flex-wrap: nowrap;
  }
  api-response.view-mode {
    padding:16px;
  }
  .view-mode-request.row-layout {
    border-width:0 1px 0 0;
    padding:16px;
  }
  .summary{
    padding:24px 16px;
  }
}
`,Qe=c`
code[class*="language-"],
pre[class*="language-"] {
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  word-wrap: normal;
  line-height: 1.5;
  tab-size: 2;

  -webkit-hyphens: none;
  -moz-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;
}

/* Code blocks */
pre[class*="language-"] {
  padding: 1em;
  margin: .5em 0;
  overflow: auto;
}

/* Inline code */
:not(pre) > code[class*="language-"] {
  white-space: normal;
}

.token.comment,
.token.block-comment,
.token.prolog,
.token.doctype,
.token.cdata {
  color: var(--light-fg)
}

.token.punctuation {
  color: var(--fg);
}

.token.tag,
.token.attr-name,
.token.namespace,
.token.deleted {
  color:var(--pink);
}

.token.function-name {
  color: var(--rebel-pink);
}

.token.boolean,
.token.number{
  color: var(--red);
}

.token.function {
  color: #2953B2;
}

.token.property,
.token.class-name,
.token.constant,
.token.symbol {
  color: var(--code-property-color);
}

.token.selector,
.token.important,
.token.atrule,
.token.keyword,
.token.builtin {
  color: var(--code-keyword-color);
}

.token.string,
.token.char,
.token.attr-value,
.token.regex,
.token.variable { 
  color: var(--green);
}

.token.operator,
.token.entity,
.token.url {
  color: var(--code-operator-color);
}

.token.important,
.token.bold {
  font-weight: bold;
}
.token.italic {
  font-style: italic;
}

.token.entity {
  cursor: help;
}

.token.inserted {
  color: green;
}
`,Xe=c`
.tab-panel {
  border: none;
}
.tab-buttons {
  height:30px;
  padding: 4px 4px 0 4px;
  border-bottom: 1px solid var(--light-border-color) ;
  align-items: stretch;
  overflow-y: hidden;
  overflow-x: auto;
  scrollbar-width: thin;
}
.tab-buttons::-webkit-scrollbar {
  height: 1px;
  background-color: var(--border-color);
}
.tab-btn {
  border: none;
  border-bottom: 1px solid transparent; 
  color: var(--light-fg);
  background-color: transparent;
  white-space: nowrap;
  cursor:pointer;
  outline:none;
  font-family:var(--font-regular); 
  width:100%;
  font-weight: bold;
  font-size: 16px;
}
.tab-btn.active {
  border-bottom: 1px solid #D71D55; 
  font-weight:bold;
  color:#D71D55;
}

.tab-btn:hover {
  color:#c81e51;
}
.tab-content {
  margin:16px 0 0 0;
  position:relative;
  min-height: 50px;
}
`,et=c`
.nav-bar-info:focus-visible,
.nav-bar-tag:focus-visible,
.nav-bar-path:focus-visible {
  outline: 1px solid;
  box-shadow: none;
  outline-offset: -4px;
}
.nav-bar-expand-all:focus-visible,
.nav-bar-collapse-all:focus-visible,
.nav-bar-tag-icon:focus-visible {
  outline: 1px solid;
  box-shadow: none;
  outline-offset: 2px;
}
.nav-bar {
  width:0;
  height:100%;
  overflow: hidden;
  color:var(--nav-text-color);
  background-color: var(--nav-bg-color);
  background-blend-mode: multiply;
  line-height: calc(var(--font-size-small) + 4px);
  display:none;
  position:relative;
  flex-direction:column;
  flex-wrap:nowrap;
  word-break:break-word;
}
::slotted([slot=nav-logo]){
  padding:16px 16px 0 16px;
}
.nav-scroll {
  overflow-x: hidden;
  overflow-y: auto;
  overflow-y: overlay;
  scrollbar-width: thin;
  scrollbar-color: var(--nav-hover-bg-color) transparent;
}

.nav-bar-tag {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
}
.nav-bar.read .nav-bar-tag-icon {
  display:none;
}
.nav-bar-paths-under-tag {
  overflow:hidden;
  transition: max-height .2s ease-out, visibility .3s;
}
.collapsed .nav-bar-paths-under-tag {
  visibility: hidden;
}

.nav-bar-expand-all {
  transform: rotate(90deg); 
  cursor:pointer; 
  margin-right:10px;
}
.nav-bar-collapse-all {
  transform: rotate(270deg); 
  cursor:pointer;
}
.nav-bar-expand-all:hover, .nav-bar-collapse-all:hover {
  color: var(--primary-color);
}

.nav-bar-tag-icon {
  color: var(--nav-text-color);
  font-size: 20px; 
}
.nav-bar-tag-icon:hover {
  color:var(--nav-hover-text-color);
}
.nav-bar.focused .nav-bar-tag-and-paths.collapsed .nav-bar-tag-icon::after {
  content: '⌵';
  width:16px;
  height:16px;
  text-align: center;
  display: inline-block;
  transform: rotate(-90deg);
  transition: transform 0.2s ease-out 0s;
}
.nav-bar.focused .nav-bar-tag-and-paths.expanded .nav-bar-tag-icon::after {
  content: '⌵';
  width:16px;
  height:16px;
  text-align: center;
  display: inline-block;
  transition: transform 0.2s ease-out 0s;
}
.nav-scroll::-webkit-scrollbar {
  width: var(--scroll-bar-width, 8px);
}
.nav-scroll::-webkit-scrollbar-track {
  background:transparent;
}
.nav-scroll::-webkit-scrollbar-thumb {
  background-color: var(--nav-hover-bg-color);
}

.nav-bar-tag {
  font-size: var(--font-size-regular);
  color: var(--nav-accent-color);
  border-left:4px solid transparent;
  font-weight:bold;
  padding: 15px 15px 15px 10px;
  text-transform: capitalize;
}

.nav-bar-components,
.nav-bar-h1,
.nav-bar-h2,
.nav-bar-info,
.nav-bar-tag,
.nav-bar-path {
  display:flex;
  cursor: pointer;
  width: 100%;
  border: none;
  border-radius:4px; 
  color: var(--nav-text-color);
  background: transparent;
  border-left:4px solid transparent;
}

.nav-bar-h1,
.nav-bar-h2,
.nav-bar-path {
  font-size: calc(var(--font-size-small) + 1px);
  padding: var(--nav-item-padding);
}
.nav-bar-path.small-font {
  font-size: var(--font-size-small);
}

.nav-bar-info {
  font-size: var(--font-size-regular);
  padding: 16px 10px;
  font-weight:bold;
}
.nav-bar-section {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: var(--font-size-small);
  color: var(--nav-text-color);
  padding: var(--nav-item-padding);
  font-weight:bold;
}
.nav-bar-section.operations {
  cursor:pointer;
}
.nav-bar-section.operations:hover {
  color:var(--nav-hover-text-color);
  background-color:var(--nav-hover-bg-color);
}

.nav-bar-section:first-child {
  display: none;
}
.nav-bar-h2 {margin-left:12px;}

.nav-bar-h1.left-bar.active,
.nav-bar-h2.left-bar.active,
.nav-bar-info.left-bar.active,
.nav-bar-tag.left-bar.active,
.nav-bar-path.left-bar.active,
.nav-bar-section.left-bar.operations.active {
  border-left:4px solid var(--nav-accent-color);
  color:var(--nav-hover-text-color);
}

.nav-bar-h1.colored-block.active,
.nav-bar-h2.colored-block.active,
.nav-bar-info.colored-block.active,
.nav-bar-tag.colored-block.active,
.nav-bar-path.colored-block.active,
.nav-bar-section.colored-block.operations.active {
  background-color: var(--nav-accent-color);
  color: var(--nav-accent-text-color);
  border-radius: 0;
}

.nav-bar-h1:hover,
.nav-bar-h2:hover,
.nav-bar-info:hover,
.nav-bar-tag:hover,
.nav-bar-path:hover {
  color:var(--nav-hover-text-color);
  background-color:var(--nav-hover-bg-color);
}
`,tt=c`
#api-info {
  font-size: calc(var(--font-size-regular) - 1px);
  margin-top: 8px;
  margin-left: -15px;
}

#api-info span:before {
  content: "|";
  display: inline-block;
  opacity: 0.5;
  width: 15px;
  text-align: center;
}
#api-info span:first-child:before {
  content: "";
  width: 0px;
}
`,rt=c`
.test-method-button {
  background: #142032;
  padding: 6px 16px;
  color: #FFFFFF;
  font-size: 14px;
  line-height: 20px;
  border-radius: 4px;
  margin-top: 32px;
  font-family: var(--font-medium);
  cursor: pointer;
}

.code-container {
  padding-inline: 32px;
  padding-top: 16px;
}
.code-container > code {
  font-size: 12px;
  line-height: 20px;
}

.request-card {
  border: 1px solid #CCCED8;
  border-radius: 4px;
  padding-block: 24px;
  margin-top: 24px;
}

.request-title-container {
  margin-left: 16px;
}

.request-title {
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: 400;
  line-height: 18px;
  color: #4A4A4A;
}

.label-operation-container {
  text-align: left;
  direction: ltr;
  padding: 8px 0;
  color: var(--fg3);
  display: flex;
  width: 100%;
  overflow: hidden;
}

.label-operation-path-container {
  display: inline-flex;
  flex-direction: row;
  flex-grow: 1;
  justify-content: space-between;
  align-items: stretch;
  width: auto;
  height: 28px;
  left: 0;
  top: 0;
  border: 1px solid var(--border-color);
  border-radius: 0px 4px 4px 0px;
  margin: 4px 0px;
  flex-wrap: nowrap;
  overflow-x: auto;
  position: relative;
  scrollbar-color: transparent transparent;
}

.label-operation-path-container::-webkit-scrollbar {
  display: none;
}

.label-operation-path-item {
  flex: 0 0 auto;
}

.label-operation-method-container {
  display: inline-flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  width: auto;
  height: 28px;
  left: 0;
  top: 0;
  border-width: 1px 0px 1px 1px;
  border-style: solid;
  border-radius: 4px 0px 0px 4px;
  margin: 4px 0px;
  text-transform: uppercase;
}

.right-box-title {
  color: #4A4A4A;
  font-size: 18px;
  line-height: 20px;
  font-weight: 400;
}

.right-box-container {
  margin-top: 16px;
}

.right-box-label {
  color: var(--fg2);
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 400;
}

.right-box-input {
  width: 100%;
  height: 44px;
}

.server-template {
  position: relative;
}

.server-template-vars {
  position: absolute;
  top: calc(100% + 2px);
  
  background-color: var(--bg);

  border: 1px solid rgb(204, 206, 216);
  border-radius: 4px;
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.1);
  
  z-index: 1;

  max-height: 300px;
  max-width: 100%;
}

.server-vars {
  padding: 10px 10px 0px 10px;
  overflow-x: hidden;
  overflow-y: auto;
}
`;const nt=/[\s#:?&={}]/g,ot="_rapidoc_api_key";function at(e){return new Promise((t=>setTimeout(t,e)))}function it(e,t){const r=t.target,n=document.createElement("textarea");n.value=e,n.style.position="fixed",document.body.appendChild(n),n.focus(),n.select();try{document.execCommand("copy"),r.innerText="Copied",setTimeout((()=>{r.innerText="Copy"}),5e3)}catch(e){console.error("Unable to copy",e)}document.body.removeChild(n)}function st(e,t,r="includes"){if("includes"===r){return`${t.method} ${t.path} ${t.summary||t.description||""} ${t.operationId||""}`.toLowerCase().includes(e.toLowerCase())}return new RegExp(`^${e}$`,"i").test(`${t.method} ${t.path}`)}function lt(e,t=new Set){return e?(Object.keys(e).forEach((r=>{var n;if(t.add(r),e[r].properties)lt(e[r].properties,t);else if(null!==(n=e[r].items)&&void 0!==n&&n.properties){var o;lt(null===(o=e[r].items)||void 0===o?void 0:o.properties,t)}})),t):t}function ct(e,t){if(e){const r=document.createElement("a");document.body.appendChild(r),r.style="display: none",r.href=e,r.download=t,r.click(),r.remove()}}function pt(e){if(e){const t=document.createElement("a");document.body.appendChild(t),t.style="display: none",t.href=e,t.target="_blank",t.click(),t.remove()}}function dt(e){return e&&e.t&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var ut=function(e){return e&&e.Math==Math&&e},ht=ut("object"==typeof globalThis&&globalThis)||ut("object"==typeof window&&window)||ut("object"==typeof self&&self)||ut("object"==typeof ht&&ht)||function(){return this}()||Function("return this")(),ft=function(e){try{return!!e()}catch(e){return!0}},mt=!ft((function(){var e=function(){}.bind();return"function"!=typeof e||e.hasOwnProperty("prototype")})),gt=mt,yt=Function.prototype,vt=yt.apply,bt=yt.call,xt="object"==typeof Reflect&&Reflect.apply||(gt?bt.bind(vt):function(){return bt.apply(vt,arguments)}),wt=mt,kt=Function.prototype,$t=kt.bind,St=kt.call,At=wt&&$t.bind(St,St),Et=wt?function(e){return e&&At(e)}:function(e){return e&&function(){return St.apply(e,arguments)}},Ot=function(e){return"function"==typeof e},Ct={},Tt=!ft((function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]})),jt=mt,It=Function.prototype.call,Pt=jt?It.bind(It):function(){return It.apply(It,arguments)},_t={},Rt={}.propertyIsEnumerable,Lt=Object.getOwnPropertyDescriptor,Bt=Lt&&!Rt.call({1:2},1);_t.f=Bt?function(e){var t=Lt(this,e);return!!t&&t.enumerable}:Rt;var Ft,Dt,zt=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}},qt=Et,Nt=qt({}.toString),Ut=qt("".slice),Mt=function(e){return Ut(Nt(e),8,-1)},Ht=Et,Wt=ft,Vt=Mt,Gt=ht.Object,Kt=Ht("".split),Jt=Wt((function(){return!Gt("z").propertyIsEnumerable(0)}))?function(e){return"String"==Vt(e)?Kt(e,""):Gt(e)}:Gt,Zt=ht.TypeError,Yt=function(e){if(null==e)throw Zt("Can't call method on "+e);return e},Qt=Jt,Xt=Yt,er=function(e){return Qt(Xt(e))},tr=Ot,rr=function(e){return"object"==typeof e?null!==e:tr(e)},nr={},or=nr,ar=ht,ir=Ot,sr=function(e){return ir(e)?e:void 0},lr=function(e,t){return arguments.length<2?sr(or[e])||sr(ar[e]):or[e]&&or[e][t]||ar[e]&&ar[e][t]},cr=Et({}.isPrototypeOf),pr=lr("navigator","userAgent")||"",dr=ht,ur=pr,hr=dr.process,fr=dr.Deno,mr=hr&&hr.versions||fr&&fr.version,gr=mr&&mr.v8;gr&&(Dt=(Ft=gr.split("."))[0]>0&&Ft[0]<4?1:+(Ft[0]+Ft[1])),!Dt&&ur&&(!(Ft=ur.match(/Edge\/(\d+)/))||Ft[1]>=74)&&(Ft=ur.match(/Chrome\/(\d+)/))&&(Dt=+Ft[1]);var yr=Dt,vr=yr,br=ft,xr=!!Object.getOwnPropertySymbols&&!br((function(){var e=Symbol();return!String(e)||!(Object(e)instanceof Symbol)||!Symbol.sham&&vr&&vr<41})),wr=xr&&!Symbol.sham&&"symbol"==typeof Symbol.iterator,kr=lr,$r=Ot,Sr=cr,Ar=wr,Er=ht.Object,Or=Ar?function(e){return"symbol"==typeof e}:function(e){var t=kr("Symbol");return $r(t)&&Sr(t.prototype,Er(e))},Cr=ht.String,Tr=function(e){try{return Cr(e)}catch(e){return"Object"}},jr=Ot,Ir=Tr,Pr=ht.TypeError,_r=function(e){if(jr(e))return e;throw Pr(Ir(e)+" is not a function")},Rr=_r,Lr=function(e,t){var r=e[t];return null==r?void 0:Rr(r)},Br=Pt,Fr=Ot,Dr=rr,zr=ht.TypeError,qr={exports:{}},Nr=ht,Ur=Object.defineProperty,Mr=ht.i||function(e,t){try{Ur(Nr,e,{value:t,configurable:!0,writable:!0})}catch(r){Nr[e]=t}return t}("__core-js_shared__",{}),Hr=Mr;(qr.exports=function(e,t){return Hr[e]||(Hr[e]=void 0!==t?t:{})})("versions",[]).push({version:"3.21.1",mode:"pure",copyright:"© 2014-2022 Denis Pushkarev (zloirock.ru)",license:"https://github.com/zloirock/core-js/blob/v3.21.1/LICENSE",source:"https://github.com/zloirock/core-js"});var Wr=Yt,Vr=ht.Object,Gr=function(e){return Vr(Wr(e))},Kr=Gr,Jr=Et({}.hasOwnProperty),Zr=Object.hasOwn||function(e,t){return Jr(Kr(e),t)},Yr=Et,Qr=0,Xr=Math.random(),en=Yr(1..toString),tn=function(e){return"Symbol("+(void 0===e?"":e)+")_"+en(++Qr+Xr,36)},rn=ht,nn=qr.exports,on=Zr,an=tn,sn=xr,ln=wr,cn=nn("wks"),pn=rn.Symbol,dn=pn&&pn.for,un=ln?pn:pn&&pn.withoutSetter||an,hn=function(e){if(!on(cn,e)||!sn&&"string"!=typeof cn[e]){var t="Symbol."+e;sn&&on(pn,e)?cn[e]=pn[e]:cn[e]=ln&&dn?dn(t):un(t)}return cn[e]},fn=Pt,mn=rr,gn=Or,yn=Lr,vn=hn,bn=ht.TypeError,xn=vn("toPrimitive"),wn=function(e,t){if(!mn(e)||gn(e))return e;var r,n=yn(e,xn);if(n){if(void 0===t&&(t="default"),r=fn(n,e,t),!mn(r)||gn(r))return r;throw bn("Can't convert object to primitive value")}return void 0===t&&(t="number"),function(e,t){var r,n;if("string"===t&&Fr(r=e.toString)&&!Dr(n=Br(r,e)))return n;if(Fr(r=e.valueOf)&&!Dr(n=Br(r,e)))return n;if("string"!==t&&Fr(r=e.toString)&&!Dr(n=Br(r,e)))return n;throw zr("Can't convert object to primitive value")}(e,t)},kn=Or,$n=function(e){var t=wn(e,"string");return kn(t)?t:t+""},Sn=rr,An=ht.document,En=Sn(An)&&Sn(An.createElement),On=function(e){return En?An.createElement(e):{}},Cn=On,Tn=!Tt&&!ft((function(){return 7!=Object.defineProperty(Cn("div"),"a",{get:function(){return 7}}).a})),jn=Tt,In=Pt,Pn=_t,_n=zt,Rn=er,Ln=$n,Bn=Zr,Fn=Tn,Dn=Object.getOwnPropertyDescriptor;Ct.f=jn?Dn:function(e,t){if(e=Rn(e),t=Ln(t),Fn)try{return Dn(e,t)}catch(e){}if(Bn(e,t))return _n(!In(Pn.f,e,t),e[t])};var zn=ft,qn=Ot,Nn=/#|\.prototype\./,Un=function(e,t){var r=Hn[Mn(e)];return r==Vn||r!=Wn&&(qn(t)?zn(t):!!t)},Mn=Un.normalize=function(e){return String(e).replace(Nn,".").toLowerCase()},Hn=Un.data={},Wn=Un.NATIVE="N",Vn=Un.POLYFILL="P",Gn=Un,Kn=_r,Jn=mt,Zn=Et(Et.bind),Yn=function(e,t){return Kn(e),void 0===t?e:Jn?Zn(e,t):function(){return e.apply(t,arguments)}},Qn={},Xn=Tt&&ft((function(){return 42!=Object.defineProperty((function(){}),"prototype",{value:42,writable:!1}).prototype})),eo=ht,to=rr,ro=eo.String,no=eo.TypeError,oo=function(e){if(to(e))return e;throw no(ro(e)+" is not an object")},ao=Tt,io=Tn,so=Xn,lo=oo,co=$n,po=ht.TypeError,uo=Object.defineProperty,ho=Object.getOwnPropertyDescriptor;Qn.f=ao?so?function(e,t,r){if(lo(e),t=co(t),lo(r),"function"==typeof e&&"prototype"===t&&"value"in r&&"writable"in r&&!r.writable){var n=ho(e,t);n&&n.writable&&(e[t]=r.value,r={configurable:"configurable"in r?r.configurable:n.configurable,enumerable:"enumerable"in r?r.enumerable:n.enumerable,writable:!1})}return uo(e,t,r)}:uo:function(e,t,r){if(lo(e),t=co(t),lo(r),io)try{return uo(e,t,r)}catch(e){}if("get"in r||"set"in r)throw po("Accessors not supported");return"value"in r&&(e[t]=r.value),e};var fo=Qn,mo=zt,go=Tt?function(e,t,r){return fo.f(e,t,mo(1,r))}:function(e,t,r){return e[t]=r,e},yo=ht,vo=xt,bo=Et,xo=Ot,wo=Ct.f,ko=Gn,$o=nr,So=Yn,Ao=go,Eo=Zr,Oo=function(e){var t=function(r,n,o){if(this instanceof t){switch(arguments.length){case 0:return new e;case 1:return new e(r);case 2:return new e(r,n)}return new e(r,n,o)}return vo(e,this,arguments)};return t.prototype=e.prototype,t},Co=function(e,t){var r,n,o,a,i,s,l,c,p=e.target,d=e.global,u=e.stat,h=e.proto,f=d?yo:u?yo[p]:(yo[p]||{}).prototype,m=d?$o:$o[p]||Ao($o,p,{})[p],g=m.prototype;for(o in t)r=!ko(d?o:p+(u?".":"#")+o,e.forced)&&f&&Eo(f,o),i=m[o],r&&(s=e.noTargetGet?(c=wo(f,o))&&c.value:f[o]),a=r&&s?s:t[o],r&&typeof i==typeof a||(l=e.bind&&r?So(a,yo):e.wrap&&r?Oo(a):h&&xo(a)?bo(a):a,(e.sham||a&&a.sham||i&&i.sham)&&Ao(l,"sham",!0),Ao(m,o,l),h&&(Eo($o,n=p+"Prototype")||Ao($o,n,{}),Ao($o[n],o,a),e.real&&g&&!g[o]&&Ao(g,o,a)))},To=Math.ceil,jo=Math.floor,Io=function(e){var t=+e;return t!=t||0===t?0:(t>0?jo:To)(t)},Po=Io,_o=Math.max,Ro=Math.min,Lo=function(e,t){var r=Po(e);return r<0?_o(r+t,0):Ro(r,t)},Bo=Io,Fo=Math.min,Do=function(e){return e>0?Fo(Bo(e),9007199254740991):0},zo=Do,qo=function(e){return zo(e.length)},No=er,Uo=Lo,Mo=qo,Ho=function(e){return function(t,r,n){var o,a=No(t),i=Mo(a),s=Uo(n,i);if(e&&r!=r){for(;i>s;)if((o=a[s++])!=o)return!0}else for(;i>s;s++)if((e||s in a)&&a[s]===r)return e||s||0;return!e&&-1}},Wo={includes:Ho(!0),indexOf:Ho(!1)},Vo={},Go=Zr,Ko=er,Jo=Wo.indexOf,Zo=Vo,Yo=Et([].push),Qo=function(e,t){var r,n=Ko(e),o=0,a=[];for(r in n)!Go(Zo,r)&&Go(n,r)&&Yo(a,r);for(;t.length>o;)Go(n,r=t[o++])&&(~Jo(a,r)||Yo(a,r));return a},Xo=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"],ea=Qo,ta=Xo,ra=Object.keys||function(e){return ea(e,ta)},na=Gr,oa=ra;Co({target:"Object",stat:!0,forced:ft((function(){oa(1)}))},{keys:function(e){return oa(na(e))}});var aa=nr.Object.keys;const ia=dt({exports:{}}.exports=aa);var sa=Mt,la=Array.isArray||function(e){return"Array"==sa(e)},ca={};ca[hn("toStringTag")]="z";var pa="[object z]"===String(ca),da=ht,ua=pa,ha=Ot,fa=Mt,ma=hn("toStringTag"),ga=da.Object,ya="Arguments"==fa(function(){return arguments}()),va=ua?fa:function(e){var t,r,n;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(r=function(e,t){try{return e[t]}catch(e){}}(t=ga(e),ma))?r:ya?fa(t):"Object"==(n=fa(t))&&ha(t.callee)?"Arguments":n},ba=va,xa=ht.String,wa=function(e){if("Symbol"===ba(e))throw TypeError("Cannot convert a Symbol value to a string");return xa(e)},ka={},$a=Tt,Sa=Xn,Aa=Qn,Ea=oo,Oa=er,Ca=ra;ka.f=$a&&!Sa?Object.defineProperties:function(e,t){Ea(e);for(var r,n=Oa(t),o=Ca(t),a=o.length,i=0;a>i;)Aa.f(e,r=o[i++],n[r]);return e};var Ta,ja=lr("document","documentElement"),Ia=qr.exports,Pa=tn,_a=Ia("keys"),Ra=function(e){return _a[e]||(_a[e]=Pa(e))},La=oo,Ba=ka,Fa=Xo,Da=Vo,za=ja,qa=On,Na=Ra("IE_PROTO"),Ua=function(){},Ma=function(e){return"<script>"+e+"<\/script>"},Ha=function(e){e.write(Ma("")),e.close();var t=e.parentWindow.Object;return e=null,t},Wa=function(){try{Ta=new ActiveXObject("htmlfile")}catch(e){}var e,t;Wa="undefined"!=typeof document?document.domain&&Ta?Ha(Ta):((t=qa("iframe")).style.display="none",za.appendChild(t),t.src=String("javascript:"),(e=t.contentWindow.document).open(),e.write(Ma("document.F=Object")),e.close(),e.F):Ha(Ta);for(var r=Fa.length;r--;)delete Wa.prototype[Fa[r]];return Wa()};Da[Na]=!0;var Va=Object.create||function(e,t){var r;return null!==e?(Ua.prototype=La(e),r=new Ua,Ua.prototype=null,r[Na]=e):r=Wa(),void 0===t?r:Ba.f(r,t)},Ga={},Ka=Qo,Ja=Xo.concat("length","prototype");Ga.f=Object.getOwnPropertyNames||function(e){return Ka(e,Ja)};var Za={},Ya=$n,Qa=Qn,Xa=zt,ei=function(e,t,r){var n=Ya(t);n in e?Qa.f(e,n,Xa(0,r)):e[n]=r},ti=Lo,ri=qo,ni=ei,oi=ht.Array,ai=Math.max,ii=function(e,t,r){for(var n=ri(e),o=ti(t,n),a=ti(void 0===r?n:r,n),i=oi(ai(a-o,0)),s=0;o<a;o++,s++)ni(i,s,e[o]);return i.length=s,i},si=Mt,li=er,ci=Ga.f,pi=ii,di="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[];Za.f=function(e){return di&&"Window"==si(e)?function(e){try{return ci(e)}catch(e){return pi(di)}}(e):ci(li(e))};var ui={};ui.f=Object.getOwnPropertySymbols;var hi=Et([].slice),fi=go,mi=function(e,t,r,n){n&&n.enumerable?e[t]=r:fi(e,t,r)},gi={},yi=hn;gi.f=yi;var vi=nr,bi=Zr,xi=gi,wi=Qn.f,ki=function(e){var t=vi.Symbol||(vi.Symbol={});bi(t,e)||wi(t,e,{value:xi.f(e)})},$i=va,Si=pa?{}.toString:function(){return"[object "+$i(this)+"]"},Ai=pa,Ei=Qn.f,Oi=go,Ci=Zr,Ti=Si,ji=hn("toStringTag"),Ii=function(e,t,r,n){if(e){var o=r?e:e.prototype;Ci(o,ji)||Ei(o,ji,{configurable:!0,value:t}),n&&!Ai&&Oi(o,"toString",Ti)}},Pi=Ot,_i=Mr,Ri=Et(Function.toString);Pi(_i.inspectSource)||(_i.inspectSource=function(e){return Ri(e)});var Li,Bi,Fi,Di=_i.inspectSource,zi=Ot,qi=Di,Ni=ht.WeakMap,Ui=zi(Ni)&&/native code/.test(qi(Ni)),Mi=Ui,Hi=ht,Wi=Et,Vi=rr,Gi=go,Ki=Zr,Ji=Mr,Zi=Ra,Yi=Vo,Qi=Hi.TypeError,Xi=Hi.WeakMap;if(Mi||Ji.state){var es=Ji.state||(Ji.state=new Xi),ts=Wi(es.get),rs=Wi(es.has),ns=Wi(es.set);Li=function(e,t){if(rs(es,e))throw new Qi("Object already initialized");return t.facade=e,ns(es,e,t),t},Bi=function(e){return ts(es,e)||{}},Fi=function(e){return rs(es,e)}}else{var os=Zi("state");Yi[os]=!0,Li=function(e,t){if(Ki(e,os))throw new Qi("Object already initialized");return t.facade=e,Gi(e,os,t),t},Bi=function(e){return Ki(e,os)?e[os]:{}},Fi=function(e){return Ki(e,os)}}var as={set:Li,get:Bi,has:Fi,enforce:function(e){return Fi(e)?Bi(e):Li(e,{})},getterFor:function(e){return function(t){var r;if(!Vi(t)||(r=Bi(t)).type!==e)throw Qi("Incompatible receiver, "+e+" required");return r}}},is=Et,ss=ft,ls=Ot,cs=va,ps=Di,ds=function(){},us=[],hs=lr("Reflect","construct"),fs=/^\s*(?:class|function)\b/,ms=is(fs.exec),gs=!fs.exec(ds),ys=function(e){if(!ls(e))return!1;try{return hs(ds,us,e),!0}catch(e){return!1}},vs=function(e){if(!ls(e))return!1;switch(cs(e)){case"AsyncFunction":case"GeneratorFunction":case"AsyncGeneratorFunction":return!1}try{return gs||!!ms(fs,ps(e))}catch(e){return!0}};vs.sham=!0;var bs=!hs||ss((function(){var e;return ys(ys.call)||!ys(Object)||!ys((function(){e=!0}))||e}))?vs:ys,xs=ht,ws=la,ks=bs,$s=rr,Ss=hn("species"),As=xs.Array,Es=function(e,t){return new(function(e){var t;return ws(e)&&(t=e.constructor,(ks(t)&&(t===As||ws(t.prototype))||$s(t)&&null===(t=t[Ss]))&&(t=void 0)),void 0===t?As:t}(e))(0===t?0:t)},Os=Yn,Cs=Jt,Ts=Gr,js=qo,Is=Es,Ps=Et([].push),_s=function(e){var t=1==e,r=2==e,n=3==e,o=4==e,a=6==e,i=7==e,s=5==e||a;return function(l,c,p,d){for(var u,h,f=Ts(l),m=Cs(f),g=Os(c,p),y=js(m),v=0,b=d||Is,x=t?b(l,y):r||i?b(l,0):void 0;y>v;v++)if((s||v in m)&&(h=g(u=m[v],v,f),e))if(t)x[v]=h;else if(h)switch(e){case 3:return!0;case 5:return u;case 6:return v;case 2:Ps(x,u)}else switch(e){case 4:return!1;case 7:Ps(x,u)}return a?-1:n||o?o:x}},Rs={forEach:_s(0),map:_s(1),filter:_s(2),some:_s(3),every:_s(4),find:_s(5),findIndex:_s(6),filterReject:_s(7)},Ls=Co,Bs=ht,Fs=lr,Ds=xt,zs=Pt,qs=Et,Ns=Tt,Us=xr,Ms=ft,Hs=Zr,Ws=la,Vs=Ot,Gs=rr,Ks=cr,Js=Or,Zs=oo,Ys=Gr,Qs=er,Xs=$n,el=wa,tl=zt,rl=Va,nl=ra,ol=Ga,al=Za,il=ui,sl=Ct,ll=Qn,cl=ka,pl=_t,dl=hi,ul=mi,hl=qr.exports,fl=Vo,ml=tn,gl=hn,yl=gi,vl=ki,bl=Ii,xl=as,wl=Rs.forEach,kl=Ra("hidden"),$l=gl("toPrimitive"),Sl=xl.set,Al=xl.getterFor("Symbol"),El=Object.prototype,Ol=Bs.Symbol,Cl=Ol&&Ol.prototype,Tl=Bs.TypeError,jl=Bs.QObject,Il=Fs("JSON","stringify"),Pl=sl.f,_l=ll.f,Rl=al.f,Ll=pl.f,Bl=qs([].push),Fl=hl("symbols"),Dl=hl("op-symbols"),zl=hl("string-to-symbol-registry"),ql=hl("symbol-to-string-registry"),Nl=hl("wks"),Ul=!jl||!jl.prototype||!jl.prototype.findChild,Ml=Ns&&Ms((function(){return 7!=rl(_l({},"a",{get:function(){return _l(this,"a",{value:7}).a}})).a}))?function(e,t,r){var n=Pl(El,t);n&&delete El[t],_l(e,t,r),n&&e!==El&&_l(El,t,n)}:_l,Hl=function(e,t){var r=Fl[e]=rl(Cl);return Sl(r,{type:"Symbol",tag:e,description:t}),Ns||(r.description=t),r},Wl=function(e,t,r){e===El&&Wl(Dl,t,r),Zs(e);var n=Xs(t);return Zs(r),Hs(Fl,n)?(r.enumerable?(Hs(e,kl)&&e[kl][n]&&(e[kl][n]=!1),r=rl(r,{enumerable:tl(0,!1)})):(Hs(e,kl)||_l(e,kl,tl(1,{})),e[kl][n]=!0),Ml(e,n,r)):_l(e,n,r)},Vl=function(e,t){Zs(e);var r=Qs(t),n=nl(r).concat(Zl(r));return wl(n,(function(t){Ns&&!zs(Gl,r,t)||Wl(e,t,r[t])})),e},Gl=function(e){var t=Xs(e),r=zs(Ll,this,t);return!(this===El&&Hs(Fl,t)&&!Hs(Dl,t))&&(!(r||!Hs(this,t)||!Hs(Fl,t)||Hs(this,kl)&&this[kl][t])||r)},Kl=function(e,t){var r=Qs(e),n=Xs(t);if(r!==El||!Hs(Fl,n)||Hs(Dl,n)){var o=Pl(r,n);return!o||!Hs(Fl,n)||Hs(r,kl)&&r[kl][n]||(o.enumerable=!0),o}},Jl=function(e){var t=Rl(Qs(e)),r=[];return wl(t,(function(e){Hs(Fl,e)||Hs(fl,e)||Bl(r,e)})),r},Zl=function(e){var t=e===El,r=Rl(t?Dl:Qs(e)),n=[];return wl(r,(function(e){!Hs(Fl,e)||t&&!Hs(El,e)||Bl(n,Fl[e])})),n};(Us||(ul(Cl=(Ol=function(){if(Ks(Cl,this))throw Tl("Symbol is not a constructor");var e=arguments.length&&void 0!==arguments[0]?el(arguments[0]):void 0,t=ml(e),r=function(e){this===El&&zs(r,Dl,e),Hs(this,kl)&&Hs(this[kl],t)&&(this[kl][t]=!1),Ml(this,t,tl(1,e))};return Ns&&Ul&&Ml(El,t,{configurable:!0,set:r}),Hl(t,e)}).prototype,"toString",(function(){return Al(this).tag})),ul(Ol,"withoutSetter",(function(e){return Hl(ml(e),e)})),pl.f=Gl,ll.f=Wl,cl.f=Vl,sl.f=Kl,ol.f=al.f=Jl,il.f=Zl,yl.f=function(e){return Hl(gl(e),e)},Ns&&_l(Cl,"description",{configurable:!0,get:function(){return Al(this).description}})),Ls({global:!0,wrap:!0,forced:!Us,sham:!Us},{Symbol:Ol}),wl(nl(Nl),(function(e){vl(e)})),Ls({target:"Symbol",stat:!0,forced:!Us},{for:function(e){var t=el(e);if(Hs(zl,t))return zl[t];var r=Ol(t);return zl[t]=r,ql[r]=t,r},keyFor:function(e){if(!Js(e))throw Tl(e+" is not a symbol");if(Hs(ql,e))return ql[e]},useSetter:function(){Ul=!0},useSimple:function(){Ul=!1}}),Ls({target:"Object",stat:!0,forced:!Us,sham:!Ns},{create:function(e,t){return void 0===t?rl(e):Vl(rl(e),t)},defineProperty:Wl,defineProperties:Vl,getOwnPropertyDescriptor:Kl}),Ls({target:"Object",stat:!0,forced:!Us},{getOwnPropertyNames:Jl,getOwnPropertySymbols:Zl}),Ls({target:"Object",stat:!0,forced:Ms((function(){il.f(1)}))},{getOwnPropertySymbols:function(e){return il.f(Ys(e))}}),Il)&&Ls({target:"JSON",stat:!0,forced:!Us||Ms((function(){var e=Ol();return"[null]"!=Il([e])||"{}"!=Il({a:e})||"{}"!=Il(Object(e))}))},{stringify:function(e,t,r){var n=dl(arguments),o=t;if((Gs(t)||void 0!==e)&&!Js(e))return Ws(t)||(t=function(e,t){if(Vs(o)&&(t=zs(o,this,e,t)),!Js(t))return t}),n[1]=t,Ds(Il,null,n)}});if(!Cl[$l]){var Yl=Cl.valueOf;ul(Cl,$l,(function(e){return zs(Yl,this)}))}bl(Ol,"Symbol"),fl[kl]=!0;var Ql=nr.Object.getOwnPropertySymbols;const Xl=dt({exports:{}}.exports=Ql);var ec=ft,tc=yr,rc=hn("species"),nc=function(e){return tc>=51||!ec((function(){var t=[];return(t.constructor={})[rc]=function(){return{foo:1}},1!==t[e](Boolean).foo}))},oc=Rs.filter;Co({target:"Array",proto:!0,forced:!nc("filter")},{filter:function(e){return oc(this,e,arguments.length>1?arguments[1]:void 0)}});var ac=nr,ic=function(e){return ac[e+"Prototype"]},sc=ic("Array").filter,lc=cr,cc=sc,pc=Array.prototype,dc=function(e){var t=e.filter;return e===pc||lc(pc,e)&&t===pc.filter?cc:t};const uc=dt({exports:{}}.exports=dc);var hc={exports:{}},fc=Co,mc=ft,gc=er,yc=Ct.f,vc=Tt,bc=mc((function(){yc(1)}));fc({target:"Object",stat:!0,forced:!vc||bc,sham:!vc},{getOwnPropertyDescriptor:function(e,t){return yc(gc(e),t)}});var xc=nr.Object,wc=hc.exports=function(e,t){return xc.getOwnPropertyDescriptor(e,t)};xc.getOwnPropertyDescriptor.sham&&(wc.sham=!0);var kc=hc.exports;const $c=dt({exports:{}}.exports=kc);var Sc,Ac,Ec,Oc={},Cc=Tt,Tc=Zr,jc=Function.prototype,Ic=Cc&&Object.getOwnPropertyDescriptor,Pc=Tc(jc,"name"),_c={EXISTS:Pc,PROPER:Pc&&"something"===function(){}.name,CONFIGURABLE:Pc&&(!Cc||Cc&&Ic(jc,"name").configurable)},Rc=!ft((function(){function e(){}return e.prototype.constructor=null,Object.getPrototypeOf(new e)!==e.prototype})),Lc=ht,Bc=Zr,Fc=Ot,Dc=Gr,zc=Rc,qc=Ra("IE_PROTO"),Nc=Lc.Object,Uc=Nc.prototype,Mc=zc?Nc.getPrototypeOf:function(e){var t=Dc(e);if(Bc(t,qc))return t[qc];var r=t.constructor;return Fc(r)&&t instanceof r?r.prototype:t instanceof Nc?Uc:null},Hc=ft,Wc=Ot,Vc=Va,Gc=Mc,Kc=mi,Jc=hn("iterator"),Zc=!1;[].keys&&("next"in(Ec=[].keys())?(Ac=Gc(Gc(Ec)))!==Object.prototype&&(Sc=Ac):Zc=!0);var Yc=null==Sc||Hc((function(){var e={};return Sc[Jc].call(e)!==e}));Wc((Sc=Yc?{}:Vc(Sc))[Jc])||Kc(Sc,Jc,(function(){return this}));var Qc={IteratorPrototype:Sc,BUGGY_SAFARI_ITERATORS:Zc},Xc=Qc.IteratorPrototype,ep=Va,tp=zt,rp=Ii,np=Oc,op=function(){return this},ap=function(e,t,r,n){var o=t+" Iterator";return e.prototype=ep(Xc,{next:tp(+!n,r)}),rp(e,o,!1,!0),np[o]=op,e},ip=ht,sp=Ot,lp=ip.String,cp=ip.TypeError,pp=Et,dp=oo,up=Object.setPrototypeOf||("__proto__"in{}?function(){var e,t=!1,r={};try{(e=pp(Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set))(r,[]),t=r instanceof Array}catch(e){}return function(r,n){return dp(r),function(e){if("object"==typeof e||sp(e))return e;throw cp("Can't set "+lp(e)+" as a prototype")}(n),t?e(r,n):r.__proto__=n,r}}():void 0),hp=Co,fp=Pt,mp=ap,gp=Mc,yp=Ii,vp=mi,bp=Oc,xp=_c.PROPER,wp=Qc.BUGGY_SAFARI_ITERATORS,kp=hn("iterator"),$p=function(){return this},Sp=function(e,t,r,n,o,a,i){mp(r,t,n);var s,l,c,p=function(e){if(e===o&&m)return m;if(!wp&&e in h)return h[e];switch(e){case"keys":case"values":case"entries":return function(){return new r(this,e)}}return function(){return new r(this)}},d=t+" Iterator",u=!1,h=e.prototype,f=h[kp]||h["@@iterator"]||o&&h[o],m=!wp&&f||p(o),g="Array"==t&&h.entries||f;if(g&&(s=gp(g.call(new e)))!==Object.prototype&&s.next&&(yp(s,d,!0,!0),bp[d]=$p),xp&&"values"==o&&f&&"values"!==f.name&&(u=!0,m=function(){return fp(f,this)}),o)if(l={values:p("values"),keys:a?m:p("keys"),entries:p("entries")},i)for(c in l)(wp||u||!(c in h))&&vp(h,c,l[c]);else hp({target:t,proto:!0,forced:wp||u},l);return i&&h[kp]!==m&&vp(h,kp,m,{name:o}),bp[t]=m,l},Ap=er,Ep=Oc,Op=as;Qn.f;var Cp=Sp,Tp=Op.set,jp=Op.getterFor("Array Iterator");Cp(Array,"Array",(function(e,t){Tp(this,{type:"Array Iterator",target:Ap(e),index:0,kind:t})}),(function(){var e=jp(this),t=e.target,r=e.kind,n=e.index++;return!t||n>=t.length?(e.target=void 0,{value:void 0,done:!0}):"keys"==r?{value:n,done:!1}:"values"==r?{value:t[n],done:!1}:{value:[n,t[n]],done:!1}}),"values"),Ep.Arguments=Ep.Array;var Ip=ht,Pp=va,_p=go,Rp=Oc,Lp=hn("toStringTag");for(var Bp in{CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}){var Fp=Ip[Bp],Dp=Fp&&Fp.prototype;Dp&&Pp(Dp)!==Lp&&_p(Dp,Lp,Bp),Rp[Bp]=Rp.Array}var zp=ft,qp=function(e,t){var r=[][e];return!!r&&zp((function(){r.call(null,t||function(){return 1},1)}))},Np=Rs.forEach,Up=qp("forEach")?[].forEach:function(e){return Np(this,e,arguments.length>1?arguments[1]:void 0)};Co({target:"Array",proto:!0,forced:[].forEach!=Up},{forEach:Up});var Mp=ic("Array").forEach,Hp=va,Wp=Zr,Vp=cr,Gp=Mp,Kp=Array.prototype,Jp={DOMTokenList:!0,NodeList:!0};const Zp=dt({exports:{}}.exports=function(e){var t=e.forEach;return e===Kp||Vp(Kp,e)&&t===Kp.forEach||Wp(Jp,Hp(e))?Gp:t});var Yp=lr,Qp=Ga,Xp=ui,ed=oo,td=Et([].concat),rd=Yp("Reflect","ownKeys")||function(e){var t=Qp.f(ed(e)),r=Xp.f;return r?td(t,r(e)):t},nd=rd,od=er,ad=Ct,id=ei;Co({target:"Object",stat:!0,sham:!Tt},{getOwnPropertyDescriptors:function(e){for(var t,r,n=od(e),o=ad.f,a=nd(n),i={},s=0;a.length>s;)void 0!==(r=o(n,t=a[s++]))&&id(i,t,r);return i}});var sd=nr.Object.getOwnPropertyDescriptors;const ld=dt({exports:{}}.exports=sd);var cd={exports:{}},pd=Co,dd=Tt,ud=ka.f;pd({target:"Object",stat:!0,forced:Object.defineProperties!==ud,sham:!dd},{defineProperties:ud});var hd=nr.Object,fd=cd.exports=function(e,t){return hd.defineProperties(e,t)};hd.defineProperties.sham&&(fd.sham=!0);var md=cd.exports;const gd=dt({exports:{}}.exports=md);var yd={exports:{}},vd=Co,bd=Tt,xd=Qn.f;vd({target:"Object",stat:!0,forced:Object.defineProperty!==xd,sham:!bd},{defineProperty:xd});var wd=nr.Object,kd=yd.exports=function(e,t,r){return wd.defineProperty(e,t,r)};wd.defineProperty.sham&&(kd.sham=!0);var $d=yd.exports;const Sd=dt({exports:{}}.exports=$d);function Ad(e,t,r){return t in e?Sd(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function Ed(e,t){var r=ia(e);if(Xl){var n=Xl(e);t&&(n=uc(n).call(n,(function(t){return $c(e,t).enumerable}))),r.push.apply(r,n)}return r}function Od(e){for(var t=1;t<arguments.length;t++){var r,n,o=null!=arguments[t]?arguments[t]:{};t%2?Zp(r=Ed(Object(o),!0)).call(r,(function(t){Ad(e,t,o[t])})):ld?gd(e,ld(o)):Zp(n=Ed(Object(o))).call(n,(function(t){Sd(e,t,$c(o,t))}))}return e}var Cd=Tt,Td=Et,jd=Pt,Id=ft,Pd=ra,_d=ui,Rd=_t,Ld=Gr,Bd=Jt,Fd=Object.assign,Dd=Object.defineProperty,zd=Td([].concat),qd=!Fd||Id((function(){if(Cd&&1!==Fd({b:1},Fd(Dd({},"a",{enumerable:!0,get:function(){Dd(this,"b",{value:3,enumerable:!1})}}),{b:2})).b)return!0;var e={},t={},r=Symbol(),n="abcdefghijklmnopqrst";return e[r]=7,n.split("").forEach((function(e){t[e]=e})),7!=Fd({},e)[r]||Pd(Fd({},t)).join("")!=n}))?function(e,t){for(var r=Ld(e),n=arguments.length,o=1,a=_d.f,i=Rd.f;n>o;)for(var s,l=Bd(arguments[o++]),c=a?zd(Pd(l),a(l)):Pd(l),p=c.length,d=0;p>d;)s=c[d++],Cd&&!jd(i,l,s)||(r[s]=l[s]);return r}:Fd,Nd=qd;Co({target:"Object",stat:!0,forced:Object.assign!==Nd},{assign:Nd});var Ud=nr.Object.assign;const Md=dt({exports:{}}.exports=Ud);var Hd=rr,Wd=Mt,Vd=hn("match"),Gd=ht.TypeError,Kd=function(e){if(function(e){var t;return Hd(e)&&(void 0!==(t=e[Vd])?!!t:"RegExp"==Wd(e))}(e))throw Gd("The method doesn't accept regular expressions");return e},Jd=hn("match"),Zd=function(e){var t=/./;try{"/./"[e](t)}catch(r){try{return t[Jd]=!1,"/./"[e](t)}catch(e){}}return!1},Yd=Co,Qd=Et,Xd=Do,eu=wa,tu=Kd,ru=Yt,nu=Zd,ou=Qd("".startsWith),au=Qd("".slice),iu=Math.min;Yd({target:"String",proto:!0,forced:!nu("startsWith")},{startsWith:function(e){var t=eu(ru(this));tu(e);var r=Xd(iu(arguments.length>1?arguments[1]:void 0,t.length)),n=eu(e);return ou?ou(t,n,r):au(t,r,r+n.length)===n}});var su=ic("String").startsWith,lu=cr,cu=su,pu=String.prototype;const du=dt({exports:{}}.exports=function(e){var t=e.startsWith;return"string"==typeof e||e===pu||lu(pu,e)&&t===pu.startsWith?cu:t});var uu={},hu={exports:{}};!function(e,t){!function(r){var n=t&&!t.nodeType&&t,o=e&&!e.nodeType&&e,a="object"==typeof global&&global;a.global!==a&&a.window!==a&&a.self!==a||(r=a);var i,s,l=2147483647,c=36,p=/^xn--/,d=/[^\x20-\x7E]/,u=/[\x2E\u3002\uFF0E\uFF61]/g,h={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},f=Math.floor,m=String.fromCharCode;function g(e){throw RangeError(h[e])}function y(e,t){for(var r=e.length,n=[];r--;)n[r]=t(e[r]);return n}function v(e,t){var r=e.split("@"),n="";return r.length>1&&(n=r[0]+"@",e=r[1]),n+y((e=e.replace(u,".")).split("."),t).join(".")}function b(e){for(var t,r,n=[],o=0,a=e.length;o<a;)(t=e.charCodeAt(o++))>=55296&&t<=56319&&o<a?56320==(64512&(r=e.charCodeAt(o++)))?n.push(((1023&t)<<10)+(1023&r)+65536):(n.push(t),o--):n.push(t);return n}function x(e){return y(e,(function(e){var t="";return e>65535&&(t+=m((e-=65536)>>>10&1023|55296),e=56320|1023&e),t+m(e)})).join("")}function w(e,t){return e+22+75*(e<26)-((0!=t)<<5)}function k(e,t,r){var n=0;for(e=r?f(e/700):e>>1,e+=f(e/t);e>455;n+=c)e=f(e/35);return f(n+36*e/(e+38))}function $(e){var t,r,n,o,a,i,s,p,d,u,h,m=[],y=e.length,v=0,b=128,w=72;for((r=e.lastIndexOf("-"))<0&&(r=0),n=0;n<r;++n)e.charCodeAt(n)>=128&&g("not-basic"),m.push(e.charCodeAt(n));for(o=r>0?r+1:0;o<y;){for(a=v,i=1,s=c;o>=y&&g("invalid-input"),((p=(h=e.charCodeAt(o++))-48<10?h-22:h-65<26?h-65:h-97<26?h-97:c)>=c||p>f((l-v)/i))&&g("overflow"),v+=p*i,!(p<(d=s<=w?1:s>=w+26?26:s-w));s+=c)i>f(l/(u=c-d))&&g("overflow"),i*=u;w=k(v-a,t=m.length+1,0==a),f(v/t)>l-b&&g("overflow"),b+=f(v/t),v%=t,m.splice(v++,0,b)}return x(m)}function S(e){var t,r,n,o,a,i,s,p,d,u,h,y,v,x,$,S=[];for(y=(e=b(e)).length,t=128,r=0,a=72,i=0;i<y;++i)(h=e[i])<128&&S.push(m(h));for(n=o=S.length,o&&S.push("-");n<y;){for(s=l,i=0;i<y;++i)(h=e[i])>=t&&h<s&&(s=h);for(s-t>f((l-r)/(v=n+1))&&g("overflow"),r+=(s-t)*v,t=s,i=0;i<y;++i)if((h=e[i])<t&&++r>l&&g("overflow"),h==t){for(p=r,d=c;!(p<(u=d<=a?1:d>=a+26?26:d-a));d+=c)$=p-u,x=c-u,S.push(m(w(u+$%x,0))),p=f($/x);S.push(m(w(p,0))),a=k(r,v,n==o),r=0,++n}++r,++t}return S.join("")}if(i={version:"1.3.2",ucs2:{decode:b,encode:x},decode:$,encode:S,toASCII:function(e){return v(e,(function(e){return d.test(e)?"xn--"+S(e):e}))},toUnicode:function(e){return v(e,(function(e){return p.test(e)?$(e.slice(4).toLowerCase()):e}))}},n&&o)if(e.exports==n)o.exports=i;else for(s in i)i.hasOwnProperty(s)&&(n[s]=i[s]);else r.punycode=i}(this)}(hu,hu.exports);var fu={};function mu(e,t){return Object.prototype.hasOwnProperty.call(e,t)}var gu=function(e){switch(typeof e){case"string":return e;case"boolean":return e?"true":"false";case"number":return isFinite(e)?e:"";default:return""}};fu.decode=fu.parse=function(e,t,r,n){t=t||"&",r=r||"=";var o={};if("string"!=typeof e||0===e.length)return o;var a=/\+/g;e=e.split(t);var i=1e3;n&&"number"==typeof n.maxKeys&&(i=n.maxKeys);var s=e.length;i>0&&s>i&&(s=i);for(var l=0;l<s;++l){var c,p,d,u,h=e[l].replace(a,"%20"),f=h.indexOf(r);f>=0?(c=h.substr(0,f),p=h.substr(f+1)):(c=h,p=""),d=decodeURIComponent(c),u=decodeURIComponent(p),mu(o,d)?Array.isArray(o[d])?o[d].push(u):o[d]=[o[d],u]:o[d]=u}return o},fu.encode=fu.stringify=function(e,t,r,n){return t=t||"&",r=r||"=",null===e&&(e=void 0),"object"==typeof e?Object.keys(e).map((function(n){var o=encodeURIComponent(gu(n))+r;return Array.isArray(e[n])?e[n].map((function(e){return o+encodeURIComponent(gu(e))})).join(t):o+encodeURIComponent(gu(e[n]))})).join(t):n?encodeURIComponent(gu(n))+r+encodeURIComponent(gu(e)):""};var yu=hu.exports,vu=function(e){return"string"==typeof e},bu=function(e){return"object"==typeof e&&null!==e},xu=function(e){return null===e},wu=function(e){return null==e};function ku(){this.protocol=null,this.slashes=null,this.auth=null,this.host=null,this.port=null,this.hostname=null,this.hash=null,this.search=null,this.query=null,this.pathname=null,this.path=null,this.href=null}uu.parse=Bu,uu.resolve=function(e,t){return Bu(e,!1,!0).resolve(t)},uu.resolveObject=function(e,t){return e?Bu(e,!1,!0).resolveObject(t):t},uu.format=function(e){return vu(e)&&(e=Bu(e)),e instanceof ku?e.format():ku.prototype.format.call(e)},uu.Url=ku;var $u=/^([a-z0-9.+-]+:)/i,Su=/:[0-9]*$/,Au=/^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,Eu=["{","}","|","\\","^","`"].concat(["<",">",'"',"`"," ","\r","\n","\t"]),Ou=["'"].concat(Eu),Cu=["%","/","?",";","#"].concat(Ou),Tu=["/","?","#"],ju=/^[+a-z0-9A-Z_-]{0,63}$/,Iu=/^([+a-z0-9A-Z_-]{0,63})(.*)$/,Pu={javascript:!0,"javascript:":!0},_u={javascript:!0,"javascript:":!0},Ru={http:!0,https:!0,ftp:!0,gopher:!0,file:!0,"http:":!0,"https:":!0,"ftp:":!0,"gopher:":!0,"file:":!0},Lu=fu;function Bu(e,t,r){if(e&&bu(e)&&e instanceof ku)return e;var n=new ku;return n.parse(e,t,r),n}ku.prototype.parse=function(e,t,r){if(!vu(e))throw new TypeError("Parameter 'url' must be a string, not "+typeof e);var n=e.indexOf("?"),o=-1!==n&&n<e.indexOf("#")?"?":"#",a=e.split(o);a[0]=a[0].replace(/\\/g,"/");var i=e=a.join(o);if(i=i.trim(),!r&&1===e.split("#").length){var s=Au.exec(i);if(s)return this.path=i,this.href=i,this.pathname=s[1],s[2]?(this.search=s[2],this.query=t?Lu.parse(this.search.substr(1)):this.search.substr(1)):t&&(this.search="",this.query={}),this}var l=$u.exec(i);if(l){var c=(l=l[0]).toLowerCase();this.protocol=c,i=i.substr(l.length)}if(r||l||i.match(/^\/\/[^@\/]+@[^@\/]+/)){var p="//"===i.substr(0,2);!p||l&&_u[l]||(i=i.substr(2),this.slashes=!0)}if(!_u[l]&&(p||l&&!Ru[l])){for(var d,u,h=-1,f=0;f<Tu.length;f++)-1!==(m=i.indexOf(Tu[f]))&&(-1===h||m<h)&&(h=m);for(-1!==(u=-1===h?i.lastIndexOf("@"):i.lastIndexOf("@",h))&&(d=i.slice(0,u),i=i.slice(u+1),this.auth=decodeURIComponent(d)),h=-1,f=0;f<Cu.length;f++){var m;-1!==(m=i.indexOf(Cu[f]))&&(-1===h||m<h)&&(h=m)}-1===h&&(h=i.length),this.host=i.slice(0,h),i=i.slice(h),this.parseHost(),this.hostname=this.hostname||"";var g="["===this.hostname[0]&&"]"===this.hostname[this.hostname.length-1];if(!g)for(var y=this.hostname.split(/\./),v=(f=0,y.length);f<v;f++){var b=y[f];if(b&&!b.match(ju)){for(var x="",w=0,k=b.length;w<k;w++)b.charCodeAt(w)>127?x+="x":x+=b[w];if(!x.match(ju)){var $=y.slice(0,f),S=y.slice(f+1),A=b.match(Iu);A&&($.push(A[1]),S.unshift(A[2])),S.length&&(i="/"+S.join(".")+i),this.hostname=$.join(".");break}}}this.hostname.length>255?this.hostname="":this.hostname=this.hostname.toLowerCase(),g||(this.hostname=yu.toASCII(this.hostname));var E=this.port?":"+this.port:"",O=this.hostname||"";this.host=O+E,this.href+=this.host,g&&(this.hostname=this.hostname.substr(1,this.hostname.length-2),"/"!==i[0]&&(i="/"+i))}if(!Pu[c])for(f=0,v=Ou.length;f<v;f++){var C=Ou[f];if(-1!==i.indexOf(C)){var T=encodeURIComponent(C);T===C&&(T=escape(C)),i=i.split(C).join(T)}}var j=i.indexOf("#");-1!==j&&(this.hash=i.substr(j),i=i.slice(0,j));var I=i.indexOf("?");if(-1!==I?(this.search=i.substr(I),this.query=i.substr(I+1),t&&(this.query=Lu.parse(this.query)),i=i.slice(0,I)):t&&(this.search="",this.query={}),i&&(this.pathname=i),Ru[c]&&this.hostname&&!this.pathname&&(this.pathname="/"),this.pathname||this.search){E=this.pathname||"";var P=this.search||"";this.path=E+P}return this.href=this.format(),this},ku.prototype.format=function(){var e=this.auth||"";e&&(e=(e=encodeURIComponent(e)).replace(/%3A/i,":"),e+="@");var t=this.protocol||"",r=this.pathname||"",n=this.hash||"",o=!1,a="";this.host?o=e+this.host:this.hostname&&(o=e+(-1===this.hostname.indexOf(":")?this.hostname:"["+this.hostname+"]"),this.port&&(o+=":"+this.port)),this.query&&bu(this.query)&&Object.keys(this.query).length&&(a=Lu.stringify(this.query));var i=this.search||a&&"?"+a||"";return t&&":"!==t.substr(-1)&&(t+=":"),this.slashes||(!t||Ru[t])&&!1!==o?(o="//"+(o||""),r&&"/"!==r.charAt(0)&&(r="/"+r)):o||(o=""),n&&"#"!==n.charAt(0)&&(n="#"+n),i&&"?"!==i.charAt(0)&&(i="?"+i),t+o+(r=r.replace(/[?#]/g,(function(e){return encodeURIComponent(e)})))+(i=i.replace("#","%23"))+n},ku.prototype.resolve=function(e){return this.resolveObject(Bu(e,!1,!0)).format()},ku.prototype.resolveObject=function(e){if(vu(e)){var t=new ku;t.parse(e,!1,!0),e=t}for(var r=new ku,n=Object.keys(this),o=0;o<n.length;o++){var a=n[o];r[a]=this[a]}if(r.hash=e.hash,""===e.href)return r.href=r.format(),r;if(e.slashes&&!e.protocol){for(var i=Object.keys(e),s=0;s<i.length;s++){var l=i[s];"protocol"!==l&&(r[l]=e[l])}return Ru[r.protocol]&&r.hostname&&!r.pathname&&(r.path=r.pathname="/"),r.href=r.format(),r}if(e.protocol&&e.protocol!==r.protocol){if(!Ru[e.protocol]){for(var c=Object.keys(e),p=0;p<c.length;p++){var d=c[p];r[d]=e[d]}return r.href=r.format(),r}if(r.protocol=e.protocol,e.host||_u[e.protocol])r.pathname=e.pathname;else{for(var u=(e.pathname||"").split("/");u.length&&!(e.host=u.shift()););e.host||(e.host=""),e.hostname||(e.hostname=""),""!==u[0]&&u.unshift(""),u.length<2&&u.unshift(""),r.pathname=u.join("/")}if(r.search=e.search,r.query=e.query,r.host=e.host||"",r.auth=e.auth,r.hostname=e.hostname||e.host,r.port=e.port,r.pathname||r.search){var h=r.pathname||"",f=r.search||"";r.path=h+f}return r.slashes=r.slashes||e.slashes,r.href=r.format(),r}var m=r.pathname&&"/"===r.pathname.charAt(0),g=e.host||e.pathname&&"/"===e.pathname.charAt(0),y=g||m||r.host&&e.pathname,v=y,b=r.pathname&&r.pathname.split("/")||[],x=(u=e.pathname&&e.pathname.split("/")||[],r.protocol&&!Ru[r.protocol]);if(x&&(r.hostname="",r.port=null,r.host&&(""===b[0]?b[0]=r.host:b.unshift(r.host)),r.host="",e.protocol&&(e.hostname=null,e.port=null,e.host&&(""===u[0]?u[0]=e.host:u.unshift(e.host)),e.host=null),y=y&&(""===u[0]||""===b[0])),g)r.host=e.host||""===e.host?e.host:r.host,r.hostname=e.hostname||""===e.hostname?e.hostname:r.hostname,r.search=e.search,r.query=e.query,b=u;else if(u.length)b||(b=[]),b.pop(),b=b.concat(u),r.search=e.search,r.query=e.query;else if(!wu(e.search))return x&&(r.hostname=r.host=b.shift(),(A=!!(r.host&&r.host.indexOf("@")>0)&&r.host.split("@"))&&(r.auth=A.shift(),r.host=r.hostname=A.shift())),r.search=e.search,r.query=e.query,xu(r.pathname)&&xu(r.search)||(r.path=(r.pathname?r.pathname:"")+(r.search?r.search:"")),r.href=r.format(),r;if(!b.length)return r.pathname=null,r.search?r.path="/"+r.search:r.path=null,r.href=r.format(),r;for(var w=b.slice(-1)[0],k=(r.host||e.host||b.length>1)&&("."===w||".."===w)||""===w,$=0,S=b.length;S>=0;S--)"."===(w=b[S])?b.splice(S,1):".."===w?(b.splice(S,1),$++):$&&(b.splice(S,1),$--);if(!y&&!v)for(;$--;$)b.unshift("..");!y||""===b[0]||b[0]&&"/"===b[0].charAt(0)||b.unshift(""),k&&"/"!==b.join("/").substr(-1)&&b.push("");var A,E=""===b[0]||b[0]&&"/"===b[0].charAt(0);return x&&(r.hostname=r.host=E?"":b.length?b.shift():"",(A=!!(r.host&&r.host.indexOf("@")>0)&&r.host.split("@"))&&(r.auth=A.shift(),r.host=r.hostname=A.shift())),(y=y||r.host&&b.length)&&!E&&b.unshift(""),b.length?r.pathname=b.join("/"):(r.pathname=null,r.path=null),xu(r.pathname)&&xu(r.search)||(r.path=(r.pathname?r.pathname:"")+(r.search?r.search:"")),r.auth=e.auth||r.auth,r.slashes=r.slashes||e.slashes,r.href=r.format(),r},ku.prototype.parseHost=function(){var e=this.host,t=Su.exec(e);t&&(":"!==(t=t[0])&&(this.port=t.substr(1)),e=e.substr(0,e.length-t.length)),e&&(this.hostname=e)};var Fu=Co,Du=ht,zu=ft,qu=la,Nu=rr,Uu=Gr,Mu=qo,Hu=ei,Wu=Es,Vu=nc,Gu=yr,Ku=hn("isConcatSpreadable"),Ju=Du.TypeError,Zu=Gu>=51||!zu((function(){var e=[];return e[Ku]=!1,e.concat()[0]!==e})),Yu=Vu("concat"),Qu=function(e){if(!Nu(e))return!1;var t=e[Ku];return void 0!==t?!!t:qu(e)};Fu({target:"Array",proto:!0,forced:!Zu||!Yu},{concat:function(e){var t,r,n,o,a,i=Uu(this),s=Wu(i,0),l=0;for(t=-1,n=arguments.length;t<n;t++)if(Qu(a=-1===t?i:arguments[t])){if(l+(o=Mu(a))>9007199254740991)throw Ju("Maximum allowed index exceeded");for(r=0;r<o;r++,l++)r in a&&Hu(s,l,a[r])}else{if(l>=9007199254740991)throw Ju("Maximum allowed index exceeded");Hu(s,l++,a)}return s.length=l,s}}),ki("asyncIterator"),ki("hasInstance"),ki("isConcatSpreadable"),ki("iterator"),ki("match"),ki("matchAll"),ki("replace"),ki("search"),ki("species"),ki("split"),ki("toPrimitive"),ki("toStringTag"),ki("unscopables"),Ii(ht.JSON,"JSON",!0);var Xu=nr.Symbol;ki("asyncDispose"),ki("dispose"),ki("matcher"),ki("metadata"),ki("observable"),ki("patternMatch"),ki("replaceAll");const eh=dt({exports:{}}.exports=Xu);var th=Et,rh=Io,nh=wa,oh=Yt,ah=th("".charAt),ih=th("".charCodeAt),sh=th("".slice),lh=function(e){return function(t,r){var n,o,a=nh(oh(t)),i=rh(r),s=a.length;return i<0||i>=s?e?"":void 0:(n=ih(a,i))<55296||n>56319||i+1===s||(o=ih(a,i+1))<56320||o>57343?e?ah(a,i):n:e?sh(a,i,i+2):o-56320+(n-55296<<10)+65536}},ch=(lh(!1),lh(!0)),ph=wa,dh=as,uh=Sp,hh=dh.set,fh=dh.getterFor("String Iterator");uh(String,"String",(function(e){hh(this,{type:"String Iterator",string:ph(e),index:0})}),(function(){var e,t=fh(this),r=t.string,n=t.index;return n>=r.length?{value:void 0,done:!0}:(e=ch(r,n),t.index+=e.length,{value:e,done:!1})}));var mh=va,gh=Lr,yh=Oc,vh=hn("iterator"),bh=function(e){if(null!=e)return gh(e,vh)||gh(e,"@@iterator")||yh[mh(e)]};const xh=dt({exports:{}}.exports=bh);Co({target:"Array",stat:!0},{isArray:la});var wh=nr.Array.isArray;const kh=dt({exports:{}}.exports=wh);var $h=Co,Sh=ht,Ah=la,Eh=bs,Oh=rr,Ch=Lo,Th=qo,jh=er,Ih=ei,Ph=hn,_h=hi,Rh=nc("slice"),Lh=Ph("species"),Bh=Sh.Array,Fh=Math.max;$h({target:"Array",proto:!0,forced:!Rh},{slice:function(e,t){var r,n,o,a=jh(this),i=Th(a),s=Ch(e,i),l=Ch(void 0===t?i:t,i);if(Ah(a)&&(r=a.constructor,(Eh(r)&&(r===Bh||Ah(r.prototype))||Oh(r)&&null===(r=r[Lh]))&&(r=void 0),r===Bh||void 0===r))return _h(a,s,l);for(n=new(void 0===r?Bh:r)(Fh(l-s,0)),o=0;s<l;s++,o++)s in a&&Ih(n,o,a[s]);return n.length=o,n}});var Dh=ic("Array").slice,zh=cr,qh=Dh,Nh=Array.prototype,Uh=function(e){var t=e.slice;return e===Nh||zh(Nh,e)&&t===Nh.slice?qh:t};const Mh=dt({exports:{}}.exports=Uh);var Hh=Pt,Wh=oo,Vh=Lr,Gh=function(e,t,r){var n,o;Wh(e);try{if(!(n=Vh(e,"return"))){if("throw"===t)throw r;return r}n=Hh(n,e)}catch(e){o=!0,n=e}if("throw"===t)throw r;if(o)throw n;return Wh(n),r},Kh=oo,Jh=Gh,Zh=Oc,Yh=hn("iterator"),Qh=Array.prototype,Xh=function(e){return void 0!==e&&(Zh.Array===e||Qh[Yh]===e)},ef=Pt,tf=_r,rf=oo,nf=Tr,of=bh,af=ht.TypeError,sf=function(e,t){var r=arguments.length<2?of(e):t;if(tf(r))return rf(ef(r,e));throw af(nf(e)+" is not iterable")},lf=Yn,cf=Pt,pf=Gr,df=function(e,t,r,n){try{return n?t(Kh(r)[0],r[1]):t(r)}catch(t){Jh(e,"throw",t)}},uf=Xh,hf=bs,ff=qo,mf=ei,gf=sf,yf=bh,vf=ht.Array,bf=hn("iterator"),xf=!1;try{var wf=0,kf={next:function(){return{done:!!wf++}},return:function(){xf=!0}};kf[bf]=function(){return this},Array.from(kf,(function(){throw 2}))}catch(e){}var $f=function(e,t){if(!t&&!xf)return!1;var r=!1;try{var n={};n[bf]=function(){return{next:function(){return{done:r=!0}}}},e(n)}catch(e){}return r};Co({target:"Array",stat:!0,forced:!$f((function(e){Array.from(e)}))},{from:function(e){var t=pf(e),r=hf(this),n=arguments.length,o=n>1?arguments[1]:void 0,a=void 0!==o;a&&(o=lf(o,n>2?arguments[2]:void 0));var i,s,l,c,p,d,u=yf(t),h=0;if(!u||this==vf&&uf(u))for(i=ff(t),s=r?new this(i):vf(i);i>h;h++)d=a?o(t[h],h):t[h],mf(s,h,d);else for(p=(c=gf(t,u)).next,s=r?new this:[];!(l=cf(p,c)).done;h++)d=a?df(c,o,[l.value,h],!0):l.value,mf(s,h,d);return s.length=h,s}});var Sf=nr.Array.from;const Af=dt({exports:{}}.exports=Sf);function Ef(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function Of(e,t){var r;if(e){if("string"==typeof e)return Ef(e,t);var n=Mh(r=Object.prototype.toString.call(e)).call(r,8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Af(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Ef(e,t):void 0}}function Cf(e,t){var r=void 0!==eh&&xh(e)||e["@@iterator"];if(!r){if(kh(e)||(r=Of(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,o=function(){};return{s:o,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,i=!0,s=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return i=e.done,e},e:function(e){s=!0,a=e},f:function(){try{i||null==r.return||r.return()}finally{if(s)throw a}}}}var Tf=gi.f("iterator");const jf=dt({exports:{}}.exports=Tf);function If(e){return(If="function"==typeof eh&&"symbol"==typeof jf?function(e){return typeof e}:function(e){return e&&"function"==typeof eh&&e.constructor===eh&&e!==eh.prototype?"symbol":typeof e})(e)}function Pf(e,t){return function(e){if(kh(e))return e}(e)||function(e,t){var r=null==e?null:void 0!==eh&&xh(e)||e["@@iterator"];if(null!=r){var n,o,a=[],i=!0,s=!1;try{for(r=r.call(e);!(i=(n=r.next()).done)&&(a.push(n.value),!t||a.length!==t);i=!0);}catch(e){s=!0,o=e}finally{try{i||null==r.return||r.return()}finally{if(s)throw o}}return a}}(e,t)||Of(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var _f=Zr,Rf=rd,Lf=Ct,Bf=Qn,Ff=Et("".replace),Df=String(Error("zxcasd").stack),zf=/\n\s*at [^:]*:[^\n]*/,qf=zf.test(Df),Nf=rr,Uf=go,Mf=Yn,Hf=Pt,Wf=oo,Vf=Tr,Gf=Xh,Kf=qo,Jf=cr,Zf=sf,Yf=bh,Qf=Gh,Xf=ht.TypeError,em=function(e,t){this.stopped=e,this.result=t},tm=em.prototype,rm=function(e,t,r){var n,o,a,i,s,l,c,p=r&&r.that,d=!(!r||!r.AS_ENTRIES),u=!(!r||!r.IS_ITERATOR),h=!(!r||!r.INTERRUPTED),f=Mf(t,p),m=function(e){return n&&Qf(n,"normal",e),new em(!0,e)},g=function(e){return d?(Wf(e),h?f(e[0],e[1],m):f(e[0],e[1])):h?f(e,m):f(e)};if(u)n=e;else{if(!(o=Yf(e)))throw Xf(Vf(e)+" is not iterable");if(Gf(o)){for(a=0,i=Kf(e);i>a;a++)if((s=g(e[a]))&&Jf(tm,s))return s;return new em(!1)}n=Zf(e,o)}for(l=n.next;!(c=Hf(l,n)).done;){try{s=g(c.value)}catch(e){Qf(n,"throw",e)}if("object"==typeof s&&s&&Jf(tm,s))return s}return new em(!1)},nm=wa,om=zt,am=!ft((function(){var e=Error("a");return!("stack"in e)||(Object.defineProperty(e,"stack",om(1,7)),7!==e.stack)})),im=Co,sm=ht,lm=cr,cm=Mc,pm=up,dm=Va,um=go,hm=zt,fm=function(e,t){if(qf&&"string"==typeof e)for(;t--;)e=Ff(e,zf,"");return e},mm=function(e,t){Nf(t)&&"cause"in t&&Uf(e,"cause",t.cause)},gm=rm,ym=function(e,t){return void 0===e?arguments.length<2?"":t:nm(e)},vm=am,bm=hn("toStringTag"),xm=sm.Error,wm=[].push,km=function(e,t){var r,n=arguments.length>2?arguments[2]:void 0,o=lm($m,this);pm?r=pm(new xm,o?cm(this):$m):(r=o?this:dm($m),um(r,bm,"Error")),void 0!==t&&um(r,"message",ym(t)),vm&&um(r,"stack",fm(r.stack,1)),mm(r,n);var a=[];return gm(e,wm,{that:a}),um(r,"errors",a),r};pm?pm(km,xm):function(e,t,r){for(var n=Rf(t),o=Bf.f,a=Lf.f,i=0;i<n.length;i++){var s=n[i];_f(e,s)||r&&_f(r,s)||o(e,s,a(t,s))}}(km,xm,{name:!0});var $m=km.prototype=dm(xm.prototype,{constructor:hm(1,km),message:hm(1,""),name:hm(1,"AggregateError")});im({global:!0},{AggregateError:km});var Sm,Am,Em,Om,Cm=ht.Promise,Tm=mi,jm=function(e,t,r){for(var n in t)r&&r.unsafe&&e[n]?e[n]=t[n]:Tm(e,n,t[n],r);return e},Im=lr,Pm=Qn,_m=Tt,Rm=hn("species"),Lm=cr,Bm=ht.TypeError,Fm=function(e,t){if(Lm(t,e))return e;throw Bm("Incorrect invocation")},Dm=bs,zm=Tr,qm=ht.TypeError,Nm=oo,Um=hn("species"),Mm=function(e,t){var r,n=Nm(e).constructor;return void 0===n||null==(r=Nm(n)[Um])?t:function(e){if(Dm(e))return e;throw qm(zm(e)+" is not a constructor")}(r)},Hm=ht.TypeError,Wm=function(e,t){if(e<t)throw Hm("Not enough arguments");return e},Vm=/(?:ipad|iphone|ipod).*applewebkit/i.test(pr),Gm="process"==Mt(ht.process),Km=ht,Jm=xt,Zm=Yn,Ym=Ot,Qm=Zr,Xm=ft,eg=ja,tg=hi,rg=On,ng=Wm,og=Vm,ag=Gm,ig=Km.setImmediate,sg=Km.clearImmediate,lg=Km.process,cg=Km.Dispatch,pg=Km.Function,dg=Km.MessageChannel,ug=Km.String,hg=0,fg={};try{Sm=Km.location}catch(e){}var mg=function(e){if(Qm(fg,e)){var t=fg[e];delete fg[e],t()}},gg=function(e){return function(){mg(e)}},yg=function(e){mg(e.data)},vg=function(e){Km.postMessage(ug(e),Sm.protocol+"//"+Sm.host)};ig&&sg||(ig=function(e){ng(arguments.length,1);var t=Ym(e)?e:pg(e),r=tg(arguments,1);return fg[++hg]=function(){Jm(t,void 0,r)},Am(hg),hg},sg=function(e){delete fg[e]},ag?Am=function(e){lg.nextTick(gg(e))}:cg&&cg.now?Am=function(e){cg.now(gg(e))}:dg&&!og?(Om=(Em=new dg).port2,Em.port1.onmessage=yg,Am=Zm(Om.postMessage,Om)):Km.addEventListener&&Ym(Km.postMessage)&&!Km.importScripts&&Sm&&"file:"!==Sm.protocol&&!Xm(vg)?(Am=vg,Km.addEventListener("message",yg,!1)):Am="onreadystatechange"in rg("script")?function(e){eg.appendChild(rg("script")).onreadystatechange=function(){eg.removeChild(this),mg(e)}}:function(e){setTimeout(gg(e),0)});var bg,xg,wg,kg,$g,Sg,Ag,Eg,Og={set:ig,clear:sg},Cg=ht,Tg=/ipad|iphone|ipod/i.test(pr)&&void 0!==Cg.Pebble,jg=/web0s(?!.*chrome)/i.test(pr),Ig=ht,Pg=Yn,_g=Ct.f,Rg=Og.set,Lg=Vm,Bg=Tg,Fg=jg,Dg=Gm,zg=Ig.MutationObserver||Ig.WebKitMutationObserver,qg=Ig.document,Ng=Ig.process,Ug=Ig.Promise,Mg=_g(Ig,"queueMicrotask"),Hg=Mg&&Mg.value;Hg||(bg=function(){var e,t;for(Dg&&(e=Ng.domain)&&e.exit();xg;){t=xg.fn,xg=xg.next;try{t()}catch(e){throw xg?kg():wg=void 0,e}}wg=void 0,e&&e.enter()},Lg||Dg||Fg||!zg||!qg?!Bg&&Ug&&Ug.resolve?((Ag=Ug.resolve(void 0)).constructor=Ug,Eg=Pg(Ag.then,Ag),kg=function(){Eg(bg)}):Dg?kg=function(){Ng.nextTick(bg)}:(Rg=Pg(Rg,Ig),kg=function(){Rg(bg)}):($g=!0,Sg=qg.createTextNode(""),new zg(bg).observe(Sg,{characterData:!0}),kg=function(){Sg.data=$g=!$g}));var Wg=Hg||function(e){var t={fn:e,next:void 0};wg&&(wg.next=t),xg||(xg=t,kg()),wg=t},Vg={},Gg=_r,Kg=function(e){var t,r;this.promise=new e((function(e,n){if(void 0!==t||void 0!==r)throw TypeError("Bad Promise constructor");t=e,r=n})),this.resolve=Gg(t),this.reject=Gg(r)};Vg.f=function(e){return new Kg(e)};var Jg=oo,Zg=rr,Yg=Vg,Qg=function(e,t){if(Jg(e),Zg(t)&&t.constructor===e)return t;var r=Yg.f(e);return(0,r.resolve)(t),r.promise},Xg=ht,ey=function(e){try{return{error:!1,value:e()}}catch(e){return{error:!0,value:e}}},ty=function(){this.head=null,this.tail=null};ty.prototype={add:function(e){var t={item:e,next:null};this.head?this.tail.next=t:this.head=t,this.tail=t},get:function(){var e=this.head;if(e)return this.head=e.next,this.tail===e&&(this.tail=null),e.item}};var ry,ny,oy,ay,iy,sy="object"==typeof window,ly=Co,cy=ht,py=lr,dy=Pt,uy=Cm,hy=jm,fy=Ii,my=_r,gy=Ot,yy=rr,vy=Fm,by=Di,xy=rm,wy=$f,ky=Mm,$y=Og.set,Sy=Wg,Ay=Qg,Ey=Vg,Oy=ey,Cy=ty,Ty=as,jy=Gn,Iy=sy,Py=Gm,_y=yr,Ry=hn("species"),Ly="Promise",By=Ty.getterFor(Ly),Fy=Ty.set,Dy=Ty.getterFor(Ly),zy=uy&&uy.prototype,qy=uy,Ny=zy,Uy=cy.TypeError,My=cy.document,Hy=cy.process,Wy=Ey.f,Vy=Wy,Gy=!!(My&&My.createEvent&&cy.dispatchEvent),Ky=gy(cy.PromiseRejectionEvent),Jy=jy(Ly,(function(){var e=by(qy),t=e!==String(qy);if(!t&&66===_y)return!0;if(!Ny.finally)return!0;if(_y>=51&&/native code/.test(e))return!1;var r=new qy((function(e){e(1)})),n=function(e){e((function(){}),(function(){}))};return(r.constructor={})[Ry]=n,!(r.then((function(){}))instanceof n)||!t&&Iy&&!Ky})),Zy=Jy||!wy((function(e){qy.all(e).catch((function(){}))})),Yy=function(e){var t;return!(!yy(e)||!gy(t=e.then))&&t},Qy=function(e,t){var r,n,o,a=t.value,i=1==t.state,s=i?e.ok:e.fail,l=e.resolve,c=e.reject,p=e.domain;try{s?(i||(2===t.rejection&&nv(t),t.rejection=1),!0===s?r=a:(p&&p.enter(),r=s(a),p&&(p.exit(),o=!0)),r===e.promise?c(Uy("Promise-chain cycle")):(n=Yy(r))?dy(n,r,l,c):l(r)):c(a)}catch(e){p&&!o&&p.exit(),c(e)}},Xy=function(e,t){e.notified||(e.notified=!0,Sy((function(){for(var r,n=e.reactions;r=n.get();)Qy(r,e);e.notified=!1,t&&!e.rejection&&tv(e)})))},ev=function(e,t,r){var n,o;Gy?((n=My.createEvent("Event")).promise=t,n.reason=r,n.initEvent(e,!1,!0),cy.dispatchEvent(n)):n={promise:t,reason:r},!Ky&&(o=cy["on"+e])?o(n):"unhandledrejection"===e&&function(e,t){var r=Xg.console;r&&r.error&&(1==arguments.length?r.error(e):r.error(e,t))}("Unhandled promise rejection",r)},tv=function(e){dy($y,cy,(function(){var t,r=e.facade,n=e.value;if(rv(e)&&(t=Oy((function(){Py?Hy.emit("unhandledRejection",n,r):ev("unhandledrejection",r,n)})),e.rejection=Py||rv(e)?2:1,t.error))throw t.value}))},rv=function(e){return 1!==e.rejection&&!e.parent},nv=function(e){dy($y,cy,(function(){var t=e.facade;Py?Hy.emit("rejectionHandled",t):ev("rejectionhandled",t,e.value)}))},ov=function(e,t,r){return function(n){e(t,n,r)}},av=function(e,t,r){e.done||(e.done=!0,r&&(e=r),e.value=t,e.state=2,Xy(e,!0))},iv=function(e,t,r){if(!e.done){e.done=!0,r&&(e=r);try{if(e.facade===t)throw Uy("Promise can't be resolved itself");var n=Yy(t);n?Sy((function(){var r={done:!1};try{dy(n,t,ov(iv,r,e),ov(av,r,e))}catch(t){av(r,t,e)}})):(e.value=t,e.state=1,Xy(e,!1))}catch(t){av({done:!1},t,e)}}};Jy&&(Ny=(qy=function(e){vy(this,Ny),my(e),dy(ry,this);var t=By(this);try{e(ov(iv,t),ov(av,t))}catch(e){av(t,e)}}).prototype,(ry=function(e){Fy(this,{type:Ly,done:!1,notified:!1,parent:!1,reactions:new Cy,rejection:!1,state:0,value:void 0})}).prototype=hy(Ny,{then:function(e,t){var r=Dy(this),n=Wy(ky(this,qy));return r.parent=!0,n.ok=!gy(e)||e,n.fail=gy(t)&&t,n.domain=Py?Hy.domain:void 0,0==r.state?r.reactions.add(n):Sy((function(){Qy(n,r)})),n.promise},catch:function(e){return this.then(void 0,e)}}),ny=function(){var e=new ry,t=By(e);this.promise=e,this.resolve=ov(iv,t),this.reject=ov(av,t)},Ey.f=Wy=function(e){return e===qy||e===oy?new ny(e):Vy(e)}),ly({global:!0,wrap:!0,forced:Jy},{Promise:qy}),fy(qy,Ly,!1,!0),ay=Im(Ly),iy=Pm.f,_m&&ay&&!ay[Rm]&&iy(ay,Rm,{configurable:!0,get:function(){return this}}),oy=py(Ly),ly({target:Ly,stat:!0,forced:Jy},{reject:function(e){var t=Wy(this);return dy(t.reject,void 0,e),t.promise}}),ly({target:Ly,stat:!0,forced:!0},{resolve:function(e){return Ay(this===oy?qy:this,e)}}),ly({target:Ly,stat:!0,forced:Zy},{all:function(e){var t=this,r=Wy(t),n=r.resolve,o=r.reject,a=Oy((function(){var r=my(t.resolve),a=[],i=0,s=1;xy(e,(function(e){var l=i++,c=!1;s++,dy(r,t,e).then((function(e){c||(c=!0,a[l]=e,--s||n(a))}),o)})),--s||n(a)}));return a.error&&o(a.value),r.promise},race:function(e){var t=this,r=Wy(t),n=r.reject,o=Oy((function(){var o=my(t.resolve);xy(e,(function(e){dy(o,t,e).then(r.resolve,n)}))}));return o.error&&n(o.value),r.promise}});var sv=Pt,lv=_r,cv=Vg,pv=ey,dv=rm;Co({target:"Promise",stat:!0},{allSettled:function(e){var t=this,r=cv.f(t),n=r.resolve,o=r.reject,a=pv((function(){var r=lv(t.resolve),o=[],a=0,i=1;dv(e,(function(e){var s=a++,l=!1;i++,sv(r,t,e).then((function(e){l||(l=!0,o[s]={status:"fulfilled",value:e},--i||n(o))}),(function(e){l||(l=!0,o[s]={status:"rejected",reason:e},--i||n(o))}))})),--i||n(o)}));return a.error&&o(a.value),r.promise}});var uv=_r,hv=lr,fv=Pt,mv=Vg,gv=ey,yv=rm;Co({target:"Promise",stat:!0},{any:function(e){var t=this,r=hv("AggregateError"),n=mv.f(t),o=n.resolve,a=n.reject,i=gv((function(){var n=uv(t.resolve),i=[],s=0,l=1,c=!1;yv(e,(function(e){var p=s++,d=!1;l++,fv(n,t,e).then((function(e){d||c||(c=!0,o(e))}),(function(e){d||c||(d=!0,i[p]=e,--l||a(new r(i,"No one promise resolved")))}))})),--l||a(new r(i,"No one promise resolved"))}));return i.error&&a(i.value),n.promise}});var vv=Cm,bv=lr,xv=Ot,wv=Mm,kv=Qg;Co({target:"Promise",proto:!0,real:!0,forced:!!vv&&ft((function(){vv.prototype.finally.call({then:function(){}},(function(){}))}))},{finally:function(e){var t=wv(this,bv("Promise")),r=xv(e);return this.then(r?function(r){return kv(t,e()).then((function(){return r}))}:e,r?function(r){return kv(t,e()).then((function(){throw r}))}:e)}});var $v=nr.Promise,Sv=$v,Av=Vg,Ev=ey;Co({target:"Promise",stat:!0,forced:!0},{try:function(e){var t=Av.f(this),r=Ev(e);return(r.error?t.reject:t.resolve)(r.value),t.promise}});const Ov=dt({exports:{}}.exports=Sv);function Cv(e,t,r,n,o,a,i){try{var s=e[a](i),l=s.value}catch(e){return void r(e)}s.done?t(l):Ov.resolve(l).then(n,o)}function Tv(e){return function(){var t=this,r=arguments;return new Ov((function(n,o){var a=e.apply(t,r);function i(e){Cv(a,n,o,i,s,"next",e)}function s(e){Cv(a,n,o,i,s,"throw",e)}i(void 0)}))}}var jv={exports:{}};!function(e){var t=function(e){var t,r=Object.prototype,n=r.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},a=o.iterator||"@@iterator",i=o.asyncIterator||"@@asyncIterator",s=o.toStringTag||"@@toStringTag";function l(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{l({},"")}catch(e){l=function(e,t,r){return e[t]=r}}function c(e,t,r,n){var o,a,i,s,l=t&&t.prototype instanceof g?t:g,c=Object.create(l.prototype),y=new C(n||[]);return c._invoke=(o=e,a=r,i=y,s=d,function(e,t){if(s===h)throw new Error("Generator is already running");if(s===f){if("throw"===e)throw t;return j()}for(i.method=e,i.arg=t;;){var r=i.delegate;if(r){var n=A(r,i);if(n){if(n===m)continue;return n}}if("next"===i.method)i.sent=i._sent=i.arg;else if("throw"===i.method){if(s===d)throw s=f,i.arg;i.dispatchException(i.arg)}else"return"===i.method&&i.abrupt("return",i.arg);s=h;var l=p(o,a,i);if("normal"===l.type){if(s=i.done?f:u,l.arg===m)continue;return{value:l.arg,done:i.done}}"throw"===l.type&&(s=f,i.method="throw",i.arg=l.arg)}}),c}function p(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}e.wrap=c;var d="suspendedStart",u="suspendedYield",h="executing",f="completed",m={};function g(){}function y(){}function v(){}var b={};l(b,a,(function(){return this}));var x=Object.getPrototypeOf,w=x&&x(x(T([])));w&&w!==r&&n.call(w,a)&&(b=w);var k=v.prototype=g.prototype=Object.create(b);function $(e){["next","throw","return"].forEach((function(t){l(e,t,(function(e){return this._invoke(t,e)}))}))}function S(e,t){function r(o,a,i,s){var l=p(e[o],e,a);if("throw"!==l.type){var c=l.arg,d=c.value;return d&&"object"==typeof d&&n.call(d,"__await")?t.resolve(d.u).then((function(e){r("next",e,i,s)}),(function(e){r("throw",e,i,s)})):t.resolve(d).then((function(e){c.value=e,i(c)}),(function(e){return r("throw",e,i,s)}))}s(l.arg)}var o;this._invoke=function(e,n){function a(){return new t((function(t,o){r(e,n,t,o)}))}return o=o?o.then(a,a):a()}}function A(e,r){var n=e.iterator[r.method];if(n===t){if(r.delegate=null,"throw"===r.method){if(e.iterator.return&&(r.method="return",r.arg=t,A(e,r),"throw"===r.method))return m;r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method")}return m}var o=p(n,e.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,m;var a=o.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,m):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,m)}function E(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function O(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function C(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(E,this),this.reset(!0)}function T(e){if(e){var r=e[a];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}return{next:j}}function j(){return{value:t,done:!0}}return y.prototype=v,l(k,"constructor",v),l(v,"constructor",y),y.displayName=l(v,s,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===y||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,v):(e.__proto__=v,l(e,s,"GeneratorFunction")),e.prototype=Object.create(k),e},e.awrap=function(e){return{u:e}},$(S.prototype),l(S.prototype,i,(function(){return this})),e.AsyncIterator=S,e.async=function(t,r,n,o,a){void 0===a&&(a=Promise);var i=new S(c(t,r,n,o),a);return e.isGeneratorFunction(r)?i:i.next().then((function(e){return e.done?e.value:i.next()}))},$(k),l(k,s,"Generator"),l(k,a,(function(){return this})),l(k,"toString",(function(){return"[object Generator]"})),e.keys=function(e){var t=[];for(var r in e)t.push(r);return t.reverse(),function r(){for(;t.length;){var n=t.pop();if(n in e)return r.value=n,r.done=!1,r}return r.done=!0,r}},e.values=T,C.prototype={constructor:C,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(O),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return s.type="throw",s.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],s=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var l=n.call(i,"catchLoc"),c=n.call(i,"finallyLoc");if(l&&c){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(l){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===e||"continue"===e)&&a.tryLoc<=t&&t<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=e,i.arg=t,a?(this.method="next",this.next=a.finallyLoc,m):this.complete(i)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),m},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),O(r),m}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var o=n.arg;O(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:T(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),m}},e}(e.exports);try{regeneratorRuntime=t}catch(e){"object"==typeof globalThis?globalThis.regeneratorRuntime=t:Function("r","regeneratorRuntime = r")(t)}}(jv);const Iv=dt({exports:{}}.exports=jv.exports);var Pv=Wo.includes;Co({target:"Array",proto:!0},{includes:function(e){return Pv(this,e,arguments.length>1?arguments[1]:void 0)}});var _v=ic("Array").includes,Rv=Co,Lv=Kd,Bv=Yt,Fv=wa,Dv=Zd,zv=Et("".indexOf);Rv({target:"String",proto:!0,forced:!Dv("includes")},{includes:function(e){return!!~zv(Fv(Bv(this)),Fv(Lv(e)),arguments.length>1?arguments[1]:void 0)}});var qv=ic("String").includes,Nv=cr,Uv=_v,Mv=qv,Hv=Array.prototype,Wv=String.prototype;const Vv=dt({exports:{}}.exports=function(e){var t=e.includes;return e===Hv||Nv(Hv,e)&&t===Hv.includes?Uv:"string"==typeof e||e===Wv||Nv(Wv,e)&&t===Wv.includes?Mv:t});var Gv=ic("Array").entries,Kv=va,Jv=Zr,Zv=cr,Yv=Gv,Qv=Array.prototype,Xv={DOMTokenList:!0,NodeList:!0};const eb=dt({exports:{}}.exports=function(e){var t=e.entries;return e===Qv||Zv(Qv,e)&&t===Qv.entries||Jv(Xv,Kv(e))?Yv:t});const tb=dt({exports:{}}.exports=Sf);var rb=Co,nb=lr,ob=xt,ab=Et,ib=ft,sb=ht.Array,lb=nb("JSON","stringify"),cb=ab(/./.exec),pb=ab("".charAt),db=ab("".charCodeAt),ub=ab("".replace),hb=ab(1..toString),fb=/[\uD800-\uDFFF]/g,mb=/^[\uD800-\uDBFF]$/,gb=/^[\uDC00-\uDFFF]$/,yb=function(e,t,r){var n=pb(r,t-1),o=pb(r,t+1);return cb(mb,e)&&!cb(gb,o)||cb(gb,e)&&!cb(mb,n)?"\\u"+hb(db(e,0),16):e},vb=ib((function(){return'"\\udf06\\ud834"'!==lb("\udf06\ud834")||'"\\udead"'!==lb("\udead")}));lb&&rb({target:"JSON",stat:!0,forced:vb},{stringify:function(e,t,r){for(var n=0,o=arguments.length,a=sb(o);n<o;n++)a[n]=arguments[n];var i=ob(lb,null,a);return"string"==typeof i?ub(i,fb,yb):i}});var bb=nr,xb=xt;bb.JSON||(bb.JSON={stringify:JSON.stringify});const wb=dt({exports:{}}.exports=function(e,t,r){return xb(bb.JSON.stringify,null,arguments)});var kb=Rs.map;Co({target:"Array",proto:!0,forced:!nc("map")},{map:function(e){return kb(this,e,arguments.length>1?arguments[1]:void 0)}});var $b=ic("Array").map,Sb=cr,Ab=$b,Eb=Array.prototype;const Ob=dt({exports:{}}.exports=function(e){var t=e.map;return e===Eb||Sb(Eb,e)&&t===Eb.map?Ab:t});const Cb=dt({exports:{}}.exports=aa);var Tb=ic("Array").concat,jb=cr,Ib=Tb,Pb=Array.prototype;const _b=dt({exports:{}}.exports=function(e){var t=e.concat;return e===Pb||jb(Pb,e)&&t===Pb.concat?Ib:t});var Rb=Tt,Lb=Et,Bb=ra,Fb=er,Db=Lb(_t.f),zb=Lb([].push),qb=function(e){return function(t){for(var r,n=Fb(t),o=Bb(n),a=o.length,i=0,s=[];a>i;)r=o[i++],Rb&&!Db(n,r)||zb(s,e?[r,n[r]]:n[r]);return s}},Nb=[qb(!0),qb(!1)][0];Co({target:"Object",stat:!0},{entries:function(e){return Nb(e)}});var Ub=nr.Object.entries;const Mb=dt({exports:{}}.exports=Ub);const Hb=dt({exports:{}}.exports=dc);!function(){!function(e){!function(t){var r="URLSearchParams"in e,n="Symbol"in e&&"iterator"in Symbol,o="FileReader"in e&&"Blob"in e&&function(){try{return new Blob,!0}catch(e){return!1}}(),a="FormData"in e,i="ArrayBuffer"in e;if(i)var s=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],l=ArrayBuffer.isView||function(e){return e&&s.indexOf(Object.prototype.toString.call(e))>-1};function c(e){if("string"!=typeof e&&(e=String(e)),/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(e))throw new TypeError("Invalid character in header field name");return e.toLowerCase()}function p(e){return"string"!=typeof e&&(e=String(e)),e}function d(e){var t={next:function(){var t=e.shift();return{done:void 0===t,value:t}}};return n&&(t[Symbol.iterator]=function(){return t}),t}function u(e){this.map={},e instanceof u?e.forEach((function(e,t){this.append(t,e)}),this):Array.isArray(e)?e.forEach((function(e){this.append(e[0],e[1])}),this):e&&Object.getOwnPropertyNames(e).forEach((function(t){this.append(t,e[t])}),this)}function h(e){if(e.bodyUsed)return Promise.reject(new TypeError("Already read"));e.bodyUsed=!0}function f(e){return new Promise((function(t,r){e.onload=function(){t(e.result)},e.onerror=function(){r(e.error)}}))}function m(e){var t=new FileReader,r=f(t);return t.readAsArrayBuffer(e),r}function g(e){if(e.slice)return e.slice(0);var t=new Uint8Array(e.byteLength);return t.set(new Uint8Array(e)),t.buffer}function y(){return this.bodyUsed=!1,this._initBody=function(e){var t;this._bodyInit=e,e?"string"==typeof e?this._bodyText=e:o&&Blob.prototype.isPrototypeOf(e)?this._bodyBlob=e:a&&FormData.prototype.isPrototypeOf(e)?this._bodyFormData=e:r&&URLSearchParams.prototype.isPrototypeOf(e)?this._bodyText=e.toString():i&&o&&(t=e)&&DataView.prototype.isPrototypeOf(t)?(this._bodyArrayBuffer=g(e.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):i&&(ArrayBuffer.prototype.isPrototypeOf(e)||l(e))?this._bodyArrayBuffer=g(e):this._bodyText=e=Object.prototype.toString.call(e):this._bodyText="",this.headers.get("content-type")||("string"==typeof e?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):r&&URLSearchParams.prototype.isPrototypeOf(e)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},o&&(this.blob=function(){var e=h(this);if(e)return e;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?h(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(m)}),this.text=function(){var e,t,r,n=h(this);if(n)return n;if(this._bodyBlob)return e=this._bodyBlob,t=new FileReader,r=f(t),t.readAsText(e),r;if(this._bodyArrayBuffer)return Promise.resolve(function(e){for(var t=new Uint8Array(e),r=new Array(t.length),n=0;n<t.length;n++)r[n]=String.fromCharCode(t[n]);return r.join("")}(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},a&&(this.formData=function(){return this.text().then(x)}),this.json=function(){return this.text().then(JSON.parse)},this}u.prototype.append=function(e,t){e=c(e),t=p(t);var r=this.map[e];this.map[e]=r?r+", "+t:t},u.prototype.delete=function(e){delete this.map[c(e)]},u.prototype.get=function(e){return e=c(e),this.has(e)?this.map[e]:null},u.prototype.has=function(e){return this.map.hasOwnProperty(c(e))},u.prototype.set=function(e,t){this.map[c(e)]=p(t)},u.prototype.forEach=function(e,t){for(var r in this.map)this.map.hasOwnProperty(r)&&e.call(t,this.map[r],r,this)},u.prototype.keys=function(){var e=[];return this.forEach((function(t,r){e.push(r)})),d(e)},u.prototype.values=function(){var e=[];return this.forEach((function(t){e.push(t)})),d(e)},u.prototype.entries=function(){var e=[];return this.forEach((function(t,r){e.push([r,t])})),d(e)},n&&(u.prototype[Symbol.iterator]=u.prototype.entries);var v=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];function b(e,t){var r,n,o=(t=t||{}).body;if(e instanceof b){if(e.bodyUsed)throw new TypeError("Already read");this.url=e.url,this.credentials=e.credentials,t.headers||(this.headers=new u(e.headers)),this.method=e.method,this.mode=e.mode,this.signal=e.signal,o||null==e._bodyInit||(o=e._bodyInit,e.bodyUsed=!0)}else this.url=String(e);if(this.credentials=t.credentials||this.credentials||"same-origin",!t.headers&&this.headers||(this.headers=new u(t.headers)),this.method=(r=t.method||this.method||"GET",n=r.toUpperCase(),v.indexOf(n)>-1?n:r),this.mode=t.mode||this.mode||null,this.signal=t.signal||this.signal,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&o)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(o)}function x(e){var t=new FormData;return e.trim().split("&").forEach((function(e){if(e){var r=e.split("="),n=r.shift().replace(/\+/g," "),o=r.join("=").replace(/\+/g," ");t.append(decodeURIComponent(n),decodeURIComponent(o))}})),t}function w(e,t){t||(t={}),this.type="default",this.status=void 0===t.status?200:t.status,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in t?t.statusText:"OK",this.headers=new u(t.headers),this.url=t.url||"",this._initBody(e)}b.prototype.clone=function(){return new b(this,{body:this._bodyInit})},y.call(b.prototype),y.call(w.prototype),w.prototype.clone=function(){return new w(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new u(this.headers),url:this.url})},w.error=function(){var e=new w(null,{status:0,statusText:""});return e.type="error",e};var k=[301,302,303,307,308];w.redirect=function(e,t){if(-1===k.indexOf(t))throw new RangeError("Invalid status code");return new w(null,{status:t,headers:{location:e}})},t.DOMException=e.DOMException;try{new t.DOMException}catch(e){t.DOMException=function(e,t){this.message=e,this.name=t;var r=Error(e);this.stack=r.stack},t.DOMException.prototype=Object.create(Error.prototype),t.DOMException.prototype.constructor=t.DOMException}function $(e,r){return new Promise((function(n,a){var i=new b(e,r);if(i.signal&&i.signal.aborted)return a(new t.DOMException("Aborted","AbortError"));var s=new XMLHttpRequest;function l(){s.abort()}s.onload=function(){var e,t,r={status:s.status,statusText:s.statusText,headers:(e=s.getAllResponseHeaders()||"",t=new u,e.replace(/\r?\n[\t ]+/g," ").split(/\r?\n/).forEach((function(e){var r=e.split(":"),n=r.shift().trim();if(n){var o=r.join(":").trim();t.append(n,o)}})),t)};r.url="responseURL"in s?s.responseURL:r.headers.get("X-Request-URL");var o="response"in s?s.response:s.responseText;n(new w(o,r))},s.onerror=function(){a(new TypeError("Network request failed"))},s.ontimeout=function(){a(new TypeError("Network request failed"))},s.onabort=function(){a(new t.DOMException("Aborted","AbortError"))},s.open(i.method,i.url,!0),"include"===i.credentials?s.withCredentials=!0:"omit"===i.credentials&&(s.withCredentials=!1),"responseType"in s&&o&&(s.responseType="blob"),i.headers.forEach((function(e,t){s.setRequestHeader(t,e)})),i.signal&&(i.signal.addEventListener("abort",l),s.onreadystatechange=function(){4===s.readyState&&i.signal.removeEventListener("abort",l)}),s.send(void 0===i._bodyInit?null:i._bodyInit)}))}$.polyfill=!0,e.fetch||(e.fetch=$,e.Headers=u,e.Request=b,e.Response=w),t.Headers=u,t.Request=b,t.Response=w,t.fetch=$,Object.defineProperty(t,"t",{value:!0})}({})}("undefined"!=typeof self?self:this)}();var Wb="undefined"!=typeof Symbol&&Symbol,Vb="Function.prototype.bind called on incompatible ",Gb=Array.prototype.slice,Kb=Object.prototype.toString,Jb=Function.prototype.bind||function(e){var t=this;if("function"!=typeof t||"[object Function]"!==Kb.call(t))throw new TypeError(Vb+t);for(var r,n=Gb.call(arguments,1),o=function(){if(this instanceof r){var o=t.apply(this,n.concat(Gb.call(arguments)));return Object(o)===o?o:this}return t.apply(e,n.concat(Gb.call(arguments)))},a=Math.max(0,t.length-n.length),i=[],s=0;s<a;s++)i.push("$"+s);if(r=Function("binder","return function ("+i.join(",")+"){ return binder.apply(this,arguments); }")(o),t.prototype){var l=function(){};l.prototype=t.prototype,r.prototype=new l,l.prototype=null}return r},Zb=Jb.call(Function.call,Object.prototype.hasOwnProperty),Yb=SyntaxError,Qb=Function,Xb=TypeError,ex=function(e){try{return Qb('"use strict"; return ('+e+").constructor;")()}catch(e){}},tx=Object.getOwnPropertyDescriptor;if(tx)try{tx({},"")}catch(e){tx=null}var rx=function(){throw new Xb},nx=tx?function(){try{return rx}catch(e){try{return tx(arguments,"callee").get}catch(e){return rx}}}():rx,ox="function"==typeof Wb&&"function"==typeof Symbol&&"symbol"==typeof Wb("foo")&&"symbol"==typeof Symbol("bar")&&function(){if("function"!=typeof Symbol||"function"!=typeof Object.getOwnPropertySymbols)return!1;if("symbol"==typeof Symbol.iterator)return!0;var e={},t=Symbol("test"),r=Object(t);if("string"==typeof t)return!1;if("[object Symbol]"!==Object.prototype.toString.call(t))return!1;if("[object Symbol]"!==Object.prototype.toString.call(r))return!1;for(t in e[t]=42,e)return!1;if("function"==typeof Object.keys&&0!==Object.keys(e).length)return!1;if("function"==typeof Object.getOwnPropertyNames&&0!==Object.getOwnPropertyNames(e).length)return!1;var n=Object.getOwnPropertySymbols(e);if(1!==n.length||n[0]!==t)return!1;if(!Object.prototype.propertyIsEnumerable.call(e,t))return!1;if("function"==typeof Object.getOwnPropertyDescriptor){var o=Object.getOwnPropertyDescriptor(e,t);if(42!==o.value||!0!==o.enumerable)return!1}return!0}(),ax=Object.getPrototypeOf||function(e){return e.__proto__},ix={},sx="undefined"==typeof Uint8Array?void 0:ax(Uint8Array),lx={"%AggregateError%":"undefined"==typeof AggregateError?void 0:AggregateError,"%Array%":Array,"%ArrayBuffer%":"undefined"==typeof ArrayBuffer?void 0:ArrayBuffer,"%ArrayIteratorPrototype%":ox?ax([][Symbol.iterator]()):void 0,"%AsyncFromSyncIteratorPrototype%":void 0,"%AsyncFunction%":ix,"%AsyncGenerator%":ix,"%AsyncGeneratorFunction%":ix,"%AsyncIteratorPrototype%":ix,"%Atomics%":"undefined"==typeof Atomics?void 0:Atomics,"%BigInt%":"undefined"==typeof BigInt?void 0:BigInt,"%Boolean%":Boolean,"%DataView%":"undefined"==typeof DataView?void 0:DataView,"%Date%":Date,"%decodeURI%":decodeURI,"%decodeURIComponent%":decodeURIComponent,"%encodeURI%":encodeURI,"%encodeURIComponent%":encodeURIComponent,"%Error%":Error,"%eval%":eval,"%EvalError%":EvalError,"%Float32Array%":"undefined"==typeof Float32Array?void 0:Float32Array,"%Float64Array%":"undefined"==typeof Float64Array?void 0:Float64Array,"%FinalizationRegistry%":"undefined"==typeof FinalizationRegistry?void 0:FinalizationRegistry,"%Function%":Qb,"%GeneratorFunction%":ix,"%Int8Array%":"undefined"==typeof Int8Array?void 0:Int8Array,"%Int16Array%":"undefined"==typeof Int16Array?void 0:Int16Array,"%Int32Array%":"undefined"==typeof Int32Array?void 0:Int32Array,"%isFinite%":isFinite,"%isNaN%":isNaN,"%IteratorPrototype%":ox?ax(ax([][Symbol.iterator]())):void 0,"%JSON%":"object"==typeof JSON?JSON:void 0,"%Map%":"undefined"==typeof Map?void 0:Map,"%MapIteratorPrototype%":"undefined"!=typeof Map&&ox?ax((new Map)[Symbol.iterator]()):void 0,"%Math%":Math,"%Number%":Number,"%Object%":Object,"%parseFloat%":parseFloat,"%parseInt%":parseInt,"%Promise%":"undefined"==typeof Promise?void 0:Promise,"%Proxy%":"undefined"==typeof Proxy?void 0:Proxy,"%RangeError%":RangeError,"%ReferenceError%":ReferenceError,"%Reflect%":"undefined"==typeof Reflect?void 0:Reflect,"%RegExp%":RegExp,"%Set%":"undefined"==typeof Set?void 0:Set,"%SetIteratorPrototype%":"undefined"!=typeof Set&&ox?ax((new Set)[Symbol.iterator]()):void 0,"%SharedArrayBuffer%":"undefined"==typeof SharedArrayBuffer?void 0:SharedArrayBuffer,"%String%":String,"%StringIteratorPrototype%":ox?ax(""[Symbol.iterator]()):void 0,"%Symbol%":ox?Symbol:void 0,"%SyntaxError%":Yb,"%ThrowTypeError%":nx,"%TypedArray%":sx,"%TypeError%":Xb,"%Uint8Array%":"undefined"==typeof Uint8Array?void 0:Uint8Array,"%Uint8ClampedArray%":"undefined"==typeof Uint8ClampedArray?void 0:Uint8ClampedArray,"%Uint16Array%":"undefined"==typeof Uint16Array?void 0:Uint16Array,"%Uint32Array%":"undefined"==typeof Uint32Array?void 0:Uint32Array,"%URIError%":URIError,"%WeakMap%":"undefined"==typeof WeakMap?void 0:WeakMap,"%WeakRef%":"undefined"==typeof WeakRef?void 0:WeakRef,"%WeakSet%":"undefined"==typeof WeakSet?void 0:WeakSet},cx=function e(t){var r;if("%AsyncFunction%"===t)r=ex("async function () {}");else if("%GeneratorFunction%"===t)r=ex("function* () {}");else if("%AsyncGeneratorFunction%"===t)r=ex("async function* () {}");else if("%AsyncGenerator%"===t){var n=e("%AsyncGeneratorFunction%");n&&(r=n.prototype)}else if("%AsyncIteratorPrototype%"===t){var o=e("%AsyncGenerator%");o&&(r=ax(o.prototype))}return lx[t]=r,r},px={"%ArrayBufferPrototype%":["ArrayBuffer","prototype"],"%ArrayPrototype%":["Array","prototype"],"%ArrayProto_entries%":["Array","prototype","entries"],"%ArrayProto_forEach%":["Array","prototype","forEach"],"%ArrayProto_keys%":["Array","prototype","keys"],"%ArrayProto_values%":["Array","prototype","values"],"%AsyncFunctionPrototype%":["AsyncFunction","prototype"],"%AsyncGenerator%":["AsyncGeneratorFunction","prototype"],"%AsyncGeneratorPrototype%":["AsyncGeneratorFunction","prototype","prototype"],"%BooleanPrototype%":["Boolean","prototype"],"%DataViewPrototype%":["DataView","prototype"],"%DatePrototype%":["Date","prototype"],"%ErrorPrototype%":["Error","prototype"],"%EvalErrorPrototype%":["EvalError","prototype"],"%Float32ArrayPrototype%":["Float32Array","prototype"],"%Float64ArrayPrototype%":["Float64Array","prototype"],"%FunctionPrototype%":["Function","prototype"],"%Generator%":["GeneratorFunction","prototype"],"%GeneratorPrototype%":["GeneratorFunction","prototype","prototype"],"%Int8ArrayPrototype%":["Int8Array","prototype"],"%Int16ArrayPrototype%":["Int16Array","prototype"],"%Int32ArrayPrototype%":["Int32Array","prototype"],"%JSONParse%":["JSON","parse"],"%JSONStringify%":["JSON","stringify"],"%MapPrototype%":["Map","prototype"],"%NumberPrototype%":["Number","prototype"],"%ObjectPrototype%":["Object","prototype"],"%ObjProto_toString%":["Object","prototype","toString"],"%ObjProto_valueOf%":["Object","prototype","valueOf"],"%PromisePrototype%":["Promise","prototype"],"%PromiseProto_then%":["Promise","prototype","then"],"%Promise_all%":["Promise","all"],"%Promise_reject%":["Promise","reject"],"%Promise_resolve%":["Promise","resolve"],"%RangeErrorPrototype%":["RangeError","prototype"],"%ReferenceErrorPrototype%":["ReferenceError","prototype"],"%RegExpPrototype%":["RegExp","prototype"],"%SetPrototype%":["Set","prototype"],"%SharedArrayBufferPrototype%":["SharedArrayBuffer","prototype"],"%StringPrototype%":["String","prototype"],"%SymbolPrototype%":["Symbol","prototype"],"%SyntaxErrorPrototype%":["SyntaxError","prototype"],"%TypedArrayPrototype%":["TypedArray","prototype"],"%TypeErrorPrototype%":["TypeError","prototype"],"%Uint8ArrayPrototype%":["Uint8Array","prototype"],"%Uint8ClampedArrayPrototype%":["Uint8ClampedArray","prototype"],"%Uint16ArrayPrototype%":["Uint16Array","prototype"],"%Uint32ArrayPrototype%":["Uint32Array","prototype"],"%URIErrorPrototype%":["URIError","prototype"],"%WeakMapPrototype%":["WeakMap","prototype"],"%WeakSetPrototype%":["WeakSet","prototype"]},dx=Jb,ux=Zb,hx=dx.call(Function.call,Array.prototype.concat),fx=dx.call(Function.apply,Array.prototype.splice),mx=dx.call(Function.call,String.prototype.replace),gx=dx.call(Function.call,String.prototype.slice),yx=/[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g,vx=/\\(\\)?/g,bx=function(e){var t=gx(e,0,1),r=gx(e,-1);if("%"===t&&"%"!==r)throw new Yb("invalid intrinsic syntax, expected closing `%`");if("%"===r&&"%"!==t)throw new Yb("invalid intrinsic syntax, expected opening `%`");var n=[];return mx(e,yx,(function(e,t,r,o){n[n.length]=r?mx(o,vx,"$1"):t||e})),n},xx=function(e,t){var r,n=e;if(ux(px,n)&&(n="%"+(r=px[n])[0]+"%"),ux(lx,n)){var o=lx[n];if(o===ix&&(o=cx(n)),void 0===o&&!t)throw new Xb("intrinsic "+e+" exists, but is not available. Please file an issue!");return{alias:r,name:n,value:o}}throw new Yb("intrinsic "+e+" does not exist!")},wx=function(e,t){if("string"!=typeof e||0===e.length)throw new Xb("intrinsic name must be a non-empty string");if(arguments.length>1&&"boolean"!=typeof t)throw new Xb('"allowMissing" argument must be a boolean');var r=bx(e),n=r.length>0?r[0]:"",o=xx("%"+n+"%",t),a=o.name,i=o.value,s=!1,l=o.alias;l&&(n=l[0],fx(r,hx([0,1],l)));for(var c=1,p=!0;c<r.length;c+=1){var d=r[c],u=gx(d,0,1),h=gx(d,-1);if(('"'===u||"'"===u||"`"===u||'"'===h||"'"===h||"`"===h)&&u!==h)throw new Yb("property names with quotes must have matching quotes");if("constructor"!==d&&p||(s=!0),ux(lx,a="%"+(n+="."+d)+"%"))i=lx[a];else if(null!=i){if(!(d in i)){if(!t)throw new Xb("base intrinsic for "+e+" exists, but the property is not available.");return}if(tx&&c+1>=r.length){var f=tx(i,d);i=(p=!!f)&&"get"in f&&!("originalValue"in f.get)?f.get:i[d]}else p=ux(i,d),i=i[d];p&&!s&&(lx[a]=i)}}return i},kx={exports:{}};!function(e){var t=Jb,r=wx,n=r("%Function.prototype.apply%"),o=r("%Function.prototype.call%"),a=r("%Reflect.apply%",!0)||t.call(o,n),i=r("%Object.getOwnPropertyDescriptor%",!0),s=r("%Object.defineProperty%",!0),l=r("%Math.max%");if(s)try{s({},"a",{value:1})}catch(e){s=null}e.exports=function(e){var r=a(t,o,arguments);if(i&&s){var n=i(r,"length");n.configurable&&s(r,"length",{value:1+l(0,e.length-(arguments.length-1))})}return r};var c=function(){return a(t,n,arguments)};s?s(e.exports,"apply",{value:c}):e.exports.apply=c}(kx);var $x=wx,Sx=kx.exports,Ax=Sx($x("String.prototype.indexOf"));const Ex=function(e){var t=e.default;if("function"==typeof t){var r=function(){return t.apply(this,arguments)};r.prototype=t.prototype}else r={};return Object.defineProperty(r,"t",{value:!0}),Object.keys(e).forEach((function(t){var n=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(r,t,n.get?n:{enumerable:!0,get:function(){return e[t]}})})),r}(Object.freeze(Object.defineProperty({__proto__:null,default:{}},Symbol.toStringTag,{value:"Module"})));var Ox="function"==typeof Map&&Map.prototype,Cx=Object.getOwnPropertyDescriptor&&Ox?Object.getOwnPropertyDescriptor(Map.prototype,"size"):null,Tx=Ox&&Cx&&"function"==typeof Cx.get?Cx.get:null,jx=Ox&&Map.prototype.forEach,Ix="function"==typeof Set&&Set.prototype,Px=Object.getOwnPropertyDescriptor&&Ix?Object.getOwnPropertyDescriptor(Set.prototype,"size"):null,_x=Ix&&Px&&"function"==typeof Px.get?Px.get:null,Rx=Ix&&Set.prototype.forEach,Lx="function"==typeof WeakMap&&WeakMap.prototype?WeakMap.prototype.has:null,Bx="function"==typeof WeakSet&&WeakSet.prototype?WeakSet.prototype.has:null,Fx="function"==typeof WeakRef&&WeakRef.prototype?WeakRef.prototype.deref:null,Dx=Boolean.prototype.valueOf,zx=Object.prototype.toString,qx=Function.prototype.toString,Nx=String.prototype.match,Ux=String.prototype.slice,Mx=String.prototype.replace,Hx=String.prototype.toUpperCase,Wx=String.prototype.toLowerCase,Vx=RegExp.prototype.test,Gx=Array.prototype.concat,Kx=Array.prototype.join,Jx=Array.prototype.slice,Zx=Math.floor,Yx="function"==typeof BigInt?BigInt.prototype.valueOf:null,Qx=Object.getOwnPropertySymbols,Xx="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?Symbol.prototype.toString:null,ew="function"==typeof Symbol&&"object"==typeof Symbol.iterator,tw="function"==typeof Symbol&&Symbol.toStringTag&&(Symbol.toStringTag,1)?Symbol.toStringTag:null,rw=Object.prototype.propertyIsEnumerable,nw=("function"==typeof Reflect?Reflect.getPrototypeOf:Object.getPrototypeOf)||([].__proto__===Array.prototype?function(e){return e.__proto__}:null);function ow(e,t){if(e===1/0||e===-1/0||e!=e||e&&e>-1e3&&e<1e3||Vx.call(/e/,t))return t;var r=/[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;if("number"==typeof e){var n=e<0?-Zx(-e):Zx(e);if(n!==e){var o=String(n),a=Ux.call(t,o.length+1);return Mx.call(o,r,"$&_")+"."+Mx.call(Mx.call(a,/([0-9]{3})/g,"$&_"),/_$/,"")}}return Mx.call(t,r,"$&_")}var aw=Ex.custom,iw=aw&&pw(aw)?aw:null;function sw(e,t,r){var n="double"===(r.quoteStyle||t)?'"':"'";return n+e+n}function lw(e){return Mx.call(String(e),/"/g,"&quot;")}function cw(e){return!("[object Array]"!==hw(e)||tw&&"object"==typeof e&&tw in e)}function pw(e){if(ew)return e&&"object"==typeof e&&e instanceof Symbol;if("symbol"==typeof e)return!0;if(!e||"object"!=typeof e||!Xx)return!1;try{return Xx.call(e),!0}catch(e){}return!1}var dw=Object.prototype.hasOwnProperty||function(e){return e in this};function uw(e,t){return dw.call(e,t)}function hw(e){return zx.call(e)}function fw(e,t){if(e.indexOf)return e.indexOf(t);for(var r=0,n=e.length;r<n;r++)if(e[r]===t)return r;return-1}function mw(e,t){if(e.length>t.maxStringLength){var r=e.length-t.maxStringLength,n="... "+r+" more character"+(r>1?"s":"");return mw(Ux.call(e,0,t.maxStringLength),t)+n}return sw(Mx.call(Mx.call(e,/(['\\])/g,"\\$1"),/[\x00-\x1f]/g,gw),"single",t)}function gw(e){var t=e.charCodeAt(0),r={8:"b",9:"t",10:"n",12:"f",13:"r"}[t];return r?"\\"+r:"\\x"+(t<16?"0":"")+Hx.call(t.toString(16))}function yw(e){return"Object("+e+")"}function vw(e){return e+" { ? }"}function bw(e,t,r,n){return e+" ("+t+") {"+(n?xw(r,n):Kx.call(r,", "))+"}"}function xw(e,t){if(0===e.length)return"";var r="\n"+t.prev+t.base;return r+Kx.call(e,","+r)+"\n"+t.prev}function ww(e,t){var r=cw(e),n=[];if(r){n.length=e.length;for(var o=0;o<e.length;o++)n[o]=uw(e,o)?t(e[o],e):""}var a,i="function"==typeof Qx?Qx(e):[];if(ew){a={};for(var s=0;s<i.length;s++)a["$"+i[s]]=i[s]}for(var l in e)uw(e,l)&&(r&&String(Number(l))===l&&l<e.length||ew&&a["$"+l]instanceof Symbol||(Vx.call(/[^\w$]/,l)?n.push(t(l,e)+": "+t(e[l],e)):n.push(l+": "+t(e[l],e))));if("function"==typeof Qx)for(var c=0;c<i.length;c++)rw.call(e,i[c])&&n.push("["+t(i[c])+"]: "+t(e[i[c]],e));return n}var kw=wx,$w=function(e,t){var r=$x(e,!!t);return"function"==typeof r&&Ax(e,".prototype.")>-1?Sx(r):r},Sw=function e(t,r,n,o){var a=r||{};if(uw(a,"quoteStyle")&&"single"!==a.quoteStyle&&"double"!==a.quoteStyle)throw new TypeError('option "quoteStyle" must be "single" or "double"');if(uw(a,"maxStringLength")&&("number"==typeof a.maxStringLength?a.maxStringLength<0&&a.maxStringLength!==1/0:null!==a.maxStringLength))throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');var i=!uw(a,"customInspect")||a.customInspect;if("boolean"!=typeof i&&"symbol"!==i)throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");if(uw(a,"indent")&&null!==a.indent&&"\t"!==a.indent&&!(parseInt(a.indent,10)===a.indent&&a.indent>0))throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');if(uw(a,"numericSeparator")&&"boolean"!=typeof a.numericSeparator)throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');var s=a.numericSeparator;if(void 0===t)return"undefined";if(null===t)return"null";if("boolean"==typeof t)return t?"true":"false";if("string"==typeof t)return mw(t,a);if("number"==typeof t){if(0===t)return 1/0/t>0?"0":"-0";var l=String(t);return s?ow(t,l):l}if("bigint"==typeof t){var c=String(t)+"n";return s?ow(t,c):c}var p=void 0===a.depth?5:a.depth;if(void 0===n&&(n=0),n>=p&&p>0&&"object"==typeof t)return cw(t)?"[Array]":"[Object]";var d=function(e,t){var r;if("\t"===e.indent)r="\t";else{if(!("number"==typeof e.indent&&e.indent>0))return null;r=Kx.call(Array(e.indent+1)," ")}return{base:r,prev:Kx.call(Array(t+1),r)}}(a,n);if(void 0===o)o=[];else if(fw(o,t)>=0)return"[Circular]";function u(t,r,i){if(r&&(o=Jx.call(o)).push(r),i){var s={depth:a.depth};return uw(a,"quoteStyle")&&(s.quoteStyle=a.quoteStyle),e(t,s,n+1,o)}return e(t,a,n+1,o)}if("function"==typeof t){var h=function(e){if(e.name)return e.name;var t=Nx.call(qx.call(e),/^function\s*([\w$]+)/);return t?t[1]:null}(t),f=ww(t,u);return"[Function"+(h?": "+h:" (anonymous)")+"]"+(f.length>0?" { "+Kx.call(f,", ")+" }":"")}if(pw(t)){var m=ew?Mx.call(String(t),/^(Symbol\(.*\))_[^)]*$/,"$1"):Xx.call(t);return"object"!=typeof t||ew?m:yw(m)}if(function(e){return!(!e||"object"!=typeof e)&&("undefined"!=typeof HTMLElement&&e instanceof HTMLElement||"string"==typeof e.nodeName&&"function"==typeof e.getAttribute)}(t)){for(var g="<"+Wx.call(String(t.nodeName)),y=t.attributes||[],v=0;v<y.length;v++)g+=" "+y[v].name+"="+sw(lw(y[v].value),"double",a);return g+=">",t.childNodes&&t.childNodes.length&&(g+="..."),g+"</"+Wx.call(String(t.nodeName))+">"}if(cw(t)){if(0===t.length)return"[]";var b=ww(t,u);return d&&!function(e){for(var t=0;t<e.length;t++)if(fw(e[t],"\n")>=0)return!1;return!0}(b)?"["+xw(b,d)+"]":"[ "+Kx.call(b,", ")+" ]"}if(function(e){return!("[object Error]"!==hw(e)||tw&&"object"==typeof e&&tw in e)}(t)){var x=ww(t,u);return"cause"in t&&!rw.call(t,"cause")?"{ ["+String(t)+"] "+Kx.call(Gx.call("[cause]: "+u(t.cause),x),", ")+" }":0===x.length?"["+String(t)+"]":"{ ["+String(t)+"] "+Kx.call(x,", ")+" }"}if("object"==typeof t&&i){if(iw&&"function"==typeof t[iw])return t[iw]();if("symbol"!==i&&"function"==typeof t.inspect)return t.inspect()}if(function(e){if(!Tx||!e||"object"!=typeof e)return!1;try{Tx.call(e);try{_x.call(e)}catch(e){return!0}return e instanceof Map}catch(e){}return!1}(t)){var w=[];return jx.call(t,(function(e,r){w.push(u(r,t,!0)+" => "+u(e,t))})),bw("Map",Tx.call(t),w,d)}if(function(e){if(!_x||!e||"object"!=typeof e)return!1;try{_x.call(e);try{Tx.call(e)}catch(e){return!0}return e instanceof Set}catch(e){}return!1}(t)){var k=[];return Rx.call(t,(function(e){k.push(u(e,t))})),bw("Set",_x.call(t),k,d)}if(function(e){if(!Lx||!e||"object"!=typeof e)return!1;try{Lx.call(e,Lx);try{Bx.call(e,Bx)}catch(e){return!0}return e instanceof WeakMap}catch(e){}return!1}(t))return vw("WeakMap");if(function(e){if(!Bx||!e||"object"!=typeof e)return!1;try{Bx.call(e,Bx);try{Lx.call(e,Lx)}catch(e){return!0}return e instanceof WeakSet}catch(e){}return!1}(t))return vw("WeakSet");if(function(e){if(!Fx||!e||"object"!=typeof e)return!1;try{return Fx.call(e),!0}catch(e){}return!1}(t))return vw("WeakRef");if(function(e){return!("[object Number]"!==hw(e)||tw&&"object"==typeof e&&tw in e)}(t))return yw(u(Number(t)));if(function(e){if(!e||"object"!=typeof e||!Yx)return!1;try{return Yx.call(e),!0}catch(e){}return!1}(t))return yw(u(Yx.call(t)));if(function(e){return!("[object Boolean]"!==hw(e)||tw&&"object"==typeof e&&tw in e)}(t))return yw(Dx.call(t));if(function(e){return!("[object String]"!==hw(e)||tw&&"object"==typeof e&&tw in e)}(t))return yw(u(String(t)));if(!function(e){return!("[object Date]"!==hw(e)||tw&&"object"==typeof e&&tw in e)}(t)&&!function(e){return!("[object RegExp]"!==hw(e)||tw&&"object"==typeof e&&tw in e)}(t)){var $=ww(t,u),S=nw?nw(t)===Object.prototype:t instanceof Object||t.constructor===Object,A=t instanceof Object?"":"null prototype",E=!S&&tw&&Object(t)===t&&tw in t?Ux.call(hw(t),8,-1):A?"Object":"",O=(S||"function"!=typeof t.constructor?"":t.constructor.name?t.constructor.name+" ":"")+(E||A?"["+Kx.call(Gx.call([],E||[],A||[]),": ")+"] ":"");return 0===$.length?O+"{}":d?O+"{"+xw($,d)+"}":O+"{ "+Kx.call($,", ")+" }"}return String(t)},Aw=kw("%TypeError%"),Ew=kw("%WeakMap%",!0),Ow=kw("%Map%",!0),Cw=$w("WeakMap.prototype.get",!0),Tw=$w("WeakMap.prototype.set",!0),jw=$w("WeakMap.prototype.has",!0),Iw=$w("Map.prototype.get",!0),Pw=$w("Map.prototype.set",!0),_w=$w("Map.prototype.has",!0),Rw=function(e,t){for(var r,n=e;null!==(r=n.next);n=r)if(r.key===t)return n.next=r.next,r.next=e.next,e.next=r,r},Lw=String.prototype.replace,Bw=/%20/g,Fw="RFC3986",Dw={default:Fw,formatters:{RFC1738:function(e){return Lw.call(e,Bw,"+")},RFC3986:function(e){return String(e)}},RFC1738:"RFC1738",RFC3986:Fw},zw=Dw,qw=Object.prototype.hasOwnProperty,Nw=Array.isArray,Uw=function(){for(var e=[],t=0;t<256;++t)e.push("%"+((t<16?"0":"")+t.toString(16)).toUpperCase());return e}(),Mw=function(e,t){for(var r=t&&t.plainObjects?Object.create(null):{},n=0;n<e.length;++n)void 0!==e[n]&&(r[n]=e[n]);return r},Hw={arrayToObject:Mw,assign:function(e,t){return Object.keys(t).reduce((function(e,r){return e[r]=t[r],e}),e)},combine:function(e,t){return[].concat(e,t)},compact:function(e){for(var t=[{obj:{o:e},prop:"o"}],r=[],n=0;n<t.length;++n)for(var o=t[n],a=o.obj[o.prop],i=Object.keys(a),s=0;s<i.length;++s){var l=i[s],c=a[l];"object"==typeof c&&null!==c&&-1===r.indexOf(c)&&(t.push({obj:a,prop:l}),r.push(c))}return function(e){for(;e.length>1;){var t=e.pop(),r=t.obj[t.prop];if(Nw(r)){for(var n=[],o=0;o<r.length;++o)void 0!==r[o]&&n.push(r[o]);t.obj[t.prop]=n}}}(t),e},decode:function(e,t,r){var n=e.replace(/\+/g," ");if("iso-8859-1"===r)return n.replace(/%[0-9a-f]{2}/gi,unescape);try{return decodeURIComponent(n)}catch(e){return n}},encode:function(e,t,r,n,o){if(0===e.length)return e;var a=e;if("symbol"==typeof e?a=Symbol.prototype.toString.call(e):"string"!=typeof e&&(a=String(e)),"iso-8859-1"===r)return escape(a).replace(/%u[0-9a-f]{4}/gi,(function(e){return"%26%23"+parseInt(e.slice(2),16)+"%3B"}));for(var i="",s=0;s<a.length;++s){var l=a.charCodeAt(s);45===l||46===l||95===l||126===l||l>=48&&l<=57||l>=65&&l<=90||l>=97&&l<=122||o===zw.RFC1738&&(40===l||41===l)?i+=a.charAt(s):l<128?i+=Uw[l]:l<2048?i+=Uw[192|l>>6]+Uw[128|63&l]:l<55296||l>=57344?i+=Uw[224|l>>12]+Uw[128|l>>6&63]+Uw[128|63&l]:(s+=1,l=65536+((1023&l)<<10|1023&a.charCodeAt(s)),i+=Uw[240|l>>18]+Uw[128|l>>12&63]+Uw[128|l>>6&63]+Uw[128|63&l])}return i},isBuffer:function(e){return!(!e||"object"!=typeof e||!(e.constructor&&e.constructor.isBuffer&&e.constructor.isBuffer(e)))},isRegExp:function(e){return"[object RegExp]"===Object.prototype.toString.call(e)},maybeMap:function(e,t){if(Nw(e)){for(var r=[],n=0;n<e.length;n+=1)r.push(t(e[n]));return r}return t(e)},merge:function e(t,r,n){if(!r)return t;if("object"!=typeof r){if(Nw(t))t.push(r);else{if(!t||"object"!=typeof t)return[t,r];(n&&(n.plainObjects||n.allowPrototypes)||!qw.call(Object.prototype,r))&&(t[r]=!0)}return t}if(!t||"object"!=typeof t)return[t].concat(r);var o=t;return Nw(t)&&!Nw(r)&&(o=Mw(t,n)),Nw(t)&&Nw(r)?(r.forEach((function(r,o){if(qw.call(t,o)){var a=t[o];a&&"object"==typeof a&&r&&"object"==typeof r?t[o]=e(a,r,n):t.push(r)}else t[o]=r})),t):Object.keys(r).reduce((function(t,o){var a=r[o];return qw.call(t,o)?t[o]=e(t[o],a,n):t[o]=a,t}),o)}},Ww=function(){var e,t,r,n={assert:function(e){if(!n.has(e))throw new Aw("Side channel does not contain "+Sw(e))},get:function(n){if(Ew&&n&&("object"==typeof n||"function"==typeof n)){if(e)return Cw(e,n)}else if(Ow){if(t)return Iw(t,n)}else if(r)return(o=Rw(r,n))&&o.value;var o},has:function(n){if(Ew&&n&&("object"==typeof n||"function"==typeof n)){if(e)return jw(e,n)}else if(Ow){if(t)return _w(t,n)}else if(r)return!!Rw(r,n);return!1},set:function(n,o){var a,i,s,l;Ew&&n&&("object"==typeof n||"function"==typeof n)?(e||(e=new Ew),Tw(e,n,o)):Ow?(t||(t=new Ow),Pw(t,n,o)):(r||(r={key:{},next:null}),s=o,(l=Rw(a=r,i=n))?l.value=s:a.next={key:i,next:a.next,value:s})}};return n},Vw=Hw,Gw=Dw,Kw=Object.prototype.hasOwnProperty,Jw={brackets:function(e){return e+"[]"},comma:"comma",indices:function(e,t){return e+"["+t+"]"},repeat:function(e){return e}},Zw=Array.isArray,Yw=String.prototype.split,Qw=Array.prototype.push,Xw=function(e,t){Qw.apply(e,Zw(t)?t:[t])},ek=Date.prototype.toISOString,tk=Gw.default,rk={addQueryPrefix:!1,allowDots:!1,charset:"utf-8",charsetSentinel:!1,delimiter:"&",encode:!0,encoder:Vw.encode,encodeValuesOnly:!1,format:tk,formatter:Gw.formatters[tk],indices:!1,serializeDate:function(e){return ek.call(e)},skipNulls:!1,strictNullHandling:!1},nk={},ok=function e(t,r,n,o,a,i,s,l,c,p,d,u,h,f,m){for(var g,y=t,v=m,b=0,x=!1;void 0!==(v=v.get(nk))&&!x;){var w=v.get(t);if(b+=1,void 0!==w){if(w===b)throw new RangeError("Cyclic object value");x=!0}void 0===v.get(nk)&&(b=0)}if("function"==typeof s?y=s(r,y):y instanceof Date?y=p(y):"comma"===n&&Zw(y)&&(y=Vw.maybeMap(y,(function(e){return e instanceof Date?p(e):e}))),null===y){if(o)return i&&!h?i(r,rk.encoder,f,"key",d):r;y=""}if("string"==typeof(g=y)||"number"==typeof g||"boolean"==typeof g||"symbol"==typeof g||"bigint"==typeof g||Vw.isBuffer(y)){if(i){var k=h?r:i(r,rk.encoder,f,"key",d);if("comma"===n&&h){for(var $=Yw.call(String(y),","),S="",A=0;A<$.length;++A)S+=(0===A?"":",")+u(i($[A],rk.encoder,f,"value",d));return[u(k)+"="+S]}return[u(k)+"="+u(i(y,rk.encoder,f,"value",d))]}return[u(r)+"="+u(String(y))]}var E,O=[];if(void 0===y)return O;if("comma"===n&&Zw(y))E=[{value:y.length>0?y.join(",")||null:void 0}];else if(Zw(s))E=s;else{var C=Object.keys(y);E=l?C.sort(l):C}for(var T=0;T<E.length;++T){var j=E[T],I="object"==typeof j&&void 0!==j.value?j.value:y[j];if(!a||null!==I){var P=Zw(y)?"function"==typeof n?n(r,j):r:r+(c?"."+j:"["+j+"]");m.set(t,b);var _=Ww();_.set(nk,m),Xw(O,e(I,P,n,o,a,i,s,l,c,p,d,u,h,f,_))}}return O},ak=Hw,ik=Object.prototype.hasOwnProperty,sk=Array.isArray,lk={allowDots:!1,allowPrototypes:!1,allowSparse:!1,arrayLimit:20,charset:"utf-8",charsetSentinel:!1,comma:!1,decoder:ak.decode,delimiter:"&",depth:5,ignoreQueryPrefix:!1,interpretNumericEntities:!1,parameterLimit:1e3,parseArrays:!0,plainObjects:!1,strictNullHandling:!1},ck=function(e){return e.replace(/&#(\d+);/g,(function(e,t){return String.fromCharCode(parseInt(t,10))}))},pk=function(e,t){return e&&"string"==typeof e&&t.comma&&e.indexOf(",")>-1?e.split(","):e},dk=function(e,t,r,n){if(e){var o=r.allowDots?e.replace(/\.([^.[]+)/g,"[$1]"):e,a=/(\[[^[\]]*])/g,i=r.depth>0&&/(\[[^[\]]*])/.exec(o),s=i?o.slice(0,i.index):o,l=[];if(s){if(!r.plainObjects&&ik.call(Object.prototype,s)&&!r.allowPrototypes)return;l.push(s)}for(var c=0;r.depth>0&&null!==(i=a.exec(o))&&c<r.depth;){if(c+=1,!r.plainObjects&&ik.call(Object.prototype,i[1].slice(1,-1))&&!r.allowPrototypes)return;l.push(i[1])}return i&&l.push("["+o.slice(i.index)+"]"),function(e,t,r,n){for(var o=n?t:pk(t,r),a=e.length-1;a>=0;--a){var i,s=e[a];if("[]"===s&&r.parseArrays)i=[].concat(o);else{i=r.plainObjects?Object.create(null):{};var l="["===s.charAt(0)&&"]"===s.charAt(s.length-1)?s.slice(1,-1):s,c=parseInt(l,10);r.parseArrays||""!==l?!isNaN(c)&&s!==l&&String(c)===l&&c>=0&&r.parseArrays&&c<=r.arrayLimit?(i=[])[c]=o:"__proto__"!==l&&(i[l]=o):i={0:o}}o=i}return o}(l,t,r,n)}},uk=function(e,t){var r=function(e){if(!e)return lk;if(null!==e.decoder&&void 0!==e.decoder&&"function"!=typeof e.decoder)throw new TypeError("Decoder has to be a function.");if(void 0!==e.charset&&"utf-8"!==e.charset&&"iso-8859-1"!==e.charset)throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");var t=void 0===e.charset?lk.charset:e.charset;return{allowDots:void 0===e.allowDots?lk.allowDots:!!e.allowDots,allowPrototypes:"boolean"==typeof e.allowPrototypes?e.allowPrototypes:lk.allowPrototypes,allowSparse:"boolean"==typeof e.allowSparse?e.allowSparse:lk.allowSparse,arrayLimit:"number"==typeof e.arrayLimit?e.arrayLimit:lk.arrayLimit,charset:t,charsetSentinel:"boolean"==typeof e.charsetSentinel?e.charsetSentinel:lk.charsetSentinel,comma:"boolean"==typeof e.comma?e.comma:lk.comma,decoder:"function"==typeof e.decoder?e.decoder:lk.decoder,delimiter:"string"==typeof e.delimiter||ak.isRegExp(e.delimiter)?e.delimiter:lk.delimiter,depth:"number"==typeof e.depth||!1===e.depth?+e.depth:lk.depth,ignoreQueryPrefix:!0===e.ignoreQueryPrefix,interpretNumericEntities:"boolean"==typeof e.interpretNumericEntities?e.interpretNumericEntities:lk.interpretNumericEntities,parameterLimit:"number"==typeof e.parameterLimit?e.parameterLimit:lk.parameterLimit,parseArrays:!1!==e.parseArrays,plainObjects:"boolean"==typeof e.plainObjects?e.plainObjects:lk.plainObjects,strictNullHandling:"boolean"==typeof e.strictNullHandling?e.strictNullHandling:lk.strictNullHandling}}(t);if(""===e||null==e)return r.plainObjects?Object.create(null):{};for(var n="string"==typeof e?function(e,t){var r,n={},o=t.ignoreQueryPrefix?e.replace(/^\?/,""):e,a=t.parameterLimit===1/0?void 0:t.parameterLimit,i=o.split(t.delimiter,a),s=-1,l=t.charset;if(t.charsetSentinel)for(r=0;r<i.length;++r)0===i[r].indexOf("utf8=")&&("utf8=%E2%9C%93"===i[r]?l="utf-8":"utf8=%26%2310003%3B"===i[r]&&(l="iso-8859-1"),s=r,r=i.length);for(r=0;r<i.length;++r)if(r!==s){var c,p,d=i[r],u=d.indexOf("]="),h=-1===u?d.indexOf("="):u+1;-1===h?(c=t.decoder(d,lk.decoder,l,"key"),p=t.strictNullHandling?null:""):(c=t.decoder(d.slice(0,h),lk.decoder,l,"key"),p=ak.maybeMap(pk(d.slice(h+1),t),(function(e){return t.decoder(e,lk.decoder,l,"value")}))),p&&t.interpretNumericEntities&&"iso-8859-1"===l&&(p=ck(p)),d.indexOf("[]=")>-1&&(p=sk(p)?[p]:p),ik.call(n,c)?n[c]=ak.combine(n[c],p):n[c]=p}return n}(e,r):e,o=r.plainObjects?Object.create(null):{},a=Object.keys(n),i=0;i<a.length;++i){var s=a[i],l=dk(s,n[s],r,"string"==typeof e);o=ak.merge(o,l,r)}return!0===r.allowSparse?o:ak.compact(o)},hk=function(e,t){var r,n=e,o=function(e){if(!e)return rk;if(null!==e.encoder&&void 0!==e.encoder&&"function"!=typeof e.encoder)throw new TypeError("Encoder has to be a function.");var t=e.charset||rk.charset;if(void 0!==e.charset&&"utf-8"!==e.charset&&"iso-8859-1"!==e.charset)throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");var r=Gw.default;if(void 0!==e.format){if(!Kw.call(Gw.formatters,e.format))throw new TypeError("Unknown format option provided.");r=e.format}var n=Gw.formatters[r],o=rk.filter;return("function"==typeof e.filter||Zw(e.filter))&&(o=e.filter),{addQueryPrefix:"boolean"==typeof e.addQueryPrefix?e.addQueryPrefix:rk.addQueryPrefix,allowDots:void 0===e.allowDots?rk.allowDots:!!e.allowDots,charset:t,charsetSentinel:"boolean"==typeof e.charsetSentinel?e.charsetSentinel:rk.charsetSentinel,delimiter:void 0===e.delimiter?rk.delimiter:e.delimiter,encode:"boolean"==typeof e.encode?e.encode:rk.encode,encoder:"function"==typeof e.encoder?e.encoder:rk.encoder,encodeValuesOnly:"boolean"==typeof e.encodeValuesOnly?e.encodeValuesOnly:rk.encodeValuesOnly,filter:o,format:r,formatter:n,serializeDate:"function"==typeof e.serializeDate?e.serializeDate:rk.serializeDate,skipNulls:"boolean"==typeof e.skipNulls?e.skipNulls:rk.skipNulls,sort:"function"==typeof e.sort?e.sort:null,strictNullHandling:"boolean"==typeof e.strictNullHandling?e.strictNullHandling:rk.strictNullHandling}}(t);"function"==typeof o.filter?n=(0,o.filter)("",n):Zw(o.filter)&&(r=o.filter);var a,i=[];if("object"!=typeof n||null===n)return"";a=t&&t.arrayFormat in Jw?t.arrayFormat:t&&"indices"in t?t.indices?"indices":"repeat":"indices";var s=Jw[a];r||(r=Object.keys(n)),o.sort&&r.sort(o.sort);for(var l=Ww(),c=0;c<r.length;++c){var p=r[c];o.skipNulls&&null===n[p]||Xw(i,ok(n[p],p,s,o.strictNullHandling,o.skipNulls,o.encode?o.encoder:null,o.filter,o.sort,o.allowDots,o.serializeDate,o.format,o.formatter,o.encodeValuesOnly,o.charset,l))}var d=i.join(o.delimiter),u=!0===o.addQueryPrefix?"?":"";return o.charsetSentinel&&("iso-8859-1"===o.charset?u+="utf8=%26%2310003%3B&":u+="utf8=%E2%9C%93&"),d.length>0?u+d:""};function fk(e){return null==e}var mk={isNothing:fk,isObject:function(e){return"object"==typeof e&&null!==e},toArray:function(e){return Array.isArray(e)?e:fk(e)?[]:[e]},repeat:function(e,t){var r,n="";for(r=0;r<t;r+=1)n+=e;return n},isNegativeZero:function(e){return 0===e&&Number.NEGATIVE_INFINITY===1/e},extend:function(e,t){var r,n,o,a;if(t)for(r=0,n=(a=Object.keys(t)).length;r<n;r+=1)e[o=a[r]]=t[o];return e}};function gk(e,t){var r="",n=e.reason||"(unknown reason)";return e.mark?(e.mark.name&&(r+='in "'+e.mark.name+'" '),r+="("+(e.mark.line+1)+":"+(e.mark.column+1)+")",!t&&e.mark.snippet&&(r+="\n\n"+e.mark.snippet),n+" "+r):n}function yk(e,t){Error.call(this),this.name="YAMLException",this.reason=e,this.mark=t,this.message=gk(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack||""}yk.prototype=Object.create(Error.prototype),yk.prototype.constructor=yk,yk.prototype.toString=function(e){return this.name+": "+gk(this,e)};var vk=yk;function bk(e,t,r,n,o){var a="",i="",s=Math.floor(o/2)-1;return n-t>s&&(t=n-s+(a=" ... ").length),r-n>s&&(r=n+s-(i=" ...").length),{str:a+e.slice(t,r).replace(/\t/g,"→")+i,pos:n-t+a.length}}function xk(e,t){return mk.repeat(" ",t-e.length)+e}var wk=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],kk=["scalar","sequence","mapping"],$k=function(e,t){if(t=t||{},Object.keys(t).forEach((function(t){if(-1===wk.indexOf(t))throw new vk('Unknown option "'+t+'" is met in definition of "'+e+'" YAML type.')})),this.options=t,this.tag=e,this.kind=t.kind||null,this.resolve=t.resolve||function(){return!0},this.construct=t.construct||function(e){return e},this.instanceOf=t.instanceOf||null,this.predicate=t.predicate||null,this.represent=t.represent||null,this.representName=t.representName||null,this.defaultStyle=t.defaultStyle||null,this.multi=t.multi||!1,this.styleAliases=(r=t.styleAliases||null,n={},null!==r&&Object.keys(r).forEach((function(e){r[e].forEach((function(t){n[String(t)]=e}))})),n),-1===kk.indexOf(this.kind))throw new vk('Unknown kind "'+this.kind+'" is specified for "'+e+'" YAML type.');var r,n};function Sk(e,t){var r=[];return e[t].forEach((function(e){var t=r.length;r.forEach((function(r,n){r.tag===e.tag&&r.kind===e.kind&&r.multi===e.multi&&(t=n)})),r[t]=e})),r}function Ak(e){return this.extend(e)}Ak.prototype.extend=function(e){var t=[],r=[];if(e instanceof $k)r.push(e);else if(Array.isArray(e))r=r.concat(e);else{if(!e||!Array.isArray(e.implicit)&&!Array.isArray(e.explicit))throw new vk("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");e.implicit&&(t=t.concat(e.implicit)),e.explicit&&(r=r.concat(e.explicit))}t.forEach((function(e){if(!(e instanceof $k))throw new vk("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(e.loadKind&&"scalar"!==e.loadKind)throw new vk("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(e.multi)throw new vk("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")})),r.forEach((function(e){if(!(e instanceof $k))throw new vk("Specified list of YAML types (or a single Type object) contains a non-Type object.")}));var n=Object.create(Ak.prototype);return n.implicit=(this.implicit||[]).concat(t),n.explicit=(this.explicit||[]).concat(r),n.compiledImplicit=Sk(n,"implicit"),n.compiledExplicit=Sk(n,"explicit"),n.compiledTypeMap=function(){var e,t,r={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}};function n(e){e.multi?(r.multi[e.kind].push(e),r.multi.fallback.push(e)):r[e.kind][e.tag]=r.fallback[e.tag]=e}for(e=0,t=arguments.length;e<t;e+=1)arguments[e].forEach(n);return r}(n.compiledImplicit,n.compiledExplicit),n};var Ek=Ak,Ok=new $k("tag:yaml.org,2002:str",{kind:"scalar",construct:function(e){return null!==e?e:""}}),Ck=new $k("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return null!==e?e:[]}}),Tk=new $k("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return null!==e?e:{}}}),jk=new Ek({explicit:[Ok,Ck,Tk]}),Ik=new $k("tag:yaml.org,2002:null",{kind:"scalar",resolve:function(e){if(null===e)return!0;var t=e.length;return 1===t&&"~"===e||4===t&&("null"===e||"Null"===e||"NULL"===e)},construct:function(){return null},predicate:function(e){return null===e},represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"}),Pk=new $k("tag:yaml.org,2002:bool",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t=e.length;return 4===t&&("true"===e||"True"===e||"TRUE"===e)||5===t&&("false"===e||"False"===e||"FALSE"===e)},construct:function(e){return"true"===e||"True"===e||"TRUE"===e},predicate:function(e){return"[object Boolean]"===Object.prototype.toString.call(e)},represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"});function _k(e){return 48<=e&&e<=55}function Rk(e){return 48<=e&&e<=57}var Lk=new $k("tag:yaml.org,2002:int",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t,r,n=e.length,o=0,a=!1;if(!n)return!1;if("-"!==(t=e[o])&&"+"!==t||(t=e[++o]),"0"===t){if(o+1===n)return!0;if("b"===(t=e[++o])){for(o++;o<n;o++)if("_"!==(t=e[o])){if("0"!==t&&"1"!==t)return!1;a=!0}return a&&"_"!==t}if("x"===t){for(o++;o<n;o++)if("_"!==(t=e[o])){if(!(48<=(r=e.charCodeAt(o))&&r<=57||65<=r&&r<=70||97<=r&&r<=102))return!1;a=!0}return a&&"_"!==t}if("o"===t){for(o++;o<n;o++)if("_"!==(t=e[o])){if(!_k(e.charCodeAt(o)))return!1;a=!0}return a&&"_"!==t}}if("_"===t)return!1;for(;o<n;o++)if("_"!==(t=e[o])){if(!Rk(e.charCodeAt(o)))return!1;a=!0}return!(!a||"_"===t)},construct:function(e){var t,r=e,n=1;if(-1!==r.indexOf("_")&&(r=r.replace(/_/g,"")),"-"!==(t=r[0])&&"+"!==t||("-"===t&&(n=-1),t=(r=r.slice(1))[0]),"0"===r)return 0;if("0"===t){if("b"===r[1])return n*parseInt(r.slice(2),2);if("x"===r[1])return n*parseInt(r.slice(2),16);if("o"===r[1])return n*parseInt(r.slice(2),8)}return n*parseInt(r,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&e%1==0&&!mk.isNegativeZero(e)},represent:{binary:function(e){return e>=0?"0b"+e.toString(2):"-0b"+e.toString(2).slice(1)},octal:function(e){return e>=0?"0o"+e.toString(8):"-0o"+e.toString(8).slice(1)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return e>=0?"0x"+e.toString(16).toUpperCase():"-0x"+e.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),Bk=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),Fk=/^[-+]?[0-9]+e/,Dk=new $k("tag:yaml.org,2002:float",{kind:"scalar",resolve:function(e){return null!==e&&!(!Bk.test(e)||"_"===e[e.length-1])},construct:function(e){var t,r;return r="-"===(t=e.replace(/_/g,"").toLowerCase())[0]?-1:1,"+-".indexOf(t[0])>=0&&(t=t.slice(1)),".inf"===t?1===r?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:".nan"===t?NaN:r*parseFloat(t,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&(e%1!=0||mk.isNegativeZero(e))},represent:function(e,t){var r;if(isNaN(e))switch(t){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===e)switch(t){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===e)switch(t){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(mk.isNegativeZero(e))return"-0.0";return r=e.toString(10),Fk.test(r)?r.replace("e",".e"):r},defaultStyle:"lowercase"}),zk=jk.extend({implicit:[Ik,Pk,Lk,Dk]}),qk=zk,Nk=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),Uk=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"),Mk=new $k("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:function(e){return null!==e&&(null!==Nk.exec(e)||null!==Uk.exec(e))},construct:function(e){var t,r,n,o,a,i,s,l,c=0,p=null;if(null===(t=Nk.exec(e))&&(t=Uk.exec(e)),null===t)throw new Error("Date resolve error");if(r=+t[1],n=+t[2]-1,o=+t[3],!t[4])return new Date(Date.UTC(r,n,o));if(a=+t[4],i=+t[5],s=+t[6],t[7]){for(c=t[7].slice(0,3);c.length<3;)c+="0";c=+c}return t[9]&&(p=6e4*(60*+t[10]+ +(t[11]||0)),"-"===t[9]&&(p=-p)),l=new Date(Date.UTC(r,n,o,a,i,s,c)),p&&l.setTime(l.getTime()-p),l},instanceOf:Date,represent:function(e){return e.toISOString()}}),Hk=new $k("tag:yaml.org,2002:merge",{kind:"scalar",resolve:function(e){return"<<"===e||null===e}}),Wk="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r",Vk=new $k("tag:yaml.org,2002:binary",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t,r,n=0,o=e.length,a=Wk;for(r=0;r<o;r++)if(!((t=a.indexOf(e.charAt(r)))>64)){if(t<0)return!1;n+=6}return n%8==0},construct:function(e){var t,r,n=e.replace(/[\r\n=]/g,""),o=n.length,a=Wk,i=0,s=[];for(t=0;t<o;t++)t%4==0&&t&&(s.push(i>>16&255),s.push(i>>8&255),s.push(255&i)),i=i<<6|a.indexOf(n.charAt(t));return 0==(r=o%4*6)?(s.push(i>>16&255),s.push(i>>8&255),s.push(255&i)):18===r?(s.push(i>>10&255),s.push(i>>2&255)):12===r&&s.push(i>>4&255),new Uint8Array(s)},predicate:function(e){return"[object Uint8Array]"===Object.prototype.toString.call(e)},represent:function(e){var t,r,n="",o=0,a=e.length,i=Wk;for(t=0;t<a;t++)t%3==0&&t&&(n+=i[o>>18&63],n+=i[o>>12&63],n+=i[o>>6&63],n+=i[63&o]),o=(o<<8)+e[t];return 0==(r=a%3)?(n+=i[o>>18&63],n+=i[o>>12&63],n+=i[o>>6&63],n+=i[63&o]):2===r?(n+=i[o>>10&63],n+=i[o>>4&63],n+=i[o<<2&63],n+=i[64]):1===r&&(n+=i[o>>2&63],n+=i[o<<4&63],n+=i[64],n+=i[64]),n}}),Gk=Object.prototype.hasOwnProperty,Kk=Object.prototype.toString,Jk=new $k("tag:yaml.org,2002:omap",{kind:"sequence",resolve:function(e){if(null===e)return!0;var t,r,n,o,a,i=[],s=e;for(t=0,r=s.length;t<r;t+=1){if(n=s[t],a=!1,"[object Object]"!==Kk.call(n))return!1;for(o in n)if(Gk.call(n,o)){if(a)return!1;a=!0}if(!a)return!1;if(-1!==i.indexOf(o))return!1;i.push(o)}return!0},construct:function(e){return null!==e?e:[]}}),Zk=Object.prototype.toString,Yk=new $k("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:function(e){if(null===e)return!0;var t,r,n,o,a,i=e;for(a=new Array(i.length),t=0,r=i.length;t<r;t+=1){if(n=i[t],"[object Object]"!==Zk.call(n))return!1;if(1!==(o=Object.keys(n)).length)return!1;a[t]=[o[0],n[o[0]]]}return!0},construct:function(e){if(null===e)return[];var t,r,n,o,a,i=e;for(a=new Array(i.length),t=0,r=i.length;t<r;t+=1)n=i[t],o=Object.keys(n),a[t]=[o[0],n[o[0]]];return a}}),Qk=Object.prototype.hasOwnProperty,Xk=new $k("tag:yaml.org,2002:set",{kind:"mapping",resolve:function(e){if(null===e)return!0;var t,r=e;for(t in r)if(Qk.call(r,t)&&null!==r[t])return!1;return!0},construct:function(e){return null!==e?e:{}}}),e$=qk.extend({implicit:[Mk,Hk],explicit:[Vk,Jk,Yk,Xk]}),t$=Object.prototype.hasOwnProperty,r$=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,n$=/[\x85\u2028\u2029]/,o$=/[,\[\]\{\}]/,a$=/^(?:!|!!|![a-z\-]+!)$/i,i$=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function s$(e){return Object.prototype.toString.call(e)}function l$(e){return 10===e||13===e}function c$(e){return 9===e||32===e}function p$(e){return 9===e||32===e||10===e||13===e}function d$(e){return 44===e||91===e||93===e||123===e||125===e}function u$(e){var t;return 48<=e&&e<=57?e-48:97<=(t=32|e)&&t<=102?t-97+10:-1}function h$(e){return 48===e?"\0":97===e?"":98===e?"\b":116===e||9===e?"\t":110===e?"\n":118===e?"\v":102===e?"\f":114===e?"\r":101===e?"":32===e?" ":34===e?'"':47===e?"/":92===e?"\\":78===e?"":95===e?" ":76===e?"\u2028":80===e?"\u2029":""}function f$(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10),56320+(e-65536&1023))}for(var m$=new Array(256),g$=new Array(256),y$=0;y$<256;y$++)m$[y$]=h$(y$)?1:0,g$[y$]=h$(y$);function v$(e,t){this.input=e,this.filename=t.filename||null,this.schema=t.schema||e$,this.onWarning=t.onWarning||null,this.legacy=t.legacy||!1,this.json=t.json||!1,this.listener=t.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function b$(e,t){var r={name:e.filename,buffer:e.input.slice(0,-1),position:e.position,line:e.line,column:e.position-e.lineStart};return r.snippet=function(e,t){if(t=Object.create(t||null),!e.buffer)return null;t.maxLength||(t.maxLength=79),"number"!=typeof t.indent&&(t.indent=1),"number"!=typeof t.linesBefore&&(t.linesBefore=3),"number"!=typeof t.linesAfter&&(t.linesAfter=2);for(var r,n=/\r?\n|\r|\0/g,o=[0],a=[],i=-1;r=n.exec(e.buffer);)a.push(r.index),o.push(r.index+r[0].length),e.position<=r.index&&i<0&&(i=o.length-2);i<0&&(i=o.length-1);var s,l,c="",p=Math.min(e.line+t.linesAfter,a.length).toString().length,d=t.maxLength-(t.indent+p+3);for(s=1;s<=t.linesBefore&&!(i-s<0);s++)l=bk(e.buffer,o[i-s],a[i-s],e.position-(o[i]-o[i-s]),d),c=mk.repeat(" ",t.indent)+xk((e.line-s+1).toString(),p)+" | "+l.str+"\n"+c;for(l=bk(e.buffer,o[i],a[i],e.position,d),c+=mk.repeat(" ",t.indent)+xk((e.line+1).toString(),p)+" | "+l.str+"\n",c+=mk.repeat("-",t.indent+p+3+l.pos)+"^\n",s=1;s<=t.linesAfter&&!(i+s>=a.length);s++)l=bk(e.buffer,o[i+s],a[i+s],e.position-(o[i]-o[i+s]),d),c+=mk.repeat(" ",t.indent)+xk((e.line+s+1).toString(),p)+" | "+l.str+"\n";return c.replace(/\n$/,"")}(r),new vk(t,r)}function x$(e,t){throw b$(e,t)}function w$(e,t){e.onWarning&&e.onWarning.call(null,b$(e,t))}var k$={YAML:function(e,t,r){var n,o,a;null!==e.version&&x$(e,"duplication of %YAML directive"),1!==r.length&&x$(e,"YAML directive accepts exactly one argument"),null===(n=/^([0-9]+)\.([0-9]+)$/.exec(r[0]))&&x$(e,"ill-formed argument of the YAML directive"),o=parseInt(n[1],10),a=parseInt(n[2],10),1!==o&&x$(e,"unacceptable YAML version of the document"),e.version=r[0],e.checkLineBreaks=a<2,1!==a&&2!==a&&w$(e,"unsupported YAML version of the document")},TAG:function(e,t,r){var n,o;2!==r.length&&x$(e,"TAG directive accepts exactly two arguments"),n=r[0],o=r[1],a$.test(n)||x$(e,"ill-formed tag handle (first argument) of the TAG directive"),t$.call(e.tagMap,n)&&x$(e,'there is a previously declared suffix for "'+n+'" tag handle'),i$.test(o)||x$(e,"ill-formed tag prefix (second argument) of the TAG directive");try{o=decodeURIComponent(o)}catch(t){x$(e,"tag prefix is malformed: "+o)}e.tagMap[n]=o}};function $$(e,t,r,n){var o,a,i,s;if(t<r){if(s=e.input.slice(t,r),n)for(o=0,a=s.length;o<a;o+=1)9===(i=s.charCodeAt(o))||32<=i&&i<=1114111||x$(e,"expected valid JSON character");else r$.test(s)&&x$(e,"the stream contains non-printable characters");e.result+=s}}function S$(e,t,r,n){var o,a,i,s;for(mk.isObject(r)||x$(e,"cannot merge mappings; the provided source object is unacceptable"),i=0,s=(o=Object.keys(r)).length;i<s;i+=1)a=o[i],t$.call(t,a)||(t[a]=r[a],n[a]=!0)}function A$(e,t,r,n,o,a,i,s,l){var c,p;if(Array.isArray(o))for(c=0,p=(o=Array.prototype.slice.call(o)).length;c<p;c+=1)Array.isArray(o[c])&&x$(e,"nested arrays are not supported inside keys"),"object"==typeof o&&"[object Object]"===s$(o[c])&&(o[c]="[object Object]");if("object"==typeof o&&"[object Object]"===s$(o)&&(o="[object Object]"),o=String(o),null===t&&(t={}),"tag:yaml.org,2002:merge"===n)if(Array.isArray(a))for(c=0,p=a.length;c<p;c+=1)S$(e,t,a[c],r);else S$(e,t,a,r);else e.json||t$.call(r,o)||!t$.call(t,o)||(e.line=i||e.line,e.lineStart=s||e.lineStart,e.position=l||e.position,x$(e,"duplicated mapping key")),"__proto__"===o?Object.defineProperty(t,o,{configurable:!0,enumerable:!0,writable:!0,value:a}):t[o]=a,delete r[o];return t}function E$(e){var t;10===(t=e.input.charCodeAt(e.position))?e.position++:13===t?(e.position++,10===e.input.charCodeAt(e.position)&&e.position++):x$(e,"a line break is expected"),e.line+=1,e.lineStart=e.position,e.firstTabInLine=-1}function O$(e,t,r){for(var n=0,o=e.input.charCodeAt(e.position);0!==o;){for(;c$(o);)9===o&&-1===e.firstTabInLine&&(e.firstTabInLine=e.position),o=e.input.charCodeAt(++e.position);if(t&&35===o)do{o=e.input.charCodeAt(++e.position)}while(10!==o&&13!==o&&0!==o);if(!l$(o))break;for(E$(e),o=e.input.charCodeAt(e.position),n++,e.lineIndent=0;32===o;)e.lineIndent++,o=e.input.charCodeAt(++e.position)}return-1!==r&&0!==n&&e.lineIndent<r&&w$(e,"deficient indentation"),n}function C$(e){var t,r=e.position;return!(45!==(t=e.input.charCodeAt(r))&&46!==t||t!==e.input.charCodeAt(r+1)||t!==e.input.charCodeAt(r+2)||(r+=3,0!==(t=e.input.charCodeAt(r))&&!p$(t)))}function T$(e,t){1===t?e.result+=" ":t>1&&(e.result+=mk.repeat("\n",t-1))}function j$(e,t){var r,n,o=e.tag,a=e.anchor,i=[],s=!1;if(-1!==e.firstTabInLine)return!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=i),n=e.input.charCodeAt(e.position);0!==n&&(-1!==e.firstTabInLine&&(e.position=e.firstTabInLine,x$(e,"tab characters must not be used in indentation")),45===n)&&p$(e.input.charCodeAt(e.position+1));)if(s=!0,e.position++,O$(e,!0,-1)&&e.lineIndent<=t)i.push(null),n=e.input.charCodeAt(e.position);else if(r=e.line,_$(e,t,3,!1,!0),i.push(e.result),O$(e,!0,-1),n=e.input.charCodeAt(e.position),(e.line===r||e.lineIndent>t)&&0!==n)x$(e,"bad indentation of a sequence entry");else if(e.lineIndent<t)break;return!!s&&(e.tag=o,e.anchor=a,e.kind="sequence",e.result=i,!0)}function I$(e){var t,r,n,o,a=!1,i=!1;if(33!==(o=e.input.charCodeAt(e.position)))return!1;if(null!==e.tag&&x$(e,"duplication of a tag property"),60===(o=e.input.charCodeAt(++e.position))?(a=!0,o=e.input.charCodeAt(++e.position)):33===o?(i=!0,r="!!",o=e.input.charCodeAt(++e.position)):r="!",t=e.position,a){do{o=e.input.charCodeAt(++e.position)}while(0!==o&&62!==o);e.position<e.length?(n=e.input.slice(t,e.position),o=e.input.charCodeAt(++e.position)):x$(e,"unexpected end of the stream within a verbatim tag")}else{for(;0!==o&&!p$(o);)33===o&&(i?x$(e,"tag suffix cannot contain exclamation marks"):(r=e.input.slice(t-1,e.position+1),a$.test(r)||x$(e,"named tag handle cannot contain such characters"),i=!0,t=e.position+1)),o=e.input.charCodeAt(++e.position);n=e.input.slice(t,e.position),o$.test(n)&&x$(e,"tag suffix cannot contain flow indicator characters")}n&&!i$.test(n)&&x$(e,"tag name cannot contain such characters: "+n);try{n=decodeURIComponent(n)}catch(t){x$(e,"tag name is malformed: "+n)}return a?e.tag=n:t$.call(e.tagMap,r)?e.tag=e.tagMap[r]+n:"!"===r?e.tag="!"+n:"!!"===r?e.tag="tag:yaml.org,2002:"+n:x$(e,'undeclared tag handle "'+r+'"'),!0}function P$(e){var t,r;if(38!==(r=e.input.charCodeAt(e.position)))return!1;for(null!==e.anchor&&x$(e,"duplication of an anchor property"),r=e.input.charCodeAt(++e.position),t=e.position;0!==r&&!p$(r)&&!d$(r);)r=e.input.charCodeAt(++e.position);return e.position===t&&x$(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(t,e.position),!0}function _$(e,t,r,n,o){var a,i,s,l,c,p,d,u,h,f=1,m=!1,g=!1;if(null!==e.listener&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,a=i=s=4===r||3===r,n&&O$(e,!0,-1)&&(m=!0,e.lineIndent>t?f=1:e.lineIndent===t?f=0:e.lineIndent<t&&(f=-1)),1===f)for(;I$(e)||P$(e);)O$(e,!0,-1)?(m=!0,s=a,e.lineIndent>t?f=1:e.lineIndent===t?f=0:e.lineIndent<t&&(f=-1)):s=!1;if(s&&(s=m||o),1!==f&&4!==r||(u=1===r||2===r?t:t+1,h=e.position-e.lineStart,1===f?s&&(j$(e,h)||function(e,t,r){var n,o,a,i,s,l,c,p=e.tag,d=e.anchor,u={},h=Object.create(null),f=null,m=null,g=null,y=!1,v=!1;if(-1!==e.firstTabInLine)return!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=u),c=e.input.charCodeAt(e.position);0!==c;){if(y||-1===e.firstTabInLine||(e.position=e.firstTabInLine,x$(e,"tab characters must not be used in indentation")),n=e.input.charCodeAt(e.position+1),a=e.line,63!==c&&58!==c||!p$(n)){if(i=e.line,s=e.lineStart,l=e.position,!_$(e,r,2,!1,!0))break;if(e.line===a){for(c=e.input.charCodeAt(e.position);c$(c);)c=e.input.charCodeAt(++e.position);if(58===c)p$(c=e.input.charCodeAt(++e.position))||x$(e,"a whitespace character is expected after the key-value separator within a block mapping"),y&&(A$(e,u,h,f,m,null,i,s,l),f=m=g=null),v=!0,y=!1,o=!1,f=e.tag,m=e.result;else{if(!v)return e.tag=p,e.anchor=d,!0;x$(e,"can not read an implicit mapping pair; a colon is missed")}}else{if(!v)return e.tag=p,e.anchor=d,!0;x$(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else 63===c?(y&&(A$(e,u,h,f,m,null,i,s,l),f=m=g=null),v=!0,y=!0,o=!0):y?(y=!1,o=!0):x$(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,c=n;if((e.line===a||e.lineIndent>t)&&(y&&(i=e.line,s=e.lineStart,l=e.position),_$(e,t,4,!0,o)&&(y?m=e.result:g=e.result),y||(A$(e,u,h,f,m,g,i,s,l),f=m=g=null),O$(e,!0,-1),c=e.input.charCodeAt(e.position)),(e.line===a||e.lineIndent>t)&&0!==c)x$(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return y&&A$(e,u,h,f,m,null,i,s,l),v&&(e.tag=p,e.anchor=d,e.kind="mapping",e.result=u),v}(e,h,u))||function(e,t){var r,n,o,a,i,s,l,c,p,d,u,h,f=!0,m=e.tag,g=e.anchor,y=Object.create(null);if(91===(h=e.input.charCodeAt(e.position)))i=93,c=!1,a=[];else{if(123!==h)return!1;i=125,c=!0,a={}}for(null!==e.anchor&&(e.anchorMap[e.anchor]=a),h=e.input.charCodeAt(++e.position);0!==h;){if(O$(e,!0,t),(h=e.input.charCodeAt(e.position))===i)return e.position++,e.tag=m,e.anchor=g,e.kind=c?"mapping":"sequence",e.result=a,!0;f?44===h&&x$(e,"expected the node content, but found ','"):x$(e,"missed comma between flow collection entries"),u=null,s=l=!1,63===h&&p$(e.input.charCodeAt(e.position+1))&&(s=l=!0,e.position++,O$(e,!0,t)),r=e.line,n=e.lineStart,o=e.position,_$(e,t,1,!1,!0),d=e.tag,p=e.result,O$(e,!0,t),h=e.input.charCodeAt(e.position),!l&&e.line!==r||58!==h||(s=!0,h=e.input.charCodeAt(++e.position),O$(e,!0,t),_$(e,t,1,!1,!0),u=e.result),c?A$(e,a,y,d,p,u,r,n,o):s?a.push(A$(e,null,y,d,p,u,r,n,o)):a.push(p),O$(e,!0,t),44===(h=e.input.charCodeAt(e.position))?(f=!0,h=e.input.charCodeAt(++e.position)):f=!1}x$(e,"unexpected end of the stream within a flow collection")}(e,u)?g=!0:(i&&function(e,t){var r,n,o,a,i,s=1,l=!1,c=!1,p=t,d=0,u=!1;if(124===(a=e.input.charCodeAt(e.position)))n=!1;else{if(62!==a)return!1;n=!0}for(e.kind="scalar",e.result="";0!==a;)if(43===(a=e.input.charCodeAt(++e.position))||45===a)1===s?s=43===a?3:2:x$(e,"repeat of a chomping mode identifier");else{if(!((o=48<=(i=a)&&i<=57?i-48:-1)>=0))break;0===o?x$(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):c?x$(e,"repeat of an indentation width identifier"):(p=t+o-1,c=!0)}if(c$(a)){do{a=e.input.charCodeAt(++e.position)}while(c$(a));if(35===a)do{a=e.input.charCodeAt(++e.position)}while(!l$(a)&&0!==a)}for(;0!==a;){for(E$(e),e.lineIndent=0,a=e.input.charCodeAt(e.position);(!c||e.lineIndent<p)&&32===a;)e.lineIndent++,a=e.input.charCodeAt(++e.position);if(!c&&e.lineIndent>p&&(p=e.lineIndent),l$(a))d++;else{if(e.lineIndent<p){3===s?e.result+=mk.repeat("\n",l?1+d:d):1===s&&l&&(e.result+="\n");break}for(n?c$(a)?(u=!0,e.result+=mk.repeat("\n",l?1+d:d)):u?(u=!1,e.result+=mk.repeat("\n",d+1)):0===d?l&&(e.result+=" "):e.result+=mk.repeat("\n",d):e.result+=mk.repeat("\n",l?1+d:d),l=!0,c=!0,d=0,r=e.position;!l$(a)&&0!==a;)a=e.input.charCodeAt(++e.position);$$(e,r,e.position,!1)}}return!0}(e,u)||function(e,t){var r,n,o;if(39!==(r=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,n=o=e.position;0!==(r=e.input.charCodeAt(e.position));)if(39===r){if($$(e,n,e.position,!0),39!==(r=e.input.charCodeAt(++e.position)))return!0;n=e.position,e.position++,o=e.position}else l$(r)?($$(e,n,o,!0),T$(e,O$(e,!1,t)),n=o=e.position):e.position===e.lineStart&&C$(e)?x$(e,"unexpected end of the document within a single quoted scalar"):(e.position++,o=e.position);x$(e,"unexpected end of the stream within a single quoted scalar")}(e,u)||function(e,t){var r,n,o,a,i,s,l;if(34!==(s=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,r=n=e.position;0!==(s=e.input.charCodeAt(e.position));){if(34===s)return $$(e,r,e.position,!0),e.position++,!0;if(92===s){if($$(e,r,e.position,!0),l$(s=e.input.charCodeAt(++e.position)))O$(e,!1,t);else if(s<256&&m$[s])e.result+=g$[s],e.position++;else if((i=120===(l=s)?2:117===l?4:85===l?8:0)>0){for(o=i,a=0;o>0;o--)(i=u$(s=e.input.charCodeAt(++e.position)))>=0?a=(a<<4)+i:x$(e,"expected hexadecimal character");e.result+=f$(a),e.position++}else x$(e,"unknown escape sequence");r=n=e.position}else l$(s)?($$(e,r,n,!0),T$(e,O$(e,!1,t)),r=n=e.position):e.position===e.lineStart&&C$(e)?x$(e,"unexpected end of the document within a double quoted scalar"):(e.position++,n=e.position)}x$(e,"unexpected end of the stream within a double quoted scalar")}(e,u)?g=!0:function(e){var t,r,n;if(42!==(n=e.input.charCodeAt(e.position)))return!1;for(n=e.input.charCodeAt(++e.position),t=e.position;0!==n&&!p$(n)&&!d$(n);)n=e.input.charCodeAt(++e.position);return e.position===t&&x$(e,"name of an alias node must contain at least one character"),r=e.input.slice(t,e.position),t$.call(e.anchorMap,r)||x$(e,'unidentified alias "'+r+'"'),e.result=e.anchorMap[r],O$(e,!0,-1),!0}(e)?(g=!0,null===e.tag&&null===e.anchor||x$(e,"alias node should not have any properties")):function(e,t,r){var n,o,a,i,s,l,c,p,d=e.kind,u=e.result;if(p$(p=e.input.charCodeAt(e.position))||d$(p)||35===p||38===p||42===p||33===p||124===p||62===p||39===p||34===p||37===p||64===p||96===p)return!1;if((63===p||45===p)&&(p$(n=e.input.charCodeAt(e.position+1))||r&&d$(n)))return!1;for(e.kind="scalar",e.result="",o=a=e.position,i=!1;0!==p;){if(58===p){if(p$(n=e.input.charCodeAt(e.position+1))||r&&d$(n))break}else if(35===p){if(p$(e.input.charCodeAt(e.position-1)))break}else{if(e.position===e.lineStart&&C$(e)||r&&d$(p))break;if(l$(p)){if(s=e.line,l=e.lineStart,c=e.lineIndent,O$(e,!1,-1),e.lineIndent>=t){i=!0,p=e.input.charCodeAt(e.position);continue}e.position=a,e.line=s,e.lineStart=l,e.lineIndent=c;break}}i&&($$(e,o,a,!1),T$(e,e.line-s),o=a=e.position,i=!1),c$(p)||(a=e.position+1),p=e.input.charCodeAt(++e.position)}return $$(e,o,a,!1),!!e.result||(e.kind=d,e.result=u,!1)}(e,u,1===r)&&(g=!0,null===e.tag&&(e.tag="?")),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):0===f&&(g=s&&j$(e,h))),null===e.tag)null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);else if("?"===e.tag){for(null!==e.result&&"scalar"!==e.kind&&x$(e,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+e.kind+'"'),l=0,c=e.implicitTypes.length;l<c;l+=1)if((d=e.implicitTypes[l]).resolve(e.result)){e.result=d.construct(e.result),e.tag=d.tag,null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);break}}else if("!"!==e.tag){if(t$.call(e.typeMap[e.kind||"fallback"],e.tag))d=e.typeMap[e.kind||"fallback"][e.tag];else for(d=null,l=0,c=(p=e.typeMap.multi[e.kind||"fallback"]).length;l<c;l+=1)if(e.tag.slice(0,p[l].tag.length)===p[l].tag){d=p[l];break}d||x$(e,"unknown tag !<"+e.tag+">"),null!==e.result&&d.kind!==e.kind&&x$(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+d.kind+'", not "'+e.kind+'"'),d.resolve(e.result,e.tag)?(e.result=d.construct(e.result,e.tag),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):x$(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")}return null!==e.listener&&e.listener("close",e),null!==e.tag||null!==e.anchor||g}function R$(e){var t,r,n,o,a=e.position,i=!1;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap=Object.create(null),e.anchorMap=Object.create(null);0!==(o=e.input.charCodeAt(e.position))&&(O$(e,!0,-1),o=e.input.charCodeAt(e.position),!(e.lineIndent>0||37!==o));){for(i=!0,o=e.input.charCodeAt(++e.position),t=e.position;0!==o&&!p$(o);)o=e.input.charCodeAt(++e.position);for(n=[],(r=e.input.slice(t,e.position)).length<1&&x$(e,"directive name must not be less than one character in length");0!==o;){for(;c$(o);)o=e.input.charCodeAt(++e.position);if(35===o){do{o=e.input.charCodeAt(++e.position)}while(0!==o&&!l$(o));break}if(l$(o))break;for(t=e.position;0!==o&&!p$(o);)o=e.input.charCodeAt(++e.position);n.push(e.input.slice(t,e.position))}0!==o&&E$(e),t$.call(k$,r)?k$[r](e,r,n):w$(e,'unknown document directive "'+r+'"')}O$(e,!0,-1),0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)?(e.position+=3,O$(e,!0,-1)):i&&x$(e,"directives end mark is expected"),_$(e,e.lineIndent-1,4,!1,!0),O$(e,!0,-1),e.checkLineBreaks&&n$.test(e.input.slice(a,e.position))&&w$(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&C$(e)?46===e.input.charCodeAt(e.position)&&(e.position+=3,O$(e,!0,-1)):e.position<e.length-1&&x$(e,"end of the stream or a document separator is expected")}function L$(e,t){t=t||{},0!==(e=String(e)).length&&(10!==e.charCodeAt(e.length-1)&&13!==e.charCodeAt(e.length-1)&&(e+="\n"),65279===e.charCodeAt(0)&&(e=e.slice(1)));var r=new v$(e,t),n=e.indexOf("\0");for(-1!==n&&(r.position=n,x$(r,"null byte is not allowed in input")),r.input+="\0";32===r.input.charCodeAt(r.position);)r.lineIndent+=1,r.position+=1;for(;r.position<r.length-1;)R$(r);return r.documents}var B$={loadAll:function(e,t,r){null!==t&&"object"==typeof t&&void 0===r&&(r=t,t=null);var n=L$(e,r);if("function"!=typeof t)return n;for(var o=0,a=n.length;o<a;o+=1)t(n[o])},load:function(e,t){var r=L$(e,t);if(0!==r.length){if(1===r.length)return r[0];throw new vk("expected a single document in the stream, but found more")}}},F$=Object.prototype.toString,D$=Object.prototype.hasOwnProperty,z$={0:"\\0",7:"\\a",8:"\\b",9:"\\t",10:"\\n",11:"\\v",12:"\\f",13:"\\r",27:"\\e",34:'\\"',92:"\\\\",133:"\\N",160:"\\_",8232:"\\L",8233:"\\P"},q$=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],N$=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function U$(e){var t,r,n;if(t=e.toString(16).toUpperCase(),e<=255)r="x",n=2;else if(e<=65535)r="u",n=4;else{if(!(e<=4294967295))throw new vk("code point within a string may not be greater than 0xFFFFFFFF");r="U",n=8}return"\\"+r+mk.repeat("0",n-t.length)+t}function M$(e){this.schema=e.schema||e$,this.indent=Math.max(1,e.indent||2),this.noArrayIndent=e.noArrayIndent||!1,this.skipInvalid=e.skipInvalid||!1,this.flowLevel=mk.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=function(e,t){var r,n,o,a,i,s,l;if(null===t)return{};for(r={},o=0,a=(n=Object.keys(t)).length;o<a;o+=1)i=n[o],s=String(t[i]),"!!"===i.slice(0,2)&&(i="tag:yaml.org,2002:"+i.slice(2)),(l=e.compiledTypeMap.fallback[i])&&D$.call(l.styleAliases,s)&&(s=l.styleAliases[s]),r[i]=s;return r}(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.noRefs=e.noRefs||!1,this.noCompatMode=e.noCompatMode||!1,this.condenseFlow=e.condenseFlow||!1,this.quotingType='"'===e.quotingType?2:1,this.forceQuotes=e.forceQuotes||!1,this.replacer="function"==typeof e.replacer?e.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function H$(e,t){for(var r,n=mk.repeat(" ",t),o=0,a=-1,i="",s=e.length;o<s;)-1===(a=e.indexOf("\n",o))?(r=e.slice(o),o=s):(r=e.slice(o,a+1),o=a+1),r.length&&"\n"!==r&&(i+=n),i+=r;return i}function W$(e,t){return"\n"+mk.repeat(" ",e.indent*t)}function V$(e){return 32===e||9===e}function G$(e){return 32<=e&&e<=126||161<=e&&e<=55295&&8232!==e&&8233!==e||57344<=e&&e<=65533&&65279!==e||65536<=e&&e<=1114111}function K$(e){return G$(e)&&65279!==e&&13!==e&&10!==e}function J$(e,t,r){var n=K$(e),o=n&&!V$(e);return(r?n:n&&44!==e&&91!==e&&93!==e&&123!==e&&125!==e)&&35!==e&&!(58===t&&!o)||K$(t)&&!V$(t)&&35===e||58===t&&o}function Z$(e,t){var r,n=e.charCodeAt(t);return n>=55296&&n<=56319&&t+1<e.length&&(r=e.charCodeAt(t+1))>=56320&&r<=57343?1024*(n-55296)+r-56320+65536:n}function Y$(e){return/^\n* /.test(e)}function Q$(e,t,r,n,o){e.dump=function(){if(0===t.length)return 2===e.quotingType?'""':"''";if(!e.noCompatMode&&(-1!==q$.indexOf(t)||N$.test(t)))return 2===e.quotingType?'"'+t+'"':"'"+t+"'";var a=e.indent*Math.max(1,r),i=-1===e.lineWidth?-1:Math.max(Math.min(e.lineWidth,40),e.lineWidth-a),s=n||e.flowLevel>-1&&r>=e.flowLevel;switch(function(e,t,r,n,o,a,i,s){var l,c,p,d=0,u=null,h=!1,f=!1,m=-1!==n,g=-1,y=G$(c=Z$(e,0))&&65279!==c&&!V$(c)&&45!==c&&63!==c&&58!==c&&44!==c&&91!==c&&93!==c&&123!==c&&125!==c&&35!==c&&38!==c&&42!==c&&33!==c&&124!==c&&61!==c&&62!==c&&39!==c&&34!==c&&37!==c&&64!==c&&96!==c&&!V$(p=Z$(e,e.length-1))&&58!==p;if(t||i)for(l=0;l<e.length;d>=65536?l+=2:l++){if(!G$(d=Z$(e,l)))return 5;y=y&&J$(d,u,s),u=d}else{for(l=0;l<e.length;d>=65536?l+=2:l++){if(10===(d=Z$(e,l)))h=!0,m&&(f=f||l-g-1>n&&" "!==e[g+1],g=l);else if(!G$(d))return 5;y=y&&J$(d,u,s),u=d}f=f||m&&l-g-1>n&&" "!==e[g+1]}return h||f?r>9&&Y$(e)?5:i?2===a?5:2:f?4:3:!y||i||o(e)?2===a?5:2:1}(t,s,e.indent,i,(function(t){return function(e,t){var r,n;for(r=0,n=e.implicitTypes.length;r<n;r+=1)if(e.implicitTypes[r].resolve(t))return!0;return!1}(e,t)}),e.quotingType,e.forceQuotes&&!n,o)){case 1:return t;case 2:return"'"+t.replace(/'/g,"''")+"'";case 3:return"|"+X$(t,e.indent)+eS(H$(t,a));case 4:return">"+X$(t,e.indent)+eS(H$(function(e,t){for(var r,n,o,a=/(\n+)([^\n]*)/g,i=(o=-1!==(o=e.indexOf("\n"))?o:e.length,a.lastIndex=o,tS(e.slice(0,o),t)),s="\n"===e[0]||" "===e[0];n=a.exec(e);){var l=n[1],c=n[2];r=" "===c[0],i+=l+(s||r||""===c?"":"\n")+tS(c,t),s=r}return i}(t,i),a));case 5:return'"'+function(e){for(var t,r="",n=0,o=0;o<e.length;n>=65536?o+=2:o++)n=Z$(e,o),!(t=z$[n])&&G$(n)?(r+=e[o],n>=65536&&(r+=e[o+1])):r+=t||U$(n);return r}(t)+'"';default:throw new vk("impossible error: invalid scalar style")}}()}function X$(e,t){var r=Y$(e)?String(t):"",n="\n"===e[e.length-1];return r+(!n||"\n"!==e[e.length-2]&&"\n"!==e?n?"":"-":"+")+"\n"}function eS(e){return"\n"===e[e.length-1]?e.slice(0,-1):e}function tS(e,t){if(""===e||" "===e[0])return e;for(var r,n,o=/ [^ ]/g,a=0,i=0,s=0,l="";r=o.exec(e);)(s=r.index)-a>t&&(n=i>a?i:s,l+="\n"+e.slice(a,n),a=n+1),i=s;return l+="\n",e.length-a>t&&i>a?l+=e.slice(a,i)+"\n"+e.slice(i+1):l+=e.slice(a),l.slice(1)}function rS(e,t,r,n){var o,a,i,s="",l=e.tag;for(o=0,a=r.length;o<a;o+=1)i=r[o],e.replacer&&(i=e.replacer.call(r,String(o),i)),(oS(e,t+1,i,!0,!0,!1,!0)||void 0===i&&oS(e,t+1,null,!0,!0,!1,!0))&&(n&&""===s||(s+=W$(e,t)),e.dump&&10===e.dump.charCodeAt(0)?s+="-":s+="- ",s+=e.dump);e.tag=l,e.dump=s||"[]"}function nS(e,t,r){var n,o,a,i,s,l;for(a=0,i=(o=r?e.explicitTypes:e.implicitTypes).length;a<i;a+=1)if(((s=o[a]).instanceOf||s.predicate)&&(!s.instanceOf||"object"==typeof t&&t instanceof s.instanceOf)&&(!s.predicate||s.predicate(t))){if(r?s.multi&&s.representName?e.tag=s.representName(t):e.tag=s.tag:e.tag="?",s.represent){if(l=e.styleMap[s.tag]||s.defaultStyle,"[object Function]"===F$.call(s.represent))n=s.represent(t,l);else{if(!D$.call(s.represent,l))throw new vk("!<"+s.tag+'> tag resolver accepts not "'+l+'" style');n=s.represent[l](t,l)}e.dump=n}return!0}return!1}function oS(e,t,r,n,o,a,i){e.tag=null,e.dump=r,nS(e,r,!1)||nS(e,r,!0);var s,l=F$.call(e.dump),c=n;n&&(n=e.flowLevel<0||e.flowLevel>t);var p,d,u="[object Object]"===l||"[object Array]"===l;if(u&&(d=-1!==(p=e.duplicates.indexOf(r))),(null!==e.tag&&"?"!==e.tag||d||2!==e.indent&&t>0)&&(o=!1),d&&e.usedDuplicates[p])e.dump="*ref_"+p;else{if(u&&d&&!e.usedDuplicates[p]&&(e.usedDuplicates[p]=!0),"[object Object]"===l)n&&0!==Object.keys(e.dump).length?(function(e,t,r,n){var o,a,i,s,l,c,p="",d=e.tag,u=Object.keys(r);if(!0===e.sortKeys)u.sort();else if("function"==typeof e.sortKeys)u.sort(e.sortKeys);else if(e.sortKeys)throw new vk("sortKeys must be a boolean or a function");for(o=0,a=u.length;o<a;o+=1)c="",n&&""===p||(c+=W$(e,t)),s=r[i=u[o]],e.replacer&&(s=e.replacer.call(r,i,s)),oS(e,t+1,i,!0,!0,!0)&&((l=null!==e.tag&&"?"!==e.tag||e.dump&&e.dump.length>1024)&&(e.dump&&10===e.dump.charCodeAt(0)?c+="?":c+="? "),c+=e.dump,l&&(c+=W$(e,t)),oS(e,t+1,s,!0,l)&&(e.dump&&10===e.dump.charCodeAt(0)?c+=":":c+=": ",p+=c+=e.dump));e.tag=d,e.dump=p||"{}"}(e,t,e.dump,o),d&&(e.dump="&ref_"+p+e.dump)):(function(e,t,r){var n,o,a,i,s,l="",c=e.tag,p=Object.keys(r);for(n=0,o=p.length;n<o;n+=1)s="",""!==l&&(s+=", "),e.condenseFlow&&(s+='"'),i=r[a=p[n]],e.replacer&&(i=e.replacer.call(r,a,i)),oS(e,t,a,!1,!1)&&(e.dump.length>1024&&(s+="? "),s+=e.dump+(e.condenseFlow?'"':"")+":"+(e.condenseFlow?"":" "),oS(e,t,i,!1,!1)&&(l+=s+=e.dump));e.tag=c,e.dump="{"+l+"}"}(e,t,e.dump),d&&(e.dump="&ref_"+p+" "+e.dump));else if("[object Array]"===l)n&&0!==e.dump.length?(e.noArrayIndent&&!i&&t>0?rS(e,t-1,e.dump,o):rS(e,t,e.dump,o),d&&(e.dump="&ref_"+p+e.dump)):(function(e,t,r){var n,o,a,i="",s=e.tag;for(n=0,o=r.length;n<o;n+=1)a=r[n],e.replacer&&(a=e.replacer.call(r,String(n),a)),(oS(e,t,a,!1,!1)||void 0===a&&oS(e,t,null,!1,!1))&&(""!==i&&(i+=","+(e.condenseFlow?"":" ")),i+=e.dump);e.tag=s,e.dump="["+i+"]"}(e,t,e.dump),d&&(e.dump="&ref_"+p+" "+e.dump));else{if("[object String]"!==l){if("[object Undefined]"===l)return!1;if(e.skipInvalid)return!1;throw new vk("unacceptable kind of an object to dump "+l)}"?"!==e.tag&&Q$(e,e.dump,t,a,c)}null!==e.tag&&"?"!==e.tag&&(s=encodeURI("!"===e.tag[0]?e.tag.slice(1):e.tag).replace(/!/g,"%21"),s="!"===e.tag[0]?"!"+s:"tag:yaml.org,2002:"===s.slice(0,18)?"!!"+s.slice(18):"!<"+s+">",e.dump=s+" "+e.dump)}return!0}function aS(e,t){var r,n,o=[],a=[];for(iS(e,o,a),r=0,n=a.length;r<n;r+=1)t.duplicates.push(o[a[r]]);t.usedDuplicates=new Array(n)}function iS(e,t,r){var n,o,a;if(null!==e&&"object"==typeof e)if(-1!==(o=t.indexOf(e)))-1===r.indexOf(o)&&r.push(o);else if(t.push(e),Array.isArray(e))for(o=0,a=e.length;o<a;o+=1)iS(e[o],t,r);else for(o=0,a=(n=Object.keys(e)).length;o<a;o+=1)iS(e[n[o]],t,r)}function sS(e,t){return function(){throw new Error("Function yaml."+e+" is removed in js-yaml 4. Use yaml."+t+" instead, which is now safe by default.")}}var lS={Type:$k,Schema:Ek,FAILSAFE_SCHEMA:jk,JSON_SCHEMA:zk,CORE_SCHEMA:qk,DEFAULT_SCHEMA:e$,load:B$.load,loadAll:B$.loadAll,dump:function(e,t){var r=new M$(t=t||{});r.noRefs||aS(e,r);var n=e;return r.replacer&&(n=r.replacer.call({"":n},"",n)),oS(r,0,n,!0,!0)?r.dump+"\n":""},YAMLException:vk,types:{binary:Vk,float:Dk,map:Tk,null:Ik,pairs:Yk,set:Xk,timestamp:Mk,bool:Pk,int:Lk,merge:Hk,omap:Jk,seq:Ck,str:Ok},safeLoad:sS("safeLoad","load"),safeLoadAll:sS("safeLoadAll","loadAll"),safeDump:sS("safeDump","dump")};const cS="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:window,{FormData:pS,Blob:dS,File:uS}=cS;function hS(e){return function(e){if(kh(e))return Ef(e)}(e)||function(e){if(void 0!==eh&&null!=xh(e)||null!=e["@@iterator"])return Af(e)}(e)||Of(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}const fS=dt({exports:{}}.exports=Uh);var mS=function(e){return":/?#[]@!$&'()*+,;=".indexOf(e)>-1},gS=function(e){return/^[a-z0-9\-._~]+$/i.test(e)};function yS(e){var t,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=r.escape,o=arguments.length>2?arguments[2]:void 0;return"number"==typeof e&&(e=e.toString()),"string"==typeof e&&e.length&&n?o?JSON.parse(e):Ob(t=hS(e)).call(t,(function(e){var t,r;if(gS(e))return e;if(mS(e)&&"unsafe"===n)return e;var o=new TextEncoder;return Ob(t=Ob(r=tb(o.encode(e))).call(r,(function(e){var t;return fS(t="0".concat(e.toString(16).toUpperCase())).call(t,-2)}))).call(t,(function(e){return"%".concat(e)})).join("")})).join(""):e}function vS(e){var t=e.value;return Array.isArray(t)?function(e){var t=e.key,r=e.value,n=e.style,o=e.explode,a=e.escape,i=function(e){return yS(e,{escape:a})};if("simple"===n)return Ob(r).call(r,(function(e){return i(e)})).join(",");if("label"===n)return".".concat(Ob(r).call(r,(function(e){return i(e)})).join("."));if("matrix"===n)return Ob(r).call(r,(function(e){return i(e)})).reduce((function(e,r){var n,a,i;return!e||o?_b(a=_b(i="".concat(e||"",";")).call(i,t,"=")).call(a,r):_b(n="".concat(e,",")).call(n,r)}),"");if("form"===n){var s=o?"&".concat(t,"="):",";return Ob(r).call(r,(function(e){return i(e)})).join(s)}if("spaceDelimited"===n){var l=o?"".concat(t,"="):"";return Ob(r).call(r,(function(e){return i(e)})).join(" ".concat(l))}if("pipeDelimited"===n){var c=o?"".concat(t,"="):"";return Ob(r).call(r,(function(e){return i(e)})).join("|".concat(c))}}(e):"object"===If(t)?function(e){var t=e.key,r=e.value,n=e.style,o=e.explode,a=e.escape,i=function(e){return yS(e,{escape:a})},s=Cb(r);return"simple"===n?s.reduce((function(e,t){var n,a,s,l=i(r[t]),c=o?"=":",",p=e?"".concat(e,","):"";return _b(n=_b(a=_b(s="".concat(p)).call(s,t)).call(a,c)).call(n,l)}),""):"label"===n?s.reduce((function(e,t){var n,a,s,l=i(r[t]),c=o?"=":".",p=e?"".concat(e,"."):".";return _b(n=_b(a=_b(s="".concat(p)).call(s,t)).call(a,c)).call(n,l)}),""):"matrix"===n&&o?s.reduce((function(e,t){var n,o,a=i(r[t]),s=e?"".concat(e,";"):";";return _b(n=_b(o="".concat(s)).call(o,t,"=")).call(n,a)}),""):"matrix"===n?s.reduce((function(e,n){var o,a,s=i(r[n]),l=e?"".concat(e,","):";".concat(t,"=");return _b(o=_b(a="".concat(l)).call(a,n,",")).call(o,s)}),""):"form"===n?s.reduce((function(e,t){var n,a,s,l,c=i(r[t]),p=e?_b(n="".concat(e)).call(n,o?"&":","):"",d=o?"=":",";return _b(a=_b(s=_b(l="".concat(p)).call(l,t)).call(s,d)).call(a,c)}),""):void 0}(e):function(e){var t,r=e.key,n=e.value,o=e.style,a=e.escape,i=function(e){return yS(e,{escape:a})};return"simple"===o?i(n):"label"===o?".".concat(i(n)):"matrix"===o?_b(t=";".concat(r,"=")).call(t,i(n)):"form"===o||"deepObject"===o?i(n):void 0}(e)}var bS=function(e,t){t.body=e},xS={serializeRes:AS,mergeInQueryOrForm:BS};function wS(e){return kS.apply(this,arguments)}function kS(){return kS=Tv(Iv.mark((function e(t){var r,n,o,a,i,s=arguments;return Iv.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r=s.length>1&&void 0!==s[1]?s[1]:{},"object"===If(t)&&(t=(r=t).url),r.headers=r.headers||{},xS.mergeInQueryOrForm(r),r.headers&&Cb(r.headers).forEach((function(e){var t=r.headers[e];"string"==typeof t&&(r.headers[e]=t.replace(/\n+/g," "))})),!r.requestInterceptor){e.next=12;break}return e.next=8,r.requestInterceptor(r);case 8:if(e.t0=e.sent,e.t0){e.next=11;break}e.t0=r;case 11:r=e.t0;case 12:return n=r.headers["content-type"]||r.headers["Content-Type"],/multipart\/form-data/i.test(n)&&r.body instanceof pS&&(delete r.headers["content-type"],delete r.headers["Content-Type"]),e.prev=14,e.next=17,(r.userFetch||fetch)(r.url,r);case 17:return o=e.sent,e.next=20,xS.serializeRes(o,t,r);case 20:if(o=e.sent,!r.responseInterceptor){e.next=28;break}return e.next=24,r.responseInterceptor(o);case 24:if(e.t1=e.sent,e.t1){e.next=27;break}e.t1=o;case 27:o=e.t1;case 28:e.next=39;break;case 30:if(e.prev=30,e.t2=e.catch(14),o){e.next=34;break}throw e.t2;case 34:throw(a=new Error(o.statusText||"response status is ".concat(o.status))).status=o.status,a.statusCode=o.status,a.responseError=e.t2,a;case 39:if(o.ok){e.next=45;break}throw(i=new Error(o.statusText||"response status is ".concat(o.status))).status=o.status,i.statusCode=o.status,i.response=o,i;case 45:return e.abrupt("return",o);case 46:case"end":return e.stop()}}),e,null,[[14,30]])}))),kS.apply(this,arguments)}var $S=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return/(json|xml|yaml|text)\b/.test(e)};function SS(e,t){return t&&(0===t.indexOf("application/json")||t.indexOf("+json")>0)?JSON.parse(e):lS.load(e)}function AS(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=r.loadSpec,o=void 0!==n&&n,a={ok:e.ok,url:e.url||t,status:e.status,statusText:e.statusText,headers:OS(e.headers)},i=a.headers["content-type"],s=o||$S(i),l=s?e.text:e.blob||e.buffer;return l.call(e).then((function(e){if(a.text=e,a.data=e,s)try{var t=SS(e,i);a.body=t,a.obj=t}catch(e){a.parseError=e}return a}))}function ES(e){return Vv(e).call(e,", ")?e.split(", "):e}function OS(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return"function"!=typeof eb(e)?{}:tb(eb(e).call(e)).reduce((function(e,t){var r=Pf(t,2),n=r[0],o=r[1];return e[n]=ES(o),e}),{})}function CS(e,t){return t||"undefined"==typeof navigator||(t=navigator),t&&"ReactNative"===t.product?!(!e||"object"!==If(e)||"string"!=typeof e.uri):void 0!==uS&&e instanceof uS||void 0!==dS&&e instanceof dS||!!ArrayBuffer.isView(e)||null!==e&&"object"===If(e)&&"function"==typeof e.pipe}function TS(e,t){return Array.isArray(e)&&e.some((function(e){return CS(e,t)}))}var jS={form:",",spaceDelimited:"%20",pipeDelimited:"|"},IS={csv:",",ssv:"%20",tsv:"%09",pipes:"|"};function PS(e,t){var r=arguments.length>2&&void 0!==arguments[2]&&arguments[2],n=t.collectionFormat,o=t.allowEmptyValue,a=t.serializationOption,i=t.encoding,s="object"!==If(t)||Array.isArray(t)?t:t.value,l=r?function(e){return e.toString()}:function(e){return encodeURIComponent(e)},c=l(e);if(void 0===s&&o)return[[c,""]];if(CS(s)||TS(s))return[[c,s]];if(a)return _S(e,s,r,a);if(i){if([If(i.style),If(i.explode),If(i.allowReserved)].some((function(e){return"undefined"!==e}))){var p=i.style,d=i.explode,u=i.allowReserved;return _S(e,s,r,{style:p,explode:d,allowReserved:u})}if(i.contentType){if("application/json"===i.contentType){var h="string"==typeof s?s:wb(s);return[[c,l(h)]]}return[[c,l(s.toString())]]}return"object"!==If(s)?[[c,l(s)]]:Array.isArray(s)&&s.every((function(e){return"object"!==If(e)}))?[[c,Ob(s).call(s,l).join(",")]]:[[c,l(wb(s))]]}return"object"!==If(s)?[[c,l(s)]]:Array.isArray(s)?"multi"===n?[[c,Ob(s).call(s,l)]]:[[c,Ob(s).call(s,l).join(IS[n||"csv"])]]:[[c,""]]}function _S(e,t,r,n){var o,a,i,s=n.style||"form",l=void 0===n.explode?"form"===s:n.explode,c=!r&&(n&&n.allowReserved?"unsafe":"reserved"),p=function(e){return yS(e,{escape:c})},d=r?function(e){return e}:function(e){return yS(e,{escape:c})};return"object"!==If(t)?[[d(e),p(t)]]:Array.isArray(t)?l?[[d(e),Ob(t).call(t,p)]]:[[d(e),Ob(t).call(t,p).join(jS[s])]]:"deepObject"===s?Ob(a=Cb(t)).call(a,(function(r){var n;return[d(_b(n="".concat(e,"[")).call(n,r,"]")),p(t[r])]})):l?Ob(i=Cb(t)).call(i,(function(e){return[d(e),p(t[e])]})):[[d(e),Ob(o=Cb(t)).call(o,(function(e){var r;return[_b(r="".concat(d(e),",")).call(r,p(t[e]))]})).join(",")]]}function RS(e){return Mb(e).reduce((function(e,t){var r,n=Pf(t,2),o=Cf(PS(n[0],n[1],!0));try{for(o.s();!(r=o.n()).done;){var a=Pf(r.value,2),i=a[0],s=a[1];if(Array.isArray(s)){var l,c=Cf(s);try{for(c.s();!(l=c.n()).done;){var p=l.value;if(ArrayBuffer.isView(p)){var d=new dS([p]);e.append(i,d)}else e.append(i,p)}}catch(e){c.e(e)}finally{c.f()}}else if(ArrayBuffer.isView(s)){var u=new dS([s]);e.append(i,u)}else e.append(i,s)}}catch(e){o.e(e)}finally{o.f()}return e}),new pS)}function LS(e){var t=Cb(e).reduce((function(t,r){var n,o=Cf(PS(r,e[r]));try{for(o.s();!(n=o.n()).done;){var a=Pf(n.value,2),i=a[0],s=a[1];t[i]=s}}catch(e){o.e(e)}finally{o.f()}return t}),{});return hk(t,{encode:!1,indices:!1})||""}function BS(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.url,r=void 0===t?"":t,n=e.query,o=e.form,a=function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var n=Hb(t).call(t,(function(e){return e})).join("&");return n?"?".concat(n):""};if(o){var i=Cb(o).some((function(e){var t=o[e].value;return CS(t)||TS(t)})),s=e.headers["content-type"]||e.headers["Content-Type"];if(i||/multipart\/form-data/i.test(s)){var l=RS(e.form);bS(l,e)}else e.body=LS(o);delete e.form}if(n){var c=r.split("?"),p=Pf(c,2),d=p[0],u=p[1],h="";if(u){var f=uk(u),m=Cb(n);m.forEach((function(e){return delete f[e]})),h=hk(f,{encode:!0})}var g=a(h,LS(n));e.url=d+g,delete e.query}return e}function FS(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function DS(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Sd(e,n.key,n)}}function zS(e,t,r){return t&&DS(e.prototype,t),r&&DS(e,r),Sd(e,"prototype",{writable:!1}),e}var qS=Co,NS=Rs.find,US=!0;"find"in[]&&Array(1).find((function(){US=!1})),qS({target:"Array",proto:!0,forced:US},{find:function(e){return NS(this,e,arguments.length>1?arguments[1]:void 0)}});var MS=ic("Array").find,HS=cr,WS=MS,VS=Array.prototype;const GS=dt({exports:{}}.exports=function(e){var t=e.find;return e===VS||HS(VS,e)&&t===VS.find?WS:t});const KS=dt({exports:{}}.exports=$v);var JS=Co,ZS=ht,YS=Lo,QS=Io,XS=qo,eA=Gr,tA=Es,rA=ei,nA=nc("splice"),oA=ZS.TypeError,aA=Math.max,iA=Math.min;JS({target:"Array",proto:!0,forced:!nA},{splice:function(e,t){var r,n,o,a,i,s,l=eA(this),c=XS(l),p=YS(e,c),d=arguments.length;if(0===d?r=n=0:1===d?(r=0,n=c-p):(r=d-2,n=iA(aA(QS(t),0),c-p)),c+r-n>9007199254740991)throw oA("Maximum allowed length exceeded");for(o=tA(l,n),a=0;a<n;a++)(i=p+a)in l&&rA(o,a,l[i]);if(o.length=n,r<n){for(a=p;a<c-n;a++)s=a+r,(i=a+n)in l?l[s]=l[i]:delete l[s];for(a=c;a>c-n+r;a--)delete l[a-1]}else if(r>n)for(a=c-n;a>p;a--)s=a+r-1,(i=a+n-1)in l?l[s]=l[i]:delete l[s];for(a=0;a<r;a++)l[a+p]=arguments[a+2];return l.length=c-n+r,o}});var sA=ic("Array").splice,lA=cr,cA=sA,pA=Array.prototype;const dA=dt({exports:{}}.exports=function(e){var t=e.splice;return e===pA||lA(pA,e)&&t===pA.splice?cA:t});var uA,hA=globalThis&&globalThis.__extends||(uA=function(e,t){return uA=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])},uA(e,t)},function(e,t){function r(){this.constructor=e}uA(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),fA=Object.prototype.hasOwnProperty;function mA(e,t){return fA.call(e,t)}function gA(e){if(Array.isArray(e)){for(var t=new Array(e.length),r=0;r<t.length;r++)t[r]=""+r;return t}if(Object.keys)return Object.keys(e);for(var n in t=[],e)mA(e,n)&&t.push(n);return t}function yA(e){switch(typeof e){case"object":return JSON.parse(JSON.stringify(e));case"undefined":return null;default:return e}}function vA(e){for(var t,r=0,n=e.length;r<n;){if(!((t=e.charCodeAt(r))>=48&&t<=57))return!1;r++}return!0}function bA(e){return-1===e.indexOf("/")&&-1===e.indexOf("~")?e:e.replace(/~/g,"~0").replace(/\//g,"~1")}function xA(e){return e.replace(/~1/g,"/").replace(/~0/g,"~")}function wA(e){if(void 0===e)return!0;if(e)if(Array.isArray(e)){for(var t=0,r=e.length;t<r;t++)if(wA(e[t]))return!0}else if("object"==typeof e){var n=gA(e),o=n.length;for(t=0;t<o;t++)if(wA(e[n[t]]))return!0}return!1}function kA(e,t){var r=[e];for(var n in t){var o="object"==typeof t[n]?JSON.stringify(t[n],null,2):t[n];void 0!==o&&r.push(n+": "+o)}return r.join("\n")}var $A=function(e){function t(t,r,n,o,a){var i=this.constructor,s=e.call(this,kA(t,{name:r,index:n,operation:o,tree:a}))||this;return s.name=r,s.index=n,s.operation=o,s.tree=a,Object.setPrototypeOf(s,i.prototype),s.message=kA(t,{name:r,index:n,operation:o,tree:a}),s}return hA(t,e),t}(Error),SA=$A,AA=yA,EA={add:function(e,t,r){return e[t]=this.value,{newDocument:r}},remove:function(e,t,r){var n=e[t];return delete e[t],{newDocument:r,removed:n}},replace:function(e,t,r){var n=e[t];return e[t]=this.value,{newDocument:r,removed:n}},move:function(e,t,r){var n=CA(r,this.path);n&&(n=yA(n));var o=TA(r,{op:"remove",path:this.from}).removed;return TA(r,{op:"add",path:this.path,value:o}),{newDocument:r,removed:n}},copy:function(e,t,r){var n=CA(r,this.from);return TA(r,{op:"add",path:this.path,value:yA(n)}),{newDocument:r}},test:function(e,t,r){return{newDocument:r,test:_A(e[t],this.value)}},_get:function(e,t,r){return this.value=e[t],{newDocument:r}}},OA={add:function(e,t,r){return vA(t)?e.splice(t,0,this.value):e[t]=this.value,{newDocument:r,index:t}},remove:function(e,t,r){return{newDocument:r,removed:e.splice(t,1)[0]}},replace:function(e,t,r){var n=e[t];return e[t]=this.value,{newDocument:r,removed:n}},move:EA.move,copy:EA.copy,test:EA.test,_get:EA._get};function CA(e,t){if(""==t)return e;var r={op:"_get",path:t};return TA(e,r),r.value}function TA(e,t,r,n,o,a){if(void 0===r&&(r=!1),void 0===n&&(n=!0),void 0===o&&(o=!0),void 0===a&&(a=0),r&&("function"==typeof r?r(t,0,e,t.path):IA(t,0)),""===t.path){var i={newDocument:e};if("add"===t.op)return i.newDocument=t.value,i;if("replace"===t.op)return i.newDocument=t.value,i.removed=e,i;if("move"===t.op||"copy"===t.op)return i.newDocument=CA(e,t.from),"move"===t.op&&(i.removed=e),i;if("test"===t.op){if(i.test=_A(e,t.value),!1===i.test)throw new SA("Test operation failed","TEST_OPERATION_FAILED",a,t,e);return i.newDocument=e,i}if("remove"===t.op)return i.removed=e,i.newDocument=null,i;if("_get"===t.op)return t.value=e,i;if(r)throw new SA("Operation `op` property is not one of operations defined in RFC-6902","OPERATION_OP_INVALID",a,t,e);return i}n||(e=yA(e));var s=(t.path||"").split("/"),l=e,c=1,p=s.length,d=void 0,u=void 0,h=void 0;for(h="function"==typeof r?r:IA;;){if((u=s[c])&&-1!=u.indexOf("~")&&(u=xA(u)),o&&"__proto__"==u)throw new TypeError("JSON-Patch: modifying `__proto__` prop is banned for security reasons, if this was on purpose, please set `banPrototypeModifications` flag false and pass it to this function. More info in fast-json-patch README");if(r&&void 0===d&&(void 0===l[u]?d=s.slice(0,c).join("/"):c==p-1&&(d=t.path),void 0!==d&&h(t,0,e,d)),c++,Array.isArray(l)){if("-"===u)u=l.length;else{if(r&&!vA(u))throw new SA("Expected an unsigned base-10 integer value, making the new referenced value the array element with the zero-based index","OPERATION_PATH_ILLEGAL_ARRAY_INDEX",a,t,e);vA(u)&&(u=~~u)}if(c>=p){if(r&&"add"===t.op&&u>l.length)throw new SA("The specified index MUST NOT be greater than the number of elements in the array","OPERATION_VALUE_OUT_OF_BOUNDS",a,t,e);if(!1===(i=OA[t.op].call(t,l,u,e)).test)throw new SA("Test operation failed","TEST_OPERATION_FAILED",a,t,e);return i}}else if(c>=p){if(!1===(i=EA[t.op].call(t,l,u,e)).test)throw new SA("Test operation failed","TEST_OPERATION_FAILED",a,t,e);return i}if(l=l[u],r&&c<p&&(!l||"object"!=typeof l))throw new SA("Cannot perform operation at the desired path","OPERATION_PATH_UNRESOLVABLE",a,t,e)}}function jA(e,t,r,n,o){if(void 0===n&&(n=!0),void 0===o&&(o=!0),r&&!Array.isArray(t))throw new SA("Patch sequence must be an array","SEQUENCE_NOT_AN_ARRAY");n||(e=yA(e));for(var a=new Array(t.length),i=0,s=t.length;i<s;i++)a[i]=TA(e,t[i],r,!0,o,i),e=a[i].newDocument;return a.newDocument=e,a}function IA(e,t,r,n){if("object"!=typeof e||null===e||Array.isArray(e))throw new SA("Operation is not an object","OPERATION_NOT_AN_OBJECT",t,e,r);if(!EA[e.op])throw new SA("Operation `op` property is not one of operations defined in RFC-6902","OPERATION_OP_INVALID",t,e,r);if("string"!=typeof e.path)throw new SA("Operation `path` property is not a string","OPERATION_PATH_INVALID",t,e,r);if(0!==e.path.indexOf("/")&&e.path.length>0)throw new SA('Operation `path` property must start with "/"',"OPERATION_PATH_INVALID",t,e,r);if(("move"===e.op||"copy"===e.op)&&"string"!=typeof e.from)throw new SA("Operation `from` property is not present (applicable in `move` and `copy` operations)","OPERATION_FROM_REQUIRED",t,e,r);if(("add"===e.op||"replace"===e.op||"test"===e.op)&&void 0===e.value)throw new SA("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)","OPERATION_VALUE_REQUIRED",t,e,r);if(("add"===e.op||"replace"===e.op||"test"===e.op)&&wA(e.value))throw new SA("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)","OPERATION_VALUE_CANNOT_CONTAIN_UNDEFINED",t,e,r);if(r)if("add"==e.op){var o=e.path.split("/").length,a=n.split("/").length;if(o!==a+1&&o!==a)throw new SA("Cannot perform an `add` operation at the desired path","OPERATION_PATH_CANNOT_ADD",t,e,r)}else if("replace"===e.op||"remove"===e.op||"_get"===e.op){if(e.path!==n)throw new SA("Cannot perform the operation at a path that does not exist","OPERATION_PATH_UNRESOLVABLE",t,e,r)}else if("move"===e.op||"copy"===e.op){var i=PA([{op:"_get",path:e.from,value:void 0}],r);if(i&&"OPERATION_PATH_UNRESOLVABLE"===i.name)throw new SA("Cannot perform the operation from a path that does not exist","OPERATION_FROM_UNRESOLVABLE",t,e,r)}}function PA(e,t,r){try{if(!Array.isArray(e))throw new SA("Patch sequence must be an array","SEQUENCE_NOT_AN_ARRAY");if(t)jA(yA(t),yA(e),r||!0);else{r=r||IA;for(var n=0;n<e.length;n++)r(e[n],n,t,void 0)}}catch(e){if(e instanceof SA)return e;throw e}}function _A(e,t){if(e===t)return!0;if(e&&t&&"object"==typeof e&&"object"==typeof t){var r,n,o,a=Array.isArray(e),i=Array.isArray(t);if(a&&i){if((n=e.length)!=t.length)return!1;for(r=n;0!=r--;)if(!_A(e[r],t[r]))return!1;return!0}if(a!=i)return!1;var s=Object.keys(e);if((n=s.length)!==Object.keys(t).length)return!1;for(r=n;0!=r--;)if(!t.hasOwnProperty(s[r]))return!1;for(r=n;0!=r--;)if(!_A(e[o=s[r]],t[o]))return!1;return!0}return e!=e&&t!=t}const RA=Object.freeze(Object.defineProperty({__proto__:null,JsonPatchError:SA,deepClone:AA,getValueByPointer:CA,applyOperation:TA,applyPatch:jA,applyReducer:function(e,t,r){var n=TA(e,t);if(!1===n.test)throw new SA("Test operation failed","TEST_OPERATION_FAILED",r,t,e);return n.newDocument},validator:IA,validate:PA,_areEquals:_A},Symbol.toStringTag,{value:"Module"}));var LA=new WeakMap,BA=function(e){this.observers=new Map,this.obj=e},FA=function(e,t){this.callback=e,this.observer=t};function DA(e,t){void 0===t&&(t=!1);var r=LA.get(e.object);zA(r.value,e.object,e.patches,"",t),e.patches.length&&jA(r.value,e.patches);var n=e.patches;return n.length>0&&(e.patches=[],e.callback&&e.callback(n)),n}function zA(e,t,r,n,o){if(t!==e){"function"==typeof t.toJSON&&(t=t.toJSON());for(var a=gA(t),i=gA(e),s=!1,l=i.length-1;l>=0;l--){var c=e[d=i[l]];if(!mA(t,d)||void 0===t[d]&&void 0!==c&&!1===Array.isArray(t))Array.isArray(e)===Array.isArray(t)?(o&&r.push({op:"test",path:n+"/"+bA(d),value:yA(c)}),r.push({op:"remove",path:n+"/"+bA(d)}),s=!0):(o&&r.push({op:"test",path:n,value:e}),r.push({op:"replace",path:n,value:t}));else{var p=t[d];"object"==typeof c&&null!=c&&"object"==typeof p&&null!=p&&Array.isArray(c)===Array.isArray(p)?zA(c,p,r,n+"/"+bA(d),o):c!==p&&(o&&r.push({op:"test",path:n+"/"+bA(d),value:yA(c)}),r.push({op:"replace",path:n+"/"+bA(d),value:yA(p)}))}}if(s||a.length!=i.length)for(l=0;l<a.length;l++){var d;mA(e,d=a[l])||void 0===t[d]||r.push({op:"add",path:n+"/"+bA(d),value:yA(t[d])})}}}const qA=Object.freeze(Object.defineProperty({__proto__:null,unobserve:function(e,t){t.unobserve()},observe:function(e,t){var r,n,o=(n=e,LA.get(n));if(o){var a=function(e,t){return e.observers.get(t)}(o,t);r=a&&a.observer}else o=new BA(e),LA.set(e,o);if(r)return r;if(r={},o.value=yA(e),t){r.callback=t,r.next=null;var i=function(){DA(r)},s=function(){clearTimeout(r.next),r.next=setTimeout(i)};"undefined"!=typeof window&&(window.addEventListener("mouseup",s),window.addEventListener("keyup",s),window.addEventListener("mousedown",s),window.addEventListener("keydown",s),window.addEventListener("change",s))}return r.patches=[],r.object=e,r.unobserve=function(){DA(r),clearTimeout(r.next),function(e,t){e.observers.delete(t.callback)}(o,r),"undefined"!=typeof window&&(window.removeEventListener("mouseup",s),window.removeEventListener("keyup",s),window.removeEventListener("mousedown",s),window.removeEventListener("keydown",s),window.removeEventListener("change",s))},o.observers.set(t,new FA(t,r)),r},generate:DA,compare:function(e,t,r){void 0===r&&(r=!1);var n=[];return zA(e,t,n,"",r),n}},Symbol.toStringTag,{value:"Module"}));Object.assign({},RA,qA,{JsonPatchError:$A,deepClone:yA,escapePathComponent:bA,unescapePathComponent:xA});var NA=function(e){return!(t=e,!t||"object"!=typeof t||function(e){var t=Object.prototype.toString.call(e);return"[object RegExp]"===t||"[object Date]"===t||e.$$typeof===UA}(e));var t},UA="function"==typeof Symbol&&Symbol.for?Symbol.for("react.element"):60103;function MA(e,t){return!1!==t.clone&&t.isMergeableObject(e)?GA((r=e,Array.isArray(r)?[]:{}),e,t):e;var r}function HA(e,t,r){return e.concat(t).map((function(e){return MA(e,r)}))}function WA(e){return Object.keys(e).concat((t=e,Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(t).filter((function(e){return t.propertyIsEnumerable(e)})):[]));var t}function VA(e,t){try{return t in e}catch(e){return!1}}function GA(e,t,r){(r=r||{}).arrayMerge=r.arrayMerge||HA,r.isMergeableObject=r.isMergeableObject||NA,r.cloneUnlessOtherwiseSpecified=MA;var n=Array.isArray(t);return n===Array.isArray(e)?n?r.arrayMerge(e,t,r):function(e,t,r){var n={};return r.isMergeableObject(e)&&WA(e).forEach((function(t){n[t]=MA(e[t],r)})),WA(t).forEach((function(o){var a,i;VA(a=e,i=o)&&(!Object.hasOwnProperty.call(a,i)||!Object.propertyIsEnumerable.call(a,i))||(VA(e,o)&&r.isMergeableObject(t[o])?n[o]=function(e,t){if(!t.customMerge)return GA;var r=t.customMerge(e);return"function"==typeof r?r:GA}(o,r)(e[o],t[o],r):n[o]=MA(t[o],r))})),n}(e,t,r):MA(t,r)}GA.all=function(e,t){if(!Array.isArray(e))throw new Error("first argument should be an array");return e.reduce((function(e,r){return GA(e,r,t)}),{})};var KA=GA;const JA={add:function(e,t){return{op:"add",path:e,value:t}},replace:YA,remove:function(e){return{op:"remove",path:e}},merge:function(e,t){return{type:"mutation",op:"merge",path:e,value:t}},mergeDeep:function(e,t){return{type:"mutation",op:"mergeDeep",path:e,value:t}},context:function(e,t){return{type:"context",path:e,value:t}},getIn:function(e,t){return t.reduce((function(e,t){return void 0!==t&&e?e[t]:e}),e)},applyPatch:function(e,t,r){if(r=r||{},"merge"===(t=Od(Od({},t),{},{path:t.path&&ZA(t.path)})).op){var n=pE(e,t.path);Md(n,t.value),jA(e,[YA(t.path,n)])}else if("mergeDeep"===t.op){var o=pE(e,t.path),a=KA(o,t.value);e=jA(e,[YA(t.path,a)]).newDocument}else if("add"===t.op&&""===t.path&&oE(t.value)){jA(e,Cb(t.value).reduce((function(e,r){return e.push({op:"add",path:"/".concat(ZA(r)),value:t.value[r]}),e}),[]))}else if("replace"===t.op&&""===t.path){var i=t.value;r.allowMetaPatches&&t.meta&&lE(t)&&(Array.isArray(t.value)||oE(t.value))&&(i=Od(Od({},i),t.meta)),e=i}else if(jA(e,[t]),r.allowMetaPatches&&t.meta&&lE(t)&&(Array.isArray(t.value)||oE(t.value))){var s=Od(Od({},pE(e,t.path)),t.meta);jA(e,[YA(t.path,s)])}return e},parentPathMatch:function(e,t){if(!Array.isArray(t))return!1;for(var r=0,n=t.length;r<n;r+=1)if(t[r]!==e[r])return!1;return!0},flatten:rE,fullyNormalizeArray:function(e){return nE(rE(tE(e)))},normalizeArray:tE,isPromise:function(e){return oE(e)&&aE(e.then)},forEachNew:function(e,t){try{return QA(e,eE,t)}catch(e){return e}},forEachNewPrimitive:function(e,t){try{return QA(e,XA,t)}catch(e){return e}},isJsonPatch:iE,isContextPatch:function(e){return cE(e)&&"context"===e.type},isPatch:cE,isMutation:sE,isAdditiveMutation:lE,isGenerator:function(e){return"[object GeneratorFunction]"===Object.prototype.toString.call(e)},isFunction:aE,isObject:oE,isError:function(e){return e instanceof Error}};function ZA(e){return Array.isArray(e)?e.length<1?"":"/".concat(Ob(e).call(e,(function(e){return(e+"").replace(/~/g,"~0").replace(/\//g,"~1")})).join("/")):e}function YA(e,t,r){return{op:"replace",path:e,value:t,meta:r}}function QA(e,t,r){var n;return nE(rE(Ob(n=Hb(e).call(e,lE)).call(n,(function(e){return t(e.value,r,e.path)}))||[]))}function XA(e,t,r){return r=r||[],Array.isArray(e)?Ob(e).call(e,(function(e,n){return XA(e,t,_b(r).call(r,n))})):oE(e)?Ob(n=Cb(e)).call(n,(function(n){return XA(e[n],t,_b(r).call(r,n))})):t(e,r[r.length-1],r);var n}function eE(e,t,r){var n=[];if((r=r||[]).length>0){var o=t(e,r[r.length-1],r);o&&(n=_b(n).call(n,o))}if(Array.isArray(e)){var a=Ob(e).call(e,(function(e,n){return eE(e,t,_b(r).call(r,n))}));a&&(n=_b(n).call(n,a))}else if(oE(e)){var i,s=Ob(i=Cb(e)).call(i,(function(n){return eE(e[n],t,_b(r).call(r,n))}));s&&(n=_b(n).call(n,s))}return rE(n)}function tE(e){return Array.isArray(e)?e:[e]}function rE(e){var t;return _b(t=[]).apply(t,hS(Ob(e).call(e,(function(e){return Array.isArray(e)?rE(e):e}))))}function nE(e){return Hb(e).call(e,(function(e){return void 0!==e}))}function oE(e){return e&&"object"===If(e)}function aE(e){return e&&"function"==typeof e}function iE(e){if(cE(e)){var t=e.op;return"add"===t||"remove"===t||"replace"===t}return!1}function sE(e){return iE(e)||cE(e)&&"mutation"===e.type}function lE(e){return sE(e)&&("add"===e.op||"replace"===e.op||"merge"===e.op||"mergeDeep"===e.op)}function cE(e){return e&&"object"===If(e)}function pE(e,t){try{return CA(e,t)}catch(e){return console.error(e),{}}}var dE={exports:{}},uE=ft((function(){if("function"==typeof ArrayBuffer){var e=new ArrayBuffer(8);Object.isExtensible(e)&&Object.defineProperty(e,"a",{value:8})}})),hE=ft,fE=rr,mE=Mt,gE=uE,yE=Object.isExtensible,vE=hE((function(){yE(1)}))||gE?function(e){return!!fE(e)&&(!gE||"ArrayBuffer"!=mE(e))&&(!yE||yE(e))}:yE,bE=!ft((function(){return Object.isExtensible(Object.preventExtensions({}))})),xE=Co,wE=Et,kE=Vo,$E=rr,SE=Zr,AE=Qn.f,EE=Ga,OE=Za,CE=vE,TE=bE,jE=!1,IE=tn("meta"),PE=0,_E=function(e){AE(e,IE,{value:{objectID:"O"+PE++,weakData:{}}})},RE=dE.exports={enable:function(){RE.enable=function(){},jE=!0;var e=EE.f,t=wE([].splice),r={};r[IE]=1,e(r).length&&(EE.f=function(r){for(var n=e(r),o=0,a=n.length;o<a;o++)if(n[o]===IE){t(n,o,1);break}return n},xE({target:"Object",stat:!0,forced:!0},{getOwnPropertyNames:OE.f}))},fastKey:function(e,t){if(!$E(e))return"symbol"==typeof e?e:("string"==typeof e?"S":"P")+e;if(!SE(e,IE)){if(!CE(e))return"F";if(!t)return"E";_E(e)}return e[IE].objectID},getWeakData:function(e,t){if(!SE(e,IE)){if(!CE(e))return!0;if(!t)return!1;_E(e)}return e[IE].weakData},onFreeze:function(e){return TE&&jE&&CE(e)&&!SE(e,IE)&&_E(e),e}};kE[IE]=!0;var LE=Co,BE=ht,FE=dE.exports,DE=ft,zE=go,qE=rm,NE=Fm,UE=Ot,ME=rr,HE=Ii,WE=Qn.f,VE=Rs.forEach,GE=Tt,KE=as.set,JE=as.getterFor,ZE=Et,YE=jm,QE=dE.exports.getWeakData,XE=oo,eO=rr,tO=Fm,rO=rm,nO=Zr,oO=as.set,aO=as.getterFor,iO=Rs.find,sO=Rs.findIndex,lO=ZE([].splice),cO=0,pO=function(e){return e.frozen||(e.frozen=new dO)},dO=function(){this.entries=[]},uO=function(e,t){return iO(e.entries,(function(e){return e[0]===t}))};dO.prototype={get:function(e){var t=uO(this,e);if(t)return t[1]},has:function(e){return!!uO(this,e)},set:function(e,t){var r=uO(this,e);r?r[1]=t:this.entries.push([e,t])},delete:function(e){var t=sO(this.entries,(function(t){return t[0]===e}));return~t&&lO(this.entries,t,1),!!~t}};var hO,fO={getConstructor:function(e,t,r,n){var o=e((function(e,o){tO(e,a),oO(e,{type:t,id:cO++,frozen:void 0}),null!=o&&rO(o,e[n],{that:e,AS_ENTRIES:r})})),a=o.prototype,i=aO(t),s=function(e,t,r){var n=i(e),o=QE(XE(t),!0);return!0===o?pO(n).set(t,r):o[n.id]=r,e};return YE(a,{delete:function(e){var t=i(this);if(!eO(e))return!1;var r=QE(e);return!0===r?pO(t).delete(e):r&&nO(r,t.id)&&delete r[t.id]},has:function(e){var t=i(this);if(!eO(e))return!1;var r=QE(e);return!0===r?pO(t).has(e):r&&nO(r,t.id)}}),YE(a,r?{get:function(e){var t=i(this);if(eO(e)){var r=QE(e);return!0===r?pO(t).get(e):r?r[t.id]:void 0}},set:function(e,t){return s(this,e,t)}}:{add:function(e){return s(this,e,!0)}}),o}},mO=ht,gO=Et,yO=jm,vO=dE.exports,bO=fO,xO=rr,wO=vE,kO=as.enforce,$O=Ui,SO=!mO.ActiveXObject&&"ActiveXObject"in mO,AO=function(e){return function(){return e(this,arguments.length?arguments[0]:void 0)}},EO=function(e,t,r){var n,o=-1!==e.indexOf("Map"),a=-1!==e.indexOf("Weak"),i=o?"set":"add",s=BE[e],l=s&&s.prototype,c={};if(GE&&UE(s)&&(a||l.forEach&&!DE((function(){(new s).entries().next()})))){var p=(n=t((function(t,r){KE(NE(t,p),{type:e,collection:new s}),null!=r&&qE(r,t[i],{that:t,AS_ENTRIES:o})}))).prototype,d=JE(e);VE(["add","clear","delete","forEach","get","has","set","keys","values","entries"],(function(e){var t="add"==e||"set"==e;!(e in l)||a&&"clear"==e||zE(p,e,(function(r,n){var o=d(this).collection;if(!t&&a&&!ME(r))return"get"==e&&void 0;var i=o[e](0===r?0:r,n);return t?this:i}))})),a||WE(p,"size",{configurable:!0,get:function(){return d(this).collection.size}})}else n=r.getConstructor(t,e,o,i),FE.enable();return HE(n,e,!1,!0),c[e]=n,LE({global:!0,forced:!0},c),a||r.setStrong(n,e,o),n}("WeakMap",AO,bO);if($O&&SO){hO=bO.getConstructor(AO,"WeakMap",!0),vO.enable();var OO=EO.prototype,CO=gO(OO.delete),TO=gO(OO.has),jO=gO(OO.get),IO=gO(OO.set);yO(OO,{delete:function(e){if(xO(e)&&!wO(e)){var t=kO(this);return t.frozen||(t.frozen=new hO),CO(this,e)||t.frozen.delete(e)}return CO(this,e)},has:function(e){if(xO(e)&&!wO(e)){var t=kO(this);return t.frozen||(t.frozen=new hO),TO(this,e)||t.frozen.has(e)}return TO(this,e)},get:function(e){if(xO(e)&&!wO(e)){var t=kO(this);return t.frozen||(t.frozen=new hO),TO(this,e)?jO(this,e):t.frozen.get(e)}return jO(this,e)},set:function(e,t){if(xO(e)&&!wO(e)){var r=kO(this);r.frozen||(r.frozen=new hO),TO(this,e)?IO(this,e,t):r.frozen.set(e,t)}else IO(this,e,t);return this}})}const PO=dt({exports:{}}.exports=nr.WeakMap);var _O=ft,RO=hn("iterator"),LO=!_O((function(){var e=new URL("b?a=1&b=2&c=3","http://a"),t=e.searchParams,r="";return e.pathname="c%20d",t.forEach((function(e,n){t.delete("b"),r+=n+e})),!e.toJSON||!t.sort||"http://a/c%20d?a=1&c=3"!==e.href||"3"!==t.get("c")||"a=1"!==String(new URLSearchParams("?a=1"))||!t[RO]||"a"!==new URL("https://a@b").username||"b"!==new URLSearchParams(new URLSearchParams("a=b")).get("a")||"xn--e1aybc"!==new URL("http://тест").host||"#%D0%B1"!==new URL("http://a#б").hash||"a1c3"!==r||"x"!==new URL("http://x",void 0).host})),BO=ii,FO=Math.floor,DO=function(e,t){var r=e.length,n=FO(r/2);return r<8?zO(e,t):qO(e,DO(BO(e,0,n),t),DO(BO(e,n),t),t)},zO=function(e,t){for(var r,n,o=e.length,a=1;a<o;){for(n=a,r=e[a];n&&t(e[n-1],r)>0;)e[n]=e[--n];n!==a++&&(e[n]=r)}return e},qO=function(e,t,r,n){for(var o=t.length,a=r.length,i=0,s=0;i<o||s<a;)e[i+s]=i<o&&s<a?n(t[i],r[s])<=0?t[i++]:r[s++]:i<o?t[i++]:r[s++];return e},NO=Co,UO=ht,MO=lr,HO=Pt,WO=Et,VO=LO,GO=mi,KO=jm,JO=Ii,ZO=ap,YO=as,QO=Fm,XO=Ot,eC=Zr,tC=Yn,rC=va,nC=oo,oC=rr,aC=wa,iC=Va,sC=zt,lC=sf,cC=bh,pC=Wm,dC=DO,uC=hn("iterator"),hC=YO.set,fC=YO.getterFor("URLSearchParams"),mC=YO.getterFor("URLSearchParamsIterator"),gC=MO("fetch"),yC=MO("Request"),vC=MO("Headers"),bC=yC&&yC.prototype,xC=vC&&vC.prototype,wC=UO.RegExp,kC=UO.TypeError,$C=UO.decodeURIComponent,SC=UO.encodeURIComponent,AC=WO("".charAt),EC=WO([].join),OC=WO([].push),CC=WO("".replace),TC=WO([].shift),jC=WO([].splice),IC=WO("".split),PC=WO("".slice),_C=/\+/g,RC=Array(4),LC=function(e){return RC[e-1]||(RC[e-1]=wC("((?:%[\\da-f]{2}){"+e+"})","gi"))},BC=function(e){try{return $C(e)}catch(t){return e}},FC=function(e){var t=CC(e,_C," "),r=4;try{return $C(t)}catch(e){for(;r;)t=CC(t,LC(r--),BC);return t}},DC=/[!'()~]|%20/g,zC={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+"},qC=function(e){return zC[e]},NC=function(e){return CC(SC(e),DC,qC)},UC=ZO((function(e,t){hC(this,{type:"URLSearchParamsIterator",iterator:lC(fC(e).entries),kind:t})}),"Iterator",(function(){var e=mC(this),t=e.kind,r=e.iterator.next(),n=r.value;return r.done||(r.value="keys"===t?n.key:"values"===t?n.value:[n.key,n.value]),r}),!0),MC=function(e){this.entries=[],this.url=null,void 0!==e&&(oC(e)?this.parseObject(e):this.parseQuery("string"==typeof e?"?"===AC(e,0)?PC(e,1):e:aC(e)))};MC.prototype={type:"URLSearchParams",bindURL:function(e){this.url=e,this.update()},parseObject:function(e){var t,r,n,o,a,i,s,l=cC(e);if(l)for(r=(t=lC(e,l)).next;!(n=HO(r,t)).done;){if(a=(o=lC(nC(n.value))).next,(i=HO(a,o)).done||(s=HO(a,o)).done||!HO(a,o).done)throw kC("Expected sequence with length 2");OC(this.entries,{key:aC(i.value),value:aC(s.value)})}else for(var c in e)eC(e,c)&&OC(this.entries,{key:c,value:aC(e[c])})},parseQuery:function(e){if(e)for(var t,r,n=IC(e,"&"),o=0;o<n.length;)(t=n[o++]).length&&(r=IC(t,"="),OC(this.entries,{key:FC(TC(r)),value:FC(EC(r,"="))}))},serialize:function(){for(var e,t=this.entries,r=[],n=0;n<t.length;)e=t[n++],OC(r,NC(e.key)+"="+NC(e.value));return EC(r,"&")},update:function(){this.entries.length=0,this.parseQuery(this.url.query)},updateURL:function(){this.url&&this.url.update()}};var HC=function(){QO(this,WC);var e=arguments.length>0?arguments[0]:void 0;hC(this,new MC(e))},WC=HC.prototype;if(KO(WC,{append:function(e,t){pC(arguments.length,2);var r=fC(this);OC(r.entries,{key:aC(e),value:aC(t)}),r.updateURL()},delete:function(e){pC(arguments.length,1);for(var t=fC(this),r=t.entries,n=aC(e),o=0;o<r.length;)r[o].key===n?jC(r,o,1):o++;t.updateURL()},get:function(e){pC(arguments.length,1);for(var t=fC(this).entries,r=aC(e),n=0;n<t.length;n++)if(t[n].key===r)return t[n].value;return null},getAll:function(e){pC(arguments.length,1);for(var t=fC(this).entries,r=aC(e),n=[],o=0;o<t.length;o++)t[o].key===r&&OC(n,t[o].value);return n},has:function(e){pC(arguments.length,1);for(var t=fC(this).entries,r=aC(e),n=0;n<t.length;)if(t[n++].key===r)return!0;return!1},set:function(e,t){pC(arguments.length,1);for(var r,n=fC(this),o=n.entries,a=!1,i=aC(e),s=aC(t),l=0;l<o.length;l++)(r=o[l]).key===i&&(a?jC(o,l--,1):(a=!0,r.value=s));a||OC(o,{key:i,value:s}),n.updateURL()},sort:function(){var e=fC(this);dC(e.entries,(function(e,t){return e.key>t.key?1:-1})),e.updateURL()},forEach:function(e){for(var t,r=fC(this).entries,n=tC(e,arguments.length>1?arguments[1]:void 0),o=0;o<r.length;)n((t=r[o++]).value,t.key,this)},keys:function(){return new UC(this,"keys")},values:function(){return new UC(this,"values")},entries:function(){return new UC(this,"entries")}},{enumerable:!0}),GO(WC,uC,WC.entries,{name:"entries"}),GO(WC,"toString",(function(){return fC(this).serialize()}),{enumerable:!0}),JO(HC,"URLSearchParams"),NO({global:!0,forced:!VO},{URLSearchParams:HC}),!VO&&XO(vC)){var VC=WO(xC.has),GC=WO(xC.set),KC=function(e){if(oC(e)){var t,r=e.body;if("URLSearchParams"===rC(r))return t=e.headers?new vC(e.headers):new vC,VC(t,"content-type")||GC(t,"content-type","application/x-www-form-urlencoded;charset=UTF-8"),iC(e,{body:sC(0,aC(r)),headers:sC(0,t)})}return e};if(XO(gC)&&NO({global:!0,enumerable:!0,forced:!0},{fetch:function(e){return gC(e,arguments.length>1?KC(arguments[1]):{})}}),XO(yC)){var JC=function(e){return QO(this,bC),new yC(e,arguments.length>1?KC(arguments[1]):{})};bC.constructor=JC,JC.prototype=bC,NO({global:!0,forced:!0},{Request:JC})}}const ZC=dt({exports:{}}.exports=nr.URLSearchParams);function YC(e,t){function r(){Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack;for(var e=arguments.length,r=new Array(e),n=0;n<e;n++)r[n]=arguments[n];this.message=r[0],t&&t.apply(this,r)}return r.prototype=new Error,r.prototype.name=e,r.prototype.constructor=r,r}var QC={exports:{}},XC=QC.exports=function(e){return new eT(e)};function eT(e){this.value=e}function tT(e,t,r){var n=[],o=[],a=!0;return function e(i){var s=r?rT(i):i,l={},c=!0,p={node:s,node_:i,path:[].concat(n),parent:o[o.length-1],parents:o,key:n.slice(-1)[0],isRoot:0===n.length,level:n.length,circular:null,update:function(e,t){p.isRoot||(p.parent.node[p.key]=e),p.node=e,t&&(c=!1)},delete:function(e){delete p.parent.node[p.key],e&&(c=!1)},remove:function(e){aT(p.parent.node)?p.parent.node.splice(p.key,1):delete p.parent.node[p.key],e&&(c=!1)},keys:null,before:function(e){l.before=e},after:function(e){l.after=e},pre:function(e){l.pre=e},post:function(e){l.post=e},stop:function(){a=!1},block:function(){c=!1}};if(!a)return p;function d(){if("object"==typeof p.node&&null!==p.node){p.keys&&p.node_===p.node||(p.keys=nT(p.node)),p.isLeaf=0==p.keys.length;for(var e=0;e<o.length;e++)if(o[e].node_===i){p.circular=o[e];break}}else p.isLeaf=!0,p.keys=null;p.notLeaf=!p.isLeaf,p.notRoot=!p.isRoot}d();var u=t.call(p,p.node);return void 0!==u&&p.update&&p.update(u),l.before&&l.before.call(p,p.node),c?("object"!=typeof p.node||null===p.node||p.circular||(o.push(p),d(),iT(p.keys,(function(t,o){n.push(t),l.pre&&l.pre.call(p,p.node[t],t);var a=e(p.node[t]);r&&sT.call(p.node,t)&&(p.node[t]=a.node),a.isLast=o==p.keys.length-1,a.isFirst=0==o,l.post&&l.post.call(p,a),n.pop()})),o.pop()),l.after&&l.after.call(p,p.node),p):p}(e).node}function rT(e){if("object"==typeof e&&null!==e){var t;if(aT(e))t=[];else if("[object Date]"===oT(e))t=new Date(e.getTime?e.getTime():e);else if("[object RegExp]"===oT(e))t=new RegExp(e);else if(function(e){return"[object Error]"===oT(e)}(e))t={message:e.message};else if(function(e){return"[object Boolean]"===oT(e)}(e))t=new Boolean(e);else if(function(e){return"[object Number]"===oT(e)}(e))t=new Number(e);else if(function(e){return"[object String]"===oT(e)}(e))t=new String(e);else if(Object.create&&Object.getPrototypeOf)t=Object.create(Object.getPrototypeOf(e));else if(e.constructor===Object)t={};else{var r=e.constructor&&e.constructor.prototype||e.__proto__||{},n=function(){};n.prototype=r,t=new n}return iT(nT(e),(function(r){t[r]=e[r]})),t}return e}eT.prototype.get=function(e){for(var t=this.value,r=0;r<e.length;r++){var n=e[r];if(!t||!sT.call(t,n)){t=void 0;break}t=t[n]}return t},eT.prototype.has=function(e){for(var t=this.value,r=0;r<e.length;r++){var n=e[r];if(!t||!sT.call(t,n))return!1;t=t[n]}return!0},eT.prototype.set=function(e,t){for(var r=this.value,n=0;n<e.length-1;n++){var o=e[n];sT.call(r,o)||(r[o]={}),r=r[o]}return r[e[n]]=t,t},eT.prototype.map=function(e){return tT(this.value,e,!0)},eT.prototype.forEach=function(e){return this.value=tT(this.value,e,!1),this.value},eT.prototype.reduce=function(e,t){var r=1===arguments.length,n=r?this.value:t;return this.forEach((function(t){this.isRoot&&r||(n=e.call(this,n,t))})),n},eT.prototype.paths=function(){var e=[];return this.forEach((function(t){e.push(this.path)})),e},eT.prototype.nodes=function(){var e=[];return this.forEach((function(t){e.push(this.node)})),e},eT.prototype.clone=function(){var e=[],t=[];return function r(n){for(var o=0;o<e.length;o++)if(e[o]===n)return t[o];if("object"==typeof n&&null!==n){var a=rT(n);return e.push(n),t.push(a),iT(nT(n),(function(e){a[e]=r(n[e])})),e.pop(),t.pop(),a}return n}(this.value)};var nT=Object.keys||function(e){var t=[];for(var r in e)t.push(r);return t};function oT(e){return Object.prototype.toString.call(e)}var aT=Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)},iT=function(e,t){if(e.forEach)return e.forEach(t);for(var r=0;r<e.length;r++)t(e[r],r,e)};iT(nT(eT.prototype),(function(e){XC[e]=function(t){var r=[].slice.call(arguments,1),n=new eT(t);return n[e].apply(n,r)}}));var sT=Object.hasOwnProperty||function(e,t){return t in e},lT=["properties"],cT=["properties"],pT=["definitions","parameters","responses","securityDefinitions","components/schemas","components/responses","components/parameters","components/securitySchemes"],dT=["schema/example","items/example"];function uT(e){var t=e[e.length-1],r=e[e.length-2],n=e.join("/");return lT.indexOf(t)>-1&&-1===cT.indexOf(r)||pT.indexOf(n)>-1||dT.some((function(e){return n.indexOf(e)>-1}))}function hT(e,t){var r,n=Pf(e.split("#"),2),o=n[0],a=n[1],i=uu.resolve(o||"",t||"");return a?_b(r="".concat(i,"#")).call(r,a):i}var fT=/^([a-z]+:\/\/|\/\/)/i,mT=YC("JSONRefError",(function(e,t,r){this.originalError=r,Md(this,t||{})})),gT={},yT=new PO,vT=[function(e){return"paths"===e[0]&&"responses"===e[3]&&"examples"===e[5]},function(e){return"paths"===e[0]&&"responses"===e[3]&&"content"===e[5]&&"example"===e[7]},function(e){return"paths"===e[0]&&"responses"===e[3]&&"content"===e[5]&&"examples"===e[7]&&"value"===e[9]},function(e){return"paths"===e[0]&&"requestBody"===e[3]&&"content"===e[4]&&"example"===e[6]},function(e){return"paths"===e[0]&&"requestBody"===e[3]&&"content"===e[4]&&"examples"===e[6]&&"value"===e[8]},function(e){return"paths"===e[0]&&"parameters"===e[2]&&"example"===e[4]},function(e){return"paths"===e[0]&&"parameters"===e[3]&&"example"===e[5]},function(e){return"paths"===e[0]&&"parameters"===e[2]&&"examples"===e[4]&&"value"===e[6]},function(e){return"paths"===e[0]&&"parameters"===e[3]&&"examples"===e[5]&&"value"===e[7]},function(e){return"paths"===e[0]&&"parameters"===e[2]&&"content"===e[4]&&"example"===e[6]},function(e){return"paths"===e[0]&&"parameters"===e[2]&&"content"===e[4]&&"examples"===e[6]&&"value"===e[8]},function(e){return"paths"===e[0]&&"parameters"===e[3]&&"content"===e[4]&&"example"===e[7]},function(e){return"paths"===e[0]&&"parameters"===e[3]&&"content"===e[5]&&"examples"===e[7]&&"value"===e[9]}],bT={key:"$ref",plugin:function(e,t,r,n){var o,a=n.getInstance(),i=fS(r).call(r,0,-1);if(!uT(i)&&(o=i,!vT.some((function(e){return e(o)})))){var s=n.getContext(r).baseDoc;if("string"!=typeof e)return new mT("$ref: must be a string (JSON-Ref)",{$ref:e,baseDoc:s,fullPath:r});var l,c,p,d=$T(e),u=d[0],h=d[1]||"";try{l=s||u?wT(u,s):null}catch(t){return kT(t,{pointer:h,$ref:e,basePath:l,fullPath:r})}if(function(e,t,r,n){var o,a,i=yT.get(n);i||(i={},yT.set(n,i));var s,l=0===(s=r).length?"":"/".concat(Ob(s).call(s,TT).join("/")),c=_b(o="".concat(t||"<specmap-base>","#")).call(o,e),p=l.replace(/allOf\/\d+\/?/g,"");if(t===n.contextTree.get([]).baseDoc&&jT(p,e))return!0;var d="",u=r.some((function(e){var t;return d=_b(t="".concat(d,"/")).call(t,TT(e)),i[d]&&i[d].some((function(e){return jT(e,c)||jT(c,e)}))}));if(u)return!0;i[p]=_b(a=i[p]||[]).call(a,c)}(h,l,i,n)&&!a.useCircularStructures){var f=hT(e,l);return e===f?null:JA.replace(r,f)}if(null==l?(p=OT(h),void 0===(c=n.get(p))&&(c=new mT("Could not resolve reference: ".concat(e),{pointer:h,$ref:e,baseDoc:s,fullPath:r}))):c=null!=(c=ST(l,h)).l?c.l:c.catch((function(t){throw kT(t,{pointer:h,$ref:e,baseDoc:s,fullPath:r})})),c instanceof Error)return[JA.remove(r),c];var m=hT(e,l),g=JA.replace(i,c,{$$ref:m});if(l&&l!==s)return[g,JA.context(i,{baseDoc:l})];try{if(!function(e,t){var r=[e];return t.path.reduce((function(e,t){return r.push(e[t]),e[t]}),e),function e(t){return JA.isObject(t)&&(r.indexOf(t)>=0||Cb(t).some((function(r){return e(t[r])})))}(t.value)}(n.state,g)||a.useCircularStructures)return g}catch(o){return null}}}},xT=Md(bT,{docCache:gT,absoluteify:wT,clearCache:function(e){void 0!==e?delete gT[e]:Cb(gT).forEach((function(e){delete gT[e]}))},JSONRefError:mT,wrapError:kT,getDoc:AT,split:$T,extractFromDoc:ST,fetchJSON:function(e){return fetch(e,{headers:{Accept:"application/json, application/yaml"},loadSpec:!0}).then((function(e){return e.text()})).then((function(e){return lS.load(e)}))},extract:ET,jsonPointerToArray:OT,unescapeJsonPointerToken:CT});function wT(e,t){if(!fT.test(e)){var r;if(!t)throw new mT(_b(r="Tried to resolve a relative URL, without having a basePath. path: '".concat(e,"' basePath: '")).call(r,t,"'"));return uu.resolve(t,e)}return e}function kT(e,t){var r,n;return r=e&&e.response&&e.response.body?_b(n="".concat(e.response.body.code," ")).call(n,e.response.body.message):e.message,new mT("Could not resolve reference: ".concat(r),t,e)}function $T(e){return(e+"").split("#")}function ST(e,t){var r=gT[e];if(r&&!JA.isPromise(r))try{var n=ET(t,r);return Md(KS.resolve(n),{l:n})}catch(e){return KS.reject(e)}return AT(e).then((function(e){return ET(t,e)}))}function AT(e){var t=gT[e];return t?JA.isPromise(t)?t:KS.resolve(t):(gT[e]=xT.fetchJSON(e).then((function(t){return gT[e]=t,t})),gT[e])}function ET(e,t){var r=OT(e);if(r.length<1)return t;var n=JA.getIn(t,r);if(void 0===n)throw new mT("Could not resolve pointer: ".concat(e," does not exist in document"),{pointer:e});return n}function OT(e){var t;if("string"!=typeof e)throw new TypeError("Expected a string, got a ".concat(If(e)));return"/"===e[0]&&(e=e.substr(1)),""===e?[]:Ob(t=e.split("/")).call(t,CT)}function CT(e){return"string"!=typeof e?e:new ZC("=".concat(e.replace(/~1/g,"/").replace(/~0/g,"~"))).get("")}function TT(e){var t,r=new ZC([["",e.replace(/~/g,"~0").replace(/\//g,"~1")]]);return fS(t=r.toString()).call(t,1)}function jT(e,t){if(!(r=t)||"/"===r||"#"===r)return!0;var r,n=e.charAt(t.length),o=fS(t).call(t,-1);return 0===e.indexOf(t)&&(!n||"/"===n||"#"===n)&&"#"!==o}const IT={key:"allOf",plugin:function(e,t,r,n,o){if(!o.meta||!o.meta.$$ref){var a=fS(r).call(r,0,-1);if(!uT(a)){if(!Array.isArray(e)){var i=new TypeError("allOf must be an array");return i.fullPath=r,i}var s=!1,l=o.value;if(a.forEach((function(e){l&&(l=l[e])})),l=Od({},l),0!==Cb(l).length){delete l.allOf;var c,p,d=[];return d.push(n.replace(a,{})),e.forEach((function(e,t){if(!n.isObject(e)){if(s)return null;s=!0;var o=new TypeError("Elements in allOf must be objects");return o.fullPath=r,d.push(o)}d.push(n.mergeDeep(a,e));var i=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=r.specmap,o=r.getBaseUrlForNodePath,a=void 0===o?function(e){var r;return n.getContext(_b(r=[]).call(r,hS(t),hS(e))).baseDoc}:o,i=r.targetKeys,s=void 0===i?["$ref","$$ref"]:i,l=[];return QC.exports(e).forEach((function(){if(Vv(s).call(s,this.key)&&"string"==typeof this.node){var e=this.path,r=_b(t).call(t,this.path),o=hT(this.node,a(e));l.push(n.replace(r,o))}})),l}(e,fS(r).call(r,0,-1),{getBaseUrlForNodePath:function(e){var o;return n.getContext(_b(o=[]).call(o,hS(r),[t],hS(e))).baseDoc},specmap:n});d.push.apply(d,hS(i))})),l.example&&d.push(n.remove(_b(c=[]).call(c,a,"example"))),d.push(n.mergeDeep(a,l)),l.$$ref||d.push(n.remove(_b(p=[]).call(p,a,"$$ref"))),d}}}}},PT={key:"parameters",plugin:function(e,t,r,n){if(Array.isArray(e)&&e.length){var o=Md([],e),a=fS(r).call(r,0,-1),i=Od({},JA.getIn(n.spec,a));return e.forEach((function(e,t){try{o[t].default=n.parameterMacro(i,e)}catch(e){var a=new Error(e);return a.fullPath=r,a}})),JA.replace(r,o)}return JA.replace(r,e)}},_T={key:"properties",plugin:function(e,t,r,n){var o=Od({},e);for(var a in e)try{o[a].default=n.modelPropertyMacro(o[a])}catch(e){var i=new Error(e);return i.fullPath=r,i}return JA.replace(r,o)}};var RT=function(){function e(t){FS(this,e),this.root=LT(t||{})}return zS(e,[{key:"set",value:function(e,t){var r=this.getParent(e,!0);if(r){var n=e[e.length-1],o=r.children;o[n]?BT(o[n],t,r):o[n]=LT(t,r)}else BT(this.root,t,null)}},{key:"get",value:function(e){if((e=e||[]).length<1)return this.root.value;for(var t,r,n=this.root,o=0;o<e.length&&(r=e[o],(t=n.children)[r]);o+=1)n=t[r];return n&&n.protoValue}},{key:"getParent",value:function(e,t){return!e||e.length<1?null:e.length<2?this.root:fS(e).call(e,0,-1).reduce((function(e,r){if(!e)return e;var n=e.children;return!n[r]&&t&&(n[r]=LT(null,e)),n[r]}),this.root)}}]),e}();function LT(e,t){return BT({children:{}},e,t)}function BT(e,t,r){return e.value=t||{},e.protoValue=r?Od(Od({},r.protoValue),e.value):e.value,Cb(e.children).forEach((function(t){var r=e.children[t];e.children[t]=BT(r,r.value,e)})),e}var FT=function(){},DT=function(){function e(t){var r,n,o=this;FS(this,e),Md(this,{spec:"",debugLevel:"info",plugins:[],pluginHistory:{},errors:[],mutations:[],promisedPatches:[],state:{},patches:[],context:{},contextTree:new RT,showDebug:!1,allPatches:[],pluginProp:"specMap",libMethods:Md(Object.create(this),JA,{getInstance:function(){return o}}),allowMetaPatches:!1},t),this.get=this._get.bind(this),this.getContext=this._getContext.bind(this),this.hasRun=this._hasRun.bind(this),this.wrappedPlugins=Hb(r=Ob(n=this.plugins).call(n,this.wrapPlugin.bind(this))).call(r,JA.isFunction),this.patches.push(JA.add([],this.spec)),this.patches.push(JA.context([],this.context)),this.updatePatches(this.patches)}return zS(e,[{key:"debug",value:function(e){if(this.debugLevel===e){for(var t,r=arguments.length,n=new Array(r>1?r-1:0),o=1;o<r;o++)n[o-1]=arguments[o];(t=console).log.apply(t,n)}}},{key:"verbose",value:function(e){if("verbose"===this.debugLevel){for(var t,r,n=arguments.length,o=new Array(n>1?n-1:0),a=1;a<n;a++)o[a-1]=arguments[a];(t=console).log.apply(t,_b(r=["[".concat(e,"]   ")]).call(r,o))}}},{key:"wrapPlugin",value:function(e,t){var r,n,o,a=this.pathDiscriminator,i=null;return e[this.pluginProp]?(i=e,r=e[this.pluginProp]):JA.isFunction(e)?r=e:JA.isObject(e)&&(n=e,o=function(e,t){return!Array.isArray(e)||e.every((function(e,r){return e===t[r]}))},r=Iv.mark((function e(t,r){var i,s,l,c,p,d;return Iv.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:d=function(e,t,l){var c,p,u,h,f,m,g,y,v,b,x,w,k;return Iv.wrap((function(i){for(;;)switch(i.prev=i.next){case 0:if(JA.isObject(e)){i.next=6;break}if(n.key!==t[t.length-1]){i.next=4;break}return i.next=4,n.plugin(e,n.key,t,r);case 4:i.next=30;break;case 6:c=t.length-1,p=t[c],u=t.indexOf("properties"),h="properties"===p&&c===u,f=r.allowMetaPatches&&s[e.$$ref],m=0,g=Cb(e);case 12:if(!(m<g.length)){i.next=30;break}if(y=g[m],v=e[y],b=_b(t).call(t,y),x=JA.isObject(v),w=e.$$ref,f){i.next=22;break}if(!x){i.next=22;break}return r.allowMetaPatches&&w&&(s[w]=!0),i.delegateYield(d(v,b,l),"t0",22);case 22:if(h||y!==n.key){i.next=27;break}if(k=o(a,t),a&&!k){i.next=27;break}return i.next=27,n.plugin(v,y,b,r,l);case 27:m++,i.next=12;break;case 30:case"end":return i.stop()}}),i)},i=Iv.mark(d),s={},l=Cf(Hb(t).call(t,JA.isAdditiveMutation)),e.prev=4,l.s();case 6:if((c=l.n()).done){e.next=11;break}return p=c.value,e.delegateYield(d(p.value,p.path,p),"t0",9);case 9:e.next=6;break;case 11:e.next=16;break;case 13:e.prev=13,e.t1=e.catch(4),l.e(e.t1);case 16:return e.prev=16,l.f(),e.finish(16);case 19:case"end":return e.stop()}}),e,null,[[4,13,16,19]])}))),Md(r.bind(i),{pluginName:e.name||t,isGenerator:JA.isGenerator(r)})}},{key:"nextPlugin",value:function(){var e,t=this;return GS(e=this.wrappedPlugins).call(e,(function(e){return t.getMutationsForPlugin(e).length>0}))}},{key:"nextPromisedPatch",value:function(){var e;if(this.promisedPatches.length>0)return KS.race(Ob(e=this.promisedPatches).call(e,(function(e){return e.value})))}},{key:"getPluginHistory",value:function(e){var t=this.constructor.getPluginName(e);return this.pluginHistory[t]||[]}},{key:"getPluginRunCount",value:function(e){return this.getPluginHistory(e).length}},{key:"getPluginHistoryTip",value:function(e){var t=this.getPluginHistory(e);return t&&t[t.length-1]||{}}},{key:"getPluginMutationIndex",value:function(e){var t=this.getPluginHistoryTip(e).mutationIndex;return"number"!=typeof t?-1:t}},{key:"updatePluginHistory",value:function(e,t){var r=this.constructor.getPluginName(e);this.pluginHistory[r]=this.pluginHistory[r]||[],this.pluginHistory[r].push(t)}},{key:"updatePatches",value:function(e){var t=this;JA.normalizeArray(e).forEach((function(e){if(e instanceof Error)t.errors.push(e);else try{if(!JA.isObject(e))return void t.debug("updatePatches","Got a non-object patch",e);if(t.showDebug&&t.allPatches.push(e),JA.isPromise(e.value))return t.promisedPatches.push(e),void t.promisedPatchThen(e);if(JA.isContextPatch(e))return void t.setContext(e.path,e.value);if(JA.isMutation(e))return void t.updateMutations(e)}catch(e){console.error(e),t.errors.push(e)}}))}},{key:"updateMutations",value:function(e){"object"===If(e.value)&&!Array.isArray(e.value)&&this.allowMetaPatches&&(e.value=Od({},e.value));var t=JA.applyPatch(this.state,e,{allowMetaPatches:this.allowMetaPatches});t&&(this.mutations.push(e),this.state=t)}},{key:"removePromisedPatch",value:function(e){var t,r=this.promisedPatches.indexOf(e);r<0?this.debug("Tried to remove a promisedPatch that isn't there!"):dA(t=this.promisedPatches).call(t,r,1)}},{key:"promisedPatchThen",value:function(e){var t=this;return e.value=e.value.then((function(r){var n=Od(Od({},e),{},{value:r});t.removePromisedPatch(e),t.updatePatches(n)})).catch((function(r){t.removePromisedPatch(e),t.updatePatches(r)})),e.value}},{key:"getMutations",value:function(e,t){var r;return e=e||0,"number"!=typeof t&&(t=this.mutations.length),fS(r=this.mutations).call(r,e,t)}},{key:"getCurrentMutations",value:function(){return this.getMutationsForPlugin(this.getCurrentPlugin())}},{key:"getMutationsForPlugin",value:function(e){var t=this.getPluginMutationIndex(e);return this.getMutations(t+1)}},{key:"getCurrentPlugin",value:function(){return this.currentPlugin}},{key:"getLib",value:function(){return this.libMethods}},{key:"_get",value:function(e){return JA.getIn(this.state,e)}},{key:"_getContext",value:function(e){return this.contextTree.get(e)}},{key:"setContext",value:function(e,t){return this.contextTree.set(e,t)}},{key:"_hasRun",value:function(e){return this.getPluginRunCount(this.getCurrentPlugin())>(e||0)}},{key:"dispatch",value:function(){var e,t=this,r=this,n=this.nextPlugin();if(!n){var o=this.nextPromisedPatch();if(o)return o.then((function(){return t.dispatch()})).catch((function(){return t.dispatch()}));var a={spec:this.state,errors:this.errors};return this.showDebug&&(a.patches=this.allPatches),KS.resolve(a)}if(r.pluginCount=r.pluginCount||{},r.pluginCount[n]=(r.pluginCount[n]||0)+1,r.pluginCount[n]>100)return KS.resolve({spec:r.state,errors:_b(e=r.errors).call(e,new Error("We've reached a hard limit of ".concat(100," plugin runs")))});if(n!==this.currentPlugin&&this.promisedPatches.length){var i,s=Ob(i=this.promisedPatches).call(i,(function(e){return e.value}));return KS.all(Ob(s).call(s,(function(e){return e.then(FT,FT)}))).then((function(){return t.dispatch()}))}return function(){r.currentPlugin=n;var e=r.getCurrentMutations(),t=r.mutations.length-1;try{if(n.isGenerator){var o,a=Cf(n(e,r.getLib()));try{for(a.s();!(o=a.n()).done;)l(o.value)}catch(e){a.e(e)}finally{a.f()}}else l(n(e,r.getLib()))}catch(e){console.error(e),l([Md(Object.create(e),{plugin:n})])}finally{r.updatePluginHistory(n,{mutationIndex:t})}return r.dispatch()}();function l(e){e&&(e=JA.fullyNormalizeArray(e),r.updatePatches(e,n))}}}],[{key:"getPluginName",value:function(e){return e.pluginName}},{key:"getPatchesOfType",value:function(e,t){return Hb(e).call(e,t)}}]),e}(),zT={refs:xT,allOf:IT,parameters:PT,properties:_T},qT=function(e){return String.prototype.toLowerCase.call(e)},NT=function(e){return e.replace(/[^\w]/gi,"_")};function UT(e){var t=e.openapi;return!!t&&du(t).call(t,"3")}function MT(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},o=n.v2OperationIdCompatibilityMode;if(!e||"object"!==If(e))return null;var a=(e.operationId||"").replace(/\s/g,"");return a.length?NT(e.operationId):HT(t,r,{v2OperationIdCompatibilityMode:o})}function HT(e,t){var r,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o=n.v2OperationIdCompatibilityMode;if(o){var a,i,s=_b(a="".concat(t.toLowerCase(),"_")).call(a,e).replace(/[\s!@#$%^&*()_+=[{\]};:<>|./?,\\'""-]/g,"_");return(s=s||_b(i="".concat(e.substring(1),"_")).call(i,t)).replace(/((_){2,})/g,"_").replace(/^(_)*/g,"").replace(/([_])*$/g,"")}return _b(r="".concat(qT(t))).call(r,NT(e))}function WT(e,t){var r;return _b(r="".concat(qT(t),"-")).call(r,e)}function VT(e,t){return e&&e.paths?GT(e,(function(e){var r=e.pathName,n=e.method,o=e.operation;if(!o||"object"!==If(o))return!1;var a=o.operationId;return[MT(o,r,n),WT(r,n),a].some((function(e){return e&&e===t}))}),!0)||null:null}function GT(e,t,r){if(!e||"object"!==If(e)||!e.paths||"object"!==If(e.paths))return null;var n=e.paths;for(var o in n)for(var a in n[o])if("PARAMETERS"!==a.toUpperCase()){var i=n[o][a];if(i&&"object"===If(i)){var s={spec:e,pathName:o,method:a.toUpperCase(),operation:i},l=t(s);if(r&&l)return s}}}function KT(e){var t=e.spec,r=t.paths,n={};if(!r||t.$$normalized)return e;for(var o in r){var a,i=r[o];if(null!=i&&Vv(a=["object","function"]).call(a,If(i))){var s=i.parameters,l=function(e){var r,a=i[e];if(null==a||!Vv(r=["object","function"]).call(r,If(a)))return"continue";var l=MT(a,o,e);if(l){n[l]?n[l].push(a):n[l]=[a];var c=n[l];if(c.length>1)c.forEach((function(e,t){var r;e.p=e.p||e.operationId,e.operationId=_b(r="".concat(l)).call(r,t+1)}));else if(void 0!==a.operationId){var p=c[0];p.p=p.p||a.operationId,p.operationId=l}}if("parameters"!==e){var d=[],u={};for(var h in t)"produces"!==h&&"consumes"!==h&&"security"!==h||(u[h]=t[h],d.push(u));if(s&&(u.parameters=s,d.push(u)),d.length){var f,m=Cf(d);try{for(m.s();!(f=m.n()).done;){var g=f.value;for(var y in g)if(a[y]){if("parameters"===y){var v,b=Cf(g[y]);try{var x=function(){var e=v.value;a[y].some((function(t){return t.name&&t.name===e.name||t.$ref&&t.$ref===e.$ref||t.$$ref&&t.$$ref===e.$$ref||t===e}))||a[y].push(e)};for(b.s();!(v=b.n()).done;)x()}catch(e){b.e(e)}finally{b.f()}}}else a[y]=g[y]}}catch(e){m.e(e)}finally{m.f()}}}};for(var c in i)l(c)}}return t.$$normalized=!0,e}function JT(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=t.requestInterceptor,n=t.responseInterceptor,o=e.withCredentials?"include":"same-origin";return function(t){return e({url:t,loadSpec:!0,requestInterceptor:r,responseInterceptor:n,headers:{Accept:"application/json, application/yaml"},credentials:o}).then((function(e){return e.body}))}}function ZT(e){var t=e.fetch,r=e.spec,n=e.url,o=e.mode,a=e.allowMetaPatches,i=void 0===a||a,s=e.pathDiscriminator,l=e.modelPropertyMacro,c=e.parameterMacro,p=e.requestInterceptor,d=e.responseInterceptor,u=e.skipNormalization,h=e.useCircularStructures,f=e.http,m=e.baseDoc;return m=m||n,f=t||f||wS,r?g(r):JT(f,{requestInterceptor:p,responseInterceptor:d})(m).then(g);function g(e){m&&(zT.refs.docCache[m]=e),zT.refs.fetchJSON=JT(f,{requestInterceptor:p,responseInterceptor:d});var t,r,n=[zT.refs];return"function"==typeof c&&n.push(zT.parameters),"function"==typeof l&&n.push(zT.properties),"strict"!==o&&n.push(zT.allOf),(t={spec:e,context:{baseDoc:m},plugins:n,allowMetaPatches:i,pathDiscriminator:s,parameterMacro:c,modelPropertyMacro:l,useCircularStructures:h},new DT(t).dispatch()).then(u?(r=Tv(Iv.mark((function e(t){return Iv.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",t);case 1:case"end":return e.stop()}}),e)}))),function(e){return r.apply(this,arguments)}):KT)}}var YT=Array.isArray,QT="object"==typeof global&&global&&global.Object===Object&&global,XT="object"==typeof self&&self&&self.Object===Object&&self,ej=QT||XT||Function("return this")(),tj=ej.Symbol,rj=tj,nj=Object.prototype,oj=nj.hasOwnProperty,aj=nj.toString,ij=rj?rj.toStringTag:void 0,sj=Object.prototype.toString,lj=function(e){var t=oj.call(e,ij),r=e[ij];try{e[ij]=void 0;var n=!0}catch(e){}var o=aj.call(e);return n&&(t?e[ij]=r:delete e[ij]),o},cj=tj?tj.toStringTag:void 0,pj=function(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":cj&&cj in Object(e)?lj(e):function(e){return sj.call(e)}(e)},dj=pj,uj=function(e){return"symbol"==typeof e||function(e){return null!=e&&"object"==typeof e}(e)&&"[object Symbol]"==dj(e)},hj=YT,fj=uj,mj=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,gj=/^\w*$/,yj=function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)},vj=pj,bj=yj,xj=ej.i,wj=function(){var e=/[^.]+$/.exec(xj&&xj.keys&&xj.keys.IE_PROTO||"");return e?"Symbol(src)_1."+e:""}(),kj=Function.prototype.toString,$j=function(e){if(!bj(e))return!1;var t=vj(e);return"[object Function]"==t||"[object GeneratorFunction]"==t||"[object AsyncFunction]"==t||"[object Proxy]"==t},Sj=function(e){return!!wj&&wj in e},Aj=yj,Ej=/^\[object .+?Constructor\]$/,Oj=Function.prototype,Cj=Object.prototype,Tj=Oj.toString,jj=Cj.hasOwnProperty,Ij=RegExp("^"+Tj.call(jj).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),Pj=function(e){return!(!Aj(e)||Sj(e))&&($j(e)?Ij:Ej).test(function(e){if(null!=e){try{return kj.call(e)}catch(e){}try{return e+""}catch(e){}}return""}(e))},_j=function(e,t){var r=function(e,t){return null==e?void 0:e[t]}(e,t);return Pj(r)?r:void 0},Rj=_j(Object,"create"),Lj=Rj,Bj=Rj,Fj=Object.prototype.hasOwnProperty,Dj=Rj,zj=Object.prototype.hasOwnProperty,qj=Rj,Nj=function(){this.v=Lj?Lj(null):{},this.size=0},Uj=function(e){var t=this.has(e)&&delete this.v[e];return this.size-=t?1:0,t},Mj=function(e){var t=this.v;if(Bj){var r=t[e];return"__lodash_hash_undefined__"===r?void 0:r}return Fj.call(t,e)?t[e]:void 0},Hj=function(e){var t=this.v;return Dj?void 0!==t[e]:zj.call(t,e)},Wj=function(e,t){var r=this.v;return this.size+=this.has(e)?0:1,r[e]=qj&&void 0===t?"__lodash_hash_undefined__":t,this};function Vj(e){var t=-1,r=null==e?0:e.length;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}Vj.prototype.clear=Nj,Vj.prototype.delete=Uj,Vj.prototype.get=Mj,Vj.prototype.has=Hj,Vj.prototype.set=Wj;var Gj=Vj,Kj=function(e,t){return e===t||e!=e&&t!=t},Jj=function(e,t){for(var r=e.length;r--;)if(Kj(e[r][0],t))return r;return-1},Zj=Jj,Yj=Array.prototype.splice,Qj=Jj,Xj=Jj,eI=Jj,tI=function(){this.v=[],this.size=0},rI=function(e){var t=this.v,r=Zj(t,e);return!(r<0||(r==t.length-1?t.pop():Yj.call(t,r,1),--this.size,0))},nI=function(e){var t=this.v,r=Qj(t,e);return r<0?void 0:t[r][1]},oI=function(e,t){var r=this.v,n=eI(r,e);return n<0?(++this.size,r.push([e,t])):r[n][1]=t,this};function aI(e){var t=-1,r=null==e?0:e.length;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}aI.prototype.clear=tI,aI.prototype.delete=rI,aI.prototype.get=nI,aI.prototype.has=function(e){return Xj(this.v,e)>-1},aI.prototype.set=oI;var iI=aI,sI=_j(ej,"Map"),lI=Gj,cI=iI,pI=sI,dI=function(e){var t=typeof e;return"string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==e:null===e},uI=function(e,t){var r=e.v;return dI(t)?r["string"==typeof t?"string":"hash"]:r.map},hI=uI,fI=uI,mI=uI,gI=uI,yI=function(e,t){var r=gI(this,e),n=r.size;return r.set(e,t),this.size+=r.size==n?0:1,this};function vI(e){var t=-1,r=null==e?0:e.length;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}vI.prototype.clear=function(){this.size=0,this.v={hash:new lI,map:new(pI||cI),string:new lI}},vI.prototype.delete=function(e){var t=hI(this,e).delete(e);return this.size-=t?1:0,t},vI.prototype.get=function(e){return fI(this,e).get(e)},vI.prototype.has=function(e){return mI(this,e).has(e)},vI.prototype.set=yI;var bI=vI;function xI(e,t){if("function"!=typeof e||null!=t&&"function"!=typeof t)throw new TypeError("Expected a function");var r=function(){var n=arguments,o=t?t.apply(this,n):n[0],a=r.cache;if(a.has(o))return a.get(o);var i=e.apply(this,n);return r.cache=a.set(o,i)||a,i};return r.cache=new(xI.Cache||bI),r}xI.Cache=bI;var wI=xI,kI=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,$I=/\\(\\)?/g,SI=function(e){var t=wI((function(e){var t=[];return 46===e.charCodeAt(0)&&t.push(""),e.replace(kI,(function(e,r,n,o){t.push(n?o.replace($I,"$1"):r||e)})),t}),(function(e){return 500===r.size&&r.clear(),e})),r=t.cache;return t}(),AI=SI,EI=function(e,t){for(var r=-1,n=null==e?0:e.length,o=Array(n);++r<n;)o[r]=t(e[r],r,e);return o},OI=YT,CI=uj,TI=tj?tj.prototype:void 0,jI=TI?TI.toString:void 0,II=function e(t){if("string"==typeof t)return t;if(OI(t))return EI(t,e)+"";if(CI(t))return jI?jI.call(t):"";var r=t+"";return"0"==r&&1/t==-1/0?"-0":r},PI=YT,_I=function(e,t){if(hj(e))return!1;var r=typeof e;return!("number"!=r&&"symbol"!=r&&"boolean"!=r&&null!=e&&!fj(e))||gj.test(e)||!mj.test(e)||null!=t&&e in Object(t)},RI=AI,LI=uj,BI=function(e,t){return PI(e)?e:_I(e,t)?[e]:RI(function(e){return null==e?"":II(e)}(e))},FI=function(e){if("string"==typeof e||LI(e))return e;var t=e+"";return"0"==t&&1/e==-1/0?"-0":t},DI=function(e,t){for(var r=0,n=(t=BI(t,e)).length;null!=e&&r<n;)e=e[FI(t[r++])];return r&&r==n?e:void 0},zI=function(e,t,r){var n=null==e?void 0:DI(e,t);return void 0===n?r:n};function qI(){return qI=Tv(Iv.mark((function e(t,r){var n,o,a,i,s,l,c,p,d,u,h,f,m=arguments;return Iv.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=m.length>2&&void 0!==m[2]?m[2]:{},o=n.returnEntireTree,a=n.baseDoc,i=n.requestInterceptor,s=n.responseInterceptor,l=n.parameterMacro,c=n.modelPropertyMacro,p=n.useCircularStructures,d={pathDiscriminator:r,baseDoc:a,requestInterceptor:i,responseInterceptor:s,parameterMacro:l,modelPropertyMacro:c,useCircularStructures:p},u=KT({spec:t}),h=u.spec,e.next=6,ZT(Od(Od({},d),{},{spec:h,allowMetaPatches:!0,skipNormalization:!0}));case 6:return f=e.sent,!o&&Array.isArray(r)&&r.length&&(f.spec=zI(f.spec,r)||null),e.abrupt("return",f);case 9:case"end":return e.stop()}}),e)}))),qI.apply(this,arguments)}var NI=function(){return null},UI=function(e){var t=e.spec,r=e.cb,n=void 0===r?NI:r,o=e.defaultTag,a=void 0===o?"default":o,i=e.v2OperationIdCompatibilityMode,s={},l={};return GT(t,(function(e){var r,o=e.pathName,c=e.method,p=e.operation;(p.tags?(r=p.tags,Array.isArray(r)?r:[r]):[a]).forEach((function(e){if("string"==typeof e){l[e]=l[e]||{};var r,a=l[e],d=MT(p,o,c,{v2OperationIdCompatibilityMode:i}),u=n({spec:t,pathName:o,method:c,operation:p,operationId:d});if(s[d])s[d]+=1,a[_b(r="".concat(d)).call(r,s[d])]=u;else if(void 0!==a[d]){var h,f,m=s[d]||1;s[d]=m+1,a[_b(h="".concat(d)).call(h,s[d])]=u;var g=a[d];delete a[d],a[_b(f="".concat(d)).call(f,m)]=g}else a[d]=u}}))})),l},MI=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return function(t){var r=t.pathName,n=t.method,o=t.operationId;return function(t){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=e.requestInterceptor,s=e.responseInterceptor,l=e.userFetch;return e.execute(Od({spec:e.spec,requestInterceptor:i,responseInterceptor:s,userFetch:l,pathName:r,method:n,parameters:t,operationId:o},a))}}},HI=Co,WI=Wo.indexOf,VI=qp,GI=Et([].indexOf),KI=!!GI&&1/GI([1],1,-0)<0,JI=VI("indexOf");HI({target:"Array",proto:!0,forced:KI||!JI},{indexOf:function(e){var t=arguments.length>1?arguments[1]:void 0;return KI?GI(this,e,t)||0:WI(this,e,t)}});var ZI=ic("Array").indexOf,YI=cr,QI=ZI,XI=Array.prototype;const eP=dt({exports:{}}.exports=function(e){var t=e.indexOf;return e===XI||YI(XI,e)&&t===XI.indexOf?QI:t});var tP=function(e,t,r){var n=r||{},o=n.encode||oP;if("function"!=typeof o)throw new TypeError("option encode is invalid");if(!nP.test(e))throw new TypeError("argument name is invalid");var a=o(t);if(a&&!nP.test(a))throw new TypeError("argument val is invalid");var i,s=e+"="+a;if(null!=n.maxAge){var l=n.maxAge-0;if(isNaN(l)||!isFinite(l))throw new TypeError("option maxAge is invalid");s+="; Max-Age="+Math.floor(l)}if(n.domain){if(!nP.test(n.domain))throw new TypeError("option domain is invalid");s+="; Domain="+n.domain}if(n.path){if(!nP.test(n.path))throw new TypeError("option path is invalid");s+="; Path="+n.path}if(n.expires){var c=n.expires;if(i=c,!("[object Date]"===rP.call(i)||i instanceof Date)||isNaN(c.valueOf()))throw new TypeError("option expires is invalid");s+="; Expires="+c.toUTCString()}if(n.httpOnly&&(s+="; HttpOnly"),n.secure&&(s+="; Secure"),n.priority)switch("string"==typeof n.priority?n.priority.toLowerCase():n.priority){case"low":s+="; Priority=Low";break;case"medium":s+="; Priority=Medium";break;case"high":s+="; Priority=High";break;default:throw new TypeError("option priority is invalid")}if(n.sameSite)switch("string"==typeof n.sameSite?n.sameSite.toLowerCase():n.sameSite){case!0:s+="; SameSite=Strict";break;case"lax":s+="; SameSite=Lax";break;case"strict":s+="; SameSite=Strict";break;case"none":s+="; SameSite=None";break;default:throw new TypeError("option sameSite is invalid")}return s},rP=Object.prototype.toString,nP=/^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;function oP(e){return encodeURIComponent(e)}function aP(e){return"[object Object]"===Object.prototype.toString.call(e)}function iP(e){var t,r;return!1!==aP(e)&&(void 0===(t=e.constructor)||!1!==aP(r=t.prototype)&&!1!==r.hasOwnProperty("isPrototypeOf"))}const sP={body:function(e){var t=e.req,r=e.value;t.body=r},header:function(e){var t=e.req,r=e.parameter,n=e.value;t.headers=t.headers||{},void 0!==n&&(t.headers[r.name]=n)},query:function(e){var t=e.req,r=e.value,n=e.parameter;if(t.query=t.query||{},!1===r&&"boolean"===n.type&&(r="false"),0===r&&["number","integer"].indexOf(n.type)>-1&&(r="0"),r)t.query[n.name]={collectionFormat:n.collectionFormat,value:r};else if(n.allowEmptyValue&&void 0!==r){var o=n.name;t.query[o]=t.query[o]||{},t.query[o].allowEmptyValue=!0}},path:function(e){var t=e.req,r=e.value,n=e.parameter;t.url=t.url.split("{".concat(n.name,"}")).join(encodeURIComponent(r))},formData:function(e){var t=e.req,r=e.value,n=e.parameter;(r||n.allowEmptyValue)&&(t.form=t.form||{},t.form[n.name]={value:r,allowEmptyValue:n.allowEmptyValue,collectionFormat:n.collectionFormat})}};function lP(e,t){return Vv(t).call(t,"application/json")?"string"==typeof e?e:wb(e):e.toString()}var cP=["accept","authorization","content-type"];const pP=Object.freeze(Object.defineProperty({__proto__:null,path:function(e){var t=e.req,r=e.value,n=e.parameter,o=n.name,a=n.style,i=n.explode,s=n.content;if(s){var l=Cb(s)[0];t.url=t.url.split("{".concat(o,"}")).join(yS(lP(r,l),{escape:!0}))}else{var c=vS({key:n.name,value:r,style:a||"simple",explode:i||!1,escape:!0});t.url=t.url.split("{".concat(o,"}")).join(c)}},query:function(e){var t=e.req,r=e.value,n=e.parameter;if(t.query=t.query||{},n.content){var o=Cb(n.content)[0];t.query[n.name]=lP(r,o)}else if(!1===r&&(r="false"),0===r&&(r="0"),r){var a=n.style,i=n.explode,s=n.allowReserved;t.query[n.name]={value:r,serializationOption:{style:a,explode:i,allowReserved:s}}}else if(n.allowEmptyValue&&void 0!==r){var l=n.name;t.query[l]=t.query[l]||{},t.query[l].allowEmptyValue=!0}},header:function(e){var t=e.req,r=e.parameter,n=e.value;if(t.headers=t.headers||{},!(cP.indexOf(r.name.toLowerCase())>-1))if(r.content){var o=Cb(r.content)[0];t.headers[r.name]=lP(n,o)}else void 0!==n&&(t.headers[r.name]=vS({key:r.name,value:n,style:r.style||"simple",explode:void 0!==r.explode&&r.explode,escape:!1}))},cookie:function(e){var t=e.req,r=e.parameter,n=e.value;t.headers=t.headers||{};var o=If(n);if(r.content){var a,i=Cb(r.content)[0];t.headers.Cookie=_b(a="".concat(r.name,"=")).call(a,lP(n,i))}else if("undefined"!==o){var s="object"===o&&!Array.isArray(n)&&r.explode?"":"".concat(r.name,"=");t.headers.Cookie=s+vS({key:r.name,value:n,escape:!1,style:r.style||"form",explode:void 0!==r.explode&&r.explode})}}},Symbol.toStringTag,{value:"Module"}));Co({global:!0},{globalThis:ht});const dP=dt({exports:{}}.exports={exports:{}}.exports=ht);var uP=(void 0!==dP?dP:"undefined"!=typeof self?self:window).btoa;var hP=["http","fetch","spec","operationId","pathName","method","parameters","securities"],fP=function(e){return Array.isArray(e)?e:[]},mP=YC("OperationNotFoundError",(function(e,t,r){this.originalError=r,Md(this,t||{})})),gP={buildRequest:yP};function yP(e){var t,r,n=e.spec,o=e.operationId,a=e.responseContentType,i=e.scheme,s=e.requestInterceptor,l=e.responseInterceptor,c=e.contextUrl,p=e.userFetch,d=e.server,u=e.serverVariables,h=e.http,f=e.signal,m=e.parameters,g=e.parameterBuilders,y=UT(n);g||(g=y?pP:sP);var v={url:"",credentials:h&&h.withCredentials?"include":"same-origin",headers:{},cookies:{}};f&&(v.signal=f),s&&(v.requestInterceptor=s),l&&(v.responseInterceptor=l),p&&(v.userFetch=p);var b=VT(n,o);if(!b)throw new mP("Operation ".concat(o," not found"));var x=b.operation,w=void 0===x?{}:x,k=b.method,$=b.pathName;if(v.url+=bP({spec:n,scheme:i,contextUrl:c,server:d,serverVariables:u,pathName:$,method:k}),!o)return delete v.cookies,v;v.url+=$,v.method="".concat(k).toUpperCase(),m=m||{};var S=n.paths[$]||{};a&&(v.headers.accept=a);var A=function(e){var t={};e.forEach((function(e){t[e.in]||(t[e.in]={}),t[e.in][e.name]=e}));var r=[];return Cb(t).forEach((function(e){Cb(t[e]).forEach((function(n){r.push(t[e][n])}))})),r}(_b(t=_b(r=[]).call(r,fP(w.parameters))).call(t,fP(S.parameters)));A.forEach((function(e){var t,r,o,a,i=g[e.in];if("body"===e.in&&e.schema&&e.schema.properties&&(t=m),void 0===(t=e&&e.name&&m[e.name]))t=e&&e.name&&m[_b(r="".concat(e.in,".")).call(r,e.name)];else if((o=e.name,a=A,Hb(a).call(a,(function(e){return e.name===o}))).length>1){var s;console.warn(_b(s="Parameter '".concat(e.name,"' is ambiguous because the defined spec has more than one parameter with the name: '")).call(s,e.name,"' and the passed-in parameter values did not define an 'in' value."))}if(null!==t){if(void 0!==e.default&&void 0===t&&(t=e.default),void 0===t&&e.required&&!e.allowEmptyValue)throw new Error("Required parameter ".concat(e.name," is not provided"));if(y&&e.schema&&"object"===e.schema.type&&"string"==typeof t)try{t=JSON.parse(t)}catch(o){throw new Error("Could not parse object parameter value string as JSON")}i&&i({req:v,parameter:e,value:t,operation:w,spec:n})}}));var E=Od(Od({},e),{},{operation:w});if((v=y?function(e,t){var r,n,o,a,i,s,l,c,p,d,u,h,f,m=e.operation,g=e.requestBody,y=e.securities,v=e.spec,b=e.attachContentTypeForEmptyPayload,x=e.requestContentType;a=void 0===(o=(r={request:t,securities:y,operation:m,spec:v}).securities)?{}:o,s=void 0===(i=r.operation)?{}:i,l=r.spec,c=Od({},n=r.request),p=a.authorized,d=void 0===p?{}:p,u=s.security||l.security||[],h=d&&!!Cb(d).length,f=zI(l,["components","securitySchemes"])||{},c.headers=c.headers||{},c.query=c.query||{},t=Cb(a).length&&h&&u&&(!Array.isArray(s.security)||s.security.length)?(u.forEach((function(e){Cb(e).forEach((function(e){var t=d[e],r=f[e];if(t){var n=t.value||t,o=r.type;if(t)if("apiKey"===o)"query"===r.in&&(c.query[r.name]=n),"header"===r.in&&(c.headers[r.name]=n),"cookie"===r.in&&(c.cookies[r.name]=n);else if("http"===o){if(/^basic$/i.test(r.scheme)){var a,i=n.username||"",s=n.password||"",l=uP(_b(a="".concat(i,":")).call(a,s));c.headers.Authorization="Basic ".concat(l)}/^bearer$/i.test(r.scheme)&&(c.headers.Authorization="Bearer ".concat(n))}else if("oauth2"===o||"openIdConnect"===o){var p,u=t.token||{},h=u[r["x-tokenName"]||"access_token"],m=u.token_type;m&&"bearer"!==m.toLowerCase()||(m="Bearer"),c.headers.Authorization=_b(p="".concat(m," ")).call(p,h)}}}))})),c):n;var w=m.requestBody||{},k=Cb(w.content||{}),$=x&&k.indexOf(x)>-1;if(g||b){if(x&&$)t.headers["Content-Type"]=x;else if(!x){var S=k[0];S&&(t.headers["Content-Type"]=S,x=S)}}else x&&$&&(t.headers["Content-Type"]=x);if(!e.responseContentType&&m.responses){var A,E=Hb(A=Mb(m.responses)).call(A,(function(e){var t=Pf(e,2),r=t[0],n=t[1],o=parseInt(r,10);return o>=200&&o<300&&iP(n.content)})).reduce((function(e,t){var r=Pf(t,2)[1];return _b(e).call(e,Cb(r.content))}),[]);E.length>0&&(t.headers.accept=E.join(", "))}if(g)if(x){if(k.indexOf(x)>-1)if("application/x-www-form-urlencoded"===x||"multipart/form-data"===x)if("object"===If(g)){var O=(w.content[x]||{}).encoding||{};t.form={},Cb(g).forEach((function(e){t.form[e]={value:g[e],encoding:O[e]||{}}}))}else t.form=g;else t.body=g}else t.body=g;return t}(E,v):function(e,t){var r,n,o,a,i,s,l,c,p,d,u,h,f,m,g,y,v,b=e.spec,x=e.operation,w=e.securities,k=e.requestContentType,$=e.responseContentType,S=e.attachContentTypeForEmptyPayload;if(s=void 0===(i=(o={request:t,securities:w,operation:x,spec:b}).securities)?{}:i,c=void 0===(l=o.operation)?{}:l,p=o.spec,d=Od({},a=o.request),u=s.authorized,h=void 0===u?{}:u,f=s.specSecurity,m=void 0===f?[]:f,g=c.security||m,y=h&&!!Cb(h).length,v=p.securityDefinitions,d.headers=d.headers||{},d.query=d.query||{},(t=Cb(s).length&&y&&g&&(!Array.isArray(c.security)||c.security.length)?(g.forEach((function(e){Cb(e).forEach((function(e){var t=h[e];if(t){var r=t.token,n=t.value||t,o=v[e],a=o.type,i=o["x-tokenName"]||"access_token",s=r&&r[i],l=r&&r.token_type;if(t)if("apiKey"===a){var c="query"===o.in?"query":"headers";d[c]=d[c]||{},d[c][o.name]=n}else if("basic"===a)if(n.header)d.headers.authorization=n.header;else{var p,u=n.username||"",f=n.password||"";n.base64=uP(_b(p="".concat(u,":")).call(p,f)),d.headers.authorization="Basic ".concat(n.base64)}else if("oauth2"===a&&s){var m;l=l&&"bearer"!==l.toLowerCase()?l:"Bearer",d.headers.authorization=_b(m="".concat(l," ")).call(m,s)}}}))})),d):a).body||t.form||S)if(k)t.headers["Content-Type"]=k;else if(Array.isArray(x.consumes)){var A=Pf(x.consumes,1);t.headers["Content-Type"]=A[0]}else if(Array.isArray(b.consumes)){var E=Pf(b.consumes,1);t.headers["Content-Type"]=E[0]}else x.parameters&&Hb(r=x.parameters).call(r,(function(e){return"file"===e.type})).length?t.headers["Content-Type"]="multipart/form-data":x.parameters&&Hb(n=x.parameters).call(n,(function(e){return"formData"===e.in})).length&&(t.headers["Content-Type"]="application/x-www-form-urlencoded");else if(k){var O,C,T=x.parameters&&Hb(O=x.parameters).call(O,(function(e){return"body"===e.in})).length>0,j=x.parameters&&Hb(C=x.parameters).call(C,(function(e){return"formData"===e.in})).length>0;(T||j)&&(t.headers["Content-Type"]=k)}return!$&&Array.isArray(x.produces)&&x.produces.length>0&&(t.headers.accept=x.produces.join(", ")),t}(E,v)).cookies&&Cb(v.cookies).length){var O=Cb(v.cookies).reduce((function(e,t){var r=v.cookies[t];return e+(e?"&":"")+tP(t,r)}),"");v.headers.Cookie=O}return v.cookies&&delete v.cookies,BS(v),v}var vP=function(e){return e?e.replace(/\W/g,""):null};function bP(e){return UT(e.spec)?function(e){var t=e.spec,r=e.pathName,n=e.method,o=e.server,a=e.contextUrl,i=e.serverVariables,s=void 0===i?{}:i,l=zI(t,["paths",r,(n||"").toLowerCase(),"servers"])||zI(t,["paths",r,"servers"])||zI(t,["servers"]),c="",p=null;if(o&&l&&l.length){var d=Ob(l).call(l,(function(e){return e.url}));d.indexOf(o)>-1&&(c=o,p=l[d.indexOf(o)])}if(!c&&l&&l.length){c=l[0].url;var u=Pf(l,1);p=u[0]}c.indexOf("{")>-1&&function(e){for(var t,r=[],n=/{([^}]+)}/g;t=n.exec(e);)r.push(t[1]);return r}(c).forEach((function(e){if(p.variables&&p.variables[e]){var t=p.variables[e],r=s[e]||t.default,n=new RegExp("{".concat(e,"}"),"g");c=c.replace(n,r)}}));return function(){var e,t,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",o=r&&n?uu.parse(uu.resolve(n,r)):uu.parse(r),a=uu.parse(n),i=vP(o.protocol)||vP(a.protocol)||"",s=o.host||a.host,l=o.pathname||"";return"/"===(e=i&&s?_b(t="".concat(i,"://")).call(t,s+l):l)[e.length-1]?fS(e).call(e,0,-1):e}(c,a)}(e):function(e){var t,r,n=e.spec,o=e.scheme,a=e.contextUrl,i=void 0===a?"":a,s=uu.parse(i),l=Array.isArray(n.schemes)?n.schemes[0]:null,c=o||l||vP(s.protocol)||"http",p=n.host||s.host||"",d=n.basePath||"";return"/"===(t=c&&p?_b(r="".concat(c,"://")).call(r,p+d):d)[t.length-1]?fS(t).call(t,0,-1):t}(e)}function xP(e){var t=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if("string"==typeof e?r.url=e:r=e,!(this instanceof xP))return new xP(r);Md(this,r);var n=this.resolve().then((function(){return t.disableInterfaces||Md(t,xP.makeApisTagOperation(t)),t}));return n.client=this,n}function wP(e){const t=(e=e.replace("[]","Array")).split("/");return t[0]=t[0].replace(/[^A-Za-z0-9_\-\.]+|\s+/gm,"_"),t.join("/")}xP.http=wS,xP.makeHttp=function(e,t,r){return r=r||function(e){return e},t=t||function(e){return e},function(n){return"string"==typeof n&&(n={url:n}),xS.mergeInQueryOrForm(n),n=t(n),r(e(n))}}.bind(null,xP.http),xP.resolve=ZT,xP.resolveSubtree=function(e,t){return qI.apply(this,arguments)},xP.execute=function(e){var t=e.http,r=e.fetch,n=e.spec,o=e.operationId,a=e.pathName,i=e.method,s=e.parameters,l=e.securities,c=function(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=ia(e);for(n=0;n<a.length;n++)r=a[n],eP(t).call(t,r)>=0||(o[r]=e[r]);return o}(e,t);if(Xl){var a=Xl(e);for(n=0;n<a.length;n++)r=a[n],eP(t).call(t,r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}(e,hP),p=t||r||wS;a&&i&&!o&&(o=WT(a,i));var d=gP.buildRequest(Od({spec:n,operationId:o,parameters:s,securities:l,http:p},c));return d.body&&(iP(d.body)||Array.isArray(d.body))&&(d.body=wb(d.body)),p(d)},xP.serializeRes=AS,xP.serializeHeaders=OS,xP.clearCache=function(){zT.refs.clearCache()},xP.makeApisTagOperation=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=MI(e);return{apis:UI({v2OperationIdCompatibilityMode:e.v2OperationIdCompatibilityMode,spec:e.spec,cb:t})}},xP.buildRequest=yP,xP.helpers={opId:MT},xP.getBaseUrl=bP,xP.prototype={http:wS,execute:function(e){return this.applyDefaults(),xP.execute(Od({spec:this.spec,http:this.http,securities:{authorized:this.authorizations},contextUrl:"string"==typeof this.url?this.url:void 0,requestInterceptor:this.requestInterceptor||null,responseInterceptor:this.responseInterceptor||null},e))},resolve:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return xP.resolve(Od({spec:this.spec,url:this.url,http:this.http||this.fetch,allowMetaPatches:this.allowMetaPatches,useCircularStructures:this.useCircularStructures,requestInterceptor:this.requestInterceptor||null,responseInterceptor:this.responseInterceptor||null,skipNormalization:this.skipNormalization||!1},t)).then((function(t){return e.originalSpec=e.spec,e.spec=t.spec,e.errors=t.errors,e}))}},xP.prototype.applyDefaults=function(){var e=this.spec,t=this.url;if(t&&du(t).call(t,"http")){var r=uu.parse(t);e.host||(e.host=r.host),e.schemes||(e.schemes=[r.protocol.replace(":","")]),e.basePath||(e.basePath="/")}},xP.helpers;const kP={parameterTypeProperties:["format","minimum","maximum","exclusiveMinimum","exclusiveMaximum","minLength","maxLength","multipleOf","minItems","maxItems","uniqueItems","minProperties","maxProperties","additionalProperties","pattern","enum","default"],arrayProperties:["items","minItems","maxItems","uniqueItems"],httpMethods:["get","post","put","delete","patch","head","options","trace"],uniqueOnly:function(e,t,r){return r.indexOf(e)===t},createHash:function(e){let t,r=0;if(0===e.length)return r;for(let n=0;n<e.length;n++)t=e.charCodeAt(n),r=(r<<5)-r+t,r|=0;return r},sanitise:wP,sanitiseAll:function(e){return wP(e.split("/").join("_"))},camelize:function(e){return e.toLowerCase().replace(/[-_ \/\.](.)/g,((e,t)=>t.toUpperCase()))},clone:function(e){return JSON.parse(JSON.stringify(e))},circularClone:function e(t,r=null){if(r||(r=new WeakMap),Object(t)!==t||t instanceof Function)return t;if(r.has(t))return r.get(t);let n;try{n=new t.constructor}catch(e){n=Object.create(Object.getPrototypeOf(t))}return r.set(t,n),Object.assign(n,...Object.keys(t).map((n=>({[n]:e(t[n],r)}))))}};function $P(){return{depth:0,seen:new WeakMap,top:!0,combine:!1,allowRefSiblings:!1}}const SP=function e(t,r,n,o){if(void 0===n.depth&&(n=$P()),null==t)return t;if(n.combine&&(t.allOf&&Array.isArray(t.allOf)&&1===t.allOf.length&&delete(t={...t.allOf[0],...t})?.allOf,t?.anyOf&&Array.isArray(t.anyOf)&&1===t.anyOf.length&&delete(t={...t.anyOf[0],...t})?.anyOf,t?.oneOf&&Array.isArray(t.oneOf)&&1===t.oneOf.length&&delete(t={...t.oneOf[0],...t})?.oneOf),o(t,r,n),n.seen.has(t))return t;if("object"==typeof t&&null!==t&&n.seen.set(t,!0),n.top=!1,n.depth++,void 0!==t?.items&&(n.property="items",e(t.items,t,n,o)),t?.additionalItems&&"object"==typeof t.additionalItems&&(n.property="additionalItems",e(t.additionalItems,t,n,o)),t?.additionalProperties&&"object"==typeof t.additionalProperties&&(n.property="additionalProperties",e(t.additionalProperties,t,n,o)),t?.properties)for(const r in t.properties){const a=t.properties[r];n.property=`properties/${r}`,e(a,t,n,o)}if(t?.patternProperties)for(const r in t.patternProperties){const a=t.patternProperties[r];n.property=`patternProperties/${r}`,e(a,t,n,o)}if(t?.allOf)for(const r in t.allOf){const a=t.allOf[r];n.property=`allOf/${r}`,e(a,t,n,o)}if(t?.anyOf)for(const r in t.anyOf){const a=t.anyOf[r];n.property=`anyOf/${r}`,e(a,t,n,o)}if(t?.oneOf)for(const r in t.oneOf){const a=t.oneOf[r];n.property=`oneOf/${r}`,e(a,t,n,o)}return t?.not&&(n.property="not",e(t.not,t,n,o)),n.depth--,t};function AP(e,t,r){if(t||(t={depth:0}),t.depth||(t={path:"#",depth:0,pkey:"",parent:{},payload:{},seen:new WeakMap,identity:!1,identityDetection:!1,...t}),"object"!=typeof e)return;const n=t.path;for(const o in e){if(t.key=o,t.path=`${t.path}/${encodeURIComponent(o)}`,t.identityPath=t.seen.get(e[o]),t.identity=void 0!==t.identityPath,e.hasOwnProperty(o)&&r(e,o,t),"object"==typeof e[o]&&!t.identity){t.identityDetection&&!Array.isArray(e[o])&&null!==e[o]&&t.seen.set(e[o],t.path);const n={};n.parent=e,n.path=t.path,n.depth=t.depth?t.depth+1:1,n.pkey=o,n.payload=t.payload,n.seen=t.seen,n.identity=!1,n.identityDetection=t.identityDetection,AP(e[o],n,r)}t.path=n}}let EP;function OP(e,t){for(const r in e)r.startsWith("x-")&&!r.startsWith("x-s2o")&&(t[r]=e[r])}function CP(e,t){SP(e,{},{},((e,r)=>{!function(e){if(e["x-required"]&&Array.isArray(e["x-required"])&&(e.required||(e.required=[]),e.required=e.required.concat(e["x-required"]),delete e["x-required"]),e["x-anyOf"]&&(e.anyOf=e["x-anyOf"],delete e["x-anyOf"]),e["x-oneOf"]&&(e.oneOf=e["x-oneOf"],delete e["x-oneOf"]),e["x-not"]&&(e.not=e["x-not"],delete e["x-not"]),"boolean"==typeof e["x-nullable"]&&(e.nullable=e["x-nullable"],delete e["x-nullable"]),"object"==typeof e["x-discriminator"]&&"string"==typeof e["x-discriminator"].propertyName){e.discriminator=e["x-discriminator"],delete e["x-discriminator"];for(const t in e.discriminator.mapping){const r=e.discriminator.mapping[t];r.startsWith("#/definitions/")&&(e.discriminator.mapping[t]=r.replace("#/definitions/","#/components/schemas/"))}}}(e),function(e,t,r){if(e.nullable&&r.patches++,e.discriminator&&"string"==typeof e.discriminator&&(e.discriminator={propertyName:e.discriminator}),e.items&&Array.isArray(e.items)&&(0===e.items.length?e.items={}:1===e.items.length?e.items=e.items[0]:e.items={anyOf:e.items}),e.type&&Array.isArray(e.type)){if(r.patches++,r.warnings.push("(Patchable) schema type must not be an array"),0===e.type.length)delete e.type;else{e.oneOf||(e.oneOf=[]);for(const t of e.type){const r={};if("null"===t)e.nullable=!0;else{r.type=t;for(const t of kP.arrayProperties)void 0!==e.prop&&(r[t]=e[t],delete e[t])}r.type&&e.oneOf.push(r)}delete e.type,0===e.oneOf.length?delete e.oneOf:e.oneOf.length<2&&(e.type=e.oneOf[0].type,Object.keys(e.oneOf[0]).length>1&&(r.patches++,r.warnings.push("Lost properties from oneOf")),delete e.oneOf)}e.type&&Array.isArray(e.type)&&1===e.type.length&&(e.type=e.type[0])}e.type&&"null"===e.type&&(delete e.type,e.nullable=!0),"array"!==e.type||e.items||(e.items={}),"file"===e.type&&(e.type="string",e.format="binary"),"boolean"==typeof e.required&&(e.required&&e.name&&(void 0===t.required&&(t.required=[]),Array.isArray(t.required)&&t.required.push(e.name)),delete e.required),e.xml&&"string"==typeof e.xml.namespace&&(e.xml.namespace||delete e.xml.namespace),e.allowEmptyValue&&(delete e.allowEmptyValue,r.patches++,r.warnings.push("(Patchable): deleted schema.allowEmptyValue"))}(e,r,t)}))}function TP(e){for(const t in e)for(const r in e[t]){const n=kP.sanitise(r);r!==n&&(e[t][n]=e[t][r],delete e[t][r])}}function jP(e,t){if("basic"===e.type&&(e.type="http",e.scheme="basic"),"oauth2"===e.type){const r={};let n=e.flow;"application"===e.flow&&(n="clientCredentials"),"accessCode"===e.flow&&(n="authorizationCode"),"string"==typeof e.authorizationUrl&&(r.authorizationUrl=e.authorizationUrl.split("?")[0].trim()||"/"),"string"==typeof e.tokenUrl&&(r.tokenUrl=e.tokenUrl.split("?")[0].trim()||"/"),r.scopes=e.scopes||{},e.flows={},e.flows[n]=r,delete e.flow,delete e.authorizationUrl,delete e.tokenUrl,delete e.scopes,e.name&&(delete e.name,t.patches++,t.warnings.push("(Patchable) oauth2 securitySchemes should not have name property"))}}function IP(e){return e&&!e["x-s2o-delete"]}function PP(e,t){if(e.type&&!e.schema&&(e.schema={}),e.type&&(e.schema.type=e.type),e.items&&"array"!==e.items.type){if(e.items.collectionFormat!==e.collectionFormat)return t.errCount++,void t.errors.push({message:"Nested collectionFormats are not supported",pointer:"/.../responses/header"});delete e.items.collectionFormat}"array"===e.type?("ssv"===e.collectionFormat?(t.patches++,t.warnings.push("collectionFormat:ssv is no longer supported for headers")):"pipes"===e.collectionFormat?(t.patches++,t.warnings.push("collectionFormat:pipes is no longer supported for headers")):"multi"===e.collectionFormat?e.explode=!0:"tsv"===e.collectionFormat?(e["x-collectionFormat"]="tsv",t.patches++,t.warnings.push("collectionFormat:tsv is no longer supported")):e.style="simple",delete e.collectionFormat):e.collectionFormat&&(delete e.collectionFormat,t.patches++,t.warnings.push("(Patchable) collectionFormat is only applicable to header.type array")),delete e.type;for(const t of kP.parameterTypeProperties)void 0!==e[t]&&(e.schema[t]=e[t],delete e[t]);for(const t of kP.arrayProperties)void 0!==e[t]&&(e.schema[t]=e[t],delete e[t])}function _P(e,t,r,n,o,a,i){const s={};let l,c=!0;t&&t.consumes&&"string"==typeof t.consumes&&(t.consumes=[t.consumes],i.patches++,i.warnings.push("(Patchable) operation.consumes must be an array")),Array.isArray(a.consumes)||delete a.consumes;const p=((t?t.consumes:null)||a.consumes||[]).filter(kP.uniqueOnly);if(e&&(e.name||e.in)){"boolean"==typeof e["x-deprecated"]&&(e.deprecated=e["x-deprecated"],delete e["x-deprecated"]),void 0!==e["x-example"]&&(e.example=e["x-example"],delete e["x-example"]),"body"===e.in||e.type||(e.type="string",i.patches++,i.warnings.push("(Patchable) parameter.type is mandatory for non-body parameters")),"file"===e.type&&(e["x-s2o-originalType"]=e.type,l=e.type),null===e.description&&delete e.description;let t=e.collectionFormat;if("array"!==e.type||t||(t="csv"),t&&("array"!==e.type&&(delete e.collectionFormat,i.patches++,i.warnings.push("(Patchable) collectionFormat is only applicable to param.type array")),"csv"!==t||"query"!==e.in&&"cookie"!==e.in||(e.style="form",e.explode=!1),"csv"!==t||"path"!==e.in&&"header"!==e.in||(e.style="simple"),"ssv"===t&&("query"===e.in?e.style="spaceDelimited":i.warnings.push(`${e.name} collectionFormat:ssv is no longer supported except for in:query parameters`)),"pipes"===t&&("query"===e.in?e.style="pipeDelimited":i.warnings.push(`${e.name} collectionFormat:pipes is no longer supported except for in:query parameters`)),"multi"===t&&(e.explode=!0),"tsv"===t&&(i.warnings.push("collectionFormat:tsv is no longer supported"),e["x-collectionFormat"]="tsv"),delete e.collectionFormat),e.type&&"body"!==e.type&&"formData"!==e.in)if(e.items&&e.schema)i.warnings.push(`${e.name} parameter has array,items and schema`);else{e.schema&&i.patches++,e.schema&&"object"==typeof e.schema||(e.schema={}),e.schema.type=e.type,e.items&&(e.schema.items=e.items,delete e.items,AP(e.schema.items,null,((r,n)=>{"collectionFormat"===n&&"string"==typeof r[n]&&(t&&r[n]!==t&&i.warnings.push(`${e.name} Nested collectionFormats are not supported`),delete r[n])})));for(const t of kP.parameterTypeProperties)void 0!==e[t]&&(e.schema[t]=e[t]),delete e[t]}e.schema&&CP(e.schema,i),e["x-ms-skip-url-encoding"]&&"query"===e.in&&(e.allowReserved=!0,delete e["x-ms-skip-url-encoding"])}if(e&&"formData"===e.in){c=!1,s.content={};let t="application/x-www-form-urlencoded";if(p.length&&p.indexOf("multipart/form-data")>=0&&(t="multipart/form-data"),s.content[t]={},e.schema)s.content[t].schema=e.schema;else{s.content[t].schema={},s.content[t].schema.type="object",s.content[t].schema.properties={},s.content[t].schema.properties[e.name]={};const r=s.content[t].schema,n=s.content[t].schema.properties[e.name];e.description&&(n.description=e.description),e.example&&(n.example=e.example),e.type&&(n.type=e.type);for(const t of kP.parameterTypeProperties)void 0!==e[t]&&(n[t]=e[t]);!0===e.required&&(r.required||(r.required=[]),r.required.push(e.name),s.required=!0),void 0!==e.default&&(n.default=e.default),n.properties&&(n.properties=e.properties),e.allOf&&(n.allOf=e.allOf),"array"===e.type&&e.items&&(n.items=e.items,n.items.collectionFormat&&delete n.items.collectionFormat),"file"!==l&&"file"!==e["x-s2o-originalType"]||(n.type="string",n.format="binary"),OP(e,n)}}else e&&"file"===e.type&&(e.required&&(s.required=e.required),s.content={},s.content["application/octet-stream"]={},s.content["application/octet-stream"].schema={},s.content["application/octet-stream"].schema.type="string",s.content["application/octet-stream"].schema.format="binary",OP(e,s));if(e&&"body"===e.in){s.content={},e.name&&(s["x-s2o-name"]=(t&&t.operationId?kP.sanitiseAll(t.operationId):"")+kP.camelize(`_${e.name}`)),e.description&&(s.description=e.description),e.required&&(s.required=e.required),p.length||p.push("application/json");for(const t of p)s.content[t]={},s.content[t].schema=kP.clone(e.schema||{}),CP(s.content[t].schema,i);OP(e,s)}if(Object.keys(s).length>0&&(e["x-s2o-delete"]=!0,t))if(t.requestBody&&c){t.requestBody["x-s2o-overloaded"]=!0;const e=t.operationId||o;i.warnings.push(`Operation ${e} has multiple requestBodies`)}else t.requestBody||(t=function(e,t){const r={};for(const n of Object.keys(e))r[n]=e[n],"parameters"===n&&(r.requestBody={},t.rbname&&(r[t.rbname]=""));return r.requestBody={},r}(t,i),r[n]=t),t.requestBody.content&&t.requestBody.content["multipart/form-data"]&&t.requestBody.content["multipart/form-data"].schema&&t.requestBody.content["multipart/form-data"].schema.properties&&s.content["multipart/form-data"]&&s.content["multipart/form-data"].schema&&s.content["multipart/form-data"].schema.properties?(t.requestBody.content["multipart/form-data"].schema.properties=Object.assign(t.requestBody.content["multipart/form-data"].schema.properties,s.content["multipart/form-data"].schema.properties),t.requestBody.content["multipart/form-data"].schema.required=(t.requestBody.content["multipart/form-data"].schema.required||[]).concat(s.content["multipart/form-data"].schema.required||[]),t.requestBody.content["multipart/form-data"].schema.required.length||delete t.requestBody.content["multipart/form-data"].schema.required):t.requestBody.content&&t.requestBody.content["application/x-www-form-urlencoded"]&&t.requestBody.content["application/x-www-form-urlencoded"].schema&&t.requestBody.content["application/x-www-form-urlencoded"].schema.properties&&s.content["application/x-www-form-urlencoded"]&&s.content["application/x-www-form-urlencoded"].schema&&s.content["application/x-www-form-urlencoded"].schema.properties?(t.requestBody.content["application/x-www-form-urlencoded"].schema.properties=Object.assign(t.requestBody.content["application/x-www-form-urlencoded"].schema.properties,s.content["application/x-www-form-urlencoded"].schema.properties),t.requestBody.content["application/x-www-form-urlencoded"].schema.required=(t.requestBody.content["application/x-www-form-urlencoded"].schema.required||[]).concat(s.content["application/x-www-form-urlencoded"].schema.required||[]),t.requestBody.content["application/x-www-form-urlencoded"].schema.required.length||delete t.requestBody.content["application/x-www-form-urlencoded"].schema.required):(t.requestBody=Object.assign(t.requestBody,s),t.requestBody["x-s2o-name"]||t.operationId&&(t.requestBody["x-s2o-name"]=kP.sanitiseAll(t.operationId)));if(e&&!e["x-s2o-delete"]){delete e.type;for(const t of kP.parameterTypeProperties)delete e[t];"path"!==e.in||void 0!==e.required&&!0===e.required||(e.required=!0,i.patches++,i.warnings.push(`(Patchable) path parameters must be required:true [${e.name} in ${o}]`))}return t}function RP(e,t,r,n){if(!e)return!1;if(e.description||"object"!=typeof e||Array.isArray(e)||(n.patches++,n.warnings.push("(Patchable) response.description is mandatory")),void 0!==e.schema){CP(e.schema,n),t&&t.produces&&"string"==typeof t.produces&&(t.produces=[t.produces],n.patches++,n.warnings.push("(Patchable) operation.produces must be an array")),r.produces&&!Array.isArray(r.produces)&&delete r.produces;const o=((t?t.produces:null)||r.produces||[]).filter(kP.uniqueOnly);o.length||o.push("*/*"),e.content={};for(const t of o){if(e.content[t]={},e.content[t].schema=kP.clone(e.schema),e.examples&&e.examples[t]){const r={};r.value=e.examples[t],e.content[t].examples={},e.content[t].examples.response=r,delete e.examples[t]}"file"===e.content[t].schema.type&&(e.content[t].schema={type:"string",format:"binary"})}delete e.schema}for(const t in e.examples)e.content||(e.content={}),e.content[t]||(e.content[t]={}),e.content[t].examples={},e.content[t].examples.response={},e.content[t].examples.response.value=e.examples[t];if(delete e.examples,e.headers)for(const t in e.headers)"status code"===t.toLowerCase()?(delete e.headers[t],n.patches++,n.warnings.push('(Patchable) "Status Code" is not a valid header')):PP(e.headers[t],n)}function LP(e,t,r,n,o){for(const a in e){const i=e[a];i&&i["x-trace"]&&"object"==typeof i["x-trace"]&&(i.trace=i["x-trace"],delete i["x-trace"]),i&&i["x-summary"]&&"string"==typeof i["x-summary"]&&(i.summary=i["x-summary"],delete i["x-summary"]),i&&i["x-description"]&&"string"==typeof i["x-description"]&&(i.description=i["x-description"],delete i["x-description"]),i&&i["x-servers"]&&Array.isArray(i["x-servers"])&&(i.servers=i["x-servers"],delete i["x-servers"]);for(const e in i)if(kP.httpMethods.indexOf(e)>=0||"x-amazon-apigateway-any-method"===e){let s=i[e];if(s&&s.parameters&&Array.isArray(s.parameters)){if(i.parameters)for(const t of i.parameters)s.parameters.find((e=>e.name===t.name&&e.in===t.in))||"formData"!==t.in&&"body"!==t.in&&"file"!==t.type||(s=_P(t,s,i,e,a,o,r));for(const t of s.parameters)s=_P(t,s,i,e,`${e}: ${a}`,o,r);s.parameters&&(s.parameters=s.parameters.filter(IP))}if(s&&s.security&&TP(s.security),"object"==typeof s){if(!s.responses){const e={description:"Default response"};s.responses={default:e}}for(const e in s.responses)RP(s.responses[e],s,o,r)}if(s&&s["x-servers"]&&Array.isArray(s["x-servers"]))s.servers=s["x-servers"],delete s["x-servers"];else if(s&&s.schemes&&s.schemes.length)for(const e of s.schemes)if((!o.schemes||o.schemes.indexOf(e)<0)&&(s.servers||(s.servers=[]),Array.isArray(o.servers)))for(const e of o.servers){const t=kP.clone(e);s.servers.push(t)}if(s){if(delete s.consumes,delete s.produces,delete s.schemes,s["x-ms-examples"]){for(const e in s["x-ms-examples"]){const t=s["x-ms-examples"][e],r=kP.sanitiseAll(e);if(t.parameters)for(const r in t.parameters){const n=t.parameters[r];for(const t of(s.parameters||[]).concat(i.parameters||[]))t.name!==r||t.example||(t.examples||(t.examples={}),t.examples[e]={value:n})}if(t.responses)for(const n in t.responses){if(t.responses[n].headers)for(const e in t.responses[n].headers){const r=t.responses[n].headers[e];for(const t in s.responses[n].headers)t===e&&(s.responses[n].headers[t].example=r)}if(t.responses[n].body&&(o.components.examples[r]={value:kP.clone(t.responses[n].body)},s.responses[n]&&s.responses[n].content))for(const t in s.responses[n].content){const o=s.responses[n].content[t];o.examples||(o.examples={}),o.examples[e]={$ref:`#/components/examples/${r}`}}}}delete s["x-ms-examples"]}if(s.parameters&&0===s.parameters.length&&delete s.parameters,s.requestBody){const r=s.operationId?kP.sanitiseAll(s.operationId):kP.camelize(kP.sanitiseAll(e+a)),o=kP.sanitise(s.requestBody["x-s2o-name"]||r||"");delete s.requestBody["x-s2o-name"];const i=JSON.stringify(s.requestBody),l=kP.createHash(i);if(!n[l]){const e={};e.name=o,e.body=s.requestBody,e.refs=[],n[l]=e}const c=`#/${t}/${encodeURIComponent(a)}/${e}/requestBody`;n[l].refs.push(c)}}}if(i&&i.parameters){for(const e in i.parameters)_P(i.parameters[e],null,i,null,a,o,r);Array.isArray(i.parameters)&&(i.parameters=i.parameters.filter(IP))}}}function BP(e){return e&&e.url&&"string"==typeof e.url?(e.url=e.url.split("{{").join("{"),e.url=e.url.split("}}").join("}"),e.url.replace(/\{(.+?)\}/g,((t,r)=>{e.variables||(e.variables={}),e.variables[r]={default:"unknown"}})),e):e}function FP(e,t){void 0!==e.info&&null!==e.info||(e.info={version:"",title:""},t.patches++,t.warnings.push("(Patchable) info object is mandatory")),("object"!=typeof e.info||Array.isArray(e.info))&&(t.errCount++,t.errors.push({message:"info must be an object",pointer:"/info"})),e.info&&(void 0===e.info.title&&(t.patches++,e.info.title="",t.warnings.push({message:"(Patchable) info.title cannot be null",pointer:"/info/title",patchable:!0})),void 0===e.info.version?(t.patches++,e.info.version="",t.warnings.push("(Patchable) info.version cannot be null")):"string"!=typeof e.info.version&&(t.patches++,e.info.version=e.info.version.toString(),t.warnings.push("(Patchable) info.version must be a string")))}function DP(e,t){e.paths||(t.patches++,e.paths={},t.warnings.push("(Patchable) paths object is mandatory"))}function zP(e={}){const t={original:e,openapi:{},patches:0,warnings:[],errCount:0,errors:[]};if(e.openapi&&"string"==typeof e.openapi&&e.openapi.startsWith("3."))return t.openapi=kP.circularClone(e),FP(t.openapi,t),DP(t.openapi,t),t;if("2.0"!==e.swagger)return t.errCount++,t.errors.push({message:`Unsupported swagger/OpenAPI version: ${e.openapi?e.openapi:e.swagger}`,pointer:"/swagger"}),t;if(t.openapi=kP.circularClone(e),t.openapi.openapi="3.0.0",delete t.openapi.swagger,AP(t.openapi,{},((e,t,r)=>{null===e[t]&&!t.startsWith("x-")&&"default"!==t&&r.path.indexOf("/example")<0&&delete e[t]})),e.host)(e.schemes||[]).forEach((r=>{const n={},o=(e.basePath||"").replace(/\/$/,"");n.url=`${r?`${r}:`:""}//${e.host}${o}`,BP(n),t.openapi.servers||(t.openapi.servers=[]),t.openapi.servers.push(n)}));else if(e.basePath){const r={};r.url=e.basePath,BP(r),t.openapi.servers||(t.openapi.servers=[]),t.openapi.servers.push(r)}if(delete t.openapi.host,delete t.openapi.basePath,e["x-ms-parameterized-host"]){const r=e["x-ms-parameterized-host"],n={};n.url=r.hostTemplate+(e.basePath?e.basePath:""),n.variables={};const o=n.url.match(/\{\w+\}/g);for(const e in r.parameters){const t=r.parameters[e];e.startsWith("x-")||(delete t.required,delete t.type,delete t.in,void 0===t.default&&(t.enum?t.default=t.enum[0]:t.default="none"),t.name||(t.name=o[e].replace("{","").replace("}","")),n.variables[t.name]=t,delete t.name)}t.openapi.servers||(t.openapi.servers=[]),!1===r.useSchemePrefix?t.openapi.servers.push(n):e.schemes.forEach((e=>{t.openapi.servers.push({...n,url:`${e}://${n.url}`})})),delete t.openapi["x-ms-parameterized-host"]}return FP(t.openapi,t),DP(t.openapi,t),"string"==typeof t.openapi.consumes&&(t.openapi.consumes=[t.openapi.consumes]),"string"==typeof t.openapi.produces&&(t.openapi.produces=[t.openapi.produces]),t.openapi.components={},t.openapi["x-callbacks"]&&(t.openapi.components.callbacks=t.openapi["x-callbacks"],delete t.openapi["x-callbacks"]),t.openapi.components.examples={},t.openapi.components.headers={},t.openapi["x-links"]&&(t.openapi.components.links=t.openapi["x-links"],delete t.openapi["x-links"]),t.openapi.components.parameters=t.openapi.parameters||{},t.openapi.components.responses=t.openapi.responses||{},t.openapi.components.requestBodies={},t.openapi.components.securitySchemes=t.openapi.securityDefinitions||{},t.openapi.components.schemas=t.openapi.definitions||{},delete t.openapi.definitions,delete t.openapi.responses,delete t.openapi.parameters,delete t.openapi.securityDefinitions,function(e){const t=e.openapi,r={};EP={schemas:{}},t.security&&TP(t.security);for(const r in t.components.securitySchemes){const n=kP.sanitise(r);if(r!==n){if(t.components.securitySchemes[n])return e.errCount++,e.errors.push({message:`Duplicate sanitised securityScheme name ${n}`,pointer:`/components/securitySchemes/${n}`}),e;t.components.securitySchemes[n]=t.components.securitySchemes[r],delete t.components.securitySchemes[r]}jP(t.components.securitySchemes[n],e)}for(const r in t.components.schemas){const n=kP.sanitiseAll(r);let o=0;if(r!==n){for(;t.components.schemas[n+o];)o=o?++o:2;t.components.schemas[n+o]=t.components.schemas[r],delete t.components.schemas[r]}EP.schemas[r]=n+o,CP(t.components.schemas[`${n}${o}`],e)}for(const r in t.components.parameters){const n=kP.sanitise(r);if(r!==n){if(t.components.parameters[n])return e.errCount++,e.errors.push({message:`Duplicate sanitised parameter name ${n}`,pointer:`/components/parameters/${n}`}),e;t.components.parameters[n]=t.components.parameters[r],delete t.components.parameters[r]}_P(t.components.parameters[n],null,null,null,n,t,e)}for(const r in t.components.responses){const n=kP.sanitise(r);if(r!==n){if(t.components.responses[n])return e.errCount++,e.errors.push({message:`Duplicate sanitised response name ${n}`,pointer:`/components/responses/${n}`}),e;t.components.responses[n]=t.components.responses[r],delete t.components.responses[r]}const o=t.components.responses[n];if(RP(o,null,t,e),o.headers)for(const t in o.headers)"status code"===t.toLowerCase()?(delete o.headers[t],e.patches++,e.warnings.push('(Patchable) "Status Code" is not a valid header')):PP(o.headers[t],e)}for(const e in t.components.requestBodies){const n=t.components.requestBodies[e],o=JSON.stringify(n),a=kP.createHash(o),i={};i.name=e,i.body=n,i.refs=[],r[a]=i}LP(t.paths,"paths",e,r,t),t["x-ms-paths"]&&LP(t["x-ms-paths"],"x-ms-paths",e,r,t);for(const e in t.components.parameters)t.components.parameters[e]["x-s2o-delete"]&&delete t.components.parameters[e];return delete t.consumes,delete t.produces,delete t.schemes,t.components.requestBodies={},t.components.responses&&0===Object.keys(t.components.responses).length&&delete t.components.responses,t.components.parameters&&0===Object.keys(t.components.parameters).length&&delete t.components.parameters,t.components.examples&&0===Object.keys(t.components.examples).length&&delete t.components.examples,t.components.requestBodies&&0===Object.keys(t.components.requestBodies).length&&delete t.components.requestBodies,t.components.securitySchemes&&0===Object.keys(t.components.securitySchemes).length&&delete t.components.securitySchemes,t.components.headers&&0===Object.keys(t.components.headers).length&&delete t.components.headers,t.components.schemas&&0===Object.keys(t.components.schemas).length&&delete t.components.schemas,t.components&&0===Object.keys(t.components).length&&delete t.components,e}(t)}function qP(e){return e.ok&&e.text&&e.parseError&&"YAMLException"===e.parseError.name&&(!e.headers["content-type"]||e.headers["content-type"].match("text/plain"))&&(e.body=e.text),e}const NP=function(e){return new Promise((async t=>{try{const r=await xP.resolve(e,qP);if(r.errors&&r.errors.length>0)t(r);else{r.spec.openapi&&(r.resolvedSpec=r.spec,t(r));const e=zP(r.spec);e.errors&&e.errors.length>0&&(Array.isArray(r.errors)?r.errors.concat(r.errors):r.errors=e.errors),e.warnings&&e.warnings.length>0&&(r.warnings=e.warnings),r.resolvedSpec=r.spec,r.spec=e.openapi,t(r)}}catch(e){t(e)}}))};async function UP(e,t=!1,r=!1,n="",o="",a="",i="",s=""){var l,c;let p;try{var d,u;let t;if(this.requestUpdate(),t="string"==typeof e?await NP({url:e,allowMetaPatches:!1}):await NP({spec:e,allowMetaPatches:!1}),await at(0),null!==(d=t.resolvedSpec)&&void 0!==d&&d.jsonSchemaViewer&&null!==(u=t.resolvedSpec)&&void 0!==u&&u.schemaAndExamples){this.dispatchEvent(new CustomEvent("before-render",{detail:{spec:t.resolvedSpec}}));const e=Object.entries(t.resolvedSpec.schemaAndExamples).map((e=>({show:!0,expanded:!0,selectedExample:null,name:e[0],elementId:e[0].replace(nt,"-"),...e[1]})));return{specLoadError:!1,isSpecLoading:!1,info:t.resolvedSpec.info,schemaAndExamples:e}}var h,f,m,g;if(!t.spec||!(t.spec.components||t.spec.info||t.spec.servers||t.spec.tags||t.spec.paths))return console.info("RapiDoc: %c There was an issue while parsing the spec %o ","color:orangered",t),{specLoadError:!0,isSpecLoading:!1,info:{title:"Error loading the spec",description:null!==(h=t.response)&&void 0!==h&&h.url?`${null===(f=t.response)||void 0===f?void 0:f.url} ┃ ${null===(m=t.response)||void 0===m?void 0:m.status}  ${null===(g=t.response)||void 0===g?void 0:g.statusText}`:"Unable to load the Spec",version:" "},tags:[]};p=t.spec,this.dispatchEvent(new CustomEvent("before-render",{detail:{spec:p}}))}catch(e){console.info("RapiDoc: %c There was an issue while parsing the spec %o ","color:orangered",e)}const y=function(e,t,r=!1,n=!1){const o=["get","put","post","delete","patch","head","options"],a=e.tags&&Array.isArray(e.tags)?e.tags.map((e=>({show:!0,elementId:`tag--${e.name.replace(nt,"-")}`,name:e.name,description:e.description||"",headers:e.description?MP(e.description):[],paths:[],expanded:!1!==e["x-tag-expanded"]}))):[],i=e.paths||{};if(e.webhooks)for(const[t,r]of Object.entries(e.webhooks))r._type="webhook",i[t]=r;for(const t in i){const n=i[t].parameters,s={servers:i[t].servers||[],parameters:i[t].parameters||[]},l="webhook"===i[t]._type;o.forEach((o=>{if(i[t][o]){const i=e.paths[t][o],c=i.tags||[];if(0===c.length)if(r){const e=t.replace(/^\/+|\/+$/g,""),r=e.indexOf("/");-1===r?c.push(e):c.push(e.substr(0,r))}else c.push("General ⦂");c.forEach((r=>{let c,p;var d,u;(e.tags&&(p=e.tags.find((e=>e.name.toLowerCase()===r.toLowerCase()))),c=a.find((e=>e.name===r)),c)||(c={show:!0,elementId:`tag--${r.replace(nt,"-")}`,name:r,description:(null===(d=p)||void 0===d?void 0:d.description)||"",headers:null!==(u=p)&&void 0!==u&&u.description?MP(p.description):[],paths:[],expanded:!p||!1!==p["x-tag-expanded"]},a.push(c));let h=(i.summary||i.description||`${o.toUpperCase()} ${t}`).trim();h.length>100&&([h]=h.split(/[.|!|?]\s|[\r?\n]/));let f=[];if(f=n?i.parameters?n.filter((e=>{if(!i.parameters.some((t=>e.name===t.name&&e.in===t.in)))return e})).concat(i.parameters):n.slice(0):i.parameters?i.parameters.slice(0):[],i.callbacks)for(const[e,t]of Object.entries(i.callbacks)){const r=Object.entries(t).filter((e=>"object"==typeof e[1]))||[];i.callbacks[e]=Object.fromEntries(r)}c.paths.push({show:!0,expanded:!1,isWebhook:l,expandedAtLeastOnce:!1,summary:i.summary||"",description:i.description||"",externalDocs:i.externalDocs,shortSummary:h,method:o,path:t,operationId:i.operationId,elementId:`${o}-${t.replace(nt,"-")}`,servers:i.servers?s.servers.concat(i.servers):s.servers,parameters:f,requestBody:i.requestBody,responses:i.responses,callbacks:i.callbacks,deprecated:i.deprecated,security:i.security,xBadges:i["x-badges"]||void 0,xCodeSamples:i["x-codeSamples"]||i["x-code-samples"]||""})}))}}))}const s=a.filter((e=>e.paths&&e.paths.length>0));return s.forEach((e=>{"method"===t?e.paths.sort(((e,t)=>o.indexOf(e.method).toString().localeCompare(o.indexOf(t.method)))):"summary"===t?e.paths.sort(((e,t)=>e.shortSummary.localeCompare(t.shortSummary))):"path"===t&&e.paths.sort(((e,t)=>e.path.localeCompare(t.path))),e.firstPathId=e.paths[0].elementId})),n?s.sort(((e,t)=>e.name.localeCompare(t.name))):s}(p,n,t,r),v=function(e){if(!e.components)return[];const t=[];for(const r in e.components){const n=[];for(const t in e.components[r]){const o={show:!0,id:`${r.toLowerCase()}-${t.toLowerCase()}`.replace(nt,"-"),name:t,component:e.components[r][t]};n.push(o)}let o=r,a=r;switch(r){case"schemas":a="Schemas",o="Schemas allows the definition of input and output data types. These types can be objects, but also primitives and arrays.";break;case"responses":a="Responses",o="Describes responses from an API Operation, including design-time, static links to operations based on the response.";break;case"parameters":a="Parameters",o="Describes operation parameters. A unique parameter is defined by a combination of a name and location.";break;case"examples":a="Examples",o="List of Examples for operations, can be requests, responses and objects examples.";break;case"requestBodies":a="Request Bodies",o="Describes common request bodies that are used across the API operations.";break;case"headers":a="Headers",o='Headers follows the structure of the Parameters but they are explicitly in "header"';break;case"securitySchemes":a="Security Schemes",o="Defines a security scheme that can be used by the operations. Supported schemes are HTTP authentication, an API key (either as a header, a cookie parameter or as a query parameter), OAuth2's common flows(implicit, password, client credentials and authorization code) as defined in RFC6749, and OpenID Connect Discovery.";break;case"links":a="Links",o="Links represent a possible design-time link for a response. The presence of a link does not guarantee the caller's ability to successfully invoke it, rather it provides a known relationship and traversal mechanism between responses and other operations.";break;case"callbacks":a="Callbacks",o="A map of possible out-of band callbacks related to the parent operation. Each value in the map is a Path Item Object that describes a set of requests that may be initiated by the API provider and the expected responses. The key value used to identify the path item object is an expression, evaluated at runtime, that identifies a URL to use for the callback operation.";break;default:a=r,o=r}const i={show:!0,name:a,description:o,subComponents:n};t.push(i)}return t||[]}(p),b=null!==(l=p.info)&&void 0!==l&&l.description?MP(p.info.description):[],x=[];if(null!==(c=p.components)&&void 0!==c&&c.securitySchemes){const e=new Set;Object.entries(p.components.securitySchemes).forEach((t=>{if(!e.has(t[0])){e.add(t[0]);const r={securitySchemeId:t[0],...t[1]};r.value="",r.finalKeyValue="","apiKey"===t[1].type||"http"===t[1].type?(r.in=t[1].in||"header",r.name=t[1].name||"Authorization",r.user="",r.password=""):"oauth2"===t[1].type&&(r.in="header",r.name="Authorization",r.clientId="",r.clientSecret=""),x.push(r)}}))}o&&a&&i&&x.push({securitySchemeId:ot,description:"api-key provided in rapidoc element attributes",type:"apiKey",oAuthFlow:"",name:o,in:a,value:i,finalKeyValue:i}),x.forEach((e=>{"http"===e.type?e.typeDisplay="basic"===e.scheme?"HTTP Basic":"HTTP Bearer":"apiKey"===e.type?e.typeDisplay=`API Key (${e.name})`:"oauth2"===e.type?e.typeDisplay=`OAuth (${e.securitySchemeId})`:e.typeDisplay=e.type||"None"}));let w=[];p.servers&&Array.isArray(p.servers)?(p.servers.forEach((e=>{let t=e.url.trim();t.startsWith("http")||t.startsWith("//")||t.startsWith("{")||window.location.origin.startsWith("http")&&(e.url=window.location.origin+e.url,t=e.url),e.variables&&Object.entries(e.variables).forEach((e=>{const r=new RegExp(`{${e[0]}}`,"g");t=t.replace(r,e[1].default||""),e[1].value=e[1].default||""})),e.computedUrl=t})),s&&p.servers.push({url:s,computedUrl:s})):s?p.servers=[{url:s,computedUrl:s}]:window.location.origin.startsWith("http")?p.servers=[{url:window.location.origin,computedUrl:window.location.origin}]:p.servers=[{url:"http://localhost",computedUrl:"http://localhost"}],w=p.servers;return{specLoadError:!1,isSpecLoading:!1,info:p.info,infoDescriptionHeaders:b,tags:y,components:v,externalDocs:p.externalDocs,securitySchemes:x,servers:w}}function MP(e){const t=He.lexer(e).filter((e=>"heading"===e.type&&e.depth<=2));return t||[]}const HP=2,WP=e=>(...t)=>({_$litDirective$:e,values:t});class VP{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,r){this._$Ct=e,this._$AM=t,this._$Ci=r}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}class GP extends VP{constructor(e){if(super(e),this.it=U,e.type!==HP)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===U||null==e)return this._t=void 0,this.it=e;if(e===N)return e;if("string"!=typeof e)throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}}GP.directiveName="unsafeHTML",GP.resultType=1;const KP=WP(GP);var JP=r(764).lW;const ZP="rapidoc";function YP(e,t="",r="",n=""){var o,a;const i=null===(o=this.resolvedSpec.securitySchemes)||void 0===o?void 0:o.find((t=>t.securitySchemeId===e));if(!i)return!1;let s="";if("basic"===(null===(a=i.scheme)||void 0===a?void 0:a.toLowerCase()))t&&(s=`Basic ${JP.from(`${t}:${r}`,"utf8").toString("base64")}`);else if(n){var l;i.value=n,s=`${"bearer"===(null===(l=i.scheme)||void 0===l?void 0:l.toLowerCase())?"Bearer ":""}${n}`}return!!s&&(i.finalKeyValue=s,this.requestUpdate(),!0)}function QP(){var e;null===(e=this.resolvedSpec.securitySchemes)||void 0===e||e.forEach((e=>{e.user="",e.password="",e.value="",e.finalKeyValue=""})),this.requestUpdate()}function XP(){return JSON.parse(localStorage.getItem(ZP))||{}}function e_(e){localStorage.setItem(ZP,JSON.stringify(e))}function t_(){const e=XP.call(this);Object.values(e).forEach((e=>{YP.call(this,e.securitySchemeId,e.username,e.password,e.value)}))}function r_(e){let t="";const r=this.resolvedSpec.securitySchemes.find((t=>t.securitySchemeId===e));if(r){const n=this.shadowRoot.getElementById(`security-scheme-${e}`);if(n){if(r.type&&r.scheme&&"http"===r.type&&"basic"===r.scheme.toLowerCase()){const t=n.querySelector(".api-key-user").value.trim(),r=n.querySelector(".api-key-password").value.trim();YP.call(this,e,t,r)}else t=n.querySelector(".api-key-input").value.trim(),YP.call(this,e,"","",t);if("true"===this.persistAuth){const t=XP.call(this);t[e]=r,e_.call(this,t)}}}}function n_(e,t,r="Bearer"){const n=this.resolvedSpec.securitySchemes.find((t=>t.securitySchemeId===e));n.finalKeyValue=`${"bearer"===r.toLowerCase()?"Bearer":"mac"===r.toLowerCase()?"MAC":r} ${t}`,this.requestUpdate()}async function o_(e,t,r,n,o,a,i,s,l="header",c=null,p=null,d=null){const u=s?s.querySelector(".oauth-resp-display"):void 0,h=new URLSearchParams,f=new Headers;h.append("grant_type",o),"authorization_code"===o&&(h.append("client_id",t),h.append("client_secret",r)),"client_credentials"!==o&&"password"!==o&&h.append("redirect_uri",n),a&&(h.append("code",a),h.append("code_verifier","731DB1C3F7EA533B85E29492D26AA-1234567890-1234567890")),"header"===l?f.set("Authorization",`Basic ${JP.from(`${t}:${r}`,"utf8").toString("base64")}`):"authorization_code"!==o&&(h.append("client_id",t),h.append("client_secret",r)),"password"===o&&(h.append("username",p),h.append("password",d)),c&&h.append("scope",c);try{const t=await fetch(e,{method:"POST",headers:f,body:h}),r=await t.json();if(!t.ok)return u&&(u.innerHTML=`<span style="color:var(--red)">${r.error_description||r.error_description||"Unable to get access token"}</span>`),!1;if(r.token_type&&r.access_token)return n_.call(this,i,r.access_token,r.token_type),u&&(u.innerHTML='<span style="color:var(--green)">Access Token Received</span>'),!0}catch(e){return u&&(u.innerHTML='<span style="color:var(--red)">Failed to get access token</span>'),!1}}async function a_(e,t,r,n,o,a,i,s,l,c){sessionStorage.removeItem("winMessageEventActive"),t.close(),e.data.fake||(e.data||console.warn("RapiDoc: Received no data with authorization message"),e.data.error&&console.warn("RapiDoc: Error while receiving data"),e.data&&("code"===e.data.responseType?o_.call(this,r,n,o,a,i,e.data.code,l,c,s):"token"===e.data.responseType&&n_.call(this,l,e.data.access_token,e.data.token_type)))}async function i_(e,t,r,n,o){const a=o.target.closest(".oauth-flow"),i=a.querySelector(".oauth-client-id")?a.querySelector(".oauth-client-id").value.trim():"",s=a.querySelector(".oauth-client-secret")?a.querySelector(".oauth-client-secret").value.trim():"",l=a.querySelector(".api-key-user")?a.querySelector(".api-key-user").value.trim():"",c=a.querySelector(".api-key-password")?a.querySelector(".api-key-password").value.trim():"",p=a.querySelector(".oauth-send-client-secret-in")?a.querySelector(".oauth-send-client-secret-in").value.trim():"header",d=[...a.querySelectorAll(".scope-checkbox:checked")],u=a.querySelector(`#${e}-pkce`),h=`${Math.random().toString(36).slice(2,9)}random${Math.random().toString(36).slice(2,9)}`,f=`${Math.random().toString(36).slice(2,9)}random${Math.random().toString(36).slice(2,9)}`,m=new URL(`${window.location.origin}${window.location.pathname.substring(0,window.location.pathname.lastIndexOf("/"))}/${this.oauthReceiver}`);let g,y="",v="";if([...a.parentNode.querySelectorAll(".oauth-resp-display")].forEach((e=>{e.innerHTML=""})),"authorizationCode"===t||"implicit"===t){const o=new URL(r);"authorizationCode"===t?(y="authorization_code",v="code"):"implicit"===t&&(v="token");const l=new URLSearchParams(o.search),c=d.map((e=>e.value)).join(" ");c&&l.set("scope",c),l.set("client_id",i),l.set("redirect_uri",m.toString()),l.set("response_type",v),l.set("state",h),l.set("nonce",f),u&&u.checked&&(l.set("code_challenge","4FatVDBJKPAo4JgLLaaQFMUcQPn5CrPRvLlaob9PTYc"),l.set("code_challenge_method","S256")),l.set("show_dialog",!0),o.search=l.toString(),"true"===sessionStorage.getItem("winMessageEventActive")&&window.postMessage({fake:!0},this),setTimeout((()=>{g=window.open(o.toString()),g?(sessionStorage.setItem("winMessageEventActive","true"),window.addEventListener("message",(t=>a_.call(this,t,g,n,i,s,m.toString(),y,p,e,a)),{once:!0})):console.error(`RapiDoc: Unable to open ${o.toString()} in a new window`)}),10)}else if("clientCredentials"===t){y="client_credentials";const t=d.map((e=>e.value)).join(" ");o_.call(this,n,i,s,m.toString(),y,"",e,a,p,t)}else if("password"===t){y="password";const t=d.map((e=>e.value)).join(" ");o_.call(this,n,i,s,m.toString(),y,"",e,a,p,t,l,c)}}function s_(e,t,r,n,o,a=[],i="header"){let{authorizationUrl:s,tokenUrl:l,refreshUrl:c}=o;const p=o["x-pkce-only"]||!1,d=e=>e.indexOf("://")>0||0===e.indexOf("//"),u=new URL(this.selectedServer.computedUrl).origin;let h;return c&&!d(c)&&(c=`${u}/${c.replace(/^\//,"")}`),l&&!d(l)&&(l=`${u}/${l.replace(/^\//,"")}`),s&&!d(s)&&(s=`${u}/${s.replace(/^\//,"")}`),h="authorizationCode"===e?"Authorization Code Flow":"clientCredentials"===e?"Client Credentials Flow":"implicit"===e?"Implicit Flow":"password"===e?"Password Flow":e,q`
    <div class="oauth-flow ${e}" style="padding: 12px 0; margin-bottom:12px;">
      <div class="tiny-title upper" style="margin-bottom:8px;">${h}</div>
      ${s?q`<div style="margin-bottom:5px"><span style="width:75px; display: inline-block;">Auth URL</span> <span class="mono-font"> ${s} </span></div>`:""}
      ${l?q`<div style="margin-bottom:5px"><span style="width:75px; display: inline-block;">Token URL</span> <span class="mono-font">${l}</span></div>`:""}
      ${c?q`<div style="margin-bottom:5px"><span style="width:75px; display: inline-block;">Refresh URL</span> <span class="mono-font">${c}</span></div>`:""}
      ${"authorizationCode"===e||"clientCredentials"===e||"implicit"===e||"password"===e?q`
          ${o.scopes?q`
              <span> Scopes </span>
              <div class= "oauth-scopes" part="section-auth-scopes" style = "width:100%; display:flex; flex-direction:column; flex-wrap:wrap; margin:0 0 10px 24px">
                ${Object.entries(o.scopes).map(((t,r)=>q`
                  <div class="m-checkbox" style="display:inline-flex; align-items:center">
                    <input type="checkbox" part="checkbox checkbox-auth-scope" class="scope-checkbox" id="${n}${e}${r}" ?checked="${a.includes(t[0])}" value="${t[0]}">
                    <label for="${n}${e}${r}" style="margin-left:5px; cursor:pointer">
                      <span class="mono-font">${t[0]}</span>
                        ${t[0]!==t[1]?` - ${t[1]||""}`:""}
                    </label>
                  </div>
                `))}
              </div>
            `:""}
          ${"password"===e?q`
              <div style="margin:5px 0">
                <input type="text" value = "" placeholder="username" spellcheck="false" class="oauth2 ${e} ${n} api-key-user" part="textbox textbox-username">
                <input type="password" value = "" placeholder="password" spellcheck="false" class="oauth2 ${e} ${n} api-key-password" style = "margin:0 5px;" part="textbox textbox-password">
              </div>`:""}
          <div>
            ${"authorizationCode"===e?q`
                <div style="margin: 16px 0 4px">
                  <input type="checkbox" part="checkbox checkbox-auth-scope" id="${n}-pkce" checked ?disabled=${p}>
                  <label for="${n}-pkce" style="margin:0 16px 0 4px; line-height:24px; cursor:pointer">
                   Send Proof Key for Code Exchange (PKCE)
                  </label>
                </div>
              `:""}
            <input type="text" part="textbox textbox-auth-client-id" value = "${t||""}" placeholder="client-id" spellcheck="false" class="oauth2 ${e} ${n} oauth-client-id">
            ${"authorizationCode"===e||"clientCredentials"===e||"password"===e?q`
                <input
                  type="password" part="textbox textbox-auth-client-secret"
                  value = "${r||""}" placeholder="client-secret" spellcheck="false"
                  class="oauth2 ${e} ${n}
                  oauth-client-secret"
                  style = "margin:0 5px;${p?"display:none;":""}"
                >
                <select style="margin-right:5px;${p?"display:none;":""}" class="${e} ${n} oauth-send-client-secret-in">
                  <option value = 'header' .selected = ${"header"===i} > Authorization Header </option>
                  <option value = 'request-body' .selected = ${"request-body"===i}> Request Body </option>
                </select>`:""}
            ${"authorizationCode"===e||"clientCredentials"===e||"implicit"===e||"password"===e?q`
                <button class="m-btn thin-border" part="btn btn-outline"
                  @click="${t=>{i_.call(this,n,e,s,l,t)}}"
                > GET TOKEN </button>`:""}
          </div>
          <div class="oauth-resp-display red-text small-font-size"></div>
          `:""}
    </div>
  `}function l_(e){var t;const r=null===(t=this.resolvedSpec.securitySchemes)||void 0===t?void 0:t.find((t=>t.securitySchemeId===e));if(r.user="",r.password="",r.value="",r.finalKeyValue="","true"===this.persistAuth){const e=XP.call(this);delete e[r.securitySchemeId],e_.call(this,e)}this.requestUpdate()}function c_(e,t,r){""===r?l_.call(this,t):r_.call(this,t);const n=this.getRequestPanel(e);this.liveCURLSyntaxUpdate(n)}function p_(){var e;if(!this.resolvedSpec)return"";const t=null===(e=this.resolvedSpec.securitySchemes)||void 0===e?void 0:e.filter((e=>e.finalKeyValue));return t?q`
  <section id='auth' part="section-auth" class = 'row-api-right-box observe-me ${"read focused".includes(this.renderStyle)?"section-gap--read-mode":"section-gap "}'>
    <div class="right-box-title">Header Auth</div>

    ${this.resolvedSpec.securitySchemes&&this.resolvedSpec.securitySchemes.length>0?q`
        <div id="auth-table">
          ${this.resolvedSpec.securitySchemes.map((e=>q`
            <div id="security-scheme-${e.securitySchemeId}" class="right-box-container ${e.type.toLowerCase()}">
              <div class="right-box-label">${e.name}</div>
              ${e.description?q`
                  <div class="m-markdown">
                    ${KP(He(e.description||""))}
                  </div>`:""}

              ${"apikey"===e.type.toLowerCase()||"http"===e.type.toLowerCase()&&"bearer"===e.scheme.toLowerCase()?q`
                  <div>
                    ${"cookie"!==e.in?q`
                        <input
                          type="text"
                          spellcheck="false"
                          value="${e.value}"
                          class="${e.type} ${e.securitySchemeId} api-key-input right-box-input"
                          @input="${t=>{c_.call(this,t,e.securitySchemeId,t.target.value)}}"
                        >`:q`<span class="gray-text" style="font-size::var(--font-size-small)"> cookies cannot be set from here</span>`}
                  </div>`:""}
              ${"http"===e.type.toLowerCase()&&"basic"===e.scheme.toLowerCase()?q`
                  <div style="margin-bottom:5px">
                    Send <code>Authorization</code> in <code>header</code> containing the word <code>Basic</code> followed by a space and a base64 encoded string of <code>username:password</code>.
                  </div>
                  <div>
                    <input
                      type="text"
                      value="${e.user}"
                      spellcheck="false"
                      placeholder="username"
                      class="${e.type} ${e.securitySchemeId} api-key-user"
                      style="width:100px"
                      @change = ${e=>{const t=this.getRequestPanel(e);this.liveCURLSyntaxUpdate(t)}}
                    >
                    <input
                      type="password"
                      spellcheck="false"
                      placeholder="password"
                      value="${e.password}"
                      class="${e.type} ${e.securitySchemeId} api-key-password"
                      style="width:100px; margin:0 5px;"
                      @change = ${e=>{const t=this.getRequestPanel(e);this.liveCURLSyntaxUpdate(t)}}
                    >
                    <button class="m-btn thin-border"
                      @click="${t=>{r_.call(this,e.securitySchemeId,t)}}"
                      part="btn btn-outline"
                    >
                      ${e.finalKeyValue?"UPDATE":"SET"}
                    </button>
                  </div>`:""}
            </div>
            ${"oauth2"===e.type.toLowerCase()?q`
                <div>
                  ${Object.keys(e.flows).map((t=>s_.call(this,t,e["x-client-id"],e["x-client-secret"],e.securitySchemeId,e.flows[t],e["x-default-scopes"],e["x-receive-token-in"])))}
                </div>
                `:""}
          `))}
        </div>`:""}
    <button class='m-btn test-method-button' @click='${this.onTryClick}' >
      TEST METHOD
    </button>
    <slot name="auth">
    </slot>
  </section>
`:void 0}function d_(e){if(this.resolvedSpec.securitySchemes&&e){const t=[];return Array.isArray(e)?0===e.length?"":(e.forEach((e=>{const r=[],n=[];0===Object.keys(e).length?t.push({securityTypes:"None",securityDefs:[]}):(Object.keys(e).forEach((t=>{let o="";const a=this.resolvedSpec.securitySchemes.find((e=>e.securitySchemeId===t));e[t]&&Array.isArray(e[t])&&(o=e[t].join(", ")),a&&(n.push(a.typeDisplay),r.push({...a,scopes:o}))})),t.push({securityTypes:n.length>1?`${n[0]} + ${n.length-1} more`:n[0],securityDefs:r}))})),q`<div style="position:absolute; top:3px; right:2px; font-size:var(--font-size-small); line-height: 1.5;">
      <div style="position:relative; display:flex; min-width:350px; max-width:700px; justify-content: flex-end;">
        <svg width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" fill="none" style="stroke:var(--fg3)"> <rect x="5" y="11" width="14" height="10" rx="2" /> <circle cx="12" cy="16" r="1" /> <path d="M8 11v-4a4 4 0 0 1 8 0v4" /></svg>
          ${t.map(((e,t)=>q`
          ${e.securityTypes?q`
              ${0!==t?q`<div style="padding:3px 4px;"> OR </div>`:""}
              <div class="tooltip">
                <div style = "padding:2px 4px; white-space:nowrap; text-overflow:ellipsis;max-width:150px; overflow:hidden;">
                  ${"true"===this.updateRoute&&"true"===this.allowAuthentication?q`<a part="anchor anchor-operation-security" href="#auth"> ${e.securityTypes} </a>`:q`${e.securityTypes}`}
                </div>
                <div class="tooltip-text" style="position:absolute; color: var(--fg); top:26px; right:0; border:1px solid var(--border-color);padding:2px 4px; display:block;">
                  ${e.securityDefs.length>1?q`<div>Requires <b>all</b> of the following </div>`:""}
                  <div style="padding-left: 8px">
                    ${e.securityDefs.map(((t,r)=>{const n=q`${""!==t.scopes?q`
                          <div>
                            <b>Required scopes:</b>
                            <br/>
                            <div style="margin-left:8px">
                              ${t.scopes.split(",").map(((e,t)=>q`${0===t?"":"┃"}<span>${e}</span>`))}
                            </div>
                          </div>`:""}`;return q`
                      ${"oauth2"===t.type?q`
                          <div>
                            ${e.securityDefs.length>1?q`<b>${r+1}.</b> &nbsp;`:"Needs"}
                            OAuth Token <span style="font-family:var(--font-mono); color:var(--primary-color);">${t.securitySchemeId}</span> in <b>Authorization header</b>
                            ${n}
                          </div>`:"http"===t.type?q`
                            <div>
                              ${e.securityDefs.length>1?q`<b>${r+1}.</b> &nbsp;`:q`Requires`}
                              ${"basic"===t.scheme?"Base 64 encoded username:password":"Bearer Token"} in <b>Authorization header</b>
                              ${n}
                            </div>`:q`
                            <div>
                              ${e.securityDefs.length>1?q`<b>${r+1}.</b> &nbsp;`:q`Requires`}
                              Token in <b>${t.name} ${t.in}</b>
                              ${n}
                            </div>`}`}))}
                  </div>
                </div>
              </div>
            `:""}
        `))}
      </div>
    `):""}return""}function u_(e){return q`
  <section class="table-title" style="margin-top:24px;">CODE SAMPLES</div>
  <div class="tab-panel col"
    @click="${e=>{if(!e.target.classList.contains("tab-btn"))return;const t=e.target.dataset.tab,r=[...e.currentTarget.querySelectorAll(".tab-btn")],n=[...e.currentTarget.querySelectorAll(".tab-content")];r.forEach((e=>e.classList[e.dataset.tab===t?"add":"remove"]("active"))),n.forEach((e=>{e.style.display=e.dataset.tab===t?"block":"none"}))}}">
    <div class="tab-buttons row" style="width:100; overflow">
      ${e.map(((e,t)=>q`<button class="tab-btn ${0===t?"active":""}" data-tab = '${e.lang}${t}'> ${e.label||e.lang} </button>`))}
    </div>
    ${e.map(((e,t)=>{var r,n,o;return q`
      <div class="tab-content m-markdown" style= "display:${0===t?"block":"none"}" data-tab = '${e.lang}${t}'>
        <button class="toolbar-btn" style = "position:absolute; top:12px; right:8px" @click='${t=>{it(e.source,t)}}'> Copy </button>
        <pre><code class="language">${Ve().languages[null===(r=e.lang)||void 0===r?void 0:r.toLowerCase()]?KP(Ve().highlight(e.source,Ve().languages[null===(n=e.lang)||void 0===n?void 0:n.toLowerCase()],null===(o=e.lang)||void 0===o?void 0:o.toLowerCase())):e.source}</code></pre>
      </div>`}))}
  </div>  
  </section>`}function h_(e){return q`
    <div class="req-res-title" style="margin-top:12px">CALLBACKS</div>
    ${Object.entries(e).map((e=>q`
      <div class="tiny-title" style="padding: 12px; border:1px solid var(--light-border-color)"> 
        ${e[0]}
        ${Object.entries(e[1]).map((e=>q`
          <div class="mono-font small-font-size" style="display:flex; margin-left:16px;">
            <div style="width:100%"> 
              ${Object.entries(e[1]).map((t=>{var r,n,o;return q`
                <div>
                  <div style="margin-top:12px;">
                    <div class="method method-fg ${t[0]}" style="width:70px; border:none; margin:0; padding:0; line-height:20px; vertical-align: baseline;text-align:left"> 
                      <span style="font-size:20px;"> &#x2944; </span> 
                      ${t[0]} 
                    </div>
                    <span style="line-height:20px; vertical-align: baseline;">${e[0]} </span>
                  </div>  
                  <div class='expanded-req-resp-container'>
                    <api-request
                      class = "${this.renderStyle}-mode callback"  
                      style = "width:100%;"
                      callback = "true"
                      method = "${t[0]||""}", 
                      path = "${e[0]||""}" 
                      .parameters = "${(null===(r=t[1])||void 0===r?void 0:r.parameters)||""}" 
                      .request_body = "${(null===(n=t[1])||void 0===n?void 0:n.requestBody)||""}"
                      fill-request-fields-with-example = "${this.fillRequestFieldsWithExample}"
                      allow-try = "false"
                      render-style="${this.renderStyle}" 
                      schema-style = "${this.schemaStyle}"
                      active-schema-tab = "${this.defaultSchemaTab}"
                      schema-expand-level = "${this.schemaExpandLevel}"
                      schema-description-expanded = "${this.schemaDescriptionExpanded}"
                      allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
                      schema-hide-read-only = "false"
                      schema-hide-write-only = "${"never"===this.schemaHideWriteOnly?"false":"true"}"
                      fetch-credentials = "${this.fetchCredentials}"
                      exportparts = "wrap-request-btn:wrap-request-btn, btn:btn, btn-fill:btn-fill, btn-outline:btn-outline, btn-try:btn-try, btn-clear:btn-clear, btn-clear-resp:btn-clear-resp,
                        file-input:file-input, textbox:textbox, textbox-param:textbox-param, textarea:textarea, textarea-param:textarea-param, 
                        anchor:anchor, anchor-param-example:anchor-param-example, schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
                      > </api-request>

                    <api-response
                      style = "width:100%;"
                      class = "${this.renderStyle}-mode"
                      callback = "true"
                      .responses="${null===(o=t[1])||void 0===o?void 0:o.responses}"
                      render-style="${this.renderStyle}"
                      schema-style="${this.schemaStyle}"
                      active-schema-tab = "${this.defaultSchemaTab}"
                      schema-expand-level = "${this.schemaExpandLevel}"
                      schema-description-expanded = "${this.schemaDescriptionExpanded}"
                      allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
                      schema-hide-read-only = "${"never"===this.schemaHideReadOnly?"false":"true"}"
                      schema-hide-write-only = "false"
                      exportparts = "btn:btn, btn-response-status:btn-response-status, btn-selected-response-status:btn-selected-response-status, btn-fill:btn-fill, btn-copy:btn-copy,
                      schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
                    > </api-response>
                  </div>
                </div>  
              `}))}
            </div>  
          </div>  
        `))}
      </div>  
    `))}
  `}const f_={},m_=WP(class extends VP{constructor(){super(...arguments),this.ot=f_}render(e,t){return t()}update(e,[t,r]){if(Array.isArray(t)){if(Array.isArray(this.ot)&&this.ot.length===t.length&&t.every(((e,t)=>e===this.ot[t])))return N}else if(this.ot===t)return N;return this.ot=Array.isArray(t)?Array.from(t):t,this.render(t,r)}});var g_=r(131),y_=r.n(g_);const v_=c`
.border-top {
  border-top:1px solid var(--border-color);
}
.border{
  border:1px solid var(--border-color);
  border-radius: var(--border-radius);
}
.light-border{
  border:1px solid var(--light-border-color);
  border-radius: var(--border-radius);
}
.pad-8-16{
  padding: 8px 16px;
}
.pad-top-8{
  padding-top: 8px;
}
.mar-top-8{
  margin-top: 8px;
}
`,b_=[c`
.shell-token.shell-function {
  color: #2953B2;
}

.shell-token.shell-method {
  color: #4A4A4A;
}

.shell-token.shell-punctuation {
  color: #4A4A4A;
}

.shell-token.shell-string {
  color: var(--green);
}

`,c``,c``,c``,c``];function x_(e){if(void 0===e)return"";if(null===e)return"null";if(""===e)return"∅";if("boolean"==typeof e||"number"==typeof e)return`${e}`;if(Array.isArray(e))return e.map((e=>null===e?"null":""===e?"∅":e.toString().replace(/^ +| +$/g,(e=>"●".repeat(e.length)))||"")).join(", ");if("object"==typeof e){const t=Object.keys(e);return`{ ${t[0]}:${e[t[0]]}${t.length>1?",":""} ... }`}return e.toString().replace(/^ +| +$/g,(e=>"●".repeat(e.length)))||""}function w_(e){if(!e)return;let t="",r="";if(e.$ref){const r=e.$ref.lastIndexOf("/");t=`{recursive: ${e.$ref.substring(r+1)}} `}else e.type?(t=Array.isArray(e.type)?e.type.join(2===e.length?" or ":"┃"):e.type,(e.format||e.enum||e.const)&&(t=t.replace("string",e.enum?"enum":e.const?"const":e.format)),e.nullable&&(t+="┃null")):t=e.const?"const":0===Object.keys(e).length?"any":"{missing-type-info}";const n={type:t,format:e.format||"",pattern:e.pattern&&!e.enum?e.pattern:"",readOrWriteOnly:e.readOnly?"🆁":e.writeOnly?"🆆":"",deprecated:e.deprecated?"❌":"",examples:e.examples||e.example,default:x_(e.default),description:e.description||"",constrain:"",allowedValues:"",arrayType:"",html:""};if("{recursive}"===n.type?n.description=e.$ref.substring(e.$ref.lastIndexOf("/")+1):"{missing-type-info}"!==n.type&&"any"!==n.type||(n.description=n.description||""),n.allowedValues=e.const?e.const:Array.isArray(e.enum)?e.enum.map((e=>x_(e))).join("┃"):"","array"===t&&e.items){var o,a;const t=null===(o=e.items)||void 0===o?void 0:o.type,r=x_(e.items.default);n.arrayType=`${e.type} of ${Array.isArray(t)?t.join(""):t}`,n.default=r,n.allowedValues=e.items.const?e.const:Array.isArray(null===(a=e.items)||void 0===a?void 0:a.enum)?e.items.enum.map((e=>x_(e))).join("┃"):""}return t.match(/integer|number/g)&&(void 0===e.minimum&&void 0===e.exclusiveMinimum||(r+=void 0!==e.minimum?`Min ${e.minimum}`:`More than ${e.exclusiveMinimum}`),void 0===e.maximum&&void 0===e.exclusiveMaximum||(r+=void 0!==e.maximum?`${r?"┃":""}Max ${e.maximum}`:`${r?"┃":""}Less than ${e.exclusiveMaximum}`),void 0!==e.multipleOf&&(r+=`${r?"┃":""} multiple of ${e.multipleOf}`)),t.match(/string/g)&&(void 0!==e.minLength&&void 0!==e.maxLength?r+=`${r?"┃":""}${e.minLength} to ${e.maxLength} chars`:void 0!==e.minLength?r+=`${r?"┃":""}Min ${e.minLength} chars`:void 0!==e.maxLength&&(r+=`Max ${r?"┃":""}${e.maxLength} chars`)),n.constrain=r,n.html=`${n.type}~|~${n.readOrWriteOnly}~|~${n.constrain}~|~${n.default}~|~${n.allowedValues}~|~${n.pattern}~|~${n.description}~|~${e.title||""}~|~${n.deprecated?"deprecated":""}`,n}function k_(e){return"boolean"==typeof e||"number"==typeof e?{Example:{value:`${e}`}}:""===e?{Example:{value:""}}:e?{Example:{value:e}}:e}function $_(e,t="string"){if(!e)return{exampleVal:"",exampleList:[]};if(e.constructor===Object){const t=Object.values(e).filter((e=>!1!==e["x-example-show-value"])).map((e=>({value:"boolean"==typeof e.value||"number"==typeof e.value?`${e.value}`:e.value||"",printableValue:x_(e.value),summary:e.summary||"",description:e.description||""})));return{exampleVal:t.length>0?t[0].value:"",exampleList:t}}if(Array.isArray(e)||(e=e?[e]:[]),0===e.length)return{exampleVal:"",exampleList:[]};if("array"===t){const[t]=e,r=e.map((e=>({value:e,printableValue:x_(e)})));return{exampleVal:t,exampleList:r}}const r=e[0].toString(),n=e.map((e=>({value:e.toString(),printableValue:x_(e)})));return{exampleVal:r,exampleList:n}}function S_(e){const t=e.examples?e.examples[0]:null===e.example?null:e.example||void 0;if(""===t)return"";if(null===t)return null;if(0===t)return 0;if(!1===t)return!1;if(t instanceof Date)switch(e.format.toLowerCase()){case"date":return t.toISOString().split("T")[0];case"time":return t.toISOString().split("T")[1];default:return t.toISOString()}if(t)return t;if(0===Object.keys(e).length)return null;if(e.$ref)return e.$ref;if(!1===e.const||0===e.const||null===e.const||""===e.const)return e.const;if(e.const)return e.const;const r=Array.isArray(e.type)?e.type[0]:e.type;if(!r)return"?";if(r.match(/^integer|^number/g)){const t=Number.isNaN(Number(e.multipleOf))?void 0:Number(e.multipleOf),n=Number.isNaN(Number(e.maximum))?void 0:Number(e.maximum),o=Number.isNaN(Number(e.minimum))?Number.isNaN(Number(e.exclusiveMinimum))?n||0:Number(e.exclusiveMinimum)+(r.startsWith("integer")?1:.001):Number(e.minimum);return t?t>=o?t:o%t==0?o:Math.ceil(o/t)*t:o}if(r.match(/^boolean/g))return!1;if(r.match(/^null/g))return null;if(r.match(/^string/g)){if(e.enum)return e.enum[0];if(e.const)return e.const;if(e.pattern)return e.pattern;if(!e.format){const t=Number.isNaN(e.minLength)?void 0:Number(e.minLength),r=Number.isNaN(e.maxLength)?void 0:Number(e.maxLength),n=t||(r>6?6:r||void 0);return n?"A".repeat(n):"string"}{const t=`${Date.now().toString(16)}${Math.random().toString(16)}0`.repeat(16);switch(e.format.toLowerCase()){case"url":case"uri":return"http://example.com";case"date":return new Date(0).toISOString().split("T")[0];case"time":return new Date(0).toISOString().split("T")[1];case"date-time":return new Date(0).toISOString();case"duration":return"P3Y6M4DT12H30M5S";case"email":case"idn-email":return"user@example.com";case"hostname":case"idn-hostname":return"www.example.com";case"ipv4":return"198.51.100.42";case"ipv6":return"2001:0db8:5b96:0000:0000:426f:8e17:642a";case"uuid":return[t.substr(0,8),t.substr(8,4),`4000-8${t.substr(13,3)}`,t.substr(16,12)].join("-");default:return""}}}return"?"}function A_(e,t=1){const r="  ".repeat(t);let n="";if(1===t&&"object"!=typeof e)return`\n${r}${e.toString()}`;for(const o in e){const a=e[o]["::XML_TAG"]||o;let i="";i=Array.isArray(e[o])?a[0]["::XML_TAG"]||`${o}`:a,o.startsWith("::")||(n=Array.isArray(e[o])||"object"==typeof e[o]?`${n}\n${r}<${i}>${A_(e[o],t+1)}\n${r}</${i}>`:`${n}\n${r}<${i}>${e[o].toString()}</${i}>`)}return n}function E_(e,t){var r,n;if("object"==typeof t&&null!==t){var o,a;if(e.title&&(t["::TITLE"]=e.title),e.description&&(t["::DESCRIPTION"]=e.description),null!==(r=e.xml)&&void 0!==r&&r.name)t["::XML_TAG"]=null===(o=e.xml)||void 0===o?void 0:o.name;if(null!==(n=e.xml)&&void 0!==n&&n.wrapped)t["::XML_WRAP"]=null===(a=e.xml)||void 0===a?void 0:a.wrapped.toString()}}function O_(e){if("object"==typeof e&&null!==e){delete e["::TITLE"],delete e["::DESCRIPTION"],delete e["::XML_TAG"],delete e["::XML_WRAP"];for(const t in e)O_(e[t])}}function C_(e,t,r){for(const n in t)t[n][r]=e}function T_(e,t,r){let n=0;const o={};for(const a in e){for(const i in r)if(o[`example-${n}`]={...e[a]},o[`example-${n}`][t]=r[i],n++,n>=10)break;if(n>=10)break}return o}function j_(e,t={}){let r={};if(e){if(e.allOf){var n,o;const a={};if(!(1!==e.allOf.length||null!==(n=e.allOf[0])&&void 0!==n&&n.properties||null!==(o=e.allOf[0])&&void 0!==o&&o.items)){if(e.allOf[0].$ref)return"{  }";if(e.allOf[0].readOnly&&t.includeReadOnly){return S_(e.allOf[0])}return}e.allOf.forEach((e=>{if("object"===e.type||e.properties||e.allOf||e.anyOf||e.oneOf){const r=j_(e,t);Object.assign(a,r)}else if("array"===e.type||e.items){const r=[j_(e,t)];Object.assign(a,r)}else{if(!e.type)return"";{const t=`prop${Object.keys(a).length}`;a[t]=S_(e)}}})),r=a}else if(e.oneOf){const n={};if(e.properties)for(const r in e.properties){var a;e.properties[r].properties||null!==(a=e.properties[r].properties)&&void 0!==a&&a.items?n[r]=j_(e.properties[r],t):n[r]=S_(e.properties[r])}if(e.oneOf.length>0){let o=0;for(const a in e.oneOf){const i=j_(e.oneOf[a],t);for(const t in i){let s;if(Object.keys(n).length>0){if(null===i[t]||"object"!=typeof i[t])continue;s=Object.assign(i[t],n)}else s=i[t];r[`example-${o}`]=s,E_(e.oneOf[a],r[`example-${o}`]),o++}}}}else if(e.anyOf){let n;if("object"===e.type||e.properties){n={"example-0":{}};for(const r in e.properties){if(e.example){n=e;break}e.properties[r].deprecated&&!t.includeDeprecated||(e.properties[r].readOnly&&!t.includeReadOnly||e.properties[r].writeOnly&&!t.includeWriteOnly||(n=T_(n,r,j_(e.properties[r],t))))}}let o=0;for(const a in e.anyOf){const i=j_(e.anyOf[a],t);for(const t in i){if(void 0!==n)for(const e in n)r[`example-${o}`]={...n[e],...i[t]};else r[`example-${o}`]=i[t];E_(e.anyOf[a],r[`example-${o}`]),o++}}}else if("object"===e.type||e.properties)if(r["example-0"]={},E_(e,r["example-0"]),e.example)r["example-0"]=e.example;else for(const n in e.properties){var i,s,l,c,p,d,u;if(null===(i=e.properties[n])||void 0===i||!i.deprecated||t.includeDeprecated)if(null===(s=e.properties[n])||void 0===s||!s.readOnly||t.includeReadOnly)if(null===(l=e.properties[n])||void 0===l||!l.writeOnly||t.includeWriteOnly)if("array"===(null===(c=e.properties[n])||void 0===c?void 0:c.type)||null!==(p=e.properties[n])&&void 0!==p&&p.items)if(e.properties[n].example)C_(e.properties[n].example,r,n);else if(null!==(d=e.properties[n])&&void 0!==d&&null!==(u=d.items)&&void 0!==u&&u.example)C_([e.properties[n].items.example],r,n);else{const o=j_(e.properties[n].items,t);if(t.useXmlTagForProp){var h,f;const t=(null===(h=e.properties[n].xml)||void 0===h?void 0:h.name)||n;if(null!==(f=e.properties[n].xml)&&void 0!==f&&f.wrapped){r=T_(r,t,JSON.parse(`{ "${t}" : { "${t}" : ${JSON.stringify(o["example-0"])} } }`))}else r=T_(r,t,o)}else{const e=[];for(const t in o)e[t]=[o[t]];r=T_(r,n,e)}}else r=T_(r,n,j_(e.properties[n],t))}else{if("array"!==e.type&&!e.items)return{"example-0":S_(e)};var m;if(e.items||e.example)if(e.example)r["example-0"]=e.example;else if(null!==(m=e.items)&&void 0!==m&&m.example)r["example-0"]=[e.items.example];else{const n=j_(e.items,t);let o=0;for(const t in n)r[`example-${o}`]=[n[t]],E_(e.items,r[`example-${o}`]),o++}else r["example-0"]=[]}return r}}function I_(e,t=0){var r;let n=(e.description||e.title)&&(e.minItems||e.maxItems)?'<span class="descr-expand-toggle">➔</span>':"";if(e.title?n=e.description?`${n} <b>${e.title}:</b> ${e.description}<br/>`:`${n} ${e.title}<br/>`:e.description&&(n=`${n} ${e.description}<br/>`),e.minItems&&(n=`${n} <b>Min Items:</b> ${e.minItems}`),e.maxItems&&(n=`${n} <b>Max Items:</b> ${e.maxItems}`),t>0&&null!==(r=e.items)&&void 0!==r&&r.description){let t="";e.items.minProperties&&(t=`<b>Min Properties:</b> ${e.items.minProperties}`),e.items.maxProperties&&(t=`${t} <b>Max Properties:</b> ${e.items.maxProperties}`),n=`${n} ⮕ ${t} [ ${e.items.description} ] `}return n}function P_(e,t,r=0,n=""){if(e){if(e.allOf){const n={};if(1===e.allOf.length&&!e.allOf[0].properties&&!e.allOf[0].items){return`${w_(e.allOf[0]).html}`}e.allOf.map(((e,t)=>{if("object"===e.type||e.properties||e.allOf||e.anyOf||e.oneOf){const o=(e.anyOf||e.oneOf)&&t>0?t:"",a=P_(e,{},r+1,o);Object.assign(n,a)}else if("array"===e.type||e.items){const t=P_(e,{},r+1);Object.assign(n,t)}else{if(!e.type)return"";{const t=`prop${Object.keys(n).length}`,r=w_(e);n[t]=`${r.html}`}}})),t=n}else if(e.anyOf||e.oneOf){if(t["::description"]=e.description||"","object"===e.type||e.properties){t["::description"]=e.description||"",t["::type"]="object";for(const n in e.properties)e.required&&e.required.includes(n)?t[`${n}*`]=P_(e.properties[n],{},r+1):t[n]=P_(e.properties[n],{},r+1)}const o={},a=e.anyOf?"anyOf":"oneOf";e[a].forEach(((e,t)=>{if("object"===e.type||e.properties||e.allOf||e.anyOf||e.oneOf){const r=P_(e,{});o[`::OPTION~${t+1}${e.title?`~${e.title}`:""}`]=r,o[`::OPTION~${t+1}${e.title?`~${e.title}`:""}`]["::readwrite"]="",o["::type"]="xxx-of-option"}else if("array"===e.type||e.items){const r=P_(e,{});o[`::OPTION~${t+1}${e.title?`~${e.title}`:""}`]=r,o[`::OPTION~${t+1}${e.title?`~${e.title}`:""}`]["::readwrite"]="",o["::type"]="xxx-of-array"}else{const r=`::OPTION~${t+1}${e.title?`~${e.title}`:""}`;o[r]=`${w_(e).html}`,o["::type"]="xxx-of-option"}})),t[e.anyOf?`::ANY~OF ${n}`:`::ONE~OF ${n}`]=o,t["::type"]="object"}else if(Array.isArray(e.type)){const n=JSON.parse(JSON.stringify(e)),i=[],s=[];let l;var o;if(n.type.forEach((e=>{var t,r;e.match(/integer|number|string|null|boolean/g)?i.push(e):"array"===e&&"string"==typeof(null===(t=n.items)||void 0===t?void 0:t.type)&&null!==(r=n.items)&&void 0!==r&&r.type.match(/integer|number|string|null|boolean/g)?"string"===n.items.type&&n.items.format?i.push(`[${n.items.format}]`):i.push(`[${n.items.type}]`):s.push(e)})),i.length>0)if(n.type=i.join(2===i.length?" or ":"┃"),l=w_(n),0===s.length)return`${(null===(o=l)||void 0===o?void 0:o.html)||""}`;if(s.length>0){var a;t["::type"]="object";const o={"::type":"xxx-of-option"};s.forEach(((t,a)=>{if("null"===t)o[`::OPTION~${a+1}`]="NULL~|~~|~~|~~|~~|~~|~~|~~|~";else if("integer, number, string, boolean,".includes(`${t},`)){n.type=Array.isArray(t)?t.join("┃"):t;const e=w_(n);o[`::OPTION~${a+1}`]=e.html}else if("object"===t){const t={"::title":e.title||"","::description":e.description||"","::type":"object","::deprecated":e.deprecated||!1};for(const n in e.properties)e.required&&e.required.includes(n)?t[`${n}*`]=P_(e.properties[n],{},r+1):t[n]=P_(e.properties[n],{},r+1);o[`::OPTION~${a+1}`]=t}else"array"===t&&(o[`::OPTION~${a+1}`]={"::title":e.title||"","::description":e.description||"","::type":"array","::props":P_(e.items,{},r+1)})})),o[`::OPTION~${s.length+1}`]=(null===(a=l)||void 0===a?void 0:a.html)||"",t["::ONE~OF"]=o}}else if("object"===e.type||e.properties){t["::title"]=e.title||"",t["::description"]=I_(e,r),t["::type"]="object",(Array.isArray(e.type)&&e.type.includes("null")||e.nullable)&&(t["::dataTypeLabel"]="object or null"),t["::deprecated"]=e.deprecated||!1,t["::readwrite"]=e.readOnly?"readonly":e.writeOnly?"writeonly":"";for(const n in e.properties)e.required&&e.required.includes(n)?t[`${n}*`]=P_(e.properties[n],{},r+1):t[n]=P_(e.properties[n],{},r+1);for(const n in e.patternProperties)t[`[pattern: ${n}]`]=P_(e.patternProperties[n],t,r+1);e.additionalProperties&&(t["[any-key]"]=P_(e.additionalProperties,{}))}else{if("array"!==e.type&&!e.items){const t=w_(e);return null!=t&&t.html?`${t.html}`:""}var i;t["::title"]=e.title||"",t["::description"]=I_(e,r),t["::type"]="array",(Array.isArray(e.type)&&e.type.includes("null")||e.nullable)&&(t["::dataTypeLabel"]="array or null"),t["::deprecated"]=e.deprecated||!1,t["::readwrite"]=e.readOnly?"readonly":e.writeOnly?"writeonly":"",null!==(i=e.items)&&void 0!==i&&i.items&&(t["::array-type"]=e.items.items.type),t["::props"]=P_(e.items,{},r+1)}return t}}function __(e,t,r="",n="",o=!0,a=!0,i="json",s=!1){const l=[];if(r)for(const e in r){let n="",o="json";if(null!=t&&t.toLowerCase().includes("json")){if("text"===i)n="string"==typeof r[e].value?r[e].value:JSON.stringify(r[e].value,void 0,2),o="text";else if(n=r[e].value,"string"==typeof r[e].value)try{const t=r[e].value;n=JSON.parse(t),o="json"}catch(t){o="text",n=r[e].value}}else n=r[e].value,o="text";l.push({exampleId:e,exampleSummary:r[e].summary||e,exampleDescription:r[e].description||"",exampleType:t,exampleValue:n,exampleFormat:o})}else if(n){let e="",r="json";if(null!=t&&t.toLowerCase().includes("json")){if("text"===i)e="string"==typeof n?n:JSON.stringify(n,void 0,2),r="text";else if("object"==typeof n)e=n,r="json";else if("string"==typeof n)try{e=JSON.parse(n),r="json"}catch(t){r="text",e=n}}else e=n,r="text";l.push({exampleId:"Example",exampleSummary:"",exampleDescription:"",exampleType:t,exampleValue:e,exampleFormat:r})}if(0===l.length||!0===s)if(e)if(e.example)l.push({exampleId:"Example",exampleSummary:"",exampleDescription:"",exampleType:t,exampleValue:e.example,exampleFormat:null!=t&&t.toLowerCase().includes("json")&&"object"==typeof e.example?"json":"text"});else if(null!=t&&t.toLowerCase().includes("json")||null!=t&&t.toLowerCase().includes("text")||null!=t&&t.toLowerCase().includes("*/*")||null!=t&&t.toLowerCase().includes("xml")){let r="",n="",s="",d="";var c,p;if(null!=t&&t.toLowerCase().includes("xml"))r=null!==(c=e.xml)&&void 0!==c&&c.name?`<${e.xml.name} ${e.xml.namespace?`xmlns="${e.xml.namespace}"`:""}>`:"<root>",n=null!==(p=e.xml)&&void 0!==p&&p.name?`</${e.xml.name}>`:"</root>",s="text";else s=i;const u=j_(e,{includeReadOnly:o,includeWriteOnly:a,deprecated:!0,useXmlTagForProp:null==t?void 0:t.toLowerCase().includes("xml")});let h=0;for(const e in u){if(!u[e])continue;const o=u[e]["::TITLE"]||"Example "+ ++h,a=u[e]["::DESCRIPTION"]||"";null!=t&&t.toLowerCase().includes("xml")?d=`<?xml version="1.0" encoding="UTF-8"?>\n${r}${A_(u[e],1)}\n${n}`:(O_(u[e]),d="text"===i?JSON.stringify(u[e],null,2):u[e]),l.push({exampleId:e,exampleSummary:o,exampleDescription:a,exampleType:t,exampleFormat:s,exampleValue:d})}}else null!=t&&t.toLowerCase().includes("jose")?l.push({exampleId:"Example",exampleSummary:"Base64 Encoded",exampleDescription:"",exampleType:t,exampleValue:e.pattern||"bXJpbg==",exampleFormat:"text"}):l.push({exampleId:"Example",exampleSummary:"",exampleDescription:"",exampleType:t,exampleValue:"",exampleFormat:"text"});else l.push({exampleId:"Example",exampleSummary:"",exampleDescription:"",exampleType:t,exampleValue:"",exampleFormat:"text"});return l}function R_(e){return"application/json"===e?"json":"application/xml"===e?"xml":null}function L_(e){if(e.schema)return[e.schema,null,null];if(e.content)for(const t of Object.keys(e.content))if(e.content[t].schema)return[e.content[t].schema,R_(t),e.content[t]];return[null,null,null]}customElements.define("json-tree",class extends ae{static get properties(){return{data:{type:Object},renderStyle:{type:String,attribute:"render-style"}}}static get styles(){return[Ge,v_,Ke,c`
      :host{
        display:flex;
      }
      :where(button, input[type="checkbox"], [tabindex="0"]):focus-visible { box-shadow: var(--focus-shadow); }
      :where(input[type="text"], input[type="password"], select, textarea):focus-visible { border-color: var(--primary-color); }
      .json-tree {
        position: relative;
        font-family: var(--font-mono);
        font-size: var(--font-size-small);
        display:inline-block;
        overflow:hidden;
        word-break: break-all;
        flex:1;
        line-height: calc(var(--font-size-small) + 6px);
        min-height: 40px;
        direction: ltr; 
        text-align: left;
      }

      .open-bracket {
        display:inline-block;
        padding: 0 20px 0 0;
        cursor:pointer;
        border: 1px solid transparent;
        border-radius:3px;
      }
      .close-bracket {
        border: 1px solid transparent;
        border-radius:3px;
        display:inline-block;
      }
      .open-bracket:hover {
        color:var(--primary-color);
        background-color:var(--hover-color);
        border: 1px solid var(--border-color);
      }
      .open-bracket.expanded:hover ~ .inside-bracket {
        border-left: 1px solid var(--fg3);
      }
      .open-bracket.expanded:hover ~ .close-bracket {
        color:var(--primary-color);
      }
      .inside-bracket {
        padding-left:12px;
        overflow: hidden;
        border-left:1px dotted var(--border-color);
      }
      .open-bracket.collapsed + .inside-bracket,
      .open-bracket.collapsed + .inside-bracket + .close-bracket {
        display:none;
      }

      .string{color:var(--green);}
      .number{color:var(--blue);}
      .null{color:var(--red);}
      .boolean{color:var(--purple);}
      .object{color:var(--fg)}
      .toolbar {
        position: absolute;
        top:5px;
        right:6px;
        display:flex;
        padding:2px;
        align-items: center;
      }`,rt]}render(){return q`
      <div class = "json-tree"  @click='${e=>{e.target.classList.contains("btn-copy")?it(JSON.stringify(this.data,null,2),e):this.toggleExpand(e)}}'>
        <div class='toolbar'> 
          <button class="toolbar-btn btn-copy" part="btn btn-fill btn-copy"> Copy </button>
        </div>
          ${this.generateTree(this.data,!0)}
      </div>  
    `}generateTree(e,t=!1){if(null===e)return q`<div class="null" style="display:inline;">null</div>`;if("object"==typeof e&&e instanceof Date==!1){const r=Array.isArray(e)?"array":"pure_object";return 0===Object.keys(e).length?q`${Array.isArray(e)?"[ ],":"{ },"}`:q`
      <div class="open-bracket expanded ${"array"===r?"array":"object"}" > ${"array"===r?"[":"{"}</div>
      <div class="inside-bracket">
        ${Object.keys(e).map(((t,n,o)=>q`
          <div class="item"> 
            ${"pure_object"===r?q`"${t}":`:""}
            ${this.generateTree(e[t],n===o.length-1)}
          </div>`))}
      </div>
      <div class="close-bracket">${"array"===r?"]":"}"}${t?"":","}</div>
      `}return"string"==typeof e||e instanceof Date?q`<span class="${typeof e}">"${e}"</span>${t?"":","}`:q`<span class="${typeof e}">${e}</span>${t?"":","}`}toggleExpand(e){const t=e.target;e.target.classList.contains("open-bracket")&&(t.classList.contains("expanded")?(t.classList.replace("expanded","collapsed"),e.target.innerHTML=e.target.classList.contains("array")?"[...]":"{...}"):(t.classList.replace("collapsed","expanded"),e.target.innerHTML=e.target.classList.contains("array")?"[":"{"))}});const B_=c`

*, *:before, *:after { box-sizing: border-box; }

.tr {
  display: flex;
  flex: none;
  width: 100%;
  box-sizing: content-box;
  border-bottom: 1px dotted transparent;
  transition: max-height 0.3s ease-out;
}
.td {
  display: block;
  flex: 0 0 auto;
}
.key {
  font-family: var(--font-mono);
  white-space: normal;
  word-break: break-all;
}

.collapsed-all-descr .key {
  overflow:hidden;
}
.expanded-all-descr .key-descr .descr-expand-toggle {
  display:none;
}

.key-descr .descr-expand-toggle {
  display:inline-block;
  user-select:none;
  color: var(--fg);
  cursor: pointer;
  transform: rotate(45deg);
  transition: transform .2s ease;
}

.expanded-descr .key-descr .descr-expand-toggle {
  transform: rotate(270deg)
}

.key-descr .descr-expand-toggle:hover {
  color: var(--primary-color);
}

.expanded-descr .more-content { display:none; }

.key-descr {
  font-family:var(--font-regular);
  color:#4A4A4A;
  flex-shrink: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  display: none;
  padding-left: 10px;
}
.expanded-descr .key-descr{
  max-height:auto;
  overflow:hidden;
  display: none;
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

.xxx-of-descr {
  font-family: var(--font-regular);
  color: var(--primary-color);
  font-size: calc(var(--font-size-small) - 1px);
  margin-left: 2px;
}

.stri, .string, .uri, .url, .byte, .bina, .date, .pass, .ipv4, .ipv4, .uuid, .emai, .host {color:var(--green);}
.inte, .numb, .number, .int6, .int3, .floa, .doub, .deci .blue {color:var(--blue);}
.null {color:var(--red);}
.bool, .boolean{color:var(--orange)}
.enum {color:var(--purple)}
.cons {color:var(--purple)}
.recu {color:var(--brown)}
.toolbar {
  display:flex;
  width:100%;
  padding: 2px 0;
  color:var(--primary-color);
}
.toolbar-item {
  cursor:pointer;
  padding:5px 0;
  margin:0 2px;
}
.schema-root-type {
  cursor:auto;
  color:var(--fg2);
  font-weight: bold;
  text-transform: uppercase;
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
`;customElements.define("schema-tree",class extends ae{static get properties(){return{data:{type:Object},schemaExpandLevel:{type:Number,attribute:"schema-expand-level"},schemaDescriptionExpanded:{type:String,attribute:"schema-description-expanded"},allowSchemaDescriptionExpandToggle:{type:String,attribute:"allow-schema-description-expand-toggle"},schemaHideReadOnly:{type:String,attribute:"schema-hide-read-only"},schemaHideWriteOnly:{type:String,attribute:"schema-hide-write-only"}}}connectedCallback(){super.connectedCallback(),(!this.schemaExpandLevel||this.schemaExpandLevel<1)&&(this.schemaExpandLevel=99999),this.schemaDescriptionExpanded&&"true false".includes(this.schemaDescriptionExpanded)||(this.schemaDescriptionExpanded="false"),this.schemaHideReadOnly&&"true false".includes(this.schemaHideReadOnly)||(this.schemaHideReadOnly="true"),this.schemaHideWriteOnly&&"true false".includes(this.schemaHideWriteOnly)||(this.schemaHideWriteOnly="true")}static get styles(){return[Ge,B_,v_,c`
      .tree {
        font-size:var(--font-size-small);
        text-align: left;
        direction: ltr;
        line-height:calc(var(--font-size-small) + 6px);
      }
      .tree .tr:hover{
        background-color:var(--hover-color);
      }
      .collapsed-all-descr .tr:not(.expanded-descr) {
        overflow: hidden;
        max-height:calc(var(--font-size-small) + 8px);
      }
      .tree .key {
        max-width: 300px;
      }
      .key.deprecated .key-label {
        color: var(--red);
      }
      .tr.expanded:hover > .td.key > .open-bracket {
        color: var(--primary-color);
      }
      .tr.expanded:hover + .inside-bracket {
        border-left: 1px solid var(--fg3);
      }
      .tr.expanded:hover + .inside-bracket + .close-bracket {
        color: var(--primary-color);
      }
      .inside-bracket.xxx-of-option {
        border-left: 1px solid transparent;
      }
      .open-bracket{
        display:inline-block;
        padding: 0 20px 0 0;
        cursor:pointer;
        border: 1px solid transparent;
        border-radius:3px;
      }
      .open-bracket:hover {
        color:var(--primary-color);
        background-color:var(--hover-color);
        border: 1px solid var(--border-color);
      }
      .close-bracket{
        display:inline-block;
        font-family: var(--font-mono);
      }
      .tr.collapsed + .inside-bracket,
      .tr.collapsed + .inside-bracket + .close-bracket{
        overflow: hidden;
        display:none;
      }
      .inside-bracket.object,
      .inside-bracket.array {
        border-left: 1px dotted var(--border-color);
      }`,rt]}render(){var e,t,r;return q`
      <div class="tree ${"true"===this.schemaDescriptionExpanded?"expanded-all-descr":"collapsed-all-descr"}" @click="${e=>this.handleAllEvents(e)}">
        <div class="toolbar">
          <div class="toolbar-item schema-root-type ${(null===(e=this.data)||void 0===e?void 0:e["::type"])||""} "> ${(null===(t=this.data)||void 0===t?void 0:t["::type"])||""} </div>
          ${"true"===this.allowSchemaDescriptionExpandToggle?q`
              <div style="flex:1"></div>
              <div part="schema-toolbar-item schema-multiline-toggle" class='toolbar-item schema-multiline-toggle'> 
                ${"true"===this.schemaDescriptionExpanded?"Single line description":"Multiline description"}
              </div>`:""}
        </div>
        <span part="schema-description" class='m-markdown'> ${KP(He((null===(r=this.data)||void 0===r?void 0:r["::description"])||""))}</span>
        ${this.data?q`
            ${this.generateTree("array"===this.data["::type"]?this.data["::props"]:this.data,this.data["::type"],this.data["::array-type"]||"")}`:q`<span class='mono-font' style='color:var(--red)'> Schema not found </span>`}
      </div>  
    `}generateTree(e,t="object",r="",n="",o="",a=0,i=0,s=""){var l;if("true"===this.schemaHideReadOnly){if("array"===t&&"readonly"===s)return;if("readonly"===(null==e?void 0:e["::readwrite"]))return}if("true"===this.schemaHideWriteOnly){if("array"===t&&"writeonly"===s)return;if("writeonly"===(null==e?void 0:e["::readwrite"]))return}if(!e)return q`<div class="null" style="display:inline;">
        <span class="key-label xxx-of-key"> ${n.replace("::OPTION~","")}</span>
        ${"array"===t?q`<span class='mono-font'> [ ] </span>`:"object"===t?q`<span class='mono-font'> { } </span>`:q`<span class='mono-font'> schema undefined </span>`}
      </div>`;if(0===Object.keys(e).length)return q`<span class="key object">${n}:{ }</span>`;let c="",p="";if(n.startsWith("::ONE~OF")||n.startsWith("::ANY~OF"))c=n.replace("::","").replace("~"," ");else if(n.startsWith("::OPTION")){const e=n.split("~");[,c,p]=e}else c=n;const d=400-12*i;let u="",h="";const f=null!==(l=e["::type"])&&void 0!==l&&l.startsWith("xxx-of")?a:a+1,m="xxx-of-option"===t||"xxx-of-option"===e["::type"]||n.startsWith("::OPTION")?i:i+1;if("object"===e["::type"])"array"===t?(u=a<this.schemaExpandLevel?q`<span class="open-bracket array-of-object" >[{</span>`:q`<span class="open-bracket array-of-object">[{...}]</span>`,h="}]"):(u=a<this.schemaExpandLevel?q`<span class="open-bracket object">{</span>`:q`<span class="open-bracket object">{...}</span>`,h="}");else if("array"===e["::type"])if("array"===t){const e="object"!==r?r:"";u=a<this.schemaExpandLevel?q`<span class="open-bracket array-of-array" data-array-type="${e}">[[ ${e} </span>`:q`<span class="open-bracket array-of-array"  data-array-type="${e}">[[...]]</span>`,h="]]"}else u=a<this.schemaExpandLevel?q`<span class="open-bracket array">[</span>`:q`<span class="open-bracket array">[...]</span>`,h="]";var g;if("object"==typeof e)return q`
        <div class="tr ${a<this.schemaExpandLevel||null!==(g=e["::type"])&&void 0!==g&&g.startsWith("xxx-of")?"expanded":"collapsed"} ${e["::type"]||"no-type-info"}" title="${e["::deprecated"]?"Deprecated":""}">
          <div class="td key ${e["::deprecated"]?"deprecated":""}" style='min-width:${d}px'>
            ${"xxx-of-option"===e["::type"]||"xxx-of-array"===e["::type"]||n.startsWith("::OPTION")?q`<span class='key-label xxx-of-key'> ${c}</span><span class="xxx-of-descr">${p}</span>`:"::props"===c||"::ARRAY~OF"===c?"":a>0?q`<span class="key-label" title="${"readonly"===s?"Read-Only":"writeonly"===s?"Write-Only":""}">
                      ${e["::deprecated"]?"✗":""}
                      ${c.replace(/\*$/,"")}${c.endsWith("*")?q`<span style="color:var(--red)">*</span>`:""}${"readonly"===s?q` 🆁`:"writeonly"===s?q` 🆆`:s}:
                    </span>`:""}
            ${u}
          </div>
          <div class='td key-descr m-markdown-small'>${KP(He(o||""))}</div>
        </div>
        <div class='inside-bracket ${e["::type"]||"no-type-info"}' style='padding-left:${"xxx-of-option"===e["::type"]||"xxx-of-array"===e["::type"]?0:12}px;'>
          ${Array.isArray(e)&&e[0]?q`${this.generateTree(e[0],"xxx-of-option","","::ARRAY~OF","",f,m,e[0]["::readwrite"])}`:q`
              ${Object.keys(e).map((t=>{var r;return q`
                ${["::title","::description","::type","::props","::deprecated","::array-type","::readwrite","::dataTypeLabel"].includes(t)?"array"===e[t]["::type"]||"object"===e[t]["::type"]?q`${this.generateTree("array"===e[t]["::type"]?e[t]["::props"]:e[t],e[t]["::type"],e[t]["::array-type"]||"",t,e[t]["::description"],f,m,e[t]["::readwrite"]?e[t]["::readwrite"]:"")}`:"":q`${this.generateTree("array"===e[t]["::type"]?e[t]["::props"]:e[t],e[t]["::type"],e[t]["::array-type"]||"",t,(null===(r=e[t])||void 0===r?void 0:r["::description"])||"",f,m,e[t]["::readwrite"]?e[t]["::readwrite"]:"")}`}
              `}))}
            `}
        </div>
        ${e["::type"]&&e["::type"].includes("xxx-of")?"":q`<div class='close-bracket'> ${h} </div>`}
      `;const[y,v,b,x,w,k,$,S,A]=e.split("~|~");if("🆁"===v&&"true"===this.schemaHideReadOnly)return;if("🆆"===v&&"true"===this.schemaHideWriteOnly)return;const E=y.replace(/┃.*/g,"").replace(/[^a-zA-Z0-9+]/g,"").substring(0,4).toLowerCase(),O=""+(b||x||w||k?`<span class="descr-expand-toggle ${"true"===this.schemaDescriptionExpanded?"expanded-descr":""}">➔</span>`:"");let C="",T="";return"array"===t?"readonly"===s?(C="🆁",T="Read-Only"):"writeonly"===s&&(C="🆆",T="Write-Only"):"🆁"===v?(C="🆁",T="Read-Only"):"🆆"===v&&(C="🆆",T="Write-Only"),q`
      <div class = "tr primitive" title="${A?"Deprecated":""}">
        <div class="td key ${A}" style='min-width:${d}px'>
          ${A?q`<span style='color:var(--red);'>✗</span>`:""}
          ${c.endsWith("*")?q`<span class="key-label">${c.substring(0,c.length-1)}</span><span style='color:var(--red);'>*</span>:`:n.startsWith("::OPTION")?q`<span class='key-label xxx-of-key'>${c}</span><span class="xxx-of-descr">${p}</span>`:q`<span class="key-label">${c}:</span>`}
          <span class="${E}" title="${T}"> 
            ${"array"===t?`[${y}]`:`${y}`}
            ${C}
          </span>
        </div>
        <div class='td key-descr'>
          ${o||S||$?q`${q`<span class="m-markdown-small">
                ${KP(He("array"===t?`${O} ${o}`:S?`${O} <b>${S}:</b> ${$}`:`${O} ${$}`))}
              </span>`}`:""}  
          ${b?q`<div style='display:inline-block; line-break:anywhere; margin-right:8px'><span class='bold-text'>Constraints: </span>${b}</div>`:""}
          ${x?q`<div style='display:inline-block; line-break:anywhere; margin-right:8px'><span class='bold-text'>Default: </span>${x}</div>`:""}
          ${w?q`<div style='display:inline-block; line-break:anywhere; margin-right:8px'><span class='bold-text'>${"const"===y?"Value":"Allowed"}: </span>${w}</div>`:""}
          ${k?q`<div style='display:inline-block; line-break: anywhere; margin-right:8px'><span class='bold-text'>Pattern: </span>${k}</div>`:""}
        </div>
      </div>
    `}handleAllEvents(e){if(e.target.classList.contains("open-bracket"))this.toggleObjectExpand(e);else if(e.target.classList.contains("schema-multiline-toggle"))this.schemaDescriptionExpanded="true"===this.schemaDescriptionExpanded?"false":"true";else if(e.target.classList.contains("descr-expand-toggle")){const t=e.target.closest(".tr");t&&(t.classList.toggle("expanded-descr"),t.style.maxHeight=t.scrollHeight)}}toggleObjectExpand(e){const t=e.target.closest(".tr");t.classList.contains("expanded")?(t.classList.replace("expanded","collapsed"),e.target.innerHTML=e.target.classList.contains("array-of-object")?"[{...}]":e.target.classList.contains("array-of-array")?"[[...]]":e.target.classList.contains("array")?"[...]":"{...}"):(t.classList.replace("collapsed","expanded"),e.target.innerHTML=e.target.classList.contains("array-of-object")?"[{":e.target.classList.contains("array-of-array")?`[[ ${e.target.dataset.arrayType}`:e.target.classList.contains("object")?"{":"[")}});customElements.define("tag-input",class extends ae{render(){let e="";return Array.isArray(this.value)&&(e=q`${this.value.filter((e=>"string"==typeof e&&""!==e.trim())).map((e=>q`<span class='tag'>${e}</span>`))}`),q`
      <div class='tags'>
        ${e}
        <input type="text" class='editor' @paste="${e=>this.afterPaste(e)}" @keydown="${this.afterKeyDown}" @blur="${this.onBlur}" placeholder="${this.placeholder||""}">
      </div>
    `}static get properties(){return{placeholder:{type:String},value:{type:Array,attribute:"value"}}}attributeChangedCallback(e,t,r){"value"===e&&r&&t!==r&&(this.value=r.split(",").filter((e=>""!==e.trim()))),super.attributeChangedCallback(e,t,r)}afterPaste(e){const t=(e.clipboardData||window.clipboardData).getData("Text"),r=t?t.split(",").filter((e=>""!==e.trim())):"";r&&(Array.isArray(this.value)?this.value=[...this.value,...r]:this.value=r),e.preventDefault()}afterKeyDown(e){13===e.keyCode?(e.stopPropagation(),e.preventDefault(),e.target.value&&(Array.isArray(this.value)?this.value=[...this.value,e.target.value]:this.value=[e.target.value],e.target.value="")):8===e.keyCode&&0===e.target.value.length&&Array.isArray(this.value)&&this.value.length>0&&(this.value.splice(-1),this.value=[...this.value])}onBlur(e){e.target.value&&(Array.isArray(this.value)?this.value=[...this.value,e.target.value]:this.value=[e.target.value],e.target.value="")}static get styles(){return[c`
      .tags {
        display:flex;
        flex-wrap: wrap;
        outline: none;
        padding:0;
        border-radius:var(--border-radius);
        border:1px solid var(--border-color);
        cursor:text;
        overflow:hidden;
        background:var(--input-bg);
      }
      .tag, .editor {
        padding:3px;
        margin:2px;
      }
      .tag{
        border:1px solid var(--border-color);
        background-color:var(--bg3);
        color:var(--fg3);
        border-radius:var(--border-radius);
        word-break: break-all;
        font-size: var(--font-size-small);
      }
      .tag:hover ~ #cursor {
        display: block;
      }
      .editor {
        flex:1;
        border:1px solid transparent;
        color:var(--fg);
        min-width:60px;
        outline: none;
        line-height: inherit;
        font-family:inherit;
        background:transparent;
        font-size: calc(var(--font-size-small) + 1px);
      }
      .editor:focus-visible {
        outline: 1px solid;
      }
      .editor::placeholder {
        color: var(--placeholder-color);
        opacity:1;
      }
    `]}});function F_(e){var t,r;const n=null!==(t=null==e?void 0:e.width)&&void 0!==t?t:20,o=null!==(r=null==e?void 0:e.height)&&void 0!==r?r:20;return q`
      <svg width=${n} height=${o} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M10 17.5C5.8575 17.5 2.5 14.1425 2.5 10C2.5 5.8575 5.8575 2.5 10 2.5C14.1425 2.5 17.5 5.8575 17.5 10C17.5 14.1425 14.1425 17.5 10 17.5Z" fill="#79A479"/>
          <path d="M13.3327 8.33337L9.16602 12.5L6.66602 10" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
  `}function D_(e){return q`
  <div style=${e}>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M4.87305 3.12451C4.87305 2.7103 5.20883 2.37451 5.62305 2.37451H16.8736C17.2878 2.37451 17.6236 2.7103 17.6236 3.12451V14.3746C17.6236 14.7888 17.2878 15.1246 16.8736 15.1246C16.4594 15.1246 16.1236 14.7888 16.1236 14.3746V3.87451H5.62305C5.20883 3.87451 4.87305 3.53873 4.87305 3.12451Z" fill="#4A596B"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M2.37305 5.62457C2.37305 5.21036 2.70883 4.87457 3.12305 4.87457H14.3735C14.7877 4.87457 15.1235 5.21036 15.1235 5.62457V16.8746C15.1235 17.2888 14.7877 17.6246 14.3735 17.6246H3.12305C2.70883 17.6246 2.37305 17.2888 2.37305 16.8746V5.62457ZM3.87305 6.37457V16.1246H13.6235V6.37457H3.87305Z" fill="#4A596B"/>
    </svg>
  </div>
`}function z_(e){var t,r;const n=null!==(t=null==e?void 0:e.width)&&void 0!==t?t:20,o=null!==(r=null==e?void 0:e.height)&&void 0!==r?r:20;return q`
    <svg width=${n} height=${o} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.1553 3.46967C16.4482 3.76256 16.4482 4.23744 16.1553 4.53033L4.90533 15.7803C4.61244 16.0732 4.13756 16.0732 3.84467 15.7803C3.55178 15.4874 3.55178 15.0126 3.84467 14.7197L15.0947 3.46967C15.3876 3.17678 15.8624 3.17678 16.1553 3.46967Z" fill="#545454"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.84467 3.46967C4.13756 3.17678 4.61244 3.17678 4.90533 3.46967L16.1553 14.7197C16.4482 15.0126 16.4482 15.4874 16.1553 15.7803C15.8624 16.0732 15.3876 16.0732 15.0947 15.7803L3.84467 4.53033C3.55178 4.23744 3.55178 3.76256 3.84467 3.46967Z" fill="#545454"/>
    </svg>
  `}customElements.define("bread-crumbs",class extends ae{static get properties(){return{headers:{type:Array}}}static get styles(){return[c`
        .container {
          display: flex;
          align-items: center;
        }

        .header {
          font-size: 16px;
          font-weight: 400;
          line-height: 18px;
          color: #A1A8B3;
          text-decoration: none;
        }

        .header:hover {
          color: #4A596B;
        }

        .header:active {
          color: #0C1522;
        }

        .caret {
          margin: 0 2px;
        }

        .tooltip {
          position: relative;
          display: inline-block;
        }

        .tooltip .tooltiptext {
          visibility: hidden;
          width: max-content;
          max-width: 150px;
          padding: 8px;

          border-radius: 4px;
          box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.1);

          background-color: #FFFFFF;
          color: #A1A8B3;
          
          position: absolute;
          transform: translateX(-50%);
          top: 135%;
          left: 50%;
          z-index: 1;
        }

        .tooltip:hover .tooltiptext {
          visibility: visible;
          left: 50%;
          transform: translateX(-50%);
        }

        .tooltiptext::after {
          content: "";
          position: absolute;
          bottom: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: transparent transparent #fff transparent;
        }

        @media(max-width: 1024px) {
          .header {
            font-size: 12px;
            line-height: 16px;
          }
        }
      `,rt]}render(){let e=this.headers.map((({title:e,link:t})=>({title:e.slice(0,25)+(e.length>25?"...":""),link:t,hasTooltip:e.length>25,tooltip:[{title:e,link:t}]})));if(e.length>3){const t=e.slice(1,-1).reduce(((e,t)=>(e.tooltip.push({title:t.tooltip[0].title,link:t.tooltip[0].link}),e)),{title:"...",link:"",hasTooltip:!0,tooltip:[]});e=[e[0],t,e[e.length-1]]}return q`
      <div class='container'>
        ${e.map(((e,t)=>q`
          ${t>0?q`
            <svg class="caret" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.66602 10.6654L9.33268 7.9987L6.66602 5.33203"
                stroke="#CCCED8"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          `:""}
          <div class="tooltip">
            <a class="header" onclick="return false;">${e.title}</a>
            ${e.hasTooltip?q`
              <div class="tooltiptext">
                ${e.tooltip.map((t=>{return q`
                  <div style="display:flex;gap: 5px;">
                    ${e.tooltip.length>1?q`
  <div style=${r}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.333 10.6667L5.99967 10.6667C4.16634 10.6667 2.66634 9.20133 2.66634 7.41V7.41L2.66634 7.43L2.66634 4" stroke="#CCCED8" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M10.6343 7.96802L13.333 10.6667L10.6343 13.3653" stroke="#CCCED8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
`:""}
                    <a class="header" onclick="return false;">${t.title}</a>
                  </div>
                `;var r}))}
              </div>`:""}
          </div>
        `))}
      </div>
    `}});class q_ extends ae{constructor(e,t){super(),this.active=!0,this.message=null!=t?t:"",this.tone=null!=e?e:"positive",this.tones={info:{borderColor:c`#7CBBEA`,bgColor:c`#DEECF7`,icon:F_},positive:{borderColor:c`#83D187`,bgColor:c`#DFF1E0`,icon:F_},warning:{borderColor:c`#F5AE70`,bgColor:c`#FFEBD7`,icon:F_},critical:{borderColor:c`#F49494`,bgColor:c`#F8E3E3`,icon:F_}}}firstUpdated(){const e=e=>{this.renderRoot.querySelectorAll(".toast-active").length>0&&"fadeOut"===e.animationName&&this.onClose()};this.renderRoot.getElementById("toast").addEventListener("animationend",e),this.renderRoot.getElementById("toast").addEventListener("webkitAnimationEnd",e)}onClose(){this.active=!1;this.dispatchEvent(new CustomEvent("closed-toast",{detail:"closed toast",bubbles:!0,composed:!0}))}render(){return q`
            <output role="status" class="toast${this.active?"-active":""}" id="toast"
                style="border-color: ${this.tones[this.tone].borderColor}; background: ${this.tones[this.tone].bgColor}">
                <div class="toast-icon-text">
                    ${this.tones[this.tone].icon({width:24,height:24})}
                    <p class="text">${this.message}</p>
                </div>
                <div class="close-button" @click="${this.onClose}">
                    ${z_({})}
                </div>
            </output>
        `}static get styles(){return[c`
            .close-button {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                border-radius: 4px;
                padding: 0px;
                width: 44px;
                height: 36px;
            }

            .close-button:hover {
                cursor: pointer;
                background-color: rgba(0, 0, 0, 0.05);
            }

            .toast-icon-text {
                display: flex;
                flex-direction: row;
                align-items: center;
                padding: 0px 0px 0px 4px;
                gap: 12px;
                width: auto;
                min-height: 40px;
            }

            .text {
                overflow-wrap: break-word;
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 20px;
                display: flex;
                align-items: center;
                letter-spacing: 0.002em;
                color: black;
                margin: 0;
            }

            .toast {
                opacity: 0;
                pointer-events: none;
                display: none;
            }

            .toast-active {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                padding: 16px 16px 16px 20px;
                gap: 12px;
                min-width: 16.125rem;
                width: auto;
                border: 1px solid;
                box-shadow: 0px 12px 16px rgba(0, 0, 0, 0.16);
                border-radius: 4px;
                position: fixed;
                overflow: hidden;
                pointer-events: all;
                bottom: 32px;
                right: 50%;
                transform: translateX(50%);
                z-index: 1001;
                -webkit-animation:
                    fadeIn .3s ease,
                    slideIn .3s ease,
                    fadeOut .3s ease 10s forwards;
                animation:
                    fadeIn .3s ease,
                    slideIn .3s ease,
                    fadeOut .3s ease 10s forwards;
            }

            @media only screen and (min-width: 768px) {
                .toast-active {
                    right: 96px;
                    transform: none;
                }
            }
            
            @keyframes slideIn {
                from { transform: translateY(0, 10px) }
            }

            @keyframes fadeIn {
                from { opacity: 0 }
            }
            
            @keyframes fadeOut {
                to {
                    opacity: 0;
                    pointer-events: none;
                    display: none;
                }
            }

            @-webkit-keyframes slideIn {
                from { transform: translateY(0, 10px) }
            }

            @-webkit-keyframes fadeIn {
                from { opacity: 0 }
            }
            
            @-webkit-keyframes fadeOut {
                to {
                    opacity: 0;
                    pointer-events: none;
                    display: none;
                }
            }
            `]}}var N_,U_,M_;N_=q_,U_="properties",M_={tone:{type:String},tones:{type:{}},message:{type:String},active:{type:Boolean}},(U_=function(e){var t=function(e,t){if("object"!=typeof e||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:String(t)}(U_))in N_?Object.defineProperty(N_,U_,{value:M_,enumerable:!0,configurable:!0,writable:!0}):N_[U_]=M_,customElements.define("toast-component",q_);class H_ extends ae{constructor(e,t,r,n,o){super(),this.id=e,this.url=t,this.path=r,this.computedUrl=n,this.variables=o,this.copied=!1,this.showButton=!1,this.showToast=!1,this.addEventListener("closed-toast",(()=>{this.showToast=!1}))}reset(){this.copied=!1,this.showButton=!1}willUpdate(e){e.has("id")&&this.reset()}onButtonClick(){navigator.clipboard.writeText(this.computedUrl+this.path),this.copied=!0}onTextClick(){navigator.clipboard.writeText(this.computedUrl+this.path),this.showToast=!0}onMouseOver(){this.showButton=!0}onMouseLeave(){this.showButton=!1,this.copied=!1}parseURL(){if(!this.variables)return this.url;let{url:e}=this;for(const[t,r]of Object.entries(this.variables)){const n=new RegExp(`{${t}}`,"g");e=e.replace(n,'<span class="variable">{var}</span>'.replace("{var}",r.value))}return e+this.path}render(){return q`
            <div class='container'>
                <div @mouseover="${this.onMouseOver}" @mouseleave="${this.onMouseLeave}" class="content-copy-container">
                    ${q`<span @click="${this.onTextClick}" part="label-operation-path" class="url">${KP(this.parseURL())}</span>`}
                    <button @click="${this.onButtonClick}" style=${this.showButton?"opacity: 1;":"opacity: 0.2;"}>
                        <div class="svg-container">
                            ${this.copied?F_():D_()}
                        </div>
                    </button>
                </div>
                <slot></slot>
            </div>
            ${this.showToast?q`<toast-component tone="positive" message="Copied to clipboard"></toast-component>`:""}
        `}static get styles(){return[c`
            .svg-container {
                display: flex;
                flex-direction: row;
                justify-content: flex-end;
                align-items: flex-start;
                padding: 0px 8px 0px 0px;
                gap: 10px;
                width: 57px;
                height: 20px;
                background: linear-gradient(270deg, #FFFFFF 51.22%, rgba(255, 255, 255, 0) 104.88%);
            }

            .url {
                flex: 1 0 auto;
                padding: 4px 8px;
            }

            .url:hover {
                cursor: pointer;
            }

            .variable {
                background-color: rgb(248, 247, 252);
                border: 1px solid rgb(204, 206, 216);
                border-radius: 4px;
                padding: 0px 2px;
            }

            .container {
                height: 32px;
                font-size:14px;
                border: 1px solid var(--border-color);
                border-radius: 4px;
                margin: 4px 0px;
                position: relative;
            }

            .container slot {
                visibility: hidden;
            }

            .container:hover slot {
                visibility: visible;
            }

            .container::-webkit-scrollbar {
                display: none;
            }

            button {
                background: none;
                color: inherit;
                border: none;
                padding: 0;
                cursor: pointer;
                outline: inherit;
                right: 0;
                display: block;
                position: -webkit-sticky;
                position: sticky;
            }

            .copy-container {
                width: inherit;
                height: inherit;
                opacity: 0;
                filter: alpha(opacity = 0);
                position: absolute;
                top:0; bottom:0; left:0; right:0;
                display: block;
                z-index: 2;
                background: transparent;
            }

            .content-copy-container {
                width: inherit;
                height: inherit;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                display: flex;
                flex-wrap: nowrap;
                font-size: 14px;
                white-space: nowrap;
                overflow-y: hidden;
                overflow-x: auto;
                align-items: center;
            }

            .content-copy-container::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }

            .content-copy-container::-webkit-scrollbar-track {
                background:var(--input-bg);
            }
            
            .content-copy-container::-webkit-scrollbar-thumb {
                border-radius: 2px;
                background-color: var(--border-color);
            }
          `]}}function W_(e){var t;const r=null===(t=this.resolvedSpec)||void 0===t?void 0:t.servers.find((t=>t.url===e));return!!r&&(this.selectedServer=r,this.requestUpdate(),this.dispatchEvent(new CustomEvent("api-server-change",{bubbles:!0,composed:!0,detail:{selectedServer:r}})),!0)}function V_(e,t){const r=[...e.currentTarget.closest(".server-vars").querySelectorAll("input, select")];let n=t.url;r.forEach((e=>{t.variables[e.dataset.var].value=e.value;const r=new RegExp(`{${e.dataset.var}}`,"g");n=n.replace(r,e.value)})),t.computedUrl=n;const o=this.getRequestPanel(e);this.liveCURLSyntaxUpdate(o),this.requestUpdate()}function G_(){return this.selectedServer&&this.selectedServer.variables?q`
    <div class='server-vars'>
      ${Object.entries(this.selectedServer.variables).map((e=>q`
        <div>
          <div class='right-box-label' >${e[0]}</div>
          <div>
            ${e[1].enum?q`
            <select
              data-var = "${e[0]}"
              @input = ${e=>{V_.call(this,e,this.selectedServer)}}
            >
            ${Object.entries(e[1].enum).map((t=>e[1].default===t[1]?q`
              <option
                selected
                label = ${t[1]}
                value = ${t[1]}
              />`:q`
              <option
                label = ${t[1]}
                value = ${t[1]}
              />`))}
            </select>`:q`
            <input
              class="right-box-input"
              type = "text"
              part="textbox textbox-server-var"
              spellcheck = "false"
              data-var = "${e[0]}"
              value = "${e[1].default}"
              @input = ${e=>{V_.call(this,e,this.selectedServer)}}
            />`}
          </div>
        </div>
        ${e[1].description?q`<div><div style="border:none; margin-top: 4px"><span class="m-markdown-small"> ${KP(He(e[1].description))} </span></div></div>`:""}
      `))}
    </div>
    `:""}function K_(){var e,t,r;return!this.resolvedSpec||this.resolvedSpec.specLoadError?"":q`
  <section id = 'servers' part="section-servers" class='server-template row-api-right-box regular-font observe-me ${"read focused".includes(this.renderStyle)?"section-gap--read-mode":"section-gap"}'>
    <span class="right-box-title">Base URL</span>
    <div style="display: flex; align-items: center;" class="server-template">
      ${null!==(e=this.selectedServer)&&void 0!==e&&e.computedUrl?q`
            <base-url id='copy-baseURL' url='${null===(t=this.selectedServer)||void 0===t?void 0:t.url}' path='${this.path}' computedUrl='${this.selectedServer.computedUrl}' .variables='${null===(r=this.selectedServer)||void 0===r?void 0:r.variables}' style="width: 100%;">
              <div class="server-template-vars">
                ${G_.call(this)}
              </div>
            </base-url>
          </div>`:""}
    </div>
  </section>`}!function(e,t,r){(t=function(e){var t=function(e,t){if("object"!=typeof e||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:String(t)}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r}(H_,"properties",{id:{type:String},url:{type:String},path:{type:String},computedUrl:{type:String},copied:{type:Boolean},showButton:{type:Boolean},showToast:{type:Boolean}}),customElements.define("base-url",H_);customElements.define("api-request",class extends ae{constructor(){super(),this.resolvedSpec={},this.responseMessage="",this.resultLoad=!1,this.responseStatus="success",this.responseHeaders="",this.responseText="",this.responseUrl="",this.curlSyntax="",this.activeResponseTab="response",this.selectedRequestBodyType="",this.selectedRequestBodyExample="",this.activeParameterSchemaTabs={},this.showCurlBeforeTry=!0}static get properties(){return{schemaShortSummary:{type:String,attribute:"schema-short-summary"},serverUrl:{type:String,attribute:"server-url"},resolvedSpec:{type:Object},selectedServer:{type:Object},servers:{type:Array},method:{type:String},path:{type:String},security:{type:Array},parameters:{type:Array},request_body:{type:Object},api_keys:{type:Array},parser:{type:Object},accept:{type:String},callback:{type:String},webhook:{type:String},responseMessage:{type:String,attribute:!1},responseText:{type:String,attribute:!1},responseHeaders:{type:String,attribute:!1},responseStatus:{type:String,attribute:!1},responseUrl:{type:String,attribute:!1},curlSyntax:{type:String,attribute:!1},fillRequestFieldsWithExample:{type:String,attribute:"fill-request-fields-with-example"},allowTry:{type:String,attribute:"allow-try"},showCurlBeforeTry:{type:String,attribute:"show-curl-before-try"},renderStyle:{type:String,attribute:"render-style"},schemaStyle:{type:String,attribute:"schema-style"},activeSchemaTab:{type:String,attribute:"active-schema-tab"},activeParameterSchemaTabs:{type:Object,converter:{fromAttribute:e=>JSON.parse(e),toAttribute:e=>JSON.stringify(e)},attribute:"active-parameter-schema-tabs"},schemaExpandLevel:{type:Number,attribute:"schema-expand-level"},schemaDescriptionExpanded:{type:String,attribute:"schema-description-expanded"},allowSchemaDescriptionExpandToggle:{type:String,attribute:"allow-schema-description-expand-toggle"},schemaHideReadOnly:{type:String,attribute:"schema-hide-read-only"},schemaHideWriteOnly:{type:String,attribute:"schema-hide-write-only"},fetchCredentials:{type:String,attribute:"fetch-credentials"},activeResponseTab:{type:String},selectedRequestBodyType:{type:String,attribute:"selected-request-body-type"},selectedRequestBodyExample:{type:String,attribute:"selected-request-body-example"}}}static get styles(){return[Ze,Ke,Ge,Je,v_,Xe,Qe,b_,c`
        *, *:before, *:after { box-sizing: border-box; }
        :where(button, input[type="checkbox"], [tabindex="0"]):focus-visible { box-shadow: var(--focus-shadow); }
        :where(input[type="text"], input[type="password"], select, textarea):focus-visible { border-color: var(--primary-color); }
        tag-input:focus-within { outline: 1px solid;}
        .read-mode {
          border-top: 1px solid #E7E9EE;
          margin-top: 24px;
        }

        .param-name {
          font-size: 14px;
          font-weight: normal;
          line-height: 20px;
          color: #545454; 
          margin-block: 24px 4px;
          font-family: var(--font-mono);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .param-name.deprecated { 
          color: #DC5A41;
        }
        .param-type{
          font-size: 14px;
          font-weight: normal;
          line-height: 16px;
          color: #4A4A4A; 
          font-family: var(--font-regular);
        }

        .param-type > span {
          margin-left: 8px;
        }

        .param-constraint{
          min-width:100px;
        }
        .param-constraint:empty{
          display:none;
        }

        .param-description {
          font-size: 12px;
          line-height: 16px;
          color: #4A4A4A;
          margin: 10px 0px 0px;
        }

        .top-gap{margin-top:24px;}

        .textarea {
          min-height:220px; 
          padding:5px;
          resize:vertical;
          direction: ltr;
        }
        .example:first-child {
          margin-top: -9px;
        }

        .response-message{
          font-weight:bold;
          text-overflow: ellipsis;
        }
        .response-message.error {
          color:var(--red);
        }
        .response-message.success {
          color:var(--blue);
        }

        .file-input-container {
          align-items:flex-end;
        }
        .file-input-container .input-set:first-child .file-input-remove-btn{
          visibility:hidden;
        }

        .file-input-remove-btn{
          font-size:16px;
          color:var(--red);
          outline: none;
          border: none;
          background:none;
          cursor:pointer;
        }

        .v-tab-btn {
          font-size: var(--smal-font-size);
          height:24px; 
          border:none; 
          background:none; 
          opacity: 0.3;
          cursor: pointer;
          padding: 4px 8px;
        }
        .v-tab-btn.active {
          font-weight: bold;
          background: var(--bg);
          opacity: 1;
        }

        @media only screen and (min-width: 768px) {
          .textarea {
            padding:8px;
          }
        }

        @media only screen and (max-width: 470px) {
          .hide-in-small-screen {
            display:none;
          }
        }
      `,rt]}render(){return q`
    <div class="row-api regular-font request-panel ${"read focused".includes(this.renderStyle)||"true"===this.callback?"read-mode":"view-mode"}">
      <div class="row-api-left">
        ${m_([this.method,this.path,this.allowTry,this.parameters,this.activeParameterSchemaTabs],(()=>this.inputParametersTemplate("path")))}
        ${m_([this.method,this.path,this.allowTry,this.parameters,this.activeParameterSchemaTabs],(()=>this.inputParametersTemplate("query")))}
        ${this.requestBodyTemplate()}
        ${m_([this.method,this.path,this.allowTry,this.parameters,this.activeParameterSchemaTabs],(()=>this.inputParametersTemplate("header")))}
        ${m_([this.method,this.path,this.allowTry,this.parameters,this.activeParameterSchemaTabs],(()=>this.inputParametersTemplate("cookie")))}
        ${"false"===this.allowTry?"":q`${this.apiCallTemplate()}`}
      </div>
      <div class="row-api-right">
        ${p_.call(this)}
        ${K_.call(this)}
        ${this.apiResponseTabTemplate()}
      </div>  
    </div>
    `}async updated(){"true"===this.showCurlBeforeTry&&this.applyCURLSyntax(this.shadowRoot),"true"===this.webhook&&(this.allowTry="false")}async saveExampleState(){if("focused"===this.renderStyle){[...this.shadowRoot.querySelectorAll("textarea.request-body-param-user-input")].forEach((e=>{e.dataset.user_example=e.value}));[...this.shadowRoot.querySelectorAll('textarea[data-ptype="form-data"]')].forEach((e=>{e.dataset.user_example=e.value})),this.requestUpdate()}}async updateExamplesFromDataAttr(){if("focused"===this.renderStyle){[...this.shadowRoot.querySelectorAll("textarea.request-body-param-user-input")].forEach((e=>{e.value=e.dataset.user_example||e.dataset.example}));[...this.shadowRoot.querySelectorAll('textarea[data-ptype="form-data"]')].forEach((e=>{e.value=e.dataset.user_example||e.dataset.example})),this.requestUpdate()}}renderExample(e,t,r){var n,o;return q`
      ${"array"===t?"[":""}
      <a
        part="anchor anchor-param-example"
        style="display:inline-block; min-width:24px; text-align:left"
        class="${"true"===this.allowTry?"":"inactive-link"}"
        data-example-type="${"array"===t?t:"string"}"
        data-example="${e.value&&Array.isArray(e.value)?null===(n=e.value)||void 0===n?void 0:n.join("~|~"):("object"==typeof e.value?JSON.stringify(e.value,null,2):e.value)||""}"
        title="${e.value&&Array.isArray(e.value)?null===(o=e.value)||void 0===o?void 0:o.join("~|~"):("object"==typeof e.value?JSON.stringify(e.value,null,2):e.value)||""}"
        @click="${e=>{const t=e.target.closest(".request-card").querySelector(`[data-pname="${r}"]`);if(t){t.value="array"===e.target.dataset.exampleType?e.target.dataset.example.split("~|~"):e.target.dataset.example;const r=this.getRequestPanel(e);this.liveCURLSyntaxUpdate(r)}}}"
      > ${e.printableValue||e.value} </a>
      ${"array"===t?"] ":""}
    `}renderShortFormatExamples(e,t,r){return q`${e.map(((e,n)=>q`
      ${0===n?"":"┃"}
      ${this.renderExample(e,t,r)}`))}`}renderLongFormatExamples(e,t,r){return q` <ul style="list-style-type: disclosure-closed;">
      ${e.map((e=>{var n,o;return q`
          <li>
            ${this.renderExample(e,t,r)}
            ${(null===(n=e.summary)||void 0===n?void 0:n.length)>0?q`<span>&lpar;${e.summary}&rpar;</span>`:""}
            ${(null===(o=e.description)||void 0===o?void 0:o.length)>0?q`<p>${KP(He(e.description))}</p>`:""}
          </li>
        `}))}
    </ul>`}exampleListTemplate(e,t,r=[]){return q` ${r.length>0?q`<span style="font-weight:bold; font-size:12px; margin-top: 10px;">Example: </span>
          ${n=r,n.some((e=>{var t,r;return(null===(t=e.summary)||void 0===t?void 0:t.length)>0||(null===(r=e.description)||void 0===r?void 0:r.length)>0}))?this.renderLongFormatExamples(r,t,e):this.renderShortFormatExamples(r,t,e)}`:""}`;var n}inputParametersTemplate(e){const t=this.parameters?this.parameters.filter((t=>t.in===e)):[];if(0===t.length)return"";let r="";"path"===e?r="Path Params":"query"===e?r="Query-String Params":"header"===e?r="Headers":"cookie"===e&&(r="Cookies");const n=[];for(const r of t){const[t,o,a]=L_(r);if(!t)continue;const i=w_(t);if(!i)continue;const s=P_(t,{});let l="form",c=!0,p=!1;"query"===e&&(r.style&&"form spaceDelimited pipeDelimited".includes(r.style)?l=r.style:o&&(l=o),"boolean"==typeof r.explode&&(c=r.explode),"boolean"==typeof r.allowReserved&&(p=r.allowReserved));const d=$_(r.examples||k_(r.example)||k_(null==a?void 0:a.example)||(null==a?void 0:a.examples)||k_(i.examples)||k_(i.example),i.type);d.exampleVal||"object"!==i.type||(d.exampleVal=__(t,o||"json","","","true"===this.callback||"true"===this.webhook,"true"!==this.callback&&"true"!==this.webhook,!0,"text")[0].exampleValue),this.resolvedSpec.securitySchemes.some((e=>e.name===r.name))||n.push(q`
              <div class="param-name ${r.deprecated?"deprecated":""}" >
                ${r.name}

                <div class="param-type">
                  ${"array"===i.type?`${i.arrayType}`:`${i.format?i.format:i.type}`}
                  ${r.deprecated?q`<span style='color:#DC5A41;'>deprecated</span>`:""}
                  ${r.required?q`<span style='color:#DC5A41;'>required</span>`:""}
                </div>
              </div>

              ${"true"===this.allowTry?q`
                  ${"array"===i.type?q`
                      <tag-input class="request-param" 
                        style = "width:100%" 
                        data-ptype = "${e}"
                        data-pname = "${r.name}"
                        data-example = "${Array.isArray(d.exampleVal)?d.exampleVal.join("~|~"):d.exampleVal}"
                        data-param-serialize-style = "${l}"
                        data-param-serialize-explode = "${c}"
                        data-param-allow-reserved = "${p}"
                        data-array = "true"
                        placeholder = "add-multiple &#x21a9;"
                        .value = "${Array.isArray(d.exampleVal),d.exampleVal}"
                      >
                      </tag-input>`:"object"===i.type?q`
                        <div class="tab-panel col" style="border-width:0 0 1px 0; margin-top: 24px;">
                          <div class="tab-buttons row" @click="${e=>{if("button"===e.target.tagName.toLowerCase()){const t={...this.activeParameterSchemaTabs};t[r.name]=e.target.dataset.tab,this.activeParameterSchemaTabs=t}}}">
                            <button class="tab-btn ${"example"!==this.activeParameterSchemaTabs[r.name]?"active":""}" data-tab = 'schema'>Parameters</button>
                            <button class="tab-btn ${"example"===this.activeParameterSchemaTabs[r.name]?"active":""}" data-tab = 'example'>Example </button>
                          </div>
                          ${"example"===this.activeParameterSchemaTabs[r.name]?q`<div class="tab-content col">
                              <textarea 
                                class = "textarea request-param"
                                part = "textarea textarea-param"
                                data-ptype = "${e}-object"
                                data-pname = "${r.name}"
                                data-example = "${d.exampleVal}"
                                data-param-serialize-style = "${l}"
                                data-param-serialize-explode = "${c}"
                                data-param-allow-reserved = "${p}"
                                spellcheck = "false"
                                .textContent = "${"true"===this.fillRequestFieldsWithExample?d.exampleVal:""}"
                                style = "resize:vertical; width:100%; height: ${"read focused".includes(this.renderStyle)?"180px":"120px"};"
                              ></textarea>
                            </div>`:q`
                              <div class="tab-content col">            
                                <schema-tree
                                  class = 'json'
                                  style = 'display: block'
                                  .data = '${s}'
                                  schema-expand-level = "${this.schemaExpandLevel}"
                                  schema-description-expanded = "${this.schemaDescriptionExpanded}"
                                  allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}",
                                  schema-hide-read-only = "${this.schemaHideReadOnly.includes(this.method)}"
                                  schema-hide-write-only = "${this.schemaHideWriteOnly.includes(this.method)}"
                                  exportparts = "btn:btn, btn-fill:btn-fill, btn-outline:btn-outline, btn-try:btn-try, btn-clear:btn-clear, btn-clear-resp:btn-clear-resp,
                file-input:file-input, textbox:textbox, textbox-param:textbox-param, textarea:textarea, textarea-param:textarea-param, 
                anchor:anchor, anchor-param-example:anchor-param-example"
                                > </schema-tree>
                              </div>`}
                        </div>`:q`
                        <input type="${"password"===i.format?"password":"text"}" spellcheck="false" style="width:100%" W
                          data-ptype="${e}"
                          data-pname="${r.name}" 
                          data-example="${Array.isArray(d.exampleVal)?d.exampleVal.join("~|~"):d.exampleVal}"
                          data-param-allow-reserved = "${p}"
                          data-x-fill-example = "${r["x-fill-example"]||"yes"}"
                          data-array="false"
                          value="${r.schema.default}"
                          @input = ${e=>{const t=this.getRequestPanel(e);this.liveCURLSyntaxUpdate(t)}}
                        />`}`:""}
              <span class="param-description">${KP(He(r.description||""))}</span>
              ${this.exampleListTemplate.call(this,r.name,i.type,d.exampleList)}
            `)}return q`
    <div class="request-card">
      <div class="request-title-container">
        <div class="request-title">${r}</div>
        <bread-crumbs
          .headers=${[{title:this.schemaShortSummary,link:"."},{title:r,link:"."}]}
        >
        </bread-crumbs>
      </div>
      <hr style="border-top: 1px solid #E7E9EE;border-bottom:0;margin-block: 24px 0px;">
      <div style="display:block; overflow-x:auto; max-width:100%;padding-inline: 16px;">
        <div style="width:100%; display:flex; flex-direction: column;">
          ${n}
        </div>
      </div>
    </div>`}async beforeNavigationFocusedMode(){}async afterNavigationFocusedMode(){this.selectedRequestBodyType="",this.selectedRequestBodyExample="",this.updateExamplesFromDataAttr(),this.clearResponseData()}onSelectExample(e){this.selectedRequestBodyExample=e.target.value;const t=e.target;window.setTimeout((e=>{const t=e.closest(".example-panel").querySelector(".request-body-param");e.closest(".example-panel").querySelector(".request-body-param-user-input").value=t.innerText;const r=this.getRequestPanel({target:e});this.liveCURLSyntaxUpdate(r)}),0,t)}onMimeTypeChange(e){this.selectedRequestBodyType=e.target.value;const t=e.target;this.selectedRequestBodyExample="",window.setTimeout((e=>{const t=e.closest(".request-body-container").querySelector(".request-body-param");if(t){e.closest(".request-body-container").querySelector(".request-body-param-user-input").value=t.innerText}}),0,t)}requestBodyTemplate(){if(!this.request_body)return"";if(0===Object.keys(this.request_body).length)return"";let e="",t="",r="",n="",o="";const a=[],{content:i}=this.request_body;for(const e in i)a.push({mimeType:e,schema:i[e].schema,example:i[e].example,examples:i[e].examples}),this.selectedRequestBodyType||(this.selectedRequestBodyType=e);return e=1===a.length?"":q`
        <select style="min-width:100px; max-width:100%;  margin-bottom:-1px;" @change = '${e=>this.onMimeTypeChange(e)}'>
          ${a.map((e=>q`
            <option value = '${e.mimeType}' ?selected = '${e.mimeType===this.selectedRequestBodyType}'>
              ${e.mimeType}
            </option> `))}
        </select>
      `,a.forEach((e=>{let a,i=[];if(this.selectedRequestBodyType.includes("json")||this.selectedRequestBodyType.includes("xml")||this.selectedRequestBodyType.includes("text")||this.selectedRequestBodyType.includes("jose"))e.mimeType===this.selectedRequestBodyType&&(i=__(e.schema,e.mimeType,e.examples,e.example,"true"===this.callback||"true"===this.webhook,"true"!==this.callback&&"true"!==this.webhook,"text",!1),this.selectedRequestBodyExample||(this.selectedRequestBodyExample=i.length>0?i[0].exampleId:""),o=q`
            ${o}
            <div class = 'example-panel pad-top-8'>
              ${1===i.length?"":q`
                  <select style="min-width:100px; max-width:100%;  margin-bottom:-1px;" @change='${e=>this.onSelectExample(e)}'>
                    ${i.map((e=>q`<option value="${e.exampleId}" ?selected=${e.exampleId===this.selectedRequestBodyExample} > 
                      ${e.exampleSummary.length>80?e.exampleId:e.exampleSummary?e.exampleSummary:e.exampleId} 
                    </option>`))}
                  </select>
                `}
              ${i.filter((e=>e.exampleId===this.selectedRequestBodyExample)).map((t=>q`
                <div class="example ${t.exampleId===this.selectedRequestBodyExample?"example-selected":""}" data-example = '${t.exampleId}'>
                  ${t.exampleSummary&&t.exampleSummary.length>80?q`<div style="padding: 4px 0"> ${t.exampleSummary} </div>`:""}
                  ${t.exampleDescription?q`<div class="m-markdown-small" style="padding: 4px 0"> ${KP(He(t.exampleDescription||""))} </div>`:""}
                  <!-- This pre(hidden) is to store the original example value, this will remain unchanged when users switches from one example to another, its is used to populate the editable textarea -->
                  <pre 
                    class = "textarea is-hidden request-body-param ${e.mimeType.substring(e.mimeType.indexOf("/")+1)}" 
                    spellcheck = "false"
                    data-ptype = "${e.mimeType}" 
                    style="width:100%; resize:vertical; display:none"
                  >${"text"===t.exampleFormat?t.exampleValue:JSON.stringify(t.exampleValue,null,2)}</pre>

                  <!-- this textarea is for user to edit the example -->
                  <textarea 
                    class = "textarea request-body-param-user-input"
                    part = "textarea textarea-param"
                    spellcheck = "false"
                    data-ptype = "${e.mimeType}" 
                    data-example = "${"text"===t.exampleFormat?t.exampleValue:JSON.stringify(t.exampleValue,null,2)}"
                    data-example-format = "${t.exampleFormat}"
                    style="width:100%; resize:vertical;"
                    .textContent = "${"true"===this.fillRequestFieldsWithExample?"text"===t.exampleFormat?t.exampleValue:JSON.stringify(t.exampleValue,null,2):""}"
                    @input=${e=>{const t=this.getRequestPanel(e);this.liveCURLSyntaxUpdate(t)}}
                  ></textarea>
                </div>  
              `))}

            </div>
          `);else if(this.selectedRequestBodyType.includes("form-urlencoded")||this.selectedRequestBodyType.includes("form-data")){if(e.mimeType===this.selectedRequestBodyType){const t=__(e.schema,e.mimeType,e.examples,e.example,"true"===this.callback||"true"===this.webhook,"true"!==this.callback&&"true"!==this.webhook,"text",!1);e.schema&&(r=this.formDataTemplate(e.schema,e.mimeType,t[0]?t[0].exampleValue:""))}}else/^audio\/|^image\/|^video\/|^font\/|tar$|zip$|7z$|rtf$|msword$|excel$|\/pdf$|\/octet-stream$/.test(this.selectedRequestBodyType)&&e.mimeType===this.selectedRequestBodyType&&(t=q`
            <div class = "small-font-size bold-text row">
              <input type="file" part="file-input" style="max-width:100%" class="request-body-param-file" data-ptype="${e.mimeType}" spellcheck="false" />
            </div>  
          `);(e.mimeType.includes("json")||e.mimeType.includes("xml")||e.mimeType.includes("text")||this.selectedRequestBodyType.includes("jose"))&&(a=P_(e.schema,{}),"table"===this.schemaStyle?n=q`
            ${n}
            <schema-table
              class = '${e.mimeType.substring(e.mimeType.indexOf("/")+1)}'
              style = 'display: ${this.selectedRequestBodyType===e.mimeType?"block":"none"};'
              .data = '${a}'
              schema-expand-level = "${this.schemaExpandLevel}"
              schema-description-expanded = "${this.schemaDescriptionExpanded}"
              allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
              schema-hide-read-only = "${this.schemaHideReadOnly}"
              schema-hide-write-only = "${this.schemaHideWriteOnly}"
              exportparts = "schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
            > </schema-table>
          `:"tree"===this.schemaStyle&&(n=q`
            ${n}
            <schema-tree
              class = "${e.mimeType.substring(e.mimeType.indexOf("/")+1)}"
              style = "display: ${this.selectedRequestBodyType===e.mimeType?"block":"none"};"
              .data = "${a}"
              schema-expand-level = "${this.schemaExpandLevel}"
              schema-description-expanded = "${this.schemaDescriptionExpanded}"
              allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
              schema-hide-read-only = "${this.schemaHideReadOnly}"
              schema-hide-write-only = "${this.schemaHideWriteOnly}"
              exportparts = "schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
            > </schema-tree>
          `))})),q`
      <div class='request-body-container' data-selected-request-body-type="${this.selectedRequestBodyType}">
        <div class="table-title top-gap row">
          REQUEST BODY ${this.request_body.required?q`<span class="mono-font" style='color:var(--red)'>*</span>`:""} 
          <code style = "font-weight:normal; margin-left:5px"> ${this.selectedRequestBodyType}</code>
          <span style="flex:1"></span>
          ${e}
        </div>
        ${this.request_body.description?q`<div class="m-markdown" style="margin-bottom:12px">${KP(He(this.request_body.description))}</div>`:""}
        
        ${this.selectedRequestBodyType.includes("json")||this.selectedRequestBodyType.includes("xml")||this.selectedRequestBodyType.includes("text")||this.selectedRequestBodyType.includes("jose")?q`
            <div class="tab-panel col" style="border-width:0 0 1px 0; margin-top: 24px;">
              <div class="tab-buttons row" @click="${e=>{"button"===e.target.tagName.toLowerCase()&&(this.activeSchemaTab=e.target.dataset.tab)}}">
                <button class="tab-btn ${"example"!==this.activeSchemaTab?"active":""}" data-tab = 'schema'>Parameters</button>
                <button class="tab-btn ${"example"===this.activeSchemaTab?"active":""}" data-tab = 'example'>Example</button>
              </div>
              ${q`<div class="tab-content col" style="display:${"example"===this.activeSchemaTab?"block":"none"};"> ${o}</div>`}
              ${q`<div class="tab-content col" style="display:${"example"===this.activeSchemaTab?"none":"block"};"> ${n}</div>`}
            </div>`:q`  
            ${t}
            ${r}`}
      </div>  
    `}formDataParamAsObjectTemplate(e,t,r){var n;const o=P_(t,{}),a=__(t,"json",t.examples,t.example,"true"===this.callback||"true"===this.webhook,"true"!==this.callback&&"true"!==this.webhook,"text",!1);return q`
      <div class="tab-panel row" style="min-height:220px; border-left: 6px solid var(--light-border-color); align-items: stretch;">
        <div style="width:24px; background-color:var(--light-border-color)">
          <div class="row" style="flex-direction:row-reverse; width:160px; height:24px; transform:rotate(270deg) translateX(-160px); transform-origin:top left; display:block;" @click="${e=>{if(e.target.classList.contains("v-tab-btn")){const{tab:t}=e.target.dataset;if(t){const r=e.target.closest(".tab-panel"),n=r.querySelector(`.v-tab-btn[data-tab="${t}"]`),o=[...r.querySelectorAll(`.v-tab-btn:not([data-tab="${t}"])`)],a=r.querySelector(`.tab-content[data-tab="${t}"]`),i=[...r.querySelectorAll(`.tab-content:not([data-tab="${t}"])`)];n.classList.add("active"),a.style.display="block",o.forEach((e=>{e.classList.remove("active")})),i.forEach((e=>{e.style.display="none"}))}}"button"===e.target.tagName.toLowerCase()&&(this.activeSchemaTab=e.target.dataset.tab)}}">
          <button class="v-tab-btn ${"example"!==this.activeSchemaTab?"active":""}" data-tab = 'schema'>Parameters</button>
          <button class="v-tab-btn ${"example"===this.activeSchemaTab?"active":""}" data-tab = 'example'>Example</button>
        </div>
      </div>
      ${q`
        <div class="tab-content col" data-tab = 'example' style="display:${"example"===this.activeSchemaTab?"block":"none"}; padding-left:5px; width:100%"> 
          <textarea 
            class = "textarea"
            part = "textarea textarea-param"
            style = "width:100%; border:none; resize:vertical;" 
            data-array = "false" 
            data-ptype = "${r.includes("form-urlencode")?"form-urlencode":"form-data"}"
            data-pname = "${e}"
            data-example = "${(null===(n=a[0])||void 0===n?void 0:n.exampleValue)||""}"
            .textContent = "${"true"===this.fillRequestFieldsWithExample?a[0].exampleValue:""}"
            spellcheck = "false"
          ></textarea>
        </div>`}
      ${q`
        <div class="tab-content col" data-tab = 'schema' style="display:${"example"!==this.activeSchemaTab?"block":"none"}; padding-left:5px; width:100%;"> 
          <schema-tree
            .data = '${o}'
            schema-expand-level = "${this.schemaExpandLevel}"
            schema-description-expanded = "${this.schemaDescriptionExpanded}"
            allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}",
          > </schema-tree>
        </div>`}
      </div>
    `}formDataTemplate(e,t,r=""){const n=[];if(e.properties){for(const r in e.properties){var o,a;const i=e.properties[r];if(i.readOnly)continue;const s=i.examples||i.example||"",l=i.type,c=w_(i),p="read focused".includes(this.renderStyle)?"200px":"160px",d=$_(c.examples||c.example,c.type);n.push(q`
        <tr title="${i.deprecated?"Deprecated":""}"> 
          <td style="width:${p}; min-width:100px;">
            <div class="param-name ${i.deprecated?"deprecated":""}">
              ${r}${null!==(o=e.required)&&void 0!==o&&o.includes(r)||i.required?q`<span style='color:var(--red);'>*</span>`:""}
            </div>
            <div class="param-type">${c.type}</div>
          </td>  
          <td 
            style="${"object"===l?"width:100%; padding:0;":"true"===this.allowTry?"":"display:none;"} min-width:100px;" 
            colspan="${"object"===l?2:1}">
            ${"array"===l?"binary"===(null===(a=i.items)||void 0===a?void 0:a.format)?q`
                <div class="file-input-container col" style='align-items:flex-end;' @click="${e=>this.onAddRemoveFileInput(e,r,t)}">
                  <div class='input-set row'>
                    <input 
                      type = "file"
                      part = "file-input"
                      style = "width:100%" 
                      data-pname = "${r}" 
                      data-ptype = "${t.includes("form-urlencode")?"form-urlencode":"form-data"}"
                      data-array = "false" 
                      data-file-array = "true" 
                    />
                    <button class="file-input-remove-btn"> &#x2715; </button>
                  </div>  
                  <button class="m-btn primary file-input-add-btn" part="btn btn-fill" style="margin:2px 25px 0 0; padding:2px 6px;">ADD</button>
                </div>  
                `:q`
                  <tag-input
                    style = "width:100%" 
                    data-ptype = "${t.includes("form-urlencode")?"form-urlencode":"form-data"}"
                    data-pname = "${r}"
                    data-example = "${Array.isArray(s)?s.join("~|~"):s}"
                    data-array = "true"
                    placeholder = "add-multiple &#x21a9;"
                    .value = "${Array.isArray(s)?Array.isArray(s[0])?s[0]:[s[0]]:[s]}"
                  >
                  </tag-input>
                `:q`
                ${"object"===l?this.formDataParamAsObjectTemplate.call(this,r,i,t):q`
                    ${"true"===this.allowTry?q`<input
                          .value = "${"true"===this.fillRequestFieldsWithExample?d.exampleVal:""}"
                          spellcheck = "false"
                          type = "${"binary"===i.format?"file":"password"===i.format?"password":"text"}"
                          part = "textbox textbox-param"
                          style = "width:100%"
                          data-ptype = "${t.includes("form-urlencode")?"form-urlencode":"form-data"}"
                          data-pname = "${r}"
                          data-example = "${Array.isArray(s)?s[0]:s}"
                          data-array = "false"
                          @input = ${e=>{const t=this.getRequestPanel(e);this.liveCURLSyntaxUpdate(t)}}
                        />`:""}
                    `}`}
          </td>
          ${"object"===l?"":q`
              <td>
                ${c.default||c.constrain||c.allowedValues||c.pattern?q`
                    <div class="param-constraint">
                      ${c.default?q`<span style="font-weight:bold">Default: </span>${c.default}<br/>`:""}
                      ${c.pattern?q`<span style="font-weight:bold">Pattern: </span>${c.pattern}<br/>`:""}
                      ${c.constrain?q`${c.constrain}<br/>`:""}
                      ${c.allowedValues&&c.allowedValues.split("┃").map(((e,t)=>q`
                        ${t>0?"┃":q`<span style="font-weight:bold">Allowed: </span>`}
                        ${q`
                          <a part="anchor anchor-param-constraint" class = "${"true"===this.allowTry?"":"inactive-link"}"
                            data-type="${"array"===c.type?c.type:"string"}"
                            data-enum="${e.trim()}"
                            @click="${e=>{const t=e.target.closest("div").querySelector(`[data-pname="${r}"]`);if(t){"array"===e.target.dataset.type?t.value=[e.target.dataset.enum]:t.value=e.target.dataset.enum;const r=this.getRequestPanel(e);this.liveCURLSyntaxUpdate(r)}}}"
                          > 
                            ${e} 
                          </a>`}`))}
                    </div>`:""}
              </td>`}
        </tr>
        ${"object"===l?"":q`
            <tr>
              <td style="border:none"> </td>
              <td colspan="2" style="border:none; margin-top:0; padding:0 5px 8px 5px;"> 
                <span class="m-markdown-small">${KP(He(i.description||""))}</span>
                ${this.exampleListTemplate.call(this,r,c.type,d.exampleList)}
              </td>
            </tr>
          `}`)}return q`
        <table role="presentation" style="width:100%;" class="m-table">
          ${n}
        </table>
      `}return q`
      <textarea
        class = "textarea dynamic-form-param ${t}"
        part = "textarea textarea-param"
        spellcheck = "false"
        data-pname="dynamic-form" 
        data-ptype="${t}"
        .textContent = "${r}"
        style="width:100%"
      ></textarea>
      ${e.description?q`<span class="m-markdown-small">${KP(He(e.description))}</span>`:""}
    `}curlSyntaxTemplate(e="flex"){return q`
      <div class="col m-markdown" style="flex:1; display:${e}; position:relative; max-width: 100%;">
        <button  class="toolbar-btn" style = "position:absolute; top:12px; right:8px" @click='${e=>{it(this.curlSyntax.replace(/\\$/,""),e)}}' part="btn btn-fill"> Copy </button>
        <pre class="code-container" style="white-space:pre; border: none;"><code>${KP(Ve().highlight(this.curlSyntax.trim().replace(/\\$/,""),Ve().languages.shell,"shell"))}</code></pre>
      </div>
      `}apiResponseTabTemplate(){let e="",t="";if(!this.responseIsBlob)if(this.responseHeaders.includes("application/x-ndjson")){e="json";const r=this.responseText.split("\n").map((t=>Ve().highlight(t,Ve().languages[e],e))).join("\n");t=q`<code>${KP(r)}</code>`}else this.responseHeaders.includes("json")?(e="json",t=q`<code>${KP(Ve().highlight(this.responseText,Ve().languages[e],e))}</code>`):this.responseHeaders.includes("html")||this.responseHeaders.includes("xml")?(e="html",t=q`<code>${KP(Ve().highlight(this.responseText,Ve().languages[e],e))}</code>`):(e="text",t=q`<code>${this.responseText}</code>`);return q`
      <div class="row" style="font-size:var(--font-size-small); margin:5px 0">
        <div style="flex:1"></div>
        <button class="m-btn" part="btn btn-outline btn-clear-response" @click="${this.clearResponseData}">CLEAR RESPONSE</button>
      </div>
      <div class="tab-panel col" style="border-top: 1px solid #E7E9EE; border-bottom: 1px solid #E7E9EE; margin-top: 24px;">
        ${this.curlSyntaxTemplate("flex")}
        <div style="background: #F8F7FC; padding-inline: 32px;padding-block: 16px">
          ${this.responseMessage?q`
                <div class="row" style="width:100%; height:max-content; background:#E7E9EE; border-radius:2px;padding-inline:4px;margin-bottom:4px">
                  <div style="min-width:8px;min-height:8px;width:8px;height:8px;border-radius:50%;${this.responseBlobUrl||this.responseText?"border: 1px solid #79A479;background: #E6F2E6;":"border: 1px solid #DC4C43;background: #F0E6E4;"}"></div>
                  <div style="margin-left:4px; color:#4A596B; font-size:12px; font-weight:500;">${this.responseMessage}</div>
                </div>`:""}
          ${this.responseIsBlob?q`
              <div class="tab-content col" style="flex:1; display:${"response"===this.activeResponseTab?"flex":"none"};">
                <button class="m-btn thin-border mar-top-8" style="width:135px" @click='${e=>{ct(this.responseBlobUrl,this.respContentDisposition)}}' part="btn btn-outline">
                  DOWNLOAD
                </button>
                ${"view"===this.responseBlobType?q`<button class="m-btn thin-border mar-top-8" style="width:135px"  @click='${e=>{pt(this.responseBlobUrl)}}' part="btn btn-outline">VIEW (NEW TAB)</button>`:""}
              </div>`:q`
              ${this.responseText?q`
                <div class="tab-content col m-markdown" style="max-height:500px; flex:1; display:flex;" >
                  <button class="toolbar-btn" style="position:absolute; top:12px; right:16px" @click='${e=>{it(this.responseText,e)}}' part="btn btn-fill"> Copy </button>
                  <pre style="display:flex; white-space:pre; min-height:50px; height:auto; resize:vertical; overflow:auto">${t}</pre>
                </div>`:""}`}
        </div>
      </div>`}apiCallTemplate(){var e,t;let r="";this.servers&&this.servers.length>0&&(r=q`
        <select style="min-width:100px;" @change='${e=>{this.serverUrl=e.target.value}}'>
          ${this.servers.map((e=>q`<option value = "${e.url}"> ${e.url} - ${e.description} </option>`))}
        </select>
      `);const n=q`
      <div style="display:flex; flex-direction:column;">
        ${r}
        ${this.serverUrl?q`
            <div style="display:flex; align-items:baseline;">
              <div style="font-weight:bold; padding-right:5px;">API Server</div> 
              <span class = "gray-text"> ${this.serverUrl} </span>
            </div>
          `:""}
      </div>  
    `;if(this.resultLoad){const e=this.renderRoot.host.shadowRoot.children[0];this.liveCURLSyntaxUpdate(e.target?e.target:e)}else this.updateComplete.then((()=>{const e=this.renderRoot.host.shadowRoot.children[0];this.liveCURLSyntaxUpdate(e.target?e.target:e)})),this.resultLoad=!0;return q`
    <div style="display:flex; align-items:flex-end; margin:16px 0; font-size:var(--font-size-small);" part="wrap-request-btn">
      <div class="hide-in-small-screen" style="flex-direction:column; margin:0; width:calc(100% - 60px);">
        <div style="display:flex; flex-direction:row; align-items:center; overflow:hidden;"> 
          ${n}
        </div>
        <div style="display:flex;">
          <div style="font-weight:bold; padding-right:5px;">Authentication</div>
          ${(null===(e=this.security)||void 0===e?void 0:e.length)>0?q`
              ${this.api_keys.length>0?q`<div style="color:var(--blue); overflow:hidden;"> 
                    ${1===this.api_keys.length?`${null===(t=this.api_keys[0])||void 0===t?void 0:t.typeDisplay} in ${this.api_keys[0].in}`:`${this.api_keys.length} API keys applied`} 
                  </div>`:q`<div class="gray-text">Required  <span style="color:var(--red)">(None Applied)</span>`}`:q`<span class="gray-text"> Not Required </span>`}
        </div>
      </div>
      <!-- ${this.parameters.length>0||this.request_body?q`
            <button class="m-btn thin-border" part="btn btn-outline btn-fill" style="margin-right:5px;" @click="${this.onFillRequestData}" title="Fills with example data (if provided)">
              FILL EXAMPLE
            </button>
            <button class="m-btn thin-border" part="btn btn-outline btn-clear" style="margin-right:5px;" @click="${this.onClearRequestData}">
              CLEAR
            </button>`:""} 
      <button class="m-btn primary thin-border" part="btn btn-try" @click="${this.onTryClick}">TRY</button>
      -->
    </div>
    `}async onFillRequestData(e){[...e.target.closest(".request-panel").querySelectorAll("input, tag-input, textarea:not(.is-hidden)")].forEach((e=>{e.dataset.example&&("TAG-INPUT"===e.tagName.toUpperCase()?e.value=e.dataset.example.split("~|~"):e.value=e.dataset.example)}))}async onClearRequestData(e){[...e.target.closest(".request-panel").querySelectorAll("input, tag-input, textarea:not(.is-hidden)")].forEach((e=>{e.value=""}))}buildFetchURL(e){let t;const r=[...e.querySelectorAll("[data-ptype='path']")],n=[...e.querySelectorAll("[data-ptype='query']")],o=[...e.querySelectorAll("[data-ptype='query-object']")];t=this.path,r.map((e=>{t=t.replace(`{${e.dataset.pname}}`,encodeURIComponent(e.value))}));const a=new Map,i=[];n.length>0&&n.forEach((e=>{const t=new URLSearchParams;if("true"===e.dataset.paramAllowReserved&&i.push(e.dataset.pname),"false"===e.dataset.array)""!==e.value&&t.append(e.dataset.pname,e.value);else{const{paramSerializeStyle:r,paramSerializeExplode:n}=e.dataset;let o=e.value&&Array.isArray(e.value)?e.value:[];o=Array.isArray(o)?o.filter((e=>""!==e)):[],o.length>0&&("spaceDelimited"===r?t.append(e.dataset.pname,o.join(" ").replace(/^\s|\s$/g,"")):"pipeDelimited"===r?t.append(e.dataset.pname,o.join("|").replace(/^\||\|$/g,"")):"true"===n?o.forEach((r=>{t.append(e.dataset.pname,r)})):t.append(e.dataset.pname,o.join(",").replace(/^,|,$/g,"")))}t.toString()&&a.set(e.dataset.pname,t)})),o.length>0&&o.map((e=>{const t=new URLSearchParams;try{let r={};const{paramSerializeStyle:n,paramSerializeExplode:o,pname:a}=e.dataset;if(r=Object.assign(r,JSON.parse(e.value.replace(/\s+/g," "))),"true"===e.dataset.paramAllowReserved&&i.push(e.dataset.pname),"json xml".includes(n))"json"===n?t.append(e.dataset.pname,JSON.stringify(r)):"xml"===n&&t.append(e.dataset.pname,A_(r));else for(const e in r){const i=`${a}[${e}]`;"object"==typeof r[e]?Array.isArray(r[e])&&("spaceDelimited"===n?t.append(i,r[e].join(" ")):"pipeDelimited"===n?t.append(i,r[e].join("|")):"true"===o?r[e].forEach((e=>{t.append(i,e)})):t.append(i,r[e])):t.append(i,r[e])}}catch(t){console.error("RapiDoc: unable to parse %s into object",e.value)}t.toString()&&a.set(e.dataset.pname,t)}));let s="";return a.size&&(a.forEach(((e,t)=>{i.includes(t)?(s+=`${t}=`,s+=e.getAll(t).join(`&${t}=`),s+="&"):s+=`${e.toString()}&`})),s=s.slice(0,-1)),0!==s.length&&(t=`${t}${t.includes("?")?"&":"?"}${s}`),this.api_keys.filter((e=>"query"===e.in)).forEach((e=>{t=`${t}${t.includes("?")?"&":"?"}${e.name}=${encodeURIComponent(e.finalKeyValue)}`})),t=`${this.selectedServer.computedUrl.replace(/\/$/,"")}${t}`,t}buildFetchHeaders(e){var t;const r=null===(t=this.closest(".expanded-req-resp-container, .req-resp-container"))||void 0===t?void 0:t.getElementsByTagName("api-response")[0],n=[...e.querySelectorAll("[data-ptype='header']")],o=e.querySelector(".request-body-container"),a=null==r?void 0:r.selectedMimeType,i=new Headers;if(a?i.append("Accept",a):this.accept&&i.append("Accept",this.accept),this.api_keys.filter((e=>"header"===e.in)).forEach((e=>{i.append(e.name,e.finalKeyValue)})),n.map((e=>{e.value&&i.append(e.dataset.pname,e.value)})),this.resolvedSpec.securitySchemes.forEach((e=>{i.append(e.name,e.value)})),o){const e=o.dataset.selectedRequestBodyType;e.includes("form-data")||i.append("Content-Type",e)}return i}buildFetchBodyOptions(e){const t=e.querySelector(".request-body-container"),r={method:this.method.toUpperCase()};if(t){const n=t.dataset.selectedRequestBodyType;if(n.includes("form-urlencoded")){const t=e.querySelector("[data-ptype='dynamic-form']");if(t){const e=t.value,n=new URLSearchParams;let o,a=!0;if(e)try{o=JSON.parse(e)}catch(e){a=!1,console.warn("RapiDoc: Invalid JSON provided",e)}else a=!1;if(a){for(const e in o)n.append(e,JSON.stringify(o[e]));r.body=n}}else{const t=[...e.querySelectorAll("[data-ptype='form-urlencode']")],n=new URLSearchParams;t.filter((e=>"file"!==e.type)).forEach((e=>{if("false"===e.dataset.array)e.value&&n.append(e.dataset.pname,e.value);else{const t=e.value&&Array.isArray(e.value)?e.value.join(","):"";n.append(e.dataset.pname,t)}})),r.body=n}}else if(n.includes("form-data")){const t=new FormData;[...e.querySelectorAll("[data-ptype='form-data']")].forEach((e=>{"false"===e.dataset.array?"file"===e.type&&e.files[0]?t.append(e.dataset.pname,e.files[0],e.files[0].name):e.value&&t.append(e.dataset.pname,e.value):e.value&&Array.isArray(e.value)&&t.append(e.dataset.pname,e.value.join(","))})),r.body=t}else if(/^audio\/|^image\/|^video\/|^font\/|tar$|zip$|7z$|rtf$|msword$|excel$|\/pdf$|\/octet-stream$/.test(n)){const t=e.querySelector(".request-body-param-file");null!=t&&t.files[0]&&(r.body=t.files[0])}else if(n.includes("json")||n.includes("xml")||n.includes("text")){const t=e.querySelector(".request-body-param-user-input");null!=t&&t.value&&(r.body=t.value)}}return r}async onTryClick(e){const t=e.target,r=t.closest(".request-panel"),n=`/api/proxy/${encodeURIComponent(this.buildFetchURL(r))}`,o=this.buildFetchBodyOptions(r),a=this.buildFetchHeaders(r);this.responseUrl="",this.responseHeaders=[],this.curlSyntax=this.generateCURLSyntax(n,a,o,r),this.responseStatus="success",this.responseIsBlob=!1,this.respContentDisposition="",this.responseBlobUrl&&(URL.revokeObjectURL(this.responseBlobUrl),this.responseBlobUrl=""),this.fetchCredentials&&(o.credentials=this.fetchCredentials);const i=new AbortController,{signal:s}=i;o.headers=a;const l={url:n,...o};this.dispatchEvent(new CustomEvent("before-try",{bubbles:!0,composed:!0,detail:{request:l,controller:i}}));const c={method:l.method,headers:l.headers,credentials:l.credentials,body:l.body},p=new Request(l.url,c);let d,u;try{let e,r,n;t.disabled=!0,this.responseText="",this.responseMessage="",this.requestUpdate();const o=performance.now();d=await fetch(p,{signal:s});const a=performance.now();u=d.clone(),t.disabled=!1,this.responseMessage=q`${d.statusText?`${d.statusText}:${d.status}`:d.status} <div style="color:var(--light-fg)"> Took ${Math.round(a-o)} milliseconds </div>`,this.responseUrl=d.url;const i={};d.headers.forEach(((e,t)=>{i[t]=e,this.responseHeaders=`${this.responseHeaders}${t}: ${e}\n`}));const l=d.headers.get("content-type");if(0===(await d.clone().text()).length)this.responseText="";else if(l){if("application/x-ndjson"===l)this.responseText=await d.text();else if(l.includes("json"))if(/charset=[^"']+/.test(l)){const e=l.split("charset=")[1],t=await d.arrayBuffer();try{n=new TextDecoder(e).decode(t)}catch{n=new TextDecoder("utf-8").decode(t)}try{r=JSON.parse(n),this.responseText=JSON.stringify(r,null,2)}catch{this.responseText=n}}else r=await d.json(),this.responseText=JSON.stringify(r,null,2);else/^font\/|tar$|zip$|7z$|rtf$|msword$|excel$|\/pdf$|\/octet-stream$|^application\/vnd\./.test(l)?(this.responseIsBlob=!0,this.responseBlobType="download"):/^audio|^image|^video/.test(l)?(this.responseIsBlob=!0,this.responseBlobType="view"):(n=await d.text(),l.includes("xml")?this.responseText=y_()(n,{textNodesOnSameLine:!0,indentor:"  "}):this.responseText=n);if(this.responseIsBlob){const t=d.headers.get("content-disposition");this.respContentDisposition=t?t.split("filename=")[1].replace(/"|'/g,""):"filename",e=await d.blob(),this.responseBlobUrl=URL.createObjectURL(e)}}else n=await d.text(),this.responseText=n;this.dispatchEvent(new CustomEvent("after-try",{bubbles:!0,composed:!0,detail:{request:p,response:u,responseHeaders:i,responseBody:r||n||e,responseStatus:u.ok}}))}catch(e){t.disabled=!1,"AbortError"===e.name?(this.dispatchEvent(new CustomEvent("request-aborted",{bubbles:!0,composed:!0,detail:{err:e,request:p}})),this.responseMessage="Request Aborted",this.responseText="Request Aborted"):(this.dispatchEvent(new CustomEvent("after-try",{bubbles:!0,composed:!0,detail:{err:e,request:p}})),this.responseMessage=`${e.message} (CORS or Network Issue)`)}this.requestUpdate()}liveCURLSyntaxUpdate(e){this.applyCURLSyntax(e),this.requestUpdate()}onGenerateCURLClick(e){const t=this.getRequestPanel(e);this.applyCURLSyntax(t)}getRequestPanel(e){return e.target.closest(".request-panel")}applyCURLSyntax(e){const t=this.buildFetchURL(e),r=this.buildFetchBodyOptions(e),n=this.buildFetchHeaders(e);this.curlSyntax=this.generateCURLSyntax(t,n,r,e)}generateCURLSyntax(e,t,r,n){let o,a="",i="",s="",l="";const c=n.querySelector(".request-body-container");if(!1===e.startsWith("http")){o=new URL(e,window.location.href).href}else o=e;if(a=`curl -X ${this.method.toUpperCase()} "${o}" \\\n`,i=Array.from(t).map((([e,t])=>` -H "${e}: ${t}"`)).join("\\\n"),i&&(i=`${i} \\\n`),r.body instanceof URLSearchParams)s=` -d ${r.body.toString()} \\\n`;else if(r.body instanceof File)s=` --data-binary @${r.body.name} \\\n`;else if(r.body instanceof FormData)l=Array.from(r.body).reduce(((e,[t,r])=>{if(r instanceof File)return[...e,` -F "${t}=@${r.name}"`];const n=r.match(/([^,],)/gm);if(n){const r=n.map((e=>`-F "${t}[]=${e}"`));return[...e,...r]}return[...e,` -F "${t}=${r}"`]}),[]).join("\\\n");else if(c&&c.dataset.selectedRequestBodyType){const e=c.dataset.selectedRequestBodyType,t=n.querySelector(".request-body-param-user-input");if(null!=t&&t.value){if(r.body=t.value,e.includes("json"))try{s=` -d '${JSON.stringify(JSON.parse(t.value))}' \\\n`}catch(e){}s||(s=` -d '${t.value.replace(/'/g,"'\"'\"'")}' \\\n`)}}return`${a}${i}${s}${l}`}onAddRemoveFileInput(e,t,r){if("button"!==e.target.tagName.toLowerCase())return;if(e.target.classList.contains("file-input-remove-btn")){return void e.target.closest(".input-set").remove()}const n=e.target.closest(".file-input-container"),o=document.createElement("div");o.setAttribute("class","input-set row");const a=document.createElement("input");a.type="file",a.style="width:200px; margin-top:2px;",a.setAttribute("data-pname",t),a.setAttribute("data-ptype",r.includes("form-urlencode")?"form-urlencode":"form-data"),a.setAttribute("data-array","false"),a.setAttribute("data-file-array","true");const i=document.createElement("button");i.setAttribute("class","file-input-remove-btn"),i.innerHTML="&#x2715;",o.appendChild(a),o.appendChild(i),n.insertBefore(o,e.target)}clearResponseData(){this.responseUrl="",this.responseHeaders="",this.responseText="",this.responseStatus="success",this.responseMessage="",this.responseIsBlob=!1,this.responseBlobType="",this.respContentDisposition="",this.responseBlobUrl&&(URL.revokeObjectURL(this.responseBlobUrl),this.responseBlobUrl="")}disconnectedCallback(){this.curlSyntax="",this.responseBlobUrl&&(URL.revokeObjectURL(this.responseBlobUrl),this.responseBlobUrl=""),super.disconnectedCallback()}});customElements.define("schema-table",class extends ae{static get properties(){return{schemaExpandLevel:{type:Number,attribute:"schema-expand-level"},schemaDescriptionExpanded:{type:String,attribute:"schema-description-expanded"},allowSchemaDescriptionExpandToggle:{type:String,attribute:"allow-schema-description-expand-toggle"},schemaHideReadOnly:{type:String,attribute:"schema-hide-read-only"},schemaHideWriteOnly:{type:String,attribute:"schema-hide-write-only"},data:{type:Object}}}connectedCallback(){super.connectedCallback(),(!this.schemaExpandLevel||this.schemaExpandLevel<1)&&(this.schemaExpandLevel=99999),this.schemaDescriptionExpanded&&"true false".includes(this.schemaDescriptionExpanded)||(this.schemaDescriptionExpanded="false"),this.schemaHideReadOnly&&"true false".includes(this.schemaHideReadOnly)||(this.schemaHideReadOnly="true"),this.schemaHideWriteOnly&&"true false".includes(this.schemaHideWriteOnly)||(this.schemaHideWriteOnly="true")}static get styles(){return[Ge,B_,c`
      .table {
        font-size: var(--font-size-small);
        text-align: left;
        line-height: calc(var(--font-size-small) + 6px);
      }
      .param-table{
        border-radius: 4px;
        border:1px solid var(--light-border-color);
        border-bottom: none;
        margin-top: 10px;
        font-size: 14px;
      }
      .param-table .tr {
        border-bottom: 1px solid var(--light-border-color);
      }
      .param-table .td {
        padding: 4px 0;
      }
      .param-table .key {
        width: 33%;
        padding: 12px 10px 12px;
      }
      .table .key-descr {
        width: 33%;
        padding: 0px 10px 12px;
      }
      .key .key-label {
        font-size: var(--font-size-mono);
      }
      .key.deprecated .key-label {
        color: var(--red);
      }
      .key-label {
        background-color: #f8f7fc;
        border-radius: 4px;
        padding: 0.2em 0.4em;
      }
      .param-table .key-type {
        white-space: normal;
        width: 33%;
        border-left:1px solid var(--light-border-color);
        border-right:1px solid var(--light-border-color);
        color:#4A4A4A;
        padding: 12px 10px 12px;
      }
      .collapsed-all-descr .tr:not(.expanded-descr) {
        max-height: calc(var(--font-size-small) + var(--font-size-small));
      }

      .obj-toggle {
        padding: 0 2px;
        border-radius:2px;
        border: 1px solid transparent;
        display: inline-block;
        margin-left: -16px;
        color:var(--primary-color);
        cursor:pointer;
        font-size: calc(var(--font-size-small) + 4px);
        font-family: var(--font-mono);
        background-clip: border-box;
      }
      .obj-toggle:hover {
        border-color: var(--primary-color);
      }
      .tr.expanded + .object-body {
        display:block;
      }
      .tr.collapsed + .object-body {
        display:none;
      }`,rt]}render(){var e,t,r;return q`
      <div class="table ${"true"===this.schemaDescriptionExpanded?"expanded-all-descr":"collapsed-all-descr"}" @click="${e=>this.handleAllEvents(e)}">
        <div class='toolbar'>
          <div class="toolbar-item schema-root-type ${(null===(e=this.data)||void 0===e?void 0:e["::type"])||""} "> ${(null===(t=this.data)||void 0===t?void 0:t["::type"])||""} </div>
          ${"true"===this.allowSchemaDescriptionExpandToggle?q`
              <div style="flex:1"></div>
              <div part="schema-multiline-toggle" class='toolbar-item schema-multiline-toggle' > 
                ${"true"===this.schemaDescriptionExpanded?"Single line description":"Multiline description"}
              </div>
            `:""}
        </div>
        ${null!==(r=this.data)&&void 0!==r&&r["::description"]?q`<span part="schema-description" class='m-markdown'> ${KP(He(this.data["::description"]||""))}</span>`:""}
        <div class="param-table">
          <div style='display:flex; border-bottom:1px solid var(--light-border-color);'>
            <div class='key' style='font-family:var(--font-regular); font-weight:bold; color:var(--fg); padding: 10px 14px;'> Field </div>
            <div class='key-type' style='font-family:var(--font-regular); font-weight:bold; color:var(--fg); padding: 10px 14px;'> Type </div>
            <div class='key-descr' style='font-family:var(--font-regular); font-weight:bold; color:var(--fg); padding: 10px 14px;'> Description </div>
          </div>
          ${this.data?q`
              ${this.generateTree("array"===this.data["::type"]?this.data["::props"]:this.data,this.data["::type"],this.data["::array-type"])}`:""}  
        </div>
      </div>  
    `}generateTree(e,t="object",r="",n="",o="",a=0,i=0,s=""){var l,c;if("true"===this.schemaHideReadOnly){if("array"===t&&"readonly"===s)return;if(e&&"readonly"===e["::readwrite"])return}if("true"===this.schemaHideWriteOnly){if("array"===t&&"writeonly"===s)return;if(e&&"writeonly"===e["::readwrite"])return}if(!e)return q`<div class="null" style="display:inline;">
        <span style='margin-left:${16*(a+1)}px'> &nbsp; </span>
        <span class="key-label xxx-of-key"> ${n.replace("::OPTION~","")}</span>
        ${"array"===t?q`<span class='mono-font'> [ ] </span>`:"object"===t?q`<span class='mono-font'> { } </span>`:q`<span class='mono-font'> schema undefined </span>`}
      </div>`;const p=null!==(l=e["::type"])&&void 0!==l&&l.startsWith("xxx-of")?a:a+1,d="xxx-of-option"===t||"xxx-of-option"===e["::type"]||n.startsWith("::OPTION")?i:i+1,u=10*d;if(0===Object.keys(e).length)return q`<span class="td key object" style='padding-left:${u}px'>${n}</span>`;let h="",f="",m=!1;if(n.startsWith("::ONE~OF")||n.startsWith("::ANY~OF"))h=n.replace("::","").replace("~"," "),m=!0;else if(n.startsWith("::OPTION")){const e=n.split("~");h=e[1],f=e[2]}else h=n;let g="";if("object"===e["::type"]?g="array"===t?"array of object":e["::dataTypeLabel"]||e["::type"]:"array"===e["::type"]&&(g="array"===t?"array of array "+("object"!==r?`of ${r}`:""):e["::dataTypeLabel"]||e["::type"]),"object"==typeof e)return q`
        ${p>=0&&n?q`
            <div class='tr ${p<=this.schemaExpandLevel?"expanded":"collapsed"} ${e["::type"]}' data-obj='${h}' title="${e["::deprecated"]?"Deprecated":""}">
              <div class="td key ${e["::deprecated"]?"deprecated":""}" style='padding-left:${u}px'>
                ${h||f?q`
                    <span class='obj-toggle ${p<this.schemaExpandLevel?"expanded":"collapsed"}' data-obj='${h}'>
                      ${a<this.schemaExpandLevel?"-":"+"}
                    </span>`:""}
                ${"xxx-of-option"===e["::type"]||"xxx-of-array"===e["::type"]||n.startsWith("::OPTION")?q`<span class="xxx-of-key" style="margin-left:-6px">${h}</span><span class="${m?"xxx-of-key":"xxx-of-descr"}">${f}</span>`:h.endsWith("*")?q`<span class="key-label" style="display:inline-block; margin-left:-6px;">${e["::deprecated"]?"✗":""} ${h.substring(0,h.length-1)}</span><span style='color:var(--red);'>*</span>`:q`<span class="key-label" style="display:inline-block; margin-left:-6px;">${e["::deprecated"]?"✗":""} ${"::props"===h?"":h}</span>`}
                ${"xxx-of"===e["::type"]&&"array"===t?q`<span style="color:var(--primary-color)">ARRAY</span>`:""} 
              </div>
              <div class='td key-type' title="${"readonly"===e["::readwrite"]?"Read-Only":"writeonly"===e["::readwrite"]?"Write-Only":""}">
                ${(e["::type"]||"").includes("xxx-of")?"":g}
                ${"readonly"===e["::readwrite"]?" 🆁":"writeonly"===e["::readwrite"]?" 🆆":""}
              </div>
              <div class='td key-descr' style='line-height:1.7'>${KP(He(o||""))}</div>
            </div>`:q`
            ${"array"===e["::type"]&&"array"===t?q`
                <div class='tr'> 
                  <div class='td key'></div> 
                  <div class='td key-type'>
                    ${r&&"object"!==r?`${t} of ${r}`:t}
                  </div> 
                  <div class='td key-descr'></div> 
                </div>`:""}`}
        <div class='object-body'>
        ${Array.isArray(e)&&e[0]?q`${this.generateTree(e[0],"xxx-of-option","","::ARRAY~OF","",p,d,"")}`:q`
            ${Object.keys(e).map((t=>{var r;return q`
              ${["::title","::description","::type","::props","::deprecated","::array-type","::readwrite","::dataTypeLabel"].includes(t)?"array"===e[t]["::type"]||"object"===e[t]["::type"]?q`${this.generateTree("array"===e[t]["::type"]?e[t]["::props"]:e[t],e[t]["::type"],e[t]["::array-type"]||"",t,e[t]["::description"],p,d,e[t]["::readwrite"]?e[t]["::readwrite"]:"")}`:"":q`${this.generateTree("array"===e[t]["::type"]?e[t]["::props"]:e[t],e[t]["::type"],e[t]["::array-type"]||"",t,(null===(r=e[t])||void 0===r?void 0:r["::description"])||"",p,d,e[t]["::readwrite"]?e[t]["::readwrite"]:"")}`}
            `}))}
          `}
        <div>
      `;const[y,v,b,x,w,k,$,S,A]=e.split("~|~");if("🆁"===v&&"true"===this.schemaHideReadOnly)return;if("🆆"===v&&"true"===this.schemaHideWriteOnly)return;const E=y.replace(/┃.*/g,"").replace(/[^a-zA-Z0-9+]/g,"").substring(0,4).toLowerCase(),O=""+(b||x||w||k?'<span class="descr-expand-toggle">➔</span>':"");let C="";return C="array"===t?q` 
        <div class='td key-type ${E}' title="${"readonly"===s?"Read-Only":"writeonly"===v?"Write-Only":""}">
          [${y}] ${"readonly"===s?"🆁":"writeonly"===s?"🆆":""}
        </div>`:q` 
        <div class='td key-type ${E}' title="${"🆁"===v?"Read-Only":"🆆"===v?"Write-Only":""}">
          ${y} ${v}
        </div>`,q`
      <div class = "tr primitive" title="${A?"Deprecated":""}">
        <div class="td key ${A}" style='padding-left:${u}px'>
          ${A?q`<span style='color:var(--red);'>✗</span>`:""}
          ${null!==(c=h)&&void 0!==c&&c.endsWith("*")?q`
              <span class="key-label">${h.substring(0,h.length-1)}</span>
              <span style='color:var(--red);'>*</span>`:n.startsWith("::OPTION")?q`<span class='xxx-of-key'>${h}</span><span class="xxx-of-descr">${f}</span>`:q`${h?q`<span class="key-label"> ${h}</span>`:q`<span class="xxx-of-descr">${S}</span>`}`}
        </div>
        ${C}
        <div class='td key-descr' style='font-size: var(--font-size-small)'>
          ${q`<span class="m-markdown-small">
            ${KP(He("array"===t?`${O} ${o}`:S?`${O} <b>${S}:</b> ${$}`:`${O} ${$}`))}
          </span>`}
          ${b?q`<div class='' style='display:inline-block; line-break:anywhere; margin-right:8px;'> <span class='bold-text'>Constraints: </span> ${b}</div>`:""}
          ${x?q`<div style='display:inline-block; line-break:anywhere; margin-right:8px;'> <span class='bold-text'>Default: </span>${x}</div>`:""}
          ${w?q`<div style='display:inline-block; line-break:anywhere; margin-right:8px;'> <span class='bold-text'>${"const"===y?"Value":"Allowed"}: </span>${w}</div>`:""}
          ${k?q`<div style='display:inline-block; line-break:anywhere; margin-right:8px;'> <span class='bold-text'>Pattern: </span>${k}</div>`:""}
        </div>
      </div>
    `}handleAllEvents(e){if(e.target.classList.contains("obj-toggle"))this.toggleObjectExpand(e);else if(e.target.classList.contains("schema-multiline-toggle"))this.schemaDescriptionExpanded="true"===this.schemaDescriptionExpanded?"false":"true";else if(e.target.classList.contains("descr-expand-toggle")){const t=e.target.closest(".tr");t&&(t.classList.toggle("expanded-descr"),t.style.maxHeight=t.scrollHeight)}}toggleObjectExpand(e){const t=e.target.closest(".tr");t.classList.contains("expanded")?(t.classList.add("collapsed"),t.classList.remove("expanded"),e.target.innerText="+"):(t.classList.remove("collapsed"),t.classList.add("expanded"),e.target.innerText="-")}});customElements.define("api-response",class extends ae{constructor(){super(),this.selectedStatus="",this.headersForEachRespStatus={},this.mimeResponsesForEachStatus={},this.activeSchemaTab="schema"}static get properties(){return{callback:{type:String},webhook:{type:String},responses:{type:Object},parser:{type:Object},schemaStyle:{type:String,attribute:"schema-style"},renderStyle:{type:String,attribute:"render-style"},selectedStatus:{type:String,attribute:"selected-status"},selectedMimeType:{type:String,attribute:"selected-mime-type"},activeSchemaTab:{type:String,attribute:"active-schema-tab"},schemaExpandLevel:{type:Number,attribute:"schema-expand-level"},schemaDescriptionExpanded:{type:String,attribute:"schema-description-expanded"},allowSchemaDescriptionExpandToggle:{type:String,attribute:"allow-schema-description-expand-toggle"},schemaHideReadOnly:{type:String,attribute:"schema-hide-read-only"},schemaHideWriteOnly:{type:String,attribute:"schema-hide-write-only"}}}static get styles(){return[Ge,Je,Xe,Ze,Ke,v_,c`
      :where(button, input[type="checkbox"], [tabindex="0"]):focus-visible { box-shadow: var(--focus-shadow); }
      :where(input[type="text"], input[type="password"], select, textarea):focus-visible { border-color: var(--primary-color); }
      .resp-head{
        vertical-align: middle;
        padding:16px 0 8px;
      }
      .resp-head.divider{
        border-top: 1px solid var(--border-color);
        margin-top:10px;
      }
      .resp-status{ 
        font-weight:bold;
        font-size:calc(var(--font-size-small) + 1px);
      }
      .resp-descr{
        font-size:calc(var(--font-size-small) + 1px);
        color:var(--light-fg);
        text-align:left;
      }
      .resp-box{
        display: flex;
        flex-direction: row;
        flex: 1 1 auto;
        justify-content: space-between;
        align-items: center;
        padding: 24px;
      }
      .resp-box:hover {
        cursor: pointer;
      }
      .resp-border{
        border: 1px solid #CCCED8;
        border-radius: 4px;
      }
      .resp-modal-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        flex: 1 1 auto;
        height: 45px;
        text-transform: uppercase;
      }
      .resp-modal-content {
        padding: 24px 40px;
        background-color: #FFFFFF;
        width: 80%;
        height: 70%;
        max-width: 720px;
        max-height: 1120px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      .resp-modal-body {
        height: calc(100% - 45px);
        overflow: auto;
        overscroll-behavior: contain;
        scrollbar-width: thin;
        scrollbar-color: white white;
      }
      .resp-modal-body:hover {
        scrollbar-color: #CCCED8 white;
      }
      .resp-modal-body::-webkit-scrollbar {
        display: block;
        width: 6px;
        height: 6px;
        background-color: white;
      }
      .resp-modal-body::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background: white;
      }
      .resp-modal-body:hover::-webkit-scrollbar-thumb {
        background: #CCCED8;
      }
      .resp-modal {
        display: none;
        position: fixed;
        z-index: 10000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.1);
      }
      .resp-modal-bg {
        height: 100vh;
        width: 100vw;
        position: fixed;
        overscroll-behavior: contain;
        overflow: none;
      }
      .top-gap{margin-top:16px;}
      .example-panel{
        font-size:var(--font-size-small);
        margin:0;
      }
      .focused-mode,
      .read-mode {
        margin: 32px 0px;
        display: flex;
        flex-direction: column;
        row-gap: 24px;
      }
      .dot {
        height: 8px;
        width: 8px;
        border-radius: 50%;
        display: inline-block;
      }
      .success {
        background-color: var(--success-color);
      }
      .informational {
        background-color: var(--informational-color);
      }
      .redirection {
        background-color: var(--redirection-color);
      }
      .error {
        background-color: var(--error-color);
      }
      .close-button {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          border: none;
          border-radius: 4px;
          padding: 0px;
          width: 24px;
          height: 24px;
      }
      .close-button:hover {
          cursor: pointer;
          background-color: rgba(0, 0, 0, 0.05);
      }
      `,rt]}render(){return q`
    <div class="col regular-font response-panel ${this.renderStyle}-mode">
      ${this.responseTemplate()}
    </div>
    `}resetSelection(){this.selectedStatus="",this.selectedMimeType=""}getResponseStatusType(e){const t=e.toString();return t.startsWith("1")?"informational":t.startsWith("2")?"success":t.startsWith("3")?"redirection":t.startsWith("4")||t.startsWith("5")?"error":""}responseTemplate(){if(!this.responses)return"";for(const n in this.responses){this.selectedStatus||(this.selectedStatus=n);const o={};for(const r in null===(e=this.responses[n])||void 0===e?void 0:e.content){var e,t;const a=this.responses[n].content[r];this.selectedMimeType||(this.selectedMimeType=r);const i=P_(a.schema,{}),s=__(a.schema,r,a.examples,a.example,"true"!==this.callback&&"true"!==this.webhook,"true"===this.callback||"true"===this.webhook,r.includes("json")?"json":"text");o[r]={description:this.responses[n].description,examples:s,selectedExample:(null===(t=s[0])||void 0===t?void 0:t.exampleId)||"",schemaTree:i}}const a=[];for(const e in null===(r=this.responses[n])||void 0===r?void 0:r.headers){var r;a.push({name:e,...this.responses[n].headers[e]})}this.headersForEachRespStatus[n]=a,this.mimeResponsesForEachStatus[n]=o}return q`
      ${Object.keys(this.responses).length>=1?q`<div class='row' style='flex-wrap:wrap; gap:12px'>
          ${Object.keys(this.responses).map((e=>q`
            ${"$$ref"===e?"":q`
                <div class="resp-box resp-border"
                  @click="${()=>{this.selectedStatus=e,this.responses[e].content&&Object.keys(this.responses[e].content)[0]?this.selectedMimeType=Object.keys(this.responses[e].content)[0]:this.selectedMimeType=void 0,this.renderRoot.getElementById(`resp-modal-${e}`).style.display="block",document.body.style.overflow="hidden"}}"
                >
                  <div style='display: flex; flex-direction: row; justify-content: flex-start; align-items: center;'>
                    <div style="display: flex; justify-content: center; align-items: center; margin-right: 8px">
                      ${function(e){var t,r;const n=null!==(t=null==e?void 0:e.width)&&void 0!==t?t:16,o=null!==(r=null==e?void 0:e.height)&&void 0!==r?r:16;return q`
    <svg width=${n} height=${o} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.9 3C9.9 2.66863 10.1686 2.4 10.5 2.4H13C13.3314 2.4 13.6 2.66863 13.6 3V5.5C13.6 5.83137 13.3314 6.1 13 6.1C12.6686 6.1 12.4 5.83137 12.4 5.5V3.6H10.5C10.1686 3.6 9.9 3.33137 9.9 3Z" fill="#A1A8B3"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M3 9.9C3.33137 9.9 3.6 10.1686 3.6 10.5V12.4H5.5C5.83137 12.4 6.1 12.6686 6.1 13C6.1 13.3314 5.83137 13.6 5.5 13.6H3C2.66863 13.6 2.4 13.3314 2.4 13V10.5C2.4 10.1686 2.66863 9.9 3 9.9Z" fill="#A1A8B3"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M13 9.9C13.3314 9.9 13.6 10.1686 13.6 10.5V13C13.6 13.3314 13.3314 13.6 13 13.6H10.5C10.1686 13.6 9.9 13.3314 9.9 13C9.9 12.6686 10.1686 12.4 10.5 12.4H12.4V10.5C12.4 10.1686 12.6686 9.9 13 9.9Z" fill="#A1A8B3"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.4 3C2.4 2.66863 2.66863 2.4 3 2.4H5.5C5.83137 2.4 6.1 2.66863 6.1 3C6.1 3.33137 5.83137 3.6 5.5 3.6H3.6V5.5C3.6 5.83137 3.33137 6.1 3 6.1C2.66863 6.1 2.4 5.83137 2.4 5.5V3Z" fill="#A1A8B3"/>
    </svg>
  `}()}
                    </div>
                    <div class=" ${"true"===this.callback?"tiny-title":"req-res-title"} " style="margin: 0">
                      ${"true"===this.callback?"Callback Response":"Response"}
                    </div>
                  </div>
                  <div style='display: flex; flex-direction: row; justify-content: flex-end; align-items: center;'>
                    <div style='margin-right: 4px'>
                      <span class='dot ${this.getResponseStatusType(e)}'></span>
                    </div>
                    <div>
                      <span>${e}</span>
                    </div>
                  </div>
                </div>
                `}`))}</div>`:""}
      </div>

      ${Object.keys(this.responses).map((e=>{var t,r;return q`
        <div class="resp-modal" id="resp-modal-${e}">
          <div class="resp-modal-bg"
            @click="${()=>{this.renderRoot.getElementById(`resp-modal-${e}`).style.display="none",document.body.style.overflow="auto"}}"
          ></div>
          <div class="resp-border resp-modal-content">
            <div class="resp-modal-header">
              <div style='display: flex; flex-direction: row; justify-content: flex-start; align-items: center;'>
                <div class=" ${"true"===this.callback?"tiny-title":"req-res-title"} " style="margin: 0">
                  ${"true"===this.callback?"Callback Response":"Response"}
                </div>
              </div>
              <div style='display: flex; flex-direction: row; justify-content: flex-end; align-items: center; column-gap: 4px'>
                <div>
                  <span class='dot ${this.getResponseStatusType(e)}'></span>
                </div>
                <div>
                  <span>${e}</span>
                </div>
                <button class="close-button"
                  @click="${()=>{this.renderRoot.getElementById(`resp-modal-${e}`).style.display="none",document.body.style.overflow="auto"}}"
                >
                  ${z_()}
                </button>
              </div>
            </div>
            <div class="resp-modal-body">
              <div class="top-gap">
                <span class="resp-descr m-markdown ">${KP(He((null===(t=this.responses[e])||void 0===t?void 0:t.description)||""))}</span>
                ${this.headersForEachRespStatus[e]&&(null===(r=this.headersForEachRespStatus[e])||void 0===r?void 0:r.length)>0?q`${this.responseHeaderListTemplate(this.headersForEachRespStatus[e])}`:""}
              </div>
              ${0===Object.keys(this.mimeResponsesForEachStatus[e]).length?"":q`  
                  <div class="tab-panel col">
                    ${1===Object.keys(this.mimeResponsesForEachStatus[e]).length?q`<code style = "font-weight:normal; margin-bottom:8px; width:min-content"> ${Object.keys(this.mimeResponsesForEachStatus[e])[0]} </code>`:q`${this.mimeTypeDropdownTemplate(Object.keys(this.mimeResponsesForEachStatus[e]))}`}                                                      
                    <div class="tab-buttons row" @click="${e=>{"button"===e.target.tagName.toLowerCase()&&(this.activeSchemaTab=e.target.dataset.tab)}}" >
                      <button class="tab-btn ${"example"!==this.activeSchemaTab?"active":""}" data-tab = 'schema' >Parameters</button>
                      <button class="tab-btn ${"example"===this.activeSchemaTab?"active":""}" data-tab = 'example'>Example </button>
                      <div style="flex:1"></div>
                    </div>
                    ${"example"===this.activeSchemaTab?q`<div class ='tab-content col' style = 'flex:1;'>
                          ${this.mimeExampleTemplate(this.mimeResponsesForEachStatus[e][this.selectedMimeType])}
                        </div>`:q`<div class ='tab-content col' style = 'flex:1;'>
                          ${this.mimeSchemaTemplate(this.mimeResponsesForEachStatus[e][this.selectedMimeType])}
                        </div>`}
                  </div>
                `}
            </div>
          </div>
        </div>
      `}))}
    `}responseHeaderListTemplate(e){return q`
      <div style="padding:16px 0 8px 0" class="resp-headers small-font-size bold-text">RESPONSE HEADERS</div> 
      <table role="presentation" style="border-collapse: collapse; margin-bottom:16px; border:1px solid var(--border-color); border-radius: var(--border-radius)" class="small-font-size mono-font">
        ${e.map((e=>{var t,r;return q`
          <tr>
            <td style="padding:8px; vertical-align: baseline; min-width:120px; border-top: 1px solid var(--light-border-color); text-overflow: ellipsis;">
              ${e.name||""}
            </td> 
            <td style="padding:4px; vertical-align: baseline; padding:0 5px; border-top: 1px solid var(--light-border-color); text-overflow: ellipsis;">
              ${(null===(t=e.schema)||void 0===t?void 0:t.type)||""}
            </td> 
            <td style="padding:8px; vertical-align: baseline; border-top: 1px solid var(--light-border-color);text-overflow: ellipsis;">
              <div class="m-markdown-small regular-font" >${KP(He(e.description||""))}</div>
            </td>
            <td style="padding:8px; vertical-align: baseline; border-top: 1px solid var(--light-border-color); text-overflow: ellipsis;">
              ${(null===(r=e.schema)||void 0===r?void 0:r.example)||""}
            </td>
          </tr>
        `}))}
    </table>`}mimeTypeDropdownTemplate(e){return q`
      <select aria-label='mime types' @change="${e=>{this.selectedMimeType=e.target.value}}" style='margin-bottom: -1px; z-index:1'>
        ${e.map((e=>q`<option value='${e}' ?selected = '${e===this.selectedMimeType}'> ${e} </option>`))}
      </select>`}onSelectExample(e){[...e.target.closest(".example-panel").querySelectorAll(".example")].forEach((t=>{t.style.display=t.dataset.example===e.target.value?"block":"none"}))}mimeExampleTemplate(e){return e?q`
      ${1===e.examples.length?q`
          ${"json"===e.examples[0].exampleFormat?q`
              ${e.examples[0].exampleSummary&&e.examples[0].exampleSummary.length>80?q`<div style="padding: 4px 0"> ${e.examples[0].exampleSummary} </div>`:""}
              ${e.examples[0].exampleDescription?q`<div class="m-markdown-small" style="padding: 4px 0"> ${KP(He(e.examples[0].exampleDescription||""))} </div>`:""}
              <json-tree 
                style= 'background: rgb(248, 247, 252); border-radius: 4px; border: 1px solid rgb(231, 233, 238); padding: 16px;'
                render-style = '${this.renderStyle}'
                .data="${e.examples[0].exampleValue}"
                class = 'example-panel ${"read"===this.renderStyle?"border pad-8-16":"pad-top-8"}'
                exportparts = "btn:btn, btn-fill:btn-fill, btn-copy:btn-copy" 
              ></json-tree>`:q`
              ${e.examples[0].exampleSummary&&e.examples[0].exampleSummary.length>80?q`<div style="padding: 4px 0"> ${e.examples[0].exampleSummary} </div>`:""}
              ${e.examples[0].exampleDescription?q`<div class="m-markdown-small" style="padding: 4px 0"> ${KP(He(e.examples[0].exampleDescription||""))} </div>`:""}
              <pre class = 'example-panel ${"read"===this.renderStyle?"border pad-8-16":"pad-top-8"}'>${e.examples[0].exampleValue}</pre>
            `}`:q`
          <span class = 'example-panel ${"read"===this.renderStyle?"border pad-8-16":"border-top pad-top-8"}'>
            <select style="min-width:100px; max-width:100%" aria-label='response examples' style="min-width:100px; max-width:100%" @change='${e=>this.onSelectExample(e)}'>
              ${e.examples.map((t=>q`<option value="${t.exampleId}" ?selected=${t.exampleId===e.selectedExample} > 
                ${t.exampleSummary.length>80?t.exampleId:t.exampleSummary} 
              </option>`))}
            </select>
            ${e.examples.map((t=>q`
              <div class="example" data-example = '${t.exampleId}' style = "display: ${t.exampleId===e.selectedExample?"block":"none"}">
                ${t.exampleSummary&&t.exampleSummary.length>80?q`<div style="padding: 4px 0"> ${t.exampleSummary} </div>`:""}
                ${t.exampleDescription?q`<div class="m-markdown-small"  style="padding: 4px 0"> ${KP(He(t.exampleDescription||""))} </div>`:""}
                ${"json"===t.exampleFormat?q`
                    <json-tree 
                      render-style = '${this.renderStyle}'
                      .data = '${t.exampleValue}'
                      exportparts = "btn:btn, btn-fill:btn-fill, btn-copy:btn-copy" 
                    ></json-tree>`:q`<pre>${t.exampleValue}</pre>`}
              </div>  
            `))}
          </span>  
        `}
    `:q`
        <pre style='color:var(--red)' class = '${"read"===this.renderStyle?"read example-panel border pad-8-16":"example-panel"}'> No example provided </pre>
      `}mimeSchemaTemplate(e){return e?q`
      ${"table"===this.schemaStyle?q`
          <schema-table
            .data = "${e.schemaTree}"
            schema-expand-level = "${this.schemaExpandLevel}"
            schema-description-expanded = "${this.schemaDescriptionExpanded}"
            allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
            schema-hide-read-only = "${this.schemaHideReadOnly}"
            schema-hide-write-only = "${this.schemaHideWriteOnly}"
            exportparts = "schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
          > </schema-table> `:q`
          <schema-tree
            .data = '${e.schemaTree}'
            schema-expand-level = "${this.schemaExpandLevel}"
            schema-description-expanded = "${this.schemaDescriptionExpanded}"
            allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
            schema-hide-read-only = "${this.schemaHideReadOnly}"
            schema-hide-write-only = "${this.schemaHideWriteOnly}"
            exportparts = "schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
          > </schema-tree>`}`:q`
        <pre style='color:var(--red)' class = '${"read"===this.renderStyle?"border pad-8-16":"border-top"}'> Schema not found</pre>
      `}});class J_ extends ae{constructor(e,t){super(),this.id=e,this.content=t,this.copied=!1,this.showButton=!1,this.showToast=!1,this.addEventListener("closed-toast",(()=>{this.showToast=!1}))}reset(){this.copied=!1,this.showButton=!1}willUpdate(e){e.has("id")&&this.reset()}onButtonClick(){navigator.clipboard.writeText(this.content),this.copied=!0}onTextClick(){navigator.clipboard.writeText(this.content),this.showToast=!0}onMouseover(){this.showButton=!0}onMouseLeave(){this.showButton=!1,this.copied=!1}render(){return q`
                <div @mouseover="${this.onMouseover}" @mouseleave="${this.onMouseLeave}" class="content-copy-container">
                    <span @click="${this.onTextClick}" part="label-operation-path">${this.content}</span>
                    <button @click="${this.onButtonClick}" style=${this.showButton?"opacity: 1;":"opacity: 0.2;"}>
                        <div class="svg-container">
                            ${this.copied?F_():D_()}
                        </div>
                    </button>
                </div>
                ${this.showToast?q`<toast-component tone="positive" message="Copied to clipboard"></toast-component>`:""}
        `}static get styles(){return[c`
            .svg-container {
                display: flex;
                flex-direction: row;
                justify-content: flex-end;
                align-items: flex-start;
                padding: 0px 8px 0px 0px;
                gap: 10px;
                width: 57px;
                height: 20px;
                background: linear-gradient(270deg, #FFFFFF 51.22%, rgba(255, 255, 255, 0) 104.88%);
            }

            span {
                flex: 1 0 auto;
                padding: 4px 8px;
            }

            span:hover {
                cursor: pointer;
            }

            button {
                background: none;
                color: inherit;
                border: none;
                padding: 0;
                cursor: pointer;
                outline: inherit;
                right: 0;
                display: block;
                position: -webkit-sticky;
                position: sticky;
            }

            .copy-container {
                width: inherit;
                height: inherit;
                opacity: 0;
                filter: alpha(opacity = 0);
                position: absolute;
                top:0; bottom:0; left:0; right:0;
                display: block;
                z-index: 2;
                background: transparent;
            }

            .content-copy-container {
                width: inherit;
                height: inherit;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                display: flex;
                flex-wrap: nowrap;
                font-size: 14px;
                white-space: nowrap;
                overflow-y: hidden;
                overflow-x: auto;
                align-items: center;
            }

            .content-copy-container::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }

            .content-copy-container::-webkit-scrollbar-track {
                background:var(--input-bg);
            }
            
            .content-copy-container::-webkit-scrollbar-thumb {
                border-radius: 2px;
                background-color: var(--border-color);
            }
          `]}}function Z_(e,t,r,n,o){var a;let i="";t&&(i+=`${He(t)}\n\n`);try{const e=JSON.parse(decodeURIComponent(n));switch(r){case"code":i+=He(e.codes.reduce(((e,t)=>{switch(t.language){case"jsonc":t.language="json";break;case"curl":t.language="curl"}return`${e}\n\`\`\`${t.language}\n${decodeURIComponent(t.code)}\n\`\`\`\n`}),""));break;case"html":case"embed":i+=`\n\n${e.html}\n\n`;break;case"image":i+=e.images.reduce(((e,t)=>`${e}\n\n<img src="${t.image[0]}" alt="${t.image[1]}" style="width:50%;" />`),"");break;case"api-header":i+=He(`## ${e.title}`);break;case"callout":i+=`<blockquote class=${e.type}><h3>${null!==(a=e.title)&&void 0!==a?a:""}</h3>${He(e.body)}</blockquote>`;break;case"parameters":{const{rows:t,cols:r}=e;let n="\n\n";for(let t=0;t<r;t++)e.data[`h-${t}`]?n+=`| ${e.data[`h-${t}`]}`:n+="|";n+="|\n";for(let e=0;e<r;e++)n+="| :---";for(let o=0;o<t;o++){n+="|\n";for(let t=0;t<r;t++)e.data[`${o}-${t}`]?n+=`| ${e.data[`${o}-${t}`].replace(/\n/gm,"<br />")}`:n+="|"}n+="|\n",i+=He(n)}break;default:i+=""}o&&(i+=He(o))}catch(e){i+=`\n\n<blockquote class="warning"><h3>Work in progress</h3>[block:${r}]${n}[/block]</blockquote>\n\n`,o&&(i+=He(o))}return i}function Y_(e){return e.replace(/(?<TextBefore>[^[\]]*)\[block:(?<Type>[^\]]*)\](?<Content>.+?)\[\/block\](?<TextAfter>[^[\]]*)/gms,Z_)}function Q_(e){const t=new He.Renderer;return t.heading=(t,r,n,o)=>`<h${r} class="observe-me" id="${e}--${o.slug(n)}">${t}</h${r}>`,t}function X_(e,t=""){var r,n,o;const a=new Set;for(const t in e.responses)for(const r in null===(i=e.responses[t])||void 0===i?void 0:i.content){var i;a.add(r.trim())}const s=[...a].join(", "),l=this.resolvedSpec.securitySchemes.filter((t=>{var r;return t.finalKeyValue&&(null===(r=e.security)||void 0===r?void 0:r.some((e=>t.securitySchemeId in e)))}))||[],c=this.resolvedSpec.securitySchemes.find((e=>e.securitySchemeId===ot&&"-"!==e.value));c&&l.push(c);const p=e.xCodeSamples?u_.call(this,e.xCodeSamples):"";return e.description=Y_(e.description),q`
    ${"read"===this.renderStyle?q`<div class='divider' part="operation-divider"></div>`:""}
    <div class='expanded-endpoint-body observe-me ${e.method} ${e.deprecated?"deprecated":""} ' part="section-operation ${e.elementId}">
    <span part="anchor-endpoint" id='${e.elementId}'></span>
      ${"focused"===this.renderStyle&&"General ⦂"!==t?q`<h3 class="operation-tag" style="font-weight:bold" part="section-operation-tag"> ${t} </h3>`:""}
      ${e.deprecated?q`<div class="bold-text red-text"> DEPRECATED </div>`:""}
      ${q`
        ${e.xBadges&&(null===(r=e.xBadges)||void 0===r?void 0:r.length)>0?q`
            <div style="display:flex; flex-wrap:wrap; margin-bottom: -24px; font-size: var(--font-size-small);">
              ${e.xBadges.map((e=>q`<span style="margin:1px; margin-right:5px; padding:1px 8px; font-weight:bold; border-radius:12px;  background-color: var(--light-${e.color}, var(--input-bg)); color:var(--${e.color}); border:1px solid var(--${e.color})">${e.label}</span>`))}
            </div>
            `:""}
        <h2 part="section-operation-summary"> ${e.shortSummary||`${e.method.toUpperCase()} ${e.path}`}</h2>
        ${e.isWebhook?q`<span part="section-operation-webhook" style="color:var(--primary-color); font-weight:bold; font-size: var(--font-size-regular);"> WEBHOOK </span>`:q`
            <div class='mono-font regular-font-size label-operation-container' part="section-operation-webhook-method">
              <div class='label-operation-method-container' style='border-color: var(--${e.method}-border-color); background-color: var(--${e.method}-bg-color);'>
                <span part="label-operation-method" class='regular-font upper method-fg bold-text ${e.method}'>${e.method}</span>
              </div>
              <div class='label-operation-path-container'>
                <content-copy-button id='${e.method}${e.path}' content='${e.path}'></content-copy-button>
              </div>
            </div>
          `}
        <slot name="${e.elementId}"></slot>`}
      ${e.description?q`<div class="m-markdown"> ${KP(He(e.description))}</div>`:""}
      <!-- ${d_.call(this,e.security)} -->
      ${p}
      <div class='expanded-req-resp-container'>
        <api-request
          class = "${this.renderStyle}-mode"
          style = "width:100%;"
          schema-short-summary = "${e.shortSummary}"
          webhook = "${e.isWebhook}"
          method = "${e.method}"
          path = "${e.path}"
          .security = "${e.security}"
          .parameters = "${e.parameters}"
          .request_body = "${e.requestBody}"
          .api_keys = "${l}"
          .servers = "${e.servers}"
          .resolvedSpec="${this.resolvedSpec}"
          .selectedServer="${this.selectedServer}"
          server-url = "${(null===(n=e.servers)||void 0===n||null===(o=n[0])||void 0===o?void 0:o.url)||this.selectedServer.computedUrl}"
          fill-request-fields-with-example = "${this.fillRequestFieldsWithExample}"
          allow-try = "${this.allowTry}"
          show-curl-before-try = "${this.showCurlBeforeTry}"
          accept = "${s}"
          render-style="${this.renderStyle}" 
          schema-style = "${this.schemaStyle}"
          active-schema-tab = "${this.defaultSchemaTab}"
          schema-expand-level = "${this.schemaExpandLevel}"
          schema-description-expanded = "${this.schemaDescriptionExpanded}"
          allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
          schema-hide-read-only = "${"never"===this.schemaHideReadOnly||e.isWebhook?"false":"true"}"
          schema-hide-write-only = "${"never"===this.schemaHideWriteOnly?"false":e.isWebhook?"true":"false"}"
          fetch-credentials = "${this.fetchCredentials}"
          exportparts = "wrap-request-btn:wrap-request-btn, btn:btn, btn-fill:btn-fill, btn-outline:btn-outline, btn-try:btn-try, btn-clear:btn-clear, btn-clear-resp:btn-clear-resp,
            file-input:file-input, textbox:textbox, textbox-param:textbox-param, textarea:textarea, textarea-param:textarea-param, 
            anchor:anchor, anchor-param-example:anchor-param-example, schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
        > </api-request>

        ${e.callbacks?h_.call(this,e.callbacks):""}

        <api-response
          class = "${this.renderStyle}-mode"
          style = "width:100%;"
          webhook = "${e.isWebhook}"
          .responses = "${e.responses}"
          render-style = "${this.renderStyle}"
          schema-style = "${this.schemaStyle}"
          active-schema-tab = "${this.defaultSchemaTab}"
          schema-expand-level = "${this.schemaExpandLevel}"
          schema-description-expanded = "${this.schemaDescriptionExpanded}"
          allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
          schema-hide-read-only = "${"never"===this.schemaHideReadOnly?"false":e.isWebhook?"true":"false"}"
          schema-hide-write-only = "${"never"===this.schemaHideWriteOnly||e.isWebhook?"false":"true"}"
          selected-status = "${Object.keys(e.responses||{})[0]||""}"
          exportparts = "btn:btn, btn-response-status:btn-response-status, btn-selected-response-status:btn-selected-response-status, btn-fill:btn-fill, btn-copy:btn-copy,
          schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
        > </api-response>
      </div>
    </div>
  `}function eR(){return this.resolvedSpec?q`
  ${this.resolvedSpec.tags.map((e=>q`
    <section id="${e.elementId}" part="section-tag" class="regular-font section-gap--read-mode observe-me" style="border-top:1px solid var(--primary-color);">
      <div class="title tag" part="section-tag-title label-tag-title">${e.name}</div>
      <slot name="${e.elementId}"></slot>
      <div class="regular-font-size">
      ${KP(`\n          <div class="m-markdown regular-font">\n          ${He(e.description||"","true"===this.infoDescriptionHeadingsInNavBar?{renderer:Q_(e.elementId)}:void 0)}\n        </div>`)}
      </div>
    </section>
    <section class="regular-font section-gap--read-mode" part="section-operations-in-tag">
      ${e.paths.map((e=>X_.call(this,e)))}
    </section>
    `))}
`:""}function tR(e){return q`
  <div class='divider'></div>
  <div class='expanded-endpoint-body observe-me ${e.name}' id='cmp--${e.id}' >
    <div style="font-weight:bold"> ${e.name} <span style="color:var(--light-fg); font-size:var(--font-size-small); font-weight:400;"> Schema </span></div>
  ${"table"===this.schemaStyle?q`
      <schema-table
        .data = '${P_(e.component,{})}'
        schema-expand-level = "${this.schemaExpandLevel}"
        schema-description-expanded = "${this.schemaDescriptionExpanded}"
        allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
        schema-hide-read-only = "false"
        schema-hide-write-only = "${this.schemaHideWriteOnly}"
        exportparts = "schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
      > </schema-table>`:q`
      <schema-tree
        .data = '${P_(e.component,{})}'
        schema-expand-level = "${this.schemaExpandLevel}"
        schema-description-expanded = "${this.schemaDescriptionExpanded}"
        allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
        schema-hide-read-only = "false"
        schema-hide-write-only = "${this.schemaHideWriteOnly}"
        exportparts = "schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
      > </schema-tree>`}
  </div>`}function rR(e,t){return-1!==e.id.indexOf("schemas-")?tR.call(this,e):q`
  <div class='divider'></div>
  <div class='expanded-endpoint-body observe-me ${e.name}' id='cmp--${e.id}' >
    ${q`
      <div style="font-weight:bold"> ${e.name} <span style="color:var(--light-fg); font-size:var(--font-size-small); font-weight:400"> ${t} </span> </div>
      ${e.component?q`
      <div class='mono-font regular-font-size' style='padding: 8px 0; color:var(--fg2)'> 
        <json-tree class="border tree" render-style='${this.renderStyle}' .data="${e.component}"> </json-tree>
      </div>`:""}
    `}
  </div>
  `}function nR(){return this.resolvedSpec?q`
  ${this.resolvedSpec.components.map((e=>q`
    <div id="cmp--${e.name.toLowerCase()}" class='regular-font section-gap--read-mode observe-me' style="border-top:1px solid var(--primary-color);">
      <div class="title tag">${e.name}</div>
      <div class="regular-font-size">
        ${KP(`<div class='m-markdown regular-font'>${He(e.description?e.description:"")}</div>`)}
      </div>
    </div>
    <div class='regular-font section-gap--read-mode'>
      ${e.subComponents.filter((e=>!1!==e.expanded)).map((t=>rR.call(this,t,e.name)))}
    </div>
    `))}
`:""}function oR(){const e=new He.Renderer;return e.heading=(e,t,r,n)=>`<h${t} class="observe-me" id="overview--${n.slug(r)}">${e}</h${t}>`,e}function aR(){var e,t,r,n;return this.resolvedSpec.info.description=Y_(this.resolvedSpec.info.description),q`
    <section part="section-overview" class="observe-me ${"view"===this.renderStyle?"section-gap":"section-gap--read-mode"}">
      <span part="anchor-endpoint" id="overview"></span>
      ${null!==(e=this.resolvedSpec)&&void 0!==e&&e.info?q`
          <div id="api-title" part="section-overview-title" style="font-size:32px">
            ${this.resolvedSpec.info.title}
            ${this.resolvedSpec.info.version?q`
              <code>
                ${this.resolvedSpec.info.version}
              </code>`:""}
          </div>
          <div id="api-info" style="font-size:calc(var(--font-size-regular) - 1px); margin-top:8px;">
            ${null!==(t=this.resolvedSpec.info.contact)&&void 0!==t&&t.email?q`<span>${this.resolvedSpec.info.contact.name||"Email"}: 
                <a href="mailto:${this.resolvedSpec.info.contact.email}" part="anchor anchor-overview">${this.resolvedSpec.info.contact.email}</a>
              </span>`:""}
            ${null!==(r=this.resolvedSpec.info.contact)&&void 0!==r&&r.url?q`<span>URL: <a href="${this.resolvedSpec.info.contact.url}" part="anchor anchor-overview">${this.resolvedSpec.info.contact.url}</a></span>`:""}
            ${this.resolvedSpec.info.license?q`<span>License: 
                ${this.resolvedSpec.info.license.url?q`<a href="${this.resolvedSpec.info.license.url}" part="anchor anchor-overview">${this.resolvedSpec.info.license.name}</a>`:this.resolvedSpec.info.license.name} </span>`:""}
            ${this.resolvedSpec.info.termsOfService?q`<span><a href="${this.resolvedSpec.info.termsOfService}" part="anchor anchor-overview">Terms of Service</a></span>`:""}
            ${this.specUrl&&"true"===this.allowSpecFileDownload?q`
                <div style="display:flex; margin:12px 0; gap:8px; justify-content: start;">
                  <button class="m-btn thin-border" style="min-width:170px" part="btn btn-outline" @click='${e=>{ct(this.specUrl,"openapi-spec")}}'>Download OpenAPI spec</button>
                  ${null!==(n=this.specUrl)&&void 0!==n&&n.trim().toLowerCase().endsWith("json")?q`<button class="m-btn thin-border" style="width:200px" part="btn btn-outline" @click='${e=>{pt(this.specUrl)}}'>View OpenAPI spec (New Tab)</button>`:""}
                </div>`:""}
          </div>
          <slot name="overview"></slot>
          <div id="api-description">
          ${this.resolvedSpec.info.description?q`${KP(`\n                <div class="m-markdown regular-font">\n                ${He(this.resolvedSpec.info.description,"true"===this.infoDescriptionHeadingsInNavBar?{renderer:oR()}:void 0)}\n              </div>`)}`:""}
          </div>
        `:""}
    </section>
  `}function iR(e,t="toggle"){const r=null==e?void 0:e.closest(".nav-bar-tag-and-paths"),n=null==r?void 0:r.querySelector(".nav-bar-paths-under-tag");if(r){const e=r.classList.contains("expanded");!e||"toggle"!==t&&"collapse"!==t?e||"toggle"!==t&&"expand"!==t||(r.classList.replace("collapsed","expanded"),n.style.maxHeight=`${n.scrollHeight}px`):(n.style.maxHeight=0,r.classList.replace("expanded","collapsed"))}}function sR(e){var t,r,n,o;if("click"!==e.type&&("keyup"!==e.type||13!==e.keyCode))return;const a=e.target;e.stopPropagation(),"navigate"===(null===(t=a.dataset)||void 0===t?void 0:t.action)?this.scrollToEventTarget(e,!1):"expand-all"===(null===(r=a.dataset)||void 0===r?void 0:r.action)||"collapse-all"===(null===(n=a.dataset)||void 0===n?void 0:n.action)?function(e,t="expand-all"){if("click"!==e.type&&("keyup"!==e.type||13!==e.keyCode))return;const r=[...e.target.closest(".nav-scroll").querySelectorAll(".nav-bar-tag-and-paths")];"expand-all"===t?r.forEach((e=>{const t=e.querySelector(".nav-bar-paths-under-tag");e.classList.replace("collapsed","expanded"),t.style.maxHeight=`${null==t?void 0:t.scrollHeight}px`})):r.forEach((e=>{e.classList.replace("expanded","collapsed"),e.querySelector(".nav-bar-paths-under-tag").style.maxHeight=0}))}(e,a.dataset.action):"expand-collapse-tag"===(null===(o=a.dataset)||void 0===o?void 0:o.action)&&iR(a,"toggle")}function lR(){var e,t,r,n;return!this.resolvedSpec||this.resolvedSpec.specLoadError?q`
      <nav class='nav-bar' part='section-navbar'>
        <slot name='nav-logo' class='logo'></slot>
      </nav>
    `:q`
  <nav class='nav-bar ${this.renderStyle}' part='section-navbar'>
    <slot name='nav-logo' class='logo'></slot>
    ${"false"===this.allowSearch&&"false"===this.allowAdvancedSearch?"":q`
        <div style='display:flex; flex-direction:row; justify-content:center; align-items:stretch; padding:8px 24px 12px 24px; ${"false"===this.allowAdvancedSearch?"border-bottom: 1px solid var(--nav-hover-bg-color)":""}' part='section-navbar-search'>
          ${"false"===this.allowSearch?"":q`
              <div style = 'display:flex; flex:1; line-height:22px;'>
                <input id = 'nav-bar-search' 
                  part = 'textbox textbox-nav-filter'
                  style = 'width:100%; padding-right:20px; color:var(--nav-hover-text-color); border-color:var(--nav-accent-color); background-color:var(--nav-hover-bg-color)'
                  type = 'text'
                  placeholder = 'Filter' 
                  @change = '${this.onSearchChange}'
                  spellcheck = 'false'
                >
                <div style='margin: 6px 5px 0 -24px; font-size:var(--font-size-regular); cursor:pointer;'>&#x21a9;</div>
              </div>  
              ${this.matchPaths?q`
                  <button @click = '${this.onClearSearch}' class='m-btn thin-border' style='margin-left:5px; color:var(--nav-text-color); width:75px; padding:6px 8px;' part='btn btn-outline btn-clear-filter'>
                    CLEAR
                  </button>`:""}
            `}
          ${"false"===this.allowAdvancedSearch||this.matchPaths?"":q`
              <button class='m-btn primary' part='btn btn-fill btn-search' style='margin-left:5px; padding:6px 8px; width:75px' @click='${this.onShowSearchModalClicked}'>
                SEARCH
              </button>
            `}
        </div>
      `}
    ${q`<nav class='nav-scroll' tabindex='-1' part='section-navbar-scroll' @click='${e=>sR.call(this,e)}' @keyup='${e=>sR.call(this,e)}' >
      ${"false"!==this.showInfo&&this.resolvedSpec.info?q`
          ${"true"===this.infoDescriptionHeadingsInNavBar?q`
              ${this.resolvedSpec.infoDescriptionHeaders.length>0?q`<div class='nav-bar-info ${this.navActiveItemMarker}' id='link-overview' data-content-id='overview' data-action='navigate' tabindex='0' part='section-navbar-item section-navbar-overview'> 
                    ${(null===(e=this.resolvedSpec.info)||void 0===e||null===(t=e.title)||void 0===t?void 0:t.trim())||"Overview"}
                  </div>`:""}
              <div class='overview-headers'>
                ${this.resolvedSpec.infoDescriptionHeaders.map((e=>q`
                  <div
                    class='nav-bar-h${e.depth} ${this.navActiveItemMarker}' 
                    id='link-overview--${(new He.Slugger).slug(e.text)}'
                    data-action='navigate' 
                    data-content-id='overview--${(new He.Slugger).slug(e.text)}' 
                  >
                    ${e.text}
                  </div>`))}
              </div>
              ${this.resolvedSpec.infoDescriptionHeaders.length>0?q`<hr style='border-top: 1px solid var(--nav-hover-bg-color); border-width:1px 0 0 0; margin: 15px 0 0 0'/>`:""}
            `:q`<div class='nav-bar-info ${this.navActiveItemMarker}' id='link-overview' data-action='navigate' data-content-id='overview' tabindex='0'> 
              ${(null===(r=this.resolvedSpec.info)||void 0===r||null===(n=r.title)||void 0===n?void 0:n.trim())||"Overview"}
            </div>`}
        `:""}
    
      ${"false"===this.allowServerSelection?"":q`<div class='nav-bar-info ${this.navActiveItemMarker}' id='link-servers' data-action='navigate' data-content-id='servers' tabindex='0' part='section-navbar-item section-navbar-servers'> API Servers </div>`}
      ${"false"!==this.allowAuthentication&&this.resolvedSpec.securitySchemes?q`<div class='nav-bar-info ${this.navActiveItemMarker}' id='link-auth' data-action='navigate' data-content-id='auth' tabindex='0' part='section-navbar-item section-navbar-auth'> Authentication </div>`:""}

      <div id='link-operations-top' class='nav-bar-section operations' data-action='navigate' data-content-id='${"focused"===this.renderStyle?"":"operations-top"}' part='section-navbar-item section-navbar-operations-top'>
        <div style='font-size:16px; display:flex; margin-left:10px;'>
          ${"focused"===this.renderStyle?q`
              <div class='nav-bar-expand-all'
                data-action='expand-all'
                tabindex='0' 
                title='Expand all'
              >▸</div>
              <div class='nav-bar-collapse-all'
                data-action='collapse-all'
                tabindex='0' 
                title='Collapse all'
              >▸</div>`:""}  
        </div>
        <div class='nav-bar-section-title'> OPERATIONS </div>
      </div>

      <!-- TAGS AND PATHS-->
      ${this.resolvedSpec.tags.filter((e=>e.paths.filter((e=>st(this.matchPaths,e,this.matchType))).length)).map((e=>{var t;return q`
          <div class='nav-bar-tag-and-paths ${"read"===this.renderStyle||e.expanded?"expanded":"collapsed"}' >
            ${"General ⦂"===e.name?q`<hr style='border:none; border-top: 1px dotted var(--nav-text-color); opacity:0.3; margin:-1px 0 0 0;'/>`:q`
                <div 
                  class='nav-bar-tag ${this.navActiveItemMarker}'
                  part='section-navbar-item section-navbar-tag'
                  id='link-${e.elementId}'
                  data-action='${"read"===this.renderStyle||"show-description"===this.onNavTagClick?"navigate":"expand-collapse-tag"}'
                  data-content-id='${("read"===this.renderStyle?`${e.elementId}`:"show-description"===this.onNavTagClick)?`${e.elementId}`:""}'
                  data-first-path-id='${e.firstPathId}'
                  tabindex='0'
                >
                  <div style="pointer-events:none;">${e.name}</div>
                  <div class='nav-bar-tag-icon' tabindex='0' data-action='expand-collapse-tag'></div>
                </div>
              `}
            ${"true"===this.infoDescriptionHeadingsInNavBar?q`
                ${"focused"===this.renderStyle&&"expand-collapse"===this.onNavTagClick?"":q`
                    <div class='tag-headers'>
                      ${e.headers.map((t=>q`
                      <div
                        class='nav-bar-h${t.depth} ${this.navActiveItemMarker}'
                        part='section-navbar-item section-navbar-h${t.depth}'
                        id='link-${e.elementId}--${(new He.Slugger).slug(t.text)}'
                        data-action='navigate'
                        data-content-id='${e.elementId}--${(new He.Slugger).slug(t.text)}'
                        tabindex='0'
                      > ${t.text}</div>`))}
                    </div>`}`:""}
            <div class='nav-bar-paths-under-tag' style='max-height:${e.expanded||"read"===this.renderStyle?50*((null===(t=e.paths)||void 0===t?void 0:t.length)||1):0}px;'>
              <!-- Paths in each tag (endpoints) -->
              ${e.paths.filter((e=>!this.matchPaths||st(this.matchPaths,e,this.matchType))).map((e=>q`
              <div 
                class='nav-bar-path ${this.navActiveItemMarker} ${"true"===this.usePathInNavBar?"small-font":""}'
                part='section-navbar-item section-navbar-path'
                data-action='navigate'
                data-content-id='${e.elementId}'
                id='link-${e.elementId}'
                tabindex='0'
              >
                <span style = 'display:flex; pointer-events: none; align-items:start; ${e.deprecated?"filter:opacity(0.5)":""}'>
                  ${q`<span class='nav-method ${this.showMethodInNavBar} ${e.method}' style='pointer-events: none;'>
                      ${"as-colored-block"===this.showMethodInNavBar?e.method.substring(0,3).toUpperCase():e.method.toUpperCase()}
                    </span>`}
                  ${e.isWebhook?q`<span style='font-weight:bold; pointer-events: none; margin-right:8px; font-size: calc(var(--font-size-small) - 2px)'>WEBHOOK</span>`:""}
                  ${"true"===this.usePathInNavBar?q`<span style='pointer-events: none;' class='mono-font'>${e.path}</span>`:e.summary||e.shortSummary}
                </span>
              </div>`))}
            </div>
          </div>
        `}))}

      <!-- COMPONENTS -->
      ${this.resolvedSpec.components&&"true"===this.showComponents&&"focused"===this.renderStyle?q`
          <div id='link-components' class='nav-bar-section components'>
            <div></div>
            <div class='nav-bar-section-title'>COMPONENTS</div>
          </div>
          ${this.resolvedSpec.components.map((e=>e.subComponents.length?q`
              <div class='nav-bar-tag'
                part='section-navbar-item section-navbar-tag'
                data-action='navigate' 
                data-content-id='cmp--${e.name.toLowerCase()}' 
                id='link-cmp--${e.name.toLowerCase()}'
              >
                ${e.name}
              </div>
              ${e.subComponents.filter((e=>!1!==e.expanded)).map((e=>q`
                <div class='nav-bar-path' data-action='navigate' data-content-id='cmp--${e.id}' id='link-cmp--${e.id}'>
                  <span> ${e.name} </span>
                </div>`))}`:""))}`:""}
    </nav>`}
</nav>
`}function cR(e){const t=new He.Renderer;return t.heading=(t,r,n,o)=>`<h${r} class="observe-me" id="${e}--${o.slug(n)}">${t}</h${r}>`,t}function pR(e){return q`
    <div class='regular-font section-gap--focused-mode' part="section-operations-in-tag">
      ${e}
    </div>`}function dR(){var e;if("true"===this.showInfo)return pR(aR.call(this));const t=this.resolvedSpec.tags[0],r=null===(e=this.resolvedSpec.tags[0])||void 0===e?void 0:e.paths[0];return pR(t&&r?X_.call(this,r,t.name):"")}function uR(e){return q`
    <h1 id="${e.elementId}">${e.name}</h1>
    ${"show-description"===this.onNavTagClick&&e.description?q`
        <div class="m-markdown">
          ${KP(`\n            <div class="m-markdown regular-font">\n              ${He(e.description||"","true"===this.infoDescriptionHeadingsInNavBar?{renderer:cR(e.elementId)}:void 0)}\n            </div>`)}
        </div>`:""}
  `}function hR(){if(!this.focusedElementId||!this.resolvedSpec)return;const e=this.focusedElementId;let t,r=null,n=null,o=0;if(e.startsWith("overview")&&"true"===this.showInfo)t=aR.call(this);else if("auth"===e&&"true"===this.allowAuthentication)t=p_.call(this);else if("servers"===e&&"true"===this.allowServerSelection)t=K_.call(this);else if("operations-top"===e)t=q`
    <div id="operations-top" class="observe-me">
      <slot name="operations-top"></slot>
    </div>`;else if(e.startsWith("cmp--")&&"true"===this.showComponents)t=nR.call(this);else if(e.startsWith("tag--")){const r=e.indexOf("--",4)>0?e.substring(0,e.indexOf("--",5)):e;n=this.resolvedSpec.tags.find((e=>e.elementId===r)),t=n?pR.call(this,uR.call(this,n)):dR.call(this)}else{for(o=0;o<this.resolvedSpec.tags.length&&(n=this.resolvedSpec.tags[o],r=this.resolvedSpec.tags[o].paths.find((t=>`${t.elementId}`===e)),!r);o+=1);if(r){iR(this.shadowRoot.getElementById(`link-${e}`),"expand"),t=pR.call(this,X_.call(this,r,n.name||"",n.description||""))}else t=dR.call(this)}return t}function fR(e){if(e.expanded)e.expanded=!1,"true"===this.updateRoute&&this.replaceHistoryState("");else if(e.expanded=!0,"true"===this.updateRoute){const t=`${this.routePrefix||"#"}${e.elementId}`;window.location.hash!==t&&this.replaceHistoryState(e.elementId)}this.requestUpdate()}function mR(e,t="expand-all"){const r=[...e.querySelectorAll(".section-tag")];"expand-all"===t?r.map((e=>{e.classList.replace("collapsed","expanded")})):r.map((e=>{e.classList.replace("expanded","collapsed")}))}function gR(e,t="expand-all"){mR.call(this,e.target.closest(".operations-root"),t)}function yR(e,t=!1){return q`
  <summary @click="${t=>{fR.call(this,e,t)}}" part="section-endpoint-head-${e.expanded?"expanded":"collapsed"}" class='endpoint-head ${e.method} ${e.deprecated?"deprecated":""} ${t||e.expanded?"expanded":"collapsed"}'>
    <div part="section-endpoint-head-method" class="method ${e.method} ${e.deprecated?"deprecated":""}"> ${e.method} </div> 
    <div  part="section-endpoint-head-path" class="path ${e.deprecated?"deprecated":""}"> 
      ${e.path} 
      ${e.isWebhook?q`<span style="font-family: var(--font-regular); font-size: var(--); font-size: var(--font-size-small); color:var(--primary-color); margin-left: 16px"> Webhook</span>`:""}
    </div>
    ${e.deprecated?q`
        <span style="font-size:var(--font-size-small); text-transform:uppercase; font-weight:bold; color:var(--red); margin:2px 0 0 5px;"> 
          deprecated 
        </span>`:""}
    ${this.showSummaryWhenCollapsed?q`
        <div class="only-large-screen" style="min-width:60px; flex:1"></div>
        <div part="section-endpoint-head-description" class="descr">${e.summary||e.shortSummary} </div>`:""}
  </summary>
  `}function vR(e){var t;const r=new Set;for(const t in e.responses)for(const o in null===(n=e.responses[t])||void 0===n?void 0:n.content){var n;r.add(o.trim())}const o=[...r].join(", "),a=this.resolvedSpec.securitySchemes.filter((t=>{var r;return t.finalKeyValue&&(null===(r=e.security)||void 0===r?void 0:r.some((e=>t.securitySchemeId in e)))}))||[],i=this.resolvedSpec.securitySchemes.find((e=>e.securitySchemeId===ot&&"-"!==e.value));i&&a.push(i);const s=e.xCodeSamples?u_(e.xCodeSamples):"";return e.description=Y_(e.description),q`
  <style>
      .label-operation-container {
        text-align: left;
        direction: ltr;
        color: var(--fg3);
        display: flex;
        width: 100%;
        overflow: hidden;
        margin-bottom: 24px;
      }

      .label-operation-path-container {
        display: inline-flex;
        flex-direction: row;
        flex-grow: 1;
        justify-content: space-between;
        align-items: stretch;
        width: auto;
        height: 28px;
        left: 0;
        top: 0;
        border: 1px solid var(--border-color);
        border-radius: 0px 4px 4px 0px;
        flex-wrap: nowrap;
        overflow-x: auto;
        position: relative;
        scrollbar-color: transparent transparent;
      }

      .label-operation-path-container::-webkit-scrollbar {
        display: none;
      }

      .label-operation-path-item {
        flex: 0 0 auto;
      }

      .label-operation-method-container {
        display: inline-flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 4px 8px;
        width: auto;
        height: 28px;
        left: 0;
        top: 0;
        border-width: 1px 0px 1px 1px;
        border-style: solid;
        border-radius: 4px 0px 0px 4px;
      }
  </style>
  <div part="section-endpoint-body-${e.expanded?"expanded":"collapsed"}" class='endpoint-body ${e.method} ${e.deprecated?"deprecated":""}'>
    <div class="summary">
      ${e.summary?q`<div class="title" part="section-endpoint-body-title">${e.summary}</div>`:e.shortSummary!==e.description?q`<div class="title" part="section-endpoint-body-title">${e.shortSummary}</div>`:""}
      ${e.xBadges&&(null===(t=e.xBadges)||void 0===t?void 0:t.length)>0?q`
          <div style="display:flex; flex-wrap:wrap;font-size: var(--font-size-small);">
            ${e.xBadges.map((e=>q`<span part="endpoint-badge" style="margin:1px; margin-right:5px; padding:1px 8px; font-weight:bold; border-radius:12px;  background-color: var(--light-${e.color}, var(--input-bg)); color:var(--${e.color}); border:1px solid var(--${e.color})">${e.label}</span>`))}
          </div>
          `:""}
      <div class='mono-font regular-font-size label-operation-container'>
        <div class='label-operation-method-container' style='border-color: var(--${e.method}-border-color); background-color: var(--${e.method}-bg-color);'>
          <span class='regular-font upper method-fg bold-text ${e.method}'>${e.method}</span>
        </div>
        <div class='label-operation-path-container'>
          <content-copy-button id='${e.method}${e.path}' content='${e.path}'></content-copy-button>
        </div>
      </div>
      ${e.description?q`<div part="section-endpoint-body-description" class="path-description"> ${KP(e.description)}</div>`:""}
      <slot name="${e.elementId}"></slot>
      ${d_.call(this,e.security)}
      ${s}
    </div>  
    <div class='req-resp-container'> 
      <div style="display:flex; flex-direction:column" class="view-mode-request ${this.layout}-layout">
        <api-request
          class = "${this.renderStyle}-mode ${this.layout}-layout"
          style = "width:100%;"
          schema-short-summary="${e.shortSummary}"
          webhook = "${e.isWebhook}"
          method = "${e.method}"
          path = "${e.path}"
          .security = "${e.security}"
          .parameters = "${e.parameters}"
          .request_body = "${e.requestBody}"
          .api_keys = "${a}"
          .servers = "${e.servers}" 
          .resolvedSpec="${this.resolvedSpec}"
          .selectedServer="${this.selectedServer}"
          server-url = "${e.servers&&e.servers.length>0?e.servers[0].url:this.selectedServer.computedUrl}" 
          active-schema-tab = "${this.defaultSchemaTab}"
          fill-request-fields-with-example = "${this.fillRequestFieldsWithExample}"
          allow-try = "${this.allowTry}"
          show-curl-before-try = "${this.showCurlBeforeTry}"
          accept = "${o}"
          render-style="${this.renderStyle}" 
          schema-style = "${this.schemaStyle}" 
          schema-expand-level = "${this.schemaExpandLevel}"
          schema-description-expanded = "${this.schemaDescriptionExpanded}"
          allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
          schema-hide-read-only = "${"never"===this.schemaHideReadOnly||e.isWebhook?"false":"true"}"
          schema-hide-write-only = "${"never"===this.schemaHideWriteOnly?"false":e.isWebhook?"true":"false"}"
          fetch-credentials = "${this.fetchCredentials}"
          exportparts = "wrap-request-btn:wrap-request-btn, btn:btn, btn-fill:btn-fill, btn-outline:btn-outline, btn-try:btn-try, btn-clear:btn-clear, btn-clear-resp:btn-clear-resp,
            file-input:file-input, textbox:textbox, textbox-param:textbox-param, textarea:textarea, textarea-param:textarea-param, 
            anchor:anchor, anchor-param-example:anchor-param-example, schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
          > </api-request>

          ${e.callbacks?h_.call(this,e.callbacks):""}
        </div>  

        <api-response
          class = "${this.renderStyle}-mode"
          style = "width:100%;"
          webhook = "${e.isWebhook}"
          .responses="${e.responses}"
          active-schema-tab = "${this.defaultSchemaTab}" 
          render-style="${this.renderStyle}" 
          schema-style="${this.schemaStyle}"
          schema-expand-level = "${this.schemaExpandLevel}"
          schema-description-expanded = "${this.schemaDescriptionExpanded}"
          allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
          schema-hide-read-only = "${"never"===this.schemaHideReadOnly?"false":e.isWebhook?"true":"false"}"
          schema-hide-write-only = "${"never"===this.schemaHideWriteOnly||e.isWebhook?"false":"true"}"
          selected-status = "${Object.keys(e.responses||{})[0]||""}"
          exportparts = "btn:btn, btn-fill:btn-fill, btn-outline:btn-outline, btn-try:btn-try, file-input:file-input, 
          textbox:textbox, textbox-param:textbox-param, textarea:textarea, textarea-param:textarea-param, anchor:anchor, anchor-param-example:anchor-param-example, btn-clear-resp:btn-clear-resp,
          schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
        > </api-response>
      </div>
  </div>`}function bR(e=!0,t=!0,r=!1){return this.resolvedSpec?q`
    ${e?q`
        <div style="display:flex; justify-content:flex-end;"> 
          <span @click="${e=>gR(e,"expand-all")}" style="color:var(--primary-color); cursor:pointer;">
            Expand all
          </span> 
          &nbsp;|&nbsp; 
          <span @click="${e=>gR(e,"collapse-all")}" style="color:var(--primary-color); cursor:pointer;" >
            Collapse all
          </span> 
          &nbsp; sections
        </div>`:""}
    ${this.resolvedSpec.tags.map((e=>q`
      ${t?q` 
          <div class='regular-font section-gap section-tag ${e.expanded?"expanded":"collapsed"}'> 
            <div class='section-tag-header' @click="${()=>{e.expanded=!e.expanded,this.requestUpdate()}}">
              <div id='${e.elementId}' class="sub-title tag" style="color:var(--primary-color)">${e.name}</div>
            </div>
            <div class='section-tag-body'>
              <slot name="${e.elementId}"></slot>
              <div class="regular-font regular-font-size m-markdown" style="padding-bottom:12px">
                ${KP(He(e.description||""))}
              </div>
              ${e.paths.filter((e=>!this.matchPaths||st(this.matchPaths,e,this.matchType))).map((e=>q`
                <section part="section-endpoint" id='${e.elementId}' class='m-endpoint regular-font ${e.method} ${r||e.expanded?"expanded":"collapsed"}'>
                  <!--${yR.call(this,e,r)}-->
                  ${r||e.expanded?vR.call(this,e):""}
                </section>`))}
            </div>
          </div>`:q`
          <div class='section-tag-body'>
          ${e.paths.filter((e=>!this.matchPaths||st(this.matchPaths,e,"exactly"))).map((e=>q`
            <section id='${e.elementId}' class='m-endpoint regular-font ${e.method} ${r||e.expanded?"expanded":"collapsed"}'>
              <!--${yR.call(this,e,r)}-->
              ${r||e.expanded?vR.call(this,e):""}
            </section>`))}
          </div>
        `}
  `))}`:""}function xR(){return q`
  <header class="row main-header regular-font" part="section-header" style="padding:8px 4px 8px 4px;min-height:48px;">
    <div class="only-large-screen-flex" style="align-items: center;">
      <slot name="logo" class="logo" part="section-logo">
        ${e="height:36px;width:36px;margin-left:5px",q`
  <div style=${e}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="1 0 511 512">
      <path d="M351 411a202 202 0 01-350 0 203 203 0 01333-24 203 203 0 0117 24zm0 0" fill="#adc165"/>
      <path d="M334 387a202 202 0 01-216-69 202 202 0 01216 69zm78 32H85a8 8 0 01-8-8 8 8 0 018-8h327a8 8 0 017 8 8 8 0 01-7 8zm0 0" fill="#99aa52"/>
      <path d="M374 338l-5 30a202 202 0 01-248-248 203 203 0 01253 218zm0 0" fill="#ffc73b"/>
      <path d="M374 338a202 202 0 01-100-197 203 203 0 01100 197zm38 81l-6-2-231-231a8 8 0 0111-11l231 230a8 8 0 01-5 14zm0 0" fill="#efb025"/>
      <path d="M311 175c0 75 40 140 101 175a202 202 0 000-350 202 202 0 00-101 175zm0 0" fill="#ff903e"/>
      <path d="M412 419a8 8 0 01-8-8V85a8 8 0 0115 0v326a8 8 0 01-7 8zm0 0" fill="#e87425"/>
    </svg>
  </div>    
`}
        <!-- m-logo style="height:36px;width:36px;margin-left:5px"></m-logo -->
      </slot>  
      <div class="header-title" part="label-header-title">${this.headingText}</div>
    </div>  
    <div style="margin: 0px 8px;display:flex;flex:1">
      ${"false"===this.allowSpecUrlLoad?"":q`
          <input id="spec-url" 
            type="text" 
            style="font-size:var(--font-size-small)" 
            class="header-input mono-font"
            part="textbox textbox-spec-url" 
            placeholder="Spec URL" 
            value="${this.specUrl||""}" 
            @change="${this.onSpecUrlChange}" 
            spellcheck="false"
          >
          <div style="margin: 6px 5px 0 -24px; font-size:var(--font-size-regular); cursor:pointer;">&#x21a9;</div> 
        `} 
      ${"false"===this.allowSpecFileLoad?"":q`
          <input id="spec-file" 
            part = "file-input"
            type="file" 
            style="display:none" 
            value="${this.specFile||""}" 
            @change="${this.onSpecFileChange}" 
            spellcheck="false"
           >
          <button class="m-btn primary only-large-screen" style="margin-left:10px;" part="btn btn-fill" @click="${this.onFileLoadClick}"> LOCAL JSON FILE </button>
        `}
      <slot name="header"></slot>
      ${"false"===this.allowSearch||"read focused".includes(this.renderStyle)?"":q`  
          <input id="search" class="header-input" type="text" part="textbox textbox-header-filter" placeholder="Filter" @change="${this.onSearchChange}" style="max-width:130px;margin-left:10px;" spellcheck="false" >
          <div style="margin: 6px 5px 0 -24px; font-size:var(--font-size-regular); cursor:pointer;">&#x21a9;</div>
        `}
      
      ${"false"===this.allowAdvancedSearch||"read focused".includes(this.renderStyle)?"":q`
          <button class="m-btn primary only-large-screen" part="btn btn-fill btn-search" style="margin-left:10px;" @click="${this.onShowSearchModalClicked}">
            Search
          </button>
        `}
    </div>
    </header>`;var e}!function(e,t,r){(t=function(e){var t=function(e,t){if("object"!=typeof e||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:String(t)}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r}(J_,"properties",{id:{type:String},content:{type:String},copied:{type:Boolean},showButton:{type:Boolean},showToast:{type:Boolean}}),customElements.define("content-copy-button",J_);const wR=c`
  *, *:before, *:after { box-sizing: border-box; }

  .dialog-box-overlay {
    background-color: var(--overlay-bg);
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: var(--dialog-z-index);
  }
  
  .dialog-box {
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translate(-50%, 0%);
    display: flex;
    flex-direction: column;
    width: 70vw;
    background-color: var(--bg2);
    color: var(--fg2);
    border-radius: 4px;
    max-height: 500px;
    overflow: hidden;
    border: 1px solid var(--border-color);
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  }
  
  .dialog-box-header {
    position: sticky;
    top: 0;
    align-self: stretch;
    display: flex;
    align-items: center;
    padding: 0px 16px;
    min-height: 60px;
    max-height: 60px;
    border-bottom: 1px solid var(--light-border-color);
    overflow: hidden;
  }
  
  .dialog-box-header button {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
    color: var(--fg);
    border: none;
    outline: none;
    background-color: transparent;
    cursor:pointer;
    border: 1px solid transparent;
    border-radius: 50%;
    margin-right: -8px;
  }
  .dialog-box-header button:hover {
    border-color: var(--primary-color);
  }

  .dialog-box-content {
    padding: 16px;
    display:block;
    overflow: auto;
    height: 100%;
  }

  .dialog-box-title {
    flex-grow: 1;
    font-size:24px;
  }
`;function kR(){var e;return document.addEventListener("close",(()=>{this.showAdvancedSearchDialog=!1})),document.addEventListener("open",this.onOpenSearchDialog),q`
    <dialog-box 
      heading="Search" 
      show="${!!this.showAdvancedSearchDialog}"
    >
      <span class="advanced-search-options">
        <input
          style="width:100%; padding-right:20px;"
          type="text"
          part="textbox textbox-search-dialog"
          placeholder="search text..."
          spellcheck="false"
          @keyup = "${e=>this.onAdvancedSearch(e,400)}"
        >
        <div style="display:flex; margin:8px 0 24px;">
          <div>
            <input style="cursor:pointer;" type="checkbox" part="checkbox checkbox-search-dialog" id="search-api-path" checked @change = "${e=>this.onAdvancedSearch(e,0)}">
            <label for="search-api-path" style="cursor:pointer;"> API Path </label>
            </div>
          <div style="margin-left: 16px;">
            <input style="cursor:pointer;" type="checkbox" part="checkbox checkbox-search-dialog" id="search-api-descr" checked @change = "${e=>this.onAdvancedSearch(e,0)}">
            <label style="cursor:pointer;" for="search-api-descr"> API Description </label>
          </div>
          <div style="margin-left: 16px;">
            <input style="cursor:pointer;" type="checkbox" part="checkbox checkbox-search-dialog" id="search-api-params" @change = "${e=>this.onAdvancedSearch(e,0)}">
            <label style="cursor:pointer;" for="search-api-params"> API Parameters </label>
          </div>
          <div style="margin-left: 16px;">
            <input style="cursor:pointer;" type="checkbox" part="checkbox checkbox-search-dialog" id="search-api-request-body" @change = "${e=>this.onAdvancedSearch(e,0)}">
            <label style="cursor:pointer;" for="search-api-request-body"> Request Body Parameters </label>
          </div>
          <div style="margin-left: 16px;">
            <input style="cursor:pointer;" type="checkbox" part="checkbox checkbox-search-dialog" id="search-api-resp-descr" @change = "${e=>this.onAdvancedSearch(e,0)}">
            <label style="cursor:pointer;" for="search-api-resp-descr"> Response Description </label>
          </div>
        </div>
      </span>
      
      ${null===(e=this.advancedSearchMatches)||void 0===e?void 0:e.map((e=>q`
      <div
        class="mono-font small-font-size hover-bg"
        style='padding: 5px; cursor: pointer; border-bottom: 1px solid var(--light-border-color); ${e.deprecated?"filter:opacity(0.5);":""}' 
        data-content-id='${e.elementId}'
        tabindex = '0'
        @click="${e=>{this.matchPaths="",this.showAdvancedSearchDialog=!1,this.requestUpdate(),this.scrollToEventTarget(e,!0)}}"
      > 
        <span class="upper bold-text method-fg ${e.method}">${e.method}</span> 
        <span>${e.path}</span>
        <span class="regular-font gray-text">${e.summary}</span>
      </div>
    `))}
    </dialog-box>
  `}customElements.define("dialog-box",class extends ae{static get properties(){return{heading:{type:String,attribute:"heading"},show:{type:String,attribute:"show"}}}static get styles(){return[wR]}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",(e=>{"Escape"===e.code&&this.onClose()}))}attributeChangedCallback(e,t,r){t!==r&&("heading"===e&&(this.heading=r),"show"===e&&(this.show=r,"true"===r&&document.dispatchEvent(new CustomEvent("open",{bubbles:!0,composed:!0,detail:this})))),super.attributeChangedCallback(e,t,r)}render(){return q`
    ${"true"===this.show?q`
        <div class="dialog-box-overlay">
          <div class="dialog-box">
            <header class="dialog-box-header">
              <span class="dialog-box-title">${this.heading}</span>
              <button type="button" @click="${this.onClose}">&times;</button>
            </header>
            <div class="dialog-box-content">
              <slot></slot>
            </div>
          </div>
        </div>`:""}`}onClose(){document.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}});const $R={color:{inputReverseFg:"#fff",inputReverseBg:"#333",headerBg:"#444",getRgb(e){if(0===e.indexOf("#")&&(e=e.slice(1,7)),3!==e.length&&4!==e.length||(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),6!==e.length)throw new Error("Invalid HEX color.");return{r:parseInt(e.slice(0,2),16),g:parseInt(e.slice(2,4),16),b:parseInt(e.slice(4,6),16)}},luminanace(e){const t=this.getRgb(e);return.299*t.r+.587*t.g+.114*t.b},invert(e){return this.luminanace(e)>135?"#000":"#fff"},opacity(e,t){const r=this.getRgb(e);return`rgba(${r.r}, ${r.g}, ${r.b}, ${t})`},brightness(e,t){const r=this.getRgb(e);return r.r+=t,r.g+=t,r.b+=t,r.r>255?r.r=255:r.r<0&&(r.r=0),r.g>255?r.g=255:r.g<0&&(r.g=0),r.b>255?r.b=255:r.b<0&&(r.b=0),`#${r.r.toString(16).padStart(2,"0")}${r.g.toString(16).padStart(2,"0")}${r.b.toString(16).padStart(2,"0")}`},hasGoodContrast(e,t){return this.luminanace(e)-this.luminanace(t)}}};function SR(e){return/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8}|[A-Fa-f0-9]{4})$/i.test(e)}function AR(e,t={}){let r={};const n=t.primaryColor?t.primaryColor:"dark"===e?"#f76b39":"#ff591e",o=$R.color.invert(n),a=$R.color.opacity(n,"0.4");if("dark"===e){const e=t.bg1?t.bg1:"#2a2b2c",i=t.fg1?t.fg1:"#bbb",s=t.bg2?t.bg2:$R.color.brightness(e,5),l=t.bg3?t.bg3:$R.color.brightness(e,17),c=t.bg3?t.bg3:$R.color.brightness(e,35),p=t.fg2?t.fg2:$R.color.brightness(i,-15),d=t.fg3?t.fg3:$R.color.brightness(i,-20),u=t.fg3?t.fg3:"#A1A8B3",h=t.inlineCodeFg?t.inlineCodeFg:"#aaa",f="#bbb",m="#eee",g=t.headerColor?t.headerColor:$R.color.brightness(e,10),y=t.navBgColor?t.navBgColor:$R.color.brightness(e,10),v=t.navTextColor?t.navTextColor:$R.color.opacity($R.color.invert(y),"0.50"),b=t.navHoverBgColor?t.navHoverBgColor:$R.color.brightness(y,-15),x=t.navHoverTextColor?t.navHoverTextColor:$R.color.invert(y),w=t.navAccentColor?t.navAccentColor:$R.color.brightness(n,25);r={bg1:e,bg2:s,bg3:l,lightBg:c,fg1:i,fg2:p,fg3:d,lightFg:u,inlineCodeFg:h,primaryColor:n,primaryColorTrans:a,primaryColorInvert:o,selectionBg:f,selectionFg:m,overlayBg:"rgba(80, 80, 80, 0.4)",navBgColor:y,navTextColor:v,navHoverBgColor:b,navHoverTextColor:x,navAccentColor:w,navAccentTextColor:t.navAccentTextColor?t.navAccenttextColor:$R.color.invert(w),headerColor:g,headerColorInvert:$R.color.invert(g),headerColorDarker:$R.color.brightness(g,-20),headerColorBorder:$R.color.brightness(g,10),borderColor:t.borderColor||$R.color.brightness(e,20),lightBorderColor:t.lightBorderColor||"#e7e9ee",codeBorderColor:t.codeBorderColor||$R.color.brightness(e,30),inputBg:t.inputBg||$R.color.brightness(e,-5),placeHolder:t.placeHolder||$R.color.opacity(i,"0.3"),hoverColor:t.hoverColor||$R.color.brightness(e,-10),red:t.red?t.red:"#F06560",lightRed:t.lightRed?t.lightRed:$R.color.brightness(e,-10),pink:t.pink?t.pink:"#ffb2b2",lightPink:t.lightPink||$R.color.brightness(e,-10),green:t.green||"#7ec699",lightGreen:t.lightGreen||$R.color.brightness(e,-10),blue:t.blue||"#71b7ff",lightBlue:t.lightBlue||$R.color.brightness(e,-10),orange:t.orange?t.orange:"#f08d49",lightOrange:t.lightOrange||$R.color.brightness(e,-10),yellow:t.yellow||"#827717",lightYellow:t.lightYellow||$R.color.brightness(e,-10),purple:t.purple||"#786FF1",brown:t.brown||"#D4AC0D",codeBg:t.codeBg||$R.color.opacity($R.color.brightness(e,-15),.7),codeFg:t.codeFg||"#aaa",codePropertyColor:t.codePropertyColor||"#f8c555",codeKeywordColor:t.codeKeywordColor||"#cc99cd",codeOperatorColor:t.codeOperatorColor||"#67cdcc"}}else{const e=t.bg1?t.bg1:"#fafbfc",i=t.fg1?t.fg1:"#444444",s=t.bg2?t.bg2:$R.color.brightness(e,-5),l=t.bg3?t.bg3:$R.color.brightness(e,-15),c=t.bg3?t.bg3:$R.color.brightness(e,-45),p=t.fg2?t.fg2:"#545454",d=t.fg3?t.fg3:$R.color.brightness(i,30),u=t.fg3?t.fg3:"#A1A8B3",h=t.inlineCodeFg?t.inlineCodeFg:"brown",f="#444",m="#eee",g=t.headerColor?t.headerColor:$R.color.brightness(e,-180),y=t.navBgColor?t.navBgColor:$R.color.brightness(e,-200),v=t.navTextColor?t.navTextColor:$R.color.opacity($R.color.invert(y),"0.65"),b=t.navHoverBgColor?t.navHoverBgColor:$R.color.brightness(y,-15),x=t.navHoverTextColor?t.navHoverTextColor:$R.color.invert(y),w=t.navAccentColor?t.navAccentColor:$R.color.brightness(n,25);r={bg1:e,bg2:s,bg3:l,lightBg:c,fg1:i,fg2:p,fg3:d,lightFg:u,inlineCodeFg:h,primaryColor:n,primaryColorTrans:a,primaryColorInvert:o,selectionBg:f,selectionFg:m,overlayBg:"rgba(0, 0, 0, 0.4)",navBgColor:y,navTextColor:v,navHoverBgColor:b,navHoverTextColor:x,navAccentColor:w,navAccentTextColor:t.navAccentTextColor?t.navAccenttextColor:$R.color.invert(w),headerColor:g,headerColorInvert:$R.color.invert(g),headerColorDarker:$R.color.brightness(g,-20),headerColorBorder:$R.color.brightness(g,10),borderColor:t.borderColor||"#B9B9B9",lightBorderColor:t.lightBorderColor||"#e7e9ee",codeBorderColor:t.codeBorderColor||"transparent",inputBg:t.inputBg||"rgba(255, 255, 255, 0.0001)",placeHolder:t.placeHolder||$R.color.brightness(u,20),hoverColor:t.hoverColor||$R.color.brightness(e,-5),rebelPink:"#e31c58",red:t.red||"#F06560",lightRed:t.lightRed||"#fff0f0",pink:t.pink?t.pink:"#990055",lightPink:t.lightPink?t.lightPink:"#ffb2b2",green:t.green||"#690",lightGreen:t.lightGreen||"#fbfff0",blue:t.blue||"#47AFE8",lightBlue:t.lightBlue||"#eff8fd",orange:t.orange||"#FF9900",lightOrange:t.lightOrange||"#fff5e6",yellow:t.yellow||"#827717",lightYellow:t.lightYellow||"#fff5cc",purple:t.purple||"#786FF1",brown:t.brown||"#D4AC0D",fgPositive:"#38853C",bgPositive:"#DFF1E0",borderPositive:"#83D187",fgWarning:"#D56A00",bgWarning:"#FFEBD7",borderWarning:"#F5AE70",fgInfo:"#2978B5",bgInfo:"#DEECF7",borderInfo:"#7CBBEA",fgCritical:"#CC3D3D",bgCritical:"#F8E3E3",borderCritical:"#F49494",codeBg:t.codeBg||$R.color.opacity($R.color.brightness(e,-15),.7),codeFg:t.codeFg||"#666",codePropertyColor:t.codePropertyColor||"#905",codeKeywordColor:t.codeKeywordColor||"#07a",codeOperatorColor:t.codeOperatorColor||"#9a6e3a"}}return q`
  <style>
  *, *:before, *:after { box-sizing: border-box; }
  
  :host {
    /* Common Styles - irrespective of themes */  
    --border-radius: 4px;
    --layout: ${this.layout||"row"};
    --font-mono: ${this.monoFont||'Monaco, "Andale Mono", "Roboto Mono", Consolas, monospace'};
    --font-medium: ${this.mediumFont||this.monoFont||'Monaco, "Andale Mono", "Roboto Mono", Consolas, monospace'};
    --font-regular: ${this.regularFont||'"Open Sans", Avenir, "Segoe UI", Arial, sans-serif'};
    --scroll-bar-width: 8px;
    --nav-item-padding: ${"relaxed"===this.navItemSpacing?"10px 16px 10px 10px":"compact"===this.navItemSpacing?"5px 16px 5px 10px":"7px 16px 7px 10px"};
    
    --resp-area-height: ${this.responseAreaHeight};
    --font-size-small:  ${"default"===this.fontSize?"12px":"large"===this.fontSize?"13px":"14px"};
    --font-size-mono:   ${"default"===this.fontSize?"13px":"large"===this.fontSize?"14px":"15px"};
    --font-size-regular: ${"default"===this.fontSize?"16px":"large"===this.fontSize?"17px":"18px"};
    --dialog-z-index: 1000;

    --focus-shadow: 0 0 0 1px transparent, 0 0 0 3px ${r.primaryColorTrans};

    /* Theme specific styles */  
    --bg:${r.bg1};
    --bg2:${r.bg2};
    --bg3:${r.bg3};
    --light-bg:${r.lightBg};
    --fg:${r.fg1};
    --fg2:${r.fg2};
    --fg3:${r.fg3};
    --light-fg:${r.lightFg};
    --selection-bg:${r.selectionBg};
    --selection-fg:${r.selectionFg};
    --overlay-bg:${r.overlayBg};
    
    /* Border Colors */
    --border-color:${r.borderColor};
    --light-border-color:${r.lightBorderColor};
    --code-border-color:${r.codeBorderColor};

    --input-bg:${r.inputBg};
    --placeholder-color:${r.placeHolder};
    --hover-color:${r.hoverColor};
    --rebel-pink:${r.rebelPink};
    --red:${r.red};
    --light-red:${r.lightRed};
    --pink:${r.pink};
    --light-pink:${r.lightPink};
    --green:${r.green};
    --light-green:${r.lightGreen};
    --blue:${r.blue};
    --light-blue:${r.lightBlue};
    --orange:${r.orange};
    --light-orange:${r.lightOrange};
    --yellow:${r.yellow};
    --light-yellow:${r.lightYellow};
    --purple:${r.purple};
    --brown:${r.brown};

    /* Header Color */
    --header-bg:${r.headerColor};
    --header-fg:${r.headerColorInvert};
    --header-color-darker:${r.headerColorDarker};
    --header-color-border:${r.headerColorBorder};

    /* Nav Colors */  
    --nav-bg-color:${r.navBgColor};
    --nav-text-color:${r.navTextColor};
    --nav-hover-bg-color:${r.navHoverBgColor};
    --nav-hover-text-color:${r.navHoverTextColor};
    --nav-accent-color:${r.navAccentColor};
    --nav-accent-text-color:${r.navAccentTextColor};

    /* Nav API Method Colors*/
    --nav-get-color:${r.blue};
    --nav-put-color:${r.orange};
    --nav-post-color:${r.green};
    --nav-delete-color:${r.red};
    --nav-head-color:${r.yellow};

    /* API Method Colors */
    --get-color:${r.fgPositive};
    --get-bg-color:${r.bgPositive};
    --get-border-color:${r.borderPositive};

    --put-color:${r.fgWarning};
    --put-bg-color:${r.bgWarning};
    --put-border-color:${r.borderWarning};

    --post-color:${r.fgInfo};
    --post-bg-color:${r.bgInfo};
    --post-border-color:${r.borderInfo};

    --delete-color:${r.fgCritical};
    --delete-bg-color:${r.bgCritical};
    --delete-border-color:${r.borderCritical};

    /* HTTP Status Colors */
    --success-color:${r.fgPositive};
    --informational-color:${r.fgInfo};
    --redirection-color:${r.fgWarning};
    --error-color:${r.fgCritical};

    /* Primary Colors */  
    --primary-color:${r.primaryColor};
    --primary-color-invert:${r.primaryColorInvert};
    --primary-color-trans:${r.primaryColorTrans};

    /*Code Syntax Color*/
    --code-bg:${r.codeBg};
    --code-fg:${r.codeFg};
    --inline-code-fg:${r.inlineCodeFg};
    --code-property-color:${r.codePropertyColor};
    --code-keyword-color:${r.codeKeywordColor};
    --code-operator-color:${r.codeOperatorColor};
  }
  </style>`}function ER(e=!1,t=!0,r=!0,n=!1){if(!this.resolvedSpec)return"";"true"===this.persistAuth&&t_.call(this);const o={bg1:SR(this.bgColor)?this.bgColor:"",fg1:SR(this.textColor)?this.textColor:"",headerColor:SR(this.headerColor)?this.headerColor:"",primaryColor:SR(this.primaryColor)?this.primaryColor:"",navBgColor:SR(this.navBgColor)?this.navBgColor:"",navTextColor:SR(this.navTextColor)?this.navTextColor:"",navHoverBgColor:SR(this.navHoverBgColor)?this.navHoverBgColor:"",navHoverTextColor:SR(this.navHoverTextColor)?this.navHoverTextColor:"",navAccentColor:SR(this.navAccentColor)?this.navAccentColor:"",navAccentTextColor:SR(this.navAccentTextColor)?this.navAccentTextColor:""};return this.resolvedSpec.specLoadError?e?q`
        ${"dark"===this.theme?AR.call(this,"dark",o):AR.call(this,"light",o)}
        <div style='display:flex; align-items:center; border:1px dashed var(--border-color); height:42px; padding:5px; font-size:var(--font-size-small); color:var(--red); font-family:var(--font-mono)'> ${this.resolvedSpec.info.description} </div>
      `:q`
      ${"dark"===this.theme?AR.call(this,"dark",o):AR.call(this,"light",o)}
      <!-- Header -->
      ${xR.call(this)}
      <main class='main-content regular-font' part='section-main-content'>
        <slot></slot>
        <div style='margin:24px; text-align: center;'>
          <h1 style='color: var(--red)'> ${this.resolvedSpec.info.title} </h1>
          <div style='font-family:var(--font-mono)'> ${this.resolvedSpec.info.description} </div>
        </div>
      </main>  
    `:this.resolvedSpec.isSpecLoading?q`
      ${"dark"===this.theme?AR.call(this,"dark",o):AR.call(this,"light",o)}
      <main class='main-content regular-font' part='section-main-content'>
        <slot></slot>
        <div class='main-content-inner--${this.renderStyle}-mode'>
          <div class='loader'></div>
        </div>
      </main>
    `:q`
    ${"dark"===this.theme?AR.call(this,"dark",o):AR.call(this,"light",o)}

    <!-- Header -->
    ${"false"===this.showHeader?"":xR.call(this)}

    <!-- Advanced Search -->
    ${"false"===this.allowAdvancedSearch?"":kR.call(this)}

    <div id='the-main-body' class='body ${this.cssClasses}' dir='${this.pageDirection}' >
      <!-- Side Nav -->
      ${"read"!==this.renderStyle&&"focused"!==this.renderStyle||"true"!==this.showSideNav||!this.resolvedSpec?"":lR.call(this)}

      <!-- Main Content -->
      <main class='main-content regular-font' tabindex='-1' part='section-main-content'>
        <slot></slot>
        <div class='main-content-inner--${this.renderStyle}-mode'>
          ${!0===this.loading?q`<div class='loader'></div>`:q`
              ${!0===this.loadFailed?q`<div style='text-align: center;margin: 16px;'> Unable to load the Spec</div>`:q`
                  <div class='operations-root' @click='${e=>{this.handleHref(e)}}'>
                  ${"focused"===this.renderStyle?q`${hR.call(this)}`:q`
                      ${"true"===this.showInfo?aR.call(this):""}
                      <div id="operations-top" class="observe-me">
                        <slot name="operations-top"></slot>
                      </div>  
                      ${"read"===this.renderStyle?eR.call(this):bR.call(this,t,r,n)}
                    `}
                  </div>
                `}`}
        </div>
        <slot name='footer'></slot>
      </main>
    </div>  
  `}class OR extends ae{constructor(){super();const e={root:this.getRootNode().host,rootMargin:"-50px 0px -50px 0px",threshold:0};this.showSummaryWhenCollapsed=!0,this.isIntersectionObserverActive=!1,this.intersectionObserver=new IntersectionObserver((e=>{this.onIntersect(e)}),e)}static get properties(){return{headingText:{type:String,attribute:"heading-text"},gotoPath:{type:String,attribute:"goto-path"},updateRoute:{type:String,attribute:"update-route"},routePrefix:{type:String,attribute:"route-prefix"},specUrl:{type:String,attribute:"spec-url"},sortTags:{type:String,attribute:"sort-tags"},generateMissingTags:{type:String,attribute:"generate-missing-tags"},sortEndpointsBy:{type:String,attribute:"sort-endpoints-by"},specFile:{type:String,attribute:!1},layout:{type:String},renderStyle:{type:String,attribute:"render-style"},defaultSchemaTab:{type:String,attribute:"default-schema-tab"},responseAreaHeight:{type:String,attribute:"response-area-height"},fillRequestFieldsWithExample:{type:String,attribute:"fill-request-fields-with-example"},persistAuth:{type:String,attribute:"persist-auth"},onNavTagClick:{type:String,attribute:"on-nav-tag-click"},schemaStyle:{type:String,attribute:"schema-style"},schemaExpandLevel:{type:Number,attribute:"schema-expand-level"},schemaDescriptionExpanded:{type:String,attribute:"schema-description-expanded"},schemaHideReadOnly:{type:String,attribute:"schema-hide-read-only"},schemaHideWriteOnly:{type:String,attribute:"schema-hide-write-only"},apiKeyName:{type:String,attribute:"api-key-name"},apiKeyLocation:{type:String,attribute:"api-key-location"},apiKeyValue:{type:String,attribute:"api-key-value"},defaultApiServerUrl:{type:String,attribute:"default-api-server"},serverUrl:{type:String,attribute:"server-url"},oauthReceiver:{type:String,attribute:"oauth-receiver"},showHeader:{type:String,attribute:"show-header"},showSideNav:{type:String,attribute:"show-side-nav"},showInfo:{type:String,attribute:"show-info"},allowAuthentication:{type:String,attribute:"allow-authentication"},allowTry:{type:String,attribute:"allow-try"},showCurlBeforeTry:{type:String,attribute:"show-curl-before-try"},allowSpecUrlLoad:{type:String,attribute:"allow-spec-url-load"},allowSpecFileLoad:{type:String,attribute:"allow-spec-file-load"},allowSpecFileDownload:{type:String,attribute:"allow-spec-file-download"},allowSearch:{type:String,attribute:"allow-search"},allowAdvancedSearch:{type:String,attribute:"allow-advanced-search"},allowServerSelection:{type:String,attribute:"allow-server-selection"},allowSchemaDescriptionExpandToggle:{type:String,attribute:"allow-schema-description-expand-toggle"},showComponents:{type:String,attribute:"show-components"},pageDirection:{type:String,attribute:"page-direction"},theme:{type:String},bgColor:{type:String,attribute:"bg-color"},textColor:{type:String,attribute:"text-color"},headerColor:{type:String,attribute:"header-color"},primaryColor:{type:String,attribute:"primary-color"},fontSize:{type:String,attribute:"font-size"},regularFont:{type:String,attribute:"regular-font"},monoFont:{type:String,attribute:"mono-font"},mediumFont:{type:String,attribute:"medium-font"},loadFonts:{type:String,attribute:"load-fonts"},cssFile:{type:String,attribute:"css-file"},cssClasses:{type:String,attribute:"css-classes"},navBgColor:{type:String,attribute:"nav-bg-color"},navTextColor:{type:String,attribute:"nav-text-color"},navHoverBgColor:{type:String,attribute:"nav-hover-bg-color"},navHoverTextColor:{type:String,attribute:"nav-hover-text-color"},navAccentColor:{type:String,attribute:"nav-accent-color"},navAccentTextColor:{type:String,attribute:"nav-accent-text-color"},navActiveItemMarker:{type:String,attribute:"nav-active-item-marker"},navItemSpacing:{type:String,attribute:"nav-item-spacing"},showMethodInNavBar:{type:String,attribute:"show-method-in-nav-bar"},usePathInNavBar:{type:String,attribute:"use-path-in-nav-bar"},infoDescriptionHeadingsInNavBar:{type:String,attribute:"info-description-headings-in-navbar"},fetchCredentials:{type:String,attribute:"fetch-credentials"},matchPaths:{type:String,attribute:"match-paths"},matchType:{type:String,attribute:"match-type"},loading:{type:Boolean},focusedElementId:{type:String},showAdvancedSearchDialog:{type:Boolean},advancedSearchMatches:{type:Object}}}static get styles(){return[Ge,Ke,Je,Ze,Ye,Qe,Xe,et,tt,c`
      :host {
        display:flex;
        flex-direction: column;
        min-width:360px;
        width:100%;
        height:100%;
        margin:0;
        padding:0;
        overflow: hidden;
        letter-spacing:normal;
        color:var(--fg);
        background-color:var(--bg);
        font-family:var(--font-regular);
      }
      :where(button, input[type="checkbox"], [tabindex="0"]):focus-visible { box-shadow: var(--focus-shadow); }
      :where(input[type="text"], input[type="password"], select, textarea):focus-visible { border-color: var(--primary-color); }
    .body {
        display:flex;
        height:100%;
        width:100%;
        overflow:hidden;
        max-width: 2087px;
      }
      .main-content { 
        margin:0;
        padding: 0; 
        display:block;
        flex:1;
        height:100%;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: thin;
        scrollbar-color: var(--border-color) transparent;
      }

      .main-content-inner--view-mode {
        padding: 0 8px;
      }
      .main-content::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      .main-content::-webkit-scrollbar-track {
        background:transparent;
      }
      .main-content::-webkit-scrollbar-thumb {
        background-color: var(--border-color);
      }
      .section-gap.section-tag {
        border-bottom:1px solid var(--border-color);
      }
      .section-tag-header {
        position:relative;
        cursor: n-resize;
        padding: 12px 0;
      }
      .collapsed .section-tag-header:hover{
        cursor: s-resize;
      }

      .section-tag-header:hover{
        background-image: linear-gradient(to right, rgba(0,0,0,0), var(--border-color), rgba(0,0,0,0));
      }

      .section-tag-header:hover::after {
        position:absolute;
        margin-left:-24px;
        font-size:20px;
        top: calc(50% - 14px);
        color:var(--primary-color);
        content: '⬆'; 
      }

      .collapsed .section-tag-header::after {
        position:absolute;
        margin-left:-24px;
        font-size:20px;
        top: calc(50% - 14px);
        color: var(--border-color);
        content: '⬇'; 
      }
      .collapsed .section-tag-header:hover::after {
        color:var(--primary-color);
      }

      .collapsed .section-tag-body {
        display:none;
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
      .tag.title {
        text-transform: uppercase;
      }
      .main-header {
        background-color:var(--header-bg);
        color:var(--header-fg);
        width:100%;
      }
      .header-title {
        font-size:calc(var(--font-size-regular) + 8px); 
        padding:0 8px;
      }
      input.header-input{
        background:var(--header-color-darker);
        color:var(--header-fg);
        border:1px solid var(--header-color-border);
        flex:1; 
        padding-right:24px;
        border-radius:3px;
      }
      input.header-input::placeholder {
        opacity:0.4;
      }
      .loader {
        margin: 16px auto 16px auto; 
        border: 4px solid var(--bg3);
        border-radius: 50%;
        border-top: 4px solid var(--primary-color);
        width: 36px;
        height: 36px;
        animation: spin 2s linear infinite;
      }
      .expanded-endpoint-body { 
        position: relative;
        padding: 6px 0px; 
      }
      .expanded-endpoint-body .tag-description {
        background: var(--code-bg);
        border-radius: var(--border-radius);
        transition: max-height .2s ease-out;
      }
      .expanded-endpoint-body .tag-icon {
        transition: transform .2s ease-out;
      }
      .expanded-endpoint-body .tag-icon.expanded {
        transform: rotate(180deg);
      }
      .divider { 
        border-top: 2px solid var(--border-color);
        margin: 24px 0;
        width:100%;
      }

      .tooltip {
        cursor:pointer;
        border: 1px solid var(--border-color);
        border-left-width: 4px;
        margin-left:2px;
      }
      .tooltip a {
        color: var(--fg2);
        text-decoration: none;
      }
      .tooltip-text {
        color: var(--fg2);
        max-width: 400px;
        position: absolute;
        z-index:1;
        background-color: var(--bg2);
        visibility: hidden;

        overflow-wrap: break-word;
      }
      .tooltip:hover {
        color: var(--primary-color);
        border-color: var(--primary-color);
      }
      .tooltip:hover a:hover {
        color: var(--primary-color);
      }

      .tooltip:hover .tooltip-text {
        visibility: visible;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .nav-method { font-weight: bold; margin-right: 4px; font-size: calc(var(--font-size-small) - 2px); white-space: nowrap; }
      .nav-method.false { display: none; }

      .nav-method.as-colored-text.get { color:var(--get-color); }
      .nav-method.as-colored-text.put { color:var(--put-color); }
      .nav-method.as-colored-text.post { color:var(--post-color); }
      .nav-method.as-colored-text.delete { color:var(--delete-color); }
      .nav-method.as-colored-text.head, .nav-method.as-colored-text.patch, .nav-method.as-colored-text.options { color:var(--nav-head-color); }
      
      .nav-method.as-colored-block {
        padding: 1px 4px;
        min-width: 30px;
        border-radius: 4px 0 0 4px;
        color: #000;
      }
      .colored-block .nav-method.as-colored-block {
        outline: 1px solid;
      }

      .nav-method.as-colored-block.get { background-color: var(--blue); }
      .nav-method.as-colored-block.put { background-color: var(--orange); }
      .nav-method.as-colored-block.post { background-color: var(--green); }
      .nav-method.as-colored-block.delete { background-color: var(--red); }
      .nav-method.as-colored-block.head, .nav-method.as-colored-block.patch , .nav-method.as-colored-block.options { 
        background-color: var(--yellow); 
      }

      @media only screen and (min-width: 768px) {
        .nav-bar {
          width: 260px;
          display:flex;
        }
        .only-large-screen{
          display:block;
        }
        .only-large-screen-flex{
          display:flex;
        }
        .section-gap { 
          padding: 0 0 0 24px; 
        }
        .section-gap--focused-mode {
          padding: 24px 8px; 
        }
        .section-gap--read-mode { 
          padding: 24px 8px; 
        }
        .endpoint-body {
          position: relative;
          padding:36px 0 48px 0;
        }
      }

      @media (min-width: 2560px) {
        .body {
          padding-left: 316px;
          padding-right: 221px;
        }
      }

      @media only screen and (min-width: 1024px) {
        .nav-bar {
          width: ${l("default"===this.fontSize?"300px":"large"===this.fontSize?"315px":"330px")};
          display:flex;
        }
        .section-gap--focused-mode { 
          padding: 12px 80px 12px 80px; 
        }
        .section-gap--read-mode { 
          padding: 24px 80px 12px 80px; 
        }
      }`,rt]}connectedCallback(){super.connectedCallback();const e=this.parentElement;if(e&&"BODY"===e.tagName&&(e.style.marginTop||(e.style.marginTop="0"),e.style.marginRight||(e.style.marginRight="0"),e.style.marginBottom||(e.style.marginBottom="0"),e.style.marginLeft||(e.style.marginLeft="0")),"false"!==this.loadFonts){const e={family:"Open Sans",style:"normal",weight:"300",unicodeRange:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"},t=new FontFace("Open Sans","url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN_r8OUuhpKKSTjw.woff2) format('woff2')",e);e.weight="600";const r=new FontFace("Open Sans","url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UNirkOUuhpKKSTjw.woff2) format('woff2')",e);t.load().then((e=>{document.fonts.add(e)})),r.load().then((e=>{document.fonts.add(e)}))}this.layout&&"row, column,".includes(`${this.layout},`)||(this.layout="row"),this.renderStyle&&"read, view, focused,".includes(`${this.renderStyle},`)||(this.renderStyle="focused"),this.schemaStyle&&"tree, table,".includes(`${this.schemaStyle},`)||(this.schemaStyle="tree"),this.theme&&"light, dark,".includes(`${this.theme},`)||(this.theme=window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"),this.defaultSchemaTab&&"example, schema, model,".includes(`${this.defaultSchemaTab},`)?"model"===this.defaultSchemaTab&&(this.defaultSchemaTab="schema"):this.defaultSchemaTab="example",(!this.schemaExpandLevel||this.schemaExpandLevel<1)&&(this.schemaExpandLevel=99999),this.schemaDescriptionExpanded&&"true, false,".includes(`${this.schemaDescriptionExpanded},`)||(this.schemaDescriptionExpanded="false"),this.schemaHideReadOnly&&"default, never,".includes(`${this.schemaHideReadOnly},`)||(this.schemaHideReadOnly="default"),this.schemaHideWriteOnly&&"default, never,".includes(`${this.schemaHideWriteOnly},`)||(this.schemaHideWriteOnly="default"),this.fillRequestFieldsWithExample&&"true, false,".includes(`${this.fillRequestFieldsWithExample},`)||(this.fillRequestFieldsWithExample="true"),this.persistAuth&&"true, false,".includes(`${this.persistAuth},`)||(this.persistAuth="false"),this.responseAreaHeight||(this.responseAreaHeight="400px"),this.allowSearch&&"true, false,".includes(`${this.allowSearch},`)||(this.allowSearch="true"),this.allowAdvancedSearch&&"true, false,".includes(`${this.allowAdvancedSearch},`)||(this.allowAdvancedSearch="true"),this.allowTry&&"true, false,".includes(`${this.allowTry},`)||(this.allowTry="true"),this.apiKeyValue||(this.apiKeyValue="-"),this.apiKeyLocation||(this.apiKeyLocation="header"),this.apiKeyName||(this.apiKeyName=""),this.oauthReceiver||(this.oauthReceiver="oauth-receiver.html"),this.updateRoute&&"true, false,".includes(`${this.updateRoute},`)||(this.updateRoute="true"),this.routePrefix||(this.routePrefix="#"),this.sortTags&&"true, false,".includes(`${this.sortTags},`)||(this.sortTags="false"),this.generateMissingTags&&"true, false,".includes(`${this.generateMissingTags},`)||(this.generateMissingTags="false"),this.sortEndpointsBy&&"method, path, summary, none,".includes(`${this.sortEndpointsBy},`)||(this.sortEndpointsBy="path"),this.onNavTagClick&&"expand-collapse, show-description,".includes(`${this.onNavTagClick},`)||(this.onNavTagClick="expand-collapse"),this.navItemSpacing&&"compact, relaxed, default,".includes(`${this.navItemSpacing},`)||(this.navItemSpacing="default"),this.showMethodInNavBar&&"false, as-plain-text, as-colored-text, as-colored-block,".includes(`${this.showMethodInNavBar},`)||(this.showMethodInNavBar="false"),this.usePathInNavBar&&"true, false,".includes(`${this.usePathInNavBar},`)||(this.usePathInNavBar="false"),this.navActiveItemMarker&&"left-bar, colored-block".includes(`${this.navActiveItemMarker},`)||(this.navActiveItemMarker="left-bar"),this.fontSize&&"default, large, largest,".includes(`${this.fontSize},`)||(this.fontSize="default"),this.showInfo&&"true, false,".includes(`${this.showInfo},`)||(this.showInfo="true"),this.allowServerSelection&&"true, false,".includes(`${this.allowServerSelection},`)||(this.allowServerSelection="true"),this.allowAuthentication&&"true, false,".includes(`${this.allowAuthentication},`)||(this.allowAuthentication="true"),this.allowSchemaDescriptionExpandToggle&&"true, false,".includes(`${this.allowSchemaDescriptionExpandToggle},`)||(this.allowSchemaDescriptionExpandToggle="true"),this.showSideNav&&"true false".includes(this.showSideNav)||(this.showSideNav="true"),this.showComponents&&"true false".includes(this.showComponents)||(this.showComponents="false"),this.infoDescriptionHeadingsInNavBar&&"true, false,".includes(`${this.infoDescriptionHeadingsInNavBar},`)||(this.infoDescriptionHeadingsInNavBar="false"),this.fetchCredentials&&"omit, same-origin, include,".includes(`${this.fetchCredentials},`)||(this.fetchCredentials=""),this.matchType&&"includes regex".includes(this.matchType)||(this.matchType="includes"),this.showAdvancedSearchDialog||(this.showAdvancedSearchDialog=!1),this.cssFile||(this.cssFile=null),this.cssClasses||(this.cssClasses=""),He.setOptions({highlight:(e,t)=>("curl"===t&&(t="bash"),Ve().languages[t]?Ve().highlight(e,Ve().languages[t],t):e)}),window.addEventListener("hashchange",(()=>{this.scrollToPath(this.getElementIDFromURL())}),!0)}disconnectedCallback(){this.intersectionObserver&&this.intersectionObserver.disconnect(),super.disconnectedCallback()}infoDescriptionHeadingRenderer(){const e=new He.Renderer;return e.heading=(e,t,r,n)=>`<h${t} class="observe-me" id="${n.slug(r)}">${e}</h${t}>`,e}render(){const e=document.querySelector(`link[href*="${this.cssFile}"]`);return e&&this.shadowRoot.appendChild(e.cloneNode()),ER.call(this)}observeExpandedContent(){this.shadowRoot.querySelectorAll(".observe-me").forEach((e=>{this.intersectionObserver.observe(e)}))}attributeChangedCallback(e,t,r){if("spec-url"===e&&t!==r&&window.setTimeout((async()=>{await this.loadSpec(r),this.gotoPath&&!window.location.hash&&this.scrollToPath(this.gotoPath)}),0),"render-style"===e&&("read"===r?window.setTimeout((()=>{this.observeExpandedContent()}),100):this.intersectionObserver.disconnect()),"api-key-name"===e||"api-key-location"===e||"api-key-value"===e){let t=!1,n="",o="",a="";if("api-key-name"===e?this.getAttribute("api-key-location")&&this.getAttribute("api-key-value")&&(n=r,o=this.getAttribute("api-key-location"),a=this.getAttribute("api-key-value"),t=!0):"api-key-location"===e?this.getAttribute("api-key-name")&&this.getAttribute("api-key-value")&&(o=r,n=this.getAttribute("api-key-name"),a=this.getAttribute("api-key-value"),t=!0):"api-key-value"===e&&this.getAttribute("api-key-name")&&this.getAttribute("api-key-location")&&(a=r,o=this.getAttribute("api-key-location"),n=this.getAttribute("api-key-name"),t=!0),t&&this.resolvedSpec){const e=this.resolvedSpec.securitySchemes.find((e=>e.securitySchemeId===ot));e?(e.name=n,e.in=o,e.value=a,e.finalKeyValue=a):this.resolvedSpec.securitySchemes.push({securitySchemeId:ot,description:"api-key provided in rapidoc element attributes",type:"apiKey",name:n,in:o,value:a,finalKeyValue:a}),this.requestUpdate()}}super.attributeChangedCallback(e,t,r)}onSpecUrlChange(){this.setAttribute("spec-url",this.shadowRoot.getElementById("spec-url").value)}onSpecFileChange(e){this.setAttribute("spec-file",this.shadowRoot.getElementById("spec-file").value);const t=e.target.files[0],r=new FileReader;r.onload=()=>{try{const e=JSON.parse(r.result);this.loadSpec(e),this.shadowRoot.getElementById("spec-url").value=""}catch(e){console.error("RapiDoc: Unable to read or parse json")}},r.readAsText(t)}onFileLoadClick(){this.shadowRoot.getElementById("spec-file").click()}onSearchChange(e){this.matchPaths=e.target.value,this.resolvedSpec.tags.forEach((e=>e.paths.filter((t=>{this.matchPaths&&st(this.matchPaths,t,this.matchType)&&(e.expanded=!0)})))),this.resolvedSpec.components.forEach((e=>e.subComponents.filter((e=>{e.expanded=!1,this.matchPaths&&!function(e,t){return t.name.toLowerCase().includes(e.toLowerCase())}(this.matchPaths,e)||(e.expanded=!0)})))),this.requestUpdate()}onClearSearch(){this.shadowRoot.getElementById("nav-bar-search").value="",this.matchPaths="",this.resolvedSpec.components.forEach((e=>e.subComponents.filter((e=>{e.expanded=!0}))))}onShowSearchModalClicked(){this.showAdvancedSearchDialog=!0}async onOpenSearchDialog(e){const t=e.detail.querySelector("input");await at(0),t&&t.focus()}async loadSpec(e){if(e){this.matchPaths="";try{this.resolvedSpec={specLoadError:!1,isSpecLoading:!0,tags:[]},this.loading=!0,this.loadFailed=!1;const t=await UP.call(this,e,"true"===this.generateMissingTags,"true"===this.sortTags,this.getAttribute("sort-endpoints-by"),this.getAttribute("api-key-name"),this.getAttribute("api-key-location"),this.getAttribute("api-key-value"),this.getAttribute("server-url"));this.loading=!1,this.afterSpecParsedAndValidated(t)}catch(e){this.loading=!1,this.loadFailed=!0,this.resolvedSpec=null,console.error(`RapiDoc: Unable to resolve the API spec..  ${e.message}`)}}}async afterSpecParsedAndValidated(e){for(this.resolvedSpec=e,this.selectedServer=void 0,this.defaultApiServerUrl&&(this.defaultApiServerUrl===this.serverUrl?this.selectedServer={url:this.serverUrl,computedUrl:this.serverUrl}:this.resolvedSpec.servers&&(this.selectedServer=this.resolvedSpec.servers.find((e=>e.url===this.defaultApiServerUrl)))),this.selectedServer||this.resolvedSpec.servers&&(this.selectedServer=this.resolvedSpec.servers[0]),this.requestUpdate();!await this.updateComplete;);const t=new CustomEvent("spec-loaded",{detail:e});this.dispatchEvent(t),this.intersectionObserver.disconnect(),"read"===this.renderStyle&&(await at(100),this.observeExpandedContent()),this.isIntersectionObserverActive=!0;const r=this.getElementIDFromURL();if(r)"view"===this.renderStyle?this.expandAndGotoOperation(r,!0,!0):this.scrollToPath(r);else if("focused"===this.renderStyle&&!this.gotoPath){var n;const e=this.showInfo?"overview":null===(n=this.resolvedSpec.tags[0])||void 0===n?void 0:n.paths[0];this.scrollToPath(e)}}getComponentBaseURL(){const{href:e}=window.location,t=this.routePrefix.replace(/(#|\/)$/,"");if(!t)return e.split("#")[0];const r=e.lastIndexOf(t);return-1===r?e:e.slice(0,r)}getElementIDFromURL(){const e=this.getComponentBaseURL();return window.location.href.replace(e+this.routePrefix,"")}replaceHistoryState(e){const t=this.getComponentBaseURL();window.history.replaceState(null,null,`${t}${this.routePrefix||"#"}${e}`)}expandAndGotoOperation(e,t=!0){if(!this.resolvedSpec)return;let r=!0;const n=-1===e.indexOf("#")?e:e.substring(1);if(n.startsWith("overview")||"servers"===n||"auth"===n)r=!1;else for(let t=0;t<(null===(o=this.resolvedSpec.tags)||void 0===o?void 0:o.length);t++){var o,a;const n=this.resolvedSpec.tags[t],i=null===(a=n.paths)||void 0===a?void 0:a.find((t=>t.elementId===e));i&&(i.expanded&&n.expanded?r=!1:(i.expanded=!0,n.expanded=!0))}t&&(r&&this.requestUpdate(),window.setTimeout((()=>{const e=this.shadowRoot.getElementById(n);e&&(e.scrollIntoView({behavior:"auto",block:"start"}),"true"===this.updateRoute&&this.replaceHistoryState(n))}),r?150:0))}isValidTopId(e){return e.startsWith("overview")||"servers"===e||"auth"===e}isValidPathId(e){var t,r,n,o;return!("overview"!==e||!this.showInfo)||(!("servers"!==e||!this.allowServerSelection)||(!("auth"!==e||!this.allowAuthentication)||(e.startsWith("tag--")?null===(n=this.resolvedSpec)||void 0===n||null===(o=n.tags)||void 0===o?void 0:o.find((t=>t.elementId===e)):null===(t=this.resolvedSpec)||void 0===t||null===(r=t.tags)||void 0===r?void 0:r.find((t=>t.paths.find((t=>t.elementId===e)))))))}onIntersect(e){!1!==this.isIntersectionObserverActive&&e.forEach((e=>{if(e.isIntersecting&&e.intersectionRatio>0){const t=this.shadowRoot.querySelector(".nav-bar-tag.active, .nav-bar-path.active, .nav-bar-info.active, .nav-bar-h1.active, .nav-bar-h2.active, .operations.active"),r=this.shadowRoot.getElementById(`link-${e.target.id}`);r&&("true"===this.updateRoute&&this.replaceHistoryState(e.target.id),r.classList.add("active"),r.part.add("section-navbar-active-item")),t&&t!==r&&(t.classList.remove("active"),t.part.remove("section-navbar-active-item"))}}))}handleHref(e){if("a"===e.target.tagName.toLowerCase()&&e.target.getAttribute("href").startsWith("#")){const t=this.shadowRoot.getElementById(e.target.getAttribute("href").replace("#",""));t&&t.scrollIntoView({behavior:"auto",block:"start"})}}async scrollToEventTarget(e,t=!0){if("click"!==e.type&&("keyup"!==e.type||13!==e.keyCode))return;const r=e.target;if(r.dataset.contentId){if(this.isIntersectionObserverActive=!1,"focused"===this.renderStyle){const e=this.shadowRoot.querySelector("api-request");e&&e.beforeNavigationFocusedMode()}this.scrollToPath(r.dataset.contentId,!0,t),setTimeout((()=>{this.isIntersectionObserverActive=!0}),300)}}async scrollToPath(e,t=!0,r=!0){if("focused"===this.renderStyle&&(this.focusedElementId=e,await at(0)),"view"===this.renderStyle)this.expandAndGotoOperation(e,t,!0);else{let t=!1;const n=this.shadowRoot.getElementById(e);if(n?(t=!0,n.scrollIntoView({behavior:"auto",block:"start"})):t=!1,t){if("focused"===this.renderStyle){const e=this.shadowRoot.querySelector("api-request");e&&e.afterNavigationFocusedMode();const t=this.shadowRoot.querySelector("api-response");t&&t.resetSelection()}"true"===this.updateRoute&&this.replaceHistoryState(e);const t=this.shadowRoot.getElementById(`link-${e}`);if(t){r&&t.scrollIntoView({behavior:"auto",block:"center"}),await at(0);const e=this.shadowRoot.querySelector(".nav-bar-tag.active, .nav-bar-path.active, .nav-bar-info.active, .nav-bar-h1.active, .nav-bar-h2.active, .operations.active");e&&(e.classList.remove("active"),e.part.remove("active"),e.part.remove("section-navbar-active-item")),t.classList.add("active"),t.part.add("section-navbar-active-item")}}}}setHttpUserNameAndPassword(e,t,r){return YP.call(this,e,t,r)}setApiKey(e,t){return YP.call(this,e,"","",t)}removeAllSecurityKeys(){return QP.call(this)}setApiServer(e){return W_.call(this,e)}onAdvancedSearch(e,t){const r=e.target;clearTimeout(this.timeoutId),this.timeoutId=setTimeout((()=>{let e;e="text"===r.type?r:r.closest(".advanced-search-options").querySelector("input[type=text]");const t=[...r.closest(".advanced-search-options").querySelectorAll("input:checked")].map((e=>e.id));this.advancedSearchMatches=function(e,t,r=[]){if(!e.trim()||0===r.length)return;const n=[];return t.forEach((t=>{t.paths.forEach((t=>{let o="";var a;if(r.includes("search-api-path")&&(o=t.path),r.includes("search-api-descr")&&(o=`${o} ${t.summary||t.description||""}`),r.includes("search-api-params")&&(o=`${o} ${(null===(a=t.parameters)||void 0===a?void 0:a.map((e=>e.name)).join(" "))||""}`),r.includes("search-api-request-body")&&t.requestBody){let e=new Set;for(const r in null===(i=t.requestBody)||void 0===i?void 0:i.content){var i,s,l;null!==(s=t.requestBody.content[r].schema)&&void 0!==s&&s.properties&&(e=lt(null===(l=t.requestBody.content[r].schema)||void 0===l?void 0:l.properties)),o=`${o} ${[...e].join(" ")}`}}r.includes("search-api-resp-descr")&&(o=`${o} ${Object.values(t.responses).map((e=>e.description||"")).join(" ")}`),o.toLowerCase().includes(e.trim().toLowerCase())&&n.push({elementId:t.elementId,method:t.method,path:t.path,summary:t.summary||t.description||"",deprecated:t.deprecated})}))})),n}(e.value,this.resolvedSpec.tags,t)}),t)}}customElements.define("rapi-doc",OR);customElements.define("rapi-doc-mini",class extends ae{constructor(){super(),this.isMini=!0,this.updateRoute="false",this.renderStyle="view",this.showHeader="false",this.allowAdvancedSearch="false"}static get properties(){return{specUrl:{type:String,attribute:"spec-url"},sortEndpointsBy:{type:String,attribute:"sort-endpoints-by"},layout:{type:String},pathsExpanded:{type:String,attribute:"paths-expanded"},defaultSchemaTab:{type:String,attribute:"default-schema-tab"},responseAreaHeight:{type:String,attribute:"response-area-height"},showSummaryWhenCollapsed:{type:String,attribute:"show-summary-when-collapsed"},fillRequestFieldsWithExample:{type:String,attribute:"fill-request-fields-with-example"},persistAuth:{type:String,attribute:"persist-auth"},schemaStyle:{type:String,attribute:"schema-style"},schemaExpandLevel:{type:Number,attribute:"schema-expand-level"},schemaDescriptionExpanded:{type:String,attribute:"schema-description-expanded"},apiKeyName:{type:String,attribute:"api-key-name"},apiKeyLocation:{type:String,attribute:"api-key-location"},apiKeyValue:{type:String,attribute:"api-key-value"},defaultApiServerUrl:{type:String,attribute:"default-api-server"},serverUrl:{type:String,attribute:"server-url"},oauthReceiver:{type:String,attribute:"oauth-receiver"},allowTry:{type:String,attribute:"allow-try"},theme:{type:String},bgColor:{type:String,attribute:"bg-color"},textColor:{type:String,attribute:"text-color"},primaryColor:{type:String,attribute:"primary-color"},fontSize:{type:String,attribute:"font-size"},regularFont:{type:String,attribute:"regular-font"},monoFont:{type:String,attribute:"mono-font"},mediumFont:{type:String,attribute:"medium-font"},loadFonts:{type:String,attribute:"load-fonts"},fetchCredentials:{type:String,attribute:"fetch-credentials"},matchPaths:{type:String,attribute:"match-paths"},matchType:{type:String,attribute:"match-type"},loading:{type:Boolean}}}static get styles(){return[Ge,Ke,Je,Ze,Ye,Qe,Xe,et,tt,c`
      :host {
        display:flex;
        flex-direction: column;
        min-width:360px;
        width:100%;
        height:100%;
        margin:0;
        padding:0;
        overflow: hidden;
        letter-spacing:normal;
        color:var(--fg);
        background-color:var(--bg);
        font-family:var(--font-regular);
      }

      @media only screen and (min-width: 768px) {
        .only-large-screen{
          display:block;
        }
        .only-large-screen-flex{
          display:flex;
        }
      }`]}connectedCallback(){if(super.connectedCallback(),"false"!==this.loadFonts){const e={family:"Open Sans",style:"normal",weight:"300",unicodeRange:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"},t=new FontFace("Open Sans","url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN_r8OUuhpKKSTjw.woff2) format('woff2')",e);e.weight="600";const r=new FontFace("Open Sans","url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UNirkOUuhpKKSTjw.woff2) format('woff2')",e);t.load().then((e=>{document.fonts.add(e)})),r.load().then((e=>{document.fonts.add(e)}))}this.showSummaryWhenCollapsed&&"true, false,".includes(`${this.showSummaryWhenCollapsed},`)||(this.showSummaryWhenCollapsed="true"),this.layout&&"row, column,".includes(`${this.layout},`)||(this.layout="row"),this.schemaStyle&&"tree, table,".includes(`${this.schemaStyle},`)||(this.schemaStyle="tree"),this.theme&&"light, dark,".includes(`${this.theme},`)||(this.theme=window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"),this.defaultSchemaTab&&"example, schema, model,".includes(`${this.defaultSchemaTab},`)?"model"===this.defaultSchemaTab&&(this.defaultSchemaTab="schema"):this.defaultSchemaTab="example",this.pathsExpanded="true"===this.pathsExpanded,(!this.schemaExpandLevel||this.schemaExpandLevel<1)&&(this.schemaExpandLevel=99999),this.schemaDescriptionExpanded&&"true, false,".includes(`${this.schemaDescriptionExpanded},`)||(this.schemaDescriptionExpanded="false"),this.fillRequestFieldsWithExample&&"true, false,".includes(`${this.fillRequestFieldsWithExample},`)||(this.fillRequestFieldsWithExample="true"),this.persistAuth&&"true, false,".includes(`${this.persistAuth},`)||(this.persistAuth="false"),this.responseAreaHeight||(this.responseAreaHeight="300px"),this.allowTry&&"true, false,".includes(`${this.allowTry},`)||(this.allowTry="true"),this.apiKeyValue||(this.apiKeyValue="-"),this.apiKeyLocation||(this.apiKeyLocation="header"),this.apiKeyName||(this.apiKeyName=""),this.oauthReceiver||(this.oauthReceiver="oauth-receiver.html"),this.sortTags&&"true, false,".includes(`${this.sortTags},`)||(this.sortTags="false"),this.sortEndpointsBy&&"method, path, summary,".includes(`${this.sortEndpointsBy},`)||(this.sortEndpointsBy="path"),this.fontSize&&"default, large, largest,".includes(`${this.fontSize},`)||(this.fontSize="default"),this.matchType&&"includes regex".includes(this.matchType)||(this.matchType="includes"),this.allowSchemaDescriptionExpandToggle&&"true, false,".includes(`${this.allowSchemaDescriptionExpandToggle},`)||(this.allowSchemaDescriptionExpandToggle="true"),this.fetchCredentials&&"omit, same-origin, include,".includes(`${this.fetchCredentials},`)||(this.fetchCredentials=""),He.setOptions({highlight:(e,t)=>("curl"===t&&(t="bash"),Ve().languages[t]?Ve().highlight(e,Ve().languages[t],t):e)})}render(){return ER.call(this,!0,!1,!1,this.pathsExpanded)}attributeChangedCallback(e,t,r){if("spec-url"===e&&t!==r&&window.setTimeout((async()=>{await this.loadSpec(r)}),0),"api-key-name"===e||"api-key-location"===e||"api-key-value"===e){let t=!1,n="",o="",a="";if("api-key-name"===e?this.getAttribute("api-key-location")&&this.getAttribute("api-key-value")&&(n=r,o=this.getAttribute("api-key-location"),a=this.getAttribute("api-key-value"),t=!0):"api-key-location"===e?this.getAttribute("api-key-name")&&this.getAttribute("api-key-value")&&(o=r,n=this.getAttribute("api-key-name"),a=this.getAttribute("api-key-value"),t=!0):"api-key-value"===e&&this.getAttribute("api-key-name")&&this.getAttribute("api-key-location")&&(a=r,o=this.getAttribute("api-key-location"),n=this.getAttribute("api-key-name"),t=!0),t&&this.resolvedSpec){const e=this.resolvedSpec.securitySchemes.find((e=>e.securitySchemeId===ot));e?(e.name=n,e.in=o,e.value=a,e.finalKeyValue=a):this.resolvedSpec.securitySchemes.push({apiKeyId:ot,description:"api-key provided in rapidoc element attributes",type:"apiKey",name:n,in:o,value:a,finalKeyValue:a}),this.requestUpdate()}}super.attributeChangedCallback(e,t,r)}onSpecUrlChange(){this.setAttribute("spec-url",this.shadowRoot.getElementById("spec-url").value)}async loadSpec(e){if(e)try{this.resolvedSpec={specLoadError:!1,isSpecLoading:!0,tags:[]},this.loading=!0,this.loadFailed=!1,this.requestUpdate();const t=await UP.call(this,e,"true"===this.generateMissingTags,"true"===this.sortTags,this.getAttribute("sort-endpoints-by"),this.getAttribute("api-key-name"),this.getAttribute("api-key-location"),this.getAttribute("api-key-value"),this.getAttribute("server-url"));this.loading=!1,this.afterSpecParsedAndValidated(t)}catch(e){this.loading=!1,this.loadFailed=!0,this.resolvedSpec=null,console.error(`RapiDoc: Unable to resolve the API spec..  ${e.message}`)}}setHttpUserNameAndPassword(e,t,r){return YP.call(this,e,t,r)}setApiKey(e,t){return YP.call(this,e,"","",t)}removeAllSecurityKeys(){return QP.call(this)}setApiServer(e){return W_.call(this,e)}async afterSpecParsedAndValidated(e){for(this.resolvedSpec=e,this.selectedServer=void 0,this.defaultApiServerUrl&&(this.defaultApiServerUrl===this.serverUrl?this.selectedServer={url:this.serverUrl,computedUrl:this.serverUrl}:this.resolvedSpec.servers&&(this.selectedServer=this.resolvedSpec.servers.find((e=>e.url===this.defaultApiServerUrl)))),this.selectedServer||this.resolvedSpec.servers&&(this.selectedServer=this.resolvedSpec.servers[0]),this.requestUpdate();!await this.updateComplete;);const t=new CustomEvent("spec-loaded",{detail:e});this.dispatchEvent(t)}handleHref(e){if("a"===e.target.tagName.toLowerCase()&&e.target.getAttribute("href").startsWith("#")){const t=this.shadowRoot.getElementById(e.target.getAttribute("href").replace("#",""));t&&t.scrollIntoView({behavior:"auto",block:"start"})}}});class CR extends HTMLElement{connectedCallback(){this.receiveAuthParms(),window.addEventListener("storage",(e=>this.receiveStorage(e)),!0)}receiveAuthParms(){let e={};if(document.location.search){const t=new URLSearchParams(document.location.search);e={code:t.get("code"),error:t.get("error"),state:t.get("state"),responseType:"code"}}else if(window.location.hash){e={token_type:this.parseQueryString(window.location.hash.substring(1),"token_type"),access_token:this.parseQueryString(window.location.hash.substring(1),"access_token"),responseType:"token"}}window.opener?window.opener.postMessage(e,this.target):sessionStorage.setItem("rapidoc-oauth-data",JSON.stringify(e))}relayAuthParams(e){if(window.parent&&"rapidoc-oauth-data"===e.key){const t=JSON.parse(e.newValue);window.parent.postMessage(t,this.target)}}parseQueryString(e,t){const r=e.split("&");for(let e=0;e<r.length;e++){const n=r[e].split("=");if(decodeURIComponent(n[0])===t)return decodeURIComponent(n[1])}}}function TR(){return q`
  <nav class='nav-bar' part="section-navbar">
    <slot name="nav-logo" class="logo"></slot>
    <div style="display:flex;line-height:22px; padding:8px">
      <input id="nav-bar-search" 
        part = "textbox textbox-nav-filter"
        style = "width:100%; height: 26px; padding-right:20px; color:var(--nav-hover-text-color); border-color:var(--nav-accent-color); background-color:var(--nav-hover-bg-color)" 
        type = "text"
        placeholder = "Filter" 
        @change = "${this.onSearchChange}"  
        spellcheck = "false" 
      >
      <div style="margin: 6px 5px 0 -24px; font-size:var(--font-size-regular); cursor:pointer;">&#x21a9;</div>
    </div>
    <nav style="flex:1" class='nav-scroll' part="section-navbar-scroll">
      ${this.resolvedSpec.schemaAndExamples.map((e=>q`
        <div class='nav-bar-path' data-content-id='${e.elementId}' id='link-${e.elementId}'
          @click = '${e=>{this.scrollToEventTarget(e,!1)}}'
        > 
          ${e.name}
        </div>`))}
    </nav>  
  </nav>
  `}function jR(){return q`
    ${"true"===this.showInfo?aR.call(this):""}
    <div style="font-size:var(--font-size-regular);">
    ${this.resolvedSpec.schemaAndExamples.map((e=>{var t;const r=__(e.schema,"json",e.examples,e.example,!0,!1,"json",!0);return e.selectedExample=null===(t=r[0])||void 0===t?void 0:t.exampleId,q`
        <section id='${e.elementId}' class='json-schema-and-example regular-font' style="display:flex; flex-direction: column; border:1px solid var(--border-color); margin-bottom:32px; border-top: 5px solid var(--border-color)">
          <div style="padding:16px; border-bottom: 1px solid var(--border-color)">
            <div style="font-size:var(--font-size-small); font-weight:bold">${e.name}</div>
            <span class="json-schema-description m-markdown ">${KP(He(e.description||""))}</span>
          </div>  
          <div style="display:flex; flex-direction: row; gap:16px;">
            <div class="json-schema-def" style="flex:1; padding:16px 0 16px 16px; ">
              <schema-tree
                .data = "${P_(e.schema,{})}"
                schema-expand-level = "${this.schemaExpandLevel}"
                schema-description-expanded = "${this.schemaDescriptionExpanded}"
                allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
                schema-hide-read-only = "false"
                schema-hide-write-only = "false"
              > </schema-tree>
            </div>
            <div class="json-schema-example-panel" style="width:400px; background-color: var(--input-bg); padding:16px 0 16px 16px; border-left: 1px dashed var(--border-color);">
              ${r.length>1?q`<select style="min-width:100px; max-width:100%" @change='${t=>this.onSelectExample(t,e)}'>
                    ${r.map((t=>q`
                      <option value="${t.exampleId}" ?selected=${t.exampleId===e.selectedExample}> 
                        ${t.exampleSummary.length>80?t.exampleId:t.exampleSummary}
                      </option>`))}
                  </select>`:q`<div style="font-size: var(--font-size-small);font-weight:700; margin:5px 0"> ${r[0].exampleSummary}</div>`}
              ${r.map((t=>q`
                <json-tree 
                  .data = "${t.exampleValue}"
                  data-example = "${t.exampleId}"
                  class = "example"
                  style = "margin-top:16px; display: ${t.exampleId===e.selectedExample?"flex":"none"}"
                ></json-tree>`))}
            </div>
          </div>
        </section>`}))}
    </div>
  `}function IR(e=!1){if(!this.resolvedSpec)return"";const t={bg1:SR(this.bgColor)?this.bgColor:"",fg1:SR(this.textColor)?this.textColor:"",headerColor:SR(this.headerColor)?this.headerColor:"",primaryColor:SR(this.primaryColor)?this.primaryColor:"",navBgColor:SR(this.navBgColor)?this.navBgColor:"",navTextColor:SR(this.navTextColor)?this.navTextColor:"",navHoverBgColor:SR(this.navHoverBgColor)?this.navHoverBgColor:"",navHoverTextColor:SR(this.navHoverTextColor)?this.navHoverTextColor:"",navAccentColor:SR(this.navAccentColor)?this.navAccentColor:"",navAccenttextColor:SR(this.navAccentTextColor)?this.navAccentTextColor:""};return this.resolvedSpec.specLoadError?e?q`
        ${"dark"===this.theme?AR.call(this,"dark",t):AR.call(this,"light",t)}
        <div style="display:flex; align-items:center; border:1px dashed var(--border-color); height:42px; padding:5px; font-size:var(--font-size-small); color:var(--red); font-family:var(--font-mono)"> ${this.resolvedSpec.info.description} </div>
      `:q`
      ${"dark"===this.theme?AR.call(this,"dark",t):AR.call(this,"light",t)}
      <!-- Header -->
      ${xR.call(this)}
      <h1> Header </h1>
      <main class="main-content regular-font" part="section-main-content">
        <slot></slot>
        <div style="margin:24px; text-align: center;">
          <h1 style="color: var(--red)"> ${this.resolvedSpec.info.title} </h1>
          <div style="font-family:var(--font-mono)"> ${this.resolvedSpec.info.description} </div>
        </div>
      </main>  
    `:this.resolvedSpec.isSpecLoading?q`
      ${"dark"===this.theme?AR.call(this,"dark",t):AR.call(this,"light",t)}
      <main class="main-content regular-font" part="section-main-content">
        <slot></slot>
        <div class="main-content-inner--${this.renderStyle}-mode">
          <div class="loader"></div>
        </div>
      </main>  
    `:q`
    ${"dark"===this.theme?AR.call(this,"dark",t):AR.call(this,"light",t)}

    <!-- Header -->
    ${"false"===this.showHeader?"":xR.call(this)}
    
    <div id='the-main-body' class="body ${this.cssClasses}" dir= ${this.pageDirection}>

      <!-- Side Nav -->
      ${TR.call(this)}

      <!-- Main Content -->
      <main class="main-content regular-font" part="section-main-content">
        <slot></slot>
        <div class="main-content-inner--${this.renderStyle}-mode">
          ${!0===this.loading?q`<div class="loader"></div>`:q`
              ${!0===this.loadFailed?q`<div style="text-align: center;margin: 16px;"> Unable to load the Spec</div>`:q`
                  <div class="operations-root" @click="${e=>{this.handleHref(e)}}">
                    ${jR.call(this)}
                  </div>
                `}`}
        </div>
        <slot name="footer"></slot>
      </main>
    </div>  
  `}customElements.define("oauth-receiver",CR);customElements.define("json-schema-viewer",class extends ae{constructor(){super(),this.isMini=!1,this.updateRoute="false",this.renderStyle="focused",this.showHeader="true",this.allowAdvancedSearch="false",this.selectedExampleForEachSchema={}}static get properties(){return{specUrl:{type:String,attribute:"spec-url"},schemaStyle:{type:String,attribute:"schema-style"},schemaExpandLevel:{type:Number,attribute:"schema-expand-level"},schemaDescriptionExpanded:{type:String,attribute:"schema-description-expanded"},allowSchemaDescriptionExpandToggle:{type:String,attribute:"allow-schema-description-expand-toggle"},showHeader:{type:String,attribute:"show-header"},showSideNav:{type:String,attribute:"show-side-nav"},showInfo:{type:String,attribute:"show-info"},allowSpecUrlLoad:{type:String,attribute:"allow-spec-url-load"},allowSpecFileLoad:{type:String,attribute:"allow-spec-file-load"},allowSpecFileDownload:{type:String,attribute:"allow-spec-file-download"},allowSearch:{type:String,attribute:"allow-search"},theme:{type:String},bgColor:{type:String,attribute:"bg-color"},textColor:{type:String,attribute:"text-color"},primaryColor:{type:String,attribute:"primary-color"},fontSize:{type:String,attribute:"font-size"},regularFont:{type:String,attribute:"regular-font"},monoFont:{type:String,attribute:"mono-font"},loadFonts:{type:String,attribute:"load-fonts"},loading:{type:Boolean}}}static get styles(){return[Ge,Ke,Je,Ze,Ye,Qe,Xe,et,tt,c`
      :host {
        display:flex;
        flex-direction: column;
        min-width:360px;
        width:100%;
        height:100%;
        margin:0;
        padding:0;
        overflow: hidden;
        letter-spacing:normal;
        color:var(--fg);
        background-color:var(--bg);
        font-family:var(--font-regular);
      }
      .body {
        display:flex;
        height:100%;
        width:100%;
        overflow:hidden;
      }
      .nav-bar {
        width: 230px;
        display:flex;
      }

      .main-content { 
        margin:0;
        padding: 16px; 
        display:block;
        flex:1;
        height:100%;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: thin;
        scrollbar-color: var(--border-color) transparent;
      }
      .main-content-inner--view-mode {
        padding: 0 8px;
      }
      .main-content::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      .main-content::-webkit-scrollbar-track {
        background:transparent;
      }
      .main-content::-webkit-scrollbar-thumb {
        background-color: var(--border-color);
      }
      .main-header {
        background-color:var(--header-bg);
        color:var(--header-fg);
        width:100%;
      }
      .header-title {
        font-size:calc(var(--font-size-regular) + 8px); 
        padding:0 8px;
      }
      input.header-input{
        background:var(--header-color-darker);
        color:var(--header-fg);
        border:1px solid var(--header-color-border);
        flex:1; 
        padding-right:24px;
        border-radius:3px;
      }
      input.header-input::placeholder {
        opacity:0.4;
      }
      .loader {
        margin: 16px auto 16px auto; 
        border: 4px solid var(--bg3);
        border-radius: 50%;
        border-top: 4px solid var(--primary-color);
        width: 36px;
        height: 36px;
        animation: spin 2s linear infinite;
      }
      @media only screen and (min-width: 768px) {
        .only-large-screen{
          display:block;
        }
        .only-large-screen-flex{
          display:flex;
        }
      }`]}connectedCallback(){super.connectedCallback();const e=this.parentElement;if(e&&(0===e.offsetWidth&&""===e.style.width&&(e.style.width="100vw"),0===e.offsetHeight&&""===e.style.height&&(e.style.height="100vh"),"BODY"===e.tagName&&(e.style.marginTop||(e.style.marginTop="0"),e.style.marginRight||(e.style.marginRight="0"),e.style.marginBottom||(e.style.marginBottom="0"),e.style.marginLeft||(e.style.marginLeft="0"))),"false"!==this.loadFonts){const e={family:"Open Sans",style:"normal",weight:"300",unicodeRange:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"},t=new FontFace("Open Sans","url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN_r8OUuhpKKSTjw.woff2) format('woff2')",e);e.weight="600";const r=new FontFace("Open Sans","url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UNirkOUuhpKKSTjw.woff2) format('woff2')",e);t.load().then((e=>{document.fonts.add(e)})),r.load().then((e=>{document.fonts.add(e)}))}this.renderStyle="focused",this.pathsExpanded="true"===this.pathsExpanded,this.showInfo&&"true, false,".includes(`${this.showInfo},`)||(this.showInfo="true"),this.showSideNav&&"true false".includes(this.showSideNav)||(this.showSideNav="true"),this.showHeader&&"true, false,".includes(`${this.showHeader},`)||(this.showHeader="true"),this.schemaStyle&&"tree, table,".includes(`${this.schemaStyle},`)||(this.schemaStyle="tree"),this.theme&&"light, dark,".includes(`${this.theme},`)||(this.theme=window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"),this.allowSearch&&"true, false,".includes(`${this.allowSearch},`)||(this.allowSearch="true"),(!this.schemaExpandLevel||this.schemaExpandLevel<1)&&(this.schemaExpandLevel=99999),this.schemaDescriptionExpanded&&"true, false,".includes(`${this.schemaDescriptionExpanded},`)||(this.schemaDescriptionExpanded="false"),this.fontSize&&"default, large, largest,".includes(`${this.fontSize},`)||(this.fontSize="default"),this.matchType&&"includes regex".includes(this.matchType)||(this.matchType="includes"),this.allowSchemaDescriptionExpandToggle&&"true, false,".includes(`${this.allowSchemaDescriptionExpandToggle},`)||(this.allowSchemaDescriptionExpandToggle="true"),He.setOptions({highlight:(e,t)=>("curl"===t&&(t="bash"),Ve().languages[t]?Ve().highlight(e,Ve().languages[t],t):e)})}render(){return IR.call(this,!0,!1,!1,this.pathsExpanded)}attributeChangedCallback(e,t,r){"spec-url"===e&&t!==r&&window.setTimeout((async()=>{await this.loadSpec(r)}),0),super.attributeChangedCallback(e,t,r)}onSpecUrlChange(){this.setAttribute("spec-url",this.shadowRoot.getElementById("spec-url").value)}onSearchChange(e){this.matchPaths=e.target.value}async loadSpec(e){if(e)try{this.resolvedSpec={specLoadError:!1,isSpecLoading:!0,tags:[]},this.loading=!0,this.loadFailed=!1,this.requestUpdate();const t=await UP.call(this,e,"true"===this.generateMissingTags,"true"===this.sortTags,this.getAttribute("sort-endpoints-by"));this.loading=!1,this.afterSpecParsedAndValidated(t)}catch(e){this.loading=!1,this.loadFailed=!0,this.resolvedSpec=null,console.error(`RapiDoc: Unable to resolve the API spec..  ${e.message}`)}}async afterSpecParsedAndValidated(e){this.resolvedSpec=e;const t=new CustomEvent("spec-loaded",{detail:e});this.dispatchEvent(t)}handleHref(e){if("a"===e.target.tagName.toLowerCase()&&e.target.getAttribute("href").startsWith("#")){const t=this.shadowRoot.getElementById(e.target.getAttribute("href").replace("#",""));t&&t.scrollIntoView({behavior:"auto",block:"start"})}}onSelectExample(e){[...e.target.closest(".json-schema-example-panel").querySelectorAll(".example")].forEach((t=>{t.style.display=t.dataset.example===e.target.value?"flex":"none"}))}async scrollToEventTarget(e){const t=e.currentTarget;if(!t.dataset.contentId)return;const r=this.shadowRoot.getElementById(t.dataset.contentId);r&&r.scrollIntoView({behavior:"auto",block:"start"})}})},742:(e,t)=>{"use strict";t.byteLength=function(e){var t=l(e),r=t[0],n=t[1];return 3*(r+n)/4-n},t.toByteArray=function(e){var t,r,a=l(e),i=a[0],s=a[1],c=new o(function(e,t,r){return 3*(t+r)/4-r}(0,i,s)),p=0,d=s>0?i-4:i;for(r=0;r<d;r+=4)t=n[e.charCodeAt(r)]<<18|n[e.charCodeAt(r+1)]<<12|n[e.charCodeAt(r+2)]<<6|n[e.charCodeAt(r+3)],c[p++]=t>>16&255,c[p++]=t>>8&255,c[p++]=255&t;2===s&&(t=n[e.charCodeAt(r)]<<2|n[e.charCodeAt(r+1)]>>4,c[p++]=255&t);1===s&&(t=n[e.charCodeAt(r)]<<10|n[e.charCodeAt(r+1)]<<4|n[e.charCodeAt(r+2)]>>2,c[p++]=t>>8&255,c[p++]=255&t);return c},t.fromByteArray=function(e){for(var t,n=e.length,o=n%3,a=[],i=16383,s=0,l=n-o;s<l;s+=i)a.push(c(e,s,s+i>l?l:s+i));1===o?(t=e[n-1],a.push(r[t>>2]+r[t<<4&63]+"==")):2===o&&(t=(e[n-2]<<8)+e[n-1],a.push(r[t>>10]+r[t>>4&63]+r[t<<2&63]+"="));return a.join("")};for(var r=[],n=[],o="undefined"!=typeof Uint8Array?Uint8Array:Array,a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",i=0,s=a.length;i<s;++i)r[i]=a[i],n[a.charCodeAt(i)]=i;function l(e){var t=e.length;if(t%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var r=e.indexOf("=");return-1===r&&(r=t),[r,r===t?0:4-r%4]}function c(e,t,n){for(var o,a,i=[],s=t;s<n;s+=3)o=(e[s]<<16&16711680)+(e[s+1]<<8&65280)+(255&e[s+2]),i.push(r[(a=o)>>18&63]+r[a>>12&63]+r[a>>6&63]+r[63&a]);return i.join("")}n["-".charCodeAt(0)]=62,n["_".charCodeAt(0)]=63},764:(e,t,r)=>{"use strict";const n=r(742),o=r(645),a="function"==typeof Symbol&&"function"==typeof Symbol.for?Symbol.for("nodejs.util.inspect.custom"):null;t.lW=l,t.h2=50;const i=2147483647;function s(e){if(e>i)throw new RangeError('The value "'+e+'" is invalid for option "size"');const t=new Uint8Array(e);return Object.setPrototypeOf(t,l.prototype),t}function l(e,t,r){if("number"==typeof e){if("string"==typeof t)throw new TypeError('The "string" argument must be of type string. Received type number');return d(e)}return c(e,t,r)}function c(e,t,r){if("string"==typeof e)return function(e,t){"string"==typeof t&&""!==t||(t="utf8");if(!l.isEncoding(t))throw new TypeError("Unknown encoding: "+t);const r=0|m(e,t);let n=s(r);const o=n.write(e,t);o!==r&&(n=n.slice(0,o));return n}(e,t);if(ArrayBuffer.isView(e))return function(e){if(J(e,Uint8Array)){const t=new Uint8Array(e);return h(t.buffer,t.byteOffset,t.byteLength)}return u(e)}(e);if(null==e)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e);if(J(e,ArrayBuffer)||e&&J(e.buffer,ArrayBuffer))return h(e,t,r);if("undefined"!=typeof SharedArrayBuffer&&(J(e,SharedArrayBuffer)||e&&J(e.buffer,SharedArrayBuffer)))return h(e,t,r);if("number"==typeof e)throw new TypeError('The "value" argument must not be of type number. Received type number');const n=e.valueOf&&e.valueOf();if(null!=n&&n!==e)return l.from(n,t,r);const o=function(e){if(l.isBuffer(e)){const t=0|f(e.length),r=s(t);return 0===r.length||e.copy(r,0,0,t),r}if(void 0!==e.length)return"number"!=typeof e.length||Z(e.length)?s(0):u(e);if("Buffer"===e.type&&Array.isArray(e.data))return u(e.data)}(e);if(o)return o;if("undefined"!=typeof Symbol&&null!=Symbol.toPrimitive&&"function"==typeof e[Symbol.toPrimitive])return l.from(e[Symbol.toPrimitive]("string"),t,r);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e)}function p(e){if("number"!=typeof e)throw new TypeError('"size" argument must be of type number');if(e<0)throw new RangeError('The value "'+e+'" is invalid for option "size"')}function d(e){return p(e),s(e<0?0:0|f(e))}function u(e){const t=e.length<0?0:0|f(e.length),r=s(t);for(let n=0;n<t;n+=1)r[n]=255&e[n];return r}function h(e,t,r){if(t<0||e.byteLength<t)throw new RangeError('"offset" is outside of buffer bounds');if(e.byteLength<t+(r||0))throw new RangeError('"length" is outside of buffer bounds');let n;return n=void 0===t&&void 0===r?new Uint8Array(e):void 0===r?new Uint8Array(e,t):new Uint8Array(e,t,r),Object.setPrototypeOf(n,l.prototype),n}function f(e){if(e>=i)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+i.toString(16)+" bytes");return 0|e}function m(e,t){if(l.isBuffer(e))return e.length;if(ArrayBuffer.isView(e)||J(e,ArrayBuffer))return e.byteLength;if("string"!=typeof e)throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof e);const r=e.length,n=arguments.length>2&&!0===arguments[2];if(!n&&0===r)return 0;let o=!1;for(;;)switch(t){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":return V(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return G(e).length;default:if(o)return n?-1:V(e).length;t=(""+t).toLowerCase(),o=!0}}function g(e,t,r){let n=!1;if((void 0===t||t<0)&&(t=0),t>this.length)return"";if((void 0===r||r>this.length)&&(r=this.length),r<=0)return"";if((r>>>=0)<=(t>>>=0))return"";for(e||(e="utf8");;)switch(e){case"hex":return j(this,t,r);case"utf8":case"utf-8":return E(this,t,r);case"ascii":return C(this,t,r);case"latin1":case"binary":return T(this,t,r);case"base64":return A(this,t,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return I(this,t,r);default:if(n)throw new TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),n=!0}}function y(e,t,r){const n=e[t];e[t]=e[r],e[r]=n}function v(e,t,r,n,o){if(0===e.length)return-1;if("string"==typeof r?(n=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),Z(r=+r)&&(r=o?0:e.length-1),r<0&&(r=e.length+r),r>=e.length){if(o)return-1;r=e.length-1}else if(r<0){if(!o)return-1;r=0}if("string"==typeof t&&(t=l.from(t,n)),l.isBuffer(t))return 0===t.length?-1:b(e,t,r,n,o);if("number"==typeof t)return t&=255,"function"==typeof Uint8Array.prototype.indexOf?o?Uint8Array.prototype.indexOf.call(e,t,r):Uint8Array.prototype.lastIndexOf.call(e,t,r):b(e,[t],r,n,o);throw new TypeError("val must be string, number or Buffer")}function b(e,t,r,n,o){let a,i=1,s=e.length,l=t.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(e.length<2||t.length<2)return-1;i=2,s/=2,l/=2,r/=2}function c(e,t){return 1===i?e[t]:e.readUInt16BE(t*i)}if(o){let n=-1;for(a=r;a<s;a++)if(c(e,a)===c(t,-1===n?0:a-n)){if(-1===n&&(n=a),a-n+1===l)return n*i}else-1!==n&&(a-=a-n),n=-1}else for(r+l>s&&(r=s-l),a=r;a>=0;a--){let r=!0;for(let n=0;n<l;n++)if(c(e,a+n)!==c(t,n)){r=!1;break}if(r)return a}return-1}function x(e,t,r,n){r=Number(r)||0;const o=e.length-r;n?(n=Number(n))>o&&(n=o):n=o;const a=t.length;let i;for(n>a/2&&(n=a/2),i=0;i<n;++i){const n=parseInt(t.substr(2*i,2),16);if(Z(n))return i;e[r+i]=n}return i}function w(e,t,r,n){return K(V(t,e.length-r),e,r,n)}function k(e,t,r,n){return K(function(e){const t=[];for(let r=0;r<e.length;++r)t.push(255&e.charCodeAt(r));return t}(t),e,r,n)}function $(e,t,r,n){return K(G(t),e,r,n)}function S(e,t,r,n){return K(function(e,t){let r,n,o;const a=[];for(let i=0;i<e.length&&!((t-=2)<0);++i)r=e.charCodeAt(i),n=r>>8,o=r%256,a.push(o),a.push(n);return a}(t,e.length-r),e,r,n)}function A(e,t,r){return 0===t&&r===e.length?n.fromByteArray(e):n.fromByteArray(e.slice(t,r))}function E(e,t,r){r=Math.min(e.length,r);const n=[];let o=t;for(;o<r;){const t=e[o];let a=null,i=t>239?4:t>223?3:t>191?2:1;if(o+i<=r){let r,n,s,l;switch(i){case 1:t<128&&(a=t);break;case 2:r=e[o+1],128==(192&r)&&(l=(31&t)<<6|63&r,l>127&&(a=l));break;case 3:r=e[o+1],n=e[o+2],128==(192&r)&&128==(192&n)&&(l=(15&t)<<12|(63&r)<<6|63&n,l>2047&&(l<55296||l>57343)&&(a=l));break;case 4:r=e[o+1],n=e[o+2],s=e[o+3],128==(192&r)&&128==(192&n)&&128==(192&s)&&(l=(15&t)<<18|(63&r)<<12|(63&n)<<6|63&s,l>65535&&l<1114112&&(a=l))}}null===a?(a=65533,i=1):a>65535&&(a-=65536,n.push(a>>>10&1023|55296),a=56320|1023&a),n.push(a),o+=i}return function(e){const t=e.length;if(t<=O)return String.fromCharCode.apply(String,e);let r="",n=0;for(;n<t;)r+=String.fromCharCode.apply(String,e.slice(n,n+=O));return r}(n)}l.TYPED_ARRAY_SUPPORT=function(){try{const e=new Uint8Array(1),t={foo:function(){return 42}};return Object.setPrototypeOf(t,Uint8Array.prototype),Object.setPrototypeOf(e,t),42===e.foo()}catch(e){return!1}}(),l.TYPED_ARRAY_SUPPORT||"undefined"==typeof console||"function"!=typeof console.error||console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),Object.defineProperty(l.prototype,"parent",{enumerable:!0,get:function(){if(l.isBuffer(this))return this.buffer}}),Object.defineProperty(l.prototype,"offset",{enumerable:!0,get:function(){if(l.isBuffer(this))return this.byteOffset}}),l.poolSize=8192,l.from=function(e,t,r){return c(e,t,r)},Object.setPrototypeOf(l.prototype,Uint8Array.prototype),Object.setPrototypeOf(l,Uint8Array),l.alloc=function(e,t,r){return function(e,t,r){return p(e),e<=0?s(e):void 0!==t?"string"==typeof r?s(e).fill(t,r):s(e).fill(t):s(e)}(e,t,r)},l.allocUnsafe=function(e){return d(e)},l.allocUnsafeSlow=function(e){return d(e)},l.isBuffer=function(e){return null!=e&&!0===e._isBuffer&&e!==l.prototype},l.compare=function(e,t){if(J(e,Uint8Array)&&(e=l.from(e,e.offset,e.byteLength)),J(t,Uint8Array)&&(t=l.from(t,t.offset,t.byteLength)),!l.isBuffer(e)||!l.isBuffer(t))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(e===t)return 0;let r=e.length,n=t.length;for(let o=0,a=Math.min(r,n);o<a;++o)if(e[o]!==t[o]){r=e[o],n=t[o];break}return r<n?-1:n<r?1:0},l.isEncoding=function(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},l.concat=function(e,t){if(!Array.isArray(e))throw new TypeError('"list" argument must be an Array of Buffers');if(0===e.length)return l.alloc(0);let r;if(void 0===t)for(t=0,r=0;r<e.length;++r)t+=e[r].length;const n=l.allocUnsafe(t);let o=0;for(r=0;r<e.length;++r){let t=e[r];if(J(t,Uint8Array))o+t.length>n.length?(l.isBuffer(t)||(t=l.from(t)),t.copy(n,o)):Uint8Array.prototype.set.call(n,t,o);else{if(!l.isBuffer(t))throw new TypeError('"list" argument must be an Array of Buffers');t.copy(n,o)}o+=t.length}return n},l.byteLength=m,l.prototype._isBuffer=!0,l.prototype.swap16=function(){const e=this.length;if(e%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(let t=0;t<e;t+=2)y(this,t,t+1);return this},l.prototype.swap32=function(){const e=this.length;if(e%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(let t=0;t<e;t+=4)y(this,t,t+3),y(this,t+1,t+2);return this},l.prototype.swap64=function(){const e=this.length;if(e%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(let t=0;t<e;t+=8)y(this,t,t+7),y(this,t+1,t+6),y(this,t+2,t+5),y(this,t+3,t+4);return this},l.prototype.toString=function(){const e=this.length;return 0===e?"":0===arguments.length?E(this,0,e):g.apply(this,arguments)},l.prototype.toLocaleString=l.prototype.toString,l.prototype.equals=function(e){if(!l.isBuffer(e))throw new TypeError("Argument must be a Buffer");return this===e||0===l.compare(this,e)},l.prototype.inspect=function(){let e="";const r=t.h2;return e=this.toString("hex",0,r).replace(/(.{2})/g,"$1 ").trim(),this.length>r&&(e+=" ... "),"<Buffer "+e+">"},a&&(l.prototype[a]=l.prototype.inspect),l.prototype.compare=function(e,t,r,n,o){if(J(e,Uint8Array)&&(e=l.from(e,e.offset,e.byteLength)),!l.isBuffer(e))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof e);if(void 0===t&&(t=0),void 0===r&&(r=e?e.length:0),void 0===n&&(n=0),void 0===o&&(o=this.length),t<0||r>e.length||n<0||o>this.length)throw new RangeError("out of range index");if(n>=o&&t>=r)return 0;if(n>=o)return-1;if(t>=r)return 1;if(this===e)return 0;let a=(o>>>=0)-(n>>>=0),i=(r>>>=0)-(t>>>=0);const s=Math.min(a,i),c=this.slice(n,o),p=e.slice(t,r);for(let e=0;e<s;++e)if(c[e]!==p[e]){a=c[e],i=p[e];break}return a<i?-1:i<a?1:0},l.prototype.includes=function(e,t,r){return-1!==this.indexOf(e,t,r)},l.prototype.indexOf=function(e,t,r){return v(this,e,t,r,!0)},l.prototype.lastIndexOf=function(e,t,r){return v(this,e,t,r,!1)},l.prototype.write=function(e,t,r,n){if(void 0===t)n="utf8",r=this.length,t=0;else if(void 0===r&&"string"==typeof t)n=t,r=this.length,t=0;else{if(!isFinite(t))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");t>>>=0,isFinite(r)?(r>>>=0,void 0===n&&(n="utf8")):(n=r,r=void 0)}const o=this.length-t;if((void 0===r||r>o)&&(r=o),e.length>0&&(r<0||t<0)||t>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");let a=!1;for(;;)switch(n){case"hex":return x(this,e,t,r);case"utf8":case"utf-8":return w(this,e,t,r);case"ascii":case"latin1":case"binary":return k(this,e,t,r);case"base64":return $(this,e,t,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return S(this,e,t,r);default:if(a)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),a=!0}},l.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};const O=4096;function C(e,t,r){let n="";r=Math.min(e.length,r);for(let o=t;o<r;++o)n+=String.fromCharCode(127&e[o]);return n}function T(e,t,r){let n="";r=Math.min(e.length,r);for(let o=t;o<r;++o)n+=String.fromCharCode(e[o]);return n}function j(e,t,r){const n=e.length;(!t||t<0)&&(t=0),(!r||r<0||r>n)&&(r=n);let o="";for(let n=t;n<r;++n)o+=Y[e[n]];return o}function I(e,t,r){const n=e.slice(t,r);let o="";for(let e=0;e<n.length-1;e+=2)o+=String.fromCharCode(n[e]+256*n[e+1]);return o}function P(e,t,r){if(e%1!=0||e<0)throw new RangeError("offset is not uint");if(e+t>r)throw new RangeError("Trying to access beyond buffer length")}function _(e,t,r,n,o,a){if(!l.isBuffer(e))throw new TypeError('"buffer" argument must be a Buffer instance');if(t>o||t<a)throw new RangeError('"value" argument is out of bounds');if(r+n>e.length)throw new RangeError("Index out of range")}function R(e,t,r,n,o){U(t,n,o,e,r,7);let a=Number(t&BigInt(4294967295));e[r++]=a,a>>=8,e[r++]=a,a>>=8,e[r++]=a,a>>=8,e[r++]=a;let i=Number(t>>BigInt(32)&BigInt(4294967295));return e[r++]=i,i>>=8,e[r++]=i,i>>=8,e[r++]=i,i>>=8,e[r++]=i,r}function L(e,t,r,n,o){U(t,n,o,e,r,7);let a=Number(t&BigInt(4294967295));e[r+7]=a,a>>=8,e[r+6]=a,a>>=8,e[r+5]=a,a>>=8,e[r+4]=a;let i=Number(t>>BigInt(32)&BigInt(4294967295));return e[r+3]=i,i>>=8,e[r+2]=i,i>>=8,e[r+1]=i,i>>=8,e[r]=i,r+8}function B(e,t,r,n,o,a){if(r+n>e.length)throw new RangeError("Index out of range");if(r<0)throw new RangeError("Index out of range")}function F(e,t,r,n,a){return t=+t,r>>>=0,a||B(e,0,r,4),o.write(e,t,r,n,23,4),r+4}function D(e,t,r,n,a){return t=+t,r>>>=0,a||B(e,0,r,8),o.write(e,t,r,n,52,8),r+8}l.prototype.slice=function(e,t){const r=this.length;(e=~~e)<0?(e+=r)<0&&(e=0):e>r&&(e=r),(t=void 0===t?r:~~t)<0?(t+=r)<0&&(t=0):t>r&&(t=r),t<e&&(t=e);const n=this.subarray(e,t);return Object.setPrototypeOf(n,l.prototype),n},l.prototype.readUintLE=l.prototype.readUIntLE=function(e,t,r){e>>>=0,t>>>=0,r||P(e,t,this.length);let n=this[e],o=1,a=0;for(;++a<t&&(o*=256);)n+=this[e+a]*o;return n},l.prototype.readUintBE=l.prototype.readUIntBE=function(e,t,r){e>>>=0,t>>>=0,r||P(e,t,this.length);let n=this[e+--t],o=1;for(;t>0&&(o*=256);)n+=this[e+--t]*o;return n},l.prototype.readUint8=l.prototype.readUInt8=function(e,t){return e>>>=0,t||P(e,1,this.length),this[e]},l.prototype.readUint16LE=l.prototype.readUInt16LE=function(e,t){return e>>>=0,t||P(e,2,this.length),this[e]|this[e+1]<<8},l.prototype.readUint16BE=l.prototype.readUInt16BE=function(e,t){return e>>>=0,t||P(e,2,this.length),this[e]<<8|this[e+1]},l.prototype.readUint32LE=l.prototype.readUInt32LE=function(e,t){return e>>>=0,t||P(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+16777216*this[e+3]},l.prototype.readUint32BE=l.prototype.readUInt32BE=function(e,t){return e>>>=0,t||P(e,4,this.length),16777216*this[e]+(this[e+1]<<16|this[e+2]<<8|this[e+3])},l.prototype.readBigUInt64LE=Q((function(e){M(e>>>=0,"offset");const t=this[e],r=this[e+7];void 0!==t&&void 0!==r||H(e,this.length-8);const n=t+256*this[++e]+65536*this[++e]+this[++e]*2**24,o=this[++e]+256*this[++e]+65536*this[++e]+r*2**24;return BigInt(n)+(BigInt(o)<<BigInt(32))})),l.prototype.readBigUInt64BE=Q((function(e){M(e>>>=0,"offset");const t=this[e],r=this[e+7];void 0!==t&&void 0!==r||H(e,this.length-8);const n=t*2**24+65536*this[++e]+256*this[++e]+this[++e],o=this[++e]*2**24+65536*this[++e]+256*this[++e]+r;return(BigInt(n)<<BigInt(32))+BigInt(o)})),l.prototype.readIntLE=function(e,t,r){e>>>=0,t>>>=0,r||P(e,t,this.length);let n=this[e],o=1,a=0;for(;++a<t&&(o*=256);)n+=this[e+a]*o;return o*=128,n>=o&&(n-=Math.pow(2,8*t)),n},l.prototype.readIntBE=function(e,t,r){e>>>=0,t>>>=0,r||P(e,t,this.length);let n=t,o=1,a=this[e+--n];for(;n>0&&(o*=256);)a+=this[e+--n]*o;return o*=128,a>=o&&(a-=Math.pow(2,8*t)),a},l.prototype.readInt8=function(e,t){return e>>>=0,t||P(e,1,this.length),128&this[e]?-1*(255-this[e]+1):this[e]},l.prototype.readInt16LE=function(e,t){e>>>=0,t||P(e,2,this.length);const r=this[e]|this[e+1]<<8;return 32768&r?4294901760|r:r},l.prototype.readInt16BE=function(e,t){e>>>=0,t||P(e,2,this.length);const r=this[e+1]|this[e]<<8;return 32768&r?4294901760|r:r},l.prototype.readInt32LE=function(e,t){return e>>>=0,t||P(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24},l.prototype.readInt32BE=function(e,t){return e>>>=0,t||P(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]},l.prototype.readBigInt64LE=Q((function(e){M(e>>>=0,"offset");const t=this[e],r=this[e+7];void 0!==t&&void 0!==r||H(e,this.length-8);const n=this[e+4]+256*this[e+5]+65536*this[e+6]+(r<<24);return(BigInt(n)<<BigInt(32))+BigInt(t+256*this[++e]+65536*this[++e]+this[++e]*2**24)})),l.prototype.readBigInt64BE=Q((function(e){M(e>>>=0,"offset");const t=this[e],r=this[e+7];void 0!==t&&void 0!==r||H(e,this.length-8);const n=(t<<24)+65536*this[++e]+256*this[++e]+this[++e];return(BigInt(n)<<BigInt(32))+BigInt(this[++e]*2**24+65536*this[++e]+256*this[++e]+r)})),l.prototype.readFloatLE=function(e,t){return e>>>=0,t||P(e,4,this.length),o.read(this,e,!0,23,4)},l.prototype.readFloatBE=function(e,t){return e>>>=0,t||P(e,4,this.length),o.read(this,e,!1,23,4)},l.prototype.readDoubleLE=function(e,t){return e>>>=0,t||P(e,8,this.length),o.read(this,e,!0,52,8)},l.prototype.readDoubleBE=function(e,t){return e>>>=0,t||P(e,8,this.length),o.read(this,e,!1,52,8)},l.prototype.writeUintLE=l.prototype.writeUIntLE=function(e,t,r,n){if(e=+e,t>>>=0,r>>>=0,!n){_(this,e,t,r,Math.pow(2,8*r)-1,0)}let o=1,a=0;for(this[t]=255&e;++a<r&&(o*=256);)this[t+a]=e/o&255;return t+r},l.prototype.writeUintBE=l.prototype.writeUIntBE=function(e,t,r,n){if(e=+e,t>>>=0,r>>>=0,!n){_(this,e,t,r,Math.pow(2,8*r)-1,0)}let o=r-1,a=1;for(this[t+o]=255&e;--o>=0&&(a*=256);)this[t+o]=e/a&255;return t+r},l.prototype.writeUint8=l.prototype.writeUInt8=function(e,t,r){return e=+e,t>>>=0,r||_(this,e,t,1,255,0),this[t]=255&e,t+1},l.prototype.writeUint16LE=l.prototype.writeUInt16LE=function(e,t,r){return e=+e,t>>>=0,r||_(this,e,t,2,65535,0),this[t]=255&e,this[t+1]=e>>>8,t+2},l.prototype.writeUint16BE=l.prototype.writeUInt16BE=function(e,t,r){return e=+e,t>>>=0,r||_(this,e,t,2,65535,0),this[t]=e>>>8,this[t+1]=255&e,t+2},l.prototype.writeUint32LE=l.prototype.writeUInt32LE=function(e,t,r){return e=+e,t>>>=0,r||_(this,e,t,4,4294967295,0),this[t+3]=e>>>24,this[t+2]=e>>>16,this[t+1]=e>>>8,this[t]=255&e,t+4},l.prototype.writeUint32BE=l.prototype.writeUInt32BE=function(e,t,r){return e=+e,t>>>=0,r||_(this,e,t,4,4294967295,0),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},l.prototype.writeBigUInt64LE=Q((function(e,t=0){return R(this,e,t,BigInt(0),BigInt("0xffffffffffffffff"))})),l.prototype.writeBigUInt64BE=Q((function(e,t=0){return L(this,e,t,BigInt(0),BigInt("0xffffffffffffffff"))})),l.prototype.writeIntLE=function(e,t,r,n){if(e=+e,t>>>=0,!n){const n=Math.pow(2,8*r-1);_(this,e,t,r,n-1,-n)}let o=0,a=1,i=0;for(this[t]=255&e;++o<r&&(a*=256);)e<0&&0===i&&0!==this[t+o-1]&&(i=1),this[t+o]=(e/a>>0)-i&255;return t+r},l.prototype.writeIntBE=function(e,t,r,n){if(e=+e,t>>>=0,!n){const n=Math.pow(2,8*r-1);_(this,e,t,r,n-1,-n)}let o=r-1,a=1,i=0;for(this[t+o]=255&e;--o>=0&&(a*=256);)e<0&&0===i&&0!==this[t+o+1]&&(i=1),this[t+o]=(e/a>>0)-i&255;return t+r},l.prototype.writeInt8=function(e,t,r){return e=+e,t>>>=0,r||_(this,e,t,1,127,-128),e<0&&(e=255+e+1),this[t]=255&e,t+1},l.prototype.writeInt16LE=function(e,t,r){return e=+e,t>>>=0,r||_(this,e,t,2,32767,-32768),this[t]=255&e,this[t+1]=e>>>8,t+2},l.prototype.writeInt16BE=function(e,t,r){return e=+e,t>>>=0,r||_(this,e,t,2,32767,-32768),this[t]=e>>>8,this[t+1]=255&e,t+2},l.prototype.writeInt32LE=function(e,t,r){return e=+e,t>>>=0,r||_(this,e,t,4,2147483647,-2147483648),this[t]=255&e,this[t+1]=e>>>8,this[t+2]=e>>>16,this[t+3]=e>>>24,t+4},l.prototype.writeInt32BE=function(e,t,r){return e=+e,t>>>=0,r||_(this,e,t,4,2147483647,-2147483648),e<0&&(e=4294967295+e+1),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},l.prototype.writeBigInt64LE=Q((function(e,t=0){return R(this,e,t,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))})),l.prototype.writeBigInt64BE=Q((function(e,t=0){return L(this,e,t,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))})),l.prototype.writeFloatLE=function(e,t,r){return F(this,e,t,!0,r)},l.prototype.writeFloatBE=function(e,t,r){return F(this,e,t,!1,r)},l.prototype.writeDoubleLE=function(e,t,r){return D(this,e,t,!0,r)},l.prototype.writeDoubleBE=function(e,t,r){return D(this,e,t,!1,r)},l.prototype.copy=function(e,t,r,n){if(!l.isBuffer(e))throw new TypeError("argument should be a Buffer");if(r||(r=0),n||0===n||(n=this.length),t>=e.length&&(t=e.length),t||(t=0),n>0&&n<r&&(n=r),n===r)return 0;if(0===e.length||0===this.length)return 0;if(t<0)throw new RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw new RangeError("Index out of range");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),e.length-t<n-r&&(n=e.length-t+r);const o=n-r;return this===e&&"function"==typeof Uint8Array.prototype.copyWithin?this.copyWithin(t,r,n):Uint8Array.prototype.set.call(e,this.subarray(r,n),t),o},l.prototype.fill=function(e,t,r,n){if("string"==typeof e){if("string"==typeof t?(n=t,t=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string");if("string"==typeof n&&!l.isEncoding(n))throw new TypeError("Unknown encoding: "+n);if(1===e.length){const t=e.charCodeAt(0);("utf8"===n&&t<128||"latin1"===n)&&(e=t)}}else"number"==typeof e?e&=255:"boolean"==typeof e&&(e=Number(e));if(t<0||this.length<t||this.length<r)throw new RangeError("Out of range index");if(r<=t)return this;let o;if(t>>>=0,r=void 0===r?this.length:r>>>0,e||(e=0),"number"==typeof e)for(o=t;o<r;++o)this[o]=e;else{const a=l.isBuffer(e)?e:l.from(e,n),i=a.length;if(0===i)throw new TypeError('The value "'+e+'" is invalid for argument "value"');for(o=0;o<r-t;++o)this[o+t]=a[o%i]}return this};const z={};function q(e,t,r){z[e]=class extends r{constructor(){super(),Object.defineProperty(this,"message",{value:t.apply(this,arguments),writable:!0,configurable:!0}),this.name=`${this.name} [${e}]`,this.stack,delete this.name}get code(){return e}set code(e){Object.defineProperty(this,"code",{configurable:!0,enumerable:!0,value:e,writable:!0})}toString(){return`${this.name} [${e}]: ${this.message}`}}}function N(e){let t="",r=e.length;const n="-"===e[0]?1:0;for(;r>=n+4;r-=3)t=`_${e.slice(r-3,r)}${t}`;return`${e.slice(0,r)}${t}`}function U(e,t,r,n,o,a){if(e>r||e<t){const n="bigint"==typeof t?"n":"";let o;throw o=a>3?0===t||t===BigInt(0)?`>= 0${n} and < 2${n} ** ${8*(a+1)}${n}`:`>= -(2${n} ** ${8*(a+1)-1}${n}) and < 2 ** ${8*(a+1)-1}${n}`:`>= ${t}${n} and <= ${r}${n}`,new z.ERR_OUT_OF_RANGE("value",o,e)}!function(e,t,r){M(t,"offset"),void 0!==e[t]&&void 0!==e[t+r]||H(t,e.length-(r+1))}(n,o,a)}function M(e,t){if("number"!=typeof e)throw new z.ERR_INVALID_ARG_TYPE(t,"number",e)}function H(e,t,r){if(Math.floor(e)!==e)throw M(e,r),new z.ERR_OUT_OF_RANGE(r||"offset","an integer",e);if(t<0)throw new z.ERR_BUFFER_OUT_OF_BOUNDS;throw new z.ERR_OUT_OF_RANGE(r||"offset",`>= ${r?1:0} and <= ${t}`,e)}q("ERR_BUFFER_OUT_OF_BOUNDS",(function(e){return e?`${e} is outside of buffer bounds`:"Attempt to access memory outside buffer bounds"}),RangeError),q("ERR_INVALID_ARG_TYPE",(function(e,t){return`The "${e}" argument must be of type number. Received type ${typeof t}`}),TypeError),q("ERR_OUT_OF_RANGE",(function(e,t,r){let n=`The value of "${e}" is out of range.`,o=r;return Number.isInteger(r)&&Math.abs(r)>2**32?o=N(String(r)):"bigint"==typeof r&&(o=String(r),(r>BigInt(2)**BigInt(32)||r<-(BigInt(2)**BigInt(32)))&&(o=N(o)),o+="n"),n+=` It must be ${t}. Received ${o}`,n}),RangeError);const W=/[^+/0-9A-Za-z-_]/g;function V(e,t){let r;t=t||1/0;const n=e.length;let o=null;const a=[];for(let i=0;i<n;++i){if(r=e.charCodeAt(i),r>55295&&r<57344){if(!o){if(r>56319){(t-=3)>-1&&a.push(239,191,189);continue}if(i+1===n){(t-=3)>-1&&a.push(239,191,189);continue}o=r;continue}if(r<56320){(t-=3)>-1&&a.push(239,191,189),o=r;continue}r=65536+(o-55296<<10|r-56320)}else o&&(t-=3)>-1&&a.push(239,191,189);if(o=null,r<128){if((t-=1)<0)break;a.push(r)}else if(r<2048){if((t-=2)<0)break;a.push(r>>6|192,63&r|128)}else if(r<65536){if((t-=3)<0)break;a.push(r>>12|224,r>>6&63|128,63&r|128)}else{if(!(r<1114112))throw new Error("Invalid code point");if((t-=4)<0)break;a.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}}return a}function G(e){return n.toByteArray(function(e){if((e=(e=e.split("=")[0]).trim().replace(W,"")).length<2)return"";for(;e.length%4!=0;)e+="=";return e}(e))}function K(e,t,r,n){let o;for(o=0;o<n&&!(o+r>=t.length||o>=e.length);++o)t[o+r]=e[o];return o}function J(e,t){return e instanceof t||null!=e&&null!=e.constructor&&null!=e.constructor.name&&e.constructor.name===t.name}function Z(e){return e!=e}const Y=function(){const e="0123456789abcdef",t=new Array(256);for(let r=0;r<16;++r){const n=16*r;for(let o=0;o<16;++o)t[n+o]=e[r]+e[o]}return t}();function Q(e){return"undefined"==typeof BigInt?X:e}function X(){throw new Error("BigInt not supported")}},645:(e,t)=>{t.read=function(e,t,r,n,o){var a,i,s=8*o-n-1,l=(1<<s)-1,c=l>>1,p=-7,d=r?o-1:0,u=r?-1:1,h=e[t+d];for(d+=u,a=h&(1<<-p)-1,h>>=-p,p+=s;p>0;a=256*a+e[t+d],d+=u,p-=8);for(i=a&(1<<-p)-1,a>>=-p,p+=n;p>0;i=256*i+e[t+d],d+=u,p-=8);if(0===a)a=1-c;else{if(a===l)return i?NaN:1/0*(h?-1:1);i+=Math.pow(2,n),a-=c}return(h?-1:1)*i*Math.pow(2,a-n)},t.write=function(e,t,r,n,o,a){var i,s,l,c=8*a-o-1,p=(1<<c)-1,d=p>>1,u=23===o?Math.pow(2,-24)-Math.pow(2,-77):0,h=n?0:a-1,f=n?1:-1,m=t<0||0===t&&1/t<0?1:0;for(t=Math.abs(t),isNaN(t)||t===1/0?(s=isNaN(t)?1:0,i=p):(i=Math.floor(Math.log(t)/Math.LN2),t*(l=Math.pow(2,-i))<1&&(i--,l*=2),(t+=i+d>=1?u/l:u*Math.pow(2,1-d))*l>=2&&(i++,l/=2),i+d>=p?(s=0,i=p):i+d>=1?(s=(t*l-1)*Math.pow(2,o),i+=d):(s=t*Math.pow(2,d-1)*Math.pow(2,o),i=0));o>=8;e[r+h]=255&s,h+=f,s/=256,o-=8);for(i=i<<o|s,c+=o;c>0;e[r+h]=255&i,h+=f,i/=256,c-=8);e[r+h-f]|=128*m}},874:()=>{!function(e){var t="\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b",r={pattern:/(^(["']?)\w+\2)[ \t]+\S.*/,lookbehind:!0,alias:"punctuation",inside:null},n={bash:r,environment:{pattern:RegExp("\\$"+t),alias:"constant"},variable:[{pattern:/\$?\(\([\s\S]+?\)\)/,greedy:!0,inside:{variable:[{pattern:/(^\$\(\([\s\S]+)\)\)/,lookbehind:!0},/^\$\(\(/],number:/\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,operator:/--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,punctuation:/\(\(?|\)\)?|,|;/}},{pattern:/\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,greedy:!0,inside:{variable:/^\$\(|^`|\)$|`$/}},{pattern:/\$\{[^}]+\}/,greedy:!0,inside:{operator:/:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,punctuation:/[\[\]]/,environment:{pattern:RegExp("(\\{)"+t),lookbehind:!0,alias:"constant"}}},/\$(?:\w+|[#?*!@$])/],entity:/\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/};e.languages.bash={shebang:{pattern:/^#!\s*\/.*/,alias:"important"},comment:{pattern:/(^|[^"{\\$])#.*/,lookbehind:!0},"function-name":[{pattern:/(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,lookbehind:!0,alias:"function"},{pattern:/\b[\w-]+(?=\s*\(\s*\)\s*\{)/,alias:"function"}],"for-or-select":{pattern:/(\b(?:for|select)\s+)\w+(?=\s+in\s)/,alias:"variable",lookbehind:!0},"assign-left":{pattern:/(^|[\s;|&]|[<>]\()\w+(?:\.\w+)*(?=\+?=)/,inside:{environment:{pattern:RegExp("(^|[\\s;|&]|[<>]\\()"+t),lookbehind:!0,alias:"constant"}},alias:"variable",lookbehind:!0},parameter:{pattern:/(^|\s)-{1,2}(?:\w+:[+-]?)?\w+(?:\.\w+)*(?=[=\s]|$)/,alias:"variable",lookbehind:!0},string:[{pattern:/((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,lookbehind:!0,greedy:!0,inside:n},{pattern:/((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,lookbehind:!0,greedy:!0,inside:{bash:r}},{pattern:/(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,lookbehind:!0,greedy:!0,inside:n},{pattern:/(^|[^$\\])'[^']*'/,lookbehind:!0,greedy:!0},{pattern:/\$'(?:[^'\\]|\\[\s\S])*'/,greedy:!0,inside:{entity:n.entity}}],environment:{pattern:RegExp("\\$?"+t),alias:"constant"},variable:n.variable,function:{pattern:/(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cargo|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|java|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|sysctl|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,lookbehind:!0},keyword:{pattern:/(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,lookbehind:!0},builtin:{pattern:/(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,lookbehind:!0,alias:"class-name"},boolean:{pattern:/(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,lookbehind:!0},"file-descriptor":{pattern:/\B&\d\b/,alias:"important"},operator:{pattern:/\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,inside:{"file-descriptor":{pattern:/^\d/,alias:"important"}}},punctuation:/\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,number:{pattern:/(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,lookbehind:!0}},r.inside=e.languages.bash;for(var o=["comment","function-name","for-or-select","assign-left","parameter","string","environment","function","keyword","builtin","boolean","file-descriptor","operator","punctuation","number"],a=n.variable[1].inside,i=0;i<o.length;i++)a[o[i]]=e.languages.bash[o[i]];e.languages.sh=e.languages.bash,e.languages.shell=e.languages.bash}(Prism)},433:()=>{Prism.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/}},325:(e,t,r)=>{var n=function(e){var t=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,r=0,n={},o={manual:e.Prism&&e.Prism.manual,disableWorkerMessageHandler:e.Prism&&e.Prism.disableWorkerMessageHandler,util:{encode:function e(t){return t instanceof a?new a(t.type,e(t.content),t.alias):Array.isArray(t)?t.map(e):t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(e){return Object.prototype.toString.call(e).slice(8,-1)},objId:function(e){return e.__id||Object.defineProperty(e,"__id",{value:++r}),e.__id},clone:function e(t,r){var n,a;switch(r=r||{},o.util.type(t)){case"Object":if(a=o.util.objId(t),r[a])return r[a];for(var i in n={},r[a]=n,t)t.hasOwnProperty(i)&&(n[i]=e(t[i],r));return n;case"Array":return a=o.util.objId(t),r[a]?r[a]:(n=[],r[a]=n,t.forEach((function(t,o){n[o]=e(t,r)})),n);default:return t}},getLanguage:function(e){for(;e;){var r=t.exec(e.className);if(r)return r[1].toLowerCase();e=e.parentElement}return"none"},setLanguage:function(e,r){e.className=e.className.replace(RegExp(t,"gi"),""),e.classList.add("language-"+r)},currentScript:function(){if("undefined"==typeof document)return null;if("currentScript"in document)return document.currentScript;try{throw new Error}catch(n){var e=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(n.stack)||[])[1];if(e){var t=document.getElementsByTagName("script");for(var r in t)if(t[r].src==e)return t[r]}return null}},isActive:function(e,t,r){for(var n="no-"+t;e;){var o=e.classList;if(o.contains(t))return!0;if(o.contains(n))return!1;e=e.parentElement}return!!r}},languages:{plain:n,plaintext:n,text:n,txt:n,extend:function(e,t){var r=o.util.clone(o.languages[e]);for(var n in t)r[n]=t[n];return r},insertBefore:function(e,t,r,n){var a=(n=n||o.languages)[e],i={};for(var s in a)if(a.hasOwnProperty(s)){if(s==t)for(var l in r)r.hasOwnProperty(l)&&(i[l]=r[l]);r.hasOwnProperty(s)||(i[s]=a[s])}var c=n[e];return n[e]=i,o.languages.DFS(o.languages,(function(t,r){r===c&&t!=e&&(this[t]=i)})),i},DFS:function e(t,r,n,a){a=a||{};var i=o.util.objId;for(var s in t)if(t.hasOwnProperty(s)){r.call(t,s,t[s],n||s);var l=t[s],c=o.util.type(l);"Object"!==c||a[i(l)]?"Array"!==c||a[i(l)]||(a[i(l)]=!0,e(l,r,s,a)):(a[i(l)]=!0,e(l,r,null,a))}}},plugins:{},highlightAll:function(e,t){o.highlightAllUnder(document,e,t)},highlightAllUnder:function(e,t,r){var n={callback:r,container:e,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};o.hooks.run("before-highlightall",n),n.elements=Array.prototype.slice.apply(n.container.querySelectorAll(n.selector)),o.hooks.run("before-all-elements-highlight",n);for(var a,i=0;a=n.elements[i++];)o.highlightElement(a,!0===t,n.callback)},highlightElement:function(t,r,n){var a=o.util.getLanguage(t),i=o.languages[a];o.util.setLanguage(t,a);var s=t.parentElement;s&&"pre"===s.nodeName.toLowerCase()&&o.util.setLanguage(s,a);var l={element:t,language:a,grammar:i,code:t.textContent};function c(e){l.highlightedCode=e,o.hooks.run("before-insert",l),l.element.innerHTML=l.highlightedCode,o.hooks.run("after-highlight",l),o.hooks.run("complete",l),n&&n.call(l.element)}if(o.hooks.run("before-sanity-check",l),(s=l.element.parentElement)&&"pre"===s.nodeName.toLowerCase()&&!s.hasAttribute("tabindex")&&s.setAttribute("tabindex","0"),!l.code)return o.hooks.run("complete",l),void(n&&n.call(l.element));if(o.hooks.run("before-highlight",l),l.grammar)if(r&&e.Worker){var p=new Worker(o.filename);p.onmessage=function(e){c(e.data)},p.postMessage(JSON.stringify({language:l.language,code:l.code,immediateClose:!0}))}else c(o.highlight(l.code,l.grammar,l.language));else c(o.util.encode(l.code))},highlight:function(e,t,r){var n={code:e,grammar:t,language:r};if(o.hooks.run("before-tokenize",n),!n.grammar)throw new Error('The language "'+n.language+'" has no grammar.');return n.tokens=o.tokenize(n.code,n.grammar),o.hooks.run("after-tokenize",n),a.stringify(o.util.encode(n.tokens),n.language)},tokenize:function(e,t){var r=t.rest;if(r){for(var n in r)t[n]=r[n];delete t.rest}var o=new l;return c(o,o.head,e),s(e,o,t,o.head,0),function(e){var t=[],r=e.head.next;for(;r!==e.tail;)t.push(r.value),r=r.next;return t}(o)},hooks:{all:{},add:function(e,t){var r=o.hooks.all;r[e]=r[e]||[],r[e].push(t)},run:function(e,t){var r=o.hooks.all[e];if(r&&r.length)for(var n,a=0;n=r[a++];)n(t)}},Token:a};function a(e,t,r,n){this.type=e,this.content=t,this.alias=r,this.length=0|(n||"").length}function i(e,t,r,n){e.lastIndex=t;var o=e.exec(r);if(o&&n&&o[1]){var a=o[1].length;o.index+=a,o[0]=o[0].slice(a)}return o}function s(e,t,r,n,l,d){for(var u in r)if(r.hasOwnProperty(u)&&r[u]){var h=r[u];h=Array.isArray(h)?h:[h];for(var f=0;f<h.length;++f){if(d&&d.cause==u+","+f)return;var m=h[f],g=m.inside,y=!!m.lookbehind,v=!!m.greedy,b=m.alias;if(v&&!m.pattern.global){var x=m.pattern.toString().match(/[imsuy]*$/)[0];m.pattern=RegExp(m.pattern.source,x+"g")}for(var w=m.pattern||m,k=n.next,$=l;k!==t.tail&&!(d&&$>=d.reach);$+=k.value.length,k=k.next){var S=k.value;if(t.length>e.length)return;if(!(S instanceof a)){var A,E=1;if(v){if(!(A=i(w,$,e,y))||A.index>=e.length)break;var O=A.index,C=A.index+A[0].length,T=$;for(T+=k.value.length;O>=T;)T+=(k=k.next).value.length;if($=T-=k.value.length,k.value instanceof a)continue;for(var j=k;j!==t.tail&&(T<C||"string"==typeof j.value);j=j.next)E++,T+=j.value.length;E--,S=e.slice($,T),A.index-=$}else if(!(A=i(w,0,S,y)))continue;O=A.index;var I=A[0],P=S.slice(0,O),_=S.slice(O+I.length),R=$+S.length;d&&R>d.reach&&(d.reach=R);var L=k.prev;if(P&&(L=c(t,L,P),$+=P.length),p(t,L,E),k=c(t,L,new a(u,g?o.tokenize(I,g):I,b,I)),_&&c(t,k,_),E>1){var B={cause:u+","+f,reach:R};s(e,t,r,k.prev,$,B),d&&B.reach>d.reach&&(d.reach=B.reach)}}}}}}function l(){var e={value:null,prev:null,next:null},t={value:null,prev:e,next:null};e.next=t,this.head=e,this.tail=t,this.length=0}function c(e,t,r){var n=t.next,o={value:r,prev:t,next:n};return t.next=o,n.prev=o,e.length++,o}function p(e,t,r){for(var n=t.next,o=0;o<r&&n!==e.tail;o++)n=n.next;t.next=n,n.prev=t,e.length-=o}if(e.Prism=o,a.stringify=function e(t,r){if("string"==typeof t)return t;if(Array.isArray(t)){var n="";return t.forEach((function(t){n+=e(t,r)})),n}var a={type:t.type,content:e(t.content,r),tag:"span",classes:["token",t.type],attributes:{},language:r},i=t.alias;i&&(Array.isArray(i)?Array.prototype.push.apply(a.classes,i):a.classes.push(i)),o.hooks.run("wrap",a);var s="";for(var l in a.attributes)s+=" "+l+'="'+(a.attributes[l]||"").replace(/"/g,"&quot;")+'"';return"<"+a.tag+' class="'+a.classes.join(" ")+'"'+s+">"+a.content+"</"+a.tag+">"},!e.document)return e.addEventListener?(o.disableWorkerMessageHandler||e.addEventListener("message",(function(t){var r=JSON.parse(t.data),n=r.language,a=r.code,i=r.immediateClose;e.postMessage(o.highlight(a,o.languages[n],n)),i&&e.close()}),!1),o):o;var d=o.util.currentScript();function u(){o.manual||o.highlightAll()}if(d&&(o.filename=d.src,d.hasAttribute("data-manual")&&(o.manual=!0)),!o.manual){var h=document.readyState;"loading"===h||"interactive"===h&&d&&d.defer?document.addEventListener("DOMContentLoaded",u):window.requestAnimationFrame?window.requestAnimationFrame(u):window.setTimeout(u,16)}return o}("undefined"!=typeof window?window:"undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?self:{});e.exports&&(e.exports=n),void 0!==r.g&&(r.g.Prism=n)},16:()=>{!function(e){function t(e,t){return e.replace(/<<(\d+)>>/g,(function(e,r){return"(?:"+t[+r]+")"}))}function r(e,r,n){return RegExp(t(e,r),n||"")}function n(e,t){for(var r=0;r<t;r++)e=e.replace(/<<self>>/g,(function(){return"(?:"+e+")"}));return e.replace(/<<self>>/g,"[^\\s\\S]")}var o="bool byte char decimal double dynamic float int long object sbyte short string uint ulong ushort var void",a="class enum interface record struct",i="add alias and ascending async await by descending from(?=\\s*(?:\\w|$)) get global group into init(?=\\s*;) join let nameof not notnull on or orderby partial remove select set unmanaged value when where with(?=\\s*{)",s="abstract as base break case catch checked const continue default delegate do else event explicit extern finally fixed for foreach goto if implicit in internal is lock namespace new null operator out override params private protected public readonly ref return sealed sizeof stackalloc static switch this throw try typeof unchecked unsafe using virtual volatile while yield";function l(e){return"\\b(?:"+e.trim().replace(/ /g,"|")+")\\b"}var c=l(a),p=RegExp(l(o+" "+a+" "+i+" "+s)),d=l(a+" "+i+" "+s),u=l(o+" "+a+" "+s),h=n(/<(?:[^<>;=+\-*/%&|^]|<<self>>)*>/.source,2),f=n(/\((?:[^()]|<<self>>)*\)/.source,2),m=/@?\b[A-Za-z_]\w*\b/.source,g=t(/<<0>>(?:\s*<<1>>)?/.source,[m,h]),y=t(/(?!<<0>>)<<1>>(?:\s*\.\s*<<1>>)*/.source,[d,g]),v=/\[\s*(?:,\s*)*\]/.source,b=t(/<<0>>(?:\s*(?:\?\s*)?<<1>>)*(?:\s*\?)?/.source,[y,v]),x=t(/[^,()<>[\];=+\-*/%&|^]|<<0>>|<<1>>|<<2>>/.source,[h,f,v]),w=t(/\(<<0>>+(?:,<<0>>+)+\)/.source,[x]),k=t(/(?:<<0>>|<<1>>)(?:\s*(?:\?\s*)?<<2>>)*(?:\s*\?)?/.source,[w,y,v]),$={keyword:p,punctuation:/[<>()?,.:[\]]/},S=/'(?:[^\r\n'\\]|\\.|\\[Uux][\da-fA-F]{1,8})'/.source,A=/"(?:\\.|[^\\"\r\n])*"/.source,E=/@"(?:""|\\[\s\S]|[^\\"])*"(?!")/.source;e.languages.csharp=e.languages.extend("clike",{string:[{pattern:r(/(^|[^$\\])<<0>>/.source,[E]),lookbehind:!0,greedy:!0},{pattern:r(/(^|[^@$\\])<<0>>/.source,[A]),lookbehind:!0,greedy:!0}],"class-name":[{pattern:r(/(\busing\s+static\s+)<<0>>(?=\s*;)/.source,[y]),lookbehind:!0,inside:$},{pattern:r(/(\busing\s+<<0>>\s*=\s*)<<1>>(?=\s*;)/.source,[m,k]),lookbehind:!0,inside:$},{pattern:r(/(\busing\s+)<<0>>(?=\s*=)/.source,[m]),lookbehind:!0},{pattern:r(/(\b<<0>>\s+)<<1>>/.source,[c,g]),lookbehind:!0,inside:$},{pattern:r(/(\bcatch\s*\(\s*)<<0>>/.source,[y]),lookbehind:!0,inside:$},{pattern:r(/(\bwhere\s+)<<0>>/.source,[m]),lookbehind:!0},{pattern:r(/(\b(?:is(?:\s+not)?|as)\s+)<<0>>/.source,[b]),lookbehind:!0,inside:$},{pattern:r(/\b<<0>>(?=\s+(?!<<1>>|with\s*\{)<<2>>(?:\s*[=,;:{)\]]|\s+(?:in|when)\b))/.source,[k,u,m]),inside:$}],keyword:p,number:/(?:\b0(?:x[\da-f_]*[\da-f]|b[01_]*[01])|(?:\B\.\d+(?:_+\d+)*|\b\d+(?:_+\d+)*(?:\.\d+(?:_+\d+)*)?)(?:e[-+]?\d+(?:_+\d+)*)?)(?:[dflmu]|lu|ul)?\b/i,operator:/>>=?|<<=?|[-=]>|([-+&|])\1|~|\?\?=?|[-+*/%&|^!=<>]=?/,punctuation:/\?\.?|::|[{}[\];(),.:]/}),e.languages.insertBefore("csharp","number",{range:{pattern:/\.\./,alias:"operator"}}),e.languages.insertBefore("csharp","punctuation",{"named-parameter":{pattern:r(/([(,]\s*)<<0>>(?=\s*:)/.source,[m]),lookbehind:!0,alias:"punctuation"}}),e.languages.insertBefore("csharp","class-name",{namespace:{pattern:r(/(\b(?:namespace|using)\s+)<<0>>(?:\s*\.\s*<<0>>)*(?=\s*[;{])/.source,[m]),lookbehind:!0,inside:{punctuation:/\./}},"type-expression":{pattern:r(/(\b(?:default|sizeof|typeof)\s*\(\s*(?!\s))(?:[^()\s]|\s(?!\s)|<<0>>)*(?=\s*\))/.source,[f]),lookbehind:!0,alias:"class-name",inside:$},"return-type":{pattern:r(/<<0>>(?=\s+(?:<<1>>\s*(?:=>|[({]|\.\s*this\s*\[)|this\s*\[))/.source,[k,y]),inside:$,alias:"class-name"},"constructor-invocation":{pattern:r(/(\bnew\s+)<<0>>(?=\s*[[({])/.source,[k]),lookbehind:!0,inside:$,alias:"class-name"},"generic-method":{pattern:r(/<<0>>\s*<<1>>(?=\s*\()/.source,[m,h]),inside:{function:r(/^<<0>>/.source,[m]),generic:{pattern:RegExp(h),alias:"class-name",inside:$}}},"type-list":{pattern:r(/\b((?:<<0>>\s+<<1>>|record\s+<<1>>\s*<<5>>|where\s+<<2>>)\s*:\s*)(?:<<3>>|<<4>>|<<1>>\s*<<5>>|<<6>>)(?:\s*,\s*(?:<<3>>|<<4>>|<<6>>))*(?=\s*(?:where|[{;]|=>|$))/.source,[c,g,m,k,p.source,f,/\bnew\s*\(\s*\)/.source]),lookbehind:!0,inside:{"record-arguments":{pattern:r(/(^(?!new\s*\()<<0>>\s*)<<1>>/.source,[g,f]),lookbehind:!0,greedy:!0,inside:e.languages.csharp},keyword:p,"class-name":{pattern:RegExp(k),greedy:!0,inside:$},punctuation:/[,()]/}},preprocessor:{pattern:/(^[\t ]*)#.*/m,lookbehind:!0,alias:"property",inside:{directive:{pattern:/(#)\b(?:define|elif|else|endif|endregion|error|if|line|nullable|pragma|region|undef|warning)\b/,lookbehind:!0,alias:"keyword"}}}});var O=A+"|"+S,C=t(/\/(?![*/])|\/\/[^\r\n]*[\r\n]|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>/.source,[O]),T=n(t(/[^"'/()]|<<0>>|\(<<self>>*\)/.source,[C]),2),j=/\b(?:assembly|event|field|method|module|param|property|return|type)\b/.source,I=t(/<<0>>(?:\s*\(<<1>>*\))?/.source,[y,T]);e.languages.insertBefore("csharp","class-name",{attribute:{pattern:r(/((?:^|[^\s\w>)?])\s*\[\s*)(?:<<0>>\s*:\s*)?<<1>>(?:\s*,\s*<<1>>)*(?=\s*\])/.source,[j,I]),lookbehind:!0,greedy:!0,inside:{target:{pattern:r(/^<<0>>(?=\s*:)/.source,[j]),alias:"keyword"},"attribute-arguments":{pattern:r(/\(<<0>>*\)/.source,[T]),inside:e.languages.csharp},"class-name":{pattern:RegExp(y),inside:{punctuation:/\./}},punctuation:/[:,]/}}});var P=/:[^}\r\n]+/.source,_=n(t(/[^"'/()]|<<0>>|\(<<self>>*\)/.source,[C]),2),R=t(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source,[_,P]),L=n(t(/[^"'/()]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>|\(<<self>>*\)/.source,[O]),2),B=t(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source,[L,P]);function F(t,n){return{interpolation:{pattern:r(/((?:^|[^{])(?:\{\{)*)<<0>>/.source,[t]),lookbehind:!0,inside:{"format-string":{pattern:r(/(^\{(?:(?![}:])<<0>>)*)<<1>>(?=\}$)/.source,[n,P]),lookbehind:!0,inside:{punctuation:/^:/}},punctuation:/^\{|\}$/,expression:{pattern:/[\s\S]+/,alias:"language-csharp",inside:e.languages.csharp}}},string:/[\s\S]+/}}e.languages.insertBefore("csharp","string",{"interpolation-string":[{pattern:r(/(^|[^\\])(?:\$@|@\$)"(?:""|\\[\s\S]|\{\{|<<0>>|[^\\{"])*"/.source,[R]),lookbehind:!0,greedy:!0,inside:F(R,_)},{pattern:r(/(^|[^@\\])\$"(?:\\.|\{\{|<<0>>|[^\\"{])*"/.source,[B]),lookbehind:!0,greedy:!0,inside:F(B,L)}],char:{pattern:RegExp(S),greedy:!0}}),e.languages.dotnet=e.languages.cs=e.languages.csharp}(Prism)},251:()=>{!function(e){var t=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;e.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:"+/[^;{\s"']|\s+(?!\s)/.source+"|"+t.source+")*?"+/(?:;|(?=\s*\{))/.source),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+t.source+"|"+/(?:[^\\\r\n()"']|\\[\s\S])*/.source+")\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+t.source+"$"),alias:"url"}}},selector:{pattern:RegExp("(^|[{}\\s])[^{}\\s](?:[^{};\"'\\s]|\\s+(?![\\s{])|"+t.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:t,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},e.languages.css.atrule.inside.rest=e.languages.css;var r=e.languages.markup;r&&(r.tag.addInlined("style","css"),r.tag.addAttribute("style","css"))}(Prism)},46:()=>{Prism.languages.go=Prism.languages.extend("clike",{string:{pattern:/(^|[^\\])"(?:\\.|[^"\\\r\n])*"|`[^`]*`/,lookbehind:!0,greedy:!0},keyword:/\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go(?:to)?|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/,boolean:/\b(?:_|false|iota|nil|true)\b/,number:[/\b0(?:b[01_]+|o[0-7_]+)i?\b/i,/\b0x(?:[a-f\d_]+(?:\.[a-f\d_]*)?|\.[a-f\d_]+)(?:p[+-]?\d+(?:_\d+)*)?i?(?!\w)/i,/(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?[\d_]+)?i?(?!\w)/i],operator:/[*\/%^!=]=?|\+[=+]?|-[=-]?|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\./,builtin:/\b(?:append|bool|byte|cap|close|complex|complex(?:64|128)|copy|delete|error|float(?:32|64)|u?int(?:8|16|32|64)?|imag|len|make|new|panic|print(?:ln)?|real|recover|rune|string|uintptr)\b/}),Prism.languages.insertBefore("go","string",{char:{pattern:/'(?:\\.|[^'\\\r\n]){0,10}'/,greedy:!0}}),delete Prism.languages.go["class-name"]},57:()=>{!function(e){function t(e){return RegExp("(^(?:"+e+"):[ \t]*(?![ \t]))[^]+","i")}e.languages.http={"request-line":{pattern:/^(?:CONNECT|DELETE|GET|HEAD|OPTIONS|PATCH|POST|PRI|PUT|SEARCH|TRACE)\s(?:https?:\/\/|\/)\S*\sHTTP\/[\d.]+/m,inside:{method:{pattern:/^[A-Z]+\b/,alias:"property"},"request-target":{pattern:/^(\s)(?:https?:\/\/|\/)\S*(?=\s)/,lookbehind:!0,alias:"url",inside:e.languages.uri},"http-version":{pattern:/^(\s)HTTP\/[\d.]+/,lookbehind:!0,alias:"property"}}},"response-status":{pattern:/^HTTP\/[\d.]+ \d+ .+/m,inside:{"http-version":{pattern:/^HTTP\/[\d.]+/,alias:"property"},"status-code":{pattern:/^(\s)\d+(?=\s)/,lookbehind:!0,alias:"number"},"reason-phrase":{pattern:/^(\s).+/,lookbehind:!0,alias:"string"}}},header:{pattern:/^[\w-]+:.+(?:(?:\r\n?|\n)[ \t].+)*/m,inside:{"header-value":[{pattern:t(/Content-Security-Policy/.source),lookbehind:!0,alias:["csp","languages-csp"],inside:e.languages.csp},{pattern:t(/Public-Key-Pins(?:-Report-Only)?/.source),lookbehind:!0,alias:["hpkp","languages-hpkp"],inside:e.languages.hpkp},{pattern:t(/Strict-Transport-Security/.source),lookbehind:!0,alias:["hsts","languages-hsts"],inside:e.languages.hsts},{pattern:t(/[^:]+/.source),lookbehind:!0}],"header-name":{pattern:/^[^:]+/,alias:"keyword"},punctuation:/^:/}}};var r,n=e.languages,o={"application/javascript":n.javascript,"application/json":n.json||n.javascript,"application/xml":n.xml,"text/xml":n.xml,"text/html":n.html,"text/css":n.css,"text/plain":n.plain},a={"application/json":!0,"application/xml":!0};function i(e){var t=e.replace(/^[a-z]+\//,"");return"(?:"+e+"|"+("\\w+/(?:[\\w.-]+\\+)+"+t+"(?![+\\w.-])")+")"}for(var s in o)if(o[s]){r=r||{};var l=a[s]?i(s):s;r[s.replace(/\//g,"-")]={pattern:RegExp("("+/content-type:\s*/.source+l+/(?:(?:\r\n?|\n)[\w-].*)*(?:\r(?:\n|(?!\n))|\n)/.source+")"+/[^ \t\w-][\s\S]*/.source,"i"),lookbehind:!0,inside:o[s]}}r&&e.languages.insertBefore("http","header",r)}(Prism)},503:()=>{!function(e){var t=/\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|non-sealed|null|open|opens|package|permits|private|protected|provides|public|record(?!\s*[(){}[\]<>=%~.:,;?+\-*/&|^])|requires|return|sealed|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/,r=/(?:[a-z]\w*\s*\.\s*)*(?:[A-Z]\w*\s*\.\s*)*/.source,n={pattern:RegExp(/(^|[^\w.])/.source+r+/[A-Z](?:[\d_A-Z]*[a-z]\w*)?\b/.source),lookbehind:!0,inside:{namespace:{pattern:/^[a-z]\w*(?:\s*\.\s*[a-z]\w*)*(?:\s*\.)?/,inside:{punctuation:/\./}},punctuation:/\./}};e.languages.java=e.languages.extend("clike",{string:{pattern:/(^|[^\\])"(?:\\.|[^"\\\r\n])*"/,lookbehind:!0,greedy:!0},"class-name":[n,{pattern:RegExp(/(^|[^\w.])/.source+r+/[A-Z]\w*(?=\s+\w+\s*[;,=()]|\s*(?:\[[\s,]*\]\s*)?::\s*new\b)/.source),lookbehind:!0,inside:n.inside},{pattern:RegExp(/(\b(?:class|enum|extends|implements|instanceof|interface|new|record|throws)\s+)/.source+r+/[A-Z]\w*\b/.source),lookbehind:!0,inside:n.inside}],keyword:t,function:[e.languages.clike.function,{pattern:/(::\s*)[a-z_]\w*/,lookbehind:!0}],number:/\b0b[01][01_]*L?\b|\b0x(?:\.[\da-f_p+-]+|[\da-f_]+(?:\.[\da-f_p+-]+)?)\b|(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,operator:{pattern:/(^|[^.])(?:<<=?|>>>?=?|->|--|\+\+|&&|\|\||::|[?:~]|[-+*/%&|^!=<>]=?)/m,lookbehind:!0},constant:/\b[A-Z][A-Z_\d]+\b/}),e.languages.insertBefore("java","string",{"triple-quoted-string":{pattern:/"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*"""/,greedy:!0,alias:"string"},char:{pattern:/'(?:\\.|[^'\\\r\n]){1,6}'/,greedy:!0}}),e.languages.insertBefore("java","class-name",{annotation:{pattern:/(^|[^.])@\w+(?:\s*\.\s*\w+)*/,lookbehind:!0,alias:"punctuation"},generics:{pattern:/<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&))*>)*>)*>)*>/,inside:{"class-name":n,keyword:t,punctuation:/[<>(),.:]/,operator:/[?&|]/}},import:[{pattern:RegExp(/(\bimport\s+)/.source+r+/(?:[A-Z]\w*|\*)(?=\s*;)/.source),lookbehind:!0,inside:{namespace:n.inside.namespace,punctuation:/\./,operator:/\*/,"class-name":/\w+/}},{pattern:RegExp(/(\bimport\s+static\s+)/.source+r+/(?:\w+|\*)(?=\s*;)/.source),lookbehind:!0,alias:"static",inside:{namespace:n.inside.namespace,static:/\b\w+$/,punctuation:/\./,operator:/\*/,"class-name":/\w+/}}],namespace:{pattern:RegExp(/(\b(?:exports|import(?:\s+static)?|module|open|opens|package|provides|requires|to|transitive|uses|with)\s+)(?!<keyword>)[a-z]\w*(?:\.[a-z]\w*)*\.?/.source.replace(/<keyword>/g,(function(){return t.source}))),lookbehind:!0,inside:{punctuation:/\./}}})}(Prism)},980:()=>{Prism.languages.javascript=Prism.languages.extend("clike",{"class-name":[Prism.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),Prism.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,Prism.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:Prism.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:Prism.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),Prism.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:Prism.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),Prism.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),Prism.languages.markup&&(Prism.languages.markup.tag.addInlined("script","javascript"),Prism.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript")),Prism.languages.js=Prism.languages.javascript},277:()=>{Prism.languages.json={property:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,lookbehind:!0,greedy:!0},string:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,lookbehind:!0,greedy:!0},comment:{pattern:/\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,greedy:!0},number:/-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,punctuation:/[{}[\],]/,operator:/:/,boolean:/\b(?:false|true)\b/,null:{pattern:/\bnull\b/,alias:"keyword"}},Prism.languages.webmanifest=Prism.languages.json},854:()=>{!function(e){function t(e,t){return"___"+e.toUpperCase()+t+"___"}Object.defineProperties(e.languages["markup-templating"]={},{buildPlaceholders:{value:function(r,n,o,a){if(r.language===n){var i=r.tokenStack=[];r.code=r.code.replace(o,(function(e){if("function"==typeof a&&!a(e))return e;for(var o,s=i.length;-1!==r.code.indexOf(o=t(n,s));)++s;return i[s]=e,o})),r.grammar=e.languages.markup}}},tokenizePlaceholders:{value:function(r,n){if(r.language===n&&r.tokenStack){r.grammar=e.languages[n];var o=0,a=Object.keys(r.tokenStack);!function i(s){for(var l=0;l<s.length&&!(o>=a.length);l++){var c=s[l];if("string"==typeof c||c.content&&"string"==typeof c.content){var p=a[o],d=r.tokenStack[p],u="string"==typeof c?c:c.content,h=t(n,p),f=u.indexOf(h);if(f>-1){++o;var m=u.substring(0,f),g=new e.Token(n,e.tokenize(d,r.grammar),"language-"+n,d),y=u.substring(f+h.length),v=[];m&&v.push.apply(v,i([m])),v.push(g),y&&v.push.apply(v,i([y])),"string"==typeof c?s.splice.apply(s,[l,1].concat(v)):c.content=v}}else c.content&&i(c.content)}return s}(r.tokens)}}}})}(Prism)},335:()=>{Prism.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},Prism.languages.markup.tag.inside["attr-value"].inside.entity=Prism.languages.markup.entity,Prism.languages.markup.doctype.inside["internal-subset"].inside=Prism.languages.markup,Prism.hooks.add("wrap",(function(e){"entity"===e.type&&(e.attributes.title=e.content.replace(/&amp;/,"&"))})),Object.defineProperty(Prism.languages.markup.tag,"addInlined",{value:function(e,t){var r={};r["language-"+t]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:Prism.languages[t]},r.cdata=/^<!\[CDATA\[|\]\]>$/i;var n={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:r}};n["language-"+t]={pattern:/[\s\S]+/,inside:Prism.languages[t]};var o={};o[e]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,(function(){return e})),"i"),lookbehind:!0,greedy:!0,inside:n},Prism.languages.insertBefore("markup","cdata",o)}}),Object.defineProperty(Prism.languages.markup.tag,"addAttribute",{value:function(e,t){Prism.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+e+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[t,"language-"+t],inside:Prism.languages[t]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),Prism.languages.html=Prism.languages.markup,Prism.languages.mathml=Prism.languages.markup,Prism.languages.svg=Prism.languages.markup,Prism.languages.xml=Prism.languages.extend("markup",{}),Prism.languages.ssml=Prism.languages.xml,Prism.languages.atom=Prism.languages.xml,Prism.languages.rss=Prism.languages.xml},945:()=>{!function(e){var t=/\/\*[\s\S]*?\*\/|\/\/.*|#(?!\[).*/,r=[{pattern:/\b(?:false|true)\b/i,alias:"boolean"},{pattern:/(::\s*)\b[a-z_]\w*\b(?!\s*\()/i,greedy:!0,lookbehind:!0},{pattern:/(\b(?:case|const)\s+)\b[a-z_]\w*(?=\s*[;=])/i,greedy:!0,lookbehind:!0},/\b(?:null)\b/i,/\b[A-Z_][A-Z0-9_]*\b(?!\s*\()/],n=/\b0b[01]+(?:_[01]+)*\b|\b0o[0-7]+(?:_[0-7]+)*\b|\b0x[\da-f]+(?:_[\da-f]+)*\b|(?:\b\d+(?:_\d+)*\.?(?:\d+(?:_\d+)*)?|\B\.\d+)(?:e[+-]?\d+)?/i,o=/<?=>|\?\?=?|\.{3}|\??->|[!=]=?=?|::|\*\*=?|--|\+\+|&&|\|\||<<|>>|[?~]|[/^|%*&<>.+-]=?/,a=/[{}\[\](),:;]/;e.languages.php={delimiter:{pattern:/\?>$|^<\?(?:php(?=\s)|=)?/i,alias:"important"},comment:t,variable:/\$+(?:\w+\b|(?=\{))/,package:{pattern:/(namespace\s+|use\s+(?:function\s+)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,lookbehind:!0,inside:{punctuation:/\\/}},"class-name-definition":{pattern:/(\b(?:class|enum|interface|trait)\s+)\b[a-z_]\w*(?!\\)\b/i,lookbehind:!0,alias:"class-name"},"function-definition":{pattern:/(\bfunction\s+)[a-z_]\w*(?=\s*\()/i,lookbehind:!0,alias:"function"},keyword:[{pattern:/(\(\s*)\b(?:array|bool|boolean|float|int|integer|object|string)\b(?=\s*\))/i,alias:"type-casting",greedy:!0,lookbehind:!0},{pattern:/([(,?]\s*)\b(?:array(?!\s*\()|bool|callable|(?:false|null)(?=\s*\|)|float|int|iterable|mixed|object|self|static|string)\b(?=\s*\$)/i,alias:"type-hint",greedy:!0,lookbehind:!0},{pattern:/(\)\s*:\s*(?:\?\s*)?)\b(?:array(?!\s*\()|bool|callable|(?:false|null)(?=\s*\|)|float|int|iterable|mixed|never|object|self|static|string|void)\b/i,alias:"return-type",greedy:!0,lookbehind:!0},{pattern:/\b(?:array(?!\s*\()|bool|float|int|iterable|mixed|object|string|void)\b/i,alias:"type-declaration",greedy:!0},{pattern:/(\|\s*)(?:false|null)\b|\b(?:false|null)(?=\s*\|)/i,alias:"type-declaration",greedy:!0,lookbehind:!0},{pattern:/\b(?:parent|self|static)(?=\s*::)/i,alias:"static-context",greedy:!0},{pattern:/(\byield\s+)from\b/i,lookbehind:!0},/\bclass\b/i,{pattern:/((?:^|[^\s>:]|(?:^|[^-])>|(?:^|[^:]):)\s*)\b(?:abstract|and|array|as|break|callable|case|catch|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|enum|eval|exit|extends|final|finally|fn|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|match|namespace|never|new|or|parent|print|private|protected|public|readonly|require|require_once|return|self|static|switch|throw|trait|try|unset|use|var|while|xor|yield|__halt_compiler)\b/i,lookbehind:!0}],"argument-name":{pattern:/([(,]\s*)\b[a-z_]\w*(?=\s*:(?!:))/i,lookbehind:!0},"class-name":[{pattern:/(\b(?:extends|implements|instanceof|new(?!\s+self|\s+static))\s+|\bcatch\s*\()\b[a-z_]\w*(?!\\)\b/i,greedy:!0,lookbehind:!0},{pattern:/(\|\s*)\b[a-z_]\w*(?!\\)\b/i,greedy:!0,lookbehind:!0},{pattern:/\b[a-z_]\w*(?!\\)\b(?=\s*\|)/i,greedy:!0},{pattern:/(\|\s*)(?:\\?\b[a-z_]\w*)+\b/i,alias:"class-name-fully-qualified",greedy:!0,lookbehind:!0,inside:{punctuation:/\\/}},{pattern:/(?:\\?\b[a-z_]\w*)+\b(?=\s*\|)/i,alias:"class-name-fully-qualified",greedy:!0,inside:{punctuation:/\\/}},{pattern:/(\b(?:extends|implements|instanceof|new(?!\s+self\b|\s+static\b))\s+|\bcatch\s*\()(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,alias:"class-name-fully-qualified",greedy:!0,lookbehind:!0,inside:{punctuation:/\\/}},{pattern:/\b[a-z_]\w*(?=\s*\$)/i,alias:"type-declaration",greedy:!0},{pattern:/(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,alias:["class-name-fully-qualified","type-declaration"],greedy:!0,inside:{punctuation:/\\/}},{pattern:/\b[a-z_]\w*(?=\s*::)/i,alias:"static-context",greedy:!0},{pattern:/(?:\\?\b[a-z_]\w*)+(?=\s*::)/i,alias:["class-name-fully-qualified","static-context"],greedy:!0,inside:{punctuation:/\\/}},{pattern:/([(,?]\s*)[a-z_]\w*(?=\s*\$)/i,alias:"type-hint",greedy:!0,lookbehind:!0},{pattern:/([(,?]\s*)(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,alias:["class-name-fully-qualified","type-hint"],greedy:!0,lookbehind:!0,inside:{punctuation:/\\/}},{pattern:/(\)\s*:\s*(?:\?\s*)?)\b[a-z_]\w*(?!\\)\b/i,alias:"return-type",greedy:!0,lookbehind:!0},{pattern:/(\)\s*:\s*(?:\?\s*)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,alias:["class-name-fully-qualified","return-type"],greedy:!0,lookbehind:!0,inside:{punctuation:/\\/}}],constant:r,function:{pattern:/(^|[^\\\w])\\?[a-z_](?:[\w\\]*\w)?(?=\s*\()/i,lookbehind:!0,inside:{punctuation:/\\/}},property:{pattern:/(->\s*)\w+/,lookbehind:!0},number:n,operator:o,punctuation:a};var i={pattern:/\{\$(?:\{(?:\{[^{}]+\}|[^{}]+)\}|[^{}])+\}|(^|[^\\{])\$+(?:\w+(?:\[[^\r\n\[\]]+\]|->\w+)?)/,lookbehind:!0,inside:e.languages.php},s=[{pattern:/<<<'([^']+)'[\r\n](?:.*[\r\n])*?\1;/,alias:"nowdoc-string",greedy:!0,inside:{delimiter:{pattern:/^<<<'[^']+'|[a-z_]\w*;$/i,alias:"symbol",inside:{punctuation:/^<<<'?|[';]$/}}}},{pattern:/<<<(?:"([^"]+)"[\r\n](?:.*[\r\n])*?\1;|([a-z_]\w*)[\r\n](?:.*[\r\n])*?\2;)/i,alias:"heredoc-string",greedy:!0,inside:{delimiter:{pattern:/^<<<(?:"[^"]+"|[a-z_]\w*)|[a-z_]\w*;$/i,alias:"symbol",inside:{punctuation:/^<<<"?|[";]$/}},interpolation:i}},{pattern:/`(?:\\[\s\S]|[^\\`])*`/,alias:"backtick-quoted-string",greedy:!0},{pattern:/'(?:\\[\s\S]|[^\\'])*'/,alias:"single-quoted-string",greedy:!0},{pattern:/"(?:\\[\s\S]|[^\\"])*"/,alias:"double-quoted-string",greedy:!0,inside:{interpolation:i}}];e.languages.insertBefore("php","variable",{string:s,attribute:{pattern:/#\[(?:[^"'\/#]|\/(?![*/])|\/\/.*$|#(?!\[).*$|\/\*(?:[^*]|\*(?!\/))*\*\/|"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*')+\](?=\s*[a-z$#])/im,greedy:!0,inside:{"attribute-content":{pattern:/^(#\[)[\s\S]+(?=\]$)/,lookbehind:!0,inside:{comment:t,string:s,"attribute-class-name":[{pattern:/([^:]|^)\b[a-z_]\w*(?!\\)\b/i,alias:"class-name",greedy:!0,lookbehind:!0},{pattern:/([^:]|^)(?:\\?\b[a-z_]\w*)+/i,alias:["class-name","class-name-fully-qualified"],greedy:!0,lookbehind:!0,inside:{punctuation:/\\/}}],constant:r,number:n,operator:o,punctuation:a}},delimiter:{pattern:/^#\[|\]$/,alias:"punctuation"}}}}),e.hooks.add("before-tokenize",(function(t){if(/<\?/.test(t.code)){e.languages["markup-templating"].buildPlaceholders(t,"php",/<\?(?:[^"'/#]|\/(?![*/])|("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|(?:\/\/|#(?!\[))(?:[^?\n\r]|\?(?!>))*(?=$|\?>|[\r\n])|#\[|\/\*(?:[^*]|\*(?!\/))*(?:\*\/|$))*?(?:\?>|$)/g)}})),e.hooks.add("after-tokenize",(function(t){e.languages["markup-templating"].tokenizePlaceholders(t,"php")}))}(Prism)},366:()=>{Prism.languages.python={comment:{pattern:/(^|[^\\])#.*/,lookbehind:!0,greedy:!0},"string-interpolation":{pattern:/(?:f|fr|rf)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,greedy:!0,inside:{interpolation:{pattern:/((?:^|[^{])(?:\{\{)*)\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}])+\})+\})+\}/,lookbehind:!0,inside:{"format-spec":{pattern:/(:)[^:(){}]+(?=\}$)/,lookbehind:!0},"conversion-option":{pattern:/![sra](?=[:}]$)/,alias:"punctuation"},rest:null}},string:/[\s\S]+/}},"triple-quoted-string":{pattern:/(?:[rub]|br|rb)?("""|''')[\s\S]*?\1/i,greedy:!0,alias:"string"},string:{pattern:/(?:[rub]|br|rb)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,greedy:!0},function:{pattern:/((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,lookbehind:!0},"class-name":{pattern:/(\bclass\s+)\w+/i,lookbehind:!0},decorator:{pattern:/(^[\t ]*)@\w+(?:\.\w+)*/m,lookbehind:!0,alias:["annotation","punctuation"],inside:{punctuation:/\./}},keyword:/\b(?:_(?=\s*:)|and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,builtin:/\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,boolean:/\b(?:False|None|True)\b/,number:/\b0(?:b(?:_?[01])+|o(?:_?[0-7])+|x(?:_?[a-f0-9])+)\b|(?:\b\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\B\.\d+(?:_\d+)*)(?:e[+-]?\d+(?:_\d+)*)?j?(?!\w)/i,operator:/[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,punctuation:/[{}[\];(),.:]/},Prism.languages.python["string-interpolation"].inside.interpolation.inside.rest=Prism.languages.python,Prism.languages.py=Prism.languages.python},385:()=>{!function(e){e.languages.ruby=e.languages.extend("clike",{comment:{pattern:/#.*|^=begin\s[\s\S]*?^=end/m,greedy:!0},"class-name":{pattern:/(\b(?:class|module)\s+|\bcatch\s+\()[\w.\\]+|\b[A-Z_]\w*(?=\s*\.\s*new\b)/,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:BEGIN|END|alias|and|begin|break|case|class|def|define_method|defined|do|each|else|elsif|end|ensure|extend|for|if|in|include|module|new|next|nil|not|or|prepend|private|protected|public|raise|redo|require|rescue|retry|return|self|super|then|throw|undef|unless|until|when|while|yield)\b/,operator:/\.{2,3}|&\.|===|<?=>|[!=]?~|(?:&&|\|\||<<|>>|\*\*|[+\-*/%<>!^&|=])=?|[?:]/,punctuation:/[(){}[\].,;]/}),e.languages.insertBefore("ruby","operator",{"double-colon":{pattern:/::/,alias:"punctuation"}});var t={pattern:/((?:^|[^\\])(?:\\{2})*)#\{(?:[^{}]|\{[^{}]*\})*\}/,lookbehind:!0,inside:{content:{pattern:/^(#\{)[\s\S]+(?=\}$)/,lookbehind:!0,inside:e.languages.ruby},delimiter:{pattern:/^#\{|\}$/,alias:"punctuation"}}};delete e.languages.ruby.function;var r="(?:"+[/([^a-zA-Z0-9\s{(\[<=])(?:(?!\1)[^\\]|\\[\s\S])*\1/.source,/\((?:[^()\\]|\\[\s\S]|\((?:[^()\\]|\\[\s\S])*\))*\)/.source,/\{(?:[^{}\\]|\\[\s\S]|\{(?:[^{}\\]|\\[\s\S])*\})*\}/.source,/\[(?:[^\[\]\\]|\\[\s\S]|\[(?:[^\[\]\\]|\\[\s\S])*\])*\]/.source,/<(?:[^<>\\]|\\[\s\S]|<(?:[^<>\\]|\\[\s\S])*>)*>/.source].join("|")+")",n=/(?:"(?:\\.|[^"\\\r\n])*"|(?:\b[a-zA-Z_]\w*|[^\s\0-\x7F]+)[?!]?|\$.)/.source;e.languages.insertBefore("ruby","keyword",{"regex-literal":[{pattern:RegExp(/%r/.source+r+/[egimnosux]{0,6}/.source),greedy:!0,inside:{interpolation:t,regex:/[\s\S]+/}},{pattern:/(^|[^/])\/(?!\/)(?:\[[^\r\n\]]+\]|\\.|[^[/\\\r\n])+\/[egimnosux]{0,6}(?=\s*(?:$|[\r\n,.;})#]))/,lookbehind:!0,greedy:!0,inside:{interpolation:t,regex:/[\s\S]+/}}],variable:/[@$]+[a-zA-Z_]\w*(?:[?!]|\b)/,symbol:[{pattern:RegExp(/(^|[^:]):/.source+n),lookbehind:!0,greedy:!0},{pattern:RegExp(/([\r\n{(,][ \t]*)/.source+n+/(?=:(?!:))/.source),lookbehind:!0,greedy:!0}],"method-definition":{pattern:/(\bdef\s+)\w+(?:\s*\.\s*\w+)?/,lookbehind:!0,inside:{function:/\b\w+$/,keyword:/^self\b/,"class-name":/^\w+/,punctuation:/\./}}}),e.languages.insertBefore("ruby","string",{"string-literal":[{pattern:RegExp(/%[qQiIwWs]?/.source+r),greedy:!0,inside:{interpolation:t,string:/[\s\S]+/}},{pattern:/("|')(?:#\{[^}]+\}|#(?!\{)|\\(?:\r\n|[\s\S])|(?!\1)[^\\#\r\n])*\1/,greedy:!0,inside:{interpolation:t,string:/[\s\S]+/}},{pattern:/<<[-~]?([a-z_]\w*)[\r\n](?:.*[\r\n])*?[\t ]*\1/i,alias:"heredoc-string",greedy:!0,inside:{delimiter:{pattern:/^<<[-~]?[a-z_]\w*|\b[a-z_]\w*$/i,inside:{symbol:/\b\w+/,punctuation:/^<<[-~]?/}},interpolation:t,string:/[\s\S]+/}},{pattern:/<<[-~]?'([a-z_]\w*)'[\r\n](?:.*[\r\n])*?[\t ]*\1/i,alias:"heredoc-string",greedy:!0,inside:{delimiter:{pattern:/^<<[-~]?'[a-z_]\w*'|\b[a-z_]\w*$/i,inside:{symbol:/\b\w+/,punctuation:/^<<[-~]?'|'$/}},string:/[\s\S]+/}}],"command-literal":[{pattern:RegExp(/%x/.source+r),greedy:!0,inside:{interpolation:t,command:{pattern:/[\s\S]+/,alias:"string"}}},{pattern:/`(?:#\{[^}]+\}|#(?!\{)|\\(?:\r\n|[\s\S])|[^\\`#\r\n])*`/,greedy:!0,inside:{interpolation:t,command:{pattern:/[\s\S]+/,alias:"string"}}}]}),delete e.languages.ruby.string,e.languages.insertBefore("ruby","number",{builtin:/\b(?:Array|Bignum|Binding|Class|Continuation|Dir|Exception|FalseClass|File|Fixnum|Float|Hash|IO|Integer|MatchData|Method|Module|NilClass|Numeric|Object|Proc|Range|Regexp|Stat|String|Struct|Symbol|TMS|Thread|ThreadGroup|Time|TrueClass)\b/,constant:/\b[A-Z][A-Z0-9_]*(?:[?!]|\b)/}),e.languages.rb=e.languages.ruby}(Prism)},358:()=>{!function(e){var t=/[*&][^\s[\]{},]+/,r=/!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/,n="(?:"+r.source+"(?:[ \t]+"+t.source+")?|"+t.source+"(?:[ \t]+"+r.source+")?)",o=/(?:[^\s\x00-\x08\x0e-\x1f!"#%&'*,\-:>?@[\]`{|}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]|[?:-]<PLAIN>)(?:[ \t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*/.source.replace(/<PLAIN>/g,(function(){return/[^\s\x00-\x08\x0e-\x1f,[\]{}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]/.source})),a=/"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\\\r\n]|\\.)*'/.source;function i(e,t){t=(t||"").replace(/m/g,"")+"m";var r=/([:\-,[{]\s*(?:\s<<prop>>[ \t]+)?)(?:<<value>>)(?=[ \t]*(?:$|,|\]|\}|(?:[\r\n]\s*)?#))/.source.replace(/<<prop>>/g,(function(){return n})).replace(/<<value>>/g,(function(){return e}));return RegExp(r,t)}e.languages.yaml={scalar:{pattern:RegExp(/([\-:]\s*(?:\s<<prop>>[ \t]+)?[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)\S[^\r\n]*(?:\2[^\r\n]+)*)/.source.replace(/<<prop>>/g,(function(){return n}))),lookbehind:!0,alias:"string"},comment:/#.*/,key:{pattern:RegExp(/((?:^|[:\-,[{\r\n?])[ \t]*(?:<<prop>>[ \t]+)?)<<key>>(?=\s*:\s)/.source.replace(/<<prop>>/g,(function(){return n})).replace(/<<key>>/g,(function(){return"(?:"+o+"|"+a+")"}))),lookbehind:!0,greedy:!0,alias:"atrule"},directive:{pattern:/(^[ \t]*)%.+/m,lookbehind:!0,alias:"important"},datetime:{pattern:i(/\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?(?:[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?))?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?/.source),lookbehind:!0,alias:"number"},boolean:{pattern:i(/false|true/.source,"i"),lookbehind:!0,alias:"important"},null:{pattern:i(/null|~/.source,"i"),lookbehind:!0,alias:"important"},string:{pattern:i(a),lookbehind:!0,greedy:!0},number:{pattern:i(/[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|\.inf|\.nan)/.source,"i"),lookbehind:!0},tag:r,important:t,punctuation:/---|[:[\]{}\-,|>?]|\.\.\./},e.languages.yml=e.languages.yaml}(Prism)},712:()=>{!function(){if("undefined"!=typeof Prism){var e,t,r="";Prism.plugins.customClass={add:function(t){e=t},map:function(e){t="function"==typeof e?e:function(t){return e[t]||t}},prefix:function(e){r=e||""},apply:n},Prism.hooks.add("wrap",(function(o){if(e){var a=e({content:o.content,type:o.type,language:o.language});Array.isArray(a)?o.classes.push.apply(o.classes,a):a&&o.classes.push(a)}(t||r)&&(o.classes=o.classes.map((function(e){return n(e,o.language)})))}))}function n(e,n){return r+(t?t(e,n):e)}}()},464:e=>{"use strict";var t,r="";e.exports=function(e,n){if("string"!=typeof e)throw new TypeError("expected a string");if(1===n)return e;if(2===n)return e+e;var o=e.length*n;if(t!==e||void 0===t)t=e,r="";else if(r.length>=o)return r.substr(0,o);for(;o>r.length&&n>1;)1&n&&(r+=e),n>>=1,e+=e;return r=(r+=e).substr(0,o)}},131:(e,t,r)=>{"use strict";var n=r(464),o=function(e){return/<\/+[^>]+>/.test(e)},a=function(e){return/<[^>]+\/>/.test(e)};function i(e){return e.split(/(<\/?[^>]+>)/g).filter((function(e){return""!==e.trim()})).map((function(e){return{value:e,type:s(e)}}))}function s(e){return o(e)?"ClosingTag":function(e){return function(e){return/<[^>!]+>/.test(e)}(e)&&!o(e)&&!a(e)}(e)?"OpeningTag":a(e)?"SelfClosingTag":"Text"}e.exports=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=t.indentor,o=t.textNodesOnSameLine,a=0,s=[];r=r||"    ";var l=i(e).map((function(e,t,i){var l=e.value,c=e.type;"ClosingTag"===c&&a--;var p=n(r,a),d=p+l;if("OpeningTag"===c&&a++,o){var u=i[t-1],h=i[t-2];"ClosingTag"===c&&"Text"===u.type&&"OpeningTag"===h.type&&(d=""+p+h.value+u.value+l,s.push(t-2,t-1))}return d}));return s.forEach((function(e){return l[e]=null})),l.filter((function(e){return!!e})).join("\n")}}},n={};function o(e){var t=n[e];if(void 0!==t){if(void 0!==t.error)throw t.error;return t.exports}var a=n[e]={exports:{}};try{var i={id:e,module:a,factory:r[e],require:o};o.i.forEach((function(e){e(i)})),a=i.module,i.factory.call(a.exports,a,a.exports,i.require)}catch(e){throw a.error=e,e}return a.exports}o.m=r,o.c=n,o.i=[],o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var r in t)o.o(t,r)&&!o.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},o.hu=e=>e+"."+o.h()+".hot-update.js",o.hmrF=()=>"main."+o.h()+".hot-update.json",o.h=()=>"479c5fe7131b7144b547",o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),e={},t="rapidoc:",o.l=(r,n,a,i)=>{if(e[r])e[r].push(n);else{var s,l;if(void 0!==a)for(var c=document.getElementsByTagName("script"),p=0;p<c.length;p++){var d=c[p];if(d.getAttribute("src")==r||d.getAttribute("data-webpack")==t+a){s=d;break}}s||(l=!0,(s=document.createElement("script")).charset="utf-8",s.timeout=120,o.nc&&s.setAttribute("nonce",o.nc),s.setAttribute("data-webpack",t+a),s.src=r),e[r]=[n];var u=(t,n)=>{s.onerror=s.onload=null,clearTimeout(h);var o=e[r];if(delete e[r],s.parentNode&&s.parentNode.removeChild(s),o&&o.forEach((e=>e(n))),t)return t(n)},h=setTimeout(u.bind(null,void 0,{type:"timeout",target:s}),12e4);s.onerror=u.bind(null,s.onerror),s.onload=u.bind(null,s.onload),l&&document.head.appendChild(s)}},(()=>{var e,t,r,n={},a=o.c,i=[],s=[],l="idle",c=0,p=[];function d(e){l=e;for(var t=[],r=0;r<s.length;r++)t[r]=s[r].call(null,e);return Promise.all(t)}function u(){0==--c&&d("ready").then((function(){if(0===c){var e=p;p=[];for(var t=0;t<e.length;t++)e[t]()}}))}function h(e){if("idle"!==l)throw new Error("check() is only allowed in idle status");return d("check").then(o.hmrM).then((function(r){return r?d("prepare").then((function(){var n=[];return t=[],Promise.all(Object.keys(o.hmrC).reduce((function(e,a){return o.hmrC[a](r.c,r.r,r.m,e,t,n),e}),[])).then((function(){return t=function(){return e?m(e):d("ready").then((function(){return n}))},0===c?t():new Promise((function(e){p.push((function(){e(t())}))}));var t}))})):d(g()?"ready":"idle").then((function(){return null}))}))}function f(e){return"ready"!==l?Promise.resolve().then((function(){throw new Error("apply() is only allowed in ready status (state: "+l+")")})):m(e)}function m(e){e=e||{},g();var n=t.map((function(t){return t(e)}));t=void 0;var o=n.map((function(e){return e.error})).filter(Boolean);if(o.length>0)return d("abort").then((function(){throw o[0]}));var a=d("dispose");n.forEach((function(e){e.dispose&&e.dispose()}));var i,s=d("apply"),l=function(e){i||(i=e)},c=[];return n.forEach((function(e){if(e.apply){var t=e.apply(l);if(t)for(var r=0;r<t.length;r++)c.push(t[r])}})),Promise.all([a,s]).then((function(){return i?d("fail").then((function(){throw i})):r?m(e).then((function(e){return c.forEach((function(t){e.indexOf(t)<0&&e.push(t)})),e})):d("idle").then((function(){return c}))}))}function g(){if(r)return t||(t=[]),Object.keys(o.hmrI).forEach((function(e){r.forEach((function(r){o.hmrI[e](r,t)}))})),r=void 0,!0}o.hmrD=n,o.i.push((function(p){var m,g,y,v,b=p.module,x=function(t,r){var n=a[r];if(!n)return t;var o=function(o){if(n.hot.active){if(a[o]){var s=a[o].parents;-1===s.indexOf(r)&&s.push(r)}else i=[r],e=o;-1===n.children.indexOf(o)&&n.children.push(o)}else console.warn("[HMR] unexpected require("+o+") from disposed module "+r),i=[];return t(o)},s=function(e){return{configurable:!0,enumerable:!0,get:function(){return t[e]},set:function(r){t[e]=r}}};for(var p in t)Object.prototype.hasOwnProperty.call(t,p)&&"e"!==p&&Object.defineProperty(o,p,s(p));return o.e=function(e){return function(e){switch(l){case"ready":d("prepare");case"prepare":return c++,e.then(u,u),e;default:return e}}(t.e(e))},o}(p.require,p.id);b.hot=(m=p.id,g=b,v={_acceptedDependencies:{},_acceptedErrorHandlers:{},_declinedDependencies:{},_selfAccepted:!1,_selfDeclined:!1,_selfInvalidated:!1,_disposeHandlers:[],_main:y=e!==m,_requireSelf:function(){i=g.parents.slice(),e=y?void 0:m,o(m)},active:!0,accept:function(e,t,r){if(void 0===e)v._selfAccepted=!0;else if("function"==typeof e)v._selfAccepted=e;else if("object"==typeof e&&null!==e)for(var n=0;n<e.length;n++)v._acceptedDependencies[e[n]]=t||function(){},v._acceptedErrorHandlers[e[n]]=r;else v._acceptedDependencies[e]=t||function(){},v._acceptedErrorHandlers[e]=r},decline:function(e){if(void 0===e)v._selfDeclined=!0;else if("object"==typeof e&&null!==e)for(var t=0;t<e.length;t++)v._declinedDependencies[e[t]]=!0;else v._declinedDependencies[e]=!0},dispose:function(e){v._disposeHandlers.push(e)},addDisposeHandler:function(e){v._disposeHandlers.push(e)},removeDisposeHandler:function(e){var t=v._disposeHandlers.indexOf(e);t>=0&&v._disposeHandlers.splice(t,1)},invalidate:function(){switch(this._selfInvalidated=!0,l){case"idle":t=[],Object.keys(o.hmrI).forEach((function(e){o.hmrI[e](m,t)})),d("ready");break;case"ready":Object.keys(o.hmrI).forEach((function(e){o.hmrI[e](m,t)}));break;case"prepare":case"check":case"dispose":case"apply":(r=r||[]).push(m)}},check:h,apply:f,status:function(e){if(!e)return l;s.push(e)},addStatusHandler:function(e){s.push(e)},removeStatusHandler:function(e){var t=s.indexOf(e);t>=0&&s.splice(t,1)},data:n[m]},e=void 0,v),b.parents=i,b.children=[],i=[],p.require=x})),o.hmrC={},o.hmrI={}})(),o.p="",(()=>{var e,t,r,n,a,i=o.hmrS_jsonp=o.hmrS_jsonp||{179:0},s={};function l(t,r){return e=r,new Promise(((e,r)=>{s[t]=e;var n=o.p+o.hu(t),a=new Error;o.l(n,(e=>{if(s[t]){s[t]=void 0;var n=e&&("load"===e.type?"missing":e.type),o=e&&e.target&&e.target.src;a.message="Loading hot update chunk "+t+" failed.\n("+n+": "+o+")",a.name="ChunkLoadError",a.type=n,a.request=o,r(a)}}))}))}function c(e){function s(e){for(var t=[e],r={},n=t.map((function(e){return{chain:[e],id:e}}));n.length>0;){var a=n.pop(),i=a.id,s=a.chain,c=o.c[i];if(c&&(!c.hot._selfAccepted||c.hot._selfInvalidated)){if(c.hot._selfDeclined)return{type:"self-declined",chain:s,moduleId:i};if(c.hot._main)return{type:"unaccepted",chain:s,moduleId:i};for(var p=0;p<c.parents.length;p++){var d=c.parents[p],u=o.c[d];if(u){if(u.hot._declinedDependencies[i])return{type:"declined",chain:s.concat([d]),moduleId:i,parentId:d};-1===t.indexOf(d)&&(u.hot._acceptedDependencies[i]?(r[d]||(r[d]=[]),l(r[d],[i])):(delete r[d],t.push(d),n.push({chain:s.concat([d]),id:d})))}}}}return{type:"accepted",moduleId:e,outdatedModules:t,outdatedDependencies:r}}function l(e,t){for(var r=0;r<t.length;r++){var n=t[r];-1===e.indexOf(n)&&e.push(n)}}o.f&&delete o.f.jsonpHmr,t=void 0;var c={},p=[],d={},u=function(e){console.warn("[HMR] unexpected require("+e.id+") to disposed module")};for(var h in r)if(o.o(r,h)){var f,m=r[h],g=!1,y=!1,v=!1,b="";switch((f=m?s(h):{type:"disposed",moduleId:h}).chain&&(b="\nUpdate propagation: "+f.chain.join(" -> ")),f.type){case"self-declined":e.onDeclined&&e.onDeclined(f),e.ignoreDeclined||(g=new Error("Aborted because of self decline: "+f.moduleId+b));break;case"declined":e.onDeclined&&e.onDeclined(f),e.ignoreDeclined||(g=new Error("Aborted because of declined dependency: "+f.moduleId+" in "+f.parentId+b));break;case"unaccepted":e.onUnaccepted&&e.onUnaccepted(f),e.ignoreUnaccepted||(g=new Error("Aborted because "+h+" is not accepted"+b));break;case"accepted":e.onAccepted&&e.onAccepted(f),y=!0;break;case"disposed":e.onDisposed&&e.onDisposed(f),v=!0;break;default:throw new Error("Unexception type "+f.type)}if(g)return{error:g};if(y)for(h in d[h]=m,l(p,f.outdatedModules),f.outdatedDependencies)o.o(f.outdatedDependencies,h)&&(c[h]||(c[h]=[]),l(c[h],f.outdatedDependencies[h]));v&&(l(p,[f.moduleId]),d[h]=u)}r=void 0;for(var x,w=[],k=0;k<p.length;k++){var $=p[k],S=o.c[$];S&&(S.hot._selfAccepted||S.hot._main)&&d[$]!==u&&!S.hot._selfInvalidated&&w.push({module:$,require:S.hot._requireSelf,errorHandler:S.hot._selfAccepted})}return{dispose:function(){var e;n.forEach((function(e){delete i[e]})),n=void 0;for(var t,r=p.slice();r.length>0;){var a=r.pop(),s=o.c[a];if(s){var l={},d=s.hot._disposeHandlers;for(k=0;k<d.length;k++)d[k].call(null,l);for(o.hmrD[a]=l,s.hot.active=!1,delete o.c[a],delete c[a],k=0;k<s.children.length;k++){var u=o.c[s.children[k]];u&&((e=u.parents.indexOf(a))>=0&&u.parents.splice(e,1))}}}for(var h in c)if(o.o(c,h)&&(s=o.c[h]))for(x=c[h],k=0;k<x.length;k++)t=x[k],(e=s.children.indexOf(t))>=0&&s.children.splice(e,1)},apply:function(t){for(var r in d)o.o(d,r)&&(o.m[r]=d[r]);for(var n=0;n<a.length;n++)a[n](o);for(var i in c)if(o.o(c,i)){var s=o.c[i];if(s){x=c[i];for(var l=[],u=[],h=[],f=0;f<x.length;f++){var m=x[f],g=s.hot._acceptedDependencies[m],y=s.hot._acceptedErrorHandlers[m];if(g){if(-1!==l.indexOf(g))continue;l.push(g),u.push(y),h.push(m)}}for(var v=0;v<l.length;v++)try{l[v].call(null,x)}catch(r){if("function"==typeof u[v])try{u[v](r,{moduleId:i,dependencyId:h[v]})}catch(n){e.onErrored&&e.onErrored({type:"accept-error-handler-errored",moduleId:i,dependencyId:h[v],error:n,originalError:r}),e.ignoreErrored||(t(n),t(r))}else e.onErrored&&e.onErrored({type:"accept-errored",moduleId:i,dependencyId:h[v],error:r}),e.ignoreErrored||t(r)}}}for(var b=0;b<w.length;b++){var k=w[b],$=k.module;try{k.require($)}catch(r){if("function"==typeof k.errorHandler)try{k.errorHandler(r,{moduleId:$,module:o.c[$]})}catch(n){e.onErrored&&e.onErrored({type:"self-accept-error-handler-errored",moduleId:$,error:n,originalError:r}),e.ignoreErrored||(t(n),t(r))}else e.onErrored&&e.onErrored({type:"self-accept-errored",moduleId:$,error:r}),e.ignoreErrored||t(r)}}return p}}}self.webpackHotUpdaterapidoc=(t,n,i)=>{for(var l in n)o.o(n,l)&&(r[l]=n[l],e&&e.push(l));i&&a.push(i),s[t]&&(s[t](),s[t]=void 0)},o.hmrI.jsonp=function(e,t){r||(r={},a=[],n=[],t.push(c)),o.o(r,e)||(r[e]=o.m[e])},o.hmrC.jsonp=function(e,s,p,d,u,h){u.push(c),t={},n=s,r=p.reduce((function(e,t){return e[t]=!1,e}),{}),a=[],e.forEach((function(e){o.o(i,e)&&void 0!==i[e]?(d.push(l(e,h)),t[e]=!0):t[e]=!1})),o.f&&(o.f.jsonpHmr=function(e,r){t&&o.o(t,e)&&!t[e]&&(r.push(l(e)),t[e]=!0)})},o.hmrM=()=>{if("undefined"==typeof fetch)throw new Error("No browser support: need fetch API");return fetch(o.p+o.hmrF()).then((e=>{if(404!==e.status){if(!e.ok)throw new Error("Failed to fetch update manifest "+e.statusText);return e.json()}}))}})();o(205)})();
//# sourceMappingURL=rapidoc-min.js.map