var winston = require('winston');
const filename = 'logger/analyticsLogger.log';

function getLogger() {
  var logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename })
    ]
  });
  return logger;
}

exports.getLogger = getLogger;
