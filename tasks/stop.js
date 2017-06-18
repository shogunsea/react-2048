'use strict';

// Retrieve PGID by searching process starting signature using ps command.
// Then shut down the app by termniating the process group.

const gulp = require('gulp');
const {execSync} = require('child_process');
const chalk = require('chalk');
// replace app name
const APP_NAME = '2048';
// make sure you have same starting scripts for all apps.
const getPGIDCommand = `ps -Ao pid,pgid,command | grep \
  '[s]tarting ${APP_NAME}' | awk '{print $2}'`;

const stop = () => {
  const foundPgid = execSync(getPGIDCommand, {encoding: 'utf8'}).trim();
  if (foundPgid !== '') {
    const killGroupProcessCommand = `kill -TERM -- -${foundPgid}`;
    console.log(
      chalk.red(`Killing process group: ${foundPgid}...`)
      );

    execSync(killGroupProcessCommand);
    console.log(chalk.green('Done.'));
  } else {
    console.log(chalk.yellow('No running process found.'));
  }
};

gulp.task('stop', 'Stop the running app process.', function() {
  stop();
});
