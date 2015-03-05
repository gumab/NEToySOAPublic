'use strict';

// define global error types
require('./data/error-types')();


// get modules
var config = require('./config/config'),
    express = require('express'),
    app = express();


// set express config
require('./config/express')(app);


// use routing rules
require('./routes')(app);


// use error handler
require('./lib/error-handler')(app);


// start listening
app.listen(config.port, config.ip, function () {
	console.log('Express server listening on %s:%d', config.ip, config.port);
});
