import { CONTAINERS } from "../../lib/openapi-shape.js";
import { encodePointer } from "../../validate/bundle.js";

/** Every $ref string in a value. */
const refsIn = (value, found = new Set()) => {
  if (Array.isArray(value)) for (const item of value) refsIn(item, found);
  else if (value && typeof value === "object") {
    if (typeof value.$ref === "string") found.add(value.$ref);
    for (const child of Object.values(value)) refsIn(child, found);
  }
  return found;
};

/** @type {import("../types.js").Rule} */
export default {
  name: "no-unused-components",
  description:
    "Every component is referenced somewhere: an unused one is documentation of nothing.",
  default: "warn",
  on: ["document"],
  check: (doc, { v2 }) => {
    const containers = v2
      ? [["definitions"], ["parameters"], ["responses"]]
      : Object.keys(CONTAINERS)
          .filter((key) => key !== "securitySchemes")
          .map((key) => ["components", key]);
    const used = refsIn(doc);
    const findings = [];
    for (const container of containers) {
      let node = doc;
      for (const segment of container) node = node?.[segment];
      if (!node || typeof node !== "object") continue;
      for (const name of Object.keys(node)) {
        const pointer = [...container, name];
        if (!used.has(encodePointer(pointer)))
          findings.push({ pointer, message: `${encodePointer(pointer)} is never referenced` });
      }
    }
    return findings;
  },
};
