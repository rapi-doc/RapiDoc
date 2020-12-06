import { css } from 'lit-element';

export default css`
#api-info {
  font-size:calc(var(--font-size-regular) - 1px);margin-top:8px
  margin-left: -15px;
}

#api-info span:before {
  content: "|";
  display: inline-block;
  opacity: 0.5;
  width: 15px;
  text-align: center;
}
#api-info span:first-child:before {
  content: "";
  width: 0px;
}
`;
