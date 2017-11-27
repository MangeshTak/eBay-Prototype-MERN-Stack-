var mysql = require('./mysql');
var validator = require('validator');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var userModel = require('../models/authUsers.js');

const saltRounds = 10;

function signin(msg, callback){
    var res = {};
    if(validator.isEmail(msg.email) && validator.isByteLength(msg.password, {min: 5})) {
        mysql.query("select id, username, email, role, password from auth_user where email =" + "'" + msg.email + "';", function (err, result) {
            if (err) throw err;
            if(result[0]) {
                var user = result[0];
                if(user.role== 'USER' && user.role != msg.role) {
                    res.code = 401;
                    res.message = "Unauthorized user";
                    callback(null, res);
                }
                bcrypt.compare(msg.password, user.password, function(err,result) {
                    if(result) {
                        res.code = 200;
                        res.message = "Success";
                        res.data = {_id:user.id,username:user.email,role:user.role};
                    } else {
                        res.code = 401;
                        res.message = "Invalid password";
                    }
                    callback(null, res);
                });
            } else {
                res.code = 401;
                res.message = "Invalid email";
                callback(null, res);
            }
        });
    } else {
        res.code = 400;
        res.message = "Fields did not pass the validation";
        callback(null, res);
    }
}

function signup(msg, callback){
    var res = {};
    
    if(validator.isEmail(msg.email) && validator.isByteLength(msg.password, {min: 5}) && validator.isByteLength(msg.firstName, {min: 1}) && validator.isByteLength(msg.lastName, {min: 1})) {
        
    	mysql.query("select id, username, email, role, password from auth_user where email =" + "'" + msg.email + "';", function (err, result) {
            if (err) throw err;
            if(result[0]) {
                res.code = 409;
                res.message = "User already exists";
                callback(null, res);
            } else {
                bcrypt.hash(msg.password, saltRounds, function(err, hash) {

                  var id = crypto.randomBytes(20).toString('hex');
                  mysql.query("INSERT INTO auth_user (id, email, password, username, role)  VALUES ('" + id + "'" + "," + "'" + msg.email + "'" + " , " + "'" + hash + "'" + " , " + "'" + msg.email + "'" + " , " + "'USER'" + ");", function(err, result) {
                    if(err) {
                    	
                      res.code = 500;
                      res.message = "Internal server error";
                      callback(null, res);
                    } 
                    else {
                    	
                      msg.is_deleted = false;
                      msg.auth_user_id = id;
                      msg.address='';
                      msg.city='';
                      msg.state='';
                      msg.zip_code='';
                      msg.phone_number='';
                     
                      var newUser = new userModel(msg);
                      newUser.save(function (err) {
                                if(err) {
                                	
                                    res.code = 500 ;
                                    res.message = "Error occured while registering a hotel with server"
                                    callback(null , res);
                                } else {
                                    res.code = 200  ;
                                    res.message = "Success";
                                    res.data = {_id: newUser.auth_user_id, username:msg.email, role: 'USER'};
                                    callback(null , res) ;
                                }
                       });
                        }
                    })
                })
            }
        })
    } else {
        res.code = 400;
        res.message = "Fields missing";
        callback(null, res);
    }
}

exports.signin = signin;
exports.signup = signup;
