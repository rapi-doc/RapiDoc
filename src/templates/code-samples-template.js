import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js'; // eslint-disable-line import/extensions
import Prism from 'prismjs';
import { copyToClipboard } from '~/utils/common-utils';

/* eslint-disable indent */
export default function codeSamplesTemplate(xCodeSamples) {
  return html`
  <section class="table-title" style="margin-top:24px;">CODE SAMPLES</div>
  <div class="tab-panel col"
    @click="${
      (e) => {
        if (!e.target.classList.contains('tab-btn')) { return; }
        const clickedTab = e.target.dataset.tab;

        const tabButtons = [...e.currentTarget.querySelectorAll('.tab-btn')];
        const tabContents = [...e.currentTarget.querySelectorAll('.tab-content')];
        tabButtons.forEach((tabBtnEl) => tabBtnEl.classList[tabBtnEl.dataset.tab === clickedTab ? 'add' : 'remove']('active'));
        tabContents.forEach((tabBodyEl) => { tabBodyEl.style.display = (tabBodyEl.dataset.tab === clickedTab ? 'block' : 'none'); });
      }
    }">
    <div class="tab-buttons row" style="width:100; overflow">
      ${xCodeSamples.map((v, i) => html`<button class="tab-btn ${i === 0 ? 'active' : ''}" data-tab = '${v.lang}${i}'> ${v.label || v.lang} </button>`)}
    </div>
    ${xCodeSamples.map((v, i) => html`
      <div class="tab-content m-markdown" style= "display:${i === 0 ? 'block' : 'none'}" data-tab = '${v.lang}${i}'>
        <button class="toolbar-btn" style = "position:absolute; top:12px; right:8px" @click='${(e) => { copyToClipboard(v.source, e); }}'> Copy </button>
        <pre><code class="language">${Prism.languages[v.lang?.toLowerCase()] ? unsafeHTML(Prism.highlight(v.source, Prism.languages[v.lang?.toLowerCase()], v.lang?.toLowerCase())) : v.source}</code></pre>
      </div>`)
    }
  </div>  
  </section>`;
}
/* eslint-enable indent */
