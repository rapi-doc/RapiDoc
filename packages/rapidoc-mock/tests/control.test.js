// The control API under /__mock: health, and the stored records of the stateful mode.
import { before, describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { createMockApp } from "../src/index.js";
import { FIXTURES, quiet } from "./helpers.js";

const spec = (id, file) => ({ id, fullPath: path.join(FIXTURES, "core-specs", file) });

const clientOf =
  (app) =>
  async (method, url, body, headers = {}) => {
    const response = await app.request(url, {
      method,
      headers: {
        authorization: "Bearer test",
        ...(body === undefined ? {} : { "content-type": "application/json" }),
        ...headers,
      },
      body: body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body),
    });
    const text = await response.text();
    let parsed = text;
    try {
      parsed = JSON.parse(text);
    } catch {
      // not JSON
    }
    return { status: response.status, body: parsed };
  };

const owner = {
  firstName: "Asha",
  lastName: "Rao",
  address: "1 Main St",
  city: "Pune",
  telephone: "5551234567",
};

describe("/__mock with --stateful", () => {
  let call;
  const ownerIds = async (headers) =>
    (await call("GET", "/pc/owners", undefined, headers)).body.map((one) => one.id);

  before(async () => {
    const mock = await createMockApp({
      apis: [spec("pc", "petclinic.yaml"), spec("rw", "realworld.yaml")],
      stateful: true,
      ...quiet,
    });
    call = clientOf(mock.app);
  });

  it("answers a ready check with the APIs", async () => {
    const { status, body } = await call("GET", "/__mock/health");
    assert.equal(status, 200);
    assert.deepEqual(body, {
      status: "ok",
      apis: [
        { id: "pc", stateful: true },
        { id: "rw", stateful: true },
      ],
    });
  });

  it("reads the stored records: all, one API, one resource, one record", async () => {
    const all = (await call("GET", "/__mock/state")).body;
    assert.deepEqual(Object.keys(all), ["pc", "rw"]);
    assert.equal(all.pc.Owner.length, 10);

    const api = (await call("GET", "/__mock/state/pc")).body;
    assert.deepEqual(api, all.pc);
    const owners = (await call("GET", "/__mock/state/pc/Owner")).body;
    assert.deepEqual(owners, all.pc.Owner);
    const one = await call("GET", "/__mock/state/pc/Owner/3");
    assert.deepEqual(one.body, owners[2]);

    assert.equal((await call("GET", "/__mock/state/pc/Owner/999")).status, 404);
    assert.equal((await call("GET", "/__mock/state/pc/Nothing")).status, 404);
    assert.equal((await call("GET", "/__mock/state/nope")).status, 404);
  });

  it("shows what a request stored, and resets to the seed data", async () => {
    const created = await call("POST", "/pc/owners", owner);
    const stored = await call("GET", `/__mock/state/pc/Owner/${created.body.id}`);
    assert.equal(stored.body.lastName, "Rao");
    await call("DELETE", "/pc/owners/1");
    assert.equal((await ownerIds()).includes(1), false);

    assert.equal((await call("POST", "/__mock/reset")).status, 204);
    assert.deepEqual(await ownerIds(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it("resets one API and leaves the others", async () => {
    await call("DELETE", "/pc/owners/1");
    const made = await call("POST", "/rw/articles", {
      article: { title: "Kept", description: "d", body: "b" },
    });
    assert.equal(made.status, 201);

    assert.equal((await call("POST", "/__mock/reset?api=pc")).status, 204);
    assert.equal((await ownerIds()).length, 10);
    assert.equal((await call("GET", "/__mock/state/rw/Article")).body.length, 11);
    assert.equal((await call("POST", "/__mock/reset?api=nope")).status, 404);
    await call("POST", "/__mock/reset");
  });

  it("keeps a session's records apart, in every endpoint", async () => {
    const session = { "x-mock-session": "t1" };
    await call("POST", "/pc/owners", owner, session);
    assert.equal((await call("GET", "/__mock/state/pc/Owner", undefined, session)).body.length, 11);
    assert.equal((await call("GET", "/__mock/state/pc/Owner")).body.length, 10);

    await call("POST", "/__mock/reset", undefined, session);
    assert.equal((await ownerIds(session)).length, 10);
  });

  it("takes a snapshot and restores it, with the parents of nested records", async () => {
    const snapshot = (await call("POST", "/__mock/snapshot")).body;
    assert.deepEqual(Object.keys(snapshot), ["pc", "rw"]);
    const slug = snapshot.rw.Article[0].slug;
    const before = (await call("GET", `/rw/articles/${slug}/comments`)).body.comments;
    assert.ok(before.length > 0);

    await call("DELETE", "/pc/owners/2");
    await call("DELETE", `/rw/articles/${slug}/comments/${before[0].id}`);
    assert.equal((await call("POST", "/__mock/restore", snapshot)).status, 204);

    assert.equal((await ownerIds()).length, 10);
    const after = (await call("GET", `/rw/articles/${slug}/comments`)).body.comments;
    assert.deepEqual(after, before, "each comment is back under its own article");
  });

  it("restores data a test wrote, for the APIs it names only", async () => {
    const mine = { pc: { Owner: [{ id: 7, ...owner }] } };
    assert.equal((await call("POST", "/__mock/restore", mine)).status, 204);
    assert.deepEqual(await ownerIds(), [7]);
    assert.deepEqual((await call("GET", "/__mock/state/pc/Pet")).body, [], "left out: empty");
    assert.equal((await call("GET", "/__mock/state/rw/Article")).body.length, 10, "not named");

    const one = (await call("POST", "/__mock/snapshot?api=pc")).body;
    assert.deepEqual(Object.keys(one), ["pc"]);
    await call("POST", "/__mock/reset");
    assert.equal((await ownerIds()).length, 10, "a reset still goes back to the seed data");
  });

  it("changes nothing when the document is wrong", async () => {
    const bad = [
      "not json",
      [],
      { pc: [] },
      { pc: { Owner: {} } },
      { pc: { Nothing: [] } },
      { nope: { Owner: [] } },
      { pc: { Owner: [] }, rw: { Nothing: [] } },
    ];
    for (const body of bad) {
      const { status } = await call("POST", "/__mock/restore", body);
      assert.ok(status === 400 || status === 404, JSON.stringify(body));
    }
    assert.equal((await ownerIds()).length, 10);
  });

  it("describes what it made of each spec: resources, operations and their labels", async () => {
    const { apis } = (await call("GET", "/__mock/model")).body;
    assert.deepEqual(
      apis.map((api) => api.id),
      ["pc", "rw"],
    );
    const pc = apis[0];
    assert.deepEqual(pc.labels, { confident: 34, needsReview: 0, plainMock: 3 });
    assert.deepEqual(
      pc.resources.find((one) => one.name === "Owner"),
      { name: "Owner", key: "id", path: "/owners/{}", records: 10, seeded: 10 },
    );
    assert.equal(pc.operations.length, 37);
    const list = pc.operations.find((op) => op.method === "GET" && op.path === "/owners");
    assert.equal(list.action, "list");
    assert.equal(list.resource, "Owner");
    assert.equal(list.label, "confident");
    assert.ok(pc.operations.some((op) => op.label === "plainMock" && op.action === "none"));

    const review = apis[1].operations.filter((op) => op.label === "needsReview");
    assert.ok(review.length > 0 && review.every((op) => op.why || op.resource));
    assert.deepEqual((await call("GET", "/__mock/model/pc")).body, pc);
    assert.equal((await call("GET", "/__mock/model/nope")).status, 404);
  });

  it("describes one resource: its fields, how each is seeded, its links and operations", async () => {
    const { status, body: pet } = await call("GET", "/__mock/model/pc/resources/Pet");
    assert.equal(status, 200);
    assert.deepEqual(
      { name: pet.name, key: pet.key, schema: pet.schema, records: pet.records },
      { name: "Pet", key: "id", schema: "Pet", records: 10 },
    );
    const field = (name) => pet.fields.find((one) => one.name === name);
    assert.deepEqual(field("id"), {
      name: "id",
      type: "integer",
      format: "int32",
      required: true,
      readOnly: true,
      example: 1,
      key: true,
      seededAs: "the key: counts up from 1",
    });
    assert.equal(field("ownerId").seededAs, "the id of a Owner record");
    assert.match(field("name").seededAs, /pet's name/);
    assert.deepEqual(
      pet.relations.find((one) => one.field === "ownerId"),
      { field: "ownerId", to: "Owner.id" },
    );
    assert.ok(pet.operations.length > 0 && pet.operations.every((op) => op.resource === "Pet"));

    const owner1 = (await call("GET", "/__mock/model/pc/resources/Owner")).body;
    assert.ok(owner1.referencedBy.includes("Pet.ownerId"));
    assert.match(
      owner1.fields.find((one) => one.name === "firstName").seededAs,
      /a first name when it fits the pattern/,
    );
    // a field that copies another resource's records lists that resource's fields, nested, without seeding
    // notes (those are the other resource's to say); the core specs test covers a nested object that is seeded
    const visits = field("visits");
    assert.equal(visits.type, "array of object");
    assert.ok(visits.fields.some((one) => one.name === "date"));
    assert.ok(visits.fields.every((one) => !("seededAs" in one)));
    const pets = owner1.fields.find((one) => one.name === "pets");
    assert.ok(pets.fields.find((one) => one.name === "type")?.fields?.length > 0);
    assert.ok(pets.fields.every((one) => !("seededAs" in one)));
    assert.equal((await call("GET", "/__mock/model/pc/resources/Nothing")).status, 404);
    assert.equal((await call("GET", "/__mock/model/pc/other")).status, 404);
  });

  it("generates a sample record without storing it", async () => {
    const one = (await call("GET", "/__mock/model/pc/resources/Owner/sample?seed=5")).body;
    assert.equal(one.seed, 5);
    assert.equal(typeof one.record.firstName, "string");
    const again = (await call("GET", "/__mock/model/pc/resources/Owner/sample?seed=5")).body;
    assert.deepEqual(again, one, "the same seed gives the same record");
    const other = (await call("GET", "/__mock/model/pc/resources/Owner/sample")).body;
    assert.ok(Number.isInteger(other.seed));
    assert.equal((await call("GET", "/__mock/state/pc/Owner")).body.length, 10, "nothing stored");
    assert.equal((await call("GET", "/__mock/model/pc/resources/Owner/sample?seed=x")).status, 400);
  });

  it("describes one operation: what the mock does, its parameters, responses and a sample", async () => {
    const list = (await call("GET", "/__mock/model/pc")).body.operations.find(
      (op) => op.method === "GET" && op.path === "/owners",
    );
    const at = (id) => `/__mock/model/pc/operations/${encodeURIComponent(id)}`;
    const { status, body: op } = await call("GET", at(list.id));
    assert.equal(status, 200);
    assert.equal(op.does, "Lists the stored `Owner` records, filtered by `lastName`.");
    assert.deepEqual(
      op.parameters.find((one) => one.name === "lastName"),
      {
        name: "lastName",
        in: "query",
        required: false,
        type: "string",
        description: "Last name.",
        role: "filters by `lastName`",
      },
    );
    const ok = op.responses.find((one) => one.code === "200");
    assert.equal(ok.schema, "Owner");
    assert.equal(ok.many, true);
    assert.equal(ok.returned, true);
    assert.ok(["example", "examples", "generated"].includes(ok.body));
    assert.ok(op.responses.filter((one) => one.returned).length === 1);
    assert.equal(op.sample.status, 200);
    assert.ok(Array.isArray(JSON.parse(op.sample.body)));
    // another documented response, as a request with Prefer: code= gets it
    const other = op.responses.find((one) => /^[45]\d\d$/.test(one.code));
    assert.ok(other, "GET /owners documents an error response");
    const picked = (await call("GET", `${at(list.id)}?code=${other.code}`)).body;
    assert.equal(picked.sample.status, Number(other.code));
    assert.equal((await call("GET", `${at(list.id)}?code=abc`)).status, 400);

    const read = (await call("GET", "/__mock/model/pc")).body.operations.find(
      (one) => one.method === "GET" && one.path === "/owners/{ownerId}/pets/{petId}",
    );
    const detail = (await call("GET", at(read.id))).body;
    assert.equal(
      detail.does,
      "Returns the `Pet` record whose `id` is in the path parameter `petId`. If no such record is stored, it responds with HTTP status 404 (Not Found).",
    );
    assert.deepEqual(
      detail.parameters.map((one) => one.role),
      ["a parent of the record", "the `id` of the record"],
    );

    const plain = (await call("GET", "/__mock/model/pc")).body.operations.find(
      (one) => one.label === "plainMock",
    );
    assert.match((await call("GET", at(plain.id))).body.does, /^Keeps no state/);
    assert.equal((await call("GET", at("nope"))).status, 404);
  });

  it("says which parameters of an operation need review, apart from its other assumptions", async () => {
    const { body: op } = await call("GET", "/__mock/model/rw/operations/GetArticles");
    assert.deepEqual(op.review, {
      parameters: 2,
      other: "returns inline objects; assumed to be `Article`",
    });
    const byName = Object.fromEntries(op.parameters.map((one) => [one.name, one]));
    assert.equal(byName.tag.review, "matches no field of `Article`");
    assert.equal(byName.tag.role, "ignored when listing");
    assert.equal(byName.author.review, "matches no field of `Article`");
    assert.equal(byName.favorited.review, undefined);
    assert.equal(byName.limit.review, undefined);
    // an operation with nothing assumed has no review
    const read = (await call("GET", "/__mock/model/pc")).body.operations.find(
      (one) => one.method === "GET" && one.path === "/owners/{ownerId}",
    );
    const detail = (await call("GET", `/__mock/model/pc/operations/${encodeURIComponent(read.id)}`))
      .body;
    assert.equal(detail.review, undefined);
  });

  it("counts the records of the caller's session in the model", async () => {
    const session = { "x-mock-session": "model-1" };
    await call("POST", "/pc/owners", owner, session);
    const mine = (await call("GET", "/__mock/model/pc", undefined, session)).body;
    assert.equal(mine.resources.find((one) => one.name === "Owner").records, 11);
    assert.equal(mine.resources.find((one) => one.name === "Owner").seeded, 10);
    const shared = (await call("GET", "/__mock/model/pc")).body;
    assert.equal(shared.resources.find((one) => one.name === "Owner").records, 10);
  });

  it("serves the Mock UI: a page and its script, at either form of the URL", async () => {
    const page = await call("GET", "/__mock/ui");
    assert.equal(page.status, 200);
    assert.match(page.body, /<rapidoc-mock-ui>/);
    assert.match(page.body, /src="ui\/mock-ui\.js"/);
    assert.match((await call("GET", "/__mock/ui/")).body, /src="mock-ui\.js"/);

    // built by `npm run build` in this package (pretest, and pretest:portal at the root)
    const script = await call("GET", "/__mock/ui/mock-ui.js");
    assert.equal(script.status, 200);
    assert.match(script.body, /rapidoc-mock-ui/);
    assert.equal((await call("GET", "/__mock/ui/other.js")).status, 404);
  });

  it("shows how it was started, and changes the response delay while running", async () => {
    const shown = (await call("GET", "/__mock/settings")).body;
    assert.equal(shown.stateful, true);
    assert.deepEqual(
      { delay: shown.delay, rows: shown.rows, seed: shown.seed },
      { delay: 0, rows: 10, seed: 1 },
    );
    assert.deepEqual(
      shown.apis.map((api) => [api.id, api.stateful, api.operations]),
      [
        ["pc", true, 37],
        ["rw", true, 19],
      ],
    );

    const changed = await call("PATCH", "/__mock/settings", { delay: 120 });
    assert.equal(changed.body.delay, 120);
    const before = Date.now();
    await call("GET", "/pc/owners");
    assert.ok(Date.now() - before >= 110, "an API response waits");
    const control = Date.now();
    await call("GET", "/__mock/health");
    assert.ok(Date.now() - control < 100, "the mock's own endpoints do not");

    for (const bad of [{ delay: -1 }, { delay: 1.5 }, { delay: "1" }, { rows: 5 }, [], "x"]) {
      assert.equal((await call("PATCH", "/__mock/settings", bad)).status, 400, JSON.stringify(bad));
    }
    assert.equal((await call("PATCH", "/__mock/settings", { delay: 0 })).body.delay, 0);
    assert.equal((await call("POST", "/__mock/settings")).status, 405);
  });

  it("makes new seed data of another size, for every session", async () => {
    const session = { "x-mock-session": "reseed-1" };
    await call("POST", "/pc/owners", owner, session);
    const first = (await call("GET", "/pc/owners")).body;

    assert.equal((await call("POST", "/__mock/reset", { rows: 3, seed: 7 })).status, 204);
    assert.equal((await ownerIds()).length, 3);
    assert.equal((await ownerIds(session)).length, 3, "the session's own records are gone");
    const settings = (await call("GET", "/__mock/settings")).body;
    assert.deepEqual({ rows: settings.rows, seed: settings.seed }, { rows: 3, seed: 7 });

    await call("DELETE", "/pc/owners/1");
    await call("POST", "/__mock/reset");
    assert.equal((await ownerIds()).length, 3, "a plain reset goes back to the new seed data");

    assert.equal((await call("POST", "/__mock/reset", { rows: -1 })).status, 400);
    assert.equal((await call("POST", "/__mock/reset", { rows: 10, seed: 1 })).status, 204);
    assert.deepEqual((await call("GET", "/pc/owners")).body, first, "same seed, same data");
  });

  it("has no lint of its own: /__mock/lint answers only when the mock was given a lint function", async () => {
    assert.equal((await call("GET", "/__mock/settings")).body.lint, false);
    const none = await call("GET", "/__mock/lint/pc");
    assert.equal(none.status, 404);
    assert.match(none.body.detail, /started without lint/);

    const asked = [];
    let fail = true;
    const mock = await createMockApp({
      apis: [spec("pc", "petclinic.yaml")],
      stateful: true,
      lint: async (api) => {
        asked.push(api.id);
        if (fail) throw new Error("the linter broke\nwith a stack");
        return { linted: true, problems: [], summary: { errors: 0, warnings: 0, categories: [] } };
      },
      ...quiet,
    });
    const withLint = clientOf(mock.app);
    assert.equal((await withLint("GET", "/__mock/settings")).body.lint, true);
    const failed = await withLint("GET", "/__mock/lint/pc");
    assert.equal(failed.status, 500);
    assert.equal(failed.body.detail, "the linter broke");
    fail = false;
    const first = await withLint("GET", "/__mock/lint/pc");
    assert.equal(first.status, 200);
    assert.equal(first.body.linted, true);
    await withLint("GET", "/__mock/lint/pc");
    assert.deepEqual(asked, ["pc", "pc"], "a failure is asked again, an answer is kept");
    assert.equal((await withLint("GET", "/__mock/lint/other")).status, 404);
    assert.equal((await withLint("POST", "/__mock/lint/pc")).status, 405);
  });

  it("names the method an endpoint takes, and the endpoints there are", async () => {
    assert.equal((await call("GET", "/__mock/reset")).status, 405);
    assert.equal((await call("POST", "/__mock/state")).status, 405);
    const unknown = await call("GET", "/__mock/nothing");
    assert.equal(unknown.status, 404);
    assert.match(
      unknown.body.detail,
      /health, model, lint, settings, reset, state, snapshot, restore, ui/,
    );
  });
});

describe("POST /__mock/apis: a spec imported while the mock runs", () => {
  /** A request as it comes from another address: the Node server passes it as `env.incoming`. */
  const from = (address) => ({ incoming: { socket: { remoteAddress: address } } });
  const tiny = (title) =>
    `openapi: 3.1.0\ninfo: { title: ${title}, version: 1.0.0 }\npaths:\n  /ping:\n    get:\n      responses:\n        '200': { description: OK, content: { application/json: { example: { ok: true } } } }\n`;
  let app;
  const send = (method, url, body, env = from("127.0.0.1")) =>
    app.request(
      url,
      {
        method,
        ...(body === undefined
          ? {}
          : { headers: { "content-type": "application/json" }, body: JSON.stringify(body) }),
      },
      env,
    );

  before(async () => {
    ({ app } = await createMockApp({
      apis: [spec("pc", "petclinic.yaml")],
      stateful: true,
      ...quiet,
    }));
  });

  it("serves a spec sent as text at once, named after its title, and lists it as imported", async () => {
    const added = await send("POST", "/__mock/apis", { text: tiny("Tiny Shop") });
    assert.equal(added.status, 201);
    assert.deepEqual(await added.json(), {
      id: "tiny-shop",
      title: "Tiny Shop",
      operations: 1,
      stateful: true,
    });
    assert.equal((await app.request("/tiny-shop/ping")).status, 200);
    const settings = await (await send("GET", "/__mock/settings")).json();
    assert.equal(settings.import, true);
    // a caller on another machine is not offered the import
    const remote = await (
      await send("GET", "/__mock/settings", undefined, from("10.0.0.7"))
    ).json();
    assert.equal(remote.import, false);
    assert.deepEqual(
      settings.apis.map((one) => [one.id, Boolean(one.imported)]),
      [
        ["pc", false],
        ["tiny-shop", true],
      ],
    );
    // the same spec again: another id, the first stays
    const again = await (await send("POST", "/__mock/apis", { text: tiny("Tiny Shop") })).json();
    assert.equal(again.id, "tiny-shop-2");
  });

  it("names a spec sent with a file name after the file", async () => {
    const added = await (
      await send("POST", "/__mock/apis", { text: tiny("X"), name: "orders-api.yaml" })
    ).json();
    assert.equal(added.id, "orders-api");
  });

  it("removes an imported API, and only those", async () => {
    await send("POST", "/__mock/apis", { text: tiny("Gone Soon") });
    assert.equal((await send("DELETE", "/__mock/apis/gone-soon")).status, 204);
    assert.equal((await app.request("/gone-soon/ping")).status, 404);
    assert.equal((await send("DELETE", "/__mock/apis/pc")).status, 404);
    assert.equal((await app.request("/pc/owners")).status, 200);
  });

  it("says why a spec can't be served, without the file it was written to", async () => {
    const bad = await send("POST", "/__mock/apis", {
      text: "swagger: '2.0'\ninfo: {}\n",
      name: "old.yaml",
    });
    assert.equal(bad.status, 400);
    const { detail } = await bad.json();
    assert.match(detail, /^old\.yaml is not OpenAPI 3\.0, 3\.1 or 3\.2 \(Swagger 2\.0\)/);
    assert.equal((await send("POST", "/__mock/apis", {})).status, 400);
    assert.equal(
      (await send("POST", "/__mock/apis", { url: "ftp://example.com/a.yaml" })).status,
      400,
    );
  });

  it("takes a spec only from the machine the mock runs on", async () => {
    for (const address of ["10.0.0.7", "192.168.1.20", undefined]) {
      const refused = await send("POST", "/__mock/apis", { text: tiny("Remote") }, from(address));
      assert.equal(refused.status, 403, `from ${address}`);
    }
    for (const address of ["::1", "::ffff:127.0.0.1"]) {
      assert.equal(
        (await send("POST", "/__mock/apis", { text: tiny("Local") }, from(address))).status,
        201,
      );
    }
  });
});

describe("/__mock without --stateful", () => {
  it("answers the ready check, and says why there is no state", async () => {
    const { app, skipped } = await createMockApp({
      apis: [spec("pc", "petclinic.yaml"), spec("__mock", "museum.yaml")],
      delay: 30,
      ...quiet,
    });
    const call = clientOf(app);
    assert.deepEqual((await call("GET", "/__mock/health")).body, {
      status: "ok",
      apis: [{ id: "pc", stateful: false }],
    });
    const reset = await call("POST", "/__mock/reset");
    assert.equal(reset.status, 409);
    assert.match(reset.body.detail, /--stateful/);
    assert.equal(skipped[0].id, "__mock", "the control API's path is no API id");
    const settings = (await call("GET", "/__mock/settings")).body;
    assert.equal(settings.stateful, false);
    assert.equal(settings.delay, 30, "the delay option works without state too");
  });
});
