var mongo = require('./mongo');
var validator = require('validator');
var ObjectID = require('mongodb').ObjectID;
var hotelModel = require('../models/hotel.js');
var analytics = require('./analytics');
const moment = require('moment');

function addHotel(msg, callback){
	var res = {};
	if(true){
		msg.is_deleted = false;
		var now = msg.serviceStartDate;
		msg.availability = [];
		var hotelMinPrice = msg.hotelRooms[0].priceTotal;
		var hotelMaxPrice = msg.hotelRooms[0].priceTotal;
		for (var i=0 ; i < msg.hotelRooms.length ; i++) {
			if(msg.hotelRooms[i].priceTotal<hotelMinPrice){
				hotelMinPrice=msg.hotelRooms[i].priceTotal;
			}
			if(msg.hotelRooms[i].priceTotal>hotelMinPrice){
				hotelMaxPrice=msg.hotelRooms[i].priceTotal;
			}
		}
		msg.hotelMinPrice = hotelMinPrice;
		msg.hotelMaxPrice = hotelMaxPrice;

		var availabilityObj = {};
		var serviceDays = (new Date(msg.serviceEndDate)- new Date(msg.serviceStartDate))/(1000*60*60*24) ;
		var availabilityDateObject = [] ;
		for (var i=0 ; i <= serviceDays ; i++) {
			var date = new Date(new Date(msg.serviceStartDate).setUTCHours(0,0,0,0));
			date.setDate(date.getDate() + i);
			availabilityDateObject.push({availableDate : date , hotelRooms : msg.hotelRooms});
		}
		msg.availability = availabilityDateObject ;
		//console.log(msg) ;
		var newHotel = new hotelModel(msg);
		newHotel.save(function (err) {
			if(err) {
				console.log(err);
				res.code = 500 ;
				res.status  = 500 ;
				res.message = "Error occured while registering a hotel with server"
				callback(null , res);
			} else {
				res.code = 200  ;
				res.status  = 200 ;
				res.message = "Success";
				callback(null , res) ;
			}
		});
	}else{
		res.code = 400;
		res.status  = 400 ;
		res.data = []
		res.message = "Please pass the correct Parameteres";
		callback(null, res);
	}
}

function getHotels(msg, callback){
	var res = {};
	hotelModel.find({ is_deleted : false}, function(err, result){
		console.log(result) ;
		if(err){
			res.code = 500  ;
			res.status  = 500 ;
			res.message = "Fail to get all hotels from the server"
			callback(null , res) ;
		}else{
			res.code = 200  ;
			res.status  = 200 ;
			res.message = "Success"
			res.data = result;
			callback(null , res) ;
		}
	});
}

function getHotelById(msg, callback){
	var res = {};
	var idToGet = new ObjectID(msg.id) ;
	if(!validator.isEmpty(msg.id)){
		hotelModel.findOne({ is_deleted : false , _id : idToGet }, function(err, result){
			if(err){
				res.code = 500 ;
				res.status  = 500;
				res.message = "Fail to get hotel from the server";
				callback(null , res);
			}else{
				res.code = 200 ;
				res.status  = 200;
				res.message = "Success";
				res.data = result;
				callback(null , res);
			}
		});
	}else{
		res.code = 400;
		res.status  = 400 ;
		res.data = []
		res.message = "Please pass the correct Parameteres";
		callback(null, res);
	}
}

function updateHotelById(msg, callback){
	var res = {};
	var idToUpdate = new ObjectID(msg.idToUpdate) ;
	msg.is_deleted = false;
	var now = msg.serviceStartDate;
	msg.availability = [];
	var availabilityObj = {};

	var hotelMinPrice = msg.hotelRooms[0].priceTotal;
	var hotelMaxPrice = msg.hotelRooms[0].priceTotal;
	for (var i=0 ; i < msg.hotelRooms.length ; i++) {
		if(msg.hotelRooms[i].priceTotal<hotelMinPrice){
			hotelMinPrice=msg.hotelRooms[i].priceTotal;
		}
		if(msg.hotelRooms[i].priceTotal>hotelMinPrice){
			hotelMaxPrice=msg.hotelRooms[i].priceTotal;
		}
	}
	msg.hotelMinPrice = hotelMinPrice;
	msg.hotelMaxPrice = hotelMaxPrice;

	var serviceDays = (new Date(msg.serviceEndDate)- new Date(msg.serviceStartDate))/(1000*60*60*24) ;
	var availabilityDateObject = [] ;
	for (var i=0 ; i <= serviceDays ; i++) {
		var date = new Date(new Date(msg.serviceStartDate).setUTCHours(0,0,0,0));
		date.setDate(date.getDate() + i);
		availabilityDateObject.push({availableDate : date , hotelRooms : msg.hotelRooms});
	}
	msg.availability = availabilityDateObject ;
	if(true){
		hotelModel.update({is_deleted : false , _id : idToUpdate }, msg, { multi: false }, function(err , response){
			if(err){
				console.log(err);
				res.code = 500 ;
				res.status  = 500 ;
				res.message = "Error occured while updating a hotel"
				callback(null , res);
			} else {
				res.code = 200  ;
				res.status  = 200 ;
				res.message = "Hotel successfully updated";
				callback(null , res) ;
			}
		})
	}else{
		res.code = 400;
		res.status  = 400 ;
		res.data = []
		res.message = "Please pass the correct Parameteres";
		callback(null, res);
	}
}

