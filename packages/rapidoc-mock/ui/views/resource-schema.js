import { html, nothing } from "lit";
import { twist } from "../components/parts.js";
import { Screen } from "../components/screen.js";
import { sentence, valueText } from "../format.js";
import { badge, method } from "../labels.js";

/** The shapes of one of several objects, in words: "is one of 4 shapes, told apart by platform: a, b, c, d". */
const shapes = (resource) => {
  const shape = resource.shape;
  return html`<code>${resource.schema}</code> is ${shape.kind === "oneOf" ? "one" : "any"} of
    ${shape.options.length} shapes${shape.by ? html`, told apart by <code>${shape.by}</code>` : ""}:
    ${shape.options.map((one, index) => html`${index ? ", " : ""}<code>${one}</code>`)}.`;
};

/** Why a resource has no fields, in a sentence, from the shape its schema has instead. */
const noFields = (resource) =>
  !resource.shape?.options
    ? html`<code>${resource.schema}</code> describes no fields of its own, so there is nothing to list here.`
    : html`${shapes(resource)} None of them describes fields of its own, so there is nothing to list here.`;

/** Every field that holds nested fields, by its path (`to`, `to.name`): what "Expand all" opens. */
const branches = (fields, at = "") =>
  fields.flatMap((field) => {
    const path = at ? `${at}.${field.name}` : field.name;
    return field.fields ? [path, ...branches(field.fields, path)] : [];
  });

/**
 * The Schema tab of a resource: its fields and how each is seeded (the key first), the operations on it, and its
 * links to other resources.
 */
export class MockResourceSchema extends Screen {
  static properties = {
    app: { attribute: false },
    /** The id of the API and the name of the resource. */
    api: { type: String },
    name: { type: String },
    version: { type: Number },
    /** The resource as the control API describes it. */
    detail: { state: true },
    /** The paths of the fields whose nested fields are shown (`to`, `to.name`). */
    open: { state: true },
  };

  constructor() {
    super();
    this.detail = null;
    this.open = new Set();
  }

  toggle(path) {
    const open = new Set(this.open);
    if (open.has(path)) open.delete(path);
    else open.add(path);
    this.open = open;
  }

  get address() {
    return `/model/${encodeURIComponent(this.api)}/resources/${encodeURIComponent(this.name)}`;
  }

  updated(changed) {
    if (["api", "name", "version"].some((one) => changed.has(one)))
      this.read("detail", this.address, (detail) => (this.detail = detail));
  }

