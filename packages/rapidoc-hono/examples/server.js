// node examples/server.js → http://localhost:4401/docs
// A Hono app with one endpoint, its OpenAPI document, and RapiDoc.
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { rapidoc } from "../src/index.js";

const app = new Hono();

app.get("/hello", (c) => c.json({ message: `Hello, ${c.req.query("name") ?? "world"}!` }));

app.get("/openapi.json", (c) =>
  c.json({
    openapi: "3.1.0",
    info: { title: "Hono example", version: "1.0.0" },
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
  }),
);

app.use(
  rapidoc({
    specUrl: "/openapi.json",
    title: "Hono example",
    options: { renderStyle: "focused", colorScheme: "light", showHeader: false },
  }),
);

const port = Number(process.env.PORT ?? 4401);
serve({ fetch: app.fetch, port }, () => console.log(`RapiDoc at http://localhost:${port}/docs`));
