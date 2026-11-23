/*
 * `@rapidoc/mock/internal`: what `rapidoc lint` takes from the mock, so its rules read a spec the way the
 * mock does (the example check, the stateful mode's review notes, `mock.config.yaml`).
 *
 * NOT part of the package's public API and not covered by semver: these can change or go in any release.
 * Only @rapidoc/cli of the same version imports them. The public API is ./index.js.
 */

export { exampleError } from "./examples.js";
export { configFor } from "./stateful/config.js";
export { statefulFindings, statefulReport } from "./stateful/findings.js";
