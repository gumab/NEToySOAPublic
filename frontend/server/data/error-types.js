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


  var errorMap = [
    {
      statusCode: 500,
      errorConstructor: InternalServerError
    },
    {
      statusCode: 409,
      errorConstructor: InvalidArgumentError
    },
    {
      statusCode: 503,
      errorConstructor: ServiceUnavailableError
    }
  ];

  function RESTError(statusCode) {
    return errorMap.filter(function (data) {
      return data.statusCode === statusCode;
    })[0].errorConstructor || InternalServerError;
  }

  function RESTStatusCode(fn) {
    return errorMap.filter(function (data) {
      return data.errorConstructor === fn;
    })[0].statusCode || 500;
  }


  global.InternalServerError = InternalServerError;
  global.InvalidArgumentError = InvalidArgumentError;
  global.ServiceUnavailableError = ServiceUnavailableError;
  global.RESTError = RESTError;
  global.RESTStatusCode = RESTStatusCode;
};
