const express = require("express");
const router = express.Router();
const ReviewController = require("../controller/ReviewController");
const AuthController = require("../controller/Authcontoller");

router.route('/').get(ReviewController.getAllReviews).post(AuthController.protect ,AuthController.restrictTo('user') , ReviewController.createReview);

module.exports = router;