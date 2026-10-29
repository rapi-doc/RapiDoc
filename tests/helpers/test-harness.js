import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../..");

export function findChromeExecutable() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  if (process.env.PLAYWRIGHT_CHROME_PATH) return process.env.PLAYWRIGHT_CHROME_PATH;

  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  throw new Error("No Chrome/Chromium binary found.");
}

/**
 * Creates and starts a lightweight test HTTP server serving:
 * - /rapidoc-min.js
 * - /test-harness.html
 * - /specs/*.yaml
 * - Mock REST endpoints
 */
export async function createTestServer() {
  const specsDir = path.join(rootDir, "tests/fixtures/specs");
  const harnessPath = path.join(rootDir, "tests/fixtures/html/test-harness.html");
  const bundlePath = path.join(rootDir, "packages/rapidoc/dist/rapidoc-min.js");

  const server = http.createServer((req, res) => {
    // CORS headers for local test harness requests
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      return res.end();
    }

    const url = req.url.split("?")[0];

    // Serve rapidoc bundle
    if (url === "/rapidoc-min.js") {
      if (fs.existsSync(bundlePath)) {
        const bundle = fs.readFileSync(bundlePath);
        res.writeHead(200, { "Content-Type": "application/javascript; charset=utf-8" });
        return res.end(bundle);
      }
      res.writeHead(500);
      return res.end("Bundle not found at " + bundlePath);
    }

    // Serve test harness HTML
    if (url === "/" || url === "/test-harness.html") {
      if (fs.existsSync(harnessPath)) {
        const html = fs.readFileSync(harnessPath);
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        return res.end(html);
      }
      res.writeHead(404);
      return res.end("Harness not found");
    }

    // Serve other fixture pages (e.g. /page-scroll-harness.html)
    if (/^\/[\w-]+\.html$/.test(url)) {
      const pagePath = path.join(rootDir, "tests/fixtures/html", url.slice(1));
      if (fs.existsSync(pagePath)) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        return res.end(fs.readFileSync(pagePath));
      }
    }

    // Serve fixture specs
    if (url.startsWith("/specs/")) {
      const specFilename = url.replace("/specs/", "");
      const fullPath = path.join(specsDir, specFilename);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath);
        res.writeHead(200, { "Content-Type": "text/yaml; charset=utf-8" });
        return res.end(content);
      }
      res.writeHead(404);
      return res.end("Spec file not found: " + specFilename);
    }

    // Mock API endpoints for try-it-out testing
    if (url.startsWith("/api/v1/echo")) {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ received: "Hello RapiDoc", trace: "trace-abc-123" }));
    }

    if (url.startsWith("/api/v1/calculate")) {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ result: 20 }));
    }

    if (url.startsWith("/api/v1/files/upload")) {
      res.writeHead(201, {
        "Content-Type": "application/json",
        "X-Upload-Id": "upl-12345",
        "X-RateLimit-Remaining": "99",
      });
      return res.end(
        JSON.stringify({ fileId: "file-001", fileName: "sample.pdf", sizeBytes: 1024 }),
      );
    }

    res.writeHead(404);
    res.end("Not Found");
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  return { server, port, baseUrl };
}

/**
 * Launches Chromium browser instance
 */
export async function launchTestBrowser() {
  const chromePath = findChromeExecutable();
  return chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });
}

/**
 * Opens test harness with given attributes and waits for RapiDoc to finish rendering
 */
export async function loadHarness(page, baseUrl, params = {}) {
  const query = new URLSearchParams(params).toString();
  const targetUrl = `${baseUrl}/test-harness.html${query ? "?" + query : ""}`;
  await page.goto(targetUrl, { waitUntil: "domcontentloaded" });

  // Wait for RapiDoc to finish loading and rendering into shadowRoot
  await page.waitForFunction(
    () => {
      const doc = document.getElementById("thedoc");
      if (!doc || !doc.shadowRoot) return false;
      if (doc.loading) return false;
      // Check for rendered content
      const hasNav = !!doc.shadowRoot.querySelector(".nav-bar");
      const hasBody = !!doc.shadowRoot.querySelector(
        ".main-content, .section-tag, .m-endpoint, .main-header",
      );
      return hasNav || hasBody;
    },
    { timeout: 10000 },
  );

  await page.waitForTimeout(300);
}

/**
 * Unclips Shadow DOM container for full-document flow screenshotting
 */
export async function unclipShadowContainer(page) {
  await page.evaluate(() => {
    const doc = document.querySelector("rapi-doc");
    if (doc) {
      doc.style.height = "auto";
      const main = doc.shadowRoot ? doc.shadowRoot.querySelector(".main-content") : null;
      if (main) {
        main.style.height = "auto";
        main.style.overflow = "visible";
      }
    }
  });
}
