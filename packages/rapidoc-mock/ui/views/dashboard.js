import { html, nothing } from "lit";
import { Screen } from "../components/screen.js";
import { LABELS, LABEL_HELP, badge } from "../labels.js";
import { count, found, lintRow, measured, number, share, tally } from "../lint.js";

/** The Dashboard: what the mock made of the API in view, at a glance. */
export class MockDashboard extends Screen {
  static properties = {
    app: { attribute: false },
    api: { attribute: false },
    /** The lint result of the spec, where the mock lints: the Lint card. Null while it is read. */
    lint: { attribute: false },
  };

  /** Lint at a glance: the share of checks that passed and each category, which link to the Lint section. */
  lintCard() {
    const { app, lint } = this;
    if (!lint || lint.error) {
      return html`<section class="card">
        <h2>Lint</h2>
        <p class="hint">${lint ? `Lint failed: ${lint.error}` : "Linting the spec…"}</p>
      </section>`;
    }
    const summary = lint.summary;
    const to = (query) => app.href("lint", "", undefined, query);
    return html`
      <section class="card">
        <h2>${lint.linted ? "Lint" : "Not valid OpenAPI"}</h2>
        <p class="lint-total">
          ${
            measured(summary)
              ? html`<b>${share(summary)}</b> of ${number(summary.checked)} checks passed ·`
              : nothing
          }
          ${found(tally(lint))}
        </p>
        ${
          summary?.categories.length
            ? html`<div class="lint-rows columns">
                ${summary.categories.map((category) =>
                  lintRow(category, {
                    label: category.title,
                    title: category.about,
                    href: to({ category: category.id }),
                  }),
                )}
              </div>`
            : nothing
        }
        <p>
          <a href=${to()}>
            ${
              lint.problems.length
                ? `See all ${count(lint.problems.length, "finding")}`
                : "See the rules that ran"
            }
          </a>
        </p>
      </section>
    `;
  }

  render() {
    const { app, api } = this;
    const total = api.operations.length || 1;
    const records = api.resources.reduce((sum, one) => sum + one.records, 0);
    const review = [
      ...api.resources
        .filter((one) => one.review)
        .map((one) => ({
          what: one.name,
          why: one.review,
          href: app.href("resources", one.name),
        })),
      ...api.operations
        .filter((op) => op.label === "needsReview" && op.why)
        .map((op) => ({
          what: `${op.method} ${op.path}`,
          why: op.why,
          href: app.href("operations"),
        })),
    ];
    const shown = review.slice(0, 8);
    return html`
    <div class="title">
      <h1>${api.title || api.id}</h1>
      <p>Served at <code>/${api.id}</code>. What the mock worked out from this spec.</p>
    </div>
    <div class="cards">
      <a class="card stat" href=${app.href("resources")}>
        <b>${api.resources.length}</b><span>Resources</span>
      </a>
      <a class="card stat" href=${app.href("resources")}> <b>${records}</b><span>Records</span> </a>
      <a class="card stat" href=${app.href("operations")}>
        <b>${api.operations.length}</b><span>Operations</span>
      </a>
    </div>

    ${this.lint === undefined ? nothing : this.lintCard()}

    <section class="card">
      <h2>Operations by label</h2>
      <div class="bar" role="img" aria-label="Share of operations per label">
        ${Object.keys(LABELS).map((label) =>
          api.labels[label]
            ? html`<span
                class=${label}
                style="flex-grow: ${api.labels[label]}"
                title="${api.labels[label]} ${LABELS[label]}"
              ></span>`
            : nothing,
        )}
      </div>
      <dl class="legend">
        ${Object.keys(LABELS).map(
          (label) => html`
            <div>
              <dt>
                ${badge(label)}
                <b>${api.labels[label]}</b>
                <span class="hint">${Math.round((100 * api.labels[label]) / total)}%</span>
              </dt>
              <dd>${LABEL_HELP[label]}</dd>
            </div>
          `,
        )}
      </dl>
    </section>

    <section class="card">
      <h2>Assumptions to review (${review.length})</h2>
      ${
        review.length
          ? html`
            <ul class="review">
              ${shown.map(
                (one) => html`
                  <li>
                    <a href=${one.href}><code>${one.what}</code></a>
                    <span>${one.why}</span>
                  </li>
                `,
              )}
            </ul>
            ${
              review.length > shown.length
                ? html`<p>
                  <a
                    href=${app.href("operations", "", undefined, { label: "needsReview" })}
                    >See all ${api.labels.needsReview} operations that need review</a
                  >
                </p>`
                : nothing
            }
          `
          : html`<p class="hint">Nothing was assumed about any mapped operation.</p>`
      }
      ${
        review.length
          ? html`<p class="hint">
            An operation is labelled Needs review for its own assumption, or for one about its
            resource.
          </p>`
          : nothing
      }
    </section>

    <section class="card">
      <h2>Resources</h2>
      ${
        api.resources.length
          ? html`
            <ul class="chips">
              ${api.resources.map(
                (one) => html`
                  <li>
                    <a href=${app.href("resources", one.name)}>
                      ${one.name} <span class="count">${one.records}</span>
                    </a>
                  </li>
                `,
              )}
            </ul>
          `
          : html`<p class="hint">
            The mock found no resource in this spec: every operation is static, answered from examples or generated data.
          </p>`
      }
    </section>
  `;
  }
}

customElements.define("rapidoc-mock-dashboard", MockDashboard);
