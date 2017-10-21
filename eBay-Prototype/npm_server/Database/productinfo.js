const {mongoose} = require('./mongodbconnect.js');

var ProductSchema = new mongoose.Schema({
	Name: {
		type: String,
		require: true
	},

	Description: {
		type: String,
		require: true
	},

	Price: {
		type: Number,
		require: true
	},

	NumberOfItems: {
		type: Number,
		require: true
	}
});


var productinfo = mongoose.model('Products', ProductSchema);

module.exports = {productinfo};