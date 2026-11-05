/**
 * Runs the exported MCP project for real: the files generateMcpServer() writes are started as a
 * stdio server, driven with the MCP SDK's client, and their requests go to @rapidoc/mock serving
 * the same spec.
 */
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { startMockServer } from "@rapidoc/mock";
import { generateMcpServer } from "rapidoc/mcp";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const specPath = path.join(root, "docs/public/specs/petstore.yaml");
const arazzoPath = path.join(root, "docs/public/specs/petstore.arazzo.yaml");
const loader = path.join(root, "scripts/test-loader.mjs");

describe("mcp: the exported project runs against @rapidoc/mock", () => {
  let mock;
  let projectDir;
  const clients = [];

  before(async () => {
    mock = await startMockServer({
      port: 0,
      host: "127.0.0.1",
      apis: [{ id: "petstore", fullPath: specPath }],
      log: () => {},
      warn: () => {},
    });
    // Inside the repo (gitignored), so server.ts resolves @modelcontextprotocol/sdk from the
    // root node_modules
    fs.mkdirSync(path.join(root, ".test-tmp"), { recursive: true });
    projectDir = fs.mkdtempSync(path.join(root, ".test-tmp", "mcp-project-"));
    const spec = parseYaml(fs.readFileSync(specPath, "utf8"));
    const arazzo = parseYaml(fs.readFileSync(arazzoPath, "utf8"));
    const { files } = generateMcpServer(spec, { serverName: "petstore", arazzo });
    for (const [name, text] of Object.entries(files)) {
      fs.writeFileSync(path.join(projectDir, name), text);
    }
  });

  after(async () => {
    for (const client of clients) await client.close().catch(() => {});
    await mock?.close();
    if (projectDir) fs.rmSync(projectDir, { recursive: true, force: true });
  });

  /** Starts server.ts (through the repo's TS loader instead of tsx) and connects a client. */
  async function connect(env = {}) {
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: ["--import", loader, "server.ts"],
      cwd: projectDir,
      env: {
        ...process.env,
        API_BASE_URL: `${mock.url}/petstore`,
        ...env,
      },
      stderr: "pipe",
    });
    const client = new Client({ name: "rapidoc-test", version: "0.0.0" });
    await client.connect(transport);
    clients.push(client);
    return client;
  }

  it("lists the manifest's tools and calls the API with the credential from the environment", async () => {
    const client = await connect({ API_KEY: "test-key" });
    const { tools } = await client.listTools();
    assert.equal(tools.length, 21); // 19 operations and 2 workflows
    const get = tools.find((t) => t.name === "get_pet_by_id");
    assert.deepEqual(get.annotations, {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    });
    assert.deepEqual(get.inputSchema.required, ["petId"]);

    const found = await client.callTool({ name: "get_pet_by_id", arguments: { petId: 1 } });
    assert.equal(found.isError ?? false, false, found.content?.[0]?.text);
    const pet = JSON.parse(found.content[0].text);
    assert.equal(typeof pet.name, "string");
    assert.deepEqual(found.structuredContent, pet);

    // a POST with a JSON body, validated by the mock
    const placed = await client.callTool({
      name: "place_order",
      arguments: { body: { petId: 1, quantity: 2, status: "placed", complete: false } },
    });
    assert.equal(placed.isError ?? false, false, placed.content?.[0]?.text);
    // the mock answers with the spec's example order, not an echo of the request
    assert.ok(
      ["placed", "approved", "delivered"].includes(JSON.parse(placed.content[0].text).status),
    );

    const missing = await client.callTool({ name: "get_pet_by_id", arguments: {} });
    assert.equal(missing.isError, true);
    assert.match(missing.content[0].text, /Missing path parameter/);
    assert.equal((await client.listResources()).resources.length, 0);
  });

  it("runs a workflow tool end to end against the mock", async () => {
    const client = await connect({ API_KEY: "test-key" });
    const result = await client.callTool({ name: "adopt_pet", arguments: { quantity: 1 } });
    assert.equal(result.isError ?? false, false, result.content?.[0]?.text);
    const outputs = result.structuredContent;
    assert.equal(typeof outputs.petName, "string");
    assert.ok(outputs.orderId !== undefined);
    assert.ok(["placed", "approved", "delivered"].includes(outputs.orderStatus));
  });

  it("gets the API's 401 as an error result when no credential is set", async () => {
    const client = await connect({ API_KEY: "" });
    const result = await client.callTool({ name: "get_pet_by_id", arguments: { petId: 1 } });
    assert.equal(result.isError, true);
    assert.match(result.content[0].text, /^HTTP 401/);
  });
});
