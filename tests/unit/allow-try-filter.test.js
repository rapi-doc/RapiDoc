import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderTemplateToString } from "../../packages/rapidoc-prerender/src/internal.js";
import ProcessSpec from "../../packages/rapidoc/src/utils/spec-parser.js";
import {
  isTryFilter,
  tryAnywhere,
  tryReasonFor,
  tryStateFor,
} from "../../packages/rapidoc/src/utils/try-filter.js";
import {
  apiCallTemplate,
  reasonLines,
} from "../../packages/rapidoc/src/templates/api-response-template.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const petstore = fs.readFileSync(
  path.resolve(__dirname, "../../sites/rapidoc/public/specs/petstore-3.2.yaml"),
  "utf8",
);

describe("allow-try with filter-operations terms", async () => {
  const spec = await ProcessSpec.call({}, petstore);
  const ops = spec.tags.flatMap((t) => t.paths);
  const byId = (id) => ops.find((p) => p.operationId === id);
  const states = (allowTry) =>
    Object.fromEntries(
      ["getPetById", "searchPets", "copyPet", "purgeInventory"].map((id) => [
        id,
        tryStateFor(allowTry, byId(id)),
      ]),
    );

  it("keeps true and false as they were", () => {
    assert.equal(isTryFilter("true"), false);
    assert.equal(isTryFilter("false"), false);
    assert.equal(isTryFilter(""), false);
    assert.equal(isTryFilter("!deprecated"), true);
    assert.deepEqual(new Set(Object.values(states("true"))), new Set(["true"]));
    assert.deepEqual(new Set(Object.values(states("false"))), new Set(["false"]));
    assert.equal(tryAnywhere("!deprecated"), "true");
    assert.equal(tryAnywhere("false"), "false");
  });

  it("turns Try off for the operations ! terms match", () => {
    assert.deepEqual(states("!tag:pending-implementation"), {
      getPetById: "true",
      searchPets: "true",
      copyPet: "disabled",
      purgeInventory: "disabled",
    });
  });

  it("turns Try on only for the operations include terms match", () => {
    assert.deepEqual(states("tag:store"), {
      getPetById: "disabled",
      searchPets: "disabled",
      copyPet: "disabled",
      purgeInventory: "true",
    });
  });

  it("matches kind: badge tags with badge:, by label or by name", () => {
    assert.equal(tryStateFor('!badge:"Pending implementation"', byId("copyPet")), "disabled");
    assert.equal(tryStateFor("!badge:pending-implementation", byId("copyPet")), "disabled");
    assert.equal(tryStateFor("!badge:beta", byId("searchPets")), "disabled");
    assert.equal(tryStateFor("!badge:beta", byId("copyPet")), "true");
  });

  it("says why Try is off: the ! term that matched, or the include terms", () => {
    assert.equal(
      tryReasonFor("!deprecated !tag:pending-implementation", byId("copyPet")),
      "Try is off for operations tagged pending-implementation",
    );
    assert.equal(
      tryReasonFor('!badge:"Pending implementation"', byId("purgeInventory")),
      "Try is off for operations with the Pending implementation badge",
    );
    assert.equal(
      tryReasonFor("!GET /pet/{petId}", byId("getPetById")),
      "Try is off for GET /pet/{petId}",
    );
    assert.equal(
      tryReasonFor("tag:store getPetById", byId("searchPets")),
      "Try is only on for operations tagged store, getPetById",
    );
    assert.equal(tryReasonFor("!tag:pending-implementation", byId("getPetById")), "");
    assert.equal(tryReasonFor("false", byId("getPetById")), "");
  });

  it("filter-operations badge: also matches kind: badge tags", async () => {
    const filtered = await ProcessSpec.call(
      {},
      petstore,
      false,
      false,
      false,
      "none",
      "",
      "",
      "",
      "",
      'badge:"Pending implementation"',
    );
    assert.deepEqual(
      filtered.tags
        .flatMap((t) => t.paths)
        .map((p) => p.operationId)
        .sort(),
      ["copyPet", "purgeInventory"],
    );
  });
});

describe("the try bar of an operation Try is off for", () => {
  const base = {
    parameters: [{ name: "petId" }],
    request_body: null,
    security: [],
    api_keys: [],
    responseHeaders: "",
    responseMessage: "",
    requestPhase: "idle",
    hasExampleToFill: true,
    hasValueToClear: true,
    loading: false,
  };
  const render = (allowTry) => renderTemplateToString(apiCallTemplate.call({ ...base, allowTry }));

  it("shows the reason in grey text next to the button", () => {
    const out = renderTemplateToString(
      apiCallTemplate.call({
        ...base,
        allowTry: "disabled",
        tryDisabledReason: "Try is off for deprecated operations",
      }),
    );
    assert.match(
      out,
      /<span class="try-disabled-reason" part="try-disabled-reason"><span>Try is off for<\/span><span>deprecated operations<\/span><\/span><button/,
    );
    assert.match(out, /title="Try is off for deprecated operations"/);
  });

  it("keeps the reason to two lines: a detail longer than one line becomes this operation", () => {
    const lines = (reason) =>
      renderTemplateToString(reasonLines(reason))
        .replace(/<!--.*?-->/g, "")
        .match(/<span>(.*?)<\/span>/g)
        .map((part) => part.replace(/<\/?span>/g, ""));
    assert.deepEqual(lines("Try is off for operations tagged pending-implementation"), [
      "Try is off for",
      "operations tagged pending-implementation",
    ]);
    const many = `Try is only on for ${Array.from({ length: 20 }, (_, i) => `GET /items/${i}`).join(", ")}`;
    assert.deepEqual(lines(many), ["Try is off for", "this operation"]);
    assert.deepEqual(
      lines("Try is off for GET /orgs/{orgId}/projects/{projectId}/members/{memberId}"),
      ["Try is off for", "this operation"],
    );
  });

  it("keeps the whole reason in the tooltip when it shortens the lines", () => {
    const reason = `Try is only on for ${Array.from({ length: 20 }, (_, i) => `GET /items/${i}`).join(", ")}`;
    const out = renderTemplateToString(
      apiCallTemplate.call({ ...base, allowTry: "disabled", tryDisabledReason: reason }),
    );
    assert.match(out, /<span>this operation<\/span>/);
    assert.ok(out.includes(`title="${reason}"`));
  });

  it("shows a disabled TRY DISABLED button and nothing to fill or clear", () => {
    const out = render("disabled");
    assert.match(
      out,
      /<button[^>]*part="btn btn-try btn-try-disabled"[^>]*disabled[^>]*>\s*TRY DISABLED/,
    );
    assert.doesNotMatch(out, /FILL EXAMPLE|>\s*CLEAR\s*</);
  });

  it("keeps TRY, FILL EXAMPLE and CLEAR when Try is on", () => {
    const out = render("true");
    assert.match(out, /part="btn btn-try"[^>]*>\s*TRY\s*</);
    assert.match(out, /FILL EXAMPLE/);
    assert.doesNotMatch(out, /TRY DISABLED/);
  });
});
