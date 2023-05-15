import { css } from 'lit';

export default css`
.only-large-screen { display:none; }
.endpoint-head .path{
  display: flex;
  font-family:var(--font-mono);
  font-size: var(--font-size-small);
  align-items: center;
  overflow-wrap: break-word;
  word-break: break-all;
}

.endpoint-head .descr {
  font-size: var(--font-size-small);
  color:var(--light-fg);
  font-weight:400;
  align-items: center;
  overflow-wrap: break-word;
  word-break: break-all;
  display:none;
}

.m-endpoint.expanded{margin-bottom:16px; }
.m-endpoint > .endpoint-head{
  border-width:1px 1px 1px 5px;
  border-style:solid;
  border-color:transparent;
  border-top-color:var(--light-border-color);
  display:flex;
  padding:6px 16px;
  align-items: center;
  cursor: pointer;
}
.m-endpoint > .endpoint-head.put:hover,
.m-endpoint > .endpoint-head.put.expanded{
  color:var(--put-color); 
  background-color:var(--put-bg-color);
  border-color:var(--put-border-color);
}
.m-endpoint > .endpoint-head.post:hover,
.m-endpoint > .endpoint-head.post.expanded {
  color:var(--post-color);
  background-color:var(--post-bg-color);
  border-color:var(--post-border-color);
}
.m-endpoint > .endpoint-head.get:hover,
.m-endpoint > .endpoint-head.get.expanded {
  color:var(--get-color); 
  background-color:var(--get-bg-color);
  border-color:var(--get-border-color);
}
.m-endpoint > .endpoint-head.patch:hover,
.m-endpoint > .endpoint-head.patch.expanded {
  color:var(--patch-color); 
  background-color:var(--patch-bg-color);
  border-color:var(--patch-border-color);
}
.m-endpoint > .endpoint-head.delete:hover,
.m-endpoint > .endpoint-head.delete.expanded {
  color:var(--delete-color); 
  background-color:var(--delete-bg-color);
  border-color:var(--delete-border-color);
}

.m-endpoint > .endpoint-head.head:hover,
.m-endpoint > .endpoint-head.head.expanded,
.m-endpoint > .endpoint-head.patch:hover,
.m-endpoint > .endpoint-head.patch.expanded,
.m-endpoint > .endpoint-head.options:hover,
.m-endpoint > .endpoint-head.options.expanded {
  border-color:var(--yellow); 
  background-color:var(--light-yellow); 
}

.m-endpoint > .endpoint-head.deprecated:hover,
.m-endpoint > .endpoint-head.deprecated.expanded {
  border-color:var(--border-color); 
  filter:opacity(0.6);
}

.m-endpoint .endpoint-body {
  flex-wrap:wrap;
  padding:16px 0px 0 0px;
}
.m-endpoint .endpoint-body.delete{ border-color:var(--delete-border-color); }
.m-endpoint .endpoint-body.put{ border-color:var(--put-border-color); }
.m-endpoint .endpoint-body.post{ border-color:var(--post-border-color); }
.m-endpoint .endpoint-body.get{ border-color:var(--get-border-color); }
.m-endpoint .endpoint-body.head,
.m-endpoint .endpoint-body.patch,
.m-endpoint .endpoint-body.options { 
  border-color:var(--yellow); 
}

.m-endpoint .endpoint-body.deprecated{ 
  border-color:var(--border-color);
  filter:opacity(0.6);
}

.endpoint-head .deprecated{
  color: var(--light-fg);
  filter:opacity(0.6);
}

.summary{
  padding: 24px 16px;
}
.summary .title{
  font-size: 28px;
  margin-bottom: 24px;
  word-break: break-all;
}

.path-description p {
    font-size: 18px;
    line-height: 24px;
    margin: 0;
}

.endpoint-head .method{
  padding:2px 5px;
  vertical-align: middle;
  font-size:var(--font-size-small);
  height: calc(var(--font-size-small) + 16px);
  line-height: calc(var(--font-size-small) + 8px);
  width: 60px;
  border-radius: 2px;
  display:inline-block;
  text-align: center;
  font-weight: bold;
  text-transform:uppercase;
  margin-right:5px;
}
.endpoint-head .method.delete{ border: 2px solid var(--delete-border-color);}
.endpoint-head .method.put{ border: 2px solid var(--put-border-color); }
.endpoint-head .method.post{ border: 2px solid var(--post-border-color); }
.endpoint-head .method.get{ border: 2px solid var(--get-border-color); }
.endpoint-head .method.get.deprecated{ border: 2px solid var(--border-color); }
.endpoint-head .method.head,
.endpoint-head .method.patch,
.endpoint-head .method.options { 
  border: 2px solid var(--yellow); 
}

.req-resp-container {
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  flex-direction: column;
  border-top:1px solid var(--light-border-color);
}

.view-mode-request,
api-response.view-mode {
  flex:1; 
  min-height:100px;
  padding: 0 16px 24px 16px;
  overflow:hidden;
}
.view-mode-request {
  border-width: 0;
  border-style:dashed;
}

.head .view-mode-request,
.patch .view-mode-request,
.options .view-mode-request { 
  border-color:var(--yellow); 
}
.put .view-mode-request { 
  border-color:var(--put-color); 
}
.post .view-mode-request { 
  border-color:var(--post-color); 
}
.get .view-mode-request { 
  border-color:var(--get-color); 
}
.delete .view-mode-request { 
  border-color:var(--delete-color); 
}

blockquote {
  padding: 20px;
}

blockquote h3 {
  margin: 0;
  padding: 0;
}

blockquote.warning {
  border-left: 3px solid #f0ad4e;
  background-color: #fcf8f2;
}

blockquote.warning h3 {
  color: #f0ad4e;
}

blockquote.danger {
  border-left: 3px solid #d9534f;
  background-color: #fdf7f7;
}

blockquote.danger h3 {
  color: #d9534f;
}

blockquote.info {
  border-left: 3px solid #5bc0de;
  background-color: #e3edf2;
}

blockquote.info h3 {
  color: #5bc0de;
}

blockquote.success {
  border-left: 3px solid #50af51;
  background-color: #f3f8f3;
}

blockquote.success h3 {
  color: #50af51;
}

pre {
  overflow: scroll;
  max-height: 1000px;
  margin-top: 15px!important;
  margin-bottom: 15px!important;
}

table {
  border-spacing: 0px;
  border-collapse: collapse;
}

table th {
  border: 1px solid #dfe2e5;
  padding: 6px 13px;
}

table td {
  border: 1px solid #dfe2e5;
  padding: 6px 13px;
}

@media only screen and (min-width: 1024px) {
  .only-large-screen { display:block; }
  .endpoint-head .path{
    font-size: var(--font-size-regular);
  }
  .endpoint-head .descr{
    display: flex;
  }
  .endpoint-head .m-markdown-small,
  .descr .m-markdown-small{
    display:block;
  }
  .req-resp-container{
    flex-direction: var(--layout, row);
    flex-wrap: nowrap;
  }
  api-response.view-mode {
    padding:16px;
  }
  .view-mode-request.row-layout {
    border-width:0 1px 0 0;
    padding:16px;
  }
  .summary{
    padding:24px 16px;
  }
}
`;
