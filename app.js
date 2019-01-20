const express = require("express");
const app = express();
const productRoutes = require("./routes/products");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const expressSession = require("express-session");
const authRoutes = require("./routes/auth");
const storeRoutes = require("./routes/stores");
const cartRoutes = require("./routes/carts");
const reviewRoutes = require("./routes/reviews");
const searchRoutes = require("./routes/search");


app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb://localhost/amazon_clone");
app.use(bodyParser.urlencoded({ extended: true }));


app.use(expressSession({
	secret: "Rusty is cool",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
})


app.use(authRoutes);
app.use("/products", productRoutes);
app.use("/products/:id/reviews", reviewRoutes);
app.use("/stores", storeRoutes);
app.use("/cart", cartRoutes);
app.use("/search", searchRoutes)


app.get("/", function(req, res) {
	res.redirect("/products")
})


app.listen(3000, function() {
	console.log("Server is up and running...")
})