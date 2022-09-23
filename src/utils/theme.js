import { html } from 'lit';
import ColorUtils from '~/utils/color-utils';
/* Generates an schema object containing type and constraint info */
export default function setTheme(baseTheme, theme = {}) {
  let newTheme = {};

  // Common Theme colors
  const primaryColor = theme.primaryColor ? theme.primaryColor : baseTheme === 'dark' ? '#f76b39' : '#ff591e';
  const primaryColorInvert = ColorUtils.color.invert(primaryColor);
  const primaryColorTrans = ColorUtils.color.opacity(primaryColor, '0.4');

  // Dark and Light Theme colors
  if (baseTheme === 'dark') {
    const bg1 = theme.bg1 ? theme.bg1 : '#2a2b2c';
    const fg1 = theme.fg1 ? theme.fg1 : '#bbb';

    const bg2 = theme.bg2 ? theme.bg2 : ColorUtils.color.brightness(bg1, 5); // or #383838;
    const bg3 = theme.bg3 ? theme.bg3 : ColorUtils.color.brightness(bg1, 17); // or #444;
    const lightBg = theme.bg3 ? theme.bg3 : ColorUtils.color.brightness(bg1, 35);
    const fg2 = theme.fg2 ? theme.fg2 : ColorUtils.color.brightness(fg1, -15); // or #ababab
    const fg3 = theme.fg3 ? theme.fg3 : ColorUtils.color.brightness(fg1, -20); // or #aaa
    const lightFg = theme.fg3 ? theme.fg3 : ColorUtils.color.brightness(fg1, -65); // or #777
    const inlineCodeFg = theme.inlineCodeFg ? theme.inlineCodeFg : '#aaa';
    const selectionBg = '#bbb';
    const selectionFg = '#eee';

    const headerColor = theme.headerColor ? theme.headerColor : ColorUtils.color.brightness(bg1, 10);

    const navBgColor = theme.navBgColor ? theme.navBgColor : ColorUtils.color.brightness(bg1, 10);
    const navTextColor = theme.navTextColor ? theme.navTextColor : ColorUtils.color.opacity(ColorUtils.color.invert(navBgColor), '0.50');
    const navHoverBgColor = theme.navHoverBgColor ? theme.navHoverBgColor : ColorUtils.color.brightness(navBgColor, -15);
    const navHoverTextColor = theme.navHoverTextColor ? theme.navHoverTextColor : ColorUtils.color.invert(navBgColor);
    const navAccentColor = theme.navAccentColor ? theme.navAccentColor : ColorUtils.color.brightness(primaryColor, 25);
    const navAccentTextColor = theme.navAccentTextColor ? theme.navAccenttextColor : ColorUtils.color.invert(navAccentColor);

    const overlayBg = 'rgba(80, 80, 80, 0.4)';

    newTheme = {
      bg1,
      bg2,
      bg3,
      lightBg,
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
      overlayBg,
      navBgColor,
      navTextColor,
      navHoverBgColor,
      navHoverTextColor,
      navAccentColor,
      navAccentTextColor,
      headerColor,
      headerColorInvert: ColorUtils.color.invert(headerColor),
      headerColorDarker: ColorUtils.color.brightness(headerColor, -20),
      headerColorBorder: ColorUtils.color.brightness(headerColor, 10),

      borderColor: theme.borderColor || ColorUtils.color.brightness(bg1, 20), // #555
      lightBorderColor: theme.lightBorderColor || ColorUtils.color.brightness(bg1, 15), // #444
      codeBorderColor: theme.codeBorderColor || ColorUtils.color.brightness(bg1, 30),

      inputBg: theme.inputBg || ColorUtils.color.brightness(bg1, -5), // #2f2f2f
      placeHolder: theme.placeHolder || ColorUtils.color.opacity(fg1, '0.3'),
      hoverColor: theme.hoverColor || ColorUtils.color.brightness(bg1, -10), // #2a2a2a

      red: theme.red ? theme.red : '#F06560',
      lightRed: theme.lightRed ? theme.lightRed : ColorUtils.color.brightness(bg1, -10), // #2a2a2a

      pink: theme.pink ? theme.pink : '#ffb2b2',
      lightPink: theme.lightPink || ColorUtils.color.brightness(bg1, -10),

      green: theme.green || '#7ec699',
      lightGreen: theme.lightGreen || ColorUtils.color.brightness(bg1, -10), // #2a2a2a

      blue: theme.blue || '#71b7ff',
      lightBlue: theme.lightBlue || ColorUtils.color.brightness(bg1, -10), // #2a2a2a

      orange: theme.orange ? theme.orange : '#f08d49',
      lightOrange: theme.lightOrange || ColorUtils.color.brightness(bg1, -10), // #2a2a2a

      yellow: theme.yellow || '#827717',
      lightYellow: theme.lightYellow || ColorUtils.color.brightness(bg1, -10), // #2a2a2a

      purple: theme.purple || '#786FF1',
      brown: theme.brown || '#D4AC0D',

      codeBg: theme.codeBg || ColorUtils.color.opacity(ColorUtils.color.brightness(bg1, -15), 0.7),
      codeFg: theme.codeFg || '#aaa',
      codePropertyColor: theme.codePropertyColor || '#f8c555',
      codeKeywordColor: theme.codeKeywordColor || '#cc99cd',
      codeOperatorColor: theme.codeOperatorColor || '#67cdcc',
    };
  } else {
    const bg1 = (theme.bg1 ? theme.bg1 : '#fafbfc');
    const fg1 = (theme.fg1 ? theme.fg1 : '#444444');
    const bg2 = theme.bg2 ? theme.bg2 : ColorUtils.color.brightness(bg1, -5); // or '#fafafa'
    const bg3 = theme.bg3 ? theme.bg3 : ColorUtils.color.brightness(bg1, -15); // or '#f6f6f6'
    const lightBg = theme.bg3 ? theme.bg3 : ColorUtils.color.brightness(bg1, -45);
    const fg2 = theme.fg2 ? theme.fg2 : ColorUtils.color.brightness(fg1, 17); // or '#555'
    const fg3 = theme.fg3 ? theme.fg3 : ColorUtils.color.brightness(fg1, 30); // or #666
    const lightFg = theme.fg3 ? theme.fg3 : ColorUtils.color.brightness(fg1, 70); // or #999
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
    const navBgColor = theme.navBgColor ? theme.navBgColor : ColorUtils.color.brightness(bg1, -200);
    const navTextColor = theme.navTextColor ? theme.navTextColor : ColorUtils.color.opacity(ColorUtils.color.invert(navBgColor), '0.65');
    const navHoverBgColor = theme.navHoverBgColor ? theme.navHoverBgColor : ColorUtils.color.brightness(navBgColor, -15);
    const navHoverTextColor = theme.navHoverTextColor ? theme.navHoverTextColor : ColorUtils.color.invert(navBgColor);
    const navAccentColor = theme.navAccentColor ? theme.navAccentColor : ColorUtils.color.brightness(primaryColor, 25);
    const navAccentTextColor = theme.navAccentTextColor ? theme.navAccenttextColor : ColorUtils.color.invert(navAccentColor);
    const overlayBg = 'rgba(0, 0, 0, 0.4)';

    newTheme = {
      bg1,
      bg2,
      bg3,
      lightBg,
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
      overlayBg,
      navBgColor,
      navTextColor,
      navHoverBgColor,
      navHoverTextColor,
      navAccentColor,
      navAccentTextColor,
      headerColor,
      headerColorInvert: ColorUtils.color.invert(headerColor),
      headerColorDarker: ColorUtils.color.brightness(headerColor, -20),
      headerColorBorder: ColorUtils.color.brightness(headerColor, 10),

      borderColor: theme.borderColor || ColorUtils.color.brightness(bg1, -38),
      lightBorderColor: theme.lightBorderColor || ColorUtils.color.brightness(bg1, -23),
      codeBorderColor: theme.codeBorderColor || 'transparent',

      inputBg: theme.inputBg || ColorUtils.color.brightness(bg1, 10), // #fff
      placeHolder: theme.placeHolder || ColorUtils.color.brightness(lightFg, 20), // #dedede
      hoverColor: theme.hoverColor || ColorUtils.color.brightness(bg1, -5), // # f1f1f1

      red: theme.red || '#F06560',
      lightRed: theme.lightRed || '#fff0f0',

      pink: theme.pink ? theme.pink : '#990055',
      lightPink: theme.lightPink ? theme.lightPink : '#ffb2b2',

      green: theme.green || '#690',
      lightGreen: theme.lightGreen || '#fbfff0',

      blue: theme.blue || '#47AFE8',
      lightBlue: theme.lightBlue || '#eff8fd',

      orange: theme.orange || '#FF9900',
      lightOrange: theme.lightOrange || '#fff5e6',

      yellow: theme.yellow || '#827717',
      lightYellow: theme.lightYellow || '#fff5cc',

      purple: theme.purple || '#786FF1',
      brown: theme.brown || '#D4AC0D',

      codeBg: theme.codeBg || ColorUtils.color.opacity(ColorUtils.color.brightness(bg1, -15), 0.7),
      codeFg: theme.codeFg || '#666',
      codePropertyColor: theme.codePropertyColor || '#905',
      codeKeywordColor: theme.codeKeywordColor || '#07a',
      codeOperatorColor: theme.codeOperatorColor || '#9a6e3a',
    };
  }
  return html`
  <style>
  *, *:before, *:after { box-sizing: border-box; }
  
  :host {
    /* Common Styles - irrespective of themes */  
    --border-radius: 2px;
    --layout: ${this.layout || 'row'};
    --font-mono: ${this.monoFont || 'Monaco, "Andale Mono", "Roboto Mono", Consolas, monospace'};
    --font-regular: ${this.regularFont || '"Open Sans", Avenir, "Segoe UI", Arial, sans-serif'};
    --scroll-bar-width: 8px;
    --nav-item-padding: ${this.navItemSpacing === 'relaxed'
    ? '10px 16px 10px 10px'
    : (this.navItemSpacing === 'compact'
      ? '5px 16px 5px 10px'
      : '7px 16px 7px 10px')};
    
    --resp-area-height: ${this.responseAreaHeight};
    --font-size-small: ${this.fontSize === 'default' ? '12px' : (this.fontSize === 'large' ? '13px' : '14px')};
    --font-size-mono: ${this.fontSize === 'default' ? '13px' : (this.fontSize === 'large' ? '14px' : '15px')};
    --font-size-regular: ${this.fontSize === 'default' ? '14px' : (this.fontSize === 'large' ? '15px' : '16px')};
    --dialog-z-index: 1000;

    --focus-shadow: 0 0 0 1px transparent, 0 0 0 3px ${newTheme.primaryColorTrans};

    /* Theme specific styles */  
    --bg:${newTheme.bg1};
    --bg2:${newTheme.bg2};
    --bg3:${newTheme.bg3};
    --light-bg:${newTheme.lightBg};
    --fg:${newTheme.fg1};
    --fg2:${newTheme.fg2};
    --fg3:${newTheme.fg3};
    --light-fg:${newTheme.lightFg};
    --selection-bg:${newTheme.selectionBg};
    --selection-fg:${newTheme.selectionFg};
    --overlay-bg:${newTheme.overlayBg};
    
    /* Border Colors */
    --border-color:${newTheme.borderColor};
    --light-border-color:${newTheme.lightBorderColor};
    --code-border-color:${newTheme.codeBorderColor};

    --input-bg:${newTheme.inputBg};
    --placeholder-color:${newTheme.placeHolder};
    --hover-color:${newTheme.hoverColor};
    --red:${newTheme.red};
    --light-red:${newTheme.lightRed};
    --pink:${newTheme.pink};
    --light-pink:${newTheme.lightPink};
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
    --nav-accent-text-color:${newTheme.navAccentTextColor};

    /* Nav API Method Colors*/
    --nav-get-color:${newTheme.blue};
    --nav-put-color:${newTheme.orange};
    --nav-post-color:${newTheme.green};
    --nav-delete-color:${newTheme.red};
    --nav-head-color:${newTheme.yellow};

    /* Primary Colors */  
    --primary-color:${newTheme.primaryColor};
    --primary-color-invert:${newTheme.primaryColorInvert};
    --primary-color-trans:${newTheme.primaryColorTrans};

    /*Code Syntax Color*/
    --code-bg:${newTheme.codeBg};
    --code-fg:${newTheme.codeFg};
    --inline-code-fg:${newTheme.inlineCodeFg};
    --code-property-color:${newTheme.codePropertyColor};
    --code-keyword-color:${newTheme.codeKeywordColor};
    --code-operator-color:${newTheme.codeOperatorColor};
  }
  </style>`;
}
