'use strict';

module.exports = function (app) {
  app.use(function (err, req, res, next) {

    var status = RESTStatusCode(err.constructor);

    // TODO: error logging
    console.log(err);

    res.send(status, err.message);
  });
};
