import { css } from 'lit';

export default css`
.tab-panel {
  border: none;
}
.tab-buttons {
  height:30px;
  padding: 4px 4px 0 4px;
  border-bottom: 1px solid var(--light-border-color) ;
  align-items: stretch;
  overflow-y: hidden;
  overflow-x: auto;
  scrollbar-width: thin;
}
.tab-buttons::-webkit-scrollbar {
  height: 1px;
  background-color: var(--border-color);
}
.tab-btn {
  border: none;
  border-bottom: 1px solid transparent; 
  color: var(--light-fg);
  background-color: transparent;
  white-space: nowrap;
  cursor:pointer;
  outline:none;
  font-family:var(--font-regular); 
  width:100%;
  font-weight: bold;
  font-size: 16px;
}
.tab-btn.active {
  border-bottom: 1px solid #D71D55; 
  font-weight:bold;
  color:#D71D55;
}

.tab-btn:hover {
  color:#c81e51;
}
.tab-content {
  margin:16px 0 0 0;
  position:relative;
  min-height: 50px;
}
`;
