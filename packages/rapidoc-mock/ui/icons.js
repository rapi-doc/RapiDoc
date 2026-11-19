import { html, svg } from "lit";

/** Line icons of the sidebar and the header, 16px, drawn in the text color. Decorative: a label always follows. */
const PATHS = {
  dashboard: svg`<rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/>`,
  resources: svg`<ellipse cx="8" cy="4" rx="5.5" ry="2"/><path d="M2.5 4v8c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2V4"/><path d="M2.5 8c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2"/>`,
  operations: svg`<path d="M2 4h9"/><path d="M8.5 1.5 11 4 8.5 6.5"/><path d="M14 12H5"/><path d="M7.5 9.5 5 12l2.5 2.5"/>`,
  lint: svg`<circle cx="8" cy="8" r="6"/><path d="M5.4 8.2 7.2 10l3.4-3.8"/>`,
  settings: svg`<path d="M2 4.5h6"/><path d="M12 4.5h2"/><circle cx="10" cy="4.5" r="2"/><path d="M2 11.5h2"/><path d="M8 11.5h6"/><circle cx="6" cy="11.5" r="2"/>`,
  menu: svg`<path d="M2 4h12"/><path d="M2 8h12"/><path d="M2 12h12"/>`,
};

export const icon = (name) => html`
  <svg class="icon" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor"
    stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    ${PATHS[name]}
  </svg>
`;
