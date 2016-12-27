'use strict';

const gulp = require('gulp');
const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');

let setupCommand = 'yarn install';
let preCommitHookContent = `
#!/bin/sh
echo "checking linter rules..."
./node_modules/eslint/bin/eslint.js --color ./src/** ./tasks/**
`;

const ensurePreCommitHookExist = () => {
  const preCommitHookPath = path.resolve('.git/hooks/pre-commit');
  if (!fs.existsSync(preCommitHookPath)) {
    console.log('pre-commit hook doesnt exist yet, creating one...');
    try {
      fs.open(preCommitHookPath, 'a', function(e, id ) {
        fs.write(id, preCommitHookContent, {encoding: 'utf8'}, function() {
          fs.close(id, function() {
            console.log('pre-commit hook created.');
          });
        });
      });
      // pre-commit hook needs executable enabled.
      fs.chmodSync(preCommitHookPath, '777');
    } catch (err) {
      console.log('Failed to create pre-commit hook, error:');
      console.log(err);
    }
  } else {
    return;
  }
};

gulp.task('setup', 'Install dependencies, add pre-commit hook.', function() {
  ensurePreCommitHookExist();

  exec(setupCommand, function(err, stdout, stderr) {
    console.log(stdout);
  });
});
