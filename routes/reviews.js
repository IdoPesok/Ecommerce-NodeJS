const express = require("express");
const router = express.Router({mergeParams: true});
const mongoose = require("mongoose");
const Product = require("../models/product");
const middleware = require("../middleware");
const Review = require("../models/review")


router.get("/new", middleware.isLoggedIn, function(req, res) {
	Product.findById(req.params.id, function(err, foundProduct) {
		if (err) {
			res.send("error", err)
			return
		}

		res.render("reviews/new", {product: foundProduct})
	})
})

router.post("/", middleware.isLoggedIn, function(req, res) {
	var review = getReviewFromRequest(req)

    Review.create(review, function(err, createdReview) {
    	if (err) {
    		res.send("error", err)
    		return
    	}

    	Product.findById(req.params.id, function(err, foundProduct) {
    		if (err) {
    			res.send("error", err)
    			return
    		}

    		foundProduct.reviews.push(createdReview.id)
    		foundProduct.save()

    		res.redirect("/products/" + req.params.id)
    	})
    })
})

router.get("/:review_id/edit", middleware.checkReviewOwner, function(req, res) {
    Review.findById(req.params.review_id, function(err, foundReview) {
    	if (err) {
    		res.send("error", err)
    		return
    	}

    	Product.findById(req.params.id, function(err, foundProduct) {
    		if (err) {
    			res.send("error", err)
    			return
    		}

    		res.render("reviews/edit", {product: foundProduct, review: foundReview})
    	})
    })
})

router.put("/:review_id", middleware.checkReviewOwner, function(req, res) {
	var review = getReviewFromRequest(req)

    Review.findByIdAndUpdate(req.params.review_id, review, function(err, updatedComment) {
        if (err) {
            res.send("error", err)
            return
        }

        res.redirect("/products/" + req.params.id)
    })
})

router.delete("/:review_id", middleware.checkReviewOwner, function(req, res) {
    Review.findByIdAndRemove(req.params.review_id, function(err) {
        if (err) {
            console.log("error", err)
            return
        }

        res.redirect("/products/" + req.params.id)
    })
})

function getReviewFromRequest(req) {
	var review = {
		text: req.body.text,
		author: {
			id: req.user.id,
			username: req.user.username
		}
	}

	return review
}


module.exports = router