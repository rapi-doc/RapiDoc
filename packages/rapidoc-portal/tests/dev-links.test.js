/**
 * RAPIDOC_DEV_LINKS (engine/dev-links.js): `rapidoc dev` points links to other sites at local dev servers.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { devLinksPlugin, parseDevLinks, rewriteDevLinks } from "../src/engine/dev-links.js";

const LINKS = [
  { from: "https://example.com", to: "http://localhost:4329" },
  { from: "https://flow.example.com", to: "http://localhost:4330" },
];

describe("parseDevLinks", () => {
  it("reads <origin>=<origin> pairs, comma-separated, and ignores blanks", () => {
    const { links, problems } = parseDevLinks(
      " https://example.com=http://localhost:4329 ,, https://flow.example.com/=http://127.0.0.1:4330 ",
    );
    assert.deepEqual(links, [
      { from: "https://example.com", to: "http://localhost:4329" },
      { from: "https://flow.example.com", to: "http://127.0.0.1:4330" },
    ]);
    assert.deepEqual(problems, []);
  });

  it("reports parts that are not two origins", () => {
    const { links, problems } = parseDevLinks(
      "https://example.com,https://a.example/docs=http://localhost:1,ftp://a.example=http://localhost:2,https://b.example=http://localhost:3=x",
    );
    assert.deepEqual(links, []);
    assert.equal(problems.length, 4);
    assert.match(problems[0], /"https:\/\/example.com" is not <origin>=<origin>/);
  });

  it("is empty without a value", () => {
    assert.deepEqual(parseDevLinks(undefined), { links: [], problems: [] });
  });
});

describe("rewriteDevLinks", () => {
  it("rewrites href attributes that start with a mapped origin, keeping path, query and hash", () => {
    const html = `<a href="https://flow.example.com/docs/quickstart/">Q</a><a class="x" href='https://example.com/docs/?q=1#top'>D</a><a href="https://example.com">H</a>`;
    assert.equal(
      rewriteDevLinks(html, LINKS),
      `<a href="http://localhost:4330/docs/quickstart/">Q</a><a class="x" href='http://localhost:4329/docs/?q=1#top'>D</a><a href="http://localhost:4329">H</a>`,
    );
  });

  it("leaves other attributes, text, longer hosts and other sites alone", () => {
    const html = [
      `<rapi-doc spec-url="https://example.com/specs/petstore.yaml"></rapi-doc>`,
      `<code>&lt;a href="https://example.com/"&gt;</code>`,
      `<img src="https://example.com/logo.svg">`,
      `<a href="https://example.com.evil.test/">x</a>`,
      `<a href="https://other.test/">y</a>`,
      `<a data-href="https://example.com/">z</a>`,
    ].join("");
    assert.equal(rewriteDevLinks(html, LINKS), html);
  });

  it("does nothing without links", () => {
    assert.equal(
      rewriteDevLinks(`<a href="https://example.com/">x</a>`, []),
      `<a href="https://example.com/">x</a>`,
    );
  });
});

/** A response like Node's, recording what reaches the socket */
function fakeResponse() {
  const res = new EventEmitter();
  const headers = {};
  res.sent = "";
  res.headersSent = false;
  res.getHeader = (name) => headers[name.toLowerCase()];
  res.setHeader = (name, value) => (headers[name.toLowerCase()] = value);
  res.removeHeader = (name) => delete headers[name.toLowerCase()];
  res.write = (chunk) => {
    res.headersSent = true;
    res.sent += String(chunk);
    return true;
  };
  res.end = (chunk, encoding, callback) => {
    res.headersSent = true;
    if (chunk != null && typeof chunk !== "function") res.sent += String(chunk);
    res.ended = true;
    [chunk, encoding, callback].find((arg) => typeof arg === "function")?.();
  };
  return res;
}

function middleware(links) {
  let handler;
  devLinksPlugin(links).configureServer({ middlewares: { use: (fn) => (handler = fn) } });
  return handler;
}

describe("devLinksPlugin", () => {
  it("is a dev-only Vite plugin", () => {
    assert.equal(devLinksPlugin(LINKS).apply, "serve");
  });

  it("rewrites an HTML response sent in chunks, with its length", () => {
    const res = fakeResponse();
    middleware(LINKS)({}, res, () => {});
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Content-Length", "999");
    res.write(`<a href="https://flow.exa`);
    res.write(Buffer.from(`mple.com/docs/">Flow</a>`));
    res.end();
    assert.equal(res.sent, `<a href="http://localhost:4330/docs/">Flow</a>`);
    assert.equal(res.getHeader("content-length"), Buffer.byteLength(res.sent));
  });

  it("passes other responses through unchanged", () => {
    const res = fakeResponse();
    middleware(LINKS)({}, res, () => {});
    res.setHeader("Content-Type", "application/json");
    res.write(`{"href":"https://example.com/"}`);
    res.end();
    assert.equal(res.sent, `{"href":"https://example.com/"}`);
  });
});
