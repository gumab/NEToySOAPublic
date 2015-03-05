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

function customPageLoad(){
  var games = frontend.data;
  var gameList = [];
  if(games==null){
    console.log('no game');
    return
  }
  for(var i = 0; i<games.length;i++){
    gameList[i]=JSON.parse(games[i]);
  }
  drawTable(gameList)
  
}

function drawTable(list){
  var html='<br/>';
  for(var i = list.length-1;i>=0;i--){
    html+= '<div class="panel panel-success">';
    html+= '<div class="panel-heading">';
    html+= '<input type="hidden" name="gameNo" value=@table.GameNo>';
    html+= '<table style="width:100%; margin:0">';
    html+= '<tr><td align=left><button type=button id="btnDel_'+list[i].gameId+'" class="btn btn-danger">Delete</button></td>';
    html+= '<td align=right><b>End Date : '+list[i].endDate+'</b></td></tr></table></div>';
    html+= '<div class="panel-body">'
    html += makeTableHtml(list[i].throwList,list[i].scoreList);
    html += '</div></div>'
  }
  document.getElementById('ScoreTable').innerHTML = html;
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
/////////////////////////////angular js//////////////////////////////


  var app = angular.module('historyApp', []);
  var UserId;

  // angular service.
  // UI independent logic
  app.provider('historyService', function () {

    function HistoryService($http) {
    }

    return {
      $get: function ($http) {
        return new HistoryService($http);
      }
    }
  });


  // angular controller.
  // bind model <-> html
  app.controller('HistoryCtrl', function ($scope, historyService) {
    var self = this;


/*
    this.submitRoll = function (roll) {
      //console.log($cookies.userId);
      //console.log(temp);
      buttonBlur();
      if(isProcessing){
        return;
      }else{
        isProcessing=true;
      }
      historyService.submitRoll(roll);
    };

    this.newGame = function (){
      buttonBlur();
      if(isProcessing){
        return;
      }else{
        isProcessing=true;
      }
      historyService.newGame().then(function(){
        historyService.loadGame();
      });
    };
*/
    this.init = function(){
      //historyService.loadGame();
    }
  });