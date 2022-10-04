import { getInput, setFailed, setOutput } from '@actions/core';
import { context } from '@actions/github';
import { createRequire } from 'node:module';
import { htmlconcat } from './htmlconcat.js';
 
const require = createRequire(import.meta.url);
const Diff2html = require('diff2html');
const fs = require('fs');
const yml = require('js-yaml');
const { exec } = require("child_process");

try {
  let thereAreChanges = false;
  let configFile = getInput('config-file');
  if(configFile == '') configFile = 'config.deploy.yml';
  let outputFileName = getInput('output-file-name');
  if(outputFileName == '') outputFileName = 'git-diff.html';
  const fileContents = fs.readFileSync(configFile, 'utf8');
  const data = yml.load(fileContents);
  const gitDiffCommand = createGitDiffCommand(data.development.ignore_files);
  const ls = await executeShCommand('ls');
  const gitDiff = await executeShCommand(gitDiffCommand);
  if(gitDiff != '') thereAreChanges = true;
  const diff2html = generateDiff2Html(gitDiff);
  const resul = `${htmlconcat.header}
                 ${diff2html}
                 ${htmlconcat.footer}`;
  fs.writeFileSync(outputFileName, resul,  function (err) {
    if (err) return console.log(err);
    console.log('writed');
  });
  setOutput('there-are-changes', ls);
  const payload = JSON.stringify(context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
  } catch (error) {
    setFailed(error.message);
}

function executeShCommand(command) {
  return new Promise(function (resolve, reject) {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      resolve(stdout);
    });
  }) 
}

function generateDiff2Html(gitDiff) {
  const diffJson = Diff2html.parse(gitDiff);
  return Diff2html.html(diffJson, {
    drawFileList: true,
    outputFormat: 'side-by-side'
  });
}

function createGitDiffCommand(ignore_files) {
  let gitDiffCommand = `git diff -- .`;
  ignore_files.forEach(element => {
    gitDiffCommand += ` ':(exclude)${element}'`;
  });
  return gitDiffCommand;
}