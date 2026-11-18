import { html, nothing } from "lit";
import { Screen } from "../components/screen.js";
import { LABELS, LABEL_HELP } from "../labels.js";

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

/** One operation: what the mock does for it, its parameters, request and responses. */
export class MockOperationDetail extends Screen {
  static properties = {
    app: { attribute: false },
    /** The id of the API and of the operation. */
    api: { type: String },
    operation: { type: String },
    version: { type: Number },
    /** The operation as the control API describes it. */
    detail: { state: true },
  };

  constructor() {
    super();
    this.detail = null;
  }

  updated(changed) {
    if (!["api", "operation", "version"].some((one) => changed.has(one))) return;
    const { app, api, operation } = this;
    app.run(async () => {
      const detail = await app.call(
        `/model/${encodeURIComponent(api)}/operations/${encodeURIComponent(operation)}`,
      );
      if (operation === this.operation) this.detail = detail;
    });
  }

  render() {
    const { app } = this;
    const op = this.detail;
    if (!op) return html`<p class="empty">Loading…</p>`;
    return html`
    <p><a href=${app.href("operations")}>← Operations</a></p>
    <div class="title">
      <h1 class="wrap"><span class="method">${op.method}</span> <code>${op.path}</code></h1>
      <p>${op.summary || op.id}</p>
    </div>

    <section class="card">
      <h2>What the mock does</h2>
      <p>${op.does}</p>
      <div class="row">
        <span class="badge ${op.label}">${LABELS[op.label]}</span>
        <span class="hint">${op.why || LABEL_HELP[op.label]}</span>
      </div>
      ${
        op.resource
          ? html`
            <ul class="facts">
              <li>
                Resource:
                <a href=${app.href("resources", `${op.resource}/about`)}>${op.resource}</a>
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
      <div class="scroll">
        <table class="plain">
          <thead>
            <tr>
              <th>Status</th>
              <th>Holds</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            ${op.responses.map(
              (one) => html`
                <tr>
                  <td><code>${one.code}</code></td>
                  <td>${holds(one)}</td>
                  <td>${one.description || ""}</td>
                </tr>
              `,
            )}
          </tbody>
        </table>
      </div>
    </section>

    <section class="card">
      <h2>Sample response</h2>
      ${
        op.sample?.error
          ? html`<p class="hint">The mock could not make one: ${op.sample.error}</p>`
          : html`
            <p class="hint">
              Status ${op.sample.status}, from the spec's ${op.sample.source}.
              ${
                op.action === "none"
                  ? "This is what a call returns."
                  : "It shows the shape: a call returns stored records in its place."
              }
            </p>
            <pre class="sample">${pretty(op.sample.body) || "(no body)"}</pre>
          `
      }
    </section>
  `;
  }
}

customElements.define("rapidoc-mock-operation-detail", MockOperationDetail);
