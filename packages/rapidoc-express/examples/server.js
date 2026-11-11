// node examples/server.js → http://localhost:4404/docs
import express from "express";
import { rapidoc } from "../src/index.js";

const app = express();

app.get("/hello", (req, res) => res.json({ message: `Hello, ${req.query.name ?? "world"}!` }));

app.get("/openapi.json", (req, res) =>
  res.json({
    openapi: "3.1.0",
    info: { title: "Express example", version: "1.0.0" },
    paths: {
      "/hello": {
        get: {
          summary: "Say hello",
          tags: ["Greetings"],
          parameters: [{ name: "name", in: "query", schema: { type: "string", example: "world" } }],
          responses: { 200: { description: "A greeting" } },
        },
      },
    },
  }),
);

app.use(
  rapidoc({
    specUrl: "/openapi.json",
    title: "Express example",
    options: { renderStyle: "focused" },
  }),
);

const port = Number(process.env.PORT ?? 4404);
app.listen(port, () => console.log(`RapiDoc at http://localhost:${port}/docs`));
