// The stateful mock's classifier (a spike): an OpenAPI document in, the data model and operation map out.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadSpec } from "../src/spec.js";
import { classifySpec } from "../src/stateful/classify.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const petstore = await loadSpec(path.resolve(here, "../../../docs/public/specs/petstore-3.2.yaml"));

describe("classifySpec on the Petstore", () => {
  const model = classifySpec(petstore);

  it("finds the resources, their path shapes and keys", () => {
    assert.deepEqual(model.resources, {
      Pet: { path: "/pet/{}", key: "id" },
      Order: { path: "/store/order/{}", key: "id" },
      User: { path: "/user/{}", key: "username" },
    });
  });

  it("finds the relation and the embedded schemas", () => {
    assert.deepEqual(model.relations, { "Order.petId": "Pet.id" });
    assert.deepEqual(model.embedded, { "Pet.category": "Category", "Pet.tags": "Tag" });
  });

  it("maps the CRUD operations with no review needed", () => {
    const expected = {
      addPet: { resource: "Pet", action: "create" },
      updatePet: { resource: "Pet", action: "update", keyFrom: "body.id" },
      getPetById: { resource: "Pet", action: "read", keyFrom: "path.petId" },
      deletePet: { resource: "Pet", action: "delete", keyFrom: "path.petId" },
      findPetsByStatus: { resource: "Pet", action: "list", filter: { status: "query.status" } },
      placeOrder: { resource: "Order", action: "create" },
      getOrderById: { resource: "Order", action: "read", keyFrom: "path.orderId" },
      deleteOrder: { resource: "Order", action: "delete", keyFrom: "path.orderId" },
      createUser: { resource: "User", action: "create" },
      createUsersWithListInput: { resource: "User", action: "createMany" },
      getUserByName: { resource: "User", action: "read", keyFrom: "path.username" },
      updateUser: { resource: "User", action: "update", keyFrom: "path.username" },
      deleteUser: { resource: "User", action: "delete", keyFrom: "path.username" },
    };
    for (const [id, entry] of Object.entries(expected)) {
      assert.deepEqual(model.operations[id], entry, id);
    }
  });

  it("leaves what is not CRUD alone", () => {
    for (const id of ["uploadFile", "getInventory", "loginUser", "logoutUser", "copyPet"]) {
      assert.equal(model.operations[id].action, "none", id);
    }
  });

  it("marks what it assumed for review, with the reason", () => {
    assert.equal(model.operations.findPetsByTags.filter["tags[].name"], "query.tags");
    assert.equal(model.operations.findPetsByTags.review, true);
    assert.equal(model.operations.updatePetWithForm.action, "patch");
    assert.equal(model.operations.searchPets.action, "list");
    assert.deepEqual(
      model.review.map((line) => line.split(":")[0]),
      ["findPetsByTags", "updatePetWithForm", "searchPets"].sort(
        (a, b) =>
          Object.keys(model.operations).indexOf(a) - Object.keys(model.operations).indexOf(b),
      ),
    );
  });
});

