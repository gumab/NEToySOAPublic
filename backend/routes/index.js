'use strict';

var gameBiz = require('../biz/gameBiz'),
    //rollBiz = require('../biz/rollBiz'),
    memberBiz = require('../biz/memberBiz');

module.exports = function (app) {

  function sendDataCallback(res, next) {
    return function (err, data) {
      if (!err) {
        res.send(200, data);
        next();
      } else {
        next(require('../lib/error-handler')(err));
      }
    }
  }

/*
  // add game
  app.post('/game', function (req, res, next) {
    var userId = parseInt(req.body.userId);
    var callback = sendDataCallback(res, next);

    gameBiz.addGame(userId, callback);
  });
*/

  // get game score
  app.get('/game/:gameId/score', function (req, res, next) {
    var gameId = parseInt(req.params.gameId);
    var callback = sendDataCallback(res, next);

    gameBiz.getScore(gameId, callback);
  });


  // add rolling score
  /*
  app.post('/roll/:gameId/:score', function (req, res, next) {
    var gameId = parseInt(req.params.gameId);
    var score = parseInt(req.params.score);
    var callback = sendDataCallback(res, next);

    //var userId = parseInt(req.body.userId);
    //console.log(userId+"/"+gameId);

    gameBiz.addScore(gameId, score, callback);
  });
*/
  app.post('/signIn/:userId/:pwd', function (req, res, next){
    var obj = JSON.parse(JSON.stringify(req.params));
    var userId = obj.userId;
    var pwd = obj.pwd;
    var callback = sendDataCallback(res,next);

    memberBiz.signIn(userId, pwd, callback);
  });

  app.post('/signUp/:userId/:pwd/', function (req, res, next){
    var obj = JSON.parse(JSON.stringify(req.params));
    var userId = obj.userId;
    var pwd = obj.pwd;
    var callback = sendDataCallback(res,next);

    memberBiz.signUp(userId, pwd, callback);
  });

  app.post('/roll/:userId/:score', function (req, res, next) {
    var userId = req.params.userId;
    var score = parseInt(req.params.score);
    var callback = sendDataCallback(res, next);

    //var userId = parseInt(req.body.userId);
    //console.log(userId+"/"+gameId);

    gameBiz.roll(userId, score, callback);
  });


  app.post('/newGame', function (req, res, next) {

    var userId = req.body.userId;
    var callback = sendDataCallback(res, next);

    gameBiz.newGame(userId, callback);
  });

  app.post('/loadGame', function (req, res, next) {
    var userId = req.body.userId;
    var callback = sendDataCallback(res, next);

    gameBiz.loadGameByUserId(userId, callback);
  });

  app.post('/loadHistory',function (req,res,next){
    var userId = req.body.userId;
    var callback = sendDataCallback(res,next);
    gameBiz.getAllGames(userId,callback);
  });

  app.post('/deleteGame',function (req,res,next){
    var gameId = req.body.gameId;
    var callback = sendDataCallback(res,next);
    gameBiz.removeGame(gameId,callback);
  })
};
