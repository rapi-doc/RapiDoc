/** @type {import("../types.js").Rule} */
export default {
  name: "no-empty-servers",
  description:
    "The spec says where the API is (servers with a url; host in Swagger 2.0): without it Try, an exported MCP server and a generated client have nowhere to send a request.",
  default: "warn",
  on: ["document"],
  check: (doc, { v2 }) => {
    if (v2)
      return typeof doc.host === "string" && doc.host
        ? []
        : [{ pointer: [], message: "The spec has no host" }];
    if (!Array.isArray(doc.servers) || doc.servers.length === 0)
      return [{ pointer: [], message: "The spec has no servers" }];
    return doc.servers.flatMap((server, i) =>
      typeof server?.url === "string" && server.url
        ? []
        : [{ pointer: ["servers", String(i)], message: `Server ${i + 1} has no url` }],
    );
  },
};
