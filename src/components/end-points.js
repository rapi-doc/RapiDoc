import { LitElement, html } from 'lit-element'; 
import EndPoint from '@/components/end-point'; 
// Create your custom component
export default class EndPoints extends LitElement {
  render() {
    return html`
    ${this.paths.map(
      path => html`<end-point server="${this.server}" layout="${this.layout}" .path=${path}> </end-point>`
    )}`
  }

  static get properties() {
    return {
      server: {type: String},
      layout: {type: String},
      paths : {type: Object}
    };
  }
}
// Register the element with the browser
customElements.define('end-points', EndPoints);
