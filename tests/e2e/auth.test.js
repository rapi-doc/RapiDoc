import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { createTestServer, launchTestBrowser, loadHarness } from "../helpers/test-harness.js";

describe("E2E: Authentication & Security Schemes", () => {
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

  it("renders authentication link in navigation when allow-authentication is true", async () => {
    await loadHarness(page, baseUrl, {
      spec: "/specs/05-auth.yaml",
      "render-style": "read",
      "allow-authentication": "true",
    });

    const hasAuthLink = await page.evaluate(() => {
      const doc = document.getElementById("thedoc");
      return doc.shadowRoot.querySelector("#link-auth") !== null;
    });
    assert.equal(hasAuthLink, true, "Authentication navigation link should be visible");
  });

  it("hides authentication link when allow-authentication is false", async () => {
    await loadHarness(page, baseUrl, {
      spec: "/specs/05-auth.yaml",
      "render-style": "read",
      "allow-authentication": "false",
    });

    const hasAuthLink = await page.evaluate(() => {
      const doc = document.getElementById("thedoc");
      return doc.shadowRoot.querySelector("#link-auth") !== null;
    });
    assert.equal(
      hasAuthLink,
      false,
      "Authentication link should be hidden when allow-authentication is false",
    );
  });

  it("renders multiple security schemes (API Key, Bearer JWT, OAuth2)", async () => {
    await loadHarness(page, baseUrl, {
      spec: "/specs/05-auth.yaml",
      "render-style": "read",
      "allow-authentication": "true",
    });

    const schemesDetected = await page.evaluate(() => {
      const doc = document.getElementById("thedoc");
      const text = doc.shadowRoot.textContent;
      return {
        apiKey: text.includes("HeaderApiKey") || text.includes("X-API-KEY"),
        bearer: text.includes("BearerAuth") || text.includes("bearer") || text.includes("JWT"),
        oauth2: text.includes("OAuth2Auth") || text.includes("oauth2"),
      };
    });

    assert.equal(schemesDetected.apiKey, true, "Header API Key scheme should be displayed");
    assert.equal(schemesDetected.bearer, true, "Bearer JWT scheme should be displayed");
    assert.equal(schemesDetected.oauth2, true, "OAuth2 scheme should be displayed");
  });

  it("places operation security chips in the flow without overlapping the summary", async () => {
    for (const width of [1280, 375]) {
      await page.setViewportSize({ width, height: 800 });
      for (const renderStyle of ["read", "view"]) {
        await loadHarness(page, baseUrl, {
          spec: "/specs/05-auth.yaml",
          "render-style": renderStyle,
        });

        const result = await page.evaluate(async () => {
          const root = document.getElementById("thedoc").shadowRoot;
          for (const head of root.querySelectorAll(".m-endpoint:not(.expanded) .endpoint-head")) {
            head.click();
          }
          await new Promise((r) => setTimeout(r, 300));
          const overlaps = (a, b) =>
            a.width > 0 &&
            b.width > 0 &&
            a.left < b.right &&
            b.left < a.right &&
            a.top < b.bottom &&
            b.top < a.bottom;
          const rows = [...root.querySelectorAll(".operation-security")];
          const problems = rows.flatMap((row) => {
            const r = row.getBoundingClientRect();
            const op = row.closest(".expanded-endpoint-body, .endpoint-body");
            const issues = [...op.querySelectorAll("h3, .m-markdown")]
              .filter((el) => overlaps(r, el.getBoundingClientRect()))
              .map((el) => `overlaps ${el.tagName} "${el.textContent.trim().slice(0, 30)}"`);
            if (getComputedStyle(row).position !== "static") issues.push("not in normal flow");
            if (r.left < 0 || r.right > window.innerWidth) issues.push("outside viewport");
            // Sits under the summary and the method and path, before the description
            const above = op.querySelectorAll(
              "h3:not(.visually-hidden), [part='section-operation-webhook-method']",
            );
            for (const el of above) {
              if (el.getBoundingClientRect().bottom > r.top) issues.push(`not below ${el.tagName}`);
            }
            for (const el of op.querySelectorAll(".m-markdown")) {
              if (el.getBoundingClientRect().top < r.bottom) issues.push(`not above ${el.tagName}`);
            }
            // A lock icon comes first, and "Authorization" is kept for screen readers
            const lock = row.querySelector(".security-lock-btn");
            const firstChip = row.querySelector(".security-chip");
            if (!lock || lock.getBoundingClientRect().width === 0) issues.push("missing lock");
            else if (
              firstChip &&
              lock.compareDocumentPosition(firstChip) !== Node.DOCUMENT_POSITION_FOLLOWING
            )
              issues.push("lock not before chips");
            const label = row.querySelector(".security-label");
            if (label?.textContent.trim() !== "Authorization") issues.push("missing label");
            else if (!label.classList.contains("visually-hidden")) issues.push("label visible");
            return issues;
          });
          return { rows: rows.length, problems };
        });

        assert.ok(
          result.rows >= 6,
          `security chips should render for protected operations (${renderStyle}, ${width}px)`,
        );
        assert.deepEqual(
          result.problems,
          [],
          `security chips should not overlap (${renderStyle}, ${width}px)`,
        );
      }
    }
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  it("shows security chip details on hover and keyboard focus, and closes them on Escape", async () => {
    await loadHarness(page, baseUrl, {
      spec: "/specs/05-auth.yaml",
      "render-style": "read",
      "allow-authentication": "false",
    });

    const op = page.locator(".expanded-endpoint-body", { hasText: "complex AND / OR" });
    const chip = op.locator(".security-chip-label").first();
    const popoverId = await chip.getAttribute("aria-describedby");
    const popover = op.locator(`#${popoverId}`);
    const isOpen = () => popover.evaluate((el) => el.matches(":popover-open"));

    assert.equal(
      await chip.evaluate((el) => el.tagName),
      "BUTTON",
      "chip without a link should be a focusable button",
    );
    assert.equal(await popover.getAttribute("role"), "tooltip");
    assert.equal(await isOpen(), false, "details should start closed");

    await chip.hover();
    assert.equal(await isOpen(), true, "hovering a chip should open its details");
    const [chipBox, popoverBox] = [await chip.boundingBox(), await popover.boundingBox()];
    assert.ok(popoverBox.y >= chipBox.y + chipBox.height, "details should open below the chip");

    await page.mouse.move(0, 0);
    await page.waitForTimeout(300);
    assert.equal(await isOpen(), false, "moving the pointer away should close the details");

    await chip.focus();
    assert.equal(await isOpen(), true, "keyboard focus should open the details");
    await page.keyboard.press("Escape");
    assert.equal(await isOpen(), false, "Escape should close the details");
  });

  it("links the lock icon to the authentication section when authentication is allowed", async () => {
    await loadHarness(page, baseUrl, {
      spec: "/specs/05-auth.yaml",
      "render-style": "read",
      "allow-authentication": "true",
    });

    const op = page.locator(".expanded-endpoint-body", { hasText: "complex AND / OR" });
    const lock = op.locator(".security-lock-btn").first();
    assert.equal(await lock.evaluate((el) => el.tagName), "A", "lock should be a link");
    assert.equal(await lock.getAttribute("href"), "#auth");
    assert.equal(await lock.getAttribute("part"), "anchor anchor-operation-security");

    // Chips only open their details popover
    const chip = op.locator(".security-chip-label").first();
    assert.equal(await chip.evaluate((el) => el.tagName), "BUTTON", "chip should be a button");
    assert.equal(await chip.getAttribute("href"), null, "chip should not link anywhere");
    assert.equal(
      await op.locator(".security-chip-label[part~='anchor-operation-security']").count(),
      0,
      "anchor-operation-security part should be on the lock, not the chips",
    );
    assert.ok(
      await chip.getAttribute("aria-describedby"),
      "chip should be described by its details popover",
    );
  });
});
