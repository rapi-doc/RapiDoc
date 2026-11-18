import { namedExampleMap } from "../examples.js";

/** @type {import("../types.js").Rule} */
export default {
  name: "example-named-map",
  description:
    "A media type's example is the value itself, not a map of named examples (those go under examples): Try and the mock server would send the map, name included.",
  default: "warn",
  on: ["mediaType"],
  check: (media, { pointer, resolve }) => {
    const named = namedExampleMap(media, resolve);
    if (!named) return [];
    return [
      {
        pointer: [...pointer, "example"],
        message: `example is a map of named examples ("${named.name}"): move it under examples, as "${named.name}": { value: ... }`,
      },
    ];
  },
};
