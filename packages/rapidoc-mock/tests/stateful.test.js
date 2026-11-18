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

  it("stores a record created under a parent, and lists it there only", async () => {
    const created = await call("POST", "/ny/v3/grants/g-1/calendars", { name: "Team" });
    assert.equal(created.status, 200);
    const calendar = created.body.data;
    assert.equal(calendar.name, "Team");
    assert.equal(calendar.grant_id, "g-1");

    const read = await call("GET", `/ny/v3/grants/g-1/calendars/${calendar.id}`);
    assert.deepEqual(read.body.data, calendar);
    const list = await call("GET", "/ny/v3/grants/g-1/calendars");
    assert.deepEqual(
      list.body.data.map((item) => item.id),
      [calendar.id],
    );
    const elsewhere = await call("GET", "/ny/v3/grants/g-2/calendars");
    assert.equal(elsewhere.body.data.length, 0);
  });

  it("keeps a record under the parent of its path when it has no field for it", async () => {
    // a RealWorld comment has no field for its article: the path alone says where it belongs
    const { body } = await call("GET", "/rw/articles");
    const slugs = body.articles.map((article) => article.slug);
    const commentsOf = async (slug) =>
      (await call("GET", `/rw/articles/${slug}/comments`)).body.comments.map((c) => c.id);

    const seeded = await Promise.all(slugs.map(commentsOf));
    assert.equal(seeded.flat().length, 10, "every seeded comment is under one article");
    assert.equal(new Set(seeded.flat()).size, 10);
    assert.ok(seeded.filter((ids) => ids.length).length > 1, "spread over several articles");

    const empty = slugs[seeded.findIndex((ids) => !ids.length)];
    const created = await call("POST", `/rw/articles/${empty}/comments`, {
      comment: { body: "Nice" },
    });
    assert.equal(created.status, 201);
    const { comment } = created.body;
    assert.equal("$parents" in comment, false, "the parent is kept beside the record, not in it");
    assert.deepEqual(await commentsOf(empty), [comment.id]);
    assert.equal((await commentsOf(slugs[0])).includes(comment.id), false);

    const wrong = await call("DELETE", `/rw/articles/${slugs[0]}/comments/${comment.id}`);
    assert.equal(wrong.status, 404, "not found under another article");
    const right = await call("DELETE", `/rw/articles/${empty}/comments/${comment.id}`);
    assert.ok(right.status < 300);
    assert.deepEqual(await commentsOf(empty), []);
  });

  it("reads an example written as a map of named examples, with and without state", async () => {
    // Nylas: `example: { "Calendars response example": { request_id, data, next_cursor } }`
    const stored = await call("GET", "/ny/v3/grants/g-9/calendars");
    assert.deepEqual(Object.keys(stored.body), ["request_id", "data", "next_cursor"]);

    const plain = await createMockApp({ apis: [spec("ny", "nylas.json")], ...quiet });
    const response = await clientOf(plain.app)("GET", "/ny/v3/grants/g-9/calendars");
    assert.deepEqual(Object.keys(response.body), ["request_id", "data", "next_cursor"]);
    assert.equal(response.body.data[0].name, "My New Calendar", "the example's own values");
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
