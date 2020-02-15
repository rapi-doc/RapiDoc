import { html } from 'lit-element';

export default html`
<style>
.m-select, input, select, button {
  font-family: var(--font-regular);
  font-weight:400;
  color:var(--fg);
}
/* Button */
.m-btn {
  border-radius: var(--border-radius);
  box-sizing: border-box;
  font-weight: 600;
  display: inline-block;
  padding: 6px 16px;
  font-size: var(--font-size-small);
  outline: 0;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  border: 2px solid var(--primary-color);
  background-color:transparent;
  transition: background-color 0.2s;
  user-select: none;
  cursor: pointer;
}
.m-btn.primary {
  background-color:var(--primary-color);
  color:var(--primary-color-invert);
}
.m-btn.thin-border { border-width: 1px;}
.m-btn.large { padding:8px 14px;}
.m-btn.small { padding:5px 12px;}
.m-btn.circle { border-radius:50%;}
.m-btn:hover { 
  background-color: var(--primary-color);
  color:var(--primary-color-invert);
}
.m-btn:disabled{ 
  background-color: var(--bg3);
  color:var(--fg3);
  border-color:var(--fg3);
  cursor:not-allowed;
  opacity:0.4;
}

/* Form Inputs */
select,
textarea,
input[type="file"],
input[type="text"],
input[type="password"] {
  border-radius:var(--border-radius);
  border:1px solid var(--border-color);
  background:var(--input-bg);
  color:var(--fg);
  transition: border .2s;
  outline: none;
  font-size:calc(var(--font-size-small) + 1px);
  padding:6px 5px;
  box-sizing: border-box;
}

textarea.mono,
input[type="text"].mono,
input[type="password"].mono{
  font-family: var(--font-mono); 
  font-size:var(--font-size-mono); 
}

input[type="text"].large,
input[type="password"].large {
  padding:10px 8px;
  font-size:(--font-size-mono); 
}

textarea::placeholder,
input[type="text"]::placeholder,
input[type="password"]::placeholder {
  color: var(--placeholder-color);
  opacity:1;
}

textarea:focus,
input[type="text"]:focus,
input[type="password"]:focus,
textarea:active,
input[type="text"]:active,
input[type="password"]:active {
  border:1px solid var(--primary-color);
}

pre::-webkit-scrollbar-track,
textarea::-webkit-scrollbar-track{
  background:var(--input-bg);
}
  
pre::-webkit-scrollbar,
textarea::-webkit-scrollbar{
  width: 8px;
  height: 8px;
  background-color: transparent;
}
 
pre::-webkit-scrollbar-thumb,
textarea::-webkit-scrollbar-thumb {
  border-radius:2px;
  background-color: var(--primary-color)
}

.link{
  font-size:var(--font-size-small);
  text-decoration: underline;
  color:var(--blue);
  font-family:var(--font-mono);
  margin-bottom:2px;
}

</style>`;
