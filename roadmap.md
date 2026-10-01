# RapiDoc Extensibility & Plugin Ecosystem Roadmap

This document outlines the strategic roadmap for evolving **RapiDoc** from a standalone OpenAPI documentation viewer into an extensible, modern developer portal platform powered by a lightweight, modular **Plugin Architecture**.

---

## 🏷️ Tagging System & Legend

Each proposed feature is categorized using three dimensions:

| Dimension | Tags & Meaning |
| :--- | :--- |
| **Priority** | `[MUST]` Essential for core ecosystem • `[SHOULD]` High value for developers • `[COULD]` Advanced / Nice-to-have |
| **Impact** | `[HIGH-IMPACT]` Transforms user experience / adoption • `[MED-IMPACT]` Meaningful enhancement |
| **Effort** | `[EASY]` Low complexity / fast win • `[MEDIUM]` Moderate architectural work • `[COMPLEX]` Multi-subsystem integration |

---

## 🗺️ High-Level Summary Matrix

| Feature / Plugin | Priority | Impact | Effort | Target Phase |
| :--- | :---: | :---: | :---: | :---: |
| **Core Plugin Architecture & Hook Bus** | `[MUST]` | `[HIGH-IMPACT]` | `[MEDIUM]` | Phase 1 |
| **Preset Themes & Design System Plugin** | `[MUST]` | `[HIGH-IMPACT]` | `[EASY]` | Phase 1 |
| **Request & Response Middleware Pipeline** | `[MUST]` | `[HIGH-IMPACT]` | `[EASY]` | Phase 1 |
| **Multi-Language Code Snippet Generator** | `[MUST]` | `[HIGH-IMPACT]` | `[EASY]` | Phase 2 |
| **Dynamic Env Variables & Token Chaining** | `[MUST]` | `[HIGH-IMPACT]` | `[MEDIUM]` | Phase 2 |
| **Advanced Response Inspector (JSON tree/search)** | `[SHOULD]` | `[HIGH-IMPACT]` | `[MEDIUM]` | Phase 2 |
| **Mock Server / Offline Fallback Interceptor** | `[SHOULD]` | `[MED-IMPACT]` | `[EASY]` | Phase 2 |
| **Request History & Saved Scenarios** | `[COULD]` | `[MED-IMPACT]` | `[EASY]` | Phase 2 |
| **Cmd+K Command Palette & Fuzzy Search** | `[MUST]` | `[HIGH-IMPACT]` | `[MEDIUM]` | Phase 3 |
| **OAuth2 PKCE Flow Assistant** | `[SHOULD]` | `[HIGH-IMPACT]` | `[MEDIUM]` | Phase 3 |
| **Spec Diff & API Changelog Badges** | `[SHOULD]` | `[HIGH-IMPACT]` | `[MEDIUM]` | Phase 3 |
| **Interactive In-Browser SDK Playground** | `[COULD]` | `[MED-IMPACT]` | `[COMPLEX]` | Phase 4 |
| **AI Copilot & Endpoint Assistant** | `[COULD]` | `[HIGH-IMPACT]` | `[MEDIUM]` | Phase 4 |
| **API Quality & Spectral Linting Scorecards** | `[COULD]` | `[MED-IMPACT]` | `[EASY]` | Phase 4 |
| **WebSocket & GraphQL Realtime Explorer** | `[COULD]` | `[MED-IMPACT]` | `[COMPLEX]` | Phase 4 |

---

## Phase 1: Core Plugin Architecture & Foundation

The goal of Phase 1 is to introduce non-invasive plugin extension points into `rapi-doc` without breaking existing properties or attributes.

### 1.1 Plugin Manager & Hook Lifecycle
`[MUST]` `[HIGH-IMPACT]` `[MEDIUM]`
- **Description**: Introduce a centralized `PluginManager` inside `RapiDoc` Lit element that collects, initializes, and dispatches lifecycle events to registered plugins.
- **Registration Methods**:
  - JavaScript property: `rapiDocEl.plugins = [pluginA(), pluginB()]`
  - Method call: `rapiDocEl.registerPlugin(plugin)`
  - Declarative script/custom element: `<rapi-doc-plugin name="...">`
- **Implementation Strategy**:
  - Add `plugins` reactive property in `packages/rapidoc/src/rapidoc.js`.
  - Expose lifecycle hooks: `onInit()`, `beforeSpecLoad()`, `afterSpecLoad()`, `beforeRender()`, `onDestroy()`.

