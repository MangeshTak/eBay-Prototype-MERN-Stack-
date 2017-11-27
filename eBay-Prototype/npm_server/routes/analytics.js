var kafka = require('./kafka/client');
var config = require('config');
var topic_name = config.kafkaTopic;
var s3 = require('./s3')
var config = require('config');
var topic_name = config.kafkaTopic;



function getFormattedDate(callback) {
	var date = new Date();
	var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
	callback(str);
}

function trackClick(req,res) {
	if(req.user) {
		req.body.user = req.user;
	} else {
		req.body.user = 'anonymous';
	}
	getFormattedDate(function(dateTime) {
		req.body.time = dateTime;
		kafka.make_request(topic_name,'trackClick', req.body ,function(err,result){
			if(err) {
				return res.status(500).json({status:500,statusText:"Internal server error"});
			} else {
				return res.status(result.code).json({status:result.code,statusText:result.message});
			}
		});
	})
}

function trackTotalDurationSpent(req, res) {
	if(req.user) {
		req.body.user = req.user;
	} else {
		req.body.user = 'anonymous';
	}
	console.log(req.body);
	getFormattedDate(function(dateTime) {
		req.body.time = dateTime;
		kafka.make_request(topic_name,'trackTotalDurationSpent', req.body ,function(err,result){
			if(err) {
				return res.status(500).json({status:500,statusText:"Internal server error"});
			} else {
				return res.status(result.code).json({status:result.code,statusText:result.message});
			}
		});
	})
}

function getRevenueByType(req,res){
    kafka.make_request(topic_name,'getRevenueByType',{

    },function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}

function getRevenueByTopCmpny(req,res){
    kafka.make_request(topic_name,'getRevenueByTopCmpny',{

    },function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}

function getRevenueByCity(req,res){
    kafka.make_request(topic_name,'getRevenueByCity',{

    },function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}

function getUserAnalytics(req,res){
    kafka.make_request(topic_name,'getUserAnalytics',{

    },function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}

exports.getRevenueByType = getRevenueByType;
exports.getRevenueByCity = getRevenueByCity;
exports.getRevenueByTopCmpny = getRevenueByTopCmpny;
exports.trackClick = trackClick;
exports.getUserAnalytics = getUserAnalytics;
exports.trackTotalDurationSpent = trackTotalDurationSpent;
