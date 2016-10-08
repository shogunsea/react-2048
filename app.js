var express = require('express');
var app = express();
var path = require('path');
var indexFile = path.join(__dirname, './index.html')
var publicPath = path.resolve(__dirname, 'dist');

app.use(express.static(publicPath));

app.get('/2048', function(req, res) {
  res.sendFile(indexFile);
});

app.get('*', function(req, res) {
  res.redirect('/2048');
});

var port = 3080;

app.listen(port, function(){
  console.log('yoooo!');
  console.log('2048 app running on ' + port);
});