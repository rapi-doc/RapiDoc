// mock.config.yaml: the user's corrections to what the stateful mock worked out.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createMockApp } from "../src/index.js";
import { classifySpec } from "../src/stateful/classify.js";
import { applyConfig, configFor } from "../src/stateful/config.js";
import { quiet } from "./helpers.js";

const json = (schema) => ({ content: { "application/json": { schema } } });
const ref = (name) => ({ $ref: `#/components/schemas/${name}` });
const param = (name, where = "path") => ({
  name,
  in: where,
  required: where === "path",
  schema: { type: "string" },
});

/** Pods keyed by a nested name; videos with the id in the query string, never in the path. */
const doc = {
  openapi: "3.1.0",
  info: { title: "Config", version: "1" },
  paths: {
    "/namespaces/{namespace}/pods": {
      get: {
        operationId: "listPods",
        parameters: [param("namespace")],
        responses: { 200: json({ type: "array", items: ref("Pod") }) },
      },
      post: {
        operationId: "createPod",
        parameters: [param("namespace")],
        requestBody: json(ref("Pod")),
        responses: { 201: json(ref("Pod")) },
      },
    },
    "/namespaces/{namespace}/pods/{name}": {
      parameters: [param("namespace"), param("name")],
      get: { operationId: "readPod", responses: { 200: json(ref("Pod")) } },
      delete: { operationId: "deletePod", responses: { 204: { description: "Gone" } } },
    },
    "/videos": {
      get: {
        operationId: "listVideos",
        parameters: [param("id", "query")],
        responses: { 200: json({ type: "array", items: ref("Video") }) },
      },
      post: {
        operationId: "createVideo",
        requestBody: json(ref("Video")),
        responses: { 200: json(ref("Video")) },
      },
      delete: {
        operationId: "deleteVideo",
        parameters: [param("id", "query")],
        responses: { 204: { description: "Gone" } },
      },
    },
    "/videos/rate": {
      post: {
        operationId: "rateVideo",
        requestBody: json(ref("Video")),
        responses: { 204: { description: "Done" } },
      },
    },
  },
  components: {
    schemas: {
      Pod: {
        type: "object",
        properties: {
          kind: { type: "string" },
          metadata: { type: "object", properties: { name: { type: "string" } } },
        },
      },
      Video: { type: "object", properties: { id: { type: "string" }, title: { type: "string" } } },
    },
  },
};

const config = {
  resources: { Pod: { key: "metadata.name" } },
  operations: {
    deleteVideo: { resource: "Video", action: "delete", key: "query.id" },
    "POST /videos/rate": { action: "none" },
  },
};

/** The document as a file, for createMockApp. */
function specFile(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-mock-config-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const file = path.join(dir, "api.json");
  fs.writeFileSync(file, JSON.stringify(doc));
  return file;
}

