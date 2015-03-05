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