const Product = require("../models/product");
const Review = require("../models/review");

var middleware = {}

middleware.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		next()
	} else {
		res.redirect("/login")
	}
}

middleware.checkProductOwner = function(req, res, next) {
	if (req.isAuthenticated()) {
		Product.findById(req.params.id, function(err, foundProduct) {
			if (!err) {
				if (foundProduct.storename == req.user.storename) {
					next()
				} else {
					res.send("error, you do not have permession to do that")
				}
			} else {
				res.send("error", err)
			}
		})
	} else {
		res.redirect("/login")
	}
}

middleware.checkReviewOwner = function(req, res, next) {
	if (req.isAuthenticated()) {
		Review.findById(req.params.review_id, function(err, foundReview) {
			if (err) {
				console.log("ERROR", err)
				res.redirect("back")
				return
			}

			if (foundReview.author.id.equals(req.user.id)) {
				next()
			} else {
				console.log("ERROR, you do not own this review")
				res.redirect("back")
			}
		})
	} else {
		res.redirect("/login")
	}
}


module.exports = middleware