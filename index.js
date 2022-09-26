import { getInput, setOutput, setFailed, exportVariable } from '@actions/core';
import { context } from '@actions/github';
import { createRequire } from 'node:module';

const HBS_TEMPLATE = './diff-message.handlebars';
const require = createRequire(import.meta.url);
const Diff2html = require('diff2html');
const Handlebars = require('handlebars');
const fs = require('fs').promises;

try {
  const diff = getInput('git-diff');
  const diff2html = generateDiff2Html(diff);
  const contentTemplateFile = await fs.readFile(HBS_TEMPLATE, 'utf8');
  const template = Handlebars.compile(contentTemplateFile);
  const hbsresul = template({diff2html: diff2html});
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