if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const Campground = require("./models/campground");
const catchAsyc = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("./schemas.js");
const Review = require("./models/review");
const User = require("./models/user");

const usersRoutes = require("./routes/users");
const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRouters = require("./routes/reviews");

mongoose
    .connect("mongodb://127.0.0.1:27017/yelpCamp")
    .then(() => {
        console.log("MONGO CONNECTION OPEN!");
    })
    .catch((ERR) => {
        console.log("MONGO CONNECTION ERROR!", ERR);
    });

const db = mongoose.connection;
const app = express();

const sessionConfig = {
    secret: "thisisasecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/", usersRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRouters);

app.get("/", (req, res) => {
    res.render("home");
});

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found!", 404));
});

app.use((err, req, res, next) => {
    if (!err.message) err.message = "Something went wrong!";
    if (!err.status) err.status = 500;
    const { status } = err;
    res.status(status).render("error", { err });
});

app.listen(3000, () => {
    console.log("Serving on port 3000");
});
