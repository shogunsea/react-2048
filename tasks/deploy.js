'use strict';

const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const exists = fs.existsSync;
const rootPath = path.resolve('.');
const deployKeyPath = path.join(rootPath, './.deploykey.json');

if (!exists(deployKeyPath)) {
    return;
}

const currentSHA = execSync('git rev-parse HEAD');
// const SHAFilePath = path.join(rootPath,, './SHA.txt');
// const readCurrentLocalSHA = new Promise();
// const updateSHAPromise = new Promise();
// const deployWithCurrentSHA = new Promise();

const deployKey = require('../.deploykey.json');
let command = `rsync -avzP --exclude='.*' --exclude='node_modules' --exclude='*.txt' --exclude='tmp' . ${deployKey.path}:~/2048`

gulp.task('deploy', 'deploy to production host',  function() {
  console.log(chalk.green('deploy current SHA: ') + chalk.red(currentSHA) + chalk.green(' to production host...'));
  // readCurrentLocalSHA.then(updateSHAPromise).then(deployWithCurrentSHA).catch().doSomethingElse();
  exec(command, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(command);
  });
});
