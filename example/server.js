'use strict';

var path = require('path');
var fs = require('fs');
var util = require('util');
var express = require('express');
var formidable = require('formidable');

var app = express();
var router = express.Router();

app.engine('html', require('ejs').renderFile);
app.set('views', __dirname);
app.set('view engine', 'html');

// Static files
router.use('/public', express.static(path.join(__dirname, './../')));
router.use('/uploads', express.static(path.join(__dirname, './uploads')));

var uploadPath = path.resolve(__dirname + '/uploads/');
router.get('/uploads', function (req, res) {
  fs.readdir(uploadPath, function (err, files) {
    if (err) {
      res.json([]);
    }
    res.json(files);
  })
});

router.post('/upload', function (req, res) {
  var form = new formidable.IncomingForm();
  form.keepExtensions = true;

  // Enable multi upload
  form.multiples = true;

  form.parse(req, function (err, fields, files) {
    Object.keys(files).forEach(function (key) {
      var file = files[key];

      console.log(file);

      fs.rename(file.path, path.resolve(uploadPath, file.name), function(err) {
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

router.get('*', index);
router.get('/', index);

app.use('/', router);

module.exports = app;
