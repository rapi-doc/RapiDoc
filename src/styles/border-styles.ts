import { css } from 'lit';

export default css`
.border-top {
  border-top:1px solid var(--border-color);
}
.border{
  border:1px solid var(--border-color);
  border-radius: var(--border-radius);
}
.light-border{
  border:1px solid var(--light-border-color);
  border-radius: var(--border-radius);
}
.pad-8-16{
  padding: 8px 16px;
}
.pad-top-8{
  padding-top: 8px;
}
.mar-top-8{
  margin-top: 8px;
}
`;
