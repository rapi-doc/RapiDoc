import fs from "node:fs";
import path from "node:path";
import { getCookie } from "hono/cookie";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createMcpRuntime, credentialsFromEnv } from "rapidoc/mcp";
import { allows } from "./access.js";
import { isSameOrigin } from "./auth/routes.js";
import { cookieNames } from "./auth/session.js";
import { NO_STORE } from "./static.js";

/**
 * The portal's APIs and workflows as MCP tools, from the manifests `rapidoc build` writes to
 * dist/mcp/ (§ "MCP manifests" of the portal README):
 *
 *   POST /mcp                  Streamable HTTP (stateless, JSON answers): tools/list, tools/call, resources
 *   POST /_rapidoc/mcp/token   same-origin, signed in: a bearer token for agents (the user menu shows it)
 *
 * Without a token an agent sees the public tools and the API is called anonymously. With one, it sees
 * the tools of the zones the reader may see, and operations secured with oauth2, openIdConnect or a
 * bearer scheme are called with the reader's access token (auth.tryIt) when the portal has one. Other
 * schemes (API keys, HTTP Basic) take the server's environment, named as in the exported project:
 * `<SCHEME>` (scheme id in upper snake case) or `API_KEY`.
 */

export const MCP_PATH = "/mcp";
export const MCP_TOKEN_PATH = "/_rapidoc/mcp/token";
const MCP_DIR = "mcp";
const BEARER_TYPES = new Set(["oauth2", "openIdConnect"]);

/**
 * Reads the manifests of a build. With rapidoc-server.json's `mcp` section, each API's tools belong to
 * its zone and a workflow's to every zone of its APIs; a static build's tools are all public.
 *
 * @param {string} distDir
 * @param {object | null} [section] - `manifest.mcp` of rapidoc-server.json
 * @returns {{ tools: Map<string, { manifest: object, zones: string[] }>,
 *   resources: Map<string, { manifest: object, zones: string[] }>, count: number }}
 */
export function loadMcpManifests(distDir, section) {
  const tools = new Map();
  const resources = new Map();
  const read = (rel) => JSON.parse(fs.readFileSync(path.join(distDir, rel), "utf8"));
  const add = (manifest, zones) => {
    for (const tool of manifest.tools || []) tools.set(tool.name, { manifest, zones });
    for (const resource of manifest.resources || [])
      resources.set(resource.uri, { manifest, zones });
  };

  if (section) {
    const apiZone = {};
    for (const [id, entry] of Object.entries(section.apis || {})) {
      apiZone[id] = entry.zone;
      add(read(entry.file), [entry.zone]);
    }
    for (const entry of Object.values(section.workflows || {})) {
      add(read(entry.file), [...new Set(entry.apis.map((id) => apiZone[id]).filter(Boolean))]);
    }
    return { tools, resources, count: tools.size };
  }

  const dir = path.join(distDir, MCP_DIR);
  if (!fs.existsSync(dir)) return { tools, resources, count: 0 };
  const files = [
    ...fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => path.join(MCP_DIR, f)),
    ...(fs.existsSync(path.join(dir, "workflows"))
      ? fs
          .readdirSync(path.join(dir, "workflows"))
          .filter((f) => f.endsWith(".json"))
          .map((f) => path.join(MCP_DIR, "workflows", f))
      : []),
  ];
  for (const file of files) add(read(file), ["public"]);
  return { tools, resources, count: tools.size };
}

/**
 * Credentials for one manifest: the reader's access token for the schemes that take a bearer
 * token, the environment for the rest.
 */
function credentialsFor(manifest, apiToken, env) {
  const credentials = credentialsFromEnv(manifest, env);
  if (!apiToken) return credentials;
  for (const source of Object.values(manifest.sources || {})) {
    for (const [id, scheme] of Object.entries(source.securitySchemes || {})) {
      const bearer =
        BEARER_TYPES.has(scheme.type) ||
        (scheme.type === "http" && String(scheme.scheme).toLowerCase() === "bearer");
      if (bearer) credentials[id] = apiToken;
    }
  }
  return credentials;
}

/**
 * @param {import('hono').Hono} app
 * @param {object} ctx
 * @param {object} ctx.settings - From loadSettings()
 * @param {Record<string, object>} [ctx.zones] - rapidoc-server.json's zones (none for a static build)
 * @param {object | null} ctx.sealer - From createSealer(); null without auth
 * @param {(c) => Promise<object | null>} ctx.userOf - The request's session user
 * @param {(c) => string} ctx.originOf - External origin of the portal
 * @param {string} [ctx.base] - The portal's base path
 * @param {Record<string, string | undefined>} ctx.env
 * @param {(line: string) => void} ctx.log
 * @param {typeof fetch} [ctx.fetch] - For the API calls (tests)
 * @returns {{ count: number }} how many tools the build has
 */
