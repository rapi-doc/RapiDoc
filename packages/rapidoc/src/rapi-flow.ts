import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";

import ThemeTokens, {
  DEFAULT_THEME,
  applyCustomTheme,
  normalizeTheme,
} from "~/styles/theme-tokens";
import FlowStyles from "~/styles/flow-styles";
import InputStyles from "~/styles/input-styles";
import { AutoColorSchemeController } from "~/utils/auto-color-scheme";
import workflowRuntimeSource from "~/utils/mcp/workflow-runtime.js?raw";
import {
  parseDocument,
  validateArazzo,
  indexOperations,
  indexResolvedSpec,
  buildFlowGraph,
  renderFlowDiagram,
} from "~/utils/arazzo/index.js";
import { buildMcpManifest } from "~/utils/mcp/manifest.js";
import { generateMcpServer } from "~/utils/mcp-generator.js";
import { createZip } from "~/utils/mcp/zip.js";
import { createMcpWorkflowRuntime } from "~/utils/mcp/workflow-runtime.js";

let instanceCount = 0;

/**
 * Steps a run in the page may take before it stops, retries and gotos included. A goto back to an
 * earlier step loops for as long as its condition holds, which with a mock that always answers the
 * same is for ever; the runtime's own limit (1000) is meant for servers.
 */
const MAX_RUN_STEPS = 50;

/** The OpenAPI source descriptions of an Arazzo document that can be loaded, in order. */
const openapiSources = (doc): any[] =>
  (doc?.sourceDescriptions || []).filter(
    (s) => s?.name && s?.url && (!s.type || s.type === "openapi"),
  );

/**
 * `<rapi-flow>`: draws the workflows of an Arazzo document and can run them. Its doc comments are
 * read like those of `<rapi-doc>` (see the class comment in rapidoc.ts) into the custom elements
 * manifest and the types in dist/.
 *
 * @fires flow-loaded - The Arazzo document and its sources are loaded. <span class="mono
 * yellow">e.detail</span> is <span class="mono yellow">{ doc, problems }</span>; <span class="mono
 * yellow">problems</span> lists validation findings.
 * @fires step-click - A step box is clicked or activated with the keyboard. <span class="mono
 * yellow">e.detail</span> is <span class="mono yellow">{ workflowId, stepId, operation, workflowRef
 * }</span>.
 * @fires view-change - The reader switched between compact and expanded. <span class="mono
 * yellow">e.detail</span> is <span class="mono yellow">{ view }</span>.
 * @fires workflow-run - A run finished. <span class="mono yellow">e.detail</span> is <span
 * class="mono yellow">{ workflowId, inputs, result, trace }</span>: <span class="mono
 * yellow">result</span> is the MCP tool result, and <span class="mono yellow">trace</span> has one
 * entry per step attempt with its request and response.
 */
@customElement("rapi-flow")
export default class RapiFlow extends LitElement {
  /**
   * URL of the Arazzo 1.x document, YAML or JSON.
   * @group Workflow
   */
  @property({ type: String, attribute: "arazzo-url" })
  arazzoUrl = "";
  /**
   * Replaces the URL of the first OpenAPI source description. Other sources are fetched relative to
   * the Arazzo file.
   * @group Workflow
   */
  @property({ type: String, attribute: "spec-url" })
  specUrl = "";
  /**
   * The workflow to show. With several workflows, a picker in the header switches between them.
   * @group Workflow
   * @default (the first workflow)
   */
  @property({ type: String, attribute: "workflow-id" })
  workflowId = "";
  /**
   * <span class="mono yellow">id</span> of a <span class="mono yellow">&lt;rapi-doc&gt;</span> on
   * the page to take the spec, server, credentials and mock from. Clicking a step scrolls that
   * reference to the step's operation.
   * @group Workflow
   */
  @property({ type: String, attribute: "for" })
  for = "";
  /**
   * Brand color preset, or a custom brand color as a hex code. Each preset defines a dark and a
   * light palette.
   * @summary Color palette preset
   * @group Theme
   * @allowedNote (or custom hex color e.g. #2563eb)
   * @default ember
   */
  @property({ type: String, reflect: true })
  theme: "ember" | "carbon" | "cobalt" | "jade" | "indigo" | (string & {}) = DEFAULT_THEME;
  /**
   * Base color scheme mode. 'system' automatically matches the user's OS preference. 'auto' follows
   * the host page: it reads the page's CSS <code>color-scheme</code> (for example
   * <code>:root[data-theme='light'] { color-scheme: light }</code>, as Starlight sets it) and
   * updates when the page switches theme; when the page declares none, it falls back to the OS
   * preference.
   * @summary Dark, light, or follow the system or the page
   * @group Theme
   */
  @property({ type: String, attribute: "color-scheme", reflect: true })
  colorScheme: "dark" | "light" | "system" | "auto" = "dark";
  /**
   * <span class="mono yellow">expanded</span> shows each step's inputs and actions in its box;
   * <span class="mono yellow">compact</span> shows only the operation.
   * @group Workflow
   */
  @property({ type: String, reflect: true })
  view: "expanded" | "compact" = "expanded";
  /**
   * <span class="mono yellow">false</span> hides the Compact / Expanded switch.
   * @group Workflow
   */
  @property({ type: String, attribute: "show-view-toggle" })
  showViewToggle: "true" | "false" = "true";
  /**
   * <span class="mono yellow">true</span> shows a box above the diagram to load any Arazzo
   * document by URL (YAML or JSON; the server must allow cross-origin requests). Loading one shows
   * its first workflow. The element then manages the document: with <span class="mono
   * yellow">for</span>, whenever the document changes (from the box or <span class="mono
   * yellow">arazzo-url</span>), the tied <span class="mono yellow">&lt;rapi-doc&gt;</span> loads its
   * first OpenAPI source, unless it already shows that spec, so steps resolve and runs go to that
   * API.
   * @group Workflow
   */
  @property({ type: String, attribute: "allow-arazzo-url-load" })
  allowArazzoUrlLoad: "true" | "false" = "false";
  /**
   * <span class="mono yellow">false</span> hides the run panel: the diagram only.
   * @group Run
   */
  @property({ type: String, attribute: "allow-run" })
  allowRun: "true" | "false" = "true";
  /**
   * Base URL runs send requests to, instead of the server the tied <span class="mono
   * yellow">&lt;rapi-doc&gt;</span> selected or the spec's first server.
   * @group Run
   */
  @property({ type: String, attribute: "server-url" })
  serverUrl = "";
  /**
   * <span class="mono yellow">true</span> says the server runs go to is a mock that picks its
   * response status from a <span class="mono yellow">Prefer: code=</span> header, such as
   * <span class="mono yellow">rapidoc mock</span> or Prism. The run panel then shows Mock Response
   * Status, sent with each step's request, and the button reads "Run workflow (Mock)". Not needed
   * when the tied <span class="mono yellow">&lt;rapi-doc&gt;</span> has <span class="mono
   * yellow">mock-server="true"</span>; against a real API, leave it off: the header is ignored.
   * @group Run
   */
  @property({ type: String, attribute: "server-is-mock" })
  serverIsMock: "true" | "false" = "false";
  /**
   * <span class="mono yellow">true</span> shows an Export MCP Server button that downloads an MCP
   * server with one tool per workflow of the Arazzo document (every one the runtime can run), and
   * no tool per operation. Its steps call every API source of the document; <span class="mono
   * yellow">&lt;rapi-doc&gt;</span>'s own export covers one API's operations.
   * @group MCP
   */
  @property({ type: String, attribute: "mcp" })
  mcp: "true" | "false" = "false";
  /**
   * Name of the exported MCP server. Defaults to the Arazzo document's title.
   * @group MCP
   */
  @property({ type: String, attribute: "mcp-server-name" })
  mcpServerName = "";

