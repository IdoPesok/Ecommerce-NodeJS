const express = require("express");
const router = express.Router({mergeParams: true});
const mongoose = require("mongoose");
const Product = require("../models/product");
const middleware = require("../middleware")


router.get("/:storename", function(req, res) {
	Product.find({'storename': req.params.storename}, function(err, foundProducts) {
		if (err) {
			res.send("ERROR")
			console.log(err)
			return
		}

		res.render("stores/index", {products: foundProducts, storename: req.params.storename})
	})    
})


module.exports = router