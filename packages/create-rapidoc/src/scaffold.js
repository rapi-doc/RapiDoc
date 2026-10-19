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
layout: docs
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

const STARTER_OVERVIEW = `---
title: Architecture Overview
description: Learn how microservices, caching, and rate limiting work across the platform.
layout: docs
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

const STARTER_CONFIG = (title) => `site:
  title: "${title}"
  description: "Official developer portal and interactive API reference."
  announcement:
    text: "🎉 Welcome to our brand new developer portal!"
    link: "/docs/getting-started"
  headerLinks:
    - label: "Solutions"
      items:
        - label: "Getting Started"
          icon: "🚀"
          description: "Quickstart guide and developer tutorials"
          href: "/docs/getting-started"
        - label: "Core API"
          icon: "⚡"
          description: "Interactive OpenAPI documentation"
          href: "/apis/core"
    - label: "Documentation"
      path: "/docs/getting-started"
    - label: "Login"
      href: "/login"

docs:
  path: "./docs"
  toc: true

apis:
  - id: "core"
    title: "Core Services API"
    root: "./specs/api.yaml"
    path: "/apis/core"

navigation:
  - title: "Guides"
    items:
      - label: "Getting Started"
        path: "/docs/getting-started"
      - label: "Architecture Overview"
        path: "/docs/guides/overview"
  - title: "API Reference"
    items:
      - label: "Core Services API"
        path: "/apis/core"
        type: "api"

rapidoc:
  render-style: "focused"
  schema-style: "tree"
  theme: "dark"
  primary-color: "#f59e0b"
`;

const STARTER_PACKAGE_JSON = (projectName) =>
  JSON.stringify(
    {
      name: projectName,
      version: '0.1.0',
      private: true,
      type: 'module',
      scripts: {
        build: 'rapidoc build',
        preview: 'npx serve dist',
      },
      devDependencies: {
        '@rapidoc/cli': '^0.1.0',
      },
    },
    null,
    2
  );

const STARTER_GITIGNORE = `node_modules/
dist/
.DS_Store
`;

const STARTER_README = (title) => `# ${title}

Welcome to your developer portal, powered by **[@rapidoc/portal](https://rapidocweb.com)**.

## Quick Start

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Build static portal (SSG) into dist/
npm run build

# 3. Preview locally
npm run preview
\`\`\`

## Project Structure

\`\`\`text
├── docs/                 # Documentation pages (.md, .markdoc, .mdx)
├── specs/                # OpenAPI specifications (.yaml, .json)
├── rapidoc.config.yaml   # Portal navigation, theme, and API config
├── package.json
└── README.md
\`\`\`
`;

/**
 * Scaffolds a new RapiDoc Developer Portal into target directory.
 *
 * @param {string} targetDir - Destination directory path
 * @param {object} [options] - Scaffolding options ({ name, title, overwrite })
 * @returns {{ targetDir: string, filesCreated: Array<string> }}
 */
export function scaffoldProject(targetDir, options = {}) {
  const resolvedDir = path.resolve(targetDir);
  const projectName = options.name || path.basename(resolvedDir) || 'my-dev-portal';
  const siteTitle = options.title || `${projectName.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}`;

  if (!fs.existsSync(resolvedDir)) {
    fs.mkdirSync(resolvedDir, { recursive: true });
  }

  const docsDir = path.join(resolvedDir, 'docs');
  const guidesDir = path.join(docsDir, 'guides');
  const specsDir = path.join(resolvedDir, 'specs');

  fs.mkdirSync(guidesDir, { recursive: true });
  fs.mkdirSync(specsDir, { recursive: true });

  const files = [
    { path: path.join(resolvedDir, 'rapidoc.config.yaml'), content: STARTER_CONFIG(siteTitle) },
    { path: path.join(resolvedDir, 'package.json'), content: STARTER_PACKAGE_JSON(projectName) },
    { path: path.join(resolvedDir, '.gitignore'), content: STARTER_GITIGNORE },
    { path: path.join(resolvedDir, 'README.md'), content: STARTER_README(siteTitle) },
    { path: path.join(specsDir, 'api.yaml'), content: STARTER_SPEC },
    { path: path.join(docsDir, 'getting-started.md'), content: STARTER_GETTING_STARTED },
    { path: path.join(guidesDir, 'overview.markdoc'), content: STARTER_OVERVIEW },
  ];

  const filesCreated = [];
  for (const file of files) {
    if (!fs.existsSync(file.path) || options.overwrite) {
      fs.writeFileSync(file.path, file.content, 'utf8');
      filesCreated.push(file.path);
    }
  }

  return {
    targetDir: resolvedDir,
    projectName,
    siteTitle,
    filesCreated,
  };
}
