const express = require("express");
const router = express.Router({mergeParams: true});
const Product = require("../models/product");


router.get("/", function(req, res) {
	products = []

	if (typeof req.query.search != "undefined") {
		var search = req.query.search
		const search_regexp = new RegExp(escapeRegex(search), "gi")
		var query = {}
		
		if (typeof search == "string") {
			query = {
				$or: [
					{ "name": search_regexp },
					{ "description": search_regexp },
					{ "image": search_regexp },
					{ "storename": search_regexp }
				]
			}
		} else {
			query = {
				"price": search_regexp
			}
		}

		Product.find(query, function(err, foundProducts) {
			if (err) {
				console.log("ERROR", err)
				return
			}

			products = foundProducts
			loadPage()
		})
	} else {
		loadPage()
	}

	function loadPage() {
		res.render("search/index", {products: products})	
	}
})

router.post("/", function(req, res) {
    res.redirect("/search?search=" + req.body.search)
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router