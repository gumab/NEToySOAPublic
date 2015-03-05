'use strict';

var config = require('../config'),
    sql = require('mssql'),
    redis = require('redis');


// roll table sample design
// GAME_ID | ROLL_SEQ | ROLL_SCORE

module.exports = {

  // insert score
  insert: function (gameId, count, score, insDate, callback) {
    // MS-SQL sample code
    // var connection = new sql.Connection(config.database, function (err) {
    //   var request = new sql.Request(connection);

    //   request.input('GAME_ID', sql.BigInt, gameId);
    //   request.input('ROLL_SEQ', sql.Int, rollSeq);
    //   request.input('ROLL_SCORE', sql.Int, score);

    //   request.execute('Your Stored Procedure Name', function (err, recordsets, returnValue) {
    //     connection.close();

    //     callback(err, recordsets[0]);
    //   });
    // });

    // Redis sample code
    var client = redis.createClient(config.redis.port, config.redis.host);
    var obj = {score:score,insDate:insDate,count:count};
    client.rpush('rollList' + gameId, JSON.stringify(obj), function (err, res) {
      client.quit();

      // check error
      if (err) {
        err = new ServiceUnavailableError(err);
      }

      // callback
      callback(err, res);
    });
  },

  // select all rolls by gameId
  selectAllByGameId: function (gameId, callback) {
    // MS-SQL sample code
    // var connection = new sql.Connection(config.database, function (err) {
    //   var request = new sql.Request(connection);

    //   request.input('GAME_ID', sql.BigInt, gameId);

    //   request.execute('Your Stored Procedure Name', function (err, recordsets, returnValue) {
    //     connection.close();

    //     callback(err, recordsets[0]);
    //   });
    // });

    // Redis sample code
    var client = redis.createClient(config.redis.port, config.redis.host);

    client.lrange('rollList' + gameId, 0, -1, function (err, res) {
      client.quit();

      // check error
      if (err) {
        err = new ServiceUnavailableError(err);
      }

      // callback
      callback(err, (res || []).map(function (data, index) {
        return {
          GAME_ID: gameId,
          ROLL_SEQ: index,
          ROLL_SCORE: parseInt(JSON.parse(data).score),
          ROLL_COUNT: parseInt(JSON.parse(data).count)
        }
      }));
    });
  },

  selectTopByGameId: function (gameId, callback){
    var client = redis.createClient(config.redis.port, config.redis.host);

    client.lrange('rollList' + gameId, -1, -1, function (err, res) {
      client.quit();

      // check error
      if (err) {
        callback(new ServiceUnavailableError(err),null);
      }
      else if(res==''||res==null){
        callback(err,null);
      }
      else{
        callback(err, JSON.parse(res));
      }
    });
  }
};