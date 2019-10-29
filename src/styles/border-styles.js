import { html } from 'lit-element';

export default html`
<style>
a{ color: var(--blue); }
.border{
  border:1px solid var(--border-color);
  border-radius: var(--border-radius);
}
.light-border{
  border:1px solid var(--light-border-color);
  border-radius: var(--border-radius);
}
</style>`;
