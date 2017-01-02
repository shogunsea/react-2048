var express = require('express');
var app = express();
var path = require('path');
var indexPage = path.join(__dirname, './index.html')
var layoutExample = path.join(__dirname, './layout_example.html')
var publicPath = path.resolve(__dirname, 'dist');

app.use(express.static(publicPath));

app.get('/2048/_status', function(req, res) {
  // fetch current app sha
  res.sendFile(indexPage);
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

var port = 3080;

app.listen(port, function(){
  console.log('yoooo!');
  console.log('2048 app running on http://localhost:' + port);
});
