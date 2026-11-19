import { html } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
// Phosphor Icons, regular weight (MIT): the same set the portal and the Rapi Mock site use. Each file is read as
// text at build time, so only these icons are bundled (Vite's `?raw`); `mock-ui.LICENSE.txt` carries the notice.
import arrowsLeftRight from "@phosphor-icons/core/assets/regular/arrows-left-right.svg?raw";
import caretDown from "@phosphor-icons/core/assets/regular/caret-down.svg?raw";
import caretRight from "@phosphor-icons/core/assets/regular/caret-right.svg?raw";
import caretUp from "@phosphor-icons/core/assets/regular/caret-up.svg?raw";
import database from "@phosphor-icons/core/assets/regular/database.svg?raw";
import list from "@phosphor-icons/core/assets/regular/list.svg?raw";
import listChecks from "@phosphor-icons/core/assets/regular/list-checks.svg?raw";
import rows from "@phosphor-icons/core/assets/regular/rows.svg?raw";
import slidersHorizontal from "@phosphor-icons/core/assets/regular/sliders-horizontal.svg?raw";
import squaresFour from "@phosphor-icons/core/assets/regular/squares-four.svg?raw";
import x from "@phosphor-icons/core/assets/regular/x.svg?raw";
// the light weight, for the large marks of a page or a card: thinner lines at that size
import arrowsLeftRightLight from "@phosphor-icons/core/assets/light/arrows-left-right-light.svg?raw";
import databaseLight from "@phosphor-icons/core/assets/light/database-light.svg?raw";
import listChecksLight from "@phosphor-icons/core/assets/light/list-checks-light.svg?raw";
import rowsLight from "@phosphor-icons/core/assets/light/rows-light.svg?raw";
import slidersHorizontalLight from "@phosphor-icons/core/assets/light/sliders-horizontal-light.svg?raw";
import squaresFourLight from "@phosphor-icons/core/assets/light/squares-four-light.svg?raw";

/** What is inside a Phosphor file's `<svg>`: its paths, drawn in the text color on a 256-unit grid. */
const inner = (file) => file.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");

/**
 * The Mock UI's icons, by what they stand for: a section of the sidebar (its id), or a control. Decorative: a
 * label always goes with them.
 */
const ICONS = {
  dashboard: inner(squaresFour),
  operations: inner(arrowsLeftRight),
  resources: inner(database),
  records: inner(rows),
  lint: inner(listChecks),
  settings: inner(slidersHorizontal),
  menu: inner(list),
  chevron: inner(caretRight),
  ascending: inner(caretUp),
  descending: inner(caretDown),
  close: inner(x),
};

/** The light weight of the icons that are also drawn large. */
const LIGHT = {
  dashboard: inner(squaresFourLight),
  operations: inner(arrowsLeftRightLight),
  resources: inner(databaseLight),
  records: inner(rowsLight),
  lint: inner(listChecksLight),
  settings: inner(slidersHorizontalLight),
};

/** From this size up an icon is drawn in the light weight. */
const LARGE = 32;

/**
 * An icon in the text color: 16px beside a label, larger (and in Phosphor's light weight, thinner) as a page's or
 * a card's mark (`size`).
 * @param {keyof typeof ICONS} name
 * @param {number} [size]
 */
export const icon = (name, size = 16) => html`
  <svg class="icon" viewBox="0 0 256 256" width=${size} height=${size} fill="currentColor" aria-hidden="true">
    ${unsafeSVG((size >= LARGE && LIGHT[name]) || ICONS[name] || "")}
  </svg>
`;
