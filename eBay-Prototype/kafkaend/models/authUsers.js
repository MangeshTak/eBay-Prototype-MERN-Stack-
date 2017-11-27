var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
	is_deleted: Boolean,
    id : String,
    auth_user_id : String,
    firstName : String,
    lastName : String,
    address: String,
    city: String,
    state: String,
    zip_code: String,
    phone_number: Number,
    profile_image: String,
    role: String,
    email: String

});

module.exports = mongoose.model('users', userSchema);
