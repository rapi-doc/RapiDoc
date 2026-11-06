/** @type {import("../types.js").Rule} */
export default {
  name: "info-contact",
  description:
    "info has a contact (name, url or email): the portal shows it in the API page header.",
  default: "off",
  on: ["info"],
  check: (info, { pointer }) =>
    info.contact && typeof info.contact === "object" && Object.keys(info.contact).length
      ? []
      : [{ pointer, message: "info has no contact" }],
};
