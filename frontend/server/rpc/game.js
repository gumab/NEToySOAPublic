'use strict';

var config = require('../config/config'),
    request = require('request'),
    restifyResponseHandler = require('../lib/restify-response-handler');

module.exports = {

  // add game
  /*
  add: function (userId, callback) {
    request.post(
      {
        url: config.backend + '/game',
        formData: { userId: userId }
      },
      restifyResponseHandler(function (error, response, body) {
        callback(error, body);
      })
    );
  },

*/
  // get game score
  getScore: function (gameId, callback) {
    request.get(config.backend + '/game/' + gameId + '/score', restifyResponseHandler(function (error, response, body) {
      callback(error, body);
    }));
  },

  newGame: function (userId, callback) {
    request.post(
      {
        url: config.backend + '/newGame',
        formData: { userId: userId }
      },
      restifyResponseHandler(function (error, response, body) {
        callback(error, body);
      })
    );
  },

  loadGame: function (userId, callback) {
    request.post(
      {
        url: config.backend + '/loadGame',
        formData: { userId: userId }
      },
      restifyResponseHandler(function (error, response, body) {
        callback(error, body);
      })
    );
  },

  history: function (userId, callback){
    request.post(
      {
        url: config.backend + '/history',
        formData: { userId: userId }
      },
      restifyResponseHandler(function (error, response, body) {
        callback(error, body);
      })
    );
  }
};
