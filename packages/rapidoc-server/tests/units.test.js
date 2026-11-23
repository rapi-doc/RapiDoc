import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { allows, decide, emailMatches } from "../src/access.js";
import { claimList, createProviderSource, emailVerified, isUnreachable } from "../src/auth/oidc.js";
import { logValue, safeReturnTo } from "../src/auth/routes.js";
import { createSealer } from "../src/auth/session.js";
import { normalizePath, parseDuration } from "../src/settings.js";
import { candidateFiles } from "../src/static.js";

describe("rapidoc serve helpers", () => {
  it("matches email patterns case-insensitively, with * as a wildcard", () => {
    assert.ok(emailMatches("*@example.com", "Jane@Example.com"));
    assert.ok(emailMatches("jane@example.com", "jane@example.com"));
    assert.ok(!emailMatches("*@example.com", "jane@example.com.evil.io"));
    assert.ok(!emailMatches("*@example.com", "jane@sub.examplexcom"));
    assert.ok(!emailMatches("*@example.com", ""));
  });

  it("decides per zone: allow, sign-in or forbidden", () => {
    const members = { kind: "members", groups: ["a"], emails: [] };
    assert.equal(decide({ z: members }, "z", null), "sign-in");
    assert.equal(decide({ z: members }, "z", { groups: ["b"] }), "forbidden");
    assert.equal(decide({ z: members }, "z", { groups: ["a"] }), "allow");
    assert.equal(
      decide({}, "unknown", { groups: ["a"] }),
      "forbidden",
      "unknown zones are never served",
    );
    assert.ok(allows({ kind: "signed-in" }, {}));
  });

  it("reads groups from dotted claim paths, arrays or strings", () => {
    assert.deepEqual(claimList({ realm_access: { roles: ["x", "y", 3] } }, "realm_access.roles"), [
      "x",
      "y",
    ]);
    assert.deepEqual(claimList({ groups: "a b,c" }, "groups"), ["a", "b", "c"]);
    assert.deepEqual(claimList({}, "groups"), []);
  });

  it("counts an email as verified only when the provider says so", () => {
    assert.ok(emailVerified({ email_verified: true }));
    assert.ok(emailVerified({ email_verified: "true" }), "Cognito sends a string");
    assert.ok(emailVerified({ xms_edov: true }), "Entra ID: domain verified by the tenant");
    assert.ok(emailVerified({ xms_edov: 1 }));
    assert.ok(!emailVerified({}), "no claim: not verified (Entra ID without xms_edov)");
    assert.ok(!emailVerified({ email_verified: false }));
    assert.ok(!emailVerified({ email_verified: "false" }));
    assert.ok(!emailVerified({ xms_edov: false }));
  });

  it("tells a provider that is down from a wrong issuer", () => {
    const coded = (code, cause) => Object.assign(new Error("x"), { code, cause });
    assert.ok(isUnreachable(new TypeError("fetch failed")));
    assert.ok(isUnreachable(coded("OAUTH_TIMEOUT")));
    assert.ok(isUnreachable(coded("OAUTH_RESPONSE_IS_NOT_CONFORM", { status: 503 })));
    assert.ok(!isUnreachable(coded("OAUTH_RESPONSE_IS_NOT_CONFORM", { status: 404 })));
    assert.ok(!isUnreachable(coded("OAUTH_JSON_ATTRIBUTE_COMPARISON_FAILED")));
    assert.ok(!isUnreachable(coded("OAUTH_RESPONSE_IS_NOT_JSON")));
    assert.ok(!isUnreachable(new Error("anything else")));
  });

  it("discovers the provider again only after a back-off, one try at a time", async () => {
    let clock = 0;
    let tries = 0;
    let up = false;
    const config = { discovered: true };
    const source = createProviderSource(
      { issuer: "https://id.example.com" },
      {
        now: () => clock,
        discover: async () => {
          tries++;
          if (!up) throw new TypeError("fetch failed");
          return config;
        },
      },
    );
    assert.equal(source.current(), null);
    assert.deepEqual(await Promise.all([source.get(), source.get()]), [null, null]);
    assert.equal(tries, 1, "requests that arrive together share one try");

    up = true;
    clock = 4999;
    assert.equal(await source.get(), null);
    assert.equal(tries, 1, "not asked again within 5 seconds");
    up = false;
    clock = 5000;
    assert.equal(await source.get(), null);
    assert.equal(tries, 2);
    clock = 5000 + 9999;
    assert.equal(await source.get(), null);
    assert.equal(tries, 2, "the wait doubles after each failure");

    up = true;
    clock = 5000 + 10000;
    assert.equal(await source.get(), config);
    assert.equal(source.current(), config);
    assert.equal(await source.get(), config);
    assert.equal(tries, 3, "discovered once");
  });

  it("writes outside values into a log line without control characters, cut short", () => {
    assert.equal(logValue("a\r\nb\u001b[31m"), "a  b [31m");
    assert.equal(logValue(undefined), "");
    assert.equal(logValue("x".repeat(300)).length, 203);
  });

  it("parses session lengths", () => {
    assert.equal(parseDuration("30m"), 1800);
    assert.equal(parseDuration("8h"), 28800);
    assert.equal(parseDuration("7d"), 604800);
    assert.equal(parseDuration("8 hours"), null);
  });

  it("keeps sign-in return paths on this site", () => {
    assert.equal(safeReturnTo("/docs/a?x=1#y"), "/docs/a?x=1#y");
    for (const bad of [
      undefined,
      "",
      "https://evil.example",
      "//evil.example",
      "/\\evil.example",
      "/a\nb",
      "/_rapidoc/auth/login",
    ]) {
      assert.equal(safeReturnTo(bad), "/", String(bad));
    }
  });

  it("keeps sign-in return paths inside the base path", () => {
    assert.equal(safeReturnTo("/dev/docs/a", "/dev"), "/dev/docs/a");
    for (const bad of ["/docs/a", "/developers/x", "/dev/_rapidoc/auth/login", "//evil.example"]) {
      assert.equal(safeReturnTo(bad, "/dev"), "/dev/", bad);
    }
  });

  it("normalizes base and mount paths", () => {
    assert.equal(normalizePath("/developers/"), "/developers");
    assert.equal(normalizePath("sales/developers"), "/sales/developers");
    for (const root of [undefined, "", "/", "//"])
      assert.equal(normalizePath(root), "", String(root));
  });

  it("maps URL paths to built files and refuses traversal", () => {
    assert.deepEqual(candidateFiles("/"), ["index.html"]);
    assert.deepEqual(candidateFiles("/docs/a/"), ["docs/a/index.html"]);
    assert.deepEqual(candidateFiles("/docs/a"), ["docs/a", "docs/a/index.html"]);
    assert.deepEqual(candidateFiles("/docs/my%20page/"), ["docs/my page/index.html"]);
    assert.equal(candidateFiles("/a/..%2fb"), null);
    assert.equal(candidateFiles("/a/%ZZ"), null);
  });

  it("seals and opens cookies, and rejects other keys and expired tokens", async () => {
    const sealer = createSealer("s".repeat(32));
    const token = await sealer.seal({ sub: "u1" }, 60, "session");
    assert.equal((await sealer.open(token, "session")).sub, "u1");
    assert.equal(await createSealer("t".repeat(32)).open(token, "session"), null);
    assert.equal(
      await sealer.open(await sealer.seal({ sub: "u1" }, -120, "session"), "session"),
      null,
    );
  });

  it("never opens a token sealed for one use as another", async () => {
    const sealer = createSealer("s".repeat(32));
    const uses = ["session", "sign-in", "api-token", "mcp"];
    for (const sealedFor of uses) {
      const token = await sealer.seal({ sub: "u1" }, 60, sealedFor);
      for (const openedAs of uses) {
        const payload = await sealer.open(token, openedAs);
        if (openedAs === sealedFor) assert.equal(payload.sub, "u1");
        else assert.equal(payload, null, `a ${sealedFor} token must not open as ${openedAs}`);
      }
    }
    await assert.rejects(() => sealer.seal({}, 60), /Unknown seal use/);
    await assert.rejects(() => sealer.open("x"), /Unknown seal use/);
  });
});
