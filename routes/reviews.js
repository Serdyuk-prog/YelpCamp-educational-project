const express = require("express");
const router = express.Router({ mergeParams: true });
const reviews = require("../controllers/reviews");
const catchAsyc = require("../utils/catchAsync");
const Review = require("../models/review");
const Campground = require("../models/campground");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");

router.post("/", isLoggedIn, validateReview, catchAsyc(reviews.createReview));

router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    catchAsyc(reviews.deleteReview)
);

module.exports = router;
