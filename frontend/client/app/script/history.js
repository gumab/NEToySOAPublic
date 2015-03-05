var UserId;
var isProcessing = false;
/*
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
*/
function drawTable(list){
  var html='<br/>';
  var game;
  for(var i = list.length-1;i>=0;i--){
    game = JSON.parse(list[i]);
    html+= '<div class="panel panel-success">';
    html+= '<div class="panel-heading">';
    html+= '<table style="width:100%; margin:0">';
    html+= '<tr><td align=left><button type=button onclick="deleteGame('+game.gameId+')" class="btn btn-danger">Delete</button></td>';
    html+= '<td align=right><b>End Date : '+game.endDate+'</b></td></tr></table></div>';
    html+= '<div class="panel-body">'
    html += makeTableHtml(game.throwList,game.scoreList);
    html += '</div></div>'
  }
  document.getElementById('ScoreTable').innerHTML = html;
}

function deleteGame(gameId){
  console.log(gameId);
  var scope = angular.element(document.getElementById('controllerDiv')).scope()
  scope.$apply(function () {
    scope.deleteGame(gameId);
  });
}



   
/////////////////////////////angular js//////////////////////////////


  var app = angular.module('historyApp', []);
  var UserId;

  // angular service.
  // UI independent logic
  app.provider('historyService', function () {
    function HistoryService($http) {
      this.deleteGame = function (gameId) {
        document.getElementById('ScoreTable').innerHTML = 'deleting..';
        return $http({
          method: 'POST',
          url: 'deleteGame/',
          data: {gameId:gameId}
        })
      },
      this.loadHistory = function () {
        document.getElementById('ScoreTable').innerHTML = 'loading..';
        return $http({
          method: 'POST',
          url: 'loadHistory/',
          data: {userId:UserId}
        }).success(function(data, status, headers, config) {
          drawTable(data);
          app = angular.module('historyApp', []);
          //console.log(data);
        })
      }
    }

    return {
      $get: function ($http) {
        return new HistoryService($http);
      },

      setUserId: function (userId) {
        this.userId = userId;
        UserId=userId;
      }
    }
  });


  // angular controller.
  // bind model <-> html
  app.controller('HistoryCtrl', function ($scope, historyService) {
    var self = this;
    $scope.deleteGame = function (gameId) {
      //console.log($cookies.userId);
      console.log(gameId);

      buttonBlur();
      if(isProcessing){
        return;
      }
      if(!confirm('delete?')){
        return;
      }
      setProcessInfo(true);
      historyService.deleteGame(gameId).then(function(){
        historyService.loadHistory().then(function(){
          setProcessInfo(false);
        });
      });
    };
/*
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
      //customPageLoad();
      setProcessInfo(true);
      historyService.loadHistory().then(function(){
        setProcessInfo(false);
      });
    }
  });

  app.config(function (historyServiceProvider) {
    historyServiceProvider.setUserId(frontend.data.userId);
  });