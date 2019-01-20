const express = require("express");
const router = express.Router({mergeParams: true});
const mongoose = require("mongoose");
const Product = require("../models/product");
const middleware = require("../middleware");


router.get("/", middleware.isLoggedIn, function(req, res) {
	var products = []
	var count = 0

	req.user.cart.forEach(function(p) {
		Product.findById(p.product_id, function(err, foundProduct) {
			if (err) {
				console.log("Error", err)
				return
			}

			foundProduct.cart_index = count
			foundProduct.quantity = p.quantity
			products.push(foundProduct)


			count += 1
			if (count == req.user.cart.length) {
				res.render("carts/index", {products: products})
			}
		})
	})
})

router.get("/:id/add", middleware.isLoggedIn, function(req, res) {
	var loop = 0
	var quantity_changed = false

	// Check if product was already added
	// If so, increase quantity
	for (var i = 0; i < req.user.cart.length; i++) {
		if (req.user.cart[i].product_id == req.params.id) {
			req.user.cart[i].quantity += 1
			quantity_changed = true
		}
		loop += 1
	}

	// wait until the loop has finished
	while (loop != req.user.cart.length) {}

	if (quantity_changed == false) {
		req.user.cart.push({
			product_id: req.params.id,
			quantity: 1
		})
	}

    req.user.save(function(err) {
    	if (err) {
    		res.send("error", err)
    		return
    	}

    	res.redirect("/cart")
    })
})

router.post("/:cart_index/del", middleware.isLoggedIn, function(req, res) {
	var cart_index = req.params.cart_index

    if (cart_index > req.user.cart.length - 1) {
		console.log("error")
    	res.send("error")
    } else {
    	req.user.cart.splice(cart_index, 1)
    	req.user.save(function(err) {
    		if (err) {
    			console.log("error")
		    	res.send("error")
		    	return
    		}

    		res.redirect("/cart")
    	})
    }
})


module.exports = router