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
import { pickStatusCode } from "~/utils/status-codes.js";
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

/** The OpenAPI source descriptions of an Arazzo spec that can be loaded, in order. */
const openapiSources = (doc): any[] =>
  (doc?.sourceDescriptions || []).filter(
    (s) => s?.name && s?.url && (!s.type || s.type === "openapi"),
  );

/**
 * `<rapi-flow>`: draws the workflows of an Arazzo spec and can run them. Its doc comments are
 * read like those of `<rapi-doc>` (see the class comment in rapidoc.ts) into the custom elements
 * manifest and the types in dist/.
 *
 * @fires flow-loaded - The Arazzo spec and its sources are loaded. <span class="mono
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
 * @slot header - Markup shown at the top, above the Arazzo spec card: a logo, a title, or
 * controls such as a mock / real server switch. It stays in the page's DOM, so page styles and
 * scripts reach it.
 * @slot footer - Markup shown at the bottom, below the run panel: links, notes, or legal text.
 */
@customElement("rapi-flow")
export default class RapiFlow extends LitElement {
  /**
   * URL of the Arazzo spec (Arazzo 1.x), YAML or JSON.
   * @group Workflow
   */
  @property({ type: String, attribute: "arazzo-url" })
  arazzoUrl = "";
  /**
   * Replaces the URL of the first OpenAPI source description. Other sources are fetched relative to
   * the Arazzo spec.
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
   * <span class="mono yellow">id</span> of a <span class="mono yellow">&lt;rapi-doc&gt;</span> or
   * <span class="mono yellow">&lt;rapi-doc-mini&gt;</span> on the page, or several ids separated by
   * spaces, one element per OpenAPI source of the Arazzo spec. Each element supplies its source's
   * OpenAPI spec, server, credentials and mock; clicking a step shows its operation in the element of its
   * source. An element is paired with the source its <span class="mono yellow">arazzo-source</span>
   * attribute names, else the source whose URL it has loaded, else the next source not paired yet.
   * A paired <span class="mono yellow">&lt;rapi-doc-mini&gt;</span> gets <span class="mono
   * yellow">filter-operations</span>: the shown workflow's operations of its source, in step order.
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
   * @default amber
   */
  @property({ type: String, reflect: true })
  theme: "ember" | "carbon" | "cobalt" | "jade" | "indigo" | "amber" | (string & {}) =
    DEFAULT_THEME;
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
   * <span class="mono yellow">compact</span> shows the operation, the values that come from the
   * inputs or earlier steps, and the gotos and retries whose lines leave the box.
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
   * spec by URL (YAML or JSON; the server must allow cross-origin requests). Loading one shows
   * its first workflow. The element then manages the Arazzo spec: with <span class="mono
   * yellow">for</span>, whenever the Arazzo spec changes (from the box or <span class="mono
   * yellow">arazzo-url</span>), each paired element loads its OpenAPI source, unless it already
   * shows that OpenAPI spec, so steps resolve and runs go to that API.
   * @group Workflow
   */
  @property({ type: String, attribute: "allow-arazzo-url-load" })
  allowArazzoUrlLoad: "true" | "false" = "false";
  /**
   * <span class="mono yellow">true</span> keeps the shown workflow and the selected step in the
   * page's address as query parameters, <span class="mono yellow">?workflow=&lt;id&gt;&amp;step=&lt;id&gt;</span>,
   * so a link opens that workflow with that step selected and scrolled into view. It uses the query
   * string, not the hash, which <span class="mono yellow">&lt;rapi-doc&gt;</span> keeps for its
   * operations; the address is replaced (no history entries) and <span class="mono
   * yellow">history.state</span> is kept for the page's router. Set it on one element per page.
   * @group Workflow
   */
  @property({ type: String, attribute: "update-route" })
  updateRoute: "true" | "false" = "false";
  /**
   * <span class="mono yellow">false</span> hides the run panel: the diagram only.
   * @group Run
   */
  @property({ type: String, attribute: "allow-run" })
  allowRun: "true" | "false" = "true";
  /**
   * Base URL the first OpenAPI source's requests go to in runs, instead of the server its paired
   * element selected or the OpenAPI spec's first server.
   * @group Run
   */
  @property({ type: String, attribute: "server-url" })
  serverUrl = "";
  /**
   * <span class="mono yellow">true</span> says the server runs go to is a mock that picks its
   * response status from a <span class="mono yellow">Prefer: code=</span> header, such as
   * <span class="mono yellow">rapidoc mock</span> or Prism. The run panel then shows Mock Response
   * Status, sent with each step's request, and the button reads "RUN WORKFLOW (Mock)". Not needed
   * when the paired elements have <span class="mono yellow">mock-server="true"</span>; against a real API, leave it off: the header is ignored.
   * @group Run
   */
  @property({ type: String, attribute: "server-is-mock" })
  serverIsMock: "true" | "false" = "false";
  /**
   * <span class="mono yellow">true</span> shows an Export MCP Server button that downloads an MCP
   * server with one tool per workflow of the Arazzo spec (every one the runtime can run), and
   * no tool per operation. Its steps call every API source of the Arazzo spec; <span class="mono
   * yellow">&lt;rapi-doc&gt;</span>'s own export covers one API's operations.
   * @group MCP
   */
  @property({ type: String, attribute: "mcp" })
  mcp: "true" | "false" = "false";
  /**
   * Name of the exported MCP server. Defaults to the Arazzo spec's title.
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
  // The OpenAPI documents this element loaded itself, by source name (sources with no paired element)
  private specObjects: Map<string, any> = new Map();
  // Running a workflow: the inputs form, the step whose request is in flight, and a log
  @state() private runState: "idle" | "running" | "done" = "idle";
  /** Set when a run starts: the first log entry (or the reason it could not run) is scrolled into view */
  private revealRunOutput = false;
  @state() private runInputs: Record<string, string> = {};
  /**
   * Status codes a mock answers with during a run, by step id, `*` for every other step; each a
   * list such as "503, 200", used in turn per attempt, or with a prefix: `random:200,500`,
   * `cycle:503,503,200`. A step's `x-mock-server-status-code` in the Arazzo spec is its starting
   * value; a key set here (even to "") wins over it. A paired element's in-browser mock gets them
   * per operation; any other server gets `Prefer: code=<status>` on the request, which
   * `rapidoc mock` honours.
   */
  @property({ type: Object, attribute: false }) statusCodes: Record<string, string> = {};
  // Credentials typed into the run panel, by security scheme id, for sources with no paired element
  @state() private manualCredentials: Record<string, string> = {};
  @state() private runningStepId = "";
  @state() private trace: any[] = [];
  // The execution log's layout: one row per entry with fixed columns, or rows that wrap
  @state() private logLayout: "single" | "multi" = "single";
  @state() private runResult: any = null;
  /** The inputs the last run was given, as the workflow got them: the start of its log. */
  @state() private runSentInputs: Record<string, unknown> | null = null;
  @state() private runProblem = "";

