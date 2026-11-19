import { html, nothing } from "lit";
import { bars, pageTitle, segmented } from "../components/parts.js";
import { Screen } from "../components/screen.js";
import { count, number } from "../format.js";
import { checks, foundLine, lintRow, measured, ring, share, tally } from "../lint.js";

/** The share of checks that passed, as an arc of a ring beside the figure. */
function passedCard(summary) {
  return html`<div class="card stat lint-stat">
    ${ring(summary)}
    <div class="figure">
      <b>${share(summary)}</b>
      <span>of ${number(summary.checked)} checks passed</span>
    </div>
  </div>`;
}

/** How many categories a split chart colors on its own: the rest fold into "Other". */
const SERIES = 3;

/**
 * The colors of the categories in the split charts: the categories with the most findings (errors and
 * warnings together) get a series color each, in the categories' own order, so a category has the same color
 * in both cards; every other category is "Other".
 */
function seriesColors(categories) {
  const top = new Set(
    [...categories]
      .filter((one) => one.errors + one.warnings > 0)
      .sort((a, b) => b.errors + b.warnings - (a.errors + a.warnings))
      .slice(0, SERIES)
      .map((one) => one.id),
  );
  const colors = new Map();
  for (const one of categories) {
    if (top.has(one.id)) colors.set(one.id, `var(--series-${colors.size + 1})`);
  }
  return colors;
}

/**
 * Errors or warnings: the count, and beside it how they split by category: a key of each part's name and count
 * over one segmented bar (a block per category, in the categories' own order, its width its share; the
 * uncolored ones as one "Other" block at the end).
 */
function severityCard(total, severity, categories, colors) {
  const field = severity === "error" ? "errors" : "warnings";
  const title = severity === "error" ? "Errors" : "Warnings";
  const found = categories.filter((one) => one[field] > 0);
  const rest = found.filter((one) => !colors.has(one.id));
  const parts = [
    ...found
      .filter((one) => colors.has(one.id))
      .map((one) => ({ name: one.title, value: one[field], color: colors.get(one.id) })),
    ...(rest.length
      ? [
          {
            name: rest.length === 1 ? rest[0].title : "Other",
            about: rest.map((one) => `${one.title} ${number(one[field])}`).join(", "),
            value: rest.reduce((sum, one) => sum + one[field], 0),
            color: "var(--series-other)",
          },
        ]
      : []),
  ];
  const label = parts.map((one) => `${one.name} ${number(one.value)}`).join(", ");
  return html`<div class="card stat lint-stat">
    <div class="figure">
      <b>${number(total)}</b>
      <span>${title}</span>
    </div>
    ${
      parts.length
        ? html`<div class="split-by">
            <ul class="key">
              ${parts.map(
                (one) => html`<li title=${one.about || nothing}>
                  <span class="swatch" style="background: ${one.color}"></span>
                  <span class="name">${one.name}</span>
                  <span class="value">${number(one.value)}</span>
                </li>`,
              )}
            </ul>
            ${bars(
              parts.map((one) => ({
                value: one.value,
                color: one.color,
                title: `${one.about || one.name}: ${count(one.value, severity)}, ${Math.round((100 * one.value) / total)}%`,
              })),
              { label: `${title} by category: ${label}` },
            )}
          </div>`
        : html`<p class="none">None found.</p>`
    }
  </div>`;
}

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

  /** What the rule or category in view checks. */
  about(picked, category) {
    if (picked) {
      const text = `Checks that ${checks(picked.description)}.`;
      return html`<p class="checks" title=${text}>${text}</p>`;
    }
    // a category's line names what it covers and goes on to say who relies on it (", which …"): only the first
    if (category) {
      const text = `Checks ${category.about.split(", which ")[0]}.`;
      return html`<p class="checks" title=${text}>${text}</p>`;
    }
    return html`<p class="checks hint">Every finding of every rule. Pick a category or a rule to narrow it.</p>`;
  }

  /** What the rule, category or whole run in view found, as a sentence in the color of what it found. */
  found(scope) {
    if (!scope) return nothing;
    return html`<p class="found-line ${scope.errors ? "errors" : scope.warnings ? "warnings" : "clean"}">
      ${foundLine(scope)}
    </p>`;
  }

  render() {
    const { app, lint } = this;
    if (!lint || lint.error) {
      return html`
        ${pageTitle("lint", "Lint", "What the spec could say more clearly.")}
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
    const colors = seriesColors(categories);
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
      ${pageTitle(
        "lint",
        lint.linted ? "Lint" : "Not valid OpenAPI",
        lint.linted
          ? html`What the spec could say more clearly, by the rules of <code>rapidoc lint --stateful</code>.`
          : "The spec is not valid OpenAPI, so it was not linted. Fix these errors first.",
      )}
      ${
        lint.mockError
          ? html`<p class="banner error">The mock can't start on this spec: ${lint.mockError}</p>`
          : nothing
      }
      <div class="cards lint-cards">
        ${measured(summary) ? passedCard(summary) : nothing}
        ${severityCard(errors, "error", categories, colors)}
        ${severityCard(warnings, "warning", categories, colors)}
      </div>
      <div class="lint-layout">
        <div class="lint-head">
          <div class="row">
            <h2>
              ${picked ? html`<code>${picked.name}</code>` : inCategory?.title || "All findings"}
            </h2>
            ${rules ? html`<a href=${to()}>All findings</a>` : nothing}
          </div>
          ${this.about(picked, inCategory)}
        </div>
        ${
          categories.length
            ? html`
                <nav class="card side lint-rows" aria-label="Categories and rules">
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
                                  title: `Checks that ${checks(rule.description)}.`,
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
        <div class="lint-controls">
          ${this.found(picked || inCategory || summary)}
          <div class="row">
          <input
            type="search"
            placeholder="Filter findings"
            aria-label="Filter findings"
            .value=${this.filter}
            @input=${(e) => (this.filter = e.target.value)}
          />
          ${segmented(
            "Severity",
            [
              ["", "All"],
              ["error", "Errors"],
              ["warning", "Warnings"],
            ],
            this.severity,
            (value) => (this.severity = value),
          )}
          <span class="hint">
            ${
              kept.length === lint.problems.length
                ? count(kept.length, "finding")
                : `${number(kept.length)} of ${count(lint.problems.length, "finding")}`
            }
          </span>
        </div>
        </div>
        <div class="pane">
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