  render() {
    const { app } = this;
    const resource = this.detail;
    if (!resource) return html`<p class="empty">Loading…</p>`;
    const flags = (field) =>
      [field.key && "key", field.required && "required", field.readOnly && "read only"].filter(
        Boolean,
      );
    const all = branches(resource.fields);
    // the key first, the rest in the schema's order
    const fields = [
      ...resource.fields.filter((field) => field.key),
      ...resource.fields.filter((field) => !field.key),
    ];
    // a field's row, then (when it is open) the rows of its nested fields, a level further in
    const rows = (fields, at = "", depth = 0) =>
      fields.flatMap((field) => {
        const path = at ? `${at}.${field.name}` : field.name;
        const open = this.open.has(path);
        const row = html`
          <tr class=${depth ? `nested depth-${Math.min(depth, 3)}` : ""}>
            <td class="field" style="--depth: ${depth}">
              ${
                field.fields
                  ? html`<button
                      class="expander"
                      aria-expanded=${String(open)}
                      aria-label="${open ? "Hide" : "Show"} the fields of ${path}"
                      @click=${() => this.toggle(path)}
                    >
                      ${twist(open)}
                    </button>`
                  : html`<span class="expander-space"></span>`
              }<code>${field.name}</code>
            </td>
            <td>
              ${field.type}${
                field.format ? html` <span class="hint">${field.format}</span>` : nothing
              }
              ${
                field.enum
                  ? html`<div class="hint">${field.enum.map(valueText).join(", ")}</div>`
                  : nothing
              }
            </td>
            <td>
              ${flags(field).map((flag) => html`<span class="tag">${flag}</span> `)}
              ${
                field.onlyIn
                  ? html`<div class="hint" title=${field.onlyIn.join(", ")}>
                      only in ${field.onlyIn.length} of ${resource.shape.options.length} shapes
                    </div>`
                  : nothing
              }
            </td>
            <td class="example">${field.example === undefined ? "" : valueText(field.example)}</td>
            <td class="seeded">${field.seededAs ?? ""}</td>
          </tr>
        `;
        return open && field.fields ? [row, ...rows(field.fields, path, depth + 1)] : [row];
      });
    return html`
    <section class="card">
      <h3>Fields</h3>
      <p class="hint">
        Described by the schema <code>${resource.schema}</code>. Stored at
        <code>${resource.path || "no item path"}</code>${
          resource.alsoAt
            ? html`, also reached at ${resource.alsoAt.map((path) => html` <code>${path}</code>`)}`
            : nothing
        }.
      </p>
      ${
        resource.fields.length
          ? nothing
          : html`<div class="empty-shape">
              <p>${noFields(resource)}</p>
              <p class="hint">
                Its records are stored and counted, but they are empty, and no field could be its key.
                Requests to its operations are still answered from the spec's examples.
              </p>
            </div>`
      }
      ${
        resource.fields.length && resource.shape?.options
          ? html`<p class="hint">
              ${shapes(resource)} Each record is one of them, in turn: the fields below are all of theirs, and
              a field only some of them have says which.
            </p>`
          : nothing
      }
      ${
        all.length
          ? html`<div class="row">
              <button @click=${() => (this.open = new Set(all))}>Expand all</button>
              <button @click=${() => (this.open = new Set())}>Collapse all</button>
              <span class="hint">An object field lists its own fields under it.</span>
            </div>`
          : nothing
      }
      ${
        resource.fields.length
          ? html`
      <div class="scroll">
        <table class="plain fields">
          <thead>
            <tr>
              <th>Field</th>
              <th>Type</th>
              <th>Flags</th>
              <th>Example</th>
              <th>Seeded as</th>
            </tr>
          </thead>
          <tbody>
            ${rows(fields)}
          </tbody>
        </table>
      </div>
      <p class="hint">
        The first seeded record shows the spec's examples; the others are made as "Seeded as" says. A field
        that copies another resource's records takes their values, so its nested fields say nothing here.
      </p>
      `
          : nothing
      }
    </section>

    <section class="card">
      <h3>Operations on <span class="keep-case">${resource.name}</span> (${resource.operations.length})</h3>
      <div class="scroll">
        <table class="plain">
          <thead>
            <tr>
              <th>Method</th>
              <th>Path</th>
              <th>Does</th>
              <th>Label</th>
            </tr>
          </thead>
          <tbody>
            ${resource.operations.map(
              (op) => html`
                <tr>
                  <td>${method(op.method)}</td>
                  <td class="path"><a href=${app.href("operations", op.id)}>${op.path}</a></td>
                  <td>${op.action}</td>
                  <td>${badge(op.label)}</td>
                </tr>
              `,
            )}
          </tbody>
        </table>
      </div>
    </section>

    <section class="card">
      <h3>Links to other resources</h3>
      ${
        resource.relations.length
          ? html`<div class="scroll">
              <table class="plain">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Points at</th>
                    <th>How it was matched</th>
                  </tr>
                </thead>
                <tbody>
                  ${resource.relations.map((one) => {
                    const target = one.to?.split(".")[0];
                    return html`
                      <tr>
                        <td><code>${one.field}</code></td>
                        <td>
                          ${
                            target
                              ? html`<a href=${app.href("resources", `${target}/schema`)}>${one.to}</a>`
                              : html`<span class="hint">nothing</span>`
                          }
                        </td>
                        <td>
                          ${
                            target
                              ? sentence(one.why) || "by the field's name"
                              : html`${sentence(one.why) || "No resource fits its name"}. The mock fills it
                                with generated values.`
                          }
                        </td>
                      </tr>
                    `;
                  })}
                </tbody>
              </table>
            </div>`
          : html`<p class="hint">No field of ${resource.name} points at another resource.</p>`
      }
      ${
        resource.referencedBy.length
          ? html`<h4>Fields of other resources that point here</h4>
              <div class="scroll">
                <table class="plain">
                  <thead>
                    <tr>
                      <th>Resource</th>
                      <th>Field</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${resource.referencedBy.map((id) => {
                      const from = id.split(".")[0];
                      return html`
                        <tr>
                          <td><a href=${app.href("resources", `${from}/schema`)}>${from}</a></td>
                          <td><code>${id.slice(from.length + 1)}</code></td>
                        </tr>
                      `;
                    })}
                  </tbody>
                </table>
              </div>`
          : nothing
      }
    </section>
  `;
  }
}

customElements.define("rapidoc-mock-resource-schema", MockResourceSchema);
