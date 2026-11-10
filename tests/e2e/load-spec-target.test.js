import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { createTestServer, launchTestBrowser, loadHarness } from "../helpers/test-harness.js";

// After loadSpec(), the download / view buttons, the Spec URL box and a match-paths reload follow
// the spec loaded last, not the spec-url attribute (#891)

describe("E2E: loadSpec() updates the spec target", () => {
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

  const state = () =>
    page.evaluate(() => {
      const doc = document.getElementById("thedoc");
      const sr = doc.shadowRoot;
      return {
        specUrl: doc.specUrl,
        title: doc.resolvedSpec?.info?.title,
        specUrlBox: sr.getElementById("spec-url")?.value,
        hasDownload: [...sr.querySelectorAll(".download-btn")].some((b) =>
          b.textContent.includes("Download OpenAPI spec"),
        ),
      };
    });

  const waitLoaded = () =>
    page.waitForFunction(() => {
      const doc = document.getElementById("thedoc");
      return doc && !doc.loading && doc.resolvedSpec && !doc.resolvedSpec.isSpecLoading;
    });

  it("loadSpec(url) moves the download target and the Spec URL box to the new spec", async () => {
    await loadHarness(page, baseUrl, {
      spec: "/specs/01-sections.yaml",
      "allow-spec-file-download": "true",
      "show-header": "true",
    });
    const before = await state();
    assert.match(before.specUrl, /01-sections\.yaml$/);
    assert.equal(before.hasDownload, true);

    await page.evaluate(() =>
      document.getElementById("thedoc").loadSpec("/specs/02-datatypes.yaml"),
    );
    await waitLoaded();
    await page.waitForTimeout(200);
    const after = await state();
    assert.equal(after.specUrl, "/specs/02-datatypes.yaml");
    assert.equal(after.specUrlBox, "/specs/02-datatypes.yaml");
    assert.equal(after.hasDownload, true);
    assert.notEqual(after.title, before.title);
  });

  it("a match-paths change re-filters the spec loaded last", async () => {
    await page.evaluate(() =>
      document.getElementById("thedoc").setAttribute("match-paths", "zzz-no-match"),
    );
    await page.waitForTimeout(100);
    await waitLoaded();
    await page.waitForTimeout(200);
    const after = await state();
    assert.equal(after.specUrl, "/specs/02-datatypes.yaml");
    const datatypesTitle = await page.evaluate(async () => {
      const text = await (await fetch("/specs/02-datatypes.yaml")).text();
      return text
        .match(/^\s*title:\s*(.+)$/m)?.[1]
        ?.trim()
        .replace(/^["']|["']$/g, "");
    });
    assert.equal(after.title, datatypesTitle);
  });

  it("an inlined spec keeps its spec-url as the download target", async () => {
    const result = await page.evaluate(async () => {
      const el = document.createElement("rapi-doc");
      el.setAttribute("spec-url", "/specs/01-sections.yaml");
      el.setAttribute("allow-spec-file-download", "true");
      const script = document.createElement("script");
      script.type = "application/json";
      script.slot = "rapidoc-spec";
      script.textContent = JSON.stringify({
        openapi: "3.0.0",
        info: { title: "Inlined", version: "1" },
        paths: {},
      });
      el.appendChild(script);
      document.body.appendChild(el);
      for (let i = 0; i < 50 && (!el.resolvedSpec || el.resolvedSpec.isSpecLoading); i++) {
        await new Promise((r) => setTimeout(r, 100));
      }
      await new Promise((r) => setTimeout(r, 200));
      const out = {
        specUrl: el.specUrl,
        title: el.resolvedSpec?.info?.title,
        hasDownload: [...el.shadowRoot.querySelectorAll(".download-btn")].some((b) =>
          b.textContent.includes("Download OpenAPI spec"),
        ),
      };
      el.remove();
      return out;
    });
    assert.equal(result.title, "Inlined");
    assert.equal(result.specUrl, "/specs/01-sections.yaml");
    assert.equal(result.hasDownload, true);
  });

  it("loadSpec(object) has no file to download, so the download buttons go", async () => {
    await page.evaluate(() =>
      document.getElementById("thedoc").loadSpec({
        openapi: "3.0.0",
        info: { title: "Inline", version: "1" },
        paths: {},
      }),
    );
    await waitLoaded();
    await page.waitForTimeout(200);
    const after = await state();
    assert.equal(after.specUrl, "");
    assert.equal(after.hasDownload, false);
    assert.equal(after.title, "Inline");
  });
});
