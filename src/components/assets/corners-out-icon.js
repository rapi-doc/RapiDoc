/* eslint-disable max-len */
import { html } from 'lit';

/* eslint-disable indent */
export default function cornersOutIcon(dimensions) {
  const width = dimensions?.width ?? 16;
  const height = dimensions?.height ?? 16;
  return html`
    <svg width=${width} height=${height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.9 3C9.9 2.66863 10.1686 2.4 10.5 2.4H13C13.3314 2.4 13.6 2.66863 13.6 3V5.5C13.6 5.83137 13.3314 6.1 13 6.1C12.6686 6.1 12.4 5.83137 12.4 5.5V3.6H10.5C10.1686 3.6 9.9 3.33137 9.9 3Z" fill="#A1A8B3"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M3 9.9C3.33137 9.9 3.6 10.1686 3.6 10.5V12.4H5.5C5.83137 12.4 6.1 12.6686 6.1 13C6.1 13.3314 5.83137 13.6 5.5 13.6H3C2.66863 13.6 2.4 13.3314 2.4 13V10.5C2.4 10.1686 2.66863 9.9 3 9.9Z" fill="#A1A8B3"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M13 9.9C13.3314 9.9 13.6 10.1686 13.6 10.5V13C13.6 13.3314 13.3314 13.6 13 13.6H10.5C10.1686 13.6 9.9 13.3314 9.9 13C9.9 12.6686 10.1686 12.4 10.5 12.4H12.4V10.5C12.4 10.1686 12.6686 9.9 13 9.9Z" fill="#A1A8B3"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.4 3C2.4 2.66863 2.66863 2.4 3 2.4H5.5C5.83137 2.4 6.1 2.66863 6.1 3C6.1 3.33137 5.83137 3.6 5.5 3.6H3.6V5.5C3.6 5.83137 3.33137 6.1 3 6.1C2.66863 6.1 2.4 5.83137 2.4 5.5V3Z" fill="#A1A8B3"/>
    </svg>
  `;
}
