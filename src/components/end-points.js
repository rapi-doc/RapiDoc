import { LitElement, html } from 'lit-element'; 
import EndPoint from '@/components/end-point'; 
// Create your custom component
export default class EndPoints extends LitElement {
  render() {
    return html`
    ${this.paths.map(
      path => html`<end-point .path=${path} layout="${this.layout?this.layout:'row'}"> </end-point>`
    )}`
  }

  static get properties() {
    return {
      paths:{type: Object},
      layout: {type: String}
    };
  }
}
// Register the element with the browser
customElements.define('end-points', EndPoints);
