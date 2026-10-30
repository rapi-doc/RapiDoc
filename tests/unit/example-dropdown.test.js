import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderTemplateToString } from "rapidoc/static";
import requestBodyTemplate from "~/templates/request-body-template";
import { exampleLabel } from "~/utils/schema-utils";

// Example dropdowns name each example by its summary, however long, instead of its key (#934)
const LONG =
  "JSON API representation of tasks_m/task for example_example_of_long_name_here, including all relations";

function renderRequestBody(examples) {
  const doc = {
    request_body: { content: { "application/json": { schema: { type: "object" }, examples } } },
    selectedRequestBodyType: "application/json",
    selectedRequestBodyExample: "",
    activeSchemaTab: "example",
    allowTry: "true",
    schemaStyle: "tree",
    method: "post",
    schemaHideReadOnly: "",
    schemaHideWriteOnly: "",
    fillRequestFieldsWithExample: "true",
    fileInputKeys: {},
    requestUpdate() {},
  };
  return renderTemplateToString(requestBodyTemplate.call(doc));
}

const options = (html) =>
  [
    ...html.matchAll(/<option value="([^"]*)" title="([^"]*)"[^>]*>\s*([\s\S]*?)\s*<\/option>/g),
  ].map((m) => ({
    value: m[1],
    title: m[2],
    text: m[3],
  }));

describe("example dropdowns", () => {
  it("exampleLabel is the summary, or the key when there is none", () => {
    assert.equal(exampleLabel({ exampleId: "result7", exampleSummary: LONG }), LONG);
    assert.equal(exampleLabel({ exampleId: "result7", exampleSummary: "" }), "result7");
    assert.equal(exampleLabel(undefined), "");
  });

  it("request body: a long summary names its option, with the full text as a tooltip", () => {
    const html = renderRequestBody({
      result7: { summary: LONG, value: { a: 1 } },
      short: { summary: "Short one", value: { a: 2 } },
      unnamed: { value: { a: 3 } },
    });
    assert.deepEqual(options(html), [
      { value: "result7", title: LONG, text: LONG },
      { value: "short", title: "Short one", text: "Short one" },
      { value: "unnamed", title: "unnamed", text: "unnamed" },
    ]);
    assert.match(
      html,
      new RegExp(`<select[^>]*title="${LONG}"`),
      "the select shows the selected summary as a tooltip",
    );
    assert.doesNotMatch(
      html,
      new RegExp(`<div style="padding: 4px 0">${LONG}`),
      "no second copy under the dropdown",
    );
  });

  it("request body: a single example still shows a long summary as text, as there is no dropdown", () => {
    const html = renderRequestBody({ result7: { summary: LONG, value: { a: 1 } } });
    assert.doesNotMatch(html, /<select[^>]*example-select/);
    assert.match(html, new RegExp(`<div style="padding: 4px 0">${LONG}`));
  });
});
