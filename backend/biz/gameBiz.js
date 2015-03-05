'use strict';

var config = require('../config'),
    gameDac = require('../dac/gameDac'),
    rollDac = require('../dac/rollDac'),
    memberBiz = require('../biz/memberBiz'),
    commonBiz = require('../biz/commonBiz');

var addScore = function (gameId, score, count, callback) {

    // check parameters
    if (isNaN(gameId) || isNaN(score)) {
      callback(new InvalidArgumentError('Invalid Parameter'), null);

    // process biz logics
    } 
    else {
      rollDac.selectAllByGameId(gameId, function (err, data) {
        if (!err) {
          rollDac.insert(gameId, count, score,commonBiz.getCurrentDate(), function (err, data) {
            callback(err, data);
          });
        } 
        else {
          callback(err, null);
        }
      });
    }
  };

var roll = function (userId, score, callback) {
    // check parameters

    if (isNaN(score)||score>config.PIN_MAX||score<0) {

      callback(new InvalidArgumentError('Invalid Parameter'), null);
    }
    else {
      memberBiz.getUserByUserId(userId, function (err, user) {
        if (!err) {
          if(user==null){
            callback(err, user);
          }
          if(user.gameId=='undefined'||!(user.gameId>0)){
            newGame(userId,function (err,gId){
              if(err){
                callback(err,data);
              }
              else{
                var gameId = parseInt(gId);
                rollGame(gameId, score, function(err,data){
                  callback(err,data);
                })
              }
            });
          } 
          else{
            rollGame(user.gameId,score,function (err,data){
              if(err||data==null||data==''){
                callback(err,null)
              }
              else{
                if(data.numRange<0){
                  setGameFinish(user.gameId,true,function (err,isSuccess){});
                }
                callback(err,data);
              }
            });
          }
        } 
        else {
          callback(err, null);
        }
      });
    }
  };

  var loadGameByUserId = function (userId, callback){
    
    memberBiz.getUserByUserId(userId, function (err, user) {
      if (err||user==null){
        callback(err,-1);
      }
      if(user.gameId=='undefined'||!(user.gameId>0)) {
        callback(err,null);
      }
      else{
        loadGame(user.gameId,function (err,data){
          callback(err,data);
        });
      }
    });
  };

  var loadGame = function (gameId, callback){
    var result, numRange;
    rollDac.selectTopByGameId(gameId,function (err,top){
      if(err||top==null){
        callback(err,top);
      }
      else {
        var count=parseInt(top.count);
        rollDac.selectAllByGameId(gameId,function (err,data){
          if(err){
            callback(err,null);
          }
          else{
            makeFullThrowList(data,function (err,throwList){
              if(count==config.THROW_MAX+1){
                numRange = -1;
              }
              else if(count==config.THROW_MAX){
                var lastFrame1 = throwList[config.THROW_MAX-2];
                var lastFrame2 = throwList[config.THROW_MAX-1];
                if(lastFrame1==config.CONSTS_SYMBOL.STRIKE||lastFrame2==config.CONSTS_SYMBOL.STRIKE||lastFrame2==config.CONSTS_SYMBOL.SPARE||lastFrame1+lastFrame2==config.PIN_MAX){
                  numRange = config.PIN_MAX;
                }
                else{
                  numRange = -1;
                }
              }
              else if(count==config.THROW_MAX-1){
                if(top.score==config.PIN_MAX){
                  numRange = config.PIN_MAX;
                } 
                else {
                  numRange = config.PIN_MAX-top.score;
                }
              }
              else if(count %2 ==0){
                numRange = config.PIN_MAX;
              }
              else{
                numRange = config.PIN_MAX-top.score;
              }
              makeScoreList(throwList,function (err,data){
                result = {numRange:numRange,count:count,throwList:throwList,scoreList:data};
                callback(err,result);
              });
            });
          }
        });
      }
    });
  };

  var rollGame = function (gameId, score, callback){
    var result, firstCnt, numRange;
    rollDac.selectTopByGameId(gameId,function(err,top){
      if(err){
        callback(err,null);
      }
      else if(top==null){//첫번째
        if(score==config.PIN_MAX){
          firstCnt=2;
          numRange=config.PIN_MAX;
        }
        else{
          firstCnt=1;
          numRange=config.PIN_MAX-score;
        }
        addScore(gameId, score, firstCnt , function (err, data){
          if(err){
            callback(err,null);
          } 
          else {
            getThrowScoreList(gameId,function (err,throwList,scoreList){
              result = {numRange:numRange,count:firstCnt,throwList:throwList,scoreList:scoreList};
              callback(err,result);
            });
          }
        });
      } 
      else {  //처음이 아닌 경우
        var count = parseInt(top.count);
        if(count>config.THROW_MAX){
          callback(new InvalidArgumentError('Game is over1'), null);
        } 
        else if(count==config.THROW_MAX){ // 보너스프레임
          numRange = -1;
          rollDac.selectAllByGameId(gameId,function (err,data){
            if(err){
              callback(err,null);
            }
            else{
              makeFullThrowList(data,function (err,data){
                var lastFrame1 = data[config.THROW_MAX-2];
                var lastFrame2 = data[config.THROW_MAX-1];
                if(lastFrame1==config.CONSTS_SYMBOL.STRIKE||lastFrame2==config.CONSTS_SYMBOL.STRIKE||lastFrame2==config.CONSTS_SYMBOL.SPARE||lastFrame1+lastFrame2==config.PIN_MAX){
                  addScore(gameId,score,count+1,function(err,data){
                    if(err){
                      callback(err,null);
                    } 
                    else{
                      getThrowScoreList(gameId,function (err,throwList,scoreList){
                        result = {numRange:numRange,count:count+1,throwList:throwList,scoreList:scoreList};
                        callback(err,result);
                      });
                    }
                  })
                } 
                else{
                  callback(new InvalidArgumentError('Game is over'), null);
                }
              });
            }
          });
        }
        else if(count==config.THROW_MAX-1){//마지막 프레임 두번째
          numRange = config.PIN_MAX;
          addScore(gameId,score,count+1,function (err,data){
            if(err){
              callback(err,null);
            } 
            else {
              getThrowScoreList(gameId,function (err,throwList,scoreList){
                var lastFrame1 = throwList[config.THROW_MAX-2];
                var lastFrame2 = throwList[config.THROW_MAX-1];
                if(lastFrame1==config.CONSTS_SYMBOL.STRIKE||lastFrame2==config.CONSTS_SYMBOL.STRIKE||lastFrame2==config.CONSTS_SYMBOL.SPARE||lastFrame1+lastFrame2==config.PIN_MAX){
                  numRange = config.PIN_MAX;
                }
                else{
                  numRange = -1;
                }
                result = {numRange:numRange,count:count+1,throwList:throwList,scoreList:scoreList};
                callback(err,result);
              });
            }
          });
        }
        else if(count==config.THROW_MAX-2){//마지막 프레임 첫번째
          if(score==config.PIN_MAX){
            numRange = config.PIN_MAX;
          } 
          else {
            numRange = config.PIN_MAX-score;
          }
          addScore(gameId,score,count+1,function (err,data){
            if(err){
              callback(err,null);
            } 
            else {
              getThrowScoreList(gameId,function (err,throwList,scoreList){
                result = {numRange:numRange,count:count+1,throwList:throwList,scoreList:scoreList};
                callback(err,result);
              });
            }
          });
        }
        else if(count %2 !=0){ //홀수번 시행된 경우
          if(score > config.PIN_MAX - top.score)
            callback(new InvalidArgumentError('Invalid Parameter'), null);
          else{
            numRange = config.PIN_MAX;
            addScore(gameId, score, count+1, function(err, data){
              if(err){
                callback(err,null);
              } 
              else {
                getThrowScoreList(gameId,function (err,throwList,scoreList){
                  result = {numRange:numRange,count:count+1,throwList:throwList,scoreList:scoreList};
                  callback(err,result);
                });
              }
            });
          }
        } 
        else {//짝수인경우
          if(score==config.PIN_MAX){
            count++;
            numRange = config.PIN_MAX;
          }
          else{
            numRange = config.PIN_MAX-score;
          }
          addScore(gameId, score, count+1, function(err, data){
            if(err){
              callback(err,null);
            } 
            else{
              getThrowScoreList(gameId,function (err,throwList,scoreList){
                result = {numRange:numRange,count:count+1,throwList:throwList,scoreList:scoreList};
                callback(err,result);
              });
            }
          });
        }
      }
    })
  };

  var getThrowScoreList = function (gameId,callback){
    rollDac.selectAllByGameId(gameId, function (err,data){
      if(err){
        callback(err,null,null);
      } 
      else {
        makeFullThrowList(data,function (err,throwList){
          makeScoreList(throwList,function (err, scoreList){
            callback(err,throwList,scoreList);
          });
        });
      }
    });
  }


  var makeFullThrowList = function (list,callback){
    var throwList = [];
    for (var i=0;i<list.length;i++){
      if(i>0 && list[i].ROLL_COUNT-1!=list[i-1].ROLL_COUNT ||i==0&&list[i].ROLL_COUNT==2){
        throwList.push(config.CONSTS_SYMBOL.BAR);
        throwList.push(config.CONSTS_SYMBOL.STRIKE);
      } 
      else if (list[i].ROLL_COUNT>config.THROW_MAX-2){
        if(list[i].ROLL_SCORE==config.PIN_MAX){
          throwList.push(config.CONSTS_SYMBOL.STRIKE);
        }
        else if(list[i].ROLL_COUNT==config.THROW_MAX){
          if(list[i].ROLL_SCORE+list[i-1].ROLL_SCORE==config.PIN_MAX && list[i].ROLL_SCORE!=0){
            throwList.push(config.CONSTS_SYMBOL.SPARE);
          }
          else{
            throwList.push(list[i].ROLL_SCORE);
          }
        }
        else{
          throwList.push(list[i].ROLL_SCORE);
        }
      }
      else if(list[i].ROLL_COUNT%2==0 && list[i].ROLL_SCORE + list[i-1].ROLL_SCORE == config.PIN_MAX){
        throwList.push(config.CONSTS_SYMBOL.SPARE);
      }
      else {
        throwList.push(list[i].ROLL_SCORE);
      }
    }
    callback(null,throwList);
  };

  var makeScoreList = function(throwList,callback){

    var sumScoreList = [];
    var scoreList = [];
    var sum=0;
    for(var i=1;i<throwList.length&&i<config.THROW_MAX-2;i+=2){
      if(throwList[i]==config.CONSTS_SYMBOL.STRIKE){
        scoreList.push({score:config.PIN_MAX, status:config.CONSTS_STAT.STRIKE});
      } 
      else if( throwList[i]==config.CONSTS_SYMBOL.SPARE){
        scoreList.push({score:config.PIN_MAX, status:config.CONSTS_STAT.SPARE});
      }
      else{
        scoreList.push({score:throwList[i]+throwList[i-1],status:config.CONSTS_STAT.NORMAL})
      }
    }
    if(throwList.length>config.THROW_MAX-2){
      var bonusScore=0;
      for(var i=config.THROW_MAX-2;i<throwList.length;i++){
        if(throwList[i]==config.CONSTS_SYMBOL.STRIKE){
          bonusScore += config.PIN_MAX;
        } 
        else if(throwList[i]==config.CONSTS_SYMBOL.SPARE){
          bonusScore += config.PIN_MAX-throwList[i-1];;
        }
        else{
          bonusScore += throwList[i];
        }
      }
      if(throwList.length==config.THROW_MAX-1){
        scoreList.push({score:config.CONSTS_SYMBOL.CALC_ING,status:config.CONSTS_STAT.BONUS});
      }else{
        scoreList.push({score:bonusScore,status:config.CONSTS_STAT.BONUS});
      }
      
    }
    for (var i=scoreList.length-1;i>=0;i--){
      if(scoreList[i].status==config.CONSTS_STAT.NORMAL){
        sumScoreList[i]={score:scoreList[i].score,status:scoreList[i].status};
      } 
      else if(scoreList[i].status == config.CONSTS_STAT.SPARE){
        if(i+1<scoreList.length){
          if(scoreList[i+1].status==config.CONSTS_STAT.STRIKE){
            sumScoreList[i]={score:config.PIN_MAX+config.PIN_MAX,status:scoreList[i].status};
          }
          else if(scoreList[i+1].status == config.CONSTS_STAT.BONUS){
            if(throwList[(i+1)*2]==config.CONSTS_SYMBOL.STRIKE){
              sumScoreList[i]={score:2*config.PIN_MAX,status:scoreList[i].status};
            }
            else{
              sumScoreList[i]={score:config.PIN_MAX+throwList[(i+1)*2],status:scoreList[i].status};
            }
          }
          else{
            sumScoreList[i]={score:config.PIN_MAX+throwList[(i+1)*2],status:scoreList[i].status};
          }
        }
        else{
          sumScoreList[i]={score:config.CONSTS_SYMBOL.CALC_ING,status:scoreList[i].status};
        }
      } 
      else if(scoreList[i].status == config.CONSTS_STAT.STRIKE){
        if(i+1<scoreList.length){
          if(scoreList[i+1].status== config.CONSTS_STAT.STRIKE){
            if(i+2<scoreList.length){
              if(scoreList[i+2].status==config.CONSTS_STAT.STRIKE){
                sumScoreList[i]={score:3*config.PIN_MAX,status:scoreList[i].status};
              }
              else if(scoreList[i+2].status == config.CONSTS_STAT.BONUS){
                sumScoreList[i]={score:2*config.PIN_MAX+symbolConstToScore(throwList[(i+2)*2]),status:scoreList[i].status};
              }
              else{
                sumScoreList[i]={score:2*config.PIN_MAX+throwList[(i+2)*2],status:scoreList[i].status}
              }
            } 
            else {
              sumScoreList[i]={score:config.CONSTS_SYMBOL.CALC_ING,status:scoreList[i].status};
            }
          }
          else if(scoreList[i+1].status==config.CONSTS_STAT.BONUS){//9번째 프레임에서 strike시
            if((i+1)*2+1<throwList.length){//20회이상 했을때
              if(throwList[(i+1)*2+1]==config.CONSTS_SYMBOL.SPARE){
                sumScoreList[i]={score:2*config.PIN_MAX,status:scoreList[i].status};
              }
              else{
                sumScoreList[i]={score:config.PIN_MAX + symbolConstToScore(throwList[(i+1)*2]) + symbolConstToScore(throwList[(i+1)*2+1]), status:scoreList[i].status};
              }
            } else{
              sumScoreList[i]={score:config.CONSTS_SYMBOL.CALC_ING,status:scoreList[i].status};
            }
          }
          else{
            sumScoreList[i]={score:config.PIN_MAX+scoreList[i+1].score,status:scoreList[i].status};
          }
        } 
        else {
          sumScoreList[i]={score:config.CONSTS_SYMBOL.CALC_ING,status:scoreList[i].status};
        }
      } else if(scoreList[i].status == config.CONSTS_STAT.BONUS){
        sumScoreList[i]={score:scoreList[i].score,status:scoreList[i].status};
      } else {
        sumScoreList[i]=0;
      }
    }

    for(var i=0;i<sumScoreList.length;i++){
      if(sumScoreList[i].score<0){
        for(i;i<sumScoreList.length;i++){
          sumScoreList[i].score=config.CONSTS_SYMBOL.CALC_ING;
        }
        break;
      }
      sum+=sumScoreList[i].score;
      sumScoreList[i].score=sum;
    }

    callback(null,sumScoreList);
  };
  var symbolConstToScore = function (input){
    if(input>=0){
      return input;
    }
    else if(input==config.CONSTS_SYMBOL.STRIKE){
      return config.PIN_MAX;
    }
    else{
      return 0;
    }
  };

