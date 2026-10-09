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

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { performance } from 'perf_hooks';
import { load, dereference } from '@scalar/openapi-parser';
import ProcessSpec from '../../packages/rapidoc/src/utils/spec-parser.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

const SPECS = [
  {
    id: 'petstore',
    name: 'Swagger Petstore (Baseline)',
    path: path.join(rootDir, 'docs/public/specs/petstore-3-0-3.yaml'),
    maxExpectedMs: 80,
  },
  {
    id: 'enterprise',
    name: 'Enterprise Cluster (Deep Schemas)',
    path: path.join(rootDir, 'docs/public/specs/large-spec2-v3.json'),
    maxExpectedMs: 350,
  },
  {
    id: 'mega',
    name: 'Mega API Matrix (900+ Operations)',
    path: path.join(rootDir, 'docs/public/specs/large-spec-v3.json'),
    maxExpectedMs: 350,
  },
];

// Dummy Web Component interface for ProcessSpec
const createMockComponent = () => ({
  requestUpdate() {},
  dispatchEvent() {},
});

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

async function runBenchmark() {
  console.log('\n===============================================================');
  console.log('       🚀  RAPIDOC SPEC PARSER & ENGINE BENCHMARK SUITE       ');
  console.log('===============================================================\n');
  console.log(`Node.js: ${process.version} | Platform: ${process.platform} (${process.arch})\n`);

  const results = [];
  let allPassed = true;

  for (const spec of SPECS) {
    if (!fs.existsSync(spec.path)) {
      console.warn(`⚠️ Spec file not found: ${spec.path}`);
      continue;
    }

    const rawContent = fs.readFileSync(spec.path, 'utf-8');
    const fileSize = formatBytes(Buffer.byteLength(rawContent));

    // Force GC if available
    if (global.gc) global.gc();
    const memBefore = process.memoryUsage().heapUsed;

    // Phase 1: Scalar Load
    const t0 = performance.now();
    const loaded = await load(rawContent);
    const loadTime = performance.now() - t0;

    // Phase 2: Scalar Dereference
    const t1 = performance.now();
    await dereference(loaded.filesystem, {
      onDereference: ({ schema, ref }) => {
        schema['x-ref'] = ref;
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

    const operationsCount = processed.tags?.reduce((acc, tag) => acc + (tag.paths?.length || 0), 0) || 0;
    const schemasCount = Object.keys(processed.components?.schemas || {}).length;
    const tagsCount = processed.tags?.length || 0;

    const isPass = totalProcessTime <= spec.maxExpectedMs && !processed.specLoadError;
    if (!isPass) allPassed = false;

    results.push({
      Specification: spec.name,
      'File Size': fileSize,
      Tags: tagsCount,
      Operations: operationsCount,
      Schemas: schemasCount,
      'Scalar Load': `${loadTime.toFixed(1)} ms`,
      'Scalar Deref': `${derefTime.toFixed(1)} ms`,
      'Total ProcessSpec': `${totalProcessTime.toFixed(1)} ms`,
      'Heap Delta': memDelta,
      Status: isPass ? '✅ PASS' : '❌ SLOW / FAIL',
    });
  }

  console.table(results);

  console.log('\n---------------------------------------------------------------');
  console.log('📊 Benchmark Threshold Summary:');
  for (const spec of SPECS) {
    console.log(`  • ${spec.name.padEnd(38)} Expected < ${spec.maxExpectedMs} ms`);
  }
  console.log('---------------------------------------------------------------\n');

  if (allPassed) {
    console.log('✨ ALL SPECIFICATION BENCHMARKS PASSED UNDER PERFORMANCE THRESHOLDS!\n');
    process.exit(0);
  } else {
    console.warn('⚠️ SOME SPECIFICATIONS EXCEEDED MAX TIME BUDGET.\n');
    process.exit(1);
  }
}

runBenchmark().catch((err) => {
  console.error('Fatal benchmark error:', err);
  process.exit(1);
});
