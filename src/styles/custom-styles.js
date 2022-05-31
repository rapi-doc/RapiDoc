import { css } from 'lit';

/*
This file is reserved for any custom css that developers want to add to
customize their theme. Simply add your css to this file and yarn build.
*/

export default css`

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
    padding: 4px 8px;
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
}

`;
