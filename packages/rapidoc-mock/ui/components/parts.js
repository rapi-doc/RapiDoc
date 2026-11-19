/**
 * The small pieces several sections draw the same way: a page's title, a group of buttons that picks one of a
 * few, a drawer over the page, the arrow of a row that opens, and how a row opens what it stands for. Functions
 * that return templates (or handlers): a section places them, and keeps the state they show.
 */
import { html, nothing } from "lit";
import { icon } from "../icons.js";

/**
 * A page's heading: its name, a line about it, and its section's icon as a mark at the right.
 * @param {string} mark - An icon name (icons.js)
 * @param {unknown} title
 * @param {unknown} [text]
 */
export const pageTitle = (mark, title, text) => html`
  <div class="title with-icon">
    ${icon(mark, 44)}
    <div>
      <h1>${title}</h1>
      ${text ? html`<p>${text}</p>` : nothing}
    </div>
  </div>
`;

/**
 * A group of joined buttons that picks one value: "By path / By resource", "All / Errors / Warnings".
 * @param {string} label - What the group chooses, for a screen reader
 * @param {[string, string][]} options - `[value, title]` pairs
 * @param {string} value - The one picked
 * @param {(value: string) => void} onPick
 */
export const segmented = (label, options, value, onPick) => html`
  <div class="segmented" role="group" aria-label=${label}>
    ${options.map(
      ([one, title]) => html`
        <button
          class=${value === one ? "current" : ""}
          aria-pressed=${value === one ? "true" : "false"}
          @click=${() => onPick(one)}
        >
          ${title}
        </button>
      `,
    )}
  </div>
`;

/**
 * A drawer over the right of what it is placed in (a positioned box): one surface with a shadow, whose content
 * scrolls under a close button that floats in its top-right corner. Esc closes it while the focus is inside;
 * what opened it (a row of a table) closes it on Esc too, as the focus may stay there.
 * @param {object} how
 * @param {string} how.label - What it shows, for a screen reader
 * @param {() => void} how.onClose
 * @param {string} [how.kind] - A class for its width and place (`record`, `response`)
 * @param {unknown} content
 */
export const drawer = ({ label, onClose, kind = "" }, content) => html`
  <aside class="drawer ${kind}" aria-label=${label} @keydown=${(e) => e.key === "Escape" && onClose()}>
    <button class="close" aria-label="Close" title="Close (Esc)" @click=${onClose}>
      ${icon("close")}
    </button>
    <div class="drawer-body">${content}</div>
  </aside>
`;

/** The arrow of something that opens: it points right, and down while `open`. */
export const twist = (open) =>
  html`<span class="twist${open ? " open" : ""}">${icon("chevron")}</span>`;

/**
 * The handlers of a row that opens something from anywhere on it: a click that is not on a link inside the row
 * (a link goes where it points) and not the end of selecting text to copy, and Enter or Space on a focused row.
 * Spread them on the row: `<tr class="opens" @click=${row.click} @keydown=${row.key}>`.
 * @param {() => void} open
 */
export const opens = (open) => ({
  click: (event) => {
    if (!event.target.closest("a, button") && !getSelection()?.toString()) open();
  },
  key: (event) => {
    if (event.target !== event.currentTarget || (event.key !== "Enter" && event.key !== " "))
      return;
    event.preventDefault();
    open();
  },
});

/**
 * One bar split into parts, each as wide as its share: the labels of the operations, the categories of the
 * warnings. With `of`, the bar is that long and the parts fill only their share of it, over a track: a meter,
 * as the share of checks that passed. Square ends, 2px between parts.
 * @param {{ value: number, color: string, title?: string }[]} parts - `color`: a CSS color, such as `var(--ok)`
 * @param {object} [how]
 * @param {string} [how.label] - What the bar shows, for a screen reader; without one the bar is decoration
 * @param {number} [how.of] - The whole a meter is measured against
 * @param {number} [how.height] - In pixels; 8 when left out
 */
export const bars = (parts, { label, of, height } = {}) => {
  const shown = parts.filter((one) => one.value > 0);
  const rest =
    of === undefined ? 0 : Math.max(0, of - shown.reduce((sum, one) => sum + one.value, 0));
  return html`<span
    class="bars${of === undefined ? "" : " meter"}"
    style=${height ? `--bar-height: ${height}px` : nothing}
    role=${label ? "img" : nothing}
    aria-label=${label || nothing}
    aria-hidden=${label ? nothing : "true"}
  >
    ${shown.map(
      (one) =>
        html`<span
          style="flex-grow: ${one.value}; background: ${one.color}"
          title=${one.title || nothing}
        ></span>`,
    )}
    ${rest ? html`<span class="rest" style="flex-grow: ${rest}"></span>` : nothing}
  </span>`;
};
