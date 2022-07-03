const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");
const catchAsyc = require("../utils/catchAsync");

router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post(
    "/register",
    catchAsyc(async (req, res) => {
        try {
            const { email, username, password } = req.body;
            const newUser = new User({ email, username });
            const registeredUser = await User.register(newUser, password);
            req.flash("success", "Welcome to Yelp Capm!");
            res.redirect("/campgrounds");
        } catch (e) {
            req.flash("error", e.message);
            res.redirect("/register");
        }
    })
);

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
    // req.flash("success", "Wellcome back!");
    // res.redirect("/campgrounds");
    res.send("here");
});

module.exports = router;
