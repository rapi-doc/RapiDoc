/** @type {import("../types.js").Rule} */
export default {
  name: "info-license",
  description: "info has a license: the portal shows it in the API page header.",
  default: "off",
  on: ["info"],
  check: (info, { pointer }) =>
    info.license && typeof info.license === "object" && info.license.name
      ? []
      : [{ pointer, message: "info has no license" }],
};
