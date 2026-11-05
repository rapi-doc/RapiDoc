import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";

import ThemeTokens, {
  DEFAULT_THEME,
  applyCustomTheme,
  normalizeTheme,
} from "~/styles/theme-tokens";
import FlowStyles from "~/styles/flow-styles";
import { AutoColorSchemeController } from "~/utils/auto-color-scheme";
import workflowRuntimeSource from "~/utils/mcp/workflow-runtime.js?raw";
import {
  parseDocument,
  validateArazzo,
  indexOperations,
  indexResolvedSpec,
  buildFlowGraph,
  renderFlowDiagram,
  escapeXml,
} from "~/utils/arazzo/index.js";
import { buildMcpManifest } from "~/utils/mcp/manifest.js";
import { createMcpWorkflowRuntime } from "~/utils/mcp/workflow-runtime.js";

let instanceCount = 0;

/**
 * <rapi-flow>: draws the workflows of an Arazzo document. Display only; it calls no API.
 */
@customElement("rapi-flow")
export default class RapiFlow extends LitElement {
  @property({ type: String, attribute: "arazzo-url" }) arazzoUrl = "";
  // Replaces the URL of the first OpenAPI source description
  @property({ type: String, attribute: "spec-url" }) specUrl = "";
  @property({ type: String, attribute: "workflow-id" }) workflowId = "";
  // id of a <rapi-doc> on the same page; clicking a step scrolls it to the operation
  @property({ type: String, attribute: "for" }) for = "";
  @property({ type: String, reflect: true }) theme = DEFAULT_THEME;
  @property({ type: String, attribute: "color-scheme", reflect: true }) colorScheme = "dark";
  // "expanded" shows each step's inputs and actions in its box; "compact" only the operation
  @property({ type: String, reflect: true }) view = "expanded";
  // "false" hides the Compact / Expanded switch
  @property({ type: String, attribute: "show-view-toggle" }) showViewToggle = "true";
  // "false" hides the Run button
  @property({ type: String, attribute: "allow-run" }) allowRun = "true";
  // Base URL the run sends requests to, instead of the server a tied <rapi-doc> selected or the spec's
  @property({ type: String, attribute: "server-url" }) serverUrl = "";

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
  // Status codes the tied <rapi-doc>'s in-browser mock answers with during a run ("" = its own)
  @state() private mockStatus = "";
  @state() private mockStrategy = "cycle";
  @state() private runningStepId = "";
  @state() private trace: any[] = [];
  @state() private runResult: any = null;
  @state() private runProblem = "";

  private loadId = 0;
  // The <rapi-doc> named by `for` while it supplies the first OpenAPI source (no spec-url)
  private specDoc: any = null;
  private onSpecLoaded = () => this.useRapiDocSpec();
  // Step whose box, lines and output rows are highlighted while the pointer is over one of them
  private linkedStepId = "";
  private idPrefix = `rf${++instanceCount}`;
  _autoColorScheme = new AutoColorSchemeController(this);

