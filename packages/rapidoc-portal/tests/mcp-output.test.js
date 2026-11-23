import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { writeMcpOutput } from "../src/engine/mcp-output.js";

const spec = (schemes = {}, operationId = "listOrders") => ({
  openapi: "3.1.0",
  info: { title: "T", version: "1" },
  servers: [{ url: "https://api.acme.test" }],
  components: { securitySchemes: schemes },
  paths: {
    "/orders": { get: { operationId, responses: { 200: { description: "OK" } } } },
    "/countries": {
      get: {
        operationId: "getCountries",
        "x-mcp-resource": true,
        responses: { 200: { description: "OK" } },
      },
    },
  },
});

describe("MCP manifests of a portal build", () => {
  it("prefixes each API's tool names before they are cut to 64 characters, and skips an API it cannot build", (t) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-mcp-output-"));
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
    const write = (file, doc) => {
      fs.writeFileSync(path.join(dir, file), JSON.stringify(doc));
      return path.join(dir, file);
    };
    const api = (id, fullPath) => ({ id, fullPath, versions: [{ fullPath, isDefault: true }] });
    const longId = "a-portal-api-with-a-rather-long-identifier";
    const warnings = [];
    writeMcpOutput(
      path.join(dir, "dist"),
      {
        apis: [
          api(longId, write("long.json", spec({}, `list${"Orders".repeat(10)}`))),
          api("orders", write("orders.json", spec())),
          api(
            "broken",
            write(
              "broken.json",
              spec({
                "api-key": { type: "apiKey", in: "header", name: "a" },
                apiKey: { type: "apiKey", in: "header", name: "b" },
              }),
            ),
          ),
        ],
      },
      { warn: (line) => warnings.push(line) },
    );
    const read = (id) =>
      JSON.parse(fs.readFileSync(path.join(dir, "dist/mcp", `${id}.json`), "utf8"));

    const long = read(longId);
    for (const tool of long.tools) {
      assert.ok(
        tool.name.startsWith(`${longId.replaceAll("-", "_")}`) || tool.name.startsWith(longId),
        tool.name,
      );
      assert.ok(tool.name.length <= 64, `${tool.name} is ${tool.name.length} characters`);
    }

    // Resource URIs carry the API too, so two APIs served by one /mcp never share one
    const uris = [...read("orders").resources, ...long.resources].map((resource) => resource.uri);
    assert.equal(new Set(uris).size, uris.length, uris.join(", "));

    assert.ok(!fs.existsSync(path.join(dir, "dist/mcp/broken.json")));
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /^broken: no MCP tools: .*MCP_AUTH_API_KEY/);
  });
});
