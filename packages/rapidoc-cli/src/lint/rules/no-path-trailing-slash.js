/** @type {import("../types.js").Rule} */
export default {
  name: "no-path-trailing-slash",
  description:
    "A path does not end with a slash (/orders, not /orders/): servers and proxies disagree on whether the two are the same address.",
  default: "warn",
  on: ["pathItem"],
  check: (_item, { pointer, path }) =>
    pointer[0] === "paths" && path && path.length > 1 && path.endsWith("/")
      ? [{ pointer, message: `${path} ends with a slash` }]
      : [],
};
