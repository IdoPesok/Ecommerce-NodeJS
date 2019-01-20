const mongoose = require("mongoose");
const Schema = mongoose.Schema;


var productSchema = new Schema({
	name: String,
	description: String,
	image: String,
	price: Number,
	storename: String,
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: "Review"
		}
	]
})
var Product = mongoose.model("Product", productSchema)


module.exports = Product