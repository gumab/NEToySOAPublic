'use strict';

var memberDac = require('../dac/memberDac'),
    commonBiz = require('../biz/commonBiz');

module.exports = {

  signIn: function (userId, pwd, callback) {
      memberDac.selectUserByUserId(userId, function (err, data) {
        if (!err) {
          if(data==null){
            callback(err,false);
          }
          var obj = JSON.parse(data);
          if(obj.pwd==pwd){
            callback(err, true);
          }
          else{
            callback(err, false);
          }
        } else {
          callback(err, null);
        }
      });
  },

  signUp: function (userId, pwd, callback) {
    var insDate = commonBiz.getCurrentDate();
    memberDac.insertUser(userId,pwd,insDate, function (err, data) {
      if (!err) {
        callback(err, data);
      } else {
        callback(err, null);
      }
    });
  },

  setUserGameId: function (userId, gameId, callback){
    var updDate = commonBiz.getCurrentDate();
    memberDac.selectUserByUserId(userId,function (err,data){
      if(!err){
        if(data==null){
          callback(err,false);
        }
        var obj = JSON.parse(data);
        obj.gameId=gameId;
        obj.updDate=updDate;
        memberDac.updateUser(userId, obj, function (err,data){
          callback(err,data);
        })
      }else{
        callback(err,null);
      }
    });
    
  },

  getUserByUserId: function (userId, callback){
    memberDac.selectUserByUserId(userId, function (err,data){
      callback(err,JSON.parse(data));
    });
  }
};
