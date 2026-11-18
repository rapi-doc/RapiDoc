/** The three labels of an operation, as the UI names them. */
export const LABELS = {
  confident: "Confident",
  needsReview: "Needs review",
  plainMock: "Plain mock",
};

/** What each label means, in a sentence. */
export const LABEL_HELP = {
  confident: "Mapped to a resource: it reads or changes stored records.",
  needsReview: "Mapped to a resource, with something assumed. The reason is shown.",
  plainMock: "Keeps no state: answered from the spec's examples or generated data.",
};
