import { css } from 'lit';

export default css`
  .m-table {
    border-spacing: 0;
    border-collapse: separate;
    border: 1px solid var(--border);
    border-radius: var(--card-radius);
    margin: 0;
    max-width: 100%;
    direction: ltr;

    & tr:first-child td,
    & tr:first-child th {
      border-top: 0 none;
    }

    & td,
    & th {
      font-size: var(--font-size-small);
      line-height: calc(var(--font-size-small) + 4px);
      padding: 4px 5px 4px;
      vertical-align: top;

      &:not([align]) {
        text-align: start;
      }
    }

    &.padded-12 td,
    &.padded-12 th {
      padding: 12px;
    }

    & th {
      color: var(--card-foreground);
      font-size: var(--font-size-small);
      line-height: calc(var(--font-size-small) + 18px);
      font-weight: 600;
      letter-spacing: normal;
      background: var(--card);
      vertical-align: bottom;
      border-bottom: 1px solid var(--border);
    }

    & > tbody > tr > td,
    & > tr > td {
      border-top: 1px solid var(--border);
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .table-title {
    font-size: var(--font-size-small);
    font-weight: 600;
    vertical-align: middle;
    margin: 12px 0 4px 0;
  }
`;
