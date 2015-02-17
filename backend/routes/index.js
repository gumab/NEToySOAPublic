'use strict';

module.exports = function (server) {

  function sendDataCallback(res, next) {
    return function (err, data) {
      if (!err) {
        res.send(200, data);
        next();
      } else {
        next(err);
      }
    }
  }


  var gameBiz = require('../biz/gameBiz'),
      rollBiz = require('../biz/rollBiz');


  // add game
  server.post('/game', function (req, res, next) {
    var userId = parseInt(req.body.userId);
    var callback = sendDataCallback(res, next);

    gameBiz.addGame(userId, callback);
  });


  // get game score
  server.get('/game/:gameId/score', function (req, res, next) {
    var gameId = parseInt(req.params.gameId);
    var callback = sendDataCallback(res, next);

    gameBiz.getScore(gameId, callback);
  });


  // add rolling score
  server.post('/roll/:gameId/:score', function (req, res, next) {
    var gameId = parseInt(req.params.gameId);
    var score = parseInt(req.params.score);
    var callback = sendDataCallback(res, next);

    rollBiz.addScore(gameId, score, callback);
  });
};