### 1.2 Request & Response Middleware Pipeline
`[MUST]` `[HIGH-IMPACT]` `[EASY]`
- **Description**: Allow plugins to intercept, inspect, and mutate outgoing HTTP requests and incoming HTTP responses in the interactive "Try" console.
- **Capabilities**:
  - `beforeRequest(requestContext)`: Modify headers, query params, auth tokens, body, or abort the request.
  - `afterResponse(responseContext)`: Intercept status codes, parse custom bodies, and trigger automated reactions (e.g. saving auth tokens).
- **Implementation Strategy**:
  - Hook into `packages/rapidoc/src/components/api-request.js` right before `fetch(fetchRequest)` and immediately after `fetchResponse` is received.

---

## Phase 2: Themes & Supercharged API Client

### 2.1 Preset Themes & Design Systems Plugin (`@rapidoc/plugin-preset-themes`)
`[MUST]` `[HIGH-IMPACT]` `[EASY]`
- **Description**: Eliminates the need to manually configure dozens of CSS attributes by providing instant, professionally crafted themes and automatic Dark/Light mode switching.
- **Key Features**:
  - **Modern Themes**:
    - *Developer Favorites*: Dracula, Catppuccin (Mocha & Latte), Nord, One Dark Pro, Tokyo Night.
    - *SaaS & Product Docs*: Stripe Minimal, Linear Dark, Vercel/Geist, GitHub Light/Dark, Tailwind Slate.
  - **Automatic Light/Dark Mode Toggle**: A header-injected sun/moon switch respecting `prefers-color-scheme`.
  - **Typography Bundles**: Automatic loader for paired Google Fonts (e.g., `Inter + JetBrains Mono`, `Plus Jakarta Sans + Fira Code`).
- **Implementation Strategy**:
  - Implement as a lightweight standalone plugin mapping preset objects into RapiDoc CSS custom properties (`--bg-color`, `--text-color`, `--nav-bg-color`, `--primary-color`, etc.).

### 2.2 Multi-Language Code Snippet Generator (`@rapidoc/plugin-code-snippets`)
`[MUST]` `[HIGH-IMPACT]` `[EASY]`
- **Description**: Generate copy-pasteable client code snippets in 10+ programming languages for any selected endpoint.
- **Key Features**:
  - Supported targets: cURL, JavaScript (Fetch & Axios), Python (Requests & httpx), Go, Rust, Java, C#, PHP, Ruby, Dart.
  - Syntax highlighted with one-click copy to clipboard.
  - Dynamically updates snippet values when user fills parameters in the "Try" form.
- **Implementation Strategy**:
  - Integrate `httpsnippet-lite` or a lightweight template generator into the endpoint request panel slot.

### 2.3 Dynamic Environment Variables & Token Chaining
`[MUST]` `[HIGH-IMPACT]` `[MEDIUM]`
- **Description**: Brings Postman-style environments and chained authentication to API documentation.
- **Key Features**:
  - Environment variable interpolation in URLs, headers, and request bodies (e.g., `{{baseUrl}}`, `{{orgId}}`).
  - Dynamic generator variables: `{{$uuid}}`, `{{$timestamp}}`, `{{$randomEmail}}`.
  - **Auto-Chained Authentication**: When invoking a login endpoint (e.g. `POST /api/v1/login`), automatically extract the JWT from `{ "access_token": "..." }` and configure `rapi-doc`'s Bearer token for all future calls.
- **Implementation Strategy**:
  - Use regex replacement on request headers and payloads during `beforeRequest`.
  - Store variables and token states in a reactive in-memory store backed by optional `localStorage`.

### 2.4 Advanced Response Inspector
`[SHOULD]` `[HIGH-IMPACT]` `[MEDIUM]`
- **Description**: Replaces plain raw JSON text responses with a high-fidelity interactive explorer.
- **Key Features**:
  - Collapsible JSON tree nodes with depth toggles.
  - In-response search and filter by key or value.
  - "Copy JSON Path" button (e.g. `items[0].user.email`).
  - Schema Compliance Checker: Compares actual response body against the OpenAPI response schema and flags unexpected or missing attributes.
  - Media & binary visualizer (images, PDFs, SVGs, audio).
- **Implementation Strategy**:
  - Mount an interactive JSON tree component in `api-request.js` under the response tab.

