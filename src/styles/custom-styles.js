import { css } from 'lit';

/*
This file is reserved for any custom css that developers want to add to
customize their theme. Simply add your css to this file and yarn build.
*/

export default css`
  .tree {
    background-color: var(--color-ground-dark);
  }

  .expanded-endpoint-body > * {
    width: 50%;
  }

  .expanded-req-resp-container {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: calc(var(--base-gap) * 2);
  }

  .m-btn {
    border-radius: 1000px;
  }
`;
