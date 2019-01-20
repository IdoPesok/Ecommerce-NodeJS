const mongoose = require("mongoose");
const Schema = mongoose.Schema;


var reviewSchema = new Schema({
	text: String,
	author: {
		id: {
			type: Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
})
var Review = mongoose.model("Review", reviewSchema)


module.exports = Review
