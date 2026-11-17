import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderNavBarHtml } from "@rapidoc/prerender";
import ProcessSpec from "../../packages/rapidoc/src/utils/spec-parser.js";
import {
  navBadgeDot,
  navItemTitle,
  syncNavItemTitle,
} from "../../packages/rapidoc/src/utils/common-utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const petstore = fs.readFileSync(
  path.resolve(__dirname, "../../docs/public/specs/petstore-3.2.yaml"),
  "utf8",
);

describe("the sidebar's badge dot", () => {
  it("takes the first shown badge's color and every label, leaving out color: none", () => {
    assert.equal(navBadgeDot(undefined), null);
    assert.equal(navBadgeDot([{ label: "Internal", color: "none" }]), null);
    assert.deepEqual(
      navBadgeDot([
        { label: "Internal", color: "none" },
        { label: "Beta", color: "orange" },
        { label: "New", color: "green" },
      ]),
      { color: "var(--orange)", labels: ["Beta", "New"] },
    );
    assert.deepEqual(navBadgeDot([{ label: "Pending" }]), {
      color: "var(--primary)",
      labels: ["Pending"],
    });
  });

  it("is drawn by default on items whose operation shows a badge (kind: badge tags too)", async () => {
    const spec = await ProcessSpec.call({}, petstore);
    const html = renderNavBarHtml(spec);
    const dots = [...html.matchAll(/data-content-id="([^"]+)"[\s\S]*?<\/a>/g)]
      .filter((m) => m[0].includes('class="nav-badge-dot"'))
      .map((m) => m[1]);
    assert.deepEqual(dots.sort(), ["copy-pet", "purge-inventory", "search-pets"]);
    assert.match(
      html,
      /<span class="nav-badge-dot" part="nav-badge-dot" role="img" aria-label="Badges: Beta" style="background:var\(--primary\)"><\/span>/,
    );
    // The row keeps its tooltip text; syncNavItemTitle shows it on hover when it adds something
    assert.match(html, /data-title="Search pets\.\nBadges: Beta"/);
    assert.match(html, /data-title="Find pet by ID\."/);
    assert.doesNotMatch(html, /\stitle="Find pet by ID/);
  });

  it("puts the full name and the badges in the row's tooltip", () => {
    assert.equal(
      navItemTitle("Updates a pet in the store with form data."),
      "Updates a pet in the store with form data.",
    );
    assert.equal(
      navItemTitle("Register", [
        { label: "Beta", color: "orange" },
        { label: "Internal", color: "none" },
      ]),
      "Register\nBadges: Beta",
    );
  });

  it("shows the row's tooltip on hover only when the name is cut off or it has badges", () => {
    // A stand-in row: its label's widths, whether it has a dot, and its title attribute
    const row = ({ scrollWidth, clientWidth, dot = false, title = "x" }) => {
      const attrs = {};
      const el = {
        dataset: { title },
        closest: () => el,
        querySelector: (sel) =>
          sel === ".nav-bar-path-label" ? { scrollWidth, clientWidth } : dot ? {} : null,
        get title() {
          return attrs.title ?? "";
        },
        set title(v) {
          attrs.title = v;
        },
        hasAttribute: (name) => name in attrs,
        removeAttribute: (name) => delete attrs[name],
      };
      return el;
    };
    const hover = (el) => {
      syncNavItemTitle({ target: el });
      return el.hasAttribute("title") ? el.title : null;
    };
    assert.equal(
      hover(row({ scrollWidth: 300, clientWidth: 180, title: "Long name" })),
      "Long name",
    );
    assert.equal(hover(row({ scrollWidth: 120, clientWidth: 180 })), null, "fits, no badges");
    assert.equal(
      hover(
        row({ scrollWidth: 120, clientWidth: 180, dot: true, title: "Register\nBadges: Beta" }),
      ),
      "Register\nBadges: Beta",
    );
  });

  it("is left out with showBadgesInNavBar false", async () => {
    const spec = await ProcessSpec.call({}, petstore);
    assert.doesNotMatch(renderNavBarHtml(spec, { showBadgesInNavBar: "false" }), /nav-badge-dot/);
    assert.doesNotMatch(
      renderNavBarHtml(spec, { "show-badges-in-nav-bar": "false" }),
      /nav-badge-dot/,
    );
  });
});
