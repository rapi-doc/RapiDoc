/** Custom theme tokens accepted by `setTheme(baseTheme, theme)`. Every token is an optional CSS color. */
export interface ThemeTokens {
  primaryColor?: string;
  bg1?: string;
  bg2?: string;
  bg3?: string;
  fg1?: string;
  fg2?: string;
  fg3?: string;
  inlineCodeFg?: string;
  headerColor?: string;
  navBgColor?: string;
  navTextColor?: string;
  navHoverBgColor?: string;
  navHoverTextColor?: string;
  navAccentColor?: string;
  navAccentTextColor?: string;
  /** Misspelled key read by setTheme (see TODO(ts-migration) in utils/theme.ts). */
  borderColor?: string;
  lightBorderColor?: string;
  codeBorderColor?: string;
  inputBg?: string;
  placeHolder?: string;
  hoverColor?: string;
  red?: string;
  pink?: string;
  green?: string;
  blue?: string;
  orange?: string;
  yellow?: string;
  purple?: string;
  brown?: string;
  codeBg?: string;
  codeFg?: string;
  codePropertyColor?: string;
  codeKeywordColor?: string;
  codeOperatorColor?: string;
}

/** `this` context of `setTheme`: the host component providing layout/font settings. */
export interface ThemeContext {
  layout?: string;
  monoFont?: string;
  regularFont?: string;
  navItemSpacing?: string;
  responseAreaHeight?: string;
  fontSize?: string;
}

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}
