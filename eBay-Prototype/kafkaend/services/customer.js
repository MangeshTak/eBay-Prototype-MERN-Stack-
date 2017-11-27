var userModel = require('../models/authUsers.js');
var mongo = require('./mongo');
var validator = require('validator');
var ObjectID = require('mongodb').ObjectID;

function getCustomers(msg, callback){
    var res = {};
    userModel.find({is_deleted : false}, function(err, result){
    	if(err){
			res.code = 500  ; 
			res.status  = 500 ; 
			res.message = "Fail to get all users from the server"
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

function getCustomerById(msg, callback){
    var res = {};
    res.code = 200;
    res.message = "Success";
    callback(null, res);
}

function updateCustomerById(msg, callback){
    var res = {};
    res.code = 200;
    res.message = "Success";
    callback(null, res);
}

function deleteCustomerById(msg, callback){
	var res = {};
    var idToDelete = new ObjectID(msg.idToDelete) ;
    if(!validator.isEmpty(msg.idToDelete)){
    	userModel.update({is_deleted : false , _id : idToDelete }, { $set: {is_deleted: true }}, { multi: false }, function(err , response){
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

exports.getCustomers = getCustomers;
exports.getCustomerById = getCustomerById;
exports.updateCustomerById = updateCustomerById;
exports.deleteCustomerById = deleteCustomerById;