
import { html } from 'lit-element';
import ColorUtils from '@/utils/color-utils';
/* Generates an schema object containing type and constraint info */
export default function setTheme(baseTheme, theme = {}) {
  let newTheme = {};

  // Common Theme colors
  const primaryColor = theme.primaryColor ? theme.primaryColor : '#ff591e';
  const primaryColorInvert = ColorUtils.color.invert(primaryColor);
  const primaryColorTrans = ColorUtils.color.opacity(primaryColor, '0.8');

  // Dark and Light Theme colors
  if (baseTheme === 'dark') {
    const bg1 = theme.bg1 ? theme.bg1 : '#333';
    const fg1 = theme.fg1 ? theme.fg1 : '#bbb';

    const bg2 = theme.bg2 ? theme.bg2 : ColorUtils.color.brightness(bg1, 5); // or #383838;
    const bg3 = theme.bg3 ? theme.bg3 : ColorUtils.color.brightness(bg1, 17); // or #444;
    const fg2 = theme.fg2 ? theme.fg2 : ColorUtils.color.brightness(fg1, -15); // or #ababab
    const fg3 = theme.fg3 ? theme.fg3 : ColorUtils.color.brightness(fg1, -20); // or #aaa
    const lightFg = theme.fg3 ? theme.fg3 : ColorUtils.color.brightness(fg1, -65); // or #777
    // const inlineCodeFg = theme.inlineCodeFg ? theme.inlineCodeFg : ColorUtils.color.brightness(fg1, 10);
    const inlineCodeFg = theme.inlineCodeFg ? theme.inlineCodeFg : '#cdcdcd';
    const selectionBg = '#bbb';
    const selectionFg = '#eee';

    const headerColor = theme.headerColor ? theme.headerColor : ColorUtils.color.brightness(bg1, 10);

    const navBgColor = theme.navBgColor ? theme.navBgColor : ColorUtils.color.brightness(bg1, 10);
    const navTextColor = theme.navTextColor ? theme.navTextColor : ColorUtils.color.opacity(ColorUtils.color.invert(navBgColor), '0.65');
    const navHoverBgColor = theme.navHoverBgColor ? theme.navHoverBgColor : ColorUtils.color.brightness(navBgColor, -15);
    const navHoverTextColor = theme.navHoverTextColor ? theme.navHoverTextColor : ColorUtils.color.invert(navBgColor);
    const navAccentColor = theme.navAccentColor ? theme.navAccentColor : primaryColor;

    newTheme = {
      bg1,
      bg2,
      bg3,
      fg1,
      fg2,
      fg3,
      lightFg,
      inlineCodeFg,
      primaryColor,
      primaryColorTrans,
      primaryColorInvert,
      selectionBg,
      selectionFg,

      navBgColor,
      navTextColor,
      navHoverBgColor,
      navHoverTextColor,
      navAccentColor,

      headerColor,
      headerColorInvert: ColorUtils.color.invert(headerColor),
      headerColorDarker: ColorUtils.color.brightness(headerColor, -20),
      headerColorBorder: ColorUtils.color.brightness(headerColor, 10),

      borderColor: theme.borderColor ? theme.borderColor : ColorUtils.color.brightness(bg1, 20), // #555
      lightBorderColor: theme.lightBorderColor ? theme.lightBorderColor : ColorUtils.color.brightness(bg1, 15), // #444
      codeBorderColor: theme.codeBorderColor ? theme.codeBorderColor : ColorUtils.color.brightness(bg1, 30),

      codeBg: theme.codeBg ? theme.codeBg : ColorUtils.color.brightness(bg1, -10),
      codeFg: theme.codeFg ? theme.codeFg : '#999',

      inputBg: theme.inputBg ? theme.inputBg : ColorUtils.color.brightness(bg1, -5), // #2f2f2f
      placeHolder: theme.placeHolder ? theme.placeHolder : ColorUtils.color.opacity(fg1, '0.3'),
      hoverColor: theme.hoverColor ? theme.hoverColor : ColorUtils.color.brightness(bg1, -10), // #2a2a2a

      red: theme.red ? theme.red : '#F06560',
      lightRed: theme.lightRed ? theme.lightRed : ColorUtils.color.brightness(bg1, -10), // #2a2a2a

      green: theme.green ? theme.green : '#99CC00',
      lightGreen: theme.lightGreen ? theme.lightGreen : ColorUtils.color.brightness(bg1, -10), // #2a2a2a

      blue: theme.blue ? theme.blue : '#47AFE8',
      lightBlue: theme.lightBlue ? theme.lightBlue : ColorUtils.color.brightness(bg1, -10), // #2a2a2a

      orange: theme.orange ? theme.orange : '#FF9900',
      lightOrange: theme.lightOrange ? theme.lightOrange : ColorUtils.color.brightness(bg1, -10), // #2a2a2a

      yellow: theme.yellow ? theme.yellow : '#fc0',
      lightYellow: theme.lightYellow ? theme.lightYellow : ColorUtils.color.brightness(bg1, -10), // #2a2a2a

      purple: theme.purple ? theme.purple : '#786FF1',
      brown: theme.brown ? theme.brown : '#D4AC0D',
    };
  } else {
    const bg1 = (theme.bg1 ? theme.bg1 : '#ffffff');
    const fg1 = (theme.fg1 ? theme.fg1 : '#444444');
    const bg2 = theme.bg2 ? theme.bg2 : ColorUtils.color.brightness(bg1, -5); // or '#fafafa'
    const bg3 = theme.bg3 ? theme.bg3 : ColorUtils.color.brightness(bg1, -15); // or '#f6f6f6'

    const fg2 = theme.fg2 ? theme.fg2 : ColorUtils.color.brightness(fg1, 17); // or '#555'
    const fg3 = theme.fg3 ? theme.fg3 : ColorUtils.color.brightness(fg1, 30); // or #666
    const lightFg = theme.fg3 ? theme.fg3 : ColorUtils.color.brightness(fg1, 70); // or #999
    // const inlineCodeFg = theme.inlineCodeFg ? theme.inlineCodeFg : ColorUtils.color.brightness(fg1, -10);
    const inlineCodeFg = theme.inlineCodeFg ? theme.inlineCodeFg : 'brown';

    const selectionBg = '#444';
    const selectionFg = '#eee';

    const headerColor = theme.headerColor ? theme.headerColor : ColorUtils.color.brightness(bg1, -180);

    /*
    const navBgColor = theme.navBgColor ? theme.navBgColor : ColorUtils.color.brightness(bg1, -10);
    const navTextColor = theme.navTextColor ? theme.navTextColor : ColorUtils.color.brightness(fg1, 5);
    const navHoverBgColor = theme.navHoverBgColor ? theme.navHoverBgColor : bg1;
    const navHoverTextColor = theme.navHoverTextColor ? theme.navHoverTextColor : primaryColor;
    const navAccentColor = theme.navAccentColor ? theme.navAccentColor : primaryColor;
    */
    const navBgColor = theme.navBgColor ? theme.navBgColor : ColorUtils.color.brightness(bg1, -180);
    const navTextColor = theme.navTextColor ? theme.navTextColor : ColorUtils.color.opacity(ColorUtils.color.invert(navBgColor), '0.65');
    const navHoverBgColor = theme.navHoverBgColor ? theme.navHoverBgColor : ColorUtils.color.brightness(navBgColor, -15);
    const navHoverTextColor = theme.navHoverTextColor ? theme.navHoverTextColor : ColorUtils.color.invert(navBgColor);
    const navAccentColor = theme.navAccentColor ? theme.navAccentColor : primaryColor;
    newTheme = {
      bg1,
      bg2,
      bg3,
      fg1,
      fg2,
      fg3,
      lightFg,
      inlineCodeFg,
      primaryColor,
      primaryColorTrans,
      primaryColorInvert,
      selectionBg,
      selectionFg,

      navBgColor,
      navTextColor,
      navHoverBgColor,
      navHoverTextColor,
      navAccentColor,

      headerColor,
      headerColorInvert: ColorUtils.color.invert(headerColor),
      headerColorDarker: ColorUtils.color.brightness(headerColor, -20),
      headerColorBorder: ColorUtils.color.brightness(headerColor, 10),

      borderColor: theme.borderColor ? theme.borderColor : ColorUtils.color.brightness(bg1, -25), // #ddd
      lightBorderColor: theme.lightBorderColor ? theme.lightBorderColor : ColorUtils.color.brightness(bg1, -15), // #eee
      codeBorderColor: theme.codeBorderColor ? theme.codeBorderColor : '#transparent',

      codeBg: theme.codeBg ? theme.codeBg : '#555',
      codeFg: theme.codeFg ? theme.codeFg : '#ccc',

      inputBg: theme.inputBg ? theme.inputBg : ColorUtils.color.brightness(bg1, 10), // #fff
      placeHolder: theme.placeHolder ? theme.placeHolder : ColorUtils.color.brightness(lightFg, 20), // #dedede
      hoverColor: theme.hoverColor ? theme.hoverColor : ColorUtils.color.brightness(bg1, -5), // # f1f1f1

      red: theme.red ? theme.red : '#F06560',
      lightRed: theme.lightRed ? theme.lightRed : '#fff0f0',

      green: theme.green ? theme.green : '#48AD1A',
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
    --selection-bg:${newTheme.selectionBg};
    --selection-fg:${newTheme.selectionFg};
    
    /* Border Colors */
    --border-color:${newTheme.borderColor};
    --light-border-color:${newTheme.lightBorderColor};
    --code-border-color:${newTheme.codeBorderColor};

    --code-bg:${newTheme.codeBg};
    --code-fg:${newTheme.codeFg};
    --inline-code-fg:${newTheme.inlineCodeFg};
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

    /* Header Color */
    --header-bg:${newTheme.headerColor};
    --header-fg:${newTheme.headerColorInvert};
    --header-color-darker:${newTheme.headerColorDarker};
    --header-color-border:${newTheme.headerColorBorder};

    /* Nav Colors */  
    --nav-bg-color:${newTheme.navBgColor};
    --nav-text-color:${newTheme.navTextColor};
    --nav-hover-bg-color:${newTheme.navHoverBgColor};
    --nav-hover-text-color:${newTheme.navHoverTextColor};
    --nav-accent-color:${newTheme.navAccentColor};

    /* Primary Colors */  
    --primary-color:${newTheme.primaryColor};
    --primary-color-invert:${newTheme.primaryColorInvert};
    --primary-color-trans:${newTheme.primaryColorTrans};
  }
  </style>`;
}
