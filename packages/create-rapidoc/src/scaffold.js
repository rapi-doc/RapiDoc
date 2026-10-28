import fs from 'node:fs';
import path from 'node:path';

/**
 * Starter template contents for scaffolding a new RapiDoc Developer Portal.
 */

const STARTER_SPEC = `openapi: 3.1.0
info:
  title: Core Services API
  version: 1.0.0
  description: High-performance microservices and developer APIs.
servers:
  - url: https://api.example.com/v1
    description: Production Server
  - url: https://sandbox.example.com/v1
    description: Sandbox Environment
paths:
  /health:
    get:
      summary: Service Health Check
      description: Returns the operational status and uptime of the system.
      operationId: getHealth
      tags:
        - System
      responses:
        '200':
          description: Service operational
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: healthy
                  timestamp:
                    type: string
                    format: date-time

  /items:
    get:
      summary: List items
      description: Retrieve a paginated collection of catalog items.
      operationId: listItems
      tags:
        - Items
      responses:
        '200':
          description: List of items
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Item'
    post:
      summary: Create item
      description: Creates a new catalog item.
      operationId: createItem
      tags:
        - Items
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateItemRequest'
      responses:
        '201':
          description: Item created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Item'

components:
  schemas:
    Item:
      type: object
      required:
        - id
        - name
      properties:
        id:
          type: string
          example: item_123
        name:
          type: string
          example: Standard Widget
        status:
          type: string
          enum: [active, archived]
          example: active

    CreateItemRequest:
      type: object
      required:
        - name
      properties:
        name:
          type: string
          example: Premium Widget
`;

const STARTER_GETTING_STARTED = `---
title: Getting Started
description: Quickstart guide to integrating with the Core Developer Platform.
---

# Getting Started

Welcome to the Developer Portal. This guide walks you through authenticating with our services and making your very first API request.

## Prerequisites

Before making requests, ensure you have:
1. Created an account on the Developer Dashboard.
2. Generated a secure API token with read/write access.

## Base URLs

| Environment | Base URL |
| :--- | :--- |
| **Production** | \`https://api.example.com/v1\` |
| **Sandbox** | \`https://sandbox.example.com/v1\` |

## First Request

Send an authenticated \`GET\` request to the health check endpoint:

\`\`\`bash
curl -X GET "https://sandbox.example.com/v1/health" \\
  -H "Authorization: Bearer YOUR_API_TOKEN"
\`\`\`

You will receive a \`200 OK\` response:

\`\`\`json
{
  "status": "healthy",
  "timestamp": "2026-10-18T12:00:00Z"
}
\`\`\`

## Next Steps

Explore the interactive API console or review our [Architecture Overview](/docs/guides/overview).
`;

const STARTER_OVERVIEW = (withStarterSpec) => `---
title: Architecture Overview
description: Learn how microservices, caching, and rate limiting work across the platform.
---

# Architecture Overview

Our platform is engineered for high throughput, predictable latencies, and distributed fault tolerance.

{% callout type="info" title="Zero Downtime Deployments" %}
All endpoints operate across multiple geographically distributed availability zones.
{% /callout %}

## Implementation Steps

{% steps %}
{% step title="Generate Credentials" %}
Obtain your API Key from the portal settings and configure it in your environment variables.
{% /step %}

{% step title="Configure Webhooks" %}
Register a secure HTTPS callback URL to receive real-time event notifications.
{% /step %}

{% step title="Test Endpoints in Sandbox" %}
Validate schema payloads against the sandbox environment before going live.
{% /step %}
{% /steps %}
${
  withStarterSpec
    ? `
## Try It

Any operation from your specs can be embedded live in a guide (\`spec\` is the API's \`id\` in \`rapidoc.config.yaml\`):

{% api-operation spec="core" path="/items" method="get" /%}
`
    : ''
}
## Code Examples

{% tabs %}
{% tab name="JavaScript" %}
\`\`\`javascript
const res = await fetch('https://api.example.com/v1/items', {
  headers: { Authorization: 'Bearer YOUR_TOKEN' }
});
const items = await res.json();
\`\`\`
{% /tab %}

{% tab name="Python" %}
\`\`\`python
import requests

res = requests.get('https://api.example.com/v1/items', headers={
    'Authorization': 'Bearer YOUR_TOKEN'
})
items = res.json()
\`\`\`
{% /tab %}

{% tab name="cURL" %}
\`\`\`bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.example.com/v1/items
\`\`\`
{% /tab %}
{% /tabs %}
`;

