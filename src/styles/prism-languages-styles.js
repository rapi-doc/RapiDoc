import { css } from 'lit';

const ShellStyle = css`
.shell-token.shell-function {
  color: #2953B2;
}

.shell-token.shell-method {
  color: #4A4A4A;
}

.shell-token.shell-punctuation {
  color: #4A4A4A;
}

.shell-token.shell-string {
  color: var(--green);
}

`;

const JavascriptStyle = css``;

const RubyStyle = css``;

const PhpStyle = css``;

const PythonStyle = css``;

export default [
  ShellStyle,
  JavascriptStyle,
  RubyStyle,
  PhpStyle,
  PythonStyle,
];
