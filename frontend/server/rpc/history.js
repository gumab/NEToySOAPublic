'use strict';

var config = require('../config/config'),
    request = require('request'),
    restifyResponseHandler = require('../lib/restify-response-handler');

module.exports = {
  loadHistory: function (userId, callback){
    request.post(
      {
        url: config.backend + '/loadHistory',
        formData: { userId: userId }
      },
      restifyResponseHandler(function (error, response, body) {
        callback(error, body);
      })
    );
  },

  deleteGame: function (gameId, callback){
    request.post(
      {
        url: config.backend + '/deleteGame',
        formData: { gameId: gameId }
      },
      restifyResponseHandler(function (error, response, body) {
        callback(error, body);
      })
    );
  }
};
