var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate');

var hotelSchema = new mongoose.Schema({
	id : String,
	hotelName : String,
	hotelAddress : String,
	hotelCity : String,
	hotelZip : Number,
	hotelPhoneNumber : Number,
  hotelEmail: String,
  hotelStar : Number,
  hotelRating : Number,
  hotelAmenities : [String],
  hotelRooms : [{ roomType : String, priceTotal : Number, totalAvailable : Number, personPerRoom : Number}],
  is_deleted : Boolean,
  serviceStartDate : Date,
  serviceEndDate : Date,
  availability : [{ availableDate: Date, hotelRooms : [{ roomType : String, priceTotal : Number, totalAvailable : Number, personPerRoom : Number}] } ],
  images : [String],
  hotelMinPrice: Number,
  hotelMaxPrice: Number
});

hotelSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('hotel', hotelSchema);
