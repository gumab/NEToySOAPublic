'use strict';

var restify = require('restify');

module.exports = function (error) {
  var restifyError = null;

  switch (error.constructor) {
    case InvalidArgumentError:
      restifyError = new restify.errors.InvalidArgumentError(error.message);
      break;

    case ServiceUnavailableError:
      restifyError = new restify.errors.ServiceUnavailableError(error.message);
      break;

    default:
      restifyError = new restify.errors.InternalServerError(error.message);
  }

  // TODO: error logging
  console.log(error);
  console.log(restifyError);

  return restifyError;
};
