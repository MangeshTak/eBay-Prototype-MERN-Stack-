var ObjectID = require('mongodb').ObjectID;
var validator = require('validator');
var bookingModel = require('../models/booking.js');
var billingModel = require('../models/billing.js');
var userModel = require('../models/authUsers.js');
var carModel = require('../models/car.js');
var creditCardModel = require('../models/creditCard.js')
var flightModel = require('../models/flight.js');
var hotelModel = require('../models/hotel.js');
var moment  =  require('moment');

function getBills(msg, callback){

   
    var res = {};

    var objToFInd = {};

    if(msg.category === 'date' || msg.category === "all"){
         if(msg.category === 'date'){
            var dateToFind = new Date(msg.param) ; 
            
            var sod = moment(dateToFind).startOf('day').utcOffset(0); ;
            sod.set({hour:0,minute:0,second:0,millisecond:0})
            sod.toISOString()
            sod.format() ;


            var eod = moment(dateToFind).add(1, 'days').utcOffset(0);
            eod.set({hour:0,minute:0,second:0,millisecond:0})
            eod.toISOString()
            eod.format() ;

            objToFInd.createdDate = { $gte: sod.toDate(),
                                      $lt: eod.toDate()
                                     } 
          }

          billingModel.find( objToFInd ,  function(err, result){
              if(err){
                res.code = 500 ;
                res.status  = 500 ;
                res.message = "Fail to get all bills from the server"
                callback(null , res) ;
              }else{
                res.code = 200  ;
                res.status  = 200 ;
                res.message = "Success"
                res.data = result;
                callback(null , res) ;
              }
          });
    }else if(msg.category == "month"){

      console.log(msg.param)
      var monthAndYearArray = msg.param.split(" ");
      console.log(monthAndYearArray) ; 

      billingModel.aggregate(  [
                                 {
                                   $project:
                                     {
                                       bookingId : "$bookingId",
                                       listingType : "$listingType",
                                       totalAmount : "$totalAmount",
                                       createdDate: "$createdDate",
                                       year: { $year: "$createdDate" },
                                       month: { $month: "$createdDate" }
                                     }
                                 },
                                 { $match : { "month" : parseInt(monthAndYearArray[0]), "year": parseInt(monthAndYearArray[1]) } }
                               ]  ,  function(err, result){
              if(err){
                res.code = 500 ;
                res.status  = 500 ;
                res.message = "Fail to get all bills from the server"
                callback(null , res) ;
              }else{
                console.log(result)
                res.code = 200  ;
                res.status  = 200 ;
                res.message = "Success"
                res.data = result;
                callback(null , res) ;
              }
          });


    }

   
 


}

