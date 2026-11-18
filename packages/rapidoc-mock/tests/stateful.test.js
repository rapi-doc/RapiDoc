import { before, describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { createMockApp } from "../src/index.js";
import { pathParams } from "../src/stateful/handlers.js";
import { FIXTURES, quiet } from "./helpers.js";

const spec = (id, file) => ({ id, fullPath: path.join(FIXTURES, "core-specs", file) });

/** A JSON client over the app: `call("POST", "/pc/owners", body, headers)` -> `{ status, body }`. */
const clientOf =
  (app) =>
  async (method, url, body, headers = {}) => {
    const response = await app.request(url, {
      method,
      headers: {
        authorization: "Bearer test",
        ...(body ? { "content-type": "application/json" } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
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

describe("rapidoc mock --stateful", () => {
  let call;
  let apis;

  before(async () => {
    const mock = await createMockApp({
      apis: [spec("pc", "petclinic.yaml"), spec("ny", "nylas.json"), spec("rw", "realworld.yaml")],
      stateful: true,
      ...quiet,
    });
    apis = mock.apis;
    call = clientOf(mock.app);
  });

  it("reports what it made of each API", () => {
    const { resources, confident, needsReview, plainMock } = apis[0].stateful;
    assert.equal(resources.Owner, 10);
    assert.deepEqual(
      { confident, needsReview, plainMock },
      {
        confident: 34,
        needsReview: 0,
        plainMock: 3,
      },
    );
  });

  it("lists the seeded records", async () => {
    const { status, body } = await call("GET", "/pc/owners");
    assert.equal(status, 200);
    assert.equal(body.length, 10);
  });

  it("returns a created record from reads and lists", async () => {
    const created = await call("POST", "/pc/owners", owner);
    assert.equal(created.status, 201);
    assert.equal(created.body.firstName, "Asha");
    assert.deepEqual(created.body.pets, [], "a new owner has no pets");
    const { id } = created.body;
    assert.equal(typeof id, "number");

    const read = await call("GET", `/pc/owners/${id}`);
    assert.deepEqual(read.body, created.body);
    const listed = await call("GET", "/pc/owners?lastName=Rao");
    assert.deepEqual(
      listed.body.map((one) => one.id),
      [id],
    );
  });

  it("replaces a record on PUT and keeps its key", async () => {
    const { body: created } = await call("POST", "/pc/owners", { ...owner, lastName: "Putter" });
    const updated = await call("PUT", `/pc/owners/${created.id}`, {
      ...owner,
      lastName: "Putter",
      city: "Mumbai",
    });
    assert.equal(updated.status, 200);
    const { body } = await call("GET", `/pc/owners/${created.id}`);
    assert.equal(body.city, "Mumbai");
    assert.equal(body.id, created.id);
  });

  it("deletes a record: the next read is the spec's 404", async () => {
    const { body: created } = await call("POST", "/pc/owners", { ...owner, lastName: "Gone" });
    assert.equal((await call("DELETE", `/pc/owners/${created.id}`)).status, 200);
    assert.equal((await call("GET", `/pc/owners/${created.id}`)).status, 404);
    assert.equal((await call("DELETE", `/pc/owners/${created.id}`)).status, 404);
  });

  it("gives each session its own data", async () => {
    const session = { "x-mock-session": "test-a" };
    const before = (await call("GET", "/pc/owners")).body.length;
    await call("POST", "/pc/owners", { ...owner, lastName: "Session" }, session);
    assert.equal((await call("GET", "/pc/owners", null, session)).body.length, before + 1);
    assert.equal((await call("GET", "/pc/owners")).body.length, before);
    assert.equal(
      (await call("GET", "/pc/owners", null, { "x-mock-session": "test-b" })).body.length,
      before,
    );
  });

  it("pages a list", async () => {
    const all = (await call("GET", "/rw/articles")).body;
    const page = (await call("GET", "/rw/articles?limit=3&offset=2")).body;
    assert.deepEqual(page.articles, all.articles.slice(2, 5));
    assert.equal(page.articlesCount, all.articles.length, "the count is of every match");
  });

  it("keeps the response's envelope around the records", async () => {
    const list = await call("GET", "/ny/v3/workspaces");
    assert.equal(typeof list.body.request_id, "string");
    assert.equal(list.body.data.length, 10);

    const created = await call("POST", "/ny/v3/workspaces", { name: "Acme", domain: "acme.test" });
    assert.equal(created.body.data.name, "Acme");
    const id = created.body.data.workspace_id;
    const read = await call("GET", `/ny/v3/workspaces/${id}`);
    assert.deepEqual(read.body.data, created.body.data);
  });

  it("reads the record out of a request's envelope", async () => {
    const created = await call("POST", "/rw/articles", {
      article: { title: "Hello", description: "A greeting", body: "Hello, world" },
    });
    assert.equal(created.status, 201);
    const { article } = created.body;
    assert.equal(article.title, "Hello");
    assert.equal(article.favoritesCount, 0, "a new article starts at zero");
    assert.deepEqual(article.tagList, []);
    const read = await call("GET", `/rw/articles/${article.slug}`);
    assert.deepEqual(read.body.article, article);
  });

  it("answers an operation without state as a plain mock", async () => {
    // RealWorld's login creates nothing that is read back
    const { status, body } = await call("POST", "/rw/users/login", {
      user: { email: "a@example.com", password: "secret" },
    });
    assert.equal(status, 200);
    assert.ok(body.user);
  });

  it("leaves a response asked for by code alone", async () => {
    const before = (await call("GET", "/pc/owners")).body.length;
    const { status } = await call("POST", "/pc/owners", owner, { prefer: "code=400" });
    assert.equal(status, 400);
    assert.equal((await call("GET", "/pc/owners")).body.length, before);
  });

  it("validates a write before it is stored", async () => {
    const before = (await call("GET", "/pc/owners")).body.length;
    const { status } = await call("POST", "/pc/owners", { firstName: 5 });
    assert.equal(status, 400);
    assert.equal((await call("GET", "/pc/owners")).body.length, before);
  });

  it("serves without state when the option is off", async () => {
    const { app, apis: plain } = await createMockApp({
      apis: [spec("pc", "petclinic.yaml")],
      ...quiet,
    });
    assert.equal(plain[0].stateful, undefined);
    const plainCall = clientOf(app);
    const created = await plainCall("POST", "/pc/owners", owner);
    assert.notEqual(created.body.firstName, "Asha");
  });
});

describe("pathParams", () => {
  it("reads the parameters of a path", () => {
    assert.deepEqual(pathParams("/grants/{grant_id}/events/{id}", "/grants/a%20b/events/7"), {
      grant_id: "a b",
      id: "7",
    });
    assert.deepEqual(pathParams("/pets", "/pets"), {});
  });
});
