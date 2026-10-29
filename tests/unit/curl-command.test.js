import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  generateCurlCommand,
  deduplicateHeaderValues,
} from "../../packages/rapidoc/src/utils/curl-utils.js";

describe("curl-utils", () => {
  describe("deduplicateHeaderValues", () => {
    it("should deduplicate case-insensitive tokens in comma-separated header", () => {
      const result = deduplicateHeaderValues(
        "application/json, text/plain, Application/JSON, text/html",
      );
      assert.equal(result, "application/json, text/plain, text/html");
    });

    it("should return empty string or original value for falsy inputs", () => {
      assert.equal(deduplicateHeaderValues(""), "");
      assert.equal(deduplicateHeaderValues(null), "");
      assert.equal(deduplicateHeaderValues(undefined), "");
    });
  });

  describe("generateCurlCommand", () => {
    it("should generate basic GET command with full URL", () => {
      const curl = generateCurlCommand({
        method: "GET",
        url: "https://api.example.com/v1/users",
      });
      assert.equal(curl, 'curl -X GET "https://api.example.com/v1/users"');
    });

    it("should resolve relative URLs using baseLocation", () => {
      const curl = generateCurlCommand({
        method: "GET",
        url: "/v1/users",
        baseLocation: "https://example.com/docs/api",
      });
      assert.equal(curl, 'curl -X GET "https://example.com/v1/users"');
    });

    it("should format headers and deduplicate duplicate header values", () => {
      const headers = new Headers();
      headers.append("Accept", "application/json, application/json, text/plain");
      headers.append("Authorization", "Bearer token123");

      const curl = generateCurlCommand({
        method: "GET",
        url: "https://api.example.com/v1/users",
        headers,
      });

      assert.ok(curl.includes("-H 'accept: application/json, text/plain'"));
      assert.ok(curl.includes("-H 'authorization: Bearer token123'"));
    });

    it("should format URLSearchParams body with -d flag", () => {
      const body = new URLSearchParams();
      body.append("grant_type", "password");
      body.append("username", "alice");

      const curl = generateCurlCommand({
        method: "POST",
        url: "https://api.example.com/oauth/token",
        body,
      });

      assert.ok(curl.includes("-d grant_type=password&username=alice"));
    });

    it("should format FormData body with -F flags and quote sanitation", () => {
      const body = new FormData();
      body.append("description", 'User "quoted" name & info');
      body.append("tags", "alpha");

      const curl = generateCurlCommand({
        method: "POST",
        url: "https://api.example.com/upload",
        body,
      });

      assert.ok(curl.includes('-F "description=User \\"quoted\\" name & info"'));
      assert.ok(curl.includes('-F "tags=alpha"'));
    });

    it("should format JSON string body with escaped single quotes", () => {
      const curl = generateCurlCommand({
        method: "POST",
        url: "https://api.example.com/items",
        body: JSON.stringify({ name: "O'Reilly", count: 5 }),
        contentType: "application/json",
      });

      // Single quote in JSON should be escaped as '\''
      assert.ok(curl.includes('-d \'{"name":"O\'\\\'\'Reilly","count":5}\''));
    });

    it("should format plain text body with escaped single quotes", () => {
      const curl = generateCurlCommand({
        method: "POST",
        url: "https://api.example.com/notes",
        body: "Note for today's meeting",
        contentType: "text/plain",
      });

      assert.ok(curl.includes("-d 'Note for today'\"'\"'s meeting'"));
    });
  });
});