const STARTER_HOME = (title, apiId) => `---
title: "${title}"
description: Guides and interactive API reference.
template: splash
hero:
  tagline: Everything you need to integrate with our APIs, from your first request to production.
  actions:
    - text: Get started
      link: /docs/getting-started/
      icon: right-arrow
    - text: API reference
      link: /apis/${apiId}
      variant: minimal
---

{% card-grid %}
{% card title="Getting Started" icon="rocket" href="/docs/getting-started/" %}
Authenticate and make your first request.
{% /card %}
{% card title="Architecture Overview" icon="book-open" href="/docs/guides/overview/" %}
How the platform handles caching, rate limits and failover.
{% /card %}
{% /card-grid %}
`;

const STARTER_CONFIG = (title, apis) => `# yaml-language-server: $schema=./node_modules/@rapidoc/portal/schema.json
site:
  title: "${title}"
  description: "Official developer portal and interactive API reference."
  banner:
    message: "🎉 Welcome to our brand new developer portal!"
    href: "/docs/getting-started"

theme:
  primary: "#f59e0b"
  mode: auto

# Row 1 of the header: links and menus right of the search
header:
  links:
    - label: "Solutions"
      items:
        - label: "Getting Started"
          icon: "rocket"
          description: "Quickstart guide and developer tutorials"
          href: "/docs/getting-started"
        - label: "${apis[0].label}"
          icon: "lightning"
          description: "Interactive OpenAPI documentation"
          href: "/apis/${apis[0].id}"
    - label: "Login"
      href: "/login"
      style: button

# Row 2 of the header: one tab per entry; a documentation tab has its own sidebar
navigation:
  - label: "Documentation"
    icon: "book"
    items:
      - label: "Guides"
        items:
          - getting-started
          - guides/overview
${apis.map((api) => `  - label: "${api.label}"\n    icon: "code"\n    api: ${api.id}\n`).join('')}  - label: "API Catalog"
    icon: "squares-four"
    catalog: true

apis:
${apis.map((api) => `  - id: ${api.id}\n    spec: "${api.spec}"\n`).join('')}
rapidoc:
  render-style: "focused"
  schema-style: "tree"

# Optional: sign-in through your OpenID Connect provider and access rules, enforced by
# \`rapidoc serve\` (npm install @rapidoc/server). Secrets are environment variables of the server:
# RAPIDOC_SESSION_SECRET and RAPIDOC_AUTH_CLIENT_SECRET.
# auth:
#   issuer: "https://your-tenant.okta.com/oauth2/default"
#   clientId: "portal-web"
#   tryIt: true   # Try in the API reference sends the signed-in reader's access token
# access:
#   default: public
#   rules:
#     - path: /docs/internal/**
#       allow: signed-in
`;

const STARTER_PACKAGE_JSON = (projectName) =>
  JSON.stringify(
    {
      name: projectName,
      version: '0.1.0',
      private: true,
      type: 'module',
      scripts: {
        dev: 'rapidoc dev',
        build: 'rapidoc build',
        validate: 'rapidoc validate',
        preview: 'npx serve dist',
      },
      // The CLI loads the portal engine for dev/build; listing it here also makes the config's
      // $schema path (node_modules/@rapidoc/portal/schema.json) resolve.
      devDependencies: {
        '@rapidoc/cli': '^0.1.0',
        '@rapidoc/portal': '^0.1.0',
      },
    },
    null,
    2
  );

const STARTER_GITIGNORE = `node_modules/
dist/
.rapidoc-temp/
.DS_Store
`;

const STARTER_README = (title) => `# ${title}

Welcome to your developer portal, powered by **[@rapidoc/portal](https://rapidocweb.com)**.

## Quick Start

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Live preview with hot reload
npm run dev

# 3. Build the static portal (SSG) into dist/, then preview it
npm run build
npm run preview
\`\`\`

Run \`npm run validate\` (for example in CI) to check every spec in \`apis:\` against the OpenAPI schema. It also warns about operations without an \`operationId\`, whose links change when their summary is edited.

## Project Structure

\`\`\`text
├── docs/                 # Documentation pages (.md, .markdoc, .mdx); docs/index.* is the home page
├── specs/                # OpenAPI specifications (.yaml, .json)
├── public/               # Static files (logo, favicon, images), served from /
├── rapidoc.config.yaml   # Portal header, navigation tabs, theme and APIs
├── package.json
└── README.md
\`\`\`
`;

const SPEC_EXTENSIONS = new Set(['.yaml', '.yml', '.json']);
const SKIPPED_DIRS = new Set(['node_modules', 'dist', 'build', 'coverage', '.rapidoc-temp']);

/**
 * Finds OpenAPI / Swagger documents in a folder (and up to `maxDepth` levels below it), so a portal can be
 * scaffolded around specs that already exist. A file counts when an `openapi:` or `swagger:` key appears
 * in its first few kilobytes. Hidden folders and build output are skipped.
 *
 * @param {string} dir - Folder to search
 * @param {object} [options] - { maxDepth = 3 }
 * @returns {Array<string>} Spec paths relative to `dir`, with forward slashes, sorted
 */
