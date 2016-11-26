'use strict';

const gulp = require('gulp');
const fs = require('fs');
const path = require('path');

const exec = require('child_process').exec;
const exists = fs.existsSync;
const rootPath = path.resolve('.');
const deployKeyPath = path.join(rootPath, './.deploykey.json');

if (!exists(deployKeyPath)) {
    return;
}

const deployKey = require('../.deploykey.json');
let command = `rsync -avzP --exclude='.*' --exclude='node_modules' --exclude='*.txt' --exclude='tmp' . ${deployKey.path}:~/2048`

gulp.task('deploy', 'deploy to production host',  function() {
  exec(command, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(command);
  });
});