  private loadId = 0;
  /** The next load comes from the URL box: the paired elements follow their sources. */
  private followArazzo = false;
  /** The source URL each paired element was asked to show; its other specs are ignored. */
  private awaited: Map<any, string> = new Map();
  /** What the box showed before a load from it, put back if that load fails. */
  private beforeBoxLoad: { arazzoUrl: string; workflowId: string; specUrl: string } | null = null;
  /** Put back after a failed box load: set the properties without loading again. */
  private skipLoad = false;
  /** Why the last load from the URL box failed, and the URL that was typed; the diagram stays. */
  @state() private boxError = "";
  @state() private boxValue: string | null = null;
  /** Stops the run in progress (the Stop button, another workflow, Clear, disconnect). */
  private runAbort: AbortController | null = null;
  /** The elements named by `for`, listened to for spec-loaded and mock-server changes. */
  private watched: any[] = [];
  /** OpenAPI source name -> the element paired with it (see `for`). */
  private paired: Map<string, any> = new Map();
  /** OpenAPI source name -> the processed spec its paired <rapi-doc> loaded, and its index. */
  private pairedSpecs: Map<string, { el: any; url: string; spec: any; index: any }> = new Map();
  /** Sources being fetched by repair(), so a second call does not fetch them again. */
  private fetching: Set<string> = new Set();
  private onSpecLoaded = (e: Event) => {
    this.useElementSpecs(e.currentTarget);
    if (this.linkedFocus) this.showLinkedOperation(e.currentTarget);
  };
  /** A linked step (update-route) whose operation waits for its element's spec. */
  private linkedFocus = "";
  /** Redraws when a paired element's mock-server attribute changes, for the "(Mock)" labels. */
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
      /* The page's own markup at the top and bottom; its spacing is the page's */
      slot[name="header"],
      slot[name="footer"] {
        display: block;
      }
      /* The document card: the Arazzo URL (box or text) above the API sources it names */
      .flow-doc {
        margin-bottom: 1rem;
        background: var(--muted);
        border: 3px solid var(--border);
        border-radius: var(--radius);
        overflow: hidden;
      }
      /* The URL row: darker than the card, so the box and the Load button stand out */
      .flow-doc-url {
        padding: 0.5rem;
        background: var(--background);
      }
      .flow-doc-url + .flow-sources {
        border-top: 1px solid var(--border);
      }
      .flow-url {
        display: flex;
        gap: 0.5rem;
      }
      .flow-sources {
        padding: 0.5rem 0.75rem;
        font-size: var(--font-size-small);
      }
      .flow-doc-title {
        margin: 0 0 0.375rem;
        font-size: var(--font-size-small);
        font-weight: 400;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--muted-foreground);
      }
      .flow-sources dl {
        display: grid;
        grid-template-columns: max-content 1fr;
        gap: 0.125rem 1.25rem;
        margin: 0;
      }
      .flow-sources dt {
        color: var(--foreground);
      }
      .flow-sources dd {
        margin: 0;
        min-width: 0;
        overflow-wrap: anywhere;
        color: var(--muted-foreground);
        font-family: var(--font-mono);
      }
      .flow-src-type {
        margin-right: 0.5rem;
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
        margin: 0.5rem 0 0;
        color: var(--destructive);
        font-size: var(--font-size-small);
      }
      .flow-source {
        margin: 0;
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
      .view-toggle,
      .log-toggle {
        display: inline-flex;
      }
      .view-toggle .btn,
      .log-toggle .btn {
        font-weight: 400;
      }
      .view-toggle .btn:first-child,
      .log-toggle .btn:first-child {
        border-radius: var(--radius) 0 0 var(--radius);
      }
      .view-toggle .btn + .btn,
      .log-toggle .btn + .btn {
        margin-left: -1px;
        border-radius: 0 var(--radius) var(--radius) 0;
      }
      .view-toggle .btn[aria-pressed="true"],
      .log-toggle .btn[aria-pressed="true"] {
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
      .run-log-note {
        font-weight: 400;
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
      /* A bordered box with the log's + / − toggle, so it reads as something to open */
      .run-mock {
        margin-top: 0.75rem;
        border: 1px solid var(--input);
        border-radius: var(--radius);
        background: var(--card);
      }
      .run-mock > summary {
        font-weight: 600;
        border-radius: var(--radius);
      }
      .run-mock > summary:hover {
        background: color-mix(in srgb, var(--card) 88%, var(--foreground));
      }
      .run-mock[open] > summary {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
      .run-mock summary .muted {
        font-weight: 400;
        margin-left: 0.5rem;
      }
      .run-mock > :not(summary) {
        margin-left: 0.75rem;
        margin-right: 0.75rem;
      }
      .run-mock > :last-child {
        margin-bottom: 0.75rem;
      }
      .run-mock-rows {
        margin-top: 0.25rem;
      }
      .run-inputs p.run-mock-help {
        max-width: 48rem;
        margin: 0.5rem 0.75rem 0.25rem;
        font-size: var(--font-size-small);
      }
      .run-actions {
        display: flex;
        justify-content: flex-end;
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
      .run-mock > summary {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem 0.75rem;
        align-items: baseline;
        position: relative;
        padding: 0.375rem 2.75rem 0.375rem 0.75rem;
        cursor: pointer;
        list-style: none;
      }
      .run-trace summary::-webkit-details-marker,
      .run-mock > summary::-webkit-details-marker {
        display: none;
      }
      /* A bordered + in the top-right corner, − when it is open; out of the flow, so a wrapping
         line never leaves it on a line of its own */
      .run-mock > summary::after {
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
      .run-mock[open] > summary::after {
        content: "−";
      }
      .run-mock > summary:hover::after {
        color: var(--foreground);
        border-color: var(--muted-foreground);
      }
      /* The Execution Log heading row: the title, then the layout toggle on the right */
      .run-log-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        margin: 0.75rem 0 0.375rem;
      }
      .run-log-head h4 {
        margin: 0;
      }
      .log-toggle .btn {
        padding: 2px 8px;
        font-size: var(--font-size-xs);
      }
      /* An entry's row: #, step, method and URL, status, outcome, expander. Single line: fixed
         columns, one row, the URL cut with an ellipsis. Multiline: the same cells, wrapping. */
      .run-trace summary {
        display: grid;
        grid-template-columns: 1.75em 9em minmax(0, 1fr) 5.5em 1em 1.25em;
        align-items: center;
        gap: 0.625rem;
        padding: 0.375rem 0.75rem;
        cursor: pointer;
        list-style: none;
      }
      .run-trace summary > span {
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      /* Multiline: the same columns, top-aligned, with the cells wrapping inside them (the URL
         breaks anywhere), so the outcome and expander stay on the first line */
      .run-trace.multi summary {
        align-items: start;
      }
      .run-trace.multi summary > span {
        white-space: normal;
        overflow: visible;
        overflow-wrap: anywhere;
      }
      .trace-seq {
        color: var(--muted-foreground);
        font-variant-numeric: tabular-nums;
      }
      .trace-status {
        font-variant-numeric: tabular-nums;
      }
      .trace-outcome {
        text-align: center;
        font-weight: 700;
      }
      /* The expander: a bordered +, − when the entry is open */
      .trace-expander {
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
      .trace-expander::before {
        content: "+";
      }
      .run-trace details[open] .trace-expander::before {
        content: "−";
      }
      .run-trace summary:hover .trace-expander {
        color: var(--foreground);
        border-color: var(--muted-foreground);
      }
      .trace-check-failed {
        color: var(--destructive);
        font-weight: 600;
      }
      /* The expanded entry's first line: the failed check and its action, the attempt, mocked */
      .trace-detail {
        margin: 0.5rem 0.75rem 0;
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem 0.75rem;
        align-items: baseline;
      }
      .run-trace details[open] summary,
      .run-mock[open] > summary {
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
      }
      .trace-success .trace-outcome {
        color: var(--green);
      }
      .trace-failure .trace-outcome,
      .run-problem,
      .run-error {
        color: var(--destructive);
      }
      /* The run's error under the log: on the darker input surface, for contrast with the red */
      .flow-run pre.run-error {
        margin-top: 0.5rem;
        padding: 0.75rem;
        border-radius: var(--radius);
        background: var(--input-background);
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
    // Reconnected after a load: listen to the paired elements again
    if (this.doc) {
      this.watchElements();
      this.useElementSpecs();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.runAbort?.abort();
    this.unwatchElements();
  }

  updated(changed) {
    if (this.revealRunOutput) this.scrollToRunOutput();
    if (changed.has("theme")) {
      const normalized = normalizeTheme(this.theme).theme;
      if (normalized !== this.theme) this.theme = normalized;
      applyCustomTheme(this, this.theme);
    }
    if (changed.has("arazzoUrl") || changed.has("specUrl")) {
      if (this.skipLoad) this.skipLoad = false;
      else this.load();
    } else if (changed.has("for")) {
      // Other elements to pair with: the document and the specs this element loaded stay. While
      // the first document loads, that load pairs them when it is done.
      if (this.doc) this.repair(this.allowArazzoUrlLoad === "true");
      else if (!this.loading) this.load();
    }
    if (changed.has("sources") || changed.has("doc") || changed.has("workflowId")) {
      this.applyFilters();
    }
    // A redrawn diagram has lost the highlight classes
    this.linkedStepId = "";
  }

  /**
   * Loads the Arazzo spec and its OpenAPI sources. Fires <span class="mono
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
      const problems = validateArazzo(doc);
      const sources = new Map();
      const specObjects = new Map();
      // With the URL box, this element manages the document: on any load (from the box, or the
      // page setting arazzo-url), each paired element loads its source when it shows another spec
      // (or none). Without the box the page decides what the elements show.
      const following = fromBox || this.allowArazzoUrlLoad === "true";
      const pairs = this.pairElements(doc, arazzoUrl);
      await Promise.all(
        openapiSources(doc).map(async (s, i) => {
          // A <rapi-doc>'s source is its own (loaded already, or loaded once this load is done;
          // its spec-loaded indexes it), so it is fetched once
          if (this.suppliesSpec(doc, s.name, pairs.get(s.name))) return;
          const url = i === 0 && this.specUrl ? this.specUrl : s.url;
          try {
            const text = await this.fetchText(this.sourceUrl(doc, s, arazzoUrl));
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
      // A link's workflow (update-route), unless this document came from the URL box: the link
      // was to the one before
      const linked = this.updateRoute === "true" && !fromBox ? this.readRoute() : null;
      if (linked?.workflow && this.workflowIds.includes(linked.workflow)) {
        this.workflowId = linked.workflow;
      }
      this.resetRun();
      if (fromBox) {
        this.selectedStepId = "";
        this.writeRoute();
      }
      this.emit("flow-loaded", { doc, problems });
      // Then the elements, as `for` names them now (a flow-loaded listener may have changed it):
      // paired, told to load their sources, and the specs they hold already indexed
      await this.repair(following);
      // A link's step: selected (its operation shown in its element) and scrolled into view
      if (linked?.step && id === this.loadId) await this.showLinkedStep(linked.step);
    } catch (err) {
      if (id !== this.loadId) return;
      // From the URL box with a document already shown: keep it, and the elements that go with
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

  /** The parsed Arazzo spec, for a <rapi-doc> that exports workflow tools; null until loaded. */
  get arazzoDocument(): any {
    return this.doc;
  }

  /** The text of workflow-runtime.js, for the project a paired <rapi-doc> exports. */
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

  /** The elements `for` names, in order (ids separated by spaces). */
  private forElements(): any[] {
    const root = this.getRootNode() as Document | ShadowRoot;
    return String(this.for || "")
      .split(/\s+/)
      .filter(Boolean)
      .map((id) => root.getElementById?.(id) || document.getElementById(id))
      .filter(Boolean);
  }

  /** Listens to the elements `for` names: spec-loaded indexes their spec, mock-server redraws. */
  private watchElements() {
    const elements = this.forElements();
    if (
      elements.length === this.watched.length &&
      elements.every((el, i) => el === this.watched[i])
    )
      return;
    this.unwatchElements();
    this.watched = elements;
    this.mockObserver = new MutationObserver(() => this.requestUpdate());
    for (const el of elements) {
      el.addEventListener("spec-loaded", this.onSpecLoaded);
      this.mockObserver.observe(el, { attributes: true, attributeFilter: ["mock-server"] });
    }
  }

  private unwatchElements() {
    for (const el of this.watched) el.removeEventListener("spec-loaded", this.onSpecLoaded);
    this.watched = [];
    this.mockObserver?.disconnect();
    this.mockObserver = null;
  }

  /** Where an OpenAPI source is fetched from: spec-url for the first, else its URL. */
  private sourceUrl(doc, source, arazzoUrl: string) {
    if (this.specUrl && openapiSources(doc)[0] === source)
      return new URL(this.specUrl, document.baseURI).href;
    return new URL(source.url, arazzoUrl).href;
  }

  /**
   * Whether a paired element supplies its source's spec: a <rapi-doc> does, unless spec-url names
   * the first source's. A <rapi-doc-mini> does not, since it is filtered to the shown workflow:
   * this element loads that source itself.
   */
  private suppliesSpec(doc, name: string, el: any) {
    if (!el || el.tagName === "RAPI-DOC-MINI") return false;
    return !(this.specUrl && openapiSources(doc)[0]?.name === name);
  }

  /** The URL of the spec an element shows, absolute; "" for none or a spec object. */
  private elementSpecUrl(el): string {
    return el?.specUrl ? new URL(el.specUrl, document.baseURI).href : "";
  }

  /** Which element `for` names goes with which OpenAPI source, by source name (see `for`). */
  private pairElements(doc, arazzoUrl: string): Map<string, any> {
    const list = openapiSources(doc);
    const elements = this.forElements();
    const pairs = new Map();
    const unnamed = [];
    for (const el of elements) {
      const name = el.getAttribute("arazzo-source");
      if (!name) unnamed.push(el);
      else if (list.some((s) => s.name === name) && !pairs.has(name)) pairs.set(name, el);
    }
    const rest = [];
    for (const el of unnamed) {
      const url = this.elementSpecUrl(el);
      const match =
        url && list.find((s) => !pairs.has(s.name) && this.sourceUrl(doc, s, arazzoUrl) === url);
      if (match) pairs.set(match.name, el);
      else rest.push(el);
    }
    for (const el of rest) {
      const free = list.find((s) => !pairs.has(s.name));
      if (!free) break;
      pairs.set(free.name, el);
    }
    return pairs;
  }

  /**
   * Pairs the elements `for` names with the document's OpenAPI sources and, when `following`, has
   * each <rapi-doc> load its source unless it shows it already (a mini loads its source once its
   * filter is set, see applyFilters). Specs a <rapi-doc> loaded before stay while it keeps its source.
   */
  private pairUp(doc, arazzoUrl: string, following: boolean) {
    this.watchElements();
    const list = openapiSources(doc);
    const pairs = this.pairElements(doc, arazzoUrl);
    this.awaited = new Map();
    for (const [name, el] of pairs) {
      const source = list.find((s) => s.name === name);
      if (!following || (this.specUrl && source === list[0])) continue;
      const url = this.sourceUrl(doc, source, arazzoUrl);
      this.awaited.set(el, url);
      if (el.tagName !== "RAPI-DOC-MINI" && this.elementSpecUrl(el) !== url) el.loadSpec?.(url);
    }
    const kept = new Map();
    for (const [name, entry] of this.pairedSpecs) {
      if (pairs.get(name) === entry.el) kept.set(name, entry);
    }
    this.paired = pairs;
    this.pairedSpecs = kept;
  }

  /**
   * Pairs the elements `for` names again, indexes the specs they hold, and loads the sources that
   * no element supplies and this element has not loaded yet (one that a mini took over from a
   * <rapi-doc>, say).
   */
  private async repair(following: boolean) {
    const doc = this.doc;
    if (!doc) return;
    const arazzoUrl = new URL(this.arazzoUrl, document.baseURI).href;
    this.pairUp(doc, arazzoUrl, following);
    this.useElementSpecs();
    this.applyFilters();
    const missing = openapiSources(doc).filter(
      (s) =>
        !this.specObjects.has(s.name) &&
        !this.fetching.has(s.name) &&
        !this.suppliesSpec(doc, s.name, this.paired.get(s.name)),
    );
    await Promise.all(
      missing.map(async (s) => {
        this.fetching.add(s.name);
        try {
          const openapi = parseDocument(await this.fetchText(this.sourceUrl(doc, s, arazzoUrl)));
          if (this.doc !== doc) return;
          this.specObjects = new Map(this.specObjects).set(s.name, openapi);
          this.sources = new Map(this.sources).set(s.name, indexOperations(openapi));
        } catch (err) {
          if (this.doc !== doc) return;
          this.problems = [
            ...this.problems,
            {
              level: "warning",
              path: `sourceDescriptions.${s.name}`,
              message: `could not load ${s.url}: ${err.message}`,
            },
          ];
        } finally {
          this.fetching.delete(s.name);
        }
      }),
    );
  }

  /**
   * Indexes the specs the paired <rapi-doc> elements have processed, each as its source. Runs
   * after a load and on each `spec-loaded`, since they often finish after <rapi-flow>. Until then,
   * steps of those sources show their operationId. `only` limits it to one element.
   */
  private useElementSpecs(only?: any) {
    if (!this.doc) return;
    const sources = new Map(this.sources);
    const specs = new Map(this.pairedSpecs);
    let changed = false;
    for (const [name, el] of this.paired) {
      if (!this.suppliesSpec(this.doc, name, el) || (only && el !== only)) continue;
      const spec = el.resolvedSpec;
      if (!spec || spec.isSpecLoading || spec.specLoadError || el.loading) continue;
      // Asked to load its source (the URL box): not until it holds that one
      const awaited = this.awaited.get(el);
      if (awaited && this.elementSpecUrl(el) !== awaited) continue;
      const held = specs.get(name);
      const index = held?.spec === spec ? held.index : indexResolvedSpec(spec);
      if (sources.get(name) === index) continue;
      specs.set(name, { el, url: this.elementSpecUrl(el), spec, index });
      sources.set(name, index);
      changed = true;
    }
    if (!changed) return;
    this.pairedSpecs = specs;
    this.sources = sources;
  }

  /**
   * Shows each paired <rapi-doc-mini> the shown workflow's operations of its source, in step order
   * (filter-operations; a source the workflow does not call shows none), once this element has
   * loaded that source; then, when it follows the document, has the mini load its source, filtered
   * from its first load.
   */
  private applyFilters() {
    const graph = this.graph;
    if (!graph) return;
    for (const [name, el] of this.paired) {
      if (el.tagName !== "RAPI-DOC-MINI" || !this.specObjects.has(name)) continue;
      const terms = graph.steps
        .map((s) => s.operation)
        .filter((op) => op?.source === name)
        .map((op) => `${op.method.toUpperCase()} ${op.path}`);
      const text = [...new Set(terms)].join(" ") || "!/**";
      if (el.getAttribute("filter-operations") !== text) el.setAttribute("filter-operations", text);
      const url = this.awaited.get(el);
      if (url && this.elementSpecUrl(el) !== url) el.setAttribute("spec-url", url);
    }
  }

  /** The OpenAPI document of the first source and every source's, by name, for the runtime. */
  private specInputs() {
    const first = openapiSources(this.doc)[0];
    const sources = Object.fromEntries(this.specObjects);
    for (const [name, entry] of this.pairedSpecs) sources[name] = entry.spec;
    return { first, spec: first ? sources[first.name] : null, sources };
  }

  /** The paired elements whose in-browser mock is on, by source name. */
  private get mockedSources(): Set<string> {
    const names = new Set<string>();
    for (const [name, el] of this.paired) if (el.mockServer === "true") names.add(name);
    return names;
  }

  /** A paired element's in-browser mock answers runs (all of them, or the steps on its source). */
  private get inBrowserMock(): boolean {
    return this.mockedSources.size > 0;
  }

  /** A mock answers runs: a paired element's in the browser, or a mock server (server-is-mock). */
  private get runsMocked(): boolean {
    return this.inBrowserMock || this.serverIsMock === "true";
  }

  /** The workflow and step a link names (update-route): `?workflow=` and `?step=`. */
  private readRoute() {
    const params = new URLSearchParams(window.location.search);
    return { workflow: params.get("workflow") || "", step: params.get("step") || "" };
  }

  /**
   * Puts the shown workflow and the selected step in the address (update-route), replacing the
   * entry and keeping history.state, which a router may hold. The hash stays <rapi-doc>'s.
   */
  private writeRoute() {
    const graph = this.graph;
    if (this.updateRoute !== "true" || !graph) return;
    const url = new URL(window.location.href);
    url.searchParams.set("workflow", graph.workflowId);
    if (graph.steps.some((s) => s.stepId === this.selectedStepId))
      url.searchParams.set("step", this.selectedStepId);
    else url.searchParams.delete("step");
    if (url.href !== window.location.href)
      window.history.replaceState(window.history.state, "", url.href);
  }

  /** Selects a step from a link and scrolls its box into view, once the diagram is drawn. */
  private async showLinkedStep(stepId: string) {
    const step = this.graph?.steps.find((s) => s.stepId === stepId);
    if (!step) return;
    this.selectStep(stepId);
    // Its element may still be loading its spec: show the operation on its spec-loaded then
    if (!(await this.showOperation(step))) this.linkedFocus = stepId;
    await this.updateComplete;
    const box = this.renderRoot.querySelector(`.rf-step[data-step-id="${CSS.escape(stepId)}"]`);
    if (box) this.scrollToCenter(box.getBoundingClientRect());
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
      this.selectedStepId = "";
      this.writeRoute();
      return;
    }
    this.writeRoute();
    this.linkedFocus = "";
    this.showOperation(step);
  }

  /**
   * Shows a step's operation in the element paired with its source: a mini expands it in place,
   * <rapi-doc> scrolls its reference to it. False when that element does not have it (yet).
   */
  private async showOperation(step): Promise<boolean> {
    const op = step?.operation;
    const el = op && this.paired.get(op.source);
    if (!el) return false;
    if (typeof el.showOperation === "function") {
      return el.showOperation(`${op.method.toUpperCase()} ${op.path}`);
    }
    const target = (el.resolvedSpec?.tags || [])
      .flatMap((t) => t.paths || [])
      .find(
        (p) =>
          (op.operationId && p.operationId === op.operationId) ||
          (p.method === op.method && p.path === op.path),
      );
    if (!target?.elementId) return false;
    el.scrollToPath(target.elementId);
    return true;
  }

  /**
   * A linked step whose operation's element had not loaded its spec yet: shown on that element's
   * spec-loaded, after <rapi-doc> has gone to its own hash or first section (it does right after
   * the event, or 100ms later in read mode).
   */
  private showLinkedOperation(el) {
    const step = this.graph?.steps.find((s) => s.stepId === this.linkedFocus);
    if (!step || this.paired.get(step.operation?.source) !== el) return;
    const stepId = this.linkedFocus;
    window.setTimeout(async () => {
      if (this.linkedFocus !== stepId) return;
      if (await this.showOperation(step)) this.linkedFocus = "";
    }, 150);
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

  /** The credentials a paired element holds, by security scheme id, as the runtime takes them. */
  private credentialsFromElement(el) {
    const credentials = {};
    for (const s of el?.resolvedSpec?.securitySchemes || []) {
      const value = s?.finalKeyValue;
      if (!value || !s.securitySchemeId) continue;
      if (s.type === "apiKey") credentials[s.securitySchemeId] = value;
      else if (/^basic /i.test(value)) credentials[s.securitySchemeId] = atob(value.slice(6));
      else credentials[s.securitySchemeId] = value.replace(/^(bearer|mac)\s+/i, "");
    }
    return credentials;
  }

  /**
   * The runtime and tool that run the shown workflow, or why it cannot run. Each source's OpenAPI
   * document is its paired element's, else the one this element loaded; its requests go to the
   * server its element selected, else the spec's (`server-url` replaces the first source's);
   * credentials are the typed ones and the paired elements'.
   */
  private prepareRun(graph) {
    const { first, spec, sources } = this.specInputs();
    if (!spec) return { problem: "the OpenAPI document of the first source is not loaded" };
    const problems = [];
    const manifest = buildMcpManifest(spec, {
      arazzo: this.doc,
      sources,
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
    const baseUrls = {};
    let credentials = this.typedCredentials();
    for (const [name, el] of this.paired) {
      if (el.selectedServer?.computedUrl) baseUrls[name] = el.selectedServer.computedUrl;
      credentials = { ...credentials, ...this.credentialsFromElement(el) };
    }
    if (this.serverUrl) baseUrls[first.name] = this.serverUrl;
    // x-operation URLs computed at run time may go anywhere: the page's own fetch, which the
    // browser limits (CORS), not a server's
    const runtime = createMcpWorkflowRuntime(manifest, {
      credentials,
      baseUrls,
      externalHosts: ["*"],
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
    this.revealRunOutput = true;
    if (!prepared.runtime) {
      this.runProblem = prepared.problem;
      this.runState = "done";
      return;
    }
    const inputs = this.coerceInputs(graph);
    this.runSentInputs = inputs;
    this.runState = "running";
    // Status codes for this run: an in-browser mock reads them from its element (set for the run
    // only, for the steps on its source), any other server gets them as Prefer: code=
    const mockedSources = this.mockedSources;
    const sourceOfStep = new Map(graph.steps.map((st) => [st.stepId, st.operation?.source]));
    // x-operation steps call endpoints outside the API sources: no mock answers them
    const externalSteps = new Set(
      graph.steps.filter((st) => st.kind === "external").map((st) => st.stepId),
    );
    const codes = this.statusCodesByStep(graph);
    const restore = [];
    if (Object.keys(codes).length) {
      for (const name of mockedSources) {
        const el = this.paired.get(name);
        const byOperation = {};
        for (const step of graph.steps) {
          const op = step.operation;
          if (op?.source === name && codes[step.stepId])
            byOperation[`${op.method.toUpperCase()} ${op.path}`] = codes[step.stepId];
        }
        if (codes["*"]) byOperation["*"] = codes["*"];
        restore.push({ el, code: el.mockServerStatusCode });
        // Codes without a prefix are used in turn; a prefix (random:, cycle:) on a value says otherwise
        el.mockServerStatusCode = byOperation;
      }
      await Promise.all(restore.map((r) => r.el.updateComplete));
    }
    // A step's attempts take the codes in turn (or at random with random:)
    const pick = (list: string, attempt: number) => pickStatusCode(list, attempt - 1);
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
        const external = externalSteps.has(e.stepId);
        const inBrowser = mockedSources.has(sourceOfStep.get(e.stepId));
        const mocked = !external && (inBrowser || this.serverIsMock === "true");
        this.trace = [...this.trace, { ...e, mocked, external }];
      },
      // Steps answered in the browser take their codes from the element's mock instead
      requestHeaders: (e) => {
        if (mockedSources.has(sourceOfStep.get(e.stepId)) || externalSteps.has(e.stepId))
          return undefined;
        const code = pick(codes[e.stepId] || codes["*"] || "", e.attempt);
        return code ? { Prefer: `code=${code}` } : undefined;
      },
    });
    for (const r of restore) r.el.mockServerStatusCode = r.code;
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
   * source that names the scheme). Sources with a paired element are left out: it has its own.
   */
  private standaloneSchemes() {
    const byId = new Map();
    for (const [name, spec] of this.specObjects) {
      if (this.paired.has(name)) continue;
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

  /** A field's value: what statusCodes says (typed, or set by the host), else the step's extension */
  private statusCodeFor(graph, key: string): string {
    if (this.statusCodes && key in this.statusCodes) return String(this.statusCodes[key] ?? "");
    return graph.steps.find((s) => s.stepId === key)?.mockStatusCode || "";
  }

  /** The run's status codes with blanks dropped: `{ "*": "...", <stepId>: "..." }`. */
  private statusCodesByStep(graph): Record<string, string> {
    const out = {};
    for (const key of ["*", ...graph.steps.map((s) => s.stepId)]) {
      const codes = this.statusCodeFor(graph, key).trim();
      if (codes) out[key] = codes;
    }
    return out;
  }

  /**
   * Status codes to answer with, one row per step plus a default: for a paired element's
   * in-browser mock, or for a mock server that honours Prefer: code= (server-is-mock); not shown
   * otherwise, since a real API ignores it. Folded until a
   * status is set (statusCodes, or typed in it), so the inputs and the Run button come first.
   */
  private renderStatusCodes(graph) {
    // Only where a mock reads it: a paired element's in the browser, or a mock server
    if (!this.runsMocked) return nothing;
    const mocked = this.inBrowserMock;
    const set = (key, value) => (this.statusCodes = { ...this.statusCodes, [key]: value });
    const steps = graph.steps.filter((s) => s.operation);
    return html`<details class="run-mock" ?open=${Object.keys(this.statusCodesByStep(graph)).length > 0}>
      <summary>
        Mock Response Status
        <span class="muted">${mocked ? "the in-browser mock answers with" : "the mock server answers with (sent as Prefer: code=)"}</span>
      </summary>
      <p class="muted run-mock-help">
        Make the mock answer with an HTTP status, to try the workflow's failure paths: its
        retries, gotos and ends. Enter one code (<code>404</code>), or several separated by
        commas (<code>503, 503, 200</code>) to give a step's attempts one each, in turn;
        <code>random:200, 500</code> picks one at random for each attempt. Leave a field empty
        for the success response; a step's own field overrides Every step. A step's
        <code>x-mock-server-status-code</code> in the workflow fills its field.
      </p>
      <div class="run-mock-rows">
        ${this.field(
          "Every step",
          "empty: success response",
          html`<input
            type="text"
            name="mock-status"
            .value=${this.statusCodeFor(graph, "*")}
            placeholder="e.g. 404, 503, 200 or random:200, 500"
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
              .value=${this.statusCodeFor(graph, s.stepId)}
              placeholder="Same as every step"
              @input=${(e) => set(s.stepId, e.target.value)}
            />`,
          ),
        )}
      </div>
    </details>`;
  }

  private renderInputsForm(graph) {
    const set = (name, value) => (this.runInputs = { ...this.runInputs, [name]: value });
    const running = this.runState === "running";
    // Answered by a mock (a paired element's in the browser, or a mock server): said on the button
    const mocked = this.runsMocked;
    const mockTitle = this.inBrowserMock
      ? "The in-browser mock of the paired elements answers this run's requests to their APIs; they do not reach the server"
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
                type=${i.format === "password" ? "password" : "text"}
                autocomplete=${i.format === "password" ? "off" : nothing}
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
        ${running ? html`<button type="button" class="btn btn-outline run-stop" part="run-stop" @click=${() => this.runAbort?.abort()}>STOP</button>` : nothing}
        ${this.runState === "done" ? html`<button type="button" class="btn btn-outline run-clear" @click=${() => this.resetRun()}>CLEAR LOGS</button>` : nothing}
        <button type="submit" class="btn btn-primary run-button" part="run-button" ?disabled=${running} title=${mocked ? mockTitle : nothing}>
          ${running ? "RUNNING..." : `RUN WORKFLOW${mocked ? " (Mock)" : ""}`}
        </button>
      </div>
    </form>`;
  }

  /**
   * Brings the run's output into view once it appears: the log as soon as its first entry is in, or the
   * reason the run could not start. The log grows below the inputs, often under the fold, so without
   * this a reader who clicks Run workflow sees nothing happen. Scrolls only when the output is not
   * already on screen, and without animation for a reader who asks for reduced motion.
   */
  private scrollToRunOutput() {
    const target = this.shadowRoot?.querySelector(".run-log-head, .run-problem");
    if (!target) return;
    this.revealRunOutput = false;
    const { top, bottom } = target.getBoundingClientRect();
    if (top >= 0 && bottom <= window.innerHeight) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
  }

  /** One log entry; `showMocked` tags a mocked response (when the heading does not say all are). */
  private renderTraceEntry(e, n, showMocked = true) {
    const pretty = (v) => {
      const text = typeof v === "string" ? v : JSON.stringify(v, null, 2);
      return text && text.length > 4000 ? `${text.slice(0, 4000)}…` : text;
    };
    const request = `${e.request?.method || ""} ${e.request?.url || ""}`.trim();
    const hasDetail = e.failedCriterion || e.action || e.attempt > 1 || (e.mocked && showMocked);
    return html`<li class="trace-${e.outcome}">
      <details ?open=${e.outcome === "failure"}>
        <summary>
          <span class="trace-seq">${n + 1}.</span>
          <span class="trace-step" title=${e.stepId}>${e.stepId}</span>
          <span class="trace-request" title=${request}>${request}</span>
          <span class="trace-status">${e.response ? `HTTP ${e.response.status}` : "no response"}</span>
          <span class="trace-outcome" aria-label=${e.outcome === "success" ? "Passed" : "Failed"}>${e.outcome === "success" ? "✓" : "✗"}</span>
          <span class="trace-expander" aria-hidden="true"></span>
        </summary>
        ${
          hasDetail
            ? html`<p class="trace-detail">
                ${e.failedCriterion ? html`<span class="trace-check-failed">Check Failed:</span><code>${e.failedCriterion}</code>` : nothing}
                ${e.action ? html`<span class="muted">→ ${e.action.type}${e.action.stepId ? ` ${e.action.stepId}` : ""}</span>` : nothing}
                ${e.attempt > 1 ? html`<span class="muted">attempt ${e.attempt}</span>` : nothing}
                ${e.mocked && showMocked ? html`<span class="muted">mocked response</span>` : nothing}
              </p>`
            : nothing
        }
        ${
          e.external && !e.response && e.request
            ? html`<p class="muted run-log-note">This step calls a URL outside the workflow's APIs (<code>x-operation</code>): that server must allow cross-origin requests from this page.</p>`
            : nothing
        }
        ${e.request?.body !== undefined ? html`<h4>Request body</h4><pre>${pretty(e.request.body)}</pre>` : nothing}
        ${e.response ? html`<h4>Response</h4><pre>${pretty(e.response.body)}</pre>` : nothing}
        ${e.outputs && Object.keys(e.outputs).length ? html`<h4>Outputs</h4><pre>${pretty(e.outputs)}</pre>` : nothing}
      </details>
    </li>`;
  }

  /** The inputs as the log shows them: those with `format: password` (secrets) read `••••••`. */
  private maskSecrets(graph, inputs: Record<string, unknown>) {
    const secret = new Set(
      (graph.inputDetails || []).filter((i) => i.format === "password").map((i) => i.name),
    );
    if (!secret.size) return inputs;
    return Object.fromEntries(
      Object.entries(inputs).map(([k, v]) => [k, secret.has(k) ? "••••••" : v]),
    );
  }

  /** The run panel under the diagram: the inputs form and button, then the log and the result. */
  private renderRun(graph) {
    if (this.allowRun === "false") return nothing;
    // Every response mocked: the Log heading says so once, instead of each entry
    const allMocked = this.trace.length > 0 && this.trace.every((e) => e.mocked);
    return html`<section class="flow-run" part="run">
      <h3>Run</h3>
      ${this.renderInputsForm(graph)}
      ${
        this.runSentInputs
          ? html`<h4>Inputs</h4><pre class="run-sent-inputs">${JSON.stringify(this.maskSecrets(graph, this.runSentInputs), null, 2)}</pre>`
          : nothing
      }
      ${
        this.trace.length
          ? html`<div class="run-log-head">
                <h4>Execution Log${allMocked ? html` <span class="run-log-note">(mocked responses)</span>` : nothing}</h4>
                <div class="log-toggle" part="log-toggle" role="group" aria-label="Log layout">
                  <button type="button" class="btn btn-outline" aria-pressed=${this.logLayout === "single" ? "true" : "false"} @click=${() => (this.logLayout = "single")}>
                    Single line
                  </button>
                  <button type="button" class="btn btn-outline" aria-pressed=${this.logLayout === "multi" ? "true" : "false"} @click=${() => (this.logLayout = "multi")}>
                    Multiline
                  </button>
                </div>
              </div>
              <ol class="run-trace ${this.logLayout}">${this.trace.map((e, n) => this.renderTraceEntry(e, n, !allMocked))}</ol>`
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
   * What an MCP export builds on: the first OpenAPI source's spec and every loaded source by name
   * (each paired element's, else the one this element loaded). Null until they are loaded.
   */
  private mcpExportInput() {
    const { spec, sources } = this.specInputs();
    if (!this.doc || !spec) return null;
    return {
      spec,
      options: {
        arazzo: this.doc,
        sources,
        includeOperations: false,
        serverName: this.mcpServerName || this.doc.info?.title || "workflows",
        workflowRuntime: workflowRuntimeSource,
      },
    };
  }

  // The last count of exportable workflows, by the documents it was built from
  private mcpCount: { doc: any; loaded: any; paired: any; count: number } | null = null;

  /** How many workflows the export would have; 0 hides the button. */
  private get mcpWorkflowCount(): number {
    const input = this.mcpExportInput();
    if (!input) return 0;
    const cached = this.mcpCount;
    if (
      cached?.doc === this.doc &&
      cached.loaded === this.specObjects &&
      cached.paired === this.pairedSpecs
    )
      return cached.count;
    let count = 0;
    try {
      count = buildMcpManifest(input.spec, input.options).tools.length;
    } catch {
      count = 0;
    }
    this.mcpCount = {
      doc: this.doc,
      loaded: this.specObjects,
      paired: this.pairedSpecs,
      count,
    };
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
    const base = result.manifest.server.name.replace(/_/g, "-").replace(/-mcp$/, "");
    link.download = `${base}-mcp.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  /**
   * The document card: the Arazzo spec's URL (the box that loads one by URL, with
   * allow-arazzo-url-load, else the URL as text), then the API sources it names.
   */
  private renderDocCard() {
    const url = this.renderUrlBox();
    const sources = (this.doc?.sourceDescriptions || []).filter((s) => s?.name);
    if (url === nothing && !sources.length) return nothing;
    return html`<section class="flow-doc" part="document">
      ${url === nothing ? nothing : html`<div class="flow-doc-url">${url}</div>`}
      ${
        sources.length
          ? html`<div class="flow-sources" part="sources">
              <h3 class="flow-doc-title">API sources</h3>
              <dl>
                ${sources.map(
                  (s) => html`<dt>${s.name}</dt>
                    <dd>
                      ${
                        // Only a type other than openapi (another Arazzo spec) is worth saying
                        s.type && s.type !== "openapi"
                          ? html`<span class="flow-src-type">${s.type}</span> `
                          : nothing
                      }${s.url}
                    </dd>`,
                )}
              </dl>
            </div>`
          : nothing
      }
    </section>`;
  }

  /** The box that loads an Arazzo spec by URL (allow-arazzo-url-load). */
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
        aria-label="Arazzo spec URL"
        placeholder="Arazzo spec URL (YAML or JSON)"
        spellcheck="false"
        .value=${this.boxValue ?? this.arazzoUrl}
        @input=${() => (this.boxError = "")}
      />
      <button type="submit" class="btn btn-outline" part="url-load" ?disabled=${this.loading}>Load</button>
    </form>
    ${this.boxError ? html`<p class="flow-url-error" part="url-error" role="alert">${this.boxError}</p>` : nothing}`;
  }

  render() {
    return html`<slot name="header"></slot>${this.renderDocCard()}${this.renderBody()}<slot
        name="footer"
      ></slot>`;
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
      // In the document card above, with the URL
      showSources: false,
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
                        this.linkedFocus = "";
                        this.resetRun();
                        this.writeRoute();
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
