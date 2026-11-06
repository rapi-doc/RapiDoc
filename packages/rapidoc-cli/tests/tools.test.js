import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { satisfies } from "../src/commands/doctor.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const CLI_PATH = path.resolve(here, "../src/index.js");
const FIXTURES = path.join(here, "fixtures/validate");
const SPEC = path.join(FIXTURES, "valid-3.1.yaml");

const run = (args, options = {}) =>
  spawnSync("node", [CLI_PATH, ...args], { encoding: "utf8", ...options });

function tempDir(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-tools-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

/** Starts a long-running command; resolves with its output once `pattern` appears in it. */
function start(args, pattern, options = {}) {
  const child = spawn("node", [CLI_PATH, ...args], options);
  let output = "";
  const ready = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timed out:\n${output}`)), 20000);
    const read = (chunk) => {
      output += chunk;
      const match = output.match(pattern);
      if (match) {
        clearTimeout(timer);
        resolve(match);
      }
    };
    child.stdout.on("data", read);
    child.stderr.on("data", read);
    child.on("exit", () => reject(new Error(`exited:\n${output}`)));
  });
  return { child, ready, output: () => output };
}

test("rapidoc preview", async (t) => {
  await t.test(
    "serves the page, the bundle and the spec's folder; reloads on change",
    async (t) => {
      const dir = tempDir(t);
      fs.cpSync(path.join(FIXTURES, "multi"), dir, { recursive: true });
      const preview = start(
        ["preview", path.join(dir, "root.yaml"), "--port", "0"],
        /URL: +(http:\/\/\S+)/,
      );
      t.after(() => preview.child.kill());
      const [, url] = await preview.ready;

      const html = await (await fetch(url)).text();
      assert.match(html, /<rapi-doc spec-url="\/spec\/root\.yaml"/);
      assert.match(html, /new EventSource\("\/events"\)/, "the page listens for reloads");

      const bundle = await fetch(new URL("/rapidoc-min.js", url));
      assert.equal(bundle.status, 200);
      assert.equal(bundle.headers.get("content-type"), "text/javascript");

      const referenced = await fetch(new URL("/spec/responses.yaml", url));
      assert.equal(referenced.status, 200, "files next to the spec are served, for relative $refs");
      assert.equal(referenced.headers.get("cache-control"), "no-store");

      const outside = await fetch(new URL("/spec/..%2F..%2Fetc%2Fpasswd", url));
      assert.equal(outside.status, 404, "nothing outside the spec's folder");

      // A change in the folder sends "reload" to the page.
      const events = await fetch(new URL("/events", url));
      const reader = events.body.getReader();
      await reader.read(); // the ": connected" comment
      fs.appendFileSync(path.join(dir, "root.yaml"), "\n# edited\n");
      const { value } = await reader.read();
      assert.match(new TextDecoder().decode(value), /data: reload/);
      await reader.cancel();
    },
  );

  await t.test("a URL spec is loaded from there, without reloads", async (t) => {
    const preview = start(
      ["preview", "https://example.com/openapi.json", "--port", "0"],
      /URL: +(http:\/\/\S+)/,
    );
    t.after(() => preview.child.kill());
    const [, url] = await preview.ready;
    const html = await (await fetch(url)).text();
    assert.match(html, /spec-url="https:\/\/example\.com\/openapi\.json"/);
    assert.doesNotMatch(html, /EventSource/);
    assert.equal((await fetch(new URL("/events", url))).status, 404);
  });

  await t.test("--open opens the page", async (t) => {
    const dir = tempDir(t);
    const opener = path.join(dir, "open.sh");
    fs.writeFileSync(opener, `#!/bin/sh\necho "$1" > "${path.join(dir, "opened.txt")}"\n`, {
      mode: 0o755,
    });
    const preview = start(["preview", SPEC, "--port", "0", "--open"], /URL: +(http:\/\/\S+)/, {
      env: { ...process.env, RAPIDOC_OPEN_COMMAND: opener },
    });
    t.after(() => preview.child.kill());
    const [, url] = await preview.ready;
    const opened = path.join(dir, "opened.txt");
    for (let i = 0; i < 50 && !fs.existsSync(opened); i++)
      await new Promise((r) => setTimeout(r, 50));
    assert.equal(fs.readFileSync(opened, "utf8").trim(), url);
  });

  await t.test("a spec is required and must exist", () => {
    assert.equal(run(["preview"]).status, 2);
    const missing = run(["preview", "nope.yaml"]);
    assert.equal(missing.status, 1);
    assert.match(missing.stderr, /File not found/);
  });
});

