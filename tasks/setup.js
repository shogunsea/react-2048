'use strict';

const gulp = require('gulp');
const exec = require('child_process').exec;

let command = 'yarn install';

gulp.task('setup', 'install dependencies', function() {
  exec(command, function(err, stdout, stderr) {
    console.log(stdout);
  });
});
