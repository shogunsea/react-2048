'use strict';

const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const {assignIn} = require('lodash');
const exec = require('child_process').exec;
// Replace this constant for different app.
const APP_NAME = 'react-2048';

const readPreviousSavedSHA = ({config, logging}) => {
  const {SHAFilePath} = config;

  return new Promise((resolve, reject) => {
    fs.readFile(SHAFilePath, 'utf8', (err, data) => {
      if (err) {
        console.log(
          chalk.red(`Failed to read previously saved SHA,
            make sure SHA.txt exists.`)
          );
        console.log(chalk.red(JSON.stringify(err)));
        reject(err);
      } else {
        const previousSHA = data.trim();
        assignIn(logging, {previousSHA});
        resolve({config, logging});
      }
    });
  });
};

const fetchCurrentSHA = ({config, logging}) => {
  const {gitSHAFetchCommand} = config;

  return new Promise((resolve, reject) => {
    exec(gitSHAFetchCommand, {encoding: 'utf8'}, (err, data) => {
      if (err) {
        console.log(
          chalk.red(`Failed to fetch current SHA,
            make sure current directory has git history.`)
          );
        reject(err);
      } else {
        const currentSHA = data.trim();
        assignIn(logging, {currentSHA});
        resolve({config, logging});
      }
    });
  });
};

const updateSavedSHA = ({config, logging}) => {
  const {SHAFilePath} = config;
  let {currentSHA} = logging;

  return new Promise((resolve, reject) => {
    fs.writeFile(SHAFilePath, currentSHA, 'utf8', function(err) {
      if (err) {
        console.log(chalk.red('Updating SHA failed.'));
        reject(err);
      } else {
        console.log(chalk.green('SHA updated successfully.'));
        resolve({config, logging});
      }
    });
  });
};

const revertUpdatedSHA = ({config, logging}) => {
  const {SHAFilePath} = config;
  const {previousSHA} = logging;

  return new Promise((resolve, reject) => {
    fs.writeFile(SHAFilePath, previousSHA, 'utf8', function(err) {
      if (err) {
        console.log(chalk.red('Reverting SHA failed.'));
        reject(err);
      } else {
        console.log(chalk.green('SHA reverted successfully.'));
        resolve({config, logging});
      }
    });
  });
};

const deployToProduction = ({config, logging}) => {
  const {deployCommand} = config;

  return new Promise((resolve, reject) => {
    exec(deployCommand, function(err, stdout, stderr) {
      if (err) {
        console.log(
          chalk.red('Deployment failed.')
          );
        reject(err);
      } else {
        console.log(chalk.green('Deployment succedded.'));
        resolve({config, logging});
      }
    });
  });
};

// Log previous and current sha and build diff URL
const preDeploymentLogging = ({config, logging}) => {
  let {previousSHA, currentSHA, diffUrl} = logging;
  diffUrl += previousSHA + '...' + currentSHA;
  assignIn(logging, {diffUrl});

  console.log(
    chalk.blue('Previous SHA: ') +
    chalk.yellow(previousSHA)
  );
  console.log(
    chalk.blue('Deploying current SHA: ') +
    chalk.yellow(currentSHA) +
    chalk.blue(' to production host...')
  );

  return {config, logging};
};

const postDeploymentlogging = ({config, logging}) => {
  const {previousSHA, currentSHA, diffUrl} = logging;
  if (previousSHA === currentSHA) {
    console.log(
      chalk.yellow('Deployment completed successfully, no chnages observed.')
    );
  } else {
    console.log(chalk.green('Deployment completed successfully, changes: '));
    console.log(chalk.underline(diffUrl));
  }
  return {config, logging};
};

const errorHandler = (err) => {
  console.log(
    chalk.red('Deployment failed with error: ')
  );
  console.log(chalk.red(err));
  console.log(
    chalk.green('Reverting saved SHA...')
  );
  // dependency of outter global data
  // eslint-disable-next-line
  return revertUpdatedSHA({config, logging});
};

gulp.task('deploy', 'Deploy to production host', () => {
  const rootPath = path.resolve('.');
  const exists = fs.existsSync;
  const SHAFilePath = path.join(rootPath, './SHA.txt');
  const gitSHAFetchCommand = 'git rev-parse HEAD';
  const deployKeyPath = path.join(rootPath, './.deploykey.json');

  if (!exists(deployKeyPath)) {
    return;
  }

  const deployKey = require('../.deploykey.json');
  const deployCommand = `rsync -avzP --exclude='.*' \
  --exclude='node_modules' \
  --exclude='tmp' . ${deployKey.path}:~/${APP_NAME}`;
  let diffUrl = `https://github.com/shogunsea/${APP_NAME}/compare/`;

  const config = {deployKey, deployCommand, SHAFilePath, gitSHAFetchCommand};
  const logging = {diffUrl};

  readPreviousSavedSHA({config, logging})
  .then(fetchCurrentSHA)
  .then(preDeploymentLogging)
  .then(updateSavedSHA)
  .then(deployToProduction)
  .then(postDeploymentlogging)
  .catch(errorHandler);
});
