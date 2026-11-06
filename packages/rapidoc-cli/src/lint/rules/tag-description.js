/** @type {import("../types.js").Rule} */
export default {
  name: "tag-description",
  description: "Every top-level tag has a description: it introduces the group on the API page.",
  default: "off",
  on: ["tag"],
  check: (tag, { pointer }) =>
    typeof tag.description === "string" && tag.description.trim()
      ? []
      : [{ pointer, message: `Tag "${tag.name}" has no description` }],
};
