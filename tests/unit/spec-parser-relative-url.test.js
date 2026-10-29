import { describe, it, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";

// https://github.com/rapi-doc/RapiDoc/issues/1151
describe("ProcessSpec with a relative spec-url", () => {
  const rootSpec = [
    "openapi: 3.0.0",
    'info: { title: T, version: "1" }',
    "paths:",
    "  /x:",
    "    get:",
    "      responses:",
    '        "200":',
    "          description: ok",
    "          content:",
    "            application/json:",
    '              schema: { $ref: "models.yaml#/Thing" }',
  ].join("\n");
  const models = "Thing: { type: object, properties: { id: { type: integer } } }";
  const files = {
    "/docs/a/z.yaml": rootSpec,
    "/docs/a/models.yaml": models,
    "/a/z.yaml": rootSpec,
    "/a/models.yaml": models,
  };

  const requested = [];
  let savedWindow;
  let savedFetch;
  let ProcessSpec;

  before(async () => {
    savedWindow = globalThis.window;
    savedFetch = globalThis.fetch;
    globalThis.window = { location: { href: "http://example.test/docs/index.html" } };
    globalThis.fetch = async (url) => {
      const { pathname } = new URL(url);
      requested.push(pathname);
      const body = files[pathname];
      return {
        ok: body !== undefined,
        status: body !== undefined ? 200 : 404,
        url: String(url),
        text: async () => body ?? "",
      };
    };
    ({ default: ProcessSpec } = await import("../../packages/rapidoc/src/utils/spec-parser.js"));
  });

  after(() => {
    globalThis.window = savedWindow;
    globalThis.fetch = savedFetch;
  });

  beforeEach(() => {
    requested.length = 0;
  });

  const refResolved = (spec) =>
    !!spec.tags?.[0]?.paths?.[0]?.responses?.["200"]?.content?.["application/json"]?.schema
      ?.properties?.id;

  for (const specUrl of ["a/z.yaml", "./a/z.yaml"]) {
    it(`fetches "${specUrl}" relative to the page, not to itself`, async () => {
      const spec = await ProcessSpec(specUrl);
      assert.ok(!spec.specLoadError, "Spec loads");
      assert.deepEqual(requested, ["/docs/a/z.yaml", "/docs/a/models.yaml"]);
      assert.ok(refResolved(spec), "A relative $ref resolves against the spec file");
    });
  }

  it("keeps root-relative paths and absolute URLs as they are", async () => {
    await ProcessSpec("/a/z.yaml");
    assert.deepEqual(requested, ["/a/z.yaml", "/a/models.yaml"]);

    requested.length = 0;
    await ProcessSpec("http://example.test/docs/a/z.yaml");
    assert.deepEqual(requested, ["/docs/a/z.yaml", "/docs/a/models.yaml"]);
  });
});