  static styles = [
    ThemeTokens,
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
      .flow-header {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 0.5rem 1rem;
        margin-bottom: 0.25rem;
      }
      .flow-title {
        margin: 0;
        font-size: var(--h4-font-size);
        font-weight: var(--heading-weight);
        color: var(--heading-color);
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
      .view-toggle {
        display: inline-flex;
        border: 1px solid var(--input);
        border-radius: var(--radius);
        overflow: hidden;
      }
      .view-toggle button {
        font: inherit;
        font-size: var(--font-size-small);
        color: var(--muted-foreground);
        background: var(--input-background);
        border: 0;
        padding: 0.25rem 0.625rem;
        cursor: pointer;
      }
      .view-toggle button + button {
        border-left: 1px solid var(--input);
      }
      .view-toggle button[aria-pressed="true"] {
        color: var(--primary-foreground);
        background: var(--primary);
      }
      .view-toggle button:focus-visible {
        outline: 2px solid var(--ring);
        outline-offset: -2px;
      }
      select {
        font: inherit;
        font-size: var(--font-size-small);
        color: var(--foreground);
        background: var(--input-background);
        border: 1px solid var(--input);
        border-radius: var(--radius);
        padding: 0.25rem 0.5rem;
      }
      .flow-description {
        margin: 0 0 0.75rem;
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
      .run-button {
        font: inherit;
        font-size: var(--font-size-small);
        color: var(--primary-foreground);
        background: var(--primary);
        border: 1px solid var(--primary);
        border-radius: var(--radius);
        padding: 0.25rem 0.75rem;
        cursor: pointer;
      }
      .run-button:disabled {
        opacity: 0.6;
        cursor: default;
      }
      .run-clear {
        font: inherit;
        font-size: var(--font-size-small);
        color: var(--muted-foreground);
        background: var(--input-background);
        border: 1px solid var(--input);
        border-radius: var(--radius);
        padding: 0.25rem 0.75rem;
        cursor: pointer;
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
      .required {
        color: var(--destructive);
        font-size: var(--font-size-xs);
        font-weight: 600;
      }
      .run-inputs {
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
      .run-inputs label {
        display: grid;
        grid-template-columns: minmax(8rem, 14rem) 1fr;
        gap: 0.25rem 1rem;
        align-items: center;
        margin: 0.375rem 0;
      }
      .run-input-name {
        display: flex;
        flex-wrap: wrap;
        gap: 0.375rem;
        align-items: baseline;
      }
      .run-inputs input,
      .run-inputs select {
        font: inherit;
        font-size: var(--font-size-small);
        color: var(--foreground);
        background: var(--input-background);
        border: 1px solid var(--input);
        border-radius: var(--radius);
        padding: 0.25rem 0.5rem;
        min-width: 0;
      }
      .run-mock-fields {
        display: flex;
        gap: 0.5rem;
      }
      .run-mock-fields input {
        flex: 1;
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
        padding: 0.375rem 0.75rem;
        cursor: pointer;
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
      .flow-legend {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem 1rem;
        margin: 0.75rem 0 0;
        padding: 0;
        list-style: none;
        font-size: var(--font-size-xs);
        color: var(--muted-foreground);
      }
      .flow-legend li {
        display: flex;
        align-items: center;
        gap: 0.375rem;
      }
      .flow-legend svg {
        overflow: visible;
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
    this.specDoc?.removeEventListener("spec-loaded", this.onSpecLoaded);
    this.specDoc = null;
  }

  updated(changed) {
    if (changed.has("theme")) {
      const normalized = normalizeTheme(this.theme).theme;
      if (normalized !== this.theme) this.theme = normalized;
      applyCustomTheme(this, this.theme);
    }
    if (changed.has("arazzoUrl") || changed.has("specUrl") || changed.has("for")) this.load();
    // A redrawn diagram has lost the highlight classes
    this.linkedStepId = "";
  }

  /** Loads the Arazzo document and its OpenAPI sources. Fires `flow-loaded` when done. */
  async load() {
    const id = ++this.loadId;
    if (!this.arazzoUrl) {
      this.doc = null;
      return;
    }
    this.loading = true;
    this.loadError = "";
    try {
      const arazzoUrl = new URL(this.arazzoUrl, document.baseURI).href;
      const doc = parseDocument(await this.fetchText(arazzoUrl));
      // With `for` and no spec-url, the first OpenAPI source is the spec <rapi-doc> loads
      this.watchRapiDoc();
      const problems = validateArazzo(doc);
      const sources = new Map();
      const specObjects = new Map();
      const openapiSources = (doc.sourceDescriptions || []).filter(
        (s) => s?.name && s?.url && (!s.type || s.type === "openapi"),
      );
      await Promise.all(
        openapiSources.map(async (s, i) => {
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
      this.doc = doc;
      this.sources = sources;
      this.specObjects = specObjects;
      this.problems = problems;
      this.resetRun();
      this.useRapiDocSpec();
      this.dispatchEvent(
        new CustomEvent("flow-loaded", {
          detail: { doc, problems },
          bubbles: true,
          composed: true,
        }),
      );
    } catch (err) {
      if (id !== this.loadId) return;
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
  }

  /**
   * Indexes the spec the <rapi-doc> has processed as the first OpenAPI source. Runs after a load
   * and on each `spec-loaded`, since <rapi-doc> often finishes after <rapi-flow>. Until then,
   * steps of that source show their operationId.
   */
  private useRapiDocSpec() {
    const first = (this.doc?.sourceDescriptions || []).find(
      (s) => s?.name && s?.url && (!s.type || s.type === "openapi"),
    );
    const spec = this.specDoc?.resolvedSpec;
    if (!first || !spec) return;
    this.sources = new Map(this.sources).set(first.name, indexResolvedSpec(spec));
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
    this.dispatchEvent(
      new CustomEvent("step-click", {
        detail: {
          workflowId: graph.workflowId,
          stepId,
          operation: op,
          workflowRef: step.workflowId,
        },
        bubbles: true,
        composed: true,
      }),
    );
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
   * Highlights the step under the pointer together with its value lines and its rows in the
   * outputs box (or, from an output row, the step it comes from). The diagram is an SVG string,
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
    this.view = view;
    this.dispatchEvent(
      new CustomEvent("view-change", { detail: { view }, bubbles: true, composed: true }),
    );
  }

  /** Back to the form, with the shown workflow's input defaults filled in. */
  private resetRun() {
    this.runState = "idle";
    this.runningStepId = "";
    this.trace = [];
    this.runResult = null;
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
    const first = (this.doc.sourceDescriptions || []).find(
      (s) => s?.name && (!s.type || s.type === "openapi"),
    );
    const spec = this.specDoc?.resolvedSpec || this.specObjects.get(first?.name);
    if (!spec) return { problem: "the OpenAPI document of the first source is not loaded" };
    const problems = [];
    const manifest = buildMcpManifest(spec, {
      arazzo: this.doc,
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
      credentials: this.credentialsFromRapiDoc(rapiDoc),
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
    this.runProblem = "";
    if (!prepared.runtime) {
      this.runProblem = prepared.problem;
      this.runState = "done";
      return;
    }
    const inputs = this.coerceInputs(graph);
    this.runState = "running";
    // The in-browser mock reads its status codes from the <rapi-doc>; set them for this run only
    const rapiDoc = this.findRapiDoc();
    const mocked = rapiDoc?.mockServer === "true";
    const codes = this.mockStatus.trim();
    const previous = mocked &&
      codes && {
        code: rapiDoc.mockServerStatusCode,
        strategy: rapiDoc.mockServerStatusStrategy,
      };
    if (previous) {
      rapiDoc.mockServerStatusCode = codes;
      rapiDoc.mockServerStatusStrategy = codes.includes(",") ? this.mockStrategy : "first";
      await rapiDoc.updateComplete;
    }
    const result = await prepared.runtime.callTool(prepared.tool.name, inputs, {
      onStepStart: (e) => (this.runningStepId = e.stepId),
      onStep: (e) => {
        this.runningStepId = "";
        this.trace = [...this.trace, { ...e, mocked }];
      },
    });
    if (previous) {
      rapiDoc.mockServerStatusCode = previous.code;
      rapiDoc.mockServerStatusStrategy = previous.strategy;
    }
    this.runResult = result;
    this.runState = "done";
    this.dispatchEvent(
      new CustomEvent("workflow-run", {
        detail: { workflowId: graph.workflowId, inputs, result, trace: this.trace },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private renderInputsForm(graph) {
    const set = (name, value) => (this.runInputs = { ...this.runInputs, [name]: value });
    const running = this.runState === "running";
    return html`<form
      class="run-inputs"
      part="run-inputs"
      @submit=${(e) => {
        e.preventDefault();
        if (!running) this.executeRun(graph);
      }}
    >
      ${graph.inputDetails.length ? html`<h3>Inputs</h3>` : html`<p class="muted">This workflow takes no inputs.</p>`}
      ${graph.inputDetails.map(
        (i) => html`<label>
          <span class="run-input-name">
            <code>${i.name}</code>
            ${i.required ? html`<span class="required">required</span>` : nothing}
            <span class="muted">${i.type}</span>
          </span>
          ${
            i.enum
              ? html`<select name=${i.name} @change=${(e) => set(i.name, e.target.value)}>
                  <option value="" ?selected=${!this.runInputs[i.name]}></option>
                  ${i.enum.map(
                    (v) =>
                      html`<option value=${String(v)} ?selected=${String(v) === this.runInputs[i.name]}>${String(v)}</option>`,
                  )}
                </select>`
              : html`<input
                  name=${i.name}
                  .value=${this.runInputs[i.name] ?? ""}
                  placeholder=${i.description || ""}
                  ?required=${i.required}
                  @input=${(e) => set(i.name, e.target.value)}
                />`
          }
        </label>`,
      )}
      ${
        this.findRapiDoc()?.mockServer === "true"
          ? html`<label class="run-mock">
              <span class="run-input-name">
                Mock status
                <span class="muted">the in-browser mock answers with</span>
              </span>
              <span class="run-mock-fields">
                <input
                  name="mock-status"
                  .value=${this.mockStatus}
                  placeholder="the spec's example; or 503; or 200, 200, 503"
                  @input=${(e) => (this.mockStatus = e.target.value)}
                />
                ${
                  this.mockStatus.includes(",")
                    ? html`<select
                        aria-label="How the codes are used"
                        @change=${(e) => (this.mockStrategy = e.target.value)}
                      >
                        <option value="cycle" ?selected=${this.mockStrategy === "cycle"}>in turn</option>
                        <option value="random" ?selected=${this.mockStrategy === "random"}>at random</option>
                      </select>`
                    : nothing
                }
              </span>
            </label>`
          : nothing
      }
      <div class="run-actions">
        <button type="submit" class="run-button" part="run-button" ?disabled=${running}>
          ${running ? "Running…" : "▶ Run workflow"}
        </button>
        ${this.runState === "done" ? html`<button type="button" class="run-clear" @click=${() => this.resetRun()}>Clear</button>` : nothing}
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
      html`<button type="button" aria-pressed=${current === view ? "true" : "false"} @click=${() => this.setView(view)}>${label}</button>`;
    return html`<div class="view-toggle" part="view-toggle" role="group" aria-label="Diagram view">
      ${button("compact", "Compact")}${button("expanded", "Expanded")}
    </div>`;
  }

  /** Lists only the kinds of lines the diagram drew. */
  private renderLegend(kinds: string[]) {
    if (!kinds.length) return nothing;
    const line = (cls, head, dashed = false) =>
      html`<svg width="28" height="10" aria-hidden="true"><path class=${cls} d="M1 5H23" stroke-dasharray=${dashed ? "5 4" : "none"}/><path class="rf-head-${head}" d="M22 1L28 5L22 9z"/></svg>`;
    const entries = {
      seq: html`${line("rf-seq", "seq")}next step`,
      data: html`${line("rf-data", "data", true)}value passed to a later step`,
      output: html`${line("rf-data rf-to-output", "output", true)}value passed to the outputs`,
      success: html`${line("rf-goto rf-success", "success")}goto on success`,
      failure: html`${line("rf-goto rf-failure", "failure")}goto on failure`,
    };
    return html`<ul class="flow-legend" part="legend" aria-label="Legend">
      ${kinds.map((k) => html`<li>${entries[k]}</li>`)}
    </ul>`;
  }

  render() {
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
    const diagram = renderFlowDiagram(graph, {
      view,
      idPrefix: this.idPrefix,
      interactive: true,
    });
    let svg = diagram.svg;
    // The selected step and, during a run, the step whose request is in flight, as box classes
    const extraClasses = new Map<string, string[]>();
    if (this.selectedStepId) extraClasses.set(this.selectedStepId, ["rf-selected"]);
    if (this.runningStepId) {
      extraClasses.set(this.runningStepId, [
        ...(extraClasses.get(this.runningStepId) || []),
        "rf-running",
      ]);
    }
    for (const [id, classes] of extraClasses) {
      const stepId = escapeXml(id).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      svg = svg.replace(
        new RegExp(`class="rf-node rf-step( rf-clickable)?" data-step-id="${stepId}"`),
        (_, clickable) =>
          `class="rf-node rf-step${clickable || ""} ${classes.join(" ")}" data-step-id="${escapeXml(id)}"`,
      );
    }
    // Only problems a reader can't miss; the graph's authoring warnings are left to tooling
    const shown = this.problems.filter(
      (p) => p.level === "error" || p.path.startsWith("sourceDescriptions"),
    );
    return html`
      ${
        graph
          ? html`<div class="flow-header" part="header">
              <h2 class="flow-title" part="title">${graph.summary || graph.workflowId}</h2>
              ${graph.summary ? html`<span class="flow-id">${graph.workflowId}</span>` : nothing}
              <div class="flow-controls">
              ${
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
                  : nothing
              }
              ${this.renderViewToggle()}
              </div>
            </div>
            ${
              graph.description
                ? html`<p class="flow-description" part="description">${graph.description}</p>`
                : nothing
            }
            <div class="flow-diagram" part="diagram" @click=${this.onDiagramEvent} @keydown=${this.onDiagramEvent} @mouseover=${this.onDiagramHover} @mouseleave=${this.onDiagramHover}>
              ${unsafeSVG(svg)}
            </div>
            ${this.renderLegend(diagram.legend)}
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
