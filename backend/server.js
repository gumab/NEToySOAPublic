'use strict';

// define global error types
require('./data/error-types')();


// get modules
var config = require('./config').server,
    restify = require('restify');


// create server
var app = restify.createServer({
  name: config.name,
  version: config.version
});
app.use(restify.acceptParser(app.acceptable));
app.use(restify.queryParser());
app.use(restify.bodyParser());


// use router
require('./routes')(app);


// start listening
app.listen(config.port, function () {
  console.log('%s listening at %s', app.name, app.url);
});

