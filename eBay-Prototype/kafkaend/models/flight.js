var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate');

var flightSchema = new mongoose.Schema({
	
    id : String,
    flightNumber : String ,
	airline : String ,
	source : String ,
	destination : String ,
	arrival : String ,
	departure : String ,
	
	createdDate: Date,
    updatedDate : Date,
    is_deleted : Boolean,

    serviceStartDate : Date,
    serviceEndDate : Date , 

    firstClassPrice: Number , 
    firstClassSeats: Number , 
    economyClassPrice: Number ,
    economyClassSeats: Number ,
    businessClassPrice: Number,
    businessClassSeats: Number ,  
    meals : Boolean,
    luggage : Number , 
    availability : [{
    					availabilityDate : Date  , sections : [{class : String , price : Number , available : Number}]
    				}],
	
});

flightSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('flight', flightSchema);