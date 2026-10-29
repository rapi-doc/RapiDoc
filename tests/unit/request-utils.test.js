import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  serializeHeaderValue,
  constructFetchHeaders,
  buildUrlEncodedBody,
  buildMultipartFormData,
} from "../../packages/rapidoc/src/utils/request-utils.js";

describe("request-utils", () => {
  describe("serializeHeaderValue", () => {
    it("should serialize primitive values", () => {
      assert.equal(serializeHeaderValue("application/json"), "application/json");
      assert.equal(serializeHeaderValue(12345), "12345");
      assert.equal(serializeHeaderValue(true), "true");
    });

    it("should serialize array values as comma-separated list", () => {
      assert.equal(serializeHeaderValue(["gzip", "deflate", "br"]), "gzip,deflate,br");
      assert.equal(serializeHeaderValue(["gzip", "", null, "br"]), "gzip,br");
    });

    it("should serialize object with explode: true using key=value pairs", () => {
      const obj = { role: "admin", tier: 2 };
      assert.equal(
        serializeHeaderValue(obj, { explode: true, isObject: true }),
        "role=admin,tier=2",
      );
    });

    it("should serialize object with explode: false using key,value pairs", () => {
      const obj = { role: "admin", tier: 2 };
      assert.equal(
        serializeHeaderValue(obj, { explode: false, isObject: true }),
        "role,admin,tier,2",
      );
    });

    it("should parse and serialize JSON string object", () => {
      const jsonStr = '{"region": "us-east", "env": "prod"}';
      assert.equal(
        serializeHeaderValue(jsonStr, { explode: true, isObject: true }),
        "region=us-east,env=prod",
      );
    });

    it("should return empty string for null, undefined, or empty value", () => {
      assert.equal(serializeHeaderValue(null), "");
      assert.equal(serializeHeaderValue(undefined), "");
      assert.equal(serializeHeaderValue(""), "");
    });
  });

  describe("constructFetchHeaders", () => {
    it("should construct headers with Accept, API keys, header params, and Content-Type", () => {
      const headers = constructFetchHeaders({
        accept: "application/json",
        apiKeys: [{ in: "header", name: "X-API-Key", finalKeyValue: "key-123" }],
        headerParams: [
          { name: "X-Request-ID", value: "req-456" },
          { name: "X-Custom-Obj", value: { a: 1, b: 2 }, explode: true, isObject: true },
        ],
        contentType: "application/json",
      });

      assert.equal(headers.get("Accept"), "application/json");
      assert.equal(headers.get("X-API-Key"), "key-123");
      assert.equal(headers.get("X-Request-ID"), "req-456");
      assert.equal(headers.get("X-Custom-Obj"), "a=1,b=2");
      assert.equal(headers.get("Content-Type"), "application/json");
    });

    it("should omit Content-Type when contentType contains form-data (to let browser set boundary)", () => {
      const headers = constructFetchHeaders({
        contentType: "multipart/form-data; boundary=---123",
      });
      assert.equal(headers.get("Content-Type"), null);
    });
  });

  describe("buildUrlEncodedBody", () => {
    it("should format URLSearchParams from structured fields", () => {
      const params = buildUrlEncodedBody([
        { name: "username", value: "alice", isArray: false },
        { name: "roles", value: ["admin", "editor"], isArray: true },
      ]);

      assert.equal(params.get("username"), "alice");
      assert.equal(params.get("roles"), "admin,editor");
    });

    it("should build params from dynamic JSON template", () => {
      const params = buildUrlEncodedBody(
        [],
        '{"grant_type": "client_credentials", "scope": "read"}',
      );
      assert.equal(params.get("grant_type"), "client_credentials");
      assert.equal(params.get("scope"), "read");
    });
  });

  describe("buildMultipartFormData", () => {
    it("should format FormData with primitive and array entries", () => {
      const formData = buildMultipartFormData([
        { name: "title", value: "New Document" },
        { name: "tags", value: ["work", "important"], isArray: true },
      ]);

      assert.equal(formData.get("title"), "New Document");
      assert.deepEqual(formData.getAll("tags"), ["work", "important"]);
    });
  });
});
