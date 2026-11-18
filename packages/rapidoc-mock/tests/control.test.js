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
      { name: "Owner", key: "id", path: "/owners/{}", records: 10 },
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

  it("counts the records of the caller's session in the model", async () => {
    const session = { "x-mock-session": "model-1" };
    await call("POST", "/pc/owners", owner, session);
    const mine = (await call("GET", "/__mock/model/pc", undefined, session)).body;
    assert.equal(mine.resources.find((one) => one.name === "Owner").records, 11);
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

  it("names the method an endpoint takes, and the endpoints there are", async () => {
    assert.equal((await call("GET", "/__mock/reset")).status, 405);
    assert.equal((await call("POST", "/__mock/state")).status, 405);
    const unknown = await call("GET", "/__mock/nothing");
    assert.equal(unknown.status, 404);
    assert.match(
      unknown.body.detail,
      /health, model, settings, reset, state, snapshot, restore, ui/,
    );
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
