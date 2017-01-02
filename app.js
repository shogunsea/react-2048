const express = require('express');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');

const app = express();
const indexPage = path.join(__dirname, './index.html')
const layoutExample = path.join(__dirname, './layout_example.html')
const publicPath = path.resolve(__dirname, 'dist');

app.use(express.static(publicPath));

app.get('/2048/_status', function(req, res) {
  // return current sha
  let SHAFilePath = path.join(path.resolve('.'), './SHA.txt');
  fs.readFile(SHAFilePath, 'utf8', (err, data) => {
    if (err) {
      console.log(chalk.red(err));
      return res.json({err: 'failed to retrive current SHA.'})
    }
    let currentSHA = data.trim();
    res.json({currentSHA});
  });
});

app.get('/2048', function(req, res) {
  res.sendFile(indexPage);
});

app.get('/test', function(req, res) {
  res.sendFile(layoutExample);
});

app.get('*', function(req, res) {
  res.redirect('/2048');
});

const port = 3080;

app.listen(port, function(){
  console.log('yoooo!');
  console.log('2048 app running on http://localhost:' + port);
});