### 2.5 Offline / Mock Server Interceptor
`[SHOULD]` `[MED-IMPACT]` `[EASY]`
- **Description**: Allows developers to try out endpoints even when the backend is down, protected by VPN, or blocked by CORS.
- **Key Features**:
  - Toggle between **Live API** and **Mock Mode**.
  - Synthesizes mock responses automatically from OpenAPI `example`, `examples`, or schema definitions.
  - Simulated latency (e.g. 200ms delay) to test loading states.
- **Implementation Strategy**:
  - Intercept calls in `beforeRequest`: if Mock Mode is active, bypass `window.fetch` and return a mock `Response` object synthesized from the spec.

### 2.6 Request History & Saved Scenarios
`[COULD]` `[MED-IMPACT]` `[EASY]`
- **Description**: Local storage drawer showing past 50 requests with HTTP status badges, execution duration, and replay buttons.
- **Implementation Strategy**:
  - In `afterResponse`, persist `{ timestamp, method, url, headers, body, status, duration }` to `localStorage` and display in a slide-out drawer or drawer tab.

---

## Phase 3: Navigation, Productivity & Governance

### 3.1 Cmd+K Command Palette & Fuzzy Search (`@rapidoc/plugin-command-palette`)
`[MUST]` `[HIGH-IMPACT]` `[MEDIUM]`
- **Description**: Modern keyboard-first search modal opened with `Cmd+K` or `Ctrl+K`.
- **Key Features**:
  - Instant fuzzy search across endpoints, HTTP methods, tags, descriptions, headers, and schemas using `FlexSearch` or `MiniSearch`.
  - Quick action shortcuts: "Switch to Dark Mode", "Authorize API Key", "Download OpenAPI Spec", "Switch Server".
- **Implementation Strategy**:
  - Listen for global keyboard shortcut and render a modal dialog on top of RapiDoc.

### 3.2 OAuth2 PKCE Assistant (`@rapidoc/plugin-oauth-pkce`)
`[SHOULD]` `[HIGH-IMPACT]` `[MEDIUM]`
- **Description**: Streamline OAuth2 authorization code flow with PKCE without requiring backend proxy redirects.
- **Key Features**:
  - Opens OAuth login in a pop-up window.
  - Exchanges authorization code with PKCE `code_verifier` directly in the browser.
  - Real-time token expiry countdown timer with automatic silent refresh.
- **Implementation Strategy**:
  - Build an authentication helper plugin wrapping `window.crypto.subtle` for PKCE generation.

### 3.3 Spec Diff & API Changelog Badges (`@rapidoc/plugin-spec-diff`)
`[SHOULD]` `[HIGH-IMPACT]` `[MEDIUM]`
- **Description**: Visual changelog comparing the current OpenAPI spec against a previous version or production spec URL.
- **Key Features**:
  - Highlights modified endpoints with badge tags: `[NEW]`, `[MODIFIED]`, `[DEPRECATED]`, or `[BREAKING CHANGE]`.
  - Endpoint diff drawer showing added/removed query parameters and request/response schema mutations.
- **Implementation Strategy**:
  - Compute deep structural diff during `afterSpecParse` against a secondary spec URL attribute (`diff-spec-url`).

---

## Phase 4: Developer Ecosystem & Intelligence

### 4.1 AI Copilot & Endpoint Assistant (`@rapidoc/plugin-ai-copilot`)
`[COULD]` `[HIGH-IMPACT]` `[MEDIUM]`
- **Description**: An AI assistant panel embedded alongside the documentation to answer developer questions.
- **Key Features**:
  - "Explain this endpoint" in plain English.
  - "Generate realistic request payload" matching complex constraints.
  - "Troubleshoot response error": Analyzes non-2xx status codes and suggests remedies.
  - Bring-Your-Own-Key (BYOK) support for OpenAI, Anthropic, Gemini, or self-hosted Ollama.
- **Implementation Strategy**:
  - Extract the active endpoint's schema slice and feed it as context to a streaming LLM chat drawer.

### 4.2 API Quality & Spectral Linting Scorecards (`@rapidoc/plugin-spectral-scores`)
`[COULD]` `[MED-IMPACT]` `[EASY]`
- **Description**: In-doc API governance badges based on Spectral or OpenAPI style guidelines.
- **Key Features**:
  - API maturity score badge (e.g., "94/100 A+ Documentation Quality").
  - Warns about missing descriptions, missing examples, or untyped array schemas directly in developer view.
- **Implementation Strategy**:
  - Run lightweight browser-compatible Spectral rules against `parsedSpec` and annotate endpoints with warnings.

