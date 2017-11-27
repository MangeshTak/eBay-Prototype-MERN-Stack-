var kafka = require('./kafka/client');
module.exports = function(passport) {
	require('./passport.js')(passport);
	var module = {};

	module.adminSignIn = function(req,res, next){
		console.log('SIGN IN')
		passport.authenticate('local-adminSignIn', function(err,result) {
	        if(err) {
	        	console.log('ERROR')
	        	console.log(err)
	            return res.status(500).json({status:500,statusText:"Internal server error"});
	        }
	        if(result.code === 200) {
	        	req.session.passport = {user: result.data};
	        }
	        return res.status(result.code).json({status:result.code,statusText:result.message});
	    })(req, res, next);
	}

	module.customerSignIn = function(req,res, next){
		passport.authenticate('local-customerSignIn', function(err,result) {
	        if(err) {
	            return res.status(500).json({status:500,statusText:"Internal server error"});
	        }
	        if(result.code === 200) {
	        	req.session.passport = {user: result.data};
	        }
	        return res.status(result.code).json({status:result.code,statusText:result.message});
	    })(req, res, next);
	}

	module.signup = function(req,res){
		passport.authenticate('local-signup', function(err,result) {
			if(err) {
				return res.status(500).json({status:500,statusText:"Internal server error"});
	        }
	        if(result.code === 200) {
	        	req.session.passport = {user: result.data};
	        }
	        return res.status(result.code).json({status:result.code,statusText:result.message});
	    })(req, res);
	}

	module.checkSession = function(req,res){
		res.status(200).json({status:200,statusText:"Success",data:{username:req.user.username}});
	}

	module.logout = function(req,res){
		req.session.destroy();
    	res.status(200).json({status:200,statusText:"Success"});
	}

	return module;
}
