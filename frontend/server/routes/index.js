'use strict';

var config = require('../config/config'),
    router = require('express').Router();

function sendData(res) {
  return function (err, data) {
    if (!err) {
      res.send(200, data);
    } else {
      res.send(500)
    }
  }
}

var game = require('../rpc/game'),
    roll = require('../rpc/roll');


// add game
router.post('/game', function (req, res) {
  var userId = parseInt(req.body.userId);

  if (userId) {
    game.add(userId, sendData(res));
  } else {
    sendData(res)(new Error());
  }
});


// get game score
router.get('/game/:gameId/score', function (req, res) {
  var gameId = parseInt(req.params.gameId);

  if (gameId) {
    game.getScore(gameId, sendData(res));
  } else {
    sendData(res)(new Error());
  }
});


// add roll score
router.post('/roll/:gameId/:score', function (req, res) {
  var gameId = parseInt(req.params.gameId);
  var score = parseInt(req.params.score);

  if (gameId && score) {
    roll.add(gameId, score, sendData(res));
  } else {
    sendData(res)(new Error());
  }
});


// render page
router.get('/', function (req, res) {
  // TODO: userId is always 1
  var userId = 1;

  game.add(userId, function (err, data) {
    if (!err) {
      var gameId = data;

      res.render('app/index.html', {
        data: { gameId: gameId }
      });
    } else {
      res.send(500);
    }
  });
});


// exports
module.exports = function (app) {
  app.use(router);
};
