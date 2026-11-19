import { html, nothing } from "lit";
import { Screen } from "../components/screen.js";
import { icon } from "../icons.js";
import { LABEL_HELP, badge, method } from "../labels.js";

/** The data a body holds, in words: "a list of calendar_common, inside data". */
const holds = (body) => {
  if (!body?.contentTypes) return "no body";
  const what = body.schema ? body.schema : "an unnamed schema";
  return `${body.many ? "a list of " : ""}${what}${body.inside ? `, inside ${body.inside}` : ""}`;
};

/** A sample body as text: pretty JSON when it is JSON. */
const pretty = (body) => {
  if (body === null || body === undefined) return "";
  try {
    return JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    return String(body);
  }
};

/** Where the mock takes a response's data from, in a few words (the column says it is the source). */
const dataSource = (one) =>
  one.body === "example"
    ? "Spec example"
    : one.body === "examples"
      ? one.examples.length === 1
        ? html`Named example <code>${one.examples[0]}</code>`
        : html`Named example <code>${one.examples[0]}</code>
            <span class="hint">(${one.examples.length - 1} more)</span>`
      : one.body === "generated"
        ? "Schema (generated)"
        : html`<span class="hint">No body</span>`;

/** A status code with its class's color: 2xx green, 3xx grey, 4xx and 5xx red. */
const status = (code) =>
  html`<span class="status s${/^[1-5]/.test(code) ? code[0] : "d"}">${code}</span>`;

/**
 * One operation: what the mock does for it, its parameters, request and responses. The other methods of its
 * path are tabs at the top.
 */
export class MockOperationDetail extends Screen {
  static properties = {
    app: { attribute: false },
    /** The id of the API and of the operation. */
    api: { type: String },
    operation: { type: String },
    /** Every operation of the API (the list's), for the tabs of the path's methods. */
    operations: { attribute: false },
    /** The API's resources, to link a response's schema to the resource stored under it. */
    resources: { attribute: false },
    version: { type: Number },
    /** The operation as the control API describes it, with the sample of its default response. */
    detail: { state: true },
    /** The status code of the response picked in the table; empty for the default one. */
    picked: { state: true },
    /** The sample of each response read so far, by status code. */
    samples: { state: true },
    /** Whether the drawer with the picked response's sample is open. */
    open: { state: true },
  };

  constructor() {
    super();
    this.detail = null;
    this.picked = "";
    this.samples = {};
    this.open = false;
  }

  get address() {
    return `/model/${encodeURIComponent(this.api)}/operations/${encodeURIComponent(this.operation)}`;
  }

  updated(changed) {
    // the drawer just opened: its close button takes the focus, so Esc closes it
    if (changed.has("open") && this.open) this.querySelector(".response-drawer .close")?.focus();
    if (!["api", "operation", "version"].some((one) => changed.has(one))) return;
    const { app, operation } = this;
    this.picked = "";
    this.samples = {};
    this.open = false;
    app.run(async () => {
      const detail = await app.call(this.address);
      if (operation === this.operation) this.detail = detail;
    });
  }

  /**
   * Opens the drawer on the sample of one response: the default one is in the detail; another is read once, as
   * a request with `Prefer: code=` gets it.
   */
  pick(one) {
    this.open = true;
    if (one.returned) {
      this.picked = "";
      return;
    }
    this.picked = one.code;
    if (this.samples[one.code]) return;
    const { app, operation } = this;
    app.run(async () => {
      const { sample } = await app.call(`${this.address}?code=${encodeURIComponent(one.code)}`);
      if (operation === this.operation) this.samples = { ...this.samples, [one.code]: sample };
    });
  }

