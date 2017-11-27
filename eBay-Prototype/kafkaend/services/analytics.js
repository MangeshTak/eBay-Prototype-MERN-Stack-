var winston = require('winston');
const filename = 'logger/analyticsLogger.log';
var loggerFile = require('../logger/logger.js');
var logger = loggerFile.getLogger();
var analyze = require('../logger/loggerAnalyzer.js');
var validator = require('validator');
var ObjectID = require('mongodb').ObjectID;
var billingModel = require('../models/billing.js');
var carModel = require('../models/car.js');
var hotelModel = require('../models/hotel.js');
var flightModel = require('../models/flight.js');
var userModel = require('../models/authUsers.js');
var analyticsModel = require('../models/analytics.js');


function trackClick(msg, callback) {
  var res = {};
  msg.type = 'clicksPerPage'
  logger.log({
    level: 'info',
    message: msg
  });
  res.code = 200;
  res.message = "Success";
  analyze.run();
  callback(null , res)
}

function trackTotalDurationSpent(msg, callback) {
  var res = {};
  msg.type = 'userActivityTracking';
  logger.log({
    level: 'info',
    message: msg
  });
  res.code = 200;
  res.message = "Success";
  callback(null , res)
}

function trackCarPageViews(cars) {
  cars.docs.forEach(function(entry) {
    var car = {};
    car.id = entry._id;
    car.name = entry.carName;
    car.type = 'listingView';
    car.category = 'car';
    getFormattedDate(function(dateTime) {
  		car.time = dateTime;
      logger.log({
        level: 'info',
        message: car
      });
    });
  });
}

function trackHotelPageViews(hotels) {
  hotels.docs.forEach(function(entry) {
    var hotel = {};
    hotel.id = entry._id;
    hotel.name = entry.hotelName;
    hotel.type = 'listingView';
    hotel.category = 'hotel';
    getFormattedDate(function(dateTime) {
  		hotel.time = dateTime;
      logger.log({
        level: 'info',
        message: hotel
      });
    });
  });
}

function trackFlightPageViews(flights) {
  flights.docs.forEach(function(entry) {
    var flight = {};
    flight.id = entry._id;
    flight.name = entry.airline;
    flight.type = 'listingView';
    flight.category = 'flight';
    getFormattedDate(function(dateTime) {
  		flight.time = dateTime;
      logger.log({
        level: 'info',
        message: flight
      });
    });
  });
}

function getFormattedDate(callback) {
	var date = new Date();
	var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
	callback(str);
}

function getRevenueByType(msg, callback){
    var res = {};
    billingModel.aggregate ({$group: { _id: "$listingType", totalAmount: { $sum: "$totalAmount" }, count: { $sum: 1 } } } , function(err, result){
    	if(err){
            res.code = 500  ;
            res.message = "Fail to get data from the server"
            callback(null , res) ;
        }else{
	        userModel.aggregate([{ $group: { _id: null, count: { $sum: 1 } } }], function(err, result1){
	    		 if(err){
		            res.code = 500  ;
		            res.message = "Fail to get data from the server"
		            callback(null , res) ;
		        }else{
		        	hotelModel.aggregate([{ $group: { _id: null, count: { $sum: 1 } } }], function(err, result2){
			    		 if(err){
				            res.code = 500  ;
				            res.message = "Fail to get data from the server"
				            callback(null , res) ;
				        }else{
				        	flightModel.aggregate([{ $group: { _id: null, count: { $sum: 1 } } }], function(err, result3){
					    		 if(err){
						            res.code = 500  ;
						            res.message = "Fail to get data from the server"
						            callback(null , res) ;
						        }else{
						        	carModel.aggregate([{ $group: { _id: null, count: { $sum: 1 } } }], function(err, result4){
							    		if(err){
								            res.code = 500  ;
								            res.message = "Fail to get data from the server"
								            callback(null , res) ;
								        }else{
								            res.code = 200  ;
								            res.message = "Success";
								            res.data = {};
								            res.data.revenueByType = result;
								            res.data.userCount = result1 ? result1[0].count : 0;
								            res.data.hotelCount = result2 ? result2[0].count : 0;
								            res.data.flightCount = result3 ? result3[0].count : 0;
								            res.data.carCount = result4 ? result4[0].count : 0;
								            callback(null , res) ;
								        }
						        	});
						        }
				        	});
				      }
        	   });
           }
        });
	  }
  });
}

