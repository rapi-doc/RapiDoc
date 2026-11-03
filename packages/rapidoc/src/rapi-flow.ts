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
import {
  parseDocument,
  validateArazzo,
  indexOperations,
  buildFlowGraph,
  renderFlowDiagram,
  escapeXml,
  actionLabel,
  actionSentence,
  describeAction,
} from "~/utils/arazzo/index.js";

/** A value from an Arazzo document as display text: strings as is, anything else as JSON. */
function valueText(value) {
  if (value === undefined) return "";
  return typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

/** An action as one line: "✗ retry 3× after 1s if $statusCode == 503". */
function actionText(action) {
  return `${actionLabel(action).slice(0, 1)} ${actionSentence(action)}`;
}

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
  // "false" hides the inputs, outputs and step details under the diagram
  @property({ type: String, attribute: "show-docs" }) showDocs = "true";
  // "expanded" shows each step's inputs and actions in its box; "compact" only the operation
  @property({ type: String, reflect: true }) view = "expanded";
  // "false" hides the Compact / Expanded switch
  @property({ type: String, attribute: "show-view-toggle" }) showViewToggle = "true";

  @state() private doc: any = null;
  @state() private sources: Map<string, any> = new Map();
  @state() private problems: any[] = [];
  @state() private loading = false;
  @state() private loadError = "";
  @state() private selectedStepId = "";
  @state() private openSteps: Set<string> = new Set();

  private loadId = 0;
  private idPrefix = `rf${++instanceCount}`;
  _autoColorScheme = new AutoColorSchemeController(this);

  static styles = [
    ThemeTokens,
    FlowStyles,
    css`
      :host {
        display: block;
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
      .flow-problems .warning {
        color: var(--muted-foreground);
      }
      code,
      pre {
        font-family: var(--font-mono);
        font-size: var(--font-size-small);
      }
      .flow-every-step {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.375rem;
        margin: 0 0 0.75rem;
        font-size: var(--font-size-small);
        color: var(--muted-foreground);
      }
      .pill {
        display: inline-block;
        padding: 0 0.5rem;
        border: 1px solid var(--border);
        border-radius: 999px;
        font-size: var(--font-size-xs);
        line-height: 1.6;
        color: var(--foreground);
        white-space: nowrap;
      }
      .pill.success {
        border-color: var(--green);
      }
      .pill.failure {
        border-color: var(--destructive);
      }
      .pill.inherited {
        border-style: dashed;
      }
      .flow-legend {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem 1rem;
        margin: 0.5rem 0 0;
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
      .flow-docs {
        margin-top: 1.5rem;
      }
      .flow-docs h3 {
        margin: 1.25rem 0 0.5rem;
        font-size: var(--h5-font-size);
        font-weight: var(--heading-weight);
        color: var(--heading-color);
      }
      .flow-docs h4 {
        margin: 0.75rem 0 0.25rem;
        font-size: var(--font-size-small);
        font-weight: var(--heading-weight);
        color: var(--muted-foreground);
      }
      .flow-docs table {
        width: 100%;
        border-collapse: collapse;
        font-size: var(--font-size-description);
      }
      .flow-docs th,
      .flow-docs td {
        padding: 0.375rem 0.5rem;
        border-bottom: 1px solid var(--border);
        text-align: left;
        vertical-align: top;
      }
      .flow-docs th {
        font-size: var(--font-size-xs);
        font-weight: 600;
        color: var(--muted-foreground);
      }
      .flow-docs td code {
        word-break: break-word;
      }
      .flow-docs td.name code {
        white-space: nowrap;
        word-break: normal;
      }
      .flow-docs .muted,
      .flow-docs .empty {
        color: var(--muted-foreground);
      }
      .required {
        color: var(--destructive);
        font-size: var(--font-size-xs);
        font-weight: 600;
      }
      details.step {
        border: 1px solid var(--border);
        border-radius: var(--radius);
        margin-bottom: 0.5rem;
        background: var(--card);
      }
      details.step[open] {
        padding-bottom: 0.5rem;
      }
      details.step.selected {
        border-color: var(--primary);
      }
      details.step summary {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 0.25rem 0.75rem;
        padding: 0.5rem 0.75rem;
        cursor: pointer;
      }
      details.step summary .step-id {
        font-weight: 600;
      }
      details.step summary .step-op {
        font-family: var(--font-mono);
        font-size: var(--font-size-small);
        color: var(--muted-foreground);
      }
      details.step .step-body {
        padding: 0 0.75rem;
      }
      details.step pre {
        margin: 0;
        padding: 0.5rem;
        overflow-x: auto;
        background: var(--muted);
        border-radius: var(--radius);
      }
      .method {
        font-weight: 700;
      }
      .method-get { color: var(--method-get); }
      .method-post { color: var(--method-post); }
      .method-put { color: var(--method-put); }
      .method-delete { color: var(--method-delete); }
      .method-patch { color: var(--method-patch); }
      ul.plain {
        margin: 0;
        padding-left: 1.25rem;
        font-size: var(--font-size-description);
      }
      ul.plain li {
        margin: 0.125rem 0;
      }
      .tag {
        margin-left: 0.25rem;
        padding: 0 0.375rem;
        border: 1px solid var(--border);
        border-radius: var(--radius);
        font-size: var(--font-size-xs);
        color: var(--muted-foreground);
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
  }

  updated(changed) {
    if (changed.has("theme")) {
      const normalized = normalizeTheme(this.theme).theme;
      if (normalized !== this.theme) this.theme = normalized;
      applyCustomTheme(this, this.theme);
    }
    if (changed.has("arazzoUrl") || changed.has("specUrl")) this.load();
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
      const problems = validateArazzo(doc);
      const sources = new Map();
      const openapiSources = (doc.sourceDescriptions || []).filter(
        (s) => s?.name && s?.url && (!s.type || s.type === "openapi"),
      );
      await Promise.all(
        openapiSources.map(async (s, i) => {
          const url = i === 0 && this.specUrl ? this.specUrl : s.url;
          try {
            const text = await this.fetchText(
              new URL(url, i === 0 && this.specUrl ? document.baseURI : arazzoUrl).href,
            );
            sources.set(s.name, indexOperations(parseDocument(text)));
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
      this.problems = problems;
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

  private get workflowIds(): string[] {
    return (this.doc?.workflows || []).map((w) => w?.workflowId).filter(Boolean);
  }

  private get graph() {
    if (!this.doc) return null;
    const ids = this.workflowIds;
    const wanted = ids.includes(this.workflowId) ? this.workflowId : ids[0];
    return buildFlowGraph(this.doc, wanted, { sources: this.sources });
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
    this.openSteps = new Set([...this.openSteps, stepId]);
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
    const el = (e.target as Element)?.closest?.(".rf-clickable");
    if (!el) return;
    e.preventDefault();
    this.selectStep(el.getAttribute("data-step-id") || "");
  }

  private renderWorkflowActions(graph) {
    if (!graph.workflowActions.length) return nothing;
    return html`<div class="flow-every-step" part="workflow-actions">
      <span>Every step:</span>
      ${graph.workflowActions.map(
        (a) => html`<span class="pill ${a.outcome}">${actionText(a)}</span>`,
      )}
    </div>`;
  }

  private setView(view: string) {
    if (view === this.view) return;
    this.view = view;
    this.dispatchEvent(
      new CustomEvent("view-change", { detail: { view }, bubbles: true, composed: true }),
    );
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
      action: html`<span class="pill success">✓</span><span class="pill failure">✗</span>action on success / failure`,
    };
    return html`<ul class="flow-legend" part="legend" aria-label="Legend">
      ${kinds.map((k) => html`<li>${entries[k]}</li>`)}
    </ul>`;
  }

  private renderDocs(graph) {
    return html`<section class="flow-docs" part="docs">
      <h3>Inputs</h3>
      ${
        graph.inputDetails.length
          ? html`<table part="inputs">
              <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                ${graph.inputDetails.map(
                  (i) => html`<tr>
                    <td class="name"><code>${i.name}</code>${i.required ? html` <span class="required">required</span>` : nothing}</td>
                    <td>${i.type}${i.format ? html` <span class="muted">(${i.format})</span>` : nothing}</td>
                    <td>${i.default !== undefined ? html`<code>${valueText(i.default)}</code>` : nothing}</td>
                    <td>
                      ${i.description}
                      ${
                        i.enum
                          ? html`<div class="muted">One of ${i.enum.map((v, n) => html`${n ? ", " : ""}<code>${valueText(v)}</code>`)}</div>`
                          : nothing
                      }
                    </td>
                  </tr>`,
                )}
              </tbody>
            </table>`
          : html`<p class="empty">No inputs.</p>`
      }
      <h3>Outputs</h3>
      ${
        graph.outputs.length
          ? html`<table part="outputs">
              <thead><tr><th>Name</th><th>From step</th><th>Value</th></tr></thead>
              <tbody>
                ${graph.outputs.map((o) => {
                  // "$steps.<id>.outputs.<name>" reads better as the step's output name
                  const m = o.expr.match(/^\$steps\.([A-Za-z0-9_-]+)\.outputs\.([A-Za-z0-9_-]+)$/);
                  return html`<tr>
                    <td class="name"><code>${o.name}</code></td>
                    <td>${o.stepId}</td>
                    <td><code title=${o.expr}>${m ? `outputs.${m[2]}` : o.expr}</code></td>
                  </tr>`;
                })}
              </tbody>
            </table>`
          : html`<p class="empty">No outputs.</p>`
      }
      <h3>Steps</h3>
      ${graph.steps.map((s, n) => this.renderStepDetails(s, n))}
    </section>`;
  }

  private renderStepDetails(step, n) {
    const op = step.operation;
    const toggle = (e) => {
      const open = new Set(this.openSteps);
      if (e.target.open) open.add(step.stepId);
      else open.delete(step.stepId);
      this.openSteps = open;
    };
    return html`<details
      class="step ${this.selectedStepId === step.stepId ? "selected" : ""}"
      part="step"
      data-step-id=${step.stepId}
      ?open=${this.openSteps.has(step.stepId)}
      @toggle=${toggle}
    >
      <summary>
        <span class="step-id">${n + 1}. ${step.stepId}</span>
        ${
          op
            ? html`<span class="step-op"><span class="method method-${op.method}">${op.method.toUpperCase()}</span> ${op.path}</span>`
            : html`<span class="step-op">${step.kind === "workflow" ? `workflow ${step.workflowId}` : step.operationRef}</span>`
        }
      </summary>
      <div class="step-body">
        ${step.description ? html`<p>${step.description}</p>` : nothing}
        ${op?.operationId ? html`<p class="muted">Operation <code>${op.operationId}</code>${op.summary ? html` · ${op.summary}` : nothing}</p>` : nothing}
        ${
          step.parameters.length
            ? html`<h4>Parameters</h4>
              <table>
                <thead><tr><th>Name</th><th>In</th><th>Value</th></tr></thead>
                <tbody>
                  ${step.parameters.map(
                    (p) =>
                      html`<tr><td class="name"><code>${p.name}</code></td><td>${p.in}</td><td><code>${valueText(p.value)}</code></td></tr>`,
                  )}
                </tbody>
              </table>`
            : nothing
        }
        ${
          step.requestBody
            ? html`<h4>Request body${step.requestBody.contentType ? html` <span class="muted">${step.requestBody.contentType}</span>` : nothing}</h4>
              <pre>${valueText(step.requestBody.payload)}</pre>
              ${
                step.requestBody.replacements?.length
                  ? html`<ul class="plain">
                      ${step.requestBody.replacements.map(
                        (r) =>
                          html`<li><code>${r.target}</code> ← <code>${valueText(r.value)}</code></li>`,
                      )}
                    </ul>`
                  : nothing
              }`
            : nothing
        }
        ${
          step.criteria.length
            ? html`<h4>Success criteria</h4>
              <ul class="plain">
                ${step.criteria.map(
                  (c) => html`<li>
                    <code>${c.condition}</code>
                    ${c.type !== "simple" ? html`<span class="muted">(${c.type}${c.context ? ` on ${c.context}` : ""})</span>` : nothing}
                  </li>`,
                )}
              </ul>`
            : nothing
        }
        ${
          step.outputExprs.length
            ? html`<h4>Outputs</h4>
              <table>
                <thead><tr><th>Name</th><th>Expression</th></tr></thead>
                <tbody>
                  ${step.outputExprs.map(
                    (o) =>
                      html`<tr><td class="name"><code>${o.name}</code></td><td><code>${valueText(o.expr)}</code></td></tr>`,
                  )}
                </tbody>
              </table>`
            : nothing
        }
        ${["success", "failure"].map((outcome) => {
          const actions = step.actions.filter((a) => a.outcome === outcome);
          if (!actions.length) return nothing;
          return html`<h4>On ${outcome}</h4>
            <ul class="plain">
              ${actions.map((a) => {
                const d = describeAction(a);
                return html`<li
                  class=${a.shadowed ? "muted" : ""}
                  title=${a.shadowed ? "Never runs: an earlier action without criteria always matches first" : nothing}
                >
                  ${a.criteria.length ? html`<code>${d.when}</code>` : d.when} → ${d.does}
                  ${d.tag ? html`<span class="tag">${d.tag}</span>` : nothing}
                  ${a.shadowed ? html`<span class="muted">(never runs)</span>` : nothing}
                </li>`;
              })}
            </ul>`;
        })}
      </div>
    </details>`;
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
    if (this.selectedStepId) {
      const stepId = escapeXml(this.selectedStepId);
      svg = svg.replace(
        `class="rf-node rf-step rf-clickable" data-step-id="${stepId}"`,
        `class="rf-node rf-step rf-clickable rf-selected" data-step-id="${stepId}"`,
      );
    }
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
                      this.openSteps = new Set();
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
            ${view === "compact" ? this.renderWorkflowActions(graph) : nothing}
            <div class="flow-diagram" part="diagram" @click=${this.onDiagramEvent} @keydown=${this.onDiagramEvent}>
              ${unsafeSVG(svg)}
            </div>
            ${this.renderLegend(diagram.legend)}
            ${this.showDocs === "false" ? nothing : this.renderDocs(graph)}`
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
