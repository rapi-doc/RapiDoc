#!/usr/bin/env node

/**
 * RapiDoc Browser Rendering Performance Benchmark
 * 
 * Uses puppeteer-core to launch headless Chrome and measures real in-browser
 * specification loading, DOM generation, and visual paint times across
 * Focused, View, and Read render modes.
 * 
 * Usage:
 *   node tests/perf/render-benchmark.js
 *   npm run test:render
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

// Find system Chrome/Chromium executable
function findChromeExecutable() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;

  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    'No Chrome/Chromium binary found. Please install Chrome or set the CHROME_PATH environment variable.'
  );
}

// Specifications to benchmark with calibrated budgets
const TEST_SPECS = [
  {
    id: 'petstore',
    name: 'Swagger Petstore',
    file: 'petstore-3-0-3.yaml',
    size: '24 KB',
    thresholds: { focused: 120, view: 120, read: 150 },
  },
  {
    id: 'enterprise',
    name: 'Enterprise Cluster (Deep Schemas)',
    file: 'large-spec2-v3.json',
    size: '3.21 MB',
    thresholds: { focused: 250, view: 250, read: 9500 },
  },
  {
    id: 'mega',
    name: 'Mega API Matrix (900+ Endpoints)',
    file: 'large-spec-v3.json',
    size: '4.77 MB',
    thresholds: { focused: 250, view: 250, read: 2500 },
  },
];

const RENDER_MODES = ['focused', 'view', 'read'];

// Self-contained static HTTP server to serve rapidoc bundle and specs
function createStaticServer() {
  const rapidocDist = path.join(rootDir, 'packages/rapidoc/dist/rapidoc-min.js');
  const specsDir = path.join(rootDir, 'docs/public/specs');

  return http.createServer((req, res) => {
    const url = req.url.split('?')[0];

    if (url === '/rapidoc-min.js') {
      res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
      return res.end(fs.readFileSync(rapidocDist));
    }

    if (url.startsWith('/specs/')) {
      const filename = path.basename(url);
      const filePath = path.join(specsDir, filename);
      if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath);
        const contentType = ext === '.json' ? 'application/json' : 'text/yaml';
        res.writeHead(200, { 'Content-Type': contentType });
        return res.end(fs.readFileSync(filePath));
      }
    }

    if (url === '/' || url === '/index.html') {
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script type="module" src="/rapidoc-min.js"></script>
  <style>
    body { margin: 0; background: #090d16; color: #fff; font-family: sans-serif; }
    #container { width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <div id="container"></div>
  <script>
    window.benchmarkRender = function(specUrl, renderMode) {
      return new Promise((resolve) => {
        const container = document.getElementById('container');
        container.innerHTML = '';
        const startTime = performance.now();

        const el = document.createElement('rapi-doc');
        el.setAttribute('spec-url', specUrl);
        el.setAttribute('render-style', renderMode);
        el.setAttribute('schema-style', 'table');
        el.setAttribute('schema-expand-level', '1');
        el.setAttribute('show-header', 'false');
        el.setAttribute('theme', 'dark');
        el.style.width = '100%';
        el.style.height = '100%';

        el.addEventListener('spec-loaded', () => {
          // Double rAF ensures the browser compositor has flushed pixel layout & paint
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const elapsedMs = Math.round(performance.now() - startTime);
              const nodeCount = el.shadowRoot ? el.shadowRoot.querySelectorAll('*').length : 0;
              const hasError = el.resolvedSpec?.specLoadError || false;
              resolve({ elapsedMs, nodeCount, hasError });
            });
          });
        }, { once: true });

        container.appendChild(el);
      });
    };
  </script>
</body>
</html>`;
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(html);
    }

    res.writeHead(404);
    res.end('Not Found');
  });
}

async function run() {
  const chromePath = findChromeExecutable();
  console.log('\n===============================================================');
  console.log('       ⚡  RAPIDOC BROWSER RENDERING PERFORMANCE BENCHMARK     ');
  console.log('===============================================================\n');
  console.log(`Chrome Binary: ${chromePath}`);

  // 1. Start local ephemeral static server
  const server = createStaticServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Test Harness Server running on: ${baseUrl}\n`);

  // 2. Launch headless Chrome via puppeteer-core
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.text().includes('Issue') || msg.text().includes('Invalid')) {
      console.log(`\n    [Browser Console ${msg.type()}] ${msg.text()}`);
    }
  });
  page.on('pageerror', (err) => {
    console.error(`\n    [Browser Error] ${err.message}`);
  });

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });

  const benchmarkRows = [];
  let allPassed = true;

  try {
    for (const spec of TEST_SPECS) {
      const specUrl = `/specs/${spec.file}`;

      for (const mode of RENDER_MODES) {
        process.stdout.write(`  Measuring ${spec.name} [${mode.toUpperCase()}]... `);

        // Run in-browser benchmark with safety timeout
        const result = await Promise.race([
          page.evaluate((url, m) => window.benchmarkRender(url, m), specUrl, mode),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Render timeout exceeded 10s')), 10000)),
        ]);

        const threshold = spec.thresholds[mode];
        const isPass = result.elapsedMs <= threshold && !result.hasError;
        if (!isPass) allPassed = false;

        console.log(`${result.elapsedMs} ms (${result.nodeCount} nodes) - ${isPass ? 'PASS' : 'SLOW'}`);

        benchmarkRows.push({
          Specification: spec.name,
          'File Size': spec.size,
          'Render Mode': mode.toUpperCase(),
          'First Paint Time': `${result.elapsedMs} ms`,
          'Budget Threshold': `< ${threshold} ms`,
          'DOM Elements': `${result.nodeCount} nodes`,
          Status: isPass ? '✅ PASS' : '⚠️ SLOW',
        });
      }
    }

    console.log('\n===============================================================');
    console.log('                   📊 BENCHMARK RESULTS TABLE                  ');
    console.log('===============================================================\n');
    console.table(benchmarkRows);

    if (allPassed) {
      console.log('✨ ALL RENDERING PERFORMANCE BENCHMARKS PASSED UNDER BUDGET!\n');
    } else {
      console.warn('⚠️ SOME SPECIFICATIONS TOOK LONGER THAN BUDGETED TIME.\n');
    }
  } finally {
    await browser.close();
    server.close();
  }
}

run().catch((err) => {
  console.error('\n❌ Fatal benchmark runner error:', err);
  process.exit(1);
});
