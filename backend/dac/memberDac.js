'use strict';

var config = require('../config'),
    sql = require('mssql'),
    redis = require('redis');

module.exports = {

  
  selectUserByUserId: function (userId, callback) {
    console.log('userId');
    var client = redis.createClient(config.redis.port, config.redis.host);
    client.get( 'Users:'+userId, function (err, res) {
      client.quit();

      // check error
      if (err) {
        err = new ServiceUnavailableError(err);
      }

      // callback
      callback(err, res);
    });
  },

  insertUser: function (userId, pwd, insDate, callback) {
    var client = redis.createClient(config.redis.port, config.redis.host);
    var obj = { userId:userId,
                pwd:pwd,
                insDate:insDate,
                gameId:0,
                updDate:insDate
              };
    client.setnx( 'Users:'+userId,JSON.stringify(obj), function (err, res) {
      client.quit();

      // check error
      if (err) {
        err = new ServiceUnavailableError(err);
      }

      // callback
      callback(err, res);
    });
  },

  updateUser: function (userId, user, callback) {
    var client = redis.createClient(config.redis.port, config.redis.host);
    client.set( 'Users:'+userId,JSON.stringify(user), function (err, res) {
      client.quit();
      // check error
      if (err) {
        err = new ServiceUnavailableError(err);
      }
      // callback
      callback(err, res);
    });
  }
};