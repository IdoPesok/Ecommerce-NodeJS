const express = require("express");
const router = express.Router({mergeParams: true});
const mongoose = require("mongoose");
const Product = require("../models/product");
const middleware = require("../middleware");


router.get("/", function(req, res) {
	Product.find({}, function(err, foundProducts) {
		if (err) {
			console.log("Error", err)
			return
		}

		res.render("products/index", {products: foundProducts})
	})
})

router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("products/new")
})

router.post("/", middleware.isLoggedIn, function(req, res) {
	var product = getProductFromRequest(req);

    Product.create(product, function(err, createdProduct) {
    	if (err) {
    		console.log("Error", err)
    		return
    	}

    	res.redirect("/")
    })
})

router.get("/:id", function(req, res) {
    Product.findById(req.params.id).populate("reviews").exec(function(err, foundProduct) {
    	if (err) {
    		res.send("error, page not found")
    		console.log("ERROR", err)
    		return
    	}

    	res.render("products/show", {product: foundProduct})
    })
})

router.get("/:id/edit", middleware.checkProductOwner, function(req, res) {
    Product.findById(req.params.id, function(err, foundProduct) {
    	if (err) {
    		res.send("error, page not found")
    		console.log("ERROR", err)
    		return
    	}

    	res.render("products/edit", {product: foundProduct})
    })
})

router.put("/:id", middleware.checkProductOwner, function(req, res) {
	var product = getProductFromRequest(req)
    Product.findByIdAndUpdate(req.params.id, product, function(err, updatedProdcut) {
    	if (err) {
    		console.log("ERROR", err)
    		return
    	}

    	res.redirect("/products/" + req.params.id)
    })
})

router.delete("/:id", middleware.checkProductOwner, function(req, res) {
    Product.findByIdAndRemove(req.params.id, function(err) {
    	if (err) {
    		res.send("error")
    		console.log("ERROR", err)
    		return
    	}

    	res.redirect("/products")
    })
})

function getProductFromRequest(req) {
	var product = {
		name: req.body.name,
		description: req.body.description,
		image: req.body.image,
		price: req.body.price,
		storename: req.user.storename
	}

	return product
}

module.exports = router