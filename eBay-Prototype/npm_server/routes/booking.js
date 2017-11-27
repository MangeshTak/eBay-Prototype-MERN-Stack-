var kafka = require('./kafka/client');

var config = require('config');
var topic_name = config.kafkaTopic;

function getBills(req,res){
    console.log("Palash ") ; 
    
	kafka.make_request(topic_name,'getBills',{
		category : req.params.category ,
        param : req.params.param
	},function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}

function getBillById(req,res){
	kafka.make_request(topic_name,'getBillById',{
		id:req.params.id
	},function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}

function makeBooking(req,res){
	kafka.make_request(topic_name,'makeBooking',{
	    userId:req.session.passport.user._id,
        data:req.body
    },function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message});
        }
    });
}

function getBookings(req,res){

    console.log("Called ") ; 
	kafka.make_request(topic_name,'getBookings',{
		userId:req.session.passport.user._id
	},function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}

function getBookingById(req,res){

    
	kafka.make_request(topic_name,'getBookingById',{
		bookingId : req.params.id ,
        userId : req.session.passport.user._id
	},function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            console.log(result)
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}

exports.getBills = getBills;
exports.getBillById = getBillById;
exports.makeBooking = makeBooking;
exports.getBookings = getBookings;
exports.getBookingById = getBookingById;