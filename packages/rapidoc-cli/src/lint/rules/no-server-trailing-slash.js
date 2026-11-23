/** @type {import("../types.js").Rule} */
export default {
  name: "no-server-trailing-slash",
  description:
    "A server url does not end with a slash: every path starts with one, so the request would have two (https://api.acme.com/v1//orders).",
  default: "warn",
  on: ["server"],
  check: (server, { pointer }) =>
    typeof server.url === "string" && server.url.length > 1 && server.url.endsWith("/")
      ? [{ pointer: [...pointer, "url"], message: `Server "${server.url}" ends with a slash` }]
      : [],
};