export function findOpenApiSpecs(dir, { maxDepth = 3 } = {}) {
  const root = path.resolve(dir);
  const found = [];
  const walk = (current, depth) => {
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (depth < maxDepth && !SKIPPED_DIRS.has(entry.name)) walk(fullPath, depth + 1);
      } else if (SPEC_EXTENSIONS.has(path.extname(entry.name).toLowerCase()) && isOpenApiDocument(fullPath)) {
        found.push(path.relative(root, fullPath).split(path.sep).join('/'));
      }
    }
  };
  walk(root, 0);
  return found.sort();
}

function isOpenApiDocument(filePath) {
  const fd = fs.openSync(filePath, 'r');
  try {
    const buffer = Buffer.alloc(4096);
    const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, 0);
    return /^\s*["']?(openapi|swagger)["']?\s*:/m.test(buffer.toString('utf8', 0, bytesRead));
  } finally {
    fs.closeSync(fd);
  }
}

// API ids and tab labels from spec file names: "specs/orders-api.yaml" -> { id: 'orders-api', label: 'Orders API' }
function apisFromSpecs(specs) {
  const used = new Set();
  return specs.map((spec) => {
    const base =
      path
        .basename(spec, path.extname(spec))
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'api';
    let id = base;
    for (let n = 2; used.has(id); n += 1) id = `${base}-${n}`;
    used.add(id);
    const label = base
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .replace(/\bApi\b/g, 'API');
    return { id, label, spec: `./${spec}` };
  });
}

/**
 * Scaffolds a new RapiDoc Developer Portal into target directory. Existing files are left alone unless
 * `overwrite` is set (they are listed in `filesSkipped`), so it can also add a portal to an existing repo.
 *
 * @param {string} targetDir - Destination directory path
 * @param {object} [options] - { name, title, overwrite, specs }. `specs` lists OpenAPI files (relative to
 *   targetDir) to use instead of the starter spec; see findOpenApiSpecs.
 * @returns {{ targetDir: string, projectName: string, siteTitle: string, apis: Array<object>,
 *   filesCreated: Array<string>, filesSkipped: Array<string> }}
 */
export function scaffoldProject(targetDir, options = {}) {
  const resolvedDir = path.resolve(targetDir);
  const projectName = options.name || path.basename(resolvedDir) || 'my-dev-portal';
  const siteTitle = options.title || `${projectName.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}`;
  const withStarterSpec = !options.specs?.length;
  const apis = withStarterSpec ? [{ id: 'core', label: 'Core API', spec: './specs/api.yaml' }] : apisFromSpecs(options.specs);

  if (!fs.existsSync(resolvedDir)) {
    fs.mkdirSync(resolvedDir, { recursive: true });
  }

  const docsDir = path.join(resolvedDir, 'docs');
  const guidesDir = path.join(docsDir, 'guides');
  const specsDir = path.join(resolvedDir, 'specs');

  fs.mkdirSync(guidesDir, { recursive: true });
  if (withStarterSpec) fs.mkdirSync(specsDir, { recursive: true });

  const files = [
    { path: path.join(resolvedDir, 'rapidoc.config.yaml'), content: STARTER_CONFIG(siteTitle, apis) },
    { path: path.join(resolvedDir, 'package.json'), content: STARTER_PACKAGE_JSON(projectName) },
    { path: path.join(resolvedDir, '.gitignore'), content: STARTER_GITIGNORE },
    { path: path.join(resolvedDir, 'README.md'), content: STARTER_README(siteTitle) },
    ...(withStarterSpec ? [{ path: path.join(specsDir, 'api.yaml'), content: STARTER_SPEC }] : []),
    { path: path.join(docsDir, 'index.markdoc'), content: STARTER_HOME(siteTitle, apis[0].id) },
    { path: path.join(docsDir, 'getting-started.md'), content: STARTER_GETTING_STARTED },
    { path: path.join(guidesDir, 'overview.markdoc'), content: STARTER_OVERVIEW(withStarterSpec) },
  ];

  const filesCreated = [];
  const filesSkipped = [];
  for (const file of files) {
    if (!fs.existsSync(file.path) || options.overwrite) {
      fs.writeFileSync(file.path, file.content, 'utf8');
      filesCreated.push(file.path);
    } else {
      filesSkipped.push(file.path);
    }
  }

  return {
    targetDir: resolvedDir,
    projectName,
    siteTitle,
    apis,
    filesCreated,
    filesSkipped,
  };
}
