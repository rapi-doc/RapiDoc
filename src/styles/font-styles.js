import vars from './vars';
import {html} from 'lit-element'; 

export default html`
<style>
    .regular-font{font-family:var(--font-regular);}
    .mono-font{font-family:var(--font-mono);}

    h1{ font-family:var(--font-regular); font-size:26px; font-weight:200; letter-spacing:normal; }
    h2{ font-family:var(--font-regular); font-size:24px; font-weight:200; letter-spacing:normal; }
    h3{ font-family:var(--font-regular); font-size:22px; font-weight:200; letter-spacing:normal; }
    h4{ font-family:var(--font-regular); font-size:18px; font-weight:200; letter-spacing:normal; }
    h5{ font-family:var(--font-regular); font-size:16px; font-weight:200; letter-spacing:normal; }
    h6{ font-family:var(--font-regular); font-size:14px; font-weight:200; letter-spacing:normal; }

    h1,h2,h3,h4,h5,h5{
      margin-block-end: 0.2em;
    }
    p{margin-block-start: 0.5em;}
    code,
    pre{
      font-family: var(--font-mono);
    }

    /* Text */
    .m-text{vertical-align: middle;}
    .m-text.small{font-size: 12px;line-height: 12px;}
    .m-text.gray{color: var(--light-fg)}
    .m-text.primary{color: var(--primary-color); }
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
        color:var(--light-fg);
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
        border: 1px solid var(--light-border-color);
        border-radius: 3px;
        color: var(--fg);
        font-size: 12px;
    }

    .m-markdown pre{
        white-space: pre-wrap;
        background-color: var(--pre-bg);
        color:var(--pre-fg);
        padding: 12px 14px 15px 14px;
        overflow-x: auto;
        line-height: normal;
        border-radius: 4px;
        border: 1px solid var(--pre-border-color);
    }
    .m-markdown pre code {
        border:none;
        background-color:transparent;
        color: var(--code-fg);
    }
    .m-markdown ul,
    .m-markdown ol{
        padding-inline-start:30px
    }
    .m-markdown li{
        line-height: 1.2em;
    }
    .m-markdown a{color:var(--link-color)}
</style>`
