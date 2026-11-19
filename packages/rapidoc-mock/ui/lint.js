import { html } from "lit";

/**
 * What the Dashboard and the Lint section share: how a lint result is worded and one row of its summary.
 * The result is the `lint` property of `<rapidoc-mock-ui>` (see the top of `mock-ui.js`).
 */

const number = (value) => value.toLocaleString("en");

/** "1 error", "1,204 warnings". */
export const count = (value, word) => `${number(value)} ${word}${value === 1 ? "" : "s"}`;

/** True when a total, category or rule counted the things it looked at. */
export const measured = (one) => one?.checked > 0;

/** How much of what was looked at passed, as a whole percentage that only says 100% when it is. */
export const share = ({ checked, passed }) =>
  `${passed === checked ? 100 : Math.min(99, Math.floor((100 * passed) / checked))}%`;

/** The errors and warnings of a lint result: `{ errors, warnings }`. */
export function tally(lint) {
  const errors = lint.problems.filter((one) => one.severity === "error").length;
  return { errors, warnings: lint.problems.length - errors };
}

/** The errors and warnings of a total, category or rule as text: "2 errors, 11 warnings", or "clean". */
export const found = (one) =>
  one.errors || one.warnings
    ? html`${
        one.errors ? html`<span class="errors">${count(one.errors, "error")}</span>` : ""
      }${one.errors && one.warnings ? ", " : ""}${
        one.warnings ? html`<span class="warnings">${count(one.warnings, "warning")}</span>` : ""
      }`
    : html`<span class="clean">clean</span>`;

/**
 * A row of the summary: a category or a rule with the share that passed and what was found, as a link.
 * @param {object} one - A category or a rule of the summary
 * @param {{ label: string, href: string, title?: string, current?: boolean, rule?: boolean }} how
 */
export const lintRow = (one, { label, href, title = "", current = false, rule = false }) => html`
  <a
    class="lint-row${rule ? " rule" : ""}${current ? " current" : ""}"
    href=${href}
    title=${title}
    aria-current=${current ? "true" : "false"}
  >
    <span class="label">${label}</span>
    ${
      measured(one)
        ? html`<span class="meter" aria-hidden="true"
              ><span style="width: ${(100 * one.passed) / one.checked}%"></span></span
            ><span class="share">${share(one)}</span>`
        : html`<span></span><span></span>`
    }
    <span class="found">${found(one)}</span>
  </a>
`;

export { number };
