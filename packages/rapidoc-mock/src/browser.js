/**
 * The stateful mock without a server: `createBrowserMock(doc)` makes of one OpenAPI document what
 * `rapidoc mock --stateful` makes of it (resources, seed records, the label of every operation) and answers the
 * control API (control.js) as a function. The Mock UI takes that function as its `source`, so a page can show
 * what the mock would do with a spec, with nothing sent anywhere.
 *
 *   const mock = await createBrowserMock(doc, { id: "petstore" });
 *   document.querySelector("rapidoc-mock-ui").source = mock.source;
 *
 * It keeps state and describes operations; it does not answer the API's own requests (no router, no request
 * validation, no token checks): that is the server's work. Nothing here may import a Node module, hono or
 * openapi-backend: this file is bundled for a browser (the Rapi Mock site's spec check).
 */
import { control } from "./control.js";
import { createResponder } from "./responses.js";
import { createRuntime } from "./runtime.js";
import { listOperations } from "./spec.js";
import { createStateful } from "./stateful/handlers.js";

/**
 * @param {object} doc - An OpenAPI 3.0, 3.1 or 3.2 document, parsed, with its `$ref`s internal (`#/...`); a
 *   reference to another file is not followed
 * @param {object} [options]
 * @param {string} [options.id="api"] - The API's id, as `rapidoc mock` would name it after its file
 * @param {number} [options.seed=1]
 * @param {number} [options.rows=10] - Seed records per resource
 * @param {object} [options.config] - This API's corrections (`{ resources, operations }`, see stateful/config.js)
 * @returns {Promise<{ source: Function, api: object, failed: Record<string, string> }>} `source` is the Mock
 *   UI's; `failed` names the resources that could not be seeded (they start empty) and why
 */
export async function createBrowserMock(doc, { id = "api", seed = 1, rows = 10, config } = {}) {
  if (typeof doc?.openapi !== "string" || !/^3\.[012]\./.test(doc.openapi)) {
    const version = doc?.openapi || (doc?.swagger && `Swagger ${doc.swagger}`) || "no version";
    throw new Error(`This is not OpenAPI 3.0, 3.1 or 3.2 (${version}).`);
  }
  const operations = listOperations(doc);
  const state = await createStateful(doc, { seed, rows, config });
  state.config = config;
  const api = {
    id,
    title: doc.info?.title,
    doc,
    state,
    byKey: new Map(operations.map((op) => [`${op.method} ${op.path}`, op])),
    operations: operations.length,
    respond: createResponder(doc, { seed }),
  };
  const apis = [api];
  const runtime = createRuntime({
    settings: { delay: 0, seed, rows },
    started: { stateful: true, streamInterval: 0 },
  });

  /** The control API as a function: what `<rapidoc-mock-ui>` takes as its `source`. */
  async function source({ method = "GET", path, body, session }) {
    const url = new URL(path, "http://mock.invalid");
    const response = await control(
      {
        method,
        segments: url.pathname.split("/").filter(Boolean).map(decodeURIComponent),
        query: url.searchParams,
        session,
        body: async () => {
          if (body === undefined) throw new Error("no body");
          return body;
        },
      },
      apis,
      runtime,
    );
    return { status: response.status, data: response.body ? JSON.parse(response.body) : null };
  }

  return { source, api, failed: state.report.failed || {} };
}
