'use strict';

var config = require('../config'),
    sql = require('mssql'),
    redis = require('redis');

// roll table sample design
// GAME_ID | ROLL_SEQ | ROLL_SCORE

module.exports = {

  // insert score
  insert: function (gameId, rollSeq, score, callback) {
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

    client.rpush('rollList' + gameId, score, function (err, res) {
      client.quit();

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

      callback(err, res.map(function (data, index) {
        return {
          GAME_ID: gameId,
          ROLL_SEQ: index,
          ROLL_SCORE: parseInt(data)
        }
      }));
    });
  }
};
