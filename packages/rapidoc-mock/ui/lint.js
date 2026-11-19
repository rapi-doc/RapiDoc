import { html, nothing, svg } from "lit";
import { icon } from "./icons.js";

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
 * `expanded` is for a list whose rows open (the Lint section's): true or false draws the arrow of a row that
 * opens, pointing down when it is open; null keeps the arrow's place empty, so the rows line up.
 * @param {object} one - A category or a rule of the summary
 * @param {{ label: string, href: string, title?: string, current?: boolean, rule?: boolean,
 *   expanded?: boolean | null }} how
 */
export const lintRow = (
  one,
  { label, href, title = "", current = false, rule = false, expanded },
) => html`
  <a
    class="lint-row${rule ? " rule" : ""}${current ? " current" : ""}${expanded ? " open" : ""}"
    href=${href}
    title=${title}
    aria-current=${current ? "true" : "false"}
    aria-expanded=${typeof expanded === "boolean" ? String(expanded) : nothing}
  >
    ${
      expanded === undefined
        ? nothing
        : html`<span class="arrow">${expanded === null ? nothing : icon("chevron")}</span>`
    }
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

/**
 * What a rule checks, from its description, to read after "Checks that": "Every parameter has a description: the
 * reference shows it …" gives "every parameter has a description". Only the check: a description goes on to say
 * what goes wrong without it (after a colon, or ", so …"), which is never the whole story, so that is left out,
 * and so is "Needs @rapidoc/mock." (this is the mock).
 */
export function checks(description = "") {
  const text = description.replace(/\s*Needs @rapidoc\/mock[^.]*\.\s*/g, " ").trim();
  const head = text.split(": ")[0].split(", so ")[0].replace(/\.$/, "");
  // "Every …" reads on after "Checks that"; "operationIds …" and "OpenAPI …" keep their case
  return /^[A-Z](?![A-Z])/.test(head) ? head[0].toLowerCase() + head.slice(1) : head;
}

/** What a total, category or rule found, as a sentence: "Found 11 warnings in 373 checks; 97% passed." */
export function foundLine(one) {
  const what = [
    one.errors ? count(one.errors, "error") : "",
    one.warnings ? count(one.warnings, "warning") : "",
  ]
    .filter(Boolean)
    .join(" and ");
  if (!measured(one)) return what ? `Found ${what}.` : "Found nothing.";
  const checked = count(one.checked, "check");
  return what
    ? `Found ${what} in ${checked}; ${share(one)} passed.`
    : `Found nothing: all ${checked} passed.`;
}

/**
 * The share of checks that passed as the arc of a ring (the rest of the ring is not drawn), `size` pixels wide;
 * with `inside`, the share is written in its middle. The ring draws in --ok (`.ring .fill` in styles.js).
 */
export const ring = (one, { size = 64, inside = false } = {}) => {
  const r = 26;
  const length = 2 * Math.PI * r;
  return html`<svg
    class="ring"
    viewBox="0 0 64 64"
    width=${size}
    height=${size}
    role="img"
    aria-label="${share(one)} of ${number(one.checked)} checks passed"
  >
    <title>${number(one.passed)} of ${number(one.checked)} checks passed</title>
    <circle
      class="fill"
      cx="32"
      cy="32"
      r=${r}
      stroke-width="8"
      stroke-dasharray="${(length * one.passed) / one.checked} ${length}"
      transform="rotate(-90 32 32)"
    ></circle>
    ${inside ? svg`<text class="ring-share" x="32" y="32">${share(one)}</text>` : nothing}
  </svg>`;
};

export { number };
