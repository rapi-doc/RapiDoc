import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderTemplateToString } from "rapidoc/static";
import {
  multipartPartContentType,
  serializeMultipartBody,
} from "../../packages/rapidoc/src/utils/request-utils.js";
import { generateCurlCommand } from "../../packages/rapidoc/src/utils/curl-utils.js";
import { formDataTemplate } from "~/templates/request-body-template";

// multipart/form-data parts carry a Content-Type: application/json for objects, or the spec's encoding (#1060)
describe("multipart part content types", () => {
  describe("multipartPartContentType", () => {
    it("is application/json for an object or an array of objects", () => {
      assert.equal(
        multipartPartContentType({ type: "object", properties: {} }),
        "application/json",
      );
      assert.equal(multipartPartContentType({ type: ["object", "null"] }), "application/json");
      assert.equal(
        multipartPartContentType({ properties: { a: { type: "string" } } }),
        "application/json",
      );
      assert.equal(
        multipartPartContentType({ type: "array", items: { type: "object" } }),
        "application/json",
      );
    });

    it("is empty (text/plain) for primitives and arrays of primitives", () => {
      assert.equal(multipartPartContentType({ type: "string" }), "");
      assert.equal(multipartPartContentType({ type: "array", items: { type: "integer" } }), "");
      assert.equal(multipartPartContentType(undefined), "");
    });

    it("follows the encoding object's contentType", () => {
      assert.equal(
        multipartPartContentType({ type: "string" }, { contentType: "application/xml" }),
        "application/xml",
      );
      assert.equal(
        multipartPartContentType({ type: "object" }, { contentType: "image/png, image/jpeg" }),
        "image/png",
      );
    });
  });

  describe("serializeMultipartBody", () => {
    it("gives typed parts a Content-Type without a filename", async () => {
      const formData = new FormData();
      formData.append("meta", '{"a":1}');
      formData.append("name", "line 1\nline 2");
      formData.append("doc", new File(["%PDF"], "a.pdf", { type: "application/pdf" }));
      const { body, contentType } = serializeMultipartBody(
        formData,
        { meta: "application/json" },
        "XyZ",
      );

      assert.equal(contentType, "multipart/form-data; boundary=XyZ");
      assert.equal(
        await body.text(),
        [
          "--XyZ",
          'Content-Disposition: form-data; name="meta"',
          "Content-Type: application/json",
          "",
          '{"a":1}',
          "--XyZ",
          'Content-Disposition: form-data; name="name"',
          "",
          "line 1",
          "line 2",
          "--XyZ",
          'Content-Disposition: form-data; name="doc"; filename="a.pdf"',
          "Content-Type: application/pdf",
          "",
          "%PDF",
          "--XyZ--",
          "",
        ].join("\r\n"),
      );
    });

    it("escapes quotes and line breaks in part names", async () => {
      const formData = new FormData();
      formData.append('we"ird\nname', "v");
      const { body } = serializeMultipartBody(formData, {}, "B");
      assert.match(await body.text(), /name="we%22ird%0Aname"/);
    });
  });

  it("marks the parts in the generated curl command", () => {
    const formData = new FormData();
    formData.append("meta", '{"a":1}');
    formData.append("name", "x");
    const curl = generateCurlCommand({
      method: "POST",
      url: "https://api.example/upload",
      body: formData,
      contentType: "multipart/form-data",
      partContentTypes: { meta: "application/json" },
    });
    assert.match(curl, /-F "meta=\{\\"a\\":1\};type=application\/json"/);
    assert.match(curl, /-F "name=x"/);
  });

  it("form fields carry their part's content type", () => {
    const doc = { allowTry: "true", fileInputKeys: {}, fillRequestFieldsWithExample: "true" };
    const schema = {
      type: "object",
      properties: {
        shouldBeJson: { type: "object", properties: {} },
        name: { type: "string" },
        xmlPart: { type: "string" },
      },
    };
    const render = (mimeType) =>
      renderTemplateToString(
        formDataTemplate.call(doc, schema, mimeType, "", {
          xmlPart: { contentType: "application/xml" },
        }),
      );
    const types = (html) =>
      Object.fromEntries(
        [...html.matchAll(/data-pname="([^"]+)"\s+data-content-type="([^"]*)"/g)].map((m) => [
          m[1],
          m[2],
        ]),
      );

    assert.deepEqual(types(render("multipart/form-data")), {
      shouldBeJson: "application/json",
      name: "",
      xmlPart: "application/xml",
    });
    // x-www-form-urlencoded has no parts
    assert.deepEqual(types(render("application/x-www-form-urlencoded")), {
      shouldBeJson: "",
      name: "",
      xmlPart: "",
    });
  });
});
