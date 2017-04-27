'use strict';
const express = require('express');
const app = express();
const volleyball = require('volleyball');
const nunjucks = require('nunjucks');
const routes = require('./routes');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const bodyParser = require('body-parser');
const client = require('./db');

// templating boilerplate setup
app.engine('html', nunjucks.render); // how to render html templates
app.set('view engine', 'html'); // what file extension do our templates have
nunjucks.configure('views', { noCache: true }); // where to find the views, caching off

// logging middleware
app.use(volleyball);

// body parsing middleware
app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json()); // would be for AJAX requests

// start the server
app.listen(1337, function(){
  console.log('listening on port 1337');
  // console.log(client);
});

app.use(express.static(path.join(__dirname, '/public')));

// modular routing that uses io inside it
app.use('/', routes);

// // manually-written static file middleware
// app.use(function(req, res, next){
//   var mimeType = mime.lookup(req.path);
//   fs.readFile('./public' + req.path, function(err, fileBuffer){
//     if (err) return next();
//     res.header('Content-Type', mimeType);
//     res.send(fileBuffer);
//   });
// });


client.query('SELECT * FROM tweets', [], function(err, res) {
  if(err) {
    return console.error('error running query', err);
  }
  // console.log('number:', res.rows);
});





