import { casingOutliers } from "../walk.js";

/** @type {import("../types.js").Rule} */
export default {
  name: "parameter-casing-consistent",
  description:
    "Query and path parameters are written one way (camelCase or snake_case, whichever most of them use). Headers are left out: they have a convention of their own.",
  default: "off",
  on: ["document"],
  check: (doc, { operations, resolve, v2 }) => {
    const names = [];
    const seen = new Set();
    const add = (listed, pointer) => {
      const parameter = resolve(listed);
      if (!parameter || typeof parameter.name !== "string") return;
      if (parameter.in !== "query" && parameter.in !== "path") return;
      // a shared parameter is reported once, where it is written
      if (seen.has(parameter)) return;
      seen.add(parameter);
      names.push({ name: parameter.name, pointer });
    };
    const shared = v2 ? doc.parameters : doc.components?.parameters;
    for (const [name, parameter] of Object.entries(shared ?? {}))
      add(parameter, v2 ? ["parameters", name] : ["components", "parameters", name]);
    for (const [path, item] of Object.entries(doc.paths ?? {}))
      (Array.isArray(item?.parameters) ? item.parameters : []).forEach((parameter, i) =>
        add(parameter, ["paths", path, "parameters", String(i)]),
      );
    for (const operation of operations)
      (Array.isArray(operation.node.parameters) ? operation.node.parameters : []).forEach(
        (parameter, i) => add(parameter, [...operation.pointer, "parameters", String(i)]),
      );
    return casingOutliers(names, "parameter");
  },
};
