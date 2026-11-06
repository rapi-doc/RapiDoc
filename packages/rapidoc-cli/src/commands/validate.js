import fs from "node:fs";
import path from "node:path";
import { loadPortal, tryLoadPortal } from "../lib/engines.js";
import { ProblemError } from "../lib/errors.js";
import { error, icon, info, success, warn } from "../lib/output.js";

/**
 * Validates one spec against the OpenAPI schema and, when the portal engine is installed, prints its link
 * warnings (see checkApiSpec). Returns false when the spec has errors.
 */
async function validateSpec(id, fullPath, portal) {
  info(`\n${icon("🔍")}${id}: ${fullPath}`);
  // Imported here, not at the top: every command's metadata is loaded for help, only validate needs the parser.
  const { load, validate } = await import("@scalar/openapi-parser");
  const { readFiles } = await import("@scalar/openapi-parser/plugins/read-files");
  // Loading from the file (not its text) lets relative $refs to other files resolve.
  const { filesystem } = await load(fullPath, { plugins: [readFiles()] });
  const result = await validate(filesystem);
  if (!result.valid) {
    error("Specification has validation errors:", "   ");
    for (const problem of result.errors || [])
      process.stderr.write(
        `      ${problem.message}${problem.path ? `  (at ${problem.path})` : ""}\n`,
      );
    return false;
  }
  success("Specification is valid OpenAPI!", "   ");
  for (const warning of portal?.checkApiSpec({ id, fullPath }) ?? []) warn(warning, "   ");
  return true;
}

export default {
  name: "validate",
  usage: "validate [spec|dir]",
  summary:
    "Validates one OpenAPI 3.0 / 3.1 spec, or every spec in a portal's apis: (default: current folder)",
  description:
    "A folder checks every local spec and workflow file of the portal there; remote specs are skipped.",
  positionals: { name: "spec|dir", max: 1 },
  options: {},
  examples: ["rapidoc validate", "rapidoc validate ./specs/orders-api.yaml"],

  async run({ positionals }) {
    const target = path.resolve(positionals[0] || ".");
    if (!fs.existsSync(target)) throw new ProblemError(`File not found: ${target}`);

    if (fs.statSync(target).isFile()) {
      info(`\nValidating OpenAPI specification...`);
      const valid = await validateSpec(path.basename(target), target, await tryLoadPortal());
      info("");
      if (!valid) throw new ProblemError("The specification has errors.");
      return;
    }

    const portal = await loadPortal("validate");
    let config;
    try {
      ({ config } = await portal.loadConfig(target));
    } catch (err) {
      throw new ProblemError(err.message);
    }

    info(`\nValidating the specs in ${target}...`);
    let failed = 0;
    const versions = (config.apis || []).flatMap((api) =>
      api.versions.map((version) => ({
        ...version,
        id: api.versioned ? `${api.id} ${version.version}` : api.id,
      })),
    );
    for (const version of versions) {
      if (version.isRemote) {
        info(`\n${icon("⏭️ ")}${version.id}: ${version.spec} (remote, skipped)`);
      } else if (!(await validateSpec(version.id, version.fullPath, portal))) {
        failed += 1;
      }
    }
    for (const workflow of config.workflows || []) {
      info(`\n${icon("🔍")}${workflow.id}: ${workflow.fullPath}`);
      const warnings = portal.checkWorkflow(workflow, config.apis);
      if (!warnings.length) success("Workflows resolve against the portal's APIs", "   ");
      for (const warning of warnings) warn(warning, "   ");
    }
    const total = versions.length;
    if (failed) throw new ProblemError(`${failed} of ${total} specs have errors.`);
    success(`${total} specs checked, no errors.\n`, "\n");
  },
};
