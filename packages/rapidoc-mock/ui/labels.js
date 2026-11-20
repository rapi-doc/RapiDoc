import { html } from "lit";
import { plain } from "./format.js";

/**
 * The three labels of an operation, as the UI names them. The keys are the control API's (`labels` and an
 * operation's `label` in `/__mock/model`); the names are what a person reads, here, in the `rapidoc mock`
 * start-up line and in the documentation: change them together.
 */
export const LABELS = {
  confident: "Stateful",
  needsReview: "Needs review",
  plainMock: "Static",
};

/** Each label's color, as its badge and its part of a bar draw it. */
export const LABEL_COLORS = {
  confident: "var(--ok)",
  needsReview: "var(--warn)",
  plainMock: "var(--plain)",
};

/** What each label means, in a line: on hover over a badge or a filter. */
export const LABEL_HELP = {
  confident: "Reads and changes stored records; nothing was assumed.",
  needsReview: "Reads and changes stored records, with a best guess where the spec left a gap.",
  plainMock: "Keeps no data; returns the same example or generated answer every time.",
};

/** What each label means, in full: where the labels are introduced (the Dashboard's card). */
export const LABEL_ABOUT = {
  confident:
    "Reads and changes stored records. The spec says clearly which resource this operation works on, so what you create shows up in later calls.",
  needsReview: html`Reads and changes stored records too, but the spec left a gap and Rapi Mock filled it
    with a best guess, such as which field is the key. Check each guess, and correct it in
    <code>mock.config.yaml</code> if it's wrong.`,
  plainMock:
    "Keeps no data. No resource fits this operation, so it returns the spec's example, or generated data, the same on every call. Nothing you send is stored.",
};

/**
 * Why an operation is labelled Needs review when the assumption is about its resource (a key, a path), not
 * about the operation: one wording, wherever it is shown. The mock gives the note itself ("no key field found
 * for {id}", `review` of the resource in `/__mock/model`); this says whose it is.
 */
export const resourceReason = (review) => `for its resource: ${review}`;

/** A label as a badge; its meaning (or `title`, the reason in this case) shows on hover. */
export const badge = (label, title = LABEL_HELP[label]) =>
  html`<span class="badge ${label}" title=${plain(title)}>${LABELS[label]}</span>`;

/**
 * The mark of one thing the mock assumed (a parameter, a field): a dot in the Needs review color and the word,
 * with what was assumed on hover. A row's left edge is not used: that marks the row you are on.
 */
export const reviewTag = (what) =>
  html`<span class="tag review-tag" title="Needs review: ${plain(what)}"><span class="dot"></span>review</span>`;

/**
 * The same mark as a dot alone, for a row of a table whose Needs review column says the word and what was
 * assumed: it lets the eye find the rows down the first column. A screen reader reads what it stands for.
 */
export const reviewDot = (what) =>
  html`<span class="review-mark" role="img" aria-label="Needs review" title="Needs review: ${plain(what)}"></span>`;

/** An HTTP method as a badge, in RapiDoc's color for it (`.method.get`, …): its name is always written. */
export const method = (name) =>
  html`<span class="method ${String(name).toLowerCase()}">${String(name).toUpperCase()}</span>`;
