'use strict';

module.exports = function () {

  function InternalServerError(e) {
    Error.call(this);
    Error.captureStackTrace(this, InternalServerError);
    this.id = e.id;
    this.name = 'InternalServerError';
    this.message = e.message
  }

  function InvalidArgumentError(e) {
    if (typeof e === 'string') {
      e = new Error(e);
    }
    Error.call(this);
    Error.captureStackTrace(this, InvalidArgumentError);
    this.id = e.id;
    this.name = 'InvalidArgumentError';
    this.message = e.message
  }

  function ServiceUnavailableError(e) {
    Error.call(this);
    Error.captureStackTrace(this, ServiceUnavailableError);
    this.id = e.id;
    this.name = 'ServiceUnavailableError';
    this.message = e.message
  }


  require('util').inherits(InternalServerError, Error);
  require('util').inherits(InvalidArgumentError, Error);
  require('util').inherits(ServiceUnavailableError, Error);


  global.InternalServerError = InternalServerError;
  global.InvalidArgumentError = InvalidArgumentError;
  global.ServiceUnavailableError = ServiceUnavailableError;
};
