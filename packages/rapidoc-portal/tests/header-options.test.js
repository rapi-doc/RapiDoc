import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildPortal } from "../src/index.js";
import { RapidocConfigSchema } from "../src/config/schema.js";

const here = path.dirname(fileURLToPath(import.meta.url));

const CONFIG = `site:
  title: Header Test
  logo:
    text: Header Test
    badge: v2.4
header:
  tabs: sidebar
  links:
    - label: Products
      position: start
      groups:
        - label: APIs
          items:
            - label: Payments
              icon: credit-card
              description: Charge cards and wallets
              href: /docs/intro
              badge: v2
        - label: Guides
          items:
            - { label: Quickstart, href: /docs/intro }
            - { label: Community, href: "https://example.com/community" }
      footer:
        label: See all products
        href: /docs/more
    - { label: Changelog, href: /docs/more, position: start, badge: New }
    - label: Resources
      items:
        - { label: Status, href: "https://status.example.com" }
        - { label: Support, href: /docs/more, badge: 24/7 }
    - label: Solutions
      columns: 3
      items:
        - { label: Start, icon: rocket, description: Quickstart, href: /docs/intro }
        - { label: Pay, icon: credit-card, description: Payments, href: /docs/intro }
        - { label: Hooks, icon: webhooks-logo, description: Webhooks, href: /docs/more }
    - label: Classic
      items:
        - { label: One, description: Still a card, href: /docs/intro }
        - { label: Two, href: /docs/more }
    - { label: GitHub, href: "https://github.com/example", icon: github-logo }
    - { label: Docs, href: /docs }
navigation:
  - label: Guides
    icon: book
    items:
      - { slug: intro }
  - label: More
    icon: package
    items:
      - { slug: more }
`;

describe("Header options in the config", () => {
  const link = (extra) =>
    RapidocConfigSchema.safeParse({
      site: { title: "T" },
      header: { links: [{ label: "Products", ...extra }] },
    });
  const group = { label: "APIs", items: [{ label: "Payments", href: "/a" }] };

  it("takes a dropdown as items or as groups, not both, and not with href", () => {
    assert.equal(link({ groups: [group] }).success, true);
    assert.equal(link({ groups: [group], items: group.items }).success, false);
    assert.equal(link({ groups: [group], href: "/a" }).success, false);
    assert.equal(link({ groups: [] }).success, false);
  });

  it("takes a footer link only under a dropdown", () => {
    const footer = { label: "All", href: "/all" };
    assert.equal(link({ groups: [group], footer }).success, true);
    assert.equal(link({ items: group.items, footer }).success, true);
    const onPlainLink = link({ href: "/a", footer });
    assert.equal(onPlainLink.success, false);
    assert.match(JSON.stringify(onPlainLink.error.issues), /needs items or groups/);
  });

  it("takes columns from 1 to 4, with items only", () => {
    assert.equal(link({ items: group.items, columns: 3 }).success, true);
    assert.equal(link({ items: group.items, columns: 1 }).success, true);
    assert.equal(link({ items: group.items, columns: 5 }).success, false);
    assert.equal(link({ items: group.items, columns: 0 }).success, false);
    assert.equal(link({ items: group.items, columns: 2.5 }).success, false);
    const withGroups = link({ groups: [group], columns: 2 });
    assert.equal(withGroups.success, false);
    assert.match(JSON.stringify(withGroups.error.issues), /every group is a column/);
    const onPlainLink = link({ href: "/a", columns: 2 });
    assert.equal(onPlainLink.success, false);
    assert.match(JSON.stringify(onPlainLink.error.issues), /it needs items/);
  });

  it("knows position, badge and where the tabs go, and rejects other values", () => {
    assert.equal(link({ href: "/a", position: "start", badge: "New" }).success, true);
    assert.equal(link({ href: "/a", position: "middle" }).success, false);
    const tabs = (value) =>
      RapidocConfigSchema.safeParse({ site: { title: "T" }, header: { tabs: value } }).success;
    assert.equal(tabs("sidebar"), true);
    assert.equal(tabs("sidebar-select"), true);
    assert.equal(tabs("header"), true);
    assert.equal(tabs("footer"), false);
  });
});

