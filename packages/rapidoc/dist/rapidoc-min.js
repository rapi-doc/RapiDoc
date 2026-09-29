/*!
 * @license
 * rapidoc v9.3.9-beta
 * (c) 2026 Mrinmoy Majumdar <mrin9@yahoo.com>
 * SPDX-License-Identifier: MIT
 */
var Wt=globalThis,za=Wt.ShadowRoot&&(Wt.ShadyCSS===void 0||Wt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Pa=Symbol(),cs=new WeakMap,ds=class{constructor(e,t,a){if(this._$cssResult$=!0,a!==Pa)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this._strings=t}get styleSheet(){let e=this._styleSheet,t=this._strings;if(za&&e===void 0){let a=t!==void 0&&t.length===1;a&&(e=cs.get(t)),e===void 0&&((this._styleSheet=e=new CSSStyleSheet).replaceSync(this.cssText),a&&cs.set(t,e))}return e}toString(){return this.cssText}},oo=e=>{if(e._$cssResult$===!0)return e.cssText;if(typeof e=="number")return e;throw Error(`Value passed to 'css' function must be a 'css' function result: ${e}. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)},ps=e=>new ds(typeof e=="string"?e:String(e),void 0,Pa),M=(e,...t)=>new ds(e.length===1?e[0]:t.reduce((a,r,s)=>a+oo(r)+e[s+1],e[0]),e,Pa),lo=(e,t)=>{if(za)e.adoptedStyleSheets=t.map(a=>a instanceof CSSStyleSheet?a:a.styleSheet);else for(let a of t){let r=document.createElement("style"),s=Wt.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=a.cssText,e.appendChild(r)}},co=e=>{let t="";for(let a of e.cssRules)t+=a.cssText;return ps(t)},us=za?e=>e:e=>e instanceof CSSStyleSheet?co(e):e,{is:po,defineProperty:uo,getOwnPropertyDescriptor:hs,getOwnPropertyNames:ho,getOwnPropertySymbols:mo,getPrototypeOf:ms}=Object,we=globalThis,ue,fs=we.trustedTypes,fo=fs?fs.emptyScript:"",gs=we.reactiveElementPolyfillSupportDevMode;{let e=we.litIssuedWarnings??=new Set;ue=(t,a)=>{a+=` See https://lit.dev/msg/${t} for more information.`,e.has(a)||e.add(a)},ue("dev-mode","Lit is in dev mode. Not recommended for production!"),we.ShadyDOM?.inUse&&gs===void 0&&ue("polyfill-support-missing","Shadow DOM is being polyfilled via `ShadyDOM` but the `polyfill-support` module has not been loaded.")}var go=e=>{we.emitLitDebugLogEvents&&we.dispatchEvent(new CustomEvent("lit-debug",{detail:e}))},Ye=(e,t)=>e,Ua={toAttribute(e,t){switch(t){case Boolean:e=e?fo:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let a=e;switch(t){case Boolean:a=e!==null;break;case Number:a=e===null?null:Number(e);break;case Object:case Array:try{a=JSON.parse(e)}catch{a=null}}return a}},bs=(e,t)=>!po(e,t),ys={attribute:!0,type:String,converter:Ua,reflect:!1,hasChanged:bs};Symbol.metadata??=Symbol("metadata"),we.litPropertyMetadata??=new WeakMap;var he=class extends HTMLElement{static addInitializer(e){this.__prepare(),(this._initializers??=[]).push(e)}static get observedAttributes(){return this.finalize(),this.__attributeToPropertyMap&&[...this.__attributeToPropertyMap.keys()]}static createProperty(e,t=ys){if(t.state&&(t.attribute=!1),this.__prepare(),this.elementProperties.set(e,t),!t.noAccessor){let a=Symbol.for(`${String(e)} (@property() cache)`),r=this.getPropertyDescriptor(e,a,t);r!==void 0&&uo(this.prototype,e,r)}}static getPropertyDescriptor(e,t,a){let{get:r,set:s}=hs(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};if(r==null){if("value"in(hs(this.prototype,e)??{}))throw Error(`Field ${JSON.stringify(String(e))} on ${this.name} was declared as a reactive property but it's actually declared as a value on the prototype. Usually this is due to using @property or @state on a method.`);ue("reactive-property-without-getter",`Field ${JSON.stringify(String(e))} on ${this.name} was declared as a reactive property but it does not have a getter. This will be an error in a future version of Lit.`)}return{get(){return r?.call(this)},set(n){let i=r?.call(this);s.call(this,n),this.requestUpdate(e,i,a)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ys}static __prepare(){if(this.hasOwnProperty(Ye("elementProperties",this)))return;let e=ms(this);e.finalize(),e._initializers!==void 0&&(this._initializers=[...e._initializers]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Ye("finalized",this)))return;if(this.finalized=!0,this.__prepare(),this.hasOwnProperty(Ye("properties",this))){let t=this.properties,a=[...ho(t),...mo(t)];for(let r of a)this.createProperty(r,t[r])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[a,r]of t)this.elementProperties.set(a,r)}this.__attributeToPropertyMap=new Map;for(let[t,a]of this.elementProperties){let r=this.__attributeNameForProperty(t,a);r!==void 0&&this.__attributeToPropertyMap.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles),this.hasOwnProperty("createProperty")&&ue("no-override-create-property","Overriding ReactiveElement.createProperty() is deprecated. The override will not be called with standard decorators"),this.hasOwnProperty("getPropertyDescriptor")&&ue("no-override-get-property-descriptor","Overriding ReactiveElement.getPropertyDescriptor() is deprecated. The override will not be called with standard decorators")}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let a=new Set(e.flat(1/0).reverse());for(let r of a)t.unshift(us(r))}else e!==void 0&&t.push(us(e));return t}static __attributeNameForProperty(e,t){let a=t.attribute;return a===!1?void 0:typeof a=="string"?a:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this.__instanceProperties=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this.__reflectingProperty=null,this.__initialize()}__initialize(){this.__updatePromise=new Promise(e=>this.enableUpdating=e),this._$changedProperties=new Map,this.__saveInstanceProperties(),this.requestUpdate(),this.constructor._initializers?.forEach(e=>e(this))}addController(e){(this.__controllers??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this.__controllers?.delete(e)}__saveInstanceProperties(){let e=new Map,t=this.constructor.elementProperties;for(let a of t.keys())this.hasOwnProperty(a)&&(e.set(a,this[a]),delete this[a]);e.size>0&&(this.__instanceProperties=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return lo(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this.__controllers?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this.__controllers?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,a){this._$attributeToProperty(e,a)}__propertyToAttribute(e,t){let a=this.constructor.elementProperties.get(e),r=this.constructor.__attributeNameForProperty(e,a);if(r!==void 0&&a.reflect===!0){let s=(a.converter?.toAttribute===void 0?Ua:a.converter).toAttribute(t,a.type);this.constructor.enabledWarnings.includes("migration")&&s===void 0&&ue("undefined-attribute-value",`The attribute value for the ${e} property is undefined on element ${this.localName}. The attribute will be removed, but in the previous version of \`ReactiveElement\`, the attribute would not have changed.`),this.__reflectingProperty=e,s==null?this.removeAttribute(r):this.setAttribute(r,s),this.__reflectingProperty=null}}_$attributeToProperty(e,t){let a=this.constructor,r=a.__attributeToPropertyMap.get(e);if(r!==void 0&&this.__reflectingProperty!==r){let s=a.getPropertyOptions(r),n=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute===void 0?Ua:s.converter;this.__reflectingProperty=r,this[r]=n.fromAttribute(t,s.type),this.__reflectingProperty=null}}requestUpdate(e,t,a){if(e!==void 0){e instanceof Event&&ue("","The requestUpdate() method was called with an Event as the property name. This is probably a mistake caused by binding this.requestUpdate as an event listener. Instead bind a function that will call it with no arguments: () => this.requestUpdate()"),a??=this.constructor.getPropertyOptions(e);let r=a.hasChanged??bs,s=this[e];if(r(s,t))this._$changeProperty(e,t,a);else return}this.isUpdatePending===!1&&(this.__updatePromise=this.__enqueueUpdate())}_$changeProperty(e,t,a){this._$changedProperties.has(e)||this._$changedProperties.set(e,t),a.reflect===!0&&this.__reflectingProperty!==e&&(this.__reflectingProperties??=new Set).add(e)}async __enqueueUpdate(){this.isUpdatePending=!0;try{await this.__updatePromise}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){let e=this.performUpdate();return this.constructor.enabledWarnings.includes("async-perform-update")&&typeof e?.then=="function"&&ue("async-perform-update",`Element ${this.localName} returned a Promise from performUpdate(). This behavior is deprecated and will be removed in a future version of ReactiveElement.`),e}performUpdate(){if(!this.isUpdatePending)return;if(go?.({kind:"update"}),!this.hasUpdated){this.renderRoot??=this.createRenderRoot();{let r=[...this.constructor.elementProperties.keys()].filter(s=>this.hasOwnProperty(s)&&s in ms(this));if(r.length)throw Error(`The following properties on element ${this.localName} will not trigger updates as expected because they are set using class fields: ${r.join(", ")}. Native class fields and some compiled output will overwrite accessors used for detecting changes. See https://lit.dev/msg/class-field-shadowing for more information.`)}if(this.__instanceProperties){for(let[r,s]of this.__instanceProperties)this[r]=s;this.__instanceProperties=void 0}let a=this.constructor.elementProperties;if(a.size>0)for(let[r,s]of a)s.wrapped===!0&&!this._$changedProperties.has(r)&&this[r]!==void 0&&this._$changeProperty(r,this[r],s)}let e=!1,t=this._$changedProperties;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this.__controllers?.forEach(a=>a.hostUpdate?.()),this.update(t)):this.__markUpdated()}catch(a){throw e=!1,this.__markUpdated(),a}e&&this._$didUpdate(t)}willUpdate(e){}_$didUpdate(e){this.__controllers?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e),this.isUpdatePending&&this.constructor.enabledWarnings.includes("change-in-update")&&ue("change-in-update",`Element ${this.localName} scheduled an update (generally because a property was set) after an update completed, causing a new update to be scheduled. This is inefficient and should be avoided unless the next update can only be scheduled as a side effect of the previous update.`)}__markUpdated(){this._$changedProperties=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this.__updatePromise}shouldUpdate(e){return!0}update(e){this.__reflectingProperties&&=this.__reflectingProperties.forEach(t=>this.__propertyToAttribute(t,this[t])),this.__markUpdated()}updated(e){}firstUpdated(e){}};he.elementStyles=[],he.shadowRootOptions={mode:"open"},he[Ye("elementProperties",he)]=new Map,he[Ye("finalized",he)]=new Map,gs?.({ReactiveElement:he});{he.enabledWarnings=["change-in-update","async-perform-update"];let e=function(t){t.hasOwnProperty(Ye("enabledWarnings",t))||(t.enabledWarnings=t.enabledWarnings.slice())};he.enableWarning=function(t){e(this),this.enabledWarnings.includes(t)||this.enabledWarnings.push(t)},he.disableWarning=function(t){e(this);let a=this.enabledWarnings.indexOf(t);a>=0&&this.enabledWarnings.splice(a,1)}}(we.reactiveElementVersions??=[]).push("2.0.4"),we.reactiveElementVersions.length>1&&ue("multiple-versions","Multiple versions of Lit loaded. Loading multiple versions is not recommended.");var ae=globalThis,B=e=>{ae.emitLitDebugLogEvents&&ae.dispatchEvent(new CustomEvent("lit-debug",{detail:e}))},bo=0,yt;ae.litIssuedWarnings??=new Set,yt=(e,t)=>{t+=e?` See https://lit.dev/msg/${e} for more information.`:"",ae.litIssuedWarnings.has(t)||ae.litIssuedWarnings.add(t)},yt("dev-mode","Lit is in dev mode. Not recommended for production!");var me=ae.ShadyDOM?.inUse&&ae.ShadyDOM?.noPatch===!0?ae.ShadyDOM.wrap:e=>e,Vt=ae.trustedTypes,vs=Vt?Vt.createPolicy("lit-html",{createHTML:e=>e}):void 0,yo=e=>e,Kt=(e,t,a)=>yo,vo=e=>{if(Be!==Kt)throw Error("Attempted to overwrite existing lit-html security policy. setSanitizeDOMValueFactory should be called at most once.");Be=e},xo=()=>{Be=Kt},Ma=(e,t,a)=>Be(e,t,a),Ha="$lit$",be=`lit$${Math.random().toFixed(9).slice(2)}$`,Wa="?"+be,wo=`<${Wa}>`,_e=document,vt=()=>_e.createComment(""),xt=e=>e===null||typeof e!="object"&&typeof e!="function",Va=Array.isArray,xs=e=>Va(e)||typeof e?.[Symbol.iterator]=="function",Ka=`[ 	
\f\r]`,$o=`[^ 	
\f\r"'\`<>=]`,ko=`[^\\s"'>=/]`,wt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ws=1,Za=2,So=3,$s=/-->/g,ks=/>/g,Xe=RegExp(`>|${Ka}(?:(${ko}+)(${Ka}*=${Ka}*(?:${$o}|("|')|))|$)`,"g"),Eo=0,Ss=1,Do=2,Es=3,Ds=/'/g,As=/"/g,Cs=/^(?:script|style|textarea|title)$/i,Fs=1,Ja=2,Ga=3,Ya=1,Zt=2,Ao=3,Co=4,Fo=5,Xa=6,To=7,d=(e=>(t,...a)=>(t.some(r=>r===void 0),a.some(r=>r?._$litStatic$)&&yt("",`Static values 'literal' or 'unsafeStatic' cannot be used as values to non-static templates.
Please use the static 'html' tag function. See https://lit.dev/docs/templates/expressions/#static-expressions`),{_$litType$:e,strings:t,values:a}))(Fs),Q=Symbol.for("lit-noChange"),P=Symbol.for("lit-nothing"),Ts=new WeakMap,Ne=_e.createTreeWalker(_e,129),Be=Kt;function Os(e,t){if(!Va(e)||!e.hasOwnProperty("raw")){let a="invalid template strings array";throw a=`Internal Error: expected template strings to be an array
          with a 'raw' field. Faking a template strings array by
          calling html or svg like an ordinary function is effectively
          the same as calling unsafeHtml and can lead to major security
          issues, e.g. opening your code up to XSS attacks.
          If you're using the html or svg tagged template functions normally
          and still seeing this error, please file a bug at
          https://github.com/lit/lit/issues/new?template=bug_report.md
          and include information about your build tooling, if any.`.replace(/\n */g,`
`),Error(a)}return vs===void 0?t:vs.createHTML(t)}var _s=(e,t)=>{let a=e.length-1,r=[],s=t===Ja?"<svg>":t===Ga?"<math>":"",n,i=wt;for(let o=0;o<a;o++){let l=e[o],c=-1,p,u=0,h;for(;u<l.length&&(i.lastIndex=u,h=i.exec(l),h!==null);)if(u=i.lastIndex,i===wt){if(h[ws]==="!--")i=$s;else if(h[ws]!==void 0)i=ks;else if(h[Za]!==void 0)Cs.test(h[Za])&&(n=RegExp(`</${h[Za]}`,"g")),i=Xe;else if(h[So]!==void 0)throw Error("Bindings in tag names are not supported. Please use static templates instead. See https://lit.dev/docs/templates/expressions/#static-expressions")}else i===Xe?h[Eo]===">"?(i=n??wt,c=-1):h[Ss]===void 0?c=-2:(c=i.lastIndex-h[Do].length,p=h[Ss],i=h[Es]===void 0?Xe:h[Es]==='"'?As:Ds):i===As||i===Ds?i=Xe:i===$s||i===ks?i=wt:(i=Xe,n=void 0);let m=i===Xe&&e[o+1].startsWith("/>")?" ":"";s+=i===wt?l+wo:c>=0?(r.push(p),l.slice(0,c)+Ha+l.slice(c)+be+m):l+be+(c===-2?o:m)}return[Os(e,s+(e[a]||"<?>")+(t===Ja?"</svg>":t===Ga?"</math>":"")),r]},Qa=class eo{constructor({strings:t,_$litType$:a},r){this.parts=[];let s,n=0,i=0,o=t.length-1,l=this.parts,[c,p]=_s(t,a);if(this.el=eo.createElement(c,r),Ne.currentNode=this.el.content,a===Ja||a===Ga){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=Ne.nextNode())!==null&&l.length<o;){if(s.nodeType===1){{let u=s.localName;if(/^(?:textarea|template)$/i.test(u)&&s.innerHTML.includes(be)){let h=`Expressions are not supported inside \`${u}\` elements. See https://lit.dev/msg/expression-in-${u} for more information.`;if(u==="template")throw Error(h);yt("",h)}}if(s.hasAttributes())for(let u of s.getAttributeNames())if(u.endsWith(Ha)){let h=p[i++],m=s.getAttribute(u).split(be),b=/([.?@])?(.*)/.exec(h);l.push({type:Ya,index:n,name:b[2],strings:m,ctor:b[1]==="."?Bs:b[1]==="?"?Is:b[1]==="@"?Ls:$t}),s.removeAttribute(u)}else u.startsWith(be)&&(l.push({type:Xa,index:n}),s.removeAttribute(u));if(Cs.test(s.tagName)){let u=s.textContent.split(be),h=u.length-1;if(h>0){s.textContent=Vt?Vt.emptyScript:"";for(let m=0;m<h;m++)s.append(u[m],vt()),Ne.nextNode(),l.push({type:Zt,index:++n});s.append(u[h],vt())}}}else if(s.nodeType===8)if(s.data===Wa)l.push({type:Zt,index:n});else{let u=-1;for(;(u=s.data.indexOf(be,u+1))!==-1;)l.push({type:To,index:n}),u+=be.length-1}n++}if(p.length!==i)throw Error('Detected duplicate attribute bindings. This occurs if your template has duplicate attributes on an element tag. For example "<input ?disabled=${true} ?disabled=${false}>" contains a duplicate "disabled" attribute. The error was detected in the following template: \n`'+t.join("${...}")+"`");B&&B({kind:"template prep",template:this,clonableTemplate:this.el,parts:this.parts,strings:t})}static createElement(t,a){let r=_e.createElement("template");return r.innerHTML=t,r}};function Ie(e,t,a=e,r){if(t===Q)return t;let s=r===void 0?a.__directive:a.__directives?.[r],n=xt(t)?void 0:t._$litDirective$;return s?.constructor!==n&&(s?._$notifyDirectiveConnectionChanged?.(!1),n===void 0?s=void 0:(s=new n(e),s._$initialize(e,a,r)),r===void 0?a.__directive=s:(a.__directives??=[])[r]=s),s!==void 0&&(t=Ie(e,s._$resolve(e,t.values),s,r)),t}var Ns=class{constructor(e,t){this._$parts=[],this._$disconnectableChildren=void 0,this._$template=e,this._$parent=t}get parentNode(){return this._$parent.parentNode}get _$isConnected(){return this._$parent._$isConnected}_clone(e){let{el:{content:t},parts:a}=this._$template,r=(e?.creationScope??_e).importNode(t,!0);Ne.currentNode=r;let s=Ne.nextNode(),n=0,i=0,o=a[0];for(;o!==void 0;){if(n===o.index){let l;o.type===Zt?l=new Jt(s,s.nextSibling,this,e):o.type===Ya?l=new o.ctor(s,o.name,o.strings,this,e):o.type===Xa&&(l=new Rs(s,this,e)),this._$parts.push(l),o=a[++i]}n!==o?.index&&(s=Ne.nextNode(),n++)}return Ne.currentNode=_e,r}_update(e){let t=0;for(let a of this._$parts)a!==void 0&&(B&&B({kind:"set part",part:a,value:e[t],valueIndex:t,values:e,templateInstance:this}),a.strings===void 0?a._$setValue(e[t]):(a._$setValue(e,a,t),t+=a.strings.length-2)),t++}},Jt=class to{get _$isConnected(){return this._$parent?._$isConnected??this.__isConnected}constructor(t,a,r,s){this.type=Zt,this._$committedValue=P,this._$disconnectableChildren=void 0,this._$startNode=t,this._$endNode=a,this._$parent=r,this.options=s,this.__isConnected=s?.isConnected??!0,this._textSanitizer=void 0}get parentNode(){let t=me(this._$startNode).parentNode,a=this._$parent;return a!==void 0&&t?.nodeType===11&&(t=a.parentNode),t}get startNode(){return this._$startNode}get endNode(){return this._$endNode}_$setValue(t,a=this){if(this.parentNode===null)throw Error("This `ChildPart` has no `parentNode` and therefore cannot accept a value. This likely means the element containing the part was manipulated in an unsupported way outside of Lit's control such that the part's marker nodes were ejected from DOM. For example, setting the element's `innerHTML` or `textContent` can do this.");if(t=Ie(this,t,a),xt(t))t===P||t==null||t===""?(this._$committedValue!==P&&(B&&B({kind:"commit nothing to child",start:this._$startNode,end:this._$endNode,parent:this._$parent,options:this.options}),this._$clear()),this._$committedValue=P):t!==this._$committedValue&&t!==Q&&this._commitText(t);else if(t._$litType$!==void 0)this._commitTemplateResult(t);else if(t.nodeType!==void 0){if(this.options?.host===t){this._commitText("[probable mistake: rendered a template's host in itself (commonly caused by writing ${this} in a template]");return}this._commitNode(t)}else xs(t)?this._commitIterable(t):this._commitText(t)}_insert(t){return me(me(this._$startNode).parentNode).insertBefore(t,this._$endNode)}_commitNode(t){if(this._$committedValue!==t){if(this._$clear(),Be!==Kt){let a=this._$startNode.parentNode?.nodeName;if(a==="STYLE"||a==="SCRIPT"){let r="Forbidden";throw r=a==="STYLE"?"Lit does not support binding inside style nodes. This is a security risk, as style injection attacks can exfiltrate data and spoof UIs. Consider instead using css`...` literals to compose styles, and do dynamic styling with css custom properties, ::parts, <slot>s, and by mutating the DOM rather than stylesheets.":"Lit does not support binding inside script nodes. This is a security risk, as it could allow arbitrary code execution.",Error(r)}}B&&B({kind:"commit node",start:this._$startNode,parent:this._$parent,value:t,options:this.options}),this._$committedValue=this._insert(t)}}_commitText(t){if(this._$committedValue!==P&&xt(this._$committedValue)){let a=me(this._$startNode).nextSibling;this._textSanitizer===void 0&&(this._textSanitizer=Ma(a,"data","property")),t=this._textSanitizer(t),B&&B({kind:"commit text",node:a,value:t,options:this.options}),a.data=t}else{let a=_e.createTextNode("");this._commitNode(a),this._textSanitizer===void 0&&(this._textSanitizer=Ma(a,"data","property")),t=this._textSanitizer(t),B&&B({kind:"commit text",node:a,value:t,options:this.options}),a.data=t}this._$committedValue=t}_commitTemplateResult(t){let{values:a,_$litType$:r}=t,s=typeof r=="number"?this._$getTemplate(t):(r.el===void 0&&(r.el=Qa.createElement(Os(r.h,r.h[0]),this.options)),r);if(this._$committedValue?._$template===s)B&&B({kind:"template updating",template:s,instance:this._$committedValue,parts:this._$committedValue._$parts,options:this.options,values:a}),this._$committedValue._update(a);else{let n=new Ns(s,this),i=n._clone(this.options);B&&B({kind:"template instantiated",template:s,instance:n,parts:n._$parts,options:this.options,fragment:i,values:a}),n._update(a),B&&B({kind:"template instantiated and updated",template:s,instance:n,parts:n._$parts,options:this.options,fragment:i,values:a}),this._commitNode(i),this._$committedValue=n}}_$getTemplate(t){let a=Ts.get(t.strings);return a===void 0&&Ts.set(t.strings,a=new Qa(t)),a}_commitIterable(t){Va(this._$committedValue)||(this._$committedValue=[],this._$clear());let a=this._$committedValue,r=0,s;for(let n of t)r===a.length?a.push(s=new to(this._insert(vt()),this._insert(vt()),this,this.options)):s=a[r],s._$setValue(n),r++;r<a.length&&(this._$clear(s&&me(s._$endNode).nextSibling,r),a.length=r)}_$clear(t=me(this._$startNode).nextSibling,a){for(this._$notifyConnectionChanged?.(!1,!0,a);t&&t!==this._$endNode;){let r=me(t).nextSibling;me(t).remove(),t=r}}setConnected(t){if(this._$parent===void 0)this.__isConnected=t,this._$notifyConnectionChanged?.(t);else throw Error("part.setConnected() may only be called on a RootPart returned from render().")}},$t=class{get tagName(){return this.element.tagName}get _$isConnected(){return this._$parent._$isConnected}constructor(e,t,a,r,s){this.type=Ya,this._$committedValue=P,this._$disconnectableChildren=void 0,this.element=e,this.name=t,this._$parent=r,this.options=s,a.length>2||a[0]!==""||a[1]!==""?(this._$committedValue=Array(a.length-1).fill(new String),this.strings=a):this._$committedValue=P,this._sanitizer=void 0}_$setValue(e,t=this,a,r){let s=this.strings,n=!1;if(s===void 0)e=Ie(this,e,t,0),n=!xt(e)||e!==this._$committedValue&&e!==Q,n&&(this._$committedValue=e);else{let i=e;e=s[0];let o,l;for(o=0;o<s.length-1;o++)l=Ie(this,i[a+o],t,o),l===Q&&(l=this._$committedValue[o]),n||=!xt(l)||l!==this._$committedValue[o],l===P?e=P:e!==P&&(e+=(l??"")+s[o+1]),this._$committedValue[o]=l}n&&!r&&this._commitValue(e)}_commitValue(e){e===P?me(this.element).removeAttribute(this.name):(this._sanitizer===void 0&&(this._sanitizer=Be(this.element,this.name,"attribute")),e=this._sanitizer(e??""),B&&B({kind:"commit attribute",element:this.element,name:this.name,value:e,options:this.options}),me(this.element).setAttribute(this.name,e??""))}},Bs=class extends $t{constructor(){super(...arguments),this.type=Ao}_commitValue(e){this._sanitizer===void 0&&(this._sanitizer=Be(this.element,this.name,"property")),e=this._sanitizer(e),B&&B({kind:"commit property",element:this.element,name:this.name,value:e,options:this.options}),this.element[this.name]=e===P?void 0:e}},Is=class extends $t{constructor(){super(...arguments),this.type=Co}_commitValue(e){B&&B({kind:"commit boolean attribute",element:this.element,name:this.name,value:!!(e&&e!==P),options:this.options}),me(this.element).toggleAttribute(this.name,!!e&&e!==P)}},Ls=class extends $t{constructor(e,t,a,r,s){if(super(e,t,a,r,s),this.type=Fo,this.strings!==void 0)throw Error(`A \`<${e.localName}>\` has a \`@${t}=...\` listener with invalid content. Event listeners in templates must have exactly one expression and no surrounding text.`)}_$setValue(e,t=this){if(e=Ie(this,e,t,0)??P,e===Q)return;let a=this._$committedValue,r=e===P&&a!==P||e.capture!==a.capture||e.once!==a.once||e.passive!==a.passive,s=e!==P&&(a===P||r);B&&B({kind:"commit event listener",element:this.element,name:this.name,value:e,options:this.options,removeListener:r,addListener:s,oldListener:a}),r&&this.element.removeEventListener(this.name,this,a),s&&this.element.addEventListener(this.name,this,e),this._$committedValue=e}handleEvent(e){typeof this._$committedValue=="function"?this._$committedValue.call(this.options?.host??this.element,e):this._$committedValue.handleEvent(e)}},Rs=class{constructor(e,t,a){this.element=e,this.type=Xa,this._$disconnectableChildren=void 0,this._$parent=t,this.options=a}get _$isConnected(){return this._$parent._$isConnected}_$setValue(e){B&&B({kind:"commit to element binding",element:this.element,value:e,options:this.options}),Ie(this,e)}},Oo={_boundAttributeSuffix:Ha,_marker:be,_markerMatch:Wa,_HTML_RESULT:Fs,_getTemplateHtml:_s,_TemplateInstance:Ns,_isIterable:xs,_resolveDirective:Ie,_ChildPart:Jt,_AttributePart:$t,_BooleanAttributePart:Is,_EventPart:Ls,_PropertyPart:Bs,_ElementPart:Rs},_o=ae.litHtmlPolyfillSupportDevMode;_o?.(Qa,Jt),(ae.litHtmlVersions??=[]).push("3.2.0"),ae.litHtmlVersions.length>1&&yt("multiple-versions","Multiple versions of Lit loaded. Loading multiple versions is not recommended.");var Gt=(e,t,a)=>{if(t==null)throw TypeError(`The container to render into may not be ${t}`);let r=bo++,s=a?.renderBefore??t,n=s._$litPart$;if(B&&B({kind:"begin render",id:r,value:e,container:t,options:a,part:n}),n===void 0){let i=a?.renderBefore??null;s._$litPart$=n=new Jt(t.insertBefore(vt(),i),i,void 0,a??{})}return n._$setValue(e),B&&B({kind:"end render",id:r,value:e,container:t,options:a,part:n}),n};Gt.setSanitizer=vo,Gt.createSanitizer=Ma,Gt._testOnlyClearSanitizerFactoryDoNotCallOrElse=xo;var No=(e,t)=>e,js;{let e=globalThis.litIssuedWarnings??=new Set;js=(t,a)=>{a+=` See https://lit.dev/msg/${t} for more information.`,e.has(a)||e.add(a)}}var ee=class extends he{constructor(){super(...arguments),this.renderOptions={host:this},this.__childPart=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this.__childPart=Gt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this.__childPart?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this.__childPart?.setConnected(!1)}render(){return Q}};ee._$litElement$=!0,ee[No("finalized",ee)]=!0,globalThis.litElementHydrateSupport?.({LitElement:ee});var Bo=globalThis.litElementPolyfillSupportDevMode;Bo?.({LitElement:ee}),(globalThis.litElementVersions??=[]).push("4.1.0"),globalThis.litElementVersions.length>1&&js("multiple-versions","Multiple versions of Lit loaded. Loading multiple versions is not recommended.");function er(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Le=er();function qs(e){Le=e}var kt={exec:()=>null};function L(e,t=""){let a=typeof e=="string"?e:e.source,r={replace:(s,n)=>{let i=typeof n=="string"?n:n.source;return i=i.replace(Y.caret,"$1"),a=a.replace(s,i),r},getRegex:()=>new RegExp(a,t)};return r}var Y={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] /,listReplaceTask:/^\[[ xX]\] +/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:e=>RegExp(`^ {0,${Math.min(3,e-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:e=>RegExp(`^ {0,${Math.min(3,e-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:e=>RegExp(`^ {0,${Math.min(3,e-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:e=>RegExp(`^ {0,${Math.min(3,e-1)}}#`),htmlBeginRegex:e=>RegExp(`^ {0,${Math.min(3,e-1)}}<(?:[a-z].*>|!--)`,"i")},Io=/^(?:[ \t]*(?:\n|$))+/,Lo=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Ro=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,St=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,jo=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,zs=/(?:[*+-]|\d{1,9}[.)])/,Ps=L(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g,zs).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).getRegex(),tr=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,qo=/^[^\n]+/,ar=/(?!\s*\])(?:\\.|[^\[\]\\])+/,zo=L(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",ar).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Po=L(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,zs).getRegex(),Yt="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",rr=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Uo=L("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",rr).replace("tag",Yt).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Us=L(tr).replace("hr",St).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Yt).getRegex(),sr={blockquote:L(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Us).getRegex(),code:Lo,def:zo,fences:Ro,heading:jo,hr:St,html:Uo,lheading:Ps,list:Po,newline:Io,paragraph:Us,table:kt,text:qo},Ms=L("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",St).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Yt).getRegex(),Mo={...sr,table:Ms,paragraph:L(tr).replace("hr",St).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Ms).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Yt).getRegex()},Ho={...sr,html:L(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",rr).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:kt,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:L(tr).replace("hr",St).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Ps).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Wo=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Vo=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Hs=/^( {2,}|\\)\n(?!\s*$)/,Ko=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Xt=/[\p{P}\p{S}]/u,nr=/[\s\p{P}\p{S}]/u,Ws=/[^\s\p{P}\p{S}]/u,Zo=L(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,nr).getRegex(),Vs=/(?!~)[\p{P}\p{S}]/u,Jo=/(?!~)[\s\p{P}\p{S}]/u,Go=/(?:[^\s\p{P}\p{S}]|~)/u,Yo=/\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g,Ks=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Xo=L(Ks,"u").replace(/punct/g,Xt).getRegex(),Qo=L(Ks,"u").replace(/punct/g,Vs).getRegex(),Zs="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",el=L(Zs,"gu").replace(/notPunctSpace/g,Ws).replace(/punctSpace/g,nr).replace(/punct/g,Xt).getRegex(),tl=L(Zs,"gu").replace(/notPunctSpace/g,Go).replace(/punctSpace/g,Jo).replace(/punct/g,Vs).getRegex(),al=L("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Ws).replace(/punctSpace/g,nr).replace(/punct/g,Xt).getRegex(),rl=L(/\\(punct)/,"gu").replace(/punct/g,Xt).getRegex(),sl=L(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),nl=L(rr).replace("(?:-->|$)","-->").getRegex(),il=L("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",nl).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Qt=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,ol=L(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label",Qt).replace("href",/<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Js=L(/^!?\[(label)\]\[(ref)\]/).replace("label",Qt).replace("ref",ar).getRegex(),Gs=L(/^!?\[(ref)\](?:\[\])?/).replace("ref",ar).getRegex(),ir={_backpedal:kt,anyPunctuation:rl,autolink:sl,blockSkip:Yo,br:Hs,code:Vo,del:kt,emStrongLDelim:Xo,emStrongRDelimAst:el,emStrongRDelimUnd:al,escape:Wo,link:ol,nolink:Gs,punctuation:Zo,reflink:Js,reflinkSearch:L("reflink|nolink(?!\\()","g").replace("reflink",Js).replace("nolink",Gs).getRegex(),tag:il,text:Ko,url:kt},ll={...ir,link:L(/^!?\[(label)\]\((.*?)\)/).replace("label",Qt).getRegex(),reflink:L(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Qt).getRegex()},or={...ir,emStrongRDelimAst:tl,emStrongLDelim:Qo,url:L(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},cl={...or,br:L(Hs).replace("{2,}","*").getRegex(),text:L(or.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},ea={normal:sr,gfm:Mo,pedantic:Ho},Et={normal:ir,gfm:or,breaks:cl,pedantic:ll},dl={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Ys=e=>dl[e];function ye(e,t){if(t){if(Y.escapeTest.test(e))return e.replace(Y.escapeReplace,Ys)}else if(Y.escapeTestNoEncode.test(e))return e.replace(Y.escapeReplaceNoEncode,Ys);return e}function Xs(e){try{e=encodeURI(e).replace(Y.percentDecode,"%")}catch{return null}return e}function Qs(e,t){let a=e.replace(Y.findPipe,(s,n,i)=>{let o=!1,l=n;for(;--l>=0&&i[l]==="\\";)o=!o;return o?"|":" |"}).split(Y.splitPipe),r=0;if(a[0].trim()||a.shift(),a.length>0&&!a.at(-1)?.trim()&&a.pop(),t)if(a.length>t)a.splice(t);else for(;a.length<t;)a.push("");for(;r<a.length;r++)a[r]=a[r].trim().replace(Y.slashPipe,"|");return a}function Dt(e,t,a){let r=e.length;if(r===0)return"";let s=0;for(;s<r&&e.charAt(r-s-1)===t;)s++;return e.slice(0,r-s)}function pl(e,t){if(e.indexOf(t[1])===-1)return-1;let a=0;for(let r=0;r<e.length;r++)if(e[r]==="\\")r++;else if(e[r]===t[0])a++;else if(e[r]===t[1]&&(a--,a<0))return r;return-1}function en(e,t,a,r,s){let n=t.href,i=t.title||null,o=e[1].replace(s.other.outputLinkReplace,"$1");if(e[0].charAt(0)!=="!"){r.state.inLink=!0;let l={type:"link",raw:a,href:n,title:i,text:o,tokens:r.inlineTokens(o)};return r.state.inLink=!1,l}return{type:"image",raw:a,href:n,title:i,text:o}}function ul(e,t,a){let r=e.match(a.other.indentCodeCompensation);if(r===null)return t;let s=r[1];return t.split(`
`).map(n=>{let i=n.match(a.other.beginningSpace);if(i===null)return n;let[o]=i;return o.length>=s.length?n.slice(s.length):n}).join(`
`)}var ta=class{options;rules;lexer;constructor(e){this.options=e||Le}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let a=t[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?a:Dt(a,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let a=t[0],r=ul(a,t[3]||"",this.rules);return{type:"code",raw:a,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:r}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let a=t[2].trim();if(this.rules.other.endingHash.test(a)){let r=Dt(a,"#");(this.options.pedantic||!r||this.rules.other.endingSpaceChar.test(r))&&(a=r.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:a,tokens:this.lexer.inline(a)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:Dt(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let a=Dt(t[0],`
`).split(`
`),r="",s="",n=[];for(;a.length>0;){let i=!1,o=[],l=0;for(;l<a.length;l++)if(this.rules.other.blockquoteStart.test(a[l]))o.push(a[l]),i=!0;else if(!i)o.push(a[l]);else break;a=a.slice(l);let c=o.join(`
`),p=c.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");r=r?`${r}
${c}`:c,s=s?`${s}
${p}`:p;let u=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(p,n,!0),this.lexer.state.top=u,a.length===0)break;let h=n.at(-1);if(h?.type==="code")break;if(h?.type==="blockquote"){let m=h,b=m.raw+`
`+a.join(`
`),g=this.blockquote(b);n[n.length-1]=g,r=r.substring(0,r.length-m.raw.length)+g.raw,s=s.substring(0,s.length-m.text.length)+g.text;break}if(h?.type==="list"){let m=h,b=m.raw+`
`+a.join(`
`),g=this.list(b);n[n.length-1]=g,r=r.substring(0,r.length-h.raw.length)+g.raw,s=s.substring(0,s.length-m.raw.length)+g.raw,a=b.substring(n.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:r,tokens:n,text:s}}}list(e){let t=this.rules.block.list.exec(e);if(t){let a=t[1].trim(),r=a.length>1,s={type:"list",raw:"",ordered:r,start:r?+a.slice(0,-1):"",loose:!1,items:[]};a=r?`\\d{1,9}\\${a.slice(-1)}`:`\\${a}`,this.options.pedantic&&(a=r?a:"[*+-]");let n=this.rules.other.listItemRegex(a),i=!1;for(;e;){let l=!1,c="",p="";if(!(t=n.exec(e))||this.rules.block.hr.test(e))break;c=t[0],e=e.substring(c.length);let u=t[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,w=>" ".repeat(3*w.length)),h=e.split(`
`,1)[0],m=!u.trim(),b=0;if(this.options.pedantic?(b=2,p=u.trimStart()):m?b=t[1].length+1:(b=t[2].search(this.rules.other.nonSpaceChar),b=b>4?1:b,p=u.slice(b),b+=t[1].length),m&&this.rules.other.blankLine.test(h)&&(c+=h+`
`,e=e.substring(h.length+1),l=!0),!l){let w=this.rules.other.nextBulletRegex(b),v=this.rules.other.hrRegex(b),x=this.rules.other.fencesBeginRegex(b),f=this.rules.other.headingBeginRegex(b),$=this.rules.other.htmlBeginRegex(b);for(;e;){let k=e.split(`
`,1)[0],S;if(h=k,this.options.pedantic?(h=h.replace(this.rules.other.listReplaceNesting,"  "),S=h):S=h.replace(this.rules.other.tabCharGlobal,"    "),x.test(h)||f.test(h)||$.test(h)||w.test(h)||v.test(h))break;if(S.search(this.rules.other.nonSpaceChar)>=b||!h.trim())p+=`
`+S.slice(b);else{if(m||u.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||x.test(u)||f.test(u)||v.test(u))break;p+=`
`+h}!m&&!h.trim()&&(m=!0),c+=k+`
`,e=e.substring(k.length+1),u=S.slice(b)}}s.loose||(i?s.loose=!0:this.rules.other.doubleBlankLine.test(c)&&(i=!0));let g=null,y;this.options.gfm&&(g=this.rules.other.listIsTask.exec(p),g&&(y=g[0]!=="[ ] ",p=p.replace(this.rules.other.listReplaceTask,""))),s.items.push({type:"list_item",raw:c,task:!!g,checked:y,loose:!1,text:p,tokens:[]}),s.raw+=c}let o=s.items.at(-1);if(o)o.raw=o.raw.trimEnd(),o.text=o.text.trimEnd();else return;s.raw=s.raw.trimEnd();for(let l=0;l<s.items.length;l++)if(this.lexer.state.top=!1,s.items[l].tokens=this.lexer.blockTokens(s.items[l].text,[]),!s.loose){let c=s.items[l].tokens.filter(p=>p.type==="space");s.loose=c.length>0&&c.some(p=>this.rules.other.anyLine.test(p.raw))}if(s.loose)for(let l=0;l<s.items.length;l++)s.items[l].loose=!0;return s}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let a=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),r=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",s=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:a,raw:t[0],href:r,title:s}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let a=Qs(t[1]),r=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),s=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],n={type:"table",raw:t[0],header:[],align:[],rows:[]};if(a.length===r.length){for(let i of r)this.rules.other.tableAlignRight.test(i)?n.align.push("right"):this.rules.other.tableAlignCenter.test(i)?n.align.push("center"):this.rules.other.tableAlignLeft.test(i)?n.align.push("left"):n.align.push(null);for(let i=0;i<a.length;i++)n.header.push({text:a[i],tokens:this.lexer.inline(a[i]),header:!0,align:n.align[i]});for(let i of s)n.rows.push(Qs(i,n.header.length).map((o,l)=>({text:o,tokens:this.lexer.inline(o),header:!1,align:n.align[l]})));return n}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let a=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:a,tokens:this.lexer.inline(a)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let a=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(a)){if(!this.rules.other.endAngleBracket.test(a))return;let n=Dt(a.slice(0,-1),"\\");if((a.length-n.length)%2==0)return}else{let n=pl(t[2],"()");if(n>-1){let i=(t[0].indexOf("!")===0?5:4)+t[1].length+n;t[2]=t[2].substring(0,n),t[0]=t[0].substring(0,i).trim(),t[3]=""}}let r=t[2],s="";if(this.options.pedantic){let n=this.rules.other.pedanticHrefTitle.exec(r);n&&(r=n[1],s=n[3])}else s=t[3]?t[3].slice(1,-1):"";return r=r.trim(),this.rules.other.startAngleBracket.test(r)&&(r=this.options.pedantic&&!this.rules.other.endAngleBracket.test(a)?r.slice(1):r.slice(1,-1)),en(t,{href:r&&r.replace(this.rules.inline.anyPunctuation,"$1"),title:s&&s.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let a;if((a=this.rules.inline.reflink.exec(e))||(a=this.rules.inline.nolink.exec(e))){let r=t[(a[2]||a[1]).replace(this.rules.other.multipleSpaceGlobal," ").toLowerCase()];if(!r){let s=a[0].charAt(0);return{type:"text",raw:s,text:s}}return en(a,r,a[0],this.lexer,this.rules)}}emStrong(e,t,a=""){let r=this.rules.inline.emStrongLDelim.exec(e);if(r&&!(r[3]&&a.match(this.rules.other.unicodeAlphaNumeric))&&(!(r[1]||r[2])||!a||this.rules.inline.punctuation.exec(a))){let s=[...r[0]].length-1,n,i,o=s,l=0,c=r[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(c.lastIndex=0,t=t.slice(-1*e.length+s);(r=c.exec(t))!=null;){if(n=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!n)continue;if(i=[...n].length,r[3]||r[4]){o+=i;continue}if((r[5]||r[6])&&s%3&&!((s+i)%3)){l+=i;continue}if(o-=i,o>0)continue;i=Math.min(i,i+o+l);let p=[...r[0]][0].length,u=e.slice(0,s+r.index+p+i);if(Math.min(s,i)%2){let m=u.slice(1,-1);return{type:"em",raw:u,text:m,tokens:this.lexer.inlineTokens(m)}}let h=u.slice(2,-2);return{type:"strong",raw:u,text:h,tokens:this.lexer.inlineTokens(h)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let a=t[2].replace(this.rules.other.newLineCharGlobal," "),r=this.rules.other.nonSpaceChar.test(a),s=this.rules.other.startingSpaceChar.test(a)&&this.rules.other.endingSpaceChar.test(a);return r&&s&&(a=a.substring(1,a.length-1)),{type:"codespan",raw:t[0],text:a}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e){let t=this.rules.inline.del.exec(e);if(t)return{type:"del",raw:t[0],text:t[2],tokens:this.lexer.inlineTokens(t[2])}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let a,r;return t[2]==="@"?(a=t[1],r="mailto:"+a):(a=t[1],r=a),{type:"link",raw:t[0],text:a,href:r,tokens:[{type:"text",raw:a,text:a}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let a,r;if(t[2]==="@")a=t[0],r="mailto:"+a;else{let s;do s=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(s!==t[0]);a=t[0],r=t[1]==="www."?"http://"+t[0]:t[0]}return{type:"link",raw:t[0],text:a,href:r,tokens:[{type:"text",raw:a,text:a}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let a=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:a}}}},$e=class os{tokens;options;state;tokenizer;inlineQueue;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||Le,this.options.tokenizer=this.options.tokenizer||new ta,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let a={other:Y,block:ea.normal,inline:Et.normal};this.options.pedantic?(a.block=ea.pedantic,a.inline=Et.pedantic):this.options.gfm&&(a.block=ea.gfm,a.inline=this.options.breaks?Et.breaks:Et.gfm),this.tokenizer.rules=a}static get rules(){return{block:ea,inline:Et}}static lex(t,a){return new os(a).lex(t)}static lexInline(t,a){return new os(a).inlineTokens(t)}lex(t){t=t.replace(Y.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let a=0;a<this.inlineQueue.length;a++){let r=this.inlineQueue[a];this.inlineTokens(r.src,r.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,a=[],r=!1){for(this.options.pedantic&&(t=t.replace(Y.tabCharGlobal,"    ").replace(Y.spaceLine,""));t;){let s;if(this.options.extensions?.block?.some(i=>(s=i.call({lexer:this},t,a))?(t=t.substring(s.raw.length),a.push(s),!0):!1))continue;if(s=this.tokenizer.space(t)){t=t.substring(s.raw.length);let i=a.at(-1);s.raw.length===1&&i!==void 0?i.raw+=`
`:a.push(s);continue}if(s=this.tokenizer.code(t)){t=t.substring(s.raw.length);let i=a.at(-1);i?.type==="paragraph"||i?.type==="text"?(i.raw+=`
`+s.raw,i.text+=`
`+s.text,this.inlineQueue.at(-1).src=i.text):a.push(s);continue}if(s=this.tokenizer.fences(t)){t=t.substring(s.raw.length),a.push(s);continue}if(s=this.tokenizer.heading(t)){t=t.substring(s.raw.length),a.push(s);continue}if(s=this.tokenizer.hr(t)){t=t.substring(s.raw.length),a.push(s);continue}if(s=this.tokenizer.blockquote(t)){t=t.substring(s.raw.length),a.push(s);continue}if(s=this.tokenizer.list(t)){t=t.substring(s.raw.length),a.push(s);continue}if(s=this.tokenizer.html(t)){t=t.substring(s.raw.length),a.push(s);continue}if(s=this.tokenizer.def(t)){t=t.substring(s.raw.length);let i=a.at(-1);i?.type==="paragraph"||i?.type==="text"?(i.raw+=`
`+s.raw,i.text+=`
`+s.raw,this.inlineQueue.at(-1).src=i.text):this.tokens.links[s.tag]||(this.tokens.links[s.tag]={href:s.href,title:s.title});continue}if(s=this.tokenizer.table(t)){t=t.substring(s.raw.length),a.push(s);continue}if(s=this.tokenizer.lheading(t)){t=t.substring(s.raw.length),a.push(s);continue}let n=t;if(this.options.extensions?.startBlock){let i=1/0,o=t.slice(1),l;this.options.extensions.startBlock.forEach(c=>{l=c.call({lexer:this},o),typeof l=="number"&&l>=0&&(i=Math.min(i,l))}),i<1/0&&i>=0&&(n=t.substring(0,i+1))}if(this.state.top&&(s=this.tokenizer.paragraph(n))){let i=a.at(-1);r&&i?.type==="paragraph"?(i.raw+=`
`+s.raw,i.text+=`
`+s.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=i.text):a.push(s),r=n.length!==t.length,t=t.substring(s.raw.length);continue}if(s=this.tokenizer.text(t)){t=t.substring(s.raw.length);let i=a.at(-1);i?.type==="text"?(i.raw+=`
`+s.raw,i.text+=`
`+s.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=i.text):a.push(s);continue}if(t){let i="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent)break;throw Error(i)}}return this.state.top=!0,a}inline(t,a=[]){return this.inlineQueue.push({src:t,tokens:a}),a}inlineTokens(t,a=[]){let r=t,s=null;if(this.tokens.links){let o=Object.keys(this.tokens.links);if(o.length>0)for(;(s=this.tokenizer.rules.inline.reflinkSearch.exec(r))!=null;)o.includes(s[0].slice(s[0].lastIndexOf("[")+1,-1))&&(r=r.slice(0,s.index)+"["+"a".repeat(s[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(s=this.tokenizer.rules.inline.blockSkip.exec(r))!=null;)r=r.slice(0,s.index)+"["+"a".repeat(s[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);for(;(s=this.tokenizer.rules.inline.anyPunctuation.exec(r))!=null;)r=r.slice(0,s.index)+"++"+r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let n=!1,i="";for(;t;){n||(i=""),n=!1;let o;if(this.options.extensions?.inline?.some(c=>(o=c.call({lexer:this},t,a))?(t=t.substring(o.raw.length),a.push(o),!0):!1))continue;if(o=this.tokenizer.escape(t)){t=t.substring(o.raw.length),a.push(o);continue}if(o=this.tokenizer.tag(t)){t=t.substring(o.raw.length),a.push(o);continue}if(o=this.tokenizer.link(t)){t=t.substring(o.raw.length),a.push(o);continue}if(o=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(o.raw.length);let c=a.at(-1);o.type==="text"&&c?.type==="text"?(c.raw+=o.raw,c.text+=o.text):a.push(o);continue}if(o=this.tokenizer.emStrong(t,r,i)){t=t.substring(o.raw.length),a.push(o);continue}if(o=this.tokenizer.codespan(t)){t=t.substring(o.raw.length),a.push(o);continue}if(o=this.tokenizer.br(t)){t=t.substring(o.raw.length),a.push(o);continue}if(o=this.tokenizer.del(t)){t=t.substring(o.raw.length),a.push(o);continue}if(o=this.tokenizer.autolink(t)){t=t.substring(o.raw.length),a.push(o);continue}if(!this.state.inLink&&(o=this.tokenizer.url(t))){t=t.substring(o.raw.length),a.push(o);continue}let l=t;if(this.options.extensions?.startInline){let c=1/0,p=t.slice(1),u;this.options.extensions.startInline.forEach(h=>{u=h.call({lexer:this},p),typeof u=="number"&&u>=0&&(c=Math.min(c,u))}),c<1/0&&c>=0&&(l=t.substring(0,c+1))}if(o=this.tokenizer.inlineText(l)){t=t.substring(o.raw.length),o.raw.slice(-1)!=="_"&&(i=o.raw.slice(-1)),n=!0;let c=a.at(-1);c?.type==="text"?(c.raw+=o.raw,c.text+=o.text):a.push(o);continue}if(t){let c="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent)break;throw Error(c)}}return a}},aa=class{options;parser;constructor(e){this.options=e||Le}space(e){return""}code({text:e,lang:t,escaped:a}){let r=(t||"").match(Y.notSpaceStart)?.[0],s=e.replace(Y.endingNewline,"")+`
`;return r?'<pre><code class="language-'+ye(r)+'">'+(a?s:ye(s,!0))+`</code></pre>
`:"<pre><code>"+(a?s:ye(s,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,a=e.start,r="";for(let i=0;i<e.items.length;i++){let o=e.items[i];r+=this.listitem(o)}let s=t?"ol":"ul",n=t&&a!==1?' start="'+a+'"':"";return"<"+s+n+`>
`+r+"</"+s+`>
`}listitem(e){let t="";if(e.task){let a=this.checkbox({checked:!!e.checked});e.loose?e.tokens[0]?.type==="paragraph"?(e.tokens[0].text=a+" "+e.tokens[0].text,e.tokens[0].tokens&&e.tokens[0].tokens.length>0&&e.tokens[0].tokens[0].type==="text"&&(e.tokens[0].tokens[0].text=a+" "+ye(e.tokens[0].tokens[0].text),e.tokens[0].tokens[0].escaped=!0)):e.tokens.unshift({type:"text",raw:a+" ",text:a+" ",escaped:!0}):t+=a+" "}return t+=this.parser.parse(e.tokens,!!e.loose),`<li>${t}</li>
`}checkbox({checked:e}){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t="",a="";for(let s=0;s<e.header.length;s++)a+=this.tablecell(e.header[s]);t+=this.tablerow({text:a});let r="";for(let s=0;s<e.rows.length;s++){let n=e.rows[s];a="";for(let i=0;i<n.length;i++)a+=this.tablecell(n[i]);r+=this.tablerow({text:a})}return r&&=`<tbody>${r}</tbody>`,`<table>
<thead>
`+t+`</thead>
`+r+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){let t=this.parser.parseInline(e.tokens),a=e.header?"th":"td";return(e.align?`<${a} align="${e.align}">`:`<${a}>`)+t+`</${a}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${ye(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:a}){let r=this.parser.parseInline(a),s=Xs(e);if(s===null)return r;e=s;let n='<a href="'+e+'"';return t&&(n+=' title="'+ye(t)+'"'),n+=">"+r+"</a>",n}image({href:e,title:t,text:a}){let r=Xs(e);if(r===null)return ye(a);e=r;let s=`<img src="${e}" alt="${a}"`;return t&&(s+=` title="${ye(t)}"`),s+=">",s}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:ye(e.text)}},lr=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}},ke=class ls{options;renderer;textRenderer;constructor(t){this.options=t||Le,this.options.renderer=this.options.renderer||new aa,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new lr}static parse(t,a){return new ls(a).parse(t)}static parseInline(t,a){return new ls(a).parseInline(t)}parse(t,a=!0){let r="";for(let s=0;s<t.length;s++){let n=t[s];if(this.options.extensions?.renderers?.[n.type]){let o=n,l=this.options.extensions.renderers[o.type].call({parser:this},o);if(l!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(o.type)){r+=l||"";continue}}let i=n;switch(i.type){case"space":r+=this.renderer.space(i);continue;case"hr":r+=this.renderer.hr(i);continue;case"heading":r+=this.renderer.heading(i);continue;case"code":r+=this.renderer.code(i);continue;case"table":r+=this.renderer.table(i);continue;case"blockquote":r+=this.renderer.blockquote(i);continue;case"list":r+=this.renderer.list(i);continue;case"html":r+=this.renderer.html(i);continue;case"paragraph":r+=this.renderer.paragraph(i);continue;case"text":{let o=i,l=this.renderer.text(o);for(;s+1<t.length&&t[s+1].type==="text";)o=t[++s],l+=`
`+this.renderer.text(o);r+=a?this.renderer.paragraph({type:"paragraph",raw:l,text:l,tokens:[{type:"text",raw:l,text:l,escaped:!0}]}):l;continue}default:{let o='Token with "'+i.type+'" type was not found.';if(this.options.silent)return"";throw Error(o)}}}return r}parseInline(t,a=this.renderer){let r="";for(let s=0;s<t.length;s++){let n=t[s];if(this.options.extensions?.renderers?.[n.type]){let o=this.options.extensions.renderers[n.type].call({parser:this},n);if(o!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(n.type)){r+=o||"";continue}}let i=n;switch(i.type){case"escape":r+=a.text(i);break;case"html":r+=a.html(i);break;case"link":r+=a.link(i);break;case"image":r+=a.image(i);break;case"strong":r+=a.strong(i);break;case"em":r+=a.em(i);break;case"codespan":r+=a.codespan(i);break;case"br":r+=a.br(i);break;case"del":r+=a.del(i);break;case"text":r+=a.text(i);break;default:{let o='Token with "'+i.type+'" type was not found.';if(this.options.silent)return"";throw Error(o)}}}return r}},ra=class{options;block;constructor(e){this.options=e||Le}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}provideLexer(){return this.block?$e.lex:$e.lexInline}provideParser(){return this.block?ke.parse:ke.parseInline}},Re=new class{defaults=er();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=ke;Renderer=aa;TextRenderer=lr;Lexer=$e;Tokenizer=ta;Hooks=ra;constructor(...e){this.use(...e)}walkTokens(e,t){let a=[];for(let r of e)switch(a=a.concat(t.call(this,r)),r.type){case"table":{let s=r;for(let n of s.header)a=a.concat(this.walkTokens(n.tokens,t));for(let n of s.rows)for(let i of n)a=a.concat(this.walkTokens(i.tokens,t));break}case"list":{let s=r;a=a.concat(this.walkTokens(s.items,t));break}default:{let s=r;this.defaults.extensions?.childTokens?.[s.type]?this.defaults.extensions.childTokens[s.type].forEach(n=>{let i=s[n].flat(1/0);a=a.concat(this.walkTokens(i,t))}):s.tokens&&(a=a.concat(this.walkTokens(s.tokens,t)))}}return a}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(a=>{let r={...a};if(r.async=this.defaults.async||r.async||!1,a.extensions&&(a.extensions.forEach(s=>{if(!s.name)throw Error("extension name required");if("renderer"in s){let n=t.renderers[s.name];n?t.renderers[s.name]=function(...i){let o=s.renderer.apply(this,i);return o===!1&&(o=n.apply(this,i)),o}:t.renderers[s.name]=s.renderer}if("tokenizer"in s){if(!s.level||s.level!=="block"&&s.level!=="inline")throw Error("extension level must be 'block' or 'inline'");let n=t[s.level];n?n.unshift(s.tokenizer):t[s.level]=[s.tokenizer],s.start&&(s.level==="block"?t.startBlock?t.startBlock.push(s.start):t.startBlock=[s.start]:s.level==="inline"&&(t.startInline?t.startInline.push(s.start):t.startInline=[s.start]))}"childTokens"in s&&s.childTokens&&(t.childTokens[s.name]=s.childTokens)}),r.extensions=t),a.renderer){let s=this.defaults.renderer||new aa(this.defaults);for(let n in a.renderer){if(!(n in s))throw Error(`renderer '${n}' does not exist`);if(["options","parser"].includes(n))continue;let i=n,o=a.renderer[i],l=s[i];s[i]=(...c)=>{let p=o.apply(s,c);return p===!1&&(p=l.apply(s,c)),p||""}}r.renderer=s}if(a.tokenizer){let s=this.defaults.tokenizer||new ta(this.defaults);for(let n in a.tokenizer){if(!(n in s))throw Error(`tokenizer '${n}' does not exist`);if(["options","rules","lexer"].includes(n))continue;let i=n,o=a.tokenizer[i],l=s[i];s[i]=(...c)=>{let p=o.apply(s,c);return p===!1&&(p=l.apply(s,c)),p}}r.tokenizer=s}if(a.hooks){let s=this.defaults.hooks||new ra;for(let n in a.hooks){if(!(n in s))throw Error(`hook '${n}' does not exist`);if(["options","block"].includes(n))continue;let i=n,o=a.hooks[i],l=s[i];s[i]=ra.passThroughHooks.has(n)?c=>{if(this.defaults.async)return Promise.resolve(o.call(s,c)).then(u=>l.call(s,u));let p=o.call(s,c);return l.call(s,p)}:(...c)=>{let p=o.apply(s,c);return p===!1&&(p=l.apply(s,c)),p}}r.hooks=s}if(a.walkTokens){let s=this.defaults.walkTokens,n=a.walkTokens;r.walkTokens=function(i){let o=[];return o.push(n.call(this,i)),s&&(o=o.concat(s.call(this,i))),o}}this.defaults={...this.defaults,...r}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return $e.lex(e,t??this.defaults)}parser(e,t){return ke.parse(e,t??this.defaults)}parseMarkdown(e){return(t,a)=>{let r={...a},s={...this.defaults,...r},n=this.onError(!!s.silent,!!s.async);if(this.defaults.async===!0&&r.async===!1)return n(Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(t==null)return n(Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return n(Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));s.hooks&&(s.hooks.options=s,s.hooks.block=e);let i=s.hooks?s.hooks.provideLexer():e?$e.lex:$e.lexInline,o=s.hooks?s.hooks.provideParser():e?ke.parse:ke.parseInline;if(s.async)return Promise.resolve(s.hooks?s.hooks.preprocess(t):t).then(l=>i(l,s)).then(l=>s.hooks?s.hooks.processAllTokens(l):l).then(l=>s.walkTokens?Promise.all(this.walkTokens(l,s.walkTokens)).then(()=>l):l).then(l=>o(l,s)).then(l=>s.hooks?s.hooks.postprocess(l):l).catch(n);try{s.hooks&&(t=s.hooks.preprocess(t));let l=i(t,s);s.hooks&&(l=s.hooks.processAllTokens(l)),s.walkTokens&&this.walkTokens(l,s.walkTokens);let c=o(l,s);return s.hooks&&(c=s.hooks.postprocess(c)),c}catch(l){return n(l)}}}onError(e,t){return a=>{if(a.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let r="<p>An error occurred:</p><pre>"+ye(a.message+"",!0)+"</pre>";return t?Promise.resolve(r):r}if(t)return Promise.reject(a);throw a}}};function D(e,t){return Re.parse(e,t)}D.options=D.setOptions=function(e){return Re.setOptions(e),D.defaults=Re.defaults,qs(D.defaults),D},D.getDefaults=er,D.defaults=Le,D.use=function(...e){return Re.use(...e),D.defaults=Re.defaults,qs(D.defaults),D},D.walkTokens=function(e,t){return Re.walkTokens(e,t)},D.parseInline=Re.parseInline,D.Parser=ke,D.parser=ke.parse,D.Renderer=aa,D.TextRenderer=lr,D.Lexer=$e,D.lexer=$e.lex,D.Tokenizer=ta,D.Hooks=ra,D.parse=D,D.options,D.setOptions,D.use,D.walkTokens,D.parseInline,ke.parse,$e.lex;var hl=/[\0-\x1F!-,\.\/:-@\[-\^`\{-\xA9\xAB-\xB4\xB6-\xB9\xBB-\xBF\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0378\u0379\u037E\u0380-\u0385\u0387\u038B\u038D\u03A2\u03F6\u0482\u0530\u0557\u0558\u055A-\u055F\u0589-\u0590\u05BE\u05C0\u05C3\u05C6\u05C8-\u05CF\u05EB-\u05EE\u05F3-\u060F\u061B-\u061F\u066A-\u066D\u06D4\u06DD\u06DE\u06E9\u06FD\u06FE\u0700-\u070F\u074B\u074C\u07B2-\u07BF\u07F6-\u07F9\u07FB\u07FC\u07FE\u07FF\u082E-\u083F\u085C-\u085F\u086B-\u089F\u08B5\u08C8-\u08D2\u08E2\u0964\u0965\u0970\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09F2-\u09FB\u09FD\u09FF\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF0-\u0AF8\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B54\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B70\u0B72-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BF0-\u0BFF\u0C0D\u0C11\u0C29\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5B-\u0C5F\u0C64\u0C65\u0C70-\u0C7F\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0CFF\u0D0D\u0D11\u0D45\u0D49\u0D4F-\u0D53\u0D58-\u0D5E\u0D64\u0D65\u0D70-\u0D79\u0D80\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DE5\u0DF0\u0DF1\u0DF4-\u0E00\u0E3B-\u0E3F\u0E4F\u0E5A-\u0E80\u0E83\u0E85\u0E8B\u0EA4\u0EA6\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F01-\u0F17\u0F1A-\u0F1F\u0F2A-\u0F34\u0F36\u0F38\u0F3A-\u0F3D\u0F48\u0F6D-\u0F70\u0F85\u0F98\u0FBD-\u0FC5\u0FC7-\u0FFF\u104A-\u104F\u109E\u109F\u10C6\u10C8-\u10CC\u10CE\u10CF\u10FB\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u1360-\u137F\u1390-\u139F\u13F6\u13F7\u13FE-\u1400\u166D\u166E\u1680\u169B-\u169F\u16EB-\u16ED\u16F9-\u16FF\u170D\u1715-\u171F\u1735-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17D4-\u17D6\u17D8-\u17DB\u17DE\u17DF\u17EA-\u180A\u180E\u180F\u181A-\u181F\u1879-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191F\u192C-\u192F\u193C-\u1945\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DA-\u19FF\u1A1C-\u1A1F\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1AA6\u1AA8-\u1AAF\u1AC1-\u1AFF\u1B4C-\u1B4F\u1B5A-\u1B6A\u1B74-\u1B7F\u1BF4-\u1BFF\u1C38-\u1C3F\u1C4A-\u1C4C\u1C7E\u1C7F\u1C89-\u1C8F\u1CBB\u1CBC\u1CC0-\u1CCF\u1CD3\u1CFB-\u1CFF\u1DFA\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FBD\u1FBF-\u1FC1\u1FC5\u1FCD-\u1FCF\u1FD4\u1FD5\u1FDC-\u1FDF\u1FED-\u1FF1\u1FF5\u1FFD-\u203E\u2041-\u2053\u2055-\u2070\u2072-\u207E\u2080-\u208F\u209D-\u20CF\u20F1-\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F-\u215F\u2189-\u24B5\u24EA-\u2BFF\u2C2F\u2C5F\u2CE5-\u2CEA\u2CF4-\u2CFF\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D70-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E00-\u2E2E\u2E30-\u3004\u3008-\u3020\u3030\u3036\u3037\u303D-\u3040\u3097\u3098\u309B\u309C\u30A0\u30FB\u3100-\u3104\u3130\u318F-\u319F\u31C0-\u31EF\u3200-\u33FF\u4DC0-\u4DFF\u9FFD-\u9FFF\uA48D-\uA4CF\uA4FE\uA4FF\uA60D-\uA60F\uA62C-\uA63F\uA673\uA67E\uA6F2-\uA716\uA720\uA721\uA789\uA78A\uA7C0\uA7C1\uA7CB-\uA7F4\uA828-\uA82B\uA82D-\uA83F\uA874-\uA87F\uA8C6-\uA8CF\uA8DA-\uA8DF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA954-\uA95F\uA97D-\uA97F\uA9C1-\uA9CE\uA9DA-\uA9DF\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A-\uAA5F\uAA77-\uAA79\uAAC3-\uAADA\uAADE\uAADF\uAAF0\uAAF1\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F\uAB5B\uAB6A-\uAB6F\uABEB\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uD7FF\uE000-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB29\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBB2-\uFBD2\uFD3E-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFC-\uFDFF\uFE10-\uFE1F\uFE30-\uFE32\uFE35-\uFE4C\uFE50-\uFE6F\uFE75\uFEFD-\uFF0F\uFF1A-\uFF20\uFF3B-\uFF3E\uFF40\uFF5B-\uFF65\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFFF]|\uD800[\uDC0C\uDC27\uDC3B\uDC3E\uDC4E\uDC4F\uDC5E-\uDC7F\uDCFB-\uDD3F\uDD75-\uDDFC\uDDFE-\uDE7F\uDE9D-\uDE9F\uDED1-\uDEDF\uDEE1-\uDEFF\uDF20-\uDF2C\uDF4B-\uDF4F\uDF7B-\uDF7F\uDF9E\uDF9F\uDFC4-\uDFC7\uDFD0\uDFD6-\uDFFF]|\uD801[\uDC9E\uDC9F\uDCAA-\uDCAF\uDCD4-\uDCD7\uDCFC-\uDCFF\uDD28-\uDD2F\uDD64-\uDDFF\uDF37-\uDF3F\uDF56-\uDF5F\uDF68-\uDFFF]|\uD802[\uDC06\uDC07\uDC09\uDC36\uDC39-\uDC3B\uDC3D\uDC3E\uDC56-\uDC5F\uDC77-\uDC7F\uDC9F-\uDCDF\uDCF3\uDCF6-\uDCFF\uDD16-\uDD1F\uDD3A-\uDD7F\uDDB8-\uDDBD\uDDC0-\uDDFF\uDE04\uDE07-\uDE0B\uDE14\uDE18\uDE36\uDE37\uDE3B-\uDE3E\uDE40-\uDE5F\uDE7D-\uDE7F\uDE9D-\uDEBF\uDEC8\uDEE7-\uDEFF\uDF36-\uDF3F\uDF56-\uDF5F\uDF73-\uDF7F\uDF92-\uDFFF]|\uD803[\uDC49-\uDC7F\uDCB3-\uDCBF\uDCF3-\uDCFF\uDD28-\uDD2F\uDD3A-\uDE7F\uDEAA\uDEAD-\uDEAF\uDEB2-\uDEFF\uDF1D-\uDF26\uDF28-\uDF2F\uDF51-\uDFAF\uDFC5-\uDFDF\uDFF7-\uDFFF]|\uD804[\uDC47-\uDC65\uDC70-\uDC7E\uDCBB-\uDCCF\uDCE9-\uDCEF\uDCFA-\uDCFF\uDD35\uDD40-\uDD43\uDD48-\uDD4F\uDD74\uDD75\uDD77-\uDD7F\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDFF\uDE12\uDE38-\uDE3D\uDE3F-\uDE7F\uDE87\uDE89\uDE8E\uDE9E\uDEA9-\uDEAF\uDEEB-\uDEEF\uDEFA-\uDEFF\uDF04\uDF0D\uDF0E\uDF11\uDF12\uDF29\uDF31\uDF34\uDF3A\uDF45\uDF46\uDF49\uDF4A\uDF4E\uDF4F\uDF51-\uDF56\uDF58-\uDF5C\uDF64\uDF65\uDF6D-\uDF6F\uDF75-\uDFFF]|\uD805[\uDC4B-\uDC4F\uDC5A-\uDC5D\uDC62-\uDC7F\uDCC6\uDCC8-\uDCCF\uDCDA-\uDD7F\uDDB6\uDDB7\uDDC1-\uDDD7\uDDDE-\uDDFF\uDE41-\uDE43\uDE45-\uDE4F\uDE5A-\uDE7F\uDEB9-\uDEBF\uDECA-\uDEFF\uDF1B\uDF1C\uDF2C-\uDF2F\uDF3A-\uDFFF]|\uD806[\uDC3B-\uDC9F\uDCEA-\uDCFE\uDD07\uDD08\uDD0A\uDD0B\uDD14\uDD17\uDD36\uDD39\uDD3A\uDD44-\uDD4F\uDD5A-\uDD9F\uDDA8\uDDA9\uDDD8\uDDD9\uDDE2\uDDE5-\uDDFF\uDE3F-\uDE46\uDE48-\uDE4F\uDE9A-\uDE9C\uDE9E-\uDEBF\uDEF9-\uDFFF]|\uD807[\uDC09\uDC37\uDC41-\uDC4F\uDC5A-\uDC71\uDC90\uDC91\uDCA8\uDCB7-\uDCFF\uDD07\uDD0A\uDD37-\uDD39\uDD3B\uDD3E\uDD48-\uDD4F\uDD5A-\uDD5F\uDD66\uDD69\uDD8F\uDD92\uDD99-\uDD9F\uDDAA-\uDEDF\uDEF7-\uDFAF\uDFB1-\uDFFF]|\uD808[\uDF9A-\uDFFF]|\uD809[\uDC6F-\uDC7F\uDD44-\uDFFF]|[\uD80A\uD80B\uD80E-\uD810\uD812-\uD819\uD824-\uD82B\uD82D\uD82E\uD830-\uD833\uD837\uD839\uD83D\uD83F\uD87B-\uD87D\uD87F\uD885-\uDB3F\uDB41-\uDBFF][\uDC00-\uDFFF]|\uD80D[\uDC2F-\uDFFF]|\uD811[\uDE47-\uDFFF]|\uD81A[\uDE39-\uDE3F\uDE5F\uDE6A-\uDECF\uDEEE\uDEEF\uDEF5-\uDEFF\uDF37-\uDF3F\uDF44-\uDF4F\uDF5A-\uDF62\uDF78-\uDF7C\uDF90-\uDFFF]|\uD81B[\uDC00-\uDE3F\uDE80-\uDEFF\uDF4B-\uDF4E\uDF88-\uDF8E\uDFA0-\uDFDF\uDFE2\uDFE5-\uDFEF\uDFF2-\uDFFF]|\uD821[\uDFF8-\uDFFF]|\uD823[\uDCD6-\uDCFF\uDD09-\uDFFF]|\uD82C[\uDD1F-\uDD4F\uDD53-\uDD63\uDD68-\uDD6F\uDEFC-\uDFFF]|\uD82F[\uDC6B-\uDC6F\uDC7D-\uDC7F\uDC89-\uDC8F\uDC9A-\uDC9C\uDC9F-\uDFFF]|\uD834[\uDC00-\uDD64\uDD6A-\uDD6C\uDD73-\uDD7A\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDE41\uDE45-\uDFFF]|\uD835[\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3\uDFCC\uDFCD]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85-\uDE9A\uDEA0\uDEB0-\uDFFF]|\uD838[\uDC07\uDC19\uDC1A\uDC22\uDC25\uDC2B-\uDCFF\uDD2D-\uDD2F\uDD3E\uDD3F\uDD4A-\uDD4D\uDD4F-\uDEBF\uDEFA-\uDFFF]|\uD83A[\uDCC5-\uDCCF\uDCD7-\uDCFF\uDD4C-\uDD4F\uDD5A-\uDFFF]|\uD83B[\uDC00-\uDDFF\uDE04\uDE20\uDE23\uDE25\uDE26\uDE28\uDE33\uDE38\uDE3A\uDE3C-\uDE41\uDE43-\uDE46\uDE48\uDE4A\uDE4C\uDE50\uDE53\uDE55\uDE56\uDE58\uDE5A\uDE5C\uDE5E\uDE60\uDE63\uDE65\uDE66\uDE6B\uDE73\uDE78\uDE7D\uDE7F\uDE8A\uDE9C-\uDEA0\uDEA4\uDEAA\uDEBC-\uDFFF]|\uD83C[\uDC00-\uDD2F\uDD4A-\uDD4F\uDD6A-\uDD6F\uDD8A-\uDFFF]|\uD83E[\uDC00-\uDFEF\uDFFA-\uDFFF]|\uD869[\uDEDE-\uDEFF]|\uD86D[\uDF35-\uDF3F]|\uD86E[\uDC1E\uDC1F]|\uD873[\uDEA2-\uDEAF]|\uD87A[\uDFE1-\uDFFF]|\uD87E[\uDE1E-\uDFFF]|\uD884[\uDF4B-\uDFFF]|\uDB40[\uDC00-\uDCFF\uDDF0-\uDFFF]/g,ml=Object.hasOwnProperty,At=class{constructor(){this.occurrences,this.reset()}slug(e,t){let a=this,r=fl(e,t===!0),s=r;for(;ml.call(a.occurrences,r);)a.occurrences[s]++,r=s+"-"+a.occurrences[s];return a.occurrences[r]=0,r}reset(){this.occurrences=Object.create(null)}};function fl(e,t){return typeof e=="string"?(t||(e=e.toLowerCase()),e.replace(hl,"").replace(/ /g,"-")):""}var tn={astro:{scopeName:"source.astro",dependencies:["html","css","scss","javascript","typescript","tsx"],patterns:[{include:"#frontmatter"},{include:"#script"},{include:"#style"},{include:"#interpolation"},{include:"text.html.basic"}],repository:{frontmatter:{begin:"^---\\s*$",end:"^---\\s*$",beginCaptures:{0:{name:"punctuation.definition.frontmatter.begin.astro"}},endCaptures:{0:{name:"punctuation.definition.frontmatter.end.astro"}},contentName:"meta.embedded.block.astro",patterns:[{include:"source.ts"}]},script:{patterns:[{begin:"<(script)\\s*>",end:"</(script)\\s*>",beginCaptures:{1:{name:"entity.name.tag"}},endCaptures:{1:{name:"entity.name.tag"}},contentName:"source.ts.embedded.astro",patterns:[{include:"source.ts"}]},{include:"text.html.basic#embedded-javascript"}]},style:{patterns:[{begin:`<(style)\\b(?=[^>]*\\blang\\s*=\\s*(['"])scss\\2)[^>]*>`,end:"</(style)\\s*>",beginCaptures:{1:{name:"entity.name.tag"}},endCaptures:{1:{name:"entity.name.tag"}},contentName:"source.scss.embedded.astro",patterns:[{include:"source.scss"}]},{include:"source.css"}]},interpolation:{begin:"\\{",end:"\\}",beginCaptures:{0:{name:"punctuation.section.embedded.begin.astro"}},endCaptures:{0:{name:"punctuation.section.embedded.end.astro"}},contentName:"meta.embedded.expression.astro",patterns:[{include:"text.html.basic#comments"},{include:"source.tsx"}]}}},bash:{scopeName:"source.shell",patterns:[{match:"^#!.*$",name:"comment.line.shebang"},{match:"(?!^#!)#.*$",name:"comment.line.number-sign"},{match:"'(?:[^']*)'",name:"string.quoted.single"},{match:'"(?:\\\\.|[^"\\\\])*"',name:"string.quoted.double"},{match:"\\$[a-zA-Z_][\\w]*|\\$\\d+|\\$[?@*#$!_-]|\\$\\{[^}]+\\}",name:"entity.name.variable"},{match:"\\b([a-zA-Z_][\\w]*)(?==)",captures:{1:{name:"entity.name.variable.assignment"}}},{match:"\\b(?:if|then|else|elif|fi|for|while|until|in|do|done|case|esac|function|select|time|coproc)\\b",name:"keyword.control"},{match:"(?:&&|\\|\\||[|&;])",name:"keyword.operator"},{match:"(?<![\\w-])--?[a-zA-Z][\\w-]*(?:=[^\\s]+)?",name:"constant.language.option"},{match:"(?<![\\w.])-?\\d+(?:\\.\\d+)?\\b",name:"constant.numeric"}]},c:{scopeName:"source.c",patterns:[{include:"#comments"},{include:"#preprocessor"},{include:"#strings"},{include:"#storage-types"},{include:"#keywords"},{include:"#builtin-types"},{include:"#constants"},{include:"#numbers"},{include:"#operators"},{include:"#function-declaration"}],repository:{comments:{patterns:[{match:"//.*$",name:"comment.line.double-slash"},{begin:"/\\*",end:"\\*/",name:"comment.block"}]},preprocessor:{patterns:[{begin:"^\\s*#\\s*include\\b",end:"$",name:"keyword.control.directive.include",patterns:[{match:"<[^>]*>",name:"string.quoted.other.lt-gt"},{match:'"(?:\\\\.|[^"\\\\\\r\\n])*"',name:"string.quoted.double"}]},{match:"^\\s*#\\s*(?:define|undef|ifdef|ifndef|if|elif|else|endif|pragma|error|warning|line)\\b.*$",name:"keyword.control.directive"}]},strings:{patterns:[{match:"'(?:\\\\.|[^'\\\\\\r\\n])'",name:"string.quoted.char"},{match:'"(?:\\\\.|[^"\\\\\\r\\n])*"',name:"string.quoted.double"}]},"storage-types":{match:"\\b(?:auto|const|enum|extern|inline|register|restrict|signed|static|struct|typedef|union|unsigned|volatile)\\b",name:"storage.modifier"},keywords:{match:"\\b(?:break|case|continue|default|do|else|for|goto|if|return|sizeof|switch|while)\\b",name:"keyword.control"},"builtin-types":{match:"\\b(?:char|double|float|int|long|short|void|_Bool|int8_t|int16_t|int32_t|int64_t|uint8_t|uint16_t|uint32_t|uint64_t|size_t|ssize_t|ptrdiff_t|FILE)\\b",name:"support.class.builtin"},constants:{match:"\\b(?:NULL|true|false)\\b",name:"constant.language"},numbers:{match:"(?<![\\w.])(?:0[xX][0-9a-fA-F]+|0[bB][01]+|(?:\\d+\\.\\d*|\\.\\d+|\\d+)(?:[eE][+-]?\\d+)?)[uUlLfF]*\\b",name:"constant.numeric"},operators:{match:"(?:->|\\+\\+|--|&&|\\|\\||<<=?|>>=?|==|!=|<=|>=|[+\\-*/%&|^!~<>=]=?)",name:"keyword.operator"},"function-declaration":{match:"\\b([A-Za-z_]\\w*)(?=\\s*\\()",name:"entity.name.function"}}},cpp:{scopeName:"source.cpp",dependencies:["c"],patterns:[{include:"source.c#comments"},{include:"source.c#preprocessor"},{include:"source.c#strings"},{include:"#class-declaration"},{include:"#keywords"},{include:"source.c#storage-types"},{include:"source.c#keywords"},{include:"source.c#builtin-types"},{include:"#stl-types"},{include:"#constants"},{include:"source.c#constants"},{include:"#numbers"},{include:"#operators"},{include:"source.c#function-declaration"}],repository:{"class-declaration":{match:"\\b(class|struct|enum|namespace)\\s+([A-Za-z_]\\w*)",captures:{1:{name:"storage.type.class"},2:{name:"entity.name.type.class"}}},keywords:{match:"\\b(?:catch|class|const_cast|constexpr|decltype|delete|dynamic_cast|explicit|export|final|friend|mutable|namespace|new|noexcept|nullptr|operator|override|private|protected|public|reinterpret_cast|static_assert|static_cast|template|this|throw|try|typeid|typename|using|virtual)\\b",name:"keyword.control"},"stl-types":{match:"\\bstd::(?:array|deque|forward_list|list|map|multimap|multiset|pair|priority_queue|queue|set|shared_ptr|stack|string|tuple|unique_ptr|unordered_map|unordered_set|vector|weak_ptr)\\b",name:"support.class.builtin"},constants:{match:"\\b(?:true|false)\\b",name:"constant.language.boolean"},numbers:{match:"(?<![\\w.])(?:0[xX][0-9a-fA-F']+|0[bB][01']+|(?:\\d[\\d']*\\.[\\d']*|\\.\\d[\\d']*|\\d[\\d']*)(?:[eE][+-]?\\d+)?)[uUlLfF]*\\b",name:"constant.numeric"},operators:{match:"(?:->\\*?|::|\\.\\.\\.|<=>|&&|\\|\\||<<=?|>>=?|==|!=|<=|>=|[+\\-*/%&|^!~<>=]=?)",name:"keyword.operator"}}},csharp:{scopeName:"source.cs",patterns:[{include:"#comments"},{include:"#strings"},{include:"#attributes"},{include:"#class-declaration"},{include:"#keywords"},{include:"#builtin-types"},{include:"#constants"},{include:"#numbers"},{include:"#operators"},{include:"#function-declaration"}],repository:{comments:{patterns:[{match:"///.*$",name:"comment.line.documentation"},{match:"//.*$",name:"comment.line.double-slash"},{begin:"/\\*",end:"\\*/",name:"comment.block"}]},strings:{patterns:[{match:'@"(?:""|[^"])*"',name:"string.quoted.double.verbatim"},{match:'\\$@"(?:""|\\{\\{|\\}\\}|[^"])*"',name:"string.quoted.double.interpolated"},{match:'@\\$"(?:""|\\{\\{|\\}\\}|[^"])*"',name:"string.quoted.double.interpolated"},{match:'\\$"(?:\\\\.|\\{\\{|\\}\\}|[^"\\\\\\r\\n])*"',name:"string.quoted.double.interpolated"},{match:'"(?:\\\\.|[^"\\\\\\r\\n])*"',name:"string.quoted.double"},{match:"'(?:\\\\.|[^'\\\\\\r\\n])'",name:"string.quoted.char"}]},attributes:{match:"\\[[A-Za-z_][\\w.]*\\]",name:"entity.name.decorator"},"class-declaration":{match:"\\b(class|interface|struct|enum|record)\\s+([A-Za-z_]\\w*)",captures:{1:{name:"storage.type.class"},2:{name:"entity.name.type.class"}}},keywords:{match:"\\b(?:abstract|as|async|await|base|break|case|catch|checked|const|continue|default|delegate|do|else|event|explicit|extern|finally|fixed|for|foreach|goto|if|implicit|in|internal|is|lock|namespace|new|null|operator|out|override|params|partial|private|protected|public|readonly|ref|return|sealed|sizeof|stackalloc|static|switch|this|throw|try|typeof|unchecked|unsafe|using|virtual|volatile|while|yield)\\b",name:"keyword.control"},"builtin-types":{match:"\\b(?:bool|byte|char|decimal|double|dynamic|float|int|long|object|sbyte|short|string|uint|ulong|ushort|var|void)\\b",name:"support.class.builtin"},constants:{patterns:[{match:"\\b(?:true|false)\\b",name:"constant.language.boolean"},{match:"\\bnull\\b",name:"constant.language"}]},numbers:{match:"(?<![\\w.])(?:0[xX][0-9a-fA-F_]+|0[bB][01_]+|\\d(?:_?\\d)*(?:\\.\\d(?:_?\\d)*)?(?:[eE][+-]?\\d+)?)[uUlLfFdDmM]*\\b",name:"constant.numeric"},operators:{match:"(?:=>|\\?\\?=?|\\?\\.|::|&&|\\|\\||==|!=|<=|>=|<<=?|>>=?|[+\\-*/%&|^!~<>=]=?)",name:"keyword.operator"},"function-declaration":{match:"\\b([A-Za-z_]\\w*)(?=\\s*(?:<[^>]*>)?\\s*\\()",name:"entity.name.function"}}},css:{scopeName:"source.css",patterns:[{include:"#comments"},{include:"#strings"},{include:"#keyframes"},{include:"#at-rule-block"},{include:"#at-rule-statement"},{include:"#rule-set"}],repository:{comments:{begin:"/\\*",end:"\\*/",name:"comment.block"},strings:{match:`(['"])(?:\\\\.|(?!\\1)[^\\\\\\r\\n])*\\1`,name:"string.quoted"},keyframes:{begin:"(@(?:-\\w+-)?keyframes)\\s+([a-zA-Z_-][\\w-]*)\\s*\\{",end:"\\}",beginCaptures:{1:{name:"keyword.control.at-rule"},2:{name:"entity.name.animation"}},patterns:[{include:"$self"}]},"at-rule-block":{begin:"(@(?:container|counter-style|document|font-face|font-feature-values|font-palette-values|layer|media|page|position-try|scope|starting-style|supports|view-transition)\\b)[^{;]*\\{",end:"\\}",beginCaptures:{1:{name:"keyword.control.at-rule"}},patterns:[{include:"$self"}]},"at-rule-statement":{begin:"(@(?:charset|custom-media|import|namespace|property)\\b)",end:";",beginCaptures:{1:{name:"keyword.control.at-rule"}},patterns:[{include:"#comments"},{include:"#strings"},{include:"#values"}]},"rule-set":{begin:"([^\\s@{};<][^@{};<]*?)\\s*\\{",end:"\\}",beginCaptures:{1:{name:"entity.name.selector"}},patterns:[{include:"#comments"},{include:"#strings"},{include:"#keyframes"},{include:"#at-rule-block"},{include:"#at-rule-statement"},{include:"#rule-set"},{include:"#declarations"},{include:"#values"}]},declarations:{match:"(--[a-zA-Z0-9_-]+|[a-zA-Z-][\\w-]*)(\\s*:)",captures:{1:{name:"support.type.property-name"}}},values:{patterns:[{match:"!important\\b",name:"keyword.other.important"},{match:"\\b(var)\\(\\s*(--[a-zA-Z0-9_-]+)",captures:{1:{name:"entity.name.function"},2:{name:"variable.other.custom-property"}}},{match:"\\b([a-zA-Z_-][\\w-]*)(?=\\()",captures:{1:{name:"entity.name.function"}}},{match:"#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\\b",name:"constant.other.color"},{match:"(?<![\\w.-])-?(?:\\d*\\.\\d+|\\d+)(?:[eE][+-]?\\d+)?(?:%|[a-zA-Z]+)?\\b",name:"constant.numeric"},{match:"\\b(?:auto|currentColor|inherit|initial|none|normal|revert|revert-layer|transparent|unset)\\b",name:"constant.language"},{match:"(?:[+*/]|(?<=\\s)-(?!-))",name:"keyword.operator"}]}}},go:{scopeName:"source.go",patterns:[{include:"#comments"},{include:"#strings"},{include:"#function-declaration"},{include:"#type-declaration"},{include:"#keywords"},{include:"#constants"},{include:"#builtin-types"},{include:"#builtin-functions"},{include:"#numbers"},{include:"#operators"}],repository:{comments:{patterns:[{match:"//.*$",name:"comment.line.double-slash"},{begin:"/\\*",end:"\\*/",name:"comment.block"}]},strings:{patterns:[{begin:"`",end:"`",name:"string.quoted.raw"},{match:'"(?:\\\\.|[^"\\\\\\r\\n])*"',name:"string.quoted.double"},{match:"'(?:\\\\.|[^'\\\\\\r\\n])*'",name:"string.quoted.rune"}]},"function-declaration":{match:"\\b(func)\\s+(?:\\([^)]*\\)\\s*)?([A-Za-z_]\\w*)",captures:{1:{name:"storage.type.function"},2:{name:"entity.name.function"}}},"type-declaration":{match:"\\b(type)\\s+([A-Za-z_]\\w*)",captures:{1:{name:"storage.type"},2:{name:"entity.name.type.class"}}},keywords:{match:"\\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go|goto|if|import|interface|map|package|range|return|select|struct|switch|type|var)\\b",name:"keyword.control"},constants:{patterns:[{match:"\\b(?:true|false)\\b",name:"constant.language.boolean"},{match:"\\b(?:nil|iota)\\b",name:"constant.language"}]},"builtin-types":{match:"\\b(?:any|bool|byte|complex64|complex128|error|float32|float64|int|int8|int16|int32|int64|rune|string|uint|uint8|uint16|uint32|uint64|uintptr)\\b",name:"support.class.builtin"},"builtin-functions":{match:"\\b(?:append|cap|close|complex|copy|delete|imag|len|make|new|panic|print|println|real|recover)\\b(?=\\s*\\()",name:"entity.name.function"},numbers:{match:"(?<![\\w.])(?:0[xX][0-9a-fA-F_]+|0[oO][0-7_]+|0[bB][01_]+|\\d(?:_?\\d)*(?:\\.\\d(?:_?\\d)*)?(?:[eE][+-]?\\d+)?i?)\\b",name:"constant.numeric"},operators:{match:"(?::=|\\.\\.\\.|<-|\\|\\||&&|==|!=|<=|>=|<<|>>|[+\\-*/%&|^!<>=]=?)",name:"keyword.operator"}}},html:{scopeName:"text.html.basic",dependencies:["css","json","javascript"],patterns:[{include:"#comments"},{include:"#doctype"},{include:"#embedded-css"},{include:"#embedded-json"},{include:"#embedded-javascript"},{include:"#raw-text"},{include:"#tags"},{include:"#entities"}],repository:{comments:{begin:"<!--",end:"-->",name:"comment.block"},doctype:{match:"<![Dd][Oo][Cc][Tt][Yy][Pp][Ee]\\b[^>]*>",name:"keyword.control.doctype"},"embedded-css":{begin:`<([Ss][Tt][Yy][Ll][Ee])\\b(?:"[^"]*"|'[^']*'|[^'">])*>`,end:"</([Ss][Tt][Yy][Ll][Ee])[ \\t]*>",beginCaptures:{1:{name:"entity.name.tag"}},endCaptures:{1:{name:"entity.name.tag"}},contentName:"source.css.embedded.html",patterns:[{include:"source.css"}]},"embedded-json":{begin:`<([Ss][Cc][Rr][Ii][Pp][Tt])\\b(?=[^>]*\\b[Tt][Yy][Pp][Ee]\\s*=\\s*(['"])(?:application/(?:ld\\+)?json|importmap|speculationrules)\\2)(?:"[^"]*"|'[^']*'|[^'">])*>`,end:"</([Ss][Cc][Rr][Ii][Pp][Tt])[ \\t]*>",beginCaptures:{1:{name:"entity.name.tag"}},endCaptures:{1:{name:"entity.name.tag"}},contentName:"source.json.embedded.html",patterns:[{include:"source.json"}]},"embedded-javascript":{begin:`<([Ss][Cc][Rr][Ii][Pp][Tt])\\b(?:(?![^>]*\\b[Tt][Yy][Pp][Ee]\\s*=)|(?=[^>]*\\b[Tt][Yy][Pp][Ee]\\s*=\\s*(['"])(?:module|(?:text|application)/(?:java|ecma)script)\\2))(?:"[^"]*"|'[^']*'|[^'">])*>`,end:"</([Ss][Cc][Rr][Ii][Pp][Tt])[ \\t]*>",beginCaptures:{1:{name:"entity.name.tag"}},endCaptures:{1:{name:"entity.name.tag"}},contentName:"source.js.embedded.html",patterns:[{include:"source.js"}]},"raw-text":{begin:`<([Tt][Ee][Xx][Tt][Aa][Rr][Ee][Aa]|[Tt][Ii][Tt][Ll][Ee])\\b(?:"[^"]*"|'[^']*'|[^'">])*>`,end:"</([Tt][Ee][Xx][Tt][Aa][Rr][Ee][Aa]|[Tt][Ii][Tt][Ll][Ee])[ \\t]*>",beginCaptures:{1:{name:"entity.name.tag"}},endCaptures:{1:{name:"entity.name.tag"}},contentName:"string.unquoted.raw-text"},tags:{begin:"<(/?)([a-zA-Z][\\w.-]*)",end:">",beginCaptures:{2:{name:"entity.name.tag"}},patterns:[{include:"#inline-css"},{include:"#inline-javascript"},{include:"#attributes"},{include:"#unquoted-attributes"},{include:"#boolean-attributes"}]},"inline-css":{begin:`[ \\t]+(style)\\s*=\\s*(['"])`,end:"\\2",beginCaptures:{1:{name:"entity.other.attribute-name"},2:{name:"punctuation.definition.string.begin"}},endCaptures:{0:{name:"punctuation.definition.string.end"}},contentName:"source.css.embedded.inline",patterns:[{include:"source.css#comments"},{include:"source.css#strings"},{include:"source.css#declarations"},{include:"source.css#values"}]},"inline-javascript":{begin:`[ \\t]+(on[a-zA-Z][\\w-]*)\\s*=\\s*(['"])`,end:"\\2",beginCaptures:{1:{name:"entity.other.attribute-name"},2:{name:"punctuation.definition.string.begin"}},endCaptures:{0:{name:"punctuation.definition.string.end"}},contentName:"source.js.embedded.inline",patterns:[{include:"source.js"}]},attributes:{begin:`[ \\t]+([a-zA-Z_:][\\w:.-]*)\\s*=\\s*(['"])`,end:"\\2",beginCaptures:{1:{name:"entity.other.attribute-name"},2:{name:"punctuation.definition.string.begin"}},endCaptures:{0:{name:"punctuation.definition.string.end"}},contentName:"string.quoted.attribute-value",patterns:[{include:"#entities"}]},"unquoted-attributes":{match:"[ \\t]+([a-zA-Z_:][\\w:.-]*)\\s*=\\s*([^\\s\"'`=<>]+)",captures:{1:{name:"entity.other.attribute-name"},2:{name:"string.unquoted.attribute-value"}}},"boolean-attributes":{match:"[ \\t]+([a-zA-Z_:][\\w:.-]*)(?=[ \\t]*/?>|[ \\t]+[a-zA-Z_:])",captures:{1:{name:"entity.other.attribute-name"}}},entities:{match:"&(?:#\\d+|#x[0-9a-fA-F]+|[a-zA-Z][\\w]+);",name:"constant.character.entity"}}},http:{scopeName:"source.http",patterns:[{match:"^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS|TRACE|CONNECT)\\s+([^\\s]+)\\s+(HTTP\\/[0-9.]+)",captures:{1:{name:"keyword.control.http"},2:{name:"string.unquoted.http"},3:{name:"keyword.other.http"}}},{match:"^(HTTP\\/[0-9.]+)\\s+([0-9]{3})(?:\\s+(.*))?",captures:{1:{name:"keyword.other.http"},2:{name:"constant.numeric.http"},3:{name:"string.unquoted.http"}}},{match:"^([a-zA-Z0-9_-]+):\\s*(.*)",captures:{1:{name:"support.type.property-name.http"},2:{name:"string.unquoted.http"}}}]},java:{scopeName:"source.java",patterns:[{include:"#comments"},{include:"#strings"},{include:"#annotations"},{include:"#class-declaration"},{include:"#keywords"},{include:"#builtin-types"},{include:"#constants"},{include:"#numbers"},{include:"#operators"},{include:"#function-declaration"}],repository:{comments:{patterns:[{match:"//.*$",name:"comment.line.double-slash"},{begin:"/\\*",end:"\\*/",name:"comment.block"}]},strings:{patterns:[{begin:'"""',end:'"""',name:"string.quoted.triple"},{match:'"(?:\\\\.|[^"\\\\\\r\\n])*"',name:"string.quoted.double"},{match:"'(?:\\\\.|[^'\\\\\\r\\n])'",name:"string.quoted.char"}]},annotations:{match:"@[A-Za-z_][\\w.]*",name:"entity.name.decorator"},"class-declaration":{match:"\\b(class|interface|enum|record)\\s+([A-Za-z_]\\w*)",captures:{1:{name:"storage.type.class"},2:{name:"entity.name.type.class"}}},keywords:{match:"\\b(?:abstract|assert|break|case|catch|continue|default|do|else|extends|final|finally|for|goto|if|implements|import|instanceof|native|new|non-sealed|package|permits|private|protected|public|return|sealed|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|var|volatile|while|yield)\\b",name:"keyword.control"},"builtin-types":{match:"\\b(?:boolean|byte|char|double|float|int|long|short|void|Boolean|Byte|Character|Double|Float|Integer|Long|Short|String|Object|List|Map|Set|ArrayList|HashMap|HashSet|Optional)\\b",name:"support.class.builtin"},constants:{patterns:[{match:"\\b(?:true|false)\\b",name:"constant.language.boolean"},{match:"\\bnull\\b",name:"constant.language"}]},numbers:{match:"(?<![\\w.])(?:0[xX][0-9a-fA-F_]+|0[bB][01_]+|\\d(?:_?\\d)*(?:\\.\\d(?:_?\\d)*)?(?:[eE][+-]?\\d+)?)[lLfFdD]?\\b",name:"constant.numeric"},operators:{match:"(?:->|::|&&|\\|\\||==|!=|<=|>=|<<=?|>>>?=?|[+\\-*/%&|^!~<>=]=?)",name:"keyword.operator"},"function-declaration":{match:"\\b([A-Za-z_]\\w*)(?=\\s*\\()",name:"entity.name.function"}}},javascript:{scopeName:"source.js",patterns:[{include:"#comments"},{include:"#strings"},{include:"#template"},{include:"#regexp"},{include:"#jsx-closing-tag"},{include:"#jsx-tag"},{include:"#class-declaration"},{include:"#function-declaration"},{include:"#variable-declaration"},{include:"#keywords"},{include:"#numbers"},{include:"#constants"},{include:"#decorators"},{include:"#private-fields"},{include:"#properties"},{include:"#functions"},{include:"#built-ins"},{include:"#operators"}],repository:{comments:{patterns:[{match:"//.*$",name:"comment.line"},{begin:"/\\*",end:"\\*/",name:"comment.block"}]},strings:{patterns:[{match:"'(?:\\\\.|[^'\\\\\\r\\n])*'",name:"string.quoted.single"},{match:'"(?:\\\\.|[^"\\\\\\r\\n])*"',name:"string.quoted.double"}]},template:{begin:"`",end:"(?<!\\\\)(?:\\\\\\\\)*`",name:"string.quoted.template",patterns:[{include:"#template-interpolation"}]},"template-interpolation":{begin:"\\$\\{",end:"\\}",patterns:[{include:"#balanced-braces"},{include:"$self"}]},"balanced-braces":{begin:"\\{",end:"\\}",patterns:[{include:"#balanced-braces"},{include:"$self"}]},regexp:{match:"(?<![\\w)$\\]])/(?![/*])(?:\\\\.|\\[(?:\\\\.|[^\\]\\\\])*\\]|[^/\\\\\\r\\n])+/[dgimsuvy]*",name:"string.regexp"},"jsx-closing-tag":{match:"</([A-Za-z][\\w.-]*)\\s*>",captures:{1:{name:"entity.name.tag"}}},"jsx-tag":{begin:"<([A-Za-z][\\w.-]*)",end:"/?>",beginCaptures:{1:{name:"entity.name.tag"}},patterns:[{include:"#jsx-expression"},{include:"#strings"},{include:"#jsx-boolean-attributes"},{include:"#jsx-attributes"}]},"jsx-expression":{begin:"\\{",end:"\\}",patterns:[{include:"#balanced-braces"},{include:"$self"}]},"jsx-attributes":{match:"\\b([a-zA-Z_:][\\w:.-]*)(?=\\s*(?:=|/?>))",captures:{1:{name:"entity.other.attribute-name"}}},"jsx-boolean-attributes":{match:"\\b([a-zA-Z_:][\\w:.-]*)(?=\\s+(?:[a-zA-Z_:][\\w:.-]*\\s*=|/?>))",captures:{1:{name:"entity.other.attribute-name"}}},"class-declaration":{match:"\\b(class)\\s+([A-Za-z_$][\\w$]*)",captures:{1:{name:"storage.type.class"},2:{name:"entity.name.type.class"}}},"function-declaration":{match:"\\b(?:(async)\\s+)?(function)\\s*(\\*)?\\s*([A-Za-z_$][\\w$]*)?",captures:{1:{name:"storage.modifier.async"},2:{name:"storage.type.function"},4:{name:"entity.name.function"}}},"variable-declaration":{match:"\\b(const|let|var)\\s+([A-Za-z_$][\\w$]*)",captures:{1:{name:"storage.type.variable"},2:{name:"variable.other.readwrite"}}},keywords:{match:"\\b(?:as|assert|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\\b",name:"keyword.control"},numbers:{match:"(?<![\\w$])(?:0[xX][0-9a-fA-F](?:_?[0-9a-fA-F])*n?|0[bB][01](?:_?[01])*n?|0[oO][0-7](?:_?[0-7])*n?|\\d(?:_?\\d)*n|(?:\\d(?:_?\\d)*(?:\\.\\d(?:_?\\d)*)?|\\.\\d(?:_?\\d)*)(?:[eE][+-]?\\d(?:_?\\d)*)?)(?![\\w$])",name:"constant.numeric"},constants:{patterns:[{match:"\\b(?:false|true)\\b",name:"constant.language.boolean"},{match:"\\b(?:Infinity|NaN|null|undefined)\\b",name:"constant.language"}]},decorators:{match:"@[A-Za-z_$][\\w$]*",name:"entity.name.decorator"},"private-fields":{match:"#[A-Za-z_$][\\w$]*",name:"variable.other.private"},properties:{match:"(?<=\\.)[A-Za-z_$][\\w$]*|[A-Za-z_$][\\w$]*(?=\\s*:)",name:"entity.name.property"},functions:{match:"\\b[A-Za-z_$][\\w$]*(?=\\s*\\()",name:"entity.name.function"},"built-ins":{match:"\\b(?:Array|BigInt|Boolean|console|customElements|Date|document|Error|JSON|Map|Math|Number|Object|Promise|Reflect|RegExp|Set|String|Symbol|WeakMap|WeakSet|window)\\b",name:"support.class"},operators:{match:"(?:=>|===|!==|==|!=|<=|>=|\\?\\?|\\?\\.|\\+\\+|--|&&|\\|\\||\\*\\*|[+*%&|^!~?:-])",name:"keyword.operator"}}},json:{scopeName:"source.json",patterns:[{match:'"(?:\\\\.|[^"\\\\])*"(?=\\s*:)',name:"entity.name.key"},{match:'"(?:\\\\.|[^"\\\\])*"(?=\\s*[,}\\]])',name:"string.quoted.double"},{match:"\\b(?:true|false)\\b",name:"constant.language.boolean"},{match:"\\bnull\\b",name:"constant.language"},{match:"(?<![\\w.])-?(?:0|[1-9]\\d*)(?:\\.\\d+)?(?:[eE][+-]?\\d+)?\\b",name:"constant.numeric"}]},kotlin:{scopeName:"source.kotlin",patterns:[{include:"#comments"},{include:"#strings"},{include:"#annotations"},{include:"#class-declaration"},{include:"#function-declaration"},{include:"#keywords"},{include:"#builtin-types"},{include:"#constants"},{include:"#numbers"},{include:"#operators"}],repository:{comments:{patterns:[{match:"//.*$",name:"comment.line.double-slash"},{begin:"/\\*",end:"\\*/",name:"comment.block"}]},strings:{patterns:[{begin:'"""',end:'"""',name:"string.quoted.triple"},{match:'"(?:\\\\.|[^"\\\\\\r\\n])*"',name:"string.quoted.double"},{match:"'(?:\\\\.|[^'\\\\\\r\\n])'",name:"string.quoted.char"}]},annotations:{match:"@[A-Za-z_][\\w.]*",name:"entity.name.decorator"},"class-declaration":{match:"\\b(?:(data|sealed|abstract|open|inner|enum|annotation)\\s+)?(class|interface|object)\\s+([A-Za-z_]\\w*)",captures:{1:{name:"storage.modifier"},2:{name:"storage.type.class"},3:{name:"entity.name.type.class"}}},"function-declaration":{match:"\\b(fun)\\s+([A-Za-z_]\\w*)",captures:{1:{name:"storage.type.function"},2:{name:"entity.name.function"}}},keywords:{match:"\\b(?:abstract|actual|annotation|as|break|by|catch|companion|const|constructor|continue|crossinline|data|delegate|do|dynamic|else|enum|expect|external|final|finally|for|get|if|import|in|infix|init|inline|inner|internal|is|lateinit|noinline|open|operator|out|override|package|private|protected|public|reified|return|sealed|set|super|suspend|tailrec|this|throw|try|typealias|val|var|vararg|when|where|while)\\b",name:"keyword.control"},"builtin-types":{match:"\\b(?:Any|Array|Boolean|Byte|Char|Double|Float|Int|List|Long|Map|MutableList|MutableMap|MutableSet|Nothing|Set|Short|String|Unit)\\b",name:"support.class.builtin"},constants:{patterns:[{match:"\\b(?:true|false)\\b",name:"constant.language.boolean"},{match:"\\bnull\\b",name:"constant.language"}]},numbers:{match:"(?<![\\w.])(?:0[xX][0-9a-fA-F_]+|0[bB][01_]+|\\d(?:_?\\d)*(?:\\.\\d(?:_?\\d)*)?(?:[eE][+-]?\\d+)?)[fFLuU]*\\b",name:"constant.numeric"},operators:{match:"(?:->|\\?:|\\?\\.|!!|\\.\\.|::|&&|\\|\\||==|!=|<=|>=|[+\\-*/%!<>=]=?)",name:"keyword.operator"}}},markdown:{scopeName:"text.html.markdown",dependencies:["yaml"],patterns:[{include:"#front-matter"},{include:"#comments"},{include:"#fenced-code"},{include:"#headings"},{include:"#quotes"},{include:"#lists"},{include:"#links"},{include:"#inline-code"}],repository:{"front-matter":{begin:"^[ \\t]*---[ \\t]*$",end:"^[ \\t]*(?:---|\\.\\.\\.)[ \\t]*$",patterns:[{include:"source.yaml"}]},comments:{begin:"<!--",end:"-->",name:"comment.block.html"},"fenced-code":{begin:"^[ \\t]*(```+|~~~+).*$",end:"^[ \\t]*\\1[ \\t]*$",name:"string.unquoted.fenced-code"},headings:{match:"^[ \\t]{0,3}#{1,6}[ \\t]+(.+)$",captures:{1:{name:"entity.name.section"}}},quotes:{match:"^[ \\t]*>.*$",name:"comment.blockquote"},lists:{match:"^[ \\t]*(?:[-+*]|\\d+[.)])(?=[ \\t]+)",name:"keyword.control.list"},links:{match:`!?\\[([^\\]]+)\\](\\([^\\s)]+(?:\\s+['"][^'"]*['"])?\\))`,captures:{1:{name:"entity.name.link"},2:{name:"string.other.link"}}},"inline-code":{match:"(`+)(.+?)\\1",captures:{2:{name:"string.other.raw"}}}}},"objective-c":{scopeName:"source.objc",dependencies:["c"],patterns:[{include:"source.c#comments"},{include:"source.c#preprocessor"},{include:"#interface-declaration"},{include:"#directives"},{include:"#nsstring"},{include:"source.c#strings"},{include:"#method-declaration"},{include:"#language-variables"},{include:"source.c#storage-types"},{include:"source.c#keywords"},{include:"#property-attributes"},{include:"#builtin-types"},{include:"source.c#builtin-types"},{include:"#constants"},{include:"source.c#constants"},{include:"source.c#numbers"},{include:"source.c#operators"},{include:"source.c#function-declaration"}],repository:{"interface-declaration":{match:"\\b(@interface|@implementation|@protocol)\\s+([A-Za-z_]\\w*)",captures:{1:{name:"storage.type.class"},2:{name:"entity.name.type.class"}}},directives:{match:"@(?:end|property|synthesize|dynamic|optional|required|class|import|selector|encode|synchronized|autoreleasepool|try|catch|finally|throw)\\b",name:"keyword.control.directive.objc"},nsstring:{match:'@"(?:\\\\.|[^"\\\\])*"',name:"string.quoted.double"},"method-declaration":{match:"^\\s*[-+]\\s*\\([^)]*\\)\\s*([A-Za-z_]\\w*)",captures:{1:{name:"entity.name.function"}}},"language-variables":{match:"\\b(?:self|super)\\b",name:"variable.language.objc"},"property-attributes":{match:"\\b(?:nonatomic|atomic|strong|weak|copy|assign|retain|readonly|readwrite|unsafe_unretained|nullable|nonnull|null_resettable)\\b",name:"storage.modifier"},"builtin-types":{match:"\\b(?:id|instancetype|BOOL|SEL|Class|IMP|NSInteger|NSUInteger|CGFloat|NSString|NSMutableString|NSArray|NSMutableArray|NSDictionary|NSMutableDictionary|NSNumber|NSObject|NSError|NSData|NSURL|NSNotification)\\b",name:"support.class.builtin"},constants:{patterns:[{match:"\\b(?:YES|NO)\\b",name:"constant.language.boolean"},{match:"\\b(?:nil|Nil)\\b",name:"constant.language"}]}}},perl:{scopeName:"source.perl",patterns:[{include:"#comments"},{include:"#pod"},{include:"#strings"},{include:"#variables"},{include:"#function-declaration"},{include:"#keywords"},{include:"#builtins"},{include:"#constants"},{include:"#numbers"},{include:"#operators"}],repository:{comments:{match:"#.*$",name:"comment.line.number-sign"},pod:{begin:"^=\\w+",end:"^=cut\\b",name:"comment.block.documentation"},strings:{patterns:[{match:"qw\\s*\\(([^)]*)\\)",name:"string.quoted.other.qw"},{match:"'(?:\\\\.|[^'\\\\])*'",name:"string.quoted.single"},{match:'"(?:\\\\.|[^"\\\\])*"',name:"string.quoted.double"},{match:"`(?:\\\\.|[^`\\\\])*`",name:"string.interpolated.backtick"}]},variables:{match:"[$@%&][A-Za-z_]\\w*(?:::\\w+)*|\\$\\{[^}]+\\}|\\$[0-9]+|\\$[!@_/\\\\,.;]",name:"entity.name.variable"},"function-declaration":{match:"\\b(sub)\\s+([A-Za-z_]\\w*)",captures:{1:{name:"storage.type.function"},2:{name:"entity.name.function"}}},keywords:{match:"\\b(?:my|our|local|sub|if|elsif|else|unless|while|until|for|foreach|do|return|last|next|redo|use|no|package|require|and|or|not|xor|eq|ne|lt|gt|le|ge|cmp|given|when|default)\\b",name:"keyword.control"},builtins:{match:"\\b(?:print|printf|sprintf|push|pop|shift|unshift|splice|join|split|map|grep|sort|keys|values|each|defined|exists|delete|ref|bless|die|warn|chomp|chop|length|substr|index|lc|uc|lcfirst|ucfirst|wantarray|scalar)\\b",name:"support.class.builtin"},constants:{match:"\\bundef\\b",name:"constant.language"},numbers:{match:"(?<![\\w.])(?:0[xX][0-9a-fA-F_]+|0[bB][01_]+|\\d(?:_?\\d)*(?:\\.\\d(?:_?\\d)*)?(?:[eE][+-]?\\d+)?)\\b",name:"constant.numeric"},operators:{match:"(?:=>|->|::|\\.\\.\\.?|<=>|==|!=|<=|>=|&&|\\|\\||//|=~|!~|\\*\\*|[+\\-*/%.!<>=]=?)",name:"keyword.operator"}}},php:{scopeName:"source.php",patterns:[{match:"<\\?php\\b|<\\?=|\\?>",name:"punctuation.section.embedded"},{include:"#comments"},{include:"#attributes"},{include:"#strings"},{include:"#variables"},{include:"#class-declaration"},{include:"#function-declaration"},{include:"#keywords"},{include:"#constants"},{include:"#numbers"},{include:"#operators"},{include:"#function-call"}],repository:{comments:{patterns:[{match:"//.*$",name:"comment.line.double-slash"},{match:"#(?!\\[).*$",name:"comment.line.number-sign"},{begin:"/\\*",end:"\\*/",name:"comment.block"}]},attributes:{match:"#\\[[^\\]]*\\]",name:"entity.name.decorator"},strings:{patterns:[{match:"'(?:\\\\.|[^'\\\\])*'",name:"string.quoted.single"},{match:'"(?:\\\\.|[^"\\\\])*"',name:"string.quoted.double"}]},variables:{match:"\\$[A-Za-z_]\\w*",name:"entity.name.variable"},"class-declaration":{match:"\\b(class|interface|trait|enum)\\s+([A-Za-z_]\\w*)",captures:{1:{name:"storage.type.class"},2:{name:"entity.name.type.class"}}},"function-declaration":{match:"\\b(function)\\s+&?([A-Za-z_]\\w*)",captures:{1:{name:"storage.type.function"},2:{name:"entity.name.function"}}},keywords:{match:"\\b(?:abstract|and|array|as|break|callable|case|catch|clone|const|continue|declare|default|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|final|finally|fn|for|foreach|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|match|namespace|new|or|print|private|protected|public|readonly|require|require_once|return|static|switch|throw|trait|try|unset|use|var|while|xor|yield)\\b",name:"keyword.control"},constants:{patterns:[{match:"\\b(?:true|false|TRUE|FALSE)\\b",name:"constant.language.boolean"},{match:"\\b(?:null|NULL)\\b",name:"constant.language"}]},numbers:{match:"(?<![\\w.])(?:0[xX][0-9a-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|\\d(?:_?\\d)*(?:\\.\\d(?:_?\\d)*)?(?:[eE][+-]?\\d+)?)\\b",name:"constant.numeric"},operators:{match:"(?:->|=>|::|\\?\\?=?|<=>|===|!==|==|!=|<=|>=|\\.=|&&|\\|\\||[+\\-*/%.!<>=]=?)",name:"keyword.operator"},"function-call":{match:"\\b[A-Za-z_]\\w*(?=\\s*\\()",name:"entity.name.function"}}},powershell:{scopeName:"source.powershell",patterns:[{include:"#comments"},{include:"#strings"},{include:"#constants"},{include:"#variables"},{include:"#function-declaration"},{include:"#operators"},{include:"#keywords"},{include:"#parameters"},{include:"#cmdlets"},{include:"#numbers"}],repository:{comments:{patterns:[{begin:"<#",end:"#>",name:"comment.block"},{match:"#.*$",name:"comment.line.number-sign"}]},strings:{patterns:[{match:"'(?:''|[^'])*'",name:"string.quoted.single"},{match:'"(?:`.|[^"])*"',name:"string.quoted.double"}]},variables:{match:"\\$(?:\\{[^}]+\\}|[A-Za-z_][\\w:]*)",name:"entity.name.variable"},"function-declaration":{match:"\\b(function|filter)\\s+([A-Za-z_][\\w-]*)",captures:{1:{name:"storage.type.function"},2:{name:"entity.name.function"}}},operators:{match:"-(?:eq|ne|gt|lt|ge|le|like|notlike|match|notmatch|contains|notcontains|in|notin|and|or|not|xor|replace|split|join|is|isnot|as)\\b",name:"keyword.operator"},keywords:{match:"\\b(?:begin|break|catch|class|continue|do|dynamicparam|else|elseif|end|exit|finally|for|foreach|if|in|param|process|return|switch|throw|trap|try|until|while)\\b",name:"keyword.control"},constants:{patterns:[{match:"\\$(?:true|false)\\b",name:"constant.language.boolean"},{match:"\\$(?:null)\\b",name:"constant.language"}]},parameters:{match:"(?<![\\w-])-[A-Za-z][\\w]*",name:"constant.language.option"},cmdlets:{match:"\\b[A-Z][a-zA-Z]*-[A-Za-z]+\\b",name:"entity.name.function"},numbers:{match:"(?<![\\w.])-?\\d+(?:\\.\\d+)?(?:[kKmMgGtTpP][bB])?\\b",name:"constant.numeric"}}},python:{scopeName:"source.python",patterns:[{include:"#comments"},{include:"#strings"},{include:"#decorators"},{include:"#class-declaration"},{include:"#function-declaration"},{include:"#keywords"},{include:"#constants"},{include:"#builtins"},{include:"#numbers"},{include:"#operators"}],repository:{comments:{match:"#.*$",name:"comment.line.number-sign"},strings:{patterns:[{begin:'[rRbBfFuU]{0,2}"""',end:'"""',name:"string.quoted.triple.double"},{begin:"[rRbBfFuU]{0,2}'''",end:"'''",name:"string.quoted.triple.single"},{match:'[rRbBfFuU]{0,2}"(?:\\\\.|[^"\\\\\\r\\n])*"',name:"string.quoted.double"},{match:"[rRbBfFuU]{0,2}'(?:\\\\.|[^'\\\\\\r\\n])*'",name:"string.quoted.single"}]},decorators:{match:"@[A-Za-z_][\\w.]*",name:"entity.name.decorator"},"class-declaration":{match:"\\b(class)\\s+([A-Za-z_]\\w*)",captures:{1:{name:"storage.type.class"},2:{name:"entity.name.type.class"}}},"function-declaration":{match:"\\b(def)\\s+([A-Za-z_]\\w*)",captures:{1:{name:"storage.type.function"},2:{name:"entity.name.function"}}},keywords:{match:"\\b(?:and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|raise|return|try|while|with|yield)\\b",name:"keyword.control"},constants:{patterns:[{match:"\\b(?:True|False)\\b",name:"constant.language.boolean"},{match:"\\b(?:None|Ellipsis|NotImplemented|__debug__)\\b",name:"constant.language"},{match:"\\b(?:self|cls)\\b",name:"variable.language.python"}]},builtins:{match:"\\b(?:abs|all|any|bool|bytearray|bytes|callable|chr|classmethod|dict|dir|divmod|enumerate|filter|float|format|frozenset|getattr|hasattr|hash|hex|id|input|int|isinstance|issubclass|iter|len|list|map|max|min|next|object|oct|open|ord|pow|print|property|range|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|vars|zip)\\b(?=\\s*\\()",name:"support.class.builtin"},numbers:{match:"(?<![\\w.])(?:0[xX][0-9a-fA-F_]+|0[oO][0-7_]+|0[bB][01_]+|(?:\\d(?:_?\\d)*)?\\.?\\d(?:_?\\d)*(?:[eE][+-]?\\d+)?[jJ]?)\\b",name:"constant.numeric"},operators:{match:"(?::=|\\*\\*|//|<=|>=|==|!=|->|[+\\-*/%@&|^~<>=])",name:"keyword.operator"}}},r:{scopeName:"source.r",patterns:[{include:"#comments"},{include:"#strings"},{include:"#function-declaration"},{include:"#keywords"},{include:"#builtins"},{include:"#constants"},{include:"#numbers"},{include:"#operators"}],repository:{comments:{match:"#.*$",name:"comment.line.number-sign"},strings:{patterns:[{match:"'(?:\\\\.|[^'\\\\])*'",name:"string.quoted.single"},{match:'"(?:\\\\.|[^"\\\\])*"',name:"string.quoted.double"}]},"function-declaration":{match:"\\b([A-Za-z_.][\\w.]*)\\s*(?=<-\\s*function\\b|=\\s*function\\b)",name:"entity.name.function"},keywords:{match:"\\b(?:if|else|repeat|while|function|for|next|break|in)\\b",name:"keyword.control"},builtins:{match:"\\b(?:c|list|vector|matrix|data\\.frame|print|cat|paste|paste0|sprintf|nrow|ncol|length|names|colnames|rownames|sapply|lapply|vapply|mapply|apply|Map|Filter|Reduce|library|require|source|setwd|getwd|summary|str|head|tail|is\\.na|is\\.null|as\\.character|as\\.numeric|as\\.integer|as\\.factor|as\\.data\\.frame)\\b",name:"support.class.builtin"},constants:{patterns:[{match:"\\b(?:TRUE|FALSE|T|F)\\b",name:"constant.language.boolean"},{match:"\\b(?:NULL|NA|NA_integer_|NA_real_|NA_character_|NA_complex_|Inf|NaN)\\b",name:"constant.language"}]},numbers:{match:"(?<![\\w.])(?:0[xX][0-9a-fA-F]+|(?:\\d+\\.\\d*|\\.\\d+|\\d+)(?:[eE][+-]?\\d+)?[Li]?)\\b",name:"constant.numeric"},operators:{match:"(?:%[^%\\s]*%|<<-|<-|->>|->|==|!=|<=|>=|&&|\\|\\||[-+*/^!<>=&|~?:])",name:"keyword.operator"}}},ruby:{scopeName:"source.ruby",patterns:[{match:"#(?!\\{).*$",name:"comment.line.number-sign"},{begin:`<<[-~]?(['"]?)([A-Z][A-Z0-9_]*)\\1`,end:"^\\2$",name:"string.unquoted.heredoc"},{match:"'(?:\\\\.|[^'\\\\])*'",name:"string.quoted.single"},{match:'"(?:\\\\.|[^"\\\\])*"',name:"string.quoted.double"},{match:"(?:@@|@|\\$)[a-zA-Z_][\\w]*",name:"entity.name.variable"},{match:":[a-zA-Z_][\\w]*[!?=]?",name:"constant.other.symbol"},{match:"\\b(def)\\s+([a-zA-Z_][\\w]*[!?=]?)",captures:{1:{name:"storage.type.method"},2:{name:"entity.name.function"}}},{match:"\\b(class|module)\\s+([A-Z][\\w]*(?:::[A-Z][\\w]*)*)",captures:{1:{name:"storage.type.class"},2:{name:"entity.name.type.class"}}},{match:"\\b(?:false|true)\\b",name:"constant.language.boolean"},{match:"\\bnil\\b",name:"constant.language"},{match:"\\b(?:BEGIN|END|alias|and|begin|break|case|catch|defined|do|else|elsif|ensure|for|if|in|next|not|or|redo|rescue|retry|return|self|super|then|throw|undef|unless|until|when|while|yield)\\b",name:"keyword.control"},{match:"\\b[A-Z][\\w]*(?:::[A-Z][\\w]*)*\\b",name:"entity.name.type.constant"},{match:"(?<![\\w.])-?(?:0[xX][0-9a-fA-F]+|0[bB][01]+|\\d+(?:_\\d+)*(?:\\.\\d+)?)\\b",name:"constant.numeric"}]},rust:{scopeName:"source.rust",patterns:[{include:"#comments"},{include:"#strings"},{include:"#attributes"},{include:"#function-declaration"},{include:"#type-declaration"},{include:"#macros"},{include:"#keywords"},{include:"#constants"},{include:"#builtin-types"},{include:"#lifetimes"},{include:"#numbers"},{include:"#operators"}],repository:{comments:{patterns:[{match:"//.*$",name:"comment.line.double-slash"},{begin:"/\\*",end:"\\*/",name:"comment.block"}]},strings:{patterns:[{begin:'b?r#"',end:'"#',name:"string.quoted.raw"},{match:'b?r"[^"]*"',name:"string.quoted.raw"},{match:'b?"(?:\\\\.|[^"\\\\])*"',name:"string.quoted.double"},{match:"'(?:\\\\.|[^'\\\\])'",name:"string.quoted.char"}]},attributes:{match:"#!?\\[[^\\]]*\\]",name:"entity.name.decorator"},"function-declaration":{match:"\\b(fn)\\s+([A-Za-z_]\\w*)",captures:{1:{name:"storage.type.function"},2:{name:"entity.name.function"}}},"type-declaration":{match:"\\b(struct|enum|trait|union|type)\\s+([A-Za-z_]\\w*)",captures:{1:{name:"storage.type"},2:{name:"entity.name.type.class"}}},macros:{match:"\\b[A-Za-z_]\\w*!(?=\\s*[\\(\\[{])",name:"entity.name.function.macro"},keywords:{match:"\\b(?:as|async|await|break|const|continue|crate|dyn|else|enum|extern|fn|for|if|impl|in|let|loop|match|mod|move|mut|pub|ref|return|self|Self|static|struct|super|trait|type|union|unsafe|use|where|while)\\b",name:"keyword.control"},constants:{patterns:[{match:"\\b(?:true|false)\\b",name:"constant.language.boolean"},{match:"\\b(?:None|Some|Ok|Err)\\b",name:"constant.language"}]},"builtin-types":{match:"\\b(?:bool|char|str|String|i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|Vec|Option|Result|Box|Rc|Arc|RefCell|HashMap|HashSet)\\b",name:"support.class.builtin"},lifetimes:{match:"'[a-z_]\\w*\\b",name:"variable.language.lifetime"},numbers:{match:"(?<![\\w.])(?:0[xX][0-9a-fA-F_]+|0[oO][0-7_]+|0[bB][01_]+|\\d(?:_?\\d)*(?:\\.\\d(?:_?\\d)*)?(?:[eE][+-]?\\d+)?)(?:[iuf](?:8|16|32|64|128|size))?\\b",name:"constant.numeric"},operators:{match:"(?:->|=>|::|\\.\\.=?|&&|\\|\\||==|!=|<=|>=|<<|>>|[+\\-*/%&|^!<>=]=?)",name:"keyword.operator"}}},svelte:{scopeName:"source.svelte",dependencies:["html","css","scss","javascript","typescript"],patterns:[{include:"#comments"},{include:"#typescript"},{include:"#javascript"},{include:"#scss"},{include:"#css"},{include:"#blocks"},{include:"#interpolation"},{include:"#tags"},{include:"text.html.basic"}],repository:{comments:{begin:"<!--",end:"-->",name:"comment.block"},typescript:{begin:`<(script)\\b(?=[^>]*\\blang\\s*=\\s*(['"])(?:ts|typescript)\\2)[^>]*>`,end:"</(script)\\s*>",beginCaptures:{1:{name:"entity.name.tag"}},endCaptures:{1:{name:"entity.name.tag"}},contentName:"source.ts.embedded.svelte",patterns:[{include:"source.ts"}]},javascript:{begin:"<(script)\\b[^>]*>",end:"</(script)\\s*>",beginCaptures:{1:{name:"entity.name.tag"}},endCaptures:{1:{name:"entity.name.tag"}},contentName:"source.js.embedded.svelte",patterns:[{include:"source.js"}]},scss:{begin:`<(style)\\b(?=[^>]*\\blang\\s*=\\s*(['"])scss\\2)[^>]*>`,end:"</(style)\\s*>",beginCaptures:{1:{name:"entity.name.tag"}},endCaptures:{1:{name:"entity.name.tag"}},contentName:"source.css.scss.embedded.svelte",patterns:[{include:"source.scss"}]},css:{begin:"<(style)\\b[^>]*>",end:"</(style)\\s*>",beginCaptures:{1:{name:"entity.name.tag"}},endCaptures:{1:{name:"entity.name.tag"}},contentName:"source.css.embedded.svelte",patterns:[{include:"source.css"}]},blocks:{match:"\\{([#/:@])\\s*(if|else|each|key|await|then|catch|snippet|render|html|debug|const)\\b",captures:{1:{name:"punctuation.definition.keyword"},2:{name:"keyword.control"}}},interpolation:{begin:"\\{(?![#/:@])",end:"\\}",beginCaptures:{0:{name:"punctuation.section.embedded.begin"}},endCaptures:{0:{name:"punctuation.section.embedded.end"}},contentName:"source.js.embedded.svelte",patterns:[{include:"source.js"}]},tags:{begin:"<(/?)([a-zA-Z][\\w.:-]*)",end:">",beginCaptures:{2:{name:"entity.name.tag"}},patterns:[{include:"#directive"},{include:"#shorthand"},{include:"text.html.basic#inline-css"},{include:"text.html.basic#attributes"},{include:"text.html.basic#unquoted-attributes"},{include:"text.html.basic#boolean-attributes"}]},directive:{match:"[ \\t]+((?:bind|on|class|use|transition|in|out|animate|let):[\\w-]+(?:\\|[\\w-]+)*)",captures:{1:{name:"entity.other.attribute-name"}}},shorthand:{begin:"[ \\t]+\\{",end:"\\}",contentName:"source.js.embedded.svelte",patterns:[{include:"source.js"}]}}},toml:{scopeName:"source.toml",patterns:[{include:"#comments"},{include:"#table-headers"},{include:"#datetime"},{include:"#strings"},{include:"#keys"},{include:"#constants"},{include:"#numbers"},{include:"#operators"}],repository:{comments:{match:"#.*$",name:"comment.line.number-sign"},"table-headers":{match:"^\\s*(\\[\\[?)([^\\[\\]]+)(\\]\\]?)\\s*$",captures:{1:{name:"punctuation.definition.table"},2:{name:"entity.name.type.class"},3:{name:"punctuation.definition.table"}}},strings:{patterns:[{begin:'"""',end:'"""',name:"string.quoted.triple.double"},{begin:"'''",end:"'''",name:"string.quoted.triple.single"},{match:'"(?:\\\\.|[^"\\\\\\r\\n])*"',name:"string.quoted.double"},{match:"'[^'\\r\\n]*'",name:"string.quoted.single"}]},keys:{match:`^\\s*((?:[A-Za-z0-9_-]+|"(?:\\\\.|[^"\\\\])*"|'[^']*')(?:\\s*\\.\\s*(?:[A-Za-z0-9_-]+|"(?:\\\\.|[^"\\\\])*"|'[^']*'))*)\\s*(?==)`,captures:{1:{name:"entity.name.key"}}},constants:{patterns:[{match:"\\b(?:true|false)\\b",name:"constant.language.boolean"},{match:"\\b(?:inf|nan)\\b",name:"constant.language"}]},datetime:{match:"\\b\\d{4}-\\d{2}-\\d{2}(?:[Tt ]\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?(?:[Zz]|[+-]\\d{2}:\\d{2})?)?\\b",name:"constant.other.date-time"},numbers:{match:"(?<![\\w.])[+-]?(?:0[xX][0-9a-fA-F_]+|0[oO][0-7_]+|0[bB][01_]+|\\d(?:_?\\d)*(?:\\.\\d(?:_?\\d)*)?(?:[eE][+-]?\\d+)?)\\b",name:"constant.numeric"},operators:{match:"=",name:"keyword.operator"}}},tsx:{scopeName:"source.tsx",dependencies:["javascript","typescript"],patterns:[{include:"source.js#comments"},{include:"source.js#strings"},{include:"source.js#template"},{include:"source.js#regexp"},{include:"source.js#jsx-closing-tag"},{include:"source.js#jsx-tag"},{include:"source.ts#type-declaration"},{include:"source.js#class-declaration"},{include:"source.js#function-declaration"},{include:"source.js#variable-declaration"},{include:"source.ts#type-keywords"},{include:"source.js#keywords"},{include:"source.js#numbers"},{include:"source.js#constants"},{include:"source.ts#builtin-types"},{include:"source.js#decorators"},{include:"source.js#private-fields"},{include:"source.js#properties"},{include:"source.js#functions"},{include:"source.js#built-ins"},{include:"source.js#operators"}]},typescript:{scopeName:"source.ts",dependencies:["javascript"],patterns:[{include:"source.js#comments"},{include:"source.js#strings"},{include:"source.js#template"},{include:"source.js#regexp"},{include:"#type-declaration"},{include:"source.js#class-declaration"},{include:"source.js#function-declaration"},{include:"source.js#variable-declaration"},{include:"#type-keywords"},{include:"source.js#keywords"},{include:"source.js#numbers"},{include:"source.js#constants"},{include:"#builtin-types"},{include:"source.js#decorators"},{include:"source.js#private-fields"},{include:"source.js#properties"},{include:"source.js#functions"},{include:"source.js#built-ins"},{include:"source.js#operators"}],repository:{"type-declaration":{match:"\\b(interface|enum|namespace|module|type)\\s+([A-Za-z_$][\\w$]*)",captures:{1:{name:"storage.type"},2:{name:"entity.name.type.class"}}},"type-keywords":{match:"\\b(?:abstract|accessor|asserts|declare|infer|keyof|override|readonly|satisfies|unique)\\b",name:"keyword.control.ts"},"builtin-types":{match:"\\b(?:any|bigint|boolean|never|number|object|string|symbol|undefined|unknown|void)\\b",name:"support.class.builtin"}}},vue:{scopeName:"text.html.vue",dependencies:["html","css","scss","javascript","typescript"],patterns:[{include:"#comments"},{include:"#typescript"},{include:"#javascript"},{include:"#scss"},{include:"#css"},{include:"#interpolation"},{include:"#tags"},{include:"text.html.basic"}],repository:{comments:{begin:"<!--",end:"-->",name:"comment.block"},typescript:{begin:`<(script)\\b(?=[^>]*\\blang\\s*=\\s*(['"])(?:ts|typescript)\\2)[^>]*>`,end:"</(script)\\s*>",beginCaptures:{1:{name:"entity.name.tag"}},endCaptures:{1:{name:"entity.name.tag"}},contentName:"source.ts.embedded.vue",patterns:[{include:"source.ts"}]},javascript:{begin:"<(script)\\b[^>]*>",end:"</(script)\\s*>",beginCaptures:{1:{name:"entity.name.tag"}},endCaptures:{1:{name:"entity.name.tag"}},contentName:"source.js.embedded.vue",patterns:[{include:"source.js"}]},scss:{begin:`<(style)\\b(?=[^>]*\\blang\\s*=\\s*(['"])scss\\2)[^>]*>`,end:"</(style)\\s*>",beginCaptures:{1:{name:"entity.name.tag"}},endCaptures:{1:{name:"entity.name.tag"}},contentName:"source.css.scss.embedded.vue",patterns:[{include:"source.scss"}]},css:{begin:"<(style)\\b[^>]*>",end:"</(style)\\s*>",beginCaptures:{1:{name:"entity.name.tag"}},endCaptures:{1:{name:"entity.name.tag"}},contentName:"source.css.embedded.vue",patterns:[{include:"source.css"}]},interpolation:{begin:"\\{\\{",end:"\\}\\}",beginCaptures:{0:{name:"punctuation.section.embedded.begin"}},endCaptures:{0:{name:"punctuation.section.embedded.end"}},contentName:"source.js.embedded.vue",patterns:[{include:"source.js"}]},tags:{begin:"<(/?)([a-zA-Z][\\w.:-]*)",end:">",beginCaptures:{2:{name:"entity.name.tag"}},patterns:[{include:"#directive-value"},{include:"#directive"},{include:"text.html.basic#inline-css"},{include:"text.html.basic#attributes"},{include:"text.html.basic#unquoted-attributes"},{include:"text.html.basic#boolean-attributes"}]},"directive-value":{begin:`[ \\t]+((?:v-[\\w-]+(?::[\\w-]+)?|[:@#][\\w-]+)(?:\\.[\\w-]+)*)\\s*=\\s*(['"])`,end:"\\2",beginCaptures:{1:{name:"entity.other.attribute-name"},2:{name:"punctuation.definition.string.begin"}},endCaptures:{0:{name:"punctuation.definition.string.end"}},contentName:"source.js.embedded.vue",patterns:[{include:"source.js"}]},directive:{match:"[ \\t]+((?:v-[\\w-]+(?::[\\w-]+)?|[:@#][\\w-]+)(?:\\.[\\w-]+)*)",captures:{1:{name:"entity.other.attribute-name"}}}}},yaml:{scopeName:"source.yaml",patterns:[{match:"#.*$",name:"comment.line.number-sign"},{match:"^(?:---|\\.\\.\\.)\\s*$|^%YAML\\b.*$",name:"keyword.control.document"},{match:"^\\s*(?:-\\s+)?([^#\\s][^\\r\\n:#]*?)(?=\\s*:)",captures:{1:{name:"entity.name.key"}}},{match:"[&*][a-zA-Z_][\\w-]*|![^\\s]+",name:"entity.name.anchor"},{match:`(['"])(?:\\\\.|(?!\\1)[^\\\\\\r\\n]|\\r?\\n[ \\t]+)*\\1`,name:"string.quoted"},{match:"(?<=:\\s)[|>][-+]?\\s*$",name:"keyword.control.block-scalar"},{match:"\\b(?:true|false|yes|no|on|off)\\b",name:"constant.language.boolean"},{match:"\\bnull\\b|~",name:"constant.language"},{match:"(?<![\\w.-])-?(?:0|[1-9]\\d*)(?:\\.\\d+)?(?:e[+-]?\\d+)?\\b",name:"constant.numeric"}]}},an=new Map;Object.values(tn).forEach(e=>{e?.scopeName&&an.set(e.scopeName,e)});var gl={"c++":"cpp",cs:"csharp",curl:"bash",js:"javascript",jsx:"javascript",markup:"html",md:"markdown",objc:"objective-c",ps1:"powershell",py:"python",rb:"ruby",sh:"bash",shell:"bash",svg:"html",ts:"typescript",xml:"html",yml:"yaml",zsh:"bash"},bl={indices:[[1/0,1/0]]},Ct=new Map,yl=e=>{let t=e.split("."),[a,r,s]=t,n=t.at(-1);if(a==="markup"&&["quote","inserted","deleted","raw"].includes(r))return r;if(a==="entity"&&r==="name")return s;if(e.startsWith("constant.character.entity"))return"character-entity";if(t.includes("numeric"))return"numeric";if(e.startsWith("support.type.property-name"))return"property";if(t.includes("attribute-value"))return"attribute-value";if(e.startsWith("string.other.link"))return"link";if(["doctype","at-rule","important","regexp","boolean","symbol","operator","attribute-name"].includes(n))return n;if(["comment","string","constant","storage","keyword","variable","punctuation","entity","support"].includes(a))return a},sa=(e,t,a,r)=>{let s=yl(r);if(!s||t===a)return;let n=new Range;n.setStart(e,t),n.setEnd(e,a),Ct.has(s)||Ct.set(s,new Highlight),Ct.get(s).add(n)},cr=(e,t,a={})=>{Object.entries(a).forEach(([r,s])=>{let n=t.indices[+r];n&&sa(e,...n,s.name)})},vl=e=>e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),xl=(e,t)=>e.replace(/\\(\d+)/g,(a,r)=>t[r]===void 0?a:vl(t[r])),rn=e=>e?Array.isArray(e)?e:e.match||e.begin||e.include?[e]:e.patterns||[]:[],wl=(e,t,a)=>{if(e==="$self")return{grammar:t,rules:t.patterns};if(e==="$base")return{grammar:a,rules:a.patterns};if(e[0]==="#")return{grammar:t,rules:rn(t.repository?.[e.slice(1)])};let[r,s]=e.split("#"),n=an.get(r);return n?{grammar:n,rules:s?rn(n.repository?.[s]):n.patterns}:null},sn=(e,t,a,r=new Set)=>{let s=[];return e.forEach(n=>{if(n.include){let i=`${t.scopeName}:${n.include}`;if(r.has(i))return;let o=wl(n.include,t,a);if(!o)return;let l=new Set(r);l.add(i),s.push(...sn(o.rules,o.grammar,a,l));return}(n.match||n.begin&&n.end)&&s.push({grammar:t,rule:n})}),s},dr=new Map,pr=new Map,nn=(e,t,a,r)=>{let s=pr.get(e);if(!s||s.indices[0][0]<a){dr.has(e)||dr.set(e,new RegExp(e,"dgm"));let n=dr.get(e);n.lastIndex=a,s=n.exec(t.data)||bl,pr.set(e,s)}return s.indices[0][0]<r&&s.indices[0][1]<=r?s:null},$l=(e,t,a,r)=>{let s=null;return t.forEach(n=>{let i=nn(n.rule.match||n.rule.begin,e,a,r);i&&(!s||i.indices[0][0]<s.match.indices[0][0])&&(s={...n,match:i})}),s},on=(e,t,a,r,s,n=s,i=null)=>{let o=sn(t,s,n),l=a;for(;l<r;){let c=$l(e,o,l,r),p=i?nn(i.pattern,e,l,r):null,u=c?.match.indices[0][0]??1/0,h=p?.indices[0][0]??1/0;if(p&&(h<u||h===u&&!i?.applyEndPatternLast))return{contentEnd:h,end:p.indices[0][1],match:p};if(!c)return{contentEnd:r,end:r,match:null};let{rule:m,match:b,grammar:g}=c;if(m.match){m.name&&sa(e,...b.indices[0],m.name),cr(e,b,m.captures),l=b.indices[0][1]>l?b.indices[0][1]:l+1;continue}let y=on(e,m.patterns||[],b.indices[0][1],r,g,n,{pattern:xl(m.end,b),applyEndPatternLast:m.applyEndPatternLast});m.name&&sa(e,b.indices[0][0],y.end,m.name),m.contentName&&sa(e,b.indices[0][1],y.contentEnd,m.contentName),cr(e,b,m.beginCaptures||m.captures),y.match&&cr(e,y.match,m.endCaptures||m.captures),l=y.end>l?y.end:l+1}return{contentEnd:r,end:r,match:null}},ln=e=>{let t=e.parentElement,a=r=>!r||!r.classList?null:[...r.classList].find(s=>s.startsWith("language-"))?.slice(9);return(a(e)||e.dataset?.language||a(t)||t?.dataset?.language||t?.getAttribute?.("lang")||"").toLowerCase()},kl=e=>gl[e]||e,Sl=(e=document)=>{let t=[],a=new Set,r=s=>{if(s&&!a.has(s)&&(a.add(s),s.querySelectorAll)){let n=s.querySelectorAll("pre > code");t.push(...n);let i=s.querySelectorAll("*");for(let o=0;o<i.length;o++){let l=i[o];l.shadowRoot&&r(l.shadowRoot)}}};return r(e),t},ur=!1,El=(e=document)=>{if(typeof window>"u"||typeof CSS>"u"||!CSS.highlights)return;let t=Sl(e).filter(ln);t.length!==0&&(Ct.forEach((a,r)=>{CSS.highlights.get(r)===a&&CSS.highlights.delete(r),a.clear()}),t.forEach(a=>{let r=tn[kl(ln(a))];if(!r)return;Array.from(a.childNodes).forEach(n=>{n.nodeType===Node.COMMENT_NODE&&a.removeChild(n)}),a.normalize();let s=a.firstChild;s&&s.nodeType===Node.TEXT_NODE&&(pr=new Map,on(s,r.patterns,0,s.data.length,r))}),Ct.forEach((a,r)=>{a.size&&CSS.highlights.set(r,a)}))},na=(e=document)=>{ur||(ur=!0,requestAnimationFrame(()=>{ur=!1,El(e)}))},je=M`
  .hover-bg:hover {
    background: var(--bg3);
  }
  ::selection {
    background: var(--selection-bg);
    color: var(--selection-fg);
  }
  .regular-font {
    font-family: var(--font-regular);
  }
  .mono-font {
    font-family: var(--font-mono);
  }
  .title {
    font-size: calc(var(--font-size-small) + 18px);
    font-weight: normal;
    text-wrap: balance;
  }
  .sub-title {
    font-size: 20px;
    text-wrap: balance;
  }
  .req-res-title {
    font-family: var(--font-regular);
    font-size: calc(var(--font-size-small) + 4px);
    font-weight: bold;
    margin-bottom: 8px;
    text-align: left;
    text-wrap: balance;
  }
  .tiny-title {
    font-size: calc(var(--font-size-small) + 1px);
    font-weight: bold;
  }
  .regular-font-size {
    font-size: var(--font-size-regular);
  }
  .small-font-size {
    font-size: var(--font-size-small);
  }
  .upper {
    text-transform: uppercase;
  }
  .primary-text {
    color: var(--primary-color);
  }
  .bold-text {
    font-weight: bold;
  }
  .gray-text {
    color: var(--light-fg);
  }
  .red-text {
    color: var(--red);
  }
  .blue-text {
    color: var(--blue);
  }
  .multiline {
    overflow: scroll;
    max-height: var(--resp-area-height, 400px);
    color: var(--fg3);
  }
  .method-fg.put {
    color: var(--orange);
  }
  .method-fg.post {
    color: var(--green);
  }
  .method-fg.get {
    color: var(--blue);
  }
  .method-fg.delete {
    color: var(--red);
  }
  .method-fg.options,
  .method-fg.head,
  .method-fg.patch {
    color: var(--yellow);
  }

  h1 {
    font-family: var(--font-regular);
    font-size: 28px;
    padding-top: 10px;
    letter-spacing: normal;
    font-weight: normal;
  }
  h2 {
    font-family: var(--font-regular);
    font-size: 24px;
    padding-top: 10px;
    letter-spacing: normal;
    font-weight: normal;
  }
  h3 {
    font-family: var(--font-regular);
    font-size: 18px;
    padding-top: 10px;
    letter-spacing: normal;
    font-weight: normal;
  }
  h4 {
    font-family: var(--font-regular);
    font-size: 16px;
    padding-top: 10px;
    letter-spacing: normal;
    font-weight: normal;
  }
  h5 {
    font-family: var(--font-regular);
    font-size: 14px;
    padding-top: 10px;
    letter-spacing: normal;
    font-weight: normal;
  }
  h6 {
    font-family: var(--font-regular);
    font-size: 14px;
    padding-top: 10px;
    letter-spacing: normal;
    font-weight: normal;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-block-end: 0.2em;
    text-wrap: balance;
  }
  p {
    margin-block-start: 0.5em;
  }
  a {
    color: var(--blue);
    cursor: pointer;
  }
  a.inactive-link {
    color: var(--fg);
    text-decoration: none;
    cursor: text;
  }

  code,
  pre {
    margin: 0px;
    font-family: var(--font-mono);
    font-size: calc(var(--font-size-mono) - 1px);
  }

  .m-markdown,
  .m-markdown-small {
    display: block;
  }

  .m-markdown p,
  .m-markdown span {
    font-size: var(--font-size-regular);
    line-height: calc(var(--font-size-regular) + 8px);
  }
  .m-markdown li {
    font-size: var(--font-size-regular);
    line-height: calc(var(--font-size-regular) + 10px);
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
    margin-block-end: 0;
  }

  .m-markdown code span {
    font-size: var(--font-size-mono);
  }

  .m-markdown-small code,
  .m-markdown code {
    padding: 1px 6px;
    border-radius: 2px;
    color: var(--inline-code-fg);
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
    background: var(--code-bg);
    color: var(--code-fg);
  }

  .m-markdown-small pre {
    margin-top: 4px;
    padding: 2px 4px;
    background: var(--bg3);
    color: var(--fg2);
  }

  .m-markdown-small pre code,
  .m-markdown pre code {
    border: none;
    padding: 0;
  }

  .m-markdown pre code {
    color: var(--code-fg);
  }

  .m-markdown-small pre code {
    color: var(--fg2);
    background: var(--bg3);
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
    color: var(--blue);
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
    background: var(--bg2);
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
  .m-markdown hr {
    border: 1px solid var(--border-color);
  }
`,Ft=M`
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
    background: transparent;
    user-select: none;
    cursor: pointer;
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.12),
      0 1px 2px rgba(0, 0, 0, 0.24);
    transition-duration: 0.75s;
  }
  .m-btn.primary {
    background: var(--primary-color);
    color: var(--primary-color-invert);
  }
  .m-btn.thin-border {
    border-width: 1px;
  }
  .m-btn.large {
    padding: 8px 14px;
  }
  .m-btn.small {
    padding: 5px 12px;
  }
  .m-btn.tiny {
    padding: 5px 6px;
  }
  .m-btn.circle {
    border-radius: 50%;
  }
  .m-btn:hover {
    background: var(--primary-color);
    color: var(--primary-color-invert);
  }
  .m-btn.nav {
    border: 2px solid var(--nav-accent-color);
  }
  .m-btn.nav:hover {
    background: var(--nav-accent-color);
  }
  .m-btn:disabled {
    background: var(--bg3);
    color: var(--fg3);
    border-color: var(--fg3);
    cursor: not-allowed;
    opacity: 0.4;
  }
  .m-btn:active {
    filter: brightness(75%);
    transform: scale(0.95);
    transition: scale 0s;
  }
  .toolbar-btn {
    cursor: pointer;
    padding: 4px;
    margin: 0 2px;
    font-size: var(--font-size-small);
    min-width: 50px;
    color: var(--primary-color-invert);
    border-radius: 2px;
    border: none;
    background: var(--primary-color);
  }

  input,
  textarea,
  select,
  button,
  pre {
    color: var(--fg);
    outline: none;
    background: var(--input-bg);
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
  input[type='file'],
  input[type='text'],
  input[type='password'] {
    font-family: var(--font-mono);
    font-weight: 400;
    font-size: var(--font-size-small);
    transition: border 0.2s;
    padding: 6px 5px;
  }

  select {
    font-family: var(--font-regular);
    padding: 5px 30px 5px 5px;
    background-image: url('data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%3E%3Cpath%20d%3D%22M10.3%203.3L6%207.6%201.7%203.3A1%201%200%2000.3%204.7l5%205a1%201%200%20001.4%200l5-5a1%201%200%2010-1.4-1.4z%22%20fill%3D%22%23777777%22%2F%3E%3C%2Fsvg%3E');
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
  input[type='text']::placeholder,
  input[type='password']::placeholder {
    color: var(--placeholder-color);
    opacity: 1;
  }

  input[type='file'] {
    font-family: var(--font-regular);
    padding: 2px;
    cursor: pointer;
    border: 1px solid var(--primary-color);
    min-height: calc(var(--font-size-small) + 18px);
  }

  input[type='file']::file-selector-button,
  input[type='file']::-webkit-file-upload-button {
    font-family: var(--font-regular);
    font-size: var(--font-size-small);
    outline: none;
    cursor: pointer;
    padding: 3px 8px;
    border: 1px solid var(--primary-color);
    background: var(--primary-color);
    color: var(--primary-color-invert);
    border-radius: var(--border-radius);
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
    background: var(--input-bg);
  }

  pre::-webkit-scrollbar-thumb,
  textarea::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: var(--border-color);
  }

  .link {
    font-size: var(--font-size-small);
    text-decoration: underline;
    color: var(--blue);
    font-family: var(--font-mono);
    margin-bottom: 2px;
  }

  /* Toggle Body */
  input[type='checkbox'] {
    appearance: none;
    display: inline-block;
    background: var(--light-bg);
    border: 1px solid var(--light-bg);
    border-radius: 9px;
    cursor: pointer;
    height: 18px;
    position: relative;
    transition:
      border 0.25s 0.15s,
      box-shadow 0.25s 0.3s,
      padding 0.25s;
    min-width: 36px;
    width: 36px;
    vertical-align: top;
  }
  /* Toggle Thumb */
  input[type='checkbox']:after {
    position: absolute;
    background: var(--bg);
    border: 1px solid var(--light-bg);
    border-radius: 8px;
    content: '';
    top: 0px;
    left: 0px;
    right: 16px;
    display: block;
    height: 16px;
    transition:
      border 0.25s 0.15s,
      left 0.25s 0.1s,
      right 0.15s 0.175s;
  }

  /* Toggle Body - Checked */
  input[type='checkbox']:checked {
    background: var(--green);
    border-color: var(--green);
  }
  /* Toggle Thumb - Checked*/
  input[type='checkbox']:checked:after {
    border: 1px solid var(--green);
    left: 16px;
    right: 1px;
    transition:
      border 0.25s,
      left 0.15s 0.25s,
      right 0.25s 0.175s;
  }
`,ia=M`
  .row,
  .col {
    display: flex;
  }
  .row {
    align-items: center;
    flex-direction: row;
  }
  .col {
    align-items: stretch;
    flex-direction: column;
  }
`,oa=M`
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
    background: var(--bg2);
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
    font-size: var(--font-size-small);
    font-weight: bold;
    vertical-align: middle;
    margin: 12px 0 4px 0;
  }
`,cn=M`
  .only-large-screen {
    display: none;
  }
  .endpoint-head .path {
    display: flex;
    font-family: var(--font-mono);
    font-size: var(--font-size-small);
    align-items: center;
    overflow-wrap: break-word;
    word-break: break-all;
  }

  .endpoint-head .descr {
    font-size: var(--font-size-small);
    color: var(--light-fg);
    font-weight: 400;
    align-items: center;
    overflow-wrap: break-word;
    word-break: break-all;
    display: none;
  }

  .m-endpoint.expanded {
    margin-bottom: 16px;
  }
  .m-endpoint > .endpoint-head {
    border-width: 1px 1px 1px 5px;
    border-style: solid;
    border-color: transparent;
    border-top-color: var(--light-border-color);
    display: flex;
    padding: 6px 16px;
    align-items: center;
    cursor: pointer;
  }
  .m-endpoint > .endpoint-head.put:hover,
  .m-endpoint > .endpoint-head.put.expanded {
    border-color: var(--orange);
    background: var(--light-orange, color-mix(in srgb, var(--orange) 10%, transparent));
  }
  .m-endpoint > .endpoint-head.post:hover,
  .m-endpoint > .endpoint-head.post.expanded {
    border-color: var(--green);
    background: var(--light-green, color-mix(in srgb, var(--green) 10%, transparent));
  }
  .m-endpoint > .endpoint-head.get:hover,
  .m-endpoint > .endpoint-head.get.expanded {
    border-color: var(--blue);
    background: var(--light-blue, color-mix(in srgb, var(--blue) 10%, transparent));
  }
  .m-endpoint > .endpoint-head.delete:hover,
  .m-endpoint > .endpoint-head.delete.expanded {
    border-color: var(--red);
    background: var(--light-red, color-mix(in srgb, var(--red) 10%, transparent));
  }

  .m-endpoint > .endpoint-head.head:hover,
  .m-endpoint > .endpoint-head.head.expanded,
  .m-endpoint > .endpoint-head.patch:hover,
  .m-endpoint > .endpoint-head.patch.expanded,
  .m-endpoint > .endpoint-head.options:hover,
  .m-endpoint > .endpoint-head.options.expanded {
    border-color: var(--yellow);
    background: var(--light-yellow, color-mix(in srgb, var(--yellow) 10%, transparent));
  }

  .m-endpoint > .endpoint-head.deprecated:hover,
  .m-endpoint > .endpoint-head.deprecated.expanded {
    border-color: var(--border-color);
    filter: opacity(0.6);
  }

  .m-endpoint .endpoint-body {
    flex-wrap: wrap;
    padding: 16px 0px 0 0px;
    border-width: 0px 1px 1px 5px;
    border-style: solid;
    box-shadow: 0px 4px 3px -3px rgba(0, 0, 0, 0.15);
  }
  .m-endpoint .endpoint-body.delete {
    border-color: var(--red);
  }
  .m-endpoint .endpoint-body.put {
    border-color: var(--orange);
  }
  .m-endpoint .endpoint-body.post {
    border-color: var(--green);
  }
  .m-endpoint .endpoint-body.get {
    border-color: var(--blue);
  }
  .m-endpoint .endpoint-body.head,
  .m-endpoint .endpoint-body.patch,
  .m-endpoint .endpoint-body.options {
    border-color: var(--yellow);
  }

  .m-endpoint .endpoint-body.deprecated {
    border-color: var(--border-color);
    filter: opacity(0.6);
  }

  .endpoint-head .deprecated {
    color: var(--light-fg);
    filter: opacity(0.6);
  }

  .summary {
    padding: 8px 8px;
  }
  .summary .title {
    font-size: calc(var(--font-size-regular) + 2px);
    margin-bottom: 6px;
    word-break: break-all;
  }

  .endpoint-head .method {
    padding: 2px 5px;
    vertical-align: middle;
    font-size: var(--font-size-small);
    height: calc(var(--font-size-small) + 16px);
    line-height: calc(var(--font-size-small) + 8px);
    width: 60px;
    border-radius: 2px;
    display: inline-block;
    text-align: center;
    font-weight: bold;
    text-transform: uppercase;
    margin-right: 5px;
  }
  .endpoint-head .method.delete {
    border: 2px solid var(--red);
  }
  .endpoint-head .method.put {
    border: 2px solid var(--orange);
  }
  .endpoint-head .method.post {
    border: 2px solid var(--green);
  }
  .endpoint-head .method.get {
    border: 2px solid var(--blue);
  }
  .endpoint-head .method.get.deprecated {
    border: 2px solid var(--border-color);
  }
  .endpoint-head .method.head,
  .endpoint-head .method.patch,
  .endpoint-head .method.options {
    border: 2px solid var(--yellow);
  }

  .req-resp-container {
    display: flex;
    margin-top: 16px;
    align-items: stretch;
    flex-wrap: wrap;
    flex-direction: column;
    border-top: 1px solid var(--light-border-color);
  }

  .view-mode-request,
  api-response.view-mode {
    flex: 1;
    min-height: 100px;
    padding: 16px 8px;
    overflow: hidden;
  }
  .view-mode-request {
    border-width: 0 0 1px 0;
    border-style: dashed;
  }

  .head .view-mode-request,
  .patch .view-mode-request,
  .options .view-mode-request {
    border-color: var(--yellow);
  }
  .put .view-mode-request {
    border-color: var(--orange);
  }
  .post .view-mode-request {
    border-color: var(--green);
  }
  .get .view-mode-request {
    border-color: var(--blue);
  }
  .delete .view-mode-request {
    border-color: var(--red);
  }

  @container (min-width: 1024px) {
    .only-large-screen {
      display: block;
    }
    .endpoint-head .path {
      font-size: var(--font-size-regular);
    }
    .endpoint-head .descr {
      display: flex;
    }
    .endpoint-head .m-markdown-small,
    .descr .m-markdown-small {
      display: block;
    }
    .req-resp-container {
      flex-direction: var(--layout, row);
      flex-wrap: nowrap;
    }
    api-response.view-mode {
      padding: 16px;
    }
    .view-mode-request.row-layout {
      border-width: 0 1px 0 0;
      padding: 16px;
    }
    .summary {
      padding: 8px 16px;
    }
  }
`,hr=M`
  code[class*='language-'],
  pre[class*='language-'] {
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
  pre[class*='language-'] {
    padding: 1em;
    margin: 0.5em 0;
    overflow: auto;
  }

  /* Inline code */
  :not(pre) > code[class*='language-'] {
    white-space: normal;
  }

  /* GitHub Syntax Highlighting (Dark & Light) */
  ::highlight(comment),
  ::highlight(quote) {
    color: var(--syntax-comment, #6e7781);
  }
  ::highlight(keyword),
  ::highlight(storage),
  ::highlight(at-rule),
  ::highlight(doctype),
  ::highlight(important),
  ::highlight(section) {
    color: var(--syntax-keyword, #cf222e);
  }
  ::highlight(operator),
  ::highlight(punctuation) {
    color: var(--syntax-operator, #24292f);
  }
  ::highlight(string),
  ::highlight(regexp),
  ::highlight(attribute-value),
  ::highlight(link),
  ::highlight(raw) {
    color: var(--syntax-string, #0a3069);
  }
  ::highlight(numeric),
  ::highlight(boolean),
  ::highlight(constant),
  ::highlight(symbol),
  ::highlight(character-entity),
  ::highlight(anchor),
  ::highlight(entity) {
    color: var(--syntax-constant, #0550ae);
  }
  ::highlight(function),
  ::highlight(decorator),
  ::highlight(animation) {
    color: var(--syntax-function, #8250df);
  }
  ::highlight(type),
  ::highlight(support) {
    color: var(--syntax-type, #8250df);
  }
  ::highlight(variable),
  ::highlight(interpolation) {
    color: var(--syntax-variable, #953800);
  }
  ::highlight(property),
  ::highlight(key),
  ::highlight(attribute-name) {
    color: var(--syntax-property, #0550ae);
  }
  ::highlight(tag) {
    color: var(--syntax-tag, #116329);
  }
  ::highlight(selector) {
    color: var(--syntax-selector, #8250df);
  }
  ::highlight(inserted) {
    color: var(--syntax-inserted, #116329);
  }
  ::highlight(deleted) {
    color: var(--syntax-deleted, #cf222e);
  }
`,la=M`
  .tab-panel {
    border: none;
  }
  .tab-buttons {
    height: 30px;
    padding: 4px 4px 0 4px;
    border-bottom: 1px solid var(--light-border-color);
    align-items: stretch;
    overflow-y: hidden;
    overflow-x: auto;
    scrollbar-width: thin;
  }
  .tab-buttons::-webkit-scrollbar {
    height: 1px;
    background: var(--border-color);
  }
  .tab-btn {
    border: none;
    border-bottom: 3px solid transparent;
    color: var(--light-fg);
    background: transparent;
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    font-family: var(--font-regular);
    font-size: var(--font-size-small);
    margin-right: 16px;
    padding: 1px;
  }
  .tab-btn.active {
    border-bottom: 3px solid var(--primary-color);
    font-weight: bold;
    color: var(--primary-color);
  }

  .tab-btn:hover {
    color: var(--primary-color);
  }
  .tab-content {
    margin: -1px 0 0 0;
    position: relative;
    min-height: 50px;
  }
`,dn=M`
  #advanced-search-btn {
    display: none;
  }
  #nav-bar-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    font-size: 36px;
    line-height: 30px;
    width: 50px;
    height: 50px;
    background: var(--bg2);
    color: var(--fg1);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    cursor: pointer;
    z-index: 10;
    box-shadow:
      0 12px 16px 0 rgba(0, 0, 0, 0.24),
      0 17px 50px 0 rgba(0, 0, 0, 0.19);
    &:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
  }
  .nav-bar {
    width: 0;
    height: 100%;
    overflow: hidden;
    color: var(--nav-text-color);
    background: var(--nav-bg-color);
    background-blend-mode: multiply;
    line-height: calc(var(--font-size-small) + 4px);
    position: relative;
    flex-direction: column;
    flex-wrap: nowrap;
    word-break: break-word;
    &.floating-nav {
      position: absolute;
      top: 0;
      left: 0;
      width: 330px;
      overflow: scroll;
      z-index: 5;
    }
  }

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
  ::slotted([slot='nav-logo']) {
    height: 60px;
    width: auto;
    padding: 16px 16px 0 16px;
    object-fit: contain;
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
    display: none;
  }
  .nav-bar-paths-under-tag {
    overflow: hidden;
    transition:
      max-height 0.2s ease-out,
      visibility 0.3s;
  }
  .collapsed .nav-bar-paths-under-tag {
    visibility: hidden;
    max-height: 0;
  }

  .nav-bar-expand-all {
    transform: rotate(90deg);
    cursor: pointer;
    margin-right: 10px;
  }
  .nav-bar-collapse-all {
    transform: rotate(270deg);
    cursor: pointer;
  }
  .nav-bar-expand-all:hover,
  .nav-bar-collapse-all:hover {
    color: var(--primary-color);
  }

  .nav-bar-tag-icon {
    color: var(--nav-text-color);
    font-size: 20px;
  }
  .nav-bar-tag-icon:hover {
    color: var(--nav-hover-text-color);
  }
  .nav-bar.focused .nav-bar-tag-and-paths.collapsed .nav-bar-tag-icon::after {
    content: '⌵';
    width: 16px;
    height: 16px;
    text-align: center;
    display: inline-block;
    transform: rotate(-90deg);
    transition: transform 0.2s ease-out 0s;
  }
  .nav-bar.focused .nav-bar-tag-and-paths.expanded .nav-bar-tag-icon::after {
    content: '⌵';
    width: 16px;
    height: 16px;
    text-align: center;
    display: inline-block;
    transition: transform 0.2s ease-out 0s;
  }
  .nav-scroll::-webkit-scrollbar {
    width: var(--scroll-bar-width, 8px);
  }
  .nav-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .nav-scroll::-webkit-scrollbar-thumb {
    background: var(--nav-hover-bg-color);
  }

  .nav-bar-tag {
    font-size: var(--font-size-regular);
    color: var(--nav-accent-color);
    border-left: 4px solid transparent;
    font-weight: bold;
    padding: 15px 15px 15px 10px;
    text-transform: capitalize;
  }

  .nav-bar-components,
  .nav-bar-h1,
  .nav-bar-h2,
  .nav-bar-info,
  .nav-bar-tag,
  .nav-bar-path {
    display: flex;
    cursor: pointer;
    width: 100%;
    border: none;
    border-radius: 4px;
    color: var(--nav-text-color);
    background: transparent;
    border-left: 4px solid transparent;
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
    font-weight: bold;
  }
  .nav-bar-section {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: var(--font-size-small);
    color: var(--nav-text-color);
    padding: var(--nav-item-padding);
    font-weight: bold;
  }
  .nav-bar-section.operations {
    cursor: pointer;
  }
  .nav-bar-section.operations:hover {
    color: var(--nav-hover-text-color);
    background: var(--nav-hover-bg-color);
  }

  .nav-bar-section:first-child {
    display: none;
  }
  .nav-bar-h2 {
    padding-left: 28px;
  }

  .nav-bar-h1.left-bar.active,
  .nav-bar-h2.left-bar.active,
  .nav-bar-info.left-bar.active,
  .nav-bar-tag.left-bar.active,
  .nav-bar-path.left-bar.active,
  .nav-bar-section.left-bar.operations.active {
    border-left: 4px solid var(--nav-accent-color);
    color: var(--nav-hover-text-color);
  }

  .nav-bar-h1.colored-block.active,
  .nav-bar-h2.colored-block.active,
  .nav-bar-info.colored-block.active,
  .nav-bar-tag.colored-block.active,
  .nav-bar-path.colored-block.active,
  .nav-bar-section.colored-block.operations.active {
    background: var(--nav-accent-color);
    color: var(--nav-accent-text-color);
    border-radius: 0;
  }

  .nav-bar-h1:hover,
  .nav-bar-h2:hover,
  .nav-bar-info:hover,
  .nav-bar-tag:hover,
  .nav-bar-path:hover {
    color: var(--nav-hover-text-color);
    background: var(--nav-hover-bg-color);
  }
`,pn=M`
  #api-info {
    font-size: calc(var(--font-size-regular) - 1px);
    margin-top: 8px;
  }

  #api-info span:before {
    content: '|';
    display: inline-block;
    opacity: 0.5;
    width: 15px;
    text-align: center;
  }
  #api-info span:first-child:before {
    content: '';
    width: 0px;
  }
`,Qe=M``,Dl=M`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  .dialog-box {
    position: absolute;
    top: 100px;
    background: var(--bg2);
    padding: 0;
    color: var(--fg2);
    border-radius: 4px;
    max-height: 70vh;
    height: 70vh;
    max-width: 70vw;
    width: 70vw;
    border: 1px solid var(--border-color);
    box-shadow:
      0 14px 28px rgba(0, 0, 0, 0.25),
      0 10px 10px rgba(0, 0, 0, 0.22);
  }

  .dialog-box-header {
    position: sticky;
    top: 0;
    align-self: stretch;
    z-index: 10;
    backdrop-filter: blur(12px);
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
    background: transparent;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 50%;
    margin-right: -8px;
  }
  .dialog-box-header button:hover {
    border-color: var(--primary-color);
  }

  .dialog-box-content {
    padding: 16px;
    display: block;
    overflow: auto;
    height: 100%;
  }

  .dialog-box-title {
    flex-grow: 1;
    font-size: 24px;
  }
`,ca=/[\s#:?&={}]/g,Tt="_rapidoc_api_key";function da(e){return new Promise(t=>setTimeout(t,e))}function Ot(e,t){let a=t.target,r=document.createElement("textarea");r.value=e,r.style.position="fixed",document.body.appendChild(r),r.focus(),r.select();try{document.execCommand("copy"),a.innerText="Copied",setTimeout(()=>{a.innerText="Copy"},5e3)}catch{}document.body.removeChild(r)}function Al(e,t){return t.name.toLowerCase().includes(e.toLowerCase())}function _t(e,t,a=""){return`${t.method} ${t.path} ${t.summary||""} ${t.description||""} ${t.operationId||""} ${a}`.toLowerCase().includes(e.toLowerCase())}function mr(e,t=new Set){return e&&Object.keys(e).forEach(a=>{t.add(a),e[a].properties?mr(e[a].properties,t):e[a].items?.properties&&mr(e[a].items?.properties,t)}),t}function Cl(e,t,a=[]){if(!e.trim()||a.length===0)return;let r=[];return t.forEach(s=>{s.paths.forEach(n=>{let i="";if(a.includes("search-api-path")&&(i=n.path),a.includes("search-api-descr")&&(i=`${i} ${(n.summary||"")+(n.description||"")}`),a.includes("search-api-params")&&(i=`${i} ${n.parameters?.map(o=>o.name).join(" ")||""}`),a.includes("search-api-request-body")&&n.requestBody){let o=new Set;for(let l in n.requestBody?.content)n.requestBody.content[l].schema?.properties&&(o=mr(n.requestBody.content[l].schema?.properties)),i=`${i} ${[...o].join(" ")}`}a.includes("search-api-resp-descr")&&(i=`${i} ${Object.values(n.responses).map(o=>o.description||"").join(" ")}`),i.toLowerCase().includes(e.trim().toLowerCase())&&r.push({elementId:n.elementId,method:n.method,path:n.path,summary:n.summary||n.description||"",deprecated:n.deprecated})})}),r}function un(e,t){if(e){let a=document.createElement("a");document.body.appendChild(a),a.style="display: none",a.href=e,a.download=t,a.click(),a.remove()}}function hn(e){if(e){let t=document.createElement("a");document.body.appendChild(t),t.style="display: none",t.href=e,t.target="_blank",t.click(),t.remove()}}var H=e=>{if(typeof e!="object"||!e)return!1;let t=Object.getPrototypeOf(e);return t===Object.prototype||t===null},re=e=>typeof e=="object"&&!!e;function qe(e,t,a=[]){let r={};for(let[s,n]of Object.entries(e)){let i=[...a,s];if(Array.isArray(n)){r[s]=n.map((o,l)=>typeof o=="object"&&!Array.isArray(o)&&o!==null?qe(o,t,[...i,l.toString()]):o);continue}if(re(n)){r[s]=qe(n,t,i);continue}r[s]=n}return t(r,a)}var Ce="application/json";function mn(e){let t=e["x-example"],a=e["x-examples"];return delete e["x-example"],delete e["x-examples"],{xExample:t,xExamples:a}}function ze(e){return typeof e=="object"&&!!e&&!Array.isArray(e)&&Object.keys(e).length>0}function Fl(e){return ze(e)&&Object.values(e).every(t=>typeof t=="object"&&!!t&&!Array.isArray(t))}function Tl(e){if(!re(e))return!0;let t=e;return!(t.allOf||t.oneOf||t.anyOf||t.items||t.$ref||"additionalProperties"in t||["enum","const","not","format","multipleOf","maximum","exclusiveMaximum","minimum","exclusiveMinimum","maxLength","minLength","pattern","maxItems","minItems","uniqueItems","maxProperties","minProperties","required"].some(a=>a in t)||typeof t.properties=="object"&&t.properties!==null&&Object.keys(t.properties).length>0)}function fn(e){let t=Object.keys(e);if(t.some(a=>{let r=e[a];return re(r)&&(r.example!==void 0||r.examples!==void 0)}))for(let a of t){let r=e[a];if(!re(r))continue;let s=r.example!==void 0||r.examples!==void 0;r.schema!==void 0&&!s&&Object.keys(r).length===1&&Tl(r.schema)&&delete e[a]}}var Ol=new Set(["summary","description","value","externalValue"]);function gn(e){if(typeof e!="object"||!e)return!1;let t=e,a="value"in t||"externalValue"in t,r=Object.keys(t).every(s=>Ol.has(s));return a&&r}function et(e){return gn(e)?e:{value:e}}var _l=/^[a-zA-Z0-9*+.-]+\/[a-zA-Z0-9*+.+-]+$/;function fr(e){return _l.test(e)}function Nl(e){return Object.entries(e).reduce((t,[a,r])=>(t[a]={value:r},t),{})}var Bl=e=>{switch(e){case"application":return"clientCredentials";case"accessCode":return"authorizationCode";case"implicit":return"implicit";case"password":return"password";default:return e}};function bn(e){let t=e;if(typeof t=="object"&&t&&typeof t.swagger=="string"&&t.swagger?.startsWith("2.0"))t.openapi="3.0.4",delete t.swagger;else return t;if(t.host){let a=Array.isArray(t.schemes)&&t.schemes?.length?t.schemes:["http"];t.servers=a.map(r=>({url:`${r}://${t.host}${t.basePath??""}`})),delete t.basePath,delete t.schemes,delete t.host}else t.basePath&&(t.servers=[{url:t.basePath}],delete t.basePath);if(t.definitions){for(let a of Object.values(t.definitions))Se(a);t.components=Object.assign({},t.components,{schemas:t.definitions}),delete t.definitions,t=qe(t,a=>(typeof a.$ref=="string"&&a.$ref.startsWith("#/definitions/")&&(a.$ref=a.$ref.replace(/^#\/definitions\//,"#/components/schemas/")),a))}if(t=qe(t,a=>(a.type==="file"&&(a.type="string",a.format="binary"),a)),Object.hasOwn(t,"parameters")){t=qe(t,n=>{if(typeof n.$ref=="string"&&n.$ref.startsWith("#/parameters/")){let i=n.$ref.split("/")[2];if(!i)return n;let o=re(t.parameters)&&i in t.parameters?t.parameters[i]:void 0;n.$ref=o&&typeof o=="object"&&"in"in o&&(o.in==="body"||o.in==="formData")?n.$ref.replace(/^#\/parameters\//,"#/components/requestBodies/"):n.$ref.replace(/^#\/parameters\//,"#/components/parameters/")}return n}),t.components??={};let a={},r={},s=re(t.parameters)?t.parameters:{};for(let[n,i]of Object.entries(s))i&&typeof i=="object"&&("$ref"in i?a[n]=br(i):"in"in i&&(i.in==="body"?r[n]=wn(i,t.consumes??[Ce]):i.in==="formData"?r[n]=$n([i],t.consumes):a[n]=br(i)));Object.keys(a).length>0&&(t.components.parameters=a),Object.keys(r).length>0&&(t.components.requestBodies=r),delete t.parameters}if(Object.hasOwn(t,"responses")&&typeof t.responses=="object"&&t.responses!==null){t=qe(t,s=>(typeof s.$ref=="string"&&s.$ref.startsWith("#/responses/")&&(s.$ref=s.$ref.replace(/^#\/responses\//,"#/components/responses/")),s)),t.components??={};let a={},r=t.responses;for(let[s,n]of Object.entries(r))if(re(n))if("$ref"in n)a[s]=n;else{let i=n,o=t.produces??[Ce];if(i.schema){Se(i.schema),typeof i.content!="object"&&(i.content={});for(let l of o)i.content[l]={schema:i.schema};delete i.schema}if(i.examples&&typeof i.examples=="object"){typeof i.content!="object"&&(i.content={});let l=o[0]??Ce;for(let[c,p]of Object.entries(i.examples))if(fr(c))typeof i.content[c]!="object"&&(i.content[c]={}),i.content[c].example=p;else{typeof i.content[l]!="object"&&(i.content[l]={});let u=i.content[l];typeof u.examples!="object"&&(u.examples={}),u.examples[c]=et(p)}delete i.examples}i.content&&typeof i.content=="object"&&fn(i.content),re(i.headers)&&(i.headers=Object.entries(i.headers).reduce((l,[c,p])=>p&&typeof p=="object"?{[c]:yn(p),...l}:l,{})),a[s]=i}Object.keys(a).length>0&&(t.components.responses=a),delete t.responses}if(typeof t.paths=="object"){for(let a in t.paths)if(Object.hasOwn(t.paths,a)){let r=re(t.paths)&&a in t.paths?t.paths[a]:void 0;if(!r||typeof r!="object")continue;let s;for(let n in r)if(n==="parameters"&&Object.hasOwn(r,n)){let i=kn(r.parameters,t.consumes??[Ce]);r.parameters=i.parameters,s=i.requestBody}else if(Object.hasOwn(r,n)){let i=r[n];if(s&&(i.requestBody=s),i.parameters){let o=kn(i.parameters,i.consumes??t.consumes??[Ce]);i.parameters=o.parameters,o.requestBody&&(i.requestBody=o.requestBody)}if(delete i.consumes,i.responses){for(let o in i.responses)if(Object.hasOwn(i.responses,o)){let l=i.responses[o];if(l.headers&&typeof l.headers=="object"&&(l.headers=Object.entries(l.headers).reduce((c,[p,u])=>u&&typeof u=="object"?{[p]:yn(u),...c}:c,{})),l.schema){Se(l.schema);let c=t.produces??i.produces??[Ce];typeof l.content!="object"&&(l.content={});for(let p of c)l.content[p]={schema:l.schema};delete l.schema}if(l.examples&&typeof l.examples=="object"){typeof l.content!="object"&&(l.content={});let c=(t.produces??i.produces??[Ce])[0]??Ce;for(let[p,u]of Object.entries(l.examples))if(fr(p))typeof l.content[p]!="object"&&(l.content[p]={}),l.content[p].example=u;else{typeof l.content[c]!="object"&&(l.content[c]={});let h=l.content[c];typeof h.examples!="object"&&(h.examples={}),h.examples[p]=et(u)}delete l.examples}l.content&&typeof l.content=="object"&&fn(l.content)}}delete i.produces,i.parameters?.length===0&&delete i.parameters}}}if(t.securityDefinitions){(typeof t.components!="object"||t.components===null)&&(t.components={}),t.components&&typeof t.components=="object"&&Object.assign(t.components,{securitySchemes:{}});for(let[a,r]of Object.entries(t.securityDefinitions))if(typeof r=="object")if("type"in r&&r.type==="oauth2"){let{flow:s,authorizationUrl:n,tokenUrl:i,scopes:o}=r;t.components&&typeof t.components=="object"&&"securitySchemes"in t.components&&t.components.securitySchemes&&Object.assign(t.components.securitySchemes,{[a]:{type:"oauth2",flows:{[Bl(s||"implicit")]:Object.assign({},n&&{authorizationUrl:n},i&&{tokenUrl:i},o&&{scopes:o})}}})}else"type"in r&&r.type==="basic"?t.components&&typeof t.components=="object"&&"securitySchemes"in t.components&&t.components.securitySchemes&&Object.assign(t.components.securitySchemes,{[a]:{type:"http",scheme:"basic"}}):t.components&&typeof t.components=="object"&&"securitySchemes"in t.components&&t.components.securitySchemes&&Object.assign(t.components.securitySchemes,{[a]:r});delete t.securityDefinitions}return delete t.consumes,delete t.produces,t}var Se=e=>{if(re(e)){if(typeof e["x-nullable"]=="boolean"&&(e["x-nullable"]&&(e.nullable=!0),delete e["x-nullable"]),re(e.properties))for(let t of Object.values(e.properties))Se(t);if(Se(e.items),Se(e.additionalProperties),Array.isArray(e.allOf))for(let t of e.allOf)Se(t)}};function gr(e){let t=["type","format","default","items","maximum","exclusiveMaximum","minimum","exclusiveMinimum","maxLength","minLength","pattern","maxItems","minItems","uniqueItems","enum","multipleOf","x-nullable"].reduce((a,r)=>(Object.hasOwn(e,r)&&(a[r]=e[r],delete e[r]),a),{});return Se(t),t}function Il(e){if(e==="formData")throw Error("Encountered a formData parameter which should have been filtered out by the caller");if(e==="body")throw Error("Encountered a body parameter which should have been filtered out by the caller");return e}function br(e){if(Object.hasOwn(e,"$ref")&&typeof e.$ref=="string")return{$ref:e.$ref};let t=Ll(e),a=gr(e),{xExample:r,xExamples:s}=mn(e);if(ze(r)?e.examples=Nl(r):ze(s)&&(e.examples=Object.entries(s).reduce((n,[i,o])=>(n[i]=et(o),n),{})),delete e.collectionFormat,delete e.default,!e.in)throw Error('Parameter object must have an "in" property');return{schema:a,...t,...e,in:Il(e.in)}}function yn(e){if(Object.hasOwn(e,"$ref")&&typeof e.$ref=="string")return{$ref:e.$ref};let t=gr(e);return{...e,schema:t}}var vn={ssv:{style:"spaceDelimited",explode:!1},pipes:{style:"pipeDelimited",explode:!1},multi:{style:"form",explode:!0},csv:{style:"form",explode:!1},tsv:{}},xn={ssv:{},pipes:{},multi:{},csv:{style:"simple",explode:!1},tsv:{}},yr={header:xn,query:vn,path:xn};function Ll(e){if(e.type!=="array"||e.in!=="query"&&e.in!=="path"&&e.in!=="header")return{};let t=e.collectionFormat??"csv";return e.in in yr&&t in yr[e.in]?yr[e.in][t]:{}}function Rl(e){if(e.type!=="array"||typeof e.collectionFormat!="string")return;let t=vn[e.collectionFormat];if(t&&Object.keys(t).length!==0)return t}function wn(e,t){let{xExample:a,xExamples:r}=mn(e);delete e.name,delete e.in;let{schema:s,...n}=e;Se(s);let i={content:{},...n};if(i.content)for(let o of t){if(i.content[o]={schema:s},ze(r)&&o in r){let l=r[o];ze(l)&&Object.values(l).every(c=>gn(c))?i.content[o].examples=l:Fl(l)?i.content[o].examples=Object.entries(l).reduce((c,[p,u])=>(c[p]=et(u),c),{}):i.content[o].examples={default:et(l)}}else ze(r)&&!Object.keys(r).some(fr)&&(i.content[o].examples=Object.entries(r).reduce((l,[c,p])=>(l[c]=et(p),l),{}));!i.content[o].examples&&ze(a)&&o in a&&(i.content[o].example=a[o])}return i}function $n(e,t=["multipart/form-data"]){let a={content:{}},r=t.filter(n=>n==="multipart/form-data"||n==="application/x-www-form-urlencoded"),s=r.length>0?r:["multipart/form-data"];if(a.content)for(let n of s){a.content[n]={schema:{type:"object",properties:{},required:[]}};let i=a.content?.[n];if(i?.schema&&typeof i.schema=="object"&&"properties"in i.schema){for(let o of e)if(o.name&&i.schema.properties){i.schema.properties[o.name]={...gr(structuredClone(o)),...o.description===void 0?{}:{description:o.description}};let l=Rl(o);l&&(i.encoding??={},i.encoding[o.name]=l),o.required&&Array.isArray(i.schema.required)&&i.schema.required.push(o.name)}}}return a}function kn(e,t){let a={parameters:e.filter(n=>n.in!=="body"&&n.in!=="formData").map(n=>br(n))},r=structuredClone(e.find(n=>n.in==="body")??{});r&&Object.keys(r).length&&(a.requestBody=wn(r,t));let s=e.filter(n=>n.in==="formData");if(s.length>0){let n=$n(s,t);a.requestBody=typeof a.requestBody=="object"?{...a.requestBody,content:{...a.requestBody.content,...n.content}}:n,typeof a.requestBody!="object"&&(a.requestBody={content:{}})}return a}var jl=new Set(["properties","items","allOf","anyOf","oneOf","not","additionalProperties","schema","schemas"]),ql=new Set(["paths","webhooks","responses","content","headers","examples","links","encoding","variables","parameters","requestBodies","securitySchemes","pathItems","scopes"]),zl=e=>{if(!e)return!1;let t=e[0]==="x-ext"&&e[1]!==void 0?e.slice(2):e,a=0;for(let r of t){if(a>0){a--;continue}if(jl.has(r)||r.endsWith("Schema"))return!0;if(r==="callbacks"){a=2;continue}ql.has(r)&&(a=1)}return!1},Pl=new Set(["properties","patternProperties","$defs","definitions"]);function pa(e){let t=e?.[e.length-1];return t===void 0?!1:t==="schemas"&&e?.[e.length-2]==="components"||Pl.has(t)}var Ul=new Set(["example","default","const","enum"]);function Ml(e){if(!e)return!1;for(let[t,a]of e.entries())if(Ul.has(a)&&!pa(e.slice(0,t))||a==="value"&&e[t-2]==="examples"&&!pa(e.slice(0,t-2)))return!0;return!1}function Sn(e){let t=e;return t===null||typeof t.openapi!="string"||!t.openapi.startsWith("3.0")||(t.openapi="3.1.1",t=qe(t,Hl)),t}var Hl=(e,t)=>{if(Ml(t))return e;if(e.type!==void 0&&e.nullable===!0)e.type=[e.type,"null"],delete e.nullable;else if(e.nullable===!0&&e.type===void 0){if(typeof e.$ref=="string"){let{nullable:n,$ref:i,...o}=e;return{...o,anyOf:[{$ref:i},{type:"null"}]}}if(Array.isArray(e.allOf)){let{nullable:n,allOf:i,...o}=e,l=i.length===1?i[0]:{allOf:i};return{...o,anyOf:[l,{type:"null"}]}}}e.exclusiveMinimum===!0&&e.minimum!==void 0?(e.exclusiveMinimum=e.minimum,delete e.minimum):typeof e.exclusiveMinimum=="boolean"&&delete e.exclusiveMinimum,e.exclusiveMaximum===!0&&e.maximum!==void 0?(e.exclusiveMaximum=e.maximum,delete e.maximum):typeof e.exclusiveMaximum=="boolean"&&delete e.exclusiveMaximum;let a=t?.some((n,i)=>n==="examples"&&i>0&&!pa(t.slice(0,i)));e.example!==void 0&&!a&&!pa(t)&&(e.examples=zl(t)?[e.example]:{default:{value:e.example}},delete e.example);let{format:r,...s}=e;if(e.type==="string"||Array.isArray(e.type)&&e.type.includes("string")){if(e.format==="binary"){let{type:n,...i}=s;return t?.at(-1)==="schema"&&t.at(-3)==="content"?i:{contentMediaType:"application/octet-stream",...i}}if(e.format==="base64"||e.format==="byte")return{...s,contentEncoding:"base64"}}return e["x-webhooks"]!==void 0&&(t===void 0||t.length===0)&&(e.webhooks=e["x-webhooks"],delete e["x-webhooks"]),e},Wl=["2.0","3.0","3.1","3.2"],se={EMPTY_OR_INVALID:"Can't find JSON, YAML or filename in data.",OPENAPI_VERSION_NOT_SUPPORTED:"Can't find supported Swagger/OpenAPI version in the provided document, version must be a string.",INVALID_REFERENCE:"Can't resolve reference: %s",EXTERNAL_REFERENCE_NOT_FOUND:"Can't resolve external reference: %s",SELF_REFERENCE:"Can't resolve reference to itself: %s",FILE_DOES_NOT_EXIST:"File does not exist: %s",NO_CONTENT:"No content found"};function En(e){if(e===null)return{version:void 0,specificationType:void 0,specificationVersion:void 0};if(H(e))for(let t of new Set(Wl)){let a=t==="2.0"?"swagger":"openapi",r=e[a];if(typeof r!="string")continue;let[s,n]=r.split(".");if(`${s}.${n}`===t)return{version:t,specificationType:a,specificationVersion:r}}return{version:void 0,specificationType:void 0,specificationVersion:void 0}}function Pe(e){return e?.find(t=>t.isEntrypoint)}function vr(e,t,a=[]){let r={};for(let[s,n]of Object.entries(e)){let i=[...a,s];if(Array.isArray(n)){r[s]=n.map((o,l)=>typeof o=="object"&&!Array.isArray(o)&&o!==null?vr(o,t,[...i,l.toString()]):o);continue}if(typeof n=="object"&&n){r[s]=vr(n,t,i);continue}r[s]=n}return t(r,a)}function Dn(e){let t=[];return!e||typeof e!="object"?t:(vr(e,a=>(a.$ref&&typeof a.$ref=="string"&&!a.$ref.startsWith("#")&&t.push(a.$ref.split("#")[0]),a)),[...new Set(t)])}function xr(e){return e!==void 0&&Array.isArray(e)&&e.length>0&&e.some(t=>t.isEntrypoint===!0)}var wr=Symbol.for("yaml.alias"),$r=Symbol.for("yaml.document"),Fe=Symbol.for("yaml.map"),An=Symbol.for("yaml.pair"),ve=Symbol.for("yaml.scalar"),tt=Symbol.for("yaml.seq"),ne=Symbol.for("yaml.node.type"),at=e=>!!e&&typeof e=="object"&&e[ne]===wr,ua=e=>!!e&&typeof e=="object"&&e[ne]===$r,Nt=e=>!!e&&typeof e=="object"&&e[ne]===Fe,W=e=>!!e&&typeof e=="object"&&e[ne]===An,j=e=>!!e&&typeof e=="object"&&e[ne]===ve,Bt=e=>!!e&&typeof e=="object"&&e[ne]===tt;function V(e){if(e&&typeof e=="object")switch(e[ne]){case Fe:case tt:return!0}return!1}function K(e){if(e&&typeof e=="object")switch(e[ne]){case wr:case Fe:case ve:case tt:return!0}return!1}var Cn=e=>(j(e)||V(e))&&!!e.anchor,Ue=Symbol("break visit"),Vl=Symbol("skip children"),It=Symbol("remove node");function rt(e,t){let a=Kl(t);ua(e)?st(null,e.contents,a,Object.freeze([e]))===It&&(e.contents=null):st(null,e,a,Object.freeze([]))}rt.BREAK=Ue,rt.SKIP=Vl,rt.REMOVE=It;function st(e,t,a,r){let s=Zl(e,t,a,r);if(K(s)||W(s))return Jl(e,r,s),st(e,s,a,r);if(typeof s!="symbol"){if(V(t)){r=Object.freeze(r.concat(t));for(let n=0;n<t.items.length;++n){let i=st(n,t.items[n],a,r);if(typeof i=="number")n=i-1;else{if(i===Ue)return Ue;i===It&&(t.items.splice(n,1),--n)}}}else if(W(t)){r=Object.freeze(r.concat(t));let n=st("key",t.key,a,r);if(n===Ue)return Ue;n===It&&(t.key=null);let i=st("value",t.value,a,r);if(i===Ue)return Ue;i===It&&(t.value=null)}}return s}function Kl(e){return typeof e=="object"&&(e.Collection||e.Node||e.Value)?Object.assign({Alias:e.Node,Map:e.Node,Scalar:e.Node,Seq:e.Node},e.Value&&{Map:e.Value,Scalar:e.Value,Seq:e.Value},e.Collection&&{Map:e.Collection,Seq:e.Collection},e):e}function Zl(e,t,a,r){if(typeof a=="function")return a(e,t,r);if(Nt(t))return a.Map?.(e,t,r);if(Bt(t))return a.Seq?.(e,t,r);if(W(t))return a.Pair?.(e,t,r);if(j(t))return a.Scalar?.(e,t,r);if(at(t))return a.Alias?.(e,t,r)}function Jl(e,t,a){let r=t[t.length-1];if(V(r))r.items[e]=a;else if(W(r))e==="key"?r.key=a:r.value=a;else if(ua(r))r.contents=a;else{let s=at(r)?"alias":"scalar";throw Error(`Cannot replace node with ${s} parent`)}}var Gl={"!":"%21",",":"%2C","[":"%5B","]":"%5D","{":"%7B","}":"%7D"},Yl=e=>e.replace(/[!,[\]{}]/g,t=>Gl[t]),nt=class Ae{constructor(t,a){this.docStart=null,this.docEnd=!1,this.yaml=Object.assign({},Ae.defaultYaml,t),this.tags=Object.assign({},Ae.defaultTags,a)}clone(){let t=new Ae(this.yaml,this.tags);return t.docStart=this.docStart,t}atDocument(){let t=new Ae(this.yaml,this.tags);switch(this.yaml.version){case"1.1":this.atNextDocument=!0;break;case"1.2":this.atNextDocument=!1,this.yaml={explicit:Ae.defaultYaml.explicit,version:"1.2"},this.tags=Object.assign({},Ae.defaultTags)}return t}add(t,a){this.atNextDocument&&=(this.yaml={explicit:Ae.defaultYaml.explicit,version:"1.1"},this.tags=Object.assign({},Ae.defaultTags),!1);let r=t.trim().split(/[ \t]+/),s=r.shift();switch(s){case"%TAG":{if(r.length!==2&&(a(0,"%TAG directive should contain exactly two parts"),r.length<2))return!1;let[n,i]=r;return this.tags[n]=i,!0}case"%YAML":{if(this.yaml.explicit=!0,r.length!==1)return a(0,"%YAML directive should contain exactly one part"),!1;let[n]=r;if(n==="1.1"||n==="1.2")return this.yaml.version=n,!0;{let i=/^\d+\.\d+$/.test(n);return a(6,`Unsupported YAML version ${n}`,i),!1}}default:return a(0,`Unknown directive ${s}`,!0),!1}}tagName(t,a){if(t==="!")return"!";if(t[0]!=="!")return a(`Not a valid tag: ${t}`),null;if(t[1]==="<"){let i=t.slice(2,-1);return i==="!"||i==="!!"?(a(`Verbatim tags aren't resolved, so ${t} is invalid.`),null):(t[t.length-1]!==">"&&a("Verbatim tags must end with a >"),i)}let[,r,s]=t.match(/^(.*!)([^!]*)$/s);s||a(`The ${t} tag has no suffix`);let n=this.tags[r];if(n)try{return n+decodeURIComponent(s)}catch(i){return a(String(i)),null}return r==="!"?t:(a(`Could not resolve tag: ${t}`),null)}tagString(t){for(let[a,r]of Object.entries(this.tags))if(t.startsWith(r))return a+Yl(t.substring(r.length));return t[0]==="!"?t:`!<${t}>`}toString(t){let a=this.yaml.explicit?[`%YAML ${this.yaml.version||"1.2"}`]:[],r=Object.entries(this.tags),s;if(t&&r.length>0&&K(t.contents)){let n={};rt(t.contents,(i,o)=>{K(o)&&o.tag&&(n[o.tag]=!0)}),s=Object.keys(n)}else s=[];for(let[n,i]of r)(n!=="!!"||i!=="tag:yaml.org,2002:")&&(!t||s.some(o=>o.startsWith(i)))&&a.push(`%TAG ${n} ${i}`);return a.join(`
`)}};nt.defaultYaml={explicit:!1,version:"1.2"},nt.defaultTags={"!!":"tag:yaml.org,2002:"};function Fn(e){if(/[\x00-\x19\s,[\]{}]/.test(e)){let t=`Anchor must not contain whitespace or control characters: ${JSON.stringify(e)}`;throw Error(t)}return!0}function Tn(e){let t=new Set;return rt(e,{Value(a,r){r.anchor&&t.add(r.anchor)}}),t}function On(e,t){for(let a=1;;++a){let r=`${e}${a}`;if(!t.has(r))return r}}function Xl(e,t){let a=[],r=new Map,s=null;return{onAnchor:n=>{a.push(n),s??=Tn(e);let i=On(t,s);return s.add(i),i},setAnchors:()=>{for(let n of a){let i=r.get(n);if(typeof i=="object"&&i.anchor&&(j(i.node)||V(i.node)))i.node.anchor=i.anchor;else{let o=Error("Failed to resolve repeated object (this should not happen)");throw o.source=n,o}}},sourceObjects:r}}function it(e,t,a,r){if(r&&typeof r=="object")if(Array.isArray(r))for(let s=0,n=r.length;s<n;++s){let i=r[s],o=it(e,r,String(s),i);o===void 0?delete r[s]:o!==i&&(r[s]=o)}else if(r instanceof Map)for(let s of Array.from(r.keys())){let n=r.get(s),i=it(e,r,s,n);i===void 0?r.delete(s):i!==n&&r.set(s,i)}else if(r instanceof Set)for(let s of Array.from(r)){let n=it(e,r,s,s);n===void 0?r.delete(s):n!==s&&(r.delete(s),r.add(n))}else for(let[s,n]of Object.entries(r)){let i=it(e,r,s,n);i===void 0?delete r[s]:i!==n&&(r[s]=i)}return e.call(t,a,r)}function ie(e,t,a){if(Array.isArray(e))return e.map((r,s)=>ie(r,String(s),a));if(e&&typeof e.toJSON=="function"){if(!a||!Cn(e))return e.toJSON(t,a);let r={aliasCount:0,count:1,res:void 0};a.anchors.set(e,r),a.onCreate=n=>{r.res=n,delete a.onCreate};let s=e.toJSON(t,a);return a.onCreate&&a.onCreate(s),s}return typeof e=="bigint"&&!a?.keep?Number(e):e}var kr=class{constructor(e){Object.defineProperty(this,ne,{value:e})}clone(){let e=Object.create(Object.getPrototypeOf(this),Object.getOwnPropertyDescriptors(this));return this.range&&(e.range=this.range.slice()),e}toJS(e,{mapAsMap:t,maxAliasCount:a,onAnchor:r,reviver:s}={}){if(!ua(e))throw TypeError("A document argument is required");let n={anchors:new Map,doc:e,keep:!0,mapAsMap:t===!0,mapKeyWarned:!1,maxAliasCount:typeof a=="number"?a:100},i=ie(this,"",n);if(typeof r=="function")for(let{count:o,res:l}of n.anchors.values())r(l,o);return typeof s=="function"?it(s,{"":i},"",i):i}},Sr=class extends kr{constructor(e){super(wr),this.source=e,Object.defineProperty(this,"tag",{set(){throw Error("Alias nodes cannot have tags")}})}resolve(e,t){if(t?.maxAliasCount===0)throw ReferenceError("Alias resolution is disabled");let a;t?.aliasResolveCache?a=t.aliasResolveCache:(a=[],rt(e,{Node:(s,n)=>{(at(n)||Cn(n))&&a.push(n)}}),t&&(t.aliasResolveCache=a));let r;for(let s of a){if(s===this)break;s.anchor===this.source&&(r=s)}if(r&&t){let{anchors:s,doc:n,maxAliasCount:i}=t,o=s.get(r);if(o||=(ie(r,null,t),s.get(r)),o?.res===void 0)throw ReferenceError("This should not happen: Alias anchor was not resolved?");if(i>=0&&(o.count+=1,o.aliasCount===0&&(o.aliasCount=ha(n,r,s)),o.count*o.aliasCount>i))throw ReferenceError("Excessive alias count indicates a resource exhaustion attack")}return r}toJSON(e,t){if(!t)return{source:this.source};let a=this.resolve(t.doc,t);if(!a){let r=`Unresolved alias (the anchor must be set before the alias): ${this.source}`;throw ReferenceError(r)}return t.anchors.get(a).res}toString(e,t,a){let r=`*${this.source}`;if(e){if(Fn(this.source),e.options.verifyAliasOrder&&!e.anchors.has(this.source)){let s=`Unresolved alias (the anchor must be set before the alias): ${this.source}`;throw Error(s)}if(e.implicitKey)return`${r} `}return r}};function ha(e,t,a){if(at(t)){let r=t.resolve(e),s=a&&r&&a.get(r);return s?s.count*s.aliasCount:0}if(V(t)){let r=0;for(let s of t.items){let n=ha(e,s,a);n>r&&(r=n)}return r}if(W(t)){let r=ha(e,t.key,a),s=ha(e,t.value,a);return Math.max(r,s)}return 1}var _n=e=>!e||typeof e!="function"&&typeof e!="object",O=class extends kr{constructor(e){super(ve),this.value=e}toJSON(e,t){return t?.keep?this.value:ie(this.value,e,t)}toString(){return String(this.value)}};O.BLOCK_FOLDED="BLOCK_FOLDED",O.BLOCK_LITERAL="BLOCK_LITERAL",O.PLAIN="PLAIN",O.QUOTE_DOUBLE="QUOTE_DOUBLE",O.QUOTE_SINGLE="QUOTE_SINGLE";var Ql="tag:yaml.org,2002:";function ec(e,t,a){if(t){let r=a.filter(n=>n.tag===t),s=r.find(n=>!n.format)??r[0];if(!s)throw Error(`Tag ${t} not found`);return s}return a.find(r=>r.identify?.(e)&&!r.format)}function Lt(e,t,a){if(ua(e)&&(e=e.contents),K(e))return e;if(W(e)){let u=a.schema[Fe].createNode?.(a.schema,null,a);return u.items.push(e),u}(e instanceof String||e instanceof Number||e instanceof Boolean||typeof BigInt<"u"&&e instanceof BigInt)&&(e=e.valueOf());let{aliasDuplicateObjects:r,onAnchor:s,onTagObj:n,schema:i,sourceObjects:o}=a,l;if(r&&e&&typeof e=="object"){if(l=o.get(e),l)return l.anchor??(l.anchor=s(e)),new Sr(l.anchor);l={anchor:null,node:null},o.set(e,l)}t?.startsWith("!!")&&(t=Ql+t.slice(2));let c=ec(e,t,i.tags);if(!c){if(e&&typeof e.toJSON=="function"&&(e=e.toJSON()),!e||typeof e!="object"){let u=new O(e);return l&&(l.node=u),u}c=e instanceof Map?i[Fe]:Symbol.iterator in Object(e)?i[tt]:i[Fe]}n&&(n(c),delete a.onTagObj);let p=c?.createNode?c.createNode(a.schema,e,a):typeof c?.nodeClass?.from=="function"?c.nodeClass.from(a.schema,e,a):new O(e);return t?p.tag=t:c.default||(p.tag=c.tag),l&&(l.node=p),p}function ma(e,t,a){let r=a;for(let s=t.length-1;s>=0;--s){let n=t[s];if(typeof n=="number"&&Number.isInteger(n)&&n>=0){let i=[];i[n]=r,r=i}else r=new Map([[n,r]])}return Lt(r,void 0,{aliasDuplicateObjects:!1,keepUndefined:!1,onAnchor:()=>{throw Error("This should not happen, please report a bug.")},schema:e,sourceObjects:new Map})}var Rt=e=>e==null||typeof e=="object"&&!!e[Symbol.iterator]().next().done,Nn=class extends kr{constructor(e,t){super(e),Object.defineProperty(this,"schema",{value:t,configurable:!0,enumerable:!1,writable:!0})}clone(e){let t=Object.create(Object.getPrototypeOf(this),Object.getOwnPropertyDescriptors(this));return e&&(t.schema=e),t.items=t.items.map(a=>K(a)||W(a)?a.clone(e):a),this.range&&(t.range=this.range.slice()),t}addIn(e,t){if(Rt(e))this.add(t);else{let[a,...r]=e,s=this.get(a,!0);if(V(s))s.addIn(r,t);else if(s===void 0&&this.schema)this.set(a,ma(this.schema,r,t));else throw Error(`Expected YAML collection at ${a}. Remaining path: ${r}`)}}deleteIn(e){let[t,...a]=e;if(a.length===0)return this.delete(t);let r=this.get(t,!0);if(V(r))return r.deleteIn(a);throw Error(`Expected YAML collection at ${t}. Remaining path: ${a}`)}getIn(e,t){let[a,...r]=e,s=this.get(a,!0);return r.length===0?!t&&j(s)?s.value:s:V(s)?s.getIn(r,t):void 0}hasAllNullValues(e){return this.items.every(t=>{if(!W(t))return!1;let a=t.value;return a==null||e&&j(a)&&a.value==null&&!a.commentBefore&&!a.comment&&!a.tag})}hasIn(e){let[t,...a]=e;if(a.length===0)return this.has(t);let r=this.get(t,!0);return V(r)?r.hasIn(a):!1}setIn(e,t){let[a,...r]=e;if(r.length===0)this.set(a,t);else{let s=this.get(a,!0);if(V(s))s.setIn(r,t);else if(s===void 0&&this.schema)this.set(a,ma(this.schema,r,t));else throw Error(`Expected YAML collection at ${a}. Remaining path: ${r}`)}}},tc=e=>e.replace(/^(?!$)(?: $)?/gm,"#");function Ee(e,t){return/^\n+$/.test(e)?e.substring(1):t?e.replace(/^(?! *$)/gm,t):e}var Me=(e,t,a)=>e.endsWith(`
`)?Ee(a,t):a.includes(`
`)?`
`+Ee(a,t):(e.endsWith(" ")?"":" ")+a,Bn="flow",ac="block",rc="quoted";function fa(e,t,a="flow",{indentAtStart:r,lineWidth:s=80,minContentWidth:n=20,onFold:i,onOverflow:o}={}){if(!s||s<0)return e;s<n&&(n=0);let l=Math.max(1+n,1+s-t.length);if(e.length<=l)return e;let c=[],p={},u=s-t.length;typeof r=="number"&&(r>s-Math.max(2,n)?c.push(0):u=s-r);let h,m,b=!1,g=-1,y=-1,w=-1;a==="block"&&(g=In(e,g,t.length),g!==-1&&(u=g+l));for(let x;x=e[g+=1];){if(a==="quoted"&&x==="\\"){switch(y=g,e[g+1]){case"x":g+=3;break;case"u":g+=5;break;case"U":g+=9;break;default:g+=1}w=g}if(x===`
`)a==="block"&&(g=In(e,g,t.length)),u=g+t.length+l,h=void 0;else{if(x===" "&&m&&m!==" "&&m!==`
`&&m!=="	"){let f=e[g+1];f&&f!==" "&&f!==`
`&&f!=="	"&&(h=g)}if(g>=u)if(h)c.push(h),u=h+l,h=void 0;else if(a==="quoted"){for(;m===" "||m==="	";)m=x,x=e[g+=1],b=!0;let f=g>w+1?g-2:y-1;if(p[f])return e;c.push(f),p[f]=!0,u=f+l,h=void 0}else b=!0}m=x}if(b&&o&&o(),c.length===0)return e;i&&i();let v=e.slice(0,c[0]);for(let x=0;x<c.length;++x){let f=c[x],$=c[x+1]||e.length;f===0?v=`
${t}${e.slice(0,$)}`:(a==="quoted"&&p[f]&&(v+=`${e[f]}\\`),v+=`
${t}${e.slice(f+1,$)}`)}return v}function In(e,t,a){let r=t,s=t+1,n=e[s];for(;n===" "||n==="	";)if(t<s+a)n=e[++t];else{do n=e[++t];while(n&&n!==`
`);r=t,s=t+1,n=e[s]}return r}var ga=(e,t)=>({indentAtStart:t?e.indent.length:e.indentAtStart,lineWidth:e.options.lineWidth,minContentWidth:e.options.minContentWidth}),ba=e=>/^(%|---|\.\.\.)/m.test(e);function sc(e,t,a){if(!t||t<0)return!1;let r=t-a,s=e.length;if(s<=r)return!1;for(let n=0,i=0;n<s;++n)if(e[n]===`
`){if(n-i>r)return!0;if(i=n+1,s-i<=r)return!1}return!0}function jt(e,t){let a=JSON.stringify(e);if(t.options.doubleQuotedAsJSON)return a;let{implicitKey:r}=t,s=t.options.doubleQuotedMinMultiLineLength,n=t.indent||(ba(e)?"  ":""),i="",o=0;for(let l=0,c=a[l];c;c=a[++l])if(c===" "&&a[l+1]==="\\"&&a[l+2]==="n"&&(i+=a.slice(o,l)+"\\ ",l+=1,o=l,c="\\"),c==="\\")switch(a[l+1]){case"u":{i+=a.slice(o,l);let p=a.substr(l+2,4);switch(p){case"0000":i+="\\0";break;case"0007":i+="\\a";break;case"000b":i+="\\v";break;case"001b":i+="\\e";break;case"0085":i+="\\N";break;case"00a0":i+="\\_";break;case"2028":i+="\\L";break;case"2029":i+="\\P";break;default:p.substr(0,2)==="00"?i+="\\x"+p.substr(2):i+=a.substr(l,6)}l+=5,o=l+1}break;case"n":if(r||a[l+2]==='"'||a.length<s)l+=1;else{for(i+=a.slice(o,l)+`

`;a[l+2]==="\\"&&a[l+3]==="n"&&a[l+4]!=='"';)i+=`
`,l+=2;i+=n,a[l+2]===" "&&(i+="\\"),l+=1,o=l+1}break;default:l+=1}return i=o?i+a.slice(o):a,r?i:fa(i,n,rc,ga(t,!1))}function Er(e,t){if(t.options.singleQuote===!1||t.implicitKey&&e.includes(`
`)||/[ \t]\n|\n[ \t]/.test(e))return jt(e,t);let a=t.indent||(ba(e)?"  ":""),r="'"+e.replace(/'/g,"''").replace(/\n+/g,`$&
${a}`)+"'";return t.implicitKey?r:fa(r,a,Bn,ga(t,!1))}function ot(e,t){let{singleQuote:a}=t.options,r;if(a===!1)r=jt;else{let s=e.includes('"'),n=e.includes("'");r=s&&!n?Er:n&&!s?jt:a?Er:jt}return r(e,t)}var Dr;try{Dr=RegExp(`(^|(?<!
))
+(?!
|$)`,"g")}catch{Dr=/\n+(?!\n|$)/g}function ya({comment:e,type:t,value:a},r,s,n){let{blockQuote:i,commentString:o,lineWidth:l}=r.options;if(!i||/\n[\t ]+$/.test(a))return ot(a,r);let c=r.indent||(r.forceBlockIndent||ba(a)?"  ":""),p=i==="literal"?!0:i==="folded"||t===O.BLOCK_FOLDED?!1:t===O.BLOCK_LITERAL||!sc(a,l,c.length);if(!a)return p?`|
`:`>
`;let u,h;for(h=a.length;h>0;--h){let f=a[h-1];if(f!==`
`&&f!=="	"&&f!==" ")break}let m=a.substring(h),b=m.indexOf(`
`);b===-1?u="-":a===m||b!==m.length-1?(u="+",n&&n()):u="",m&&=(a=a.slice(0,-m.length),m[m.length-1]===`
`&&(m=m.slice(0,-1)),m.replace(Dr,`$&${c}`));let g=!1,y,w=-1;for(y=0;y<a.length;++y){let f=a[y];if(f===" ")g=!0;else if(f===`
`)w=y;else break}let v=a.substring(0,w<y?w+1:y);v&&=(a=a.substring(v.length),v.replace(/\n+/g,`$&${c}`));let x=(g?c?"2":"1":"")+u;if(e&&(x+=" "+o(e.replace(/ ?[\r\n]+/g," ")),s&&s()),!p){let f=a.replace(/\n+/g,`
$&`).replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g,"$1$2").replace(/\n+/g,`$&${c}`),$=!1,k=ga(r,!0);i!=="folded"&&t!==O.BLOCK_FOLDED&&(k.onOverflow=()=>{$=!0});let S=fa(`${v}${f}${m}`,c,ac,k);if(!$)return`>${x}
${c}${S}`}return a=a.replace(/\n+/g,`$&${c}`),`|${x}
${c}${v}${a}${m}`}function nc(e,t,a,r){let{type:s,value:n}=e,{actualString:i,implicitKey:o,indent:l,indentStep:c,inFlow:p}=t;if(o&&n.includes(`
`)||p&&/[[\]{},]/.test(n))return ot(n,t);if(/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(n))return o||p||!n.includes(`
`)?ot(n,t):ya(e,t,a,r);if(!o&&!p&&s!==O.PLAIN&&n.includes(`
`))return ya(e,t,a,r);if(ba(n)){if(l==="")return t.forceBlockIndent=!0,ya(e,t,a,r);if(o&&l===c)return ot(n,t)}let u=n.replace(/\n+/g,`$&
${l}`);if(i){let h=g=>g.default&&g.tag!=="tag:yaml.org,2002:str"&&g.test?.test(u),{compat:m,tags:b}=t.doc.schema;if(b.some(h)||m?.some(h))return ot(n,t)}return o?u:fa(u,l,Bn,ga(t,!1))}function Ar(e,t,a,r){let{implicitKey:s,inFlow:n}=t,i=typeof e.value=="string"?e:Object.assign({},e,{value:String(e.value)}),{type:o}=e;o!==O.QUOTE_DOUBLE&&/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(i.value)&&(o=O.QUOTE_DOUBLE);let l=p=>{switch(p){case O.BLOCK_FOLDED:case O.BLOCK_LITERAL:return s||n?ot(i.value,t):ya(i,t,a,r);case O.QUOTE_DOUBLE:return jt(i.value,t);case O.QUOTE_SINGLE:return Er(i.value,t);case O.PLAIN:return nc(i,t,a,r);default:return null}},c=l(o);if(c===null){let{defaultKeyType:p,defaultStringType:u}=t.options,h=s&&p||u;if(c=l(h),c===null)throw Error(`Unsupported default string type ${h}`)}return c}function Ln(e,t){let a=Object.assign({blockQuote:!0,commentString:tc,defaultKeyType:null,defaultStringType:"PLAIN",directives:null,doubleQuotedAsJSON:!1,doubleQuotedMinMultiLineLength:40,falseStr:"false",flowCollectionPadding:!0,indentSeq:!0,lineWidth:80,minContentWidth:20,nullStr:"null",simpleKeys:!1,singleQuote:null,trailingComma:!1,trueStr:"true",verifyAliasOrder:!0},e.schema.toStringOptions,t),r;switch(a.collectionStyle){case"block":r=!1;break;case"flow":r=!0;break;default:r=null}return{anchors:new Set,doc:e,flowCollectionPadding:a.flowCollectionPadding?" ":"",indent:"",indentStep:typeof a.indent=="number"?" ".repeat(a.indent):"  ",inFlow:r,options:a}}function ic(e,t){if(t.tag){let s=e.filter(n=>n.tag===t.tag);if(s.length>0)return s.find(n=>n.format===t.format)??s[0]}let a,r;if(j(t)){r=t.value;let s=e.filter(n=>n.identify?.(r));if(s.length>1){let n=s.filter(i=>i.test);n.length>0&&(s=n)}a=s.find(n=>n.format===t.format)??s.find(n=>!n.format)}else r=t,a=e.find(s=>s.nodeClass&&r instanceof s.nodeClass);if(!a){let s=r?.constructor?.name??(r===null?"null":typeof r);throw Error(`Tag not resolved for ${s} value`)}return a}function oc(e,t,{anchors:a,doc:r}){if(!r.directives)return"";let s=[],n=(j(e)||V(e))&&e.anchor;n&&Fn(n)&&(a.add(n),s.push(`&${n}`));let i=e.tag??(t.default?null:t.tag);return i&&s.push(r.directives.tagString(i)),s.join(" ")}function lt(e,t,a,r){if(W(e))return e.toString(t,a,r);if(at(e)){if(t.doc.directives)return e.toString(t);if(t.resolvedAliases?.has(e))throw TypeError("Cannot stringify circular structure without alias nodes");t.resolvedAliases?t.resolvedAliases.add(e):t.resolvedAliases=new Set([e]),e=e.resolve(t.doc)}let s,n=K(e)?e:t.doc.createNode(e,{onTagObj:l=>s=l});s??=ic(t.doc.schema.tags,n);let i=oc(n,s,t);i.length>0&&(t.indentAtStart=(t.indentAtStart??0)+i.length+1);let o=typeof s.stringify=="function"?s.stringify(n,t,a,r):j(n)?Ar(n,t,a,r):n.toString(t,a,r);return i?j(n)||o[0]==="{"||o[0]==="["?`${i} ${o}`:`${i}
${t.indent}${o}`:o}function lc({key:e,value:t},a,r,s){let{allNullValues:n,doc:i,indent:o,indentStep:l,options:{commentString:c,indentSeq:p,simpleKeys:u}}=a,h=K(e)&&e.comment||null;if(u){if(h)throw Error("With simple keys, key nodes cannot have comments");if(V(e)||!K(e)&&typeof e=="object")throw Error("With simple keys, collection cannot be used as a key value")}let m=!u&&(!e||h&&t==null&&!a.inFlow||V(e)||(j(e)?e.type===O.BLOCK_FOLDED||e.type===O.BLOCK_LITERAL:typeof e=="object"));a=Object.assign({},a,{allNullValues:!1,implicitKey:!m&&(u||!n),indent:o+l});let b=!1,g=!1,y=lt(e,a,()=>b=!0,()=>g=!0);if(!m&&!a.inFlow&&y.length>1024){if(u)throw Error("With simple keys, single line scalar must not span more than 1024 characters");m=!0}if(a.inFlow){if(n||t==null)return b&&r&&r(),y===""?"?":m?`? ${y}`:y}else if(n&&!u||t==null&&m)return y=`? ${y}`,h&&!b?y+=Me(y,a.indent,c(h)):g&&s&&s(),y;b&&(h=null),m?(h&&(y+=Me(y,a.indent,c(h))),y=`? ${y}
${o}:`):(y=`${y}:`,h&&(y+=Me(y,a.indent,c(h))));let w,v,x;K(t)?(w=!!t.spaceBefore,v=t.commentBefore,x=t.comment):(w=!1,v=null,x=null,t&&typeof t=="object"&&(t=i.createNode(t))),a.implicitKey=!1,!m&&!h&&j(t)&&(a.indentAtStart=y.length+1),g=!1,!p&&l.length>=2&&!a.inFlow&&!m&&Bt(t)&&!t.flow&&!t.tag&&!t.anchor&&(a.indent=a.indent.substring(2));let f=!1,$=lt(t,a,()=>f=!0,()=>g=!0),k=" ";if(h||w||v){if(k=w?`
`:"",v){let S=c(v);k+=`
${Ee(S,a.indent)}`}$===""&&!a.inFlow?k===`
`&&x&&(k=`

`):k+=`
${a.indent}`}else if(!m&&V(t)){let S=$[0],E=$.indexOf(`
`),_=E!==-1,I=a.inFlow??t.flow??t.items.length===0;if(_||!I){let T=!1;if(_&&(S==="&"||S==="!")){let C=$.indexOf(" ");S==="&"&&C!==-1&&C<E&&$[C+1]==="!"&&(C=$.indexOf(" ",C+1)),(C===-1||E<C)&&(T=!0)}T||(k=`
${a.indent}`)}}else($===""||$[0]===`
`)&&(k="");return y+=k+$,a.inFlow?f&&r&&r():x&&!f?y+=Me(y,a.indent,c(x)):g&&s&&s(),y}function hp(e,t){}var va="<<",De={identify:e=>e===va||typeof e=="symbol"&&e.description===va,default:"key",tag:"tag:yaml.org,2002:merge",test:/^<<$/,resolve:()=>Object.assign(new O(Symbol(va)),{addToJSMap:Rn}),stringify:()=>va},cc=(e,t)=>(De.identify(t)||j(t)&&(!t.type||t.type===O.PLAIN)&&De.identify(t.value))&&e?.doc.schema.tags.some(a=>a.tag===De.tag&&a.default);function Rn(e,t,a){let r=jn(e,a);if(Bt(r))for(let s of r.items)Cr(e,t,s);else if(Array.isArray(r))for(let s of r)Cr(e,t,s);else Cr(e,t,r)}function Cr(e,t,a){let r=jn(e,a);if(!Nt(r))throw Error("Merge sources must be maps or map aliases");let s=r.toJSON(null,e,Map);for(let[n,i]of s)t instanceof Map?t.has(n)||t.set(n,i):t instanceof Set?t.add(n):Object.prototype.hasOwnProperty.call(t,n)||Object.defineProperty(t,n,{value:i,writable:!0,enumerable:!0,configurable:!0});return t}function jn(e,t){return e&&at(t)?t.resolve(e.doc,e):t}function qn(e,t,{key:a,value:r}){if(K(a)&&a.addToJSMap)a.addToJSMap(e,t,r);else if(cc(e,a))Rn(e,t,r);else{let s=ie(a,"",e);if(t instanceof Map)t.set(s,ie(r,s,e));else if(t instanceof Set)t.add(s);else{let n=dc(a,s,e),i=ie(r,n,e);n in t?Object.defineProperty(t,n,{value:i,writable:!0,enumerable:!0,configurable:!0}):t[n]=i}}return t}function dc(e,t,a){if(t===null)return"";if(typeof t!="object")return String(t);if(K(e)&&a?.doc){let r=Ln(a.doc,{});r.anchors=new Set;for(let n of a.anchors.keys())r.anchors.add(n.anchor);r.inFlow=!0,r.inStringifyKey=!0;let s=e.toString(r);if(!a.mapKeyWarned){let n=JSON.stringify(s);n.length>40&&(n=n.substring(0,36)+'..."'),a.doc.options.logLevel,`${n}`,a.mapKeyWarned=!0}return s}return JSON.stringify(t)}function Fr(e,t,a){return new te(Lt(e,void 0,a),Lt(t,void 0,a))}var te=class ao{constructor(t,a=null){Object.defineProperty(this,ne,{value:An}),this.key=t,this.value=a}clone(t){let{key:a,value:r}=this;return K(a)&&(a=a.clone(t)),K(r)&&(r=r.clone(t)),new ao(a,r)}toJSON(t,a){return qn(a,a?.mapAsMap?new Map:{},this)}toString(t,a,r){return t?.doc?lc(this,t,a,r):JSON.stringify(this)}};function zn(e,t,a){return(t.inFlow??e.flow?uc:pc)(e,t,a)}function pc({comment:e,items:t},a,{blockItemPrefix:r,flowChars:s,itemIndent:n,onChompKeep:i,onComment:o}){let{indent:l,options:{commentString:c}}=a,p=Object.assign({},a,{indent:n,type:null}),u=!1,h=[];for(let b=0;b<t.length;++b){let g=t[b],y=null;if(K(g))!u&&g.spaceBefore&&h.push(""),xa(a,h,g.commentBefore,u),g.comment&&(y=g.comment);else if(W(g)){let v=K(g.key)?g.key:null;v&&(!u&&v.spaceBefore&&h.push(""),xa(a,h,v.commentBefore,u))}u=!1;let w=lt(g,p,()=>y=null,()=>u=!0);y&&(w+=Me(w,n,c(y))),u&&y&&(u=!1),h.push(r+w)}let m;if(h.length===0)m=s.start+s.end;else{m=h[0];for(let b=1;b<h.length;++b){let g=h[b];m+=g?`
${l}${g}`:`
`}}return e?(m+=`
`+Ee(c(e),l),o&&o()):u&&i&&i(),m}function uc({items:e},t,{flowChars:a,itemIndent:r}){let{indent:s,indentStep:n,flowCollectionPadding:i,options:{commentString:o}}=t;r+=n;let l=Object.assign({},t,{indent:r,inFlow:!0,type:null}),c=!1,p=0,u=[];for(let b=0;b<e.length;++b){let g=e[b],y=null;if(K(g))g.spaceBefore&&u.push(""),xa(t,u,g.commentBefore,!1),g.comment&&(y=g.comment);else if(W(g)){let v=K(g.key)?g.key:null;v&&(v.spaceBefore&&u.push(""),xa(t,u,v.commentBefore,!1),v.comment&&(c=!0));let x=K(g.value)?g.value:null;x?(x.comment&&(y=x.comment),x.commentBefore&&(c=!0)):g.value==null&&v?.comment&&(y=v.comment)}y&&(c=!0);let w=lt(g,l,()=>y=null);c||=u.length>p||w.includes(`
`),b<e.length-1?w+=",":t.options.trailingComma&&(t.options.lineWidth>0&&(c||=u.reduce((v,x)=>v+x.length+2,2)+(w.length+2)>t.options.lineWidth),c&&(w+=",")),y&&(w+=Me(w,r,o(y))),u.push(w),p=u.length}let{start:h,end:m}=a;if(u.length===0)return h+m;if(!c){let b=u.reduce((g,y)=>g+y.length+2,2);c=t.options.lineWidth>0&&b>t.options.lineWidth}if(c){let b=h;for(let g of u)b+=g?`
${n}${s}${g}`:`
`;return`${b}
${s}${m}`}return`${h}${i}${u.join(" ")}${i}${m}`}function xa({indent:e,options:{commentString:t}},a,r,s){if(r&&s&&(r=r.replace(/^\n+/,"")),r){let n=Ee(t(r),e);a.push(n.trimStart())}}function He(e,t){let a=j(t)?t.value:t;for(let r of e)if(W(r)&&(r.key===t||r.key===a||j(r.key)&&r.key.value===a))return r}var oe=class extends Nn{static get tagName(){return"tag:yaml.org,2002:map"}constructor(e){super(Fe,e),this.items=[]}static from(e,t,a){let{keepUndefined:r,replacer:s}=a,n=new this(e),i=(o,l)=>{if(typeof s=="function")l=s.call(t,o,l);else if(Array.isArray(s)&&!s.includes(o))return;(l!==void 0||r)&&n.items.push(Fr(o,l,a))};if(t instanceof Map)for(let[o,l]of t)i(o,l);else if(t&&typeof t=="object")for(let o of Object.keys(t))i(o,t[o]);return typeof e.sortMapEntries=="function"&&n.items.sort(e.sortMapEntries),n}add(e,t){let a;a=W(e)?e:!e||typeof e!="object"||!("key"in e)?new te(e,e?.value):new te(e.key,e.value);let r=He(this.items,a.key),s=this.schema?.sortMapEntries;if(r){if(!t)throw Error(`Key ${a.key} already set`);j(r.value)&&_n(a.value)?r.value.value=a.value:r.value=a.value}else if(s){let n=this.items.findIndex(i=>s(a,i)<0);n===-1?this.items.push(a):this.items.splice(n,0,a)}else this.items.push(a)}delete(e){let t=He(this.items,e);return t?this.items.splice(this.items.indexOf(t),1).length>0:!1}get(e,t){let a=He(this.items,e)?.value;return(!t&&j(a)?a.value:a)??void 0}has(e){return!!He(this.items,e)}set(e,t){this.add(new te(e,t),!0)}toJSON(e,t,a){let r=a?new a:t?.mapAsMap?new Map:{};t?.onCreate&&t.onCreate(r);for(let s of this.items)qn(t,r,s);return r}toString(e,t,a){if(!e)return JSON.stringify(this);for(let r of this.items)if(!W(r))throw Error(`Map items must all be pairs; found ${JSON.stringify(r)} instead`);return!e.allNullValues&&this.hasAllNullValues(!1)&&(e=Object.assign({},e,{allNullValues:!0})),zn(this,e,{blockItemPrefix:"",flowChars:{start:"{",end:"}"},itemIndent:e.indent||"",onChompKeep:a,onComment:t})}},ct={collection:"map",default:!0,nodeClass:oe,tag:"tag:yaml.org,2002:map",resolve(e,t){return Nt(e)||t("Expected a mapping for this tag"),e},createNode:(e,t,a)=>oe.from(e,t,a)},We=class extends Nn{static get tagName(){return"tag:yaml.org,2002:seq"}constructor(e){super(tt,e),this.items=[]}add(e){this.items.push(e)}delete(e){let t=wa(e);return typeof t=="number"&&this.items.splice(t,1).length>0}get(e,t){let a=wa(e);if(typeof a!="number")return;let r=this.items[a];return!t&&j(r)?r.value:r}has(e){let t=wa(e);return typeof t=="number"&&t<this.items.length}set(e,t){let a=wa(e);if(typeof a!="number")throw Error(`Expected a valid index, not ${e}.`);let r=this.items[a];j(r)&&_n(t)?r.value=t:this.items[a]=t}toJSON(e,t){let a=[];t?.onCreate&&t.onCreate(a);let r=0;for(let s of this.items)a.push(ie(s,String(r++),t));return a}toString(e,t,a){return e?zn(this,e,{blockItemPrefix:"- ",flowChars:{start:"[",end:"]"},itemIndent:(e.indent||"")+"  ",onChompKeep:a,onComment:t}):JSON.stringify(this)}static from(e,t,a){let{replacer:r}=a,s=new this(e);if(t&&Symbol.iterator in Object(t)){let n=0;for(let i of t){if(typeof r=="function"){let o=t instanceof Set?i:String(n++);i=r.call(t,o,i)}s.items.push(Lt(i,void 0,a))}}return s}};function wa(e){let t=j(e)?e.value:e;return t&&typeof t=="string"&&(t=Number(t)),typeof t=="number"&&Number.isInteger(t)&&t>=0?t:null}var dt={collection:"seq",default:!0,nodeClass:We,tag:"tag:yaml.org,2002:seq",resolve(e,t){return Bt(e)||t("Expected a sequence for this tag"),e},createNode:(e,t,a)=>We.from(e,t,a)},$a={identify:e=>typeof e=="string",default:!0,tag:"tag:yaml.org,2002:str",resolve:e=>e,stringify(e,t,a,r){return t=Object.assign({actualString:!0},t),Ar(e,t,a,r)}},ka={identify:e=>e==null,createNode:()=>new O(null),default:!0,tag:"tag:yaml.org,2002:null",test:/^(?:~|[Nn]ull|NULL)?$/,resolve:()=>new O(null),stringify:({source:e},t)=>typeof e=="string"&&ka.test.test(e)?e:t.options.nullStr},Tr={identify:e=>typeof e=="boolean",default:!0,tag:"tag:yaml.org,2002:bool",test:/^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,resolve:e=>new O(e[0]==="t"||e[0]==="T"),stringify({source:e,value:t},a){return e&&Tr.test.test(e)&&t===(e[0]==="t"||e[0]==="T")?e:t?a.options.trueStr:a.options.falseStr}};function fe({format:e,minFractionDigits:t,tag:a,value:r}){if(typeof r=="bigint")return String(r);let s=typeof r=="number"?r:Number(r);if(!isFinite(s))return isNaN(s)?".nan":s<0?"-.inf":".inf";let n=Object.is(r,-0)?"-0":JSON.stringify(r);if(!e&&t&&(!a||a==="tag:yaml.org,2002:float")&&/^-?\d/.test(n)&&!n.includes("e")){let i=n.indexOf(".");i<0&&(i=n.length,n+=".");let o=t-(n.length-i-1);for(;o-- >0;)n+="0"}return n}var Pn={identify:e=>typeof e=="number",default:!0,tag:"tag:yaml.org,2002:float",test:/^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,resolve:e=>e.slice(-3).toLowerCase()==="nan"?NaN:e[0]==="-"?-1/0:1/0,stringify:fe},Un={identify:e=>typeof e=="number",default:!0,tag:"tag:yaml.org,2002:float",format:"EXP",test:/^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,resolve:e=>parseFloat(e),stringify(e){let t=Number(e.value);return isFinite(t)?t.toExponential():fe(e)}},Mn={identify:e=>typeof e=="number",default:!0,tag:"tag:yaml.org,2002:float",test:/^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,resolve(e){let t=new O(parseFloat(e)),a=e.indexOf(".");return a!==-1&&e[e.length-1]==="0"&&(t.minFractionDigits=e.length-a-1),t},stringify:fe},Sa=e=>typeof e=="bigint"||Number.isInteger(e),Or=(e,t,a,{intAsBigInt:r})=>r?BigInt(e):parseInt(e.substring(t),a);function Hn(e,t,a){let{value:r}=e;return Sa(r)&&r>=0?a+r.toString(t):fe(e)}var Wn={identify:e=>Sa(e)&&e>=0,default:!0,tag:"tag:yaml.org,2002:int",format:"OCT",test:/^0o[0-7]+$/,resolve:(e,t,a)=>Or(e,2,8,a),stringify:e=>Hn(e,8,"0o")},Vn={identify:Sa,default:!0,tag:"tag:yaml.org,2002:int",test:/^[-+]?[0-9]+$/,resolve:(e,t,a)=>Or(e,0,10,a),stringify:fe},Kn={identify:e=>Sa(e)&&e>=0,default:!0,tag:"tag:yaml.org,2002:int",format:"HEX",test:/^0x[0-9a-fA-F]+$/,resolve:(e,t,a)=>Or(e,2,16,a),stringify:e=>Hn(e,16,"0x")},hc=[ct,dt,$a,ka,Tr,Wn,Vn,Kn,Pn,Un,Mn];function Zn(e){return typeof e=="bigint"||Number.isInteger(e)}var Ea=({value:e})=>JSON.stringify(e),mc=[{identify:e=>typeof e=="string",default:!0,tag:"tag:yaml.org,2002:str",resolve:e=>e,stringify:Ea},{identify:e=>e==null,createNode:()=>new O(null),default:!0,tag:"tag:yaml.org,2002:null",test:/^null$/,resolve:()=>null,stringify:Ea},{identify:e=>typeof e=="boolean",default:!0,tag:"tag:yaml.org,2002:bool",test:/^true$|^false$/,resolve:e=>e==="true",stringify:Ea},{identify:Zn,default:!0,tag:"tag:yaml.org,2002:int",test:/^-?(?:0|[1-9][0-9]*)$/,resolve:(e,t,{intAsBigInt:a})=>a?BigInt(e):parseInt(e,10),stringify:({value:e})=>Zn(e)?e.toString():JSON.stringify(e)},{identify:e=>typeof e=="number",default:!0,tag:"tag:yaml.org,2002:float",test:/^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,resolve:e=>parseFloat(e),stringify:Ea}],fc=[ct,dt].concat(mc,{default:!0,tag:"",test:/^/,resolve(e,t){return t(`Unresolved plain scalar ${JSON.stringify(e)}`),e}}),_r={identify:e=>e instanceof Uint8Array,default:!1,tag:"tag:yaml.org,2002:binary",resolve(e,t){if(typeof atob=="function"){let a=atob(e.replace(/[\n\r]/g,"")),r=new Uint8Array(a.length);for(let s=0;s<a.length;++s)r[s]=a.charCodeAt(s);return r}return t("This environment does not support reading binary tags; either Buffer or atob is required"),e},stringify({comment:e,type:t,value:a},r,s,n){if(!a)return"";let i=a,o;if(typeof btoa=="function"){let l="";for(let c=0;c<i.length;++c)l+=String.fromCharCode(i[c]);o=btoa(l)}else throw Error("This environment does not support writing binary tags; either Buffer or btoa is required");if(t??=O.BLOCK_LITERAL,t!==O.QUOTE_DOUBLE){let l=Math.max(r.options.lineWidth-r.indent.length,r.options.minContentWidth),c=Math.ceil(o.length/l),p=Array(c);for(let u=0,h=0;u<c;++u,h+=l)p[u]=o.substr(h,l);o=p.join(t===O.BLOCK_LITERAL?`
`:" ")}return Ar({comment:e,type:t,value:o},r,s,n)}};function Jn(e,t){if(Bt(e))for(let a=0;a<e.items.length;++a){let r=e.items[a];if(!W(r)){if(Nt(r)){r.items.length>1&&t("Each pair must have its own sequence indicator");let s=r.items[0]||new te(new O(null));if(r.commentBefore&&(s.key.commentBefore=s.key.commentBefore?`${r.commentBefore}
${s.key.commentBefore}`:r.commentBefore),r.comment){let n=s.value??s.key;n.comment=n.comment?`${r.comment}
${n.comment}`:r.comment}r=s}e.items[a]=W(r)?r:new te(r)}}else t("Expected a sequence for this tag");return e}function Gn(e,t,a){let{replacer:r}=a,s=new We(e);s.tag="tag:yaml.org,2002:pairs";let n=0;if(t&&Symbol.iterator in Object(t))for(let i of t){typeof r=="function"&&(i=r.call(t,String(n++),i));let o,l;if(Array.isArray(i))if(i.length===2)o=i[0],l=i[1];else throw TypeError(`Expected [key, value] tuple: ${i}`);else if(i&&i instanceof Object){let c=Object.keys(i);if(c.length===1)o=c[0],l=i[o];else throw TypeError(`Expected tuple with one key, not ${c.length} keys`)}else o=i;s.items.push(Fr(o,l,a))}return s}var Nr={collection:"seq",default:!1,tag:"tag:yaml.org,2002:pairs",resolve:Jn,createNode:Gn},Da=class ro extends We{constructor(){super(),this.add=oe.prototype.add.bind(this),this.delete=oe.prototype.delete.bind(this),this.get=oe.prototype.get.bind(this),this.has=oe.prototype.has.bind(this),this.set=oe.prototype.set.bind(this),this.tag=ro.tag}toJSON(t,a){if(!a)return super.toJSON(t);let r=new Map;a?.onCreate&&a.onCreate(r);for(let s of this.items){let n,i;if(W(s)?(n=ie(s.key,"",a),i=ie(s.value,n,a)):n=ie(s,"",a),r.has(n))throw Error("Ordered maps must not include duplicate keys");r.set(n,i)}return r}static from(t,a,r){let s=Gn(t,a,r),n=new this;return n.items=s.items,n}};Da.tag="tag:yaml.org,2002:omap";var Br={collection:"seq",identify:e=>e instanceof Map,nodeClass:Da,default:!1,tag:"tag:yaml.org,2002:omap",resolve(e,t){let a=Jn(e,t),r=[];for(let{key:s}of a.items)j(s)&&(r.includes(s.value)?t(`Ordered maps must not include duplicate keys: ${s.value}`):r.push(s.value));return Object.assign(new Da,a)},createNode:(e,t,a)=>Da.from(e,t,a)};function Yn({value:e,source:t},a){return t&&(e?Xn:Qn).test.test(t)?t:e?a.options.trueStr:a.options.falseStr}var Xn={identify:e=>e===!0,default:!0,tag:"tag:yaml.org,2002:bool",test:/^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,resolve:()=>new O(!0),stringify:Yn},Qn={identify:e=>e===!1,default:!0,tag:"tag:yaml.org,2002:bool",test:/^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,resolve:()=>new O(!1),stringify:Yn},gc={identify:e=>typeof e=="number",default:!0,tag:"tag:yaml.org,2002:float",test:/^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,resolve:e=>e.slice(-3).toLowerCase()==="nan"?NaN:e[0]==="-"?-1/0:1/0,stringify:fe},bc={identify:e=>typeof e=="number",default:!0,tag:"tag:yaml.org,2002:float",format:"EXP",test:/^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,resolve:e=>parseFloat(e.replace(/_/g,"")),stringify(e){let t=Number(e.value);return isFinite(t)?t.toExponential():fe(e)}},yc={identify:e=>typeof e=="number",default:!0,tag:"tag:yaml.org,2002:float",test:/^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,resolve(e){let t=new O(parseFloat(e.replace(/_/g,""))),a=e.indexOf(".");if(a!==-1){let r=e.substring(a+1).replace(/_/g,"");r[r.length-1]==="0"&&(t.minFractionDigits=r.length)}return t},stringify:fe},qt=e=>typeof e=="bigint"||Number.isInteger(e);function Aa(e,t,a,{intAsBigInt:r}){let s=e[0];if((s==="-"||s==="+")&&(t+=1),e=e.substring(t).replace(/_/g,""),r){switch(a){case 2:e=`0b${e}`;break;case 8:e=`0o${e}`;break;case 16:e=`0x${e}`}let i=BigInt(e);return s==="-"?BigInt(-1)*i:i}let n=parseInt(e,a);return s==="-"?-1*n:n}function Ir(e,t,a){let{value:r}=e;if(qt(r)){let s=r.toString(t);return r<0?"-"+a+s.substr(1):a+s}return fe(e)}var vc={identify:qt,default:!0,tag:"tag:yaml.org,2002:int",format:"BIN",test:/^[-+]?0b[0-1_]+$/,resolve:(e,t,a)=>Aa(e,2,2,a),stringify:e=>Ir(e,2,"0b")},xc={identify:qt,default:!0,tag:"tag:yaml.org,2002:int",format:"OCT",test:/^[-+]?0[0-7_]+$/,resolve:(e,t,a)=>Aa(e,1,8,a),stringify:e=>Ir(e,8,"0")},wc={identify:qt,default:!0,tag:"tag:yaml.org,2002:int",test:/^[-+]?[0-9][0-9_]*$/,resolve:(e,t,a)=>Aa(e,0,10,a),stringify:fe},$c={identify:qt,default:!0,tag:"tag:yaml.org,2002:int",format:"HEX",test:/^[-+]?0x[0-9a-fA-F_]+$/,resolve:(e,t,a)=>Aa(e,2,16,a),stringify:e=>Ir(e,16,"0x")},Ca=class so extends oe{constructor(t){super(t),this.tag=so.tag}add(t){let a;a=W(t)?t:t&&typeof t=="object"&&"key"in t&&"value"in t&&t.value===null?new te(t.key,null):new te(t,null),He(this.items,a.key)||this.items.push(a)}get(t,a){let r=He(this.items,t);return!a&&W(r)?j(r.key)?r.key.value:r.key:r}set(t,a){if(typeof a!="boolean")throw Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof a}`);let r=He(this.items,t);r&&!a?this.items.splice(this.items.indexOf(r),1):!r&&a&&this.items.push(new te(t))}toJSON(t,a){return super.toJSON(t,a,Set)}toString(t,a,r){if(!t)return JSON.stringify(this);if(this.hasAllNullValues(!0))return super.toString(Object.assign({},t,{allNullValues:!0}),a,r);throw Error("Set items must all have null values")}static from(t,a,r){let{replacer:s}=r,n=new this(t);if(a&&Symbol.iterator in Object(a))for(let i of a)typeof s=="function"&&(i=s.call(a,i,i)),n.items.push(Fr(i,null,r));return n}};Ca.tag="tag:yaml.org,2002:set";var Lr={collection:"map",identify:e=>e instanceof Set,nodeClass:Ca,default:!1,tag:"tag:yaml.org,2002:set",createNode:(e,t,a)=>Ca.from(e,t,a),resolve(e,t){if(Nt(e)){if(e.hasAllNullValues(!0))return Object.assign(new Ca,e);t("Set items must all have null values")}else t("Expected a mapping for this tag");return e}};function Rr(e,t){let a=e[0],r=a==="-"||a==="+"?e.substring(1):e,s=i=>t?BigInt(i):Number(i),n=r.replace(/_/g,"").split(":").reduce((i,o)=>i*s(60)+s(o),s(0));return a==="-"?s(-1)*n:n}function ei(e){let{value:t}=e,a=i=>i;if(typeof t=="bigint")a=i=>BigInt(i);else if(isNaN(t)||!isFinite(t))return fe(e);let r="";t<0&&(r="-",t*=a(-1));let s=a(60),n=[t%s];return t<60?n.unshift(0):(t=(t-n[0])/s,n.unshift(t%s),t>=60&&(t=(t-n[0])/s,n.unshift(t))),r+n.map(i=>String(i).padStart(2,"0")).join(":").replace(/000000\d*$/,"")}var ti={identify:e=>typeof e=="bigint"||Number.isInteger(e),default:!0,tag:"tag:yaml.org,2002:int",format:"TIME",test:/^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,resolve:(e,t,{intAsBigInt:a})=>Rr(e,a),stringify:ei},ai={identify:e=>typeof e=="number",default:!0,tag:"tag:yaml.org,2002:float",format:"TIME",test:/^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,resolve:e=>Rr(e,!1),stringify:ei},Fa={identify:e=>e instanceof Date,default:!0,tag:"tag:yaml.org,2002:timestamp",test:RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),resolve(e){let t=e.match(Fa.test);if(!t)throw Error("!!timestamp expects a date, starting with yyyy-mm-dd");let[,a,r,s,n,i,o]=t.map(Number),l=t[7]?Number((t[7]+"00").substr(1,3)):0,c=Date.UTC(a,r-1,s,n||0,i||0,o||0,l),p=t[8];if(p&&p!=="Z"){let u=Rr(p,!1);Math.abs(u)<30&&(u*=60),c-=6e4*u}return new Date(c)},stringify:({value:e})=>e?.toISOString().replace(/(T00:00:00)?\.000Z$/,"")??""},ri=[ct,dt,$a,ka,Xn,Qn,vc,xc,wc,$c,gc,bc,yc,_r,De,Br,Nr,Lr,ti,ai,Fa],si=new Map([["core",hc],["failsafe",[ct,dt,$a]],["json",fc],["yaml11",ri],["yaml-1.1",ri]]),ni={binary:_r,bool:Tr,float:Mn,floatExp:Un,floatNaN:Pn,floatTime:ai,int:Vn,intHex:Kn,intOct:Wn,intTime:ti,map:ct,merge:De,null:ka,omap:Br,pairs:Nr,seq:dt,set:Lr,timestamp:Fa},kc={"tag:yaml.org,2002:binary":_r,"tag:yaml.org,2002:merge":De,"tag:yaml.org,2002:omap":Br,"tag:yaml.org,2002:pairs":Nr,"tag:yaml.org,2002:set":Lr,"tag:yaml.org,2002:timestamp":Fa};function jr(e,t,a){let r=si.get(t);if(r&&!e)return a&&!r.includes(De)?r.concat(De):r.slice();let s=r;if(!s)if(Array.isArray(e))s=[];else{let n=Array.from(si.keys()).filter(i=>i!=="yaml11").map(i=>JSON.stringify(i)).join(", ");throw Error(`Unknown schema "${t}"; use one of ${n} or define customTags array`)}if(Array.isArray(e))for(let n of e)s=s.concat(n);else typeof e=="function"&&(s=e(s.slice()));return a&&(s=s.concat(De)),s.reduce((n,i)=>{let o=typeof i=="string"?ni[i]:i;if(!o){let l=JSON.stringify(i),c=Object.keys(ni).map(p=>JSON.stringify(p)).join(", ");throw Error(`Unknown custom tag ${l}; use one of ${c}`)}return n.includes(o)||n.push(o),n},[])}var Sc=(e,t)=>e.key<t.key?-1:+(e.key>t.key),Ec=class no{constructor({compat:t,customTags:a,merge:r,resolveKnownTags:s,schema:n,sortMapEntries:i,toStringDefaults:o}){this.compat=Array.isArray(t)?jr(t,"compat"):t?jr(null,t):null,this.name=typeof n=="string"&&n||"core",this.knownTags=s?kc:{},this.tags=jr(a,this.name,r),this.toStringOptions=o??null,Object.defineProperty(this,Fe,{value:ct}),Object.defineProperty(this,ve,{value:$a}),Object.defineProperty(this,tt,{value:dt}),this.sortMapEntries=typeof i=="function"?i:i===!0?Sc:null}clone(){let t=Object.create(no.prototype,Object.getOwnPropertyDescriptors(this));return t.tags=this.tags.slice(),t}};function Dc(e,t){let a=[],r=t.directives===!0;if(t.directives!==!1&&e.directives){let l=e.directives.toString(e);l?(a.push(l),r=!0):e.directives.docStart&&(r=!0)}r&&a.push("---");let s=Ln(e,t),{commentString:n}=s.options;if(e.commentBefore){a.length!==1&&a.unshift("");let l=n(e.commentBefore);a.unshift(Ee(l,""))}let i=!1,o=null;if(e.contents){if(K(e.contents)){if(e.contents.spaceBefore&&r&&a.push(""),e.contents.commentBefore){let p=n(e.contents.commentBefore);a.push(Ee(p,""))}s.forceBlockIndent=!!e.comment,o=e.contents.comment}let l=o?void 0:()=>i=!0,c=lt(e.contents,s,()=>o=null,l);o&&(c+=Me(c,"",n(o))),(c[0]==="|"||c[0]===">")&&a[a.length-1]==="---"?a[a.length-1]=`--- ${c}`:a.push(c)}else a.push(lt(e.contents,s));if(e.directives?.docEnd)if(e.comment){let l=n(e.comment);l.includes(`
`)?(a.push("..."),a.push(Ee(l,""))):a.push(`... ${l}`)}else a.push("...");else{let l=e.comment;l&&i&&(l=l.replace(/^\n+/,"")),l&&((!i||o)&&a[a.length-1]!==""&&a.push(""),a.push(Ee(n(l),"")))}return a.join(`
`)+`
`}var ii=class io{constructor(t,a,r){this.commentBefore=null,this.comment=null,this.errors=[],this.warnings=[],Object.defineProperty(this,ne,{value:$r});let s=null;typeof a=="function"||Array.isArray(a)?s=a:r===void 0&&a&&(r=a,a=void 0);let n=Object.assign({intAsBigInt:!1,keepSourceTokens:!1,logLevel:"warn",prettyErrors:!0,strict:!0,stringKeys:!1,uniqueKeys:!0,version:"1.2"},r);this.options=n;let{version:i}=n;r?._directives?(this.directives=r._directives.atDocument(),this.directives.yaml.explicit&&(i=this.directives.yaml.version)):this.directives=new nt({version:i}),this.setSchema(i,r),this.contents=t===void 0?null:this.createNode(t,s,r)}clone(){let t=Object.create(io.prototype,{[ne]:{value:$r}});return t.commentBefore=this.commentBefore,t.comment=this.comment,t.errors=this.errors.slice(),t.warnings=this.warnings.slice(),t.options=Object.assign({},this.options),this.directives&&(t.directives=this.directives.clone()),t.schema=this.schema.clone(),t.contents=K(this.contents)?this.contents.clone(t.schema):this.contents,this.range&&(t.range=this.range.slice()),t}add(t){pt(this.contents)&&this.contents.add(t)}addIn(t,a){pt(this.contents)&&this.contents.addIn(t,a)}createAlias(t,a){if(!t.anchor){let r=Tn(this);t.anchor=!a||r.has(a)?On(a||"a",r):a}return new Sr(t.anchor)}createNode(t,a,r){let s;if(typeof a=="function")t=a.call({"":t},"",t),s=a;else if(Array.isArray(a)){let y=a.filter(w=>typeof w=="number"||w instanceof String||w instanceof Number).map(String);y.length>0&&(a=a.concat(y)),s=a}else r===void 0&&a&&(r=a,a=void 0);let{aliasDuplicateObjects:n,anchorPrefix:i,flow:o,keepUndefined:l,onTagObj:c,tag:p}=r??{},{onAnchor:u,setAnchors:h,sourceObjects:m}=Xl(this,i||"a"),b={aliasDuplicateObjects:n??!0,keepUndefined:l??!1,onAnchor:u,onTagObj:c,replacer:s,schema:this.schema,sourceObjects:m},g=Lt(t,p,b);return o&&V(g)&&(g.flow=!0),h(),g}createPair(t,a,r={}){return new te(this.createNode(t,null,r),this.createNode(a,null,r))}delete(t){return pt(this.contents)?this.contents.delete(t):!1}deleteIn(t){return Rt(t)?this.contents!=null&&(this.contents=null,!0):pt(this.contents)?this.contents.deleteIn(t):!1}get(t,a){return V(this.contents)?this.contents.get(t,a):void 0}getIn(t,a){return Rt(t)?!a&&j(this.contents)?this.contents.value:this.contents:V(this.contents)?this.contents.getIn(t,a):void 0}has(t){return V(this.contents)?this.contents.has(t):!1}hasIn(t){return Rt(t)?this.contents!==void 0:V(this.contents)?this.contents.hasIn(t):!1}set(t,a){this.contents==null?this.contents=ma(this.schema,[t],a):pt(this.contents)&&this.contents.set(t,a)}setIn(t,a){Rt(t)?this.contents=a:this.contents==null?this.contents=ma(this.schema,Array.from(t),a):pt(this.contents)&&this.contents.setIn(t,a)}setSchema(t,a={}){typeof t=="number"&&(t=String(t));let r;switch(t){case"1.1":this.directives?this.directives.yaml.version="1.1":this.directives=new nt({version:"1.1"}),r={resolveKnownTags:!1,schema:"yaml-1.1"};break;case"1.2":case"next":this.directives?this.directives.yaml.version=t:this.directives=new nt({version:t}),r={resolveKnownTags:!0,schema:"core"};break;case null:this.directives&&delete this.directives,r=null;break;default:{let s=JSON.stringify(t);throw Error(`Expected '1.1', '1.2' or null as first argument, but found: ${s}`)}}if(a.schema instanceof Object)this.schema=a.schema;else if(r)this.schema=new Ec(Object.assign(r,a));else throw Error("With a null YAML version, the { schema: Schema } option is required")}toJS({json:t,jsonArg:a,mapAsMap:r,maxAliasCount:s,onAnchor:n,reviver:i}={}){let o={anchors:new Map,doc:this,keep:!t,mapAsMap:r===!0,mapKeyWarned:!1,maxAliasCount:typeof s=="number"?s:100},l=ie(this.contents,a??"",o);if(typeof n=="function")for(let{count:c,res:p}of o.anchors.values())n(p,c);return typeof i=="function"?it(i,{"":l},"",l):l}toJSON(t,a){return this.toJS({json:!0,jsonArg:t,mapAsMap:!1,onAnchor:a})}toString(t={}){if(this.errors.length>0)throw Error("Document with errors cannot be stringified");if("indent"in t&&(!Number.isInteger(t.indent)||Number(t.indent)<=0)){let a=JSON.stringify(t.indent);throw Error(`"indent" option must be a positive integer, not ${a}`)}return Dc(this,t)}};function pt(e){if(V(e))return!0;throw Error("Expected a YAML collection as document contents")}var oi=class extends Error{constructor(e,t,a,r){super(),this.name=e,this.code=a,this.message=r,this.pos=t}},zt=class extends oi{constructor(e,t,a){super("YAMLParseError",e,t,a)}},Ac=class extends oi{constructor(e,t,a){super("YAMLWarning",e,t,a)}},li=(e,t)=>a=>{if(a.pos[0]===-1)return;a.linePos=a.pos.map(o=>t.linePos(o));let{line:r,col:s}=a.linePos[0];a.message+=` at line ${r}, column ${s}`;let n=s-1,i=e.substring(t.lineStarts[r-1],t.lineStarts[r]).replace(/[\n\r]+$/,"");if(n>=60&&i.length>80){let o=Math.min(n-39,i.length-79);i="\u2026"+i.substring(o),n-=o-1}if(i.length>80&&(i=i.substring(0,79)+"\u2026"),r>1&&/^ *$/.test(i.substring(0,n))){let o=e.substring(t.lineStarts[r-2],t.lineStarts[r-1]);o.length>80&&(o=o.substring(0,79)+`\u2026
`),i=o+i}if(/[^ ]/.test(i)){let o=1,l=a.linePos[1];l?.line===r&&l.col>s&&(o=Math.max(1,Math.min(l.col-s,80-n)));let c=" ".repeat(n)+"^".repeat(o);a.message+=`:

${i}
${c}
`}};function ut(e,{flow:t,indicator:a,next:r,offset:s,onError:n,parentIndent:i,startOnNewline:o}){let l=!1,c=o,p=o,u="",h="",m=!1,b=!1,g=null,y=null,w=null,v=null,x=null,f=null,$=null;for(let E of e)switch(b&&=(E.type!=="space"&&E.type!=="newline"&&E.type!=="comma"&&n(E.offset,"MISSING_CHAR","Tags and anchors must be separated from the next token by white space"),!1),g&&=(c&&E.type!=="comment"&&E.type!=="newline"&&n(g,"TAB_AS_INDENT","Tabs are not allowed as indentation"),null),E.type){case"space":!t&&(a!=="doc-start"||r?.type!=="flow-collection")&&E.source.includes("	")&&(g=E),p=!0;break;case"comment":{p||n(E,"MISSING_CHAR","Comments must be separated from other tokens by white space characters");let _=E.source.substring(1)||" ";u?u+=h+_:u=_,h="",c=!1;break}case"newline":c?u?u+=E.source:(!f||a!=="seq-item-ind")&&(l=!0):h+=E.source,c=!0,m=!0,(y||w)&&(v=E),p=!0;break;case"anchor":y&&n(E,"MULTIPLE_ANCHORS","A node can have at most one anchor"),E.source.endsWith(":")&&n(E.offset+E.source.length-1,"BAD_ALIAS","Anchor ending in : is ambiguous",!0),y=E,$??=E.offset,c=!1,p=!1,b=!0;break;case"tag":w&&n(E,"MULTIPLE_TAGS","A node can have at most one tag"),w=E,$??=E.offset,c=!1,p=!1,b=!0;break;case a:(y||w)&&n(E,"BAD_PROP_ORDER",`Anchors and tags must be after the ${E.source} indicator`),f&&n(E,"UNEXPECTED_TOKEN",`Unexpected ${E.source} in ${t??"collection"}`),f=E,c=a==="seq-item-ind"||a==="explicit-key-ind",p=!1;break;case"comma":if(t){x&&n(E,"UNEXPECTED_TOKEN",`Unexpected , in ${t}`),x=E,c=!1,p=!1;break}default:n(E,"UNEXPECTED_TOKEN",`Unexpected ${E.type} token`),c=!1,p=!1}let k=e[e.length-1],S=k?k.offset+k.source.length:s;return b&&r&&r.type!=="space"&&r.type!=="newline"&&r.type!=="comma"&&(r.type!=="scalar"||r.source!=="")&&n(r.offset,"MISSING_CHAR","Tags and anchors must be separated from the next token by white space"),g&&(c&&g.indent<=i||r?.type==="block-map"||r?.type==="block-seq")&&n(g,"TAB_AS_INDENT","Tabs are not allowed as indentation"),{comma:x,found:f,spaceBefore:l,comment:u,hasNewline:m,anchor:y,tag:w,newlineAfterProp:v,end:S,start:$??S}}function Pt(e){if(!e)return null;switch(e.type){case"alias":case"scalar":case"double-quoted-scalar":case"single-quoted-scalar":if(e.source.includes(`
`))return!0;if(e.end){for(let t of e.end)if(t.type==="newline")return!0}return!1;case"flow-collection":for(let t of e.items){for(let a of t.start)if(a.type==="newline")return!0;if(t.sep){for(let a of t.sep)if(a.type==="newline")return!0}if(Pt(t.key)||Pt(t.value))return!0}return!1;default:return!0}}function qr(e,t,a){if(t?.type==="flow-collection"){let r=t.end[0];r.indent===e&&(r.source==="]"||r.source==="}")&&Pt(t)&&a(r,"BAD_INDENT","Flow end indicator should be more indented than parent",!0)}}function ci(e,t,a){let{uniqueKeys:r}=e.options;if(r===!1)return!1;let s=typeof r=="function"?r:(n,i)=>n===i||j(n)&&j(i)&&n.value===i.value;return t.some(n=>s(n.key,a))}var di="All mapping items must start at the same column";function Cc({composeNode:e,composeEmptyNode:t},a,r,s,n){let i=new(n?.nodeClass??oe)(a.schema);a.atRoot&&=!1;let o=r.offset,l=null;for(let c of r.items){let{start:p,key:u,sep:h,value:m}=c,b=ut(p,{indicator:"explicit-key-ind",next:u??h?.[0],offset:o,onError:s,parentIndent:r.indent,startOnNewline:!0}),g=!b.found;if(g){if(u&&(u.type==="block-seq"?s(o,"BLOCK_AS_IMPLICIT_KEY","A block sequence may not be used as an implicit map key"):"indent"in u&&u.indent!==r.indent&&s(o,"BAD_INDENT",di)),!b.anchor&&!b.tag&&!h){l=b.end,b.comment&&(i.comment?i.comment+=`
`+b.comment:i.comment=b.comment);continue}(b.newlineAfterProp||Pt(u))&&s(u??p[p.length-1],"MULTILINE_IMPLICIT_KEY","Implicit keys need to be on a single line")}else b.found?.indent!==r.indent&&s(o,"BAD_INDENT",di);a.atKey=!0;let y=b.end,w=u?e(a,u,b,s):t(a,y,p,null,b,s);a.schema.compat&&qr(r.indent,u,s),a.atKey=!1,ci(a,i.items,w)&&s(y,"DUPLICATE_KEY","Map keys must be unique");let v=ut(h??[],{indicator:"map-value-ind",next:m,offset:w.range[2],onError:s,parentIndent:r.indent,startOnNewline:!u||u.type==="block-scalar"});if(o=v.end,v.found){g&&(m?.type==="block-map"&&!v.hasNewline&&s(o,"BLOCK_AS_IMPLICIT_KEY","Nested mappings are not allowed in compact mappings"),a.options.strict&&b.start<v.found.offset-1024&&s(w.range,"KEY_OVER_1024_CHARS","The : indicator must be at most 1024 chars after the start of an implicit block mapping key"));let x=m?e(a,m,v,s):t(a,o,h,null,v,s);a.schema.compat&&qr(r.indent,m,s),o=x.range[2];let f=new te(w,x);a.options.keepSourceTokens&&(f.srcToken=c),i.items.push(f)}else{g&&s(w.range,"MISSING_CHAR","Implicit map keys need to be followed by map values"),v.comment&&(w.comment?w.comment+=`
`+v.comment:w.comment=v.comment);let x=new te(w);a.options.keepSourceTokens&&(x.srcToken=c),i.items.push(x)}}return l&&l<o&&s(l,"IMPOSSIBLE","Map comment with trailing content"),i.range=[r.offset,o,l??o],i}function Fc({composeNode:e,composeEmptyNode:t},a,r,s,n){let i=new(n?.nodeClass??We)(a.schema);a.atRoot&&=!1,a.atKey&&=!1;let o=r.offset,l=null;for(let{start:c,value:p}of r.items){let u=ut(c,{indicator:"seq-item-ind",next:p,offset:o,onError:s,parentIndent:r.indent,startOnNewline:!0});if(!u.found)if(u.anchor||u.tag||p)p?.type==="block-seq"?s(u.end,"BAD_INDENT","All sequence items must start at the same column"):s(o,"MISSING_CHAR","Sequence item without - indicator");else{l=u.end,u.comment&&(i.comment=u.comment);continue}let h=p?e(a,p,u,s):t(a,u.end,c,null,u,s);a.schema.compat&&qr(r.indent,p,s),o=h.range[2],i.items.push(h)}return i.range=[r.offset,o,l??o],i}function Ut(e,t,a,r){let s="";if(e){let n=!1,i="";for(let o of e){let{source:l,type:c}=o;switch(c){case"space":n=!0;break;case"comment":{a&&!n&&r(o,"MISSING_CHAR","Comments must be separated from other tokens by white space characters");let p=l.substring(1)||" ";s?s+=i+p:s=p,i="";break}case"newline":s&&(i+=l),n=!0;break;default:r(o,"UNEXPECTED_TOKEN",`Unexpected ${c} at node end`)}t+=l.length}}return{comment:s,offset:t}}var zr="Block collections are not allowed within flow collections",Pr=e=>e&&(e.type==="block-map"||e.type==="block-seq");function Tc({composeNode:e,composeEmptyNode:t},a,r,s,n){let i=r.start.source==="{",o=i?"flow map":"flow sequence",l=new(n?.nodeClass??(i?oe:We))(a.schema);l.flow=!0;let c=a.atRoot;c&&(a.atRoot=!1),a.atKey&&=!1;let p=r.offset+r.start.source.length;for(let g=0;g<r.items.length;++g){let y=r.items[g],{start:w,key:v,sep:x,value:f}=y,$=ut(w,{flow:o,indicator:"explicit-key-ind",next:v??x?.[0],offset:p,onError:s,parentIndent:r.indent,startOnNewline:!1});if(!$.found){if(!$.anchor&&!$.tag&&!x&&!f){g===0&&$.comma?s($.comma,"UNEXPECTED_TOKEN",`Unexpected , in ${o}`):g<r.items.length-1&&s($.start,"UNEXPECTED_TOKEN",`Unexpected empty item in ${o}`),$.comment&&(l.comment?l.comment+=`
`+$.comment:l.comment=$.comment),p=$.end;continue}!i&&a.options.strict&&Pt(v)&&s(v,"MULTILINE_IMPLICIT_KEY","Implicit keys of flow sequence pairs need to be on a single line")}if(g===0)$.comma&&s($.comma,"UNEXPECTED_TOKEN",`Unexpected , in ${o}`);else if($.comma||s($.start,"MISSING_CHAR",`Missing , between ${o} items`),$.comment){let k="";e:for(let S of w)switch(S.type){case"comma":case"space":break;case"comment":k=S.source.substring(1);break e;default:break e}if(k){let S=l.items[l.items.length-1];W(S)&&(S=S.value??S.key),S.comment?S.comment+=`
`+k:S.comment=k,$.comment=$.comment.substring(k.length+1)}}if(!i&&!x&&!$.found){let k=f?e(a,f,$,s):t(a,$.end,x,null,$,s);l.items.push(k),p=k.range[2],Pr(f)&&s(k.range,"BLOCK_IN_FLOW",zr)}else{a.atKey=!0;let k=$.end,S=v?e(a,v,$,s):t(a,k,w,null,$,s);Pr(v)&&s(S.range,"BLOCK_IN_FLOW",zr),a.atKey=!1;let E=ut(x??[],{flow:o,indicator:"map-value-ind",next:f,offset:S.range[2],onError:s,parentIndent:r.indent,startOnNewline:!1});if(E.found){if(!i&&!$.found&&a.options.strict){if(x)for(let T of x){if(T===E.found)break;if(T.type==="newline"){s(T,"MULTILINE_IMPLICIT_KEY","Implicit keys of flow sequence pairs need to be on a single line");break}}$.start<E.found.offset-1024&&s(E.found,"KEY_OVER_1024_CHARS","The : indicator must be at most 1024 chars after the start of an implicit flow sequence key")}}else f&&("source"in f&&f.source?.[0]===":"?s(f,"MISSING_CHAR",`Missing space after : in ${o}`):s(E.start,"MISSING_CHAR",`Missing , or : between ${o} items`));let _=f?e(a,f,E,s):E.found?t(a,E.end,x,null,E,s):null;_?Pr(f)&&s(_.range,"BLOCK_IN_FLOW",zr):E.comment&&(S.comment?S.comment+=`
`+E.comment:S.comment=E.comment);let I=new te(S,_);if(a.options.keepSourceTokens&&(I.srcToken=y),i){let T=l;ci(a,T.items,S)&&s(k,"DUPLICATE_KEY","Map keys must be unique"),T.items.push(I)}else{let T=new oe(a.schema);T.flow=!0,T.items.push(I);let C=(_??S).range;T.range=[S.range[0],C[1],C[2]],l.items.push(T)}p=_?_.range[2]:E.end}}let u=i?"}":"]",[h,...m]=r.end,b=p;if(h?.source===u)b=h.offset+h.source.length;else{let g=o[0].toUpperCase()+o.substring(1),y=c?`${g} must end with a ${u}`:`${g} in block collection must be sufficiently indented and end with a ${u}`;s(p,c?"MISSING_CHAR":"BAD_INDENT",y),h&&h.source.length!==1&&m.unshift(h)}if(m.length>0){let g=Ut(m,b,a.options.strict,s);g.comment&&(l.comment?l.comment+=`
`+g.comment:l.comment=g.comment),l.range=[r.offset,b,g.offset]}else l.range=[r.offset,b,b];return l}function Ur(e,t,a,r,s,n){let i=a.type==="block-map"?Cc(e,t,a,r,n):a.type==="block-seq"?Fc(e,t,a,r,n):Tc(e,t,a,r,n),o=i.constructor;return s==="!"||s===o.tagName?(i.tag=o.tagName,i):(s&&(i.tag=s),i)}function Oc(e,t,a,r,s){let n=r.tag,i=n?t.directives.tagName(n.source,h=>s(n,"TAG_RESOLVE_FAILED",h)):null;if(a.type==="block-seq"){let{anchor:h,newlineAfterProp:m}=r,b=h&&n?h.offset>n.offset?h:n:h??n;b&&(!m||m.offset<b.offset)&&s(b,"MISSING_CHAR","Missing newline after block sequence props")}let o=a.type==="block-map"?"map":a.type==="block-seq"?"seq":a.start.source==="{"?"map":"seq";if(!n||!i||i==="!"||i===oe.tagName&&o==="map"||i===We.tagName&&o==="seq")return Ur(e,t,a,s,i);let l=t.schema.tags.find(h=>h.tag===i&&h.collection===o);if(!l){let h=t.schema.knownTags[i];if(h?.collection===o)t.schema.tags.push(Object.assign({},h,{default:!1})),l=h;else return h?s(n,"BAD_COLLECTION_TYPE",`${h.tag} used for ${o} collection, but expects ${h.collection??"scalar"}`,!0):s(n,"TAG_RESOLVE_FAILED",`Unresolved tag: ${i}`,!0),Ur(e,t,a,s,i)}let c=Ur(e,t,a,s,i,l),p=l.resolve?.(c,h=>s(n,"TAG_RESOLVE_FAILED",h),t.options)??c,u=K(p)?p:new O(p);return u.range=c.range,u.tag=i,l?.format&&(u.format=l.format),u}function _c(e,t,a){let r=t.offset,s=Nc(t,e.options.strict,a);if(!s)return{value:"",type:null,comment:"",range:[r,r,r]};let n=s.mode===">"?O.BLOCK_FOLDED:O.BLOCK_LITERAL,i=t.source?Bc(t.source):[],o=i.length;for(let g=i.length-1;g>=0;--g){let y=i[g][1];if(y===""||y==="\r")o=g;else break}if(o===0){let g=s.chomp==="+"&&i.length>0?`
`.repeat(Math.max(1,i.length-1)):"",y=r+s.length;return t.source&&(y+=t.source.length),{value:g,type:n,comment:s.comment,range:[r,y,y]}}let l=t.indent+s.indent,c=t.offset+s.length,p=0;for(let g=0;g<o;++g){let[y,w]=i[g];if(w===""||w==="\r")s.indent===0&&y.length>l&&(l=y.length);else{y.length<l&&a(c+y.length,"MISSING_CHAR","Block scalars with more-indented leading empty lines must use an explicit indentation indicator"),s.indent===0&&(l=y.length),p=g,l===0&&!e.atRoot&&a(c,"BAD_INDENT","Block scalar values in collections must be indented");break}c+=y.length+w.length+1}for(let g=i.length-1;g>=o;--g)i[g][0].length>l&&(o=g+1);let u="",h="",m=!1;for(let g=0;g<p;++g)u+=i[g][0].slice(l)+`
`;for(let g=p;g<o;++g){let[y,w]=i[g];c+=y.length+w.length+1;let v=w[w.length-1]==="\r";if(v&&(w=w.slice(0,-1)),w&&y.length<l){let x=`Block scalar lines must not be less indented than their ${s.indent?"explicit indentation indicator":"first line"}`;a(c-w.length-(v?2:1),"BAD_INDENT",x),y=""}n===O.BLOCK_LITERAL?(u+=h+y.slice(l)+w,h=`
`):y.length>l||w[0]==="	"?(h===" "?h=`
`:!m&&h===`
`&&(h=`

`),u+=h+y.slice(l)+w,h=`
`,m=!0):w===""?h===`
`?u+=`
`:h=`
`:(u+=h+w,h=" ",m=!1)}switch(s.chomp){case"-":break;case"+":for(let g=o;g<i.length;++g)u+=`
`+i[g][0].slice(l);u[u.length-1]!==`
`&&(u+=`
`);break;default:u+=`
`}let b=r+s.length+t.source.length;return{value:u,type:n,comment:s.comment,range:[r,b,b]}}function Nc({offset:e,props:t},a,r){if(t[0].type!=="block-scalar-header")return r(t[0],"IMPOSSIBLE","Block scalar header not found"),null;let{source:s}=t[0],n=s[0],i=0,o="",l=-1;for(let h=1;h<s.length;++h){let m=s[h];if(!o&&(m==="-"||m==="+"))o=m;else{let b=Number(m);!i&&b?i=b:l===-1&&(l=e+h)}}l!==-1&&r(l,"UNEXPECTED_TOKEN",`Block scalar header includes extra characters: ${s}`);let c=!1,p="",u=s.length;for(let h=1;h<t.length;++h){let m=t[h];switch(m.type){case"space":c=!0;case"newline":u+=m.source.length;break;case"comment":a&&!c&&r(m,"MISSING_CHAR","Comments must be separated from other tokens by white space characters"),u+=m.source.length,p=m.source.substring(1);break;case"error":r(m,"UNEXPECTED_TOKEN",m.message),u+=m.source.length;break;default:{r(m,"UNEXPECTED_TOKEN",`Unexpected token in block scalar header: ${m.type}`);let b=m.source;b&&typeof b=="string"&&(u+=b.length)}}}return{mode:n,indent:i,chomp:o,comment:p,length:u}}function Bc(e){let t=e.split(/\n( *)/),a=t[0],r=a.match(/^( *)/),s=[r?.[1]?[r[1],a.slice(r[1].length)]:["",a]];for(let n=1;n<t.length;n+=2)s.push([t[n],t[n+1]]);return s}function Ic(e,t,a){let{offset:r,type:s,source:n,end:i}=e,o,l,c=(h,m,b)=>a(r+h,m,b);switch(s){case"scalar":o=O.PLAIN,l=Lc(n,c);break;case"single-quoted-scalar":o=O.QUOTE_SINGLE,l=Rc(n,c);break;case"double-quoted-scalar":o=O.QUOTE_DOUBLE,l=jc(n,c);break;default:return a(e,"UNEXPECTED_TOKEN",`Expected a flow scalar value, but found: ${s}`),{value:"",type:null,comment:"",range:[r,r+n.length,r+n.length]}}let p=r+n.length,u=Ut(i,p,t,a);return{value:l,type:o,comment:u.comment,range:[r,p,u.offset]}}function Lc(e,t){let a="";switch(e[0]){case"	":a="a tab character";break;case",":a="flow indicator character ,";break;case"%":a="directive indicator character %";break;case"|":case">":a=`block scalar indicator ${e[0]}`;break;case"@":case"`":a=`reserved character ${e[0]}`}return a&&t(0,"BAD_SCALAR_START",`Plain value cannot start with ${a}`),pi(e)}function Rc(e,t){return(e[e.length-1]!=="'"||e.length===1)&&t(e.length,"MISSING_CHAR","Missing closing 'quote"),pi(e.slice(1,-1)).replace(/''/g,"'")}function pi(e){let t=/(.*?)\r?\n/sy,a=t.exec(e);if(!a)return e;let r,s;try{r=RegExp("(?<![ 	])[ 	]+$"),s=RegExp("^[ 	]+|(?<![ 	])[ 	]+$","g")}catch{r=/[ \t]+$/,s=/^[ \t]+|[ \t]+$/g}let n=a[1].replace(r,""),i=" ",o=t.lastIndex;for(;a=t.exec(e);){let c=a[1].replace(s,"");c===""?i===`
`?n+=i:i=`
`:(n+=i+c,i=" "),o=t.lastIndex}let l=/[ \t]*(.*)/sy;return l.lastIndex=o,a=l.exec(e),n+i+(a?.[1]??"")}function jc(e,t){let a="";for(let r=1;r<e.length-1;++r){let s=e[r];if(s!=="\r"||e[r+1]!==`
`)if(s===`
`){let{fold:n,offset:i}=qc(e,r);a+=n,r=i}else if(s==="\\"){let n=e[++r],i=zc[n];if(i)a+=i;else if(n===`
`)for(n=e[r+1];n===" "||n==="	";)n=e[++r+1];else if(n==="\r"&&e[r+1]===`
`)for(n=e[++r+1];n===" "||n==="	";)n=e[++r+1];else if(n==="x"||n==="u"||n==="U"){let o=n==="x"?2:n==="u"?4:8;a+=Pc(e,r+1,o,t),r+=o}else{let o=e.substr(r-1,2);t(r-1,"BAD_DQ_ESCAPE",`Invalid escape sequence ${o}`),a+=o}}else if(s===" "||s==="	"){let n=r,i=e[r+1];for(;i===" "||i==="	";)i=e[++r+1];i!==`
`&&(i!=="\r"||e[r+2]!==`
`)&&(a+=r>n?e.slice(n,r+1):s)}else a+=s}return(e[e.length-1]!=='"'||e.length===1)&&t(e.length,"MISSING_CHAR",'Missing closing "quote'),a}function qc(e,t){let a="",r=e[t+1];for(;(r===" "||r==="	"||r===`
`||r==="\r")&&(r!=="\r"||e[t+2]===`
`);)r===`
`&&(a+=`
`),t+=1,r=e[t+1];return a||=" ",{fold:a,offset:t}}var zc={0:"\0",a:"\x07",b:"\b",e:"\x1B",f:"\f",n:`
`,r:"\r",t:"	",v:"\v",N:"\x85",_:"\xA0",L:"\u2028",P:"\u2029"," ":" ",'"':'"',"/":"/","\\":"\\","	":"	"};function Pc(e,t,a,r){let s=e.substr(t,a),n=s.length===a&&/^[0-9a-fA-F]+$/.test(s)?parseInt(s,16):NaN;try{return String.fromCodePoint(n)}catch{let i=e.substr(t-2,a+2);return r(t-2,"BAD_DQ_ESCAPE",`Invalid escape sequence ${i}`),i}}function ui(e,t,a,r){let{value:s,type:n,comment:i,range:o}=t.type==="block-scalar"?_c(e,t,r):Ic(t,e.options.strict,r),l=a?e.directives.tagName(a.source,u=>r(a,"TAG_RESOLVE_FAILED",u)):null,c;c=e.options.stringKeys&&e.atKey?e.schema[ve]:l?Uc(e.schema,s,l,a,r):t.type==="scalar"?Mc(e,s,t,r):e.schema[ve];let p;try{let u=c.resolve(s,h=>r(a??t,"TAG_RESOLVE_FAILED",h),e.options);p=j(u)?u:new O(u)}catch(u){let h=u instanceof Error?u.message:String(u);r(a??t,"TAG_RESOLVE_FAILED",h),p=new O(s)}return p.range=o,p.source=s,n&&(p.type=n),l&&(p.tag=l),c.format&&(p.format=c.format),i&&(p.comment=i),p}function Uc(e,t,a,r,s){if(a==="!")return e[ve];let n=[];for(let o of e.tags)if(!o.collection&&o.tag===a)if(o.default&&o.test)n.push(o);else return o;for(let o of n)if(o.test?.test(t))return o;let i=e.knownTags[a];return i&&!i.collection?(e.tags.push(Object.assign({},i,{default:!1,test:void 0})),i):(s(r,"TAG_RESOLVE_FAILED",`Unresolved tag: ${a}`,a!=="tag:yaml.org,2002:str"),e[ve])}function Mc({atKey:e,directives:t,schema:a},r,s,n){let i=a.tags.find(o=>(o.default===!0||e&&o.default==="key")&&o.test?.test(r))||a[ve];if(a.compat){let o=a.compat.find(l=>l.default&&l.test?.test(r))??a[ve];i.tag!==o.tag&&n(s,"TAG_RESOLVE_FAILED",`Value may be parsed as either ${t.tagString(i.tag)} or ${t.tagString(o.tag)}`,!0)}return i}function Hc(e,t,a){if(t){a??=t.length;for(let r=a-1;r>=0;--r){let s=t[r];switch(s.type){case"space":case"comment":case"newline":e-=s.source.length;continue}for(s=t[++r];s?.type==="space";)e+=s.source.length,s=t[++r];break}}return e}var Wc={composeNode:hi,composeEmptyNode:Mr};function hi(e,t,a,r){let s=e.atKey,{spaceBefore:n,comment:i,anchor:o,tag:l}=a,c,p=!0;switch(t.type){case"alias":c=Vc(e,t,r),(o||l)&&r(t,"ALIAS_PROPS","An alias node must not specify any properties");break;case"scalar":case"single-quoted-scalar":case"double-quoted-scalar":case"block-scalar":c=ui(e,t,l,r),o&&(c.anchor=o.source.substring(1));break;case"block-map":case"block-seq":case"flow-collection":try{c=Oc(Wc,e,t,a,r),o&&(c.anchor=o.source.substring(1))}catch(u){r(t,"RESOURCE_EXHAUSTION",u instanceof Error?u.message:String(u))}break;default:r(t,"UNEXPECTED_TOKEN",t.type==="error"?t.message:`Unsupported token (type: ${t.type})`),p=!1}return c??=Mr(e,t.offset,void 0,null,a,r),o&&c.anchor===""&&r(o,"BAD_ALIAS","Anchor cannot be an empty string"),s&&e.options.stringKeys&&(!j(c)||typeof c.value!="string"||c.tag&&c.tag!=="tag:yaml.org,2002:str")&&r(l??t,"NON_STRING_KEY","With stringKeys, all keys must be strings"),n&&(c.spaceBefore=!0),i&&(t.type==="scalar"&&t.source===""?c.comment=i:c.commentBefore=i),e.options.keepSourceTokens&&p&&(c.srcToken=t),c}function Mr(e,t,a,r,{spaceBefore:s,comment:n,anchor:i,tag:o,end:l},c){let p=ui(e,{type:"scalar",offset:Hc(t,a,r),indent:-1,source:""},o,c);return i&&(p.anchor=i.source.substring(1),p.anchor===""&&c(i,"BAD_ALIAS","Anchor cannot be an empty string")),s&&(p.spaceBefore=!0),n&&(p.comment=n,p.range[2]=l),p}function Vc({options:e},{offset:t,source:a,end:r},s){let n=new Sr(a.substring(1));n.source===""&&s(t,"BAD_ALIAS","Alias cannot be an empty string"),n.source.endsWith(":")&&s(t+a.length-1,"BAD_ALIAS","Alias ending in : is ambiguous",!0);let i=t+a.length,o=Ut(r,i,e.strict,s);return n.range=[t,i,o.offset],o.comment&&(n.comment=o.comment),n}function Kc(e,t,{offset:a,start:r,value:s,end:n},i){let o=new ii(void 0,Object.assign({_directives:t},e)),l={atKey:!1,atRoot:!0,directives:o.directives,options:o.options,schema:o.schema},c=ut(r,{indicator:"doc-start",next:s??n?.[0],offset:a,onError:i,parentIndent:0,startOnNewline:!0});c.found&&(o.directives.docStart=!0,s&&(s.type==="block-map"||s.type==="block-seq")&&!c.hasNewline&&i(c.end,"MISSING_CHAR","Block collection cannot start on same line with directives-end marker")),o.contents=s?hi(l,s,c,i):Mr(l,c.end,r,null,c,i);let p=o.contents.range[2],u=Ut(n,p,!1,i);return u.comment&&(o.comment=u.comment),o.range=[a,p,u.offset],o}function Mt(e){if(typeof e=="number")return[e,e+1];if(Array.isArray(e))return e.length===2?e:[e[0],e[1]];let{offset:t,source:a}=e;return[t,t+(typeof a=="string"?a.length:1)]}function mi(e){let t="",a=!1,r=!1;for(let s=0;s<e.length;++s){let n=e[s];switch(n[0]){case"#":t+=(t===""?"":r?`

`:`
`)+(n.substring(1)||" "),a=!0,r=!1;break;case"%":e[s+1]?.[0]!=="#"&&(s+=1),a=!1;break;default:a||(r=!0),a=!1}}return{comment:t,afterEmptyLine:r}}var Zc=class{constructor(e={}){this.doc=null,this.atDirectives=!1,this.prelude=[],this.errors=[],this.warnings=[],this.onError=(t,a,r,s)=>{let n=Mt(t);s?this.warnings.push(new Ac(n,a,r)):this.errors.push(new zt(n,a,r))},this.directives=new nt({version:e.version||"1.2"}),this.options=e}decorate(e,t){let{comment:a,afterEmptyLine:r}=mi(this.prelude);if(a){let s=e.contents;if(t)e.comment=e.comment?`${e.comment}
${a}`:a;else if(r||e.directives.docStart||!s)e.commentBefore=a;else if(V(s)&&!s.flow&&s.items.length>0){let n=s.items[0];W(n)&&(n=n.key);let i=n.commentBefore;n.commentBefore=i?`${a}
${i}`:a}else{let n=s.commentBefore;s.commentBefore=n?`${a}
${n}`:a}}if(t){for(let s=0;s<this.errors.length;++s)e.errors.push(this.errors[s]);for(let s=0;s<this.warnings.length;++s)e.warnings.push(this.warnings[s])}else e.errors=this.errors,e.warnings=this.warnings;this.prelude=[],this.errors=[],this.warnings=[]}streamInfo(){return{comment:mi(this.prelude).comment,directives:this.directives,errors:this.errors,warnings:this.warnings}}*compose(e,t=!1,a=-1){for(let r of e)yield*this.next(r);yield*this.end(t,a)}*next(e){switch(e.type){case"directive":this.directives.add(e.source,(t,a,r)=>{let s=Mt(e);s[0]+=t,this.onError(s,"BAD_DIRECTIVE",a,r)}),this.prelude.push(e.source),this.atDirectives=!0;break;case"document":{let t=Kc(this.options,this.directives,e,this.onError);this.atDirectives&&!t.directives.docStart&&this.onError(e,"MISSING_CHAR","Missing directives-end/doc-start indicator line"),this.decorate(t,!1),this.doc&&(yield this.doc),this.doc=t,this.atDirectives=!1;break}case"byte-order-mark":case"space":break;case"comment":case"newline":this.prelude.push(e.source);break;case"error":{let t=e.source?`${e.message}: ${JSON.stringify(e.source)}`:e.message,a=new zt(Mt(e),"UNEXPECTED_TOKEN",t);this.atDirectives||!this.doc?this.errors.push(a):this.doc.errors.push(a);break}case"doc-end":{if(!this.doc){this.errors.push(new zt(Mt(e),"UNEXPECTED_TOKEN","Unexpected doc-end without preceding document"));break}this.doc.directives.docEnd=!0;let t=Ut(e.end,e.offset+e.source.length,this.doc.options.strict,this.onError);if(this.decorate(this.doc,!0),t.comment){let a=this.doc.comment;this.doc.comment=a?`${a}
${t.comment}`:t.comment}this.doc.range[2]=t.offset;break}default:this.errors.push(new zt(Mt(e),"UNEXPECTED_TOKEN",`Unsupported token ${e.type}`))}}*end(e=!1,t=-1){if(this.doc)this.decorate(this.doc,!0),yield this.doc,this.doc=null;else if(e){let a=new ii(void 0,Object.assign({_directives:this.directives},this.options));this.atDirectives&&this.onError(t,"MISSING_CHAR","Missing directives-end indicator line"),a.range=[0,t,t],this.decorate(a,!1),yield a}}},Hr=Symbol("break visit"),Jc=Symbol("skip children"),fi=Symbol("remove item");function ht(e,t){"type"in e&&e.type==="document"&&(e={start:e.start,value:e.value}),gi(Object.freeze([]),e,t)}ht.BREAK=Hr,ht.SKIP=Jc,ht.REMOVE=fi,ht.itemAtPath=(e,t)=>{let a=e;for(let[r,s]of t){let n=a?.[r];if(n&&"items"in n)a=n.items[s];else return}return a},ht.parentCollection=(e,t)=>{let a=ht.itemAtPath(e,t.slice(0,-1)),r=t[t.length-1][0],s=a?.[r];if(s&&"items"in s)return s;throw Error("Parent collection not found")};function gi(e,t,a){let r=a(t,e);if(typeof r=="symbol")return r;for(let s of["key","value"]){let n=t[s];if(n&&"items"in n){for(let i=0;i<n.items.length;++i){let o=gi(Object.freeze(e.concat([[s,i]])),n.items[i],a);if(typeof o=="number")i=o-1;else{if(o===Hr)return Hr;o===fi&&(n.items.splice(i,1),--i)}}typeof r=="function"&&s==="key"&&(r=r(t,e))}}return typeof r=="function"?r(t,e):r}function Gc(e){switch(e){case"\uFEFF":return"byte-order-mark";case"":return"doc-mode";case"":return"flow-error-end";case"":return"scalar";case"---":return"doc-start";case"...":return"doc-end";case"":case`
`:case`\r
`:return"newline";case"-":return"seq-item-ind";case"?":return"explicit-key-ind";case":":return"map-value-ind";case"{":return"flow-map-start";case"}":return"flow-map-end";case"[":return"flow-seq-start";case"]":return"flow-seq-end";case",":return"comma"}switch(e[0]){case" ":case"	":return"space";case"#":return"comment";case"%":return"directive-line";case"*":return"alias";case"&":return"anchor";case"!":return"tag";case"'":return"single-quoted-scalar";case'"':return"double-quoted-scalar";case"|":case">":return"block-scalar-header"}return null}function ge(e){switch(e){case void 0:case" ":case`
`:case"\r":case"	":return!0;default:return!1}}var bi=new Set("0123456789ABCDEFabcdef"),Yc=new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()"),Ta=new Set(",[]{}"),Xc=new Set(` ,[]{}
\r	`),Wr=e=>!e||Xc.has(e),Qc=class{constructor(){this.atEnd=!1,this.blockScalarIndent=-1,this.blockScalarKeep=!1,this.buffer="",this.flowKey=!1,this.flowLevel=0,this.indentNext=0,this.indentValue=0,this.lineEndPos=null,this.next=null,this.pos=0}*lex(e,t=!1){if(e){if(typeof e!="string")throw TypeError("source is not a string");this.buffer=this.buffer?this.buffer+e:e,this.lineEndPos=null}this.atEnd=!t;let a=this.next??"stream";for(;a&&(t||this.hasChars(1));)a=yield*this.parseNext(a)}atLineEnd(){let e=this.pos,t=this.buffer[e];for(;t===" "||t==="	";)t=this.buffer[++e];return!t||t==="#"||t===`
`||t==="\r"&&this.buffer[e+1]===`
`}charAt(e){return this.buffer[this.pos+e]}continueScalar(e){let t=this.buffer[e];if(this.indentNext>0){let a=0;for(;t===" ";)t=this.buffer[++a+e];if(t==="\r"){let r=this.buffer[a+e+1];if(r===`
`||!r&&!this.atEnd)return e+a+1}return t===`
`||a>=this.indentNext||!t&&!this.atEnd?e+a:-1}if(t==="-"||t==="."){let a=this.buffer.substr(e,3);if((a==="---"||a==="...")&&ge(this.buffer[e+3]))return-1}return e}getLine(){let e=this.lineEndPos;return(typeof e!="number"||e!==-1&&e<this.pos)&&(e=this.buffer.indexOf(`
`,this.pos),this.lineEndPos=e),e===-1?this.atEnd?this.buffer.substring(this.pos):null:(this.buffer[e-1]==="\r"&&--e,this.buffer.substring(this.pos,e))}hasChars(e){return this.pos+e<=this.buffer.length}setNext(e){return this.buffer=this.buffer.substring(this.pos),this.pos=0,this.lineEndPos=null,this.next=e,null}peek(e){return this.buffer.substr(this.pos,e)}*parseNext(e){switch(e){case"stream":return yield*this.parseStream();case"line-start":return yield*this.parseLineStart();case"block-start":return yield*this.parseBlockStart();case"doc":return yield*this.parseDocument();case"flow":return yield*this.parseFlowCollection();case"quoted-scalar":return yield*this.parseQuotedScalar();case"block-scalar":return yield*this.parseBlockScalar();case"plain-scalar":return yield*this.parsePlainScalar()}}*parseStream(){let e=this.getLine();if(e===null)return this.setNext("stream");if(e[0]==="\uFEFF"&&(yield*this.pushCount(1),e=e.substring(1)),e[0]==="%"){let t=e.length,a=e.indexOf("#");for(;a!==-1;){let s=e[a-1];if(s===" "||s==="	"){t=a-1;break}a=e.indexOf("#",a+1)}for(;;){let s=e[t-1];if(s===" "||s==="	")--t;else break}let r=(yield*this.pushCount(t))+(yield*this.pushSpaces(!0));return yield*this.pushCount(e.length-r),this.pushNewline(),"stream"}if(this.atLineEnd()){let t=yield*this.pushSpaces(!0);return yield*this.pushCount(e.length-t),yield*this.pushNewline(),"stream"}return yield"",yield*this.parseLineStart()}*parseLineStart(){let e=this.charAt(0);if(!e&&!this.atEnd)return this.setNext("line-start");if(e==="-"||e==="."){if(!this.atEnd&&!this.hasChars(4))return this.setNext("line-start");let t=this.peek(3);if((t==="---"||t==="...")&&ge(this.charAt(3)))return yield*this.pushCount(3),this.indentValue=0,this.indentNext=0,t==="---"?"doc":"stream"}return this.indentValue=yield*this.pushSpaces(!1),this.indentNext>this.indentValue&&!ge(this.charAt(1))&&(this.indentNext=this.indentValue),yield*this.parseBlockStart()}*parseBlockStart(){let[e,t]=this.peek(2);if(!t&&!this.atEnd)return this.setNext("block-start");if((e==="-"||e==="?"||e===":")&&ge(t)){let a=(yield*this.pushCount(1))+(yield*this.pushSpaces(!0));return this.indentNext=this.indentValue+1,this.indentValue+=a,"block-start"}return"doc"}*parseDocument(){yield*this.pushSpaces(!0);let e=this.getLine();if(e===null)return this.setNext("doc");let t=yield*this.pushIndicators();switch(e[t]){case"#":yield*this.pushCount(e.length-t);case void 0:return yield*this.pushNewline(),yield*this.parseLineStart();case"{":case"[":return yield*this.pushCount(1),this.flowKey=!1,this.flowLevel=1,"flow";case"}":case"]":return yield*this.pushCount(1),"doc";case"*":return yield*this.pushUntil(Wr),"doc";case'"':case"'":return yield*this.parseQuotedScalar();case"|":case">":return t+=yield*this.parseBlockScalarHeader(),t+=yield*this.pushSpaces(!0),yield*this.pushCount(e.length-t),yield*this.pushNewline(),yield*this.parseBlockScalar();default:return yield*this.parsePlainScalar()}}*parseFlowCollection(){let e,t,a=-1;do e=yield*this.pushNewline(),e>0?(t=yield*this.pushSpaces(!1),this.indentValue=a=t):t=0,t+=yield*this.pushSpaces(!0);while(e+t>0);let r=this.getLine();if(r===null)return this.setNext("flow");if((a!==-1&&a<this.indentNext&&r[0]!=="#"||a===0&&(r.startsWith("---")||r.startsWith("..."))&&ge(r[3]))&&(a!==this.indentNext-1||this.flowLevel!==1||r[0]!=="]"&&r[0]!=="}"))return this.flowLevel=0,yield"",yield*this.parseLineStart();let s=0;for(;r[s]===",";)s+=yield*this.pushCount(1),s+=yield*this.pushSpaces(!0),this.flowKey=!1;switch(s+=yield*this.pushIndicators(),r[s]){case void 0:return"flow";case"#":return yield*this.pushCount(r.length-s),"flow";case"{":case"[":return yield*this.pushCount(1),this.flowKey=!1,this.flowLevel+=1,"flow";case"}":case"]":return yield*this.pushCount(1),this.flowKey=!0,--this.flowLevel,this.flowLevel?"flow":"doc";case"*":return yield*this.pushUntil(Wr),"flow";case'"':case"'":return this.flowKey=!0,yield*this.parseQuotedScalar();case":":{let n=this.charAt(1);if(this.flowKey||ge(n)||n===",")return this.flowKey=!1,yield*this.pushCount(1),yield*this.pushSpaces(!0),"flow"}default:return this.flowKey=!1,yield*this.parsePlainScalar()}}*parseQuotedScalar(){let e=this.charAt(0),t=this.buffer.indexOf(e,this.pos+1);if(e==="'")for(;t!==-1&&this.buffer[t+1]==="'";)t=this.buffer.indexOf("'",t+2);else for(;t!==-1;){let s=0;for(;this.buffer[t-1-s]==="\\";)s+=1;if(s%2==0)break;t=this.buffer.indexOf('"',t+1)}let a=this.buffer.substring(0,t),r=a.indexOf(`
`,this.pos);if(r!==-1){for(;r!==-1;){let s=this.continueScalar(r+1);if(s===-1)break;r=a.indexOf(`
`,s)}r!==-1&&(t=r-(a[r-1]==="\r"?2:1))}if(t===-1){if(!this.atEnd)return this.setNext("quoted-scalar");t=this.buffer.length}return yield*this.pushToIndex(t+1,!1),this.flowLevel?"flow":"doc"}*parseBlockScalarHeader(){this.blockScalarIndent=-1,this.blockScalarKeep=!1;let e=this.pos;for(;;){let t=this.buffer[++e];if(t==="+")this.blockScalarKeep=!0;else if(t>"0"&&t<="9")this.blockScalarIndent=Number(t)-1;else if(t!=="-")break}return yield*this.pushUntil(t=>ge(t)||t==="#")}*parseBlockScalar(){let e=this.pos-1,t=0,a;e:for(let s=this.pos;a=this.buffer[s];++s)switch(a){case" ":t+=1;break;case`
`:e=s,t=0;break;case"\r":{let n=this.buffer[s+1];if(!n&&!this.atEnd)return this.setNext("block-scalar");if(n===`
`)break}default:break e}if(!a&&!this.atEnd)return this.setNext("block-scalar");if(t>=this.indentNext){this.indentNext=this.blockScalarIndent===-1?t:this.blockScalarIndent+(this.indentNext===0?1:this.indentNext);do{let s=this.continueScalar(e+1);if(s===-1)break;e=this.buffer.indexOf(`
`,s)}while(e!==-1);if(e===-1){if(!this.atEnd)return this.setNext("block-scalar");e=this.buffer.length}}let r=e+1;for(a=this.buffer[r];a===" ";)a=this.buffer[++r];if(a==="	"){for(;a==="	"||a===" "||a==="\r"||a===`
`;)a=this.buffer[++r];e=r-1}else if(!this.blockScalarKeep)do{let s=e-1,n=this.buffer[s];n==="\r"&&(n=this.buffer[--s]);let i=s;for(;n===" ";)n=this.buffer[--s];if(n===`
`&&s>=this.pos&&s+1+t>i)e=s;else break}while(!0);return yield"",yield*this.pushToIndex(e+1,!0),yield*this.parseLineStart()}*parsePlainScalar(){let e=this.flowLevel>0,t=this.pos-1,a=this.pos-1,r;for(;r=this.buffer[++a];)if(r===":"){let s=this.buffer[a+1];if(ge(s)||e&&Ta.has(s))break;t=a}else if(ge(r)){let s=this.buffer[a+1];if(r==="\r"&&(s===`
`?(a+=1,r=`
`,s=this.buffer[a+1]):t=a),s==="#"||e&&Ta.has(s))break;if(r===`
`){let n=this.continueScalar(a+1);if(n===-1)break;a=Math.max(a,n-2)}}else{if(e&&Ta.has(r))break;t=a}return!r&&!this.atEnd?this.setNext("plain-scalar"):(yield"",yield*this.pushToIndex(t+1,!0),e?"flow":"doc")}*pushCount(e){return e>0?(yield this.buffer.substr(this.pos,e),this.pos+=e,e):0}*pushToIndex(e,t){let a=this.buffer.slice(this.pos,e);return a?(yield a,this.pos+=a.length,a.length):(t&&(yield""),0)}*pushIndicators(){let e=0;e:for(;;){switch(this.charAt(0)){case"!":e+=yield*this.pushTag(),e+=yield*this.pushSpaces(!0);continue e;case"&":e+=yield*this.pushUntil(Wr),e+=yield*this.pushSpaces(!0);continue e;case"-":case"?":case":":{let t=this.flowLevel>0,a=this.charAt(1);if(ge(a)||t&&Ta.has(a)){t?this.flowKey&&=!1:this.indentNext=this.indentValue+1,e+=yield*this.pushCount(1),e+=yield*this.pushSpaces(!0);continue e}}}break e}return e}*pushTag(){if(this.charAt(1)==="<"){let e=this.pos+2,t=this.buffer[e];for(;!ge(t)&&t!==">";)t=this.buffer[++e];return yield*this.pushToIndex(t===">"?e+1:e,!1)}{let e=this.pos+1,t=this.buffer[e];for(;t;)if(Yc.has(t))t=this.buffer[++e];else if(t==="%"&&bi.has(this.buffer[e+1])&&bi.has(this.buffer[e+2]))t=this.buffer[e+=3];else break;return yield*this.pushToIndex(e,!1)}}*pushNewline(){let e=this.buffer[this.pos];return e===`
`?yield*this.pushCount(1):e==="\r"&&this.charAt(1)===`
`?yield*this.pushCount(2):0}*pushSpaces(e){let t=this.pos-1,a;do a=this.buffer[++t];while(a===" "||e&&a==="	");let r=t-this.pos;return r>0&&(yield this.buffer.substr(this.pos,r),this.pos=t),r}*pushUntil(e){let t=this.pos,a=this.buffer[t];for(;!e(a);)a=this.buffer[++t];return yield*this.pushToIndex(t,!1)}},ed=class{constructor(){this.lineStarts=[],this.addNewLine=e=>this.lineStarts.push(e),this.linePos=e=>{let t=0,a=this.lineStarts.length;for(;t<a;){let s=t+a>>1;this.lineStarts[s]<e?t=s+1:a=s}if(this.lineStarts[t]===e)return{line:t+1,col:1};if(t===0)return{line:0,col:e};let r=this.lineStarts[t-1];return{line:t,col:e-r+1}}}};function Te(e,t){for(let a=0;a<e.length;++a)if(e[a].type===t)return!0;return!1}function yi(e){for(let t=0;t<e.length;++t)switch(e[t].type){case"space":case"comment":case"newline":break;default:return t}return-1}function vi(e){switch(e?.type){case"alias":case"scalar":case"single-quoted-scalar":case"double-quoted-scalar":case"flow-collection":return!0;default:return!1}}function Oa(e){switch(e.type){case"document":return e.start;case"block-map":{let t=e.items[e.items.length-1];return t.sep??t.start}case"block-seq":return e.items[e.items.length-1].start;default:return[]}}function mt(e){if(e.length===0)return[];let t=e.length;e:for(;--t>=0;)switch(e[t].type){case"doc-start":case"explicit-key-ind":case"map-value-ind":case"seq-item-ind":case"newline":break e}for(;e[++t]?.type==="space";);return e.splice(t,e.length)}function _a(e,t){if(t.length<1e5)Array.prototype.push.apply(e,t);else for(let a=0;a<t.length;++a)e.push(t[a])}function xi(e){if(e.start.type==="flow-seq-start")for(let t of e.items)t.sep&&!t.value&&!Te(t.start,"explicit-key-ind")&&!Te(t.sep,"map-value-ind")&&(t.key&&(t.value=t.key),delete t.key,vi(t.value)?t.value.end?_a(t.value.end,t.sep):t.value.end=t.sep:_a(t.start,t.sep),delete t.sep)}var td=class{constructor(e){this.atNewLine=!0,this.atScalar=!1,this.indent=0,this.offset=0,this.onKeyLine=!1,this.stack=[],this.source="",this.type="",this.lexer=new Qc,this.onNewLine=e}*parse(e,t=!1){this.onNewLine&&this.offset===0&&this.onNewLine(0);for(let a of this.lexer.lex(e,t))yield*this.next(a);t||(yield*this.end())}*next(e){if(this.source=e,this.atScalar){this.atScalar=!1,yield*this.step(),this.offset+=e.length;return}let t=Gc(e);if(t)if(t==="scalar")this.atNewLine=!1,this.atScalar=!0,this.type="scalar";else{switch(this.type=t,yield*this.step(),t){case"newline":this.atNewLine=!0,this.indent=0,this.onNewLine&&this.onNewLine(this.offset+e.length);break;case"space":this.atNewLine&&e[0]===" "&&(this.indent+=e.length);break;case"explicit-key-ind":case"map-value-ind":case"seq-item-ind":this.atNewLine&&(this.indent+=e.length);break;case"doc-mode":case"flow-error-end":return;default:this.atNewLine=!1}this.offset+=e.length}else{let a=`Not a YAML token: ${e}`;yield*this.pop({type:"error",offset:this.offset,message:a,source:e}),this.offset+=e.length}}*end(){for(;this.stack.length>0;)yield*this.pop()}get sourceToken(){return{type:this.type,offset:this.offset,indent:this.indent,source:this.source}}*step(){let e=this.peek(1);if(this.type==="doc-end"&&e?.type!=="doc-end"){for(;this.stack.length>0;)yield*this.pop();this.stack.push({type:"doc-end",offset:this.offset,source:this.source});return}if(!e)return yield*this.stream();switch(e.type){case"document":return yield*this.document(e);case"alias":case"scalar":case"single-quoted-scalar":case"double-quoted-scalar":return yield*this.scalar(e);case"block-scalar":return yield*this.blockScalar(e);case"block-map":return yield*this.blockMap(e);case"block-seq":return yield*this.blockSequence(e);case"flow-collection":return yield*this.flowCollection(e);case"doc-end":return yield*this.documentEnd(e)}yield*this.pop()}peek(e){return this.stack[this.stack.length-e]}*pop(e){let t=e??this.stack.pop();if(!t)yield{type:"error",offset:this.offset,source:"",message:"Tried to pop an empty stack"};else if(this.stack.length===0)yield t;else{let a=this.peek(1);switch(t.type==="block-scalar"?t.indent="indent"in a?a.indent:0:t.type==="flow-collection"&&a.type==="document"&&(t.indent=0),t.type==="flow-collection"&&xi(t),a.type){case"document":a.value=t;break;case"block-scalar":a.props.push(t);break;case"block-map":{let r=a.items[a.items.length-1];if(r.value){a.items.push({start:[],key:t,sep:[]}),this.onKeyLine=!0;return}if(r.sep)r.value=t;else{Object.assign(r,{key:t,sep:[]}),this.onKeyLine=!r.explicitKey;return}break}case"block-seq":{let r=a.items[a.items.length-1];r.value?a.items.push({start:[],value:t}):r.value=t;break}case"flow-collection":{let r=a.items[a.items.length-1];!r||r.value?a.items.push({start:[],key:t,sep:[]}):r.sep?r.value=t:Object.assign(r,{key:t,sep:[]});return}default:yield*this.pop(),yield*this.pop(t)}if((a.type==="document"||a.type==="block-map"||a.type==="block-seq")&&(t.type==="block-map"||t.type==="block-seq")){let r=t.items[t.items.length-1];r&&!r.sep&&!r.value&&r.start.length>0&&yi(r.start)===-1&&(t.indent===0||r.start.every(s=>s.type!=="comment"||s.indent<t.indent))&&(a.type==="document"?a.end=r.start:a.items.push({start:r.start}),t.items.splice(-1,1))}}}*stream(){switch(this.type){case"directive-line":yield{type:"directive",offset:this.offset,source:this.source};return;case"byte-order-mark":case"space":case"comment":case"newline":yield this.sourceToken;return;case"doc-mode":case"doc-start":{let e={type:"document",offset:this.offset,start:[]};this.type==="doc-start"&&e.start.push(this.sourceToken),this.stack.push(e);return}}yield{type:"error",offset:this.offset,message:`Unexpected ${this.type} token in YAML stream`,source:this.source}}*document(e){if(e.value)return yield*this.lineEnd(e);switch(this.type){case"doc-start":yi(e.start)===-1?e.start.push(this.sourceToken):(yield*this.pop(),yield*this.step());return;case"anchor":case"tag":case"space":case"comment":case"newline":e.start.push(this.sourceToken);return}let t=this.startBlockValue(e);t?this.stack.push(t):yield{type:"error",offset:this.offset,message:`Unexpected ${this.type} token in YAML document`,source:this.source}}*scalar(e){if(this.type==="map-value-ind"){let t=mt(Oa(this.peek(2))),a;e.end?(a=e.end,a.push(this.sourceToken),delete e.end):a=[this.sourceToken];let r={type:"block-map",offset:e.offset,indent:e.indent,items:[{start:t,key:e,sep:a}]};this.onKeyLine=!0,this.stack[this.stack.length-1]=r}else yield*this.lineEnd(e)}*blockScalar(e){switch(this.type){case"space":case"comment":case"newline":e.props.push(this.sourceToken);return;case"scalar":if(e.source=this.source,this.atNewLine=!0,this.indent=0,this.onNewLine){let t=this.source.indexOf(`
`)+1;for(;t!==0;)this.onNewLine(this.offset+t),t=this.source.indexOf(`
`,t)+1}yield*this.pop();break;default:yield*this.pop(),yield*this.step()}}*blockMap(e){let t=e.items[e.items.length-1];switch(this.type){case"newline":if(this.onKeyLine=!1,t.value){let a="end"in t.value?t.value.end:void 0;(Array.isArray(a)?a[a.length-1]:void 0)?.type==="comment"?a?.push(this.sourceToken):e.items.push({start:[this.sourceToken]})}else t.sep?t.sep.push(this.sourceToken):t.start.push(this.sourceToken);return;case"space":case"comment":if(t.value)e.items.push({start:[this.sourceToken]});else if(t.sep)t.sep.push(this.sourceToken);else{if(this.atIndentedComment(t.start,e.indent)){let a=e.items[e.items.length-2]?.value?.end;if(Array.isArray(a)){_a(a,t.start),a.push(this.sourceToken),e.items.pop();return}}t.start.push(this.sourceToken)}return}if(this.indent>=e.indent){let a=!this.onKeyLine&&this.indent===e.indent,r=a&&(t.sep||t.explicitKey)&&this.type!=="seq-item-ind",s=[];if(r&&t.sep&&!t.value){let n=[];for(let i=0;i<t.sep.length;++i){let o=t.sep[i];switch(o.type){case"newline":n.push(i);break;case"space":break;case"comment":o.indent>e.indent&&(n.length=0);break;default:n.length=0}}n.length>=2&&(s=t.sep.splice(n[1]))}switch(this.type){case"anchor":case"tag":r||t.value?(s.push(this.sourceToken),e.items.push({start:s}),this.onKeyLine=!0):t.sep?t.sep.push(this.sourceToken):t.start.push(this.sourceToken);return;case"explicit-key-ind":!t.sep&&!t.explicitKey?(t.start.push(this.sourceToken),t.explicitKey=!0):r||t.value?(s.push(this.sourceToken),e.items.push({start:s,explicitKey:!0})):this.stack.push({type:"block-map",offset:this.offset,indent:this.indent,items:[{start:[this.sourceToken],explicitKey:!0}]}),this.onKeyLine=!0;return;case"map-value-ind":if(t.explicitKey)if(t.sep)if(t.value)e.items.push({start:[],key:null,sep:[this.sourceToken]});else if(Te(t.sep,"map-value-ind"))this.stack.push({type:"block-map",offset:this.offset,indent:this.indent,items:[{start:s,key:null,sep:[this.sourceToken]}]});else if(vi(t.key)&&!Te(t.sep,"newline")){let n=mt(t.start),i=t.key,o=t.sep;o.push(this.sourceToken),delete t.key,delete t.sep,this.stack.push({type:"block-map",offset:this.offset,indent:this.indent,items:[{start:n,key:i,sep:o}]})}else s.length>0?t.sep=t.sep.concat(s,this.sourceToken):t.sep.push(this.sourceToken);else if(Te(t.start,"newline"))Object.assign(t,{key:null,sep:[this.sourceToken]});else{let n=mt(t.start);this.stack.push({type:"block-map",offset:this.offset,indent:this.indent,items:[{start:n,key:null,sep:[this.sourceToken]}]})}else t.sep?t.value||r?e.items.push({start:s,key:null,sep:[this.sourceToken]}):Te(t.sep,"map-value-ind")?this.stack.push({type:"block-map",offset:this.offset,indent:this.indent,items:[{start:[],key:null,sep:[this.sourceToken]}]}):t.sep.push(this.sourceToken):Object.assign(t,{key:null,sep:[this.sourceToken]});this.onKeyLine=!0;return;case"alias":case"scalar":case"single-quoted-scalar":case"double-quoted-scalar":{let n=this.flowScalar(this.type);r||t.value?(e.items.push({start:s,key:n,sep:[]}),this.onKeyLine=!0):t.sep?this.stack.push(n):(Object.assign(t,{key:n,sep:[]}),this.onKeyLine=!0);return}default:{let n=this.startBlockValue(e);if(n){if(n.type==="block-seq"){if(!t.explicitKey&&t.sep&&!Te(t.sep,"newline")){yield*this.pop({type:"error",offset:this.offset,message:"Unexpected block-seq-ind on same line with key",source:this.source});return}}else a&&e.items.push({start:s});this.stack.push(n);return}}}}yield*this.pop(),yield*this.step()}*blockSequence(e){let t=e.items[e.items.length-1];switch(this.type){case"newline":if(t.value){let a="end"in t.value?t.value.end:void 0;(Array.isArray(a)?a[a.length-1]:void 0)?.type==="comment"?a?.push(this.sourceToken):e.items.push({start:[this.sourceToken]})}else t.start.push(this.sourceToken);return;case"space":case"comment":if(t.value)e.items.push({start:[this.sourceToken]});else{if(this.atIndentedComment(t.start,e.indent)){let a=e.items[e.items.length-2]?.value?.end;if(Array.isArray(a)){_a(a,t.start),a.push(this.sourceToken),e.items.pop();return}}t.start.push(this.sourceToken)}return;case"anchor":case"tag":if(t.value||this.indent<=e.indent)break;t.start.push(this.sourceToken);return;case"seq-item-ind":if(this.indent!==e.indent)break;t.value||Te(t.start,"seq-item-ind")?e.items.push({start:[this.sourceToken]}):t.start.push(this.sourceToken);return}if(this.indent>e.indent){let a=this.startBlockValue(e);if(a){this.stack.push(a);return}}yield*this.pop(),yield*this.step()}*flowCollection(e){let t=e.items[e.items.length-1];if(this.type==="flow-error-end"){let a;do yield*this.pop(),a=this.peek(1);while(a?.type==="flow-collection")}else if(e.end.length===0){switch(this.type){case"comma":case"explicit-key-ind":!t||t.sep?e.items.push({start:[this.sourceToken]}):t.start.push(this.sourceToken);return;case"map-value-ind":!t||t.value?e.items.push({start:[],key:null,sep:[this.sourceToken]}):t.sep?t.sep.push(this.sourceToken):Object.assign(t,{key:null,sep:[this.sourceToken]});return;case"space":case"comment":case"newline":case"anchor":case"tag":!t||t.value?e.items.push({start:[this.sourceToken]}):t.sep?t.sep.push(this.sourceToken):t.start.push(this.sourceToken);return;case"alias":case"scalar":case"single-quoted-scalar":case"double-quoted-scalar":{let r=this.flowScalar(this.type);!t||t.value?e.items.push({start:[],key:r,sep:[]}):t.sep?this.stack.push(r):Object.assign(t,{key:r,sep:[]});return}case"flow-map-end":case"flow-seq-end":e.end.push(this.sourceToken);return}let a=this.startBlockValue(e);a?this.stack.push(a):(yield*this.pop(),yield*this.step())}else{let a=this.peek(2);if(a.type==="block-map"&&(this.type==="map-value-ind"&&a.indent===e.indent||this.type==="newline"&&!a.items[a.items.length-1].sep))yield*this.pop(),yield*this.step();else if(this.type==="map-value-ind"&&a.type!=="flow-collection"){let r=mt(Oa(a));xi(e);let s=e.end.splice(1,e.end.length);s.push(this.sourceToken);let n={type:"block-map",offset:e.offset,indent:e.indent,items:[{start:r,key:e,sep:s}]};this.onKeyLine=!0,this.stack[this.stack.length-1]=n}else yield*this.lineEnd(e)}}flowScalar(e){if(this.onNewLine){let t=this.source.indexOf(`
`)+1;for(;t!==0;)this.onNewLine(this.offset+t),t=this.source.indexOf(`
`,t)+1}return{type:e,offset:this.offset,indent:this.indent,source:this.source}}startBlockValue(e){switch(this.type){case"alias":case"scalar":case"single-quoted-scalar":case"double-quoted-scalar":return this.flowScalar(this.type);case"block-scalar-header":return{type:"block-scalar",offset:this.offset,indent:this.indent,props:[this.sourceToken],source:""};case"flow-map-start":case"flow-seq-start":return{type:"flow-collection",offset:this.offset,indent:this.indent,start:this.sourceToken,items:[],end:[]};case"seq-item-ind":return{type:"block-seq",offset:this.offset,indent:this.indent,items:[{start:[this.sourceToken]}]};case"explicit-key-ind":{this.onKeyLine=!0;let t=mt(Oa(e));return t.push(this.sourceToken),{type:"block-map",offset:this.offset,indent:this.indent,items:[{start:t,explicitKey:!0}]}}case"map-value-ind":{this.onKeyLine=!0;let t=mt(Oa(e));return{type:"block-map",offset:this.offset,indent:this.indent,items:[{start:t,key:null,sep:[this.sourceToken]}]}}}return null}atIndentedComment(e,t){return this.type!=="comment"||this.indent<=t?!1:e.every(a=>a.type==="newline"||a.type==="space")}*documentEnd(e){this.type!=="doc-mode"&&(e.end?e.end.push(this.sourceToken):e.end=[this.sourceToken],this.type==="newline"&&(yield*this.pop()))}*lineEnd(e){switch(this.type){case"comma":case"doc-start":case"doc-end":case"flow-seq-end":case"flow-map-end":case"map-value-ind":yield*this.pop(),yield*this.step();break;case"newline":this.onKeyLine=!1;default:e.end?e.end.push(this.sourceToken):e.end=[this.sourceToken],this.type==="newline"&&(yield*this.pop())}}};function ad(e){let t=e.prettyErrors!==!1;return{lineCounter:e.lineCounter||t&&new ed||null,prettyErrors:t}}function rd(e,t={}){let{lineCounter:a,prettyErrors:r}=ad(t),s=new td(a?.addNewLine),n=new Zc(t),i=null;for(let o of n.compose(s.parse(e),!0,e.length))if(!i)i=o;else if(i.options.logLevel!=="silent"){i.errors.push(new zt(o.range.slice(0,2),"MULTIPLE_DOCS","Source contains multiple documents; please use YAML.parseAllDocuments()"));break}return r&&a&&(i.errors.forEach(li(e,a)),i.warnings.forEach(li(e,a))),i}function sd(e,t,a){let r;typeof t=="function"?r=t:a===void 0&&t&&typeof t=="object"&&(a=t);let s=rd(e,a);if(!s)return null;if(s.warnings.forEach(n=>(s.options.logLevel,void 0)),s.errors.length>0){if(s.options.logLevel!=="silent")throw s.errors[0];s.errors=[]}return s.toJS(Object.assign({reviver:r},a))}function Na(e){if(e!==null){if(typeof e=="string"){if(e.trim()==="")return;try{return JSON.parse(e)}catch{let t=/^[^:]+:/.test(e),a=e.slice(0,50).trimStart().startsWith("{");return!t||a?void 0:sd(e,{maxAliasCount:1e4,merge:!0})}}return xr(e),e}}function Vr(e,t={}){if(xr(e))return e;let a=Na(e);return Array.isArray(a)?a:[{isEntrypoint:!0,specification:a,filename:null,dir:"./",references:Dn(a),...t}]}function nd(e){return decodeURI(e.replace(/~1/g,"/").replace(/~0/g,"~"))}function id(e){return e.split("/").slice(1).map(nd)}function od(e,t,a,r=[]){let s=Vr(structuredClone(e)),n=Pe(s),i=a?.specification??n.specification;if(!H(i)){if(t?.throwOnError)throw Error(se.NO_CONTENT);return{valid:!1,errors:r,schema:i}}return Kr(i,s,a??n,new WeakSet,r,t),r=r.filter((o,l,c)=>l===c.findIndex(p=>p.message===o.message&&p.code===o.code)),{valid:r.length===0,errors:r,schema:i}}function Kr(e,t,a,r,s,n){if(e===null||r.has(e))return;r.add(e);function i(l){return Kr(l.specification,t,l,r,s,n),l}let o=new Set;for(;e.$ref!==void 0;){if(o.has(e.$ref)){s.push({code:"SELF_REFERENCE",message:se.SELF_REFERENCE.replace("%s",e.$ref)}),delete e.$ref;break}o.add(e.$ref);let l=wi(e.$ref,n,a,t,i,s);if(typeof l!="object"||!l)break;let c=e.$ref;delete e.$ref;for(let p of Object.keys(l))e[p]===void 0&&(e[p]=l[p]);c&&n?.onDereference?.({schema:e,ref:c,resolved:l})}for(let l of Object.values(e))typeof l=="object"&&l&&Kr(l,t,a,r,s,n)}function wi(e,t,a,r,s,n){if(typeof e!="string"){if(t?.throwOnError)throw Error(se.INVALID_REFERENCE.replace("%s",e));n.push({code:"INVALID_REFERENCE",message:se.INVALID_REFERENCE.replace("%s",e)});return}let[i,o]=e.split("#",2),l=i!==a.filename;if(i&&l){let c=r.find(p=>p.filename===i);if(!c){if(t?.throwOnError)throw Error(se.EXTERNAL_REFERENCE_NOT_FOUND.replace("%s",i));n.push({code:"EXTERNAL_REFERENCE_NOT_FOUND",message:se.EXTERNAL_REFERENCE_NOT_FOUND.replace("%s",i)});return}return o===void 0?c.specification:wi(`#${o}`,t,s(c),r,s,n)}try{return id(o).reduce((c,p)=>{if(!re(c)||!(p in c))throw Error(se.INVALID_REFERENCE.replace("%s",e));return c[p]},a.specification)}catch{if(t?.throwOnError)throw Error(se.INVALID_REFERENCE.replace("%s",e));n.push({code:"INVALID_REFERENCE",message:se.INVALID_REFERENCE.replace("%s",e)})}}function $i(e,t){let a=Vr(e),r=Pe(a),s=od(a,t);return{specification:r.specification,errors:s.errors,schema:s.schema,...En(r.specification)}}var ld=1e5,cd=10,ki=e=>{let t=new WeakSet,a={sourceEntries:0,copiedEntries:0,sizes:new Map},r=s=>{if(s===null||typeof s=="string"||typeof s=="number"||typeof s=="boolean"||s===void 0)return s;if(!Array.isArray(s)&&!H(s))return structuredClone(s);if(t.has(s))throw Error("Cannot upgrade to OpenAPI 3.2: cyclic objects cannot be represented in JSON. Use $ref instead.");let n=a.sizes.get(s)??1+(Array.isArray(s)?s.length:Object.keys(s).length);if(a.sizes.has(s)||(a.sizes.set(s,n),a.sourceEntries+=n),a.copiedEntries+=n,a.copiedEntries>ld&&a.copiedEntries>a.sourceEntries*cd)throw Error("Cannot upgrade to OpenAPI 3.2: excessive YAML alias expansion. Use $ref for shared schemas.");t.add(s);let i=Array.isArray(s)?s.map(r):Object.fromEntries(Object.entries(s).map(([o,l])=>[o,r(l)]));return t.delete(s),i};return r(e)},ft=e=>e.replace(/~/g,"~0").replace(/\//g,"~1"),dd=e=>decodeURI(e.replace(/~1/g,"/").replace(/~0/g,"~")),Si=e=>e.split("/").slice(1).map(dd),Ei=class extends AggregateError{errors;constructor(e){super(e,e.map(t=>t.message).join(`
`)),this.errors=e,this.name="UpgradeIncompatibilityError"}},pd=["properties","patternProperties","$defs","dependentSchemas"],ud=["allOf","anyOf","oneOf","prefixItems"],hd=["items","contains","additionalProperties","unevaluatedProperties","unevaluatedItems","propertyNames","not","if","then","else","contentSchema"],md=(e,t="throw")=>{let a=new WeakMap,r=(f,$)=>{let k=a.get(f)??new Map(Object.entries(Object.getOwnPropertyDescriptors(f)).filter(([,S])=>Object.hasOwn(S,"value")).map(([S,E])=>[S,E.value]));return a.set(f,k),k.get($)},s=new Set,n=[],i=new WeakMap,o=new WeakSet,l={evaluations:0},c=new WeakSet,p=[],u=f=>{H(f)&&!c.has(f)&&(c.add(f),u(f.items),Array.isArray(f.prefixItems)&&f.prefixItems.forEach(u))},h=new WeakMap,m=new WeakMap,b=(f,$)=>{n.push(Error(`Cannot upgrade to OpenAPI 3.2 at ${f}: ${$}`))},g=(f,$=!1)=>{if(typeof f=="string"&&f.startsWith("#/"))try{return Si(decodeURIComponent(f.slice(1))).reduce((k,S)=>{if((!$||!H(k)||k.$id===void 0&&k.$schema===void 0)&&(!Array.isArray(k)||/^(0|[1-9]\d*)$/.test(S))&&(H(k)||Array.isArray(k))&&Object.hasOwn(k,S))return r(k,S)},e)}catch{return}},y=(f,$)=>{if(typeof f!="string")return;let k=[...f.matchAll(/\{([^{}]+)\}/g)].map(S=>S[1]);new Set(k).size!==k.length&&b($,"Template variables must not be repeated. Rename the repeated variable and define it separately.")},w=(f,$,k=new Set)=>{if(f===!1)return!0;if(f===!0)return!1;if(!H(f)||f.$id!==void 0||f.$schema!==void 0)return;if(k.has(f)){for(let T of k)o.add(T);return}let S=i.get(f)??new Map;if(S.has($))return S.get($);if(++l.evaluations>1e5){l.evaluations===100001&&b("#","Discriminator requiredness analysis was truncated after 100,000 evaluations.");return}let E=T=>((T!==void 0||!o.has(f))&&(S.set($,T),i.set(f,S)),T);if(Array.isArray(f.required)&&f.required.includes($))return E(!0);let _=new Set([...k,f]),I=[];f.$ref!==void 0&&I.push(w(g(f.$ref,!0),$,_)),Array.isArray(f.allOf)&&I.push(...f.allOf.map(T=>w(T,$,_)));for(let T of["oneOf","anyOf"])if(Array.isArray(f[T])){let C=f[T].map(F=>w(F,$,_));C.every(F=>F===!0)?I.push(!0):C.every(F=>F===!1)?I.push(!1):I.push(void 0)}return I.includes(!0)?E(!0):I.includes(void 0)||["if","not","$dynamicRef","const","enum","minProperties","dependentRequired","dependentSchemas"].some(T=>T in f)?E(void 0):E(!1)},v=(f,$,{inferredName:k,propertyName:S,dialect:E,ancestors:_=new Set,baseChanged:I=!1})=>{if(!H(f)||_.has(f)||(f.$schema??E)!==void 0)return;let T=I||f.$id!==void 0,C=[k,S,T].join(":"),F=h.get(f)??new Set;if(F.has(C))return;let pe=H(f.xml)?f.xml:{},X=f.$ref!==void 0||f.$dynamicRef!==void 0||f.type==="array"?"none":"element",N=pe.wrapped===!0?"element":X,G=pe.nodeType??(pe.attribute===!0?"attribute":N);(G==="element"||G==="attribute")&&!k&&pe.name===void 0&&b($,"An inline XML element needs an explicit xml.name.");let z={dialect:E,ancestors:new Set([..._,f]),baseChanged:T};if(!T&&typeof f.$ref=="string"){let J=g(f.$ref,!0);if(H(J)){let U=Si(decodeURIComponent(f.$ref.slice(1))),bt=U.length===3&&U[0]==="components"&&U[1]==="schemas",Ge=c.has(J);v(J,f.$ref,{...z,inferredName:bt||Ge,propertyName:Ge})}}for(let J of["allOf","anyOf","oneOf"]){let U=f[J];Array.isArray(U)&&U.forEach((bt,Ge)=>v(bt,$+"/"+J+"/"+Ge,{...z,inferredName:!1,propertyName:!1}))}if(v(f.items,$+"/items",{...z,inferredName:S,propertyName:S}),Array.isArray(f.prefixItems)&&f.prefixItems.forEach((J,U)=>v(J,$+"/prefixItems/"+U,{...z,inferredName:S,propertyName:S})),H(f.properties))for(let[J,U]of Object.entries(f.properties))v(U,$+"/properties/"+ft(J),{...z,inferredName:!0,propertyName:!0});F.add(C),h.set(f,F)},x=(f,$,k,S=e.jsonSchemaDialect,E=!1)=>{if(!H(f))return;let _=$==="schema"?f.$schema??S:S,I=E||$==="schema"&&f.$id!==void 0,T=`${$}:${String(_)}:${I}`,C=m.get(f)??new Set;if(C.has(T))return;C.add(T),m.set(f,C);let F=(N,G)=>x(r(f,N),G,`${k}/${ft(N)}`,_,I),pe=(N,G)=>{let z=r(f,N);Array.isArray(z)&&z.forEach((J,U)=>x(J,G,`${k}/${N}/${U}`,_,I))},X=(N,G)=>{let z=r(f,N);if(H(z))for(let[J,U]of Object.entries(z))N==="responses"&&J.startsWith("x-")||($==="schema"&&N==="properties"&&u(U),x(U,G,`${k}/${N}/${ft(J)}`,_,I))};if($==="schema"){if(_!==void 0)return;let N=r(f,"xml");H(N)&&(N.wrapped===!0&&N.attribute===!0&&b(`${k}/xml`,"wrapped and attribute cannot both be true."),(N.wrapped===!0||N.attribute===!0)&&(N.nodeType=N.attribute===!0?"attribute":"element",delete N.wrapped,delete N.attribute)),!I&&f.$ref!==void 0&&x(g(f.$ref,!0),"schema",String(f.$ref),_);let G=f.discriminator;H(G)&&typeof G.propertyName=="string"&&G.defaultMapping===void 0&&!I&&w(f,G.propertyName)===!1&&b(`${k}/discriminator`,"An optional discriminating property needs an explicit defaultMapping.");for(let z of pd)X(z,"schema");for(let z of ud)pe(z,"schema");for(let z of hd)F(z,"schema");return}switch(f.$ref!==void 0&&x(g(f.$ref),$,String(f.$ref),_),$){case"document":{let N=r(f,"paths");if(H(N))for(let[z,J]of Object.entries(N)){if(!z.startsWith("/"))continue;let U=`${k}/paths/${ft(z)}`;y(z,U),x(J,"pathItem",U)}X("webhooks","pathItem"),pe("servers","server");let G=r(f,"components");if(H(G))for(let[z,J]of Object.entries({schemas:"schema",parameters:"parameter",headers:"header",requestBodies:"body",responses:"response",callbacks:"callback",pathItems:"pathItem"})){let U=r(G,z);if(H(U))for(let[bt,Ge]of Object.entries(U))x(Ge,J,`${k}/components/${z}/${ft(bt)}`)}break}case"pathItem":for(let N of["get","put","post","delete","options","head","patch","trace"])F(N,"operation");pe("parameters","parameter"),pe("servers","server");break;case"operation":if(Array.isArray(f.tags))for(let N of f.tags)typeof N=="string"&&s.add(N);pe("parameters","parameter"),pe("servers","server"),F("requestBody","body"),X("responses","response"),X("callbacks","callback");break;case"callback":for(let[N,G]of Object.entries(f))!N.startsWith("x-")&&N!=="$ref"&&x(G,"pathItem",`${k}/${ft(N)}`,_,I);break;case"parameter":(f.in==="path"||f.in==="cookie")&&delete f.allowReserved,F("schema","schema"),X("content","media");break;case"header":F("schema","schema"),X("content","media");break;case"response":X("headers","header"),X("content","media");break;case"body":X("content","media");break;case"media":/\/(?:[^;]+\+)?xml(?:\s*;|$)/i.test(k.slice(k.lastIndexOf("/")+1).replace(/~1/g,"/"))&&p.push({schema:f.schema,path:`${k}/schema`,dialect:_}),F("schema","schema"),X("encoding","encoding");break;case"encoding":X("headers","header");break;case"server":y(f.url,`${k}/url`)}};x(e,"document","#");for(let{schema:f,path:$,dialect:k}of p)v(f,$,{inferredName:!1,propertyName:!1,dialect:k});if(n.length>0&&t==="throw")throw new Ei(n);return s},fd=(e,t)=>{let a=e["x-tagGroups"];if(!Array.isArray(a)||a.length===0||e.tags!==void 0&&!Array.isArray(e.tags))return;let r=e.tags??[];if(!r.every(l=>H(l)&&typeof l.name=="string"))return;let s=new Map(r.map(l=>[l.name,l])),n=new Set,i=new Set;for(let l of a){if(!H(l)||typeof l.name!="string"||!l.name||!Array.isArray(l.tags)||!l.tags.every(c=>typeof c=="string")||Object.keys(l).some(c=>c!=="name"&&c!=="tags")||n.has(l.name)||s.has(l.name)||t.has(l.name))return;n.add(l.name);for(let c of l.tags){if(i.has(c)||s.get(c)?.parent!==void 0)return;i.add(c)}}if([...n].some(l=>i.has(l))||s.size!==r.length)return;let o=[];for(let l of a){o.push({name:l.name,kind:"nav"});for(let c of l.tags)o.push({...s.get(c)??{name:c},parent:l.name})}e.tags=[...o,...r.filter(l=>!i.has(l.name))]},gd=e=>{if(!H(e)||typeof e.openapi!="string")return!1;if(/^3\.1\.\d+$/.test(e.openapi))return!0;if(/^3\.1(?:\D|$)/.test(e.openapi))throw Error(`Cannot upgrade to OpenAPI 3.2: invalid OpenAPI version "${e.openapi}". Expected 3.1.x with a numeric patch version.`);return!1},bd=(e,t="throw")=>(gd(e)&&(fd(e,md(e,t)),e.openapi="3.2.0"),e);function Di(e,t,a){if(t==="3.2"){let s=Sn(bn(ki(e)));try{let n=bd(s,a?.onIncompatible==="ignore"?"ignore":"throw");return a?.onIncompatible==="collect"?{document:n,diagnostics:[]}:n}catch(n){if(a?.onIncompatible!=="collect"||!(n instanceof Ei))throw n;return{document:Di(ki(e),"3.1"),diagnostics:n.errors}}}let r=bn(e);return t==="3.0"?r:Sn(r)}function yd(e){if(!e)return{specification:null,version:void 0};let t=Di(xr(e)?Pe(e).specification:Na(e),"3.1"),{version:a}=En(t);return{specification:t,version:a==="3.1"||a==="3.2"?a:void 0}}async function Ai(e,t){let a=[];if(t?.filesystem?.find(o=>o.filename===e))return{specification:Pe(t.filesystem)?.specification,filesystem:t.filesystem,errors:a};let r=t?.plugins?.find(o=>o.check(e)),s=Na(e);if(r)try{s=Na(await r.get(e))}catch{if(t?.throwOnError)throw Error(se.EXTERNAL_REFERENCE_NOT_FOUND.replace("%s",e));return a.push({code:"EXTERNAL_REFERENCE_NOT_FOUND",message:se.EXTERNAL_REFERENCE_NOT_FOUND.replace("%s",e)}),{specification:null,filesystem:[],errors:a}}if(s===void 0){if(t?.throwOnError)throw Error("No content to load");return a.push({code:"NO_CONTENT",message:se.NO_CONTENT}),{specification:null,filesystem:[],errors:a}}let n=Vr(s,{filename:t?.filename??null}),i=(t?.filename?n.find(o=>o.filename===t?.filename):Pe(n)).references??Dn(s);if(i.length===0)return{specification:Pe(n)?.specification,filesystem:n,errors:a};for(let o of i){let l=t?.plugins?.find(h=>h.check(o));if(!l)continue;let c=l.check(o)&&l.resolvePath?l.resolvePath(e,o):o;if(n.find(h=>h.filename===o))continue;let{filesystem:p,errors:u}=await Ai(c,{...t,filename:o});a.push(...u),n=[...n,...p.map(h=>({...h,isEntrypoint:!1}))]}return{specification:Pe(n)?.specification,filesystem:n,errors:a}}function Ci(e){if(typeof e!="string")return!1;let t=e.trim();return!(t.startsWith("{")||t.startsWith("[")||t.includes(`
`))}function vd(e){let t=typeof window<"u"&&window.location?.href?window.location.href:"http://localhost/",a=e?new URL(e,t):new URL(t);return{check(r){return typeof r!="string"||r.startsWith("#")?!1:Ci(r)},resolvePath(r,s){if(s.startsWith("http://")||s.startsWith("https://"))return s;let n=r&&(r.startsWith("http://")||r.startsWith("https://"))?new URL(r):a;return new URL(s,n).href},async get(r){let s=r.startsWith("http://")||r.startsWith("https://")?r:new URL(r,a).href,n=await fetch(s);if(!n.ok){let i=Error(`Failed to load ${s} (${n.status})`);throw i.status=n.status,i.statusCode=n.status,i.response=n,i.url=s,i}return await n.text()}}}function Ba(e,t=new Set){if(!e||typeof e!="object")return e;let a=e["x-ref"];if(a){if(t.has(a))return{$ref:a};t=new Set(t),t.add(a)}if(Array.isArray(e))return e.map(s=>Ba(s,t));let r={};for(let s of Object.keys(e))s!=="x-ref"&&(r[s]=Ba(e[s],t));return r}async function Fi(e,t=!1,a=!1,r=!1,s="none",n="",i="",o="",l="",c="",p="",u=""){let h;try{this.requestUpdate();let v=await Ai(e,{plugins:[vd(typeof e=="string"&&Ci(e)?e:void 0)]});if(v.errors&&v.errors.length>0&&!v.specification){let $=v.errors[0],k=Error($.message||"Error loading specification");throw k.status=404,k}let x={onDereference:({schema:$,ref:k})=>{$["x-ref"]=k}},f;if(f=v.specification?.swagger&&String(v.specification.swagger).startsWith("2")?Ba((await $i(yd(v.filesystem).specification,x)).schema):Ba((await $i(v.filesystem,x)).schema),await da(0),f&&(f.components||f.info||f.servers||f.tags||f.paths))h=xd(f,c,p,u),this.dispatchEvent(new CustomEvent("before-render",{detail:{spec:h}}));else return{specLoadError:!0,isSpecLoading:!1,info:{title:"Invalid Spec Definition",description:"Invalid Spec Definition",version:""},tags:[]}}catch(v){let x;return x=v.statusCode===404||v.status===404?v.response?.url||v.url?`${v.response?.url||v.url} \u2503 Not Found (${v.response?.status||v.status})`:"Spec Not Found \u2503 404":`Unable to load ${v.response?.url||v.url||(typeof e=="string"?e:"")} \u2503 ${v.response?.status||v.status||v.message}`,{specLoadError:!0,isSpecLoading:!1,info:{title:"Error loading the spec",description:x,version:""},tags:[]}}let m=$d(h,s,t,a),b=wd(h,r),g=h.info?.description?Zr(h.info.description):[],y=[];if(h.components?.securitySchemes){let v=new Set;Object.entries(h.components.securitySchemes).forEach(x=>{if(!v.has(x[0])){v.add(x[0]);let f={securitySchemeId:x[0],...x[1]};f.in="header",f.name="Authorization",f.nameId=x[1].name||x[0],f.user="",f.password="",f.clientId="",f.clientSecret="",f.value="",f.finalKeyValue="",x[1].type==="apiKey"&&(f.in=x[1].in||"header",f.name=x[1].name||"Authorization"),y.push(f)}})}n&&i&&o&&y.push({securitySchemeId:Tt,description:"api-key provided in rapidoc element attributes",type:"apiKey",oAuthFlow:"",name:n,nameId:n,in:i,value:o,finalKeyValue:o}),y.forEach(v=>{v.typeDisplay=v.type==="http"?v.scheme==="basic"?"HTTP Basic":`HTTP Bearer ${v.nameId}`:v.type==="apiKey"?`API Key (${v.name})`:v.type==="oauth2"?`OAuth (${v.securitySchemeId})`:v.type||"None"});let w=[];return h.servers&&Array.isArray(h.servers)&&h.servers.length>0?(h.servers.forEach(v=>{let x=v.url.trim();x.startsWith("http")||x.startsWith("//")||x.startsWith("{")||typeof window<"u"&&window.location?.origin?.startsWith("http")&&(v.url=window.location.origin+v.url,x=v.url),v.variables&&Object.entries(v.variables).forEach(f=>{let $=RegExp(`{${f[0]}}`,"g");x=x.replace($,f[1].default||""),f[1].value=f[1].default||""}),v.computedUrl=x}),l&&h.servers.push({url:l,computedUrl:l})):l?h.servers=[{url:l,computedUrl:l}]:typeof window<"u"&&window.location?.origin?.startsWith("http")?h.servers=[{url:window.location.origin,computedUrl:window.location.origin}]:h.servers=[{url:"http://localhost",computedUrl:"http://localhost"}],w=h.servers,{specLoadError:!1,isSpecLoading:!1,info:h.info,infoDescriptionHeaders:g,tags:m,components:b,externalDocs:h.externalDocs,securitySchemes:y,servers:w}}function xd(e,t="",a="",r=""){let s={},n=r.split(",").map(l=>l.trim().toLowerCase()).filter(Boolean);function i(l,c){if(!t)return!0;let p=`${c} ${l}`.toLowerCase();return a==="regex"?new RegExp(t,"i").test(p):p.includes(t.toLowerCase())}function o(l){return l.some(c=>n.includes(c?.label.toLowerCase()))}return Object.entries(e.paths).forEach(([l,c])=>{let p={};Object.entries(c).forEach(([u,h])=>{let m=h["x-badges"];i(l,u)&&(m&&Array.isArray(m)&&o(m)||(p[u]=h))}),Object.keys(p).length>0&&(s[l]=p)}),e.paths=s,e}function Zr(e){return D.lexer(e).filter(t=>t.type==="heading"&&t.depth<=2)||[]}function wd(e,t=!1){if(!e.components)return[];let a=[];for(let r in e.components){let s=[];for(let l in e.components[r]){let c={show:!0,id:`${r.toLowerCase()}-${l.toLowerCase()}`.replace(ca,"-"),name:l,component:e.components[r][l]};s.push(c)}let n=r,i=r;switch(r){case"schemas":t&&s.sort((l,c)=>l.name.localeCompare(c.name)),i="Schemas",n="Schemas allows the definition of input and output data types. These types can be objects, but also primitives and arrays.";break;case"responses":i="Responses",n="Describes responses from an API Operation, including design-time, static links to operations based on the response.";break;case"parameters":i="Parameters",n="Describes operation parameters. A unique parameter is defined by a combination of a name and location.";break;case"examples":i="Examples",n="List of Examples for operations, can be requests, responses and objects examples.";break;case"requestBodies":i="Request Bodies",n="Describes common request bodies that are used across the API operations.";break;case"headers":i="Headers",n='Headers follows the structure of the Parameters but they are explicitly in "header"';break;case"securitySchemes":i="Security Schemes",n="Defines a security scheme that can be used by the operations. Supported schemes are HTTP authentication, an API key (either as a header, a cookie parameter or as a query parameter), OAuth2's common flows(implicit, password, client credentials and authorization code) as defined in RFC6749, and OpenID Connect Discovery.";break;case"links":i="Links",n="Links represent a possible design-time link for a response. The presence of a link does not guarantee the caller's ability to successfully invoke it, rather it provides a known relationship and traversal mechanism between responses and other operations.";break;case"callbacks":i="Callbacks",n="A map of possible out-of band callbacks related to the parent operation. Each value in the map is a Path Item Object that describes a set of requests that may be initiated by the API provider and the expected responses. The key value used to identify the path item object is an expression, evaluated at runtime, that identifies a URL to use for the callback operation.";break;default:i=r,n=r}let o={show:!0,name:i,description:n,subComponents:s};a.push(o)}return a||[]}function $d(e,t="none",a=!1,r=!1){let s=["get","put","post","delete","patch","head","options"],n=e.tags&&Array.isArray(e.tags)&&e.tags.length>0?e.tags.map(l=>({show:!0,elementId:`tag--${l.name.replace(ca,"-")}`,name:l.name,displayName:l["x-displayName"]||l.name,description:l.description||"",headers:l.description?Zr(l.description):[],paths:[],expanded:l["x-tag-expanded"]!==!1})):[],i=e.paths||{};if(e.webhooks)for(let[l,c]of Object.entries(e.webhooks))c._type="webhook",i[l]=c;for(let l in i){let c=i[l].parameters,p={servers:i[l].servers||[],parameters:i[l].parameters||[]},u=i[l]._type==="webhook";s.forEach(h=>{if(i[l][h]){let m=e.paths[l][h],b=m.tags||[];if(b.length===0)if(a){let g=l.replace(/^\/+|\/+$/g,""),y=g.indexOf("/");y===-1?b.push(g):b.push(g.substring(0,y))}else b.push("General \u2982");b.forEach(g=>{let y,w;e.tags&&(w=e.tags.find(f=>f.name.toLowerCase()===g.toLowerCase())),y=n.find(f=>f.name===g),y||(y={show:!0,elementId:`tag--${g.replace(ca,"-")}`,name:g,description:w?.description||"",headers:w?.description?Zr(w.description):[],paths:[],expanded:!w||w["x-tag-expanded"]!==!1},n.push(y));let v=(m.summary||m.description||`${h.toUpperCase()} ${l}`).trim();v.length>100&&([v]=v.split(/[.|!|?]\s|[\r?\n]/));let x=[];if(x=c?m.parameters?c.filter(f=>{if(!m.parameters.some($=>f.name===$.name&&f.in===$.in))return f}).concat(m.parameters):c.slice(0):m.parameters?m.parameters.slice(0):[],m.callbacks)for(let[f,$]of Object.entries(m.callbacks)){let k=Object.entries($).filter(S=>typeof S[1]=="object")||[];m.callbacks[f]=Object.fromEntries(k)}y.paths.push({show:!0,expanded:!1,isWebhook:u,expandedAtLeastOnce:!1,summary:m.summary||"",description:m.description||"",externalDocs:m.externalDocs,shortSummary:v,method:h,path:l,operationId:m.operationId,elementId:`${h}-${l.replace(ca,"-")}`,servers:m.servers?p.servers.concat(m.servers):p.servers,parameters:x,requestBody:m.requestBody,responses:m.responses,callbacks:m.callbacks,deprecated:m.deprecated,security:m.security,xBadges:m["x-badges"]||void 0,xCodeSamples:m["x-codeSamples"]||m["x-code-samples"]||""})})}})}let o=n.filter(l=>l.paths&&l.paths.length>0);return t!=="none"&&o.forEach(l=>{t==="method"?l.paths.sort((c,p)=>s.indexOf(c.method).toString().localeCompare(s.indexOf(p.method))):t==="summary"?l.paths.sort((c,p)=>c.shortSummary.localeCompare(p.shortSummary)):t==="path"&&l.paths.sort((c,p)=>c.path.localeCompare(p.path)),l.firstPathId=l.paths[0].elementId}),r?o.sort((l,c)=>l.name.localeCompare(c.name)):o}var Ve={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Jr=e=>(...t)=>({_$litDirective$:e,values:t}),Gr=class{constructor(e){}get _$isConnected(){return this._$parent._$isConnected}_$initialize(e,t,a){this.__part=e,this._$parent=t,this.__attributeIndex=a}_$resolve(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}},kd=1,Yr=class extends Gr{constructor(e){if(super(e),this._value=P,e.type!==Ve.CHILD)throw Error(`${this.constructor.directiveName}() can only be used in child bindings`)}render(e){if(e===P||e==null)return this._templateResult=void 0,this._value=e;if(e===Q)return e;if(typeof e!="string")throw Error(`${this.constructor.directiveName}() called with a non-string value`);if(e===this._value)return this._templateResult;this._value=e;let t=[e];return t.raw=t,this._templateResult={_$litType$:this.constructor.resultType,strings:t,values:[]}}};Yr.directiveName="unsafeHTML",Yr.resultType=kd;var R=Jr(Yr);function q(e){if(typeof e!="string")return"";if(typeof window<"u"&&window.Sanitizer&&Element.prototype.setHTML)try{let s=document.createElement("div"),n=new window.Sanitizer({allowAttributes:{"*":["*"]}});return s.setHTML(e,{sanitizer:n}),s.innerHTML}catch{}let t;if(typeof DOMParser<"u")t=new DOMParser().parseFromString(e,"text/html");else return e;let a=t.querySelectorAll("script");for(let s=a.length-1;s>=0;s--)a[s].parentNode.removeChild(a[s]);let r=t.querySelectorAll("*");for(let s=0;s<r.length;s++){let n=r[s];for(let i=n.attributes.length-1;i>=0;i--){let o=n.attributes[i],l=o.name.toLowerCase(),c=o.value.toLowerCase();(l.startsWith("on")||(l==="href"||l==="src")&&(c.includes("javascript:")||c.includes("data:text/html")))&&n.removeAttribute(o.name)}}return t.body.innerHTML}var Sd="731DB1C3F7EA533B85E29492D26AA-1234567890-1234567890",Ed="4FatVDBJKPAo4JgLLaaQFMUcQPn5CrPRvLlaob9PTYc",Ti="rapidoc";function Ke(e,t="",a="",r=""){let s=this.resolvedSpec.securitySchemes?.find(i=>i.securitySchemeId===e);if(!s)return!1;let n="";return s.scheme?.toLowerCase()==="basic"?t&&(n=`Basic ${Buffer.from(`${t}:${a}`,"utf8").toString("base64")}`):r&&(s.value=r,n=`${s.scheme?.toLowerCase()==="bearer"?"Bearer ":""}${r}`),n?(s.finalKeyValue=n,this.requestUpdate(),!0):!1}function Xr(){this.resolvedSpec.securitySchemes?.forEach(e=>{e.user="",e.password="",e.value="",e.finalKeyValue=""}),this.requestUpdate()}function Qr(){return JSON.parse(localStorage.getItem(Ti))||{}}function Oi(e){localStorage.setItem(Ti,JSON.stringify(e))}function Dd(){let e=Qr.call(this);Object.values(e).forEach(t=>{Ke.call(this,t.securitySchemeId,t.username,t.password,t.value)})}function es(e){let t="",a=this.resolvedSpec.securitySchemes.find(r=>r.securitySchemeId===e);if(a){let r=this.shadowRoot.getElementById(`security-scheme-${e}`);if(r){if(a.type&&a.scheme&&a.type==="http"&&a.scheme.toLowerCase()==="basic"){let s=r.querySelector(".api-key-user").value.trim(),n=r.querySelector(".api-key-password").value.trim();Ke.call(this,e,s,n)}else t=r.querySelector(".api-key-input").value.trim(),Ke.call(this,e,"","",t);if(this.persistAuth==="true"){let s=Qr.call(this);s[e]=a,Oi.call(this,s)}}}}function _i(e,t,a="Bearer"){let r=this.resolvedSpec.securitySchemes.find(s=>s.securitySchemeId===e);r.finalKeyValue=`${a.toLowerCase()==="bearer"?"Bearer":a.toLowerCase()==="mac"?"MAC":a} ${t}`,this.requestUpdate()}async function ts(e,t,a,r,s,n,i,o,l="header",c=null,p=null,u=null){let h=o?o.querySelector(".oauth-resp-display"):void 0,m=new URLSearchParams,b=new Headers;m.append("grant_type",s),s==="authorization_code"&&(m.append("client_id",t),m.append("client_secret",a)),s!=="client_credentials"&&s!=="password"&&m.append("redirect_uri",r),n&&(m.append("code",n),m.append("code_verifier",Sd)),l==="header"?b.set("Authorization",`Basic ${Buffer.from(`${t}:${a}`,"utf8").toString("base64")}`):s!=="authorization_code"&&(m.append("client_id",t),m.append("client_secret",a)),s==="password"&&(m.append("username",p),m.append("password",u)),c&&m.append("scope",c);try{let g=await fetch(e,{method:"POST",headers:b,body:m}),y=await g.json();if(g.ok){if(y.token_type&&y.access_token)return _i.call(this,i,y.access_token,y.token_type),h&&(h.innerHTML='<span style="color:var(--green)">Access Token Received</span>'),!0}else return h&&(h.innerHTML=`<span style="color:var(--red)">${y.error_description||y.error_description||"Unable to get access token"}</span>`),!1}catch{return h&&(h.innerHTML='<span style="color:var(--red)">Failed to get access token</span>'),!1}}async function Ad(e,t,a,r,s,n,i,o,l,c){sessionStorage.removeItem("winMessageEventActive"),t.close(),!e.data.fake&&(e.data,e.data.error,e.data&&(e.data.responseType==="code"?ts.call(this,a,r,s,n,i,e.data.code,l,c,o):e.data.responseType==="token"&&_i.call(this,l,e.data.access_token,e.data.token_type)))}async function Cd(e,t,a,r,s){let n=s.target.closest(".oauth-flow"),i=n.querySelector(".oauth-client-id")?n.querySelector(".oauth-client-id").value.trim():"",o=n.querySelector(".oauth-client-secret")?n.querySelector(".oauth-client-secret").value.trim():"",l=n.querySelector(".api-key-user")?n.querySelector(".api-key-user").value.trim():"",c=n.querySelector(".api-key-password")?n.querySelector(".api-key-password").value.trim():"",p=n.querySelector(".oauth-send-client-secret-in")?n.querySelector(".oauth-send-client-secret-in").value.trim():"header",u=[...n.querySelectorAll(".scope-checkbox:checked")],h=n.querySelector(`#${e}-pkce`),m=`${Math.random().toString(36).slice(2,9)}random${Math.random().toString(36).slice(2,9)}`,b=`${Math.random().toString(36).slice(2,9)}random${Math.random().toString(36).slice(2,9)}`,g=new URL(`${window.location.origin}${window.location.pathname.substring(0,window.location.pathname.lastIndexOf("/"))}/${this.oauthReceiver}`),y="",w="",v;if([...n.parentNode.querySelectorAll(".oauth-resp-display")].forEach(x=>{x.innerHTML=""}),t==="authorizationCode"||t==="implicit"){let x=new URL(a);t==="authorizationCode"?(y="authorization_code",w="code"):t==="implicit"&&(w="token");let f=new URLSearchParams(x.search),$=u.map(k=>k.value).join(" ");$&&f.set("scope",$),f.set("client_id",i),f.set("redirect_uri",g.toString()),f.set("response_type",w),f.set("state",m),f.set("nonce",b),h&&h.checked&&(f.set("code_challenge",Ed),f.set("code_challenge_method","S256")),f.set("show_dialog",!0),x.search=f.toString(),sessionStorage.getItem("winMessageEventActive")==="true"&&window.postMessage({fake:!0},this),setTimeout(()=>{v=window.open(x.toString()),v&&(sessionStorage.setItem("winMessageEventActive","true"),window.addEventListener("message",k=>Ad.call(this,k,v,r,i,o,g.toString(),y,p,e,n),{once:!0}))},10)}else if(t==="clientCredentials"){y="client_credentials";let x=u.map(f=>f.value).join(" ");ts.call(this,r,i,o,g.toString(),y,"",e,n,p,x)}else if(t==="password"){y="password";let x=u.map(f=>f.value).join(" ");ts.call(this,r,i,o,g.toString(),y,"",e,n,p,x,l,c)}}function Fd(e,t,a,r,s,n=[],i="header",o=void 0,l="true"){let{authorizationUrl:c,tokenUrl:p,refreshUrl:u}=s,h=s["x-pkce-only"]||!1,m=y=>y.indexOf("://")>0||y.indexOf("//")===0,b=new URL(this.selectedServer?.computedUrl).origin;u&&!m(u)&&(u=this.selectedServer?.computedUrl.trim().endsWith("/")&&!u.trim().startsWith("/")?`${this.selectedServer?.computedUrl.trim()}${p.trim()}`:`${b}/${u.replace(/^\//,"")}`),p&&!m(p)&&(p=this.selectedServer?.computedUrl.trim().endsWith("/")&&!p.trim().startsWith("/")?`${this.selectedServer?.computedUrl.trim()}${p.trim()}`:`${b}/${p.replace(/^\//,"")}`),c&&!m(c)&&(c=this.selectedServer?.computedUrl.trim().endsWith("/")&&!c.trim().startsWith("/")?`${this.selectedServer?.computedUrl.trim()}${c.trim()}`:`${b}/${c.replace(/^\//,"")}`);let g;return g=e==="authorizationCode"?"Authorization Code Flow":e==="clientCredentials"?"Client Credentials Flow":e==="implicit"?"Implicit Flow":e==="password"?"Password Flow":e,d`
    <div class="oauth-flow ${e}" style="padding: 12px 0; margin-bottom:12px;">
      <div class="tiny-title upper" style="margin-bottom:8px;">${g}</div>
      ${c?d`<div style="margin-bottom:5px">
              <span style="width:75px; display: inline-block;">Auth URL</span> <span class="mono-font"> ${c} </span>
            </div>`:""}
      ${p?d`<div style="margin-bottom:5px">
              <span style="width:75px; display: inline-block;">Token URL</span> <span class="mono-font">${p}</span>
            </div>`:""}
      ${u?d`<div style="margin-bottom:5px">
              <span style="width:75px; display: inline-block;">Refresh URL</span> <span class="mono-font">${u}</span>
            </div>`:""}
      ${e==="authorizationCode"||e==="clientCredentials"||e==="implicit"||e==="password"?d` ${s.scopes?d` <span> Scopes </span>
                    <div
                      class="oauth-scopes"
                      part="section-auth-scopes"
                      style="width:100%; display:flex; flex-direction:column; flex-wrap:wrap; margin:0 0 10px 24px"
                    >
                      ${Object.entries(s.scopes).map((y,w)=>d`<div class="m-checkbox" style="display:inline-flex; align-items:center">
                            <input
                              type="checkbox"
                              part="checkbox checkbox-auth-scope"
                              class="scope-checkbox"
                              id="${r}${e}${w}"
                              ?checked="${n.includes(y[0])}"
                              value="${y[0]}"
                            />
                            <label for="${r}${e}${w}" style="margin-left:5px; cursor:pointer">
                              <span class="mono-font">${y[0]}</span>
                              ${y[0]===y[1]?"":` - ${y[1]||""}`}
                            </label>
                          </div>`)}
                    </div>`:""}
            ${e==="password"&&l==="true"?d` <div style="margin:5px 0">
                    <input
                      type="text"
                      value=""
                      placeholder="username"
                      spellcheck="false"
                      class="oauth2 ${e} ${r} api-key-user"
                      part="textbox textbox-username"
                      id="input-${r}-${e}-api-key-user"
                    />
                    <input
                      type="password"
                      value=""
                      placeholder="password"
                      spellcheck="false"
                      class="oauth2 ${e} ${r} api-key-password"
                      style="margin:0 5px;"
                      part="textbox textbox-password"
                      id="input-${r}-${e}-api-key-password"
                    />
                  </div>`:""}
            ${l==="true"?d`<div>
                      ${e==="authorizationCode"?d`<div style="margin: 16px 0 4px">
                              <input
                                type="checkbox"
                                part="checkbox checkbox-auth-scope"
                                id="${r}-pkce"
                                checked
                                ?disabled=${h}
                              />
                              <label for="${r}-pkce" style="margin:0 16px 0 4px; line-height:24px; cursor:pointer">
                                Send Proof Key for Code Exchange (PKCE)
                              </label>
                            </div>`:""}
                      <input
                        type="text"
                        part="textbox textbox-auth-client-id"
                        value="${t||""}"
                        placeholder="client-id"
                        spellcheck="false"
                        class="oauth2 ${e} ${r} oauth-client-id"
                      />
                      ${e==="authorizationCode"||e==="clientCredentials"||e==="password"?d` <input
                                id="${r}-${e}-oauth-client-secret"
                                type="password"
                                part="textbox textbox-auth-client-secret"
                                value="${a||""}"
                                placeholder="client-secret"
                                spellcheck="false"
                                class="oauth2 ${e} ${r}
                      oauth-client-secret"
                                style="margin:0 5px;${h?"display:none;":""}"
                              />
                              <select
                                style="margin-right:5px;${h?"display:none;":""}"
                                class="${e} ${r} oauth-send-client-secret-in"
                              >
                                ${!o||o.includes("header")?d`<option value="header" .selected=${i==="header"}>Authorization Header</option>`:""}
                                ${!o||o.includes("request-body")?d` <option value="request-body" .selected=${i==="request-body"}>
                                        Request Body
                                      </option>`:""}
                              </select>`:""}
                      ${e==="authorizationCode"||e==="clientCredentials"||e==="implicit"||e==="password"?d` <button
                              class="m-btn thin-border"
                              part="btn btn-outline"
                              @click="${y=>{Cd.call(this,r,e,c,p,y)}}"
                            >
                              GET TOKEN
                            </button>`:""}
                    </div>
                    <div class="oauth-resp-display red-text small-font-size"></div>`:""}`:""}
    </div>
  `}function Td(e){let t=this.resolvedSpec.securitySchemes?.find(a=>a.securitySchemeId===e);if(t.user="",t.password="",t.value="",t.finalKeyValue="",this.persistAuth==="true"){let a=Qr.call(this);delete a[t.securitySchemeId],Oi.call(this,a)}this.requestUpdate()}function Ni(e="true"){if(!this.resolvedSpec)return"";let t=this.resolvedSpec.securitySchemes?.filter(a=>a.finalKeyValue);if(t)return d`
    <section
      id="auth"
      part="section-auth"
      style="text-align:left; direction:ltr; margin-top:24px; margin-bottom:24px;"
      class="observe-me ${"read focused".includes(this.renderStyle)?"section-gap--read-mode":"section-gap "}"
    >
      <div class="sub-title regular-font">AUTHENTICATION</div>
      ${e==="true"?d`<div class="small-font-size" style="display:flex; align-items: center; min-height:30px">
              ${t.length>0?d`<div class="blue-text">${t.length} API key applied</div>
                      <div style="flex:1"></div>
                      <button
                        class="m-btn thin-border"
                        part="btn btn-outline"
                        @click=${()=>{Xr.call(this)}}
                      >
                        CLEAR ALL API KEYS
                      </button>`:d`<div class="red-text">No API key applied</div>`}
            </div>`:""}
      ${this.resolvedSpec.securitySchemes&&this.resolvedSpec.securitySchemes.length>0?d` <table role="presentation" id="auth-table" class="m-table padded-12" style="width:100%;">
              ${this.resolvedSpec.securitySchemes.filter(a=>a.type).map(a=>d`
                    <tr id="security-scheme-${a.securitySchemeId}" class="${a.type.toLowerCase()}">
                      <td style="max-width:500px; overflow-wrap: break-word;">
                        <div style="line-height:28px; margin-bottom:5px;">
                          <span style="font-weight:bold; font-size:var(--font-size-regular)">${a.typeDisplay}</span>
                          ${a.finalKeyValue?d`<span class="blue-text"> ${a.finalKeyValue?"Key Applied":""} </span>
                                  <button
                                    class="m-btn thin-border small"
                                    part="btn btn-outline"
                                    @click=${()=>{Td.call(this,a.securitySchemeId)}}
                                  >
                                    REMOVE
                                  </button>`:""}
                        </div>
                        ${a.description?d`<div class="m-markdown">${R(q(D(a.description||"")))}</div>`:""}
                        ${a.type.toLowerCase()==="apikey"?d` <div style="margin-bottom:5px">Send <code>${a.name}</code> in <code>${a.in}</code></div>
                                ${e==="true"?d` <div style="max-height:28px;">
                                        ${a.in==="cookie"?d`<span class="gray-text" style="font-size::var(--font-size-small)">
                                                cookies cannot be set from here</span
                                              >`:d` <input
                                                  type="text"
                                                  value="${a.value}"
                                                  class="${a.type} ${a.securitySchemeId} api-key-input"
                                                  placeholder="api-token"
                                                  spellcheck="false"
                                                  id="${a.type}-${a.securitySchemeId}-api-key-input"
                                                />
                                                <button
                                                  class="m-btn thin-border"
                                                  style="margin-left:5px;"
                                                  part="btn btn-outline"
                                                  @click="${r=>{es.call(this,a.securitySchemeId,r)}}"
                                                >
                                                  ${a.finalKeyValue?"UPDATE":"SET"}
                                                </button>`}
                                      </div>`:""}`:""}
                        ${a.type.toLowerCase()==="http"&&a.scheme?.toLowerCase()==="basic"?d` <div style="margin-bottom:5px">
                                  Send <code>Authorization</code> in <code>header</code> containing the word <code>Basic</code> followed by
                                  a space and a base64 encoded string of <code>username:password</code>.
                                </div>
                                ${e==="true"?d` <div>
                                        <input
                                          type="text"
                                          value="${a.user}"
                                          placeholder="username"
                                          spellcheck="false"
                                          class="${a.type} ${a.securitySchemeId} api-key-user"
                                          style="width:100px"
                                          id="input-${a.type}-${a.securitySchemeId}-api-key-user"
                                        />
                                        <input
                                          type="password"
                                          value="${a.password}"
                                          placeholder="password"
                                          spellcheck="false"
                                          class="${a.type} ${a.securitySchemeId} api-key-password"
                                          style="width:100px; margin:0 5px;"
                                          id="input-${a.type}-${a.securitySchemeId}-api-key-password"
                                        />
                                        <button
                                          class="m-btn thin-border"
                                          @click="${r=>{es.call(this,a.securitySchemeId,r)}}"
                                          part="btn btn-outline"
                                        >
                                          ${a.finalKeyValue?"UPDATE":"SET"}
                                        </button>
                                      </div>`:""}`:""}
                        ${a.type.toLowerCase()==="http"&&a.scheme?.toLowerCase()==="bearer"?d`<div style="margin-bottom:5px">
                                  Send <code>Authorization</code> in <code>header</code> containing the word <code>Bearer</code> followed by
                                  a space and token value
                                </div>
                                ${e==="true"?d` <div style="max-height:28px;">
                                        <input
                                          type="text"
                                          value="${a.value}"
                                          class="${a.type} ${a.securitySchemeId} api-key-input"
                                          placeholder="api-token"
                                          spellcheck="false"
                                          id="${a.type}-${a.securitySchemeId}-api-key-input"
                                        />
                                        <button
                                          class="m-btn thin-border"
                                          style="margin-left:5px;"
                                          part="btn btn-outline"
                                          @click="${r=>{es.call(this,a.securitySchemeId,r)}}"
                                        >
                                          ${a.finalKeyValue?"UPDATE":"SET"}
                                        </button>
                                      </div>`:""}`:""}
                      </td>
                    </tr>
                    ${a.type.toLowerCase()==="oauth2"?d`<tr>
                            <td style="border:none; padding-left:48px">
                              ${Object.keys(a.flows).map(r=>Fd.call(this,r,a.flows[r]["x-client-id"]||a["x-client-id"]||"",a.flows[r]["x-client-secret"]||a["x-client-secret"]||"",a.securitySchemeId,a.flows[r],a.flows[r]["x-default-scopes"]||a["x-default-scopes"],a.flows[r]["x-receive-token-in"]||a["x-receive-token-in"],a.flows[r]["x-receive-token-in-options"]||a["x-receive-token-in-options"],e))}
                            </td>
                          </tr>`:""}
                  `)}
            </table>`:""}
      <slot name="auth"></slot>
    </section>
  `}function Bi(e){if(this.resolvedSpec.securitySchemes&&e){let t=[];if(Array.isArray(e)){if(e.length===0)return""}else return"";return e.forEach(a=>{let r=[],s=[];Object.keys(a).length===0?t.push({securityTypes:"None",securityDefs:[]}):(Object.keys(a).forEach(n=>{let i="",o=this.resolvedSpec.securitySchemes.find(l=>l.securitySchemeId===n);a[n]&&Array.isArray(a[n])&&(i=a[n].join(", ")),o&&(s.push(o.typeDisplay),r.push({...o,scopes:i}))}),t.push({securityTypes:s.length>1?`${s[0]} + ${s.length-1} more`:s[0],securityDefs:r}))}),d`<div style="position:absolute; top:3px; right:2px; font-size:var(--font-size-small); line-height: 1.5;">
      <div style="position:relative; display:flex; min-width:350px; max-width:700px; justify-content: flex-end;">
        <svg width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" fill="none" style="stroke:var(--fg3)">
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <circle cx="12" cy="16" r="1" />
          <path d="M8 11v-4a4 4 0 0 1 8 0v4" />
        </svg>
        ${t.map((a,r)=>d`
            ${a.securityTypes?d`
                    ${r===0?"":d`<div style="padding:3px 4px;">OR</div>`}
                    <div class="tooltip">
                      <div style="padding:2px 4px; white-space:nowrap; text-overflow:ellipsis;max-width:150px; overflow:hidden;">
                        ${this.updateRoute==="true"&&this.allowAuthentication==="true"?d`<a part="anchor anchor-operation-security" href="#auth"> ${a.securityTypes} </a>`:d`${a.securityTypes}`}
                      </div>
                      <div
                        class="tooltip-text"
                        style="position:absolute; color: var(--fg); top:26px; right:0; border:1px solid var(--border-color);padding:2px 4px; display:block;"
                      >
                        ${a.securityDefs.length>1?d`<div>Requires <b>all</b> of the following</div>`:""}
                        <div style="padding-left: 8px">
                          ${a.securityDefs.map((s,n)=>{let i=d`${s.scopes===""?"":d` <div>
                                    <b>Required scopes:</b>
                                    <br />
                                    <div style="margin-left:8px">
                                      ${s.scopes.split(",").map((o,l)=>d`${l===0?"":"\u2503"}<span>${o}</span>`)}
                                    </div>
                                  </div>`}`;return d` ${s.type==="oauth2"?d` <div>
                                    ${a.securityDefs.length>1?d`<b>${n+1}.</b> &nbsp;`:"Needs"} OAuth Token
                                    <span style="font-family:var(--font-mono); color:var(--primary-color);">
                                      ${s.securitySchemeId}
                                    </span>
                                    in <b>Authorization header</b>
                                    ${i}
                                  </div>`:s.type==="http"?d`<div>
                                      ${a.securityDefs.length>1?d`<b>${n+1}.</b> &nbsp;`:d`Requires`}
                                      ${s.scheme==="basic"?"Base 64 encoded username:password":d`Bearer Token <b> ${s.nameId} </b>`}
                                      in <b>Authorization header</b>
                                      ${i}
                                    </div>`:d`<div>
                                      ${a.securityDefs.length>1?d`<b>${n+1}.</b> &nbsp;`:d`Requires`}
                                      ${d`Token in <b>${s.name} ${s.in}</b>`} ${i}
                                    </div>`}`})}
                        </div>
                      </div>
                    </div>
                  `:""}
          `)}
      </div>
    </div> `}return""}function Ii(e){return d`
  <section class="table-title" style="margin-top:24px;">CODE SAMPLES</div>
  <div part="tab-panel" class="tab-panel col"
    @click="${t=>{if(!t.target.classList.contains("tab-btn"))return;let a=t.target.dataset.tab,r=[...t.currentTarget.querySelectorAll(".tab-btn")],s=[...t.currentTarget.querySelectorAll(".tab-content")];r.forEach(n=>n.classList[n.dataset.tab===a?"add":"remove"]("active")),s.forEach(n=>{n.style.display=n.dataset.tab===a?"block":"none"}),na(t.currentTarget.getRootNode()?.host?.shadowRoot||t.currentTarget)}}">
    <div part="tab-btn-row" class="tab-buttons row" style="width:100; overflow">
      ${e.map((t,a)=>d`<button part="tab-btn" class="tab-btn ${a===0?"active":""}" data-tab="${t.lang}${a}">${t.label||t.lang}</button>`)}
    </div>
    ${e.map((t,a)=>d`<div class="tab-content m-markdown" style="display:${a===0?"block":"none"}" data-tab="${t.lang}${a}">
          <button
            class="toolbar-btn"
            part="btn btn-fill btn-copy"
            style="position:absolute; top:12px; right:8px"
            @click="${r=>{Ot(t.source,r)}}"
          >
            Copy
          </button>
          <pre><code class="language-${t.lang?.toLowerCase()}">${t.source}</code></pre>
        </div>`)}
  </div>  
  </section>`}function Li(e){return d`
    <div class="req-res-title" style="margin-top:12px">CALLBACKS</div>
    ${Object.entries(e).map(t=>d`
        <div class="tiny-title" style="padding: 12px; border:1px solid var(--light-border-color)">
          ${t[0]}
          ${Object.entries(t[1]).map(a=>d`
              <div class="mono-font small-font-size" style="display:flex; margin-left:16px;">
                <div style="width:100%">
                  ${Object.entries(a[1]).map(r=>d`
                      <div>
                        <div style="margin-top:12px;">
                          <div
                            class="method method-fg ${r[0]}"
                            style="width:70px; border:none; margin:0; padding:0; line-height:20px; vertical-align: baseline;text-align:left"
                          >
                            <span style="font-size:20px;"> &#x2944; </span>
                            ${r[0]}
                          </div>
                          <span style="line-height:20px; vertical-align: baseline;">${a[0]}</span>
                        </div>
                        <div class="expanded-req-resp-container">
                          <api-request
                            class="${this.renderStyle}-mode callback"
                            style="width:100%;"
                            callback="true"
                            method="${r[0]||""}"
                            path="${a[0]||""}"
                            .parameters="${r[1]?.parameters||""}"
                            .request_body="${r[1]?.requestBody||""}"
                            fill-request-fields-with-example="${this.fillRequestFieldsWithExample}"
                            allow-try="false"
                            render-style="${this.renderStyle}"
                            schema-style="${this.schemaStyle}"
                            active-schema-tab="${this.defaultSchemaTab}"
                            schema-expand-level="${this.schemaExpandLevel}"
                            schema-description-expanded="${this.schemaDescriptionExpanded}"
                            allow-schema-description-expand-toggle="${this.allowSchemaDescriptionExpandToggle}"
                            schema-hide-read-only="false"
                            schema-hide-write-only="${this.schemaHideWriteOnly==="never"?"false":"true"}"
                            fetch-credentials="${this.fetchCredentials}"
                            exportparts="wrap-request-btn:wrap-request-btn, btn:btn, btn-fill:btn-fill, btn-outline:btn-outline, btn-try:btn-try, btn-clear:btn-clear, btn-clear-resp:btn-clear-resp,
                            tab-panel:tab-panel, tab-btn:tab-btn, tab-btn-row:tab-btn-row, tab-coontent:tab-content, 
                            file-input:file-input, textbox:textbox, textbox-param:textbox-param, textarea:textarea, textarea-param:textarea-param, 
                            anchor:anchor, anchor-param-example:anchor-param-example, schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
                          >
                          </api-request>

                          <api-response
                            style="width:100%;"
                            class="${this.renderStyle}-mode"
                            callback="true"
                            .responses="${r[1]?.responses}"
                            render-style="${this.renderStyle}"
                            schema-style="${this.schemaStyle}"
                            active-schema-tab="${this.defaultSchemaTab}"
                            schema-expand-level="${this.schemaExpandLevel}"
                            schema-description-expanded="${this.schemaDescriptionExpanded}"
                            allow-schema-description-expand-toggle="${this.allowSchemaDescriptionExpandToggle}"
                            schema-hide-read-only="${this.schemaHideReadOnly==="never"?"false":"true"}"
                            schema-hide-write-only="false"
                            exportparts="btn:btn, btn-response-status:btn-response-status, btn-selected-response-status:btn-selected-response-status, btn-fill:btn-fill, btn-copy:btn-copy,
                            tab-panel:tab-panel, tab-btn:tab-btn, tab-btn-row:tab-btn-row, tab-coontent:tab-content, 
                            schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
                          >
                          </api-response>
                        </div>
                      </div>
                    `)}
                </div>
              </div>
            `)}
        </div>
      `)}
  `}var Od={},Ia=Jr(class extends Gr{constructor(){super(...arguments),this._previousValue=Od}render(e,t){return t()}update(e,[t,a]){if(Array.isArray(t)){if(Array.isArray(this._previousValue)&&this._previousValue.length===t.length&&t.every((r,s)=>r===this._previousValue[s]))return Q}else if(this._previousValue===t)return Q;return this._previousValue=Array.isArray(t)?Array.from(t):t,this.render(t,a)}}),{_ChildPart:mp}=Oo;window.ShadyDOM?.inUse&&window.ShadyDOM?.noPatch===!0&&window.ShadyDOM.wrap;var _d=e=>e.strings===void 0,Nd={},Bd=(e,t=Nd)=>e._$committedValue=t,as=Jr(class extends Gr{constructor(e){if(super(e),e.type!==Ve.PROPERTY&&e.type!==Ve.ATTRIBUTE&&e.type!==Ve.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!_d(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===Q||t===P)return t;let a=e.element,r=e.name;if(e.type===Ve.PROPERTY){if(t===a[r])return Q}else if(e.type===Ve.BOOLEAN_ATTRIBUTE){if(!!t===a.hasAttribute(r))return Q}else if(e.type===Ve.ATTRIBUTE&&a.getAttribute(r)===String(t))return Q;return Bd(e),t}}),Id=e=>e??P;function Ld(e,{indentor:t="  ",textNodesOnSameLine:a=!0}={}){if(!e||typeof e!="string")return"";let r=e.split(/(<[^>]+>)/g).map(i=>i.trim()).filter(Boolean),s=0,n=[];for(let i=0;i<r.length;i++){let o=r[i],l=/^<\//.test(o),c=/\/>$/.test(o),p=/^<[^/!?]/.test(o)&&!c;l&&(s=Math.max(0,s-1));let u=t.repeat(s);if(a&&p&&i+2<r.length&&!r[i+1].startsWith("<")&&r[i+2].startsWith("</")){let h=o.match(/^<([a-zA-Z0-9_\-:]+)/)?.[1],m=r[i+2].match(/^<\/([a-zA-Z0-9_\-:]+)/)?.[1];if(h&&m&&h===m){n.push(`${u}${o}${r[i+1]}${r[i+2]}`),i+=2;continue}}n.push(`${u}${o}`),p&&s++}return n.join(`
`)}var La=M`
  .border-top {
    border-top: 1px solid var(--border-color);
  }
  .border {
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
  }
  .light-border {
    border: 1px solid var(--light-border-color);
    border-radius: var(--border-radius);
  }
  .pad-8-16 {
    padding: 8px 16px;
  }
  .pad-top-8 {
    padding-top: 8px;
  }
  .mar-top-8 {
    margin-top: 8px;
  }
`;function Rd(e){if(!e||typeof e!="string")return"";try{let t=e.trim();t.startsWith("^")&&(t=t.slice(1)),t.endsWith("$")&&!t.endsWith("\\$")&&(t=t.slice(0,-1)),t=t.replace(/\((?:\?:)?([^()|]+)(?:\|[^()]+)*\)/g,"$1");let a=/(\[[^\]]+\]|\\[dwsDWS]|\\[^]|\.|[^\\[\]{}()+*?|])(?:\{(\d+)(?:,\d*)?\}|([+*?]))?/g,r="",s;for(;(s=a.exec(t))!==null;){let n=s[1],i=s[2],o=s[3],l=1;i===void 0?o==="+"?l=1:(o==="*"||o==="?")&&(l=0):l=parseInt(i,10),l=Math.min(Math.max(0,l),50);let c="a";if(n==="\\d")c="0";else if(n==="\\D")c="a";else if(n==="\\w")c="a";else if(n==="\\W")c="_";else if(n==="\\s")c=" ";else if(n==="\\S")c="a";else if(n===".")c="a";else if(n.startsWith("\\"))c=n.slice(1);else if(n.startsWith("[")){let p=n.slice(1,-1);p.startsWith("^")?c=p.includes("a")?"0":"a":/[1-9]/.test(p)&&!p.includes("0")?c="1":/[0-9]/.test(p)&&!/[a-zA-Z]/.test(p)||/[0-9]/.test(p)&&/[a-fA-F]/.test(p)&&!/[g-zG-Z]/.test(p)?c="0":/[A-Z]/.test(p)&&!/[a-z]/.test(p)?c="A":/[a-z]/.test(p)?c="a":p.length>0&&(c=p[0])}else c=n;r+=c.repeat(l)}return r||e}catch{return e}}function Ze(e){if(e===void 0)return"";if(e===null)return"null";if(e==="")return"\u2205";if(typeof e=="boolean"||typeof e=="number")return`${e}`;if(Array.isArray(e))return e.map(t=>t===null?"null":t===""?"\u2205":t.toString().replace(/^ +| +$/g,a=>"\u25CF".repeat(a.length))||"").join(", ");if(typeof e=="object"){let t=Object.keys(e);return`{ ${t[0]}:${e[t[0]]}${t.length>1?",":""} ... }`}return e.toString().replace(/^ +| +$/g,t=>"\u25CF".repeat(t.length))||""}function Oe(e){if(!e)return;let t="",a="";if(e.$ref){let s=e.$ref.lastIndexOf("/");t=`{recursive: ${e.$ref.substring(s+1)}} `}else e.type?(t=Array.isArray(e.type)?e.type.join("\u2503"):e.type,(e.format||e.enum||e.const)&&(t=t.replace("string",e.enum?"enum":e.const?"const":e.format)),e.nullable&&(t+="\u2503null")):t=e.const?"const":Object.keys(e).length===0?"any":"{missing-type-info}";let r={type:t,format:e.format||"",pattern:e.pattern&&!e.enum?e.pattern:"",readOrWriteOnly:e.readOnly?"\u{1F181}":e.writeOnly?"\u{1F186}":"",deprecated:e.deprecated?"\u274C":"",examples:e.examples||e.example,default:Ze(e.default),description:e.description||"",constrain:"",allowedValues:"",arrayType:"",html:""};if(r.type==="{recursive}"?r.description=e.$ref.substring(e.$ref.lastIndexOf("/")+1):(r.type==="{missing-type-info}"||r.type==="any")&&(r.description=r.description||""),r.allowedValues=e.const?e.const:Array.isArray(e.enum)?e.enum.map(s=>Ze(s)).join("\u2503"):"",t==="array"&&e.items){let s=e.items?.type,n=Ze(e.items.default);r.arrayType=`${e.type} of ${Array.isArray(s)?s.join(""):s}`,r.default=n,r.allowedValues=e.items.const?e.const:Array.isArray(e.items?.enum)?e.items.enum.map(i=>Ze(i)).join("\u2503"):""}return t.match(/integer|number/g)&&((e.minimum!==void 0||e.exclusiveMinimum!==void 0)&&(a+=e.minimum===void 0?`More than ${e.exclusiveMinimum}`:`Min ${e.minimum}`),(e.maximum!==void 0||e.exclusiveMaximum!==void 0)&&(a+=e.maximum===void 0?`${a?"\u2503":""}Less than ${e.exclusiveMaximum}`:`${a?"\u2503":""}Max ${e.maximum}`),e.multipleOf!==void 0&&(a+=`${a?"\u2503":""} multiple of ${e.multipleOf}`)),t.match(/string/g)&&(e.minLength!==void 0&&e.maxLength!==void 0?a+=`${a?"\u2503":""}${e.minLength} to ${e.maxLength} chars`:e.minLength===void 0?e.maxLength!==void 0&&(a+=`Max ${a?"\u2503":""}${e.maxLength} chars`):a+=`${a?"\u2503":""}Min ${e.minLength} chars`),r.constrain=a,r.html=`${r.type}~|~${r.readOrWriteOnly}~|~${r.constrain}~|~${r.default}~|~${r.allowedValues}~|~${r.pattern}~|~${r.description}~|~${e.title||""}~|~${r.deprecated?"deprecated":""}`,r}function le(e){if(typeof e=="object"&&!Array.isArray(e)){if(e.value!==void 0)return{Example:{...e}};let t=Object.entries(e).filter(([a,r])=>r.value!==void 0);return t.length===0?void 0:Object.fromEntries(t)}return Array.isArray(e)?e.reduce((t,a,r)=>(t[`Example${r+1}`]={value:a},t),{}):e?{Example:{value:e}}:void 0}function Ri(e,t="string"){if(!e)return{exampleVal:"",exampleList:[]};if(e.constructor===Object){let a=Object.values(e).filter(r=>r["x-example-show-value"]!==!1).map(r=>({value:typeof r.value=="boolean"||typeof r.value=="number"?`${r.value}`:r.value||"",printableValue:Ze(r.value),summary:r.summary||"",description:r.description||""}));return{exampleVal:a.length>0?a[0].value:"",exampleList:a}}if(Array.isArray(e)||(e=e?[e]:[]),e.length===0)return{exampleVal:"",exampleList:[]};if(t==="array"){let[a]=e;return{exampleVal:a,exampleList:e.map(r=>({value:r,printableValue:Ze(r)}))}}return{exampleVal:e[0].toString(),exampleList:e.map(a=>({value:a.toString(),printableValue:Ze(a)}))}}function jd(e){return e.some(t=>t.summary?.length>0||t.description?.length>0)}function ce(e){let t;return e&&(t=e.examples&&e.examples.length>=1?e.examples[0]:e.example),t}function Ra(e){let t=ce(e);if(t==="")return"";if(t===null)return null;if(t===0)return 0;if(t===!1)return!1;if(t instanceof Date)switch(e.format.toLowerCase()){case"date":return t.toISOString().split("T")[0];case"time":return t.toISOString().split("T")[1];default:return t.toISOString()}if(t)return t;if(Object.keys(e).length===0)return null;if(e.$ref)return{};if(e.const===!1||e.const===0||e.const===null||e.const===""||e.const)return e.const;if(e.default)return e.default;let a=Array.isArray(e.type)?e.type[0]:e.type;if(!a)return null;if(a.match(/^integer|^number/g)){let r=Number.isNaN(Number(e.multipleOf))?void 0:Number(e.multipleOf),s=Number.isNaN(Number(e.maximum))?void 0:Number(e.maximum),n=Number.isNaN(Number(e.minimum))?Number.isNaN(Number(e.exclusiveMinimum))?s||0:Number(e.exclusiveMinimum)+(a.startsWith("integer")?1:.001):Number(e.minimum);return r?r>=n?r:n%r===0?n:Math.ceil(n/r)*r:n}if(a.match(/^boolean/g))return!1;if(a.match(/^null/g))return null;if(a.match(/^string/g)){if(e.enum)return e.enum[0];if(e.const)return e.const;if(e.pattern)try{return Rd(e.pattern)}catch{return e.pattern}if(e.format){let r=`${Date.now().toString(16)}${Math.random().toString(16)}0`.repeat(16);switch(e.format.toLowerCase()){case"url":case"uri":return"http://example.com";case"date":return new Date(0).toISOString().split("T")[0];case"time":return new Date(0).toISOString().split("T")[1];case"date-time":return new Date(0).toISOString();case"duration":return"P3Y6M4DT12H30M5S";case"email":case"idn-email":return"user@example.com";case"hostname":case"idn-hostname":return"www.example.com";case"ipv4":return"198.51.100.42";case"ipv6":return"2001:0db8:5b96:0000:0000:426f:8e17:642a";case"uuid":return[r.substring(0,8),r.substring(8,12),`4000-8${r.substring(13,16)}`,r.substring(16,28)].join("-");case"byte":return"ZXhhbXBsZQ==";default:return""}}else{let r=Number.isNaN(e.minLength)?void 0:Number(e.minLength),s=Number.isNaN(e.maxLength)?void 0:Number(e.maxLength),n=r||(s>6?6:s||void 0);return n?"A".repeat(n):"string"}}return null}function rs(e,t=1){let a="  ".repeat(t),r="";if(t===1&&typeof e!="object")return`
${a}${e.toString()}`;for(let s in e){let n=e[s]["::XML_TAG"]||s,i="";i=Array.isArray(e[s])?n[0]["::XML_TAG"]||`${s}`:n,!s.startsWith("::")&&(r=Array.isArray(e[s])||typeof e[s]=="object"?`${r}
${a}<${i}>${rs(e[s],t+1)}
${a}</${i}>`:`${r}
${a}<${i}>${e[s].toString()}</${i}>`)}return r}function ja(e,t){typeof t=="object"&&t&&(e.title&&(t["::TITLE"]=e.title),e.description&&(t["::DESCRIPTION"]=e.description),e.xml?.name&&(t["::XML_TAG"]=e.xml?.name),e.xml?.wrapped&&(t["::XML_WRAP"]=e.xml?.wrapped.toString()))}function ji(e){if(typeof e=="object"&&e){delete e["::TITLE"],delete e["::DESCRIPTION"],delete e["::XML_TAG"],delete e["::XML_WRAP"];for(let t in e)ji(e[t])}}function qi(e,t,a){for(let r in t)t[r][a]=e}function Je(e,t,a){let r=0,s={};for(let n in e){for(let i in a)if(s[`example-${r}`]={...e[n]},s[`example-${r}`][t]=a[i],r++,r>=10)break;if(r>=10)break}return s}function de(e,t={}){let a={};if(e){if(e.allOf){let r={};if(e.allOf.length===1&&!e.allOf[0]?.properties&&!e.allOf[0]?.items){if(e.allOf[0].$ref)return"{  }";if(e.allOf[0].readOnly&&t.includeReadOnly){let s=e.allOf[0];return Ra(s)}return}e.allOf.forEach(s=>{if(s.type==="object"||s.properties||s.allOf||s.anyOf||s.oneOf){let n=de(s,t);Object.assign(r,n)}else if(s.type==="array"||s.items){let n=[de(s,t)];Object.assign(r,n)}else if(s.type){let n=`prop${Object.keys(r).length}`;r[n]=Ra(s)}else return""}),a=r}else if(e.oneOf){let r={};if(e.properties)for(let s in e.properties)r[s]=e.properties[s].properties||e.properties[s].properties?.items?de(e.properties[s],t):Ra(e.properties[s]);if(e.oneOf.length>0){let s=0;for(let n in e.oneOf){let i=de(e.oneOf[n],t);for(let o in i){let l;if(Object.keys(r).length>0){if(i[o]===null||typeof i[o]!="object")continue;l=Object.assign(i[o],r)}else l=i[o];a[`example-${s}`]=l,ja(e.oneOf[n],a[`example-${s}`]),s++}}}}else if(e.anyOf){let r;if(e.type==="object"||e.properties){r={"example-0":{}};for(let n in e.properties){if(ce(e)){r=e;break}(!e.properties[n].deprecated||t.includeDeprecated)&&(!e.properties[n].readOnly||t.includeReadOnly)&&(!e.properties[n].writeOnly||t.includeWriteOnly)&&(r=Je(r,n,de(e.properties[n],t)))}}let s=0;for(let n in e.anyOf){let i=de(e.anyOf[n],t);for(let o in i){if(r!==void 0)for(let l in r)a[`example-${s}`]={...r[l],...i[o]};else a[`example-${s}`]=i[o];ja(e.anyOf[n],a[`example-${s}`]),s++}}}else if(e.type==="object"||e.properties){a["example-0"]={},ja(e,a["example-0"]);let r=ce(e);if(r)a["example-0"]=r;else{for(let s in e.properties)if((!e.properties[s]?.deprecated||t.includeDeprecated)&&(!e.properties[s]?.readOnly||t.includeReadOnly)&&(!e.properties[s]?.writeOnly||t.includeWriteOnly)){if(e.properties[s]?.type==="array"||e.properties[s]?.items){let n=ce(e.properties[s]);if(n)qi(n,a,s);else if(ce(e.properties[s]?.items))qi([ce(e.properties[s].items)],a,s);else{let i=de(e.properties[s].items,t);if(t.useXmlTagForProp){let o=e.properties[s].xml?.name||s;if(e.properties[s].xml?.wrapped){let l=JSON.parse(`{ "${o}" : { "${o}" : ${JSON.stringify(i["example-0"])} } }`);a=Je(a,o,l)}else a=Je(a,o,i)}else{let o=[];for(let l in i)o[l]=[i[l]];a=Je(a,s,o)}}continue}a=Je(a,s,de(e.properties[s],t))}if(typeof e.additionalProperties=="object"){let s=e.additionalProperties["x-additionalPropertiesName"]||"property";a=Je(a,`${s}1`,de(e.additionalProperties,t)),a=Je(a,`${s}2`,de(e.additionalProperties,t))}}}else if(e.type==="array"||e.items)if(e.items||ce(e))if(ce(e))a["example-0"]=ce(e);else if(ce(e.items))a["example-0"]=[ce(e.items)];else{let r=de(e.items,t),s=0;for(let n in r)a[`example-${s}`]=[r[n]],ja(e.items,a[`example-${s}`]),s++}else a["example-0"]=[];else return{"example-0":Ra(e)};return a}}function zi(e,t=0){let a=(e.description||e.title)&&(e.minItems||e.maxItems)?'<span class="descr-expand-toggle">\u2794</span>':"";if(e.title?a=e.description?`${a} <b>${e.title}:</b> ${e.description}<br/>`:`${a} ${e.title}<br/>`:e.description&&(a=`${a} ${e.description}<br/>`),e.minItems&&(a=`${a} <b>Min Items:</b> ${e.minItems}`),e.maxItems&&(a=`${a} <b>Max Items:</b> ${e.maxItems}`),e.uniqueItems===!0&&(a=`${a} <b>Must have unique items</b>`),t>0&&e.items?.description){let r="";e.items.minProperties&&(r=`<b>Min Properties:</b> ${e.items.minProperties}`),e.items.maxProperties&&(r=`${r} <b>Max Properties:</b> ${e.items.maxProperties}`),a=`${a} \u2B95 ${r} [ ${e.items.description} ] `}return a}function Z(e,t,a=0,r=""){if(e){if(e.allOf){let s={};if(e.allOf.length===1&&!e.allOf[0].properties&&!e.allOf[0].items){let n=e.allOf[0];return`${Oe(n).html}`}e.allOf.map((n,i)=>{if(n.type==="object"||n.properties||n.allOf||n.anyOf||n.oneOf){let o=(n.anyOf||n.oneOf)&&i>0?i:"",l=Z(n,{},a+1,o);Object.assign(s,l)}else if(n.type==="array"||n.items){let o=Z(n,{},a+1);Object.assign(s,o)}else if(n.type){let o=`prop${Object.keys(s).length}`,l=Oe(n);s[o]=`${l.html}`}else return""}),t=s}else if(e.anyOf||e.oneOf){if(t["::description"]=e.description||"",e.type==="object"||e.properties){t["::description"]=e.description||"",t["::type"]="object";for(let n in e.properties)e.required&&e.required.includes(n)?t[`${n}*`]=Z(e.properties[n],{},a+1):t[n]=Z(e.properties[n],{},a+1)}let s={};e[e.anyOf?"anyOf":"oneOf"].forEach((n,i)=>{if(n.type==="object"||n.properties||n.allOf||n.anyOf||n.oneOf){let o=Z(n,{});s[`::OPTION~${i+1}${n.title?`~${n.title}`:""}`]=o,s[`::OPTION~${i+1}${n.title?`~${n.title}`:""}`]["::readwrite"]="",s["::type"]="xxx-of-option"}else if(n.type==="array"||n.items){let o=Z(n,{});s[`::OPTION~${i+1}${n.title?`~${n.title}`:""}`]=o,s[`::OPTION~${i+1}${n.title?`~${n.title}`:""}`]["::readwrite"]="",s["::type"]="xxx-of-array"}else{let o=`::OPTION~${i+1}${n.title?`~${n.title}`:""}`;s[o]=`${Oe(n).html}`,s["::type"]="xxx-of-option"}}),t[e.anyOf?`::ANY~OF ${r}`:`::ONE~OF ${r}`]=s,t["::type"]="object"}else if(Array.isArray(e.type)){let s=JSON.parse(JSON.stringify(e)),n=[],i=[];s.type.forEach(l=>{l.match(/integer|number|string|null|boolean/g)?n.push(l):l==="array"&&typeof s.items?.type=="string"&&s.items?.type.match(/integer|number|string|null|boolean/g)?s.items.type==="string"&&s.items.format?n.push(`[${s.items.format}]`):n.push(`[${s.items.type}]`):i.push(l)});let o;if(n.length>0&&(s.type=n.join("\u2503"),o=Oe(s),i.length===0))return`${o?.html||""}`;if(i.length>0){t["::type"]="object";let l={"::type":"xxx-of-option"};i.forEach((c,p)=>{if(c==="null")l[`::OPTION~${p+1}`]="NULL~|~~|~~|~~|~~|~~|~~|~~|~";else if("integer, number, string, boolean,".includes(`${c},`)){s.type=Array.isArray(c)?c.join("\u2503"):c;let u=Oe(s);l[`::OPTION~${p+1}`]=u.html}else if(c==="object"){let u={"::title":e.title||"","::description":e.description||"","::type":"object","::deprecated":e.deprecated||!1};for(let h in e.properties)e.required&&e.required.includes(h)?u[`${h}*`]=Z(e.properties[h],{},a+1):u[h]=Z(e.properties[h],{},a+1);l[`::OPTION~${p+1}`]=u}else c==="array"&&(l[`::OPTION~${p+1}`]={"::title":e.title||"","::description":e.description||"","::type":"array","::props":Z(e.items,{},a+1)})}),l[`::OPTION~${i.length+1}`]=o?.html||"",t["::ONE~OF"]=l}}else if(e.type==="object"||e.properties){t["::title"]=e.title||"",t["::description"]=zi(e,a),t["::type"]="object",(Array.isArray(e.type)&&e.type.includes("null")||e.nullable)&&(t["::dataTypeLabel"]="object \u2503 null",t["::nullable"]=!0),t["::deprecated"]=e.deprecated||!1,t["::readwrite"]=e.readOnly?"readonly":e.writeOnly?"writeonly":"";for(let s in e.properties)e.required&&e.required.includes(s)?t[`${s}*`]=Z(e.properties[s],{},a+1):t[s]=Z(e.properties[s],{},a+1);for(let s in e.patternProperties)t[`[pattern: ${s}]`]=Z(e.patternProperties[s],t,a+1);e.additionalProperties&&(t["[any-key]"]=Z(e.additionalProperties,{}))}else if(e.type==="array"||e.items)t["::title"]=e.title||"",t["::description"]=zi(e,a),t["::type"]="array",(Array.isArray(e.type)&&e.type.includes("null")||e.nullable)&&(t["::dataTypeLabel"]="array \u2503 null",t["::nullable"]=!0),t["::deprecated"]=e.deprecated||!1,t["::readwrite"]=e.readOnly?"readonly":e.writeOnly?"writeonly":"",e.items?.items&&(t["::array-type"]=e.items.items.type),t["::props"]=Z(e.items,{},a+1);else{let s=Oe(e);return s?.html?`${s.html}`:""}return t}}function Ht(e,t,a={},r={},s=!0,n=!0,i="json",o=!1){let l=[];if(a)for(let c in a){let p="",u="json";if(t?.toLowerCase().includes("json")){if(i==="text")p=typeof a[c].value=="string"?a[c].value:JSON.stringify(a[c].value,void 0,2),u="text";else if(p=a[c].value,typeof a[c].value=="string")try{let h=a[c].value;p=JSON.parse(h),u="json"}catch{u="text",p=a[c].value}}else p=a[c].value,u="text";l.push({exampleId:c,exampleSummary:a[c].summary||c,exampleDescription:a[c].description||"",exampleType:t,exampleValue:p,exampleFormat:u})}else if(r){let c="",p="json";if(t?.toLowerCase().includes("json")){if(i==="text")c=typeof r=="string"?r:JSON.stringify(r,void 0,2),p="text";else if(typeof r=="object")c=r,p="json";else if(typeof r=="string")try{c=JSON.parse(r),p="json"}catch{p="text",c=r}}else c=r,p="text";l.push({exampleId:"Example",exampleSummary:"",exampleDescription:"",exampleType:t,exampleValue:c,exampleFormat:p})}if(l.length===0||o===!0)if(e){let c=ce(e);if(c)l.push({exampleId:"Example",exampleSummary:"",exampleDescription:"",exampleType:t,exampleValue:c,exampleFormat:t?.toLowerCase().includes("json")&&typeof c=="object"?"json":"text"});else if(t?.toLowerCase().includes("json")||t?.toLowerCase().includes("text")||t?.toLowerCase().includes("*/*")||t?.toLowerCase().includes("xml")){let p="",u="",h="",m="";t?.toLowerCase().includes("xml")?(p=e.xml?.name?`<${e.xml.name} ${e.xml.namespace?`xmlns="${e.xml.namespace}"`:""}>`:"<root>",u=e.xml?.name?`</${e.xml.name}>`:"</root>",h="text"):h=i;let b=de(e,{includeReadOnly:s,includeWriteOnly:n,deprecated:!0,useXmlTagForProp:t?.toLowerCase().includes("xml")}),g=0;for(let y in b){if(!b[y])continue;let w=b[y]["::TITLE"]||`Example ${++g}`,v=b[y]["::DESCRIPTION"]||"";t?.toLowerCase().includes("xml")?m=`<?xml version="1.0" encoding="UTF-8"?>
${p}${rs(b[y],1)}
${u}`:(ji(b[y]),m=i==="text"?JSON.stringify(b[y],null,2):b[y]),l.push({exampleId:y,exampleSummary:w,exampleDescription:v,exampleType:t,exampleFormat:h,exampleValue:m})}}else t?.toLowerCase().includes("jose")?l.push({exampleId:"Example",exampleSummary:"Base64 Encoded",exampleDescription:"",exampleType:t,exampleValue:e.pattern||"bXJpbg==",exampleFormat:"text"}):l.push({exampleId:"Example",exampleSummary:"",exampleDescription:"",exampleType:t,exampleValue:"",exampleFormat:"text"})}else l.push({exampleId:"Example",exampleSummary:"",exampleDescription:"",exampleType:t,exampleValue:"",exampleFormat:"text"});return l}function qd(e){return e==="application/json"?"json":e==="application/xml"?"xml":null}function zd(e){if(e.schema)return[e.schema,null,null];if(e.content){for(let t of Object.keys(e.content))if(e.content[t].schema)return[e.content[t].schema,qd(t),e.content[t]]}return[null,null,null]}var Pd=class extends ee{static get properties(){return{data:{type:Object},renderStyle:{type:String,attribute:"render-style"}}}static get styles(){return[je,La,Ft,M`
        :host {
          display: flex;
        }
        :where(button, input[type='checkbox'], [tabindex='0']):focus-visible {
          box-shadow: var(--focus-shadow);
        }
        :where(input[type='text'], input[type='password'], select, textarea):focus-visible {
          border-color: var(--primary-color);
        }
        .json-tree {
          position: relative;
          font-family: var(--font-mono);
          font-size: var(--font-size-small);
          display: inline-block;
          overflow: hidden;
          word-break: break-all;
          flex: 1;
          line-height: calc(var(--font-size-small) + 6px);
          min-height: 40px;
          direction: ltr;
          text-align: left;
        }

        .open-bracket {
          display: inline-block;
          padding: 0 20px 0 0;
          cursor: pointer;
          border: 1px solid transparent;
          border-radius: 3px;
        }
        .close-bracket {
          border: 1px solid transparent;
          border-radius: 3px;
          display: inline-block;
        }
        .open-bracket:hover {
          color: var(--primary-color);
          background: var(--hover-color);
          border: 1px solid var(--border-color);
        }
        .open-bracket.expanded:hover ~ .inside-bracket {
          border-left: 1px solid var(--fg3);
        }
        .open-bracket.expanded:hover ~ .close-bracket {
          color: var(--primary-color);
        }
        .inside-bracket {
          padding-left: 12px;
          overflow: hidden;
          border-left: 1px dotted var(--border-color);
        }
        .open-bracket.collapsed + .inside-bracket,
        .open-bracket.collapsed + .inside-bracket + .close-bracket {
          display: none;
        }

        .string {
          color: var(--green);
        }
        .number {
          color: var(--blue);
        }
        .null {
          color: var(--red);
        }
        .boolean {
          color: var(--purple);
        }
        .object {
          color: var(--fg);
        }
        .toolbar {
          position: absolute;
          top: 5px;
          right: 6px;
          display: flex;
          padding: 2px;
          align-items: center;
        }
      `,Qe]}render(){return d`
      <div
        class="json-tree"
        @click="${e=>{e.target.classList.contains("btn-copy")?Ot(JSON.stringify(this.data,null,2),e):this.toggleExpand(e)}}"
      >
        <div class="toolbar">
          <button class="toolbar-btn btn-copy" part="btn btn-fill btn-copy">Copy</button>
        </div>
        ${this.generateTree(this.data,!0)}
      </div>
    `}generateTree(e,t=!1){if(e===null)return d`<span class="null">null</span>${t?"":","}`;if(typeof e=="object"&&!(e instanceof Date)){let a=Array.isArray(e)?"array":"pure_object";return Object.keys(e).length===0?d`${Array.isArray(e)?"[ ],":"{ },"}`:d`
        <div class="open-bracket expanded ${a==="array"?"array":"object"}">${a==="array"?"[":"{"}</div>
        <div class="inside-bracket">
          ${Object.keys(e).map((r,s,n)=>d`<div class="item">
                ${a==="pure_object"?d`"${r}":`:""} ${this.generateTree(e[r],s===n.length-1)}
              </div>`)}
        </div>
        <div class="close-bracket">${a==="array"?"]":"}"}${t?"":","}</div>
      `}return typeof e=="string"||e instanceof Date?d`<span class="${typeof e}">"${e}"</span>${t?"":","}`:d`<span class="${typeof e}">${e}</span>${t?"":","}`}toggleExpand(e){let t=e.target;e.target.classList.contains("open-bracket")&&(t.classList.contains("expanded")?(t.classList.replace("expanded","collapsed"),e.target.innerHTML=e.target.classList.contains("array")?"[...]":"{...}"):(t.classList.replace("collapsed","expanded"),e.target.innerHTML=e.target.classList.contains("array")?"[":"{"))}};customElements.define("json-tree",Pd);var Pi=M`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
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
    overflow: hidden;
  }
  .expanded-all-descr .key-descr .descr-expand-toggle {
    display: none;
  }

  .key-descr .descr-expand-toggle {
    display: inline-block;
    user-select: none;
    color: var(--fg);
    cursor: pointer;
    transform: rotate(45deg);
    transition: transform 0.2s ease;
  }

  .expanded-descr .key-descr .descr-expand-toggle {
    transform: rotate(270deg);
  }

  .key-descr .descr-expand-toggle:hover {
    color: var(--primary-color);
  }

  .expanded-descr .more-content {
    display: none;
  }

  .key-descr {
    font-family: var(--font-regular);
    color: var(--light-fg);
    flex-shrink: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    display: none;
  }
  .expanded-descr .key-descr {
    max-height: auto;
    overflow: hidden;
    display: none;
  }

  .xxx-of-key {
    font-size: calc(var(--font-size-small) - 2px);
    font-weight: bold;
    background: var(--primary-color);
    color: var(--primary-color-invert);
    border-radius: 2px;
    line-height: calc(var(--font-size-small) + 6px);
    padding: 0px 5px;
    margin-bottom: 1px;
    display: inline-block;
  }

  .xxx-of-descr {
    font-family: var(--font-regular);
    color: var(--primary-color);
    font-size: calc(var(--font-size-small) - 1px);
    margin-left: 2px;
  }

  .stri,
  .string,
  .uri,
  .url,
  .byte,
  .bina,
  .date,
  .pass,
  .ipv4,
  .ipv4,
  .uuid,
  .emai,
  .host {
    color: var(--green);
  }
  .inte,
  .numb,
  .number,
  .int6,
  .int3,
  .floa,
  .doub,
  .deci .blue {
    color: var(--blue);
  }
  .null {
    color: var(--red);
  }
  .bool,
  .boolean {
    color: var(--orange);
  }
  .enum {
    color: var(--purple);
  }
  .cons {
    color: var(--purple);
  }
  .recu {
    color: var(--brown);
  }
  .toolbar {
    display: flex;
    width: 100%;
    padding: 2px 0;
    color: var(--primary-color);
  }
  .toolbar-item {
    cursor: pointer;
    padding: 5px 0;
    margin: 0 2px;
  }
  .schema-root-type {
    cursor: auto;
    color: var(--fg2);
    font-weight: bold;
    text-transform: uppercase;
  }
  .toolbar-item:first-of-type {
    margin: 0 2px 0 0;
  }

  @container (min-width: 500px) {
    .key-descr {
      display: block;
    }
    .expanded-descr .key-descr {
      display: block;
    }
  }
`,Ud=class extends ee{static get properties(){return{data:{type:Object},schemaExpandLevel:{type:Number,attribute:"schema-expand-level"},schemaDescriptionExpanded:{type:String,attribute:"schema-description-expanded"},allowSchemaDescriptionExpandToggle:{type:String,attribute:"allow-schema-description-expand-toggle"},schemaHideReadOnly:{type:String,attribute:"schema-hide-read-only"},schemaHideWriteOnly:{type:String,attribute:"schema-hide-write-only"}}}connectedCallback(){super.connectedCallback(),(!this.schemaExpandLevel||this.schemaExpandLevel<1)&&(this.schemaExpandLevel=99999),(!this.schemaDescriptionExpanded||!"true false".includes(this.schemaDescriptionExpanded))&&(this.schemaDescriptionExpanded="false"),(!this.schemaHideReadOnly||!"true false".includes(this.schemaHideReadOnly))&&(this.schemaHideReadOnly="true"),(!this.schemaHideWriteOnly||!"true false".includes(this.schemaHideWriteOnly))&&(this.schemaHideWriteOnly="true")}static get styles(){return[je,Pi,La,M`
        .tree {
          font-size: var(--font-size-small);
          text-align: left;
          direction: ltr;
          line-height: calc(var(--font-size-small) + 6px);
        }
        .tree .tr:hover {
          background: var(--hover-color);
        }
        .collapsed-all-descr .tr:not(.expanded-descr) {
          overflow: hidden;
          max-height: calc(var(--font-size-small) + 8px);
        }
        .tree .key {
          max-width: 300px;
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
        .open-bracket {
          display: inline-block;
          padding: 0 20px 0 0;
          cursor: pointer;
          border: 1px solid transparent;
          border-radius: 3px;
        }
        .open-bracket:hover {
          color: var(--primary-color);
          background: var(--hover-color);
          border: 1px solid var(--border-color);
        }
        .close-bracket {
          display: inline-block;
          font-family: var(--font-mono);
        }
        .tr.collapsed + .inside-bracket,
        .tr.collapsed + .inside-bracket + .close-bracket {
          overflow: hidden;
          display: none;
        }
        .inside-bracket.object,
        .inside-bracket.array {
          border-left: 1px dotted var(--border-color);
        }
      `,Qe]}render(){return d` <div
      class="tree ${this.schemaDescriptionExpanded==="true"?"expanded-all-descr":"collapsed-all-descr"}"
      @click="${e=>this.handleAllEvents(e)}"
    >
      <div class="toolbar">
        <div class="toolbar-item schema-root-type ${this.data?.["::type"]||""} ">${this.data?.["::type"]||""}</div>
        ${this.allowSchemaDescriptionExpandToggle==="true"?d` <div style="flex:1"></div>
                <div part="schema-toolbar-item schema-multiline-toggle" class="toolbar-item schema-multiline-toggle">
                  ${this.schemaDescriptionExpanded==="true"?"Single line description":"Multiline description"}
                </div>`:""}
      </div>
      <span part="schema-description" class="m-markdown"> ${R(q(D(this.data?.["::description"]||"")))}</span>
      ${this.data?d` ${this.generateTree(this.data["::type"]==="array"?this.data["::props"]:this.data,this.data["::type"],this.data["::array-type"]||"")}`:d`<span class="mono-font" style="color:var(--red)"> Schema not found </span>`}
    </div>`}generateTree(e,t="object",a="",r="",s="",n=0,i=0,o="",l=!1){if(this.schemaHideReadOnly==="true"&&(t==="array"&&o==="readonly"||e?.["::readwrite"]==="readonly")||this.schemaHideWriteOnly==="true"&&(t==="array"&&o==="writeonly"||e?.["::readwrite"]==="writeonly"))return;if(!e)return d`<div class="null" style="display:inline;">
        <span class="key-label xxx-of-key"> ${r.replace("::OPTION~","")}</span>
        ${t==="array"?d`<span class="mono-font"> [ ] </span>`:t==="object"?d`<span class="mono-font"> { } </span>`:d`<span class="mono-font"> schema undefined </span>`}
      </div>`;if(Object.keys(e).length===0)return d`<span class="key object">${r}:{ }</span>`;let c="",p="";r.startsWith("::ONE~OF")||r.startsWith("::ANY~OF")?c=r.replace("::","").replace("~"," "):r.startsWith("::OPTION")?[,c,p]=r.split("~"):c=r;let u=400-i*12,h="",m="",b=e["::type"]?.startsWith("xxx-of")?n:n+1,g=t==="xxx-of-option"||e["::type"]==="xxx-of-option"||r.startsWith("::OPTION")?i:i+1;if(e["::type"]==="object")t==="array"?(h=n<this.schemaExpandLevel?d`<span class="open-bracket array-of-object">[{</span>`:d`<span class="open-bracket array-of-object">[{...}]</span>`,m="}]"):(h=n<this.schemaExpandLevel?d`<span class="open-bracket object">${e["::nullable"]?"null\u2503":""}{</span>`:d`<span class="open-bracket object">${e["::nullable"]?"null\u2503":""}{...}</span>`,m="}");else if(e["::type"]==="array")if(t==="array"){let F=a==="object"?"":a;h=n<this.schemaExpandLevel?d`<span class="open-bracket array-of-array" data-array-type="${F}">[[ ${F} </span>`:d`<span class="open-bracket array-of-array" data-array-type="${F}">[[...]]</span>`,m="]]"}else h=n<this.schemaExpandLevel?d`<span class="open-bracket array">[</span>`:d`<span class="open-bracket array">[...]</span>`,m="]";if(typeof e=="object")return d`<div
          class="tr ${n<this.schemaExpandLevel||e["::type"]?.startsWith("xxx-of")?"expanded":"collapsed"} ${e["::type"]||"no-type-info"}${e["::nullable"]?" nullable":""}"
          title="${l||e["::deprecated"]?"Deprecated":""}"
        >
          <div class="td key ${l||e["::deprecated"]?"deprecated":""}" style="min-width:${u}px">
            ${e["::type"]==="xxx-of-option"||e["::type"]==="xxx-of-array"||r.startsWith("::OPTION")?d`<span class="key-label xxx-of-key"> ${c}</span><span class="xxx-of-descr">${p}</span>`:c==="::props"||c==="::ARRAY~OF"?"":n>0?d`<span
                        class="key-label"
                        title="${o==="readonly"?"Read-Only":o==="writeonly"?"Write-Only":""}"
                      >
                        ${l||e["::deprecated"]?d`<svg viewBox="0 0 10 10" width="10" height="10" style="stroke:var(--red); margin-right:-6px">
                                <path d="M2 2L8 8M2 8L8 2" />
                              </svg>`:""}
                        ${c.replace(/\*$/,"")}${c.endsWith("*")?d`<span style="color:var(--red)">*</span>`:""}${o==="readonly"?d` 🆁`:o==="writeonly"?d` 🆆`:o}:
                      </span>`:""}
            ${h}
          </div>
          <div class="td key-descr m-markdown-small">${R(q(D(s||"")))}</div>
        </div>
        <div
          class="inside-bracket ${e["::type"]||"no-type-info"}"
          style="padding-left:${e["::type"]==="xxx-of-option"||e["::type"]==="xxx-of-array"?0:12}px;"
        >
          ${Array.isArray(e)&&e[0]?d`${this.generateTree(e[0],"xxx-of-option","","::ARRAY~OF","",b,g,e[0]["::readwrite"],l||e[0]["::deprecated"])}`:d`
                  ${Object.keys(e).map(F=>d`
                      ${["::title","::description","::type","::props","::deprecated","::array-type","::readwrite","::dataTypeLabel","::nullable"].includes(F)?e[F]["::type"]==="array"||e[F]["::type"]==="object"?d`${this.generateTree(e[F]["::type"]==="array"?e[F]["::props"]:e[F],e[F]["::type"],e[F]["::array-type"]||"",F,e[F]["::description"],b,g,e[F]["::readwrite"]?e[F]["::readwrite"]:"",l||e[F]["::deprecated"])}`:"":d`${this.generateTree(e[F]["::type"]==="array"?e[F]["::props"]:e[F],e[F]["::type"],e[F]["::array-type"]||"",F,e[F]?.["::description"]||"",b,g,e[F]["::readwrite"]?e[F]["::readwrite"]:"",l||e[F]["::deprecated"])}`}
                    `)}
                `}
        </div>
        ${e["::type"]&&e["::type"].includes("xxx-of")?"":d`<div class="close-bracket">${m}</div>`} `;let[y,w,v,x,f,$,k,S,E]=e.split("~|~");if(w==="\u{1F181}"&&this.schemaHideReadOnly==="true"||w==="\u{1F186}"&&this.schemaHideWriteOnly==="true")return;let _=y.replace(/┃.*/g,"").replace(/[^a-zA-Z0-9+]/g,"").substring(0,4).toLowerCase(),I=`${v||x||f||$?`<span class="descr-expand-toggle ${this.schemaDescriptionExpanded==="true"?"expanded-descr":""}">\u2794</span>`:""}`,T="",C="";return t==="array"?o==="readonly"?(T="\u{1F181}",C="Read-Only"):o==="writeonly"&&(T="\u{1F186}",C="Write-Only"):w==="\u{1F181}"?(T="\u{1F181}",C="Read-Only"):w==="\u{1F186}"&&(T="\u{1F186}",C="Write-Only"),d`
      <div class="tr primitive" title="${E?"Deprecated":""}">
        <div class="td key ${l||E}" style="min-width:${u}px">
          ${l||E?d`<svg viewBox="0 0 10 10" width="10" height="10" style="stroke:var(--red); margin-right:-6px">
                  <path d="M2 2L8 8M2 8L8 2" />
                </svg>`:""}
          ${c.endsWith("*")?d`<span class="key-label">${c.substring(0,c.length-1)}</span><span style="color:var(--red);">*</span>:`:r.startsWith("::OPTION")?d`<span class="key-label xxx-of-key">${c}</span><span class="xxx-of-descr">${p}</span>`:d`<span class="key-label">${c}:</span>`}
          <span class="${_}" title="${C}">
            ${t==="array"?`[${y}]`:`${y}`} ${T}
          </span>
        </div>
        <div class="td key-descr">
          ${s||S||k?d`${d`<span class="m-markdown-small">
                  ${R(q(D(t==="array"?`${I} ${s}`:S?`${I} <b>${S}:</b> ${k}`:`${I} ${k}`)))}
                </span>`}`:""}
          ${v?d`<div style="display:inline-block; line-break:anywhere; margin-right:8px">
                  <span class="bold-text">Constraints: </span>${v}
                </div>`:""}
          ${x?d`<div style="display:inline-block; line-break:anywhere; margin-right:8px">
                  <span class="bold-text">Default: </span>${x}
                </div>`:""}
          ${f?d`<div style="display:inline-block; line-break:anywhere; margin-right:8px">
                  <span class="bold-text">${y==="const"?"Value":"Allowed"}: </span>${f}
                </div>`:""}
          ${$?d`<div style="display:inline-block; line-break: anywhere; margin-right:8px">
                  <span class="bold-text">Pattern: </span>${$}
                </div>`:""}
        </div>
      </div>
    `}handleAllEvents(e){if(e.target.classList.contains("open-bracket"))this.toggleObjectExpand(e);else if(e.target.classList.contains("schema-multiline-toggle"))this.schemaDescriptionExpanded=this.schemaDescriptionExpanded==="true"?"false":"true";else if(e.target.classList.contains("descr-expand-toggle")){let t=e.target.closest(".tr");t&&(t.classList.toggle("expanded-descr"),t.style.maxHeight=t.scrollHeight)}}toggleObjectExpand(e){let t=e.target.closest(".tr"),a=t.classList.contains("nullable");t.classList.contains("expanded")?(t.classList.replace("expanded","collapsed"),e.target.innerHTML=e.target.classList.contains("array-of-object")?"[{...}]":e.target.classList.contains("array-of-array")?"[[...]]":e.target.classList.contains("array")?"[...]":`${a?"null\u2503":""}{...}`):(t.classList.replace("collapsed","expanded"),e.target.innerHTML=e.target.classList.contains("array-of-object")?"[{":e.target.classList.contains("array-of-array")?`[[ ${e.target.dataset.arrayType}`:e.target.classList.contains("object")?`${a?"null\u2503":""}{`:"[")}};customElements.define("schema-tree",Ud);var Md=class extends ee{render(){let e="";return Array.isArray(this.value)&&(e=d`${this.value.filter(t=>typeof t=="string"&&t.trim()!=="").map(t=>d`<span class="tag">${t}</span>`)}`),d`<div class="tags">
      ${e}
      <input
        type="text"
        class="editor"
        @paste="${t=>this.afterPaste(t)}"
        @keydown="${this.afterKeyDown}"
        @blur="${this.onBlur}"
        placeholder="${this.placeholder||""}"
      />
    </div>`}static get properties(){return{placeholder:{type:String},value:{type:Array,attribute:"value"}}}attributeChangedCallback(e,t,a){e==="value"&&a&&t!==a&&(this.value=a.split(",").filter(r=>r.trim()!=="")),super.attributeChangedCallback(e,t,a)}afterPaste(e){let t=(e.clipboardData||window.clipboardData).getData("Text"),a=t?t.split(",").filter(r=>r.trim()!==""):"";a&&(this.value=Array.isArray(this.value)?[...this.value,...a]:a),e.preventDefault()}afterKeyDown(e){e.keyCode===13?(e.stopPropagation(),e.preventDefault(),e.target.value&&(this.value=Array.isArray(this.value)?[...this.value,e.target.value]:[e.target.value],e.target.value="")):e.keyCode===8&&e.target.value.length===0&&Array.isArray(this.value)&&this.value.length>0&&(this.value.splice(-1),this.value=[...this.value])}onBlur(e){e.target.value&&(this.value=Array.isArray(this.value)?[...this.value,e.target.value]:[e.target.value],e.target.value="")}static get styles(){return[M`
        .tags {
          display: flex;
          flex-wrap: wrap;
          outline: none;
          padding: 0;
          border-radius: var(--border-radius);
          border: 1px solid var(--border-color);
          cursor: text;
          overflow: hidden;
          background: var(--input-bg);
        }
        .tag,
        .editor {
          padding: 3px;
          margin: 2px;
        }
        .tag {
          border: 1px solid var(--border-color);
          background: var(--bg3);
          color: var(--fg3);
          border-radius: var(--border-radius);
          word-break: break-all;
          font-size: var(--font-size-small);
        }
        .tag:hover ~ #cursor {
          display: block;
        }
        .editor {
          flex: 1;
          border: 1px solid transparent;
          color: var(--fg);
          min-width: 60px;
          outline: none;
          line-height: inherit;
          font-family: inherit;
          background: transparent;
          font-size: calc(var(--font-size-small) + 1px);
        }
        .editor:focus-visible {
          outline: 1px solid;
        }
        .editor::placeholder {
          color: var(--placeholder-color);
          opacity: 1;
        }
      `]}};customElements.define("tag-input",Md);var Hd=class extends ee{constructor(){super(),this.responseMessage="",this.responseStatus="success",this.responseHeaders="",this.responseText="",this.responseUrl="",this.curlSyntax="",this.activeResponseTab="response",this.selectedRequestBodyType="",this.selectedRequestBodyExample="",this.activeParameterSchemaTabs={}}static get properties(){return{serverUrl:{type:String,attribute:"server-url"},servers:{type:Array},method:{type:String},path:{type:String},security:{type:Array},parameters:{type:Array},request_body:{type:Object},api_keys:{type:Array},parser:{type:Object},accept:{type:String},callback:{type:String},webhook:{type:String},responseMessage:{type:String,attribute:!1},responseText:{type:String,attribute:!1},responseHeaders:{type:String,attribute:!1},responseStatus:{type:String,attribute:!1},responseUrl:{type:String,attribute:!1},curlSyntax:{type:String,attribute:!1},fillRequestFieldsWithExample:{type:String,attribute:"fill-request-fields-with-example"},allowTry:{type:String,attribute:"allow-try"},showCurlBeforeTry:{type:String,attribute:"show-curl-before-try"},renderStyle:{type:String,attribute:"render-style"},schemaStyle:{type:String,attribute:"schema-style"},activeSchemaTab:{type:String,attribute:"active-schema-tab"},activeParameterSchemaTabs:{type:Object,converter:{fromAttribute:e=>JSON.parse(e),toAttribute:e=>JSON.stringify(e)},attribute:"active-parameter-schema-tabs"},schemaExpandLevel:{type:Number,attribute:"schema-expand-level"},schemaDescriptionExpanded:{type:String,attribute:"schema-description-expanded"},allowSchemaDescriptionExpandToggle:{type:String,attribute:"allow-schema-description-expand-toggle"},schemaHideReadOnly:{type:String,attribute:"schema-hide-read-only"},schemaHideWriteOnly:{type:String,attribute:"schema-hide-write-only"},fetchCredentials:{type:String,attribute:"fetch-credentials"},activeResponseTab:{type:String},selectedRequestBodyType:{type:String,attribute:"selected-request-body-type"},selectedRequestBodyExample:{type:String,attribute:"selected-request-body-example"}}}static get styles(){return[oa,Ft,je,ia,La,la,hr,M`
        *,
        *:before,
        *:after {
          box-sizing: border-box;
        }
        :where(button, input[type='checkbox'], [tabindex='0']):focus-visible {
          box-shadow: var(--focus-shadow);
        }
        :where(input[type='text'], input[type='password'], select, textarea):focus-visible {
          border-color: var(--primary-color);
        }
        tag-input:focus-within {
          outline: 1px solid;
        }
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
        .param-type {
          color: var(--light-fg);
          font-family: var(--font-regular);
        }
        .param-constraint {
          min-width: 100px;
        }
        .param-constraint:empty {
          display: none;
        }
        .top-gap {
          margin-top: 24px;
        }

        .textarea {
          min-height: 220px;
          padding: 5px;
          resize: vertical;
          direction: ltr;
        }
        .example:first-child {
          margin-top: -9px;
        }

        .response-message {
          font-weight: bold;
          text-overflow: ellipsis;
        }
        .response-message.error {
          color: var(--red);
        }
        .response-message.success {
          color: var(--blue);
        }

        .file-input-container {
          align-items: flex-end;
        }
        .file-input-container .input-set:first-child .file-input-remove-btn {
          visibility: hidden;
        }

        .file-input-remove-btn {
          font-size: 16px;
          color: var(--red);
          outline: none;
          border: none;
          background: none;
          cursor: pointer;
        }

        .v-tab-btn {
          font-size: var(--smal-font-size);
          height: 24px;
          border: none;
          background: none;
          opacity: 0.3;
          cursor: pointer;
          padding: 4px 8px;
        }
        .v-tab-btn.active {
          font-weight: bold;
          background: var(--bg);
          opacity: 1;
        }

        @container (min-width: 768px) {
          .textarea {
            padding: 8px;
          }
        }

        @container (max-width: 470px) {
          .hide-in-small-screen {
            display: none;
          }
        }
      `,Qe]}render(){return d`<div
      class="col regular-font request-panel ${"read focused".includes(this.renderStyle)||this.callback==="true"?"read-mode":"view-mode"}"
    >
      <div class=" ${this.callback==="true"?"tiny-title":"req-res-title"} ">
        ${this.callback==="true"?"CALLBACK REQUEST":"REQUEST"}
      </div>
      <div>
        ${Ia([this.method,this.path,this.allowTry,this.parameters,this.activeParameterSchemaTabs],()=>this.inputParametersTemplate("path"))}
        ${Ia([this.method,this.path,this.allowTry,this.parameters,this.activeParameterSchemaTabs],()=>this.inputParametersTemplate("query"))}
        ${this.requestBodyTemplate()}
        ${Ia([this.method,this.path,this.allowTry,this.parameters,this.activeParameterSchemaTabs],()=>this.inputParametersTemplate("header"))}
        ${Ia([this.method,this.path,this.allowTry,this.parameters,this.activeParameterSchemaTabs],()=>this.inputParametersTemplate("cookie"))}
        ${this.allowTry==="false"?"":d`${this.apiCallTemplate()}`}
      </div>
    </div>`}async updated(){this.showCurlBeforeTry==="true"&&this.applyCURLSyntax(this.shadowRoot),na(this.getRootNode()?.host?.shadowRoot||this.shadowRoot),this.webhook==="true"&&(this.allowTry="false")}async saveExampleState(){this.renderStyle==="focused"&&([...this.shadowRoot.querySelectorAll("textarea.request-body-param-user-input")].forEach(e=>{e.dataset.user_example=e.value}),[...this.shadowRoot.querySelectorAll('textarea[data-ptype="form-data"]')].forEach(e=>{e.dataset.user_example=e.value}),this.requestUpdate())}async updateExamplesFromDataAttr(){this.renderStyle==="focused"&&([...this.shadowRoot.querySelectorAll("textarea.request-body-param-user-input")].forEach(e=>{e.value=e.dataset.user_example||e.dataset.example}),[...this.shadowRoot.querySelectorAll('textarea[data-ptype="form-data"]')].forEach(e=>{e.value=e.dataset.user_example||e.dataset.example}),this.requestUpdate())}renderExample(e,t,a){return d`
      ${t==="array"?"[":""}
      <a
        part="anchor anchor-param-example"
        style="display:inline-block; min-width:24px; text-align:center"
        class="${this.allowTry==="true"?"":"inactive-link"}"
        data-example-type="${t==="array"?t:"string"}"
        data-example="${e.value&&Array.isArray(e.value)?e.value?.join("~|~"):(typeof e.value=="object"?JSON.stringify(e.value,null,2):e.value)||""}"
        title="${e.value&&Array.isArray(e.value)?e.value?.join("~|~"):(typeof e.value=="object"?JSON.stringify(e.value,null,2):e.value)||""}"
        @click="${r=>{let s=r.target.closest("table").querySelector(`[data-pname="${a}"]`);s&&(s.value=r.target.dataset.exampleType==="array"?r.target.dataset.example.split("~|~"):r.target.dataset.example)}}"
      >
        ${e.printableValue||e.value}
      </a>
      ${t==="array"?"] ":""}
    `}renderShortFormatExamples(e,t,a){return d`${e.map((r,s)=>d` ${s===0?"":"\u2503"} ${this.renderExample(r,t,a)}`)}`}renderLongFormatExamples(e,t,a){return d` <ul style="list-style-type: disclosure-closed;">
      ${e.map(r=>d`<li>
            ${this.renderExample(r,t,a)} ${r.summary?.length>0?d`<span>&lpar;${r.summary}&rpar;</span>`:""}
            ${r.description?.length>0?d`<p>${R(q(D(r.description)))}</p>`:""}
          </li>`)}
    </ul>`}exampleListTemplate(e,t,a=[]){return d` ${a.length>0?d`<span style="font-weight:bold">Examples: </span> ${jd(a)?this.renderLongFormatExamples(a,t,e):this.renderShortFormatExamples(a,t,e)}`:""}`}inputParametersTemplate(e){let t=this.parameters?this.parameters.filter(s=>s.in===e):[];if(t.length===0)return"";let a="";e==="path"?a="PATH PARAMETERS":e==="query"?a="QUERY-STRING PARAMETERS":e==="header"?a="REQUEST HEADERS":e==="cookie"&&(a="COOKIES");let r=[];for(let s of t){let[n,i,o]=zd(s);if(!n)continue;let l=Oe(n);if(!l)continue;let c=Z(n,{}),p="form",u=!0,h=!1;(e==="query"||e==="header"||e==="path")&&(s.style&&"form spaceDelimited pipeDelimited".includes(s.style)?p=s.style:i&&(p=i),typeof s.explode=="boolean"&&(u=s.explode),typeof s.allowReserved=="boolean"&&(h=s.allowReserved));let m=Ri(le(s.examples)||le(s.example)||le(o?.example)||le(o?.examples)||le(l.examples)||le(l.example),l.type);!m.exampleVal&&l.type==="object"&&(m.exampleVal=Ht(n,i||"json",{},{},this.callback==="true"||this.webhook==="true",this.callback!=="true"&&this.webhook!=="true",!0,"text",!1)[0].exampleValue);let b="read focused".includes(this.renderStyle)?"200px":"160px";r.push(d`
        <tr title="${s.deprecated?"Deprecated":""}">
          <td rowspan="${this.allowTry==="true"?"1":"2"}" style="width:${b}; min-width:100px;">
            <div class="param-name ${s.deprecated?"deprecated":""}">
              ${s.deprecated?d`<svg viewBox="0 0 10 10" width="10" height="10" style="stroke:var(--red); margin-right:-6px">
                      <path d="M2 2L8 8M2 8L8 2" />
                    </svg>`:""}
              ${s.required?d`<span style="color:var(--red)">*</span>`:""} ${s.name}
            </div>
            <div class="param-type">
              ${l.type==="array"?`${l.arrayType}`:`${l.format?l.format:l.type}`}
            </div>
          </td>
          ${this.allowTry==="true"?d` <td
                  style="min-width:100px;"
                  colspan="${l.default||l.constrain||l.allowedValues||l.pattern?"1":"2"}"
                >
                  ${l.type==="array"?d`<tag-input
                          class="request-param"
                          id="tag-input-request-param-${s.name}"
                          style="width:100%"
                          data-ptype="${e}"
                          data-pname="${s.name}"
                          data-example="${Array.isArray(m.exampleVal)?m.exampleVal.join("~|~"):m.exampleVal}"
                          data-param-serialize-style="${p}"
                          data-param-serialize-explode="${u}"
                          data-param-allow-reserved="${h}"
                          data-x-fill-example="${s["x-fill-example"]||"yes"}"
                          data-array="true"
                          placeholder="add-multiple &#x21a9;"
                          .value="${s["x-fill-example"]==="no"?[]:as(this.fillRequestFieldsWithExample==="true"?Array.isArray(m.exampleVal)?m.exampleVal:[m.exampleVal]:[])}"
                        >
                        </tag-input>`:l.type==="object"?d`<div part="tab-panel" class="tab-panel col" style="border-width:0 0 1px 0;">
                            <div
                              part="tab-btn-row"
                              class="tab-buttons row"
                              @click="${g=>{if(g.target.tagName.toLowerCase()==="button"){let y={...this.activeParameterSchemaTabs};y[s.name]=g.target.dataset.tab,this.activeParameterSchemaTabs=y}}}"
                            >
                              <button
                                part="tab-btn"
                                class="tab-btn ${this.activeParameterSchemaTabs[s.name]==="example"?"active":""}"
                                data-tab="example"
                              >
                                EXAMPLE
                              </button>
                              <button
                                part="tab-btn"
                                class="tab-btn ${this.activeParameterSchemaTabs[s.name]==="example"?"":"active"}"
                                data-tab="schema"
                              >
                                SCHEMA
                              </button>
                            </div>

                            ${d`<div
                              part="tab-content"
                              class="tab-content col"
                              data-tab="example"
                              style="display:${this.activeParameterSchemaTabs[s.name]==="example"?"block":"none"}; padding-left:5px; width:100%"
                            >
                              <textarea
                                id="textarea-request-param-${s.name}"
                                class="textarea request-param"
                                part="textarea textarea-param"
                                data-ptype="${e}-object"
                                data-pname="${s.name}"
                                data-example="${m.exampleVal}"
                                data-param-serialize-style="${p}"
                                data-param-serialize-explode="${u}"
                                data-param-allow-reserved="${h}"
                                data-x-fill-example="${s["x-fill-example"]||"yes"}"
                                spellcheck="false"
                                .textContent="${s["x-fill-example"]==="no"?"":as(this.fillRequestFieldsWithExample==="true"?typeof m.exampleVal=="object"?JSON.stringify(m.exampleVal,null,2):m.exampleVal:"")}"
                                style="resize:vertical; width:100%; height: ${"read focused".includes(this.renderStyle)?"180px":"120px"};"
                                @input=${g=>{let y=this.getRequestPanel(g);this.liveCURLSyntaxUpdate(y)}}
                              ></textarea>
                            </div>`}
                            ${d`<div
                              part="tab-content"
                              class="tab-content col"
                              data-tab="schema"
                              style="display:${this.activeParameterSchemaTabs[s.name]==="example"?"none":"block"}; padding-left:5px; width:100%;"
                            >
                              <schema-tree
                                class="json"
                                style="display: block"
                                .data="${c}"
                                schema-expand-level="${this.schemaExpandLevel}"
                                schema-description-expanded="${this.schemaDescriptionExpanded}"
                                allow-schema-description-expand-toggle="${this.allowSchemaDescriptionExpandToggle}"
                                schema-hide-read-only="${this.schemaHideReadOnly.includes(this.method)}"
                                schema-hide-write-only="${this.schemaHideWriteOnly.includes(this.method)}"
                                exportparts="wrap-request-btn:wrap-request-btn, btn:btn, btn-fill:btn-fill, btn-outline:btn-outline, btn-try:btn-try, btn-clear:btn-clear, btn-clear-resp:btn-clear-resp,
                            file-input:file-input, textbox:textbox, textbox-param:textbox-param, textarea:textarea, textarea-param:textarea-param, 
                            anchor:anchor, anchor-param-example:anchor-param-example"
                              >
                              </schema-tree>
                            </div>`}
                          </div>`:d` <input
                            type="${l.format==="password"?"password":"text"}"
                            spellcheck="false"
                            style="width:100%"
                            id="input-request-param-${s.name}"
                            class="request-param"
                            part="textbox textbox-param"
                            data-ptype="${e}"
                            data-pname="${s.name}"
                            data-example="${Array.isArray(m.exampleVal)?m.exampleVal.join("~|~"):m.exampleVal}"
                            data-param-allow-reserved="${h}"
                            data-x-fill-example="${s["x-fill-example"]||"yes"}"
                            data-array="false"
                            .value="${s["x-fill-example"]==="no"?"":as(this.fillRequestFieldsWithExample==="true"?m.exampleVal:"")}"
                            @input=${g=>{let y=this.getRequestPanel(g);this.liveCURLSyntaxUpdate(y)}}
                          />`}
                </td>`:""}
          ${l.default||l.constrain||l.allowedValues||l.pattern?d` <td colspan="${this.allowTry==="true"?"1":"2"}">
                  <div class="param-constraint">
                    ${l.default?d`<span style="font-weight:bold">Default: </span>${l.default}<br />`:""}
                    ${l.pattern?d`<span style="font-weight:bold">Pattern: </span>${l.pattern}<br />`:""}
                    ${l.constrain?d`${l.constrain}<br />`:""}
                    ${l.allowedValues&&l.allowedValues.split("\u2503").map((g,y)=>d` ${y>0?"\u2503":d`<span style="font-weight:bold">Allowed: </span>`}
                          ${d` <a
                            part="anchor anchor-param-constraint"
                            class="${this.allowTry==="true"?"":"inactive-link"}"
                            data-type="${l.type==="array"?l.type:"string"}"
                            data-enum="${g.trim()}"
                            @click="${w=>{let v=w.target.closest("table").querySelector(`[data-pname="${s.name}"]`);v&&(v.value=w.target.dataset.type==="array"?[w.target.dataset.enum]:w.target.dataset.enum)}}"
                            >${g}</a
                          >`}`)}
                  </div>
                </td>`:d`<td></td>`}
        </tr>
        <tr>
          ${this.allowTry==="true"?d`<td style="border:none"></td>`:""}
          <td colspan="2" style="border:none">
            <span class="m-markdown-small"> ${R(q(D(s.description||"")))} </span>
            ${this.exampleListTemplate.call(this,s.name,l.type,m.exampleList)}
          </td>
        </tr>
      `)}return d` <div class="table-title top-gap">${a}</div>
      <div style="display:block; overflow-x:auto; max-width:100%;">
        <table role="presentation" class="m-table" style="width:100%; word-break:break-word;">
          ${r}
        </table>
      </div>`}async beforeNavigationFocusedMode(){}async afterNavigationFocusedMode(){this.selectedRequestBodyType="",this.selectedRequestBodyExample="",this.updateExamplesFromDataAttr(),this.clearResponseData()}onSelectExample(e){this.selectedRequestBodyExample=e.target.value;let t=e.target;window.setTimeout(a=>{let r=a.closest(".example-panel").querySelector(".request-body-param"),s=a.closest(".example-panel").querySelector(".request-body-param-user-input");s.value=r.innerText;let n=this.getRequestPanel({target:a});this.liveCURLSyntaxUpdate(n)},0,t)}onMimeTypeChange(e){this.selectedRequestBodyType=e.target.value;let t=e.target;this.selectedRequestBodyExample="",window.setTimeout(a=>{let r=a.closest(".request-body-container").querySelector(".request-body-param");if(r){let s=a.closest(".request-body-container").querySelector(".request-body-param-user-input");s.value=r.innerText}},0,t)}requestBodyTemplate(){if(!this.request_body||Object.keys(this.request_body).length===0)return"";let e="",t="",a="",r="",s="",n=[],{content:i}=this.request_body;for(let o in i)n.push({mimeType:o,schema:i[o].schema,example:i[o].example,examples:i[o].examples}),this.selectedRequestBodyType||=o;return e=n.length===1?"":d`
            <select style="min-width:100px; max-width:100%;  margin-bottom:-1px;" @change="${o=>this.onMimeTypeChange(o)}">
              ${n.map(o=>d`
                  <option value="${o.mimeType}" ?selected="${o.mimeType===this.selectedRequestBodyType}">
                    ${o.mimeType}
                  </option>
                `)}
            </select>
          `,n.forEach(o=>{let l,c=[];if(this.selectedRequestBodyType.includes("json")||this.selectedRequestBodyType.includes("xml")||this.selectedRequestBodyType.includes("text")||this.selectedRequestBodyType.includes("jose"))o.mimeType===this.selectedRequestBodyType&&(c=Ht(o.schema,o.mimeType,le(o.examples),le(o.example),this.callback==="true"||this.webhook==="true",this.callback!=="true"&&this.webhook!=="true","text",!1),this.selectedRequestBodyExample||=c.length>0?c[0].exampleId:"",s=d`
            ${s}
            <div class="example-panel border-top pad-top-8">
              ${c.length===1?"":d`
                      <select style="min-width:100px; max-width:100%;  margin-bottom:-1px;" @change="${p=>this.onSelectExample(p)}">
                        ${c.map(p=>d`<option value="${p.exampleId}" ?selected=${p.exampleId===this.selectedRequestBodyExample}>
                              ${p.exampleSummary.length>80?p.exampleId:p.exampleSummary?p.exampleSummary:p.exampleId}
                            </option>`)}
                      </select>
                    `}
              ${c.filter(p=>p.exampleId===this.selectedRequestBodyExample).map(p=>d`
                    <div
                      class="example ${p.exampleId===this.selectedRequestBodyExample?"example-selected":""}"
                      data-example="${p.exampleId}"
                    >
                      ${p.exampleSummary&&p.exampleSummary.length>80?d`<div style="padding: 4px 0">${p.exampleSummary}</div>`:""}
                      ${p.exampleDescription?d`<div class="m-markdown-small" style="padding: 4px 0">
                              ${R(q(D(p.exampleDescription||"")))}
                            </div>`:""}
                      <!-- This pre(hidden) is to store the original example value, this will remain unchanged when users switches from one example to another, its is used to populate the editable textarea -->
                      <pre
                        class="textarea is-hidden request-body-param ${o.mimeType.substring(o.mimeType.indexOf("/")+1)}"
                        spellcheck="false"
                        data-ptype="${o.mimeType}"
                        style="width:100%; resize:vertical; display:none"
                      >
${p.exampleFormat==="text"?p.exampleValue:JSON.stringify(p.exampleValue,null,2)}</pre>

                      <!-- this textarea is for user to edit the example -->
                      <textarea
                        class="textarea request-body-param-user-input"
                        part="textarea textarea-param"
                        spellcheck="false"
                        data-ptype="${o.mimeType}"
                        data-example="${p.exampleFormat==="text"?p.exampleValue:JSON.stringify(p.exampleValue,null,2)}"
                        data-example-format="${p.exampleFormat}"
                        style="width:100%; resize:vertical;"
                        .textContent="${this.fillRequestFieldsWithExample==="true"?p.exampleFormat==="text"?p.exampleValue:JSON.stringify(p.exampleValue,null,2):""}"
                        @input=${u=>{let h=this.getRequestPanel(u);this.liveCURLSyntaxUpdate(h)}}
                        @keydown=${u=>{if((u.keyCode===10||u.keyCode===13)&&u.ctrlKey)return this.onTryClick(u)}}
                      ></textarea>
                    </div>
                  `)}
            </div>
          `);else if(this.selectedRequestBodyType.includes("form-urlencoded")||this.selectedRequestBodyType.includes("form-data")){if(o.mimeType===this.selectedRequestBodyType){let p=Ht(o.schema,o.mimeType,o.examples,o.example,this.callback==="true"||this.webhook==="true",this.callback!=="true"&&this.webhook!=="true","text",!1);o.schema&&(a=this.formDataTemplate(o.schema,o.mimeType,p[0]?p[0].exampleValue:""))}}else/^audio\/|^image\/|^video\/|^font\/|tar$|zip$|7z$|rtf$|msword$|excel$|\/pdf$|\/octet-stream$/.test(this.selectedRequestBodyType)&&o.mimeType===this.selectedRequestBodyType&&(t=d`
            <div class="small-font-size bold-text row">
              <input
                id="input-request-body-param-file"
                type="file"
                part="file-input"
                style="max-width:100%"
                class="request-body-param-file"
                data-ptype="${o.mimeType}"
                spellcheck="false"
              />
            </div>
          `);(o.mimeType.includes("json")||o.mimeType.includes("xml")||o.mimeType.includes("text")||this.selectedRequestBodyType.includes("jose"))&&(l=Z(o.schema,{}),this.schemaStyle==="table"?r=d`
            ${r}
            <schema-table
              class="${o.mimeType.substring(o.mimeType.indexOf("/")+1)}"
              style="display: ${this.selectedRequestBodyType===o.mimeType?"block":"none"};"
              .data="${l}"
              schema-expand-level="${this.schemaExpandLevel}"
              schema-description-expanded="${this.schemaDescriptionExpanded}"
              allow-schema-description-expand-toggle="${this.allowSchemaDescriptionExpandToggle}"
              schema-hide-read-only="${this.schemaHideReadOnly}"
              schema-hide-write-only="${this.schemaHideWriteOnly}"
              exportparts="schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
            >
            </schema-table>
          `:this.schemaStyle==="tree"&&(r=d`
            ${r}
            <schema-tree
              class="${o.mimeType.substring(o.mimeType.indexOf("/")+1)}"
              style="display: ${this.selectedRequestBodyType===o.mimeType?"block":"none"};"
              .data="${l}"
              schema-expand-level="${this.schemaExpandLevel}"
              schema-description-expanded="${this.schemaDescriptionExpanded}"
              allow-schema-description-expand-toggle="${this.allowSchemaDescriptionExpandToggle}"
              schema-hide-read-only="${this.schemaHideReadOnly}"
              schema-hide-write-only="${this.schemaHideWriteOnly}"
              exportparts="schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
            >
            </schema-tree>
          `))}),d`
      <div class="request-body-container" data-selected-request-body-type="${this.selectedRequestBodyType}">
        <div class="table-title top-gap row">
          REQUEST BODY ${this.request_body.required?d`<span class="mono-font" style="color:var(--red)">*</span>`:""}
          <span style="font-weight:normal; margin-left:5px"> ${this.selectedRequestBodyType}</span>
          <span style="flex:1"></span>
          ${e}
        </div>
        ${this.request_body.description?d`<div class="m-markdown" style="margin-bottom:12px">
                ${R(q(D(this.request_body.description)))}
              </div>`:""}
        ${this.selectedRequestBodyType.includes("json")||this.selectedRequestBodyType.includes("xml")||this.selectedRequestBodyType.includes("text")||this.selectedRequestBodyType.includes("jose")?d` <div part="tab-panel" class="tab-panel col" style="border-width:0 0 1px 0;">
                <div
                  part="tab-btn-row"
                  class="tab-buttons row"
                  @click="${o=>{o.target.tagName.toLowerCase()==="button"&&(this.activeSchemaTab=o.target.dataset.tab)}}"
                >
                  <button part="tab-btn" class="tab-btn ${this.activeSchemaTab==="example"?"active":""}" data-tab="example">
                    EXAMPLE
                  </button>
                  <button part="tab-btn" class="tab-btn ${this.activeSchemaTab==="example"?"":"active"}" data-tab="schema">
                    SCHEMA
                  </button>
                </div>
                ${d`<div
                  part="tab-content"
                  class="tab-content col"
                  style="display:${this.activeSchemaTab==="example"?"block":"none"};"
                >
                  ${s}
                </div>`}
                ${d`<div
                  part="tab-content"
                  class="tab-content col"
                  style="display:${this.activeSchemaTab==="example"?"none":"block"};"
                >
                  ${r}
                </div>`}
              </div>`:d` ${t} ${a}`}
      </div>
    `}formDataParamAsObjectTemplate(e,t,a){let r=Z(t,{}),s=Ht(t,"json",le(t.examples),le(t.example),this.callback==="true"||this.webhook==="true",this.callback!=="true"&&this.webhook!=="true","text",!1);return d`
      <div
        part="tab-panel"
        class="tab-panel row"
        style="min-height:220px; border-left: 6px solid var(--light-border-color); align-items: stretch;"
      >
        <div style="width:24px; background:var(--light-border-color)">
          <div
            class="row"
            style="flex-direction:row-reverse; width:160px; height:24px; transform:rotate(270deg) translateX(-160px); transform-origin:top left; display:block;"
            @click="${n=>{if(n.target.classList.contains("v-tab-btn")){let{tab:i}=n.target.dataset;if(i){let o=n.target.closest(".tab-panel"),l=o.querySelector(`.v-tab-btn[data-tab="${i}"]`),c=[...o.querySelectorAll(`.v-tab-btn:not([data-tab="${i}"])`)],p=o.querySelector(`.tab-content[data-tab="${i}"]`),u=[...o.querySelectorAll(`.tab-content:not([data-tab="${i}"])`)];l.classList.add("active"),p.style.display="block",c.forEach(h=>{h.classList.remove("active")}),u.forEach(h=>{h.style.display="none"})}}n.target.tagName.toLowerCase()==="button"&&(this.activeSchemaTab=n.target.dataset.tab)}}"
          >
            <button class="v-tab-btn ${this.activeSchemaTab==="example"?"active":""}" data-tab="example">EXAMPLE</button>
            <button class="v-tab-btn ${this.activeSchemaTab==="example"?"":"active"}" data-tab="schema">SCHEMA</button>
          </div>
        </div>
        ${d` <div
          class="tab-content col"
          data-tab="example"
          style="display:${this.activeSchemaTab==="example"?"block":"none"}; padding-left:5px; width:100%"
        >
          <textarea
            class="textarea"
            part="textarea textarea-param"
            style="width:100%; border:none; resize:vertical;"
            data-array="false"
            data-ptype="${a.includes("form-urlencode")?"form-urlencode":"form-data"}"
            data-pname="${e}"
            data-example="${s[0]?.exampleValue||""}"
            .textContent="${this.fillRequestFieldsWithExample==="true"?s[0].exampleValue:""}"
            spellcheck="false"
          ></textarea>
        </div>`}
        ${d` <div
          class="tab-content col"
          data-tab="schema"
          style="display:${this.activeSchemaTab==="example"?"none":"block"}; padding-left:5px; width:100%;"
        >
          <schema-tree
            .data="${r}"
            schema-expand-level="${this.schemaExpandLevel}"
            schema-description-expanded="${this.schemaDescriptionExpanded}"
            allow-schema-description-expand-toggle="${this.allowSchemaDescriptionExpandToggle}"
            ,
          >
          </schema-tree>
        </div>`}
      </div>
    `}formDataTemplate(e,t,a=""){let r=[];if(e.properties){for(let s in e.properties){let n=e.properties[s];if(n.readOnly)continue;let i=n.examples||n.example||"",o=n.type,l=Oe(n),c="read focused".includes(this.renderStyle)?"200px":"160px",p=Ri(l.examples||l.example,l.type);r.push(d` <tr title="${n.deprecated?"Deprecated":""}">
              <td style="width:${c}; min-width:100px;">
                <div class="param-name ${n.deprecated?"deprecated":""}">
                  ${s}${e.required?.includes(s)||n.required?d`<span style="color:var(--red);">*</span>`:""}
                </div>
                <div class="param-type">${l.type}</div>
              </td>
              <td
                style="${o==="object"?"width:100%; padding:0;":this.allowTry==="true"?"":"display:none;"} min-width:100px;"
                colspan="${o==="object"?2:1}"
              >
                ${o==="array"?n.items?.format==="binary"?d`
                          <div
                            class="file-input-container col"
                            style="align-items:flex-end;"
                            @click="${u=>this.onAddRemoveFileInput(u,s,t)}"
                          >
                            <div class="input-set row">
                              <input
                                type="file"
                                part="file-input"
                                style="width:100%"
                                data-pname="${s}"
                                data-ptype="${t.includes("form-urlencode")?"form-urlencode":"form-data"}"
                                data-array="false"
                                data-file-array="true"
                              />
                              <button class="file-input-remove-btn">&#x2715;</button>
                            </div>
                            <button
                              class="m-btn primary file-input-add-btn"
                              part="btn btn-fill"
                              style="margin:2px 25px 0 0; padding:2px 6px;"
                            >
                              ADD
                            </button>
                          </div>
                        `:d`
                          <tag-input
                            style="width:100%"
                            data-ptype="${t.includes("form-urlencode")?"form-urlencode":"form-data"}"
                            data-pname="${s}"
                            data-example="${Array.isArray(i)?i.join("~|~"):i}"
                            data-array="true"
                            placeholder="add-multiple &#x21a9;"
                            .value="${Array.isArray(i)?Array.isArray(i[0])?i[0]:i:[]}"
                          >
                          </tag-input>
                        `:d` ${o==="object"?this.formDataParamAsObjectTemplate.call(this,s,n,t):d`
                              ${this.allowTry==="true"?d`<input
                                      .value="${this.fillRequestFieldsWithExample==="true"?p.exampleVal:""}"
                                      spellcheck="false"
                                      type="${n.format==="binary"?"file":n.format==="password"?"password":"text"}"
                                      part="textbox textbox-param"
                                      style="width:100%"
                                      data-ptype="${t.includes("form-urlencode")?"form-urlencode":"form-data"}"
                                      data-pname="${s}"
                                      data-example="${Array.isArray(i)?i[0]:i}"
                                      data-array="false"
                                    />`:""}
                            `}`}
              </td>
              ${o==="object"?"":d` <td>
                      ${l.default||l.constrain||l.allowedValues||l.pattern?d` <div class="param-constraint">
                              ${l.default?d`<span style="font-weight:bold">Default: </span>${l.default}<br />`:""}
                              ${l.pattern?d`<span style="font-weight:bold">Pattern: </span>${l.pattern}<br />`:""}
                              ${l.constrain?d`${l.constrain}<br />`:""}
                              ${l.allowedValues&&l.allowedValues.split("\u2503").map((u,h)=>d` ${h>0?"\u2503":d`<span style="font-weight:bold">Allowed: </span>`}
                                    ${d` <a
                                      part="anchor anchor-param-constraint"
                                      class="${this.allowTry==="true"?"":"inactive-link"}"
                                      data-type="${l.type==="array"?l.type:"string"}"
                                      data-enum="${u.trim()}"
                                      @click="${m=>{let b=m.target.closest("table").querySelector(`[data-pname="${s}"]`);b&&(b.value=m.target.dataset.type==="array"?[m.target.dataset.enum]:m.target.dataset.enum)}}"
                                    >
                                      ${u}
                                    </a>`}`)}
                            </div>`:""}
                    </td>`}
            </tr>
            ${o==="object"?"":d`
                    <tr>
                      <td style="border:none"></td>
                      <td colspan="2" style="border:none; margin-top:0; padding:0 5px 8px 5px;">
                        <span class="m-markdown-small"> ${R(q(D(n.description||"")))} </span>
                        ${this.exampleListTemplate.call(this,s,l.type,p.exampleList)}
                      </td>
                    </tr>
                  `}`)}return d`
        <table role="presentation" style="width:100%;" class="m-table">
          ${r}
        </table>
      `}return d`
      <textarea
        class="textarea dynamic-form-param ${t}"
        part="textarea textarea-param"
        spellcheck="false"
        data-pname="dynamic-form"
        data-ptype="${t}"
        .textContent="${a}"
        style="width:100%"
      ></textarea>
      ${e.description?d`<span class="m-markdown-small"> ${R(q(D(e.description)))} </span>`:""}
    `}curlSyntaxTemplate(e="flex"){return d`
      <div class="col m-markdown" style="flex:1; display:${e}; position:relative; max-width: 100%;">
        <button
          class="toolbar-btn"
          style="position:absolute; top:12px; right:8px"
          @click="${t=>{Ot(this.curlSyntax.trim().replace(/\\$/,""),t)}}"
          part="btn btn-fill btn-copy"
        >
          Copy
        </button>
        <pre style="white-space:pre"><code class="language-shell">${this.curlSyntax.trim().replace(/\\$/,"")}</code></pre>
      </div>
    `}apiResponseTabTemplate(){let e="",t="";return this.responseIsBlob||(e=this.responseHeaders.includes("application/x-ndjson")||this.responseHeaders.includes("json")?"json":this.responseHeaders.includes("html")||this.responseHeaders.includes("xml")?"html":"text",t=d`<code class="language-${e}">${this.responseText}</code>`),d` <div class="row" style="font-size:var(--font-size-small); margin:5px 0">
        <div class="response-message ${this.responseStatus}">Response Status: ${this.responseMessage}</div>
        <div style="flex:1"></div>
        <button class="m-btn" part="btn btn-outline btn-clear-response" @click="${this.clearResponseData}">CLEAR RESPONSE</button>
      </div>
      <div part="tab-panel" class="tab-panel col" style="border-width:0 0 1px 0;">
        <div
          id="tab_buttons"
          part="tab-btn-row"
          class="tab-buttons row"
          @click="${a=>{a.target.classList.contains("tab-btn")!==!1&&(this.activeResponseTab=a.target.dataset.tab)}}"
        >
          <button part="tab-btn" class="tab-btn ${this.activeResponseTab==="response"?"active":""}" data-tab="response">
            RESPONSE
          </button>
          <button part="tab-btn" class="tab-btn ${this.activeResponseTab==="headers"?"active":""}" data-tab="headers">
            RESPONSE HEADERS
          </button>
          ${this.showCurlBeforeTry==="true"?"":d`<button part="tab-btn" class="tab-btn ${this.activeResponseTab==="curl"?"active":""}" data-tab="curl">
                  CURL
                </button>`}
        </div>
        ${this.responseIsBlob?d`<div
                part="tab-content"
                class="tab-content col"
                style="flex:1; display:${this.activeResponseTab==="response"?"flex":"none"};"
              >
                ${this.responseBlobType==="image"?d`<img style="max-height:var(--resp-area-height, 400px); object-fit:contain;" class="mar-top-8" src="${Id(this.responseBlobUrl)}"></img>`:""}
                <button
                  class="m-btn thin-border mar-top-8"
                  style="width:135px"
                  @click="${a=>{un(this.responseBlobUrl,this.respContentDisposition,a)}}"
                  part="btn btn-outline"
                >
                  DOWNLOAD
                </button>
                ${this.responseBlobType==="view"||this.responseBlobType==="image"?d`<button
                        class="m-btn thin-border mar-top-8"
                        style="width:135px"
                        @click="${a=>{hn(this.responseBlobUrl,a)}}"
                        part="btn btn-outline"
                      >
                        VIEW (NEW TAB)
                      </button>`:""}
              </div>`:d`<div
                part="tab-content"
                class="tab-content col m-markdown"
                style="flex:1; display:${this.activeResponseTab==="response"?"flex":"none"};"
              >
                <button
                  class="toolbar-btn"
                  style="position:absolute; top:12px; right:8px"
                  @click="${a=>{Ot(this.responseText,a)}}"
                  part="btn btn-fill btn-copy"
                >
                  Copy
                </button>
                <pre style="white-space:pre; min-height:50px; height:var(--resp-area-height, 400px); resize:vertical; overflow:auto">
${t}</pre>
              </div>`}
        <div
          part="tab-content"
          class="tab-content col m-markdown"
          style="flex:1; display:${this.activeResponseTab==="headers"?"flex":"none"};"
        >
          <button
            class="toolbar-btn"
            style="position:absolute; top:12px; right:8px"
            @click="${a=>{Ot(this.responseHeaders,a)}}"
            part="btn btn-fill btn-copy"
          >
            Copy
          </button>
          <pre style="white-space:pre"><code class="language-css">${this.responseHeaders}</code></pre>
        </div>
        ${this.showCurlBeforeTry==="true"?"":this.curlSyntaxTemplate(this.activeResponseTab==="curl"?"flex":"none")}
      </div>`}apiCallTemplate(){return d`<div style="display:flex; align-items:flex-end; margin:16px 0; font-size:var(--font-size-small);" part="wrap-request-btn">
        <div class="hide-in-small-screen" style="flex-direction:column; margin:0; width:calc(100% - 60px);">
          <div style="display:flex; flex-direction:row; align-items:center; overflow:hidden;">${d`
      <div style="display:flex; flex-direction:column;">
        ${this.serverUrl?d`<div style="display:flex; align-items:baseline;">
                <div style="font-weight:bold; padding-right:5px;">API Server</div>
                <span class="gray-text"> ${this.serverUrl} </span>
              </div>`:""}
      </div>
    `}</div>
          <div style="display:flex;">
            <div style="font-weight:bold; padding-right:5px;">Authentication</div>
            ${this.security?.length>0?d` ${this.api_keys.length>0?d`<div style="color:var(--blue); overflow:hidden;">
                          ${this.api_keys.length===1?`${this.api_keys[0]?.typeDisplay} in ${this.api_keys[0].in}`:`${this.api_keys.length} API keys applied`}
                        </div>`:d`<div class="gray-text">Required <span style="color:var(--red)">(None Applied)</span></div>`}`:d`<span class="gray-text"> Not Required </span>`}
          </div>
        </div>
        ${this.parameters.length>0||this.request_body?d` <button
                  class="m-btn thin-border"
                  part="btn btn-outline btn-fill"
                  style="margin-right:5px;"
                  @click="${this.onFillRequestData}"
                  title="Fills with example data (if provided)"
                >
                  FILL EXAMPLE
                </button>
                <button
                  class="m-btn thin-border"
                  part="btn btn-outline btn-clear"
                  style="margin-right:5px;"
                  @click="${this.onClearRequestData}"
                >
                  CLEAR
                </button>`:""}
        <button class="m-btn primary thin-border" part="btn btn-try" @click="${this.onTryClick}">TRY</button>
      </div>
      <div class="row" style="font-size:var(--font-size-small); margin:5px 0">
        ${this.showCurlBeforeTry==="true"?this.curlSyntaxTemplate():""}
      </div>
      ${this.responseMessage===""?"":this.apiResponseTabTemplate()} `}async onFillRequestData(e){[...e.target.closest(".request-panel").querySelectorAll("input, tag-input, textarea:not(.is-hidden)")].forEach(t=>{t.dataset.example&&(t.value=t.tagName.toUpperCase()==="TAG-INPUT"?t.dataset.example.split("~|~"):t.dataset.example)})}async onClearRequestData(e){[...e.target.closest(".request-panel").querySelectorAll("input, tag-input, textarea:not(.is-hidden)")].forEach(t=>{t.value=""})}buildFetchURL(e){let t,a=[...e.querySelectorAll("[data-ptype='path']")],r=[...e.querySelectorAll("[data-ptype='query']")],s=[...e.querySelectorAll("[data-ptype='query-object']")];t=this.path,a.map(l=>{t=t.replace(`{${l.dataset.pname}}`,encodeURIComponent(l.value))});let n=new Map,i=[];r.length>0&&r.forEach(l=>{let c=new URLSearchParams;if(l.dataset.paramAllowReserved==="true"&&i.push(l.dataset.pname),l.dataset.array==="false")l.value!==""&&c.append(l.dataset.pname,l.value);else{let{paramSerializeStyle:p,paramSerializeExplode:u}=l.dataset,h=l.value&&Array.isArray(l.value)?l.value:[];h=Array.isArray(h)?h.filter(m=>m!==""):[],h.length>0&&(p==="spaceDelimited"?c.append(l.dataset.pname,h.join(" ").replace(/^\s|\s$/g,"")):p==="pipeDelimited"?c.append(l.dataset.pname,h.join("|").replace(/^\||\|$/g,"")):u==="true"?h.forEach(m=>{c.append(l.dataset.pname,m)}):c.append(l.dataset.pname,h.join(",").replace(/^,|,$/g,"")))}c.toString()&&n.set(l.dataset.pname,c)}),s.length>0&&s.map(l=>{let c=new URLSearchParams;try{let p={},{paramSerializeStyle:u,paramSerializeExplode:h,pname:m}=l.dataset;if(p=Object.assign(p,JSON.parse(l.value.replace(/\s+/g," "))),l.dataset.paramAllowReserved==="true"&&i.push(l.dataset.pname),"json xml".includes(u))u==="json"?c.append(l.dataset.pname,JSON.stringify(p)):u==="xml"&&c.append(l.dataset.pname,rs(p));else for(let b in p){let g=`${m}[${b}]`;typeof p[b]=="object"?Array.isArray(p[b])&&(u==="spaceDelimited"?c.append(g,p[b].join(" ")):u==="pipeDelimited"?c.append(g,p[b].join("|")):h==="true"?p[b].forEach(y=>{c.append(g,y)}):c.append(g,p[b])):c.append(g,p[b])}}catch{}c.toString()&&n.set(l.dataset.pname,c)});let o="";return n.size&&(n.forEach((l,c)=>{i.includes(c)?(o+=`${c}=`,o+=l.getAll(c).join(`&${c}=`),o+="&"):o+=`${l.toString()}&`}),o=o.slice(0,-1)),o.length!==0&&(t=`${t}${t.includes("?")?"&":"?"}${o}`),this.api_keys.filter(l=>l.in==="query").forEach(l=>{t=`${t}${t.includes("?")?"&":"?"}${l.name}=${encodeURIComponent(l.finalKeyValue)}`}),t=`${this.serverUrl.replace(/\/$/,"")}${t}`,t}buildFetchHeaders(e){let t=this.closest(".expanded-req-resp-container, .req-resp-container")?.getElementsByTagName("api-response")[0],a=[...e.querySelectorAll("[data-ptype='header'], [data-ptype='header-object']")],r=e.querySelector(".request-body-container"),s=t?.selectedMimeType,n=new Headers;if(s?n.append("Accept",s):this.accept&&n.append("Accept",this.accept),this.api_keys.filter(i=>i.in==="header").forEach(i=>{n.append(i.name,i.finalKeyValue)}),a.map(i=>{if(i.value)if(i.dataset.ptype==="header-object"){let o=JSON.parse(i.value.replace(/\n/g,"").trim()),l=i.dataset.paramSerializeExplode==="true"?"=":",",c=Object.keys(o).map(p=>{let u=o[p];return typeof u=="object"?`${p}${l}${JSON.stringify(u)}`:`${p}${l}${u}`}).join(",");n.append(i.dataset.pname,c)}else n.append(i.dataset.pname,i.value)}),r){let i=r.dataset.selectedRequestBodyType;i.includes("form-data")||n.append("Content-Type",i)}return n}buildFetchBodyOptions(e){let t=e.querySelector(".request-body-container"),a={method:this.method.toUpperCase()};if(t){let r=t.dataset.selectedRequestBodyType;if(r.includes("form-urlencoded")){let s=e.querySelector("[data-ptype='dynamic-form']");if(s){let n=s.value,i=new URLSearchParams,o=!0,l;if(n)try{l=JSON.parse(n)}catch{o=!1}else o=!1;if(o){for(let c in l)i.append(c,JSON.stringify(l[c]));a.body=i}}else{let n=[...e.querySelectorAll("[data-ptype='form-urlencode']")],i=new URLSearchParams;n.filter(o=>o.type!=="file").forEach(o=>{if(o.dataset.array==="false")o.value&&i.append(o.dataset.pname,o.value);else{let l=o.value&&Array.isArray(o.value)?o.value.join(","):"";i.append(o.dataset.pname,l)}}),a.body=i}}else if(r.includes("form-data")){let s=new FormData;[...e.querySelectorAll("[data-ptype='form-data']")].forEach(n=>{n.dataset.array==="false"?n.type==="file"&&n.files[0]?s.append(n.dataset.pname,n.files[0],n.files[0].name):n.value&&s.append(n.dataset.pname,n.value):n.value&&Array.isArray(n.value)&&s.append(n.dataset.pname,n.value.join(","))}),a.body=s}else if(/^audio\/|^image\/|^video\/|^font\/|tar$|zip$|7z$|rtf$|msword$|excel$|\/pdf$|\/octet-stream$/.test(r)){let s=e.querySelector(".request-body-param-file");s?.files[0]&&(a.body=s.files[0])}else if(r.includes("json")||r.includes("xml")||r.includes("text")){let s=e.querySelector(".request-body-param-user-input");s?.value&&(a.body=s.value)}}return a}async onTryClick(e){let t=e.target,a=t.closest(".request-panel"),r=this.buildFetchURL(a),s=this.buildFetchBodyOptions(a),n=this.buildFetchHeaders(a);this.responseUrl="",this.responseHeaders=[],this.curlSyntax=this.generateCURLSyntax(r,n,s,a),this.responseStatus="success",this.responseIsBlob=!1,this.respContentDisposition="",this.responseBlobUrl&&=(URL.revokeObjectURL(this.responseBlobUrl),""),this.fetchCredentials&&(s.credentials=this.fetchCredentials);let i=new AbortController,{signal:o}=i;s.headers=n;let l={url:r,...s};this.dispatchEvent(new CustomEvent("before-try",{bubbles:!0,composed:!0,detail:{request:l,controller:i}}));let c={method:l.method,headers:l.headers,credentials:l.credentials,body:l.body},p=new Request(l.url,c),u,h;try{let m,b,g;t.disabled=!0,this.responseText="\u231B",this.responseMessage="",this.requestUpdate();let y=performance.now();u=await fetch(p,{signal:o});let w=performance.now();h=u.clone(),t.disabled=!1,this.responseMessage=d`${u.statusText?`${u.statusText}:${u.status}`:u.status}
        <div style="color:var(--light-fg)">Took ${Math.round(w-y)} milliseconds</div>`,this.responseUrl=u.url;let v={};u.headers.forEach((f,$)=>{v[$]=f,this.responseHeaders=`${this.responseHeaders}${$}: ${f}
`});let x=u.headers.get("content-type");if((await u.clone().text()).length===0)this.responseText="";else if(x){if(x=x.split(";")[0].trim(),x==="application/x-ndjson")this.responseText=await u.text();else if(x.includes("json"))if(/charset=[^"']+/.test(x)){let f=x.split("charset=")[1],$=await u.arrayBuffer();try{g=new TextDecoder(f).decode($)}catch{g=new TextDecoder("utf-8").decode($)}try{b=JSON.parse(g),this.responseText=JSON.stringify(b,null,2)}catch{this.responseText=g}}else b=await u.json(),this.responseText=JSON.stringify(b,null,2);else/^font\/|tar$|zip$|7z$|rtf$|msword$|excel$|\/pdf$|\/octet-stream$|^application\/vnd\./.test(x)?(this.responseIsBlob=!0,this.responseBlobType="download"):/^image/.test(x)?(this.responseIsBlob=!0,this.responseBlobType="image"):/^audio|^image|^video/.test(x)?(this.responseIsBlob=!0,this.responseBlobType="view"):(g=await u.text(),this.responseText=x.includes("xml")?Ld(g,{textNodesOnSameLine:!0,indentor:"  "}):g);if(this.responseIsBlob){let f=u.headers.get("content-disposition")||"",$="filename";if(f){let k=f.match(/filename\*=\s*UTF-8''([^;]+)/);if(k)$=decodeURIComponent(k[1]);else{let S=f.match(/filename="?([^"]+)"?/);S&&($=S[1])}}this.respContentDisposition=$,m=await u.blob(),this.responseBlobUrl=URL.createObjectURL(m)}}else g=await u.text(),this.responseText=g;this.dispatchEvent(new CustomEvent("after-try",{bubbles:!0,composed:!0,detail:{request:p,response:h,responseHeaders:v,responseBody:b||g||m,responseStatus:h.ok}}))}catch(m){t.disabled=!1,m.name==="AbortError"?(this.dispatchEvent(new CustomEvent("request-aborted",{bubbles:!0,composed:!0,detail:{err:m,request:p}})),this.responseMessage="Request Aborted",this.responseText="Request Aborted"):(this.dispatchEvent(new CustomEvent("after-try",{bubbles:!0,composed:!0,detail:{err:m,request:p}})),this.responseMessage=`${m.message} (CORS or Network Issue)`)}this.requestUpdate()}liveCURLSyntaxUpdate(e){this.applyCURLSyntax(e),this.requestUpdate()}onGenerateCURLClick(e){let t=this.getRequestPanel(e);this.applyCURLSyntax(t)}getRequestPanel(e){return e.target.closest(".request-panel")}applyCURLSyntax(e){let t=this.buildFetchURL(e),a=this.buildFetchBodyOptions(e),r=this.buildFetchHeaders(e);this.curlSyntax=this.generateCURLSyntax(t,r,a,e)}generateCURLSyntax(e,t,a,r){let s,n="",i="",o="",l="",c=r.querySelector(".request-body-container");if(s=e.startsWith("http")===!1?new URL(e,window.location.href).href:e,n=`curl -X ${this.method.toUpperCase()} "${s}" \\
`,t.forEach((p,u)=>{let h=[],m=p.split(",").map(b=>{let g=b.trim().toLowerCase();return h.includes(g)?null:(h.push(g),b)}).filter(b=>b!==null).join(",");t.set(u,m)}),i=Array.from(t).map(([p,u])=>` -H '${p}: ${u}'`).join(`\\
`),i&&=`${i} \\
`,a.body instanceof URLSearchParams)o=` -d ${a.body.toString()} \\
`;else if(a.body instanceof File)o=` --data-binary @${a.body.name} \\
`;else if(a.body instanceof FormData)l=Array.from(a.body).reduce((p,[u,h])=>{if(h instanceof File)return[...p,` -F "${u}=@${h.name}"`];let m=h.match(/([^,],)/gm);if(m){let b=m.map(g=>`-F "${u}[]=${g}"`);return[...p,...b]}return[...p,` -F "${u}=${h}"`]},[]).join(`\\
`);else if(c&&c.dataset.selectedRequestBodyType){let p=c.dataset.selectedRequestBodyType,u=r.querySelector(".request-body-param-user-input");if(u?.value){if(a.body=u.value,p.includes("json"))try{o=` -d '${JSON.stringify(JSON.parse(u.value.replace(/'/g,"'\\''")))}' \\
`}catch{}o||=` -d '${u.value.replace(/'/g,`'"'"'`)}' \\
`}}return`${n}${i}${o}${l}`}onAddRemoveFileInput(e,t,a){if(e.target.tagName.toLowerCase()!=="button")return;if(e.target.classList.contains("file-input-remove-btn")){e.target.closest(".input-set").remove();return}let r=e.target.closest(".file-input-container"),s=document.createElement("div");s.setAttribute("class","input-set row");let n=document.createElement("input");n.type="file",n.style="width:200px; margin-top:2px;",n.setAttribute("data-pname",t),n.setAttribute("data-ptype",a.includes("form-urlencode")?"form-urlencode":"form-data"),n.setAttribute("data-array","false"),n.setAttribute("data-file-array","true");let i=document.createElement("button");i.setAttribute("class","file-input-remove-btn"),i.innerHTML="&#x2715;",s.appendChild(n),s.appendChild(i),r.insertBefore(s,e.target)}clearResponseData(){this.responseUrl="",this.responseHeaders="",this.responseText="",this.responseStatus="success",this.responseMessage="",this.responseIsBlob=!1,this.responseBlobType="",this.respContentDisposition="",this.responseBlobUrl&&=(URL.revokeObjectURL(this.responseBlobUrl),"")}disconnectedCallback(){this.curlSyntax="",this.responseBlobUrl&&=(URL.revokeObjectURL(this.responseBlobUrl),""),super.disconnectedCallback()}};customElements.define("api-request",Hd);var Wd=class extends ee{static get properties(){return{schemaExpandLevel:{type:Number,attribute:"schema-expand-level"},schemaDescriptionExpanded:{type:String,attribute:"schema-description-expanded"},allowSchemaDescriptionExpandToggle:{type:String,attribute:"allow-schema-description-expand-toggle"},schemaHideReadOnly:{type:String,attribute:"schema-hide-read-only"},schemaHideWriteOnly:{type:String,attribute:"schema-hide-write-only"},data:{type:Object}}}connectedCallback(){super.connectedCallback(),(!this.schemaExpandLevel||this.schemaExpandLevel<1)&&(this.schemaExpandLevel=99999),(!this.schemaDescriptionExpanded||!"true false".includes(this.schemaDescriptionExpanded))&&(this.schemaDescriptionExpanded="false"),(!this.schemaHideReadOnly||!"true false".includes(this.schemaHideReadOnly))&&(this.schemaHideReadOnly="true"),(!this.schemaHideWriteOnly||!"true false".includes(this.schemaHideWriteOnly))&&(this.schemaHideWriteOnly="true")}static get styles(){return[je,Pi,M`
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
          width: var(--table-schema-key-width, 240px);
          text-overflow: var(--table-schema-key-text-overflow, ellipsis);
          white-space: var(--table-schema-key-whitespace, nowrap);
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
          border-radius: 2px;
          border: 1px solid transparent;
          display: inline-block;
          margin-left: -16px;
          color: var(--primary-color);
          cursor: pointer;
          font-size: calc(var(--font-size-small) + 4px);
          font-family: var(--font-mono);
          background-clip: border-box;
        }
        .obj-toggle:hover {
          border-color: var(--primary-color);
        }
        .tr.expanded + .object-body {
          display: block;
        }
        .tr.collapsed + .object-body {
          display: none;
        }
      `,Qe]}render(){return d`
      <div
        class="table ${this.schemaDescriptionExpanded==="true"?"expanded-all-descr":"collapsed-all-descr"}"
        @click="${e=>this.handleAllEvents(e)}"
      >
        <div class="toolbar">
          <div class="toolbar-item schema-root-type ${this.data?.["::type"]||""} ">${this.data?.["::type"]||""}</div>
          ${this.allowSchemaDescriptionExpandToggle==="true"?d`
                  <div style="flex:1"></div>
                  <div part="schema-multiline-toggle" class="toolbar-item schema-multiline-toggle">
                    ${this.schemaDescriptionExpanded==="true"?"Single line description":"Multiline description"}
                  </div>
                `:""}
        </div>
        <span part="schema-description" class="m-markdown"> ${R(D(this.data?.["::description"]||""))} </span>
        <div style="border:1px solid var(--light-border-color)">
          <div style="display:flex; background: var(--bg2); padding:8px 4px; border-bottom:1px solid var(--light-border-color);">
            <div class="key" style="font-family:var(--font-regular); font-weight:bold; color:var(--fg);">Field</div>
            <div class="key-type" style="font-family:var(--font-regular); font-weight:bold; color:var(--fg);">Type</div>
            <div class="key-descr" style="font-family:var(--font-regular); font-weight:bold; color:var(--fg);">Description</div>
          </div>
          ${this.data?d` ${this.generateTree(this.data["::type"]==="array"?this.data["::props"]:this.data,this.data["::type"],this.data["::array-type"])}`:""}
        </div>
      </div>
    `}generateTree(e,t="object",a="",r="",s="",n=0,i=0,o="",l=!1){if(this.schemaHideReadOnly==="true"&&(t==="array"&&o==="readonly"||e&&e["::readwrite"]==="readonly")||this.schemaHideWriteOnly==="true"&&(t==="array"&&o==="writeonly"||e&&e["::readwrite"]==="writeonly"))return;if(!e)return d`<div class="null" style="display:inline;">
        <span style="margin-left:${(n+1)*16}px"> &nbsp; </span>
        <span class="key-label xxx-of-key"> ${r.replace("::OPTION~","")}</span>
        ${t==="array"?d`<span class="mono-font"> [ ] </span>`:t==="object"?d`<span class="mono-font"> { } </span>`:d`<span class="mono-font"> schema undefined </span>`}
      </div>`;let c=e["::type"]?.startsWith("xxx-of")?n:n+1,p=t==="xxx-of-option"||e["::type"]==="xxx-of-option"||r.startsWith("::OPTION")?i:i+1,u=16*p;if(Object.keys(e).length===0)return d`<span class="td key object" style="padding-left:${u}px">${r}</span>`;let h="",m="",b=!1;if(r.startsWith("::ONE~OF")||r.startsWith("::ANY~OF"))h=r.replace("::","").replace("~"," "),b=!0;else if(r.startsWith("::OPTION")){let C=r.split("~");h=C[1],m=C[2]}else h=r;let g="";if(e["::type"]==="object"?g=t==="array"?"array of object":e["::dataTypeLabel"]||e["::type"]:e["::type"]==="array"&&(g=t==="array"?`array of array ${a==="object"?"":`of ${a}`}`:e["::dataTypeLabel"]||e["::type"]),typeof e=="object")return d`
        ${c>=0&&r?d`<div
                class="tr ${c<=this.schemaExpandLevel?"expanded":"collapsed"} ${e["::type"]}"
                data-obj="${h}"
                title="${l||e["::deprecated"]?`Deprecated ${h}`:h}"
              >
                <div class="td key ${l||e["::deprecated"]?"deprecated":""}" style="padding-left:${u}px">
                  ${h||m?d`<span
                          class="obj-toggle ${c<this.schemaExpandLevel?"expanded":"collapsed"}"
                          data-obj="${h}"
                        >
                          ${n<this.schemaExpandLevel?"-":"+"}
                        </span>`:""}
                  ${e["::type"]==="xxx-of-option"||e["::type"]==="xxx-of-array"||r.startsWith("::OPTION")?d`<span class="xxx-of-key" style="margin-left:-6px">${h}</span
                          ><span class="${b?"xxx-of-key":"xxx-of-descr"}">${m}</span>`:h.endsWith("*")?d`<span class="key-label" style="display:inline-block; margin-left:-6px;"
                              >${l||e["::deprecated"]?d`<svg viewBox="0 0 10 10" width="10" height="10" style="stroke:var(--red); margin-right:-6px">
                                      <path d="M2 2L8 8M2 8L8 2" />
                                    </svg>`:""}
                              ${h.substring(0,h.length-1)}</span
                            ><span style="color:var(--red);">*</span>`:d`<span class="key-label" style="display:inline-block; margin-left:-6px;"
                            >${l||e["::deprecated"]?d`<svg viewBox="0 0 10 10" width="10" height="10" style="stroke:var(--red); margin-right:-6px">
                                    <path d="M2 2L8 8M2 8L8 2" />
                                  </svg>`:""}
                            ${h==="::props"?"":h}</span
                          >`}
                  ${e["::type"]==="xxx-of"&&t==="array"?d`<span style="color:var(--primary-color)">ARRAY</span>`:""}
                </div>
                <div
                  class="td key-type"
                  title="${e["::readwrite"]==="readonly"?"Read-Only":e["::readwrite"]==="writeonly"?"Write-Only":""}"
                >
                  ${(e["::type"]||"").includes("xxx-of")?"":g}
                  ${e["::readwrite"]==="readonly"?" \u{1F181}":e["::readwrite"]==="writeonly"?" \u{1F186}":""}
                </div>
                <div class="td key-descr m-markdown-small" style="line-height:1.7">${R(D(s||""))}</div>
              </div>`:d` ${e["::type"]==="array"&&t==="array"?d`<div class="tr">
                      <div class="td key"></div>
                      <div class="td key-type">${a&&a!=="object"?`${t} of ${a}`:t}</div>
                      <div class="td key-descr"></div>
                    </div>`:""}`}
        <div class="object-body">
          ${Array.isArray(e)&&e[0]?d`${this.generateTree(e[0],"xxx-of-option","","::ARRAY~OF","",c,p,"")}`:d`
                  ${Object.keys(e).map(C=>d`
                      ${["::title","::description","::type","::props","::deprecated","::array-type","::readwrite","::dataTypeLabel","::nullable"].includes(C)?e[C]["::type"]==="array"||e[C]["::type"]==="object"?d`${this.generateTree(e[C]["::type"]==="array"?e[C]["::props"]:e[C],e[C]["::type"],e[C]["::array-type"]||"",C,e[C]["::description"],c,p,e[C]["::readwrite"]?e[C]["::readwrite"]:"",l||e[C]["::deprecated"])}`:"":d`${this.generateTree(e[C]["::type"]==="array"?e[C]["::props"]:e[C],e[C]["::type"],e[C]["::array-type"]||"",C,e[C]?.["::description"]||"",c,p,e[C]["::readwrite"]?e[C]["::readwrite"]:"",l||e[C]["::deprecated"])}`}
                    `)}
                `}
        </div>
      `;let[y,w,v,x,f,$,k,S,E]=e.split("~|~");if(w==="\u{1F181}"&&this.schemaHideReadOnly==="true"||w==="\u{1F186}"&&this.schemaHideWriteOnly==="true")return;let _=y.replace(/┃.*/g,"").replace(/[^a-zA-Z0-9+]/g,"").substring(0,4).toLowerCase(),I=`${v||x||f||$?'<span class="descr-expand-toggle">\u2794</span>':""}`,T="";return T=t==="array"?d`<div
        class="td key-type ${_}"
        title="${o==="readonly"?"Read-Only":w==="writeonly"?"Write-Only":""}"
      >
        [${y}] ${o==="readonly"?"\u{1F181}":o==="writeonly"?"\u{1F186}":""}
      </div>`:d`<div
        class="td key-type ${_}"
        title="${w==="\u{1F181}"?"Read-Only":w==="\u{1F186}"?"Write-Only":""}"
      >
        ${y} ${w}
      </div>`,d`
      <div class="tr primitive" title="${l||E?"Deprecated":""}">
        <div class="td key ${l||E?"deprecated":""}" style="padding-left:${u}px">
          ${l||E?d`<svg viewBox="0 0 10 10" width="10" height="10" style="stroke:var(--red); margin-right:-6px">
                  <path d="M2 2L8 8M2 8L8 2" />
                </svg>`:""}
          ${h?.endsWith("*")?d`<span class="key-label">${h.substring(0,h.length-1)}</span> <span style="color:var(--red);">*</span>`:r.startsWith("::OPTION")?d`<span class="xxx-of-key">${h}</span><span class="xxx-of-descr">${m}</span>`:d`${h?d`<span class="key-label"> ${h}</span>`:d`<span class="xxx-of-descr">${S}</span>`}`}
        </div>
        ${T}
        <div class="td key-descr" style="font-size: var(--font-size-small)">
          ${d`<span class="m-markdown-small">
            ${R(D(t==="array"?`${I} ${s}`:S?`${I} <b>${S}:</b> ${k}`:`${I} ${k}`))}
          </span>`}
          ${v?d`<div class="" style="display:inline-block; line-break:anywhere; margin-right:8px;">
                  <span class="bold-text">Constraints: </span> ${v}
                </div>`:""}
          ${x?d`<div style="display:inline-block; line-break:anywhere; margin-right:8px;">
                  <span class="bold-text">Default: </span>${x}
                </div>`:""}
          ${f?d`<div style="display:inline-block; line-break:anywhere; margin-right:8px;">
                  <span class="bold-text">${y==="const"?"Value":"Allowed"}: </span>${f}
                </div>`:""}
          ${$?d`<div style="display:inline-block; line-break:anywhere; margin-right:8px;">
                  <span class="bold-text">Pattern: </span>${$}
                </div>`:""}
        </div>
      </div>
    `}handleAllEvents(e){if(e.target.classList.contains("obj-toggle"))this.toggleObjectExpand(e);else if(e.target.classList.contains("schema-multiline-toggle"))this.schemaDescriptionExpanded=this.schemaDescriptionExpanded==="true"?"false":"true";else if(e.target.classList.contains("descr-expand-toggle")){let t=e.target.closest(".tr");t&&(t.classList.toggle("expanded-descr"),t.style.maxHeight=t.scrollHeight)}}toggleObjectExpand(e){let t=e.target.closest(".tr");t.classList.contains("expanded")?(t.classList.add("collapsed"),t.classList.remove("expanded"),e.target.innerText="+"):(t.classList.remove("collapsed"),t.classList.add("expanded"),e.target.innerText="-")}};customElements.define("schema-table",Wd);var Vd=class extends ee{constructor(){super(),this.selectedStatus="",this.headersForEachRespStatus={},this.mimeResponsesForEachStatus={},this.activeSchemaTab="schema"}static get properties(){return{callback:{type:String},webhook:{type:String},responses:{type:Object},parser:{type:Object},schemaStyle:{type:String,attribute:"schema-style"},renderStyle:{type:String,attribute:"render-style"},selectedStatus:{type:String,attribute:"selected-status"},selectedMimeType:{type:String,attribute:"selected-mime-type"},activeSchemaTab:{type:String,attribute:"active-schema-tab"},schemaExpandLevel:{type:Number,attribute:"schema-expand-level"},schemaDescriptionExpanded:{type:String,attribute:"schema-description-expanded"},allowSchemaDescriptionExpandToggle:{type:String,attribute:"allow-schema-description-expand-toggle"},schemaHideReadOnly:{type:String,attribute:"schema-hide-read-only"},schemaHideWriteOnly:{type:String,attribute:"schema-hide-write-only"}}}static get styles(){return[je,ia,la,oa,Ft,La,M`
        :where(button, input[type='checkbox'], [tabindex='0']):focus-visible {
          box-shadow: var(--focus-shadow);
        }
        :where(input[type='text'], input[type='password'], select, textarea):focus-visible {
          border-color: var(--primary-color);
        }
        .resp-head {
          vertical-align: middle;
          padding: 16px 0 8px;
        }
        .resp-head.divider {
          border-top: 1px solid var(--border-color);
          margin-top: 10px;
        }
        .resp-status {
          font-weight: bold;
          font-size: calc(var(--font-size-small) + 1px);
        }
        .resp-descr {
          font-size: calc(var(--font-size-small) + 1px);
          color: var(--light-fg);
          text-align: left;
        }
        .top-gap {
          margin-top: 16px;
        }
        .example-panel {
          font-size: var(--font-size-small);
          margin: 0;
        }
        .focused-mode,
        .read-mode {
          padding-top: 24px;
          margin-top: 12px;
          border-top: 1px dashed var(--border-color);
        }
      `,Qe]}render(){return d`<div class="col regular-font response-panel ${this.renderStyle}-mode">
      <div class=" ${this.callback==="true"?"tiny-title":"req-res-title"} ">
        ${this.callback==="true"?"CALLBACK RESPONSE":"RESPONSE"}
      </div>
      <div>${this.responseTemplate()}</div>
    </div> `}resetSelection(){this.selectedStatus="",this.selectedMimeType=""}responseTemplate(){if(!this.responses)return"";for(let e in this.responses){this.selectedStatus||=e;let t={};for(let r in this.responses[e]?.content){let s=this.responses[e].content[r];this.selectedMimeType||=r;let n=Z(s.schema,{}),i=Ht(s.schema,r,le(s.examples),le(s.example),this.callback!=="true"&&this.webhook!=="true",this.callback==="true"||this.webhook==="true",r.includes("json")?"json":"text");t[r]={description:this.responses[e].description,examples:i,selectedExample:i[0]?.exampleId||"",schemaTree:n}}let a=[];for(let r in this.responses[e]?.headers)a.push({name:r,...this.responses[e].headers[r]});this.headersForEachRespStatus[e]=a,this.mimeResponsesForEachStatus[e]=t}return d`
      ${Object.keys(this.responses).length>1?d`<div class="row" style="flex-wrap:wrap">
              ${Object.keys(this.responses).map(e=>d` ${e==="$$ref"?"":d`<button
                          @click="${()=>{this.selectedStatus=e,this.selectedMimeType=this.responses[e].content&&Object.keys(this.responses[e].content)[0]?Object.keys(this.responses[e].content)[0]:void 0}}"
                          class="m-btn small ${this.selectedStatus===e?"primary":""}"
                          part="btn ${this.selectedStatus===e?"btn-response-status btn-selected-response-status":" btn-response-status"}"
                          style="margin: 8px 4px 0 0"
                        >
                          ${e}
                        </button>`}`)}
            </div>`:d`<span>${Object.keys(this.responses)[0]}</span>`}
      ${Object.keys(this.responses).map(e=>d`<div style="display: ${e===this.selectedStatus?"block":"none"}">
            <div class="top-gap">
              <span class="resp-descr m-markdown">${R(q(D(this.responses[e]?.description||"")))}</span>
              ${this.headersForEachRespStatus[e]&&this.headersForEachRespStatus[e]?.length>0?d`${this.responseHeaderListTemplate(this.headersForEachRespStatus[e])}`:""}
            </div>
            ${Object.keys(this.mimeResponsesForEachStatus[e]).length===0?"":d`<div part="tab-panel" class="tab-panel col">
                    <div
                      part="tab-btn-row"
                      class="tab-buttons row"
                      @click="${t=>{t.target.tagName.toLowerCase()==="button"&&(this.activeSchemaTab=t.target.dataset.tab)}}"
                    >
                      <button part="tab-btn" class="tab-btn ${this.activeSchemaTab==="example"?"active":""}" data-tab="example">
                        EXAMPLE
                      </button>
                      <button part="tab-btn" class="tab-btn ${this.activeSchemaTab==="example"?"":"active"}" data-tab="schema">
                        SCHEMA
                      </button>
                      <div style="flex:1"></div>
                      ${Object.keys(this.mimeResponsesForEachStatus[e]).length===1?d`<span class="small-font-size gray-text" style="align-self:center; margin-top:8px;">
                              ${Object.keys(this.mimeResponsesForEachStatus[e])[0]}
                            </span>`:d`${this.mimeTypeDropdownTemplate(Object.keys(this.mimeResponsesForEachStatus[e]))}`}
                    </div>
                    ${this.activeSchemaTab==="example"?d`<div part="tab-content" class="tab-content col" style="flex:1;">
                            ${this.mimeExampleTemplate(this.mimeResponsesForEachStatus[e][this.selectedMimeType])}
                          </div>`:d`<div part="tab-content" class="tab-content col" style="flex:1;">
                            ${this.mimeSchemaTemplate(this.mimeResponsesForEachStatus[e][this.selectedMimeType])}
                          </div>`}
                  </div> `}
          </div>`)}
    `}responseHeaderListTemplate(e){return d`<div style="padding:16px 0 8px 0" class="resp-headers small-font-size bold-text">RESPONSE HEADERS</div>
      <table
        role="presentation"
        style="border-collapse: collapse; margin-bottom:16px; border:1px solid var(--border-color); border-radius: var(--border-radius)"
        class="small-font-size mono-font"
      >
        ${e.map(t=>d` <tr>
              <td
                style="padding:8px; vertical-align: baseline; min-width:120px; border-top: 1px solid var(--light-border-color); text-overflow: ellipsis;"
              >
                ${t.name||""}
              </td>
              <td
                style="padding:4px; vertical-align: baseline; padding:0 5px; border-top: 1px solid var(--light-border-color); text-overflow: ellipsis;"
              >
                ${t.schema?.type||""}
              </td>
              <td style="padding:8px; vertical-align: baseline; border-top: 1px solid var(--light-border-color);text-overflow: ellipsis;">
                <div class="m-markdown-small regular-font">${R(q(D(t.description||"")))}</div>
              </td>
              <td style="padding:8px; vertical-align: baseline; border-top: 1px solid var(--light-border-color); text-overflow: ellipsis;">
                ${t.schema?.example||""}
              </td>
            </tr>`)}
      </table>`}mimeTypeDropdownTemplate(e){return d`<select
      aria-label="mime types"
      @change="${t=>{this.selectedMimeType=t.target.value}}"
      style="margin-bottom: -1px; z-index:1"
    >
      ${e.map(t=>d`<option value="${t}" ?selected="${t===this.selectedMimeType}">${t}</option>`)}
    </select>`}onSelectExample(e){[...e.target.closest(".example-panel").querySelectorAll(".example")].forEach(t=>{t.style.display=t.dataset.example===e.target.value?"block":"none"})}mimeExampleTemplate(e){return e?d`
      ${e.examples.length===1?d` ${e.examples[0].exampleFormat==="json"?d` ${e.examples[0].exampleSummary&&e.examples[0].exampleSummary.length>80?d`<div style="padding: 4px 0">${e.examples[0].exampleSummary}</div>`:""}
                    ${e.examples[0].exampleDescription?d`<div class="m-markdown-small" style="padding: 4px 0">
                            ${R(q(D(e.examples[0].exampleDescription||"")),{USE_PROFILES:{html:!0}})}
                          </div>`:""}
                    <json-tree
                      render-style="${this.renderStyle}"
                      .data="${e.examples[0].exampleValue}"
                      class="example-panel ${this.renderStyle==="read"?"border pad-8-16":"border-top pad-top-8"}"
                      exportparts="btn:btn, btn-fill:btn-fill, btn-copy:btn-copy"
                    ></json-tree>`:d`
                    ${e.examples[0].exampleSummary&&e.examples[0].exampleSummary.length>80?d`<div style="padding: 4px 0">${e.examples[0].exampleSummary}</div>`:""}
                    ${e.examples[0].exampleDescription?d`<div class="m-markdown-small" style="padding: 4px 0">
                            ${R(q(D(e.examples[0].exampleDescription||"")))}
                          </div>`:""}
                    <pre class="example-panel ${this.renderStyle==="read"?"border pad-8-16":"border-top pad-top-8"}">
${e.examples[0].exampleValue}</pre>
                  `}`:d`
              <span class="example-panel ${this.renderStyle==="read"?"border pad-8-16":"border-top pad-top-8"}">
                <select aria-label="response examples" style="min-width:100px; max-width:100%" @change="${t=>this.onSelectExample(t)}">
                  ${e.examples.map(t=>d`<option value="${t.exampleId}" ?selected=${t.exampleId===e.selectedExample}>
                        ${t.exampleSummary.length>80?t.exampleId:t.exampleSummary}
                      </option>`)}
                </select>
                ${e.examples.map(t=>d`
                    <div
                      class="example"
                      data-example="${t.exampleId}"
                      style="display: ${t.exampleId===e.selectedExample?"block":"none"}"
                    >
                      ${t.exampleSummary&&t.exampleSummary.length>80?d`<div style="padding: 4px 0">${t.exampleSummary}</div>`:""}
                      ${t.exampleDescription?d`<div class="m-markdown-small" style="padding: 4px 0">
                              ${R(q(D(t.exampleDescription||"")))}
                            </div>`:""}
                      ${t.exampleFormat==="json"?d`<json-tree
                              render-style="${this.renderStyle}"
                              .data="${t.exampleValue}"
                              exportparts="btn:btn, btn-fill:btn-fill, btn-copy:btn-copy"
                            ></json-tree>`:d`<pre>${t.exampleValue}</pre>`}
                    </div>
                  `)}
              </span>
            `}
    `:d`
        <pre
          style="color:var(--red)"
          class="${this.renderStyle==="read"?"read example-panel border pad-8-16":"example-panel border-top"}"
        >
 No example provided </pre>
      `}mimeSchemaTemplate(e){return e?d` ${this.schemaStyle==="table"?d`
            <schema-table
              .data="${e.schemaTree}"
              schema-expand-level="${this.schemaExpandLevel}"
              schema-description-expanded="${this.schemaDescriptionExpanded}"
              allow-schema-description-expand-toggle="${this.allowSchemaDescriptionExpandToggle}"
              schema-hide-read-only="${this.schemaHideReadOnly}"
              schema-hide-write-only="${this.schemaHideWriteOnly}"
              exportparts="schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
            >
            </schema-table>
          `:d`<schema-tree
            .data="${e.schemaTree}"
            schema-expand-level="${this.schemaExpandLevel}"
            schema-description-expanded="${this.schemaDescriptionExpanded}"
            allow-schema-description-expand-toggle="${this.allowSchemaDescriptionExpandToggle}"
            schema-hide-read-only="${this.schemaHideReadOnly}"
            schema-hide-write-only="${this.schemaHideWriteOnly}"
            exportparts="schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
          >
          </schema-tree>`}`:d`
        <pre style="color:var(--red)" class="${this.renderStyle==="read"?"border pad-8-16":"border-top"}"> Schema not found</pre>
      `}};customElements.define("api-response",Vd);function Kd(e){let t=new At,a=new D.Renderer;return a.heading=(r,s,n)=>`<h${s} class="observe-me" id="${e}--${t.slug(n)}">${r}</h${s}>`,a}function Zd(e){let t=e.target.closest(".tag-container").querySelector(".tag-description"),a=e.target.closest(".tag-container").querySelector(".tag-icon");t&&a&&(t.classList.contains("expanded")?(t.style.maxHeight=0,t.classList.replace("expanded","collapsed"),a.classList.replace("expanded","collapsed")):(t.style.maxHeight=`${t.scrollHeight}px`,t.classList.replace("collapsed","expanded"),a.classList.replace("collapsed","expanded")))}function ss(e,t="",a=""){let r=new Set;for(let l in e.responses)for(let c in e.responses[l]?.content)r.add(c.trim());let s=[...r].join(", "),n=this.resolvedSpec.securitySchemes.filter(l=>l.finalKeyValue&&e.security?.some(c=>l.securitySchemeId in c))||[],i=this.resolvedSpec.securitySchemes.find(l=>l.securitySchemeId==="_rapidoc_api_key"&&l.value!=="-");i&&n.push(i);let o=e.xCodeSamples?Ii.call(this,e.xCodeSamples):"";return d`
    ${this.renderStyle==="read"?d`<div class="divider" part="operation-divider"></div>`:""}
    <div
      class="expanded-endpoint-body observe-me ${e.method} ${e.deprecated?"deprecated":""} "
      part="section-operation ${e.elementId}"
      id="${e.elementId}"
    >
      ${this.renderStyle==="focused"&&t!=="General \u2982"?d`
              <div class="tag-container" part="section-operation-tag">
                <span class="upper" style="font-weight:bold; font-size:18px;"> ${t} </span>
                ${a?d` <svg
                          class="tag-icon collapsed"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          stroke-width="2"
                          fill="none"
                          style="stroke:var(--primary-color); vertical-align:top; cursor:pointer"
                          @click="${l=>{Zd.call(this,l)}}"
                        >
                          <path d="M12 20h-6a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h8"></path>
                          <path d="M18 4v17"></path>
                          <path d="M15 18l3 3l3 -3"></path>
                        </svg>
                        <div
                          class="tag-description collapsed"
                          style="max-height:0px; overflow:hidden; margin-top:16px; border:1px solid var(--border-color)"
                        >
                          <div class="m-markdown" style="padding:8px">${R(q(D(a)))}</div>
                        </div>`:""}
              </div>
            `:""}
      ${e.deprecated?d`<div class="bold-text red-text">DEPRECATED</div>`:""}
      ${d` ${e.xBadges&&e.xBadges?.length>0?d`
                <div style="display:flex; flex-wrap:wrap; margin-bottom: -24px; font-size: var(--font-size-small);">
                  ${e.xBadges.map(l=>l.color==="none"?"":d`<span
                          style="margin:1px; margin-right:5px; padding:1px 8px; font-weight:bold; border-radius:12px; background: var(--light-${l.color}, var(--input-bg)); color:var(--${l.color}); border:1px solid var(--${l.color})"
                          >${l.label}</span
                        >`)}
                </div>
              `:""}
        <h2 part="section-operation-summary">${e.shortSummary||`${e.method.toUpperCase()} ${e.path}`}</h2>
        ${e.isWebhook?d`<span
                part="section-operation-webhook"
                style="color:var(--primary-color); font-weight:bold; font-size: var(--font-size-regular);"
              >
                WEBHOOK
              </span>`:d`
                <div
                  part="section-operation-webhook-method"
                  class="mono-font regular-font-size"
                  style="text-align:left; direction:ltr; padding: 8px 0; color:var(--fg3)"
                >
                  <span part="label-operation-method" class="regular-font upper method-fg bold-text ${e.method}">${e.method}</span>
                  <span style="overflow-wrap: break-word;" part="label-operation-path">${e.path}</span>
                </div>
              `}
        <slot name="${e.elementId}"></slot>`}
      ${e.description?d`<div class="m-markdown">${R(q(D(e.description)))}</div>`:""}
      ${Bi.call(this,e.security)}
      ${e.externalDocs?.url||e.externalDocs?.description?d`<div style="background:var(--bg3); padding:2px 8px 8px 8px; margin:8px 0; border-radius:var(--border-radius)">
              <div class="m-markdown">${R(q(D(e.externalDocs?.description||"")))}</div>
              ${e.externalDocs?.url?d`<a
                      style="font-family:var(--font-mono); font-size:var(--font-size-small)"
                      href="${e.externalDocs?.url}"
                      target="_blank"
                    >
                      ${e.externalDocs?.url}
                      <div style="transform: rotate(270deg) scale(1.5); display: inline-block; margin-left:5px">⇲</div>
                    </a>`:""}
            </div>`:""}
      ${o}
      <div class="expanded-req-resp-container">
        <api-request
          class="${this.renderStyle}-mode"
          style="width:100%;"
          webhook="${e.isWebhook}"
          method="${e.method}"
          path="${e.path}"
          .security="${e.security}"
          .parameters="${e.parameters}"
          .request_body="${e.requestBody}"
          .api_keys="${n}"
          .servers="${e.servers}"
          server-url="${e.servers?.[0]?.url||this.selectedServer?.computedUrl}"
          fill-request-fields-with-example="${this.fillRequestFieldsWithExample}"
          allow-try="${this.allowTry}"
          show-curl-before-try="${this.showCurlBeforeTry}"
          accept="${s}"
          render-style="${this.renderStyle}"
          schema-style="${this.schemaStyle}"
          active-schema-tab="${this.defaultSchemaTab}"
          schema-expand-level="${this.schemaExpandLevel}"
          schema-description-expanded="${this.schemaDescriptionExpanded}"
          allow-schema-description-expand-toggle="${this.allowSchemaDescriptionExpandToggle}"
          schema-hide-read-only="${this.schemaHideReadOnly==="never"||e.isWebhook?"false":"true"}"
          schema-hide-write-only="${this.schemaHideWriteOnly==="never"?"false":e.isWebhook?"true":"false"}"
          fetch-credentials="${this.fetchCredentials}"
          exportparts="wrap-request-btn:wrap-request-btn, btn:btn, btn-fill:btn-fill, btn-outline:btn-outline, btn-try:btn-try, btn-clear:btn-clear, btn-clear-resp:btn-clear-resp,
          tab-panel:tab-panel, tab-btn:tab-btn, tab-btn-row:tab-btn-row, tab-coontent:tab-content, 
          file-input:file-input, textbox:textbox, textbox-param:textbox-param, textarea:textarea, textarea-param:textarea-param, 
          anchor:anchor, anchor-param-example:anchor-param-example, schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
        >
        </api-request>

        ${e.callbacks?Li.call(this,e.callbacks):""}

        <api-response
          class="${this.renderStyle}-mode"
          style="width:100%;"
          webhook="${e.isWebhook}"
          .responses="${e.responses}"
          render-style="${this.renderStyle}"
          schema-style="${this.schemaStyle}"
          active-schema-tab="${this.defaultSchemaTab}"
          schema-expand-level="${this.schemaExpandLevel}"
          schema-description-expanded="${this.schemaDescriptionExpanded}"
          allow-schema-description-expand-toggle="${this.allowSchemaDescriptionExpandToggle}"
          schema-hide-read-only="${this.schemaHideReadOnly==="never"?"false":e.isWebhook?"true":"false"}"
          schema-hide-write-only="${this.schemaHideWriteOnly==="never"||e.isWebhook?"false":"true"}"
          selected-status="${Object.keys(e.responses||{})[0]||""}"
          exportparts="btn:btn, btn-response-status:btn-response-status, btn-selected-response-status:btn-selected-response-status, btn-fill:btn-fill, btn-copy:btn-copy,
          tab-panel:tab-panel, tab-btn:tab-btn, tab-btn-row:tab-btn-row, tab-coontent:tab-content, 
          schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
        >
        </api-response>
      </div>
    </div>
  `}function Jd(){return this.resolvedSpec?d`
    ${this.resolvedSpec.tags.map(e=>d`
        <section
          id="${e.elementId}"
          part="section-tag"
          class="regular-font section-gap--read-mode observe-me"
          style="border-top:1px solid var(--primary-color);"
        >
          <div class="title tag" part="section-tag-title label-tag-title">${e.displayName||e.name}</div>
          <slot name="${e.elementId}"></slot>
          <div class="regular-font-size">
            ${R(`
          <div class="m-markdown regular-font">
          ${q(D(e.description||"",this.infoDescriptionHeadingsInNavBar==="true"?{renderer:Kd(e.elementId)}:void 0))}
        </div>`)}
          </div>
        </section>
        <section class="regular-font section-gap--read-mode" part="section-operations-in-tag">
          ${e.paths.map(t=>ss.call(this,t))}
        </section>
      `)}
  `:""}function Gd(e){return d`<div class="divider"></div>
    <div class="expanded-endpoint-body observe-me ${e.name}" id="cmp--${e.id}">
      <div style="font-weight:bold">
        ${e.name} <span style="color:var(--light-fg); font-size:var(--font-size-small); font-weight:400;"> Schema </span>
      </div>
      ${this.schemaStyle==="table"?d` <schema-table
              .data="${Z(e.component,{})}"
              schema-expand-level="${this.schemaExpandLevel}"
              schema-description-expanded="${this.schemaDescriptionExpanded}"
              allow-schema-description-expand-toggle="${this.allowSchemaDescriptionExpandToggle}"
              schema-hide-read-only="false"
              schema-hide-write-only="${this.schemaHideWriteOnly}"
              exportparts="schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
            >
            </schema-table>`:d`<schema-tree
              .data="${Z(e.component,{})}"
              schema-expand-level="${this.schemaExpandLevel}"
              schema-description-expanded="${this.schemaDescriptionExpanded}"
              allow-schema-description-expand-toggle="${this.allowSchemaDescriptionExpandToggle}"
              schema-hide-read-only="false"
              schema-hide-write-only="${this.schemaHideWriteOnly}"
              exportparts="schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
            >
            </schema-tree>`}
    </div>`}function Yd(e,t){return e.id.indexOf("schemas-")===-1?d`
    <div class="divider"></div>
    <div class="expanded-endpoint-body observe-me ${e.name}" id="cmp--${e.id}">
      ${d`
        <div style="font-weight:bold">
          ${e.name}
          <span style="color:var(--light-fg); font-size:var(--font-size-small); font-weight:400"> ${t} </span>
        </div>
        ${e.component?d`<div class="mono-font regular-font-size" style="padding: 8px 0; color:var(--fg2)">
                <json-tree class="border tree" render-style="${this.renderStyle}" .data="${e.component}"> </json-tree>
              </div>`:""}
      `}
    </div>
  `:Gd.call(this,e)}function Xd(){return this.resolvedSpec?d`
    ${this.resolvedSpec.components.map(e=>d`
        <div
          id="cmp--${e.name.toLowerCase()}"
          class="regular-font section-gap--read-mode observe-me"
          style="border-top:1px solid var(--primary-color);"
        >
          <div class="title tag">${e.name}</div>
          <div class="regular-font-size">
            ${R(`<div class='m-markdown regular-font'>${q(D(e.description||""))}</div>`)}
          </div>
        </div>
        <div class="regular-font section-gap--read-mode">
          ${e.subComponents.filter(t=>t.expanded!==!1).map(t=>Yd.call(this,t,e.name))}
        </div>
      `)}
  `:""}function Qd(){let e=new At,t=new D.Renderer;return t.heading=({text:a,depth:r})=>`<h${r} class="observe-me" id="overview--${e.slug(a)}">${a}</h${r}>`,t}function ns(){return d`
    <section
      id="overview"
      part="section-overview"
      class="observe-me ${this.renderStyle==="view"?"section-gap":"section-gap--read-mode"}"
    >
      ${this.resolvedSpec?.info?d`
              <div id="api-title" part="section-overview-title" style="font-size:32px">
                ${this.resolvedSpec.info.title}
                ${this.resolvedSpec.info.version?d`<span style="font-size:var(--font-size-small);font-weight:bold"> ${this.resolvedSpec.info.version} </span>`:""}
              </div>
              <div id="api-info" style="font-size:calc(var(--font-size-regular) - 1px); margin-top:8px;">
                ${this.resolvedSpec.info.contact?.email?d`<span
                        >${this.resolvedSpec.info.contact.name||"Email"}:
                        <a href="mailto:${this.resolvedSpec.info.contact.email}" part="anchor anchor-overview"
                          >${this.resolvedSpec.info.contact.email}</a
                        >
                      </span>`:""}
                ${this.resolvedSpec.info.contact?.url?d`<span
                        >URL:
                        <a href="${this.resolvedSpec.info.contact.url}" part="anchor anchor-overview"
                          >${this.resolvedSpec.info.contact.url}</a
                        ></span
                      >`:""}
                ${this.resolvedSpec.info.license?d`<span
                        >License:
                        ${this.resolvedSpec.info.license.url?d`<a href="${this.resolvedSpec.info.license.url}" part="anchor anchor-overview"
                                >${this.resolvedSpec.info.license.name}</a
                              >`:this.resolvedSpec.info.license.name}
                      </span>`:""}
                ${this.resolvedSpec.info.termsOfService?d`<span
                        ><a href="${this.resolvedSpec.info.termsOfService}" part="anchor anchor-overview">Terms of Service</a></span
                      >`:""}
                ${this.specUrl&&this.allowSpecFileDownload==="true"?d`<div style="display:flex; margin:12px 0; gap:8px; justify-content: start;">
                        <button
                          class="m-btn thin-border"
                          style="min-width:170px"
                          part="btn btn-outline"
                          @click="${e=>{un(this.specUrl,"openapi-spec",e)}}"
                        >
                          Download OpenAPI spec
                        </button>
                        ${this.specUrl?.trim().toLowerCase().endsWith("json")?d`<button
                                class="m-btn thin-border"
                                style="width:200px"
                                part="btn btn-outline"
                                @click="${e=>{hn(this.specUrl,e)}}"
                              >
                                View OpenAPI spec (New Tab)
                              </button>`:""}
                      </div>`:""}
              </div>
              <slot name="overview"></slot>
              <div id="api-description">
                ${this.resolvedSpec.info.description?d`${R(q(`<div class="m-markdown regular-font">
                        ${D(this.resolvedSpec.info.description,this.infoDescriptionHeadingsInNavBar==="true"?{renderer:Qd()}:void 0)}
                      </div>`))}`:""}
              </div>
            `:""}
    </section>
  `}function is(e){let t=this.resolvedSpec?.servers.find(a=>a.url===e);return t?(this.selectedServer=t,this.requestUpdate(),this.dispatchEvent(new CustomEvent("api-server-change",{bubbles:!0,composed:!0,detail:{selectedServer:t}})),!0):!1}function Ui(e,t){let a=[...e.currentTarget.closest("table").querySelectorAll("input, select")],r=t.url;a.forEach(s=>{let n=RegExp(`{${s.dataset.var}}`,"g");r=r.replace(n,s.value)}),t.computedUrl=r,this.requestUpdate()}function ep(){return this.selectedServer&&this.selectedServer.variables?d`
        <div class="table-title">SERVER VARIABLES</div>
        <table class="m-table" role="presentation">
          ${Object.entries(this.selectedServer.variables).map(e=>d`
              <tr>
                <td style="vertical-align: middle;">${e[0]}</td>
                <td>
                  ${e[1].enum?d` <select
                          data-var="${e[0]}"
                          @input=${t=>{Ui.call(this,t,this.selectedServer)}}
                        >
                          ${Object.entries(e[1].enum).map(t=>e[1].default===t[1]?d`<option selected label=${t[1]} value=${t[1]}></option>`:d`<option label=${t[1]} value=${t[1]}></option>`)}
                        </select>`:d` <input
                          type="text"
                          part="textbox textbox-server-var"
                          spellcheck="false"
                          data-var="${e[0]}"
                          value="${e[1].default}"
                          @input=${t=>{Ui.call(this,t,this.selectedServer)}}
                        />`}
                </td>
              </tr>
              ${e[1].description?d`<tr>
                      <td colspan="2" style="border:none">
                        <span class="m-markdown-small"> ${R(q(D(e[1].description)))} </span>
                      </td>
                    </tr>`:""}
            `)}
        </table>
      `:""}function Mi(){return!this.resolvedSpec||this.resolvedSpec.specLoadError?"":d`<section
    id="servers"
    part="section-servers"
    style="text-align:left; direction:ltr; margin-top:24px; margin-bottom:24px;"
    class="regular-font observe-me ${"read focused".includes(this.renderStyle)?"section-gap--read-mode":"section-gap"}"
  >
    <div part="section-servers-title" class="sub-title">API SERVER</div>
    <div class="mono-font" style="margin: 12px 0; font-size:calc(var(--font-size-small) + 1px);">
      ${!this.resolvedSpec.servers||this.resolvedSpec.servers?.length===0?"":d`
              ${this.resolvedSpec?.servers.map((e,t)=>d`
                  <input
                    type="radio"
                    name="api_server"
                    id="srvr-opt-${t}"
                    value="${e.url}"
                    @change=${()=>{is.call(this,e.url)}}
                    .checked="${this.selectedServer.url===e.url}"
                    style="margin:4px 0; cursor:pointer"
                  />
                  <label style="cursor:pointer" for="srvr-opt-${t}">
                    ${e.url} ${e.description?d`- <span class="regular-font">${e.description} </span>`:""}
                  </label>
                  <br />
                `)}
            `}
      <div class="table-title primary-text" part="label-selected-server">SELECTED: ${this.selectedServer?.computedUrl||"none"}</div>
    </div>
    <slot name="servers"></slot>
    ${ep.call(this)}
  </section>`}function Hi(e,t="toggle"){let a=e?.closest(".nav-bar-tag-and-paths"),r=a?.querySelector(".nav-bar-paths-under-tag");if(a){let s=a.classList.contains("expanded");s&&(t==="toggle"||t==="collapse")?(r.style.maxHeight=0,a.classList.replace("expanded","collapsed")):!s&&(t==="toggle"||t==="expand")&&(a.classList.replace("collapsed","expanded"),r.style.maxHeight=`${r.scrollHeight}px`)}}function tp(e,t="expand-all"){if(!(e.type==="click"||e.type==="keyup"&&e.keyCode===13))return;let a=[...e.target.closest(".nav-scroll").querySelectorAll(".nav-bar-tag-and-paths")];t==="expand-all"?a.forEach(r=>{let s=r.querySelector(".nav-bar-paths-under-tag");r.classList.replace("collapsed","expanded"),s.style.maxHeight=`${s?.scrollHeight}px`}):a.forEach(r=>{r.classList.replace("expanded","collapsed")})}function Wi(e){if(!(e.type==="click"||e.type==="keyup"&&e.keyCode===13))return;let t=e.target;if(e.stopPropagation(),t.dataset?.action==="navigate"){this.scrollToEventTarget(e,!1);let a=e.currentTarget.closest("#nav-bar");a.classList.contains("floating-nav")&&a.classList.remove("floating-nav")}else t.dataset?.action==="expand-all"||t.dataset?.action==="collapse-all"?tp(e,t.dataset.action):t.dataset?.action==="expand-collapse-tag"&&Hi(t,"toggle")}function ap(){let e=new At;return!this.resolvedSpec||this.resolvedSpec.specLoadError?d`<nav class="nav-bar" part="section-navbar">
      <slot name="nav-logo" class="logo"></slot>
    </nav>`:d`
    <button id="nav-bar-btn" part="btn-navbar" class="btn" @click="${this.onOpenNavBarToggle}">☰</button>
    <nav id="nav-bar" class="nav-bar ${this.renderStyle}" part="section-navbar">
      <slot name="nav-logo" class="logo"></slot>
      ${this.allowSearch==="false"&&this.allowAdvancedSearch==="false"?"":d`
              <div
                style="display:flex; flex-direction:row; justify-content:center; align-items:stretch; padding:8px 24px 12px 24px; ${this.allowAdvancedSearch==="false"?"border-bottom: 1px solid var(--nav-hover-bg-color)":""}"
                part="section-navbar-search"
              >
                ${this.allowSearch==="false"?"":d`
                        <div style="display:flex; flex:1; line-height:22px;">
                          <input
                            id="nav-bar-search"
                            part="textbox textbox-nav-filter"
                            style="width:100%; padding-right:20px; color:var(--nav-hover-text-color); border-color:var(--nav-accent-color); background:var(--nav-hover-bg-color)"
                            type="text"
                            placeholder="Filter"
                            @change="${this.onSearchChange}"
                            spellcheck="false"
                          />
                          <div style="margin: 6px 5px 0 -24px; font-size:var(--font-size-regular); cursor:pointer;">&#x21a9;</div>
                        </div>
                        ${this.searchVal?d` <button
                                @click="${this.onClearSearch}"
                                class="m-btn thin-border"
                                style="margin-left:5px; color:var(--nav-text-color); width:75px; padding:6px 8px;"
                                part="btn btn-outline btn-clear-filter"
                              >
                                CLEAR
                              </button>`:""}
                      `}
                ${this.allowAdvancedSearch==="false"||this.searchVal?"":d`
                        <button
                          id="advanced-search-btn"
                          class="m-btn primary"
                          part="btn btn-fill btn-search"
                          style="margin-left:5px; padding:6px 8px; width:75px"
                          @click="${this.onShowAdvancedSearchClicked}"
                        >
                          SEARCH
                        </button>
                      `}
              </div>
            `}
      ${d`<nav
        class="nav-scroll"
        tabindex="-1"
        part="section-navbar-scroll"
        @click="${t=>Wi.call(this,t)}"
        @keyup="${t=>Wi.call(this,t)}"
      >
        ${this.showInfo==="false"||!this.resolvedSpec.info?"":d`
                ${this.infoDescriptionHeadingsInNavBar==="true"?d`
                        ${this.resolvedSpec.infoDescriptionHeaders.length>0?d`<div
                                class="nav-bar-info ${this.navActiveItemMarker}"
                                id="link-overview"
                                data-content-id="overview"
                                data-action="navigate"
                                tabindex="0"
                                part="section-navbar-item section-navbar-overview"
                              >
                                ${this.resolvedSpec.info?.title?.trim()||"Overview"}
                              </div>`:""}
                        <div class="overview-headers">
                          ${this.resolvedSpec.infoDescriptionHeaders.map(t=>{let a=e.slug(t.text);return d`<div
                              class="nav-bar-h${t.depth} ${this.navActiveItemMarker}"
                              id="link-overview--${a}"
                              data-action="navigate"
                              data-content-id="overview--${a}"
                            >
                              ${t.text}
                            </div>`})}
                        </div>
                        ${this.resolvedSpec.infoDescriptionHeaders.length>0?d`<hr
                                style="border-top: 1px solid var(--nav-hover-bg-color); border-width:1px 0 0 0; margin: 15px 0 0 0"
                              />`:""}
                      `:d`<div
                        class="nav-bar-info ${this.navActiveItemMarker}"
                        id="link-overview"
                        data-action="navigate"
                        data-content-id="overview"
                        tabindex="0"
                      >
                        ${this.resolvedSpec.info?.title?.trim()||"Overview"}
                      </div>`}
              `}
        ${this.allowServerSelection==="false"?"":d`<div
                class="nav-bar-info ${this.navActiveItemMarker}"
                id="link-servers"
                data-action="navigate"
                data-content-id="servers"
                tabindex="0"
                part="section-navbar-item section-navbar-servers"
              >
                API Servers
              </div>`}
        ${this.allowAuthentication==="false"||!this.resolvedSpec.securitySchemes?"":d`<div
                class="nav-bar-info ${this.navActiveItemMarker}"
                id="link-auth"
                data-action="navigate"
                data-content-id="auth"
                tabindex="0"
                part="section-navbar-item section-navbar-auth"
              >
                Authentication
              </div>`}

        <div
          id="link-operations-top"
          class="nav-bar-section operations"
          data-action="navigate"
          data-content-id="${this.renderStyle==="focused"?"":"operations-top"}"
          part="section-navbar-item section-navbar-operations-top"
        >
          <div style="font-size:16px; display:flex; margin-left:10px;">
            ${this.renderStyle==="focused"?d`<div class="nav-bar-expand-all" data-action="expand-all" tabindex="0" title="Expand all">▸</div>
                    <div class="nav-bar-collapse-all" data-action="collapse-all" tabindex="0" title="Collapse all">▸</div>`:""}
          </div>
          <div class="nav-bar-section-title">OPERATIONS</div>
        </div>

        <!-- TAGS AND PATHS-->
        ${this.resolvedSpec.tags.filter(t=>t.paths.filter(a=>_t(this.searchVal,a,t.name)).length).map(t=>d` <div
                class="nav-bar-tag-and-paths ${this.renderStyle==="read"||t.expanded?"expanded":"collapsed"}"
              >
                ${t.name==="General \u2982"?d`<hr style="border:none; border-top: 1px dotted var(--nav-text-color); opacity:0.3; margin:-1px 0 0 0;" />`:d`
                        <div
                          class="nav-bar-tag ${this.navActiveItemMarker}"
                          part="section-navbar-item section-navbar-tag"
                          id="link-${t.elementId}"
                          data-action="${this.renderStyle==="read"||this.onNavTagClick==="show-description"?"navigate":"expand-collapse-tag"}"
                          data-content-id="${(this.renderStyle==="read"?`${t.elementId}`:this.onNavTagClick==="show-description")?`${t.elementId}`:""}"
                          data-first-path-id="${t.firstPathId}"
                          tabindex="0"
                        >
                          <div style="pointer-events:none;">${t.displayName||t.name}</div>
                          <div class="nav-bar-tag-icon" tabindex="0" data-action="expand-collapse-tag"></div>
                        </div>
                      `}
                ${this.infoDescriptionHeadingsInNavBar==="true"?d` ${this.renderStyle==="focused"&&this.onNavTagClick==="expand-collapse"?"":d` <div class="tag-headers">
                              ${t.headers.map(a=>d` <div
                                    class="nav-bar-h${a.depth} ${this.navActiveItemMarker}"
                                    part="section-navbar-item section-navbar-h${a.depth}"
                                    id="link-${t.elementId}--${e.slug(a.text)}"
                                    data-action="navigate"
                                    data-content-id="${t.elementId}--${e.slug(a.text)}"
                                    tabindex="0"
                                  >
                                    ${a.text}
                                  </div>`)}
                            </div>`}`:""}
                <div class="nav-bar-paths-under-tag">
                  <!-- Paths in each tag (endpoints) -->
                  ${t.paths.filter(a=>!this.searchVal||_t(this.searchVal,a,t.name)).map(a=>d` <div
                          class="nav-bar-path ${this.navActiveItemMarker} ${this.usePathInNavBar==="true"?"small-font":""}"
                          part="section-navbar-item section-navbar-path"
                          data-action="navigate"
                          data-content-id="${a.elementId}"
                          id="link-${a.elementId}"
                          tabindex="0"
                        >
                          <span style="display:flex; pointer-events: none; align-items:start; ${a.deprecated?"filter:opacity(0.5)":""}">
                            ${d`<span class="nav-method ${this.showMethodInNavBar} ${a.method}" style="pointer-events: none;">
                              ${this.showMethodInNavBar==="as-colored-block"?a.method.substring(0,3).toUpperCase():a.method.toUpperCase()}
                            </span>`}
                            ${a.isWebhook?d`<span
                                    style="font-weight:bold; pointer-events: none; margin-right:8px; font-size: calc(var(--font-size-small) - 2px)"
                                    >WEBHOOK</span
                                  >`:""}
                            ${this.usePathInNavBar==="true"?d`<span style="pointer-events: none;" class="mono-font">${a.path}</span>`:a.summary||a.shortSummary}
                          </span>
                        </div>`)}
                </div>
              </div>`)}

        <!-- COMPONENTS -->
        ${this.resolvedSpec.components&&this.showComponents==="true"&&this.renderStyle==="focused"?d` <div id="link-components" class="nav-bar-section components">
                  <div></div>
                  <div class="nav-bar-section-title">COMPONENTS</div>
                </div>
                ${this.resolvedSpec.components.map(t=>t.subComponents.length?d` <div
                          class="nav-bar-tag"
                          part="section-navbar-item section-navbar-tag"
                          data-action="navigate"
                          data-content-id="cmp--${t.name.toLowerCase()}"
                          id="link-cmp--${t.name.toLowerCase()}"
                        >
                          ${t.name}
                        </div>
                        ${t.subComponents.filter(a=>a.expanded!==!1).map(a=>d` <div class="nav-bar-path" data-action="navigate" data-content-id="cmp--${a.id}" id="link-cmp--${a.id}">
                                <span style="pointer-events: none;"> ${a.name} </span>
                              </div>`)}`:"")}`:""}
      </nav>`}
    </nav>
  `}function rp(e){let t=new D.Renderer,a=new At;return t.heading=({text:r,depth:s})=>`<h${s} class="observe-me" id="${e}--${a.slug(r)}">${r}</h${s}>`,t}function qa(e){return d`<div class="regular-font section-gap--focused-mode" part="section-operations-in-tag">${e}</div>`}function Vi(){if(this.showInfo==="true")return qa(ns.call(this));let e=this.resolvedSpec.tags[0],t=this.resolvedSpec.tags[0]?.paths[0];return qa(e&&t?ss.call(this,t,e.name):"")}function sp(e){return d`
    <h1 id="${e.elementId}">${e.displayName||e.name}</h1>
    ${this.onNavTagClick==="show-description"&&e.description?d`<div class="m-markdown">
            ${R(`<div class="m-markdown regular-font">
            ${q(D(e.description||"",this.infoDescriptionHeadingsInNavBar==="true"?{renderer:rp(e.elementId)}:void 0))}
          </div>`)}
          </div>`:""}
  `}function np(){if(!this.focusedElementId||!this.resolvedSpec)return;let e=this.focusedElementId,t=null,a=null,r,s=0;if(e.startsWith("overview")&&this.showInfo==="true")r=ns.call(this);else if(e==="auth"&&this.allowAuthentication==="true")r=Ni.call(this,this.allowTry);else if(e==="servers"&&this.allowServerSelection==="true")r=Mi.call(this);else if(e==="operations-top")r=d`<div id="operations-top" class="observe-me"><slot name="operations-top"></slot></div>`;else if(e.startsWith("cmp--")&&this.showComponents==="true")r=Xd.call(this);else if(e.startsWith("tag--")){let n=e.indexOf("--",4)>0?e.substring(0,e.indexOf("--",5)):e;a=this.resolvedSpec.tags.find(i=>i.elementId===n),r=a?qa.call(this,sp.call(this,a)):Vi.call(this)}else{for(s=0;s<this.resolvedSpec.tags.length&&(a=this.resolvedSpec.tags[s],t=this.resolvedSpec.tags[s].paths.find(n=>`${n.elementId}`===e),!t);s+=1);t?(Hi(this.shadowRoot.getElementById(`link-${e}`),"expand"),r=qa.call(this,ss.call(this,t,a.name||"",a.description||""))):r=Vi.call(this)}return r}function ip(e){if(e.expanded)e.expanded=!1,this.updateRoute==="true"&&this.replaceHistoryState("");else if(e.expanded=!0,this.updateRoute==="true"){let t=`${this.routePrefix||"#"}${e.elementId}`;window.location.hash!==t&&this.replaceHistoryState(e.elementId)}this.requestUpdate()}function op(e,t="expand-all"){let a=[...e.querySelectorAll(".section-tag")];t==="expand-all"?a.map(r=>{r.classList.replace("collapsed","expanded")}):a.map(r=>{r.classList.replace("expanded","collapsed")})}function Ki(e,t="expand-all"){op.call(this,e.target.closest(".operations-root"),t)}function Zi(e,t=!1){return d`
    <summary
      @click="${a=>{ip.call(this,e,a)}}"
      part="section-endpoint-head-${e.expanded?"expanded":"collapsed"}"
      class="endpoint-head ${e.method} ${e.deprecated?"deprecated":""} ${t||e.expanded?"expanded":"collapsed"}"
    >
      <div part="section-endpoint-head-method" class="method ${e.method} ${e.deprecated?"deprecated":""}">${e.method}</div>
      <div part="section-endpoint-head-path" class="path ${e.deprecated?"deprecated":""}">
        ${e.path}
        ${e.isWebhook?d`<span
                style="font-family: var(--font-regular); font-size: var(--); font-size: var(--font-size-small); color:var(--primary-color); margin-left: 16px"
              >
                Webhook</span
              >`:""}
      </div>
      ${e.deprecated?d` <span
              style="font-size:var(--font-size-small); text-transform:uppercase; font-weight:bold; color:var(--red); margin:2px 0 0 5px;"
            >
              deprecated
            </span>`:""}
      ${this.showSummaryWhenCollapsed?d` <div class="only-large-screen" style="min-width:60px; flex:1"></div>
              <div part="section-endpoint-head-description" class="descr">${e.summary||e.shortSummary}</div>`:""}
    </summary>
  `}function Ji(e){let t=new Set;for(let i in e.responses)for(let o in e.responses[i]?.content)t.add(o.trim());let a=[...t].join(", "),r=this.resolvedSpec.securitySchemes.filter(i=>i.finalKeyValue&&e.security?.some(o=>i.securitySchemeId in o))||[],s=this.resolvedSpec.securitySchemes.find(i=>i.securitySchemeId==="_rapidoc_api_key"&&i.value!=="-");s&&r.push(s);let n=e.xCodeSamples?Ii(e.xCodeSamples):"";return d` <div
    part="section-endpoint-body-${e.expanded?"expanded":"collapsed"}"
    class="endpoint-body ${e.method} ${e.deprecated?"deprecated":""}"
  >
    <div class="summary">
      ${e.summary?d`<div class="title" part="section-endpoint-body-title">${e.summary}</div>`:e.shortSummary===e.description?"":d`<div class="title" part="section-endpoint-body-title">${e.shortSummary}</div>`}
      ${e.xBadges&&e.xBadges?.length>0?d`
              <div style="display:flex; flex-wrap:wrap;font-size: var(--font-size-small);">
                ${e.xBadges.map(i=>i.color==="none"?"":d`<span
                        part="endpoint-badge"
                        style="margin:1px; margin-right:5px; padding:1px 8px; font-weight:bold; border-radius:12px;  background: var(--light-${i.color}, var(--input-bg)); color:var(--${i.color}); border:1px solid var(--${i.color})"
                        >${i.label}</span
                      >`)}
              </div>
            `:""}
      ${e.description?d`<div part="section-endpoint-body-description" class="m-markdown">
              ${R(q(D(e.description)))}
            </div>`:""}
      ${e.externalDocs?.url||e.externalDocs?.description?d`<div style="background:var(--bg3); padding:2px 8px 8px 8px; margin:8px 0; border-radius:var(--border-radius)">
              <div class="m-markdown">${R(q(D(e.externalDocs?.description||"")))}</div>
              ${e.externalDocs?.url?d`<a
                      style="font-family:var(--font-mono); font-size:var(--font-size-small)"
                      href="${e.externalDocs?.url}"
                      target="_blank"
                    >
                      ${e.externalDocs?.url}
                      <div style="transform: rotate(270deg) scale(1.5); display: inline-block; margin-left:5px">⇲</div>
                    </a>`:""}
            </div>`:""}
      <slot name="${e.elementId}"></slot>
      ${Bi.call(this,e.security)} ${n}
    </div>
    <div class="req-resp-container">
      <div style="display:flex; flex-direction:column" class="view-mode-request ${this.layout}-layout">
        <api-request
          class="${this.renderStyle}-mode ${this.layout}-layout"
          style="width:100%;"
          webhook="${e.isWebhook}"
          method="${e.method}"
          path="${e.path}"
          .security="${e.security}"
          .parameters="${e.parameters}"
          .request_body="${e.requestBody}"
          .api_keys="${r}"
          .servers="${e.servers}"
          server-url="${e.servers?.length>0?e.servers[0].url:this.selectedServer?.computedUrl}"
          active-schema-tab="${this.defaultSchemaTab}"
          fill-request-fields-with-example="${this.fillRequestFieldsWithExample}"
          allow-try="${this.allowTry}"
          show-curl-before-try="${this.showCurlBeforeTry}"
          accept="${a}"
          render-style="${this.renderStyle}"
          schema-style="${this.schemaStyle}"
          schema-expand-level="${this.schemaExpandLevel}"
          schema-description-expanded="${this.schemaDescriptionExpanded}"
          allow-schema-description-expand-toggle="${this.allowSchemaDescriptionExpandToggle}"
          schema-hide-read-only="${this.schemaHideReadOnly==="never"||e.isWebhook?"false":"true"}"
          schema-hide-write-only="${this.schemaHideWriteOnly==="never"?"false":e.isWebhook?"true":"false"}"
          fetch-credentials="${this.fetchCredentials}"
          exportparts="wrap-request-btn:wrap-request-btn, btn:btn, btn-fill:btn-fill, btn-outline:btn-outline, btn-try:btn-try, btn-clear:btn-clear, btn-clear-resp:btn-clear-resp,
          tab-panel:tab-panel, tab-btn:tab-btn, tab-btn-row:tab-btn-row, tab-coontent:tab-content, 
          file-input:file-input, textbox:textbox, textbox-param:textbox-param, textarea:textarea, textarea-param:textarea-param, 
          anchor:anchor, anchor-param-example:anchor-param-example, schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
        >
        </api-request>

        ${e.callbacks?Li.call(this,e.callbacks):""}
      </div>

      <api-response
        class="${this.renderStyle}-mode"
        style="width:100%;"
        webhook="${e.isWebhook}"
        .responses="${e.responses}"
        active-schema-tab="${this.defaultSchemaTab}"
        render-style="${this.renderStyle}"
        schema-style="${this.schemaStyle}"
        schema-expand-level="${this.schemaExpandLevel}"
        schema-description-expanded="${this.schemaDescriptionExpanded}"
        allow-schema-description-expand-toggle="${this.allowSchemaDescriptionExpandToggle}"
        schema-hide-read-only="${this.schemaHideReadOnly==="never"?"false":e.isWebhook?"true":"false"}"
        schema-hide-write-only="${this.schemaHideWriteOnly==="never"||e.isWebhook?"false":"true"}"
        selected-status="${Object.keys(e.responses||{})[0]||""}"
        exportparts="btn:btn, btn-fill:btn-fill, btn-outline:btn-outline, btn-try:btn-try, file-input:file-input, 
        textbox:textbox, textbox-param:textbox-param, textarea:textarea, textarea-param:textarea-param, anchor:anchor, anchor-param-example:anchor-param-example, btn-clear-resp:btn-clear-resp,
        tab-panel:tab-panel, tab-btn:tab-btn, tab-btn-row:tab-btn-row, tab-coontent:tab-content, 
        schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
      >
      </api-response>
    </div>
  </div>`}function lp(e=!1,t=!1){return this.resolvedSpec?d`${e?"":d`<div style="display:flex; justify-content:flex-end;">
          <span @click="${a=>Ki(a,"expand-all")}" style="color:var(--primary-color); cursor:pointer;">
            Expand all
          </span>
          &nbsp;|&nbsp;
          <span @click="${a=>Ki(a,"collapse-all")}" style="color:var(--primary-color); cursor:pointer;">
            Collapse all
          </span>
          &nbsp; sections
        </div>`}
  ${this.resolvedSpec.tags.map(a=>d`
      ${e?d`
              <div class="section-tag-body">
                ${a.paths.filter(r=>!this.searchVal||_t(this.searchVal,r,a.name)).map(r=>d` <section
                        id="${r.elementId}"
                        class="m-endpoint regular-font ${r.method} ${t||r.expanded?"expanded":"collapsed"}"
                      >
                        ${Zi.call(this,r,t)}
                        ${t||r.expanded?Ji.call(this,r):""}
                      </section>`)}
              </div>
            `:d`
              <div class="regular-font section-gap section-tag ${a.expanded?"expanded":"collapsed"}">
                <div
                  class="section-tag-header"
                  @click="${()=>{a.expanded=!a.expanded,this.requestUpdate()}}"
                >
                  <div id="${a.elementId}" class="sub-title tag" style="color:var(--primary-color)">${a.displayName||a.name}</div>
                </div>
                <div class="section-tag-body">
                  <slot name="${a.elementId}"></slot>
                  <div class="regular-font regular-font-size m-markdown" style="padding-bottom:12px">
                    ${R(q(D(a.description||"")))}
                  </div>
                  ${a.paths.filter(r=>!this.searchVal||_t(this.searchVal,r,a.name)).map(r=>d` <section
                          part="section-endpoint"
                          id="${r.elementId}"
                          class="m-endpoint regular-font ${r.method} ${t||r.expanded?"expanded":"collapsed"}"
                        >
                          ${Zi.call(this,r,t)}
                          ${t||r.expanded?Ji.call(this,r):""}
                        </section>`)}
                </div>
              </div>
            `}
    `)}`:""}function cp(e){return d`<div style=${e}>
    <svg viewBox="1 0 511 512">
      <path d="M351 411a202 202 0 01-350 0 203 203 0 01333-24 203 203 0 0117 24zm0 0" fill="#adc165" />
      <path
        d="M334 387a202 202 0 01-216-69 202 202 0 01216 69zm78 32H85a8 8 0 01-8-8 8 8 0 018-8h327a8 8 0 017 8 8 8 0 01-7 8zm0 0"
        fill="#99aa52"
      />
      <path d="M374 338l-5 30a202 202 0 01-248-248 203 203 0 01253 218zm0 0" fill="#ffc73b" />
      <path
        d="M374 338a202 202 0 01-100-197 203 203 0 01100 197zm38 81l-6-2-231-231a8 8 0 0111-11l231 230a8 8 0 01-5 14zm0 0"
        fill="#efb025"
      />
      <path d="M311 175c0 75 40 140 101 175a202 202 0 000-350 202 202 0 00-101 175zm0 0" fill="#ff903e" />
      <path d="M412 419a8 8 0 01-8-8V85a8 8 0 0115 0v326a8 8 0 01-7 8zm0 0" fill="#e87425" />
    </svg>
  </div>`}function dp(){return d`<header class="row main-header regular-font" part="section-header" style="padding:8px 4px 8px 4px;min-height:48px;">
    <div class="only-large-screen-flex" style="align-items: center;">
      <slot name="logo" class="logo" part="section-logo">
        ${cp("height:36px;width:36px;margin-left:5px")}
        <!-- m-logo style="height:36px;width:36px;margin-left:5px"></m-logo -->
      </slot>
      <div class="header-title" part="label-header-title">${this.headingText}</div>
    </div>
    <div style="margin: 0px 8px;display:flex;flex:1">
      ${this.allowSpecUrlLoad==="false"?"":d`
              <input
                id="spec-url"
                type="text"
                style="font-size:var(--font-size-small)"
                class="header-input mono-font"
                part="textbox textbox-spec-url"
                placeholder="Spec URL"
                value="${this.specUrl||""}"
                @change="${this.onSpecUrlChange}"
                spellcheck="false"
              />
              <div style="margin: 6px 5px 0 -24px; font-size:var(--font-size-regular); cursor:pointer;">&#x21a9;</div>
            `}
      ${this.allowSpecFileLoad==="false"?"":d`
              <input
                id="spec-file"
                part="file-input"
                type="file"
                style="display:none"
                value="${this.specFile||""}"
                @change="${this.onSpecFileChange}"
                spellcheck="false"
              />
              <button
                class="m-btn primary only-large-screen"
                style="margin-left:10px;"
                part="btn btn-fill"
                @click="${this.onFileLoadClick}"
              >
                LOCAL JSON FILE
              </button>
            `}
      <slot name="header"></slot>
      ${this.allowSearch==="false"||"read focused".includes(this.renderStyle)?"":d`
              <input
                id="search"
                class="header-input"
                type="text"
                part="textbox textbox-header-filter"
                placeholder="Filter"
                @change="${this.onSearchChange}"
                style="max-width:130px;margin-left:10px;"
                spellcheck="false"
              />
              <div style="margin: 6px 5px 0 -24px; font-size:var(--font-size-regular); cursor:pointer;">&#x21a9;</div>
            `}
      ${this.allowAdvancedSearch==="false"||"read focused".includes(this.renderStyle)?"":d`
              <button
                class="m-btn primary only-large-screen"
                part="btn btn-fill btn-search"
                style="margin-left:10px;"
                @click="${this.onShowAdvancedSearchClicked}"
              >
                Search
              </button>
            `}
    </div>
  </header>`}function pp(){return d`<dialog id="advanced-search-dialog" class="dialog-box">
    <header class="dialog-box-header">
      <span class="dialog-box-title">Search</span>
      <button type="button" @click="${e=>this.onAdvancedSearchClose(e)}">&times;</button>
    </header>
    <div class="dialog-box-content">
      <span class="advanced-search-options">
        <input
          id="input-advanced-search-dialog"
          style="width:100%; padding-right:20px;"
          type="text"
          part="textbox textbox-search-dialog"
          placeholder="search text..."
          spellcheck="false"
          @keyup="${e=>this.onAdvancedSearch(e,400)}"
        />
        <div style="display:flex; gap:16px; flex-wrap:wrap; margin:8px 0 24px;">
          <div>
            <input
              style="cursor:pointer;"
              type="checkbox"
              part="checkbox checkbox-search-dialog"
              id="search-api-path"
              checked
              @change="${e=>this.onAdvancedSearch(e,0)}"
            />
            <label for="search-api-path" style="cursor:pointer;"> API Path </label>
          </div>
          <div>
            <input
              style="cursor:pointer;"
              type="checkbox"
              part="checkbox checkbox-search-dialog"
              id="search-api-descr"
              checked
              @change="${e=>this.onAdvancedSearch(e,0)}"
            />
            <label style="cursor:pointer;" for="search-api-descr"> API Description </label>
          </div>
          <div>
            <input
              style="cursor:pointer;"
              type="checkbox"
              part="checkbox checkbox-search-dialog"
              id="search-api-params"
              @change="${e=>this.onAdvancedSearch(e,0)}"
            />
            <label style="cursor:pointer;" for="search-api-params"> API Parameters </label>
          </div>
          <div>
            <input
              style="cursor:pointer;"
              type="checkbox"
              part="checkbox checkbox-search-dialog"
              id="search-api-request-body"
              @change="${e=>this.onAdvancedSearch(e,0)}"
            />
            <label style="cursor:pointer;" for="search-api-request-body"> Request Body Parameters </label>
          </div>
          <div>
            <input
              style="cursor:pointer;"
              type="checkbox"
              part="checkbox checkbox-search-dialog"
              id="search-api-resp-descr"
              @change="${e=>this.onAdvancedSearch(e,0)}"
            />
            <label style="cursor:pointer;" for="search-api-resp-descr"> Response Description </label>
          </div>
        </div>
      </span>
      ${this.advancedSearchMatches?.map(e=>d`
          <div
            class="mono-font small-font-size hover-bg"
            style="padding: 5px; cursor: pointer; border-bottom: 1px solid var(--light-border-color); ${e.deprecated?"filter:opacity(0.5);":""}"
            data-content-id="${e.elementId}"
            tabindex="0"
            @click="${t=>{this.searchVal="",this.shadowRoot.getElementById("advanced-search-dialog").close(),this.requestUpdate(),this.scrollToEventTarget(t,!0)}}"
          >
            <span style="pointer-events: none" class="upper bold-text method-fg ${e.method}">${e.method}</span>
            <span style="pointer-events: none">${e.path}</span>
            <span style="pointer-events: none" class="regular-font gray-text">${e.summary}</span>
          </div>
        `)}
    </div>
  </dialog>`}var A={color:{inputReverseFg:"#fff",inputReverseBg:"#333",headerBg:"#444",getRgb(e){if(e.indexOf("#")===0&&(e=e.slice(1,7)),(e.length===3||e.length===4)&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),e.length!==6)throw Error("Invalid HEX color.");return{r:parseInt(e.slice(0,2),16),g:parseInt(e.slice(2,4),16),b:parseInt(e.slice(4,6),16)}},luminanace(e){let t=this.getRgb(e);return t.r*.299+t.g*.587+t.b*.114},invert(e){return this.luminanace(e)>135?"#000":"#fff"},opacity(e,t){let a=this.getRgb(e);return`rgba(${a.r}, ${a.g}, ${a.b}, ${t})`},brightness(e,t){let a=this.getRgb(e);return a.r+=t,a.g+=t,a.b+=t,a.r>255?a.r=255:a.r<0&&(a.r=0),a.g>255?a.g=255:a.g<0&&(a.g=0),a.b>255?a.b=255:a.b<0&&(a.b=0),`#${a.r.toString(16).padStart(2,"0")}${a.g.toString(16).padStart(2,"0")}${a.b.toString(16).padStart(2,"0")}`},hasGoodContrast(e,t){return this.luminanace(e)-this.luminanace(t)}}};function xe(e){return/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8}|[A-Fa-f0-9]{4})$/i.test(e)}function gt(e,t={}){let a={},r=t.primaryColor?t.primaryColor:e==="dark"?"#f76b39":"#ff591e",s=A.color.invert(r),n=A.color.opacity(r,"0.4");if(e==="dark"){let i=t.bg1?t.bg1:"#2a2b2c",o=t.fg1?t.fg1:"#bbb",l=t.bg2?t.bg2:A.color.brightness(i,5),c=t.bg3?t.bg3:A.color.brightness(i,17),p=t.bg3?t.bg3:A.color.brightness(i,35),u=t.fg2?t.fg2:A.color.brightness(o,-15),h=t.fg3?t.fg3:A.color.brightness(o,-20),m=t.fg3?t.fg3:A.color.brightness(o,-65),b=t.inlineCodeFg?t.inlineCodeFg:"#c58484",g=u,y=l,w=t.headerColor?t.headerColor:A.color.brightness(i,10),v=t.navBgColor?t.navBgColor:A.color.brightness(i,10),x=t.navTextColor?t.navTextColor:A.color.opacity(A.color.invert(v),"0.50"),f=t.navHoverBgColor?t.navHoverBgColor:A.color.brightness(v,-15),$=t.navHoverTextColor?t.navHoverTextColor:A.color.invert(v),k=t.navAccentColor?t.navAccentColor:A.color.brightness(r,25);a={bg1:i,bg2:l,bg3:c,lightBg:p,fg1:o,fg2:u,fg3:h,lightFg:m,inlineCodeFg:b,primaryColor:r,primaryColorTrans:n,primaryColorInvert:s,selectionBg:g,selectionFg:y,overlayBg:"rgba(80, 80, 80, 0.4)",navBgColor:v,navTextColor:x,navHoverBgColor:f,navHoverTextColor:$,navAccentColor:k,navAccentTextColor:t.navAccentTextColor?t.navAccenttextColor:A.color.invert(k),headerColor:w,headerColorInvert:A.color.invert(w),headerColorDarker:A.color.brightness(w,-20),headerColorBorder:A.color.brightness(w,10),borderColor:t.borderColor||A.color.brightness(i,20),lightBorderColor:t.lightBorderColor||A.color.brightness(i,15),codeBorderColor:t.codeBorderColor||A.color.brightness(i,30),inputBg:t.inputBg||A.color.brightness(i,-5),placeHolder:t.placeHolder||A.color.opacity(o,"0.3"),hoverColor:t.hoverColor||A.color.brightness(i,-10),red:t.red?t.red:"#F06560",lightRed:t.lightRed?t.lightRed:A.color.brightness(i,-10),pink:t.pink?t.pink:"#ffb2b2",lightPink:t.lightPink||A.color.brightness(i,-10),green:t.green||"#7ec699",lightGreen:t.lightGreen||A.color.brightness(i,-10),blue:t.blue||"#71b7ff",lightBlue:t.lightBlue||A.color.brightness(i,-10),orange:t.orange?t.orange:"#f08d49",lightOrange:t.lightOrange||A.color.brightness(i,-10),yellow:t.yellow||"#827717",lightYellow:t.lightYellow||A.color.brightness(i,-10),purple:t.purple||"#786FF1",brown:t.brown||"#D4AC0D",codeBg:t.codeBg||A.color.opacity(A.color.brightness(i,-15),.7),codeFg:t.codeFg||"#aaa",codePropertyColor:t.codePropertyColor||"#79c0ff",codeKeywordColor:t.codeKeywordColor||"#ff7b72",codeOperatorColor:t.codeOperatorColor||"#c9d1d9",syntaxComment:"#8b949e",syntaxKeyword:"#ff7b72",syntaxOperator:"#c9d1d9",syntaxString:"#a5d6ff",syntaxConstant:"#79c0ff",syntaxFunction:"#d2a8ff",syntaxType:"#d2a8ff",syntaxVariable:"#ffa657",syntaxProperty:"#79c0ff",syntaxTag:"#7ee787",syntaxSelector:"#d2a8ff",syntaxInserted:"#7ee787",syntaxDeleted:"#ff7b72"}}else{let i=t.bg1?t.bg1:"#fafbfc",o=t.fg1?t.fg1:"#444444",l=t.bg2?t.bg2:A.color.brightness(i,-5),c=t.bg3?t.bg3:A.color.brightness(i,-15),p=t.bg3?t.bg3:A.color.brightness(i,-45),u=t.fg2?t.fg2:A.color.brightness(o,17),h=t.fg3?t.fg3:A.color.brightness(o,30),m=t.fg3?t.fg3:A.color.brightness(o,70),b=t.inlineCodeFg?t.inlineCodeFg:"brown",g=u,y=l,w=t.headerColor?t.headerColor:A.color.brightness(i,-180),v=t.navBgColor?t.navBgColor:A.color.brightness(i,-200),x=t.navTextColor?t.navTextColor:A.color.opacity(A.color.invert(v),"0.65"),f=t.navHoverBgColor?t.navHoverBgColor:A.color.brightness(v,-15),$=t.navHoverTextColor?t.navHoverTextColor:A.color.invert(v),k=t.navAccentColor?t.navAccentColor:A.color.brightness(r,25);a={bg1:i,bg2:l,bg3:c,lightBg:p,fg1:o,fg2:u,fg3:h,lightFg:m,inlineCodeFg:b,primaryColor:r,primaryColorTrans:n,primaryColorInvert:s,selectionBg:g,selectionFg:y,overlayBg:"rgba(0, 0, 0, 0.4)",navBgColor:v,navTextColor:x,navHoverBgColor:f,navHoverTextColor:$,navAccentColor:k,navAccentTextColor:t.navAccentTextColor?t.navAccenttextColor:A.color.invert(k),headerColor:w,headerColorInvert:A.color.invert(w),headerColorDarker:A.color.brightness(w,-20),headerColorBorder:A.color.brightness(w,10),borderColor:t.borderColor||A.color.brightness(i,-38),lightBorderColor:t.lightBorderColor||A.color.brightness(i,-23),codeBorderColor:t.codeBorderColor||"transparent",inputBg:t.inputBg||A.color.brightness(i,10),placeHolder:t.placeHolder||A.color.brightness(m,20),hoverColor:t.hoverColor||A.color.brightness(i,-5),red:t.red||"#F06560",lightRed:t.lightRed||"#fff0f0",pink:t.pink?t.pink:"#990055",lightPink:t.lightPink?t.lightPink:"#ffb2b2",green:t.green||"#690",lightGreen:t.lightGreen||"#fbfff0",blue:t.blue||"#47AFE8",lightBlue:t.lightBlue||"#eff8fd",orange:t.orange||"#FF9900",lightOrange:t.lightOrange||"#fff5e6",yellow:t.yellow||"#827717",lightYellow:t.lightYellow||"#fff5cc",purple:t.purple||"#786FF1",brown:t.brown||"#D4AC0D",codeBg:t.codeBg||A.color.opacity(A.color.brightness(i,-15),.7),codeFg:t.codeFg||"#666",codePropertyColor:t.codePropertyColor||"#0550ae",codeKeywordColor:t.codeKeywordColor||"#cf222e",codeOperatorColor:t.codeOperatorColor||"#24292f",syntaxComment:"#6e7781",syntaxKeyword:"#cf222e",syntaxOperator:"#24292f",syntaxString:"#0a3069",syntaxConstant:"#0550ae",syntaxFunction:"#8250df",syntaxType:"#8250df",syntaxVariable:"#953800",syntaxProperty:"#0550ae",syntaxTag:"#116329",syntaxSelector:"#8250df",syntaxInserted:"#116329",syntaxDeleted:"#cf222e"}}return d` <style>
    *,
    *:before,
    *:after {
      box-sizing: border-box;
    }

    :host {
      /* Common Styles - irrespective of themes */
      --border-radius: 2px;
      --layout: ${this.layout||"row"};
      --font-mono: ${this.monoFont||'Monaco, "Andale Mono", "Roboto Mono", Consolas, monospace'};
      --font-regular: ${this.regularFont||'"Open Sans", Avenir, "Segoe UI", Arial, sans-serif'};
      --scroll-bar-width: 8px;
      --nav-item-padding: ${this.navItemSpacing==="relaxed"?"10px 16px 10px 10px":this.navItemSpacing==="compact"?"5px 16px 5px 10px":"7px 16px 7px 10px"};

      --resp-area-height: ${this.responseAreaHeight};
      --font-size-small: ${this.fontSize==="default"?"12px":this.fontSize==="large"?"13px":"14px"};
      --font-size-mono: ${this.fontSize==="default"?"13px":this.fontSize==="large"?"14px":"15px"};
      --font-size-regular: ${this.fontSize==="default"?"14px":this.fontSize==="large"?"15px":"16px"};
      --dialog-z-index: 1000;
      --table-schema-key-width: 240px;
      --table-schema-key-text-overflow: ellipsis;
      --table-schema-key-whitespace: nowrap;

      --focus-shadow: 0 0 0 1px transparent, 0 0 0 3px ${a.primaryColorTrans};

      /* Theme specific styles */
      --bg: ${a.bg1};
      --bg2: ${a.bg2};
      --bg3: ${a.bg3};
      --light-bg: ${a.lightBg};
      --fg: ${a.fg1};
      --fg2: ${a.fg2};
      --fg3: ${a.fg3};
      --light-fg: ${a.lightFg};
      --selection-bg: ${a.selectionBg};
      --selection-fg: ${a.selectionFg};
      --overlay-bg: ${a.overlayBg};

      /* Border Colors */
      --border-color: ${a.borderColor};
      --light-border-color: ${a.lightBorderColor};
      --code-border-color: ${a.codeBorderColor};

      --input-bg: ${a.inputBg};
      --placeholder-color: ${a.placeHolder};
      --hover-color: ${a.hoverColor};
      --red: ${a.red};
      --light-red: ${a.lightRed};
      --pink: ${a.pink};
      --light-pink: ${a.lightPink};
      --green: ${a.green};
      --light-green: ${a.lightGreen};
      --blue: ${a.blue};
      --light-blue: ${a.lightBlue};
      --orange: ${a.orange};
      --light-orange: ${a.lightOrange};
      --yellow: ${a.yellow};
      --light-yellow: ${a.lightYellow};
      --purple: ${a.purple};
      --brown: ${a.brown};

      /* Header Color */
      --header-bg: ${a.headerColor};
      --header-fg: ${a.headerColorInvert};
      --header-color-darker: ${a.headerColorDarker};
      --header-color-border: ${a.headerColorBorder};

      /* Nav Colors */
      --nav-bg-color: ${a.navBgColor};
      --nav-text-color: ${a.navTextColor};
      --nav-hover-bg-color: ${a.navHoverBgColor};
      --nav-hover-text-color: ${a.navHoverTextColor};
      --nav-accent-color: ${a.navAccentColor};
      --nav-accent-text-color: ${a.navAccentTextColor};

      /* Nav API Method Colors*/
      --nav-get-color: ${a.blue};
      --nav-put-color: ${a.orange};
      --nav-post-color: ${a.green};
      --nav-delete-color: ${a.red};
      --nav-head-color: ${a.yellow};

      /* Primary Colors */
      --primary-color: ${a.primaryColor};
      --primary-color-invert: ${a.primaryColorInvert};
      --primary-color-trans: ${a.primaryColorTrans};

      /*Code Syntax Color*/
      --code-bg: ${a.codeBg};
      --code-fg: ${a.codeFg};
      --inline-code-fg: ${a.inlineCodeFg};
      --code-property-color: ${a.codePropertyColor};
      --code-keyword-color: ${a.codeKeywordColor};
      --code-operator-color: ${a.codeOperatorColor};

      /* GitHub Syntax Highlighting Theme */
      --syntax-comment: ${a.syntaxComment};
      --syntax-keyword: ${a.syntaxKeyword};
      --syntax-operator: ${a.syntaxOperator};
      --syntax-string: ${a.syntaxString};
      --syntax-constant: ${a.syntaxConstant};
      --syntax-function: ${a.syntaxFunction};
      --syntax-type: ${a.syntaxType};
      --syntax-variable: ${a.syntaxVariable};
      --syntax-property: ${a.syntaxProperty};
      --syntax-tag: ${a.syntaxTag};
      --syntax-selector: ${a.syntaxSelector};
      --syntax-inserted: ${a.syntaxInserted};
      --syntax-deleted: ${a.syntaxDeleted};
    }
  </style>`}function Gi(e=!1,t=!1){if(!this.resolvedSpec)return"";this.persistAuth==="true"&&Dd.call(this);let a={bg1:xe(this.bgColor)?this.bgColor:"",fg1:xe(this.textColor)?this.textColor:"",headerColor:xe(this.headerColor)?this.headerColor:"",primaryColor:xe(this.primaryColor)?this.primaryColor:"",navBgColor:xe(this.navBgColor)?this.navBgColor:"",navTextColor:xe(this.navTextColor)?this.navTextColor:"",navHoverBgColor:xe(this.navHoverBgColor)?this.navHoverBgColor:"",navHoverTextColor:xe(this.navHoverTextColor)?this.navHoverTextColor:"",navAccentColor:xe(this.navAccentColor)?this.navAccentColor:"",navAccentTextColor:xe(this.navAccentTextColor)?this.navAccentTextColor:""};return this.resolvedSpec.specLoadError?d` ${this.theme==="dark"?gt.call(this,"dark",a):gt.call(this,"light",a)}
      <div
        id="spec-not-found"
        style="display:flex; align-items:center; justify-content: center; border:1px dashed var(--border-color); padding:12px; overflow-wrap: anywhere; font-size:var(--font-size-small); color:var(--red); font-family:var(--font-mono)"
      >
        ${this.resolvedSpec.info.description}
      </div>`:this.resolvedSpec.isSpecLoading?d` ${this.theme==="dark"?gt.call(this,"dark",a):gt.call(this,"light",a)}
      <main class="main-content regular-font" part="section-main-content">
        <slot></slot>
        <div class="main-content-inner--${this.renderStyle}-mode">
          <div class="loader"></div>
        </div>
      </main>`:d` ${this.theme==="dark"?gt.call(this,"dark",a):gt.call(this,"light",a)}
    <slot name="fixed-header"></slot>
    <!-- Header -->
    ${this.showHeader==="false"?"":dp.call(this)}

    <!-- Advanced Search -->
    ${this.allowAdvancedSearch==="false"?"":pp.call(this)}

    <div id="the-main-body" class="body ${this.cssClasses}" dir="${this.pageDirection}">
      <!-- Side Nav -->
      ${(this.renderStyle==="read"||this.renderStyle==="focused")&&this.showSideNav==="true"&&this.resolvedSpec?ap.call(this):""}

      <!-- Main Content -->
      <main class="main-content regular-font" tabindex="-1" part="section-main-content">
        <slot></slot>
        <div class="main-content-inner--${this.renderStyle}-mode">
          ${this.loading===!0?d`<div class="loader"></div>`:d` ${this.loadFailed===!0?d`<div style="text-align: center;margin: 16px;">Unable to load the Spec</div>`:d`
                        <div
                          class="operations-root"
                          @click="${r=>{this.handleHref(r)}}"
                        >
                          ${this.renderStyle==="focused"?d`${np.call(this)}`:d`
                                  ${this.showInfo==="true"?ns.call(this):""}
                                  ${this.allowServerSelection==="true"?Mi.call(this):""}
                                  ${this.allowAuthentication==="true"?Ni.call(this,this.allowTry):""}
                                  <div id="operations-top" class="observe-me">
                                    <slot name="operations-top"></slot>
                                  </div>
                                  ${this.renderStyle==="read"?Jd.call(this):lp.call(this,e,t)}
                                `}
                        </div>
                      `}`}
        </div>
        <slot name="footer"></slot>
      </main>
    </div>`}var Yi=class extends ee{constructor(){super();let e={root:this.getRootNode().host,rootMargin:"-50px 0px -50px 0px",threshold:0};this.showSummaryWhenCollapsed=!0,this.isIntersectionObserverActive=!1,this.intersectionObserver=new IntersectionObserver(t=>{this.onIntersect(t)},e)}static get properties(){return{headingText:{type:String,attribute:"heading-text"},gotoPath:{type:String,attribute:"goto-path"},updateRoute:{type:String,attribute:"update-route"},routePrefix:{type:String,attribute:"route-prefix"},specUrl:{type:String,attribute:"spec-url"},sortTags:{type:String,attribute:"sort-tags"},sortSchemas:{type:String,attribute:"sort-schemas"},generateMissingTags:{type:String,attribute:"generate-missing-tags"},sortEndpointsBy:{type:String,attribute:"sort-endpoints-by"},specFile:{type:String,attribute:!1},layout:{type:String},renderStyle:{type:String,attribute:"render-style"},defaultSchemaTab:{type:String,attribute:"default-schema-tab"},responseAreaHeight:{type:String,attribute:"response-area-height"},fillRequestFieldsWithExample:{type:String,attribute:"fill-request-fields-with-example"},persistAuth:{type:String,attribute:"persist-auth"},onNavTagClick:{type:String,attribute:"on-nav-tag-click"},schemaStyle:{type:String,attribute:"schema-style"},schemaExpandLevel:{type:Number,attribute:"schema-expand-level"},schemaDescriptionExpanded:{type:String,attribute:"schema-description-expanded"},schemaHideReadOnly:{type:String,attribute:"schema-hide-read-only"},schemaHideWriteOnly:{type:String,attribute:"schema-hide-write-only"},apiKeyName:{type:String,attribute:"api-key-name"},apiKeyLocation:{type:String,attribute:"api-key-location"},apiKeyValue:{type:String,attribute:"api-key-value"},defaultApiServerUrl:{type:String,attribute:"default-api-server"},serverUrl:{type:String,attribute:"server-url"},oauthReceiver:{type:String,attribute:"oauth-receiver"},showHeader:{type:String,attribute:"show-header"},showSideNav:{type:String,attribute:"show-side-nav"},showInfo:{type:String,attribute:"show-info"},allowAuthentication:{type:String,attribute:"allow-authentication"},allowTry:{type:String,attribute:"allow-try"},showCurlBeforeTry:{type:String,attribute:"show-curl-before-try"},allowSpecUrlLoad:{type:String,attribute:"allow-spec-url-load"},allowSpecFileLoad:{type:String,attribute:"allow-spec-file-load"},allowSpecFileDownload:{type:String,attribute:"allow-spec-file-download"},allowSearch:{type:String,attribute:"allow-search"},allowAdvancedSearch:{type:String,attribute:"allow-advanced-search"},allowServerSelection:{type:String,attribute:"allow-server-selection"},allowSchemaDescriptionExpandToggle:{type:String,attribute:"allow-schema-description-expand-toggle"},showComponents:{type:String,attribute:"show-components"},pageDirection:{type:String,attribute:"page-direction"},scrollBehavior:{type:String,attribute:"scroll-behavior"},theme:{type:String},bgColor:{type:String,attribute:"bg-color"},textColor:{type:String,attribute:"text-color"},headerColor:{type:String,attribute:"header-color"},primaryColor:{type:String,attribute:"primary-color"},fontSize:{type:String,attribute:"font-size"},regularFont:{type:String,attribute:"regular-font"},monoFont:{type:String,attribute:"mono-font"},loadFonts:{type:String,attribute:"load-fonts"},cssFile:{type:String,attribute:"css-file"},cssClasses:{type:String,attribute:"css-classes"},navBgColor:{type:String,attribute:"nav-bg-color"},navTextColor:{type:String,attribute:"nav-text-color"},navHoverBgColor:{type:String,attribute:"nav-hover-bg-color"},navHoverTextColor:{type:String,attribute:"nav-hover-text-color"},navAccentColor:{type:String,attribute:"nav-accent-color"},navAccentTextColor:{type:String,attribute:"nav-accent-text-color"},navActiveItemMarker:{type:String,attribute:"nav-active-item-marker"},navItemSpacing:{type:String,attribute:"nav-item-spacing"},showMethodInNavBar:{type:String,attribute:"show-method-in-nav-bar"},usePathInNavBar:{type:String,attribute:"use-path-in-nav-bar"},infoDescriptionHeadingsInNavBar:{type:String,attribute:"info-description-headings-in-navbar"},fetchCredentials:{type:String,attribute:"fetch-credentials"},matchPaths:{type:String,attribute:"match-paths"},matchType:{type:String,attribute:"match-type"},removeEndpointsWithBadgeLabelAs:{type:String,attribute:"remove-endpoints-with-badge-label-as"},loading:{type:Boolean},focusedElementId:{type:String},advancedSearchMatches:{type:Object},searchVal:{type:String}}}static get styles(){return[je,Ft,ia,oa,cn,hr,la,dn,pn,Dl,M`
        rapi-doc:not(:defined) {
          display: none;
        }
        :host {
          all: initial;
          display: flex;
          flex-direction: column;
          min-width: 360px;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
          letter-spacing: normal;
          color: var(--fg);
          background: var(--bg);
          font-family: var(--font-regular);
          container-type: inline-size;
        }
        :where(button, input[type='checkbox'], [tabindex='0']):focus-visible {
          box-shadow: var(--focus-shadow);
        }
        :where(input[type='text'], input[type='password'], select, textarea):focus-visible {
          border-color: var(--primary-color);
        }
        .body {
          position: relative;
          display: flex;
          height: 100%;
          width: 100%;
          overflow: hidden;
        }
        .main-content {
          margin: 0;
          padding: 0;
          display: block;
          flex: 1;
          height: 100%;
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
          background: transparent;
        }
        .main-content::-webkit-scrollbar-thumb {
          background: var(--border-color);
        }

        .section-gap.section-tag {
          border-bottom: 1px solid var(--border-color);
        }
        .section-gap,
        .section-gap--focused-mode,
        .section-gap--read-mode {
          padding: 0px 4px;
        }
        .section-tag-header {
          position: relative;
          cursor: n-resize;
          padding: 12px 0;
        }
        .collapsed .section-tag-header:hover {
          cursor: s-resize;
        }

        .section-tag-header:hover {
          background-image: linear-gradient(to right, rgba(0, 0, 0, 0), var(--border-color), rgba(0, 0, 0, 0));
        }

        .section-tag-header:hover::after {
          position: absolute;
          margin-left: -24px;
          font-size: 20px;
          top: calc(50% - 14px);
          color: var(--primary-color);
          content: '⬆';
        }

        .collapsed .section-tag-header::after {
          position: absolute;
          margin-left: -24px;
          font-size: 20px;
          top: calc(50% - 14px);
          color: var(--border-color);
          content: '⬇';
        }
        .collapsed .section-tag-header:hover::after {
          color: var(--primary-color);
        }

        .collapsed .section-tag-body {
          display: none;
        }
        ::slotted([slot='fixed-header']) {
          padding: 4px 12px;
          max-height: 40px;
          overflow: hidden;
          background: var(--header-bg);
          color: var(--header-fg);
          text-align: center;
        }
        ::slotted([slot='logo']) {
          height: 36px;
          width: auto;
          object-fit: contain;
          margin-left: 5px;
        }
        .only-large-screen-flex,
        .only-large-screen {
          display: none;
        }
        .tag.title {
          text-transform: uppercase;
        }
        .main-header {
          background: var(--header-bg);
          color: var(--header-fg);
        }
        .header-title {
          font-size: calc(var(--font-size-regular) + 8px);
          padding: 0 8px;
        }
        input.header-input {
          background: var(--header-color-darker);
          color: var(--header-fg);
          border: 1px solid var(--header-color-border);
          flex: 1;
          padding-right: 24px;
          border-radius: 3px;
        }
        input.header-input::placeholder {
          opacity: 0.4;
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
          transition: max-height 0.2s ease-out;
        }
        .expanded-endpoint-body .tag-icon {
          transition: transform 0.2s ease-out;
        }
        .expanded-endpoint-body .tag-icon.expanded {
          transform: rotate(180deg);
        }
        .divider {
          border-top: 2px solid var(--border-color);
          margin: 24px 0;
          width: 100%;
        }

        .tooltip {
          cursor: pointer;
          border: 1px solid var(--border-color);
          border-left-width: 4px;
          margin-left: 2px;
        }
        .tooltip a {
          color: var(--fg2);
          text-decoration: none;
        }
        .tooltip-text {
          color: var(--fg2);
          max-width: 400px;
          position: absolute;
          z-index: 1;
          background: var(--bg2);
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
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .nav-method {
          font-weight: bold;
          margin-right: 4px;
          font-size: calc(var(--font-size-small) - 2px);
          white-space: nowrap;
        }
        .nav-method.false {
          display: none;
        }

        .nav-method.as-colored-text.get {
          color: var(--nav-get-color);
        }
        .nav-method.as-colored-text.put {
          color: var(--nav-put-color);
        }
        .nav-method.as-colored-text.post {
          color: var(--nav-post-color);
        }
        .nav-method.as-colored-text.delete {
          color: var(--nav-delete-color);
        }
        .nav-method.as-colored-text.head,
        .nav-method.as-colored-text.patch,
        .nav-method.as-colored-text.options {
          color: var(--nav-head-color);
        }

        .nav-method.as-colored-block {
          padding: 1px 4px;
          min-width: 30px;
          border-radius: 4px 0 0 4px;
          color: #000;
        }
        .colored-block .nav-method.as-colored-block {
          outline: 1px solid;
        }

        .nav-method.as-colored-block.get {
          background: var(--blue);
        }
        .nav-method.as-colored-block.put {
          background: var(--orange);
        }
        .nav-method.as-colored-block.post {
          background: var(--green);
        }
        .nav-method.as-colored-block.delete {
          background: var(--red);
        }
        .nav-method.as-colored-block.head,
        .nav-method.as-colored-block.patch,
        .nav-method.as-colored-block.options {
          background: var(--yellow);
        }

        @container (min-width: 768px) {
          .nav-bar {
            width: 260px;
            display: flex;
          }
          #nav-bar-btn {
            display: none;
          }
          #advanced-search-btn {
            display: block;
          }
          .only-large-screen {
            display: block;
          }
          .only-large-screen-flex {
            display: flex;
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
            padding: 36px 0 48px 0;
          }
        }

        @container (min-width: 1024px) {
          .nav-bar {
            width: ${ps(this.fontSize==="default"?"300px":this.fontSize==="large"?"315px":"330px")};
            display: flex;
          }
          #nav-bar-btn {
            display: none;
          }
          #advanced-search-btn {
            display: block;
          }
          .section-gap--focused-mode {
            padding: 12px 80px 12px 80px;
          }
          .section-gap--read-mode {
            padding: 24px 80px 12px 80px;
          }
        }
      `,Qe]}connectedCallback(){super.connectedCallback();let e=this.parentElement;if(e&&(e.offsetWidth===0&&e.style.width===""&&(e.style.width="100vw"),e.offsetHeight===0&&e.style.height===""&&(e.style.height="100vh"),e.tagName==="BODY"&&(e.style.marginTop||(e.style.marginTop="0"),e.style.marginRight||(e.style.marginRight="0"),e.style.marginBottom||(e.style.marginBottom="0"),e.style.marginLeft||(e.style.marginLeft="0"))),this.loadFonts!=="false"){let t={family:"Open Sans",style:"normal",weight:"300",unicodeRange:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"},a=new FontFace("Open Sans","url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN_r8OUuhpKKSTjw.woff2) format('woff2')",t);t.weight="600";let r=new FontFace("Open Sans","url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UNirkOUuhpKKSTjw.woff2) format('woff2')",t);a.load().then(s=>{document.fonts.add(s)}),r.load().then(s=>{document.fonts.add(s)})}(!this.layout||!"row, column,".includes(`${this.layout},`))&&(this.layout="row"),(!this.renderStyle||!"read, view, focused,".includes(`${this.renderStyle},`))&&(this.renderStyle="focused"),(!this.schemaStyle||!"tree, table,".includes(`${this.schemaStyle},`))&&(this.schemaStyle="tree"),(!this.theme||!"light, dark,".includes(`${this.theme},`))&&(this.theme=window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"),!this.defaultSchemaTab||!"example, schema, model,".includes(`${this.defaultSchemaTab},`)?this.defaultSchemaTab="example":this.defaultSchemaTab==="model"&&(this.defaultSchemaTab="schema"),(!this.schemaExpandLevel||this.schemaExpandLevel<1)&&(this.schemaExpandLevel=99999),(!this.schemaDescriptionExpanded||!"true, false,".includes(`${this.schemaDescriptionExpanded},`))&&(this.schemaDescriptionExpanded="false"),(!this.schemaHideReadOnly||!"default, never,".includes(`${this.schemaHideReadOnly},`))&&(this.schemaHideReadOnly="default"),(!this.schemaHideWriteOnly||!"default, never,".includes(`${this.schemaHideWriteOnly},`))&&(this.schemaHideWriteOnly="default"),(!this.fillRequestFieldsWithExample||!"true, false,".includes(`${this.fillRequestFieldsWithExample},`))&&(this.fillRequestFieldsWithExample="true"),(!this.persistAuth||!"true, false,".includes(`${this.persistAuth},`))&&(this.persistAuth="false"),this.responseAreaHeight||="400px",(!this.allowSearch||!"true, false,".includes(`${this.allowSearch},`))&&(this.allowSearch="true"),(!this.allowAdvancedSearch||!"true, false,".includes(`${this.allowAdvancedSearch},`))&&(this.allowAdvancedSearch="true"),(!this.allowTry||!"true, false,".includes(`${this.allowTry},`))&&(this.allowTry="true"),this.apiKeyValue||="-",this.apiKeyLocation||="header",this.apiKeyName||="",this.oauthReceiver||="oauth-receiver.html",(!this.updateRoute||!"true, false,".includes(`${this.updateRoute},`))&&(this.updateRoute="true"),this.routePrefix||="#",(!this.sortTags||!"true, false,".includes(`${this.sortTags},`))&&(this.sortTags="false"),(!this.sortSchemas||!"true, false,".includes(`${this.sortSchemas},`))&&(this.sortSchemas="false"),(!this.generateMissingTags||!"true, false,".includes(`${this.generateMissingTags},`))&&(this.generateMissingTags="false"),(!this.sortEndpointsBy||!"method, path, summary, none,".includes(`${this.sortEndpointsBy},`))&&(this.sortEndpointsBy="path"),(!this.onNavTagClick||!"expand-collapse, show-description,".includes(`${this.onNavTagClick},`))&&(this.onNavTagClick="expand-collapse"),(!this.navItemSpacing||!"compact, relaxed, default,".includes(`${this.navItemSpacing},`))&&(this.navItemSpacing="default"),(!this.showMethodInNavBar||!"false, as-plain-text, as-colored-text, as-colored-block,".includes(`${this.showMethodInNavBar},`))&&(this.showMethodInNavBar="false"),(!this.usePathInNavBar||!"true, false,".includes(`${this.usePathInNavBar},`))&&(this.usePathInNavBar="false"),(!this.navActiveItemMarker||!"left-bar, colored-block".includes(`${this.navActiveItemMarker},`))&&(this.navActiveItemMarker="left-bar"),(!this.fontSize||!"default, large, largest,".includes(`${this.fontSize},`))&&(this.fontSize="default"),(!this.showInfo||!"true, false,".includes(`${this.showInfo},`))&&(this.showInfo="true"),(!this.allowServerSelection||!"true, false,".includes(`${this.allowServerSelection},`))&&(this.allowServerSelection="true"),(!this.allowAuthentication||!"true, false,".includes(`${this.allowAuthentication},`))&&(this.allowAuthentication="true"),(!this.allowSchemaDescriptionExpandToggle||!"true, false,".includes(`${this.allowSchemaDescriptionExpandToggle},`))&&(this.allowSchemaDescriptionExpandToggle="true"),(!this.showSideNav||!"true false".includes(this.showSideNav))&&(this.showSideNav="true"),(!this.showComponents||!"true false".includes(this.showComponents))&&(this.showComponents="false"),(!this.infoDescriptionHeadingsInNavBar||!"true, false,".includes(`${this.infoDescriptionHeadingsInNavBar},`))&&(this.infoDescriptionHeadingsInNavBar="false"),(!this.fetchCredentials||!"omit, same-origin, include,".includes(`${this.fetchCredentials},`))&&(this.fetchCredentials=""),(!this.scrollBehavior||!"smooth, auto,".includes(`${this.scrollBehavior},`))&&(this.scrollBehavior="auto"),(!this.matchType||!"includes regex".includes(this.matchType))&&(this.matchType="includes"),this.matchPaths||="",this.removeEndpointsWithBadgeLabelAs||="",this.cssFile||=null,this.cssClasses||="",window.addEventListener("hashchange",()=>{this.scrollToPath(this.getElementIDFromURL())},!0)}disconnectedCallback(){this.intersectionObserver&&this.intersectionObserver.disconnect(),super.disconnectedCallback()}infoDescriptionHeadingRenderer(){let e=new D.Renderer,t=new At;return e.heading=(a,r,s)=>`<h${r} class="observe-me" id="${t.slug(s)}">${a}</h${r}>`,e}render(){let e=document.querySelector(`link[href*="${this.cssFile}"]`);return e&&this.shadowRoot.appendChild(e.cloneNode()),Gi.call(this)}updated(e){super.updated?.(e),na(this.shadowRoot)}observeExpandedContent(){this.shadowRoot.querySelectorAll(".observe-me").forEach(e=>{this.intersectionObserver.observe(e)})}attributeChangedCallback(e,t,a){if(e==="spec-url"&&t!==a&&window.setTimeout(async()=>{await this.loadSpec(a),this.gotoPath&&!window.location.hash&&this.scrollToPath(this.gotoPath)},0),(e==="match-paths"||e==="match-type"||e==="remove-endpoints-with-badge-label-as")&&t!==a&&window.setTimeout(async()=>{await this.loadSpec(this.specUrl)},0),e==="render-style"&&(a==="read"?window.setTimeout(()=>{this.observeExpandedContent()},100):this.intersectionObserver.disconnect()),e==="api-key-name"||e==="api-key-location"||e==="api-key-value"){let r=!1,s="",n="",i="";if(e==="api-key-name"?this.getAttribute("api-key-location")&&this.getAttribute("api-key-value")&&(s=a,n=this.getAttribute("api-key-location"),i=this.getAttribute("api-key-value"),r=!0):e==="api-key-location"?this.getAttribute("api-key-name")&&this.getAttribute("api-key-value")&&(n=a,s=this.getAttribute("api-key-name"),i=this.getAttribute("api-key-value"),r=!0):e==="api-key-value"&&this.getAttribute("api-key-name")&&this.getAttribute("api-key-location")&&(i=a,n=this.getAttribute("api-key-location"),s=this.getAttribute("api-key-name"),r=!0),r&&this.resolvedSpec){let o=this.resolvedSpec.securitySchemes.find(l=>l.securitySchemeId===Tt);o?(o.name=s,o.in=n,o.value=i,o.finalKeyValue=i):this.resolvedSpec.securitySchemes.push({securitySchemeId:Tt,description:"api-key provided in rapidoc element attributes",type:"apiKey",name:s,in:n,value:i,finalKeyValue:i}),this.requestUpdate()}}super.attributeChangedCallback(e,t,a)}onSpecUrlChange(){this.setAttribute("spec-url",this.shadowRoot.getElementById("spec-url").value)}onSpecFileChange(e){this.setAttribute("spec-file",this.shadowRoot.getElementById("spec-file").value);let t=e.target.files[0],a=new FileReader;a.onload=()=>{try{let r=JSON.parse(a.result);this.loadSpec(r),this.shadowRoot.getElementById("spec-url").value=""}catch{}},a.readAsText(t)}onFileLoadClick(){this.shadowRoot.getElementById("spec-file").click()}onSearchChange(e){this.searchVal=e.target.value,this.resolvedSpec.tags.forEach(t=>t.paths.filter(a=>{this.searchVal&&_t(this.searchVal,a,t.name)&&(t.expanded=!0)})),this.resolvedSpec.components.forEach(t=>t.subComponents.filter(a=>{a.expanded=!1,Al(this.searchVal,a)&&(a.expanded=!0)})),this.requestUpdate()}onClearSearch(){let e=this.shadowRoot.getElementById("nav-bar-search");e.value="",this.searchVal="",this.resolvedSpec.components.forEach(t=>t.subComponents.filter(a=>{a.expanded=!0}))}onOpenNavBarToggle(){this.shadowRoot.getElementById("nav-bar").classList.toggle("floating-nav")}onShowAdvancedSearchClicked(){this.shadowRoot.getElementById("advanced-search-dialog").showModal()}onAdvancedSearchClose(){this.shadowRoot.getElementById("advanced-search-dialog").close()}async loadSpec(e){if(e){this.searchVal="";try{this.resolvedSpec={specLoadError:!1,isSpecLoading:!0,tags:[]},this.loading=!0,this.loadFailed=!1;let t=await Fi.call(this,e,this.generateMissingTags==="true",this.sortTags==="true",this.sortSchemas==="true",this.getAttribute("sort-endpoints-by"),this.getAttribute("api-key-name"),this.getAttribute("api-key-location"),this.getAttribute("api-key-value"),this.getAttribute("server-url"),this.matchPaths,this.matchType,this.removeEndpointsWithBadgeLabelAs);this.loading=!1,this.afterSpecParsedAndValidated(t)}catch{this.loading=!1,this.loadFailed=!0,this.resolvedSpec=null}}}async afterSpecParsedAndValidated(e){for(this.resolvedSpec=e,this.selectedServer=void 0,this.defaultApiServerUrl&&(this.defaultApiServerUrl===this.serverUrl?this.selectedServer={url:this.serverUrl,computedUrl:this.serverUrl}:this.resolvedSpec.servers&&(this.selectedServer=this.resolvedSpec.servers.find(r=>r.url===this.defaultApiServerUrl))),this.selectedServer||this.resolvedSpec.servers&&(this.selectedServer=this.resolvedSpec.servers[0]),this.requestUpdate();!await this.updateComplete;);let t=new CustomEvent("spec-loaded",{detail:e});this.dispatchEvent(t),this.intersectionObserver.disconnect(),this.renderStyle==="read"&&(await da(100),this.observeExpandedContent()),this.isIntersectionObserverActive=!0;let a=this.getElementIDFromURL();if(a)this.renderStyle==="view"?this.expandAndGotoOperation(a,!0,!0):this.scrollToPath(a);else if(this.renderStyle==="focused"&&!this.gotoPath){let r=this.showInfo?"overview":this.resolvedSpec.tags[0]?.paths[0];this.scrollToPath(r)}}getComponentBaseURL(){let{href:e}=window.location,t=this.routePrefix.replace(/(#|\/)$/,"");if(!t)return e.split("#")[0];let a=e.lastIndexOf(t);return a===-1?e:e.slice(0,a)}getElementIDFromURL(){let e=this.getComponentBaseURL();return window.location.href.replace(e+this.routePrefix,"")}replaceHistoryState(e){let t=this.getComponentBaseURL();window.history.replaceState(null,null,`${t}${this.routePrefix||"#"}${e}`)}expandAndGotoOperation(e,t=!0){if(!this.resolvedSpec)return;let a=!0,r=e.indexOf("#")===-1?e:e.substring(1);if(r.startsWith("overview")||r==="servers"||r==="auth")a=!1;else for(let s=0;s<this.resolvedSpec.tags?.length;s++){let n=this.resolvedSpec.tags[s],i=n.paths?.find(o=>o.elementId===e);i&&(i.expanded&&n.expanded?a=!1:(i.expanded=!0,n.expanded=!0))}t&&(a&&this.requestUpdate(),window.setTimeout(()=>{let s=this.shadowRoot.getElementById(r);s&&(s.scrollIntoView({behavior:this.scrollBehavior,block:"start"}),this.updateRoute==="true"&&this.replaceHistoryState(r))},a?150:0))}isValidTopId(e){return e.startsWith("overview")||e==="servers"||e==="auth"}isValidPathId(e){return e==="overview"&&this.showInfo||e==="servers"&&this.allowServerSelection||e==="auth"&&this.allowAuthentication?!0:e.startsWith("tag--")?this.resolvedSpec?.tags?.find(t=>t.elementId===e):this.resolvedSpec?.tags?.find(t=>t.paths.find(a=>a.elementId===e))}onIntersect(e){this.isIntersectionObserverActive!==!1&&e.forEach(t=>{if(t.isIntersecting&&t.intersectionRatio>0){let a=this.shadowRoot.querySelector(".nav-bar-tag.active, .nav-bar-path.active, .nav-bar-info.active, .nav-bar-h1.active, .nav-bar-h2.active, .operations.active"),r=this.shadowRoot.getElementById(`link-${t.target.id}`);r&&(this.updateRoute==="true"&&this.replaceHistoryState(t.target.id),r.scrollIntoView({behavior:this.scrollBehavior,block:"center"}),r.classList.add("active"),r.part.add("section-navbar-active-item")),a&&a!==r&&(a.classList.remove("active"),a.part.remove("section-navbar-active-item"))}})}handleHref(e){if(e.target.tagName.toLowerCase()==="a"&&e.target.getAttribute("href").startsWith("#")){let t=this.shadowRoot.getElementById(e.target.getAttribute("href").replace("#",""));t&&t.scrollIntoView({behavior:this.scrollBehavior,block:"start"})}}async scrollToEventTarget(e,t=!0){if(!(e.type==="click"||e.type==="keyup"&&e.keyCode===13))return;let a=e.target;if(a.dataset.contentId){if(this.isIntersectionObserverActive=!1,this.renderStyle==="focused"){let r=this.shadowRoot.querySelector("api-request");r&&r.beforeNavigationFocusedMode()}this.scrollToPath(a.dataset.contentId,!0,t),setTimeout(()=>{this.isIntersectionObserverActive=!0},300)}}async scrollToPath(e,t=!0,a=!0){if(this.renderStyle==="focused"&&(this.focusedElementId=e,await da(0)),this.renderStyle==="view")this.expandAndGotoOperation(e,t,!0);else{let r=!1,s=this.shadowRoot.getElementById(e);if(s?(r=!0,s.scrollIntoView({behavior:this.scrollBehavior,block:"start"})):r=!1,r){if(this.renderStyle==="focused"){let i=this.shadowRoot.querySelector("api-request");i&&i.afterNavigationFocusedMode();let o=this.shadowRoot.querySelector("api-response");o&&o.resetSelection()}this.updateRoute==="true"&&this.replaceHistoryState(e);let n=this.shadowRoot.getElementById(`link-${e}`);if(n){a&&n.scrollIntoView({behavior:this.scrollBehavior,block:"center"}),await da(0);let i=this.shadowRoot.querySelector(".nav-bar-tag.active, .nav-bar-path.active, .nav-bar-info.active, .nav-bar-h1.active, .nav-bar-h2.active, .operations.active");i&&(i.classList.remove("active"),i.part.remove("active"),i.part.remove("section-navbar-active-item")),n.classList.add("active"),n.part.add("section-navbar-active-item")}}}}setHttpUserNameAndPassword(e,t,a){return Ke.call(this,e,t,a)}setApiKey(e,t){return Ke.call(this,e,"","",t)}removeAllSecurityKeys(){return Xr.call(this)}setApiServer(e){return is.call(this,e)}onAdvancedSearch(e,t){let a=e.target;clearTimeout(this.timeoutId),this.timeoutId=setTimeout(()=>{let r;r=a.type==="text"?a:a.closest(".advanced-search-options").querySelector("input[type=text]");let s=[...a.closest(".advanced-search-options").querySelectorAll("input:checked")].map(n=>n.id);this.advancedSearchMatches=Cl(r.value,this.resolvedSpec.tags,s)},t)}};customElements.define("rapi-doc",Yi);var Xi=class extends ee{constructor(){super(),this.isMini=!0,this.updateRoute="false",this.renderStyle="view",this.showHeader="false",this.allowAdvancedSearch="false"}static get properties(){return{specUrl:{type:String,attribute:"spec-url"},sortEndpointsBy:{type:String,attribute:"sort-endpoints-by"},layout:{type:String},pathsExpanded:{type:String,attribute:"paths-expanded"},defaultSchemaTab:{type:String,attribute:"default-schema-tab"},responseAreaHeight:{type:String,attribute:"response-area-height"},showSummaryWhenCollapsed:{type:String,attribute:"show-summary-when-collapsed"},fillRequestFieldsWithExample:{type:String,attribute:"fill-request-fields-with-example"},persistAuth:{type:String,attribute:"persist-auth"},schemaStyle:{type:String,attribute:"schema-style"},schemaExpandLevel:{type:Number,attribute:"schema-expand-level"},schemaDescriptionExpanded:{type:String,attribute:"schema-description-expanded"},apiKeyName:{type:String,attribute:"api-key-name"},apiKeyLocation:{type:String,attribute:"api-key-location"},apiKeyValue:{type:String,attribute:"api-key-value"},defaultApiServerUrl:{type:String,attribute:"default-api-server"},serverUrl:{type:String,attribute:"server-url"},oauthReceiver:{type:String,attribute:"oauth-receiver"},allowTry:{type:String,attribute:"allow-try"},showCurlBeforeTry:{type:String,attribute:"show-curl-before-try"},theme:{type:String},bgColor:{type:String,attribute:"bg-color"},textColor:{type:String,attribute:"text-color"},primaryColor:{type:String,attribute:"primary-color"},fontSize:{type:String,attribute:"font-size"},regularFont:{type:String,attribute:"regular-font"},monoFont:{type:String,attribute:"mono-font"},loadFonts:{type:String,attribute:"load-fonts"},fetchCredentials:{type:String,attribute:"fetch-credentials"},matchPaths:{type:String,attribute:"match-paths"},matchType:{type:String,attribute:"match-type"},removeEndpointsWithBadgeLabelAs:{type:String,attribute:"remove-endpoints-with-badge-label-as"},loading:{type:Boolean}}}static get styles(){return[je,Ft,ia,oa,cn,hr,la,dn,pn,M`
        :host {
          all: initial;
          display: flex;
          flex-direction: column;
          min-width: 360px;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
          letter-spacing: normal;
          color: var(--fg);
          background: var(--bg);
          font-family: var(--font-regular);
          container-type: inline-size;
        }

        @container (min-width: 768px) {
          .only-large-screen {
            display: block;
          }
          .only-large-screen-flex {
            display: flex;
          }
        }
      `]}connectedCallback(){if(super.connectedCallback(),this.loadFonts!=="false"){let e={family:"Open Sans",style:"normal",weight:"300",unicodeRange:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"},t=new FontFace("Open Sans","url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN_r8OUuhpKKSTjw.woff2) format('woff2')",e);e.weight="600";let a=new FontFace("Open Sans","url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UNirkOUuhpKKSTjw.woff2) format('woff2')",e);t.load().then(r=>{document.fonts.add(r)}),a.load().then(r=>{document.fonts.add(r)})}(!this.showSummaryWhenCollapsed||!"true, false,".includes(`${this.showSummaryWhenCollapsed},`))&&(this.showSummaryWhenCollapsed="true"),(!this.layout||!"row, column,".includes(`${this.layout},`))&&(this.layout="row"),(!this.schemaStyle||!"tree, table,".includes(`${this.schemaStyle},`))&&(this.schemaStyle="tree"),(!this.theme||!"light, dark,".includes(`${this.theme},`))&&(this.theme=window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"),!this.defaultSchemaTab||!"example, schema, model,".includes(`${this.defaultSchemaTab},`)?this.defaultSchemaTab="example":this.defaultSchemaTab==="model"&&(this.defaultSchemaTab="schema"),this.pathsExpanded=this.pathsExpanded==="true",(!this.schemaExpandLevel||this.schemaExpandLevel<1)&&(this.schemaExpandLevel=99999),(!this.schemaDescriptionExpanded||!"true, false,".includes(`${this.schemaDescriptionExpanded},`))&&(this.schemaDescriptionExpanded="false"),(!this.fillRequestFieldsWithExample||!"true, false,".includes(`${this.fillRequestFieldsWithExample},`))&&(this.fillRequestFieldsWithExample="true"),(!this.persistAuth||!"true, false,".includes(`${this.persistAuth},`))&&(this.persistAuth="false"),this.responseAreaHeight||="300px",(!this.allowTry||!"true, false,".includes(`${this.allowTry},`))&&(this.allowTry="true"),this.apiKeyValue||="-",this.apiKeyLocation||="header",this.apiKeyName||="",this.oauthReceiver||="oauth-receiver.html",(!this.sortTags||!"true, false,".includes(`${this.sortTags},`))&&(this.sortTags="false"),(!this.sortEndpointsBy||!"method, path, summary,".includes(`${this.sortEndpointsBy},`))&&(this.sortEndpointsBy="path"),(!this.fontSize||!"default, large, largest,".includes(`${this.fontSize},`))&&(this.fontSize="default"),(!this.matchType||!"includes regex".includes(this.matchType))&&(this.matchType="includes"),this.matchPaths||="",this.removeEndpointsWithBadgeLabelAs||="",(!this.allowSchemaDescriptionExpandToggle||!"true, false,".includes(`${this.allowSchemaDescriptionExpandToggle},`))&&(this.allowSchemaDescriptionExpandToggle="true"),(!this.fetchCredentials||!"omit, same-origin, include,".includes(`${this.fetchCredentials},`))&&(this.fetchCredentials="")}render(){return Gi.call(this,!0,this.pathsExpanded)}updated(e){super.updated?.(e),na(this.shadowRoot)}attributeChangedCallback(e,t,a){if(e==="spec-url"&&t!==a&&window.setTimeout(async()=>{await this.loadSpec(a)},0),(e==="match-paths"||e==="match-type"||e==="remove-endpoints-with-badge-label-as")&&t!==a&&window.setTimeout(async()=>{await this.loadSpec(this.specUrl)},0),e==="api-key-name"||e==="api-key-location"||e==="api-key-value"){let r=!1,s="",n="",i="";if(e==="api-key-name"?this.getAttribute("api-key-location")&&this.getAttribute("api-key-value")&&(s=a,n=this.getAttribute("api-key-location"),i=this.getAttribute("api-key-value"),r=!0):e==="api-key-location"?this.getAttribute("api-key-name")&&this.getAttribute("api-key-value")&&(n=a,s=this.getAttribute("api-key-name"),i=this.getAttribute("api-key-value"),r=!0):e==="api-key-value"&&this.getAttribute("api-key-name")&&this.getAttribute("api-key-location")&&(i=a,n=this.getAttribute("api-key-location"),s=this.getAttribute("api-key-name"),r=!0),r&&this.resolvedSpec){let o=this.resolvedSpec.securitySchemes.find(l=>l.securitySchemeId===Tt);o?(o.name=s,o.in=n,o.value=i,o.finalKeyValue=i):this.resolvedSpec.securitySchemes.push({apiKeyId:Tt,description:"api-key provided in rapidoc element attributes",type:"apiKey",name:s,in:n,value:i,finalKeyValue:i}),this.requestUpdate()}}super.attributeChangedCallback(e,t,a)}onSpecUrlChange(){this.setAttribute("spec-url",this.shadowRoot.getElementById("spec-url").value)}async loadSpec(e){if(e)try{this.resolvedSpec={specLoadError:!1,isSpecLoading:!0,tags:[]},this.loading=!0,this.loadFailed=!1,this.requestUpdate();let t=await Fi.call(this,e,this.generateMissingTags==="true",this.sortTags==="true",this.sortSchemas==="true",this.getAttribute("sort-endpoints-by"),this.getAttribute("api-key-name"),this.getAttribute("api-key-location"),this.getAttribute("api-key-value"),this.getAttribute("server-url"),this.matchPaths,this.matchType,this.removeEndpointsWithBadgeLabelAs);this.loading=!1,this.afterSpecParsedAndValidated(t)}catch{this.loading=!1,this.loadFailed=!0,this.resolvedSpec=null}}setHttpUserNameAndPassword(e,t,a){return Ke.call(this,e,t,a)}setApiKey(e,t){return Ke.call(this,e,"","",t)}removeAllSecurityKeys(){return Xr.call(this)}setApiServer(e){return is.call(this,e)}async afterSpecParsedAndValidated(e){for(this.resolvedSpec=e,this.selectedServer=void 0,this.defaultApiServerUrl&&(this.defaultApiServerUrl===this.serverUrl?this.selectedServer={url:this.serverUrl,computedUrl:this.serverUrl}:this.resolvedSpec.servers&&(this.selectedServer=this.resolvedSpec.servers.find(a=>a.url===this.defaultApiServerUrl))),this.selectedServer||this.resolvedSpec.servers&&(this.selectedServer=this.resolvedSpec.servers[0]),this.requestUpdate();!await this.updateComplete;);let t=new CustomEvent("spec-loaded",{detail:e});this.dispatchEvent(t)}handleHref(e){if(e.target.tagName.toLowerCase()==="a"&&e.target.getAttribute("href").startsWith("#")){let t=this.shadowRoot.getElementById(e.target.getAttribute("href").replace("#",""));t&&t.scrollIntoView({behavior:"auto",block:"start"})}}};customElements.define("rapi-doc-mini",Xi);var Qi=class extends HTMLElement{connectedCallback(){this.receiveAuthParms(),window.addEventListener("storage",e=>this.receiveStorage(e),!0)}receiveAuthParms(){let e={};if(document.location.search){let t=new URLSearchParams(document.location.search);e={code:t.get("code"),error:t.get("error"),state:t.get("state"),responseType:"code"}}else window.location.hash&&(e={token_type:this.parseQueryString(window.location.hash.substring(1),"token_type"),access_token:this.parseQueryString(window.location.hash.substring(1),"access_token"),responseType:"token"});if(window.opener){window.opener.postMessage(e,this.target);return}sessionStorage.setItem("rapidoc-oauth-data",JSON.stringify(e))}relayAuthParams(e){if(window.parent&&e.key==="rapidoc-oauth-data"){let t=JSON.parse(e.newValue);window.parent.postMessage(t,this.target)}}parseQueryString(e,t){let a=e.split("&");for(let r=0;r<a.length;r++){let s=a[r].split("=");if(decodeURIComponent(s[0])===t)return decodeURIComponent(s[1])}}};customElements.define("oauth-receiver",Qi);var up={RapiDoc:Yi};export{Qi as OAuthReceiver,Xi as RapiDocMini,up as default};
