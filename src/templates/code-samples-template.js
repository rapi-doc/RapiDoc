import { html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import Prism from 'prismjs';
import { copyToClipboard } from '@/utils/common-utils';

/* eslint-disable indent */
export default function codeSamplesTemplate(xCodeSamples) {
  return html`
  <div class="table-title top-gap row"> CODE SAMPLES </div>
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
        <button class="toolbar-btn" style = "position:absolute; top:12px; right:2px" @click='${(e) => { copyToClipboard(v.source, e); }}'> Copy </button>
        <pre><code class="language">${Prism.languages[v.lang.toLowerCase()] ? unsafeHTML(Prism.highlight(v.source, Prism.languages[v.lang.toLowerCase()], v.lang.toLowerCase())) : v.source}</code></pre>
      </div>`)
    }
  </div>`;
}
/* eslint-enable indent */