  @state() private doc: any = null;
  @state() private sources: Map<string, any> = new Map();
  @state() private problems: any[] = [];
  @state() private loading = false;
  @state() private loadError = "";
  @state() private selectedStepId = "";
  // The OpenAPI documents this element loaded itself, by source name, for runs without a <rapi-doc>
  private specObjects: Map<string, any> = new Map();
  // Running a workflow: the inputs form, the step whose request is in flight, and a log
  @state() private runState: "idle" | "running" | "done" = "idle";
  @state() private runInputs: Record<string, string> = {};
  /**
   * Status codes a mock answers with during a run, by step id, `*` for every other step; each a
   * list such as "503, 200". A tied <rapi-doc>'s in-browser mock gets them per operation; any other
   * server gets `Prefer: code=<status>` on the request, which `rapidoc mock` honours.
   */
  @property({ type: Object, attribute: false }) statusCodes: Record<string, string> = {};
  @state() private mockStrategy = "cycle";
  // Credentials typed into the run panel, by security scheme id, when no <rapi-doc> supplies them
  @state() private manualCredentials: Record<string, string> = {};
  @state() private runningStepId = "";
  @state() private trace: any[] = [];
  @state() private runResult: any = null;
  /** The inputs the last run was given, as the workflow got them: the start of its log. */
  @state() private runSentInputs: Record<string, unknown> | null = null;
  @state() private runProblem = "";

  private loadId = 0;
  /** The next load comes from the URL box: the tied <rapi-doc> follows its first OpenAPI source. */
  private followArazzo = false;
  /** The first source's URL the tied <rapi-doc> was asked to show; its other specs are ignored. */
  private awaitedSpecUrl = "";
  /** What the box showed before a load from it, put back if that load fails. */
  private beforeBoxLoad: { arazzoUrl: string; workflowId: string; specUrl: string } | null = null;
  /** Put back after a failed box load: set the properties without loading again. */
  private skipLoad = false;
  /** Why the last load from the URL box failed, and the URL that was typed; the diagram stays. */
  @state() private boxError = "";
  @state() private boxValue: string | null = null;
  /** Stops the run in progress (the Stop button, another workflow, Clear, disconnect). */
  private runAbort: AbortController | null = null;
  // The <rapi-doc> named by `for` while it supplies the first OpenAPI source (no spec-url)
  private specDoc: any = null;
  private onSpecLoaded = () => this.useRapiDocSpec();
  /** Redraws when the tied <rapi-doc>'s mock-server attribute changes, for the MOCK badge. */
  private mockObserver: MutationObserver | null = null;
  // Step whose box, lines and output rows are highlighted while the pointer is over one of them
  private linkedStepId = "";
  private idPrefix = `rf${++instanceCount}`;
  _autoColorScheme = new AutoColorSchemeController(this);

