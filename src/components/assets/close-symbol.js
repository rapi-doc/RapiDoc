/* eslint-disable max-len */
import { html } from 'lit';

/* eslint-disable indent */
export default function closeSymbol(dimensions) {
  const width = dimensions?.width ?? 20;
  const height = dimensions?.height ?? 20;
  return html`
    <svg width=${width} height=${height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.1553 3.46967C16.4482 3.76256 16.4482 4.23744 16.1553 4.53033L4.90533 15.7803C4.61244 16.0732 4.13756 16.0732 3.84467 15.7803C3.55178 15.4874 3.55178 15.0126 3.84467 14.7197L15.0947 3.46967C15.3876 3.17678 15.8624 3.17678 16.1553 3.46967Z" fill="#545454"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.84467 3.46967C4.13756 3.17678 4.61244 3.17678 4.90533 3.46967L16.1553 14.7197C16.4482 15.0126 16.4482 15.4874 16.1553 15.7803C15.8624 16.0732 15.3876 16.0732 15.0947 15.7803L3.84467 4.53033C3.55178 4.23744 3.55178 3.76256 3.84467 3.46967Z" fill="#545454"/>
    </svg>
  `;
}
