'use strict';

var config = require('../config'),
    sql = require('mssql'),
    redis = require('redis');

module.exports = {

  // insert game
  insert: function (userId, callback) {
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

    client.rpush('gameList', userId, function (err, res) {
      client.quit();

      callback(err, res);
    });
  }
};
