import {html} from 'lit-element'; 
import vars from './vars';
export default html`
<style>
a{ color: ${vars.color.link}; }
.border{
  border:1px solid ${vars.color.border};
  border-radius: ${vars.border.radius};
}
.light-border{
  border:1px solid ${vars.color.lightBorder};
  border-radius: ${vars.border.radius};
}
</style>`
