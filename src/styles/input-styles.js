import { html } from 'lit-element';

/* eslint-disable max-len */
export default html`
<style>
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
.toolbar-btn{
  cursor:pointer;
  padding:2px 0 4px;
  margin:0 2px;
  min-width:50px;
  color:var(--primary-color-invert);
  border-radius:2px;
  border:none;
  background-color: var(--primary-color);
}

input, textarea, select, button, pre {
  color:var(--fg);
  outline: none;
  background: var(--input-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
}

/* Form Inputs */
pre,
select,
textarea,
input[type="file"],
input[type="text"],
input[type="password"] {
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: var(--font-size-small);
  transition: border .2s;
  padding: 6px 5px;
  box-sizing: border-box;
}

select {
  font-family: var(--font-regular);
  padding: 5px 30px 5px 5px;
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%3E%3Cpath%20d%3D%22M10.3%203.3L6%207.6%201.7%203.3A1%201%200%2000.3%204.7l5%205a1%201%200%20001.4%200l5-5a1%201%200%2010-1.4-1.4z%22%20fill%3D%22%23777777%22%2F%3E%3C%2Fsvg%3E"); 
  background-position: calc(100% - 5px) center;
  background-repeat: no-repeat;  
  background-size: 10px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
}
select:hover {
  border-color: var(--primary-color);
}

textarea::placeholder,
input[type="text"]::placeholder,
input[type="password"]::placeholder {
  color: var(--placeholder-color);
  opacity:1;
}

select:focus,
textarea:focus,
input[type="text"]:focus,
input[type="password"]:focus,
textarea:active,
input[type="text"]:active,
input[type="password"]:active {
  border:1px solid var(--primary-color);
}

input[type="file"]{
  font-family: var(--font-regular);
  padding:2px;
  cursor:pointer;
  border: 1px solid var(--primary-color);
  min-height: 30px;
}
input[type="file"]::-webkit-file-upload-button {
  font-family: var(--font-regular);
  font-size: var(--font-size-small);
  outline: none;
  cursor:pointer;
  padding: 3px 8px;
  border: 1px solid var(--primary-color);
  background-color: var(--primary-color);
  color: var(--primary-color-invert);
  border-radius: var(--border-radius);;
  -webkit-appearance: none;
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
  border-radius: 2px;
  background-color: var(--border-color)
}

.link {
  font-size:var(--font-size-small);
  text-decoration: underline;
  color:var(--blue);
  font-family:var(--font-mono);
  margin-bottom:2px;
}

</style>`;
