import vars from './vars';
import {html} from 'lit-element'; 

export default html`
<style>
input, select, button {
  font-family: ${vars.font.regular};
  font-weight:400;
}

/* Button */
.m-btn{
  border-radius: ${vars.border.radius};
  font-weight: 600;
  display: inline-block;
  padding: 6px 16px;
  font-size: 12px;
  outline: 0;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  background-color:var(--primary-color, ${vars.color.primaryBg});
  color:var(--primary-text, ${vars.color.primaryFg});
  border: 1px solid var(--primary-color, ${vars.color.primaryBg});
  transition: background-color 0.2s;
  user-select: none;
  cursor: pointer;
}

.m-btn.large{padding:8px 14px;}
.m-btn.small{padding:5px 12px;}
.m-btn.circle{border-radius:50%;}
.m-btn.plain{
    background-color:${vars.color.plainBg};
    border: 2px solid ${vars.color.plainBorder};
    color:${vars.color.plainFg};
}

.m-btn:hover{ background-color: var(--primary-color, ${vars.color.primaryBg})}
.m-btn.plain:hover{ border-color:var(--primary-color, ${vars.color.primaryBg});}

/* Form Inputs */
textarea,
input[type="text"],
input[type="password"]{
  border-radius:${vars.border.radius};
  border:1px solid ${vars.color.inputBorder};
  background:${vars.color.inputBg};
  color:${vars.color.inputFg};
  transition: border .2s;
  outline: none;
  font-size:14px;
  height:26px;
  padding: 0 5px;
  box-sizing: border-box;
}

textarea.mono,
input[type="text"].mono,
input[type="password"].mono{
  font-family: ${vars.font.mono}; 
  font-size:12px;
}

input[type="text"].small,
input[type="password"].small {
    height:26px;
    font-size:12px;
}

textarea::placeholder,
input[type="text"]::placeholder,
input[type="password"]::placeholder {
    color: ${vars.color.placeHolder};
}

textarea:focus,
input[type="text"]:focus,
input[type="password"]:focus,
textarea:active,
input[type="text"]:active,
input[type="password"]:active {
    border:1px solid var(--primary-color, ${vars.color.primaryBg});
}

textarea.reverse,
input.reverse[type="text"],
input.reverse[type="password"]{
  background:${vars.color.inputReverseBg};
  color:${vars.color.inputReverseFg};
  border:1px solid var(--primary-color, ${vars.color.primaryBg}); 
}

textarea.reverse:focus,
input.reverse[type="text"]:focus,
input.reverse[type="password"]:focus,
textarea.reverse:active,
input.reverse[type="text"]:active,
input.reverse[type="password"]:active{
    border:1px solid var(--primary-color, ${vars.color.primaryBg});
}

textarea.reverse::placeholder,
input.reverse::placeholder{
    color: #666;
}

textarea::-webkit-scrollbar-track{
    background-color: transparent;
}
  
textarea::-webkit-scrollbar{
    width: 8px;
    height: 8px;
    background-color: transparent;
}
 
textarea::-webkit-scrollbar-thumb {
    background-color: rgba(50,50,50, .5);
}
</style>`
