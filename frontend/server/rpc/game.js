'use strict';

var config = require('../config/config'),
    request = require('request');

module.exports = {

  // add game
  add: function (userId, callback) {
    request.post(
      {
        url: config.backend + '/game',
        formData: { userId: userId }
      },
      function (error, response, body) {
        if (response.statusCode !== 200) {
          callback(new Error(), {});
        } else {
          callback(error, body);
        }
      }
    );
  },

  // get game score
  getScore: function (gameId, callback) {
    request.get(config.backend + '/game/' + gameId + '/score', function (error, response, body) {
      if (response.statusCode !== 200) {
        callback(new Error(), {});
      } else {
        callback(error, body);
      }
    });
  }
};
