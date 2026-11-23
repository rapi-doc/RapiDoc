/** @type {import("../types.js").Rule} */
export default {
  name: "path-not-include-query",
  description:
    "A path has no query string (/orders?open=true): a query value is a parameter with `in: query`, and a path with one never matches a request.",
  default: "error",
  on: ["pathItem"],
  check: (_item, { pointer, path }) =>
    pointer[0] === "paths" && path && path.includes("?")
      ? [{ pointer, message: `${path} has a query string; make it a query parameter` }]
      : [],
};
