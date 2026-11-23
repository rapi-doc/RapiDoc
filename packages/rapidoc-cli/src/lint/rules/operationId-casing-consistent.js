import { casingOutliers } from "../walk.js";

/** @type {import("../types.js").Rule} */
export default {
  name: "operationId-casing-consistent",
  description:
    "operationIds are written one way (camelCase or snake_case, whichever most of them use): they become method names in generated clients and tool names for AI agents.",
  default: "off",
  on: ["document"],
  check: (_doc, { operations }) =>
    casingOutliers(
      operations
        .filter((operation) => typeof operation.node.operationId === "string")
        .map((operation) => ({
          name: operation.node.operationId,
          pointer: [...operation.pointer, "operationId"],
        })),
      "operationId",
    ),
};
