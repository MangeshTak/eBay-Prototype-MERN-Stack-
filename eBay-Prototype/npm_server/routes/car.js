var kafka = require('./kafka/client');

var s3 = require('./s3')

var config = require('config');
var topic_name = config.kafkaTopic;

function addCar(req,res){
    var obj = {
        carQuantity : req.body.carQuantity,
        carType : req.body.carType,
        carName : req.body.carName,
        occupancy :  req.body.occupancy,
        luggage :  req.body.luggage,
        dailyRentalValue :  req.body.dailyRentalValue,
        serviceStartDate :  req.body.serviceStartDate,
        serviceEndDate :  req.body.serviceEndDate,
        carCity : req.body.carCity
    }

    if(req.files == null){
    	kafka.make_request(topic_name,'addCar',obj, function(err,result){
            if(err) {
                return res.status(500).json({status:500,statusText:"Internal server error"});
            } else {
                return res.status(result.code).json({status:result.code,statusText:result.message});
            }
        });
    }
    else {
	    s3.upload(req.files, function(err, result){
	        if(err) {
	            return res.status(500).json({status: 500, statusText: "Failed to upload images to S3 storage"});
	        } else {
	            obj.images = result;
	            kafka.make_request(topic_name,'addCar',obj, function(err,result){
	                if(err) {
	                    return res.status(500).json({status:500,statusText:"Internal server error"});
	                } else {
	                    return res.status(result.code).json({status:result.code,statusText:result.message});
	                }
	            });
	        }
	    });
    }
}

function getCars(req,res){
    


    kafka.make_request(topic_name,'getCars',{

    },function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}

function getCarById(req,res){
    kafka.make_request(topic_name,'getCarById',{
        id:req.params.id
    },function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}

function updateCarById(req,res){

      var obj = {
        carQuantity : req.body.carQuantity,
        carType : req.body.carType,
        carName : req.body.carName,
        occupancy :  req.body.occupancy,
        luggage :  req.body.luggage,
        dailyRentalValue :  req.body.dailyRentalValue,
        serviceStartDate :  req.body.serviceStartDate,
        serviceEndDate :  req.body.serviceEndDate,
        _id : req.body._id,
        carCity : req.body.carCity
    }

    if(req.files == null){
        kafka.make_request(topic_name,'updateCarById',obj, function(err,result){
                    if(err) {
                        return res.status(500).json({status:500,statusText:"Internal server error"});
                    } else {
                        return res.status(result.code).json({status:result.code,statusText:result.message});
                    }
                });
    }else{
        
        s3.upload(req.files, function(err, result){
            if(err) {
                return res.status(500).json({status: 500, statusText: "Failed to upload images to S3 storage"});
            } else {
                obj.images = result;


                kafka.make_request(topic_name,'updateCarById',obj, function(err,result){
                    if(err) {
                        return res.status(500).json({status:500,statusText:"Internal server error"});
                    } else {
                        return res.status(result.code).json({status:result.code,statusText:result.message});
                    }
                });
            }
        });
    }


    /*kafka.make_request(topic_name,'updateCarById',req.body,function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });*/
}

function deleteCarById(req,res){
    kafka.make_request(topic_name,'deleteCarById',{
        idToDelete : req.params.id
    },function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message, data:result.data});
        }
    });
}

function getCarsForCustomer(req,res){
    
    console.log("Query Params " , req.query);

    kafka.make_request(topic_name,'getCarsForCustomer',{
        queryParams : req.query
    },function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}


function getCarByIdForCustomer(req,res){
    kafka.make_request(topic_name,'getCarByIdForCustomer',{ id : req.params.id }, function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}


exports.addCar = addCar;
exports.getCars = getCars;
exports.getCarById = getCarById;
exports.updateCarById = updateCarById;
exports.deleteCarById = deleteCarById;
exports.getCarsForCustomer = getCarsForCustomer;
exports.getCarByIdForCustomer = getCarByIdForCustomer;