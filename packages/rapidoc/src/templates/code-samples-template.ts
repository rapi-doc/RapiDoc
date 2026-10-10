/**
 * Renders multi-language code snippets and custom x-codeSamples / x-code-samples tab panels.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { XCodeSample } from '~/types/spec';

import { copyToClipboard } from '~/utils/common-utils';
import { scheduleHighlight } from '~/utils/highlighter';

export default function codeSamplesTemplate(xCodeSamples: XCodeSample[]): TemplateResult {
  return html`
  <section class="table-title" style="margin-top:24px;">CODE SAMPLES</div>
  <div part="tab-panel" class="tab-panel col"
    @click="${(e: Event) => {
      const target = e.target as HTMLElement;
      const currentTarget = e.currentTarget as HTMLElement;
      if (!target.classList.contains('tab-btn')) {
        return;
      }
      const clickedTab = target.dataset.tab;

      const tabButtons = [...currentTarget.querySelectorAll<HTMLElement>('.tab-btn')];
      const tabContents = [...currentTarget.querySelectorAll<HTMLElement>('.tab-content')];
      tabButtons.forEach((tabBtnEl) => tabBtnEl.classList[tabBtnEl.dataset.tab === clickedTab ? 'add' : 'remove']('active'));
      tabContents.forEach((tabBodyEl) => {
        tabBodyEl.style.display = tabBodyEl.dataset.tab === clickedTab ? 'block' : 'none';
      });
      scheduleHighlight((currentTarget.getRootNode() as ShadowRoot | undefined)?.host?.shadowRoot || currentTarget);
    }}">
    <div part="tab-btn-row" class="tab-buttons row" style="width:100; overflow">
      ${xCodeSamples.map((v, i) => html`<button part="tab-btn" class="tab-btn ${i === 0 ? 'active' : ''}" data-tab="${v.lang}${i}">${v.label || v.lang}</button>`)}
    </div>
    ${xCodeSamples.map(
      (v, i) =>
        html`<div class="tab-content m-markdown" style="display:${i === 0 ? 'block' : 'none'}" data-tab="${v.lang}${i}">
          <button
            class="toolbar-btn"
            part="btn btn-fill btn-copy"
            style="position:absolute; top:12px; right:8px"
            @click="${(e: Event) => {
              copyToClipboard(v.source, e);
            }}"
          >
            Copy
          </button>
          <pre><code class="language-${v.lang?.toLowerCase()}">${v.source}</code></pre>
        </div>`
    )}
  </div>  
  </section>`;
}
