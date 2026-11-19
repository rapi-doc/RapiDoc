import { html, nothing } from "lit";
import { Screen } from "../components/screen.js";
import { count, lintRow, measured, number, share, tally } from "../lint.js";

/** How many findings are drawn at a time: a large spec has thousands. */
const PAGE = 100;

/**
 * Lint: what a lint run found in the spec, by category and rule, and every finding. Shown where the mock lints
 * (`app.hasLint`); `lint` is null while the result is read, and `{ error }` when that failed.
 * The category or rule looked at is in the address (`?category=<id>`, `?rule=<name>`); the text filter and
 * the severity are kept here.
 */
export class MockLint extends Screen {
  static properties = {
    app: { attribute: false },
    lint: { attribute: false },
    /** The id of the category whose findings are shown, as the address asks. */
    category: { type: String },
    /** The rule whose findings are shown, as the address asks. */
    rule: { type: String },
    filter: { state: true },
    severity: { state: true },
    limit: { state: true },
  };

  constructor() {
    super();
    this.category = "";
    this.rule = "";
    this.filter = "";
    this.severity = "";
    this.limit = PAGE;
  }

  willUpdate(changed) {
    if (["lint", "category", "rule", "filter", "severity"].some((name) => changed.has(name)))
      this.limit = PAGE;
  }

  render() {
    const { app, lint } = this;
    if (!lint || lint.error) {
      return html`
        <div class="title">
          <h1>Lint</h1>
          <p>What the spec could say more clearly.</p>
        </div>
        ${
          lint
            ? html`<p class="banner error" role="alert">Lint failed: ${lint.error}</p>`
            : html`<p class="empty">Linting the spec…</p>`
        }
      `;
    }
    const summary = lint.summary;
    const categories = summary?.categories || [];
    const { errors, warnings } = tally(lint);
    // what the address picked: a rule, or a category (also the one a picked rule is in)
    const inCategory = categories.find((one) =>
      this.rule ? one.rules.some((rule) => rule.name === this.rule) : one.id === this.category,
    );
    const picked = this.rule ? inCategory?.rules.find((rule) => rule.name === this.rule) : null;
    const rules = picked
      ? [picked.name]
      : inCategory
        ? inCategory.rules.map((rule) => rule.name)
        : null;
    const inScope = rules ? lint.problems.filter((one) => rules.includes(one.rule)) : lint.problems;
    const text = this.filter.trim().toLowerCase();
    const kept = inScope.filter(
      (one) =>
        (!this.severity || one.severity === this.severity) &&
        (!text ||
          `${one.rule} ${one.message} ${one.pointer.join(" ")}`.toLowerCase().includes(text)),
    );
    const shown = kept.slice(0, this.limit);
    const to = (query) => app.href("lint", "", undefined, query);

    return html`
      <div class="title">
        <h1>${lint.linted ? "Lint" : "Not valid OpenAPI"}</h1>
        <p>
          ${
            lint.linted
              ? html`What the spec could say more clearly, by the rules of
                  <code>rapidoc lint --stateful</code>.`
              : "The spec is not valid OpenAPI, so it was not linted. Fix these errors first."
          }
        </p>
      </div>
      ${
        lint.mockError
          ? html`<p class="banner error">The mock can't start on this spec: ${lint.mockError}</p>`
          : nothing
      }
      <div class="cards">
        ${
          measured(summary)
            ? html`<div class="card stat">
                <b>${share(summary)}</b>
                <span>of ${number(summary.checked)} checks passed</span>
              </div>`
            : nothing
        }
        <div class="card stat"><b>${number(errors)}</b><span>Errors</span></div>
        <div class="card stat"><b>${number(warnings)}</b><span>Warnings</span></div>
      </div>
      ${
        measured(summary)
          ? html`<p class="hint">Each check is one rule on one operation, body or tag.</p>`
          : nothing
      }

      <div class="split lint">
        ${
          categories.length
            ? html`
                <nav class="card side lint-rows" aria-label="Categories and rules">
                  ${lintRow(summary, {
                    label: "All findings",
                    href: to(),
                    current: !rules,
                    expanded: null,
                  })}
                  ${categories.map((category) => {
                    const open = category === inCategory;
                    return html`
                      ${lintRow(category, {
                        label: category.title,
                        title: category.about,
                        // the open category's own row closes it, back to all findings
                        href: open && !picked ? to() : to({ category: category.id }),
                        current: open && !picked,
                        expanded: open,
                      })}
                      ${
                        open
                          ? html`<div class="lint-rules">
                              ${category.rules.map((rule) =>
                                lintRow(rule, {
                                  label: rule.name,
                                  title: rule.description,
                                  href: to({ rule: rule.name }),
                                  current: rule === picked,
                                  rule: true,
                                  expanded: null,
                                }),
                              )}
                            </div>`
                          : nothing
                      }
                    `;
                  })}
                </nav>
              `
            : nothing
        }
        <div class="pane">
          <div>
            <h2>
              ${picked ? html`<code>${picked.name}</code>` : inCategory?.title || "All findings"}
            </h2>
            ${
              picked || inCategory
                ? html`<p class="hint">${picked ? picked.description : inCategory.about}</p>`
                : nothing
            }
          </div>
          <div class="row">
            <input
              type="search"
              placeholder="Filter findings"
              aria-label="Filter findings"
              .value=${this.filter}
              @input=${(e) => (this.filter = e.target.value)}
            />
            <div class="segmented" role="group" aria-label="Severity">
              ${[
                ["", "All"],
                ["error", "Errors"],
                ["warning", "Warnings"],
              ].map(
                ([value, title]) => html`
                  <button
                    class=${this.severity === value ? "current" : ""}
                    aria-pressed=${this.severity === value ? "true" : "false"}
                    @click=${() => (this.severity = value)}
                  >
                    ${title}
                  </button>
                `,
              )}
            </div>
            <span class="hint">
              ${
                kept.length === lint.problems.length
                  ? count(kept.length, "finding")
                  : `${number(kept.length)} of ${count(lint.problems.length, "finding")}`
              }
            </span>
          </div>
          ${
            kept.length
              ? html`
                  <ol class="card findings">
                    ${shown.map(
                      (one) => html`
                        <li>
                          <div class="meta">
                            <span class="severity ${one.severity}">${one.severity}</span>
                            ${
                              categories.length
                                ? html`<a href=${to({ rule: one.rule })}><code>${one.rule}</code></a>`
                                : html`<code>${one.rule}</code>`
                            }
                            <span>${one.file ? `${one.file}:${one.line}` : `line ${one.line}`}</span>
                          </div>
                          <div>${one.message}</div>
                          ${
                            one.pointer.length
                              ? html`<code class="where">${one.pointer.join(" › ")}</code>`
                              : nothing
                          }
                        </li>
                      `,
                    )}
                  </ol>
                  ${
                    kept.length > shown.length
                      ? html`<div class="row">
                          <button @click=${() => (this.limit += PAGE)}>
                            Show ${Math.min(PAGE, kept.length - shown.length)} more
                          </button>
                          <button @click=${() => (this.limit = kept.length)}>
                            Show all ${number(kept.length)}
                          </button>
                          <span class="hint">${number(shown.length)} shown</span>
                        </div>`
                      : nothing
                  }
                `
              : html`<p class="empty">
                  ${inScope.length ? "No finding matches." : "Nothing found here."}
                </p>`
          }
        </div>
      </div>
    `;
  }
}

customElements.define("rapidoc-mock-lint", MockLint);
