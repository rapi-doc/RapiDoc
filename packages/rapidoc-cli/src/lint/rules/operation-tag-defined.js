/** @type {import("../types.js").Rule} */
export default {
  name: "operation-tag-defined",
  description:
    "Tags used by operations are declared in the top-level tags list: that is where the sidebar group's description and order come from.",
  default: "warn",
  on: ["operation"],
  check: (op, { pointer, doc }) => {
    if (!Array.isArray(op.tags)) return [];
    const declared = new Set((Array.isArray(doc.tags) ? doc.tags : []).map((tag) => tag?.name));
    return op.tags
      .map((tag, i) =>
        declared.has(tag)
          ? null
          : {
              pointer: [...pointer, "tags", String(i)],
              message: `Tag "${tag}" is not in the top-level tags list`,
            },
      )
      .filter(Boolean);
  },
};
