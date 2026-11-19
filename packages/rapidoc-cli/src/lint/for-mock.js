import path from "node:path";
import { decodePointer } from "../validate/bundle.js";
import { readLintConfig, severitiesFor } from "./config.js";
import { lintSpec } from "./run.js";

/*
 * Lint for the mock server: what `rapidoc lint --stateful` finds in one of the APIs `rapidoc mock --stateful`
 * serves, as the data the mock answers `/__mock/lint/<api id>` with and the Mock UI shows (its Lint section).
 * `commands/mock.js` hands this to the mock as a function, so the mock runs it only when someone asks.
 */

const segmentsOf = (pointer) =>
  Array.isArray(pointer)
    ? pointer.map(String)
    : typeof pointer === "string" && pointer
      ? decodePointer(pointer.startsWith("#") ? pointer : `#${pointer}`)
      : [];

/**
 * @param {{ id: string, fullPath: string }} api - The API, as the mock serves it
 * @param {object} [options]
 * @param {string[]} [options.apiIds] - The ids of every API served (mock.config.yaml's `apis:` names them)
 * @param {object} [options.mockConfig] - The parsed mock.config.yaml: what it states is not reported
 * @param {string} [options.folder] - The portal folder being mocked: the `lint:` section of its config applies
 * @returns {Promise<{ linted: boolean, problems: object[], summary?: object }>} `problems`:
 *   `{ severity, rule, message, pointer: string[], line, file? }` in file order (`file` only for a problem in
 *   another file than the spec's own); `summary`: as `summarize` of `./summary.js` returns it, absent when the
 *   spec is not valid OpenAPI (`linted` is false and the problems are the validator's)
 */
export async function lintForMock(api, { apiIds = [api.id], mockConfig, folder } = {}) {
  const { config } = folder ? await readLintConfig(folder) : { config: {} };
  const result = await lintSpec(api.fullPath, {
    severities: severitiesFor({ stateful: true, config, api: api.id }),
    mockConfig: mockConfig && { config: mockConfig, apiId: api.id, apiIds },
    summary: true,
  });
  const own = path.resolve(api.fullPath);
  return {
    linted: result.linted,
    problems: result.problems.map((one) => ({
      severity: one.severity === "error" ? "error" : "warning",
      rule: one.rule || "openapi",
      message: one.message,
      pointer: segmentsOf(one.pointer),
      line: one.line ?? 1,
      ...(one.location && path.resolve(one.location) !== own
        ? { file: path.relative(path.dirname(own), one.location) }
        : {}),
    })),
    ...(result.summary ? { summary: result.summary } : {}),
  };
}
