// Builds the example site with Astro and Starlight and checks what the plugin added to it.
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const example = fileURLToPath(new URL("../example/", import.meta.url));
const astro = path.join(
  path.dirname(createRequire(import.meta.url).resolve("astro/package.json")),
  "bin/astro.mjs",
);

describe("a Starlight site with @rapidoc/starlight", () => {
  let outDir;
  const read = (file) => fs.readFileSync(path.join(outDir, file), "utf8");

  before(() => {
    outDir = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-starlight-"));
    execFileSync(process.execPath, [astro, "build", "--root", example, "--outDir", outDir], {
      stdio: "pipe",
      env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1" },
    });
  });

  after(() => fs.rmSync(outDir, { recursive: true, force: true }));

  it("has the API page in Starlight's layout, with the spec written into it", () => {
    const html = read("api/index.html");
    assert.match(html, /<title>Pets API \| Example docs<\/title>/);
    const element = /<rapi-doc[^>]*>/.exec(html)[0];
    for (const attribute of [
      'render-style="focused"',
      'show-side-nav="false"',
      'auto-height="true"',
      'color-scheme="auto"',
      'allow-try="false"',
      'oauth-receiver="/api/oauth-receiver/"',
    ]) {
      assert.ok(element.includes(attribute), `${attribute} in ${element}`);
    }
    const spec = /<script type="application\/json" slot="rapidoc-spec">(.*?)<\/script>/s.exec(html);
    assert.equal(JSON.parse(spec[1]).info.title, "Pets API");
  });

  it("lists the API's operations in the sidebar of every page, with their method", () => {
    for (const file of ["index.html", "api/index.html"]) {
      const html = read(file);
      const link = /<a [^>]*data-rapidoc-op="list-pets"[^>]*>/.exec(html)?.[0] ?? "";
      assert.match(link, /href="\/api\/#list-pets"/, file);
      assert.match(link, /class="[^"]*rapidoc-op rapidoc-op--get/, file);
      assert.match(html, /Remove a pet/);
      assert.match(
        html,
        /a\.rapidoc-op--get::before\{content:"GET";/,
        "the label styles are on every page",
      );
    }
  });

  it("loads the rapidoc bundle on the API page only", () => {
    const script = (html) =>
      [...html.matchAll(/<script type="module" src="([^"]+)"/g)].map((match) => match[1]);
    const bundles = script(read("api/index.html")).filter((src) =>
      fs.readFileSync(path.join(outDir, src), "utf8").includes("rapi-doc"),
    );
    assert.equal(bundles.length, 1, "one script of the API page defines <rapi-doc>");
    assert.ok(!script(read("index.html")).includes(bundles[0]), "the guide page does not load it");
  });

  it("has the OAuth return page, without the site's layout", () => {
    const html = read("api/oauth-receiver/index.html");
    assert.match(html, /<oauth-receiver><\/oauth-receiver>/);
    assert.doesNotMatch(html, /Example docs/);
  });
});
