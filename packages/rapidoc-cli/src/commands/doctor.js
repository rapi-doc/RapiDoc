import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pkg from "../../package.json" with { type: "json" };
import { tryLoadPortal } from "../lib/engines.js";
import { ProblemError } from "../lib/errors.js";
import { icon, info, setQuiet } from "../lib/output.js";

/*
 * rapidoc doctor [dir]: what a bug report needs and what usually goes wrong. Node against the CLI's
 * engines; each package the CLI uses (installed version against the CLI's range; optional ones may be
 * missing); the portal config in dir (does it load?); the rapidoc browser bundle (is it built?).
 * Exit 1 when something is wrong (too old a Node, a version outside the range, a config that doesn't
 * load, a missing bundle); a missing optional package is only reported.
 */

const parse = (version) => {
  const match = String(version).match(/(\d+)\.(\d+)\.(\d+)/);
  return match ? match.slice(1, 4).map(Number) : null;
};
const compare = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

/** `version` satisfies `range` (`^x.y.z`, `>=x.y.z`, `x.y.z` or `*`; the forms package.json files here use). */
export function satisfies(version, range) {
  const v = parse(version);
  if (!v) return false;
  if (range === "*" || range === "latest") return true;
  const min = parse(range);
  if (!min) return true;
  if (range.startsWith(">=")) return compare(v, min) >= 0;
  if (range.startsWith("^")) {
    if (compare(v, min) < 0) return false;
    if (min[0] > 0) return v[0] === min[0];
    if (min[1] > 0) return v[0] === 0 && v[1] === min[1];
    return v[0] === 0 && v[1] === 0 && v[2] === min[2];
  }
  return compare(v, min) === 0;
}

/** An installed package's package.json (found from its entry point, as the CLI imports it), or null. */
function installed(name) {
  let file;
  try {
    file = fileURLToPath(import.meta.resolve(name));
  } catch {
    return null;
  }
  for (let dir = path.dirname(file); dir !== path.dirname(dir); dir = path.dirname(dir)) {
    const manifest = path.join(dir, "package.json");
    if (fs.existsSync(manifest)) {
      const json = JSON.parse(fs.readFileSync(manifest, "utf8"));
      if (json.name === name) return { version: json.version, dir };
    }
  }
  return null;
}

const PURPOSE = {
  "@rapidoc/portal": "dev, build, migrate, validate of a portal",
  "@rapidoc/server": "serve",
  "@rapidoc/mock": "mock",
  "@modelcontextprotocol/sdk": "mcp serve",
  "@rapidoc/mcp": "mcp",
  rapidoc: "preview, the portal's API pages",
  "@scalar/openapi-validator": "validate",
  "create-rapidoc": "init",
  "@clack/prompts": "questions in a terminal",
};

function checks(dir) {
  const items = [];
  const add = (group, name, status, detail) => items.push({ group, name, status, detail });

  const node = process.versions.node;
  const engines = pkg.engines?.node ?? ">=22.12.0";
  add("runtime", "node", satisfies(node, engines) ? "ok" : "error", `${node} (needs ${engines})`);
  add("runtime", "@rapidoc/cli", "ok", pkg.version);

  const wanted = [
    ...Object.entries(pkg.dependencies ?? {}).map(([name, range]) => ({
      name,
      range,
      optional: false,
    })),
    ...Object.entries(pkg.peerDependencies ?? {}).map(([name, range]) => ({
      name,
      range,
      optional: Boolean(pkg.peerDependenciesMeta?.[name]?.optional),
    })),
  ];
  for (const { name, range, optional } of wanted) {
    const found = installed(name);
    const used = PURPOSE[name] ? `; for ${PURPOSE[name]}` : "";
    if (!found)
      add(
        "packages",
        name,
        optional ? "missing" : "error",
        `not installed (wants ${range}${used})`,
      );
    else if (!satisfies(found.version, range))
      add("packages", name, "error", `${found.version}, outside ${range}${used}`);
    else add("packages", name, "ok", `${found.version}${used}`);
  }

  const bundle = installed("rapidoc");
  if (bundle) {
    const file = path.join(bundle.dir, "dist/rapidoc-min.js");
    add(
      "files",
      "rapidoc bundle",
      fs.existsSync(file) ? "ok" : "error",
      fs.existsSync(file)
        ? path.relative(process.cwd(), file)
        : `${file} missing (npm run build:rapidoc)`,
    );
  }

  const config = fs.existsSync(dir)
    ? fs.readdirSync(dir).find((name) => /^rapidoc\.config\.(ya?ml|json|m?js|ts)$/.test(name))
    : undefined;
  return { items, config };
}

export default {
  name: "doctor",
  usage: "doctor [dir]",
  summary: "Checks the setup: Node, package versions, the portal config, the browser bundle",
  description:
    "Prints what a bug report needs. Fails (exit 1) on too old a Node, a package version outside the\nCLI's range, a portal config that doesn't load, or a missing rapidoc bundle; a missing optional\npackage is only noted (it's needed by the commands listed next to it).",
  positionals: { name: "dir", max: 1 },
  options: {
    format: {
      type: "string",
      value: "format",
      choices: ["pretty", "json"],
      default: "pretty",
      description: "json for bug reports and scripts",
    },
  },
  examples: ["rapidoc doctor", "rapidoc doctor ./my-portal --format json"],

  async run({ values, positionals }) {
    const dir = path.resolve(positionals[0] || ".");
    if (values.format === "json") setQuiet(true);
    const { items, config } = checks(dir);

    if (config) {
      const portal = await tryLoadPortal();
      if (!portal) {
        items.push({
          group: "portal",
          name: config,
          status: "missing",
          detail: "found; @rapidoc/portal isn't installed to load it",
        });
      } else {
        try {
          const { config: loaded } = await portal.loadConfig(dir);
          const apis = loaded.apis?.length ?? 0;
          items.push({
            group: "portal",
            name: config,
            status: "ok",
            detail: `loads; ${apis} API(s)`,
          });
        } catch (err) {
          items.push({
            group: "portal",
            name: config,
            status: "error",
            detail: err.message.split("\n")[0],
          });
        }
      }
    } else {
      items.push({
        group: "portal",
        name: "rapidoc.config.*",
        status: "missing",
        detail: `none in ${dir}`,
      });
    }

    const errors = items.filter((item) => item.status === "error");
    if (values.format === "json") {
      const report = {
        ok: errors.length === 0,
        platform: `${process.platform} ${process.arch}`,
        cwd: process.cwd(),
        items,
      };
      process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
      if (errors.length) process.exitCode = 1;
      return;
    }

    const mark = {
      ok: icon("✅", "ok      "),
      missing: icon("➖", "missing "),
      error: icon("❌", "error   "),
    };
    const width = Math.max(...items.map((item) => item.name.length)) + 2;
    let group;
    info(`\n${icon("🩺")}rapidoc doctor (${process.platform} ${process.arch})`);
    for (const item of items) {
      if (item.group !== group)
        info(`\n${(group = item.group)[0].toUpperCase()}${group.slice(1)}:`);
      info(`   ${mark[item.status]}${item.name.padEnd(width)}${item.detail}`);
    }
    info("");
    if (errors.length) throw new ProblemError(`${errors.length} problem(s): see above.`);
  },
};