var addGame = function (userId, callback) {

    // check parameters
    if (!userId) {
      callback(new InvalidArgumentError('Invalid User ID'), null);

    // process biz logics
    } else {
      gameDac.insert(userId,commonBiz.getCurrentDate(), function (err, data) {
        if(err||isNaN(data)){
          callback(err,data);
        }
        else{
          var gameId = parseInt(data);
          memberBiz.setUserGameId(userId,gameId,function (err,data){
            gameDac.insertPersonalGameList(userId,gameId,function (err,data){
              callback(err,data);
            });
          });
        }
      });
    }
  };

var removeGame = function (gameId, callback){
    var updDate = commonBiz.getCurrentDate();
    gameDac.selectGameByGameId(gameId,function (err,game){
      if(err||game==null||game==''){
        callback(err,null);
      }
      else{
        game.isDelete=true;
        game.updDate=updDate;
        gameDac.updateGame(gameId, game, function (err,data){
          callback(err,data);
        })
      }
    });
  };
var setGameFinish = function (gameId, isFinish, callback){
    var updDate = commonBiz.getCurrentDate();
    gameDac.selectGameByGameId(gameId,function (err,game){
      if(err||game==null||game==''){
        callback(err,null);
      }
      else{
        game.isFinish=isFinish;
        game.updDate=updDate;
        gameDac.updateGame(gameId,game, function (err,data){
          callback(err,data);
        })
      }
    });
  };

