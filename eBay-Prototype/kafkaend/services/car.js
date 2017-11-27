var validator = require('validator');
var ObjectID = require('mongodb').ObjectID;
var carModel = require('../models/car.js');
var analytics = require('./analytics');

//Redis
var redisClient = require('redis').createClient;
var redis = redisClient(6379, 'localhost');


function addCar(msg, callback){
    var res = {};

    
    if(validator.isNumeric( msg.carQuantity) && validator.isNumeric( msg.dailyRentalValue) && validator.isNumeric( msg.occupancy) )
    {
        var _date = new Date();
        msg.createdDate = _date;
        msg.updatedDate = _date ;
        msg.carQuantity = parseInt(msg.carQuantity) ;
        msg.dailyRentalValue = parseInt(msg.dailyRentalValue) ;
        msg.occupancy = parseInt(msg.occupancy) ;
        msg.is_deleted = false ;

        var serviceDays = (new Date(msg.serviceEndDate)- new Date(msg.serviceStartDate))/(1000*60*60*24) ;



        var availabilityDateObject = [] ;
        for(var i=0 ; i <= serviceDays ; i++){
            var date = new Date(new Date(msg.serviceStartDate).setUTCHours(0,0,0,0));
            date.setDate(date.getDate() + i);
            availabilityDateObject.push({availabilityDate : date , availableCars : msg.carQuantity})
        }

        msg.availability = availabilityDateObject ;

        




        var newCar = new carModel(msg);

        newCar.save(function (err) {
            if(err) {
                res.code = 500 ;
                res.message = "Error occured while registering a car with server";
                callback(null , res);
            } else {
                res.code = 200  ;
                res.message = "Success";
                callback(null , res) ;
            }
        });
    }else{
        res.code = 400;
        res.message = "Please pass the correct Parameteres";
        callback(null, res);
    }
}

function getCars(msg, callback){
    var res = {};
    carModel.find({ is_deleted : false}, function(err, result){
        if(err){
            res.code = 500  ;
            res.message = "Fail to get all Cars from the server"
            callback(null , res) ;
        }else{
            res.code = 200  ;
            res.message = "Success"
            res.data = result
            callback(null , res) ;
        }
    });
}

