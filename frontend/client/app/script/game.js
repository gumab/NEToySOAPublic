var PIN_MAX = 10;
    var THROW_MAX = 20;
    var FRAME_MAX = 10;
    var NumRange = PIN_MAX;
    CONSTS_SYMBOL = {
      STRIKE:-2,
      SPARE:-3,
      CALC_ING:-4,
      BAR:-5,
      NOTHING:-6
    }
    var isProcessing = false;

    function myKeyPressHandler() {
        var key;
        var numRange = NumRange;
        if (window.event)
            key = window.event.keyCode;
        else
            key = e.which;      //firefox를 위해
        for (var i = 0; i < 10; i++) {
            if (key - 48 == i) {

                if (i <= numRange) {
                    submitRoll(i)
                }
            }
        }
        if (key == 13 && numRange == 10) {
            submitRoll(10);
        }
    }
    document.onkeypress = myKeyPressHandler

    function submitRoll(btnId) {
        //app.GameCtrl.submitRoll(btnId)//document.forms.namedItem("form" + i).submit();
        document.getElementById('btn_'+btnId).click();
    }
    
    function customPageLoad(){
        var html = "";
        for(var i=0;i<=PIN_MAX;i++){
            html += '<button id="btn_'+i+'" style="margin-bottom:5px" data-ng-click="gameCtrl.submitRoll('+i+')" class="btn btn-default btn-lg" ';
            if(i>NumRange){
                html+='disabled=""';
            }
            html += '>'+i+'</button>';
        }
        document.getElementById('btn').innerHTML = html;
    }

    function setBtnNumRange(numRange){
      for(var i=0; i<=PIN_MAX;i++){
        if(i<=numRange){
          document.getElementById('btn_'+i).disabled=false;
        }else{
          document.getElementById('btn_'+i).disabled=true;
        }
      }
    }

    function drawTable(data){
      console.log(data);  
      if(data==''){
        document.getElementById('ScoreTable').innerHTML = '<br/>';
        return;
      }
      document.getElementById('ScoreTable').innerHTML = makeTableHtml(data.throwList,data.scoreList);
    }

    function makeTableHtml(throwList,scoreList){
      var count = throwList.length;
      var frameCount = scoreList.length;
      var html = '';
      if(count<=THROW_MAX){
        var width = (Math.floor((count+1)/2)*200.0/(THROW_MAX+1)).toFixed(2);
      }else{
        var width = 100;
      }
      html += '<table class="table-bordered" style="width:'+width+'%"><tr>';
      for(var i = 0; i<frameCount && i<FRAME_MAX-1;i++){
        html += '<td style="padding:0;width:'+(200/(THROW_MAX+1)).toFixed(2)+'%">';
        html += '<table class="table" style="margin:0">';
        html += '<tr><td class="table" style="border:0;width:50%;padding:0" align="center">';
        html += '<font size="3">'+symbolize(throwList[i*2])+'</font></td>';
        html += '<td class="warning" style="border:0;width:50%;padding:0" align="center">';
        html += '<font size="3">'+symbolize(throwList[i*2+1])+'</font></td></tr>';
        html += '<tr><td class="table" align="center" colspan="2" style="padding:0;border:0">';
        html += '<font size="3">'+symbolize(scoreList[i].score)+'</font></td></tr></table></td>';
      }
      if(count<THROW_MAX-2 && count%2!=0){
        html += '<td style="padding:0;width:'+(200/(THROW_MAX+1)).toFixed(2)+'%">';
        html += '<table class="table" style="margin:0">';
        html += '<tr><td class="table" style="border:0;width:50%;padding:0" align="center">';
        html += '<font size="3">'+symbolize(throwList[count-1])+'</font></td>';
        html += '<td class="warning" style="border:0;width:50%;padding:0" align="center">';
        html += '<font size="3"></font></td></tr>';
        html += '<tr><td class="table" align="center" colspan="2" style="padding:0;border:0">';
        html += '<font size="3">'+symbolize(CONSTS_SYMBOL.CALC_ING)+'</font></td></tr></table></td>';
      }
      else if(frameCount>FRAME_MAX-1){

        var tdWidth,secondThrow,lastScore;
        if(count>THROW_MAX){
          tdWidth=(300/(THROW_MAX+1)).toFixed(2);
        }
        else{
          tdWidth=(200/(THROW_MAX+1)).toFixed(2);
        }
        if(count>=THROW_MAX){
          secondThrow=throwList[THROW_MAX-1];
          lastScore=scoreList[scoreList.length-1].score;
        }
        else{
          secondThrow=CONSTS_SYMBOL.NOTHING;
          lastScore=CONSTS_SYMBOL.CALC_ING;
        }
        html += '<td style="padding:0;width:'+tdWidth+'%">';
        html += '<table class="table" style="margin:0">';
        html += '<tr><td class="table" style="border:0;width:33%;padding:0" align="center">';
        html += '<font size="3">'+symbolize(throwList[THROW_MAX-2])+'</font></td>';
        html += '<td class="warning" style="border:0;width:33%;padding:0" align="center">';
        html += '<font size="3">'+symbolize(secondThrow)+'</font></td>';
        if(count>THROW_MAX){
          html += '<td class="danger" style="border:0;width:33%;padding:0" align="center">';
          html += '<font size="3">'+symbolize(throwList[count-1])+'</font></td>';
        }
        html += '</tr><tr><td class="table" align="center" colspan="3" style="padding:0;border:0">';
        html += '<font size="3">'+symbolize(lastScore)+'</font></td></tr></table></td>';
      }
      html += '</tr></table>';
      return html;
    }



    function symbolize(constant){
      var result='';
      if (constant<0){
        switch(constant){
          case CONSTS_SYMBOL.STRIKE : result='X'; break;
          case CONSTS_SYMBOL.SPARE : result='/'; break;
          case CONSTS_SYMBOL.BAR : result='-'; break;
          case CONSTS_SYMBOL.CALC_ING : result='...'; break;
          default : result=''; break;
        }
      }
      else{
        result=constant;
      }
      return result;
    }

    function buttonBlur(){
      var btns = document.getElementsByTagName('button');
      for(var i=0;i<btns.length;i++){
        btns[i].blur();
      }
    }

    /////////////////////////////angular js//////////////////////////////


  var app = angular.module('gameApp', []);
  var UserId;

  // angular service.
  // UI independent logic
  app.provider('gameService', function () {

    function GameService($http) {
      this.submitRoll = function (roll) {
        return $http({
          method: 'POST',
          url: 'roll/',
          data: {userId:UserId, roll:roll}
          }).success(function(data, status, headers, config) {
            setBtnNumRange(data.numRange);
            NumRange=data.numRange;
            if(data.numRange<0){
              document.getElementById('GameOver').style.display='';
            }else{
              document.getElementById('GameOver').style.display='none';
            }
            drawTable(data);
            isProcessing=false;
          }).error(function(data, status, headers, config) {
            isProcessing=false;
        });
      }

      this.newGame = function () {
        return $http({
          method: 'POST',
          url: 'newGame/',
          data: {userId:UserId}
          }).success(function(data, status, headers, config) {
            setBtnNumRange(PIN_MAX);
            NumRange=PIN_MAX;
          }).error(function(data, status, headers, config) {
            isProcessing=false;
        });
      }

      this.loadGame = function (){
        return $http({
          method:'POST',
          url: 'loadGame/',
          data:{userId:UserId}
        }).success(function(data, status, headers, config){
          if(data==-1){
            window.location = '/';
          }
          else if(data!=''){
            setBtnNumRange(data.numRange);
            NumRange=data.numRange;
          }
          else{
            setBtnNumRange(PIN_MAX);
            NumRange=PIN_MAX;
          }
          if(data.numRange<0){
            document.getElementById('GameOver').style.display='';
          }else{
            document.getElementById('GameOver').style.display='none';
          }
          drawTable(data);
          isProcessing=false;
        }).error(function(data,status,headers,config){
          isProcessing=false;
        });
      }
    }

    return {
      $get: function ($http) {
        return new GameService($http);
      },

      setUserId: function (userId) {
        this.userId = userId;
        UserId=userId;
      }
    }
  });


  // angular controller.
  // bind model <-> html
  app.controller('GameCtrl', function ($scope, gameService) {
    var self = this;

    this.submitRoll = function (roll) {
      //console.log($cookies.userId);
      //console.log(temp);
      buttonBlur();
      if(isProcessing){
        return;
      }else{
        isProcessing=true;
      }
      gameService.submitRoll(roll);
      
      /*gameService.signUp(userId,pwd,cPwd).then(function (res) {

      });*/
    };

    this.newGame = function (){
      buttonBlur();
      if(isProcessing){
        return;
      }else{
        isProcessing=true;
      }
      gameService.newGame().then(function(){
        gameService.loadGame();
      });
    };

    this.init = function(){
      gameService.loadGame();
    }
  });

  app.config(function (gameServiceProvider) {
    gameServiceProvider.setUserId(frontend.data.userId);
  });
