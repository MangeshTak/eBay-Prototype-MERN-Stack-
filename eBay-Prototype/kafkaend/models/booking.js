var mongoose = require("mongoose");

var bookingSchema = new mongoose.Schema({
    id : String,
    listingType: String,
    listingId:mongoose.Schema.ObjectId,
    userId:String,
    bookingInfo:Object,
    createdDate:Date
})

module.exports = mongoose.model('bookings', bookingSchema);