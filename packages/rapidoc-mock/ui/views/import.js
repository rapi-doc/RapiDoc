import { html, nothing } from "lit";
import { pageTitle } from "../components/parts.js";
import { Screen } from "../components/screen.js";

/**
 * Import spec: adds a spec to the running mock (`POST /__mock/apis`), from an address, a file or pasted text,
 * and lists the specs added so, each with a button that removes it. Shown only where the mock takes one
 * (`import` in `/settings`: the server, not a mock in a page).
 */
export class MockImport extends Screen {
  static properties = {
    app: { attribute: false },
    server: { attribute: false },
    /** Why the last import failed; empty when it did not. */
    problem: { state: true },
    /** What is being imported, while it is: "address", "file" or "text". */
    working: { state: true },
    /** A file dragged over the drop box. */
    over: { state: true },
  };

  constructor() {
    super();
    this.problem = "";
    this.working = "";
    this.over = false;
  }

  /** Sends one spec to the mock, then shows the API it now serves. */
  async send(what, body) {
    this.problem = "";
    this.working = what;
    try {
      const added = await this.app.call("/apis", { method: "POST", body });
      await this.app.load();
      // the confirmation goes on the page it leads to: a new page clears the one before's
      const shown = new Promise((done) => addEventListener("hashchange", done, { once: true }));
      location.hash = this.app.href("dashboard", "", added.id);
      await shown;
      this.app.notice = `${added.title || added.id} is served under /${added.id}.`;
    } catch (err) {
      this.problem = err.message;
    } finally {
      this.working = "";
    }
  }

  async sendFile(file) {
    if (file) await this.send("file", { text: await file.text(), name: file.name });
  }

  /** Not `remove`: that is the element's own `Element.remove()`, which Lit calls to take it off the page. */
  async removeImported(api) {
    this.problem = "";
    try {
      await this.app.call(`/apis/${encodeURIComponent(api.id)}`, { method: "DELETE" });
      await this.app.load();
      this.app.notice = `${api.title || api.id} is no longer served.`;
    } catch (err) {
      this.problem = err.message;
    }
  }

  render() {
    const imported = (this.server?.apis || []).filter((one) => one.imported);
    const busy = Boolean(this.working);
    return html`
      ${pageTitle(
        "import",
        "Import spec",
        "Add a spec to this mock while it runs. It is served under its own path, with state, until the mock stops.",
      )}

      <section class="card">
        <h2>From an address</h2>
        <form
          class="row"
          @submit=${(event) => {
            event.preventDefault();
            const url = new FormData(event.target).get("url").trim();
            if (url) this.send("address", { url });
          }}
        >
          <input
            class="grow"
            name="url"
            type="url"
            required
            spellcheck="false"
            aria-label="The spec's address"
            placeholder="https://example.com/openapi.yaml or http://localhost:8000/openapi.json"
          />
          <button class="primary" type="submit" ?disabled=${busy}>
            ${this.working === "address" ? "Loading…" : "Load"}
          </button>
        </form>
        <p class="hint">
          The mock reads it once. Relative <code>$ref</code>s are read from the same server.
        </p>
      </section>

      <section class="card">
        <h2>From a file</h2>
        <div
          class=${this.over ? "drop over" : "drop"}
          @dragover=${(event) => {
            event.preventDefault();
            this.over = true;
          }}
          @dragleave=${() => (this.over = false)}
          @drop=${(event) => {
            event.preventDefault();
            this.over = false;
            this.sendFile(event.dataTransfer.files[0]);
          }}
        >
          <span>Drop a YAML or JSON file here, or</span>
          <button ?disabled=${busy} @click=${() => this.querySelector("#import-file").click()}>
            ${this.working === "file" ? "Importing…" : "Choose a file"}
          </button>
          <input
            id="import-file"
            type="file"
            accept=".yaml,.yml,.json,application/json,text/yaml"
            hidden
            @change=${(event) => {
              this.sendFile(event.target.files[0]);
              event.target.value = "";
            }}
          />
        </div>
        <p class="hint">One file: a <code>$ref</code> to another file is not followed.</p>
      </section>

      <section class="card">
        <h2>Paste a spec</h2>
        <form
          class="stack"
          @submit=${(event) => {
            event.preventDefault();
            const text = new FormData(event.target).get("text");
            // no name: the mock names it after its title
            if (text.trim()) this.send("text", { text });
          }}
        >
          <textarea
            name="text"
            rows="8"
            spellcheck="false"
            aria-label="An OpenAPI spec, as YAML or JSON"
            placeholder="An OpenAPI 3.0, 3.1 or 3.2 spec, as YAML or JSON"
          ></textarea>
          <div class="row">
            <button class="primary" type="submit" ?disabled=${busy}>
              ${this.working === "text" ? "Importing…" : "Import"}
            </button>
          </div>
        </form>
      </section>

      ${this.problem ? html`<p class="banner error" role="alert">${this.problem}</p>` : nothing}

      <section class="card">
        <h2>Imported specs (${imported.length})</h2>
        ${
          imported.length
            ? html`<table class="plain">
                <thead>
                  <tr>
                    <th>API</th>
                    <th>Served at</th>
                    <th class="number">Operations</th>
                    <th><span class="visually-hidden">Remove</span></th>
                  </tr>
                </thead>
                <tbody>
                  ${imported.map(
                    (api) => html`
                      <tr>
                        <td>
                          <a href=${this.app.href("dashboard", "", api.id)}>${api.title || api.id}</a>
                        </td>
                        <td class="path">/${api.id}</td>
                        <td class="number">${api.operations}</td>
                        <td class="number">
                          <button @click=${() => this.removeImported(api)}>Remove</button>
                        </td>
                      </tr>
                    `,
                  )}
                </tbody>
              </table>`
            : html`<p class="hint">
                None yet. The specs the mock was started with stay, and can't be removed here.
              </p>`
        }
      </section>
    `;
  }
}

customElements.define("rapidoc-mock-import", MockImport);