export function registerMcpRoutes(
  app,
  { settings, zones = {}, sealer, userOf, originOf, base = "", env, log, fetch: fetchImpl },
) {
  const { tools, resources, count } = loadMcpManifests(settings.distDir, settings.manifest?.mcp);
  const serverInfo = { name: settings.manifest?.site?.title || "RapiDoc portal", version: "1.0.0" };
  const names = (c) => cookieNames(originOf(c).startsWith("https:"));
  const now = () => Math.floor(Date.now() / 1000);

  const visible = (entry, user) =>
    entry.zones.every((zone) => zone === "public" || allows(zones[zone], user));

  /** `{ user, apiToken }` of the request's bearer token (none: anonymous), or null for a bad token. */
  const agentOf = async (c) => {
    const header = c.req.header("authorization") || "";
    if (!/^bearer /i.test(header)) return { user: null, apiToken: null };
    if (!sealer) return null;
    const payload = await sealer.open(header.slice(7).trim());
    if (!payload?.mcp) return null;
    const apiToken = payload.apiToken && payload.apiExp > now() ? payload.apiToken : null;
    return { user: payload.user, apiToken };
  };

  const runtimeFor = (manifest, apiToken, cache) => {
    if (!cache.has(manifest)) {
      cache.set(
        manifest,
        createMcpRuntime(manifest, {
          credentials: credentialsFor(manifest, apiToken, env),
          ...(fetchImpl && { fetch: fetchImpl }),
        }),
      );
    }
    return cache.get(manifest);
  };

  app.all(MCP_PATH, async (c) => {
    const agent = await agentOf(c);
    if (!agent) {
      c.header("www-authenticate", `Bearer realm="${MCP_PATH}", error="invalid_token"`);
      return c.json({ error: "invalid or expired token" }, 401);
    }
    const { user, apiToken } = agent;
    const runtimes = new Map();
    const server = new Server(serverInfo, { capabilities: { tools: {}, resources: {} } });
    server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [...tools.entries()]
        .filter(([, entry]) => visible(entry, user))
        .map(([name, { manifest }]) =>
          runtimeFor(manifest, apiToken, runtimes)
            .listTools()
            .find((t) => t.name === name),
        ),
    }));
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const name = request.params.name;
      const entry = tools.get(name);
      if (!entry || !visible(entry, user))
        return { content: [{ type: "text", text: `Unknown tool "${name}"` }], isError: true };
      log(`mcp: ${user?.sub || "anonymous"} ${name}`);
      return runtimeFor(entry.manifest, apiToken, runtimes).callTool(
        name,
        request.params.arguments ?? {},
      );
    });
    server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [...resources.entries()]
        .filter(([, entry]) => visible(entry, user))
        .map(([uri, { manifest }]) =>
          runtimeFor(manifest, apiToken, runtimes)
            .listResources()
            .find((r) => r.uri === uri),
        ),
    }));
    server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const entry = resources.get(request.params.uri);
      if (!entry || !visible(entry, user))
        throw new Error(`Unknown resource ${request.params.uri}`);
      return runtimeFor(entry.manifest, apiToken, runtimes).readResource(request.params.uri);
    });

    // Stateless: a transport and server per request, JSON answers (no event stream to keep open)
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    await server.connect(transport);
    try {
      const response = await transport.handleRequest(c.req.raw);
      response.headers.set("cache-control", NO_STORE);
      return response;
    } finally {
      await transport.close().catch(() => {});
    }
  });

  if (sealer) {
    // A token for the reader's agents: their session and, with auth.tryIt, their API access token, sealed
    // like the cookies. It lasts as long as the session does.
    app.post(MCP_TOKEN_PATH, async (c) => {
      c.header("cache-control", NO_STORE);
      c.header("vary", "Cookie");
      if (!isSameOrigin(c, originOf(c))) return c.json({ error: "same-origin only" }, 403);
      const user = await userOf(c);
      if (!user) return c.json({ error: "sign-in required" }, 401);
      const saved = settings.auth.tryIt && (await sealer.open(getCookie(c, names(c).apiToken)));
      const exp = user.exp || now() + settings.auth.sessionMaxAge;
      const { exp: _exp, iat: _iat, ...session } = user;
      const token = await sealer.seal(
        {
          mcp: true,
          user: session,
          ...(saved?.token && { apiToken: saved.token, apiExp: saved.exp }),
        },
        Math.max(1, exp - now()),
      );
      log(`mcp token: ${user.sub}`);
      return c.json({ token, expires_at: exp, url: `${originOf(c)}${base}${MCP_PATH}` });
    });
  }

  return { count };
}
