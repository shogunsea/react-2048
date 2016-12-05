'use strict';

const gulp = require('gulp');
const argv = require('yargs').argv;
const exec = require('child_process').exec;

let command = './node_modules/webpack/bin/webpack.js';

if (argv.p) {
  command = 'NODE_ENV=production ' + command; // production mode;
}

gulp.task('build', 'build and bundle assets by webpack', function() {
  exec(command, function(err, stdout, stderr) {
    console.log(stdout);
  });
});
