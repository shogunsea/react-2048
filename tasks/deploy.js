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

const currentSHA = execSync('git rev-parse HEAD', {encoding: 'utf8'}).trim();
const SHAFilePath = path.join(rootPath, './SHA.txt');

// why define function that returns a promise: the executor is
// executed immediately by Promise implementation.
const readPreviousSavedSHA = function() {
  return new Promise(function(resolve, reject) {
    fs.readFile(SHAFilePath, 'utf8', function(err, data){
      if (err)
        reject(err);
      else
        resolve(data);
    })
  })
};

const updateSHAPromise = () => {
  return new Promise((resolve, reject) => {
    fs.writeFile(SHAFilePath, currentSHA, 'utf8', function(err, data){
      if (err)
        reject(err);
      else
        resolve(data);
    });
  });
};

const deployToProduction = (argument) => {
  return new Promise((resolve, reject) => {
    resolve(1);
  });
}

const deployKey = require('../.deploykey.json');
let command = `rsync -avzP --exclude='.*' --exclude='node_modules' --exclude='*.txt' --exclude='tmp' . ${deployKey.path}:~/2048`

gulp.task('deploy', 'deploy to production host',  function() {
  let diffUrl = "https://github.com/shogunsea/react-2048/compare/";
  readPreviousSavedSHA().then((previousSHA) => {
    console.log(chalk.blue('Previous version is ') + chalk.yellow(previousSHA));

    diffUrl += previousSHA + "...";
  }).then(updateSHAPromise).then(() => {
    console.log(chalk.blue('deploying current SHA: ') + chalk.yellow(currentSHA) + chalk.blue(' to production host...'));
    diffUrl += currentSHA;
  }).then(deployToProduction).then(() => {
    console.log(chalk.green('Deployment complete successfully, changes: '));
    console.log(chalk.underline(diffUrl));
  })

  exec(command, function(err, stdout, stderr) {
    console.log(stdout);
  });
});
