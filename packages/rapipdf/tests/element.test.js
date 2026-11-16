import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { launchTestBrowser } from "../../../tests/helpers/test-harness.js";

/*
 * <rapi-pdf> from the built files in headless Chrome, once per browser build: the single classic
 * script (dist/rapipdf-min.js) and the ES module that fetches the generator on first use
 * (dist/rapipdf.js). The element registers, loads a spec by URL and pdfmake makes a real PDF.
 */

const here = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(here, "../dist");
const specsDir = path.join(here, "fixtures/specs");
const CONTENT_TYPES = {
  ".json": "application/json",
  ".yaml": "text/yaml",
  ".js": "text/javascript",
};

const BUILDS = {
  "classic script (rapipdf-min.js)": `<script src="/dist/rapipdf-min.js"></script>`,
  "ES module (rapipdf.js)": `<script type="module" src="/dist/rapipdf.js"></script>`,
};

let server;
let browser;
let baseUrl;

before(async () => {
  assert.ok(
    fs.existsSync(path.join(distDir, "rapipdf-min.js")) &&
      fs.existsSync(path.join(distDir, "rapipdf.js")),
    "dist/ is missing: run `npm run build:rapipdf`",
  );
  server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    const page = Object.keys(BUILDS)[Number(url.slice("/page/".length))];
    if (url.startsWith("/page/") && page) {
      return res
        .writeHead(200, { "content-type": "text/html" })
        .end(`<!doctype html><meta charset="utf-8">${BUILDS[page]}`);
    }
    const root = url.startsWith("/dist/") ? distDir : url.startsWith("/specs/") ? specsDir : null;
    const file = root && path.join(root, url.replace(/^\/(dist|specs)\//, ""));
    if (!file || !file.startsWith(root) || !fs.existsSync(file)) return res.writeHead(404).end();
    res
      .writeHead(200, { "content-type": CONTENT_TYPES[path.extname(file)] })
      .end(fs.readFileSync(file));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  browser = await launchTestBrowser();
});

after(async () => {
  await browser?.close();
  server?.close();
});

/** A page with the build loaded and <rapi-pdf> defined; closed when the test ends. */
async function openPage(t, buildIndex) {
  const page = await browser.newPage();
  t.after(() => page.close());
  const errors = [];
  page.on("pageerror", (err) => errors.push(err.message));
  await page.goto(`${baseUrl}/page/${buildIndex}`);
  await page.waitForFunction(() => customElements.get("rapi-pdf"));
  // pdfmake points the tab it is given at a blob: URL of the PDF. This stands in for that tab and
  // keeps what happened: how many tabs were opened, and the first bytes of the PDF shown.
  await page.evaluate(() => {
    window.tabs = { opened: 0, closed: 0, shown: [], block: false };
    window.open = () => {
      if (window.tabs.block) return null;
      window.tabs.opened++;
      const location = {};
      Object.defineProperty(location, "href", {
        set(url) {
          window.tabs.shown.push(url);
        },
      });
      return { location, close: () => window.tabs.closed++ };
    };
    window.pdfHeader = async (source) => {
      const blob = typeof source === "string" ? await (await fetch(source)).blob() : source;
      return new TextDecoder().decode((await blob.arrayBuffer()).slice(0, 5));
    };
    window.addElement = (attrs = {}) => {
      const el = document.createElement("rapi-pdf");
      for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
      el.events = [];
      for (const type of ["pdf-generated", "pdf-error"]) {
        // On document: the events must get out of the element
        document.addEventListener(type, (event) => {
          if (event.target === el) el.events.push([type, event.detail.output ?? "error"]);
        });
      }
      document.body.append(el);
      return el;
    };
  });
  return { page, errors };
}

Object.keys(BUILDS).forEach((build, buildIndex) => {
  describe(`<rapi-pdf>, ${build}`, () => {
    for (const spec of ["petstore.json", "petstore_extended.yaml"]) {
      it(`opens a PDF in a new tab: ${spec}`, async (t) => {
        const { page, errors } = await openPage(t, buildIndex);
        const result = await page.evaluate(async (spec) => {
          const el = window.addElement({ "spec-url": `/specs/${spec}`, "include-example": "true" });
          const running = el.generatePdf();
          const busy =
            el.hasAttribute("generating") && el.shadowRoot.querySelector("button").disabled;
          await running;
          return {
            busy,
            idle: !el.hasAttribute("generating") && !el.shadowRoot.querySelector("button").disabled,
            header: await window.pdfHeader(window.tabs.shown[0]),
            tabs: window.tabs.opened,
            events: el.events,
          };
        }, spec);
        assert.equal(result.header, "%PDF-");
        assert.equal(result.tabs, 1);
        assert.ok(result.busy, "not marked as generating while it runs");
        assert.ok(result.idle, "still marked as generating afterwards");
        assert.deepEqual(result.events, [["pdf-generated", "open"]]);
        assert.deepEqual(errors, []);
      });
    }

    it('downloads the PDF with output="download", named by file-name', async (t) => {
      const { page } = await openPage(t, buildIndex);
      const [download, result] = await Promise.all([
        page.waitForEvent("download"),
        page.evaluate(async () => {
          const el = window.addElement({
            "spec-url": "/specs/basic.json",
            output: "download",
            "file-name": "orders",
          });
          await el.generatePdf();
          return { tabs: window.tabs.opened, events: el.events };
        }),
      ]);
      assert.equal(download.suggestedFilename(), "orders.pdf");
      assert.equal(result.tabs, 0);
      assert.deepEqual(result.events, [["pdf-generated", "download"]]);
    });

    it("downloads when the browser blocks the new tab", async (t) => {
      const { page } = await openPage(t, buildIndex);
      const [download, events] = await Promise.all([
        page.waitForEvent("download"),
        page.evaluate(async () => {
          window.tabs.block = true;
          const el = window.addElement({ "spec-url": "/specs/basic.json" });
          await el.generatePdf();
          return el.events;
        }),
      ]);
      assert.equal(download.suggestedFilename(), "api-reference.pdf");
      assert.deepEqual(events, [["pdf-generated", "download"]]);
    });

    it("getPdfBlob() returns the PDF without opening or downloading", async (t) => {
      const { page } = await openPage(t, buildIndex);
      const result = await page.evaluate(async () => {
        const el = window.addElement({ "spec-url": "/specs/basic.json" });
        const blob = await el.getPdfBlob();
        return {
          type: blob.type,
          header: await window.pdfHeader(blob),
          tabs: window.tabs.opened,
          events: el.events,
        };
      });
      assert.equal(result.header, "%PDF-");
      assert.equal(result.type, "application/pdf");
      assert.equal(result.tabs, 0);
      assert.deepEqual(result.events, [["pdf-generated", "blob"]]);
    });

    it("a spec passed to the method is used instead of spec-url", async (t) => {
      const { page } = await openPage(t, buildIndex);
      const sizes = await page.evaluate(async () => {
        const el = window.addElement({ "spec-url": "/specs/petstore_extended.yaml" });
        const spec = {
          openapi: "3.0.0",
          info: { title: "Tiny", version: "1" },
          paths: { "/a": { get: { responses: { 200: { description: "ok" } } } } },
        };
        return {
          fromAttribute: (await el.getPdfBlob()).size,
          fromArgument: (await el.getPdfBlob(spec)).size,
        };
      });
      assert.ok(sizes.fromArgument < sizes.fromAttribute / 2, JSON.stringify(sizes));
    });

    it("generates once per click after being moved in the document", async (t) => {
      const { page } = await openPage(t, buildIndex);
      const opened = await page.evaluate(async () => {
        const el = window.addElement({ "spec-url": "/specs/basic.json" });
        // Disconnects and connects the element again: its listeners must not pile up
        document.body.append(el);
        document.body.prepend(el);
        const done = new Promise((resolve) => el.addEventListener("pdf-generated", resolve));
        el.shadowRoot.querySelector("button").click();
        await done;
        return window.tabs.opened;
      });
      assert.equal(opened, 1);
    });

    it("rejects, reports pdf-error and closes the tab when the spec can't be loaded", async (t) => {
      const { page } = await openPage(t, buildIndex);
      const result = await page.evaluate(async () => {
        const el = window.addElement({ "spec-url": "/specs/missing.json" });
        let message = null;
        try {
          await el.generatePdf();
        } catch (err) {
          message = String(err.message);
        }
        const empty = window.addElement();
        let noSpec = null;
        try {
          await empty.getPdfBlob();
        } catch (err) {
          noSpec = String(err.message);
        }
        return {
          message,
          noSpec,
          events: el.events,
          tabs: window.tabs,
          idle: !el.hasAttribute("generating"),
        };
      });
      assert.ok(result.message, "generatePdf() resolved for a spec that does not exist");
      assert.match(result.noSpec, /No spec/);
      assert.deepEqual(result.events, [["pdf-error", "error"]]);
      assert.equal(result.tabs.opened, 1);
      assert.equal(result.tabs.closed, 1);
      assert.ok(result.idle);
    });
  });
});

describe("the ES module build", () => {
  it("fetches the generator only when a PDF is asked for", async (t) => {
    const page = await browser.newPage();
    t.after(() => page.close());
    const scripts = [];
    page.on("request", (request) => {
      if (request.resourceType() === "script") scripts.push(new URL(request.url()).pathname);
    });
    await page.goto(`${baseUrl}/page/1`);
    await page.waitForFunction(() => customElements.get("rapi-pdf"));
    assert.ok(!scripts.some((url) => url.includes("generate")), scripts.join(", "));
    await page.evaluate(async () => {
      const el = document.createElement("rapi-pdf");
      el.setAttribute("spec-url", "/specs/basic.json");
      document.body.append(el);
      await el.getPdfBlob();
    });
    assert.ok(
      scripts.some((url) => url.includes("generate")),
      scripts.join(", "),
    );
  });
});
