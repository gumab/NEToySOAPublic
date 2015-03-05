'use strict';

module.exports = {
  server: {
    name: 'bowling backend',
    version: '0.0.1',
    port: 22222
  },

  // database: {
  //   server: '',
  //   database: '',
  //   user: '',
  //   password: ''
  // }
  redis:{
    host:'127.0.0.1',
    port:6379
  },
  redis1: {
    host: '10.64.205.57',
    port: 6379
  },

  redis2: {
    host: '10.64.215.85',
    port: 6379
  },
  redis3: {
    host: '10.238.130.125',
    port: 6379
  },
  CONSTS_SYMBOL : {
    STRIKE:-2,
    SPARE:-3,
    CALC_ING:-4,
    BAR:-5,
    NOTHING:-6
  },
  CONSTS_STAT : {
    NORMAL:-1,
    STRIKE:-2,
    SPARE:-3,
    BONUS:-4
  },
  PIN_MAX: 10,
  THROW_MAX:20,
  FRAME_MAX:10
};
