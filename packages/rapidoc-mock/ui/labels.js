import { html } from "lit";

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

/** What each label means, in a sentence. */
export const LABEL_HELP = {
  confident: "Mapped to a resource: it reads or changes stored records.",
  needsReview: "Mapped to a resource, with something assumed. The reason is shown.",
  plainMock: "Keeps no state: answered from the spec's examples or generated data.",
};

/** A label as a badge; its meaning shows on hover. */
export const badge = (label) =>
  html`<span class="badge ${label}" title=${LABEL_HELP[label]}>${LABELS[label]}</span>`;
