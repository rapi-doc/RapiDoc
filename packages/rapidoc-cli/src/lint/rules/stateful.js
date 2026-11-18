/*
 * The rules of `rapidoc lint --stateful`: what the stateful mock (`rapidoc mock --stateful`) had to assume about
 * the spec, or could not map. The findings are the mock's own (`statefulFindings` of @rapidoc/mock, from its
 * classifier), so lint and the mock never disagree; each rule here is one group of them. All are off by default:
 * `--stateful` turns on the ones the spec's author can act on, and `--rule` or the config sets each by name.
 * They read the user's corrections in mock.config.yaml (`context.mockConfig`, this API's section).
 * Unlike the other rules, these share one file: they differ only in name and description.
 */

/** name, whether --stateful turns it on, description */
const GROUPS = [
  [
    "stateful-resource-key",
    true,
    "Every resource of the stateful mock has a key the spec shows: a path parameter that matches a field (/pets/{petId} and id). Without one, reads, updates and deletes of one record keep no state.",
  ],
  [
    "stateful-list-filter",
    true,
    "Query parameters of a list match a field of what it returns, or are paging and sorting: the stateful mock ignores the others when listing.",
  ],
  [
    "stateful-write-unmapped",
    true,
    "Every PUT, PATCH and DELETE fits a resource of the stateful mock: one that fits none is answered without changing stored data.",
  ],
  [
    "stateful-reference-target",
    true,
    "A field that looks like a reference (owner_id) names a resource the spec has: otherwise the stateful mock fills it with generated values.",
  ],
  [
    "stateful-response-unnamed",
    true,
    "The records of a collection are described by a named schema (components.schemas): the stateful mock knows a record by its schema's name, and keeps no state for an inline one.",
  ],
  [
    "stateful-operation-assumed",
    true,
    "The stateful mock had to assume nothing about what an operation does (a GET that returns another schema, a POST on an item path).",
  ],
  [
    "stateful-relation-assumed",
    false,
    "Links between resources are matched by the plain name of the field (ownerId to Owner): reports the ones the stateful mock matched another way. Not turned on by --stateful.",
  ],
];

/** @type {import("../types.js").Rule[]} */
export default GROUPS.map(([name, withStateful, description]) => ({
  name,
  description: `${description} Needs @rapidoc/mock.`,
  default: "off",
  needs: "mock",
  withStateful,
  on: ["document"],
  check: (doc, { v2, mock, mockConfig }) =>
    v2 || !mock?.statefulFindings
      ? []
      : mock
          // with the user's corrections (mock.config.yaml): what they state is no longer a finding
          .statefulFindings(doc, mockConfig)
          .filter((finding) => finding.rule === name)
          .map(({ pointer, message }) => ({ pointer, message })),
}));
