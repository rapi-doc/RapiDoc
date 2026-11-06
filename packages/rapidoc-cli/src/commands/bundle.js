import fs from "node:fs";
import path from "node:path";
import { loadPortal } from "../lib/engines.js";
import { ProblemError, UsageError } from "../lib/errors.js";
import { error, icon, info, setQuiet, success, warn } from "../lib/output.js";

/*
 * rapidoc bundle <spec>: one file from a spec split over several. By default every $ref to another file
 * becomes a component (#/components/schemas/Order; #/definitions/Order in Swagger 2.0) and in-file $refs
 * stay; --dereference inlines everything instead (and fails on a recursive schema). The result is
 * validated before it's written, unless --no-validate.
 */

const isUrl = (target) => /^https?:\/\//i.test(target);
/** A URL as is; a path relative to the current folder, or absolute when it's outside it. */
function displayPath(location) {
  if (isUrl(location)) return location;
  const relative = path.relative(process.cwd(), location);
  return relative.startsWith("..") ? location : relative || ".";
}

/** The spec of the API `id` in the portal config of the current folder. */
async function specOfApi(id) {
  const portal = await loadPortal("bundle --api");
  let config;
  try {
    ({ config } = await portal.loadConfig(process.cwd()));
  } catch (err) {
    throw new ProblemError(err.message);
  }
  const api = (config.apis ?? []).find((entry) => entry.id === id);
  if (!api) {
    const ids = (config.apis ?? []).map((entry) => entry.id).join(", ") || "none";
    throw new ProblemError(`No API "${id}" in rapidoc.config.* (APIs: ${ids})`);
  }
  const [version] = api.versions;
  return version.isRemote ? version.spec : version.fullPath;
}

export default {
  name: "bundle",
  usage: "bundle <spec>",
  summary: "Joins a spec split over several files into one (other-file $refs become components)",
  description:
    "Loads the spec and every file its $refs reach, and writes one document: a $ref to another file\nbecomes a component with a copy of what it pointed to, in-file $refs stay. --dereference inlines\nevery $ref instead. The result is validated before it's written.",
  positionals: { name: "spec", max: 1 },
  options: {
    output: {
      type: "string",
      short: "o",
      value: "file",
      description: "Write here (.json or .yaml by its extension) instead of stdout",
    },
    format: {
      type: "string",
      value: "format",
      choices: ["yaml", "json"],
      description: "Output format (default: by the output file's extension, else yaml)",
    },
    dereference: {
      type: "boolean",
      description: "Inline every $ref, in-file ones too (fails on a recursive schema)",
    },
    validate: {
      type: "boolean",
      negatable: true,
      default: true,
      description: "Skip checking the result against the OpenAPI Specification before writing it",
    },
    remote: {
      type: "boolean",
      description: "Also fetch remote $refs (left as they are by default)",
    },
    api: {
      type: "string",
      value: "id",
      description: "Bundle the spec of this API from rapidoc.config.* instead of a file",
    },
  },
  examples: [
    "rapidoc bundle openapi.yaml -o dist/openapi.json",
    "rapidoc bundle openapi.yaml --dereference > flat.yaml",
    "rapidoc bundle --api orders -o dist/orders.yaml",
  ],

  async run({ values, positionals }) {
    const [target] = positionals;
    if (target && values.api)
      throw new UsageError("Give a spec or --api <id>, not both", { command: "bundle" });
    if (!target && !values.api)
      throw new UsageError("rapidoc bundle needs a spec: rapidoc bundle <spec>", {
        command: "bundle",
      });
    // Without -o the document goes to stdout: nothing else may.
    if (!values.output) setQuiet(true);

    const { loadFiles, position, SpecSyntaxError } = await import("../validate/bundle.js");
    const { toComponents } = await import("../bundle/components.js");
    const { dereference, CycleError } = await import("../bundle/dereference.js");
    const { formatFor, serialize } = await import("../bundle/write.js");

    let entry = values.api ? await specOfApi(values.api) : target;
    if (!isUrl(entry)) {
      entry = path.resolve(entry);
      if (!fs.existsSync(entry) || !fs.statSync(entry).isFile())
        throw new ProblemError(`File not found: ${entry}`);
    }

    let loaded;
    try {
      loaded = await loadFiles(entry, { remote: values.remote });
    } catch (err) {
      if (err instanceof SpecSyntaxError)
        throw new ProblemError(
          `${displayPath(err.location)}:${err.line}:${err.column}  ${err.message}`,
        );
      throw err;
    }

    let result;
    try {
      result = values.dereference ? dereference(loaded) : toComponents(loaded);
    } catch (err) {
      if (err instanceof CycleError) {
        const { encodePointer } = await import("../validate/bundle.js");
        const chain = err.chain
          .map((link) => `${displayPath(link.location)}${encodePointer(link.pointer)}`)
          .join("\n   → ");
        throw new ProblemError(
          `${err.message}:\n   ${chain}\n   (without --dereference, cycles stay $refs)`,
        );
      }
      throw err;
    }
    if (result.problems.length) {
      error(`${result.problems.length} broken $ref(s):`);
      for (const problem of result.problems) {
        const { line, column } = position(loaded.files.get(problem.location), problem.pointer);
        process.stderr.write(
          `   ${displayPath(problem.location)}:${line}:${column}  ${problem.message}\n`,
        );
      }
      throw new ProblemError("Nothing written: fix the $refs above first.");
    }
    for (const skipped of loaded.skipped)
      warn(`$ref to ${skipped} left as is (remote; use --remote to fetch it)`);

    if (values.validate) {
      const { validate } = await import("@scalar/openapi-validator");
      const { errors = [] } = await validate(result.value, { checkPathParameters: false });
      if (errors.length) {
        error(`The bundle is not valid OpenAPI (${errors.length} error(s)):`);
        for (const problem of errors) {
          const at = Array.isArray(problem.path)
            ? `#/${problem.path.join("/")}`
            : `#${String(problem.path ?? "").replace(/^#/, "")}`;
          process.stderr.write(`   ${at}  ${problem.message}\n`);
        }
        throw new ProblemError(
          "Nothing written. Run rapidoc validate on the source for file:line:col, or pass --no-validate.",
        );
      }
    }

    const format = formatFor(values.format, values.output);
    const text = serialize(result.value, format);
    if (!values.output) {
      process.stdout.write(text);
      return;
    }
    const output = path.resolve(values.output);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, text, "utf8");

    const files = loaded.files.size;
    const size = (Buffer.byteLength(text) / 1024).toFixed(1);
    info(`\n${icon("📦")}Bundled ${displayPath(entry)} → ${displayPath(output)} (${size} KB)`);
    if (values.dereference) {
      info(`   • ${files} file(s) merged, every $ref inlined`);
    } else {
      info(`   • ${files} file(s) merged, ${result.added.length} component(s) added`);
      if (result.inlined)
        info(`   • ${result.inlined} $ref(s) inlined (no component kind for them)`);
    }
    success(`Valid ${format.toUpperCase()}${values.validate ? ", valid OpenAPI" : ""}.\n`, "   ");
  },
};