describe("classifySpec: names", () => {
  const spec = (paths, schemas) => ({ openapi: "3.1.0", info: {}, paths, components: { schemas } });
  const json = (schema) => ({ content: { "application/json": { schema } } });
  const ref = (name) => ({ $ref: `#/components/schemas/${name}` });

  it("matches by position: parameter names may differ between operations", () => {
    const model = classifySpec(
      spec(
        {
          "/pets/{petId}": { get: { operationId: "get", responses: { 200: json(ref("Pet")) } } },
          "/pets/{targetPetId}": {
            put: {
              operationId: "put",
              requestBody: json(ref("Pet")),
              responses: { 200: json(ref("Pet")) },
            },
          },
        },
        { Pet: { type: "object", properties: { id: { type: "integer" } } } },
      ),
    );
    assert.equal(model.operations.get.keyFrom, "path.petId");
    assert.equal(model.operations.put.keyFrom, "path.targetPetId");
    assert.equal(model.operations.put.resource, "Pet");
    assert.deepEqual(model.review, []);
  });

  it("reduces DTO variants to one entity and unwraps a list wrapper", () => {
    const pet = {
      type: "object",
      properties: { id: { type: "integer" }, name: { type: "string" } },
    };
    const model = classifySpec(
      spec(
        {
          "/pets": {
            get: { operationId: "list", responses: { 200: json(ref("PaginatedPetList")) } },
            post: {
              operationId: "create",
              requestBody: json(ref("CreatePetDto")),
              responses: { 201: json(ref("Pet")) },
            },
          },
          "/pets/{id}": {
            patch: {
              operationId: "patch",
              requestBody: json(ref("UpdatePetDto")),
              responses: { 200: json(ref("Pet")) },
            },
          },
        },
        {
          Pet: pet,
          CreatePetDto: pet,
          UpdatePetDto: pet,
          PaginatedPetList: {
            type: "object",
            properties: {
              count: { type: "integer" },
              results: { type: "array", items: ref("Pet") },
            },
          },
        },
      ),
    );
    assert.deepEqual(Object.keys(model.resources), ["Pet"]);
    assert.deepEqual(model.operations.create, { resource: "Pet", action: "create" });
    assert.deepEqual(model.operations.patch, {
      resource: "Pet",
      action: "patch",
      keyFrom: "path.id",
    });
    assert.deepEqual(model.operations.list, {
      resource: "Pet",
      action: "list",
      listProperty: "results",
    });
  });

  it("takes the record from what a GET returns, not from a shared write response", () => {
    // Apideck: every write answers with one small `{ id }` schema
    const activity = {
      type: "object",
      properties: { id: { type: "string" }, title: { type: "string" } },
    };
    const model = classifySpec(
      spec(
        {
          "/activities/{id}": {
            get: {
              operationId: "one",
              responses: { 200: json({ type: "object", properties: { data: ref("Activity") } }) },
            },
            patch: {
              operationId: "update",
              requestBody: json(ref("Activity")),
              responses: { 200: json(ref("UnifiedId")) },
            },
            delete: { operationId: "remove", responses: { 200: json(ref("UnifiedId")) } },
          },
        },
        {
          Activity: activity,
          UnifiedId: { type: "object", properties: { id: { type: "string" } } },
        },
      ),
    );
    assert.deepEqual(Object.keys(model.resources), ["Activity"]);
    for (const id of ["one", "update", "remove"])
      assert.equal(model.operations[id].resource, "Activity", id);
  });

  it("merges snake_case variants and maps a nested collection", () => {
    const key = {
      type: "object",
      properties: { id: { type: "string" }, appId: { type: "string" } },
    };
    const model = classifySpec(
      spec(
        {
          "/apps/{app_id}/keys": {
            get: {
              operationId: "list",
              responses: { 200: json({ type: "array", items: ref("key_response") }) },
            },
            post: {
              operationId: "create",
              requestBody: json(ref("key_post")),
              responses: { 201: json(ref("key_response")) },
            },
          },
          "/apps/{app_id}/keys/{key_id}": {
            patch: {
              operationId: "patch",
              requestBody: json(ref("key_patch")),
              responses: { 200: json(ref("key_response")) },
            },
          },
          "/apps/{app_id}/keys/{key_id}/revoke": {
            post: { operationId: "revoke", responses: { 200: json({}) } },
          },
        },
        { key_response: key, key_post: key, key_patch: key },
      ),
    );
    assert.deepEqual(model.resources, { key: { path: "/apps/{}/keys/{}", key: "id" } });
    assert.deepEqual(model.operations.list, { resource: "key", action: "list" });
    assert.deepEqual(model.operations.create, { resource: "key", action: "create" });
    assert.equal(model.operations.patch.keyFrom, "path.key_id");
    assert.equal(model.operations.revoke.action, "none");
  });

  it("maps an inline list, an item path with only a DELETE, and a create named by its response", () => {
    const comment = {
      type: "object",
      properties: { id: { type: "integer" }, body: { type: "string" } },
    };
    const model = classifySpec(
      spec(
        {
          "/comments": {
            get: {
              operationId: "list",
              responses: {
                200: json({
                  type: "object",
                  properties: {
                    comments: { type: "array", items: { type: "object", properties: { id: {} } } },
                  },
                }),
              },
            },
            post: {
              operationId: "create",
              requestBody: json(ref("CommentFields")),
              responses: { 201: json(ref("Comment")) },
            },
          },
          "/comments/{id}": { delete: { operationId: "remove", responses: { 204: {} } } },
        },
        {
          Comment: comment,
          CommentFields: { type: "object", properties: { body: { type: "string" } } },
        },
      ),
    );
    assert.deepEqual(model.resources, { Comment: { path: "/comments/{}", key: "id" } });
    assert.equal(model.operations.list.action, "list");
    assert.equal(model.operations.list.listProperty, "comments");
    assert.match(model.operations.list.why, /inline objects/);
    assert.deepEqual(model.operations.create, { resource: "Comment", action: "create" });
    assert.deepEqual(model.operations.remove, {
      resource: "Comment",
      action: "delete",
      keyFrom: "path.id",
    });
  });

  it("keeps no state for a resource nothing reads or lists", () => {
    const model = classifySpec(
      spec(
        {
          "/users/login": {
            post: {
              operationId: "login",
              requestBody: json(ref("LoginUser")),
              responses: { 200: json(ref("LoginUser")) },
            },
          },
        },
        { LoginUser: { type: "object", properties: { email: { type: "string" } } } },
      ),
    );
    assert.deepEqual(model.resources, {});
    assert.deepEqual(model.operations.login, { action: "none" });
    assert.deepEqual(model.review, []);
  });

  it("never takes an enum or a string for a record", () => {
    // Apicurio: `RoleMapping` has one field that refers to a schema, the enum `RoleType`
    const model = classifySpec(
      spec(
        {
          "/roleMappings": {
            get: {
              operationId: "list",
              responses: { 200: json({ type: "array", items: ref("RoleMapping") }) },
            },
          },
          "/roleMappings/{principalId}": {
            get: { operationId: "get", responses: { 200: json(ref("RoleMapping")) } },
          },
          "/files/{fileId}": {
            get: { operationId: "file", responses: { 200: json(ref("FileContent")) } },
          },
        },
        {
          RoleMapping: {
            type: "object",
            properties: { principalId: { type: "string" }, role: ref("RoleType") },
          },
          RoleType: { type: "string", enum: ["READ_ONLY", "ADMIN"] },
          FileContent: { type: "string", format: "binary" },
        },
      ),
    );
    assert.deepEqual(model.resources, {
      RoleMapping: { path: "/roleMappings/{}", key: "principalId" },
    });
    assert.equal(model.operations.file.action, "none");
    assert.deepEqual(model.review, []);
  });

  it("finds the key from the parameter's last word, and flags a GET that returns something else", () => {
    const model = classifySpec(
      spec(
        {
          "/properties/{propertyName}": {
            get: { operationId: "get", responses: { 200: json(ref("Property")) } },
          },
          "/docs/{docId}": {
            get: { operationId: "download", responses: { 200: json({ type: "string" }) } },
            put: {
              operationId: "save",
              requestBody: json(ref("Doc")),
              responses: { 200: json(ref("Doc")) },
            },
          },
          "/docs": {
            get: {
              operationId: "docs",
              responses: { 200: json({ type: "array", items: ref("Doc") }) },
            },
          },
        },
        {
          Property: {
            type: "object",
            properties: { name: { type: "string" }, value: { type: "string" } },
          },
          Doc: { type: "object", properties: { id: { type: "string" } } },
        },
      ),
    );
    assert.equal(model.resources.Property.key, "name");
    assert.equal(model.operations.download.action, "read");
    assert.match(model.operations.download.why, /GET does not return Doc/);
  });

  it("matches a reference by dropping leading words, by path name, and to its own kind", () => {
    const item = (operationId, name) => ({
      get: { operationId, responses: { 200: json(ref(name)) } },
    });
    const model = classifySpec(
      spec(
        {
          "/users/{id}": item("user", "User"),
          "/groups/{id}": item("group", "GroupMetaData"),
          "/tasks/{id}": item("task", "Task"),
        },
        {
          User: { type: "object", properties: { id: { type: "integer" } } },
          GroupMetaData: { type: "object", properties: { id: { type: "integer" } } },
          Task: {
            type: "object",
            properties: {
              id: { type: "integer" },
              user_id: { type: "integer" },
              assignedUserId: { type: "integer" },
              groupId: { type: "integer" },
              parentId: { type: "integer" },
              ownerId: { type: "integer" },
            },
          },
        },
      ),
    );
    assert.equal(model.relations["Task.user_id"], "User.id", "the plain name needs no review");
    assert.equal(model.relations["Task.assignedUserId"].to, "User.id");
    assert.match(model.relations["Task.assignedUserId"].why, /after dropping "assigned"/);
    assert.equal(model.relations["Task.groupId"].to, "GroupMetaData.id");
    assert.match(model.relations["Task.groupId"].why, /by its path name "group"/);
    assert.equal(model.relations["Task.parentId"].to, "Task.id");
    assert.equal(model.relations["Task.ownerId"].to, null);
    for (const field of ["assignedUserId", "groupId", "parentId", "ownerId"]) {
      assert.equal(model.relations[`Task.${field}`].review, true, field);
    }
  });

  it("flags a reference that names no resource", () => {
    const model = classifySpec(
      spec(
        { "/orders/{id}": { get: { operationId: "get", responses: { 200: json(ref("Order")) } } } },
        {
          Order: {
            type: "object",
            properties: { id: { type: "integer" }, ownerId: { type: "integer" } },
          },
        },
      ),
    );
    assert.equal(model.relations["Order.ownerId"].review, true);
    assert.match(model.review[0], /no resource is named owner/);
  });
});
