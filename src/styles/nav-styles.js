import { css } from 'lit-element';

export default css`
.nav-bar {
  width:0;
  height:100%;
  overflow: hidden;
  color:var(--nav-text-color);
  background-color: var(--nav-bg-color);
  background-image: var(--nav-bg-image);
  background-size: var(--nav-bg-image-size);
  background-repeat: var(--nav-bg-image-repeat, 'no-repeat');
  background-blend-mode: multiply;
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
  padding: 15px 15px 5px 5px;
  text-align: right;
  filter:opacity(0.5);
  font-weight:bold;
  border-bottom: 1px solid var(--nav-text-color);
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
`;