function getBillById(msg, callback){
    var res = {};
    var idToGet = new ObjectID(msg.id) ;
	if(!validator.isEmpty(idToGet.toString())){
		billingModel.findOne({ _id : idToGet }).lean().exec(function(err, result){
			if(err){
				res.code = 500 ;
				res.status  = 500;
				res.message = "Fail to get bill from the server";
				callback(null , res);
			}else{
				userModel.findOne({ auth_user_id : result.userId }, function(err, result0){
					result.userData = result0;
					if(err){
						res.code = 500 ;
						res.status  = 500;
						res.message = "Fail to get bill from the server";
						callback(null , res);
					} else {
						bookingModel.findOne({ _id : new ObjectID(result.bookingId) }, function(err, result1){
							if(err){
								res.code = 500 ;
								res.status  = 500;
								res.message = "Fail to get bill from the server";
								callback(null , res);
							} else {
                result.listingData = result1.bookingInfo;
								res.code = 200 ;
								res.status  = 200;
								res.message = "Success";
								res.data = result;
								callback(null , res);
							}
						});
					}
				});
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

function makeBooking(msg, callback){
    var res = {};
    var curr_date = new Date();
    var revenueGeneratingCity = "";
    
    if( msg.data.listingType === "cars"){
           var query = { is_deleted : false , _id : new ObjectID(msg.data.listingId) , 
                        availability : { $elemMatch : { 
                                                        availabilityDate : ''
                                                     }
                                       }
                       };
            var updateQuery = {
                              $inc : {
                                    "availability.$.availableCars" : -1
                              }
            }
          var startDate =  new Date(new Date(msg.data.bookingInfo.startDate).setUTCHours(0,0,0,0));
          var endDate = new Date(new Date(msg.data.bookingInfo.endDate).setHours(0,0,0,0));
          var serviceDays = ((endDate- startDate)/(1000*60*60*24))+1 ;
          for(var i =0 ; i < serviceDays ; i++){
            if(i != 0 ){
               startDate.setDate(startDate.getDate() + 1);
            }
            query.availability. $elemMatch.availabilityDate = startDate ; 
            carModel.update(query, updateQuery, { multi: false }, function(err , response){
            })
          }
          revenueGeneratingCity = msg.data.bookingInfo.city;
    } else if( msg.data.listingType === "hotels"){
          
      var idToGet = new ObjectID(msg.data.listingId);
      hotelModel.find({ is_deleted : false , _id : idToGet }).lean().exec(function(err, result){
        if(err){
          res.code = 500  ;
          res.message = "Fail to get all cars from the server"
          callback(null , res) ;
        }else{
          availabilityArray = result[0].availability;


          var startDate =  new Date(new Date(msg.data.bookingInfo.checkInDate).setUTCHours(0,0,0,0));
          var endDate = new Date(new Date(msg.data.bookingInfo.checkOutDate).setHours(0,0,0,0));
          var serviceDays = ((endDate- startDate)/(1000*60*60*24)) ;

          for(var i =0 ; i < serviceDays ; i++){
            var date = new Date(new Date(msg.data.bookingInfo.checkInDate).setUTCHours(0,0,0,0));
            date.setDate(date.getDate() + i);

            availabilityArray.forEach(function(singleAvailability){
              if((new Date(singleAvailability.availableDate)).getTime() ==   date.getTime() ){
                singleAvailability.hotelRooms.forEach(function(singleRoom){
                  if(singleRoom.roomType.toLowerCase() == msg.data.bookingInfo.roomType.toLowerCase()){
                    singleRoom.totalAvailable -= 1 ; 
                  }
                })
              }
            })

          }


          hotelModel.update({is_deleted : false , _id : idToGet }, { availability  : availabilityArray}, function(err , response){
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

        }
      })


      revenueGeneratingCity = msg.data.bookingInfo.city;
    } else if( msg.data.listingType === "flights"){

       var idToGet = new ObjectID(msg.data.listingId);
     
      flightModel.find({ is_deleted : false , _id : idToGet }).lean().exec(function(err, result){
        if(err){
          res.code = 500  ; 
          res.message = "Fail to get all flights from the server"
          callback(null , res) ; 
        }else{
          
          availabilityArray = result[0].availability;
          availabilityArray.forEach(function(singleAvailability){
            if((new Date(singleAvailability.availabilityDate)).getTime() ==   new Date(new Date(msg.data.bookingInfo.date).setUTCHours(0,0,0,0)).getTime() ){
              singleAvailability.sections.forEach(section => {
                if(section.class.toLowerCase() == msg.data.bookingInfo.cabin.toLowerCase()){
                  section.available -= 1 
                }

              }) 
            }
          })

          flightModel.update({is_deleted : false , _id : idToGet }, {availability : availabilityArray}, function(err , response){
              console.log(err , response) ; 
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
      })  


    	revenueGeneratingCity = msg.data.bookingInfo.source;
    }





    //TODO: first subtract availability based on category and travellers, take additional data from frontend if needed
    var booking = new bookingModel();
    booking.listingType = msg.data.listingType;
    booking.listingId = new ObjectID(msg.data.listingId);
    booking.userId = msg.userId;
    booking.bookingInfo = msg.data.bookingInfo;
    booking.createdDate = curr_date;
    booking.save(function (err, booking) {
        if (!err) {
            var billing = new billingModel();
            billing.listingType = msg.data.listingType;
            billing.listingId = new ObjectID(msg.data.listingId);
            billing.userId = msg.userId;
            billing.totalAmount = Number.parseFloat(msg.data.total);
            billing.createdDate = curr_date;
            billing.bookingId = new ObjectID(booking._id);
            billing.revenueGeneratingCity = revenueGeneratingCity;
            if(msg.data.paymentMethod === 'new'){
                if(msg.data.saveCard){
                    var card = new creditCardModel();
                    card.cardNumber = msg.data.cardNumber;
                    card.nameOnCard = msg.data.nameOnCard;
                    card.expiryDate = msg.data.expiryDate;
                    card.cvv = msg.data.cvv;
                    card.userId = msg.userId;
                    card.is_deleted = false;
                    card.save(function(err,card){
                       if(!err){
                           billing.creditCardId = new ObjectID(card._id);
                           billing.save(function(err){
                               if(!err){
                                   res.code = 200;
                                   res.message = "Success";
                                   callback(null, res);
                               } else {
                                   //TODO: delete booking
                                   //TODO: rollback availability
                                   res.code = 500;
                                   res.message = "Internal serve error";
                                   callback(null, res);
                               }
                           });
                       } else {
                           //TODO: delete booking
                           //TODO: rollback availability
                           res.code = 500;
                           res.message = "Internal serve error";
                           callback(null, res);
                       }
                    });
                } else {
                    //TODO: verify card
                    billing.save(function(err){
                        if(!err){
                            res.code = 200;
                            res.message = "Success";
                            callback(null, res);
                        } else {
                            //TODO: delete booking
                            //TODO: rollback availability
                            res.code = 500;
                            res.message = "Internal serve error";
                            callback(null, res);
                        }
                    });
                }
            } else {
                billing.creditCardId = new ObjectID(msg.data.selectedCreditCard);
                billing.save(function(err){
                    if(!err){
                        res.code = 200;
                        res.message = "Success";
                        callback(null, res);
                    } else {
                        //TODO: delete booking
                        //TODO: rollback availability
                        res.code = 500;
                        res.message = "Internal serve error";
                        callback(null, res);
                    }
                });
            }
        } else {
            //TODO: rollback availability
            res.code = 500;
            res.message = "Internal serve error";
            callback(null, res);
        }
    });
}

function getBookings(msg, callback){
    var res = {};
    var userid = msg.userId ; 
     billingModel.find({  userId : userid}, null,{sort: {createdDate: -1}}, function(err, result){
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

function getBookingById(msg, callback){
    var res = {};
    var data = {}


    

    billingModel.find({  userId : msg.userId , bookingId : msg.bookingId}, function(err, result){
        if(err){
            res.code = 500  ;
            res.message = "Fail to get all Cars from the server"
            callback(null , res) ;
        }else{
            
            data.billingId = result[0]._id ;
            data.bookingId = result[0].bookingId ; 
            data.date = result[0].createdDate ; 
            data.amount = result[0].totalAmount ; 
            data.commodity = result[0].listingType ;
           
           var creditCard = result[0].creditCardId ;  

            bookingModel.find({ _id : new ObjectID(data.bookingId)} , function(err , result1 ){
                if(err){
                    res.code = 500  ;
                    res.message = "Fail to get all Cars from the server"
                    callback(null , res) ;
                }else{
                  data.bookingInfo = result1[0].bookingInfo ;
                  var listingId = result1[0].listingId ; 

                  creditCardModel.find({_id : new ObjectID(creditCard)} , function(err , result2 ){
                      if(err){
                        res.code = 500  ;
                        res.message = "Fail to get all Cars from the server"
                        callback(null , res) ;
                      }else{
                        if(result2.length > 0 ){

                            if(data.commodity == "cars"){
                              carModel.find({ is_deleted : false , _id : new ObjectID(listingId) }).lean().exec(function(err, resultCar){
                                  if(err){
                                      res.code = 500  ;
                                      res.message = "Fail to get all cars from the server"
                                      callback(null , res) ;
                                  }else{
                                      if(result) {
                                        
                                          data.creditCard = result[0].cardNumber ;
                                          data.carName = resultCar[0].carName; 
                                          res.code = 200  ;
                                          res.message = "Success"
                                          res.data = data
                                          callback(null , res) ;
                                      } else {
                                          res.code = 500  ;
                                          res.message = "Fail to get all cars from the server"
                                          callback(null , res) ;
                                      }
                                  }
                              })
                            }
                            if(data.commodity == "flights"){
                              flightModel.find({ is_deleted : false , _id : new ObjectID(listingId) }).lean().exec(function(err, resultCar){
                                  if(err){
                                      res.code = 500  ;
                                      res.message = "Fail to get all cars from the server"
                                      callback(null , res) ;
                                  }else{
                                      if(result) {
                                         
                                         
                                         data.creditCard = result[0].cardNumber ;
                                          data.flightNumber = resultCar[0].flightNumber; 
                                           data.flightName = resultCar[0].airline; 
                                          res.code = 200  ;
                                          res.message = "Success"
                                          res.data = data
                                          callback(null , res) ;
                                      } else {
                                          res.code = 500  ;
                                          res.message = "Fail to get all cars from the server"
                                          callback(null , res) ;
                                      }
                                  }
                              })
                            }
                            if(data.commodity == "hotels"){
                              hotelModel.find({ is_deleted : false , _id : new ObjectID(listingId) }).lean().exec(function(err, resultCar){
                                  if(err){
                                      res.code = 500  ;
                                      res.message = "Fail to get all cars from the server"
                                      callback(null , res) ;
                                  }else{
                                      if(result) {
                                         
                                         
                                         data.creditCard = result[0].cardNumber ;
                                          data.hotelName = resultCar[0].hotelName; 
                                          
                                          res.code = 200  ;
                                          res.message = "Success"
                                          res.data = data
                                          callback(null , res) ;
                                      } else {
                                          res.code = 500  ;
                                          res.message = "Fail to get all cars from the server"
                                          callback(null , res) ;
                                      }
                                  }
                              })
                            }
                              
                          }else{
                             res.code = 200  ;
                              res.message = "Success"
                              res.data = data; 
                              callback(null , res) ;
                          }
                      }
                  })

                }
            })



           
        }
    });
}

exports.getBills = getBills;
exports.getBillById = getBillById;
exports.makeBooking = makeBooking;
exports.getBookings = getBookings;
exports.getBookingById = getBookingById;