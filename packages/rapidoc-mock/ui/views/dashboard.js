import { html, nothing } from "lit";
import { bars, opens, pageTitle } from "../components/parts.js";
import { Screen } from "../components/screen.js";
import { icon } from "../icons.js";
import { LABELS, LABEL_ABOUT, LABEL_COLORS, badge, method } from "../labels.js";
import { count, marked, number, plural } from "../format.js";
import { found, measured, passedMeter, ring, share, tally } from "../lint.js";

/** The Dashboard: what the mock made of the API in view, at a glance. */
export class MockDashboard extends Screen {
  static properties = {
    app: { attribute: false },
    api: { attribute: false },
    /** The lint result of the spec, where the mock lints: the Lint card. Null while it is read. */
    lint: { attribute: false },
    /** Whether every assumption is listed, not the first few. */
    allAssumptions: { state: true },
  };

  constructor() {
    super();
    this.allAssumptions = false;
  }

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
    const { errors, warnings } = tally(lint);
    return html`
      <section class="card lint-card">
        <div class="row">
          <h2>${lint.linted ? "Lint" : "Not valid OpenAPI"}</h2>
          <span class="grow"></span>
          <a href=${to()}>
            ${lint.problems.length ? `See all ${count(lint.problems.length, "finding")} →` : "See the rules that ran →"}
          </a>
        </div>
        <div class="lint-card-body">
          <div class="lint-card-total">
            ${measured(summary) ? ring(summary, { size: 112, inside: true }) : nothing}
            ${
              measured(summary)
                ? html`<p class="hint">of ${number(summary.checked)} checks passed</p>`
                : nothing
            }
            <ul class="lint-card-counts">
              <li><b class=${errors ? "errors" : ""}>${number(errors)}</b> ${plural(errors, "error")}</li>
              <li><b class=${warnings ? "warnings" : ""}>${number(warnings)}</b> ${plural(warnings, "warning")}</li>
            </ul>
          </div>
          ${
            summary?.categories.length
              ? html`<table class="plain lint-categories">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th><span class="visually-hidden">Share passed</span></th>
                      <th class="number">Passed</th>
                      <th class="number">Found</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${summary.categories.map(
                      (category) => html`
                        <tr
                          class="opens"
                          title=${category.about}
                          @click=${opens(() => (location.hash = to({ category: category.id }))).click}
                        >
                          <td><a href=${to({ category: category.id })}>${category.title}</a></td>
                          <td class="meter-cell">
                            ${measured(category) ? passedMeter(category) : nothing}
                          </td>
                          <td class="number">
                            ${measured(category) ? share(category) : html`<span class="hint">—</span>`}
                          </td>
                          <td class="number">${found(category)}</td>
                        </tr>
                      `,
                    )}
                  </tbody>
                </table>`
              : nothing
          }
        </div>
      </section>
    `;
  }

  render() {
    const { app, api } = this;
    const total = api.operations.length || 1;
    const records = api.resources.reduce((sum, one) => sum + one.records, 0);
    // what the mock assumed: about a resource (its key, its path), or about one operation; an operation is also
    // labelled Needs review for an assumption about its resource, with none of its own to list
    const resourcesAssumed = api.resources.filter((one) => one.review);
    const operationsAssumed = api.operations.filter((op) => op.label === "needsReview" && op.why);
    const review = [
      ...resourcesAssumed.map((one) => ({
        kind: "Resource",
        what: html`<code>${one.name}</code>`,
        why: one.review,
        href: app.href("resources", one.name),
      })),
      ...operationsAssumed.map((op) => ({
        kind: "Operation",
        what: html`${method(op.method)} <code>${op.path}</code>`,
        why: op.why,
        href: app.href("operations", op.id),
      })),
    ];
    const shown = this.allAssumptions ? review : review.slice(0, 8);
    const fromResource = api.labels.needsReview - operationsAssumed.length;
    return html`
    ${pageTitle(
      "dashboard",
      api.title || api.id,
      html`Served at <code>/${api.id}</code>. What the mock worked out from this spec.`,
    )}
    <div class="cards">
      <a class="card stat with-icon" href=${app.href("operations")}>
        <b>${api.operations.length}</b><span>Operations</span>${icon("operations", 40)}
      </a>
      <a class="card stat with-icon" href=${app.href("resources")}>
        <b>${api.resources.length}</b><span>Resources</span>${icon("resources", 40)}
      </a>
      <a class="card stat with-icon" href=${app.href("resources")}>
        <b>${records}</b><span>Records</span>${icon("records", 40)}
      </a>
    </div>

    ${this.lint === undefined ? nothing : this.lintCard()}

    <section class="card">
      <h2>Operations by label</h2>
      <div class="legend">
        ${Object.keys(LABELS).map((label) => {
          const inside = html`
            <span class="legend-head">
              ${badge(label)}
              <b>${api.labels[label]}</b>
              <span class="hint">${Math.round((100 * api.labels[label]) / total)}%</span>
            </span>
            <span class="legend-help">${LABEL_ABOUT[label]}</span>
          `;
          // a label opens the operations that have it; one that none has leads nowhere
          return api.labels[label]
            ? html`<a
                class="legend-item"
                href=${app.href("operations", "", undefined, { label })}
                title="See the ${api.labels[label]} ${LABELS[label]} operations"
                >${inside}</a
              >`
            : html`<div class="legend-item">${inside}</div>`;
        })}
      </div>
      ${bars(
        Object.keys(LABELS).map((label) => ({
          value: api.labels[label],
          color: LABEL_COLORS[label],
          title: `${api.labels[label]} ${LABELS[label]}`,
        })),
        { label: "Share of operations per label", height: 10 },
      )}
    </section>

    <section class="card">
      <h2>Assumptions Rapi Mock made that need your review (${review.length})</h2>
      ${
        review.length
          ? html`
            <p class="hint">
              Where the spec left something open, the mock guessed. These are its guesses: about
              ${count(resourcesAssumed.length, "resource")} (a key, a path) and
              ${count(operationsAssumed.length, "operation")}. Check each one, and state the right answer in
              <code>mock.config.yaml</code> where it guessed wrong.
            </p>
            <div class="scroll">
              <table class="plain">
                <thead>
                  <tr>
                    <th>Kind</th>
                    <th>Resource or operation</th>
                    <th>What was assumed</th>
                  </tr>
                </thead>
                <tbody>
                  ${shown.map(
                    (one) => html`
                      <tr>
                        <td class="hint">${one.kind}</td>
                        <td class="path"><a href=${one.href}>${one.what}</a></td>
                        <td>${marked(one.why)}</td>
                      </tr>
                    `,
                  )}
                </tbody>
              </table>
            </div>
            <div class="row">
              ${
                review.length > 8
                  ? html`<button @click=${() => (this.allAssumptions = !this.allAssumptions)}>
                      ${this.allAssumptions ? "Show the first 8" : `Show all ${review.length}`}
                    </button>`
                  : nothing
              }
              <span class="hint">
                ${count(api.labels.needsReview, "operation")} ${plural(api.labels.needsReview, "is", "are")}
                labelled Needs review:
                ${operationsAssumed.length} for an assumption of ${plural(operationsAssumed.length, "its", "their")}
                own${fromResource > 0 ? `, ${fromResource} for one about ${plural(fromResource, "its", "their")} resource` : ""}.
              </span>
              <a href=${app.href("operations", "", undefined, { label: "needsReview" })}>See them all</a>
            </div>
          `
          : html`<p class="hint">The mock made no assumption that needs a look.</p>`
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
