/*! RapiDoc 9.3.4.beta | Author - Mrinmoy Majumdar | License information can be found in rapidoc-min.js.LICENSE.txt  */
(()=>{var e,t,r={73:(e,t,r)=>{"use strict";const n=window,o=n.ShadowRoot&&(void 0===n.ShadyCSS||n.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,a=Symbol(),i=new WeakMap;class s{constructor(e,t,r){if(this._$cssResult$=!0,r!==a)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(o&&void 0===e){const r=void 0!==t&&1===t.length;r&&(e=i.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&i.set(t,e))}return e}toString(){return this.cssText}}const l=o?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const r of e.cssRules)t+=r.cssText;return(e=>new s("string"==typeof e?e:e+"",void 0,a))(t)})(e):e;var c;const p=window,d=p.trustedTypes,u=d?d.emptyScript:"",h=p.reactiveElementPolyfillSupport,f={toAttribute(e,t){switch(t){case Boolean:e=e?u:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=null!==e;break;case Number:r=null===e?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch(e){r=null}}return r}},m=(e,t)=>t!==e&&(t==t||e==e),y={attribute:!0,type:String,converter:f,reflect:!1,hasChanged:m};class g extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(e){var t;this.finalize(),(null!==(t=this.h)&&void 0!==t?t:this.h=[]).push(e)}static get observedAttributes(){this.finalize();const e=[];return this.elementProperties.forEach(((t,r)=>{const n=this._$Ep(r,t);void 0!==n&&(this._$Ev.set(n,r),e.push(n))})),e}static createProperty(e,t=y){if(t.state&&(t.attribute=!1),this.finalize(),this.elementProperties.set(e,t),!t.noAccessor&&!this.prototype.hasOwnProperty(e)){const r="symbol"==typeof e?Symbol():"__"+e,n=this.getPropertyDescriptor(e,r,t);void 0!==n&&Object.defineProperty(this.prototype,e,n)}}static getPropertyDescriptor(e,t,r){return{get(){return this[t]},set(n){const o=this[e];this[t]=n,this.requestUpdate(e,o,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)||y}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const e=Object.getPrototypeOf(this);if(e.finalize(),void 0!==e.h&&(this.h=[...e.h]),this.elementProperties=new Map(e.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const e=this.properties,t=[...Object.getOwnPropertyNames(e),...Object.getOwnPropertySymbols(e)];for(const r of t)this.createProperty(r,e[r])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const e of r)t.unshift(l(e))}else void 0!==e&&t.push(l(e));return t}static _$Ep(e,t){const r=t.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof e?e.toLowerCase():void 0}u(){var e;this._$E_=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(e=this.constructor.h)||void 0===e||e.forEach((e=>e(this)))}addController(e){var t,r;(null!==(t=this._$ES)&&void 0!==t?t:this._$ES=[]).push(e),void 0!==this.renderRoot&&this.isConnected&&(null===(r=e.hostConnected)||void 0===r||r.call(e))}removeController(e){var t;null===(t=this._$ES)||void 0===t||t.splice(this._$ES.indexOf(e)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((e,t)=>{this.hasOwnProperty(t)&&(this._$Ei.set(t,this[t]),delete this[t])}))}createRenderRoot(){var e;const t=null!==(e=this.shadowRoot)&&void 0!==e?e:this.attachShadow(this.constructor.shadowRootOptions);return((e,t)=>{o?e.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet)):t.forEach((t=>{const r=document.createElement("style"),o=n.litNonce;void 0!==o&&r.setAttribute("nonce",o),r.textContent=t.cssText,e.appendChild(r)}))})(t,this.constructor.elementStyles),t}connectedCallback(){var e;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(e=this._$ES)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostConnected)||void 0===t?void 0:t.call(e)}))}enableUpdating(e){}disconnectedCallback(){var e;null===(e=this._$ES)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostDisconnected)||void 0===t?void 0:t.call(e)}))}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$EO(e,t,r=y){var n;const o=this.constructor._$Ep(e,r);if(void 0!==o&&!0===r.reflect){const a=(void 0!==(null===(n=r.converter)||void 0===n?void 0:n.toAttribute)?r.converter:f).toAttribute(t,r.type);this._$El=e,null==a?this.removeAttribute(o):this.setAttribute(o,a),this._$El=null}}_$AK(e,t){var r;const n=this.constructor,o=n._$Ev.get(e);if(void 0!==o&&this._$El!==o){const e=n.getPropertyOptions(o),a="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==(null===(r=e.converter)||void 0===r?void 0:r.fromAttribute)?e.converter:f;this._$El=o,this[o]=a.fromAttribute(t,e.type),this._$El=null}}requestUpdate(e,t,r){let n=!0;void 0!==e&&(((r=r||this.constructor.getPropertyOptions(e)).hasChanged||m)(this[e],t)?(this._$AL.has(e)||this._$AL.set(e,t),!0===r.reflect&&this._$El!==e&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(e,r))):n=!1),!this.isUpdatePending&&n&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((e,t)=>this[t]=e)),this._$Ei=void 0);let t=!1;const r=this._$AL;try{t=this.shouldUpdate(r),t?(this.willUpdate(r),null===(e=this._$ES)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostUpdate)||void 0===t?void 0:t.call(e)})),this.update(r)):this._$Ek()}catch(e){throw t=!1,this._$Ek(),e}t&&this._$AE(r)}willUpdate(e){}_$AE(e){var t;null===(t=this._$ES)||void 0===t||t.forEach((e=>{var t;return null===(t=e.hostUpdated)||void 0===t?void 0:t.call(e)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(e){return!0}update(e){void 0!==this._$EC&&(this._$EC.forEach(((e,t)=>this._$EO(t,this[t],e))),this._$EC=void 0),this._$Ek()}updated(e){}firstUpdated(e){}}var v;g.finalized=!0,g.elementProperties=new Map,g.elementStyles=[],g.shadowRootOptions={mode:"open"},null==h||h({ReactiveElement:g}),(null!==(c=p.reactiveElementVersions)&&void 0!==c?c:p.reactiveElementVersions=[]).push("1.4.2");const b=window,x=b.trustedTypes,w=x?x.createPolicy("lit-html",{createHTML:e=>e}):void 0,$=`lit$${(Math.random()+"").slice(9)}$`,k="?"+$,S=`<${k}>`,A=document,E=(e="")=>A.createComment(e),O=e=>null===e||"object"!=typeof e&&"function"!=typeof e,T=Array.isArray,C=e=>T(e)||"function"==typeof(null==e?void 0:e[Symbol.iterator]),_=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,j=/-->/g,I=/>/g,P=RegExp(">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)","g"),R=/'/g,L=/"/g,N=/^(?:script|style|textarea|title)$/i,D=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),F=(D(1),D(2),Symbol.for("lit-noChange")),U=Symbol.for("lit-nothing"),B=new WeakMap,q=A.createTreeWalker(A,129,null,!1),z=(e,t)=>{const r=e.length-1,n=[];let o,a=2===t?"<svg>":"",i=_;for(let t=0;t<r;t++){const r=e[t];let s,l,c=-1,p=0;for(;p<r.length&&(i.lastIndex=p,l=i.exec(r),null!==l);)p=i.lastIndex,i===_?"!--"===l[1]?i=j:void 0!==l[1]?i=I:void 0!==l[2]?(N.test(l[2])&&(o=RegExp("</"+l[2],"g")),i=P):void 0!==l[3]&&(i=P):i===P?">"===l[0]?(i=null!=o?o:_,c=-1):void 0===l[1]?c=-2:(c=i.lastIndex-l[2].length,s=l[1],i=void 0===l[3]?P:'"'===l[3]?L:R):i===L||i===R?i=P:i===j||i===I?i=_:(i=P,o=void 0);const d=i===P&&e[t+1].startsWith("/>")?" ":"";a+=i===_?r+S:c>=0?(n.push(s),r.slice(0,c)+"$lit$"+r.slice(c)+$+d):r+$+(-2===c?(n.push(void 0),t):d)}const s=a+(e[r]||"<?>")+(2===t?"</svg>":"");if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==w?w.createHTML(s):s,n]};class M{constructor({strings:e,_$litType$:t},r){let n;this.parts=[];let o=0,a=0;const i=e.length-1,s=this.parts,[l,c]=z(e,t);if(this.el=M.createElement(l,r),q.currentNode=this.el.content,2===t){const e=this.el.content,t=e.firstChild;t.remove(),e.append(...t.childNodes)}for(;null!==(n=q.nextNode())&&s.length<i;){if(1===n.nodeType){if(n.hasAttributes()){const e=[];for(const t of n.getAttributeNames())if(t.endsWith("$lit$")||t.startsWith($)){const r=c[a++];if(e.push(t),void 0!==r){const e=n.getAttribute(r.toLowerCase()+"$lit$").split($),t=/([.?@])?(.*)/.exec(r);s.push({type:1,index:o,name:t[2],strings:e,ctor:"."===t[1]?K:"?"===t[1]?Y:"@"===t[1]?Z:G})}else s.push({type:6,index:o})}for(const t of e)n.removeAttribute(t)}if(N.test(n.tagName)){const e=n.textContent.split($),t=e.length-1;if(t>0){n.textContent=x?x.emptyScript:"";for(let r=0;r<t;r++)n.append(e[r],E()),q.nextNode(),s.push({type:2,index:++o});n.append(e[t],E())}}}else if(8===n.nodeType)if(n.data===k)s.push({type:2,index:o});else{let e=-1;for(;-1!==(e=n.data.indexOf($,e+1));)s.push({type:7,index:o}),e+=$.length-1}o++}}static createElement(e,t){const r=A.createElement("template");return r.innerHTML=e,r}}function H(e,t,r=e,n){var o,a,i,s;if(t===F)return t;let l=void 0!==n?null===(o=r._$Co)||void 0===o?void 0:o[n]:r._$Cl;const c=O(t)?void 0:t._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(a=null==l?void 0:l._$AO)||void 0===a||a.call(l,!1),void 0===c?l=void 0:(l=new c(e),l._$AT(e,r,n)),void 0!==n?(null!==(i=(s=r)._$Co)&&void 0!==i?i:s._$Co=[])[n]=l:r._$Cl=l),void 0!==l&&(t=H(e,l._$AS(e,t.values),l,n)),t}class W{constructor(e,t){this.u=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}v(e){var t;const{el:{content:r},parts:n}=this._$AD,o=(null!==(t=null==e?void 0:e.creationScope)&&void 0!==t?t:A).importNode(r,!0);q.currentNode=o;let a=q.nextNode(),i=0,s=0,l=n[0];for(;void 0!==l;){if(i===l.index){let t;2===l.type?t=new V(a,a.nextSibling,this,e):1===l.type?t=new l.ctor(a,l.name,l.strings,this,e):6===l.type&&(t=new Q(a,this,e)),this.u.push(t),l=n[++s]}i!==(null==l?void 0:l.index)&&(a=q.nextNode(),i++)}return o}p(e){let t=0;for(const r of this.u)void 0!==r&&(void 0!==r.strings?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}}class V{constructor(e,t,r,n){var o;this.type=2,this._$AH=U,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=n,this._$Cm=null===(o=null==n?void 0:n.isConnected)||void 0===o||o}get _$AU(){var e,t;return null!==(t=null===(e=this._$AM)||void 0===e?void 0:e._$AU)&&void 0!==t?t:this._$Cm}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=H(this,e,t),O(e)?e===U||null==e||""===e?(this._$AH!==U&&this._$AR(),this._$AH=U):e!==this._$AH&&e!==F&&this.g(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):C(e)?this.k(e):this.g(e)}O(e,t=this._$AB){return this._$AA.parentNode.insertBefore(e,t)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}g(e){this._$AH!==U&&O(this._$AH)?this._$AA.nextSibling.data=e:this.T(A.createTextNode(e)),this._$AH=e}$(e){var t;const{values:r,_$litType$:n}=e,o="number"==typeof n?this._$AC(e):(void 0===n.el&&(n.el=M.createElement(n.h,this.options)),n);if((null===(t=this._$AH)||void 0===t?void 0:t._$AD)===o)this._$AH.p(r);else{const e=new W(o,this),t=e.v(this.options);e.p(r),this.T(t),this._$AH=e}}_$AC(e){let t=B.get(e.strings);return void 0===t&&B.set(e.strings,t=new M(e)),t}k(e){T(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let r,n=0;for(const o of e)n===t.length?t.push(r=new V(this.O(E()),this.O(E()),this,this.options)):r=t[n],r._$AI(o),n++;n<t.length&&(this._$AR(r&&r._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){var r;for(null===(r=this._$AP)||void 0===r||r.call(this,!1,!0,t);e&&e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){var t;void 0===this._$AM&&(this._$Cm=e,null===(t=this._$AP)||void 0===t||t.call(this,e))}}class G{constructor(e,t,r,n,o){this.type=1,this._$AH=U,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=o,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=U}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(e,t=this,r,n){const o=this.strings;let a=!1;if(void 0===o)e=H(this,e,t,0),a=!O(e)||e!==this._$AH&&e!==F,a&&(this._$AH=e);else{const n=e;let i,s;for(e=o[0],i=0;i<o.length-1;i++)s=H(this,n[r+i],t,i),s===F&&(s=this._$AH[i]),a||(a=!O(s)||s!==this._$AH[i]),s===U?e=U:e!==U&&(e+=(null!=s?s:"")+o[i+1]),this._$AH[i]=s}a&&!n&&this.j(e)}j(e){e===U?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=e?e:"")}}class K extends G{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===U?void 0:e}}const J=x?x.emptyScript:"";class Y extends G{constructor(){super(...arguments),this.type=4}j(e){e&&e!==U?this.element.setAttribute(this.name,J):this.element.removeAttribute(this.name)}}class Z extends G{constructor(e,t,r,n,o){super(e,t,r,n,o),this.type=5}_$AI(e,t=this){var r;if((e=null!==(r=H(this,e,t,0))&&void 0!==r?r:U)===F)return;const n=this._$AH,o=e===U&&n!==U||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,a=e!==U&&(n===U||o);o&&this.element.removeEventListener(this.name,this,n),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,r;"function"==typeof this._$AH?this._$AH.call(null!==(r=null===(t=this.options)||void 0===t?void 0:t.host)&&void 0!==r?r:this.element,e):this._$AH.handleEvent(e)}}class Q{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){H(this,e)}}const X={P:"$lit$",A:$,M:k,C:1,L:z,R:W,D:C,V:H,I:V,H:G,N:Y,U:Z,B:K,F:Q},ee=b.litHtmlPolyfillSupport;null==ee||ee(M,V),(null!==(v=b.litHtmlVersions)&&void 0!==v?v:b.litHtmlVersions=[]).push("2.4.0");const te=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,re=Symbol(),ne=new Map;class oe{constructor(e,t){if(this._$cssResult$=!0,t!==re)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e}get styleSheet(){let e=ne.get(this.cssText);return te&&void 0===e&&(ne.set(this.cssText,e=new CSSStyleSheet),e.replaceSync(this.cssText)),e}toString(){return this.cssText}}const ae=e=>new oe("string"==typeof e?e:e+"",re),ie=(e,...t)=>{const r=1===e.length?e[0]:t.reduce(((t,r,n)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+e[n+1]),e[0]);return new oe(r,re)},se=te?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const r of e.cssRules)t+=r.cssText;return ae(t)})(e):e;var le;const ce=window.trustedTypes,pe=ce?ce.emptyScript:"",de=window.reactiveElementPolyfillSupport,ue={toAttribute(e,t){switch(t){case Boolean:e=e?pe:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=null!==e;break;case Number:r=null===e?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch(e){r=null}}return r}},he=(e,t)=>t!==e&&(t==t||e==e),fe={attribute:!0,type:String,converter:ue,reflect:!1,hasChanged:he};class me extends HTMLElement{constructor(){super(),this._$Et=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Ei=null,this.o()}static addInitializer(e){var t;null!==(t=this.l)&&void 0!==t||(this.l=[]),this.l.push(e)}static get observedAttributes(){this.finalize();const e=[];return this.elementProperties.forEach(((t,r)=>{const n=this._$Eh(r,t);void 0!==n&&(this._$Eu.set(n,r),e.push(n))})),e}static createProperty(e,t=fe){if(t.state&&(t.attribute=!1),this.finalize(),this.elementProperties.set(e,t),!t.noAccessor&&!this.prototype.hasOwnProperty(e)){const r="symbol"==typeof e?Symbol():"__"+e,n=this.getPropertyDescriptor(e,r,t);void 0!==n&&Object.defineProperty(this.prototype,e,n)}}static getPropertyDescriptor(e,t,r){return{get(){return this[t]},set(n){const o=this[e];this[t]=n,this.requestUpdate(e,o,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)||fe}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const e=Object.getPrototypeOf(this);if(e.finalize(),this.elementProperties=new Map(e.elementProperties),this._$Eu=new Map,this.hasOwnProperty("properties")){const e=this.properties,t=[...Object.getOwnPropertyNames(e),...Object.getOwnPropertySymbols(e)];for(const r of t)this.createProperty(r,e[r])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const e of r)t.unshift(se(e))}else void 0!==e&&t.push(se(e));return t}static _$Eh(e,t){const r=t.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof e?e.toLowerCase():void 0}o(){var e;this._$Ep=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$Em(),this.requestUpdate(),null===(e=this.constructor.l)||void 0===e||e.forEach((e=>e(this)))}addController(e){var t,r;(null!==(t=this._$Eg)&&void 0!==t?t:this._$Eg=[]).push(e),void 0!==this.renderRoot&&this.isConnected&&(null===(r=e.hostConnected)||void 0===r||r.call(e))}removeController(e){var t;null===(t=this._$Eg)||void 0===t||t.splice(this._$Eg.indexOf(e)>>>0,1)}_$Em(){this.constructor.elementProperties.forEach(((e,t)=>{this.hasOwnProperty(t)&&(this._$Et.set(t,this[t]),delete this[t])}))}createRenderRoot(){var e;const t=null!==(e=this.shadowRoot)&&void 0!==e?e:this.attachShadow(this.constructor.shadowRootOptions);return((e,t)=>{te?e.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet)):t.forEach((t=>{const r=document.createElement("style"),n=window.litNonce;void 0!==n&&r.setAttribute("nonce",n),r.textContent=t.cssText,e.appendChild(r)}))})(t,this.constructor.elementStyles),t}connectedCallback(){var e;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(e=this._$Eg)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostConnected)||void 0===t?void 0:t.call(e)}))}enableUpdating(e){}disconnectedCallback(){var e;null===(e=this._$Eg)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostDisconnected)||void 0===t?void 0:t.call(e)}))}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ES(e,t,r=fe){var n,o;const a=this.constructor._$Eh(e,r);if(void 0!==a&&!0===r.reflect){const i=(null!==(o=null===(n=r.converter)||void 0===n?void 0:n.toAttribute)&&void 0!==o?o:ue.toAttribute)(t,r.type);this._$Ei=e,null==i?this.removeAttribute(a):this.setAttribute(a,i),this._$Ei=null}}_$AK(e,t){var r,n,o;const a=this.constructor,i=a._$Eu.get(e);if(void 0!==i&&this._$Ei!==i){const e=a.getPropertyOptions(i),s=e.converter,l=null!==(o=null!==(n=null===(r=s)||void 0===r?void 0:r.fromAttribute)&&void 0!==n?n:"function"==typeof s?s:null)&&void 0!==o?o:ue.fromAttribute;this._$Ei=i,this[i]=l(t,e.type),this._$Ei=null}}requestUpdate(e,t,r){let n=!0;void 0!==e&&(((r=r||this.constructor.getPropertyOptions(e)).hasChanged||he)(this[e],t)?(this._$AL.has(e)||this._$AL.set(e,t),!0===r.reflect&&this._$Ei!==e&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(e,r))):n=!1),!this.isUpdatePending&&n&&(this._$Ep=this._$E_())}async _$E_(){this.isUpdatePending=!0;try{await this._$Ep}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;this.hasUpdated,this._$Et&&(this._$Et.forEach(((e,t)=>this[t]=e)),this._$Et=void 0);let t=!1;const r=this._$AL;try{t=this.shouldUpdate(r),t?(this.willUpdate(r),null===(e=this._$Eg)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostUpdate)||void 0===t?void 0:t.call(e)})),this.update(r)):this._$EU()}catch(e){throw t=!1,this._$EU(),e}t&&this._$AE(r)}willUpdate(e){}_$AE(e){var t;null===(t=this._$Eg)||void 0===t||t.forEach((e=>{var t;return null===(t=e.hostUpdated)||void 0===t?void 0:t.call(e)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$Ep}shouldUpdate(e){return!0}update(e){void 0!==this._$EC&&(this._$EC.forEach(((e,t)=>this._$ES(t,this[t],e))),this._$EC=void 0),this._$EU()}updated(e){}firstUpdated(e){}}var ye;me.finalized=!0,me.elementProperties=new Map,me.elementStyles=[],me.shadowRootOptions={mode:"open"},null==de||de({ReactiveElement:me}),(null!==(le=globalThis.reactiveElementVersions)&&void 0!==le?le:globalThis.reactiveElementVersions=[]).push("1.3.0");const ge=globalThis.trustedTypes,ve=ge?ge.createPolicy("lit-html",{createHTML:e=>e}):void 0,be=`lit$${(Math.random()+"").slice(9)}$`,xe="?"+be,we=`<${xe}>`,$e=document,ke=(e="")=>$e.createComment(e),Se=e=>null===e||"object"!=typeof e&&"function"!=typeof e,Ae=Array.isArray,Ee=e=>{var t;return Ae(e)||"function"==typeof(null===(t=e)||void 0===t?void 0:t[Symbol.iterator])},Oe=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Te=/-->/g,Ce=/>/g,_e=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,je=/'/g,Ie=/"/g,Pe=/^(?:script|style|textarea|title)$/i,Re=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),Le=Re(1),Ne=(Re(2),Symbol.for("lit-noChange")),De=Symbol.for("lit-nothing"),Fe=new WeakMap,Ue=$e.createTreeWalker($e,129,null,!1),Be=(e,t)=>{const r=e.length-1,n=[];let o,a=2===t?"<svg>":"",i=Oe;for(let t=0;t<r;t++){const r=e[t];let s,l,c=-1,p=0;for(;p<r.length&&(i.lastIndex=p,l=i.exec(r),null!==l);)p=i.lastIndex,i===Oe?"!--"===l[1]?i=Te:void 0!==l[1]?i=Ce:void 0!==l[2]?(Pe.test(l[2])&&(o=RegExp("</"+l[2],"g")),i=_e):void 0!==l[3]&&(i=_e):i===_e?">"===l[0]?(i=null!=o?o:Oe,c=-1):void 0===l[1]?c=-2:(c=i.lastIndex-l[2].length,s=l[1],i=void 0===l[3]?_e:'"'===l[3]?Ie:je):i===Ie||i===je?i=_e:i===Te||i===Ce?i=Oe:(i=_e,o=void 0);const d=i===_e&&e[t+1].startsWith("/>")?" ":"";a+=i===Oe?r+we:c>=0?(n.push(s),r.slice(0,c)+"$lit$"+r.slice(c)+be+d):r+be+(-2===c?(n.push(void 0),t):d)}const s=a+(e[r]||"<?>")+(2===t?"</svg>":"");if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==ve?ve.createHTML(s):s,n]};class qe{constructor({strings:e,_$litType$:t},r){let n;this.parts=[];let o=0,a=0;const i=e.length-1,s=this.parts,[l,c]=Be(e,t);if(this.el=qe.createElement(l,r),Ue.currentNode=this.el.content,2===t){const e=this.el.content,t=e.firstChild;t.remove(),e.append(...t.childNodes)}for(;null!==(n=Ue.nextNode())&&s.length<i;){if(1===n.nodeType){if(n.hasAttributes()){const e=[];for(const t of n.getAttributeNames())if(t.endsWith("$lit$")||t.startsWith(be)){const r=c[a++];if(e.push(t),void 0!==r){const e=n.getAttribute(r.toLowerCase()+"$lit$").split(be),t=/([.?@])?(.*)/.exec(r);s.push({type:1,index:o,name:t[2],strings:e,ctor:"."===t[1]?Ve:"?"===t[1]?Ke:"@"===t[1]?Je:We})}else s.push({type:6,index:o})}for(const t of e)n.removeAttribute(t)}if(Pe.test(n.tagName)){const e=n.textContent.split(be),t=e.length-1;if(t>0){n.textContent=ge?ge.emptyScript:"";for(let r=0;r<t;r++)n.append(e[r],ke()),Ue.nextNode(),s.push({type:2,index:++o});n.append(e[t],ke())}}}else if(8===n.nodeType)if(n.data===xe)s.push({type:2,index:o});else{let e=-1;for(;-1!==(e=n.data.indexOf(be,e+1));)s.push({type:7,index:o}),e+=be.length-1}o++}}static createElement(e,t){const r=$e.createElement("template");return r.innerHTML=e,r}}function ze(e,t,r=e,n){var o,a,i,s;if(t===Ne)return t;let l=void 0!==n?null===(o=r._$Cl)||void 0===o?void 0:o[n]:r._$Cu;const c=Se(t)?void 0:t._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(a=null==l?void 0:l._$AO)||void 0===a||a.call(l,!1),void 0===c?l=void 0:(l=new c(e),l._$AT(e,r,n)),void 0!==n?(null!==(i=(s=r)._$Cl)&&void 0!==i?i:s._$Cl=[])[n]=l:r._$Cu=l),void 0!==l&&(t=ze(e,l._$AS(e,t.values),l,n)),t}class Me{constructor(e,t){this.v=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(e){var t;const{el:{content:r},parts:n}=this._$AD,o=(null!==(t=null==e?void 0:e.creationScope)&&void 0!==t?t:$e).importNode(r,!0);Ue.currentNode=o;let a=Ue.nextNode(),i=0,s=0,l=n[0];for(;void 0!==l;){if(i===l.index){let t;2===l.type?t=new He(a,a.nextSibling,this,e):1===l.type?t=new l.ctor(a,l.name,l.strings,this,e):6===l.type&&(t=new Ye(a,this,e)),this.v.push(t),l=n[++s]}i!==(null==l?void 0:l.index)&&(a=Ue.nextNode(),i++)}return o}m(e){let t=0;for(const r of this.v)void 0!==r&&(void 0!==r.strings?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}}class He{constructor(e,t,r,n){var o;this.type=2,this._$AH=De,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=n,this._$Cg=null===(o=null==n?void 0:n.isConnected)||void 0===o||o}get _$AU(){var e,t;return null!==(t=null===(e=this._$AM)||void 0===e?void 0:e._$AU)&&void 0!==t?t:this._$Cg}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=ze(this,e,t),Se(e)?e===De||null==e||""===e?(this._$AH!==De&&this._$AR(),this._$AH=De):e!==this._$AH&&e!==Ne&&this.$(e):void 0!==e._$litType$?this.T(e):void 0!==e.nodeType?this.k(e):Ee(e)?this.S(e):this.$(e)}A(e,t=this._$AB){return this._$AA.parentNode.insertBefore(e,t)}k(e){this._$AH!==e&&(this._$AR(),this._$AH=this.A(e))}$(e){this._$AH!==De&&Se(this._$AH)?this._$AA.nextSibling.data=e:this.k($e.createTextNode(e)),this._$AH=e}T(e){var t;const{values:r,_$litType$:n}=e,o="number"==typeof n?this._$AC(e):(void 0===n.el&&(n.el=qe.createElement(n.h,this.options)),n);if((null===(t=this._$AH)||void 0===t?void 0:t._$AD)===o)this._$AH.m(r);else{const e=new Me(o,this),t=e.p(this.options);e.m(r),this.k(t),this._$AH=e}}_$AC(e){let t=Fe.get(e.strings);return void 0===t&&Fe.set(e.strings,t=new qe(e)),t}S(e){Ae(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let r,n=0;for(const o of e)n===t.length?t.push(r=new He(this.A(ke()),this.A(ke()),this,this.options)):r=t[n],r._$AI(o),n++;n<t.length&&(this._$AR(r&&r._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){var r;for(null===(r=this._$AP)||void 0===r||r.call(this,!1,!0,t);e&&e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){var t;void 0===this._$AM&&(this._$Cg=e,null===(t=this._$AP)||void 0===t||t.call(this,e))}}class We{constructor(e,t,r,n,o){this.type=1,this._$AH=De,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=o,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=De}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(e,t=this,r,n){const o=this.strings;let a=!1;if(void 0===o)e=ze(this,e,t,0),a=!Se(e)||e!==this._$AH&&e!==Ne,a&&(this._$AH=e);else{const n=e;let i,s;for(e=o[0],i=0;i<o.length-1;i++)s=ze(this,n[r+i],t,i),s===Ne&&(s=this._$AH[i]),a||(a=!Se(s)||s!==this._$AH[i]),s===De?e=De:e!==De&&(e+=(null!=s?s:"")+o[i+1]),this._$AH[i]=s}a&&!n&&this.C(e)}C(e){e===De?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=e?e:"")}}class Ve extends We{constructor(){super(...arguments),this.type=3}C(e){this.element[this.name]=e===De?void 0:e}}const Ge=ge?ge.emptyScript:"";class Ke extends We{constructor(){super(...arguments),this.type=4}C(e){e&&e!==De?this.element.setAttribute(this.name,Ge):this.element.removeAttribute(this.name)}}class Je extends We{constructor(e,t,r,n,o){super(e,t,r,n,o),this.type=5}_$AI(e,t=this){var r;if((e=null!==(r=ze(this,e,t,0))&&void 0!==r?r:De)===Ne)return;const n=this._$AH,o=e===De&&n!==De||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,a=e!==De&&(n===De||o);o&&this.element.removeEventListener(this.name,this,n),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,r;"function"==typeof this._$AH?this._$AH.call(null!==(r=null===(t=this.options)||void 0===t?void 0:t.host)&&void 0!==r?r:this.element,e):this._$AH.handleEvent(e)}}class Ye{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){ze(this,e)}}const Ze=window.litHtmlPolyfillSupport;var Qe,Xe;null==Ze||Ze(qe,He),(null!==(ye=globalThis.litHtmlVersions)&&void 0!==ye?ye:globalThis.litHtmlVersions=[]).push("2.2.0");class et extends me{constructor(){super(...arguments),this.renderOptions={host:this},this._$Dt=void 0}createRenderRoot(){var e,t;const r=super.createRenderRoot();return null!==(e=(t=this.renderOptions).renderBefore)&&void 0!==e||(t.renderBefore=r.firstChild),r}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Dt=((e,t,r)=>{var n,o;const a=null!==(n=null==r?void 0:r.renderBefore)&&void 0!==n?n:t;let i=a._$litPart$;if(void 0===i){const e=null!==(o=null==r?void 0:r.renderBefore)&&void 0!==o?o:null;a._$litPart$=i=new He(t.insertBefore(ke(),e),e,void 0,null!=r?r:{})}return i._$AI(e),i})(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),null===(e=this._$Dt)||void 0===e||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._$Dt)||void 0===e||e.setConnected(!1)}render(){return Ne}}et.finalized=!0,et._$litElement$=!0,null===(Qe=globalThis.litElementHydrateSupport)||void 0===Qe||Qe.call(globalThis,{LitElement:et});const tt=globalThis.litElementPolyfillSupport;null==tt||tt({LitElement:et});function rt(){return{async:!1,baseUrl:null,breaks:!1,extensions:null,gfm:!0,headerIds:!0,headerPrefix:"",highlight:null,langPrefix:"language-",mangle:!0,pedantic:!1,renderer:null,sanitize:!1,sanitizer:null,silent:!1,smartypants:!1,tokenizer:null,walkTokens:null,xhtml:!1}}(null!==(Xe=globalThis.litElementVersions)&&void 0!==Xe?Xe:globalThis.litElementVersions=[]).push("3.2.0");let nt={async:!1,baseUrl:null,breaks:!1,extensions:null,gfm:!0,headerIds:!0,headerPrefix:"",highlight:null,langPrefix:"language-",mangle:!0,pedantic:!1,renderer:null,sanitize:!1,sanitizer:null,silent:!1,smartypants:!1,tokenizer:null,walkTokens:null,xhtml:!1};const ot=/[&<>"']/,at=new RegExp(ot.source,"g"),it=/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,st=new RegExp(it.source,"g"),lt={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},ct=e=>lt[e];function pt(e,t){if(t){if(ot.test(e))return e.replace(at,ct)}else if(it.test(e))return e.replace(st,ct);return e}const dt=/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;function ut(e){return e.replace(dt,((e,t)=>"colon"===(t=t.toLowerCase())?":":"#"===t.charAt(0)?"x"===t.charAt(1)?String.fromCharCode(parseInt(t.substring(2),16)):String.fromCharCode(+t.substring(1)):""))}const ht=/(^|[^\[])\^/g;function ft(e,t){e="string"==typeof e?e:e.source,t=t||"";const r={replace:(t,n)=>(n=(n=n.source||n).replace(ht,"$1"),e=e.replace(t,n),r),getRegex:()=>new RegExp(e,t)};return r}const mt=/[^\w:]/g,yt=/^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;function gt(e,t,r){if(e){let e;try{e=decodeURIComponent(ut(r)).replace(mt,"").toLowerCase()}catch(e){return null}if(0===e.indexOf("javascript:")||0===e.indexOf("vbscript:")||0===e.indexOf("data:"))return null}t&&!yt.test(r)&&(r=function(e,t){vt[" "+e]||(bt.test(e)?vt[" "+e]=e+"/":vt[" "+e]=At(e,"/",!0));const r=-1===(e=vt[" "+e]).indexOf(":");return"//"===t.substring(0,2)?r?t:e.replace(xt,"$1")+t:"/"===t.charAt(0)?r?t:e.replace(wt,"$1")+t:e+t}(t,r));try{r=encodeURI(r).replace(/%25/g,"%")}catch(e){return null}return r}const vt={},bt=/^[^:]+:\/*[^/]*$/,xt=/^([^:]+:)[\s\S]*$/,wt=/^([^:]+:\/*[^/]*)[\s\S]*$/;const $t={exec:function(){}};function kt(e){let t,r,n=1;for(;n<arguments.length;n++)for(r in t=arguments[n],t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e}function St(e,t){const r=e.replace(/\|/g,((e,t,r)=>{let n=!1,o=t;for(;--o>=0&&"\\"===r[o];)n=!n;return n?"|":" |"})).split(/ \|/);let n=0;if(r[0].trim()||r.shift(),r.length>0&&!r[r.length-1].trim()&&r.pop(),r.length>t)r.splice(t);else for(;r.length<t;)r.push("");for(;n<r.length;n++)r[n]=r[n].trim().replace(/\\\|/g,"|");return r}function At(e,t,r){const n=e.length;if(0===n)return"";let o=0;for(;o<n;){const a=e.charAt(n-o-1);if(a!==t||r){if(a===t||!r)break;o++}else o++}return e.slice(0,n-o)}function Et(e){e&&e.sanitize&&!e.silent&&console.warn("marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options")}function Ot(e,t){if(t<1)return"";let r="";for(;t>1;)1&t&&(r+=e),t>>=1,e+=e;return r+e}function Tt(e,t,r,n){const o=t.href,a=t.title?pt(t.title):null,i=e[1].replace(/\\([\[\]])/g,"$1");if("!"!==e[0].charAt(0)){n.state.inLink=!0;const e={type:"link",raw:r,href:o,title:a,text:i,tokens:n.inlineTokens(i)};return n.state.inLink=!1,e}return{type:"image",raw:r,href:o,title:a,text:pt(i)}}class Ct{constructor(e){this.options=e||nt}space(e){const t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){const t=this.rules.block.code.exec(e);if(t){const e=t[0].replace(/^ {1,4}/gm,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?e:At(e,"\n")}}}fences(e){const t=this.rules.block.fences.exec(e);if(t){const e=t[0],r=function(e,t){const r=e.match(/^(\s+)(?:```)/);if(null===r)return t;const n=r[1];return t.split("\n").map((e=>{const t=e.match(/^\s+/);if(null===t)return e;const[r]=t;return r.length>=n.length?e.slice(n.length):e})).join("\n")}(e,t[3]||"");return{type:"code",raw:e,lang:t[2]?t[2].trim().replace(this.rules.inline._escapes,"$1"):t[2],text:r}}}heading(e){const t=this.rules.block.heading.exec(e);if(t){let e=t[2].trim();if(/#$/.test(e)){const t=At(e,"#");this.options.pedantic?e=t.trim():t&&!/ $/.test(t)||(e=t.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:e,tokens:this.lexer.inline(e)}}}hr(e){const t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:t[0]}}blockquote(e){const t=this.rules.block.blockquote.exec(e);if(t){const e=t[0].replace(/^ *>[ \t]?/gm,"");return{type:"blockquote",raw:t[0],tokens:this.lexer.blockTokens(e,[]),text:e}}}list(e){let t=this.rules.block.list.exec(e);if(t){let r,n,o,a,i,s,l,c,p,d,u,h,f=t[1].trim();const m=f.length>1,y={type:"list",raw:"",ordered:m,start:m?+f.slice(0,-1):"",loose:!1,items:[]};f=m?`\\d{1,9}\\${f.slice(-1)}`:`\\${f}`,this.options.pedantic&&(f=m?f:"[*+-]");const g=new RegExp(`^( {0,3}${f})((?:[\t ][^\\n]*)?(?:\\n|$))`);for(;e&&(h=!1,t=g.exec(e))&&!this.rules.block.hr.test(e);){if(r=t[0],e=e.substring(r.length),c=t[2].split("\n",1)[0],p=e.split("\n",1)[0],this.options.pedantic?(a=2,u=c.trimLeft()):(a=t[2].search(/[^ ]/),a=a>4?1:a,u=c.slice(a),a+=t[1].length),s=!1,!c&&/^ *$/.test(p)&&(r+=p+"\n",e=e.substring(p.length+1),h=!0),!h){const t=new RegExp(`^ {0,${Math.min(3,a-1)}}(?:[*+-]|\\d{1,9}[.)])((?: [^\\n]*)?(?:\\n|$))`),n=new RegExp(`^ {0,${Math.min(3,a-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),o=new RegExp(`^ {0,${Math.min(3,a-1)}}(?:\`\`\`|~~~)`),i=new RegExp(`^ {0,${Math.min(3,a-1)}}#`);for(;e&&(d=e.split("\n",1)[0],c=d,this.options.pedantic&&(c=c.replace(/^ {1,4}(?=( {4})*[^ ])/g,"  ")),!o.test(c))&&!i.test(c)&&!t.test(c)&&!n.test(e);){if(c.search(/[^ ]/)>=a||!c.trim())u+="\n"+c.slice(a);else{if(s)break;u+="\n"+c}s||c.trim()||(s=!0),r+=d+"\n",e=e.substring(d.length+1)}}y.loose||(l?y.loose=!0:/\n *\n *$/.test(r)&&(l=!0)),this.options.gfm&&(n=/^\[[ xX]\] /.exec(u),n&&(o="[ ] "!==n[0],u=u.replace(/^\[[ xX]\] +/,""))),y.items.push({type:"list_item",raw:r,task:!!n,checked:o,loose:!1,text:u}),y.raw+=r}y.items[y.items.length-1].raw=r.trimRight(),y.items[y.items.length-1].text=u.trimRight(),y.raw=y.raw.trimRight();const v=y.items.length;for(i=0;i<v;i++){this.lexer.state.top=!1,y.items[i].tokens=this.lexer.blockTokens(y.items[i].text,[]);const e=y.items[i].tokens.filter((e=>"space"===e.type)),t=e.every((e=>{const t=e.raw.split("");let r=0;for(const e of t)if("\n"===e&&(r+=1),r>1)return!0;return!1}));!y.loose&&e.length&&t&&(y.loose=!0,y.items[i].loose=!0)}return y}}html(e){const t=this.rules.block.html.exec(e);if(t){const e={type:"html",raw:t[0],pre:!this.options.sanitizer&&("pre"===t[1]||"script"===t[1]||"style"===t[1]),text:t[0]};if(this.options.sanitize){const r=this.options.sanitizer?this.options.sanitizer(t[0]):pt(t[0]);e.type="paragraph",e.text=r,e.tokens=this.lexer.inline(r)}return e}}def(e){const t=this.rules.block.def.exec(e);if(t){const e=t[1].toLowerCase().replace(/\s+/g," "),r=t[2]?t[2].replace(/^<(.*)>$/,"$1").replace(this.rules.inline._escapes,"$1"):"",n=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline._escapes,"$1"):t[3];return{type:"def",tag:e,raw:t[0],href:r,title:n}}}table(e){const t=this.rules.block.table.exec(e);if(t){const e={type:"table",header:St(t[1]).map((e=>({text:e}))),align:t[2].replace(/^ *|\| *$/g,"").split(/ *\| */),rows:t[3]&&t[3].trim()?t[3].replace(/\n[ \t]*$/,"").split("\n"):[]};if(e.header.length===e.align.length){e.raw=t[0];let r,n,o,a,i=e.align.length;for(r=0;r<i;r++)/^ *-+: *$/.test(e.align[r])?e.align[r]="right":/^ *:-+: *$/.test(e.align[r])?e.align[r]="center":/^ *:-+ *$/.test(e.align[r])?e.align[r]="left":e.align[r]=null;for(i=e.rows.length,r=0;r<i;r++)e.rows[r]=St(e.rows[r],e.header.length).map((e=>({text:e})));for(i=e.header.length,n=0;n<i;n++)e.header[n].tokens=this.lexer.inline(e.header[n].text);for(i=e.rows.length,n=0;n<i;n++)for(a=e.rows[n],o=0;o<a.length;o++)a[o].tokens=this.lexer.inline(a[o].text);return e}}}lheading(e){const t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:"="===t[2].charAt(0)?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){const t=this.rules.block.paragraph.exec(e);if(t){const e="\n"===t[1].charAt(t[1].length-1)?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:e,tokens:this.lexer.inline(e)}}}text(e){const t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){const t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:pt(t[1])}}tag(e){const t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&/^<a /i.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&/^<\/a>/i.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&/^<(pre|code|kbd|script)(\s|>)/i.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&/^<\/(pre|code|kbd|script)(\s|>)/i.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:this.options.sanitize?"text":"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,text:this.options.sanitize?this.options.sanitizer?this.options.sanitizer(t[0]):pt(t[0]):t[0]}}link(e){const t=this.rules.inline.link.exec(e);if(t){const e=t[2].trim();if(!this.options.pedantic&&/^</.test(e)){if(!/>$/.test(e))return;const t=At(e.slice(0,-1),"\\");if((e.length-t.length)%2==0)return}else{const e=function(e,t){if(-1===e.indexOf(t[1]))return-1;const r=e.length;let n=0,o=0;for(;o<r;o++)if("\\"===e[o])o++;else if(e[o]===t[0])n++;else if(e[o]===t[1]&&(n--,n<0))return o;return-1}(t[2],"()");if(e>-1){const r=(0===t[0].indexOf("!")?5:4)+t[1].length+e;t[2]=t[2].substring(0,e),t[0]=t[0].substring(0,r).trim(),t[3]=""}}let r=t[2],n="";if(this.options.pedantic){const e=/^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(r);e&&(r=e[1],n=e[3])}else n=t[3]?t[3].slice(1,-1):"";return r=r.trim(),/^</.test(r)&&(r=this.options.pedantic&&!/>$/.test(e)?r.slice(1):r.slice(1,-1)),Tt(t,{href:r?r.replace(this.rules.inline._escapes,"$1"):r,title:n?n.replace(this.rules.inline._escapes,"$1"):n},t[0],this.lexer)}}reflink(e,t){let r;if((r=this.rules.inline.reflink.exec(e))||(r=this.rules.inline.nolink.exec(e))){let e=(r[2]||r[1]).replace(/\s+/g," ");if(e=t[e.toLowerCase()],!e){const e=r[0].charAt(0);return{type:"text",raw:e,text:e}}return Tt(r,e,r[0],this.lexer)}}emStrong(e,t,r=""){let n=this.rules.inline.emStrong.lDelim.exec(e);if(!n)return;if(n[3]&&r.match(/[\p{L}\p{N}]/u))return;const o=n[1]||n[2]||"";if(!o||o&&(""===r||this.rules.inline.punctuation.exec(r))){const r=n[0].length-1;let o,a,i=r,s=0;const l="*"===n[0][0]?this.rules.inline.emStrong.rDelimAst:this.rules.inline.emStrong.rDelimUnd;for(l.lastIndex=0,t=t.slice(-1*e.length+r);null!=(n=l.exec(t));){if(o=n[1]||n[2]||n[3]||n[4]||n[5]||n[6],!o)continue;if(a=o.length,n[3]||n[4]){i+=a;continue}if((n[5]||n[6])&&r%3&&!((r+a)%3)){s+=a;continue}if(i-=a,i>0)continue;a=Math.min(a,a+i+s);const t=e.slice(0,r+n.index+(n[0].length-o.length)+a);if(Math.min(r,a)%2){const e=t.slice(1,-1);return{type:"em",raw:t,text:e,tokens:this.lexer.inlineTokens(e)}}const l=t.slice(2,-2);return{type:"strong",raw:t,text:l,tokens:this.lexer.inlineTokens(l)}}}}codespan(e){const t=this.rules.inline.code.exec(e);if(t){let e=t[2].replace(/\n/g," ");const r=/[^ ]/.test(e),n=/^ /.test(e)&&/ $/.test(e);return r&&n&&(e=e.substring(1,e.length-1)),e=pt(e,!0),{type:"codespan",raw:t[0],text:e}}}br(e){const t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e){const t=this.rules.inline.del.exec(e);if(t)return{type:"del",raw:t[0],text:t[2],tokens:this.lexer.inlineTokens(t[2])}}autolink(e,t){const r=this.rules.inline.autolink.exec(e);if(r){let e,n;return"@"===r[2]?(e=pt(this.options.mangle?t(r[1]):r[1]),n="mailto:"+e):(e=pt(r[1]),n=e),{type:"link",raw:r[0],text:e,href:n,tokens:[{type:"text",raw:e,text:e}]}}}url(e,t){let r;if(r=this.rules.inline.url.exec(e)){let e,n;if("@"===r[2])e=pt(this.options.mangle?t(r[0]):r[0]),n="mailto:"+e;else{let t;do{t=r[0],r[0]=this.rules.inline._backpedal.exec(r[0])[0]}while(t!==r[0]);e=pt(r[0]),n="www."===r[1]?"http://"+e:e}return{type:"link",raw:r[0],text:e,href:n,tokens:[{type:"text",raw:e,text:e}]}}}inlineText(e,t){const r=this.rules.inline.text.exec(e);if(r){let e;return e=this.lexer.state.inRawBlock?this.options.sanitize?this.options.sanitizer?this.options.sanitizer(r[0]):pt(r[0]):r[0]:pt(this.options.smartypants?t(r[0]):r[0]),{type:"text",raw:r[0],text:e}}}}const _t={newline:/^(?: *(?:\n|$))+/,code:/^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,fences:/^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?=\n|$)|$)/,hr:/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,heading:/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,blockquote:/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,list:/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/,html:"^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))",def:/^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/,table:$t,lheading:/^((?:.|\n(?!\n))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,_paragraph:/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,text:/^[^\n]+/,_label:/(?!\s*\])(?:\\.|[^\[\]\\])+/,_title:/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/};_t.def=ft(_t.def).replace("label",_t._label).replace("title",_t._title).getRegex(),_t.bullet=/(?:[*+-]|\d{1,9}[.)])/,_t.listItemStart=ft(/^( *)(bull) */).replace("bull",_t.bullet).getRegex(),_t.list=ft(_t.list).replace(/bull/g,_t.bullet).replace("hr","\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def","\\n+(?="+_t.def.source+")").getRegex(),_t._tag="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",_t._comment=/<!--(?!-?>)[\s\S]*?(?:-->|$)/,_t.html=ft(_t.html,"i").replace("comment",_t._comment).replace("tag",_t._tag).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),_t.paragraph=ft(_t._paragraph).replace("hr",_t.hr).replace("heading"," {0,3}#{1,6} ").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",_t._tag).getRegex(),_t.blockquote=ft(_t.blockquote).replace("paragraph",_t.paragraph).getRegex(),_t.normal=kt({},_t),_t.gfm=kt({},_t.normal,{table:"^ *([^\\n ].*\\|.*)\\n {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"}),_t.gfm.table=ft(_t.gfm.table).replace("hr",_t.hr).replace("heading"," {0,3}#{1,6} ").replace("blockquote"," {0,3}>").replace("code"," {4}[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",_t._tag).getRegex(),_t.gfm.paragraph=ft(_t._paragraph).replace("hr",_t.hr).replace("heading"," {0,3}#{1,6} ").replace("|lheading","").replace("table",_t.gfm.table).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",_t._tag).getRegex(),_t.pedantic=kt({},_t.normal,{html:ft("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment",_t._comment).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:$t,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:ft(_t.normal._paragraph).replace("hr",_t.hr).replace("heading"," *#{1,6} *[^\n]").replace("lheading",_t.lheading).replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").getRegex()});const jt={escape:/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,autolink:/^<(scheme:[^\s\x00-\x1f<>]*|email)>/,url:$t,tag:"^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",link:/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,reflink:/^!?\[(label)\]\[(ref)\]/,nolink:/^!?\[(ref)\](?:\[\])?/,reflinkSearch:"reflink|nolink(?!\\()",emStrong:{lDelim:/^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,rDelimAst:/^(?:[^_*\\]|\\.)*?\_\_(?:[^_*\\]|\\.)*?\*(?:[^_*\\]|\\.)*?(?=\_\_)|(?:[^*\\]|\\.)+(?=[^*])|[punct_](\*+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|(?:[^punct*_\s\\]|\\.)(\*+)(?=[^punct*_\s])/,rDelimUnd:/^(?:[^_*\\]|\\.)*?\*\*(?:[^_*\\]|\\.)*?\_(?:[^_*\\]|\\.)*?(?=\*\*)|(?:[^_\\]|\\.)+(?=[^_])|[punct*](\_+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/},code:/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,br:/^( {2,}|\\)\n(?!\s*$)/,del:$t,text:/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,punctuation:/^([\spunctuation])/};function It(e){return e.replace(/---/g,"—").replace(/--/g,"–").replace(/(^|[-\u2014/(\[{"\s])'/g,"$1‘").replace(/'/g,"’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g,"$1“").replace(/"/g,"”").replace(/\.{3}/g,"…")}function Pt(e){let t,r,n="";const o=e.length;for(t=0;t<o;t++)r=e.charCodeAt(t),Math.random()>.5&&(r="x"+r.toString(16)),n+="&#"+r+";";return n}jt._punctuation="!\"#$%&'()+\\-.,/:;<=>?@\\[\\]`^{|}~",jt.punctuation=ft(jt.punctuation).replace(/punctuation/g,jt._punctuation).getRegex(),jt.blockSkip=/\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g,jt.escapedEmSt=/(?:^|[^\\])(?:\\\\)*\\[*_]/g,jt._comment=ft(_t._comment).replace("(?:--\x3e|$)","--\x3e").getRegex(),jt.emStrong.lDelim=ft(jt.emStrong.lDelim).replace(/punct/g,jt._punctuation).getRegex(),jt.emStrong.rDelimAst=ft(jt.emStrong.rDelimAst,"g").replace(/punct/g,jt._punctuation).getRegex(),jt.emStrong.rDelimUnd=ft(jt.emStrong.rDelimUnd,"g").replace(/punct/g,jt._punctuation).getRegex(),jt._escapes=/\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g,jt._scheme=/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/,jt._email=/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/,jt.autolink=ft(jt.autolink).replace("scheme",jt._scheme).replace("email",jt._email).getRegex(),jt._attribute=/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/,jt.tag=ft(jt.tag).replace("comment",jt._comment).replace("attribute",jt._attribute).getRegex(),jt._label=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,jt._href=/<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/,jt._title=/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/,jt.link=ft(jt.link).replace("label",jt._label).replace("href",jt._href).replace("title",jt._title).getRegex(),jt.reflink=ft(jt.reflink).replace("label",jt._label).replace("ref",_t._label).getRegex(),jt.nolink=ft(jt.nolink).replace("ref",_t._label).getRegex(),jt.reflinkSearch=ft(jt.reflinkSearch,"g").replace("reflink",jt.reflink).replace("nolink",jt.nolink).getRegex(),jt.normal=kt({},jt),jt.pedantic=kt({},jt.normal,{strong:{start:/^__|\*\*/,middle:/^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,endAst:/\*\*(?!\*)/g,endUnd:/__(?!_)/g},em:{start:/^_|\*/,middle:/^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,endAst:/\*(?!\*)/g,endUnd:/_(?!_)/g},link:ft(/^!?\[(label)\]\((.*?)\)/).replace("label",jt._label).getRegex(),reflink:ft(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",jt._label).getRegex()}),jt.gfm=kt({},jt.normal,{escape:ft(jt.escape).replace("])","~|])").getRegex(),_extended_email:/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,url:/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,_backpedal:/(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/}),jt.gfm.url=ft(jt.gfm.url,"i").replace("email",jt.gfm._extended_email).getRegex(),jt.breaks=kt({},jt.gfm,{br:ft(jt.br).replace("{2,}","*").getRegex(),text:ft(jt.gfm.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()});class Rt{constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||nt,this.options.tokenizer=this.options.tokenizer||new Ct,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const t={block:_t.normal,inline:jt.normal};this.options.pedantic?(t.block=_t.pedantic,t.inline=jt.pedantic):this.options.gfm&&(t.block=_t.gfm,this.options.breaks?t.inline=jt.breaks:t.inline=jt.gfm),this.tokenizer.rules=t}static get rules(){return{block:_t,inline:jt}}static lex(e,t){return new Rt(t).lex(e)}static lexInline(e,t){return new Rt(t).inlineTokens(e)}lex(e){let t;for(e=e.replace(/\r\n|\r/g,"\n"),this.blockTokens(e,this.tokens);t=this.inlineQueue.shift();)this.inlineTokens(t.src,t.tokens);return this.tokens}blockTokens(e,t=[]){let r,n,o,a;for(e=this.options.pedantic?e.replace(/\t/g,"    ").replace(/^ +$/gm,""):e.replace(/^( *)(\t+)/gm,((e,t,r)=>t+"    ".repeat(r.length)));e;)if(!(this.options.extensions&&this.options.extensions.block&&this.options.extensions.block.some((n=>!!(r=n.call({lexer:this},e,t))&&(e=e.substring(r.raw.length),t.push(r),!0)))))if(r=this.tokenizer.space(e))e=e.substring(r.raw.length),1===r.raw.length&&t.length>0?t[t.length-1].raw+="\n":t.push(r);else if(r=this.tokenizer.code(e))e=e.substring(r.raw.length),n=t[t.length-1],!n||"paragraph"!==n.type&&"text"!==n.type?t.push(r):(n.raw+="\n"+r.raw,n.text+="\n"+r.text,this.inlineQueue[this.inlineQueue.length-1].src=n.text);else if(r=this.tokenizer.fences(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.heading(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.hr(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.blockquote(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.list(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.html(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.def(e))e=e.substring(r.raw.length),n=t[t.length-1],!n||"paragraph"!==n.type&&"text"!==n.type?this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title}):(n.raw+="\n"+r.raw,n.text+="\n"+r.raw,this.inlineQueue[this.inlineQueue.length-1].src=n.text);else if(r=this.tokenizer.table(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.lheading(e))e=e.substring(r.raw.length),t.push(r);else{if(o=e,this.options.extensions&&this.options.extensions.startBlock){let t=1/0;const r=e.slice(1);let n;this.options.extensions.startBlock.forEach((function(e){n=e.call({lexer:this},r),"number"==typeof n&&n>=0&&(t=Math.min(t,n))})),t<1/0&&t>=0&&(o=e.substring(0,t+1))}if(this.state.top&&(r=this.tokenizer.paragraph(o)))n=t[t.length-1],a&&"paragraph"===n.type?(n.raw+="\n"+r.raw,n.text+="\n"+r.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=n.text):t.push(r),a=o.length!==e.length,e=e.substring(r.raw.length);else if(r=this.tokenizer.text(e))e=e.substring(r.raw.length),n=t[t.length-1],n&&"text"===n.type?(n.raw+="\n"+r.raw,n.text+="\n"+r.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=n.text):t.push(r);else if(e){const t="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(t);break}throw new Error(t)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){let r,n,o,a,i,s,l=e;if(this.tokens.links){const e=Object.keys(this.tokens.links);if(e.length>0)for(;null!=(a=this.tokenizer.rules.inline.reflinkSearch.exec(l));)e.includes(a[0].slice(a[0].lastIndexOf("[")+1,-1))&&(l=l.slice(0,a.index)+"["+Ot("a",a[0].length-2)+"]"+l.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;null!=(a=this.tokenizer.rules.inline.blockSkip.exec(l));)l=l.slice(0,a.index)+"["+Ot("a",a[0].length-2)+"]"+l.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);for(;null!=(a=this.tokenizer.rules.inline.escapedEmSt.exec(l));)l=l.slice(0,a.index+a[0].length-2)+"++"+l.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex),this.tokenizer.rules.inline.escapedEmSt.lastIndex--;for(;e;)if(i||(s=""),i=!1,!(this.options.extensions&&this.options.extensions.inline&&this.options.extensions.inline.some((n=>!!(r=n.call({lexer:this},e,t))&&(e=e.substring(r.raw.length),t.push(r),!0)))))if(r=this.tokenizer.escape(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.tag(e))e=e.substring(r.raw.length),n=t[t.length-1],n&&"text"===r.type&&"text"===n.type?(n.raw+=r.raw,n.text+=r.text):t.push(r);else if(r=this.tokenizer.link(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.reflink(e,this.tokens.links))e=e.substring(r.raw.length),n=t[t.length-1],n&&"text"===r.type&&"text"===n.type?(n.raw+=r.raw,n.text+=r.text):t.push(r);else if(r=this.tokenizer.emStrong(e,l,s))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.codespan(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.br(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.del(e))e=e.substring(r.raw.length),t.push(r);else if(r=this.tokenizer.autolink(e,Pt))e=e.substring(r.raw.length),t.push(r);else if(this.state.inLink||!(r=this.tokenizer.url(e,Pt))){if(o=e,this.options.extensions&&this.options.extensions.startInline){let t=1/0;const r=e.slice(1);let n;this.options.extensions.startInline.forEach((function(e){n=e.call({lexer:this},r),"number"==typeof n&&n>=0&&(t=Math.min(t,n))})),t<1/0&&t>=0&&(o=e.substring(0,t+1))}if(r=this.tokenizer.inlineText(o,It))e=e.substring(r.raw.length),"_"!==r.raw.slice(-1)&&(s=r.raw.slice(-1)),i=!0,n=t[t.length-1],n&&"text"===n.type?(n.raw+=r.raw,n.text+=r.text):t.push(r);else if(e){const t="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(t);break}throw new Error(t)}}else e=e.substring(r.raw.length),t.push(r);return t}}class Lt{constructor(e){this.options=e||nt}code(e,t,r){const n=(t||"").match(/\S*/)[0];if(this.options.highlight){const t=this.options.highlight(e,n);null!=t&&t!==e&&(r=!0,e=t)}return e=e.replace(/\n$/,"")+"\n",n?'<pre><code class="'+this.options.langPrefix+pt(n)+'">'+(r?e:pt(e,!0))+"</code></pre>\n":"<pre><code>"+(r?e:pt(e,!0))+"</code></pre>\n"}blockquote(e){return`<blockquote>\n${e}</blockquote>\n`}html(e){return e}heading(e,t,r,n){if(this.options.headerIds){return`<h${t} id="${this.options.headerPrefix+n.slug(r)}">${e}</h${t}>\n`}return`<h${t}>${e}</h${t}>\n`}hr(){return this.options.xhtml?"<hr/>\n":"<hr>\n"}list(e,t,r){const n=t?"ol":"ul";return"<"+n+(t&&1!==r?' start="'+r+'"':"")+">\n"+e+"</"+n+">\n"}listitem(e){return`<li>${e}</li>\n`}checkbox(e){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox"'+(this.options.xhtml?" /":"")+"> "}paragraph(e){return`<p>${e}</p>\n`}table(e,t){return t&&(t=`<tbody>${t}</tbody>`),"<table>\n<thead>\n"+e+"</thead>\n"+t+"</table>\n"}tablerow(e){return`<tr>\n${e}</tr>\n`}tablecell(e,t){const r=t.header?"th":"td";return(t.align?`<${r} align="${t.align}">`:`<${r}>`)+e+`</${r}>\n`}strong(e){return`<strong>${e}</strong>`}em(e){return`<em>${e}</em>`}codespan(e){return`<code>${e}</code>`}br(){return this.options.xhtml?"<br/>":"<br>"}del(e){return`<del>${e}</del>`}link(e,t,r){if(null===(e=gt(this.options.sanitize,this.options.baseUrl,e)))return r;let n='<a href="'+e+'"';return t&&(n+=' title="'+t+'"'),n+=">"+r+"</a>",n}image(e,t,r){if(null===(e=gt(this.options.sanitize,this.options.baseUrl,e)))return r;let n=`<img src="${e}" alt="${r}"`;return t&&(n+=` title="${t}"`),n+=this.options.xhtml?"/>":">",n}text(e){return e}}class Nt{strong(e){return e}em(e){return e}codespan(e){return e}del(e){return e}html(e){return e}text(e){return e}link(e,t,r){return""+r}image(e,t,r){return""+r}br(){return""}}class Dt{constructor(){this.seen={}}serialize(e){return e.toLowerCase().trim().replace(/<[!\/a-z].*?>/gi,"").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g,"").replace(/\s/g,"-")}getNextSafeSlug(e,t){let r=e,n=0;if(this.seen.hasOwnProperty(r)){n=this.seen[e];do{n++,r=e+"-"+n}while(this.seen.hasOwnProperty(r))}return t||(this.seen[e]=n,this.seen[r]=0),r}slug(e,t={}){const r=this.serialize(e);return this.getNextSafeSlug(r,t.dryrun)}}class Ft{constructor(e){this.options=e||nt,this.options.renderer=this.options.renderer||new Lt,this.renderer=this.options.renderer,this.renderer.options=this.options,this.textRenderer=new Nt,this.slugger=new Dt}static parse(e,t){return new Ft(t).parse(e)}static parseInline(e,t){return new Ft(t).parseInline(e)}parse(e,t=!0){let r,n,o,a,i,s,l,c,p,d,u,h,f,m,y,g,v,b,x,w="";const $=e.length;for(r=0;r<$;r++)if(d=e[r],this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[d.type]&&(x=this.options.extensions.renderers[d.type].call({parser:this},d),!1!==x||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(d.type)))w+=x||"";else switch(d.type){case"space":continue;case"hr":w+=this.renderer.hr();continue;case"heading":w+=this.renderer.heading(this.parseInline(d.tokens),d.depth,ut(this.parseInline(d.tokens,this.textRenderer)),this.slugger);continue;case"code":w+=this.renderer.code(d.text,d.lang,d.escaped);continue;case"table":for(c="",l="",a=d.header.length,n=0;n<a;n++)l+=this.renderer.tablecell(this.parseInline(d.header[n].tokens),{header:!0,align:d.align[n]});for(c+=this.renderer.tablerow(l),p="",a=d.rows.length,n=0;n<a;n++){for(s=d.rows[n],l="",i=s.length,o=0;o<i;o++)l+=this.renderer.tablecell(this.parseInline(s[o].tokens),{header:!1,align:d.align[o]});p+=this.renderer.tablerow(l)}w+=this.renderer.table(c,p);continue;case"blockquote":p=this.parse(d.tokens),w+=this.renderer.blockquote(p);continue;case"list":for(u=d.ordered,h=d.start,f=d.loose,a=d.items.length,p="",n=0;n<a;n++)y=d.items[n],g=y.checked,v=y.task,m="",y.task&&(b=this.renderer.checkbox(g),f?y.tokens.length>0&&"paragraph"===y.tokens[0].type?(y.tokens[0].text=b+" "+y.tokens[0].text,y.tokens[0].tokens&&y.tokens[0].tokens.length>0&&"text"===y.tokens[0].tokens[0].type&&(y.tokens[0].tokens[0].text=b+" "+y.tokens[0].tokens[0].text)):y.tokens.unshift({type:"text",text:b}):m+=b),m+=this.parse(y.tokens,f),p+=this.renderer.listitem(m,v,g);w+=this.renderer.list(p,u,h);continue;case"html":w+=this.renderer.html(d.text);continue;case"paragraph":w+=this.renderer.paragraph(this.parseInline(d.tokens));continue;case"text":for(p=d.tokens?this.parseInline(d.tokens):d.text;r+1<$&&"text"===e[r+1].type;)d=e[++r],p+="\n"+(d.tokens?this.parseInline(d.tokens):d.text);w+=t?this.renderer.paragraph(p):p;continue;default:{const e='Token with "'+d.type+'" type was not found.';if(this.options.silent)return void console.error(e);throw new Error(e)}}return w}parseInline(e,t){t=t||this.renderer;let r,n,o,a="";const i=e.length;for(r=0;r<i;r++)if(n=e[r],this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[n.type]&&(o=this.options.extensions.renderers[n.type].call({parser:this},n),!1!==o||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(n.type)))a+=o||"";else switch(n.type){case"escape":case"text":a+=t.text(n.text);break;case"html":a+=t.html(n.text);break;case"link":a+=t.link(n.href,n.title,this.parseInline(n.tokens,t));break;case"image":a+=t.image(n.href,n.title,n.text);break;case"strong":a+=t.strong(this.parseInline(n.tokens,t));break;case"em":a+=t.em(this.parseInline(n.tokens,t));break;case"codespan":a+=t.codespan(n.text);break;case"br":a+=t.br();break;case"del":a+=t.del(this.parseInline(n.tokens,t));break;default:{const e='Token with "'+n.type+'" type was not found.';if(this.options.silent)return void console.error(e);throw new Error(e)}}return a}}function Ut(e,t,r){if(null==e)throw new Error("marked(): input parameter is undefined or null");if("string"!=typeof e)throw new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected");if("function"==typeof t&&(r=t,t=null),Et(t=kt({},Ut.defaults,t||{})),r){const n=t.highlight;let o;try{o=Rt.lex(e,t)}catch(e){return r(e)}const a=function(e){let a;if(!e)try{t.walkTokens&&Ut.walkTokens(o,t.walkTokens),a=Ft.parse(o,t)}catch(t){e=t}return t.highlight=n,e?r(e):r(null,a)};if(!n||n.length<3)return a();if(delete t.highlight,!o.length)return a();let i=0;return Ut.walkTokens(o,(function(e){"code"===e.type&&(i++,setTimeout((()=>{n(e.text,e.lang,(function(t,r){if(t)return a(t);null!=r&&r!==e.text&&(e.text=r,e.escaped=!0),i--,0===i&&a()}))}),0))})),void(0===i&&a())}function n(e){if(e.message+="\nPlease report this to https://github.com/markedjs/marked.",t.silent)return"<p>An error occurred:</p><pre>"+pt(e.message+"",!0)+"</pre>";throw e}try{const r=Rt.lex(e,t);if(t.walkTokens){if(t.async)return Promise.all(Ut.walkTokens(r,t.walkTokens)).then((()=>Ft.parse(r,t))).catch(n);Ut.walkTokens(r,t.walkTokens)}return Ft.parse(r,t)}catch(e){n(e)}}Ut.options=Ut.setOptions=function(e){var t;return kt(Ut.defaults,e),t=Ut.defaults,nt=t,Ut},Ut.getDefaults=rt,Ut.defaults=nt,Ut.use=function(...e){const t=Ut.defaults.extensions||{renderers:{},childTokens:{}};e.forEach((e=>{const r=kt({},e);if(r.async=Ut.defaults.async||r.async,e.extensions&&(e.extensions.forEach((e=>{if(!e.name)throw new Error("extension name required");if(e.renderer){const r=t.renderers[e.name];t.renderers[e.name]=r?function(...t){let n=e.renderer.apply(this,t);return!1===n&&(n=r.apply(this,t)),n}:e.renderer}if(e.tokenizer){if(!e.level||"block"!==e.level&&"inline"!==e.level)throw new Error("extension level must be 'block' or 'inline'");t[e.level]?t[e.level].unshift(e.tokenizer):t[e.level]=[e.tokenizer],e.start&&("block"===e.level?t.startBlock?t.startBlock.push(e.start):t.startBlock=[e.start]:"inline"===e.level&&(t.startInline?t.startInline.push(e.start):t.startInline=[e.start]))}e.childTokens&&(t.childTokens[e.name]=e.childTokens)})),r.extensions=t),e.renderer){const t=Ut.defaults.renderer||new Lt;for(const r in e.renderer){const n=t[r];t[r]=(...o)=>{let a=e.renderer[r].apply(t,o);return!1===a&&(a=n.apply(t,o)),a}}r.renderer=t}if(e.tokenizer){const t=Ut.defaults.tokenizer||new Ct;for(const r in e.tokenizer){const n=t[r];t[r]=(...o)=>{let a=e.tokenizer[r].apply(t,o);return!1===a&&(a=n.apply(t,o)),a}}r.tokenizer=t}if(e.walkTokens){const t=Ut.defaults.walkTokens;r.walkTokens=function(r){let n=[];return n.push(e.walkTokens.call(this,r)),t&&(n=n.concat(t.call(this,r))),n}}Ut.setOptions(r)}))},Ut.walkTokens=function(e,t){let r=[];for(const n of e)switch(r=r.concat(t.call(Ut,n)),n.type){case"table":for(const e of n.header)r=r.concat(Ut.walkTokens(e.tokens,t));for(const e of n.rows)for(const n of e)r=r.concat(Ut.walkTokens(n.tokens,t));break;case"list":r=r.concat(Ut.walkTokens(n.items,t));break;default:Ut.defaults.extensions&&Ut.defaults.extensions.childTokens&&Ut.defaults.extensions.childTokens[n.type]?Ut.defaults.extensions.childTokens[n.type].forEach((function(e){r=r.concat(Ut.walkTokens(n[e],t))})):n.tokens&&(r=r.concat(Ut.walkTokens(n.tokens,t)))}return r},Ut.parseInline=function(e,t){if(null==e)throw new Error("marked.parseInline(): input parameter is undefined or null");if("string"!=typeof e)throw new Error("marked.parseInline(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected");Et(t=kt({},Ut.defaults,t||{}));try{const r=Rt.lexInline(e,t);return t.walkTokens&&Ut.walkTokens(r,t.walkTokens),Ft.parseInline(r,t)}catch(e){if(e.message+="\nPlease report this to https://github.com/markedjs/marked.",t.silent)return"<p>An error occurred:</p><pre>"+pt(e.message+"",!0)+"</pre>";throw e}},Ut.Parser=Ft,Ut.parser=Ft.parse,Ut.Renderer=Lt,Ut.TextRenderer=Nt,Ut.Lexer=Rt,Ut.lexer=Rt.lex,Ut.Tokenizer=Ct,Ut.Slugger=Dt,Ut.parse=Ut;Ut.options,Ut.setOptions,Ut.use,Ut.walkTokens,Ut.parseInline,Ft.parse,Rt.lex;var Bt=r(660),qt=r.n(Bt);r(251),r(358),r(46),r(503),r(277),r(874),r(366),r(57),r(16);const zt=ie`
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
`,Mt=ie`
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
}`,Ht=ie`
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
`,Wt=ie`
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
`,Vt=ie`
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

.req-resp-container {
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
`,Gt=ie`
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
`,Kt=ie`
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
`,Jt=ie`
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
`,Yt=ie`
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
`,Zt=ie`

`;const Qt=/[\s#:?&={}]/g,Xt="_rapidoc_api_key";function er(e){return new Promise((t=>setTimeout(t,e)))}function tr(e,t){const r=t.target,n=document.createElement("textarea");n.value=e,n.style.position="fixed",document.body.appendChild(n),n.focus(),n.select();try{document.execCommand("copy"),r.innerText="Copied",setTimeout((()=>{r.innerText="Copy"}),5e3)}catch(e){console.error("Unable to copy",e)}document.body.removeChild(n)}function rr(e,t,r="includes"){if("includes"===r){return`${t.method} ${t.path} ${t.summary||t.description||""} ${t.operationId||""}`.toLowerCase().includes(e.toLowerCase())}return new RegExp(e,"i").test(`${t.method} ${t.path}`)}function nr(e,t=new Set){return e?(Object.keys(e).forEach((r=>{var n;if(t.add(r),e[r].properties)nr(e[r].properties,t);else if(null!==(n=e[r].items)&&void 0!==n&&n.properties){var o;nr(null===(o=e[r].items)||void 0===o?void 0:o.properties,t)}})),t):t}function or(e,t){if(e){const r=document.createElement("a");document.body.appendChild(r),r.style="display: none",r.href=e,r.download=t,r.click(),r.remove()}}function ar(e){if(e){const t=document.createElement("a");document.body.appendChild(t),t.style="display: none",t.href=e,t.target="_blank",t.click(),t.remove()}}function ir(e){return e&&e.t&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var sr=function(e){return e&&e.Math==Math&&e},lr=sr("object"==typeof globalThis&&globalThis)||sr("object"==typeof window&&window)||sr("object"==typeof self&&self)||sr("object"==typeof lr&&lr)||function(){return this}()||Function("return this")(),cr=function(e){try{return!!e()}catch(e){return!0}},pr=!cr((function(){var e=function(){}.bind();return"function"!=typeof e||e.hasOwnProperty("prototype")})),dr=pr,ur=Function.prototype,hr=ur.apply,fr=ur.call,mr="object"==typeof Reflect&&Reflect.apply||(dr?fr.bind(hr):function(){return fr.apply(hr,arguments)}),yr=pr,gr=Function.prototype,vr=gr.bind,br=gr.call,xr=yr&&vr.bind(br,br),wr=yr?function(e){return e&&xr(e)}:function(e){return e&&function(){return br.apply(e,arguments)}},$r=function(e){return"function"==typeof e},kr={},Sr=!cr((function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]})),Ar=pr,Er=Function.prototype.call,Or=Ar?Er.bind(Er):function(){return Er.apply(Er,arguments)},Tr={},Cr={}.propertyIsEnumerable,_r=Object.getOwnPropertyDescriptor,jr=_r&&!Cr.call({1:2},1);Tr.f=jr?function(e){var t=_r(this,e);return!!t&&t.enumerable}:Cr;var Ir,Pr,Rr=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}},Lr=wr,Nr=Lr({}.toString),Dr=Lr("".slice),Fr=function(e){return Dr(Nr(e),8,-1)},Ur=wr,Br=cr,qr=Fr,zr=lr.Object,Mr=Ur("".split),Hr=Br((function(){return!zr("z").propertyIsEnumerable(0)}))?function(e){return"String"==qr(e)?Mr(e,""):zr(e)}:zr,Wr=lr.TypeError,Vr=function(e){if(null==e)throw Wr("Can't call method on "+e);return e},Gr=Hr,Kr=Vr,Jr=function(e){return Gr(Kr(e))},Yr=$r,Zr=function(e){return"object"==typeof e?null!==e:Yr(e)},Qr={},Xr=Qr,en=lr,tn=$r,rn=function(e){return tn(e)?e:void 0},nn=function(e,t){return arguments.length<2?rn(Xr[e])||rn(en[e]):Xr[e]&&Xr[e][t]||en[e]&&en[e][t]},on=wr({}.isPrototypeOf),an=nn("navigator","userAgent")||"",sn=lr,ln=an,cn=sn.process,pn=sn.Deno,dn=cn&&cn.versions||pn&&pn.version,un=dn&&dn.v8;un&&(Pr=(Ir=un.split("."))[0]>0&&Ir[0]<4?1:+(Ir[0]+Ir[1])),!Pr&&ln&&(!(Ir=ln.match(/Edge\/(\d+)/))||Ir[1]>=74)&&(Ir=ln.match(/Chrome\/(\d+)/))&&(Pr=+Ir[1]);var hn=Pr,fn=hn,mn=cr,yn=!!Object.getOwnPropertySymbols&&!mn((function(){var e=Symbol();return!String(e)||!(Object(e)instanceof Symbol)||!Symbol.sham&&fn&&fn<41})),gn=yn&&!Symbol.sham&&"symbol"==typeof Symbol.iterator,vn=nn,bn=$r,xn=on,wn=gn,$n=lr.Object,kn=wn?function(e){return"symbol"==typeof e}:function(e){var t=vn("Symbol");return bn(t)&&xn(t.prototype,$n(e))},Sn=lr.String,An=function(e){try{return Sn(e)}catch(e){return"Object"}},En=$r,On=An,Tn=lr.TypeError,Cn=function(e){if(En(e))return e;throw Tn(On(e)+" is not a function")},_n=Cn,jn=function(e,t){var r=e[t];return null==r?void 0:_n(r)},In=Or,Pn=$r,Rn=Zr,Ln=lr.TypeError,Nn={exports:{}},Dn=lr,Fn=Object.defineProperty,Un=lr.i||function(e,t){try{Fn(Dn,e,{value:t,configurable:!0,writable:!0})}catch(r){Dn[e]=t}return t}("__core-js_shared__",{}),Bn=Un;(Nn.exports=function(e,t){return Bn[e]||(Bn[e]=void 0!==t?t:{})})("versions",[]).push({version:"3.21.1",mode:"pure",copyright:"© 2014-2022 Denis Pushkarev (zloirock.ru)",license:"https://github.com/zloirock/core-js/blob/v3.21.1/LICENSE",source:"https://github.com/zloirock/core-js"});var qn=Vr,zn=lr.Object,Mn=function(e){return zn(qn(e))},Hn=Mn,Wn=wr({}.hasOwnProperty),Vn=Object.hasOwn||function(e,t){return Wn(Hn(e),t)},Gn=wr,Kn=0,Jn=Math.random(),Yn=Gn(1..toString),Zn=function(e){return"Symbol("+(void 0===e?"":e)+")_"+Yn(++Kn+Jn,36)},Qn=lr,Xn=Nn.exports,eo=Vn,to=Zn,ro=yn,no=gn,oo=Xn("wks"),ao=Qn.Symbol,io=ao&&ao.for,so=no?ao:ao&&ao.withoutSetter||to,lo=function(e){if(!eo(oo,e)||!ro&&"string"!=typeof oo[e]){var t="Symbol."+e;ro&&eo(ao,e)?oo[e]=ao[e]:oo[e]=no&&io?io(t):so(t)}return oo[e]},co=Or,po=Zr,uo=kn,ho=jn,fo=lo,mo=lr.TypeError,yo=fo("toPrimitive"),go=function(e,t){if(!po(e)||uo(e))return e;var r,n=ho(e,yo);if(n){if(void 0===t&&(t="default"),r=co(n,e,t),!po(r)||uo(r))return r;throw mo("Can't convert object to primitive value")}return void 0===t&&(t="number"),function(e,t){var r,n;if("string"===t&&Pn(r=e.toString)&&!Rn(n=In(r,e)))return n;if(Pn(r=e.valueOf)&&!Rn(n=In(r,e)))return n;if("string"!==t&&Pn(r=e.toString)&&!Rn(n=In(r,e)))return n;throw Ln("Can't convert object to primitive value")}(e,t)},vo=kn,bo=function(e){var t=go(e,"string");return vo(t)?t:t+""},xo=Zr,wo=lr.document,$o=xo(wo)&&xo(wo.createElement),ko=function(e){return $o?wo.createElement(e):{}},So=ko,Ao=!Sr&&!cr((function(){return 7!=Object.defineProperty(So("div"),"a",{get:function(){return 7}}).a})),Eo=Sr,Oo=Or,To=Tr,Co=Rr,_o=Jr,jo=bo,Io=Vn,Po=Ao,Ro=Object.getOwnPropertyDescriptor;kr.f=Eo?Ro:function(e,t){if(e=_o(e),t=jo(t),Po)try{return Ro(e,t)}catch(e){}if(Io(e,t))return Co(!Oo(To.f,e,t),e[t])};var Lo=cr,No=$r,Do=/#|\.prototype\./,Fo=function(e,t){var r=Bo[Uo(e)];return r==zo||r!=qo&&(No(t)?Lo(t):!!t)},Uo=Fo.normalize=function(e){return String(e).replace(Do,".").toLowerCase()},Bo=Fo.data={},qo=Fo.NATIVE="N",zo=Fo.POLYFILL="P",Mo=Fo,Ho=Cn,Wo=pr,Vo=wr(wr.bind),Go=function(e,t){return Ho(e),void 0===t?e:Wo?Vo(e,t):function(){return e.apply(t,arguments)}},Ko={},Jo=Sr&&cr((function(){return 42!=Object.defineProperty((function(){}),"prototype",{value:42,writable:!1}).prototype})),Yo=lr,Zo=Zr,Qo=Yo.String,Xo=Yo.TypeError,ea=function(e){if(Zo(e))return e;throw Xo(Qo(e)+" is not an object")},ta=Sr,ra=Ao,na=Jo,oa=ea,aa=bo,ia=lr.TypeError,sa=Object.defineProperty,la=Object.getOwnPropertyDescriptor;Ko.f=ta?na?function(e,t,r){if(oa(e),t=aa(t),oa(r),"function"==typeof e&&"prototype"===t&&"value"in r&&"writable"in r&&!r.writable){var n=la(e,t);n&&n.writable&&(e[t]=r.value,r={configurable:"configurable"in r?r.configurable:n.configurable,enumerable:"enumerable"in r?r.enumerable:n.enumerable,writable:!1})}return sa(e,t,r)}:sa:function(e,t,r){if(oa(e),t=aa(t),oa(r),ra)try{return sa(e,t,r)}catch(e){}if("get"in r||"set"in r)throw ia("Accessors not supported");return"value"in r&&(e[t]=r.value),e};var ca=Ko,pa=Rr,da=Sr?function(e,t,r){return ca.f(e,t,pa(1,r))}:function(e,t,r){return e[t]=r,e},ua=lr,ha=mr,fa=wr,ma=$r,ya=kr.f,ga=Mo,va=Qr,ba=Go,xa=da,wa=Vn,$a=function(e){var t=function(r,n,o){if(this instanceof t){switch(arguments.length){case 0:return new e;case 1:return new e(r);case 2:return new e(r,n)}return new e(r,n,o)}return ha(e,this,arguments)};return t.prototype=e.prototype,t},ka=function(e,t){var r,n,o,a,i,s,l,c,p=e.target,d=e.global,u=e.stat,h=e.proto,f=d?ua:u?ua[p]:(ua[p]||{}).prototype,m=d?va:va[p]||xa(va,p,{})[p],y=m.prototype;for(o in t)r=!ga(d?o:p+(u?".":"#")+o,e.forced)&&f&&wa(f,o),i=m[o],r&&(s=e.noTargetGet?(c=ya(f,o))&&c.value:f[o]),a=r&&s?s:t[o],r&&typeof i==typeof a||(l=e.bind&&r?ba(a,ua):e.wrap&&r?$a(a):h&&ma(a)?fa(a):a,(e.sham||a&&a.sham||i&&i.sham)&&xa(l,"sham",!0),xa(m,o,l),h&&(wa(va,n=p+"Prototype")||xa(va,n,{}),xa(va[n],o,a),e.real&&y&&!y[o]&&xa(y,o,a)))},Sa=Math.ceil,Aa=Math.floor,Ea=function(e){var t=+e;return t!=t||0===t?0:(t>0?Aa:Sa)(t)},Oa=Ea,Ta=Math.max,Ca=Math.min,_a=function(e,t){var r=Oa(e);return r<0?Ta(r+t,0):Ca(r,t)},ja=Ea,Ia=Math.min,Pa=function(e){return e>0?Ia(ja(e),9007199254740991):0},Ra=Pa,La=function(e){return Ra(e.length)},Na=Jr,Da=_a,Fa=La,Ua=function(e){return function(t,r,n){var o,a=Na(t),i=Fa(a),s=Da(n,i);if(e&&r!=r){for(;i>s;)if((o=a[s++])!=o)return!0}else for(;i>s;s++)if((e||s in a)&&a[s]===r)return e||s||0;return!e&&-1}},Ba={includes:Ua(!0),indexOf:Ua(!1)},qa={},za=Vn,Ma=Jr,Ha=Ba.indexOf,Wa=qa,Va=wr([].push),Ga=function(e,t){var r,n=Ma(e),o=0,a=[];for(r in n)!za(Wa,r)&&za(n,r)&&Va(a,r);for(;t.length>o;)za(n,r=t[o++])&&(~Ha(a,r)||Va(a,r));return a},Ka=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"],Ja=Ga,Ya=Ka,Za=Object.keys||function(e){return Ja(e,Ya)},Qa=Mn,Xa=Za;ka({target:"Object",stat:!0,forced:cr((function(){Xa(1)}))},{keys:function(e){return Xa(Qa(e))}});var ei=Qr.Object.keys;const ti=ir({exports:{}}.exports=ei);var ri=Fr,ni=Array.isArray||function(e){return"Array"==ri(e)},oi={};oi[lo("toStringTag")]="z";var ai="[object z]"===String(oi),ii=lr,si=ai,li=$r,ci=Fr,pi=lo("toStringTag"),di=ii.Object,ui="Arguments"==ci(function(){return arguments}()),hi=si?ci:function(e){var t,r,n;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(r=function(e,t){try{return e[t]}catch(e){}}(t=di(e),pi))?r:ui?ci(t):"Object"==(n=ci(t))&&li(t.callee)?"Arguments":n},fi=hi,mi=lr.String,yi=function(e){if("Symbol"===fi(e))throw TypeError("Cannot convert a Symbol value to a string");return mi(e)},gi={},vi=Sr,bi=Jo,xi=Ko,wi=ea,$i=Jr,ki=Za;gi.f=vi&&!bi?Object.defineProperties:function(e,t){wi(e);for(var r,n=$i(t),o=ki(t),a=o.length,i=0;a>i;)xi.f(e,r=o[i++],n[r]);return e};var Si,Ai=nn("document","documentElement"),Ei=Nn.exports,Oi=Zn,Ti=Ei("keys"),Ci=function(e){return Ti[e]||(Ti[e]=Oi(e))},_i=ea,ji=gi,Ii=Ka,Pi=qa,Ri=Ai,Li=ko,Ni=Ci("IE_PROTO"),Di=function(){},Fi=function(e){return"<script>"+e+"<\/script>"},Ui=function(e){e.write(Fi("")),e.close();var t=e.parentWindow.Object;return e=null,t},Bi=function(){try{Si=new ActiveXObject("htmlfile")}catch(e){}var e,t;Bi="undefined"!=typeof document?document.domain&&Si?Ui(Si):((t=Li("iframe")).style.display="none",Ri.appendChild(t),t.src=String("javascript:"),(e=t.contentWindow.document).open(),e.write(Fi("document.F=Object")),e.close(),e.F):Ui(Si);for(var r=Ii.length;r--;)delete Bi.prototype[Ii[r]];return Bi()};Pi[Ni]=!0;var qi=Object.create||function(e,t){var r;return null!==e?(Di.prototype=_i(e),r=new Di,Di.prototype=null,r[Ni]=e):r=Bi(),void 0===t?r:ji.f(r,t)},zi={},Mi=Ga,Hi=Ka.concat("length","prototype");zi.f=Object.getOwnPropertyNames||function(e){return Mi(e,Hi)};var Wi={},Vi=bo,Gi=Ko,Ki=Rr,Ji=function(e,t,r){var n=Vi(t);n in e?Gi.f(e,n,Ki(0,r)):e[n]=r},Yi=_a,Zi=La,Qi=Ji,Xi=lr.Array,es=Math.max,ts=function(e,t,r){for(var n=Zi(e),o=Yi(t,n),a=Yi(void 0===r?n:r,n),i=Xi(es(a-o,0)),s=0;o<a;o++,s++)Qi(i,s,e[o]);return i.length=s,i},rs=Fr,ns=Jr,os=zi.f,as=ts,is="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[];Wi.f=function(e){return is&&"Window"==rs(e)?function(e){try{return os(e)}catch(e){return as(is)}}(e):os(ns(e))};var ss={};ss.f=Object.getOwnPropertySymbols;var ls=wr([].slice),cs=da,ps=function(e,t,r,n){n&&n.enumerable?e[t]=r:cs(e,t,r)},ds={},us=lo;ds.f=us;var hs=Qr,fs=Vn,ms=ds,ys=Ko.f,gs=function(e){var t=hs.Symbol||(hs.Symbol={});fs(t,e)||ys(t,e,{value:ms.f(e)})},vs=hi,bs=ai?{}.toString:function(){return"[object "+vs(this)+"]"},xs=ai,ws=Ko.f,$s=da,ks=Vn,Ss=bs,As=lo("toStringTag"),Es=function(e,t,r,n){if(e){var o=r?e:e.prototype;ks(o,As)||ws(o,As,{configurable:!0,value:t}),n&&!xs&&$s(o,"toString",Ss)}},Os=$r,Ts=Un,Cs=wr(Function.toString);Os(Ts.inspectSource)||(Ts.inspectSource=function(e){return Cs(e)});var _s,js,Is,Ps=Ts.inspectSource,Rs=$r,Ls=Ps,Ns=lr.WeakMap,Ds=Rs(Ns)&&/native code/.test(Ls(Ns)),Fs=Ds,Us=lr,Bs=wr,qs=Zr,zs=da,Ms=Vn,Hs=Un,Ws=Ci,Vs=qa,Gs=Us.TypeError,Ks=Us.WeakMap;if(Fs||Hs.state){var Js=Hs.state||(Hs.state=new Ks),Ys=Bs(Js.get),Zs=Bs(Js.has),Qs=Bs(Js.set);_s=function(e,t){if(Zs(Js,e))throw new Gs("Object already initialized");return t.facade=e,Qs(Js,e,t),t},js=function(e){return Ys(Js,e)||{}},Is=function(e){return Zs(Js,e)}}else{var Xs=Ws("state");Vs[Xs]=!0,_s=function(e,t){if(Ms(e,Xs))throw new Gs("Object already initialized");return t.facade=e,zs(e,Xs,t),t},js=function(e){return Ms(e,Xs)?e[Xs]:{}},Is=function(e){return Ms(e,Xs)}}var el={set:_s,get:js,has:Is,enforce:function(e){return Is(e)?js(e):_s(e,{})},getterFor:function(e){return function(t){var r;if(!qs(t)||(r=js(t)).type!==e)throw Gs("Incompatible receiver, "+e+" required");return r}}},tl=wr,rl=cr,nl=$r,ol=hi,al=Ps,il=function(){},sl=[],ll=nn("Reflect","construct"),cl=/^\s*(?:class|function)\b/,pl=tl(cl.exec),dl=!cl.exec(il),ul=function(e){if(!nl(e))return!1;try{return ll(il,sl,e),!0}catch(e){return!1}},hl=function(e){if(!nl(e))return!1;switch(ol(e)){case"AsyncFunction":case"GeneratorFunction":case"AsyncGeneratorFunction":return!1}try{return dl||!!pl(cl,al(e))}catch(e){return!0}};hl.sham=!0;var fl=!ll||rl((function(){var e;return ul(ul.call)||!ul(Object)||!ul((function(){e=!0}))||e}))?hl:ul,ml=lr,yl=ni,gl=fl,vl=Zr,bl=lo("species"),xl=ml.Array,wl=function(e,t){return new(function(e){var t;return yl(e)&&(t=e.constructor,(gl(t)&&(t===xl||yl(t.prototype))||vl(t)&&null===(t=t[bl]))&&(t=void 0)),void 0===t?xl:t}(e))(0===t?0:t)},$l=Go,kl=Hr,Sl=Mn,Al=La,El=wl,Ol=wr([].push),Tl=function(e){var t=1==e,r=2==e,n=3==e,o=4==e,a=6==e,i=7==e,s=5==e||a;return function(l,c,p,d){for(var u,h,f=Sl(l),m=kl(f),y=$l(c,p),g=Al(m),v=0,b=d||El,x=t?b(l,g):r||i?b(l,0):void 0;g>v;v++)if((s||v in m)&&(h=y(u=m[v],v,f),e))if(t)x[v]=h;else if(h)switch(e){case 3:return!0;case 5:return u;case 6:return v;case 2:Ol(x,u)}else switch(e){case 4:return!1;case 7:Ol(x,u)}return a?-1:n||o?o:x}},Cl={forEach:Tl(0),map:Tl(1),filter:Tl(2),some:Tl(3),every:Tl(4),find:Tl(5),findIndex:Tl(6),filterReject:Tl(7)},_l=ka,jl=lr,Il=nn,Pl=mr,Rl=Or,Ll=wr,Nl=Sr,Dl=yn,Fl=cr,Ul=Vn,Bl=ni,ql=$r,zl=Zr,Ml=on,Hl=kn,Wl=ea,Vl=Mn,Gl=Jr,Kl=bo,Jl=yi,Yl=Rr,Zl=qi,Ql=Za,Xl=zi,ec=Wi,tc=ss,rc=kr,nc=Ko,oc=gi,ac=Tr,ic=ls,sc=ps,lc=Nn.exports,cc=qa,pc=Zn,dc=lo,uc=ds,hc=gs,fc=Es,mc=el,yc=Cl.forEach,gc=Ci("hidden"),vc=dc("toPrimitive"),bc=mc.set,xc=mc.getterFor("Symbol"),wc=Object.prototype,$c=jl.Symbol,kc=$c&&$c.prototype,Sc=jl.TypeError,Ac=jl.QObject,Ec=Il("JSON","stringify"),Oc=rc.f,Tc=nc.f,Cc=ec.f,_c=ac.f,jc=Ll([].push),Ic=lc("symbols"),Pc=lc("op-symbols"),Rc=lc("string-to-symbol-registry"),Lc=lc("symbol-to-string-registry"),Nc=lc("wks"),Dc=!Ac||!Ac.prototype||!Ac.prototype.findChild,Fc=Nl&&Fl((function(){return 7!=Zl(Tc({},"a",{get:function(){return Tc(this,"a",{value:7}).a}})).a}))?function(e,t,r){var n=Oc(wc,t);n&&delete wc[t],Tc(e,t,r),n&&e!==wc&&Tc(wc,t,n)}:Tc,Uc=function(e,t){var r=Ic[e]=Zl(kc);return bc(r,{type:"Symbol",tag:e,description:t}),Nl||(r.description=t),r},Bc=function(e,t,r){e===wc&&Bc(Pc,t,r),Wl(e);var n=Kl(t);return Wl(r),Ul(Ic,n)?(r.enumerable?(Ul(e,gc)&&e[gc][n]&&(e[gc][n]=!1),r=Zl(r,{enumerable:Yl(0,!1)})):(Ul(e,gc)||Tc(e,gc,Yl(1,{})),e[gc][n]=!0),Fc(e,n,r)):Tc(e,n,r)},qc=function(e,t){Wl(e);var r=Gl(t),n=Ql(r).concat(Wc(r));return yc(n,(function(t){Nl&&!Rl(zc,r,t)||Bc(e,t,r[t])})),e},zc=function(e){var t=Kl(e),r=Rl(_c,this,t);return!(this===wc&&Ul(Ic,t)&&!Ul(Pc,t))&&(!(r||!Ul(this,t)||!Ul(Ic,t)||Ul(this,gc)&&this[gc][t])||r)},Mc=function(e,t){var r=Gl(e),n=Kl(t);if(r!==wc||!Ul(Ic,n)||Ul(Pc,n)){var o=Oc(r,n);return!o||!Ul(Ic,n)||Ul(r,gc)&&r[gc][n]||(o.enumerable=!0),o}},Hc=function(e){var t=Cc(Gl(e)),r=[];return yc(t,(function(e){Ul(Ic,e)||Ul(cc,e)||jc(r,e)})),r},Wc=function(e){var t=e===wc,r=Cc(t?Pc:Gl(e)),n=[];return yc(r,(function(e){!Ul(Ic,e)||t&&!Ul(wc,e)||jc(n,Ic[e])})),n};(Dl||(sc(kc=($c=function(){if(Ml(kc,this))throw Sc("Symbol is not a constructor");var e=arguments.length&&void 0!==arguments[0]?Jl(arguments[0]):void 0,t=pc(e),r=function(e){this===wc&&Rl(r,Pc,e),Ul(this,gc)&&Ul(this[gc],t)&&(this[gc][t]=!1),Fc(this,t,Yl(1,e))};return Nl&&Dc&&Fc(wc,t,{configurable:!0,set:r}),Uc(t,e)}).prototype,"toString",(function(){return xc(this).tag})),sc($c,"withoutSetter",(function(e){return Uc(pc(e),e)})),ac.f=zc,nc.f=Bc,oc.f=qc,rc.f=Mc,Xl.f=ec.f=Hc,tc.f=Wc,uc.f=function(e){return Uc(dc(e),e)},Nl&&Tc(kc,"description",{configurable:!0,get:function(){return xc(this).description}})),_l({global:!0,wrap:!0,forced:!Dl,sham:!Dl},{Symbol:$c}),yc(Ql(Nc),(function(e){hc(e)})),_l({target:"Symbol",stat:!0,forced:!Dl},{for:function(e){var t=Jl(e);if(Ul(Rc,t))return Rc[t];var r=$c(t);return Rc[t]=r,Lc[r]=t,r},keyFor:function(e){if(!Hl(e))throw Sc(e+" is not a symbol");if(Ul(Lc,e))return Lc[e]},useSetter:function(){Dc=!0},useSimple:function(){Dc=!1}}),_l({target:"Object",stat:!0,forced:!Dl,sham:!Nl},{create:function(e,t){return void 0===t?Zl(e):qc(Zl(e),t)},defineProperty:Bc,defineProperties:qc,getOwnPropertyDescriptor:Mc}),_l({target:"Object",stat:!0,forced:!Dl},{getOwnPropertyNames:Hc,getOwnPropertySymbols:Wc}),_l({target:"Object",stat:!0,forced:Fl((function(){tc.f(1)}))},{getOwnPropertySymbols:function(e){return tc.f(Vl(e))}}),Ec)&&_l({target:"JSON",stat:!0,forced:!Dl||Fl((function(){var e=$c();return"[null]"!=Ec([e])||"{}"!=Ec({a:e})||"{}"!=Ec(Object(e))}))},{stringify:function(e,t,r){var n=ic(arguments),o=t;if((zl(t)||void 0!==e)&&!Hl(e))return Bl(t)||(t=function(e,t){if(ql(o)&&(t=Rl(o,this,e,t)),!Hl(t))return t}),n[1]=t,Pl(Ec,null,n)}});if(!kc[vc]){var Vc=kc.valueOf;sc(kc,vc,(function(e){return Rl(Vc,this)}))}fc($c,"Symbol"),cc[gc]=!0;var Gc=Qr.Object.getOwnPropertySymbols;const Kc=ir({exports:{}}.exports=Gc);var Jc=cr,Yc=hn,Zc=lo("species"),Qc=function(e){return Yc>=51||!Jc((function(){var t=[];return(t.constructor={})[Zc]=function(){return{foo:1}},1!==t[e](Boolean).foo}))},Xc=Cl.filter;ka({target:"Array",proto:!0,forced:!Qc("filter")},{filter:function(e){return Xc(this,e,arguments.length>1?arguments[1]:void 0)}});var ep=Qr,tp=function(e){return ep[e+"Prototype"]},rp=tp("Array").filter,np=on,op=rp,ap=Array.prototype,ip=function(e){var t=e.filter;return e===ap||np(ap,e)&&t===ap.filter?op:t};const sp=ir({exports:{}}.exports=ip);var lp={exports:{}},cp=ka,pp=cr,dp=Jr,up=kr.f,hp=Sr,fp=pp((function(){up(1)}));cp({target:"Object",stat:!0,forced:!hp||fp,sham:!hp},{getOwnPropertyDescriptor:function(e,t){return up(dp(e),t)}});var mp=Qr.Object,yp=lp.exports=function(e,t){return mp.getOwnPropertyDescriptor(e,t)};mp.getOwnPropertyDescriptor.sham&&(yp.sham=!0);var gp=lp.exports;const vp=ir({exports:{}}.exports=gp);var bp,xp,wp,$p={},kp=Sr,Sp=Vn,Ap=Function.prototype,Ep=kp&&Object.getOwnPropertyDescriptor,Op=Sp(Ap,"name"),Tp={EXISTS:Op,PROPER:Op&&"something"===function(){}.name,CONFIGURABLE:Op&&(!kp||kp&&Ep(Ap,"name").configurable)},Cp=!cr((function(){function e(){}return e.prototype.constructor=null,Object.getPrototypeOf(new e)!==e.prototype})),_p=lr,jp=Vn,Ip=$r,Pp=Mn,Rp=Cp,Lp=Ci("IE_PROTO"),Np=_p.Object,Dp=Np.prototype,Fp=Rp?Np.getPrototypeOf:function(e){var t=Pp(e);if(jp(t,Lp))return t[Lp];var r=t.constructor;return Ip(r)&&t instanceof r?r.prototype:t instanceof Np?Dp:null},Up=cr,Bp=$r,qp=qi,zp=Fp,Mp=ps,Hp=lo("iterator"),Wp=!1;[].keys&&("next"in(wp=[].keys())?(xp=zp(zp(wp)))!==Object.prototype&&(bp=xp):Wp=!0);var Vp=null==bp||Up((function(){var e={};return bp[Hp].call(e)!==e}));Bp((bp=Vp?{}:qp(bp))[Hp])||Mp(bp,Hp,(function(){return this}));var Gp={IteratorPrototype:bp,BUGGY_SAFARI_ITERATORS:Wp},Kp=Gp.IteratorPrototype,Jp=qi,Yp=Rr,Zp=Es,Qp=$p,Xp=function(){return this},ed=function(e,t,r,n){var o=t+" Iterator";return e.prototype=Jp(Kp,{next:Yp(+!n,r)}),Zp(e,o,!1,!0),Qp[o]=Xp,e},td=lr,rd=$r,nd=td.String,od=td.TypeError,ad=wr,id=ea,sd=Object.setPrototypeOf||("__proto__"in{}?function(){var e,t=!1,r={};try{(e=ad(Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set))(r,[]),t=r instanceof Array}catch(e){}return function(r,n){return id(r),function(e){if("object"==typeof e||rd(e))return e;throw od("Can't set "+nd(e)+" as a prototype")}(n),t?e(r,n):r.__proto__=n,r}}():void 0),ld=ka,cd=Or,pd=ed,dd=Fp,ud=Es,hd=ps,fd=$p,md=Tp.PROPER,yd=Gp.BUGGY_SAFARI_ITERATORS,gd=lo("iterator"),vd=function(){return this},bd=function(e,t,r,n,o,a,i){pd(r,t,n);var s,l,c,p=function(e){if(e===o&&m)return m;if(!yd&&e in h)return h[e];switch(e){case"keys":case"values":case"entries":return function(){return new r(this,e)}}return function(){return new r(this)}},d=t+" Iterator",u=!1,h=e.prototype,f=h[gd]||h["@@iterator"]||o&&h[o],m=!yd&&f||p(o),y="Array"==t&&h.entries||f;if(y&&(s=dd(y.call(new e)))!==Object.prototype&&s.next&&(ud(s,d,!0,!0),fd[d]=vd),md&&"values"==o&&f&&"values"!==f.name&&(u=!0,m=function(){return cd(f,this)}),o)if(l={values:p("values"),keys:a?m:p("keys"),entries:p("entries")},i)for(c in l)(yd||u||!(c in h))&&hd(h,c,l[c]);else ld({target:t,proto:!0,forced:yd||u},l);return i&&h[gd]!==m&&hd(h,gd,m,{name:o}),fd[t]=m,l},xd=Jr,wd=$p,$d=el;Ko.f;var kd=bd,Sd=$d.set,Ad=$d.getterFor("Array Iterator");kd(Array,"Array",(function(e,t){Sd(this,{type:"Array Iterator",target:xd(e),index:0,kind:t})}),(function(){var e=Ad(this),t=e.target,r=e.kind,n=e.index++;return!t||n>=t.length?(e.target=void 0,{value:void 0,done:!0}):"keys"==r?{value:n,done:!1}:"values"==r?{value:t[n],done:!1}:{value:[n,t[n]],done:!1}}),"values"),wd.Arguments=wd.Array;var Ed=lr,Od=hi,Td=da,Cd=$p,_d=lo("toStringTag");for(var jd in{CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}){var Id=Ed[jd],Pd=Id&&Id.prototype;Pd&&Od(Pd)!==_d&&Td(Pd,_d,jd),Cd[jd]=Cd.Array}var Rd=cr,Ld=function(e,t){var r=[][e];return!!r&&Rd((function(){r.call(null,t||function(){return 1},1)}))},Nd=Cl.forEach,Dd=Ld("forEach")?[].forEach:function(e){return Nd(this,e,arguments.length>1?arguments[1]:void 0)};ka({target:"Array",proto:!0,forced:[].forEach!=Dd},{forEach:Dd});var Fd=tp("Array").forEach,Ud=hi,Bd=Vn,qd=on,zd=Fd,Md=Array.prototype,Hd={DOMTokenList:!0,NodeList:!0};const Wd=ir({exports:{}}.exports=function(e){var t=e.forEach;return e===Md||qd(Md,e)&&t===Md.forEach||Bd(Hd,Ud(e))?zd:t});var Vd=nn,Gd=zi,Kd=ss,Jd=ea,Yd=wr([].concat),Zd=Vd("Reflect","ownKeys")||function(e){var t=Gd.f(Jd(e)),r=Kd.f;return r?Yd(t,r(e)):t},Qd=Zd,Xd=Jr,eu=kr,tu=Ji;ka({target:"Object",stat:!0,sham:!Sr},{getOwnPropertyDescriptors:function(e){for(var t,r,n=Xd(e),o=eu.f,a=Qd(n),i={},s=0;a.length>s;)void 0!==(r=o(n,t=a[s++]))&&tu(i,t,r);return i}});var ru=Qr.Object.getOwnPropertyDescriptors;const nu=ir({exports:{}}.exports=ru);var ou={exports:{}},au=ka,iu=Sr,su=gi.f;au({target:"Object",stat:!0,forced:Object.defineProperties!==su,sham:!iu},{defineProperties:su});var lu=Qr.Object,cu=ou.exports=function(e,t){return lu.defineProperties(e,t)};lu.defineProperties.sham&&(cu.sham=!0);var pu=ou.exports;const du=ir({exports:{}}.exports=pu);var uu={exports:{}},hu=ka,fu=Sr,mu=Ko.f;hu({target:"Object",stat:!0,forced:Object.defineProperty!==mu,sham:!fu},{defineProperty:mu});var yu=Qr.Object,gu=uu.exports=function(e,t,r){return yu.defineProperty(e,t,r)};yu.defineProperty.sham&&(gu.sham=!0);var vu=uu.exports;const bu=ir({exports:{}}.exports=vu);function xu(e,t,r){return t in e?bu(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function wu(e,t){var r=ti(e);if(Kc){var n=Kc(e);t&&(n=sp(n).call(n,(function(t){return vp(e,t).enumerable}))),r.push.apply(r,n)}return r}function $u(e){for(var t=1;t<arguments.length;t++){var r,n,o=null!=arguments[t]?arguments[t]:{};t%2?Wd(r=wu(Object(o),!0)).call(r,(function(t){xu(e,t,o[t])})):nu?du(e,nu(o)):Wd(n=wu(Object(o))).call(n,(function(t){bu(e,t,vp(o,t))}))}return e}var ku=Sr,Su=wr,Au=Or,Eu=cr,Ou=Za,Tu=ss,Cu=Tr,_u=Mn,ju=Hr,Iu=Object.assign,Pu=Object.defineProperty,Ru=Su([].concat),Lu=!Iu||Eu((function(){if(ku&&1!==Iu({b:1},Iu(Pu({},"a",{enumerable:!0,get:function(){Pu(this,"b",{value:3,enumerable:!1})}}),{b:2})).b)return!0;var e={},t={},r=Symbol(),n="abcdefghijklmnopqrst";return e[r]=7,n.split("").forEach((function(e){t[e]=e})),7!=Iu({},e)[r]||Ou(Iu({},t)).join("")!=n}))?function(e,t){for(var r=_u(e),n=arguments.length,o=1,a=Tu.f,i=Cu.f;n>o;)for(var s,l=ju(arguments[o++]),c=a?Ru(Ou(l),a(l)):Ou(l),p=c.length,d=0;p>d;)s=c[d++],ku&&!Au(i,l,s)||(r[s]=l[s]);return r}:Iu,Nu=Lu;ka({target:"Object",stat:!0,forced:Object.assign!==Nu},{assign:Nu});var Du=Qr.Object.assign;const Fu=ir({exports:{}}.exports=Du);var Uu=Zr,Bu=Fr,qu=lo("match"),zu=lr.TypeError,Mu=function(e){if(function(e){var t;return Uu(e)&&(void 0!==(t=e[qu])?!!t:"RegExp"==Bu(e))}(e))throw zu("The method doesn't accept regular expressions");return e},Hu=lo("match"),Wu=function(e){var t=/./;try{"/./"[e](t)}catch(r){try{return t[Hu]=!1,"/./"[e](t)}catch(e){}}return!1},Vu=ka,Gu=wr,Ku=Pa,Ju=yi,Yu=Mu,Zu=Vr,Qu=Wu,Xu=Gu("".startsWith),eh=Gu("".slice),th=Math.min;Vu({target:"String",proto:!0,forced:!Qu("startsWith")},{startsWith:function(e){var t=Ju(Zu(this));Yu(e);var r=Ku(th(arguments.length>1?arguments[1]:void 0,t.length)),n=Ju(e);return Xu?Xu(t,n,r):eh(t,r,r+n.length)===n}});var rh=tp("String").startsWith,nh=on,oh=rh,ah=String.prototype;const ih=ir({exports:{}}.exports=function(e){var t=e.startsWith;return"string"==typeof e||e===ah||nh(ah,e)&&t===ah.startsWith?oh:t});var sh={},lh={exports:{}};!function(e,t){!function(r){var n=t&&!t.nodeType&&t,o=e&&!e.nodeType&&e,a="object"==typeof global&&global;a.global!==a&&a.window!==a&&a.self!==a||(r=a);var i,s,l=2147483647,c=36,p=/^xn--/,d=/[^\x20-\x7E]/,u=/[\x2E\u3002\uFF0E\uFF61]/g,h={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},f=Math.floor,m=String.fromCharCode;function y(e){throw RangeError(h[e])}function g(e,t){for(var r=e.length,n=[];r--;)n[r]=t(e[r]);return n}function v(e,t){var r=e.split("@"),n="";return r.length>1&&(n=r[0]+"@",e=r[1]),n+g((e=e.replace(u,".")).split("."),t).join(".")}function b(e){for(var t,r,n=[],o=0,a=e.length;o<a;)(t=e.charCodeAt(o++))>=55296&&t<=56319&&o<a?56320==(64512&(r=e.charCodeAt(o++)))?n.push(((1023&t)<<10)+(1023&r)+65536):(n.push(t),o--):n.push(t);return n}function x(e){return g(e,(function(e){var t="";return e>65535&&(t+=m((e-=65536)>>>10&1023|55296),e=56320|1023&e),t+m(e)})).join("")}function w(e,t){return e+22+75*(e<26)-((0!=t)<<5)}function $(e,t,r){var n=0;for(e=r?f(e/700):e>>1,e+=f(e/t);e>455;n+=c)e=f(e/35);return f(n+36*e/(e+38))}function k(e){var t,r,n,o,a,i,s,p,d,u,h,m=[],g=e.length,v=0,b=128,w=72;for((r=e.lastIndexOf("-"))<0&&(r=0),n=0;n<r;++n)e.charCodeAt(n)>=128&&y("not-basic"),m.push(e.charCodeAt(n));for(o=r>0?r+1:0;o<g;){for(a=v,i=1,s=c;o>=g&&y("invalid-input"),((p=(h=e.charCodeAt(o++))-48<10?h-22:h-65<26?h-65:h-97<26?h-97:c)>=c||p>f((l-v)/i))&&y("overflow"),v+=p*i,!(p<(d=s<=w?1:s>=w+26?26:s-w));s+=c)i>f(l/(u=c-d))&&y("overflow"),i*=u;w=$(v-a,t=m.length+1,0==a),f(v/t)>l-b&&y("overflow"),b+=f(v/t),v%=t,m.splice(v++,0,b)}return x(m)}function S(e){var t,r,n,o,a,i,s,p,d,u,h,g,v,x,k,S=[];for(g=(e=b(e)).length,t=128,r=0,a=72,i=0;i<g;++i)(h=e[i])<128&&S.push(m(h));for(n=o=S.length,o&&S.push("-");n<g;){for(s=l,i=0;i<g;++i)(h=e[i])>=t&&h<s&&(s=h);for(s-t>f((l-r)/(v=n+1))&&y("overflow"),r+=(s-t)*v,t=s,i=0;i<g;++i)if((h=e[i])<t&&++r>l&&y("overflow"),h==t){for(p=r,d=c;!(p<(u=d<=a?1:d>=a+26?26:d-a));d+=c)k=p-u,x=c-u,S.push(m(w(u+k%x,0))),p=f(k/x);S.push(m(w(p,0))),a=$(r,v,n==o),r=0,++n}++r,++t}return S.join("")}if(i={version:"1.3.2",ucs2:{decode:b,encode:x},decode:k,encode:S,toASCII:function(e){return v(e,(function(e){return d.test(e)?"xn--"+S(e):e}))},toUnicode:function(e){return v(e,(function(e){return p.test(e)?k(e.slice(4).toLowerCase()):e}))}},n&&o)if(e.exports==n)o.exports=i;else for(s in i)i.hasOwnProperty(s)&&(n[s]=i[s]);else r.punycode=i}(this)}(lh,lh.exports);var ch={};function ph(e,t){return Object.prototype.hasOwnProperty.call(e,t)}var dh=function(e){switch(typeof e){case"string":return e;case"boolean":return e?"true":"false";case"number":return isFinite(e)?e:"";default:return""}};ch.decode=ch.parse=function(e,t,r,n){t=t||"&",r=r||"=";var o={};if("string"!=typeof e||0===e.length)return o;var a=/\+/g;e=e.split(t);var i=1e3;n&&"number"==typeof n.maxKeys&&(i=n.maxKeys);var s=e.length;i>0&&s>i&&(s=i);for(var l=0;l<s;++l){var c,p,d,u,h=e[l].replace(a,"%20"),f=h.indexOf(r);f>=0?(c=h.substr(0,f),p=h.substr(f+1)):(c=h,p=""),d=decodeURIComponent(c),u=decodeURIComponent(p),ph(o,d)?Array.isArray(o[d])?o[d].push(u):o[d]=[o[d],u]:o[d]=u}return o},ch.encode=ch.stringify=function(e,t,r,n){return t=t||"&",r=r||"=",null===e&&(e=void 0),"object"==typeof e?Object.keys(e).map((function(n){var o=encodeURIComponent(dh(n))+r;return Array.isArray(e[n])?e[n].map((function(e){return o+encodeURIComponent(dh(e))})).join(t):o+encodeURIComponent(dh(e[n]))})).join(t):n?encodeURIComponent(dh(n))+r+encodeURIComponent(dh(e)):""};var uh=lh.exports,hh=function(e){return"string"==typeof e},fh=function(e){return"object"==typeof e&&null!==e},mh=function(e){return null===e},yh=function(e){return null==e};function gh(){this.protocol=null,this.slashes=null,this.auth=null,this.host=null,this.port=null,this.hostname=null,this.hash=null,this.search=null,this.query=null,this.pathname=null,this.path=null,this.href=null}sh.parse=jh,sh.resolve=function(e,t){return jh(e,!1,!0).resolve(t)},sh.resolveObject=function(e,t){return e?jh(e,!1,!0).resolveObject(t):t},sh.format=function(e){return hh(e)&&(e=jh(e)),e instanceof gh?e.format():gh.prototype.format.call(e)},sh.Url=gh;var vh=/^([a-z0-9.+-]+:)/i,bh=/:[0-9]*$/,xh=/^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,wh=["{","}","|","\\","^","`"].concat(["<",">",'"',"`"," ","\r","\n","\t"]),$h=["'"].concat(wh),kh=["%","/","?",";","#"].concat($h),Sh=["/","?","#"],Ah=/^[+a-z0-9A-Z_-]{0,63}$/,Eh=/^([+a-z0-9A-Z_-]{0,63})(.*)$/,Oh={javascript:!0,"javascript:":!0},Th={javascript:!0,"javascript:":!0},Ch={http:!0,https:!0,ftp:!0,gopher:!0,file:!0,"http:":!0,"https:":!0,"ftp:":!0,"gopher:":!0,"file:":!0},_h=ch;function jh(e,t,r){if(e&&fh(e)&&e instanceof gh)return e;var n=new gh;return n.parse(e,t,r),n}gh.prototype.parse=function(e,t,r){if(!hh(e))throw new TypeError("Parameter 'url' must be a string, not "+typeof e);var n=e.indexOf("?"),o=-1!==n&&n<e.indexOf("#")?"?":"#",a=e.split(o);a[0]=a[0].replace(/\\/g,"/");var i=e=a.join(o);if(i=i.trim(),!r&&1===e.split("#").length){var s=xh.exec(i);if(s)return this.path=i,this.href=i,this.pathname=s[1],s[2]?(this.search=s[2],this.query=t?_h.parse(this.search.substr(1)):this.search.substr(1)):t&&(this.search="",this.query={}),this}var l=vh.exec(i);if(l){var c=(l=l[0]).toLowerCase();this.protocol=c,i=i.substr(l.length)}if(r||l||i.match(/^\/\/[^@\/]+@[^@\/]+/)){var p="//"===i.substr(0,2);!p||l&&Th[l]||(i=i.substr(2),this.slashes=!0)}if(!Th[l]&&(p||l&&!Ch[l])){for(var d,u,h=-1,f=0;f<Sh.length;f++)-1!==(m=i.indexOf(Sh[f]))&&(-1===h||m<h)&&(h=m);for(-1!==(u=-1===h?i.lastIndexOf("@"):i.lastIndexOf("@",h))&&(d=i.slice(0,u),i=i.slice(u+1),this.auth=decodeURIComponent(d)),h=-1,f=0;f<kh.length;f++){var m;-1!==(m=i.indexOf(kh[f]))&&(-1===h||m<h)&&(h=m)}-1===h&&(h=i.length),this.host=i.slice(0,h),i=i.slice(h),this.parseHost(),this.hostname=this.hostname||"";var y="["===this.hostname[0]&&"]"===this.hostname[this.hostname.length-1];if(!y)for(var g=this.hostname.split(/\./),v=(f=0,g.length);f<v;f++){var b=g[f];if(b&&!b.match(Ah)){for(var x="",w=0,$=b.length;w<$;w++)b.charCodeAt(w)>127?x+="x":x+=b[w];if(!x.match(Ah)){var k=g.slice(0,f),S=g.slice(f+1),A=b.match(Eh);A&&(k.push(A[1]),S.unshift(A[2])),S.length&&(i="/"+S.join(".")+i),this.hostname=k.join(".");break}}}this.hostname.length>255?this.hostname="":this.hostname=this.hostname.toLowerCase(),y||(this.hostname=uh.toASCII(this.hostname));var E=this.port?":"+this.port:"",O=this.hostname||"";this.host=O+E,this.href+=this.host,y&&(this.hostname=this.hostname.substr(1,this.hostname.length-2),"/"!==i[0]&&(i="/"+i))}if(!Oh[c])for(f=0,v=$h.length;f<v;f++){var T=$h[f];if(-1!==i.indexOf(T)){var C=encodeURIComponent(T);C===T&&(C=escape(T)),i=i.split(T).join(C)}}var _=i.indexOf("#");-1!==_&&(this.hash=i.substr(_),i=i.slice(0,_));var j=i.indexOf("?");if(-1!==j?(this.search=i.substr(j),this.query=i.substr(j+1),t&&(this.query=_h.parse(this.query)),i=i.slice(0,j)):t&&(this.search="",this.query={}),i&&(this.pathname=i),Ch[c]&&this.hostname&&!this.pathname&&(this.pathname="/"),this.pathname||this.search){E=this.pathname||"";var I=this.search||"";this.path=E+I}return this.href=this.format(),this},gh.prototype.format=function(){var e=this.auth||"";e&&(e=(e=encodeURIComponent(e)).replace(/%3A/i,":"),e+="@");var t=this.protocol||"",r=this.pathname||"",n=this.hash||"",o=!1,a="";this.host?o=e+this.host:this.hostname&&(o=e+(-1===this.hostname.indexOf(":")?this.hostname:"["+this.hostname+"]"),this.port&&(o+=":"+this.port)),this.query&&fh(this.query)&&Object.keys(this.query).length&&(a=_h.stringify(this.query));var i=this.search||a&&"?"+a||"";return t&&":"!==t.substr(-1)&&(t+=":"),this.slashes||(!t||Ch[t])&&!1!==o?(o="//"+(o||""),r&&"/"!==r.charAt(0)&&(r="/"+r)):o||(o=""),n&&"#"!==n.charAt(0)&&(n="#"+n),i&&"?"!==i.charAt(0)&&(i="?"+i),t+o+(r=r.replace(/[?#]/g,(function(e){return encodeURIComponent(e)})))+(i=i.replace("#","%23"))+n},gh.prototype.resolve=function(e){return this.resolveObject(jh(e,!1,!0)).format()},gh.prototype.resolveObject=function(e){if(hh(e)){var t=new gh;t.parse(e,!1,!0),e=t}for(var r=new gh,n=Object.keys(this),o=0;o<n.length;o++){var a=n[o];r[a]=this[a]}if(r.hash=e.hash,""===e.href)return r.href=r.format(),r;if(e.slashes&&!e.protocol){for(var i=Object.keys(e),s=0;s<i.length;s++){var l=i[s];"protocol"!==l&&(r[l]=e[l])}return Ch[r.protocol]&&r.hostname&&!r.pathname&&(r.path=r.pathname="/"),r.href=r.format(),r}if(e.protocol&&e.protocol!==r.protocol){if(!Ch[e.protocol]){for(var c=Object.keys(e),p=0;p<c.length;p++){var d=c[p];r[d]=e[d]}return r.href=r.format(),r}if(r.protocol=e.protocol,e.host||Th[e.protocol])r.pathname=e.pathname;else{for(var u=(e.pathname||"").split("/");u.length&&!(e.host=u.shift()););e.host||(e.host=""),e.hostname||(e.hostname=""),""!==u[0]&&u.unshift(""),u.length<2&&u.unshift(""),r.pathname=u.join("/")}if(r.search=e.search,r.query=e.query,r.host=e.host||"",r.auth=e.auth,r.hostname=e.hostname||e.host,r.port=e.port,r.pathname||r.search){var h=r.pathname||"",f=r.search||"";r.path=h+f}return r.slashes=r.slashes||e.slashes,r.href=r.format(),r}var m=r.pathname&&"/"===r.pathname.charAt(0),y=e.host||e.pathname&&"/"===e.pathname.charAt(0),g=y||m||r.host&&e.pathname,v=g,b=r.pathname&&r.pathname.split("/")||[],x=(u=e.pathname&&e.pathname.split("/")||[],r.protocol&&!Ch[r.protocol]);if(x&&(r.hostname="",r.port=null,r.host&&(""===b[0]?b[0]=r.host:b.unshift(r.host)),r.host="",e.protocol&&(e.hostname=null,e.port=null,e.host&&(""===u[0]?u[0]=e.host:u.unshift(e.host)),e.host=null),g=g&&(""===u[0]||""===b[0])),y)r.host=e.host||""===e.host?e.host:r.host,r.hostname=e.hostname||""===e.hostname?e.hostname:r.hostname,r.search=e.search,r.query=e.query,b=u;else if(u.length)b||(b=[]),b.pop(),b=b.concat(u),r.search=e.search,r.query=e.query;else if(!yh(e.search))return x&&(r.hostname=r.host=b.shift(),(A=!!(r.host&&r.host.indexOf("@")>0)&&r.host.split("@"))&&(r.auth=A.shift(),r.host=r.hostname=A.shift())),r.search=e.search,r.query=e.query,mh(r.pathname)&&mh(r.search)||(r.path=(r.pathname?r.pathname:"")+(r.search?r.search:"")),r.href=r.format(),r;if(!b.length)return r.pathname=null,r.search?r.path="/"+r.search:r.path=null,r.href=r.format(),r;for(var w=b.slice(-1)[0],$=(r.host||e.host||b.length>1)&&("."===w||".."===w)||""===w,k=0,S=b.length;S>=0;S--)"."===(w=b[S])?b.splice(S,1):".."===w?(b.splice(S,1),k++):k&&(b.splice(S,1),k--);if(!g&&!v)for(;k--;k)b.unshift("..");!g||""===b[0]||b[0]&&"/"===b[0].charAt(0)||b.unshift(""),$&&"/"!==b.join("/").substr(-1)&&b.push("");var A,E=""===b[0]||b[0]&&"/"===b[0].charAt(0);return x&&(r.hostname=r.host=E?"":b.length?b.shift():"",(A=!!(r.host&&r.host.indexOf("@")>0)&&r.host.split("@"))&&(r.auth=A.shift(),r.host=r.hostname=A.shift())),(g=g||r.host&&b.length)&&!E&&b.unshift(""),b.length?r.pathname=b.join("/"):(r.pathname=null,r.path=null),mh(r.pathname)&&mh(r.search)||(r.path=(r.pathname?r.pathname:"")+(r.search?r.search:"")),r.auth=e.auth||r.auth,r.slashes=r.slashes||e.slashes,r.href=r.format(),r},gh.prototype.parseHost=function(){var e=this.host,t=bh.exec(e);t&&(":"!==(t=t[0])&&(this.port=t.substr(1)),e=e.substr(0,e.length-t.length)),e&&(this.hostname=e)};var Ih=ka,Ph=lr,Rh=cr,Lh=ni,Nh=Zr,Dh=Mn,Fh=La,Uh=Ji,Bh=wl,qh=Qc,zh=hn,Mh=lo("isConcatSpreadable"),Hh=Ph.TypeError,Wh=zh>=51||!Rh((function(){var e=[];return e[Mh]=!1,e.concat()[0]!==e})),Vh=qh("concat"),Gh=function(e){if(!Nh(e))return!1;var t=e[Mh];return void 0!==t?!!t:Lh(e)};Ih({target:"Array",proto:!0,forced:!Wh||!Vh},{concat:function(e){var t,r,n,o,a,i=Dh(this),s=Bh(i,0),l=0;for(t=-1,n=arguments.length;t<n;t++)if(Gh(a=-1===t?i:arguments[t])){if(l+(o=Fh(a))>9007199254740991)throw Hh("Maximum allowed index exceeded");for(r=0;r<o;r++,l++)r in a&&Uh(s,l,a[r])}else{if(l>=9007199254740991)throw Hh("Maximum allowed index exceeded");Uh(s,l++,a)}return s.length=l,s}}),gs("asyncIterator"),gs("hasInstance"),gs("isConcatSpreadable"),gs("iterator"),gs("match"),gs("matchAll"),gs("replace"),gs("search"),gs("species"),gs("split"),gs("toPrimitive"),gs("toStringTag"),gs("unscopables"),Es(lr.JSON,"JSON",!0);var Kh=Qr.Symbol;gs("asyncDispose"),gs("dispose"),gs("matcher"),gs("metadata"),gs("observable"),gs("patternMatch"),gs("replaceAll");const Jh=ir({exports:{}}.exports=Kh);var Yh=wr,Zh=Ea,Qh=yi,Xh=Vr,ef=Yh("".charAt),tf=Yh("".charCodeAt),rf=Yh("".slice),nf=function(e){return function(t,r){var n,o,a=Qh(Xh(t)),i=Zh(r),s=a.length;return i<0||i>=s?e?"":void 0:(n=tf(a,i))<55296||n>56319||i+1===s||(o=tf(a,i+1))<56320||o>57343?e?ef(a,i):n:e?rf(a,i,i+2):o-56320+(n-55296<<10)+65536}},of=(nf(!1),nf(!0)),af=yi,sf=el,lf=bd,cf=sf.set,pf=sf.getterFor("String Iterator");lf(String,"String",(function(e){cf(this,{type:"String Iterator",string:af(e),index:0})}),(function(){var e,t=pf(this),r=t.string,n=t.index;return n>=r.length?{value:void 0,done:!0}:(e=of(r,n),t.index+=e.length,{value:e,done:!1})}));var df=hi,uf=jn,hf=$p,ff=lo("iterator"),mf=function(e){if(null!=e)return uf(e,ff)||uf(e,"@@iterator")||hf[df(e)]};const yf=ir({exports:{}}.exports=mf);ka({target:"Array",stat:!0},{isArray:ni});var gf=Qr.Array.isArray;const vf=ir({exports:{}}.exports=gf);var bf=ka,xf=lr,wf=ni,$f=fl,kf=Zr,Sf=_a,Af=La,Ef=Jr,Of=Ji,Tf=lo,Cf=ls,_f=Qc("slice"),jf=Tf("species"),If=xf.Array,Pf=Math.max;bf({target:"Array",proto:!0,forced:!_f},{slice:function(e,t){var r,n,o,a=Ef(this),i=Af(a),s=Sf(e,i),l=Sf(void 0===t?i:t,i);if(wf(a)&&(r=a.constructor,($f(r)&&(r===If||wf(r.prototype))||kf(r)&&null===(r=r[jf]))&&(r=void 0),r===If||void 0===r))return Cf(a,s,l);for(n=new(void 0===r?If:r)(Pf(l-s,0)),o=0;s<l;s++,o++)s in a&&Of(n,o,a[s]);return n.length=o,n}});var Rf=tp("Array").slice,Lf=on,Nf=Rf,Df=Array.prototype,Ff=function(e){var t=e.slice;return e===Df||Lf(Df,e)&&t===Df.slice?Nf:t};const Uf=ir({exports:{}}.exports=Ff);var Bf=Or,qf=ea,zf=jn,Mf=function(e,t,r){var n,o;qf(e);try{if(!(n=zf(e,"return"))){if("throw"===t)throw r;return r}n=Bf(n,e)}catch(e){o=!0,n=e}if("throw"===t)throw r;if(o)throw n;return qf(n),r},Hf=ea,Wf=Mf,Vf=$p,Gf=lo("iterator"),Kf=Array.prototype,Jf=function(e){return void 0!==e&&(Vf.Array===e||Kf[Gf]===e)},Yf=Or,Zf=Cn,Qf=ea,Xf=An,em=mf,tm=lr.TypeError,rm=function(e,t){var r=arguments.length<2?em(e):t;if(Zf(r))return Qf(Yf(r,e));throw tm(Xf(e)+" is not iterable")},nm=Go,om=Or,am=Mn,im=function(e,t,r,n){try{return n?t(Hf(r)[0],r[1]):t(r)}catch(t){Wf(e,"throw",t)}},sm=Jf,lm=fl,cm=La,pm=Ji,dm=rm,um=mf,hm=lr.Array,fm=lo("iterator"),mm=!1;try{var ym=0,gm={next:function(){return{done:!!ym++}},return:function(){mm=!0}};gm[fm]=function(){return this},Array.from(gm,(function(){throw 2}))}catch(e){}var vm=function(e,t){if(!t&&!mm)return!1;var r=!1;try{var n={};n[fm]=function(){return{next:function(){return{done:r=!0}}}},e(n)}catch(e){}return r};ka({target:"Array",stat:!0,forced:!vm((function(e){Array.from(e)}))},{from:function(e){var t=am(e),r=lm(this),n=arguments.length,o=n>1?arguments[1]:void 0,a=void 0!==o;a&&(o=nm(o,n>2?arguments[2]:void 0));var i,s,l,c,p,d,u=um(t),h=0;if(!u||this==hm&&sm(u))for(i=cm(t),s=r?new this(i):hm(i);i>h;h++)d=a?o(t[h],h):t[h],pm(s,h,d);else for(p=(c=dm(t,u)).next,s=r?new this:[];!(l=om(p,c)).done;h++)d=a?im(c,o,[l.value,h],!0):l.value,pm(s,h,d);return s.length=h,s}});var bm=Qr.Array.from;const xm=ir({exports:{}}.exports=bm);function wm(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function $m(e,t){var r;if(e){if("string"==typeof e)return wm(e,t);var n=Uf(r=Object.prototype.toString.call(e)).call(r,8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?xm(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?wm(e,t):void 0}}function km(e,t){var r=void 0!==Jh&&yf(e)||e["@@iterator"];if(!r){if(vf(e)||(r=$m(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,o=function(){};return{s:o,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,i=!0,s=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return i=e.done,e},e:function(e){s=!0,a=e},f:function(){try{i||null==r.return||r.return()}finally{if(s)throw a}}}}var Sm=ds.f("iterator");const Am=ir({exports:{}}.exports=Sm);function Em(e){return(Em="function"==typeof Jh&&"symbol"==typeof Am?function(e){return typeof e}:function(e){return e&&"function"==typeof Jh&&e.constructor===Jh&&e!==Jh.prototype?"symbol":typeof e})(e)}function Om(e,t){return function(e){if(vf(e))return e}(e)||function(e,t){var r=null==e?null:void 0!==Jh&&yf(e)||e["@@iterator"];if(null!=r){var n,o,a=[],i=!0,s=!1;try{for(r=r.call(e);!(i=(n=r.next()).done)&&(a.push(n.value),!t||a.length!==t);i=!0);}catch(e){s=!0,o=e}finally{try{i||null==r.return||r.return()}finally{if(s)throw o}}return a}}(e,t)||$m(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var Tm=Vn,Cm=Zd,_m=kr,jm=Ko,Im=wr("".replace),Pm=String(Error("zxcasd").stack),Rm=/\n\s*at [^:]*:[^\n]*/,Lm=Rm.test(Pm),Nm=Zr,Dm=da,Fm=Go,Um=Or,Bm=ea,qm=An,zm=Jf,Mm=La,Hm=on,Wm=rm,Vm=mf,Gm=Mf,Km=lr.TypeError,Jm=function(e,t){this.stopped=e,this.result=t},Ym=Jm.prototype,Zm=function(e,t,r){var n,o,a,i,s,l,c,p=r&&r.that,d=!(!r||!r.AS_ENTRIES),u=!(!r||!r.IS_ITERATOR),h=!(!r||!r.INTERRUPTED),f=Fm(t,p),m=function(e){return n&&Gm(n,"normal",e),new Jm(!0,e)},y=function(e){return d?(Bm(e),h?f(e[0],e[1],m):f(e[0],e[1])):h?f(e,m):f(e)};if(u)n=e;else{if(!(o=Vm(e)))throw Km(qm(e)+" is not iterable");if(zm(o)){for(a=0,i=Mm(e);i>a;a++)if((s=y(e[a]))&&Hm(Ym,s))return s;return new Jm(!1)}n=Wm(e,o)}for(l=n.next;!(c=Um(l,n)).done;){try{s=y(c.value)}catch(e){Gm(n,"throw",e)}if("object"==typeof s&&s&&Hm(Ym,s))return s}return new Jm(!1)},Qm=yi,Xm=Rr,ey=!cr((function(){var e=Error("a");return!("stack"in e)||(Object.defineProperty(e,"stack",Xm(1,7)),7!==e.stack)})),ty=ka,ry=lr,ny=on,oy=Fp,ay=sd,iy=qi,sy=da,ly=Rr,cy=function(e,t){if(Lm&&"string"==typeof e)for(;t--;)e=Im(e,Rm,"");return e},py=function(e,t){Nm(t)&&"cause"in t&&Dm(e,"cause",t.cause)},dy=Zm,uy=function(e,t){return void 0===e?arguments.length<2?"":t:Qm(e)},hy=ey,fy=lo("toStringTag"),my=ry.Error,yy=[].push,gy=function(e,t){var r,n=arguments.length>2?arguments[2]:void 0,o=ny(vy,this);ay?r=ay(new my,o?oy(this):vy):(r=o?this:iy(vy),sy(r,fy,"Error")),void 0!==t&&sy(r,"message",uy(t)),hy&&sy(r,"stack",cy(r.stack,1)),py(r,n);var a=[];return dy(e,yy,{that:a}),sy(r,"errors",a),r};ay?ay(gy,my):function(e,t,r){for(var n=Cm(t),o=jm.f,a=_m.f,i=0;i<n.length;i++){var s=n[i];Tm(e,s)||r&&Tm(r,s)||o(e,s,a(t,s))}}(gy,my,{name:!0});var vy=gy.prototype=iy(my.prototype,{constructor:ly(1,gy),message:ly(1,""),name:ly(1,"AggregateError")});ty({global:!0},{AggregateError:gy});var by,xy,wy,$y,ky=lr.Promise,Sy=ps,Ay=function(e,t,r){for(var n in t)r&&r.unsafe&&e[n]?e[n]=t[n]:Sy(e,n,t[n],r);return e},Ey=nn,Oy=Ko,Ty=Sr,Cy=lo("species"),_y=on,jy=lr.TypeError,Iy=function(e,t){if(_y(t,e))return e;throw jy("Incorrect invocation")},Py=fl,Ry=An,Ly=lr.TypeError,Ny=ea,Dy=lo("species"),Fy=function(e,t){var r,n=Ny(e).constructor;return void 0===n||null==(r=Ny(n)[Dy])?t:function(e){if(Py(e))return e;throw Ly(Ry(e)+" is not a constructor")}(r)},Uy=lr.TypeError,By=function(e,t){if(e<t)throw Uy("Not enough arguments");return e},qy=/(?:ipad|iphone|ipod).*applewebkit/i.test(an),zy="process"==Fr(lr.process),My=lr,Hy=mr,Wy=Go,Vy=$r,Gy=Vn,Ky=cr,Jy=Ai,Yy=ls,Zy=ko,Qy=By,Xy=qy,eg=zy,tg=My.setImmediate,rg=My.clearImmediate,ng=My.process,og=My.Dispatch,ag=My.Function,ig=My.MessageChannel,sg=My.String,lg=0,cg={};try{by=My.location}catch(e){}var pg=function(e){if(Gy(cg,e)){var t=cg[e];delete cg[e],t()}},dg=function(e){return function(){pg(e)}},ug=function(e){pg(e.data)},hg=function(e){My.postMessage(sg(e),by.protocol+"//"+by.host)};tg&&rg||(tg=function(e){Qy(arguments.length,1);var t=Vy(e)?e:ag(e),r=Yy(arguments,1);return cg[++lg]=function(){Hy(t,void 0,r)},xy(lg),lg},rg=function(e){delete cg[e]},eg?xy=function(e){ng.nextTick(dg(e))}:og&&og.now?xy=function(e){og.now(dg(e))}:ig&&!Xy?($y=(wy=new ig).port2,wy.port1.onmessage=ug,xy=Wy($y.postMessage,$y)):My.addEventListener&&Vy(My.postMessage)&&!My.importScripts&&by&&"file:"!==by.protocol&&!Ky(hg)?(xy=hg,My.addEventListener("message",ug,!1)):xy="onreadystatechange"in Zy("script")?function(e){Jy.appendChild(Zy("script")).onreadystatechange=function(){Jy.removeChild(this),pg(e)}}:function(e){setTimeout(dg(e),0)});var fg,mg,yg,gg,vg,bg,xg,wg,$g={set:tg,clear:rg},kg=lr,Sg=/ipad|iphone|ipod/i.test(an)&&void 0!==kg.Pebble,Ag=/web0s(?!.*chrome)/i.test(an),Eg=lr,Og=Go,Tg=kr.f,Cg=$g.set,_g=qy,jg=Sg,Ig=Ag,Pg=zy,Rg=Eg.MutationObserver||Eg.WebKitMutationObserver,Lg=Eg.document,Ng=Eg.process,Dg=Eg.Promise,Fg=Tg(Eg,"queueMicrotask"),Ug=Fg&&Fg.value;Ug||(fg=function(){var e,t;for(Pg&&(e=Ng.domain)&&e.exit();mg;){t=mg.fn,mg=mg.next;try{t()}catch(e){throw mg?gg():yg=void 0,e}}yg=void 0,e&&e.enter()},_g||Pg||Ig||!Rg||!Lg?!jg&&Dg&&Dg.resolve?((xg=Dg.resolve(void 0)).constructor=Dg,wg=Og(xg.then,xg),gg=function(){wg(fg)}):Pg?gg=function(){Ng.nextTick(fg)}:(Cg=Og(Cg,Eg),gg=function(){Cg(fg)}):(vg=!0,bg=Lg.createTextNode(""),new Rg(fg).observe(bg,{characterData:!0}),gg=function(){bg.data=vg=!vg}));var Bg=Ug||function(e){var t={fn:e,next:void 0};yg&&(yg.next=t),mg||(mg=t,gg()),yg=t},qg={},zg=Cn,Mg=function(e){var t,r;this.promise=new e((function(e,n){if(void 0!==t||void 0!==r)throw TypeError("Bad Promise constructor");t=e,r=n})),this.resolve=zg(t),this.reject=zg(r)};qg.f=function(e){return new Mg(e)};var Hg=ea,Wg=Zr,Vg=qg,Gg=function(e,t){if(Hg(e),Wg(t)&&t.constructor===e)return t;var r=Vg.f(e);return(0,r.resolve)(t),r.promise},Kg=lr,Jg=function(e){try{return{error:!1,value:e()}}catch(e){return{error:!0,value:e}}},Yg=function(){this.head=null,this.tail=null};Yg.prototype={add:function(e){var t={item:e,next:null};this.head?this.tail.next=t:this.head=t,this.tail=t},get:function(){var e=this.head;if(e)return this.head=e.next,this.tail===e&&(this.tail=null),e.item}};var Zg,Qg,Xg,ev,tv,rv="object"==typeof window,nv=ka,ov=lr,av=nn,iv=Or,sv=ky,lv=Ay,cv=Es,pv=Cn,dv=$r,uv=Zr,hv=Iy,fv=Ps,mv=Zm,yv=vm,gv=Fy,vv=$g.set,bv=Bg,xv=Gg,wv=qg,$v=Jg,kv=Yg,Sv=el,Av=Mo,Ev=rv,Ov=zy,Tv=hn,Cv=lo("species"),_v="Promise",jv=Sv.getterFor(_v),Iv=Sv.set,Pv=Sv.getterFor(_v),Rv=sv&&sv.prototype,Lv=sv,Nv=Rv,Dv=ov.TypeError,Fv=ov.document,Uv=ov.process,Bv=wv.f,qv=Bv,zv=!!(Fv&&Fv.createEvent&&ov.dispatchEvent),Mv=dv(ov.PromiseRejectionEvent),Hv=Av(_v,(function(){var e=fv(Lv),t=e!==String(Lv);if(!t&&66===Tv)return!0;if(!Nv.finally)return!0;if(Tv>=51&&/native code/.test(e))return!1;var r=new Lv((function(e){e(1)})),n=function(e){e((function(){}),(function(){}))};return(r.constructor={})[Cv]=n,!(r.then((function(){}))instanceof n)||!t&&Ev&&!Mv})),Wv=Hv||!yv((function(e){Lv.all(e).catch((function(){}))})),Vv=function(e){var t;return!(!uv(e)||!dv(t=e.then))&&t},Gv=function(e,t){var r,n,o,a=t.value,i=1==t.state,s=i?e.ok:e.fail,l=e.resolve,c=e.reject,p=e.domain;try{s?(i||(2===t.rejection&&Qv(t),t.rejection=1),!0===s?r=a:(p&&p.enter(),r=s(a),p&&(p.exit(),o=!0)),r===e.promise?c(Dv("Promise-chain cycle")):(n=Vv(r))?iv(n,r,l,c):l(r)):c(a)}catch(e){p&&!o&&p.exit(),c(e)}},Kv=function(e,t){e.notified||(e.notified=!0,bv((function(){for(var r,n=e.reactions;r=n.get();)Gv(r,e);e.notified=!1,t&&!e.rejection&&Yv(e)})))},Jv=function(e,t,r){var n,o;zv?((n=Fv.createEvent("Event")).promise=t,n.reason=r,n.initEvent(e,!1,!0),ov.dispatchEvent(n)):n={promise:t,reason:r},!Mv&&(o=ov["on"+e])?o(n):"unhandledrejection"===e&&function(e,t){var r=Kg.console;r&&r.error&&(1==arguments.length?r.error(e):r.error(e,t))}("Unhandled promise rejection",r)},Yv=function(e){iv(vv,ov,(function(){var t,r=e.facade,n=e.value;if(Zv(e)&&(t=$v((function(){Ov?Uv.emit("unhandledRejection",n,r):Jv("unhandledrejection",r,n)})),e.rejection=Ov||Zv(e)?2:1,t.error))throw t.value}))},Zv=function(e){return 1!==e.rejection&&!e.parent},Qv=function(e){iv(vv,ov,(function(){var t=e.facade;Ov?Uv.emit("rejectionHandled",t):Jv("rejectionhandled",t,e.value)}))},Xv=function(e,t,r){return function(n){e(t,n,r)}},eb=function(e,t,r){e.done||(e.done=!0,r&&(e=r),e.value=t,e.state=2,Kv(e,!0))},tb=function(e,t,r){if(!e.done){e.done=!0,r&&(e=r);try{if(e.facade===t)throw Dv("Promise can't be resolved itself");var n=Vv(t);n?bv((function(){var r={done:!1};try{iv(n,t,Xv(tb,r,e),Xv(eb,r,e))}catch(t){eb(r,t,e)}})):(e.value=t,e.state=1,Kv(e,!1))}catch(t){eb({done:!1},t,e)}}};Hv&&(Nv=(Lv=function(e){hv(this,Nv),pv(e),iv(Zg,this);var t=jv(this);try{e(Xv(tb,t),Xv(eb,t))}catch(e){eb(t,e)}}).prototype,(Zg=function(e){Iv(this,{type:_v,done:!1,notified:!1,parent:!1,reactions:new kv,rejection:!1,state:0,value:void 0})}).prototype=lv(Nv,{then:function(e,t){var r=Pv(this),n=Bv(gv(this,Lv));return r.parent=!0,n.ok=!dv(e)||e,n.fail=dv(t)&&t,n.domain=Ov?Uv.domain:void 0,0==r.state?r.reactions.add(n):bv((function(){Gv(n,r)})),n.promise},catch:function(e){return this.then(void 0,e)}}),Qg=function(){var e=new Zg,t=jv(e);this.promise=e,this.resolve=Xv(tb,t),this.reject=Xv(eb,t)},wv.f=Bv=function(e){return e===Lv||e===Xg?new Qg(e):qv(e)}),nv({global:!0,wrap:!0,forced:Hv},{Promise:Lv}),cv(Lv,_v,!1,!0),ev=Ey(_v),tv=Oy.f,Ty&&ev&&!ev[Cy]&&tv(ev,Cy,{configurable:!0,get:function(){return this}}),Xg=av(_v),nv({target:_v,stat:!0,forced:Hv},{reject:function(e){var t=Bv(this);return iv(t.reject,void 0,e),t.promise}}),nv({target:_v,stat:!0,forced:!0},{resolve:function(e){return xv(this===Xg?Lv:this,e)}}),nv({target:_v,stat:!0,forced:Wv},{all:function(e){var t=this,r=Bv(t),n=r.resolve,o=r.reject,a=$v((function(){var r=pv(t.resolve),a=[],i=0,s=1;mv(e,(function(e){var l=i++,c=!1;s++,iv(r,t,e).then((function(e){c||(c=!0,a[l]=e,--s||n(a))}),o)})),--s||n(a)}));return a.error&&o(a.value),r.promise},race:function(e){var t=this,r=Bv(t),n=r.reject,o=$v((function(){var o=pv(t.resolve);mv(e,(function(e){iv(o,t,e).then(r.resolve,n)}))}));return o.error&&n(o.value),r.promise}});var rb=Or,nb=Cn,ob=qg,ab=Jg,ib=Zm;ka({target:"Promise",stat:!0},{allSettled:function(e){var t=this,r=ob.f(t),n=r.resolve,o=r.reject,a=ab((function(){var r=nb(t.resolve),o=[],a=0,i=1;ib(e,(function(e){var s=a++,l=!1;i++,rb(r,t,e).then((function(e){l||(l=!0,o[s]={status:"fulfilled",value:e},--i||n(o))}),(function(e){l||(l=!0,o[s]={status:"rejected",reason:e},--i||n(o))}))})),--i||n(o)}));return a.error&&o(a.value),r.promise}});var sb=Cn,lb=nn,cb=Or,pb=qg,db=Jg,ub=Zm;ka({target:"Promise",stat:!0},{any:function(e){var t=this,r=lb("AggregateError"),n=pb.f(t),o=n.resolve,a=n.reject,i=db((function(){var n=sb(t.resolve),i=[],s=0,l=1,c=!1;ub(e,(function(e){var p=s++,d=!1;l++,cb(n,t,e).then((function(e){d||c||(c=!0,o(e))}),(function(e){d||c||(d=!0,i[p]=e,--l||a(new r(i,"No one promise resolved")))}))})),--l||a(new r(i,"No one promise resolved"))}));return i.error&&a(i.value),n.promise}});var hb=ky,fb=nn,mb=$r,yb=Fy,gb=Gg;ka({target:"Promise",proto:!0,real:!0,forced:!!hb&&cr((function(){hb.prototype.finally.call({then:function(){}},(function(){}))}))},{finally:function(e){var t=yb(this,fb("Promise")),r=mb(e);return this.then(r?function(r){return gb(t,e()).then((function(){return r}))}:e,r?function(r){return gb(t,e()).then((function(){throw r}))}:e)}});var vb=Qr.Promise,bb=vb,xb=qg,wb=Jg;ka({target:"Promise",stat:!0,forced:!0},{try:function(e){var t=xb.f(this),r=wb(e);return(r.error?t.reject:t.resolve)(r.value),t.promise}});const $b=ir({exports:{}}.exports=bb);function kb(e,t,r,n,o,a,i){try{var s=e[a](i),l=s.value}catch(e){return void r(e)}s.done?t(l):$b.resolve(l).then(n,o)}function Sb(e){return function(){var t=this,r=arguments;return new $b((function(n,o){var a=e.apply(t,r);function i(e){kb(a,n,o,i,s,"next",e)}function s(e){kb(a,n,o,i,s,"throw",e)}i(void 0)}))}}var Ab={exports:{}};!function(e){var t=function(e){var t,r=Object.prototype,n=r.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},a=o.iterator||"@@iterator",i=o.asyncIterator||"@@asyncIterator",s=o.toStringTag||"@@toStringTag";function l(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{l({},"")}catch(e){l=function(e,t,r){return e[t]=r}}function c(e,t,r,n){var o,a,i,s,l=t&&t.prototype instanceof y?t:y,c=Object.create(l.prototype),g=new T(n||[]);return c._invoke=(o=e,a=r,i=g,s=d,function(e,t){if(s===h)throw new Error("Generator is already running");if(s===f){if("throw"===e)throw t;return _()}for(i.method=e,i.arg=t;;){var r=i.delegate;if(r){var n=A(r,i);if(n){if(n===m)continue;return n}}if("next"===i.method)i.sent=i._sent=i.arg;else if("throw"===i.method){if(s===d)throw s=f,i.arg;i.dispatchException(i.arg)}else"return"===i.method&&i.abrupt("return",i.arg);s=h;var l=p(o,a,i);if("normal"===l.type){if(s=i.done?f:u,l.arg===m)continue;return{value:l.arg,done:i.done}}"throw"===l.type&&(s=f,i.method="throw",i.arg=l.arg)}}),c}function p(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}e.wrap=c;var d="suspendedStart",u="suspendedYield",h="executing",f="completed",m={};function y(){}function g(){}function v(){}var b={};l(b,a,(function(){return this}));var x=Object.getPrototypeOf,w=x&&x(x(C([])));w&&w!==r&&n.call(w,a)&&(b=w);var $=v.prototype=y.prototype=Object.create(b);function k(e){["next","throw","return"].forEach((function(t){l(e,t,(function(e){return this._invoke(t,e)}))}))}function S(e,t){function r(o,a,i,s){var l=p(e[o],e,a);if("throw"!==l.type){var c=l.arg,d=c.value;return d&&"object"==typeof d&&n.call(d,"__await")?t.resolve(d.u).then((function(e){r("next",e,i,s)}),(function(e){r("throw",e,i,s)})):t.resolve(d).then((function(e){c.value=e,i(c)}),(function(e){return r("throw",e,i,s)}))}s(l.arg)}var o;this._invoke=function(e,n){function a(){return new t((function(t,o){r(e,n,t,o)}))}return o=o?o.then(a,a):a()}}function A(e,r){var n=e.iterator[r.method];if(n===t){if(r.delegate=null,"throw"===r.method){if(e.iterator.return&&(r.method="return",r.arg=t,A(e,r),"throw"===r.method))return m;r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method")}return m}var o=p(n,e.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,m;var a=o.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,m):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,m)}function E(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function O(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function T(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(E,this),this.reset(!0)}function C(e){if(e){var r=e[a];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}return{next:_}}function _(){return{value:t,done:!0}}return g.prototype=v,l($,"constructor",v),l(v,"constructor",g),g.displayName=l(v,s,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===g||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,v):(e.__proto__=v,l(e,s,"GeneratorFunction")),e.prototype=Object.create($),e},e.awrap=function(e){return{u:e}},k(S.prototype),l(S.prototype,i,(function(){return this})),e.AsyncIterator=S,e.async=function(t,r,n,o,a){void 0===a&&(a=Promise);var i=new S(c(t,r,n,o),a);return e.isGeneratorFunction(r)?i:i.next().then((function(e){return e.done?e.value:i.next()}))},k($),l($,s,"Generator"),l($,a,(function(){return this})),l($,"toString",(function(){return"[object Generator]"})),e.keys=function(e){var t=[];for(var r in e)t.push(r);return t.reverse(),function r(){for(;t.length;){var n=t.pop();if(n in e)return r.value=n,r.done=!1,r}return r.done=!0,r}},e.values=C,T.prototype={constructor:T,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(O),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return s.type="throw",s.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],s=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var l=n.call(i,"catchLoc"),c=n.call(i,"finallyLoc");if(l&&c){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(l){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===e||"continue"===e)&&a.tryLoc<=t&&t<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=e,i.arg=t,a?(this.method="next",this.next=a.finallyLoc,m):this.complete(i)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),m},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),O(r),m}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var o=n.arg;O(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:C(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),m}},e}(e.exports);try{regeneratorRuntime=t}catch(e){"object"==typeof globalThis?globalThis.regeneratorRuntime=t:Function("r","regeneratorRuntime = r")(t)}}(Ab);const Eb=ir({exports:{}}.exports=Ab.exports);var Ob=Ba.includes;ka({target:"Array",proto:!0},{includes:function(e){return Ob(this,e,arguments.length>1?arguments[1]:void 0)}});var Tb=tp("Array").includes,Cb=ka,_b=Mu,jb=Vr,Ib=yi,Pb=Wu,Rb=wr("".indexOf);Cb({target:"String",proto:!0,forced:!Pb("includes")},{includes:function(e){return!!~Rb(Ib(jb(this)),Ib(_b(e)),arguments.length>1?arguments[1]:void 0)}});var Lb=tp("String").includes,Nb=on,Db=Tb,Fb=Lb,Ub=Array.prototype,Bb=String.prototype;const qb=ir({exports:{}}.exports=function(e){var t=e.includes;return e===Ub||Nb(Ub,e)&&t===Ub.includes?Db:"string"==typeof e||e===Bb||Nb(Bb,e)&&t===Bb.includes?Fb:t});var zb=tp("Array").entries,Mb=hi,Hb=Vn,Wb=on,Vb=zb,Gb=Array.prototype,Kb={DOMTokenList:!0,NodeList:!0};const Jb=ir({exports:{}}.exports=function(e){var t=e.entries;return e===Gb||Wb(Gb,e)&&t===Gb.entries||Hb(Kb,Mb(e))?Vb:t});const Yb=ir({exports:{}}.exports=bm);var Zb=ka,Qb=nn,Xb=mr,ex=wr,tx=cr,rx=lr.Array,nx=Qb("JSON","stringify"),ox=ex(/./.exec),ax=ex("".charAt),ix=ex("".charCodeAt),sx=ex("".replace),lx=ex(1..toString),cx=/[\uD800-\uDFFF]/g,px=/^[\uD800-\uDBFF]$/,dx=/^[\uDC00-\uDFFF]$/,ux=function(e,t,r){var n=ax(r,t-1),o=ax(r,t+1);return ox(px,e)&&!ox(dx,o)||ox(dx,e)&&!ox(px,n)?"\\u"+lx(ix(e,0),16):e},hx=tx((function(){return'"\\udf06\\ud834"'!==nx("\udf06\ud834")||'"\\udead"'!==nx("\udead")}));nx&&Zb({target:"JSON",stat:!0,forced:hx},{stringify:function(e,t,r){for(var n=0,o=arguments.length,a=rx(o);n<o;n++)a[n]=arguments[n];var i=Xb(nx,null,a);return"string"==typeof i?sx(i,cx,ux):i}});var fx=Qr,mx=mr;fx.JSON||(fx.JSON={stringify:JSON.stringify});const yx=ir({exports:{}}.exports=function(e,t,r){return mx(fx.JSON.stringify,null,arguments)});var gx=Cl.map;ka({target:"Array",proto:!0,forced:!Qc("map")},{map:function(e){return gx(this,e,arguments.length>1?arguments[1]:void 0)}});var vx=tp("Array").map,bx=on,xx=vx,wx=Array.prototype;const $x=ir({exports:{}}.exports=function(e){var t=e.map;return e===wx||bx(wx,e)&&t===wx.map?xx:t});const kx=ir({exports:{}}.exports=ei);var Sx=tp("Array").concat,Ax=on,Ex=Sx,Ox=Array.prototype;const Tx=ir({exports:{}}.exports=function(e){var t=e.concat;return e===Ox||Ax(Ox,e)&&t===Ox.concat?Ex:t});var Cx=Sr,_x=wr,jx=Za,Ix=Jr,Px=_x(Tr.f),Rx=_x([].push),Lx=function(e){return function(t){for(var r,n=Ix(t),o=jx(n),a=o.length,i=0,s=[];a>i;)r=o[i++],Cx&&!Px(n,r)||Rx(s,e?[r,n[r]]:n[r]);return s}},Nx=[Lx(!0),Lx(!1)][0];ka({target:"Object",stat:!0},{entries:function(e){return Nx(e)}});var Dx=Qr.Object.entries;const Fx=ir({exports:{}}.exports=Dx);const Ux=ir({exports:{}}.exports=ip);!function(){!function(e){!function(t){var r="URLSearchParams"in e,n="Symbol"in e&&"iterator"in Symbol,o="FileReader"in e&&"Blob"in e&&function(){try{return new Blob,!0}catch(e){return!1}}(),a="FormData"in e,i="ArrayBuffer"in e;if(i)var s=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],l=ArrayBuffer.isView||function(e){return e&&s.indexOf(Object.prototype.toString.call(e))>-1};function c(e){if("string"!=typeof e&&(e=String(e)),/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(e))throw new TypeError("Invalid character in header field name");return e.toLowerCase()}function p(e){return"string"!=typeof e&&(e=String(e)),e}function d(e){var t={next:function(){var t=e.shift();return{done:void 0===t,value:t}}};return n&&(t[Symbol.iterator]=function(){return t}),t}function u(e){this.map={},e instanceof u?e.forEach((function(e,t){this.append(t,e)}),this):Array.isArray(e)?e.forEach((function(e){this.append(e[0],e[1])}),this):e&&Object.getOwnPropertyNames(e).forEach((function(t){this.append(t,e[t])}),this)}function h(e){if(e.bodyUsed)return Promise.reject(new TypeError("Already read"));e.bodyUsed=!0}function f(e){return new Promise((function(t,r){e.onload=function(){t(e.result)},e.onerror=function(){r(e.error)}}))}function m(e){var t=new FileReader,r=f(t);return t.readAsArrayBuffer(e),r}function y(e){if(e.slice)return e.slice(0);var t=new Uint8Array(e.byteLength);return t.set(new Uint8Array(e)),t.buffer}function g(){return this.bodyUsed=!1,this._initBody=function(e){var t;this._bodyInit=e,e?"string"==typeof e?this._bodyText=e:o&&Blob.prototype.isPrototypeOf(e)?this._bodyBlob=e:a&&FormData.prototype.isPrototypeOf(e)?this._bodyFormData=e:r&&URLSearchParams.prototype.isPrototypeOf(e)?this._bodyText=e.toString():i&&o&&(t=e)&&DataView.prototype.isPrototypeOf(t)?(this._bodyArrayBuffer=y(e.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):i&&(ArrayBuffer.prototype.isPrototypeOf(e)||l(e))?this._bodyArrayBuffer=y(e):this._bodyText=e=Object.prototype.toString.call(e):this._bodyText="",this.headers.get("content-type")||("string"==typeof e?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):r&&URLSearchParams.prototype.isPrototypeOf(e)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},o&&(this.blob=function(){var e=h(this);if(e)return e;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?h(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(m)}),this.text=function(){var e,t,r,n=h(this);if(n)return n;if(this._bodyBlob)return e=this._bodyBlob,t=new FileReader,r=f(t),t.readAsText(e),r;if(this._bodyArrayBuffer)return Promise.resolve(function(e){for(var t=new Uint8Array(e),r=new Array(t.length),n=0;n<t.length;n++)r[n]=String.fromCharCode(t[n]);return r.join("")}(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},a&&(this.formData=function(){return this.text().then(x)}),this.json=function(){return this.text().then(JSON.parse)},this}u.prototype.append=function(e,t){e=c(e),t=p(t);var r=this.map[e];this.map[e]=r?r+", "+t:t},u.prototype.delete=function(e){delete this.map[c(e)]},u.prototype.get=function(e){return e=c(e),this.has(e)?this.map[e]:null},u.prototype.has=function(e){return this.map.hasOwnProperty(c(e))},u.prototype.set=function(e,t){this.map[c(e)]=p(t)},u.prototype.forEach=function(e,t){for(var r in this.map)this.map.hasOwnProperty(r)&&e.call(t,this.map[r],r,this)},u.prototype.keys=function(){var e=[];return this.forEach((function(t,r){e.push(r)})),d(e)},u.prototype.values=function(){var e=[];return this.forEach((function(t){e.push(t)})),d(e)},u.prototype.entries=function(){var e=[];return this.forEach((function(t,r){e.push([r,t])})),d(e)},n&&(u.prototype[Symbol.iterator]=u.prototype.entries);var v=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];function b(e,t){var r,n,o=(t=t||{}).body;if(e instanceof b){if(e.bodyUsed)throw new TypeError("Already read");this.url=e.url,this.credentials=e.credentials,t.headers||(this.headers=new u(e.headers)),this.method=e.method,this.mode=e.mode,this.signal=e.signal,o||null==e._bodyInit||(o=e._bodyInit,e.bodyUsed=!0)}else this.url=String(e);if(this.credentials=t.credentials||this.credentials||"same-origin",!t.headers&&this.headers||(this.headers=new u(t.headers)),this.method=(r=t.method||this.method||"GET",n=r.toUpperCase(),v.indexOf(n)>-1?n:r),this.mode=t.mode||this.mode||null,this.signal=t.signal||this.signal,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&o)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(o)}function x(e){var t=new FormData;return e.trim().split("&").forEach((function(e){if(e){var r=e.split("="),n=r.shift().replace(/\+/g," "),o=r.join("=").replace(/\+/g," ");t.append(decodeURIComponent(n),decodeURIComponent(o))}})),t}function w(e,t){t||(t={}),this.type="default",this.status=void 0===t.status?200:t.status,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in t?t.statusText:"OK",this.headers=new u(t.headers),this.url=t.url||"",this._initBody(e)}b.prototype.clone=function(){return new b(this,{body:this._bodyInit})},g.call(b.prototype),g.call(w.prototype),w.prototype.clone=function(){return new w(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new u(this.headers),url:this.url})},w.error=function(){var e=new w(null,{status:0,statusText:""});return e.type="error",e};var $=[301,302,303,307,308];w.redirect=function(e,t){if(-1===$.indexOf(t))throw new RangeError("Invalid status code");return new w(null,{status:t,headers:{location:e}})},t.DOMException=e.DOMException;try{new t.DOMException}catch(e){t.DOMException=function(e,t){this.message=e,this.name=t;var r=Error(e);this.stack=r.stack},t.DOMException.prototype=Object.create(Error.prototype),t.DOMException.prototype.constructor=t.DOMException}function k(e,r){return new Promise((function(n,a){var i=new b(e,r);if(i.signal&&i.signal.aborted)return a(new t.DOMException("Aborted","AbortError"));var s=new XMLHttpRequest;function l(){s.abort()}s.onload=function(){var e,t,r={status:s.status,statusText:s.statusText,headers:(e=s.getAllResponseHeaders()||"",t=new u,e.replace(/\r?\n[\t ]+/g," ").split(/\r?\n/).forEach((function(e){var r=e.split(":"),n=r.shift().trim();if(n){var o=r.join(":").trim();t.append(n,o)}})),t)};r.url="responseURL"in s?s.responseURL:r.headers.get("X-Request-URL");var o="response"in s?s.response:s.responseText;n(new w(o,r))},s.onerror=function(){a(new TypeError("Network request failed"))},s.ontimeout=function(){a(new TypeError("Network request failed"))},s.onabort=function(){a(new t.DOMException("Aborted","AbortError"))},s.open(i.method,i.url,!0),"include"===i.credentials?s.withCredentials=!0:"omit"===i.credentials&&(s.withCredentials=!1),"responseType"in s&&o&&(s.responseType="blob"),i.headers.forEach((function(e,t){s.setRequestHeader(t,e)})),i.signal&&(i.signal.addEventListener("abort",l),s.onreadystatechange=function(){4===s.readyState&&i.signal.removeEventListener("abort",l)}),s.send(void 0===i._bodyInit?null:i._bodyInit)}))}k.polyfill=!0,e.fetch||(e.fetch=k,e.Headers=u,e.Request=b,e.Response=w),t.Headers=u,t.Request=b,t.Response=w,t.fetch=k,Object.defineProperty(t,"t",{value:!0})}({})}("undefined"!=typeof self?self:this)}();var Bx="undefined"!=typeof Symbol&&Symbol,qx="Function.prototype.bind called on incompatible ",zx=Array.prototype.slice,Mx=Object.prototype.toString,Hx=Function.prototype.bind||function(e){var t=this;if("function"!=typeof t||"[object Function]"!==Mx.call(t))throw new TypeError(qx+t);for(var r,n=zx.call(arguments,1),o=function(){if(this instanceof r){var o=t.apply(this,n.concat(zx.call(arguments)));return Object(o)===o?o:this}return t.apply(e,n.concat(zx.call(arguments)))},a=Math.max(0,t.length-n.length),i=[],s=0;s<a;s++)i.push("$"+s);if(r=Function("binder","return function ("+i.join(",")+"){ return binder.apply(this,arguments); }")(o),t.prototype){var l=function(){};l.prototype=t.prototype,r.prototype=new l,l.prototype=null}return r},Wx=Hx.call(Function.call,Object.prototype.hasOwnProperty),Vx=SyntaxError,Gx=Function,Kx=TypeError,Jx=function(e){try{return Gx('"use strict"; return ('+e+").constructor;")()}catch(e){}},Yx=Object.getOwnPropertyDescriptor;if(Yx)try{Yx({},"")}catch(e){Yx=null}var Zx=function(){throw new Kx},Qx=Yx?function(){try{return Zx}catch(e){try{return Yx(arguments,"callee").get}catch(e){return Zx}}}():Zx,Xx="function"==typeof Bx&&"function"==typeof Symbol&&"symbol"==typeof Bx("foo")&&"symbol"==typeof Symbol("bar")&&function(){if("function"!=typeof Symbol||"function"!=typeof Object.getOwnPropertySymbols)return!1;if("symbol"==typeof Symbol.iterator)return!0;var e={},t=Symbol("test"),r=Object(t);if("string"==typeof t)return!1;if("[object Symbol]"!==Object.prototype.toString.call(t))return!1;if("[object Symbol]"!==Object.prototype.toString.call(r))return!1;for(t in e[t]=42,e)return!1;if("function"==typeof Object.keys&&0!==Object.keys(e).length)return!1;if("function"==typeof Object.getOwnPropertyNames&&0!==Object.getOwnPropertyNames(e).length)return!1;var n=Object.getOwnPropertySymbols(e);if(1!==n.length||n[0]!==t)return!1;if(!Object.prototype.propertyIsEnumerable.call(e,t))return!1;if("function"==typeof Object.getOwnPropertyDescriptor){var o=Object.getOwnPropertyDescriptor(e,t);if(42!==o.value||!0!==o.enumerable)return!1}return!0}(),ew=Object.getPrototypeOf||function(e){return e.__proto__},tw={},rw="undefined"==typeof Uint8Array?void 0:ew(Uint8Array),nw={"%AggregateError%":"undefined"==typeof AggregateError?void 0:AggregateError,"%Array%":Array,"%ArrayBuffer%":"undefined"==typeof ArrayBuffer?void 0:ArrayBuffer,"%ArrayIteratorPrototype%":Xx?ew([][Symbol.iterator]()):void 0,"%AsyncFromSyncIteratorPrototype%":void 0,"%AsyncFunction%":tw,"%AsyncGenerator%":tw,"%AsyncGeneratorFunction%":tw,"%AsyncIteratorPrototype%":tw,"%Atomics%":"undefined"==typeof Atomics?void 0:Atomics,"%BigInt%":"undefined"==typeof BigInt?void 0:BigInt,"%Boolean%":Boolean,"%DataView%":"undefined"==typeof DataView?void 0:DataView,"%Date%":Date,"%decodeURI%":decodeURI,"%decodeURIComponent%":decodeURIComponent,"%encodeURI%":encodeURI,"%encodeURIComponent%":encodeURIComponent,"%Error%":Error,"%eval%":eval,"%EvalError%":EvalError,"%Float32Array%":"undefined"==typeof Float32Array?void 0:Float32Array,"%Float64Array%":"undefined"==typeof Float64Array?void 0:Float64Array,"%FinalizationRegistry%":"undefined"==typeof FinalizationRegistry?void 0:FinalizationRegistry,"%Function%":Gx,"%GeneratorFunction%":tw,"%Int8Array%":"undefined"==typeof Int8Array?void 0:Int8Array,"%Int16Array%":"undefined"==typeof Int16Array?void 0:Int16Array,"%Int32Array%":"undefined"==typeof Int32Array?void 0:Int32Array,"%isFinite%":isFinite,"%isNaN%":isNaN,"%IteratorPrototype%":Xx?ew(ew([][Symbol.iterator]())):void 0,"%JSON%":"object"==typeof JSON?JSON:void 0,"%Map%":"undefined"==typeof Map?void 0:Map,"%MapIteratorPrototype%":"undefined"!=typeof Map&&Xx?ew((new Map)[Symbol.iterator]()):void 0,"%Math%":Math,"%Number%":Number,"%Object%":Object,"%parseFloat%":parseFloat,"%parseInt%":parseInt,"%Promise%":"undefined"==typeof Promise?void 0:Promise,"%Proxy%":"undefined"==typeof Proxy?void 0:Proxy,"%RangeError%":RangeError,"%ReferenceError%":ReferenceError,"%Reflect%":"undefined"==typeof Reflect?void 0:Reflect,"%RegExp%":RegExp,"%Set%":"undefined"==typeof Set?void 0:Set,"%SetIteratorPrototype%":"undefined"!=typeof Set&&Xx?ew((new Set)[Symbol.iterator]()):void 0,"%SharedArrayBuffer%":"undefined"==typeof SharedArrayBuffer?void 0:SharedArrayBuffer,"%String%":String,"%StringIteratorPrototype%":Xx?ew(""[Symbol.iterator]()):void 0,"%Symbol%":Xx?Symbol:void 0,"%SyntaxError%":Vx,"%ThrowTypeError%":Qx,"%TypedArray%":rw,"%TypeError%":Kx,"%Uint8Array%":"undefined"==typeof Uint8Array?void 0:Uint8Array,"%Uint8ClampedArray%":"undefined"==typeof Uint8ClampedArray?void 0:Uint8ClampedArray,"%Uint16Array%":"undefined"==typeof Uint16Array?void 0:Uint16Array,"%Uint32Array%":"undefined"==typeof Uint32Array?void 0:Uint32Array,"%URIError%":URIError,"%WeakMap%":"undefined"==typeof WeakMap?void 0:WeakMap,"%WeakRef%":"undefined"==typeof WeakRef?void 0:WeakRef,"%WeakSet%":"undefined"==typeof WeakSet?void 0:WeakSet},ow=function e(t){var r;if("%AsyncFunction%"===t)r=Jx("async function () {}");else if("%GeneratorFunction%"===t)r=Jx("function* () {}");else if("%AsyncGeneratorFunction%"===t)r=Jx("async function* () {}");else if("%AsyncGenerator%"===t){var n=e("%AsyncGeneratorFunction%");n&&(r=n.prototype)}else if("%AsyncIteratorPrototype%"===t){var o=e("%AsyncGenerator%");o&&(r=ew(o.prototype))}return nw[t]=r,r},aw={"%ArrayBufferPrototype%":["ArrayBuffer","prototype"],"%ArrayPrototype%":["Array","prototype"],"%ArrayProto_entries%":["Array","prototype","entries"],"%ArrayProto_forEach%":["Array","prototype","forEach"],"%ArrayProto_keys%":["Array","prototype","keys"],"%ArrayProto_values%":["Array","prototype","values"],"%AsyncFunctionPrototype%":["AsyncFunction","prototype"],"%AsyncGenerator%":["AsyncGeneratorFunction","prototype"],"%AsyncGeneratorPrototype%":["AsyncGeneratorFunction","prototype","prototype"],"%BooleanPrototype%":["Boolean","prototype"],"%DataViewPrototype%":["DataView","prototype"],"%DatePrototype%":["Date","prototype"],"%ErrorPrototype%":["Error","prototype"],"%EvalErrorPrototype%":["EvalError","prototype"],"%Float32ArrayPrototype%":["Float32Array","prototype"],"%Float64ArrayPrototype%":["Float64Array","prototype"],"%FunctionPrototype%":["Function","prototype"],"%Generator%":["GeneratorFunction","prototype"],"%GeneratorPrototype%":["GeneratorFunction","prototype","prototype"],"%Int8ArrayPrototype%":["Int8Array","prototype"],"%Int16ArrayPrototype%":["Int16Array","prototype"],"%Int32ArrayPrototype%":["Int32Array","prototype"],"%JSONParse%":["JSON","parse"],"%JSONStringify%":["JSON","stringify"],"%MapPrototype%":["Map","prototype"],"%NumberPrototype%":["Number","prototype"],"%ObjectPrototype%":["Object","prototype"],"%ObjProto_toString%":["Object","prototype","toString"],"%ObjProto_valueOf%":["Object","prototype","valueOf"],"%PromisePrototype%":["Promise","prototype"],"%PromiseProto_then%":["Promise","prototype","then"],"%Promise_all%":["Promise","all"],"%Promise_reject%":["Promise","reject"],"%Promise_resolve%":["Promise","resolve"],"%RangeErrorPrototype%":["RangeError","prototype"],"%ReferenceErrorPrototype%":["ReferenceError","prototype"],"%RegExpPrototype%":["RegExp","prototype"],"%SetPrototype%":["Set","prototype"],"%SharedArrayBufferPrototype%":["SharedArrayBuffer","prototype"],"%StringPrototype%":["String","prototype"],"%SymbolPrototype%":["Symbol","prototype"],"%SyntaxErrorPrototype%":["SyntaxError","prototype"],"%TypedArrayPrototype%":["TypedArray","prototype"],"%TypeErrorPrototype%":["TypeError","prototype"],"%Uint8ArrayPrototype%":["Uint8Array","prototype"],"%Uint8ClampedArrayPrototype%":["Uint8ClampedArray","prototype"],"%Uint16ArrayPrototype%":["Uint16Array","prototype"],"%Uint32ArrayPrototype%":["Uint32Array","prototype"],"%URIErrorPrototype%":["URIError","prototype"],"%WeakMapPrototype%":["WeakMap","prototype"],"%WeakSetPrototype%":["WeakSet","prototype"]},iw=Hx,sw=Wx,lw=iw.call(Function.call,Array.prototype.concat),cw=iw.call(Function.apply,Array.prototype.splice),pw=iw.call(Function.call,String.prototype.replace),dw=iw.call(Function.call,String.prototype.slice),uw=/[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g,hw=/\\(\\)?/g,fw=function(e){var t=dw(e,0,1),r=dw(e,-1);if("%"===t&&"%"!==r)throw new Vx("invalid intrinsic syntax, expected closing `%`");if("%"===r&&"%"!==t)throw new Vx("invalid intrinsic syntax, expected opening `%`");var n=[];return pw(e,uw,(function(e,t,r,o){n[n.length]=r?pw(o,hw,"$1"):t||e})),n},mw=function(e,t){var r,n=e;if(sw(aw,n)&&(n="%"+(r=aw[n])[0]+"%"),sw(nw,n)){var o=nw[n];if(o===tw&&(o=ow(n)),void 0===o&&!t)throw new Kx("intrinsic "+e+" exists, but is not available. Please file an issue!");return{alias:r,name:n,value:o}}throw new Vx("intrinsic "+e+" does not exist!")},yw=function(e,t){if("string"!=typeof e||0===e.length)throw new Kx("intrinsic name must be a non-empty string");if(arguments.length>1&&"boolean"!=typeof t)throw new Kx('"allowMissing" argument must be a boolean');var r=fw(e),n=r.length>0?r[0]:"",o=mw("%"+n+"%",t),a=o.name,i=o.value,s=!1,l=o.alias;l&&(n=l[0],cw(r,lw([0,1],l)));for(var c=1,p=!0;c<r.length;c+=1){var d=r[c],u=dw(d,0,1),h=dw(d,-1);if(('"'===u||"'"===u||"`"===u||'"'===h||"'"===h||"`"===h)&&u!==h)throw new Vx("property names with quotes must have matching quotes");if("constructor"!==d&&p||(s=!0),sw(nw,a="%"+(n+="."+d)+"%"))i=nw[a];else if(null!=i){if(!(d in i)){if(!t)throw new Kx("base intrinsic for "+e+" exists, but the property is not available.");return}if(Yx&&c+1>=r.length){var f=Yx(i,d);i=(p=!!f)&&"get"in f&&!("originalValue"in f.get)?f.get:i[d]}else p=sw(i,d),i=i[d];p&&!s&&(nw[a]=i)}}return i},gw={exports:{}};!function(e){var t=Hx,r=yw,n=r("%Function.prototype.apply%"),o=r("%Function.prototype.call%"),a=r("%Reflect.apply%",!0)||t.call(o,n),i=r("%Object.getOwnPropertyDescriptor%",!0),s=r("%Object.defineProperty%",!0),l=r("%Math.max%");if(s)try{s({},"a",{value:1})}catch(e){s=null}e.exports=function(e){var r=a(t,o,arguments);if(i&&s){var n=i(r,"length");n.configurable&&s(r,"length",{value:1+l(0,e.length-(arguments.length-1))})}return r};var c=function(){return a(t,n,arguments)};s?s(e.exports,"apply",{value:c}):e.exports.apply=c}(gw);var vw=yw,bw=gw.exports,xw=bw(vw("String.prototype.indexOf"));const ww=function(e){var t=e.default;if("function"==typeof t){var r=function(){return t.apply(this,arguments)};r.prototype=t.prototype}else r={};return Object.defineProperty(r,"t",{value:!0}),Object.keys(e).forEach((function(t){var n=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(r,t,n.get?n:{enumerable:!0,get:function(){return e[t]}})})),r}(Object.freeze(Object.defineProperty({__proto__:null,default:{}},Symbol.toStringTag,{value:"Module"})));var $w="function"==typeof Map&&Map.prototype,kw=Object.getOwnPropertyDescriptor&&$w?Object.getOwnPropertyDescriptor(Map.prototype,"size"):null,Sw=$w&&kw&&"function"==typeof kw.get?kw.get:null,Aw=$w&&Map.prototype.forEach,Ew="function"==typeof Set&&Set.prototype,Ow=Object.getOwnPropertyDescriptor&&Ew?Object.getOwnPropertyDescriptor(Set.prototype,"size"):null,Tw=Ew&&Ow&&"function"==typeof Ow.get?Ow.get:null,Cw=Ew&&Set.prototype.forEach,_w="function"==typeof WeakMap&&WeakMap.prototype?WeakMap.prototype.has:null,jw="function"==typeof WeakSet&&WeakSet.prototype?WeakSet.prototype.has:null,Iw="function"==typeof WeakRef&&WeakRef.prototype?WeakRef.prototype.deref:null,Pw=Boolean.prototype.valueOf,Rw=Object.prototype.toString,Lw=Function.prototype.toString,Nw=String.prototype.match,Dw=String.prototype.slice,Fw=String.prototype.replace,Uw=String.prototype.toUpperCase,Bw=String.prototype.toLowerCase,qw=RegExp.prototype.test,zw=Array.prototype.concat,Mw=Array.prototype.join,Hw=Array.prototype.slice,Ww=Math.floor,Vw="function"==typeof BigInt?BigInt.prototype.valueOf:null,Gw=Object.getOwnPropertySymbols,Kw="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?Symbol.prototype.toString:null,Jw="function"==typeof Symbol&&"object"==typeof Symbol.iterator,Yw="function"==typeof Symbol&&Symbol.toStringTag&&(Symbol.toStringTag,1)?Symbol.toStringTag:null,Zw=Object.prototype.propertyIsEnumerable,Qw=("function"==typeof Reflect?Reflect.getPrototypeOf:Object.getPrototypeOf)||([].__proto__===Array.prototype?function(e){return e.__proto__}:null);function Xw(e,t){if(e===1/0||e===-1/0||e!=e||e&&e>-1e3&&e<1e3||qw.call(/e/,t))return t;var r=/[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;if("number"==typeof e){var n=e<0?-Ww(-e):Ww(e);if(n!==e){var o=String(n),a=Dw.call(t,o.length+1);return Fw.call(o,r,"$&_")+"."+Fw.call(Fw.call(a,/([0-9]{3})/g,"$&_"),/_$/,"")}}return Fw.call(t,r,"$&_")}var e$=ww.custom,t$=e$&&a$(e$)?e$:null;function r$(e,t,r){var n="double"===(r.quoteStyle||t)?'"':"'";return n+e+n}function n$(e){return Fw.call(String(e),/"/g,"&quot;")}function o$(e){return!("[object Array]"!==l$(e)||Yw&&"object"==typeof e&&Yw in e)}function a$(e){if(Jw)return e&&"object"==typeof e&&e instanceof Symbol;if("symbol"==typeof e)return!0;if(!e||"object"!=typeof e||!Kw)return!1;try{return Kw.call(e),!0}catch(e){}return!1}var i$=Object.prototype.hasOwnProperty||function(e){return e in this};function s$(e,t){return i$.call(e,t)}function l$(e){return Rw.call(e)}function c$(e,t){if(e.indexOf)return e.indexOf(t);for(var r=0,n=e.length;r<n;r++)if(e[r]===t)return r;return-1}function p$(e,t){if(e.length>t.maxStringLength){var r=e.length-t.maxStringLength,n="... "+r+" more character"+(r>1?"s":"");return p$(Dw.call(e,0,t.maxStringLength),t)+n}return r$(Fw.call(Fw.call(e,/(['\\])/g,"\\$1"),/[\x00-\x1f]/g,d$),"single",t)}function d$(e){var t=e.charCodeAt(0),r={8:"b",9:"t",10:"n",12:"f",13:"r"}[t];return r?"\\"+r:"\\x"+(t<16?"0":"")+Uw.call(t.toString(16))}function u$(e){return"Object("+e+")"}function h$(e){return e+" { ? }"}function f$(e,t,r,n){return e+" ("+t+") {"+(n?m$(r,n):Mw.call(r,", "))+"}"}function m$(e,t){if(0===e.length)return"";var r="\n"+t.prev+t.base;return r+Mw.call(e,","+r)+"\n"+t.prev}function y$(e,t){var r=o$(e),n=[];if(r){n.length=e.length;for(var o=0;o<e.length;o++)n[o]=s$(e,o)?t(e[o],e):""}var a,i="function"==typeof Gw?Gw(e):[];if(Jw){a={};for(var s=0;s<i.length;s++)a["$"+i[s]]=i[s]}for(var l in e)s$(e,l)&&(r&&String(Number(l))===l&&l<e.length||Jw&&a["$"+l]instanceof Symbol||(qw.call(/[^\w$]/,l)?n.push(t(l,e)+": "+t(e[l],e)):n.push(l+": "+t(e[l],e))));if("function"==typeof Gw)for(var c=0;c<i.length;c++)Zw.call(e,i[c])&&n.push("["+t(i[c])+"]: "+t(e[i[c]],e));return n}var g$=yw,v$=function(e,t){var r=vw(e,!!t);return"function"==typeof r&&xw(e,".prototype.")>-1?bw(r):r},b$=function e(t,r,n,o){var a=r||{};if(s$(a,"quoteStyle")&&"single"!==a.quoteStyle&&"double"!==a.quoteStyle)throw new TypeError('option "quoteStyle" must be "single" or "double"');if(s$(a,"maxStringLength")&&("number"==typeof a.maxStringLength?a.maxStringLength<0&&a.maxStringLength!==1/0:null!==a.maxStringLength))throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');var i=!s$(a,"customInspect")||a.customInspect;if("boolean"!=typeof i&&"symbol"!==i)throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");if(s$(a,"indent")&&null!==a.indent&&"\t"!==a.indent&&!(parseInt(a.indent,10)===a.indent&&a.indent>0))throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');if(s$(a,"numericSeparator")&&"boolean"!=typeof a.numericSeparator)throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');var s=a.numericSeparator;if(void 0===t)return"undefined";if(null===t)return"null";if("boolean"==typeof t)return t?"true":"false";if("string"==typeof t)return p$(t,a);if("number"==typeof t){if(0===t)return 1/0/t>0?"0":"-0";var l=String(t);return s?Xw(t,l):l}if("bigint"==typeof t){var c=String(t)+"n";return s?Xw(t,c):c}var p=void 0===a.depth?5:a.depth;if(void 0===n&&(n=0),n>=p&&p>0&&"object"==typeof t)return o$(t)?"[Array]":"[Object]";var d=function(e,t){var r;if("\t"===e.indent)r="\t";else{if(!("number"==typeof e.indent&&e.indent>0))return null;r=Mw.call(Array(e.indent+1)," ")}return{base:r,prev:Mw.call(Array(t+1),r)}}(a,n);if(void 0===o)o=[];else if(c$(o,t)>=0)return"[Circular]";function u(t,r,i){if(r&&(o=Hw.call(o)).push(r),i){var s={depth:a.depth};return s$(a,"quoteStyle")&&(s.quoteStyle=a.quoteStyle),e(t,s,n+1,o)}return e(t,a,n+1,o)}if("function"==typeof t){var h=function(e){if(e.name)return e.name;var t=Nw.call(Lw.call(e),/^function\s*([\w$]+)/);return t?t[1]:null}(t),f=y$(t,u);return"[Function"+(h?": "+h:" (anonymous)")+"]"+(f.length>0?" { "+Mw.call(f,", ")+" }":"")}if(a$(t)){var m=Jw?Fw.call(String(t),/^(Symbol\(.*\))_[^)]*$/,"$1"):Kw.call(t);return"object"!=typeof t||Jw?m:u$(m)}if(function(e){return!(!e||"object"!=typeof e)&&("undefined"!=typeof HTMLElement&&e instanceof HTMLElement||"string"==typeof e.nodeName&&"function"==typeof e.getAttribute)}(t)){for(var y="<"+Bw.call(String(t.nodeName)),g=t.attributes||[],v=0;v<g.length;v++)y+=" "+g[v].name+"="+r$(n$(g[v].value),"double",a);return y+=">",t.childNodes&&t.childNodes.length&&(y+="..."),y+"</"+Bw.call(String(t.nodeName))+">"}if(o$(t)){if(0===t.length)return"[]";var b=y$(t,u);return d&&!function(e){for(var t=0;t<e.length;t++)if(c$(e[t],"\n")>=0)return!1;return!0}(b)?"["+m$(b,d)+"]":"[ "+Mw.call(b,", ")+" ]"}if(function(e){return!("[object Error]"!==l$(e)||Yw&&"object"==typeof e&&Yw in e)}(t)){var x=y$(t,u);return"cause"in t&&!Zw.call(t,"cause")?"{ ["+String(t)+"] "+Mw.call(zw.call("[cause]: "+u(t.cause),x),", ")+" }":0===x.length?"["+String(t)+"]":"{ ["+String(t)+"] "+Mw.call(x,", ")+" }"}if("object"==typeof t&&i){if(t$&&"function"==typeof t[t$])return t[t$]();if("symbol"!==i&&"function"==typeof t.inspect)return t.inspect()}if(function(e){if(!Sw||!e||"object"!=typeof e)return!1;try{Sw.call(e);try{Tw.call(e)}catch(e){return!0}return e instanceof Map}catch(e){}return!1}(t)){var w=[];return Aw.call(t,(function(e,r){w.push(u(r,t,!0)+" => "+u(e,t))})),f$("Map",Sw.call(t),w,d)}if(function(e){if(!Tw||!e||"object"!=typeof e)return!1;try{Tw.call(e);try{Sw.call(e)}catch(e){return!0}return e instanceof Set}catch(e){}return!1}(t)){var $=[];return Cw.call(t,(function(e){$.push(u(e,t))})),f$("Set",Tw.call(t),$,d)}if(function(e){if(!_w||!e||"object"!=typeof e)return!1;try{_w.call(e,_w);try{jw.call(e,jw)}catch(e){return!0}return e instanceof WeakMap}catch(e){}return!1}(t))return h$("WeakMap");if(function(e){if(!jw||!e||"object"!=typeof e)return!1;try{jw.call(e,jw);try{_w.call(e,_w)}catch(e){return!0}return e instanceof WeakSet}catch(e){}return!1}(t))return h$("WeakSet");if(function(e){if(!Iw||!e||"object"!=typeof e)return!1;try{return Iw.call(e),!0}catch(e){}return!1}(t))return h$("WeakRef");if(function(e){return!("[object Number]"!==l$(e)||Yw&&"object"==typeof e&&Yw in e)}(t))return u$(u(Number(t)));if(function(e){if(!e||"object"!=typeof e||!Vw)return!1;try{return Vw.call(e),!0}catch(e){}return!1}(t))return u$(u(Vw.call(t)));if(function(e){return!("[object Boolean]"!==l$(e)||Yw&&"object"==typeof e&&Yw in e)}(t))return u$(Pw.call(t));if(function(e){return!("[object String]"!==l$(e)||Yw&&"object"==typeof e&&Yw in e)}(t))return u$(u(String(t)));if(!function(e){return!("[object Date]"!==l$(e)||Yw&&"object"==typeof e&&Yw in e)}(t)&&!function(e){return!("[object RegExp]"!==l$(e)||Yw&&"object"==typeof e&&Yw in e)}(t)){var k=y$(t,u),S=Qw?Qw(t)===Object.prototype:t instanceof Object||t.constructor===Object,A=t instanceof Object?"":"null prototype",E=!S&&Yw&&Object(t)===t&&Yw in t?Dw.call(l$(t),8,-1):A?"Object":"",O=(S||"function"!=typeof t.constructor?"":t.constructor.name?t.constructor.name+" ":"")+(E||A?"["+Mw.call(zw.call([],E||[],A||[]),": ")+"] ":"");return 0===k.length?O+"{}":d?O+"{"+m$(k,d)+"}":O+"{ "+Mw.call(k,", ")+" }"}return String(t)},x$=g$("%TypeError%"),w$=g$("%WeakMap%",!0),$$=g$("%Map%",!0),k$=v$("WeakMap.prototype.get",!0),S$=v$("WeakMap.prototype.set",!0),A$=v$("WeakMap.prototype.has",!0),E$=v$("Map.prototype.get",!0),O$=v$("Map.prototype.set",!0),T$=v$("Map.prototype.has",!0),C$=function(e,t){for(var r,n=e;null!==(r=n.next);n=r)if(r.key===t)return n.next=r.next,r.next=e.next,e.next=r,r},_$=String.prototype.replace,j$=/%20/g,I$="RFC3986",P$={default:I$,formatters:{RFC1738:function(e){return _$.call(e,j$,"+")},RFC3986:function(e){return String(e)}},RFC1738:"RFC1738",RFC3986:I$},R$=P$,L$=Object.prototype.hasOwnProperty,N$=Array.isArray,D$=function(){for(var e=[],t=0;t<256;++t)e.push("%"+((t<16?"0":"")+t.toString(16)).toUpperCase());return e}(),F$=function(e,t){for(var r=t&&t.plainObjects?Object.create(null):{},n=0;n<e.length;++n)void 0!==e[n]&&(r[n]=e[n]);return r},U$={arrayToObject:F$,assign:function(e,t){return Object.keys(t).reduce((function(e,r){return e[r]=t[r],e}),e)},combine:function(e,t){return[].concat(e,t)},compact:function(e){for(var t=[{obj:{o:e},prop:"o"}],r=[],n=0;n<t.length;++n)for(var o=t[n],a=o.obj[o.prop],i=Object.keys(a),s=0;s<i.length;++s){var l=i[s],c=a[l];"object"==typeof c&&null!==c&&-1===r.indexOf(c)&&(t.push({obj:a,prop:l}),r.push(c))}return function(e){for(;e.length>1;){var t=e.pop(),r=t.obj[t.prop];if(N$(r)){for(var n=[],o=0;o<r.length;++o)void 0!==r[o]&&n.push(r[o]);t.obj[t.prop]=n}}}(t),e},decode:function(e,t,r){var n=e.replace(/\+/g," ");if("iso-8859-1"===r)return n.replace(/%[0-9a-f]{2}/gi,unescape);try{return decodeURIComponent(n)}catch(e){return n}},encode:function(e,t,r,n,o){if(0===e.length)return e;var a=e;if("symbol"==typeof e?a=Symbol.prototype.toString.call(e):"string"!=typeof e&&(a=String(e)),"iso-8859-1"===r)return escape(a).replace(/%u[0-9a-f]{4}/gi,(function(e){return"%26%23"+parseInt(e.slice(2),16)+"%3B"}));for(var i="",s=0;s<a.length;++s){var l=a.charCodeAt(s);45===l||46===l||95===l||126===l||l>=48&&l<=57||l>=65&&l<=90||l>=97&&l<=122||o===R$.RFC1738&&(40===l||41===l)?i+=a.charAt(s):l<128?i+=D$[l]:l<2048?i+=D$[192|l>>6]+D$[128|63&l]:l<55296||l>=57344?i+=D$[224|l>>12]+D$[128|l>>6&63]+D$[128|63&l]:(s+=1,l=65536+((1023&l)<<10|1023&a.charCodeAt(s)),i+=D$[240|l>>18]+D$[128|l>>12&63]+D$[128|l>>6&63]+D$[128|63&l])}return i},isBuffer:function(e){return!(!e||"object"!=typeof e||!(e.constructor&&e.constructor.isBuffer&&e.constructor.isBuffer(e)))},isRegExp:function(e){return"[object RegExp]"===Object.prototype.toString.call(e)},maybeMap:function(e,t){if(N$(e)){for(var r=[],n=0;n<e.length;n+=1)r.push(t(e[n]));return r}return t(e)},merge:function e(t,r,n){if(!r)return t;if("object"!=typeof r){if(N$(t))t.push(r);else{if(!t||"object"!=typeof t)return[t,r];(n&&(n.plainObjects||n.allowPrototypes)||!L$.call(Object.prototype,r))&&(t[r]=!0)}return t}if(!t||"object"!=typeof t)return[t].concat(r);var o=t;return N$(t)&&!N$(r)&&(o=F$(t,n)),N$(t)&&N$(r)?(r.forEach((function(r,o){if(L$.call(t,o)){var a=t[o];a&&"object"==typeof a&&r&&"object"==typeof r?t[o]=e(a,r,n):t.push(r)}else t[o]=r})),t):Object.keys(r).reduce((function(t,o){var a=r[o];return L$.call(t,o)?t[o]=e(t[o],a,n):t[o]=a,t}),o)}},B$=function(){var e,t,r,n={assert:function(e){if(!n.has(e))throw new x$("Side channel does not contain "+b$(e))},get:function(n){if(w$&&n&&("object"==typeof n||"function"==typeof n)){if(e)return k$(e,n)}else if($$){if(t)return E$(t,n)}else if(r)return(o=C$(r,n))&&o.value;var o},has:function(n){if(w$&&n&&("object"==typeof n||"function"==typeof n)){if(e)return A$(e,n)}else if($$){if(t)return T$(t,n)}else if(r)return!!C$(r,n);return!1},set:function(n,o){var a,i,s,l;w$&&n&&("object"==typeof n||"function"==typeof n)?(e||(e=new w$),S$(e,n,o)):$$?(t||(t=new $$),O$(t,n,o)):(r||(r={key:{},next:null}),s=o,(l=C$(a=r,i=n))?l.value=s:a.next={key:i,next:a.next,value:s})}};return n},q$=U$,z$=P$,M$=Object.prototype.hasOwnProperty,H$={brackets:function(e){return e+"[]"},comma:"comma",indices:function(e,t){return e+"["+t+"]"},repeat:function(e){return e}},W$=Array.isArray,V$=String.prototype.split,G$=Array.prototype.push,K$=function(e,t){G$.apply(e,W$(t)?t:[t])},J$=Date.prototype.toISOString,Y$=z$.default,Z$={addQueryPrefix:!1,allowDots:!1,charset:"utf-8",charsetSentinel:!1,delimiter:"&",encode:!0,encoder:q$.encode,encodeValuesOnly:!1,format:Y$,formatter:z$.formatters[Y$],indices:!1,serializeDate:function(e){return J$.call(e)},skipNulls:!1,strictNullHandling:!1},Q$={},X$=function e(t,r,n,o,a,i,s,l,c,p,d,u,h,f,m){for(var y,g=t,v=m,b=0,x=!1;void 0!==(v=v.get(Q$))&&!x;){var w=v.get(t);if(b+=1,void 0!==w){if(w===b)throw new RangeError("Cyclic object value");x=!0}void 0===v.get(Q$)&&(b=0)}if("function"==typeof s?g=s(r,g):g instanceof Date?g=p(g):"comma"===n&&W$(g)&&(g=q$.maybeMap(g,(function(e){return e instanceof Date?p(e):e}))),null===g){if(o)return i&&!h?i(r,Z$.encoder,f,"key",d):r;g=""}if("string"==typeof(y=g)||"number"==typeof y||"boolean"==typeof y||"symbol"==typeof y||"bigint"==typeof y||q$.isBuffer(g)){if(i){var $=h?r:i(r,Z$.encoder,f,"key",d);if("comma"===n&&h){for(var k=V$.call(String(g),","),S="",A=0;A<k.length;++A)S+=(0===A?"":",")+u(i(k[A],Z$.encoder,f,"value",d));return[u($)+"="+S]}return[u($)+"="+u(i(g,Z$.encoder,f,"value",d))]}return[u(r)+"="+u(String(g))]}var E,O=[];if(void 0===g)return O;if("comma"===n&&W$(g))E=[{value:g.length>0?g.join(",")||null:void 0}];else if(W$(s))E=s;else{var T=Object.keys(g);E=l?T.sort(l):T}for(var C=0;C<E.length;++C){var _=E[C],j="object"==typeof _&&void 0!==_.value?_.value:g[_];if(!a||null!==j){var I=W$(g)?"function"==typeof n?n(r,_):r:r+(c?"."+_:"["+_+"]");m.set(t,b);var P=B$();P.set(Q$,m),K$(O,e(j,I,n,o,a,i,s,l,c,p,d,u,h,f,P))}}return O},ek=U$,tk=Object.prototype.hasOwnProperty,rk=Array.isArray,nk={allowDots:!1,allowPrototypes:!1,allowSparse:!1,arrayLimit:20,charset:"utf-8",charsetSentinel:!1,comma:!1,decoder:ek.decode,delimiter:"&",depth:5,ignoreQueryPrefix:!1,interpretNumericEntities:!1,parameterLimit:1e3,parseArrays:!0,plainObjects:!1,strictNullHandling:!1},ok=function(e){return e.replace(/&#(\d+);/g,(function(e,t){return String.fromCharCode(parseInt(t,10))}))},ak=function(e,t){return e&&"string"==typeof e&&t.comma&&e.indexOf(",")>-1?e.split(","):e},ik=function(e,t,r,n){if(e){var o=r.allowDots?e.replace(/\.([^.[]+)/g,"[$1]"):e,a=/(\[[^[\]]*])/g,i=r.depth>0&&/(\[[^[\]]*])/.exec(o),s=i?o.slice(0,i.index):o,l=[];if(s){if(!r.plainObjects&&tk.call(Object.prototype,s)&&!r.allowPrototypes)return;l.push(s)}for(var c=0;r.depth>0&&null!==(i=a.exec(o))&&c<r.depth;){if(c+=1,!r.plainObjects&&tk.call(Object.prototype,i[1].slice(1,-1))&&!r.allowPrototypes)return;l.push(i[1])}return i&&l.push("["+o.slice(i.index)+"]"),function(e,t,r,n){for(var o=n?t:ak(t,r),a=e.length-1;a>=0;--a){var i,s=e[a];if("[]"===s&&r.parseArrays)i=[].concat(o);else{i=r.plainObjects?Object.create(null):{};var l="["===s.charAt(0)&&"]"===s.charAt(s.length-1)?s.slice(1,-1):s,c=parseInt(l,10);r.parseArrays||""!==l?!isNaN(c)&&s!==l&&String(c)===l&&c>=0&&r.parseArrays&&c<=r.arrayLimit?(i=[])[c]=o:"__proto__"!==l&&(i[l]=o):i={0:o}}o=i}return o}(l,t,r,n)}},sk=function(e,t){var r=function(e){if(!e)return nk;if(null!==e.decoder&&void 0!==e.decoder&&"function"!=typeof e.decoder)throw new TypeError("Decoder has to be a function.");if(void 0!==e.charset&&"utf-8"!==e.charset&&"iso-8859-1"!==e.charset)throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");var t=void 0===e.charset?nk.charset:e.charset;return{allowDots:void 0===e.allowDots?nk.allowDots:!!e.allowDots,allowPrototypes:"boolean"==typeof e.allowPrototypes?e.allowPrototypes:nk.allowPrototypes,allowSparse:"boolean"==typeof e.allowSparse?e.allowSparse:nk.allowSparse,arrayLimit:"number"==typeof e.arrayLimit?e.arrayLimit:nk.arrayLimit,charset:t,charsetSentinel:"boolean"==typeof e.charsetSentinel?e.charsetSentinel:nk.charsetSentinel,comma:"boolean"==typeof e.comma?e.comma:nk.comma,decoder:"function"==typeof e.decoder?e.decoder:nk.decoder,delimiter:"string"==typeof e.delimiter||ek.isRegExp(e.delimiter)?e.delimiter:nk.delimiter,depth:"number"==typeof e.depth||!1===e.depth?+e.depth:nk.depth,ignoreQueryPrefix:!0===e.ignoreQueryPrefix,interpretNumericEntities:"boolean"==typeof e.interpretNumericEntities?e.interpretNumericEntities:nk.interpretNumericEntities,parameterLimit:"number"==typeof e.parameterLimit?e.parameterLimit:nk.parameterLimit,parseArrays:!1!==e.parseArrays,plainObjects:"boolean"==typeof e.plainObjects?e.plainObjects:nk.plainObjects,strictNullHandling:"boolean"==typeof e.strictNullHandling?e.strictNullHandling:nk.strictNullHandling}}(t);if(""===e||null==e)return r.plainObjects?Object.create(null):{};for(var n="string"==typeof e?function(e,t){var r,n={},o=t.ignoreQueryPrefix?e.replace(/^\?/,""):e,a=t.parameterLimit===1/0?void 0:t.parameterLimit,i=o.split(t.delimiter,a),s=-1,l=t.charset;if(t.charsetSentinel)for(r=0;r<i.length;++r)0===i[r].indexOf("utf8=")&&("utf8=%E2%9C%93"===i[r]?l="utf-8":"utf8=%26%2310003%3B"===i[r]&&(l="iso-8859-1"),s=r,r=i.length);for(r=0;r<i.length;++r)if(r!==s){var c,p,d=i[r],u=d.indexOf("]="),h=-1===u?d.indexOf("="):u+1;-1===h?(c=t.decoder(d,nk.decoder,l,"key"),p=t.strictNullHandling?null:""):(c=t.decoder(d.slice(0,h),nk.decoder,l,"key"),p=ek.maybeMap(ak(d.slice(h+1),t),(function(e){return t.decoder(e,nk.decoder,l,"value")}))),p&&t.interpretNumericEntities&&"iso-8859-1"===l&&(p=ok(p)),d.indexOf("[]=")>-1&&(p=rk(p)?[p]:p),tk.call(n,c)?n[c]=ek.combine(n[c],p):n[c]=p}return n}(e,r):e,o=r.plainObjects?Object.create(null):{},a=Object.keys(n),i=0;i<a.length;++i){var s=a[i],l=ik(s,n[s],r,"string"==typeof e);o=ek.merge(o,l,r)}return!0===r.allowSparse?o:ek.compact(o)},lk=function(e,t){var r,n=e,o=function(e){if(!e)return Z$;if(null!==e.encoder&&void 0!==e.encoder&&"function"!=typeof e.encoder)throw new TypeError("Encoder has to be a function.");var t=e.charset||Z$.charset;if(void 0!==e.charset&&"utf-8"!==e.charset&&"iso-8859-1"!==e.charset)throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");var r=z$.default;if(void 0!==e.format){if(!M$.call(z$.formatters,e.format))throw new TypeError("Unknown format option provided.");r=e.format}var n=z$.formatters[r],o=Z$.filter;return("function"==typeof e.filter||W$(e.filter))&&(o=e.filter),{addQueryPrefix:"boolean"==typeof e.addQueryPrefix?e.addQueryPrefix:Z$.addQueryPrefix,allowDots:void 0===e.allowDots?Z$.allowDots:!!e.allowDots,charset:t,charsetSentinel:"boolean"==typeof e.charsetSentinel?e.charsetSentinel:Z$.charsetSentinel,delimiter:void 0===e.delimiter?Z$.delimiter:e.delimiter,encode:"boolean"==typeof e.encode?e.encode:Z$.encode,encoder:"function"==typeof e.encoder?e.encoder:Z$.encoder,encodeValuesOnly:"boolean"==typeof e.encodeValuesOnly?e.encodeValuesOnly:Z$.encodeValuesOnly,filter:o,format:r,formatter:n,serializeDate:"function"==typeof e.serializeDate?e.serializeDate:Z$.serializeDate,skipNulls:"boolean"==typeof e.skipNulls?e.skipNulls:Z$.skipNulls,sort:"function"==typeof e.sort?e.sort:null,strictNullHandling:"boolean"==typeof e.strictNullHandling?e.strictNullHandling:Z$.strictNullHandling}}(t);"function"==typeof o.filter?n=(0,o.filter)("",n):W$(o.filter)&&(r=o.filter);var a,i=[];if("object"!=typeof n||null===n)return"";a=t&&t.arrayFormat in H$?t.arrayFormat:t&&"indices"in t?t.indices?"indices":"repeat":"indices";var s=H$[a];r||(r=Object.keys(n)),o.sort&&r.sort(o.sort);for(var l=B$(),c=0;c<r.length;++c){var p=r[c];o.skipNulls&&null===n[p]||K$(i,X$(n[p],p,s,o.strictNullHandling,o.skipNulls,o.encode?o.encoder:null,o.filter,o.sort,o.allowDots,o.serializeDate,o.format,o.formatter,o.encodeValuesOnly,o.charset,l))}var d=i.join(o.delimiter),u=!0===o.addQueryPrefix?"?":"";return o.charsetSentinel&&("iso-8859-1"===o.charset?u+="utf8=%26%2310003%3B&":u+="utf8=%E2%9C%93&"),d.length>0?u+d:""};function ck(e){return null==e}var pk={isNothing:ck,isObject:function(e){return"object"==typeof e&&null!==e},toArray:function(e){return Array.isArray(e)?e:ck(e)?[]:[e]},repeat:function(e,t){var r,n="";for(r=0;r<t;r+=1)n+=e;return n},isNegativeZero:function(e){return 0===e&&Number.NEGATIVE_INFINITY===1/e},extend:function(e,t){var r,n,o,a;if(t)for(r=0,n=(a=Object.keys(t)).length;r<n;r+=1)e[o=a[r]]=t[o];return e}};function dk(e,t){var r="",n=e.reason||"(unknown reason)";return e.mark?(e.mark.name&&(r+='in "'+e.mark.name+'" '),r+="("+(e.mark.line+1)+":"+(e.mark.column+1)+")",!t&&e.mark.snippet&&(r+="\n\n"+e.mark.snippet),n+" "+r):n}function uk(e,t){Error.call(this),this.name="YAMLException",this.reason=e,this.mark=t,this.message=dk(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack||""}uk.prototype=Object.create(Error.prototype),uk.prototype.constructor=uk,uk.prototype.toString=function(e){return this.name+": "+dk(this,e)};var hk=uk;function fk(e,t,r,n,o){var a="",i="",s=Math.floor(o/2)-1;return n-t>s&&(t=n-s+(a=" ... ").length),r-n>s&&(r=n+s-(i=" ...").length),{str:a+e.slice(t,r).replace(/\t/g,"→")+i,pos:n-t+a.length}}function mk(e,t){return pk.repeat(" ",t-e.length)+e}var yk=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],gk=["scalar","sequence","mapping"],vk=function(e,t){if(t=t||{},Object.keys(t).forEach((function(t){if(-1===yk.indexOf(t))throw new hk('Unknown option "'+t+'" is met in definition of "'+e+'" YAML type.')})),this.options=t,this.tag=e,this.kind=t.kind||null,this.resolve=t.resolve||function(){return!0},this.construct=t.construct||function(e){return e},this.instanceOf=t.instanceOf||null,this.predicate=t.predicate||null,this.represent=t.represent||null,this.representName=t.representName||null,this.defaultStyle=t.defaultStyle||null,this.multi=t.multi||!1,this.styleAliases=(r=t.styleAliases||null,n={},null!==r&&Object.keys(r).forEach((function(e){r[e].forEach((function(t){n[String(t)]=e}))})),n),-1===gk.indexOf(this.kind))throw new hk('Unknown kind "'+this.kind+'" is specified for "'+e+'" YAML type.');var r,n};function bk(e,t){var r=[];return e[t].forEach((function(e){var t=r.length;r.forEach((function(r,n){r.tag===e.tag&&r.kind===e.kind&&r.multi===e.multi&&(t=n)})),r[t]=e})),r}function xk(e){return this.extend(e)}xk.prototype.extend=function(e){var t=[],r=[];if(e instanceof vk)r.push(e);else if(Array.isArray(e))r=r.concat(e);else{if(!e||!Array.isArray(e.implicit)&&!Array.isArray(e.explicit))throw new hk("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");e.implicit&&(t=t.concat(e.implicit)),e.explicit&&(r=r.concat(e.explicit))}t.forEach((function(e){if(!(e instanceof vk))throw new hk("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(e.loadKind&&"scalar"!==e.loadKind)throw new hk("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(e.multi)throw new hk("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")})),r.forEach((function(e){if(!(e instanceof vk))throw new hk("Specified list of YAML types (or a single Type object) contains a non-Type object.")}));var n=Object.create(xk.prototype);return n.implicit=(this.implicit||[]).concat(t),n.explicit=(this.explicit||[]).concat(r),n.compiledImplicit=bk(n,"implicit"),n.compiledExplicit=bk(n,"explicit"),n.compiledTypeMap=function(){var e,t,r={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}};function n(e){e.multi?(r.multi[e.kind].push(e),r.multi.fallback.push(e)):r[e.kind][e.tag]=r.fallback[e.tag]=e}for(e=0,t=arguments.length;e<t;e+=1)arguments[e].forEach(n);return r}(n.compiledImplicit,n.compiledExplicit),n};var wk=xk,$k=new vk("tag:yaml.org,2002:str",{kind:"scalar",construct:function(e){return null!==e?e:""}}),kk=new vk("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return null!==e?e:[]}}),Sk=new vk("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return null!==e?e:{}}}),Ak=new wk({explicit:[$k,kk,Sk]}),Ek=new vk("tag:yaml.org,2002:null",{kind:"scalar",resolve:function(e){if(null===e)return!0;var t=e.length;return 1===t&&"~"===e||4===t&&("null"===e||"Null"===e||"NULL"===e)},construct:function(){return null},predicate:function(e){return null===e},represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"}),Ok=new vk("tag:yaml.org,2002:bool",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t=e.length;return 4===t&&("true"===e||"True"===e||"TRUE"===e)||5===t&&("false"===e||"False"===e||"FALSE"===e)},construct:function(e){return"true"===e||"True"===e||"TRUE"===e},predicate:function(e){return"[object Boolean]"===Object.prototype.toString.call(e)},represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"});function Tk(e){return 48<=e&&e<=55}function Ck(e){return 48<=e&&e<=57}var _k=new vk("tag:yaml.org,2002:int",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t,r,n=e.length,o=0,a=!1;if(!n)return!1;if("-"!==(t=e[o])&&"+"!==t||(t=e[++o]),"0"===t){if(o+1===n)return!0;if("b"===(t=e[++o])){for(o++;o<n;o++)if("_"!==(t=e[o])){if("0"!==t&&"1"!==t)return!1;a=!0}return a&&"_"!==t}if("x"===t){for(o++;o<n;o++)if("_"!==(t=e[o])){if(!(48<=(r=e.charCodeAt(o))&&r<=57||65<=r&&r<=70||97<=r&&r<=102))return!1;a=!0}return a&&"_"!==t}if("o"===t){for(o++;o<n;o++)if("_"!==(t=e[o])){if(!Tk(e.charCodeAt(o)))return!1;a=!0}return a&&"_"!==t}}if("_"===t)return!1;for(;o<n;o++)if("_"!==(t=e[o])){if(!Ck(e.charCodeAt(o)))return!1;a=!0}return!(!a||"_"===t)},construct:function(e){var t,r=e,n=1;if(-1!==r.indexOf("_")&&(r=r.replace(/_/g,"")),"-"!==(t=r[0])&&"+"!==t||("-"===t&&(n=-1),t=(r=r.slice(1))[0]),"0"===r)return 0;if("0"===t){if("b"===r[1])return n*parseInt(r.slice(2),2);if("x"===r[1])return n*parseInt(r.slice(2),16);if("o"===r[1])return n*parseInt(r.slice(2),8)}return n*parseInt(r,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&e%1==0&&!pk.isNegativeZero(e)},represent:{binary:function(e){return e>=0?"0b"+e.toString(2):"-0b"+e.toString(2).slice(1)},octal:function(e){return e>=0?"0o"+e.toString(8):"-0o"+e.toString(8).slice(1)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return e>=0?"0x"+e.toString(16).toUpperCase():"-0x"+e.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),jk=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),Ik=/^[-+]?[0-9]+e/,Pk=new vk("tag:yaml.org,2002:float",{kind:"scalar",resolve:function(e){return null!==e&&!(!jk.test(e)||"_"===e[e.length-1])},construct:function(e){var t,r;return r="-"===(t=e.replace(/_/g,"").toLowerCase())[0]?-1:1,"+-".indexOf(t[0])>=0&&(t=t.slice(1)),".inf"===t?1===r?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:".nan"===t?NaN:r*parseFloat(t,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&(e%1!=0||pk.isNegativeZero(e))},represent:function(e,t){var r;if(isNaN(e))switch(t){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===e)switch(t){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===e)switch(t){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(pk.isNegativeZero(e))return"-0.0";return r=e.toString(10),Ik.test(r)?r.replace("e",".e"):r},defaultStyle:"lowercase"}),Rk=Ak.extend({implicit:[Ek,Ok,_k,Pk]}),Lk=Rk,Nk=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),Dk=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"),Fk=new vk("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:function(e){return null!==e&&(null!==Nk.exec(e)||null!==Dk.exec(e))},construct:function(e){var t,r,n,o,a,i,s,l,c=0,p=null;if(null===(t=Nk.exec(e))&&(t=Dk.exec(e)),null===t)throw new Error("Date resolve error");if(r=+t[1],n=+t[2]-1,o=+t[3],!t[4])return new Date(Date.UTC(r,n,o));if(a=+t[4],i=+t[5],s=+t[6],t[7]){for(c=t[7].slice(0,3);c.length<3;)c+="0";c=+c}return t[9]&&(p=6e4*(60*+t[10]+ +(t[11]||0)),"-"===t[9]&&(p=-p)),l=new Date(Date.UTC(r,n,o,a,i,s,c)),p&&l.setTime(l.getTime()-p),l},instanceOf:Date,represent:function(e){return e.toISOString()}}),Uk=new vk("tag:yaml.org,2002:merge",{kind:"scalar",resolve:function(e){return"<<"===e||null===e}}),Bk="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r",qk=new vk("tag:yaml.org,2002:binary",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t,r,n=0,o=e.length,a=Bk;for(r=0;r<o;r++)if(!((t=a.indexOf(e.charAt(r)))>64)){if(t<0)return!1;n+=6}return n%8==0},construct:function(e){var t,r,n=e.replace(/[\r\n=]/g,""),o=n.length,a=Bk,i=0,s=[];for(t=0;t<o;t++)t%4==0&&t&&(s.push(i>>16&255),s.push(i>>8&255),s.push(255&i)),i=i<<6|a.indexOf(n.charAt(t));return 0==(r=o%4*6)?(s.push(i>>16&255),s.push(i>>8&255),s.push(255&i)):18===r?(s.push(i>>10&255),s.push(i>>2&255)):12===r&&s.push(i>>4&255),new Uint8Array(s)},predicate:function(e){return"[object Uint8Array]"===Object.prototype.toString.call(e)},represent:function(e){var t,r,n="",o=0,a=e.length,i=Bk;for(t=0;t<a;t++)t%3==0&&t&&(n+=i[o>>18&63],n+=i[o>>12&63],n+=i[o>>6&63],n+=i[63&o]),o=(o<<8)+e[t];return 0==(r=a%3)?(n+=i[o>>18&63],n+=i[o>>12&63],n+=i[o>>6&63],n+=i[63&o]):2===r?(n+=i[o>>10&63],n+=i[o>>4&63],n+=i[o<<2&63],n+=i[64]):1===r&&(n+=i[o>>2&63],n+=i[o<<4&63],n+=i[64],n+=i[64]),n}}),zk=Object.prototype.hasOwnProperty,Mk=Object.prototype.toString,Hk=new vk("tag:yaml.org,2002:omap",{kind:"sequence",resolve:function(e){if(null===e)return!0;var t,r,n,o,a,i=[],s=e;for(t=0,r=s.length;t<r;t+=1){if(n=s[t],a=!1,"[object Object]"!==Mk.call(n))return!1;for(o in n)if(zk.call(n,o)){if(a)return!1;a=!0}if(!a)return!1;if(-1!==i.indexOf(o))return!1;i.push(o)}return!0},construct:function(e){return null!==e?e:[]}}),Wk=Object.prototype.toString,Vk=new vk("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:function(e){if(null===e)return!0;var t,r,n,o,a,i=e;for(a=new Array(i.length),t=0,r=i.length;t<r;t+=1){if(n=i[t],"[object Object]"!==Wk.call(n))return!1;if(1!==(o=Object.keys(n)).length)return!1;a[t]=[o[0],n[o[0]]]}return!0},construct:function(e){if(null===e)return[];var t,r,n,o,a,i=e;for(a=new Array(i.length),t=0,r=i.length;t<r;t+=1)n=i[t],o=Object.keys(n),a[t]=[o[0],n[o[0]]];return a}}),Gk=Object.prototype.hasOwnProperty,Kk=new vk("tag:yaml.org,2002:set",{kind:"mapping",resolve:function(e){if(null===e)return!0;var t,r=e;for(t in r)if(Gk.call(r,t)&&null!==r[t])return!1;return!0},construct:function(e){return null!==e?e:{}}}),Jk=Lk.extend({implicit:[Fk,Uk],explicit:[qk,Hk,Vk,Kk]}),Yk=Object.prototype.hasOwnProperty,Zk=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,Qk=/[\x85\u2028\u2029]/,Xk=/[,\[\]\{\}]/,eS=/^(?:!|!!|![a-z\-]+!)$/i,tS=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function rS(e){return Object.prototype.toString.call(e)}function nS(e){return 10===e||13===e}function oS(e){return 9===e||32===e}function aS(e){return 9===e||32===e||10===e||13===e}function iS(e){return 44===e||91===e||93===e||123===e||125===e}function sS(e){var t;return 48<=e&&e<=57?e-48:97<=(t=32|e)&&t<=102?t-97+10:-1}function lS(e){return 48===e?"\0":97===e?"":98===e?"\b":116===e||9===e?"\t":110===e?"\n":118===e?"\v":102===e?"\f":114===e?"\r":101===e?"":32===e?" ":34===e?'"':47===e?"/":92===e?"\\":78===e?"":95===e?" ":76===e?"\u2028":80===e?"\u2029":""}function cS(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10),56320+(e-65536&1023))}for(var pS=new Array(256),dS=new Array(256),uS=0;uS<256;uS++)pS[uS]=lS(uS)?1:0,dS[uS]=lS(uS);function hS(e,t){this.input=e,this.filename=t.filename||null,this.schema=t.schema||Jk,this.onWarning=t.onWarning||null,this.legacy=t.legacy||!1,this.json=t.json||!1,this.listener=t.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function fS(e,t){var r={name:e.filename,buffer:e.input.slice(0,-1),position:e.position,line:e.line,column:e.position-e.lineStart};return r.snippet=function(e,t){if(t=Object.create(t||null),!e.buffer)return null;t.maxLength||(t.maxLength=79),"number"!=typeof t.indent&&(t.indent=1),"number"!=typeof t.linesBefore&&(t.linesBefore=3),"number"!=typeof t.linesAfter&&(t.linesAfter=2);for(var r,n=/\r?\n|\r|\0/g,o=[0],a=[],i=-1;r=n.exec(e.buffer);)a.push(r.index),o.push(r.index+r[0].length),e.position<=r.index&&i<0&&(i=o.length-2);i<0&&(i=o.length-1);var s,l,c="",p=Math.min(e.line+t.linesAfter,a.length).toString().length,d=t.maxLength-(t.indent+p+3);for(s=1;s<=t.linesBefore&&!(i-s<0);s++)l=fk(e.buffer,o[i-s],a[i-s],e.position-(o[i]-o[i-s]),d),c=pk.repeat(" ",t.indent)+mk((e.line-s+1).toString(),p)+" | "+l.str+"\n"+c;for(l=fk(e.buffer,o[i],a[i],e.position,d),c+=pk.repeat(" ",t.indent)+mk((e.line+1).toString(),p)+" | "+l.str+"\n",c+=pk.repeat("-",t.indent+p+3+l.pos)+"^\n",s=1;s<=t.linesAfter&&!(i+s>=a.length);s++)l=fk(e.buffer,o[i+s],a[i+s],e.position-(o[i]-o[i+s]),d),c+=pk.repeat(" ",t.indent)+mk((e.line+s+1).toString(),p)+" | "+l.str+"\n";return c.replace(/\n$/,"")}(r),new hk(t,r)}function mS(e,t){throw fS(e,t)}function yS(e,t){e.onWarning&&e.onWarning.call(null,fS(e,t))}var gS={YAML:function(e,t,r){var n,o,a;null!==e.version&&mS(e,"duplication of %YAML directive"),1!==r.length&&mS(e,"YAML directive accepts exactly one argument"),null===(n=/^([0-9]+)\.([0-9]+)$/.exec(r[0]))&&mS(e,"ill-formed argument of the YAML directive"),o=parseInt(n[1],10),a=parseInt(n[2],10),1!==o&&mS(e,"unacceptable YAML version of the document"),e.version=r[0],e.checkLineBreaks=a<2,1!==a&&2!==a&&yS(e,"unsupported YAML version of the document")},TAG:function(e,t,r){var n,o;2!==r.length&&mS(e,"TAG directive accepts exactly two arguments"),n=r[0],o=r[1],eS.test(n)||mS(e,"ill-formed tag handle (first argument) of the TAG directive"),Yk.call(e.tagMap,n)&&mS(e,'there is a previously declared suffix for "'+n+'" tag handle'),tS.test(o)||mS(e,"ill-formed tag prefix (second argument) of the TAG directive");try{o=decodeURIComponent(o)}catch(t){mS(e,"tag prefix is malformed: "+o)}e.tagMap[n]=o}};function vS(e,t,r,n){var o,a,i,s;if(t<r){if(s=e.input.slice(t,r),n)for(o=0,a=s.length;o<a;o+=1)9===(i=s.charCodeAt(o))||32<=i&&i<=1114111||mS(e,"expected valid JSON character");else Zk.test(s)&&mS(e,"the stream contains non-printable characters");e.result+=s}}function bS(e,t,r,n){var o,a,i,s;for(pk.isObject(r)||mS(e,"cannot merge mappings; the provided source object is unacceptable"),i=0,s=(o=Object.keys(r)).length;i<s;i+=1)a=o[i],Yk.call(t,a)||(t[a]=r[a],n[a]=!0)}function xS(e,t,r,n,o,a,i,s,l){var c,p;if(Array.isArray(o))for(c=0,p=(o=Array.prototype.slice.call(o)).length;c<p;c+=1)Array.isArray(o[c])&&mS(e,"nested arrays are not supported inside keys"),"object"==typeof o&&"[object Object]"===rS(o[c])&&(o[c]="[object Object]");if("object"==typeof o&&"[object Object]"===rS(o)&&(o="[object Object]"),o=String(o),null===t&&(t={}),"tag:yaml.org,2002:merge"===n)if(Array.isArray(a))for(c=0,p=a.length;c<p;c+=1)bS(e,t,a[c],r);else bS(e,t,a,r);else e.json||Yk.call(r,o)||!Yk.call(t,o)||(e.line=i||e.line,e.lineStart=s||e.lineStart,e.position=l||e.position,mS(e,"duplicated mapping key")),"__proto__"===o?Object.defineProperty(t,o,{configurable:!0,enumerable:!0,writable:!0,value:a}):t[o]=a,delete r[o];return t}function wS(e){var t;10===(t=e.input.charCodeAt(e.position))?e.position++:13===t?(e.position++,10===e.input.charCodeAt(e.position)&&e.position++):mS(e,"a line break is expected"),e.line+=1,e.lineStart=e.position,e.firstTabInLine=-1}function $S(e,t,r){for(var n=0,o=e.input.charCodeAt(e.position);0!==o;){for(;oS(o);)9===o&&-1===e.firstTabInLine&&(e.firstTabInLine=e.position),o=e.input.charCodeAt(++e.position);if(t&&35===o)do{o=e.input.charCodeAt(++e.position)}while(10!==o&&13!==o&&0!==o);if(!nS(o))break;for(wS(e),o=e.input.charCodeAt(e.position),n++,e.lineIndent=0;32===o;)e.lineIndent++,o=e.input.charCodeAt(++e.position)}return-1!==r&&0!==n&&e.lineIndent<r&&yS(e,"deficient indentation"),n}function kS(e){var t,r=e.position;return!(45!==(t=e.input.charCodeAt(r))&&46!==t||t!==e.input.charCodeAt(r+1)||t!==e.input.charCodeAt(r+2)||(r+=3,0!==(t=e.input.charCodeAt(r))&&!aS(t)))}function SS(e,t){1===t?e.result+=" ":t>1&&(e.result+=pk.repeat("\n",t-1))}function AS(e,t){var r,n,o=e.tag,a=e.anchor,i=[],s=!1;if(-1!==e.firstTabInLine)return!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=i),n=e.input.charCodeAt(e.position);0!==n&&(-1!==e.firstTabInLine&&(e.position=e.firstTabInLine,mS(e,"tab characters must not be used in indentation")),45===n)&&aS(e.input.charCodeAt(e.position+1));)if(s=!0,e.position++,$S(e,!0,-1)&&e.lineIndent<=t)i.push(null),n=e.input.charCodeAt(e.position);else if(r=e.line,TS(e,t,3,!1,!0),i.push(e.result),$S(e,!0,-1),n=e.input.charCodeAt(e.position),(e.line===r||e.lineIndent>t)&&0!==n)mS(e,"bad indentation of a sequence entry");else if(e.lineIndent<t)break;return!!s&&(e.tag=o,e.anchor=a,e.kind="sequence",e.result=i,!0)}function ES(e){var t,r,n,o,a=!1,i=!1;if(33!==(o=e.input.charCodeAt(e.position)))return!1;if(null!==e.tag&&mS(e,"duplication of a tag property"),60===(o=e.input.charCodeAt(++e.position))?(a=!0,o=e.input.charCodeAt(++e.position)):33===o?(i=!0,r="!!",o=e.input.charCodeAt(++e.position)):r="!",t=e.position,a){do{o=e.input.charCodeAt(++e.position)}while(0!==o&&62!==o);e.position<e.length?(n=e.input.slice(t,e.position),o=e.input.charCodeAt(++e.position)):mS(e,"unexpected end of the stream within a verbatim tag")}else{for(;0!==o&&!aS(o);)33===o&&(i?mS(e,"tag suffix cannot contain exclamation marks"):(r=e.input.slice(t-1,e.position+1),eS.test(r)||mS(e,"named tag handle cannot contain such characters"),i=!0,t=e.position+1)),o=e.input.charCodeAt(++e.position);n=e.input.slice(t,e.position),Xk.test(n)&&mS(e,"tag suffix cannot contain flow indicator characters")}n&&!tS.test(n)&&mS(e,"tag name cannot contain such characters: "+n);try{n=decodeURIComponent(n)}catch(t){mS(e,"tag name is malformed: "+n)}return a?e.tag=n:Yk.call(e.tagMap,r)?e.tag=e.tagMap[r]+n:"!"===r?e.tag="!"+n:"!!"===r?e.tag="tag:yaml.org,2002:"+n:mS(e,'undeclared tag handle "'+r+'"'),!0}function OS(e){var t,r;if(38!==(r=e.input.charCodeAt(e.position)))return!1;for(null!==e.anchor&&mS(e,"duplication of an anchor property"),r=e.input.charCodeAt(++e.position),t=e.position;0!==r&&!aS(r)&&!iS(r);)r=e.input.charCodeAt(++e.position);return e.position===t&&mS(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(t,e.position),!0}function TS(e,t,r,n,o){var a,i,s,l,c,p,d,u,h,f=1,m=!1,y=!1;if(null!==e.listener&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,a=i=s=4===r||3===r,n&&$S(e,!0,-1)&&(m=!0,e.lineIndent>t?f=1:e.lineIndent===t?f=0:e.lineIndent<t&&(f=-1)),1===f)for(;ES(e)||OS(e);)$S(e,!0,-1)?(m=!0,s=a,e.lineIndent>t?f=1:e.lineIndent===t?f=0:e.lineIndent<t&&(f=-1)):s=!1;if(s&&(s=m||o),1!==f&&4!==r||(u=1===r||2===r?t:t+1,h=e.position-e.lineStart,1===f?s&&(AS(e,h)||function(e,t,r){var n,o,a,i,s,l,c,p=e.tag,d=e.anchor,u={},h=Object.create(null),f=null,m=null,y=null,g=!1,v=!1;if(-1!==e.firstTabInLine)return!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=u),c=e.input.charCodeAt(e.position);0!==c;){if(g||-1===e.firstTabInLine||(e.position=e.firstTabInLine,mS(e,"tab characters must not be used in indentation")),n=e.input.charCodeAt(e.position+1),a=e.line,63!==c&&58!==c||!aS(n)){if(i=e.line,s=e.lineStart,l=e.position,!TS(e,r,2,!1,!0))break;if(e.line===a){for(c=e.input.charCodeAt(e.position);oS(c);)c=e.input.charCodeAt(++e.position);if(58===c)aS(c=e.input.charCodeAt(++e.position))||mS(e,"a whitespace character is expected after the key-value separator within a block mapping"),g&&(xS(e,u,h,f,m,null,i,s,l),f=m=y=null),v=!0,g=!1,o=!1,f=e.tag,m=e.result;else{if(!v)return e.tag=p,e.anchor=d,!0;mS(e,"can not read an implicit mapping pair; a colon is missed")}}else{if(!v)return e.tag=p,e.anchor=d,!0;mS(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else 63===c?(g&&(xS(e,u,h,f,m,null,i,s,l),f=m=y=null),v=!0,g=!0,o=!0):g?(g=!1,o=!0):mS(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,c=n;if((e.line===a||e.lineIndent>t)&&(g&&(i=e.line,s=e.lineStart,l=e.position),TS(e,t,4,!0,o)&&(g?m=e.result:y=e.result),g||(xS(e,u,h,f,m,y,i,s,l),f=m=y=null),$S(e,!0,-1),c=e.input.charCodeAt(e.position)),(e.line===a||e.lineIndent>t)&&0!==c)mS(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return g&&xS(e,u,h,f,m,null,i,s,l),v&&(e.tag=p,e.anchor=d,e.kind="mapping",e.result=u),v}(e,h,u))||function(e,t){var r,n,o,a,i,s,l,c,p,d,u,h,f=!0,m=e.tag,y=e.anchor,g=Object.create(null);if(91===(h=e.input.charCodeAt(e.position)))i=93,c=!1,a=[];else{if(123!==h)return!1;i=125,c=!0,a={}}for(null!==e.anchor&&(e.anchorMap[e.anchor]=a),h=e.input.charCodeAt(++e.position);0!==h;){if($S(e,!0,t),(h=e.input.charCodeAt(e.position))===i)return e.position++,e.tag=m,e.anchor=y,e.kind=c?"mapping":"sequence",e.result=a,!0;f?44===h&&mS(e,"expected the node content, but found ','"):mS(e,"missed comma between flow collection entries"),u=null,s=l=!1,63===h&&aS(e.input.charCodeAt(e.position+1))&&(s=l=!0,e.position++,$S(e,!0,t)),r=e.line,n=e.lineStart,o=e.position,TS(e,t,1,!1,!0),d=e.tag,p=e.result,$S(e,!0,t),h=e.input.charCodeAt(e.position),!l&&e.line!==r||58!==h||(s=!0,h=e.input.charCodeAt(++e.position),$S(e,!0,t),TS(e,t,1,!1,!0),u=e.result),c?xS(e,a,g,d,p,u,r,n,o):s?a.push(xS(e,null,g,d,p,u,r,n,o)):a.push(p),$S(e,!0,t),44===(h=e.input.charCodeAt(e.position))?(f=!0,h=e.input.charCodeAt(++e.position)):f=!1}mS(e,"unexpected end of the stream within a flow collection")}(e,u)?y=!0:(i&&function(e,t){var r,n,o,a,i,s=1,l=!1,c=!1,p=t,d=0,u=!1;if(124===(a=e.input.charCodeAt(e.position)))n=!1;else{if(62!==a)return!1;n=!0}for(e.kind="scalar",e.result="";0!==a;)if(43===(a=e.input.charCodeAt(++e.position))||45===a)1===s?s=43===a?3:2:mS(e,"repeat of a chomping mode identifier");else{if(!((o=48<=(i=a)&&i<=57?i-48:-1)>=0))break;0===o?mS(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):c?mS(e,"repeat of an indentation width identifier"):(p=t+o-1,c=!0)}if(oS(a)){do{a=e.input.charCodeAt(++e.position)}while(oS(a));if(35===a)do{a=e.input.charCodeAt(++e.position)}while(!nS(a)&&0!==a)}for(;0!==a;){for(wS(e),e.lineIndent=0,a=e.input.charCodeAt(e.position);(!c||e.lineIndent<p)&&32===a;)e.lineIndent++,a=e.input.charCodeAt(++e.position);if(!c&&e.lineIndent>p&&(p=e.lineIndent),nS(a))d++;else{if(e.lineIndent<p){3===s?e.result+=pk.repeat("\n",l?1+d:d):1===s&&l&&(e.result+="\n");break}for(n?oS(a)?(u=!0,e.result+=pk.repeat("\n",l?1+d:d)):u?(u=!1,e.result+=pk.repeat("\n",d+1)):0===d?l&&(e.result+=" "):e.result+=pk.repeat("\n",d):e.result+=pk.repeat("\n",l?1+d:d),l=!0,c=!0,d=0,r=e.position;!nS(a)&&0!==a;)a=e.input.charCodeAt(++e.position);vS(e,r,e.position,!1)}}return!0}(e,u)||function(e,t){var r,n,o;if(39!==(r=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,n=o=e.position;0!==(r=e.input.charCodeAt(e.position));)if(39===r){if(vS(e,n,e.position,!0),39!==(r=e.input.charCodeAt(++e.position)))return!0;n=e.position,e.position++,o=e.position}else nS(r)?(vS(e,n,o,!0),SS(e,$S(e,!1,t)),n=o=e.position):e.position===e.lineStart&&kS(e)?mS(e,"unexpected end of the document within a single quoted scalar"):(e.position++,o=e.position);mS(e,"unexpected end of the stream within a single quoted scalar")}(e,u)||function(e,t){var r,n,o,a,i,s,l;if(34!==(s=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,r=n=e.position;0!==(s=e.input.charCodeAt(e.position));){if(34===s)return vS(e,r,e.position,!0),e.position++,!0;if(92===s){if(vS(e,r,e.position,!0),nS(s=e.input.charCodeAt(++e.position)))$S(e,!1,t);else if(s<256&&pS[s])e.result+=dS[s],e.position++;else if((i=120===(l=s)?2:117===l?4:85===l?8:0)>0){for(o=i,a=0;o>0;o--)(i=sS(s=e.input.charCodeAt(++e.position)))>=0?a=(a<<4)+i:mS(e,"expected hexadecimal character");e.result+=cS(a),e.position++}else mS(e,"unknown escape sequence");r=n=e.position}else nS(s)?(vS(e,r,n,!0),SS(e,$S(e,!1,t)),r=n=e.position):e.position===e.lineStart&&kS(e)?mS(e,"unexpected end of the document within a double quoted scalar"):(e.position++,n=e.position)}mS(e,"unexpected end of the stream within a double quoted scalar")}(e,u)?y=!0:function(e){var t,r,n;if(42!==(n=e.input.charCodeAt(e.position)))return!1;for(n=e.input.charCodeAt(++e.position),t=e.position;0!==n&&!aS(n)&&!iS(n);)n=e.input.charCodeAt(++e.position);return e.position===t&&mS(e,"name of an alias node must contain at least one character"),r=e.input.slice(t,e.position),Yk.call(e.anchorMap,r)||mS(e,'unidentified alias "'+r+'"'),e.result=e.anchorMap[r],$S(e,!0,-1),!0}(e)?(y=!0,null===e.tag&&null===e.anchor||mS(e,"alias node should not have any properties")):function(e,t,r){var n,o,a,i,s,l,c,p,d=e.kind,u=e.result;if(aS(p=e.input.charCodeAt(e.position))||iS(p)||35===p||38===p||42===p||33===p||124===p||62===p||39===p||34===p||37===p||64===p||96===p)return!1;if((63===p||45===p)&&(aS(n=e.input.charCodeAt(e.position+1))||r&&iS(n)))return!1;for(e.kind="scalar",e.result="",o=a=e.position,i=!1;0!==p;){if(58===p){if(aS(n=e.input.charCodeAt(e.position+1))||r&&iS(n))break}else if(35===p){if(aS(e.input.charCodeAt(e.position-1)))break}else{if(e.position===e.lineStart&&kS(e)||r&&iS(p))break;if(nS(p)){if(s=e.line,l=e.lineStart,c=e.lineIndent,$S(e,!1,-1),e.lineIndent>=t){i=!0,p=e.input.charCodeAt(e.position);continue}e.position=a,e.line=s,e.lineStart=l,e.lineIndent=c;break}}i&&(vS(e,o,a,!1),SS(e,e.line-s),o=a=e.position,i=!1),oS(p)||(a=e.position+1),p=e.input.charCodeAt(++e.position)}return vS(e,o,a,!1),!!e.result||(e.kind=d,e.result=u,!1)}(e,u,1===r)&&(y=!0,null===e.tag&&(e.tag="?")),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):0===f&&(y=s&&AS(e,h))),null===e.tag)null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);else if("?"===e.tag){for(null!==e.result&&"scalar"!==e.kind&&mS(e,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+e.kind+'"'),l=0,c=e.implicitTypes.length;l<c;l+=1)if((d=e.implicitTypes[l]).resolve(e.result)){e.result=d.construct(e.result),e.tag=d.tag,null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);break}}else if("!"!==e.tag){if(Yk.call(e.typeMap[e.kind||"fallback"],e.tag))d=e.typeMap[e.kind||"fallback"][e.tag];else for(d=null,l=0,c=(p=e.typeMap.multi[e.kind||"fallback"]).length;l<c;l+=1)if(e.tag.slice(0,p[l].tag.length)===p[l].tag){d=p[l];break}d||mS(e,"unknown tag !<"+e.tag+">"),null!==e.result&&d.kind!==e.kind&&mS(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+d.kind+'", not "'+e.kind+'"'),d.resolve(e.result,e.tag)?(e.result=d.construct(e.result,e.tag),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):mS(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")}return null!==e.listener&&e.listener("close",e),null!==e.tag||null!==e.anchor||y}function CS(e){var t,r,n,o,a=e.position,i=!1;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap=Object.create(null),e.anchorMap=Object.create(null);0!==(o=e.input.charCodeAt(e.position))&&($S(e,!0,-1),o=e.input.charCodeAt(e.position),!(e.lineIndent>0||37!==o));){for(i=!0,o=e.input.charCodeAt(++e.position),t=e.position;0!==o&&!aS(o);)o=e.input.charCodeAt(++e.position);for(n=[],(r=e.input.slice(t,e.position)).length<1&&mS(e,"directive name must not be less than one character in length");0!==o;){for(;oS(o);)o=e.input.charCodeAt(++e.position);if(35===o){do{o=e.input.charCodeAt(++e.position)}while(0!==o&&!nS(o));break}if(nS(o))break;for(t=e.position;0!==o&&!aS(o);)o=e.input.charCodeAt(++e.position);n.push(e.input.slice(t,e.position))}0!==o&&wS(e),Yk.call(gS,r)?gS[r](e,r,n):yS(e,'unknown document directive "'+r+'"')}$S(e,!0,-1),0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)?(e.position+=3,$S(e,!0,-1)):i&&mS(e,"directives end mark is expected"),TS(e,e.lineIndent-1,4,!1,!0),$S(e,!0,-1),e.checkLineBreaks&&Qk.test(e.input.slice(a,e.position))&&yS(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&kS(e)?46===e.input.charCodeAt(e.position)&&(e.position+=3,$S(e,!0,-1)):e.position<e.length-1&&mS(e,"end of the stream or a document separator is expected")}function _S(e,t){t=t||{},0!==(e=String(e)).length&&(10!==e.charCodeAt(e.length-1)&&13!==e.charCodeAt(e.length-1)&&(e+="\n"),65279===e.charCodeAt(0)&&(e=e.slice(1)));var r=new hS(e,t),n=e.indexOf("\0");for(-1!==n&&(r.position=n,mS(r,"null byte is not allowed in input")),r.input+="\0";32===r.input.charCodeAt(r.position);)r.lineIndent+=1,r.position+=1;for(;r.position<r.length-1;)CS(r);return r.documents}var jS={loadAll:function(e,t,r){null!==t&&"object"==typeof t&&void 0===r&&(r=t,t=null);var n=_S(e,r);if("function"!=typeof t)return n;for(var o=0,a=n.length;o<a;o+=1)t(n[o])},load:function(e,t){var r=_S(e,t);if(0!==r.length){if(1===r.length)return r[0];throw new hk("expected a single document in the stream, but found more")}}},IS=Object.prototype.toString,PS=Object.prototype.hasOwnProperty,RS={0:"\\0",7:"\\a",8:"\\b",9:"\\t",10:"\\n",11:"\\v",12:"\\f",13:"\\r",27:"\\e",34:'\\"',92:"\\\\",133:"\\N",160:"\\_",8232:"\\L",8233:"\\P"},LS=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],NS=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function DS(e){var t,r,n;if(t=e.toString(16).toUpperCase(),e<=255)r="x",n=2;else if(e<=65535)r="u",n=4;else{if(!(e<=4294967295))throw new hk("code point within a string may not be greater than 0xFFFFFFFF");r="U",n=8}return"\\"+r+pk.repeat("0",n-t.length)+t}function FS(e){this.schema=e.schema||Jk,this.indent=Math.max(1,e.indent||2),this.noArrayIndent=e.noArrayIndent||!1,this.skipInvalid=e.skipInvalid||!1,this.flowLevel=pk.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=function(e,t){var r,n,o,a,i,s,l;if(null===t)return{};for(r={},o=0,a=(n=Object.keys(t)).length;o<a;o+=1)i=n[o],s=String(t[i]),"!!"===i.slice(0,2)&&(i="tag:yaml.org,2002:"+i.slice(2)),(l=e.compiledTypeMap.fallback[i])&&PS.call(l.styleAliases,s)&&(s=l.styleAliases[s]),r[i]=s;return r}(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.noRefs=e.noRefs||!1,this.noCompatMode=e.noCompatMode||!1,this.condenseFlow=e.condenseFlow||!1,this.quotingType='"'===e.quotingType?2:1,this.forceQuotes=e.forceQuotes||!1,this.replacer="function"==typeof e.replacer?e.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function US(e,t){for(var r,n=pk.repeat(" ",t),o=0,a=-1,i="",s=e.length;o<s;)-1===(a=e.indexOf("\n",o))?(r=e.slice(o),o=s):(r=e.slice(o,a+1),o=a+1),r.length&&"\n"!==r&&(i+=n),i+=r;return i}function BS(e,t){return"\n"+pk.repeat(" ",e.indent*t)}function qS(e){return 32===e||9===e}function zS(e){return 32<=e&&e<=126||161<=e&&e<=55295&&8232!==e&&8233!==e||57344<=e&&e<=65533&&65279!==e||65536<=e&&e<=1114111}function MS(e){return zS(e)&&65279!==e&&13!==e&&10!==e}function HS(e,t,r){var n=MS(e),o=n&&!qS(e);return(r?n:n&&44!==e&&91!==e&&93!==e&&123!==e&&125!==e)&&35!==e&&!(58===t&&!o)||MS(t)&&!qS(t)&&35===e||58===t&&o}function WS(e,t){var r,n=e.charCodeAt(t);return n>=55296&&n<=56319&&t+1<e.length&&(r=e.charCodeAt(t+1))>=56320&&r<=57343?1024*(n-55296)+r-56320+65536:n}function VS(e){return/^\n* /.test(e)}function GS(e,t,r,n,o){e.dump=function(){if(0===t.length)return 2===e.quotingType?'""':"''";if(!e.noCompatMode&&(-1!==LS.indexOf(t)||NS.test(t)))return 2===e.quotingType?'"'+t+'"':"'"+t+"'";var a=e.indent*Math.max(1,r),i=-1===e.lineWidth?-1:Math.max(Math.min(e.lineWidth,40),e.lineWidth-a),s=n||e.flowLevel>-1&&r>=e.flowLevel;switch(function(e,t,r,n,o,a,i,s){var l,c,p,d=0,u=null,h=!1,f=!1,m=-1!==n,y=-1,g=zS(c=WS(e,0))&&65279!==c&&!qS(c)&&45!==c&&63!==c&&58!==c&&44!==c&&91!==c&&93!==c&&123!==c&&125!==c&&35!==c&&38!==c&&42!==c&&33!==c&&124!==c&&61!==c&&62!==c&&39!==c&&34!==c&&37!==c&&64!==c&&96!==c&&!qS(p=WS(e,e.length-1))&&58!==p;if(t||i)for(l=0;l<e.length;d>=65536?l+=2:l++){if(!zS(d=WS(e,l)))return 5;g=g&&HS(d,u,s),u=d}else{for(l=0;l<e.length;d>=65536?l+=2:l++){if(10===(d=WS(e,l)))h=!0,m&&(f=f||l-y-1>n&&" "!==e[y+1],y=l);else if(!zS(d))return 5;g=g&&HS(d,u,s),u=d}f=f||m&&l-y-1>n&&" "!==e[y+1]}return h||f?r>9&&VS(e)?5:i?2===a?5:2:f?4:3:!g||i||o(e)?2===a?5:2:1}(t,s,e.indent,i,(function(t){return function(e,t){var r,n;for(r=0,n=e.implicitTypes.length;r<n;r+=1)if(e.implicitTypes[r].resolve(t))return!0;return!1}(e,t)}),e.quotingType,e.forceQuotes&&!n,o)){case 1:return t;case 2:return"'"+t.replace(/'/g,"''")+"'";case 3:return"|"+KS(t,e.indent)+JS(US(t,a));case 4:return">"+KS(t,e.indent)+JS(US(function(e,t){for(var r,n,o,a=/(\n+)([^\n]*)/g,i=(o=-1!==(o=e.indexOf("\n"))?o:e.length,a.lastIndex=o,YS(e.slice(0,o),t)),s="\n"===e[0]||" "===e[0];n=a.exec(e);){var l=n[1],c=n[2];r=" "===c[0],i+=l+(s||r||""===c?"":"\n")+YS(c,t),s=r}return i}(t,i),a));case 5:return'"'+function(e){for(var t,r="",n=0,o=0;o<e.length;n>=65536?o+=2:o++)n=WS(e,o),!(t=RS[n])&&zS(n)?(r+=e[o],n>=65536&&(r+=e[o+1])):r+=t||DS(n);return r}(t)+'"';default:throw new hk("impossible error: invalid scalar style")}}()}function KS(e,t){var r=VS(e)?String(t):"",n="\n"===e[e.length-1];return r+(!n||"\n"!==e[e.length-2]&&"\n"!==e?n?"":"-":"+")+"\n"}function JS(e){return"\n"===e[e.length-1]?e.slice(0,-1):e}function YS(e,t){if(""===e||" "===e[0])return e;for(var r,n,o=/ [^ ]/g,a=0,i=0,s=0,l="";r=o.exec(e);)(s=r.index)-a>t&&(n=i>a?i:s,l+="\n"+e.slice(a,n),a=n+1),i=s;return l+="\n",e.length-a>t&&i>a?l+=e.slice(a,i)+"\n"+e.slice(i+1):l+=e.slice(a),l.slice(1)}function ZS(e,t,r,n){var o,a,i,s="",l=e.tag;for(o=0,a=r.length;o<a;o+=1)i=r[o],e.replacer&&(i=e.replacer.call(r,String(o),i)),(XS(e,t+1,i,!0,!0,!1,!0)||void 0===i&&XS(e,t+1,null,!0,!0,!1,!0))&&(n&&""===s||(s+=BS(e,t)),e.dump&&10===e.dump.charCodeAt(0)?s+="-":s+="- ",s+=e.dump);e.tag=l,e.dump=s||"[]"}function QS(e,t,r){var n,o,a,i,s,l;for(a=0,i=(o=r?e.explicitTypes:e.implicitTypes).length;a<i;a+=1)if(((s=o[a]).instanceOf||s.predicate)&&(!s.instanceOf||"object"==typeof t&&t instanceof s.instanceOf)&&(!s.predicate||s.predicate(t))){if(r?s.multi&&s.representName?e.tag=s.representName(t):e.tag=s.tag:e.tag="?",s.represent){if(l=e.styleMap[s.tag]||s.defaultStyle,"[object Function]"===IS.call(s.represent))n=s.represent(t,l);else{if(!PS.call(s.represent,l))throw new hk("!<"+s.tag+'> tag resolver accepts not "'+l+'" style');n=s.represent[l](t,l)}e.dump=n}return!0}return!1}function XS(e,t,r,n,o,a,i){e.tag=null,e.dump=r,QS(e,r,!1)||QS(e,r,!0);var s,l=IS.call(e.dump),c=n;n&&(n=e.flowLevel<0||e.flowLevel>t);var p,d,u="[object Object]"===l||"[object Array]"===l;if(u&&(d=-1!==(p=e.duplicates.indexOf(r))),(null!==e.tag&&"?"!==e.tag||d||2!==e.indent&&t>0)&&(o=!1),d&&e.usedDuplicates[p])e.dump="*ref_"+p;else{if(u&&d&&!e.usedDuplicates[p]&&(e.usedDuplicates[p]=!0),"[object Object]"===l)n&&0!==Object.keys(e.dump).length?(function(e,t,r,n){var o,a,i,s,l,c,p="",d=e.tag,u=Object.keys(r);if(!0===e.sortKeys)u.sort();else if("function"==typeof e.sortKeys)u.sort(e.sortKeys);else if(e.sortKeys)throw new hk("sortKeys must be a boolean or a function");for(o=0,a=u.length;o<a;o+=1)c="",n&&""===p||(c+=BS(e,t)),s=r[i=u[o]],e.replacer&&(s=e.replacer.call(r,i,s)),XS(e,t+1,i,!0,!0,!0)&&((l=null!==e.tag&&"?"!==e.tag||e.dump&&e.dump.length>1024)&&(e.dump&&10===e.dump.charCodeAt(0)?c+="?":c+="? "),c+=e.dump,l&&(c+=BS(e,t)),XS(e,t+1,s,!0,l)&&(e.dump&&10===e.dump.charCodeAt(0)?c+=":":c+=": ",p+=c+=e.dump));e.tag=d,e.dump=p||"{}"}(e,t,e.dump,o),d&&(e.dump="&ref_"+p+e.dump)):(function(e,t,r){var n,o,a,i,s,l="",c=e.tag,p=Object.keys(r);for(n=0,o=p.length;n<o;n+=1)s="",""!==l&&(s+=", "),e.condenseFlow&&(s+='"'),i=r[a=p[n]],e.replacer&&(i=e.replacer.call(r,a,i)),XS(e,t,a,!1,!1)&&(e.dump.length>1024&&(s+="? "),s+=e.dump+(e.condenseFlow?'"':"")+":"+(e.condenseFlow?"":" "),XS(e,t,i,!1,!1)&&(l+=s+=e.dump));e.tag=c,e.dump="{"+l+"}"}(e,t,e.dump),d&&(e.dump="&ref_"+p+" "+e.dump));else if("[object Array]"===l)n&&0!==e.dump.length?(e.noArrayIndent&&!i&&t>0?ZS(e,t-1,e.dump,o):ZS(e,t,e.dump,o),d&&(e.dump="&ref_"+p+e.dump)):(function(e,t,r){var n,o,a,i="",s=e.tag;for(n=0,o=r.length;n<o;n+=1)a=r[n],e.replacer&&(a=e.replacer.call(r,String(n),a)),(XS(e,t,a,!1,!1)||void 0===a&&XS(e,t,null,!1,!1))&&(""!==i&&(i+=","+(e.condenseFlow?"":" ")),i+=e.dump);e.tag=s,e.dump="["+i+"]"}(e,t,e.dump),d&&(e.dump="&ref_"+p+" "+e.dump));else{if("[object String]"!==l){if("[object Undefined]"===l)return!1;if(e.skipInvalid)return!1;throw new hk("unacceptable kind of an object to dump "+l)}"?"!==e.tag&&GS(e,e.dump,t,a,c)}null!==e.tag&&"?"!==e.tag&&(s=encodeURI("!"===e.tag[0]?e.tag.slice(1):e.tag).replace(/!/g,"%21"),s="!"===e.tag[0]?"!"+s:"tag:yaml.org,2002:"===s.slice(0,18)?"!!"+s.slice(18):"!<"+s+">",e.dump=s+" "+e.dump)}return!0}function eA(e,t){var r,n,o=[],a=[];for(tA(e,o,a),r=0,n=a.length;r<n;r+=1)t.duplicates.push(o[a[r]]);t.usedDuplicates=new Array(n)}function tA(e,t,r){var n,o,a;if(null!==e&&"object"==typeof e)if(-1!==(o=t.indexOf(e)))-1===r.indexOf(o)&&r.push(o);else if(t.push(e),Array.isArray(e))for(o=0,a=e.length;o<a;o+=1)tA(e[o],t,r);else for(o=0,a=(n=Object.keys(e)).length;o<a;o+=1)tA(e[n[o]],t,r)}function rA(e,t){return function(){throw new Error("Function yaml."+e+" is removed in js-yaml 4. Use yaml."+t+" instead, which is now safe by default.")}}var nA={Type:vk,Schema:wk,FAILSAFE_SCHEMA:Ak,JSON_SCHEMA:Rk,CORE_SCHEMA:Lk,DEFAULT_SCHEMA:Jk,load:jS.load,loadAll:jS.loadAll,dump:function(e,t){var r=new FS(t=t||{});r.noRefs||eA(e,r);var n=e;return r.replacer&&(n=r.replacer.call({"":n},"",n)),XS(r,0,n,!0,!0)?r.dump+"\n":""},YAMLException:hk,types:{binary:qk,float:Pk,map:Sk,null:Ek,pairs:Vk,set:Kk,timestamp:Fk,bool:Ok,int:_k,merge:Uk,omap:Hk,seq:kk,str:$k},safeLoad:rA("safeLoad","load"),safeLoadAll:rA("safeLoadAll","loadAll"),safeDump:rA("safeDump","dump")};const oA="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:window,{FormData:aA,Blob:iA,File:sA}=oA;function lA(e){return function(e){if(vf(e))return wm(e)}(e)||function(e){if(void 0!==Jh&&null!=yf(e)||null!=e["@@iterator"])return xm(e)}(e)||$m(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}const cA=ir({exports:{}}.exports=Ff);var pA=function(e){return":/?#[]@!$&'()*+,;=".indexOf(e)>-1},dA=function(e){return/^[a-z0-9\-._~]+$/i.test(e)};function uA(e){var t,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=r.escape,o=arguments.length>2?arguments[2]:void 0;return"number"==typeof e&&(e=e.toString()),"string"==typeof e&&e.length&&n?o?JSON.parse(e):$x(t=lA(e)).call(t,(function(e){var t,r;if(dA(e))return e;if(pA(e)&&"unsafe"===n)return e;var o=new TextEncoder;return $x(t=$x(r=Yb(o.encode(e))).call(r,(function(e){var t;return cA(t="0".concat(e.toString(16).toUpperCase())).call(t,-2)}))).call(t,(function(e){return"%".concat(e)})).join("")})).join(""):e}function hA(e){var t=e.value;return Array.isArray(t)?function(e){var t=e.key,r=e.value,n=e.style,o=e.explode,a=e.escape,i=function(e){return uA(e,{escape:a})};if("simple"===n)return $x(r).call(r,(function(e){return i(e)})).join(",");if("label"===n)return".".concat($x(r).call(r,(function(e){return i(e)})).join("."));if("matrix"===n)return $x(r).call(r,(function(e){return i(e)})).reduce((function(e,r){var n,a,i;return!e||o?Tx(a=Tx(i="".concat(e||"",";")).call(i,t,"=")).call(a,r):Tx(n="".concat(e,",")).call(n,r)}),"");if("form"===n){var s=o?"&".concat(t,"="):",";return $x(r).call(r,(function(e){return i(e)})).join(s)}if("spaceDelimited"===n){var l=o?"".concat(t,"="):"";return $x(r).call(r,(function(e){return i(e)})).join(" ".concat(l))}if("pipeDelimited"===n){var c=o?"".concat(t,"="):"";return $x(r).call(r,(function(e){return i(e)})).join("|".concat(c))}}(e):"object"===Em(t)?function(e){var t=e.key,r=e.value,n=e.style,o=e.explode,a=e.escape,i=function(e){return uA(e,{escape:a})},s=kx(r);return"simple"===n?s.reduce((function(e,t){var n,a,s,l=i(r[t]),c=o?"=":",",p=e?"".concat(e,","):"";return Tx(n=Tx(a=Tx(s="".concat(p)).call(s,t)).call(a,c)).call(n,l)}),""):"label"===n?s.reduce((function(e,t){var n,a,s,l=i(r[t]),c=o?"=":".",p=e?"".concat(e,"."):".";return Tx(n=Tx(a=Tx(s="".concat(p)).call(s,t)).call(a,c)).call(n,l)}),""):"matrix"===n&&o?s.reduce((function(e,t){var n,o,a=i(r[t]),s=e?"".concat(e,";"):";";return Tx(n=Tx(o="".concat(s)).call(o,t,"=")).call(n,a)}),""):"matrix"===n?s.reduce((function(e,n){var o,a,s=i(r[n]),l=e?"".concat(e,","):";".concat(t,"=");return Tx(o=Tx(a="".concat(l)).call(a,n,",")).call(o,s)}),""):"form"===n?s.reduce((function(e,t){var n,a,s,l,c=i(r[t]),p=e?Tx(n="".concat(e)).call(n,o?"&":","):"",d=o?"=":",";return Tx(a=Tx(s=Tx(l="".concat(p)).call(l,t)).call(s,d)).call(a,c)}),""):void 0}(e):function(e){var t,r=e.key,n=e.value,o=e.style,a=e.escape,i=function(e){return uA(e,{escape:a})};return"simple"===o?i(n):"label"===o?".".concat(i(n)):"matrix"===o?Tx(t=";".concat(r,"=")).call(t,i(n)):"form"===o||"deepObject"===o?i(n):void 0}(e)}var fA=function(e,t){t.body=e},mA={serializeRes:xA,mergeInQueryOrForm:jA};function yA(e){return gA.apply(this,arguments)}function gA(){return gA=Sb(Eb.mark((function e(t){var r,n,o,a,i,s=arguments;return Eb.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r=s.length>1&&void 0!==s[1]?s[1]:{},"object"===Em(t)&&(t=(r=t).url),r.headers=r.headers||{},mA.mergeInQueryOrForm(r),r.headers&&kx(r.headers).forEach((function(e){var t=r.headers[e];"string"==typeof t&&(r.headers[e]=t.replace(/\n+/g," "))})),!r.requestInterceptor){e.next=12;break}return e.next=8,r.requestInterceptor(r);case 8:if(e.t0=e.sent,e.t0){e.next=11;break}e.t0=r;case 11:r=e.t0;case 12:return n=r.headers["content-type"]||r.headers["Content-Type"],/multipart\/form-data/i.test(n)&&r.body instanceof aA&&(delete r.headers["content-type"],delete r.headers["Content-Type"]),e.prev=14,e.next=17,(r.userFetch||fetch)(r.url,r);case 17:return o=e.sent,e.next=20,mA.serializeRes(o,t,r);case 20:if(o=e.sent,!r.responseInterceptor){e.next=28;break}return e.next=24,r.responseInterceptor(o);case 24:if(e.t1=e.sent,e.t1){e.next=27;break}e.t1=o;case 27:o=e.t1;case 28:e.next=39;break;case 30:if(e.prev=30,e.t2=e.catch(14),o){e.next=34;break}throw e.t2;case 34:throw(a=new Error(o.statusText||"response status is ".concat(o.status))).status=o.status,a.statusCode=o.status,a.responseError=e.t2,a;case 39:if(o.ok){e.next=45;break}throw(i=new Error(o.statusText||"response status is ".concat(o.status))).status=o.status,i.statusCode=o.status,i.response=o,i;case 45:return e.abrupt("return",o);case 46:case"end":return e.stop()}}),e,null,[[14,30]])}))),gA.apply(this,arguments)}var vA=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return/(json|xml|yaml|text)\b/.test(e)};function bA(e,t){return t&&(0===t.indexOf("application/json")||t.indexOf("+json")>0)?JSON.parse(e):nA.load(e)}function xA(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=r.loadSpec,o=void 0!==n&&n,a={ok:e.ok,url:e.url||t,status:e.status,statusText:e.statusText,headers:$A(e.headers)},i=a.headers["content-type"],s=o||vA(i),l=s?e.text:e.blob||e.buffer;return l.call(e).then((function(e){if(a.text=e,a.data=e,s)try{var t=bA(e,i);a.body=t,a.obj=t}catch(e){a.parseError=e}return a}))}function wA(e){return qb(e).call(e,", ")?e.split(", "):e}function $A(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return"function"!=typeof Jb(e)?{}:Yb(Jb(e).call(e)).reduce((function(e,t){var r=Om(t,2),n=r[0],o=r[1];return e[n]=wA(o),e}),{})}function kA(e,t){return t||"undefined"==typeof navigator||(t=navigator),t&&"ReactNative"===t.product?!(!e||"object"!==Em(e)||"string"!=typeof e.uri):void 0!==sA&&e instanceof sA||void 0!==iA&&e instanceof iA||!!ArrayBuffer.isView(e)||null!==e&&"object"===Em(e)&&"function"==typeof e.pipe}function SA(e,t){return Array.isArray(e)&&e.some((function(e){return kA(e,t)}))}var AA={form:",",spaceDelimited:"%20",pipeDelimited:"|"},EA={csv:",",ssv:"%20",tsv:"%09",pipes:"|"};function OA(e,t){var r=arguments.length>2&&void 0!==arguments[2]&&arguments[2],n=t.collectionFormat,o=t.allowEmptyValue,a=t.serializationOption,i=t.encoding,s="object"!==Em(t)||Array.isArray(t)?t:t.value,l=r?function(e){return e.toString()}:function(e){return encodeURIComponent(e)},c=l(e);if(void 0===s&&o)return[[c,""]];if(kA(s)||SA(s))return[[c,s]];if(a)return TA(e,s,r,a);if(i){if([Em(i.style),Em(i.explode),Em(i.allowReserved)].some((function(e){return"undefined"!==e}))){var p=i.style,d=i.explode,u=i.allowReserved;return TA(e,s,r,{style:p,explode:d,allowReserved:u})}if(i.contentType){if("application/json"===i.contentType){var h="string"==typeof s?s:yx(s);return[[c,l(h)]]}return[[c,l(s.toString())]]}return"object"!==Em(s)?[[c,l(s)]]:Array.isArray(s)&&s.every((function(e){return"object"!==Em(e)}))?[[c,$x(s).call(s,l).join(",")]]:[[c,l(yx(s))]]}return"object"!==Em(s)?[[c,l(s)]]:Array.isArray(s)?"multi"===n?[[c,$x(s).call(s,l)]]:[[c,$x(s).call(s,l).join(EA[n||"csv"])]]:[[c,""]]}function TA(e,t,r,n){var o,a,i,s=n.style||"form",l=void 0===n.explode?"form"===s:n.explode,c=!r&&(n&&n.allowReserved?"unsafe":"reserved"),p=function(e){return uA(e,{escape:c})},d=r?function(e){return e}:function(e){return uA(e,{escape:c})};return"object"!==Em(t)?[[d(e),p(t)]]:Array.isArray(t)?l?[[d(e),$x(t).call(t,p)]]:[[d(e),$x(t).call(t,p).join(AA[s])]]:"deepObject"===s?$x(a=kx(t)).call(a,(function(r){var n;return[d(Tx(n="".concat(e,"[")).call(n,r,"]")),p(t[r])]})):l?$x(i=kx(t)).call(i,(function(e){return[d(e),p(t[e])]})):[[d(e),$x(o=kx(t)).call(o,(function(e){var r;return[Tx(r="".concat(d(e),",")).call(r,p(t[e]))]})).join(",")]]}function CA(e){return Fx(e).reduce((function(e,t){var r,n=Om(t,2),o=km(OA(n[0],n[1],!0));try{for(o.s();!(r=o.n()).done;){var a=Om(r.value,2),i=a[0],s=a[1];if(Array.isArray(s)){var l,c=km(s);try{for(c.s();!(l=c.n()).done;){var p=l.value;if(ArrayBuffer.isView(p)){var d=new iA([p]);e.append(i,d)}else e.append(i,p)}}catch(e){c.e(e)}finally{c.f()}}else if(ArrayBuffer.isView(s)){var u=new iA([s]);e.append(i,u)}else e.append(i,s)}}catch(e){o.e(e)}finally{o.f()}return e}),new aA)}function _A(e){var t=kx(e).reduce((function(t,r){var n,o=km(OA(r,e[r]));try{for(o.s();!(n=o.n()).done;){var a=Om(n.value,2),i=a[0],s=a[1];t[i]=s}}catch(e){o.e(e)}finally{o.f()}return t}),{});return lk(t,{encode:!1,indices:!1})||""}function jA(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.url,r=void 0===t?"":t,n=e.query,o=e.form,a=function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var n=Ux(t).call(t,(function(e){return e})).join("&");return n?"?".concat(n):""};if(o){var i=kx(o).some((function(e){var t=o[e].value;return kA(t)||SA(t)})),s=e.headers["content-type"]||e.headers["Content-Type"];if(i||/multipart\/form-data/i.test(s)){var l=CA(e.form);fA(l,e)}else e.body=_A(o);delete e.form}if(n){var c=r.split("?"),p=Om(c,2),d=p[0],u=p[1],h="";if(u){var f=sk(u),m=kx(n);m.forEach((function(e){return delete f[e]})),h=lk(f,{encode:!0})}var y=a(h,_A(n));e.url=d+y,delete e.query}return e}function IA(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function PA(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),bu(e,n.key,n)}}function RA(e,t,r){return t&&PA(e.prototype,t),r&&PA(e,r),bu(e,"prototype",{writable:!1}),e}var LA=ka,NA=Cl.find,DA=!0;"find"in[]&&Array(1).find((function(){DA=!1})),LA({target:"Array",proto:!0,forced:DA},{find:function(e){return NA(this,e,arguments.length>1?arguments[1]:void 0)}});var FA=tp("Array").find,UA=on,BA=FA,qA=Array.prototype;const zA=ir({exports:{}}.exports=function(e){var t=e.find;return e===qA||UA(qA,e)&&t===qA.find?BA:t});const MA=ir({exports:{}}.exports=vb);var HA=ka,WA=lr,VA=_a,GA=Ea,KA=La,JA=Mn,YA=wl,ZA=Ji,QA=Qc("splice"),XA=WA.TypeError,eE=Math.max,tE=Math.min;HA({target:"Array",proto:!0,forced:!QA},{splice:function(e,t){var r,n,o,a,i,s,l=JA(this),c=KA(l),p=VA(e,c),d=arguments.length;if(0===d?r=n=0:1===d?(r=0,n=c-p):(r=d-2,n=tE(eE(GA(t),0),c-p)),c+r-n>9007199254740991)throw XA("Maximum allowed length exceeded");for(o=YA(l,n),a=0;a<n;a++)(i=p+a)in l&&ZA(o,a,l[i]);if(o.length=n,r<n){for(a=p;a<c-n;a++)s=a+r,(i=a+n)in l?l[s]=l[i]:delete l[s];for(a=c;a>c-n+r;a--)delete l[a-1]}else if(r>n)for(a=c-n;a>p;a--)s=a+r-1,(i=a+n-1)in l?l[s]=l[i]:delete l[s];for(a=0;a<r;a++)l[a+p]=arguments[a+2];return l.length=c-n+r,o}});var rE=tp("Array").splice,nE=on,oE=rE,aE=Array.prototype;const iE=ir({exports:{}}.exports=function(e){var t=e.splice;return e===aE||nE(aE,e)&&t===aE.splice?oE:t});var sE,lE=globalThis&&globalThis.__extends||(sE=function(e,t){return sE=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])},sE(e,t)},function(e,t){function r(){this.constructor=e}sE(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),cE=Object.prototype.hasOwnProperty;function pE(e,t){return cE.call(e,t)}function dE(e){if(Array.isArray(e)){for(var t=new Array(e.length),r=0;r<t.length;r++)t[r]=""+r;return t}if(Object.keys)return Object.keys(e);for(var n in t=[],e)pE(e,n)&&t.push(n);return t}function uE(e){switch(typeof e){case"object":return JSON.parse(JSON.stringify(e));case"undefined":return null;default:return e}}function hE(e){for(var t,r=0,n=e.length;r<n;){if(!((t=e.charCodeAt(r))>=48&&t<=57))return!1;r++}return!0}function fE(e){return-1===e.indexOf("/")&&-1===e.indexOf("~")?e:e.replace(/~/g,"~0").replace(/\//g,"~1")}function mE(e){return e.replace(/~1/g,"/").replace(/~0/g,"~")}function yE(e){if(void 0===e)return!0;if(e)if(Array.isArray(e)){for(var t=0,r=e.length;t<r;t++)if(yE(e[t]))return!0}else if("object"==typeof e){var n=dE(e),o=n.length;for(t=0;t<o;t++)if(yE(e[n[t]]))return!0}return!1}function gE(e,t){var r=[e];for(var n in t){var o="object"==typeof t[n]?JSON.stringify(t[n],null,2):t[n];void 0!==o&&r.push(n+": "+o)}return r.join("\n")}var vE=function(e){function t(t,r,n,o,a){var i=this.constructor,s=e.call(this,gE(t,{name:r,index:n,operation:o,tree:a}))||this;return s.name=r,s.index=n,s.operation=o,s.tree=a,Object.setPrototypeOf(s,i.prototype),s.message=gE(t,{name:r,index:n,operation:o,tree:a}),s}return lE(t,e),t}(Error),bE=vE,xE=uE,wE={add:function(e,t,r){return e[t]=this.value,{newDocument:r}},remove:function(e,t,r){var n=e[t];return delete e[t],{newDocument:r,removed:n}},replace:function(e,t,r){var n=e[t];return e[t]=this.value,{newDocument:r,removed:n}},move:function(e,t,r){var n=kE(r,this.path);n&&(n=uE(n));var o=SE(r,{op:"remove",path:this.from}).removed;return SE(r,{op:"add",path:this.path,value:o}),{newDocument:r,removed:n}},copy:function(e,t,r){var n=kE(r,this.from);return SE(r,{op:"add",path:this.path,value:uE(n)}),{newDocument:r}},test:function(e,t,r){return{newDocument:r,test:TE(e[t],this.value)}},_get:function(e,t,r){return this.value=e[t],{newDocument:r}}},$E={add:function(e,t,r){return hE(t)?e.splice(t,0,this.value):e[t]=this.value,{newDocument:r,index:t}},remove:function(e,t,r){return{newDocument:r,removed:e.splice(t,1)[0]}},replace:function(e,t,r){var n=e[t];return e[t]=this.value,{newDocument:r,removed:n}},move:wE.move,copy:wE.copy,test:wE.test,_get:wE._get};function kE(e,t){if(""==t)return e;var r={op:"_get",path:t};return SE(e,r),r.value}function SE(e,t,r,n,o,a){if(void 0===r&&(r=!1),void 0===n&&(n=!0),void 0===o&&(o=!0),void 0===a&&(a=0),r&&("function"==typeof r?r(t,0,e,t.path):EE(t,0)),""===t.path){var i={newDocument:e};if("add"===t.op)return i.newDocument=t.value,i;if("replace"===t.op)return i.newDocument=t.value,i.removed=e,i;if("move"===t.op||"copy"===t.op)return i.newDocument=kE(e,t.from),"move"===t.op&&(i.removed=e),i;if("test"===t.op){if(i.test=TE(e,t.value),!1===i.test)throw new bE("Test operation failed","TEST_OPERATION_FAILED",a,t,e);return i.newDocument=e,i}if("remove"===t.op)return i.removed=e,i.newDocument=null,i;if("_get"===t.op)return t.value=e,i;if(r)throw new bE("Operation `op` property is not one of operations defined in RFC-6902","OPERATION_OP_INVALID",a,t,e);return i}n||(e=uE(e));var s=(t.path||"").split("/"),l=e,c=1,p=s.length,d=void 0,u=void 0,h=void 0;for(h="function"==typeof r?r:EE;;){if((u=s[c])&&-1!=u.indexOf("~")&&(u=mE(u)),o&&"__proto__"==u)throw new TypeError("JSON-Patch: modifying `__proto__` prop is banned for security reasons, if this was on purpose, please set `banPrototypeModifications` flag false and pass it to this function. More info in fast-json-patch README");if(r&&void 0===d&&(void 0===l[u]?d=s.slice(0,c).join("/"):c==p-1&&(d=t.path),void 0!==d&&h(t,0,e,d)),c++,Array.isArray(l)){if("-"===u)u=l.length;else{if(r&&!hE(u))throw new bE("Expected an unsigned base-10 integer value, making the new referenced value the array element with the zero-based index","OPERATION_PATH_ILLEGAL_ARRAY_INDEX",a,t,e);hE(u)&&(u=~~u)}if(c>=p){if(r&&"add"===t.op&&u>l.length)throw new bE("The specified index MUST NOT be greater than the number of elements in the array","OPERATION_VALUE_OUT_OF_BOUNDS",a,t,e);if(!1===(i=$E[t.op].call(t,l,u,e)).test)throw new bE("Test operation failed","TEST_OPERATION_FAILED",a,t,e);return i}}else if(c>=p){if(!1===(i=wE[t.op].call(t,l,u,e)).test)throw new bE("Test operation failed","TEST_OPERATION_FAILED",a,t,e);return i}if(l=l[u],r&&c<p&&(!l||"object"!=typeof l))throw new bE("Cannot perform operation at the desired path","OPERATION_PATH_UNRESOLVABLE",a,t,e)}}function AE(e,t,r,n,o){if(void 0===n&&(n=!0),void 0===o&&(o=!0),r&&!Array.isArray(t))throw new bE("Patch sequence must be an array","SEQUENCE_NOT_AN_ARRAY");n||(e=uE(e));for(var a=new Array(t.length),i=0,s=t.length;i<s;i++)a[i]=SE(e,t[i],r,!0,o,i),e=a[i].newDocument;return a.newDocument=e,a}function EE(e,t,r,n){if("object"!=typeof e||null===e||Array.isArray(e))throw new bE("Operation is not an object","OPERATION_NOT_AN_OBJECT",t,e,r);if(!wE[e.op])throw new bE("Operation `op` property is not one of operations defined in RFC-6902","OPERATION_OP_INVALID",t,e,r);if("string"!=typeof e.path)throw new bE("Operation `path` property is not a string","OPERATION_PATH_INVALID",t,e,r);if(0!==e.path.indexOf("/")&&e.path.length>0)throw new bE('Operation `path` property must start with "/"',"OPERATION_PATH_INVALID",t,e,r);if(("move"===e.op||"copy"===e.op)&&"string"!=typeof e.from)throw new bE("Operation `from` property is not present (applicable in `move` and `copy` operations)","OPERATION_FROM_REQUIRED",t,e,r);if(("add"===e.op||"replace"===e.op||"test"===e.op)&&void 0===e.value)throw new bE("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)","OPERATION_VALUE_REQUIRED",t,e,r);if(("add"===e.op||"replace"===e.op||"test"===e.op)&&yE(e.value))throw new bE("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)","OPERATION_VALUE_CANNOT_CONTAIN_UNDEFINED",t,e,r);if(r)if("add"==e.op){var o=e.path.split("/").length,a=n.split("/").length;if(o!==a+1&&o!==a)throw new bE("Cannot perform an `add` operation at the desired path","OPERATION_PATH_CANNOT_ADD",t,e,r)}else if("replace"===e.op||"remove"===e.op||"_get"===e.op){if(e.path!==n)throw new bE("Cannot perform the operation at a path that does not exist","OPERATION_PATH_UNRESOLVABLE",t,e,r)}else if("move"===e.op||"copy"===e.op){var i=OE([{op:"_get",path:e.from,value:void 0}],r);if(i&&"OPERATION_PATH_UNRESOLVABLE"===i.name)throw new bE("Cannot perform the operation from a path that does not exist","OPERATION_FROM_UNRESOLVABLE",t,e,r)}}function OE(e,t,r){try{if(!Array.isArray(e))throw new bE("Patch sequence must be an array","SEQUENCE_NOT_AN_ARRAY");if(t)AE(uE(t),uE(e),r||!0);else{r=r||EE;for(var n=0;n<e.length;n++)r(e[n],n,t,void 0)}}catch(e){if(e instanceof bE)return e;throw e}}function TE(e,t){if(e===t)return!0;if(e&&t&&"object"==typeof e&&"object"==typeof t){var r,n,o,a=Array.isArray(e),i=Array.isArray(t);if(a&&i){if((n=e.length)!=t.length)return!1;for(r=n;0!=r--;)if(!TE(e[r],t[r]))return!1;return!0}if(a!=i)return!1;var s=Object.keys(e);if((n=s.length)!==Object.keys(t).length)return!1;for(r=n;0!=r--;)if(!t.hasOwnProperty(s[r]))return!1;for(r=n;0!=r--;)if(!TE(e[o=s[r]],t[o]))return!1;return!0}return e!=e&&t!=t}const CE=Object.freeze(Object.defineProperty({__proto__:null,JsonPatchError:bE,deepClone:xE,getValueByPointer:kE,applyOperation:SE,applyPatch:AE,applyReducer:function(e,t,r){var n=SE(e,t);if(!1===n.test)throw new bE("Test operation failed","TEST_OPERATION_FAILED",r,t,e);return n.newDocument},validator:EE,validate:OE,_areEquals:TE},Symbol.toStringTag,{value:"Module"}));var _E=new WeakMap,jE=function(e){this.observers=new Map,this.obj=e},IE=function(e,t){this.callback=e,this.observer=t};function PE(e,t){void 0===t&&(t=!1);var r=_E.get(e.object);RE(r.value,e.object,e.patches,"",t),e.patches.length&&AE(r.value,e.patches);var n=e.patches;return n.length>0&&(e.patches=[],e.callback&&e.callback(n)),n}function RE(e,t,r,n,o){if(t!==e){"function"==typeof t.toJSON&&(t=t.toJSON());for(var a=dE(t),i=dE(e),s=!1,l=i.length-1;l>=0;l--){var c=e[d=i[l]];if(!pE(t,d)||void 0===t[d]&&void 0!==c&&!1===Array.isArray(t))Array.isArray(e)===Array.isArray(t)?(o&&r.push({op:"test",path:n+"/"+fE(d),value:uE(c)}),r.push({op:"remove",path:n+"/"+fE(d)}),s=!0):(o&&r.push({op:"test",path:n,value:e}),r.push({op:"replace",path:n,value:t}));else{var p=t[d];"object"==typeof c&&null!=c&&"object"==typeof p&&null!=p&&Array.isArray(c)===Array.isArray(p)?RE(c,p,r,n+"/"+fE(d),o):c!==p&&(o&&r.push({op:"test",path:n+"/"+fE(d),value:uE(c)}),r.push({op:"replace",path:n+"/"+fE(d),value:uE(p)}))}}if(s||a.length!=i.length)for(l=0;l<a.length;l++){var d;pE(e,d=a[l])||void 0===t[d]||r.push({op:"add",path:n+"/"+fE(d),value:uE(t[d])})}}}const LE=Object.freeze(Object.defineProperty({__proto__:null,unobserve:function(e,t){t.unobserve()},observe:function(e,t){var r,n,o=(n=e,_E.get(n));if(o){var a=function(e,t){return e.observers.get(t)}(o,t);r=a&&a.observer}else o=new jE(e),_E.set(e,o);if(r)return r;if(r={},o.value=uE(e),t){r.callback=t,r.next=null;var i=function(){PE(r)},s=function(){clearTimeout(r.next),r.next=setTimeout(i)};"undefined"!=typeof window&&(window.addEventListener("mouseup",s),window.addEventListener("keyup",s),window.addEventListener("mousedown",s),window.addEventListener("keydown",s),window.addEventListener("change",s))}return r.patches=[],r.object=e,r.unobserve=function(){PE(r),clearTimeout(r.next),function(e,t){e.observers.delete(t.callback)}(o,r),"undefined"!=typeof window&&(window.removeEventListener("mouseup",s),window.removeEventListener("keyup",s),window.removeEventListener("mousedown",s),window.removeEventListener("keydown",s),window.removeEventListener("change",s))},o.observers.set(t,new IE(t,r)),r},generate:PE,compare:function(e,t,r){void 0===r&&(r=!1);var n=[];return RE(e,t,n,"",r),n}},Symbol.toStringTag,{value:"Module"}));Object.assign({},CE,LE,{JsonPatchError:vE,deepClone:uE,escapePathComponent:fE,unescapePathComponent:mE});var NE=function(e){return!(t=e,!t||"object"!=typeof t||function(e){var t=Object.prototype.toString.call(e);return"[object RegExp]"===t||"[object Date]"===t||e.$$typeof===DE}(e));var t},DE="function"==typeof Symbol&&Symbol.for?Symbol.for("react.element"):60103;function FE(e,t){return!1!==t.clone&&t.isMergeableObject(e)?zE((r=e,Array.isArray(r)?[]:{}),e,t):e;var r}function UE(e,t,r){return e.concat(t).map((function(e){return FE(e,r)}))}function BE(e){return Object.keys(e).concat((t=e,Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(t).filter((function(e){return t.propertyIsEnumerable(e)})):[]));var t}function qE(e,t){try{return t in e}catch(e){return!1}}function zE(e,t,r){(r=r||{}).arrayMerge=r.arrayMerge||UE,r.isMergeableObject=r.isMergeableObject||NE,r.cloneUnlessOtherwiseSpecified=FE;var n=Array.isArray(t);return n===Array.isArray(e)?n?r.arrayMerge(e,t,r):function(e,t,r){var n={};return r.isMergeableObject(e)&&BE(e).forEach((function(t){n[t]=FE(e[t],r)})),BE(t).forEach((function(o){var a,i;qE(a=e,i=o)&&(!Object.hasOwnProperty.call(a,i)||!Object.propertyIsEnumerable.call(a,i))||(qE(e,o)&&r.isMergeableObject(t[o])?n[o]=function(e,t){if(!t.customMerge)return zE;var r=t.customMerge(e);return"function"==typeof r?r:zE}(o,r)(e[o],t[o],r):n[o]=FE(t[o],r))})),n}(e,t,r):FE(t,r)}zE.all=function(e,t){if(!Array.isArray(e))throw new Error("first argument should be an array");return e.reduce((function(e,r){return zE(e,r,t)}),{})};var ME=zE;const HE={add:function(e,t){return{op:"add",path:e,value:t}},replace:VE,remove:function(e){return{op:"remove",path:e}},merge:function(e,t){return{type:"mutation",op:"merge",path:e,value:t}},mergeDeep:function(e,t){return{type:"mutation",op:"mergeDeep",path:e,value:t}},context:function(e,t){return{type:"context",path:e,value:t}},getIn:function(e,t){return t.reduce((function(e,t){return void 0!==t&&e?e[t]:e}),e)},applyPatch:function(e,t,r){if(r=r||{},"merge"===(t=$u($u({},t),{},{path:t.path&&WE(t.path)})).op){var n=aO(e,t.path);Fu(n,t.value),AE(e,[VE(t.path,n)])}else if("mergeDeep"===t.op){var o=aO(e,t.path),a=ME(o,t.value);e=AE(e,[VE(t.path,a)]).newDocument}else if("add"===t.op&&""===t.path&&XE(t.value)){AE(e,kx(t.value).reduce((function(e,r){return e.push({op:"add",path:"/".concat(WE(r)),value:t.value[r]}),e}),[]))}else if("replace"===t.op&&""===t.path){var i=t.value;r.allowMetaPatches&&t.meta&&nO(t)&&(Array.isArray(t.value)||XE(t.value))&&(i=$u($u({},i),t.meta)),e=i}else if(AE(e,[t]),r.allowMetaPatches&&t.meta&&nO(t)&&(Array.isArray(t.value)||XE(t.value))){var s=$u($u({},aO(e,t.path)),t.meta);AE(e,[VE(t.path,s)])}return e},parentPathMatch:function(e,t){if(!Array.isArray(t))return!1;for(var r=0,n=t.length;r<n;r+=1)if(t[r]!==e[r])return!1;return!0},flatten:ZE,fullyNormalizeArray:function(e){return QE(ZE(YE(e)))},normalizeArray:YE,isPromise:function(e){return XE(e)&&eO(e.then)},forEachNew:function(e,t){try{return GE(e,JE,t)}catch(e){return e}},forEachNewPrimitive:function(e,t){try{return GE(e,KE,t)}catch(e){return e}},isJsonPatch:tO,isContextPatch:function(e){return oO(e)&&"context"===e.type},isPatch:oO,isMutation:rO,isAdditiveMutation:nO,isGenerator:function(e){return"[object GeneratorFunction]"===Object.prototype.toString.call(e)},isFunction:eO,isObject:XE,isError:function(e){return e instanceof Error}};function WE(e){return Array.isArray(e)?e.length<1?"":"/".concat($x(e).call(e,(function(e){return(e+"").replace(/~/g,"~0").replace(/\//g,"~1")})).join("/")):e}function VE(e,t,r){return{op:"replace",path:e,value:t,meta:r}}function GE(e,t,r){var n;return QE(ZE($x(n=Ux(e).call(e,nO)).call(n,(function(e){return t(e.value,r,e.path)}))||[]))}function KE(e,t,r){return r=r||[],Array.isArray(e)?$x(e).call(e,(function(e,n){return KE(e,t,Tx(r).call(r,n))})):XE(e)?$x(n=kx(e)).call(n,(function(n){return KE(e[n],t,Tx(r).call(r,n))})):t(e,r[r.length-1],r);var n}function JE(e,t,r){var n=[];if((r=r||[]).length>0){var o=t(e,r[r.length-1],r);o&&(n=Tx(n).call(n,o))}if(Array.isArray(e)){var a=$x(e).call(e,(function(e,n){return JE(e,t,Tx(r).call(r,n))}));a&&(n=Tx(n).call(n,a))}else if(XE(e)){var i,s=$x(i=kx(e)).call(i,(function(n){return JE(e[n],t,Tx(r).call(r,n))}));s&&(n=Tx(n).call(n,s))}return ZE(n)}function YE(e){return Array.isArray(e)?e:[e]}function ZE(e){var t;return Tx(t=[]).apply(t,lA($x(e).call(e,(function(e){return Array.isArray(e)?ZE(e):e}))))}function QE(e){return Ux(e).call(e,(function(e){return void 0!==e}))}function XE(e){return e&&"object"===Em(e)}function eO(e){return e&&"function"==typeof e}function tO(e){if(oO(e)){var t=e.op;return"add"===t||"remove"===t||"replace"===t}return!1}function rO(e){return tO(e)||oO(e)&&"mutation"===e.type}function nO(e){return rO(e)&&("add"===e.op||"replace"===e.op||"merge"===e.op||"mergeDeep"===e.op)}function oO(e){return e&&"object"===Em(e)}function aO(e,t){try{return kE(e,t)}catch(e){return console.error(e),{}}}var iO={exports:{}},sO=cr((function(){if("function"==typeof ArrayBuffer){var e=new ArrayBuffer(8);Object.isExtensible(e)&&Object.defineProperty(e,"a",{value:8})}})),lO=cr,cO=Zr,pO=Fr,dO=sO,uO=Object.isExtensible,hO=lO((function(){uO(1)}))||dO?function(e){return!!cO(e)&&(!dO||"ArrayBuffer"!=pO(e))&&(!uO||uO(e))}:uO,fO=!cr((function(){return Object.isExtensible(Object.preventExtensions({}))})),mO=ka,yO=wr,gO=qa,vO=Zr,bO=Vn,xO=Ko.f,wO=zi,$O=Wi,kO=hO,SO=fO,AO=!1,EO=Zn("meta"),OO=0,TO=function(e){xO(e,EO,{value:{objectID:"O"+OO++,weakData:{}}})},CO=iO.exports={enable:function(){CO.enable=function(){},AO=!0;var e=wO.f,t=yO([].splice),r={};r[EO]=1,e(r).length&&(wO.f=function(r){for(var n=e(r),o=0,a=n.length;o<a;o++)if(n[o]===EO){t(n,o,1);break}return n},mO({target:"Object",stat:!0,forced:!0},{getOwnPropertyNames:$O.f}))},fastKey:function(e,t){if(!vO(e))return"symbol"==typeof e?e:("string"==typeof e?"S":"P")+e;if(!bO(e,EO)){if(!kO(e))return"F";if(!t)return"E";TO(e)}return e[EO].objectID},getWeakData:function(e,t){if(!bO(e,EO)){if(!kO(e))return!0;if(!t)return!1;TO(e)}return e[EO].weakData},onFreeze:function(e){return SO&&AO&&kO(e)&&!bO(e,EO)&&TO(e),e}};gO[EO]=!0;var _O=ka,jO=lr,IO=iO.exports,PO=cr,RO=da,LO=Zm,NO=Iy,DO=$r,FO=Zr,UO=Es,BO=Ko.f,qO=Cl.forEach,zO=Sr,MO=el.set,HO=el.getterFor,WO=wr,VO=Ay,GO=iO.exports.getWeakData,KO=ea,JO=Zr,YO=Iy,ZO=Zm,QO=Vn,XO=el.set,eT=el.getterFor,tT=Cl.find,rT=Cl.findIndex,nT=WO([].splice),oT=0,aT=function(e){return e.frozen||(e.frozen=new iT)},iT=function(){this.entries=[]},sT=function(e,t){return tT(e.entries,(function(e){return e[0]===t}))};iT.prototype={get:function(e){var t=sT(this,e);if(t)return t[1]},has:function(e){return!!sT(this,e)},set:function(e,t){var r=sT(this,e);r?r[1]=t:this.entries.push([e,t])},delete:function(e){var t=rT(this.entries,(function(t){return t[0]===e}));return~t&&nT(this.entries,t,1),!!~t}};var lT,cT={getConstructor:function(e,t,r,n){var o=e((function(e,o){YO(e,a),XO(e,{type:t,id:oT++,frozen:void 0}),null!=o&&ZO(o,e[n],{that:e,AS_ENTRIES:r})})),a=o.prototype,i=eT(t),s=function(e,t,r){var n=i(e),o=GO(KO(t),!0);return!0===o?aT(n).set(t,r):o[n.id]=r,e};return VO(a,{delete:function(e){var t=i(this);if(!JO(e))return!1;var r=GO(e);return!0===r?aT(t).delete(e):r&&QO(r,t.id)&&delete r[t.id]},has:function(e){var t=i(this);if(!JO(e))return!1;var r=GO(e);return!0===r?aT(t).has(e):r&&QO(r,t.id)}}),VO(a,r?{get:function(e){var t=i(this);if(JO(e)){var r=GO(e);return!0===r?aT(t).get(e):r?r[t.id]:void 0}},set:function(e,t){return s(this,e,t)}}:{add:function(e){return s(this,e,!0)}}),o}},pT=lr,dT=wr,uT=Ay,hT=iO.exports,fT=cT,mT=Zr,yT=hO,gT=el.enforce,vT=Ds,bT=!pT.ActiveXObject&&"ActiveXObject"in pT,xT=function(e){return function(){return e(this,arguments.length?arguments[0]:void 0)}},wT=function(e,t,r){var n,o=-1!==e.indexOf("Map"),a=-1!==e.indexOf("Weak"),i=o?"set":"add",s=jO[e],l=s&&s.prototype,c={};if(zO&&DO(s)&&(a||l.forEach&&!PO((function(){(new s).entries().next()})))){var p=(n=t((function(t,r){MO(NO(t,p),{type:e,collection:new s}),null!=r&&LO(r,t[i],{that:t,AS_ENTRIES:o})}))).prototype,d=HO(e);qO(["add","clear","delete","forEach","get","has","set","keys","values","entries"],(function(e){var t="add"==e||"set"==e;!(e in l)||a&&"clear"==e||RO(p,e,(function(r,n){var o=d(this).collection;if(!t&&a&&!FO(r))return"get"==e&&void 0;var i=o[e](0===r?0:r,n);return t?this:i}))})),a||BO(p,"size",{configurable:!0,get:function(){return d(this).collection.size}})}else n=r.getConstructor(t,e,o,i),IO.enable();return UO(n,e,!1,!0),c[e]=n,_O({global:!0,forced:!0},c),a||r.setStrong(n,e,o),n}("WeakMap",xT,fT);if(vT&&bT){lT=fT.getConstructor(xT,"WeakMap",!0),hT.enable();var $T=wT.prototype,kT=dT($T.delete),ST=dT($T.has),AT=dT($T.get),ET=dT($T.set);uT($T,{delete:function(e){if(mT(e)&&!yT(e)){var t=gT(this);return t.frozen||(t.frozen=new lT),kT(this,e)||t.frozen.delete(e)}return kT(this,e)},has:function(e){if(mT(e)&&!yT(e)){var t=gT(this);return t.frozen||(t.frozen=new lT),ST(this,e)||t.frozen.has(e)}return ST(this,e)},get:function(e){if(mT(e)&&!yT(e)){var t=gT(this);return t.frozen||(t.frozen=new lT),ST(this,e)?AT(this,e):t.frozen.get(e)}return AT(this,e)},set:function(e,t){if(mT(e)&&!yT(e)){var r=gT(this);r.frozen||(r.frozen=new lT),ST(this,e)?ET(this,e,t):r.frozen.set(e,t)}else ET(this,e,t);return this}})}const OT=ir({exports:{}}.exports=Qr.WeakMap);var TT=cr,CT=lo("iterator"),_T=!TT((function(){var e=new URL("b?a=1&b=2&c=3","http://a"),t=e.searchParams,r="";return e.pathname="c%20d",t.forEach((function(e,n){t.delete("b"),r+=n+e})),!e.toJSON||!t.sort||"http://a/c%20d?a=1&c=3"!==e.href||"3"!==t.get("c")||"a=1"!==String(new URLSearchParams("?a=1"))||!t[CT]||"a"!==new URL("https://a@b").username||"b"!==new URLSearchParams(new URLSearchParams("a=b")).get("a")||"xn--e1aybc"!==new URL("http://тест").host||"#%D0%B1"!==new URL("http://a#б").hash||"a1c3"!==r||"x"!==new URL("http://x",void 0).host})),jT=ts,IT=Math.floor,PT=function(e,t){var r=e.length,n=IT(r/2);return r<8?RT(e,t):LT(e,PT(jT(e,0,n),t),PT(jT(e,n),t),t)},RT=function(e,t){for(var r,n,o=e.length,a=1;a<o;){for(n=a,r=e[a];n&&t(e[n-1],r)>0;)e[n]=e[--n];n!==a++&&(e[n]=r)}return e},LT=function(e,t,r,n){for(var o=t.length,a=r.length,i=0,s=0;i<o||s<a;)e[i+s]=i<o&&s<a?n(t[i],r[s])<=0?t[i++]:r[s++]:i<o?t[i++]:r[s++];return e},NT=ka,DT=lr,FT=nn,UT=Or,BT=wr,qT=_T,zT=ps,MT=Ay,HT=Es,WT=ed,VT=el,GT=Iy,KT=$r,JT=Vn,YT=Go,ZT=hi,QT=ea,XT=Zr,eC=yi,tC=qi,rC=Rr,nC=rm,oC=mf,aC=By,iC=PT,sC=lo("iterator"),lC=VT.set,cC=VT.getterFor("URLSearchParams"),pC=VT.getterFor("URLSearchParamsIterator"),dC=FT("fetch"),uC=FT("Request"),hC=FT("Headers"),fC=uC&&uC.prototype,mC=hC&&hC.prototype,yC=DT.RegExp,gC=DT.TypeError,vC=DT.decodeURIComponent,bC=DT.encodeURIComponent,xC=BT("".charAt),wC=BT([].join),$C=BT([].push),kC=BT("".replace),SC=BT([].shift),AC=BT([].splice),EC=BT("".split),OC=BT("".slice),TC=/\+/g,CC=Array(4),_C=function(e){return CC[e-1]||(CC[e-1]=yC("((?:%[\\da-f]{2}){"+e+"})","gi"))},jC=function(e){try{return vC(e)}catch(t){return e}},IC=function(e){var t=kC(e,TC," "),r=4;try{return vC(t)}catch(e){for(;r;)t=kC(t,_C(r--),jC);return t}},PC=/[!'()~]|%20/g,RC={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+"},LC=function(e){return RC[e]},NC=function(e){return kC(bC(e),PC,LC)},DC=WT((function(e,t){lC(this,{type:"URLSearchParamsIterator",iterator:nC(cC(e).entries),kind:t})}),"Iterator",(function(){var e=pC(this),t=e.kind,r=e.iterator.next(),n=r.value;return r.done||(r.value="keys"===t?n.key:"values"===t?n.value:[n.key,n.value]),r}),!0),FC=function(e){this.entries=[],this.url=null,void 0!==e&&(XT(e)?this.parseObject(e):this.parseQuery("string"==typeof e?"?"===xC(e,0)?OC(e,1):e:eC(e)))};FC.prototype={type:"URLSearchParams",bindURL:function(e){this.url=e,this.update()},parseObject:function(e){var t,r,n,o,a,i,s,l=oC(e);if(l)for(r=(t=nC(e,l)).next;!(n=UT(r,t)).done;){if(a=(o=nC(QT(n.value))).next,(i=UT(a,o)).done||(s=UT(a,o)).done||!UT(a,o).done)throw gC("Expected sequence with length 2");$C(this.entries,{key:eC(i.value),value:eC(s.value)})}else for(var c in e)JT(e,c)&&$C(this.entries,{key:c,value:eC(e[c])})},parseQuery:function(e){if(e)for(var t,r,n=EC(e,"&"),o=0;o<n.length;)(t=n[o++]).length&&(r=EC(t,"="),$C(this.entries,{key:IC(SC(r)),value:IC(wC(r,"="))}))},serialize:function(){for(var e,t=this.entries,r=[],n=0;n<t.length;)e=t[n++],$C(r,NC(e.key)+"="+NC(e.value));return wC(r,"&")},update:function(){this.entries.length=0,this.parseQuery(this.url.query)},updateURL:function(){this.url&&this.url.update()}};var UC=function(){GT(this,BC);var e=arguments.length>0?arguments[0]:void 0;lC(this,new FC(e))},BC=UC.prototype;if(MT(BC,{append:function(e,t){aC(arguments.length,2);var r=cC(this);$C(r.entries,{key:eC(e),value:eC(t)}),r.updateURL()},delete:function(e){aC(arguments.length,1);for(var t=cC(this),r=t.entries,n=eC(e),o=0;o<r.length;)r[o].key===n?AC(r,o,1):o++;t.updateURL()},get:function(e){aC(arguments.length,1);for(var t=cC(this).entries,r=eC(e),n=0;n<t.length;n++)if(t[n].key===r)return t[n].value;return null},getAll:function(e){aC(arguments.length,1);for(var t=cC(this).entries,r=eC(e),n=[],o=0;o<t.length;o++)t[o].key===r&&$C(n,t[o].value);return n},has:function(e){aC(arguments.length,1);for(var t=cC(this).entries,r=eC(e),n=0;n<t.length;)if(t[n++].key===r)return!0;return!1},set:function(e,t){aC(arguments.length,1);for(var r,n=cC(this),o=n.entries,a=!1,i=eC(e),s=eC(t),l=0;l<o.length;l++)(r=o[l]).key===i&&(a?AC(o,l--,1):(a=!0,r.value=s));a||$C(o,{key:i,value:s}),n.updateURL()},sort:function(){var e=cC(this);iC(e.entries,(function(e,t){return e.key>t.key?1:-1})),e.updateURL()},forEach:function(e){for(var t,r=cC(this).entries,n=YT(e,arguments.length>1?arguments[1]:void 0),o=0;o<r.length;)n((t=r[o++]).value,t.key,this)},keys:function(){return new DC(this,"keys")},values:function(){return new DC(this,"values")},entries:function(){return new DC(this,"entries")}},{enumerable:!0}),zT(BC,sC,BC.entries,{name:"entries"}),zT(BC,"toString",(function(){return cC(this).serialize()}),{enumerable:!0}),HT(UC,"URLSearchParams"),NT({global:!0,forced:!qT},{URLSearchParams:UC}),!qT&&KT(hC)){var qC=BT(mC.has),zC=BT(mC.set),MC=function(e){if(XT(e)){var t,r=e.body;if("URLSearchParams"===ZT(r))return t=e.headers?new hC(e.headers):new hC,qC(t,"content-type")||zC(t,"content-type","application/x-www-form-urlencoded;charset=UTF-8"),tC(e,{body:rC(0,eC(r)),headers:rC(0,t)})}return e};if(KT(dC)&&NT({global:!0,enumerable:!0,forced:!0},{fetch:function(e){return dC(e,arguments.length>1?MC(arguments[1]):{})}}),KT(uC)){var HC=function(e){return GT(this,fC),new uC(e,arguments.length>1?MC(arguments[1]):{})};fC.constructor=HC,HC.prototype=fC,NT({global:!0,forced:!0},{Request:HC})}}const WC=ir({exports:{}}.exports=Qr.URLSearchParams);function VC(e,t){function r(){Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack;for(var e=arguments.length,r=new Array(e),n=0;n<e;n++)r[n]=arguments[n];this.message=r[0],t&&t.apply(this,r)}return r.prototype=new Error,r.prototype.name=e,r.prototype.constructor=r,r}var GC={exports:{}},KC=GC.exports=function(e){return new JC(e)};function JC(e){this.value=e}function YC(e,t,r){var n=[],o=[],a=!0;return function e(i){var s=r?ZC(i):i,l={},c=!0,p={node:s,node_:i,path:[].concat(n),parent:o[o.length-1],parents:o,key:n.slice(-1)[0],isRoot:0===n.length,level:n.length,circular:null,update:function(e,t){p.isRoot||(p.parent.node[p.key]=e),p.node=e,t&&(c=!1)},delete:function(e){delete p.parent.node[p.key],e&&(c=!1)},remove:function(e){e_(p.parent.node)?p.parent.node.splice(p.key,1):delete p.parent.node[p.key],e&&(c=!1)},keys:null,before:function(e){l.before=e},after:function(e){l.after=e},pre:function(e){l.pre=e},post:function(e){l.post=e},stop:function(){a=!1},block:function(){c=!1}};if(!a)return p;function d(){if("object"==typeof p.node&&null!==p.node){p.keys&&p.node_===p.node||(p.keys=QC(p.node)),p.isLeaf=0==p.keys.length;for(var e=0;e<o.length;e++)if(o[e].node_===i){p.circular=o[e];break}}else p.isLeaf=!0,p.keys=null;p.notLeaf=!p.isLeaf,p.notRoot=!p.isRoot}d();var u=t.call(p,p.node);return void 0!==u&&p.update&&p.update(u),l.before&&l.before.call(p,p.node),c?("object"!=typeof p.node||null===p.node||p.circular||(o.push(p),d(),t_(p.keys,(function(t,o){n.push(t),l.pre&&l.pre.call(p,p.node[t],t);var a=e(p.node[t]);r&&r_.call(p.node,t)&&(p.node[t]=a.node),a.isLast=o==p.keys.length-1,a.isFirst=0==o,l.post&&l.post.call(p,a),n.pop()})),o.pop()),l.after&&l.after.call(p,p.node),p):p}(e).node}function ZC(e){if("object"==typeof e&&null!==e){var t;if(e_(e))t=[];else if("[object Date]"===XC(e))t=new Date(e.getTime?e.getTime():e);else if("[object RegExp]"===XC(e))t=new RegExp(e);else if(function(e){return"[object Error]"===XC(e)}(e))t={message:e.message};else if(function(e){return"[object Boolean]"===XC(e)}(e))t=new Boolean(e);else if(function(e){return"[object Number]"===XC(e)}(e))t=new Number(e);else if(function(e){return"[object String]"===XC(e)}(e))t=new String(e);else if(Object.create&&Object.getPrototypeOf)t=Object.create(Object.getPrototypeOf(e));else if(e.constructor===Object)t={};else{var r=e.constructor&&e.constructor.prototype||e.__proto__||{},n=function(){};n.prototype=r,t=new n}return t_(QC(e),(function(r){t[r]=e[r]})),t}return e}JC.prototype.get=function(e){for(var t=this.value,r=0;r<e.length;r++){var n=e[r];if(!t||!r_.call(t,n)){t=void 0;break}t=t[n]}return t},JC.prototype.has=function(e){for(var t=this.value,r=0;r<e.length;r++){var n=e[r];if(!t||!r_.call(t,n))return!1;t=t[n]}return!0},JC.prototype.set=function(e,t){for(var r=this.value,n=0;n<e.length-1;n++){var o=e[n];r_.call(r,o)||(r[o]={}),r=r[o]}return r[e[n]]=t,t},JC.prototype.map=function(e){return YC(this.value,e,!0)},JC.prototype.forEach=function(e){return this.value=YC(this.value,e,!1),this.value},JC.prototype.reduce=function(e,t){var r=1===arguments.length,n=r?this.value:t;return this.forEach((function(t){this.isRoot&&r||(n=e.call(this,n,t))})),n},JC.prototype.paths=function(){var e=[];return this.forEach((function(t){e.push(this.path)})),e},JC.prototype.nodes=function(){var e=[];return this.forEach((function(t){e.push(this.node)})),e},JC.prototype.clone=function(){var e=[],t=[];return function r(n){for(var o=0;o<e.length;o++)if(e[o]===n)return t[o];if("object"==typeof n&&null!==n){var a=ZC(n);return e.push(n),t.push(a),t_(QC(n),(function(e){a[e]=r(n[e])})),e.pop(),t.pop(),a}return n}(this.value)};var QC=Object.keys||function(e){var t=[];for(var r in e)t.push(r);return t};function XC(e){return Object.prototype.toString.call(e)}var e_=Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)},t_=function(e,t){if(e.forEach)return e.forEach(t);for(var r=0;r<e.length;r++)t(e[r],r,e)};t_(QC(JC.prototype),(function(e){KC[e]=function(t){var r=[].slice.call(arguments,1),n=new JC(t);return n[e].apply(n,r)}}));var r_=Object.hasOwnProperty||function(e,t){return t in e},n_=["properties"],o_=["properties"],a_=["definitions","parameters","responses","securityDefinitions","components/schemas","components/responses","components/parameters","components/securitySchemes"],i_=["schema/example","items/example"];function s_(e){var t=e[e.length-1],r=e[e.length-2],n=e.join("/");return n_.indexOf(t)>-1&&-1===o_.indexOf(r)||a_.indexOf(n)>-1||i_.some((function(e){return n.indexOf(e)>-1}))}function l_(e,t){var r,n=Om(e.split("#"),2),o=n[0],a=n[1],i=sh.resolve(o||"",t||"");return a?Tx(r="".concat(i,"#")).call(r,a):i}var c_=/^([a-z]+:\/\/|\/\/)/i,p_=VC("JSONRefError",(function(e,t,r){this.originalError=r,Fu(this,t||{})})),d_={},u_=new OT,h_=[function(e){return"paths"===e[0]&&"responses"===e[3]&&"examples"===e[5]},function(e){return"paths"===e[0]&&"responses"===e[3]&&"content"===e[5]&&"example"===e[7]},function(e){return"paths"===e[0]&&"responses"===e[3]&&"content"===e[5]&&"examples"===e[7]&&"value"===e[9]},function(e){return"paths"===e[0]&&"requestBody"===e[3]&&"content"===e[4]&&"example"===e[6]},function(e){return"paths"===e[0]&&"requestBody"===e[3]&&"content"===e[4]&&"examples"===e[6]&&"value"===e[8]},function(e){return"paths"===e[0]&&"parameters"===e[2]&&"example"===e[4]},function(e){return"paths"===e[0]&&"parameters"===e[3]&&"example"===e[5]},function(e){return"paths"===e[0]&&"parameters"===e[2]&&"examples"===e[4]&&"value"===e[6]},function(e){return"paths"===e[0]&&"parameters"===e[3]&&"examples"===e[5]&&"value"===e[7]},function(e){return"paths"===e[0]&&"parameters"===e[2]&&"content"===e[4]&&"example"===e[6]},function(e){return"paths"===e[0]&&"parameters"===e[2]&&"content"===e[4]&&"examples"===e[6]&&"value"===e[8]},function(e){return"paths"===e[0]&&"parameters"===e[3]&&"content"===e[4]&&"example"===e[7]},function(e){return"paths"===e[0]&&"parameters"===e[3]&&"content"===e[5]&&"examples"===e[7]&&"value"===e[9]}],f_={key:"$ref",plugin:function(e,t,r,n){var o,a=n.getInstance(),i=cA(r).call(r,0,-1);if(!s_(i)&&(o=i,!h_.some((function(e){return e(o)})))){var s=n.getContext(r).baseDoc;if("string"!=typeof e)return new p_("$ref: must be a string (JSON-Ref)",{$ref:e,baseDoc:s,fullPath:r});var l,c,p,d=v_(e),u=d[0],h=d[1]||"";try{l=s||u?y_(u,s):null}catch(t){return g_(t,{pointer:h,$ref:e,basePath:l,fullPath:r})}if(function(e,t,r,n){var o,a,i=u_.get(n);i||(i={},u_.set(n,i));var s,l=0===(s=r).length?"":"/".concat($x(s).call(s,S_).join("/")),c=Tx(o="".concat(t||"<specmap-base>","#")).call(o,e),p=l.replace(/allOf\/\d+\/?/g,"");if(t===n.contextTree.get([]).baseDoc&&A_(p,e))return!0;var d="",u=r.some((function(e){var t;return d=Tx(t="".concat(d,"/")).call(t,S_(e)),i[d]&&i[d].some((function(e){return A_(e,c)||A_(c,e)}))}));if(u)return!0;i[p]=Tx(a=i[p]||[]).call(a,c)}(h,l,i,n)&&!a.useCircularStructures){var f=l_(e,l);return e===f?null:HE.replace(r,f)}if(null==l?(p=$_(h),void 0===(c=n.get(p))&&(c=new p_("Could not resolve reference: ".concat(e),{pointer:h,$ref:e,baseDoc:s,fullPath:r}))):c=null!=(c=b_(l,h)).l?c.l:c.catch((function(t){throw g_(t,{pointer:h,$ref:e,baseDoc:s,fullPath:r})})),c instanceof Error)return[HE.remove(r),c];var m=l_(e,l),y=HE.replace(i,c,{$$ref:m});if(l&&l!==s)return[y,HE.context(i,{baseDoc:l})];try{if(!function(e,t){var r=[e];return t.path.reduce((function(e,t){return r.push(e[t]),e[t]}),e),function e(t){return HE.isObject(t)&&(r.indexOf(t)>=0||kx(t).some((function(r){return e(t[r])})))}(t.value)}(n.state,y)||a.useCircularStructures)return y}catch(o){return null}}}},m_=Fu(f_,{docCache:d_,absoluteify:y_,clearCache:function(e){void 0!==e?delete d_[e]:kx(d_).forEach((function(e){delete d_[e]}))},JSONRefError:p_,wrapError:g_,getDoc:x_,split:v_,extractFromDoc:b_,fetchJSON:function(e){return fetch(e,{headers:{Accept:"application/json, application/yaml"},loadSpec:!0}).then((function(e){return e.text()})).then((function(e){return nA.load(e)}))},extract:w_,jsonPointerToArray:$_,unescapeJsonPointerToken:k_});function y_(e,t){if(!c_.test(e)){var r;if(!t)throw new p_(Tx(r="Tried to resolve a relative URL, without having a basePath. path: '".concat(e,"' basePath: '")).call(r,t,"'"));return sh.resolve(t,e)}return e}function g_(e,t){var r,n;return r=e&&e.response&&e.response.body?Tx(n="".concat(e.response.body.code," ")).call(n,e.response.body.message):e.message,new p_("Could not resolve reference: ".concat(r),t,e)}function v_(e){return(e+"").split("#")}function b_(e,t){var r=d_[e];if(r&&!HE.isPromise(r))try{var n=w_(t,r);return Fu(MA.resolve(n),{l:n})}catch(e){return MA.reject(e)}return x_(e).then((function(e){return w_(t,e)}))}function x_(e){var t=d_[e];return t?HE.isPromise(t)?t:MA.resolve(t):(d_[e]=m_.fetchJSON(e).then((function(t){return d_[e]=t,t})),d_[e])}function w_(e,t){var r=$_(e);if(r.length<1)return t;var n=HE.getIn(t,r);if(void 0===n)throw new p_("Could not resolve pointer: ".concat(e," does not exist in document"),{pointer:e});return n}function $_(e){var t;if("string"!=typeof e)throw new TypeError("Expected a string, got a ".concat(Em(e)));return"/"===e[0]&&(e=e.substr(1)),""===e?[]:$x(t=e.split("/")).call(t,k_)}function k_(e){return"string"!=typeof e?e:new WC("=".concat(e.replace(/~1/g,"/").replace(/~0/g,"~"))).get("")}function S_(e){var t,r=new WC([["",e.replace(/~/g,"~0").replace(/\//g,"~1")]]);return cA(t=r.toString()).call(t,1)}function A_(e,t){if(!(r=t)||"/"===r||"#"===r)return!0;var r,n=e.charAt(t.length),o=cA(t).call(t,-1);return 0===e.indexOf(t)&&(!n||"/"===n||"#"===n)&&"#"!==o}const E_={key:"allOf",plugin:function(e,t,r,n,o){if(!o.meta||!o.meta.$$ref){var a=cA(r).call(r,0,-1);if(!s_(a)){if(!Array.isArray(e)){var i=new TypeError("allOf must be an array");return i.fullPath=r,i}var s=!1,l=o.value;if(a.forEach((function(e){l&&(l=l[e])})),l=$u({},l),0!==kx(l).length){delete l.allOf;var c,p,d=[];return d.push(n.replace(a,{})),e.forEach((function(e,t){if(!n.isObject(e)){if(s)return null;s=!0;var o=new TypeError("Elements in allOf must be objects");return o.fullPath=r,d.push(o)}d.push(n.mergeDeep(a,e));var i=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=r.specmap,o=r.getBaseUrlForNodePath,a=void 0===o?function(e){var r;return n.getContext(Tx(r=[]).call(r,lA(t),lA(e))).baseDoc}:o,i=r.targetKeys,s=void 0===i?["$ref","$$ref"]:i,l=[];return GC.exports(e).forEach((function(){if(qb(s).call(s,this.key)&&"string"==typeof this.node){var e=this.path,r=Tx(t).call(t,this.path),o=l_(this.node,a(e));l.push(n.replace(r,o))}})),l}(e,cA(r).call(r,0,-1),{getBaseUrlForNodePath:function(e){var o;return n.getContext(Tx(o=[]).call(o,lA(r),[t],lA(e))).baseDoc},specmap:n});d.push.apply(d,lA(i))})),l.example&&d.push(n.remove(Tx(c=[]).call(c,a,"example"))),d.push(n.mergeDeep(a,l)),l.$$ref||d.push(n.remove(Tx(p=[]).call(p,a,"$$ref"))),d}}}}},O_={key:"parameters",plugin:function(e,t,r,n){if(Array.isArray(e)&&e.length){var o=Fu([],e),a=cA(r).call(r,0,-1),i=$u({},HE.getIn(n.spec,a));return e.forEach((function(e,t){try{o[t].default=n.parameterMacro(i,e)}catch(e){var a=new Error(e);return a.fullPath=r,a}})),HE.replace(r,o)}return HE.replace(r,e)}},T_={key:"properties",plugin:function(e,t,r,n){var o=$u({},e);for(var a in e)try{o[a].default=n.modelPropertyMacro(o[a])}catch(e){var i=new Error(e);return i.fullPath=r,i}return HE.replace(r,o)}};var C_=function(){function e(t){IA(this,e),this.root=__(t||{})}return RA(e,[{key:"set",value:function(e,t){var r=this.getParent(e,!0);if(r){var n=e[e.length-1],o=r.children;o[n]?j_(o[n],t,r):o[n]=__(t,r)}else j_(this.root,t,null)}},{key:"get",value:function(e){if((e=e||[]).length<1)return this.root.value;for(var t,r,n=this.root,o=0;o<e.length&&(r=e[o],(t=n.children)[r]);o+=1)n=t[r];return n&&n.protoValue}},{key:"getParent",value:function(e,t){return!e||e.length<1?null:e.length<2?this.root:cA(e).call(e,0,-1).reduce((function(e,r){if(!e)return e;var n=e.children;return!n[r]&&t&&(n[r]=__(null,e)),n[r]}),this.root)}}]),e}();function __(e,t){return j_({children:{}},e,t)}function j_(e,t,r){return e.value=t||{},e.protoValue=r?$u($u({},r.protoValue),e.value):e.value,kx(e.children).forEach((function(t){var r=e.children[t];e.children[t]=j_(r,r.value,e)})),e}var I_=function(){},P_=function(){function e(t){var r,n,o=this;IA(this,e),Fu(this,{spec:"",debugLevel:"info",plugins:[],pluginHistory:{},errors:[],mutations:[],promisedPatches:[],state:{},patches:[],context:{},contextTree:new C_,showDebug:!1,allPatches:[],pluginProp:"specMap",libMethods:Fu(Object.create(this),HE,{getInstance:function(){return o}}),allowMetaPatches:!1},t),this.get=this._get.bind(this),this.getContext=this._getContext.bind(this),this.hasRun=this._hasRun.bind(this),this.wrappedPlugins=Ux(r=$x(n=this.plugins).call(n,this.wrapPlugin.bind(this))).call(r,HE.isFunction),this.patches.push(HE.add([],this.spec)),this.patches.push(HE.context([],this.context)),this.updatePatches(this.patches)}return RA(e,[{key:"debug",value:function(e){if(this.debugLevel===e){for(var t,r=arguments.length,n=new Array(r>1?r-1:0),o=1;o<r;o++)n[o-1]=arguments[o];(t=console).log.apply(t,n)}}},{key:"verbose",value:function(e){if("verbose"===this.debugLevel){for(var t,r,n=arguments.length,o=new Array(n>1?n-1:0),a=1;a<n;a++)o[a-1]=arguments[a];(t=console).log.apply(t,Tx(r=["[".concat(e,"]   ")]).call(r,o))}}},{key:"wrapPlugin",value:function(e,t){var r,n,o,a=this.pathDiscriminator,i=null;return e[this.pluginProp]?(i=e,r=e[this.pluginProp]):HE.isFunction(e)?r=e:HE.isObject(e)&&(n=e,o=function(e,t){return!Array.isArray(e)||e.every((function(e,r){return e===t[r]}))},r=Eb.mark((function e(t,r){var i,s,l,c,p,d;return Eb.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:d=function(e,t,l){var c,p,u,h,f,m,y,g,v,b,x,w,$;return Eb.wrap((function(i){for(;;)switch(i.prev=i.next){case 0:if(HE.isObject(e)){i.next=6;break}if(n.key!==t[t.length-1]){i.next=4;break}return i.next=4,n.plugin(e,n.key,t,r);case 4:i.next=30;break;case 6:c=t.length-1,p=t[c],u=t.indexOf("properties"),h="properties"===p&&c===u,f=r.allowMetaPatches&&s[e.$$ref],m=0,y=kx(e);case 12:if(!(m<y.length)){i.next=30;break}if(g=y[m],v=e[g],b=Tx(t).call(t,g),x=HE.isObject(v),w=e.$$ref,f){i.next=22;break}if(!x){i.next=22;break}return r.allowMetaPatches&&w&&(s[w]=!0),i.delegateYield(d(v,b,l),"t0",22);case 22:if(h||g!==n.key){i.next=27;break}if($=o(a,t),a&&!$){i.next=27;break}return i.next=27,n.plugin(v,g,b,r,l);case 27:m++,i.next=12;break;case 30:case"end":return i.stop()}}),i)},i=Eb.mark(d),s={},l=km(Ux(t).call(t,HE.isAdditiveMutation)),e.prev=4,l.s();case 6:if((c=l.n()).done){e.next=11;break}return p=c.value,e.delegateYield(d(p.value,p.path,p),"t0",9);case 9:e.next=6;break;case 11:e.next=16;break;case 13:e.prev=13,e.t1=e.catch(4),l.e(e.t1);case 16:return e.prev=16,l.f(),e.finish(16);case 19:case"end":return e.stop()}}),e,null,[[4,13,16,19]])}))),Fu(r.bind(i),{pluginName:e.name||t,isGenerator:HE.isGenerator(r)})}},{key:"nextPlugin",value:function(){var e,t=this;return zA(e=this.wrappedPlugins).call(e,(function(e){return t.getMutationsForPlugin(e).length>0}))}},{key:"nextPromisedPatch",value:function(){var e;if(this.promisedPatches.length>0)return MA.race($x(e=this.promisedPatches).call(e,(function(e){return e.value})))}},{key:"getPluginHistory",value:function(e){var t=this.constructor.getPluginName(e);return this.pluginHistory[t]||[]}},{key:"getPluginRunCount",value:function(e){return this.getPluginHistory(e).length}},{key:"getPluginHistoryTip",value:function(e){var t=this.getPluginHistory(e);return t&&t[t.length-1]||{}}},{key:"getPluginMutationIndex",value:function(e){var t=this.getPluginHistoryTip(e).mutationIndex;return"number"!=typeof t?-1:t}},{key:"updatePluginHistory",value:function(e,t){var r=this.constructor.getPluginName(e);this.pluginHistory[r]=this.pluginHistory[r]||[],this.pluginHistory[r].push(t)}},{key:"updatePatches",value:function(e){var t=this;HE.normalizeArray(e).forEach((function(e){if(e instanceof Error)t.errors.push(e);else try{if(!HE.isObject(e))return void t.debug("updatePatches","Got a non-object patch",e);if(t.showDebug&&t.allPatches.push(e),HE.isPromise(e.value))return t.promisedPatches.push(e),void t.promisedPatchThen(e);if(HE.isContextPatch(e))return void t.setContext(e.path,e.value);if(HE.isMutation(e))return void t.updateMutations(e)}catch(e){console.error(e),t.errors.push(e)}}))}},{key:"updateMutations",value:function(e){"object"===Em(e.value)&&!Array.isArray(e.value)&&this.allowMetaPatches&&(e.value=$u({},e.value));var t=HE.applyPatch(this.state,e,{allowMetaPatches:this.allowMetaPatches});t&&(this.mutations.push(e),this.state=t)}},{key:"removePromisedPatch",value:function(e){var t,r=this.promisedPatches.indexOf(e);r<0?this.debug("Tried to remove a promisedPatch that isn't there!"):iE(t=this.promisedPatches).call(t,r,1)}},{key:"promisedPatchThen",value:function(e){var t=this;return e.value=e.value.then((function(r){var n=$u($u({},e),{},{value:r});t.removePromisedPatch(e),t.updatePatches(n)})).catch((function(r){t.removePromisedPatch(e),t.updatePatches(r)})),e.value}},{key:"getMutations",value:function(e,t){var r;return e=e||0,"number"!=typeof t&&(t=this.mutations.length),cA(r=this.mutations).call(r,e,t)}},{key:"getCurrentMutations",value:function(){return this.getMutationsForPlugin(this.getCurrentPlugin())}},{key:"getMutationsForPlugin",value:function(e){var t=this.getPluginMutationIndex(e);return this.getMutations(t+1)}},{key:"getCurrentPlugin",value:function(){return this.currentPlugin}},{key:"getLib",value:function(){return this.libMethods}},{key:"_get",value:function(e){return HE.getIn(this.state,e)}},{key:"_getContext",value:function(e){return this.contextTree.get(e)}},{key:"setContext",value:function(e,t){return this.contextTree.set(e,t)}},{key:"_hasRun",value:function(e){return this.getPluginRunCount(this.getCurrentPlugin())>(e||0)}},{key:"dispatch",value:function(){var e,t=this,r=this,n=this.nextPlugin();if(!n){var o=this.nextPromisedPatch();if(o)return o.then((function(){return t.dispatch()})).catch((function(){return t.dispatch()}));var a={spec:this.state,errors:this.errors};return this.showDebug&&(a.patches=this.allPatches),MA.resolve(a)}if(r.pluginCount=r.pluginCount||{},r.pluginCount[n]=(r.pluginCount[n]||0)+1,r.pluginCount[n]>100)return MA.resolve({spec:r.state,errors:Tx(e=r.errors).call(e,new Error("We've reached a hard limit of ".concat(100," plugin runs")))});if(n!==this.currentPlugin&&this.promisedPatches.length){var i,s=$x(i=this.promisedPatches).call(i,(function(e){return e.value}));return MA.all($x(s).call(s,(function(e){return e.then(I_,I_)}))).then((function(){return t.dispatch()}))}return function(){r.currentPlugin=n;var e=r.getCurrentMutations(),t=r.mutations.length-1;try{if(n.isGenerator){var o,a=km(n(e,r.getLib()));try{for(a.s();!(o=a.n()).done;)l(o.value)}catch(e){a.e(e)}finally{a.f()}}else l(n(e,r.getLib()))}catch(e){console.error(e),l([Fu(Object.create(e),{plugin:n})])}finally{r.updatePluginHistory(n,{mutationIndex:t})}return r.dispatch()}();function l(e){e&&(e=HE.fullyNormalizeArray(e),r.updatePatches(e,n))}}}],[{key:"getPluginName",value:function(e){return e.pluginName}},{key:"getPatchesOfType",value:function(e,t){return Ux(e).call(e,t)}}]),e}(),R_={refs:m_,allOf:E_,parameters:O_,properties:T_},L_=function(e){return String.prototype.toLowerCase.call(e)},N_=function(e){return e.replace(/[^\w]/gi,"_")};function D_(e){var t=e.openapi;return!!t&&ih(t).call(t,"3")}function F_(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},o=n.v2OperationIdCompatibilityMode;if(!e||"object"!==Em(e))return null;var a=(e.operationId||"").replace(/\s/g,"");return a.length?N_(e.operationId):U_(t,r,{v2OperationIdCompatibilityMode:o})}function U_(e,t){var r,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o=n.v2OperationIdCompatibilityMode;if(o){var a,i,s=Tx(a="".concat(t.toLowerCase(),"_")).call(a,e).replace(/[\s!@#$%^&*()_+=[{\]};:<>|./?,\\'""-]/g,"_");return(s=s||Tx(i="".concat(e.substring(1),"_")).call(i,t)).replace(/((_){2,})/g,"_").replace(/^(_)*/g,"").replace(/([_])*$/g,"")}return Tx(r="".concat(L_(t))).call(r,N_(e))}function B_(e,t){var r;return Tx(r="".concat(L_(t),"-")).call(r,e)}function q_(e,t){return e&&e.paths?z_(e,(function(e){var r=e.pathName,n=e.method,o=e.operation;if(!o||"object"!==Em(o))return!1;var a=o.operationId;return[F_(o,r,n),B_(r,n),a].some((function(e){return e&&e===t}))}),!0)||null:null}function z_(e,t,r){if(!e||"object"!==Em(e)||!e.paths||"object"!==Em(e.paths))return null;var n=e.paths;for(var o in n)for(var a in n[o])if("PARAMETERS"!==a.toUpperCase()){var i=n[o][a];if(i&&"object"===Em(i)){var s={spec:e,pathName:o,method:a.toUpperCase(),operation:i},l=t(s);if(r&&l)return s}}}function M_(e){var t=e.spec,r=t.paths,n={};if(!r||t.$$normalized)return e;for(var o in r){var a,i=r[o];if(null!=i&&qb(a=["object","function"]).call(a,Em(i))){var s=i.parameters,l=function(e){var r,a=i[e];if(null==a||!qb(r=["object","function"]).call(r,Em(a)))return"continue";var l=F_(a,o,e);if(l){n[l]?n[l].push(a):n[l]=[a];var c=n[l];if(c.length>1)c.forEach((function(e,t){var r;e.p=e.p||e.operationId,e.operationId=Tx(r="".concat(l)).call(r,t+1)}));else if(void 0!==a.operationId){var p=c[0];p.p=p.p||a.operationId,p.operationId=l}}if("parameters"!==e){var d=[],u={};for(var h in t)"produces"!==h&&"consumes"!==h&&"security"!==h||(u[h]=t[h],d.push(u));if(s&&(u.parameters=s,d.push(u)),d.length){var f,m=km(d);try{for(m.s();!(f=m.n()).done;){var y=f.value;for(var g in y)if(a[g]){if("parameters"===g){var v,b=km(y[g]);try{var x=function(){var e=v.value;a[g].some((function(t){return t.name&&t.name===e.name||t.$ref&&t.$ref===e.$ref||t.$$ref&&t.$$ref===e.$$ref||t===e}))||a[g].push(e)};for(b.s();!(v=b.n()).done;)x()}catch(e){b.e(e)}finally{b.f()}}}else a[g]=y[g]}}catch(e){m.e(e)}finally{m.f()}}}};for(var c in i)l(c)}}return t.$$normalized=!0,e}function H_(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=t.requestInterceptor,n=t.responseInterceptor,o=e.withCredentials?"include":"same-origin";return function(t){return e({url:t,loadSpec:!0,requestInterceptor:r,responseInterceptor:n,headers:{Accept:"application/json, application/yaml"},credentials:o}).then((function(e){return e.body}))}}function W_(e){var t=e.fetch,r=e.spec,n=e.url,o=e.mode,a=e.allowMetaPatches,i=void 0===a||a,s=e.pathDiscriminator,l=e.modelPropertyMacro,c=e.parameterMacro,p=e.requestInterceptor,d=e.responseInterceptor,u=e.skipNormalization,h=e.useCircularStructures,f=e.http,m=e.baseDoc;return m=m||n,f=t||f||yA,r?y(r):H_(f,{requestInterceptor:p,responseInterceptor:d})(m).then(y);function y(e){m&&(R_.refs.docCache[m]=e),R_.refs.fetchJSON=H_(f,{requestInterceptor:p,responseInterceptor:d});var t,r,n=[R_.refs];return"function"==typeof c&&n.push(R_.parameters),"function"==typeof l&&n.push(R_.properties),"strict"!==o&&n.push(R_.allOf),(t={spec:e,context:{baseDoc:m},plugins:n,allowMetaPatches:i,pathDiscriminator:s,parameterMacro:c,modelPropertyMacro:l,useCircularStructures:h},new P_(t).dispatch()).then(u?(r=Sb(Eb.mark((function e(t){return Eb.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",t);case 1:case"end":return e.stop()}}),e)}))),function(e){return r.apply(this,arguments)}):M_)}}var V_=Array.isArray,G_="object"==typeof global&&global&&global.Object===Object&&global,K_="object"==typeof self&&self&&self.Object===Object&&self,J_=G_||K_||Function("return this")(),Y_=J_.Symbol,Z_=Y_,Q_=Object.prototype,X_=Q_.hasOwnProperty,ej=Q_.toString,tj=Z_?Z_.toStringTag:void 0,rj=Object.prototype.toString,nj=function(e){var t=X_.call(e,tj),r=e[tj];try{e[tj]=void 0;var n=!0}catch(e){}var o=ej.call(e);return n&&(t?e[tj]=r:delete e[tj]),o},oj=Y_?Y_.toStringTag:void 0,aj=function(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":oj&&oj in Object(e)?nj(e):function(e){return rj.call(e)}(e)},ij=aj,sj=function(e){return"symbol"==typeof e||function(e){return null!=e&&"object"==typeof e}(e)&&"[object Symbol]"==ij(e)},lj=V_,cj=sj,pj=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,dj=/^\w*$/,uj=function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)},hj=aj,fj=uj,mj=J_.i,yj=function(){var e=/[^.]+$/.exec(mj&&mj.keys&&mj.keys.IE_PROTO||"");return e?"Symbol(src)_1."+e:""}(),gj=Function.prototype.toString,vj=function(e){if(!fj(e))return!1;var t=hj(e);return"[object Function]"==t||"[object GeneratorFunction]"==t||"[object AsyncFunction]"==t||"[object Proxy]"==t},bj=function(e){return!!yj&&yj in e},xj=uj,wj=/^\[object .+?Constructor\]$/,$j=Function.prototype,kj=Object.prototype,Sj=$j.toString,Aj=kj.hasOwnProperty,Ej=RegExp("^"+Sj.call(Aj).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),Oj=function(e){return!(!xj(e)||bj(e))&&(vj(e)?Ej:wj).test(function(e){if(null!=e){try{return gj.call(e)}catch(e){}try{return e+""}catch(e){}}return""}(e))},Tj=function(e,t){var r=function(e,t){return null==e?void 0:e[t]}(e,t);return Oj(r)?r:void 0},Cj=Tj(Object,"create"),_j=Cj,jj=Cj,Ij=Object.prototype.hasOwnProperty,Pj=Cj,Rj=Object.prototype.hasOwnProperty,Lj=Cj,Nj=function(){this.v=_j?_j(null):{},this.size=0},Dj=function(e){var t=this.has(e)&&delete this.v[e];return this.size-=t?1:0,t},Fj=function(e){var t=this.v;if(jj){var r=t[e];return"__lodash_hash_undefined__"===r?void 0:r}return Ij.call(t,e)?t[e]:void 0},Uj=function(e){var t=this.v;return Pj?void 0!==t[e]:Rj.call(t,e)},Bj=function(e,t){var r=this.v;return this.size+=this.has(e)?0:1,r[e]=Lj&&void 0===t?"__lodash_hash_undefined__":t,this};function qj(e){var t=-1,r=null==e?0:e.length;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}qj.prototype.clear=Nj,qj.prototype.delete=Dj,qj.prototype.get=Fj,qj.prototype.has=Uj,qj.prototype.set=Bj;var zj=qj,Mj=function(e,t){return e===t||e!=e&&t!=t},Hj=function(e,t){for(var r=e.length;r--;)if(Mj(e[r][0],t))return r;return-1},Wj=Hj,Vj=Array.prototype.splice,Gj=Hj,Kj=Hj,Jj=Hj,Yj=function(){this.v=[],this.size=0},Zj=function(e){var t=this.v,r=Wj(t,e);return!(r<0||(r==t.length-1?t.pop():Vj.call(t,r,1),--this.size,0))},Qj=function(e){var t=this.v,r=Gj(t,e);return r<0?void 0:t[r][1]},Xj=function(e,t){var r=this.v,n=Jj(r,e);return n<0?(++this.size,r.push([e,t])):r[n][1]=t,this};function eI(e){var t=-1,r=null==e?0:e.length;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}eI.prototype.clear=Yj,eI.prototype.delete=Zj,eI.prototype.get=Qj,eI.prototype.has=function(e){return Kj(this.v,e)>-1},eI.prototype.set=Xj;var tI=eI,rI=Tj(J_,"Map"),nI=zj,oI=tI,aI=rI,iI=function(e){var t=typeof e;return"string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==e:null===e},sI=function(e,t){var r=e.v;return iI(t)?r["string"==typeof t?"string":"hash"]:r.map},lI=sI,cI=sI,pI=sI,dI=sI,uI=function(e,t){var r=dI(this,e),n=r.size;return r.set(e,t),this.size+=r.size==n?0:1,this};function hI(e){var t=-1,r=null==e?0:e.length;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}hI.prototype.clear=function(){this.size=0,this.v={hash:new nI,map:new(aI||oI),string:new nI}},hI.prototype.delete=function(e){var t=lI(this,e).delete(e);return this.size-=t?1:0,t},hI.prototype.get=function(e){return cI(this,e).get(e)},hI.prototype.has=function(e){return pI(this,e).has(e)},hI.prototype.set=uI;var fI=hI;function mI(e,t){if("function"!=typeof e||null!=t&&"function"!=typeof t)throw new TypeError("Expected a function");var r=function(){var n=arguments,o=t?t.apply(this,n):n[0],a=r.cache;if(a.has(o))return a.get(o);var i=e.apply(this,n);return r.cache=a.set(o,i)||a,i};return r.cache=new(mI.Cache||fI),r}mI.Cache=fI;var yI=mI,gI=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,vI=/\\(\\)?/g,bI=function(e){var t=yI((function(e){var t=[];return 46===e.charCodeAt(0)&&t.push(""),e.replace(gI,(function(e,r,n,o){t.push(n?o.replace(vI,"$1"):r||e)})),t}),(function(e){return 500===r.size&&r.clear(),e})),r=t.cache;return t}(),xI=bI,wI=function(e,t){for(var r=-1,n=null==e?0:e.length,o=Array(n);++r<n;)o[r]=t(e[r],r,e);return o},$I=V_,kI=sj,SI=Y_?Y_.prototype:void 0,AI=SI?SI.toString:void 0,EI=function e(t){if("string"==typeof t)return t;if($I(t))return wI(t,e)+"";if(kI(t))return AI?AI.call(t):"";var r=t+"";return"0"==r&&1/t==-1/0?"-0":r},OI=V_,TI=function(e,t){if(lj(e))return!1;var r=typeof e;return!("number"!=r&&"symbol"!=r&&"boolean"!=r&&null!=e&&!cj(e))||dj.test(e)||!pj.test(e)||null!=t&&e in Object(t)},CI=xI,_I=sj,jI=function(e,t){return OI(e)?e:TI(e,t)?[e]:CI(function(e){return null==e?"":EI(e)}(e))},II=function(e){if("string"==typeof e||_I(e))return e;var t=e+"";return"0"==t&&1/e==-1/0?"-0":t},PI=function(e,t){for(var r=0,n=(t=jI(t,e)).length;null!=e&&r<n;)e=e[II(t[r++])];return r&&r==n?e:void 0},RI=function(e,t,r){var n=null==e?void 0:PI(e,t);return void 0===n?r:n};function LI(){return LI=Sb(Eb.mark((function e(t,r){var n,o,a,i,s,l,c,p,d,u,h,f,m=arguments;return Eb.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=m.length>2&&void 0!==m[2]?m[2]:{},o=n.returnEntireTree,a=n.baseDoc,i=n.requestInterceptor,s=n.responseInterceptor,l=n.parameterMacro,c=n.modelPropertyMacro,p=n.useCircularStructures,d={pathDiscriminator:r,baseDoc:a,requestInterceptor:i,responseInterceptor:s,parameterMacro:l,modelPropertyMacro:c,useCircularStructures:p},u=M_({spec:t}),h=u.spec,e.next=6,W_($u($u({},d),{},{spec:h,allowMetaPatches:!0,skipNormalization:!0}));case 6:return f=e.sent,!o&&Array.isArray(r)&&r.length&&(f.spec=RI(f.spec,r)||null),e.abrupt("return",f);case 9:case"end":return e.stop()}}),e)}))),LI.apply(this,arguments)}var NI=function(){return null},DI=function(e){var t=e.spec,r=e.cb,n=void 0===r?NI:r,o=e.defaultTag,a=void 0===o?"default":o,i=e.v2OperationIdCompatibilityMode,s={},l={};return z_(t,(function(e){var r,o=e.pathName,c=e.method,p=e.operation;(p.tags?(r=p.tags,Array.isArray(r)?r:[r]):[a]).forEach((function(e){if("string"==typeof e){l[e]=l[e]||{};var r,a=l[e],d=F_(p,o,c,{v2OperationIdCompatibilityMode:i}),u=n({spec:t,pathName:o,method:c,operation:p,operationId:d});if(s[d])s[d]+=1,a[Tx(r="".concat(d)).call(r,s[d])]=u;else if(void 0!==a[d]){var h,f,m=s[d]||1;s[d]=m+1,a[Tx(h="".concat(d)).call(h,s[d])]=u;var y=a[d];delete a[d],a[Tx(f="".concat(d)).call(f,m)]=y}else a[d]=u}}))})),l},FI=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return function(t){var r=t.pathName,n=t.method,o=t.operationId;return function(t){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=e.requestInterceptor,s=e.responseInterceptor,l=e.userFetch;return e.execute($u({spec:e.spec,requestInterceptor:i,responseInterceptor:s,userFetch:l,pathName:r,method:n,parameters:t,operationId:o},a))}}},UI=ka,BI=Ba.indexOf,qI=Ld,zI=wr([].indexOf),MI=!!zI&&1/zI([1],1,-0)<0,HI=qI("indexOf");UI({target:"Array",proto:!0,forced:MI||!HI},{indexOf:function(e){var t=arguments.length>1?arguments[1]:void 0;return MI?zI(this,e,t)||0:BI(this,e,t)}});var WI=tp("Array").indexOf,VI=on,GI=WI,KI=Array.prototype;const JI=ir({exports:{}}.exports=function(e){var t=e.indexOf;return e===KI||VI(KI,e)&&t===KI.indexOf?GI:t});var YI=function(e,t,r){var n=r||{},o=n.encode||XI;if("function"!=typeof o)throw new TypeError("option encode is invalid");if(!QI.test(e))throw new TypeError("argument name is invalid");var a=o(t);if(a&&!QI.test(a))throw new TypeError("argument val is invalid");var i,s=e+"="+a;if(null!=n.maxAge){var l=n.maxAge-0;if(isNaN(l)||!isFinite(l))throw new TypeError("option maxAge is invalid");s+="; Max-Age="+Math.floor(l)}if(n.domain){if(!QI.test(n.domain))throw new TypeError("option domain is invalid");s+="; Domain="+n.domain}if(n.path){if(!QI.test(n.path))throw new TypeError("option path is invalid");s+="; Path="+n.path}if(n.expires){var c=n.expires;if(i=c,!("[object Date]"===ZI.call(i)||i instanceof Date)||isNaN(c.valueOf()))throw new TypeError("option expires is invalid");s+="; Expires="+c.toUTCString()}if(n.httpOnly&&(s+="; HttpOnly"),n.secure&&(s+="; Secure"),n.priority)switch("string"==typeof n.priority?n.priority.toLowerCase():n.priority){case"low":s+="; Priority=Low";break;case"medium":s+="; Priority=Medium";break;case"high":s+="; Priority=High";break;default:throw new TypeError("option priority is invalid")}if(n.sameSite)switch("string"==typeof n.sameSite?n.sameSite.toLowerCase():n.sameSite){case!0:s+="; SameSite=Strict";break;case"lax":s+="; SameSite=Lax";break;case"strict":s+="; SameSite=Strict";break;case"none":s+="; SameSite=None";break;default:throw new TypeError("option sameSite is invalid")}return s},ZI=Object.prototype.toString,QI=/^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;function XI(e){return encodeURIComponent(e)}function eP(e){return"[object Object]"===Object.prototype.toString.call(e)}function tP(e){var t,r;return!1!==eP(e)&&(void 0===(t=e.constructor)||!1!==eP(r=t.prototype)&&!1!==r.hasOwnProperty("isPrototypeOf"))}const rP={body:function(e){var t=e.req,r=e.value;t.body=r},header:function(e){var t=e.req,r=e.parameter,n=e.value;t.headers=t.headers||{},void 0!==n&&(t.headers[r.name]=n)},query:function(e){var t=e.req,r=e.value,n=e.parameter;if(t.query=t.query||{},!1===r&&"boolean"===n.type&&(r="false"),0===r&&["number","integer"].indexOf(n.type)>-1&&(r="0"),r)t.query[n.name]={collectionFormat:n.collectionFormat,value:r};else if(n.allowEmptyValue&&void 0!==r){var o=n.name;t.query[o]=t.query[o]||{},t.query[o].allowEmptyValue=!0}},path:function(e){var t=e.req,r=e.value,n=e.parameter;t.url=t.url.split("{".concat(n.name,"}")).join(encodeURIComponent(r))},formData:function(e){var t=e.req,r=e.value,n=e.parameter;(r||n.allowEmptyValue)&&(t.form=t.form||{},t.form[n.name]={value:r,allowEmptyValue:n.allowEmptyValue,collectionFormat:n.collectionFormat})}};function nP(e,t){return qb(t).call(t,"application/json")?"string"==typeof e?e:yx(e):e.toString()}var oP=["accept","authorization","content-type"];const aP=Object.freeze(Object.defineProperty({__proto__:null,path:function(e){var t=e.req,r=e.value,n=e.parameter,o=n.name,a=n.style,i=n.explode,s=n.content;if(s){var l=kx(s)[0];t.url=t.url.split("{".concat(o,"}")).join(uA(nP(r,l),{escape:!0}))}else{var c=hA({key:n.name,value:r,style:a||"simple",explode:i||!1,escape:!0});t.url=t.url.split("{".concat(o,"}")).join(c)}},query:function(e){var t=e.req,r=e.value,n=e.parameter;if(t.query=t.query||{},n.content){var o=kx(n.content)[0];t.query[n.name]=nP(r,o)}else if(!1===r&&(r="false"),0===r&&(r="0"),r){var a=n.style,i=n.explode,s=n.allowReserved;t.query[n.name]={value:r,serializationOption:{style:a,explode:i,allowReserved:s}}}else if(n.allowEmptyValue&&void 0!==r){var l=n.name;t.query[l]=t.query[l]||{},t.query[l].allowEmptyValue=!0}},header:function(e){var t=e.req,r=e.parameter,n=e.value;if(t.headers=t.headers||{},!(oP.indexOf(r.name.toLowerCase())>-1))if(r.content){var o=kx(r.content)[0];t.headers[r.name]=nP(n,o)}else void 0!==n&&(t.headers[r.name]=hA({key:r.name,value:n,style:r.style||"simple",explode:void 0!==r.explode&&r.explode,escape:!1}))},cookie:function(e){var t=e.req,r=e.parameter,n=e.value;t.headers=t.headers||{};var o=Em(n);if(r.content){var a,i=kx(r.content)[0];t.headers.Cookie=Tx(a="".concat(r.name,"=")).call(a,nP(n,i))}else if("undefined"!==o){var s="object"===o&&!Array.isArray(n)&&r.explode?"":"".concat(r.name,"=");t.headers.Cookie=s+hA({key:r.name,value:n,escape:!1,style:r.style||"form",explode:void 0!==r.explode&&r.explode})}}},Symbol.toStringTag,{value:"Module"}));ka({global:!0},{globalThis:lr});const iP=ir({exports:{}}.exports={exports:{}}.exports=lr);var sP=(void 0!==iP?iP:"undefined"!=typeof self?self:window).btoa;var lP=["http","fetch","spec","operationId","pathName","method","parameters","securities"],cP=function(e){return Array.isArray(e)?e:[]},pP=VC("OperationNotFoundError",(function(e,t,r){this.originalError=r,Fu(this,t||{})})),dP={buildRequest:uP};function uP(e){var t,r,n=e.spec,o=e.operationId,a=e.responseContentType,i=e.scheme,s=e.requestInterceptor,l=e.responseInterceptor,c=e.contextUrl,p=e.userFetch,d=e.server,u=e.serverVariables,h=e.http,f=e.signal,m=e.parameters,y=e.parameterBuilders,g=D_(n);y||(y=g?aP:rP);var v={url:"",credentials:h&&h.withCredentials?"include":"same-origin",headers:{},cookies:{}};f&&(v.signal=f),s&&(v.requestInterceptor=s),l&&(v.responseInterceptor=l),p&&(v.userFetch=p);var b=q_(n,o);if(!b)throw new pP("Operation ".concat(o," not found"));var x=b.operation,w=void 0===x?{}:x,$=b.method,k=b.pathName;if(v.url+=fP({spec:n,scheme:i,contextUrl:c,server:d,serverVariables:u,pathName:k,method:$}),!o)return delete v.cookies,v;v.url+=k,v.method="".concat($).toUpperCase(),m=m||{};var S=n.paths[k]||{};a&&(v.headers.accept=a);var A=function(e){var t={};e.forEach((function(e){t[e.in]||(t[e.in]={}),t[e.in][e.name]=e}));var r=[];return kx(t).forEach((function(e){kx(t[e]).forEach((function(n){r.push(t[e][n])}))})),r}(Tx(t=Tx(r=[]).call(r,cP(w.parameters))).call(t,cP(S.parameters)));A.forEach((function(e){var t,r,o,a,i=y[e.in];if("body"===e.in&&e.schema&&e.schema.properties&&(t=m),void 0===(t=e&&e.name&&m[e.name]))t=e&&e.name&&m[Tx(r="".concat(e.in,".")).call(r,e.name)];else if((o=e.name,a=A,Ux(a).call(a,(function(e){return e.name===o}))).length>1){var s;console.warn(Tx(s="Parameter '".concat(e.name,"' is ambiguous because the defined spec has more than one parameter with the name: '")).call(s,e.name,"' and the passed-in parameter values did not define an 'in' value."))}if(null!==t){if(void 0!==e.default&&void 0===t&&(t=e.default),void 0===t&&e.required&&!e.allowEmptyValue)throw new Error("Required parameter ".concat(e.name," is not provided"));if(g&&e.schema&&"object"===e.schema.type&&"string"==typeof t)try{t=JSON.parse(t)}catch(o){throw new Error("Could not parse object parameter value string as JSON")}i&&i({req:v,parameter:e,value:t,operation:w,spec:n})}}));var E=$u($u({},e),{},{operation:w});if((v=g?function(e,t){var r,n,o,a,i,s,l,c,p,d,u,h,f,m=e.operation,y=e.requestBody,g=e.securities,v=e.spec,b=e.attachContentTypeForEmptyPayload,x=e.requestContentType;a=void 0===(o=(r={request:t,securities:g,operation:m,spec:v}).securities)?{}:o,s=void 0===(i=r.operation)?{}:i,l=r.spec,c=$u({},n=r.request),p=a.authorized,d=void 0===p?{}:p,u=s.security||l.security||[],h=d&&!!kx(d).length,f=RI(l,["components","securitySchemes"])||{},c.headers=c.headers||{},c.query=c.query||{},t=kx(a).length&&h&&u&&(!Array.isArray(s.security)||s.security.length)?(u.forEach((function(e){kx(e).forEach((function(e){var t=d[e],r=f[e];if(t){var n=t.value||t,o=r.type;if(t)if("apiKey"===o)"query"===r.in&&(c.query[r.name]=n),"header"===r.in&&(c.headers[r.name]=n),"cookie"===r.in&&(c.cookies[r.name]=n);else if("http"===o){if(/^basic$/i.test(r.scheme)){var a,i=n.username||"",s=n.password||"",l=sP(Tx(a="".concat(i,":")).call(a,s));c.headers.Authorization="Basic ".concat(l)}/^bearer$/i.test(r.scheme)&&(c.headers.Authorization="Bearer ".concat(n))}else if("oauth2"===o||"openIdConnect"===o){var p,u=t.token||{},h=u[r["x-tokenName"]||"access_token"],m=u.token_type;m&&"bearer"!==m.toLowerCase()||(m="Bearer"),c.headers.Authorization=Tx(p="".concat(m," ")).call(p,h)}}}))})),c):n;var w=m.requestBody||{},$=kx(w.content||{}),k=x&&$.indexOf(x)>-1;if(y||b){if(x&&k)t.headers["Content-Type"]=x;else if(!x){var S=$[0];S&&(t.headers["Content-Type"]=S,x=S)}}else x&&k&&(t.headers["Content-Type"]=x);if(!e.responseContentType&&m.responses){var A,E=Ux(A=Fx(m.responses)).call(A,(function(e){var t=Om(e,2),r=t[0],n=t[1],o=parseInt(r,10);return o>=200&&o<300&&tP(n.content)})).reduce((function(e,t){var r=Om(t,2)[1];return Tx(e).call(e,kx(r.content))}),[]);E.length>0&&(t.headers.accept=E.join(", "))}if(y)if(x){if($.indexOf(x)>-1)if("application/x-www-form-urlencoded"===x||"multipart/form-data"===x)if("object"===Em(y)){var O=(w.content[x]||{}).encoding||{};t.form={},kx(y).forEach((function(e){t.form[e]={value:y[e],encoding:O[e]||{}}}))}else t.form=y;else t.body=y}else t.body=y;return t}(E,v):function(e,t){var r,n,o,a,i,s,l,c,p,d,u,h,f,m,y,g,v,b=e.spec,x=e.operation,w=e.securities,$=e.requestContentType,k=e.responseContentType,S=e.attachContentTypeForEmptyPayload;if(s=void 0===(i=(o={request:t,securities:w,operation:x,spec:b}).securities)?{}:i,c=void 0===(l=o.operation)?{}:l,p=o.spec,d=$u({},a=o.request),u=s.authorized,h=void 0===u?{}:u,f=s.specSecurity,m=void 0===f?[]:f,y=c.security||m,g=h&&!!kx(h).length,v=p.securityDefinitions,d.headers=d.headers||{},d.query=d.query||{},(t=kx(s).length&&g&&y&&(!Array.isArray(c.security)||c.security.length)?(y.forEach((function(e){kx(e).forEach((function(e){var t=h[e];if(t){var r=t.token,n=t.value||t,o=v[e],a=o.type,i=o["x-tokenName"]||"access_token",s=r&&r[i],l=r&&r.token_type;if(t)if("apiKey"===a){var c="query"===o.in?"query":"headers";d[c]=d[c]||{},d[c][o.name]=n}else if("basic"===a)if(n.header)d.headers.authorization=n.header;else{var p,u=n.username||"",f=n.password||"";n.base64=sP(Tx(p="".concat(u,":")).call(p,f)),d.headers.authorization="Basic ".concat(n.base64)}else if("oauth2"===a&&s){var m;l=l&&"bearer"!==l.toLowerCase()?l:"Bearer",d.headers.authorization=Tx(m="".concat(l," ")).call(m,s)}}}))})),d):a).body||t.form||S)if($)t.headers["Content-Type"]=$;else if(Array.isArray(x.consumes)){var A=Om(x.consumes,1);t.headers["Content-Type"]=A[0]}else if(Array.isArray(b.consumes)){var E=Om(b.consumes,1);t.headers["Content-Type"]=E[0]}else x.parameters&&Ux(r=x.parameters).call(r,(function(e){return"file"===e.type})).length?t.headers["Content-Type"]="multipart/form-data":x.parameters&&Ux(n=x.parameters).call(n,(function(e){return"formData"===e.in})).length&&(t.headers["Content-Type"]="application/x-www-form-urlencoded");else if($){var O,T,C=x.parameters&&Ux(O=x.parameters).call(O,(function(e){return"body"===e.in})).length>0,_=x.parameters&&Ux(T=x.parameters).call(T,(function(e){return"formData"===e.in})).length>0;(C||_)&&(t.headers["Content-Type"]=$)}return!k&&Array.isArray(x.produces)&&x.produces.length>0&&(t.headers.accept=x.produces.join(", ")),t}(E,v)).cookies&&kx(v.cookies).length){var O=kx(v.cookies).reduce((function(e,t){var r=v.cookies[t];return e+(e?"&":"")+YI(t,r)}),"");v.headers.Cookie=O}return v.cookies&&delete v.cookies,jA(v),v}var hP=function(e){return e?e.replace(/\W/g,""):null};function fP(e){return D_(e.spec)?function(e){var t=e.spec,r=e.pathName,n=e.method,o=e.server,a=e.contextUrl,i=e.serverVariables,s=void 0===i?{}:i,l=RI(t,["paths",r,(n||"").toLowerCase(),"servers"])||RI(t,["paths",r,"servers"])||RI(t,["servers"]),c="",p=null;if(o&&l&&l.length){var d=$x(l).call(l,(function(e){return e.url}));d.indexOf(o)>-1&&(c=o,p=l[d.indexOf(o)])}if(!c&&l&&l.length){c=l[0].url;var u=Om(l,1);p=u[0]}c.indexOf("{")>-1&&function(e){for(var t,r=[],n=/{([^}]+)}/g;t=n.exec(e);)r.push(t[1]);return r}(c).forEach((function(e){if(p.variables&&p.variables[e]){var t=p.variables[e],r=s[e]||t.default,n=new RegExp("{".concat(e,"}"),"g");c=c.replace(n,r)}}));return function(){var e,t,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",o=r&&n?sh.parse(sh.resolve(n,r)):sh.parse(r),a=sh.parse(n),i=hP(o.protocol)||hP(a.protocol)||"",s=o.host||a.host,l=o.pathname||"";return"/"===(e=i&&s?Tx(t="".concat(i,"://")).call(t,s+l):l)[e.length-1]?cA(e).call(e,0,-1):e}(c,a)}(e):function(e){var t,r,n=e.spec,o=e.scheme,a=e.contextUrl,i=void 0===a?"":a,s=sh.parse(i),l=Array.isArray(n.schemes)?n.schemes[0]:null,c=o||l||hP(s.protocol)||"http",p=n.host||s.host||"",d=n.basePath||"";return"/"===(t=c&&p?Tx(r="".concat(c,"://")).call(r,p+d):d)[t.length-1]?cA(t).call(t,0,-1):t}(e)}function mP(e){var t=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if("string"==typeof e?r.url=e:r=e,!(this instanceof mP))return new mP(r);Fu(this,r);var n=this.resolve().then((function(){return t.disableInterfaces||Fu(t,mP.makeApisTagOperation(t)),t}));return n.client=this,n}function yP(e){const t=(e=e.replace("[]","Array")).split("/");return t[0]=t[0].replace(/[^A-Za-z0-9_\-\.]+|\s+/gm,"_"),t.join("/")}mP.http=yA,mP.makeHttp=function(e,t,r){return r=r||function(e){return e},t=t||function(e){return e},function(n){return"string"==typeof n&&(n={url:n}),mA.mergeInQueryOrForm(n),n=t(n),r(e(n))}}.bind(null,mP.http),mP.resolve=W_,mP.resolveSubtree=function(e,t){return LI.apply(this,arguments)},mP.execute=function(e){var t=e.http,r=e.fetch,n=e.spec,o=e.operationId,a=e.pathName,i=e.method,s=e.parameters,l=e.securities,c=function(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=ti(e);for(n=0;n<a.length;n++)r=a[n],JI(t).call(t,r)>=0||(o[r]=e[r]);return o}(e,t);if(Kc){var a=Kc(e);for(n=0;n<a.length;n++)r=a[n],JI(t).call(t,r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}(e,lP),p=t||r||yA;a&&i&&!o&&(o=B_(a,i));var d=dP.buildRequest($u({spec:n,operationId:o,parameters:s,securities:l,http:p},c));return d.body&&(tP(d.body)||Array.isArray(d.body))&&(d.body=yx(d.body)),p(d)},mP.serializeRes=xA,mP.serializeHeaders=$A,mP.clearCache=function(){R_.refs.clearCache()},mP.makeApisTagOperation=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=FI(e);return{apis:DI({v2OperationIdCompatibilityMode:e.v2OperationIdCompatibilityMode,spec:e.spec,cb:t})}},mP.buildRequest=uP,mP.helpers={opId:F_},mP.getBaseUrl=fP,mP.prototype={http:yA,execute:function(e){return this.applyDefaults(),mP.execute($u({spec:this.spec,http:this.http,securities:{authorized:this.authorizations},contextUrl:"string"==typeof this.url?this.url:void 0,requestInterceptor:this.requestInterceptor||null,responseInterceptor:this.responseInterceptor||null},e))},resolve:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return mP.resolve($u({spec:this.spec,url:this.url,http:this.http||this.fetch,allowMetaPatches:this.allowMetaPatches,useCircularStructures:this.useCircularStructures,requestInterceptor:this.requestInterceptor||null,responseInterceptor:this.responseInterceptor||null,skipNormalization:this.skipNormalization||!1},t)).then((function(t){return e.originalSpec=e.spec,e.spec=t.spec,e.errors=t.errors,e}))}},mP.prototype.applyDefaults=function(){var e=this.spec,t=this.url;if(t&&ih(t).call(t,"http")){var r=sh.parse(t);e.host||(e.host=r.host),e.schemes||(e.schemes=[r.protocol.replace(":","")]),e.basePath||(e.basePath="/")}},mP.helpers;const gP={parameterTypeProperties:["format","minimum","maximum","exclusiveMinimum","exclusiveMaximum","minLength","maxLength","multipleOf","minItems","maxItems","uniqueItems","minProperties","maxProperties","additionalProperties","pattern","enum","default"],arrayProperties:["items","minItems","maxItems","uniqueItems"],httpMethods:["get","post","put","delete","patch","head","options","trace"],uniqueOnly:function(e,t,r){return r.indexOf(e)===t},createHash:function(e){let t,r=0;if(0===e.length)return r;for(let n=0;n<e.length;n++)t=e.charCodeAt(n),r=(r<<5)-r+t,r|=0;return r},sanitise:yP,sanitiseAll:function(e){return yP(e.split("/").join("_"))},camelize:function(e){return e.toLowerCase().replace(/[-_ \/\.](.)/g,((e,t)=>t.toUpperCase()))},clone:function(e){return JSON.parse(JSON.stringify(e))},circularClone:function e(t,r=null){if(r||(r=new WeakMap),Object(t)!==t||t instanceof Function)return t;if(r.has(t))return r.get(t);let n;try{n=new t.constructor}catch(e){n=Object.create(Object.getPrototypeOf(t))}return r.set(t,n),Object.assign(n,...Object.keys(t).map((n=>({[n]:e(t[n],r)}))))}};function vP(){return{depth:0,seen:new WeakMap,top:!0,combine:!1,allowRefSiblings:!1}}const bP=function e(t,r,n,o){if(void 0===n.depth&&(n=vP()),null==t)return t;if(n.combine&&(t.allOf&&Array.isArray(t.allOf)&&1===t.allOf.length&&delete(t={...t.allOf[0],...t})?.allOf,t?.anyOf&&Array.isArray(t.anyOf)&&1===t.anyOf.length&&delete(t={...t.anyOf[0],...t})?.anyOf,t?.oneOf&&Array.isArray(t.oneOf)&&1===t.oneOf.length&&delete(t={...t.oneOf[0],...t})?.oneOf),o(t,r,n),n.seen.has(t))return t;if("object"==typeof t&&null!==t&&n.seen.set(t,!0),n.top=!1,n.depth++,void 0!==t?.items&&(n.property="items",e(t.items,t,n,o)),t?.additionalItems&&"object"==typeof t.additionalItems&&(n.property="additionalItems",e(t.additionalItems,t,n,o)),t?.additionalProperties&&"object"==typeof t.additionalProperties&&(n.property="additionalProperties",e(t.additionalProperties,t,n,o)),t?.properties)for(const r in t.properties){const a=t.properties[r];n.property=`properties/${r}`,e(a,t,n,o)}if(t?.patternProperties)for(const r in t.patternProperties){const a=t.patternProperties[r];n.property=`patternProperties/${r}`,e(a,t,n,o)}if(t?.allOf)for(const r in t.allOf){const a=t.allOf[r];n.property=`allOf/${r}`,e(a,t,n,o)}if(t?.anyOf)for(const r in t.anyOf){const a=t.anyOf[r];n.property=`anyOf/${r}`,e(a,t,n,o)}if(t?.oneOf)for(const r in t.oneOf){const a=t.oneOf[r];n.property=`oneOf/${r}`,e(a,t,n,o)}return t?.not&&(n.property="not",e(t.not,t,n,o)),n.depth--,t};function xP(e,t,r){if(t||(t={depth:0}),t.depth||(t={path:"#",depth:0,pkey:"",parent:{},payload:{},seen:new WeakMap,identity:!1,identityDetection:!1,...t}),"object"!=typeof e)return;const n=t.path;for(const o in e){if(t.key=o,t.path=`${t.path}/${encodeURIComponent(o)}`,t.identityPath=t.seen.get(e[o]),t.identity=void 0!==t.identityPath,e.hasOwnProperty(o)&&r(e,o,t),"object"==typeof e[o]&&!t.identity){t.identityDetection&&!Array.isArray(e[o])&&null!==e[o]&&t.seen.set(e[o],t.path);const n={};n.parent=e,n.path=t.path,n.depth=t.depth?t.depth+1:1,n.pkey=o,n.payload=t.payload,n.seen=t.seen,n.identity=!1,n.identityDetection=t.identityDetection,xP(e[o],n,r)}t.path=n}}let wP;function $P(e,t){for(const r in e)r.startsWith("x-")&&!r.startsWith("x-s2o")&&(t[r]=e[r])}function kP(e,t){bP(e,{},{},((e,r)=>{!function(e){if(e["x-required"]&&Array.isArray(e["x-required"])&&(e.required||(e.required=[]),e.required=e.required.concat(e["x-required"]),delete e["x-required"]),e["x-anyOf"]&&(e.anyOf=e["x-anyOf"],delete e["x-anyOf"]),e["x-oneOf"]&&(e.oneOf=e["x-oneOf"],delete e["x-oneOf"]),e["x-not"]&&(e.not=e["x-not"],delete e["x-not"]),"boolean"==typeof e["x-nullable"]&&(e.nullable=e["x-nullable"],delete e["x-nullable"]),"object"==typeof e["x-discriminator"]&&"string"==typeof e["x-discriminator"].propertyName){e.discriminator=e["x-discriminator"],delete e["x-discriminator"];for(const t in e.discriminator.mapping){const r=e.discriminator.mapping[t];r.startsWith("#/definitions/")&&(e.discriminator.mapping[t]=r.replace("#/definitions/","#/components/schemas/"))}}}(e),function(e,t,r){if(e.nullable&&r.patches++,e.discriminator&&"string"==typeof e.discriminator&&(e.discriminator={propertyName:e.discriminator}),e.items&&Array.isArray(e.items)&&(0===e.items.length?e.items={}:1===e.items.length?e.items=e.items[0]:e.items={anyOf:e.items}),e.type&&Array.isArray(e.type)){if(r.patches++,r.warnings.push("(Patchable) schema type must not be an array"),0===e.type.length)delete e.type;else{e.oneOf||(e.oneOf=[]);for(const t of e.type){const r={};if("null"===t)e.nullable=!0;else{r.type=t;for(const t of gP.arrayProperties)void 0!==e.prop&&(r[t]=e[t],delete e[t])}r.type&&e.oneOf.push(r)}delete e.type,0===e.oneOf.length?delete e.oneOf:e.oneOf.length<2&&(e.type=e.oneOf[0].type,Object.keys(e.oneOf[0]).length>1&&(r.patches++,r.warnings.push("Lost properties from oneOf")),delete e.oneOf)}e.type&&Array.isArray(e.type)&&1===e.type.length&&(e.type=e.type[0])}e.type&&"null"===e.type&&(delete e.type,e.nullable=!0),"array"!==e.type||e.items||(e.items={}),"file"===e.type&&(e.type="string",e.format="binary"),"boolean"==typeof e.required&&(e.required&&e.name&&(void 0===t.required&&(t.required=[]),Array.isArray(t.required)&&t.required.push(e.name)),delete e.required),e.xml&&"string"==typeof e.xml.namespace&&(e.xml.namespace||delete e.xml.namespace),e.allowEmptyValue&&(delete e.allowEmptyValue,r.patches++,r.warnings.push("(Patchable): deleted schema.allowEmptyValue"))}(e,r,t)}))}function SP(e){for(const t in e)for(const r in e[t]){const n=gP.sanitise(r);r!==n&&(e[t][n]=e[t][r],delete e[t][r])}}function AP(e,t){if("basic"===e.type&&(e.type="http",e.scheme="basic"),"oauth2"===e.type){const r={};let n=e.flow;"application"===e.flow&&(n="clientCredentials"),"accessCode"===e.flow&&(n="authorizationCode"),"string"==typeof e.authorizationUrl&&(r.authorizationUrl=e.authorizationUrl.split("?")[0].trim()||"/"),"string"==typeof e.tokenUrl&&(r.tokenUrl=e.tokenUrl.split("?")[0].trim()||"/"),r.scopes=e.scopes||{},e.flows={},e.flows[n]=r,delete e.flow,delete e.authorizationUrl,delete e.tokenUrl,delete e.scopes,e.name&&(delete e.name,t.patches++,t.warnings.push("(Patchable) oauth2 securitySchemes should not have name property"))}}function EP(e){return e&&!e["x-s2o-delete"]}function OP(e,t){if(e.type&&!e.schema&&(e.schema={}),e.type&&(e.schema.type=e.type),e.items&&"array"!==e.items.type){if(e.items.collectionFormat!==e.collectionFormat)return t.errCount++,void t.errors.push({message:"Nested collectionFormats are not supported",pointer:"/.../responses/header"});delete e.items.collectionFormat}"array"===e.type?("ssv"===e.collectionFormat?(t.patches++,t.warnings.push("collectionFormat:ssv is no longer supported for headers")):"pipes"===e.collectionFormat?(t.patches++,t.warnings.push("collectionFormat:pipes is no longer supported for headers")):"multi"===e.collectionFormat?e.explode=!0:"tsv"===e.collectionFormat?(e["x-collectionFormat"]="tsv",t.patches++,t.warnings.push("collectionFormat:tsv is no longer supported")):e.style="simple",delete e.collectionFormat):e.collectionFormat&&(delete e.collectionFormat,t.patches++,t.warnings.push("(Patchable) collectionFormat is only applicable to header.type array")),delete e.type;for(const t of gP.parameterTypeProperties)void 0!==e[t]&&(e.schema[t]=e[t],delete e[t]);for(const t of gP.arrayProperties)void 0!==e[t]&&(e.schema[t]=e[t],delete e[t])}function TP(e,t,r,n,o,a,i){const s={};let l,c=!0;t&&t.consumes&&"string"==typeof t.consumes&&(t.consumes=[t.consumes],i.patches++,i.warnings.push("(Patchable) operation.consumes must be an array")),Array.isArray(a.consumes)||delete a.consumes;const p=((t?t.consumes:null)||a.consumes||[]).filter(gP.uniqueOnly);if(e&&(e.name||e.in)){"boolean"==typeof e["x-deprecated"]&&(e.deprecated=e["x-deprecated"],delete e["x-deprecated"]),void 0!==e["x-example"]&&(e.example=e["x-example"],delete e["x-example"]),"body"===e.in||e.type||(e.type="string",i.patches++,i.warnings.push("(Patchable) parameter.type is mandatory for non-body parameters")),"file"===e.type&&(e["x-s2o-originalType"]=e.type,l=e.type),null===e.description&&delete e.description;let t=e.collectionFormat;if("array"!==e.type||t||(t="csv"),t&&("array"!==e.type&&(delete e.collectionFormat,i.patches++,i.warnings.push("(Patchable) collectionFormat is only applicable to param.type array")),"csv"!==t||"query"!==e.in&&"cookie"!==e.in||(e.style="form",e.explode=!1),"csv"!==t||"path"!==e.in&&"header"!==e.in||(e.style="simple"),"ssv"===t&&("query"===e.in?e.style="spaceDelimited":i.warnings.push(`${e.name} collectionFormat:ssv is no longer supported except for in:query parameters`)),"pipes"===t&&("query"===e.in?e.style="pipeDelimited":i.warnings.push(`${e.name} collectionFormat:pipes is no longer supported except for in:query parameters`)),"multi"===t&&(e.explode=!0),"tsv"===t&&(i.warnings.push("collectionFormat:tsv is no longer supported"),e["x-collectionFormat"]="tsv"),delete e.collectionFormat),e.type&&"body"!==e.type&&"formData"!==e.in)if(e.items&&e.schema)i.warnings.push(`${e.name} parameter has array,items and schema`);else{e.schema&&i.patches++,e.schema&&"object"==typeof e.schema||(e.schema={}),e.schema.type=e.type,e.items&&(e.schema.items=e.items,delete e.items,xP(e.schema.items,null,((r,n)=>{"collectionFormat"===n&&"string"==typeof r[n]&&(t&&r[n]!==t&&i.warnings.push(`${e.name} Nested collectionFormats are not supported`),delete r[n])})));for(const t of gP.parameterTypeProperties)void 0!==e[t]&&(e.schema[t]=e[t]),delete e[t]}e.schema&&kP(e.schema,i),e["x-ms-skip-url-encoding"]&&"query"===e.in&&(e.allowReserved=!0,delete e["x-ms-skip-url-encoding"])}if(e&&"formData"===e.in){c=!1,s.content={};let t="application/x-www-form-urlencoded";if(p.length&&p.indexOf("multipart/form-data")>=0&&(t="multipart/form-data"),s.content[t]={},e.schema)s.content[t].schema=e.schema;else{s.content[t].schema={},s.content[t].schema.type="object",s.content[t].schema.properties={},s.content[t].schema.properties[e.name]={};const r=s.content[t].schema,n=s.content[t].schema.properties[e.name];e.description&&(n.description=e.description),e.example&&(n.example=e.example),e.type&&(n.type=e.type);for(const t of gP.parameterTypeProperties)void 0!==e[t]&&(n[t]=e[t]);!0===e.required&&(r.required||(r.required=[]),r.required.push(e.name),s.required=!0),void 0!==e.default&&(n.default=e.default),n.properties&&(n.properties=e.properties),e.allOf&&(n.allOf=e.allOf),"array"===e.type&&e.items&&(n.items=e.items,n.items.collectionFormat&&delete n.items.collectionFormat),"file"!==l&&"file"!==e["x-s2o-originalType"]||(n.type="string",n.format="binary"),$P(e,n)}}else e&&"file"===e.type&&(e.required&&(s.required=e.required),s.content={},s.content["application/octet-stream"]={},s.content["application/octet-stream"].schema={},s.content["application/octet-stream"].schema.type="string",s.content["application/octet-stream"].schema.format="binary",$P(e,s));if(e&&"body"===e.in){s.content={},e.name&&(s["x-s2o-name"]=(t&&t.operationId?gP.sanitiseAll(t.operationId):"")+gP.camelize(`_${e.name}`)),e.description&&(s.description=e.description),e.required&&(s.required=e.required),p.length||p.push("application/json");for(const t of p)s.content[t]={},s.content[t].schema=gP.clone(e.schema||{}),kP(s.content[t].schema,i);$P(e,s)}if(Object.keys(s).length>0&&(e["x-s2o-delete"]=!0,t))if(t.requestBody&&c){t.requestBody["x-s2o-overloaded"]=!0;const e=t.operationId||o;i.warnings.push(`Operation ${e} has multiple requestBodies`)}else t.requestBody||(t=function(e,t){const r={};for(const n of Object.keys(e))r[n]=e[n],"parameters"===n&&(r.requestBody={},t.rbname&&(r[t.rbname]=""));return r.requestBody={},r}(t,i),r[n]=t),t.requestBody.content&&t.requestBody.content["multipart/form-data"]&&t.requestBody.content["multipart/form-data"].schema&&t.requestBody.content["multipart/form-data"].schema.properties&&s.content["multipart/form-data"]&&s.content["multipart/form-data"].schema&&s.content["multipart/form-data"].schema.properties?(t.requestBody.content["multipart/form-data"].schema.properties=Object.assign(t.requestBody.content["multipart/form-data"].schema.properties,s.content["multipart/form-data"].schema.properties),t.requestBody.content["multipart/form-data"].schema.required=(t.requestBody.content["multipart/form-data"].schema.required||[]).concat(s.content["multipart/form-data"].schema.required||[]),t.requestBody.content["multipart/form-data"].schema.required.length||delete t.requestBody.content["multipart/form-data"].schema.required):t.requestBody.content&&t.requestBody.content["application/x-www-form-urlencoded"]&&t.requestBody.content["application/x-www-form-urlencoded"].schema&&t.requestBody.content["application/x-www-form-urlencoded"].schema.properties&&s.content["application/x-www-form-urlencoded"]&&s.content["application/x-www-form-urlencoded"].schema&&s.content["application/x-www-form-urlencoded"].schema.properties?(t.requestBody.content["application/x-www-form-urlencoded"].schema.properties=Object.assign(t.requestBody.content["application/x-www-form-urlencoded"].schema.properties,s.content["application/x-www-form-urlencoded"].schema.properties),t.requestBody.content["application/x-www-form-urlencoded"].schema.required=(t.requestBody.content["application/x-www-form-urlencoded"].schema.required||[]).concat(s.content["application/x-www-form-urlencoded"].schema.required||[]),t.requestBody.content["application/x-www-form-urlencoded"].schema.required.length||delete t.requestBody.content["application/x-www-form-urlencoded"].schema.required):(t.requestBody=Object.assign(t.requestBody,s),t.requestBody["x-s2o-name"]||t.operationId&&(t.requestBody["x-s2o-name"]=gP.sanitiseAll(t.operationId)));if(e&&!e["x-s2o-delete"]){delete e.type;for(const t of gP.parameterTypeProperties)delete e[t];"path"!==e.in||void 0!==e.required&&!0===e.required||(e.required=!0,i.patches++,i.warnings.push(`(Patchable) path parameters must be required:true [${e.name} in ${o}]`))}return t}function CP(e,t,r,n){if(!e)return!1;if(e.description||"object"!=typeof e||Array.isArray(e)||(n.patches++,n.warnings.push("(Patchable) response.description is mandatory")),void 0!==e.schema){kP(e.schema,n),t&&t.produces&&"string"==typeof t.produces&&(t.produces=[t.produces],n.patches++,n.warnings.push("(Patchable) operation.produces must be an array")),r.produces&&!Array.isArray(r.produces)&&delete r.produces;const o=((t?t.produces:null)||r.produces||[]).filter(gP.uniqueOnly);o.length||o.push("*/*"),e.content={};for(const t of o){if(e.content[t]={},e.content[t].schema=gP.clone(e.schema),e.examples&&e.examples[t]){const r={};r.value=e.examples[t],e.content[t].examples={},e.content[t].examples.response=r,delete e.examples[t]}"file"===e.content[t].schema.type&&(e.content[t].schema={type:"string",format:"binary"})}delete e.schema}for(const t in e.examples)e.content||(e.content={}),e.content[t]||(e.content[t]={}),e.content[t].examples={},e.content[t].examples.response={},e.content[t].examples.response.value=e.examples[t];if(delete e.examples,e.headers)for(const t in e.headers)"status code"===t.toLowerCase()?(delete e.headers[t],n.patches++,n.warnings.push('(Patchable) "Status Code" is not a valid header')):OP(e.headers[t],n)}function _P(e,t,r,n,o){for(const a in e){const i=e[a];i&&i["x-trace"]&&"object"==typeof i["x-trace"]&&(i.trace=i["x-trace"],delete i["x-trace"]),i&&i["x-summary"]&&"string"==typeof i["x-summary"]&&(i.summary=i["x-summary"],delete i["x-summary"]),i&&i["x-description"]&&"string"==typeof i["x-description"]&&(i.description=i["x-description"],delete i["x-description"]),i&&i["x-servers"]&&Array.isArray(i["x-servers"])&&(i.servers=i["x-servers"],delete i["x-servers"]);for(const e in i)if(gP.httpMethods.indexOf(e)>=0||"x-amazon-apigateway-any-method"===e){let s=i[e];if(s&&s.parameters&&Array.isArray(s.parameters)){if(i.parameters)for(const t of i.parameters)s.parameters.find((e=>e.name===t.name&&e.in===t.in))||"formData"!==t.in&&"body"!==t.in&&"file"!==t.type||(s=TP(t,s,i,e,a,o,r));for(const t of s.parameters)s=TP(t,s,i,e,`${e}: ${a}`,o,r);s.parameters&&(s.parameters=s.parameters.filter(EP))}if(s&&s.security&&SP(s.security),"object"==typeof s){if(!s.responses){const e={description:"Default response"};s.responses={default:e}}for(const e in s.responses)CP(s.responses[e],s,o,r)}if(s&&s["x-servers"]&&Array.isArray(s["x-servers"]))s.servers=s["x-servers"],delete s["x-servers"];else if(s&&s.schemes&&s.schemes.length)for(const e of s.schemes)if((!o.schemes||o.schemes.indexOf(e)<0)&&(s.servers||(s.servers=[]),Array.isArray(o.servers)))for(const e of o.servers){const t=gP.clone(e);s.servers.push(t)}if(s){if(delete s.consumes,delete s.produces,delete s.schemes,s["x-ms-examples"]){for(const e in s["x-ms-examples"]){const t=s["x-ms-examples"][e],r=gP.sanitiseAll(e);if(t.parameters)for(const r in t.parameters){const n=t.parameters[r];for(const t of(s.parameters||[]).concat(i.parameters||[]))t.name!==r||t.example||(t.examples||(t.examples={}),t.examples[e]={value:n})}if(t.responses)for(const n in t.responses){if(t.responses[n].headers)for(const e in t.responses[n].headers){const r=t.responses[n].headers[e];for(const t in s.responses[n].headers)t===e&&(s.responses[n].headers[t].example=r)}if(t.responses[n].body&&(o.components.examples[r]={value:gP.clone(t.responses[n].body)},s.responses[n]&&s.responses[n].content))for(const t in s.responses[n].content){const o=s.responses[n].content[t];o.examples||(o.examples={}),o.examples[e]={$ref:`#/components/examples/${r}`}}}}delete s["x-ms-examples"]}if(s.parameters&&0===s.parameters.length&&delete s.parameters,s.requestBody){const r=s.operationId?gP.sanitiseAll(s.operationId):gP.camelize(gP.sanitiseAll(e+a)),o=gP.sanitise(s.requestBody["x-s2o-name"]||r||"");delete s.requestBody["x-s2o-name"];const i=JSON.stringify(s.requestBody),l=gP.createHash(i);if(!n[l]){const e={};e.name=o,e.body=s.requestBody,e.refs=[],n[l]=e}const c=`#/${t}/${encodeURIComponent(a)}/${e}/requestBody`;n[l].refs.push(c)}}}if(i&&i.parameters){for(const e in i.parameters)TP(i.parameters[e],null,i,null,a,o,r);Array.isArray(i.parameters)&&(i.parameters=i.parameters.filter(EP))}}}function jP(e){return e&&e.url&&"string"==typeof e.url?(e.url=e.url.split("{{").join("{"),e.url=e.url.split("}}").join("}"),e.url.replace(/\{(.+?)\}/g,((t,r)=>{e.variables||(e.variables={}),e.variables[r]={default:"unknown"}})),e):e}function IP(e,t){void 0!==e.info&&null!==e.info||(e.info={version:"",title:""},t.patches++,t.warnings.push("(Patchable) info object is mandatory")),("object"!=typeof e.info||Array.isArray(e.info))&&(t.errCount++,t.errors.push({message:"info must be an object",pointer:"/info"})),e.info&&(void 0===e.info.title&&(t.patches++,e.info.title="",t.warnings.push({message:"(Patchable) info.title cannot be null",pointer:"/info/title",patchable:!0})),void 0===e.info.version?(t.patches++,e.info.version="",t.warnings.push("(Patchable) info.version cannot be null")):"string"!=typeof e.info.version&&(t.patches++,e.info.version=e.info.version.toString(),t.warnings.push("(Patchable) info.version must be a string")))}function PP(e,t){e.paths||(t.patches++,e.paths={},t.warnings.push("(Patchable) paths object is mandatory"))}function RP(e={}){const t={original:e,openapi:{},patches:0,warnings:[],errCount:0,errors:[]};if(e.openapi&&"string"==typeof e.openapi&&e.openapi.startsWith("3."))return t.openapi=gP.circularClone(e),IP(t.openapi,t),PP(t.openapi,t),t;if("2.0"!==e.swagger)return t.errCount++,t.errors.push({message:`Unsupported swagger/OpenAPI version: ${e.openapi?e.openapi:e.swagger}`,pointer:"/swagger"}),t;if(t.openapi=gP.circularClone(e),t.openapi.openapi="3.0.0",delete t.openapi.swagger,xP(t.openapi,{},((e,t,r)=>{null===e[t]&&!t.startsWith("x-")&&"default"!==t&&r.path.indexOf("/example")<0&&delete e[t]})),e.host)(e.schemes||[]).forEach((r=>{const n={},o=(e.basePath||"").replace(/\/$/,"");n.url=`${r?`${r}:`:""}//${e.host}${o}`,jP(n),t.openapi.servers||(t.openapi.servers=[]),t.openapi.servers.push(n)}));else if(e.basePath){const r={};r.url=e.basePath,jP(r),t.openapi.servers||(t.openapi.servers=[]),t.openapi.servers.push(r)}if(delete t.openapi.host,delete t.openapi.basePath,e["x-ms-parameterized-host"]){const r=e["x-ms-parameterized-host"],n={};n.url=r.hostTemplate+(e.basePath?e.basePath:""),n.variables={};const o=n.url.match(/\{\w+\}/g);for(const e in r.parameters){const t=r.parameters[e];e.startsWith("x-")||(delete t.required,delete t.type,delete t.in,void 0===t.default&&(t.enum?t.default=t.enum[0]:t.default="none"),t.name||(t.name=o[e].replace("{","").replace("}","")),n.variables[t.name]=t,delete t.name)}t.openapi.servers||(t.openapi.servers=[]),!1===r.useSchemePrefix?t.openapi.servers.push(n):e.schemes.forEach((e=>{t.openapi.servers.push({...n,url:`${e}://${n.url}`})})),delete t.openapi["x-ms-parameterized-host"]}return IP(t.openapi,t),PP(t.openapi,t),"string"==typeof t.openapi.consumes&&(t.openapi.consumes=[t.openapi.consumes]),"string"==typeof t.openapi.produces&&(t.openapi.produces=[t.openapi.produces]),t.openapi.components={},t.openapi["x-callbacks"]&&(t.openapi.components.callbacks=t.openapi["x-callbacks"],delete t.openapi["x-callbacks"]),t.openapi.components.examples={},t.openapi.components.headers={},t.openapi["x-links"]&&(t.openapi.components.links=t.openapi["x-links"],delete t.openapi["x-links"]),t.openapi.components.parameters=t.openapi.parameters||{},t.openapi.components.responses=t.openapi.responses||{},t.openapi.components.requestBodies={},t.openapi.components.securitySchemes=t.openapi.securityDefinitions||{},t.openapi.components.schemas=t.openapi.definitions||{},delete t.openapi.definitions,delete t.openapi.responses,delete t.openapi.parameters,delete t.openapi.securityDefinitions,function(e){const t=e.openapi,r={};wP={schemas:{}},t.security&&SP(t.security);for(const r in t.components.securitySchemes){const n=gP.sanitise(r);if(r!==n){if(t.components.securitySchemes[n])return e.errCount++,e.errors.push({message:`Duplicate sanitised securityScheme name ${n}`,pointer:`/components/securitySchemes/${n}`}),e;t.components.securitySchemes[n]=t.components.securitySchemes[r],delete t.components.securitySchemes[r]}AP(t.components.securitySchemes[n],e)}for(const r in t.components.schemas){const n=gP.sanitiseAll(r);let o=0;if(r!==n){for(;t.components.schemas[n+o];)o=o?++o:2;t.components.schemas[n+o]=t.components.schemas[r],delete t.components.schemas[r]}wP.schemas[r]=n+o,kP(t.components.schemas[`${n}${o}`],e)}for(const r in t.components.parameters){const n=gP.sanitise(r);if(r!==n){if(t.components.parameters[n])return e.errCount++,e.errors.push({message:`Duplicate sanitised parameter name ${n}`,pointer:`/components/parameters/${n}`}),e;t.components.parameters[n]=t.components.parameters[r],delete t.components.parameters[r]}TP(t.components.parameters[n],null,null,null,n,t,e)}for(const r in t.components.responses){const n=gP.sanitise(r);if(r!==n){if(t.components.responses[n])return e.errCount++,e.errors.push({message:`Duplicate sanitised response name ${n}`,pointer:`/components/responses/${n}`}),e;t.components.responses[n]=t.components.responses[r],delete t.components.responses[r]}const o=t.components.responses[n];if(CP(o,null,t,e),o.headers)for(const t in o.headers)"status code"===t.toLowerCase()?(delete o.headers[t],e.patches++,e.warnings.push('(Patchable) "Status Code" is not a valid header')):OP(o.headers[t],e)}for(const e in t.components.requestBodies){const n=t.components.requestBodies[e],o=JSON.stringify(n),a=gP.createHash(o),i={};i.name=e,i.body=n,i.refs=[],r[a]=i}_P(t.paths,"paths",e,r,t),t["x-ms-paths"]&&_P(t["x-ms-paths"],"x-ms-paths",e,r,t);for(const e in t.components.parameters)t.components.parameters[e]["x-s2o-delete"]&&delete t.components.parameters[e];return delete t.consumes,delete t.produces,delete t.schemes,t.components.requestBodies={},t.components.responses&&0===Object.keys(t.components.responses).length&&delete t.components.responses,t.components.parameters&&0===Object.keys(t.components.parameters).length&&delete t.components.parameters,t.components.examples&&0===Object.keys(t.components.examples).length&&delete t.components.examples,t.components.requestBodies&&0===Object.keys(t.components.requestBodies).length&&delete t.components.requestBodies,t.components.securitySchemes&&0===Object.keys(t.components.securitySchemes).length&&delete t.components.securitySchemes,t.components.headers&&0===Object.keys(t.components.headers).length&&delete t.components.headers,t.components.schemas&&0===Object.keys(t.components.schemas).length&&delete t.components.schemas,t.components&&0===Object.keys(t.components).length&&delete t.components,e}(t)}function LP(e){return e.ok&&e.text&&e.parseError&&"YAMLException"===e.parseError.name&&(!e.headers["content-type"]||e.headers["content-type"].match("text/plain"))&&(e.body=e.text),e}const NP=function(e){return new Promise((async t=>{try{const r=await mP.resolve(e,LP);if(r.errors&&r.errors.length>0)t(r);else{r.spec.openapi&&(r.resolvedSpec=r.spec,t(r));const e=RP(r.spec);e.errors&&e.errors.length>0&&(Array.isArray(r.errors)?r.errors.concat(r.errors):r.errors=e.errors),e.warnings&&e.warnings.length>0&&(r.warnings=e.warnings),r.resolvedSpec=r.spec,r.spec=e.openapi,t(r)}}catch(e){t(e)}}))};async function DP(e,t=!1,r=!1,n="",o="",a="",i="",s=""){var l,c;let p;try{var d,u;let t;if(this.requestUpdate(),t="string"==typeof e?await NP({url:e,allowMetaPatches:!1}):await NP({spec:e,allowMetaPatches:!1}),await er(0),null!==(d=t.resolvedSpec)&&void 0!==d&&d.jsonSchemaViewer&&null!==(u=t.resolvedSpec)&&void 0!==u&&u.schemaAndExamples){this.dispatchEvent(new CustomEvent("before-render",{detail:{spec:t.resolvedSpec}}));const e=Object.entries(t.resolvedSpec.schemaAndExamples).map((e=>({show:!0,expanded:!0,selectedExample:null,name:e[0],elementId:e[0].replace(Qt,"-"),...e[1]})));return{specLoadError:!1,isSpecLoading:!1,info:t.resolvedSpec.info,schemaAndExamples:e}}var h,f,m,y;if(!t.spec||!(t.spec.components||t.spec.info||t.spec.servers||t.spec.tags||t.spec.paths))return console.info("RapiDoc: %c There was an issue while parsing the spec %o ","color:orangered",t),{specLoadError:!0,isSpecLoading:!1,info:{title:"Error loading the spec",description:null!==(h=t.response)&&void 0!==h&&h.url?`${null===(f=t.response)||void 0===f?void 0:f.url} ┃ ${null===(m=t.response)||void 0===m?void 0:m.status}  ${null===(y=t.response)||void 0===y?void 0:y.statusText}`:"Unable to load the Spec",version:" "},tags:[]};p=t.spec,this.dispatchEvent(new CustomEvent("before-render",{detail:{spec:p}}))}catch(e){console.info("RapiDoc: %c There was an issue while parsing the spec %o ","color:orangered",e)}const g=function(e,t,r=!1,n=!1){const o=["get","put","post","delete","patch","head","options"],a=e.tags&&Array.isArray(e.tags)?e.tags.map((e=>({show:!0,elementId:`tag--${e.name.replace(Qt,"-")}`,name:e.name,description:e.description||"",headers:e.description?FP(e.description):[],paths:[],expanded:!1!==e["x-tag-expanded"]}))):[],i=e.paths||{};if(e.webhooks)for(const[t,r]of Object.entries(e.webhooks))r._type="webhook",i[t]=r;for(const t in i){const n=i[t].parameters,s={servers:i[t].servers||[],parameters:i[t].parameters||[]},l="webhook"===i[t]._type;o.forEach((o=>{if(i[t][o]){const i=e.paths[t][o],c=i.tags||[];if(0===c.length)if(r){const e=t.replace(/^\/+|\/+$/g,""),r=e.indexOf("/");-1===r?c.push(e):c.push(e.substr(0,r))}else c.push("General ⦂");c.forEach((r=>{let c,p;var d,u;(e.tags&&(p=e.tags.find((e=>e.name.toLowerCase()===r.toLowerCase()))),c=a.find((e=>e.name===r)),c)||(c={show:!0,elementId:`tag--${r.replace(Qt,"-")}`,name:r,description:(null===(d=p)||void 0===d?void 0:d.description)||"",headers:null!==(u=p)&&void 0!==u&&u.description?FP(p.description):[],paths:[],expanded:!p||!1!==p["x-tag-expanded"]},a.push(c));let h=(i.summary||i.description||`${o.toUpperCase()} ${t}`).trim();h.length>100&&([h]=h.split(/[.|!|?]\s|[\r?\n]/));let f=[];if(f=n?i.parameters?n.filter((e=>{if(!i.parameters.some((t=>e.name===t.name&&e.in===t.in)))return e})).concat(i.parameters):n.slice(0):i.parameters?i.parameters.slice(0):[],i.callbacks)for(const[e,t]of Object.entries(i.callbacks)){const r=Object.entries(t).filter((e=>"object"==typeof e[1]))||[];i.callbacks[e]=Object.fromEntries(r)}c.paths.push({show:!0,expanded:!1,isWebhook:l,expandedAtLeastOnce:!1,summary:i.summary||"",description:i.description||"",externalDocs:i.externalDocs,shortSummary:h,method:o,path:t,operationId:i.operationId,elementId:`${o}-${t.replace(Qt,"-")}`,servers:i.servers?s.servers.concat(i.servers):s.servers,parameters:f,requestBody:i.requestBody,responses:i.responses,callbacks:i.callbacks,deprecated:i.deprecated,security:i.security,xBadges:i["x-badges"]||void 0,xCodeSamples:i["x-codeSamples"]||i["x-code-samples"]||""})}))}}))}const s=a.filter((e=>e.paths&&e.paths.length>0));return s.forEach((e=>{"method"===t?e.paths.sort(((e,t)=>o.indexOf(e.method).toString().localeCompare(o.indexOf(t.method)))):"summary"===t?e.paths.sort(((e,t)=>e.shortSummary.localeCompare(t.shortSummary))):"path"===t&&e.paths.sort(((e,t)=>e.path.localeCompare(t.path))),e.firstPathId=e.paths[0].elementId})),n?s.sort(((e,t)=>e.name.localeCompare(t.name))):s}(p,n,t,r),v=function(e){if(!e.components)return[];const t=[];for(const r in e.components){const n=[];for(const t in e.components[r]){const o={show:!0,id:`${r.toLowerCase()}-${t.toLowerCase()}`.replace(Qt,"-"),name:t,component:e.components[r][t]};n.push(o)}let o=r,a=r;switch(r){case"schemas":a="Schemas",o="Schemas allows the definition of input and output data types. These types can be objects, but also primitives and arrays.";break;case"responses":a="Responses",o="Describes responses from an API Operation, including design-time, static links to operations based on the response.";break;case"parameters":a="Parameters",o="Describes operation parameters. A unique parameter is defined by a combination of a name and location.";break;case"examples":a="Examples",o="List of Examples for operations, can be requests, responses and objects examples.";break;case"requestBodies":a="Request Bodies",o="Describes common request bodies that are used across the API operations.";break;case"headers":a="Headers",o='Headers follows the structure of the Parameters but they are explicitly in "header"';break;case"securitySchemes":a="Security Schemes",o="Defines a security scheme that can be used by the operations. Supported schemes are HTTP authentication, an API key (either as a header, a cookie parameter or as a query parameter), OAuth2's common flows(implicit, password, client credentials and authorization code) as defined in RFC6749, and OpenID Connect Discovery.";break;case"links":a="Links",o="Links represent a possible design-time link for a response. The presence of a link does not guarantee the caller's ability to successfully invoke it, rather it provides a known relationship and traversal mechanism between responses and other operations.";break;case"callbacks":a="Callbacks",o="A map of possible out-of band callbacks related to the parent operation. Each value in the map is a Path Item Object that describes a set of requests that may be initiated by the API provider and the expected responses. The key value used to identify the path item object is an expression, evaluated at runtime, that identifies a URL to use for the callback operation.";break;default:a=r,o=r}const i={show:!0,name:a,description:o,subComponents:n};t.push(i)}return t||[]}(p),b=null!==(l=p.info)&&void 0!==l&&l.description?FP(p.info.description):[],x=[];if(null!==(c=p.components)&&void 0!==c&&c.securitySchemes){const e=new Set;Object.entries(p.components.securitySchemes).forEach((t=>{if(!e.has(t[0])){e.add(t[0]);const r={securitySchemeId:t[0],...t[1]};r.value="",r.finalKeyValue="","apiKey"===t[1].type||"http"===t[1].type?(r.in=t[1].in||"header",r.name=t[1].name||"Authorization",r.user="",r.password=""):"oauth2"===t[1].type&&(r.in="header",r.name="Authorization",r.clientId="",r.clientSecret=""),x.push(r)}}))}o&&a&&i&&x.push({securitySchemeId:Xt,description:"api-key provided in rapidoc element attributes",type:"apiKey",oAuthFlow:"",name:o,in:a,value:i,finalKeyValue:i}),x.forEach((e=>{"http"===e.type?e.typeDisplay="basic"===e.scheme?"HTTP Basic":"HTTP Bearer":"apiKey"===e.type?e.typeDisplay=`API Key (${e.name})`:"oauth2"===e.type?e.typeDisplay=`OAuth (${e.securitySchemeId})`:e.typeDisplay=e.type||"None"}));let w=[];p.servers&&Array.isArray(p.servers)?(p.servers.forEach((e=>{let t=e.url.trim();t.startsWith("http")||t.startsWith("//")||t.startsWith("{")||window.location.origin.startsWith("http")&&(e.url=window.location.origin+e.url,t=e.url),e.variables&&Object.entries(e.variables).forEach((e=>{const r=new RegExp(`{${e[0]}}`,"g");t=t.replace(r,e[1].default||""),e[1].value=e[1].default||""})),e.computedUrl=t})),s&&p.servers.push({url:s,computedUrl:s})):s?p.servers=[{url:s,computedUrl:s}]:window.location.origin.startsWith("http")?p.servers=[{url:window.location.origin,computedUrl:window.location.origin}]:p.servers=[{url:"http://localhost",computedUrl:"http://localhost"}],w=p.servers;return{specLoadError:!1,isSpecLoading:!1,info:p.info,infoDescriptionHeaders:b,tags:g,components:v,externalDocs:p.externalDocs,securitySchemes:x,servers:w}}function FP(e){const t=Ut.lexer(e).filter((e=>"heading"===e.type&&e.depth<=2));return t||[]}const UP=1,BP=2,qP=3,zP=4,MP=e=>(...t)=>({_$litDirective$:e,values:t});class HP{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,r){this._$Ct=e,this._$AM=t,this._$Ci=r}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}class WP extends HP{constructor(e){if(super(e),this.it=U,e.type!==BP)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===U||null==e)return this._t=void 0,this.it=e;if(e===F)return e;if("string"!=typeof e)throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}}WP.directiveName="unsafeHTML",WP.resultType=1;const VP=MP(WP);var GP=r(764).lW;const KP="rapidoc";function JP(e,t="",r="",n=""){var o,a;const i=null===(o=this.resolvedSpec.securitySchemes)||void 0===o?void 0:o.find((t=>t.securitySchemeId===e));if(!i)return!1;let s="";if("basic"===(null===(a=i.scheme)||void 0===a?void 0:a.toLowerCase()))t&&(s=GP.from(`${t}:${r}`,"utf8").toString("base64"));else if(n){var l;i.value=n,s=`${"bearer"===(null===(l=i.scheme)||void 0===l?void 0:l.toLowerCase())?"Bearer ":""}${n}`}return!!s&&(i.finalKeyValue=s,this.requestUpdate(),!0)}function YP(){var e;null===(e=this.resolvedSpec.securitySchemes)||void 0===e||e.forEach((e=>{e.user="",e.password="",e.value="",e.finalKeyValue=""})),this.requestUpdate()}function ZP(){return JSON.parse(localStorage.getItem(KP))||{}}function QP(e){localStorage.setItem(KP,JSON.stringify(e))}function XP(){const e=ZP.call(this);Object.values(e).forEach((e=>{JP.call(this,e.securitySchemeId,e.username,e.password,e.value)}))}function eR(e){let t="";const r=this.resolvedSpec.securitySchemes.find((t=>t.securitySchemeId===e));if(r){const n=this.shadowRoot.getElementById(`security-scheme-${e}`);if(n){if(r.type&&r.scheme&&"http"===r.type&&"basic"===r.scheme.toLowerCase()){const t=n.querySelector(".api-key-user").value.trim(),r=n.querySelector(".api-key-password").value.trim();JP.call(this,e,t,r)}else t=n.querySelector(".api-key-input").value.trim(),JP.call(this,e,"","",t);if("true"===this.persistAuth){const t=ZP.call(this);t[e]=r,QP.call(this,t)}}}}function tR(e,t,r="Bearer"){const n=this.resolvedSpec.securitySchemes.find((t=>t.securitySchemeId===e));n.finalKeyValue=`${"bearer"===r.toLowerCase()?"Bearer":"mac"===r.toLowerCase()?"MAC":r} ${t}`,this.requestUpdate()}async function rR(e,t,r,n,o,a,i,s,l="header",c=null,p=null,d=null){const u=s?s.querySelector(".oauth-resp-display"):void 0,h=new URLSearchParams,f=new Headers;h.append("grant_type",o),"authorization_code"===o&&(h.append("client_id",t),h.append("client_secret",r)),"client_credentials"!==o&&"password"!==o&&h.append("redirect_uri",n),a&&(h.append("code",a),h.append("code_verifier","731DB1C3F7EA533B85E29492D26AA-1234567890-1234567890")),"header"===l?f.set("Authorization",`Basic ${GP.from(`${p}:${d}`,"utf8").toString("base64")}`):(h.append("client_id",t),h.append("client_secret",r)),"password"===o&&(h.append("username",p),h.append("password",d)),c&&h.append("scope",c);try{const t=await fetch(e,{method:"POST",headers:f,body:h}),r=await t.json();if(!t.ok)return u&&(u.innerHTML=`<span style="color:var(--red)">${r.error_description||r.error_description||"Unable to get access token"}</span>`),!1;if(r.token_type&&r.access_token)return tR.call(this,i,r.access_token,r.token_type),u&&(u.innerHTML='<span style="color:var(--green)">Access Token Received</span>'),!0}catch(e){return u&&(u.innerHTML='<span style="color:var(--red)">Failed to get access token</span>'),!1}}async function nR(e,t,r,n,o,a,i,s,l,c){sessionStorage.removeItem("winMessageEventActive"),t.close(),e.data.fake||(e.data||console.warn("RapiDoc: Received no data with authorization message"),e.data.error&&console.warn("RapiDoc: Error while receiving data"),e.data&&("code"===e.data.responseType?rR.call(this,r,n,o,a,i,e.data.code,l,c,s):"token"===e.data.responseType&&tR.call(this,l,e.data.access_token,e.data.token_type)))}async function oR(e,t,r,n,o){const a=o.target.closest(".oauth-flow"),i=a.querySelector(".oauth-client-id")?a.querySelector(".oauth-client-id").value.trim():"",s=a.querySelector(".oauth-client-secret")?a.querySelector(".oauth-client-secret").value.trim():"",l=a.querySelector(".api-key-user")?a.querySelector(".api-key-user").value.trim():"",c=a.querySelector(".api-key-password")?a.querySelector(".api-key-password").value.trim():"",p=a.querySelector(".oauth-send-client-secret-in")?a.querySelector(".oauth-send-client-secret-in").value.trim():"header",d=[...a.querySelectorAll(".scope-checkbox:checked")],u=a.querySelector(`#${e}-pkce`),h=`${Math.random().toString(36).slice(2,9)}random${Math.random().toString(36).slice(2,9)}`,f=`${Math.random().toString(36).slice(2,9)}random${Math.random().toString(36).slice(2,9)}`,m=new URL(`${window.location.origin}${window.location.pathname.substring(0,window.location.pathname.lastIndexOf("/"))}/${this.oauthReceiver}`);let y,g="",v="";if([...a.parentNode.querySelectorAll(".oauth-resp-display")].forEach((e=>{e.innerHTML=""})),"authorizationCode"===t||"implicit"===t){const o=new URL(r);"authorizationCode"===t?(g="authorization_code",v="code"):"implicit"===t&&(v="token");const l=new URLSearchParams(o.search),c=d.map((e=>e.value)).join(" ");c&&l.set("scope",c),l.set("client_id",i),l.set("redirect_uri",m.toString()),l.set("response_type",v),l.set("state",h),l.set("nonce",f),u&&u.checked&&(l.set("code_challenge","4FatVDBJKPAo4JgLLaaQFMUcQPn5CrPRvLlaob9PTYc"),l.set("code_challenge_method","S256")),l.set("show_dialog",!0),o.search=l.toString(),"true"===sessionStorage.getItem("winMessageEventActive")&&window.postMessage({fake:!0},this),setTimeout((()=>{y=window.open(o.toString()),y?(sessionStorage.setItem("winMessageEventActive","true"),window.addEventListener("message",(t=>nR.call(this,t,y,n,i,s,m.toString(),g,p,e,a)),{once:!0})):console.error(`RapiDoc: Unable to open ${o.toString()} in a new window`)}),10)}else if("clientCredentials"===t){g="client_credentials";const t=d.map((e=>e.value)).join(" ");rR.call(this,n,i,s,m.toString(),g,"",e,a,p,t)}else if("password"===t){g="password";const t=d.map((e=>e.value)).join(" ");rR.call(this,n,i,s,m.toString(),g,"",e,a,p,t,l,c)}}function aR(e,t,r,n,o,a=[],i="header"){let{authorizationUrl:s,tokenUrl:l,refreshUrl:c}=o;const p=o["x-pkce-only"]||!1,d=e=>e.indexOf("://")>0||0===e.indexOf("//");let u;return c&&!d(c)&&(c=`${this.selectedServer.computedUrl}/${c.replace(/^\//,"")}`),l&&!d(l)&&(l=`${this.selectedServer.computedUrl}/${l.replace(/^\//,"")}`),s&&!d(s)&&(s=`${this.selectedServer.computedUrl}/${s.replace(/^\//,"")}`),u="authorizationCode"===e?"Authorization Code Flow":"clientCredentials"===e?"Client Credentials Flow":"implicit"===e?"Implicit Flow":"password"===e?"Password Flow":e,Le`
    <div class="oauth-flow ${e}" style="padding: 12px 0; margin-bottom:12px;">
      <div class="tiny-title upper" style="margin-bottom:8px;">${u}</div>
      ${s?Le`<div style="margin-bottom:5px"><span style="width:75px; display: inline-block;">Auth URL</span> <span class="mono-font"> ${s} </span></div>`:""}
      ${l?Le`<div style="margin-bottom:5px"><span style="width:75px; display: inline-block;">Token URL</span> <span class="mono-font">${l}</span></div>`:""}
      ${c?Le`<div style="margin-bottom:5px"><span style="width:75px; display: inline-block;">Refresh URL</span> <span class="mono-font">${c}</span></div>`:""}
      ${"authorizationCode"===e||"clientCredentials"===e||"implicit"===e||"password"===e?Le`
          ${o.scopes?Le`
              <span> Scopes </span>
              <div class= "oauth-scopes" part="section-auth-scopes" style = "width:100%; display:flex; flex-direction:column; flex-wrap:wrap; margin:0 0 10px 24px">
                ${Object.entries(o.scopes).map(((t,r)=>Le`
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
          ${"password"===e?Le`
              <div style="margin:5px 0">
                <input type="text" value = "" placeholder="username" spellcheck="false" class="oauth2 ${e} ${n} api-key-user" part="textbox textbox-username">
                <input type="password" value = "" placeholder="password" spellcheck="false" class="oauth2 ${e} ${n} api-key-password" style = "margin:0 5px;" part="textbox textbox-password">
              </div>`:""}
          <div>
            ${"authorizationCode"===e?Le`
                <div style="margin: 16px 0 4px">
                  <input type="checkbox" part="checkbox checkbox-auth-scope" id="${n}-pkce" checked ?disabled=${p}>
                  <label for="${n}-pkce" style="margin:0 16px 0 4px; line-height:24px; cursor:pointer">
                   Send Proof Key for Code Exchange (PKCE)
                  </label>
                </div>
              `:""}
            <input type="text" part="textbox textbox-auth-client-id" value = "${t||""}" placeholder="client-id" spellcheck="false" class="oauth2 ${e} ${n} oauth-client-id">
            ${"authorizationCode"===e||"clientCredentials"===e||"password"===e?Le`
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
            ${"authorizationCode"===e||"clientCredentials"===e||"implicit"===e||"password"===e?Le`
                <button class="m-btn thin-border" part="btn btn-outline"
                  @click="${t=>{oR.call(this,n,e,s,l,t)}}"
                > GET TOKEN </button>`:""}
          </div>
          <div class="oauth-resp-display red-text small-font-size"></div>
          `:""}
    </div>
  `}function iR(e){var t;const r=null===(t=this.resolvedSpec.securitySchemes)||void 0===t?void 0:t.find((t=>t.securitySchemeId===e));if(r.user="",r.password="",r.value="",r.finalKeyValue="","true"===this.persistAuth){const e=ZP.call(this);delete e[r.securitySchemeId],QP.call(this,e)}this.requestUpdate()}function sR(){var e;if(!this.resolvedSpec)return"";const t=null===(e=this.resolvedSpec.securitySchemes)||void 0===e?void 0:e.filter((e=>e.finalKeyValue));return t?Le`
  <section id='auth' part="section-auth" style="text-align:left; direction:ltr; margin-top:24px; margin-bottom:24px;" class = 'observe-me ${"read focused".includes(this.renderStyle)?"section-gap--read-mode":"section-gap "}'>
    <div class='sub-title regular-font'> AUTHENTICATION </div>

    <div class="small-font-size" style="display:flex; align-items: center; min-height:30px">
      ${t.length>0?Le`
          <div class="blue-text"> ${t.length} API key applied </div>
          <div style="flex:1"></div>
          <button class="m-btn thin-border" part="btn btn-outline" @click=${()=>{YP.call(this)}}>CLEAR ALL API KEYS</button>`:Le`<div class="red-text">No API key applied</div>`}
    </div>
    ${this.resolvedSpec.securitySchemes&&this.resolvedSpec.securitySchemes.length>0?Le`
        <table role="presentation" id="auth-table" class='m-table padded-12' style="width:100%;">
          ${this.resolvedSpec.securitySchemes.map((e=>Le`
            <tr id="security-scheme-${e.securitySchemeId}" class="${e.type.toLowerCase()}">
              <td style="max-width:500px; overflow-wrap: break-word;">
                <div style="line-height:28px; margin-bottom:5px;">
                  <span style="font-weight:bold; font-size:var(--font-size-regular)">${e.typeDisplay}</span>
                  ${e.finalKeyValue?Le`
                      <span class='blue-text'>  ${e.finalKeyValue?"Key Applied":""} </span>
                      <button class="m-btn thin-border small" part="btn btn-outline" @click=${()=>{iR.call(this,e.securitySchemeId)}}>REMOVE</button>
                      `:""}
                </div>
                ${e.description?Le`
                    <div class="m-markdown">
                      ${VP(Ut(e.description||""))}
                    </div>`:""}

                ${"apikey"===e.type.toLowerCase()||"http"===e.type.toLowerCase()&&"bearer"===e.scheme.toLowerCase()?Le`
                    <div style="margin-bottom:5px">
                      ${"apikey"===e.type.toLowerCase()?Le`Send <code>${e.name}</code> in <code>${e.in}</code>`:Le`Send <code>Authorization</code> in <code>header</code> containing the word <code>Bearer</code> followed by a space and a Token String.`}
                    </div>
                    <div style="max-height:28px;">
                      ${"cookie"!==e.in?Le`
                          <input type = "text" value = "${e.value}" class="${e.type} ${e.securitySchemeId} api-key-input" placeholder = "api-token" spellcheck = "false">
                          <button class="m-btn thin-border" style = "margin-left:5px;"
                            part = "btn btn-outline"
                            @click="${t=>{eR.call(this,e.securitySchemeId,t)}}">
                            ${e.finalKeyValue?"UPDATE":"SET"}
                          </button>`:Le`<span class="gray-text" style="font-size::var(--font-size-small)"> cookies cannot be set from here</span>`}
                    </div>`:""}
                ${"http"===e.type.toLowerCase()&&"basic"===e.scheme.toLowerCase()?Le`
                    <div style="margin-bottom:5px">
                      Send <code>Authorization</code> in <code>header</code> containing the word <code>Basic</code> followed by a space and a base64 encoded string of <code>username:password</code>.
                    </div>
                    <div>
                      <input type="text" value = "${e.user}" placeholder="username" spellcheck="false" class="${e.type} ${e.securitySchemeId} api-key-user" style="width:100px">
                      <input type="password" value = "${e.password}" placeholder="password" spellcheck="false" class="${e.type} ${e.securitySchemeId} api-key-password" style = "width:100px; margin:0 5px;">
                      <button class="m-btn thin-border"
                        @click="${t=>{eR.call(this,e.securitySchemeId,t)}}"
                        part = "btn btn-outline"
                      >
                        ${e.finalKeyValue?"UPDATE":"SET"}
                      </button>
                    </div>`:""}
              </td>
            </tr>
            ${"oauth2"===e.type.toLowerCase()?Le`
                <tr>
                  <td style="border:none; padding-left:48px">
                    ${Object.keys(e.flows).map((t=>aR.call(this,t,e.flows[t]["x-client-id"]||e["x-client-id"]||"",e.flows[t]["x-client-secret"]||e["x-client-secret"]||"",e.securitySchemeId,e.flows[t],e.flows[t]["x-default-scopes"]||e["x-default-scopes"],e.flows[t]["x-receive-token-in"]||e["x-receive-token-in"])))}
                  </td>
                </tr>
                `:""}
          `))}
        </table>`:""}
    <slot name="auth"></slot>
  </section>
`:void 0}function lR(e){if(this.resolvedSpec.securitySchemes&&e){const t=[];return Array.isArray(e)?0===e.length?"":(e.forEach((e=>{const r=[],n=[];0===Object.keys(e).length?t.push({securityTypes:"None",securityDefs:[]}):(Object.keys(e).forEach((t=>{let o="";const a=this.resolvedSpec.securitySchemes.find((e=>e.securitySchemeId===t));e[t]&&Array.isArray(e[t])&&(o=e[t].join(", ")),a&&(n.push(a.typeDisplay),r.push({...a,scopes:o}))})),t.push({securityTypes:n.length>1?`${n[0]} + ${n.length-1} more`:n[0],securityDefs:r}))})),Le`<div style="position:absolute; top:3px; right:2px; font-size:var(--font-size-small); line-height: 1.5;">
      <div style="position:relative; display:flex; min-width:350px; max-width:700px; justify-content: flex-end;">
        <svg width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" fill="none" style="stroke:var(--fg3)"> <rect x="5" y="11" width="14" height="10" rx="2" /> <circle cx="12" cy="16" r="1" /> <path d="M8 11v-4a4 4 0 0 1 8 0v4" /></svg>
          ${t.map(((e,t)=>Le`
          ${e.securityTypes?Le`
              ${0!==t?Le`<div style="padding:3px 4px;"> OR </div>`:""}
              <div class="tooltip">
                <div style = "padding:2px 4px; white-space:nowrap; text-overflow:ellipsis;max-width:150px; overflow:hidden;">
                  ${"true"===this.updateRoute&&"true"===this.allowAuthentication?Le`<a part="anchor anchor-operation-security" href="#auth"> ${e.securityTypes} </a>`:Le`${e.securityTypes}`}
                </div>
                <div class="tooltip-text" style="position:absolute; color: var(--fg); top:26px; right:0; border:1px solid var(--border-color);padding:2px 4px; display:block;">
                  ${e.securityDefs.length>1?Le`<div>Requires <b>all</b> of the following </div>`:""}
                  <div style="padding-left: 8px">
                    ${e.securityDefs.map(((t,r)=>{const n=Le`${""!==t.scopes?Le`
                          <div>
                            <b>Required scopes:</b>
                            <br/>
                            <div style="margin-left:8px">
                              ${t.scopes.split(",").map(((e,t)=>Le`${0===t?"":"┃"}<span>${e}</span>`))}
                            </div>
                          </div>`:""}`;return Le`
                      ${"oauth2"===t.type?Le`
                          <div>
                            ${e.securityDefs.length>1?Le`<b>${r+1}.</b> &nbsp;`:"Needs"}
                            OAuth Token <span style="font-family:var(--font-mono); color:var(--primary-color);">${t.securitySchemeId}</span> in <b>Authorization header</b>
                            ${n}
                          </div>`:"http"===t.type?Le`
                            <div>
                              ${e.securityDefs.length>1?Le`<b>${r+1}.</b> &nbsp;`:Le`Requires`}
                              ${"basic"===t.scheme?"Base 64 encoded username:password":"Bearer Token"} in <b>Authorization header</b>
                              ${n}
                            </div>`:Le`
                            <div>
                              ${e.securityDefs.length>1?Le`<b>${r+1}.</b> &nbsp;`:Le`Requires`}
                              Token in <b>${t.name} ${t.in}</b>
                              ${n}
                            </div>`}`}))}
                  </div>
                </div>
              </div>
            `:""}
        `))}
      </div>
    `):""}return""}function cR(e){return Le`
  <section class="table-title" style="margin-top:24px;">CODE SAMPLES</div>
  <div class="tab-panel col"
    @click="${e=>{if(!e.target.classList.contains("tab-btn"))return;const t=e.target.dataset.tab,r=[...e.currentTarget.querySelectorAll(".tab-btn")],n=[...e.currentTarget.querySelectorAll(".tab-content")];r.forEach((e=>e.classList[e.dataset.tab===t?"add":"remove"]("active"))),n.forEach((e=>{e.style.display=e.dataset.tab===t?"block":"none"}))}}">
    <div class="tab-buttons row" style="width:100; overflow">
      ${e.map(((e,t)=>Le`<button class="tab-btn ${0===t?"active":""}" data-tab = '${e.lang}${t}'> ${e.label||e.lang} </button>`))}
    </div>
    ${e.map(((e,t)=>{var r,n,o;return Le`
      <div class="tab-content m-markdown" style= "display:${0===t?"block":"none"}" data-tab = '${e.lang}${t}'>
        <button class="toolbar-btn" style = "position:absolute; top:12px; right:8px" @click='${t=>{tr(e.source,t)}}'> Copy </button>
        <pre><code class="language">${qt().languages[null===(r=e.lang)||void 0===r?void 0:r.toLowerCase()]?VP(qt().highlight(e.source,qt().languages[null===(n=e.lang)||void 0===n?void 0:n.toLowerCase()],null===(o=e.lang)||void 0===o?void 0:o.toLowerCase())):e.source}</code></pre>
      </div>`}))}
  </div>  
  </section>`}function pR(e){return Le`
    <div class="req-res-title" style="margin-top:12px">CALLBACKS</div>
    ${Object.entries(e).map((e=>Le`
      <div class="tiny-title" style="padding: 12px; border:1px solid var(--light-border-color)"> 
        ${e[0]}
        ${Object.entries(e[1]).map((e=>Le`
          <div class="mono-font small-font-size" style="display:flex; margin-left:16px;">
            <div style="width:100%"> 
              ${Object.entries(e[1]).map((t=>{var r,n,o;return Le`
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
  `}const dR={},uR=MP(class extends HP{constructor(){super(...arguments),this.ot=dR}render(e,t){return t()}update(e,[t,r]){if(Array.isArray(t)){if(Array.isArray(this.ot)&&this.ot.length===t.length&&t.every(((e,t)=>e===this.ot[t])))return F}else if(this.ot===t)return F;return this.ot=Array.isArray(t)?Array.from(t):t,this.render(t,r)}}),{I:hR}=X,fR={},mR=MP(class extends HP{constructor(e){if(super(e),e.type!==qP&&e.type!==UP&&e.type!==zP)throw Error("The `live` directive is not allowed on child or event bindings");if(!(e=>void 0===e.strings)(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===F||t===U)return t;const r=e.element,n=e.name;if(e.type===qP){if(t===r[n])return F}else if(e.type===zP){if(!!t===r.hasAttribute(n))return F}else if(e.type===UP&&r.getAttribute(n)===t+"")return F;return((e,t=fR)=>{e._$AH=t})(e),t}});var yR=r(131),gR=r.n(yR);const vR=ie`
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
`;function bR(e){return void 0===e?"":null===e?"null":""===e?"∅":"boolean"==typeof e||"number"==typeof e?`${e}`:Array.isArray(e)?e.map((e=>null===e?"null":""===e?"∅":e.toString().replace(/^ +| +$/g,(e=>"●".repeat(e.length)))||"")).join(", "):e.toString().replace(/^ +| +$/g,(e=>"●".repeat(e.length)))||""}function xR(e){if(!e)return;let t="",r="";if(e.$ref){const r=e.$ref.lastIndexOf("/");t=`{recursive: ${e.$ref.substring(r+1)}} `}else e.type?(t=Array.isArray(e.type)?e.type.join(2===e.length?" or ":"┃"):e.type,(e.format||e.enum||e.const)&&(t=t.replace("string",e.enum?"enum":e.const?"const":e.format)),e.nullable&&(t+="┃null")):t=e.const?"const":0===Object.keys(e).length?"any":"{missing-type-info}";const n={type:t,format:e.format||"",pattern:e.pattern&&!e.enum?e.pattern:"",readOrWriteOnly:e.readOnly?"🆁":e.writeOnly?"🆆":"",deprecated:e.deprecated?"❌":"",examples:e.examples||e.example,default:bR(e.default),description:e.description||"",constrain:"",allowedValues:"",arrayType:"",html:""};if("{recursive}"===n.type?n.description=e.$ref.substring(e.$ref.lastIndexOf("/")+1):"{missing-type-info}"!==n.type&&"any"!==n.type||(n.description=n.description||""),n.allowedValues=e.const?e.const:Array.isArray(e.enum)?e.enum.map((e=>bR(e))).join("┃"):"","array"===t&&e.items){var o,a;const t=null===(o=e.items)||void 0===o?void 0:o.type,r=bR(e.items.default);n.arrayType=`${e.type} of ${Array.isArray(t)?t.join(""):t}`,n.default=r,n.allowedValues=e.items.const?e.const:Array.isArray(null===(a=e.items)||void 0===a?void 0:a.enum)?e.items.enum.map((e=>bR(e))).join("┃"):""}return t.match(/integer|number/g)&&(void 0===e.minimum&&void 0===e.exclusiveMinimum||(r+=void 0!==e.minimum?`Min ${e.minimum}`:`More than ${e.exclusiveMinimum}`),void 0===e.maximum&&void 0===e.exclusiveMaximum||(r+=void 0!==e.maximum?`${r?"┃":""}Max ${e.maximum}`:`${r?"┃":""}Less than ${e.exclusiveMaximum}`),void 0!==e.multipleOf&&(r+=`${r?"┃":""} multiple of ${e.multipleOf}`)),t.match(/string/g)&&(void 0!==e.minLength&&void 0!==e.maxLength?r+=`${r?"┃":""}${e.minLength} to ${e.maxLength} chars`:void 0!==e.minLength?r+=`${r?"┃":""}Min ${e.minLength} chars`:void 0!==e.maxLength&&(r+=`Max ${r?"┃":""}${e.maxLength} chars`)),n.constrain=r,n.html=`${n.type}~|~${n.readOrWriteOnly}~|~${n.constrain}~|~${n.default}~|~${n.allowedValues}~|~${n.pattern}~|~${n.description}~|~${e.title||""}~|~${n.deprecated?"deprecated":""}`,n}function wR(e){return"boolean"==typeof e||"number"==typeof e?{Example:{value:`${e}`}}:""===e?{Example:{value:""}}:e?{Example:{value:e}}:e}function $R(e,t="string"){if(!e)return{exampleVal:"",exampleList:[]};if(e.constructor===Object){const t=Object.values(e).filter((e=>!1!==e["x-example-show-value"])).map((e=>({value:"boolean"==typeof e.value||"number"==typeof e.value?`${e.value}`:e.value||"",printableValue:bR(e.value),summary:e.summary||"",description:e.description||""})));return{exampleVal:t.length>0?t[0].value.toString():"",exampleList:t}}if(Array.isArray(e)||(e=e?[e]:[]),0===e.length)return{exampleVal:"",exampleList:[]};if("array"===t){const[t]=e,r=e.map((e=>({value:e,printableValue:bR(e)})));return{exampleVal:t,exampleList:r}}const r=e[0].toString(),n=e.map((e=>({value:e.toString(),printableValue:bR(e)})));return{exampleVal:r,exampleList:n}}function kR(e){const t=e.examples?e.examples[0]:null===e.example?null:e.example||void 0;if(""===t)return"";if(null===t)return null;if(0===t)return 0;if(!1===t)return!1;if(t instanceof Date)switch(e.format.toLowerCase()){case"date":return t.toISOString().split("T")[0];case"time":return t.toISOString().split("T")[1];default:return t.toISOString()}if(t)return t;if(0===Object.keys(e).length)return null;if(e.$ref)return e.$ref;if(!1===e.const||0===e.const||null===e.const||""===e.const)return e.const;if(e.const)return e.const;const r=Array.isArray(e.type)?e.type[0]:e.type;if(!r)return"?";if(r.match(/^integer|^number/g)){const t=Number.isNaN(Number(e.multipleOf))?void 0:Number(e.multipleOf),n=Number.isNaN(Number(e.maximum))?void 0:Number(e.maximum),o=Number.isNaN(Number(e.minimum))?Number.isNaN(Number(e.exclusiveMinimum))?n||0:Number(e.exclusiveMinimum)+(r.startsWith("integer")?1:.001):Number(e.minimum);return t?t>=o?t:o%t==0?o:Math.ceil(o/t)*t:o}if(r.match(/^boolean/g))return!1;if(r.match(/^null/g))return null;if(r.match(/^string/g)){if(e.enum)return e.enum[0];if(e.const)return e.const;if(e.pattern)return e.pattern;if(!e.format){const t=Number.isNaN(e.minLength)?void 0:Number(e.minLength),r=Number.isNaN(e.maxLength)?void 0:Number(e.maxLength),n=t||(r>6?6:r||void 0);return n?"A".repeat(n):"string"}{const t=`${Date.now().toString(16)}${Math.random().toString(16)}0`.repeat(16);switch(e.format.toLowerCase()){case"url":case"uri":return"http://example.com";case"date":return new Date(0).toISOString().split("T")[0];case"time":return new Date(0).toISOString().split("T")[1];case"date-time":return new Date(0).toISOString();case"duration":return"P3Y6M4DT12H30M5S";case"email":case"idn-email":return"user@example.com";case"hostname":case"idn-hostname":return"www.example.com";case"ipv4":return"198.51.100.42";case"ipv6":return"2001:0db8:5b96:0000:0000:426f:8e17:642a";case"uuid":return[t.substr(0,8),t.substr(8,4),`4000-8${t.substr(13,3)}`,t.substr(16,12)].join("-");default:return""}}}return"?"}function SR(e,t=1){const r="  ".repeat(t);let n="";if(1===t&&"object"!=typeof e)return`\n${r}${e.toString()}`;for(const o in e){const a=e[o]["::XML_TAG"]||o;let i="";i=Array.isArray(e[o])?a[0]["::XML_TAG"]||`${o}`:a,o.startsWith("::")||(n=Array.isArray(e[o])||"object"==typeof e[o]?`${n}\n${r}<${i}> ${SR(e[o],t+1)}\n${r}</${i}>`:`${n}\n${r}<${i}> ${e[o].toString()} </${i}>`)}return n}function AR(e,t){var r,n;if("object"==typeof t&&null!==t){var o,a;if(e.title&&(t["::TITLE"]=e.title),e.description&&(t["::DESCRIPTION"]=e.description),null!==(r=e.xml)&&void 0!==r&&r.name)t["::XML_TAG"]=null===(o=e.xml)||void 0===o?void 0:o.name;if(null!==(n=e.xml)&&void 0!==n&&n.wrapped)t["::XML_WRAP"]=null===(a=e.xml)||void 0===a?void 0:a.wrapped.toString()}}function ER(e){if("object"==typeof e&&null!==e){delete e["::TITLE"],delete e["::DESCRIPTION"],delete e["::XML_TAG"],delete e["::XML_WRAP"];for(const t in e)ER(e[t])}}function OR(e,t,r){for(const n in t)t[n][r]=e}function TR(e,t,r){let n=0;const o={};for(const a in e){for(const i in r)if(o[`example-${n}`]={...e[a]},o[`example-${n}`][t]=r[i],n++,n>=10)break;if(n>=10)break}return o}function CR(e,t={}){let r={};if(e){if(e.allOf){var n,o;const a={};if(!(1!==e.allOf.length||null!==(n=e.allOf[0])&&void 0!==n&&n.properties||null!==(o=e.allOf[0])&&void 0!==o&&o.items)){if(e.allOf[0].$ref)return"{  }";if(e.allOf[0].readOnly&&t.includeReadOnly){return kR(e.allOf[0])}return}e.allOf.forEach((e=>{if("object"===e.type||e.properties||e.allOf||e.anyOf||e.oneOf){const r=CR(e,t);Object.assign(a,r)}else if("array"===e.type||e.items){const r=[CR(e,t)];Object.assign(a,r)}else{if(!e.type)return"";{const t=`prop${Object.keys(a).length}`;a[t]=kR(e)}}})),r=a}else if(e.oneOf){const n={};if(e.properties)for(const r in e.properties){var a;e.properties[r].properties||null!==(a=e.properties[r].properties)&&void 0!==a&&a.items?n[r]=CR(e.properties[r],t):n[r]=kR(e.properties[r])}if(e.oneOf.length>0){let o=0;for(const a in e.oneOf){const i=CR(e.oneOf[a],t);for(const t in i){let s;if(Object.keys(n).length>0){if(null===i[t]||"object"!=typeof i[t])continue;s=Object.assign(i[t],n)}else s=i[t];r[`example-${o}`]=s,AR(e.oneOf[a],r[`example-${o}`]),o++}}}}else if(e.anyOf){let n;if("object"===e.type||e.properties){n={"example-0":{}};for(const r in e.properties){if(e.example){n=e;break}e.properties[r].deprecated&&!t.includeDeprecated||(e.properties[r].readOnly&&!t.includeReadOnly||e.properties[r].writeOnly&&!t.includeWriteOnly||(n=TR(n,r,CR(e.properties[r],t))))}}let o=0;for(const a in e.anyOf){const i=CR(e.anyOf[a],t);for(const t in i){if(void 0!==n)for(const e in n)r[`example-${o}`]={...n[e],...i[t]};else r[`example-${o}`]=i[t];AR(e.anyOf[a],r[`example-${o}`]),o++}}}else if("object"===e.type||e.properties)if(r["example-0"]={},AR(e,r["example-0"]),e.example)r["example-0"]=e.example;else for(const n in e.properties){var i,s,l,c,p,d,u;if(null===(i=e.properties[n])||void 0===i||!i.deprecated||t.includeDeprecated)if(null===(s=e.properties[n])||void 0===s||!s.readOnly||t.includeReadOnly)if(null===(l=e.properties[n])||void 0===l||!l.writeOnly||t.includeWriteOnly)if("array"===(null===(c=e.properties[n])||void 0===c?void 0:c.type)||null!==(p=e.properties[n])&&void 0!==p&&p.items)if(e.properties[n].example)OR(e.properties[n].example,r,n);else if(null!==(d=e.properties[n])&&void 0!==d&&null!==(u=d.items)&&void 0!==u&&u.example)OR([e.properties[n].items.example],r,n);else{const o=CR(e.properties[n].items,t);if(t.useXmlTagForProp){var h,f;const t=(null===(h=e.properties[n].xml)||void 0===h?void 0:h.name)||n;if(null!==(f=e.properties[n].xml)&&void 0!==f&&f.wrapped){r=TR(r,t,JSON.parse(`{ "${t}" : { "${t}" : ${JSON.stringify(o["example-0"])} } }`))}else r=TR(r,t,o)}else{const e=[];for(const t in o)e[t]=[o[t]];r=TR(r,n,e)}}else r=TR(r,n,CR(e.properties[n],t))}else{if("array"!==e.type&&!e.items)return{"example-0":kR(e)};var m;if(e.items||e.example)if(e.example)r["example-0"]=e.example;else if(null!==(m=e.items)&&void 0!==m&&m.example)r["example-0"]=[e.items.example];else{const n=CR(e.items,t);let o=0;for(const t in n)r[`example-${o}`]=[n[t]],AR(e.items,r[`example-${o}`]),o++}else r["example-0"]=[]}return r}}function _R(e,t=0){var r;let n=(e.description||e.title)&&(e.minItems||e.maxItems)?'<span class="descr-expand-toggle">➔</span>':"";if(e.title?n=e.description?`${n} <b>${e.title}:</b> ${e.description}<br/>`:`${n} ${e.title}<br/>`:e.description&&(n=`${n} ${e.description}<br/>`),e.minItems&&(n=`${n} <b>Min Items:</b> ${e.minItems}`),e.maxItems&&(n=`${n} <b>Max Items:</b> ${e.maxItems}`),t>0&&null!==(r=e.items)&&void 0!==r&&r.description){let t="";e.items.minProperties&&(t=`<b>Min Properties:</b> ${e.items.minProperties}`),e.items.maxProperties&&(t=`${t} <b>Max Properties:</b> ${e.items.maxProperties}`),n=`${n} ⮕ ${t} [ ${e.items.description} ] `}return n}function jR(e,t,r=0,n=""){if(e){if(e.allOf){const n={};if(1===e.allOf.length&&!e.allOf[0].properties&&!e.allOf[0].items){return`${xR(e.allOf[0]).html}`}e.allOf.map(((e,t)=>{if("object"===e.type||e.properties||e.allOf||e.anyOf||e.oneOf){const o=(e.anyOf||e.oneOf)&&t>0?t:"",a=jR(e,{},r+1,o);Object.assign(n,a)}else if("array"===e.type||e.items){const t=jR(e,{},r+1);Object.assign(n,t)}else{if(!e.type)return"";{const t=`prop${Object.keys(n).length}`,r=xR(e);n[t]=`${r.html}`}}})),t=n}else if(e.anyOf||e.oneOf){if(t["::description"]=e.description||"","object"===e.type||e.properties){t["::description"]=e.description||"",t["::type"]="object";for(const n in e.properties)e.required&&e.required.includes(n)?t[`${n}*`]=jR(e.properties[n],{},r+1):t[n]=jR(e.properties[n],{},r+1)}const o={},a=e.anyOf?"anyOf":"oneOf";e[a].forEach(((e,t)=>{if("object"===e.type||e.properties||e.allOf||e.anyOf||e.oneOf){const r=jR(e,{});o[`::OPTION~${t+1}${e.title?`~${e.title}`:""}`]=r,o[`::OPTION~${t+1}${e.title?`~${e.title}`:""}`]["::readwrite"]="",o["::type"]="xxx-of-option"}else if("array"===e.type||e.items){const r=jR(e,{});o[`::OPTION~${t+1}${e.title?`~${e.title}`:""}`]=r,o[`::OPTION~${t+1}${e.title?`~${e.title}`:""}`]["::readwrite"]="",o["::type"]="xxx-of-array"}else{const r=`::OPTION~${t+1}${e.title?`~${e.title}`:""}`;o[r]=`${xR(e).html}`,o["::type"]="xxx-of-option"}})),t[e.anyOf?`::ANY~OF ${n}`:`::ONE~OF ${n}`]=o,t["::type"]="object"}else if(Array.isArray(e.type)){const n=JSON.parse(JSON.stringify(e)),i=[],s=[];let l;var o;if(n.type.forEach((e=>{var t,r;e.match(/integer|number|string|null|boolean/g)?i.push(e):"array"===e&&"string"==typeof(null===(t=n.items)||void 0===t?void 0:t.type)&&null!==(r=n.items)&&void 0!==r&&r.type.match(/integer|number|string|null|boolean/g)?"string"===n.items.type&&n.items.format?i.push(`[${n.items.format}]`):i.push(`[${n.items.type}]`):s.push(e)})),i.length>0)if(n.type=i.join(2===i.length?" or ":"┃"),l=xR(n),0===s.length)return`${(null===(o=l)||void 0===o?void 0:o.html)||""}`;if(s.length>0){var a;t["::type"]="object";const o={"::type":"xxx-of-option"};s.forEach(((t,a)=>{if("null"===t)o[`::OPTION~${a+1}`]="NULL~|~~|~~|~~|~~|~~|~~|~~|~";else if("integer, number, string, boolean,".includes(`${t},`)){n.type=Array.isArray(t)?t.join("┃"):t;const e=xR(n);o[`::OPTION~${a+1}`]=e.html}else if("object"===t){const t={"::title":e.title||"","::description":e.description||"","::type":"object","::deprecated":e.deprecated||!1};for(const n in e.properties)e.required&&e.required.includes(n)?t[`${n}*`]=jR(e.properties[n],{},r+1):t[n]=jR(e.properties[n],{},r+1);o[`::OPTION~${a+1}`]=t}else"array"===t&&(o[`::OPTION~${a+1}`]={"::title":e.title||"","::description":e.description||"","::type":"array","::props":jR(e.items,{},r+1)})})),o[`::OPTION~${s.length+1}`]=(null===(a=l)||void 0===a?void 0:a.html)||"",t["::ONE~OF"]=o}}else if("object"===e.type||e.properties){t["::title"]=e.title||"",t["::description"]=_R(e,r),t["::type"]="object",(Array.isArray(e.type)&&e.type.includes("null")||e.nullable)&&(t["::dataTypeLabel"]="object or null"),t["::deprecated"]=e.deprecated||!1,t["::readwrite"]=e.readOnly?"readonly":e.writeOnly?"writeonly":"";for(const n in e.properties)e.required&&e.required.includes(n)?t[`${n}*`]=jR(e.properties[n],{},r+1):t[n]=jR(e.properties[n],{},r+1);e.additionalProperties&&(t["<any-key>"]=jR(e.additionalProperties,{}))}else{if("array"!==e.type&&!e.items){const t=xR(e);return null!=t&&t.html?`${t.html}`:""}var i;t["::title"]=e.title||"",t["::description"]=_R(e,r),t["::type"]="array",(Array.isArray(e.type)&&e.type.includes("null")||e.nullable)&&(t["::dataTypeLabel"]="array or null"),t["::deprecated"]=e.deprecated||!1,t["::readwrite"]=e.readOnly?"readonly":e.writeOnly?"writeonly":"",null!==(i=e.items)&&void 0!==i&&i.items&&(t["::array-type"]=e.items.items.type),t["::props"]=jR(e.items,{},r+1)}return t}}function IR(e,t,r="",n="",o=!0,a=!0,i="json",s=!1){const l=[];if(r)for(const e in r){let n="",o="json";if(null!=t&&t.toLowerCase().includes("json")){if("text"===i)n="string"==typeof r[e].value?r[e].value:JSON.stringify(r[e].value,void 0,2),o="text";else if(n=r[e].value,"string"==typeof r[e].value)try{const t=r[e].value;n=JSON.parse(t),o="json"}catch(t){o="text",n=r[e].value}}else n=r[e].value,o="text";l.push({exampleId:e,exampleSummary:r[e].summary||e,exampleDescription:r[e].description||"",exampleType:t,exampleValue:n,exampleFormat:o})}else if(n){let e="",r="json";if(null!=t&&t.toLowerCase().includes("json")){if("text"===i)e="string"==typeof n?n:JSON.stringify(n,void 0,2),r="text";else if("object"==typeof n)e=n,r="json";else if("string"==typeof n)try{e=JSON.parse(n),r="json"}catch(t){r="text",e=n}}else e=n,r="text";l.push({exampleId:"Example",exampleSummary:"",exampleDescription:"",exampleType:t,exampleValue:e,exampleFormat:r})}if(0===l.length||!0===s)if(e)if(e.example)l.push({exampleId:"Example",exampleSummary:"",exampleDescription:"",exampleType:t,exampleValue:e.example,exampleFormat:null!=t&&t.toLowerCase().includes("json")&&"object"==typeof e.example?"json":"text"});else if(null!=t&&t.toLowerCase().includes("json")||null!=t&&t.toLowerCase().includes("text")||null!=t&&t.toLowerCase().includes("*/*")||null!=t&&t.toLowerCase().includes("xml")){let r="",n="",s="",d="";var c,p;if(null!=t&&t.toLowerCase().includes("xml"))r=null!==(c=e.xml)&&void 0!==c&&c.name?`<${e.xml.name} ${e.xml.namespace?`xmlns="${e.xml.namespace}"`:""}>`:"<root>",n=null!==(p=e.xml)&&void 0!==p&&p.name?`</${e.xml.name}>`:"</root>",s="text";else s=i;const u=CR(e,{includeReadOnly:o,includeWriteOnly:a,deprecated:!0,useXmlTagForProp:null==t?void 0:t.toLowerCase().includes("xml")});let h=0;for(const e in u){if(!u[e])continue;const o=u[e]["::TITLE"]||"Example "+ ++h,a=u[e]["::DESCRIPTION"]||"";null!=t&&t.toLowerCase().includes("xml")?d=`<?xml version="1.0" encoding="UTF-8"?>\n${r}${SR(u[e],1)}\n${n}`:(ER(u[e]),d="text"===i?JSON.stringify(u[e],null,2):u[e]),l.push({exampleId:e,exampleSummary:o,exampleDescription:a,exampleType:t,exampleFormat:s,exampleValue:d})}}else null!=t&&t.toLowerCase().includes("jose")?l.push({exampleId:"Example",exampleSummary:"Base64 Encoded",exampleDescription:"",exampleType:t,exampleValue:e.pattern||"bXJpbg==",exampleFormat:"text"}):l.push({exampleId:"Example",exampleSummary:"",exampleDescription:"",exampleType:t,exampleValue:"",exampleFormat:"text"});else l.push({exampleId:"Example",exampleSummary:"",exampleDescription:"",exampleType:t,exampleValue:"",exampleFormat:"text"});return l}function PR(e){return"application/json"===e?"json":"application/xml"===e?"xml":null}function RR(e){if(e.schema)return[e.schema,null,null];if(e.content)for(const t of Object.keys(e.content))if(e.content[t].schema)return[e.content[t].schema,PR(t),e.content[t]];return[null,null,null]}customElements.define("json-tree",class extends et{static get properties(){return{data:{type:Object},renderStyle:{type:String,attribute:"render-style"}}}static get styles(){return[zt,vR,Mt,ie`
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
      }`,Zt]}render(){return Le`
      <div class = "json-tree"  @click='${e=>{e.target.classList.contains("btn-copy")?tr(JSON.stringify(this.data,null,2),e):this.toggleExpand(e)}}'>
        <div class='toolbar'> 
          <button class="toolbar-btn btn-copy" part="btn btn-fill btn-copy"> Copy </button>
        </div>
          ${this.generateTree(this.data,!0)}
      </div>  
    `}generateTree(e,t=!1){if(null===e)return Le`<div class="null" style="display:inline;">null</div>`;if("object"==typeof e&&e instanceof Date==!1){const r=Array.isArray(e)?"array":"pure_object";return 0===Object.keys(e).length?Le`${Array.isArray(e)?"[ ],":"{ },"}`:Le`
      <div class="open-bracket expanded ${"array"===r?"array":"object"}" > ${"array"===r?"[":"{"}</div>
      <div class="inside-bracket">
        ${Object.keys(e).map(((t,n,o)=>Le`
          <div class="item"> 
            ${"pure_object"===r?Le`"${t}":`:""}
            ${this.generateTree(e[t],n===o.length-1)}
          </div>`))}
      </div>
      <div class="close-bracket">${"array"===r?"]":"}"}${t?"":","}</div>
      `}return"string"==typeof e||e instanceof Date?Le`<span class="${typeof e}">"${e}"</span>${t?"":","}`:Le`<span class="${typeof e}">${e}</span>${t?"":","}`}toggleExpand(e){const t=e.target;e.target.classList.contains("open-bracket")&&(t.classList.contains("expanded")?(t.classList.replace("expanded","collapsed"),e.target.innerHTML=e.target.classList.contains("array")?"[...]":"{...}"):(t.classList.replace("collapsed","expanded"),e.target.innerHTML=e.target.classList.contains("array")?"[":"{"))}});const LR=ie`

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
`;customElements.define("schema-tree",class extends et{static get properties(){return{data:{type:Object},schemaExpandLevel:{type:Number,attribute:"schema-expand-level"},schemaDescriptionExpanded:{type:String,attribute:"schema-description-expanded"},allowSchemaDescriptionExpandToggle:{type:String,attribute:"allow-schema-description-expand-toggle"},schemaHideReadOnly:{type:String,attribute:"schema-hide-read-only"},schemaHideWriteOnly:{type:String,attribute:"schema-hide-write-only"}}}connectedCallback(){super.connectedCallback(),(!this.schemaExpandLevel||this.schemaExpandLevel<1)&&(this.schemaExpandLevel=99999),this.schemaDescriptionExpanded&&"true false".includes(this.schemaDescriptionExpanded)||(this.schemaDescriptionExpanded="false"),this.schemaHideReadOnly&&"true false".includes(this.schemaHideReadOnly)||(this.schemaHideReadOnly="true"),this.schemaHideWriteOnly&&"true false".includes(this.schemaHideWriteOnly)||(this.schemaHideWriteOnly="true")}static get styles(){return[zt,LR,vR,ie`
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
      }`,Zt]}render(){var e,t,r;return Le`
      <div class="tree ${"true"===this.schemaDescriptionExpanded?"expanded-all-descr":"collapsed-all-descr"}" @click="${e=>this.handleAllEvents(e)}">
        <div class="toolbar">
          <div class="toolbar-item schema-root-type ${(null===(e=this.data)||void 0===e?void 0:e["::type"])||""} "> ${(null===(t=this.data)||void 0===t?void 0:t["::type"])||""} </div>
          ${"true"===this.allowSchemaDescriptionExpandToggle?Le`
              <div style="flex:1"></div>
              <div part="schema-toolbar-item schema-multiline-toggle" class='toolbar-item schema-multiline-toggle'> 
                ${"true"===this.schemaDescriptionExpanded?"Single line description":"Multiline description"}
              </div>`:""}
        </div>
        <span part="schema-description" class='m-markdown'> ${VP(Ut((null===(r=this.data)||void 0===r?void 0:r["::description"])||""))}</span>
        ${this.data?Le`
            ${this.generateTree("array"===this.data["::type"]?this.data["::props"]:this.data,this.data["::type"],this.data["::array-type"]||"")}`:Le`<span class='mono-font' style='color:var(--red)'> Schema not found </span>`}
      </div>  
    `}generateTree(e,t="object",r="",n="",o="",a=0,i=0,s=""){var l;if("true"===this.schemaHideReadOnly){if("array"===t&&"readonly"===s)return;if("readonly"===(null==e?void 0:e["::readwrite"]))return}if("true"===this.schemaHideWriteOnly){if("array"===t&&"writeonly"===s)return;if("writeonly"===(null==e?void 0:e["::readwrite"]))return}if(!e)return Le`<div class="null" style="display:inline;">
        <span class="key-label xxx-of-key"> ${n.replace("::OPTION~","")}</span>
        ${"array"===t?Le`<span class='mono-font'> [ ] </span>`:"object"===t?Le`<span class='mono-font'> { } </span>`:Le`<span class='mono-font'> schema undefined </span>`}
      </div>`;if(0===Object.keys(e).length)return Le`<span class="key object">${n}:{ }</span>`;let c="",p="";if(n.startsWith("::ONE~OF")||n.startsWith("::ANY~OF"))c=n.replace("::","").replace("~"," ");else if(n.startsWith("::OPTION")){const e=n.split("~");[,c,p]=e}else c=n;const d=400-12*i;let u="",h="";const f=null!==(l=e["::type"])&&void 0!==l&&l.startsWith("xxx-of")?a:a+1,m="xxx-of-option"===t||"xxx-of-option"===e["::type"]||n.startsWith("::OPTION")?i:i+1;if("object"===e["::type"])"array"===t?(u=a<this.schemaExpandLevel?Le`<span class="open-bracket array-of-object" >[{</span>`:Le`<span class="open-bracket array-of-object">[{...}]</span>`,h="}]"):(u=a<this.schemaExpandLevel?Le`<span class="open-bracket object">{</span>`:Le`<span class="open-bracket object">{...}</span>`,h="}");else if("array"===e["::type"])if("array"===t){const e="object"!==r?r:"";u=a<this.schemaExpandLevel?Le`<span class="open-bracket array-of-array" data-array-type="${e}">[[ ${e} </span>`:Le`<span class="open-bracket array-of-array"  data-array-type="${e}">[[...]]</span>`,h="]]"}else u=a<this.schemaExpandLevel?Le`<span class="open-bracket array">[</span>`:Le`<span class="open-bracket array">[...]</span>`,h="]";var y;if("object"==typeof e)return Le`
        <div class="tr ${a<this.schemaExpandLevel||null!==(y=e["::type"])&&void 0!==y&&y.startsWith("xxx-of")?"expanded":"collapsed"} ${e["::type"]||"no-type-info"}" title="${e["::deprecated"]?"Deprecated":""}">
          <div class="td key ${e["::deprecated"]?"deprecated":""}" style='min-width:${d}px'>
            ${"xxx-of-option"===e["::type"]||"xxx-of-array"===e["::type"]||n.startsWith("::OPTION")?Le`<span class='key-label xxx-of-key'> ${c}</span><span class="xxx-of-descr">${p}</span>`:"::props"===c||"::ARRAY~OF"===c?"":a>0?Le`<span class="key-label" title="${"readonly"===s?"Read-Only":"writeonly"===s?"Write-Only":""}">
                      ${e["::deprecated"]?"✗":""}
                      ${c.replace(/\*$/,"")}${c.endsWith("*")?Le`<span style="color:var(--red)">*</span>`:""}${"readonly"===s?Le` 🆁`:"writeonly"===s?Le` 🆆`:s}:
                    </span>`:""}
            ${u}
          </div>
          <div class='td key-descr m-markdown-small'>${VP(Ut(o||""))}</div>
        </div>
        <div class='inside-bracket ${e["::type"]||"no-type-info"}' style='padding-left:${"xxx-of-option"===e["::type"]||"xxx-of-array"===e["::type"]?0:12}px;'>
          ${Array.isArray(e)&&e[0]?Le`${this.generateTree(e[0],"xxx-of-option","","::ARRAY~OF","",f,m,e[0]["::readwrite"])}`:Le`
              ${Object.keys(e).map((t=>{var r;return Le`
                ${["::title","::description","::type","::props","::deprecated","::array-type","::readwrite","::dataTypeLabel"].includes(t)?"array"===e[t]["::type"]||"object"===e[t]["::type"]?Le`${this.generateTree("array"===e[t]["::type"]?e[t]["::props"]:e[t],e[t]["::type"],e[t]["::array-type"]||"",t,e[t]["::description"],f,m,e[t]["::readwrite"]?e[t]["::readwrite"]:"")}`:"":Le`${this.generateTree("array"===e[t]["::type"]?e[t]["::props"]:e[t],e[t]["::type"],e[t]["::array-type"]||"",t,(null===(r=e[t])||void 0===r?void 0:r["::description"])||"",f,m,e[t]["::readwrite"]?e[t]["::readwrite"]:"")}`}
              `}))}
            `}
        </div>
        ${e["::type"]&&e["::type"].includes("xxx-of")?"":Le`<div class='close-bracket'> ${h} </div>`}
      `;const[g,v,b,x,w,$,k,S,A]=e.split("~|~");if("🆁"===v&&"true"===this.schemaHideReadOnly)return;if("🆆"===v&&"true"===this.schemaHideWriteOnly)return;const E=g.replace(/┃.*/g,"").replace(/[^a-zA-Z0-9+]/g,"").substring(0,4).toLowerCase(),O=""+(b||x||w||$?`<span class="descr-expand-toggle ${"true"===this.schemaDescriptionExpanded?"expanded-descr":""}">➔</span>`:"");let T="",C="";return"array"===t?"readonly"===s?(T="🆁",C="Read-Only"):"writeonly"===s&&(T="🆆",C="Write-Only"):"🆁"===v?(T="🆁",C="Read-Only"):"🆆"===v&&(T="🆆",C="Write-Only"),Le`
      <div class = "tr primitive" title="${A?"Deprecated":""}">
        <div class="td key ${A}" style='min-width:${d}px'>
          ${A?Le`<span style='color:var(--red);'>✗</span>`:""}
          ${c.endsWith("*")?Le`<span class="key-label">${c.substring(0,c.length-1)}</span><span style='color:var(--red);'>*</span>:`:n.startsWith("::OPTION")?Le`<span class='key-label xxx-of-key'>${c}</span><span class="xxx-of-descr">${p}</span>`:Le`<span class="key-label">${c}:</span>`}
          <span class="${E}" title="${C}"> 
            ${"array"===t?`[${g}]`:`${g}`}
            ${T}
          </span>
        </div>
        <div class='td key-descr'>
          ${o||S||k?Le`${Le`<span class="m-markdown-small">
                ${VP(Ut("array"===t?`${O} ${o}`:S?`${O} <b>${S}:</b> ${k}`:`${O} ${k}`))}
              </span>`}`:""}  
          ${b?Le`<div style='display:inline-block; line-break:anywhere; margin-right:8px'><span class='bold-text'>Constraints: </span>${b}</div>`:""}
          ${x?Le`<div style='display:inline-block; line-break:anywhere; margin-right:8px'><span class='bold-text'>Default: </span>${x}</div>`:""}
          ${w?Le`<div style='display:inline-block; line-break:anywhere; margin-right:8px'><span class='bold-text'>${"const"===g?"Value":"Allowed"}: </span>${w}</div>`:""}
          ${$?Le`<div style='display:inline-block; line-break: anywhere; margin-right:8px'><span class='bold-text'>Pattern: </span>${$}</div>`:""}
        </div>
      </div>
    `}handleAllEvents(e){if(e.target.classList.contains("open-bracket"))this.toggleObjectExpand(e);else if(e.target.classList.contains("schema-multiline-toggle"))this.schemaDescriptionExpanded="true"===this.schemaDescriptionExpanded?"false":"true";else if(e.target.classList.contains("descr-expand-toggle")){const t=e.target.closest(".tr");t&&(t.classList.toggle("expanded-descr"),t.style.maxHeight=t.scrollHeight)}}toggleObjectExpand(e){const t=e.target.closest(".tr");t.classList.contains("expanded")?(t.classList.replace("expanded","collapsed"),e.target.innerHTML=e.target.classList.contains("array-of-object")?"[{...}]":e.target.classList.contains("array-of-array")?"[[...]]":e.target.classList.contains("array")?"[...]":"{...}"):(t.classList.replace("collapsed","expanded"),e.target.innerHTML=e.target.classList.contains("array-of-object")?"[{":e.target.classList.contains("array-of-array")?`[[ ${e.target.dataset.arrayType}`:e.target.classList.contains("object")?"{":"[")}});customElements.define("tag-input",class extends et{render(){let e="";return Array.isArray(this.value)&&(e=Le`${this.value.filter((e=>"string"==typeof e&&""!==e.trim())).map((e=>Le`<span class='tag'>${e}</span>`))}`),Le`
      <div class='tags'>
        ${e}
        <input type="text" class='editor' @paste="${e=>this.afterPaste(e)}" @keydown="${this.afterKeyDown}" @blur="${this.onBlur}" placeholder="${this.placeholder||""}">
      </div>
    `}static get properties(){return{placeholder:{type:String},value:{type:Array,attribute:"value"}}}attributeChangedCallback(e,t,r){"value"===e&&r&&t!==r&&(this.value=r.split(",").filter((e=>""!==e.trim()))),super.attributeChangedCallback(e,t,r)}afterPaste(e){const t=(e.clipboardData||window.clipboardData).getData("Text"),r=t?t.split(",").filter((e=>""!==e.trim())):"";r&&(Array.isArray(this.value)?this.value=[...this.value,...r]:this.value=r),e.preventDefault()}afterKeyDown(e){13===e.keyCode?(e.stopPropagation(),e.preventDefault(),e.target.value&&(Array.isArray(this.value)?this.value=[...this.value,e.target.value]:this.value=[e.target.value],e.target.value="")):8===e.keyCode&&0===e.target.value.length&&Array.isArray(this.value)&&this.value.length>0&&(this.value.splice(-1),this.value=[...this.value])}onBlur(e){e.target.value&&(Array.isArray(this.value)?this.value=[...this.value,e.target.value]:this.value=[e.target.value],e.target.value="")}static get styles(){return[ie`
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
    `]}});customElements.define("api-request",class extends et{constructor(){super(),this.responseMessage="",this.responseStatus="success",this.responseHeaders="",this.responseText="",this.responseUrl="",this.curlSyntax="",this.activeResponseTab="response",this.selectedRequestBodyType="",this.selectedRequestBodyExample="",this.activeParameterSchemaTabs={}}static get properties(){return{serverUrl:{type:String,attribute:"server-url"},servers:{type:Array},method:{type:String},path:{type:String},security:{type:Array},parameters:{type:Array},request_body:{type:Object},api_keys:{type:Array},parser:{type:Object},accept:{type:String},callback:{type:String},webhook:{type:String},responseMessage:{type:String,attribute:!1},responseText:{type:String,attribute:!1},responseHeaders:{type:String,attribute:!1},responseStatus:{type:String,attribute:!1},responseUrl:{type:String,attribute:!1},curlSyntax:{type:String,attribute:!1},fillRequestFieldsWithExample:{type:String,attribute:"fill-request-fields-with-example"},allowTry:{type:String,attribute:"allow-try"},showCurlBeforeTry:{type:String,attribute:"show-curl-before-try"},renderStyle:{type:String,attribute:"render-style"},schemaStyle:{type:String,attribute:"schema-style"},activeSchemaTab:{type:String,attribute:"active-schema-tab"},activeParameterSchemaTabs:{type:Object,converter:{fromAttribute:e=>JSON.parse(e),toAttribute:e=>JSON.stringify(e)},attribute:"active-parameter-schema-tabs"},schemaExpandLevel:{type:Number,attribute:"schema-expand-level"},schemaDescriptionExpanded:{type:String,attribute:"schema-description-expanded"},allowSchemaDescriptionExpandToggle:{type:String,attribute:"allow-schema-description-expand-toggle"},schemaHideReadOnly:{type:String,attribute:"schema-hide-read-only"},schemaHideWriteOnly:{type:String,attribute:"schema-hide-write-only"},fetchCredentials:{type:String,attribute:"fetch-credentials"},activeResponseTab:{type:String},selectedRequestBodyType:{type:String,attribute:"selected-request-body-type"},selectedRequestBodyExample:{type:String,attribute:"selected-request-body-example"}}}static get styles(){return[Wt,Mt,zt,Ht,vR,Kt,Gt,ie`
        *, *:before, *:after { box-sizing: border-box; }
        :where(button, input[type="checkbox"], [tabindex="0"]):focus-visible { box-shadow: var(--focus-shadow); }
        :where(input[type="text"], input[type="password"], select, textarea):focus-visible { border-color: var(--primary-color); }
        tag-input:focus-within { outline: 1px solid;}
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
      `,Zt]}render(){return Le`
    <div class="col regular-font request-panel ${"read focused".includes(this.renderStyle)||"true"===this.callback?"read-mode":"view-mode"}">
      <div class=" ${"true"===this.callback?"tiny-title":"req-res-title"} "> 
        ${"true"===this.callback?"CALLBACK REQUEST":"REQUEST"}
      </div>
      <div>
        ${uR([this.method,this.path,this.allowTry,this.parameters,this.activeParameterSchemaTabs],(()=>this.inputParametersTemplate("path")))}
        ${uR([this.method,this.path,this.allowTry,this.parameters,this.activeParameterSchemaTabs],(()=>this.inputParametersTemplate("query")))}
        ${this.requestBodyTemplate()}
        ${uR([this.method,this.path,this.allowTry,this.parameters,this.activeParameterSchemaTabs],(()=>this.inputParametersTemplate("header")))}
        ${uR([this.method,this.path,this.allowTry,this.parameters,this.activeParameterSchemaTabs],(()=>this.inputParametersTemplate("cookie")))}
        ${"false"===this.allowTry?"":Le`${this.apiCallTemplate()}`}
      </div>  
    </div>
    `}async updated(){"true"===this.showCurlBeforeTry&&this.applyCURLSyntax(this.shadowRoot)}async saveExampleState(){if("focused"===this.renderStyle){[...this.shadowRoot.querySelectorAll("textarea.request-body-param-user-input")].forEach((e=>{e.dataset.user_example=e.value}));[...this.shadowRoot.querySelectorAll('textarea[data-ptype="form-data"]')].forEach((e=>{e.dataset.user_example=e.value})),this.requestUpdate()}}async updateExamplesFromDataAttr(){if("focused"===this.renderStyle){[...this.shadowRoot.querySelectorAll("textarea.request-body-param-user-input")].forEach((e=>{e.value=e.dataset.user_example||e.dataset.example}));[...this.shadowRoot.querySelectorAll('textarea[data-ptype="form-data"]')].forEach((e=>{e.value=e.dataset.user_example||e.dataset.example})),this.requestUpdate()}}renderExample(e,t,r){var n;return Le`
      ${"array"===t?"[":""}
      <a
        part="anchor anchor-param-example"
        style="display:inline-block; min-width:24px; text-align:center"
        class="${"true"===this.allowTry?"":"inactive-link"}"
        data-example-type="${"array"===t?t:"string"}"
        data-example="${e.value&&Array.isArray(e.value)?null===(n=e.value)||void 0===n?void 0:n.join("~|~"):e.value||""}"
        @click="${e=>{const t=e.target.closest("table").querySelector(`[data-pname="${r}"]`);t&&(t.value="array"===e.target.dataset.exampleType?e.target.dataset.example.split("~|~"):e.target.dataset.example)}}"
      > ${e.printableValue||e.value} </a>
      ${"array"===t?"] ":""}
    `}renderShortFormatExamples(e,t,r){return Le`${e.map(((e,n)=>Le`
      ${0===n?"":"┃"}
      ${this.renderExample(e,t,r)}`))}`}renderLongFormatExamples(e,t,r){return Le` <ul style="list-style-type: disclosure-closed;">
      ${e.map((e=>{var n,o;return Le`
          <li>
            ${this.renderExample(e,t,r)}
            ${(null===(n=e.summary)||void 0===n?void 0:n.length)>0?Le`<span>&lpar;${e.summary}&rpar;</span>`:""}
            ${(null===(o=e.description)||void 0===o?void 0:o.length)>0?Le`<p>${VP(Ut(e.description))}</p>`:""}
          </li>
        `}))}
    </ul>`}exampleListTemplate(e,t,r=[]){return Le` ${r.length>0?Le`<span style="font-weight:bold">Examples: </span>
          ${n=r,n.some((e=>{var t,r;return(null===(t=e.summary)||void 0===t?void 0:t.length)>0||(null===(r=e.description)||void 0===r?void 0:r.length)>0}))?this.renderLongFormatExamples(r,t,e):this.renderShortFormatExamples(r,t,e)}`:""}`;var n}inputParametersTemplate(e){const t=this.parameters?this.parameters.filter((t=>t.in===e)):[];if(0===t.length)return"";let r="";"path"===e?r="PATH PARAMETERS":"query"===e?r="QUERY-STRING PARAMETERS":"header"===e?r="REQUEST HEADERS":"cookie"===e&&(r="COOKIES");const n=[];for(const r of t){const[t,o,a]=RR(r);if(!t)continue;const i=xR(t);if(!i)continue;const s=jR(t,{});let l="form",c=!0,p=!1;"query"===e&&(r.style&&"form spaceDelimited pipeDelimited".includes(r.style)?l=r.style:o&&(l=o),"boolean"==typeof r.explode&&(c=r.explode),"boolean"==typeof r.allowReserved&&(p=r.allowReserved));const d=$R(r.examples||wR(r.example)||wR(null==a?void 0:a.example)||(null==a?void 0:a.examples)||wR(i.examples)||wR(i.example),i.type);d.exampleVal||"object"!==i.type||(d.exampleVal=IR(t,o||"json","","","true"===this.callback||"true"===this.webhook,"true"!==this.callback&&"true"!==this.webhook,!0,"text")[0].exampleValue);const u="read focused".includes(this.renderStyle)?"200px":"160px";n.push(Le`
      <tr title="${r.deprecated?"Deprecated":""}"> 
        <td rowspan="${"true"===this.allowTry?"1":"2"}" style="width:${u}; min-width:100px;">
          <div class="param-name ${r.deprecated?"deprecated":""}" >
            ${r.deprecated?Le`<span style='color:var(--red);'>✗</span>`:""}
            ${r.required?Le`<span style='color:var(--red)'>*</span>`:""}
            ${r.name}
          </div>
          <div class="param-type">
            ${"array"===i.type?`${i.arrayType}`:`${i.format?i.format:i.type}`}
          </div>
        </td>  
        ${"true"===this.allowTry?Le`
            <td style="min-width:100px;" colspan="${i.default||i.constrain||i.allowedValues||i.pattern?"1":"2"}">
              ${"array"===i.type?Le`
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
                    .value="${"no"===r["x-fill-example"]?[]:mR("true"===this.fillRequestFieldsWithExample?Array.isArray(d.exampleVal)?d.exampleVal:[d.exampleVal]:[])}"
                  >
                  </tag-input>`:"object"===i.type?Le`
                    <div class="tab-panel col" style="border-width:0 0 1px 0;">
                      <div class="tab-buttons row" @click="${e=>{if("button"===e.target.tagName.toLowerCase()){const t={...this.activeParameterSchemaTabs};t[r.name]=e.target.dataset.tab,this.activeParameterSchemaTabs=t}}}">
                        <button class="tab-btn ${"example"===this.activeParameterSchemaTabs[r.name]?"active":""}" data-tab = 'example'>EXAMPLE </button>
                        <button class="tab-btn ${"example"!==this.activeParameterSchemaTabs[r.name]?"active":""}" data-tab = 'schema'>SCHEMA</button>
                      </div>
                      ${"example"===this.activeParameterSchemaTabs[r.name]?Le`<div class="tab-content col">
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
                            .textContent="${"no"===r["x-fill-example"]?"":mR("true"===this.fillRequestFieldsWithExample?d.exampleVal:"")}"
                            style = "resize:vertical; width:100%; height: ${"read focused".includes(this.renderStyle)?"180px":"120px"};"
                            @input=${e=>{const t=this.getRequestPanel(e);this.liveCURLSyntaxUpdate(t)}}
                          ></textarea>
                        </div>`:Le`
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
                    </div>`:Le`
                    <input type="${"password"===i.format?"password":"text"}" spellcheck="false" style="width:100%" 
                      class="request-param"
                      part="textbox textbox-param"
                      data-ptype="${e}"
                      data-pname="${r.name}" 
                      data-example="${Array.isArray(d.exampleVal)?d.exampleVal.join("~|~"):d.exampleVal}"
                      data-param-allow-reserved = "${p}"
                      data-x-fill-example = "${r["x-fill-example"]||"yes"}"
                      data-array="false"
                      .value="${"no"===r["x-fill-example"]?"":mR("true"===this.fillRequestFieldsWithExample?d.exampleVal:"")}"
                      @input=${e=>{const t=this.getRequestPanel(e);this.liveCURLSyntaxUpdate(t)}}
                    />`}
            </td>`:""}
        ${i.default||i.constrain||i.allowedValues||i.pattern?Le`
            <td colspan="${"true"===this.allowTry?"1":"2"}">
              <div class="param-constraint">
                ${i.default?Le`<span style="font-weight:bold">Default: </span>${i.default}<br/>`:""}
                ${i.pattern?Le`<span style="font-weight:bold">Pattern: </span>${i.pattern}<br/>`:""}
                ${i.constrain?Le`${i.constrain}<br/>`:""}
                ${i.allowedValues&&i.allowedValues.split("┃").map(((e,t)=>Le`
                  ${t>0?"┃":Le`<span style="font-weight:bold">Allowed: </span>`}
                  ${Le`
                    <a part="anchor anchor-param-constraint" class = "${"true"===this.allowTry?"":"inactive-link"}"
                      data-type="${"array"===i.type?i.type:"string"}"
                      data-enum="${e.trim()}"
                      @click="${e=>{const t=e.target.closest("table").querySelector(`[data-pname="${r.name}"]`);t&&("array"===e.target.dataset.type?t.value=[e.target.dataset.enum]:t.value=e.target.dataset.enum)}}"
                    >${e}</a>`}`))}
              </div>
            </td>`:Le`<td></td>`}
      </tr>
      <tr>
        ${"true"===this.allowTry?Le`<td style="border:none"> </td>`:""}
        <td colspan="2" style="border:none">
          <span class="m-markdown-small">${VP(Ut(r.description||""))}</span>
          ${this.exampleListTemplate.call(this,r.name,i.type,d.exampleList)}
        </td>
      </tr>
    `)}return Le`
    <div class="table-title top-gap">${r}</div>
    <div style="display:block; overflow-x:auto; max-width:100%;">
      <table role="presentation" class="m-table" style="width:100%; word-break:break-word;">
        ${n}
      </table>
    </div>`}async beforerNavigationFocusedMode(){}async afterNavigationFocusedMode(){this.selectedRequestBodyType="",this.selectedRequestBodyExample="",this.updateExamplesFromDataAttr(),this.clearResponseData()}onSelectExample(e){this.selectedRequestBodyExample=e.target.value;const t=e.target;window.setTimeout((e=>{const t=e.closest(".example-panel").querySelector(".request-body-param");e.closest(".example-panel").querySelector(".request-body-param-user-input").value=t.innerText;const r=this.getRequestPanel({target:e});this.liveCURLSyntaxUpdate(r)}),0,t)}onMimeTypeChange(e){this.selectedRequestBodyType=e.target.value;const t=e.target;this.selectedRequestBodyExample="",window.setTimeout((e=>{const t=e.closest(".request-body-container").querySelector(".request-body-param");if(t){e.closest(".request-body-container").querySelector(".request-body-param-user-input").value=t.innerText}}),0,t)}requestBodyTemplate(){if(!this.request_body)return"";if(0===Object.keys(this.request_body).length)return"";let e="",t="",r="",n="",o="";const a=[],{content:i}=this.request_body;for(const e in i)a.push({mimeType:e,schema:i[e].schema,example:i[e].example,examples:i[e].examples}),this.selectedRequestBodyType||(this.selectedRequestBodyType=e);return e=1===a.length?"":Le`
        <select style="min-width:100px; max-width:100%;  margin-bottom:-1px;" @change = '${e=>this.onMimeTypeChange(e)}'>
          ${a.map((e=>Le`
            <option value = '${e.mimeType}' ?selected = '${e.mimeType===this.selectedRequestBodyType}'>
              ${e.mimeType}
            </option> `))}
        </select>
      `,a.forEach((e=>{let a,i=[];if(this.selectedRequestBodyType.includes("json")||this.selectedRequestBodyType.includes("xml")||this.selectedRequestBodyType.includes("text")||this.selectedRequestBodyType.includes("jose"))e.mimeType===this.selectedRequestBodyType&&(i=IR(e.schema,e.mimeType,e.examples,e.example,"true"===this.callback||"true"===this.webhook,"true"!==this.callback&&"true"!==this.webhook,"text",!1),this.selectedRequestBodyExample||(this.selectedRequestBodyExample=i.length>0?i[0].exampleId:""),o=Le`
            ${o}
            <div class = 'example-panel border-top pad-top-8'>
              ${1===i.length?"":Le`
                  <select style="min-width:100px; max-width:100%;  margin-bottom:-1px;" @change='${e=>this.onSelectExample(e)}'>
                    ${i.map((e=>Le`<option value="${e.exampleId}" ?selected=${e.exampleId===this.selectedRequestBodyExample} > 
                      ${e.exampleSummary.length>80?e.exampleId:e.exampleSummary?e.exampleSummary:e.exampleId} 
                    </option>`))}
                  </select>
                `}
              ${i.filter((e=>e.exampleId===this.selectedRequestBodyExample)).map((t=>Le`
                <div class="example ${t.exampleId===this.selectedRequestBodyExample?"example-selected":""}" data-example = '${t.exampleId}'>
                  ${t.exampleSummary&&t.exampleSummary.length>80?Le`<div style="padding: 4px 0"> ${t.exampleSummary} </div>`:""}
                  ${t.exampleDescription?Le`<div class="m-markdown-small" style="padding: 4px 0"> ${VP(Ut(t.exampleDescription||""))} </div>`:""}
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
          `);else if(this.selectedRequestBodyType.includes("form-urlencoded")||this.selectedRequestBodyType.includes("form-data")){if(e.mimeType===this.selectedRequestBodyType){const t=IR(e.schema,e.mimeType,e.examples,e.example,"true"===this.callback||"true"===this.webhook,"true"!==this.callback&&"true"!==this.webhook,"text",!1);e.schema&&(r=this.formDataTemplate(e.schema,e.mimeType,t[0]?t[0].exampleValue:""))}}else/^audio\/|^image\/|^video\/|^font\/|tar$|zip$|7z$|rtf$|msword$|excel$|\/pdf$|\/octet-stream$/.test(this.selectedRequestBodyType)&&e.mimeType===this.selectedRequestBodyType&&(t=Le`
            <div class = "small-font-size bold-text row">
              <input type="file" part="file-input" style="max-width:100%" class="request-body-param-file" data-ptype="${e.mimeType}" spellcheck="false" />
            </div>  
          `);(e.mimeType.includes("json")||e.mimeType.includes("xml")||e.mimeType.includes("text")||this.selectedRequestBodyType.includes("jose"))&&(a=jR(e.schema,{}),"table"===this.schemaStyle?n=Le`
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
          `:"tree"===this.schemaStyle&&(n=Le`
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
          `))})),Le`
      <div class='request-body-container' data-selected-request-body-type="${this.selectedRequestBodyType}">
        <div class="table-title top-gap row">
          REQUEST BODY ${this.request_body.required?Le`<span class="mono-font" style='color:var(--red)'>*</span>`:""} 
          <span style = "font-weight:normal; margin-left:5px"> ${this.selectedRequestBodyType}</span>
          <span style="flex:1"></span>
          ${e}
        </div>
        ${this.request_body.description?Le`<div class="m-markdown" style="margin-bottom:12px">${VP(Ut(this.request_body.description))}</div>`:""}
        
        ${this.selectedRequestBodyType.includes("json")||this.selectedRequestBodyType.includes("xml")||this.selectedRequestBodyType.includes("text")||this.selectedRequestBodyType.includes("jose")?Le`
            <div class="tab-panel col" style="border-width:0 0 1px 0;">
              <div class="tab-buttons row" @click="${e=>{"button"===e.target.tagName.toLowerCase()&&(this.activeSchemaTab=e.target.dataset.tab)}}">
                <button class="tab-btn ${"example"===this.activeSchemaTab?"active":""}" data-tab = 'example'>EXAMPLE</button>
                <button class="tab-btn ${"example"!==this.activeSchemaTab?"active":""}" data-tab = 'schema'>SCHEMA</button>
              </div>
              ${Le`<div class="tab-content col" style="display:${"example"===this.activeSchemaTab?"block":"none"};"> ${o}</div>`}
              ${Le`<div class="tab-content col" style="display:${"example"===this.activeSchemaTab?"none":"block"};"> ${n}</div>`}
            </div>`:Le`  
            ${t}
            ${r}`}
      </div>  
    `}formDataParamAsObjectTemplate(e,t,r){var n;const o=jR(t,{}),a=IR(t,"json",t.examples,t.example,"true"===this.callback||"true"===this.webhook,"true"!==this.callback&&"true"!==this.webhook,"text",!1);return Le`
      <div class="tab-panel row" style="min-height:220px; border-left: 6px solid var(--light-border-color); align-items: stretch;">
        <div style="width:24px; background-color:var(--light-border-color)">
          <div class="row" style="flex-direction:row-reverse; width:160px; height:24px; transform:rotate(270deg) translateX(-160px); transform-origin:top left; display:block;" @click="${e=>{if(e.target.classList.contains("v-tab-btn")){const{tab:t}=e.target.dataset;if(t){const r=e.target.closest(".tab-panel"),n=r.querySelector(`.v-tab-btn[data-tab="${t}"]`),o=[...r.querySelectorAll(`.v-tab-btn:not([data-tab="${t}"])`)],a=r.querySelector(`.tab-content[data-tab="${t}"]`),i=[...r.querySelectorAll(`.tab-content:not([data-tab="${t}"])`)];n.classList.add("active"),a.style.display="block",o.forEach((e=>{e.classList.remove("active")})),i.forEach((e=>{e.style.display="none"}))}}"button"===e.target.tagName.toLowerCase()&&(this.activeSchemaTab=e.target.dataset.tab)}}">
          <button class="v-tab-btn ${"example"===this.activeSchemaTab?"active":""}" data-tab = 'example'>EXAMPLE</button>
          <button class="v-tab-btn ${"example"!==this.activeSchemaTab?"active":""}" data-tab = 'schema'>SCHEMA</button>
        </div>
      </div>
      ${Le`
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
      ${Le`
        <div class="tab-content col" data-tab = 'schema' style="display:${"example"!==this.activeSchemaTab?"block":"none"}; padding-left:5px; width:100%;"> 
          <schema-tree
            .data = '${o}'
            schema-expand-level = "${this.schemaExpandLevel}"
            schema-description-expanded = "${this.schemaDescriptionExpanded}"
            allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}",
          > </schema-tree>
        </div>`}
      </div>
    `}formDataTemplate(e,t,r=""){const n=[];if(e.properties){for(const r in e.properties){var o,a;const i=e.properties[r];if(i.readOnly)continue;const s=i.examples||i.example||"",l=i.type,c=xR(i),p="read focused".includes(this.renderStyle)?"200px":"160px",d=$R(c.examples||c.example,c.type);n.push(Le`
        <tr title="${i.deprecated?"Deprecated":""}"> 
          <td style="width:${p}; min-width:100px;">
            <div class="param-name ${i.deprecated?"deprecated":""}">
              ${r}${null!==(o=e.required)&&void 0!==o&&o.includes(r)||i.required?Le`<span style='color:var(--red);'>*</span>`:""}
            </div>
            <div class="param-type">${c.type}</div>
          </td>  
          <td 
            style="${"object"===l?"width:100%; padding:0;":"true"===this.allowTry?"":"display:none;"} min-width:100px;" 
            colspan="${"object"===l?2:1}">
            ${"array"===l?"binary"===(null===(a=i.items)||void 0===a?void 0:a.format)?Le`
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
                `:Le`
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
                `:Le`
                ${"object"===l?this.formDataParamAsObjectTemplate.call(this,r,i,t):Le`
                    ${"true"===this.allowTry?Le`<input
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
          ${"object"===l?"":Le`
              <td>
                ${c.default||c.constrain||c.allowedValues||c.pattern?Le`
                    <div class="param-constraint">
                      ${c.default?Le`<span style="font-weight:bold">Default: </span>${c.default}<br/>`:""}
                      ${c.pattern?Le`<span style="font-weight:bold">Pattern: </span>${c.pattern}<br/>`:""}
                      ${c.constrain?Le`${c.constrain}<br/>`:""}
                      ${c.allowedValues&&c.allowedValues.split("┃").map(((e,t)=>Le`
                        ${t>0?"┃":Le`<span style="font-weight:bold">Allowed: </span>`}
                        ${Le`
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
        ${"object"===l?"":Le`
            <tr>
              <td style="border:none"> </td>
              <td colspan="2" style="border:none; margin-top:0; padding:0 5px 8px 5px;"> 
                <span class="m-markdown-small">${VP(Ut(i.description||""))}</span>
                ${this.exampleListTemplate.call(this,r,c.type,d.exampleList)}
              </td>
            </tr>
          `}`)}return Le`
        <table role="presentation" style="width:100%;" class="m-table">
          ${n}
        </table>
      `}return Le`
      <textarea
        class = "textarea dynamic-form-param ${t}"
        part = "textarea textarea-param"
        spellcheck = "false"
        data-pname="dynamic-form" 
        data-ptype="${t}"
        .textContent = "${r}"
        style="width:100%"
      ></textarea>
      ${e.description?Le`<span class="m-markdown-small">${VP(Ut(e.description))}</span>`:""}
    `}curlSyntaxTemplate(e="flex"){return Le`
      <div class="col m-markdown" style="flex:1; display:${e}; position:relative; max-width: 100%;">
        <button  class="toolbar-btn" style = "position:absolute; top:12px; right:8px" @click='${e=>{tr(this.curlSyntax.replace(/\\$/,""),e)}}' part="btn btn-fill"> Copy </button>
        <pre style="white-space:pre-wrap"><code>${VP(qt().highlight(this.curlSyntax.trim().replace(/\\$/,""),qt().languages.shell,"shell"))}</code></pre>
      </div>
      `}apiResponseTabTemplate(){let e="",t="";if(!this.responseIsBlob)if(this.responseHeaders.includes("application/x-ndjson")){e="json";const r=this.responseText.split("\n").map((t=>qt().highlight(t,qt().languages[e],e))).join("\n");t=Le`<code>${VP(r)}</code>`}else this.responseHeaders.includes("json")?(e="json",t=Le`<code>${VP(qt().highlight(this.responseText,qt().languages[e],e))}</code>`):this.responseHeaders.includes("html")||this.responseHeaders.includes("xml")?(e="html",t=Le`<code>${VP(qt().highlight(this.responseText,qt().languages[e],e))}</code>`):(e="text",t=Le`<code>${this.responseText}</code>`);return Le`
      <div class="row" style="font-size:var(--font-size-small); margin:5px 0">
        <div class="response-message ${this.responseStatus}">Response Status: ${this.responseMessage}</div>
        <div style="flex:1"></div>
        <button class="m-btn" part="btn btn-outline btn-clear-response" @click="${this.clearResponseData}">CLEAR RESPONSE</button>
      </div>
      <div class="tab-panel col" style="border-width:0 0 1px 0;">
        <div id="tab_buttons" class="tab-buttons row" @click="${e=>{!1!==e.target.classList.contains("tab-btn")&&(this.activeResponseTab=e.target.dataset.tab)}}">
          <button class="tab-btn ${"response"===this.activeResponseTab?"active":""}" data-tab = 'response' > RESPONSE</button>
          <button class="tab-btn ${"headers"===this.activeResponseTab?"active":""}"  data-tab = 'headers' > RESPONSE HEADERS</button>
          ${"true"===this.showCurlBeforeTry?"":Le`<button class="tab-btn ${"curl"===this.activeResponseTab?"active":""}" data-tab = 'curl'>CURL</button>`}
        </div>
        ${this.responseIsBlob?Le`
            <div class="tab-content col" style="flex:1; display:${"response"===this.activeResponseTab?"flex":"none"};">
              <button class="m-btn thin-border mar-top-8" style="width:135px" @click='${e=>{or(this.responseBlobUrl,this.respContentDisposition)}}' part="btn btn-outline">
                DOWNLOAD
              </button>
              ${"view"===this.responseBlobType?Le`<button class="m-btn thin-border mar-top-8" style="width:135px"  @click='${e=>{ar(this.responseBlobUrl)}}' part="btn btn-outline">VIEW (NEW TAB)</button>`:""}
            </div>`:Le`
            <div class="tab-content col m-markdown" style="flex:1; display:${"response"===this.activeResponseTab?"flex":"none"};" >
              <button class="toolbar-btn" style="position:absolute; top:12px; right:8px" @click='${e=>{tr(this.responseText,e)}}' part="btn btn-fill"> Copy </button>
              <pre style="white-space:pre; min-height:50px; height:var(--resp-area-height, 400px); resize:vertical; overflow:auto">${t}</pre>
            </div>`}
        <div class="tab-content col m-markdown" style="flex:1; display:${"headers"===this.activeResponseTab?"flex":"none"};" >
          <button  class="toolbar-btn" style = "position:absolute; top:12px; right:8px" @click='${e=>{tr(this.responseHeaders,e)}}' part="btn btn-fill"> Copy </button>
          <pre style="white-space:pre"><code>${VP(qt().highlight(this.responseHeaders,qt().languages.css,"css"))}</code></pre>
        </div>
        ${"true"===this.showCurlBeforeTry?"":this.curlSyntaxTemplate("curl"===this.activeResponseTab?"flex":"none")}
      </div>`}apiCallTemplate(){var e,t;let r="";this.servers&&this.servers.length>0&&(r=Le`
        <select style="min-width:100px;" @change='${e=>{this.serverUrl=e.target.value}}'>
          ${this.servers.map((e=>Le`<option value = "${e.url}"> ${e.url} - ${e.description} </option>`))}
        </select>
      `);const n=Le`
      <div style="display:flex; flex-direction:column;">
        ${r}
        ${this.serverUrl?Le`
            <div style="display:flex; align-items:baseline;">
              <div style="font-weight:bold; padding-right:5px;">API Server</div> 
              <span class = "gray-text"> ${this.serverUrl} </span>
            </div>
          `:""}
      </div>  
    `;return Le`
    <div style="display:flex; align-items:flex-end; margin:16px 0; font-size:var(--font-size-small);" part="wrap-request-btn">
      <div class="hide-in-small-screen" style="flex-direction:column; margin:0; width:calc(100% - 60px);">
        <div style="display:flex; flex-direction:row; align-items:center; overflow:hidden;"> 
          ${n}
        </div>
        <div style="display:flex;">
          <div style="font-weight:bold; padding-right:5px;">Authentication</div>
          ${(null===(e=this.security)||void 0===e?void 0:e.length)>0?Le`
              ${this.api_keys.length>0?Le`<div style="color:var(--blue); overflow:hidden;"> 
                    ${1===this.api_keys.length?`${null===(t=this.api_keys[0])||void 0===t?void 0:t.typeDisplay} in ${this.api_keys[0].in}`:`${this.api_keys.length} API keys applied`} 
                  </div>`:Le`<div class="gray-text">Required  <span style="color:var(--red)">(None Applied)</span>`}`:Le`<span class="gray-text"> Not Required </span>`}
        </div>
      </div>
      ${this.parameters.length>0||this.request_body?Le`
            <button class="m-btn thin-border" part="btn btn-outline btn-fill" style="margin-right:5px;" @click="${this.onFillRequestData}" title="Fills with example data (if provided)">
              FILL EXAMPLE
            </button>
            <button class="m-btn thin-border" part="btn btn-outline btn-clear" style="margin-right:5px;" @click="${this.onClearRequestData}">
              CLEAR
            </button>`:""}
      <button class="m-btn primary thin-border" part="btn btn-try" @click="${this.onTryClick}">TRY</button>
    </div>
    <div class="row" style="font-size:var(--font-size-small); margin:5px 0">
      ${"true"===this.showCurlBeforeTry?this.curlSyntaxTemplate():""}
    </div>
    ${""===this.responseMessage?"":this.apiResponseTabTemplate()}
    `}async onFillRequestData(e){[...e.target.closest(".request-panel").querySelectorAll("input, tag-input, textarea:not(.is-hidden)")].forEach((e=>{e.dataset.example&&("TAG-INPUT"===e.tagName.toUpperCase()?e.value=e.dataset.example.split("~|~"):e.value=e.dataset.example)}))}async onClearRequestData(e){[...e.target.closest(".request-panel").querySelectorAll("input, tag-input, textarea:not(.is-hidden)")].forEach((e=>{e.value=""}))}buildFetchURL(e){let t;const r=[...e.querySelectorAll("[data-ptype='path']")],n=[...e.querySelectorAll("[data-ptype='query']")],o=[...e.querySelectorAll("[data-ptype='query-object']")];t=this.path,r.map((e=>{t=t.replace(`{${e.dataset.pname}}`,encodeURIComponent(e.value))}));const a=new Map,i=[];n.length>0&&n.forEach((e=>{const t=new URLSearchParams;if("true"===e.dataset.paramAllowReserved&&i.push(e.dataset.pname),"false"===e.dataset.array)""!==e.value&&t.append(e.dataset.pname,e.value);else{const{paramSerializeStyle:r,paramSerializeExplode:n}=e.dataset;let o=e.value&&Array.isArray(e.value)?e.value:[];o=Array.isArray(o)?o.filter((e=>""!==e)):[],o.length>0&&("spaceDelimited"===r?t.append(e.dataset.pname,o.join(" ").replace(/^\s|\s$/g,"")):"pipeDelimited"===r?t.append(e.dataset.pname,o.join("|").replace(/^\||\|$/g,"")):"true"===n?o.forEach((r=>{t.append(e.dataset.pname,r)})):t.append(e.dataset.pname,o.join(",").replace(/^,|,$/g,"")))}t.toString()&&a.set(e.dataset.pname,t)})),o.length>0&&o.map((e=>{const t=new URLSearchParams;try{let r={};const{paramSerializeStyle:n,paramSerializeExplode:o}=e.dataset;if(r=Object.assign(r,JSON.parse(e.value.replace(/\s+/g," "))),"true"===e.dataset.paramAllowReserved&&i.push(e.dataset.pname),"json xml".includes(n))"json"===n?t.append(e.dataset.pname,JSON.stringify(r)):"xml"===n&&t.append(e.dataset.pname,SR(r));else for(const e in r)"object"==typeof r[e]?Array.isArray(r[e])&&("spaceDelimited"===n?t.append(e,r[e].join(" ")):"pipeDelimited"===n?t.append(e,r[e].join("|")):"true"===o?r[e].forEach((r=>{t.append(e,r)})):t.append(e,r[e])):t.append(e,r[e])}catch(t){console.error("RapiDoc: unable to parse %s into object",e.value)}t.toString()&&a.set(e.dataset.pname,t)}));let s="";return a.size&&(s="?",a.forEach(((e,t)=>{i.includes(t)?(s+=`${t}=`,s+=e.getAll(t).join(`&${t}=`),s+="&"):s+=`${e.toString()}&`})),s=s.slice(0,-1)),t=`${t}${s}`,this.api_keys.filter((e=>"query"===e.in)).forEach((e=>{t=`${t}${t.includes("?")?"&":"?"}${e.name}=${encodeURIComponent(e.finalKeyValue)}`})),t=`${this.serverUrl.replace(/\/$/,"")}${t}`,t}buildFetchHeaders(e){var t;const r=null===(t=this.closest(".expanded-req-resp-container, .req-resp-container"))||void 0===t?void 0:t.getElementsByTagName("api-response")[0],n=[...e.querySelectorAll("[data-ptype='header']")],o=e.querySelector(".request-body-container"),a=null==r?void 0:r.selectedMimeType,i=new Headers;if(a?i.append("Accept",a):this.accept&&i.append("Accept",this.accept),this.api_keys.filter((e=>"header"===e.in)).forEach((e=>{i.append(e.name,e.finalKeyValue)})),n.map((e=>{e.value&&i.append(e.dataset.pname,e.value)})),o){const e=o.dataset.selectedRequestBodyType;e.includes("form-data")||i.append("Content-Type",e)}return i}buildFetchBodyOptions(e){const t=e.querySelector(".request-body-container"),r={method:this.method.toUpperCase()};if(t){const n=t.dataset.selectedRequestBodyType;if(n.includes("form-urlencoded")){const t=e.querySelector("[data-ptype='dynamic-form']");if(t){const e=t.value,n=new URLSearchParams;let o,a=!0;if(e)try{o=JSON.parse(e)}catch(e){a=!1,console.warn("RapiDoc: Invalid JSON provided",e)}else a=!1;if(a){for(const e in o)n.append(e,JSON.stringify(o[e]));r.body=n}}else{const t=[...e.querySelectorAll("[data-ptype='form-urlencode']")],n=new URLSearchParams;t.filter((e=>"file"!==e.type)).forEach((e=>{if("false"===e.dataset.array)e.value&&n.append(e.dataset.pname,e.value);else{const t=e.value&&Array.isArray(e.value)?e.value.join(","):"";n.append(e.dataset.pname,t)}})),r.body=n}}else if(n.includes("form-data")){const t=new FormData;[...e.querySelectorAll("[data-ptype='form-data']")].forEach((e=>{"false"===e.dataset.array?"file"===e.type&&e.files[0]?t.append(e.dataset.pname,e.files[0],e.files[0].name):e.value&&t.append(e.dataset.pname,e.value):e.value&&Array.isArray(e.value)&&t.append(e.dataset.pname,e.value.join(","))})),r.body=t}else if(/^audio\/|^image\/|^video\/|^font\/|tar$|zip$|7z$|rtf$|msword$|excel$|\/pdf$|\/octet-stream$/.test(n)){const t=e.querySelector(".request-body-param-file");null!=t&&t.files[0]&&(r.body=t.files[0])}else if(n.includes("json")||n.includes("xml")||n.includes("text")){const t=e.querySelector(".request-body-param-user-input");null!=t&&t.value&&(r.body=t.value)}}return r}async onTryClick(e){const t=e.target,r=t.closest(".request-panel"),n=this.buildFetchURL(r),o=this.buildFetchBodyOptions(r),a=this.buildFetchHeaders(r);this.responseUrl="",this.responseHeaders=[],this.curlSyntax=this.generateCURLSyntax(n,a,o,r),this.responseStatus="success",this.responseIsBlob=!1,this.respContentDisposition="",this.responseBlobUrl&&(URL.revokeObjectURL(this.responseBlobUrl),this.responseBlobUrl=""),this.fetchCredentials&&(o.credentials=this.fetchCredentials);const i=new AbortController,{signal:s}=i;o.headers=a;const l={url:n,...o};this.dispatchEvent(new CustomEvent("before-try",{bubbles:!0,composed:!0,detail:{request:l,controller:i}}));const c={method:l.method,headers:l.headers,credentials:l.credentials,body:l.body},p=new Request(l.url,c);let d,u;try{let e,r,n;t.disabled=!0,this.responseText="⌛",this.responseMessage="",this.requestUpdate();const o=performance.now();d=await fetch(p,{signal:s});const a=performance.now();u=d.clone(),t.disabled=!1,this.responseMessage=Le`${d.statusText?`${d.statusText}:${d.status}`:d.status} <div style="color:var(--light-fg)"> Took ${Math.round(a-o)} milliseconds </div>`,this.responseUrl=d.url;const i={};d.headers.forEach(((e,t)=>{i[t]=e,this.responseHeaders=`${this.responseHeaders}${t}: ${e}\n`}));const l=d.headers.get("content-type");if(0===(await d.clone().text()).length)this.responseText="";else if(l){if("application/x-ndjson"===l)this.responseText=await d.text();else if(l.includes("json"))if(/charset=[^"']+/.test(l)){const e=l.split("charset=")[1],t=await d.arrayBuffer();try{n=new TextDecoder(e).decode(t)}catch{n=new TextDecoder("utf-8").decode(t)}try{r=JSON.parse(n),this.responseText=JSON.stringify(r,null,2)}catch{this.responseText=n}}else r=await d.json(),this.responseText=JSON.stringify(r,null,2);else/^font\/|tar$|zip$|7z$|rtf$|msword$|excel$|\/pdf$|\/octet-stream$|^application\/vnd\./.test(l)?(this.responseIsBlob=!0,this.responseBlobType="download"):/^audio|^image|^video/.test(l)?(this.responseIsBlob=!0,this.responseBlobType="view"):(n=await d.text(),l.includes("xml")?this.responseText=gR()(n,{textNodesOnSameLine:!0,indentor:"  "}):this.responseText=n);if(this.responseIsBlob){const t=d.headers.get("content-disposition");this.respContentDisposition=t?t.split("filename=")[1].replace(/"|'/g,""):"filename",e=await d.blob(),this.responseBlobUrl=URL.createObjectURL(e)}}else n=await d.text(),this.responseText=n;this.dispatchEvent(new CustomEvent("after-try",{bubbles:!0,composed:!0,detail:{request:p,response:u,responseHeaders:i,responseBody:r||n||e,responseStatus:u.ok}}))}catch(e){t.disabled=!1,"AbortError"===e.name?(this.dispatchEvent(new CustomEvent("request-aborted",{bubbles:!0,composed:!0,detail:{err:e,request:p}})),this.responseMessage="Request Aborted",this.responseText="Request Aborted"):(this.dispatchEvent(new CustomEvent("after-try",{bubbles:!0,composed:!0,detail:{err:e,request:p}})),this.responseMessage=`${e.message} (CORS or Network Issue)`)}this.requestUpdate()}liveCURLSyntaxUpdate(e){this.applyCURLSyntax(e),this.requestUpdate()}onGenerateCURLClick(e){const t=this.getRequestPanel(e);this.applyCURLSyntax(t)}getRequestPanel(e){return e.target.closest(".request-panel")}applyCURLSyntax(e){const t=this.buildFetchURL(e),r=this.buildFetchBodyOptions(e),n=this.buildFetchHeaders(e);this.curlSyntax=this.generateCURLSyntax(t,n,r,e)}generateCURLSyntax(e,t,r,n){let o,a="",i="",s="",l="";const c=n.querySelector(".request-body-container");if(!1===e.startsWith("http")){o=new URL(e,window.location.href).href}else o=e;if(a=`curl -X ${this.method.toUpperCase()} "${o}" \\\n`,i=Array.from(t).map((([e,t])=>` -H "${e}: ${t}"`)).join("\\\n"),r.body instanceof URLSearchParams)s=` -d ${r.body.toString()} \\\n`;else if(r.body instanceof File)s=` --data-binary @${r.body.name} \\\n`;else if(r.body instanceof FormData)l=Array.from(r.body).reduce(((e,[t,r])=>{if(r instanceof File)return[...e,` -F "${t}=@${r.name}"`];const n=r.match(/([^,],)/gm);if(n){const r=n.map((e=>`-F "${t}[]=${e}"`));return[...e,...r]}return[...e,` -F "${t}=${r}"`]}),[]).join("\\\n");else if(c&&c.dataset.selectedRequestBodyType){const e=c.dataset.selectedRequestBodyType,t=n.querySelector(".request-body-param-user-input");if(null!=t&&t.value){if(r.body=t.value,e.includes("json"))try{s=` -d '${JSON.stringify(JSON.parse(t.value))}' \\\n`}catch(e){}s||(s=` -d '${t.value.replace(/'/g,"'\"'\"'")}' \\\n`)}}return`${a}${i}${s}${l}`}onAddRemoveFileInput(e,t,r){if("button"!==e.target.tagName.toLowerCase())return;if(e.target.classList.contains("file-input-remove-btn")){return void e.target.closest(".input-set").remove()}const n=e.target.closest(".file-input-container"),o=document.createElement("div");o.setAttribute("class","input-set row");const a=document.createElement("input");a.type="file",a.style="width:200px; margin-top:2px;",a.setAttribute("data-pname",t),a.setAttribute("data-ptype",r.includes("form-urlencode")?"form-urlencode":"form-data"),a.setAttribute("data-array","false"),a.setAttribute("data-file-array","true");const i=document.createElement("button");i.setAttribute("class","file-input-remove-btn"),i.innerHTML="&#x2715;",o.appendChild(a),o.appendChild(i),n.insertBefore(o,e.target)}clearResponseData(){this.responseUrl="",this.responseHeaders="",this.responseText="",this.responseStatus="success",this.responseMessage="",this.responseIsBlob=!1,this.responseBlobType="",this.respContentDisposition="",this.responseBlobUrl&&(URL.revokeObjectURL(this.responseBlobUrl),this.responseBlobUrl="")}disconnectedCallback(){this.curlSyntax="",this.responseBlobUrl&&(URL.revokeObjectURL(this.responseBlobUrl),this.responseBlobUrl=""),super.disconnectedCallback()}});customElements.define("schema-table",class extends et{static get properties(){return{schemaExpandLevel:{type:Number,attribute:"schema-expand-level"},schemaDescriptionExpanded:{type:String,attribute:"schema-description-expanded"},allowSchemaDescriptionExpandToggle:{type:String,attribute:"allow-schema-description-expand-toggle"},schemaHideReadOnly:{type:String,attribute:"schema-hide-read-only"},schemaHideWriteOnly:{type:String,attribute:"schema-hide-write-only"},data:{type:Object}}}connectedCallback(){super.connectedCallback(),(!this.schemaExpandLevel||this.schemaExpandLevel<1)&&(this.schemaExpandLevel=99999),this.schemaDescriptionExpanded&&"true false".includes(this.schemaDescriptionExpanded)||(this.schemaDescriptionExpanded="false"),this.schemaHideReadOnly&&"true false".includes(this.schemaHideReadOnly)||(this.schemaHideReadOnly="true"),this.schemaHideWriteOnly&&"true false".includes(this.schemaHideWriteOnly)||(this.schemaHideWriteOnly="true")}static get styles(){return[zt,LR,ie`
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
      .key .key-label {
        font-size: var(--font-size-mono);
      }
      .key.deprecated .key-label {
        color: var(--red);
      }

      .table .key-type {
        white-space: normal;
        width: 150px;
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
      }`,Zt]}render(){var e,t,r;return Le`
      <div class="table ${"true"===this.schemaDescriptionExpanded?"expanded-all-descr":"collapsed-all-descr"}" @click="${e=>this.handleAllEvents(e)}">
        <div class='toolbar'>
          <div class="toolbar-item schema-root-type ${(null===(e=this.data)||void 0===e?void 0:e["::type"])||""} "> ${(null===(t=this.data)||void 0===t?void 0:t["::type"])||""} </div>
          ${"true"===this.allowSchemaDescriptionExpandToggle?Le`
              <div style="flex:1"></div>
              <div part="schema-multiline-toggle" class='toolbar-item schema-multiline-toggle' > 
                ${"true"===this.schemaDescriptionExpanded?"Single line description":"Multiline description"}
              </div>
            `:""}
        </div>
        <span part="schema-description" class='m-markdown'> ${VP(Ut((null===(r=this.data)||void 0===r?void 0:r["::description"])||""))} </span>
        <div style = 'border:1px solid var(--light-border-color)'>
          <div style='display:flex; background-color: var(--bg2); padding:8px 4px; border-bottom:1px solid var(--light-border-color);'>
            <div class='key' style='font-family:var(--font-regular); font-weight:bold; color:var(--fg);'> Field </div>
            <div class='key-type' style='font-family:var(--font-regular); font-weight:bold; color:var(--fg);'> Type </div>
            <div class='key-descr' style='font-family:var(--font-regular); font-weight:bold; color:var(--fg);'> Description </div>
          </div>
          ${this.data?Le`
              ${this.generateTree("array"===this.data["::type"]?this.data["::props"]:this.data,this.data["::type"],this.data["::array-type"])}`:""}  
        </div>
      </div>  
    `}generateTree(e,t="object",r="",n="",o="",a=0,i=0,s=""){var l,c;if("true"===this.schemaHideReadOnly){if("array"===t&&"readonly"===s)return;if(e&&"readonly"===e["::readwrite"])return}if("true"===this.schemaHideWriteOnly){if("array"===t&&"writeonly"===s)return;if(e&&"writeonly"===e["::readwrite"])return}if(!e)return Le`<div class="null" style="display:inline;">
        <span style='margin-left:${16*(a+1)}px'> &nbsp; </span>
        <span class="key-label xxx-of-key"> ${n.replace("::OPTION~","")}</span>
        ${"array"===t?Le`<span class='mono-font'> [ ] </span>`:"object"===t?Le`<span class='mono-font'> { } </span>`:Le`<span class='mono-font'> schema undefined </span>`}
      </div>`;const p=null!==(l=e["::type"])&&void 0!==l&&l.startsWith("xxx-of")?a:a+1,d="xxx-of-option"===t||"xxx-of-option"===e["::type"]||n.startsWith("::OPTION")?i:i+1,u=16*d;if(0===Object.keys(e).length)return Le`<span class="td key object" style='padding-left:${u}px'>${n}</span>`;let h="",f="",m=!1;if(n.startsWith("::ONE~OF")||n.startsWith("::ANY~OF"))h=n.replace("::","").replace("~"," "),m=!0;else if(n.startsWith("::OPTION")){const e=n.split("~");h=e[1],f=e[2]}else h=n;let y="";if("object"===e["::type"]?y="array"===t?"array of object":e["::dataTypeLabel"]||e["::type"]:"array"===e["::type"]&&(y="array"===t?"array of array "+("object"!==r?`of ${r}`:""):e["::dataTypeLabel"]||e["::type"]),"object"==typeof e)return Le`
        ${p>=0&&n?Le`
            <div class='tr ${p<=this.schemaExpandLevel?"expanded":"collapsed"} ${e["::type"]}' data-obj='${h}' title="${e["::deprecated"]?"Deprecated":""}">
              <div class="td key ${e["::deprecated"]?"deprecated":""}" style='padding-left:${u}px'>
                ${h||f?Le`
                    <span class='obj-toggle ${p<this.schemaExpandLevel?"expanded":"collapsed"}' data-obj='${h}'>
                      ${a<this.schemaExpandLevel?"-":"+"}
                    </span>`:""}
                ${"xxx-of-option"===e["::type"]||"xxx-of-array"===e["::type"]||n.startsWith("::OPTION")?Le`<span class="xxx-of-key" style="margin-left:-6px">${h}</span><span class="${m?"xxx-of-key":"xxx-of-descr"}">${f}</span>`:h.endsWith("*")?Le`<span class="key-label" style="display:inline-block; margin-left:-6px;">${e["::deprecated"]?"✗":""} ${h.substring(0,h.length-1)}</span><span style='color:var(--red);'>*</span>`:Le`<span class="key-label" style="display:inline-block; margin-left:-6px;">${e["::deprecated"]?"✗":""} ${"::props"===h?"":h}</span>`}
                ${"xxx-of"===e["::type"]&&"array"===t?Le`<span style="color:var(--primary-color)">ARRAY</span>`:""} 
              </div>
              <div class='td key-type' title="${"readonly"===e["::readwrite"]?"Read-Only":"writeonly"===e["::readwrite"]?"Write-Only":""}">
                ${(e["::type"]||"").includes("xxx-of")?"":y}
                ${"readonly"===e["::readwrite"]?" 🆁":"writeonly"===e["::readwrite"]?" 🆆":""}
              </div>
              <div class='td key-descr m-markdown-small' style='line-height:1.7'>${VP(Ut(o||""))}</div>
            </div>`:Le`
            ${"array"===e["::type"]&&"array"===t?Le`
                <div class='tr'> 
                  <div class='td key'></div> 
                  <div class='td key-type'>
                    ${r&&"object"!==r?`${t} of ${r}`:t}
                  </div> 
                  <div class='td key-descr'></div> 
                </div>`:""}`}
        <div class='object-body'>
        ${Array.isArray(e)&&e[0]?Le`${this.generateTree(e[0],"xxx-of-option","","::ARRAY~OF","",p,d,"")}`:Le`
            ${Object.keys(e).map((t=>{var r;return Le`
              ${["::title","::description","::type","::props","::deprecated","::array-type","::readwrite","::dataTypeLabel"].includes(t)?"array"===e[t]["::type"]||"object"===e[t]["::type"]?Le`${this.generateTree("array"===e[t]["::type"]?e[t]["::props"]:e[t],e[t]["::type"],e[t]["::array-type"]||"",t,e[t]["::description"],p,d,e[t]["::readwrite"]?e[t]["::readwrite"]:"")}`:"":Le`${this.generateTree("array"===e[t]["::type"]?e[t]["::props"]:e[t],e[t]["::type"],e[t]["::array-type"]||"",t,(null===(r=e[t])||void 0===r?void 0:r["::description"])||"",p,d,e[t]["::readwrite"]?e[t]["::readwrite"]:"")}`}
            `}))}
          `}
        <div>
      `;const[g,v,b,x,w,$,k,S,A]=e.split("~|~");if("🆁"===v&&"true"===this.schemaHideReadOnly)return;if("🆆"===v&&"true"===this.schemaHideWriteOnly)return;const E=g.replace(/┃.*/g,"").replace(/[^a-zA-Z0-9+]/g,"").substring(0,4).toLowerCase(),O=""+(b||x||w||$?'<span class="descr-expand-toggle">➔</span>':"");let T="";return T="array"===t?Le` 
        <div class='td key-type ${E}' title="${"readonly"===s?"Read-Only":"writeonly"===v?"Write-Only":""}">
          [${g}] ${"readonly"===s?"🆁":"writeonly"===s?"🆆":""}
        </div>`:Le` 
        <div class='td key-type ${E}' title="${"🆁"===v?"Read-Only":"🆆"===v?"Write-Only":""}">
          ${g} ${v}
        </div>`,Le`
      <div class = "tr primitive" title="${A?"Deprecated":""}">
        <div class="td key ${A}" style='padding-left:${u}px'>
          ${A?Le`<span style='color:var(--red);'>✗</span>`:""}
          ${null!==(c=h)&&void 0!==c&&c.endsWith("*")?Le`
              <span class="key-label">${h.substring(0,h.length-1)}</span>
              <span style='color:var(--red);'>*</span>`:n.startsWith("::OPTION")?Le`<span class='xxx-of-key'>${h}</span><span class="xxx-of-descr">${f}</span>`:Le`${h?Le`<span class="key-label"> ${h}</span>`:Le`<span class="xxx-of-descr">${S}</span>`}`}
        </div>
        ${T}
        <div class='td key-descr' style='font-size: var(--font-size-small)'>
          ${Le`<span class="m-markdown-small">
            ${VP(Ut("array"===t?`${O} ${o}`:S?`${O} <b>${S}:</b> ${k}`:`${O} ${k}`))}
          </span>`}
          ${b?Le`<div class='' style='display:inline-block; line-break:anywhere; margin-right:8px;'> <span class='bold-text'>Constraints: </span> ${b}</div>`:""}
          ${x?Le`<div style='display:inline-block; line-break:anywhere; margin-right:8px;'> <span class='bold-text'>Default: </span>${x}</div>`:""}
          ${w?Le`<div style='display:inline-block; line-break:anywhere; margin-right:8px;'> <span class='bold-text'>${"const"===g?"Value":"Allowed"}: </span>${w}</div>`:""}
          ${$?Le`<div style='display:inline-block; line-break:anywhere; margin-right:8px;'> <span class='bold-text'>Pattern: </span>${$}</div>`:""}
        </div>
      </div>
    `}handleAllEvents(e){if(e.target.classList.contains("obj-toggle"))this.toggleObjectExpand(e);else if(e.target.classList.contains("schema-multiline-toggle"))this.schemaDescriptionExpanded="true"===this.schemaDescriptionExpanded?"false":"true";else if(e.target.classList.contains("descr-expand-toggle")){const t=e.target.closest(".tr");t&&(t.classList.toggle("expanded-descr"),t.style.maxHeight=t.scrollHeight)}}toggleObjectExpand(e){const t=e.target.closest(".tr");t.classList.contains("expanded")?(t.classList.add("collapsed"),t.classList.remove("expanded"),e.target.innerText="+"):(t.classList.remove("collapsed"),t.classList.add("expanded"),e.target.innerText="-")}});function NR(e){const t=new Ut.Renderer;return t.heading=(t,r,n,o)=>`<h${r} class="observe-me" id="${e}--${o.slug(n)}">${t}</h${r}>`,t}function DR(e){const t=e.target.closest(".tag-container").querySelector(".tag-description"),r=e.target.closest(".tag-container").querySelector(".tag-icon");if(t&&r){t.classList.contains("expanded")?(t.style.maxHeight=0,t.classList.replace("expanded","collapsed"),r.classList.replace("expanded","collapsed")):(t.style.maxHeight=`${t.scrollHeight}px`,t.classList.replace("collapsed","expanded"),r.classList.replace("collapsed","expanded"))}}function FR(e,t="",r=""){var n,o,a,i,s,l,c,p,d;const u=new Set;for(const t in e.responses)for(const r in null===(h=e.responses[t])||void 0===h?void 0:h.content){var h;u.add(r.trim())}const f=[...u].join(", "),m=this.resolvedSpec.securitySchemes.filter((t=>{var r;return t.finalKeyValue&&(null===(r=e.security)||void 0===r?void 0:r.some((e=>t.securitySchemeId in e)))}))||[],y=this.resolvedSpec.securitySchemes.find((e=>e.securitySchemeId===Xt&&"-"!==e.value));y&&m.push(y);const g=e.xCodeSamples?cR.call(this,e.xCodeSamples):"";return Le`
    ${"read"===this.renderStyle?Le`<div class='divider' part="operation-divider"></div>`:""}
    <div class='expanded-endpoint-body observe-me ${e.method} ${e.deprecated?"deprecated":""} ' part="section-operation ${e.elementId}" id='${e.elementId}'>
      ${"focused"===this.renderStyle&&"General ⦂"!==t?Le`
          <div class="tag-container" part="section-operation-tag"> 
            <span class="upper" style="font-weight:bold; font-size:18px;"> ${t} </span>
            ${r?Le`
                <svg class="tag-icon collapsed" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" fill="none" style="stroke:var(--primary-color); vertical-align:top; cursor:pointer"
                @click="${e=>{DR.call(this,e)}}"
                >
                  <path d="M12 20h-6a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h8"></path><path d="M18 4v17"></path><path d="M15 18l3 3l3 -3"></path>
                </svg>
                <div class="tag-description collapsed" style="max-height:0px; overflow:hidden; margin-top:16px; border:1px solid var(--border-color)"> 
                  <div class="m-markdown" style="padding:8px"> ${VP(Ut(r))}</div>  
                </div>`:""}  
          </div>
        `:""}
      ${e.deprecated?Le`<div class="bold-text red-text"> DEPRECATED </div>`:""}
      ${Le`
        ${e.xBadges&&(null===(n=e.xBadges)||void 0===n?void 0:n.length)>0?Le`
            <div style="display:flex; flex-wrap:wrap; margin-bottom: -24px; font-size: var(--font-size-small);">
              ${e.xBadges.map((e=>Le`<span style="margin:1px; margin-right:5px; padding:1px 8px; font-weight:bold; border-radius:12px;  background-color: var(--light-${e.color}, var(--input-bg)); color:var(--${e.color}); border:1px solid var(--${e.color})">${e.label}</span>`))}
            </div>
            `:""}
        <h2 part="section-operation-summary"> ${e.shortSummary||`${e.method.toUpperCase()} ${e.path}`}</h2>
        ${e.isWebhook?Le`<span part="section-operation-webhook" style="color:var(--primary-color); font-weight:bold; font-size: var(--font-size-regular);"> WEBHOOK </span>`:Le`
            <div part="section-operation-webhook-method" class="mono-font regular-font-size" style="text-align:left; direction:ltr; padding: 8px 0; color:var(--fg3)"> 
              <span part="label-operation-method" class="regular-font upper method-fg bold-text ${e.method}">${e.method}</span> 
              <span part="label-operation-path">${e.path}</span>
            </div>
          `}
        <slot name="${e.elementId}"></slot>`}
      ${e.description?Le`<div class="m-markdown"> ${VP(Ut(e.description))}</div>`:""}
      ${lR.call(this,e.security)}
      ${null!==(o=e.externalDocs)&&void 0!==o&&o.url||null!==(a=e.externalDocs)&&void 0!==a&&a.description?Le`<div style="background-color:var(--bg3); padding:2px 8px 8px 8px; margin:8px 0; border-radius:var(--border-radius)"> 
            <div class="m-markdown"> ${VP(Ut((null===(i=e.externalDocs)||void 0===i?void 0:i.description)||""))} </div>
            ${null!==(s=e.externalDocs)&&void 0!==s&&s.url?Le`<a style="font-family:var(--font-mono); font-size:var(--font-size-small)" href="${null===(l=e.externalDocs)||void 0===l?void 0:l.url}" target="_blank">
                  ${null===(c=e.externalDocs)||void 0===c?void 0:c.url} <div style="transform: rotate(270deg) scale(1.5); display: inline-block; margin-left:5px">⇲</div>
                </a>`:""}
          </div>`:""}
      ${g}
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
          .api_keys = "${m}"
          .servers = "${e.servers}"
          server-url = "${(null===(p=e.servers)||void 0===p||null===(d=p[0])||void 0===d?void 0:d.url)||this.selectedServer.computedUrl}"
          fill-request-fields-with-example = "${this.fillRequestFieldsWithExample}"
          allow-try = "${this.allowTry}"
          show-curl-before-try = "${this.showCurlBeforeTry}"
          accept = "${f}"
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

        ${e.callbacks?pR.call(this,e.callbacks):""}

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
  `}function UR(){return this.resolvedSpec?Le`
  ${this.resolvedSpec.tags.map((e=>Le`
    <section id="${e.elementId}" part="section-tag" class="regular-font section-gap--read-mode observe-me" style="border-top:1px solid var(--primary-color);">
      <div class="title tag" part="section-tag-title label-tag-title">${e.name}</div>
      <slot name="${e.elementId}"></slot>
      <div class="regular-font-size">
      ${VP(`\n          <div class="m-markdown regular-font">\n          ${Ut(e.description||"","true"===this.infoDescriptionHeadingsInNavBar?{renderer:NR(e.elementId)}:void 0)}\n        </div>`)}
      </div>
    </section>
    <section class="regular-font section-gap--read-mode" part="section-operations-in-tag">
      ${e.paths.map((e=>FR.call(this,e)))}
    </section>
    `))}
`:""}function BR(e){return Le`
  <div class='divider'></div>
  <div class='expanded-endpoint-body observe-me ${e.name}' id='cmp--${e.id}' >
    <div style="font-weight:bold"> ${e.name} <span style="color:var(--light-fg); font-size:var(--font-size-small); font-weight:400;"> Schema </span></div>
  ${"table"===this.schemaStyle?Le`
      <schema-table
        .data = '${jR(e.component,{})}'
        schema-expand-level = "${this.schemaExpandLevel}"
        schema-description-expanded = "${this.schemaDescriptionExpanded}"
        allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
        schema-hide-read-only = "false"
        schema-hide-write-only = "${this.schemaHideWriteOnly}"
        exportparts = "schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
      > </schema-table>`:Le`
      <schema-tree
        .data = '${jR(e.component,{})}'
        schema-expand-level = "${this.schemaExpandLevel}"
        schema-description-expanded = "${this.schemaDescriptionExpanded}"
        allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
        schema-hide-read-only = "false"
        schema-hide-write-only = "${this.schemaHideWriteOnly}"
        exportparts = "schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
      > </schema-tree>`}
  </div>`}function qR(e,t){return-1!==e.id.indexOf("schemas-")?BR.call(this,e):Le`
  <div class='divider'></div>
  <div class='expanded-endpoint-body observe-me ${e.name}' id='cmp--${e.id}' >
    ${Le`
      <div style="font-weight:bold"> ${e.name} <span style="color:var(--light-fg); font-size:var(--font-size-small); font-weight:400"> ${t} </span> </div>
      ${e.component?Le`
      <div class='mono-font regular-font-size' style='padding: 8px 0; color:var(--fg2)'> 
        <json-tree class="border tree" render-style='${this.renderStyle}' .data="${e.component}"> </json-tree>
      </div>`:""}
    `}
  </div>
  `}function zR(){return this.resolvedSpec?Le`
  ${this.resolvedSpec.components.map((e=>Le`
    <div id="cmp--${e.name.toLowerCase()}" class='regular-font section-gap--read-mode observe-me' style="border-top:1px solid var(--primary-color);">
      <div class="title tag">${e.name}</div>
      <div class="regular-font-size">
        ${VP(`<div class='m-markdown regular-font'>${Ut(e.description?e.description:"")}</div>`)}
      </div>
    </div>
    <div class='regular-font section-gap--read-mode'>
      ${e.subComponents.filter((e=>!1!==e.expanded)).map((t=>qR.call(this,t,e.name)))}
    </div>
    `))}
`:""}function MR(){const e=new Ut.Renderer;return e.heading=(e,t,r,n)=>`<h${t} class="observe-me" id="overview--${n.slug(r)}">${e}</h${t}>`,e}function HR(){var e,t,r,n;return Le`
    <section id="overview" part="section-overview"
      class="observe-me ${"view"===this.renderStyle?"section-gap":"section-gap--read-mode"}">
      ${null!==(e=this.resolvedSpec)&&void 0!==e&&e.info?Le`
          <div id="api-title" part="section-overview-title" style="font-size:32px">
            ${this.resolvedSpec.info.title}
            ${this.resolvedSpec.info.version?Le`
              <span style = 'font-size:var(--font-size-small);font-weight:bold'>
                ${this.resolvedSpec.info.version}
              </span>`:""}
          </div>
          <div id="api-info" style="font-size:calc(var(--font-size-regular) - 1px); margin-top:8px;">
            ${null!==(t=this.resolvedSpec.info.contact)&&void 0!==t&&t.email?Le`<span>${this.resolvedSpec.info.contact.name||"Email"}: 
                <a href="mailto:${this.resolvedSpec.info.contact.email}" part="anchor anchor-overview">${this.resolvedSpec.info.contact.email}</a>
              </span>`:""}
            ${null!==(r=this.resolvedSpec.info.contact)&&void 0!==r&&r.url?Le`<span>URL: <a href="${this.resolvedSpec.info.contact.url}" part="anchor anchor-overview">${this.resolvedSpec.info.contact.url}</a></span>`:""}
            ${this.resolvedSpec.info.license?Le`<span>License: 
                ${this.resolvedSpec.info.license.url?Le`<a href="${this.resolvedSpec.info.license.url}" part="anchor anchor-overview">${this.resolvedSpec.info.license.name}</a>`:this.resolvedSpec.info.license.name} </span>`:""}
            ${this.resolvedSpec.info.termsOfService?Le`<span><a href="${this.resolvedSpec.info.termsOfService}" part="anchor anchor-overview">Terms of Service</a></span>`:""}
            ${this.specUrl&&"true"===this.allowSpecFileDownload?Le`
                <div style="display:flex; margin:12px 0; gap:8px; justify-content: start;">
                  <button class="m-btn thin-border" style="min-width:170px" part="btn btn-outline" @click='${e=>{or(this.specUrl,"openapi-spec")}}'>Download OpenAPI spec</button>
                  ${null!==(n=this.specUrl)&&void 0!==n&&n.trim().toLowerCase().endsWith("json")?Le`<button class="m-btn thin-border" style="width:200px" part="btn btn-outline" @click='${e=>{ar(this.specUrl)}}'>View OpenAPI spec (New Tab)</button>`:""}
                </div>`:""}
          </div>
          <slot name="overview"></slot>
          <div id="api-description">
          ${this.resolvedSpec.info.description?Le`${VP(`\n                <div class="m-markdown regular-font">\n                ${Ut(this.resolvedSpec.info.description,"true"===this.infoDescriptionHeadingsInNavBar?{renderer:MR()}:void 0)}\n              </div>`)}`:""}
          </div>
        `:""}
    </section>
  `}function WR(e){var t;const r=null===(t=this.resolvedSpec)||void 0===t?void 0:t.servers.find((t=>t.url===e));return!!r&&(this.selectedServer=r,this.requestUpdate(),this.dispatchEvent(new CustomEvent("api-server-change",{bubbles:!0,composed:!0,detail:{selectedServer:r}})),!0)}function VR(e,t){const r=[...e.currentTarget.closest("table").querySelectorAll("input, select")];let n=t.url;r.forEach((e=>{const t=new RegExp(`{${e.dataset.var}}`,"g");n=n.replace(t,e.value)})),t.computedUrl=n,this.requestUpdate()}function GR(){return this.selectedServer&&this.selectedServer.variables?Le`
    <div class="table-title">SERVER VARIABLES</div>
    <table class='m-table' role='presentation'>
      ${Object.entries(this.selectedServer.variables).map((e=>Le`
        <tr>
          <td style="vertical-align: middle;" >${e[0]}</td>
          <td>
            ${e[1].enum?Le`
            <select
              data-var = "${e[0]}"
              @input = ${e=>{VR.call(this,e,this.selectedServer)}}
            >
            ${Object.entries(e[1].enum).map((t=>e[1].default===t[1]?Le`
              <option
                selected
                label = ${t[1]}
                value = ${t[1]}
              />`:Le`
              <option
                label = ${t[1]}
                value = ${t[1]}
              />`))}
            </select>`:Le`
            <input
              type = "text"
              part="textbox textbox-server-var"
              spellcheck = "false"
              data-var = "${e[0]}"
              value = "${e[1].default}"
              @input = ${e=>{VR.call(this,e,this.selectedServer)}}
            />`}
          </td>
        </tr>
        ${e[1].description?Le`<tr><td colspan="2" style="border:none"><span class="m-markdown-small"> ${VP(Ut(e[1].description))} </span></td></tr>`:""}
      `))}
    </table>
    `:""}function KR(){var e,t,r;return!this.resolvedSpec||this.resolvedSpec.specLoadError?"":Le`
  <section id = 'servers' part="section-servers" style="text-align:left; direction:ltr; margin-top:24px; margin-bottom:24px;" class='regular-font observe-me ${"read focused".includes(this.renderStyle)?"section-gap--read-mode":"section-gap"}'>
    <div part = "section-servers-title" class = "sub-title">API SERVER</div>
    <div class = 'mono-font' style='margin: 12px 0; font-size:calc(var(--font-size-small) + 1px);'>
      ${this.resolvedSpec.servers&&0!==(null===(e=this.resolvedSpec.servers)||void 0===e?void 0:e.length)?Le`
          ${null===(t=this.resolvedSpec)||void 0===t?void 0:t.servers.map(((e,t)=>Le`
            <input type = 'radio'
              name = 'api_server'
              id = 'srvr-opt-${t}'
              value = '${e.url}'
              @change = ${()=>{WR.call(this,e.url)}}
              .checked = '${this.selectedServer.url===e.url}'
              style = 'margin:4px 0; cursor:pointer'
            />
              <label style='cursor:pointer' for='srvr-opt-${t}'>
                ${e.url} ${e.description?Le`- <span class='regular-font'>${e.description} </span>`:""}
              </label>
            <br/>
          `))}
      `:""}
      <div class="table-title primary-text" part="label-selected-server"> SELECTED: ${(null===(r=this.selectedServer)||void 0===r?void 0:r.computedUrl)||"none"}</div>
    </div>
    <slot name="servers"></slot>
    ${GR.call(this)}
  </section>`}function JR(e,t="toggle"){const r=null==e?void 0:e.closest(".nav-bar-tag-and-paths"),n=r.querySelector(".nav-bar-paths-under-tag");if(r){const e=r.classList.contains("expanded");!e||"toggle"!==t&&"collapse"!==t?e||"toggle"!==t&&"expand"!==t||(r.classList.replace("collapsed","expanded"),n.style.maxHeight=`${n.scrollHeight}px`):(n.style.maxHeight=0,r.classList.replace("expanded","collapsed"))}}function YR(e){var t,r,n,o;if("click"!==e.type&&("keyup"!==e.type||13!==e.keyCode))return;const a=e.target;e.stopPropagation(),"navigate"===(null===(t=a.dataset)||void 0===t?void 0:t.action)?this.scrollToEventTarget(e,!1):"expand-all"===(null===(r=a.dataset)||void 0===r?void 0:r.action)||"collapse-all"===(null===(n=a.dataset)||void 0===n?void 0:n.action)?function(e,t="expand-all"){if("click"!==e.type&&("keyup"!==e.type||13!==e.keyCode))return;const r=[...e.target.closest(".nav-scroll").querySelectorAll(".nav-bar-tag-and-paths")];"expand-all"===t?r.forEach((e=>{const t=e.querySelector(".nav-bar-paths-under-tag");e.classList.replace("collapsed","expanded"),t.style.maxHeight=`${null==t?void 0:t.scrollHeight}px`})):r.forEach((e=>{e.classList.replace("expanded","collapsed"),e.querySelector(".nav-bar-paths-under-tag").style.maxHeight=0}))}(e,a.dataset.action):"expand-collapse-tag"===(null===(o=a.dataset)||void 0===o?void 0:o.action)&&JR(a,"toggle")}function ZR(){var e,t,r,n;return!this.resolvedSpec||this.resolvedSpec.specLoadError?Le`
      <nav class='nav-bar' part='section-navbar'>
        <slot name='nav-logo' class='logo'></slot>
      </nav>
    `:Le`
  <nav class='nav-bar ${this.renderStyle}' part='section-navbar'>
    <slot name='nav-logo' class='logo'></slot>
    ${"false"===this.allowSearch&&"false"===this.allowAdvancedSearch?"":Le`
        <div style='display:flex; flex-direction:row; justify-content:center; align-items:stretch; padding:8px 24px 12px 24px; ${"false"===this.allowAdvancedSearch?"border-bottom: 1px solid var(--nav-hover-bg-color)":""}' part='section-navbar-search'>
          ${"false"===this.allowSearch?"":Le`
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
              ${this.matchPaths?Le`
                  <button @click = '${this.onClearSearch}' class='m-btn thin-border' style='margin-left:5px; color:var(--nav-text-color); width:75px; padding:6px 8px;' part='btn btn-outline btn-clear-filter'>
                    CLEAR
                  </button>`:""}
            `}
          ${"false"===this.allowAdvancedSearch||this.matchPaths?"":Le`
              <button class='m-btn primary' part='btn btn-fill btn-search' style='margin-left:5px; padding:6px 8px; width:75px' @click='${this.onShowSearchModalClicked}'>
                SEARCH
              </button>
            `}
        </div>
      `}
    ${Le`<nav class='nav-scroll' tabindex='-1' part='section-navbar-scroll' @click='${e=>YR.call(this,e)}' @keyup='${e=>YR.call(this,e)}' >
      ${"false"!==this.showInfo&&this.resolvedSpec.info?Le`
          ${"true"===this.infoDescriptionHeadingsInNavBar?Le`
              ${this.resolvedSpec.infoDescriptionHeaders.length>0?Le`<div class='nav-bar-info ${this.navActiveItemMarker}' id='link-overview' data-content-id='overview' data-action='navigate' tabindex='0' part='section-navbar-item section-navbar-overview'> 
                    ${(null===(e=this.resolvedSpec.info)||void 0===e||null===(t=e.title)||void 0===t?void 0:t.trim())||"Overview"}
                  </div>`:""}
              <div class='overview-headers'>
                ${this.resolvedSpec.infoDescriptionHeaders.map((e=>Le`
                  <div
                    class='nav-bar-h${e.depth} ${this.navActiveItemMarker}' 
                    id='link-overview--${(new Ut.Slugger).slug(e.text)}'
                    data-action='navigate' 
                    data-content-id='overview--${(new Ut.Slugger).slug(e.text)}' 
                  >
                    ${e.text}
                  </div>`))}
              </div>
              ${this.resolvedSpec.infoDescriptionHeaders.length>0?Le`<hr style='border-top: 1px solid var(--nav-hover-bg-color); border-width:1px 0 0 0; margin: 15px 0 0 0'/>`:""}
            `:Le`<div class='nav-bar-info ${this.navActiveItemMarker}' id='link-overview' data-action='navigate' data-content-id='overview' tabindex='0'> 
              ${(null===(r=this.resolvedSpec.info)||void 0===r||null===(n=r.title)||void 0===n?void 0:n.trim())||"Overview"}
            </div>`}
        `:""}
    
      ${"false"===this.allowServerSelection?"":Le`<div class='nav-bar-info ${this.navActiveItemMarker}' id='link-servers' data-action='navigate' data-content-id='servers' tabindex='0' part='section-navbar-item section-navbar-servers'> API Servers </div>`}
      ${"false"!==this.allowAuthentication&&this.resolvedSpec.securitySchemes?Le`<div class='nav-bar-info ${this.navActiveItemMarker}' id='link-auth' data-action='navigate' data-content-id='auth' tabindex='0' part='section-navbar-item section-navbar-auth'> Authentication </div>`:""}

      <div id='link-operations-top' class='nav-bar-section operations' data-action='navigate' data-content-id='${"focused"===this.renderStyle?"":"operations-top"}' part='section-navbar-item section-navbar-operations-top'>
        <div style='font-size:16px; display:flex; margin-left:10px;'>
          ${"focused"===this.renderStyle?Le`
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
      ${this.resolvedSpec.tags.filter((e=>e.paths.filter((e=>rr(this.matchPaths,e,this.matchType))).length)).map((e=>{var t;return Le`
          <div class='nav-bar-tag-and-paths ${"read"===this.renderStyle||e.expanded?"expanded":"collapsed"}' >
            ${"General ⦂"===e.name?Le`<hr style='border:none; border-top: 1px dotted var(--nav-text-color); opacity:0.3; margin:-1px 0 0 0;'/>`:Le`
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
            ${"true"===this.infoDescriptionHeadingsInNavBar?Le`
                ${"focused"===this.renderStyle&&"expand-collapse"===this.onNavTagClick?"":Le`
                    <div class='tag-headers'>
                      ${e.headers.map((t=>Le`
                      <div
                        class='nav-bar-h${t.depth} ${this.navActiveItemMarker}'
                        part='section-navbar-item section-navbar-h${t.depth}'
                        id='link-${e.elementId}--${(new Ut.Slugger).slug(t.text)}'
                        data-action='navigate'
                        data-content-id='${e.elementId}--${(new Ut.Slugger).slug(t.text)}'
                        tabindex='0'
                      > ${t.text}</div>`))}
                    </div>`}`:""}
            <div class='nav-bar-paths-under-tag' style='max-height:${e.expanded||"read"===this.renderStyle?50*((null===(t=e.paths)||void 0===t?void 0:t.length)||1):0}px;'>
              <!-- Paths in each tag (endpoints) -->
              ${e.paths.filter((e=>!this.matchPaths||rr(this.matchPaths,e,this.matchType))).map((e=>Le`
              <div 
                class='nav-bar-path ${this.navActiveItemMarker} ${"true"===this.usePathInNavBar?"small-font":""}'
                part='section-navbar-item section-navbar-path'
                data-action='navigate'
                data-content-id='${e.elementId}'
                id='link-${e.elementId}'
                tabindex='0'
              >
                <span style = 'display:flex; pointer-events: none; align-items:start; ${e.deprecated?"filter:opacity(0.5)":""}'>
                  ${Le`<span class='nav-method ${this.showMethodInNavBar} ${e.method}' style='pointer-events: none;'>
                      ${"as-colored-block"===this.showMethodInNavBar?e.method.substring(0,3).toUpperCase():e.method.toUpperCase()}
                    </span>`}
                  ${e.isWebhook?Le`<span style='font-weight:bold; pointer-events: none; margin-right:8px; font-size: calc(var(--font-size-small) - 2px)'>WEBHOOK</span>`:""}
                  ${"true"===this.usePathInNavBar?Le`<span style='pointer-events: none;' class='mono-font'>${e.path}</span>`:e.summary||e.shortSummary}
                </span>
              </div>`))}
            </div>
          </div>
        `}))}

      <!-- COMPONENTS -->
      ${this.resolvedSpec.components&&"true"===this.showComponents&&"focused"===this.renderStyle?Le`
          <div id='link-components' class='nav-bar-section components'>
            <div></div>
            <div class='nav-bar-section-title'>COMPONENTS</div>
          </div>
          ${this.resolvedSpec.components.map((e=>e.subComponents.length?Le`
              <div class='nav-bar-tag'
                part='section-navbar-item section-navbar-tag'
                data-action='navigate' 
                data-content-id='cmp--${e.name.toLowerCase()}' 
                id='link-cmp--${e.name.toLowerCase()}'
              >
                ${e.name}
              </div>
              ${e.subComponents.filter((e=>!1!==e.expanded)).map((e=>Le`
                <div class='nav-bar-path' data-action='navigate' data-content-id='cmp--${e.id}' id='link-cmp--${e.id}'>
                  <span> ${e.name} </span>
                </div>`))}`:""))}`:""}
    </nav>`}
</nav>
`}function QR(e){const t=new Ut.Renderer;return t.heading=(t,r,n,o)=>`<h${r} class="observe-me" id="${e}--${o.slug(n)}">${t}</h${r}>`,t}function XR(e){return Le`
    <div class='regular-font section-gap--focused-mode' part="section-operations-in-tag">
      ${e}
    </div>`}function eL(){var e;if("true"===this.showInfo)return XR(HR.call(this));const t=this.resolvedSpec.tags[0],r=null===(e=this.resolvedSpec.tags[0])||void 0===e?void 0:e.paths[0];return XR(t&&r?FR.call(this,r,t.name):"")}function tL(e){return Le`
    <h1 id="${e.elementId}">${e.name}</h1>
    ${"show-description"===this.onNavTagClick&&e.description?Le`
        <div class="m-markdown">
          ${VP(`\n            <div class="m-markdown regular-font">\n              ${Ut(e.description||"","true"===this.infoDescriptionHeadingsInNavBar?{renderer:QR(e.elementId)}:void 0)}\n            </div>`)}
        </div>`:""}
  `}function rL(){if(!this.focusedElementId||!this.resolvedSpec)return;const e=this.focusedElementId;let t,r=null,n=null,o=0;if(e.startsWith("overview")&&"true"===this.showInfo)t=HR.call(this);else if("auth"===e&&"true"===this.allowAuthentication)t=sR.call(this);else if("servers"===e&&"true"===this.allowServerSelection)t=KR.call(this);else if("operations-top"===e)t=Le`
    <div id="operations-top" class="observe-me">
      <slot name="operations-top"></slot>
    </div>`;else if(e.startsWith("cmp--")&&"true"===this.showComponents)t=zR.call(this);else if(e.startsWith("tag--")){const r=e.indexOf("--",4)>0?e.substring(0,e.indexOf("--",5)):e;n=this.resolvedSpec.tags.find((e=>e.elementId===r)),t=n?XR.call(this,tL.call(this,n)):eL.call(this)}else{for(o=0;o<this.resolvedSpec.tags.length&&(n=this.resolvedSpec.tags[o],r=this.resolvedSpec.tags[o].paths.find((t=>`${t.elementId}`===e)),!r);o+=1);if(r){JR(this.shadowRoot.getElementById(`link-${e}`),"expand"),t=XR.call(this,FR.call(this,r,n.name||"",n.description||""))}else t=eL.call(this)}return t}function nL(e){if(e.expanded)e.expanded=!1,"true"===this.updateRoute&&window.history.replaceState(null,null,`${window.location.href.split("#")[0]}${"#"===this.routePrefix?"":`${this.routePrefix}`}`);else if(e.expanded=!0,"true"===this.updateRoute){const t=`${this.routePrefix||"#"}${e.elementId}`;window.location.hash!==t&&window.history.replaceState(null,null,`${window.location.href.split("#")[0]}${t}`)}this.requestUpdate()}function oL(e,t="expand-all"){const r=[...e.querySelectorAll(".section-tag")];"expand-all"===t?r.map((e=>{e.classList.replace("collapsed","expanded")})):r.map((e=>{e.classList.replace("expanded","collapsed")}))}function aL(e,t="expand-all"){oL.call(this,e.target.closest(".operations-root"),t)}function iL(e,t=!1){return Le`
  <summary @click="${t=>{nL.call(this,e,t)}}" part="section-endpoint-head-${e.expanded?"expanded":"collapsed"}" class='endpoint-head ${e.method} ${e.deprecated?"deprecated":""} ${t||e.expanded?"expanded":"collapsed"}'>
    <div part="section-endpoint-head-method" class="method ${e.method} ${e.deprecated?"deprecated":""}"> ${e.method} </div> 
    <div  part="section-endpoint-head-path" class="path ${e.deprecated?"deprecated":""}"> 
      ${e.path} 
      ${e.isWebhook?Le`<span style="font-family: var(--font-regular); font-size: var(--); font-size: var(--font-size-small); color:var(--primary-color); margin-left: 16px"> Webhook</span>`:""}
    </div>
    ${e.deprecated?Le`
        <span style="font-size:var(--font-size-small); text-transform:uppercase; font-weight:bold; color:var(--red); margin:2px 0 0 5px;"> 
          deprecated 
        </span>`:""}
    ${this.showSummaryWhenCollapsed?Le`
        <div class="only-large-screen" style="min-width:60px; flex:1"></div>
        <div part="section-endpoint-head-description" class="descr">${e.summary||e.shortSummary} </div>`:""}
  </summary>
  `}function sL(e){var t,r,n,o,a,i,s;const l=new Set;for(const t in e.responses)for(const r in null===(c=e.responses[t])||void 0===c?void 0:c.content){var c;l.add(r.trim())}const p=[...l].join(", "),d=this.resolvedSpec.securitySchemes.filter((t=>{var r;return t.finalKeyValue&&(null===(r=e.security)||void 0===r?void 0:r.some((e=>t.securitySchemeId in e)))}))||[],u=this.resolvedSpec.securitySchemes.find((e=>e.securitySchemeId===Xt&&"-"!==e.value));u&&d.push(u);const h=e.xCodeSamples?cR(e.xCodeSamples):"";return Le`
  <div part="section-endpoint-body-${e.expanded?"expanded":"collapsed"}" class='endpoint-body ${e.method} ${e.deprecated?"deprecated":""}'>
    <div class="summary">
      ${e.summary?Le`<div class="title" part="section-endpoint-body-title">${e.summary}<div>`:e.shortSummary!==e.description?Le`<div class="title" part="section-endpoint-body-title">${e.shortSummary}</div>`:""}
      ${e.xBadges&&(null===(t=e.xBadges)||void 0===t?void 0:t.length)>0?Le`
          <div style="display:flex; flex-wrap:wrap;font-size: var(--font-size-small);">
            ${e.xBadges.map((e=>Le`<span part="endpoint-badge" style="margin:1px; margin-right:5px; padding:1px 8px; font-weight:bold; border-radius:12px;  background-color: var(--light-${e.color}, var(--input-bg)); color:var(--${e.color}); border:1px solid var(--${e.color})">${e.label}</span>`))}
          </div>
          `:""}

      ${e.description?Le`<div part="section-endpoint-body-description" class="m-markdown"> ${VP(Ut(e.description))}</div>`:""}
      ${null!==(r=e.externalDocs)&&void 0!==r&&r.url||null!==(n=e.externalDocs)&&void 0!==n&&n.description?Le`<div style="background-color:var(--bg3); padding:2px 8px 8px 8px; margin:8px 0; border-radius:var(--border-radius)"> 
            <div class="m-markdown"> ${VP(Ut((null===(o=e.externalDocs)||void 0===o?void 0:o.description)||""))} </div>
            ${null!==(a=e.externalDocs)&&void 0!==a&&a.url?Le`<a style="font-family:var(--font-mono); font-size:var(--font-size-small)" href="${null===(i=e.externalDocs)||void 0===i?void 0:i.url}" target="_blank"> 
                  ${null===(s=e.externalDocs)||void 0===s?void 0:s.url} <div style="transform: rotate(270deg) scale(1.5); display: inline-block; margin-left:5px">⇲</div>
                </a>`:""}
          </div>`:""}
      <slot name="${e.elementId}"></slot>
      ${lR.call(this,e.security)}
      ${h}
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
          .api_keys = "${d}"
          .servers = "${e.servers}" 
          server-url = "${e.servers&&e.servers.length>0?e.servers[0].url:this.selectedServer.computedUrl}" 
          active-schema-tab = "${this.defaultSchemaTab}"
          fill-request-fields-with-example = "${this.fillRequestFieldsWithExample}"
          allow-try = "${this.allowTry}"
          show-curl-before-try = "${this.showCurlBeforeTry}"
          accept = "${p}"
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

          ${e.callbacks?pR.call(this,e.callbacks):""}
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
  </div>`}function lL(e=!0,t=!0,r=!1){return this.resolvedSpec?Le`
    ${e?Le`
        <div style="display:flex; justify-content:flex-end;"> 
          <span @click="${e=>aL(e,"expand-all")}" style="color:var(--primary-color); cursor:pointer;">
            Expand all
          </span> 
          &nbsp;|&nbsp; 
          <span @click="${e=>aL(e,"collapse-all")}" style="color:var(--primary-color); cursor:pointer;" >
            Collapse all
          </span> 
          &nbsp; sections
        </div>`:""}
    ${this.resolvedSpec.tags.map((e=>Le`
      ${t?Le` 
          <div class='regular-font section-gap section-tag ${e.expanded?"expanded":"collapsed"}'> 
            <div class='section-tag-header' @click="${()=>{e.expanded=!e.expanded,this.requestUpdate()}}">
              <div id='${e.elementId}' class="sub-title tag" style="color:var(--primary-color)">${e.name}</div>
            </div>
            <div class='section-tag-body'>
              <slot name="${e.elementId}"></slot>
              <div class="regular-font regular-font-size m-markdown" style="padding-bottom:12px">
                ${VP(Ut(e.description||""))}
              </div>
              ${e.paths.filter((e=>!this.matchPaths||rr(this.matchPaths,e,this.matchType))).map((e=>Le`
                <section part="section-endpoint" id='${e.elementId}' class='m-endpoint regular-font ${e.method} ${r||e.expanded?"expanded":"collapsed"}'>
                  ${iL.call(this,e,r)}      
                  ${r||e.expanded?sL.call(this,e):""}
                </section>`))}
            </div>
          </div>`:Le`
          <div class='section-tag-body'>
          ${e.paths.filter((e=>!this.matchPaths||rr(this.matchPaths,e,this.matchType))).map((e=>Le`
            <section id='${e.elementId}' class='m-endpoint regular-font ${e.method} ${r||e.expanded?"expanded":"collapsed"}'>
              ${iL.call(this,e,r)}      
              ${r||e.expanded?sL.call(this,e):""}
            </section>`))}
          </div>
        `}
  `))}`:""}function cL(){return Le`
  <header class="row main-header regular-font" part="section-header" style="padding:8px 4px 8px 4px;min-height:48px;">
    <div class="only-large-screen-flex" style="align-items: center;">
      <slot name="logo" class="logo" part="section-logo">
        ${e="height:36px;width:36px;margin-left:5px",Le`
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
      ${"false"===this.allowSpecUrlLoad?"":Le`
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
      ${"false"===this.allowSpecFileLoad?"":Le`
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
      ${"false"===this.allowSearch||"read focused".includes(this.renderStyle)?"":Le`  
          <input id="search" class="header-input" type="text" part="textbox textbox-header-filter" placeholder="Filter" @change="${this.onSearchChange}" style="max-width:130px;margin-left:10px;" spellcheck="false" >
          <div style="margin: 6px 5px 0 -24px; font-size:var(--font-size-regular); cursor:pointer;">&#x21a9;</div>
        `}
      
      ${"false"===this.allowAdvancedSearch||"read focused".includes(this.renderStyle)?"":Le`
          <button class="m-btn primary only-large-screen" part="btn btn-fill btn-search" style="margin-left:10px;" @click="${this.onShowSearchModalClicked}">
            Search
          </button>
        `}
    </div>
    </header>`;var e}customElements.define("api-response",class extends et{constructor(){super(),this.selectedStatus="",this.headersForEachRespStatus={},this.mimeResponsesForEachStatus={},this.activeSchemaTab="schema"}static get properties(){return{callback:{type:String},webhook:{type:String},responses:{type:Object},parser:{type:Object},schemaStyle:{type:String,attribute:"schema-style"},renderStyle:{type:String,attribute:"render-style"},selectedStatus:{type:String,attribute:"selected-status"},selectedMimeType:{type:String,attribute:"selected-mime-type"},activeSchemaTab:{type:String,attribute:"active-schema-tab"},schemaExpandLevel:{type:Number,attribute:"schema-expand-level"},schemaDescriptionExpanded:{type:String,attribute:"schema-description-expanded"},allowSchemaDescriptionExpandToggle:{type:String,attribute:"allow-schema-description-expand-toggle"},schemaHideReadOnly:{type:String,attribute:"schema-hide-read-only"},schemaHideWriteOnly:{type:String,attribute:"schema-hide-write-only"}}}static get styles(){return[zt,Ht,Kt,Wt,Mt,vR,ie`
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
      }`,Zt]}render(){return Le`
    <div class="col regular-font response-panel ${this.renderStyle}-mode">
      <div class=" ${"true"===this.callback?"tiny-title":"req-res-title"} "> 
        ${"true"===this.callback?"CALLBACK RESPONSE":"RESPONSE"}
      </div>
      <div>
        ${this.responseTemplate()}
      <div>  
    </div>  
    `}resetSelection(){this.selectedStatus="",this.selectedMimeType=""}responseTemplate(){if(!this.responses)return"";for(const n in this.responses){this.selectedStatus||(this.selectedStatus=n);const o={};for(const r in null===(e=this.responses[n])||void 0===e?void 0:e.content){var e,t;const a=this.responses[n].content[r];this.selectedMimeType||(this.selectedMimeType=r);const i=jR(a.schema,{}),s=IR(a.schema,r,a.examples,a.example,"true"!==this.callback&&"true"!==this.webhook,"true"===this.callback||"true"===this.webhook,r.includes("json")?"json":"text");o[r]={description:this.responses[n].description,examples:s,selectedExample:(null===(t=s[0])||void 0===t?void 0:t.exampleId)||"",schemaTree:i}}const a=[];for(const e in null===(r=this.responses[n])||void 0===r?void 0:r.headers){var r;a.push({name:e,...this.responses[n].headers[e]})}this.headersForEachRespStatus[n]=a,this.mimeResponsesForEachStatus[n]=o}return Le`
      ${Object.keys(this.responses).length>1?Le`<div class='row' style='flex-wrap:wrap'>
          ${Object.keys(this.responses).map((e=>Le`
            ${"$$ref"===e?"":Le`
                <button 
                  @click="${()=>{this.selectedStatus=e,this.responses[e].content&&Object.keys(this.responses[e].content)[0]?this.selectedMimeType=Object.keys(this.responses[e].content)[0]:this.selectedMimeType=void 0}}"
                  class='m-btn small ${this.selectedStatus===e?"primary":""}'
                  part="btn ${this.selectedStatus===e?"btn-response-status btn-selected-response-status":" btn-response-status"}"
                  style='margin: 8px 4px 0 0'
                > 
                  ${e} 
                </button>`}`))}`:Le`<span>${Object.keys(this.responses)[0]}</span>`}
      </div>

      ${Object.keys(this.responses).map((e=>{var t,r;return Le`
        <div style = 'display: ${e===this.selectedStatus?"block":"none"}' >
          <div class="top-gap">
            <span class="resp-descr m-markdown ">${VP(Ut((null===(t=this.responses[e])||void 0===t?void 0:t.description)||""))}</span>
            ${this.headersForEachRespStatus[e]&&(null===(r=this.headersForEachRespStatus[e])||void 0===r?void 0:r.length)>0?Le`${this.responseHeaderListTemplate(this.headersForEachRespStatus[e])}`:""}
          </div>
          ${0===Object.keys(this.mimeResponsesForEachStatus[e]).length?"":Le`  
              <div class="tab-panel col">
                <div class="tab-buttons row" @click="${e=>{"button"===e.target.tagName.toLowerCase()&&(this.activeSchemaTab=e.target.dataset.tab)}}" >
                  <button class="tab-btn ${"example"===this.activeSchemaTab?"active":""}" data-tab = 'example'>EXAMPLE </button>
                  <button class="tab-btn ${"example"!==this.activeSchemaTab?"active":""}" data-tab = 'schema' >SCHEMA</button>
                  <div style="flex:1"></div>
                  ${1===Object.keys(this.mimeResponsesForEachStatus[e]).length?Le`<span class='small-font-size gray-text' style='align-self:center; margin-top:8px;'> ${Object.keys(this.mimeResponsesForEachStatus[e])[0]} </span>`:Le`${this.mimeTypeDropdownTemplate(Object.keys(this.mimeResponsesForEachStatus[e]))}`}
                </div>
                ${"example"===this.activeSchemaTab?Le`<div class ='tab-content col' style = 'flex:1;'>
                      ${this.mimeExampleTemplate(this.mimeResponsesForEachStatus[e][this.selectedMimeType])}
                    </div>`:Le`<div class ='tab-content col' style = 'flex:1;'>
                      ${this.mimeSchemaTemplate(this.mimeResponsesForEachStatus[e][this.selectedMimeType])}
                    </div>`}
              </div>
            `}`}))}
    `}responseHeaderListTemplate(e){return Le`
      <div style="padding:16px 0 8px 0" class="resp-headers small-font-size bold-text">RESPONSE HEADERS</div> 
      <table role="presentation" style="border-collapse: collapse; margin-bottom:16px; border:1px solid var(--border-color); border-radius: var(--border-radius)" class="small-font-size mono-font">
        ${e.map((e=>{var t,r;return Le`
          <tr>
            <td style="padding:8px; vertical-align: baseline; min-width:120px; border-top: 1px solid var(--light-border-color); text-overflow: ellipsis;">
              ${e.name||""}
            </td> 
            <td style="padding:4px; vertical-align: baseline; padding:0 5px; border-top: 1px solid var(--light-border-color); text-overflow: ellipsis;">
              ${(null===(t=e.schema)||void 0===t?void 0:t.type)||""}
            </td> 
            <td style="padding:8px; vertical-align: baseline; border-top: 1px solid var(--light-border-color);text-overflow: ellipsis;">
              <div class="m-markdown-small regular-font" >${VP(Ut(e.description||""))}</div>
            </td>
            <td style="padding:8px; vertical-align: baseline; border-top: 1px solid var(--light-border-color); text-overflow: ellipsis;">
              ${(null===(r=e.schema)||void 0===r?void 0:r.example)||""}
            </td>
          </tr>
        `}))}
    </table>`}mimeTypeDropdownTemplate(e){return Le`
      <select aria-label='mime types' @change="${e=>{this.selectedMimeType=e.target.value}}" style='margin-bottom: -1px; z-index:1'>
        ${e.map((e=>Le`<option value='${e}' ?selected = '${e===this.selectedMimeType}'> ${e} </option>`))}
      </select>`}onSelectExample(e){[...e.target.closest(".example-panel").querySelectorAll(".example")].forEach((t=>{t.style.display=t.dataset.example===e.target.value?"block":"none"}))}mimeExampleTemplate(e){return e?Le`
      ${1===e.examples.length?Le`
          ${"json"===e.examples[0].exampleFormat?Le`
              ${e.examples[0].exampleSummary&&e.examples[0].exampleSummary.length>80?Le`<div style="padding: 4px 0"> ${e.examples[0].exampleSummary} </div>`:""}
              ${e.examples[0].exampleDescription?Le`<div class="m-markdown-small" style="padding: 4px 0"> ${VP(Ut(e.examples[0].exampleDescription||""))} </div>`:""}
              <json-tree 
                render-style = '${this.renderStyle}'
                .data="${e.examples[0].exampleValue}"
                class = 'example-panel ${"read"===this.renderStyle?"border pad-8-16":"border-top pad-top-8"}'
                exportparts = "btn:btn, btn-fill:btn-fill, btn-copy:btn-copy" 
              ></json-tree>`:Le`
              ${e.examples[0].exampleSummary&&e.examples[0].exampleSummary.length>80?Le`<div style="padding: 4px 0"> ${e.examples[0].exampleSummary} </div>`:""}
              ${e.examples[0].exampleDescription?Le`<div class="m-markdown-small" style="padding: 4px 0"> ${VP(Ut(e.examples[0].exampleDescription||""))} </div>`:""}
              <pre class = 'example-panel ${"read"===this.renderStyle?"border pad-8-16":"border-top pad-top-8"}'>${e.examples[0].exampleValue}</pre>
            `}`:Le`
          <span class = 'example-panel ${"read"===this.renderStyle?"border pad-8-16":"border-top pad-top-8"}'>
            <select aria-label='response examples' style="min-width:100px; max-width:100%" @change='${e=>this.onSelectExample(e)}'>
              ${e.examples.map((t=>Le`<option value="${t.exampleId}" ?selected=${t.exampleId===e.selectedExample} > 
                ${t.exampleSummary.length>80?t.exampleId:t.exampleSummary} 
              </option>`))}
            </select>
            ${e.examples.map((t=>Le`
              <div class="example" data-example = '${t.exampleId}' style = "display: ${t.exampleId===e.selectedExample?"block":"none"}">
                ${t.exampleSummary&&t.exampleSummary.length>80?Le`<div style="padding: 4px 0"> ${t.exampleSummary} </div>`:""}
                ${t.exampleDescription?Le`<div class="m-markdown-small"  style="padding: 4px 0"> ${VP(Ut(t.exampleDescription||""))} </div>`:""}
                ${"json"===t.exampleFormat?Le`
                    <json-tree 
                      render-style = '${this.renderStyle}'
                      .data = '${t.exampleValue}'
                      exportparts = "btn:btn, btn-fill:btn-fill, btn-copy:btn-copy" 
                    ></json-tree>`:Le`<pre>${t.exampleValue}</pre>`}
              </div>  
            `))}
          </span>  
        `}
    `:Le`
        <pre style='color:var(--red)' class = '${"read"===this.renderStyle?"read example-panel border pad-8-16":"example-panel border-top"}'> No example provided </pre>
      `}mimeSchemaTemplate(e){return e?Le`
      ${"table"===this.schemaStyle?Le`
          <schema-table
            .data = "${e.schemaTree}"
            schema-expand-level = "${this.schemaExpandLevel}"
            schema-description-expanded = "${this.schemaDescriptionExpanded}"
            allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
            schema-hide-read-only = "${this.schemaHideReadOnly}"
            schema-hide-write-only = "${this.schemaHideWriteOnly}"
            exportparts = "schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
          > </schema-table> `:Le`
          <schema-tree
            .data = '${e.schemaTree}'
            schema-expand-level = "${this.schemaExpandLevel}"
            schema-description-expanded = "${this.schemaDescriptionExpanded}"
            allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
            schema-hide-read-only = "${this.schemaHideReadOnly}"
            schema-hide-write-only = "${this.schemaHideWriteOnly}"
            exportparts = "schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
          > </schema-tree>`}`:Le`
        <pre style='color:var(--red)' class = '${"read"===this.renderStyle?"border pad-8-16":"border-top"}'> Schema not found</pre>
      `}});const pL=ie`
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
`;function dL(){var e;return document.addEventListener("close",(()=>{this.showAdvancedSearchDialog=!1})),document.addEventListener("open",this.onOpenSearchDialog),Le`
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
      
      ${null===(e=this.advancedSearchMatches)||void 0===e?void 0:e.map((e=>Le`
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
  `}customElements.define("dialog-box",class extends et{static get properties(){return{heading:{type:String,attribute:"heading"},show:{type:String,attribute:"show"}}}static get styles(){return[pL]}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",(e=>{"Escape"===e.code&&this.onClose()}))}attributeChangedCallback(e,t,r){t!==r&&("heading"===e&&(this.heading=r),"show"===e&&(this.show=r,"true"===r&&document.dispatchEvent(new CustomEvent("open",{bubbles:!0,composed:!0,detail:this})))),super.attributeChangedCallback(e,t,r)}render(){return Le`
    ${"true"===this.show?Le`
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
        </div>`:""}`}onClose(){document.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}});const uL={color:{inputReverseFg:"#fff",inputReverseBg:"#333",headerBg:"#444",getRgb(e){if(0===e.indexOf("#")&&(e=e.slice(1,7)),3!==e.length&&4!==e.length||(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),6!==e.length)throw new Error("Invalid HEX color.");return{r:parseInt(e.slice(0,2),16),g:parseInt(e.slice(2,4),16),b:parseInt(e.slice(4,6),16)}},luminanace(e){const t=this.getRgb(e);return.299*t.r+.587*t.g+.114*t.b},invert(e){return this.luminanace(e)>135?"#000":"#fff"},opacity(e,t){const r=this.getRgb(e);return`rgba(${r.r}, ${r.g}, ${r.b}, ${t})`},brightness(e,t){const r=this.getRgb(e);return r.r+=t,r.g+=t,r.b+=t,r.r>255?r.r=255:r.r<0&&(r.r=0),r.g>255?r.g=255:r.g<0&&(r.g=0),r.b>255?r.b=255:r.b<0&&(r.b=0),`#${r.r.toString(16).padStart(2,"0")}${r.g.toString(16).padStart(2,"0")}${r.b.toString(16).padStart(2,"0")}`},hasGoodContrast(e,t){return this.luminanace(e)-this.luminanace(t)}}};function hL(e){return/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8}|[A-Fa-f0-9]{4})$/i.test(e)}function fL(e,t={}){let r={};const n=t.primaryColor?t.primaryColor:"dark"===e?"#f76b39":"#ff591e",o=uL.color.invert(n),a=uL.color.opacity(n,"0.4");if("dark"===e){const e=t.bg1?t.bg1:"#2a2b2c",i=t.fg1?t.fg1:"#bbb",s=t.bg2?t.bg2:uL.color.brightness(e,5),l=t.bg3?t.bg3:uL.color.brightness(e,17),c=t.bg3?t.bg3:uL.color.brightness(e,35),p=t.fg2?t.fg2:uL.color.brightness(i,-15),d=t.fg3?t.fg3:uL.color.brightness(i,-20),u=t.fg3?t.fg3:uL.color.brightness(i,-65),h=t.inlineCodeFg?t.inlineCodeFg:"#aaa",f="#bbb",m="#eee",y=t.headerColor?t.headerColor:uL.color.brightness(e,10),g=t.navBgColor?t.navBgColor:uL.color.brightness(e,10),v=t.navTextColor?t.navTextColor:uL.color.opacity(uL.color.invert(g),"0.50"),b=t.navHoverBgColor?t.navHoverBgColor:uL.color.brightness(g,-15),x=t.navHoverTextColor?t.navHoverTextColor:uL.color.invert(g),w=t.navAccentColor?t.navAccentColor:uL.color.brightness(n,25);r={bg1:e,bg2:s,bg3:l,lightBg:c,fg1:i,fg2:p,fg3:d,lightFg:u,inlineCodeFg:h,primaryColor:n,primaryColorTrans:a,primaryColorInvert:o,selectionBg:f,selectionFg:m,overlayBg:"rgba(80, 80, 80, 0.4)",navBgColor:g,navTextColor:v,navHoverBgColor:b,navHoverTextColor:x,navAccentColor:w,navAccentTextColor:t.navAccentTextColor?t.navAccenttextColor:uL.color.invert(w),headerColor:y,headerColorInvert:uL.color.invert(y),headerColorDarker:uL.color.brightness(y,-20),headerColorBorder:uL.color.brightness(y,10),borderColor:t.borderColor||uL.color.brightness(e,20),lightBorderColor:t.lightBorderColor||uL.color.brightness(e,15),codeBorderColor:t.codeBorderColor||uL.color.brightness(e,30),inputBg:t.inputBg||uL.color.brightness(e,-5),placeHolder:t.placeHolder||uL.color.opacity(i,"0.3"),hoverColor:t.hoverColor||uL.color.brightness(e,-10),red:t.red?t.red:"#F06560",lightRed:t.lightRed?t.lightRed:uL.color.brightness(e,-10),pink:t.pink?t.pink:"#ffb2b2",lightPink:t.lightPink||uL.color.brightness(e,-10),green:t.green||"#7ec699",lightGreen:t.lightGreen||uL.color.brightness(e,-10),blue:t.blue||"#71b7ff",lightBlue:t.lightBlue||uL.color.brightness(e,-10),orange:t.orange?t.orange:"#f08d49",lightOrange:t.lightOrange||uL.color.brightness(e,-10),yellow:t.yellow||"#827717",lightYellow:t.lightYellow||uL.color.brightness(e,-10),purple:t.purple||"#786FF1",brown:t.brown||"#D4AC0D",codeBg:t.codeBg||uL.color.opacity(uL.color.brightness(e,-15),.7),codeFg:t.codeFg||"#aaa",codePropertyColor:t.codePropertyColor||"#f8c555",codeKeywordColor:t.codeKeywordColor||"#cc99cd",codeOperatorColor:t.codeOperatorColor||"#67cdcc"}}else{const e=t.bg1?t.bg1:"#fafbfc",i=t.fg1?t.fg1:"#444444",s=t.bg2?t.bg2:uL.color.brightness(e,-5),l=t.bg3?t.bg3:uL.color.brightness(e,-15),c=t.bg3?t.bg3:uL.color.brightness(e,-45),p=t.fg2?t.fg2:uL.color.brightness(i,17),d=t.fg3?t.fg3:uL.color.brightness(i,30),u=t.fg3?t.fg3:uL.color.brightness(i,70),h=t.inlineCodeFg?t.inlineCodeFg:"brown",f="#444",m="#eee",y=t.headerColor?t.headerColor:uL.color.brightness(e,-180),g=t.navBgColor?t.navBgColor:uL.color.brightness(e,-200),v=t.navTextColor?t.navTextColor:uL.color.opacity(uL.color.invert(g),"0.65"),b=t.navHoverBgColor?t.navHoverBgColor:uL.color.brightness(g,-15),x=t.navHoverTextColor?t.navHoverTextColor:uL.color.invert(g),w=t.navAccentColor?t.navAccentColor:uL.color.brightness(n,25);r={bg1:e,bg2:s,bg3:l,lightBg:c,fg1:i,fg2:p,fg3:d,lightFg:u,inlineCodeFg:h,primaryColor:n,primaryColorTrans:a,primaryColorInvert:o,selectionBg:f,selectionFg:m,overlayBg:"rgba(0, 0, 0, 0.4)",navBgColor:g,navTextColor:v,navHoverBgColor:b,navHoverTextColor:x,navAccentColor:w,navAccentTextColor:t.navAccentTextColor?t.navAccenttextColor:uL.color.invert(w),headerColor:y,headerColorInvert:uL.color.invert(y),headerColorDarker:uL.color.brightness(y,-20),headerColorBorder:uL.color.brightness(y,10),borderColor:t.borderColor||uL.color.brightness(e,-38),lightBorderColor:t.lightBorderColor||uL.color.brightness(e,-23),codeBorderColor:t.codeBorderColor||"transparent",inputBg:t.inputBg||uL.color.brightness(e,10),placeHolder:t.placeHolder||uL.color.brightness(u,20),hoverColor:t.hoverColor||uL.color.brightness(e,-5),red:t.red||"#F06560",lightRed:t.lightRed||"#fff0f0",pink:t.pink?t.pink:"#990055",lightPink:t.lightPink?t.lightPink:"#ffb2b2",green:t.green||"#690",lightGreen:t.lightGreen||"#fbfff0",blue:t.blue||"#47AFE8",lightBlue:t.lightBlue||"#eff8fd",orange:t.orange||"#FF9900",lightOrange:t.lightOrange||"#fff5e6",yellow:t.yellow||"#827717",lightYellow:t.lightYellow||"#fff5cc",purple:t.purple||"#786FF1",brown:t.brown||"#D4AC0D",codeBg:t.codeBg||uL.color.opacity(uL.color.brightness(e,-15),.7),codeFg:t.codeFg||"#666",codePropertyColor:t.codePropertyColor||"#905",codeKeywordColor:t.codeKeywordColor||"#07a",codeOperatorColor:t.codeOperatorColor||"#9a6e3a"}}return Le`
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
  </style>`}function mL(e=!1,t=!0,r=!0,n=!1){if(!this.resolvedSpec)return"";"true"===this.persistAuth&&XP.call(this);const o={bg1:hL(this.bgColor)?this.bgColor:"",fg1:hL(this.textColor)?this.textColor:"",headerColor:hL(this.headerColor)?this.headerColor:"",primaryColor:hL(this.primaryColor)?this.primaryColor:"",navBgColor:hL(this.navBgColor)?this.navBgColor:"",navTextColor:hL(this.navTextColor)?this.navTextColor:"",navHoverBgColor:hL(this.navHoverBgColor)?this.navHoverBgColor:"",navHoverTextColor:hL(this.navHoverTextColor)?this.navHoverTextColor:"",navAccentColor:hL(this.navAccentColor)?this.navAccentColor:"",navAccentTextColor:hL(this.navAccentTextColor)?this.navAccentTextColor:""};return this.resolvedSpec.specLoadError?e?Le`
        ${"dark"===this.theme?fL.call(this,"dark",o):fL.call(this,"light",o)}
        <div style='display:flex; align-items:center; border:1px dashed var(--border-color); height:42px; padding:5px; font-size:var(--font-size-small); color:var(--red); font-family:var(--font-mono)'> ${this.resolvedSpec.info.description} </div>
      `:Le`
      ${"dark"===this.theme?fL.call(this,"dark",o):fL.call(this,"light",o)}
      <!-- Header -->
      ${cL.call(this)}
      <main class='main-content regular-font' part='section-main-content'>
        <slot></slot>
        <div style='margin:24px; text-align: center;'>
          <h1 style='color: var(--red)'> ${this.resolvedSpec.info.title} </h1>
          <div style='font-family:var(--font-mono)'> ${this.resolvedSpec.info.description} </div>
        </div>
      </main>  
    `:this.resolvedSpec.isSpecLoading?Le`
      ${"dark"===this.theme?fL.call(this,"dark",o):fL.call(this,"light",o)}
      <main class='main-content regular-font' part='section-main-content'>
        <slot></slot>
        <div class='main-content-inner--${this.renderStyle}-mode'>
          <div class='loader'></div>
        </div>
      </main>
    `:Le`
    ${"dark"===this.theme?fL.call(this,"dark",o):fL.call(this,"light",o)}

    <!-- Header -->
    ${"false"===this.showHeader?"":cL.call(this)}
    
    <!-- Advanced Search -->
    ${"false"===this.allowAdvancedSearch?"":dL.call(this)}

    <div id='the-main-body' class='body ${this.cssClasses}' dir='${this.pageDirection}' >
      <!-- Side Nav -->
      ${"read"!==this.renderStyle&&"focused"!==this.renderStyle||"true"!==this.showSideNav||!this.resolvedSpec?"":ZR.call(this)}

      <!-- Main Content -->
      <main class='main-content regular-font' tabindex='-1' part='section-main-content'>
        <slot></slot>
        <div class='main-content-inner--${this.renderStyle}-mode'>
          ${!0===this.loading?Le`<div class='loader'></div>`:Le`
              ${!0===this.loadFailed?Le`<div style='text-align: center;margin: 16px;'> Unable to load the Spec</div>`:Le`
                  <div class='operations-root' @click='${e=>{this.handleHref(e)}}'>
                  ${"focused"===this.renderStyle?Le`${rL.call(this)}`:Le`
                      ${"true"===this.showInfo?HR.call(this):""}
                      ${"true"===this.allowServerSelection?KR.call(this):""}
                      ${"true"===this.allowAuthentication?sR.call(this):""}
                      <div id='operations-top' class='observe-me'>
                        <slot name='operations-top'></slot>
                      </div>  
                      ${"read"===this.renderStyle?UR.call(this):lL.call(this,t,r,n)}
                    `}
                  </div>
                `}`}
        </div>
        <slot name='footer'></slot>
      </main>
    </div>  
  `}class yL extends et{constructor(){super();const e={root:this.getRootNode().host,rootMargin:"-50px 0px -50px 0px",threshold:0};this.showSummaryWhenCollapsed=!0,this.isIntersectionObserverActive=!0,this.intersectionObserver=new IntersectionObserver((e=>{this.onIntersect(e)}),e)}static get properties(){return{headingText:{type:String,attribute:"heading-text"},gotoPath:{type:String,attribute:"goto-path"},updateRoute:{type:String,attribute:"update-route"},routePrefix:{type:String,attribute:"route-prefix"},specUrl:{type:String,attribute:"spec-url"},sortTags:{type:String,attribute:"sort-tags"},generateMissingTags:{type:String,attribute:"generate-missing-tags"},sortEndpointsBy:{type:String,attribute:"sort-endpoints-by"},specFile:{type:String,attribute:!1},layout:{type:String},renderStyle:{type:String,attribute:"render-style"},defaultSchemaTab:{type:String,attribute:"default-schema-tab"},responseAreaHeight:{type:String,attribute:"response-area-height"},fillRequestFieldsWithExample:{type:String,attribute:"fill-request-fields-with-example"},persistAuth:{type:String,attribute:"persist-auth"},onNavTagClick:{type:String,attribute:"on-nav-tag-click"},schemaStyle:{type:String,attribute:"schema-style"},schemaExpandLevel:{type:Number,attribute:"schema-expand-level"},schemaDescriptionExpanded:{type:String,attribute:"schema-description-expanded"},schemaHideReadOnly:{type:String,attribute:"schema-hide-read-only"},schemaHideWriteOnly:{type:String,attribute:"schema-hide-write-only"},apiKeyName:{type:String,attribute:"api-key-name"},apiKeyLocation:{type:String,attribute:"api-key-location"},apiKeyValue:{type:String,attribute:"api-key-value"},defaultApiServerUrl:{type:String,attribute:"default-api-server"},serverUrl:{type:String,attribute:"server-url"},oauthReceiver:{type:String,attribute:"oauth-receiver"},showHeader:{type:String,attribute:"show-header"},showSideNav:{type:String,attribute:"show-side-nav"},showInfo:{type:String,attribute:"show-info"},allowAuthentication:{type:String,attribute:"allow-authentication"},allowTry:{type:String,attribute:"allow-try"},showCurlBeforeTry:{type:String,attribute:"show-curl-before-try"},allowSpecUrlLoad:{type:String,attribute:"allow-spec-url-load"},allowSpecFileLoad:{type:String,attribute:"allow-spec-file-load"},allowSpecFileDownload:{type:String,attribute:"allow-spec-file-download"},allowSearch:{type:String,attribute:"allow-search"},allowAdvancedSearch:{type:String,attribute:"allow-advanced-search"},allowServerSelection:{type:String,attribute:"allow-server-selection"},allowSchemaDescriptionExpandToggle:{type:String,attribute:"allow-schema-description-expand-toggle"},showComponents:{type:String,attribute:"show-components"},pageDirection:{type:String,attribute:"page-direction"},theme:{type:String},bgColor:{type:String,attribute:"bg-color"},textColor:{type:String,attribute:"text-color"},headerColor:{type:String,attribute:"header-color"},primaryColor:{type:String,attribute:"primary-color"},fontSize:{type:String,attribute:"font-size"},regularFont:{type:String,attribute:"regular-font"},monoFont:{type:String,attribute:"mono-font"},loadFonts:{type:String,attribute:"load-fonts"},cssFile:{type:String,attribute:"css-file"},cssClasses:{type:String,attribute:"css-classes"},navBgColor:{type:String,attribute:"nav-bg-color"},navTextColor:{type:String,attribute:"nav-text-color"},navHoverBgColor:{type:String,attribute:"nav-hover-bg-color"},navHoverTextColor:{type:String,attribute:"nav-hover-text-color"},navAccentColor:{type:String,attribute:"nav-accent-color"},navAccentTextColor:{type:String,attribute:"nav-accent-text-color"},navActiveItemMarker:{type:String,attribute:"nav-active-item-marker"},navItemSpacing:{type:String,attribute:"nav-item-spacing"},showMethodInNavBar:{type:String,attribute:"show-method-in-nav-bar"},usePathInNavBar:{type:String,attribute:"use-path-in-nav-bar"},infoDescriptionHeadingsInNavBar:{type:String,attribute:"info-description-headings-in-navbar"},fetchCredentials:{type:String,attribute:"fetch-credentials"},matchPaths:{type:String,attribute:"match-paths"},matchType:{type:String,attribute:"match-type"},loading:{type:Boolean},focusedElementId:{type:String},showAdvancedSearchDialog:{type:Boolean},advancedSearchMatches:{type:Object}}}static get styles(){return[zt,Mt,Ht,Wt,Vt,Gt,Kt,Jt,Yt,ie`
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

      @media only screen and (min-width: 1024px) {
        .nav-bar {
          width: ${ae("default"===this.fontSize?"300px":"large"===this.fontSize?"315px":"330px")};
          display:flex;
        }
        .section-gap--focused-mode { 
          padding: 12px 80px 12px 80px; 
        }
        .section-gap--read-mode { 
          padding: 24px 80px 12px 80px; 
        }
      }`,Zt]}connectedCallback(){super.connectedCallback();const e=this.parentElement;if(e&&(0===e.offsetWidth&&""===e.style.width&&(e.style.width="100vw"),0===e.offsetHeight&&""===e.style.height&&(e.style.height="100vh"),"BODY"===e.tagName&&(e.style.marginTop||(e.style.marginTop="0"),e.style.marginRight||(e.style.marginRight="0"),e.style.marginBottom||(e.style.marginBottom="0"),e.style.marginLeft||(e.style.marginLeft="0"))),"false"!==this.loadFonts){const e={family:"Open Sans",style:"normal",weight:"300",unicodeRange:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"},t=new FontFace("Open Sans","url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN_r8OUuhpKKSTjw.woff2) format('woff2')",e);e.weight="600";const r=new FontFace("Open Sans","url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UNirkOUuhpKKSTjw.woff2) format('woff2')",e);t.load().then((e=>{document.fonts.add(e)})),r.load().then((e=>{document.fonts.add(e)}))}this.layout&&"row, column,".includes(`${this.layout},`)||(this.layout="row"),this.renderStyle&&"read, view, focused,".includes(`${this.renderStyle},`)||(this.renderStyle="focused"),this.schemaStyle&&"tree, table,".includes(`${this.schemaStyle},`)||(this.schemaStyle="tree"),this.theme&&"light, dark,".includes(`${this.theme},`)||(this.theme=window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"),this.defaultSchemaTab&&"example, schema, model,".includes(`${this.defaultSchemaTab},`)?"model"===this.defaultSchemaTab&&(this.defaultSchemaTab="schema"):this.defaultSchemaTab="example",(!this.schemaExpandLevel||this.schemaExpandLevel<1)&&(this.schemaExpandLevel=99999),this.schemaDescriptionExpanded&&"true, false,".includes(`${this.schemaDescriptionExpanded},`)||(this.schemaDescriptionExpanded="false"),this.schemaHideReadOnly&&"default, never,".includes(`${this.schemaHideReadOnly},`)||(this.schemaHideReadOnly="default"),this.schemaHideWriteOnly&&"default, never,".includes(`${this.schemaHideWriteOnly},`)||(this.schemaHideWriteOnly="default"),this.fillRequestFieldsWithExample&&"true, false,".includes(`${this.fillRequestFieldsWithExample},`)||(this.fillRequestFieldsWithExample="true"),this.persistAuth&&"true, false,".includes(`${this.persistAuth},`)||(this.persistAuth="false"),this.responseAreaHeight||(this.responseAreaHeight="400px"),this.allowSearch&&"true, false,".includes(`${this.allowSearch},`)||(this.allowSearch="true"),this.allowAdvancedSearch&&"true, false,".includes(`${this.allowAdvancedSearch},`)||(this.allowAdvancedSearch="true"),this.allowTry&&"true, false,".includes(`${this.allowTry},`)||(this.allowTry="true"),this.apiKeyValue||(this.apiKeyValue="-"),this.apiKeyLocation||(this.apiKeyLocation="header"),this.apiKeyName||(this.apiKeyName=""),this.oauthReceiver||(this.oauthReceiver="oauth-receiver.html"),this.updateRoute&&"true, false,".includes(`${this.updateRoute},`)||(this.updateRoute="true"),this.routePrefix||(this.routePrefix="#"),this.sortTags&&"true, false,".includes(`${this.sortTags},`)||(this.sortTags="false"),this.generateMissingTags&&"true, false,".includes(`${this.generateMissingTags},`)||(this.generateMissingTags="false"),this.sortEndpointsBy&&"method, path, summary, none,".includes(`${this.sortEndpointsBy},`)||(this.sortEndpointsBy="path"),this.onNavTagClick&&"expand-collapse, show-description,".includes(`${this.onNavTagClick},`)||(this.onNavTagClick="expand-collapse"),this.navItemSpacing&&"compact, relaxed, default,".includes(`${this.navItemSpacing},`)||(this.navItemSpacing="default"),this.showMethodInNavBar&&"false, as-plain-text, as-colored-text, as-colored-block,".includes(`${this.showMethodInNavBar},`)||(this.showMethodInNavBar="false"),this.usePathInNavBar&&"true, false,".includes(`${this.usePathInNavBar},`)||(this.usePathInNavBar="false"),this.navActiveItemMarker&&"left-bar, colored-block".includes(`${this.navActiveItemMarker},`)||(this.navActiveItemMarker="left-bar"),this.fontSize&&"default, large, largest,".includes(`${this.fontSize},`)||(this.fontSize="default"),this.showInfo&&"true, false,".includes(`${this.showInfo},`)||(this.showInfo="true"),this.allowServerSelection&&"true, false,".includes(`${this.allowServerSelection},`)||(this.allowServerSelection="true"),this.allowAuthentication&&"true, false,".includes(`${this.allowAuthentication},`)||(this.allowAuthentication="true"),this.allowSchemaDescriptionExpandToggle&&"true, false,".includes(`${this.allowSchemaDescriptionExpandToggle},`)||(this.allowSchemaDescriptionExpandToggle="true"),this.showSideNav&&"true false".includes(this.showSideNav)||(this.showSideNav="true"),this.showComponents&&"true false".includes(this.showComponents)||(this.showComponents="false"),this.infoDescriptionHeadingsInNavBar&&"true, false,".includes(`${this.infoDescriptionHeadingsInNavBar},`)||(this.infoDescriptionHeadingsInNavBar="false"),this.fetchCredentials&&"omit, same-origin, include,".includes(`${this.fetchCredentials},`)||(this.fetchCredentials=""),this.matchType&&"includes regex".includes(this.matchType)||(this.matchType="includes"),this.showAdvancedSearchDialog||(this.showAdvancedSearchDialog=!1),this.cssFile||(this.cssFile=null),this.cssClasses||(this.cssClasses=""),Ut.setOptions({highlight:(e,t)=>qt().languages[t]?qt().highlight(e,qt().languages[t],t):e}),window.addEventListener("hashchange",(()=>{const e=new RegExp(`^${this.routePrefix}`,"i"),t=window.location.hash.replace(e,"");this.scrollToPath(t)}),!0)}disconnectedCallback(){this.intersectionObserver&&this.intersectionObserver.disconnect(),super.disconnectedCallback()}infoDescriptionHeadingRenderer(){const e=new Ut.Renderer;return e.heading=(e,t,r,n)=>`<h${t} class="observe-me" id="${n.slug(r)}">${e}</h${t}>`,e}render(){const e=document.querySelector(`link[href*="${this.cssFile}"]`);return e&&this.shadowRoot.appendChild(e.cloneNode()),mL.call(this)}observeExpandedContent(){this.shadowRoot.querySelectorAll(".observe-me").forEach((e=>{this.intersectionObserver.observe(e)}))}attributeChangedCallback(e,t,r){if("spec-url"===e&&t!==r&&window.setTimeout((async()=>{await this.loadSpec(r),this.gotoPath&&!window.location.hash&&this.scrollToPath(this.gotoPath)}),0),"render-style"===e&&("read"===r?window.setTimeout((()=>{this.observeExpandedContent()}),100):this.intersectionObserver.disconnect()),"api-key-name"===e||"api-key-location"===e||"api-key-value"===e){let t=!1,n="",o="",a="";if("api-key-name"===e?this.getAttribute("api-key-location")&&this.getAttribute("api-key-value")&&(n=r,o=this.getAttribute("api-key-location"),a=this.getAttribute("api-key-value"),t=!0):"api-key-location"===e?this.getAttribute("api-key-name")&&this.getAttribute("api-key-value")&&(o=r,n=this.getAttribute("api-key-name"),a=this.getAttribute("api-key-value"),t=!0):"api-key-value"===e&&this.getAttribute("api-key-name")&&this.getAttribute("api-key-location")&&(a=r,o=this.getAttribute("api-key-location"),n=this.getAttribute("api-key-name"),t=!0),t&&this.resolvedSpec){const e=this.resolvedSpec.securitySchemes.find((e=>e.securitySchemeId===Xt));e?(e.name=n,e.in=o,e.value=a,e.finalKeyValue=a):this.resolvedSpec.securitySchemes.push({securitySchemeId:Xt,description:"api-key provided in rapidoc element attributes",type:"apiKey",name:n,in:o,value:a,finalKeyValue:a}),this.requestUpdate()}}super.attributeChangedCallback(e,t,r)}onSepcUrlChange(){this.setAttribute("spec-url",this.shadowRoot.getElementById("spec-url").value)}onSepcFileChange(e){this.setAttribute("spec-file",this.shadowRoot.getElementById("spec-file").value);const t=e.target.files[0],r=new FileReader;r.onload=()=>{try{const e=JSON.parse(r.result);this.loadSpec(e),this.shadowRoot.getElementById("spec-url").value=""}catch(e){console.error("RapiDoc: Unable to read or parse json")}},r.readAsText(t)}onFileLoadClick(){this.shadowRoot.getElementById("spec-file").click()}onSearchChange(e){this.matchPaths=e.target.value,this.resolvedSpec.tags.forEach((e=>e.paths.filter((t=>{this.matchPaths&&rr(this.matchPaths,t,this.matchType)&&(e.expanded=!0)})))),this.resolvedSpec.components.forEach((e=>e.subComponents.filter((e=>{e.expanded=!1,this.matchPaths&&!function(e,t){return t.name.toLowerCase().includes(e.toLowerCase())}(this.matchPaths,e)||(e.expanded=!0)})))),this.requestUpdate()}onClearSearch(){this.shadowRoot.getElementById("nav-bar-search").value="",this.matchPaths="",this.resolvedSpec.components.forEach((e=>e.subComponents.filter((e=>{e.expanded=!0}))))}onShowSearchModalClicked(){this.showAdvancedSearchDialog=!0}async onOpenSearchDialog(e){const t=e.detail.querySelector("input");await er(0),t&&t.focus()}async loadSpec(e){if(e){this.matchPaths="";try{this.resolvedSpec={specLoadError:!1,isSpecLoading:!0,tags:[]},this.loading=!0,this.loadFailed=!1;const t=await DP.call(this,e,"true"===this.generateMissingTags,"true"===this.sortTags,this.getAttribute("sort-endpoints-by"),this.getAttribute("api-key-name"),this.getAttribute("api-key-location"),this.getAttribute("api-key-value"),this.getAttribute("server-url"));this.loading=!1,this.afterSpecParsedAndValidated(t)}catch(e){this.loading=!1,this.loadFailed=!0,this.resolvedSpec=null,console.error(`RapiDoc: Unable to resolve the API spec..  ${e.message}`)}}}async afterSpecParsedAndValidated(e){var t;for(this.resolvedSpec=e,this.selectedServer=void 0,this.defaultApiServerUrl&&(this.defaultApiServerUrl===this.serverUrl?this.selectedServer={url:this.serverUrl,computedUrl:this.serverUrl}:this.resolvedSpec.servers&&(this.selectedServer=this.resolvedSpec.servers.find((e=>e.url===this.defaultApiServerUrl)))),this.selectedServer||this.resolvedSpec.servers&&(this.selectedServer=this.resolvedSpec.servers[0]),this.requestUpdate();!await this.updateComplete;);const r=new CustomEvent("spec-loaded",{detail:e});this.dispatchEvent(r),this.intersectionObserver.disconnect(),"read"===this.renderStyle&&(await er(100),this.observeExpandedContent());if(null===(t=window.location.hash)||void 0===t?void 0:t.substring(1)){const e=new RegExp(`^${this.routePrefix}`,"i"),t=window.location.hash.replace(e,"");"view"===this.renderStyle?this.expandAndGotoOperation(t,!0,!0):this.scrollToPath(t)}else if("focused"===this.renderStyle&&!this.gotoPath){var n;const e=this.showInfo?"overview":null===(n=this.resolvedSpec.tags[0])||void 0===n?void 0:n.paths[0];this.scrollToPath(e)}}expandAndGotoOperation(e,t=!0){if(!this.resolvedSpec)return;let r=!0;const n=-1===e.indexOf("#")?e:e.substring(1);if(n.startsWith("overview")||"servers"===n||"auth"===n)r=!1;else for(let t=0;t<(null===(o=this.resolvedSpec.tags)||void 0===o?void 0:o.length);t++){var o,a;const n=this.resolvedSpec.tags[t],i=null===(a=n.paths)||void 0===a?void 0:a.find((t=>t.elementId===e));i&&(i.expanded&&n.expanded?r=!1:(i.expanded=!0,n.expanded=!0))}t&&(r&&this.requestUpdate(),window.setTimeout((()=>{const e=this.shadowRoot.getElementById(n);e&&(e.scrollIntoView({behavior:"auto",block:"start"}),"true"===this.updateRoute&&window.history.replaceState(null,null,`${this.routePrefix||"#"}${n}`))}),r?150:0))}isValidTopId(e){return e.startsWith("overview")||"servers"===e||"auth"===e}isValidPathId(e){var t,r,n,o;return!("overview"!==e||!this.showInfo)||(!("servers"!==e||!this.allowServerSelection)||(!("auth"!==e||!this.allowAuthentication)||(e.startsWith("tag--")?null===(n=this.resolvedSpec)||void 0===n||null===(o=n.tags)||void 0===o?void 0:o.find((t=>t.elementId===e)):null===(t=this.resolvedSpec)||void 0===t||null===(r=t.tags)||void 0===r?void 0:r.find((t=>t.paths.find((t=>t.elementId===e)))))))}onIntersect(e){!1!==this.isIntersectionObserverActive&&e.forEach((e=>{if(e.isIntersecting&&e.intersectionRatio>0){const t=this.shadowRoot.querySelector(".nav-bar-tag.active, .nav-bar-path.active, .nav-bar-info.active, .nav-bar-h1.active, .nav-bar-h2.active, .operations.active"),r=this.shadowRoot.getElementById(`link-${e.target.id}`);r&&("true"===this.updateRoute&&window.history.replaceState(null,null,`${window.location.href.split("#")[0]}${this.routePrefix||"#"}${e.target.id}`),r.scrollIntoView({behavior:"auto",block:"center"}),r.classList.add("active"),r.part.add("section-navbar-active-item")),t&&(t.classList.remove("active"),t.part.remove("section-navbar-active-item"))}}))}handleHref(e){if("a"===e.target.tagName.toLowerCase()&&e.target.getAttribute("href").startsWith("#")){const t=this.shadowRoot.getElementById(e.target.getAttribute("href").replace("#",""));t&&t.scrollIntoView({behavior:"auto",block:"start"})}}async scrollToEventTarget(e,t=!0){if("click"!==e.type&&("keyup"!==e.type||13!==e.keyCode))return;const r=e.target;if(r.dataset.contentId){if(this.isIntersectionObserverActive=!1,"focused"===this.renderStyle){const e=this.shadowRoot.querySelector("api-request");e&&e.beforerNavigationFocusedMode()}this.scrollToPath(r.dataset.contentId,!0,t),setTimeout((()=>{this.isIntersectionObserverActive=!0}),300)}}async scrollToPath(e,t=!0,r=!0){if("focused"===this.renderStyle&&(this.focusedElementId=e,await er(0)),"view"===this.renderStyle)this.expandAndGotoOperation(e,t,!0);else{let t=!1;const n=this.shadowRoot.getElementById(e);if(n?(t=!0,n.scrollIntoView({behavior:"auto",block:"start"})):t=!1,t){if("focused"===this.renderStyle){const e=this.shadowRoot.querySelector("api-request");e&&e.afterNavigationFocusedMode();const t=this.shadowRoot.querySelector("api-response");t&&t.resetSelection()}"true"===this.updateRoute&&window.history.replaceState(null,null,`${this.routePrefix||"#"}${e}`);const t=this.shadowRoot.getElementById(`link-${e}`);if(t){r&&t.scrollIntoView({behavior:"auto",block:"center"}),await er(0);const e=this.shadowRoot.querySelector(".nav-bar-tag.active, .nav-bar-path.active, .nav-bar-info.active, .nav-bar-h1.active, .nav-bar-h2.active, .operations.active");e&&(e.classList.remove("active"),e.part.remove("active"),e.part.remove("section-navbar-active-item")),t.classList.add("active"),t.part.add("section-navbar-active-item")}}}}setHttpUserNameAndPassword(e,t,r){return JP.call(this,e,t,r)}setApiKey(e,t){return JP.call(this,e,"","",t)}removeAllSecurityKeys(){return YP.call(this)}setApiServer(e){return WR.call(this,e)}onAdvancedSearch(e,t){const r=e.target;clearTimeout(this.timeoutId),this.timeoutId=setTimeout((()=>{let e;e="text"===r.type?r:r.closest(".advanced-search-options").querySelector("input[type=text]");const t=[...r.closest(".advanced-search-options").querySelectorAll("input:checked")].map((e=>e.id));this.advancedSearchMatches=function(e,t,r=[]){if(!e.trim()||0===r.length)return;const n=[];return t.forEach((t=>{t.paths.forEach((t=>{let o="";var a;if(r.includes("search-api-path")&&(o=t.path),r.includes("search-api-descr")&&(o=`${o} ${t.summary||t.description||""}`),r.includes("search-api-params")&&(o=`${o} ${(null===(a=t.parameters)||void 0===a?void 0:a.map((e=>e.name)).join(" "))||""}`),r.includes("search-api-request-body")&&t.requestBody){let e=new Set;for(const r in null===(i=t.requestBody)||void 0===i?void 0:i.content){var i,s,l;null!==(s=t.requestBody.content[r].schema)&&void 0!==s&&s.properties&&(e=nr(null===(l=t.requestBody.content[r].schema)||void 0===l?void 0:l.properties)),o=`${o} ${[...e].join(" ")}`}}r.includes("search-api-resp-descr")&&(o=`${o} ${Object.values(t.responses).map((e=>e.description||"")).join(" ")}`),o.toLowerCase().includes(e.trim().toLowerCase())&&n.push({elementId:t.elementId,method:t.method,path:t.path,summary:t.summary||t.description||"",deprecated:t.deprecated})}))})),n}(e.value,this.resolvedSpec.tags,t)}),t)}}customElements.define("rapi-doc",yL);customElements.define("rapi-doc-mini",class extends et{constructor(){super(),this.isMini=!0,this.updateRoute="false",this.renderStyle="view",this.showHeader="false",this.allowAdvancedSearch="false"}static get properties(){return{specUrl:{type:String,attribute:"spec-url"},sortEndpointsBy:{type:String,attribute:"sort-endpoints-by"},layout:{type:String},pathsExpanded:{type:String,attribute:"paths-expanded"},defaultSchemaTab:{type:String,attribute:"default-schema-tab"},responseAreaHeight:{type:String,attribute:"response-area-height"},showSummaryWhenCollapsed:{type:String,attribute:"show-summary-when-collapsed"},fillRequestFieldsWithExample:{type:String,attribute:"fill-request-fields-with-example"},persistAuth:{type:String,attribute:"persist-auth"},schemaStyle:{type:String,attribute:"schema-style"},schemaExpandLevel:{type:Number,attribute:"schema-expand-level"},schemaDescriptionExpanded:{type:String,attribute:"schema-description-expanded"},apiKeyName:{type:String,attribute:"api-key-name"},apiKeyLocation:{type:String,attribute:"api-key-location"},apiKeyValue:{type:String,attribute:"api-key-value"},defaultApiServerUrl:{type:String,attribute:"default-api-server"},serverUrl:{type:String,attribute:"server-url"},oauthReceiver:{type:String,attribute:"oauth-receiver"},allowTry:{type:String,attribute:"allow-try"},theme:{type:String},bgColor:{type:String,attribute:"bg-color"},textColor:{type:String,attribute:"text-color"},primaryColor:{type:String,attribute:"primary-color"},fontSize:{type:String,attribute:"font-size"},regularFont:{type:String,attribute:"regular-font"},monoFont:{type:String,attribute:"mono-font"},loadFonts:{type:String,attribute:"load-fonts"},fetchCredentials:{type:String,attribute:"fetch-credentials"},matchPaths:{type:String,attribute:"match-paths"},matchType:{type:String,attribute:"match-type"},loading:{type:Boolean}}}static get styles(){return[zt,Mt,Ht,Wt,Vt,Gt,Kt,Jt,Yt,ie`
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
      }`]}connectedCallback(){if(super.connectedCallback(),"false"!==this.loadFonts){const e={family:"Open Sans",style:"normal",weight:"300",unicodeRange:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"},t=new FontFace("Open Sans","url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN_r8OUuhpKKSTjw.woff2) format('woff2')",e);e.weight="600";const r=new FontFace("Open Sans","url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UNirkOUuhpKKSTjw.woff2) format('woff2')",e);t.load().then((e=>{document.fonts.add(e)})),r.load().then((e=>{document.fonts.add(e)}))}this.showSummaryWhenCollapsed&&"true, false,".includes(`${this.showSummaryWhenCollapsed},`)||(this.showSummaryWhenCollapsed="true"),this.layout&&"row, column,".includes(`${this.layout},`)||(this.layout="row"),this.schemaStyle&&"tree, table,".includes(`${this.schemaStyle},`)||(this.schemaStyle="tree"),this.theme&&"light, dark,".includes(`${this.theme},`)||(this.theme=window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"),this.defaultSchemaTab&&"example, schema, model,".includes(`${this.defaultSchemaTab},`)?"model"===this.defaultSchemaTab&&(this.defaultSchemaTab="schema"):this.defaultSchemaTab="example",this.pathsExpanded="true"===this.pathsExpanded,(!this.schemaExpandLevel||this.schemaExpandLevel<1)&&(this.schemaExpandLevel=99999),this.schemaDescriptionExpanded&&"true, false,".includes(`${this.schemaDescriptionExpanded},`)||(this.schemaDescriptionExpanded="false"),this.fillRequestFieldsWithExample&&"true, false,".includes(`${this.fillRequestFieldsWithExample},`)||(this.fillRequestFieldsWithExample="true"),this.persistAuth&&"true, false,".includes(`${this.persistAuth},`)||(this.persistAuth="false"),this.responseAreaHeight||(this.responseAreaHeight="300px"),this.allowTry&&"true, false,".includes(`${this.allowTry},`)||(this.allowTry="true"),this.apiKeyValue||(this.apiKeyValue="-"),this.apiKeyLocation||(this.apiKeyLocation="header"),this.apiKeyName||(this.apiKeyName=""),this.oauthReceiver||(this.oauthReceiver="oauth-receiver.html"),this.sortTags&&"true, false,".includes(`${this.sortTags},`)||(this.sortTags="false"),this.sortEndpointsBy&&"method, path, summary,".includes(`${this.sortEndpointsBy},`)||(this.sortEndpointsBy="path"),this.fontSize&&"default, large, largest,".includes(`${this.fontSize},`)||(this.fontSize="default"),this.matchType&&"includes regex".includes(this.matchType)||(this.matchType="includes"),this.allowSchemaDescriptionExpandToggle&&"true, false,".includes(`${this.allowSchemaDescriptionExpandToggle},`)||(this.allowSchemaDescriptionExpandToggle="true"),this.fetchCredentials&&"omit, same-origin, include,".includes(`${this.fetchCredentials},`)||(this.fetchCredentials=""),Ut.setOptions({highlight:(e,t)=>qt().languages[t]?qt().highlight(e,qt().languages[t],t):e})}render(){return mL.call(this,!0,!1,!1,this.pathsExpanded)}attributeChangedCallback(e,t,r){if("spec-url"===e&&t!==r&&window.setTimeout((async()=>{await this.loadSpec(r)}),0),"api-key-name"===e||"api-key-location"===e||"api-key-value"===e){let t=!1,n="",o="",a="";if("api-key-name"===e?this.getAttribute("api-key-location")&&this.getAttribute("api-key-value")&&(n=r,o=this.getAttribute("api-key-location"),a=this.getAttribute("api-key-value"),t=!0):"api-key-location"===e?this.getAttribute("api-key-name")&&this.getAttribute("api-key-value")&&(o=r,n=this.getAttribute("api-key-name"),a=this.getAttribute("api-key-value"),t=!0):"api-key-value"===e&&this.getAttribute("api-key-name")&&this.getAttribute("api-key-location")&&(a=r,o=this.getAttribute("api-key-location"),n=this.getAttribute("api-key-name"),t=!0),t&&this.resolvedSpec){const e=this.resolvedSpec.securitySchemes.find((e=>e.securitySchemeId===Xt));e?(e.name=n,e.in=o,e.value=a,e.finalKeyValue=a):this.resolvedSpec.securitySchemes.push({apiKeyId:Xt,description:"api-key provided in rapidoc element attributes",type:"apiKey",name:n,in:o,value:a,finalKeyValue:a}),this.requestUpdate()}}super.attributeChangedCallback(e,t,r)}onSepcUrlChange(){this.setAttribute("spec-url",this.shadowRoot.getElementById("spec-url").value)}async loadSpec(e){if(e)try{this.resolvedSpec={specLoadError:!1,isSpecLoading:!0,tags:[]},this.loading=!0,this.loadFailed=!1,this.requestUpdate();const t=await DP.call(this,e,"true"===this.generateMissingTags,"true"===this.sortTags,this.getAttribute("sort-endpoints-by"),this.getAttribute("api-key-name"),this.getAttribute("api-key-location"),this.getAttribute("api-key-value"),this.getAttribute("server-url"));this.loading=!1,this.afterSpecParsedAndValidated(t)}catch(e){this.loading=!1,this.loadFailed=!0,this.resolvedSpec=null,console.error(`RapiDoc: Unable to resolve the API spec..  ${e.message}`)}}setHttpUserNameAndPassword(e,t,r){return JP.call(this,e,t,r)}setApiKey(e,t){return JP.call(this,e,"","",t)}removeAllSecurityKeys(){return YP.call(this)}setApiServer(e){return WR.call(this,e)}async afterSpecParsedAndValidated(e){for(this.resolvedSpec=e,this.selectedServer=void 0,this.defaultApiServerUrl&&(this.defaultApiServerUrl===this.serverUrl?this.selectedServer={url:this.serverUrl,computedUrl:this.serverUrl}:this.resolvedSpec.servers&&(this.selectedServer=this.resolvedSpec.servers.find((e=>e.url===this.defaultApiServerUrl)))),this.selectedServer||this.resolvedSpec.servers&&(this.selectedServer=this.resolvedSpec.servers[0]),this.requestUpdate();!await this.updateComplete;);const t=new CustomEvent("spec-loaded",{detail:e});this.dispatchEvent(t)}handleHref(e){if("a"===e.target.tagName.toLowerCase()&&e.target.getAttribute("href").startsWith("#")){const t=this.shadowRoot.getElementById(e.target.getAttribute("href").replace("#",""));t&&t.scrollIntoView({behavior:"auto",block:"start"})}}});class gL extends HTMLElement{connectedCallback(){this.receiveAuthParms(),window.addEventListener("storage",(e=>this.receiveStorage(e)),!0)}receiveAuthParms(){let e={};if(document.location.search){const t=new URLSearchParams(document.location.search);e={code:t.get("code"),error:t.get("error"),state:t.get("state"),responseType:"code"}}else if(window.location.hash){e={token_type:this.parseQueryString(window.location.hash.substring(1),"token_type"),access_token:this.parseQueryString(window.location.hash.substring(1),"access_token"),responseType:"token"}}window.opener?window.opener.postMessage(e,this.target):sessionStorage.setItem("rapidoc-oauth-data",JSON.stringify(e))}relayAuthParams(e){if(window.parent&&"rapidoc-oauth-data"===e.key){const t=JSON.parse(e.newValue);window.parent.postMessage(t,this.target)}}parseQueryString(e,t){const r=e.split("&");for(let e=0;e<r.length;e++){const n=r[e].split("=");if(decodeURIComponent(n[0])===t)return decodeURIComponent(n[1])}}}function vL(){return Le`
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
      ${this.resolvedSpec.schemaAndExamples.map((e=>Le`
        <div class='nav-bar-path' data-content-id='${e.elementId}' id='link-${e.elementId}'
          @click = '${e=>{this.scrollToEventTarget(e,!1)}}'
        > 
          ${e.name}
        </div>`))}
    </nav>  
  </nav>
  `}function bL(){return Le`
    ${"true"===this.showInfo?HR.call(this):""}
    <div style="font-size:var(--font-size-regular);">
    ${this.resolvedSpec.schemaAndExamples.map((e=>{var t;const r=IR(e.schema,"json",e.examples,e.example,!0,!1,"json",!0);return e.selectedExample=null===(t=r[0])||void 0===t?void 0:t.exampleId,Le`
        <section id='${e.elementId}' class='json-schema-and-example regular-font' style="display:flex; flex-direction: column; border:1px solid var(--border-color); margin-bottom:32px; border-top: 5px solid var(--border-color)">
          <div style="padding:16px; border-bottom: 1px solid var(--border-color)">
            <div style="font-size:var(--font-size-small); font-weight:bold">${e.name}</div>
            <span class="json-schema-description m-markdown ">${VP(Ut(e.description||""))}</span>
          </div>  
          <div style="display:flex; flex-direction: row; gap:16px;">
            <div class="json-schema-def" style="flex:1; padding:16px 0 16px 16px; ">
              <schema-tree
                .data = "${jR(e.schema,{})}"
                schema-expand-level = "${this.schemaExpandLevel}"
                schema-description-expanded = "${this.schemaDescriptionExpanded}"
                allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
                schema-hide-read-only = "false"
                schema-hide-write-only = "false"
              > </schema-tree>
            </div>
            <div class="json-schema-example-panel" style="width:400px; background-color: var(--input-bg); padding:16px 0 16px 16px; border-left: 1px dashed var(--border-color);">
              ${r.length>1?Le`<select style="min-width:100px; max-width:100%" @change='${t=>this.onSelectExample(t,e)}'>
                    ${r.map((t=>Le`
                      <option value="${t.exampleId}" ?selected=${t.exampleId===e.selectedExample}> 
                        ${t.exampleSummary.length>80?t.exampleId:t.exampleSummary}
                      </option>`))}
                  </select>`:Le`<div style="font-size: var(--font-size-small);font-weight:700; margin:5px 0"> ${r[0].exampleSummary}</div>`}
              ${r.map((t=>Le`
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
  `}function xL(e=!1){if(!this.resolvedSpec)return"";const t={bg1:hL(this.bgColor)?this.bgColor:"",fg1:hL(this.textColor)?this.textColor:"",headerColor:hL(this.headerColor)?this.headerColor:"",primaryColor:hL(this.primaryColor)?this.primaryColor:"",navBgColor:hL(this.navBgColor)?this.navBgColor:"",navTextColor:hL(this.navTextColor)?this.navTextColor:"",navHoverBgColor:hL(this.navHoverBgColor)?this.navHoverBgColor:"",navHoverTextColor:hL(this.navHoverTextColor)?this.navHoverTextColor:"",navAccentColor:hL(this.navAccentColor)?this.navAccentColor:"",navAccenttextColor:hL(this.navAccentTextColor)?this.navAccentTextColor:""};return this.resolvedSpec.specLoadError?e?Le`
        ${"dark"===this.theme?fL.call(this,"dark",t):fL.call(this,"light",t)}
        <div style="display:flex; align-items:center; border:1px dashed var(--border-color); height:42px; padding:5px; font-size:var(--font-size-small); color:var(--red); font-family:var(--font-mono)"> ${this.resolvedSpec.info.description} </div>
      `:Le`
      ${"dark"===this.theme?fL.call(this,"dark",t):fL.call(this,"light",t)}
      <!-- Header -->
      ${cL.call(this)}
      <h1> Header </h1>
      <main class="main-content regular-font" part="section-main-content">
        <slot></slot>
        <div style="margin:24px; text-align: center;">
          <h1 style="color: var(--red)"> ${this.resolvedSpec.info.title} </h1>
          <div style="font-family:var(--font-mono)"> ${this.resolvedSpec.info.description} </div>
        </div>
      </main>  
    `:this.resolvedSpec.isSpecLoading?Le`
      ${"dark"===this.theme?fL.call(this,"dark",t):fL.call(this,"light",t)}
      <main class="main-content regular-font" part="section-main-content">
        <slot></slot>
        <div class="main-content-inner--${this.renderStyle}-mode">
          <div class="loader"></div>
        </div>
      </main>  
    `:Le`
    ${"dark"===this.theme?fL.call(this,"dark",t):fL.call(this,"light",t)}

    <!-- Header -->
    ${"false"===this.showHeader?"":cL.call(this)}
    
    <div id='the-main-body' class="body ${this.cssClasses}" dir= ${this.pageDirection}>

      <!-- Side Nav -->
      ${vL.call(this)}

      <!-- Main Content -->
      <main class="main-content regular-font" part="section-main-content">
        <slot></slot>
        <div class="main-content-inner--${this.renderStyle}-mode">
          ${!0===this.loading?Le`<div class="loader"></div>`:Le`
              ${!0===this.loadFailed?Le`<div style="text-align: center;margin: 16px;"> Unable to load the Spec</div>`:Le`
                  <div class="operations-root" @click="${e=>{this.handleHref(e)}}">
                    ${bL.call(this)}
                  </div>
                `}`}
        </div>
        <slot name="footer"></slot>
      </main>
    </div>  
  `}customElements.define("oauth-receiver",gL);customElements.define("json-schema-viewer",class extends et{constructor(){super(),this.isMini=!1,this.updateRoute="false",this.renderStyle="focused",this.showHeader="true",this.allowAdvancedSearch="false",this.selectedExampleForEachSchema={}}static get properties(){return{specUrl:{type:String,attribute:"spec-url"},schemaStyle:{type:String,attribute:"schema-style"},schemaExpandLevel:{type:Number,attribute:"schema-expand-level"},schemaDescriptionExpanded:{type:String,attribute:"schema-description-expanded"},allowSchemaDescriptionExpandToggle:{type:String,attribute:"allow-schema-description-expand-toggle"},showHeader:{type:String,attribute:"show-header"},showSideNav:{type:String,attribute:"show-side-nav"},showInfo:{type:String,attribute:"show-info"},allowSpecUrlLoad:{type:String,attribute:"allow-spec-url-load"},allowSpecFileLoad:{type:String,attribute:"allow-spec-file-load"},allowSpecFileDownload:{type:String,attribute:"allow-spec-file-download"},allowSearch:{type:String,attribute:"allow-search"},theme:{type:String},bgColor:{type:String,attribute:"bg-color"},textColor:{type:String,attribute:"text-color"},primaryColor:{type:String,attribute:"primary-color"},fontSize:{type:String,attribute:"font-size"},regularFont:{type:String,attribute:"regular-font"},monoFont:{type:String,attribute:"mono-font"},loadFonts:{type:String,attribute:"load-fonts"},loading:{type:Boolean}}}static get styles(){return[zt,Mt,Ht,Wt,Vt,Gt,Kt,Jt,Yt,ie`
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
      }`]}connectedCallback(){super.connectedCallback();const e=this.parentElement;if(e&&(0===e.offsetWidth&&""===e.style.width&&(e.style.width="100vw"),0===e.offsetHeight&&""===e.style.height&&(e.style.height="100vh"),"BODY"===e.tagName&&(e.style.marginTop||(e.style.marginTop="0"),e.style.marginRight||(e.style.marginRight="0"),e.style.marginBottom||(e.style.marginBottom="0"),e.style.marginLeft||(e.style.marginLeft="0"))),"false"!==this.loadFonts){const e={family:"Open Sans",style:"normal",weight:"300",unicodeRange:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"},t=new FontFace("Open Sans","url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN_r8OUuhpKKSTjw.woff2) format('woff2')",e);e.weight="600";const r=new FontFace("Open Sans","url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UNirkOUuhpKKSTjw.woff2) format('woff2')",e);t.load().then((e=>{document.fonts.add(e)})),r.load().then((e=>{document.fonts.add(e)}))}this.renderStyle="focused",this.pathsExpanded="true"===this.pathsExpanded,this.showInfo&&"true, false,".includes(`${this.showInfo},`)||(this.showInfo="true"),this.showSideNav&&"true false".includes(this.showSideNav)||(this.showSideNav="true"),this.showHeader&&"true, false,".includes(`${this.showHeader},`)||(this.showHeader="true"),this.schemaStyle&&"tree, table,".includes(`${this.schemaStyle},`)||(this.schemaStyle="tree"),this.theme&&"light, dark,".includes(`${this.theme},`)||(this.theme=window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"),this.allowSearch&&"true, false,".includes(`${this.allowSearch},`)||(this.allowSearch="true"),(!this.schemaExpandLevel||this.schemaExpandLevel<1)&&(this.schemaExpandLevel=99999),this.schemaDescriptionExpanded&&"true, false,".includes(`${this.schemaDescriptionExpanded},`)||(this.schemaDescriptionExpanded="false"),this.fontSize&&"default, large, largest,".includes(`${this.fontSize},`)||(this.fontSize="default"),this.matchType&&"includes regex".includes(this.matchType)||(this.matchType="includes"),this.allowSchemaDescriptionExpandToggle&&"true, false,".includes(`${this.allowSchemaDescriptionExpandToggle},`)||(this.allowSchemaDescriptionExpandToggle="true"),Ut.setOptions({highlight:(e,t)=>qt().languages[t]?qt().highlight(e,qt().languages[t],t):e})}render(){return xL.call(this,!0,!1,!1,this.pathsExpanded)}attributeChangedCallback(e,t,r){"spec-url"===e&&t!==r&&window.setTimeout((async()=>{await this.loadSpec(r)}),0),super.attributeChangedCallback(e,t,r)}onSepcUrlChange(){this.setAttribute("spec-url",this.shadowRoot.getElementById("spec-url").value)}onSearchChange(e){this.matchPaths=e.target.value}async loadSpec(e){if(e)try{this.resolvedSpec={specLoadError:!1,isSpecLoading:!0,tags:[]},this.loading=!0,this.loadFailed=!1,this.requestUpdate();const t=await DP.call(this,e,"true"===this.generateMissingTags,"true"===this.sortTags,this.getAttribute("sort-endpoints-by"));this.loading=!1,this.afterSpecParsedAndValidated(t)}catch(e){this.loading=!1,this.loadFailed=!0,this.resolvedSpec=null,console.error(`RapiDoc: Unable to resolve the API spec..  ${e.message}`)}}async afterSpecParsedAndValidated(e){this.resolvedSpec=e;const t=new CustomEvent("spec-loaded",{detail:e});this.dispatchEvent(t)}handleHref(e){if("a"===e.target.tagName.toLowerCase()&&e.target.getAttribute("href").startsWith("#")){const t=this.shadowRoot.getElementById(e.target.getAttribute("href").replace("#",""));t&&t.scrollIntoView({behavior:"auto",block:"start"})}}onSelectExample(e){[...e.target.closest(".json-schema-example-panel").querySelectorAll(".example")].forEach((t=>{t.style.display=t.dataset.example===e.target.value?"flex":"none"}))}async scrollToEventTarget(e){const t=e.currentTarget;if(!t.dataset.contentId)return;const r=this.shadowRoot.getElementById(t.dataset.contentId);r&&r.scrollIntoView({behavior:"auto",block:"start"})}})},742:(e,t)=>{"use strict";t.byteLength=function(e){var t=l(e),r=t[0],n=t[1];return 3*(r+n)/4-n},t.toByteArray=function(e){var t,r,a=l(e),i=a[0],s=a[1],c=new o(function(e,t,r){return 3*(t+r)/4-r}(0,i,s)),p=0,d=s>0?i-4:i;for(r=0;r<d;r+=4)t=n[e.charCodeAt(r)]<<18|n[e.charCodeAt(r+1)]<<12|n[e.charCodeAt(r+2)]<<6|n[e.charCodeAt(r+3)],c[p++]=t>>16&255,c[p++]=t>>8&255,c[p++]=255&t;2===s&&(t=n[e.charCodeAt(r)]<<2|n[e.charCodeAt(r+1)]>>4,c[p++]=255&t);1===s&&(t=n[e.charCodeAt(r)]<<10|n[e.charCodeAt(r+1)]<<4|n[e.charCodeAt(r+2)]>>2,c[p++]=t>>8&255,c[p++]=255&t);return c},t.fromByteArray=function(e){for(var t,n=e.length,o=n%3,a=[],i=16383,s=0,l=n-o;s<l;s+=i)a.push(c(e,s,s+i>l?l:s+i));1===o?(t=e[n-1],a.push(r[t>>2]+r[t<<4&63]+"==")):2===o&&(t=(e[n-2]<<8)+e[n-1],a.push(r[t>>10]+r[t>>4&63]+r[t<<2&63]+"="));return a.join("")};for(var r=[],n=[],o="undefined"!=typeof Uint8Array?Uint8Array:Array,a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",i=0,s=a.length;i<s;++i)r[i]=a[i],n[a.charCodeAt(i)]=i;function l(e){var t=e.length;if(t%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var r=e.indexOf("=");return-1===r&&(r=t),[r,r===t?0:4-r%4]}function c(e,t,n){for(var o,a,i=[],s=t;s<n;s+=3)o=(e[s]<<16&16711680)+(e[s+1]<<8&65280)+(255&e[s+2]),i.push(r[(a=o)>>18&63]+r[a>>12&63]+r[a>>6&63]+r[63&a]);return i.join("")}n["-".charCodeAt(0)]=62,n["_".charCodeAt(0)]=63},764:(e,t,r)=>{"use strict";const n=r(742),o=r(645),a="function"==typeof Symbol&&"function"==typeof Symbol.for?Symbol.for("nodejs.util.inspect.custom"):null;t.lW=l,t.h2=50;const i=2147483647;function s(e){if(e>i)throw new RangeError('The value "'+e+'" is invalid for option "size"');const t=new Uint8Array(e);return Object.setPrototypeOf(t,l.prototype),t}function l(e,t,r){if("number"==typeof e){if("string"==typeof t)throw new TypeError('The "string" argument must be of type string. Received type number');return d(e)}return c(e,t,r)}function c(e,t,r){if("string"==typeof e)return function(e,t){"string"==typeof t&&""!==t||(t="utf8");if(!l.isEncoding(t))throw new TypeError("Unknown encoding: "+t);const r=0|m(e,t);let n=s(r);const o=n.write(e,t);o!==r&&(n=n.slice(0,o));return n}(e,t);if(ArrayBuffer.isView(e))return function(e){if(J(e,Uint8Array)){const t=new Uint8Array(e);return h(t.buffer,t.byteOffset,t.byteLength)}return u(e)}(e);if(null==e)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e);if(J(e,ArrayBuffer)||e&&J(e.buffer,ArrayBuffer))return h(e,t,r);if("undefined"!=typeof SharedArrayBuffer&&(J(e,SharedArrayBuffer)||e&&J(e.buffer,SharedArrayBuffer)))return h(e,t,r);if("number"==typeof e)throw new TypeError('The "value" argument must not be of type number. Received type number');const n=e.valueOf&&e.valueOf();if(null!=n&&n!==e)return l.from(n,t,r);const o=function(e){if(l.isBuffer(e)){const t=0|f(e.length),r=s(t);return 0===r.length||e.copy(r,0,0,t),r}if(void 0!==e.length)return"number"!=typeof e.length||Y(e.length)?s(0):u(e);if("Buffer"===e.type&&Array.isArray(e.data))return u(e.data)}(e);if(o)return o;if("undefined"!=typeof Symbol&&null!=Symbol.toPrimitive&&"function"==typeof e[Symbol.toPrimitive])return l.from(e[Symbol.toPrimitive]("string"),t,r);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e)}function p(e){if("number"!=typeof e)throw new TypeError('"size" argument must be of type number');if(e<0)throw new RangeError('The value "'+e+'" is invalid for option "size"')}function d(e){return p(e),s(e<0?0:0|f(e))}function u(e){const t=e.length<0?0:0|f(e.length),r=s(t);for(let n=0;n<t;n+=1)r[n]=255&e[n];return r}function h(e,t,r){if(t<0||e.byteLength<t)throw new RangeError('"offset" is outside of buffer bounds');if(e.byteLength<t+(r||0))throw new RangeError('"length" is outside of buffer bounds');let n;return n=void 0===t&&void 0===r?new Uint8Array(e):void 0===r?new Uint8Array(e,t):new Uint8Array(e,t,r),Object.setPrototypeOf(n,l.prototype),n}function f(e){if(e>=i)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+i.toString(16)+" bytes");return 0|e}function m(e,t){if(l.isBuffer(e))return e.length;if(ArrayBuffer.isView(e)||J(e,ArrayBuffer))return e.byteLength;if("string"!=typeof e)throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof e);const r=e.length,n=arguments.length>2&&!0===arguments[2];if(!n&&0===r)return 0;let o=!1;for(;;)switch(t){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":return V(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return G(e).length;default:if(o)return n?-1:V(e).length;t=(""+t).toLowerCase(),o=!0}}function y(e,t,r){let n=!1;if((void 0===t||t<0)&&(t=0),t>this.length)return"";if((void 0===r||r>this.length)&&(r=this.length),r<=0)return"";if((r>>>=0)<=(t>>>=0))return"";for(e||(e="utf8");;)switch(e){case"hex":return _(this,t,r);case"utf8":case"utf-8":return E(this,t,r);case"ascii":return T(this,t,r);case"latin1":case"binary":return C(this,t,r);case"base64":return A(this,t,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return j(this,t,r);default:if(n)throw new TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),n=!0}}function g(e,t,r){const n=e[t];e[t]=e[r],e[r]=n}function v(e,t,r,n,o){if(0===e.length)return-1;if("string"==typeof r?(n=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),Y(r=+r)&&(r=o?0:e.length-1),r<0&&(r=e.length+r),r>=e.length){if(o)return-1;r=e.length-1}else if(r<0){if(!o)return-1;r=0}if("string"==typeof t&&(t=l.from(t,n)),l.isBuffer(t))return 0===t.length?-1:b(e,t,r,n,o);if("number"==typeof t)return t&=255,"function"==typeof Uint8Array.prototype.indexOf?o?Uint8Array.prototype.indexOf.call(e,t,r):Uint8Array.prototype.lastIndexOf.call(e,t,r):b(e,[t],r,n,o);throw new TypeError("val must be string, number or Buffer")}function b(e,t,r,n,o){let a,i=1,s=e.length,l=t.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(e.length<2||t.length<2)return-1;i=2,s/=2,l/=2,r/=2}function c(e,t){return 1===i?e[t]:e.readUInt16BE(t*i)}if(o){let n=-1;for(a=r;a<s;a++)if(c(e,a)===c(t,-1===n?0:a-n)){if(-1===n&&(n=a),a-n+1===l)return n*i}else-1!==n&&(a-=a-n),n=-1}else for(r+l>s&&(r=s-l),a=r;a>=0;a--){let r=!0;for(let n=0;n<l;n++)if(c(e,a+n)!==c(t,n)){r=!1;break}if(r)return a}return-1}function x(e,t,r,n){r=Number(r)||0;const o=e.length-r;n?(n=Number(n))>o&&(n=o):n=o;const a=t.length;let i;for(n>a/2&&(n=a/2),i=0;i<n;++i){const n=parseInt(t.substr(2*i,2),16);if(Y(n))return i;e[r+i]=n}return i}function w(e,t,r,n){return K(V(t,e.length-r),e,r,n)}function $(e,t,r,n){return K(function(e){const t=[];for(let r=0;r<e.length;++r)t.push(255&e.charCodeAt(r));return t}(t),e,r,n)}function k(e,t,r,n){return K(G(t),e,r,n)}function S(e,t,r,n){return K(function(e,t){let r,n,o;const a=[];for(let i=0;i<e.length&&!((t-=2)<0);++i)r=e.charCodeAt(i),n=r>>8,o=r%256,a.push(o),a.push(n);return a}(t,e.length-r),e,r,n)}function A(e,t,r){return 0===t&&r===e.length?n.fromByteArray(e):n.fromByteArray(e.slice(t,r))}function E(e,t,r){r=Math.min(e.length,r);const n=[];let o=t;for(;o<r;){const t=e[o];let a=null,i=t>239?4:t>223?3:t>191?2:1;if(o+i<=r){let r,n,s,l;switch(i){case 1:t<128&&(a=t);break;case 2:r=e[o+1],128==(192&r)&&(l=(31&t)<<6|63&r,l>127&&(a=l));break;case 3:r=e[o+1],n=e[o+2],128==(192&r)&&128==(192&n)&&(l=(15&t)<<12|(63&r)<<6|63&n,l>2047&&(l<55296||l>57343)&&(a=l));break;case 4:r=e[o+1],n=e[o+2],s=e[o+3],128==(192&r)&&128==(192&n)&&128==(192&s)&&(l=(15&t)<<18|(63&r)<<12|(63&n)<<6|63&s,l>65535&&l<1114112&&(a=l))}}null===a?(a=65533,i=1):a>65535&&(a-=65536,n.push(a>>>10&1023|55296),a=56320|1023&a),n.push(a),o+=i}return function(e){const t=e.length;if(t<=O)return String.fromCharCode.apply(String,e);let r="",n=0;for(;n<t;)r+=String.fromCharCode.apply(String,e.slice(n,n+=O));return r}(n)}l.TYPED_ARRAY_SUPPORT=function(){try{const e=new Uint8Array(1),t={foo:function(){return 42}};return Object.setPrototypeOf(t,Uint8Array.prototype),Object.setPrototypeOf(e,t),42===e.foo()}catch(e){return!1}}(),l.TYPED_ARRAY_SUPPORT||"undefined"==typeof console||"function"!=typeof console.error||console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),Object.defineProperty(l.prototype,"parent",{enumerable:!0,get:function(){if(l.isBuffer(this))return this.buffer}}),Object.defineProperty(l.prototype,"offset",{enumerable:!0,get:function(){if(l.isBuffer(this))return this.byteOffset}}),l.poolSize=8192,l.from=function(e,t,r){return c(e,t,r)},Object.setPrototypeOf(l.prototype,Uint8Array.prototype),Object.setPrototypeOf(l,Uint8Array),l.alloc=function(e,t,r){return function(e,t,r){return p(e),e<=0?s(e):void 0!==t?"string"==typeof r?s(e).fill(t,r):s(e).fill(t):s(e)}(e,t,r)},l.allocUnsafe=function(e){return d(e)},l.allocUnsafeSlow=function(e){return d(e)},l.isBuffer=function(e){return null!=e&&!0===e._isBuffer&&e!==l.prototype},l.compare=function(e,t){if(J(e,Uint8Array)&&(e=l.from(e,e.offset,e.byteLength)),J(t,Uint8Array)&&(t=l.from(t,t.offset,t.byteLength)),!l.isBuffer(e)||!l.isBuffer(t))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(e===t)return 0;let r=e.length,n=t.length;for(let o=0,a=Math.min(r,n);o<a;++o)if(e[o]!==t[o]){r=e[o],n=t[o];break}return r<n?-1:n<r?1:0},l.isEncoding=function(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},l.concat=function(e,t){if(!Array.isArray(e))throw new TypeError('"list" argument must be an Array of Buffers');if(0===e.length)return l.alloc(0);let r;if(void 0===t)for(t=0,r=0;r<e.length;++r)t+=e[r].length;const n=l.allocUnsafe(t);let o=0;for(r=0;r<e.length;++r){let t=e[r];if(J(t,Uint8Array))o+t.length>n.length?(l.isBuffer(t)||(t=l.from(t)),t.copy(n,o)):Uint8Array.prototype.set.call(n,t,o);else{if(!l.isBuffer(t))throw new TypeError('"list" argument must be an Array of Buffers');t.copy(n,o)}o+=t.length}return n},l.byteLength=m,l.prototype._isBuffer=!0,l.prototype.swap16=function(){const e=this.length;if(e%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(let t=0;t<e;t+=2)g(this,t,t+1);return this},l.prototype.swap32=function(){const e=this.length;if(e%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(let t=0;t<e;t+=4)g(this,t,t+3),g(this,t+1,t+2);return this},l.prototype.swap64=function(){const e=this.length;if(e%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(let t=0;t<e;t+=8)g(this,t,t+7),g(this,t+1,t+6),g(this,t+2,t+5),g(this,t+3,t+4);return this},l.prototype.toString=function(){const e=this.length;return 0===e?"":0===arguments.length?E(this,0,e):y.apply(this,arguments)},l.prototype.toLocaleString=l.prototype.toString,l.prototype.equals=function(e){if(!l.isBuffer(e))throw new TypeError("Argument must be a Buffer");return this===e||0===l.compare(this,e)},l.prototype.inspect=function(){let e="";const r=t.h2;return e=this.toString("hex",0,r).replace(/(.{2})/g,"$1 ").trim(),this.length>r&&(e+=" ... "),"<Buffer "+e+">"},a&&(l.prototype[a]=l.prototype.inspect),l.prototype.compare=function(e,t,r,n,o){if(J(e,Uint8Array)&&(e=l.from(e,e.offset,e.byteLength)),!l.isBuffer(e))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof e);if(void 0===t&&(t=0),void 0===r&&(r=e?e.length:0),void 0===n&&(n=0),void 0===o&&(o=this.length),t<0||r>e.length||n<0||o>this.length)throw new RangeError("out of range index");if(n>=o&&t>=r)return 0;if(n>=o)return-1;if(t>=r)return 1;if(this===e)return 0;let a=(o>>>=0)-(n>>>=0),i=(r>>>=0)-(t>>>=0);const s=Math.min(a,i),c=this.slice(n,o),p=e.slice(t,r);for(let e=0;e<s;++e)if(c[e]!==p[e]){a=c[e],i=p[e];break}return a<i?-1:i<a?1:0},l.prototype.includes=function(e,t,r){return-1!==this.indexOf(e,t,r)},l.prototype.indexOf=function(e,t,r){return v(this,e,t,r,!0)},l.prototype.lastIndexOf=function(e,t,r){return v(this,e,t,r,!1)},l.prototype.write=function(e,t,r,n){if(void 0===t)n="utf8",r=this.length,t=0;else if(void 0===r&&"string"==typeof t)n=t,r=this.length,t=0;else{if(!isFinite(t))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");t>>>=0,isFinite(r)?(r>>>=0,void 0===n&&(n="utf8")):(n=r,r=void 0)}const o=this.length-t;if((void 0===r||r>o)&&(r=o),e.length>0&&(r<0||t<0)||t>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");let a=!1;for(;;)switch(n){case"hex":return x(this,e,t,r);case"utf8":case"utf-8":return w(this,e,t,r);case"ascii":case"latin1":case"binary":return $(this,e,t,r);case"base64":return k(this,e,t,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return S(this,e,t,r);default:if(a)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),a=!0}},l.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};const O=4096;function T(e,t,r){let n="";r=Math.min(e.length,r);for(let o=t;o<r;++o)n+=String.fromCharCode(127&e[o]);return n}function C(e,t,r){let n="";r=Math.min(e.length,r);for(let o=t;o<r;++o)n+=String.fromCharCode(e[o]);return n}function _(e,t,r){const n=e.length;(!t||t<0)&&(t=0),(!r||r<0||r>n)&&(r=n);let o="";for(let n=t;n<r;++n)o+=Z[e[n]];return o}function j(e,t,r){const n=e.slice(t,r);let o="";for(let e=0;e<n.length-1;e+=2)o+=String.fromCharCode(n[e]+256*n[e+1]);return o}function I(e,t,r){if(e%1!=0||e<0)throw new RangeError("offset is not uint");if(e+t>r)throw new RangeError("Trying to access beyond buffer length")}function P(e,t,r,n,o,a){if(!l.isBuffer(e))throw new TypeError('"buffer" argument must be a Buffer instance');if(t>o||t<a)throw new RangeError('"value" argument is out of bounds');if(r+n>e.length)throw new RangeError("Index out of range")}function R(e,t,r,n,o){z(t,n,o,e,r,7);let a=Number(t&BigInt(4294967295));e[r++]=a,a>>=8,e[r++]=a,a>>=8,e[r++]=a,a>>=8,e[r++]=a;let i=Number(t>>BigInt(32)&BigInt(4294967295));return e[r++]=i,i>>=8,e[r++]=i,i>>=8,e[r++]=i,i>>=8,e[r++]=i,r}function L(e,t,r,n,o){z(t,n,o,e,r,7);let a=Number(t&BigInt(4294967295));e[r+7]=a,a>>=8,e[r+6]=a,a>>=8,e[r+5]=a,a>>=8,e[r+4]=a;let i=Number(t>>BigInt(32)&BigInt(4294967295));return e[r+3]=i,i>>=8,e[r+2]=i,i>>=8,e[r+1]=i,i>>=8,e[r]=i,r+8}function N(e,t,r,n,o,a){if(r+n>e.length)throw new RangeError("Index out of range");if(r<0)throw new RangeError("Index out of range")}function D(e,t,r,n,a){return t=+t,r>>>=0,a||N(e,0,r,4),o.write(e,t,r,n,23,4),r+4}function F(e,t,r,n,a){return t=+t,r>>>=0,a||N(e,0,r,8),o.write(e,t,r,n,52,8),r+8}l.prototype.slice=function(e,t){const r=this.length;(e=~~e)<0?(e+=r)<0&&(e=0):e>r&&(e=r),(t=void 0===t?r:~~t)<0?(t+=r)<0&&(t=0):t>r&&(t=r),t<e&&(t=e);const n=this.subarray(e,t);return Object.setPrototypeOf(n,l.prototype),n},l.prototype.readUintLE=l.prototype.readUIntLE=function(e,t,r){e>>>=0,t>>>=0,r||I(e,t,this.length);let n=this[e],o=1,a=0;for(;++a<t&&(o*=256);)n+=this[e+a]*o;return n},l.prototype.readUintBE=l.prototype.readUIntBE=function(e,t,r){e>>>=0,t>>>=0,r||I(e,t,this.length);let n=this[e+--t],o=1;for(;t>0&&(o*=256);)n+=this[e+--t]*o;return n},l.prototype.readUint8=l.prototype.readUInt8=function(e,t){return e>>>=0,t||I(e,1,this.length),this[e]},l.prototype.readUint16LE=l.prototype.readUInt16LE=function(e,t){return e>>>=0,t||I(e,2,this.length),this[e]|this[e+1]<<8},l.prototype.readUint16BE=l.prototype.readUInt16BE=function(e,t){return e>>>=0,t||I(e,2,this.length),this[e]<<8|this[e+1]},l.prototype.readUint32LE=l.prototype.readUInt32LE=function(e,t){return e>>>=0,t||I(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+16777216*this[e+3]},l.prototype.readUint32BE=l.prototype.readUInt32BE=function(e,t){return e>>>=0,t||I(e,4,this.length),16777216*this[e]+(this[e+1]<<16|this[e+2]<<8|this[e+3])},l.prototype.readBigUInt64LE=Q((function(e){M(e>>>=0,"offset");const t=this[e],r=this[e+7];void 0!==t&&void 0!==r||H(e,this.length-8);const n=t+256*this[++e]+65536*this[++e]+this[++e]*2**24,o=this[++e]+256*this[++e]+65536*this[++e]+r*2**24;return BigInt(n)+(BigInt(o)<<BigInt(32))})),l.prototype.readBigUInt64BE=Q((function(e){M(e>>>=0,"offset");const t=this[e],r=this[e+7];void 0!==t&&void 0!==r||H(e,this.length-8);const n=t*2**24+65536*this[++e]+256*this[++e]+this[++e],o=this[++e]*2**24+65536*this[++e]+256*this[++e]+r;return(BigInt(n)<<BigInt(32))+BigInt(o)})),l.prototype.readIntLE=function(e,t,r){e>>>=0,t>>>=0,r||I(e,t,this.length);let n=this[e],o=1,a=0;for(;++a<t&&(o*=256);)n+=this[e+a]*o;return o*=128,n>=o&&(n-=Math.pow(2,8*t)),n},l.prototype.readIntBE=function(e,t,r){e>>>=0,t>>>=0,r||I(e,t,this.length);let n=t,o=1,a=this[e+--n];for(;n>0&&(o*=256);)a+=this[e+--n]*o;return o*=128,a>=o&&(a-=Math.pow(2,8*t)),a},l.prototype.readInt8=function(e,t){return e>>>=0,t||I(e,1,this.length),128&this[e]?-1*(255-this[e]+1):this[e]},l.prototype.readInt16LE=function(e,t){e>>>=0,t||I(e,2,this.length);const r=this[e]|this[e+1]<<8;return 32768&r?4294901760|r:r},l.prototype.readInt16BE=function(e,t){e>>>=0,t||I(e,2,this.length);const r=this[e+1]|this[e]<<8;return 32768&r?4294901760|r:r},l.prototype.readInt32LE=function(e,t){return e>>>=0,t||I(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24},l.prototype.readInt32BE=function(e,t){return e>>>=0,t||I(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]},l.prototype.readBigInt64LE=Q((function(e){M(e>>>=0,"offset");const t=this[e],r=this[e+7];void 0!==t&&void 0!==r||H(e,this.length-8);const n=this[e+4]+256*this[e+5]+65536*this[e+6]+(r<<24);return(BigInt(n)<<BigInt(32))+BigInt(t+256*this[++e]+65536*this[++e]+this[++e]*2**24)})),l.prototype.readBigInt64BE=Q((function(e){M(e>>>=0,"offset");const t=this[e],r=this[e+7];void 0!==t&&void 0!==r||H(e,this.length-8);const n=(t<<24)+65536*this[++e]+256*this[++e]+this[++e];return(BigInt(n)<<BigInt(32))+BigInt(this[++e]*2**24+65536*this[++e]+256*this[++e]+r)})),l.prototype.readFloatLE=function(e,t){return e>>>=0,t||I(e,4,this.length),o.read(this,e,!0,23,4)},l.prototype.readFloatBE=function(e,t){return e>>>=0,t||I(e,4,this.length),o.read(this,e,!1,23,4)},l.prototype.readDoubleLE=function(e,t){return e>>>=0,t||I(e,8,this.length),o.read(this,e,!0,52,8)},l.prototype.readDoubleBE=function(e,t){return e>>>=0,t||I(e,8,this.length),o.read(this,e,!1,52,8)},l.prototype.writeUintLE=l.prototype.writeUIntLE=function(e,t,r,n){if(e=+e,t>>>=0,r>>>=0,!n){P(this,e,t,r,Math.pow(2,8*r)-1,0)}let o=1,a=0;for(this[t]=255&e;++a<r&&(o*=256);)this[t+a]=e/o&255;return t+r},l.prototype.writeUintBE=l.prototype.writeUIntBE=function(e,t,r,n){if(e=+e,t>>>=0,r>>>=0,!n){P(this,e,t,r,Math.pow(2,8*r)-1,0)}let o=r-1,a=1;for(this[t+o]=255&e;--o>=0&&(a*=256);)this[t+o]=e/a&255;return t+r},l.prototype.writeUint8=l.prototype.writeUInt8=function(e,t,r){return e=+e,t>>>=0,r||P(this,e,t,1,255,0),this[t]=255&e,t+1},l.prototype.writeUint16LE=l.prototype.writeUInt16LE=function(e,t,r){return e=+e,t>>>=0,r||P(this,e,t,2,65535,0),this[t]=255&e,this[t+1]=e>>>8,t+2},l.prototype.writeUint16BE=l.prototype.writeUInt16BE=function(e,t,r){return e=+e,t>>>=0,r||P(this,e,t,2,65535,0),this[t]=e>>>8,this[t+1]=255&e,t+2},l.prototype.writeUint32LE=l.prototype.writeUInt32LE=function(e,t,r){return e=+e,t>>>=0,r||P(this,e,t,4,4294967295,0),this[t+3]=e>>>24,this[t+2]=e>>>16,this[t+1]=e>>>8,this[t]=255&e,t+4},l.prototype.writeUint32BE=l.prototype.writeUInt32BE=function(e,t,r){return e=+e,t>>>=0,r||P(this,e,t,4,4294967295,0),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},l.prototype.writeBigUInt64LE=Q((function(e,t=0){return R(this,e,t,BigInt(0),BigInt("0xffffffffffffffff"))})),l.prototype.writeBigUInt64BE=Q((function(e,t=0){return L(this,e,t,BigInt(0),BigInt("0xffffffffffffffff"))})),l.prototype.writeIntLE=function(e,t,r,n){if(e=+e,t>>>=0,!n){const n=Math.pow(2,8*r-1);P(this,e,t,r,n-1,-n)}let o=0,a=1,i=0;for(this[t]=255&e;++o<r&&(a*=256);)e<0&&0===i&&0!==this[t+o-1]&&(i=1),this[t+o]=(e/a>>0)-i&255;return t+r},l.prototype.writeIntBE=function(e,t,r,n){if(e=+e,t>>>=0,!n){const n=Math.pow(2,8*r-1);P(this,e,t,r,n-1,-n)}let o=r-1,a=1,i=0;for(this[t+o]=255&e;--o>=0&&(a*=256);)e<0&&0===i&&0!==this[t+o+1]&&(i=1),this[t+o]=(e/a>>0)-i&255;return t+r},l.prototype.writeInt8=function(e,t,r){return e=+e,t>>>=0,r||P(this,e,t,1,127,-128),e<0&&(e=255+e+1),this[t]=255&e,t+1},l.prototype.writeInt16LE=function(e,t,r){return e=+e,t>>>=0,r||P(this,e,t,2,32767,-32768),this[t]=255&e,this[t+1]=e>>>8,t+2},l.prototype.writeInt16BE=function(e,t,r){return e=+e,t>>>=0,r||P(this,e,t,2,32767,-32768),this[t]=e>>>8,this[t+1]=255&e,t+2},l.prototype.writeInt32LE=function(e,t,r){return e=+e,t>>>=0,r||P(this,e,t,4,2147483647,-2147483648),this[t]=255&e,this[t+1]=e>>>8,this[t+2]=e>>>16,this[t+3]=e>>>24,t+4},l.prototype.writeInt32BE=function(e,t,r){return e=+e,t>>>=0,r||P(this,e,t,4,2147483647,-2147483648),e<0&&(e=4294967295+e+1),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},l.prototype.writeBigInt64LE=Q((function(e,t=0){return R(this,e,t,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))})),l.prototype.writeBigInt64BE=Q((function(e,t=0){return L(this,e,t,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))})),l.prototype.writeFloatLE=function(e,t,r){return D(this,e,t,!0,r)},l.prototype.writeFloatBE=function(e,t,r){return D(this,e,t,!1,r)},l.prototype.writeDoubleLE=function(e,t,r){return F(this,e,t,!0,r)},l.prototype.writeDoubleBE=function(e,t,r){return F(this,e,t,!1,r)},l.prototype.copy=function(e,t,r,n){if(!l.isBuffer(e))throw new TypeError("argument should be a Buffer");if(r||(r=0),n||0===n||(n=this.length),t>=e.length&&(t=e.length),t||(t=0),n>0&&n<r&&(n=r),n===r)return 0;if(0===e.length||0===this.length)return 0;if(t<0)throw new RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw new RangeError("Index out of range");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),e.length-t<n-r&&(n=e.length-t+r);const o=n-r;return this===e&&"function"==typeof Uint8Array.prototype.copyWithin?this.copyWithin(t,r,n):Uint8Array.prototype.set.call(e,this.subarray(r,n),t),o},l.prototype.fill=function(e,t,r,n){if("string"==typeof e){if("string"==typeof t?(n=t,t=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string");if("string"==typeof n&&!l.isEncoding(n))throw new TypeError("Unknown encoding: "+n);if(1===e.length){const t=e.charCodeAt(0);("utf8"===n&&t<128||"latin1"===n)&&(e=t)}}else"number"==typeof e?e&=255:"boolean"==typeof e&&(e=Number(e));if(t<0||this.length<t||this.length<r)throw new RangeError("Out of range index");if(r<=t)return this;let o;if(t>>>=0,r=void 0===r?this.length:r>>>0,e||(e=0),"number"==typeof e)for(o=t;o<r;++o)this[o]=e;else{const a=l.isBuffer(e)?e:l.from(e,n),i=a.length;if(0===i)throw new TypeError('The value "'+e+'" is invalid for argument "value"');for(o=0;o<r-t;++o)this[o+t]=a[o%i]}return this};const U={};function B(e,t,r){U[e]=class extends r{constructor(){super(),Object.defineProperty(this,"message",{value:t.apply(this,arguments),writable:!0,configurable:!0}),this.name=`${this.name} [${e}]`,this.stack,delete this.name}get code(){return e}set code(e){Object.defineProperty(this,"code",{configurable:!0,enumerable:!0,value:e,writable:!0})}toString(){return`${this.name} [${e}]: ${this.message}`}}}function q(e){let t="",r=e.length;const n="-"===e[0]?1:0;for(;r>=n+4;r-=3)t=`_${e.slice(r-3,r)}${t}`;return`${e.slice(0,r)}${t}`}function z(e,t,r,n,o,a){if(e>r||e<t){const n="bigint"==typeof t?"n":"";let o;throw o=a>3?0===t||t===BigInt(0)?`>= 0${n} and < 2${n} ** ${8*(a+1)}${n}`:`>= -(2${n} ** ${8*(a+1)-1}${n}) and < 2 ** ${8*(a+1)-1}${n}`:`>= ${t}${n} and <= ${r}${n}`,new U.ERR_OUT_OF_RANGE("value",o,e)}!function(e,t,r){M(t,"offset"),void 0!==e[t]&&void 0!==e[t+r]||H(t,e.length-(r+1))}(n,o,a)}function M(e,t){if("number"!=typeof e)throw new U.ERR_INVALID_ARG_TYPE(t,"number",e)}function H(e,t,r){if(Math.floor(e)!==e)throw M(e,r),new U.ERR_OUT_OF_RANGE(r||"offset","an integer",e);if(t<0)throw new U.ERR_BUFFER_OUT_OF_BOUNDS;throw new U.ERR_OUT_OF_RANGE(r||"offset",`>= ${r?1:0} and <= ${t}`,e)}B("ERR_BUFFER_OUT_OF_BOUNDS",(function(e){return e?`${e} is outside of buffer bounds`:"Attempt to access memory outside buffer bounds"}),RangeError),B("ERR_INVALID_ARG_TYPE",(function(e,t){return`The "${e}" argument must be of type number. Received type ${typeof t}`}),TypeError),B("ERR_OUT_OF_RANGE",(function(e,t,r){let n=`The value of "${e}" is out of range.`,o=r;return Number.isInteger(r)&&Math.abs(r)>2**32?o=q(String(r)):"bigint"==typeof r&&(o=String(r),(r>BigInt(2)**BigInt(32)||r<-(BigInt(2)**BigInt(32)))&&(o=q(o)),o+="n"),n+=` It must be ${t}. Received ${o}`,n}),RangeError);const W=/[^+/0-9A-Za-z-_]/g;function V(e,t){let r;t=t||1/0;const n=e.length;let o=null;const a=[];for(let i=0;i<n;++i){if(r=e.charCodeAt(i),r>55295&&r<57344){if(!o){if(r>56319){(t-=3)>-1&&a.push(239,191,189);continue}if(i+1===n){(t-=3)>-1&&a.push(239,191,189);continue}o=r;continue}if(r<56320){(t-=3)>-1&&a.push(239,191,189),o=r;continue}r=65536+(o-55296<<10|r-56320)}else o&&(t-=3)>-1&&a.push(239,191,189);if(o=null,r<128){if((t-=1)<0)break;a.push(r)}else if(r<2048){if((t-=2)<0)break;a.push(r>>6|192,63&r|128)}else if(r<65536){if((t-=3)<0)break;a.push(r>>12|224,r>>6&63|128,63&r|128)}else{if(!(r<1114112))throw new Error("Invalid code point");if((t-=4)<0)break;a.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}}return a}function G(e){return n.toByteArray(function(e){if((e=(e=e.split("=")[0]).trim().replace(W,"")).length<2)return"";for(;e.length%4!=0;)e+="=";return e}(e))}function K(e,t,r,n){let o;for(o=0;o<n&&!(o+r>=t.length||o>=e.length);++o)t[o+r]=e[o];return o}function J(e,t){return e instanceof t||null!=e&&null!=e.constructor&&null!=e.constructor.name&&e.constructor.name===t.name}function Y(e){return e!=e}const Z=function(){const e="0123456789abcdef",t=new Array(256);for(let r=0;r<16;++r){const n=16*r;for(let o=0;o<16;++o)t[n+o]=e[r]+e[o]}return t}();function Q(e){return"undefined"==typeof BigInt?X:e}function X(){throw new Error("BigInt not supported")}},645:(e,t)=>{t.read=function(e,t,r,n,o){var a,i,s=8*o-n-1,l=(1<<s)-1,c=l>>1,p=-7,d=r?o-1:0,u=r?-1:1,h=e[t+d];for(d+=u,a=h&(1<<-p)-1,h>>=-p,p+=s;p>0;a=256*a+e[t+d],d+=u,p-=8);for(i=a&(1<<-p)-1,a>>=-p,p+=n;p>0;i=256*i+e[t+d],d+=u,p-=8);if(0===a)a=1-c;else{if(a===l)return i?NaN:1/0*(h?-1:1);i+=Math.pow(2,n),a-=c}return(h?-1:1)*i*Math.pow(2,a-n)},t.write=function(e,t,r,n,o,a){var i,s,l,c=8*a-o-1,p=(1<<c)-1,d=p>>1,u=23===o?Math.pow(2,-24)-Math.pow(2,-77):0,h=n?0:a-1,f=n?1:-1,m=t<0||0===t&&1/t<0?1:0;for(t=Math.abs(t),isNaN(t)||t===1/0?(s=isNaN(t)?1:0,i=p):(i=Math.floor(Math.log(t)/Math.LN2),t*(l=Math.pow(2,-i))<1&&(i--,l*=2),(t+=i+d>=1?u/l:u*Math.pow(2,1-d))*l>=2&&(i++,l/=2),i+d>=p?(s=0,i=p):i+d>=1?(s=(t*l-1)*Math.pow(2,o),i+=d):(s=t*Math.pow(2,d-1)*Math.pow(2,o),i=0));o>=8;e[r+h]=255&s,h+=f,s/=256,o-=8);for(i=i<<o|s,c+=o;c>0;e[r+h]=255&i,h+=f,i/=256,c-=8);e[r+h-f]|=128*m}},874:()=>{!function(e){var t="\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b",r={pattern:/(^(["']?)\w+\2)[ \t]+\S.*/,lookbehind:!0,alias:"punctuation",inside:null},n={bash:r,environment:{pattern:RegExp("\\$"+t),alias:"constant"},variable:[{pattern:/\$?\(\([\s\S]+?\)\)/,greedy:!0,inside:{variable:[{pattern:/(^\$\(\([\s\S]+)\)\)/,lookbehind:!0},/^\$\(\(/],number:/\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,operator:/--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,punctuation:/\(\(?|\)\)?|,|;/}},{pattern:/\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,greedy:!0,inside:{variable:/^\$\(|^`|\)$|`$/}},{pattern:/\$\{[^}]+\}/,greedy:!0,inside:{operator:/:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,punctuation:/[\[\]]/,environment:{pattern:RegExp("(\\{)"+t),lookbehind:!0,alias:"constant"}}},/\$(?:\w+|[#?*!@$])/],entity:/\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/};e.languages.bash={shebang:{pattern:/^#!\s*\/.*/,alias:"important"},comment:{pattern:/(^|[^"{\\$])#.*/,lookbehind:!0},"function-name":[{pattern:/(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,lookbehind:!0,alias:"function"},{pattern:/\b[\w-]+(?=\s*\(\s*\)\s*\{)/,alias:"function"}],"for-or-select":{pattern:/(\b(?:for|select)\s+)\w+(?=\s+in\s)/,alias:"variable",lookbehind:!0},"assign-left":{pattern:/(^|[\s;|&]|[<>]\()\w+(?:\.\w+)*(?=\+?=)/,inside:{environment:{pattern:RegExp("(^|[\\s;|&]|[<>]\\()"+t),lookbehind:!0,alias:"constant"}},alias:"variable",lookbehind:!0},parameter:{pattern:/(^|\s)-{1,2}(?:\w+:[+-]?)?\w+(?:\.\w+)*(?=[=\s]|$)/,alias:"variable",lookbehind:!0},string:[{pattern:/((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,lookbehind:!0,greedy:!0,inside:n},{pattern:/((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,lookbehind:!0,greedy:!0,inside:{bash:r}},{pattern:/(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,lookbehind:!0,greedy:!0,inside:n},{pattern:/(^|[^$\\])'[^']*'/,lookbehind:!0,greedy:!0},{pattern:/\$'(?:[^'\\]|\\[\s\S])*'/,greedy:!0,inside:{entity:n.entity}}],environment:{pattern:RegExp("\\$?"+t),alias:"constant"},variable:n.variable,function:{pattern:/(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cargo|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|java|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|sysctl|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,lookbehind:!0},keyword:{pattern:/(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,lookbehind:!0},builtin:{pattern:/(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,lookbehind:!0,alias:"class-name"},boolean:{pattern:/(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,lookbehind:!0},"file-descriptor":{pattern:/\B&\d\b/,alias:"important"},operator:{pattern:/\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,inside:{"file-descriptor":{pattern:/^\d/,alias:"important"}}},punctuation:/\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,number:{pattern:/(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,lookbehind:!0}},r.inside=e.languages.bash;for(var o=["comment","function-name","for-or-select","assign-left","parameter","string","environment","function","keyword","builtin","boolean","file-descriptor","operator","punctuation","number"],a=n.variable[1].inside,i=0;i<o.length;i++)a[o[i]]=e.languages.bash[o[i]];e.languages.sh=e.languages.bash,e.languages.shell=e.languages.bash}(Prism)},16:()=>{!function(e){function t(e,t){return e.replace(/<<(\d+)>>/g,(function(e,r){return"(?:"+t[+r]+")"}))}function r(e,r,n){return RegExp(t(e,r),n||"")}function n(e,t){for(var r=0;r<t;r++)e=e.replace(/<<self>>/g,(function(){return"(?:"+e+")"}));return e.replace(/<<self>>/g,"[^\\s\\S]")}var o="bool byte char decimal double dynamic float int long object sbyte short string uint ulong ushort var void",a="class enum interface record struct",i="add alias and ascending async await by descending from(?=\\s*(?:\\w|$)) get global group into init(?=\\s*;) join let nameof not notnull on or orderby partial remove select set unmanaged value when where with(?=\\s*{)",s="abstract as base break case catch checked const continue default delegate do else event explicit extern finally fixed for foreach goto if implicit in internal is lock namespace new null operator out override params private protected public readonly ref return sealed sizeof stackalloc static switch this throw try typeof unchecked unsafe using virtual volatile while yield";function l(e){return"\\b(?:"+e.trim().replace(/ /g,"|")+")\\b"}var c=l(a),p=RegExp(l(o+" "+a+" "+i+" "+s)),d=l(a+" "+i+" "+s),u=l(o+" "+a+" "+s),h=n(/<(?:[^<>;=+\-*/%&|^]|<<self>>)*>/.source,2),f=n(/\((?:[^()]|<<self>>)*\)/.source,2),m=/@?\b[A-Za-z_]\w*\b/.source,y=t(/<<0>>(?:\s*<<1>>)?/.source,[m,h]),g=t(/(?!<<0>>)<<1>>(?:\s*\.\s*<<1>>)*/.source,[d,y]),v=/\[\s*(?:,\s*)*\]/.source,b=t(/<<0>>(?:\s*(?:\?\s*)?<<1>>)*(?:\s*\?)?/.source,[g,v]),x=t(/[^,()<>[\];=+\-*/%&|^]|<<0>>|<<1>>|<<2>>/.source,[h,f,v]),w=t(/\(<<0>>+(?:,<<0>>+)+\)/.source,[x]),$=t(/(?:<<0>>|<<1>>)(?:\s*(?:\?\s*)?<<2>>)*(?:\s*\?)?/.source,[w,g,v]),k={keyword:p,punctuation:/[<>()?,.:[\]]/},S=/'(?:[^\r\n'\\]|\\.|\\[Uux][\da-fA-F]{1,8})'/.source,A=/"(?:\\.|[^\\"\r\n])*"/.source,E=/@"(?:""|\\[\s\S]|[^\\"])*"(?!")/.source;e.languages.csharp=e.languages.extend("clike",{string:[{pattern:r(/(^|[^$\\])<<0>>/.source,[E]),lookbehind:!0,greedy:!0},{pattern:r(/(^|[^@$\\])<<0>>/.source,[A]),lookbehind:!0,greedy:!0}],"class-name":[{pattern:r(/(\busing\s+static\s+)<<0>>(?=\s*;)/.source,[g]),lookbehind:!0,inside:k},{pattern:r(/(\busing\s+<<0>>\s*=\s*)<<1>>(?=\s*;)/.source,[m,$]),lookbehind:!0,inside:k},{pattern:r(/(\busing\s+)<<0>>(?=\s*=)/.source,[m]),lookbehind:!0},{pattern:r(/(\b<<0>>\s+)<<1>>/.source,[c,y]),lookbehind:!0,inside:k},{pattern:r(/(\bcatch\s*\(\s*)<<0>>/.source,[g]),lookbehind:!0,inside:k},{pattern:r(/(\bwhere\s+)<<0>>/.source,[m]),lookbehind:!0},{pattern:r(/(\b(?:is(?:\s+not)?|as)\s+)<<0>>/.source,[b]),lookbehind:!0,inside:k},{pattern:r(/\b<<0>>(?=\s+(?!<<1>>|with\s*\{)<<2>>(?:\s*[=,;:{)\]]|\s+(?:in|when)\b))/.source,[$,u,m]),inside:k}],keyword:p,number:/(?:\b0(?:x[\da-f_]*[\da-f]|b[01_]*[01])|(?:\B\.\d+(?:_+\d+)*|\b\d+(?:_+\d+)*(?:\.\d+(?:_+\d+)*)?)(?:e[-+]?\d+(?:_+\d+)*)?)(?:[dflmu]|lu|ul)?\b/i,operator:/>>=?|<<=?|[-=]>|([-+&|])\1|~|\?\?=?|[-+*/%&|^!=<>]=?/,punctuation:/\?\.?|::|[{}[\];(),.:]/}),e.languages.insertBefore("csharp","number",{range:{pattern:/\.\./,alias:"operator"}}),e.languages.insertBefore("csharp","punctuation",{"named-parameter":{pattern:r(/([(,]\s*)<<0>>(?=\s*:)/.source,[m]),lookbehind:!0,alias:"punctuation"}}),e.languages.insertBefore("csharp","class-name",{namespace:{pattern:r(/(\b(?:namespace|using)\s+)<<0>>(?:\s*\.\s*<<0>>)*(?=\s*[;{])/.source,[m]),lookbehind:!0,inside:{punctuation:/\./}},"type-expression":{pattern:r(/(\b(?:default|sizeof|typeof)\s*\(\s*(?!\s))(?:[^()\s]|\s(?!\s)|<<0>>)*(?=\s*\))/.source,[f]),lookbehind:!0,alias:"class-name",inside:k},"return-type":{pattern:r(/<<0>>(?=\s+(?:<<1>>\s*(?:=>|[({]|\.\s*this\s*\[)|this\s*\[))/.source,[$,g]),inside:k,alias:"class-name"},"constructor-invocation":{pattern:r(/(\bnew\s+)<<0>>(?=\s*[[({])/.source,[$]),lookbehind:!0,inside:k,alias:"class-name"},"generic-method":{pattern:r(/<<0>>\s*<<1>>(?=\s*\()/.source,[m,h]),inside:{function:r(/^<<0>>/.source,[m]),generic:{pattern:RegExp(h),alias:"class-name",inside:k}}},"type-list":{pattern:r(/\b((?:<<0>>\s+<<1>>|record\s+<<1>>\s*<<5>>|where\s+<<2>>)\s*:\s*)(?:<<3>>|<<4>>|<<1>>\s*<<5>>|<<6>>)(?:\s*,\s*(?:<<3>>|<<4>>|<<6>>))*(?=\s*(?:where|[{;]|=>|$))/.source,[c,y,m,$,p.source,f,/\bnew\s*\(\s*\)/.source]),lookbehind:!0,inside:{"record-arguments":{pattern:r(/(^(?!new\s*\()<<0>>\s*)<<1>>/.source,[y,f]),lookbehind:!0,greedy:!0,inside:e.languages.csharp},keyword:p,"class-name":{pattern:RegExp($),greedy:!0,inside:k},punctuation:/[,()]/}},preprocessor:{pattern:/(^[\t ]*)#.*/m,lookbehind:!0,alias:"property",inside:{directive:{pattern:/(#)\b(?:define|elif|else|endif|endregion|error|if|line|nullable|pragma|region|undef|warning)\b/,lookbehind:!0,alias:"keyword"}}}});var O=A+"|"+S,T=t(/\/(?![*/])|\/\/[^\r\n]*[\r\n]|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>/.source,[O]),C=n(t(/[^"'/()]|<<0>>|\(<<self>>*\)/.source,[T]),2),_=/\b(?:assembly|event|field|method|module|param|property|return|type)\b/.source,j=t(/<<0>>(?:\s*\(<<1>>*\))?/.source,[g,C]);e.languages.insertBefore("csharp","class-name",{attribute:{pattern:r(/((?:^|[^\s\w>)?])\s*\[\s*)(?:<<0>>\s*:\s*)?<<1>>(?:\s*,\s*<<1>>)*(?=\s*\])/.source,[_,j]),lookbehind:!0,greedy:!0,inside:{target:{pattern:r(/^<<0>>(?=\s*:)/.source,[_]),alias:"keyword"},"attribute-arguments":{pattern:r(/\(<<0>>*\)/.source,[C]),inside:e.languages.csharp},"class-name":{pattern:RegExp(g),inside:{punctuation:/\./}},punctuation:/[:,]/}}});var I=/:[^}\r\n]+/.source,P=n(t(/[^"'/()]|<<0>>|\(<<self>>*\)/.source,[T]),2),R=t(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source,[P,I]),L=n(t(/[^"'/()]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>|\(<<self>>*\)/.source,[O]),2),N=t(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source,[L,I]);function D(t,n){return{interpolation:{pattern:r(/((?:^|[^{])(?:\{\{)*)<<0>>/.source,[t]),lookbehind:!0,inside:{"format-string":{pattern:r(/(^\{(?:(?![}:])<<0>>)*)<<1>>(?=\}$)/.source,[n,I]),lookbehind:!0,inside:{punctuation:/^:/}},punctuation:/^\{|\}$/,expression:{pattern:/[\s\S]+/,alias:"language-csharp",inside:e.languages.csharp}}},string:/[\s\S]+/}}e.languages.insertBefore("csharp","string",{"interpolation-string":[{pattern:r(/(^|[^\\])(?:\$@|@\$)"(?:""|\\[\s\S]|\{\{|<<0>>|[^\\{"])*"/.source,[R]),lookbehind:!0,greedy:!0,inside:D(R,P)},{pattern:r(/(^|[^@\\])\$"(?:\\.|\{\{|<<0>>|[^\\"{])*"/.source,[N]),lookbehind:!0,greedy:!0,inside:D(N,L)}],char:{pattern:RegExp(S),greedy:!0}}),e.languages.dotnet=e.languages.cs=e.languages.csharp}(Prism)},251:()=>{!function(e){var t=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;e.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:"+/[^;{\s"']|\s+(?!\s)/.source+"|"+t.source+")*?"+/(?:;|(?=\s*\{))/.source),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+t.source+"|"+/(?:[^\\\r\n()"']|\\[\s\S])*/.source+")\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+t.source+"$"),alias:"url"}}},selector:{pattern:RegExp("(^|[{}\\s])[^{}\\s](?:[^{};\"'\\s]|\\s+(?![\\s{])|"+t.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:t,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},e.languages.css.atrule.inside.rest=e.languages.css;var r=e.languages.markup;r&&(r.tag.addInlined("style","css"),r.tag.addAttribute("style","css"))}(Prism)},46:()=>{Prism.languages.go=Prism.languages.extend("clike",{string:{pattern:/(^|[^\\])"(?:\\.|[^"\\\r\n])*"|`[^`]*`/,lookbehind:!0,greedy:!0},keyword:/\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go(?:to)?|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/,boolean:/\b(?:_|false|iota|nil|true)\b/,number:[/\b0(?:b[01_]+|o[0-7_]+)i?\b/i,/\b0x(?:[a-f\d_]+(?:\.[a-f\d_]*)?|\.[a-f\d_]+)(?:p[+-]?\d+(?:_\d+)*)?i?(?!\w)/i,/(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?[\d_]+)?i?(?!\w)/i],operator:/[*\/%^!=]=?|\+[=+]?|-[=-]?|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\./,builtin:/\b(?:append|bool|byte|cap|close|complex|complex(?:64|128)|copy|delete|error|float(?:32|64)|u?int(?:8|16|32|64)?|imag|len|make|new|panic|print(?:ln)?|real|recover|rune|string|uintptr)\b/}),Prism.languages.insertBefore("go","string",{char:{pattern:/'(?:\\.|[^'\\\r\n]){0,10}'/,greedy:!0}}),delete Prism.languages.go["class-name"]},57:()=>{!function(e){function t(e){return RegExp("(^(?:"+e+"):[ \t]*(?![ \t]))[^]+","i")}e.languages.http={"request-line":{pattern:/^(?:CONNECT|DELETE|GET|HEAD|OPTIONS|PATCH|POST|PRI|PUT|SEARCH|TRACE)\s(?:https?:\/\/|\/)\S*\sHTTP\/[\d.]+/m,inside:{method:{pattern:/^[A-Z]+\b/,alias:"property"},"request-target":{pattern:/^(\s)(?:https?:\/\/|\/)\S*(?=\s)/,lookbehind:!0,alias:"url",inside:e.languages.uri},"http-version":{pattern:/^(\s)HTTP\/[\d.]+/,lookbehind:!0,alias:"property"}}},"response-status":{pattern:/^HTTP\/[\d.]+ \d+ .+/m,inside:{"http-version":{pattern:/^HTTP\/[\d.]+/,alias:"property"},"status-code":{pattern:/^(\s)\d+(?=\s)/,lookbehind:!0,alias:"number"},"reason-phrase":{pattern:/^(\s).+/,lookbehind:!0,alias:"string"}}},header:{pattern:/^[\w-]+:.+(?:(?:\r\n?|\n)[ \t].+)*/m,inside:{"header-value":[{pattern:t(/Content-Security-Policy/.source),lookbehind:!0,alias:["csp","languages-csp"],inside:e.languages.csp},{pattern:t(/Public-Key-Pins(?:-Report-Only)?/.source),lookbehind:!0,alias:["hpkp","languages-hpkp"],inside:e.languages.hpkp},{pattern:t(/Strict-Transport-Security/.source),lookbehind:!0,alias:["hsts","languages-hsts"],inside:e.languages.hsts},{pattern:t(/[^:]+/.source),lookbehind:!0}],"header-name":{pattern:/^[^:]+/,alias:"keyword"},punctuation:/^:/}}};var r,n=e.languages,o={"application/javascript":n.javascript,"application/json":n.json||n.javascript,"application/xml":n.xml,"text/xml":n.xml,"text/html":n.html,"text/css":n.css,"text/plain":n.plain},a={"application/json":!0,"application/xml":!0};function i(e){var t=e.replace(/^[a-z]+\//,"");return"(?:"+e+"|"+("\\w+/(?:[\\w.-]+\\+)+"+t+"(?![+\\w.-])")+")"}for(var s in o)if(o[s]){r=r||{};var l=a[s]?i(s):s;r[s.replace(/\//g,"-")]={pattern:RegExp("("+/content-type:\s*/.source+l+/(?:(?:\r\n?|\n)[\w-].*)*(?:\r(?:\n|(?!\n))|\n)/.source+")"+/[^ \t\w-][\s\S]*/.source,"i"),lookbehind:!0,inside:o[s]}}r&&e.languages.insertBefore("http","header",r)}(Prism)},503:()=>{!function(e){var t=/\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|non-sealed|null|open|opens|package|permits|private|protected|provides|public|record(?!\s*[(){}[\]<>=%~.:,;?+\-*/&|^])|requires|return|sealed|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/,r=/(?:[a-z]\w*\s*\.\s*)*(?:[A-Z]\w*\s*\.\s*)*/.source,n={pattern:RegExp(/(^|[^\w.])/.source+r+/[A-Z](?:[\d_A-Z]*[a-z]\w*)?\b/.source),lookbehind:!0,inside:{namespace:{pattern:/^[a-z]\w*(?:\s*\.\s*[a-z]\w*)*(?:\s*\.)?/,inside:{punctuation:/\./}},punctuation:/\./}};e.languages.java=e.languages.extend("clike",{string:{pattern:/(^|[^\\])"(?:\\.|[^"\\\r\n])*"/,lookbehind:!0,greedy:!0},"class-name":[n,{pattern:RegExp(/(^|[^\w.])/.source+r+/[A-Z]\w*(?=\s+\w+\s*[;,=()]|\s*(?:\[[\s,]*\]\s*)?::\s*new\b)/.source),lookbehind:!0,inside:n.inside},{pattern:RegExp(/(\b(?:class|enum|extends|implements|instanceof|interface|new|record|throws)\s+)/.source+r+/[A-Z]\w*\b/.source),lookbehind:!0,inside:n.inside}],keyword:t,function:[e.languages.clike.function,{pattern:/(::\s*)[a-z_]\w*/,lookbehind:!0}],number:/\b0b[01][01_]*L?\b|\b0x(?:\.[\da-f_p+-]+|[\da-f_]+(?:\.[\da-f_p+-]+)?)\b|(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,operator:{pattern:/(^|[^.])(?:<<=?|>>>?=?|->|--|\+\+|&&|\|\||::|[?:~]|[-+*/%&|^!=<>]=?)/m,lookbehind:!0},constant:/\b[A-Z][A-Z_\d]+\b/}),e.languages.insertBefore("java","string",{"triple-quoted-string":{pattern:/"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*"""/,greedy:!0,alias:"string"},char:{pattern:/'(?:\\.|[^'\\\r\n]){1,6}'/,greedy:!0}}),e.languages.insertBefore("java","class-name",{annotation:{pattern:/(^|[^.])@\w+(?:\s*\.\s*\w+)*/,lookbehind:!0,alias:"punctuation"},generics:{pattern:/<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&))*>)*>)*>)*>/,inside:{"class-name":n,keyword:t,punctuation:/[<>(),.:]/,operator:/[?&|]/}},import:[{pattern:RegExp(/(\bimport\s+)/.source+r+/(?:[A-Z]\w*|\*)(?=\s*;)/.source),lookbehind:!0,inside:{namespace:n.inside.namespace,punctuation:/\./,operator:/\*/,"class-name":/\w+/}},{pattern:RegExp(/(\bimport\s+static\s+)/.source+r+/(?:\w+|\*)(?=\s*;)/.source),lookbehind:!0,alias:"static",inside:{namespace:n.inside.namespace,static:/\b\w+$/,punctuation:/\./,operator:/\*/,"class-name":/\w+/}}],namespace:{pattern:RegExp(/(\b(?:exports|import(?:\s+static)?|module|open|opens|package|provides|requires|to|transitive|uses|with)\s+)(?!<keyword>)[a-z]\w*(?:\.[a-z]\w*)*\.?/.source.replace(/<keyword>/g,(function(){return t.source}))),lookbehind:!0,inside:{punctuation:/\./}}})}(Prism)},277:()=>{Prism.languages.json={property:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,lookbehind:!0,greedy:!0},string:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,lookbehind:!0,greedy:!0},comment:{pattern:/\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,greedy:!0},number:/-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,punctuation:/[{}[\],]/,operator:/:/,boolean:/\b(?:false|true)\b/,null:{pattern:/\bnull\b/,alias:"keyword"}},Prism.languages.webmanifest=Prism.languages.json},366:()=>{Prism.languages.python={comment:{pattern:/(^|[^\\])#.*/,lookbehind:!0,greedy:!0},"string-interpolation":{pattern:/(?:f|fr|rf)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,greedy:!0,inside:{interpolation:{pattern:/((?:^|[^{])(?:\{\{)*)\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}])+\})+\})+\}/,lookbehind:!0,inside:{"format-spec":{pattern:/(:)[^:(){}]+(?=\}$)/,lookbehind:!0},"conversion-option":{pattern:/![sra](?=[:}]$)/,alias:"punctuation"},rest:null}},string:/[\s\S]+/}},"triple-quoted-string":{pattern:/(?:[rub]|br|rb)?("""|''')[\s\S]*?\1/i,greedy:!0,alias:"string"},string:{pattern:/(?:[rub]|br|rb)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,greedy:!0},function:{pattern:/((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,lookbehind:!0},"class-name":{pattern:/(\bclass\s+)\w+/i,lookbehind:!0},decorator:{pattern:/(^[\t ]*)@\w+(?:\.\w+)*/m,lookbehind:!0,alias:["annotation","punctuation"],inside:{punctuation:/\./}},keyword:/\b(?:_(?=\s*:)|and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,builtin:/\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,boolean:/\b(?:False|None|True)\b/,number:/\b0(?:b(?:_?[01])+|o(?:_?[0-7])+|x(?:_?[a-f0-9])+)\b|(?:\b\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\B\.\d+(?:_\d+)*)(?:e[+-]?\d+(?:_\d+)*)?j?(?!\w)/i,operator:/[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,punctuation:/[{}[\];(),.:]/},Prism.languages.python["string-interpolation"].inside.interpolation.inside.rest=Prism.languages.python,Prism.languages.py=Prism.languages.python},358:()=>{!function(e){var t=/[*&][^\s[\]{},]+/,r=/!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/,n="(?:"+r.source+"(?:[ \t]+"+t.source+")?|"+t.source+"(?:[ \t]+"+r.source+")?)",o=/(?:[^\s\x00-\x08\x0e-\x1f!"#%&'*,\-:>?@[\]`{|}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]|[?:-]<PLAIN>)(?:[ \t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*/.source.replace(/<PLAIN>/g,(function(){return/[^\s\x00-\x08\x0e-\x1f,[\]{}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]/.source})),a=/"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\\\r\n]|\\.)*'/.source;function i(e,t){t=(t||"").replace(/m/g,"")+"m";var r=/([:\-,[{]\s*(?:\s<<prop>>[ \t]+)?)(?:<<value>>)(?=[ \t]*(?:$|,|\]|\}|(?:[\r\n]\s*)?#))/.source.replace(/<<prop>>/g,(function(){return n})).replace(/<<value>>/g,(function(){return e}));return RegExp(r,t)}e.languages.yaml={scalar:{pattern:RegExp(/([\-:]\s*(?:\s<<prop>>[ \t]+)?[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)\S[^\r\n]*(?:\2[^\r\n]+)*)/.source.replace(/<<prop>>/g,(function(){return n}))),lookbehind:!0,alias:"string"},comment:/#.*/,key:{pattern:RegExp(/((?:^|[:\-,[{\r\n?])[ \t]*(?:<<prop>>[ \t]+)?)<<key>>(?=\s*:\s)/.source.replace(/<<prop>>/g,(function(){return n})).replace(/<<key>>/g,(function(){return"(?:"+o+"|"+a+")"}))),lookbehind:!0,greedy:!0,alias:"atrule"},directive:{pattern:/(^[ \t]*)%.+/m,lookbehind:!0,alias:"important"},datetime:{pattern:i(/\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?(?:[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?))?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?/.source),lookbehind:!0,alias:"number"},boolean:{pattern:i(/false|true/.source,"i"),lookbehind:!0,alias:"important"},null:{pattern:i(/null|~/.source,"i"),lookbehind:!0,alias:"important"},string:{pattern:i(a),lookbehind:!0,greedy:!0},number:{pattern:i(/[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|\.inf|\.nan)/.source,"i"),lookbehind:!0},tag:r,important:t,punctuation:/---|[:[\]{}\-,|>?]|\.\.\./},e.languages.yml=e.languages.yaml}(Prism)},660:(e,t,r)=>{var n=function(e){var t=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,r=0,n={},o={manual:e.Prism&&e.Prism.manual,disableWorkerMessageHandler:e.Prism&&e.Prism.disableWorkerMessageHandler,util:{encode:function e(t){return t instanceof a?new a(t.type,e(t.content),t.alias):Array.isArray(t)?t.map(e):t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(e){return Object.prototype.toString.call(e).slice(8,-1)},objId:function(e){return e.__id||Object.defineProperty(e,"__id",{value:++r}),e.__id},clone:function e(t,r){var n,a;switch(r=r||{},o.util.type(t)){case"Object":if(a=o.util.objId(t),r[a])return r[a];for(var i in n={},r[a]=n,t)t.hasOwnProperty(i)&&(n[i]=e(t[i],r));return n;case"Array":return a=o.util.objId(t),r[a]?r[a]:(n=[],r[a]=n,t.forEach((function(t,o){n[o]=e(t,r)})),n);default:return t}},getLanguage:function(e){for(;e;){var r=t.exec(e.className);if(r)return r[1].toLowerCase();e=e.parentElement}return"none"},setLanguage:function(e,r){e.className=e.className.replace(RegExp(t,"gi"),""),e.classList.add("language-"+r)},currentScript:function(){if("undefined"==typeof document)return null;if("currentScript"in document)return document.currentScript;try{throw new Error}catch(n){var e=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(n.stack)||[])[1];if(e){var t=document.getElementsByTagName("script");for(var r in t)if(t[r].src==e)return t[r]}return null}},isActive:function(e,t,r){for(var n="no-"+t;e;){var o=e.classList;if(o.contains(t))return!0;if(o.contains(n))return!1;e=e.parentElement}return!!r}},languages:{plain:n,plaintext:n,text:n,txt:n,extend:function(e,t){var r=o.util.clone(o.languages[e]);for(var n in t)r[n]=t[n];return r},insertBefore:function(e,t,r,n){var a=(n=n||o.languages)[e],i={};for(var s in a)if(a.hasOwnProperty(s)){if(s==t)for(var l in r)r.hasOwnProperty(l)&&(i[l]=r[l]);r.hasOwnProperty(s)||(i[s]=a[s])}var c=n[e];return n[e]=i,o.languages.DFS(o.languages,(function(t,r){r===c&&t!=e&&(this[t]=i)})),i},DFS:function e(t,r,n,a){a=a||{};var i=o.util.objId;for(var s in t)if(t.hasOwnProperty(s)){r.call(t,s,t[s],n||s);var l=t[s],c=o.util.type(l);"Object"!==c||a[i(l)]?"Array"!==c||a[i(l)]||(a[i(l)]=!0,e(l,r,s,a)):(a[i(l)]=!0,e(l,r,null,a))}}},plugins:{},highlightAll:function(e,t){o.highlightAllUnder(document,e,t)},highlightAllUnder:function(e,t,r){var n={callback:r,container:e,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};o.hooks.run("before-highlightall",n),n.elements=Array.prototype.slice.apply(n.container.querySelectorAll(n.selector)),o.hooks.run("before-all-elements-highlight",n);for(var a,i=0;a=n.elements[i++];)o.highlightElement(a,!0===t,n.callback)},highlightElement:function(t,r,n){var a=o.util.getLanguage(t),i=o.languages[a];o.util.setLanguage(t,a);var s=t.parentElement;s&&"pre"===s.nodeName.toLowerCase()&&o.util.setLanguage(s,a);var l={element:t,language:a,grammar:i,code:t.textContent};function c(e){l.highlightedCode=e,o.hooks.run("before-insert",l),l.element.innerHTML=l.highlightedCode,o.hooks.run("after-highlight",l),o.hooks.run("complete",l),n&&n.call(l.element)}if(o.hooks.run("before-sanity-check",l),(s=l.element.parentElement)&&"pre"===s.nodeName.toLowerCase()&&!s.hasAttribute("tabindex")&&s.setAttribute("tabindex","0"),!l.code)return o.hooks.run("complete",l),void(n&&n.call(l.element));if(o.hooks.run("before-highlight",l),l.grammar)if(r&&e.Worker){var p=new Worker(o.filename);p.onmessage=function(e){c(e.data)},p.postMessage(JSON.stringify({language:l.language,code:l.code,immediateClose:!0}))}else c(o.highlight(l.code,l.grammar,l.language));else c(o.util.encode(l.code))},highlight:function(e,t,r){var n={code:e,grammar:t,language:r};if(o.hooks.run("before-tokenize",n),!n.grammar)throw new Error('The language "'+n.language+'" has no grammar.');return n.tokens=o.tokenize(n.code,n.grammar),o.hooks.run("after-tokenize",n),a.stringify(o.util.encode(n.tokens),n.language)},tokenize:function(e,t){var r=t.rest;if(r){for(var n in r)t[n]=r[n];delete t.rest}var o=new l;return c(o,o.head,e),s(e,o,t,o.head,0),function(e){var t=[],r=e.head.next;for(;r!==e.tail;)t.push(r.value),r=r.next;return t}(o)},hooks:{all:{},add:function(e,t){var r=o.hooks.all;r[e]=r[e]||[],r[e].push(t)},run:function(e,t){var r=o.hooks.all[e];if(r&&r.length)for(var n,a=0;n=r[a++];)n(t)}},Token:a};function a(e,t,r,n){this.type=e,this.content=t,this.alias=r,this.length=0|(n||"").length}function i(e,t,r,n){e.lastIndex=t;var o=e.exec(r);if(o&&n&&o[1]){var a=o[1].length;o.index+=a,o[0]=o[0].slice(a)}return o}function s(e,t,r,n,l,d){for(var u in r)if(r.hasOwnProperty(u)&&r[u]){var h=r[u];h=Array.isArray(h)?h:[h];for(var f=0;f<h.length;++f){if(d&&d.cause==u+","+f)return;var m=h[f],y=m.inside,g=!!m.lookbehind,v=!!m.greedy,b=m.alias;if(v&&!m.pattern.global){var x=m.pattern.toString().match(/[imsuy]*$/)[0];m.pattern=RegExp(m.pattern.source,x+"g")}for(var w=m.pattern||m,$=n.next,k=l;$!==t.tail&&!(d&&k>=d.reach);k+=$.value.length,$=$.next){var S=$.value;if(t.length>e.length)return;if(!(S instanceof a)){var A,E=1;if(v){if(!(A=i(w,k,e,g))||A.index>=e.length)break;var O=A.index,T=A.index+A[0].length,C=k;for(C+=$.value.length;O>=C;)C+=($=$.next).value.length;if(k=C-=$.value.length,$.value instanceof a)continue;for(var _=$;_!==t.tail&&(C<T||"string"==typeof _.value);_=_.next)E++,C+=_.value.length;E--,S=e.slice(k,C),A.index-=k}else if(!(A=i(w,0,S,g)))continue;O=A.index;var j=A[0],I=S.slice(0,O),P=S.slice(O+j.length),R=k+S.length;d&&R>d.reach&&(d.reach=R);var L=$.prev;if(I&&(L=c(t,L,I),k+=I.length),p(t,L,E),$=c(t,L,new a(u,y?o.tokenize(j,y):j,b,j)),P&&c(t,$,P),E>1){var N={cause:u+","+f,reach:R};s(e,t,r,$.prev,k,N),d&&N.reach>d.reach&&(d.reach=N.reach)}}}}}}function l(){var e={value:null,prev:null,next:null},t={value:null,prev:e,next:null};e.next=t,this.head=e,this.tail=t,this.length=0}function c(e,t,r){var n=t.next,o={value:r,prev:t,next:n};return t.next=o,n.prev=o,e.length++,o}function p(e,t,r){for(var n=t.next,o=0;o<r&&n!==e.tail;o++)n=n.next;t.next=n,n.prev=t,e.length-=o}if(e.Prism=o,a.stringify=function e(t,r){if("string"==typeof t)return t;if(Array.isArray(t)){var n="";return t.forEach((function(t){n+=e(t,r)})),n}var a={type:t.type,content:e(t.content,r),tag:"span",classes:["token",t.type],attributes:{},language:r},i=t.alias;i&&(Array.isArray(i)?Array.prototype.push.apply(a.classes,i):a.classes.push(i)),o.hooks.run("wrap",a);var s="";for(var l in a.attributes)s+=" "+l+'="'+(a.attributes[l]||"").replace(/"/g,"&quot;")+'"';return"<"+a.tag+' class="'+a.classes.join(" ")+'"'+s+">"+a.content+"</"+a.tag+">"},!e.document)return e.addEventListener?(o.disableWorkerMessageHandler||e.addEventListener("message",(function(t){var r=JSON.parse(t.data),n=r.language,a=r.code,i=r.immediateClose;e.postMessage(o.highlight(a,o.languages[n],n)),i&&e.close()}),!1),o):o;var d=o.util.currentScript();function u(){o.manual||o.highlightAll()}if(d&&(o.filename=d.src,d.hasAttribute("data-manual")&&(o.manual=!0)),!o.manual){var h=document.readyState;"loading"===h||"interactive"===h&&d&&d.defer?document.addEventListener("DOMContentLoaded",u):window.requestAnimationFrame?window.requestAnimationFrame(u):window.setTimeout(u,16)}return o}("undefined"!=typeof window?window:"undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?self:{});e.exports&&(e.exports=n),void 0!==r.g&&(r.g.Prism=n),n.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},n.languages.markup.tag.inside["attr-value"].inside.entity=n.languages.markup.entity,n.languages.markup.doctype.inside["internal-subset"].inside=n.languages.markup,n.hooks.add("wrap",(function(e){"entity"===e.type&&(e.attributes.title=e.content.replace(/&amp;/,"&"))})),Object.defineProperty(n.languages.markup.tag,"addInlined",{value:function(e,t){var r={};r["language-"+t]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:n.languages[t]},r.cdata=/^<!\[CDATA\[|\]\]>$/i;var o={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:r}};o["language-"+t]={pattern:/[\s\S]+/,inside:n.languages[t]};var a={};a[e]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,(function(){return e})),"i"),lookbehind:!0,greedy:!0,inside:o},n.languages.insertBefore("markup","cdata",a)}}),Object.defineProperty(n.languages.markup.tag,"addAttribute",{value:function(e,t){n.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+e+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[t,"language-"+t],inside:n.languages[t]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),n.languages.html=n.languages.markup,n.languages.mathml=n.languages.markup,n.languages.svg=n.languages.markup,n.languages.xml=n.languages.extend("markup",{}),n.languages.ssml=n.languages.xml,n.languages.atom=n.languages.xml,n.languages.rss=n.languages.xml,function(e){var t=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;e.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:"+/[^;{\s"']|\s+(?!\s)/.source+"|"+t.source+")*?"+/(?:;|(?=\s*\{))/.source),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+t.source+"|"+/(?:[^\\\r\n()"']|\\[\s\S])*/.source+")\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+t.source+"$"),alias:"url"}}},selector:{pattern:RegExp("(^|[{}\\s])[^{}\\s](?:[^{};\"'\\s]|\\s+(?![\\s{])|"+t.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:t,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},e.languages.css.atrule.inside.rest=e.languages.css;var r=e.languages.markup;r&&(r.tag.addInlined("style","css"),r.tag.addAttribute("style","css"))}(n),n.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},n.languages.javascript=n.languages.extend("clike",{"class-name":[n.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),n.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,n.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:n.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:n.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:n.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:n.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:n.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),n.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:n.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),n.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),n.languages.markup&&(n.languages.markup.tag.addInlined("script","javascript"),n.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript")),n.languages.js=n.languages.javascript,function(){if(void 0!==n&&"undefined"!=typeof document){Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var e={js:"javascript",py:"python",rb:"ruby",ps1:"powershell",psm1:"powershell",sh:"bash",bat:"batch",h:"c",tex:"latex"},t="data-src-status",r="loading",o="loaded",a='pre[data-src]:not([data-src-status="loaded"]):not([data-src-status="loading"])';n.hooks.add("before-highlightall",(function(e){e.selector+=", "+a})),n.hooks.add("before-sanity-check",(function(i){var s=i.element;if(s.matches(a)){i.code="",s.setAttribute(t,r);var l=s.appendChild(document.createElement("CODE"));l.textContent="Loading…";var c=s.getAttribute("data-src"),p=i.language;if("none"===p){var d=(/\.(\w+)$/.exec(c)||[,"none"])[1];p=e[d]||d}n.util.setLanguage(l,p),n.util.setLanguage(s,p);var u=n.plugins.autoloader;u&&u.loadLanguages(p),function(e,t,r){var n=new XMLHttpRequest;n.open("GET",e,!0),n.onreadystatechange=function(){4==n.readyState&&(n.status<400&&n.responseText?t(n.responseText):n.status>=400?r("✖ Error "+n.status+" while fetching file: "+n.statusText):r("✖ Error: File does not exist or is empty"))},n.send(null)}(c,(function(e){s.setAttribute(t,o);var r=function(e){var t=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(e||"");if(t){var r=Number(t[1]),n=t[2],o=t[3];return n?o?[r,Number(o)]:[r,void 0]:[r,r]}}(s.getAttribute("data-range"));if(r){var a=e.split(/\r\n?|\n/g),i=r[0],c=null==r[1]?a.length:r[1];i<0&&(i+=a.length),i=Math.max(0,Math.min(i-1,a.length)),c<0&&(c+=a.length),c=Math.max(0,Math.min(c,a.length)),e=a.slice(i,c).join("\n"),s.hasAttribute("data-start")||s.setAttribute("data-start",String(i+1))}l.textContent=e,n.highlightElement(l)}),(function(e){s.setAttribute(t,"failed"),l.textContent=e}))}})),n.plugins.fileHighlight={highlight:function(e){for(var t,r=(e||document).querySelectorAll(a),o=0;t=r[o++];)n.highlightElement(t)}};var i=!1;n.fileHighlight=function(){i||(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),i=!0),n.plugins.fileHighlight.highlight.apply(this,arguments)}}}()},464:e=>{"use strict";var t,r="";e.exports=function(e,n){if("string"!=typeof e)throw new TypeError("expected a string");if(1===n)return e;if(2===n)return e+e;var o=e.length*n;if(t!==e||void 0===t)t=e,r="";else if(r.length>=o)return r.substr(0,o);for(;o>r.length&&n>1;)1&n&&(r+=e),n>>=1,e+=e;return r=(r+=e).substr(0,o)}},131:(e,t,r)=>{"use strict";var n=r(464),o=function(e){return/<\/+[^>]+>/.test(e)},a=function(e){return/<[^>]+\/>/.test(e)};function i(e){return e.split(/(<\/?[^>]+>)/g).filter((function(e){return""!==e.trim()})).map((function(e){return{value:e,type:s(e)}}))}function s(e){return o(e)?"ClosingTag":function(e){return function(e){return/<[^>!]+>/.test(e)}(e)&&!o(e)&&!a(e)}(e)?"OpeningTag":a(e)?"SelfClosingTag":"Text"}e.exports=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=t.indentor,o=t.textNodesOnSameLine,a=0,s=[];r=r||"    ";var l=i(e).map((function(e,t,i){var l=e.value,c=e.type;"ClosingTag"===c&&a--;var p=n(r,a),d=p+l;if("OpeningTag"===c&&a++,o){var u=i[t-1],h=i[t-2];"ClosingTag"===c&&"Text"===u.type&&"OpeningTag"===h.type&&(d=""+p+h.value+u.value+l,s.push(t-2,t-1))}return d}));return s.forEach((function(e){return l[e]=null})),l.filter((function(e){return!!e})).join("\n")}}},n={};function o(e){var t=n[e];if(void 0!==t){if(void 0!==t.error)throw t.error;return t.exports}var a=n[e]={exports:{}};try{var i={id:e,module:a,factory:r[e],require:o};o.i.forEach((function(e){e(i)})),a=i.module,i.factory.call(a.exports,a,a.exports,i.require)}catch(e){throw a.error=e,e}return a.exports}o.m=r,o.c=n,o.i=[],o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var r in t)o.o(t,r)&&!o.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},o.hu=e=>e+"."+o.h()+".hot-update.js",o.hmrF=()=>"main."+o.h()+".hot-update.json",o.h=()=>"6112e0c26407ee2deb21",o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),e={},t="rapidoc:",o.l=(r,n,a,i)=>{if(e[r])e[r].push(n);else{var s,l;if(void 0!==a)for(var c=document.getElementsByTagName("script"),p=0;p<c.length;p++){var d=c[p];if(d.getAttribute("src")==r||d.getAttribute("data-webpack")==t+a){s=d;break}}s||(l=!0,(s=document.createElement("script")).charset="utf-8",s.timeout=120,o.nc&&s.setAttribute("nonce",o.nc),s.setAttribute("data-webpack",t+a),s.src=r),e[r]=[n];var u=(t,n)=>{s.onerror=s.onload=null,clearTimeout(h);var o=e[r];if(delete e[r],s.parentNode&&s.parentNode.removeChild(s),o&&o.forEach((e=>e(n))),t)return t(n)},h=setTimeout(u.bind(null,void 0,{type:"timeout",target:s}),12e4);s.onerror=u.bind(null,s.onerror),s.onload=u.bind(null,s.onload),l&&document.head.appendChild(s)}},(()=>{var e,t,r,n={},a=o.c,i=[],s=[],l="idle",c=0,p=[];function d(e){l=e;for(var t=[],r=0;r<s.length;r++)t[r]=s[r].call(null,e);return Promise.all(t)}function u(){0==--c&&d("ready").then((function(){if(0===c){var e=p;p=[];for(var t=0;t<e.length;t++)e[t]()}}))}function h(e){if("idle"!==l)throw new Error("check() is only allowed in idle status");return d("check").then(o.hmrM).then((function(r){return r?d("prepare").then((function(){var n=[];return t=[],Promise.all(Object.keys(o.hmrC).reduce((function(e,a){return o.hmrC[a](r.c,r.r,r.m,e,t,n),e}),[])).then((function(){return t=function(){return e?m(e):d("ready").then((function(){return n}))},0===c?t():new Promise((function(e){p.push((function(){e(t())}))}));var t}))})):d(y()?"ready":"idle").then((function(){return null}))}))}function f(e){return"ready"!==l?Promise.resolve().then((function(){throw new Error("apply() is only allowed in ready status (state: "+l+")")})):m(e)}function m(e){e=e||{},y();var n=t.map((function(t){return t(e)}));t=void 0;var o=n.map((function(e){return e.error})).filter(Boolean);if(o.length>0)return d("abort").then((function(){throw o[0]}));var a=d("dispose");n.forEach((function(e){e.dispose&&e.dispose()}));var i,s=d("apply"),l=function(e){i||(i=e)},c=[];return n.forEach((function(e){if(e.apply){var t=e.apply(l);if(t)for(var r=0;r<t.length;r++)c.push(t[r])}})),Promise.all([a,s]).then((function(){return i?d("fail").then((function(){throw i})):r?m(e).then((function(e){return c.forEach((function(t){e.indexOf(t)<0&&e.push(t)})),e})):d("idle").then((function(){return c}))}))}function y(){if(r)return t||(t=[]),Object.keys(o.hmrI).forEach((function(e){r.forEach((function(r){o.hmrI[e](r,t)}))})),r=void 0,!0}o.hmrD=n,o.i.push((function(p){var m,y,g,v,b=p.module,x=function(t,r){var n=a[r];if(!n)return t;var o=function(o){if(n.hot.active){if(a[o]){var s=a[o].parents;-1===s.indexOf(r)&&s.push(r)}else i=[r],e=o;-1===n.children.indexOf(o)&&n.children.push(o)}else console.warn("[HMR] unexpected require("+o+") from disposed module "+r),i=[];return t(o)},s=function(e){return{configurable:!0,enumerable:!0,get:function(){return t[e]},set:function(r){t[e]=r}}};for(var p in t)Object.prototype.hasOwnProperty.call(t,p)&&"e"!==p&&Object.defineProperty(o,p,s(p));return o.e=function(e){return function(e){switch(l){case"ready":d("prepare");case"prepare":return c++,e.then(u,u),e;default:return e}}(t.e(e))},o}(p.require,p.id);b.hot=(m=p.id,y=b,v={_acceptedDependencies:{},_acceptedErrorHandlers:{},_declinedDependencies:{},_selfAccepted:!1,_selfDeclined:!1,_selfInvalidated:!1,_disposeHandlers:[],_main:g=e!==m,_requireSelf:function(){i=y.parents.slice(),e=g?void 0:m,o(m)},active:!0,accept:function(e,t,r){if(void 0===e)v._selfAccepted=!0;else if("function"==typeof e)v._selfAccepted=e;else if("object"==typeof e&&null!==e)for(var n=0;n<e.length;n++)v._acceptedDependencies[e[n]]=t||function(){},v._acceptedErrorHandlers[e[n]]=r;else v._acceptedDependencies[e]=t||function(){},v._acceptedErrorHandlers[e]=r},decline:function(e){if(void 0===e)v._selfDeclined=!0;else if("object"==typeof e&&null!==e)for(var t=0;t<e.length;t++)v._declinedDependencies[e[t]]=!0;else v._declinedDependencies[e]=!0},dispose:function(e){v._disposeHandlers.push(e)},addDisposeHandler:function(e){v._disposeHandlers.push(e)},removeDisposeHandler:function(e){var t=v._disposeHandlers.indexOf(e);t>=0&&v._disposeHandlers.splice(t,1)},invalidate:function(){switch(this._selfInvalidated=!0,l){case"idle":t=[],Object.keys(o.hmrI).forEach((function(e){o.hmrI[e](m,t)})),d("ready");break;case"ready":Object.keys(o.hmrI).forEach((function(e){o.hmrI[e](m,t)}));break;case"prepare":case"check":case"dispose":case"apply":(r=r||[]).push(m)}},check:h,apply:f,status:function(e){if(!e)return l;s.push(e)},addStatusHandler:function(e){s.push(e)},removeStatusHandler:function(e){var t=s.indexOf(e);t>=0&&s.splice(t,1)},data:n[m]},e=void 0,v),b.parents=i,b.children=[],i=[],p.require=x})),o.hmrC={},o.hmrI={}})(),o.p="",(()=>{var e,t,r,n,a,i=o.hmrS_jsonp=o.hmrS_jsonp||{179:0},s={};function l(t,r){return e=r,new Promise(((e,r)=>{s[t]=e;var n=o.p+o.hu(t),a=new Error;o.l(n,(e=>{if(s[t]){s[t]=void 0;var n=e&&("load"===e.type?"missing":e.type),o=e&&e.target&&e.target.src;a.message="Loading hot update chunk "+t+" failed.\n("+n+": "+o+")",a.name="ChunkLoadError",a.type=n,a.request=o,r(a)}}))}))}function c(e){function s(e){for(var t=[e],r={},n=t.map((function(e){return{chain:[e],id:e}}));n.length>0;){var a=n.pop(),i=a.id,s=a.chain,c=o.c[i];if(c&&(!c.hot._selfAccepted||c.hot._selfInvalidated)){if(c.hot._selfDeclined)return{type:"self-declined",chain:s,moduleId:i};if(c.hot._main)return{type:"unaccepted",chain:s,moduleId:i};for(var p=0;p<c.parents.length;p++){var d=c.parents[p],u=o.c[d];if(u){if(u.hot._declinedDependencies[i])return{type:"declined",chain:s.concat([d]),moduleId:i,parentId:d};-1===t.indexOf(d)&&(u.hot._acceptedDependencies[i]?(r[d]||(r[d]=[]),l(r[d],[i])):(delete r[d],t.push(d),n.push({chain:s.concat([d]),id:d})))}}}}return{type:"accepted",moduleId:e,outdatedModules:t,outdatedDependencies:r}}function l(e,t){for(var r=0;r<t.length;r++){var n=t[r];-1===e.indexOf(n)&&e.push(n)}}o.f&&delete o.f.jsonpHmr,t=void 0;var c={},p=[],d={},u=function(e){console.warn("[HMR] unexpected require("+e.id+") to disposed module")};for(var h in r)if(o.o(r,h)){var f,m=r[h],y=!1,g=!1,v=!1,b="";switch((f=m?s(h):{type:"disposed",moduleId:h}).chain&&(b="\nUpdate propagation: "+f.chain.join(" -> ")),f.type){case"self-declined":e.onDeclined&&e.onDeclined(f),e.ignoreDeclined||(y=new Error("Aborted because of self decline: "+f.moduleId+b));break;case"declined":e.onDeclined&&e.onDeclined(f),e.ignoreDeclined||(y=new Error("Aborted because of declined dependency: "+f.moduleId+" in "+f.parentId+b));break;case"unaccepted":e.onUnaccepted&&e.onUnaccepted(f),e.ignoreUnaccepted||(y=new Error("Aborted because "+h+" is not accepted"+b));break;case"accepted":e.onAccepted&&e.onAccepted(f),g=!0;break;case"disposed":e.onDisposed&&e.onDisposed(f),v=!0;break;default:throw new Error("Unexception type "+f.type)}if(y)return{error:y};if(g)for(h in d[h]=m,l(p,f.outdatedModules),f.outdatedDependencies)o.o(f.outdatedDependencies,h)&&(c[h]||(c[h]=[]),l(c[h],f.outdatedDependencies[h]));v&&(l(p,[f.moduleId]),d[h]=u)}r=void 0;for(var x,w=[],$=0;$<p.length;$++){var k=p[$],S=o.c[k];S&&(S.hot._selfAccepted||S.hot._main)&&d[k]!==u&&!S.hot._selfInvalidated&&w.push({module:k,require:S.hot._requireSelf,errorHandler:S.hot._selfAccepted})}return{dispose:function(){var e;n.forEach((function(e){delete i[e]})),n=void 0;for(var t,r=p.slice();r.length>0;){var a=r.pop(),s=o.c[a];if(s){var l={},d=s.hot._disposeHandlers;for($=0;$<d.length;$++)d[$].call(null,l);for(o.hmrD[a]=l,s.hot.active=!1,delete o.c[a],delete c[a],$=0;$<s.children.length;$++){var u=o.c[s.children[$]];u&&((e=u.parents.indexOf(a))>=0&&u.parents.splice(e,1))}}}for(var h in c)if(o.o(c,h)&&(s=o.c[h]))for(x=c[h],$=0;$<x.length;$++)t=x[$],(e=s.children.indexOf(t))>=0&&s.children.splice(e,1)},apply:function(t){for(var r in d)o.o(d,r)&&(o.m[r]=d[r]);for(var n=0;n<a.length;n++)a[n](o);for(var i in c)if(o.o(c,i)){var s=o.c[i];if(s){x=c[i];for(var l=[],u=[],h=[],f=0;f<x.length;f++){var m=x[f],y=s.hot._acceptedDependencies[m],g=s.hot._acceptedErrorHandlers[m];if(y){if(-1!==l.indexOf(y))continue;l.push(y),u.push(g),h.push(m)}}for(var v=0;v<l.length;v++)try{l[v].call(null,x)}catch(r){if("function"==typeof u[v])try{u[v](r,{moduleId:i,dependencyId:h[v]})}catch(n){e.onErrored&&e.onErrored({type:"accept-error-handler-errored",moduleId:i,dependencyId:h[v],error:n,originalError:r}),e.ignoreErrored||(t(n),t(r))}else e.onErrored&&e.onErrored({type:"accept-errored",moduleId:i,dependencyId:h[v],error:r}),e.ignoreErrored||t(r)}}}for(var b=0;b<w.length;b++){var $=w[b],k=$.module;try{$.require(k)}catch(r){if("function"==typeof $.errorHandler)try{$.errorHandler(r,{moduleId:k,module:o.c[k]})}catch(n){e.onErrored&&e.onErrored({type:"self-accept-error-handler-errored",moduleId:k,error:n,originalError:r}),e.ignoreErrored||(t(n),t(r))}else e.onErrored&&e.onErrored({type:"self-accept-errored",moduleId:k,error:r}),e.ignoreErrored||t(r)}}return p}}}self.webpackHotUpdaterapidoc=(t,n,i)=>{for(var l in n)o.o(n,l)&&(r[l]=n[l],e&&e.push(l));i&&a.push(i),s[t]&&(s[t](),s[t]=void 0)},o.hmrI.jsonp=function(e,t){r||(r={},a=[],n=[],t.push(c)),o.o(r,e)||(r[e]=o.m[e])},o.hmrC.jsonp=function(e,s,p,d,u,h){u.push(c),t={},n=s,r=p.reduce((function(e,t){return e[t]=!1,e}),{}),a=[],e.forEach((function(e){o.o(i,e)&&void 0!==i[e]?(d.push(l(e,h)),t[e]=!0):t[e]=!1})),o.f&&(o.f.jsonpHmr=function(e,r){t&&o.o(t,e)&&!t[e]&&(r.push(l(e)),t[e]=!0)})},o.hmrM=()=>{if("undefined"==typeof fetch)throw new Error("No browser support: need fetch API");return fetch(o.p+o.hmrF()).then((e=>{if(404!==e.status){if(!e.ok)throw new Error("Failed to fetch update manifest "+e.statusText);return e.json()}}))}})();o(73)})();
//# sourceMappingURL=rapidoc-min.js.map