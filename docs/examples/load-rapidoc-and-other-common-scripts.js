(function loadRapidocAndOtherCommonScripts() {
  // Google Analytics
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=UA-132775238-1';
  document.head.appendChild(gaScript);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', 'UA-132775238-1');

  // Include common StyleSheet used in all the examples
  const linkStylesheet = document.createElement('link');
  linkStylesheet.setAttribute('href', '../index.css');
  linkStylesheet.setAttribute('rel', 'stylesheet');
  document.head.appendChild(linkStylesheet);

  // Load RapiDoc based on Mode (In local host load )
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const script = document.createElement('script');
  script.type = 'module';

  if (isDev) {
    script.src = '../rapidoc-min.js';
  } else {
    // In production, use the built file
    script.src = '../rapidoc-min.js';
  }
  document.head.appendChild(script);
}());
