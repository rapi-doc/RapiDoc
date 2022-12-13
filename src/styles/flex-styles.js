import { css } from 'lit';

export default css`
  .flex,
  .row,
  .col,
  .row-api {
    display: flex;
  }
  .row-api {
    align-items: center;
    flex-direction: row;
    column-gap: 24px;
    align-items: flex-start;
    justify-content: space-evenly;
  }
  .col {
    align-items: stretch;
    flex-direction: column;
  }
  .row-api-left {
    min-width: 0;
    max-width: 848px;
    flex: 2 1 0%;
    justify-content: flex-end;
  }
  .row-api-right {
    min-width: 0;
    max-width: 702px;
    flex: 1;
    justify-content: flex-start;
  }

  @media (max-width: 1024px) {
    .row-api {
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
    }

    .row-api-left,
    .row-api-right {
      max-width: unset;
      width: 100%;
    }
  }
`;
