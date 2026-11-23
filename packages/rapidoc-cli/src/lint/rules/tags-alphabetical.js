/** @type {import("../types.js").Rule} */
export default {
  name: "tags-alphabetical",
  description:
    "Tags are listed in alphabetical order: the sidebar shows them as written (unless sort-tags is on).",
  default: "off",
  on: ["document"],
  check: (doc) => {
    const names = (Array.isArray(doc.tags) ? doc.tags : []).map((tag) => tag?.name);
    for (let i = 1; i < names.length; i++) {
      if (typeof names[i] !== "string" || typeof names[i - 1] !== "string") continue;
      if (names[i - 1].localeCompare(names[i], "en", { sensitivity: "base" }) > 0)
        return [
          {
            pointer: ["tags", String(i)],
            message: `Tag "${names[i]}" comes after "${names[i - 1]}"`,
          },
        ];
    }
    return [];
  },
};
