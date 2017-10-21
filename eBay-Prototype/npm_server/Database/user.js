const {mongoose} = require('./mongodbconnect.js');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email'
		}
	},

	password: {
		type: String,
		require: true,
		minlength: 6
	},

	firstname: {
		type: String,
		require: true
	},

	lastname: {
		type: String,
		require: true
	},

	phonenumber: {
		type: Number,
		require: true,
		max: 9999999999
	},

	tokens: [{
		access: {
			type: String,
			required: true	
		},
		token: {
			type: String,
			required: true
		}
	}]
});


UserSchema.methods.generateAuthToken = function () {
	var User = this;
	var access = 'auth';
	var token = jwt.sign({_id: User._id.toHexString(),access}, 'abc123').toString();

	User.tokens.push({access, token});

	return User.save().then(() => {
		return token;
	});
};

UserSchema.methods.removeToken = function (token) {
	var user = this;
	
	return user.update({
		$pull: {
			tokens: {token}
		}
	});
};

UserSchema.statics.findByToken = function (token) {

	var User = this;
	var decoded;

	try {
		decoded = jwt.verify(token,'abc123');	
	} catch (e) {
		return new Promise((resolve, reject) => {
			reject();
		})
	}

	return User.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
};

var user = mongoose.model('User', UserSchema);

module.exports = {user};