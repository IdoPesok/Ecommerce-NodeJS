const express = require("express");
const router = express.Router({mergeParams: true});
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("../models/user");


router.get("/login", function(req, res) {
    res.render("auth/login")
})

// Login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login?error"
}), function(req, res) {
    
})

router.get("/register", function(req, res) {
    res.render("auth/register")
})

// Handle Register Logic
router.post("/register", function(req, res) {
    checkIfStorenameExists(req, res, function() {
        registerUserWithRequest(req, res)
    })
})

function checkIfStorenameExists(req, res, completion) {
    User.find({'storename': req.body.storename}, function(err, foundUsers) {
        if (err) {
            res.send("error")
            console.log("Error")
        } else {
            if (foundUsers.length == 0) {
                console.log(foundUsers)
                completion()
            } else {
                res.redirect("/register?error=storename+exists")
            }
        }
    })
}

function registerUserWithRequest(req, res) {
    User.register(new User({ username: req.body.username, storename: req.body.storename }), req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        
        // Log the user in
        passport.authenticate("local")(req, res, function() {
            res.redirect("/")
        });
    });
}

// Logout Logic
router.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/");
})


module.exports = router