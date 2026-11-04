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
  indexResolvedSpec,
  buildFlowGraph,
  renderFlowDiagram,
  escapeXml,
} from "~/utils/arazzo/index.js";

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

  @state() private doc: any = null;
  @state() private sources: Map<string, any> = new Map();
  @state() private problems: any[] = [];
  @state() private loading = false;
  @state() private loadError = "";
  @state() private selectedStepId = "";

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
    if (this.selectedStepId) {
      const stepId = escapeXml(this.selectedStepId);
      svg = svg.replace(
        `class="rf-node rf-step rf-clickable" data-step-id="${stepId}"`,
        `class="rf-node rf-step rf-clickable rf-selected" data-step-id="${stepId}"`,
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
