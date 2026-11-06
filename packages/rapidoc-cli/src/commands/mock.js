import fs from "node:fs";
import path from "node:path";
import { loadMock, loadPortal } from "../lib/engines.js";
import { ProblemError, UsageError } from "../lib/errors.js";
import { icon, info, warn } from "../lib/output.js";
import { startOnFreePort } from "../lib/ports.js";

// The portal's config file names (CONFIG_CANDIDATES in @rapidoc/portal), checked without loading the portal engine.
export const hasPortalConfig = (dir) =>
  fs.readdirSync(dir).some((name) => /^rapidoc\.config\.(ya?ml|json|m?js|ts)$/.test(name));

const slug = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "api";

/**
 * Mock ids for spec files: the file name without its extension (`specs/orders-api.yaml` → `orders-api`). Files that
 * would share an id get their parent folders in front until they differ (`billing-v2/openapi.yaml` →
 * `billing-v2-openapi`); the same input always gives the same ids.
 */
export function mockApisFromFiles(files) {
  const fullPaths = [...new Set(files.map((file) => path.resolve(file)))];
  const segments = fullPaths.map((fullPath) => {
    const parts = fullPath.split(path.sep).filter(Boolean);
    parts[parts.length - 1] = parts.at(-1).replace(/\.(ya?ml|json)$/i, "");
    return parts;
  });
  const idOf = (parts, depth) => slug(parts.slice(-depth).join("-"));
  const ids = segments.map((parts) => idOf(parts, 1));
  const groups = new Map();
  ids.forEach((id, i) => groups.set(id, [...(groups.get(id) || []), i]));
  for (const indices of groups.values()) {
    if (indices.length < 2) continue;
    const longest = Math.max(...indices.map((i) => segments[i].length));
    let depth = 2;
    while (
      depth < longest &&
      new Set(indices.map((i) => idOf(segments[i], depth))).size < indices.length
    )
      depth++;
    for (const i of indices) ids[i] = idOf(segments[i], depth);
  }
  const used = new Set();
  return fullPaths.map((fullPath, i) => {
    let id = ids[i];
    for (let n = 2; used.has(id); n++) id = `${ids[i]}-${n}`;
    used.add(id);
    return { id, fullPath };
  });
}

/** The local specs in a portal's apis:, every version: the default under /<id>, the others under /<id>/<version>. */
async function apisFromPortal(folder) {
  const portal = await loadPortal("mock");
  let config;
  try {
    ({ config } = await portal.loadConfig(folder));
  } catch (err) {
    throw new ProblemError(err.message);
  }
  const apis = [];
  for (const api of config.apis || []) {
    // The other versions go first: the mock server tries the APIs in order, and /<id>/* would also take
    // /<id>/<version>/... requests.
    for (const version of [...api.versions.slice(1), api.versions[0]]) {
      const id = version.isDefault ? api.id : `${api.id}/${version.version}`;
      if (version.isRemote) info(`${icon("⏭️ ")}${id}: ${version.spec} (remote, not mocked)`);
      else apis.push({ id, title: api.title, fullPath: version.fullPath });
    }
  }
  if (!apis.length) throw new ProblemError(`${folder} has no local specs under apis: to mock.`);
  return apis;
}

