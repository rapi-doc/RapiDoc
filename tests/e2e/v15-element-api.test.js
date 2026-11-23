import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { createTestServer, launchTestBrowser, loadHarness } from "../helpers/test-harness.js";

// What <rapi-doc> 15 changed in its API: one nav-active-change detail, no scrollTo override, saved keys
// per API and applied once, the mock across a move in the page, css-file copied once, the sidebar rows

describe("E2E: <rapi-doc> 15 element API", () => {
  let serverInstance;
  let browser;
  let page;
  let baseUrl;

  before(async () => {
    serverInstance = await createTestServer();
    baseUrl = serverInstance.baseUrl;
    browser = await launchTestBrowser();
    page = await browser.newPage();
  });

  after(async () => {
    if (page) await page.close();
    if (browser) await browser.close();
    if (serverInstance?.server) serverInstance.server.close();
  });

  /** Runs `action` in the page and resolves with the detail of the next nav-active-change. */
  const nextNavChange = (action, arg) =>
    page.evaluate(
      ({ source, value }) =>
        new Promise((resolve, reject) => {
          const doc = document.getElementById("thedoc");
          // fail, never hang, when no event comes
          const timer = setTimeout(() => reject(new Error(`no nav-active-change after ${source}`)), 5000);
          doc.addEventListener(
            "nav-active-change",
            (e) => {
              clearTimeout(timer);
              resolve(e.detail);
            },
            { once: true },
          );
          new Function("doc", "value", source)(doc, value);
        }),
      { source: action, value: arg },
    );

  it("nav-active-change has one detail shape from scrollToPath and from a click", async () => {
    await loadHarness(page, baseUrl, { spec: "/specs/01-sections.yaml", "render-style": "read" });
    const ids = await page.evaluate(() => {
      const tag = document.getElementById("thedoc").resolvedSpec.tags.find((t) => t.paths.length);
      const op = tag.paths[0];
      return { tag: tag.elementId, op: op.elementId, operationId: op.rawOperation.operationId };
    });

    const byMethod = await nextNavChange("doc.scrollToPath(value)", ids.op);
    assert.deepEqual(byMethod, {
      elementId: ids.op,
      type: "operation",
      operationId: ids.operationId,
    });

    const byClick = await nextNavChange(
      "doc.shadowRoot.getElementById('link-' + value).click()",
      ids.tag,
    );
    assert.deepEqual(byClick, { elementId: ids.tag, type: "tag" });

    const section = await nextNavChange("doc.scrollToPath(value)", "auth");
    assert.deepEqual(section, { elementId: "auth", type: "section" });
  });

  it("does not override Element.scrollTo, and keeps its state off the attributes", async () => {
    const result = await page.evaluate(() => {
      const doc = document.getElementById("thedoc");
      return {
        nativeScrollTo: doc.scrollTo === Element.prototype.scrollTo,
        observed: doc.constructor.observedAttributes,
      };
    });
    assert.equal(result.nativeScrollTo, true);
    for (const name of ["loading", "focusedelementid", "searchval", "advancedsearchmatches"]) {
      assert.ok(!result.observed.includes(name), `${name} is not an attribute`);
    }
    assert.ok(!result.observed.includes("mock-server-status-strategy"));
  });

  it("the sidebar has no Operations row, and strikes deprecated operations through by class", async () => {
    const result = await page.evaluate(() => {
      const sr = document.getElementById("thedoc").shadowRoot;
      return {
        operationsRow: Boolean(sr.getElementById("link-operations-top")),
        operationsTopSection: Boolean(sr.getElementById("operations-top")),
        inlineFaded: sr.querySelectorAll('.nav-bar-path[style*="opacity"]').length,
      };
    });
    assert.equal(result.operationsRow, false);
    assert.equal(result.operationsTopSection, true, "the operations-top slot section stays");
    assert.equal(result.inlineFaded, 0);
  });

  it("persist-auth saves keys per API and applies them once per spec load", async () => {
    await loadHarness(page, baseUrl, { spec: "/specs/05-auth.yaml", "persist-auth": "true" });
    const key = `rapidoc-auth:${baseUrl}/specs/05-auth.yaml`;
    await page.evaluate((storageKey) => {
      localStorage.clear();
      // The v14 entry, and a saved key of this API
      localStorage.setItem(
        "rapidoc",
        JSON.stringify({ HeaderApiKey: { securitySchemeId: "HeaderApiKey", value: "from-v14" } }),
      );
      localStorage.setItem(
        storageKey,
        JSON.stringify({ BearerAuth: { securitySchemeId: "BearerAuth", value: "saved-token" } }),
      );
    }, key);

    await loadHarness(page, baseUrl, { spec: "/specs/05-auth.yaml", "persist-auth": "true" });
    const scheme = (id) =>
      page.evaluate(
        (schemeId) =>
          document
            .getElementById("thedoc")
            .resolvedSpec.securitySchemes.find((s) => s.securitySchemeId === schemeId)
            .finalKeyValue || "",
        id,
      );
    assert.equal(await scheme("BearerAuth"), "Bearer saved-token");
    assert.equal(await scheme("HeaderApiKey"), "", "the v14 entry is not read");

    // A key the page sets after the load survives later renders
    await page.evaluate(async () => {
      const doc = document.getElementById("thedoc");
      doc.setApiKey("BearerAuth", "from-the-page");
      doc.requestUpdate();
      await doc.updateComplete;
      doc.requestUpdate();
      await doc.updateComplete;
    });
    assert.equal(await scheme("BearerAuth"), "Bearer from-the-page");

    // A value that is not JSON never blanks the element
    await page.evaluate((storageKey) => localStorage.setItem(storageKey, "{not json"), key);
    await loadHarness(page, baseUrl, { spec: "/specs/05-auth.yaml", "persist-auth": "true" });
    assert.equal(await scheme("BearerAuth"), "");
    await page.evaluate(() => localStorage.clear());
  });

  it("keeps the mock on after the element is moved in the page", async () => {
    await loadHarness(page, baseUrl, { spec: "/specs/07-mock-try.yaml", "mock-server": "true" });
    const mocked = () =>
      page.evaluate(async () => {
        const doc = document.getElementById("thedoc");
        const server = doc.resolvedSpec.servers[0].computedUrl;
        const op = doc.resolvedSpec.tags.flatMap((t) => t.paths).find((p) => p.method === "get");
        try {
          const res = await fetch(server + op.path.replace(/\{[^}]+\}/g, "1"));
          return res.headers.get("x-mock-server") || res.headers.get("x-rapidoc-mock") || res.ok;
        } catch {
          return false; // nothing listens on the spec's server: only the mock can answer
        }
      });
    assert.ok(await mocked(), "mocked before the move");
    await page.evaluate(async () => {
      const doc = document.getElementById("thedoc");
      const wrapper = document.createElement("div");
      wrapper.style.height = "100%";
      document.body.appendChild(wrapper);
      wrapper.appendChild(doc);
      await doc.updateComplete;
    });
    assert.ok(await mocked(), "mocked after the move");
  });

  it("copies the css-file stylesheet into the element once", async () => {
    await page.goto(`${baseUrl}/test-harness.html?spec=/specs/01-sections.yaml`, {
      waitUntil: "domcontentloaded",
    });
    const count = await page.evaluate(async () => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/custom-theme.css";
      document.head.appendChild(link);
      const doc = document.getElementById("thedoc");
      doc.setAttribute("css-file", "custom-theme.css");
      for (let i = 0; i < 4; i++) {
        doc.requestUpdate();
        await doc.updateComplete;
      }
      return doc.shadowRoot.querySelectorAll('link[href*="custom-theme.css"]').length;
    });
    assert.equal(count, 1);
  });
});
