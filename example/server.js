'use strict';

var path = require('path');
var fs = require('fs');
var util = require('util');
var express = require('express');

var app = express();
app.use(express.bodyParser());

app.engine('html', require('ejs').renderFile);
app.set('views', __dirname);
app.set('view engine', 'html');

// Static files
app.use('/public', express.static(path.join(__dirname, './../')));
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Routing
app.use(app.router);

var uploadPath = path.resolve(__dirname + '/uploads/');

app.get('/uploads', function (req, res) {
  fs.readdir(uploadPath, function (err, files) {
    if (err) {
      res.json([]);
    }
    res.json(files);
  })
});

app.post('/upload', function(req, res) {
  var files = util.isArray(req.files.file) ? req.files.file : [req.files.file];

  console.log(files);

  files.forEach(function (file) {
    fs.rename(file.path, path.resolve(uploadPath, file.name), function(err) {
      if (err) throw err;
      fs.unlink(file.path, function() {
        if (err) throw err;
      });
    });
  });

  // Force response type to text/html otherwise IE will try to open the returned json response.
  res.contentType('text/html');

  // Really should return json when all files have been saved, but we are simplifying things a bit here.
  // We also delay it a bit, so we can see the nice loader
  setTimeout((function() {
    res.json({files: files.map(function (file) { return file.name; }) });
  }), 2000);
});

// Fallback route for angular
var index = function (req, res) {
  res.render('index');
}

app.get('*', index);
app.get('/', index);

module.exports = app;
