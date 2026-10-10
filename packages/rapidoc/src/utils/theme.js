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
    const inlineCodeFg = theme.inlineCodeFg ? theme.inlineCodeFg : '#c58484';
    const selectionBg = fg2;
    const selectionFg = bg2;

    const headerColor = theme.headerColor ? theme.headerColor : ColorUtils.color.brightness(bg1, 10);

    const navBgColor = theme.navBgColor ? theme.navBgColor : ColorUtils.color.brightness(bg1, 10);
    const navTextColor = theme.navTextColor ? theme.navTextColor : ColorUtils.color.opacity(ColorUtils.color.invert(navBgColor), '0.50');
    const navHoverBgColor = theme.navHoverBgColor ? theme.navHoverBgColor : ColorUtils.color.brightness(navBgColor, -15);
    const navHoverTextColor = theme.navHoverTextColor ? theme.navHoverTextColor : ColorUtils.color.invert(navBgColor);
    const navAccentColor = theme.navAccentColor ? theme.navAccentColor : ColorUtils.color.brightness(primaryColor, 25);
    const navAccentTextColor = theme.navAccentTextColor ? theme.navAccentTextColor : ColorUtils.color.invert(navAccentColor);

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
      pink: theme.pink ? theme.pink : '#ffb2b2',
      green: theme.green || '#7ec699',
      blue: theme.blue || '#71b7ff',
      orange: theme.orange ? theme.orange : '#f08d49',
      yellow: theme.yellow || '#827717',

      purple: theme.purple || '#786FF1',
      brown: theme.brown || '#D4AC0D',

      codeBg: theme.codeBg || ColorUtils.color.opacity(ColorUtils.color.brightness(bg1, -15), 0.7),
      codeFg: theme.codeFg || '#aaa',
      codePropertyColor: theme.codePropertyColor || '#79c0ff',
      codeKeywordColor: theme.codeKeywordColor || '#ff7b72',
      codeOperatorColor: theme.codeOperatorColor || '#c9d1d9',

      /* GitHub Dark Syntax Theme */
      syntaxComment: '#8b949e',
      syntaxKeyword: '#ff7b72',
      syntaxOperator: '#c9d1d9',
      syntaxString: '#a5d6ff',
      syntaxConstant: '#79c0ff',
      syntaxFunction: '#d2a8ff',
      syntaxType: '#d2a8ff',
      syntaxVariable: '#ffa657',
      syntaxProperty: '#79c0ff',
      syntaxTag: '#7ee787',
      syntaxSelector: '#d2a8ff',
      syntaxInserted: '#7ee787',
      syntaxDeleted: '#ff7b72',
    };
  } else {
    const bg1 = theme.bg1 ? theme.bg1 : '#fafbfc';
    const fg1 = theme.fg1 ? theme.fg1 : '#444444';
    const bg2 = theme.bg2 ? theme.bg2 : ColorUtils.color.brightness(bg1, -5); // or '#fafafa'
    const bg3 = theme.bg3 ? theme.bg3 : ColorUtils.color.brightness(bg1, -15); // or '#f6f6f6'
    const lightBg = theme.bg3 ? theme.bg3 : ColorUtils.color.brightness(bg1, -45);
    const fg2 = theme.fg2 ? theme.fg2 : ColorUtils.color.brightness(fg1, 17); // or '#555'
    const fg3 = theme.fg3 ? theme.fg3 : ColorUtils.color.brightness(fg1, 30); // or #666
    const lightFg = theme.fg3 ? theme.fg3 : ColorUtils.color.brightness(fg1, 70); // or #999
    const inlineCodeFg = theme.inlineCodeFg ? theme.inlineCodeFg : 'brown';
    const selectionBg = fg2;
    const selectionFg = bg2;
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
    const navAccentTextColor = theme.navAccentTextColor ? theme.navAccentTextColor : ColorUtils.color.invert(navAccentColor);
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
      pink: theme.pink ? theme.pink : '#990055',
      green: theme.green || '#690',
      blue: theme.blue || '#47AFE8',
      orange: theme.orange || '#FF9900',
      yellow: theme.yellow || '#827717',

      purple: theme.purple || '#786FF1',
      brown: theme.brown || '#D4AC0D',

      codeBg: theme.codeBg || ColorUtils.color.opacity(ColorUtils.color.brightness(bg1, -15), 0.7),
      codeFg: theme.codeFg || '#666',
      codePropertyColor: theme.codePropertyColor || '#0550ae',
      codeKeywordColor: theme.codeKeywordColor || '#cf222e',
      codeOperatorColor: theme.codeOperatorColor || '#24292f',

      /* GitHub Light Syntax Theme */
      syntaxComment: '#6e7781',
      syntaxKeyword: '#cf222e',
      syntaxOperator: '#24292f',
      syntaxString: '#0a3069',
      syntaxConstant: '#0550ae',
      syntaxFunction: '#8250df',
      syntaxType: '#8250df',
      syntaxVariable: '#953800',
      syntaxProperty: '#0550ae',
      syntaxTag: '#116329',
      syntaxSelector: '#8250df',
      syntaxInserted: '#116329',
      syntaxDeleted: '#cf222e',
    };
  }
  return html` <style>
    *,
    *:before,
    *:after {
      box-sizing: border-box;
    }

    :host {
      /* Common Styles - irrespective of themes */
      --border-radius: 2px;
      --layout: ${this.layout || 'row'};
      --font-mono: ${this.monoFont || 'Monaco, "Andale Mono", "Roboto Mono", Consolas, monospace'};
      --font-regular: ${this.regularFont || '"Open Sans", Avenir, "Segoe UI", Arial, sans-serif'};
      --scroll-bar-width: 8px;
      --nav-item-padding: ${
        this.navItemSpacing === 'relaxed'
          ? '10px 16px 10px 10px'
          : this.navItemSpacing === 'compact'
            ? '5px 16px 5px 10px'
            : '7px 16px 7px 10px'
      };

      --resp-area-height: ${this.responseAreaHeight};
      --font-size-small: ${this.fontSize === 'default' ? '12px' : this.fontSize === 'large' ? '13px' : '14px'};
      --font-size-mono: ${this.fontSize === 'default' ? '13px' : this.fontSize === 'large' ? '14px' : '15px'};
      --font-size-regular: ${this.fontSize === 'default' ? '14px' : this.fontSize === 'large' ? '15px' : '16px'};
      --dialog-z-index: 1000;
      --table-schema-key-width: 240px;
      --table-schema-key-text-overflow: ellipsis;
      --table-schema-key-whitespace: nowrap;

      --focus-shadow: 0 0 0 1px transparent, 0 0 0 3px var(--primary-color-trans);
      --bg: ${newTheme.bg1};
      --bg2: ${newTheme.bg2};
      --bg3: ${newTheme.bg3};
      --light-bg: ${newTheme.lightBg};
      --fg: ${newTheme.fg1};
      --fg2: ${newTheme.fg2};
      --fg3: ${newTheme.fg3};
      --light-fg: ${newTheme.lightFg};
      --selection-bg: ${newTheme.selectionBg};
      --selection-fg: ${newTheme.selectionFg};
      --overlay-bg: ${newTheme.overlayBg};

      /* Border Colors */
      --border-color: ${newTheme.borderColor};
      --light-border-color: ${newTheme.lightBorderColor};
      --code-border-color: ${newTheme.codeBorderColor};

      --input-bg: ${newTheme.inputBg};
      --placeholder-color: ${newTheme.placeHolder};
      --hover-color: ${newTheme.hoverColor};
      --red: ${newTheme.red};
      --pink: ${newTheme.pink};
      --green: ${newTheme.green};
      --blue: ${newTheme.blue};
      --orange: ${newTheme.orange};
      --yellow: ${newTheme.yellow};
      --purple: ${newTheme.purple};
      --brown: ${newTheme.brown};

      /* Header Color */
      --header-bg: ${newTheme.headerColor};
      --header-fg: ${newTheme.headerColorInvert};
      --header-color-darker: ${newTheme.headerColorDarker};
      --header-color-border: ${newTheme.headerColorBorder};

      /* Nav Colors */
      --nav-bg-color: ${newTheme.navBgColor};
      --nav-text-color: ${newTheme.navTextColor};
      --nav-hover-bg-color: ${newTheme.navHoverBgColor};
      --nav-hover-text-color: ${newTheme.navHoverTextColor};
      --nav-accent-color: ${newTheme.navAccentColor};
      --nav-accent-text-color: ${newTheme.navAccentTextColor};

      /* Nav API Method Colors*/
      --nav-get-color: ${newTheme.blue};
      --nav-put-color: ${newTheme.orange};
      --nav-post-color: ${newTheme.green};
      --nav-delete-color: ${newTheme.red};
      --nav-head-color: ${newTheme.yellow};

      /* Primary Colors */
      --primary-color: ${newTheme.primaryColor};
      --primary-color-invert: ${newTheme.primaryColorInvert};
      --primary-color-trans: ${newTheme.primaryColorTrans};

      /*Code Syntax Color*/
      --code-bg: ${newTheme.codeBg};
      --code-fg: ${newTheme.codeFg};
      --inline-code-fg: ${newTheme.inlineCodeFg};
      --code-property-color: ${newTheme.codePropertyColor};
      --code-keyword-color: ${newTheme.codeKeywordColor};
      --code-operator-color: ${newTheme.codeOperatorColor};

      /* GitHub Syntax Highlighting Theme */
      --syntax-comment: ${newTheme.syntaxComment};
      --syntax-keyword: ${newTheme.syntaxKeyword};
      --syntax-operator: ${newTheme.syntaxOperator};
      --syntax-string: ${newTheme.syntaxString};
      --syntax-constant: ${newTheme.syntaxConstant};
      --syntax-function: ${newTheme.syntaxFunction};
      --syntax-type: ${newTheme.syntaxType};
      --syntax-variable: ${newTheme.syntaxVariable};
      --syntax-property: ${newTheme.syntaxProperty};
      --syntax-tag: ${newTheme.syntaxTag};
      --syntax-selector: ${newTheme.syntaxSelector};
      --syntax-inserted: ${newTheme.syntaxInserted};
      --syntax-deleted: ${newTheme.syntaxDeleted};
    }
  </style>`;
}
