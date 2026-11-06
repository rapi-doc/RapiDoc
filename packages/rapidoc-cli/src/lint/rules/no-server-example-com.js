const PLACEHOLDER = /^(.*\.)?example\.(com|org|net)$|^localhost$|^127\.0\.0\.1$/i;

const hostOf = (url) => {
  try {
    return new URL(String(url).replace(/\{[^}]*\}/g, "x")).hostname;
  } catch {
    return undefined;
  }
};

/** @type {import("../types.js").Rule} */
export default {
  name: "no-server-example-com",
  description: "Servers are real addresses, not example.com or localhost: Try would call nowhere.",
  default: "warn",
  on: ["server", "document"],
  check: (node, { pointer, v2, parents }) => {
    if (parents.length === 0) {
      // the document: Swagger 2.0 keeps the host on the root
      if (!v2 || typeof node.host !== "string") return [];
      return PLACEHOLDER.test(node.host.split(":")[0])
        ? [{ pointer: ["host"], message: `host "${node.host}" is a placeholder` }]
        : [];
    }
    const host = hostOf(node.url);
    return host && PLACEHOLDER.test(host)
      ? [{ pointer: [...pointer, "url"], message: `Server "${node.url}" is a placeholder` }]
      : [];
  },
};
