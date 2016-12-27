'use strict';

const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const exec = require('child_process').exec;

const rootPath = path.resolve('.');
const exists = fs.existsSync;

const SHAFilePath = path.join(rootPath, './SHA.txt');

const readPreviousSavedSHA = function() {
  return new Promise(function(resolve, reject) {
    fs.readFile(SHAFilePath, 'utf8', function(err, previousSHA) {
      if (err)
        reject(err);
      else
        resolve(previousSHA.trim());
    });
  });
};

const fetchCurrentSHA = (previousSHA) => {
  return new Promise((resolve, reject) => {
    const fetchCommand = 'git rev-parse HEAD';
    exec(fetchCommand, {encoding: 'utf8'}, (err, currentSHA) => {
      if (err)
        reject(err);
      else
        resolve({currentSHA: currentSHA.trim(), previousSHA});
    });
  });
};

const updateSavedSHA = ({currentSHA, previousSHA}) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(SHAFilePath, currentSHA, 'utf8', function(err) {
      if (err)
        reject(err);
      else
        resolve({currentSHA, previousSHA});
    });
  });
};

const deployToProduction = ({currentSHA, previousSHA, deployCommand}) => {
  return new Promise((resolve, reject) => {
    exec(deployCommand, function(err, stdout, stderr) {
      if (err)
        reject(err);
      else
        resolve({currentSHA, previousSHA});
    });
  });
};

gulp.task('deploy', 'Deploy to production host', () => {
  const deployKeyPath = path.join(rootPath, './.deploykey.json');

  if (!exists(deployKeyPath)) {
    return;
  }

  const deployKey = require('../.deploykey.json');
  const deployCommand = `rsync -avzP --exclude='.*' \
  --exclude='node_modules' --exclude='*.txt' \
  --exclude='tmp' . ${deployKey.path}:~/2048`;

  let diffUrl = 'https://github.com/shogunsea/react-2048/compare/';

  readPreviousSavedSHA()
  .then(fetchCurrentSHA)
  .then(({previousSHA, currentSHA}) => {
    diffUrl += previousSHA + '...' + currentSHA;
    console.log(
      chalk.blue('Previous SHA: ') +
      chalk.yellow(previousSHA)
    );
    console.log(
      chalk.blue('Deploying current SHA: ') +
      chalk.yellow(currentSHA) +
      chalk.blue(' to production host...')
    );
    return {currentSHA, previousSHA, deployCommand};
  }).then(deployToProduction)
  .then(({previousSHA, currentSHA}) => {
    if (previousSHA === currentSHA) {
      console.log(
        chalk.yellow('Deployment completed successfully, no chnages observed.')
      );
    } else {
      console.log(chalk.green('Deployment completed successfully, changes: '));
      console.log(chalk.underline(diffUrl));
    }
    return {previousSHA, currentSHA};
  }).then(updateSavedSHA)
  .catch((err) => {
    console.log(
      chalk.red('Deployment failed, local SHA file didnt get updated. Error: ')
    );
    console.log(err);
  });
});