const clientOf = (app) => async (method, url, body) => {
  const response = await app.request(url, {
    method,
    headers: body ? { "content-type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  try {
    return { status: response.status, body: JSON.parse(text) };
  } catch {
    return { status: response.status, body: text };
  }
};

describe("mock.config.yaml", () => {
  it("without it, a nested key and a key in the query keep no state", () => {
    const model = classifySpec(structuredClone(doc));
    assert.equal(model.resources.Pod.key, null);
    assert.equal(model.operations.deleteVideo.action, "none");
  });

  it("sets a resource's key and an operation's action, and takes them as stated", () => {
    const model = classifySpec(structuredClone(doc));
    const warnings = applyConfig(doc, model, config);
    assert.deepEqual(warnings, []);
    assert.deepEqual(model.resources.Pod, {
      path: "/namespaces/{}/pods/{}",
      key: "metadata.name",
      configured: true,
    });
    assert.deepEqual(model.operations.deleteVideo, {
      resource: "Video",
      action: "delete",
      keyFrom: "query.id",
      configured: true,
    });
    assert.deepEqual(model.operations.rateVideo, { action: "none", configured: true });
    assert.equal(
      model.review.some((line) => /^(resources\.Pod|deleteVideo): /.test(line)),
      false,
      "what the user stated is no longer under review",
    );
  });

  it("reports what no longer fits the spec, and applies the rest", () => {
    const model = classifySpec(structuredClone(doc));
    const warnings = applyConfig(doc, model, {
      resources: {
        Pod: { key: "metadata.title", color: "red" },
        Ghost: { key: "id" },
        Video: { key: "id" },
      },
      operations: {
        noSuchOperation: { action: "none" },
        deleteVideo: { resource: "Video", action: "delete", key: "query.videoId" },
        listVideos: { action: "explode" },
        readPod: { resource: "Nothing" },
      },
      relations: {},
    });
    assert.deepEqual(warnings, [
      "relations: not a setting (there are: resources, operations)",
      "resources.Pod.color: not a setting of a resource (there is: key)",
      "resources.Pod.key: Pod has no field metadata.title",
      "resources.Ghost: the spec has no resource or schema named Ghost (resources: Pod, Video)",
      "operations.noSuchOperation: the spec has no operation with that id, or that method and path",
      "operations.deleteVideo.key: the operation has no query parameter videoId",
      "operations.listVideos.action: must be one of none, list, create, createMany, read, update, patch, delete",
      "operations.readPod.resource: Nothing is not a resource (set its key under resources.Nothing to make it one)",
    ]);
    assert.equal(model.resources.Pod.key, null, "a wrong key is not applied");
    assert.equal(model.resources.Video.key, "id");
    assert.equal(model.operations.deleteVideo.action, "none", "a wrong entry changes nothing");
  });

  it("takes the top level for one API, and apis.<id> for several", () => {
    assert.deepEqual(configFor(config, "a", ["a"]), { section: config, warnings: [] });
    const several = configFor(config, "a", ["a", "b"]);
    assert.equal(several.section, undefined);
    assert.match(several.warnings[0], /put them under apis\.<api id>/);
    assert.deepEqual(configFor({ apis: { b: config } }, "b", ["a", "b"]).section, config);
    assert.match(
      configFor({ apis: { c: config } }, "a", ["a", "b"]).warnings[0],
      /apis\.c: no API with that id/,
    );
    assert.deepEqual(configFor(undefined, "a", ["a"]), { section: undefined, warnings: [] });
  });

  it("makes the server keep state where it could not: a nested key, a key in the query", async (t) => {
    const warned = [];
    const { app } = await createMockApp({
      apis: [{ id: "api", fullPath: specFile(t) }],
      stateful: { rows: 2, config, configFile: "mock.config.yaml" },
      ...quiet,
      warn: (line) => warned.push(line),
    });
    const call = clientOf(app);
    assert.deepEqual(warned, []);

    const pod = { kind: "Pod", metadata: { name: "web" } };
    assert.equal((await call("POST", "/api/namespaces/prod/pods", pod)).status, 201);
    assert.deepEqual((await call("GET", "/api/namespaces/prod/pods/web")).body, pod);
    assert.equal(
      (await call("GET", "/api/namespaces/test/pods/web")).status,
      404,
      "another namespace",
    );
    assert.equal((await call("DELETE", "/api/namespaces/prod/pods/web")).status, 204);
    assert.equal((await call("GET", "/api/namespaces/prod/pods/web")).status, 404);

    const video = (await call("POST", "/api/videos", { title: "Intro" })).body;
    assert.equal((await call("GET", "/api/videos")).body.length, 3);
    assert.equal((await call("DELETE", `/api/videos?id=${video.id}`)).status, 204);
    assert.equal((await call("GET", "/api/videos")).body.length, 2);
    assert.equal((await call("DELETE", `/api/videos?id=${video.id}`)).status, 404, "already gone");

    // new seed data keeps the corrections
    await call("POST", "/__mock/reset", { rows: 1, seed: 3 });
    await call("POST", "/api/namespaces/prod/pods", pod);
    assert.deepEqual((await call("GET", "/api/namespaces/prod/pods/web")).body, pod);
  });

  it("names the file and the API in a warning about a stale entry", async (t) => {
    const warned = [];
    await createMockApp({
      apis: [{ id: "api", fullPath: specFile(t) }],
      stateful: {
        config: { resources: { Ghost: { key: "id" } } },
        configFile: "conf/mock.config.yaml",
      },
      ...quiet,
      warn: (line) => warned.push(line),
    });
    assert.equal(warned.length, 1);
    assert.match(
      warned[0],
      /^conf\/mock\.config\.yaml: api: resources\.Ghost: the spec has no resource/,
    );
  });
});
