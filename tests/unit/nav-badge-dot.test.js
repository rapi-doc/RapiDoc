import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderNavBarHtml } from "@rapidoc/prerender";
import ProcessSpec from "../../packages/rapidoc/src/utils/spec-parser.js";
import { navBadgeDot } from "../../packages/rapidoc/src/utils/common-utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const petstore = fs.readFileSync(
  path.resolve(__dirname, "../../docs/public/specs/petstore-3.2.yaml"),
  "utf8",
);

describe("the sidebar's badge dot", () => {
  it("takes the first shown badge's color and every label, leaving out color: none", () => {
    assert.equal(navBadgeDot(undefined), null);
    assert.equal(navBadgeDot([{ label: "Internal", color: "none" }]), null);
    assert.deepEqual(
      navBadgeDot([
        { label: "Internal", color: "none" },
        { label: "Beta", color: "orange" },
        { label: "New", color: "green" },
      ]),
      { color: "var(--orange)", labels: ["Beta", "New"] },
    );
    assert.deepEqual(navBadgeDot([{ label: "Pending" }]), {
      color: "var(--primary)",
      labels: ["Pending"],
    });
  });

  it("is drawn by default on items whose operation shows a badge (kind: badge tags too)", async () => {
    const spec = await ProcessSpec.call({}, petstore);
    const html = renderNavBarHtml(spec);
    const dots = [...html.matchAll(/data-content-id="([^"]+)"[\s\S]*?<\/a>/g)]
      .filter((m) => m[0].includes('class="nav-badge-dot"'))
      .map((m) => m[1]);
    assert.deepEqual(dots.sort(), ["copy-pet", "purge-inventory", "search-pets"]);
    assert.match(
      html,
      /<span class="nav-badge-dot" part="nav-badge-dot" role="img" aria-label="Badges: Beta" title="Beta" style="background:var\(--primary\)"><\/span>/,
    );
  });

  it("is left out with showBadgesInNavBar false", async () => {
    const spec = await ProcessSpec.call({}, petstore);
    assert.doesNotMatch(renderNavBarHtml(spec, { showBadgesInNavBar: "false" }), /nav-badge-dot/);
    assert.doesNotMatch(
      renderNavBarHtml(spec, { "show-badges-in-nav-bar": "false" }),
      /nav-badge-dot/,
    );
  });
});
