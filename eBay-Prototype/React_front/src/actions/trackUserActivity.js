import * as api from '../api/analytics';

export const logPageChange = (page) => {
  getCurrentUsersId(function(userId) {
    var lastPageVisited = sessionStorage.lastPageVisited;
    var timeLastPageVisited = sessionStorage.lastTimeSeen;
    var currentTime = new Date().getTime();
    var totalSecondsSpent = (currentTime - timeLastPageVisited)/1000;
    storeCurrentPageLog(page.pathname, function() {
      var payload = {
        userId : userId,
        page : lastPageVisited,
        duration :totalSecondsSpent
      }
      api.trackTotalDurationSpent(payload);
    });
  })
}


function getCurrentUsersId(callback) {
  var userId = localStorage.getItem('userId');
  if(!userId) {
    generateUuid(function(uuid) {
      localStorage.setItem('userId', uuid);
      callback(uuid);
    });
  } else {
    callback(userId);
  }
}


function generateUuid(callback) {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
  }
  callback(s4() + s4() + '-' + s4() + '-' + s4() + '-' +
  s4() + '-' + s4() + s4() + s4());
}

function storeCurrentPageLog(page, callback) {
  var time = new Date().getTime();
  sessionStorage.lastPageVisited = page;
  sessionStorage.lastTimeSeen = time;
  callback();
}
