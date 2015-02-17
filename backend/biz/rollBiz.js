'use strict';

var gameDac = require('../dac/gameDac'),
    rollDac = require('../dac/rollDac');

module.exports = {

  addScore: function (gameId, score, callback) {
    rollDac.selectAllByGameId(gameId, function (err, data) {
      if (!err) {
        rollDac.insert(gameId, data.length, score, function (err, data) {
          if (!err) {
            callback(null, 0); // TODO: return data ?
          } else {
            callback(err, null);
          }
        });
      } else {
        callback(err, null);
      }
    });
  }
};
