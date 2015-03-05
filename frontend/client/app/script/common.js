var PIN_MAX = 10;
var THROW_MAX = 20;
var FRAME_MAX = 10;
var CONSTS_SYMBOL = {
  STRIKE:-2,
  SPARE:-3,
  CALC_ING:-4,
  BAR:-5,
  NOTHING:-6
}

function buttonBlur(){
  var btns = document.getElementsByTagName('button');
  for(var i=0;i<btns.length;i++){
    btns[i].blur();
  }
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

 function setProcessInfo(isProc){
    isProcessing=isProc;
    //console.log($('#jumbotron'))
    if(isProcessing){
      
      $('#body').css('opacity',0.3);
      $('#loadingBar').css('display','');
    }
    else{
      $('#body').css('opacity',1);
      $('#loadingBar').css('display','none');
    } 
  }