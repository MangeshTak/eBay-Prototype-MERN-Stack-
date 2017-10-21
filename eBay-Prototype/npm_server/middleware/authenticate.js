var {user} = require('./../Database/user');

var authenticate = (req, res, next) => {
	//var token = req.header('x-auth');
	var token = req.body.token;
	console.log(token);
	user.findByToken(token).then((ret_user) => {
		if(!ret_user) {
			return Promise.reject();
		}
		req.user=ret_user;
		req.token=token;
		next();
	}).catch((e) => {
		res.status(401).send();
	});
};

module.exports = {authenticate};