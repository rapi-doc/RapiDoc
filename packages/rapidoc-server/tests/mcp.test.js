import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createApp } from "../src/index.js";
import {
  createBrowser,
  PORTAL_ORIGIN,
  startIssuer,
  testEnv,
  writeFixtureBuild,
} from "./helpers.js";

const quiet = () => {};

/** A tiny API: echoes the Authorization header and the query, so tests see what a tool call sent. */
async function startApi() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, "http://x");
    res.setHeader("content-type", "application/json");
    if (url.pathname === "/pets") {
      res.end(
        JSON.stringify({
          pets: [{ id: 1, name: "Rex" }],
          auth: req.headers.authorization || null,
          limit: url.searchParams.get("limit"),
        }),
      );
    } else if (url.pathname === "/invoices") {
      if (!req.headers.authorization) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "token required" }));
      } else res.end(JSON.stringify({ invoices: [], auth: req.headers.authorization }));
    } else {
      res.statusCode = 404;
      res.end("{}");
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

/** Manifests as the portal build writes them: a public pets API and a billing API behind a zone. */
function writeMcpManifests(distDir, apiUrl, { section = true } = {}) {
  const manifest = (name, tools, securitySchemes = {}) => ({
    manifestVersion: 1,
    server: { name, version: "1.0.0" },
    sources: { [name]: { baseUrl: apiUrl, securitySchemes } },
    tools,
    resources: [],
  });
  const write = (rel, data) => {
    fs.mkdirSync(path.dirname(path.join(distDir, rel)), { recursive: true });
    fs.writeFileSync(path.join(distDir, rel), JSON.stringify(data));
  };
  write(
    "mcp/pets.json",
    manifest("pets", [
      {
        name: "pets_list_pets",
        description: "List pets",
        inputSchema: { type: "object", properties: { limit: { type: "integer" } } },
        annotations: { readOnlyHint: true },
        operation: {
          source: "pets",
          method: "GET",
          path: "/pets",
          params: [{ name: "limit", in: "query" }],
          security: [],
        },
      },
    ]),
  );
  write(
    "mcp/billing.json",
    manifest(
      "billing",
      [
        {
          name: "billing_list_invoices",
          description: "List invoices",
          inputSchema: { type: "object", properties: {} },
          annotations: { readOnlyHint: true },
          operation: {
            source: "billing",
            method: "GET",
            path: "/invoices",
            params: [],
            security: [{ oauth: [] }],
          },
        },
      ],
      { oauth: { type: "oauth2" } },
    ),
  );
  if (!section) return;
  const file = path.join(distDir, "rapidoc-server.json");
  const serverManifest = JSON.parse(fs.readFileSync(file, "utf8"));
  serverManifest.mcp = {
    apis: {
      pets: { file: "mcp/pets.json", tools: 1, zone: "public" },
      billing: { file: "mcp/billing.json", tools: 1, zone: "m-billing" },
    },
    workflows: {},
  };
  fs.writeFileSync(file, JSON.stringify(serverManifest));
}

/** One JSON-RPC request to /mcp, as an MCP client sends it; returns the parsed answer. */
/** A plain MCP request, for a server that may not serve /mcp (no JSON answer to parse). */
function postMcp(app) {
  return app.fetch(
    new Request(`${PORTAL_ORIGIN}/mcp`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }),
    }),
  );
}

