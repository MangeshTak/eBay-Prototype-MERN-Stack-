var analyticsModel = require('../models/analytics.js');

var filename = 'logger/analyticsLogger.log';
var fs = require('fs');
var readline = require('readline');
var fileCursor = {
  x: 0,
  y: 0
};


const pauseInterval = 200;

var isPaused = false;

var results;

function processClickPerPage(lineObj, callback) {
  //console.log('record Click Page' + fileCursor.y);
  if(lineObj.message.type = 'clicksPerPage') {
    if(results.clicksPerPage[lineObj.message.page]) {
      results.clicksPerPage[lineObj.message.page].push({'timestamp': lineObj.message.time});
    } else {
      results.clicksPerPage[lineObj.message.page] = [{'timestamp' : lineObj.message.time}];
    }
  }
  callback;
}

function processUserActivityTracking(lineObj, callback) {
  var payload = {};
  if(lineObj.message.user) {
    payload.email = lineObj.message.user.email;
  }
  payload.page = lineObj.message.page;
  payload.duration = lineObj.message.duration;
  payload.time = lineObj.message.time;
  //console.log(lineObj);
  if(results.userActivityTracking[lineObj.message.userId]) {
    results.userActivityTracking[lineObj.message.userId].push(payload);
  } else {
    results.userActivityTracking[lineObj.message.userId] = [];
    results.userActivityTracking[lineObj.message.userId].push(payload);
  }


}

function processListingView(lineObj) {
  listingName = lineObj.message.name
  listingName= listingName.replace(/ /g,"_");
  if(lineObj.message.category === 'car') {
    if(results.viewsPerListing.cars[listingName]) {
      results.viewsPerListing.cars[listingName].push({'timestamp' : lineObj.message.time});
    } else {
      results.viewsPerListing.cars[listingName] = [];
      results.viewsPerListing.cars[listingName].push({'timestamp' : lineObj.message.time});
    }
  } else if(lineObj.message.category === 'hotel') {
    if(results.viewsPerListing.hotels[listingName]) {
      results.viewsPerListing.hotels[listingName].push({'timestamp' : lineObj.message.time});
    } else {
      results.viewsPerListing.hotels[listingName] = [];
      results.viewsPerListing.hotels[listingName].push({'timestamp' : lineObj.message.time});
    }
  } else {
    if(results.viewsPerListing.flights[listingName]) {
      results.viewsPerListing.flights[listingName].push({'timestamp' : lineObj.message.time});
    } else {
      results.viewsPerListing.flights[listingName] = [];
      results.viewsPerListing.flights[listingName].push({'timestamp' : lineObj.message.time});
    }
  }
}

function readEachLine(line, callback) {
//  console.log('reading line function' + fileCursor.y);
  var lineObj = JSON.parse(line);
  if(lineObj.message.type === 'clicksPerPage') {
    processClickPerPage(lineObj, function() {
      //callback;
    });
  } else if (lineObj.message.type === 'listingView') {
    processListingView(lineObj, function() {
    });
  } else if(lineObj.message.type === 'userActivityTracking') {
    processUserActivityTracking(lineObj, function() {
    });
  }
}


function run(callback) {
  results = {
    clicksPerPage: {

    },
    viewsPerListing: {
      cars : {

      },
      hotels : {

      },
      flights : {

      }
    },
    userActivityTracking: {

    }
  };
  var rl = readline.createInterface({
    input: fs.createReadStream(filename)
  })

  rl.on('line', (line) => {
    //rl.pause();
    //console.log('reading line' + fileCursor.y);
    readEachLine(line, function() {
      fileCursor.y++;
    });
  })
  rl.on('close',(line) => {
   /* console.log('file cursar at',fileCursor);
    //clearInterval(intervalHandler);
    console.log('---------------------------------------------- '+
    '\n-------------------Summary--------------------'+
    '\n---------------------------------------------- ');*/
    analyticsModel.remove({}, function() {
      var newAnalytics = new analyticsModel({"results": results});
      newAnalytics.save();
      callback;
    });
  });


  //var intervalHandler = setInterval(toggleReader,pauseInterval,rl);

  function toggleReader(rl) {
    if (isPaused) {
      rl.resume();
      isPaused = false;
      /*console.log('---------------------------------------------- '+
      '\n-----------------------resuming----------------------- '+isPaused+
      '\n---------------------------------------------- ');*/
    }
    else {
      rl.pause();
      isPaused = true;
      /*console.log('---------------------------------------------- '+
      '\n-----------------------pausing----------------------- '+isPaused+
      '\n---------------------------------------------- ');*/
    }
  }
}


exports.run = run;
