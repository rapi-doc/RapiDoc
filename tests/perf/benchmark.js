#!/usr/bin/env node

/**
 * RapiDoc Performance & Large Spec Benchmark Runner
 *
 * Measures OpenAPI specification loading, dereferencing, circular reference breaking,
 * and full ProcessSpec execution times across small, medium, and massive specifications.
 *
 * Usage:
 *   node tests/perf/benchmark.js
 *   npm run test:perf
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { performance } from "perf_hooks";
import { load, dereference } from "@scalar/openapi-parser";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import ProcessSpec from "../../packages/rapidoc/src/utils/spec-parser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../..");

const SPECS = [
  {
    id: "bookstore",
    name: "Bookstore (Baseline)",
    path: path.join(rootDir, "docs/public/specs-test/bookstore.yaml"),
    maxExpectedMs: 60,
  },
  {
    id: "stripe",
    name: "Stripe (Deep Schemas)",
    path: path.join(rootDir, "docs/public/specs-test/stripe-deep-schema.yaml"),
    maxExpectedMs: 1400,
  },
  {
    id: "github",
    name: "GitHub (Large Spec)",
    path: path.join(rootDir, "docs/public/specs-test/github-large.yaml"),
    maxExpectedMs: 2000,
  },
];

// Dummy Web Component interface for ProcessSpec
const createMockComponent = () => ({
  requestUpdate() {},
  dispatchEvent() {},
});

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

async function runBenchmark() {
  console.log("\n===============================================================");
  console.log("       🚀  RAPIDOC SPEC PARSER & ENGINE BENCHMARK SUITE       ");
  console.log("===============================================================\n");
  console.log(`Node.js: ${process.version} | Platform: ${process.platform} (${process.arch})\n`);

  const results = [];
  const benchmarkItems = [];
  let allPassed = true;

  for (const spec of SPECS) {
    if (!fs.existsSync(spec.path)) {
      console.warn(`⚠️ Spec file not found: ${spec.path}`);
      continue;
    }

    const rawContent = fs.readFileSync(spec.path, "utf-8");
    const fileSize = formatBytes(Buffer.byteLength(rawContent));

    // Force GC if available
    if (global.gc) global.gc();
    const memBefore = process.memoryUsage().heapUsed;

    let input = rawContent;
    try {
      input = JSON.parse(rawContent);
    } catch {
      try {
        input = parseYaml(rawContent, { maxAliasCount: -1, merge: true });
      } catch {
        input = rawContent;
      }
    }

    // Phase 1: Scalar Load
    const t0 = performance.now();
    const loaded = await load(input);
    const loadTime = performance.now() - t0;

    // Phase 2: Scalar Dereference
    const t1 = performance.now();
    await dereference(loaded.filesystem, {
      onDereference: ({ schema, ref }) => {
        schema["x-ref"] = ref;
      },
    });
    const derefTime = performance.now() - t1;

    // Phase 3: Full RapiDoc ProcessSpec (deref + breakCircularRefs + filter + tags + schemas)
    const t2 = performance.now();
    const component = createMockComponent();
    const processed = await ProcessSpec.call(component, rawContent);
    const totalProcessTime = performance.now() - t2;

    const memAfter = process.memoryUsage().heapUsed;
    const memDelta = formatBytes(Math.max(0, memAfter - memBefore));

    const operationsCount =
      processed.tags?.reduce((acc, tag) => acc + (tag.paths?.length || 0), 0) || 0;
    const tagsCount = processed.tags?.length || 0;

    const isPass = totalProcessTime <= spec.maxExpectedMs && !processed.specLoadError;
    if (!isPass) allPassed = false;

    results.push({
      Specification: spec.name,
      "File Size": fileSize,
      Tags: tagsCount,
      Operations: operationsCount,
      "Spec Load": `${loadTime.toFixed(1)} ms`,
      Deref: `${derefTime.toFixed(1)} ms`,
      "Total ProcessSpec": `${totalProcessTime.toFixed(1)} ms`,
      "Heap Delta": memDelta,
      Status: isPass ? "✅ PASS" : "❌ SLOW / FAIL",
    });

    benchmarkItems.push({
      id: spec.id,
      name: spec.name,
      fileSize,
      operations: operationsCount,
      specLoad: `${loadTime.toFixed(1)} ms`,
      deref: `${derefTime.toFixed(1)} ms`,
      totalProcessSpec: `${totalProcessTime.toFixed(1)} ms`,
      heapDelta: memDelta,
    });
  }

  console.table(results);

  console.log("\n---------------------------------------------------------------");
  console.log("📊 Benchmark Threshold Summary:");
  for (const spec of SPECS) {
    console.log(`  • ${spec.name.padEnd(38)} Expected < ${spec.maxExpectedMs} ms`);
  }
  console.log("---------------------------------------------------------------\n");

  if (allPassed) {
    console.log("✨ ALL SPECIFICATION BENCHMARKS PASSED UNDER PERFORMANCE THRESHOLDS!\n");
    saveParserBenchmarkResults(benchmarkItems);
    process.exit(0);
  } else {
    console.warn("⚠️ SOME SPECIFICATIONS EXCEEDED MAX TIME BUDGET.\n");
    process.exit(1);
  }
}

function saveParserBenchmarkResults(rawResults) {
  const yamlPath = path.join(rootDir, "docs/src/page-data/performance-benchmarks.yaml");
  const rapidocPkg = JSON.parse(
    fs.readFileSync(path.join(rootDir, "packages/rapidoc/package.json"), "utf-8"),
  );
  let doc = { benchmarks: [] };
  if (fs.existsSync(yamlPath)) {
    try {
      doc = parseYaml(fs.readFileSync(yamlPath, "utf-8")) || { benchmarks: [] };
    } catch {}
  }
  doc.rapidocVersion = rapidocPkg.version;
  doc.lastUpdated = new Date().toISOString();

  doc.benchmarks = doc.benchmarks || [];
  for (const r of rawResults) {
    let item = doc.benchmarks.find((b) => b.id === r.id);
    if (!item) {
      item = { id: r.id, name: r.name };
      doc.benchmarks.push(item);
    }
    item.operations = r.operations;
  }

  doc.parserBenchmarks = rawResults.map((r) => ({
    id: r.id,
    name: r.name,
    fileSize: r.fileSize,
    operations: r.operations,
    specLoad: r.specLoad,
    deref: r.deref,
    totalProcessSpec: r.totalProcessSpec,
    heapDelta: r.heapDelta,
  }));

  fs.writeFileSync(yamlPath, stringifyYaml(doc), "utf-8");
  console.log(`💾 Saved parser benchmark data to: ${yamlPath}\n`);
}

runBenchmark().catch((err) => {
  console.error("Fatal benchmark error:", err);
  process.exit(1);
});
