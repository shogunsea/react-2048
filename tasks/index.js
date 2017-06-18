'use strict';

const gulp = require('gulp-help')(require('gulp'));
require('./deploy');
require('./setup');
require('./start');
require('./stop');
require('./build');
require('./alias');

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['help']);