### 4.3 In-Browser Interactive SDK Sandbox (`@rapidoc/plugin-sdk-sandbox`)
`[COULD]` `[MED-IMPACT]` `[COMPLEX]`
- **Description**: Run real TypeScript or Python SDK code directly inside the browser using WebContainers or Pyodide.
- **Key Features**:
  - Pre-configured environment importing an auto-generated client for the current API.
  - Live code editor with autocompletion and execution output panel.
- **Implementation Strategy**:
  - Embed a lightweight WebContainer or Sandpack instance in an extra tab next to "Try".

### 4.4 WebSocket & GraphQL Realtime Explorer (`@rapidoc/plugin-realtime`)
`[COULD]` `[MED-IMPACT]` `[COMPLEX]`
- **Description**: Test WebSocket (`ws://`, `wss://`), Server-Sent Events (SSE), and GraphQL operations defined in the OpenAPI spec.
- **Key Features**:
  - Live message streaming feed with incoming/outgoing filters.
  - Reconnect and ping/pong heartbeat controls.
- **Implementation Strategy**:
  - Custom client component replacing `api-request` for endpoints flagged with `x-transport: websocket` or `x-transport: sse`.

---

## 🛠️ Technical Architecture & Reference Code

### Plugin Interface Specification

```typescript
export interface RapiDocPlugin {
  /** Unique name of the plugin */
  name: string;
  version?: string;

  /** Lifecycle: Invoked when RapiDoc initializes */
  onInit?(context: { host: HTMLElement; config: Record<string, any> }): void;

  /** Spec Transformation Hooks */
  beforeSpecParse?(rawSpecText: string): string | Promise<string>;
  afterSpecParse?(parsedSpec: Record<string, any>): Record<string, any> | Promise<Record<string, any>>;

  /** Try-It-Out Request Middleware */
  beforeRequest?(request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: any;
    credentials?: string;
  }): Promise<any> | any;

  /** Try-It-Out Response Middleware */
  afterResponse?(response: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    data: any;
    durationMs: number;
  }): Promise<void> | void;

  /** CSS Custom Properties / Theme Injections */
  themeVariables?: Record<string, string>;

  /** Cleanup on element unmount */
  onDestroy?(): void;
}
```

### Example: Implementing Preset Themes Plugin

```javascript
export function presetThemesPlugin(options = {}) {
  const THEMES = {
    'catppuccin-mocha': {
      '--bg-color': '#1e1e2e',
      '--text-color': '#cdd6f4',
      '--nav-bg-color': '#181825',
      '--nav-text-color': '#bac2de',
      '--nav-hover-bg-color': '#313244',
      '--nav-hover-text-color': '#cdd6f4',
      '--nav-accent-color': '#cba6f7',
      '--primary-color': '#cba6f7',
    },
    'dracula': {
      '--bg-color': '#282a36',
      '--text-color': '#f8f8f2',
      '--nav-bg-color': '#21222c',
      '--nav-text-color': '#6272a4',
      '--primary-color': '#bd93f9',
    },
    'stripe-minimal': {
      '--bg-color': '#ffffff',
      '--text-color': '#3c4257',
      '--nav-bg-color': '#f8fafc',
      '--nav-text-color': '#4f566b',
      '--primary-color': '#635bff',
    }
  };

  return {
    name: 'preset-themes',
    onInit({ host }) {
      const selected = THEMES[options.preset || 'stripe-minimal'];
      if (selected) {
        Object.entries(selected).forEach(([key, val]) => {
          host.style.setProperty(key, val);
        });
      }
    }
  };
}
```

---

## 📅 Phased Execution Order

1. **Step 1 (Milestone 1)**: Implement `PluginManager` class and hook into [packages/rapidoc/src/rapidoc.js](file:///Users/mrin/work/astro-rapidoc/packages/rapidoc/src/rapidoc.js).
2. **Step 2 (Milestone 2)**: Add request/response interception hooks in [packages/rapidoc/src/components/api-request.js](file:///Users/mrin/work/astro-rapidoc/packages/rapidoc/src/components/api-request.js).
3. **Step 3 (Milestone 3)**: Release **Preset Themes** plugin and **Multi-Language Snippets** plugin.
4. **Step 4 (Milestone 4)**: Release **Postman-Grade API Client** (chained auth, environments, mock fallback).
5. **Step 5 (Milestone 5)**: Release **Cmd+K Command Palette** and **Spec Diff** plugins.
