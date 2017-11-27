var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate');

var carSchema = new mongoose.Schema({
	id : String,
    carType : String,
    carName : String,
    carQuantity : Number,
    serviceStartDate : Date,
    serviceEndDate : Date,
    occupancy : Number,
    luggage : String,
    dailyRentalValue : Number,
    createdDate: Date,
    updatedDate : Date,
    is_deleted : Boolean,
    availability : [{ availabilityDate : Date, availableCars : Number }],
    images : [String],
    carCity : String
})

carSchema.plugin(mongoosePaginate);
    
module.exports = mongoose.model('car', carSchema);