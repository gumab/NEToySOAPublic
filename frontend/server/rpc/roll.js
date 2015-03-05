'use strict';

var config = require('../config/config'),
    request = require('request'),
    restifyResponseHandler = require('../lib/restify-response-handler');

module.exports = {

  // add score
  /*add: function (gameId, score, callback) {
    request.post(config.backend + '/roll/' + gameId + '/' + score, restifyResponseHandler(function (error, response, body) {
      callback(error, body);
    }));
  }*/

  add: function (userId, score, callback) {
    request.post(config.backend + '/roll/' + userId + '/' + score, restifyResponseHandler(function (error, response, body) {
      callback(error, body);
    }));
  }
};
