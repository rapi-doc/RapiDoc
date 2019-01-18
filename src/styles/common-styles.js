import {html} from 'lit-element'; 
import vars from './vars';
export default html`
<style>
a{ color: ${vars.color.link}; }
.border{
  border:1px solid var(--border-color);
  border-radius: ${vars.border.radius};
}
.light-border{
  border:1px solid var(--light-border-color);
  border-radius: ${vars.border.radius};
}
</style>`