function getCarById(msg, callback){
    var res = {};
    idToGet = new ObjectID(msg.id) ;
    carModel.find({ is_deleted : false , _id : idToGet }).lean().exec(function(err, result){
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

function updateCarById(msg, callback){
    var res = {};
    idToUpdate = new ObjectID(msg._id) ;

    msg.updatedDate = new Date() ;

    var serviceDays = (new Date(msg.serviceEndDate)- new Date(msg.serviceStartDate))/(1000*60*60*24) ;

    var availabilityDateObject = [] ;
    for(var i=0 ; i <= serviceDays ; i++){
        var date = new Date(msg.serviceStartDate) ;
        date.setDate(date.getDate() + i);
        availabilityDateObject.push({availabilityDate : date , availableCars : msg.carQuantity})
    }

    msg.availability = availabilityDateObject ;



    carModel.update({is_deleted : false , _id : idToUpdate }, msg, { multi: false }, function(err , response){
        if(err){
            res.code = 500 ;
            res.message = "Error occured while updating  a car";
            callback(null , res);
        }else{
            res.code = 200  ;
            res.message = "Success";
            callback(null , res) ;
        }
    })
}

function deleteCarById(msg, callback){
    var res = {};
    if(!validator.isEmpty(msg.idToDelete)){
        var idToDelete = new ObjectID(msg.idToDelete) ;
        carModel.update({is_deleted : false , _id : idToDelete }, { $set: {is_deleted: true, updatedDate: new Date() }}, { multi: false }, function(err , response){
            if(err){
                res.code = 500 ;
                res.message = "Error occured while deleting a hotel"
                callback(null , res);
            }else{
                res.code = 200  ;
                res.message = "Success"
                callback(null , res) ;
            }
        })
    }else{
        res.code = 400;
        res.message = "Please pass the correct Parameteres";
        callback(null, res);
    }
}

function getCarsForCustomer(msg, callback){
    var res = {};
    var parts = msg.queryParams.startDate.split("-");
    var startDate = new Date(parts[2]+"-"+parts[0]+"-"+parts[1]);
    parts = msg.queryParams.endDate.split("-");
    var endDate = new Date(parts[2]+"-"+parts[0]+"-"+parts[1]);


    var query = {
                is_deleted : false,
                availability: {
                    $elemMatch: {
                        availableCars: {
                            $gte: 1
                        },
                        availabilityDate: {
                            $gte: startDate,
                            $lte: endDate
                        }
                    }
                }
            };


    if(msg.queryParams.luggage != undefined ){

        var priceRangeArray = [] ;
        priceRangeArray.push(parseInt(msg.queryParams.minPrice));
        priceRangeArray.push(parseInt(msg.queryParams.maxPrice));



        var lugaggesArray = msg.queryParams.luggage.split(',')
        var occupantsArray = msg.queryParams.occupants.split(',')
        var categoryArray = msg.queryParams.category.split(',')


        if(priceRangeArray.length == 2){
            query.dailyRentalValue = { $gte : priceRangeArray[0]  , $lte: priceRangeArray[1] }
        }

        if(( lugaggesArray.length == 1 && lugaggesArray[0] == '' )) {
            lugaggesArray = []
        }else if(lugaggesArray.length > 0){
            query.luggage  =  { "$in" : lugaggesArray}
        }

        if( occupantsArray.length == 1 && occupantsArray[0] == '' ){
            occupantsArray = []
        }else if(occupantsArray.length > 0 ){
            query.occupancy =  { "$in" : occupantsArray }
        }

        if( categoryArray.length == 1 && categoryArray[0] == '' ){
            categoryArray = []
        }else if(categoryArray.length > 0){
            query.carType = {"$in" : categoryArray}
        }

    }

    var sortingObj = {};
    if(msg.queryParams.sort=="priceHtoL"){
        sortingObj["dailyRentalValue"] = -1;
    } else {
        sortingObj["dailyRentalValue"] = 1;
    }

    var options = {
        select: 'carType carName occupancy luggage dailyRentalValue images carQuantity',
        lean: true,
        page: msg.queryParams.pageNo || 1,
        limit: 20,
        sort: sortingObj
    };

    var redisKey= {
       options : options ,
       query : query 
    }




    redis.get( JSON.stringify(redisKey)  , function(err , reply){
       if(!err && reply != null){
            
               res.code = 200  ;
               res.message = "Success";
               res.data = JSON.parse(reply);
           analytics.trackCarPageViews(res.data);
               callback(null , res) ;
       }else{
           
           carModel.paginate(query,options, function(err, result){
               if(err){
                   res.code = 500  ;
                   res.message = "Fail to get all hotels from the server";
                   callback(null , res) ;
               }else{
                   redis.set( JSON.stringify(redisKey)  , JSON.stringify(result)  , 'EX', 30 , function () {
                       res.code = 200  ;
                       res.message = "Success";
                       res.data = result;
                       analytics.trackCarPageViews(result);
                       callback(null , res) ;
                   });
               }
           });
       }
   })
}

function getCarByIdForCustomer(msg, callback){
    var res = {};
    idToGet = new ObjectID(msg.id) ;
    carModel.find({ is_deleted : false , _id : idToGet }).lean().exec(function(err, result){
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

exports.addCar = addCar;
exports.getCars = getCars;
exports.getCarById = getCarById;
exports.updateCarById = updateCarById;
exports.deleteCarById = deleteCarById;
exports.getCarsForCustomer = getCarsForCustomer;
exports.getCarByIdForCustomer = getCarByIdForCustomer;