describe("Header options in a built portal", () => {
  const projectDir = path.join(here, `.header-project-${process.pid}`);
  const outDir = path.join(projectDir, "dist");
  let html;

  before(async () => {
    fs.mkdirSync(path.join(projectDir, "docs"), { recursive: true });
    fs.writeFileSync(path.join(projectDir, "rapidoc.config.yaml"), CONFIG);
    fs.writeFileSync(path.join(projectDir, "docs", "intro.md"), "---\ntitle: Intro\n---\n\nHi.\n");
    fs.writeFileSync(path.join(projectDir, "docs", "more.md"), "---\ntitle: More\n---\n\nMore.\n");
    await buildPortal(projectDir, { outDir });
    html = fs.readFileSync(path.join(outDir, "docs", "intro", "index.html"), "utf8");
  });

  after(() => fs.rmSync(projectDir, { recursive: true, force: true }));

  const between = (start, end) => {
    const from = html.indexOf(start);
    return html.slice(from, html.indexOf(end, from));
  };

  it("puts the links with position start after the logo, and the others right of the search", () => {
    const startMenu = html.indexOf("portal-nav-menu-start");
    const search = html.indexOf('id="portal-search-btn"');
    const endMenu = html.indexOf("portal-nav-menu-end");
    assert.ok(html.indexOf("portal-brand") < startMenu, "start links come after the logo");
    assert.ok(startMenu < search && search < endMenu, "search sits between the two groups");
    assert.match(between("portal-nav-menu-start", 'id="portal-search-btn"'), /Changelog/);
    assert.match(html.slice(endMenu), /GitHub/);
  });

  it("draws a menu's groups as columns with headings, and its footer link", () => {
    const panel = between('id="portal-menu-0"', "portal-megamenu-footer-link");
    assert.equal(panel.match(/class="portal-megamenu-group"/g).length, 2);
    assert.match(panel, /portal-megamenu-group-title[^>]*>APIs</);
    assert.match(panel, /portal-megamenu-group-title[^>]*>Guides</);
    assert.match(panel, /portal-card-badge[^>]*>v2</);
    // An item without icon or description is one line; one on another site opens in a new tab
    assert.match(panel, /portal-megamenu-card-compact/);
    assert.match(panel, /href="https:\/\/example\.com\/community"[^>]*target="_blank"/);
    assert.match(html, /portal-megamenu-footer-link[^>]*>[\s\S]{0,200}See all products/);
  });

  // The menus in config order: Products 0, Changelog 1 (a link), Resources 2, Solutions 3, Classic 4
  const panelOf = (index) => {
    const from = html.indexOf(`id="portal-menu-${index}"`);
    const start = html.lastIndexOf("<div", from);
    return html.slice(start, html.indexOf("</div></div>", from));
  };

  it("draws items that are plain links as a simple one-column list", () => {
    const panel = panelOf(2);
    assert.match(panel, /class="portal-megamenu-panel portal-menu-simple"/);
    assert.match(panel, /--portal-menu-columns: 1/);
    assert.equal(panel.match(/class="portal-menu-link"/g).length, 2);
    // No cards and no default icon; a badge and a link to another site still show
    assert.doesNotMatch(panel, /portal-megamenu-card|portal-card-icon-box/);
    assert.match(panel, /portal-card-badge[^>]*>24\/7</);
    assert.match(panel, /href="https:\/\/status\.example\.com"[^>]*target="_blank"/);
  });

  it("draws items with an icon or description as cards, two across unless columns says otherwise", () => {
    const three = panelOf(3);
    assert.match(three, /--portal-menu-columns: 3/);
    assert.equal(three.match(/class="portal-megamenu-card"/g).length, 3);
    assert.doesNotMatch(three, /portal-menu-simple/);
    // One item with a description is enough for cards; the default stays two columns
    const classic = panelOf(4);
    assert.match(classic, /--portal-menu-columns: 2/);
    assert.equal(classic.match(/class="portal-megamenu-card"/g).length, 2);
  });

  it("gives a menu in groups no column count: every group is a column", () => {
    assert.doesNotMatch(panelOf(0).slice(0, 200), /--portal-menu-columns/);
  });

  it("shows a link's badge and icon, and the badge next to the logo", () => {
    assert.match(html, /Changelog\s*<span class="portal-nav-badge"[^>]*>New</);
    assert.match(between("portal-nav-menu-end", "portal-mobile-toggle"), /portal-nav-link-icon/);
    assert.match(html, /class="portal-brand-badge"[^>]*>v2\.4</);
  });

  it("marks one header link as the current section: the closest one", () => {
    const active = (pageHtml) =>
      [
        ...pageHtml.matchAll(/<a [^>]*class="portal-nav-link[^"]* active"[^>]*>([\s\S]*?)<\/a>/g),
      ].map(([, inner]) => inner.replace(/<[^>]+>/g, "").trim());
    // /docs/intro/: only Docs (/docs) covers it
    assert.deepEqual(active(html), ["Docs"]);
    // /docs/more/: Changelog (/docs/more) and Docs (/docs) both cover it; the longer address wins
    const more = fs.readFileSync(path.join(outDir, "docs", "more", "index.html"), "utf8");
    assert.deepEqual(active(more), ["ChangelogNew"]);
    assert.match(more, /class="portal-nav-link[^"]* active"[^>]*aria-current="page"/);
  });

  it("lists the tabs above the sidebar's pages instead of in a header row", () => {
    assert.doesNotMatch(html, /data-portal-region="header-tabs"/);
    const tabs = between('class="portal-sidebar-tabs"', "</nav>");
    assert.match(tabs, /aria-current="page"[^>]*>[\s\S]*?Guides/);
    assert.match(tabs, /href="\/docs\/more\/"[\s\S]*?More/);
  });

  it("ships a search dialog that splits a query into words", () => {
    // The dialog's script is inline, written in a template: a doubled backslash there once made the
    // split look for a literal backslash, so only a one-word query ever found anything.
    assert.match(html, /q\.split\(\/\\s\+\/\)/);
    assert.doesNotMatch(html, /split\(\/\\\\s/);
    // And escapes a word before highlighting it, so "c++" or "(" is text, not a pattern
    const escape = /token\.replace\((\/.+?\/g), '(.+?)'\)/.exec(html);
    assert.ok(escape, "the highlight escape is in the page");
    const pattern = new RegExp(escape[1].slice(1, -2), "g");
    assert.equal("a.b(c)+[d]\\".replace(pattern, "\\$&"), "a\\.b\\(c\\)\\+\\[d\\]\\\\");
    assert.equal(escape[2], "\\\\$&");
  });

  it("has the portal's 404 page when the project has none", () => {
    const notFound = fs.readFileSync(path.join(outDir, "404.html"), "utf8");
    assert.match(notFound, /<title>Page not found/);
    assert.match(notFound, /class="portal-not-found"/);
    // In the portal's frame, with ways back: home, search and the tabs
    assert.match(notFound, /class="portal-header-root"/);
    assert.match(notFound, /Go to the home page/);
    assert.match(notFound, /id="portal-not-found-search"/);
    assert.match(notFound, /portal-not-found-tabs[\s\S]*href="\/docs\/more\/"/);
    assert.match(notFound, /name="robots" content="noindex"/);
    // Shown at any address, so nothing on it is relative to the page
    assert.doesNotMatch(notFound, /(href|src)="(?!\/|https?:|#|mailto:)[^"]/);
  });

  it("still lists every item of a grouped menu in the narrow-screen menu", () => {
    const mobile = between('class="portal-mobile-nav"', "</header>");
    for (const label of ["Payments", "Quickstart", "Community"])
      assert.match(mobile, new RegExp(label));
  });
});

