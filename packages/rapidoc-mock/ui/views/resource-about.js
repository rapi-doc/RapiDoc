import { html, nothing } from "lit";
import { LABELS } from "../labels.js";

const shown = (value) => (typeof value === "string" ? value : JSON.stringify(value));

/** What the mock knows about a resource: its fields and how each is seeded, its links, its operations. */
export function resourceAbout(host) {
  const resource = host.detail;
  if (!resource) return html`<p class="empty">Loading…</p>`;
  const flags = (field) =>
    [field.key && "key", field.required && "required", field.readOnly && "read only"].filter(
      Boolean,
    );
  return html`
    <section class="card">
      <h3>Schema</h3>
      <p class="hint">
        Described by the schema <code>${resource.schema}</code>. Stored at
        <code>${resource.path || "no item path"}</code>${
          resource.alsoAt
            ? html`, also reached at ${resource.alsoAt.map((path) => html` <code>${path}</code>`)}`
            : nothing
        }.
      </p>
      <div class="scroll">
        <table class="plain">
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
            ${resource.fields.map(
              (field) => html`
                <tr>
                  <td><code>${field.name}</code></td>
                  <td>
                    ${field.type}${
                      field.format ? html` <span class="hint">${field.format}</span>` : nothing
                    }
                    ${
                      field.enum
                        ? html`<div class="hint">${field.enum.map(shown).join(", ")}</div>`
                        : nothing
                    }
                  </td>
                  <td>${flags(field).map((flag) => html`<span class="tag">${flag}</span> `)}</td>
                  <td class="example">${field.example === undefined ? "" : shown(field.example)}</td>
                  <td class="seeded">${field.seededAs}</td>
                </tr>
              `,
            )}
          </tbody>
        </table>
      </div>
      <p class="hint">
        The first seeded record shows the spec's examples; the others are made as "Seeded as" says.
      </p>
    </section>

    <section class="card">
      <div class="row">
        <h3>Sample record</h3>
        <span class="grow"></span>
        <button @click=${() => host.generateSample()} ?disabled=${host.busy}>
          ${host.sample ? "Generate another" : "Generate sample"}
        </button>
      </div>
      ${
        host.sample
          ? html`<pre class="sample">${JSON.stringify(host.sample.record, null, 2)}</pre>
            <p class="hint">Generated with seed ${host.sample.seed}. Nothing was stored.</p>`
          : html`<p class="hint">A new record as the mock would seed it. Nothing is stored.</p>`
      }
    </section>

    <section class="card">
      <h3>Links to other resources</h3>
      ${
        resource.relations.length || resource.referencedBy.length
          ? html`
            <ul class="facts">
              ${resource.relations.map((one) => {
                const target = one.to?.split(".")[0];
                return html`
                  <li>
                    <code>${one.field}</code> points at
                    ${
                      target
                        ? html`<a href=${host.href("resources", `${target}/about`)}>${one.to}</a>`
                        : "no resource the mock knows"
                    }
                    ${one.why ? html`<span class="hint">${one.why}</span>` : nothing}
                  </li>
                `;
              })}
              ${resource.referencedBy.map((id) => {
                const from = id.split(".")[0];
                return html`
                  <li>
                    <a href=${host.href("resources", `${from}/about`)}>${from}</a> points here with
                    <code>${id.slice(from.length + 1)}</code>
                  </li>
                `;
              })}
            </ul>
          `
          : html`<p class="hint">None found.</p>`
      }
    </section>

    <section class="card">
      <h3>Operations (${resource.operations.length})</h3>
      <div class="scroll">
        <table class="plain">
          <tbody>
            ${resource.operations.map(
              (op) => html`
                <tr>
                  <td><span class="method">${op.method}</span></td>
                  <td class="path"><a href=${host.href("operations", op.id)}>${op.path}</a></td>
                  <td>${op.action}</td>
                  <td><span class="badge ${op.label}">${LABELS[op.label]}</span></td>
                </tr>
              `,
            )}
          </tbody>
        </table>
      </div>
    </section>
  `;
}
