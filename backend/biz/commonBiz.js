'use strict';
module.exports = {
getCurrentDate : function () {
  var currentdate = new Date();
  var datetime =
    currentdate.getFullYear() + "-"
    + (currentdate.getMonth()+1) + "-"
    + currentdate.getDate() + " "
    + currentdate.getHours() + ":"
    + currentdate.getMinutes() + ":"
    + currentdate.getSeconds();
    return datetime;
}
}