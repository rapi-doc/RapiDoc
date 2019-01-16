// include lit-element in main webpack bundle (this is optional)
import 'lit-element';
import '@/styles/scss/main.scss';
import('@/rapidoc')

// Note: this is just basic detection of web components support.
// For more advanced feature detection, use @webcomponents/webcomponentsjs/webcomponents-loader.js
/*
const webComponentsSupported =
    'registerElement' in document &&
    'import' in document.createElement('link') &&
    'content' in document.createElement('template')

async function bootstrap() {
    if (!webComponentsSupported) {
        await import(/* webpackChunkName: 'webcomponents' * / '@webcomponents/webcomponentsjs/webcomponents-bundle')
    }
    import('@/rapidoc-shell')
}
bootstrap()
*/