import { html } from 'lit-element';

export default html`
<style>
.nav-bar {
  width:0;
  height:100%;
  overflow: hidden;
  color:var(--nav-text-color);
  background-color: var(--nav-bg-color);
  box-sizing:border-box;
  line-height: 16px;
  display:none;
  position:relative;
  flex-direction:column;
  flex-wrap:nowrap;
  word-break:break-word;
}
.nav-scroll {
  overflow-x:hidden;
  overflow-y: overlay;
}
.nav-scroll::-webkit-scrollbar-track {
  background:transparent;
}
.nav-scroll::-webkit-scrollbar {
  display:none;
  width: 12px;
  background-color: transparent;
}
.nav-scroll:hover::-webkit-scrollbar {
  display:block;
}
.nav-scroll::-webkit-scrollbar-thumb {
  border: 3px solid var(--nav-bg-color);
  border-width: 0 3px;
  background-color: var(--nav-hover-bg-color);
}
.nav-bar-tag {
  font-size: var(--font-size-regular);
  border-left:4px solid transparent;
  font-weight:bold;
  padding: 15px 30px 15px 10px;
  text-transform: capitalize;
}
.nav-bar-tag:not(:first-of-type) {
  border-top: 1px solid var(--nav-hover-bg-color);
}

.nav-bar-components,
.nav-bar-h1,
.nav-bar-h2,
.nav-bar-info,
.nav-bar-tag,
.nav-bar-path {
  display:flex;
  cursor:pointer;
  border-left:4px solid transparent;
}

.nav-bar-h1,
.nav-bar-h2,
.nav-bar-path {
  font-size: var(--font-size-small);
  padding: var(--nav-item-padding);
}
.nav-bar-info {
  font-size: var(--font-size-regular);
  padding: 16px 10px;
  font-weight:bold;
}
.nav-bar-section {
  display: block;
  font-size: var(--font-size-small);
  color: var(--nav-text-color);
  text-transform: uppercase;
  margin: 15px 15px 5px 5px;
  text-align: right;
  filter:opacity(0.5);
  font-weight:bold;
}
.nav-bar-section:first-child {
  display: none;
}
.nav-bar-h2 {margin-left:12px;}

.nav-bar-h1.active,
.nav-bar-h2.active,
.nav-bar-info.active,
.nav-bar-tag.active,
.nav-bar-path.active {
  border-left:4px solid var(--nav-accent-color);
  color:var(--nav-hover-text-color);
}

.nav-bar-h1:hover,
.nav-bar-h2:hover,
.nav-bar-info:hover,
.nav-bar-tag:hover,
.nav-bar-path:hover {
  color:var(--nav-hover-text-color);
  background-color:var(--nav-hover-bg-color);
}
</style>`;
