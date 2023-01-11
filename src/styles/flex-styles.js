import { css } from 'lit';

export default css`
  .flex,
  .row,
  .col,
  .row-api {
    display: flex;
  }
  .row-api {
    flex: 1fr 1fr;
    align-items: center;
    flex-direction: row;
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
    padding-right: 32px;
  }
  .row-api-right {
    min-width: 0;
    max-width: 702px;
    flex: 1;
    justify-content: flex-start;
    border-left: 1px solid #E7E9EE;
  }
  .row-api-right-box{
    text-align:left; 
    direction:ltr; 
    margin-block: 32px 24px; 
    padding-left: 32px;
  }

  @media (max-width: 1280px) {
    .row-api {
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
    }
    .row-api-right-box{
      padding-left: 0px;
    }

    .row-api-left,
    .row-api-right {
      max-width: unset;
      width: 100%;
      border: none;
      padding: 10px;
    }
  }
`;