  static styles = [
    ThemeTokens,
    // Buttons, inputs and selects as in <rapi-doc>: .btn and its variants, one height per size
    InputStyles,
    FlowStyles,
    css`
      /* The element paints its own background, so it keeps its content off the edges; a page
         can set rapi-flow { padding: 0 } */
      :host {
        display: block;
        padding: 1rem 1.25rem;
        color: var(--foreground);
        background: var(--background);
        font-family: var(--font-sans);
        font-size: var(--font-size-regular);
        line-height: var(--line-height);
      }
      .flow-url {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
      .flow-url input {
        flex: 1 1 auto;
        min-width: 0;
      }
      /* No browser history list for the box (autocomplete="off"); and if a browser fills it anyway,
         keep the field's own colors instead of its light autofill background */
      .flow-url input:autofill,
      .flow-url input:-webkit-autofill {
        -webkit-text-fill-color: var(--foreground);
        caret-color: var(--foreground);
        box-shadow: 0 0 0 100vmax var(--input-background) inset;
        transition: background-color 9999s;
      }
      .flow-url-error {
        margin: -0.5rem 0 1rem;
        color: var(--destructive);
        font-size: var(--font-size-small);
      }
      .flow-source {
        margin: 0 0 0.75rem;
        color: var(--muted-foreground);
        font-size: var(--font-size-small);
        overflow-wrap: anywhere;
      }
      .flow-source-url {
        margin-left: 0.375rem;
        color: var(--foreground);
        font-family: var(--font-mono);
      }
      /* Which workflow (picker or id) and the view switch on one row, then the summary and the
         description */
      .flow-header {
        margin-bottom: 0.75rem;
      }
      .flow-toolbar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem 1rem;
      }
      .flow-title {
        margin: 0.75rem 0 0;
        font-size: var(--h4-font-size);
        font-weight: var(--heading-weight);
        color: var(--heading-color);
      }
      .flow-toolbar .flow-title {
        margin: 0;
      }
      .flow-id {
        font-family: var(--font-mono);
        font-size: var(--font-size-small);
        color: var(--muted-foreground);
      }
      .flow-controls {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem;
        margin-left: auto;
      }
      /* Two outline buttons joined into one control; the pressed one is filled */
      .view-toggle {
        display: inline-flex;
      }
      .view-toggle .btn {
        font-weight: 400;
      }
      .view-toggle .btn:first-child {
        border-radius: var(--radius) 0 0 var(--radius);
      }
      .view-toggle .btn + .btn {
        margin-left: -1px;
        border-radius: 0 var(--radius) var(--radius) 0;
      }
      .view-toggle .btn[aria-pressed="true"] {
        color: var(--primary-foreground);
        background: var(--primary);
        border-color: var(--primary);
      }
      .flow-description {
        margin: 0.25rem 0 0;
        color: var(--muted-foreground);
        font-size: var(--font-size-description);
      }
      .flow-diagram {
        overflow-x: auto;
      }
      .flow-message {
        color: var(--muted-foreground);
        font-size: var(--font-size-description);
      }
      .flow-problems {
        margin: 0.75rem 0 0;
        padding-left: 1.25rem;
        font-size: var(--font-size-small);
        color: var(--destructive);
      }
      .flow-run {
        margin-top: 1rem;
        font-size: var(--font-size-description);
      }
      .flow-run h3 {
        margin: 1rem 0 0.5rem;
        font-size: var(--h5-font-size);
        font-weight: var(--heading-weight);
        color: var(--heading-color);
      }
      .flow-run h4 {
        margin: 0.5rem 0 0.25rem;
        font-size: var(--font-size-small);
        font-weight: var(--heading-weight);
        color: var(--muted-foreground);
      }
      .flow-run pre {
        margin: 0;
        border: 0;
        padding: 0.5rem;
        overflow-x: auto;
        background: var(--muted);
        border-radius: var(--radius);
        font-family: var(--font-mono);
        font-size: var(--font-size-small);
        white-space: pre-wrap;
        word-break: break-word;
      }
      .flow-run .muted {
        color: var(--muted-foreground);
      }
      .run-inputs {
        container-type: inline-size;
        margin: 0 0 0.75rem;
        padding: 0.5rem 0.75rem;
        border: 1px solid var(--border);
        border-radius: var(--radius);
        background: var(--card);
      }
      .run-inputs h3 {
        margin: 0.25rem 0 0.5rem;
        font-size: var(--font-size-small);
        font-weight: var(--heading-weight);
        color: var(--muted-foreground);
      }
      .run-inputs p {
        margin: 0.25rem 0 0.5rem;
      }
      /*
       * One field per row, laid out like <rapi-doc>'s parameter rows: a right-aligned two-line label
       * (name over type) and a control as tall as the label: 1.25em + 2 x 0.75em + 2px border.
       */
      .run-field {
        display: grid;
        grid-template-columns: minmax(8rem, 14rem) minmax(0, 1fr);
        column-gap: 1rem;
        align-items: center;
        margin: 0.5rem 0;
        font-size: var(--font-size-small);
      }
      .run-field-label {
        display: flex;
        flex-direction: column;
        min-width: 0;
        text-align: right;
      }
      .run-field-name,
      .run-field-type {
        margin: 1px 0;
        line-height: 1.35;
        overflow-wrap: anywhere;
      }
      .run-field-name {
        color: var(--foreground);
        font-family: var(--font-mono);
      }
      .run-field-type {
        color: var(--muted-foreground);
        font-family: var(--font-sans);
      }
      .run-field-required {
        color: var(--destructive);
      }
      /* The "Param" control size of the shared input styles, as tall as the two-line label */
      .run-inputs .run-field :is(input, select) {
        font-family: var(--font-mono);
        line-height: 1.25;
        padding: 0.75em;
        min-width: 0;
      }
      @container (max-width: 28rem) {
        .run-field {
          grid-template-columns: minmax(0, 1fr);
          row-gap: 0.25rem;
        }
        .run-field-label {
          flex-direction: row;
          flex-wrap: wrap;
          gap: 0.5rem;
          text-align: start;
        }
      }
      .run-mock {
        margin-top: 0.75rem;
      }
      .run-mock summary {
        cursor: pointer;
        font-weight: 600;
      }
      .run-mock summary .muted {
        font-weight: 400;
        margin-left: 0.5rem;
      }
      .run-mock-rows {
        margin-top: 0.25rem;
      }
      .run-inputs p.run-mock-help {
        max-width: 48rem;
        margin: 0.5rem 0 0.25rem;
        font-size: var(--font-size-small);
      }
      .run-inputs .run-mock-strategy {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }
      .run-mock-strategy select {
        flex: 0 0 auto;
        width: auto;
      }
      .run-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.75rem;
      }
      .run-trace {
        margin: 0;
        padding: 0;
        list-style: none;
      }
      .run-trace li {
        border: 1px solid var(--border);
        border-radius: var(--radius);
        margin-bottom: 0.375rem;
        background: var(--card);
      }
      .run-trace li.trace-failure {
        border-color: var(--destructive);
      }
      .run-trace summary {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem 0.75rem;
        align-items: baseline;
        position: relative;
        padding: 0.375rem 2.75rem 0.375rem 0.75rem;
        cursor: pointer;
        list-style: none;
      }
      .run-trace summary::-webkit-details-marker {
        display: none;
      }
      /* A bordered + in each entry's top-right corner, − when it is open; out of the flow, so a
         wrapping line never leaves it on a line of its own */
      .run-trace summary::after {
        content: "+";
        position: absolute;
        top: 0.5rem;
        right: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.25em;
        height: 1.25em;
        border: 1px solid var(--input);
        border-radius: 3px;
        color: var(--muted-foreground);
        font-family: var(--font-mono);
        font-size: var(--font-size-small);
        line-height: 1;
      }
      .run-trace details[open] summary::after {
        content: "−";
      }
      .run-trace summary:hover::after {
        color: var(--foreground);
        border-color: var(--muted-foreground);
      }
      .run-trace details[open] summary {
        border-bottom: 1px solid var(--border);
      }
      .run-trace details > :not(summary) {
        margin-left: 0.75rem;
        margin-right: 0.75rem;
      }
      .run-trace details > pre:last-child {
        margin-bottom: 0.75rem;
      }
      .trace-step {
        font-weight: 600;
      }
      .trace-request {
        font-family: var(--font-mono);
        font-size: var(--font-size-small);
        color: var(--muted-foreground);
        word-break: break-all;
      }
      .trace-success .trace-outcome {
        color: var(--green);
      }
      .trace-failure .trace-outcome,
      .run-problem,
      .run-error {
        color: var(--destructive);
      }
      .flow-problems .warning {
        color: var(--muted-foreground);
      }
      code,
      pre {
        font-family: var(--font-mono);
        font-size: var(--font-size-small);
      }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    this.theme = normalizeTheme(this.theme).theme;
    if (!this.getAttribute("theme")) this.setAttribute("theme", this.theme);
    if (!"dark, light, system, auto,".includes(`${this.colorScheme},`)) this.colorScheme = "dark";
    if (!this.getAttribute("color-scheme")) this.setAttribute("color-scheme", this.colorScheme);
    applyCustomTheme(this, this.theme);
    // Reconnected after a load: listen to the <rapi-doc> again
    if (this.doc) {
      this.watchRapiDoc();
      this.useRapiDocSpec();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.runAbort?.abort();
    this.specDoc?.removeEventListener("spec-loaded", this.onSpecLoaded);
    this.specDoc = null;
    this.mockObserver?.disconnect();
    this.mockObserver = null;
  }

  updated(changed) {
    if (changed.has("theme")) {
      const normalized = normalizeTheme(this.theme).theme;
      if (normalized !== this.theme) this.theme = normalized;
      applyCustomTheme(this, this.theme);
    }
    if (changed.has("arazzoUrl") || changed.has("specUrl") || changed.has("for")) {
      if (this.skipLoad) this.skipLoad = false;
      else this.load();
    }
    // A redrawn diagram has lost the highlight classes
    this.linkedStepId = "";
  }

  /**
   * Loads the Arazzo document and its OpenAPI sources. Fires <span class="mono
   * yellow">flow-loaded</span> when done.
   * @public
   */
  async load() {
    const id = ++this.loadId;
    if (!this.arazzoUrl) {
      this.doc = null;
      return;
    }
    this.loading = true;
    this.loadError = "";
    const fromBox = this.followArazzo;
    this.followArazzo = false;
    try {
      const arazzoUrl = new URL(this.arazzoUrl, document.baseURI).href;
      const doc = parseDocument(await this.fetchText(arazzoUrl));
      // With `for` and no spec-url, the first OpenAPI source is the spec <rapi-doc> loads
      this.watchRapiDoc();
      const problems = validateArazzo(doc);
      const sources = new Map();
      const specObjects = new Map();
      // With the URL box, this element manages the document: on any load (from the box, or the
      // page setting arazzo-url), the tied <rapi-doc> loads the first source when it shows
      // another spec (or none); its spec-loaded then indexes its processed copy.
      // Without the box the page decides what the <rapi-doc> shows.
      const following = (fromBox || this.allowArazzoUrlLoad === "true") && Boolean(this.specDoc);
      const first = openapiSources(doc)[0];
      // The tied <rapi-doc> shows the first source already: use its copy, as without the box
      let switching = false;
      if (following && first) {
        const firstUrl = new URL(first.url, arazzoUrl).href;
        const current =
          this.specDoc.specUrl && new URL(this.specDoc.specUrl, document.baseURI).href;
        switching = current !== firstUrl;
        this.awaitedSpecUrl = firstUrl;
        if (switching) this.specDoc.loadSpec(firstUrl);
      }
      await Promise.all(
        openapiSources(doc).map(async (s, i) => {
          // Tied: the first source is the <rapi-doc>'s (loaded already, or loading now at our
          // request; its spec-loaded indexes it), so it is fetched once
          if (i === 0 && this.specDoc) return;
          const url = i === 0 && this.specUrl ? this.specUrl : s.url;
          try {
            const text = await this.fetchText(
              new URL(url, i === 0 && this.specUrl ? document.baseURI : arazzoUrl).href,
            );
            const openapi = parseDocument(text);
            sources.set(s.name, indexOperations(openapi));
            specObjects.set(s.name, openapi);
          } catch (err) {
            problems.push({
              level: "warning",
              path: `sourceDescriptions.${s.name}`,
              message: `could not load ${url}: ${err.message}`,
            });
          }
        }),
      );
      if (id !== this.loadId) return;
      this.boxError = "";
      this.boxValue = null;
      this.beforeBoxLoad = null;
      this.doc = doc;
      this.sources = sources;
      this.specObjects = specObjects;
      this.problems = problems;
      this.resetRun();
      // The <rapi-doc>'s copy of the first source: now, if it holds it already (it may have finished
      // loading while the other sources were fetched); else its spec-loaded indexes it
      this.useRapiDocSpec();
      this.emit("flow-loaded", { doc, problems });
    } catch (err) {
      if (id !== this.loadId) return;
      // From the URL box with a document already shown: keep it, and the <rapi-doc> that goes with
      // it (it only follows a document that loaded), say why next to the box, and keep the typed URL
      const before = this.beforeBoxLoad;
      this.beforeBoxLoad = null;
      if (fromBox && this.doc && before) {
        this.boxValue = this.arazzoUrl;
        this.boxError = `Could not load ${this.arazzoUrl}: ${err.message}. Still showing ${before.arazzoUrl}.`;
        this.skipLoad = before.arazzoUrl !== this.arazzoUrl || before.specUrl !== this.specUrl;
        this.arazzoUrl = before.arazzoUrl;
        this.workflowId = before.workflowId;
        this.specUrl = before.specUrl;
        return;
      }
      this.doc = null;
      this.loadError = err.message;
    } finally {
      if (id === this.loadId) this.loading = false;
    }
  }

  private async fetchText(url: string) {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);
    return resp.text();
  }

  /** The parsed Arazzo document, for a <rapi-doc> that exports workflow tools; null until loaded. */
  get arazzoDocument(): any {
    return this.doc;
  }

  /** The text of workflow-runtime.js, for the project a tied <rapi-doc> exports. */
  get workflowRuntimeSource(): string {
    return workflowRuntimeSource;
  }

  private get workflowIds(): string[] {
    return (this.doc?.workflows || []).map((w) => w?.workflowId).filter(Boolean);
  }

  private get graph() {
    if (!this.doc) return null;
    const ids = this.workflowIds;
    const wanted = ids.includes(this.workflowId) ? this.workflowId : ids[0];
    return buildFlowGraph(this.doc, wanted, { sources: this.sources });
  }

  /** Follows the <rapi-doc> named by `for`, unless spec-url names the spec to load instead. */
  private watchRapiDoc() {
    const rapiDoc = this.specUrl ? null : this.findRapiDoc();
    if (rapiDoc === this.specDoc) return;
    this.specDoc?.removeEventListener("spec-loaded", this.onSpecLoaded);
    this.specDoc = rapiDoc;
    rapiDoc?.addEventListener("spec-loaded", this.onSpecLoaded);
    this.mockObserver?.disconnect();
    this.mockObserver = null;
    if (rapiDoc) {
      this.mockObserver = new MutationObserver(() => this.requestUpdate());
      this.mockObserver.observe(rapiDoc, { attributes: true, attributeFilter: ["mock-server"] });
    }
  }

  /**
   * Indexes the spec the <rapi-doc> has processed as the first OpenAPI source. Runs after a load
   * and on each `spec-loaded`, since <rapi-doc> often finishes after <rapi-flow>. Until then,
   * steps of that source show their operationId.
   */
  private useRapiDocSpec() {
    const first = openapiSources(this.doc)[0];
    const spec = this.specDoc?.resolvedSpec;
    if (!first || !spec || spec.isSpecLoading || spec.specLoadError) return;
    // Asked to load another spec (the URL box): not until it holds that one
    if (this.awaitedSpecUrl) {
      const current = this.specDoc.specUrl && new URL(this.specDoc.specUrl, document.baseURI).href;
      if (current !== this.awaitedSpecUrl || this.specDoc.loading) return;
    }
    this.sources = new Map(this.sources).set(first.name, indexResolvedSpec(spec));
  }

  /** The tied <rapi-doc>'s in-browser mock answers runs. */
  private get inBrowserMock(): boolean {
    return this.findRapiDoc()?.mockServer === "true";
  }

  /** A mock answers runs: the tied <rapi-doc>'s in the browser, or a mock server (server-is-mock). */
  private get runsMocked(): boolean {
    return this.inBrowserMock || this.serverIsMock === "true";
  }

  private findRapiDoc(): any {
    if (!this.for) return null;
    const root = this.getRootNode() as Document | ShadowRoot;
    return root.getElementById?.(this.for) || document.getElementById(this.for);
  }

  private selectStep(stepId: string) {
    const graph = this.graph;
    const step = graph?.steps.find((s) => s.stepId === stepId);
    if (!step) return;
    this.selectedStepId = stepId;
    const op = step.operation;
    this.emit("step-click", {
      workflowId: graph.workflowId,
      stepId,
      operation: op,
      workflowRef: step.workflowId,
    });
    if (step.kind === "workflow" && this.workflowIds.includes(step.workflowId)) {
      this.workflowId = step.workflowId;
      return;
    }
    const rapiDoc = this.findRapiDoc();
    if (!op || !rapiDoc?.resolvedSpec) return;
    const target = (rapiDoc.resolvedSpec.tags || [])
      .flatMap((t) => t.paths || [])
      .find(
        (p) =>
          (op.operationId && p.operationId === op.operationId) ||
          (p.method === op.method && p.path === op.path),
      );
    if (target?.elementId) rapiDoc.scrollToPath(target.elementId);
  }

  private onDiagramEvent(e: Event) {
    if (e instanceof KeyboardEvent && e.key !== "Enter" && e.key !== " ") return;
    const el = (e.target as Element)?.closest?.(".rf-jump, .rf-clickable");
    if (!el) return;
    e.preventDefault();
    // A step name in the outputs box or a value line: bring that step into view, then select it
    if (el.classList.contains("rf-jump")) {
      const stepId = el.getAttribute("data-from-step") || "";
      this.selectStep(stepId);
      // Selecting redraws the diagram, so scroll to the new step box once it is drawn
      this.updateComplete.then(() => {
        const sel = `.rf-step[data-step-id="${CSS.escape(stepId)}"]`;
        const box = this.renderRoot.querySelector(sel);
        if (box) this.scrollToCenter(box.getBoundingClientRect());
      });
      return;
    }
    this.selectStep(el.getAttribute("data-step-id") || "");
  }

  /**
   * Highlights the step under the pointer together with its goto and retry lines, the value lines
   * that read it and its rows in the outputs box (or, from an output row, the step it comes from). The diagram is an SVG string,
   * so the classes are set on its elements directly.
   */
  private onDiagramHover(e: Event) {
    const el =
      e.type === "mouseleave"
        ? null
        : (e.target as Element)?.closest?.("[data-step-id], [data-from-step]");
    const id = el?.getAttribute("data-step-id") || el?.getAttribute("data-from-step") || "";
    if (id === this.linkedStepId) return;
    this.linkedStepId = id;
    const svg = this.renderRoot.querySelector(".flow-diagram svg");
    if (!svg) return;
    svg.querySelectorAll(".rf-linked").forEach((n) => n.classList.remove("rf-linked"));
    if (!id) return;
    const sel = CSS.escape(id);
    svg
      .querySelectorAll(`[data-step-id="${sel}"], [data-from-step="${sel}"]`)
      .forEach((n) => n.classList.add("rf-linked"));
  }

  /**
   * Scrolls the nearest scrolling ancestor (or the window) so a rect is centered. Used instead of
   * scrollIntoView, which does not move SVG groups in every browser.
   */
  private scrollToCenter(rect: DOMRect) {
    // Walk up through shadow roots too, in case <rapi-flow> sits inside another component
    const up = (node: Element) =>
      node.parentElement || ((node.getRootNode() as ShadowRoot).host as Element) || null;
    let el = up(this);
    while (el) {
      const { overflowY } = getComputedStyle(el);
      if (/(auto|scroll)/.test(overflowY) && el.scrollHeight > el.clientHeight) break;
      el = up(el);
    }
    const view = el ? el.getBoundingClientRect() : { top: 0, height: window.innerHeight };
    const top = rect.top - view.top - (view.height - Math.min(rect.height, view.height)) / 2;
    (el || window).scrollBy({ top, behavior: "smooth" });
  }

  private setView(view: string) {
    if (view === this.view) return;
    this.view = view as "expanded" | "compact";
    this.emit("view-change", { view });
  }

  /** Back to the form, with the shown workflow's input defaults filled in. */
  private resetRun() {
    this.runAbort?.abort();
    this.runState = "idle";
    this.runningStepId = "";
    this.trace = [];
    this.runResult = null;
    this.runSentInputs = null;
    this.runProblem = "";
    const defaults = {};
    for (const i of this.graph?.inputDetails || []) {
      if (i.default !== undefined) {
        defaults[i.name] = typeof i.default === "string" ? i.default : JSON.stringify(i.default);
      }
    }
    this.runInputs = defaults;
  }

  /** The credentials a tied <rapi-doc> holds, by security scheme id, as the runtime takes them. */
  private credentialsFromRapiDoc(rapiDoc) {
    const credentials = {};
    for (const s of rapiDoc?.resolvedSpec?.securitySchemes || []) {
      const value = s?.finalKeyValue;
      if (!value || !s.securitySchemeId) continue;
      if (s.type === "apiKey") credentials[s.securitySchemeId] = value;
      else if (/^basic /i.test(value)) credentials[s.securitySchemeId] = atob(value.slice(6));
      else credentials[s.securitySchemeId] = value.replace(/^(bearer|mac)\s+/i, "");
    }
    return credentials;
  }

  /**
   * The runtime and tool that run the shown workflow, or why it cannot run. The OpenAPI document
   * is the tied <rapi-doc>'s, else the first source this element loaded; requests go to
   * `server-url`, else the server the <rapi-doc> selected, else the spec's; credentials are the
   * <rapi-doc>'s.
   */
  private prepareRun(graph) {
    const rapiDoc = this.findRapiDoc();
    const first = openapiSources(this.doc)[0];
    const spec = this.specDoc?.resolvedSpec || this.specObjects.get(first?.name);
    if (!spec) return { problem: "the OpenAPI document of the first source is not loaded" };
    const problems = [];
    const manifest = buildMcpManifest(spec, {
      arazzo: this.doc,
      sources: Object.fromEntries(this.specObjects),
      onProblem: (p) => problems.push(p),
    });
    const tool = manifest.tools.find((t) => t.workflow === graph.workflowId);
    if (!tool) {
      const why = problems.find((p) => p.message.includes(`workflow ${graph.workflowId} `));
      return {
        problem: why
          ? why.message.replace(/^workflow \S+ is left out of the MCP export: /, "")
          : "this workflow cannot be run",
      };
    }
    const baseUrl = this.serverUrl || rapiDoc?.selectedServer?.computedUrl;
    const runtime = createMcpWorkflowRuntime(manifest, {
      credentials: { ...this.typedCredentials(), ...this.credentialsFromRapiDoc(rapiDoc) },
      baseUrls: baseUrl ? { [first.name]: baseUrl } : {},
    });
    return { runtime, tool };
  }

  /** The form's values as the workflow's inputs, by each input's type. */
  private coerceInputs(graph) {
    const inputs = {};
    for (const i of graph.inputDetails) {
      const raw = this.runInputs[i.name];
      if (raw === undefined || raw === "") continue;
      const type = String(i.type || "string");
      let value: any = raw;
      if (/^(integer|number)/.test(type)) value = Number(raw);
      else if (type.startsWith("boolean")) value = raw === "true";
      else if (/^(object|array)/.test(type)) {
        try {
          value = JSON.parse(raw);
        } catch {
          value = raw;
        }
      }
      inputs[i.name] = value;
    }
    return inputs;
  }

  /** Runs the shown workflow in the browser, logging each step, then fires `workflow-run`. */
  private async executeRun(graph) {
    const prepared = this.prepareRun(graph);
    this.runningStepId = "";
    this.trace = [];
    this.runResult = null;
    this.runSentInputs = null;
    this.runProblem = "";
    if (!prepared.runtime) {
      this.runProblem = prepared.problem;
      this.runState = "done";
      return;
    }
    const inputs = this.coerceInputs(graph);
    this.runSentInputs = inputs;
    this.runState = "running";
    // Status codes for this run: the in-browser mock reads them from the <rapi-doc> (set for the
    // run only), any other server gets them as Prefer: code=
    const rapiDoc = this.findRapiDoc();
    const mocked = rapiDoc?.mockServer === "true";
    const codes = this.statusCodesByStep(graph);
    const anyList = Object.values(codes).some((c) => c.includes(","));
    const previous = mocked &&
      Object.keys(codes).length && {
        code: rapiDoc.mockServerStatusCode,
        strategy: rapiDoc.mockServerStatusStrategy,
      };
    if (previous) {
      const byOperation = {};
      for (const step of graph.steps) {
        const op = step.operation;
        if (op && codes[step.stepId])
          byOperation[`${op.method.toUpperCase()} ${op.path}`] = codes[step.stepId];
      }
      if (codes["*"]) byOperation["*"] = codes["*"];
      rapiDoc.mockServerStatusCode = byOperation;
      rapiDoc.mockServerStatusStrategy = anyList ? this.mockStrategy : "first";
      await rapiDoc.updateComplete;
    }
    const pick = (list: string, attempt: number) => {
      const items = list
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      if (!items.length) return "";
      if (this.mockStrategy === "random" && items.length > 1)
        return items[Math.floor(Math.random() * items.length)];
      return items[(attempt - 1) % items.length];
    };
    const abort = new AbortController();
    this.runAbort = abort;
    const result = await prepared.runtime.callTool(prepared.tool.name, inputs, {
      signal: abort.signal,
      maxStepRuns: MAX_RUN_STEPS,
      onStepStart: (e) => {
        if (this.runAbort === abort) this.runningStepId = e.stepId;
      },
      onStep: (e) => {
        // A step that finishes after Clear or a switch belongs to no log any more
        if (this.runAbort !== abort) return;
        this.runningStepId = "";
        this.trace = [...this.trace, { ...e, mocked: mocked || this.serverIsMock === "true" }];
      },
      requestHeaders: mocked
        ? undefined
        : (e) => {
            const code = pick(codes[e.stepId] || codes["*"] || "", e.attempt);
            return code ? { Prefer: `code=${code}` } : undefined;
          },
    });
    if (previous) {
      rapiDoc.mockServerStatusCode = previous.code;
      rapiDoc.mockServerStatusStrategy = previous.strategy;
    }
    // Cleared or switched to another workflow while it ran: that view has moved on
    if (this.runAbort !== abort) return;
    this.runAbort = null;
    this.runningStepId = "";
    this.runResult = result;
    this.runState = "done";
    this.emit("workflow-run", { workflowId: graph.workflowId, inputs, result, trace: this.trace });
  }

  /** Fires one of the element's events, out of its shadow root. */
  private emit(name: string, detail: object) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  /**
   * The security schemes of the loaded OpenAPI sources, for the credentials fields of a standalone
   * element: `{ id, type, scheme, in, name }` each, one per scheme id (a credential applies to every
   * source that names the scheme). Empty with a tied <rapi-doc>, which has its own.
   */
  private standaloneSchemes() {
    if (this.findRapiDoc()) return [];
    const byId = new Map();
    for (const spec of this.specObjects.values()) {
      const schemes = spec?.components?.securitySchemes || spec?.securityDefinitions || {};
      for (const [id, s] of Object.entries(schemes) as [string, any][]) {
        if (s && typeof s === "object" && s.type && !byId.has(id)) {
          byId.set(id, { id, type: s.type, scheme: s.scheme, in: s.in, name: s.name });
        }
      }
    }
    return [...byId.values()];
  }

  /** The typed credentials as the runtime takes them: a string ("user:password" for Basic). */
  private typedCredentials() {
    const credentials = {};
    const schemes = this.standaloneSchemes();
    for (const [id, value] of Object.entries(this.manualCredentials)) {
      if (!value) continue;
      const scheme = schemes.find((s) => s.id === id);
      const basic = scheme?.type === "http" && String(scheme.scheme).toLowerCase() === "basic";
      credentials[id] = basic ? value : value.replace(/^bearer\s+/i, "");
    }
    return credentials;
  }

  /** One run-panel field: a two-line label (name over type) and its control, as <rapi-doc> lays out parameters. */
  private field(name, type, control, { required = false, mono = true } = {}) {
    return html`<label class="run-field">
      <span class="run-field-label">
        <span class="run-field-name" style=${mono ? "" : "font-family: var(--font-sans)"}>
          ${required ? html`<span class="run-field-required" title="Required">*</span>` : nothing}${name}
        </span>
        ${type ? html`<span class="run-field-type">${type}</span>` : nothing}
      </span>
      ${control}
    </label>`;
  }

  private renderCredentials() {
    const schemes = this.standaloneSchemes();
    if (!schemes.length) return nothing;
    const hint = (s) =>
      s.type === "apiKey"
        ? `API key (${s.in || "header"} ${s.name})`
        : s.type === "http" && String(s.scheme).toLowerCase() === "basic"
          ? "user:password"
          : "token";
    return html`<h3>Credentials <span class="muted">kept in this page only</span></h3>
      ${schemes.map((s) =>
        this.field(
          s.id,
          s.type,
          html`<input
            type="password"
            name=${`credential-${s.id}`}
            autocomplete="off"
            .value=${this.manualCredentials[s.id] ?? ""}
            placeholder=${hint(s)}
            @input=${(e) => (this.manualCredentials = { ...this.manualCredentials, [s.id]: e.target.value })}
          />`,
        ),
      )}`;
  }

  /** The run's status codes with blanks dropped: `{ "*": "...", <stepId>: "..." }`. */
  private statusCodesByStep(graph): Record<string, string> {
    const out = {};
    const stepIds = new Set(graph.steps.map((s) => s.stepId));
    for (const [key, value] of Object.entries(this.statusCodes || {})) {
      const codes = String(value ?? "").trim();
      if (codes && (key === "*" || stepIds.has(key))) out[key] = codes;
    }
    return out;
  }

  /**
   * Status codes to answer with, one row per step plus a default: for a tied <rapi-doc>'s
   * in-browser mock, or for a mock server that honours Prefer: code= (server-is-mock); not shown
   * otherwise, since a real API ignores it. Folded until a
   * status is set (statusCodes, or typed in it), so the inputs and the Run button come first.
   */
  private renderStatusCodes(graph) {
    // Only where a mock reads it: the tied <rapi-doc>'s in the browser, or a mock server
    if (!this.runsMocked) return nothing;
    const mocked = this.inBrowserMock;
    const set = (key, value) => (this.statusCodes = { ...this.statusCodes, [key]: value });
    const anyList = Object.values(this.statusCodes || {}).some((c) => String(c).includes(","));
    const steps = graph.steps.filter((s) => s.operation);
    return html`<details class="run-mock" ?open=${Object.keys(this.statusCodesByStep(graph)).length > 0}>
      <summary>
        Mock Response Status
        <span class="muted">${mocked ? "the in-browser mock answers with" : "the mock server answers with (sent as Prefer: code=)"}</span>
      </summary>
      <p class="muted run-mock-help">
        Make the mock answer with an HTTP status, to try the workflow's failure paths: its
        retries, gotos and ends. Enter one code (<code>404</code>), or several separated by
        commas (<code>503, 200</code>) to give a step's attempts one each. Leave a field empty
        for the success response; a step's own field overrides Every step.
      </p>
      <div class="run-mock-rows">
        ${this.field(
          "Every step",
          "empty: success response",
          html`<input
            type="text"
            name="mock-status"
            inputmode="numeric"
            .value=${this.statusCodes?.["*"] ?? ""}
            placeholder="e.g. 404, or 503, 200"
            @input=${(e) => set("*", e.target.value)}
          />`,
          { mono: false },
        )}
        ${steps.map((s) =>
          this.field(
            s.stepId,
            `${s.operation.method.toUpperCase()} ${s.operation.path}`,
            html`<input
              type="text"
              name=${`mock-status-${s.stepId}`}
              inputmode="numeric"
              .value=${this.statusCodes?.[s.stepId] ?? ""}
              placeholder="Same as every step"
              @input=${(e) => set(s.stepId, e.target.value)}
            />`,
          ),
        )}
      </div>
      ${
        anyList
          ? html`<label class="run-mock-strategy">
              <span class="muted">Multiple mock response statuses provided: use them</span>
              <select aria-label="How to use the mock response statuses" @change=${(e) => (this.mockStrategy = e.target.value)}>
                <option value="cycle" ?selected=${this.mockStrategy === "cycle"}>in turn, per step</option>
                <option value="random" ?selected=${this.mockStrategy === "random"}>at random</option>
              </select>
            </label>`
          : nothing
      }
    </details>`;
  }

  private renderInputsForm(graph) {
    const set = (name, value) => (this.runInputs = { ...this.runInputs, [name]: value });
    const running = this.runState === "running";
    // Answered by a mock (the tied <rapi-doc>'s in the browser, or a mock server): said on the button
    const mocked = this.runsMocked;
    const mockTitle = this.inBrowserMock
      ? "The in-browser mock of the tied <rapi-doc> answers this run's requests; they do not reach the server"
      : "Runs go to a mock server (server-is-mock)";
    return html`<form
      class="run-inputs"
      part="run-inputs"
      @submit=${(e) => {
        e.preventDefault();
        if (!running) this.executeRun(graph);
      }}
    >
      ${this.renderCredentials()}
      ${graph.inputDetails.length ? html`<h3>Inputs</h3>` : html`<p class="muted">This workflow takes no inputs.</p>`}
      ${graph.inputDetails.map((i) =>
        this.field(
          i.name,
          i.type,
          i.enum
            ? html`<select name=${i.name} @change=${(e) => set(i.name, e.target.value)}>
                <option value="" ?selected=${!this.runInputs[i.name]}></option>
                ${i.enum.map(
                  (v) =>
                    html`<option value=${String(v)} ?selected=${String(v) === this.runInputs[i.name]}>${String(v)}</option>`,
                )}
              </select>`
            : html`<input
                type="text"
                name=${i.name}
                .value=${this.runInputs[i.name] ?? ""}
                placeholder=${i.description || ""}
                ?required=${i.required}
                @input=${(e) => set(i.name, e.target.value)}
              />`,
          { required: i.required },
        ),
      )}
      ${this.renderStatusCodes(graph)}
      <div class="run-actions">
        <button type="submit" class="btn btn-primary run-button" part="run-button" ?disabled=${running} title=${mocked ? mockTitle : nothing}>
          ${running ? "Running…" : `Run workflow${mocked ? " (Mock)" : ""} →`}
        </button>
        ${running ? html`<button type="button" class="btn btn-outline run-stop" part="run-stop" @click=${() => this.runAbort?.abort()}>Stop</button>` : nothing}
        ${this.runState === "done" ? html`<button type="button" class="btn btn-outline run-clear" @click=${() => this.resetRun()}>Clear</button>` : nothing}
      </div>
    </form>`;
  }

  private renderTraceEntry(e, n) {
    const pretty = (v) => {
      const text = typeof v === "string" ? v : JSON.stringify(v, null, 2);
      return text && text.length > 4000 ? `${text.slice(0, 4000)}…` : text;
    };
    return html`<li class="trace-${e.outcome}">
      <details ?open=${e.outcome === "failure"}>
        <summary>
          <span class="trace-step">${n + 1}. ${e.stepId}</span>
          ${e.attempt > 1 ? html`<span class="muted">attempt ${e.attempt}</span>` : nothing}
          <span class="trace-request">${e.request?.method} ${e.request?.url}</span>
          <span class="trace-status">${e.response ? `HTTP ${e.response.status}` : "no response"}${e.mocked ? html` <span class="muted">mocked</span>` : nothing}</span>
          <span class="trace-outcome">${e.outcome === "success" ? "✓" : "✗"}</span>
          ${e.failedCriterion ? html`<code>${e.failedCriterion}</code>` : nothing}
          ${e.action ? html`<span class="muted">→ ${e.action.type}${e.action.stepId ? ` ${e.action.stepId}` : ""}</span>` : nothing}
        </summary>
        ${e.request?.body !== undefined ? html`<h4>Request body</h4><pre>${pretty(e.request.body)}</pre>` : nothing}
        ${e.response ? html`<h4>Response</h4><pre>${pretty(e.response.body)}</pre>` : nothing}
        ${e.outputs && Object.keys(e.outputs).length ? html`<h4>Outputs</h4><pre>${pretty(e.outputs)}</pre>` : nothing}
      </details>
    </li>`;
  }

  /** The run panel under the diagram: the inputs form and button, then the log and the result. */
  private renderRun(graph) {
    if (this.allowRun === "false") return nothing;
    return html`<section class="flow-run" part="run">
      <h3>Run</h3>
      ${this.renderInputsForm(graph)}
      ${
        this.runSentInputs
          ? html`<h4>Inputs</h4><pre class="run-sent-inputs">${JSON.stringify(this.runSentInputs, null, 2)}</pre>`
          : nothing
      }
      ${
        this.trace.length
          ? html`<h4>Log</h4>
            <ol class="run-trace">${this.trace.map((e, n) => this.renderTraceEntry(e, n))}</ol>`
          : nothing
      }
      ${this.runProblem ? html`<p class="run-problem">Cannot run this workflow: ${this.runProblem}</p>` : nothing}
      ${
        this.runResult
          ? this.runResult.isError
            ? html`<pre class="run-error">${this.runResult.content[0].text}</pre>`
            : html`<h4>Outputs</h4><pre class="run-outputs">${this.runResult.content[0].text}</pre>`
          : nothing
      }
    </section>`;
  }

  private renderViewToggle() {
    if (this.showViewToggle === "false") return nothing;
    const current = this.view === "compact" ? "compact" : "expanded";
    const button = (view, label) =>
      html`<button type="button" class="btn btn-outline" aria-pressed=${current === view ? "true" : "false"} @click=${() => this.setView(view)}>${label}</button>`;
    return html`<div class="view-toggle" part="view-toggle" role="group" aria-label="Diagram view">
      ${button("compact", "Compact")}${button("expanded", "Expanded")}
    </div>`;
  }

  /**
   * What an MCP export builds on: the first OpenAPI source's spec (the tied <rapi-doc>'s, else the
   * one this element loaded) and every loaded source by name. Null until they are loaded.
   */
  private mcpExportInput() {
    const first = openapiSources(this.doc)[0];
    const spec = this.specDoc?.resolvedSpec || this.specObjects.get(first?.name);
    if (!this.doc || !spec) return null;
    return {
      spec,
      options: {
        arazzo: this.doc,
        sources: Object.fromEntries(this.specObjects),
        includeOperations: false,
        serverName: this.mcpServerName || this.doc.info?.title || "workflows",
        workflowRuntime: workflowRuntimeSource,
      },
    };
  }

  // The last count of exportable workflows, by the documents it was built from
  private mcpCount: { doc: any; spec: any; sources: any; count: number } | null = null;

  /** How many workflows the export would have; 0 hides the button. */
  private get mcpWorkflowCount(): number {
    const input = this.mcpExportInput();
    if (!input) return 0;
    const cached = this.mcpCount;
    if (
      cached?.doc === this.doc &&
      cached.spec === input.spec &&
      cached.sources === this.specObjects
    )
      return cached.count;
    let count = 0;
    try {
      count = buildMcpManifest(input.spec, input.options).tools.length;
    } catch {
      count = 0;
    }
    this.mcpCount = { doc: this.doc, spec: input.spec, sources: this.specObjects, count };
    return count;
  }

  /**
   * Builds the MCP server of the document's workflows: <span class="mono fg-color">{ manifest,
   * files, budget, hostConfig, problems }</span>, as <span class="mono
   * fg-color">&lt;rapi-doc&gt;</span>'s <span class="mono fg-color">generateMcpServer</span>, with
   * one tool per workflow the runtime can run and none per operation; <span class="mono
   * fg-color">problems</span> says why a workflow was left out. Null until the document and its
   * first source are loaded.
   * @public
   */
  generateMcpServer() {
    const input = this.mcpExportInput();
    return input ? generateMcpServer(input.spec, input.options) : null;
  }

  /**
   * Downloads that server as <span class="mono fg-color">&lt;server-name&gt;-mcp.zip</span>.
   * @public
   */
  downloadMcpServer() {
    const result = this.generateMcpServer();
    if (!result) return;
    const blob = new Blob([createZip(result.files)], { type: "application/zip" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${result.manifest.server.name.replace(/_/g, "-")}-mcp.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  /** The box that loads an Arazzo document by URL (allow-arazzo-url-load). */
  private renderUrlBox() {
    // Without the box, the document's URL as text, so a reader knows what is drawn
    if (this.allowArazzoUrlLoad !== "true") {
      return this.arazzoUrl
        ? html`<p class="flow-source" part="url">Arazzo <span class="flow-source-url">${this.arazzoUrl}</span></p>`
        : nothing;
    }
    const submit = (e: Event) => {
      e.preventDefault();
      const input = (e.target as HTMLFormElement).querySelector("input");
      const url = input?.value.trim();
      if (!url) return;
      this.beforeBoxLoad = {
        arazzoUrl: this.arazzoUrl,
        workflowId: this.workflowId,
        specUrl: this.specUrl,
      };
      this.boxError = "";
      this.followArazzo = true;
      this.workflowId = "";
      // A page's spec-url belonged to the previous document
      this.specUrl = "";
      if (url === this.arazzoUrl) this.load();
      else this.arazzoUrl = url;
    };
    return html`<form class="flow-url" part="url-form" @submit=${submit}>
      <input
        type="text"
        name="arazzo-url"
        part="url-input"
        autocomplete="off"
        aria-label="Arazzo document URL"
        placeholder="Arazzo document URL (YAML or JSON)"
        spellcheck="false"
        .value=${this.boxValue ?? this.arazzoUrl}
        @input=${() => (this.boxError = "")}
      />
      <button type="submit" class="btn btn-outline" part="url-load" ?disabled=${this.loading}>Load</button>
    </form>
    ${this.boxError ? html`<p class="flow-url-error" part="url-error" role="alert">${this.boxError}</p>` : nothing}`;
  }

  render() {
    return html`${this.renderUrlBox()}${this.renderBody()}`;
  }

  private renderBody() {
    if (this.loadError) {
      return html`<p class="flow-message" part="message">Could not load the workflows: ${this.loadError}</p>`;
    }
    if (!this.doc) {
      return this.loading
        ? html`<p class="flow-message" part="message">Loading workflows…</p>`
        : nothing;
    }
    const graph = this.graph;
    const ids = this.workflowIds;
    const view = this.view === "compact" ? "compact" : "expanded";
    // The selected step and, during a run, the step whose request is in flight, as box classes
    const stepClasses: Record<string, string[]> = {};
    const mark = (id: string, cls: string) =>
      id && (stepClasses[id] = [...(stepClasses[id] || []), cls]);
    mark(this.selectedStepId, "rf-selected");
    mark(this.runningStepId, "rf-running");
    const diagram = renderFlowDiagram(graph, {
      view,
      idPrefix: this.idPrefix,
      interactive: true,
      stepClasses,
      // Shrink to fit the pane down to 85%, so the text stays readable; past that, scroll
      minScale: 0.85,
    });
    // Only problems a reader can't miss; the graph's authoring warnings are left to tooling
    const shown = this.problems.filter(
      (p) => p.level === "error" || p.path.startsWith("sourceDescriptions"),
    );
    return html`
      ${
        graph
          ? html`<div class="flow-header" part="header">
              <div class="flow-toolbar">
                ${
                  // Which workflow: the picker when there are several (it shows the id), else the id;
                  // the id is the title when the workflow has no summary
                  ids.length > 1
                    ? html`<select
                      part="select"
                      aria-label="Workflow"
                      .value=${graph.workflowId}
                      @change=${(e) => {
                        this.workflowId = e.target.value;
                        this.selectedStepId = "";
                        this.resetRun();
                      }}
                    >
                      ${ids.map((id) => html`<option value=${id} ?selected=${id === graph.workflowId}>${id}</option>`)}
                    </select>`
                    : graph.summary
                      ? html`<span class="flow-id">${graph.workflowId}</span>`
                      : nothing
                }
                ${
                  graph.summary
                    ? nothing
                    : html`<h2 class="flow-title" part="title">${graph.workflowId}</h2>`
                }
                <div class="flow-controls">
                  ${
                    this.mcp === "true" && this.mcpWorkflowCount > 0
                      ? html`<button
                          type="button"
                          class="btn btn-outline"
                          part="mcp-export"
                          title="Download an MCP server with one tool per workflow of this document"
                          @click=${() => this.downloadMcpServer()}
                        >
                          Export MCP Server
                        </button>`
                      : nothing
                  }
                  ${this.renderViewToggle()}
                </div>
              </div>
              ${graph.summary ? html`<h2 class="flow-title" part="title">${graph.summary}</h2>` : nothing}
              ${
                graph.description
                  ? html`<p class="flow-description" part="description">${graph.description}</p>`
                  : nothing
              }
            </div>
            <div class="flow-diagram" part="diagram" @click=${this.onDiagramEvent} @keydown=${this.onDiagramEvent} @mouseover=${this.onDiagramHover} @mouseleave=${this.onDiagramHover}>
              ${unsafeSVG(diagram.svg)}
            </div>
            ${this.renderRun(graph)}
`
          : html`<p class="flow-message" part="message">No workflow to show.</p>`
      }
      ${
        shown.length
          ? html`<ul class="flow-problems" part="problems">
            ${shown.map(
              (p) =>
                html`<li class=${p.level}>${p.path ? html`<code>${p.path}</code> ` : nothing}${p.message}</li>`,
            )}
          </ul>`
          : nothing
      }
    `;
  }
}
