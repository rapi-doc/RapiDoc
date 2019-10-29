
import { html } from 'lit-element';
import ColorUtils from '@/utils/color-utils';
/* Generates an schema object containing type and constraint info */
export default function setTheme(baseTheme, theme = {}) {
  let newTheme = {};
  if (baseTheme === 'dark') {
    newTheme = {
      bg1: theme.bg1 ? theme.bg1 : '#333',
      fg1: theme.fg1 ? theme.fg1 : '#bbb',
    };
    newTheme = {
      bg1: theme.bg1 ? theme.bg1 : '#333',
      // bg2: theme.bg2 ? theme.bg2 : '#383838',
      bg2: theme.bg2 ? theme.bg2 : ColorUtils.color.brightness(theme.bg1, 5),
      bg3: theme.bg3 ? theme.bg3 : '#444',

      fg1: theme.fg1 ? theme.fg1 : '#bbb',
      fg2: theme.fg2 ? theme.fg2 : '#ababab',
      fg3: theme.fg3 ? theme.fg3 : '#aaa',
      lightFg: theme.lightFg ? theme.lightFg : '#777',

      // borderColor: theme.borderColor ? theme.borderColor : '#555',
      borderColor: theme.borderColor ? theme.borderColor : ColorUtils.color.brightness(theme.bg1, 20),
      // lightBorderColor: theme.lightBorderColor ? theme.lightBorderColor : '#444',
      lightBorderColor: theme.lightBorderColor ? theme.lightBorderColor : ColorUtils.color.brightness(theme.bg1, 15),

      codeBorderColor: theme.codeBorderColor ? theme.codeBorderColor : '#666',

      codeBg: theme.codeBg ? theme.codeBg : '#272727',
      codeFg: theme.codeFg ? theme.codeFg : '#999',

      // inputBg: theme.inputBg ? theme.inputBg : '#2f2f2f',
      inputBg: theme.inputBg ? theme.inputBg : ColorUtils.color.brightness(theme.bg1, -5),

      placeHolder: theme.placeHolder ? theme.placeHolder : '#666',

      // hoverColor: theme.hoverColor ? theme.hoverColor : '#2a2a2a',
      hoverColor: theme.hoverColor ? theme.hoverColor : ColorUtils.color.brightness(theme.bg1, -10),

      red: theme.red ? theme.red : '#F06560',
      // lightRed: theme.lightRed ? theme.lightRed : '#2a2a2a',
      lightRed: theme.lightRed ? theme.lightRed : ColorUtils.color.brightness(theme.bg1, -10),

      green: theme.green ? theme.green : '#99CC00',
      // lightGreen: theme.lightGreen ? theme.lightGreen : '#2a2a2a',
      lightGreen: theme.lightGreen ? theme.lightGreen : ColorUtils.color.brightness(theme.bg1, -10),

      blue: theme.blue ? theme.blue : '#47AFE8',
      // lightBlue: theme.lightBlue ? theme.lightBlue : '#2a2a2a',
      lightBlue: theme.lightBlue ? theme.lightBlue : ColorUtils.color.brightness(theme.bg1, -10),

      orange: theme.orange ? theme.orange : '#FF9900',
      // lightOrange: theme.lightOrange ? theme.lightOrange : '#2a2a2a',
      lightOrange: theme.lightOrange ? theme.lightOrange : ColorUtils.color.brightness(theme.bg1, -10),

      yellow: theme.yellow ? theme.yellow : '#fc0',
      // lightYellow: theme.lightYellow ? theme.lightYellow : '#2a2a2a',
      lightYellow: theme.lightYellow ? theme.lightYellow : ColorUtils.color.brightness(theme.bg1, -10),

      purple: theme.purple ? theme.purple : '#786FF1',
      brown: theme.brown ? theme.brown : '#D4AC0D',
    };
  } else {
    newTheme = {
      bg1: theme.bg1 ? theme.bg1 : '#fff',
      bg2: theme.bg2 ? theme.bg2 : '#fafafa',
      bg3: theme.bg3 ? theme.bg3 : '#f6f6f6',

      fg1: theme.fg1 ? theme.fg1 : '#444',
      fg2: theme.fg2 ? theme.fg2 : '#555',
      fg3: theme.fg3 ? theme.fg3 : '#666',
      lightFg: theme.lightFg ? theme.lightFg : '#999',

      borderColor: theme.borderColor ? theme.borderColor : '#ddd',
      lightBorderColor: theme.lightBorderColor ? theme.lightBorderColor : '#eee',
      codeBorderColor: theme.codeBorderColor ? theme.codeBorderColor : '#transparent',

      codeBg: theme.codeBg ? theme.codeBg : '#4e575e',
      codeFg: theme.codeFg ? theme.codeFg : '#ccc',

      inputBg: theme.inputBg ? theme.inputBg : '#fff',
      placeHolder: theme.placeHolder ? theme.placeHolder : '#dedede',
      hoverColor: theme.hoverColor ? theme.hoverColor : '#f1f1f1',

      red: theme.red ? theme.red : '#F06560',
      lightRed: theme.lightRed ? theme.lightRed : '#fff0f0',

      green: theme.green ? theme.green : '#99CC00',
      lightGreen: theme.lightGreen ? theme.lightGreen : '#fbfff0',

      blue: theme.blue ? theme.blue : '#47AFE8',
      lightBlue: theme.lightBlue ? theme.lightBlue : '#eff8fd',

      orange: theme.orange ? theme.orange : '#FF9900',
      lightOrange: theme.lightOrange ? theme.lightOrange : '#fff5e6',

      yellow: theme.yellow ? theme.yellow : '#fc0',
      lightYellow: theme.lightYellow ? theme.lightYellow : '#fff5cc',

      purple: theme.purple ? theme.purple : '#786FF1',
      brown: theme.brown ? theme.brown : '#D4AC0D',
    };
  }

  return html`<style>
    :host {
    --bg:${newTheme.bg1};
    --bg2:${newTheme.bg2};
    --bg3:${newTheme.bg3};
    --fg:${newTheme.fg1};
    --fg2:${newTheme.fg2};
    --fg3:${newTheme.fg3};
    --light-fg:${newTheme.lightFg};
    --border-color:${newTheme.borderColor};
    --light-border-color:${newTheme.lightBorderColor};
    --code-border-color:${newTheme.codeBorderColor};
    --code-bg:${newTheme.codeBg};
    --code-fg:${newTheme.codeFg};
    --input-bg:${newTheme.inputBg};
    --placeholder-color:${newTheme.placeHolder};
    --hover-color:${newTheme.hoverColor};
    --red:${newTheme.red};
    --light-red:${newTheme.lightRed};
    --green:${newTheme.green};
    --light-green:${newTheme.lightGreen};
    --blue:${newTheme.blue};
    --light-blue:${newTheme.lightBlue};
    --orange:${newTheme.orange};
    --light-orange:${newTheme.lightOrange};
    --yellow:${newTheme.yellow};
    --light-yellow:${newTheme.lightYellow};
    --purple:${newTheme.purple};
    --brown:${newTheme.brown};
  }
  </style>`;
}
