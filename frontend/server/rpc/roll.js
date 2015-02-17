'use strict';

var config = require('../config/config'),
    request = require('request');

module.exports = {

  // add score
  add: function (gameId, score, callback) {
    request.post(config.backend + '/roll/' + gameId + '/' + score, function (error, response, body) {
      if (response.statusCode !== 200) {
        callback(new Error(), {});
      } else {
        callback(error, body);
      }
    });
  }
};
