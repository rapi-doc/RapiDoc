import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { cleanRawTitle, computePageTitleInfo } from "../../docs/src/utils/pageTitle.ts";

describe("cleanRawTitle", () => {
  it("strips legacy prefixes and suffixes from test titles", () => {
    assert.equal(
      cleanRawTitle("Tests | Collapsed Tags and scrollToPath | Rapidoc"),
      "Collapsed Tags and scrollToPath",
    );
    assert.equal(
      cleanRawTitle("Tests | Collapsed Tags and scrollToPath | RapiDoc"),
      "Collapsed Tags and scrollToPath",
    );
    assert.equal(cleanRawTitle("One-Of Combinations | RapiDoc Tests"), "One-Of Combinations");
  });

  it("strips legacy prefixes and suffixes from example titles", () => {
    assert.equal(cleanRawTitle("Example | End-Point Badges | RapiDoc"), "End-Point Badges");
    assert.equal(
      cleanRawTitle("Example | Basic Petstore Example| RapiDoc"),
      "Basic Petstore Example",
    );
    assert.equal(
      cleanRawTitle("Render Read - Interactive OpenAPI Example | RapiDoc"),
      "Render Read",
    );
  });

  it("strips guide prefixes and suffixes", () => {
    assert.equal(cleanRawTitle("Guide | Theme | RapiDoc"), "Theme");
    assert.equal(cleanRawTitle("Guide | Slots | RapiDoc"), "Slots");
  });

  it("preserves clean titles without branding or section prefixes", () => {
    assert.equal(
      cleanRawTitle("Collapsed Tags and scrollToPath"),
      "Collapsed Tags and scrollToPath",
    );
    assert.equal(cleanRawTitle(""), "");
  });
});

describe("computePageTitleInfo", () => {
  it("hierarchically formats tests pages differentiating them from examples", () => {
    const testInfo = computePageTitleInfo("/tests/some-html", "Tests | Some HTML | Rapidoc");
    assert.equal(testInfo.gaTitle, "Tests / Some HTML");
    assert.equal(testInfo.seoTitle, "Tests / Some HTML | RapiDoc");
    assert.equal(testInfo.contentGroup, "Tests");

    const exampleInfo = computePageTitleInfo(
      "/examples/some-html",
      "Example | Some HTML | RapiDoc",
    );
    assert.equal(exampleInfo.gaTitle, "Examples / Some HTML");
    assert.equal(exampleInfo.seoTitle, "Examples / Some HTML | RapiDoc");
    assert.equal(exampleInfo.contentGroup, "Examples");
  });

  it("derives title from slug when rawTitle is not provided", () => {
    const info = computePageTitleInfo("/tests/xxx-of-combinations");
    assert.equal(info.gaTitle, "Tests / Xxx Of Combinations");
    assert.equal(info.seoTitle, "Tests / Xxx Of Combinations | RapiDoc");
    assert.equal(info.contentGroup, "Tests");
  });

  it("formats guides correctly", () => {
    const info = computePageTitleInfo("/guides/theme", "Guide | Theme | RapiDoc");
    assert.equal(info.gaTitle, "Guides / Theme");
    assert.equal(info.seoTitle, "Guides / Theme | RapiDoc");
    assert.equal(info.contentGroup, "Guides");
  });

  it("handles section index pages", () => {
    const exGallery = computePageTitleInfo(
      "/examples",
      "Interactive OpenAPI Examples Gallery | RapiDoc",
    );
    assert.equal(exGallery.gaTitle, "Examples / Gallery");
    assert.equal(exGallery.contentGroup, "Examples");

    const testMatrix = computePageTitleInfo(
      "/tests",
      "OpenAPI Test Suite & Edge-Case Validation Matrix | RapiDoc",
    );
    assert.equal(testMatrix.gaTitle, "Tests / Validation Matrix");
    assert.equal(testMatrix.contentGroup, "Tests");
  });

  it("handles root homepage", () => {
    const home = computePageTitleInfo("/");
    assert.equal(home.gaTitle, "Home - RapiDoc");
    assert.equal(home.seoTitle, "RapiDoc - Modern OpenAPI Spec Viewer & Console Web Component");
    assert.equal(home.contentGroup, "Home");
  });
});

import { findTestBySlug, findExampleBySlug } from "../../docs/src/utils/pageMeta.ts";

describe("pageMeta auto-lookup from page-data", () => {
  it("automatically looks up test title and description from tests.yaml", () => {
    const meta = findTestBySlug("collapsable");
    assert.equal(meta.title, "Collapsible Tag Groups & Programmatic Navigation (scrollToPath)");
    assert.equal(meta.description, "Validates Collapsed Tags and scrollToPath() Method in RapiDoc");
    assert.ok(meta.validates?.length);
  });

  it("constructs description from validates when description is omitted in tests.yaml", () => {
    const meta = findTestBySlug("hide-show-sections");
    assert.equal(meta.title, "Hide & Show Section Controls");
    assert.match(meta.description, /^Validates .* in RapiDoc\.$/);
  });

  it("automatically looks up example title and description from example-list.yaml", () => {
    const meta = findExampleBySlug("badges");
    assert.equal(meta.title, "Endpoint Badges");
    assert.match(meta.description, /Annotate operations with custom color-coded status badges/);
  });

  it("automatically resolves sub-examples with combined contextual titles and descriptions", () => {
    const meta = findExampleBySlug("petstore");
    assert.equal(meta.title, "Open API Example - Pet Store (3.1)");
    assert.match(meta.description, /Interactive showcase demonstrating how RapiDoc renders/);
  });

  it("falls back gracefully to formatted slug when not found in page-data", () => {
    const meta = findTestBySlug("unknown-test-slug");
    assert.equal(meta.title, "Unknown Test Slug");
    assert.match(meta.description, /OpenAPI schema edge case/);
  });
});
