var kafka = require('./kafka/client');

var config = require('config');
var topic_name = config.kafkaTopic;



function addFlight(req,res){

    kafka.make_request(topic_name,'addFlight',req.body,function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {

            return res.status(result.code).json({status:result.code,statusText:result.message});
        }
    });
}

function getFlights(req,res){
    kafka.make_request(topic_name,'getFlights',{

    },function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}

function getFlightById(req,res){
    var id =  req.params.id
    kafka.make_request(topic_name,'getFlightById',{
        id
    },function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}

function updateFlightById(req,res){

    kafka.make_request(topic_name,'updateFlightById',req.body,function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}

function deleteFlightById(req,res){
    var idToDelete = req.params.id ;
    kafka.make_request(topic_name,'deleteFlightById',{
        idToDelete : idToDelete
    },function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            console.log(result) ;
            return res.status(result.code).json({status:result.code,statusText:result.message, data:result.data});
        }
    });
}
function getFlightsForCustomer(req,res){
    kafka.make_request(topic_name,'getFlightsForCustomer',{
        queryParams : req.query
    },function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });

}

function getFlightByIdForCustomer(req,res){
    kafka.make_request(topic_name,'getFlightByIdForCustomer',{
        id : req.params.id
    }, function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}

exports.addFlight = addFlight;
exports.getFlights = getFlights;
exports.getFlightById = getFlightById;
exports.updateFlightById = updateFlightById;
exports.deleteFlightById = deleteFlightById;
exports.getFlightsForCustomer = getFlightsForCustomer;
exports.getFlightByIdForCustomer = getFlightByIdForCustomer;