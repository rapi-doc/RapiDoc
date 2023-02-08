import { html } from 'lit';
import HTTPSnippet from 'httpsnippet';
import languageIcons from '../components/assets/languages/language-icons';
import threeDots from '../components/assets/three-dots';

function onClickMoreLanguages() {
  this.showMoreLanguages = !this.showMoreLanguages;
}

function onLeaveMoreLanguages() {
  this.showMoreLanguages = false;
}

function moreLanguagesTemplate(numberOfButtons, languages) {
  if (numberOfButtons >= languages.length) return '';

  return html`
    <div style="position:relative;" @mouseleave="${onLeaveMoreLanguages}">
      <div class="language-show-more" @click="${onClickMoreLanguages}">${threeDots()}</div>
      <div class="more-languages-dropdown" style=${this.showMoreLanguages ? 'visibility: visible; opacity: 1;' : 'visibility: hidden; opacity: 0;'}>
        ${languages.slice(numberOfButtons).map((language) => html`
          <button
            class="rectangle-language-button"
            key=${language.key}
            @click=${() => { this.selectedLanguage = language.key; this.requestUpdate(); }}
          >
            ${languageIcons[language.key] ? languageIcons[language.key]({ width: 15, height: 15 }) : ''}
            ${language.title}
          </button>
        `)}
      </div>
    </div>
  `;
}

export default function languagePickerTemplate() {
  const selectedLanguages = ['node', 'shell', 'python'];
  const languages = HTTPSnippet.availableTargets().filter((language) => selectedLanguages.includes(language.key));
  const numberOfButtons = 3;

  return html`
    <section id='language' part="section-language" class='row-api-right-box regular-font observe-me ${'read focused'.includes(this.renderStyle) ? 'section-gap--read-mode' : 'section-gap'}'>
        <span class="right-box-title">Language</span>
        <div class="language-picker">
          <div class="language-picker-buttons">
            ${languages.slice(0, numberOfButtons).map((language) => html`
              <button
                class=${language.key === this.selectedLanguage ? 'square-language-button selected-language' : 'square-language-button'}
                key=${language.key}
                @click=${() => { this.selectedLanguage = language.key; this.requestUpdate(); }}
              >
                ${languageIcons[language.key] ? languageIcons[language.key]() : ''}
                ${language.title}
              </button>
            `)}
          </div>
          ${moreLanguagesTemplate.call(this, numberOfButtons, languages)}
        </div>
    </section>`;
}
