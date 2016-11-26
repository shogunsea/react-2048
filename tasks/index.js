'use strict';

const gulp = require('gulp-help')(require('gulp'))
const deploy = require('./deploy');
const setup = require('./setup');
const build = require('./build');

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['help']);
