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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.1/styles/github.min.css" />
    <link
      rel="stylesheet"
      type="text/css"
      href="https://cdn.jsdelivr.net/npm/diff2html/bundles/css/diff2html.min.css"
    />
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