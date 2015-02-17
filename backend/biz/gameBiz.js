'use strict';

var gameDac = require('../dac/gameDac'),
    rollDac = require('../dac/rollDac');

module.exports = {

  addGame: function (userId, callback) {
    gameDac.insert(userId, function (err, data) {
      if (!err) {
        callback(null, data);
      } else {
        callback(err, null);
      }
    });
  },

  getScore: function (gameId, callback) {
    rollDac.selectAllByGameId(gameId, function (err, data) {
      if (!err) {
        // TODO: calculate total score
        var score = data.reduce(function (rollSum, rollData) {
          return rollSum + rollData.ROLL_SCORE;
        }, 0);

        callback(null, score);
      } else {
        callback(err, null);
      }
    });
  }
};