var getScore = function (gameId, callback) {

    // check parameters
    if (isNaN(gameId)) {
      callback(new InvalidArgumentError('Invalid Game ID'), null);

    // process biz logics
    } else {
      rollDac.selectAllByGameId(gameId, function (err, data) {
        // TODO: calculate score
        callback(err, data.reduce(function (rollSum, rollData) {
          return rollSum + rollData.ROLL_SCORE;
        }, 0));
      });
    }
  };

  var newGame = function (userId, callback) {
    // check parameters

    if (!userId) {
      callback(new InvalidArgumentError('Invalid User ID'), null);
    // process biz logics
    } else {
      memberBiz.getUserByUserId(userId, function (err, user) {
        if (err||user==null||user=='') {
          callback(err,null);
        }
        else{
          if(user.gameId=='undefined'||!(user.gameId>0)){
            addGame(userId, function (err,data){
              callback(err,data);
            })
          }
          else {
            gameDac.selectGameByGameId(user.gameId,function (err,game){
              if(err||game==null||game==''){
                callback(err,null);
              }
              else{
                if(game.isFinish==true){
                  getThrowScoreList(user.gameId,function (err,throwList,scoreList){
                    if(err){
                      callback(err,null);
                    }
                    else{
                      var data = {gameId:user.gameId,endDate:commonBiz.getCurrentDate(),throwList:throwList,scoreList:scoreList};
                      gameDac.insertFinishGameInfo(user.gameId,data,function (err,data){
                        if(err){
                          callback(err,data);
                        }
                        else{
                          addGame(userId, function (err,data){
                            callback(err,data);
                          });
                        }
                      });
                    }
                  });
                }
                else{
                  removeGame(user.gameId,function(err,data){
                    if(err){
                      callback(err,data);
                    }
                    else{
                      addGame(userId, function (err,data){
                        callback(err,data);
                      });
                    }
                  });
                }
              }
            });
          }
        }
      });
    }
  };
  var getAllGames = function(userId,callback){
    gameDac.selectAllGameIdByUserId(userId,function (err,gameIdList){
      if(err||gameIdList==null||gameIdList==''){
        callback(err,null);
      }
      else{
        var result = [];
        var count = gameIdList.length;
        for(var i=0;i<gameIdList.length;i++){
          var gameId=parseInt(gameIdList[i]);
          getGameData(gameId,function (err,gameData){
            if(gameData!=null){
              result.push(gameData);
            }
            count--;
            if(count==0){
              console.log(result);
              callback(err,result);
            }
          })
        }
      }
    });
  };

  var getGameData = function(gameId,callback){
    console.log(gameId);
    gameDac.selectGameByGameId(gameId,function (err,game){
      if(err){
        callback(err,null);
      }
      else{
        if(game.isFinish&&!game.isDelete){
          gameDac.selectFinishGameInfo(gameId,function (err, gameData){
            if(err){
              callback(err,null);
            }
            else{
              callback(err,gameData);
            }
          });
        }
        else{
          callback(err,null);
        }
      }
    })
  }




module.exports = {
  getScore: getScore,
  newGame: newGame,

  getAllGames : getAllGames,

  setGameFinish: setGameFinish,
  removeGame: removeGame,
  roll: roll,
  loadGameByUserId: loadGameByUserId
};