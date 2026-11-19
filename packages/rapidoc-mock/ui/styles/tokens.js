/**
 * The Mock UI's design tokens, as the declarations of its custom properties: the surfaces (all mixed from
 * --surface), text and accent colors, the labels', the series' and the methods' colors, type, spacing and shadows.
 * Plain text with no import, so a page outside the app can use the same values: `styles/base.js` puts them on
 * the app's host, and the spec check's build writes them into its page (`sites/rapi-mock/spec-check`).
 */
export const tokens = `
    /*
     * The surfaces: one base, the page, and every other shade mixed from it, so they move together and keep
     * their steps. Darker is further back (the sidebar, a well of raw content such as code), lighter is raised
     * (a card, a row under the pointer). Change --surface, not the shades.
     */
    --surface: #2a2c34;
    --bg: var(--surface);
    --sidebar: color-mix(in oklab, var(--surface), black 15%);
    /* a link of the sidebar under the pointer is lighter, the page you are on darker, with the amber bar */
    --sidebar-hover: color-mix(in oklab, var(--surface), white 3%);
    --sidebar-current: color-mix(in oklab, var(--surface), black 23%);
    --inset: color-mix(in oklab, var(--surface), black 10%);
    /* a panel on the page; opaque, so a sticky cell can use it */
    --card: color-mix(in oklab, var(--surface), white 6%);
    --hover: color-mix(in oklab, var(--surface), white 12%);
    /* a table's heading row: a step under the card it is on, so it reads as a band over the rows */
    --table-head: color-mix(in oklab, var(--surface), white 1%);
    --line: color-mix(in oklab, var(--surface), white 13%);
    --border: color-mix(in oklab, var(--surface), white 16%);
    /* the edge of a pinned column: brighter than any line, so it reads as an edge, not a row's border */
    --key-edge: color-mix(in oklab, var(--surface), white 35%);
    --fg: #c0c4c8;
    --strong: #ffffff;
    --muted: #949ba2;
    --primary: #f6a821;
    --primary-fg: #24262d;
    --accent-text: #f6a821;
    /* the three labels: green, a light red (amber is the accent, so it can't mark a warning), grey */
    --ok: #68cc97;
    --ok-bg: #24463a;
    --warn: #fa82a2;
    --plain: #b4b9c4;
    --error: #f98080;
    /* a warning: orange, apart from the amber of the accent (the place you are, the main action) */
    --warning: #ff8a4c;
    /*
     * Series colors for a chart that splits a whole: the first three of the dataviz categorical palette's dark
     * steps, which tell apart in any pair, also with colorblind eyes, on --card. More parts than three fold into
     * an "Other" in --series-other. A chart's key names every part, so color is never the only label.
     */
    --series-1: #3987e5;
    --series-2: #d95926;
    --series-3: #199e70;
    --series-other: #6b7079;
    /* an HTTP method as colored text: RapiDoc's hues, lightened to 4.5:1 or more on a card */
    --method-get: #8ab4ff;
    --method-post: #7dd8a8;
    --method-put: #f7b03c;
    --method-patch: #c4b5fd;
    --method-delete: #ff9696;
    --method-head: #eab308;
    --method-options: #22d3ee;
    --method-query: #a5b4fc;
    /* a control's border (stronger than a panel's), the main action under the pointer, a field's placeholder */
    --border-strong: #616779;
    --primary-hover: #ffb93a;
    --placeholder: #7b828b;
    /* type: the monospace stack, and the small size of hints, code and counts */
    --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    --small: 12.5px;
    /* spacing: one scale for the room inside and between things; hairlines (1, 2, 3, 6px) are written as is */
    --space-1: 4px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-5: 24px;
    /* shadows: under the header, of a drawer over the page, and at an edge content scrolls under */
    --shadow-bar: 0 1px 6px rgb(0 0 0 / 35%);
    --shadow-drawer: -10px 0 24px rgb(0 0 0 / 45%);
    --shade: rgb(0 0 0 / 40%);
`;
