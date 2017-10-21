const {mongoose} = require('./mongodbconnect.js');

var cartSchema = new mongoose.Schema({
	
	ProductName: {
		type: String,
		require: true
	},

	BasePrice: {
		type: Number,
		require: true
	},

	TotalPrice: {
		type: Number,
		require: true
	},

	NumberOfItems: {
		type: Number,
		require: true
	},

	user_id: {
		type: String,
		require: true
	}

});


var Cart = mongoose.model('Cart', cartSchema);

module.exports = {Cart};