var kafka = require('./kafka/client');
var s3 = require('./s3');
var config = require('config');
var topic_name = config.kafkaTopic;

function addHotel(req,res){
	var tempHotelRooms = JSON.parse(req.body.hotelRooms);
	for(var i=0; i<tempHotelRooms.length; i++){
		tempHotelRooms[i].priceTotal = parseInt(tempHotelRooms[i].priceTotal);
		tempHotelRooms[i].totalAvailable = parseInt(tempHotelRooms[i].totalAvailable);
		tempHotelRooms[i].personPerRoom = parseInt(tempHotelRooms[i].personPerRoom);
	}

    var amenities = req.body.amenities.split(",") ;
    if(amenities.length == 1 && amenities[0] == ''){
        amenities = [] ; 
    }

	var obj = {
		hotelName : req.body.hotelName ,
		hotelAddress : req.body.hotelAddress,
		hotelCity : req.body.hotelCity,
		hotelState : req.body.hotelState,
		hotelZip : req.body.hotelZip,
		hotelStar : req.body.hotelStar,
		hotelPhoneNumber : req.body.hotelPhoneNumber,
		hotelEmail : req.body.hotelEmail,
		hotelRating : req.body.hotelRating,
		serviceStartDate : req.body.serviceStartDate,
		serviceEndDate : req.body.serviceEndDate,
		hotelRooms: tempHotelRooms ,
		hotelAmenities : amenities
    }
    

	if(req.files == null){
        kafka.make_request(topic_name,'addHotel',obj, function(err,result){
            if(err) {
                return res.status(500).json({status:500,statusText:"Internal server error"});
            } else {
                return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
            }
        });
    }else{
	    s3.upload(req.files, function(err, result){
	        if(err) {
	            return res.status(500).json({status: 500, statusText: "Failed to upload images to S3 storage"});
	        } else {
	            obj.images = result;
	            kafka.make_request(topic_name,'addHotel',obj,function(err,result){
	                if(err) {
	                    return res.status(500).json({status:500,statusText:"Internal server error"});
	                } else {
	                    return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
	                }		
	        	});
	        }
	    });
    }
}

function getHotels(req,res){
	kafka.make_request(topic_name,'getHotels',{},function(err,result){
		if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}

function getHotelById(req,res){
	kafka.make_request(topic_name,'getHotelById',{ id : req.params.id }, function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}

function updateHotelById(req,res){
	var tempHotelRooms = JSON.parse(req.body.hotelRooms);
	for(var i=0; i<tempHotelRooms.length; i++){
		tempHotelRooms[i].priceTotal = parseInt(tempHotelRooms[i].priceTotal);
		tempHotelRooms[i].totalAvailable = parseInt(tempHotelRooms[i].totalAvailable);
		tempHotelRooms[i].personPerRoom = parseInt(tempHotelRooms[i].personPerRoom);
	}
    var amenities = req.body.amenities.split(",") ;
    if(amenities.length == 1 && amenities[0] == ''){
        amenities = [] ; 
    }
	var obj = {
		hotelName : req.body.hotelName ,
		hotelAddress : req.body.hotelAddress,
		hotelCity : req.body.hotelCity,
		hotelState : req.body.hotelState,
		hotelZip : req.body.hotelZip,
		hotelStar : req.body.hotelStar,
		hotelPhoneNumber : req.body.hotelPhoneNumber,
		hotelEmail : req.body.hotelEmail,
		hotelRating : req.body.hotelRating,
		serviceStartDate : req.body.serviceStartDate,
		serviceEndDate : req.body.serviceEndDate,
		hotelRooms: tempHotelRooms,
        _id : req.body._id,
        idToUpdate : req.params.id,
		hotelAmenities : amenities
    }
    if(req.files == null){
        kafka.make_request(topic_name,'updateHotelById',obj, function(err,result){
            if(err) {
                return res.status(500).json({status:500,statusText:"Internal server error"});
            } else {
                return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
            }
        });
    }else{
        s3.upload(req.files, function(err, result){
            if(err) {
                return res.status(500).json({status: 500, statusText: "Failed to upload images to S3 storage"});
            } else {
                obj.images = result;
                kafka.make_request(topic_name,'updateHotelById',obj, function(err,result){
                    if(err) {
                        return res.status(500).json({status:500,statusText:"Internal server error"});
                    } else {
                        return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
                    }
                });
            }
        });
    }
}

function deleteHotelById(req,res){
    var idToDelete = req.params.id ; 
	kafka.make_request(topic_name,'deleteHotelById',{ idToDelete : idToDelete },function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
           return res.status(result.code).json({status:result.code,statusText:result.message, data:result.data});
        }
    });
}

function getHotelsForCustomer(req,res){
	kafka.make_request(topic_name,'getHotelsForCustomer',{
        queryParams : req.query
	},function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}


function getHotelByIdForCustomer(req,res){
    kafka.make_request(topic_name,'getHotelByIdForCustomer',{ id : req.params.id }, function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}

exports.addHotel = addHotel;
exports.getHotels = getHotels;
exports.getHotelById = getHotelById;
exports.updateHotelById = updateHotelById;
exports.deleteHotelById = deleteHotelById;
exports.getHotelsForCustomer = getHotelsForCustomer;
exports.getHotelByIdForCustomer = getHotelByIdForCustomer;