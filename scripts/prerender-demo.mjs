import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderRapiDoc } from 'rapidoc/static';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Define sample OpenAPI spec
const sampleSpec = {
  openapi: '3.1.0',
  info: {
    title: 'Pre-rendered Petstore API',
    version: '1.0.0',
    description: 'This page was pre-rendered using Node.js without publishing to npm.',
  },
  servers: [{ url: 'https://petstore.example.com/api/v1' }],
  paths: {
    '/pets': {
      get: {
        summary: 'List all pets',
        description: 'Returns all pets from the system that the user has access to.',
        responses: {
          '200': {
            description: 'A paged array of pets',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer', format: 'int64' },
                      name: { type: 'string' },
                      tag: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a pet',
        description: 'Creates a new pet in the store.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Fido' },
                  tag: { type: 'string', example: 'dog' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Pet created successfully' },
        },
      },
    },
  },
};

console.log('Rendering OpenAPI spec to Declarative Shadow DOM (DSD)...');

// 2. Pre-render the document on the server using renderRapiDoc
const dsdHtml = await renderRapiDoc({
  spec: sampleSpec,
  renderStyle: 'read',
  theme: 'dark',
  primaryColor: '#0ea5e9',
  schemaStyle: 'table',
  showHeader: true,
  allowTry: true,
});

// 3. Read the built client bundle to inline it for 100% offline file:// compatibility
const bundlePath = path.resolve(rootDir, 'packages/rapidoc/dist/rapidoc-min.js');
let bundleCode = '';
if (fs.existsSync(bundlePath)) {
  bundleCode = fs.readFileSync(bundlePath, 'utf-8');
}

// 4. Wrap in a complete, responsive HTML shell with fonts and full viewport layout
const outputHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pre-rendered RapiDoc (Node.js SSR Demo)</title>

    <!-- Google Fonts: Open Sans & Roboto Mono -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;600&display=swap"
      rel="stylesheet"
    />

    <style>
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #0f172a;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      rapi-doc {
        display: flex;
        width: 100%;
        height: 100%;
      }
    </style>

    <!-- RapiDoc client bundle inlined for zero-CORS file:// protocol execution -->
    <script type="module">
${bundleCode}
    </script>
  </head>
  <body>
    <!-- Server-Side Pre-Rendered RapiDoc with Declarative Shadow DOM & Auto-Hydration -->
    ${dsdHtml}
  </body>
</html>`;

const outPath = path.resolve(rootDir, 'prerender-demo.html');
fs.writeFileSync(outPath, outputHtml, 'utf-8');

console.log(`\n Pre-render complete! (${(outputHtml.length / 1024).toFixed(1)} KB)`);
console.log(` Output saved to: ${outPath}`);
console.log(`\nTo view in browser, run:\n  open prerender-demo.html\n`);