function deleteHotelById(msg, callback){
	var res = {};
	var idToDelete = new ObjectID(msg.idToDelete) ;
	if(!validator.isEmpty(msg.idToDelete)){
		hotelModel.update({is_deleted : false , _id : idToDelete }, { $set: {is_deleted: true }}, { multi: false }, function(err , response){
			if(err){
				console.log(err);
				res.code = 500 ;
				res.status  = 500 ;
				res.message = "Error occured while deleting a hotel"
				callback(null , res);
			}else{
				res.code = 200  ;
				res.status  = 200 ;
				res.message = "Hotel successfully deleted";
				callback(null , res) ;
			}
		})
	}else{
		res.code = 400;
		res.status  = 400 ;
		res.data = []
		res.message = "Please pass the correct Parameteres";
		callback(null, res);
	}
}

function getHotelsForCustomer(msg, callback){
    var res = {};
    var parts = msg.queryParams.startDate.split("-");
    var startDate = new Date(parts[2]+"-"+parts[0]+"-"+parts[1]);
    parts = msg.queryParams.endDate.split("-");
    var endDate = new Date(parts[2]+"-"+parts[0]+"-"+parts[1]);
	var query = {
		hotelCity: msg.queryParams.city,
		hotelStar: {"$lte": Number.parseInt(msg.queryParams.rating) || 5, "$gte": 0},
		hotelRating : {"$lte": msg.queryParams.reviewScoreMax || 5, "$gte": msg.queryParams.reviewScoreMin || 0},
		serviceStartDate : { $lte: startDate },
		serviceEndDate : { $gte: endDate },
		is_deleted : false,
		availability: {
			$elemMatch: {
				availableDate: {
		            $gte: startDate,
		            $lte: endDate
		        },
		        hotelRooms : {
		        	$elemMatch: {
		        		 priceTotal : {"$lte": msg.queryParams.priceMax || 2000, "$gte": msg.queryParams.priceMin || 0},
		        		 personPerRoom : {"$gte": Number.parseInt(msg.queryParams.guests)},
		                 roomType : msg.queryParams.roomType,
		                 totalAvailable: {
		                     $gte: 1
		                 }
		        	}
	           }
	        }
	    }
		//availability:  {$exists:true}
		//$where: 'this.availability.length > ' + daysCount
	};

	if(msg.queryParams.amenities != undefined ){
		var amenitiesArray = msg.queryParams.amenities.split(',');
		if(amenitiesArray.length == 1 && amenitiesArray[0] == '' ){
			amenitiesArray = []
		}else if(amenitiesArray.length > 0 ){
			query.hotelAmenities =  { "$all" : amenitiesArray }
		}
	}
	
	var sortingObj = {};
	if(msg.queryParams.sort=="priceHtoL"){
		sortingObj["hotelMinPrice"] = -1;
	} else if(msg.queryParams.sort=="highRated"){
		sortingObj["hotelRating"] = -1;	
	} else if(msg.queryParams.sort=="stars"){
		sortingObj["hotelStar"] = -1;
	} else {
		sortingObj["hotelMinPrice"] = 1;
	}
	var options = {
		select: 'hotelName hotelAddress hotelCity hotelZip hotelPhoneNumber hotelEmail hotelStar hotelRating hotelAmenities hotelRooms images',
		lean: true,
		page: msg.queryParams.pageNo || 1,
		limit: 20,
		sort: sortingObj
	};
	hotelModel.paginate(query,options, function(err, result){
		if(err){
		    console.log(err);
			res.code = 500  ;
			res.message = "Fail to get all hotels from the server";
			callback(null , res) ;
		}else{
			res.code = 200  ;
			res.message = "Success";
			res.data = result;
			analytics.trackHotelPageViews(result);
			callback(null , res) ;
		}
	});
}

function getHotelByIdForCustomer(msg, callback){
	var res = {};
	idToGet = new ObjectID(msg.id) ;
	hotelModel.find({ is_deleted : false , _id : idToGet }).lean().exec(function(err, result){
		if(err){
			res.code = 500  ;
			res.message = "Fail to get all cars from the server"
			callback(null , res) ;
		}else{
			if(result) {
				delete result[0].availability;
				res.code = 200;
				res.message = "Success";
				res.data = result;
				callback(null, res);
			} else {
				res.code = 500  ;
				res.message = "Fail to get all cars from the server"
				callback(null , res) ;
			}
		}
	})
}

exports.addHotel = addHotel;
exports.getHotels = getHotels;
exports.getHotelById = getHotelById;
exports.updateHotelById = updateHotelById;
exports.deleteHotelById = deleteHotelById;
exports.getHotelsForCustomer = getHotelsForCustomer;
exports.getHotelByIdForCustomer = getHotelByIdForCustomer;