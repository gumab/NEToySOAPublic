'use strict';

var config = require('../config'),
    sql = require('mssql'),
    redis = require('redis');

module.exports = {

  // insert game
  insert: function (userId, insDate, callback) {
    // MS-SQL sample code
    // var connection = new sql.Connection(config.database, function (err) {
    //   var request = new sql.Request(connection);

    //   request.input('USER_ID', sql.BigInt, userId);
    //   request.input('TOTAL_SCORE', sql.Int, -1);

    //   request.execute('Your Stored Procedure Name', function (err, recordsets, returnValue) {
    //     connection.close();

    //     callback(err, recordsets[0][0].GAME_ID);
    //   });
    // });

    // Redis sample code
    var client = redis.createClient(config.redis.port, config.redis.host);
    var obj = {userId:userId,insDate:insDate,isFinish:false,isDelete:false,updDate:insDate};

    client.rpush('gameList', JSON.stringify(obj), function (err, res) {
      
      client.quit();
      // check error
      if (err) {
        err = new ServiceUnavailableError(err);
      }
      // callback
      callback(err, res);
    });
  },

  insertPersonalGameList: function (userId, gameId, callback){
    var client = redis.createClient(config.redis.port, config.redis.host);
    client.rpush('GameIds:'+userId,gameId,function (err, res){
      client.quit();
      if(err){
        err = new ServiceUnavailableError(err);
      }
      callback(err,res);
    })
  },
  selectGameByGameId: function(gameId, callback){
    var client = redis.createClient(config.redis.port, config.redis.host);
    client.lrange('gameList',gameId-1,gameId-1,function (err, res){
      client.quit();
      if(err){
        err = new ServiceUnavailableError(err);
      }
      callback(err,JSON.parse(res));
    })
  },

  selectAllGameIdByUserId: function (userId, callback) {
    var client = redis.createClient(config.redis.port, config.redis.host);
    client.lrange('GameIds:' + userId, 0, -1, function (err, res) {
      client.quit();
      // check error
      if (err) {
        err = new ServiceUnavailableError(err);
      }

      // callback
      callback(err, (res || []).map(function (data, index) {
        return parseInt(data);
      }));
    });
  },

  updateGame: function (gameId, game, callback) {
    var client = redis.createClient(config.redis.port, config.redis.host);
    client.lset( 'gameList',gameId-1,JSON.stringify(game), function (err, res) {
      client.quit();
      // check error
      if (err) {
        err = new ServiceUnavailableError(err);
      }
      // callback
      callback(err, res);
    });
  },
  insertFinishGameInfo:function(gameId,data,callback){
    var client = redis.createClient(config.redis.port, config.redis.host);
    client.setnx('FinishedGame:'+gameId,JSON.stringify(data),function (err, res){
      client.quit();
      if(err){
        err = new ServiceUnavailableError(err);
      }
      callback(err,res);
    });
  },
  selectFinishGameInfo:function(gameId,callback){
    var client = redis.createClient(config.redis.port, config.redis.host);
    client.get('FinishedGame:'+gameId,function (err, res){
      client.quit();
      if(err){
        err = new ServiceUnavailableError(err);
      }
      callback(err,res);
    });
  }
};
