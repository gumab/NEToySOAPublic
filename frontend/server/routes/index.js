'use strict';

var config = require('../config/config'),
    router = require('express').Router(),
    game = require('../rpc/game'),
    roll = require('../rpc/roll'),
    history = require('../rpc/history'),
    member = require('../rpc/member');

module.exports = function (app) {

  function sendDataCallback(res, next) {
    return function (err, data) {
      if (!err) {
        res.send(200, data);
      } else {
        next(err);
      }
    }
  }

/*
  // add game
  router.post('/game', function (req, res, next) {
    var userId = parseInt(req.body.userId);
    var callback = sendDataCallback(res, next);

    if (userId) {
      game.add(userId, callback);
    } else {
      callback(new InvalidArgumentError('Invalid User ID'));
    }
  });
*/

  // get game score
  router.get('/game/:gameId/score', function (req, res, next) {
    var gameId = parseInt(req.params.gameId);
    var callback = sendDataCallback(res, next);

    if (gameId) {
      game.getScore(gameId, callback);
    } else {
      callback(new InvalidArgumentError('Invalid Game ID'));
    }
  });


  // add roll score
  router.post('/roll/:gameId/:score', function (req, res, next) {

    var gameId = parseInt(req.params.gameId);
    var score = parseInt(req.params.score);
    var callback = sendDataCallback(res, next);

    if (gameId && score) {
      roll.add(gameId, score, callback);
    } else {
      callback(new InvalidArgumentError('Invalid Parameters'));
    }
  });
/*

  // render page
  router.get('/newGame/:userId', function (req, res, next) {
    // TODO: userId is always 1
    var userId = parseInt(req.params.userId);

    game.add(userId, function (err, data) {
      if (!err) {
        res.render('app/index.html', {
          data: { gameId: data }
        });
      } else {
        next(err);
      }
    });
  });
*/
  // render page
  router.get('/', function (req, res, next) {
    // TODO: userId is always 1
        res.render('app/signIn.html', {
          //data: { gameId: 4 }
        });
  });

  router.post('/signIn',function(req,res,next){

    var userId = req.body.userId;
    var pwd = req.body.pwd;
    var callback = sendDataCallback(res, next);
    console.log('signIn/'+userId+'/'+pwd);
    if(userId && pwd){
      member.signIn(userId,pwd,callback);
    } else{
      callback(new InvalidArgumentError('Invalid Parameters'));
    }
  });

  router.get('/signUp',function(req,res,next){
    console.log('signUpView/');
    res.render('app/signUp.html');
  });

  router.post('/signUp',function(req,res,next){
    var userId = req.body.userId;
    var pwd = req.body.pwd;
    var cPwd = req.body.cPwd;
    console.log('signUp/'+userId+'/'+pwd);
    var callback = sendDataCallback(res,next);
    if(userId && pwd && cPwd){
      if(userId.length<3 || userId.length>10||pwd.length<3 || pwd.length>10||pwd!=cPwd){
        callback(new InvalidArgumentError('Invalid Parameters'));
      }
      member.signUp(userId,pwd,callback);
    }
    else{
      callback(new InvalidArgumentError('Invalid Parameters'));
    }
  });

  router.get('/gameView/:userId',function(req,res,next){
    var userId = req.params.userId;
    console.log('gameView/'+userId);
    res.render('app/gameView.html',{
      data:{userId:userId}
    });
  });

  router.post('/gameView/roll', function (req, res, next) {

    var userId = req.body.userId;;
    var score = parseInt(req.body.roll);
    var callback = sendDataCallback(res, next);
    console.log('gameView/roll/'+userId+'/score:'+score);
    if (userId && score || score == 0) {
      roll.add(userId, score, callback);
    } else {
      callback(new InvalidArgumentError('Invalid Parameters'));
    }
  });

  router.post('/gameView/newGame', function (req, res, next) {

    var userId = req.body.userId;;
    var callback = sendDataCallback(res, next);
    console.log('gameView/newGame/'+userId);
    if (userId) {
      game.newGame(userId, callback);
    } else {
      callback(new InvalidArgumentError('Invalid Parameters'));
    }
  });

  router.post('/gameView/loadGame', function (req, res, next) {

    var userId = req.body.userId;;
    var callback = sendDataCallback(res, next);
    console.log('gameView/loadGame/'+userId);
    if (userId) {
      game.loadGame(userId, callback);
    } else {
      callback(new InvalidArgumentError('Invalid Parameters'));
    }
  });

  router.get('/historyView/:userId',function(req,res,next){
    var userId = req.params.userId;
    console.log('historyView/'+userId);
    res.render('app/historyView.html',{
      data:{userId:userId}
    });
  });

  router.post('/historyView/loadHistory', function (req, res, next) {

    var userId = req.body.userId;;
    var callback = sendDataCallback(res, next);
    console.log('historyView/loadHistory/'+userId);
    if (userId) {
      history.loadHistory(userId, callback);
    } else {
      callback(new InvalidArgumentError('Invalid Parameters'));
    }
  });

  router.post('/historyView/deleteGame', function (req, res, next) {
    
    var gameId = req.body.gameId;;
    var callback = sendDataCallback(res, next);
    console.log('historyView/deleteGame/'+gameId);
    if (gameId) {
      history.deleteGame(gameId, callback);
    } else {
      callback(new InvalidArgumentError('Invalid Parameters'));
    }
  });



  // use router
  app.use(router);
};
