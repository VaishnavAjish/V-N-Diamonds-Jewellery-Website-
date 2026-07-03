const express = require("express");
const router = express.Router();
const { addReview, deleteReviews, getAllReviews } = require("../controller/review.controller");

// add a review
router.post("/add", addReview);
// delete reviews
router.delete("/delete/:id", deleteReviews);
// get all reviews
router.get("/all", getAllReviews);

module.exports = router;
