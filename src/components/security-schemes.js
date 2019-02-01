import { LitElement, html } from 'lit-element'; 
import FontStyles from '@/styles/font-styles';
// Create your custom component
export default class SecuritySchemes extends LitElement {
  render() {
    return html`
    ${FontStyles}
    <div class="sub-title regular-font">AUTHENTICATION</div>
    <div style="font-size:12px; font-weight:bold; color:var(--error-color)">This section is under construction </div>
    `
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
customElements.define('security-schemes', SecuritySchemes);