async function rpc(app, method, params = {}, { token, origin = PORTAL_ORIGIN } = {}) {
  const res = await app.fetch(
    new Request(`${origin}/mcp`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/event-stream",
        ...(token && { authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    }),
  );
  const text = await res.text();
  return { status: res.status, headers: res.headers, body: text ? JSON.parse(text) : null };
}

const toolNames = (answer) => answer.body.result.tools.map((tool) => tool.name);

describe("rapidoc serve: /mcp", () => {
  let issuer;
  let api;
  let distDir;
  let app;

  before(async () => {
    issuer = await startIssuer();
    issuer.addUser("ann", {
      name: "Ann Reader",
      email: "ann@example.com",
      email_verified: true,
      groups: [],
    });
    issuer.addUser("bob", {
      name: "Bob Billing",
      email: "bob@example.com",
      email_verified: true,
      groups: ["billing-team"],
    });
    api = await startApi();
    distDir = writeFixtureBuild({ tryIt: true });
    writeMcpManifests(distDir, api.url);
    ({ app } = await createApp({ distDir, env: testEnv(issuer.issuer), log: quiet }));
  });

  after(async () => {
    await issuer.close();
    await api.close();
    fs.rmSync(distDir, { recursive: true, force: true });
  });

  async function mcpToken(user) {
    const browser = createBrowser(app);
    issuer.signInAs(user);
    await browser.visit("/_rapidoc/auth/login?returnTo=/");
    const res = await browser.send("/_rapidoc/mcp/token", {
      method: "POST",
      headers: { "sec-fetch-site": "same-origin" },
    });
    assert.equal(res.status, 200);
    return { browser, ...(await res.json()) };
  }

  it("lists the public tools to anyone and calls the API without credentials", async () => {
    const list = await rpc(app, "tools/list");
    assert.equal(list.status, 200);
    assert.equal(list.headers.get("cache-control"), "private, no-store");
    assert.deepEqual(toolNames(list), ["pets_list_pets"]);
    assert.equal(list.body.result.tools[0].annotations.readOnlyHint, true);

    const call = await rpc(app, "tools/call", { name: "pets_list_pets", arguments: { limit: 5 } });
    assert.equal(call.status, 200);
    const result = call.body.result;
    assert.ok(!result.isError, JSON.stringify(result));
    assert.deepEqual(result.structuredContent ?? JSON.parse(result.content[0].text), {
      pets: [{ id: 1, name: "Rex" }],
      auth: null,
      limit: "5",
    });

    const hidden = await rpc(app, "tools/call", { name: "billing_list_invoices", arguments: {} });
    assert.equal(hidden.body.result.isError, true, "a tool outside the reader's zones is unknown");
  });

  it("mints a token for signed-in readers on same-origin POSTs only", async () => {
    const signedOut = await createBrowser(app).send("/_rapidoc/mcp/token", {
      method: "POST",
      headers: { "sec-fetch-site": "same-origin" },
    });
    assert.equal(signedOut.status, 401);
    const { browser, token, expires_at, url } = await mcpToken("ann");
    assert.equal(typeof token, "string");
    assert.equal(url, `${PORTAL_ORIGIN}/mcp`);
    assert.ok(expires_at > Date.now() / 1000);
    const crossSite = await browser.send("/_rapidoc/mcp/token", {
      method: "POST",
      headers: { "sec-fetch-site": "cross-site" },
    });
    assert.equal(crossSite.status, 403);
    assert.notEqual((await browser.send("/_rapidoc/mcp/token")).status, 200, "GET is not a mint");
  });

  it("shows a reader the tools of their zones and calls the API with their access token", async () => {
    const ann = await mcpToken("ann");
    assert.deepEqual(toolNames(await rpc(app, "tools/list", {}, ann)), ["pets_list_pets"]);

    const bob = await mcpToken("bob");
    assert.deepEqual(toolNames(await rpc(app, "tools/list", {}, bob)), [
      "pets_list_pets",
      "billing_list_invoices",
    ]);
    const call = await rpc(
      app,
      "tools/call",
      { name: "billing_list_invoices", arguments: {} },
      bob,
    );
    const result = call.body.result;
    assert.ok(!result.isError, JSON.stringify(result));
    const data = result.structuredContent ?? JSON.parse(result.content[0].text);
    assert.match(data.auth, /^Bearer .{10,}/, "the reader's access token (auth.tryIt)");
    assert.ok(!data.auth.includes(bob.token), "never the MCP token itself");

    const denied = await rpc(
      app,
      "tools/call",
      { name: "billing_list_invoices", arguments: {} },
      ann,
    );
    assert.equal(denied.body.result.isError, true);
  });

  it("refuses a bad or tampered token", async () => {
    const bad = await rpc(app, "tools/list", {}, { token: "not-a-token" });
    assert.equal(bad.status, 401);
    assert.match(bad.headers.get("www-authenticate"), /^Bearer /);
    const { browser } = await mcpToken("ann");
    const session = browser.cookies().get("rapidoc-session");
    const asBearer = await rpc(app, "tools/list", {}, { token: session });
    assert.equal(asBearer.status, 401, "the session cookie is not an MCP token");
  });

  it("serves no /mcp and no agent tokens with RAPIDOC_MCP=off", async () => {
    const { app: off, summary } = await createApp({
      distDir,
      env: testEnv(issuer.issuer, { RAPIDOC_MCP: "off" }),
      log: quiet,
    });
    assert.deepEqual(summary.mcp, { enabled: false, tools: 0 });
    assert.notEqual((await postMcp(off)).status, 200);

    const browser = createBrowser(off);
    issuer.signInAs("ann");
    await browser.visit("/_rapidoc/auth/login?returnTo=/");
    const token = await browser.send("/_rapidoc/mcp/token", {
      method: "POST",
      headers: { "sec-fetch-site": "same-origin" },
    });
    assert.notEqual(token.status, 200, "no agent tokens either");
    const me = await (await browser.send("/_rapidoc/auth/me")).json();
    assert.equal(me.mcp, false, "the user menu hides its agent section");
    const { browser: onBrowser } = await mcpToken("bob");
    const onMe = await (await onBrowser.send("/_rapidoc/auth/me")).json();
    assert.equal(onMe.mcp, true, "on by default");

    const staticDir = writeFixtureBuild();
    fs.rmSync(path.join(staticDir, "rapidoc-server.json"));
    fs.rmSync(path.join(staticDir, "protected"), { recursive: true });
    writeMcpManifests(staticDir, api.url, { section: false });
    try {
      const { app: staticOff } = await createApp({
        distDir: staticDir,
        env: { RAPIDOC_MCP: "OFF" },
        log: quiet,
      });
      assert.notEqual((await postMcp(staticOff)).status, 200, "a static build too");
    } finally {
      fs.rmSync(staticDir, { recursive: true, force: true });
    }
  });

  it("stops at a RAPIDOC_MCP value other than on or off", async () => {
    await assert.rejects(
      createApp({ distDir, env: testEnv(issuer.issuer, { RAPIDOC_MCP: "false" }), log: quiet }),
      /RAPIDOC_MCP: "false" is not on or off/,
    );
  });

  it("calls a workflow's x-operation URL computed at run time only on a host MCP_EXTERNAL_HOSTS allows", async () => {
    const staticDir = writeFixtureBuild();
    fs.rmSync(path.join(staticDir, "rapidoc-server.json"));
    fs.rmSync(path.join(staticDir, "protected"), { recursive: true });
    // The API is at 127.0.0.1:<port>, the workflow's source: the same server as localhost:<port>
    // is another host
    const target = api.url.replace("127.0.0.1", "localhost");
    const file = path.join(staticDir, "mcp/workflows/fetch.json");
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(
      file,
      JSON.stringify({
        manifestVersion: 1,
        server: { name: "fetch", version: "1.0.0" },
        sources: { pets: { baseUrl: api.url, securitySchemes: {} } },
        tools: [
          {
            name: "fetch_pets",
            description: "Fetch pets from a URL",
            inputSchema: { type: "object", properties: { url: { type: "string" } } },
            annotations: { readOnlyHint: true },
            workflow: "fetchPets",
          },
        ],
        resources: [],
        workflows: {
          fetchPets: {
            workflowId: "fetchPets",
            inputs: { type: "object", properties: { url: { type: "string" } } },
            steps: [
              {
                stepId: "fetch",
                operation: {
                  source: "",
                  method: "GET",
                  url: "$inputs.url",
                  params: [],
                  security: [],
                },
                parameters: [],
                requestBody: null,
                security: [],
                successCriteria: [],
                onSuccess: [],
                onFailure: [],
                outputs: { name: "$response.body#/pets/0/name" },
              },
            ],
            outputs: { name: "$steps.fetch.outputs.name" },
          },
        },
      }),
    );
    const call = async (env, url) => {
      const { app: staticApp } = await createApp({ distDir: staticDir, env, log: quiet });
      const answer = await rpc(staticApp, "tools/call", {
        name: "fetch_pets",
        arguments: { url },
      });
      return answer.body.result;
    };
    try {
      const known = await call({}, `${api.url}/pets`);
      assert.deepEqual(known.structuredContent, { name: "Rex" });
      const refused = await call({}, `${target}/pets`);
      assert.equal(refused.isError, true);
      assert.match(refused.content[0].text, /x-operation URL host localhost:\d+ is not allowed/);
      const host = new URL(target).host;
      const oldName = await call({ EXTERNAL_HOSTS: host }, `${target}/pets`);
      assert.equal(oldName.isError, true, "only MCP_EXTERNAL_HOSTS is read");
      const allowed = await call(
        { MCP_EXTERNAL_HOSTS: `cdn.example.com, ${host}` },
        `${target}/pets`,
      );
      assert.deepEqual(allowed.structuredContent, { name: "Rex" });
    } finally {
      fs.rmSync(staticDir, { recursive: true, force: true });
    }
  });

  /** A static build with the given manifests in mcp/, by file name. */
  function staticBuildWith(manifests) {
    const dir = writeFixtureBuild();
    fs.rmSync(path.join(dir, "rapidoc-server.json"));
    fs.rmSync(path.join(dir, "protected"), { recursive: true });
    fs.mkdirSync(path.join(dir, "mcp"), { recursive: true });
    for (const [name, manifest] of Object.entries(manifests)) {
      fs.writeFileSync(path.join(dir, "mcp", `${name}.json`), JSON.stringify(manifest));
    }
    return dir;
  }
  const oneTool = (source, { baseUrl, securitySchemes = {}, security = [], version = 1 } = {}) => ({
    manifestVersion: version,
    server: { name: source, version: "1.0.0" },
    sources: { [source]: { ...(baseUrl && { baseUrl }), securitySchemes } },
    tools: [
      {
        name: `${source}_list_pets`,
        description: "List pets",
        inputSchema: { type: "object", properties: {} },
        annotations: { readOnlyHint: true },
        operation: { source, method: "GET", path: "/pets", params: [], security },
      },
    ],
    resources: [],
    workflows: {},
  });

  it("reads API credentials only from MCP_AUTH_<SCHEME>, never a variable a scheme id names", async () => {
    // A spec whose scheme is called like the server's own secret
    const dir = staticBuildWith({
      keys: oneTool("keys", {
        baseUrl: api.url,
        securitySchemes: {
          rapidoc_session_secret: { type: "apiKey", in: "header", name: "Authorization" },
        },
        security: [{ rapidoc_session_secret: [] }],
      }),
    });
    const sent = async (env) => {
      const { app: staticApp } = await createApp({ distDir: dir, env, log: quiet });
      const answer = await rpc(staticApp, "tools/call", { name: "keys_list_pets", arguments: {} });
      return answer.body.result.structuredContent.auth;
    };
    try {
      assert.equal(
        await sent({ RAPIDOC_SESSION_SECRET: "the-servers-own-secret", API_KEY: "old-shortcut" }),
        null,
        "neither the variable named like the scheme nor API_KEY is sent",
      );
      assert.equal(
        await sent({
          RAPIDOC_SESSION_SECRET: "the-servers-own-secret",
          MCP_AUTH_RAPIDOC_SESSION_SECRET: "the-api-key",
        }),
        "the-api-key",
      );
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it("leaves out the tools of an API without a base URL, and of a manifest version it does not read, and logs why", async () => {
    const dir = staticBuildWith({
      pets: oneTool("pets", { baseUrl: api.url }),
      nobase: oneTool("nobase"),
      newer: oneTool("newer", { baseUrl: api.url, version: 2 }),
    });
    try {
      const lines = [];
      const { app: staticApp, summary } = await createApp({
        distDir: dir,
        env: {},
        log: (line) => lines.push(line),
      });
      assert.equal(summary.mcp.tools, 1);
      assert.deepEqual(toolNames(await rpc(staticApp, "tools/list")), ["pets_list_pets"]);
      const hidden = await rpc(staticApp, "tools/call", { name: "nobase_list_pets" });
      assert.equal(hidden.body.result.isError, true);
      const log = lines.join("\n");
      assert.match(log, /no base URL for the API "nobase".*set MCP_BASE_URL_NOBASE/);
      assert.match(log, /newer\.json left out: it is manifest version 2/);

      // With its variable set, the API is offered and called there
      const { app: withBase } = await createApp({
        distDir: dir,
        env: { MCP_BASE_URL_NOBASE: api.url },
        log: quiet,
      });
      assert.deepEqual(toolNames(await rpc(withBase, "tools/list")).sort(), [
        "nobase_list_pets",
        "pets_list_pets",
      ]);
      const call = await rpc(withBase, "tools/call", { name: "nobase_list_pets", arguments: {} });
      assert.deepEqual(call.body.result.structuredContent.pets, [{ id: 1, name: "Rex" }]);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it("serves the manifests' tools of a static build as public", async () => {
    const staticDir = writeFixtureBuild();
    fs.rmSync(path.join(staticDir, "rapidoc-server.json"));
    fs.cpSync(path.join(staticDir, "protected"), path.join(staticDir, "public"), {
      recursive: true,
    });
    fs.rmSync(path.join(staticDir, "protected"), { recursive: true });
    writeMcpManifests(staticDir, api.url, { section: false });
    try {
      const { app: staticApp, summary } = await createApp({ distDir: staticDir, log: quiet });
      assert.deepEqual(summary.mcp, { enabled: true, tools: 2 });
      assert.deepEqual(toolNames(await rpc(staticApp, "tools/list")).sort(), [
        "billing_list_invoices",
        "pets_list_pets",
      ]);
      const { app: plain, summary: none } = await createApp({
        distDir: path.join(staticDir, "public"),
        log: quiet,
      });
      assert.equal(none.mcp.tools, 0);
      assert.equal((await rpc(plain, "tools/list")).status, 200, "an empty tool list, not a 404");
    } finally {
      fs.rmSync(staticDir, { recursive: true, force: true });
    }
  });
});
