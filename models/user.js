const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");


var userSchema = new Schema({
	username: String,
	storename: String,
	cart: [
		{
			product_id: String,
			quantity: Number
		}
	],
	password: String
})
userSchema.plugin(passportLocalMongoose)
var User = mongoose.model("User", userSchema)


module.exports = User