import { css } from 'lit';

/*
This file is reserved for any custom css that developers want to add to
customize their theme. Simply add your css to this file and yarn build.
*/

export default css`
.code-container {
  padding-inline: 32px;
  padding-top: 16px;
}
.code-container > code {
  font-size: 14px;
  line-height: 20px;
}

.request-card {
  border: 1px solid #CCCED8;
  border-radius: 4px;
  padding-block: 24px;
  margin-top: 24px;
}

.request-title-container {
  margin-left: 16px;
}

.request-title {
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: 400;
  line-height: 18px;
  color: #4A4A4A;
}

.label-operation-container {
  text-align: left;
  direction: ltr;
  padding: 8px 0;
  color: var(--fg3);
  display: flex;
  width: 100%;
  overflow: hidden;
}

.label-operation-path-container {
  display: inline-flex;
  flex-direction: row;
  flex-grow: 1;
  justify-content: space-between;
  align-items: stretch;
  width: auto;
  height: 28px;
  left: 0;
  top: 0;
  border: 1px solid var(--border-color);
  border-radius: 0px 4px 4px 0px;
  margin: 4px 0px;
  flex-wrap: nowrap;
  overflow-x: auto;
  position: relative;
  scrollbar-color: transparent transparent;
}

.label-operation-path-container::-webkit-scrollbar {
  display: none;
}

.label-operation-path-item {
  flex: 0 0 auto;
}

.label-operation-method-container {
  display: inline-flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  width: auto;
  height: 28px;
  left: 0;
  top: 0;
  border-width: 1px 0px 1px 1px;
  border-style: solid;
  border-radius: 4px 0px 0px 4px;
  margin: 4px 0px;
  text-transform: uppercase;
}

.right-box-title {
  color: #4A4A4A;
  font-size: 18px;
  line-height: 20px;
  font-weight: 400;
}

.right-box-container {
  margin-top: 16px;
}

.right-box-label {
  color: var(--fg2);
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 400;
}

.right-box-input {
  width: 100%;
  height: 44px;
}

.server-template {
  position: relative;
}

.server-template-vars {
  position: absolute;
  top: calc(100% + 2px);
  
  background-color: var(--bg);

  border: 1px solid rgb(204, 206, 216);
  border-radius: 4px;
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.1);
  
  z-index: 1;

  max-height: 300px;
  max-width: 100%;
}

.server-vars {
  padding: 10px 10px 0px 10px;
  overflow-x: hidden;
  overflow-y: auto;
}

.language-picker {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  padding: 16px 0px;
  gap: 5px;
}

.language-picker-buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
}

.square-language-button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4px;
  gap: 5px;

  width: max-content;
  min-width: 50px;
  height: 50px;

  flex: none;
  order: 1;
  flex-grow: 0;

  background-color: rgba(0, 0, 0, 0);
  border: 1px solid rgba(0, 0, 0, 0);
  border-radius: 4px;

  color: var(--fg2);
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;

  cursor: pointer;
}

.square-language-button:hover {
  border: 1px solid rgb(59, 59, 59);
}

.square-language-button:active {
  border-color: rgb(59, 59, 59);
  box-shadow: rgb(255 255 255) 0px 0px 0px 1px, rgb(185 185 185) 0px 0px 0px 3px;
}

.rectangle-language-button {
  display: flex;
  gap: 5px;

  width: 100%;
  text-align: left;

  background-color: rgba(0, 0, 0, 0);
  border: 1px solid rgba(0, 0, 0, 0);
  border-radius: 0px;
  padding: 6px 6px;

  color: var(--fg2);
  cursor: pointer;
}

.rectangle-language-button:hover {
  background-color: rgb(248, 247, 252);
}

.rectangle-language-button:active {
  background-color: rgb(204, 206, 216);
}

.selected-language {
  border: 1px solid rgb(204, 206, 216);
}

.language-show-more {
  height: 30px;
  width: 30px;
  padding: 4px;

  border: 1px solid rgba(0, 0, 0, 0);
  border-radius: 4px;

  cursor: pointer;
}

.language-show-more:hover {
  border: 1px solid rgb(59, 59, 59);
}

.data-example{
  background: #FFF3F6;
  border: 1px solid #FFE0EF;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: var(--font-size-small);
  width: max-content;
  padding: 0.2em 0.4em;
}

.data-example:hover{
  border: 1px solid #ffb5cb;
}

.language-show-more:active {
  border-color: rgb(59, 59, 59);
  box-shadow: rgb(255 255 255) 0px 0px 0px 1px, rgb(185 185 185) 0px 0px 0px 3px;
}

.more-languages-dropdown {
  position: absolute;
  top: 105%;
  right: 0%;
  min-width: 140px;

  background-color: var(--bg);

  border: 1px solid rgb(204, 206, 216);
  border-radius: 4px;
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.1);
  
  z-index: 1;

  transition: visibility 0.3s linear,opacity 0.3s linear;
}
`;
