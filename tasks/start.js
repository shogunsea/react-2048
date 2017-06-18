'use strict';

const nodemon = require('gulp-nodemon');
const gulp = require('gulp');
const {green} = require('chalk');

const APP_NAME = '2048';

gulp.task('start', 'Start hot reload server via nodemon.', function() {
  console.log(green(`Starting ${APP_NAME} ...` ));

  nodemon({
    script: './src/server.js',
    watch: 'src',
    ext: 'js html scss json jsx',
    env: {'NODE_ENV': 'development'},
  }).on('start', function() {
    console.log(green(`Starting...` ));
  });
});
