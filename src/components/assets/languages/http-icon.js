/* eslint-disable max-len */
import { html } from 'lit';

export default function httpIcon(dimensions) {
  const width = dimensions?.width ?? 20;
  const height = dimensions?.height ?? 20;
  return html`
    <svg width=${width} height=${height} viewBox="0 0 128 128">
    </svg>    
  `;
}