export default {
  name: "mock",
  usage: "mock [dir|spec...]",
  summary: "Mock server for a portal's APIs, a folder of specs or spec files, each under /<api id>",
  description:
    "A portal folder mocks the local specs in its apis:. A folder without rapidoc.config.yaml is mocked\nfile by file (orders-api.yaml under /orders-api), as are spec files given by name.",
  positionals: { name: "dir|spec", max: Infinity },
  options: {
    port: {
      type: "string",
      kind: "port",
      value: "number",
      description: "Port to listen on (default 4010)",
    },
    host: { type: "string", value: "host", description: "Address to listen on (default 0.0.0.0)" },
    issuer: {
      type: "string",
      value: "url",
      description: "OpenID Connect issuer whose tokens are accepted (default $RAPIDOC_MOCK_ISSUER)",
    },
    audience: {
      type: "string",
      value: "id",
      description: "Audience tokens must be issued for (default $RAPIDOC_MOCK_AUDIENCE)",
    },
    seed: {
      type: "string",
      kind: "int",
      value: "number",
      description: "Seed for generated data (default 1)",
    },
  },
  examples: [
    "rapidoc mock",
    "rapidoc mock ./specs --port 4011",
    "rapidoc mock orders-api.yaml billing-api.yaml",
    "rapidoc mock --issuer https://example.us.auth0.com/ --audience https://api.example.com",
  ],

  async run({ values, positionals }) {
    const targets = positionals.map((target) => path.resolve(target));
    if (!targets.length) targets.push(process.cwd());
    for (const target of targets) {
      if (!fs.existsSync(target)) throw new ProblemError(`Not found: ${target}`);
    }

    let apis;
    const folder =
      targets.length === 1 && fs.statSync(targets[0]).isDirectory() ? targets[0] : null;
    if (folder && hasPortalConfig(folder)) {
      apis = await apisFromPortal(folder);
    } else if (folder) {
      const { findOpenApiSpecs } = await import("create-rapidoc/scaffold");
      const files = findOpenApiSpecs(folder).map((file) => path.join(folder, file));
      if (!files.length)
        throw new ProblemError(
          `${folder} has no rapidoc.config.yaml and no OpenAPI files to mock.`,
        );
      info(
        `\n${icon("📂")}No rapidoc.config.yaml in ${folder}: mocking the ${files.length} OpenAPI file(s) found there.`,
      );
      apis = mockApisFromFiles(files);
    } else {
      const dirs = targets.filter((target) => fs.statSync(target).isDirectory());
      if (dirs.length) {
        throw new UsageError(
          `Pass one folder, or one or more spec files (not both): ${dirs.join(", ")}`,
          { command: "mock" },
        );
      }
      apis = mockApisFromFiles(targets);
    }

    const issuer = values.issuer || process.env.RAPIDOC_MOCK_ISSUER || undefined;
    const audience = values.audience || process.env.RAPIDOC_MOCK_AUDIENCE || undefined;
    const { startMockServer, DEFAULT_PORT } = await loadMock();
    let server;
    try {
      server = await startOnFreePort(
        (port) =>
          startMockServer({ apis, port, host: values.host, issuer, audience, seed: values.seed }),
        values.port ?? DEFAULT_PORT ?? 4010,
        { host: values.host ?? "0.0.0.0" }, // the mock server's default host
      );
    } catch (err) {
      if (err.exitCode) throw err; // a busy port without --port, or a cancelled question
      throw new ProblemError(`Mock server failed: ${err.message}`);
    }

    info(`\n${icon("🧪")}Mock server: ${server.url}`);
    const fileOf = new Map(apis.map((api) => [api.id, path.relative(process.cwd(), api.fullPath)]));
    for (const api of server.apis) {
      info(
        `   • ${server.url}/${api.id}  ${api.title ? `${api.title}, ` : ""}${api.operations} operation(s)  (${fileOf.get(api.id)})`,
      );
    }
    for (const api of server.skipped)
      warn(`${api.id}: not served (${api.error.split("\n")[0]})`, "   ");
    if (issuer) {
      info(
        `   • Tokens:   verified against ${issuer}${audience ? ` for ${audience}` : ""}; scopes from scope, scp or permissions`,
      );
      if (!audience)
        warn(
          "No audience set (--audience or RAPIDOC_MOCK_AUDIENCE): tokens for any API are accepted.",
          "   ",
        );
    } else {
      info(
        "   • Tokens:   not verified, any bearer token passes (set --issuer or RAPIDOC_MOCK_ISSUER to check them)",
      );
    }
    info(
      "   • Try:      Prefer: code=404 picks a documented response; Prefer: example=<name> an example\n",
    );

    const stop = async () => {
      await server.close();
      process.exit(0);
    };
    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
  },
};