test("rapidoc mcp", async (t) => {
  await t.test("export writes the server project", (t) => {
    const dir = tempDir(t);
    const out = path.join(dir, "server");
    const result = run(["mcp", "export", SPEC, "--out-dir", out, "--server-name", "items"]);
    assert.equal(result.status, 0, result.stderr);
    for (const file of ["manifest.json", "server.ts", "runtime.js", "package.json", "README.md"])
      assert.ok(fs.existsSync(path.join(out, file)), file);
    const manifest = JSON.parse(fs.readFileSync(path.join(out, "manifest.json"), "utf8"));
    assert.equal(manifest.server.name, "items");
    assert.deepEqual(
      manifest.tools.map((tool) => tool.name),
      ["get_item"],
    );
    assert.match(result.stdout, /Tools: +1 \(0 not read-only\)/);
  });

  await t.test("export won't overwrite a non-empty folder without --force", (t) => {
    const dir = tempDir(t);
    fs.writeFileSync(path.join(dir, "keep.txt"), "mine");
    const refused = run(["mcp", "export", SPEC, "--out-dir", dir]);
    assert.equal(refused.status, 1);
    assert.match(refused.stderr, /is not empty: pass --force/);
    assert.equal(run(["mcp", "export", SPEC, "--out-dir", dir, "--force"]).status, 0);
    assert.equal(fs.readFileSync(path.join(dir, "keep.txt"), "utf8"), "mine", "other files stay");
  });

  await t.test("an action and a spec are required", () => {
    assert.match(run(["mcp"]).stderr, /Missing action/);
    assert.equal(run(["mcp", "publish", SPEC]).status, 2);
    assert.equal(run(["mcp", "export"]).status, 2);
  });

  await t.test("serve speaks MCP over stdio", async () => {
    const { Client } = await import("@modelcontextprotocol/sdk/client/index.js");
    const { StdioClientTransport } = await import("@modelcontextprotocol/sdk/client/stdio.js");
    const client = new Client({ name: "test", version: "1" });
    await client.connect(
      new StdioClientTransport({
        command: "node",
        args: [CLI_PATH, "mcp", "serve", SPEC],
        stderr: "ignore",
      }),
    );
    try {
      const { tools } = await client.listTools();
      assert.deepEqual(
        tools.map((tool) => tool.name),
        ["get_item"],
      );
      assert.ok(tools[0].inputSchema.properties.id, "arguments as JSON Schema");
    } finally {
      await client.close();
    }
  });

  await t.test("serve without the MCP SDK says how to install it", () => {
    const result = run(["mcp", "serve", SPEC], {
      env: { ...process.env, RAPIDOC_MCP_SDK_MODULE: "@modelcontextprotocol/sdk-not-installed" },
    });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /npm install -D @modelcontextprotocol\/sdk/);
  });
});

test("rapidoc doctor", async (t) => {
  await t.test("satisfies", () => {
    assert.ok(satisfies("12.1.0", "^12.0.0"));
    assert.ok(!satisfies("13.0.0", "^12.0.0"));
    assert.ok(satisfies("0.1.5", "^0.1.0"));
    assert.ok(!satisfies("0.2.0", "^0.1.0"), "for 0.x, ^ keeps the minor version");
    assert.ok(satisfies("22.12.0", ">=22.12.0"));
    assert.ok(!satisfies("20.18.0", ">=22.12.0"));
  });

  await t.test("--format json: runtime, packages and the portal config", (t) => {
    const dir = tempDir(t);
    const result = run(["doctor", dir, "--format", "json"]);
    assert.equal(result.status, 0, result.stderr);
    const report = JSON.parse(result.stdout);
    assert.equal(report.ok, true);
    const byName = Object.fromEntries(report.items.map((item) => [item.name, item]));
    assert.equal(byName.node.status, "ok");
    assert.equal(byName["@rapidoc/cli"].status, "ok");
    assert.equal(byName["@rapidoc/mcp"].status, "ok");
    assert.equal(byName["rapidoc.config.*"].status, "missing", "no config is only noted");
  });

  await t.test("a config that doesn't load is a problem, exit 1", (t) => {
    const dir = tempDir(t);
    fs.writeFileSync(path.join(dir, "rapidoc.config.yaml"), "site: { title: Acme }\nnotAKey: 1\n");
    const result = run(["doctor", dir]);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /rapidoc\.config\.yaml/);
    assert.match(result.stderr, /1 problem\(s\)/);
  });
});
