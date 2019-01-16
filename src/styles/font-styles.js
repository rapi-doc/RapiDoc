import vars from './vars';
import {html} from 'lit-element'; 

export default html`
<style>
    .regular-font{font-family:${vars.font.regular};}
    .mono-font{font-family:${vars.font.mono};}

    h1{ font-family:${vars.font.regular}; font-size:26px; font-weight:200; letter-spacing:normal; }
    h2{ font-family:${vars.font.regular}; font-size:24px; font-weight:200; letter-spacing:normal; }
    h3{ font-family:${vars.font.regular}; font-size:22px; font-weight:200; letter-spacing:normal; }
    h4{ font-family:${vars.font.regular}; font-size:18px; font-weight:200; letter-spacing:normal; }
    h5{ font-family:${vars.font.regular}; font-size:16px; font-weight:200; letter-spacing:normal; }
    h6{ font-family:${vars.font.regular}; font-size:14px; font-weight:200; letter-spacing:normal; }

    h1,h2,h3,h4,h5,h5{
      margin-block-end: 0.2em;
    }
    p{margin-block-start: 0.5em;}
    code,
    pre{
      font-family: ${vars.font.mono};
    }

    /* Text */
    .m-text{vertical-align: middle;}
    .m-text.small{font-size: 12px;line-height: 12px;}
    .m-text.gray{color: ${vars.color.lightFg}}
    .m-text.primary{color: ${vars.color.primaryFg}; }
    .m-text.bold{font-weight:bold;}
    .m-text.bottom-margin{ margin-bottom:4px}
    
    /* Sub Title */
    .m-sub-title {
      font-size:20px;
      white-space:nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .m-sub-title.m-1{
      font-size: 16px;
      font-weight:bold;
      margin: 20px 0 4px 0;
    }

    .m-sub-title.m-2{
      font-size: 14px;
      font-weight:bold;
      margin: 16px 0 4px 0;
    }

    .m-sub-title.m-3 {
        font-size: 12px;
        font-weight:bold;
        margin: 12px 0 4px 0;
    }

    /* Markdown */
    .m-markdown p:only-child{
        color:${vars.color.lightFg};
        font-size:12px;
        line-height:normal;
        margin-top:0;
    }
    .m-markdown p{
        line-height: 16px;
    }
    .m-markdown code{
        background-color: rgba(0, 0, 0, 0.02);
        padding: 0px 6px;
        border: 1px solid ${vars.color.lightBorder};
        border-radius: 3px;
        color: #666;
        font-size: 12px;
    }

    .m-markdown pre{
        white-space: pre-wrap;
        background-color: ${vars.color.codeBg};
        color: ${vars.color.codeFg};
        padding: 12px 14px 15px 14px;
        overflow-x: auto;
        line-height: normal;
        border-radius: 2px;
        border: 1px solid rgba(38, 50, 56, 0.1);
    }
    .m-markdown pre code {
        border:none;
        background-color:transparent;
        color:#ccc;
    }
    .m-markdown ul,
    .m-markdown ol{
        padding-inline-start:30px
    }
    .m-markdown li{
        line-height: 1.2em;
    }
</style>`
