var cron = require('node-cron');
var analyze = require('../logger/loggerAnalyzer.js');

var task = cron.schedule('*/30 * * * *', function() {
  console.log('Running analyzer');
  analyze.run();
}, false);

task.start();
