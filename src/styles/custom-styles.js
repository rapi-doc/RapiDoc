import { css } from 'lit';

/*
This file is reserved for any custom css that developers want to add to
customize their theme. Simply add your css to this file and yarn build.
*/

export default css`
.test-method-button {
  background: #142032;
  padding: 6px 16px;
  color: #FFFFFF;
  font-size: 14px;
  line-height: 20px;
  border-radius: 4px;
  margin-top: 32px;
  font-family: var(--font-medium);
  cursor: pointer;
}

.code-container {
  padding-inline: 32px;
  padding-top: 16px;
}
.code-container > code {
  font-size: 12px;
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

.server-template-url {
  position: relative;
}

.server-template-url .server-template-vars {
  visibility: hidden;
  position: absolute;
  top: 100%;
  
  background-color: var(--bg);

  border: 1px solid rgb(204, 206, 216);
  border-radius: 4px;
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.1);
  
  z-index: 1;
}

.server-template-url:hover .server-template-vars {
  visibility: visible;
}

.base-url {
  padding: 10px 10px 0px 10px;
  max-height: 300px;
  overflow-x: hidden;
  overflow-y: auto;
}
`;
