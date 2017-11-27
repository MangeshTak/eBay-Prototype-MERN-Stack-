var config = require('config');
var redisClient = require('redis').createClient;
var redis = redisClient(config.redisPort , config.redisHost);

redis.on('connect', function() {
    console.log('Redis connected');
});


exports.redis = redis  ;