var LocalStrategy = require("passport-local").Strategy;
var kafka = require('./kafka/client');

var config = require('config');
var topic = config.kafkaTopic;

module.exports = function(passport) {
    //normal signin
    passport.use('local-adminSignIn', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
    }, function(username,password,done) {
        process.nextTick(function() {
            try {
                kafka.make_request(topic,'signin',{
                    email:username,
                    password:password,
                    role: 'ADMIN'
                },function(err,res){
                    if(err){
                        done(err);
                    } else {
                        done(null,res);
                    }
                });
            } catch (e) {
                done(e);
            }
        });
    }));

    passport.use('local-customerSignIn', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
    }, function(username,password,done) {
        process.nextTick(function() {
            try {
                kafka.make_request(topic,'signin',{
                    email:username,
                    password:password,
                    role: 'USER'
                },function(err,res){
                    if(err){
                        done(err);
                    } else {
                        done(null,res);
                    }
                });
            } catch (e) {
                done(e);
            }
        });
    }));

    //normal signup
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback: true
    }, function(req,username,password,done) {
        process.nextTick(function() {
            try {
                kafka.make_request(topic,'signup',{
                    email: req.body.email,
                    password:req.body.password,
                    firstName:req.body.firstName,
                    lastName:req.body.lastName
                },function(err,res){
                    if(err){
                        done(err);
                    } else {
                        done(null,res);
                    }
                });
            } catch (e) {
                done(e);
            }
        });
    }));

    passport.serializeUser(function(user, done){
        done(null, user);
    })

    passport.deserializeUser(function(user, done){
        done(null,user);
    })
};