function getRevenueByTopCmpny(msg, callback){
    var res = {};
    billingModel.aggregate([{ '$match': { 'createdDate': { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)), $lt: new Date(new Date().setDate(new Date().getDate() + 1))}}},
		{ $group: { _id: "$listingId", totalAmount: { $sum: "$totalAmount" }, count: { $sum: 1 }, listingType: { "$first": "$listingType" }} },
		{$sort: {totalAmount: -1}},
                {$lookup: {from: "hotels" ,localField: "_id",foreignField: "_id", as: "listingHotelName"}},
                {$lookup: {from: "cars" ,localField: "_id",foreignField: "_id", as: "listingCarName"}},
                {$lookup: {from: "flights" ,localField: "_id",foreignField: "_id", as: "listingFlightName"}}]).limit(10).exec(function(err, result){
        if(err){
            res.code = 500  ;
            res.message = "Fail to get data from the server"
            callback(null , res) ;
        }else{
        	billingModel.aggregate([{ '$match': { 'createdDate': { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)), $lt: new Date(new Date().setDate(new Date().getDate() + 1))}}},
        		{ $group: { _id: "$listingId", totalAmount: { $sum: "$totalAmount" }, count: { $sum: 1 }, listingType: { "$first": "$listingType" }} },
        		{$sort: {totalAmount: -1}},
                        {$lookup: {from: "hotels" ,localField: "_id",foreignField: "_id", as: "listingHotelName"}},
                        {$lookup: {from: "cars" ,localField: "_id",foreignField: "_id", as: "listingCarName"}},
                        {$lookup: {from: "flights" ,localField: "_id",foreignField: "_id", as: "listingFlightName"}}]).limit(10).exec(function(err, result0){
        		 if(err){
    	            res.code = 500  ;
    	            res.message = "Fail to get data from the server"
    	            callback(null , res) ;
    	        }else{
    	        	res.code = 200  ;
    	            res.message = "Success";
    	            res.data = {};
    	            res.data.revenueYr = result;
    	            res.data.revenueMonth = result0;
    	            callback(null , res);
    	        }
        	});
        }
    });
}

function getRevenueByCity(msg, callback){
    var res = {};
    billingModel.aggregate([ { $group: { _id: "$revenueGeneratingCity", totalAmount: { $sum: "$totalAmount" },count: { $sum: 1 }} },
    	{$sort: {totalAmount: -1}} ]).limit(10).exec(function(err, result){
        if(err){
            res.code = 500  ;
            res.message = "Fail to get data from the server"
            callback(null , res) ;
        }else{
            res.code = 200  ;
            res.message = "Success"
            res.data = result
            callback(null , res) ;
        }
    });
}

