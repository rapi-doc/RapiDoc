import { css } from 'lit';

/*
This file is reserved for any custom css that developers want to add to
customize their theme. Simply add your css to this file and yarn build.
*/

export default css`
  * :not(.fa):not(.fas):not(i):not(mat-icon):not(nb-icon) {
    font-family: Inter !important;
    letter-spacing: -.02em;
  }
  .nav-bar-components, .nav-bar-h1, .nav-bar-h2, .nav-bar-info, .nav-bar-tag, .nav-bar-path {
    border-radius: none;
  }
  .nav-bar-components:hover, .nav-bar-h1:hover, .nav-bar-h2:hover, .nav-bar-info:hover, .nav-bar-tag:hover, .nav-bar-path:hover {
    background-color: transparent; 
    color: #140cdf !important;
  }
  .method-fg.get {
    color: #0D13BA;
  }
  .method-fg.put {
    color: #B54708;
  }
  .method-fg.post {
    color: #4C7F75;
  }
  .method-fg.delete {
    color: #C51307;
  }
  .bold-text {
    font-weight: 700;
  }
  .title {
    font-weight: 400;
  }
  .json-tree {
   max-height: 50vh;
   overflow: scroll;
  }
`;
