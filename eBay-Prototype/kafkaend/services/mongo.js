//var MongoClient = require('mongodb').MongoClient;
var mongoose = require("mongoose");
var config = require('config');
var mongoURL = config.dbUrl;

var connected = false;

var numberOfConnection = 151;
var cntnStack = [];
var cntnQueue = [];

var createConnectionPool = function(){
  for(var count=0; count < numberOfConnection; count++){
    /*MongoClient.connect(mongoURL, function(err, _db){
      if (err) { 
        throw new Error('Could not connect: '+err)
      }
      cntnStack.push(_db);
    });*/    
    mongoose.connect(mongoURL, { useMongoClient: true }).then(
	  () => { cntnStack.push(_db); },
	  err => { throw new Error('Could not connect: '+err); }
	);    
  }
  connected = true;
}

setInterval(function(){
  if(cntnStack.length > 0){
    if(cntnQueue.length > 0){
      callback = cntnQueue.shift();
      db = cntnStack.pop();
      callback(null, db);
    }
  }
}, 1000);

var getCollection = function(name,callback){
  if (!connected) {
    throw new Error('Must connect to Mongo before calling "collection"');
  }
  getConnection(function(err,db){
    if (err) {
      throw new Error('Could not connect to database');
    }
    callback(null,db.collection(name));
    cntnStack.push(db);
  });
};


exports.createConnectionPool = createConnectionPool;
exports.getCollection = getCollection;
