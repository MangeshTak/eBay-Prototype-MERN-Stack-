var mongoose = require("mongoose");

var billingSchema = new mongoose.Schema({
    id : String,
    listingType: String,
    listingId:mongoose.Schema.ObjectId,
    bookingId:mongoose.Schema.ObjectId,
    userId:String,
    totalAmount:Number,
    createdDate:Date,
    creditCardId:mongoose.Schema.ObjectId,
    revenueGeneratingCity:String
})

module.exports = mongoose.model('billings', billingSchema);