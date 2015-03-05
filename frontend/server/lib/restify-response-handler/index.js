'use strict';

module.exports = function (callback) {
  return function (error, response, body) {
    if (error || response.statusCode === 200) {
      callback(error, response, body);
    } else {
      var ErrorConstructor = RESTError(response.statusCode);
      callback(new ErrorConstructor(JSON.parse(body).message), response, body);
    }
  };
};
