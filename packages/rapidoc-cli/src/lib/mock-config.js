import fs from "node:fs";
import path from "node:path";
import { ProblemError } from "./errors.js";

/*
 * mock.config.yaml: the user's corrections to what the stateful mock works out from a spec. `rapidoc mock
 * --stateful` applies it and `rapidoc lint --stateful` reads it, so lint doesn't report what it settles. This
 * file only finds and parses it; what it means is @rapidoc/mock's business.
 */

const NAMES = ["mock.config.yaml", "mock.config.yml"];

/**
 * The file named, else the first mock.config.yaml (or .yml) in `dirs`.
 * @param {{ file?: string, dirs?: (string | null | undefined)[] }} where
 * @returns {Promise<{ file: string, config: object } | undefined>} `file` is the full path
 * @throws {ProblemError} when the named file is missing, or the file is not YAML
 */
export async function readMockConfig({ file, dirs = [] }) {
  const candidates = file
    ? [path.resolve(file)]
    : [...new Set(dirs.filter(Boolean))].flatMap((dir) =>
        NAMES.map((name) => path.join(dir, name)),
      );
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) {
    if (file) throw new ProblemError(`Not found: ${candidates[0]}`);
    return undefined;
  }
  const { parse } = await import("yaml");
  try {
    return { file: found, config: parse(fs.readFileSync(found, "utf8")) ?? {} };
  } catch (err) {
    throw new ProblemError(`${path.relative(process.cwd(), found)}: ${err.message.split("\n")[0]}`);
  }
}
