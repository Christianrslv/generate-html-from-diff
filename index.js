import { getInput, setOutput, setFailed, exportVariable } from '@actions/core';
import { context } from '@actions/github';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const Diff2html = require('diff2html');
  
const header = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
    .hljs {
      display: block;
      overflow-x: auto;
      padding: .5em;
      color: #333;
      background: #f8f8f8
    }
    .hljs-comment,
    .hljs-quote {
      color: #998;
      font-style: italic
    }
    .hljs-keyword,
    .hljs-selector-tag,
    .hljs-subst {
      color: #333;
      font-weight: 700
    }
    .hljs-literal,
    .hljs-number,
    .hljs-tag .hljs-attr,
    .hljs-template-variable,
    .hljs-variable {
      color: teal
    }
    .hljs-doctag,
    .hljs-string {
      color: #d14
    }
    .hljs-section,
    .hljs-selector-id,
    .hljs-title {
      color: #900;
      font-weight: 700
    }
    .hljs-subst {
      font-weight: 400
    }
    .hljs-class .hljs-title,
    .hljs-type {
      color: #458;
      font-weight: 700
    }
    .hljs-attribute,
    .hljs-name,
    .hljs-tag {
      color: navy;
      font-weight: 400
    }
    .hljs-link,
    .hljs-regexp {
      color: #009926
    }
    .hljs-bullet,
    .hljs-symbol {
      color: #990073
    }
    .hljs-built_in,
    .hljs-builtin-name {
      color: #0086b3
    }
    .hljs-meta {
      color: #999;
      font-weight: 700
    }
    .hljs-deletion {
      background: #fdd
    }
    .hljs-addition {
      background: #dfd
    }
    .hljs-emphasis {
      font-style: italic
    }
    .hljs-strong {
      font-weight: 700
    }
    .d2h-d-none {
      display: none
    }
    .d2h-wrapper {
      text-align: left
    }
    .d2h-file-header {
      background-color: #f7f7f7;
      border-bottom: 1px solid #d8d8d8;
      font-family: Source Sans Pro, Helvetica Neue, Helvetica, Arial, sans-serif;
      height: 35px;
      padding: 5px 10px
    }
    .d2h-file-header,
    .d2h-file-stats {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex
    }
    .d2h-file-stats {
      font-size: 14px;
      margin-left: auto
    }
    .d2h-lines-added {
      border: 1px solid #b4e2b4;
      border-radius: 5px 0 0 5px;
      color: #399839;
      padding: 2px;
      text-align: right;
      vertical-align: middle
    }
    .d2h-lines-deleted {
      border: 1px solid #e9aeae;
      border-radius: 0 5px 5px 0;
      color: #c33;
      margin-left: 1px;
      padding: 2px;
      text-align: left;
      vertical-align: middle
    }
    .d2h-file-name-wrapper {
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      font-size: 15px;
      width: 100%
    }
    .d2h-file-name {
      overflow-x: hidden;
      text-overflow: ellipsis;
      white-space: nowrap
    }
    .d2h-file-wrapper {
      border: 1px solid #ddd;
      border-radius: 3px;
      margin-bottom: 1em
    }
    .d2h-file-collapse {
      -webkit-box-pack: end;
      -ms-flex-pack: end;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      border: 1px solid #ddd;
      border-radius: 3px;
      cursor: pointer;
      display: none;
      font-size: 12px;
      justify-content: flex-end;
      padding: 4px 8px
    }
    .d2h-file-collapse .d2h-selected {
      background-color: #c8e1ff
    }
    .d2h-file-collapse-input {
      margin: 0 4px 0 0
    }
    .d2h-diff-table {
      border-collapse: collapse;
      font-family: Menlo, Consolas, monospace;
      font-size: 13px;
      width: 100%
    }
    .d2h-files-diff {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      width: 100%
    }
    .d2h-file-diff {
      overflow-y: hidden
    }
    .d2h-file-side-diff {
      display: inline-block;
      margin-bottom: -8px;
      margin-right: -4px;
      overflow-x: scroll;
      overflow-y: hidden;
      width: 50%
    }
    .d2h-code-line {
      padding: 0 8em
    }
    .d2h-code-line,
    .d2h-code-side-line {
      display: inline-block;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      white-space: nowrap;
      width: 100%
    }
    .d2h-code-side-line {
      padding: 0 4.5em
    }
    .d2h-code-line-ctn {
      word-wrap: normal;
      background: none;
      display: inline-block;
      padding: 0;
      -webkit-user-select: text;
      -moz-user-select: text;
      -ms-user-select: text;
      user-select: text;
      vertical-align: middle;
      white-space: pre;
      width: 100%
    }
    .d2h-code-line del,
    .d2h-code-side-line del {
      background-color: #ffb6ba
    }
    .d2h-code-line del,
    .d2h-code-line ins,
    .d2h-code-side-line del,
    .d2h-code-side-line ins {
      border-radius: .2em;
      display: inline-block;
      margin-top: -1px;
      text-decoration: none;
      vertical-align: middle
    }
    .d2h-code-line ins,
    .d2h-code-side-line ins {
      background-color: #97f295;
      text-align: left
    }
    .d2h-code-line-prefix {
      word-wrap: normal;
      background: none;
      display: inline;
      padding: 0;
      white-space: pre
    }
    .line-num1 {
      float: left
    }
    .line-num1,
    .line-num2 {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      overflow: hidden;
      padding: 0 .5em;
      text-overflow: ellipsis;
      width: 3.5em
    }
    .line-num2 {
      float: right
    }
    .d2h-code-linenumber {
      background-color: #fff;
      border: solid #eee;
      border-width: 0 1px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      color: rgba(0, 0, 0, .3);
      cursor: pointer;
      display: inline-block;
      position: absolute;
      text-align: right;
      width: 7.5em
    }
    .d2h-code-linenumber:after {
      content: "\\200b"
    }
    .d2h-code-side-linenumber {
      background-color: #fff;
      border: solid #eee;
      border-width: 0 1px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      color: rgba(0, 0, 0, .3);
      cursor: pointer;
      display: inline-block;
      overflow: hidden;
      padding: 0 .5em;
      position: absolute;
      text-align: right;
      text-overflow: ellipsis;
      width: 4em
    }
    .d2h-code-side-linenumber:after {
      content: "\\200b"
    }
    .d2h-code-side-emptyplaceholder,
    .d2h-emptyplaceholder {
      background-color: #f1f1f1;
      border-color: #e1e1e1
    }
    .d2h-code-line-prefix,
    .d2h-code-linenumber,
    .d2h-code-side-linenumber,
    .d2h-emptyplaceholder {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none
    }
    .d2h-code-linenumber,
    .d2h-code-side-linenumber {
      direction: rtl
    }
    .d2h-del {
      background-color: #fee8e9;
      border-color: #e9aeae
    }
    .d2h-ins {
      background-color: #dfd;
      border-color: #b4e2b4
    }
    .d2h-info {
      background-color: #f8fafd;
      border-color: #d5e4f2;
      color: rgba(0, 0, 0, .3)
    }
    .d2h-file-diff .d2h-del .d2h-change {
      background-color: #fdf2d0
    }
    .d2h-file-diff .d2h-ins .d2h-change {
      background-color: #ded
    }
    .d2h-file-list-wrapper {
      margin-bottom: 10px
    }
    .d2h-file-list-wrapper a {
      color: #3572b0;
      text-decoration: none
    }
    .d2h-file-list-wrapper a:visited {
      color: #3572b0
    }
    .d2h-file-list-header {
      text-align: left
    }
    .d2h-file-list-title {
      font-weight: 700
    }
    .d2h-file-list-line {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      text-align: left
    }
    .d2h-file-list {
      display: block;
      list-style: none;
      margin: 0;
      padding: 0
    }
    .d2h-file-list>li {
      border-bottom: 1px solid #ddd;
      margin: 0;
      padding: 5px 10px
    }
    .d2h-file-list>li:last-child {
      border-bottom: none
    }
    .d2h-file-switch {
      cursor: pointer;
      display: none;
      font-size: 10px
    }
    .d2h-icon {
      fill: currentColor;
      margin-right: 10px;
      vertical-align: middle
    }
    .d2h-deleted {
      color: #c33
    }
    .d2h-added {
      color: #399839
    }
    .d2h-changed {
      color: #d0b44c
    }
    .d2h-moved {
      color: #3572b0
    }
    .d2h-tag {
      background-color: #fff;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      font-size: 10px;
      margin-left: 5px;
      padding: 0 2px
    }
    .d2h-deleted-tag {
      border: 1px solid #c33
    }
    .d2h-added-tag {
      border: 1px solid #399839
    }
    .d2h-changed-tag {
      border: 1px solid #d0b44c
    }
    .d2h-moved-tag {
      border: 1px solid #3572b0
    }
  </style>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/diff2html/bundles/js/diff2html-ui.min.js"></script>
  
</head>
<body>`;

const footer = `
</body>
</html>`;

try {
  const diff = getInput('git-diff');
  const diff2html = generateDiff2Html(diff);
  const resul = `${header}
                 ${diff2html}
                 ${footer}`;
  console.log(resul);
  setOutput("diff2html", resul);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  setFailed(error.message);
}

function generateDiff2Html(gitDiff) {
  const diffJson = Diff2html.parse(gitDiff);
  return Diff2html.html(diffJson, {
    drawFileList: true,
    outputFormat: 'side-by-side'
  });
}