import { getInput, setOutput, setFailed, exportVariable } from '@actions/core';
import { context } from '@actions/github';
import { createRequire } from 'node:module';

const HBS_TEMPLATE = './diff-message.handlebars';
const require = createRequire(import.meta.url);
const Diff2html = require('diff2html');
const Handlebars = require('handlebars');
const fs = require('fs').promises;

  
const jsscript = '<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/diff2html/bundles/js/diff2html-ui.min.js"></script>';
const css = `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.1/styles/github.min.css" />
<link
  rel="stylesheet"
  type="text/css"
  href="https://cdn.jsdelivr.net/npm/diff2html/bundles/css/diff2html.min.css"
/>`;

try {
  const diff = getInput('git-diff');
  const diff2html = generateDiff2Html();
  // const contentTemplateFile = await fs.readFile(HBS_TEMPLATE, 'utf8');
  // const template = Handlebars.compile(contentTemplateFile);
  // const hbsresul = template({diff2html: diff2html});
  const hbsresul = `${jsscript}
  ${css}
  ${diff2html}`;
  console.log(hbsresul);
  setOutput("diff2html", hbsresul);
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