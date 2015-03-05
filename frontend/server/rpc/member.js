'use strict';

var config = require('../config/config'),
    request = require('request'),
    restifyResponseHandler = require('../lib/restify-response-handler');

module.exports = {

  signIn: function (userId, pwd, callback) {
    request.post(config.backend + '/signIn/' + userId + '/' + pwd, restifyResponseHandler(function (error, response, body) {
      callback(error, body);
    }));
  },

  signUp: function (userId, pwd, callback) {
    request.post(config.backend + '/signUp/' + userId + '/' + pwd, restifyResponseHandler(function (error, response, body) {
      callback(error, body);
    }));
  }
};
