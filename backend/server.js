'use strict';

var config = require('./config').server,
    restify = require('restify');


// create server
var server = restify.createServer({
  name: config.name,
  version: config.version
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());


// register routing rules
require('./routes')(server);


// start listening
server.listen(config.port, function () {
  console.log('%s listening at %s', server.name, server.url);
});

