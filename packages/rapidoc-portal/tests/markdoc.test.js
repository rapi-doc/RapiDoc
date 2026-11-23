import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Markdoc from "@markdoc/markdoc";
import { portalMarkdocConfig } from "../src/markdoc/astro-config.js";

const DEMO_GUIDES_DIR = path.join(
  process.env.RAPIDOC_DEMO_PORTAL_DIR ??
    fileURLToPath(new URL("../../../../rapi-portal-demo/cosmo-cargo", import.meta.url)),
  "docs/guides",
);

/** What the build reports for a Markdoc source: the validation errors of the portal's tags. */
function problems(source) {
  const { nodes, tags } = portalMarkdocConfig();
  return Markdoc.validate(Markdoc.parse(source), { nodes, tags }).map((e) => e.error.message);
}

describe("the portal's Markdoc tags (src/markdoc/astro-config.js)", () => {
  it("accepts the guides of rapi-portal-demo", () => {
    for (const name of [
      "order-fulfillment.markdoc",
      "loyalty-and-rewards.markdoc",
      "first-shipment.markdoc",
    ]) {
      const source = fs.readFileSync(path.join(DEMO_GUIDES_DIR, name), "utf8");
      assert.deepEqual(problems(source.replace(/^---\n[\s\S]*?\n---\n/, "")), [], name);
    }
  });

  it("api-operation takes the API's id as `api`; `spec` is unknown", () => {
    assert.deepEqual(problems('{% api-operation api="shipments" path="/shipments" /%}'), []);
    assert.deepEqual(
      problems(
        '{% api-operation api="shipments" version="v1" path="/s" method="post" title="T" collapsed=true /%}',
      ),
      [],
    );
    const old = problems('{% api-operation spec="shipments" path="/shipments" /%}');
    assert.ok(old.includes("Invalid attribute: 'spec'"), old.join("; "));
    assert.ok(old.includes("Missing required attribute: 'api'"), old.join("; "));
  });

  it("workflow takes the workflows entry's id as `document`; `file` is unknown", () => {
    assert.deepEqual(
      problems('{% workflow document="track-a-shipment" id="trackShipment" view="compact" /%}'),
      [],
    );
    const old = problems('{% workflow file="track-a-shipment" id="trackShipment" /%}');
    assert.ok(old.includes("Invalid attribute: 'file'"), old.join("; "));
    assert.ok(old.includes("Missing required attribute: 'document'"), old.join("; "));
  });

  it("tab takes `label`, required; `name` is unknown", () => {
    assert.deepEqual(problems('{% tabs %}{% tab label="npm" %}x{% /tab %}{% /tabs %}'), []);
    const old = problems('{% tabs %}{% tab name="npm" %}x{% /tab %}{% /tabs %}');
    assert.ok(old.includes("Invalid attribute: 'name'"), old.join("; "));
    assert.ok(old.includes("Missing required attribute: 'label'"), old.join("; "));
  });

  it("card-grid takes 1 to 4 columns, default 3", () => {
    const { tags } = portalMarkdocConfig();
    assert.equal(tags["card-grid"].attributes.columns.default, 3);
    assert.deepEqual(problems("{% card-grid columns=2 %}{% /card-grid %}"), []);
    assert.deepEqual(problems("{% card-grid %}{% /card-grid %}"), []);
    assert.equal(problems("{% card-grid columns=7 %}{% /card-grid %}").length, 1);
  });

  it("accepts the process=false fence annotation (shows tags without checking them)", () => {
    assert.deepEqual(problems("```md {% process=false %}\n{% not-a-tag x=1 %}\n```\n"), []);
  });
});
