const hasExample = (node) =>
  node !== null &&
  typeof node === "object" &&
  (node.example !== undefined ||
    (node.examples !== null &&
      typeof node.examples === "object" &&
      Object.keys(node.examples).length > 0) ||
    node.default !== undefined);

/** @type {import("../types.js").Rule} */
export default {
  name: "media-example",
  description:
    "Request and response bodies have an example (on the media type or its schema): Try fills the request with it and the mock server answers with it.",
  default: "warn",
  on: ["mediaType"],
  check: (media, { pointer, parents, resolve }) => {
    const parent = parents.at(-1);
    if (parent !== "requestBody" && parent !== "response") return [];
    if (hasExample(media)) return [];
    const schema = resolve(media.schema);
    if (hasExample(schema)) return [];
    // A schema whose properties all carry examples is enough: a sample is built from them.
    if (schema && typeof schema === "object" && schema.properties) {
      const props = Object.values(schema.properties).map(resolve);
      if (props.length && props.every(hasExample)) return [];
    }
    return [
      {
        pointer,
        message: `${pointer.at(-1)} ${parent === "response" ? "response" : "request body"} has no example`,
      },
    ];
  },
};
