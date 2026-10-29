import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createTestServer, launchTestBrowser } from "../helpers/test-harness.js";

const SPECS = fs
  .readdirSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../fixtures/specs"))
  .filter((f) => f.endsWith(".yaml"));

/**
 * Elements in the shadow root that reach past <rapi-doc>'s right edge, reported at the outermost
 * offender. Content inside a box that scrolls or clips horizontally (code blocks, tables) does not count.
 */
function findOverflow() {
  const doc = document.getElementById("thedoc");
  const right = doc.getBoundingClientRect().right;
  const clipsX = (el) =>
    ["auto", "scroll", "hidden", "clip"].includes(getComputedStyle(el).overflowX);
  const insideClippingBox = (el) => {
    for (let p = el.parentElement; p; p = p.parentElement) if (clipsX(p)) return true;
    return false;
  };
  return [...doc.shadowRoot.querySelectorAll("*")]
    .filter((el) => el.getBoundingClientRect().right > right + 1 && !insideClippingBox(el))
    .filter(
      (el) => !el.parentElement || el.parentElement.getBoundingClientRect().right <= right + 1,
    )
    .slice(0, 5)
    .map(
      (el) =>
        `${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 3).join(".")} (right edge ${Math.round(el.getBoundingClientRect().right)}px)`,
    );
}

describe("E2E: narrow screens (read mode, auto-height)", () => {
  let serverInstance;
  let browser;
  let page;
  let baseUrl;

  before(async () => {
    serverInstance = await createTestServer();
    baseUrl = serverInstance.baseUrl;
    browser = await launchTestBrowser();
    page = await browser.newPage();
    await page.setViewportSize({ width: 375, height: 812 });
  });

  after(async () => {
    if (page) await page.close();
    if (browser) await browser.close();
    if (serverInstance?.server) serverInstance.server.close();
  });

  for (const spec of SPECS) {
    it(`${spec}: content stays within <rapi-doc> at 375px`, async () => {
      await page.goto(`${baseUrl}/page-scroll-harness.html?spec=${spec}`, { waitUntil: "load" });
      await page.waitForFunction(
        () => {
          const doc = document.getElementById("thedoc");
          return (
            doc?.shadowRoot &&
            !doc.loading &&
            doc.shadowRoot.querySelector(".expanded-endpoint-body")
          );
        },
        null,
        { timeout: 10000 },
      );
      await page.waitForTimeout(300);
      const overflow = await page.evaluate(findOverflow);
      assert.deepEqual(overflow, []);
      const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      assert.ok(pageWidth <= 375, `page is ${pageWidth}px wide`);
    });
  }
});
