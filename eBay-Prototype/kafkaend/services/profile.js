var userModel = require('../models/authUsers.js');
var creditCardModel = require('../models/creditCard.js');
var ObjectID = require('mongodb').ObjectID;


function getProfile(msg, callback){
    var res = {};
    userModel.find({ auth_user_id : msg.id}, function(err, result){
    	if(err){
    		res.code = 500  ;
			res.message = "Fail to get User Details from the server"
			callback(null , res) ; 
		}else{
			res.code = 200  ;
			res.message = "Success"
			res.data = result
			callback(null , res) ; 
		}
    });
}

function updateProfile(msg, callback){
	var res = {};
	idToUpdate = msg.auth_user_id ;
	delete msg.id;
	userModel.update({is_deleted : false , auth_user_id : idToUpdate }, {$set:msg}, { multi: false }, function(err , result){
        if(err){
            res.code = 500 ;
            res.message = "Error occured while updating Profle";
            callback(null , res);
        }else{
        	res.code = 200  ;
            res.message = "Success";
            callback(null , res) ;
        }
    })
}

function addCreditCard(msg, callback){
    var res = {};
    msg.creditCard.userId = msg.user_id;
    msg.creditCard.is_deleted = false;

    var cardModel = new creditCardModel(msg.creditCard)
    cardModel.save(function(err, result){
        if(err){
            res.code = 500  ;
            res.message = "Fail to get credit cards from the server";
            callback(null , res) ;
        }else{
            res.code = 200;
            res.message = "Success";
            callback(null, res);
        }
    });
}

function getCreditCards(msg, callback){
    var res = {};
    creditCardModel.find(
        {
            userId : msg.user_id ,
            is_deleted : false
        },{
            cardNumber:true
        }, function(err, result){
        if(err){
            res.code = 500  ;
            res.message = "Fail to get credit cards from the server";
            callback(null , res) ;
        }else{
            res.code = 200;
            res.message = "Success";
            res.data = result;
            callback(null, res);
        }
    });
}

function deleteCreditCardById(msg, callback){
    var res = {};
    
    creditCardModel.update({is_deleted: false , _id : new ObjectID(msg.cardId) , userId : msg.user_id}, {is_deleted : true }, { multi: false }, function(err , response){
        if(err){
            res.code = 500 ; 
            res.message = "Error occured while updating  a flight"
            callback(null , res); 
        }else{
            res.code = 200  ; 
            res.message = "Success"
            callback(null , res) ;  
        }
    })
}

exports.getProfile = getProfile;
exports.updateProfile = updateProfile;
exports.addCreditCard = addCreditCard;
exports.getCreditCards = getCreditCards;
exports.deleteCreditCardById = deleteCreditCardById;