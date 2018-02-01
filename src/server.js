const express = require('express');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const compression = require('compression');
const Handlebars = require('handlebars');

const app = express();
const indexPage = path.join(__dirname, './index.html.hbs');
// const layoutExample = path.join(__dirname, '../layout_example.html');
const publicPath = path.resolve(__dirname, '../dist');

const {boardDataFetcher} = require('./helper/utils.js');

const oneWeekInMsFormat = '7d';
const httpCachingOptions = {
  maxAge: oneWeekInMsFormat,
};

app.use(compression());
app.use(express.static(publicPath, httpCachingOptions));

app.get('/2048/_status', function(req, res) {
  // return current sha
  let SHAFilePath = path.join(path.resolve('.'), './SHA.txt');
  fs.readFile(SHAFilePath, 'utf8', (err, data) => {
    if (err) {
      console.log(chalk.red(err));
      return res.json({err: 'failed to retrive current SHA.'});
    }
    let currentSHA = data.trim();
    res.json({currentSHA});
  });
});

app.get('/2048', function(req, res) {
  const {board} = req.query;

  fs.readFile(indexPage, 'utf8', (err, rawTemplate) => {
    if (err) {
      console.log(chalk.red(err));
      return res.json({err: 'failed to fetch template.'});
    }

    const template = Handlebars.compile(rawTemplate);
    const loadBoardViaQuery = boardDataFetcher(board);
    const pageData = {loadBoardViaQuery};
    const html = template(pageData);

    return res.end(html);
  });
});

// app.get('/example', function(req, res) {
//   res.sendFile(layoutExample);
// });

// app.get('*', function(req, res) {
//   res.redirect('/2048');
// });

const PORT = process.env.NODE_PORT || 8000;

app.listen(PORT, function() {
  console.log('yoooo!');
  console.log('2048 app running on http://localhost:' + PORT);
});
