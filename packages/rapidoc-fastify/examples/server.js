// node examples/server.js → http://localhost:4405/docs
import Fastify from "fastify";
import { rapidoc } from "../src/index.js";

const fastify = Fastify();

fastify.get("/hello", async (request) => ({ message: `Hello, ${request.query.name ?? "world"}!` }));

fastify.get("/openapi.json", async () => ({
  openapi: "3.1.0",
  info: { title: "Fastify example", version: "1.0.0" },
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
}));

await fastify.register(rapidoc, {
  specUrl: "/openapi.json",
  title: "Fastify example",
  options: { renderStyle: "focused" },
});

const port = Number(process.env.PORT ?? 4405);
await fastify.listen({ port });
console.log(`RapiDoc at http://localhost:${port}/docs`);
