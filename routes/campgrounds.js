const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsyc = require("../utils/catchAsync");

const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

router
    .route("/")
    .get(catchAsyc(campgrounds.index))
    .post(
        isLoggedIn,
        validateCampground,
        catchAsyc(campgrounds.createCampground)
    );

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
    .route("/:id")
    .get(catchAsyc(campgrounds.showCampground))
    .put(
        isLoggedIn,
        isAuthor,
        validateCampground,
        catchAsyc(campgrounds.updateCampground)
    )
    .delete(isLoggedIn, isAuthor, catchAsyc(campgrounds.deleteCampground));

router.get(
    "/:id/edit",
    isLoggedIn,
    isAuthor,
    catchAsyc(campgrounds.renderEditForm)
);

module.exports = router;
