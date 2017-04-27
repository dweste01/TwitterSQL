'use strict';
const express = require('express');
const router = express.Router();
// const tweetBank = require('../tweetBank');
const client = require('../db')

module.exports = router;

// a reusable function
function respondWithAllTweets (req, res, next){
  client.query('SELECT * FROM tweets INNER JOIN users ON users.id=tweets.user_id', function (err, result) {
    if (err) return next(err); // pass errors to Express
    var tweets = result.rows;
    res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
  });
}

// here we basically treet the root view and tweets view as identical
router.get('/', respondWithAllTweets);
router.get('/tweets', respondWithAllTweets);

// single-user page
router.get('/users/:username', function(req, res, next){
  var user = req.params.username;

  client.query('SELECT * FROM tweets INNER JOIN users ON users.id=tweets.user_id WHERE users.name=$1',[user], function (err, result) {
    if (err) return next(err); // pass errors to Express
    var tweets = result.rows;
    res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
  });
});

// single-tweet page
router.get('/tweets/:id', function(req, res, next){
  var id = req.params.id;

  client.query('SELECT * FROM tweets INNER JOIN users ON users.id=tweets.user_id WHERE tweets.id=$1',[id], function (err, result) {
    if (err) return next(err); // pass errors to Express
    var tweets = result.rows;
    res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
  });
});

//  create a new tweet
router.post('/tweets', function(req, res, next){
  var name = req.body.name;
  var tweet = req.body.content;

  client.query('INSERT INTO tweets (user_id, content) VALUES ((SELECT users.id FROM users WHERE users.name=$1),$2)',
                [name, tweet], function (err, result) {
    if (err) return next(err); // pass errors to Express
    var tweets = result.rows;
    console.log(tweets);
    res.redirect('/');
  });
});








// // replaced this hard-coded route with general static routing in app.js
// router.get('/stylesheets/style.css', function(req, res, next){
//   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
// });
