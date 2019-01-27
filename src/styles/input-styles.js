import vars from './vars';
import {html} from 'lit-element'; 

export default html`
<style>
input, select, button {
  font-family: ${vars.font.regular};
  font-weight:400;
  color:var(--fg);
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
  background-color:var(--primary-color);
  color:var(--primary-text);
  border: 1px solid var(--primary-color);
  transition: background-color 0.2s;
  user-select: none;
  cursor: pointer;
}

.m-btn.large{padding:8px 14px;}
.m-btn.small{padding:5px 12px;}
.m-btn.circle{border-radius:50%;}
.m-btn:hover{ background-color: var(--primary-color)}

/* Form Inputs */
textarea,
input[type="text"],
input[type="password"]{
  border-radius:${vars.border.radius};
  border:1px solid var(--input-border-color);
  background:var(--input-bg);
  color:var(--fg);
  transition: border .2s;
  outline: none;
  font-size:14px;
  padding:6px 5px;
  box-sizing: border-box;
}

textarea.mono,
input[type="text"].mono,
input[type="password"].mono{
  font-family: ${vars.font.mono}; 
  font-size:12px;
}

input[type="text"].large,
input[type="password"].large {
    padding:10px 8px;
    font-size:13px;
}


textarea::placeholder,
input[type="text"]::placeholder,
input[type="password"]::placeholder {
    color: var(--placeholder-color);
}

textarea:focus,
input[type="text"]:focus,
input[type="password"]:focus,
textarea:active,
input[type="text"]:active,
input[type="password"]:active {
    border:1px solid var(--primary-color);
}

textarea.reverse,
input.reverse[type="text"],
input.reverse[type="password"]{
  background:${vars.color.inputReverseBg};
  color:${vars.color.inputReverseFg};
  border:1px solid var(--primary-color); 
}

textarea.reverse:focus,
input.reverse[type="text"]:focus,
input.reverse[type="password"]:focus,
textarea.reverse:active,
input.reverse[type="text"]:active,
input.reverse[type="password"]:active{
    border:1px solid var(--primary-color);
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