function getUserAnalytics(msg, callback){
    var res = {};
    analyticsModel.find({}, function(err, result){
        if(err){
            res.code = 500  ;
            res.message = "Fail to get data from the server"
            callback(null , res) ;
        }else{
        	var userAnalyticsPageClicks=[], userAnalyticsListingViewCar=[], userAnalyticsListingViewHotel=[], userAnalyticsListingViewFlight=[],
        	userActivityTracking=[];
        	//{name: 'Rosewood Hotels & Resorts', uv1: 4000, pv1: 9000, uv2: 4000, pv2: 9000, amt: 2400}
        	var i=0;
        	if(result && result[0] && result[0].results && result[0].results.clicksPerPage ){
	        	for (var key in result[0].results.clicksPerPage) {
	        		userAnalyticsPageClicks.push({name: key, value: result[0].results.clicksPerPage[key].length});
	        	}
        	}
        	if(result && result[0] && result[0].results && result[0].results.viewsPerListing && result[0].results.viewsPerListing.cars){
	        	for (var key in result[0].results.viewsPerListing.cars) {
	        		userAnalyticsListingViewCar.push({name: key, value: result[0].results.viewsPerListing.cars[key].length});
	        	}
        	}
        	if(result && result[0] && result[0].results && result[0].results.viewsPerListing && result[0].results.viewsPerListing.hotels){
	        	for (var key in result[0].results.viewsPerListing.hotels) {
	        		userAnalyticsListingViewHotel.push({name: key, value: result[0].results.viewsPerListing.hotels[key].length});
	        	}
        	}
        	if(result && result[0] && result[0].results && result[0].results.viewsPerListing && result[0].results.viewsPerListing.flights){	        	
	        	for (var key in result[0].results.viewsPerListing.flights) {
	        		userAnalyticsListingViewFlight.push({name: key, value: result[0].results.viewsPerListing.flights[key].length});
	        	}
        	}
        	if(result && result[0] && result[0].results && result[0].results.userActivityTracking){
	        	for (var key in result[0].results.userActivityTracking) {
	        		if(i==10) break;
	        		var tempObj = {};
	        		tempObj.name = key;
	        		var car=0, hotel=0, flight=0, carListing=0, hotelListing=0, flightListing=0, profile=0, paymentMethods=0, checkout=0, booking=0, home=0;
	        		var pageName = "";
	        		for(var j=0; j<result[0].results.userActivityTracking[key].length; j++){
	        			if(result[0].results.userActivityTracking[key][j].page!=undefined){
	        				pageName = result[0].results.userActivityTracking[key][j].page.replace('/', '');
	        				if(pageName==""){
	                			tempObj["Home-"+home+"-visit"]=result[0].results.userActivityTracking[key][j].duration;
	                			home++;
	        				} else if(pageName=="cars"){
	                			tempObj["Cars-"+car+"-visit"]=result[0].results.userActivityTracking[key][j].duration;
	                			car++;
	        				} else if(pageName=="hotels"){
	        					tempObj["Hotels-"+hotel+"-visit"]=result[0].results.userActivityTracking[key][j].duration;
	        					hotel++;
	        				} else if(pageName=="flights"){
	        					tempObj["Flights-"+flight+"-visit"]=result[0].results.userActivityTracking[key][j].duration;
	        					flight++;
	        				} else if(pageName=="cars/listings"){
	                			tempObj["Car-listing-"+carListing+"-visit"]=result[0].results.userActivityTracking[key][j].duration;
	                			carListing++;
	        				} else if(pageName=="hotels/listings"){
	        					tempObj["Hotel-listing-"+hotelListing+"-visit"]=result[0].results.userActivityTracking[key][j].duration;
	        					hotelListing++;
	        				} else if(pageName=="flights/listings"){
	        					tempObj["Flight-listing-"+flightListing+"-visit"]=result[0].results.userActivityTracking[key][j].duration;
	        					flightListing++;
	        				} else if(pageName=="user/profile"){
	                			tempObj["Profile-"+profile+"-visit"]=result[0].results.userActivityTracking[key][j].duration;
	                			profile++;
	        				} else if(pageName=="user/paymentMethods"){
	        					tempObj["Payment-methods-"+paymentMethods+"-visit"]=result[0].results.userActivityTracking[key][j].duration;
	        					paymentMethods++;
	        				} else if(pageName=="user/bookings"){
	        					tempObj["Bookings-"+booking+"-visit"]=result[0].results.userActivityTracking[key][j].duration;
	        					flightListing++;
	        				} else if(pageName.includes("checkout")){
	        					tempObj["Checkout-"+checkout+"-visit"]=result[0].results.userActivityTracking[key][j].duration;
	        					checkout++;
	        				}
	        			}
	        		}
	        		userActivityTracking.push(tempObj);
	        		i++;
	        	}
        	}
        	userAnalyticsPageClicks.sort(function(a, b) { return b.value - a.value; });
        	userAnalyticsListingViewCar.sort(function(a, b) { return b.value - a.value; });
        	userAnalyticsListingViewHotel.sort(function(a, b) { return b.value - a.value; });
        	userAnalyticsListingViewFlight.sort(function(a, b) { return b.value - a.value; });
            res.code = 200  ;
            res.message = "Success";
            res.data = {};
            res.data.userAnalyticsPageClicks = userAnalyticsPageClicks;
            res.data.userAnalyticsListingViewCar = userAnalyticsListingViewCar;
            res.data.userAnalyticsListingViewHotel = userAnalyticsListingViewHotel;
            res.data.userAnalyticsListingViewFlight = userAnalyticsListingViewFlight;
            res.data.userActivityTracking = userActivityTracking;
            callback(null , res) ;
        }
    });
}

exports.trackTotalDurationSpent = trackTotalDurationSpent;
exports.getRevenueByType = getRevenueByType;
exports.getRevenueByCity = getRevenueByCity;
exports.getRevenueByTopCmpny = getRevenueByTopCmpny;
exports.trackClick = trackClick;
exports.trackCarPageViews = trackCarPageViews;
exports.trackHotelPageViews = trackHotelPageViews;
exports.getUserAnalytics = getUserAnalytics;
exports.trackFlightPageViews = trackFlightPageViews;
