'use strict';

var path = require('path'),
    rootPath = path.normalize(__dirname + '/../..');

module.exports = {
   root: rootPath,
   ip: '0.0.0.0',
   port: 11111,
   backend: 'http://127.0.0.1:22222'
}
