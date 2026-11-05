/**
 * MCP manifests in the build output, for `rapidoc serve`'s /mcp endpoint (and anyone else who
 * wants to host the portal's APIs as MCP tools):
 *
 *   <outDir>/mcp/<api id>.json              one manifest per API (its default version); tools are
 *                                           named <api id>_<tool>, so names never clash across APIs
 *   <outDir>/mcp/workflows/<workflow id>.json  one per Arazzo file of `workflows:`: its workflow
 *                                           tools and the sources they use (`apis` maps each
 *                                           source name to the API id)
 *
 * The manifests are built with rapidoc/mcp from the specs on disk, after the site is built and,
 * with `auth`, after the output is split, so they live next to public/ and protected/ rather than
 * inside them. Remote specs and workflows the runtime cannot run are left out (the latter with the
 * same warnings `rapidoc validate` prints).
 */
import fs from "node:fs";
import path from "node:path";
import { buildMcpManifest, parseArazzo } from "rapidoc/mcp";
import { readSpecFile } from "./spec-checks.js";

export const MCP_DIR = "mcp";

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

/** The default version's spec of an API as an object, or null when remote or unreadable. */
function defaultSpec(api) {
  const version = api.versions?.[0] || api;
  if (version.isRemote || !version.fullPath || !fs.existsSync(version.fullPath)) return null;
  try {
    return readSpecFile(version.fullPath);
  } catch {
    return null;
  }
}

/**
 * Writes the manifests and returns what rapidoc-server.json records about them.
 *
 * @param {string} outDir the build output
 * @param {{apis?: object[], workflows?: object[]}} config normalized portal config
 * @param {{ warn?: (line: string) => void }} [options]
 * @returns {{ apis: Record<string, { file: string, tools: number }>,
 *   workflows: Record<string, { file: string, apis: string[], tools: number }> }} files are
 *   relative to outDir
 */
export function writeMcpOutput(outDir, config, { warn = () => {} } = {}) {
  const specs = new Map();
  for (const api of config.apis || []) {
    const spec = defaultSpec(api);
    if (spec) specs.set(api.id, spec);
  }

  const apis = {};
  for (const [id, spec] of specs) {
    const manifest = buildMcpManifest(spec, { serverName: id, sourceName: id });
    manifest.tools = manifest.tools.map((tool) => ({ ...tool, name: `${id}_${tool.name}` }));
    manifest.resources = manifest.resources.map((r) => ({ ...r, name: `${id}_${r.name}` }));
    const file = path.posix.join(MCP_DIR, `${id}.json`);
    writeJson(path.join(outDir, file), manifest);
    apis[id] = { file, tools: manifest.tools.length };
  }

  const workflows = {};
  for (const workflow of config.workflows || []) {
    if (!fs.existsSync(workflow.fullPath)) continue;
    let arazzo;
    try {
      arazzo = parseArazzo(fs.readFileSync(workflow.fullPath, "utf8"));
    } catch {
      continue; // reported by the checks
    }
    // The first source whose API spec is on disk is the manifest's main spec; the others ride along
    const entries = Object.entries(workflow.sources || {}).filter(([, apiId]) => specs.has(apiId));
    if (!entries.length) continue;
    const [[firstName, firstApi], ...rest] = entries;
    const sources = Object.fromEntries(rest.map(([name, apiId]) => [name, specs.get(apiId)]));
    const manifest = buildMcpManifest(specs.get(firstApi), {
      serverName: workflow.id,
      sourceName: firstName,
      arazzo,
      sources,
      includeOperations: false,
      onProblem: (p) => warn(`${workflow.id}: ${p.message}`),
    });
    const tools = manifest.tools;
    if (!tools.length) continue;
    const file = path.posix.join(MCP_DIR, "workflows", `${workflow.id}.json`);
    writeJson(path.join(outDir, file), {
      ...manifest,
      tools,
      resources: [],
      apis: Object.fromEntries(entries),
    });
    workflows[workflow.id] = {
      file,
      apis: [...new Set(entries.map(([, apiId]) => apiId))],
      tools: tools.length,
    };
  }

  return { apis, workflows };
}
