import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

// Minimal browser globals so rapidoc.ts and rapidoc-mini.ts load in Node (Lit uses its SSR shim
// for HTMLElement). Only the spec-loading paths are driven; rendering is stubbed per element.
globalThis.window ??= globalThis;
globalThis.window.location ??= { hash: "", href: "http://localhost/" };
globalThis.IntersectionObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
globalThis.window.setTimeout ??= setTimeout;
globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};

const fetches = [];
globalThis.fetch = async (url) => {
  fetches.push(String(url));
  const spec = { openapi: "3.1.0", info: { title: `from ${url}`, version: "1" }, paths: {} };
  return new Response(JSON.stringify(spec), { headers: { "content-type": "application/json" } });
};

const { default: RapiDoc } = await import("../../packages/rapidoc/src/rapidoc.ts");
const { default: RapiDocMini } = await import("../../packages/rapidoc/src/rapidoc-mini.ts");

const spec = (title) => ({ openapi: "3.1.0", info: { title, version: "1" }, paths: {} });
const settle = () => new Promise((resolve) => setTimeout(resolve, 50));

// Stubs the DOM surface the element touches on connect and after a load, records spec-loaded
// titles, and fakes attributes so attributeChangedCallback / connectedCallback can be driven.
function stubElement(el, attrs = {}, inlinedSpec = null) {
  const loaded = [];
  el.dispatchEvent = (event) => {
    if (event.type === "spec-loaded") loaded.push(event.detail.info.title);
    return true;
  };
  el.requestUpdate = () => {};
  Object.defineProperty(el, "updateComplete", { get: () => Promise.resolve(true) });
  el.getAttribute = (name) => attrs[name] ?? null;
  el.hasAttribute = (name) => name in attrs;
  el.setAttribute = (name, value) => {
    attrs[name] = value;
  };
  el.querySelector = () => (inlinedSpec ? { textContent: JSON.stringify(inlinedSpec) } : null);
  el.scrollToPath = () => {};
  el.observeExpandedContent = () => {};
  el.initIntersectionObserver = () => {};
  el.createRenderRoot = () => ({});
  el.performUpdate = () => {};
  Object.defineProperty(el, "shadowRoot", { get: () => null });
  Object.defineProperty(el, "parentElement", { get: () => null });
  Object.defineProperty(el, "style", { get: () => ({ setProperty() {}, removeProperty() {} }) });
  return loaded;
}

// A parsed <rapi-doc spec-url> sees attributeChangedCallback (deferred load) and then
// connectedCallback (immediate load) in that order.
function parse(el, specUrl) {
  el.attributeChangedCallback("spec-url", null, specUrl);
  el.connectedCallback();
}

describe("<rapi-doc> spec load sequence", () => {
  beforeEach(() => {
    fetches.length = 0;
  });

  it("overlapping loadSpec calls apply only the newest spec and fire spec-loaded once", async () => {
    const el = new RapiDoc();
    const loaded = stubElement(el);
    await Promise.all([el.loadSpec(spec("first")), el.loadSpec(spec("second"))]);
    await settle();
    assert.deepEqual(loaded, ["second"]);
    assert.equal(el.resolvedSpec.info.title, "second");
  });

  it("a parsed <rapi-doc spec-url> loads once", async () => {
    const el = new RapiDoc();
    const loaded = stubElement(el, { "spec-url": "http://x/a.json" });
    parse(el, "http://x/a.json");
    await settle();
    assert.deepEqual(fetches, ["http://x/a.json"]);
    assert.deepEqual(loaded, ["from http://x/a.json"]);
  });

  it("changing spec-url later reloads once", async () => {
    const el = new RapiDoc();
    const attrs = { "spec-url": "http://x/a.json" };
    const loaded = stubElement(el, attrs);
    parse(el, "http://x/a.json");
    await settle();
    fetches.length = 0;
    attrs["spec-url"] = "http://x/b.json";
    el.attributeChangedCallback("spec-url", "http://x/a.json", "http://x/b.json");
    await settle();
    assert.deepEqual(fetches, ["http://x/b.json"]);
    assert.deepEqual(loaded, ["from http://x/a.json", "from http://x/b.json"]);
    assert.equal(el.resolvedSpec.info.title, "from http://x/b.json");
  });

  it("an inlined rapidoc-spec wins and the spec-url present at connect is not fetched", async () => {
    const el = new RapiDoc();
    const loaded = stubElement(el, { "spec-url": "http://x/a.json" }, spec("inlined"));
    parse(el, "http://x/a.json");
    await settle();
    assert.deepEqual(fetches, []);
    assert.deepEqual(loaded, ["inlined"]);
    assert.equal(el.resolvedSpec.info.title, "inlined");
  });

  it("a host loadSpec(object) still works after an attribute-driven load", async () => {
    const el = new RapiDoc();
    const loaded = stubElement(el, { "spec-url": "http://x/a.json" });
    parse(el, "http://x/a.json");
    await settle();
    await el.loadSpec(spec("from host"));
    await settle();
    assert.deepEqual(loaded, ["from http://x/a.json", "from host"]);
    assert.equal(el.resolvedSpec.info.title, "from host");
  });
});

describe("<rapi-doc-mini> spec load sequence", () => {
  it("overlapping loadSpec calls apply only the newest spec and fire spec-loaded once", async () => {
    const el = new RapiDocMini();
    const loaded = stubElement(el);
    await Promise.all([el.loadSpec(spec("first")), el.loadSpec(spec("second"))]);
    await settle();
    assert.deepEqual(loaded, ["second"]);
    assert.equal(el.resolvedSpec.info.title, "second");
  });
});
