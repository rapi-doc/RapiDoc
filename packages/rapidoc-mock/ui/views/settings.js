import { html, nothing } from "lit";
import { pageTitle } from "../components/parts.js";
import { Screen } from "../components/screen.js";

/** A whole number from a form field, or undefined when it is not one in the range. */
const whole = (form, name, max) => {
  const value = Number(new FormData(form).get(name));
  return Number.isInteger(value) && value >= 0 && value <= max ? value : undefined;
};

/** Settings: how the mock was started, and what can change while it runs. */
export class MockSettings extends Screen {
  static properties = {
    app: { attribute: false },
    server: { attribute: false },
    busy: { type: Boolean },
  };

  render() {
    const { app, server } = this;
    const started = [
      ["State", server.stateful ? "kept (--stateful)" : "not kept", "--stateful"],
      ["Seed", server.seed, `--seed ${server.seed}`],
      ["Records per resource", server.rows, `--rows ${server.rows}`],
      ["Response delay", `${server.delay} ms`, `--delay ${server.delay}`],
      ["Gap between stream items", `${server.streamInterval} ms`, "--stream-interval"],
      [
        "Tokens",
        server.issuer
          ? `verified against ${server.issuer}${server.audience ? ` for ${server.audience}` : ""}`
          : "accepted unchecked",
        "--issuer, --audience",
      ],
    ];
    return html`
    ${pageTitle(
      "settings",
      "Settings",
      "What you change here lasts until the mock stops. To keep a setting, start the mock with the option shown beside it.",
    )}

    <section class="card">
      <h2>Seed data</h2>
      <p class="hint">
        The records every resource starts with. New seed data replaces all stored records, in every
        session and every API.
      </p>
      <form
        class="row"
        @submit=${(e) => {
          e.preventDefault();
          const rows = whole(e.target, "rows", 1000);
          const seed = whole(e.target, "seed", 2 ** 31);
          if (rows === undefined || seed === undefined) {
            app.error = "Rows is a whole number from 0 to 1000, and seed a whole number from 0.";
            return;
          }
          app.reseed(rows, seed);
        }}
      >
        <label class="stack">
          <span>Records per resource</span>
          <input name="rows" type="number" min="0" max="1000" step="1" .value=${String(server.rows)} />
          <code>--rows</code>
        </label>
        <label class="stack">
          <span>Seed</span>
          <input name="seed" type="number" min="0" step="1" .value=${String(server.seed)} />
          <code>--seed</code>
        </label>
        <button class="primary" ?disabled=${this.busy || !server.stateful}>Reseed</button>
      </form>
      ${
        server.stateful
          ? nothing
          : html`<p class="hint">The mock keeps no state: start it with <code>--stateful</code>.</p>`
      }
    </section>

    <section class="card">
      <h2>Response delay</h2>
      <p class="hint">
        Every API response waits this long before it is sent, to see loading states in a client. The
        mock's own endpoints are not delayed.
      </p>
      <form
        class="row"
        @submit=${(e) => {
          e.preventDefault();
          const delay = whole(e.target, "delay", 60000);
          if (delay === undefined) {
            app.error = "Delay is a whole number of milliseconds, 0 to 60000.";
            return;
          }
          app.setDelay(delay);
        }}
      >
        <label class="stack">
          <span>Delay (ms)</span>
          <input
            name="delay"
            type="number"
            min="0"
            max="60000"
            step="1"
            .value=${String(server.delay)}
          />
          <code>--delay</code>
        </label>
        <button class="primary" ?disabled=${this.busy}>Apply</button>
      </form>
    </section>

    <section class="card">
      <h2>This server</h2>
      <div class="scroll">
        <table class="plain">
          <thead>
            <tr>
              <th>Setting</th>
              <th>Now</th>
              <th>Option</th>
            </tr>
          </thead>
          <tbody>
            ${started.map(
              ([name, value, option]) => html`
                <tr>
                  <td>${name}</td>
                  <td>${value}</td>
                  <td><code>${option}</code></td>
                </tr>
              `,
            )}
          </tbody>
        </table>
      </div>
    </section>

    <section class="card">
      <h2>APIs</h2>
      <div class="scroll">
        <table class="plain">
          <thead>
            <tr>
              <th>Served at</th>
              <th>Title</th>
              <th>Operations</th>
              <th>State</th>
              <th>Spec</th>
            </tr>
          </thead>
          <tbody>
            ${server.apis.map(
              (api) => html`
                <tr>
                  <td><code>/${api.id}</code></td>
                  <td>${api.title || ""}</td>
                  <td>${api.operations}</td>
                  <td>${api.stateful ? "kept" : "not kept"}</td>
                  <td class="path">${api.file || ""}</td>
                </tr>
              `,
            )}
          </tbody>
        </table>
      </div>
    </section>
  `;
  }
}

customElements.define("rapidoc-mock-settings", MockSettings);