describe("Tabs as a select above the sidebar (header.tabs: sidebar-select)", () => {
  const projectDir = path.join(here, `.header-select-project-${process.pid}`);
  const outDir = path.join(projectDir, "dist");
  let html;

  before(async () => {
    fs.mkdirSync(path.join(projectDir, "docs"), { recursive: true });
    fs.writeFileSync(
      path.join(projectDir, "rapidoc.config.yaml"),
      `site:
  title: Select Test
header:
  tabs: sidebar-select
navigation:
  - label: Guides
    icon: book
    items:
      - { slug: intro }
  - label: More
    icon: package
    items:
      - { slug: more }
  - { label: Elsewhere, href: "https://example.com/docs/" }
`,
    );
    fs.writeFileSync(path.join(projectDir, "docs", "intro.md"), "---\ntitle: Intro\n---\n\nHi.\n");
    fs.writeFileSync(path.join(projectDir, "docs", "more.md"), "---\ntitle: More\n---\n\nMore.\n");
    await buildPortal(projectDir, { outDir });
    html = fs.readFileSync(path.join(outDir, "docs", "more", "index.html"), "utf8");
  });

  after(() => fs.rmSync(projectDir, { recursive: true, force: true }));

  it("shows the current tab in one row, which opens the list of every tab", () => {
    assert.doesNotMatch(html, /data-portal-region="header-tabs"/);
    const from = html.indexOf('<details class="portal-sidebar-tabs-select"');
    assert.ok(from > -1, "the select is in the sidebar");
    const select = html.slice(from, html.indexOf("</details>", from));
    const summary = select.slice(0, select.indexOf("</summary>"));
    assert.match(summary, /portal-sidebar-tabs-current-label[^>]*>More</);
    assert.doesNotMatch(summary, />Guides</);
    const panel = select.slice(select.indexOf("portal-sidebar-tabs-panel"));
    assert.match(panel, /href="\/docs\/intro\/"[^>]*>[\s\S]*?Guides/);
    assert.match(panel, /aria-current="page"[^>]*>[\s\S]*?More/);
    assert.match(panel, /href="https:\/\/example.com\/docs\/"[^>]*target="_blank"/);
    // Not the list of the `sidebar` mode as well
    assert.equal(html.match(/<nav class="portal-sidebar-tabs"/g), null);
  });
});
