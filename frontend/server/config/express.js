'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    path = require('path'),
    config = require('./config');

// Express configuration
module.exports = function (app) {
  var env = process.env.NODE_ENV;

  // local configuration
  if ('local' === env) {
    app.use(require('connect-livereload')());
  }

  // Common configuration
  app.use(express.static(path.join(config.root, 'client')));
  app.set('views', path.join(config.root, 'client'));

  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
};
