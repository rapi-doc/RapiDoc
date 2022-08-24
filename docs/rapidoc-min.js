/*! RapiDoc 9.3.3 | Author - Mrinmoy Majumdar | License information can be found in rapidoc-min.js.LICENSE.txt  */
(()=>{var e,t,r={656:(e,t,r)=>{"use strict";const n=window,a=n.ShadowRoot&&(void 0===n.ShadyCSS||n.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),i=new WeakMap;class s{constructor(e,t,r){if(this._$cssResult$=!0,r!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(a&&void 0===e){const r=void 0!==t&&1===t.length;r&&(e=i.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&i.set(t,e))}return e}toString(){return this.cssText}}const l=e=>new s("string"==typeof e?e:e+"",void 0,o),c=(e,...t)=>{const r=1===e.length?e[0]:t.reduce(((t,r,n)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+e[n+1]),e[0]);return new s(r,e,o)},p=a?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const r of e.cssRules)t+=r.cssText;return l(t)})(e):e;var d;const u=window,h=u.trustedTypes,f=h?h.emptyScript:"",m=u.reactiveElementPolyfillSupport,y={toAttribute(e,t){switch(t){case Boolean:e=e?f:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=null!==e;break;case Number:r=null===e?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch(e){r=null}}return r}},g=(e,t)=>t!==e&&(t==t||e==e),v={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:g};class b extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(e){var t;null!==(t=this.h)&&void 0!==t||(this.h=[]),this.h.push(e)}static get observedAttributes(){this.finalize();const e=[];return this.elementProperties.forEach(((t,r)=>{const n=this._$Ep(r,t);void 0!==n&&(this._$Ev.set(n,r),e.push(n))})),e}static createProperty(e,t=v){if(t.state&&(t.attribute=!1),this.finalize(),this.elementProperties.set(e,t),!t.noAccessor&&!this.prototype.hasOwnProperty(e)){const r="symbol"==typeof e?Symbol():"__"+e,n=this.getPropertyDescriptor(e,r,t);void 0!==n&&Object.defineProperty(this.prototype,e,n)}}static getPropertyDescriptor(e,t,r){return{get(){return this[t]},set(n){const a=this[e];this[t]=n,this.requestUpdate(e,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)||v}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const e=Object.getPrototypeOf(this);if(e.finalize(),this.elementProperties=new Map(e.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const e=this.properties,t=[...Object.getOwnPropertyNames(e),...Object.getOwnPropertySymbols(e)];for(const r of t)this.createProperty(r,e[r])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const e of r)t.unshift(p(e))}else void 0!==e&&t.push(p(e));return t}static _$Ep(e,t){const r=t.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof e?e.toLowerCase():void 0}u(){var e;this._$E_=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(e=this.constructor.h)||void 0===e||e.forEach((e=>e(this)))}addController(e){var t,r;(null!==(t=this._$ES)&&void 0!==t?t:this._$ES=[]).push(e),void 0!==this.renderRoot&&this.isConnected&&(null===(r=e.hostConnected)||void 0===r||r.call(e))}removeController(e){var t;null===(t=this._$ES)||void 0===t||t.splice(this._$ES.indexOf(e)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((e,t)=>{this.hasOwnProperty(t)&&(this._$Ei.set(t,this[t]),delete this[t])}))}createRenderRoot(){var e;const t=null!==(e=this.shadowRoot)&&void 0!==e?e:this.attachShadow(this.constructor.shadowRootOptions);return((e,t)=>{a?e.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet)):t.forEach((t=>{const r=document.createElement("style"),a=n.litNonce;void 0!==a&&r.setAttribute("nonce",a),r.textContent=t.cssText,e.appendChild(r)}))})(t,this.constructor.elementStyles),t}connectedCallback(){var e;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(e=this._$ES)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostConnected)||void 0===t?void 0:t.call(e)}))}enableUpdating(e){}disconnectedCallback(){var e;null===(e=this._$ES)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostDisconnected)||void 0===t?void 0:t.call(e)}))}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$EO(e,t,r=v){var n;const a=this.constructor._$Ep(e,r);if(void 0!==a&&!0===r.reflect){const o=(void 0!==(null===(n=r.converter)||void 0===n?void 0:n.toAttribute)?r.converter:y).toAttribute(t,r.type);this._$El=e,null==o?this.removeAttribute(a):this.setAttribute(a,o),this._$El=null}}_$AK(e,t){var r;const n=this.constructor,a=n._$Ev.get(e);if(void 0!==a&&this._$El!==a){const e=n.getPropertyOptions(a),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==(null===(r=e.converter)||void 0===r?void 0:r.fromAttribute)?e.converter:y;this._$El=a,this[a]=o.fromAttribute(t,e.type),this._$El=null}}requestUpdate(e,t,r){let n=!0;void 0!==e&&(((r=r||this.constructor.getPropertyOptions(e)).hasChanged||g)(this[e],t)?(this._$AL.has(e)||this._$AL.set(e,t),!0===r.reflect&&this._$El!==e&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(e,r))):n=!1),!this.isUpdatePending&&n&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((e,t)=>this[t]=e)),this._$Ei=void 0);let t=!1;const r=this._$AL;try{t=this.shouldUpdate(r),t?(this.willUpdate(r),null===(e=this._$ES)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostUpdate)||void 0===t?void 0:t.call(e)})),this.update(r)):this._$Ek()}catch(e){throw t=!1,this._$Ek(),e}t&&this._$AE(r)}willUpdate(e){}_$AE(e){var t;null===(t=this._$ES)||void 0===t||t.forEach((e=>{var t;return null===(t=e.hostUpdated)||void 0===t?void 0:t.call(e)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(e){return!0}update(e){void 0!==this._$EC&&(this._$EC.forEach(((e,t)=>this._$EO(t,this[t],e))),this._$EC=void 0),this._$Ek()}updated(e){}firstUpdated(e){}}var x;b.finalized=!0,b.elementProperties=new Map,b.elementStyles=[],b.shadowRootOptions={mode:"open"},null==m||m({ReactiveElement:b}),(null!==(d=u.reactiveElementVersions)&&void 0!==d?d:u.reactiveElementVersions=[]).push("1.4.0");const w=window,$=w.trustedTypes,k=$?$.createPolicy("lit-html",{createHTML:e=>e}):void 0,S=`lit$${(Math.random()+"").slice(9)}$`,A="?"+S,O=`<${A}>`,E=document,T=(e="")=>E.createComment(e),C=e=>null===e||"object"!=typeof e&&"function"!=typeof e,j=Array.isArray,_=e=>j(e)||"function"==typeof(null==e?void 0:e[Symbol.iterator]),P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,I=/-->/g,R=/>/g,L=RegExp(">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)","g"),D=/'/g,F=/"/g,N=/^(?:script|style|textarea|title)$/i,q=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),z=q(1),U=(q(2),Symbol.for("lit-noChange")),B=Symbol.for("lit-nothing"),M=new WeakMap,H=E.createTreeWalker(E,129,null,!1),W=(e,t)=>{const r=e.length-1,n=[];let a,o=2===t?"<svg>":"",i=P;for(let t=0;t<r;t++){const r=e[t];let s,l,c=-1,p=0;for(;p<r.length&&(i.lastIndex=p,l=i.exec(r),null!==l);)p=i.lastIndex,i===P?"!--"===l[1]?i=I:void 0!==l[1]?i=R:void 0!==l[2]?(N.test(l[2])&&(a=RegExp("</"+l[2],"g")),i=L):void 0!==l[3]&&(i=L):i===L?">"===l[0]?(i=null!=a?a:P,c=-1):void 0===l[1]?c=-2:(c=i.lastIndex-l[2].length,s=l[1],i=void 0===l[3]?L:'"'===l[3]?F:D):i===F||i===D?i=L:i===I||i===R?i=P:(i=L,a=void 0);const d=i===L&&e[t+1].startsWith("/>")?" ":"";o+=i===P?r+O:c>=0?(n.push(s),r.slice(0,c)+"$lit$"+r.slice(c)+S+d):r+S+(-2===c?(n.push(void 0),t):d)}const s=o+(e[r]||"<?>")+(2===t?"</svg>":"");if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==k?k.createHTML(s):s,n]};class V{constructor({strings:e,_$litType$:t},r){let n;this.parts=[];let a=0,o=0;const i=e.length-1,s=this.parts,[l,c]=W(e,t);if(this.el=V.createElement(l,r),H.currentNode=this.el.content,2===t){const e=this.el.content,t=e.firstChild;t.remove(),e.append(...t.childNodes)}for(;null!==(n=H.nextNode())&&s.length<i;){if(1===n.nodeType){if(n.hasAttributes()){const e=[];for(const t of n.getAttributeNames())if(t.endsWith("$lit$")||t.startsWith(S)){const r=c[o++];if(e.push(t),void 0!==r){const e=n.getAttribute(r.toLowerCase()+"$lit$").split(S),t=/([.?@])?(.*)/.exec(r);s.push({type:1,index:a,name:t[2],strings:e,ctor:"."===t[1]?Z:"?"===t[1]?X:"@"===t[1]?ee:Y})}else s.push({type:6,index:a})}for(const t of e)n.removeAttribute(t)}if(N.test(n.tagName)){const e=n.textContent.split(S),t=e.length-1;if(t>0){n.textContent=$?$.emptyScript:"";for(let r=0;r<t;r++)n.append(e[r],T()),H.nextNode(),s.push({type:2,index:++a});n.append(e[t],T())}}}else if(8===n.nodeType)if(n.data===A)s.push({type:2,index:a});else{let e=-1;for(;-1!==(e=n.data.indexOf(S,e+1));)s.push({type:7,index:a}),e+=S.length-1}a++}}static createElement(e,t){const r=E.createElement("template");return r.innerHTML=e,r}}function G(e,t,r=e,n){var a,o,i,s;if(t===U)return t;let l=void 0!==n?null===(a=r._$Cl)||void 0===a?void 0:a[n]:r._$Cu;const c=C(t)?void 0:t._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(o=null==l?void 0:l._$AO)||void 0===o||o.call(l,!1),void 0===c?l=void 0:(l=new c(e),l._$AT(e,r,n)),void 0!==n?(null!==(i=(s=r)._$Cl)&&void 0!==i?i:s._$Cl=[])[n]=l:r._$Cu=l),void 0!==l&&(t=G(e,l._$AS(e,t.values),l,n)),t}class K{constructor(e,t){this.v=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(e){var t;const{el:{content:r},parts:n}=this._$AD,a=(null!==(t=null==e?void 0:e.creationScope)&&void 0!==t?t:E).importNode(r,!0);H.currentNode=a;let o=H.nextNode(),i=0,s=0,l=n[0];for(;void 0!==l;){if(i===l.index){let t;2===l.type?t=new J(o,o.nextSibling,this,e):1===l.type?t=new l.ctor(o,l.name,l.strings,this,e):6===l.type&&(t=new te(o,this,e)),this.v.push(t),l=n[++s]}i!==(null==l?void 0:l.index)&&(o=H.nextNode(),i++)}return a}m(e){let t=0;for(const r of this.v)void 0!==r&&(void 0!==r.strings?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}}class J{constructor(e,t,r,n){var a;this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=n,this._$C_=null===(a=null==n?void 0:n.isConnected)||void 0===a||a}get _$AU(){var e,t;return null!==(t=null===(e=this._$AM)||void 0===e?void 0:e._$AU)&&void 0!==t?t:this._$C_}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=G(this,e,t),C(e)?e===B||null==e||""===e?(this._$AH!==B&&this._$AR(),this._$AH=B):e!==this._$AH&&e!==U&&this.$(e):void 0!==e._$litType$?this.T(e):void 0!==e.nodeType?this.k(e):_(e)?this.O(e):this.$(e)}S(e,t=this._$AB){return this._$AA.parentNode.insertBefore(e,t)}k(e){this._$AH!==e&&(this._$AR(),this._$AH=this.S(e))}$(e){this._$AH!==B&&C(this._$AH)?this._$AA.nextSibling.data=e:this.k(E.createTextNode(e)),this._$AH=e}T(e){var t;const{values:r,_$litType$:n}=e,a="number"==typeof n?this._$AC(e):(void 0===n.el&&(n.el=V.createElement(n.h,this.options)),n);if((null===(t=this._$AH)||void 0===t?void 0:t._$AD)===a)this._$AH.m(r);else{const e=new K(a,this),t=e.p(this.options);e.m(r),this.k(t),this._$AH=e}}_$AC(e){let t=M.get(e.strings);return void 0===t&&M.set(e.strings,t=new V(e)),t}O(e){j(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let r,n=0;for(const a of e)n===t.length?t.push(r=new J(this.S(T()),this.S(T()),this,this.options)):r=t[n],r._$AI(a),n++;n<t.length&&(this._$AR(r&&r._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){var r;for(null===(r=this._$AP)||void 0===r||r.call(this,!1,!0,t);e&&e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){var t;void 0===this._$AM&&(this._$C_=e,null===(t=this._$AP)||void 0===t||t.call(this,e))}}class Y{constructor(e,t,r,n,a){this.type=1,this._$AH=B,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=a,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=B}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(e,t=this,r,n){const a=this.strings;let o=!1;if(void 0===a)e=G(this,e,t,0),o=!C(e)||e!==this._$AH&&e!==U,o&&(this._$AH=e);else{const n=e;let i,s;for(e=a[0],i=0;i<a.length-1;i++)s=G(this,n[r+i],t,i),s===U&&(s=this._$AH[i]),o||(o=!C(s)||s!==this._$AH[i]),s===B?e=B:e!==B&&(e+=(null!=s?s:"")+a[i+1]),this._$AH[i]=s}o&&!n&&this.P(e)}P(e){e===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=e?e:"")}}class Z extends Y{constructor(){super(...arguments),this.type=3}P(e){this.element[this.name]=e===B?void 0:e}}const Q=$?$.emptyScript:"";class X extends Y{constructor(){super(...arguments),this.type=4}P(e){e&&e!==B?this.element.setAttribute(this.name,Q):this.element.removeAttribute(this.name)}}class ee extends Y{constructor(e,t,r,n,a){super(e,t,r,n,a),this.type=5}_$AI(e,t=this){var r;if((e=null!==(r=G(this,e,t,0))&&void 0!==r?r:B)===U)return;const n=this._$AH,a=e===B&&n!==B||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,o=e!==B&&(n===B||a);a&&this.element.removeEventListener(this.name,this,n),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,r;"function"==typeof this._$AH?this._$AH.call(null!==(r=null===(t=this.options)||void 0===t?void 0:t.host)&&void 0!==r?r:this.element,e):this._$AH.handleEvent(e)}}class te{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){G(this,e)}}const re={A:"$lit$",M:S,C:A,L:1,R:W,D:K,V:_,I:G,H:J,N:Y,U:X,B:ee,F:Z,W:te},ne=w.litHtmlPolyfillSupport;var ae,oe;null==ne||ne(V,J),(null!==(x=w.litHtmlVersions)&&void 0!==x?x:w.litHtmlVersions=[]).push("2.3.0");class ie extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Dt=void 0}createRenderRoot(){var e,t;const r=super.createRenderRoot();return null!==(e=(t=this.renderOptions).renderBefore)&&void 0!==e||(t.renderBefore=r.firstChild),r}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Dt=((e,t,r)=>{var n,a;const o=null!==(n=null==r?void 0:r.renderBefore)&&void 0!==n?n:t;let i=o._$litPart$;if(void 0===i){const e=null!==(a=null==r?void 0:r.renderBefore)&&void 0!==a?a:null;o._$litPart$=i=new J(t.insertBefore(T(),e),e,void 0,null!=r?r:{})}return i._$AI(e),i})(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),null===(e=this._$Dt)||void 0===e||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._$Dt)||void 0===e||e.setConnected(!1)}render(){return U}}ie.finalized=!0,ie._$litElement$=!0,null===(ae=globalThis.litElementHydrateSupport)||void 0===ae||ae.call(globalThis,{LitElement:ie});const se=globalThis.litElementPolyfillSupport;null==se||se({LitElement:ie});function le(){return{baseUrl:null,breaks:!1,extensions:null,gfm:!0,headerIds:!0,headerPrefix:"",highlight:null,langPrefix:"language-",mangle:!0,pedantic:!1,renderer:null,sanitize:!1,sanitizer:null,silent:!1,smartLists:!1,smartypants:!1,tokenizer:null,walkTokens:null,xhtml:!1}}(null!==(oe=globalThis.litElementVersions)&&void 0!==oe?oe:globalThis.litElementVersions=[]).push("3.2.0");let ce={baseUrl:null,breaks:!1,extensions:null,gfm:!0,headerIds:!0,headerPrefix:"",highlight:null,langPrefix:"language-",mangle:!0,pedantic:!1,renderer:null,sanitize:!1,sanitizer:null,silent:!1,smartLists:!1,smartypants:!1,tokenizer:null,walkTokens:null,xhtml:!1};const pe=/[&<>"']/,de=/[&<>"']/g,ue=/[<>"']|&(?!#?\w+;)/,he=/[<>"']|&(?!#?\w+;)/g,fe={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},me=e=>fe[e];function ye(e,t){if(t){if(pe.test(e))return e.replace(de,me)}else if(ue.test(e))return e.replace(he,me);return e}const ge=/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;function ve(e){return e.replace(ge,((e,t)=>"colon"===(t=t.toLowerCase())?":":"#"===t.charAt(0)?"x"===t.charAt(1)?String.fromCharCode(parseInt(t.substring(2),16)):String.fromCharCode(+t.substring(1)):""))}const be=/(^|[^\[])\^/g;function xe(e,t){e="string"==typeof e?e:e.source,t=t||"";const r={replace:(t,n)=>(n=(n=n.source||n).replace(be,"$1"),e=e.replace(t,n),r),getRegex:()=>new RegExp(e,t)};return r}const we=/[^\w:]/g,$e=/^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;function ke(e,t,r){if(e){let e;try{e=decodeURIComponent(ve(r)).replace(we,"").toLowerCase()}catch(e){return null}if(0===e.indexOf("javascript:")||0===e.indexOf("vbscript:")||0===e.indexOf("data:"))return null}t&&!$e.test(r)&&(r=function(e,t){Se[" "+e]||(Ae.test(e)?Se[" "+e]=e+"/":Se[" "+e]=_e(e,"/",!0));const r=-1===(e=Se[" "+e]).indexOf(":");return"//"===t.substring(0,2)?r?t:e.replace(Oe,"$1")+t:"/"===t.charAt(0)?r?t:e.replace(Ee,"$1")+t:e+t}(t,r));try{r=encodeURI(r).replace(/%25/g,"%")}catch(e){return null}return r}const Se={},Ae=/^[^:]+:\/*[^/]*$/,Oe=/^([^:]+:)[\s\S]*$/,Ee=/^([^:]+:\/*[^/]*)[\s\S]*$/;const Te={exec:function(){}};function Ce(e){let t,r,n=1;for(;n<arguments.length;n++)for(r in t=arguments[n],t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e}function je(e,t){const r=e.replace(/\|/g,((e,t,r)=>{let n=!1,a=t;for(;--a>=0&&"\\"===r[a];)n=!n;return n?"|":" |"})).split(/ \|/);let n=0;if(r[0].trim()||r.shift(),r.length>0&&!r[r.length-1].trim()&&r.pop(),r.length>t)r.splice(t);else for(;r.length<t;)r.push("");for(;n<r.length;n++)r[n]=r[n].trim().replace(/\\\|/g,"|");return r}function _e(e,t,r){const n=e.length;if(0===n)return"";let a=0;for(;a<n;){const o=e.charAt(n-a-1);if(o!==t||r){if(o===t||!r)break;a++}else a++}return e.slice(0,n-a)}function Pe(e){e&&e.sanitize&&!e.silent&&console.warn("marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options")}function Ie(e,t){if(t<1)return"";let r="";for(;t>1;)1&t&&(r+=e),t>>=1,e+=e;return r+e}function Re(e,t,r,n){const a=t.href,o=t.title?ye(t.title):null,i=e[1].replace(/\\([\[\]])/g,"$1");if("!"!==e[0].charAt(0)){n.state.inLink=!0;const e={type:"link",raw:r,href:a,title:o,text:i,tokens:n.inlineTokens(i,[])};return n.state.inLink=!1,e}return{type:"image",raw:r,href:a,title:o,text:ye(i)}}class Le{constructor(e){this.options=e||ce}space(e){const t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){const t=this.rules.block.code.exec(e);if(t){const e=t[0].replace(/^ {1,4}/gm,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?e:_e(e,"\n")}}}fences(e){const t=this.rules.block.fences.exec(e);if(t){const e=t[0],r=function(e,t){const r=e.match(/^(\s+)(?:```)/);if(null===r)return t;const n=r[1];return t.split("\n").map((e=>{const t=e.match(/^\s+/);if(null===t)return e;const[r]=t;return r.length>=n.length?e.slice(n.length):e})).join("\n")}(e,t[3]||"");return{type:"code",raw:e,lang:t[2]?t[2].trim():t[2],text:r}}}heading(e){const t=this.rules.block.heading.exec(e);if(t){let e=t[2].trim();if(/#$/.test(e)){const t=_e(e,"#");this.options.pedantic?e=t.trim():t&&!/ $/.test(t)||(e=t.trim())}const r={type:"heading",raw:t[0],depth:t[1].length,text:e,tokens:[]};return this.lexer.inline(r.text,r.tokens),r}}hr(e){const t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:t[0]}}blockquote(e){const t=this.rules.block.blockquote.exec(e);if(t){const e=t[0].replace(/^ *>[ \t]?/gm,"");return{type:"blockquote",raw:t[0],tokens:this.lexer.blockTokens(e,[]),text:e}}}list(e){let t=this.rules.block.list.exec(e);if(t){let r,n,a,o,i,s,l,c,p,d,u,h,f=t[1].trim();const m=f.length>1,y={type:"list",raw:"",ordered:m,start:m?+f.slice(0,-1):"",loose:!1,items:[]};f=m?`\\d{1,9}\\${f.slice(-1)}`:`\\${f}`,this.options.pedantic&&(f=m?f:"[*+-]");const g=new RegExp(`^( {0,3}${f})((?:[\t ][^\\n]*)?(?:\\n|$))`);for(;e&&(h=!1,t=g.exec(e))&&!this.rules.block.hr.test(e);){if(r=t[0],e=e.substring(r.length),c=t[2].split("\n",1)[0],p=e.split("\n",1)[0],this.options.pedantic?(o=2,u=c.trimLeft()):(o=t[2].search(/[^ ]/),o=o>4?1:o,u=c.slice(o),o+=t[1].length),s=!1,!c&&/^ *$/.test(p)&&(r+=p+"\n",e=e.substring(p.length+1),h=!0),!h){const t=new RegExp(`^ {0,${Math.min(3,o-1)}}(?:[*+-]|\\d{1,9}[.)])((?: [^\\n]*)?(?:\\n|$))`),n=new RegExp(`^ {0,${Math.min(3,o-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),a=new RegExp(`^ {0,${Math.min(3,o-1)}}(?:\`\`\`|~~~)`),i=new RegExp(`^ {0,${Math.min(3,o-1)}}#`);for(;e&&(d=e.split("\n",1)[0],c=d,this.options.pedantic&&(c=c.replace(/^ {1,4}(?=( {4})*[^ ])/g,"  ")),!a.test(c))&&!i.test(c)&&!t.test(c)&&!n.test(e);){if(c.search(/[^ ]/)>=o||!c.trim())u+="\n"+c.slice(o);else{if(s)break;u+="\n"+c}s||c.trim()||(s=!0),r+=d+"\n",e=e.substring(d.length+1)}}y.loose||(l?y.loose=!0:/\n *\n *$/.test(r)&&(l=!0)),this.options.gfm&&(n=/^\[[ xX]\] /.exec(u),n&&(a="[ ] "!==n[0],u=u.replace(/^\[[ xX]\] +/,""))),y.items.push({type:"list_item",raw:r,task:!!n,checked:a,loose:!1,text:u}),y.raw+=r}y.items[y.items.length-1].raw=r.trimRight(),y.items[y.items.length-1].text=u.trimRight(),y.raw=y.raw.trimRight();const v=y.items.length;for(i=0;i<v;i++){this.lexer.state.top=!1,y.items[i].tokens=this.lexer.blockTokens(y.items[i].text,[]);const e=y.items[i].tokens.filter((e=>"space"===e.type)),t=e.every((e=>{const t=e.raw.split("");let r=0;for(const e of t)if("\n"===e&&(r+=1),r>1)return!0;return!1}));!y.loose&&e.length&&t&&(y.loose=!0,y.items[i].loose=!0)}return y}}html(e){const t=this.rules.block.html.exec(e);if(t){const e={type:"html",raw:t[0],pre:!this.options.sanitizer&&("pre"===t[1]||"script"===t[1]||"style"===t[1]),text:t[0]};return this.options.sanitize&&(e.type="paragraph",e.text=this.options.sanitizer?this.options.sanitizer(t[0]):ye(t[0]),e.tokens=[],this.lexer.inline(e.text,e.tokens)),e}}def(e){const t=this.rules.block.def.exec(e);if(t){t[3]&&(t[3]=t[3].substring(1,t[3].length-1));return{type:"def",tag:t[1].toLowerCase().replace(/\s+/g," "),raw:t[0],href:t[2],title:t[3]}}}table(e){const t=this.rules.block.table.exec(e);if(t){const e={type:"table",header:je(t[1]).map((e=>({text:e}))),align:t[2].replace(/^ *|\| *$/g,"").split(/ *\| */),rows:t[3]&&t[3].trim()?t[3].replace(/\n[ \t]*$/,"").split("\n"):[]};if(e.header.length===e.align.length){e.raw=t[0];let r,n,a,o,i=e.align.length;for(r=0;r<i;r++)/^ *-+: *$/.test(e.align[r])?e.align[r]="right":/^ *:-+: *$/.test(e.align[r])?e.align[r]="center":/^ *:-+ *$/.test(e.align[r])?e.align[r]="left":e.align[r]=null;for(i=e.rows.length,r=0;r<i;r++)e.rows[r]=je(e.rows[r],e.header.length).map((e=>({text:e})));for(i=e.header.length,n=0;n<i;n++)e.header[n].tokens=[],this.lexer.inline(e.header[n].text,e.header[n].tokens);for(i=e.rows.length,n=0;n<i;n++)for(o=e.rows[n],a=0;a<o.length;a++)o[a].tokens=[],this.lexer.inline(o[a].text,o[a].tokens);return e}}}lheading(e){const t=this.rules.block.lheading.exec(e);if(t){const e={type:"heading",raw:t[0],depth:"="===t[2].charAt(0)?1:2,text:t[1],tokens:[]};return this.lexer.inline(e.text,e.tokens),e}}paragraph(e){const t=this.rules.block.paragraph.exec(e);if(t){const e={type:"paragraph",raw:t[0],text:"\n"===t[1].charAt(t[1].length-1)?t[1].slice(0,-1):t[1],tokens:[]};return this.lexer.inline(e.text,e.tokens),e}}text(e){const t=this.rules.block.text.exec(e);if(t){const e={type:"text",raw:t[0],text:t[0],tokens:[]};return this.lexer.inline(e.text,e.tokens),e}}escape(e){const t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:ye(t[1])}}tag(e){const t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&/^<a /i.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&/^<\/a>/i.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&/^<(pre|code|kbd|script)(\s|>)/i.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&/^<\/(pre|code|kbd|script)(\s|>)/i.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:this.options.sanitize?"text":"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,text:this.options.sanitize?this.options.sanitizer?this.options.sanitizer(t[0]):ye(t[0]):t[0]}}link(e){const t=this.rules.inline.link.exec(e);if(t){const e=t[2].trim();if(!this.options.pedantic&&/^</.test(e)){if(!/>$/.test(e))return;const t=_e(e.slice(0,-1),"\\");if((e.length-t.length)%2==0)return}else{const e=function(e,t){if(-1===e.indexOf(t[1]))return-1;const r=e.length;let n=0,a=0;for(;a<r;a++)if("\\"===e[a])a++;else if(e[a]===t[0])n++;else if(e[a]===t[1]&&(n--,n<0))return a;return-1}(t[2],"()");if(e>-1){const r=(0===t[0].indexOf("!")?5:4)+t[1].length+e;t[2]=t[2].substring(0,e),t[0]=t[0].substring(0,r).trim(),t[3]=""}}let r=t[2],n="";if(this.options.pedantic){const e=/^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(r);e&&(r=e[1],n=e[3])}else n=t[3]?t[3].slice(1,-1):"";return r=r.trim(),/^</.test(r)&&(r=this.options.pedantic&&!/>$/.test(e)?r.slice(1):r.slice(1,-1)),Re(t,{href:r?r.replace(this.rules.inline._escapes,"$1"):r,title:n?n.replace(this.rules.inline._escapes,"$1"):n},t[0],this.lexer)}}reflink(e,t){let r;if((r=this.rules.inline.reflink.exec(e))||(r=this.rules.inline.nolink.exec(e))){let e=(r[2]||r[1]).replace(/\s+/g," ");if(e=t[e.toLowerCase()],!e||!e.href){const e=r[0].charAt(0);return{type:"text",raw:e,text:e}}return Re(r,e,r[0],this.lexer)}}emStrong(e,t,r=""){let n=this.rules.inline.emStrong.lDelim.exec(e);if(!n)return;if(n[3]&&r.match(/[\p{L}\p{N}]/u))return;const a=n[1]||n[2]||"";if(!a||a&&(""===r||this.rules.inline.punctuation.exec(r))){const r=n[0].length-1;let a,o,i=r,s=0;const l="*"===n[0][0]?this.rules.inline.emStrong.rDelimAst:this.rules.inline.emStrong.rDelimUnd;for(l.lastIndex=0,t=t.slice(-1*e.length+r);null!=(n=l.exec(t));){if(a=n[1]||n[2]||n[3]||n[4]||n[5]||n[6],!a)continue;if(o=a.length,n[3]||n[4]){i+=o;continue}if((n[5]||n[6])&&r%3&&!((r+o)%3)){s+=o;continue}if(i-=o,i>0)continue;if(o=Math.min(o,o+i+s),Math.min(r,o)%2){const t=e.slice(1,r+n.index+o);return{type:"em",raw:e.slice(0,r+n.index+o+1),text:t,tokens:this.lexer.inlineTokens(t,[])}}const t=e.slice(2,r+n.index+o-1);return{type:"strong",raw:e.slice(0,r+n.index+o+1),text:t,tokens:this.lexer.inlineTokens(t,[])}}}}codespan(e){const t=this.rules.inline.code.exec(e);if(t){let e=t[2].replace(/\n/g," ");const r=/[^ ]/.test(e),n=/^ /.test(e)&&/ $/.test(e);return r&&n&&(e=e.substring(1,e.length-1)),e=ye(e,!0),{type:"codespan",raw:t[0],text:e}}}br(e){const t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e){const t=this.rules.inline.del.exec(e);if(t)return{type:"del",raw:t[0],text:t[2],tokens:this.lexer.inlineTokens(t[2],[])}}autolink(e,t){const r=this.rules.inline.autolink.exec(e);if(r){let e,n;return"@"===r[2]?(e=ye(this.options.mangle?t(r[1]):r[1]),n="mailto:"+e):(e=ye(r[1]),n=e),{type:"link",raw:r[0],text:e,href:n,tokens:[{type:"text",raw:e,text:e}]}}}url(e,t){let r;if(r=this.rules.inline.url.exec(e)){let e,n;if("@"===r[2])e=ye(this.options.mangle?t(r[0]):r[0]),n="mailto:"+e;else{let t;do{t=r[0],r[0]=this.rules.inline._backpedal.exec(r[0])[0]}while(t!==r[0]);e=ye(r[0]),n="www."===r[1]?"http://"+e:e}return{type:"link",raw:r[0],text:e,href:n,tokens:[{type:"text",raw:e,text:e}]}}}inlineText(e,t){const r=this.rules.inline.text.exec(e);if(r){let e;return e=this.lexer.state.inRawBlock?this.options.sanitize?this.options.sanitizer?this.options.sanitizer(r[0]):ye(r[0]):r[0]:ye(this.options.smartypants?t(r[0]):r[0]),{type:"text",raw:r[0],text:e}}}}const De={newline:/^(?: *(?:\n|$))+/,code:/^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,fences:/^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?=\n|$)|$)/,hr:/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,heading:/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,blockquote:/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,list:/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/,html:"^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))",def:/^ {0,3}\[(label)\]: *(?:\n *)?<?([^\s>]+)>?(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/,table:Te,lheading:/^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,_paragraph:/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,text:/^[^\n]+/,_label:/(?!\s*\])(?:\\.|[^\[\]\\])+/,_title:/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/};De.def=xe(De.def).replace("label",De._label).replace("title",De._title).getRegex(),De.bullet=/(?:[*+-]|\d{1,9}[.)])/,De.listItemStart=xe(/^( *)(bull) */).replace("bull",De.bullet).getRegex(),De.list=xe(De.list).replace(/bull/g,De.bullet).replace("hr","\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def","\\n+(?="+De.def.source+")").getRegex(),De._tag="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",De._comment=/<!--(?!-?>)[\s\S]*?(?:-->|$)/,De.html=xe(De.html,"i").replace("comment",De._comment).replace("tag",De._tag).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),De.paragraph=xe(De._paragraph).replace("hr",De.hr).replace("heading"," {0,3}#{1,6} ").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",De._tag).getRegex(),De.blockquote=xe(De.blockquote).replace("paragraph",De.paragraph).getRegex(),De.normal=Ce({},De),De.gfm=Ce({},De.normal,{table:"^ *([^\\n ].*\\|.*)\\n {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"}),De.gfm.table=xe(De.gfm.table).replace("hr",De.hr).replace("heading"," {0,3}#{1,6} ").replace("blockquote"," {0,3}>").replace("code"," {4}[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",De._tag).getRegex(),De.gfm.paragraph=xe(De._paragraph).replace("hr",De.hr).replace("heading"," {0,3}#{1,6} ").replace("|lheading","").replace("table",De.gfm.table).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",De._tag).getRegex(),De.pedantic=Ce({},De.normal,{html:xe("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment",De._comment).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Te,paragraph:xe(De.normal._paragraph).replace("hr",De.hr).replace("heading"," *#{1,6} *[^\n]").replace("lheading",De.lheading).replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").getRegex()});const Fe={escape:/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,autolink:/^<(scheme:[^\s\x00-\x1f<>]*|email)>/,url:Te,tag:"^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",link:/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,reflink:/^!?\[(label)\]\[(ref)\]/,nolink:/^!?\[(ref)\](?:\[\])?/,reflinkSearch:"reflink|nolink(?!\\()",emStrong:{lDelim:/^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,rDelimAst:/^[^_*]*?\_\_[^_*]*?\*[^_*]*?(?=\_\_)|[^*]+(?=[^*])|[punct_](\*+)(?=[\s]|$)|[^punct*_\s](\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|[^punct*_\s](\*+)(?=[^punct*_\s])/,rDelimUnd:/^[^_*]*?\*\*[^_*]*?\_[^_*]*?(?=\*\*)|[^_]+(?=[^_])|[punct*](\_+)(?=[\s]|$)|[^punct*_\s](\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/},code:/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,br:/^( {2,}|\\)\n(?!\s*$)/,del:Te,text:/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,punctuation:/^([\spunctuation])/};function Ne(e){return e.replace(/---/g,"—").replace(/--/g,"–").replace(/(^|[-\u2014/(\[{"\s])'/g,"$1‘").replace(/'/g,"’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g,"$1“").replace(/"/g,"”").replace(/\.{3}/g,"…")}function qe(e){let t,r,n="";const a=e.length;for(t=0;t<a;t++)r=e.charCodeAt(t),Math.random()>.5&&(r="x"+r.toString(16)),n+="&#"+r+";";return n}Fe._punctuation="!\"#$%&'()+\\-.,/:;<=>?@\\[\\]`^{|}~",Fe.punctuation=xe(Fe.punctuation).replace(/punctuation/g,Fe._punctuation).getRegex(),Fe.blockSkip=/\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g,Fe.escapedEmSt=/\\\*|\\_/g,Fe._comment=xe(De._comment).replace("(?:--\x3e|$)","--\x3e").getRegex(),Fe.emStrong.lDelim=xe(Fe.emStrong.lDelim).replace(/punct/g,Fe._punctuation).getRegex(),Fe.emStrong.rDelimAst=xe(Fe.emStrong.rDelimAst,"g").replace(/punct/g,Fe._punctuation).getRegex(),Fe.emStrong.rDelimUnd=xe(Fe.emStrong.rDelimUnd,"g").replace(/punct/g,Fe._punctuation).getRegex(),Fe._escapes=/\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g,Fe._scheme=/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/,Fe._email=/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/,Fe.autolink=xe(Fe.autolink).replace("scheme",Fe._scheme).replace("email",Fe._email).getRegex(),Fe._attribute=/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/,Fe.tag=xe(Fe.tag).replace("comment",Fe._comment).replace("attribute",Fe._attribute).getRegex(),Fe._label=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,Fe._href=/<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/,Fe._title=/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/,Fe.link=xe(Fe.link).replace("label",Fe._label).replace("href",Fe._href).replace("title",Fe._title).getRegex(),Fe.reflink=xe(Fe.reflink).replace("label",Fe._label).replace("ref",De._label).getRegex(),Fe.nolink=xe(Fe.nolink).replace("ref",De._label).getRegex(),Fe.reflinkSearch=xe(Fe.reflinkSearch,"g").replace("reflink",Fe.reflink).replace("nolink",Fe.nolink).getRegex(),Fe.normal=Ce({},Fe),Fe.pedantic=Ce({},Fe.normal,{strong:{start:/^__|\*\*/,middle:/^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,endAst:/\*\*(?!\*)/g,endUnd:/__(?!_)/g},em:{start:/^_|\*/,middle:/^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,endAst:/\*(?!\*)/g,endUnd:/_(?!_)/g},link:xe(/^!?\[(label)\]\((.*?)\)/).replace("label",Fe._label).getRegex(),reflink:xe(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Fe._label).getRegex()}),Fe.gfm=Ce({},Fe.normal,{escape:xe(Fe.escape).replace("])","~|])").getRegex(),_extended_email:/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,url:/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,_backpedal:/(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/}),Fe.gfm.url=xe(Fe.gfm.url,"i").replace("email",Fe.gfm._extended_email).getRegex(),Fe.breaks=Ce({},Fe.gfm,{br:xe(Fe.br).replace("{2,}","*").getRegex(),text:xe(Fe.gfm.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()});class ze{constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||ce,this.options.tokenizer=this.options.tokenizer||new Le,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const t={block:De.normal,inline:Fe.normal};this.options.pedantic?(t.block=De.pedantic,t.inline=Fe.pedantic):this.options.gfm&&(t.block=De.gfm,this.options.breaks?t.inline=Fe.breaks:t.inline=Fe.gfm),this.tokenizer.rules=t}static get rules(){return{block:De,inline:Fe}}static lex(e,t){return new ze(t).lex(e)}static lexInline(e,t){return new ze(t).inlineTokens(e)}lex(e){let t;for(e=e.replace(/\r\n|\r/g,"\n"),this.blockTokens(e,this.tokens);t=this.inlineQueue.shift();)this.inlineTokens(t.src,t.tokens);return this.tokens}blockTokens(e,t=[]){let r,n,a,o;for(e=this.options.pedantic?e.replace(/\t/g,"    ").replace(/^ +$/gm,""):e.replace(/^( *)(\t+)/gm,((e,t,r)=>t+"    ".repeat(r.length)));e;)if(!(this.options.extensions&&this.options.extensions.block&&this.options.extensions.block.some((n=>!!(r=n.call({lexer:this},e,t))&&(e=e.substring(r.raw.length),t.push(r),!0)))))if(r=this.tokenizer.space(e))e=e.substring(r.raw.length),1===r.raw.length&&t.length>0?t[t.length-1].raw+="\n":t.push(r);else if(r=this.tokenizer.code(e))e=e.substring(r.raw.length),n=t[t.length-1],!n||"paragraph"!==n.type&&"text"!==n.type?t.push(r):(n.raw+="\n"+r.raw,n.text+="\n"+r.text,this.inlineQueue[this.inlineQueue.length-1].src=n.text);else if(r=this.tokenizer.fences(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.heading(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.hr(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.blockquote(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.list(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.html(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.def(e))e=e.substring(r.raw.length),n=t[t.length-1],!n||"paragraph"!==n.type&&"text"!==n.type?this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title}):(n.raw+="\n"+r.raw,n.text+="\n"+r.raw,this.inlineQueue[this.inlineQueue.length-1].src=n.text);else if(r=this.tokenizer.table(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.lheading(e))e=e.substring(r.raw.length),t.push(r);else{if(a=e,this.options.extensions&&this.options.extensions.startBlock){let t=1/0;const r=e.slice(1);let n;this.options.extensions.startBlock.forEach((function(e){n=e.call({lexer:this},r),"number"==typeof n&&n>=0&&(t=Math.min(t,n))})),t<1/0&&t>=0&&(a=e.substring(0,t+1))}if(this.state.top&&(r=this.tokenizer.paragraph(a)))n=t[t.length-1],o&&"paragraph"===n.type?(n.raw+="\n"+r.raw,n.text+="\n"+r.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=n.text):t.push(r),o=a.length!==e.length,e=e.substring(r.raw.length);else if(r=this.tokenizer.text(e))e=e.substring(r.raw.length),n=t[t.length-1],n&&"text"===n.type?(n.raw+="\n"+r.raw,n.text+="\n"+r.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=n.text):t.push(r);else if(e){const t="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(t);break}throw new Error(t)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){let r,n,a,o,i,s,l=e;if(this.tokens.links){const e=Object.keys(this.tokens.links);if(e.length>0)for(;null!=(o=this.tokenizer.rules.inline.reflinkSearch.exec(l));)e.includes(o[0].slice(o[0].lastIndexOf("[")+1,-1))&&(l=l.slice(0,o.index)+"["+Ie("a",o[0].length-2)+"]"+l.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;null!=(o=this.tokenizer.rules.inline.blockSkip.exec(l));)l=l.slice(0,o.index)+"["+Ie("a",o[0].length-2)+"]"+l.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);for(;null!=(o=this.tokenizer.rules.inline.escapedEmSt.exec(l));)l=l.slice(0,o.index)+"++"+l.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex);for(;e;)if(i||(s=""),i=!1,!(this.options.extensions&&this.options.extensions.inline&&this.options.extensions.inline.some((n=>!!(r=n.call({lexer:this},e,t))&&(e=e.substring(r.raw.length),t.push(r),!0)))))if(r=this.tokenizer.escape(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.tag(e))e=e.substring(r.raw.length),n=t[t.length-1],n&&"text"===r.type&&"text"===n.type?(n.raw+=r.raw,n.text+=r.text):t.push(r);else if(r=this.tokenizer.link(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.reflink(e,this.tokens.links))e=e.substring(r.raw.length),n=t[t.length-1],n&&"text"===r.type&&"text"===n.type?(n.raw+=r.raw,n.text+=r.text):t.push(r);else if(r=this.tokenizer.emStrong(e,l,s))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.codespan(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.br(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.del(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.autolink(e,qe))e=e.substring(r.raw.length),t.push(r);else if(this.state.inLink||!(r=this.tokenizer.url(e,qe))){if(a=e,this.options.extensions&&this.options.extensions.startInline){let t=1/0;const r=e.slice(1);let n;this.options.extensions.startInline.forEach((function(e){n=e.call({lexer:this},r),"number"==typeof n&&n>=0&&(t=Math.min(t,n))})),t<1/0&&t>=0&&(a=e.substring(0,t+1))}if(r=this.tokenizer.inlineText(a,Ne))e=e.substring(r.raw.length),"_"!==r.raw.slice(-1)&&(s=r.raw.slice(-1)),i=!0,n=t[t.length-1],n&&"text"===n.type?(n.raw+=r.raw,n.text+=r.text):t.push(r);else if(e){const t="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(t);break}throw new Error(t)}}else e=e.substring(r.raw.length),t.push(r);return t}}class Ue{constructor(e){this.options=e||ce}code(e,t,r){const n=(t||"").match(/\S*/)[0];if(this.options.highlight){const t=this.options.highlight(e,n);null!=t&&t!==e&&(r=!0,e=t)}return e=e.replace(/\n$/,"")+"\n",n?'<pre><code class="'+this.options.langPrefix+ye(n,!0)+'">'+(r?e:ye(e,!0))+"</code></pre>\n":"<pre><code>"+(r?e:ye(e,!0))+"</code></pre>\n"}blockquote(e){return`<blockquote>\n${e}</blockquote>\n`}html(e){return e}heading(e,t,r,n){if(this.options.headerIds){return`<h${t} id="${this.options.headerPrefix+n.slug(r)}">${e}</h${t}>\n`}return`<h${t}>${e}</h${t}>\n`}hr(){return this.options.xhtml?"<hr/>\n":"<hr>\n"}list(e,t,r){const n=t?"ol":"ul";return"<"+n+(t&&1!==r?' start="'+r+'"':"")+">\n"+e+"</"+n+">\n"}listitem(e){return`<li>${e}</li>\n`}checkbox(e){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox"'+(this.options.xhtml?" /":"")+"> "}paragraph(e){return`<p>${e}</p>\n`}table(e,t){return t&&(t=`<tbody>${t}</tbody>`),"<table>\n<thead>\n"+e+"</thead>\n"+t+"</table>\n"}tablerow(e){return`<tr>\n${e}</tr>\n`}tablecell(e,t){const r=t.header?"th":"td";return(t.align?`<${r} align="${t.align}">`:`<${r}>`)+e+`</${r}>\n`}strong(e){return`<strong>${e}</strong>`}em(e){return`<em>${e}</em>`}codespan(e){return`<code>${e}</code>`}br(){return this.options.xhtml?"<br/>":"<br>"}del(e){return`<del>${e}</del>`}link(e,t,r){if(null===(e=ke(this.options.sanitize,this.options.baseUrl,e)))return r;let n='<a href="'+ye(e)+'"';return t&&(n+=' title="'+t+'"'),n+=">"+r+"</a>",n}image(e,t,r){if(null===(e=ke(this.options.sanitize,this.options.baseUrl,e)))return r;let n=`<img src="${e}" alt="${r}"`;return t&&(n+=` title="${t}"`),n+=this.options.xhtml?"/>":">",n}text(e){return e}}class Be{strong(e){return e}em(e){return e}codespan(e){return e}del(e){return e}html(e){return e}text(e){return e}link(e,t,r){return""+r}image(e,t,r){return""+r}br(){return""}}class Me{constructor(){this.seen={}}serialize(e){return e.toLowerCase().trim().replace(/<[!\/a-z].*?>/gi,"").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g,"").replace(/\s/g,"-")}getNextSafeSlug(e,t){let r=e,n=0;if(this.seen.hasOwnProperty(r)){n=this.seen[e];do{n++,r=e+"-"+n}while(this.seen.hasOwnProperty(r))}return t||(this.seen[e]=n,this.seen[r]=0),r}slug(e,t={}){const r=this.serialize(e);return this.getNextSafeSlug(r,t.dryrun)}}class He{constructor(e){this.options=e||ce,this.options.renderer=this.options.renderer||new Ue,this.renderer=this.options.renderer,this.renderer.options=this.options,this.textRenderer=new Be,this.slugger=new Me}static parse(e,t){return new He(t).parse(e)}static parseInline(e,t){return new He(t).parseInline(e)}parse(e,t=!0){let r,n,a,o,i,s,l,c,p,d,u,h,f,m,y,g,v,b,x,w="";const $=e.length;for(r=0;r<$;r++)if(d=e[r],this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[d.type]&&(x=this.options.extensions.renderers[d.type].call({parser:this},d),!1!==x||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(d.type)))w+=x||"";else switch(d.type){case"space":continue;case"hr":w+=this.renderer.hr();continue;case"heading":w+=this.renderer.heading(this.parseInline(d.tokens),d.depth,ve(this.parseInline(d.tokens,this.textRenderer)),this.slugger);continue;case"code":w+=this.renderer.code(d.text,d.lang,d.escaped);continue;case"table":for(c="",l="",o=d.header.length,n=0;n<o;n++)l+=this.renderer.tablecell(this.parseInline(d.header[n].tokens),{header:!0,align:d.align[n]});for(c+=this.renderer.tablerow(l),p="",o=d.rows.length,n=0;n<o;n++){for(s=d.rows[n],l="",i=s.length,a=0;a<i;a++)l+=this.renderer.tablecell(this.parseInline(s[a].tokens),{header:!1,align:d.align[a]});p+=this.renderer.tablerow(l)}w+=this.renderer.table(c,p);continue;case"blockquote":p=this.parse(d.tokens),w+=this.renderer.blockquote(p);continue;case"list":for(u=d.ordered,h=d.start,f=d.loose,o=d.items.length,p="",n=0;n<o;n++)y=d.items[n],g=y.checked,v=y.task,m="",y.task&&(b=this.renderer.checkbox(g),f?y.tokens.length>0&&"paragraph"===y.tokens[0].type?(y.tokens[0].text=b+" "+y.tokens[0].text,y.tokens[0].tokens&&y.tokens[0].tokens.length>0&&"text"===y.tokens[0].tokens[0].type&&(y.tokens[0].tokens[0].text=b+" "+y.tokens[0].tokens[0].text)):y.tokens.unshift({type:"text",text:b}):m+=b),m+=this.parse(y.tokens,f),p+=this.renderer.listitem(m,v,g);w+=this.renderer.list(p,u,h);continue;case"html":w+=this.renderer.html(d.text);continue;case"paragraph":w+=this.renderer.paragraph(this.parseInline(d.tokens));continue;case"text":for(p=d.tokens?this.parseInline(d.tokens):d.text;r+1<$&&"text"===e[r+1].type;)d=e[++r],p+="\n"+(d.tokens?this.parseInline(d.tokens):d.text);w+=t?this.renderer.paragraph(p):p;continue;default:{const e='Token with "'+d.type+'" type was not found.';if(this.options.silent)return void console.error(e);throw new Error(e)}}return w}parseInline(e,t){t=t||this.renderer;let r,n,a,o="";const i=e.length;for(r=0;r<i;r++)if(n=e[r],this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[n.type]&&(a=this.options.extensions.renderers[n.type].call({parser:this},n),!1!==a||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(n.type)))o+=a||"";else switch(n.type){case"escape":case"text":o+=t.text(n.text);break;case"html":o+=t.html(n.text);break;case"link":o+=t.link(n.href,n.title,this.parseInline(n.tokens,t));break;case"image":o+=t.image(n.href,n.title,n.text);break;case"strong":o+=t.strong(this.parseInline(n.tokens,t));break;case"em":o+=t.em(this.parseInline(n.tokens,t));break;case"codespan":o+=t.codespan(n.text);break;case"br":o+=t.br();break;case"del":o+=t.del(this.parseInline(n.tokens,t));break;default:{const e='Token with "'+n.type+'" type was not found.';if(this.options.silent)return void console.error(e);throw new Error(e)}}return o}}function We(e,t,r){if(null==e)throw new Error("marked(): input parameter is undefined or null");if("string"!=typeof e)throw new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected");if("function"==typeof t&&(r=t,t=null),Pe(t=Ce({},We.defaults,t||{})),r){const n=t.highlight;let a;try{a=ze.lex(e,t)}catch(e){return r(e)}const o=function(e){let o;if(!e)try{t.walkTokens&&We.walkTokens(a,t.walkTokens),o=He.parse(a,t)}catch(t){e=t}return t.highlight=n,e?r(e):r(null,o)};if(!n||n.length<3)return o();if(delete t.highlight,!a.length)return o();let i=0;return We.walkTokens(a,(function(e){"code"===e.type&&(i++,setTimeout((()=>{n(e.text,e.lang,(function(t,r){if(t)return o(t);null!=r&&r!==e.text&&(e.text=r,e.escaped=!0),i--,0===i&&o()}))}),0))})),void(0===i&&o())}try{const r=ze.lex(e,t);return t.walkTokens&&We.walkTokens(r,t.walkTokens),He.parse(r,t)}catch(e){if(e.message+="\nPlease report this to https://github.com/markedjs/marked.",t.silent)return"<p>An error occurred:</p><pre>"+ye(e.message+"",!0)+"</pre>";throw e}}We.options=We.setOptions=function(e){var t;return Ce(We.defaults,e),t=We.defaults,ce=t,We},We.getDefaults=le,We.defaults=ce,We.use=function(...e){const t=Ce({},...e),r=We.defaults.extensions||{renderers:{},childTokens:{}};let n;e.forEach((e=>{if(e.extensions&&(n=!0,e.extensions.forEach((e=>{if(!e.name)throw new Error("extension name required");if(e.renderer){const t=r.renderers?r.renderers[e.name]:null;r.renderers[e.name]=t?function(...r){let n=e.renderer.apply(this,r);return!1===n&&(n=t.apply(this,r)),n}:e.renderer}if(e.tokenizer){if(!e.level||"block"!==e.level&&"inline"!==e.level)throw new Error("extension level must be 'block' or 'inline'");r[e.level]?r[e.level].unshift(e.tokenizer):r[e.level]=[e.tokenizer],e.start&&("block"===e.level?r.startBlock?r.startBlock.push(e.start):r.startBlock=[e.start]:"inline"===e.level&&(r.startInline?r.startInline.push(e.start):r.startInline=[e.start]))}e.childTokens&&(r.childTokens[e.name]=e.childTokens)}))),e.renderer){const r=We.defaults.renderer||new Ue;for(const t in e.renderer){const n=r[t];r[t]=(...a)=>{let o=e.renderer[t].apply(r,a);return!1===o&&(o=n.apply(r,a)),o}}t.renderer=r}if(e.tokenizer){const r=We.defaults.tokenizer||new Le;for(const t in e.tokenizer){const n=r[t];r[t]=(...a)=>{let o=e.tokenizer[t].apply(r,a);return!1===o&&(o=n.apply(r,a)),o}}t.tokenizer=r}if(e.walkTokens){const r=We.defaults.walkTokens;t.walkTokens=function(t){e.walkTokens.call(this,t),r&&r.call(this,t)}}n&&(t.extensions=r),We.setOptions(t)}))},We.walkTokens=function(e,t){for(const r of e)switch(t.call(We,r),r.type){case"table":for(const e of r.header)We.walkTokens(e.tokens,t);for(const e of r.rows)for(const r of e)We.walkTokens(r.tokens,t);break;case"list":We.walkTokens(r.items,t);break;default:We.defaults.extensions&&We.defaults.extensions.childTokens&&We.defaults.extensions.childTokens[r.type]?We.defaults.extensions.childTokens[r.type].forEach((function(e){We.walkTokens(r[e],t)})):r.tokens&&We.walkTokens(r.tokens,t)}},We.parseInline=function(e,t){if(null==e)throw new Error("marked.parseInline(): input parameter is undefined or null");if("string"!=typeof e)throw new Error("marked.parseInline(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected");Pe(t=Ce({},We.defaults,t||{}));try{const r=ze.lexInline(e,t);return t.walkTokens&&We.walkTokens(r,t.walkTokens),He.parseInline(r,t)}catch(e){if(e.message+="\nPlease report this to https://github.com/markedjs/marked.",t.silent)return"<p>An error occurred:</p><pre>"+ye(e.message+"",!0)+"</pre>";throw e}},We.Parser=He,We.parser=He.parse,We.Renderer=Ue,We.TextRenderer=Be,We.Lexer=ze,We.lexer=ze.lex,We.Tokenizer=Le,We.Slugger=Me,We.parse=We;We.options,We.setOptions,We.use,We.walkTokens,We.parseInline,He.parse,ze.lex;var Ve=r(660),Ge=r.n(Ve);r(251),r(358),r(46),r(503),r(277),r(874),r(366),r(57),r(16);const Ke=c`
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
    font-weight:bold;
    margin-bottom:8px;
    text-align:left;
  }
  .tiny-title { 
    font-size:calc(var(--font-size-small) + 1px); 
    font-weight:bold; 
  }
  .regular-font-size { font-size: var(--font-size-regular); }
  .small-font-size { font-size: var(--font-size-small); }
  .upper { text-transform: uppercase; }
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
  .method-fg.put { color: var(--orange); }
  .method-fg.post { color: var(--green); }
  .method-fg.get { color: var(--blue); }
  .method-fg.delete { color: var(--red); }
  .method-fg.options, 
  .method-fg.head, 
  .method-fg.patch { 
    color: var(--yellow); 
  }

  h1{ font-family:var(--font-regular); font-size:28px; padding-top: 10px; letter-spacing:normal; font-weight:normal; }
  h2{ font-family:var(--font-regular); font-size:24px; padding-top: 10px; letter-spacing:normal; font-weight:normal; }
  h3{ font-family:var(--font-regular); font-size:18px; padding-top: 10px; letter-spacing:normal; font-weight:normal; }
  h4{ font-family:var(--font-regular); font-size:16px; padding-top: 10px; letter-spacing:normal; font-weight:normal; }
  h5{ font-family:var(--font-regular); font-size:14px; padding-top: 10px; letter-spacing:normal; font-weight:normal; }
  h6{ font-family:var(--font-regular); font-size:14px; padding-top: 10px; letter-spacing:normal; font-weight:normal; }

  h1,h2,h3,h4,h5,h5{
    margin-block-end: 0.2em;
  }
  p { margin-block-start: 0.5em; }
  a { color: var(--blue); cursor:pointer; }
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

  .m-markdown,
  .m-markdown-small {
    display:block;
  }

  .m-markdown p,
  .m-markdown span {
    font-size: var(--font-size-regular);
    line-height:calc(var(--font-size-regular) + 8px);
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

  .m-markdown p:not(:first-child) {
    margin-block-start: 24px;
  }

  .m-markdown-small p:not(:first-child) {
    margin-block-start: 12px;
  }
  .m-markdown-small p:first-child {
    margin-block-start: 0;
  }

  .m-markdown p,
  .m-markdown-small p {
    margin-block-end: 0
  }

  .m-markdown code span {
    font-size:var(--font-size-mono);
  }

  .m-markdown-small code,
  .m-markdown code {
    padding: 1px 6px;
    border-radius: 2px;
    color: var(--inline-code-fg);
    background-color: var(--bg3);
    font-size: calc(var(--font-size-mono));
    line-height: 1.2;
  }

  .m-markdown-small code {
    font-size: calc(var(--font-size-mono) - 1px);
  }

  .m-markdown-small pre,
  .m-markdown pre {
    white-space: pre-wrap;
    overflow-x: auto;
    line-height: normal;
    border-radius: 2px;
    border: 1px solid var(--code-border-color);
  }

  .m-markdown pre {
    padding: 12px;
    background-color: var(--code-bg);
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
    color: var(--code-fg);
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
    color:var(--blue);
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

  .m-markdown blockquote,
  .m-markdown-small blockquote {
    margin-inline-start: 0;
    margin-inline-end: 0;
    border-left: 3px solid var(--border-color);
    padding: 6px 0 6px 6px;
  }
  .m-markdown hr{
    border: 1px solid var(--border-color);
  }
`,Je=c`
/* Button */
.m-btn {
  border-radius: var(--border-radius);
  font-weight: 600;
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

input, textarea, select, button, pre {
  color:var(--fg);
  outline: none;
  background-color: var(--input-bg);
  border: 1px solid var(--border-color);
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
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: var(--font-size-small);
  transition: border .2s;
  padding: 6px 5px;
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
  border:1px solid var(--primary-color);
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
  color:var(--blue);
  font-family:var(--font-mono);
  margin-bottom:2px;
}

input[type="checkbox"]:focus{
  outline:0;
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
  box-shadow: inset 0 0 0 13px var(--green);
  border-color: var(--green);
}
/* Toggle Thumb - Checked*/
input[type="checkbox"]:checked:after {
  border: 1px solid var(--green);
  left: 16px;
  right: 1px;
  transition: border .25s, left .15s .25s, right .25s .175s;
}
`,Ye=c`
.row, .col{
  display:flex;
} 
.row {
  align-items:center;
  flex-direction: row;
}
.col {
  align-items:stretch;
  flex-direction: column;
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
  font-size:var(--font-size-small);
  font-weight:bold;
  vertical-align: middle;
  margin: 12px 0 4px 0;
}
`,Qe=c`
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
  border-color:var(--orange); 
  background-color:var(--light-orange); 
}
.m-endpoint > .endpoint-head.post:hover,
.m-endpoint > .endpoint-head.post.expanded {
  border-color:var(--green); 
  background-color:var(--light-green); 
}
.m-endpoint > .endpoint-head.get:hover,
.m-endpoint > .endpoint-head.get.expanded {
  border-color:var(--blue); 
  background-color:var(--light-blue); 
}
.m-endpoint > .endpoint-head.delete:hover,
.m-endpoint > .endpoint-head.delete.expanded {
  border-color:var(--red); 
  background-color:var(--light-red); 
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
  border-width:0px 1px 1px 5px;
  border-style:solid;
  box-shadow: 0px 4px 3px -3px rgba(0, 0, 0, 0.15);
}
.m-endpoint .endpoint-body.delete{ border-color:var(--red); }
.m-endpoint .endpoint-body.put{ border-color:var(--orange); }
.m-endpoint .endpoint-body.post{border-color:var(--green);}
.m-endpoint .endpoint-body.get{ border-color:var(--blue); }
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
  padding:8px 8px;
}
.summary .title{
  font-size:calc(var(--font-size-regular) + 2px);
  margin-bottom: 6px;
  word-break: break-all;
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
.endpoint-head .method.delete{ border: 2px solid var(--red);}
.endpoint-head .method.put{ border: 2px solid var(--orange); }
.endpoint-head .method.post{ border: 2px solid var(--green); }
.endpoint-head .method.get{ border: 2px solid var(--blue); }
.endpoint-head .method.get.deprecated{ border: 2px solid var(--border-color); }
.endpoint-head .method.head,
.endpoint-head .method.patch,
.endpoint-head .method.options { 
  border: 2px solid var(--yellow); 
}

.req-resp-container{
  display: flex;
  margin-top:16px;
  align-items: stretch;
  flex-wrap: wrap;
  flex-direction: column;
  border-top:1px solid var(--light-border-color);
}

.view-mode-request,
api-response.view-mode {
  flex:1; 
  min-height:100px;
  padding:16px 8px;
  overflow:hidden;
}
.view-mode-request {
  border-width:0 0 1px 0;
  border-style:dashed;
}

.head .view-mode-request,
.patch .view-mode-request,
.options .view-mode-request { 
  border-color:var(--yellow); 
}
.put .view-mode-request { 
  border-color:var(--orange); 
}
.post .view-mode-request { 
  border-color:var(--green); 
}
.get .view-mode-request { 
  border-color:var(--blue); 
}
.delete .view-mode-request { 
  border-color:var(--red); 
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
    padding:8px 16px;
  }
}
`,Xe=c`
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
  color: var(--blue);
}

.token.boolean,
.token.number,
.token.function {
  color: var(--red);
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
`,et=c`
.tab-panel {
  border: none;
}
.tab-buttons {
  height:30px;
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
  border-bottom: 3px solid transparent; 
  color: var(--light-fg);
  background-color: transparent;
  white-space: nowrap;
  cursor:pointer;
  outline:none;
  font-family:var(--font-regular); 
  font-size:var(--font-size-small);
  margin-right:16px;
  padding:1px;
}
.tab-btn.active {
  border-bottom: 3px solid var(--primary-color); 
  font-weight:bold;
  color:var(--primary-color);
}

.tab-btn:hover {
  color:var(--primary-color);
}
.tab-content {
  margin:-1px 0 0 0;
  position:relative;
  min-height: 50px;
}
`,tt=c`
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

.nav-bar-tag-icon {
  color: var(--nav-text-color);
  font-size: 20px; 
}
.nav-bar-tag-icon:hover {
  color:var(--nav-hover-text-color);
}
.nav-bar.focused .nav-bar-tag-and-paths.collapsed .nav-bar-paths-under-tag {
  display:none;
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
  cursor:pointer;
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

.nav-bar-h1.active,
.nav-bar-h2.active,
.nav-bar-info.active,
.nav-bar-tag.active,
.nav-bar-path.active,
.nav-bar-section.operations.active {
  border-left:4px solid var(--nav-accent-color);
  color:var(--nav-hover-text-color);
}

.nav-bar-h1:hover,
.nav-bar-h2:hover,
.nav-bar-info:hover,
.nav-bar-tag:hover,
.nav-bar-path:hover {
  color:var(--nav-hover-text-color);
  background-color:var(--nav-hover-bg-color);
}
`,rt=c`
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
`,nt=c`

`;const at=/[\s#:?&={}]/g,ot="_rapidoc_api_key";function it(e){return new Promise((t=>setTimeout(t,e)))}function st(e,t){const r=t.currentTarget,n=document.createElement("textarea");n.value=e,n.style.position="fixed",document.body.appendChild(n),n.focus(),n.select();try{document.execCommand("copy"),r.innerText="Copied",setTimeout((()=>{r.innerText="Copy"}),5e3)}catch(e){console.error("Unable to copy",e)}document.body.removeChild(n)}function lt(e,t,r="includes"){if("includes"===r){return`${t.method} ${t.path} ${t.summary||t.description||""} ${t.operationId||""}`.toLowerCase().includes(e.toLowerCase())}return new RegExp(e,"i").test(`${t.method} ${t.path}`)}function ct(e,t=new Set){return e?(Object.keys(e).forEach((r=>{var n;if(t.add(r),e[r].properties)ct(e[r].properties,t);else if(null!==(n=e[r].items)&&void 0!==n&&n.properties){var a;ct(null===(a=e[r].items)||void 0===a?void 0:a.properties,t)}})),t):t}function pt(e,t){if(e){const r=document.createElement("a");document.body.appendChild(r),r.style="display: none",r.href=e,r.download=t,r.click(),r.remove()}}function dt(e){if(e){const t=document.createElement("a");document.body.appendChild(t),t.style="display: none",t.href=e,t.target="_blank",t.click(),t.remove()}}function ut(e){return e&&e.t&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var ht=function(e){return e&&e.Math==Math&&e},ft=ht("object"==typeof globalThis&&globalThis)||ht("object"==typeof window&&window)||ht("object"==typeof self&&self)||ht("object"==typeof ft&&ft)||function(){return this}()||Function("return this")(),mt=function(e){try{return!!e()}catch(e){return!0}},yt=!mt((function(){var e=function(){}.bind();return"function"!=typeof e||e.hasOwnProperty("prototype")})),gt=yt,vt=Function.prototype,bt=vt.apply,xt=vt.call,wt="object"==typeof Reflect&&Reflect.apply||(gt?xt.bind(bt):function(){return xt.apply(bt,arguments)}),$t=yt,kt=Function.prototype,St=kt.bind,At=kt.call,Ot=$t&&St.bind(At,At),Et=$t?function(e){return e&&Ot(e)}:function(e){return e&&function(){return At.apply(e,arguments)}},Tt=function(e){return"function"==typeof e},Ct={},jt=!mt((function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]})),_t=yt,Pt=Function.prototype.call,It=_t?Pt.bind(Pt):function(){return Pt.apply(Pt,arguments)},Rt={},Lt={}.propertyIsEnumerable,Dt=Object.getOwnPropertyDescriptor,Ft=Dt&&!Lt.call({1:2},1);Rt.f=Ft?function(e){var t=Dt(this,e);return!!t&&t.enumerable}:Lt;var Nt,qt,zt=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}},Ut=Et,Bt=Ut({}.toString),Mt=Ut("".slice),Ht=function(e){return Mt(Bt(e),8,-1)},Wt=Et,Vt=mt,Gt=Ht,Kt=ft.Object,Jt=Wt("".split),Yt=Vt((function(){return!Kt("z").propertyIsEnumerable(0)}))?function(e){return"String"==Gt(e)?Jt(e,""):Kt(e)}:Kt,Zt=ft.TypeError,Qt=function(e){if(null==e)throw Zt("Can't call method on "+e);return e},Xt=Yt,er=Qt,tr=function(e){return Xt(er(e))},rr=Tt,nr=function(e){return"object"==typeof e?null!==e:rr(e)},ar={},or=ar,ir=ft,sr=Tt,lr=function(e){return sr(e)?e:void 0},cr=function(e,t){return arguments.length<2?lr(or[e])||lr(ir[e]):or[e]&&or[e][t]||ir[e]&&ir[e][t]},pr=Et({}.isPrototypeOf),dr=cr("navigator","userAgent")||"",ur=ft,hr=dr,fr=ur.process,mr=ur.Deno,yr=fr&&fr.versions||mr&&mr.version,gr=yr&&yr.v8;gr&&(qt=(Nt=gr.split("."))[0]>0&&Nt[0]<4?1:+(Nt[0]+Nt[1])),!qt&&hr&&(!(Nt=hr.match(/Edge\/(\d+)/))||Nt[1]>=74)&&(Nt=hr.match(/Chrome\/(\d+)/))&&(qt=+Nt[1]);var vr=qt,br=vr,xr=mt,wr=!!Object.getOwnPropertySymbols&&!xr((function(){var e=Symbol();return!String(e)||!(Object(e)instanceof Symbol)||!Symbol.sham&&br&&br<41})),$r=wr&&!Symbol.sham&&"symbol"==typeof Symbol.iterator,kr=cr,Sr=Tt,Ar=pr,Or=$r,Er=ft.Object,Tr=Or?function(e){return"symbol"==typeof e}:function(e){var t=kr("Symbol");return Sr(t)&&Ar(t.prototype,Er(e))},Cr=ft.String,jr=function(e){try{return Cr(e)}catch(e){return"Object"}},_r=Tt,Pr=jr,Ir=ft.TypeError,Rr=function(e){if(_r(e))return e;throw Ir(Pr(e)+" is not a function")},Lr=Rr,Dr=function(e,t){var r=e[t];return null==r?void 0:Lr(r)},Fr=It,Nr=Tt,qr=nr,zr=ft.TypeError,Ur={exports:{}},Br=ft,Mr=Object.defineProperty,Hr=ft.i||function(e,t){try{Mr(Br,e,{value:t,configurable:!0,writable:!0})}catch(r){Br[e]=t}return t}("__core-js_shared__",{}),Wr=Hr;(Ur.exports=function(e,t){return Wr[e]||(Wr[e]=void 0!==t?t:{})})("versions",[]).push({version:"3.21.1",mode:"pure",copyright:"© 2014-2022 Denis Pushkarev (zloirock.ru)",license:"https://github.com/zloirock/core-js/blob/v3.21.1/LICENSE",source:"https://github.com/zloirock/core-js"});var Vr=Qt,Gr=ft.Object,Kr=function(e){return Gr(Vr(e))},Jr=Kr,Yr=Et({}.hasOwnProperty),Zr=Object.hasOwn||function(e,t){return Yr(Jr(e),t)},Qr=Et,Xr=0,en=Math.random(),tn=Qr(1..toString),rn=function(e){return"Symbol("+(void 0===e?"":e)+")_"+tn(++Xr+en,36)},nn=ft,an=Ur.exports,on=Zr,sn=rn,ln=wr,cn=$r,pn=an("wks"),dn=nn.Symbol,un=dn&&dn.for,hn=cn?dn:dn&&dn.withoutSetter||sn,fn=function(e){if(!on(pn,e)||!ln&&"string"!=typeof pn[e]){var t="Symbol."+e;ln&&on(dn,e)?pn[e]=dn[e]:pn[e]=cn&&un?un(t):hn(t)}return pn[e]},mn=It,yn=nr,gn=Tr,vn=Dr,bn=fn,xn=ft.TypeError,wn=bn("toPrimitive"),$n=function(e,t){if(!yn(e)||gn(e))return e;var r,n=vn(e,wn);if(n){if(void 0===t&&(t="default"),r=mn(n,e,t),!yn(r)||gn(r))return r;throw xn("Can't convert object to primitive value")}return void 0===t&&(t="number"),function(e,t){var r,n;if("string"===t&&Nr(r=e.toString)&&!qr(n=Fr(r,e)))return n;if(Nr(r=e.valueOf)&&!qr(n=Fr(r,e)))return n;if("string"!==t&&Nr(r=e.toString)&&!qr(n=Fr(r,e)))return n;throw zr("Can't convert object to primitive value")}(e,t)},kn=Tr,Sn=function(e){var t=$n(e,"string");return kn(t)?t:t+""},An=nr,On=ft.document,En=An(On)&&An(On.createElement),Tn=function(e){return En?On.createElement(e):{}},Cn=Tn,jn=!jt&&!mt((function(){return 7!=Object.defineProperty(Cn("div"),"a",{get:function(){return 7}}).a})),_n=jt,Pn=It,In=Rt,Rn=zt,Ln=tr,Dn=Sn,Fn=Zr,Nn=jn,qn=Object.getOwnPropertyDescriptor;Ct.f=_n?qn:function(e,t){if(e=Ln(e),t=Dn(t),Nn)try{return qn(e,t)}catch(e){}if(Fn(e,t))return Rn(!Pn(In.f,e,t),e[t])};var zn=mt,Un=Tt,Bn=/#|\.prototype\./,Mn=function(e,t){var r=Wn[Hn(e)];return r==Gn||r!=Vn&&(Un(t)?zn(t):!!t)},Hn=Mn.normalize=function(e){return String(e).replace(Bn,".").toLowerCase()},Wn=Mn.data={},Vn=Mn.NATIVE="N",Gn=Mn.POLYFILL="P",Kn=Mn,Jn=Rr,Yn=yt,Zn=Et(Et.bind),Qn=function(e,t){return Jn(e),void 0===t?e:Yn?Zn(e,t):function(){return e.apply(t,arguments)}},Xn={},ea=jt&&mt((function(){return 42!=Object.defineProperty((function(){}),"prototype",{value:42,writable:!1}).prototype})),ta=ft,ra=nr,na=ta.String,aa=ta.TypeError,oa=function(e){if(ra(e))return e;throw aa(na(e)+" is not an object")},ia=jt,sa=jn,la=ea,ca=oa,pa=Sn,da=ft.TypeError,ua=Object.defineProperty,ha=Object.getOwnPropertyDescriptor;Xn.f=ia?la?function(e,t,r){if(ca(e),t=pa(t),ca(r),"function"==typeof e&&"prototype"===t&&"value"in r&&"writable"in r&&!r.writable){var n=ha(e,t);n&&n.writable&&(e[t]=r.value,r={configurable:"configurable"in r?r.configurable:n.configurable,enumerable:"enumerable"in r?r.enumerable:n.enumerable,writable:!1})}return ua(e,t,r)}:ua:function(e,t,r){if(ca(e),t=pa(t),ca(r),sa)try{return ua(e,t,r)}catch(e){}if("get"in r||"set"in r)throw da("Accessors not supported");return"value"in r&&(e[t]=r.value),e};var fa=Xn,ma=zt,ya=jt?function(e,t,r){return fa.f(e,t,ma(1,r))}:function(e,t,r){return e[t]=r,e},ga=ft,va=wt,ba=Et,xa=Tt,wa=Ct.f,$a=Kn,ka=ar,Sa=Qn,Aa=ya,Oa=Zr,Ea=function(e){var t=function(r,n,a){if(this instanceof t){switch(arguments.length){case 0:return new e;case 1:return new e(r);case 2:return new e(r,n)}return new e(r,n,a)}return va(e,this,arguments)};return t.prototype=e.prototype,t},Ta=function(e,t){var r,n,a,o,i,s,l,c,p=e.target,d=e.global,u=e.stat,h=e.proto,f=d?ga:u?ga[p]:(ga[p]||{}).prototype,m=d?ka:ka[p]||Aa(ka,p,{})[p],y=m.prototype;for(a in t)r=!$a(d?a:p+(u?".":"#")+a,e.forced)&&f&&Oa(f,a),i=m[a],r&&(s=e.noTargetGet?(c=wa(f,a))&&c.value:f[a]),o=r&&s?s:t[a],r&&typeof i==typeof o||(l=e.bind&&r?Sa(o,ga):e.wrap&&r?Ea(o):h&&xa(o)?ba(o):o,(e.sham||o&&o.sham||i&&i.sham)&&Aa(l,"sham",!0),Aa(m,a,l),h&&(Oa(ka,n=p+"Prototype")||Aa(ka,n,{}),Aa(ka[n],a,o),e.real&&y&&!y[a]&&Aa(y,a,o)))},Ca=Math.ceil,ja=Math.floor,_a=function(e){var t=+e;return t!=t||0===t?0:(t>0?ja:Ca)(t)},Pa=_a,Ia=Math.max,Ra=Math.min,La=function(e,t){var r=Pa(e);return r<0?Ia(r+t,0):Ra(r,t)},Da=_a,Fa=Math.min,Na=function(e){return e>0?Fa(Da(e),9007199254740991):0},qa=Na,za=function(e){return qa(e.length)},Ua=tr,Ba=La,Ma=za,Ha=function(e){return function(t,r,n){var a,o=Ua(t),i=Ma(o),s=Ba(n,i);if(e&&r!=r){for(;i>s;)if((a=o[s++])!=a)return!0}else for(;i>s;s++)if((e||s in o)&&o[s]===r)return e||s||0;return!e&&-1}},Wa={includes:Ha(!0),indexOf:Ha(!1)},Va={},Ga=Zr,Ka=tr,Ja=Wa.indexOf,Ya=Va,Za=Et([].push),Qa=function(e,t){var r,n=Ka(e),a=0,o=[];for(r in n)!Ga(Ya,r)&&Ga(n,r)&&Za(o,r);for(;t.length>a;)Ga(n,r=t[a++])&&(~Ja(o,r)||Za(o,r));return o},Xa=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"],eo=Qa,to=Xa,ro=Object.keys||function(e){return eo(e,to)},no=Kr,ao=ro;Ta({target:"Object",stat:!0,forced:mt((function(){ao(1)}))},{keys:function(e){return ao(no(e))}});var oo=ar.Object.keys;const io=ut({exports:{}}.exports=oo);var so=Ht,lo=Array.isArray||function(e){return"Array"==so(e)},co={};co[fn("toStringTag")]="z";var po="[object z]"===String(co),uo=ft,ho=po,fo=Tt,mo=Ht,yo=fn("toStringTag"),go=uo.Object,vo="Arguments"==mo(function(){return arguments}()),bo=ho?mo:function(e){var t,r,n;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(r=function(e,t){try{return e[t]}catch(e){}}(t=go(e),yo))?r:vo?mo(t):"Object"==(n=mo(t))&&fo(t.callee)?"Arguments":n},xo=bo,wo=ft.String,$o=function(e){if("Symbol"===xo(e))throw TypeError("Cannot convert a Symbol value to a string");return wo(e)},ko={},So=jt,Ao=ea,Oo=Xn,Eo=oa,To=tr,Co=ro;ko.f=So&&!Ao?Object.defineProperties:function(e,t){Eo(e);for(var r,n=To(t),a=Co(t),o=a.length,i=0;o>i;)Oo.f(e,r=a[i++],n[r]);return e};var jo,_o=cr("document","documentElement"),Po=Ur.exports,Io=rn,Ro=Po("keys"),Lo=function(e){return Ro[e]||(Ro[e]=Io(e))},Do=oa,Fo=ko,No=Xa,qo=Va,zo=_o,Uo=Tn,Bo=Lo("IE_PROTO"),Mo=function(){},Ho=function(e){return"<script>"+e+"<\/script>"},Wo=function(e){e.write(Ho("")),e.close();var t=e.parentWindow.Object;return e=null,t},Vo=function(){try{jo=new ActiveXObject("htmlfile")}catch(e){}var e,t;Vo="undefined"!=typeof document?document.domain&&jo?Wo(jo):((t=Uo("iframe")).style.display="none",zo.appendChild(t),t.src=String("javascript:"),(e=t.contentWindow.document).open(),e.write(Ho("document.F=Object")),e.close(),e.F):Wo(jo);for(var r=No.length;r--;)delete Vo.prototype[No[r]];return Vo()};qo[Bo]=!0;var Go=Object.create||function(e,t){var r;return null!==e?(Mo.prototype=Do(e),r=new Mo,Mo.prototype=null,r[Bo]=e):r=Vo(),void 0===t?r:Fo.f(r,t)},Ko={},Jo=Qa,Yo=Xa.concat("length","prototype");Ko.f=Object.getOwnPropertyNames||function(e){return Jo(e,Yo)};var Zo={},Qo=Sn,Xo=Xn,ei=zt,ti=function(e,t,r){var n=Qo(t);n in e?Xo.f(e,n,ei(0,r)):e[n]=r},ri=La,ni=za,ai=ti,oi=ft.Array,ii=Math.max,si=function(e,t,r){for(var n=ni(e),a=ri(t,n),o=ri(void 0===r?n:r,n),i=oi(ii(o-a,0)),s=0;a<o;a++,s++)ai(i,s,e[a]);return i.length=s,i},li=Ht,ci=tr,pi=Ko.f,di=si,ui="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[];Zo.f=function(e){return ui&&"Window"==li(e)?function(e){try{return pi(e)}catch(e){return di(ui)}}(e):pi(ci(e))};var hi={};hi.f=Object.getOwnPropertySymbols;var fi=Et([].slice),mi=ya,yi=function(e,t,r,n){n&&n.enumerable?e[t]=r:mi(e,t,r)},gi={},vi=fn;gi.f=vi;var bi=ar,xi=Zr,wi=gi,$i=Xn.f,ki=function(e){var t=bi.Symbol||(bi.Symbol={});xi(t,e)||$i(t,e,{value:wi.f(e)})},Si=bo,Ai=po?{}.toString:function(){return"[object "+Si(this)+"]"},Oi=po,Ei=Xn.f,Ti=ya,Ci=Zr,ji=Ai,_i=fn("toStringTag"),Pi=function(e,t,r,n){if(e){var a=r?e:e.prototype;Ci(a,_i)||Ei(a,_i,{configurable:!0,value:t}),n&&!Oi&&Ti(a,"toString",ji)}},Ii=Tt,Ri=Hr,Li=Et(Function.toString);Ii(Ri.inspectSource)||(Ri.inspectSource=function(e){return Li(e)});var Di,Fi,Ni,qi=Ri.inspectSource,zi=Tt,Ui=qi,Bi=ft.WeakMap,Mi=zi(Bi)&&/native code/.test(Ui(Bi)),Hi=Mi,Wi=ft,Vi=Et,Gi=nr,Ki=ya,Ji=Zr,Yi=Hr,Zi=Lo,Qi=Va,Xi=Wi.TypeError,es=Wi.WeakMap;if(Hi||Yi.state){var ts=Yi.state||(Yi.state=new es),rs=Vi(ts.get),ns=Vi(ts.has),as=Vi(ts.set);Di=function(e,t){if(ns(ts,e))throw new Xi("Object already initialized");return t.facade=e,as(ts,e,t),t},Fi=function(e){return rs(ts,e)||{}},Ni=function(e){return ns(ts,e)}}else{var os=Zi("state");Qi[os]=!0,Di=function(e,t){if(Ji(e,os))throw new Xi("Object already initialized");return t.facade=e,Ki(e,os,t),t},Fi=function(e){return Ji(e,os)?e[os]:{}},Ni=function(e){return Ji(e,os)}}var is={set:Di,get:Fi,has:Ni,enforce:function(e){return Ni(e)?Fi(e):Di(e,{})},getterFor:function(e){return function(t){var r;if(!Gi(t)||(r=Fi(t)).type!==e)throw Xi("Incompatible receiver, "+e+" required");return r}}},ss=Et,ls=mt,cs=Tt,ps=bo,ds=qi,us=function(){},hs=[],fs=cr("Reflect","construct"),ms=/^\s*(?:class|function)\b/,ys=ss(ms.exec),gs=!ms.exec(us),vs=function(e){if(!cs(e))return!1;try{return fs(us,hs,e),!0}catch(e){return!1}},bs=function(e){if(!cs(e))return!1;switch(ps(e)){case"AsyncFunction":case"GeneratorFunction":case"AsyncGeneratorFunction":return!1}try{return gs||!!ys(ms,ds(e))}catch(e){return!0}};bs.sham=!0;var xs=!fs||ls((function(){var e;return vs(vs.call)||!vs(Object)||!vs((function(){e=!0}))||e}))?bs:vs,ws=ft,$s=lo,ks=xs,Ss=nr,As=fn("species"),Os=ws.Array,Es=function(e,t){return new(function(e){var t;return $s(e)&&(t=e.constructor,(ks(t)&&(t===Os||$s(t.prototype))||Ss(t)&&null===(t=t[As]))&&(t=void 0)),void 0===t?Os:t}(e))(0===t?0:t)},Ts=Qn,Cs=Yt,js=Kr,_s=za,Ps=Es,Is=Et([].push),Rs=function(e){var t=1==e,r=2==e,n=3==e,a=4==e,o=6==e,i=7==e,s=5==e||o;return function(l,c,p,d){for(var u,h,f=js(l),m=Cs(f),y=Ts(c,p),g=_s(m),v=0,b=d||Ps,x=t?b(l,g):r||i?b(l,0):void 0;g>v;v++)if((s||v in m)&&(h=y(u=m[v],v,f),e))if(t)x[v]=h;else if(h)switch(e){case 3:return!0;case 5:return u;case 6:return v;case 2:Is(x,u)}else switch(e){case 4:return!1;case 7:Is(x,u)}return o?-1:n||a?a:x}},Ls={forEach:Rs(0),map:Rs(1),filter:Rs(2),some:Rs(3),every:Rs(4),find:Rs(5),findIndex:Rs(6),filterReject:Rs(7)},Ds=Ta,Fs=ft,Ns=cr,qs=wt,zs=It,Us=Et,Bs=jt,Ms=wr,Hs=mt,Ws=Zr,Vs=lo,Gs=Tt,Ks=nr,Js=pr,Ys=Tr,Zs=oa,Qs=Kr,Xs=tr,el=Sn,tl=$o,rl=zt,nl=Go,al=ro,ol=Ko,il=Zo,sl=hi,ll=Ct,cl=Xn,pl=ko,dl=Rt,ul=fi,hl=yi,fl=Ur.exports,ml=Va,yl=rn,gl=fn,vl=gi,bl=ki,xl=Pi,wl=is,$l=Ls.forEach,kl=Lo("hidden"),Sl=gl("toPrimitive"),Al=wl.set,Ol=wl.getterFor("Symbol"),El=Object.prototype,Tl=Fs.Symbol,Cl=Tl&&Tl.prototype,jl=Fs.TypeError,_l=Fs.QObject,Pl=Ns("JSON","stringify"),Il=ll.f,Rl=cl.f,Ll=il.f,Dl=dl.f,Fl=Us([].push),Nl=fl("symbols"),ql=fl("op-symbols"),zl=fl("string-to-symbol-registry"),Ul=fl("symbol-to-string-registry"),Bl=fl("wks"),Ml=!_l||!_l.prototype||!_l.prototype.findChild,Hl=Bs&&Hs((function(){return 7!=nl(Rl({},"a",{get:function(){return Rl(this,"a",{value:7}).a}})).a}))?function(e,t,r){var n=Il(El,t);n&&delete El[t],Rl(e,t,r),n&&e!==El&&Rl(El,t,n)}:Rl,Wl=function(e,t){var r=Nl[e]=nl(Cl);return Al(r,{type:"Symbol",tag:e,description:t}),Bs||(r.description=t),r},Vl=function(e,t,r){e===El&&Vl(ql,t,r),Zs(e);var n=el(t);return Zs(r),Ws(Nl,n)?(r.enumerable?(Ws(e,kl)&&e[kl][n]&&(e[kl][n]=!1),r=nl(r,{enumerable:rl(0,!1)})):(Ws(e,kl)||Rl(e,kl,rl(1,{})),e[kl][n]=!0),Hl(e,n,r)):Rl(e,n,r)},Gl=function(e,t){Zs(e);var r=Xs(t),n=al(r).concat(Zl(r));return $l(n,(function(t){Bs&&!zs(Kl,r,t)||Vl(e,t,r[t])})),e},Kl=function(e){var t=el(e),r=zs(Dl,this,t);return!(this===El&&Ws(Nl,t)&&!Ws(ql,t))&&(!(r||!Ws(this,t)||!Ws(Nl,t)||Ws(this,kl)&&this[kl][t])||r)},Jl=function(e,t){var r=Xs(e),n=el(t);if(r!==El||!Ws(Nl,n)||Ws(ql,n)){var a=Il(r,n);return!a||!Ws(Nl,n)||Ws(r,kl)&&r[kl][n]||(a.enumerable=!0),a}},Yl=function(e){var t=Ll(Xs(e)),r=[];return $l(t,(function(e){Ws(Nl,e)||Ws(ml,e)||Fl(r,e)})),r},Zl=function(e){var t=e===El,r=Ll(t?ql:Xs(e)),n=[];return $l(r,(function(e){!Ws(Nl,e)||t&&!Ws(El,e)||Fl(n,Nl[e])})),n};(Ms||(hl(Cl=(Tl=function(){if(Js(Cl,this))throw jl("Symbol is not a constructor");var e=arguments.length&&void 0!==arguments[0]?tl(arguments[0]):void 0,t=yl(e),r=function(e){this===El&&zs(r,ql,e),Ws(this,kl)&&Ws(this[kl],t)&&(this[kl][t]=!1),Hl(this,t,rl(1,e))};return Bs&&Ml&&Hl(El,t,{configurable:!0,set:r}),Wl(t,e)}).prototype,"toString",(function(){return Ol(this).tag})),hl(Tl,"withoutSetter",(function(e){return Wl(yl(e),e)})),dl.f=Kl,cl.f=Vl,pl.f=Gl,ll.f=Jl,ol.f=il.f=Yl,sl.f=Zl,vl.f=function(e){return Wl(gl(e),e)},Bs&&Rl(Cl,"description",{configurable:!0,get:function(){return Ol(this).description}})),Ds({global:!0,wrap:!0,forced:!Ms,sham:!Ms},{Symbol:Tl}),$l(al(Bl),(function(e){bl(e)})),Ds({target:"Symbol",stat:!0,forced:!Ms},{for:function(e){var t=tl(e);if(Ws(zl,t))return zl[t];var r=Tl(t);return zl[t]=r,Ul[r]=t,r},keyFor:function(e){if(!Ys(e))throw jl(e+" is not a symbol");if(Ws(Ul,e))return Ul[e]},useSetter:function(){Ml=!0},useSimple:function(){Ml=!1}}),Ds({target:"Object",stat:!0,forced:!Ms,sham:!Bs},{create:function(e,t){return void 0===t?nl(e):Gl(nl(e),t)},defineProperty:Vl,defineProperties:Gl,getOwnPropertyDescriptor:Jl}),Ds({target:"Object",stat:!0,forced:!Ms},{getOwnPropertyNames:Yl,getOwnPropertySymbols:Zl}),Ds({target:"Object",stat:!0,forced:Hs((function(){sl.f(1)}))},{getOwnPropertySymbols:function(e){return sl.f(Qs(e))}}),Pl)&&Ds({target:"JSON",stat:!0,forced:!Ms||Hs((function(){var e=Tl();return"[null]"!=Pl([e])||"{}"!=Pl({a:e})||"{}"!=Pl(Object(e))}))},{stringify:function(e,t,r){var n=ul(arguments),a=t;if((Ks(t)||void 0!==e)&&!Ys(e))return Vs(t)||(t=function(e,t){if(Gs(a)&&(t=zs(a,this,e,t)),!Ys(t))return t}),n[1]=t,qs(Pl,null,n)}});if(!Cl[Sl]){var Ql=Cl.valueOf;hl(Cl,Sl,(function(e){return zs(Ql,this)}))}xl(Tl,"Symbol"),ml[kl]=!0;var Xl=ar.Object.getOwnPropertySymbols;const ec=ut({exports:{}}.exports=Xl);var tc=mt,rc=vr,nc=fn("species"),ac=function(e){return rc>=51||!tc((function(){var t=[];return(t.constructor={})[nc]=function(){return{foo:1}},1!==t[e](Boolean).foo}))},oc=Ls.filter;Ta({target:"Array",proto:!0,forced:!ac("filter")},{filter:function(e){return oc(this,e,arguments.length>1?arguments[1]:void 0)}});var ic=ar,sc=function(e){return ic[e+"Prototype"]},lc=sc("Array").filter,cc=pr,pc=lc,dc=Array.prototype,uc=function(e){var t=e.filter;return e===dc||cc(dc,e)&&t===dc.filter?pc:t};const hc=ut({exports:{}}.exports=uc);var fc={exports:{}},mc=Ta,yc=mt,gc=tr,vc=Ct.f,bc=jt,xc=yc((function(){vc(1)}));mc({target:"Object",stat:!0,forced:!bc||xc,sham:!bc},{getOwnPropertyDescriptor:function(e,t){return vc(gc(e),t)}});var wc=ar.Object,$c=fc.exports=function(e,t){return wc.getOwnPropertyDescriptor(e,t)};wc.getOwnPropertyDescriptor.sham&&($c.sham=!0);var kc=fc.exports;const Sc=ut({exports:{}}.exports=kc);var Ac,Oc,Ec,Tc={},Cc=jt,jc=Zr,_c=Function.prototype,Pc=Cc&&Object.getOwnPropertyDescriptor,Ic=jc(_c,"name"),Rc={EXISTS:Ic,PROPER:Ic&&"something"===function(){}.name,CONFIGURABLE:Ic&&(!Cc||Cc&&Pc(_c,"name").configurable)},Lc=!mt((function(){function e(){}return e.prototype.constructor=null,Object.getPrototypeOf(new e)!==e.prototype})),Dc=ft,Fc=Zr,Nc=Tt,qc=Kr,zc=Lc,Uc=Lo("IE_PROTO"),Bc=Dc.Object,Mc=Bc.prototype,Hc=zc?Bc.getPrototypeOf:function(e){var t=qc(e);if(Fc(t,Uc))return t[Uc];var r=t.constructor;return Nc(r)&&t instanceof r?r.prototype:t instanceof Bc?Mc:null},Wc=mt,Vc=Tt,Gc=Go,Kc=Hc,Jc=yi,Yc=fn("iterator"),Zc=!1;[].keys&&("next"in(Ec=[].keys())?(Oc=Kc(Kc(Ec)))!==Object.prototype&&(Ac=Oc):Zc=!0);var Qc=null==Ac||Wc((function(){var e={};return Ac[Yc].call(e)!==e}));Vc((Ac=Qc?{}:Gc(Ac))[Yc])||Jc(Ac,Yc,(function(){return this}));var Xc={IteratorPrototype:Ac,BUGGY_SAFARI_ITERATORS:Zc},ep=Xc.IteratorPrototype,tp=Go,rp=zt,np=Pi,ap=Tc,op=function(){return this},ip=function(e,t,r,n){var a=t+" Iterator";return e.prototype=tp(ep,{next:rp(+!n,r)}),np(e,a,!1,!0),ap[a]=op,e},sp=ft,lp=Tt,cp=sp.String,pp=sp.TypeError,dp=Et,up=oa,hp=Object.setPrototypeOf||("__proto__"in{}?function(){var e,t=!1,r={};try{(e=dp(Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set))(r,[]),t=r instanceof Array}catch(e){}return function(r,n){return up(r),function(e){if("object"==typeof e||lp(e))return e;throw pp("Can't set "+cp(e)+" as a prototype")}(n),t?e(r,n):r.__proto__=n,r}}():void 0),fp=Ta,mp=It,yp=ip,gp=Hc,vp=Pi,bp=yi,xp=Tc,wp=Rc.PROPER,$p=Xc.BUGGY_SAFARI_ITERATORS,kp=fn("iterator"),Sp=function(){return this},Ap=function(e,t,r,n,a,o,i){yp(r,t,n);var s,l,c,p=function(e){if(e===a&&m)return m;if(!$p&&e in h)return h[e];switch(e){case"keys":case"values":case"entries":return function(){return new r(this,e)}}return function(){return new r(this)}},d=t+" Iterator",u=!1,h=e.prototype,f=h[kp]||h["@@iterator"]||a&&h[a],m=!$p&&f||p(a),y="Array"==t&&h.entries||f;if(y&&(s=gp(y.call(new e)))!==Object.prototype&&s.next&&(vp(s,d,!0,!0),xp[d]=Sp),wp&&"values"==a&&f&&"values"!==f.name&&(u=!0,m=function(){return mp(f,this)}),a)if(l={values:p("values"),keys:o?m:p("keys"),entries:p("entries")},i)for(c in l)($p||u||!(c in h))&&bp(h,c,l[c]);else fp({target:t,proto:!0,forced:$p||u},l);return i&&h[kp]!==m&&bp(h,kp,m,{name:a}),xp[t]=m,l},Op=tr,Ep=Tc,Tp=is;Xn.f;var Cp=Ap,jp=Tp.set,_p=Tp.getterFor("Array Iterator");Cp(Array,"Array",(function(e,t){jp(this,{type:"Array Iterator",target:Op(e),index:0,kind:t})}),(function(){var e=_p(this),t=e.target,r=e.kind,n=e.index++;return!t||n>=t.length?(e.target=void 0,{value:void 0,done:!0}):"keys"==r?{value:n,done:!1}:"values"==r?{value:t[n],done:!1}:{value:[n,t[n]],done:!1}}),"values"),Ep.Arguments=Ep.Array;var Pp=ft,Ip=bo,Rp=ya,Lp=Tc,Dp=fn("toStringTag");for(var Fp in{CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}){var Np=Pp[Fp],qp=Np&&Np.prototype;qp&&Ip(qp)!==Dp&&Rp(qp,Dp,Fp),Lp[Fp]=Lp.Array}var zp=mt,Up=function(e,t){var r=[][e];return!!r&&zp((function(){r.call(null,t||function(){return 1},1)}))},Bp=Ls.forEach,Mp=Up("forEach")?[].forEach:function(e){return Bp(this,e,arguments.length>1?arguments[1]:void 0)};Ta({target:"Array",proto:!0,forced:[].forEach!=Mp},{forEach:Mp});var Hp=sc("Array").forEach,Wp=bo,Vp=Zr,Gp=pr,Kp=Hp,Jp=Array.prototype,Yp={DOMTokenList:!0,NodeList:!0};const Zp=ut({exports:{}}.exports=function(e){var t=e.forEach;return e===Jp||Gp(Jp,e)&&t===Jp.forEach||Vp(Yp,Wp(e))?Kp:t});var Qp=cr,Xp=Ko,ed=hi,td=oa,rd=Et([].concat),nd=Qp("Reflect","ownKeys")||function(e){var t=Xp.f(td(e)),r=ed.f;return r?rd(t,r(e)):t},ad=nd,od=tr,id=Ct,sd=ti;Ta({target:"Object",stat:!0,sham:!jt},{getOwnPropertyDescriptors:function(e){for(var t,r,n=od(e),a=id.f,o=ad(n),i={},s=0;o.length>s;)void 0!==(r=a(n,t=o[s++]))&&sd(i,t,r);return i}});var ld=ar.Object.getOwnPropertyDescriptors;const cd=ut({exports:{}}.exports=ld);var pd={exports:{}},dd=Ta,ud=jt,hd=ko.f;dd({target:"Object",stat:!0,forced:Object.defineProperties!==hd,sham:!ud},{defineProperties:hd});var fd=ar.Object,md=pd.exports=function(e,t){return fd.defineProperties(e,t)};fd.defineProperties.sham&&(md.sham=!0);var yd=pd.exports;const gd=ut({exports:{}}.exports=yd);var vd={exports:{}},bd=Ta,xd=jt,wd=Xn.f;bd({target:"Object",stat:!0,forced:Object.defineProperty!==wd,sham:!xd},{defineProperty:wd});var $d=ar.Object,kd=vd.exports=function(e,t,r){return $d.defineProperty(e,t,r)};$d.defineProperty.sham&&(kd.sham=!0);var Sd=vd.exports;const Ad=ut({exports:{}}.exports=Sd);function Od(e,t,r){return t in e?Ad(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function Ed(e,t){var r=io(e);if(ec){var n=ec(e);t&&(n=hc(n).call(n,(function(t){return Sc(e,t).enumerable}))),r.push.apply(r,n)}return r}function Td(e){for(var t=1;t<arguments.length;t++){var r,n,a=null!=arguments[t]?arguments[t]:{};t%2?Zp(r=Ed(Object(a),!0)).call(r,(function(t){Od(e,t,a[t])})):cd?gd(e,cd(a)):Zp(n=Ed(Object(a))).call(n,(function(t){Ad(e,t,Sc(a,t))}))}return e}var Cd=jt,jd=Et,_d=It,Pd=mt,Id=ro,Rd=hi,Ld=Rt,Dd=Kr,Fd=Yt,Nd=Object.assign,qd=Object.defineProperty,zd=jd([].concat),Ud=!Nd||Pd((function(){if(Cd&&1!==Nd({b:1},Nd(qd({},"a",{enumerable:!0,get:function(){qd(this,"b",{value:3,enumerable:!1})}}),{b:2})).b)return!0;var e={},t={},r=Symbol(),n="abcdefghijklmnopqrst";return e[r]=7,n.split("").forEach((function(e){t[e]=e})),7!=Nd({},e)[r]||Id(Nd({},t)).join("")!=n}))?function(e,t){for(var r=Dd(e),n=arguments.length,a=1,o=Rd.f,i=Ld.f;n>a;)for(var s,l=Fd(arguments[a++]),c=o?zd(Id(l),o(l)):Id(l),p=c.length,d=0;p>d;)s=c[d++],Cd&&!_d(i,l,s)||(r[s]=l[s]);return r}:Nd,Bd=Ud;Ta({target:"Object",stat:!0,forced:Object.assign!==Bd},{assign:Bd});var Md=ar.Object.assign;const Hd=ut({exports:{}}.exports=Md);var Wd=nr,Vd=Ht,Gd=fn("match"),Kd=ft.TypeError,Jd=function(e){if(function(e){var t;return Wd(e)&&(void 0!==(t=e[Gd])?!!t:"RegExp"==Vd(e))}(e))throw Kd("The method doesn't accept regular expressions");return e},Yd=fn("match"),Zd=function(e){var t=/./;try{"/./"[e](t)}catch(r){try{return t[Yd]=!1,"/./"[e](t)}catch(e){}}return!1},Qd=Ta,Xd=Et,eu=Na,tu=$o,ru=Jd,nu=Qt,au=Zd,ou=Xd("".startsWith),iu=Xd("".slice),su=Math.min;Qd({target:"String",proto:!0,forced:!au("startsWith")},{startsWith:function(e){var t=tu(nu(this));ru(e);var r=eu(su(arguments.length>1?arguments[1]:void 0,t.length)),n=tu(e);return ou?ou(t,n,r):iu(t,r,r+n.length)===n}});var lu=sc("String").startsWith,cu=pr,pu=lu,du=String.prototype;const uu=ut({exports:{}}.exports=function(e){var t=e.startsWith;return"string"==typeof e||e===du||cu(du,e)&&t===du.startsWith?pu:t});var hu={},fu={exports:{}};!function(e,t){!function(r){var n=t&&!t.nodeType&&t,a=e&&!e.nodeType&&e,o="object"==typeof global&&global;o.global!==o&&o.window!==o&&o.self!==o||(r=o);var i,s,l=2147483647,c=36,p=/^xn--/,d=/[^\x20-\x7E]/,u=/[\x2E\u3002\uFF0E\uFF61]/g,h={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},f=Math.floor,m=String.fromCharCode;function y(e){throw RangeError(h[e])}function g(e,t){for(var r=e.length,n=[];r--;)n[r]=t(e[r]);return n}function v(e,t){var r=e.split("@"),n="";return r.length>1&&(n=r[0]+"@",e=r[1]),n+g((e=e.replace(u,".")).split("."),t).join(".")}function b(e){for(var t,r,n=[],a=0,o=e.length;a<o;)(t=e.charCodeAt(a++))>=55296&&t<=56319&&a<o?56320==(64512&(r=e.charCodeAt(a++)))?n.push(((1023&t)<<10)+(1023&r)+65536):(n.push(t),a--):n.push(t);return n}function x(e){return g(e,(function(e){var t="";return e>65535&&(t+=m((e-=65536)>>>10&1023|55296),e=56320|1023&e),t+m(e)})).join("")}function w(e,t){return e+22+75*(e<26)-((0!=t)<<5)}function $(e,t,r){var n=0;for(e=r?f(e/700):e>>1,e+=f(e/t);e>455;n+=c)e=f(e/35);return f(n+36*e/(e+38))}function k(e){var t,r,n,a,o,i,s,p,d,u,h,m=[],g=e.length,v=0,b=128,w=72;for((r=e.lastIndexOf("-"))<0&&(r=0),n=0;n<r;++n)e.charCodeAt(n)>=128&&y("not-basic"),m.push(e.charCodeAt(n));for(a=r>0?r+1:0;a<g;){for(o=v,i=1,s=c;a>=g&&y("invalid-input"),((p=(h=e.charCodeAt(a++))-48<10?h-22:h-65<26?h-65:h-97<26?h-97:c)>=c||p>f((l-v)/i))&&y("overflow"),v+=p*i,!(p<(d=s<=w?1:s>=w+26?26:s-w));s+=c)i>f(l/(u=c-d))&&y("overflow"),i*=u;w=$(v-o,t=m.length+1,0==o),f(v/t)>l-b&&y("overflow"),b+=f(v/t),v%=t,m.splice(v++,0,b)}return x(m)}function S(e){var t,r,n,a,o,i,s,p,d,u,h,g,v,x,k,S=[];for(g=(e=b(e)).length,t=128,r=0,o=72,i=0;i<g;++i)(h=e[i])<128&&S.push(m(h));for(n=a=S.length,a&&S.push("-");n<g;){for(s=l,i=0;i<g;++i)(h=e[i])>=t&&h<s&&(s=h);for(s-t>f((l-r)/(v=n+1))&&y("overflow"),r+=(s-t)*v,t=s,i=0;i<g;++i)if((h=e[i])<t&&++r>l&&y("overflow"),h==t){for(p=r,d=c;!(p<(u=d<=o?1:d>=o+26?26:d-o));d+=c)k=p-u,x=c-u,S.push(m(w(u+k%x,0))),p=f(k/x);S.push(m(w(p,0))),o=$(r,v,n==a),r=0,++n}++r,++t}return S.join("")}if(i={version:"1.3.2",ucs2:{decode:b,encode:x},decode:k,encode:S,toASCII:function(e){return v(e,(function(e){return d.test(e)?"xn--"+S(e):e}))},toUnicode:function(e){return v(e,(function(e){return p.test(e)?k(e.slice(4).toLowerCase()):e}))}},n&&a)if(e.exports==n)a.exports=i;else for(s in i)i.hasOwnProperty(s)&&(n[s]=i[s]);else r.punycode=i}(this)}(fu,fu.exports);var mu={};function yu(e,t){return Object.prototype.hasOwnProperty.call(e,t)}var gu=function(e){switch(typeof e){case"string":return e;case"boolean":return e?"true":"false";case"number":return isFinite(e)?e:"";default:return""}};mu.decode=mu.parse=function(e,t,r,n){t=t||"&",r=r||"=";var a={};if("string"!=typeof e||0===e.length)return a;var o=/\+/g;e=e.split(t);var i=1e3;n&&"number"==typeof n.maxKeys&&(i=n.maxKeys);var s=e.length;i>0&&s>i&&(s=i);for(var l=0;l<s;++l){var c,p,d,u,h=e[l].replace(o,"%20"),f=h.indexOf(r);f>=0?(c=h.substr(0,f),p=h.substr(f+1)):(c=h,p=""),d=decodeURIComponent(c),u=decodeURIComponent(p),yu(a,d)?Array.isArray(a[d])?a[d].push(u):a[d]=[a[d],u]:a[d]=u}return a},mu.encode=mu.stringify=function(e,t,r,n){return t=t||"&",r=r||"=",null===e&&(e=void 0),"object"==typeof e?Object.keys(e).map((function(n){var a=encodeURIComponent(gu(n))+r;return Array.isArray(e[n])?e[n].map((function(e){return a+encodeURIComponent(gu(e))})).join(t):a+encodeURIComponent(gu(e[n]))})).join(t):n?encodeURIComponent(gu(n))+r+encodeURIComponent(gu(e)):""};var vu=fu.exports,bu=function(e){return"string"==typeof e},xu=function(e){return"object"==typeof e&&null!==e},wu=function(e){return null===e},$u=function(e){return null==e};function ku(){this.protocol=null,this.slashes=null,this.auth=null,this.host=null,this.port=null,this.hostname=null,this.hash=null,this.search=null,this.query=null,this.pathname=null,this.path=null,this.href=null}hu.parse=Fu,hu.resolve=function(e,t){return Fu(e,!1,!0).resolve(t)},hu.resolveObject=function(e,t){return e?Fu(e,!1,!0).resolveObject(t):t},hu.format=function(e){return bu(e)&&(e=Fu(e)),e instanceof ku?e.format():ku.prototype.format.call(e)},hu.Url=ku;var Su=/^([a-z0-9.+-]+:)/i,Au=/:[0-9]*$/,Ou=/^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,Eu=["{","}","|","\\","^","`"].concat(["<",">",'"',"`"," ","\r","\n","\t"]),Tu=["'"].concat(Eu),Cu=["%","/","?",";","#"].concat(Tu),ju=["/","?","#"],_u=/^[+a-z0-9A-Z_-]{0,63}$/,Pu=/^([+a-z0-9A-Z_-]{0,63})(.*)$/,Iu={javascript:!0,"javascript:":!0},Ru={javascript:!0,"javascript:":!0},Lu={http:!0,https:!0,ftp:!0,gopher:!0,file:!0,"http:":!0,"https:":!0,"ftp:":!0,"gopher:":!0,"file:":!0},Du=mu;function Fu(e,t,r){if(e&&xu(e)&&e instanceof ku)return e;var n=new ku;return n.parse(e,t,r),n}ku.prototype.parse=function(e,t,r){if(!bu(e))throw new TypeError("Parameter 'url' must be a string, not "+typeof e);var n=e.indexOf("?"),a=-1!==n&&n<e.indexOf("#")?"?":"#",o=e.split(a);o[0]=o[0].replace(/\\/g,"/");var i=e=o.join(a);if(i=i.trim(),!r&&1===e.split("#").length){var s=Ou.exec(i);if(s)return this.path=i,this.href=i,this.pathname=s[1],s[2]?(this.search=s[2],this.query=t?Du.parse(this.search.substr(1)):this.search.substr(1)):t&&(this.search="",this.query={}),this}var l=Su.exec(i);if(l){var c=(l=l[0]).toLowerCase();this.protocol=c,i=i.substr(l.length)}if(r||l||i.match(/^\/\/[^@\/]+@[^@\/]+/)){var p="//"===i.substr(0,2);!p||l&&Ru[l]||(i=i.substr(2),this.slashes=!0)}if(!Ru[l]&&(p||l&&!Lu[l])){for(var d,u,h=-1,f=0;f<ju.length;f++)-1!==(m=i.indexOf(ju[f]))&&(-1===h||m<h)&&(h=m);for(-1!==(u=-1===h?i.lastIndexOf("@"):i.lastIndexOf("@",h))&&(d=i.slice(0,u),i=i.slice(u+1),this.auth=decodeURIComponent(d)),h=-1,f=0;f<Cu.length;f++){var m;-1!==(m=i.indexOf(Cu[f]))&&(-1===h||m<h)&&(h=m)}-1===h&&(h=i.length),this.host=i.slice(0,h),i=i.slice(h),this.parseHost(),this.hostname=this.hostname||"";var y="["===this.hostname[0]&&"]"===this.hostname[this.hostname.length-1];if(!y)for(var g=this.hostname.split(/\./),v=(f=0,g.length);f<v;f++){var b=g[f];if(b&&!b.match(_u)){for(var x="",w=0,$=b.length;w<$;w++)b.charCodeAt(w)>127?x+="x":x+=b[w];if(!x.match(_u)){var k=g.slice(0,f),S=g.slice(f+1),A=b.match(Pu);A&&(k.push(A[1]),S.unshift(A[2])),S.length&&(i="/"+S.join(".")+i),this.hostname=k.join(".");break}}}this.hostname.length>255?this.hostname="":this.hostname=this.hostname.toLowerCase(),y||(this.hostname=vu.toASCII(this.hostname));var O=this.port?":"+this.port:"",E=this.hostname||"";this.host=E+O,this.href+=this.host,y&&(this.hostname=this.hostname.substr(1,this.hostname.length-2),"/"!==i[0]&&(i="/"+i))}if(!Iu[c])for(f=0,v=Tu.length;f<v;f++){var T=Tu[f];if(-1!==i.indexOf(T)){var C=encodeURIComponent(T);C===T&&(C=escape(T)),i=i.split(T).join(C)}}var j=i.indexOf("#");-1!==j&&(this.hash=i.substr(j),i=i.slice(0,j));var _=i.indexOf("?");if(-1!==_?(this.search=i.substr(_),this.query=i.substr(_+1),t&&(this.query=Du.parse(this.query)),i=i.slice(0,_)):t&&(this.search="",this.query={}),i&&(this.pathname=i),Lu[c]&&this.hostname&&!this.pathname&&(this.pathname="/"),this.pathname||this.search){O=this.pathname||"";var P=this.search||"";this.path=O+P}return this.href=this.format(),this},ku.prototype.format=function(){var e=this.auth||"";e&&(e=(e=encodeURIComponent(e)).replace(/%3A/i,":"),e+="@");var t=this.protocol||"",r=this.pathname||"",n=this.hash||"",a=!1,o="";this.host?a=e+this.host:this.hostname&&(a=e+(-1===this.hostname.indexOf(":")?this.hostname:"["+this.hostname+"]"),this.port&&(a+=":"+this.port)),this.query&&xu(this.query)&&Object.keys(this.query).length&&(o=Du.stringify(this.query));var i=this.search||o&&"?"+o||"";return t&&":"!==t.substr(-1)&&(t+=":"),this.slashes||(!t||Lu[t])&&!1!==a?(a="//"+(a||""),r&&"/"!==r.charAt(0)&&(r="/"+r)):a||(a=""),n&&"#"!==n.charAt(0)&&(n="#"+n),i&&"?"!==i.charAt(0)&&(i="?"+i),t+a+(r=r.replace(/[?#]/g,(function(e){return encodeURIComponent(e)})))+(i=i.replace("#","%23"))+n},ku.prototype.resolve=function(e){return this.resolveObject(Fu(e,!1,!0)).format()},ku.prototype.resolveObject=function(e){if(bu(e)){var t=new ku;t.parse(e,!1,!0),e=t}for(var r=new ku,n=Object.keys(this),a=0;a<n.length;a++){var o=n[a];r[o]=this[o]}if(r.hash=e.hash,""===e.href)return r.href=r.format(),r;if(e.slashes&&!e.protocol){for(var i=Object.keys(e),s=0;s<i.length;s++){var l=i[s];"protocol"!==l&&(r[l]=e[l])}return Lu[r.protocol]&&r.hostname&&!r.pathname&&(r.path=r.pathname="/"),r.href=r.format(),r}if(e.protocol&&e.protocol!==r.protocol){if(!Lu[e.protocol]){for(var c=Object.keys(e),p=0;p<c.length;p++){var d=c[p];r[d]=e[d]}return r.href=r.format(),r}if(r.protocol=e.protocol,e.host||Ru[e.protocol])r.pathname=e.pathname;else{for(var u=(e.pathname||"").split("/");u.length&&!(e.host=u.shift()););e.host||(e.host=""),e.hostname||(e.hostname=""),""!==u[0]&&u.unshift(""),u.length<2&&u.unshift(""),r.pathname=u.join("/")}if(r.search=e.search,r.query=e.query,r.host=e.host||"",r.auth=e.auth,r.hostname=e.hostname||e.host,r.port=e.port,r.pathname||r.search){var h=r.pathname||"",f=r.search||"";r.path=h+f}return r.slashes=r.slashes||e.slashes,r.href=r.format(),r}var m=r.pathname&&"/"===r.pathname.charAt(0),y=e.host||e.pathname&&"/"===e.pathname.charAt(0),g=y||m||r.host&&e.pathname,v=g,b=r.pathname&&r.pathname.split("/")||[],x=(u=e.pathname&&e.pathname.split("/")||[],r.protocol&&!Lu[r.protocol]);if(x&&(r.hostname="",r.port=null,r.host&&(""===b[0]?b[0]=r.host:b.unshift(r.host)),r.host="",e.protocol&&(e.hostname=null,e.port=null,e.host&&(""===u[0]?u[0]=e.host:u.unshift(e.host)),e.host=null),g=g&&(""===u[0]||""===b[0])),y)r.host=e.host||""===e.host?e.host:r.host,r.hostname=e.hostname||""===e.hostname?e.hostname:r.hostname,r.search=e.search,r.query=e.query,b=u;else if(u.length)b||(b=[]),b.pop(),b=b.concat(u),r.search=e.search,r.query=e.query;else if(!$u(e.search))return x&&(r.hostname=r.host=b.shift(),(A=!!(r.host&&r.host.indexOf("@")>0)&&r.host.split("@"))&&(r.auth=A.shift(),r.host=r.hostname=A.shift())),r.search=e.search,r.query=e.query,wu(r.pathname)&&wu(r.search)||(r.path=(r.pathname?r.pathname:"")+(r.search?r.search:"")),r.href=r.format(),r;if(!b.length)return r.pathname=null,r.search?r.path="/"+r.search:r.path=null,r.href=r.format(),r;for(var w=b.slice(-1)[0],$=(r.host||e.host||b.length>1)&&("."===w||".."===w)||""===w,k=0,S=b.length;S>=0;S--)"."===(w=b[S])?b.splice(S,1):".."===w?(b.splice(S,1),k++):k&&(b.splice(S,1),k--);if(!g&&!v)for(;k--;k)b.unshift("..");!g||""===b[0]||b[0]&&"/"===b[0].charAt(0)||b.unshift(""),$&&"/"!==b.join("/").substr(-1)&&b.push("");var A,O=""===b[0]||b[0]&&"/"===b[0].charAt(0);return x&&(r.hostname=r.host=O?"":b.length?b.shift():"",(A=!!(r.host&&r.host.indexOf("@")>0)&&r.host.split("@"))&&(r.auth=A.shift(),r.host=r.hostname=A.shift())),(g=g||r.host&&b.length)&&!O&&b.unshift(""),b.length?r.pathname=b.join("/"):(r.pathname=null,r.path=null),wu(r.pathname)&&wu(r.search)||(r.path=(r.pathname?r.pathname:"")+(r.search?r.search:"")),r.auth=e.auth||r.auth,r.slashes=r.slashes||e.slashes,r.href=r.format(),r},ku.prototype.parseHost=function(){var e=this.host,t=Au.exec(e);t&&(":"!==(t=t[0])&&(this.port=t.substr(1)),e=e.substr(0,e.length-t.length)),e&&(this.hostname=e)};var Nu=Ta,qu=ft,zu=mt,Uu=lo,Bu=nr,Mu=Kr,Hu=za,Wu=ti,Vu=Es,Gu=ac,Ku=vr,Ju=fn("isConcatSpreadable"),Yu=qu.TypeError,Zu=Ku>=51||!zu((function(){var e=[];return e[Ju]=!1,e.concat()[0]!==e})),Qu=Gu("concat"),Xu=function(e){if(!Bu(e))return!1;var t=e[Ju];return void 0!==t?!!t:Uu(e)};Nu({target:"Array",proto:!0,forced:!Zu||!Qu},{concat:function(e){var t,r,n,a,o,i=Mu(this),s=Vu(i,0),l=0;for(t=-1,n=arguments.length;t<n;t++)if(Xu(o=-1===t?i:arguments[t])){if(l+(a=Hu(o))>9007199254740991)throw Yu("Maximum allowed index exceeded");for(r=0;r<a;r++,l++)r in o&&Wu(s,l,o[r])}else{if(l>=9007199254740991)throw Yu("Maximum allowed index exceeded");Wu(s,l++,o)}return s.length=l,s}}),ki("asyncIterator"),ki("hasInstance"),ki("isConcatSpreadable"),ki("iterator"),ki("match"),ki("matchAll"),ki("replace"),ki("search"),ki("species"),ki("split"),ki("toPrimitive"),ki("toStringTag"),ki("unscopables"),Pi(ft.JSON,"JSON",!0);var eh=ar.Symbol;ki("asyncDispose"),ki("dispose"),ki("matcher"),ki("metadata"),ki("observable"),ki("patternMatch"),ki("replaceAll");const th=ut({exports:{}}.exports=eh);var rh=Et,nh=_a,ah=$o,oh=Qt,ih=rh("".charAt),sh=rh("".charCodeAt),lh=rh("".slice),ch=function(e){return function(t,r){var n,a,o=ah(oh(t)),i=nh(r),s=o.length;return i<0||i>=s?e?"":void 0:(n=sh(o,i))<55296||n>56319||i+1===s||(a=sh(o,i+1))<56320||a>57343?e?ih(o,i):n:e?lh(o,i,i+2):a-56320+(n-55296<<10)+65536}},ph=(ch(!1),ch(!0)),dh=$o,uh=is,hh=Ap,fh=uh.set,mh=uh.getterFor("String Iterator");hh(String,"String",(function(e){fh(this,{type:"String Iterator",string:dh(e),index:0})}),(function(){var e,t=mh(this),r=t.string,n=t.index;return n>=r.length?{value:void 0,done:!0}:(e=ph(r,n),t.index+=e.length,{value:e,done:!1})}));var yh=bo,gh=Dr,vh=Tc,bh=fn("iterator"),xh=function(e){if(null!=e)return gh(e,bh)||gh(e,"@@iterator")||vh[yh(e)]};const wh=ut({exports:{}}.exports=xh);Ta({target:"Array",stat:!0},{isArray:lo});var $h=ar.Array.isArray;const kh=ut({exports:{}}.exports=$h);var Sh=Ta,Ah=ft,Oh=lo,Eh=xs,Th=nr,Ch=La,jh=za,_h=tr,Ph=ti,Ih=fn,Rh=fi,Lh=ac("slice"),Dh=Ih("species"),Fh=Ah.Array,Nh=Math.max;Sh({target:"Array",proto:!0,forced:!Lh},{slice:function(e,t){var r,n,a,o=_h(this),i=jh(o),s=Ch(e,i),l=Ch(void 0===t?i:t,i);if(Oh(o)&&(r=o.constructor,(Eh(r)&&(r===Fh||Oh(r.prototype))||Th(r)&&null===(r=r[Dh]))&&(r=void 0),r===Fh||void 0===r))return Rh(o,s,l);for(n=new(void 0===r?Fh:r)(Nh(l-s,0)),a=0;s<l;s++,a++)s in o&&Ph(n,a,o[s]);return n.length=a,n}});var qh=sc("Array").slice,zh=pr,Uh=qh,Bh=Array.prototype,Mh=function(e){var t=e.slice;return e===Bh||zh(Bh,e)&&t===Bh.slice?Uh:t};const Hh=ut({exports:{}}.exports=Mh);var Wh=It,Vh=oa,Gh=Dr,Kh=function(e,t,r){var n,a;Vh(e);try{if(!(n=Gh(e,"return"))){if("throw"===t)throw r;return r}n=Wh(n,e)}catch(e){a=!0,n=e}if("throw"===t)throw r;if(a)throw n;return Vh(n),r},Jh=oa,Yh=Kh,Zh=Tc,Qh=fn("iterator"),Xh=Array.prototype,ef=function(e){return void 0!==e&&(Zh.Array===e||Xh[Qh]===e)},tf=It,rf=Rr,nf=oa,af=jr,of=xh,sf=ft.TypeError,lf=function(e,t){var r=arguments.length<2?of(e):t;if(rf(r))return nf(tf(r,e));throw sf(af(e)+" is not iterable")},cf=Qn,pf=It,df=Kr,uf=function(e,t,r,n){try{return n?t(Jh(r)[0],r[1]):t(r)}catch(t){Yh(e,"throw",t)}},hf=ef,ff=xs,mf=za,yf=ti,gf=lf,vf=xh,bf=ft.Array,xf=fn("iterator"),wf=!1;try{var $f=0,kf={next:function(){return{done:!!$f++}},return:function(){wf=!0}};kf[xf]=function(){return this},Array.from(kf,(function(){throw 2}))}catch(e){}var Sf=function(e,t){if(!t&&!wf)return!1;var r=!1;try{var n={};n[xf]=function(){return{next:function(){return{done:r=!0}}}},e(n)}catch(e){}return r};Ta({target:"Array",stat:!0,forced:!Sf((function(e){Array.from(e)}))},{from:function(e){var t=df(e),r=ff(this),n=arguments.length,a=n>1?arguments[1]:void 0,o=void 0!==a;o&&(a=cf(a,n>2?arguments[2]:void 0));var i,s,l,c,p,d,u=vf(t),h=0;if(!u||this==bf&&hf(u))for(i=mf(t),s=r?new this(i):bf(i);i>h;h++)d=o?a(t[h],h):t[h],yf(s,h,d);else for(p=(c=gf(t,u)).next,s=r?new this:[];!(l=pf(p,c)).done;h++)d=o?uf(c,a,[l.value,h],!0):l.value,yf(s,h,d);return s.length=h,s}});var Af=ar.Array.from;const Of=ut({exports:{}}.exports=Af);function Ef(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function Tf(e,t){var r;if(e){if("string"==typeof e)return Ef(e,t);var n=Hh(r=Object.prototype.toString.call(e)).call(r,8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Of(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Ef(e,t):void 0}}function Cf(e,t){var r=void 0!==th&&wh(e)||e["@@iterator"];if(!r){if(kh(e)||(r=Tf(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,a=function(){};return{s:a,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,i=!0,s=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return i=e.done,e},e:function(e){s=!0,o=e},f:function(){try{i||null==r.return||r.return()}finally{if(s)throw o}}}}var jf=gi.f("iterator");const _f=ut({exports:{}}.exports=jf);function Pf(e){return(Pf="function"==typeof th&&"symbol"==typeof _f?function(e){return typeof e}:function(e){return e&&"function"==typeof th&&e.constructor===th&&e!==th.prototype?"symbol":typeof e})(e)}function If(e,t){return function(e){if(kh(e))return e}(e)||function(e,t){var r=null==e?null:void 0!==th&&wh(e)||e["@@iterator"];if(null!=r){var n,a,o=[],i=!0,s=!1;try{for(r=r.call(e);!(i=(n=r.next()).done)&&(o.push(n.value),!t||o.length!==t);i=!0);}catch(e){s=!0,a=e}finally{try{i||null==r.return||r.return()}finally{if(s)throw a}}return o}}(e,t)||Tf(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var Rf=Zr,Lf=nd,Df=Ct,Ff=Xn,Nf=Et("".replace),qf=String(Error("zxcasd").stack),zf=/\n\s*at [^:]*:[^\n]*/,Uf=zf.test(qf),Bf=nr,Mf=ya,Hf=Qn,Wf=It,Vf=oa,Gf=jr,Kf=ef,Jf=za,Yf=pr,Zf=lf,Qf=xh,Xf=Kh,em=ft.TypeError,tm=function(e,t){this.stopped=e,this.result=t},rm=tm.prototype,nm=function(e,t,r){var n,a,o,i,s,l,c,p=r&&r.that,d=!(!r||!r.AS_ENTRIES),u=!(!r||!r.IS_ITERATOR),h=!(!r||!r.INTERRUPTED),f=Hf(t,p),m=function(e){return n&&Xf(n,"normal",e),new tm(!0,e)},y=function(e){return d?(Vf(e),h?f(e[0],e[1],m):f(e[0],e[1])):h?f(e,m):f(e)};if(u)n=e;else{if(!(a=Qf(e)))throw em(Gf(e)+" is not iterable");if(Kf(a)){for(o=0,i=Jf(e);i>o;o++)if((s=y(e[o]))&&Yf(rm,s))return s;return new tm(!1)}n=Zf(e,a)}for(l=n.next;!(c=Wf(l,n)).done;){try{s=y(c.value)}catch(e){Xf(n,"throw",e)}if("object"==typeof s&&s&&Yf(rm,s))return s}return new tm(!1)},am=$o,om=zt,im=!mt((function(){var e=Error("a");return!("stack"in e)||(Object.defineProperty(e,"stack",om(1,7)),7!==e.stack)})),sm=Ta,lm=ft,cm=pr,pm=Hc,dm=hp,um=Go,hm=ya,fm=zt,mm=function(e,t){if(Uf&&"string"==typeof e)for(;t--;)e=Nf(e,zf,"");return e},ym=function(e,t){Bf(t)&&"cause"in t&&Mf(e,"cause",t.cause)},gm=nm,vm=function(e,t){return void 0===e?arguments.length<2?"":t:am(e)},bm=im,xm=fn("toStringTag"),wm=lm.Error,$m=[].push,km=function(e,t){var r,n=arguments.length>2?arguments[2]:void 0,a=cm(Sm,this);dm?r=dm(new wm,a?pm(this):Sm):(r=a?this:um(Sm),hm(r,xm,"Error")),void 0!==t&&hm(r,"message",vm(t)),bm&&hm(r,"stack",mm(r.stack,1)),ym(r,n);var o=[];return gm(e,$m,{that:o}),hm(r,"errors",o),r};dm?dm(km,wm):function(e,t,r){for(var n=Lf(t),a=Ff.f,o=Df.f,i=0;i<n.length;i++){var s=n[i];Rf(e,s)||r&&Rf(r,s)||a(e,s,o(t,s))}}(km,wm,{name:!0});var Sm=km.prototype=um(wm.prototype,{constructor:fm(1,km),message:fm(1,""),name:fm(1,"AggregateError")});sm({global:!0},{AggregateError:km});var Am,Om,Em,Tm,Cm=ft.Promise,jm=yi,_m=function(e,t,r){for(var n in t)r&&r.unsafe&&e[n]?e[n]=t[n]:jm(e,n,t[n],r);return e},Pm=cr,Im=Xn,Rm=jt,Lm=fn("species"),Dm=pr,Fm=ft.TypeError,Nm=function(e,t){if(Dm(t,e))return e;throw Fm("Incorrect invocation")},qm=xs,zm=jr,Um=ft.TypeError,Bm=oa,Mm=fn("species"),Hm=function(e,t){var r,n=Bm(e).constructor;return void 0===n||null==(r=Bm(n)[Mm])?t:function(e){if(qm(e))return e;throw Um(zm(e)+" is not a constructor")}(r)},Wm=ft.TypeError,Vm=function(e,t){if(e<t)throw Wm("Not enough arguments");return e},Gm=/(?:ipad|iphone|ipod).*applewebkit/i.test(dr),Km="process"==Ht(ft.process),Jm=ft,Ym=wt,Zm=Qn,Qm=Tt,Xm=Zr,ey=mt,ty=_o,ry=fi,ny=Tn,ay=Vm,oy=Gm,iy=Km,sy=Jm.setImmediate,ly=Jm.clearImmediate,cy=Jm.process,py=Jm.Dispatch,dy=Jm.Function,uy=Jm.MessageChannel,hy=Jm.String,fy=0,my={};try{Am=Jm.location}catch(e){}var yy=function(e){if(Xm(my,e)){var t=my[e];delete my[e],t()}},gy=function(e){return function(){yy(e)}},vy=function(e){yy(e.data)},by=function(e){Jm.postMessage(hy(e),Am.protocol+"//"+Am.host)};sy&&ly||(sy=function(e){ay(arguments.length,1);var t=Qm(e)?e:dy(e),r=ry(arguments,1);return my[++fy]=function(){Ym(t,void 0,r)},Om(fy),fy},ly=function(e){delete my[e]},iy?Om=function(e){cy.nextTick(gy(e))}:py&&py.now?Om=function(e){py.now(gy(e))}:uy&&!oy?(Tm=(Em=new uy).port2,Em.port1.onmessage=vy,Om=Zm(Tm.postMessage,Tm)):Jm.addEventListener&&Qm(Jm.postMessage)&&!Jm.importScripts&&Am&&"file:"!==Am.protocol&&!ey(by)?(Om=by,Jm.addEventListener("message",vy,!1)):Om="onreadystatechange"in ny("script")?function(e){ty.appendChild(ny("script")).onreadystatechange=function(){ty.removeChild(this),yy(e)}}:function(e){setTimeout(gy(e),0)});var xy,wy,$y,ky,Sy,Ay,Oy,Ey,Ty={set:sy,clear:ly},Cy=ft,jy=/ipad|iphone|ipod/i.test(dr)&&void 0!==Cy.Pebble,_y=/web0s(?!.*chrome)/i.test(dr),Py=ft,Iy=Qn,Ry=Ct.f,Ly=Ty.set,Dy=Gm,Fy=jy,Ny=_y,qy=Km,zy=Py.MutationObserver||Py.WebKitMutationObserver,Uy=Py.document,By=Py.process,My=Py.Promise,Hy=Ry(Py,"queueMicrotask"),Wy=Hy&&Hy.value;Wy||(xy=function(){var e,t;for(qy&&(e=By.domain)&&e.exit();wy;){t=wy.fn,wy=wy.next;try{t()}catch(e){throw wy?ky():$y=void 0,e}}$y=void 0,e&&e.enter()},Dy||qy||Ny||!zy||!Uy?!Fy&&My&&My.resolve?((Oy=My.resolve(void 0)).constructor=My,Ey=Iy(Oy.then,Oy),ky=function(){Ey(xy)}):qy?ky=function(){By.nextTick(xy)}:(Ly=Iy(Ly,Py),ky=function(){Ly(xy)}):(Sy=!0,Ay=Uy.createTextNode(""),new zy(xy).observe(Ay,{characterData:!0}),ky=function(){Ay.data=Sy=!Sy}));var Vy=Wy||function(e){var t={fn:e,next:void 0};$y&&($y.next=t),wy||(wy=t,ky()),$y=t},Gy={},Ky=Rr,Jy=function(e){var t,r;this.promise=new e((function(e,n){if(void 0!==t||void 0!==r)throw TypeError("Bad Promise constructor");t=e,r=n})),this.resolve=Ky(t),this.reject=Ky(r)};Gy.f=function(e){return new Jy(e)};var Yy=oa,Zy=nr,Qy=Gy,Xy=function(e,t){if(Yy(e),Zy(t)&&t.constructor===e)return t;var r=Qy.f(e);return(0,r.resolve)(t),r.promise},eg=ft,tg=function(e){try{return{error:!1,value:e()}}catch(e){return{error:!0,value:e}}},rg=function(){this.head=null,this.tail=null};rg.prototype={add:function(e){var t={item:e,next:null};this.head?this.tail.next=t:this.head=t,this.tail=t},get:function(){var e=this.head;if(e)return this.head=e.next,this.tail===e&&(this.tail=null),e.item}};var ng,ag,og,ig,sg,lg="object"==typeof window,cg=Ta,pg=ft,dg=cr,ug=It,hg=Cm,fg=_m,mg=Pi,yg=Rr,gg=Tt,vg=nr,bg=Nm,xg=qi,wg=nm,$g=Sf,kg=Hm,Sg=Ty.set,Ag=Vy,Og=Xy,Eg=Gy,Tg=tg,Cg=rg,jg=is,_g=Kn,Pg=lg,Ig=Km,Rg=vr,Lg=fn("species"),Dg="Promise",Fg=jg.getterFor(Dg),Ng=jg.set,qg=jg.getterFor(Dg),zg=hg&&hg.prototype,Ug=hg,Bg=zg,Mg=pg.TypeError,Hg=pg.document,Wg=pg.process,Vg=Eg.f,Gg=Vg,Kg=!!(Hg&&Hg.createEvent&&pg.dispatchEvent),Jg=gg(pg.PromiseRejectionEvent),Yg=_g(Dg,(function(){var e=xg(Ug),t=e!==String(Ug);if(!t&&66===Rg)return!0;if(!Bg.finally)return!0;if(Rg>=51&&/native code/.test(e))return!1;var r=new Ug((function(e){e(1)})),n=function(e){e((function(){}),(function(){}))};return(r.constructor={})[Lg]=n,!(r.then((function(){}))instanceof n)||!t&&Pg&&!Jg})),Zg=Yg||!$g((function(e){Ug.all(e).catch((function(){}))})),Qg=function(e){var t;return!(!vg(e)||!gg(t=e.then))&&t},Xg=function(e,t){var r,n,a,o=t.value,i=1==t.state,s=i?e.ok:e.fail,l=e.resolve,c=e.reject,p=e.domain;try{s?(i||(2===t.rejection&&av(t),t.rejection=1),!0===s?r=o:(p&&p.enter(),r=s(o),p&&(p.exit(),a=!0)),r===e.promise?c(Mg("Promise-chain cycle")):(n=Qg(r))?ug(n,r,l,c):l(r)):c(o)}catch(e){p&&!a&&p.exit(),c(e)}},ev=function(e,t){e.notified||(e.notified=!0,Ag((function(){for(var r,n=e.reactions;r=n.get();)Xg(r,e);e.notified=!1,t&&!e.rejection&&rv(e)})))},tv=function(e,t,r){var n,a;Kg?((n=Hg.createEvent("Event")).promise=t,n.reason=r,n.initEvent(e,!1,!0),pg.dispatchEvent(n)):n={promise:t,reason:r},!Jg&&(a=pg["on"+e])?a(n):"unhandledrejection"===e&&function(e,t){var r=eg.console;r&&r.error&&(1==arguments.length?r.error(e):r.error(e,t))}("Unhandled promise rejection",r)},rv=function(e){ug(Sg,pg,(function(){var t,r=e.facade,n=e.value;if(nv(e)&&(t=Tg((function(){Ig?Wg.emit("unhandledRejection",n,r):tv("unhandledrejection",r,n)})),e.rejection=Ig||nv(e)?2:1,t.error))throw t.value}))},nv=function(e){return 1!==e.rejection&&!e.parent},av=function(e){ug(Sg,pg,(function(){var t=e.facade;Ig?Wg.emit("rejectionHandled",t):tv("rejectionhandled",t,e.value)}))},ov=function(e,t,r){return function(n){e(t,n,r)}},iv=function(e,t,r){e.done||(e.done=!0,r&&(e=r),e.value=t,e.state=2,ev(e,!0))},sv=function(e,t,r){if(!e.done){e.done=!0,r&&(e=r);try{if(e.facade===t)throw Mg("Promise can't be resolved itself");var n=Qg(t);n?Ag((function(){var r={done:!1};try{ug(n,t,ov(sv,r,e),ov(iv,r,e))}catch(t){iv(r,t,e)}})):(e.value=t,e.state=1,ev(e,!1))}catch(t){iv({done:!1},t,e)}}};Yg&&(Bg=(Ug=function(e){bg(this,Bg),yg(e),ug(ng,this);var t=Fg(this);try{e(ov(sv,t),ov(iv,t))}catch(e){iv(t,e)}}).prototype,(ng=function(e){Ng(this,{type:Dg,done:!1,notified:!1,parent:!1,reactions:new Cg,rejection:!1,state:0,value:void 0})}).prototype=fg(Bg,{then:function(e,t){var r=qg(this),n=Vg(kg(this,Ug));return r.parent=!0,n.ok=!gg(e)||e,n.fail=gg(t)&&t,n.domain=Ig?Wg.domain:void 0,0==r.state?r.reactions.add(n):Ag((function(){Xg(n,r)})),n.promise},catch:function(e){return this.then(void 0,e)}}),ag=function(){var e=new ng,t=Fg(e);this.promise=e,this.resolve=ov(sv,t),this.reject=ov(iv,t)},Eg.f=Vg=function(e){return e===Ug||e===og?new ag(e):Gg(e)}),cg({global:!0,wrap:!0,forced:Yg},{Promise:Ug}),mg(Ug,Dg,!1,!0),ig=Pm(Dg),sg=Im.f,Rm&&ig&&!ig[Lm]&&sg(ig,Lm,{configurable:!0,get:function(){return this}}),og=dg(Dg),cg({target:Dg,stat:!0,forced:Yg},{reject:function(e){var t=Vg(this);return ug(t.reject,void 0,e),t.promise}}),cg({target:Dg,stat:!0,forced:!0},{resolve:function(e){return Og(this===og?Ug:this,e)}}),cg({target:Dg,stat:!0,forced:Zg},{all:function(e){var t=this,r=Vg(t),n=r.resolve,a=r.reject,o=Tg((function(){var r=yg(t.resolve),o=[],i=0,s=1;wg(e,(function(e){var l=i++,c=!1;s++,ug(r,t,e).then((function(e){c||(c=!0,o[l]=e,--s||n(o))}),a)})),--s||n(o)}));return o.error&&a(o.value),r.promise},race:function(e){var t=this,r=Vg(t),n=r.reject,a=Tg((function(){var a=yg(t.resolve);wg(e,(function(e){ug(a,t,e).then(r.resolve,n)}))}));return a.error&&n(a.value),r.promise}});var lv=It,cv=Rr,pv=Gy,dv=tg,uv=nm;Ta({target:"Promise",stat:!0},{allSettled:function(e){var t=this,r=pv.f(t),n=r.resolve,a=r.reject,o=dv((function(){var r=cv(t.resolve),a=[],o=0,i=1;uv(e,(function(e){var s=o++,l=!1;i++,lv(r,t,e).then((function(e){l||(l=!0,a[s]={status:"fulfilled",value:e},--i||n(a))}),(function(e){l||(l=!0,a[s]={status:"rejected",reason:e},--i||n(a))}))})),--i||n(a)}));return o.error&&a(o.value),r.promise}});var hv=Rr,fv=cr,mv=It,yv=Gy,gv=tg,vv=nm;Ta({target:"Promise",stat:!0},{any:function(e){var t=this,r=fv("AggregateError"),n=yv.f(t),a=n.resolve,o=n.reject,i=gv((function(){var n=hv(t.resolve),i=[],s=0,l=1,c=!1;vv(e,(function(e){var p=s++,d=!1;l++,mv(n,t,e).then((function(e){d||c||(c=!0,a(e))}),(function(e){d||c||(d=!0,i[p]=e,--l||o(new r(i,"No one promise resolved")))}))})),--l||o(new r(i,"No one promise resolved"))}));return i.error&&o(i.value),n.promise}});var bv=Cm,xv=cr,wv=Tt,$v=Hm,kv=Xy;Ta({target:"Promise",proto:!0,real:!0,forced:!!bv&&mt((function(){bv.prototype.finally.call({then:function(){}},(function(){}))}))},{finally:function(e){var t=$v(this,xv("Promise")),r=wv(e);return this.then(r?function(r){return kv(t,e()).then((function(){return r}))}:e,r?function(r){return kv(t,e()).then((function(){throw r}))}:e)}});var Sv=ar.Promise,Av=Sv,Ov=Gy,Ev=tg;Ta({target:"Promise",stat:!0,forced:!0},{try:function(e){var t=Ov.f(this),r=Ev(e);return(r.error?t.reject:t.resolve)(r.value),t.promise}});const Tv=ut({exports:{}}.exports=Av);function Cv(e,t,r,n,a,o,i){try{var s=e[o](i),l=s.value}catch(e){return void r(e)}s.done?t(l):Tv.resolve(l).then(n,a)}function jv(e){return function(){var t=this,r=arguments;return new Tv((function(n,a){var o=e.apply(t,r);function i(e){Cv(o,n,a,i,s,"next",e)}function s(e){Cv(o,n,a,i,s,"throw",e)}i(void 0)}))}}var _v={exports:{}};!function(e){var t=function(e){var t,r=Object.prototype,n=r.hasOwnProperty,a="function"==typeof Symbol?Symbol:{},o=a.iterator||"@@iterator",i=a.asyncIterator||"@@asyncIterator",s=a.toStringTag||"@@toStringTag";function l(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{l({},"")}catch(e){l=function(e,t,r){return e[t]=r}}function c(e,t,r,n){var a,o,i,s,l=t&&t.prototype instanceof y?t:y,c=Object.create(l.prototype),g=new T(n||[]);return c._invoke=(a=e,o=r,i=g,s=d,function(e,t){if(s===h)throw new Error("Generator is already running");if(s===f){if("throw"===e)throw t;return j()}for(i.method=e,i.arg=t;;){var r=i.delegate;if(r){var n=A(r,i);if(n){if(n===m)continue;return n}}if("next"===i.method)i.sent=i._sent=i.arg;else if("throw"===i.method){if(s===d)throw s=f,i.arg;i.dispatchException(i.arg)}else"return"===i.method&&i.abrupt("return",i.arg);s=h;var l=p(a,o,i);if("normal"===l.type){if(s=i.done?f:u,l.arg===m)continue;return{value:l.arg,done:i.done}}"throw"===l.type&&(s=f,i.method="throw",i.arg=l.arg)}}),c}function p(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}e.wrap=c;var d="suspendedStart",u="suspendedYield",h="executing",f="completed",m={};function y(){}function g(){}function v(){}var b={};l(b,o,(function(){return this}));var x=Object.getPrototypeOf,w=x&&x(x(C([])));w&&w!==r&&n.call(w,o)&&(b=w);var $=v.prototype=y.prototype=Object.create(b);function k(e){["next","throw","return"].forEach((function(t){l(e,t,(function(e){return this._invoke(t,e)}))}))}function S(e,t){function r(a,o,i,s){var l=p(e[a],e,o);if("throw"!==l.type){var c=l.arg,d=c.value;return d&&"object"==typeof d&&n.call(d,"__await")?t.resolve(d.u).then((function(e){r("next",e,i,s)}),(function(e){r("throw",e,i,s)})):t.resolve(d).then((function(e){c.value=e,i(c)}),(function(e){return r("throw",e,i,s)}))}s(l.arg)}var a;this._invoke=function(e,n){function o(){return new t((function(t,a){r(e,n,t,a)}))}return a=a?a.then(o,o):o()}}function A(e,r){var n=e.iterator[r.method];if(n===t){if(r.delegate=null,"throw"===r.method){if(e.iterator.return&&(r.method="return",r.arg=t,A(e,r),"throw"===r.method))return m;r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method")}return m}var a=p(n,e.iterator,r.arg);if("throw"===a.type)return r.method="throw",r.arg=a.arg,r.delegate=null,m;var o=a.arg;return o?o.done?(r[e.resultName]=o.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,m):o:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,m)}function O(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function E(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function T(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(O,this),this.reset(!0)}function C(e){if(e){var r=e[o];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var a=-1,i=function r(){for(;++a<e.length;)if(n.call(e,a))return r.value=e[a],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}return{next:j}}function j(){return{value:t,done:!0}}return g.prototype=v,l($,"constructor",v),l(v,"constructor",g),g.displayName=l(v,s,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===g||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,v):(e.__proto__=v,l(e,s,"GeneratorFunction")),e.prototype=Object.create($),e},e.awrap=function(e){return{u:e}},k(S.prototype),l(S.prototype,i,(function(){return this})),e.AsyncIterator=S,e.async=function(t,r,n,a,o){void 0===o&&(o=Promise);var i=new S(c(t,r,n,a),o);return e.isGeneratorFunction(r)?i:i.next().then((function(e){return e.done?e.value:i.next()}))},k($),l($,s,"Generator"),l($,o,(function(){return this})),l($,"toString",(function(){return"[object Generator]"})),e.keys=function(e){var t=[];for(var r in e)t.push(r);return t.reverse(),function r(){for(;t.length;){var n=t.pop();if(n in e)return r.value=n,r.done=!1,r}return r.done=!0,r}},e.values=C,T.prototype={constructor:T,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(E),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function a(n,a){return s.type="throw",s.arg=e,r.next=n,a&&(r.method="next",r.arg=t),!!a}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],s=i.completion;if("root"===i.tryLoc)return a("end");if(i.tryLoc<=this.prev){var l=n.call(i,"catchLoc"),c=n.call(i,"finallyLoc");if(l&&c){if(this.prev<i.catchLoc)return a(i.catchLoc,!0);if(this.prev<i.finallyLoc)return a(i.finallyLoc)}else if(l){if(this.prev<i.catchLoc)return a(i.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return a(i.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var a=this.tryEntries[r];if(a.tryLoc<=this.prev&&n.call(a,"finallyLoc")&&this.prev<a.finallyLoc){var o=a;break}}o&&("break"===e||"continue"===e)&&o.tryLoc<=t&&t<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=e,i.arg=t,o?(this.method="next",this.next=o.finallyLoc,m):this.complete(i)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),m},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),E(r),m}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var a=n.arg;E(r)}return a}}throw new Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:C(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),m}},e}(e.exports);try{regeneratorRuntime=t}catch(e){"object"==typeof globalThis?globalThis.regeneratorRuntime=t:Function("r","regeneratorRuntime = r")(t)}}(_v);const Pv=ut({exports:{}}.exports=_v.exports);var Iv=Wa.includes;Ta({target:"Array",proto:!0},{includes:function(e){return Iv(this,e,arguments.length>1?arguments[1]:void 0)}});var Rv=sc("Array").includes,Lv=Ta,Dv=Jd,Fv=Qt,Nv=$o,qv=Zd,zv=Et("".indexOf);Lv({target:"String",proto:!0,forced:!qv("includes")},{includes:function(e){return!!~zv(Nv(Fv(this)),Nv(Dv(e)),arguments.length>1?arguments[1]:void 0)}});var Uv=sc("String").includes,Bv=pr,Mv=Rv,Hv=Uv,Wv=Array.prototype,Vv=String.prototype;const Gv=ut({exports:{}}.exports=function(e){var t=e.includes;return e===Wv||Bv(Wv,e)&&t===Wv.includes?Mv:"string"==typeof e||e===Vv||Bv(Vv,e)&&t===Vv.includes?Hv:t});var Kv=sc("Array").entries,Jv=bo,Yv=Zr,Zv=pr,Qv=Kv,Xv=Array.prototype,eb={DOMTokenList:!0,NodeList:!0};const tb=ut({exports:{}}.exports=function(e){var t=e.entries;return e===Xv||Zv(Xv,e)&&t===Xv.entries||Yv(eb,Jv(e))?Qv:t});const rb=ut({exports:{}}.exports=Af);var nb=Ta,ab=cr,ob=wt,ib=Et,sb=mt,lb=ft.Array,cb=ab("JSON","stringify"),pb=ib(/./.exec),db=ib("".charAt),ub=ib("".charCodeAt),hb=ib("".replace),fb=ib(1..toString),mb=/[\uD800-\uDFFF]/g,yb=/^[\uD800-\uDBFF]$/,gb=/^[\uDC00-\uDFFF]$/,vb=function(e,t,r){var n=db(r,t-1),a=db(r,t+1);return pb(yb,e)&&!pb(gb,a)||pb(gb,e)&&!pb(yb,n)?"\\u"+fb(ub(e,0),16):e},bb=sb((function(){return'"\\udf06\\ud834"'!==cb("\udf06\ud834")||'"\\udead"'!==cb("\udead")}));cb&&nb({target:"JSON",stat:!0,forced:bb},{stringify:function(e,t,r){for(var n=0,a=arguments.length,o=lb(a);n<a;n++)o[n]=arguments[n];var i=ob(cb,null,o);return"string"==typeof i?hb(i,mb,vb):i}});var xb=ar,wb=wt;xb.JSON||(xb.JSON={stringify:JSON.stringify});const $b=ut({exports:{}}.exports=function(e,t,r){return wb(xb.JSON.stringify,null,arguments)});var kb=Ls.map;Ta({target:"Array",proto:!0,forced:!ac("map")},{map:function(e){return kb(this,e,arguments.length>1?arguments[1]:void 0)}});var Sb=sc("Array").map,Ab=pr,Ob=Sb,Eb=Array.prototype;const Tb=ut({exports:{}}.exports=function(e){var t=e.map;return e===Eb||Ab(Eb,e)&&t===Eb.map?Ob:t});const Cb=ut({exports:{}}.exports=oo);var jb=sc("Array").concat,_b=pr,Pb=jb,Ib=Array.prototype;const Rb=ut({exports:{}}.exports=function(e){var t=e.concat;return e===Ib||_b(Ib,e)&&t===Ib.concat?Pb:t});var Lb=jt,Db=Et,Fb=ro,Nb=tr,qb=Db(Rt.f),zb=Db([].push),Ub=function(e){return function(t){for(var r,n=Nb(t),a=Fb(n),o=a.length,i=0,s=[];o>i;)r=a[i++],Lb&&!qb(n,r)||zb(s,e?[r,n[r]]:n[r]);return s}},Bb=[Ub(!0),Ub(!1)][0];Ta({target:"Object",stat:!0},{entries:function(e){return Bb(e)}});var Mb=ar.Object.entries;const Hb=ut({exports:{}}.exports=Mb);const Wb=ut({exports:{}}.exports=uc);!function(){!function(e){!function(t){var r="URLSearchParams"in e,n="Symbol"in e&&"iterator"in Symbol,a="FileReader"in e&&"Blob"in e&&function(){try{return new Blob,!0}catch(e){return!1}}(),o="FormData"in e,i="ArrayBuffer"in e;if(i)var s=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],l=ArrayBuffer.isView||function(e){return e&&s.indexOf(Object.prototype.toString.call(e))>-1};function c(e){if("string"!=typeof e&&(e=String(e)),/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(e))throw new TypeError("Invalid character in header field name");return e.toLowerCase()}function p(e){return"string"!=typeof e&&(e=String(e)),e}function d(e){var t={next:function(){var t=e.shift();return{done:void 0===t,value:t}}};return n&&(t[Symbol.iterator]=function(){return t}),t}function u(e){this.map={},e instanceof u?e.forEach((function(e,t){this.append(t,e)}),this):Array.isArray(e)?e.forEach((function(e){this.append(e[0],e[1])}),this):e&&Object.getOwnPropertyNames(e).forEach((function(t){this.append(t,e[t])}),this)}function h(e){if(e.bodyUsed)return Promise.reject(new TypeError("Already read"));e.bodyUsed=!0}function f(e){return new Promise((function(t,r){e.onload=function(){t(e.result)},e.onerror=function(){r(e.error)}}))}function m(e){var t=new FileReader,r=f(t);return t.readAsArrayBuffer(e),r}function y(e){if(e.slice)return e.slice(0);var t=new Uint8Array(e.byteLength);return t.set(new Uint8Array(e)),t.buffer}function g(){return this.bodyUsed=!1,this._initBody=function(e){var t;this._bodyInit=e,e?"string"==typeof e?this._bodyText=e:a&&Blob.prototype.isPrototypeOf(e)?this._bodyBlob=e:o&&FormData.prototype.isPrototypeOf(e)?this._bodyFormData=e:r&&URLSearchParams.prototype.isPrototypeOf(e)?this._bodyText=e.toString():i&&a&&(t=e)&&DataView.prototype.isPrototypeOf(t)?(this._bodyArrayBuffer=y(e.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):i&&(ArrayBuffer.prototype.isPrototypeOf(e)||l(e))?this._bodyArrayBuffer=y(e):this._bodyText=e=Object.prototype.toString.call(e):this._bodyText="",this.headers.get("content-type")||("string"==typeof e?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):r&&URLSearchParams.prototype.isPrototypeOf(e)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},a&&(this.blob=function(){var e=h(this);if(e)return e;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?h(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(m)}),this.text=function(){var e,t,r,n=h(this);if(n)return n;if(this._bodyBlob)return e=this._bodyBlob,t=new FileReader,r=f(t),t.readAsText(e),r;if(this._bodyArrayBuffer)return Promise.resolve(function(e){for(var t=new Uint8Array(e),r=new Array(t.length),n=0;n<t.length;n++)r[n]=String.fromCharCode(t[n]);return r.join("")}(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},o&&(this.formData=function(){return this.text().then(x)}),this.json=function(){return this.text().then(JSON.parse)},this}u.prototype.append=function(e,t){e=c(e),t=p(t);var r=this.map[e];this.map[e]=r?r+", "+t:t},u.prototype.delete=function(e){delete this.map[c(e)]},u.prototype.get=function(e){return e=c(e),this.has(e)?this.map[e]:null},u.prototype.has=function(e){return this.map.hasOwnProperty(c(e))},u.prototype.set=function(e,t){this.map[c(e)]=p(t)},u.prototype.forEach=function(e,t){for(var r in this.map)this.map.hasOwnProperty(r)&&e.call(t,this.map[r],r,this)},u.prototype.keys=function(){var e=[];return this.forEach((function(t,r){e.push(r)})),d(e)},u.prototype.values=function(){var e=[];return this.forEach((function(t){e.push(t)})),d(e)},u.prototype.entries=function(){var e=[];return this.forEach((function(t,r){e.push([r,t])})),d(e)},n&&(u.prototype[Symbol.iterator]=u.prototype.entries);var v=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];function b(e,t){var r,n,a=(t=t||{}).body;if(e instanceof b){if(e.bodyUsed)throw new TypeError("Already read");this.url=e.url,this.credentials=e.credentials,t.headers||(this.headers=new u(e.headers)),this.method=e.method,this.mode=e.mode,this.signal=e.signal,a||null==e._bodyInit||(a=e._bodyInit,e.bodyUsed=!0)}else this.url=String(e);if(this.credentials=t.credentials||this.credentials||"same-origin",!t.headers&&this.headers||(this.headers=new u(t.headers)),this.method=(r=t.method||this.method||"GET",n=r.toUpperCase(),v.indexOf(n)>-1?n:r),this.mode=t.mode||this.mode||null,this.signal=t.signal||this.signal,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&a)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(a)}function x(e){var t=new FormData;return e.trim().split("&").forEach((function(e){if(e){var r=e.split("="),n=r.shift().replace(/\+/g," "),a=r.join("=").replace(/\+/g," ");t.append(decodeURIComponent(n),decodeURIComponent(a))}})),t}function w(e,t){t||(t={}),this.type="default",this.status=void 0===t.status?200:t.status,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in t?t.statusText:"OK",this.headers=new u(t.headers),this.url=t.url||"",this._initBody(e)}b.prototype.clone=function(){return new b(this,{body:this._bodyInit})},g.call(b.prototype),g.call(w.prototype),w.prototype.clone=function(){return new w(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new u(this.headers),url:this.url})},w.error=function(){var e=new w(null,{status:0,statusText:""});return e.type="error",e};var $=[301,302,303,307,308];w.redirect=function(e,t){if(-1===$.indexOf(t))throw new RangeError("Invalid status code");return new w(null,{status:t,headers:{location:e}})},t.DOMException=e.DOMException;try{new t.DOMException}catch(e){t.DOMException=function(e,t){this.message=e,this.name=t;var r=Error(e);this.stack=r.stack},t.DOMException.prototype=Object.create(Error.prototype),t.DOMException.prototype.constructor=t.DOMException}function k(e,r){return new Promise((function(n,o){var i=new b(e,r);if(i.signal&&i.signal.aborted)return o(new t.DOMException("Aborted","AbortError"));var s=new XMLHttpRequest;function l(){s.abort()}s.onload=function(){var e,t,r={status:s.status,statusText:s.statusText,headers:(e=s.getAllResponseHeaders()||"",t=new u,e.replace(/\r?\n[\t ]+/g," ").split(/\r?\n/).forEach((function(e){var r=e.split(":"),n=r.shift().trim();if(n){var a=r.join(":").trim();t.append(n,a)}})),t)};r.url="responseURL"in s?s.responseURL:r.headers.get("X-Request-URL");var a="response"in s?s.response:s.responseText;n(new w(a,r))},s.onerror=function(){o(new TypeError("Network request failed"))},s.ontimeout=function(){o(new TypeError("Network request failed"))},s.onabort=function(){o(new t.DOMException("Aborted","AbortError"))},s.open(i.method,i.url,!0),"include"===i.credentials?s.withCredentials=!0:"omit"===i.credentials&&(s.withCredentials=!1),"responseType"in s&&a&&(s.responseType="blob"),i.headers.forEach((function(e,t){s.setRequestHeader(t,e)})),i.signal&&(i.signal.addEventListener("abort",l),s.onreadystatechange=function(){4===s.readyState&&i.signal.removeEventListener("abort",l)}),s.send(void 0===i._bodyInit?null:i._bodyInit)}))}k.polyfill=!0,e.fetch||(e.fetch=k,e.Headers=u,e.Request=b,e.Response=w),t.Headers=u,t.Request=b,t.Response=w,t.fetch=k,Object.defineProperty(t,"t",{value:!0})}({})}("undefined"!=typeof self?self:this)}();var Vb="undefined"!=typeof Symbol&&Symbol,Gb="Function.prototype.bind called on incompatible ",Kb=Array.prototype.slice,Jb=Object.prototype.toString,Yb=Function.prototype.bind||function(e){var t=this;if("function"!=typeof t||"[object Function]"!==Jb.call(t))throw new TypeError(Gb+t);for(var r,n=Kb.call(arguments,1),a=function(){if(this instanceof r){var a=t.apply(this,n.concat(Kb.call(arguments)));return Object(a)===a?a:this}return t.apply(e,n.concat(Kb.call(arguments)))},o=Math.max(0,t.length-n.length),i=[],s=0;s<o;s++)i.push("$"+s);if(r=Function("binder","return function ("+i.join(",")+"){ return binder.apply(this,arguments); }")(a),t.prototype){var l=function(){};l.prototype=t.prototype,r.prototype=new l,l.prototype=null}return r},Zb=Yb.call(Function.call,Object.prototype.hasOwnProperty),Qb=SyntaxError,Xb=Function,ex=TypeError,tx=function(e){try{return Xb('"use strict"; return ('+e+").constructor;")()}catch(e){}},rx=Object.getOwnPropertyDescriptor;if(rx)try{rx({},"")}catch(e){rx=null}var nx=function(){throw new ex},ax=rx?function(){try{return nx}catch(e){try{return rx(arguments,"callee").get}catch(e){return nx}}}():nx,ox="function"==typeof Vb&&"function"==typeof Symbol&&"symbol"==typeof Vb("foo")&&"symbol"==typeof Symbol("bar")&&function(){if("function"!=typeof Symbol||"function"!=typeof Object.getOwnPropertySymbols)return!1;if("symbol"==typeof Symbol.iterator)return!0;var e={},t=Symbol("test"),r=Object(t);if("string"==typeof t)return!1;if("[object Symbol]"!==Object.prototype.toString.call(t))return!1;if("[object Symbol]"!==Object.prototype.toString.call(r))return!1;for(t in e[t]=42,e)return!1;if("function"==typeof Object.keys&&0!==Object.keys(e).length)return!1;if("function"==typeof Object.getOwnPropertyNames&&0!==Object.getOwnPropertyNames(e).length)return!1;var n=Object.getOwnPropertySymbols(e);if(1!==n.length||n[0]!==t)return!1;if(!Object.prototype.propertyIsEnumerable.call(e,t))return!1;if("function"==typeof Object.getOwnPropertyDescriptor){var a=Object.getOwnPropertyDescriptor(e,t);if(42!==a.value||!0!==a.enumerable)return!1}return!0}(),ix=Object.getPrototypeOf||function(e){return e.__proto__},sx={},lx="undefined"==typeof Uint8Array?void 0:ix(Uint8Array),cx={"%AggregateError%":"undefined"==typeof AggregateError?void 0:AggregateError,"%Array%":Array,"%ArrayBuffer%":"undefined"==typeof ArrayBuffer?void 0:ArrayBuffer,"%ArrayIteratorPrototype%":ox?ix([][Symbol.iterator]()):void 0,"%AsyncFromSyncIteratorPrototype%":void 0,"%AsyncFunction%":sx,"%AsyncGenerator%":sx,"%AsyncGeneratorFunction%":sx,"%AsyncIteratorPrototype%":sx,"%Atomics%":"undefined"==typeof Atomics?void 0:Atomics,"%BigInt%":"undefined"==typeof BigInt?void 0:BigInt,"%Boolean%":Boolean,"%DataView%":"undefined"==typeof DataView?void 0:DataView,"%Date%":Date,"%decodeURI%":decodeURI,"%decodeURIComponent%":decodeURIComponent,"%encodeURI%":encodeURI,"%encodeURIComponent%":encodeURIComponent,"%Error%":Error,"%eval%":eval,"%EvalError%":EvalError,"%Float32Array%":"undefined"==typeof Float32Array?void 0:Float32Array,"%Float64Array%":"undefined"==typeof Float64Array?void 0:Float64Array,"%FinalizationRegistry%":"undefined"==typeof FinalizationRegistry?void 0:FinalizationRegistry,"%Function%":Xb,"%GeneratorFunction%":sx,"%Int8Array%":"undefined"==typeof Int8Array?void 0:Int8Array,"%Int16Array%":"undefined"==typeof Int16Array?void 0:Int16Array,"%Int32Array%":"undefined"==typeof Int32Array?void 0:Int32Array,"%isFinite%":isFinite,"%isNaN%":isNaN,"%IteratorPrototype%":ox?ix(ix([][Symbol.iterator]())):void 0,"%JSON%":"object"==typeof JSON?JSON:void 0,"%Map%":"undefined"==typeof Map?void 0:Map,"%MapIteratorPrototype%":"undefined"!=typeof Map&&ox?ix((new Map)[Symbol.iterator]()):void 0,"%Math%":Math,"%Number%":Number,"%Object%":Object,"%parseFloat%":parseFloat,"%parseInt%":parseInt,"%Promise%":"undefined"==typeof Promise?void 0:Promise,"%Proxy%":"undefined"==typeof Proxy?void 0:Proxy,"%RangeError%":RangeError,"%ReferenceError%":ReferenceError,"%Reflect%":"undefined"==typeof Reflect?void 0:Reflect,"%RegExp%":RegExp,"%Set%":"undefined"==typeof Set?void 0:Set,"%SetIteratorPrototype%":"undefined"!=typeof Set&&ox?ix((new Set)[Symbol.iterator]()):void 0,"%SharedArrayBuffer%":"undefined"==typeof SharedArrayBuffer?void 0:SharedArrayBuffer,"%String%":String,"%StringIteratorPrototype%":ox?ix(""[Symbol.iterator]()):void 0,"%Symbol%":ox?Symbol:void 0,"%SyntaxError%":Qb,"%ThrowTypeError%":ax,"%TypedArray%":lx,"%TypeError%":ex,"%Uint8Array%":"undefined"==typeof Uint8Array?void 0:Uint8Array,"%Uint8ClampedArray%":"undefined"==typeof Uint8ClampedArray?void 0:Uint8ClampedArray,"%Uint16Array%":"undefined"==typeof Uint16Array?void 0:Uint16Array,"%Uint32Array%":"undefined"==typeof Uint32Array?void 0:Uint32Array,"%URIError%":URIError,"%WeakMap%":"undefined"==typeof WeakMap?void 0:WeakMap,"%WeakRef%":"undefined"==typeof WeakRef?void 0:WeakRef,"%WeakSet%":"undefined"==typeof WeakSet?void 0:WeakSet},px=function e(t){var r;if("%AsyncFunction%"===t)r=tx("async function () {}");else if("%GeneratorFunction%"===t)r=tx("function* () {}");else if("%AsyncGeneratorFunction%"===t)r=tx("async function* () {}");else if("%AsyncGenerator%"===t){var n=e("%AsyncGeneratorFunction%");n&&(r=n.prototype)}else if("%AsyncIteratorPrototype%"===t){var a=e("%AsyncGenerator%");a&&(r=ix(a.prototype))}return cx[t]=r,r},dx={"%ArrayBufferPrototype%":["ArrayBuffer","prototype"],"%ArrayPrototype%":["Array","prototype"],"%ArrayProto_entries%":["Array","prototype","entries"],"%ArrayProto_forEach%":["Array","prototype","forEach"],"%ArrayProto_keys%":["Array","prototype","keys"],"%ArrayProto_values%":["Array","prototype","values"],"%AsyncFunctionPrototype%":["AsyncFunction","prototype"],"%AsyncGenerator%":["AsyncGeneratorFunction","prototype"],"%AsyncGeneratorPrototype%":["AsyncGeneratorFunction","prototype","prototype"],"%BooleanPrototype%":["Boolean","prototype"],"%DataViewPrototype%":["DataView","prototype"],"%DatePrototype%":["Date","prototype"],"%ErrorPrototype%":["Error","prototype"],"%EvalErrorPrototype%":["EvalError","prototype"],"%Float32ArrayPrototype%":["Float32Array","prototype"],"%Float64ArrayPrototype%":["Float64Array","prototype"],"%FunctionPrototype%":["Function","prototype"],"%Generator%":["GeneratorFunction","prototype"],"%GeneratorPrototype%":["GeneratorFunction","prototype","prototype"],"%Int8ArrayPrototype%":["Int8Array","prototype"],"%Int16ArrayPrototype%":["Int16Array","prototype"],"%Int32ArrayPrototype%":["Int32Array","prototype"],"%JSONParse%":["JSON","parse"],"%JSONStringify%":["JSON","stringify"],"%MapPrototype%":["Map","prototype"],"%NumberPrototype%":["Number","prototype"],"%ObjectPrototype%":["Object","prototype"],"%ObjProto_toString%":["Object","prototype","toString"],"%ObjProto_valueOf%":["Object","prototype","valueOf"],"%PromisePrototype%":["Promise","prototype"],"%PromiseProto_then%":["Promise","prototype","then"],"%Promise_all%":["Promise","all"],"%Promise_reject%":["Promise","reject"],"%Promise_resolve%":["Promise","resolve"],"%RangeErrorPrototype%":["RangeError","prototype"],"%ReferenceErrorPrototype%":["ReferenceError","prototype"],"%RegExpPrototype%":["RegExp","prototype"],"%SetPrototype%":["Set","prototype"],"%SharedArrayBufferPrototype%":["SharedArrayBuffer","prototype"],"%StringPrototype%":["String","prototype"],"%SymbolPrototype%":["Symbol","prototype"],"%SyntaxErrorPrototype%":["SyntaxError","prototype"],"%TypedArrayPrototype%":["TypedArray","prototype"],"%TypeErrorPrototype%":["TypeError","prototype"],"%Uint8ArrayPrototype%":["Uint8Array","prototype"],"%Uint8ClampedArrayPrototype%":["Uint8ClampedArray","prototype"],"%Uint16ArrayPrototype%":["Uint16Array","prototype"],"%Uint32ArrayPrototype%":["Uint32Array","prototype"],"%URIErrorPrototype%":["URIError","prototype"],"%WeakMapPrototype%":["WeakMap","prototype"],"%WeakSetPrototype%":["WeakSet","prototype"]},ux=Yb,hx=Zb,fx=ux.call(Function.call,Array.prototype.concat),mx=ux.call(Function.apply,Array.prototype.splice),yx=ux.call(Function.call,String.prototype.replace),gx=ux.call(Function.call,String.prototype.slice),vx=/[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g,bx=/\\(\\)?/g,xx=function(e){var t=gx(e,0,1),r=gx(e,-1);if("%"===t&&"%"!==r)throw new Qb("invalid intrinsic syntax, expected closing `%`");if("%"===r&&"%"!==t)throw new Qb("invalid intrinsic syntax, expected opening `%`");var n=[];return yx(e,vx,(function(e,t,r,a){n[n.length]=r?yx(a,bx,"$1"):t||e})),n},wx=function(e,t){var r,n=e;if(hx(dx,n)&&(n="%"+(r=dx[n])[0]+"%"),hx(cx,n)){var a=cx[n];if(a===sx&&(a=px(n)),void 0===a&&!t)throw new ex("intrinsic "+e+" exists, but is not available. Please file an issue!");return{alias:r,name:n,value:a}}throw new Qb("intrinsic "+e+" does not exist!")},$x=function(e,t){if("string"!=typeof e||0===e.length)throw new ex("intrinsic name must be a non-empty string");if(arguments.length>1&&"boolean"!=typeof t)throw new ex('"allowMissing" argument must be a boolean');var r=xx(e),n=r.length>0?r[0]:"",a=wx("%"+n+"%",t),o=a.name,i=a.value,s=!1,l=a.alias;l&&(n=l[0],mx(r,fx([0,1],l)));for(var c=1,p=!0;c<r.length;c+=1){var d=r[c],u=gx(d,0,1),h=gx(d,-1);if(('"'===u||"'"===u||"`"===u||'"'===h||"'"===h||"`"===h)&&u!==h)throw new Qb("property names with quotes must have matching quotes");if("constructor"!==d&&p||(s=!0),hx(cx,o="%"+(n+="."+d)+"%"))i=cx[o];else if(null!=i){if(!(d in i)){if(!t)throw new ex("base intrinsic for "+e+" exists, but the property is not available.");return}if(rx&&c+1>=r.length){var f=rx(i,d);i=(p=!!f)&&"get"in f&&!("originalValue"in f.get)?f.get:i[d]}else p=hx(i,d),i=i[d];p&&!s&&(cx[o]=i)}}return i},kx={exports:{}};!function(e){var t=Yb,r=$x,n=r("%Function.prototype.apply%"),a=r("%Function.prototype.call%"),o=r("%Reflect.apply%",!0)||t.call(a,n),i=r("%Object.getOwnPropertyDescriptor%",!0),s=r("%Object.defineProperty%",!0),l=r("%Math.max%");if(s)try{s({},"a",{value:1})}catch(e){s=null}e.exports=function(e){var r=o(t,a,arguments);if(i&&s){var n=i(r,"length");n.configurable&&s(r,"length",{value:1+l(0,e.length-(arguments.length-1))})}return r};var c=function(){return o(t,n,arguments)};s?s(e.exports,"apply",{value:c}):e.exports.apply=c}(kx);var Sx=$x,Ax=kx.exports,Ox=Ax(Sx("String.prototype.indexOf"));const Ex=function(e){var t=e.default;if("function"==typeof t){var r=function(){return t.apply(this,arguments)};r.prototype=t.prototype}else r={};return Object.defineProperty(r,"t",{value:!0}),Object.keys(e).forEach((function(t){var n=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(r,t,n.get?n:{enumerable:!0,get:function(){return e[t]}})})),r}(Object.freeze(Object.defineProperty({__proto__:null,default:{}},Symbol.toStringTag,{value:"Module"})));var Tx="function"==typeof Map&&Map.prototype,Cx=Object.getOwnPropertyDescriptor&&Tx?Object.getOwnPropertyDescriptor(Map.prototype,"size"):null,jx=Tx&&Cx&&"function"==typeof Cx.get?Cx.get:null,_x=Tx&&Map.prototype.forEach,Px="function"==typeof Set&&Set.prototype,Ix=Object.getOwnPropertyDescriptor&&Px?Object.getOwnPropertyDescriptor(Set.prototype,"size"):null,Rx=Px&&Ix&&"function"==typeof Ix.get?Ix.get:null,Lx=Px&&Set.prototype.forEach,Dx="function"==typeof WeakMap&&WeakMap.prototype?WeakMap.prototype.has:null,Fx="function"==typeof WeakSet&&WeakSet.prototype?WeakSet.prototype.has:null,Nx="function"==typeof WeakRef&&WeakRef.prototype?WeakRef.prototype.deref:null,qx=Boolean.prototype.valueOf,zx=Object.prototype.toString,Ux=Function.prototype.toString,Bx=String.prototype.match,Mx=String.prototype.slice,Hx=String.prototype.replace,Wx=String.prototype.toUpperCase,Vx=String.prototype.toLowerCase,Gx=RegExp.prototype.test,Kx=Array.prototype.concat,Jx=Array.prototype.join,Yx=Array.prototype.slice,Zx=Math.floor,Qx="function"==typeof BigInt?BigInt.prototype.valueOf:null,Xx=Object.getOwnPropertySymbols,ew="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?Symbol.prototype.toString:null,tw="function"==typeof Symbol&&"object"==typeof Symbol.iterator,rw="function"==typeof Symbol&&Symbol.toStringTag&&(Symbol.toStringTag,1)?Symbol.toStringTag:null,nw=Object.prototype.propertyIsEnumerable,aw=("function"==typeof Reflect?Reflect.getPrototypeOf:Object.getPrototypeOf)||([].__proto__===Array.prototype?function(e){return e.__proto__}:null);function ow(e,t){if(e===1/0||e===-1/0||e!=e||e&&e>-1e3&&e<1e3||Gx.call(/e/,t))return t;var r=/[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;if("number"==typeof e){var n=e<0?-Zx(-e):Zx(e);if(n!==e){var a=String(n),o=Mx.call(t,a.length+1);return Hx.call(a,r,"$&_")+"."+Hx.call(Hx.call(o,/([0-9]{3})/g,"$&_"),/_$/,"")}}return Hx.call(t,r,"$&_")}var iw=Ex.custom,sw=iw&&dw(iw)?iw:null;function lw(e,t,r){var n="double"===(r.quoteStyle||t)?'"':"'";return n+e+n}function cw(e){return Hx.call(String(e),/"/g,"&quot;")}function pw(e){return!("[object Array]"!==fw(e)||rw&&"object"==typeof e&&rw in e)}function dw(e){if(tw)return e&&"object"==typeof e&&e instanceof Symbol;if("symbol"==typeof e)return!0;if(!e||"object"!=typeof e||!ew)return!1;try{return ew.call(e),!0}catch(e){}return!1}var uw=Object.prototype.hasOwnProperty||function(e){return e in this};function hw(e,t){return uw.call(e,t)}function fw(e){return zx.call(e)}function mw(e,t){if(e.indexOf)return e.indexOf(t);for(var r=0,n=e.length;r<n;r++)if(e[r]===t)return r;return-1}function yw(e,t){if(e.length>t.maxStringLength){var r=e.length-t.maxStringLength,n="... "+r+" more character"+(r>1?"s":"");return yw(Mx.call(e,0,t.maxStringLength),t)+n}return lw(Hx.call(Hx.call(e,/(['\\])/g,"\\$1"),/[\x00-\x1f]/g,gw),"single",t)}function gw(e){var t=e.charCodeAt(0),r={8:"b",9:"t",10:"n",12:"f",13:"r"}[t];return r?"\\"+r:"\\x"+(t<16?"0":"")+Wx.call(t.toString(16))}function vw(e){return"Object("+e+")"}function bw(e){return e+" { ? }"}function xw(e,t,r,n){return e+" ("+t+") {"+(n?ww(r,n):Jx.call(r,", "))+"}"}function ww(e,t){if(0===e.length)return"";var r="\n"+t.prev+t.base;return r+Jx.call(e,","+r)+"\n"+t.prev}function $w(e,t){var r=pw(e),n=[];if(r){n.length=e.length;for(var a=0;a<e.length;a++)n[a]=hw(e,a)?t(e[a],e):""}var o,i="function"==typeof Xx?Xx(e):[];if(tw){o={};for(var s=0;s<i.length;s++)o["$"+i[s]]=i[s]}for(var l in e)hw(e,l)&&(r&&String(Number(l))===l&&l<e.length||tw&&o["$"+l]instanceof Symbol||(Gx.call(/[^\w$]/,l)?n.push(t(l,e)+": "+t(e[l],e)):n.push(l+": "+t(e[l],e))));if("function"==typeof Xx)for(var c=0;c<i.length;c++)nw.call(e,i[c])&&n.push("["+t(i[c])+"]: "+t(e[i[c]],e));return n}var kw=$x,Sw=function(e,t){var r=Sx(e,!!t);return"function"==typeof r&&Ox(e,".prototype.")>-1?Ax(r):r},Aw=function e(t,r,n,a){var o=r||{};if(hw(o,"quoteStyle")&&"single"!==o.quoteStyle&&"double"!==o.quoteStyle)throw new TypeError('option "quoteStyle" must be "single" or "double"');if(hw(o,"maxStringLength")&&("number"==typeof o.maxStringLength?o.maxStringLength<0&&o.maxStringLength!==1/0:null!==o.maxStringLength))throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');var i=!hw(o,"customInspect")||o.customInspect;if("boolean"!=typeof i&&"symbol"!==i)throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");if(hw(o,"indent")&&null!==o.indent&&"\t"!==o.indent&&!(parseInt(o.indent,10)===o.indent&&o.indent>0))throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');if(hw(o,"numericSeparator")&&"boolean"!=typeof o.numericSeparator)throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');var s=o.numericSeparator;if(void 0===t)return"undefined";if(null===t)return"null";if("boolean"==typeof t)return t?"true":"false";if("string"==typeof t)return yw(t,o);if("number"==typeof t){if(0===t)return 1/0/t>0?"0":"-0";var l=String(t);return s?ow(t,l):l}if("bigint"==typeof t){var c=String(t)+"n";return s?ow(t,c):c}var p=void 0===o.depth?5:o.depth;if(void 0===n&&(n=0),n>=p&&p>0&&"object"==typeof t)return pw(t)?"[Array]":"[Object]";var d=function(e,t){var r;if("\t"===e.indent)r="\t";else{if(!("number"==typeof e.indent&&e.indent>0))return null;r=Jx.call(Array(e.indent+1)," ")}return{base:r,prev:Jx.call(Array(t+1),r)}}(o,n);if(void 0===a)a=[];else if(mw(a,t)>=0)return"[Circular]";function u(t,r,i){if(r&&(a=Yx.call(a)).push(r),i){var s={depth:o.depth};return hw(o,"quoteStyle")&&(s.quoteStyle=o.quoteStyle),e(t,s,n+1,a)}return e(t,o,n+1,a)}if("function"==typeof t){var h=function(e){if(e.name)return e.name;var t=Bx.call(Ux.call(e),/^function\s*([\w$]+)/);return t?t[1]:null}(t),f=$w(t,u);return"[Function"+(h?": "+h:" (anonymous)")+"]"+(f.length>0?" { "+Jx.call(f,", ")+" }":"")}if(dw(t)){var m=tw?Hx.call(String(t),/^(Symbol\(.*\))_[^)]*$/,"$1"):ew.call(t);return"object"!=typeof t||tw?m:vw(m)}if(function(e){return!(!e||"object"!=typeof e)&&("undefined"!=typeof HTMLElement&&e instanceof HTMLElement||"string"==typeof e.nodeName&&"function"==typeof e.getAttribute)}(t)){for(var y="<"+Vx.call(String(t.nodeName)),g=t.attributes||[],v=0;v<g.length;v++)y+=" "+g[v].name+"="+lw(cw(g[v].value),"double",o);return y+=">",t.childNodes&&t.childNodes.length&&(y+="..."),y+"</"+Vx.call(String(t.nodeName))+">"}if(pw(t)){if(0===t.length)return"[]";var b=$w(t,u);return d&&!function(e){for(var t=0;t<e.length;t++)if(mw(e[t],"\n")>=0)return!1;return!0}(b)?"["+ww(b,d)+"]":"[ "+Jx.call(b,", ")+" ]"}if(function(e){return!("[object Error]"!==fw(e)||rw&&"object"==typeof e&&rw in e)}(t)){var x=$w(t,u);return"cause"in t&&!nw.call(t,"cause")?"{ ["+String(t)+"] "+Jx.call(Kx.call("[cause]: "+u(t.cause),x),", ")+" }":0===x.length?"["+String(t)+"]":"{ ["+String(t)+"] "+Jx.call(x,", ")+" }"}if("object"==typeof t&&i){if(sw&&"function"==typeof t[sw])return t[sw]();if("symbol"!==i&&"function"==typeof t.inspect)return t.inspect()}if(function(e){if(!jx||!e||"object"!=typeof e)return!1;try{jx.call(e);try{Rx.call(e)}catch(e){return!0}return e instanceof Map}catch(e){}return!1}(t)){var w=[];return _x.call(t,(function(e,r){w.push(u(r,t,!0)+" => "+u(e,t))})),xw("Map",jx.call(t),w,d)}if(function(e){if(!Rx||!e||"object"!=typeof e)return!1;try{Rx.call(e);try{jx.call(e)}catch(e){return!0}return e instanceof Set}catch(e){}return!1}(t)){var $=[];return Lx.call(t,(function(e){$.push(u(e,t))})),xw("Set",Rx.call(t),$,d)}if(function(e){if(!Dx||!e||"object"!=typeof e)return!1;try{Dx.call(e,Dx);try{Fx.call(e,Fx)}catch(e){return!0}return e instanceof WeakMap}catch(e){}return!1}(t))return bw("WeakMap");if(function(e){if(!Fx||!e||"object"!=typeof e)return!1;try{Fx.call(e,Fx);try{Dx.call(e,Dx)}catch(e){return!0}return e instanceof WeakSet}catch(e){}return!1}(t))return bw("WeakSet");if(function(e){if(!Nx||!e||"object"!=typeof e)return!1;try{return Nx.call(e),!0}catch(e){}return!1}(t))return bw("WeakRef");if(function(e){return!("[object Number]"!==fw(e)||rw&&"object"==typeof e&&rw in e)}(t))return vw(u(Number(t)));if(function(e){if(!e||"object"!=typeof e||!Qx)return!1;try{return Qx.call(e),!0}catch(e){}return!1}(t))return vw(u(Qx.call(t)));if(function(e){return!("[object Boolean]"!==fw(e)||rw&&"object"==typeof e&&rw in e)}(t))return vw(qx.call(t));if(function(e){return!("[object String]"!==fw(e)||rw&&"object"==typeof e&&rw in e)}(t))return vw(u(String(t)));if(!function(e){return!("[object Date]"!==fw(e)||rw&&"object"==typeof e&&rw in e)}(t)&&!function(e){return!("[object RegExp]"!==fw(e)||rw&&"object"==typeof e&&rw in e)}(t)){var k=$w(t,u),S=aw?aw(t)===Object.prototype:t instanceof Object||t.constructor===Object,A=t instanceof Object?"":"null prototype",O=!S&&rw&&Object(t)===t&&rw in t?Mx.call(fw(t),8,-1):A?"Object":"",E=(S||"function"!=typeof t.constructor?"":t.constructor.name?t.constructor.name+" ":"")+(O||A?"["+Jx.call(Kx.call([],O||[],A||[]),": ")+"] ":"");return 0===k.length?E+"{}":d?E+"{"+ww(k,d)+"}":E+"{ "+Jx.call(k,", ")+" }"}return String(t)},Ow=kw("%TypeError%"),Ew=kw("%WeakMap%",!0),Tw=kw("%Map%",!0),Cw=Sw("WeakMap.prototype.get",!0),jw=Sw("WeakMap.prototype.set",!0),_w=Sw("WeakMap.prototype.has",!0),Pw=Sw("Map.prototype.get",!0),Iw=Sw("Map.prototype.set",!0),Rw=Sw("Map.prototype.has",!0),Lw=function(e,t){for(var r,n=e;null!==(r=n.next);n=r)if(r.key===t)return n.next=r.next,r.next=e.next,e.next=r,r},Dw=String.prototype.replace,Fw=/%20/g,Nw="RFC3986",qw={default:Nw,formatters:{RFC1738:function(e){return Dw.call(e,Fw,"+")},RFC3986:function(e){return String(e)}},RFC1738:"RFC1738",RFC3986:Nw},zw=qw,Uw=Object.prototype.hasOwnProperty,Bw=Array.isArray,Mw=function(){for(var e=[],t=0;t<256;++t)e.push("%"+((t<16?"0":"")+t.toString(16)).toUpperCase());return e}(),Hw=function(e,t){for(var r=t&&t.plainObjects?Object.create(null):{},n=0;n<e.length;++n)void 0!==e[n]&&(r[n]=e[n]);return r},Ww={arrayToObject:Hw,assign:function(e,t){return Object.keys(t).reduce((function(e,r){return e[r]=t[r],e}),e)},combine:function(e,t){return[].concat(e,t)},compact:function(e){for(var t=[{obj:{o:e},prop:"o"}],r=[],n=0;n<t.length;++n)for(var a=t[n],o=a.obj[a.prop],i=Object.keys(o),s=0;s<i.length;++s){var l=i[s],c=o[l];"object"==typeof c&&null!==c&&-1===r.indexOf(c)&&(t.push({obj:o,prop:l}),r.push(c))}return function(e){for(;e.length>1;){var t=e.pop(),r=t.obj[t.prop];if(Bw(r)){for(var n=[],a=0;a<r.length;++a)void 0!==r[a]&&n.push(r[a]);t.obj[t.prop]=n}}}(t),e},decode:function(e,t,r){var n=e.replace(/\+/g," ");if("iso-8859-1"===r)return n.replace(/%[0-9a-f]{2}/gi,unescape);try{return decodeURIComponent(n)}catch(e){return n}},encode:function(e,t,r,n,a){if(0===e.length)return e;var o=e;if("symbol"==typeof e?o=Symbol.prototype.toString.call(e):"string"!=typeof e&&(o=String(e)),"iso-8859-1"===r)return escape(o).replace(/%u[0-9a-f]{4}/gi,(function(e){return"%26%23"+parseInt(e.slice(2),16)+"%3B"}));for(var i="",s=0;s<o.length;++s){var l=o.charCodeAt(s);45===l||46===l||95===l||126===l||l>=48&&l<=57||l>=65&&l<=90||l>=97&&l<=122||a===zw.RFC1738&&(40===l||41===l)?i+=o.charAt(s):l<128?i+=Mw[l]:l<2048?i+=Mw[192|l>>6]+Mw[128|63&l]:l<55296||l>=57344?i+=Mw[224|l>>12]+Mw[128|l>>6&63]+Mw[128|63&l]:(s+=1,l=65536+((1023&l)<<10|1023&o.charCodeAt(s)),i+=Mw[240|l>>18]+Mw[128|l>>12&63]+Mw[128|l>>6&63]+Mw[128|63&l])}return i},isBuffer:function(e){return!(!e||"object"!=typeof e||!(e.constructor&&e.constructor.isBuffer&&e.constructor.isBuffer(e)))},isRegExp:function(e){return"[object RegExp]"===Object.prototype.toString.call(e)},maybeMap:function(e,t){if(Bw(e)){for(var r=[],n=0;n<e.length;n+=1)r.push(t(e[n]));return r}return t(e)},merge:function e(t,r,n){if(!r)return t;if("object"!=typeof r){if(Bw(t))t.push(r);else{if(!t||"object"!=typeof t)return[t,r];(n&&(n.plainObjects||n.allowPrototypes)||!Uw.call(Object.prototype,r))&&(t[r]=!0)}return t}if(!t||"object"!=typeof t)return[t].concat(r);var a=t;return Bw(t)&&!Bw(r)&&(a=Hw(t,n)),Bw(t)&&Bw(r)?(r.forEach((function(r,a){if(Uw.call(t,a)){var o=t[a];o&&"object"==typeof o&&r&&"object"==typeof r?t[a]=e(o,r,n):t.push(r)}else t[a]=r})),t):Object.keys(r).reduce((function(t,a){var o=r[a];return Uw.call(t,a)?t[a]=e(t[a],o,n):t[a]=o,t}),a)}},Vw=function(){var e,t,r,n={assert:function(e){if(!n.has(e))throw new Ow("Side channel does not contain "+Aw(e))},get:function(n){if(Ew&&n&&("object"==typeof n||"function"==typeof n)){if(e)return Cw(e,n)}else if(Tw){if(t)return Pw(t,n)}else if(r)return(a=Lw(r,n))&&a.value;var a},has:function(n){if(Ew&&n&&("object"==typeof n||"function"==typeof n)){if(e)return _w(e,n)}else if(Tw){if(t)return Rw(t,n)}else if(r)return!!Lw(r,n);return!1},set:function(n,a){var o,i,s,l;Ew&&n&&("object"==typeof n||"function"==typeof n)?(e||(e=new Ew),jw(e,n,a)):Tw?(t||(t=new Tw),Iw(t,n,a)):(r||(r={key:{},next:null}),s=a,(l=Lw(o=r,i=n))?l.value=s:o.next={key:i,next:o.next,value:s})}};return n},Gw=Ww,Kw=qw,Jw=Object.prototype.hasOwnProperty,Yw={brackets:function(e){return e+"[]"},comma:"comma",indices:function(e,t){return e+"["+t+"]"},repeat:function(e){return e}},Zw=Array.isArray,Qw=String.prototype.split,Xw=Array.prototype.push,e$=function(e,t){Xw.apply(e,Zw(t)?t:[t])},t$=Date.prototype.toISOString,r$=Kw.default,n$={addQueryPrefix:!1,allowDots:!1,charset:"utf-8",charsetSentinel:!1,delimiter:"&",encode:!0,encoder:Gw.encode,encodeValuesOnly:!1,format:r$,formatter:Kw.formatters[r$],indices:!1,serializeDate:function(e){return t$.call(e)},skipNulls:!1,strictNullHandling:!1},a$={},o$=function e(t,r,n,a,o,i,s,l,c,p,d,u,h,f,m){for(var y,g=t,v=m,b=0,x=!1;void 0!==(v=v.get(a$))&&!x;){var w=v.get(t);if(b+=1,void 0!==w){if(w===b)throw new RangeError("Cyclic object value");x=!0}void 0===v.get(a$)&&(b=0)}if("function"==typeof s?g=s(r,g):g instanceof Date?g=p(g):"comma"===n&&Zw(g)&&(g=Gw.maybeMap(g,(function(e){return e instanceof Date?p(e):e}))),null===g){if(a)return i&&!h?i(r,n$.encoder,f,"key",d):r;g=""}if("string"==typeof(y=g)||"number"==typeof y||"boolean"==typeof y||"symbol"==typeof y||"bigint"==typeof y||Gw.isBuffer(g)){if(i){var $=h?r:i(r,n$.encoder,f,"key",d);if("comma"===n&&h){for(var k=Qw.call(String(g),","),S="",A=0;A<k.length;++A)S+=(0===A?"":",")+u(i(k[A],n$.encoder,f,"value",d));return[u($)+"="+S]}return[u($)+"="+u(i(g,n$.encoder,f,"value",d))]}return[u(r)+"="+u(String(g))]}var O,E=[];if(void 0===g)return E;if("comma"===n&&Zw(g))O=[{value:g.length>0?g.join(",")||null:void 0}];else if(Zw(s))O=s;else{var T=Object.keys(g);O=l?T.sort(l):T}for(var C=0;C<O.length;++C){var j=O[C],_="object"==typeof j&&void 0!==j.value?j.value:g[j];if(!o||null!==_){var P=Zw(g)?"function"==typeof n?n(r,j):r:r+(c?"."+j:"["+j+"]");m.set(t,b);var I=Vw();I.set(a$,m),e$(E,e(_,P,n,a,o,i,s,l,c,p,d,u,h,f,I))}}return E},i$=Ww,s$=Object.prototype.hasOwnProperty,l$=Array.isArray,c$={allowDots:!1,allowPrototypes:!1,allowSparse:!1,arrayLimit:20,charset:"utf-8",charsetSentinel:!1,comma:!1,decoder:i$.decode,delimiter:"&",depth:5,ignoreQueryPrefix:!1,interpretNumericEntities:!1,parameterLimit:1e3,parseArrays:!0,plainObjects:!1,strictNullHandling:!1},p$=function(e){return e.replace(/&#(\d+);/g,(function(e,t){return String.fromCharCode(parseInt(t,10))}))},d$=function(e,t){return e&&"string"==typeof e&&t.comma&&e.indexOf(",")>-1?e.split(","):e},u$=function(e,t,r,n){if(e){var a=r.allowDots?e.replace(/\.([^.[]+)/g,"[$1]"):e,o=/(\[[^[\]]*])/g,i=r.depth>0&&/(\[[^[\]]*])/.exec(a),s=i?a.slice(0,i.index):a,l=[];if(s){if(!r.plainObjects&&s$.call(Object.prototype,s)&&!r.allowPrototypes)return;l.push(s)}for(var c=0;r.depth>0&&null!==(i=o.exec(a))&&c<r.depth;){if(c+=1,!r.plainObjects&&s$.call(Object.prototype,i[1].slice(1,-1))&&!r.allowPrototypes)return;l.push(i[1])}return i&&l.push("["+a.slice(i.index)+"]"),function(e,t,r,n){for(var a=n?t:d$(t,r),o=e.length-1;o>=0;--o){var i,s=e[o];if("[]"===s&&r.parseArrays)i=[].concat(a);else{i=r.plainObjects?Object.create(null):{};var l="["===s.charAt(0)&&"]"===s.charAt(s.length-1)?s.slice(1,-1):s,c=parseInt(l,10);r.parseArrays||""!==l?!isNaN(c)&&s!==l&&String(c)===l&&c>=0&&r.parseArrays&&c<=r.arrayLimit?(i=[])[c]=a:"__proto__"!==l&&(i[l]=a):i={0:a}}a=i}return a}(l,t,r,n)}},h$=function(e,t){var r=function(e){if(!e)return c$;if(null!==e.decoder&&void 0!==e.decoder&&"function"!=typeof e.decoder)throw new TypeError("Decoder has to be a function.");if(void 0!==e.charset&&"utf-8"!==e.charset&&"iso-8859-1"!==e.charset)throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");var t=void 0===e.charset?c$.charset:e.charset;return{allowDots:void 0===e.allowDots?c$.allowDots:!!e.allowDots,allowPrototypes:"boolean"==typeof e.allowPrototypes?e.allowPrototypes:c$.allowPrototypes,allowSparse:"boolean"==typeof e.allowSparse?e.allowSparse:c$.allowSparse,arrayLimit:"number"==typeof e.arrayLimit?e.arrayLimit:c$.arrayLimit,charset:t,charsetSentinel:"boolean"==typeof e.charsetSentinel?e.charsetSentinel:c$.charsetSentinel,comma:"boolean"==typeof e.comma?e.comma:c$.comma,decoder:"function"==typeof e.decoder?e.decoder:c$.decoder,delimiter:"string"==typeof e.delimiter||i$.isRegExp(e.delimiter)?e.delimiter:c$.delimiter,depth:"number"==typeof e.depth||!1===e.depth?+e.depth:c$.depth,ignoreQueryPrefix:!0===e.ignoreQueryPrefix,interpretNumericEntities:"boolean"==typeof e.interpretNumericEntities?e.interpretNumericEntities:c$.interpretNumericEntities,parameterLimit:"number"==typeof e.parameterLimit?e.parameterLimit:c$.parameterLimit,parseArrays:!1!==e.parseArrays,plainObjects:"boolean"==typeof e.plainObjects?e.plainObjects:c$.plainObjects,strictNullHandling:"boolean"==typeof e.strictNullHandling?e.strictNullHandling:c$.strictNullHandling}}(t);if(""===e||null==e)return r.plainObjects?Object.create(null):{};for(var n="string"==typeof e?function(e,t){var r,n={},a=t.ignoreQueryPrefix?e.replace(/^\?/,""):e,o=t.parameterLimit===1/0?void 0:t.parameterLimit,i=a.split(t.delimiter,o),s=-1,l=t.charset;if(t.charsetSentinel)for(r=0;r<i.length;++r)0===i[r].indexOf("utf8=")&&("utf8=%E2%9C%93"===i[r]?l="utf-8":"utf8=%26%2310003%3B"===i[r]&&(l="iso-8859-1"),s=r,r=i.length);for(r=0;r<i.length;++r)if(r!==s){var c,p,d=i[r],u=d.indexOf("]="),h=-1===u?d.indexOf("="):u+1;-1===h?(c=t.decoder(d,c$.decoder,l,"key"),p=t.strictNullHandling?null:""):(c=t.decoder(d.slice(0,h),c$.decoder,l,"key"),p=i$.maybeMap(d$(d.slice(h+1),t),(function(e){return t.decoder(e,c$.decoder,l,"value")}))),p&&t.interpretNumericEntities&&"iso-8859-1"===l&&(p=p$(p)),d.indexOf("[]=")>-1&&(p=l$(p)?[p]:p),s$.call(n,c)?n[c]=i$.combine(n[c],p):n[c]=p}return n}(e,r):e,a=r.plainObjects?Object.create(null):{},o=Object.keys(n),i=0;i<o.length;++i){var s=o[i],l=u$(s,n[s],r,"string"==typeof e);a=i$.merge(a,l,r)}return!0===r.allowSparse?a:i$.compact(a)},f$=function(e,t){var r,n=e,a=function(e){if(!e)return n$;if(null!==e.encoder&&void 0!==e.encoder&&"function"!=typeof e.encoder)throw new TypeError("Encoder has to be a function.");var t=e.charset||n$.charset;if(void 0!==e.charset&&"utf-8"!==e.charset&&"iso-8859-1"!==e.charset)throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");var r=Kw.default;if(void 0!==e.format){if(!Jw.call(Kw.formatters,e.format))throw new TypeError("Unknown format option provided.");r=e.format}var n=Kw.formatters[r],a=n$.filter;return("function"==typeof e.filter||Zw(e.filter))&&(a=e.filter),{addQueryPrefix:"boolean"==typeof e.addQueryPrefix?e.addQueryPrefix:n$.addQueryPrefix,allowDots:void 0===e.allowDots?n$.allowDots:!!e.allowDots,charset:t,charsetSentinel:"boolean"==typeof e.charsetSentinel?e.charsetSentinel:n$.charsetSentinel,delimiter:void 0===e.delimiter?n$.delimiter:e.delimiter,encode:"boolean"==typeof e.encode?e.encode:n$.encode,encoder:"function"==typeof e.encoder?e.encoder:n$.encoder,encodeValuesOnly:"boolean"==typeof e.encodeValuesOnly?e.encodeValuesOnly:n$.encodeValuesOnly,filter:a,format:r,formatter:n,serializeDate:"function"==typeof e.serializeDate?e.serializeDate:n$.serializeDate,skipNulls:"boolean"==typeof e.skipNulls?e.skipNulls:n$.skipNulls,sort:"function"==typeof e.sort?e.sort:null,strictNullHandling:"boolean"==typeof e.strictNullHandling?e.strictNullHandling:n$.strictNullHandling}}(t);"function"==typeof a.filter?n=(0,a.filter)("",n):Zw(a.filter)&&(r=a.filter);var o,i=[];if("object"!=typeof n||null===n)return"";o=t&&t.arrayFormat in Yw?t.arrayFormat:t&&"indices"in t?t.indices?"indices":"repeat":"indices";var s=Yw[o];r||(r=Object.keys(n)),a.sort&&r.sort(a.sort);for(var l=Vw(),c=0;c<r.length;++c){var p=r[c];a.skipNulls&&null===n[p]||e$(i,o$(n[p],p,s,a.strictNullHandling,a.skipNulls,a.encode?a.encoder:null,a.filter,a.sort,a.allowDots,a.serializeDate,a.format,a.formatter,a.encodeValuesOnly,a.charset,l))}var d=i.join(a.delimiter),u=!0===a.addQueryPrefix?"?":"";return a.charsetSentinel&&("iso-8859-1"===a.charset?u+="utf8=%26%2310003%3B&":u+="utf8=%E2%9C%93&"),d.length>0?u+d:""};function m$(e){return null==e}var y$={isNothing:m$,isObject:function(e){return"object"==typeof e&&null!==e},toArray:function(e){return Array.isArray(e)?e:m$(e)?[]:[e]},repeat:function(e,t){var r,n="";for(r=0;r<t;r+=1)n+=e;return n},isNegativeZero:function(e){return 0===e&&Number.NEGATIVE_INFINITY===1/e},extend:function(e,t){var r,n,a,o;if(t)for(r=0,n=(o=Object.keys(t)).length;r<n;r+=1)e[a=o[r]]=t[a];return e}};function g$(e,t){var r="",n=e.reason||"(unknown reason)";return e.mark?(e.mark.name&&(r+='in "'+e.mark.name+'" '),r+="("+(e.mark.line+1)+":"+(e.mark.column+1)+")",!t&&e.mark.snippet&&(r+="\n\n"+e.mark.snippet),n+" "+r):n}function v$(e,t){Error.call(this),this.name="YAMLException",this.reason=e,this.mark=t,this.message=g$(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack||""}v$.prototype=Object.create(Error.prototype),v$.prototype.constructor=v$,v$.prototype.toString=function(e){return this.name+": "+g$(this,e)};var b$=v$;function x$(e,t,r,n,a){var o="",i="",s=Math.floor(a/2)-1;return n-t>s&&(t=n-s+(o=" ... ").length),r-n>s&&(r=n+s-(i=" ...").length),{str:o+e.slice(t,r).replace(/\t/g,"→")+i,pos:n-t+o.length}}function w$(e,t){return y$.repeat(" ",t-e.length)+e}var $$=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],k$=["scalar","sequence","mapping"],S$=function(e,t){if(t=t||{},Object.keys(t).forEach((function(t){if(-1===$$.indexOf(t))throw new b$('Unknown option "'+t+'" is met in definition of "'+e+'" YAML type.')})),this.options=t,this.tag=e,this.kind=t.kind||null,this.resolve=t.resolve||function(){return!0},this.construct=t.construct||function(e){return e},this.instanceOf=t.instanceOf||null,this.predicate=t.predicate||null,this.represent=t.represent||null,this.representName=t.representName||null,this.defaultStyle=t.defaultStyle||null,this.multi=t.multi||!1,this.styleAliases=(r=t.styleAliases||null,n={},null!==r&&Object.keys(r).forEach((function(e){r[e].forEach((function(t){n[String(t)]=e}))})),n),-1===k$.indexOf(this.kind))throw new b$('Unknown kind "'+this.kind+'" is specified for "'+e+'" YAML type.');var r,n};function A$(e,t){var r=[];return e[t].forEach((function(e){var t=r.length;r.forEach((function(r,n){r.tag===e.tag&&r.kind===e.kind&&r.multi===e.multi&&(t=n)})),r[t]=e})),r}function O$(e){return this.extend(e)}O$.prototype.extend=function(e){var t=[],r=[];if(e instanceof S$)r.push(e);else if(Array.isArray(e))r=r.concat(e);else{if(!e||!Array.isArray(e.implicit)&&!Array.isArray(e.explicit))throw new b$("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");e.implicit&&(t=t.concat(e.implicit)),e.explicit&&(r=r.concat(e.explicit))}t.forEach((function(e){if(!(e instanceof S$))throw new b$("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(e.loadKind&&"scalar"!==e.loadKind)throw new b$("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(e.multi)throw new b$("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")})),r.forEach((function(e){if(!(e instanceof S$))throw new b$("Specified list of YAML types (or a single Type object) contains a non-Type object.")}));var n=Object.create(O$.prototype);return n.implicit=(this.implicit||[]).concat(t),n.explicit=(this.explicit||[]).concat(r),n.compiledImplicit=A$(n,"implicit"),n.compiledExplicit=A$(n,"explicit"),n.compiledTypeMap=function(){var e,t,r={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}};function n(e){e.multi?(r.multi[e.kind].push(e),r.multi.fallback.push(e)):r[e.kind][e.tag]=r.fallback[e.tag]=e}for(e=0,t=arguments.length;e<t;e+=1)arguments[e].forEach(n);return r}(n.compiledImplicit,n.compiledExplicit),n};var E$=O$,T$=new S$("tag:yaml.org,2002:str",{kind:"scalar",construct:function(e){return null!==e?e:""}}),C$=new S$("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return null!==e?e:[]}}),j$=new S$("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return null!==e?e:{}}}),_$=new E$({explicit:[T$,C$,j$]}),P$=new S$("tag:yaml.org,2002:null",{kind:"scalar",resolve:function(e){if(null===e)return!0;var t=e.length;return 1===t&&"~"===e||4===t&&("null"===e||"Null"===e||"NULL"===e)},construct:function(){return null},predicate:function(e){return null===e},represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"}),I$=new S$("tag:yaml.org,2002:bool",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t=e.length;return 4===t&&("true"===e||"True"===e||"TRUE"===e)||5===t&&("false"===e||"False"===e||"FALSE"===e)},construct:function(e){return"true"===e||"True"===e||"TRUE"===e},predicate:function(e){return"[object Boolean]"===Object.prototype.toString.call(e)},represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"});function R$(e){return 48<=e&&e<=55}function L$(e){return 48<=e&&e<=57}var D$=new S$("tag:yaml.org,2002:int",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t,r,n=e.length,a=0,o=!1;if(!n)return!1;if("-"!==(t=e[a])&&"+"!==t||(t=e[++a]),"0"===t){if(a+1===n)return!0;if("b"===(t=e[++a])){for(a++;a<n;a++)if("_"!==(t=e[a])){if("0"!==t&&"1"!==t)return!1;o=!0}return o&&"_"!==t}if("x"===t){for(a++;a<n;a++)if("_"!==(t=e[a])){if(!(48<=(r=e.charCodeAt(a))&&r<=57||65<=r&&r<=70||97<=r&&r<=102))return!1;o=!0}return o&&"_"!==t}if("o"===t){for(a++;a<n;a++)if("_"!==(t=e[a])){if(!R$(e.charCodeAt(a)))return!1;o=!0}return o&&"_"!==t}}if("_"===t)return!1;for(;a<n;a++)if("_"!==(t=e[a])){if(!L$(e.charCodeAt(a)))return!1;o=!0}return!(!o||"_"===t)},construct:function(e){var t,r=e,n=1;if(-1!==r.indexOf("_")&&(r=r.replace(/_/g,"")),"-"!==(t=r[0])&&"+"!==t||("-"===t&&(n=-1),t=(r=r.slice(1))[0]),"0"===r)return 0;if("0"===t){if("b"===r[1])return n*parseInt(r.slice(2),2);if("x"===r[1])return n*parseInt(r.slice(2),16);if("o"===r[1])return n*parseInt(r.slice(2),8)}return n*parseInt(r,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&e%1==0&&!y$.isNegativeZero(e)},represent:{binary:function(e){return e>=0?"0b"+e.toString(2):"-0b"+e.toString(2).slice(1)},octal:function(e){return e>=0?"0o"+e.toString(8):"-0o"+e.toString(8).slice(1)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return e>=0?"0x"+e.toString(16).toUpperCase():"-0x"+e.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),F$=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),N$=/^[-+]?[0-9]+e/,q$=new S$("tag:yaml.org,2002:float",{kind:"scalar",resolve:function(e){return null!==e&&!(!F$.test(e)||"_"===e[e.length-1])},construct:function(e){var t,r;return r="-"===(t=e.replace(/_/g,"").toLowerCase())[0]?-1:1,"+-".indexOf(t[0])>=0&&(t=t.slice(1)),".inf"===t?1===r?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:".nan"===t?NaN:r*parseFloat(t,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&(e%1!=0||y$.isNegativeZero(e))},represent:function(e,t){var r;if(isNaN(e))switch(t){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===e)switch(t){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===e)switch(t){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(y$.isNegativeZero(e))return"-0.0";return r=e.toString(10),N$.test(r)?r.replace("e",".e"):r},defaultStyle:"lowercase"}),z$=_$.extend({implicit:[P$,I$,D$,q$]}),U$=z$,B$=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),M$=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"),H$=new S$("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:function(e){return null!==e&&(null!==B$.exec(e)||null!==M$.exec(e))},construct:function(e){var t,r,n,a,o,i,s,l,c=0,p=null;if(null===(t=B$.exec(e))&&(t=M$.exec(e)),null===t)throw new Error("Date resolve error");if(r=+t[1],n=+t[2]-1,a=+t[3],!t[4])return new Date(Date.UTC(r,n,a));if(o=+t[4],i=+t[5],s=+t[6],t[7]){for(c=t[7].slice(0,3);c.length<3;)c+="0";c=+c}return t[9]&&(p=6e4*(60*+t[10]+ +(t[11]||0)),"-"===t[9]&&(p=-p)),l=new Date(Date.UTC(r,n,a,o,i,s,c)),p&&l.setTime(l.getTime()-p),l},instanceOf:Date,represent:function(e){return e.toISOString()}}),W$=new S$("tag:yaml.org,2002:merge",{kind:"scalar",resolve:function(e){return"<<"===e||null===e}}),V$="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r",G$=new S$("tag:yaml.org,2002:binary",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t,r,n=0,a=e.length,o=V$;for(r=0;r<a;r++)if(!((t=o.indexOf(e.charAt(r)))>64)){if(t<0)return!1;n+=6}return n%8==0},construct:function(e){var t,r,n=e.replace(/[\r\n=]/g,""),a=n.length,o=V$,i=0,s=[];for(t=0;t<a;t++)t%4==0&&t&&(s.push(i>>16&255),s.push(i>>8&255),s.push(255&i)),i=i<<6|o.indexOf(n.charAt(t));return 0==(r=a%4*6)?(s.push(i>>16&255),s.push(i>>8&255),s.push(255&i)):18===r?(s.push(i>>10&255),s.push(i>>2&255)):12===r&&s.push(i>>4&255),new Uint8Array(s)},predicate:function(e){return"[object Uint8Array]"===Object.prototype.toString.call(e)},represent:function(e){var t,r,n="",a=0,o=e.length,i=V$;for(t=0;t<o;t++)t%3==0&&t&&(n+=i[a>>18&63],n+=i[a>>12&63],n+=i[a>>6&63],n+=i[63&a]),a=(a<<8)+e[t];return 0==(r=o%3)?(n+=i[a>>18&63],n+=i[a>>12&63],n+=i[a>>6&63],n+=i[63&a]):2===r?(n+=i[a>>10&63],n+=i[a>>4&63],n+=i[a<<2&63],n+=i[64]):1===r&&(n+=i[a>>2&63],n+=i[a<<4&63],n+=i[64],n+=i[64]),n}}),K$=Object.prototype.hasOwnProperty,J$=Object.prototype.toString,Y$=new S$("tag:yaml.org,2002:omap",{kind:"sequence",resolve:function(e){if(null===e)return!0;var t,r,n,a,o,i=[],s=e;for(t=0,r=s.length;t<r;t+=1){if(n=s[t],o=!1,"[object Object]"!==J$.call(n))return!1;for(a in n)if(K$.call(n,a)){if(o)return!1;o=!0}if(!o)return!1;if(-1!==i.indexOf(a))return!1;i.push(a)}return!0},construct:function(e){return null!==e?e:[]}}),Z$=Object.prototype.toString,Q$=new S$("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:function(e){if(null===e)return!0;var t,r,n,a,o,i=e;for(o=new Array(i.length),t=0,r=i.length;t<r;t+=1){if(n=i[t],"[object Object]"!==Z$.call(n))return!1;if(1!==(a=Object.keys(n)).length)return!1;o[t]=[a[0],n[a[0]]]}return!0},construct:function(e){if(null===e)return[];var t,r,n,a,o,i=e;for(o=new Array(i.length),t=0,r=i.length;t<r;t+=1)n=i[t],a=Object.keys(n),o[t]=[a[0],n[a[0]]];return o}}),X$=Object.prototype.hasOwnProperty,ek=new S$("tag:yaml.org,2002:set",{kind:"mapping",resolve:function(e){if(null===e)return!0;var t,r=e;for(t in r)if(X$.call(r,t)&&null!==r[t])return!1;return!0},construct:function(e){return null!==e?e:{}}}),tk=U$.extend({implicit:[H$,W$],explicit:[G$,Y$,Q$,ek]}),rk=Object.prototype.hasOwnProperty,nk=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,ak=/[\x85\u2028\u2029]/,ok=/[,\[\]\{\}]/,ik=/^(?:!|!!|![a-z\-]+!)$/i,sk=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function lk(e){return Object.prototype.toString.call(e)}function ck(e){return 10===e||13===e}function pk(e){return 9===e||32===e}function dk(e){return 9===e||32===e||10===e||13===e}function uk(e){return 44===e||91===e||93===e||123===e||125===e}function hk(e){var t;return 48<=e&&e<=57?e-48:97<=(t=32|e)&&t<=102?t-97+10:-1}function fk(e){return 48===e?"\0":97===e?"":98===e?"\b":116===e||9===e?"\t":110===e?"\n":118===e?"\v":102===e?"\f":114===e?"\r":101===e?"":32===e?" ":34===e?'"':47===e?"/":92===e?"\\":78===e?"":95===e?" ":76===e?"\u2028":80===e?"\u2029":""}function mk(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10),56320+(e-65536&1023))}for(var yk=new Array(256),gk=new Array(256),vk=0;vk<256;vk++)yk[vk]=fk(vk)?1:0,gk[vk]=fk(vk);function bk(e,t){this.input=e,this.filename=t.filename||null,this.schema=t.schema||tk,this.onWarning=t.onWarning||null,this.legacy=t.legacy||!1,this.json=t.json||!1,this.listener=t.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function xk(e,t){var r={name:e.filename,buffer:e.input.slice(0,-1),position:e.position,line:e.line,column:e.position-e.lineStart};return r.snippet=function(e,t){if(t=Object.create(t||null),!e.buffer)return null;t.maxLength||(t.maxLength=79),"number"!=typeof t.indent&&(t.indent=1),"number"!=typeof t.linesBefore&&(t.linesBefore=3),"number"!=typeof t.linesAfter&&(t.linesAfter=2);for(var r,n=/\r?\n|\r|\0/g,a=[0],o=[],i=-1;r=n.exec(e.buffer);)o.push(r.index),a.push(r.index+r[0].length),e.position<=r.index&&i<0&&(i=a.length-2);i<0&&(i=a.length-1);var s,l,c="",p=Math.min(e.line+t.linesAfter,o.length).toString().length,d=t.maxLength-(t.indent+p+3);for(s=1;s<=t.linesBefore&&!(i-s<0);s++)l=x$(e.buffer,a[i-s],o[i-s],e.position-(a[i]-a[i-s]),d),c=y$.repeat(" ",t.indent)+w$((e.line-s+1).toString(),p)+" | "+l.str+"\n"+c;for(l=x$(e.buffer,a[i],o[i],e.position,d),c+=y$.repeat(" ",t.indent)+w$((e.line+1).toString(),p)+" | "+l.str+"\n",c+=y$.repeat("-",t.indent+p+3+l.pos)+"^\n",s=1;s<=t.linesAfter&&!(i+s>=o.length);s++)l=x$(e.buffer,a[i+s],o[i+s],e.position-(a[i]-a[i+s]),d),c+=y$.repeat(" ",t.indent)+w$((e.line+s+1).toString(),p)+" | "+l.str+"\n";return c.replace(/\n$/,"")}(r),new b$(t,r)}function wk(e,t){throw xk(e,t)}function $k(e,t){e.onWarning&&e.onWarning.call(null,xk(e,t))}var kk={YAML:function(e,t,r){var n,a,o;null!==e.version&&wk(e,"duplication of %YAML directive"),1!==r.length&&wk(e,"YAML directive accepts exactly one argument"),null===(n=/^([0-9]+)\.([0-9]+)$/.exec(r[0]))&&wk(e,"ill-formed argument of the YAML directive"),a=parseInt(n[1],10),o=parseInt(n[2],10),1!==a&&wk(e,"unacceptable YAML version of the document"),e.version=r[0],e.checkLineBreaks=o<2,1!==o&&2!==o&&$k(e,"unsupported YAML version of the document")},TAG:function(e,t,r){var n,a;2!==r.length&&wk(e,"TAG directive accepts exactly two arguments"),n=r[0],a=r[1],ik.test(n)||wk(e,"ill-formed tag handle (first argument) of the TAG directive"),rk.call(e.tagMap,n)&&wk(e,'there is a previously declared suffix for "'+n+'" tag handle'),sk.test(a)||wk(e,"ill-formed tag prefix (second argument) of the TAG directive");try{a=decodeURIComponent(a)}catch(t){wk(e,"tag prefix is malformed: "+a)}e.tagMap[n]=a}};function Sk(e,t,r,n){var a,o,i,s;if(t<r){if(s=e.input.slice(t,r),n)for(a=0,o=s.length;a<o;a+=1)9===(i=s.charCodeAt(a))||32<=i&&i<=1114111||wk(e,"expected valid JSON character");else nk.test(s)&&wk(e,"the stream contains non-printable characters");e.result+=s}}function Ak(e,t,r,n){var a,o,i,s;for(y$.isObject(r)||wk(e,"cannot merge mappings; the provided source object is unacceptable"),i=0,s=(a=Object.keys(r)).length;i<s;i+=1)o=a[i],rk.call(t,o)||(t[o]=r[o],n[o]=!0)}function Ok(e,t,r,n,a,o,i,s,l){var c,p;if(Array.isArray(a))for(c=0,p=(a=Array.prototype.slice.call(a)).length;c<p;c+=1)Array.isArray(a[c])&&wk(e,"nested arrays are not supported inside keys"),"object"==typeof a&&"[object Object]"===lk(a[c])&&(a[c]="[object Object]");if("object"==typeof a&&"[object Object]"===lk(a)&&(a="[object Object]"),a=String(a),null===t&&(t={}),"tag:yaml.org,2002:merge"===n)if(Array.isArray(o))for(c=0,p=o.length;c<p;c+=1)Ak(e,t,o[c],r);else Ak(e,t,o,r);else e.json||rk.call(r,a)||!rk.call(t,a)||(e.line=i||e.line,e.lineStart=s||e.lineStart,e.position=l||e.position,wk(e,"duplicated mapping key")),"__proto__"===a?Object.defineProperty(t,a,{configurable:!0,enumerable:!0,writable:!0,value:o}):t[a]=o,delete r[a];return t}function Ek(e){var t;10===(t=e.input.charCodeAt(e.position))?e.position++:13===t?(e.position++,10===e.input.charCodeAt(e.position)&&e.position++):wk(e,"a line break is expected"),e.line+=1,e.lineStart=e.position,e.firstTabInLine=-1}function Tk(e,t,r){for(var n=0,a=e.input.charCodeAt(e.position);0!==a;){for(;pk(a);)9===a&&-1===e.firstTabInLine&&(e.firstTabInLine=e.position),a=e.input.charCodeAt(++e.position);if(t&&35===a)do{a=e.input.charCodeAt(++e.position)}while(10!==a&&13!==a&&0!==a);if(!ck(a))break;for(Ek(e),a=e.input.charCodeAt(e.position),n++,e.lineIndent=0;32===a;)e.lineIndent++,a=e.input.charCodeAt(++e.position)}return-1!==r&&0!==n&&e.lineIndent<r&&$k(e,"deficient indentation"),n}function Ck(e){var t,r=e.position;return!(45!==(t=e.input.charCodeAt(r))&&46!==t||t!==e.input.charCodeAt(r+1)||t!==e.input.charCodeAt(r+2)||(r+=3,0!==(t=e.input.charCodeAt(r))&&!dk(t)))}function jk(e,t){1===t?e.result+=" ":t>1&&(e.result+=y$.repeat("\n",t-1))}function _k(e,t){var r,n,a=e.tag,o=e.anchor,i=[],s=!1;if(-1!==e.firstTabInLine)return!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=i),n=e.input.charCodeAt(e.position);0!==n&&(-1!==e.firstTabInLine&&(e.position=e.firstTabInLine,wk(e,"tab characters must not be used in indentation")),45===n)&&dk(e.input.charCodeAt(e.position+1));)if(s=!0,e.position++,Tk(e,!0,-1)&&e.lineIndent<=t)i.push(null),n=e.input.charCodeAt(e.position);else if(r=e.line,Rk(e,t,3,!1,!0),i.push(e.result),Tk(e,!0,-1),n=e.input.charCodeAt(e.position),(e.line===r||e.lineIndent>t)&&0!==n)wk(e,"bad indentation of a sequence entry");else if(e.lineIndent<t)break;return!!s&&(e.tag=a,e.anchor=o,e.kind="sequence",e.result=i,!0)}function Pk(e){var t,r,n,a,o=!1,i=!1;if(33!==(a=e.input.charCodeAt(e.position)))return!1;if(null!==e.tag&&wk(e,"duplication of a tag property"),60===(a=e.input.charCodeAt(++e.position))?(o=!0,a=e.input.charCodeAt(++e.position)):33===a?(i=!0,r="!!",a=e.input.charCodeAt(++e.position)):r="!",t=e.position,o){do{a=e.input.charCodeAt(++e.position)}while(0!==a&&62!==a);e.position<e.length?(n=e.input.slice(t,e.position),a=e.input.charCodeAt(++e.position)):wk(e,"unexpected end of the stream within a verbatim tag")}else{for(;0!==a&&!dk(a);)33===a&&(i?wk(e,"tag suffix cannot contain exclamation marks"):(r=e.input.slice(t-1,e.position+1),ik.test(r)||wk(e,"named tag handle cannot contain such characters"),i=!0,t=e.position+1)),a=e.input.charCodeAt(++e.position);n=e.input.slice(t,e.position),ok.test(n)&&wk(e,"tag suffix cannot contain flow indicator characters")}n&&!sk.test(n)&&wk(e,"tag name cannot contain such characters: "+n);try{n=decodeURIComponent(n)}catch(t){wk(e,"tag name is malformed: "+n)}return o?e.tag=n:rk.call(e.tagMap,r)?e.tag=e.tagMap[r]+n:"!"===r?e.tag="!"+n:"!!"===r?e.tag="tag:yaml.org,2002:"+n:wk(e,'undeclared tag handle "'+r+'"'),!0}function Ik(e){var t,r;if(38!==(r=e.input.charCodeAt(e.position)))return!1;for(null!==e.anchor&&wk(e,"duplication of an anchor property"),r=e.input.charCodeAt(++e.position),t=e.position;0!==r&&!dk(r)&&!uk(r);)r=e.input.charCodeAt(++e.position);return e.position===t&&wk(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(t,e.position),!0}function Rk(e,t,r,n,a){var o,i,s,l,c,p,d,u,h,f=1,m=!1,y=!1;if(null!==e.listener&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,o=i=s=4===r||3===r,n&&Tk(e,!0,-1)&&(m=!0,e.lineIndent>t?f=1:e.lineIndent===t?f=0:e.lineIndent<t&&(f=-1)),1===f)for(;Pk(e)||Ik(e);)Tk(e,!0,-1)?(m=!0,s=o,e.lineIndent>t?f=1:e.lineIndent===t?f=0:e.lineIndent<t&&(f=-1)):s=!1;if(s&&(s=m||a),1!==f&&4!==r||(u=1===r||2===r?t:t+1,h=e.position-e.lineStart,1===f?s&&(_k(e,h)||function(e,t,r){var n,a,o,i,s,l,c,p=e.tag,d=e.anchor,u={},h=Object.create(null),f=null,m=null,y=null,g=!1,v=!1;if(-1!==e.firstTabInLine)return!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=u),c=e.input.charCodeAt(e.position);0!==c;){if(g||-1===e.firstTabInLine||(e.position=e.firstTabInLine,wk(e,"tab characters must not be used in indentation")),n=e.input.charCodeAt(e.position+1),o=e.line,63!==c&&58!==c||!dk(n)){if(i=e.line,s=e.lineStart,l=e.position,!Rk(e,r,2,!1,!0))break;if(e.line===o){for(c=e.input.charCodeAt(e.position);pk(c);)c=e.input.charCodeAt(++e.position);if(58===c)dk(c=e.input.charCodeAt(++e.position))||wk(e,"a whitespace character is expected after the key-value separator within a block mapping"),g&&(Ok(e,u,h,f,m,null,i,s,l),f=m=y=null),v=!0,g=!1,a=!1,f=e.tag,m=e.result;else{if(!v)return e.tag=p,e.anchor=d,!0;wk(e,"can not read an implicit mapping pair; a colon is missed")}}else{if(!v)return e.tag=p,e.anchor=d,!0;wk(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else 63===c?(g&&(Ok(e,u,h,f,m,null,i,s,l),f=m=y=null),v=!0,g=!0,a=!0):g?(g=!1,a=!0):wk(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,c=n;if((e.line===o||e.lineIndent>t)&&(g&&(i=e.line,s=e.lineStart,l=e.position),Rk(e,t,4,!0,a)&&(g?m=e.result:y=e.result),g||(Ok(e,u,h,f,m,y,i,s,l),f=m=y=null),Tk(e,!0,-1),c=e.input.charCodeAt(e.position)),(e.line===o||e.lineIndent>t)&&0!==c)wk(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return g&&Ok(e,u,h,f,m,null,i,s,l),v&&(e.tag=p,e.anchor=d,e.kind="mapping",e.result=u),v}(e,h,u))||function(e,t){var r,n,a,o,i,s,l,c,p,d,u,h,f=!0,m=e.tag,y=e.anchor,g=Object.create(null);if(91===(h=e.input.charCodeAt(e.position)))i=93,c=!1,o=[];else{if(123!==h)return!1;i=125,c=!0,o={}}for(null!==e.anchor&&(e.anchorMap[e.anchor]=o),h=e.input.charCodeAt(++e.position);0!==h;){if(Tk(e,!0,t),(h=e.input.charCodeAt(e.position))===i)return e.position++,e.tag=m,e.anchor=y,e.kind=c?"mapping":"sequence",e.result=o,!0;f?44===h&&wk(e,"expected the node content, but found ','"):wk(e,"missed comma between flow collection entries"),u=null,s=l=!1,63===h&&dk(e.input.charCodeAt(e.position+1))&&(s=l=!0,e.position++,Tk(e,!0,t)),r=e.line,n=e.lineStart,a=e.position,Rk(e,t,1,!1,!0),d=e.tag,p=e.result,Tk(e,!0,t),h=e.input.charCodeAt(e.position),!l&&e.line!==r||58!==h||(s=!0,h=e.input.charCodeAt(++e.position),Tk(e,!0,t),Rk(e,t,1,!1,!0),u=e.result),c?Ok(e,o,g,d,p,u,r,n,a):s?o.push(Ok(e,null,g,d,p,u,r,n,a)):o.push(p),Tk(e,!0,t),44===(h=e.input.charCodeAt(e.position))?(f=!0,h=e.input.charCodeAt(++e.position)):f=!1}wk(e,"unexpected end of the stream within a flow collection")}(e,u)?y=!0:(i&&function(e,t){var r,n,a,o,i,s=1,l=!1,c=!1,p=t,d=0,u=!1;if(124===(o=e.input.charCodeAt(e.position)))n=!1;else{if(62!==o)return!1;n=!0}for(e.kind="scalar",e.result="";0!==o;)if(43===(o=e.input.charCodeAt(++e.position))||45===o)1===s?s=43===o?3:2:wk(e,"repeat of a chomping mode identifier");else{if(!((a=48<=(i=o)&&i<=57?i-48:-1)>=0))break;0===a?wk(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):c?wk(e,"repeat of an indentation width identifier"):(p=t+a-1,c=!0)}if(pk(o)){do{o=e.input.charCodeAt(++e.position)}while(pk(o));if(35===o)do{o=e.input.charCodeAt(++e.position)}while(!ck(o)&&0!==o)}for(;0!==o;){for(Ek(e),e.lineIndent=0,o=e.input.charCodeAt(e.position);(!c||e.lineIndent<p)&&32===o;)e.lineIndent++,o=e.input.charCodeAt(++e.position);if(!c&&e.lineIndent>p&&(p=e.lineIndent),ck(o))d++;else{if(e.lineIndent<p){3===s?e.result+=y$.repeat("\n",l?1+d:d):1===s&&l&&(e.result+="\n");break}for(n?pk(o)?(u=!0,e.result+=y$.repeat("\n",l?1+d:d)):u?(u=!1,e.result+=y$.repeat("\n",d+1)):0===d?l&&(e.result+=" "):e.result+=y$.repeat("\n",d):e.result+=y$.repeat("\n",l?1+d:d),l=!0,c=!0,d=0,r=e.position;!ck(o)&&0!==o;)o=e.input.charCodeAt(++e.position);Sk(e,r,e.position,!1)}}return!0}(e,u)||function(e,t){var r,n,a;if(39!==(r=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,n=a=e.position;0!==(r=e.input.charCodeAt(e.position));)if(39===r){if(Sk(e,n,e.position,!0),39!==(r=e.input.charCodeAt(++e.position)))return!0;n=e.position,e.position++,a=e.position}else ck(r)?(Sk(e,n,a,!0),jk(e,Tk(e,!1,t)),n=a=e.position):e.position===e.lineStart&&Ck(e)?wk(e,"unexpected end of the document within a single quoted scalar"):(e.position++,a=e.position);wk(e,"unexpected end of the stream within a single quoted scalar")}(e,u)||function(e,t){var r,n,a,o,i,s,l;if(34!==(s=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,r=n=e.position;0!==(s=e.input.charCodeAt(e.position));){if(34===s)return Sk(e,r,e.position,!0),e.position++,!0;if(92===s){if(Sk(e,r,e.position,!0),ck(s=e.input.charCodeAt(++e.position)))Tk(e,!1,t);else if(s<256&&yk[s])e.result+=gk[s],e.position++;else if((i=120===(l=s)?2:117===l?4:85===l?8:0)>0){for(a=i,o=0;a>0;a--)(i=hk(s=e.input.charCodeAt(++e.position)))>=0?o=(o<<4)+i:wk(e,"expected hexadecimal character");e.result+=mk(o),e.position++}else wk(e,"unknown escape sequence");r=n=e.position}else ck(s)?(Sk(e,r,n,!0),jk(e,Tk(e,!1,t)),r=n=e.position):e.position===e.lineStart&&Ck(e)?wk(e,"unexpected end of the document within a double quoted scalar"):(e.position++,n=e.position)}wk(e,"unexpected end of the stream within a double quoted scalar")}(e,u)?y=!0:function(e){var t,r,n;if(42!==(n=e.input.charCodeAt(e.position)))return!1;for(n=e.input.charCodeAt(++e.position),t=e.position;0!==n&&!dk(n)&&!uk(n);)n=e.input.charCodeAt(++e.position);return e.position===t&&wk(e,"name of an alias node must contain at least one character"),r=e.input.slice(t,e.position),rk.call(e.anchorMap,r)||wk(e,'unidentified alias "'+r+'"'),e.result=e.anchorMap[r],Tk(e,!0,-1),!0}(e)?(y=!0,null===e.tag&&null===e.anchor||wk(e,"alias node should not have any properties")):function(e,t,r){var n,a,o,i,s,l,c,p,d=e.kind,u=e.result;if(dk(p=e.input.charCodeAt(e.position))||uk(p)||35===p||38===p||42===p||33===p||124===p||62===p||39===p||34===p||37===p||64===p||96===p)return!1;if((63===p||45===p)&&(dk(n=e.input.charCodeAt(e.position+1))||r&&uk(n)))return!1;for(e.kind="scalar",e.result="",a=o=e.position,i=!1;0!==p;){if(58===p){if(dk(n=e.input.charCodeAt(e.position+1))||r&&uk(n))break}else if(35===p){if(dk(e.input.charCodeAt(e.position-1)))break}else{if(e.position===e.lineStart&&Ck(e)||r&&uk(p))break;if(ck(p)){if(s=e.line,l=e.lineStart,c=e.lineIndent,Tk(e,!1,-1),e.lineIndent>=t){i=!0,p=e.input.charCodeAt(e.position);continue}e.position=o,e.line=s,e.lineStart=l,e.lineIndent=c;break}}i&&(Sk(e,a,o,!1),jk(e,e.line-s),a=o=e.position,i=!1),pk(p)||(o=e.position+1),p=e.input.charCodeAt(++e.position)}return Sk(e,a,o,!1),!!e.result||(e.kind=d,e.result=u,!1)}(e,u,1===r)&&(y=!0,null===e.tag&&(e.tag="?")),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):0===f&&(y=s&&_k(e,h))),null===e.tag)null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);else if("?"===e.tag){for(null!==e.result&&"scalar"!==e.kind&&wk(e,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+e.kind+'"'),l=0,c=e.implicitTypes.length;l<c;l+=1)if((d=e.implicitTypes[l]).resolve(e.result)){e.result=d.construct(e.result),e.tag=d.tag,null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);break}}else if("!"!==e.tag){if(rk.call(e.typeMap[e.kind||"fallback"],e.tag))d=e.typeMap[e.kind||"fallback"][e.tag];else for(d=null,l=0,c=(p=e.typeMap.multi[e.kind||"fallback"]).length;l<c;l+=1)if(e.tag.slice(0,p[l].tag.length)===p[l].tag){d=p[l];break}d||wk(e,"unknown tag !<"+e.tag+">"),null!==e.result&&d.kind!==e.kind&&wk(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+d.kind+'", not "'+e.kind+'"'),d.resolve(e.result,e.tag)?(e.result=d.construct(e.result,e.tag),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):wk(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")}return null!==e.listener&&e.listener("close",e),null!==e.tag||null!==e.anchor||y}function Lk(e){var t,r,n,a,o=e.position,i=!1;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap=Object.create(null),e.anchorMap=Object.create(null);0!==(a=e.input.charCodeAt(e.position))&&(Tk(e,!0,-1),a=e.input.charCodeAt(e.position),!(e.lineIndent>0||37!==a));){for(i=!0,a=e.input.charCodeAt(++e.position),t=e.position;0!==a&&!dk(a);)a=e.input.charCodeAt(++e.position);for(n=[],(r=e.input.slice(t,e.position)).length<1&&wk(e,"directive name must not be less than one character in length");0!==a;){for(;pk(a);)a=e.input.charCodeAt(++e.position);if(35===a){do{a=e.input.charCodeAt(++e.position)}while(0!==a&&!ck(a));break}if(ck(a))break;for(t=e.position;0!==a&&!dk(a);)a=e.input.charCodeAt(++e.position);n.push(e.input.slice(t,e.position))}0!==a&&Ek(e),rk.call(kk,r)?kk[r](e,r,n):$k(e,'unknown document directive "'+r+'"')}Tk(e,!0,-1),0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)?(e.position+=3,Tk(e,!0,-1)):i&&wk(e,"directives end mark is expected"),Rk(e,e.lineIndent-1,4,!1,!0),Tk(e,!0,-1),e.checkLineBreaks&&ak.test(e.input.slice(o,e.position))&&$k(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&Ck(e)?46===e.input.charCodeAt(e.position)&&(e.position+=3,Tk(e,!0,-1)):e.position<e.length-1&&wk(e,"end of the stream or a document separator is expected")}function Dk(e,t){t=t||{},0!==(e=String(e)).length&&(10!==e.charCodeAt(e.length-1)&&13!==e.charCodeAt(e.length-1)&&(e+="\n"),65279===e.charCodeAt(0)&&(e=e.slice(1)));var r=new bk(e,t),n=e.indexOf("\0");for(-1!==n&&(r.position=n,wk(r,"null byte is not allowed in input")),r.input+="\0";32===r.input.charCodeAt(r.position);)r.lineIndent+=1,r.position+=1;for(;r.position<r.length-1;)Lk(r);return r.documents}var Fk={loadAll:function(e,t,r){null!==t&&"object"==typeof t&&void 0===r&&(r=t,t=null);var n=Dk(e,r);if("function"!=typeof t)return n;for(var a=0,o=n.length;a<o;a+=1)t(n[a])},load:function(e,t){var r=Dk(e,t);if(0!==r.length){if(1===r.length)return r[0];throw new b$("expected a single document in the stream, but found more")}}},Nk=Object.prototype.toString,qk=Object.prototype.hasOwnProperty,zk={0:"\\0",7:"\\a",8:"\\b",9:"\\t",10:"\\n",11:"\\v",12:"\\f",13:"\\r",27:"\\e",34:'\\"',92:"\\\\",133:"\\N",160:"\\_",8232:"\\L",8233:"\\P"},Uk=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],Bk=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function Mk(e){var t,r,n;if(t=e.toString(16).toUpperCase(),e<=255)r="x",n=2;else if(e<=65535)r="u",n=4;else{if(!(e<=4294967295))throw new b$("code point within a string may not be greater than 0xFFFFFFFF");r="U",n=8}return"\\"+r+y$.repeat("0",n-t.length)+t}function Hk(e){this.schema=e.schema||tk,this.indent=Math.max(1,e.indent||2),this.noArrayIndent=e.noArrayIndent||!1,this.skipInvalid=e.skipInvalid||!1,this.flowLevel=y$.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=function(e,t){var r,n,a,o,i,s,l;if(null===t)return{};for(r={},a=0,o=(n=Object.keys(t)).length;a<o;a+=1)i=n[a],s=String(t[i]),"!!"===i.slice(0,2)&&(i="tag:yaml.org,2002:"+i.slice(2)),(l=e.compiledTypeMap.fallback[i])&&qk.call(l.styleAliases,s)&&(s=l.styleAliases[s]),r[i]=s;return r}(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.noRefs=e.noRefs||!1,this.noCompatMode=e.noCompatMode||!1,this.condenseFlow=e.condenseFlow||!1,this.quotingType='"'===e.quotingType?2:1,this.forceQuotes=e.forceQuotes||!1,this.replacer="function"==typeof e.replacer?e.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function Wk(e,t){for(var r,n=y$.repeat(" ",t),a=0,o=-1,i="",s=e.length;a<s;)-1===(o=e.indexOf("\n",a))?(r=e.slice(a),a=s):(r=e.slice(a,o+1),a=o+1),r.length&&"\n"!==r&&(i+=n),i+=r;return i}function Vk(e,t){return"\n"+y$.repeat(" ",e.indent*t)}function Gk(e){return 32===e||9===e}function Kk(e){return 32<=e&&e<=126||161<=e&&e<=55295&&8232!==e&&8233!==e||57344<=e&&e<=65533&&65279!==e||65536<=e&&e<=1114111}function Jk(e){return Kk(e)&&65279!==e&&13!==e&&10!==e}function Yk(e,t,r){var n=Jk(e),a=n&&!Gk(e);return(r?n:n&&44!==e&&91!==e&&93!==e&&123!==e&&125!==e)&&35!==e&&!(58===t&&!a)||Jk(t)&&!Gk(t)&&35===e||58===t&&a}function Zk(e,t){var r,n=e.charCodeAt(t);return n>=55296&&n<=56319&&t+1<e.length&&(r=e.charCodeAt(t+1))>=56320&&r<=57343?1024*(n-55296)+r-56320+65536:n}function Qk(e){return/^\n* /.test(e)}function Xk(e,t,r,n,a){e.dump=function(){if(0===t.length)return 2===e.quotingType?'""':"''";if(!e.noCompatMode&&(-1!==Uk.indexOf(t)||Bk.test(t)))return 2===e.quotingType?'"'+t+'"':"'"+t+"'";var o=e.indent*Math.max(1,r),i=-1===e.lineWidth?-1:Math.max(Math.min(e.lineWidth,40),e.lineWidth-o),s=n||e.flowLevel>-1&&r>=e.flowLevel;switch(function(e,t,r,n,a,o,i,s){var l,c,p,d=0,u=null,h=!1,f=!1,m=-1!==n,y=-1,g=Kk(c=Zk(e,0))&&65279!==c&&!Gk(c)&&45!==c&&63!==c&&58!==c&&44!==c&&91!==c&&93!==c&&123!==c&&125!==c&&35!==c&&38!==c&&42!==c&&33!==c&&124!==c&&61!==c&&62!==c&&39!==c&&34!==c&&37!==c&&64!==c&&96!==c&&!Gk(p=Zk(e,e.length-1))&&58!==p;if(t||i)for(l=0;l<e.length;d>=65536?l+=2:l++){if(!Kk(d=Zk(e,l)))return 5;g=g&&Yk(d,u,s),u=d}else{for(l=0;l<e.length;d>=65536?l+=2:l++){if(10===(d=Zk(e,l)))h=!0,m&&(f=f||l-y-1>n&&" "!==e[y+1],y=l);else if(!Kk(d))return 5;g=g&&Yk(d,u,s),u=d}f=f||m&&l-y-1>n&&" "!==e[y+1]}return h||f?r>9&&Qk(e)?5:i?2===o?5:2:f?4:3:!g||i||a(e)?2===o?5:2:1}(t,s,e.indent,i,(function(t){return function(e,t){var r,n;for(r=0,n=e.implicitTypes.length;r<n;r+=1)if(e.implicitTypes[r].resolve(t))return!0;return!1}(e,t)}),e.quotingType,e.forceQuotes&&!n,a)){case 1:return t;case 2:return"'"+t.replace(/'/g,"''")+"'";case 3:return"|"+eS(t,e.indent)+tS(Wk(t,o));case 4:return">"+eS(t,e.indent)+tS(Wk(function(e,t){for(var r,n,a,o=/(\n+)([^\n]*)/g,i=(a=-1!==(a=e.indexOf("\n"))?a:e.length,o.lastIndex=a,rS(e.slice(0,a),t)),s="\n"===e[0]||" "===e[0];n=o.exec(e);){var l=n[1],c=n[2];r=" "===c[0],i+=l+(s||r||""===c?"":"\n")+rS(c,t),s=r}return i}(t,i),o));case 5:return'"'+function(e){for(var t,r="",n=0,a=0;a<e.length;n>=65536?a+=2:a++)n=Zk(e,a),!(t=zk[n])&&Kk(n)?(r+=e[a],n>=65536&&(r+=e[a+1])):r+=t||Mk(n);return r}(t)+'"';default:throw new b$("impossible error: invalid scalar style")}}()}function eS(e,t){var r=Qk(e)?String(t):"",n="\n"===e[e.length-1];return r+(!n||"\n"!==e[e.length-2]&&"\n"!==e?n?"":"-":"+")+"\n"}function tS(e){return"\n"===e[e.length-1]?e.slice(0,-1):e}function rS(e,t){if(""===e||" "===e[0])return e;for(var r,n,a=/ [^ ]/g,o=0,i=0,s=0,l="";r=a.exec(e);)(s=r.index)-o>t&&(n=i>o?i:s,l+="\n"+e.slice(o,n),o=n+1),i=s;return l+="\n",e.length-o>t&&i>o?l+=e.slice(o,i)+"\n"+e.slice(i+1):l+=e.slice(o),l.slice(1)}function nS(e,t,r,n){var a,o,i,s="",l=e.tag;for(a=0,o=r.length;a<o;a+=1)i=r[a],e.replacer&&(i=e.replacer.call(r,String(a),i)),(oS(e,t+1,i,!0,!0,!1,!0)||void 0===i&&oS(e,t+1,null,!0,!0,!1,!0))&&(n&&""===s||(s+=Vk(e,t)),e.dump&&10===e.dump.charCodeAt(0)?s+="-":s+="- ",s+=e.dump);e.tag=l,e.dump=s||"[]"}function aS(e,t,r){var n,a,o,i,s,l;for(o=0,i=(a=r?e.explicitTypes:e.implicitTypes).length;o<i;o+=1)if(((s=a[o]).instanceOf||s.predicate)&&(!s.instanceOf||"object"==typeof t&&t instanceof s.instanceOf)&&(!s.predicate||s.predicate(t))){if(r?s.multi&&s.representName?e.tag=s.representName(t):e.tag=s.tag:e.tag="?",s.represent){if(l=e.styleMap[s.tag]||s.defaultStyle,"[object Function]"===Nk.call(s.represent))n=s.represent(t,l);else{if(!qk.call(s.represent,l))throw new b$("!<"+s.tag+'> tag resolver accepts not "'+l+'" style');n=s.represent[l](t,l)}e.dump=n}return!0}return!1}function oS(e,t,r,n,a,o,i){e.tag=null,e.dump=r,aS(e,r,!1)||aS(e,r,!0);var s,l=Nk.call(e.dump),c=n;n&&(n=e.flowLevel<0||e.flowLevel>t);var p,d,u="[object Object]"===l||"[object Array]"===l;if(u&&(d=-1!==(p=e.duplicates.indexOf(r))),(null!==e.tag&&"?"!==e.tag||d||2!==e.indent&&t>0)&&(a=!1),d&&e.usedDuplicates[p])e.dump="*ref_"+p;else{if(u&&d&&!e.usedDuplicates[p]&&(e.usedDuplicates[p]=!0),"[object Object]"===l)n&&0!==Object.keys(e.dump).length?(function(e,t,r,n){var a,o,i,s,l,c,p="",d=e.tag,u=Object.keys(r);if(!0===e.sortKeys)u.sort();else if("function"==typeof e.sortKeys)u.sort(e.sortKeys);else if(e.sortKeys)throw new b$("sortKeys must be a boolean or a function");for(a=0,o=u.length;a<o;a+=1)c="",n&&""===p||(c+=Vk(e,t)),s=r[i=u[a]],e.replacer&&(s=e.replacer.call(r,i,s)),oS(e,t+1,i,!0,!0,!0)&&((l=null!==e.tag&&"?"!==e.tag||e.dump&&e.dump.length>1024)&&(e.dump&&10===e.dump.charCodeAt(0)?c+="?":c+="? "),c+=e.dump,l&&(c+=Vk(e,t)),oS(e,t+1,s,!0,l)&&(e.dump&&10===e.dump.charCodeAt(0)?c+=":":c+=": ",p+=c+=e.dump));e.tag=d,e.dump=p||"{}"}(e,t,e.dump,a),d&&(e.dump="&ref_"+p+e.dump)):(function(e,t,r){var n,a,o,i,s,l="",c=e.tag,p=Object.keys(r);for(n=0,a=p.length;n<a;n+=1)s="",""!==l&&(s+=", "),e.condenseFlow&&(s+='"'),i=r[o=p[n]],e.replacer&&(i=e.replacer.call(r,o,i)),oS(e,t,o,!1,!1)&&(e.dump.length>1024&&(s+="? "),s+=e.dump+(e.condenseFlow?'"':"")+":"+(e.condenseFlow?"":" "),oS(e,t,i,!1,!1)&&(l+=s+=e.dump));e.tag=c,e.dump="{"+l+"}"}(e,t,e.dump),d&&(e.dump="&ref_"+p+" "+e.dump));else if("[object Array]"===l)n&&0!==e.dump.length?(e.noArrayIndent&&!i&&t>0?nS(e,t-1,e.dump,a):nS(e,t,e.dump,a),d&&(e.dump="&ref_"+p+e.dump)):(function(e,t,r){var n,a,o,i="",s=e.tag;for(n=0,a=r.length;n<a;n+=1)o=r[n],e.replacer&&(o=e.replacer.call(r,String(n),o)),(oS(e,t,o,!1,!1)||void 0===o&&oS(e,t,null,!1,!1))&&(""!==i&&(i+=","+(e.condenseFlow?"":" ")),i+=e.dump);e.tag=s,e.dump="["+i+"]"}(e,t,e.dump),d&&(e.dump="&ref_"+p+" "+e.dump));else{if("[object String]"!==l){if("[object Undefined]"===l)return!1;if(e.skipInvalid)return!1;throw new b$("unacceptable kind of an object to dump "+l)}"?"!==e.tag&&Xk(e,e.dump,t,o,c)}null!==e.tag&&"?"!==e.tag&&(s=encodeURI("!"===e.tag[0]?e.tag.slice(1):e.tag).replace(/!/g,"%21"),s="!"===e.tag[0]?"!"+s:"tag:yaml.org,2002:"===s.slice(0,18)?"!!"+s.slice(18):"!<"+s+">",e.dump=s+" "+e.dump)}return!0}function iS(e,t){var r,n,a=[],o=[];for(sS(e,a,o),r=0,n=o.length;r<n;r+=1)t.duplicates.push(a[o[r]]);t.usedDuplicates=new Array(n)}function sS(e,t,r){var n,a,o;if(null!==e&&"object"==typeof e)if(-1!==(a=t.indexOf(e)))-1===r.indexOf(a)&&r.push(a);else if(t.push(e),Array.isArray(e))for(a=0,o=e.length;a<o;a+=1)sS(e[a],t,r);else for(a=0,o=(n=Object.keys(e)).length;a<o;a+=1)sS(e[n[a]],t,r)}function lS(e,t){return function(){throw new Error("Function yaml."+e+" is removed in js-yaml 4. Use yaml."+t+" instead, which is now safe by default.")}}var cS={Type:S$,Schema:E$,FAILSAFE_SCHEMA:_$,JSON_SCHEMA:z$,CORE_SCHEMA:U$,DEFAULT_SCHEMA:tk,load:Fk.load,loadAll:Fk.loadAll,dump:function(e,t){var r=new Hk(t=t||{});r.noRefs||iS(e,r);var n=e;return r.replacer&&(n=r.replacer.call({"":n},"",n)),oS(r,0,n,!0,!0)?r.dump+"\n":""},YAMLException:b$,types:{binary:G$,float:q$,map:j$,null:P$,pairs:Q$,set:ek,timestamp:H$,bool:I$,int:D$,merge:W$,omap:Y$,seq:C$,str:T$},safeLoad:lS("safeLoad","load"),safeLoadAll:lS("safeLoadAll","loadAll"),safeDump:lS("safeDump","dump")};const pS="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:window,{FormData:dS,Blob:uS,File:hS}=pS;function fS(e){return function(e){if(kh(e))return Ef(e)}(e)||function(e){if(void 0!==th&&null!=wh(e)||null!=e["@@iterator"])return Of(e)}(e)||Tf(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}const mS=ut({exports:{}}.exports=Mh);var yS=function(e){return":/?#[]@!$&'()*+,;=".indexOf(e)>-1},gS=function(e){return/^[a-z0-9\-._~]+$/i.test(e)};function vS(e){var t,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=r.escape,a=arguments.length>2?arguments[2]:void 0;return"number"==typeof e&&(e=e.toString()),"string"==typeof e&&e.length&&n?a?JSON.parse(e):Tb(t=fS(e)).call(t,(function(e){var t,r;if(gS(e))return e;if(yS(e)&&"unsafe"===n)return e;var a=new TextEncoder;return Tb(t=Tb(r=rb(a.encode(e))).call(r,(function(e){var t;return mS(t="0".concat(e.toString(16).toUpperCase())).call(t,-2)}))).call(t,(function(e){return"%".concat(e)})).join("")})).join(""):e}function bS(e){var t=e.value;return Array.isArray(t)?function(e){var t=e.key,r=e.value,n=e.style,a=e.explode,o=e.escape,i=function(e){return vS(e,{escape:o})};if("simple"===n)return Tb(r).call(r,(function(e){return i(e)})).join(",");if("label"===n)return".".concat(Tb(r).call(r,(function(e){return i(e)})).join("."));if("matrix"===n)return Tb(r).call(r,(function(e){return i(e)})).reduce((function(e,r){var n,o,i;return!e||a?Rb(o=Rb(i="".concat(e||"",";")).call(i,t,"=")).call(o,r):Rb(n="".concat(e,",")).call(n,r)}),"");if("form"===n){var s=a?"&".concat(t,"="):",";return Tb(r).call(r,(function(e){return i(e)})).join(s)}if("spaceDelimited"===n){var l=a?"".concat(t,"="):"";return Tb(r).call(r,(function(e){return i(e)})).join(" ".concat(l))}if("pipeDelimited"===n){var c=a?"".concat(t,"="):"";return Tb(r).call(r,(function(e){return i(e)})).join("|".concat(c))}}(e):"object"===Pf(t)?function(e){var t=e.key,r=e.value,n=e.style,a=e.explode,o=e.escape,i=function(e){return vS(e,{escape:o})},s=Cb(r);return"simple"===n?s.reduce((function(e,t){var n,o,s,l=i(r[t]),c=a?"=":",",p=e?"".concat(e,","):"";return Rb(n=Rb(o=Rb(s="".concat(p)).call(s,t)).call(o,c)).call(n,l)}),""):"label"===n?s.reduce((function(e,t){var n,o,s,l=i(r[t]),c=a?"=":".",p=e?"".concat(e,"."):".";return Rb(n=Rb(o=Rb(s="".concat(p)).call(s,t)).call(o,c)).call(n,l)}),""):"matrix"===n&&a?s.reduce((function(e,t){var n,a,o=i(r[t]),s=e?"".concat(e,";"):";";return Rb(n=Rb(a="".concat(s)).call(a,t,"=")).call(n,o)}),""):"matrix"===n?s.reduce((function(e,n){var a,o,s=i(r[n]),l=e?"".concat(e,","):";".concat(t,"=");return Rb(a=Rb(o="".concat(l)).call(o,n,",")).call(a,s)}),""):"form"===n?s.reduce((function(e,t){var n,o,s,l,c=i(r[t]),p=e?Rb(n="".concat(e)).call(n,a?"&":","):"",d=a?"=":",";return Rb(o=Rb(s=Rb(l="".concat(p)).call(l,t)).call(s,d)).call(o,c)}),""):void 0}(e):function(e){var t,r=e.key,n=e.value,a=e.style,o=e.escape,i=function(e){return vS(e,{escape:o})};return"simple"===a?i(n):"label"===a?".".concat(i(n)):"matrix"===a?Rb(t=";".concat(r,"=")).call(t,i(n)):"form"===a||"deepObject"===a?i(n):void 0}(e)}var xS=function(e,t){t.body=e},wS={serializeRes:OS,mergeInQueryOrForm:FS};function $S(e){return kS.apply(this,arguments)}function kS(){return kS=jv(Pv.mark((function e(t){var r,n,a,o,i,s=arguments;return Pv.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r=s.length>1&&void 0!==s[1]?s[1]:{},"object"===Pf(t)&&(t=(r=t).url),r.headers=r.headers||{},wS.mergeInQueryOrForm(r),r.headers&&Cb(r.headers).forEach((function(e){var t=r.headers[e];"string"==typeof t&&(r.headers[e]=t.replace(/\n+/g," "))})),!r.requestInterceptor){e.next=12;break}return e.next=8,r.requestInterceptor(r);case 8:if(e.t0=e.sent,e.t0){e.next=11;break}e.t0=r;case 11:r=e.t0;case 12:return n=r.headers["content-type"]||r.headers["Content-Type"],/multipart\/form-data/i.test(n)&&r.body instanceof dS&&(delete r.headers["content-type"],delete r.headers["Content-Type"]),e.prev=14,e.next=17,(r.userFetch||fetch)(r.url,r);case 17:return a=e.sent,e.next=20,wS.serializeRes(a,t,r);case 20:if(a=e.sent,!r.responseInterceptor){e.next=28;break}return e.next=24,r.responseInterceptor(a);case 24:if(e.t1=e.sent,e.t1){e.next=27;break}e.t1=a;case 27:a=e.t1;case 28:e.next=39;break;case 30:if(e.prev=30,e.t2=e.catch(14),a){e.next=34;break}throw e.t2;case 34:throw(o=new Error(a.statusText||"response status is ".concat(a.status))).status=a.status,o.statusCode=a.status,o.responseError=e.t2,o;case 39:if(a.ok){e.next=45;break}throw(i=new Error(a.statusText||"response status is ".concat(a.status))).status=a.status,i.statusCode=a.status,i.response=a,i;case 45:return e.abrupt("return",a);case 46:case"end":return e.stop()}}),e,null,[[14,30]])}))),kS.apply(this,arguments)}var SS=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return/(json|xml|yaml|text)\b/.test(e)};function AS(e,t){return t&&(0===t.indexOf("application/json")||t.indexOf("+json")>0)?JSON.parse(e):cS.load(e)}function OS(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=r.loadSpec,a=void 0!==n&&n,o={ok:e.ok,url:e.url||t,status:e.status,statusText:e.statusText,headers:TS(e.headers)},i=o.headers["content-type"],s=a||SS(i),l=s?e.text:e.blob||e.buffer;return l.call(e).then((function(e){if(o.text=e,o.data=e,s)try{var t=AS(e,i);o.body=t,o.obj=t}catch(e){o.parseError=e}return o}))}function ES(e){return Gv(e).call(e,", ")?e.split(", "):e}function TS(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return"function"!=typeof tb(e)?{}:rb(tb(e).call(e)).reduce((function(e,t){var r=If(t,2),n=r[0],a=r[1];return e[n]=ES(a),e}),{})}function CS(e,t){return t||"undefined"==typeof navigator||(t=navigator),t&&"ReactNative"===t.product?!(!e||"object"!==Pf(e)||"string"!=typeof e.uri):void 0!==hS&&e instanceof hS||void 0!==uS&&e instanceof uS||!!ArrayBuffer.isView(e)||null!==e&&"object"===Pf(e)&&"function"==typeof e.pipe}function jS(e,t){return Array.isArray(e)&&e.some((function(e){return CS(e,t)}))}var _S={form:",",spaceDelimited:"%20",pipeDelimited:"|"},PS={csv:",",ssv:"%20",tsv:"%09",pipes:"|"};function IS(e,t){var r=arguments.length>2&&void 0!==arguments[2]&&arguments[2],n=t.collectionFormat,a=t.allowEmptyValue,o=t.serializationOption,i=t.encoding,s="object"!==Pf(t)||Array.isArray(t)?t:t.value,l=r?function(e){return e.toString()}:function(e){return encodeURIComponent(e)},c=l(e);if(void 0===s&&a)return[[c,""]];if(CS(s)||jS(s))return[[c,s]];if(o)return RS(e,s,r,o);if(i){if([Pf(i.style),Pf(i.explode),Pf(i.allowReserved)].some((function(e){return"undefined"!==e}))){var p=i.style,d=i.explode,u=i.allowReserved;return RS(e,s,r,{style:p,explode:d,allowReserved:u})}if(i.contentType){if("application/json"===i.contentType){var h="string"==typeof s?s:$b(s);return[[c,l(h)]]}return[[c,l(s.toString())]]}return"object"!==Pf(s)?[[c,l(s)]]:Array.isArray(s)&&s.every((function(e){return"object"!==Pf(e)}))?[[c,Tb(s).call(s,l).join(",")]]:[[c,l($b(s))]]}return"object"!==Pf(s)?[[c,l(s)]]:Array.isArray(s)?"multi"===n?[[c,Tb(s).call(s,l)]]:[[c,Tb(s).call(s,l).join(PS[n||"csv"])]]:[[c,""]]}function RS(e,t,r,n){var a,o,i,s=n.style||"form",l=void 0===n.explode?"form"===s:n.explode,c=!r&&(n&&n.allowReserved?"unsafe":"reserved"),p=function(e){return vS(e,{escape:c})},d=r?function(e){return e}:function(e){return vS(e,{escape:c})};return"object"!==Pf(t)?[[d(e),p(t)]]:Array.isArray(t)?l?[[d(e),Tb(t).call(t,p)]]:[[d(e),Tb(t).call(t,p).join(_S[s])]]:"deepObject"===s?Tb(o=Cb(t)).call(o,(function(r){var n;return[d(Rb(n="".concat(e,"[")).call(n,r,"]")),p(t[r])]})):l?Tb(i=Cb(t)).call(i,(function(e){return[d(e),p(t[e])]})):[[d(e),Tb(a=Cb(t)).call(a,(function(e){var r;return[Rb(r="".concat(d(e),",")).call(r,p(t[e]))]})).join(",")]]}function LS(e){return Hb(e).reduce((function(e,t){var r,n=If(t,2),a=Cf(IS(n[0],n[1],!0));try{for(a.s();!(r=a.n()).done;){var o=If(r.value,2),i=o[0],s=o[1];if(Array.isArray(s)){var l,c=Cf(s);try{for(c.s();!(l=c.n()).done;){var p=l.value;if(ArrayBuffer.isView(p)){var d=new uS([p]);e.append(i,d)}else e.append(i,p)}}catch(e){c.e(e)}finally{c.f()}}else if(ArrayBuffer.isView(s)){var u=new uS([s]);e.append(i,u)}else e.append(i,s)}}catch(e){a.e(e)}finally{a.f()}return e}),new dS)}function DS(e){var t=Cb(e).reduce((function(t,r){var n,a=Cf(IS(r,e[r]));try{for(a.s();!(n=a.n()).done;){var o=If(n.value,2),i=o[0],s=o[1];t[i]=s}}catch(e){a.e(e)}finally{a.f()}return t}),{});return f$(t,{encode:!1,indices:!1})||""}function FS(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.url,r=void 0===t?"":t,n=e.query,a=e.form,o=function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var n=Wb(t).call(t,(function(e){return e})).join("&");return n?"?".concat(n):""};if(a){var i=Cb(a).some((function(e){var t=a[e].value;return CS(t)||jS(t)})),s=e.headers["content-type"]||e.headers["Content-Type"];if(i||/multipart\/form-data/i.test(s)){var l=LS(e.form);xS(l,e)}else e.body=DS(a);delete e.form}if(n){var c=r.split("?"),p=If(c,2),d=p[0],u=p[1],h="";if(u){var f=h$(u),m=Cb(n);m.forEach((function(e){return delete f[e]})),h=f$(f,{encode:!0})}var y=o(h,DS(n));e.url=d+y,delete e.query}return e}function NS(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function qS(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Ad(e,n.key,n)}}function zS(e,t,r){return t&&qS(e.prototype,t),r&&qS(e,r),Ad(e,"prototype",{writable:!1}),e}var US=Ta,BS=Ls.find,MS=!0;"find"in[]&&Array(1).find((function(){MS=!1})),US({target:"Array",proto:!0,forced:MS},{find:function(e){return BS(this,e,arguments.length>1?arguments[1]:void 0)}});var HS=sc("Array").find,WS=pr,VS=HS,GS=Array.prototype;const KS=ut({exports:{}}.exports=function(e){var t=e.find;return e===GS||WS(GS,e)&&t===GS.find?VS:t});const JS=ut({exports:{}}.exports=Sv);var YS=Ta,ZS=ft,QS=La,XS=_a,eA=za,tA=Kr,rA=Es,nA=ti,aA=ac("splice"),oA=ZS.TypeError,iA=Math.max,sA=Math.min;YS({target:"Array",proto:!0,forced:!aA},{splice:function(e,t){var r,n,a,o,i,s,l=tA(this),c=eA(l),p=QS(e,c),d=arguments.length;if(0===d?r=n=0:1===d?(r=0,n=c-p):(r=d-2,n=sA(iA(XS(t),0),c-p)),c+r-n>9007199254740991)throw oA("Maximum allowed length exceeded");for(a=rA(l,n),o=0;o<n;o++)(i=p+o)in l&&nA(a,o,l[i]);if(a.length=n,r<n){for(o=p;o<c-n;o++)s=o+r,(i=o+n)in l?l[s]=l[i]:delete l[s];for(o=c;o>c-n+r;o--)delete l[o-1]}else if(r>n)for(o=c-n;o>p;o--)s=o+r-1,(i=o+n-1)in l?l[s]=l[i]:delete l[s];for(o=0;o<r;o++)l[o+p]=arguments[o+2];return l.length=c-n+r,a}});var lA=sc("Array").splice,cA=pr,pA=lA,dA=Array.prototype;const uA=ut({exports:{}}.exports=function(e){var t=e.splice;return e===dA||cA(dA,e)&&t===dA.splice?pA:t});var hA,fA=globalThis&&globalThis.__extends||(hA=function(e,t){return hA=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])},hA(e,t)},function(e,t){function r(){this.constructor=e}hA(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),mA=Object.prototype.hasOwnProperty;function yA(e,t){return mA.call(e,t)}function gA(e){if(Array.isArray(e)){for(var t=new Array(e.length),r=0;r<t.length;r++)t[r]=""+r;return t}if(Object.keys)return Object.keys(e);for(var n in t=[],e)yA(e,n)&&t.push(n);return t}function vA(e){switch(typeof e){case"object":return JSON.parse(JSON.stringify(e));case"undefined":return null;default:return e}}function bA(e){for(var t,r=0,n=e.length;r<n;){if(!((t=e.charCodeAt(r))>=48&&t<=57))return!1;r++}return!0}function xA(e){return-1===e.indexOf("/")&&-1===e.indexOf("~")?e:e.replace(/~/g,"~0").replace(/\//g,"~1")}function wA(e){return e.replace(/~1/g,"/").replace(/~0/g,"~")}function $A(e){if(void 0===e)return!0;if(e)if(Array.isArray(e)){for(var t=0,r=e.length;t<r;t++)if($A(e[t]))return!0}else if("object"==typeof e){var n=gA(e),a=n.length;for(t=0;t<a;t++)if($A(e[n[t]]))return!0}return!1}function kA(e,t){var r=[e];for(var n in t){var a="object"==typeof t[n]?JSON.stringify(t[n],null,2):t[n];void 0!==a&&r.push(n+": "+a)}return r.join("\n")}var SA=function(e){function t(t,r,n,a,o){var i=this.constructor,s=e.call(this,kA(t,{name:r,index:n,operation:a,tree:o}))||this;return s.name=r,s.index=n,s.operation=a,s.tree=o,Object.setPrototypeOf(s,i.prototype),s.message=kA(t,{name:r,index:n,operation:a,tree:o}),s}return fA(t,e),t}(Error),AA=SA,OA=vA,EA={add:function(e,t,r){return e[t]=this.value,{newDocument:r}},remove:function(e,t,r){var n=e[t];return delete e[t],{newDocument:r,removed:n}},replace:function(e,t,r){var n=e[t];return e[t]=this.value,{newDocument:r,removed:n}},move:function(e,t,r){var n=CA(r,this.path);n&&(n=vA(n));var a=jA(r,{op:"remove",path:this.from}).removed;return jA(r,{op:"add",path:this.path,value:a}),{newDocument:r,removed:n}},copy:function(e,t,r){var n=CA(r,this.from);return jA(r,{op:"add",path:this.path,value:vA(n)}),{newDocument:r}},test:function(e,t,r){return{newDocument:r,test:RA(e[t],this.value)}},_get:function(e,t,r){return this.value=e[t],{newDocument:r}}},TA={add:function(e,t,r){return bA(t)?e.splice(t,0,this.value):e[t]=this.value,{newDocument:r,index:t}},remove:function(e,t,r){return{newDocument:r,removed:e.splice(t,1)[0]}},replace:function(e,t,r){var n=e[t];return e[t]=this.value,{newDocument:r,removed:n}},move:EA.move,copy:EA.copy,test:EA.test,_get:EA._get};function CA(e,t){if(""==t)return e;var r={op:"_get",path:t};return jA(e,r),r.value}function jA(e,t,r,n,a,o){if(void 0===r&&(r=!1),void 0===n&&(n=!0),void 0===a&&(a=!0),void 0===o&&(o=0),r&&("function"==typeof r?r(t,0,e,t.path):PA(t,0)),""===t.path){var i={newDocument:e};if("add"===t.op)return i.newDocument=t.value,i;if("replace"===t.op)return i.newDocument=t.value,i.removed=e,i;if("move"===t.op||"copy"===t.op)return i.newDocument=CA(e,t.from),"move"===t.op&&(i.removed=e),i;if("test"===t.op){if(i.test=RA(e,t.value),!1===i.test)throw new AA("Test operation failed","TEST_OPERATION_FAILED",o,t,e);return i.newDocument=e,i}if("remove"===t.op)return i.removed=e,i.newDocument=null,i;if("_get"===t.op)return t.value=e,i;if(r)throw new AA("Operation `op` property is not one of operations defined in RFC-6902","OPERATION_OP_INVALID",o,t,e);return i}n||(e=vA(e));var s=(t.path||"").split("/"),l=e,c=1,p=s.length,d=void 0,u=void 0,h=void 0;for(h="function"==typeof r?r:PA;;){if((u=s[c])&&-1!=u.indexOf("~")&&(u=wA(u)),a&&"__proto__"==u)throw new TypeError("JSON-Patch: modifying `__proto__` prop is banned for security reasons, if this was on purpose, please set `banPrototypeModifications` flag false and pass it to this function. More info in fast-json-patch README");if(r&&void 0===d&&(void 0===l[u]?d=s.slice(0,c).join("/"):c==p-1&&(d=t.path),void 0!==d&&h(t,0,e,d)),c++,Array.isArray(l)){if("-"===u)u=l.length;else{if(r&&!bA(u))throw new AA("Expected an unsigned base-10 integer value, making the new referenced value the array element with the zero-based index","OPERATION_PATH_ILLEGAL_ARRAY_INDEX",o,t,e);bA(u)&&(u=~~u)}if(c>=p){if(r&&"add"===t.op&&u>l.length)throw new AA("The specified index MUST NOT be greater than the number of elements in the array","OPERATION_VALUE_OUT_OF_BOUNDS",o,t,e);if(!1===(i=TA[t.op].call(t,l,u,e)).test)throw new AA("Test operation failed","TEST_OPERATION_FAILED",o,t,e);return i}}else if(c>=p){if(!1===(i=EA[t.op].call(t,l,u,e)).test)throw new AA("Test operation failed","TEST_OPERATION_FAILED",o,t,e);return i}if(l=l[u],r&&c<p&&(!l||"object"!=typeof l))throw new AA("Cannot perform operation at the desired path","OPERATION_PATH_UNRESOLVABLE",o,t,e)}}function _A(e,t,r,n,a){if(void 0===n&&(n=!0),void 0===a&&(a=!0),r&&!Array.isArray(t))throw new AA("Patch sequence must be an array","SEQUENCE_NOT_AN_ARRAY");n||(e=vA(e));for(var o=new Array(t.length),i=0,s=t.length;i<s;i++)o[i]=jA(e,t[i],r,!0,a,i),e=o[i].newDocument;return o.newDocument=e,o}function PA(e,t,r,n){if("object"!=typeof e||null===e||Array.isArray(e))throw new AA("Operation is not an object","OPERATION_NOT_AN_OBJECT",t,e,r);if(!EA[e.op])throw new AA("Operation `op` property is not one of operations defined in RFC-6902","OPERATION_OP_INVALID",t,e,r);if("string"!=typeof e.path)throw new AA("Operation `path` property is not a string","OPERATION_PATH_INVALID",t,e,r);if(0!==e.path.indexOf("/")&&e.path.length>0)throw new AA('Operation `path` property must start with "/"',"OPERATION_PATH_INVALID",t,e,r);if(("move"===e.op||"copy"===e.op)&&"string"!=typeof e.from)throw new AA("Operation `from` property is not present (applicable in `move` and `copy` operations)","OPERATION_FROM_REQUIRED",t,e,r);if(("add"===e.op||"replace"===e.op||"test"===e.op)&&void 0===e.value)throw new AA("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)","OPERATION_VALUE_REQUIRED",t,e,r);if(("add"===e.op||"replace"===e.op||"test"===e.op)&&$A(e.value))throw new AA("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)","OPERATION_VALUE_CANNOT_CONTAIN_UNDEFINED",t,e,r);if(r)if("add"==e.op){var a=e.path.split("/").length,o=n.split("/").length;if(a!==o+1&&a!==o)throw new AA("Cannot perform an `add` operation at the desired path","OPERATION_PATH_CANNOT_ADD",t,e,r)}else if("replace"===e.op||"remove"===e.op||"_get"===e.op){if(e.path!==n)throw new AA("Cannot perform the operation at a path that does not exist","OPERATION_PATH_UNRESOLVABLE",t,e,r)}else if("move"===e.op||"copy"===e.op){var i=IA([{op:"_get",path:e.from,value:void 0}],r);if(i&&"OPERATION_PATH_UNRESOLVABLE"===i.name)throw new AA("Cannot perform the operation from a path that does not exist","OPERATION_FROM_UNRESOLVABLE",t,e,r)}}function IA(e,t,r){try{if(!Array.isArray(e))throw new AA("Patch sequence must be an array","SEQUENCE_NOT_AN_ARRAY");if(t)_A(vA(t),vA(e),r||!0);else{r=r||PA;for(var n=0;n<e.length;n++)r(e[n],n,t,void 0)}}catch(e){if(e instanceof AA)return e;throw e}}function RA(e,t){if(e===t)return!0;if(e&&t&&"object"==typeof e&&"object"==typeof t){var r,n,a,o=Array.isArray(e),i=Array.isArray(t);if(o&&i){if((n=e.length)!=t.length)return!1;for(r=n;0!=r--;)if(!RA(e[r],t[r]))return!1;return!0}if(o!=i)return!1;var s=Object.keys(e);if((n=s.length)!==Object.keys(t).length)return!1;for(r=n;0!=r--;)if(!t.hasOwnProperty(s[r]))return!1;for(r=n;0!=r--;)if(!RA(e[a=s[r]],t[a]))return!1;return!0}return e!=e&&t!=t}const LA=Object.freeze(Object.defineProperty({__proto__:null,JsonPatchError:AA,deepClone:OA,getValueByPointer:CA,applyOperation:jA,applyPatch:_A,applyReducer:function(e,t,r){var n=jA(e,t);if(!1===n.test)throw new AA("Test operation failed","TEST_OPERATION_FAILED",r,t,e);return n.newDocument},validator:PA,validate:IA,_areEquals:RA},Symbol.toStringTag,{value:"Module"}));var DA=new WeakMap,FA=function(e){this.observers=new Map,this.obj=e},NA=function(e,t){this.callback=e,this.observer=t};function qA(e,t){void 0===t&&(t=!1);var r=DA.get(e.object);zA(r.value,e.object,e.patches,"",t),e.patches.length&&_A(r.value,e.patches);var n=e.patches;return n.length>0&&(e.patches=[],e.callback&&e.callback(n)),n}function zA(e,t,r,n,a){if(t!==e){"function"==typeof t.toJSON&&(t=t.toJSON());for(var o=gA(t),i=gA(e),s=!1,l=i.length-1;l>=0;l--){var c=e[d=i[l]];if(!yA(t,d)||void 0===t[d]&&void 0!==c&&!1===Array.isArray(t))Array.isArray(e)===Array.isArray(t)?(a&&r.push({op:"test",path:n+"/"+xA(d),value:vA(c)}),r.push({op:"remove",path:n+"/"+xA(d)}),s=!0):(a&&r.push({op:"test",path:n,value:e}),r.push({op:"replace",path:n,value:t}));else{var p=t[d];"object"==typeof c&&null!=c&&"object"==typeof p&&null!=p&&Array.isArray(c)===Array.isArray(p)?zA(c,p,r,n+"/"+xA(d),a):c!==p&&(a&&r.push({op:"test",path:n+"/"+xA(d),value:vA(c)}),r.push({op:"replace",path:n+"/"+xA(d),value:vA(p)}))}}if(s||o.length!=i.length)for(l=0;l<o.length;l++){var d;yA(e,d=o[l])||void 0===t[d]||r.push({op:"add",path:n+"/"+xA(d),value:vA(t[d])})}}}const UA=Object.freeze(Object.defineProperty({__proto__:null,unobserve:function(e,t){t.unobserve()},observe:function(e,t){var r,n,a=(n=e,DA.get(n));if(a){var o=function(e,t){return e.observers.get(t)}(a,t);r=o&&o.observer}else a=new FA(e),DA.set(e,a);if(r)return r;if(r={},a.value=vA(e),t){r.callback=t,r.next=null;var i=function(){qA(r)},s=function(){clearTimeout(r.next),r.next=setTimeout(i)};"undefined"!=typeof window&&(window.addEventListener("mouseup",s),window.addEventListener("keyup",s),window.addEventListener("mousedown",s),window.addEventListener("keydown",s),window.addEventListener("change",s))}return r.patches=[],r.object=e,r.unobserve=function(){qA(r),clearTimeout(r.next),function(e,t){e.observers.delete(t.callback)}(a,r),"undefined"!=typeof window&&(window.removeEventListener("mouseup",s),window.removeEventListener("keyup",s),window.removeEventListener("mousedown",s),window.removeEventListener("keydown",s),window.removeEventListener("change",s))},a.observers.set(t,new NA(t,r)),r},generate:qA,compare:function(e,t,r){void 0===r&&(r=!1);var n=[];return zA(e,t,n,"",r),n}},Symbol.toStringTag,{value:"Module"}));Object.assign({},LA,UA,{JsonPatchError:SA,deepClone:vA,escapePathComponent:xA,unescapePathComponent:wA});var BA=function(e){return!(t=e,!t||"object"!=typeof t||function(e){var t=Object.prototype.toString.call(e);return"[object RegExp]"===t||"[object Date]"===t||e.$$typeof===MA}(e));var t},MA="function"==typeof Symbol&&Symbol.for?Symbol.for("react.element"):60103;function HA(e,t){return!1!==t.clone&&t.isMergeableObject(e)?KA((r=e,Array.isArray(r)?[]:{}),e,t):e;var r}function WA(e,t,r){return e.concat(t).map((function(e){return HA(e,r)}))}function VA(e){return Object.keys(e).concat((t=e,Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(t).filter((function(e){return t.propertyIsEnumerable(e)})):[]));var t}function GA(e,t){try{return t in e}catch(e){return!1}}function KA(e,t,r){(r=r||{}).arrayMerge=r.arrayMerge||WA,r.isMergeableObject=r.isMergeableObject||BA,r.cloneUnlessOtherwiseSpecified=HA;var n=Array.isArray(t);return n===Array.isArray(e)?n?r.arrayMerge(e,t,r):function(e,t,r){var n={};return r.isMergeableObject(e)&&VA(e).forEach((function(t){n[t]=HA(e[t],r)})),VA(t).forEach((function(a){var o,i;GA(o=e,i=a)&&(!Object.hasOwnProperty.call(o,i)||!Object.propertyIsEnumerable.call(o,i))||(GA(e,a)&&r.isMergeableObject(t[a])?n[a]=function(e,t){if(!t.customMerge)return KA;var r=t.customMerge(e);return"function"==typeof r?r:KA}(a,r)(e[a],t[a],r):n[a]=HA(t[a],r))})),n}(e,t,r):HA(t,r)}KA.all=function(e,t){if(!Array.isArray(e))throw new Error("first argument should be an array");return e.reduce((function(e,r){return KA(e,r,t)}),{})};var JA=KA;const YA={add:function(e,t){return{op:"add",path:e,value:t}},replace:QA,remove:function(e){return{op:"remove",path:e}},merge:function(e,t){return{type:"mutation",op:"merge",path:e,value:t}},mergeDeep:function(e,t){return{type:"mutation",op:"mergeDeep",path:e,value:t}},context:function(e,t){return{type:"context",path:e,value:t}},getIn:function(e,t){return t.reduce((function(e,t){return void 0!==t&&e?e[t]:e}),e)},applyPatch:function(e,t,r){if(r=r||{},"merge"===(t=Td(Td({},t),{},{path:t.path&&ZA(t.path)})).op){var n=dO(e,t.path);Hd(n,t.value),_A(e,[QA(t.path,n)])}else if("mergeDeep"===t.op){var a=dO(e,t.path),o=JA(a,t.value);e=_A(e,[QA(t.path,o)]).newDocument}else if("add"===t.op&&""===t.path&&oO(t.value)){_A(e,Cb(t.value).reduce((function(e,r){return e.push({op:"add",path:"/".concat(ZA(r)),value:t.value[r]}),e}),[]))}else if("replace"===t.op&&""===t.path){var i=t.value;r.allowMetaPatches&&t.meta&&cO(t)&&(Array.isArray(t.value)||oO(t.value))&&(i=Td(Td({},i),t.meta)),e=i}else if(_A(e,[t]),r.allowMetaPatches&&t.meta&&cO(t)&&(Array.isArray(t.value)||oO(t.value))){var s=Td(Td({},dO(e,t.path)),t.meta);_A(e,[QA(t.path,s)])}return e},parentPathMatch:function(e,t){if(!Array.isArray(t))return!1;for(var r=0,n=t.length;r<n;r+=1)if(t[r]!==e[r])return!1;return!0},flatten:nO,fullyNormalizeArray:function(e){return aO(nO(rO(e)))},normalizeArray:rO,isPromise:function(e){return oO(e)&&iO(e.then)},forEachNew:function(e,t){try{return XA(e,tO,t)}catch(e){return e}},forEachNewPrimitive:function(e,t){try{return XA(e,eO,t)}catch(e){return e}},isJsonPatch:sO,isContextPatch:function(e){return pO(e)&&"context"===e.type},isPatch:pO,isMutation:lO,isAdditiveMutation:cO,isGenerator:function(e){return"[object GeneratorFunction]"===Object.prototype.toString.call(e)},isFunction:iO,isObject:oO,isError:function(e){return e instanceof Error}};function ZA(e){return Array.isArray(e)?e.length<1?"":"/".concat(Tb(e).call(e,(function(e){return(e+"").replace(/~/g,"~0").replace(/\//g,"~1")})).join("/")):e}function QA(e,t,r){return{op:"replace",path:e,value:t,meta:r}}function XA(e,t,r){var n;return aO(nO(Tb(n=Wb(e).call(e,cO)).call(n,(function(e){return t(e.value,r,e.path)}))||[]))}function eO(e,t,r){return r=r||[],Array.isArray(e)?Tb(e).call(e,(function(e,n){return eO(e,t,Rb(r).call(r,n))})):oO(e)?Tb(n=Cb(e)).call(n,(function(n){return eO(e[n],t,Rb(r).call(r,n))})):t(e,r[r.length-1],r);var n}function tO(e,t,r){var n=[];if((r=r||[]).length>0){var a=t(e,r[r.length-1],r);a&&(n=Rb(n).call(n,a))}if(Array.isArray(e)){var o=Tb(e).call(e,(function(e,n){return tO(e,t,Rb(r).call(r,n))}));o&&(n=Rb(n).call(n,o))}else if(oO(e)){var i,s=Tb(i=Cb(e)).call(i,(function(n){return tO(e[n],t,Rb(r).call(r,n))}));s&&(n=Rb(n).call(n,s))}return nO(n)}function rO(e){return Array.isArray(e)?e:[e]}function nO(e){var t;return Rb(t=[]).apply(t,fS(Tb(e).call(e,(function(e){return Array.isArray(e)?nO(e):e}))))}function aO(e){return Wb(e).call(e,(function(e){return void 0!==e}))}function oO(e){return e&&"object"===Pf(e)}function iO(e){return e&&"function"==typeof e}function sO(e){if(pO(e)){var t=e.op;return"add"===t||"remove"===t||"replace"===t}return!1}function lO(e){return sO(e)||pO(e)&&"mutation"===e.type}function cO(e){return lO(e)&&("add"===e.op||"replace"===e.op||"merge"===e.op||"mergeDeep"===e.op)}function pO(e){return e&&"object"===Pf(e)}function dO(e,t){try{return CA(e,t)}catch(e){return console.error(e),{}}}var uO={exports:{}},hO=mt((function(){if("function"==typeof ArrayBuffer){var e=new ArrayBuffer(8);Object.isExtensible(e)&&Object.defineProperty(e,"a",{value:8})}})),fO=mt,mO=nr,yO=Ht,gO=hO,vO=Object.isExtensible,bO=fO((function(){vO(1)}))||gO?function(e){return!!mO(e)&&(!gO||"ArrayBuffer"!=yO(e))&&(!vO||vO(e))}:vO,xO=!mt((function(){return Object.isExtensible(Object.preventExtensions({}))})),wO=Ta,$O=Et,kO=Va,SO=nr,AO=Zr,OO=Xn.f,EO=Ko,TO=Zo,CO=bO,jO=xO,_O=!1,PO=rn("meta"),IO=0,RO=function(e){OO(e,PO,{value:{objectID:"O"+IO++,weakData:{}}})},LO=uO.exports={enable:function(){LO.enable=function(){},_O=!0;var e=EO.f,t=$O([].splice),r={};r[PO]=1,e(r).length&&(EO.f=function(r){for(var n=e(r),a=0,o=n.length;a<o;a++)if(n[a]===PO){t(n,a,1);break}return n},wO({target:"Object",stat:!0,forced:!0},{getOwnPropertyNames:TO.f}))},fastKey:function(e,t){if(!SO(e))return"symbol"==typeof e?e:("string"==typeof e?"S":"P")+e;if(!AO(e,PO)){if(!CO(e))return"F";if(!t)return"E";RO(e)}return e[PO].objectID},getWeakData:function(e,t){if(!AO(e,PO)){if(!CO(e))return!0;if(!t)return!1;RO(e)}return e[PO].weakData},onFreeze:function(e){return jO&&_O&&CO(e)&&!AO(e,PO)&&RO(e),e}};kO[PO]=!0;var DO=Ta,FO=ft,NO=uO.exports,qO=mt,zO=ya,UO=nm,BO=Nm,MO=Tt,HO=nr,WO=Pi,VO=Xn.f,GO=Ls.forEach,KO=jt,JO=is.set,YO=is.getterFor,ZO=Et,QO=_m,XO=uO.exports.getWeakData,eE=oa,tE=nr,rE=Nm,nE=nm,aE=Zr,oE=is.set,iE=is.getterFor,sE=Ls.find,lE=Ls.findIndex,cE=ZO([].splice),pE=0,dE=function(e){return e.frozen||(e.frozen=new uE)},uE=function(){this.entries=[]},hE=function(e,t){return sE(e.entries,(function(e){return e[0]===t}))};uE.prototype={get:function(e){var t=hE(this,e);if(t)return t[1]},has:function(e){return!!hE(this,e)},set:function(e,t){var r=hE(this,e);r?r[1]=t:this.entries.push([e,t])},delete:function(e){var t=lE(this.entries,(function(t){return t[0]===e}));return~t&&cE(this.entries,t,1),!!~t}};var fE,mE={getConstructor:function(e,t,r,n){var a=e((function(e,a){rE(e,o),oE(e,{type:t,id:pE++,frozen:void 0}),null!=a&&nE(a,e[n],{that:e,AS_ENTRIES:r})})),o=a.prototype,i=iE(t),s=function(e,t,r){var n=i(e),a=XO(eE(t),!0);return!0===a?dE(n).set(t,r):a[n.id]=r,e};return QO(o,{delete:function(e){var t=i(this);if(!tE(e))return!1;var r=XO(e);return!0===r?dE(t).delete(e):r&&aE(r,t.id)&&delete r[t.id]},has:function(e){var t=i(this);if(!tE(e))return!1;var r=XO(e);return!0===r?dE(t).has(e):r&&aE(r,t.id)}}),QO(o,r?{get:function(e){var t=i(this);if(tE(e)){var r=XO(e);return!0===r?dE(t).get(e):r?r[t.id]:void 0}},set:function(e,t){return s(this,e,t)}}:{add:function(e){return s(this,e,!0)}}),a}},yE=ft,gE=Et,vE=_m,bE=uO.exports,xE=mE,wE=nr,$E=bO,kE=is.enforce,SE=Mi,AE=!yE.ActiveXObject&&"ActiveXObject"in yE,OE=function(e){return function(){return e(this,arguments.length?arguments[0]:void 0)}},EE=function(e,t,r){var n,a=-1!==e.indexOf("Map"),o=-1!==e.indexOf("Weak"),i=a?"set":"add",s=FO[e],l=s&&s.prototype,c={};if(KO&&MO(s)&&(o||l.forEach&&!qO((function(){(new s).entries().next()})))){var p=(n=t((function(t,r){JO(BO(t,p),{type:e,collection:new s}),null!=r&&UO(r,t[i],{that:t,AS_ENTRIES:a})}))).prototype,d=YO(e);GO(["add","clear","delete","forEach","get","has","set","keys","values","entries"],(function(e){var t="add"==e||"set"==e;!(e in l)||o&&"clear"==e||zO(p,e,(function(r,n){var a=d(this).collection;if(!t&&o&&!HO(r))return"get"==e&&void 0;var i=a[e](0===r?0:r,n);return t?this:i}))})),o||VO(p,"size",{configurable:!0,get:function(){return d(this).collection.size}})}else n=r.getConstructor(t,e,a,i),NO.enable();return WO(n,e,!1,!0),c[e]=n,DO({global:!0,forced:!0},c),o||r.setStrong(n,e,a),n}("WeakMap",OE,xE);if(SE&&AE){fE=xE.getConstructor(OE,"WeakMap",!0),bE.enable();var TE=EE.prototype,CE=gE(TE.delete),jE=gE(TE.has),_E=gE(TE.get),PE=gE(TE.set);vE(TE,{delete:function(e){if(wE(e)&&!$E(e)){var t=kE(this);return t.frozen||(t.frozen=new fE),CE(this,e)||t.frozen.delete(e)}return CE(this,e)},has:function(e){if(wE(e)&&!$E(e)){var t=kE(this);return t.frozen||(t.frozen=new fE),jE(this,e)||t.frozen.has(e)}return jE(this,e)},get:function(e){if(wE(e)&&!$E(e)){var t=kE(this);return t.frozen||(t.frozen=new fE),jE(this,e)?_E(this,e):t.frozen.get(e)}return _E(this,e)},set:function(e,t){if(wE(e)&&!$E(e)){var r=kE(this);r.frozen||(r.frozen=new fE),jE(this,e)?PE(this,e,t):r.frozen.set(e,t)}else PE(this,e,t);return this}})}const IE=ut({exports:{}}.exports=ar.WeakMap);var RE=mt,LE=fn("iterator"),DE=!RE((function(){var e=new URL("b?a=1&b=2&c=3","http://a"),t=e.searchParams,r="";return e.pathname="c%20d",t.forEach((function(e,n){t.delete("b"),r+=n+e})),!e.toJSON||!t.sort||"http://a/c%20d?a=1&c=3"!==e.href||"3"!==t.get("c")||"a=1"!==String(new URLSearchParams("?a=1"))||!t[LE]||"a"!==new URL("https://a@b").username||"b"!==new URLSearchParams(new URLSearchParams("a=b")).get("a")||"xn--e1aybc"!==new URL("http://тест").host||"#%D0%B1"!==new URL("http://a#б").hash||"a1c3"!==r||"x"!==new URL("http://x",void 0).host})),FE=si,NE=Math.floor,qE=function(e,t){var r=e.length,n=NE(r/2);return r<8?zE(e,t):UE(e,qE(FE(e,0,n),t),qE(FE(e,n),t),t)},zE=function(e,t){for(var r,n,a=e.length,o=1;o<a;){for(n=o,r=e[o];n&&t(e[n-1],r)>0;)e[n]=e[--n];n!==o++&&(e[n]=r)}return e},UE=function(e,t,r,n){for(var a=t.length,o=r.length,i=0,s=0;i<a||s<o;)e[i+s]=i<a&&s<o?n(t[i],r[s])<=0?t[i++]:r[s++]:i<a?t[i++]:r[s++];return e},BE=Ta,ME=ft,HE=cr,WE=It,VE=Et,GE=DE,KE=yi,JE=_m,YE=Pi,ZE=ip,QE=is,XE=Nm,eT=Tt,tT=Zr,rT=Qn,nT=bo,aT=oa,oT=nr,iT=$o,sT=Go,lT=zt,cT=lf,pT=xh,dT=Vm,uT=qE,hT=fn("iterator"),fT=QE.set,mT=QE.getterFor("URLSearchParams"),yT=QE.getterFor("URLSearchParamsIterator"),gT=HE("fetch"),vT=HE("Request"),bT=HE("Headers"),xT=vT&&vT.prototype,wT=bT&&bT.prototype,$T=ME.RegExp,kT=ME.TypeError,ST=ME.decodeURIComponent,AT=ME.encodeURIComponent,OT=VE("".charAt),ET=VE([].join),TT=VE([].push),CT=VE("".replace),jT=VE([].shift),_T=VE([].splice),PT=VE("".split),IT=VE("".slice),RT=/\+/g,LT=Array(4),DT=function(e){return LT[e-1]||(LT[e-1]=$T("((?:%[\\da-f]{2}){"+e+"})","gi"))},FT=function(e){try{return ST(e)}catch(t){return e}},NT=function(e){var t=CT(e,RT," "),r=4;try{return ST(t)}catch(e){for(;r;)t=CT(t,DT(r--),FT);return t}},qT=/[!'()~]|%20/g,zT={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+"},UT=function(e){return zT[e]},BT=function(e){return CT(AT(e),qT,UT)},MT=ZE((function(e,t){fT(this,{type:"URLSearchParamsIterator",iterator:cT(mT(e).entries),kind:t})}),"Iterator",(function(){var e=yT(this),t=e.kind,r=e.iterator.next(),n=r.value;return r.done||(r.value="keys"===t?n.key:"values"===t?n.value:[n.key,n.value]),r}),!0),HT=function(e){this.entries=[],this.url=null,void 0!==e&&(oT(e)?this.parseObject(e):this.parseQuery("string"==typeof e?"?"===OT(e,0)?IT(e,1):e:iT(e)))};HT.prototype={type:"URLSearchParams",bindURL:function(e){this.url=e,this.update()},parseObject:function(e){var t,r,n,a,o,i,s,l=pT(e);if(l)for(r=(t=cT(e,l)).next;!(n=WE(r,t)).done;){if(o=(a=cT(aT(n.value))).next,(i=WE(o,a)).done||(s=WE(o,a)).done||!WE(o,a).done)throw kT("Expected sequence with length 2");TT(this.entries,{key:iT(i.value),value:iT(s.value)})}else for(var c in e)tT(e,c)&&TT(this.entries,{key:c,value:iT(e[c])})},parseQuery:function(e){if(e)for(var t,r,n=PT(e,"&"),a=0;a<n.length;)(t=n[a++]).length&&(r=PT(t,"="),TT(this.entries,{key:NT(jT(r)),value:NT(ET(r,"="))}))},serialize:function(){for(var e,t=this.entries,r=[],n=0;n<t.length;)e=t[n++],TT(r,BT(e.key)+"="+BT(e.value));return ET(r,"&")},update:function(){this.entries.length=0,this.parseQuery(this.url.query)},updateURL:function(){this.url&&this.url.update()}};var WT=function(){XE(this,VT);var e=arguments.length>0?arguments[0]:void 0;fT(this,new HT(e))},VT=WT.prototype;if(JE(VT,{append:function(e,t){dT(arguments.length,2);var r=mT(this);TT(r.entries,{key:iT(e),value:iT(t)}),r.updateURL()},delete:function(e){dT(arguments.length,1);for(var t=mT(this),r=t.entries,n=iT(e),a=0;a<r.length;)r[a].key===n?_T(r,a,1):a++;t.updateURL()},get:function(e){dT(arguments.length,1);for(var t=mT(this).entries,r=iT(e),n=0;n<t.length;n++)if(t[n].key===r)return t[n].value;return null},getAll:function(e){dT(arguments.length,1);for(var t=mT(this).entries,r=iT(e),n=[],a=0;a<t.length;a++)t[a].key===r&&TT(n,t[a].value);return n},has:function(e){dT(arguments.length,1);for(var t=mT(this).entries,r=iT(e),n=0;n<t.length;)if(t[n++].key===r)return!0;return!1},set:function(e,t){dT(arguments.length,1);for(var r,n=mT(this),a=n.entries,o=!1,i=iT(e),s=iT(t),l=0;l<a.length;l++)(r=a[l]).key===i&&(o?_T(a,l--,1):(o=!0,r.value=s));o||TT(a,{key:i,value:s}),n.updateURL()},sort:function(){var e=mT(this);uT(e.entries,(function(e,t){return e.key>t.key?1:-1})),e.updateURL()},forEach:function(e){for(var t,r=mT(this).entries,n=rT(e,arguments.length>1?arguments[1]:void 0),a=0;a<r.length;)n((t=r[a++]).value,t.key,this)},keys:function(){return new MT(this,"keys")},values:function(){return new MT(this,"values")},entries:function(){return new MT(this,"entries")}},{enumerable:!0}),KE(VT,hT,VT.entries,{name:"entries"}),KE(VT,"toString",(function(){return mT(this).serialize()}),{enumerable:!0}),YE(WT,"URLSearchParams"),BE({global:!0,forced:!GE},{URLSearchParams:WT}),!GE&&eT(bT)){var GT=VE(wT.has),KT=VE(wT.set),JT=function(e){if(oT(e)){var t,r=e.body;if("URLSearchParams"===nT(r))return t=e.headers?new bT(e.headers):new bT,GT(t,"content-type")||KT(t,"content-type","application/x-www-form-urlencoded;charset=UTF-8"),sT(e,{body:lT(0,iT(r)),headers:lT(0,t)})}return e};if(eT(gT)&&BE({global:!0,enumerable:!0,forced:!0},{fetch:function(e){return gT(e,arguments.length>1?JT(arguments[1]):{})}}),eT(vT)){var YT=function(e){return XE(this,xT),new vT(e,arguments.length>1?JT(arguments[1]):{})};xT.constructor=YT,YT.prototype=xT,BE({global:!0,forced:!0},{Request:YT})}}const ZT=ut({exports:{}}.exports=ar.URLSearchParams);function QT(e,t){function r(){Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack;for(var e=arguments.length,r=new Array(e),n=0;n<e;n++)r[n]=arguments[n];this.message=r[0],t&&t.apply(this,r)}return r.prototype=new Error,r.prototype.name=e,r.prototype.constructor=r,r}var XT={exports:{}},eC=XT.exports=function(e){return new tC(e)};function tC(e){this.value=e}function rC(e,t,r){var n=[],a=[],o=!0;return function e(i){var s=r?nC(i):i,l={},c=!0,p={node:s,node_:i,path:[].concat(n),parent:a[a.length-1],parents:a,key:n.slice(-1)[0],isRoot:0===n.length,level:n.length,circular:null,update:function(e,t){p.isRoot||(p.parent.node[p.key]=e),p.node=e,t&&(c=!1)},delete:function(e){delete p.parent.node[p.key],e&&(c=!1)},remove:function(e){iC(p.parent.node)?p.parent.node.splice(p.key,1):delete p.parent.node[p.key],e&&(c=!1)},keys:null,before:function(e){l.before=e},after:function(e){l.after=e},pre:function(e){l.pre=e},post:function(e){l.post=e},stop:function(){o=!1},block:function(){c=!1}};if(!o)return p;function d(){if("object"==typeof p.node&&null!==p.node){p.keys&&p.node_===p.node||(p.keys=aC(p.node)),p.isLeaf=0==p.keys.length;for(var e=0;e<a.length;e++)if(a[e].node_===i){p.circular=a[e];break}}else p.isLeaf=!0,p.keys=null;p.notLeaf=!p.isLeaf,p.notRoot=!p.isRoot}d();var u=t.call(p,p.node);return void 0!==u&&p.update&&p.update(u),l.before&&l.before.call(p,p.node),c?("object"!=typeof p.node||null===p.node||p.circular||(a.push(p),d(),sC(p.keys,(function(t,a){n.push(t),l.pre&&l.pre.call(p,p.node[t],t);var o=e(p.node[t]);r&&lC.call(p.node,t)&&(p.node[t]=o.node),o.isLast=a==p.keys.length-1,o.isFirst=0==a,l.post&&l.post.call(p,o),n.pop()})),a.pop()),l.after&&l.after.call(p,p.node),p):p}(e).node}function nC(e){if("object"==typeof e&&null!==e){var t;if(iC(e))t=[];else if("[object Date]"===oC(e))t=new Date(e.getTime?e.getTime():e);else if("[object RegExp]"===oC(e))t=new RegExp(e);else if(function(e){return"[object Error]"===oC(e)}(e))t={message:e.message};else if(function(e){return"[object Boolean]"===oC(e)}(e))t=new Boolean(e);else if(function(e){return"[object Number]"===oC(e)}(e))t=new Number(e);else if(function(e){return"[object String]"===oC(e)}(e))t=new String(e);else if(Object.create&&Object.getPrototypeOf)t=Object.create(Object.getPrototypeOf(e));else if(e.constructor===Object)t={};else{var r=e.constructor&&e.constructor.prototype||e.__proto__||{},n=function(){};n.prototype=r,t=new n}return sC(aC(e),(function(r){t[r]=e[r]})),t}return e}tC.prototype.get=function(e){for(var t=this.value,r=0;r<e.length;r++){var n=e[r];if(!t||!lC.call(t,n)){t=void 0;break}t=t[n]}return t},tC.prototype.has=function(e){for(var t=this.value,r=0;r<e.length;r++){var n=e[r];if(!t||!lC.call(t,n))return!1;t=t[n]}return!0},tC.prototype.set=function(e,t){for(var r=this.value,n=0;n<e.length-1;n++){var a=e[n];lC.call(r,a)||(r[a]={}),r=r[a]}return r[e[n]]=t,t},tC.prototype.map=function(e){return rC(this.value,e,!0)},tC.prototype.forEach=function(e){return this.value=rC(this.value,e,!1),this.value},tC.prototype.reduce=function(e,t){var r=1===arguments.length,n=r?this.value:t;return this.forEach((function(t){this.isRoot&&r||(n=e.call(this,n,t))})),n},tC.prototype.paths=function(){var e=[];return this.forEach((function(t){e.push(this.path)})),e},tC.prototype.nodes=function(){var e=[];return this.forEach((function(t){e.push(this.node)})),e},tC.prototype.clone=function(){var e=[],t=[];return function r(n){for(var a=0;a<e.length;a++)if(e[a]===n)return t[a];if("object"==typeof n&&null!==n){var o=nC(n);return e.push(n),t.push(o),sC(aC(n),(function(e){o[e]=r(n[e])})),e.pop(),t.pop(),o}return n}(this.value)};var aC=Object.keys||function(e){var t=[];for(var r in e)t.push(r);return t};function oC(e){return Object.prototype.toString.call(e)}var iC=Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)},sC=function(e,t){if(e.forEach)return e.forEach(t);for(var r=0;r<e.length;r++)t(e[r],r,e)};sC(aC(tC.prototype),(function(e){eC[e]=function(t){var r=[].slice.call(arguments,1),n=new tC(t);return n[e].apply(n,r)}}));var lC=Object.hasOwnProperty||function(e,t){return t in e},cC=["properties"],pC=["properties"],dC=["definitions","parameters","responses","securityDefinitions","components/schemas","components/responses","components/parameters","components/securitySchemes"],uC=["schema/example","items/example"];function hC(e){var t=e[e.length-1],r=e[e.length-2],n=e.join("/");return cC.indexOf(t)>-1&&-1===pC.indexOf(r)||dC.indexOf(n)>-1||uC.some((function(e){return n.indexOf(e)>-1}))}function fC(e,t){var r,n=If(e.split("#"),2),a=n[0],o=n[1],i=hu.resolve(a||"",t||"");return o?Rb(r="".concat(i,"#")).call(r,o):i}var mC=/^([a-z]+:\/\/|\/\/)/i,yC=QT("JSONRefError",(function(e,t,r){this.originalError=r,Hd(this,t||{})})),gC={},vC=new IE,bC=[function(e){return"paths"===e[0]&&"responses"===e[3]&&"examples"===e[5]},function(e){return"paths"===e[0]&&"responses"===e[3]&&"content"===e[5]&&"example"===e[7]},function(e){return"paths"===e[0]&&"responses"===e[3]&&"content"===e[5]&&"examples"===e[7]&&"value"===e[9]},function(e){return"paths"===e[0]&&"requestBody"===e[3]&&"content"===e[4]&&"example"===e[6]},function(e){return"paths"===e[0]&&"requestBody"===e[3]&&"content"===e[4]&&"examples"===e[6]&&"value"===e[8]},function(e){return"paths"===e[0]&&"parameters"===e[2]&&"example"===e[4]},function(e){return"paths"===e[0]&&"parameters"===e[3]&&"example"===e[5]},function(e){return"paths"===e[0]&&"parameters"===e[2]&&"examples"===e[4]&&"value"===e[6]},function(e){return"paths"===e[0]&&"parameters"===e[3]&&"examples"===e[5]&&"value"===e[7]},function(e){return"paths"===e[0]&&"parameters"===e[2]&&"content"===e[4]&&"example"===e[6]},function(e){return"paths"===e[0]&&"parameters"===e[2]&&"content"===e[4]&&"examples"===e[6]&&"value"===e[8]},function(e){return"paths"===e[0]&&"parameters"===e[3]&&"content"===e[4]&&"example"===e[7]},function(e){return"paths"===e[0]&&"parameters"===e[3]&&"content"===e[5]&&"examples"===e[7]&&"value"===e[9]}],xC={key:"$ref",plugin:function(e,t,r,n){var a,o=n.getInstance(),i=mS(r).call(r,0,-1);if(!hC(i)&&(a=i,!bC.some((function(e){return e(a)})))){var s=n.getContext(r).baseDoc;if("string"!=typeof e)return new yC("$ref: must be a string (JSON-Ref)",{$ref:e,baseDoc:s,fullPath:r});var l,c,p,d=SC(e),u=d[0],h=d[1]||"";try{l=s||u?$C(u,s):null}catch(t){return kC(t,{pointer:h,$ref:e,basePath:l,fullPath:r})}if(function(e,t,r,n){var a,o,i=vC.get(n);i||(i={},vC.set(n,i));var s,l=0===(s=r).length?"":"/".concat(Tb(s).call(s,jC).join("/")),c=Rb(a="".concat(t||"<specmap-base>","#")).call(a,e),p=l.replace(/allOf\/\d+\/?/g,"");if(t===n.contextTree.get([]).baseDoc&&_C(p,e))return!0;var d="",u=r.some((function(e){var t;return d=Rb(t="".concat(d,"/")).call(t,jC(e)),i[d]&&i[d].some((function(e){return _C(e,c)||_C(c,e)}))}));if(u)return!0;i[p]=Rb(o=i[p]||[]).call(o,c)}(h,l,i,n)&&!o.useCircularStructures){var f=fC(e,l);return e===f?null:YA.replace(r,f)}if(null==l?(p=TC(h),void 0===(c=n.get(p))&&(c=new yC("Could not resolve reference: ".concat(e),{pointer:h,$ref:e,baseDoc:s,fullPath:r}))):c=null!=(c=AC(l,h)).l?c.l:c.catch((function(t){throw kC(t,{pointer:h,$ref:e,baseDoc:s,fullPath:r})})),c instanceof Error)return[YA.remove(r),c];var m=fC(e,l),y=YA.replace(i,c,{$$ref:m});if(l&&l!==s)return[y,YA.context(i,{baseDoc:l})];try{if(!function(e,t){var r=[e];return t.path.reduce((function(e,t){return r.push(e[t]),e[t]}),e),function e(t){return YA.isObject(t)&&(r.indexOf(t)>=0||Cb(t).some((function(r){return e(t[r])})))}(t.value)}(n.state,y)||o.useCircularStructures)return y}catch(a){return null}}}},wC=Hd(xC,{docCache:gC,absoluteify:$C,clearCache:function(e){void 0!==e?delete gC[e]:Cb(gC).forEach((function(e){delete gC[e]}))},JSONRefError:yC,wrapError:kC,getDoc:OC,split:SC,extractFromDoc:AC,fetchJSON:function(e){return fetch(e,{headers:{Accept:"application/json, application/yaml"},loadSpec:!0}).then((function(e){return e.text()})).then((function(e){return cS.load(e)}))},extract:EC,jsonPointerToArray:TC,unescapeJsonPointerToken:CC});function $C(e,t){if(!mC.test(e)){var r;if(!t)throw new yC(Rb(r="Tried to resolve a relative URL, without having a basePath. path: '".concat(e,"' basePath: '")).call(r,t,"'"));return hu.resolve(t,e)}return e}function kC(e,t){var r,n;return r=e&&e.response&&e.response.body?Rb(n="".concat(e.response.body.code," ")).call(n,e.response.body.message):e.message,new yC("Could not resolve reference: ".concat(r),t,e)}function SC(e){return(e+"").split("#")}function AC(e,t){var r=gC[e];if(r&&!YA.isPromise(r))try{var n=EC(t,r);return Hd(JS.resolve(n),{l:n})}catch(e){return JS.reject(e)}return OC(e).then((function(e){return EC(t,e)}))}function OC(e){var t=gC[e];return t?YA.isPromise(t)?t:JS.resolve(t):(gC[e]=wC.fetchJSON(e).then((function(t){return gC[e]=t,t})),gC[e])}function EC(e,t){var r=TC(e);if(r.length<1)return t;var n=YA.getIn(t,r);if(void 0===n)throw new yC("Could not resolve pointer: ".concat(e," does not exist in document"),{pointer:e});return n}function TC(e){var t;if("string"!=typeof e)throw new TypeError("Expected a string, got a ".concat(Pf(e)));return"/"===e[0]&&(e=e.substr(1)),""===e?[]:Tb(t=e.split("/")).call(t,CC)}function CC(e){return"string"!=typeof e?e:new ZT("=".concat(e.replace(/~1/g,"/").replace(/~0/g,"~"))).get("")}function jC(e){var t,r=new ZT([["",e.replace(/~/g,"~0").replace(/\//g,"~1")]]);return mS(t=r.toString()).call(t,1)}function _C(e,t){if(!(r=t)||"/"===r||"#"===r)return!0;var r,n=e.charAt(t.length),a=mS(t).call(t,-1);return 0===e.indexOf(t)&&(!n||"/"===n||"#"===n)&&"#"!==a}const PC={key:"allOf",plugin:function(e,t,r,n,a){if(!a.meta||!a.meta.$$ref){var o=mS(r).call(r,0,-1);if(!hC(o)){if(!Array.isArray(e)){var i=new TypeError("allOf must be an array");return i.fullPath=r,i}var s=!1,l=a.value;if(o.forEach((function(e){l&&(l=l[e])})),l=Td({},l),0!==Cb(l).length){delete l.allOf;var c,p,d=[];return d.push(n.replace(o,{})),e.forEach((function(e,t){if(!n.isObject(e)){if(s)return null;s=!0;var a=new TypeError("Elements in allOf must be objects");return a.fullPath=r,d.push(a)}d.push(n.mergeDeep(o,e));var i=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=r.specmap,a=r.getBaseUrlForNodePath,o=void 0===a?function(e){var r;return n.getContext(Rb(r=[]).call(r,fS(t),fS(e))).baseDoc}:a,i=r.targetKeys,s=void 0===i?["$ref","$$ref"]:i,l=[];return XT.exports(e).forEach((function(){if(Gv(s).call(s,this.key)&&"string"==typeof this.node){var e=this.path,r=Rb(t).call(t,this.path),a=fC(this.node,o(e));l.push(n.replace(r,a))}})),l}(e,mS(r).call(r,0,-1),{getBaseUrlForNodePath:function(e){var a;return n.getContext(Rb(a=[]).call(a,fS(r),[t],fS(e))).baseDoc},specmap:n});d.push.apply(d,fS(i))})),l.example&&d.push(n.remove(Rb(c=[]).call(c,o,"example"))),d.push(n.mergeDeep(o,l)),l.$$ref||d.push(n.remove(Rb(p=[]).call(p,o,"$$ref"))),d}}}}},IC={key:"parameters",plugin:function(e,t,r,n){if(Array.isArray(e)&&e.length){var a=Hd([],e),o=mS(r).call(r,0,-1),i=Td({},YA.getIn(n.spec,o));return e.forEach((function(e,t){try{a[t].default=n.parameterMacro(i,e)}catch(e){var o=new Error(e);return o.fullPath=r,o}})),YA.replace(r,a)}return YA.replace(r,e)}},RC={key:"properties",plugin:function(e,t,r,n){var a=Td({},e);for(var o in e)try{a[o].default=n.modelPropertyMacro(a[o])}catch(e){var i=new Error(e);return i.fullPath=r,i}return YA.replace(r,a)}};var LC=function(){function e(t){NS(this,e),this.root=DC(t||{})}return zS(e,[{key:"set",value:function(e,t){var r=this.getParent(e,!0);if(r){var n=e[e.length-1],a=r.children;a[n]?FC(a[n],t,r):a[n]=DC(t,r)}else FC(this.root,t,null)}},{key:"get",value:function(e){if((e=e||[]).length<1)return this.root.value;for(var t,r,n=this.root,a=0;a<e.length&&(r=e[a],(t=n.children)[r]);a+=1)n=t[r];return n&&n.protoValue}},{key:"getParent",value:function(e,t){return!e||e.length<1?null:e.length<2?this.root:mS(e).call(e,0,-1).reduce((function(e,r){if(!e)return e;var n=e.children;return!n[r]&&t&&(n[r]=DC(null,e)),n[r]}),this.root)}}]),e}();function DC(e,t){return FC({children:{}},e,t)}function FC(e,t,r){return e.value=t||{},e.protoValue=r?Td(Td({},r.protoValue),e.value):e.value,Cb(e.children).forEach((function(t){var r=e.children[t];e.children[t]=FC(r,r.value,e)})),e}var NC=function(){},qC=function(){function e(t){var r,n,a=this;NS(this,e),Hd(this,{spec:"",debugLevel:"info",plugins:[],pluginHistory:{},errors:[],mutations:[],promisedPatches:[],state:{},patches:[],context:{},contextTree:new LC,showDebug:!1,allPatches:[],pluginProp:"specMap",libMethods:Hd(Object.create(this),YA,{getInstance:function(){return a}}),allowMetaPatches:!1},t),this.get=this._get.bind(this),this.getContext=this._getContext.bind(this),this.hasRun=this._hasRun.bind(this),this.wrappedPlugins=Wb(r=Tb(n=this.plugins).call(n,this.wrapPlugin.bind(this))).call(r,YA.isFunction),this.patches.push(YA.add([],this.spec)),this.patches.push(YA.context([],this.context)),this.updatePatches(this.patches)}return zS(e,[{key:"debug",value:function(e){if(this.debugLevel===e){for(var t,r=arguments.length,n=new Array(r>1?r-1:0),a=1;a<r;a++)n[a-1]=arguments[a];(t=console).log.apply(t,n)}}},{key:"verbose",value:function(e){if("verbose"===this.debugLevel){for(var t,r,n=arguments.length,a=new Array(n>1?n-1:0),o=1;o<n;o++)a[o-1]=arguments[o];(t=console).log.apply(t,Rb(r=["[".concat(e,"]   ")]).call(r,a))}}},{key:"wrapPlugin",value:function(e,t){var r,n,a,o=this.pathDiscriminator,i=null;return e[this.pluginProp]?(i=e,r=e[this.pluginProp]):YA.isFunction(e)?r=e:YA.isObject(e)&&(n=e,a=function(e,t){return!Array.isArray(e)||e.every((function(e,r){return e===t[r]}))},r=Pv.mark((function e(t,r){var i,s,l,c,p,d;return Pv.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:d=function(e,t,l){var c,p,u,h,f,m,y,g,v,b,x,w,$;return Pv.wrap((function(i){for(;;)switch(i.prev=i.next){case 0:if(YA.isObject(e)){i.next=6;break}if(n.key!==t[t.length-1]){i.next=4;break}return i.next=4,n.plugin(e,n.key,t,r);case 4:i.next=30;break;case 6:c=t.length-1,p=t[c],u=t.indexOf("properties"),h="properties"===p&&c===u,f=r.allowMetaPatches&&s[e.$$ref],m=0,y=Cb(e);case 12:if(!(m<y.length)){i.next=30;break}if(g=y[m],v=e[g],b=Rb(t).call(t,g),x=YA.isObject(v),w=e.$$ref,f){i.next=22;break}if(!x){i.next=22;break}return r.allowMetaPatches&&w&&(s[w]=!0),i.delegateYield(d(v,b,l),"t0",22);case 22:if(h||g!==n.key){i.next=27;break}if($=a(o,t),o&&!$){i.next=27;break}return i.next=27,n.plugin(v,g,b,r,l);case 27:m++,i.next=12;break;case 30:case"end":return i.stop()}}),i)},i=Pv.mark(d),s={},l=Cf(Wb(t).call(t,YA.isAdditiveMutation)),e.prev=4,l.s();case 6:if((c=l.n()).done){e.next=11;break}return p=c.value,e.delegateYield(d(p.value,p.path,p),"t0",9);case 9:e.next=6;break;case 11:e.next=16;break;case 13:e.prev=13,e.t1=e.catch(4),l.e(e.t1);case 16:return e.prev=16,l.f(),e.finish(16);case 19:case"end":return e.stop()}}),e,null,[[4,13,16,19]])}))),Hd(r.bind(i),{pluginName:e.name||t,isGenerator:YA.isGenerator(r)})}},{key:"nextPlugin",value:function(){var e,t=this;return KS(e=this.wrappedPlugins).call(e,(function(e){return t.getMutationsForPlugin(e).length>0}))}},{key:"nextPromisedPatch",value:function(){var e;if(this.promisedPatches.length>0)return JS.race(Tb(e=this.promisedPatches).call(e,(function(e){return e.value})))}},{key:"getPluginHistory",value:function(e){var t=this.constructor.getPluginName(e);return this.pluginHistory[t]||[]}},{key:"getPluginRunCount",value:function(e){return this.getPluginHistory(e).length}},{key:"getPluginHistoryTip",value:function(e){var t=this.getPluginHistory(e);return t&&t[t.length-1]||{}}},{key:"getPluginMutationIndex",value:function(e){var t=this.getPluginHistoryTip(e).mutationIndex;return"number"!=typeof t?-1:t}},{key:"updatePluginHistory",value:function(e,t){var r=this.constructor.getPluginName(e);this.pluginHistory[r]=this.pluginHistory[r]||[],this.pluginHistory[r].push(t)}},{key:"updatePatches",value:function(e){var t=this;YA.normalizeArray(e).forEach((function(e){if(e instanceof Error)t.errors.push(e);else try{if(!YA.isObject(e))return void t.debug("updatePatches","Got a non-object patch",e);if(t.showDebug&&t.allPatches.push(e),YA.isPromise(e.value))return t.promisedPatches.push(e),void t.promisedPatchThen(e);if(YA.isContextPatch(e))return void t.setContext(e.path,e.value);if(YA.isMutation(e))return void t.updateMutations(e)}catch(e){console.error(e),t.errors.push(e)}}))}},{key:"updateMutations",value:function(e){"object"===Pf(e.value)&&!Array.isArray(e.value)&&this.allowMetaPatches&&(e.value=Td({},e.value));var t=YA.applyPatch(this.state,e,{allowMetaPatches:this.allowMetaPatches});t&&(this.mutations.push(e),this.state=t)}},{key:"removePromisedPatch",value:function(e){var t,r=this.promisedPatches.indexOf(e);r<0?this.debug("Tried to remove a promisedPatch that isn't there!"):uA(t=this.promisedPatches).call(t,r,1)}},{key:"promisedPatchThen",value:function(e){var t=this;return e.value=e.value.then((function(r){var n=Td(Td({},e),{},{value:r});t.removePromisedPatch(e),t.updatePatches(n)})).catch((function(r){t.removePromisedPatch(e),t.updatePatches(r)})),e.value}},{key:"getMutations",value:function(e,t){var r;return e=e||0,"number"!=typeof t&&(t=this.mutations.length),mS(r=this.mutations).call(r,e,t)}},{key:"getCurrentMutations",value:function(){return this.getMutationsForPlugin(this.getCurrentPlugin())}},{key:"getMutationsForPlugin",value:function(e){var t=this.getPluginMutationIndex(e);return this.getMutations(t+1)}},{key:"getCurrentPlugin",value:function(){return this.currentPlugin}},{key:"getLib",value:function(){return this.libMethods}},{key:"_get",value:function(e){return YA.getIn(this.state,e)}},{key:"_getContext",value:function(e){return this.contextTree.get(e)}},{key:"setContext",value:function(e,t){return this.contextTree.set(e,t)}},{key:"_hasRun",value:function(e){return this.getPluginRunCount(this.getCurrentPlugin())>(e||0)}},{key:"dispatch",value:function(){var e,t=this,r=this,n=this.nextPlugin();if(!n){var a=this.nextPromisedPatch();if(a)return a.then((function(){return t.dispatch()})).catch((function(){return t.dispatch()}));var o={spec:this.state,errors:this.errors};return this.showDebug&&(o.patches=this.allPatches),JS.resolve(o)}if(r.pluginCount=r.pluginCount||{},r.pluginCount[n]=(r.pluginCount[n]||0)+1,r.pluginCount[n]>100)return JS.resolve({spec:r.state,errors:Rb(e=r.errors).call(e,new Error("We've reached a hard limit of ".concat(100," plugin runs")))});if(n!==this.currentPlugin&&this.promisedPatches.length){var i,s=Tb(i=this.promisedPatches).call(i,(function(e){return e.value}));return JS.all(Tb(s).call(s,(function(e){return e.then(NC,NC)}))).then((function(){return t.dispatch()}))}return function(){r.currentPlugin=n;var e=r.getCurrentMutations(),t=r.mutations.length-1;try{if(n.isGenerator){var a,o=Cf(n(e,r.getLib()));try{for(o.s();!(a=o.n()).done;)l(a.value)}catch(e){o.e(e)}finally{o.f()}}else l(n(e,r.getLib()))}catch(e){console.error(e),l([Hd(Object.create(e),{plugin:n})])}finally{r.updatePluginHistory(n,{mutationIndex:t})}return r.dispatch()}();function l(e){e&&(e=YA.fullyNormalizeArray(e),r.updatePatches(e,n))}}}],[{key:"getPluginName",value:function(e){return e.pluginName}},{key:"getPatchesOfType",value:function(e,t){return Wb(e).call(e,t)}}]),e}(),zC={refs:wC,allOf:PC,parameters:IC,properties:RC},UC=function(e){return String.prototype.toLowerCase.call(e)},BC=function(e){return e.replace(/[^\w]/gi,"_")};function MC(e){var t=e.openapi;return!!t&&uu(t).call(t,"3")}function HC(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},a=n.v2OperationIdCompatibilityMode;if(!e||"object"!==Pf(e))return null;var o=(e.operationId||"").replace(/\s/g,"");return o.length?BC(e.operationId):WC(t,r,{v2OperationIdCompatibilityMode:a})}function WC(e,t){var r,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},a=n.v2OperationIdCompatibilityMode;if(a){var o,i,s=Rb(o="".concat(t.toLowerCase(),"_")).call(o,e).replace(/[\s!@#$%^&*()_+=[{\]};:<>|./?,\\'""-]/g,"_");return(s=s||Rb(i="".concat(e.substring(1),"_")).call(i,t)).replace(/((_){2,})/g,"_").replace(/^(_)*/g,"").replace(/([_])*$/g,"")}return Rb(r="".concat(UC(t))).call(r,BC(e))}function VC(e,t){var r;return Rb(r="".concat(UC(t),"-")).call(r,e)}function GC(e,t){return e&&e.paths?KC(e,(function(e){var r=e.pathName,n=e.method,a=e.operation;if(!a||"object"!==Pf(a))return!1;var o=a.operationId;return[HC(a,r,n),VC(r,n),o].some((function(e){return e&&e===t}))}),!0)||null:null}function KC(e,t,r){if(!e||"object"!==Pf(e)||!e.paths||"object"!==Pf(e.paths))return null;var n=e.paths;for(var a in n)for(var o in n[a])if("PARAMETERS"!==o.toUpperCase()){var i=n[a][o];if(i&&"object"===Pf(i)){var s={spec:e,pathName:a,method:o.toUpperCase(),operation:i},l=t(s);if(r&&l)return s}}}function JC(e){var t=e.spec,r=t.paths,n={};if(!r||t.$$normalized)return e;for(var a in r){var o,i=r[a];if(null!=i&&Gv(o=["object","function"]).call(o,Pf(i))){var s=i.parameters,l=function(e){var r,o=i[e];if(null==o||!Gv(r=["object","function"]).call(r,Pf(o)))return"continue";var l=HC(o,a,e);if(l){n[l]?n[l].push(o):n[l]=[o];var c=n[l];if(c.length>1)c.forEach((function(e,t){var r;e.p=e.p||e.operationId,e.operationId=Rb(r="".concat(l)).call(r,t+1)}));else if(void 0!==o.operationId){var p=c[0];p.p=p.p||o.operationId,p.operationId=l}}if("parameters"!==e){var d=[],u={};for(var h in t)"produces"!==h&&"consumes"!==h&&"security"!==h||(u[h]=t[h],d.push(u));if(s&&(u.parameters=s,d.push(u)),d.length){var f,m=Cf(d);try{for(m.s();!(f=m.n()).done;){var y=f.value;for(var g in y)if(o[g]){if("parameters"===g){var v,b=Cf(y[g]);try{var x=function(){var e=v.value;o[g].some((function(t){return t.name&&t.name===e.name||t.$ref&&t.$ref===e.$ref||t.$$ref&&t.$$ref===e.$$ref||t===e}))||o[g].push(e)};for(b.s();!(v=b.n()).done;)x()}catch(e){b.e(e)}finally{b.f()}}}else o[g]=y[g]}}catch(e){m.e(e)}finally{m.f()}}}};for(var c in i)l(c)}}return t.$$normalized=!0,e}function YC(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=t.requestInterceptor,n=t.responseInterceptor,a=e.withCredentials?"include":"same-origin";return function(t){return e({url:t,loadSpec:!0,requestInterceptor:r,responseInterceptor:n,headers:{Accept:"application/json, application/yaml"},credentials:a}).then((function(e){return e.body}))}}function ZC(e){var t=e.fetch,r=e.spec,n=e.url,a=e.mode,o=e.allowMetaPatches,i=void 0===o||o,s=e.pathDiscriminator,l=e.modelPropertyMacro,c=e.parameterMacro,p=e.requestInterceptor,d=e.responseInterceptor,u=e.skipNormalization,h=e.useCircularStructures,f=e.http,m=e.baseDoc;return m=m||n,f=t||f||$S,r?y(r):YC(f,{requestInterceptor:p,responseInterceptor:d})(m).then(y);function y(e){m&&(zC.refs.docCache[m]=e),zC.refs.fetchJSON=YC(f,{requestInterceptor:p,responseInterceptor:d});var t,r,n=[zC.refs];return"function"==typeof c&&n.push(zC.parameters),"function"==typeof l&&n.push(zC.properties),"strict"!==a&&n.push(zC.allOf),(t={spec:e,context:{baseDoc:m},plugins:n,allowMetaPatches:i,pathDiscriminator:s,parameterMacro:c,modelPropertyMacro:l,useCircularStructures:h},new qC(t).dispatch()).then(u?(r=jv(Pv.mark((function e(t){return Pv.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",t);case 1:case"end":return e.stop()}}),e)}))),function(e){return r.apply(this,arguments)}):JC)}}var QC=Array.isArray,XC="object"==typeof global&&global&&global.Object===Object&&global,ej="object"==typeof self&&self&&self.Object===Object&&self,tj=XC||ej||Function("return this")(),rj=tj.Symbol,nj=rj,aj=Object.prototype,oj=aj.hasOwnProperty,ij=aj.toString,sj=nj?nj.toStringTag:void 0,lj=Object.prototype.toString,cj=function(e){var t=oj.call(e,sj),r=e[sj];try{e[sj]=void 0;var n=!0}catch(e){}var a=ij.call(e);return n&&(t?e[sj]=r:delete e[sj]),a},pj=rj?rj.toStringTag:void 0,dj=function(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":pj&&pj in Object(e)?cj(e):function(e){return lj.call(e)}(e)},uj=dj,hj=function(e){return"symbol"==typeof e||function(e){return null!=e&&"object"==typeof e}(e)&&"[object Symbol]"==uj(e)},fj=QC,mj=hj,yj=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,gj=/^\w*$/,vj=function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)},bj=dj,xj=vj,wj=tj.i,$j=function(){var e=/[^.]+$/.exec(wj&&wj.keys&&wj.keys.IE_PROTO||"");return e?"Symbol(src)_1."+e:""}(),kj=Function.prototype.toString,Sj=function(e){if(!xj(e))return!1;var t=bj(e);return"[object Function]"==t||"[object GeneratorFunction]"==t||"[object AsyncFunction]"==t||"[object Proxy]"==t},Aj=function(e){return!!$j&&$j in e},Oj=vj,Ej=/^\[object .+?Constructor\]$/,Tj=Function.prototype,Cj=Object.prototype,jj=Tj.toString,_j=Cj.hasOwnProperty,Pj=RegExp("^"+jj.call(_j).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),Ij=function(e){return!(!Oj(e)||Aj(e))&&(Sj(e)?Pj:Ej).test(function(e){if(null!=e){try{return kj.call(e)}catch(e){}try{return e+""}catch(e){}}return""}(e))},Rj=function(e,t){var r=function(e,t){return null==e?void 0:e[t]}(e,t);return Ij(r)?r:void 0},Lj=Rj(Object,"create"),Dj=Lj,Fj=Lj,Nj=Object.prototype.hasOwnProperty,qj=Lj,zj=Object.prototype.hasOwnProperty,Uj=Lj,Bj=function(){this.v=Dj?Dj(null):{},this.size=0},Mj=function(e){var t=this.has(e)&&delete this.v[e];return this.size-=t?1:0,t},Hj=function(e){var t=this.v;if(Fj){var r=t[e];return"__lodash_hash_undefined__"===r?void 0:r}return Nj.call(t,e)?t[e]:void 0},Wj=function(e){var t=this.v;return qj?void 0!==t[e]:zj.call(t,e)},Vj=function(e,t){var r=this.v;return this.size+=this.has(e)?0:1,r[e]=Uj&&void 0===t?"__lodash_hash_undefined__":t,this};function Gj(e){var t=-1,r=null==e?0:e.length;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}Gj.prototype.clear=Bj,Gj.prototype.delete=Mj,Gj.prototype.get=Hj,Gj.prototype.has=Wj,Gj.prototype.set=Vj;var Kj=Gj,Jj=function(e,t){return e===t||e!=e&&t!=t},Yj=function(e,t){for(var r=e.length;r--;)if(Jj(e[r][0],t))return r;return-1},Zj=Yj,Qj=Array.prototype.splice,Xj=Yj,e_=Yj,t_=Yj,r_=function(){this.v=[],this.size=0},n_=function(e){var t=this.v,r=Zj(t,e);return!(r<0||(r==t.length-1?t.pop():Qj.call(t,r,1),--this.size,0))},a_=function(e){var t=this.v,r=Xj(t,e);return r<0?void 0:t[r][1]},o_=function(e,t){var r=this.v,n=t_(r,e);return n<0?(++this.size,r.push([e,t])):r[n][1]=t,this};function i_(e){var t=-1,r=null==e?0:e.length;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}i_.prototype.clear=r_,i_.prototype.delete=n_,i_.prototype.get=a_,i_.prototype.has=function(e){return e_(this.v,e)>-1},i_.prototype.set=o_;var s_=i_,l_=Rj(tj,"Map"),c_=Kj,p_=s_,d_=l_,u_=function(e){var t=typeof e;return"string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==e:null===e},h_=function(e,t){var r=e.v;return u_(t)?r["string"==typeof t?"string":"hash"]:r.map},f_=h_,m_=h_,y_=h_,g_=h_,v_=function(e,t){var r=g_(this,e),n=r.size;return r.set(e,t),this.size+=r.size==n?0:1,this};function b_(e){var t=-1,r=null==e?0:e.length;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}b_.prototype.clear=function(){this.size=0,this.v={hash:new c_,map:new(d_||p_),string:new c_}},b_.prototype.delete=function(e){var t=f_(this,e).delete(e);return this.size-=t?1:0,t},b_.prototype.get=function(e){return m_(this,e).get(e)},b_.prototype.has=function(e){return y_(this,e).has(e)},b_.prototype.set=v_;var x_=b_;function w_(e,t){if("function"!=typeof e||null!=t&&"function"!=typeof t)throw new TypeError("Expected a function");var r=function(){var n=arguments,a=t?t.apply(this,n):n[0],o=r.cache;if(o.has(a))return o.get(a);var i=e.apply(this,n);return r.cache=o.set(a,i)||o,i};return r.cache=new(w_.Cache||x_),r}w_.Cache=x_;var $_=w_,k_=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,S_=/\\(\\)?/g,A_=function(e){var t=$_((function(e){var t=[];return 46===e.charCodeAt(0)&&t.push(""),e.replace(k_,(function(e,r,n,a){t.push(n?a.replace(S_,"$1"):r||e)})),t}),(function(e){return 500===r.size&&r.clear(),e})),r=t.cache;return t}(),O_=A_,E_=function(e,t){for(var r=-1,n=null==e?0:e.length,a=Array(n);++r<n;)a[r]=t(e[r],r,e);return a},T_=QC,C_=hj,j_=rj?rj.prototype:void 0,__=j_?j_.toString:void 0,P_=function e(t){if("string"==typeof t)return t;if(T_(t))return E_(t,e)+"";if(C_(t))return __?__.call(t):"";var r=t+"";return"0"==r&&1/t==-1/0?"-0":r},I_=QC,R_=function(e,t){if(fj(e))return!1;var r=typeof e;return!("number"!=r&&"symbol"!=r&&"boolean"!=r&&null!=e&&!mj(e))||gj.test(e)||!yj.test(e)||null!=t&&e in Object(t)},L_=O_,D_=hj,F_=function(e,t){return I_(e)?e:R_(e,t)?[e]:L_(function(e){return null==e?"":P_(e)}(e))},N_=function(e){if("string"==typeof e||D_(e))return e;var t=e+"";return"0"==t&&1/e==-1/0?"-0":t},q_=function(e,t){for(var r=0,n=(t=F_(t,e)).length;null!=e&&r<n;)e=e[N_(t[r++])];return r&&r==n?e:void 0},z_=function(e,t,r){var n=null==e?void 0:q_(e,t);return void 0===n?r:n};function U_(){return U_=jv(Pv.mark((function e(t,r){var n,a,o,i,s,l,c,p,d,u,h,f,m=arguments;return Pv.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=m.length>2&&void 0!==m[2]?m[2]:{},a=n.returnEntireTree,o=n.baseDoc,i=n.requestInterceptor,s=n.responseInterceptor,l=n.parameterMacro,c=n.modelPropertyMacro,p=n.useCircularStructures,d={pathDiscriminator:r,baseDoc:o,requestInterceptor:i,responseInterceptor:s,parameterMacro:l,modelPropertyMacro:c,useCircularStructures:p},u=JC({spec:t}),h=u.spec,e.next=6,ZC(Td(Td({},d),{},{spec:h,allowMetaPatches:!0,skipNormalization:!0}));case 6:return f=e.sent,!a&&Array.isArray(r)&&r.length&&(f.spec=z_(f.spec,r)||null),e.abrupt("return",f);case 9:case"end":return e.stop()}}),e)}))),U_.apply(this,arguments)}var B_=function(){return null},M_=function(e){var t=e.spec,r=e.cb,n=void 0===r?B_:r,a=e.defaultTag,o=void 0===a?"default":a,i=e.v2OperationIdCompatibilityMode,s={},l={};return KC(t,(function(e){var r,a=e.pathName,c=e.method,p=e.operation;(p.tags?(r=p.tags,Array.isArray(r)?r:[r]):[o]).forEach((function(e){if("string"==typeof e){l[e]=l[e]||{};var r,o=l[e],d=HC(p,a,c,{v2OperationIdCompatibilityMode:i}),u=n({spec:t,pathName:a,method:c,operation:p,operationId:d});if(s[d])s[d]+=1,o[Rb(r="".concat(d)).call(r,s[d])]=u;else if(void 0!==o[d]){var h,f,m=s[d]||1;s[d]=m+1,o[Rb(h="".concat(d)).call(h,s[d])]=u;var y=o[d];delete o[d],o[Rb(f="".concat(d)).call(f,m)]=y}else o[d]=u}}))})),l},H_=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return function(t){var r=t.pathName,n=t.method,a=t.operationId;return function(t){var o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=e.requestInterceptor,s=e.responseInterceptor,l=e.userFetch;return e.execute(Td({spec:e.spec,requestInterceptor:i,responseInterceptor:s,userFetch:l,pathName:r,method:n,parameters:t,operationId:a},o))}}},W_=Ta,V_=Wa.indexOf,G_=Up,K_=Et([].indexOf),J_=!!K_&&1/K_([1],1,-0)<0,Y_=G_("indexOf");W_({target:"Array",proto:!0,forced:J_||!Y_},{indexOf:function(e){var t=arguments.length>1?arguments[1]:void 0;return J_?K_(this,e,t)||0:V_(this,e,t)}});var Z_=sc("Array").indexOf,Q_=pr,X_=Z_,eP=Array.prototype;const tP=ut({exports:{}}.exports=function(e){var t=e.indexOf;return e===eP||Q_(eP,e)&&t===eP.indexOf?X_:t});var rP=function(e,t,r){var n=r||{},a=n.encode||oP;if("function"!=typeof a)throw new TypeError("option encode is invalid");if(!aP.test(e))throw new TypeError("argument name is invalid");var o=a(t);if(o&&!aP.test(o))throw new TypeError("argument val is invalid");var i,s=e+"="+o;if(null!=n.maxAge){var l=n.maxAge-0;if(isNaN(l)||!isFinite(l))throw new TypeError("option maxAge is invalid");s+="; Max-Age="+Math.floor(l)}if(n.domain){if(!aP.test(n.domain))throw new TypeError("option domain is invalid");s+="; Domain="+n.domain}if(n.path){if(!aP.test(n.path))throw new TypeError("option path is invalid");s+="; Path="+n.path}if(n.expires){var c=n.expires;if(i=c,!("[object Date]"===nP.call(i)||i instanceof Date)||isNaN(c.valueOf()))throw new TypeError("option expires is invalid");s+="; Expires="+c.toUTCString()}if(n.httpOnly&&(s+="; HttpOnly"),n.secure&&(s+="; Secure"),n.priority)switch("string"==typeof n.priority?n.priority.toLowerCase():n.priority){case"low":s+="; Priority=Low";break;case"medium":s+="; Priority=Medium";break;case"high":s+="; Priority=High";break;default:throw new TypeError("option priority is invalid")}if(n.sameSite)switch("string"==typeof n.sameSite?n.sameSite.toLowerCase():n.sameSite){case!0:s+="; SameSite=Strict";break;case"lax":s+="; SameSite=Lax";break;case"strict":s+="; SameSite=Strict";break;case"none":s+="; SameSite=None";break;default:throw new TypeError("option sameSite is invalid")}return s},nP=Object.prototype.toString,aP=/^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;function oP(e){return encodeURIComponent(e)}function iP(e){return"[object Object]"===Object.prototype.toString.call(e)}function sP(e){var t,r;return!1!==iP(e)&&(void 0===(t=e.constructor)||!1!==iP(r=t.prototype)&&!1!==r.hasOwnProperty("isPrototypeOf"))}const lP={body:function(e){var t=e.req,r=e.value;t.body=r},header:function(e){var t=e.req,r=e.parameter,n=e.value;t.headers=t.headers||{},void 0!==n&&(t.headers[r.name]=n)},query:function(e){var t=e.req,r=e.value,n=e.parameter;if(t.query=t.query||{},!1===r&&"boolean"===n.type&&(r="false"),0===r&&["number","integer"].indexOf(n.type)>-1&&(r="0"),r)t.query[n.name]={collectionFormat:n.collectionFormat,value:r};else if(n.allowEmptyValue&&void 0!==r){var a=n.name;t.query[a]=t.query[a]||{},t.query[a].allowEmptyValue=!0}},path:function(e){var t=e.req,r=e.value,n=e.parameter;t.url=t.url.split("{".concat(n.name,"}")).join(encodeURIComponent(r))},formData:function(e){var t=e.req,r=e.value,n=e.parameter;(r||n.allowEmptyValue)&&(t.form=t.form||{},t.form[n.name]={value:r,allowEmptyValue:n.allowEmptyValue,collectionFormat:n.collectionFormat})}};function cP(e,t){return Gv(t).call(t,"application/json")?"string"==typeof e?e:$b(e):e.toString()}var pP=["accept","authorization","content-type"];const dP=Object.freeze(Object.defineProperty({__proto__:null,path:function(e){var t=e.req,r=e.value,n=e.parameter,a=n.name,o=n.style,i=n.explode,s=n.content;if(s){var l=Cb(s)[0];t.url=t.url.split("{".concat(a,"}")).join(vS(cP(r,l),{escape:!0}))}else{var c=bS({key:n.name,value:r,style:o||"simple",explode:i||!1,escape:!0});t.url=t.url.split("{".concat(a,"}")).join(c)}},query:function(e){var t=e.req,r=e.value,n=e.parameter;if(t.query=t.query||{},n.content){var a=Cb(n.content)[0];t.query[n.name]=cP(r,a)}else if(!1===r&&(r="false"),0===r&&(r="0"),r){var o=n.style,i=n.explode,s=n.allowReserved;t.query[n.name]={value:r,serializationOption:{style:o,explode:i,allowReserved:s}}}else if(n.allowEmptyValue&&void 0!==r){var l=n.name;t.query[l]=t.query[l]||{},t.query[l].allowEmptyValue=!0}},header:function(e){var t=e.req,r=e.parameter,n=e.value;if(t.headers=t.headers||{},!(pP.indexOf(r.name.toLowerCase())>-1))if(r.content){var a=Cb(r.content)[0];t.headers[r.name]=cP(n,a)}else void 0!==n&&(t.headers[r.name]=bS({key:r.name,value:n,style:r.style||"simple",explode:void 0!==r.explode&&r.explode,escape:!1}))},cookie:function(e){var t=e.req,r=e.parameter,n=e.value;t.headers=t.headers||{};var a=Pf(n);if(r.content){var o,i=Cb(r.content)[0];t.headers.Cookie=Rb(o="".concat(r.name,"=")).call(o,cP(n,i))}else if("undefined"!==a){var s="object"===a&&!Array.isArray(n)&&r.explode?"":"".concat(r.name,"=");t.headers.Cookie=s+bS({key:r.name,value:n,escape:!1,style:r.style||"form",explode:void 0!==r.explode&&r.explode})}}},Symbol.toStringTag,{value:"Module"}));Ta({global:!0},{globalThis:ft});const uP=ut({exports:{}}.exports={exports:{}}.exports=ft);var hP=(void 0!==uP?uP:"undefined"!=typeof self?self:window).btoa;var fP=["http","fetch","spec","operationId","pathName","method","parameters","securities"],mP=function(e){return Array.isArray(e)?e:[]},yP=QT("OperationNotFoundError",(function(e,t,r){this.originalError=r,Hd(this,t||{})})),gP={buildRequest:vP};function vP(e){var t,r,n=e.spec,a=e.operationId,o=e.responseContentType,i=e.scheme,s=e.requestInterceptor,l=e.responseInterceptor,c=e.contextUrl,p=e.userFetch,d=e.server,u=e.serverVariables,h=e.http,f=e.signal,m=e.parameters,y=e.parameterBuilders,g=MC(n);y||(y=g?dP:lP);var v={url:"",credentials:h&&h.withCredentials?"include":"same-origin",headers:{},cookies:{}};f&&(v.signal=f),s&&(v.requestInterceptor=s),l&&(v.responseInterceptor=l),p&&(v.userFetch=p);var b=GC(n,a);if(!b)throw new yP("Operation ".concat(a," not found"));var x=b.operation,w=void 0===x?{}:x,$=b.method,k=b.pathName;if(v.url+=xP({spec:n,scheme:i,contextUrl:c,server:d,serverVariables:u,pathName:k,method:$}),!a)return delete v.cookies,v;v.url+=k,v.method="".concat($).toUpperCase(),m=m||{};var S=n.paths[k]||{};o&&(v.headers.accept=o);var A=function(e){var t={};e.forEach((function(e){t[e.in]||(t[e.in]={}),t[e.in][e.name]=e}));var r=[];return Cb(t).forEach((function(e){Cb(t[e]).forEach((function(n){r.push(t[e][n])}))})),r}(Rb(t=Rb(r=[]).call(r,mP(w.parameters))).call(t,mP(S.parameters)));A.forEach((function(e){var t,r,a,o,i=y[e.in];if("body"===e.in&&e.schema&&e.schema.properties&&(t=m),void 0===(t=e&&e.name&&m[e.name]))t=e&&e.name&&m[Rb(r="".concat(e.in,".")).call(r,e.name)];else if((a=e.name,o=A,Wb(o).call(o,(function(e){return e.name===a}))).length>1){var s;console.warn(Rb(s="Parameter '".concat(e.name,"' is ambiguous because the defined spec has more than one parameter with the name: '")).call(s,e.name,"' and the passed-in parameter values did not define an 'in' value."))}if(null!==t){if(void 0!==e.default&&void 0===t&&(t=e.default),void 0===t&&e.required&&!e.allowEmptyValue)throw new Error("Required parameter ".concat(e.name," is not provided"));if(g&&e.schema&&"object"===e.schema.type&&"string"==typeof t)try{t=JSON.parse(t)}catch(a){throw new Error("Could not parse object parameter value string as JSON")}i&&i({req:v,parameter:e,value:t,operation:w,spec:n})}}));var O=Td(Td({},e),{},{operation:w});if((v=g?function(e,t){var r,n,a,o,i,s,l,c,p,d,u,h,f,m=e.operation,y=e.requestBody,g=e.securities,v=e.spec,b=e.attachContentTypeForEmptyPayload,x=e.requestContentType;o=void 0===(a=(r={request:t,securities:g,operation:m,spec:v}).securities)?{}:a,s=void 0===(i=r.operation)?{}:i,l=r.spec,c=Td({},n=r.request),p=o.authorized,d=void 0===p?{}:p,u=s.security||l.security||[],h=d&&!!Cb(d).length,f=z_(l,["components","securitySchemes"])||{},c.headers=c.headers||{},c.query=c.query||{},t=Cb(o).length&&h&&u&&(!Array.isArray(s.security)||s.security.length)?(u.forEach((function(e){Cb(e).forEach((function(e){var t=d[e],r=f[e];if(t){var n=t.value||t,a=r.type;if(t)if("apiKey"===a)"query"===r.in&&(c.query[r.name]=n),"header"===r.in&&(c.headers[r.name]=n),"cookie"===r.in&&(c.cookies[r.name]=n);else if("http"===a){if(/^basic$/i.test(r.scheme)){var o,i=n.username||"",s=n.password||"",l=hP(Rb(o="".concat(i,":")).call(o,s));c.headers.Authorization="Basic ".concat(l)}/^bearer$/i.test(r.scheme)&&(c.headers.Authorization="Bearer ".concat(n))}else if("oauth2"===a||"openIdConnect"===a){var p,u=t.token||{},h=u[r["x-tokenName"]||"access_token"],m=u.token_type;m&&"bearer"!==m.toLowerCase()||(m="Bearer"),c.headers.Authorization=Rb(p="".concat(m," ")).call(p,h)}}}))})),c):n;var w=m.requestBody||{},$=Cb(w.content||{}),k=x&&$.indexOf(x)>-1;if(y||b){if(x&&k)t.headers["Content-Type"]=x;else if(!x){var S=$[0];S&&(t.headers["Content-Type"]=S,x=S)}}else x&&k&&(t.headers["Content-Type"]=x);if(!e.responseContentType&&m.responses){var A,O=Wb(A=Hb(m.responses)).call(A,(function(e){var t=If(e,2),r=t[0],n=t[1],a=parseInt(r,10);return a>=200&&a<300&&sP(n.content)})).reduce((function(e,t){var r=If(t,2)[1];return Rb(e).call(e,Cb(r.content))}),[]);O.length>0&&(t.headers.accept=O.join(", "))}if(y)if(x){if($.indexOf(x)>-1)if("application/x-www-form-urlencoded"===x||"multipart/form-data"===x)if("object"===Pf(y)){var E=(w.content[x]||{}).encoding||{};t.form={},Cb(y).forEach((function(e){t.form[e]={value:y[e],encoding:E[e]||{}}}))}else t.form=y;else t.body=y}else t.body=y;return t}(O,v):function(e,t){var r,n,a,o,i,s,l,c,p,d,u,h,f,m,y,g,v,b=e.spec,x=e.operation,w=e.securities,$=e.requestContentType,k=e.responseContentType,S=e.attachContentTypeForEmptyPayload;if(s=void 0===(i=(a={request:t,securities:w,operation:x,spec:b}).securities)?{}:i,c=void 0===(l=a.operation)?{}:l,p=a.spec,d=Td({},o=a.request),u=s.authorized,h=void 0===u?{}:u,f=s.specSecurity,m=void 0===f?[]:f,y=c.security||m,g=h&&!!Cb(h).length,v=p.securityDefinitions,d.headers=d.headers||{},d.query=d.query||{},(t=Cb(s).length&&g&&y&&(!Array.isArray(c.security)||c.security.length)?(y.forEach((function(e){Cb(e).forEach((function(e){var t=h[e];if(t){var r=t.token,n=t.value||t,a=v[e],o=a.type,i=a["x-tokenName"]||"access_token",s=r&&r[i],l=r&&r.token_type;if(t)if("apiKey"===o){var c="query"===a.in?"query":"headers";d[c]=d[c]||{},d[c][a.name]=n}else if("basic"===o)if(n.header)d.headers.authorization=n.header;else{var p,u=n.username||"",f=n.password||"";n.base64=hP(Rb(p="".concat(u,":")).call(p,f)),d.headers.authorization="Basic ".concat(n.base64)}else if("oauth2"===o&&s){var m;l=l&&"bearer"!==l.toLowerCase()?l:"Bearer",d.headers.authorization=Rb(m="".concat(l," ")).call(m,s)}}}))})),d):o).body||t.form||S)if($)t.headers["Content-Type"]=$;else if(Array.isArray(x.consumes)){var A=If(x.consumes,1);t.headers["Content-Type"]=A[0]}else if(Array.isArray(b.consumes)){var O=If(b.consumes,1);t.headers["Content-Type"]=O[0]}else x.parameters&&Wb(r=x.parameters).call(r,(function(e){return"file"===e.type})).length?t.headers["Content-Type"]="multipart/form-data":x.parameters&&Wb(n=x.parameters).call(n,(function(e){return"formData"===e.in})).length&&(t.headers["Content-Type"]="application/x-www-form-urlencoded");else if($){var E,T,C=x.parameters&&Wb(E=x.parameters).call(E,(function(e){return"body"===e.in})).length>0,j=x.parameters&&Wb(T=x.parameters).call(T,(function(e){return"formData"===e.in})).length>0;(C||j)&&(t.headers["Content-Type"]=$)}return!k&&Array.isArray(x.produces)&&x.produces.length>0&&(t.headers.accept=x.produces.join(", ")),t}(O,v)).cookies&&Cb(v.cookies).length){var E=Cb(v.cookies).reduce((function(e,t){var r=v.cookies[t];return e+(e?"&":"")+rP(t,r)}),"");v.headers.Cookie=E}return v.cookies&&delete v.cookies,FS(v),v}var bP=function(e){return e?e.replace(/\W/g,""):null};function xP(e){return MC(e.spec)?function(e){var t=e.spec,r=e.pathName,n=e.method,a=e.server,o=e.contextUrl,i=e.serverVariables,s=void 0===i?{}:i,l=z_(t,["paths",r,(n||"").toLowerCase(),"servers"])||z_(t,["paths",r,"servers"])||z_(t,["servers"]),c="",p=null;if(a&&l&&l.length){var d=Tb(l).call(l,(function(e){return e.url}));d.indexOf(a)>-1&&(c=a,p=l[d.indexOf(a)])}if(!c&&l&&l.length){c=l[0].url;var u=If(l,1);p=u[0]}c.indexOf("{")>-1&&function(e){for(var t,r=[],n=/{([^}]+)}/g;t=n.exec(e);)r.push(t[1]);return r}(c).forEach((function(e){if(p.variables&&p.variables[e]){var t=p.variables[e],r=s[e]||t.default,n=new RegExp("{".concat(e,"}"),"g");c=c.replace(n,r)}}));return function(){var e,t,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",a=r&&n?hu.parse(hu.resolve(n,r)):hu.parse(r),o=hu.parse(n),i=bP(a.protocol)||bP(o.protocol)||"",s=a.host||o.host,l=a.pathname||"";return"/"===(e=i&&s?Rb(t="".concat(i,"://")).call(t,s+l):l)[e.length-1]?mS(e).call(e,0,-1):e}(c,o)}(e):function(e){var t,r,n=e.spec,a=e.scheme,o=e.contextUrl,i=void 0===o?"":o,s=hu.parse(i),l=Array.isArray(n.schemes)?n.schemes[0]:null,c=a||l||bP(s.protocol)||"http",p=n.host||s.host||"",d=n.basePath||"";return"/"===(t=c&&p?Rb(r="".concat(c,"://")).call(r,p+d):d)[t.length-1]?mS(t).call(t,0,-1):t}(e)}function wP(e){var t=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if("string"==typeof e?r.url=e:r=e,!(this instanceof wP))return new wP(r);Hd(this,r);var n=this.resolve().then((function(){return t.disableInterfaces||Hd(t,wP.makeApisTagOperation(t)),t}));return n.client=this,n}function $P(e){const t=(e=e.replace("[]","Array")).split("/");return t[0]=t[0].replace(/[^A-Za-z0-9_\-\.]+|\s+/gm,"_"),t.join("/")}wP.http=$S,wP.makeHttp=function(e,t,r){return r=r||function(e){return e},t=t||function(e){return e},function(n){return"string"==typeof n&&(n={url:n}),wS.mergeInQueryOrForm(n),n=t(n),r(e(n))}}.bind(null,wP.http),wP.resolve=ZC,wP.resolveSubtree=function(e,t){return U_.apply(this,arguments)},wP.execute=function(e){var t=e.http,r=e.fetch,n=e.spec,a=e.operationId,o=e.pathName,i=e.method,s=e.parameters,l=e.securities,c=function(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=io(e);for(n=0;n<o.length;n++)r=o[n],tP(t).call(t,r)>=0||(a[r]=e[r]);return a}(e,t);if(ec){var o=ec(e);for(n=0;n<o.length;n++)r=o[n],tP(t).call(t,r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}(e,fP),p=t||r||$S;o&&i&&!a&&(a=VC(o,i));var d=gP.buildRequest(Td({spec:n,operationId:a,parameters:s,securities:l,http:p},c));return d.body&&(sP(d.body)||Array.isArray(d.body))&&(d.body=$b(d.body)),p(d)},wP.serializeRes=OS,wP.serializeHeaders=TS,wP.clearCache=function(){zC.refs.clearCache()},wP.makeApisTagOperation=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=H_(e);return{apis:M_({v2OperationIdCompatibilityMode:e.v2OperationIdCompatibilityMode,spec:e.spec,cb:t})}},wP.buildRequest=vP,wP.helpers={opId:HC},wP.getBaseUrl=xP,wP.prototype={http:$S,execute:function(e){return this.applyDefaults(),wP.execute(Td({spec:this.spec,http:this.http,securities:{authorized:this.authorizations},contextUrl:"string"==typeof this.url?this.url:void 0,requestInterceptor:this.requestInterceptor||null,responseInterceptor:this.responseInterceptor||null},e))},resolve:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return wP.resolve(Td({spec:this.spec,url:this.url,http:this.http||this.fetch,allowMetaPatches:this.allowMetaPatches,useCircularStructures:this.useCircularStructures,requestInterceptor:this.requestInterceptor||null,responseInterceptor:this.responseInterceptor||null,skipNormalization:this.skipNormalization||!1},t)).then((function(t){return e.originalSpec=e.spec,e.spec=t.spec,e.errors=t.errors,e}))}},wP.prototype.applyDefaults=function(){var e=this.spec,t=this.url;if(t&&uu(t).call(t,"http")){var r=hu.parse(t);e.host||(e.host=r.host),e.schemes||(e.schemes=[r.protocol.replace(":","")]),e.basePath||(e.basePath="/")}},wP.helpers;const kP={parameterTypeProperties:["format","minimum","maximum","exclusiveMinimum","exclusiveMaximum","minLength","maxLength","multipleOf","minItems","maxItems","uniqueItems","minProperties","maxProperties","additionalProperties","pattern","enum","default"],arrayProperties:["items","minItems","maxItems","uniqueItems"],httpMethods:["get","post","put","delete","patch","head","options","trace"],uniqueOnly:function(e,t,r){return r.indexOf(e)===t},createHash:function(e){let t,r=0;if(0===e.length)return r;for(let n=0;n<e.length;n++)t=e.charCodeAt(n),r=(r<<5)-r+t,r|=0;return r},sanitise:$P,sanitiseAll:function(e){return $P(e.split("/").join("_"))},camelize:function(e){return e.toLowerCase().replace(/[-_ \/\.](.)/g,((e,t)=>t.toUpperCase()))},clone:function(e){return JSON.parse(JSON.stringify(e))},circularClone:function e(t,r=null){if(r||(r=new WeakMap),Object(t)!==t||t instanceof Function)return t;if(r.has(t))return r.get(t);let n;try{n=new t.constructor}catch(e){n=Object.create(Object.getPrototypeOf(t))}return r.set(t,n),Object.assign(n,...Object.keys(t).map((n=>({[n]:e(t[n],r)}))))}};function SP(){return{depth:0,seen:new WeakMap,top:!0,combine:!1,allowRefSiblings:!1}}const AP=function e(t,r,n,a){if(void 0===n.depth&&(n=SP()),null==t)return t;if(n.combine&&(t.allOf&&Array.isArray(t.allOf)&&1===t.allOf.length&&delete(t={...t.allOf[0],...t})?.allOf,t?.anyOf&&Array.isArray(t.anyOf)&&1===t.anyOf.length&&delete(t={...t.anyOf[0],...t})?.anyOf,t?.oneOf&&Array.isArray(t.oneOf)&&1===t.oneOf.length&&delete(t={...t.oneOf[0],...t})?.oneOf),a(t,r,n),n.seen.has(t))return t;if("object"==typeof t&&null!==t&&n.seen.set(t,!0),n.top=!1,n.depth++,void 0!==t?.items&&(n.property="items",e(t.items,t,n,a)),t?.additionalItems&&"object"==typeof t.additionalItems&&(n.property="additionalItems",e(t.additionalItems,t,n,a)),t?.additionalProperties&&"object"==typeof t.additionalProperties&&(n.property="additionalProperties",e(t.additionalProperties,t,n,a)),t?.properties)for(const r in t.properties){const o=t.properties[r];n.property=`properties/${r}`,e(o,t,n,a)}if(t?.patternProperties)for(const r in t.patternProperties){const o=t.patternProperties[r];n.property=`patternProperties/${r}`,e(o,t,n,a)}if(t?.allOf)for(const r in t.allOf){const o=t.allOf[r];n.property=`allOf/${r}`,e(o,t,n,a)}if(t?.anyOf)for(const r in t.anyOf){const o=t.anyOf[r];n.property=`anyOf/${r}`,e(o,t,n,a)}if(t?.oneOf)for(const r in t.oneOf){const o=t.oneOf[r];n.property=`oneOf/${r}`,e(o,t,n,a)}return t?.not&&(n.property="not",e(t.not,t,n,a)),n.depth--,t};function OP(e,t,r){if(t||(t={depth:0}),t.depth||(t={path:"#",depth:0,pkey:"",parent:{},payload:{},seen:new WeakMap,identity:!1,identityDetection:!1,...t}),"object"!=typeof e)return;const n=t.path;for(const a in e){if(t.key=a,t.path=`${t.path}/${encodeURIComponent(a)}`,t.identityPath=t.seen.get(e[a]),t.identity=void 0!==t.identityPath,e.hasOwnProperty(a)&&r(e,a,t),"object"==typeof e[a]&&!t.identity){t.identityDetection&&!Array.isArray(e[a])&&null!==e[a]&&t.seen.set(e[a],t.path);const n={};n.parent=e,n.path=t.path,n.depth=t.depth?t.depth+1:1,n.pkey=a,n.payload=t.payload,n.seen=t.seen,n.identity=!1,n.identityDetection=t.identityDetection,OP(e[a],n,r)}t.path=n}}let EP;function TP(e,t){for(const r in e)r.startsWith("x-")&&!r.startsWith("x-s2o")&&(t[r]=e[r])}function CP(e,t){AP(e,{},{},((e,r)=>{!function(e){if(e["x-required"]&&Array.isArray(e["x-required"])&&(e.required||(e.required=[]),e.required=e.required.concat(e["x-required"]),delete e["x-required"]),e["x-anyOf"]&&(e.anyOf=e["x-anyOf"],delete e["x-anyOf"]),e["x-oneOf"]&&(e.oneOf=e["x-oneOf"],delete e["x-oneOf"]),e["x-not"]&&(e.not=e["x-not"],delete e["x-not"]),"boolean"==typeof e["x-nullable"]&&(e.nullable=e["x-nullable"],delete e["x-nullable"]),"object"==typeof e["x-discriminator"]&&"string"==typeof e["x-discriminator"].propertyName){e.discriminator=e["x-discriminator"],delete e["x-discriminator"];for(const t in e.discriminator.mapping){const r=e.discriminator.mapping[t];r.startsWith("#/definitions/")&&(e.discriminator.mapping[t]=r.replace("#/definitions/","#/components/schemas/"))}}}(e),function(e,t,r){if(e.nullable&&r.patches++,e.discriminator&&"string"==typeof e.discriminator&&(e.discriminator={propertyName:e.discriminator}),e.items&&Array.isArray(e.items)&&(0===e.items.length?e.items={}:1===e.items.length?e.items=e.items[0]:e.items={anyOf:e.items}),e.type&&Array.isArray(e.type)){if(r.patches++,r.warnings.push("(Patchable) schema type must not be an array"),0===e.type.length)delete e.type;else{e.oneOf||(e.oneOf=[]);for(const t of e.type){const r={};if("null"===t)e.nullable=!0;else{r.type=t;for(const t of kP.arrayProperties)void 0!==e.prop&&(r[t]=e[t],delete e[t])}r.type&&e.oneOf.push(r)}delete e.type,0===e.oneOf.length?delete e.oneOf:e.oneOf.length<2&&(e.type=e.oneOf[0].type,Object.keys(e.oneOf[0]).length>1&&(r.patches++,r.warnings.push("Lost properties from oneOf")),delete e.oneOf)}e.type&&Array.isArray(e.type)&&1===e.type.length&&(e.type=e.type[0])}e.type&&"null"===e.type&&(delete e.type,e.nullable=!0),"array"!==e.type||e.items||(e.items={}),"file"===e.type&&(e.type="string",e.format="binary"),"boolean"==typeof e.required&&(e.required&&e.name&&(void 0===t.required&&(t.required=[]),Array.isArray(t.required)&&t.required.push(e.name)),delete e.required),e.xml&&"string"==typeof e.xml.namespace&&(e.xml.namespace||delete e.xml.namespace),e.allowEmptyValue&&(delete e.allowEmptyValue,r.patches++,r.warnings.push("(Patchable): deleted schema.allowEmptyValue"))}(e,r,t)}))}function jP(e){for(const t in e)for(const r in e[t]){const n=kP.sanitise(r);r!==n&&(e[t][n]=e[t][r],delete e[t][r])}}function _P(e,t){if("basic"===e.type&&(e.type="http",e.scheme="basic"),"oauth2"===e.type){const r={};let n=e.flow;"application"===e.flow&&(n="clientCredentials"),"accessCode"===e.flow&&(n="authorizationCode"),"string"==typeof e.authorizationUrl&&(r.authorizationUrl=e.authorizationUrl.split("?")[0].trim()||"/"),"string"==typeof e.tokenUrl&&(r.tokenUrl=e.tokenUrl.split("?")[0].trim()||"/"),r.scopes=e.scopes||{},e.flows={},e.flows[n]=r,delete e.flow,delete e.authorizationUrl,delete e.tokenUrl,delete e.scopes,e.name&&(delete e.name,t.patches++,t.warnings.push("(Patchable) oauth2 securitySchemes should not have name property"))}}function PP(e){return e&&!e["x-s2o-delete"]}function IP(e,t){if(e.type&&!e.schema&&(e.schema={}),e.type&&(e.schema.type=e.type),e.items&&"array"!==e.items.type){if(e.items.collectionFormat!==e.collectionFormat)return t.errCount++,void t.errors.push({message:"Nested collectionFormats are not supported",pointer:"/.../responses/header"});delete e.items.collectionFormat}"array"===e.type?("ssv"===e.collectionFormat?(t.patches++,t.warnings.push("collectionFormat:ssv is no longer supported for headers")):"pipes"===e.collectionFormat?(t.patches++,t.warnings.push("collectionFormat:pipes is no longer supported for headers")):"multi"===e.collectionFormat?e.explode=!0:"tsv"===e.collectionFormat?(e["x-collectionFormat"]="tsv",t.patches++,t.warnings.push("collectionFormat:tsv is no longer supported")):e.style="simple",delete e.collectionFormat):e.collectionFormat&&(delete e.collectionFormat,t.patches++,t.warnings.push("(Patchable) collectionFormat is only applicable to header.type array")),delete e.type;for(const t of kP.parameterTypeProperties)void 0!==e[t]&&(e.schema[t]=e[t],delete e[t]);for(const t of kP.arrayProperties)void 0!==e[t]&&(e.schema[t]=e[t],delete e[t])}function RP(e,t,r,n,a,o,i){const s={};let l,c=!0;t&&t.consumes&&"string"==typeof t.consumes&&(t.consumes=[t.consumes],i.patches++,i.warnings.push("(Patchable) operation.consumes must be an array")),Array.isArray(o.consumes)||delete o.consumes;const p=((t?t.consumes:null)||o.consumes||[]).filter(kP.uniqueOnly);if(e&&(e.name||e.in)){"boolean"==typeof e["x-deprecated"]&&(e.deprecated=e["x-deprecated"],delete e["x-deprecated"]),void 0!==e["x-example"]&&(e.example=e["x-example"],delete e["x-example"]),"body"===e.in||e.type||(e.type="string",i.patches++,i.warnings.push("(Patchable) parameter.type is mandatory for non-body parameters")),"file"===e.type&&(e["x-s2o-originalType"]=e.type,l=e.type),null===e.description&&delete e.description;let t=e.collectionFormat;if("array"!==e.type||t||(t="csv"),t&&("array"!==e.type&&(delete e.collectionFormat,i.patches++,i.warnings.push("(Patchable) collectionFormat is only applicable to param.type array")),"csv"!==t||"query"!==e.in&&"cookie"!==e.in||(e.style="form",e.explode=!1),"csv"!==t||"path"!==e.in&&"header"!==e.in||(e.style="simple"),"ssv"===t&&("query"===e.in?e.style="spaceDelimited":i.warnings.push(`${e.name} collectionFormat:ssv is no longer supported except for in:query parameters`)),"pipes"===t&&("query"===e.in?e.style="pipeDelimited":i.warnings.push(`${e.name} collectionFormat:pipes is no longer supported except for in:query parameters`)),"multi"===t&&(e.explode=!0),"tsv"===t&&(i.warnings.push("collectionFormat:tsv is no longer supported"),e["x-collectionFormat"]="tsv"),delete e.collectionFormat),e.type&&"body"!==e.type&&"formData"!==e.in)if(e.items&&e.schema)i.warnings.push(`${e.name} parameter has array,items and schema`);else{e.schema&&i.patches++,e.schema&&"object"==typeof e.schema||(e.schema={}),e.schema.type=e.type,e.items&&(e.schema.items=e.items,delete e.items,OP(e.schema.items,null,((r,n)=>{"collectionFormat"===n&&"string"==typeof r[n]&&(t&&r[n]!==t&&i.warnings.push(`${e.name} Nested collectionFormats are not supported`),delete r[n])})));for(const t of kP.parameterTypeProperties)void 0!==e[t]&&(e.schema[t]=e[t]),delete e[t]}e.schema&&CP(e.schema,i),e["x-ms-skip-url-encoding"]&&"query"===e.in&&(e.allowReserved=!0,delete e["x-ms-skip-url-encoding"])}if(e&&"formData"===e.in){c=!1,s.content={};let t="application/x-www-form-urlencoded";if(p.length&&p.indexOf("multipart/form-data")>=0&&(t="multipart/form-data"),s.content[t]={},e.schema)s.content[t].schema=e.schema;else{s.content[t].schema={},s.content[t].schema.type="object",s.content[t].schema.properties={},s.content[t].schema.properties[e.name]={};const r=s.content[t].schema,n=s.content[t].schema.properties[e.name];e.description&&(n.description=e.description),e.example&&(n.example=e.example),e.type&&(n.type=e.type);for(const t of kP.parameterTypeProperties)void 0!==e[t]&&(n[t]=e[t]);!0===e.required&&(r.required||(r.required=[]),r.required.push(e.name),s.required=!0),void 0!==e.default&&(n.default=e.default),n.properties&&(n.properties=e.properties),e.allOf&&(n.allOf=e.allOf),"array"===e.type&&e.items&&(n.items=e.items,n.items.collectionFormat&&delete n.items.collectionFormat),"file"!==l&&"file"!==e["x-s2o-originalType"]||(n.type="string",n.format="binary"),TP(e,n)}}else e&&"file"===e.type&&(e.required&&(s.required=e.required),s.content={},s.content["application/octet-stream"]={},s.content["application/octet-stream"].schema={},s.content["application/octet-stream"].schema.type="string",s.content["application/octet-stream"].schema.format="binary",TP(e,s));if(e&&"body"===e.in){s.content={},e.name&&(s["x-s2o-name"]=(t&&t.operationId?kP.sanitiseAll(t.operationId):"")+kP.camelize(`_${e.name}`)),e.description&&(s.description=e.description),e.required&&(s.required=e.required),p.length||p.push("application/json");for(const t of p)s.content[t]={},s.content[t].schema=kP.clone(e.schema||{}),CP(s.content[t].schema,i);TP(e,s)}if(Object.keys(s).length>0&&(e["x-s2o-delete"]=!0,t))if(t.requestBody&&c){t.requestBody["x-s2o-overloaded"]=!0;const e=t.operationId||a;i.warnings.push(`Operation ${e} has multiple requestBodies`)}else t.requestBody||(t=function(e,t){const r={};for(const n of Object.keys(e))r[n]=e[n],"parameters"===n&&(r.requestBody={},t.rbname&&(r[t.rbname]=""));return r.requestBody={},r}(t,i),r[n]=t),t.requestBody.content&&t.requestBody.content["multipart/form-data"]&&t.requestBody.content["multipart/form-data"].schema&&t.requestBody.content["multipart/form-data"].schema.properties&&s.content["multipart/form-data"]&&s.content["multipart/form-data"].schema&&s.content["multipart/form-data"].schema.properties?(t.requestBody.content["multipart/form-data"].schema.properties=Object.assign(t.requestBody.content["multipart/form-data"].schema.properties,s.content["multipart/form-data"].schema.properties),t.requestBody.content["multipart/form-data"].schema.required=(t.requestBody.content["multipart/form-data"].schema.required||[]).concat(s.content["multipart/form-data"].schema.required||[]),t.requestBody.content["multipart/form-data"].schema.required.length||delete t.requestBody.content["multipart/form-data"].schema.required):t.requestBody.content&&t.requestBody.content["application/x-www-form-urlencoded"]&&t.requestBody.content["application/x-www-form-urlencoded"].schema&&t.requestBody.content["application/x-www-form-urlencoded"].schema.properties&&s.content["application/x-www-form-urlencoded"]&&s.content["application/x-www-form-urlencoded"].schema&&s.content["application/x-www-form-urlencoded"].schema.properties?(t.requestBody.content["application/x-www-form-urlencoded"].schema.properties=Object.assign(t.requestBody.content["application/x-www-form-urlencoded"].schema.properties,s.content["application/x-www-form-urlencoded"].schema.properties),t.requestBody.content["application/x-www-form-urlencoded"].schema.required=(t.requestBody.content["application/x-www-form-urlencoded"].schema.required||[]).concat(s.content["application/x-www-form-urlencoded"].schema.required||[]),t.requestBody.content["application/x-www-form-urlencoded"].schema.required.length||delete t.requestBody.content["application/x-www-form-urlencoded"].schema.required):(t.requestBody=Object.assign(t.requestBody,s),t.requestBody["x-s2o-name"]||t.operationId&&(t.requestBody["x-s2o-name"]=kP.sanitiseAll(t.operationId)));if(e&&!e["x-s2o-delete"]){delete e.type;for(const t of kP.parameterTypeProperties)delete e[t];"path"!==e.in||void 0!==e.required&&!0===e.required||(e.required=!0,i.patches++,i.warnings.push(`(Patchable) path parameters must be required:true [${e.name} in ${a}]`))}return t}function LP(e,t,r,n){if(!e)return!1;if(e.description||"object"!=typeof e||Array.isArray(e)||(n.patches++,n.warnings.push("(Patchable) response.description is mandatory")),void 0!==e.schema){CP(e.schema,n),t&&t.produces&&"string"==typeof t.produces&&(t.produces=[t.produces],n.patches++,n.warnings.push("(Patchable) operation.produces must be an array")),r.produces&&!Array.isArray(r.produces)&&delete r.produces;const a=((t?t.produces:null)||r.produces||[]).filter(kP.uniqueOnly);a.length||a.push("*/*"),e.content={};for(const t of a){if(e.content[t]={},e.content[t].schema=kP.clone(e.schema),e.examples&&e.examples[t]){const r={};r.value=e.examples[t],e.content[t].examples={},e.content[t].examples.response=r,delete e.examples[t]}"file"===e.content[t].schema.type&&(e.content[t].schema={type:"string",format:"binary"})}delete e.schema}for(const t in e.examples)e.content||(e.content={}),e.content[t]||(e.content[t]={}),e.content[t].examples={},e.content[t].examples.response={},e.content[t].examples.response.value=e.examples[t];if(delete e.examples,e.headers)for(const t in e.headers)"status code"===t.toLowerCase()?(delete e.headers[t],n.patches++,n.warnings.push('(Patchable) "Status Code" is not a valid header')):IP(e.headers[t],n)}function DP(e,t,r,n,a){for(const o in e){const i=e[o];i&&i["x-trace"]&&"object"==typeof i["x-trace"]&&(i.trace=i["x-trace"],delete i["x-trace"]),i&&i["x-summary"]&&"string"==typeof i["x-summary"]&&(i.summary=i["x-summary"],delete i["x-summary"]),i&&i["x-description"]&&"string"==typeof i["x-description"]&&(i.description=i["x-description"],delete i["x-description"]),i&&i["x-servers"]&&Array.isArray(i["x-servers"])&&(i.servers=i["x-servers"],delete i["x-servers"]);for(const e in i)if(kP.httpMethods.indexOf(e)>=0||"x-amazon-apigateway-any-method"===e){let s=i[e];if(s&&s.parameters&&Array.isArray(s.parameters)){if(i.parameters)for(const t of i.parameters)s.parameters.find((e=>e.name===t.name&&e.in===t.in))||"formData"!==t.in&&"body"!==t.in&&"file"!==t.type||(s=RP(t,s,i,e,o,a,r));for(const t of s.parameters)s=RP(t,s,i,e,`${e}: ${o}`,a,r);s.parameters&&(s.parameters=s.parameters.filter(PP))}if(s&&s.security&&jP(s.security),"object"==typeof s){if(!s.responses){const e={description:"Default response"};s.responses={default:e}}for(const e in s.responses)LP(s.responses[e],s,a,r)}if(s&&s["x-servers"]&&Array.isArray(s["x-servers"]))s.servers=s["x-servers"],delete s["x-servers"];else if(s&&s.schemes&&s.schemes.length)for(const e of s.schemes)if((!a.schemes||a.schemes.indexOf(e)<0)&&(s.servers||(s.servers=[]),Array.isArray(a.servers)))for(const e of a.servers){const t=kP.clone(e);s.servers.push(t)}if(s){if(delete s.consumes,delete s.produces,delete s.schemes,s["x-ms-examples"]){for(const e in s["x-ms-examples"]){const t=s["x-ms-examples"][e],r=kP.sanitiseAll(e);if(t.parameters)for(const r in t.parameters){const n=t.parameters[r];for(const t of(s.parameters||[]).concat(i.parameters||[]))t.name!==r||t.example||(t.examples||(t.examples={}),t.examples[e]={value:n})}if(t.responses)for(const n in t.responses){if(t.responses[n].headers)for(const e in t.responses[n].headers){const r=t.responses[n].headers[e];for(const t in s.responses[n].headers)t===e&&(s.responses[n].headers[t].example=r)}if(t.responses[n].body&&(a.components.examples[r]={value:kP.clone(t.responses[n].body)},s.responses[n]&&s.responses[n].content))for(const t in s.responses[n].content){const a=s.responses[n].content[t];a.examples||(a.examples={}),a.examples[e]={$ref:`#/components/examples/${r}`}}}}delete s["x-ms-examples"]}if(s.parameters&&0===s.parameters.length&&delete s.parameters,s.requestBody){const r=s.operationId?kP.sanitiseAll(s.operationId):kP.camelize(kP.sanitiseAll(e+o)),a=kP.sanitise(s.requestBody["x-s2o-name"]||r||"");delete s.requestBody["x-s2o-name"];const i=JSON.stringify(s.requestBody),l=kP.createHash(i);if(!n[l]){const e={};e.name=a,e.body=s.requestBody,e.refs=[],n[l]=e}const c=`#/${t}/${encodeURIComponent(o)}/${e}/requestBody`;n[l].refs.push(c)}}}if(i&&i.parameters){for(const e in i.parameters)RP(i.parameters[e],null,i,null,o,a,r);Array.isArray(i.parameters)&&(i.parameters=i.parameters.filter(PP))}}}function FP(e){return e&&e.url&&"string"==typeof e.url?(e.url=e.url.split("{{").join("{"),e.url=e.url.split("}}").join("}"),e.url.replace(/\{(.+?)\}/g,((t,r)=>{e.variables||(e.variables={}),e.variables[r]={default:"unknown"}})),e):e}function NP(e,t){void 0!==e.info&&null!==e.info||(e.info={version:"",title:""},t.patches++,t.warnings.push("(Patchable) info object is mandatory")),("object"!=typeof e.info||Array.isArray(e.info))&&(t.errCount++,t.errors.push({message:"info must be an object",pointer:"/info"})),e.info&&(void 0===e.info.title&&(t.patches++,e.info.title="",t.warnings.push({message:"(Patchable) info.title cannot be null",pointer:"/info/title",patchable:!0})),void 0===e.info.version?(t.patches++,e.info.version="",t.warnings.push("(Patchable) info.version cannot be null")):"string"!=typeof e.info.version&&(t.patches++,e.info.version=e.info.version.toString(),t.warnings.push("(Patchable) info.version must be a string")))}function qP(e,t){e.paths||(t.patches++,e.paths={},t.warnings.push("(Patchable) paths object is mandatory"))}function zP(e={}){const t={original:e,openapi:{},patches:0,warnings:[],errCount:0,errors:[]};if(e.openapi&&"string"==typeof e.openapi&&e.openapi.startsWith("3."))return t.openapi=kP.circularClone(e),NP(t.openapi,t),qP(t.openapi,t),t;if("2.0"!==e.swagger)return t.errCount++,t.errors.push({message:`Unsupported swagger/OpenAPI version: ${e.openapi?e.openapi:e.swagger}`,pointer:"/swagger"}),t;if(t.openapi=kP.circularClone(e),t.openapi.openapi="3.0.0",delete t.openapi.swagger,OP(t.openapi,{},((e,t,r)=>{null===e[t]&&!t.startsWith("x-")&&"default"!==t&&r.path.indexOf("/example")<0&&delete e[t]})),e.host)(e.schemes||[]).forEach((r=>{const n={},a=(e.basePath||"").replace(/\/$/,"");n.url=`${r?`${r}:`:""}//${e.host}${a}`,FP(n),t.openapi.servers||(t.openapi.servers=[]),t.openapi.servers.push(n)}));else if(e.basePath){const r={};r.url=e.basePath,FP(r),t.openapi.servers||(t.openapi.servers=[]),t.openapi.servers.push(r)}if(delete t.openapi.host,delete t.openapi.basePath,e["x-ms-parameterized-host"]){const r=e["x-ms-parameterized-host"],n={};n.url=r.hostTemplate+(e.basePath?e.basePath:""),n.variables={};const a=n.url.match(/\{\w+\}/g);for(const e in r.parameters){const t=r.parameters[e];e.startsWith("x-")||(delete t.required,delete t.type,delete t.in,void 0===t.default&&(t.enum?t.default=t.enum[0]:t.default="none"),t.name||(t.name=a[e].replace("{","").replace("}","")),n.variables[t.name]=t,delete t.name)}t.openapi.servers||(t.openapi.servers=[]),!1===r.useSchemePrefix?t.openapi.servers.push(n):e.schemes.forEach((e=>{t.openapi.servers.push({...n,url:`${e}://${n.url}`})})),delete t.openapi["x-ms-parameterized-host"]}return NP(t.openapi,t),qP(t.openapi,t),"string"==typeof t.openapi.consumes&&(t.openapi.consumes=[t.openapi.consumes]),"string"==typeof t.openapi.produces&&(t.openapi.produces=[t.openapi.produces]),t.openapi.components={},t.openapi["x-callbacks"]&&(t.openapi.components.callbacks=t.openapi["x-callbacks"],delete t.openapi["x-callbacks"]),t.openapi.components.examples={},t.openapi.components.headers={},t.openapi["x-links"]&&(t.openapi.components.links=t.openapi["x-links"],delete t.openapi["x-links"]),t.openapi.components.parameters=t.openapi.parameters||{},t.openapi.components.responses=t.openapi.responses||{},t.openapi.components.requestBodies={},t.openapi.components.securitySchemes=t.openapi.securityDefinitions||{},t.openapi.components.schemas=t.openapi.definitions||{},delete t.openapi.definitions,delete t.openapi.responses,delete t.openapi.parameters,delete t.openapi.securityDefinitions,function(e){const t=e.openapi,r={};EP={schemas:{}},t.security&&jP(t.security);for(const r in t.components.securitySchemes){const n=kP.sanitise(r);if(r!==n){if(t.components.securitySchemes[n])return e.errCount++,e.errors.push({message:`Duplicate sanitised securityScheme name ${n}`,pointer:`/components/securitySchemes/${n}`}),e;t.components.securitySchemes[n]=t.components.securitySchemes[r],delete t.components.securitySchemes[r]}_P(t.components.securitySchemes[n],e)}for(const r in t.components.schemas){const n=kP.sanitiseAll(r);let a=0;if(r!==n){for(;t.components.schemas[n+a];)a=a?++a:2;t.components.schemas[n+a]=t.components.schemas[r],delete t.components.schemas[r]}EP.schemas[r]=n+a,CP(t.components.schemas[`${n}${a}`],e)}for(const r in t.components.parameters){const n=kP.sanitise(r);if(r!==n){if(t.components.parameters[n])return e.errCount++,e.errors.push({message:`Duplicate sanitised parameter name ${n}`,pointer:`/components/parameters/${n}`}),e;t.components.parameters[n]=t.components.parameters[r],delete t.components.parameters[r]}RP(t.components.parameters[n],null,null,null,n,t,e)}for(const r in t.components.responses){const n=kP.sanitise(r);if(r!==n){if(t.components.responses[n])return e.errCount++,e.errors.push({message:`Duplicate sanitised response name ${n}`,pointer:`/components/responses/${n}`}),e;t.components.responses[n]=t.components.responses[r],delete t.components.responses[r]}const a=t.components.responses[n];if(LP(a,null,t,e),a.headers)for(const t in a.headers)"status code"===t.toLowerCase()?(delete a.headers[t],e.patches++,e.warnings.push('(Patchable) "Status Code" is not a valid header')):IP(a.headers[t],e)}for(const e in t.components.requestBodies){const n=t.components.requestBodies[e],a=JSON.stringify(n),o=kP.createHash(a),i={};i.name=e,i.body=n,i.refs=[],r[o]=i}DP(t.paths,"paths",e,r,t),t["x-ms-paths"]&&DP(t["x-ms-paths"],"x-ms-paths",e,r,t);for(const e in t.components.parameters)t.components.parameters[e]["x-s2o-delete"]&&delete t.components.parameters[e];return delete t.consumes,delete t.produces,delete t.schemes,t.components.requestBodies={},t.components.responses&&0===Object.keys(t.components.responses).length&&delete t.components.responses,t.components.parameters&&0===Object.keys(t.components.parameters).length&&delete t.components.parameters,t.components.examples&&0===Object.keys(t.components.examples).length&&delete t.components.examples,t.components.requestBodies&&0===Object.keys(t.components.requestBodies).length&&delete t.components.requestBodies,t.components.securitySchemes&&0===Object.keys(t.components.securitySchemes).length&&delete t.components.securitySchemes,t.components.headers&&0===Object.keys(t.components.headers).length&&delete t.components.headers,t.components.schemas&&0===Object.keys(t.components.schemas).length&&delete t.components.schemas,t.components&&0===Object.keys(t.components).length&&delete t.components,e}(t)}function UP(e){return e.ok&&e.text&&e.parseError&&"YAMLException"===e.parseError.name&&(!e.headers["content-type"]||e.headers["content-type"].match("text/plain"))&&(e.body=e.text),e}const BP=function(e){return new Promise((async t=>{try{const r=await wP.resolve(e,UP);if(r.errors&&r.errors.length>0)t(r);else{r.spec.openapi&&(r.resolvedSpec=r.spec,t(r));const e=zP(r.spec);e.errors&&e.errors.length>0&&(Array.isArray(r.errors)?r.errors.concat(r.errors):r.errors=e.errors),e.warnings&&e.warnings.length>0&&(r.warnings=e.warnings),r.resolvedSpec=r.spec,r.spec=e.openapi,t(r)}}catch(e){t(e)}}))};async function MP(e,t=!1,r=!1,n="",a="",o="",i="",s=""){var l,c;let p;try{var d,u;let t;if(this.requestUpdate(),t="string"==typeof e?await BP({url:e,allowMetaPatches:!1}):await BP({spec:e,allowMetaPatches:!1}),await it(0),null!==(d=t.resolvedSpec)&&void 0!==d&&d.jsonSchemaViewer&&null!==(u=t.resolvedSpec)&&void 0!==u&&u.schemaAndExamples){this.dispatchEvent(new CustomEvent("before-render",{detail:{spec:t.resolvedSpec}}));const e=Object.entries(t.resolvedSpec.schemaAndExamples).map((e=>({show:!0,expanded:!0,selectedExample:null,name:e[0],elementId:e[0].replace(at,"-"),...e[1]})));return{specLoadError:!1,isSpecLoading:!1,info:t.resolvedSpec.info,schemaAndExamples:e}}var h,f,m,y;if(!t.spec||!(t.spec.components||t.spec.info||t.spec.servers||t.spec.tags||t.spec.paths))return console.info("RapiDoc: %c There was an issue while parsing the spec %o ","color:orangered",t),{specLoadError:!0,isSpecLoading:!1,info:{title:"Error loading the spec",description:null!==(h=t.response)&&void 0!==h&&h.url?`${null===(f=t.response)||void 0===f?void 0:f.url} ┃ ${null===(m=t.response)||void 0===m?void 0:m.status}  ${null===(y=t.response)||void 0===y?void 0:y.statusText}`:"Unable to load the Spec",version:" "},tags:[]};p=t.spec,this.dispatchEvent(new CustomEvent("before-render",{detail:{spec:p}}))}catch(e){console.info("RapiDoc: %c There was an issue while parsing the spec %o ","color:orangered",e)}const g=function(e,t,r=!1,n=!1){const a=["get","put","post","delete","patch","head","options"],o=e.tags&&Array.isArray(e.tags)?e.tags.map((e=>({show:!0,elementId:`tag--${e.name.replace(at,"-")}`,name:e.name,description:e.description||"",headers:e.description?HP(e.description):[],paths:[],expanded:!1!==e["x-tag-expanded"]}))):[],i=e.paths||{};if(e.webhooks)for(const[t,r]of Object.entries(e.webhooks))r._type="webhook",i[t]=r;for(const t in i){const n=i[t].parameters,s={servers:i[t].servers||[],parameters:i[t].parameters||[]},l="webhook"===i[t]._type;a.forEach((a=>{if(i[t][a]){const i=e.paths[t][a],c=i.tags||[];if(0===c.length)if(r){const e=t.replace(/^\/+|\/+$/g,""),r=e.indexOf("/");-1===r?c.push(e):c.push(e.substr(0,r))}else c.push("General ⦂");c.forEach((r=>{let c,p;var d,u;(e.tags&&(p=e.tags.find((e=>e.name.toLowerCase()===r.toLowerCase()))),c=o.find((e=>e.name===r)),c)||(c={show:!0,elementId:`tag--${r.replace(at,"-")}`,name:r,description:(null===(d=p)||void 0===d?void 0:d.description)||"",headers:null!==(u=p)&&void 0!==u&&u.description?HP(p.description):[],paths:[],expanded:!p||!1!==p["x-tag-expanded"]},o.push(c));let h=(i.summary||i.description||`${a.toUpperCase()} ${t}`).trim();h.length>100&&([h]=h.split(/[.|!|?]\s|[\r?\n]/));let f=[];if(f=n?i.parameters?n.filter((e=>{if(!i.parameters.some((t=>e.name===t.name&&e.in===t.in)))return e})).concat(i.parameters):n.slice(0):i.parameters?i.parameters.slice(0):[],i.callbacks)for(const[e,t]of Object.entries(i.callbacks)){const r=Object.entries(t).filter((e=>"object"==typeof e[1]))||[];i.callbacks[e]=Object.fromEntries(r)}c.paths.push({show:!0,expanded:!1,isWebhook:l,expandedAtLeastOnce:!1,summary:i.summary||"",description:i.description||"",shortSummary:h,method:a,path:t,operationId:i.operationId,elementId:`${a}-${t.replace(at,"-")}`,servers:i.servers?s.servers.concat(i.servers):s.servers,parameters:f,requestBody:i.requestBody,responses:i.responses,callbacks:i.callbacks,deprecated:i.deprecated,security:i.security,xBadges:i["x-badges"]||void 0,xCodeSamples:i["x-codeSamples"]||i["x-code-samples"]||""})}))}}))}const s=o.filter((e=>e.paths&&e.paths.length>0));return s.forEach((e=>{"method"===t?e.paths.sort(((e,t)=>a.indexOf(e.method).toString().localeCompare(a.indexOf(t.method)))):"summary"===t?e.paths.sort(((e,t)=>e.shortSummary.localeCompare(t.shortSummary))):"path"===t&&e.paths.sort(((e,t)=>e.path.localeCompare(t.path))),e.firstPathId=e.paths[0].elementId})),n?s.sort(((e,t)=>e.name.localeCompare(t.name))):s}(p,n,t,r),v=function(e){if(!e.components)return[];const t=[];for(const r in e.components){const n=[];for(const t in e.components[r]){const a={show:!0,id:`${r.toLowerCase()}-${t.toLowerCase()}`.replace(at,"-"),name:t,component:e.components[r][t]};n.push(a)}let a=r,o=r;switch(r){case"schemas":o="Schemas",a="Schemas allows the definition of input and output data types. These types can be objects, but also primitives and arrays.";break;case"responses":o="Responses",a="Describes responses from an API Operation, including design-time, static links to operations based on the response.";break;case"parameters":o="Parameters",a="Describes operation parameters. A unique parameter is defined by a combination of a name and location.";break;case"examples":o="Examples",a="List of Examples for operations, can be requests, responses and objects examples.";break;case"requestBodies":o="Request Bodies",a="Describes common request bodies that are used across the API operations.";break;case"headers":o="Headers",a='Headers follows the structure of the Parameters but they are explicitly in "header"';break;case"securitySchemes":o="Security Schemes",a="Defines a security scheme that can be used by the operations. Supported schemes are HTTP authentication, an API key (either as a header, a cookie parameter or as a query parameter), OAuth2's common flows(implicit, password, client credentials and authorization code) as defined in RFC6749, and OpenID Connect Discovery.";break;case"links":o="Links",a="Links represent a possible design-time link for a response. The presence of a link does not guarantee the caller's ability to successfully invoke it, rather it provides a known relationship and traversal mechanism between responses and other operations.";break;case"callbacks":o="Callbacks",a="A map of possible out-of band callbacks related to the parent operation. Each value in the map is a Path Item Object that describes a set of requests that may be initiated by the API provider and the expected responses. The key value used to identify the path item object is an expression, evaluated at runtime, that identifies a URL to use for the callback operation.";break;default:o=r,a=r}const i={show:!0,name:o,description:a,subComponents:n};t.push(i)}return t||[]}(p),b=null!==(l=p.info)&&void 0!==l&&l.description?HP(p.info.description):[],x=[];if(null!==(c=p.components)&&void 0!==c&&c.securitySchemes){const e=new Set;Object.entries(p.components.securitySchemes).forEach((t=>{if(!e.has(t[0])){e.add(t[0]);const r={securitySchemeId:t[0],...t[1]};r.value="",r.finalKeyValue="","apiKey"===t[1].type||"http"===t[1].type?(r.in=t[1].in||"header",r.name=t[1].name||"Authorization",r.user="",r.password=""):"oauth2"===t[1].type&&(r.in="header",r.name="Authorization",r.clientId="",r.clientSecret=""),x.push(r)}}))}a&&o&&i&&x.push({securitySchemeId:ot,description:"api-key provided in rapidoc element attributes",type:"apiKey",oAuthFlow:"",name:a,in:o,value:i,finalKeyValue:i}),x.forEach((e=>{"http"===e.type?e.typeDisplay="basic"===e.scheme?"HTTP Basic":"HTTP Bearer":"apiKey"===e.type?e.typeDisplay=`API Key (${e.name})`:"oauth2"===e.type?e.typeDisplay=`OAuth (${e.securitySchemeId})`:e.typeDisplay=e.type||"None"}));let w=[];p.servers&&Array.isArray(p.servers)?(p.servers.forEach((e=>{let t=e.url.trim();t.startsWith("http")||t.startsWith("//")||t.startsWith("{")||window.location.origin.startsWith("http")&&(e.url=window.location.origin+e.url,t=e.url),e.variables&&Object.entries(e.variables).forEach((e=>{const r=new RegExp(`{${e[0]}}`,"g");t=t.replace(r,e[1].default||""),e[1].value=e[1].default||""})),e.computedUrl=t})),s&&p.servers.push({url:s,computedUrl:s})):s?p.servers=[{url:s,computedUrl:s}]:window.location.origin.startsWith("http")?p.servers=[{url:window.location.origin,computedUrl:window.location.origin}]:p.servers=[{url:"http://localhost",computedUrl:"http://localhost"}],w=p.servers;return{specLoadError:!1,isSpecLoading:!1,info:p.info,infoDescriptionHeaders:b,tags:g,components:v,externalDocs:p.externalDocs,securitySchemes:x,servers:w}}function HP(e){const t=We.lexer(e).filter((e=>"heading"===e.type&&e.depth<=2));return t||[]}const WP=1,VP=2,GP=3,KP=4,JP=e=>(...t)=>({_$litDirective$:e,values:t});class YP{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,r){this._$Ct=e,this._$AM=t,this._$Ci=r}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}class ZP extends YP{constructor(e){if(super(e),this.it=B,e.type!==VP)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===B||null==e)return this._t=void 0,this.it=e;if(e===U)return e;if("string"!=typeof e)throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}}ZP.directiveName="unsafeHTML",ZP.resultType=1;const QP=JP(ZP),XP="rapidoc";function eI(e,t="",r="",n=""){var a,o;const i=null===(a=this.resolvedSpec.securitySchemes)||void 0===a?void 0:a.find((t=>t.securitySchemeId===e));if(!i)return!1;let s="";if("basic"===(null===(o=i.scheme)||void 0===o?void 0:o.toLowerCase()))t&&(s=`Basic ${btoa(`${t}:${r}`)}`);else if(n){var l;i.value=n,s=`${"bearer"===(null===(l=i.scheme)||void 0===l?void 0:l.toLowerCase())?"Bearer ":""}${n}`}return!!s&&(i.finalKeyValue=s,this.requestUpdate(),!0)}function tI(){var e;null===(e=this.resolvedSpec.securitySchemes)||void 0===e||e.forEach((e=>{e.user="",e.password="",e.value="",e.finalKeyValue=""})),this.requestUpdate()}function rI(){return JSON.parse(localStorage.getItem(XP))||{}}function nI(e){localStorage.setItem(XP,JSON.stringify(e))}function aI(){const e=rI.call(this);Object.values(e).forEach((e=>{eI.call(this,e.securitySchemeId,e.username,e.password,e.value)}))}function oI(e){let t="";const r=this.resolvedSpec.securitySchemes.find((t=>t.securitySchemeId===e));if(r){const n=this.shadowRoot.getElementById(`security-scheme-${e}`);if(n){if(r.type&&r.scheme&&"http"===r.type&&"basic"===r.scheme.toLowerCase()){const t=n.querySelector(".api-key-user").value.trim(),r=n.querySelector(".api-key-password").value.trim();eI.call(this,e,t,r)}else t=n.querySelector(".api-key-input").value.trim(),eI.call(this,e,"","",t);if("true"===this.persistAuth){const t=rI.call(this);t[e]=r,nI.call(this,t)}}}}function iI(e,t,r="Bearer"){const n=this.resolvedSpec.securitySchemes.find((t=>t.securitySchemeId===e));n.finalKeyValue=`${"bearer"===r.toLowerCase()?"Bearer":"mac"===r.toLowerCase()?"MAC":r} ${t}`,this.requestUpdate()}async function sI(e,t,r,n,a,o,i,s,l="header",c=null,p=null,d=null){const u=s?s.querySelector(".oauth-resp-display"):void 0,h=new URLSearchParams,f=new Headers;h.append("grant_type",a),"client_credentials"!==a&&"password"!==a&&h.append("redirect_uri",n),o&&(h.append("code",o),h.append("code_verifier","731DB1C3F7EA533B85E29492D26AA-1234567890-1234567890")),"header"===l?f.set("Authorization",`Basic ${btoa(`${t}:${r}`)}`):(h.append("client_id",t),h.append("client_secret",r)),"password"===a&&(h.append("username",p),h.append("password",d)),c&&h.append("scope",c);try{const t=await fetch(e,{method:"POST",headers:f,body:h}),r=await t.json();if(!t.ok)return u&&(u.innerHTML=`<span style="color:var(--red)">${r.error_description||r.error_description||"Unable to get access token"}</span>`),!1;if(r.token_type&&r.access_token)return iI.call(this,i,r.access_token,r.token_type),u&&(u.innerHTML='<span style="color:var(--green)">Access Token Received</span>'),!0}catch(e){return u&&(u.innerHTML='<span style="color:var(--red)">Failed to get access token</span>'),!1}}async function lI(e,t,r,n,a,o,i,s,l,c){sessionStorage.removeItem("winMessageEventActive"),t.close(),e.data.fake||(e.data||console.warn("RapiDoc: Received no data with authorization message"),e.data.error&&console.warn("RapiDoc: Error while receiving data"),e.data&&("code"===e.data.responseType?sI.call(this,r,n,a,o,i,e.data.code,l,c,s):"token"===e.data.responseType&&iI.call(this,l,e.data.access_token,e.data.token_type)))}async function cI(e,t,r,n,a){const o=a.target.closest(".oauth-flow"),i=o.querySelector(".oauth-client-id")?o.querySelector(".oauth-client-id").value.trim():"",s=o.querySelector(".oauth-client-secret")?o.querySelector(".oauth-client-secret").value.trim():"",l=o.querySelector(".api-key-user")?o.querySelector(".api-key-user").value.trim():"",c=o.querySelector(".api-key-password")?o.querySelector(".api-key-password").value.trim():"",p=o.querySelector(".oauth-send-client-secret-in")?o.querySelector(".oauth-send-client-secret-in").value.trim():"header",d=[...o.querySelectorAll(".scope-checkbox:checked")],u=o.querySelector(`#${e}-pkce`),h=`${Math.random().toString(36)}random`.slice(2,9),f=`${Math.random().toString(36)}random`.slice(2,9),m=new URL(`${window.location.origin}${window.location.pathname.substring(0,window.location.pathname.lastIndexOf("/"))}/${this.oauthReceiver}`);let y,g="",v="";if([...o.parentNode.querySelectorAll(".oauth-resp-display")].forEach((e=>{e.innerHTML=""})),"authorizationCode"===t||"implicit"===t){const a=new URL(r);"authorizationCode"===t?(g="authorization_code",v="code"):"implicit"===t&&(v="token");const l=new URLSearchParams(a.search),c=d.map((e=>e.value)).join(" ");c&&l.set("scope",c),l.set("client_id",i),l.set("redirect_uri",m.toString()),l.set("response_type",v),l.set("state",h),l.set("nonce",f),u&&u.checked&&(l.set("code_challenge","4FatVDBJKPAo4JgLLaaQFMUcQPn5CrPRvLlaob9PTYc"),l.set("code_challenge_method","S256")),l.set("show_dialog",!0),a.search=l.toString(),"true"===sessionStorage.getItem("winMessageEventActive")&&window.postMessage({fake:!0},this),setTimeout((()=>{y=window.open(a.toString()),y?(sessionStorage.setItem("winMessageEventActive","true"),window.addEventListener("message",(t=>lI.call(this,t,y,n,i,s,m.toString(),g,p,e,o)),{once:!0})):console.error(`RapiDoc: Unable to open ${a.toString()} in a new window`)}),10)}else if("clientCredentials"===t){g="client_credentials";const t=d.map((e=>e.value)).join(" ");sI.call(this,n,i,s,m.toString(),g,"",e,o,p,t)}else if("password"===t){g="password";const t=d.map((e=>e.value)).join(" ");sI.call(this,n,i,s,m.toString(),g,"",e,o,p,t,l,c)}}function pI(e,t,r,n,a,o=[],i="header"){let{authorizationUrl:s,tokenUrl:l,refreshUrl:c}=a;const p=e=>e.indexOf("://")>0||0===e.indexOf("//");let d;return c&&!p(c)&&(c=`${this.selectedServer.computedUrl}/${c.replace(/^\//,"")}`),l&&!p(l)&&(l=`${this.selectedServer.computedUrl}/${l.replace(/^\//,"")}`),s&&!p(s)&&(s=`${this.selectedServer.computedUrl}/${s.replace(/^\//,"")}`),d="authorizationCode"===e?"Authorization Code Flow":"clientCredentials"===e?"Client Credentials Flow":"implicit"===e?"Implicit Flow":"password"===e?"Password Flow":e,z`
    <div class="oauth-flow ${e}" style="padding: 12px 0; margin-bottom:12px;">
      <div class="tiny-title upper" style="margin-bottom:8px;">${d}</div>
      ${s?z`<div style="margin-bottom:5px"><span style="width:75px; display: inline-block;">Auth URL</span> <span class="mono-font"> ${s} </span></div>`:""}
      ${l?z`<div style="margin-bottom:5px"><span style="width:75px; display: inline-block;">Token URL</span> <span class="mono-font">${l}</span></div>`:""}
      ${c?z`<div style="margin-bottom:5px"><span style="width:75px; display: inline-block;">Refresh URL</span> <span class="mono-font">${c}</span></div>`:""}
      ${"authorizationCode"===e||"clientCredentials"===e||"implicit"===e||"password"===e?z`
          ${a.scopes?z`
              <span> Scopes </span>
              <div class= "oauth-scopes" part="section-auth-scopes" style = "width:100%; display:flex; flex-direction:column; flex-wrap:wrap; margin:0 0 10px 24px">
                ${Object.entries(a.scopes).map(((t,r)=>z`
                  <div class="m-checkbox" style="display:inline-flex; align-items:center">
                    <input type="checkbox" part="checkbox checkbox-auth-scope" class="scope-checkbox" id="${n}${e}${r}" ?checked="${o.includes(t[0])}" value="${t[0]}">
                    <label for="${n}${e}${r}" style="margin-left:5px; cursor:pointer">
                      <span class="mono-font">${t[0]}</span>
                        ${t[0]!==t[1]?` - ${t[1]||""}`:""}
                    </label>
                  </div>
                `))}
              </div>
            `:""}
          ${"password"===e?z`
              <div style="margin:5px 0">
                <input type="text" value = "" placeholder="username" spellcheck="false" class="oauth2 ${e} ${n} api-key-user" part="textbox textbox-username">
                <input type="password" value = "" placeholder="password" spellcheck="false" class="oauth2 ${e} ${n} api-key-password" style = "margin:0 5px;" part="textbox textbox-password">
              </div>`:""}
          <div>
            ${"authorizationCode"===e?z`
                <div style="margin: 16px 0 4px">
                  <input type="checkbox" part="checkbox checkbox-auth-scope" id="${n}-pkce" checked>
                  <label for="${n}-pkce" style="margin:0 16px 0 4px; line-height:24px; cursor:pointer">
                   Send Proof Key for Code Exchange (PKCE)
                  </label>
                </div>
              `:""}
            <input type="text" part="textbox textbox-auth-client-id" value = "${t||""}" placeholder="client-id" spellcheck="false" class="oauth2 ${e} ${n} oauth-client-id">
            ${"authorizationCode"===e||"clientCredentials"===e||"password"===e?z`
                <input type="password" part="textbox textbox-auth-client-secret" value = "${r||""}" placeholder="client-secret" spellcheck="false" class="oauth2 ${e} ${n} oauth-client-secret" style = "margin:0 5px;">
                ${"authorizationCode"===e||"clientCredentials"===e||"password"===e?z`
                    <select style="margin-right:5px;" class="${e} ${n} oauth-send-client-secret-in">
                      <option value = 'header' .selected = ${"header"===i} > Authorization Header </option>
                      <option value = 'request-body' .selected = ${"request-body"===i}> Request Body </option>
                    </select>`:""}`:""}
            ${"authorizationCode"===e||"clientCredentials"===e||"implicit"===e||"password"===e?z`
                <button class="m-btn thin-border" part="btn btn-outline"
                  @click="${t=>{cI.call(this,n,e,s,l,t)}}"
                > GET TOKEN </button>`:""}
          </div>
          <div class="oauth-resp-display red-text small-font-size"></div>
          `:""}
    </div>
  `}function dI(e){var t;const r=null===(t=this.resolvedSpec.securitySchemes)||void 0===t?void 0:t.find((t=>t.securitySchemeId===e));if(r.user="",r.password="",r.value="",r.finalKeyValue="","true"===this.persistAuth){const e=rI.call(this);delete e[r.securitySchemeId],nI.call(this,e)}this.requestUpdate()}function uI(){var e;if(!this.resolvedSpec)return"";const t=null===(e=this.resolvedSpec.securitySchemes)||void 0===e?void 0:e.filter((e=>e.finalKeyValue));return t?z`
  <section id='auth' part="section-auth" style="text-align:left; direction:ltr; margin-top:24px; margin-bottom:24px;" class = 'observe-me ${"read focused".includes(this.renderStyle)?"section-gap--read-mode":"section-gap "}'>
    <div class='sub-title regular-font'> AUTHENTICATION </div>

    <div class="small-font-size" style="display:flex; align-items: center; min-height:30px">
      ${t.length>0?z`
          <div class="blue-text"> ${t.length} API key applied </div>
          <div style="flex:1"></div>
          <button class="m-btn thin-border" part="btn btn-outline" @click=${()=>{tI.call(this)}}>CLEAR ALL API KEYS</button>`:z`<div class="red-text">No API key applied</div>`}
    </div>
    ${this.resolvedSpec.securitySchemes&&this.resolvedSpec.securitySchemes.length>0?z`
        <table role="presentation" id="auth-table" class='m-table padded-12' style="width:100%;">
          ${this.resolvedSpec.securitySchemes.map((e=>z`
            <tr id="security-scheme-${e.securitySchemeId}" class="${e.type.toLowerCase()}">
              <td style="max-width:500px; overflow-wrap: break-word;">
                <div style="line-height:28px; margin-bottom:5px;">
                  <span style="font-weight:bold; font-size:var(--font-size-regular)">${e.typeDisplay}</span>
                  ${e.finalKeyValue?z`
                      <span class='blue-text'>  ${e.finalKeyValue?"Key Applied":""} </span>
                      <button class="m-btn thin-border small" part="btn btn-outline" @click=${()=>{dI.call(this,e.securitySchemeId)}}>REMOVE</button>
                      `:""}
                </div>
                ${e.description?z`
                    <div class="m-markdown">
                      ${QP(We(e.description||""))}
                    </div>`:""}

                ${"apikey"===e.type.toLowerCase()||"http"===e.type.toLowerCase()&&"bearer"===e.scheme.toLowerCase()?z`
                    <div style="margin-bottom:5px">
                      ${"apikey"===e.type.toLowerCase()?z`Send <code>${e.name}</code> in <code>${e.in}</code>`:z`Send <code>Authorization</code> in <code>header</code> containing the word <code>Bearer</code> followed by a space and a Token String.`}
                    </div>
                    <div style="max-height:28px;">
                      ${"cookie"!==e.in?z`
                          <input type = "text" value = "${e.value}" class="${e.type} ${e.securitySchemeId} api-key-input" placeholder = "api-token" spellcheck = "false">
                          <button class="m-btn thin-border" style = "margin-left:5px;"
                            part = "btn btn-outline"
                            @click="${t=>{oI.call(this,e.securitySchemeId,t)}}">
                            ${e.finalKeyValue?"UPDATE":"SET"}
                          </button>`:z`<span class="gray-text" style="font-size::var(--font-size-small)"> cookies cannot be set from here</span>`}
                    </div>`:""}
                ${"http"===e.type.toLowerCase()&&"basic"===e.scheme.toLowerCase()?z`
                    <div style="margin-bottom:5px">
                      Send <code>Authorization</code> in <code>header</code> containing the word <code>Basic</code> followed by a space and a base64 encoded string of <code>username:password</code>.
                    </div>
                    <div>
                      <input type="text" value = "${e.user}" placeholder="username" spellcheck="false" class="${e.type} ${e.securitySchemeId} api-key-user" style="width:100px">
                      <input type="password" value = "${e.password}" placeholder="password" spellcheck="false" class="${e.type} ${e.securitySchemeId} api-key-password" style = "width:100px; margin:0 5px;">
                      <button class="m-btn thin-border"
                        @click="${t=>{oI.call(this,e.securitySchemeId,t)}}"
                        part = "btn btn-outline"
                      >
                        ${e.finalKeyValue?"UPDATE":"SET"}
                      </button>
                    </div>`:""}
              </td>
            </tr>
            ${"oauth2"===e.type.toLowerCase()?z`
                <tr>
                  <td style="border:none; padding-left:48px">
                    ${Object.keys(e.flows).map((t=>pI.call(this,t,e["x-client-id"],e["x-client-secret"],e.securitySchemeId,e.flows[t],e["x-default-scopes"],e["x-receive-token-in"])))}
                  </td>
                </tr>
                `:""}
          `))}
        </table>`:""}
    <slot name="auth"></slot>
  </section>
`:void 0}function hI(e){if(this.resolvedSpec.securitySchemes&&e){const t=[];return e.forEach((e=>{const r=[],n=[];0===Object.keys(e).length?t.push({securityTypes:"None",securityDefs:[]}):(Object.keys(e).forEach((t=>{let a="";const o=this.resolvedSpec.securitySchemes.find((e=>e.securitySchemeId===t));e[t]&&Array.isArray(e[t])&&(a=e[t].join(", ")),o&&(n.push(o.typeDisplay),r.push({...o,scopes:a}))})),t.push({securityTypes:n.length>1?`${n[0]} + ${n.length-1} more`:n[0],securityDefs:r}))})),z`<div style="position:absolute; top:3px; right:2px; font-size:var(--font-size-small); line-height: 1.5;">
      <div style="position:relative; display:flex; min-width:350px; max-width:700px; justify-content: flex-end;">
        <svg width="16" height="24">
          <g>
            <path style="fill: var(--fg3)" d="m13.8,8.5l0,-2.6l0,0c0,-3.2 -2.6,-5.8 -5.8,-5.8s-5.8,2.6 -5.8,5.8l0,0l0,2.6l-2.1,0l0,11.2l16,0l0,-11.2l-2.1,0l-0,0l0,0l0,0l-0,0zm-9.8,-2.6c0,0 0,0 0,0c0,-2.2 1.8,-4 4,-4c2.2,0 4,1.8 4,4c0,0 0,0 0,0l0,2.6l-8.03,0l0,-2.6l0,0l0,0z" />
          </g>
        </svg>
          ${t.map(((e,t)=>z`

          ${e.securityTypes?z`
              ${0!==t?z`<div style="padding:3px 4px;"> OR </div>`:""}
              <div class="tooltip">
                <div style = "padding:2px 4px; white-space:nowrap; text-overflow:ellipsis;max-width:150px; overflow:hidden;">
                  ${"true"===this.updateRoute&&"true"===this.allowAuthentication?z`<a part="anchor anchor-operation-security" href="#auth"> ${e.securityTypes} </a>`:z`${e.securityTypes}`}
                </div>
                <div class="tooltip-text" style="position:absolute; color: var(--fg); top:26px; right:0; border:1px solid var(--border-color);padding:2px 4px; display:block;">
                  ${e.securityDefs.length>1?z`<div>Requires <b>all</b> of the following </div>`:""}
                  <div style="padding-left: 8px">
                    ${e.securityDefs.map(((t,r)=>{const n=z`${""!==t.scopes?z`
                          <div>
                            <b>Required scopes:</b>
                            <br/>
                            <div style="margin-left:8px">
                              ${t.scopes.split(",").map(((e,t)=>z`${0===t?"":"┃"}<span>${e}</span>`))}
                            </div>
                          </div>`:""}`;return z`
                      ${"oauth2"===t.type?z`
                          <div>
                            ${e.securityDefs.length>1?z`<b>${r+1}.</b> &nbsp;`:"Needs"}
                            OAuth Token <span style="font-family:var(--font-mono); color:var(--primary-color);">${t.securitySchemeId}</span> in <b>Authorization header</b>
                            ${n}
                          </div>`:"http"===t.type?z`
                            <div>
                              ${e.securityDefs.length>1?z`<b>${r+1}.</b> &nbsp;`:z`Requires`}
                              ${"basic"===t.scheme?"Base 64 encoded username:password":"Bearer Token"} in <b>Authorization header</b>
                              ${n}
                            </div>`:z`
                            <div>
                              ${e.securityDefs.length>1?z`<b>${r+1}.</b> &nbsp;`:z`Requires`}
                              Token in <b>${t.name} ${t.in}</b>
                              ${n}
                            </div>`}`}))}
                  </div>
                </div>
              </div>
            `:""}
        `))}
      </div>
    `}return""}function fI(e){return z`
  <section class="table-title" style="margin-top:24px;">CODE SAMPLES</div>
  <div class="tab-panel col"
    @click="${e=>{if(!e.target.classList.contains("tab-btn"))return;const t=e.target.dataset.tab,r=[...e.currentTarget.querySelectorAll(".tab-btn")],n=[...e.currentTarget.querySelectorAll(".tab-content")];r.forEach((e=>e.classList[e.dataset.tab===t?"add":"remove"]("active"))),n.forEach((e=>{e.style.display=e.dataset.tab===t?"block":"none"}))}}">
    <div class="tab-buttons row" style="width:100; overflow">
      ${e.map(((e,t)=>z`<button class="tab-btn ${0===t?"active":""}" data-tab = '${e.lang}${t}'> ${e.label||e.lang} </button>`))}
    </div>
    ${e.map(((e,t)=>{var r,n,a;return z`
      <div class="tab-content m-markdown" style= "display:${0===t?"block":"none"}" data-tab = '${e.lang}${t}'>
        <button class="toolbar-btn" style = "position:absolute; top:12px; right:8px" @click='${t=>{st(e.source,t)}}'> Copy </button>
        <pre><code class="language">${Ge().languages[null===(r=e.lang)||void 0===r?void 0:r.toLowerCase()]?QP(Ge().highlight(e.source,Ge().languages[null===(n=e.lang)||void 0===n?void 0:n.toLowerCase()],null===(a=e.lang)||void 0===a?void 0:a.toLowerCase())):e.source}</code></pre>
      </div>`}))}
  </div>  
  </section>`}function mI(e){return z`
    <div class="req-res-title" style="margin-top:12px">CALLBACKS</div>
    ${Object.entries(e).map((e=>z`
      <div class="tiny-title" style="padding: 12px; border:1px solid var(--light-border-color)"> 
        ${e[0]}
        ${Object.entries(e[1]).map((e=>z`
          <div class="mono-font small-font-size" style="display:flex; margin-left:16px;">
            <div style="width:100%"> 
              ${Object.entries(e[1]).map((t=>{var r,n,a;return z`
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
                      .responses="${null===(a=t[1])||void 0===a?void 0:a.responses}"
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
  `}const yI={},gI=JP(class extends YP{constructor(){super(...arguments),this.ot=yI}render(e,t){return t()}update(e,[t,r]){if(Array.isArray(t)){if(Array.isArray(this.ot)&&this.ot.length===t.length&&t.every(((e,t)=>e===this.ot[t])))return U}else if(this.ot===t)return U;return this.ot=Array.isArray(t)?Array.from(t):t,this.render(t,r)}}),{H:vI}=re,bI={},xI=JP(class extends YP{constructor(e){if(super(e),e.type!==GP&&e.type!==WP&&e.type!==KP)throw Error("The `live` directive is not allowed on child or event bindings");if(!(e=>void 0===e.strings)(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===U||t===B)return t;const r=e.element,n=e.name;if(e.type===GP){if(t===r[n])return U}else if(e.type===KP){if(!!t===r.hasAttribute(n))return U}else if(e.type===WP&&r.getAttribute(n)===t+"")return U;return((e,t=bI)=>{e._$AH=t})(e),t}});var wI=r(131),$I=r.n(wI);const kI=c`
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
`;function SI(e){if(!e)return;let t="",r="";if(e.$ref){const r=e.$ref.lastIndexOf("/");t=`{recursive: ${e.$ref.substring(r+1)}} `}else e.type?(t=Array.isArray(e.type)?e.type.join(2===e.length?" or ":"┃"):e.type,(e.format||e.enum)&&(t=t.replace("string",e.enum?"enum":e.format)),e.nullable&&(t+="┃null")):t=0===Object.keys(e).length?"any":"{missing-type-info}";const n={type:t,format:e.format||"",pattern:e.pattern&&!e.enum?e.pattern:"",readOrWriteOnly:e.readOnly?"🆁":e.writeOnly?"🆆":"",deprecated:e.deprecated?"❌":"",examples:e.examples||e.example,default:null!=e.default?`${e.default}`:"",description:e.description||"",constrain:"",allowedValues:"",arrayType:"",html:""};if("{recursive}"===n.type?n.description=e.$ref.substring(e.$ref.lastIndexOf("/")+1):"{missing-type-info}"!==n.type&&"any"!==n.type||(n.description=n.description||""),n.allowedValues=Array.isArray(e.enum)?e.enum.join("┃"):"","array"===t&&e.items){var a,o,i;const t=null===(a=e.items)||void 0===a?void 0:a.type,r=void 0!==(null===(o=e.items)||void 0===o?void 0:o.default)?e.items.default:"";n.arrayType=`${e.type} of ${Array.isArray(t)?t.join(""):t}`,n.default=r,n.allowedValues=Array.isArray(null===(i=e.items)||void 0===i?void 0:i.enum)?e.items.enum.join("┃"):""}return t.match(/integer|number/g)&&(void 0===e.minimum&&void 0===e.exclusiveMinimum||(r+=void 0!==e.minimum?`Min ${e.minimum}`:`More than ${e.exclusiveMinimum}`),void 0===e.maximum&&void 0===e.exclusiveMaximum||(r+=void 0!==e.maximum?`${r?"┃":""}Max ${e.maximum}`:`${r?"┃":""}Less than ${e.exclusiveMaximum}`),void 0!==e.multipleOf&&(r+=`${r?"┃":""} multiple of ${e.multipleOf}`)),t.match(/string/g)&&(void 0!==e.minLength&&void 0!==e.maxLength?r+=`${r?"┃":""}${e.minLength} to ${e.maxLength} chars`:void 0!==e.minLength?r+=`${r?"┃":""}Min ${e.minLength} chars`:void 0!==e.maxLength&&(r+=`Max ${r?"┃":""}${e.maxLength} chars`)),n.constrain=r,n.html=`${n.type}~|~${n.readOrWriteOnly}~|~${n.constrain}~|~${n.default}~|~${n.allowedValues}~|~${n.pattern}~|~${n.description}~|~${e.title||""}~|~${n.deprecated?"deprecated":""}`,n}function AI(e){return"boolean"==typeof e?{Example:{value:`${e}`}}:""===e?{Example:{value:""}}:e?{Example:{value:e}}:e}function OI(e,t="string"){if(!e)return{exampleVal:"",exampleList:[]};if(e.constructor===Object){const t=Object.values(e),r=t.length>0?"boolean"==typeof t[0].value||"number"==typeof t[0].value?t[0].value.toString():t[0].value:"",n=Object.values(e).map((e=>({value:"boolean"==typeof e.value||"number"==typeof e.value?e.value.toString():e.value,summary:e.summary,description:e.description})));return{exampleVal:r,exampleList:n}}if(Array.isArray(e)||(e=e?[e]:[]),0===e.length)return{exampleVal:"",exampleList:[]};if("array"===t){const[t]=e,r=e.map((e=>({value:e})));return{exampleVal:t,exampleList:r}}const r=e[0].toString(),n=e.map((e=>({value:e.toString()})));return{exampleVal:r,exampleList:n}}function EI(e){const t=e.examples?e.examples[0]:null===e.example?null:e.example||void 0;if(""===t)return"";if(null===t)return null;if(0===t)return 0;if(t)return t;if(0===Object.keys(e).length)return null;if(e.$ref)return e.$ref;const r=Array.isArray(e.type)?e.type[0]:e.type;if(!r)return"?";if(r.match(/^integer|^number/g)){const t=Number.isNaN(Number(e.multipleOf))?void 0:Number(e.multipleOf),n=Number.isNaN(Number(e.maximum))?void 0:Number(e.maximum),a=Number.isNaN(Number(e.minimum))?Number.isNaN(Number(e.exclusiveMinimum))?n||0:Number(e.exclusiveMinimum)+(r.startsWith("integer")?1:.001):Number(e.minimum);return t?t>=a?t:a%t==0?a:Math.ceil(a/t)*t:a}if(r.match(/^boolean/g))return!1;if(r.match(/^null/g))return null;if(r.match(/^string/g)){if(e.enum)return e.enum[0];if(e.pattern)return e.pattern;if(!e.format){const t=Number.isNaN(e.minLength)?void 0:Number(e.minLength),r=Number.isNaN(e.maxLength)?void 0:Number(e.maxLength),n=t||(r>6?6:r||void 0);return n?"A".repeat(n):"string"}{const t=`${Date.now().toString(16)}${Math.random().toString(16)}0`.repeat(16);switch(e.format.toLowerCase()){case"url":case"uri":return"http://example.com";case"date":return new Date(0).toISOString().split("T")[0];case"time":return new Date(0).toISOString().split("T")[1];case"date-time":return new Date(0).toISOString();case"duration":return"P3Y6M4DT12H30M5S";case"email":case"idn-email":return"user@example.com";case"hostname":case"idn-hostname":return"www.example.com";case"ipv4":return"198.51.100.42";case"ipv6":return"2001:0db8:5b96:0000:0000:426f:8e17:642a";case"uuid":return[t.substr(0,8),t.substr(8,4),`4000-8${t.substr(13,3)}`,t.substr(16,12)].join("-");default:return""}}}return"?"}function TI(e,t=1){const r="  ".repeat(t);let n="";if(1===t&&"object"!=typeof e)return`\n${r}${e.toString()}`;for(const a in e)n=Array.isArray(e[a])||"object"==typeof e[a]?`${n}\n${r}<${a}> ${TI(e[a],t+1)}\n${r}</${a}>`:`${n}\n${r}<${a}> ${e[a].toString()} </${a}>`;return n}function CI(e,t){"object"==typeof t&&null!==t&&(e.title&&(t["::TITLE"]=e.title),e.description&&(t["::DESCRIPTION"]=e.description))}function jI(e){if("object"==typeof e&&null!==e){delete e["::TITLE"],delete e["::DESCRIPTION"];for(const t in e)jI(e[t])}}function _I(e,t,r){for(const n in t)t[n][r]=e}function PI(e,t,r){let n=0;const a={};for(const o in e){for(const i in r)if(a[`example-${n}`]={...e[o]},a[`example-${n}`][t]=r[i],n++,n>=10)break;if(n>=10)break}return a}function II(e,t={}){let r={};if(e){if(e.allOf){const n={};if(1===e.allOf.length&&!e.allOf[0].properties&&!e.allOf[0].items){if(e.allOf[0].$ref)return"{  }";if(e.allOf[0].readOnly&&t.includeReadOnly){return EI(e.allOf[0])}return}e.allOf.forEach((e=>{if("object"===e.type||e.properties||e.allOf||e.anyOf||e.oneOf){const r=II(e,t);Object.assign(n,r)}else if("array"===e.type||e.items){const r=[II(e,t)];Object.assign(n,r)}else{if(!e.type)return"";{const t=`prop${Object.keys(n).length}`;n[t]=EI(e)}}})),r=n}else if(e.oneOf){const n={};if(e.properties)for(const t in e.properties)n[t]=EI(e.properties[t]);if(e.oneOf.length>0){let a=0;for(const o in e.oneOf){const i=II(e.oneOf[o],t);for(const t in i){let s;if(Object.keys(n).length>0){if(null===i[t]||"object"!=typeof i[t])continue;s=Object.assign(i[t],n)}else s=i[t];r[`example-${a}`]=s,CI(e.oneOf[o],r[`example-${a}`]),a++}}}}else if(e.anyOf){let n;if("object"===e.type||e.properties){n={"example-0":{}};for(const r in e.properties){if(e.example){n=e;break}e.properties[r].deprecated&&!t.includeDeprecated||(e.properties[r].readOnly&&!t.includeReadOnly||e.properties[r].writeOnly&&!t.includeWriteOnly||(n=PI(n,r,II(e.properties[r],t))))}}let a=0;for(const o in e.anyOf){const i=II(e.anyOf[o],t);for(const t in i){if(void 0!==n)for(const e in n)r[`example-${a}`]={...n[e],...i[t]};else r[`example-${a}`]=i[t];CI(e.anyOf[o],r[`example-${a}`]),a++}}}else if("object"===e.type||e.properties)if(r["example-0"]={},CI(e,r["example-0"]),e.example)r["example-0"]=e.example;else for(const p in e.properties){var n,a,o,i,s,l,c;if(null===(n=e.properties[p])||void 0===n||!n.deprecated||t.includeDeprecated)if(null===(a=e.properties[p])||void 0===a||!a.readOnly||t.includeReadOnly)if(null===(o=e.properties[p])||void 0===o||!o.writeOnly||t.includeWriteOnly)if("array"===(null===(i=e.properties[p])||void 0===i?void 0:i.type)||null!==(s=e.properties[p])&&void 0!==s&&s.items)if(e.properties[p].example)_I(e.properties[p].example,r,p);else if(null!==(l=e.properties[p])&&void 0!==l&&null!==(c=l.items)&&void 0!==c&&c.example)_I([e.properties[p].items.example],r,p);else{const n=II(e.properties[p].items,t),a=[];for(const e in n)a[e]=[n[e]];r=PI(r,p,a)}else r=PI(r,p,II(e.properties[p],t))}else{if("array"!==e.type&&!e.items)return{"example-0":EI(e)};var p;if(e.items||e.example)if(e.example)r["example-0"]=e.example;else if(null!==(p=e.items)&&void 0!==p&&p.example)r["example-0"]=[e.items.example];else{const n=II(e.items,t);let a=0;for(const t in n)r[`example-${a}`]=[n[t]],CI(e.items,r[`example-${a}`]),a++}else r["example-0"]=[]}return r}}function RI(e,t=0){var r;let n="";if(e.title&&(n=`**${e.title}:** `),e.description&&(n=`${n} ${e.description} ${e.minItems||e.maxItems?'<span class="more-content">⤵</span><br/>':""}`),e.minItems&&(n=`${n} **Min Items:** ${e.minItems}`),e.maxItems&&(n=`${n} **Max Items:** ${e.maxItems}`),t>0&&null!==(r=e.items)&&void 0!==r&&r.description){let t="";e.items.minProperties&&(t=`**Min Properties:** ${e.items.minProperties}`),e.items.maxProperties&&(t=`${t} **Max Properties:** ${e.items.maxProperties}`),n=`${n} ⮕ ${t} [ ${e.items.description} ] `}return n}function LI(e,t,r=0,n=""){if(e){if(e.allOf){const n={};if(1===e.allOf.length&&!e.allOf[0].properties&&!e.allOf[0].items){return`${SI(e.allOf[0]).html}`}e.allOf.map(((e,t)=>{if("object"===e.type||e.properties||e.allOf||e.anyOf||e.oneOf){const a=(e.anyOf||e.oneOf)&&t>0?t:"",o=LI(e,{},r+1,a);Object.assign(n,o)}else if("array"===e.type||e.items){const t=LI(e,{},r+1);Object.assign(n,t)}else{if(!e.type)return"";{const t=`prop${Object.keys(n).length}`,r=SI(e);n[t]=`${r.html}`}}})),t=n}else if(e.anyOf||e.oneOf){if(t["::description"]=e.description||"","object"===e.type||e.properties){t["::description"]=e.description||"",t["::type"]="object";for(const n in e.properties)e.required&&e.required.includes(n)?t[`${n}*`]=LI(e.properties[n],{},r+1):t[n]=LI(e.properties[n],{},r+1)}const a={},o=e.anyOf?"anyOf":"oneOf";e[o].forEach(((e,t)=>{if("object"===e.type||e.properties||e.allOf||e.anyOf||e.oneOf){const r=LI(e,{});a[`::OPTION~${t+1}${e.title?`~${e.title}`:""}`]=r,a["::type"]="xxx-of-option"}else if("array"===e.type||e.items){const r=LI(e,{});a[`::OPTION~${t+1}${e.title?`~${e.title}`:""}`]=r,a["::type"]="xxx-of-array"}else{const r=`::OPTION~${t+1}${e.title?`~${e.title}`:""}`;a[r]=`${SI(e).html}`,a["::type"]="xxx-of-option"}})),t[e.anyOf?`::ANY~OF ${n}`:`::ONE~OF ${n}`]=a,t["::type"]="xxx-of"}else if(Array.isArray(e.type)){const n=JSON.parse(JSON.stringify(e)),i=[],s=[];let l;var a;if(n.type.forEach((e=>{var t,r;e.match(/integer|number|string|null|boolean/g)?i.push(e):"array"===e&&"string"==typeof(null===(t=n.items)||void 0===t?void 0:t.type)&&null!==(r=n.items)&&void 0!==r&&r.type.match(/integer|number|string|null|boolean/g)?"string"===n.items.type&&n.items.format?i.push(`[${n.items.format}]`):i.push(`[${n.items.type}]`):s.push(e)})),i.length>0)if(n.type=i.join(2===i.length?" or ":"┃"),l=SI(n),0===s.length)return`${(null===(a=l)||void 0===a?void 0:a.html)||""}`;if(s.length>0){var o;t["::type"]="xxx-of";const a={"::type":"xxx-of-option"};s.forEach(((t,o)=>{if("null"===t)a[`::OPTION~${o+1}`]="NULL~|~~|~~|~~|~~|~~|~~|~~|~";else if("integer, number, string, boolean,".includes(`${t},`)){n.type=Array.isArray(t)?t.join("┃"):t;const e=SI(n);a[`::OPTION~${o+1}`]=e.html}else if("object"===t){const t={"::title":e.title||"","::description":e.description||"","::type":"object","::deprecated":e.deprecated||!1};for(const n in e.properties)e.required&&e.required.includes(n)?t[`${n}*`]=LI(e.properties[n],{},r+1):t[n]=LI(e.properties[n],{},r+1);a[`::OPTION~${o+1}`]=t}else"array"===t&&(a[`::OPTION~${o+1}`]={"::title":e.title||"","::description":e.description||"","::type":"array","::props":LI(e.items,{},r+1)})})),a[`::OPTION~${s.length+1}`]=(null===(o=l)||void 0===o?void 0:o.html)||"",t["::ONE~OF"]=a}}else if("object"===e.type||e.properties){t["::title"]=e.title||"",t["::description"]=RI(e,r),t["::type"]="object",(Array.isArray(e.type)&&e.type.includes("null")||e.nullable)&&(t["::dataTypeLabel"]="object or null"),t["::deprecated"]=e.deprecated||!1,t["::readwrite"]=e.readOnly?"readonly":e.writeOnly?"writeonly":"";for(const n in e.properties)e.required&&e.required.includes(n)?t[`${n}*`]=LI(e.properties[n],{},r+1):t[n]=LI(e.properties[n],{},r+1);e.additionalProperties&&(t["<any-key>"]=LI(e.additionalProperties,{}))}else{if("array"!==e.type&&!e.items){const t=SI(e);return null!=t&&t.html?`${t.html}`:""}var i;t["::title"]=e.title||"",t["::description"]=RI(e,r),t["::type"]="array",(Array.isArray(e.type)&&e.type.includes("null")||e.nullable)&&(t["::dataTypeLabel"]="array or null"),t["::deprecated"]=e.deprecated||!1,t["::readwrite"]=e.readOnly?"readonly":e.writeOnly?"writeonly":"",null!==(i=e.items)&&void 0!==i&&i.items&&(t["::array-type"]=e.items.items.type),t["::props"]=LI(e.items,{},r+1)}return t}}function DI(e,t,r="",n="",a=!0,o=!0,i="json",s=!1){const l=[];if(r)for(const e in r){let n="",a="json";if(null!=t&&t.toLowerCase().includes("json")){if("text"===i)n="string"==typeof r[e].value?r[e].value:JSON.stringify(r[e].value,void 0,2),a="text";else if(n=r[e].value,"string"==typeof r[e].value)try{const t=r[e].value.replace(/([\w]+)(:)/g,'"$1"$2').replace(/'/g,'"');n=JSON.parse(t),a="json"}catch(t){a="text",n=r[e].value}}else n=r[e].value,a="text";l.push({exampleId:e,exampleSummary:r[e].summary||e,exampleDescription:r[e].description||"",exampleType:t,exampleValue:n,exampleFormat:a})}else if(n){let e="",r="json";if(null!=t&&t.toLowerCase().includes("json")){if("text"===i)e="string"==typeof n?n:JSON.stringify(n,void 0,2),r="text";else if("object"==typeof n)e=n,r="json";else if("string"==typeof n)try{e=JSON.parse(n),r="json"}catch(t){r="text",e=n}}else e=n,r="text";l.push({exampleId:"Example",exampleSummary:"",exampleDescription:"",exampleType:t,exampleValue:e,exampleFormat:r})}if(0===l.length||!0===s)if(e)if(e.example)l.push({exampleId:"Example",exampleSummary:"",exampleDescription:"",exampleType:t,exampleValue:e.example,exampleFormat:null!=t&&t.toLowerCase().includes("json")&&"object"==typeof e.example?"json":"text"});else if(null!=t&&t.toLowerCase().includes("json")||null!=t&&t.toLowerCase().includes("text")||null!=t&&t.toLowerCase().includes("*/*")||null!=t&&t.toLowerCase().includes("xml")){let r="",n="",s="",c="";null!=t&&t.toLowerCase().includes("xml")?(r=e.xml&&e.xml.name?`<${e.xml.name}>`:"<root>",n=e.xml&&e.xml.name?`</${e.xml.name}>`:"</root>",s="text"):s=i;const p=II(e,{includeReadOnly:a,includeWriteOnly:o,deprecated:!0});let d=0;for(const e in p){if(!p[e])continue;const a=p[e]["::TITLE"]||"Example "+ ++d,o=p[e]["::DESCRIPTION"]||"";jI(p[e]),c=null!=t&&t.toLowerCase().includes("xml")?`${r}${TI(p[e])}\n${n}`:"text"===i?JSON.stringify(p[e],null,2):p[e],l.push({exampleId:e,exampleSummary:a,exampleDescription:o,exampleType:t,exampleFormat:s,exampleValue:c})}}else null!=t&&t.toLowerCase().includes("jose")?l.push({exampleId:"Example",exampleSummary:"Base64 Encoded",exampleDescription:"",exampleType:t,exampleValue:e.pattern||"bXJpbg==",exampleFormat:"text"}):l.push({exampleId:"Example",exampleSummary:"",exampleDescription:"",exampleType:t,exampleValue:"",exampleFormat:"text"});else l.push({exampleId:"Example",exampleSummary:"",exampleDescription:"",exampleType:t,exampleValue:"",exampleFormat:"text"});return l}function FI(e){return"application/json"===e?"json":"application/xml"===e?"xml":null}function NI(e){if(e.schema)return[e.schema,null,null];if(e.content)for(const t of Object.keys(e.content))if(e.content[t].schema)return[e.content[t].schema,FI(t),e.content[t]];return[null,null,null]}customElements.define("json-tree",class extends ie{static get properties(){return{data:{type:Object},renderStyle:{type:String,attribute:"render-style"}}}static get styles(){return[Ke,kI,Je,c`
      :host{
        display:flex;
      }
      .json-tree {
        position: relative;
        font-family: var(--font-mono);
        font-size: var(--font-size-small);
        display:inline-block;
        overflow:hidden;
        word-break: break-all;
        flex:1;
        line-height: calc(var(--font-size-small) + 6px);
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
      .inside-bracket{
        padding-left:12px;
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
      }`,nt]}render(){return z`
      <div class = "json-tree" >
        <div class='toolbar'> 
          <button class="toolbar-btn" part="btn btn-fill btn-copy" @click='${e=>{st(JSON.stringify(this.data,null,2),e)}}'> Copy </button>
        </div>
        ${this.generateTree(this.data,!0)}
      </div>  
    `}generateTree(e,t=!1){if(null===e)return z`<div class="null" style="display:inline;">null</div>`;if("object"==typeof e&&e instanceof Date==!1){const r=Array.isArray(e)?"array":"pure_object";return 0===Object.keys(e).length?z`${Array.isArray(e)?"[ ],":"{ },"}`:z`
      <div class="open-bracket expanded ${"array"===r?"array":"object"} " @click="${this.toggleExpand}" > ${"array"===r?"[":"{"}</div>
      <div class="inside-bracket">
        ${Object.keys(e).map(((t,n,a)=>z`
          <div class="item"> 
            ${"pure_object"===r?z`"${t}":`:""}
            ${this.generateTree(e[t],n===a.length-1)}
          </div>`))}
      </div>
      <div class="close-bracket">${"array"===r?"]":"}"}${t?"":","}</div>
      `}return"string"==typeof e||e instanceof Date?z`<span class="${typeof e}">"${e}"</span>${t?"":","}`:z`<span class="${typeof e}">${e}</span>${t?"":","}`}toggleExpand(e){const t=e.target;t.classList.contains("expanded")?(t.classList.replace("expanded","collapsed"),e.target.innerHTML=e.target.classList.contains("array")?"[...]":"{...}"):(t.classList.replace("collapsed","expanded"),e.target.innerHTML=e.target.classList.contains("array")?"[":"{")}});const qI=c`

*, *:before, *:after { box-sizing: border-box; }

.tr {
  display: flex;
  flex: none;
  width: 100%;
  box-sizing: content-box;
  border-bottom: 1px dotted transparent;
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

.collapsed-descr .key {
  overflow:hidden;
}

.expanded-descr .more-content { display:none; }

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
.schema-root-type.xxx-of {
  display:none;
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
`;customElements.define("schema-tree",class extends ie{static get properties(){return{data:{type:Object},schemaExpandLevel:{type:Number,attribute:"schema-expand-level"},schemaDescriptionExpanded:{type:String,attribute:"schema-description-expanded"},allowSchemaDescriptionExpandToggle:{type:String,attribute:"allow-schema-description-expand-toggle"},schemaHideReadOnly:{type:String,attribute:"schema-hide-read-only"},schemaHideWriteOnly:{type:String,attribute:"schema-hide-write-only"}}}connectedCallback(){super.connectedCallback(),(!this.schemaExpandLevel||this.schemaExpandLevel<1)&&(this.schemaExpandLevel=99999),this.schemaDescriptionExpanded&&"true false".includes(this.schemaDescriptionExpanded)||(this.schemaDescriptionExpanded="false"),this.schemaHideReadOnly&&"true false".includes(this.schemaHideReadOnly)||(this.schemaHideReadOnly="true"),this.schemaHideWriteOnly&&"true false".includes(this.schemaHideWriteOnly)||(this.schemaHideWriteOnly="true")}static get styles(){return[Ke,qI,kI,c`
      .tree {
        font-size:var(--font-size-small);
        text-align: left;
        direction: ltr;
        line-height:calc(var(--font-size-small) + 6px);
      }
      .tree .tr:hover{
        background-color:var(--hover-color);
      }
      .collapsed-descr .tr {
        max-height:calc(var(--font-size-small) + 8px);
      }
      .collapsed-descr .m-markdown-small p {
        line-height:calc(var(--font-size-small) + 6px);
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
        display:none;
      }
      .inside-bracket.object,
      .inside-bracket.array {
        border-left: 1px dotted var(--border-color);
      }
      .inside-bracket.xxx-of {
        padding:5px 0px;
        border-style: dotted;
        border-width: 0 0 1px 0;
        border-color:var(--primary-color);
      }`,nt]}render(){var e,t,r;return z`
      <div class="tree ${"true"===this.schemaDescriptionExpanded?"expanded-descr":"collapsed-descr"}">
        <div class="toolbar">
          <div class="toolbar-item schema-root-type ${(null===(e=this.data)||void 0===e?void 0:e["::type"])||""} "> ${(null===(t=this.data)||void 0===t?void 0:t["::type"])||""} </div>
          ${"true"===this.allowSchemaDescriptionExpandToggle?z`
              <div style="flex:1"></div>
              <div part="schema-toolbar-item schema-multiline-toggle" class='toolbar-item' @click='${()=>{this.schemaDescriptionExpanded="true"===this.schemaDescriptionExpanded?"false":"true"}}'> 
                ${"true"===this.schemaDescriptionExpanded?"Single line description":"Multiline description"}
              </div>
            `:""}
        </div>
        ${null!==(r=this.data)&&void 0!==r&&r["::description"]?z`<span part="schema-description" class='m-markdown'> ${QP(We(this.data["::description"]||""))}</span>`:""}
        ${this.data?z`
            ${this.generateTree("array"===this.data["::type"]?this.data["::props"]:this.data,this.data["::type"],this.data["::array-type"]||"")}`:z`<span class='mono-font' style='color:var(--red)'> Schema not found </span>`}
      </div>  
    `}generateTree(e,t="object",r="",n="",a="",o=0,i=0,s=""){var l;if("true"===this.schemaHideReadOnly){if("array"===t&&"readonly"===s)return;if(e&&"readonly"===e["::readwrite"])return}if("true"===this.schemaHideWriteOnly){if("array"===t&&"writeonly"===s)return;if(e&&"writeonly"===e["::readwrite"])return}if(!e)return z`<div class="null" style="display:inline;">
        <span class="key-label xxx-of-key"> ${n.replace("::OPTION~","")}</span>
        ${"array"===t?z`<span class='mono-font'> [ ] </span>`:"object"===t?z`<span class='mono-font'> { } </span>`:z`<span class='mono-font'> schema undefined </span>`}
      </div>`;if(0===Object.keys(e).length)return z`<span class="key object">${n}:{ }</span>`;let c="",p="";if(n.startsWith("::ONE~OF")||n.startsWith("::ANY~OF"))c=n.replace("::","").replace("~"," ");else if(n.startsWith("::OPTION")){const e=n.split("~");c=e[1],p=e[2]}else c=n;const d=400-12*i;let u="",h="";const f=null!==(l=e["::type"])&&void 0!==l&&l.startsWith("xxx-of")?o:o+1,m="xxx-of-option"===t||"xxx-of-option"===e["::type"]||n.startsWith("::OPTION")?i:i+1;if("object"===e["::type"])"array"===t?(u=o<this.schemaExpandLevel?z`<span class="open-bracket array-of-object" @click="${this.toggleObjectExpand}">[{</span>`:z`<span class="open-bracket array-of-object" @click="${this.toggleObjectExpand}">[{...}]</span>`,h="}]"):(u=o<this.schemaExpandLevel?z`<span class="open-bracket object" @click="${this.toggleObjectExpand}">{</span>`:z`<span class="open-bracket object" @click="${this.toggleObjectExpand}">{...}</span>`,h="}");else if("array"===e["::type"])if("array"===t){const e="object"!==r?r:"";u=o<this.schemaExpandLevel?z`<span class="open-bracket array-of-array" data-array-type="${e}" @click="${this.toggleObjectExpand}">[[ ${e} </span>`:z`<span class="open-bracket array-of-array"  data-array-type="${e}" @click="${this.toggleObjectExpand}">[[...]]</span>`,h="]]"}else u=o<this.schemaExpandLevel?z`<span class="open-bracket array" @click="${this.toggleObjectExpand}">[</span>`:z`<span class="open-bracket array" @click="${this.toggleObjectExpand}">[...]</span>`,h="]";var y;if("object"==typeof e)return z`
        <div class="tr ${o<this.schemaExpandLevel||null!==(y=e["::type"])&&void 0!==y&&y.startsWith("xxx-of")?"expanded":"collapsed"} ${e["::type"]||"no-type-info"}" title="${e["::deprecated"]?"Deprecated":""}">
          <div class="td key ${e["::deprecated"]?"deprecated":""}" style='min-width:${d}px'>
            ${"xxx-of-option"===e["::type"]||"xxx-of-array"===e["::type"]||n.startsWith("::OPTION")?z`<span class='key-label xxx-of-key'> ${c}</span><span class="xxx-of-descr">${p}</span>`:"::props"===c||"::ARRAY~OF"===c?"":o>0?z`<span class="key-label" title="${"readonly"===s?"Read-Only":"writeonly"===s?"Write-Only":""}">
                      ${e["::deprecated"]?"✗":""}
                      ${c.replace(/\*$/,"")}${c.endsWith("*")?z`<span style="color:var(--red)">*</span>`:""}${"readonly"===s?z` 🆁`:"writeonly"===s?z` 🆆`:s}:
                    </span>`:""}
            ${"xxx-of"===e["::type"]&&"array"===t?z`<span style="color:var(--primary-color)">ARRAY</span>`:""} 
            ${u}
          </div>
          <div class='td key-descr m-markdown-small'>${QP(We(a||""))}</div>
        </div>
        <div class='inside-bracket ${e["::type"]||"no-type-info"}' style='padding-left:${"xxx-of-option"===e["::type"]||"xxx-of-array"===e["::type"]?0:12}px;'>
          ${Array.isArray(e)&&e[0]?z`${this.generateTree(e[0],"xxx-of-option","","::ARRAY~OF","",f,m,e[0]["::readwrite"])}`:z`
              ${Object.keys(e).map((t=>z`
                ${["::title","::description","::type","::props","::deprecated","::array-type","::readwrite","::dataTypeLabel"].includes(t)?"array"===e[t]["::type"]||"object"===e[t]["::type"]?z`${this.generateTree("array"===e[t]["::type"]?e[t]["::props"]:e[t],e[t]["::type"],e[t]["::array-type"]||"",t,e[t]["::description"],f,m,e[t]["::readwrite"]?e[t]["::readwrite"]:"")}`:"":z`${this.generateTree("array"===e[t]["::type"]?e[t]["::props"]:e[t],e[t]["::type"],e[t]["::array-type"]||"",t,e[t]["::description"],f,m,e[t]["::readwrite"]?e[t]["::readwrite"]:"")}`}
              `))}
            `}
        </div>
        ${e["::type"]&&e["::type"].includes("xxx-of")?"":z`<div class='close-bracket'> ${h} </div>`}
      `;const[g,v,b,x,w,$,k,S,A]=e.split("~|~");if("🆁"===v&&"true"===this.schemaHideReadOnly)return;if("🆆"===v&&"true"===this.schemaHideWriteOnly)return;const O=g.replace(/┃.*/g,"").replace(/[^a-zA-Z0-9+]/g,"").substring(0,4).toLowerCase();let E="",T="";return"array"===t?"readonly"===s?(E="🆁",T="Read-Only"):"writeonly"===s&&(E="🆆",T="Write-Only"):"🆁"===v?(E="🆁",T="Read-Only"):"🆆"===v&&(E="🆆",T="Write-Only"),z`
      <div class = "tr primitive" title="${A?"Deprecated":""}">
        <div class="td key ${A}" style='min-width:${d}px'>
          ${A?z`<span style='color:var(--red);'>✗</span>`:""}
          ${c.endsWith("*")?z`<span class="key-label">${c.substring(0,c.length-1)}</span><span style='color:var(--red);'>*</span>:`:n.startsWith("::OPTION")?z`<span class='key-label xxx-of-key'>${c}</span><span class="xxx-of-descr">${p}</span>`:z`<span class="key-label">${c}:</span>`}
          <span class="${O}" title="${T}"> 
            ${"array"===t?`[${g}]`:`${g}`}
            ${E}
          </span>
        </div>
        <div class='td key-descr'>
          ${"array"===t?z`<span class="m-markdown-small">${QP(We(a))}</span>`:""}
          ${k?z`<span class="m-markdown-small">
              ${QP(We(`${S?`**${S}:**`:""} ${k} ${b||x||w||$?'<span class="more-content">⤵</span>':""}`))}
              </span>`:S?z`${S} ${b||x||w||$?z`<span class="more-content">⤵</span>`:""}`:""}
          ${b?z`<div style='display:inline-block; line-break:anywhere; margin-right:8px'><span class='bold-text'>Constraints: </span>${b}</div>`:""}
          ${x?z`<div style='display:inline-block; line-break:anywhere; margin-right:8px'><span class='bold-text'>Default: </span>${x}</div>`:""}
          ${w?z`<div style='display:inline-block; line-break:anywhere; margin-right:8px'><span class='bold-text'>Allowed: </span>${w}</div>`:""}
          ${$?z`<div style='display:inline-block; line-break: anywhere; margin-right:8px'><span class='bold-text'>Pattern: </span>${$}</div>`:""}
        </div>
      </div>
    `}toggleObjectExpand(e){const t=e.target.closest(".tr");t.classList.contains("expanded")?(t.classList.replace("expanded","collapsed"),e.target.innerHTML=e.target.classList.contains("array-of-object")?"[{...}]":e.target.classList.contains("array-of-array")?"[[...]]":e.target.classList.contains("array")?"[...]":"{...}"):(t.classList.replace("collapsed","expanded"),e.target.innerHTML=e.target.classList.contains("array-of-object")?"[{":e.target.classList.contains("array-of-array")?`[[ ${e.target.dataset.arrayType}`:e.target.classList.contains("object")?"{":"[")}});customElements.define("tag-input",class extends ie{render(){let e="";return Array.isArray(this.value)&&(e=z`${this.value.filter((e=>""!==e.trim())).map((e=>z`<span class='tag'>${e}</span>`))}`),z`
      <div class='tags' tabindex="0">
        ${e}
        <input type="text" class='editor' @paste="${e=>this.afterPaste(e)}" @keydown="${this.afterKeyDown}" @blur="${this.onBlur}" placeholder="${this.placeholder||""}">
      </div>
    `}static get properties(){return{placeholder:{type:String},value:{type:Array,attribute:"value"}}}attributeChangedCallback(e,t,r){"value"===e&&r&&t!==r&&(this.value=r.split(",").filter((e=>""!==e.trim()))),super.attributeChangedCallback(e,t,r)}afterPaste(e){const t=(e.clipboardData||window.clipboardData).getData("Text"),r=t?t.split(",").filter((e=>""!==e.trim())):"";r&&(Array.isArray(this.value)?this.value=[...this.value,...r]:this.value=r),e.preventDefault()}afterKeyDown(e){13===e.keyCode?(e.stopPropagation(),e.preventDefault(),e.target.value&&(Array.isArray(this.value)?this.value=[...this.value,e.target.value]:this.value=[e.target.value],e.target.value="")):8===e.keyCode&&0===e.target.value.length&&Array.isArray(this.value)&&this.value.length>0&&(this.value.splice(-1),this.value=[...this.value])}onBlur(e){e.target.value&&(Array.isArray(this.value)?this.value=[...this.value,e.target.value]:this.value=[e.target.value],e.target.value="")}static get styles(){return[c`
      .tags{
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
      .editor{
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
      .editor::placeholder {
        color: var(--placeholder-color);
        opacity:1;
      }
    `]}});customElements.define("api-request",class extends ie{constructor(){super(),this.responseMessage="",this.responseStatus="success",this.responseHeaders="",this.responseText="",this.responseUrl="",this.curlSyntax="",this.activeResponseTab="response",this.selectedRequestBodyType="",this.selectedRequestBodyExample="",this.activeParameterSchemaTabs={}}static get properties(){return{serverUrl:{type:String,attribute:"server-url"},servers:{type:Array},method:{type:String},path:{type:String},security:{type:Array},parameters:{type:Array},request_body:{type:Object},api_keys:{type:Array},parser:{type:Object},accept:{type:String},callback:{type:String},webhook:{type:String},responseMessage:{type:String,attribute:!1},responseText:{type:String,attribute:!1},responseHeaders:{type:String,attribute:!1},responseStatus:{type:String,attribute:!1},responseUrl:{type:String,attribute:!1},fillRequestFieldsWithExample:{type:String,attribute:"fill-request-fields-with-example"},allowTry:{type:String,attribute:"allow-try"},renderStyle:{type:String,attribute:"render-style"},schemaStyle:{type:String,attribute:"schema-style"},activeSchemaTab:{type:String,attribute:"active-schema-tab"},activeParameterSchemaTabs:{type:Object,converter:{fromAttribute:e=>JSON.parse(e),toAttribute:e=>JSON.stringify(e)},attribute:"active-parameter-schema-tabs"},schemaExpandLevel:{type:Number,attribute:"schema-expand-level"},schemaDescriptionExpanded:{type:String,attribute:"schema-description-expanded"},allowSchemaDescriptionExpandToggle:{type:String,attribute:"allow-schema-description-expand-toggle"},schemaHideReadOnly:{type:String,attribute:"schema-hide-read-only"},schemaHideWriteOnly:{type:String,attribute:"schema-hide-write-only"},fetchCredentials:{type:String,attribute:"fetch-credentials"},activeResponseTab:{type:String},selectedRequestBodyType:{type:String,attribute:"selected-request-body-type"},selectedRequestBodyExample:{type:String,attribute:"selected-request-body-example"}}}static get styles(){return[Ze,Je,Ke,Ye,kI,et,Xe,c`
        *, *:before, *:after { box-sizing: border-box; }
    
        .read-mode {
          margin-top: 24px;
        }
        .param-name,
        .param-type {
          margin: 1px 0;
          text-align: right;
          line-height: var(--font-size-small);
        }
        .param-name {
          color: var(--fg); 
          font-family: var(--font-mono);
        }
        .param-name.deprecated { 
          color: var(--red);
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
      `,nt]}render(){return z`
    <div class="col regular-font request-panel ${"read focused".includes(this.renderStyle)||"true"===this.callback?"read-mode":"view-mode"}">
      <div class=" ${"true"===this.callback?"tiny-title":"req-res-title"} "> 
        ${"true"===this.callback?"CALLBACK REQUEST":"REQUEST"}
      </div>
      <div>
        ${gI([this.method,this.path,this.allowTry,this.parameters,this.activeParameterSchemaTabs],(()=>this.inputParametersTemplate("path")))}
        ${gI([this.method,this.path,this.allowTry,this.parameters,this.activeParameterSchemaTabs],(()=>this.inputParametersTemplate("query")))}
        ${this.requestBodyTemplate()}
        ${gI([this.method,this.path,this.allowTry,this.parameters,this.activeParameterSchemaTabs],(()=>this.inputParametersTemplate("header")))}
        ${gI([this.method,this.path,this.allowTry,this.parameters,this.activeParameterSchemaTabs],(()=>this.inputParametersTemplate("cookie")))}
        ${"false"===this.allowTry?"":z`${this.apiCallTemplate()}`}
      </div>  
    </div>
    `}async saveExampleState(){if("focused"===this.renderStyle){[...this.shadowRoot.querySelectorAll("textarea.request-body-param-user-input")].forEach((e=>{e.dataset.user_example=e.value}));[...this.shadowRoot.querySelectorAll('textarea[data-ptype="form-data"]')].forEach((e=>{e.dataset.user_example=e.value})),this.requestUpdate()}}async updateExamplesFromDataAttr(){if("focused"===this.renderStyle){[...this.shadowRoot.querySelectorAll("textarea.request-body-param-user-input")].forEach((e=>{e.value=e.dataset.user_example||e.dataset.example}));[...this.shadowRoot.querySelectorAll('textarea[data-ptype="form-data"]')].forEach((e=>{e.value=e.dataset.user_example||e.dataset.example})),this.requestUpdate()}}renderExample(e,t,r){var n,a;return z`
      ${"array"===t?"[":""}
      <a
        part="anchor anchor-param-example"
        class="${"true"===this.allowTry?"":"inactive-link"}"
        data-example-type="${"array"===t?t:"string"}"
        data-example="${e.value&&Array.isArray(e.value)?null===(n=e.value)||void 0===n?void 0:n.join("~|~"):e.value||""}"
        @click="${e=>{const t=e.target.closest("table").querySelector(`[data-pname="${r}"]`);t&&("array"===e.target.dataset.exampleType?t.value=e.target.dataset.example.split("~|~"):t.value=e.target.dataset.example)}}"
      >
        ${e.value&&Array.isArray(e.value)?null===(a=e.value)||void 0===a?void 0:a.join(", "):e.value||"∅"}
      </a>
      ${"array"===t?"] ":""}
    `}renderShortFormatExamples(e,t,r){return z`${e.map(((e,n)=>z`
      ${0===n?"":"┃"}
      ${this.renderExample(e,t,r)}`))}`}renderLongFormatExamples(e,t,r){return z` <ul style="list-style-type: disclosure-closed;">
      ${e.map((e=>{var n,a;return z`
          <li>
            ${this.renderExample(e,t,r)}
            ${(null===(n=e.summary)||void 0===n?void 0:n.length)>0?z`<span>&lpar;${e.summary}&rpar;</span>`:""}
            ${(null===(a=e.description)||void 0===a?void 0:a.length)>0?z`<p>${QP(We(e.description))}</p>`:""}
          </li>
        `}))}
    </ul>`}exampleListTemplate(e,t,r=[]){return z` ${r.length>0?z`<span style="font-weight:bold">Examples: </span>
          ${n=r,n.some((e=>{var t,r;return(null===(t=e.summary)||void 0===t?void 0:t.length)>0||(null===(r=e.description)||void 0===r?void 0:r.length)>0}))?this.renderLongFormatExamples(r,t,e):this.renderShortFormatExamples(r,t,e)}`:""}`;var n}inputParametersTemplate(e){const t=this.parameters?this.parameters.filter((t=>t.in===e)):[];if(0===t.length)return"";let r="";"path"===e?r="PATH PARAMETERS":"query"===e?r="QUERY-STRING PARAMETERS":"header"===e?r="REQUEST HEADERS":"cookie"===e&&(r="COOKIES");const n=[];for(const r of t){const[t,a,o]=NI(r);if(!t)continue;const i=SI(t);if(!i)continue;const s=LI(t,{});let l="form",c=!0,p=!1;"query"===e&&(r.style&&"form spaceDelimited pipeDelimited".includes(r.style)?l=r.style:a&&(l=a),"boolean"==typeof r.explode&&(c=r.explode),"boolean"==typeof r.allowReserved&&(p=r.allowReserved));const d=OI(r.examples||AI(r.example)||AI(null==o?void 0:o.example)||(null==o?void 0:o.examples)||i.examples||AI(i.example),i.type);d.exampleVal||"object"!==i.type||(d.exampleVal=DI(t,a||"json","","","true"===this.callback||"true"===this.webhook,"true"!==this.callback&&"true"!==this.webhook,!0,"text")[0].exampleValue);const u="read focused".includes(this.renderStyle)?"200px":"160px";n.push(z`
      <tr title="${r.deprecated?"Deprecated":""}"> 
        <td rowspan="${"true"===this.allowTry?"1":"2"}" style="width:${u}; min-width:100px;">
          <div class="param-name ${r.deprecated?"deprecated":""}" >
            ${r.deprecated?z`<span style='color:var(--red);'>✗</span>`:""}
            ${r.required?z`<span style='color:var(--red)'>*</span>`:""}
            ${r.name}
          </div>
          <div class="param-type">
            ${"array"===i.type?`${i.arrayType}`:`${i.format?i.format:i.type}`}
          </div>
        </td>  
        ${"true"===this.allowTry?z`
            <td style="min-width:100px;" colspan="${i.default||i.constrain||i.allowedValues||i.pattern?"1":"2"}">
              ${"array"===i.type?z`
                  <tag-input class="request-param" 
                    style = "width:100%" 
                    data-ptype = "${e}"
                    data-pname = "${r.name}"
                    data-example = "${Array.isArray(d.exampleVal)?d.exampleVal.join("~|~"):d.exampleVal}"
                    data-param-serialize-style = "${l}"
                    data-param-serialize-explode = "${c}"
                    data-param-allow-reserved = "${p}"
                    data-x-fill-example = "${r["x-fill-example"]||"yes"}"
                    data-array = "true"
                    placeholder = "add-multiple &#x21a9;"
                    .value="${"no"===r["x-fill-example"]?[]:xI("true"===this.fillRequestFieldsWithExample?Array.isArray(d.exampleVal)?d.exampleVal:[d.exampleVal]:[])}"
                  >
                  </tag-input>`:"object"===i.type?z`
                    <div class="tab-panel col" style="border-width:0 0 1px 0;">
                      <div class="tab-buttons row" @click="${e=>{if("button"===e.target.tagName.toLowerCase()){const t={...this.activeParameterSchemaTabs};t[r.name]=e.target.dataset.tab,this.activeParameterSchemaTabs=t}}}">
                        <button class="tab-btn ${"example"===this.activeParameterSchemaTabs[r.name]?"active":""}" data-tab = 'example'>EXAMPLE </button>
                        <button class="tab-btn ${"example"!==this.activeParameterSchemaTabs[r.name]?"active":""}" data-tab = 'schema'>SCHEMA</button>
                      </div>
                      ${"example"===this.activeParameterSchemaTabs[r.name]?z`<div class="tab-content col">
                          <textarea 
                            class = "textarea request-param"
                            part = "textarea textarea-param"
                            data-ptype = "${e}-object"
                            data-pname = "${r.name}"
                            data-example = "${d.exampleVal}"
                            data-param-serialize-style = "${l}"
                            data-param-serialize-explode = "${c}"
                            data-param-allow-reserved = "${p}"
                            data-x-fill-example = "${r["x-fill-example"]||"yes"}"
                            spellcheck = "false"
                            .textContent="${"no"===r["x-fill-example"]?"":xI("true"===this.fillRequestFieldsWithExample?d.exampleVal:"")}"
                            style = "resize:vertical; width:100%; height: ${"read focused".includes(this.renderStyle)?"180px":"120px"};"
                          ></textarea>
                        </div>`:z`
                          <div class="tab-content col">
                            <schema-tree
                              class = 'json'
                              style = 'display: block'
                              .data = '${s}'
                              schema-expand-level = "${this.schemaExpandLevel}"
                              schema-description-expanded = "${this.schemaDescriptionExpanded}"
                              allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
                              schema-hide-read-only = "${this.schemaHideReadOnly.includes(this.method)}"
                              schema-hide-write-only = "${this.schemaHideWriteOnly.includes(this.method)}"
                              exportparts = "wrap-request-btn:wrap-request-btn, btn:btn, btn-fill:btn-fill, btn-outline:btn-outline, btn-try:btn-try, btn-clear:btn-clear, btn-clear-resp:btn-clear-resp,
                                file-input:file-input, textbox:textbox, textbox-param:textbox-param, textarea:textarea, textarea-param:textarea-param, 
                                anchor:anchor, anchor-param-example:anchor-param-example"
                            > </schema-tree>
                          </div>`}
                    </div>`:z`
                    <input type="${"password"===i.format?"password":"text"}" spellcheck="false" style="width:100%" 
                      class="request-param"
                      part="textbox textbox-param"
                      data-ptype="${e}"
                      data-pname="${r.name}" 
                      data-example="${Array.isArray(d.exampleVal)?d.exampleVal.join("~|~"):d.exampleVal}"
                      data-param-allow-reserved = "${p}"
                      data-x-fill-example = "${r["x-fill-example"]||"yes"}"
                      data-array="false"
                      .value="${"no"===r["x-fill-example"]?"":xI("true"===this.fillRequestFieldsWithExample?d.exampleVal:"")}"
                    />`}
            </td>`:""}
        ${i.default||i.constrain||i.allowedValues||i.pattern?z`
            <td colspan="${"true"===this.allowTry?"1":"2"}">
              <div class="param-constraint">
                ${i.default?z`<span style="font-weight:bold">Default: </span>${i.default}<br/>`:""}
                ${i.pattern?z`<span style="font-weight:bold">Pattern: </span>${i.pattern}<br/>`:""}
                ${i.constrain?z`${i.constrain}<br/>`:""}
                ${i.allowedValues&&i.allowedValues.split("┃").map(((e,t)=>z`
                  ${t>0?"┃":z`<span style="font-weight:bold">Allowed: </span>`}
                  ${z`
                    <a part="anchor anchor-param-constraint" class = "${"true"===this.allowTry?"":"inactive-link"}"
                      data-type="${"array"===i.type?i.type:"string"}"
                      data-enum="${e.trim()}"
                      @click="${e=>{const t=e.target.closest("table").querySelector(`[data-pname="${r.name}"]`);t&&("array"===e.target.dataset.type?t.value=[e.target.dataset.enum]:t.value=e.target.dataset.enum)}}"
                    >${e}</a>`}`))}
              </div>
            </td>`:z`<td></td>`}
      </tr>
      <tr>
        ${"true"===this.allowTry?z`<td style="border:none"> </td>`:""}
        <td colspan="2" style="border:none">
          <span class="m-markdown-small">${QP(We(r.description||""))}</span>
          ${this.exampleListTemplate.call(this,r.name,i.type,d.exampleList)}
        </td>
      </tr>
    `)}return z`
    <div class="table-title top-gap">${r}</div>
    <div style="display:block; overflow-x:auto; max-width:100%;">
      <table role="presentation" class="m-table" style="width:100%; word-break:break-word;">
        ${n}
      </table>
    </div>`}async beforerNavigationFocusedMode(){}async afterNavigationFocusedMode(){this.selectedRequestBodyType="",this.selectedRequestBodyExample="",this.updateExamplesFromDataAttr(),this.clearResponseData()}onSelectExample(e){this.selectedRequestBodyExample=e.target.value;const t=e.target;window.setTimeout((e=>{const t=e.closest(".example-panel").querySelector(".request-body-param");e.closest(".example-panel").querySelector(".request-body-param-user-input").value=t.innerText}),0,t)}onMimeTypeChange(e){this.selectedRequestBodyType=e.target.value;const t=e.target;this.selectedRequestBodyExample="",window.setTimeout((e=>{const t=e.closest(".request-body-container").querySelector(".request-body-param");if(t){e.closest(".request-body-container").querySelector(".request-body-param-user-input").value=t.innerText}}),0,t)}requestBodyTemplate(){if(!this.request_body)return"";if(0===Object.keys(this.request_body).length)return"";let e="",t="",r="",n="",a="";const o=[],{content:i}=this.request_body;for(const e in i)o.push({mimeType:e,schema:i[e].schema,example:i[e].example,examples:i[e].examples}),this.selectedRequestBodyType||(this.selectedRequestBodyType=e);return e=1===o.length?"":z`
        <select style="min-width:100px; max-width:100%;  margin-bottom:-1px;" @change = '${e=>this.onMimeTypeChange(e)}'>
          ${o.map((e=>z`
            <option value = '${e.mimeType}' ?selected = '${e.mimeType===this.selectedRequestBodyType}'>
              ${e.mimeType}
            </option> `))}
        </select>
      `,o.forEach((e=>{let o,i=[];if(this.selectedRequestBodyType.includes("json")||this.selectedRequestBodyType.includes("xml")||this.selectedRequestBodyType.includes("text")||this.selectedRequestBodyType.includes("jose"))e.mimeType===this.selectedRequestBodyType&&(i=DI(e.schema,e.mimeType,e.examples,e.example,"true"===this.callback||"true"===this.webhook,"true"!==this.callback&&"true"!==this.webhook,"text",!1),this.selectedRequestBodyExample||(this.selectedRequestBodyExample=i.length>0?i[0].exampleId:""),a=z`
            ${a}
            <div class = 'example-panel border-top pad-top-8'>
              ${1===i.length?"":z`
                  <select style="min-width:100px; max-width:100%;  margin-bottom:-1px;" @change='${e=>this.onSelectExample(e)}'>
                    ${i.map((e=>z`<option value="${e.exampleId}" ?selected=${e.exampleId===this.selectedRequestBodyExample} > 
                      ${e.exampleSummary.length>80?e.exampleId:e.exampleSummary?e.exampleSummary:e.exampleId} 
                    </option>`))}
                  </select>
                `}
              ${i.filter((e=>e.exampleId===this.selectedRequestBodyExample)).map((t=>z`
                <div class="example ${t.exampleId===this.selectedRequestBodyExample?"example-selected":""}" data-example = '${t.exampleId}'>
                  ${t.exampleSummary&&t.exampleSummary.length>80?z`<div style="padding: 4px 0"> ${t.exampleSummary} </div>`:""}
                  ${t.exampleDescription?z`<div class="m-markdown-small" style="padding: 4px 0"> ${QP(We(t.exampleDescription||""))} </div>`:""}
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
                  ></textarea>
                </div>  
              `))}

            </div>
          `);else if(this.selectedRequestBodyType.includes("form-urlencoded")||this.selectedRequestBodyType.includes("form-data")){if(e.mimeType===this.selectedRequestBodyType){const t=DI(e.schema,e.mimeType,e.examples,e.example,"true"===this.callback||"true"===this.webhook,"true"!==this.callback&&"true"!==this.webhook,"text",!1);e.schema&&(r=this.formDataTemplate(e.schema,e.mimeType,t[0]?t[0].exampleValue:""))}}else/^audio\/|^image\/|^video\/|^font\/|tar$|zip$|7z$|rtf$|msword$|excel$|\/pdf$|\/octet-stream$/.test(this.selectedRequestBodyType)&&e.mimeType===this.selectedRequestBodyType&&(t=z`
            <div class = "small-font-size bold-text row">
              <input type="file" part="file-input" style="max-width:100%" class="request-body-param-file" data-ptype="${e.mimeType}" spellcheck="false" />
            </div>  
          `);(e.mimeType.includes("json")||e.mimeType.includes("xml")||e.mimeType.includes("text")||this.selectedRequestBodyType.includes("jose"))&&(o=LI(e.schema,{}),"table"===this.schemaStyle?n=z`
            ${n}
            <schema-table
              class = '${e.mimeType.substring(e.mimeType.indexOf("/")+1)}'
              style = 'display: ${this.selectedRequestBodyType===e.mimeType?"block":"none"};'
              .data = '${o}'
              schema-expand-level = "${this.schemaExpandLevel}"
              schema-description-expanded = "${this.schemaDescriptionExpanded}"
              allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
              schema-hide-read-only = "${this.schemaHideReadOnly}"
              schema-hide-write-only = "${this.schemaHideWriteOnly}"
              exportparts = "schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
            > </schema-table>
          `:"tree"===this.schemaStyle&&(n=z`
            ${n}
            <schema-tree
              class = "${e.mimeType.substring(e.mimeType.indexOf("/")+1)}"
              style = "display: ${this.selectedRequestBodyType===e.mimeType?"block":"none"};"
              .data = "${o}"
              schema-expand-level = "${this.schemaExpandLevel}"
              schema-description-expanded = "${this.schemaDescriptionExpanded}"
              allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
              schema-hide-read-only = "${this.schemaHideReadOnly}"
              schema-hide-write-only = "${this.schemaHideWriteOnly}"
              exportparts = "schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
            > </schema-tree>
          `))})),z`
      <div class='request-body-container' data-selected-request-body-type="${this.selectedRequestBodyType}">
        <div class="table-title top-gap row">
          REQUEST BODY ${this.request_body.required?z`<span class="mono-font" style='color:var(--red)'>*</span>`:""} 
          <span style = "font-weight:normal; margin-left:5px"> ${this.selectedRequestBodyType}</span>
          <span style="flex:1"></span>
          ${e}
        </div>
        ${this.request_body.description?z`<div class="m-markdown" style="margin-bottom:12px">${QP(We(this.request_body.description))}</div>`:""}
        
        ${this.selectedRequestBodyType.includes("json")||this.selectedRequestBodyType.includes("xml")||this.selectedRequestBodyType.includes("text")||this.selectedRequestBodyType.includes("jose")?z`
            <div class="tab-panel col" style="border-width:0 0 1px 0;">
              <div class="tab-buttons row" @click="${e=>{"button"===e.target.tagName.toLowerCase()&&(this.activeSchemaTab=e.target.dataset.tab)}}">
                <button class="tab-btn ${"example"===this.activeSchemaTab?"active":""}" data-tab = 'example'>EXAMPLE</button>
                <button class="tab-btn ${"example"!==this.activeSchemaTab?"active":""}" data-tab = 'schema'>SCHEMA</button>
              </div>
              ${z`<div class="tab-content col" style="display:${"example"===this.activeSchemaTab?"block":"none"};"> ${a}</div>`}
              ${z`<div class="tab-content col" style="display:${"example"===this.activeSchemaTab?"none":"block"};"> ${n}</div>`}
            </div>`:z`  
            ${t}
            ${r}`}
      </div>  
    `}formDataParamAsObjectTemplate(e,t,r){var n;const a=LI(t,{}),o=DI(t,"json",t.examples,t.example,"true"===this.callback||"true"===this.webhook,"true"!==this.callback&&"true"!==this.webhook,"text",!1);return z`
      <div class="tab-panel row" style="min-height:220px; border-left: 6px solid var(--light-border-color); align-items: stretch;">
        <div style="width:24px; background-color:var(--light-border-color)">
          <div class="row" style="flex-direction:row-reverse; width:160px; height:24px; transform:rotate(270deg) translateX(-160px); transform-origin:top left; display:block;" @click="${e=>{if(e.target.classList.contains("v-tab-btn")){const{tab:t}=e.target.dataset;if(t){const r=e.target.closest(".tab-panel"),n=r.querySelector(`.v-tab-btn[data-tab="${t}"]`),a=[...r.querySelectorAll(`.v-tab-btn:not([data-tab="${t}"])`)],o=r.querySelector(`.tab-content[data-tab="${t}"]`),i=[...r.querySelectorAll(`.tab-content:not([data-tab="${t}"])`)];n.classList.add("active"),o.style.display="block",a.forEach((e=>{e.classList.remove("active")})),i.forEach((e=>{e.style.display="none"}))}}"button"===e.target.tagName.toLowerCase()&&(this.activeSchemaTab=e.target.dataset.tab)}}">
          <button class="v-tab-btn ${"example"===this.activeSchemaTab?"active":""}" data-tab = 'example'>EXAMPLE</button>
          <button class="v-tab-btn ${"example"!==this.activeSchemaTab?"active":""}" data-tab = 'schema'>SCHEMA</button>
        </div>
      </div>
      ${z`
        <div class="tab-content col" data-tab = 'example' style="display:${"example"===this.activeSchemaTab?"block":"none"}; padding-left:5px; width:100%"> 
          <textarea 
            class = "textarea"
            part = "textarea textarea-param"
            style = "width:100%; border:none; resize:vertical;" 
            data-array = "false" 
            data-ptype = "${r.includes("form-urlencode")?"form-urlencode":"form-data"}"
            data-pname = "${e}"
            data-example = "${(null===(n=o[0])||void 0===n?void 0:n.exampleValue)||""}"
            .textContent = "${"true"===this.fillRequestFieldsWithExample?o[0].exampleValue:""}"
            spellcheck = "false"
          ></textarea>
        </div>`}
      ${z`
        <div class="tab-content col" data-tab = 'schema' style="display:${"example"!==this.activeSchemaTab?"block":"none"}; padding-left:5px; width:100%;"> 
          <schema-tree
            .data = '${a}'
            schema-expand-level = "${this.schemaExpandLevel}"
            schema-description-expanded = "${this.schemaDescriptionExpanded}"
            allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}",
          > </schema-tree>
        </div>`}
      </div>
    `}formDataTemplate(e,t,r=""){const n=[];if(e.properties){for(const r in e.properties){var a,o;const i=e.properties[r];if(i.readOnly)continue;const s=i.examples||i.example||"",l=i.type,c=SI(i),p="read focused".includes(this.renderStyle)?"200px":"160px",d=OI(c.examples||c.example,c.type);n.push(z`
        <tr title="${i.deprecated?"Deprecated":""}"> 
          <td style="width:${p}; min-width:100px;">
            <div class="param-name ${i.deprecated?"deprecated":""}">
              ${r}${null!==(a=e.required)&&void 0!==a&&a.includes(r)||i.required?z`<span style='color:var(--red);'>*</span>`:""}
            </div>
            <div class="param-type">${c.type}</div>
          </td>  
          <td 
            style="${"object"===l?"width:100%; padding:0;":"true"===this.allowTry?"":"display:none;"} min-width:100px;" 
            colspan="${"object"===l?2:1}">
            ${"array"===l?"binary"===(null===(o=i.items)||void 0===o?void 0:o.format)?z`
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
                `:z`
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
                `:z`
                ${"object"===l?this.formDataParamAsObjectTemplate.call(this,r,i,t):z`
                    ${"true"===this.allowTry?z`<input
                          .value = "${"true"===this.fillRequestFieldsWithExample?d.exampleVal:""}"
                          spellcheck = "false"
                          type = "${"binary"===i.format?"file":"password"===i.format?"password":"text"}"
                          part = "textbox textbox-param"
                          style = "width:100%"
                          data-ptype = "${t.includes("form-urlencode")?"form-urlencode":"form-data"}"
                          data-pname = "${r}"
                          data-example = "${Array.isArray(s)?s[0]:s}"
                          data-array = "false"
                        />`:""}
                    `}`}
          </td>
          ${"object"===l?"":z`
              <td>
                ${c.default||c.constrain||c.allowedValues||c.pattern?z`
                    <div class="param-constraint">
                      ${c.default?z`<span style="font-weight:bold">Default: </span>${c.default}<br/>`:""}
                      ${c.pattern?z`<span style="font-weight:bold">Pattern: </span>${c.pattern}<br/>`:""}
                      ${c.constrain?z`${c.constrain}<br/>`:""}
                      ${c.allowedValues&&c.allowedValues.split("┃").map(((e,t)=>z`
                        ${t>0?"┃":z`<span style="font-weight:bold">Allowed: </span>`}
                        ${z`
                          <a part="anchor anchor-param-constraint" class = "${"true"===this.allowTry?"":"inactive-link"}"
                            data-type="${"array"===c.type?c.type:"string"}"
                            data-enum="${e.trim()}"
                            @click="${e=>{const t=e.target.closest("table").querySelector(`[data-pname="${r}"]`);t&&("array"===e.target.dataset.type?t.value=[e.target.dataset.enum]:t.value=e.target.dataset.enum)}}"
                          > 
                            ${e} 
                          </a>`}`))}
                    </div>`:""}
              </td>`}
        </tr>
        ${"object"===l?"":z`
            <tr>
              <td style="border:none"> </td>
              <td colspan="2" style="border:none; margin-top:0; padding:0 5px 8px 5px;"> 
                <span class="m-markdown-small">${QP(We(i.description||""))}</span>
                ${this.exampleListTemplate.call(this,r,c.type,d.exampleList)}
              </td>
            </tr>
          `}`)}return z`
        <table role="presentation" style="width:100%;" class="m-table">
          ${n}
        </table>
      `}return z`
      <textarea
        class = "textarea dynamic-form-param ${t}"
        part = "textarea textarea-param"
        spellcheck = "false"
        data-pname="dynamic-form" 
        data-ptype="${t}"
        .textContent = "${r}"
        style="width:100%"
      ></textarea>
      ${e.description?z`<span class="m-markdown-small">${QP(We(e.description))}</span>`:""}
    `}apiResponseTabTemplate(){let e="",t="";if(!this.responseIsBlob)if(this.responseHeaders.includes("application/x-ndjson")){e="json";const r=this.responseText.split("\n").map((t=>Ge().highlight(t,Ge().languages[e],e))).join("\n");t=z`<code>${QP(r)}</code>`}else this.responseHeaders.includes("json")?(e="json",t=z`<code>${QP(Ge().highlight(this.responseText,Ge().languages[e],e))}</code>`):this.responseHeaders.includes("html")||this.responseHeaders.includes("xml")?(e="html",t=z`<code>${QP(Ge().highlight(this.responseText,Ge().languages[e],e))}</code>`):(e="text",t=z`<code>${this.responseText}</code>`);return z`
      <div class="row" style="font-size:var(--font-size-small); margin:5px 0">
        <div class="response-message ${this.responseStatus}">Response Status: ${this.responseMessage}</div>
        <div style="flex:1"></div>
        <button class="m-btn" part="btn btn-outline btn-clear-response" @click="${this.clearResponseData}">CLEAR RESPONSE</button>
      </div>
      <div class="tab-panel col" style="border-width:0 0 1px 0;">
        <div id="tab_buttons" class="tab-buttons row" @click="${e=>{!1!==e.target.classList.contains("tab-btn")&&(this.activeResponseTab=e.target.dataset.tab)}}">
          <button class="tab-btn ${"response"===this.activeResponseTab?"active":""}" data-tab = 'response' > RESPONSE</button>
          <button class="tab-btn ${"headers"===this.activeResponseTab?"active":""}"  data-tab = 'headers' > RESPONSE HEADERS</button>
          <button class="tab-btn ${"curl"===this.activeResponseTab?"active":""}" data-tab = 'curl'>CURL</button>
        </div>
        ${this.responseIsBlob?z`
            <div class="tab-content col" style="flex:1; display:${"response"===this.activeResponseTab?"flex":"none"};">
              <button class="m-btn thin-border mar-top-8" style="width:135px" @click='${e=>{pt(this.responseBlobUrl,this.respContentDisposition)}}' part="btn btn-outline">
                DOWNLOAD
              </button>
              ${"view"===this.responseBlobType?z`<button class="m-btn thin-border mar-top-8" style="width:135px"  @click='${e=>{dt(this.responseBlobUrl)}}' part="btn btn-outline">VIEW (NEW TAB)</button>`:""}
            </div>`:z`
            <div class="tab-content col m-markdown" style="flex:1; display:${"response"===this.activeResponseTab?"flex":"none"};" >
              <button class="toolbar-btn" style="position:absolute; top:12px; right:8px" @click='${e=>{st(this.responseText,e)}}' part="btn btn-fill"> Copy </button>
              <pre style="white-space:pre; min-height:50px; height:var(--resp-area-height, 400px); resize:vertical; overflow:auto">${t}</pre>
            </div>`}
        <div class="tab-content col m-markdown" style="flex:1; display:${"headers"===this.activeResponseTab?"flex":"none"};" >
          <button  class="toolbar-btn" style = "position:absolute; top:12px; right:8px" @click='${e=>{st(this.responseHeaders,e)}}' part="btn btn-fill"> Copy </button>
          <pre style="white-space:pre"><code>${QP(Ge().highlight(this.responseHeaders,Ge().languages.css,"css"))}</code></pre>
        </div>
        <div class="tab-content col m-markdown" style="flex:1; display:${"curl"===this.activeResponseTab?"flex":"none"};">
          <button  class="toolbar-btn" style = "position:absolute; top:12px; right:8px" @click='${e=>{st(this.curlSyntax.replace(/\\$/,""),e)}}' part="btn btn-fill"> Copy </button>
          <pre style="white-space:pre"><code>${QP(Ge().highlight(this.curlSyntax.trim().replace(/\\$/,""),Ge().languages.shell,"shell"))}</code></pre>
        </div>
      </div>`}apiCallTemplate(){var e,t;let r="";this.servers&&this.servers.length>0&&(r=z`
        <select style="min-width:100px;" @change='${e=>{this.serverUrl=e.target.value}}'>
          ${this.servers.map((e=>z`<option value = "${e.url}"> ${e.url} - ${e.description} </option>`))}
        </select>
      `);const n=z`
      <div style="display:flex; flex-direction:column;">
        ${r}
        ${this.serverUrl?z`
            <div style="display:flex; align-items:baseline;">
              <div style="font-weight:bold; padding-right:5px;">API Server</div> 
              <span class = "gray-text"> ${this.serverUrl} </span>
            </div>
          `:""}
      </div>  
    `;return z`
    <div style="display:flex; align-items:flex-end; margin:16px 0; font-size:var(--font-size-small);" part="wrap-request-btn">
      <div class="hide-in-small-screen" style="flex-direction:column; margin:0; width:calc(100% - 60px);">
        <div style="display:flex; flex-direction:row; align-items:center; overflow:hidden;"> 
          ${n}
        </div>
        <div style="display:flex;">
          <div style="font-weight:bold; padding-right:5px;">Authentication</div>
          ${(null===(e=this.security)||void 0===e?void 0:e.length)>0?z`
              ${this.api_keys.length>0?z`<div style="color:var(--blue); overflow:hidden;"> 
                    ${1===this.api_keys.length?`${null===(t=this.api_keys[0])||void 0===t?void 0:t.typeDisplay} in ${this.api_keys[0].in}`:`${this.api_keys.length} API keys applied`} 
                  </div>`:z`<div class="gray-text">Required  <span style="color:var(--red)">(None Applied)</span>`}`:z`<span class="gray-text"> Not Required </span>`}
        </div>
      </div>
      ${this.parameters.length>0||this.request_body?z`
            <button class="m-btn thin-border" part="btn btn-outline btn-fill" style="margin-right:5px;" @click="${this.onFillRequestData}" title="Fills with example data (if provided)">
              FILL EXAMPLE
            </button>
            <button class="m-btn thin-border" part="btn btn-outline btn-clear" style="margin-right:5px;" @click="${this.onClearRequestData}">
              CLEAR
            </button>`:""}
      <button class="m-btn primary thin-border" part="btn btn-try" @click="${this.onTryClick}">TRY</button>
    </div>
    ${""===this.responseMessage?"":this.apiResponseTabTemplate()}
    `}async onFillRequestData(e){[...e.target.closest(".request-panel").querySelectorAll("input, tag-input, textarea:not(.is-hidden)")].forEach((e=>{e.dataset.example&&("TAG-INPUT"===e.tagName.toUpperCase()?e.value=e.dataset.example.split("~|~"):e.value=e.dataset.example)}))}async onClearRequestData(e){[...e.target.closest(".request-panel").querySelectorAll("input, tag-input, textarea:not(.is-hidden)")].forEach((e=>{e.value=""}))}async onTryClick(e){var t;const r=e.target;let n,a,o="",i="",s="",l="";const c=null===(t=this.closest(".expanded-req-resp-container, .req-resp-container"))||void 0===t?void 0:t.getElementsByTagName("api-response")[0],p=null==c?void 0:c.selectedMimeType,d=e.target.closest(".request-panel"),u=[...d.querySelectorAll("[data-ptype='path']")],h=[...d.querySelectorAll("[data-ptype='query']")],f=[...d.querySelectorAll("[data-ptype='query-object']")],m=[...d.querySelectorAll("[data-ptype='header']")],y=d.querySelector(".request-body-container");n=this.path;const g={method:this.method.toUpperCase()};u.map((e=>{n=n.replace(`{${e.dataset.pname}}`,encodeURIComponent(e.value))}));const v=new Map,b=[];h.length>0&&h.forEach((e=>{const t=new URLSearchParams;if("true"===e.dataset.paramAllowReserved&&b.push(e.dataset.pname),"false"===e.dataset.array)""!==e.value&&t.append(e.dataset.pname,e.value);else{const{paramSerializeStyle:r,paramSerializeExplode:n}=e.dataset;let a=e.value&&Array.isArray(e.value)?e.value:[];a=Array.isArray(a)?a.filter((e=>""!==e)):[],a.length>0&&("spaceDelimited"===r?t.append(e.dataset.pname,a.join(" ").replace(/^\s|\s$/g,"")):"pipeDelimited"===r?t.append(e.dataset.pname,a.join("|").replace(/^\||\|$/g,"")):"true"===n?a.forEach((r=>{t.append(e.dataset.pname,r)})):t.append(e.dataset.pname,a.join(",").replace(/^,|,$/g,"")))}t.toString()&&v.set(e.dataset.pname,t)})),f.length>0&&f.map((e=>{const t=new URLSearchParams;try{let r={};const{paramSerializeStyle:n,paramSerializeExplode:a}=e.dataset;if(r=Object.assign(r,JSON.parse(e.value.replace(/\s+/g," "))),"true"===e.dataset.paramAllowReserved&&b.push(e.dataset.pname),"json xml".includes(n))"json"===n?t.append(e.dataset.pname,JSON.stringify(r)):"xml"===n&&t.append(e.dataset.pname,TI(r));else for(const e in r)"object"==typeof r[e]?Array.isArray(r[e])&&("spaceDelimited"===n?t.append(e,r[e].join(" ")):"pipeDelimited"===n?t.append(e,r[e].join("|")):"true"===a?r[e].forEach((r=>{t.append(e,r)})):t.append(e,r[e])):t.append(e,r[e])}catch(t){console.log("RapiDoc: unable to parse %s into object",e.value)}t.toString()&&v.set(e.dataset.pname,t)}));let x="";if(v.size&&(x="?",v.forEach(((e,t)=>{b.includes(t)?(x+=`${t}=`,x+=e.getAll(t).join(`&${t}=`),x+="&"):x+=`${e.toString()}&`})),x=x.slice(0,-1)),n=`${n}${x}`,this.api_keys.filter((e=>"query"===e.in)).forEach((e=>{n=`${n}${n.includes("?")?"&":"?"}${e.name}=${encodeURIComponent(e.finalKeyValue)}`})),n=`${this.serverUrl.replace(/\/$/,"")}${n}`,!1===n.startsWith("http")){a=new URL(n,window.location.href).href}else a=n;o=`curl -X ${this.method.toUpperCase()} "${a}" \\\n`;const w=new Headers;if(p?(w.append("Accept",p),i+=` -H "Accept: ${p}" \\\n`):this.accept&&(w.append("Accept",this.accept),i+=` -H "Accept: ${this.accept}" \\\n`),this.api_keys.filter((e=>"header"===e.in)).forEach((e=>{w.append(e.name,e.finalKeyValue),i+=` -H "${e.name}: ${e.finalKeyValue}" \\\n`})),m.map((e=>{e.value&&(w.append(e.dataset.pname,e.value),i+=` -H "${e.dataset.pname}: ${e.value}" \\\n`)})),y){const e=y.dataset.selectedRequestBodyType;if(e.includes("form-urlencoded")){const e=d.querySelector("[data-ptype='dynamic-form']");if(e){const t=e.value,r=new URLSearchParams;let n,a=!0;if(t)try{n=JSON.parse(t)}catch(e){a=!1,console.warn("RapiDoc: Invalid JSON provided",e)}else a=!1;if(a){for(const e in n)r.append(e,JSON.stringify(n[e]));g.body=r,s=` -d ${r.toString()} \\\n`}}else{const e=[...d.querySelectorAll("[data-ptype='form-urlencode']")],t=new URLSearchParams;e.filter((e=>"file"!==e.type)).forEach((e=>{if("false"===e.dataset.array)e.value&&t.append(e.dataset.pname,e.value);else{const r=e.value&&Array.isArray(e.value)?e.value.join(","):"";t.append(e.dataset.pname,r)}})),g.body=t,s=` -d ${t.toString()} \\\n`}}else if(e.includes("form-data")){const e=new FormData;[...d.querySelectorAll("[data-ptype='form-data']")].forEach((t=>{"false"===t.dataset.array?"file"===t.type&&t.files[0]?(e.append(t.dataset.pname,t.files[0],t.files[0].name),l+=` -F "${t.dataset.pname}=@${t.files[0].name}" \\\n`):t.value&&(e.append(t.dataset.pname,t.value),l+=` -F "${t.dataset.pname}=${t.value}" \\\n`):t.value&&Array.isArray(t.value)&&(t.value.forEach((e=>{l=`${l} -F "${t.dataset.pname}[]=${e}" \\\n`})),e.append(t.dataset.pname,t.value.join(",")))})),g.body=e}else if(/^audio\/|^image\/|^video\/|^font\/|tar$|zip$|7z$|rtf$|msword$|excel$|\/pdf$|\/octet-stream$/.test(e)){const e=d.querySelector(".request-body-param-file");null!=e&&e.files[0]&&(g.body=e.files[0],s=` --data-binary @${e.files[0].name} \\\n`)}else if(e.includes("json")||e.includes("xml")||e.includes("text")){const t=d.querySelector(".request-body-param-user-input");if(null!=t&&t.value){if(g.body=t.value,e.includes("json"))try{s=` -d '${JSON.stringify(JSON.parse(t.value))}' \\\n`}catch(e){}s||(s=` -d '${t.value.replace(/'/g,"'\"'\"'")}' \\\n`)}}e.includes("form-data")||w.append("Content-Type",e),i+=` -H "Content-Type: ${e}" \\\n`}this.responseUrl="",this.responseHeaders=[],this.curlSyntax="",this.responseStatus="success",this.responseIsBlob=!1,this.respContentDisposition="",this.responseBlobUrl&&(URL.revokeObjectURL(this.responseBlobUrl),this.responseBlobUrl=""),this.curlSyntax=`${o}${i}${s}${l}`,this.fetchCredentials&&(g.credentials=this.fetchCredentials);const $=new AbortController,{signal:k}=$;g.headers=w;const S=new Request(n,g);let A,O;this.dispatchEvent(new CustomEvent("before-try",{bubbles:!0,composed:!0,detail:{request:S,controller:$}}));try{let e,t,n;r.disabled=!0,this.responseText="⌛",this.responseMessage="",this.requestUpdate();const a=performance.now();A=await fetch(S,{signal:k});const o=performance.now();O=A.clone(),r.disabled=!1,this.responseMessage=z`${A.statusText?`${A.statusText}:${A.status}`:A.status} <div style="color:var(--light-fg)"> Took ${Math.round(o-a)} milliseconds </div>`,this.responseUrl=A.url;const i={};A.headers.forEach(((e,t)=>{i[t]=e,this.responseHeaders=`${this.responseHeaders}${t}: ${e}\n`}));const s=A.headers.get("content-type");if(0===(await A.clone().text()).length)this.responseText="";else if(s){if("application/x-ndjson"===s)this.responseText=await A.text();else if(s.includes("json"))if(/charset=[^"']+/.test(s)){const e=s.split("charset=")[1],r=await A.arrayBuffer();try{n=new TextDecoder(e).decode(r)}catch{n=new TextDecoder("utf-8").decode(r)}try{t=JSON.parse(n),this.responseText=JSON.stringify(t,null,2)}catch{this.responseText=n}}else t=await A.json(),this.responseText=JSON.stringify(t,null,2);else/^font\/|tar$|zip$|7z$|rtf$|msword$|excel$|\/pdf$|\/octet-stream$|^application\/vnd\./.test(s)?(this.responseIsBlob=!0,this.responseBlobType="download"):/^audio|^image|^video/.test(s)?(this.responseIsBlob=!0,this.responseBlobType="view"):(n=await A.text(),s.includes("xml")?this.responseText=$I()(n,{textNodesOnSameLine:!0,indentor:"  "}):this.responseText=n);if(this.responseIsBlob){const t=A.headers.get("content-disposition");this.respContentDisposition=t?t.split("filename=")[1].replace(/"|'/g,""):"filename",e=await A.blob(),this.responseBlobUrl=URL.createObjectURL(e)}}else n=await A.text(),this.responseText=n;this.dispatchEvent(new CustomEvent("after-try",{bubbles:!0,composed:!0,detail:{request:S,response:O,responseHeaders:i,responseBody:t||n||e,responseStatus:O.ok}}))}catch(e){r.disabled=!1,"AbortError"===e.name?(this.dispatchEvent(new CustomEvent("request-aborted",{bubbles:!0,composed:!0,detail:{err:e,request:S}})),this.responseMessage="Request Aborted"):(this.dispatchEvent(new CustomEvent("after-try",{bubbles:!0,composed:!0,detail:{err:e,request:S}})),this.responseMessage=`${e.message} (CORS or Network Issue)`)}this.requestUpdate()}onAddRemoveFileInput(e,t,r){if("button"!==e.target.tagName.toLowerCase())return;if(e.target.classList.contains("file-input-remove-btn")){return void e.target.closest(".input-set").remove()}const n=e.target.closest(".file-input-container"),a=document.createElement("div");a.setAttribute("class","input-set row");const o=document.createElement("input");o.type="file",o.style="width:200px; margin-top:2px;",o.setAttribute("data-pname",t),o.setAttribute("data-ptype",r.includes("form-urlencode")?"form-urlencode":"form-data"),o.setAttribute("data-array","false"),o.setAttribute("data-file-array","true");const i=document.createElement("button");i.setAttribute("class","file-input-remove-btn"),i.innerHTML="&#x2715;",a.appendChild(o),a.appendChild(i),n.insertBefore(a,e.target)}clearResponseData(){this.responseUrl="",this.responseHeaders="",this.responseText="",this.responseStatus="success",this.responseMessage="",this.responseIsBlob=!1,this.responseBlobType="",this.respContentDisposition="",this.responseBlobUrl&&(URL.revokeObjectURL(this.responseBlobUrl),this.responseBlobUrl="")}disconnectedCallback(){this.responseBlobUrl&&(URL.revokeObjectURL(this.responseBlobUrl),this.responseBlobUrl=""),super.disconnectedCallback()}});customElements.define("schema-table",class extends ie{static get properties(){return{schemaExpandLevel:{type:Number,attribute:"schema-expand-level"},schemaDescriptionExpanded:{type:String,attribute:"schema-description-expanded"},allowSchemaDescriptionExpandToggle:{type:String,attribute:"allow-schema-description-expand-toggle"},schemaHideReadOnly:{type:String,attribute:"schema-hide-read-only"},schemaHideWriteOnly:{type:String,attribute:"schema-hide-write-only"},data:{type:Object}}}connectedCallback(){super.connectedCallback(),(!this.schemaExpandLevel||this.schemaExpandLevel<1)&&(this.schemaExpandLevel=99999),this.schemaDescriptionExpanded&&"true false".includes(this.schemaDescriptionExpanded)||(this.schemaDescriptionExpanded="false"),this.schemaHideReadOnly&&"true false".includes(this.schemaHideReadOnly)||(this.schemaHideReadOnly="true"),this.schemaHideWriteOnly&&"true false".includes(this.schemaHideWriteOnly)||(this.schemaHideWriteOnly="true")}static get styles(){return[Ke,qI,c`
      .table {
        font-size: var(--font-size-small);
        text-align: left;
        line-height: calc(var(--font-size-small) + 6px);
      }
      .table .tr {
        width: calc(100% - 5px);
        padding: 0 0 0 5px;
        border-bottom: 1px dotted var(--light-border-color);
      }
      .table .td {
        padding: 4px 0;
      }
      .table .key {
        width: 240px;
      }
      .key.deprecated .key-label {
        color: var(--red);
      }

      .table .key-type {
        white-space: normal;
        width: 150px;
      }
      .collapsed-descr .tr {
        max-height: calc(var(--font-size-small) + var(--font-size-small) + 4px);
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
      }`,nt]}render(){var e,t,r;return z`
      <div class="table ${"true"===this.schemaDescriptionExpanded?"expanded-descr":"collapsed-descr"}">
        <div class='toolbar'>
          <div class="toolbar-item schema-root-type ${(null===(e=this.data)||void 0===e?void 0:e["::type"])||""} "> ${(null===(t=this.data)||void 0===t?void 0:t["::type"])||""} </div>
          ${"true"===this.allowSchemaDescriptionExpandToggle?z`
              <div style="flex:1"></div>
              <div part="schema-multiline-toggle" class='toolbar-item' @click='${()=>{this.schemaDescriptionExpanded="true"===this.schemaDescriptionExpanded?"false":"true"}}'> 
                ${"true"===this.schemaDescriptionExpanded?"Single line description":"Multiline description"}
              </div>
            `:""}
        </div>
        ${null!==(r=this.data)&&void 0!==r&&r["::description"]?z`<span part="schema-description" class='m-markdown'> ${QP(We(this.data["::description"]||""))}</span>`:""}
        <div style = 'border:1px solid var(--light-border-color)'>
          <div style='display:flex; background-color: var(--bg2); padding:8px 4px; border-bottom:1px solid var(--light-border-color);'>
            <div class='key' style='font-family:var(--font-regular); font-weight:bold; color:var(--fg);'> Field </div>
            <div class='key-type' style='font-family:var(--font-regular); font-weight:bold; color:var(--fg);'> Type </div>
            <div class='key-descr' style='font-family:var(--font-regular); font-weight:bold; color:var(--fg);'> Description </div>
          </div>
          ${this.data?z`
              ${this.generateTree("array"===this.data["::type"]?this.data["::props"]:this.data,this.data["::type"],this.data["::array-type"])}`:""}  
        </div>
      </div>  
    `}generateTree(e,t="object",r="",n="",a="",o=0,i=0,s=""){var l,c;if("true"===this.schemaHideReadOnly){if("array"===t&&"readonly"===s)return;if(e&&"readonly"===e["::readwrite"])return}if("true"===this.schemaHideWriteOnly){if("array"===t&&"writeonly"===s)return;if(e&&"writeonly"===e["::readwrite"])return}if(!e)return z`<div class="null" style="display:inline;">
        <span style='margin-left:${16*(o+1)}px'> &nbsp; </span>
        <span class="key-label xxx-of-key"> ${n.replace("::OPTION~","")}</span>
        ${"array"===t?z`<span class='mono-font'> [ ] </span>`:"object"===t?z`<span class='mono-font'> { } </span>`:z`<span class='mono-font'> schema undefined </span>`}
      </div>`;const p=null!==(l=e["::type"])&&void 0!==l&&l.startsWith("xxx-of")?o:o+1,d="xxx-of-option"===t||"xxx-of-option"===e["::type"]||n.startsWith("::OPTION")?i:i+1,u=16*d;if(0===Object.keys(e).length)return z`<span class="td key object" style='padding-left:${u}px'>${n}</span>`;let h="",f="",m=!1;if(n.startsWith("::ONE~OF")||n.startsWith("::ANY~OF"))h=n.replace("::","").replace("~"," "),m=!0;else if(n.startsWith("::OPTION")){const e=n.split("~");h=e[1],f=e[2]}else h=n;let y="";if("object"===e["::type"]?y="array"===t?"array of object":e["::dataTypeLabel"]||e["::type"]:"array"===e["::type"]&&(y="array"===t?"array of array "+("object"!==r?`of ${r}`:""):e["::dataTypeLabel"]||e["::type"]),"object"==typeof e)return z`
        ${p>=0&&n?z`
            <div class='tr ${p<=this.schemaExpandLevel?"expanded":"collapsed"} ${e["::type"]}' data-obj='${h}' title="${e["::deprecated"]?"Deprecated":""}">
              <div class="td key ${e["::deprecated"]?"deprecated":""}" style='padding-left:${u}px'>
                ${h||f?z`
                    <span 
                      class='obj-toggle ${p<this.schemaExpandLevel?"expanded":"collapsed"}'
                      data-obj='${h}'
                      @click= ${e=>this.toggleObjectExpand(e,h)} 
                    >
                      ${o<this.schemaExpandLevel?"-":"+"}
                    </span>`:""}
                ${"xxx-of-option"===e["::type"]||"xxx-of-array"===e["::type"]||n.startsWith("::OPTION")?z`<span class="xxx-of-key" style="margin-left:-6px">${h}</span><span class="${m?"xxx-of-key":"xxx-of-descr"}">${f}</span>`:h.endsWith("*")?z`<span class="key-label" style="display:inline-block; margin-left:-6px;">${e["::deprecated"]?"✗":""} ${h.substring(0,h.length-1)}</span><span style='color:var(--red);'>*</span>`:z`<span class="key-label" style="display:inline-block; margin-left:-6px;">${e["::deprecated"]?"✗":""} ${"::props"===h?"":h}</span>`}
                ${"xxx-of"===e["::type"]&&"array"===t?z`<span style="color:var(--primary-color)">ARRAY</span>`:""} 
              </div>
              <div class='td key-type' title="${"readonly"===e["::readwrite"]?"Read-Only":"writeonly"===e["::readwrite"]?"Write-Only":""}">
                ${(e["::type"]||"").includes("xxx-of")?"":y}
                ${"readonly"===e["::readwrite"]?" 🆁":"writeonly"===e["::readwrite"]?" 🆆":""}
              </div>
              <div class='td key-descr m-markdown-small' style='line-height:1.7'>${QP(We(a||""))}</div>
            </div>`:z`
              ${"array"===e["::type"]&&"array"===t?z`
                  <div class='tr'> 
                    <div class='td key'></div> 
                    <div class='td key-type'>
                      ${r&&"object"!==r?`${t} of ${r}`:t}
                    </div> 
                    <div class='td key-descr'></div> 
                  </div>`:""}
          `}
        <div class='object-body'>
        ${Array.isArray(e)&&e[0]?z`${this.generateTree(e[0],"xxx-of-option","","::ARRAY~OF","",p,d,"")}`:z`
            ${Object.keys(e).map((t=>z`
              ${["::title","::description","::type","::props","::deprecated","::array-type","::readwrite","::dataTypeLabel"].includes(t)?"array"===e[t]["::type"]||"object"===e[t]["::type"]?z`${this.generateTree("array"===e[t]["::type"]?e[t]["::props"]:e[t],e[t]["::type"],e[t]["::array-type"]||"",t,e[t]["::description"],p,d,e[t]["::readwrite"]?e[t]["::readwrite"]:"")}`:"":z`${this.generateTree("array"===e[t]["::type"]?e[t]["::props"]:e[t],e[t]["::type"],e[t]["::array-type"]||"",t,e[t]["::description"],p,d,e[t]["::readwrite"]?e[t]["::readwrite"]:"")}`}
            `))}
          `}
        <div>
      `;const[g,v,b,x,w,$,k,S,A]=e.split("~|~");if("🆁"===v&&"true"===this.schemaHideReadOnly)return;if("🆆"===v&&"true"===this.schemaHideWriteOnly)return;const O=g.replace(/┃.*/g,"").replace(/[^a-zA-Z0-9+]/g,"").substring(0,4).toLowerCase();let E="";return E="array"===t?z` 
        <div class='td key-type ${O}' title="${"readonly"===s?"Read-Only":"writeonly"===v?"Write-Only":""}">
          [${g}] ${"readonly"===s?"🆁":"writeonly"===s?"🆆":""}
        </div>`:z` 
        <div class='td key-type ${O}' title="${"🆁"===v?"Read-Only":"🆆"===v?"Write-Only":""}">
          ${g} ${v}
        </div>`,z`
      <div class = "tr primitive" title="${A?"Deprecated":""}">
        <div class="td key ${A}" style='padding-left:${u}px'>
          ${A?z`<span style='color:var(--red);'>✗</span>`:""}
          ${null!==(c=h)&&void 0!==c&&c.endsWith("*")?z`
              <span class="key-label">${h.substring(0,h.length-1)}</span>
              <span style='color:var(--red);'>*</span>`:n.startsWith("::OPTION")?z`<span class='xxx-of-key'>${h}</span><span class="xxx-of-descr">${f}</span>`:z`${h?z`<span class="key-label"> ${h}</span>`:z`<span class="xxx-of-descr">${S}</span>`}`}
        </div>
        ${E}
        <div class='td key-descr' @click="${()=>{this.schemaDescriptionExpanded="true"}}">
          ${"array"===t?z`<span class="m-markdown-small">${QP(We(a))}</span>`:""}
          ${k?z`<span class="m-markdown-small">
              ${QP(We(`${S?`**${S}:**`:""} ${k} ${b||x||w||$?'<span  class="more-content">⤵</span>':""}`))}
              </span>`:S?z`${S} ${b||x||w||$?z`<span class="more-content">⤵</span>`:""}`:""}
          ${b?z`<div style='display:inline-block; line-break:anywhere; margin-right:8px;'> <span class='bold-text'>Constraints: </span> ${b}</div>`:""}
          ${x?z`<div style='display:inline-block; line-break:anywhere; margin-right:8px;'> <span class='bold-text'>Default: </span>${x}</div>`:""}
          ${w?z`<div style='display:inline-block; line-break:anywhere; margin-right:8px;'> <span class='bold-text'>Allowed: </span>${w}</div>`:""}
          ${$?z`<div style='display:inline-block; line-break:anywhere; margin-right:8px;'> <span class='bold-text'>Pattern: </span>${$}</div>`:""}
        </div>
      </div>
    `}toggleObjectExpand(e){const t=e.target.closest(".tr");t.classList.contains("expanded")?(t.classList.add("collapsed"),t.classList.remove("expanded"),e.target.innerText="+"):(t.classList.remove("collapsed"),t.classList.add("expanded"),e.target.innerText="-")}});function zI(e){const t=new We.Renderer;return t.heading=(t,r,n,a)=>`<h${r} class="observe-me" id="${e}--${a.slug(n)}">${t}</h${r}>`,t}function UI(e,t=""){var r,n,a;const o=new Set;for(const t in e.responses)for(const r in null===(i=e.responses[t])||void 0===i?void 0:i.content){var i;o.add(r.trim())}const s=[...o].join(", "),l=this.resolvedSpec.securitySchemes.filter((t=>{var r;return t.finalKeyValue&&(null===(r=e.security)||void 0===r?void 0:r.some((e=>t.securitySchemeId in e)))}))||[],c=this.resolvedSpec.securitySchemes.find((e=>e.securitySchemeId===ot&&"-"!==e.value));c&&l.push(c);const p=e.xCodeSamples?fI.call(this,e.xCodeSamples):"";return z`
    ${"read"===this.renderStyle?z`<div class='divider' part="operation-divider"></div>`:""}
    <div class='expanded-endpoint-body observe-me ${e.method} ${e.deprecated?"deprecated":""} ' part="section-operation ${e.elementId}" id='${e.elementId}'>
      ${"focused"===this.renderStyle&&"General ⦂"!==t?z`<h3 class="upper" style="font-weight:bold" part="section-operation-tag"> ${t} </h3>`:""}
      ${e.deprecated?z`<div class="bold-text red-text"> DEPRECATED </div>`:""}
      ${z`
        ${e.xBadges&&(null===(r=e.xBadges)||void 0===r?void 0:r.length)>0?z`
            <div style="display:flex; flex-wrap:wrap; margin-bottom: -24px; font-size: var(--font-size-small);">
              ${e.xBadges.map((e=>z`<span style="margin:1px; margin-right:5px; padding:1px 8px; font-weight:bold; border-radius:12px;  background-color: var(--light-${e.color}, var(--input-bg)); color:var(--${e.color}); border:1px solid var(--${e.color})">${e.label}</span>`))}
            </div>
            `:""}
        <h2 part="section-operation-summary"> ${e.shortSummary||`${e.method.toUpperCase()} ${e.path}`}</h2>
        ${e.isWebhook?z`<span part="section-operation-webhook" style="color:var(--primary-color); font-weight:bold; font-size: var(--font-size-regular);"> WEBHOOK </span>`:z`
            <div part="section-operation-webhook-method" class="mono-font regular-font-size" style="text-align:left; direction:ltr; padding: 8px 0; color:var(--fg3)"> 
              <span part="label-operation-method" class="regular-font upper method-fg bold-text ${e.method}">${e.method}</span> 
              <span part="label-operation-path">${e.path}</span>
            </div>
          `}
        <slot name="${e.elementId}"></slot>`}
      ${e.description?z`<div class="m-markdown"> ${QP(We(e.description))}</div>`:""}
      ${hI.call(this,e.security)}
      ${p}
      <div class='expanded-req-resp-container'>
        <api-request
          class = "${this.renderStyle}-mode"
          style = "width:100%;"
          webhook = "${e.isWebhook}"
          method = "${e.method}"
          path = "${e.path}"
          .security = "${e.security}"
          .parameters = "${e.parameters}"
          .request_body = "${e.requestBody}"
          .api_keys = "${l}"
          .servers = "${e.servers}"
          server-url = "${(null===(n=e.servers)||void 0===n||null===(a=n[0])||void 0===a?void 0:a.url)||this.selectedServer.computedUrl}"
          fill-request-fields-with-example = "${this.fillRequestFieldsWithExample}"
          allow-try = "${this.allowTry}"
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

        ${e.callbacks?mI.call(this,e.callbacks):""}

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
  `}function BI(){return this.resolvedSpec?z`
  ${this.resolvedSpec.tags.map((e=>z`
    <section id="${e.elementId}" part="section-tag" class="regular-font section-gap--read-mode observe-me" style="border-top:1px solid var(--primary-color);">
      <div class="title tag" part="section-tag-title label-tag-title">${e.name}</div>
      <slot name="${e.elementId}"></slot>
      <div class="regular-font-size">
      ${QP(`\n          <div class="m-markdown regular-font">\n          ${We(e.description||"","true"===this.infoDescriptionHeadingsInNavBar?{renderer:zI(e.elementId)}:void 0)}\n        </div>`)}
      </div>
    </section>
    <section class="regular-font section-gap--read-mode" part="section-operations-in-tag">
      ${e.paths.map((e=>UI.call(this,e,"BBB")))}
    </section>
    `))}
`:""}function MI(e){return z`
  <div class='divider'></div>
  <div class='expanded-endpoint-body observe-me ${e.name}' id='cmp--${e.id}' >
    <div style="font-weight:bold"> ${e.name} <span style="color:var(--light-fg); font-size:var(--font-size-small); font-weight:400;"> Schema </span></div>
  ${"table"===this.schemaStyle?z`
      <schema-table
        .data = '${LI(e.component,{})}'
        schema-expand-level = "${this.schemaExpandLevel}"
        schema-description-expanded = "${this.schemaDescriptionExpanded}"
        allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
        schema-hide-read-only = "false"
        schema-hide-write-only = "${this.schemaHideWriteOnly}"
        exportparts = "schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
      > </schema-table>`:z`
      <schema-tree
        .data = '${LI(e.component,{})}'
        schema-expand-level = "${this.schemaExpandLevel}"
        schema-description-expanded = "${this.schemaDescriptionExpanded}"
        allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
        schema-hide-read-only = "false"
        schema-hide-write-only = "${this.schemaHideWriteOnly}"
        exportparts = "schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
      > </schema-tree>`}
  </div>`}function HI(e,t){return-1!==e.id.indexOf("schemas-")?MI.call(this,e):z`
  <div class='divider'></div>
  <div class='expanded-endpoint-body observe-me ${e.name}' id='cmp--${e.id}' >
    ${z`
      <div style="font-weight:bold"> ${e.name} <span style="color:var(--light-fg); font-size:var(--font-size-small); font-weight:400"> ${t} </span> </div>
      ${e.component?z`
      <div class='mono-font regular-font-size' style='padding: 8px 0; color:var(--fg2)'> 
        <json-tree class="border tree" render-style='${this.renderStyle}' .data="${e.component}"> </json-tree>
      </div>`:""}
    `}
  </div>
  `}function WI(){return this.resolvedSpec?z`
  ${this.resolvedSpec.components.map((e=>z`
    <div id="cmp--${e.name.toLowerCase()}" class='regular-font section-gap--read-mode observe-me' style="border-top:1px solid var(--primary-color);">
      <div class="title tag">${e.name}</div>
      <div class="regular-font-size">
        ${QP(`<div class='m-markdown regular-font'>${We(e.description?e.description:"")}</div>`)}
      </div>
    </div>
    <div class='regular-font section-gap--read-mode'>
      ${e.subComponents.filter((e=>!1!==e.expanded)).map((t=>HI.call(this,t,e.name)))}
    </div>
    `))}
`:""}function VI(){const e=new We.Renderer;return e.heading=(e,t,r,n)=>`<h${t} class="observe-me" id="overview--${n.slug(r)}">${e}</h${t}>`,e}function GI(){var e,t,r,n;return z`
    <section id="overview" part="section-overview"
      class="observe-me ${"view"===this.renderStyle?"section-gap":"section-gap--read-mode"}">
      ${null!==(e=this.resolvedSpec)&&void 0!==e&&e.info?z`
          <div id="api-title" part="section-overview-title" style="font-size:32px">
            ${this.resolvedSpec.info.title}
            ${this.resolvedSpec.info.version?z`
              <span style = 'font-size:var(--font-size-small);font-weight:bold'>
                ${this.resolvedSpec.info.version}
              </span>`:""}
          </div>
          <div id="api-info" style="font-size:calc(var(--font-size-regular) - 1px); margin-top:8px;">
            ${null!==(t=this.resolvedSpec.info.contact)&&void 0!==t&&t.email?z`<span>${this.resolvedSpec.info.contact.name||"Email"}: 
                <a href="mailto:${this.resolvedSpec.info.contact.email}" part="anchor anchor-overview">${this.resolvedSpec.info.contact.email}</a>
              </span>`:""}
            ${null!==(r=this.resolvedSpec.info.contact)&&void 0!==r&&r.url?z`<span>URL: <a href="${this.resolvedSpec.info.contact.url}" part="anchor anchor-overview">${this.resolvedSpec.info.contact.url}</a></span>`:""}
            ${this.resolvedSpec.info.license?z`<span>License: 
                ${this.resolvedSpec.info.license.url?z`<a href="${this.resolvedSpec.info.license.url}" part="anchor anchor-overview">${this.resolvedSpec.info.license.name}</a>`:this.resolvedSpec.info.license.name} </span>`:""}
            ${this.resolvedSpec.info.termsOfService?z`<span><a href="${this.resolvedSpec.info.termsOfService}" part="anchor anchor-overview">Terms of Service</a></span>`:""}
            ${this.specUrl&&"true"===this.allowSpecFileDownload?z`
                <div style="display:flex; margin:12px 0; gap:8px; justify-content: start;">
                  <button class="m-btn thin-border" style="width:170px" part="btn btn-outline" @click='${e=>{pt(this.specUrl,"openapi-spec")}}'>Download OpenAPI spec</button>
                  ${null!==(n=this.specUrl)&&void 0!==n&&n.trim().toLowerCase().endsWith("json")?z`<button class="m-btn thin-border" style="width:200px" part="btn btn-outline" @click='${e=>{dt(this.specUrl)}}'>View OpenAPI spec (New Tab)</button>`:""}
                </div>`:""}
          </div>
          <slot name="overview"></slot>
          <div id="api-description">
          ${this.resolvedSpec.info.description?z`${QP(`\n                <div class="m-markdown regular-font">\n                ${We(this.resolvedSpec.info.description,"true"===this.infoDescriptionHeadingsInNavBar?{renderer:VI()}:void 0)}\n              </div>`)}`:""}
          </div>
        `:""}
    </section>
  `}function KI(e){var t;const r=null===(t=this.resolvedSpec)||void 0===t?void 0:t.servers.find((t=>t.url===e));return!!r&&(this.selectedServer=r,this.requestUpdate(),this.dispatchEvent(new CustomEvent("api-server-change",{bubbles:!0,composed:!0,detail:{selectedServer:r}})),!0)}function JI(e,t){const r=[...e.currentTarget.closest("table").querySelectorAll("input, select")];let n=t.url;r.forEach((e=>{const t=new RegExp(`{${e.dataset.var}}`,"g");n=n.replace(t,e.value)})),t.computedUrl=n,this.requestUpdate()}function YI(){return this.selectedServer&&this.selectedServer.variables?z`
    <div class="table-title">SERVER VARIABLES</div>
    <table class='m-table' role='presentation'>
      ${Object.entries(this.selectedServer.variables).map((e=>z`
        <tr>
          <td style="vertical-align: middle;" >${e[0]}</td>
          <td>
            ${e[1].enum?z`
            <select
              data-var = "${e[0]}"
              @input = ${e=>{JI.call(this,e,this.selectedServer)}}
            >
            ${Object.entries(e[1].enum).map((t=>e[1].default===t[1]?z`
              <option
                selected
                label = ${t[1]}
                value = ${t[1]}
              />`:z`
              <option
                label = ${t[1]}
                value = ${t[1]}
              />`))}
            </select>`:z`
            <input
              type = "text"
              part="textbox textbox-server-var"
              spellcheck = "false"
              data-var = "${e[0]}"
              value = "${e[1].default}"
              @input = ${e=>{JI.call(this,e,this.selectedServer)}}
            />`}
          </td>
        </tr>
        ${e[1].description?z`<tr><td colspan="2" style="border:none"><span class="m-markdown-small"> ${QP(We(e[1].description))} </span></td></tr>`:""}
      `))}
    </table>
    `:""}function ZI(){var e,t,r;return!this.resolvedSpec||this.resolvedSpec.specLoadError?"":z`
  <section id = 'servers' part="section-servers" style="text-align:left; direction:ltr; margin-top:24px; margin-bottom:24px;" class='regular-font observe-me ${"read focused".includes(this.renderStyle)?"section-gap--read-mode":"section-gap"}'>
    <div part = "section-servers-title" class = "sub-title">API SERVER</div>
    <div class = 'mono-font' style='margin: 12px 0; font-size:calc(var(--font-size-small) + 1px);'>
      ${this.resolvedSpec.servers&&0!==(null===(e=this.resolvedSpec.servers)||void 0===e?void 0:e.length)?z`
          ${null===(t=this.resolvedSpec)||void 0===t?void 0:t.servers.map(((e,t)=>z`
            <input type = 'radio'
              name = 'api_server'
              id = 'srvr-opt-${t}'
              value = '${e.url}'
              @change = ${()=>{KI.call(this,e.url)}}
              .checked = '${this.selectedServer.url===e.url}'
              style = 'margin:4px 0; cursor:pointer'
            />
              <label style='cursor:pointer' for='srvr-opt-${t}'>
                ${e.url} ${e.description?z`- <span class='regular-font'>${e.description} </span>`:""}
              </label>
            <br/>
          `))}
      `:""}
      <div class="table-title primary-text" part="label-selected-server"> SELECTED: ${(null===(r=this.selectedServer)||void 0===r?void 0:r.computedUrl)||"none"}</div>
    </div>
    <slot name="servers"></slot>
    ${YI.call(this)}
  </section>`}function QI(e,t="toggle"){const r=null==e?void 0:e.closest(".nav-bar-tag-and-paths");if(r){const e=r.classList.contains("expanded");!e||"toggle"!==t&&"collapse"!==t?e||"toggle"!==t&&"expand"!==t||r.classList.replace("collapsed","expanded"):r.classList.replace("expanded","collapsed")}}function XI(e){QI(e.target,"toggle")}function eR(e,t="expand-all"){!function(e,t="expand-all"){const r=[...e.querySelectorAll(".nav-bar-tag-and-paths")];"expand-all"===t?r.map((e=>{e.classList.replace("collapsed","expanded")})):r.map((e=>{e.classList.replace("expanded","collapsed")}))}(e.target.closest(".nav-scroll"),t)}function tR(){var e,t,r,n;return!this.resolvedSpec||this.resolvedSpec.specLoadError?z`
      <nav class='nav-bar' part="section-navbar">
        <slot name="nav-logo" class="logo"></slot>
      </nav>
    `:z`
  <nav class='nav-bar ${this.renderStyle}' part="section-navbar">
    <slot name="nav-logo" class="logo"></slot>
    ${"false"===this.allowSearch&&"false"===this.allowAdvancedSearch?"":z`
        <div style="display:flex; flex-direction:row; justify-content:center; align-items:stretch; padding:8px 24px 12px 24px; ${"false"===this.allowAdvancedSearch?"border-bottom: 1px solid var(--nav-hover-bg-color)":""}" part="section-navbar-search">
          ${"false"===this.allowSearch?"":z`
              <div style="display:flex; flex:1; line-height:22px;">
                <input id="nav-bar-search" 
                  part = "textbox textbox-nav-filter"
                  style = "width:100%; padding-right:20px; color:var(--nav-hover-text-color); border-color:var(--nav-accent-color); background-color:var(--nav-hover-bg-color)" 
                  type = "text"
                  placeholder = "Filter" 
                  @change = "${this.onSearchChange}"  
                  spellcheck = "false" 
                >
                <div style="margin: 6px 5px 0 -24px; font-size:var(--font-size-regular); cursor:pointer;">&#x21a9;</div>
              </div>  
              ${this.matchPaths?z`
                  <button @click = '${this.onClearSearch}' class="m-btn thin-border" style="margin-left:5px; color:var(--nav-text-color); width:75px; padding:6px 8px;" part="btn btn-outline btn-clear-filter">
                    CLEAR
                  </button>`:""}
            `}
          ${"false"===this.allowAdvancedSearch||this.matchPaths?"":z`
              <button class="m-btn primary" part="btn btn-fill btn-search" style="margin-left:5px; padding:6px 8px; width:75px" @click="${this.onShowSearchModalClicked}">
                SEARCH
              </button>
            `}
        </div>
      `}
    ${z`<nav class='nav-scroll' part="section-navbar-scroll">
      ${"false"!==this.showInfo&&this.resolvedSpec.info?z`
          ${"true"===this.infoDescriptionHeadingsInNavBar?z`
              ${this.resolvedSpec.infoDescriptionHeaders.length>0?z`<div class='nav-bar-info' id='link-overview' data-content-id='overview' @click = '${e=>this.scrollToEventTarget(e,!1)}'> 
                    ${(null===(e=this.resolvedSpec.info)||void 0===e||null===(t=e.title)||void 0===t?void 0:t.trim())||"Overview"}
                  </div>`:""}
              <div class="overview-headers">
                ${this.resolvedSpec.infoDescriptionHeaders.map((e=>z`
                  <div 
                    class='nav-bar-h${e.depth}' 
                    id="link-overview--${(new We.Slugger).slug(e.text)}"  
                    data-content-id='overview--${(new We.Slugger).slug(e.text)}' 
                    @click='${e=>this.scrollToEventTarget(e,!1)}'
                  >
                    ${e.text}
                  </div>`))}
              </div>
              ${this.resolvedSpec.infoDescriptionHeaders.length>0?z`<hr style='border-top: 1px solid var(--nav-hover-bg-color); border-width:1px 0 0 0; margin: 15px 0 0 0'/>`:""}
            `:z`<div class='nav-bar-info' id='link-overview' data-content-id='overview' @click = '${e=>this.scrollToEventTarget(e,!1)}'> 
            ${(null===(r=this.resolvedSpec.info)||void 0===r||null===(n=r.title)||void 0===n?void 0:n.trim())||"Overview"} 
              </div>`}
        `:""}
    
      ${"false"===this.allowServerSelection?"":z`<div class='nav-bar-info' id='link-servers' data-content-id='servers' @click = '${e=>this.scrollToEventTarget(e,!1)}'> API Servers </div>`}
      ${"false"!==this.allowAuthentication&&this.resolvedSpec.securitySchemes?z`<div class='nav-bar-info' id='link-auth' data-content-id='auth' @click = '${e=>this.scrollToEventTarget(e,!1)}'> Authentication </div>`:""}

      <div id='link-operations-top' class='nav-bar-section operations' data-content-id='operations-top' @click = '${e=>this.scrollToEventTarget(e,!1)}'>
        <div style="font-size:16px; display:flex; margin-left:10px;">
          ${"focused"===this.renderStyle?z`
              <div @click="${e=>{eR.call(this,e,"expand-all")}}" title="Expand all" style="transform: rotate(90deg); cursor:pointer; margin-right:10px;">▸</div>
              <div @click="${e=>{eR.call(this,e,"collapse-all")}}" title="Collapse all" style="transform: rotate(270deg); cursor:pointer;">▸</div>`:""}  
        </div>
        <div class='nav-bar-section-title'> OPERATIONS </div>
      </div>

      <!-- TAGS AND PATHS-->
      ${this.resolvedSpec.tags.filter((e=>e.paths.filter((e=>lt(this.matchPaths,e,this.matchType))).length)).map((e=>z`
          <div class='nav-bar-tag-and-paths ${e.expanded?"expanded":"collapsed"}'>
            ${"General ⦂"===e.name?z`<hr style="border:none; border-top: 1px dotted var(--nav-text-color); opacity:0.3; margin:-1px 0 0 0;"/>`:z`
                <div 
                  class='nav-bar-tag' 
                  id="link-${e.elementId}" 
                  data-content-id='${e.elementId}'
                  data-first-path-id='${e.firstPathId}'
                  @click='${e=>{"focused"===this.renderStyle&&"expand-collapse"===this.onNavTagClick?XI.call(this,e):this.scrollToEventTarget(e,!1)}}'
                >
                  <div>${e.name}</div>
                  <div class="nav-bar-tag-icon" @click="${e=>{"focused"===this.renderStyle&&"show-description"===this.onNavTagClick&&XI.call(this,e)}}">
                  </div>
                </div>
              `}
            ${"true"===this.infoDescriptionHeadingsInNavBar?z`
                ${"focused"===this.renderStyle&&"expand-collapse"===this.onNavTagClick?"":z`
                    <div class='tag-headers'>
                      ${e.headers.map((t=>z`
                      <div 
                        class='nav-bar-h${t.depth}' 
                        id="link-${e.elementId}--${(new We.Slugger).slug(t.text)}"  
                        data-content-id='${e.elementId}--${(new We.Slugger).slug(t.text)}' 
                        @click='${e=>this.scrollToEventTarget(e,!1)}'
                      > ${t.text}</div>`))}
                    </div>`}`:""}

            
            <div class='nav-bar-paths-under-tag'>
              <!-- Paths in each tag (endpoints) -->
              ${e.paths.filter((e=>!this.matchPaths||lt(this.matchPaths,e,this.matchType))).map((e=>z`
              <div 
                class='nav-bar-path
                ${"true"===this.usePathInNavBar?"small-font":""}'
                data-content-id='${e.elementId}'
                id='link-${e.elementId}'
                @click = '${e=>{this.scrollToEventTarget(e,!1)}}'
              >
                <span style = "display:flex; align-items:start; ${e.deprecated?"filter:opacity(0.5)":""}">
                  ${z`<span class="nav-method ${this.showMethodInNavBar} ${e.method}">
                      ${"as-colored-block"===this.showMethodInNavBar?e.method.substring(0,3).toUpperCase():e.method.toUpperCase()}
                    </span>`}
                  ${e.isWebhook?z`<span style="font-weight:bold; margin-right:8px; font-size: calc(var(--font-size-small) - 2px)">WEBHOOK</span>`:""}
                  ${"true"===this.usePathInNavBar?z`<span class='mono-font'>${e.path}</span>`:e.summary||e.shortSummary}
                </span>
              </div>`))}
            </div>
          </div>
        `))}

      <!-- COMPONENTS -->
      ${this.resolvedSpec.components&&"true"===this.showComponents&&"focused"===this.renderStyle?z`
          <div id='link-components' class='nav-bar-section components'>
            <div></div>
            <div class='nav-bar-section-title'>COMPONENTS</div>
          </div>
          ${this.resolvedSpec.components.map((e=>e.subComponents.length?z`
              <div class='nav-bar-tag' 
                data-content-id='cmp--${e.name.toLowerCase()}' 
                id='link-cmp--${e.name.toLowerCase()}' 
                @click='${e=>this.scrollToEventTarget(e,!1)}'>
                ${e.name}
              </div>
              ${e.subComponents.filter((e=>!1!==e.expanded)).map((e=>z`
                <div class='nav-bar-path' data-content-id='cmp--${e.id}' id='link-cmp--${e.id}' @click='${e=>this.scrollToEventTarget(e,!1)}'>
                  <span> ${e.name} </span>
                </div>`))}`:""))}`:""}
    </nav>`}
</nav>
`}function rR(e){const t=new We.Renderer;return t.heading=(t,r,n,a)=>`<h${r} class="observe-me" id="${e}--${a.slug(n)}">${t}</h${r}>`,t}function nR(e){return z`
    <div class='regular-font section-gap--focused-mode' part="section-operations-in-tag">
      ${e}
    </div>`}function aR(){var e;if("true"===this.showInfo)return nR(GI.call(this));const t=this.resolvedSpec.tags[0],r=null===(e=this.resolvedSpec.tags[0])||void 0===e?void 0:e.paths[0];return nR(t&&r?UI.call(this,r,t.name):"")}function oR(e){return z`
    <h1 id="${e.elementId}">${e.name}</h1>
    ${"show-description"===this.onNavTagClick&&e.description?z`
        <div class="m-markdown">
          ${QP(`\n            <div class="m-markdown regular-font">\n              ${We(e.description||"","true"===this.infoDescriptionHeadingsInNavBar?{renderer:rR(e.elementId)}:void 0)}\n            </div>`)}
        </div>`:""}
  `}function iR(){if(!this.focusedElementId||!this.resolvedSpec)return;const e=this.focusedElementId;let t,r=null,n=null,a=0;if(e.startsWith("overview")&&"true"===this.showInfo)t=GI.call(this);else if("auth"===e&&"true"===this.allowAuthentication)t=uI.call(this);else if("servers"===e&&"true"===this.allowServerSelection)t=ZI.call(this);else if("operations-top"===e)t=z`
    <div id="operations-top" class="observe-me">
      <slot name="operations-top"></slot>
    </div>`;else if(e.startsWith("cmp--")&&"true"===this.showComponents)t=WI.call(this);else if(e.startsWith("tag--")){const r=e.indexOf("--",4)>0?e.substring(0,e.indexOf("--",5)):e;n=this.resolvedSpec.tags.find((e=>e.elementId===r)),t=n?nR.call(this,oR.call(this,n)):aR.call(this)}else{for(a=0;a<this.resolvedSpec.tags.length&&(n=this.resolvedSpec.tags[a],r=this.resolvedSpec.tags[a].paths.find((t=>`${t.elementId}`===e)),!r);a+=1);if(r){QI(this.shadowRoot.getElementById(`link-${e}`),"expand"),t=nR.call(this,UI.call(this,r,n.name))}else t=aR.call(this)}return t}function sR(e){if(e.expanded)e.expanded=!1,"true"===this.updateRoute&&window.history.replaceState(null,null,`${window.location.href.split("#")[0]}${"#"===this.routePrefix?"":`${this.routePrefix}`}`);else if(e.expanded=!0,"true"===this.updateRoute){const t=`${this.routePrefix||"#"}${e.elementId}`;window.location.hash!==t&&window.history.replaceState(null,null,`${window.location.href.split("#")[0]}${t}`)}this.requestUpdate()}function lR(e,t="expand-all"){const r=[...e.querySelectorAll(".section-tag")];"expand-all"===t?r.map((e=>{e.classList.replace("collapsed","expanded")})):r.map((e=>{e.classList.replace("expanded","collapsed")}))}function cR(e,t="expand-all"){lR.call(this,e.target.closest(".operations-root"),t)}function pR(e,t=!1){return z`
  <summary @click="${t=>{sR.call(this,e,t)}}" part="section-endpoint-head-${e.expanded?"expanded":"collapsed"}" class='endpoint-head ${e.method} ${e.deprecated?"deprecated":""} ${t||e.expanded?"expanded":"collapsed"}'>
    <div part="section-endpoint-head-method" class="method ${e.method} ${e.deprecated?"deprecated":""}"> ${e.method} </div> 
    <div  part="section-endpoint-head-path" class="path ${e.deprecated?"deprecated":""}"> 
      ${e.path} 
      ${e.isWebhook?z`<span style="font-family: var(--font-regular); font-size: var(--); font-size: var(--font-size-small); color:var(--primary-color); margin-left: 16px"> Webhook</span>`:""}
    </div>
    ${e.deprecated?z`
        <span style="font-size:var(--font-size-small); text-transform:uppercase; font-weight:bold; color:var(--red); margin:2px 0 0 5px;"> 
          deprecated 
        </span>`:""}
    ${this.showSummaryWhenCollapsed?z`
        <div class="only-large-screen" style="min-width:60px; flex:1"></div>
        <div part="section-endpoint-head-description" class="descr">${e.summary||e.shortSummary} </div>`:""}
  </summary>
  `}function dR(e){var t;const r=new Set;for(const t in e.responses)for(const a in null===(n=e.responses[t])||void 0===n?void 0:n.content){var n;r.add(a.trim())}const a=[...r].join(", "),o=this.resolvedSpec.securitySchemes.filter((t=>{var r;return t.finalKeyValue&&(null===(r=e.security)||void 0===r?void 0:r.some((e=>t.securitySchemeId in e)))}))||[],i=this.resolvedSpec.securitySchemes.find((e=>e.securitySchemeId===ot&&"-"!==e.value));i&&o.push(i);const s=e.xCodeSamples?fI(e.xCodeSamples):"";return z`
  <div part="section-endpoint-body-${e.expanded?"expanded":"collapsed"}" class='endpoint-body ${e.method} ${e.deprecated?"deprecated":""}'>
    <div class="summary">
      ${e.summary?z`<div class="title" part="section-endpoint-body-title">${e.summary}<div>`:e.shortSummary!==e.description?z`<div class="title" part="section-endpoint-body-title">${e.shortSummary}</div>`:""}
      ${e.xBadges&&(null===(t=e.xBadges)||void 0===t?void 0:t.length)>0?z`
          <div style="display:flex; flex-wrap:wrap;font-size: var(--font-size-small);">
            ${e.xBadges.map((e=>z`<span part="endpoint-badge" style="margin:1px; margin-right:5px; padding:1px 8px; font-weight:bold; border-radius:12px;  background-color: var(--light-${e.color}, var(--input-bg)); color:var(--${e.color}); border:1px solid var(--${e.color})">${e.label}</span>`))}
          </div>
          `:""}

      ${e.description?z`<div part="section-endpoint-body-description" class="m-markdown"> ${QP(We(e.description))}</div>`:""}
      <slot name="${e.elementId}"></slot>
      ${hI.call(this,e.security)}
      ${s}
    </div>  
    <div class='req-resp-container'> 
      <div style="display:flex; flex-direction:column" class="view-mode-request ${this.layout}-layout">
        <api-request
          class = "${this.renderStyle}-mode ${this.layout}-layout"
          style = "width:100%;"
          webhook = "${e.isWebhook}"
          method = "${e.method}"
          path = "${e.path}"
          .security = "${e.security}"
          .parameters = "${e.parameters}"
          .request_body = "${e.requestBody}"
          .api_keys = "${o}"
          .servers = "${e.servers}" 
          server-url = "${e.servers&&e.servers.length>0?e.servers[0].url:this.selectedServer.computedUrl}" 
          active-schema-tab = "${this.defaultSchemaTab}"
          fill-request-fields-with-example = "${this.fillRequestFieldsWithExample}"
          allow-try = "${this.allowTry}"
          accept = "${a}"
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

          ${e.callbacks?mI.call(this,e.callbacks):""}
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
  </div>`}function uR(e=!0,t=!0,r=!1){return this.resolvedSpec?z`
    ${e?z`
        <div style="display:flex; justify-content:flex-end;"> 
          <span @click="${e=>cR(e,"expand-all")}" style="color:var(--primary-color); cursor:pointer;">
            Expand all
          </span> 
          &nbsp;|&nbsp; 
          <span @click="${e=>cR(e,"collapse-all")}" style="color:var(--primary-color); cursor:pointer;" >
            Collapse all
          </span> 
          &nbsp; sections
        </div>`:""}
    ${this.resolvedSpec.tags.map((e=>z`
      ${t?z` 
          <div class='regular-font section-gap section-tag ${e.expanded?"expanded":"collapsed"}'> 
            <div class='section-tag-header' @click="${()=>{e.expanded=!e.expanded,this.requestUpdate()}}">
              <div id='${e.elementId}' class="sub-title tag" style="color:var(--primary-color)">${e.name}</div>
            </div>
            <div class='section-tag-body'>
              <slot name="${e.elementId}"></slot>
              <div class="regular-font regular-font-size m-markdown" style="padding-bottom:12px">
                ${QP(We(e.description||""))}
              </div>
              ${e.paths.filter((e=>!this.matchPaths||lt(this.matchPaths,e,this.matchType))).map((e=>z`
                <section part="section-endpoint" id='${e.elementId}' class='m-endpoint regular-font ${e.method} ${r||e.expanded?"expanded":"collapsed"}'>
                  ${pR.call(this,e,r)}      
                  ${r||e.expanded?dR.call(this,e):""}
                </section>`))}
            </div>
          </div>`:z`
          <div class='section-tag-body'>
          ${e.paths.filter((e=>!this.matchPaths||lt(this.matchPaths,e,this.matchType))).map((e=>z`
            <section id='${e.elementId}' class='m-endpoint regular-font ${e.method} ${r||e.expanded?"expanded":"collapsed"}'>
              ${pR.call(this,e,r)}      
              ${r||e.expanded?dR.call(this,e):""}
            </section>`))}
          </div>
        `}
  `))}`:""}function hR(){return z`
  <header class="row main-header regular-font" part="section-header" style="padding:8px 4px 8px 4px;min-height:48px;">
    <div class="only-large-screen-flex" style="align-items: center;">
      <slot name="logo" class="logo" part="section-logo">
        ${e="height:36px;width:36px;margin-left:5px",z`
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
      ${"false"===this.allowSpecUrlLoad?"":z`
          <input id="spec-url" 
            type="text" 
            style="font-size:var(--font-size-small)" 
            class="header-input mono-font"
            part="textbox textbox-spec-url" 
            placeholder="Spec URL" 
            value="${this.specUrl||""}" 
            @change="${this.onSepcUrlChange}" 
            spellcheck="false"
          >
          <div style="margin: 6px 5px 0 -24px; font-size:var(--font-size-regular); cursor:pointer;">&#x21a9;</div> 
        `} 
      ${"false"===this.allowSpecFileLoad?"":z`
          <input id="spec-file" 
            part = "file-input"
            type="file" 
            style="display:none" 
            value="${this.specFile||""}" 
            @change="${this.onSepcFileChange}" 
            spellcheck="false"
           >
          <button class="m-btn primary only-large-screen" style="margin-left:10px;" part="btn btn-fill" @click="${this.onFileLoadClick}"> LOCAL JSON FILE </button>
        `}
      <slot name="header"></slot>
      ${"false"===this.allowSearch||"read focused".includes(this.renderStyle)?"":z`  
          <input id="search" class="header-input" type="text" part="textbox textbox-header-filter" placeholder="Filter" @change="${this.onSearchChange}" style="max-width:130px;margin-left:10px;" spellcheck="false" >
          <div style="margin: 6px 5px 0 -24px; font-size:var(--font-size-regular); cursor:pointer;">&#x21a9;</div>
        `}
      
      ${"false"===this.allowAdvancedSearch||"read focused".includes(this.renderStyle)?"":z`
          <button class="m-btn primary only-large-screen" part="btn btn-fill btn-search" style="margin-left:10px;" @click="${this.onShowSearchModalClicked}">
            Search
          </button>
        `}
    </div>
    </header>`;var e}customElements.define("api-response",class extends ie{constructor(){super(),this.selectedStatus="",this.headersForEachRespStatus={},this.mimeResponsesForEachStatus={},this.activeSchemaTab="schema"}static get properties(){return{callback:{type:String},webhook:{type:String},responses:{type:Object},parser:{type:Object},schemaStyle:{type:String,attribute:"schema-style"},renderStyle:{type:String,attribute:"render-style"},selectedStatus:{type:String,attribute:"selected-status"},selectedMimeType:{type:String,attribute:"selected-mime-type"},activeSchemaTab:{type:String,attribute:"active-schema-tab"},schemaExpandLevel:{type:Number,attribute:"schema-expand-level"},schemaDescriptionExpanded:{type:String,attribute:"schema-description-expanded"},allowSchemaDescriptionExpandToggle:{type:String,attribute:"allow-schema-description-expand-toggle"},schemaHideReadOnly:{type:String,attribute:"schema-hide-read-only"},schemaHideWriteOnly:{type:String,attribute:"schema-hide-write-only"}}}static get styles(){return[Ke,Ye,et,Ze,Je,kI,c`
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
      .top-gap{margin-top:16px;}
      .example-panel{
        font-size:var(--font-size-small);
        margin:0;
      }
      .focused-mode,
      .read-mode {
        padding-top:24px;
        margin-top:12px;
        border-top: 1px dashed var(--border-color);
      }`,nt]}render(){return z`
    <div class="col regular-font response-panel ${this.renderStyle}-mode">
      <div class=" ${"true"===this.callback?"tiny-title":"req-res-title"} "> 
        ${"true"===this.callback?"CALLBACK RESPONSE":"RESPONSE"}
      </div>
      <div>
        ${this.responseTemplate()}
      <div>  
    </div>  
    `}resetSelection(){this.selectedStatus="",this.selectedMimeType=""}responseTemplate(){if(!this.responses)return"";for(const n in this.responses){this.selectedStatus||(this.selectedStatus=n);const a={};for(const r in null===(e=this.responses[n])||void 0===e?void 0:e.content){var e,t;const o=this.responses[n].content[r];this.selectedMimeType||(this.selectedMimeType=r);const i=LI(o.schema,{}),s=DI(o.schema,r,o.examples,o.example,"true"!==this.callback&&"true"!==this.webhook,"true"===this.callback||"true"===this.webhook,r.includes("json")?"json":"text");a[r]={description:this.responses[n].description,examples:s,selectedExample:(null===(t=s[0])||void 0===t?void 0:t.exampleId)||"",schemaTree:i}}const o=[];for(const e in null===(r=this.responses[n])||void 0===r?void 0:r.headers){var r;o.push({name:e,...this.responses[n].headers[e]})}this.headersForEachRespStatus[n]=o,this.mimeResponsesForEachStatus[n]=a}return z`
      ${Object.keys(this.responses).length>1?z`<div class='row' style='flex-wrap:wrap'>
          ${Object.keys(this.responses).map((e=>z`
            ${"$$ref"===e?"":z`
                <button 
                  @click="${()=>{this.selectedStatus=e,this.responses[e].content&&Object.keys(this.responses[e].content)[0]?this.selectedMimeType=Object.keys(this.responses[e].content)[0]:this.selectedMimeType=void 0}}"
                  class='m-btn small ${this.selectedStatus===e?"primary":""}'
                  part="btn ${this.selectedStatus===e?"btn-response-status btn-selected-response-status":" btn-response-status"}"
                  style='margin: 8px 4px 0 0'
                > 
                  ${e} 
                </button>`}`))}`:z`<span>${Object.keys(this.responses)[0]}</span>`}
      </div>

      ${Object.keys(this.responses).map((e=>{var t,r;return z`
        <div style = 'display: ${e===this.selectedStatus?"block":"none"}' >
          <div class="top-gap">
            <span class="resp-descr m-markdown ">${QP(We((null===(t=this.responses[e])||void 0===t?void 0:t.description)||""))}</span>
            ${this.headersForEachRespStatus[e]&&(null===(r=this.headersForEachRespStatus[e])||void 0===r?void 0:r.length)>0?z`${this.responseHeaderListTemplate(this.headersForEachRespStatus[e])}`:""}
          </div>
          ${0===Object.keys(this.mimeResponsesForEachStatus[e]).length?"":z`  
              <div class="tab-panel col">
                <div class="tab-buttons row" @click="${e=>{"button"===e.target.tagName.toLowerCase()&&(this.activeSchemaTab=e.target.dataset.tab)}}" >
                  <button class="tab-btn ${"example"===this.activeSchemaTab?"active":""}" data-tab = 'example'>EXAMPLE </button>
                  <button class="tab-btn ${"example"!==this.activeSchemaTab?"active":""}" data-tab = 'schema' >SCHEMA</button>
                  <div style="flex:1"></div>
                  ${1===Object.keys(this.mimeResponsesForEachStatus[e]).length?z`<span class='small-font-size gray-text' style='align-self:center; margin-top:8px;'> ${Object.keys(this.mimeResponsesForEachStatus[e])[0]} </span>`:z`${this.mimeTypeDropdownTemplate(Object.keys(this.mimeResponsesForEachStatus[e]))}`}
                </div>
                ${"example"===this.activeSchemaTab?z`<div class ='tab-content col' style = 'flex:1;'>
                      ${this.mimeExampleTemplate(this.mimeResponsesForEachStatus[e][this.selectedMimeType])}
                    </div>`:z`<div class ='tab-content col' style = 'flex:1;'>
                      ${this.mimeSchemaTemplate(this.mimeResponsesForEachStatus[e][this.selectedMimeType])}
                    </div>`}
              </div>
            `}`}))}
    `}responseHeaderListTemplate(e){return z`
      <div style="padding:16px 0 8px 0" class="resp-headers small-font-size bold-text">RESPONSE HEADERS</div> 
      <table role="presentation" style="border-collapse: collapse; margin-bottom:16px; border:1px solid var(--border-color); border-radius: var(--border-radius)" class="small-font-size mono-font">
        ${e.map((e=>z`
          <tr>
            <td style="padding:8px; vertical-align: baseline; min-width:120px; border-top: 1px solid var(--light-border-color); text-overflow: ellipsis;">
              ${e.name||""}
            </td> 
            <td style="padding:4px; vertical-align: baseline; padding:0 5px; border-top: 1px solid var(--light-border-color); text-overflow: ellipsis;">
              ${e.schema.type||""}
            </td> 
            <td style="padding:8px; vertical-align: baseline; border-top: 1px solid var(--light-border-color);text-overflow: ellipsis;">
              <div class="m-markdown-small regular-font" >${QP(We(e.description||""))}</div>
            </td>
            <td style="padding:8px; vertical-align: baseline; border-top: 1px solid var(--light-border-color); text-overflow: ellipsis;">
              ${e.schema.example||""}
            </td>
          </tr>
        `))}
    </table>`}mimeTypeDropdownTemplate(e){return z`
      <select aria-label='mime types' @change="${e=>{this.selectedMimeType=e.target.value}}" style='margin-bottom: -1px; z-index:1'>
        ${e.map((e=>z`<option value='${e}' ?selected = '${e===this.selectedMimeType}'> ${e} </option>`))}
      </select>`}onSelectExample(e){[...e.target.closest(".example-panel").querySelectorAll(".example")].forEach((t=>{t.style.display=t.dataset.example===e.target.value?"block":"none"}))}mimeExampleTemplate(e){return e?z`
      ${1===e.examples.length?z`
          ${"json"===e.examples[0].exampleFormat?z`
              ${e.examples[0].exampleSummary&&e.examples[0].exampleSummary.length>80?z`<div style="padding: 4px 0"> ${e.examples[0].exampleSummary} </div>`:""}
              ${e.examples[0].exampleDescription?z`<div class="m-markdown-small" style="padding: 4px 0"> ${QP(We(e.examples[0].exampleDescription||""))} </div>`:""}
              <json-tree 
                render-style = '${this.renderStyle}'
                .data="${e.examples[0].exampleValue}"
                class = 'example-panel ${"read"===this.renderStyle?"border pad-8-16":"border-top pad-top-8"}'
                exportparts = "btn:btn, btn-fill:btn-fill, btn-copy:btn-copy" 
              ></json-tree>`:z`
              ${e.examples[0].exampleSummary&&e.examples[0].exampleSummary.length>80?z`<div style="padding: 4px 0"> ${e.examples[0].exampleSummary} </div>`:""}
              ${e.examples[0].exampleDescription?z`<div class="m-markdown-small" style="padding: 4px 0"> ${QP(We(e.examples[0].exampleDescription||""))} </div>`:""}
              <pre class = 'example-panel ${"read"===this.renderStyle?"border pad-8-16":"border-top pad-top-8"}'>${e.examples[0].exampleValue}</pre>
            `}`:z`
          <span class = 'example-panel ${"read"===this.renderStyle?"border pad-8-16":"border-top pad-top-8"}'>
            <select aria-label='response examples' style="min-width:100px; max-width:100%" @change='${e=>this.onSelectExample(e)}'>
              ${e.examples.map((t=>z`<option value="${t.exampleId}" ?selected=${t.exampleId===e.selectedExample} > 
                ${t.exampleSummary.length>80?t.exampleId:t.exampleSummary} 
              </option>`))}
            </select>
            ${e.examples.map((t=>z`
              <div class="example" data-example = '${t.exampleId}' style = "display: ${t.exampleId===e.selectedExample?"block":"none"}">
                ${t.exampleSummary&&t.exampleSummary.length>80?z`<div style="padding: 4px 0"> ${t.exampleSummary} </div>`:""}
                ${t.exampleDescription?z`<div class="m-markdown-small"  style="padding: 4px 0"> ${QP(We(t.exampleDescription||""))} </div>`:""}
                ${"json"===t.exampleFormat?z`
                    <json-tree 
                      render-style = '${this.renderStyle}'
                      .data = '${t.exampleValue}'
                      exportparts = "btn:btn, btn-fill:btn-fill, btn-copy:btn-copy" 
                    ></json-tree>`:z`<pre>${t.exampleValue}</pre>`}
              </div>  
            `))}
          </span>  
        `}
    `:z`
        <pre style='color:var(--red)' class = '${"read"===this.renderStyle?"read example-panel border pad-8-16":"example-panel border-top"}'> No example provided </pre>
      `}mimeSchemaTemplate(e){return e?z`
      ${"table"===this.schemaStyle?z`
          <schema-table
            .data = "${e.schemaTree}"
            schema-expand-level = "${this.schemaExpandLevel}"
            schema-description-expanded = "${this.schemaDescriptionExpanded}"
            allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
            schema-hide-read-only = "${this.schemaHideReadOnly}"
            schema-hide-write-only = "${this.schemaHideWriteOnly}"
            exportparts = "schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
          > </schema-table> `:z`
          <schema-tree
            .data = '${e.schemaTree}'
            schema-expand-level = "${this.schemaExpandLevel}"
            schema-description-expanded = "${this.schemaDescriptionExpanded}"
            allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
            schema-hide-read-only = "${this.schemaHideReadOnly}"
            schema-hide-write-only = "${this.schemaHideWriteOnly}"
            exportparts = "schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
          > </schema-tree>`}`:z`
        <pre style='color:var(--red)' class = '${"read"===this.renderStyle?"border pad-8-16":"border-top"}'> Schema not found</pre>
      `}});const fR=c`
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
`;function mR(){var e;return document.addEventListener("close",(()=>{this.showAdvancedSearchDialog=!1})),document.addEventListener("open",this.onOpenSearchDialog),z`
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
      
      ${null===(e=this.advancedSearchMatches)||void 0===e?void 0:e.map((e=>z`
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
  `}customElements.define("dialog-box",class extends ie{static get properties(){return{heading:{type:String,attribute:"heading"},show:{type:String,attribute:"show"}}}static get styles(){return[fR]}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",(e=>{"Escape"===e.code&&this.onClose()}))}attributeChangedCallback(e,t,r){t!==r&&("heading"===e&&(this.heading=r),"show"===e&&(this.show=r,"true"===r&&document.dispatchEvent(new CustomEvent("open",{bubbles:!0,composed:!0,detail:this})))),super.attributeChangedCallback(e,t,r)}render(){return z`
    ${"true"===this.show?z`
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
        </div>`:""}`}onClose(){document.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}});const yR={color:{inputReverseFg:"#fff",inputReverseBg:"#333",headerBg:"#444",getRgb(e){if(0===e.indexOf("#")&&(e=e.slice(1,7)),3!==e.length&&4!==e.length||(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),6!==e.length)throw new Error("Invalid HEX color.");return{r:parseInt(e.slice(0,2),16),g:parseInt(e.slice(2,4),16),b:parseInt(e.slice(4,6),16)}},luminanace(e){const t=this.getRgb(e);return.299*t.r+.587*t.g+.114*t.b},invert(e){return this.luminanace(e)>135?"#000":"#fff"},opacity(e,t){const r=this.getRgb(e);return`rgba(${r.r}, ${r.g}, ${r.b}, ${t})`},brightness(e,t){const r=this.getRgb(e);return r.r+=t,r.g+=t,r.b+=t,r.r>255?r.r=255:r.r<0&&(r.r=0),r.g>255?r.g=255:r.g<0&&(r.g=0),r.b>255?r.b=255:r.b<0&&(r.b=0),`#${r.r.toString(16).padStart(2,"0")}${r.g.toString(16).padStart(2,"0")}${r.b.toString(16).padStart(2,"0")}`},hasGoodContrast(e,t){return this.luminanace(e)-this.luminanace(t)}}};function gR(e){return/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8}|[A-Fa-f0-9]{4})$/i.test(e)}function vR(e,t={}){let r={};const n=t.primaryColor?t.primaryColor:"dark"===e?"#f76b39":"#ff591e",a=yR.color.invert(n),o=yR.color.opacity(n,"0.8");if("dark"===e){const e=t.bg1?t.bg1:"#2a2b2c",i=t.fg1?t.fg1:"#bbb",s=t.bg2?t.bg2:yR.color.brightness(e,5),l=t.bg3?t.bg3:yR.color.brightness(e,17),c=t.bg3?t.bg3:yR.color.brightness(e,35),p=t.fg2?t.fg2:yR.color.brightness(i,-15),d=t.fg3?t.fg3:yR.color.brightness(i,-20),u=t.fg3?t.fg3:yR.color.brightness(i,-65),h=t.inlineCodeFg?t.inlineCodeFg:"#aaa",f="#bbb",m="#eee",y=t.headerColor?t.headerColor:yR.color.brightness(e,10),g=t.navBgColor?t.navBgColor:yR.color.brightness(e,10);r={bg1:e,bg2:s,bg3:l,lightBg:c,fg1:i,fg2:p,fg3:d,lightFg:u,inlineCodeFg:h,primaryColor:n,primaryColorTrans:o,primaryColorInvert:a,selectionBg:f,selectionFg:m,overlayBg:"rgba(80, 80, 80, 0.4)",navBgColor:g,navTextColor:t.navTextColor?t.navTextColor:yR.color.opacity(yR.color.invert(g),"0.50"),navHoverBgColor:t.navHoverBgColor?t.navHoverBgColor:yR.color.brightness(g,-15),navHoverTextColor:t.navHoverTextColor?t.navHoverTextColor:yR.color.invert(g),navAccentColor:t.navAccentColor?t.navAccentColor:yR.color.brightness(n,25),headerColor:y,headerColorInvert:yR.color.invert(y),headerColorDarker:yR.color.brightness(y,-20),headerColorBorder:yR.color.brightness(y,10),borderColor:t.borderColor||yR.color.brightness(e,20),lightBorderColor:t.lightBorderColor||yR.color.brightness(e,15),codeBorderColor:t.codeBorderColor||yR.color.brightness(e,30),inputBg:t.inputBg||yR.color.brightness(e,-5),placeHolder:t.placeHolder||yR.color.opacity(i,"0.3"),hoverColor:t.hoverColor||yR.color.brightness(e,-10),red:t.red?t.red:"#F06560",lightRed:t.lightRed?t.lightRed:yR.color.brightness(e,-10),pink:t.pink?t.pink:"#ffb2b2",lightPink:t.lightPink||yR.color.brightness(e,-10),green:t.green||"#7ec699",lightGreen:t.lightGreen||yR.color.brightness(e,-10),blue:t.blue||"#71b7ff",lightBlue:t.lightBlue||yR.color.brightness(e,-10),orange:t.orange?t.orange:"#f08d49",lightOrange:t.lightOrange||yR.color.brightness(e,-10),yellow:t.yellow||"#827717",lightYellow:t.lightYellow||yR.color.brightness(e,-10),purple:t.purple||"#786FF1",brown:t.brown||"#D4AC0D",codeBg:t.codeBg||yR.color.opacity(yR.color.brightness(e,-15),.7),codeFg:t.codeFg||"#aaa",codePropertyColor:t.codePropertyColor||"#f8c555",codeKeywordColor:t.codeKeywordColor||"#cc99cd",codeOperatorColor:t.codeOperatorColor||"#67cdcc"}}else{const e=t.bg1?t.bg1:"#fafbfc",i=t.fg1?t.fg1:"#444444",s=t.bg2?t.bg2:yR.color.brightness(e,-5),l=t.bg3?t.bg3:yR.color.brightness(e,-15),c=t.bg3?t.bg3:yR.color.brightness(e,-45),p=t.fg2?t.fg2:yR.color.brightness(i,17),d=t.fg3?t.fg3:yR.color.brightness(i,30),u=t.fg3?t.fg3:yR.color.brightness(i,70),h=t.inlineCodeFg?t.inlineCodeFg:"brown",f="#444",m="#eee",y=t.headerColor?t.headerColor:yR.color.brightness(e,-180),g=t.navBgColor?t.navBgColor:yR.color.brightness(e,-200);r={bg1:e,bg2:s,bg3:l,lightBg:c,fg1:i,fg2:p,fg3:d,lightFg:u,inlineCodeFg:h,primaryColor:n,primaryColorTrans:o,primaryColorInvert:a,selectionBg:f,selectionFg:m,overlayBg:"rgba(0, 0, 0, 0.4)",navBgColor:g,navTextColor:t.navTextColor?t.navTextColor:yR.color.opacity(yR.color.invert(g),"0.65"),navHoverBgColor:t.navHoverBgColor?t.navHoverBgColor:yR.color.brightness(g,-15),navHoverTextColor:t.navHoverTextColor?t.navHoverTextColor:yR.color.invert(g),navAccentColor:t.navAccentColor?t.navAccentColor:yR.color.brightness(n,25),headerColor:y,headerColorInvert:yR.color.invert(y),headerColorDarker:yR.color.brightness(y,-20),headerColorBorder:yR.color.brightness(y,10),borderColor:t.borderColor||yR.color.brightness(e,-38),lightBorderColor:t.lightBorderColor||yR.color.brightness(e,-23),codeBorderColor:t.codeBorderColor||"transparent",inputBg:t.inputBg||yR.color.brightness(e,10),placeHolder:t.placeHolder||yR.color.brightness(u,20),hoverColor:t.hoverColor||yR.color.brightness(e,-5),red:t.red||"#F06560",lightRed:t.lightRed||"#fff0f0",pink:t.pink?t.pink:"#990055",lightPink:t.lightPink?t.lightPink:"#ffb2b2",green:t.green||"#690",lightGreen:t.lightGreen||"#fbfff0",blue:t.blue||"#47AFE8",lightBlue:t.lightBlue||"#eff8fd",orange:t.orange||"#FF9900",lightOrange:t.lightOrange||"#fff5e6",yellow:t.yellow||"#827717",lightYellow:t.lightYellow||"#fff5cc",purple:t.purple||"#786FF1",brown:t.brown||"#D4AC0D",codeBg:t.codeBg||yR.color.opacity(yR.color.brightness(e,-15),.7),codeFg:t.codeFg||"#666",codePropertyColor:t.codePropertyColor||"#905",codeKeywordColor:t.codeKeywordColor||"#07a",codeOperatorColor:t.codeOperatorColor||"#9a6e3a"}}return z`
  <style>
  *, *:before, *:after { box-sizing: border-box; }
  
  :host {
    /* Common Styles - irrespective of themes */  
    --border-radius: 2px;
    --layout: ${this.layout||"row"};
    --font-mono: ${this.monoFont||'Monaco, "Andale Mono", "Roboto Mono", Consolas, monospace'};
    --font-regular: ${this.regularFont||'"Open Sans", Avenir, "Segoe UI", Arial, sans-serif'};
    --scroll-bar-width: 8px;
    --nav-item-padding: ${"relaxed"===this.navItemSpacing?"10px 16px 10px 10px":"compact"===this.navItemSpacing?"5px 16px 5px 10px":"7px 16px 7px 10px"};
    
    --resp-area-height: ${this.responseAreaHeight};
    --font-size-small: ${"default"===this.fontSize?"12px":"large"===this.fontSize?"13px":"14px"};
    --font-size-mono: ${"default"===this.fontSize?"13px":"large"===this.fontSize?"14px":"15px"};
    --font-size-regular: ${"default"===this.fontSize?"14px":"large"===this.fontSize?"15px":"16px"};
    --dialog-z-index: 1000;

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

    /* Nav API Method Colors*/
    --nav-get-color:${r.blue};
    --nav-put-color:${r.orange};
    --nav-post-color:${r.green};
    --nav-delete-color:${r.red};
    --nav-head-color:${r.yellow};

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
  </style>`}function bR(e=!1,t=!0,r=!0,n=!1){if(!this.resolvedSpec)return"";"true"===this.persistAuth&&aI.call(this);const a={bg1:gR(this.bgColor)?this.bgColor:"",fg1:gR(this.textColor)?this.textColor:"",headerColor:gR(this.headerColor)?this.headerColor:"",primaryColor:gR(this.primaryColor)?this.primaryColor:"",navBgColor:gR(this.navBgColor)?this.navBgColor:"",navTextColor:gR(this.navTextColor)?this.navTextColor:"",navHoverBgColor:gR(this.navHoverBgColor)?this.navHoverBgColor:"",navHoverTextColor:gR(this.navHoverTextColor)?this.navHoverTextColor:"",navAccentColor:gR(this.navAccentColor)?this.navAccentColor:""};return this.resolvedSpec.specLoadError?e?z`
        ${"dark"===this.theme?vR.call(this,"dark",a):vR.call(this,"light",a)}
        <div style="display:flex; align-items:center; border:1px dashed var(--border-color); height:42px; padding:5px; font-size:var(--font-size-small); color:var(--red); font-family:var(--font-mono)"> ${this.resolvedSpec.info.description} </div>
      `:z`
      ${"dark"===this.theme?vR.call(this,"dark",a):vR.call(this,"light",a)}
      <!-- Header -->
      ${hR.call(this)}
      <main class="main-content regular-font" part="section-main-content">
        <slot></slot>
        <div style="margin:24px; text-align: center;">
          <h1 style="color: var(--red)"> ${this.resolvedSpec.info.title} </h1>
          <div style="font-family:var(--font-mono)"> ${this.resolvedSpec.info.description} </div>
        </div>
      </main>  
    `:this.resolvedSpec.isSpecLoading?z`
      ${"dark"===this.theme?vR.call(this,"dark",a):vR.call(this,"light",a)}
      <main class="main-content regular-font" part="section-main-content">
        <slot></slot>
        <div class="main-content-inner--${this.renderStyle}-mode">
          <div class="loader"></div>
        </div>
      </main>  
    `:z`
    ${"dark"===this.theme?vR.call(this,"dark",a):vR.call(this,"light",a)}

    <!-- Header -->
    ${"false"===this.showHeader?"":hR.call(this)}
    
    <!-- Advanced Search -->
    ${"false"===this.allowAdvancedSearch?"":mR.call(this)}

    <div id='the-main-body' class="body ${this.cssClasses}" dir= ${this.pageDirection} >
      <!-- Side Nav -->
      ${"read"!==this.renderStyle&&"focused"!==this.renderStyle||"true"!==this.showSideNav||!this.resolvedSpec?"":tR.call(this)}

      <!-- Main Content -->
      <main class="main-content regular-font" part="section-main-content">
        <slot></slot>
        <div class="main-content-inner--${this.renderStyle}-mode">
          ${!0===this.loading?z`<div class="loader"></div>`:z`
              ${!0===this.loadFailed?z`<div style="text-align: center;margin: 16px;"> Unable to load the Spec</div>`:z`
                  <div class="operations-root" @click="${e=>{this.handleHref(e)}}">
                  ${"focused"===this.renderStyle?z`${iR.call(this)}`:z`
                      ${"true"===this.showInfo?GI.call(this):""}
                      ${"true"===this.allowServerSelection?ZI.call(this):""}
                      ${"true"===this.allowAuthentication?uI.call(this):""}
                      <div id="operations-top" class="observe-me">
                        <slot name="operations-top"></slot>
                      </div>  
                      ${"read"===this.renderStyle?BI.call(this):uR.call(this,t,r,n)}
                    `}
                  </div>
                `}`}
        </div>
        <slot name="footer"></slot>
      </main>
    </div>  
  `}class xR extends ie{constructor(){super();const e={root:this.getRootNode().host,rootMargin:"-50px 0px -50px 0px",threshold:0};this.showSummaryWhenCollapsed=!0,this.isIntersectionObserverActive=!0,this.intersectionObserver=new IntersectionObserver((e=>{this.onIntersect(e)}),e)}static get properties(){return{headingText:{type:String,attribute:"heading-text"},gotoPath:{type:String,attribute:"goto-path"},updateRoute:{type:String,attribute:"update-route"},routePrefix:{type:String,attribute:"route-prefix"},specUrl:{type:String,attribute:"spec-url"},sortTags:{type:String,attribute:"sort-tags"},generateMissingTags:{type:String,attribute:"generate-missing-tags"},sortEndpointsBy:{type:String,attribute:"sort-endpoints-by"},specFile:{type:String,attribute:!1},layout:{type:String},renderStyle:{type:String,attribute:"render-style"},defaultSchemaTab:{type:String,attribute:"default-schema-tab"},responseAreaHeight:{type:String,attribute:"response-area-height"},fillRequestFieldsWithExample:{type:String,attribute:"fill-request-fields-with-example"},persistAuth:{type:String,attribute:"persist-auth"},onNavTagClick:{type:String,attribute:"on-nav-tag-click"},schemaStyle:{type:String,attribute:"schema-style"},schemaExpandLevel:{type:Number,attribute:"schema-expand-level"},schemaDescriptionExpanded:{type:String,attribute:"schema-description-expanded"},schemaHideReadOnly:{type:String,attribute:"schema-hide-read-only"},schemaHideWriteOnly:{type:String,attribute:"schema-hide-write-only"},apiKeyName:{type:String,attribute:"api-key-name"},apiKeyLocation:{type:String,attribute:"api-key-location"},apiKeyValue:{type:String,attribute:"api-key-value"},defaultApiServerUrl:{type:String,attribute:"default-api-server"},serverUrl:{type:String,attribute:"server-url"},oauthReceiver:{type:String,attribute:"oauth-receiver"},showHeader:{type:String,attribute:"show-header"},showSideNav:{type:String,attribute:"show-side-nav"},showInfo:{type:String,attribute:"show-info"},allowAuthentication:{type:String,attribute:"allow-authentication"},allowTry:{type:String,attribute:"allow-try"},allowSpecUrlLoad:{type:String,attribute:"allow-spec-url-load"},allowSpecFileLoad:{type:String,attribute:"allow-spec-file-load"},allowSpecFileDownload:{type:String,attribute:"allow-spec-file-download"},allowSearch:{type:String,attribute:"allow-search"},allowAdvancedSearch:{type:String,attribute:"allow-advanced-search"},allowServerSelection:{type:String,attribute:"allow-server-selection"},allowSchemaDescriptionExpandToggle:{type:String,attribute:"allow-schema-description-expand-toggle"},showComponents:{type:String,attribute:"show-components"},pageDirection:{type:String,attribute:"page-direction"},theme:{type:String},bgColor:{type:String,attribute:"bg-color"},textColor:{type:String,attribute:"text-color"},headerColor:{type:String,attribute:"header-color"},primaryColor:{type:String,attribute:"primary-color"},fontSize:{type:String,attribute:"font-size"},regularFont:{type:String,attribute:"regular-font"},monoFont:{type:String,attribute:"mono-font"},loadFonts:{type:String,attribute:"load-fonts"},cssFile:{type:String,attribute:"css-file"},cssClasses:{type:String,attribute:"css-classes"},navBgColor:{type:String,attribute:"nav-bg-color"},navTextColor:{type:String,attribute:"nav-text-color"},navHoverBgColor:{type:String,attribute:"nav-hover-bg-color"},navHoverTextColor:{type:String,attribute:"nav-hover-text-color"},navAccentColor:{type:String,attribute:"nav-accent-color"},navItemSpacing:{type:String,attribute:"nav-item-spacing"},showMethodInNavBar:{type:String,attribute:"show-method-in-nav-bar"},usePathInNavBar:{type:String,attribute:"use-path-in-nav-bar"},infoDescriptionHeadingsInNavBar:{type:String,attribute:"info-description-headings-in-navbar"},fetchCredentials:{type:String,attribute:"fetch-credentials"},matchPaths:{type:String,attribute:"match-paths"},matchType:{type:String,attribute:"match-type"},loading:{type:Boolean},focusedElementId:{type:String},showAdvancedSearchDialog:{type:Boolean},advancedSearchMatches:{type:Object}}}static get styles(){return[Ke,Je,Ye,Ze,Qe,Xe,et,tt,rt,c`
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
      .section-gap,
      .section-gap--focused-mode,
      .section-gap--read-mode { 
        padding: 0px 4px; 
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
      .expanded-endpoint-body{ 
        position: relative;
        padding: 6px 0px; 
      }
      .expanded-endpoint-body.deprecated{ filter:opacity(0.6); }
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

      .nav-method.as-colored-text.get { color:var(--nav-get-color); }
      .nav-method.as-colored-text.put { color:var(--nav-put-color); }
      .nav-method.as-colored-text.post { color:var(--nav-post-color); }
      .nav-method.as-colored-text.delete { color:var(--nav-delete-color); }
      .nav-method.as-colored-text.head, .nav-method.as-colored-text.patch, .nav-method.as-colored-text.options { color:var(--nav-head-color); }
      
      .nav-method.as-colored-block {
        padding: 1px 4px;
        min-width: 30px;
        border-radius: 4px 0 0 4px;
        color: #000;
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
      }`,nt]}connectedCallback(){super.connectedCallback();const e=this.parentElement;if(e&&(0===e.offsetWidth&&""===e.style.width&&(e.style.width="100vw"),0===e.offsetHeight&&""===e.style.height&&(e.style.height="100vh"),"BODY"===e.tagName&&(e.style.marginTop||(e.style.marginTop="0"),e.style.marginRight||(e.style.marginRight="0"),e.style.marginBottom||(e.style.marginBottom="0"),e.style.marginLeft||(e.style.marginLeft="0"))),"false"!==this.loadFonts){const e={family:"Open Sans",style:"normal",weight:"300",unicodeRange:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"},t=new FontFace("Open Sans","url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN_r8OUuhpKKSTjw.woff2) format('woff2')",e);e.weight="600";const r=new FontFace("Open Sans","url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UNirkOUuhpKKSTjw.woff2) format('woff2')",e);t.load().then((e=>{document.fonts.add(e)})),r.load().then((e=>{document.fonts.add(e)}))}this.layout&&"row, column,".includes(`${this.layout},`)||(this.layout="row"),this.renderStyle&&"read, view, focused,".includes(`${this.renderStyle},`)||(this.renderStyle="read"),this.schemaStyle&&"tree, table,".includes(`${this.schemaStyle},`)||(this.schemaStyle="tree"),this.theme&&"light, dark,".includes(`${this.theme},`)||(this.theme=window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"),this.defaultSchemaTab&&"example, schema, model,".includes(`${this.defaultSchemaTab},`)?"model"===this.defaultSchemaTab&&(this.defaultSchemaTab="schema"):this.defaultSchemaTab="example",(!this.schemaExpandLevel||this.schemaExpandLevel<1)&&(this.schemaExpandLevel=99999),this.schemaDescriptionExpanded&&"true, false,".includes(`${this.schemaDescriptionExpanded},`)||(this.schemaDescriptionExpanded="false"),this.schemaHideReadOnly&&"default, never,".includes(`${this.schemaHideReadOnly},`)||(this.schemaHideReadOnly="default"),this.schemaHideWriteOnly&&"default, never,".includes(`${this.schemaHideWriteOnly},`)||(this.schemaHideWriteOnly="default"),this.fillRequestFieldsWithExample&&"true, false,".includes(`${this.fillRequestFieldsWithExample},`)||(this.fillRequestFieldsWithExample="true"),this.persistAuth&&"true, false,".includes(`${this.persistAuth},`)||(this.persistAuth="false"),this.onNavTagClick&&"expand-collapse, show-description,".includes(`${this.onNavTagClick},`)||(this.onNavTagClick="expand-collapse"),this.responseAreaHeight||(this.responseAreaHeight="400px"),this.allowSearch&&"true, false,".includes(`${this.allowSearch},`)||(this.allowSearch="true"),this.allowAdvancedSearch&&"true, false,".includes(`${this.allowAdvancedSearch},`)||(this.allowAdvancedSearch="true"),this.allowTry&&"true, false,".includes(`${this.allowTry},`)||(this.allowTry="true"),this.apiKeyValue||(this.apiKeyValue="-"),this.apiKeyLocation||(this.apiKeyLocation="header"),this.apiKeyName||(this.apiKeyName=""),this.oauthReceiver||(this.oauthReceiver="oauth-receiver.html"),this.updateRoute&&"true, false,".includes(`${this.updateRoute},`)||(this.updateRoute="true"),this.routePrefix||(this.routePrefix="#"),this.sortTags&&"true, false,".includes(`${this.sortTags},`)||(this.sortTags="false"),this.generateMissingTags&&"true, false,".includes(`${this.generateMissingTags},`)||(this.generateMissingTags="false"),this.sortEndpointsBy&&"method, path, summary, none,".includes(`${this.sortEndpointsBy},`)||(this.sortEndpointsBy="path"),this.navItemSpacing&&"compact, relaxed, default,".includes(`${this.navItemSpacing},`)||(this.navItemSpacing="default"),this.showMethodInNavBar&&"false, as-plain-text, as-colored-text, as-colored-block,".includes(`${this.showMethodInNavBar},`)||(this.showMethodInNavBar="false"),this.usePathInNavBar&&"true, false,".includes(`${this.usePathInNavBar},`)||(this.usePathInNavBar="false"),this.fontSize&&"default, large, largest,".includes(`${this.fontSize},`)||(this.fontSize="default"),this.showInfo&&"true, false,".includes(`${this.showInfo},`)||(this.showInfo="true"),this.allowServerSelection&&"true, false,".includes(`${this.allowServerSelection},`)||(this.allowServerSelection="true"),this.allowAuthentication&&"true, false,".includes(`${this.allowAuthentication},`)||(this.allowAuthentication="true"),this.allowSchemaDescriptionExpandToggle&&"true, false,".includes(`${this.allowSchemaDescriptionExpandToggle},`)||(this.allowSchemaDescriptionExpandToggle="true"),this.showSideNav&&"true false".includes(this.showSideNav)||(this.showSideNav="true"),this.showComponents&&"true false".includes(this.showComponents)||(this.showComponents="false"),this.infoDescriptionHeadingsInNavBar&&"true, false,".includes(`${this.infoDescriptionHeadingsInNavBar},`)||(this.infoDescriptionHeadingsInNavBar="false"),this.fetchCredentials&&"omit, same-origin, include,".includes(`${this.fetchCredentials},`)||(this.fetchCredentials=""),this.matchType&&"includes regex".includes(this.matchType)||(this.matchType="includes"),this.showAdvancedSearchDialog||(this.showAdvancedSearchDialog=!1),this.cssFile||(this.cssFile=null),this.cssClasses||(this.cssClasses=""),We.setOptions({highlight:(e,t)=>Ge().languages[t]?Ge().highlight(e,Ge().languages[t],t):e}),window.addEventListener("hashchange",(()=>{const e=new RegExp(`^${this.routePrefix}`,"i"),t=window.location.hash.replace(e,"");this.scrollTo(t)}),!0)}disconnectedCallback(){this.intersectionObserver&&this.intersectionObserver.disconnect(),super.disconnectedCallback()}infoDescriptionHeadingRenderer(){const e=new We.Renderer;return e.heading=(e,t,r,n)=>`<h${t} class="observe-me" id="${n.slug(r)}">${e}</h${t}>`,e}render(){const e=document.querySelector(`link[href*="${this.cssFile}"]`);return e&&this.shadowRoot.appendChild(e.cloneNode()),bR.call(this)}observeExpandedContent(){this.shadowRoot.querySelectorAll(".observe-me").forEach((e=>{this.intersectionObserver.observe(e)}))}attributeChangedCallback(e,t,r){if("spec-url"===e&&t!==r&&window.setTimeout((async()=>{await this.loadSpec(r),this.gotoPath&&!window.location.hash&&this.scrollTo(this.gotoPath)}),0),"render-style"===e&&("read"===r?window.setTimeout((()=>{this.observeExpandedContent()}),100):this.intersectionObserver.disconnect()),"api-key-name"===e||"api-key-location"===e||"api-key-value"===e){let t=!1,n="",a="",o="";if("api-key-name"===e?this.getAttribute("api-key-location")&&this.getAttribute("api-key-value")&&(n=r,a=this.getAttribute("api-key-location"),o=this.getAttribute("api-key-value"),t=!0):"api-key-location"===e?this.getAttribute("api-key-name")&&this.getAttribute("api-key-value")&&(a=r,n=this.getAttribute("api-key-name"),o=this.getAttribute("api-key-value"),t=!0):"api-key-value"===e&&this.getAttribute("api-key-name")&&this.getAttribute("api-key-location")&&(o=r,a=this.getAttribute("api-key-location"),n=this.getAttribute("api-key-name"),t=!0),t&&this.resolvedSpec){const e=this.resolvedSpec.securitySchemes.find((e=>e.securitySchemeId===ot));e?(e.name=n,e.in=a,e.value=o,e.finalKeyValue=o):this.resolvedSpec.securitySchemes.push({securitySchemeId:ot,description:"api-key provided in rapidoc element attributes",type:"apiKey",name:n,in:a,value:o,finalKeyValue:o}),this.requestUpdate()}}super.attributeChangedCallback(e,t,r)}onSepcUrlChange(){this.setAttribute("spec-url",this.shadowRoot.getElementById("spec-url").value)}onSepcFileChange(e){this.setAttribute("spec-file",this.shadowRoot.getElementById("spec-file").value);const t=e.target.files[0],r=new FileReader;r.onload=()=>{try{const e=JSON.parse(r.result);this.loadSpec(e),this.shadowRoot.getElementById("spec-url").value=""}catch(e){console.error("RapiDoc: Unable to read or parse json")}},r.readAsText(t)}onFileLoadClick(){this.shadowRoot.getElementById("spec-file").click()}onSearchChange(e){this.matchPaths=e.target.value,this.resolvedSpec.tags.forEach((e=>e.paths.filter((t=>{this.matchPaths&&lt(this.matchPaths,t,this.matchType)&&(e.expanded=!0)})))),this.resolvedSpec.components.forEach((e=>e.subComponents.filter((e=>{e.expanded=!1,this.matchPaths&&!function(e,t){return t.name.toLowerCase().includes(e.toLowerCase())}(this.matchPaths,e)||(e.expanded=!0)})))),this.requestUpdate()}onClearSearch(){this.shadowRoot.getElementById("nav-bar-search").value="",this.matchPaths="",this.resolvedSpec.components.forEach((e=>e.subComponents.filter((e=>{e.expanded=!0}))))}onShowSearchModalClicked(){this.showAdvancedSearchDialog=!0}async onOpenSearchDialog(e){const t=e.detail.querySelector("input");await it(0),t&&t.focus()}async loadSpec(e){if(e){this.matchPaths="";try{this.resolvedSpec={specLoadError:!1,isSpecLoading:!0,tags:[]},this.loading=!0,this.loadFailed=!1;const t=await MP.call(this,e,"true"===this.generateMissingTags,"true"===this.sortTags,this.getAttribute("sort-endpoints-by"),this.getAttribute("api-key-name"),this.getAttribute("api-key-location"),this.getAttribute("api-key-value"),this.getAttribute("server-url"));this.loading=!1,this.afterSpecParsedAndValidated(t)}catch(e){this.loading=!1,this.loadFailed=!0,this.resolvedSpec=null,console.error(`RapiDoc: Unable to resolve the API spec..  ${e.message}`)}}}async afterSpecParsedAndValidated(e){var t;for(this.resolvedSpec=e,this.selectedServer=void 0,this.defaultApiServerUrl&&(this.defaultApiServerUrl===this.serverUrl?this.selectedServer={url:this.serverUrl,computedUrl:this.serverUrl}:this.resolvedSpec.servers&&(this.selectedServer=this.resolvedSpec.servers.find((e=>e.url===this.defaultApiServerUrl)))),this.selectedServer||this.resolvedSpec.servers&&(this.selectedServer=this.resolvedSpec.servers[0]),this.requestUpdate();!await this.updateComplete;);const r=new CustomEvent("spec-loaded",{detail:e});this.dispatchEvent(r),this.intersectionObserver.disconnect(),"read"===this.renderStyle&&(await it(100),this.observeExpandedContent());if(null===(t=window.location.hash)||void 0===t?void 0:t.substring(1)){const e=new RegExp(`^${this.routePrefix}`,"i"),t=window.location.hash.replace(e,"");"view"===this.renderStyle?this.expandAndGotoOperation(t,!0,!0):this.scrollTo(t)}else if("focused"===this.renderStyle&&!this.gotoPath){var n;const e=this.showInfo?"overview":null===(n=this.resolvedSpec.tags[0])||void 0===n?void 0:n.paths[0];this.scrollTo(e)}}expandAndGotoOperation(e,t=!0){if(!this.resolvedSpec)return;let r=!0;const n=-1===e.indexOf("#")?e:e.substring(1);if(n.startsWith("overview")||"servers"===n||"auth"===n)r=!1;else for(let t=0;t<(null===(a=this.resolvedSpec.tags)||void 0===a?void 0:a.length);t++){var a,o;const n=this.resolvedSpec.tags[t],i=null===(o=n.paths)||void 0===o?void 0:o.find((t=>t.elementId===e));i&&(i.expanded&&n.expanded?r=!1:(i.expanded=!0,n.expanded=!0))}t&&(r&&this.requestUpdate(),window.setTimeout((()=>{const e=this.shadowRoot.getElementById(n);e&&(e.scrollIntoView({behavior:"auto",block:"start"}),"true"===this.updateRoute&&window.history.replaceState(null,null,`${this.routePrefix||"#"}${n}`))}),r?150:0))}isValidTopId(e){return e.startsWith("overview")||"servers"===e||"auth"===e}isValidPathId(e){var t,r,n,a;return!("overview"!==e||!this.showInfo)||(!("servers"!==e||!this.allowServerSelection)||(!("auth"!==e||!this.allowAuthentication)||(e.startsWith("tag--")?null===(n=this.resolvedSpec)||void 0===n||null===(a=n.tags)||void 0===a?void 0:a.find((t=>t.elementId===e)):null===(t=this.resolvedSpec)||void 0===t||null===(r=t.tags)||void 0===r?void 0:r.find((t=>t.paths.find((t=>t.elementId===e)))))))}onIntersect(e){!1!==this.isIntersectionObserverActive&&e.forEach((e=>{if(e.isIntersecting&&e.intersectionRatio>0){const t=this.shadowRoot.querySelector(".nav-bar-tag.active, .nav-bar-path.active, .nav-bar-info.active, .nav-bar-h1.active, .nav-bar-h2.active, .operations.active"),r=this.shadowRoot.getElementById(`link-${e.target.id}`);r&&("true"===this.updateRoute&&window.history.replaceState(null,null,`${window.location.href.split("#")[0]}${this.routePrefix||"#"}${e.target.id}`),r.scrollIntoView({behavior:"auto",block:"center"}),r.classList.add("active")),t&&t.classList.remove("active")}}))}handleHref(e){if("a"===e.target.tagName.toLowerCase()&&e.target.getAttribute("href").startsWith("#")){const t=this.shadowRoot.getElementById(e.target.getAttribute("href").replace("#",""));t&&t.scrollIntoView({behavior:"auto",block:"start"})}}async scrollToEventTarget(e,t=!0){const r=e.currentTarget;if(r.dataset.contentId){if(this.isIntersectionObserverActive=!1,"focused"===this.renderStyle){const e=this.shadowRoot.querySelector("api-request");e&&e.beforerNavigationFocusedMode()}this.scrollTo(r.dataset.contentId,!0,t),setTimeout((()=>{this.isIntersectionObserverActive=!0}),300)}}async scrollTo(e,t=!0,r=!0){if("focused"===this.renderStyle&&(this.focusedElementId=e,await it(0)),"view"===this.renderStyle)this.expandAndGotoOperation(e,t,!0);else{let t=!1;const n=this.shadowRoot.getElementById(e);if(n?(t=!0,n.scrollIntoView({behavior:"auto",block:"start"})):t=!1,t){if("focused"===this.renderStyle){const e=this.shadowRoot.querySelector("api-request");e&&e.afterNavigationFocusedMode();const t=this.shadowRoot.querySelector("api-response");t&&t.resetSelection()}"true"===this.updateRoute&&window.history.replaceState(null,null,`${this.routePrefix||"#"}${e}`);const t=this.shadowRoot.getElementById(`link-${e}`);if(t){r&&t.scrollIntoView({behavior:"auto",block:"center"}),await it(0);const e=this.shadowRoot.querySelector(".nav-bar-tag.active, .nav-bar-path.active, .nav-bar-info.active, .nav-bar-h1.active, .nav-bar-h2.active, .operations.active");e&&e.classList.remove("active"),t.classList.add("active")}}}}setHttpUserNameAndPassword(e,t,r){return eI.call(this,e,t,r)}setApiKey(e,t){return eI.call(this,e,"","",t)}removeAllSecurityKeys(){return tI.call(this)}setApiServer(e){return KI.call(this,e)}onAdvancedSearch(e,t){const r=e.target;clearTimeout(this.timeoutId),this.timeoutId=setTimeout((()=>{let e;e="text"===r.type?r:r.closest(".advanced-search-options").querySelector("input[type=text]");const t=[...r.closest(".advanced-search-options").querySelectorAll("input:checked")].map((e=>e.id));this.advancedSearchMatches=function(e,t,r=[]){if(!e.trim()||0===r.length)return;const n=[];return t.forEach((t=>{t.paths.forEach((t=>{let a="";var o;if(r.includes("search-api-path")&&(a=t.path),r.includes("search-api-descr")&&(a=`${a} ${t.summary||t.description||""}`),r.includes("search-api-params")&&(a=`${a} ${(null===(o=t.parameters)||void 0===o?void 0:o.map((e=>e.name)).join(" "))||""}`),r.includes("search-api-request-body")&&t.requestBody){let e=new Set;for(const r in null===(i=t.requestBody)||void 0===i?void 0:i.content){var i,s,l;null!==(s=t.requestBody.content[r].schema)&&void 0!==s&&s.properties&&(e=ct(null===(l=t.requestBody.content[r].schema)||void 0===l?void 0:l.properties)),a=`${a} ${[...e].join(" ")}`}}r.includes("search-api-resp-descr")&&(a=`${a} ${Object.values(t.responses).map((e=>e.description||"")).join(" ")}`),a.toLowerCase().includes(e.trim().toLowerCase())&&n.push({elementId:t.elementId,method:t.method,path:t.path,summary:t.summary||t.description||"",deprecated:t.deprecated})}))})),n}(e.value,this.resolvedSpec.tags,t)}),t)}}customElements.define("rapi-doc",xR);customElements.define("rapi-doc-mini",class extends ie{constructor(){super(),this.isMini=!0,this.updateRoute="false",this.renderStyle="view",this.showHeader="false",this.allowAdvancedSearch="false"}static get properties(){return{specUrl:{type:String,attribute:"spec-url"},sortEndpointsBy:{type:String,attribute:"sort-endpoints-by"},layout:{type:String},pathsExpanded:{type:String,attribute:"paths-expanded"},defaultSchemaTab:{type:String,attribute:"default-schema-tab"},responseAreaHeight:{type:String,attribute:"response-area-height"},showSummaryWhenCollapsed:{type:String,attribute:"show-summary-when-collapsed"},fillRequestFieldsWithExample:{type:String,attribute:"fill-request-fields-with-example"},persistAuth:{type:String,attribute:"persist-auth"},schemaStyle:{type:String,attribute:"schema-style"},schemaExpandLevel:{type:Number,attribute:"schema-expand-level"},schemaDescriptionExpanded:{type:String,attribute:"schema-description-expanded"},apiKeyName:{type:String,attribute:"api-key-name"},apiKeyLocation:{type:String,attribute:"api-key-location"},apiKeyValue:{type:String,attribute:"api-key-value"},defaultApiServerUrl:{type:String,attribute:"default-api-server"},serverUrl:{type:String,attribute:"server-url"},oauthReceiver:{type:String,attribute:"oauth-receiver"},allowTry:{type:String,attribute:"allow-try"},theme:{type:String},bgColor:{type:String,attribute:"bg-color"},textColor:{type:String,attribute:"text-color"},primaryColor:{type:String,attribute:"primary-color"},fontSize:{type:String,attribute:"font-size"},regularFont:{type:String,attribute:"regular-font"},monoFont:{type:String,attribute:"mono-font"},loadFonts:{type:String,attribute:"load-fonts"},fetchCredentials:{type:String,attribute:"fetch-credentials"},matchPaths:{type:String,attribute:"match-paths"},matchType:{type:String,attribute:"match-type"},loading:{type:Boolean}}}static get styles(){return[Ke,Je,Ye,Ze,Qe,Xe,et,tt,rt,c`
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
      }`]}connectedCallback(){if(super.connectedCallback(),"false"!==this.loadFonts){const e={family:"Open Sans",style:"normal",weight:"300",unicodeRange:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"},t=new FontFace("Open Sans","url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN_r8OUuhpKKSTjw.woff2) format('woff2')",e);e.weight="600";const r=new FontFace("Open Sans","url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UNirkOUuhpKKSTjw.woff2) format('woff2')",e);t.load().then((e=>{document.fonts.add(e)})),r.load().then((e=>{document.fonts.add(e)}))}this.showSummaryWhenCollapsed&&"true, false,".includes(`${this.showSummaryWhenCollapsed},`)||(this.showSummaryWhenCollapsed="true"),this.layout&&"row, column,".includes(`${this.layout},`)||(this.layout="row"),this.schemaStyle&&"tree, table,".includes(`${this.schemaStyle},`)||(this.schemaStyle="tree"),this.theme&&"light, dark,".includes(`${this.theme},`)||(this.theme=window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"),this.defaultSchemaTab&&"example, schema, model,".includes(`${this.defaultSchemaTab},`)?"model"===this.defaultSchemaTab&&(this.defaultSchemaTab="schema"):this.defaultSchemaTab="example",this.pathsExpanded="true"===this.pathsExpanded,(!this.schemaExpandLevel||this.schemaExpandLevel<1)&&(this.schemaExpandLevel=99999),this.schemaDescriptionExpanded&&"true, false,".includes(`${this.schemaDescriptionExpanded},`)||(this.schemaDescriptionExpanded="false"),this.fillRequestFieldsWithExample&&"true, false,".includes(`${this.fillRequestFieldsWithExample},`)||(this.fillRequestFieldsWithExample="true"),this.persistAuth&&"true, false,".includes(`${this.persistAuth},`)||(this.persistAuth="false"),this.responseAreaHeight||(this.responseAreaHeight="300px"),this.allowTry&&"true, false,".includes(`${this.allowTry},`)||(this.allowTry="true"),this.apiKeyValue||(this.apiKeyValue="-"),this.apiKeyLocation||(this.apiKeyLocation="header"),this.apiKeyName||(this.apiKeyName=""),this.oauthReceiver||(this.oauthReceiver="oauth-receiver.html"),this.sortTags&&"true, false,".includes(`${this.sortTags},`)||(this.sortTags="false"),this.sortEndpointsBy&&"method, path, summary,".includes(`${this.sortEndpointsBy},`)||(this.sortEndpointsBy="path"),this.fontSize&&"default, large, largest,".includes(`${this.fontSize},`)||(this.fontSize="default"),this.matchType&&"includes regex".includes(this.matchType)||(this.matchType="includes"),this.allowSchemaDescriptionExpandToggle&&"true, false,".includes(`${this.allowSchemaDescriptionExpandToggle},`)||(this.allowSchemaDescriptionExpandToggle="true"),this.fetchCredentials&&"omit, same-origin, include,".includes(`${this.fetchCredentials},`)||(this.fetchCredentials=""),We.setOptions({highlight:(e,t)=>Ge().languages[t]?Ge().highlight(e,Ge().languages[t],t):e})}render(){return bR.call(this,!0,!1,!1,this.pathsExpanded)}attributeChangedCallback(e,t,r){if("spec-url"===e&&t!==r&&window.setTimeout((async()=>{await this.loadSpec(r)}),0),"api-key-name"===e||"api-key-location"===e||"api-key-value"===e){let t=!1,n="",a="",o="";if("api-key-name"===e?this.getAttribute("api-key-location")&&this.getAttribute("api-key-value")&&(n=r,a=this.getAttribute("api-key-location"),o=this.getAttribute("api-key-value"),t=!0):"api-key-location"===e?this.getAttribute("api-key-name")&&this.getAttribute("api-key-value")&&(a=r,n=this.getAttribute("api-key-name"),o=this.getAttribute("api-key-value"),t=!0):"api-key-value"===e&&this.getAttribute("api-key-name")&&this.getAttribute("api-key-location")&&(o=r,a=this.getAttribute("api-key-location"),n=this.getAttribute("api-key-name"),t=!0),t&&this.resolvedSpec){const e=this.resolvedSpec.securitySchemes.find((e=>e.securitySchemeId===ot));e?(e.name=n,e.in=a,e.value=o,e.finalKeyValue=o):this.resolvedSpec.securitySchemes.push({apiKeyId:ot,description:"api-key provided in rapidoc element attributes",type:"apiKey",name:n,in:a,value:o,finalKeyValue:o}),this.requestUpdate()}}super.attributeChangedCallback(e,t,r)}onSepcUrlChange(){this.setAttribute("spec-url",this.shadowRoot.getElementById("spec-url").value)}async loadSpec(e){if(e)try{this.resolvedSpec={specLoadError:!1,isSpecLoading:!0,tags:[]},this.loading=!0,this.loadFailed=!1,this.requestUpdate();const t=await MP.call(this,e,"true"===this.generateMissingTags,"true"===this.sortTags,this.getAttribute("sort-endpoints-by"),this.getAttribute("api-key-name"),this.getAttribute("api-key-location"),this.getAttribute("api-key-value"),this.getAttribute("server-url"));this.loading=!1,this.afterSpecParsedAndValidated(t)}catch(e){this.loading=!1,this.loadFailed=!0,this.resolvedSpec=null,console.error(`RapiDoc: Unable to resolve the API spec..  ${e.message}`)}}setHttpUserNameAndPassword(e,t,r){return eI.call(this,e,t,r)}setApiKey(e,t){return eI.call(this,e,"","",t)}removeAllSecurityKeys(){return tI.call(this)}setApiServer(e){return KI.call(this,e)}async afterSpecParsedAndValidated(e){for(this.resolvedSpec=e,this.selectedServer=void 0,this.defaultApiServerUrl&&(this.defaultApiServerUrl===this.serverUrl?this.selectedServer={url:this.serverUrl,computedUrl:this.serverUrl}:this.resolvedSpec.servers&&(this.selectedServer=this.resolvedSpec.servers.find((e=>e.url===this.defaultApiServerUrl)))),this.selectedServer||this.resolvedSpec.servers&&(this.selectedServer=this.resolvedSpec.servers[0]),this.requestUpdate();!await this.updateComplete;);const t=new CustomEvent("spec-loaded",{detail:e});this.dispatchEvent(t)}handleHref(e){if("a"===e.target.tagName.toLowerCase()&&e.target.getAttribute("href").startsWith("#")){const t=this.shadowRoot.getElementById(e.target.getAttribute("href").replace("#",""));t&&t.scrollIntoView({behavior:"auto",block:"start"})}}});class wR extends HTMLElement{connectedCallback(){this.receiveAuthParms(),window.addEventListener("storage",(e=>this.receiveStorage(e)),!0)}receiveAuthParms(){let e={};if(document.location.search){const t=new URLSearchParams(document.location.search);e={code:t.get("code"),error:t.get("error"),state:t.get("state"),responseType:"code"}}else if(window.location.hash){e={token_type:this.parseQueryString(window.location.hash.substring(1),"token_type"),access_token:this.parseQueryString(window.location.hash.substring(1),"access_token"),responseType:"token"}}window.opener?window.opener.postMessage(e,this.target):sessionStorage.setItem("rapidoc-oauth-data",JSON.stringify(e))}relayAuthParams(e){if(window.parent&&"rapidoc-oauth-data"===e.key){const t=JSON.parse(e.newValue);window.parent.postMessage(t,this.target)}}parseQueryString(e,t){const r=e.split("&");for(let e=0;e<r.length;e++){const n=r[e].split("=");if(decodeURIComponent(n[0])===t)return decodeURIComponent(n[1])}}}function $R(){return z`
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
      ${this.resolvedSpec.schemaAndExamples.map((e=>z`
        <div class='nav-bar-path' data-content-id='${e.elementId}' id='link-${e.elementId}'
          @click = '${e=>{this.scrollToEventTarget(e,!1)}}'
        > 
          ${e.name}
        </div>`))}
    </nav>  
  </nav>
  `}function kR(){return z`
    ${"true"===this.showInfo?GI.call(this):""}
    <div style="font-size:var(--font-size-regular);">
    ${this.resolvedSpec.schemaAndExamples.map((e=>{var t;const r=DI(e.schema,"json",e.examples,e.example,!0,!1,"json",!0);return e.selectedExample=null===(t=r[0])||void 0===t?void 0:t.exampleId,z`
        <section id='${e.elementId}' class='json-schema-and-example regular-font' style="display:flex; flex-direction: column; border:1px solid var(--border-color); margin-bottom:32px; border-top: 5px solid var(--border-color)">
          <div style="padding:16px; border-bottom: 1px solid var(--border-color)">
            <div style="font-size:var(--font-size-small); font-weight:bold">${e.name}</div>
            <span class="json-schema-description m-markdown ">${QP(We(e.description||""))}</span>
          </div>  
          <div style="display:flex; flex-direction: row; gap:16px;">
            <div class="json-schema-def" style="flex:1; padding:16px 0 16px 16px; ">
              <schema-tree
                .data = "${LI(e.schema,{})}"
                schema-expand-level = "${this.schemaExpandLevel}"
                schema-description-expanded = "${this.schemaDescriptionExpanded}"
                allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
                schema-hide-read-only = "false"
                schema-hide-write-only = "false"
              > </schema-tree>
            </div>
            <div class="json-schema-example-panel" style="width:400px; background-color: var(--input-bg); padding:16px 0 16px 16px; border-left: 1px dashed var(--border-color);">
              ${r.length>1?z`<select style="min-width:100px; max-width:100%" @change='${t=>this.onSelectExample(t,e)}'>
                    ${r.map((t=>z`
                      <option value="${t.exampleId}" ?selected=${t.exampleId===e.selectedExample}> 
                        ${t.exampleSummary.length>80?t.exampleId:t.exampleSummary}
                      </option>`))}
                  </select>`:z`<div style="font-size: var(--font-size-small);font-weight:700; margin:5px 0"> ${r[0].exampleSummary}</div>`}
              ${r.map((t=>z`
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
  `}function SR(e=!1){if(!this.resolvedSpec)return"";const t={bg1:gR(this.bgColor)?this.bgColor:"",fg1:gR(this.textColor)?this.textColor:"",headerColor:gR(this.headerColor)?this.headerColor:"",primaryColor:gR(this.primaryColor)?this.primaryColor:"",navBgColor:gR(this.navBgColor)?this.navBgColor:"",navTextColor:gR(this.navTextColor)?this.navTextColor:"",navHoverBgColor:gR(this.navHoverBgColor)?this.navHoverBgColor:"",navHoverTextColor:gR(this.navHoverTextColor)?this.navHoverTextColor:"",navAccentColor:gR(this.navAccentColor)?this.navAccentColor:""};return this.resolvedSpec.specLoadError?e?z`
        ${"dark"===this.theme?vR.call(this,"dark",t):vR.call(this,"light",t)}
        <div style="display:flex; align-items:center; border:1px dashed var(--border-color); height:42px; padding:5px; font-size:var(--font-size-small); color:var(--red); font-family:var(--font-mono)"> ${this.resolvedSpec.info.description} </div>
      `:z`
      ${"dark"===this.theme?vR.call(this,"dark",t):vR.call(this,"light",t)}
      <!-- Header -->
      ${hR.call(this)}
      <h1> Header </h1>
      <main class="main-content regular-font" part="section-main-content">
        <slot></slot>
        <div style="margin:24px; text-align: center;">
          <h1 style="color: var(--red)"> ${this.resolvedSpec.info.title} </h1>
          <div style="font-family:var(--font-mono)"> ${this.resolvedSpec.info.description} </div>
        </div>
      </main>  
    `:this.resolvedSpec.isSpecLoading?z`
      ${"dark"===this.theme?vR.call(this,"dark",t):vR.call(this,"light",t)}
      <main class="main-content regular-font" part="section-main-content">
        <slot></slot>
        <div class="main-content-inner--${this.renderStyle}-mode">
          <div class="loader"></div>
        </div>
      </main>  
    `:z`
    ${"dark"===this.theme?vR.call(this,"dark",t):vR.call(this,"light",t)}

    <!-- Header -->
    ${"false"===this.showHeader?"":hR.call(this)}
    
    <div id='the-main-body' class="body ${this.cssClasses}" dir= ${this.pageDirection}>

      <!-- Side Nav -->
      ${$R.call(this)}

      <!-- Main Content -->
      <main class="main-content regular-font" part="section-main-content">
        <slot></slot>
        <div class="main-content-inner--${this.renderStyle}-mode">
          ${!0===this.loading?z`<div class="loader"></div>`:z`
              ${!0===this.loadFailed?z`<div style="text-align: center;margin: 16px;"> Unable to load the Spec</div>`:z`
                  <div class="operations-root" @click="${e=>{this.handleHref(e)}}">
                    ${kR.call(this)}
                  </div>
                `}`}
        </div>
        <slot name="footer"></slot>
      </main>
    </div>  
  `}customElements.define("oauth-receiver",wR);customElements.define("json-schema-viewer",class extends ie{constructor(){super(),this.isMini=!1,this.updateRoute="false",this.renderStyle="focused",this.showHeader="true",this.allowAdvancedSearch="false",this.selectedExampleForEachSchema={}}static get properties(){return{specUrl:{type:String,attribute:"spec-url"},schemaStyle:{type:String,attribute:"schema-style"},schemaExpandLevel:{type:Number,attribute:"schema-expand-level"},schemaDescriptionExpanded:{type:String,attribute:"schema-description-expanded"},allowSchemaDescriptionExpandToggle:{type:String,attribute:"allow-schema-description-expand-toggle"},showHeader:{type:String,attribute:"show-header"},showSideNav:{type:String,attribute:"show-side-nav"},showInfo:{type:String,attribute:"show-info"},allowSpecUrlLoad:{type:String,attribute:"allow-spec-url-load"},allowSpecFileLoad:{type:String,attribute:"allow-spec-file-load"},allowSpecFileDownload:{type:String,attribute:"allow-spec-file-download"},allowSearch:{type:String,attribute:"allow-search"},theme:{type:String},bgColor:{type:String,attribute:"bg-color"},textColor:{type:String,attribute:"text-color"},primaryColor:{type:String,attribute:"primary-color"},fontSize:{type:String,attribute:"font-size"},regularFont:{type:String,attribute:"regular-font"},monoFont:{type:String,attribute:"mono-font"},loadFonts:{type:String,attribute:"load-fonts"},loading:{type:Boolean}}}static get styles(){return[Ke,Je,Ye,Ze,Qe,Xe,et,tt,rt,c`
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
      }`]}connectedCallback(){super.connectedCallback();const e=this.parentElement;if(e&&(0===e.offsetWidth&&""===e.style.width&&(e.style.width="100vw"),0===e.offsetHeight&&""===e.style.height&&(e.style.height="100vh"),"BODY"===e.tagName&&(e.style.marginTop||(e.style.marginTop="0"),e.style.marginRight||(e.style.marginRight="0"),e.style.marginBottom||(e.style.marginBottom="0"),e.style.marginLeft||(e.style.marginLeft="0"))),"false"!==this.loadFonts){const e={family:"Open Sans",style:"normal",weight:"300",unicodeRange:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"},t=new FontFace("Open Sans","url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN_r8OUuhpKKSTjw.woff2) format('woff2')",e);e.weight="600";const r=new FontFace("Open Sans","url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UNirkOUuhpKKSTjw.woff2) format('woff2')",e);t.load().then((e=>{document.fonts.add(e)})),r.load().then((e=>{document.fonts.add(e)}))}this.renderStyle="focused",this.pathsExpanded="true"===this.pathsExpanded,this.showInfo&&"true, false,".includes(`${this.showInfo},`)||(this.showInfo="true"),this.showSideNav&&"true false".includes(this.showSideNav)||(this.showSideNav="true"),this.showHeader&&"true, false,".includes(`${this.showHeader},`)||(this.showHeader="true"),this.schemaStyle&&"tree, table,".includes(`${this.schemaStyle},`)||(this.schemaStyle="tree"),this.theme&&"light, dark,".includes(`${this.theme},`)||(this.theme=window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"),this.allowSearch&&"true, false,".includes(`${this.allowSearch},`)||(this.allowSearch="true"),(!this.schemaExpandLevel||this.schemaExpandLevel<1)&&(this.schemaExpandLevel=99999),this.schemaDescriptionExpanded&&"true, false,".includes(`${this.schemaDescriptionExpanded},`)||(this.schemaDescriptionExpanded="false"),this.fontSize&&"default, large, largest,".includes(`${this.fontSize},`)||(this.fontSize="default"),this.matchType&&"includes regex".includes(this.matchType)||(this.matchType="includes"),this.allowSchemaDescriptionExpandToggle&&"true, false,".includes(`${this.allowSchemaDescriptionExpandToggle},`)||(this.allowSchemaDescriptionExpandToggle="true"),We.setOptions({highlight:(e,t)=>Ge().languages[t]?Ge().highlight(e,Ge().languages[t],t):e})}render(){return SR.call(this,!0,!1,!1,this.pathsExpanded)}attributeChangedCallback(e,t,r){"spec-url"===e&&t!==r&&window.setTimeout((async()=>{await this.loadSpec(r)}),0),super.attributeChangedCallback(e,t,r)}onSepcUrlChange(){this.setAttribute("spec-url",this.shadowRoot.getElementById("spec-url").value)}onSearchChange(e){this.matchPaths=e.target.value}async loadSpec(e){if(e)try{this.resolvedSpec={specLoadError:!1,isSpecLoading:!0,tags:[]},this.loading=!0,this.loadFailed=!1,this.requestUpdate();const t=await MP.call(this,e,"true"===this.generateMissingTags,"true"===this.sortTags,this.getAttribute("sort-endpoints-by"));this.loading=!1,this.afterSpecParsedAndValidated(t)}catch(e){this.loading=!1,this.loadFailed=!0,this.resolvedSpec=null,console.error(`RapiDoc: Unable to resolve the API spec..  ${e.message}`)}}async afterSpecParsedAndValidated(e){this.resolvedSpec=e;const t=new CustomEvent("spec-loaded",{detail:e});this.dispatchEvent(t)}handleHref(e){if("a"===e.target.tagName.toLowerCase()&&e.target.getAttribute("href").startsWith("#")){const t=this.shadowRoot.getElementById(e.target.getAttribute("href").replace("#",""));t&&t.scrollIntoView({behavior:"auto",block:"start"})}}onSelectExample(e){[...e.target.closest(".json-schema-example-panel").querySelectorAll(".example")].forEach((t=>{t.style.display=t.dataset.example===e.target.value?"flex":"none"}))}async scrollToEventTarget(e){const t=e.currentTarget;if(!t.dataset.contentId)return;const r=this.shadowRoot.getElementById(t.dataset.contentId);r&&r.scrollIntoView({behavior:"auto",block:"start"})}})},874:()=>{!function(e){var t="\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b",r={pattern:/(^(["']?)\w+\2)[ \t]+\S.*/,lookbehind:!0,alias:"punctuation",inside:null},n={bash:r,environment:{pattern:RegExp("\\$"+t),alias:"constant"},variable:[{pattern:/\$?\(\([\s\S]+?\)\)/,greedy:!0,inside:{variable:[{pattern:/(^\$\(\([\s\S]+)\)\)/,lookbehind:!0},/^\$\(\(/],number:/\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,operator:/--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,punctuation:/\(\(?|\)\)?|,|;/}},{pattern:/\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,greedy:!0,inside:{variable:/^\$\(|^`|\)$|`$/}},{pattern:/\$\{[^}]+\}/,greedy:!0,inside:{operator:/:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,punctuation:/[\[\]]/,environment:{pattern:RegExp("(\\{)"+t),lookbehind:!0,alias:"constant"}}},/\$(?:\w+|[#?*!@$])/],entity:/\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/};e.languages.bash={shebang:{pattern:/^#!\s*\/.*/,alias:"important"},comment:{pattern:/(^|[^"{\\$])#.*/,lookbehind:!0},"function-name":[{pattern:/(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,lookbehind:!0,alias:"function"},{pattern:/\b[\w-]+(?=\s*\(\s*\)\s*\{)/,alias:"function"}],"for-or-select":{pattern:/(\b(?:for|select)\s+)\w+(?=\s+in\s)/,alias:"variable",lookbehind:!0},"assign-left":{pattern:/(^|[\s;|&]|[<>]\()\w+(?:\.\w+)*(?=\+?=)/,inside:{environment:{pattern:RegExp("(^|[\\s;|&]|[<>]\\()"+t),lookbehind:!0,alias:"constant"}},alias:"variable",lookbehind:!0},parameter:{pattern:/(^|\s)-{1,2}(?:\w+:[+-]?)?\w+(?:\.\w+)*(?=[=\s]|$)/,alias:"variable",lookbehind:!0},string:[{pattern:/((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,lookbehind:!0,greedy:!0,inside:n},{pattern:/((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,lookbehind:!0,greedy:!0,inside:{bash:r}},{pattern:/(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,lookbehind:!0,greedy:!0,inside:n},{pattern:/(^|[^$\\])'[^']*'/,lookbehind:!0,greedy:!0},{pattern:/\$'(?:[^'\\]|\\[\s\S])*'/,greedy:!0,inside:{entity:n.entity}}],environment:{pattern:RegExp("\\$?"+t),alias:"constant"},variable:n.variable,function:{pattern:/(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cargo|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|java|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|sysctl|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,lookbehind:!0},keyword:{pattern:/(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,lookbehind:!0},builtin:{pattern:/(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,lookbehind:!0,alias:"class-name"},boolean:{pattern:/(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,lookbehind:!0},"file-descriptor":{pattern:/\B&\d\b/,alias:"important"},operator:{pattern:/\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,inside:{"file-descriptor":{pattern:/^\d/,alias:"important"}}},punctuation:/\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,number:{pattern:/(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,lookbehind:!0}},r.inside=e.languages.bash;for(var a=["comment","function-name","for-or-select","assign-left","parameter","string","environment","function","keyword","builtin","boolean","file-descriptor","operator","punctuation","number"],o=n.variable[1].inside,i=0;i<a.length;i++)o[a[i]]=e.languages.bash[a[i]];e.languages.sh=e.languages.bash,e.languages.shell=e.languages.bash}(Prism)},16:()=>{!function(e){function t(e,t){return e.replace(/<<(\d+)>>/g,(function(e,r){return"(?:"+t[+r]+")"}))}function r(e,r,n){return RegExp(t(e,r),n||"")}function n(e,t){for(var r=0;r<t;r++)e=e.replace(/<<self>>/g,(function(){return"(?:"+e+")"}));return e.replace(/<<self>>/g,"[^\\s\\S]")}var a="bool byte char decimal double dynamic float int long object sbyte short string uint ulong ushort var void",o="class enum interface record struct",i="add alias and ascending async await by descending from(?=\\s*(?:\\w|$)) get global group into init(?=\\s*;) join let nameof not notnull on or orderby partial remove select set unmanaged value when where with(?=\\s*{)",s="abstract as base break case catch checked const continue default delegate do else event explicit extern finally fixed for foreach goto if implicit in internal is lock namespace new null operator out override params private protected public readonly ref return sealed sizeof stackalloc static switch this throw try typeof unchecked unsafe using virtual volatile while yield";function l(e){return"\\b(?:"+e.trim().replace(/ /g,"|")+")\\b"}var c=l(o),p=RegExp(l(a+" "+o+" "+i+" "+s)),d=l(o+" "+i+" "+s),u=l(a+" "+o+" "+s),h=n(/<(?:[^<>;=+\-*/%&|^]|<<self>>)*>/.source,2),f=n(/\((?:[^()]|<<self>>)*\)/.source,2),m=/@?\b[A-Za-z_]\w*\b/.source,y=t(/<<0>>(?:\s*<<1>>)?/.source,[m,h]),g=t(/(?!<<0>>)<<1>>(?:\s*\.\s*<<1>>)*/.source,[d,y]),v=/\[\s*(?:,\s*)*\]/.source,b=t(/<<0>>(?:\s*(?:\?\s*)?<<1>>)*(?:\s*\?)?/.source,[g,v]),x=t(/[^,()<>[\];=+\-*/%&|^]|<<0>>|<<1>>|<<2>>/.source,[h,f,v]),w=t(/\(<<0>>+(?:,<<0>>+)+\)/.source,[x]),$=t(/(?:<<0>>|<<1>>)(?:\s*(?:\?\s*)?<<2>>)*(?:\s*\?)?/.source,[w,g,v]),k={keyword:p,punctuation:/[<>()?,.:[\]]/},S=/'(?:[^\r\n'\\]|\\.|\\[Uux][\da-fA-F]{1,8})'/.source,A=/"(?:\\.|[^\\"\r\n])*"/.source,O=/@"(?:""|\\[\s\S]|[^\\"])*"(?!")/.source;e.languages.csharp=e.languages.extend("clike",{string:[{pattern:r(/(^|[^$\\])<<0>>/.source,[O]),lookbehind:!0,greedy:!0},{pattern:r(/(^|[^@$\\])<<0>>/.source,[A]),lookbehind:!0,greedy:!0}],"class-name":[{pattern:r(/(\busing\s+static\s+)<<0>>(?=\s*;)/.source,[g]),lookbehind:!0,inside:k},{pattern:r(/(\busing\s+<<0>>\s*=\s*)<<1>>(?=\s*;)/.source,[m,$]),lookbehind:!0,inside:k},{pattern:r(/(\busing\s+)<<0>>(?=\s*=)/.source,[m]),lookbehind:!0},{pattern:r(/(\b<<0>>\s+)<<1>>/.source,[c,y]),lookbehind:!0,inside:k},{pattern:r(/(\bcatch\s*\(\s*)<<0>>/.source,[g]),lookbehind:!0,inside:k},{pattern:r(/(\bwhere\s+)<<0>>/.source,[m]),lookbehind:!0},{pattern:r(/(\b(?:is(?:\s+not)?|as)\s+)<<0>>/.source,[b]),lookbehind:!0,inside:k},{pattern:r(/\b<<0>>(?=\s+(?!<<1>>|with\s*\{)<<2>>(?:\s*[=,;:{)\]]|\s+(?:in|when)\b))/.source,[$,u,m]),inside:k}],keyword:p,number:/(?:\b0(?:x[\da-f_]*[\da-f]|b[01_]*[01])|(?:\B\.\d+(?:_+\d+)*|\b\d+(?:_+\d+)*(?:\.\d+(?:_+\d+)*)?)(?:e[-+]?\d+(?:_+\d+)*)?)(?:[dflmu]|lu|ul)?\b/i,operator:/>>=?|<<=?|[-=]>|([-+&|])\1|~|\?\?=?|[-+*/%&|^!=<>]=?/,punctuation:/\?\.?|::|[{}[\];(),.:]/}),e.languages.insertBefore("csharp","number",{range:{pattern:/\.\./,alias:"operator"}}),e.languages.insertBefore("csharp","punctuation",{"named-parameter":{pattern:r(/([(,]\s*)<<0>>(?=\s*:)/.source,[m]),lookbehind:!0,alias:"punctuation"}}),e.languages.insertBefore("csharp","class-name",{namespace:{pattern:r(/(\b(?:namespace|using)\s+)<<0>>(?:\s*\.\s*<<0>>)*(?=\s*[;{])/.source,[m]),lookbehind:!0,inside:{punctuation:/\./}},"type-expression":{pattern:r(/(\b(?:default|sizeof|typeof)\s*\(\s*(?!\s))(?:[^()\s]|\s(?!\s)|<<0>>)*(?=\s*\))/.source,[f]),lookbehind:!0,alias:"class-name",inside:k},"return-type":{pattern:r(/<<0>>(?=\s+(?:<<1>>\s*(?:=>|[({]|\.\s*this\s*\[)|this\s*\[))/.source,[$,g]),inside:k,alias:"class-name"},"constructor-invocation":{pattern:r(/(\bnew\s+)<<0>>(?=\s*[[({])/.source,[$]),lookbehind:!0,inside:k,alias:"class-name"},"generic-method":{pattern:r(/<<0>>\s*<<1>>(?=\s*\()/.source,[m,h]),inside:{function:r(/^<<0>>/.source,[m]),generic:{pattern:RegExp(h),alias:"class-name",inside:k}}},"type-list":{pattern:r(/\b((?:<<0>>\s+<<1>>|record\s+<<1>>\s*<<5>>|where\s+<<2>>)\s*:\s*)(?:<<3>>|<<4>>|<<1>>\s*<<5>>|<<6>>)(?:\s*,\s*(?:<<3>>|<<4>>|<<6>>))*(?=\s*(?:where|[{;]|=>|$))/.source,[c,y,m,$,p.source,f,/\bnew\s*\(\s*\)/.source]),lookbehind:!0,inside:{"record-arguments":{pattern:r(/(^(?!new\s*\()<<0>>\s*)<<1>>/.source,[y,f]),lookbehind:!0,greedy:!0,inside:e.languages.csharp},keyword:p,"class-name":{pattern:RegExp($),greedy:!0,inside:k},punctuation:/[,()]/}},preprocessor:{pattern:/(^[\t ]*)#.*/m,lookbehind:!0,alias:"property",inside:{directive:{pattern:/(#)\b(?:define|elif|else|endif|endregion|error|if|line|nullable|pragma|region|undef|warning)\b/,lookbehind:!0,alias:"keyword"}}}});var E=A+"|"+S,T=t(/\/(?![*/])|\/\/[^\r\n]*[\r\n]|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>/.source,[E]),C=n(t(/[^"'/()]|<<0>>|\(<<self>>*\)/.source,[T]),2),j=/\b(?:assembly|event|field|method|module|param|property|return|type)\b/.source,_=t(/<<0>>(?:\s*\(<<1>>*\))?/.source,[g,C]);e.languages.insertBefore("csharp","class-name",{attribute:{pattern:r(/((?:^|[^\s\w>)?])\s*\[\s*)(?:<<0>>\s*:\s*)?<<1>>(?:\s*,\s*<<1>>)*(?=\s*\])/.source,[j,_]),lookbehind:!0,greedy:!0,inside:{target:{pattern:r(/^<<0>>(?=\s*:)/.source,[j]),alias:"keyword"},"attribute-arguments":{pattern:r(/\(<<0>>*\)/.source,[C]),inside:e.languages.csharp},"class-name":{pattern:RegExp(g),inside:{punctuation:/\./}},punctuation:/[:,]/}}});var P=/:[^}\r\n]+/.source,I=n(t(/[^"'/()]|<<0>>|\(<<self>>*\)/.source,[T]),2),R=t(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source,[I,P]),L=n(t(/[^"'/()]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>|\(<<self>>*\)/.source,[E]),2),D=t(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source,[L,P]);function F(t,n){return{interpolation:{pattern:r(/((?:^|[^{])(?:\{\{)*)<<0>>/.source,[t]),lookbehind:!0,inside:{"format-string":{pattern:r(/(^\{(?:(?![}:])<<0>>)*)<<1>>(?=\}$)/.source,[n,P]),lookbehind:!0,inside:{punctuation:/^:/}},punctuation:/^\{|\}$/,expression:{pattern:/[\s\S]+/,alias:"language-csharp",inside:e.languages.csharp}}},string:/[\s\S]+/}}e.languages.insertBefore("csharp","string",{"interpolation-string":[{pattern:r(/(^|[^\\])(?:\$@|@\$)"(?:""|\\[\s\S]|\{\{|<<0>>|[^\\{"])*"/.source,[R]),lookbehind:!0,greedy:!0,inside:F(R,I)},{pattern:r(/(^|[^@\\])\$"(?:\\.|\{\{|<<0>>|[^\\"{])*"/.source,[D]),lookbehind:!0,greedy:!0,inside:F(D,L)}],char:{pattern:RegExp(S),greedy:!0}}),e.languages.dotnet=e.languages.cs=e.languages.csharp}(Prism)},251:()=>{!function(e){var t=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;e.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:"+/[^;{\s"']|\s+(?!\s)/.source+"|"+t.source+")*?"+/(?:;|(?=\s*\{))/.source),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+t.source+"|"+/(?:[^\\\r\n()"']|\\[\s\S])*/.source+")\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+t.source+"$"),alias:"url"}}},selector:{pattern:RegExp("(^|[{}\\s])[^{}\\s](?:[^{};\"'\\s]|\\s+(?![\\s{])|"+t.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:t,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},e.languages.css.atrule.inside.rest=e.languages.css;var r=e.languages.markup;r&&(r.tag.addInlined("style","css"),r.tag.addAttribute("style","css"))}(Prism)},46:()=>{Prism.languages.go=Prism.languages.extend("clike",{string:{pattern:/(^|[^\\])"(?:\\.|[^"\\\r\n])*"|`[^`]*`/,lookbehind:!0,greedy:!0},keyword:/\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go(?:to)?|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/,boolean:/\b(?:_|false|iota|nil|true)\b/,number:[/\b0(?:b[01_]+|o[0-7_]+)i?\b/i,/\b0x(?:[a-f\d_]+(?:\.[a-f\d_]*)?|\.[a-f\d_]+)(?:p[+-]?\d+(?:_\d+)*)?i?(?!\w)/i,/(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?[\d_]+)?i?(?!\w)/i],operator:/[*\/%^!=]=?|\+[=+]?|-[=-]?|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\./,builtin:/\b(?:append|bool|byte|cap|close|complex|complex(?:64|128)|copy|delete|error|float(?:32|64)|u?int(?:8|16|32|64)?|imag|len|make|new|panic|print(?:ln)?|real|recover|rune|string|uintptr)\b/}),Prism.languages.insertBefore("go","string",{char:{pattern:/'(?:\\.|[^'\\\r\n]){0,10}'/,greedy:!0}}),delete Prism.languages.go["class-name"]},57:()=>{!function(e){function t(e){return RegExp("(^(?:"+e+"):[ \t]*(?![ \t]))[^]+","i")}e.languages.http={"request-line":{pattern:/^(?:CONNECT|DELETE|GET|HEAD|OPTIONS|PATCH|POST|PRI|PUT|SEARCH|TRACE)\s(?:https?:\/\/|\/)\S*\sHTTP\/[\d.]+/m,inside:{method:{pattern:/^[A-Z]+\b/,alias:"property"},"request-target":{pattern:/^(\s)(?:https?:\/\/|\/)\S*(?=\s)/,lookbehind:!0,alias:"url",inside:e.languages.uri},"http-version":{pattern:/^(\s)HTTP\/[\d.]+/,lookbehind:!0,alias:"property"}}},"response-status":{pattern:/^HTTP\/[\d.]+ \d+ .+/m,inside:{"http-version":{pattern:/^HTTP\/[\d.]+/,alias:"property"},"status-code":{pattern:/^(\s)\d+(?=\s)/,lookbehind:!0,alias:"number"},"reason-phrase":{pattern:/^(\s).+/,lookbehind:!0,alias:"string"}}},header:{pattern:/^[\w-]+:.+(?:(?:\r\n?|\n)[ \t].+)*/m,inside:{"header-value":[{pattern:t(/Content-Security-Policy/.source),lookbehind:!0,alias:["csp","languages-csp"],inside:e.languages.csp},{pattern:t(/Public-Key-Pins(?:-Report-Only)?/.source),lookbehind:!0,alias:["hpkp","languages-hpkp"],inside:e.languages.hpkp},{pattern:t(/Strict-Transport-Security/.source),lookbehind:!0,alias:["hsts","languages-hsts"],inside:e.languages.hsts},{pattern:t(/[^:]+/.source),lookbehind:!0}],"header-name":{pattern:/^[^:]+/,alias:"keyword"},punctuation:/^:/}}};var r,n=e.languages,a={"application/javascript":n.javascript,"application/json":n.json||n.javascript,"application/xml":n.xml,"text/xml":n.xml,"text/html":n.html,"text/css":n.css,"text/plain":n.plain},o={"application/json":!0,"application/xml":!0};function i(e){var t=e.replace(/^[a-z]+\//,"");return"(?:"+e+"|"+("\\w+/(?:[\\w.-]+\\+)+"+t+"(?![+\\w.-])")+")"}for(var s in a)if(a[s]){r=r||{};var l=o[s]?i(s):s;r[s.replace(/\//g,"-")]={pattern:RegExp("("+/content-type:\s*/.source+l+/(?:(?:\r\n?|\n)[\w-].*)*(?:\r(?:\n|(?!\n))|\n)/.source+")"+/[^ \t\w-][\s\S]*/.source,"i"),lookbehind:!0,inside:a[s]}}r&&e.languages.insertBefore("http","header",r)}(Prism)},503:()=>{!function(e){var t=/\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|non-sealed|null|open|opens|package|permits|private|protected|provides|public|record(?!\s*[(){}[\]<>=%~.:,;?+\-*/&|^])|requires|return|sealed|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/,r=/(?:[a-z]\w*\s*\.\s*)*(?:[A-Z]\w*\s*\.\s*)*/.source,n={pattern:RegExp(/(^|[^\w.])/.source+r+/[A-Z](?:[\d_A-Z]*[a-z]\w*)?\b/.source),lookbehind:!0,inside:{namespace:{pattern:/^[a-z]\w*(?:\s*\.\s*[a-z]\w*)*(?:\s*\.)?/,inside:{punctuation:/\./}},punctuation:/\./}};e.languages.java=e.languages.extend("clike",{string:{pattern:/(^|[^\\])"(?:\\.|[^"\\\r\n])*"/,lookbehind:!0,greedy:!0},"class-name":[n,{pattern:RegExp(/(^|[^\w.])/.source+r+/[A-Z]\w*(?=\s+\w+\s*[;,=()]|\s*(?:\[[\s,]*\]\s*)?::\s*new\b)/.source),lookbehind:!0,inside:n.inside},{pattern:RegExp(/(\b(?:class|enum|extends|implements|instanceof|interface|new|record|throws)\s+)/.source+r+/[A-Z]\w*\b/.source),lookbehind:!0,inside:n.inside}],keyword:t,function:[e.languages.clike.function,{pattern:/(::\s*)[a-z_]\w*/,lookbehind:!0}],number:/\b0b[01][01_]*L?\b|\b0x(?:\.[\da-f_p+-]+|[\da-f_]+(?:\.[\da-f_p+-]+)?)\b|(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,operator:{pattern:/(^|[^.])(?:<<=?|>>>?=?|->|--|\+\+|&&|\|\||::|[?:~]|[-+*/%&|^!=<>]=?)/m,lookbehind:!0},constant:/\b[A-Z][A-Z_\d]+\b/}),e.languages.insertBefore("java","string",{"triple-quoted-string":{pattern:/"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*"""/,greedy:!0,alias:"string"},char:{pattern:/'(?:\\.|[^'\\\r\n]){1,6}'/,greedy:!0}}),e.languages.insertBefore("java","class-name",{annotation:{pattern:/(^|[^.])@\w+(?:\s*\.\s*\w+)*/,lookbehind:!0,alias:"punctuation"},generics:{pattern:/<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&))*>)*>)*>)*>/,inside:{"class-name":n,keyword:t,punctuation:/[<>(),.:]/,operator:/[?&|]/}},import:[{pattern:RegExp(/(\bimport\s+)/.source+r+/(?:[A-Z]\w*|\*)(?=\s*;)/.source),lookbehind:!0,inside:{namespace:n.inside.namespace,punctuation:/\./,operator:/\*/,"class-name":/\w+/}},{pattern:RegExp(/(\bimport\s+static\s+)/.source+r+/(?:\w+|\*)(?=\s*;)/.source),lookbehind:!0,alias:"static",inside:{namespace:n.inside.namespace,static:/\b\w+$/,punctuation:/\./,operator:/\*/,"class-name":/\w+/}}],namespace:{pattern:RegExp(/(\b(?:exports|import(?:\s+static)?|module|open|opens|package|provides|requires|to|transitive|uses|with)\s+)(?!<keyword>)[a-z]\w*(?:\.[a-z]\w*)*\.?/.source.replace(/<keyword>/g,(function(){return t.source}))),lookbehind:!0,inside:{punctuation:/\./}}})}(Prism)},277:()=>{Prism.languages.json={property:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,lookbehind:!0,greedy:!0},string:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,lookbehind:!0,greedy:!0},comment:{pattern:/\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,greedy:!0},number:/-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,punctuation:/[{}[\],]/,operator:/:/,boolean:/\b(?:false|true)\b/,null:{pattern:/\bnull\b/,alias:"keyword"}},Prism.languages.webmanifest=Prism.languages.json},366:()=>{Prism.languages.python={comment:{pattern:/(^|[^\\])#.*/,lookbehind:!0,greedy:!0},"string-interpolation":{pattern:/(?:f|fr|rf)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,greedy:!0,inside:{interpolation:{pattern:/((?:^|[^{])(?:\{\{)*)\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}])+\})+\})+\}/,lookbehind:!0,inside:{"format-spec":{pattern:/(:)[^:(){}]+(?=\}$)/,lookbehind:!0},"conversion-option":{pattern:/![sra](?=[:}]$)/,alias:"punctuation"},rest:null}},string:/[\s\S]+/}},"triple-quoted-string":{pattern:/(?:[rub]|br|rb)?("""|''')[\s\S]*?\1/i,greedy:!0,alias:"string"},string:{pattern:/(?:[rub]|br|rb)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,greedy:!0},function:{pattern:/((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,lookbehind:!0},"class-name":{pattern:/(\bclass\s+)\w+/i,lookbehind:!0},decorator:{pattern:/(^[\t ]*)@\w+(?:\.\w+)*/m,lookbehind:!0,alias:["annotation","punctuation"],inside:{punctuation:/\./}},keyword:/\b(?:_(?=\s*:)|and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,builtin:/\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,boolean:/\b(?:False|None|True)\b/,number:/\b0(?:b(?:_?[01])+|o(?:_?[0-7])+|x(?:_?[a-f0-9])+)\b|(?:\b\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\B\.\d+(?:_\d+)*)(?:e[+-]?\d+(?:_\d+)*)?j?(?!\w)/i,operator:/[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,punctuation:/[{}[\];(),.:]/},Prism.languages.python["string-interpolation"].inside.interpolation.inside.rest=Prism.languages.python,Prism.languages.py=Prism.languages.python},358:()=>{!function(e){var t=/[*&][^\s[\]{},]+/,r=/!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/,n="(?:"+r.source+"(?:[ \t]+"+t.source+")?|"+t.source+"(?:[ \t]+"+r.source+")?)",a=/(?:[^\s\x00-\x08\x0e-\x1f!"#%&'*,\-:>?@[\]`{|}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]|[?:-]<PLAIN>)(?:[ \t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*/.source.replace(/<PLAIN>/g,(function(){return/[^\s\x00-\x08\x0e-\x1f,[\]{}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]/.source})),o=/"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\\\r\n]|\\.)*'/.source;function i(e,t){t=(t||"").replace(/m/g,"")+"m";var r=/([:\-,[{]\s*(?:\s<<prop>>[ \t]+)?)(?:<<value>>)(?=[ \t]*(?:$|,|\]|\}|(?:[\r\n]\s*)?#))/.source.replace(/<<prop>>/g,(function(){return n})).replace(/<<value>>/g,(function(){return e}));return RegExp(r,t)}e.languages.yaml={scalar:{pattern:RegExp(/([\-:]\s*(?:\s<<prop>>[ \t]+)?[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)\S[^\r\n]*(?:\2[^\r\n]+)*)/.source.replace(/<<prop>>/g,(function(){return n}))),lookbehind:!0,alias:"string"},comment:/#.*/,key:{pattern:RegExp(/((?:^|[:\-,[{\r\n?])[ \t]*(?:<<prop>>[ \t]+)?)<<key>>(?=\s*:\s)/.source.replace(/<<prop>>/g,(function(){return n})).replace(/<<key>>/g,(function(){return"(?:"+a+"|"+o+")"}))),lookbehind:!0,greedy:!0,alias:"atrule"},directive:{pattern:/(^[ \t]*)%.+/m,lookbehind:!0,alias:"important"},datetime:{pattern:i(/\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?(?:[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?))?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?/.source),lookbehind:!0,alias:"number"},boolean:{pattern:i(/false|true/.source,"i"),lookbehind:!0,alias:"important"},null:{pattern:i(/null|~/.source,"i"),lookbehind:!0,alias:"important"},string:{pattern:i(o),lookbehind:!0,greedy:!0},number:{pattern:i(/[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|\.inf|\.nan)/.source,"i"),lookbehind:!0},tag:r,important:t,punctuation:/---|[:[\]{}\-,|>?]|\.\.\./},e.languages.yml=e.languages.yaml}(Prism)},660:(e,t,r)=>{var n=function(e){var t=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,r=0,n={},a={manual:e.Prism&&e.Prism.manual,disableWorkerMessageHandler:e.Prism&&e.Prism.disableWorkerMessageHandler,util:{encode:function e(t){return t instanceof o?new o(t.type,e(t.content),t.alias):Array.isArray(t)?t.map(e):t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(e){return Object.prototype.toString.call(e).slice(8,-1)},objId:function(e){return e.__id||Object.defineProperty(e,"__id",{value:++r}),e.__id},clone:function e(t,r){var n,o;switch(r=r||{},a.util.type(t)){case"Object":if(o=a.util.objId(t),r[o])return r[o];for(var i in n={},r[o]=n,t)t.hasOwnProperty(i)&&(n[i]=e(t[i],r));return n;case"Array":return o=a.util.objId(t),r[o]?r[o]:(n=[],r[o]=n,t.forEach((function(t,a){n[a]=e(t,r)})),n);default:return t}},getLanguage:function(e){for(;e;){var r=t.exec(e.className);if(r)return r[1].toLowerCase();e=e.parentElement}return"none"},setLanguage:function(e,r){e.className=e.className.replace(RegExp(t,"gi"),""),e.classList.add("language-"+r)},currentScript:function(){if("undefined"==typeof document)return null;if("currentScript"in document)return document.currentScript;try{throw new Error}catch(n){var e=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(n.stack)||[])[1];if(e){var t=document.getElementsByTagName("script");for(var r in t)if(t[r].src==e)return t[r]}return null}},isActive:function(e,t,r){for(var n="no-"+t;e;){var a=e.classList;if(a.contains(t))return!0;if(a.contains(n))return!1;e=e.parentElement}return!!r}},languages:{plain:n,plaintext:n,text:n,txt:n,extend:function(e,t){var r=a.util.clone(a.languages[e]);for(var n in t)r[n]=t[n];return r},insertBefore:function(e,t,r,n){var o=(n=n||a.languages)[e],i={};for(var s in o)if(o.hasOwnProperty(s)){if(s==t)for(var l in r)r.hasOwnProperty(l)&&(i[l]=r[l]);r.hasOwnProperty(s)||(i[s]=o[s])}var c=n[e];return n[e]=i,a.languages.DFS(a.languages,(function(t,r){r===c&&t!=e&&(this[t]=i)})),i},DFS:function e(t,r,n,o){o=o||{};var i=a.util.objId;for(var s in t)if(t.hasOwnProperty(s)){r.call(t,s,t[s],n||s);var l=t[s],c=a.util.type(l);"Object"!==c||o[i(l)]?"Array"!==c||o[i(l)]||(o[i(l)]=!0,e(l,r,s,o)):(o[i(l)]=!0,e(l,r,null,o))}}},plugins:{},highlightAll:function(e,t){a.highlightAllUnder(document,e,t)},highlightAllUnder:function(e,t,r){var n={callback:r,container:e,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};a.hooks.run("before-highlightall",n),n.elements=Array.prototype.slice.apply(n.container.querySelectorAll(n.selector)),a.hooks.run("before-all-elements-highlight",n);for(var o,i=0;o=n.elements[i++];)a.highlightElement(o,!0===t,n.callback)},highlightElement:function(t,r,n){var o=a.util.getLanguage(t),i=a.languages[o];a.util.setLanguage(t,o);var s=t.parentElement;s&&"pre"===s.nodeName.toLowerCase()&&a.util.setLanguage(s,o);var l={element:t,language:o,grammar:i,code:t.textContent};function c(e){l.highlightedCode=e,a.hooks.run("before-insert",l),l.element.innerHTML=l.highlightedCode,a.hooks.run("after-highlight",l),a.hooks.run("complete",l),n&&n.call(l.element)}if(a.hooks.run("before-sanity-check",l),(s=l.element.parentElement)&&"pre"===s.nodeName.toLowerCase()&&!s.hasAttribute("tabindex")&&s.setAttribute("tabindex","0"),!l.code)return a.hooks.run("complete",l),void(n&&n.call(l.element));if(a.hooks.run("before-highlight",l),l.grammar)if(r&&e.Worker){var p=new Worker(a.filename);p.onmessage=function(e){c(e.data)},p.postMessage(JSON.stringify({language:l.language,code:l.code,immediateClose:!0}))}else c(a.highlight(l.code,l.grammar,l.language));else c(a.util.encode(l.code))},highlight:function(e,t,r){var n={code:e,grammar:t,language:r};if(a.hooks.run("before-tokenize",n),!n.grammar)throw new Error('The language "'+n.language+'" has no grammar.');return n.tokens=a.tokenize(n.code,n.grammar),a.hooks.run("after-tokenize",n),o.stringify(a.util.encode(n.tokens),n.language)},tokenize:function(e,t){var r=t.rest;if(r){for(var n in r)t[n]=r[n];delete t.rest}var a=new l;return c(a,a.head,e),s(e,a,t,a.head,0),function(e){var t=[],r=e.head.next;for(;r!==e.tail;)t.push(r.value),r=r.next;return t}(a)},hooks:{all:{},add:function(e,t){var r=a.hooks.all;r[e]=r[e]||[],r[e].push(t)},run:function(e,t){var r=a.hooks.all[e];if(r&&r.length)for(var n,o=0;n=r[o++];)n(t)}},Token:o};function o(e,t,r,n){this.type=e,this.content=t,this.alias=r,this.length=0|(n||"").length}function i(e,t,r,n){e.lastIndex=t;var a=e.exec(r);if(a&&n&&a[1]){var o=a[1].length;a.index+=o,a[0]=a[0].slice(o)}return a}function s(e,t,r,n,l,d){for(var u in r)if(r.hasOwnProperty(u)&&r[u]){var h=r[u];h=Array.isArray(h)?h:[h];for(var f=0;f<h.length;++f){if(d&&d.cause==u+","+f)return;var m=h[f],y=m.inside,g=!!m.lookbehind,v=!!m.greedy,b=m.alias;if(v&&!m.pattern.global){var x=m.pattern.toString().match(/[imsuy]*$/)[0];m.pattern=RegExp(m.pattern.source,x+"g")}for(var w=m.pattern||m,$=n.next,k=l;$!==t.tail&&!(d&&k>=d.reach);k+=$.value.length,$=$.next){var S=$.value;if(t.length>e.length)return;if(!(S instanceof o)){var A,O=1;if(v){if(!(A=i(w,k,e,g))||A.index>=e.length)break;var E=A.index,T=A.index+A[0].length,C=k;for(C+=$.value.length;E>=C;)C+=($=$.next).value.length;if(k=C-=$.value.length,$.value instanceof o)continue;for(var j=$;j!==t.tail&&(C<T||"string"==typeof j.value);j=j.next)O++,C+=j.value.length;O--,S=e.slice(k,C),A.index-=k}else if(!(A=i(w,0,S,g)))continue;E=A.index;var _=A[0],P=S.slice(0,E),I=S.slice(E+_.length),R=k+S.length;d&&R>d.reach&&(d.reach=R);var L=$.prev;if(P&&(L=c(t,L,P),k+=P.length),p(t,L,O),$=c(t,L,new o(u,y?a.tokenize(_,y):_,b,_)),I&&c(t,$,I),O>1){var D={cause:u+","+f,reach:R};s(e,t,r,$.prev,k,D),d&&D.reach>d.reach&&(d.reach=D.reach)}}}}}}function l(){var e={value:null,prev:null,next:null},t={value:null,prev:e,next:null};e.next=t,this.head=e,this.tail=t,this.length=0}function c(e,t,r){var n=t.next,a={value:r,prev:t,next:n};return t.next=a,n.prev=a,e.length++,a}function p(e,t,r){for(var n=t.next,a=0;a<r&&n!==e.tail;a++)n=n.next;t.next=n,n.prev=t,e.length-=a}if(e.Prism=a,o.stringify=function e(t,r){if("string"==typeof t)return t;if(Array.isArray(t)){var n="";return t.forEach((function(t){n+=e(t,r)})),n}var o={type:t.type,content:e(t.content,r),tag:"span",classes:["token",t.type],attributes:{},language:r},i=t.alias;i&&(Array.isArray(i)?Array.prototype.push.apply(o.classes,i):o.classes.push(i)),a.hooks.run("wrap",o);var s="";for(var l in o.attributes)s+=" "+l+'="'+(o.attributes[l]||"").replace(/"/g,"&quot;")+'"';return"<"+o.tag+' class="'+o.classes.join(" ")+'"'+s+">"+o.content+"</"+o.tag+">"},!e.document)return e.addEventListener?(a.disableWorkerMessageHandler||e.addEventListener("message",(function(t){var r=JSON.parse(t.data),n=r.language,o=r.code,i=r.immediateClose;e.postMessage(a.highlight(o,a.languages[n],n)),i&&e.close()}),!1),a):a;var d=a.util.currentScript();function u(){a.manual||a.highlightAll()}if(d&&(a.filename=d.src,d.hasAttribute("data-manual")&&(a.manual=!0)),!a.manual){var h=document.readyState;"loading"===h||"interactive"===h&&d&&d.defer?document.addEventListener("DOMContentLoaded",u):window.requestAnimationFrame?window.requestAnimationFrame(u):window.setTimeout(u,16)}return a}("undefined"!=typeof window?window:"undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?self:{});e.exports&&(e.exports=n),void 0!==r.g&&(r.g.Prism=n),n.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},n.languages.markup.tag.inside["attr-value"].inside.entity=n.languages.markup.entity,n.languages.markup.doctype.inside["internal-subset"].inside=n.languages.markup,n.hooks.add("wrap",(function(e){"entity"===e.type&&(e.attributes.title=e.content.replace(/&amp;/,"&"))})),Object.defineProperty(n.languages.markup.tag,"addInlined",{value:function(e,t){var r={};r["language-"+t]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:n.languages[t]},r.cdata=/^<!\[CDATA\[|\]\]>$/i;var a={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:r}};a["language-"+t]={pattern:/[\s\S]+/,inside:n.languages[t]};var o={};o[e]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,(function(){return e})),"i"),lookbehind:!0,greedy:!0,inside:a},n.languages.insertBefore("markup","cdata",o)}}),Object.defineProperty(n.languages.markup.tag,"addAttribute",{value:function(e,t){n.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+e+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[t,"language-"+t],inside:n.languages[t]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),n.languages.html=n.languages.markup,n.languages.mathml=n.languages.markup,n.languages.svg=n.languages.markup,n.languages.xml=n.languages.extend("markup",{}),n.languages.ssml=n.languages.xml,n.languages.atom=n.languages.xml,n.languages.rss=n.languages.xml,function(e){var t=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;e.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:"+/[^;{\s"']|\s+(?!\s)/.source+"|"+t.source+")*?"+/(?:;|(?=\s*\{))/.source),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+t.source+"|"+/(?:[^\\\r\n()"']|\\[\s\S])*/.source+")\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+t.source+"$"),alias:"url"}}},selector:{pattern:RegExp("(^|[{}\\s])[^{}\\s](?:[^{};\"'\\s]|\\s+(?![\\s{])|"+t.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:t,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},e.languages.css.atrule.inside.rest=e.languages.css;var r=e.languages.markup;r&&(r.tag.addInlined("style","css"),r.tag.addAttribute("style","css"))}(n),n.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},n.languages.javascript=n.languages.extend("clike",{"class-name":[n.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),n.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,n.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:n.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:n.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:n.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:n.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:n.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),n.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:n.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),n.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),n.languages.markup&&(n.languages.markup.tag.addInlined("script","javascript"),n.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript")),n.languages.js=n.languages.javascript,function(){if(void 0!==n&&"undefined"!=typeof document){Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var e={js:"javascript",py:"python",rb:"ruby",ps1:"powershell",psm1:"powershell",sh:"bash",bat:"batch",h:"c",tex:"latex"},t="data-src-status",r="loading",a="loaded",o='pre[data-src]:not([data-src-status="loaded"]):not([data-src-status="loading"])';n.hooks.add("before-highlightall",(function(e){e.selector+=", "+o})),n.hooks.add("before-sanity-check",(function(i){var s=i.element;if(s.matches(o)){i.code="",s.setAttribute(t,r);var l=s.appendChild(document.createElement("CODE"));l.textContent="Loading…";var c=s.getAttribute("data-src"),p=i.language;if("none"===p){var d=(/\.(\w+)$/.exec(c)||[,"none"])[1];p=e[d]||d}n.util.setLanguage(l,p),n.util.setLanguage(s,p);var u=n.plugins.autoloader;u&&u.loadLanguages(p),function(e,t,r){var n=new XMLHttpRequest;n.open("GET",e,!0),n.onreadystatechange=function(){4==n.readyState&&(n.status<400&&n.responseText?t(n.responseText):n.status>=400?r("✖ Error "+n.status+" while fetching file: "+n.statusText):r("✖ Error: File does not exist or is empty"))},n.send(null)}(c,(function(e){s.setAttribute(t,a);var r=function(e){var t=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(e||"");if(t){var r=Number(t[1]),n=t[2],a=t[3];return n?a?[r,Number(a)]:[r,void 0]:[r,r]}}(s.getAttribute("data-range"));if(r){var o=e.split(/\r\n?|\n/g),i=r[0],c=null==r[1]?o.length:r[1];i<0&&(i+=o.length),i=Math.max(0,Math.min(i-1,o.length)),c<0&&(c+=o.length),c=Math.max(0,Math.min(c,o.length)),e=o.slice(i,c).join("\n"),s.hasAttribute("data-start")||s.setAttribute("data-start",String(i+1))}l.textContent=e,n.highlightElement(l)}),(function(e){s.setAttribute(t,"failed"),l.textContent=e}))}})),n.plugins.fileHighlight={highlight:function(e){for(var t,r=(e||document).querySelectorAll(o),a=0;t=r[a++];)n.highlightElement(t)}};var i=!1;n.fileHighlight=function(){i||(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),i=!0),n.plugins.fileHighlight.highlight.apply(this,arguments)}}}()},464:e=>{"use strict";var t,r="";e.exports=function(e,n){if("string"!=typeof e)throw new TypeError("expected a string");if(1===n)return e;if(2===n)return e+e;var a=e.length*n;if(t!==e||void 0===t)t=e,r="";else if(r.length>=a)return r.substr(0,a);for(;a>r.length&&n>1;)1&n&&(r+=e),n>>=1,e+=e;return r=(r+=e).substr(0,a)}},131:(e,t,r)=>{"use strict";var n=r(464),a=function(e){return/<\/+[^>]+>/.test(e)},o=function(e){return/<[^>]+\/>/.test(e)};function i(e){return e.split(/(<\/?[^>]+>)/g).filter((function(e){return""!==e.trim()})).map((function(e){return{value:e,type:s(e)}}))}function s(e){return a(e)?"ClosingTag":function(e){return function(e){return/<[^>!]+>/.test(e)}(e)&&!a(e)&&!o(e)}(e)?"OpeningTag":o(e)?"SelfClosingTag":"Text"}e.exports=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=t.indentor,a=t.textNodesOnSameLine,o=0,s=[];r=r||"    ";var l=i(e).map((function(e,t,i){var l=e.value,c=e.type;"ClosingTag"===c&&o--;var p=n(r,o),d=p+l;if("OpeningTag"===c&&o++,a){var u=i[t-1],h=i[t-2];"ClosingTag"===c&&"Text"===u.type&&"OpeningTag"===h.type&&(d=""+p+h.value+u.value+l,s.push(t-2,t-1))}return d}));return s.forEach((function(e){return l[e]=null})),l.filter((function(e){return!!e})).join("\n")}}},n={};function a(e){var t=n[e];if(void 0!==t){if(void 0!==t.error)throw t.error;return t.exports}var o=n[e]={exports:{}};try{var i={id:e,module:o,factory:r[e],require:a};a.i.forEach((function(e){e(i)})),o=i.module,i.factory.call(o.exports,o,o.exports,i.require)}catch(e){throw o.error=e,e}return o.exports}a.m=r,a.c=n,a.i=[],a.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return a.d(t,{a:t}),t},a.d=(e,t)=>{for(var r in t)a.o(t,r)&&!a.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},a.hu=e=>e+"."+a.h()+".hot-update.js",a.hmrF=()=>"main."+a.h()+".hot-update.json",a.h=()=>"5832f421223790aca863",a.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),a.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),e={},t="rapidoc:",a.l=(r,n,o,i)=>{if(e[r])e[r].push(n);else{var s,l;if(void 0!==o)for(var c=document.getElementsByTagName("script"),p=0;p<c.length;p++){var d=c[p];if(d.getAttribute("src")==r||d.getAttribute("data-webpack")==t+o){s=d;break}}s||(l=!0,(s=document.createElement("script")).charset="utf-8",s.timeout=120,a.nc&&s.setAttribute("nonce",a.nc),s.setAttribute("data-webpack",t+o),s.src=r),e[r]=[n];var u=(t,n)=>{s.onerror=s.onload=null,clearTimeout(h);var a=e[r];if(delete e[r],s.parentNode&&s.parentNode.removeChild(s),a&&a.forEach((e=>e(n))),t)return t(n)},h=setTimeout(u.bind(null,void 0,{type:"timeout",target:s}),12e4);s.onerror=u.bind(null,s.onerror),s.onload=u.bind(null,s.onload),l&&document.head.appendChild(s)}},(()=>{var e,t,r,n={},o=a.c,i=[],s=[],l="idle",c=0,p=[];function d(e){l=e;for(var t=[],r=0;r<s.length;r++)t[r]=s[r].call(null,e);return Promise.all(t)}function u(){0==--c&&d("ready").then((function(){if(0===c){var e=p;p=[];for(var t=0;t<e.length;t++)e[t]()}}))}function h(e){if("idle"!==l)throw new Error("check() is only allowed in idle status");return d("check").then(a.hmrM).then((function(r){return r?d("prepare").then((function(){var n=[];return t=[],Promise.all(Object.keys(a.hmrC).reduce((function(e,o){return a.hmrC[o](r.c,r.r,r.m,e,t,n),e}),[])).then((function(){return t=function(){return e?m(e):d("ready").then((function(){return n}))},0===c?t():new Promise((function(e){p.push((function(){e(t())}))}));var t}))})):d(y()?"ready":"idle").then((function(){return null}))}))}function f(e){return"ready"!==l?Promise.resolve().then((function(){throw new Error("apply() is only allowed in ready status (state: "+l+")")})):m(e)}function m(e){e=e||{},y();var n=t.map((function(t){return t(e)}));t=void 0;var a=n.map((function(e){return e.error})).filter(Boolean);if(a.length>0)return d("abort").then((function(){throw a[0]}));var o=d("dispose");n.forEach((function(e){e.dispose&&e.dispose()}));var i,s=d("apply"),l=function(e){i||(i=e)},c=[];return n.forEach((function(e){if(e.apply){var t=e.apply(l);if(t)for(var r=0;r<t.length;r++)c.push(t[r])}})),Promise.all([o,s]).then((function(){return i?d("fail").then((function(){throw i})):r?m(e).then((function(e){return c.forEach((function(t){e.indexOf(t)<0&&e.push(t)})),e})):d("idle").then((function(){return c}))}))}function y(){if(r)return t||(t=[]),Object.keys(a.hmrI).forEach((function(e){r.forEach((function(r){a.hmrI[e](r,t)}))})),r=void 0,!0}a.hmrD=n,a.i.push((function(p){var m,y,g,v,b=p.module,x=function(t,r){var n=o[r];if(!n)return t;var a=function(a){if(n.hot.active){if(o[a]){var s=o[a].parents;-1===s.indexOf(r)&&s.push(r)}else i=[r],e=a;-1===n.children.indexOf(a)&&n.children.push(a)}else console.warn("[HMR] unexpected require("+a+") from disposed module "+r),i=[];return t(a)},s=function(e){return{configurable:!0,enumerable:!0,get:function(){return t[e]},set:function(r){t[e]=r}}};for(var p in t)Object.prototype.hasOwnProperty.call(t,p)&&"e"!==p&&Object.defineProperty(a,p,s(p));return a.e=function(e){return function(e){switch(l){case"ready":d("prepare");case"prepare":return c++,e.then(u,u),e;default:return e}}(t.e(e))},a}(p.require,p.id);b.hot=(m=p.id,y=b,v={_acceptedDependencies:{},_acceptedErrorHandlers:{},_declinedDependencies:{},_selfAccepted:!1,_selfDeclined:!1,_selfInvalidated:!1,_disposeHandlers:[],_main:g=e!==m,_requireSelf:function(){i=y.parents.slice(),e=g?void 0:m,a(m)},active:!0,accept:function(e,t,r){if(void 0===e)v._selfAccepted=!0;else if("function"==typeof e)v._selfAccepted=e;else if("object"==typeof e&&null!==e)for(var n=0;n<e.length;n++)v._acceptedDependencies[e[n]]=t||function(){},v._acceptedErrorHandlers[e[n]]=r;else v._acceptedDependencies[e]=t||function(){},v._acceptedErrorHandlers[e]=r},decline:function(e){if(void 0===e)v._selfDeclined=!0;else if("object"==typeof e&&null!==e)for(var t=0;t<e.length;t++)v._declinedDependencies[e[t]]=!0;else v._declinedDependencies[e]=!0},dispose:function(e){v._disposeHandlers.push(e)},addDisposeHandler:function(e){v._disposeHandlers.push(e)},removeDisposeHandler:function(e){var t=v._disposeHandlers.indexOf(e);t>=0&&v._disposeHandlers.splice(t,1)},invalidate:function(){switch(this._selfInvalidated=!0,l){case"idle":t=[],Object.keys(a.hmrI).forEach((function(e){a.hmrI[e](m,t)})),d("ready");break;case"ready":Object.keys(a.hmrI).forEach((function(e){a.hmrI[e](m,t)}));break;case"prepare":case"check":case"dispose":case"apply":(r=r||[]).push(m)}},check:h,apply:f,status:function(e){if(!e)return l;s.push(e)},addStatusHandler:function(e){s.push(e)},removeStatusHandler:function(e){var t=s.indexOf(e);t>=0&&s.splice(t,1)},data:n[m]},e=void 0,v),b.parents=i,b.children=[],i=[],p.require=x})),a.hmrC={},a.hmrI={}})(),a.p="",(()=>{var e,t,r,n,o,i=a.hmrS_jsonp=a.hmrS_jsonp||{179:0},s={};function l(t,r){return e=r,new Promise(((e,r)=>{s[t]=e;var n=a.p+a.hu(t),o=new Error;a.l(n,(e=>{if(s[t]){s[t]=void 0;var n=e&&("load"===e.type?"missing":e.type),a=e&&e.target&&e.target.src;o.message="Loading hot update chunk "+t+" failed.\n("+n+": "+a+")",o.name="ChunkLoadError",o.type=n,o.request=a,r(o)}}))}))}function c(e){function s(e){for(var t=[e],r={},n=t.map((function(e){return{chain:[e],id:e}}));n.length>0;){var o=n.pop(),i=o.id,s=o.chain,c=a.c[i];if(c&&(!c.hot._selfAccepted||c.hot._selfInvalidated)){if(c.hot._selfDeclined)return{type:"self-declined",chain:s,moduleId:i};if(c.hot._main)return{type:"unaccepted",chain:s,moduleId:i};for(var p=0;p<c.parents.length;p++){var d=c.parents[p],u=a.c[d];if(u){if(u.hot._declinedDependencies[i])return{type:"declined",chain:s.concat([d]),moduleId:i,parentId:d};-1===t.indexOf(d)&&(u.hot._acceptedDependencies[i]?(r[d]||(r[d]=[]),l(r[d],[i])):(delete r[d],t.push(d),n.push({chain:s.concat([d]),id:d})))}}}}return{type:"accepted",moduleId:e,outdatedModules:t,outdatedDependencies:r}}function l(e,t){for(var r=0;r<t.length;r++){var n=t[r];-1===e.indexOf(n)&&e.push(n)}}a.f&&delete a.f.jsonpHmr,t=void 0;var c={},p=[],d={},u=function(e){console.warn("[HMR] unexpected require("+e.id+") to disposed module")};for(var h in r)if(a.o(r,h)){var f,m=r[h],y=!1,g=!1,v=!1,b="";switch((f=m?s(h):{type:"disposed",moduleId:h}).chain&&(b="\nUpdate propagation: "+f.chain.join(" -> ")),f.type){case"self-declined":e.onDeclined&&e.onDeclined(f),e.ignoreDeclined||(y=new Error("Aborted because of self decline: "+f.moduleId+b));break;case"declined":e.onDeclined&&e.onDeclined(f),e.ignoreDeclined||(y=new Error("Aborted because of declined dependency: "+f.moduleId+" in "+f.parentId+b));break;case"unaccepted":e.onUnaccepted&&e.onUnaccepted(f),e.ignoreUnaccepted||(y=new Error("Aborted because "+h+" is not accepted"+b));break;case"accepted":e.onAccepted&&e.onAccepted(f),g=!0;break;case"disposed":e.onDisposed&&e.onDisposed(f),v=!0;break;default:throw new Error("Unexception type "+f.type)}if(y)return{error:y};if(g)for(h in d[h]=m,l(p,f.outdatedModules),f.outdatedDependencies)a.o(f.outdatedDependencies,h)&&(c[h]||(c[h]=[]),l(c[h],f.outdatedDependencies[h]));v&&(l(p,[f.moduleId]),d[h]=u)}r=void 0;for(var x,w=[],$=0;$<p.length;$++){var k=p[$],S=a.c[k];S&&(S.hot._selfAccepted||S.hot._main)&&d[k]!==u&&!S.hot._selfInvalidated&&w.push({module:k,require:S.hot._requireSelf,errorHandler:S.hot._selfAccepted})}return{dispose:function(){var e;n.forEach((function(e){delete i[e]})),n=void 0;for(var t,r=p.slice();r.length>0;){var o=r.pop(),s=a.c[o];if(s){var l={},d=s.hot._disposeHandlers;for($=0;$<d.length;$++)d[$].call(null,l);for(a.hmrD[o]=l,s.hot.active=!1,delete a.c[o],delete c[o],$=0;$<s.children.length;$++){var u=a.c[s.children[$]];u&&((e=u.parents.indexOf(o))>=0&&u.parents.splice(e,1))}}}for(var h in c)if(a.o(c,h)&&(s=a.c[h]))for(x=c[h],$=0;$<x.length;$++)t=x[$],(e=s.children.indexOf(t))>=0&&s.children.splice(e,1)},apply:function(t){for(var r in d)a.o(d,r)&&(a.m[r]=d[r]);for(var n=0;n<o.length;n++)o[n](a);for(var i in c)if(a.o(c,i)){var s=a.c[i];if(s){x=c[i];for(var l=[],u=[],h=[],f=0;f<x.length;f++){var m=x[f],y=s.hot._acceptedDependencies[m],g=s.hot._acceptedErrorHandlers[m];if(y){if(-1!==l.indexOf(y))continue;l.push(y),u.push(g),h.push(m)}}for(var v=0;v<l.length;v++)try{l[v].call(null,x)}catch(r){if("function"==typeof u[v])try{u[v](r,{moduleId:i,dependencyId:h[v]})}catch(n){e.onErrored&&e.onErrored({type:"accept-error-handler-errored",moduleId:i,dependencyId:h[v],error:n,originalError:r}),e.ignoreErrored||(t(n),t(r))}else e.onErrored&&e.onErrored({type:"accept-errored",moduleId:i,dependencyId:h[v],error:r}),e.ignoreErrored||t(r)}}}for(var b=0;b<w.length;b++){var $=w[b],k=$.module;try{$.require(k)}catch(r){if("function"==typeof $.errorHandler)try{$.errorHandler(r,{moduleId:k,module:a.c[k]})}catch(n){e.onErrored&&e.onErrored({type:"self-accept-error-handler-errored",moduleId:k,error:n,originalError:r}),e.ignoreErrored||(t(n),t(r))}else e.onErrored&&e.onErrored({type:"self-accept-errored",moduleId:k,error:r}),e.ignoreErrored||t(r)}}return p}}}self.webpackHotUpdaterapidoc=(t,n,i)=>{for(var l in n)a.o(n,l)&&(r[l]=n[l],e&&e.push(l));i&&o.push(i),s[t]&&(s[t](),s[t]=void 0)},a.hmrI.jsonp=function(e,t){r||(r={},o=[],n=[],t.push(c)),a.o(r,e)||(r[e]=a.m[e])},a.hmrC.jsonp=function(e,s,p,d,u,h){u.push(c),t={},n=s,r=p.reduce((function(e,t){return e[t]=!1,e}),{}),o=[],e.forEach((function(e){a.o(i,e)&&void 0!==i[e]?(d.push(l(e,h)),t[e]=!0):t[e]=!1})),a.f&&(a.f.jsonpHmr=function(e,r){t&&a.o(t,e)&&!t[e]&&(r.push(l(e)),t[e]=!0)})},a.hmrM=()=>{if("undefined"==typeof fetch)throw new Error("No browser support: need fetch API");return fetch(a.p+a.hmrF()).then((e=>{if(404!==e.status){if(!e.ok)throw new Error("Failed to fetch update manifest "+e.statusText);return e.json()}}))}})();a(656)})();
//# sourceMappingURL=rapidoc-min.js.map