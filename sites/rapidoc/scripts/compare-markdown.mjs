/**
 * Writes docs/compare.md (/docs/compare): the comparison tables of the feature pages as Markdown, so
 * /llms.txt, /llms-full.txt and the site search carry them. The tables' one source is page-data
 * (rapidoc-comparison.ts, rapi-mock-comparison.ts, portal-comparison.ts); this page is generated from
 * it before every preview and build of this site (`dev:rapidoc-site`, `build:rapidoc-site`), and is not
 * in git. Run with the repository's TypeScript loader:
 *
 *   node --import ./scripts/test-loader.mjs sites/rapidoc/scripts/compare-markdown.mjs
 */

import fs from "node:fs";
import { fileURLToPath } from "node:url";

const { rapidocComparison } = await import("../page-data/rapidoc-comparison.ts");
const { rapiMockComparison } = await import("../page-data/rapi-mock-comparison.ts");
const { portalComparison } = await import("../page-data/portal-comparison.ts");

const SITE = "https://rapidocui.com";
const outFile = fileURLToPath(new URL("../docs/compare.md", import.meta.url));

/** Each table, with the feature page it is on */
const COMPARISONS = [
  { data: rapidocComparison, title: "RapiDoc", page: "/rapidoc/#comparison" },
  { data: portalComparison, title: "RapiDoc Portal", page: "/portal/#compare" },
  { data: rapiMockComparison, title: "RapiMock", page: "/rapi-mock/#compare" },
];

const VERDICT = { yes: "Yes", partial: "Partly", paid: "Paid plan", no: "No" };

// Pipes would end the cell; element names such as <rapi-doc> go in code font, not as HTML
const escape = (text) =>
  String(text)
    .replace(/\|/g, "\\|")
    .replace(/<([a-z][a-z-]*)>/g, "`<$1>`");
const absolute = (href) => (href.startsWith("/") ? `${SITE}${href}` : href);

function cell({ verdict, text, note, href }) {
  const words = text ? (href ? `[${escape(text)}](${absolute(href)})` : escape(text)) : "";
  const parts = [VERDICT[verdict], words].filter(Boolean).join(": ");
  return note ? `${parts} (${escape(note)})` : parts;
}

function comparisonMarkdown({ data, title, page }) {
  const ours = data.products.find((p) => p.key === data.ours);
  const order = [ours, ...data.products.filter((p) => p !== ours)];
  const head = `| Feature | ${order.map((p) => escape(p.name)).join(" | ")} |\n| :--- |${order.map(() => " :--- |").join("")}`;
  const lines = [
    `## ${title}`,
    "",
    `${data.caption}, checked against each product's own documentation on ${data.checked}. The table on the site: ${SITE}${page}`,
  ];
  for (const group of data.groups) {
    const rows = group.rows.map(
      (row) =>
        `| ${escape(row.feature)}${row.detail ? ` (${escape(row.detail)})` : ""} | ${order.map((p) => cell(row.cells[p.key])).join(" | ")} |`,
    );
    lines.push("", group.title ? `### ${group.title}` : "", "", head, ...rows);
  }
  lines.push("", `Sources for the ${title} comparison:`, "");
  for (const product of order) {
    const sources = data.sources[product.key];
    if (sources?.length)
      lines.push(
        `- ${product.name}: ${sources.map((s) => `[${escape(s.label)}](${s.url})`).join(", ")}`,
      );
  }
  return lines.join("\n");
}

const page = `---
title: How RapiDoc compares
description: RapiDoc, RapiDoc Portal and RapiMock compared with Redocly, Scalar, Swagger, Mintlify, ReadMe, Zudoku, Docusaurus, Prism, WireMock, Mockoon, Postman and Microcks, feature by feature.
---

Every RapiDoc package is open source under the MIT license, with no paid tier. In the tables, "Yes" means included (for a hosted product, on its free plan), "Partly" means limited or by hand, "Paid plan" means it needs the vendor's paid or hosted plan, and "No" means not offered or not documented. Each cell about another product was checked against that product's own documentation or pricing page; the pages are listed under each table. Something out of date? Open an issue at https://github.com/rapi-doc/RapiDoc/issues.

${COMPARISONS.map(comparisonMarkdown).join("\n\n")}
`;

fs.writeFileSync(outFile, page, "utf8");
console.log(`compare-markdown: wrote ${outFile}`);
