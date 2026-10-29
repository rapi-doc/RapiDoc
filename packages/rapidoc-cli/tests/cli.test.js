import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { execFileSync, spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLI_PATH = path.resolve(__dirname, "../src/index.js");
const DEMO_PORTAL_DIR =
  process.env.RAPIDOC_DEMO_PORTAL_DIR ??
  path.resolve(__dirname, "../../../../rapi-portal-demo/fixtures/zudoku-cosmo-cargo");

/** A one-operation OpenAPI document (GET /ping). */
const minimalSpec = (title) =>
  `openapi: 3.1.0\ninfo: { title: ${title}, version: 1.0.0 }\npaths:\n  /ping:\n    get:\n      responses:\n        '200': { description: OK, content: { application/json: { example: { ok: true } } } }\n`;

/** Starts `rapidoc mock <args>` on a free port; resolves once the startup banner is printed. */
async function startMock(mockArgs, env = {}) {
  const child = spawn(
    "node",
    [CLI_PATH, "mock", ...mockArgs, "--port", "0", "--host", "127.0.0.1"],
    {
      env: { ...process.env, RAPIDOC_MOCK_ISSUER: "", RAPIDOC_MOCK_AUDIENCE: "", ...env },
    },
  );
  let output = "";
  const url = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`no URL in: ${output}`)), 20000);
    const read = (chunk) => {
      output += chunk;
      const match = /Mock server: (http:\/\/\S+)/.exec(output);
      if (match && output.includes("Try:")) {
        clearTimeout(timer);
        resolve(match[1]);
      }
    };
    child.stdout.on("data", read);
    child.stderr.on("data", read);
    child.once("exit", (code) => reject(new Error(`exited with ${code}: ${output}`)));
  });
  return { url, output, stop: () => child.kill() };
}

