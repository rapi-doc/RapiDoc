// Runs conformance/fixtures/ against src/core.js. An integration in another language runs the same
// fixtures against its own port (conformance/README.md). `UPDATE_FIXTURES=1 npm test` rewrites the
// expected files after a deliberate change to the contract.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderHostPage, renderOAuthReceiverPage, embedRoutes } from "../src/core.js";

const fixturesDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../conformance/fixtures",
);
const update = process.env.UPDATE_FIXTURES === "1";

const RENDER = {
  host: { file: "expected.html", run: renderHostPage },
  "oauth-receiver": { file: "expected.html", run: renderOAuthReceiverPage },
  routes: {
    file: "expected.json",
    run: (options) => `${JSON.stringify(embedRoutes(options), null, 2)}\n`,
  },
};

const SPEC_OPEN = '<script type="application/json" slot="rapidoc-spec">';
const SPEC_CLOSE = "</script>";
/** <, >, & and the line separators U+2028 and U+2029, which the inline spec writes as escapes. */
const UNSAFE_IN_SCRIPT = new RegExp(`[<>&${String.fromCharCode(0x2028, 0x2029)}]`);

/**
 * A page as the contract compares it: the HTML with the inline spec taken out, and the inline spec's text.
 * The first is compared byte for byte, the second as parsed JSON (key order and number spelling are the
 * implementation's). Every port's runner does the same.
 */
function splitPage(html) {
  const start = html.indexOf(SPEC_OPEN);
  if (start === -1) return { page: html, spec: null };
  const from = start + SPEC_OPEN.length;
  const to = html.indexOf(SPEC_CLOSE, from);
  return { page: `${html.slice(0, from)}${html.slice(to)}`, spec: html.slice(from, to) };
}

function assertSamePage(actual, expected) {
  const a = splitPage(actual);
  const e = splitPage(expected);
  assert.equal(a.page, e.page);
  if (e.spec === null) return;
  assert.doesNotMatch(a.spec, UNSAFE_IN_SCRIPT, "the inline spec cannot end its script element");
  assert.doesNotMatch(a.spec, /\n/, "the inline spec is on one line");
  assert.deepEqual(JSON.parse(a.spec), JSON.parse(e.spec));
}

describe("conformance fixtures", () => {
  const names = fs.readdirSync(fixturesDir).filter((name) => !name.startsWith("."));

  it("has fixtures", () => {
    assert.ok(names.length >= 24);
  });

  for (const name of names) {
    it(name, () => {
      const dir = path.join(fixturesDir, name);
      const input = JSON.parse(fs.readFileSync(path.join(dir, "input.json"), "utf8"));
      assert.ok(input.description, "every fixture says what it checks");
      const { file, run } = RENDER[input.page];
      const actual = run(input.options);
      if (update) fs.writeFileSync(path.join(dir, file), actual);
      const expected = fs.readFileSync(path.join(dir, file), "utf8");
      if (file === "expected.html") assertSamePage(actual, expected);
      else assert.deepEqual(JSON.parse(actual), JSON.parse(expected));
    });
  }

  it("compares a page byte for byte, except the inline spec", () => {
    const page = (spec, title = "T") =>
      `<title>${title}</title>\n      ${SPEC_OPEN}${spec}${SPEC_CLOSE}\n    </rapi-doc>\n`;
    assertSamePage(page('{"b":1,"a":2.0}'), page('{"a":2,"b":1}'));
    assert.throws(() => assertSamePage(page('{"a":3,"b":1}'), page('{"a":2,"b":1}')));
    assert.throws(() => assertSamePage(page("{}", "T "), page("{}")));
    assert.throws(() => assertSamePage(page('{"a":"<"}'), page('{"a":"\\u003c"}')));
  });
});
