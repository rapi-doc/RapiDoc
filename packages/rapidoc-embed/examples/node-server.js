// A complete integration in plain Node, as a reference for integration authors:
//   node examples/node-server.js            → http://localhost:4400/docs
//   ASSETS=cdn node examples/node-server.js → the bundle from the CDN
// The route table and both pages come from @rapidoc/embed; this file only maps them to HTTP.
import http from "node:http";
import { embedRoutes, renderHostPage, renderOAuthReceiverPage } from "../src/index.js";
import { readAsset } from "../src/node.js";

const port = Number(process.env.PORT ?? 4400);

/** The options every integration takes (docs: "Build an integration"). */
const options = {
  path: "/docs",
  specUrl: "/openapi.json",
  title: "Example API",
  assets: process.env.ASSETS === "cdn" ? "cdn" : "bundled",
  options: { renderStyle: "focused", colorScheme: "light", showHeader: false },
};

const spec = {
  openapi: "3.1.0",
  info: {
    title: "Example API",
    version: "1.0.0",
    description: "Served by `examples/node-server.js`.",
  },
  paths: {
    "/hello": {
      get: {
        summary: "Say hello",
        tags: ["Greetings"],
        parameters: [{ name: "name", in: "query", schema: { type: "string", example: "world" } }],
        responses: {
          200: {
            description: "A greeting",
            content: {
              "application/json": {
                schema: { type: "object", properties: { message: { type: "string" } } },
              },
            },
          },
        },
      },
    },
  },
};

const routes = new Map(embedRoutes(options).map((route) => [route.path, route]));

http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    const pathname = url.pathname.length > 1 ? url.pathname.replace(/\/$/, "") : url.pathname;
    const send = (contentType, body) => {
      res.writeHead(200, { "content-type": contentType });
      res.end(body);
    };

    if (pathname === "/openapi.json") return send("application/json", JSON.stringify(spec));
    if (pathname === "/hello") {
      const name = url.searchParams.get("name") ?? "world";
      return send("application/json", JSON.stringify({ message: `Hello, ${name}!` }));
    }

    const route = routes.get(pathname);
    if (!route) {
      res.writeHead(404, { "content-type": "text/plain" });
      return res.end("Not found");
    }
    if (route.kind === "page") return send(route.contentType, renderHostPage(options));
    if (route.kind === "oauth-receiver") {
      return send(route.contentType, renderOAuthReceiverPage(options));
    }
    return send(route.contentType, readAsset(route.file));
  })
  .listen(port, () => console.log(`RapiDoc at http://localhost:${port}${options.path}`));
