import { casingOutliers, walkDocument } from "../walk.js";

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

/** @type {import("../types.js").Rule} */
export default {
  name: "property-casing-consistent",
  description:
    "Schema properties are written one way (camelCase or snake_case, whichever most of them use): a client reads total_amount beside totalAmount as two conventions to remember.",
  default: "off",
  on: ["document"],
  check: (doc) => {
    const names = [];
    walkDocument(doc, (node, pointer, isNameMap) => {
      if (isNameMap || !isObject(node.properties)) return;
      for (const name of Object.keys(node.properties))
        names.push({ name, pointer: [...pointer, "properties", name] });
    });
    return casingOutliers(names, "property");
  },
};
