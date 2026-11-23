const VERBS = new Set(["get", "post", "put", "patch", "delete"]);

/** The words of a path segment: `getOrderItems`, `get-order_items` → get, order, items */
const wordsOf = (segment) =>
  segment
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase());

/** @type {import("../types.js").Rule} */
export default {
  name: "no-http-verbs-in-paths",
  description:
    "A path names a thing, not what is done to it (/orders, not /getOrders): the method says that already.",
  default: "off",
  on: ["pathItem"],
  check: (_item, { pointer, path }) => {
    // a webhook's name is not an address
    if (pointer[0] !== "paths") return [];
    const verb = (path ?? "")
      .split("/")
      .filter((segment) => segment && !/^\{.*\}$/.test(segment))
      .flatMap(wordsOf)
      .find((word) => VERBS.has(word));
    return verb ? [{ pointer, message: `${path} has the HTTP verb "${verb}" in it` }] : [];
  },
};
