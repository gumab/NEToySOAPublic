'use strict';

var config = require('./config/config'),
    express = require('express'),
    app = express();


// express config
require('./config/express')(app);


// register routing rules
require('./routes')(app);


// start listening
app.listen(config.port, config.ip, function () {
	console.log('Express server listening on %s:%d', config.ip, config.port);
});
