import { getInput, setOutput, setFailed, exportVariable } from '@actions/core';
import { context } from '@actions/github';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const Diff2html = require('diff2html');

try {
  const diff = getInput('git-diff');
  exportVariable("DIFF2HTML",generateDiff2Html(diff));
  setOutput("diff2html", generateDiff2Html(diff));
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