test("@rapidoc/cli Command-Line Tool (Milestone 6)", async (t) => {
  await t.test("--help should print usage and commands", () => {
    const output = execFileSync("node", [CLI_PATH, "--help"], { encoding: "utf8" });
    assert.ok(output.includes("RapiDoc CLI (@rapidoc/cli)"));
    assert.ok(output.includes("build [dir]"));
    assert.ok(output.includes("validate [spec|dir]"));
    assert.ok(output.includes("migrate --from <src>"));
    assert.ok(output.includes("init [dir]"));
    assert.ok(output.includes("serve [dist]"));
    assert.ok(output.includes("mock [dir|spec...]"));
  });

  await t.test("--version should print version string", () => {
    const output = execFileSync("node", [CLI_PATH, "--version"], { encoding: "utf8" });
    assert.ok(output.includes("0.1.0"));
  });

  await t.test("validate should verify a valid OpenAPI 3.1 specification", () => {
    const specPath = path.join(DEMO_PORTAL_DIR, "specs/orders-api.yaml");
    const output = execFileSync("node", [CLI_PATH, "validate", specPath], { encoding: "utf8" });
    assert.ok(output.includes("Specification is valid OpenAPI!"));
  });

  await t.test(
    "validate with a folder checks every spec in apis: and warns about missing operationIds",
    () => {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-cli-validate-"));
      const spec = (op) =>
        `openapi: 3.1.0\ninfo: { title: Orders, version: 1.0.0 }\npaths:\n  /orders:\n    get: { ${op}, responses: { '200': { description: OK } } }\n`;
      try {
        fs.mkdirSync(path.join(tempDir, "specs"));
        fs.writeFileSync(path.join(tempDir, "specs/orders.yaml"), spec("summary: List orders"));
        fs.writeFileSync(
          path.join(tempDir, "rapidoc.config.yaml"),
          "site: { title: Acme }\napis:\n  - { id: orders, spec: ./specs/orders.yaml }\n",
        );
        const result = spawnSync("node", [CLI_PATH, "validate", tempDir], { encoding: "utf8" });
        assert.equal(result.status, 0, result.stderr);
        assert.ok(result.stdout.includes("1 specs checked, no errors."));
        assert.ok(result.stderr.includes("orders: 1 operation has no operationId"));

        fs.writeFileSync(
          path.join(tempDir, "specs/orders.yaml"),
          spec("operationId: listOrders, summary: 42"),
        );
        const invalid = spawnSync("node", [CLI_PATH, "validate"], {
          cwd: tempDir,
          encoding: "utf8",
        });
        assert.equal(invalid.status, 1);
        assert.ok(invalid.stdout.includes("1 of 1 specs have errors."));
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    },
  );

  await t.test(
    "init scaffolds a portal with the CLI and the portal engine as dev dependencies",
    () => {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-cli-init-"));
      const projectDir = path.join(tempDir, "acme-portal");
      try {
        const result = spawnSync(
          "node",
          [CLI_PATH, "init", projectDir, "--title", "Acme Docs", "--yes", "--no-install"],
          {
            encoding: "utf8",
          },
        );
        assert.equal(result.status, 0, result.stderr);
        const pkg = JSON.parse(fs.readFileSync(path.join(projectDir, "package.json"), "utf8"));
        assert.deepEqual(Object.keys(pkg.devDependencies).sort(), [
          "@rapidoc/cli",
          "@rapidoc/portal",
        ]);
        assert.equal(pkg.scripts.dev, "rapidoc dev");
        const config = fs.readFileSync(path.join(projectDir, "rapidoc.config.yaml"), "utf8");
        assert.ok(config.includes('title: "Acme Docs"'));
        assert.ok(config.includes('spec: "./specs/api.yaml"'));
        assert.ok(result.stdout.includes("npm run dev"));
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    },
  );

  await t.test("init in an existing repo uses its OpenAPI files and keeps its package.json", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-cli-init-existing-"));
    try {
      fs.mkdirSync(path.join(tempDir, "openapi"));
      fs.writeFileSync(
        path.join(tempDir, "openapi/orders-api.yaml"),
        "openapi: 3.1.0\ninfo: { title: Orders, version: 1.0.0 }\npaths: {}\n",
      );
      fs.writeFileSync(path.join(tempDir, "package.json"), '{ "name": "orders-service" }\n');

      const result = spawnSync("node", [CLI_PATH, "init", "--yes", "--no-install"], {
        cwd: tempDir,
        encoding: "utf8",
      });
      assert.equal(result.status, 0, result.stderr);
      const config = fs.readFileSync(path.join(tempDir, "rapidoc.config.yaml"), "utf8");
      assert.ok(config.includes("id: orders-api"));
      assert.ok(config.includes('spec: "./openapi/orders-api.yaml"'));
      assert.ok(config.includes('label: "Orders API"'));
      assert.ok(
        !fs.existsSync(path.join(tempDir, "specs/api.yaml")),
        "no starter spec when the repo has its own",
      );
      assert.equal(
        fs.readFileSync(path.join(tempDir, "package.json"), "utf8"),
        '{ "name": "orders-service" }\n',
      );
      assert.ok(result.stdout.includes("npm install -D @rapidoc/cli @rapidoc/portal"));
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  await t.test(
    "without @rapidoc/portal: build asks for it, single-spec validate still works",
    () => {
      const env = { ...process.env, RAPIDOC_PORTAL_MODULE: "@rapidoc/portal-not-installed" };
      const build = spawnSync("node", [CLI_PATH, "build", DEMO_PORTAL_DIR], {
        encoding: "utf8",
        env,
      });
      assert.equal(build.status, 1);
      assert.ok(build.stderr.includes("npm install -D @rapidoc/portal"), build.stderr);

      const specPath = path.join(DEMO_PORTAL_DIR, "specs/orders-api.yaml");
      const validateSpec = spawnSync("node", [CLI_PATH, "validate", specPath], {
        encoding: "utf8",
        env,
      });
      assert.equal(validateSpec.status, 0, validateSpec.stderr);
      assert.ok(validateSpec.stdout.includes("Specification is valid OpenAPI!"));
    },
  );

  await t.test(
    "serve: asks for @rapidoc/server when it is missing, and explains what it needs to start",
    () => {
      const missing = spawnSync("node", [CLI_PATH, "serve", DEMO_PORTAL_DIR], {
        encoding: "utf8",
        env: { ...process.env, RAPIDOC_SERVER_MODULE: "@rapidoc/server-not-installed" },
      });
      assert.equal(missing.status, 1);
      assert.ok(missing.stderr.includes("npm install @rapidoc/server"), missing.stderr);

      const noBuild = spawnSync(
        "node",
        [CLI_PATH, "serve", path.join(os.tmpdir(), "rapidoc-no-such-dist")],
        { encoding: "utf8" },
      );
      assert.equal(noBuild.status, 1);
      assert.ok(noBuild.stderr.includes("run rapidoc build first"), noBuild.stderr);

      const distDir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-cli-serve-"));
      try {
        fs.mkdirSync(path.join(distDir, "public"));
        fs.mkdirSync(path.join(distDir, "protected"));
        const auth = {
          issuer: null,
          clientId: "portal-web",
          scopes: ["openid"],
          claims: { groups: "groups" },
          session: { maxAge: "8h" },
        };
        const access = {
          defaultZone: "signed-in",
          zones: { "signed-in": { kind: "signed-in" } },
          groups: [],
        };
        fs.writeFileSync(
          path.join(distDir, "rapidoc-server.json"),
          JSON.stringify({ version: 1, site: {}, auth, access, files: {} }),
        );
        const env = { ...process.env, RAPIDOC_SESSION_SECRET: "", RAPIDOC_AUTH_ISSUER: "" };
        const noSecrets = spawnSync("node", [CLI_PATH, "serve", distDir, "--port", "0"], {
          encoding: "utf8",
          env,
        });
        assert.equal(noSecrets.status, 1);
        assert.ok(noSecrets.stderr.includes("RAPIDOC_SESSION_SECRET"), noSecrets.stderr);
        assert.ok(noSecrets.stderr.includes("RAPIDOC_AUTH_ISSUER"), noSecrets.stderr);
      } finally {
        fs.rmSync(distDir, { recursive: true, force: true });
      }
    },
  );

  await t.test(
    "mock: asks for @rapidoc/mock when it is missing, and serves one spec under /<file name>",
    async () => {
      const specPath = path.resolve(__dirname, "../../rapidoc-mock/tests/fixtures/orders.yaml");
      const missing = spawnSync("node", [CLI_PATH, "mock", specPath], {
        encoding: "utf8",
        env: { ...process.env, RAPIDOC_MOCK_MODULE: "@rapidoc/mock-not-installed" },
      });
      assert.equal(missing.status, 1);
      assert.ok(missing.stderr.includes("npm install -D @rapidoc/mock"), missing.stderr);

      const badPort = spawnSync("node", [CLI_PATH, "mock", specPath, "--port", "x"], {
        encoding: "utf8",
      });
      assert.equal(badPort.status, 1);
      assert.ok(badPort.stderr.includes("--port needs a whole number"), badPort.stderr);

      const mock = await startMock([specPath]);
      try {
        assert.ok(mock.output.includes("/orders  Orders API, 9 operation(s)"), mock.output);
        assert.ok(mock.output.includes("not verified"), mock.output);
        assert.equal((await fetch(`${mock.url}/orders/health`)).status, 200);
        assert.equal((await fetch(`${mock.url}/orders/orders`)).status, 401);
      } finally {
        mock.stop();
      }
    },
  );

  await t.test(
    "mock: a folder without rapidoc.config.yaml is mocked file by file, without the portal engine",
    async () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-cli-mock-"));
      try {
        const fixtures = path.resolve(__dirname, "../../rapidoc-mock/tests/fixtures");
        fs.mkdirSync(path.join(dir, "specs"));
        fs.copyFileSync(
          path.join(fixtures, "orders.yaml"),
          path.join(dir, "specs/orders-api.yaml"),
        );
        fs.copyFileSync(path.join(fixtures, "common.yaml"), path.join(dir, "specs/common.yaml"));
        for (const version of ["v1", "v2"]) {
          fs.mkdirSync(path.join(dir, `billing-${version}`));
          fs.writeFileSync(
            path.join(dir, `billing-${version}/openapi.yaml`),
            minimalSpec(`Billing ${version}`),
          );
        }
        fs.writeFileSync(path.join(dir, "package.json"), '{ "name": "not-a-spec" }');

        const mock = await startMock([dir], {
          RAPIDOC_PORTAL_MODULE: "@rapidoc/portal-not-installed",
        });
        try {
          assert.ok(mock.output.includes("No rapidoc.config.yaml"), mock.output);
          assert.ok(mock.output.includes("/orders-api  Orders API, 9 operation(s)"), mock.output);
          assert.ok(
            mock.output.includes("/billing-v1-openapi  Billing v1, 1 operation(s)"),
            mock.output,
          );
          assert.ok(
            mock.output.includes("/billing-v2-openapi  Billing v2, 1 operation(s)"),
            mock.output,
          );
          assert.ok(
            !mock.output.includes("/common"),
            "files that are not OpenAPI documents are skipped",
          );
          assert.equal((await fetch(`${mock.url}/orders-api/health`)).status, 200);
          assert.equal((await fetch(`${mock.url}/billing-v2-openapi/ping`)).status, 200);
        } finally {
          mock.stop();
        }

        const empty = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-cli-mock-empty-"));
        try {
          const result = spawnSync("node", [CLI_PATH, "mock", empty], { encoding: "utf8" });
          assert.equal(result.status, 1);
          assert.ok(
            result.stderr.includes("no rapidoc.config.yaml and no OpenAPI files"),
            result.stderr,
          );
        } finally {
          fs.rmSync(empty, { recursive: true, force: true });
        }
      } finally {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    },
  );

  await t.test(
    "mock: several spec files, with options between them; same file names get their folder",
    async () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-cli-mock-files-"));
      try {
        for (const name of ["a/openapi.yaml", "b/openapi.json", "payments.yaml"]) {
          fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
          fs.writeFileSync(path.join(dir, name), minimalSpec(name));
        }
        const files = ["a/openapi.yaml", "payments.yaml", "b/openapi.json"].map((name) =>
          path.join(dir, name),
        );
        const mock = await startMock([files[0], "--seed", "3", files[1], files[2]]);
        try {
          assert.ok(mock.output.includes("/a-openapi  a/openapi.yaml"), mock.output);
          assert.ok(mock.output.includes("/payments  payments.yaml"), mock.output);
          assert.ok(mock.output.includes("/b-openapi  b/openapi.json"), mock.output);
          assert.equal((await fetch(`${mock.url}/payments/ping`)).status, 200);
        } finally {
          mock.stop();
        }

        const mixed = spawnSync("node", [CLI_PATH, "mock", files[0], dir], { encoding: "utf8" });
        assert.equal(mixed.status, 1);
        assert.ok(
          mixed.stderr.includes("Pass one folder, or one or more spec files"),
          mixed.stderr,
        );
      } finally {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    },
  );

  await t.test(
    "migrate --from redocly should generate rapidoc.config.yaml from redocly.yaml",
    () => {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-cli-migrate-"));
      try {
        const redoclyYaml = `apis:
  main:
    root: ./openapi.yaml
theme:
  openapi:
    theme: dark
    primaryColor: '#6366f1'
`;
        fs.writeFileSync(path.join(tempDir, "redocly.yaml"), redoclyYaml, "utf8");

        const output = execFileSync("node", [CLI_PATH, "migrate", "--from", "redocly"], {
          cwd: tempDir,
          encoding: "utf8",
        });

        assert.ok(output.includes("Successfully generated rapidoc.config.yaml"));
        assert.ok(fs.existsSync(path.join(tempDir, "rapidoc.config.yaml")));

        const generatedContent = fs.readFileSync(path.join(tempDir, "rapidoc.config.yaml"), "utf8");
        assert.ok(generatedContent.includes('primary: "#6366f1"'));
      } finally {
        if (fs.existsSync(tempDir)) {
          fs.rmSync(tempDir, { recursive: true, force: true });
        }
      }
    },
  );
});