  render() {
    const { app } = this;
    const op = this.detail;
    if (!op) return html`<p class="empty">Loading…</p>`;
    const siblings = (this.operations || []).filter((one) => one.path === op.path);
    const stored = new Set((this.resources || []).map((one) => one.name));
    const model = (one) =>
      one.schema
        ? html`${one.many ? "list of " : ""}${
            stored.has(one.schema)
              ? html`<a href=${app.href("resources", `${one.schema}/schema`)}>${one.schema}</a>`
              : html`<code>${one.schema}</code>`
          }${one.inside ? html` <span class="hint">in ${one.inside}</span>` : nothing}`
        : one.contentTypes
          ? html`<span class="hint">unnamed schema</span>`
          : html`<span class="hint">—</span>`;
    // the response whose sample is shown: one picked in the table, else the one a request gets by default
    const shownCode = this.picked || op.responses.find((one) => one.returned)?.code || "";
    const sample = this.picked ? this.samples[this.picked] : op.sample;
    // a response can be picked when a request can ask for it: a three-digit code, or the default one
    const pickable = (one) => one.returned || /^[1-5]\d\d$/.test(one.code);
    const onKey = (one) => (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      this.pick(one);
    };
    return html`
    <p><a href=${app.href("operations")}>← Operations</a></p>
    <div class="title">
      <h1 class="wrap op-title">${method(op.method)} <code>${op.path}</code></h1>
      <p>${op.summary || op.id}</p>
    </div>
    ${
      siblings.length > 1
        ? html`<nav class="tabs methods" aria-label="Methods of ${op.path}">
            ${siblings.map(
              (one) => html`
                <a
                  href=${app.href("operations", one.id)}
                  class=${one.id === op.id ? "current" : ""}
                  aria-current=${one.id === op.id ? "page" : "false"}
                  title=${one.summary || one.id}
                  >${method(one.method)}</a
                >
              `,
            )}
          </nav>`
        : nothing
    }

    <section class="card">
      <h2>What the mock does</h2>
      <p>${op.does}</p>
      <div class="row">
        ${badge(op.label)}
        <span class="hint">${op.why || LABEL_HELP[op.label]}</span>
      </div>
      ${
        op.resource
          ? html`
            <ul class="facts">
              <li>
                Resource:
                <a href=${app.href("resources", `${op.resource}/schema`)}>${op.resource}</a>
                (<a href=${app.href("resources", op.resource)}>records</a>)
              </li>
              ${op.keyFrom ? html`<li>Record found by: <code>${op.keyFrom}</code></li>` : nothing}
            </ul>
          `
          : nothing
      }
      <p class="hint">
        A request with <code>Prefer: code=404</code> (or <code>example=name</code>) gets that
        response as the spec writes it, and nothing is stored.
      </p>
    </section>

    ${
      op.parameters.length
        ? html`
          <section class="card">
            <h2>Parameters</h2>
            <div class="scroll">
              <table class="plain">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>In</th>
                    <th>Type</th>
                    <th>Used by the mock for</th>
                  </tr>
                </thead>
                <tbody>
                  ${op.parameters.map(
                    (one) => html`
                      <tr title=${one.description || ""}>
                        <td>
                          <code>${one.name}</code>
                          ${one.required ? html`<span class="tag">required</span>` : nothing}
                        </td>
                        <td>${one.in}</td>
                        <td>${one.type}</td>
                        <td>${one.role || html`<span class="hint">validated only</span>`}</td>
                      </tr>
                    `,
                  )}
                </tbody>
              </table>
            </div>
          </section>
        `
        : nothing
    }

    <section class="card">
      <h2>Request body</h2>
      ${
        op.request
          ? html`<p>
            ${op.request.required ? "Required" : "Optional"}: ${holds(op.request)}
            <span class="hint">${(op.request.contentTypes || []).join(", ")}</span>
          </p>`
          : html`<p class="hint">None.</p>`
      }
    </section>

    <section class="card">
      <h2>Responses</h2>
      <p class="hint">Select a response to see its sample.</p>
      <div class="scroll">
        <table class="plain responses">
          <thead>
            <tr>
              <th>Status</th>
              <th>Schema</th>
              <th>Data source</th>
              <th>Returned</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            ${op.responses.map(
              (one) => html`
                <tr
                  class=${this.open && one.code === shownCode ? "current" : ""}
                  tabindex=${pickable(one) ? "0" : nothing}
                  aria-selected=${pickable(one) ? String(this.open && one.code === shownCode) : nothing}
                  @click=${pickable(one) ? () => this.pick(one) : nothing}
                  @keydown=${pickable(one) ? onKey(one) : nothing}
                >
                  <td>${status(one.code)}</td>
                  <td>
                    ${model(one)}
                    ${
                      one.contentTypes
                        ? html`<div class="hint">${one.contentTypes.join(", ")}</div>`
                        : nothing
                    }
                  </td>
                  <td>${dataSource(one)}</td>
                  <td>
                    ${
                      one.returned
                        ? html`<span class="clean">by default</span>`
                        : /^[1-5]\d\d$/.test(one.code)
                          ? html`<code>Prefer: code=${one.code}</code>`
                          : html`<span class="hint">for an undocumented code</span>`
                    }
                  </td>
                  <td>${one.description || ""}</td>
                </tr>
              `,
            )}
          </tbody>
        </table>
      </div>
    </section>

    ${
      this.open
        ? html`<aside
            class="drawer response-drawer"
            aria-label="Sample response ${shownCode}"
            @keydown=${(e) => e.key === "Escape" && (this.open = false)}
          >
            <button
              class="close"
              aria-label="Close the sample"
              title="Close (Esc)"
              @click=${() => (this.open = false)}
            >
              ${icon("close")}
            </button>
            <div class="drawer-body">
              <h3>Sample response ${shownCode ? status(shownCode) : nothing}</h3>
      ${
        !sample
          ? html`<p class="empty">Loading…</p>`
          : sample.error
            ? html`<p class="hint">The mock could not make one: ${sample.error}</p>`
            : html`
                    <p class="hint">
                      Status ${sample.status},
                      ${
                        sample.source === "generated"
                          ? "generated from the schema"
                          : sample.source === "empty"
                            ? "with no body"
                            : `from the spec's ${sample.source}`
                      }.
                      ${
                        this.picked
                          ? html`A request with <code>Prefer: code=${this.picked}</code> gets it; nothing is stored.`
                          : op.action === "none"
                            ? "This is what a call returns."
                            : "It shows the shape: a call returns stored records in its place."
                      }
                    </p>
                    <pre class="sample">${pretty(sample.body) || "(no body)"}</pre>
                  `
      }
                    </div>
          </aside>`
        : nothing
    }
  `;
  }
}

customElements.define("rapidoc-mock-operation-detail", MockOperationDetail);
