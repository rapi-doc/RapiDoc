const KEBAB = /^[a-z0-9.]+(-[a-z0-9.]+)*$/;

/** @type {import("../types.js").Rule} */
export default {
  name: "path-kebab-case",
  description:
    "Path segments other than parameters are kebab-case (/order-items, not /orderItems).",
  default: "off",
  on: ["pathItem"],
  check: (_item, { pointer, path }) => {
    const bad = (path ?? "")
      .split("/")
      .filter((segment) => segment && !/^\{.*\}$/.test(segment) && !KEBAB.test(segment));
    return bad.length ? [{ pointer, message: `${path}: "${bad[0]}" is not kebab-case` }] : [];
  },
};
