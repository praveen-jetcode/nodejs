const express = require("express");
const router = express.Router();
const BusController = require("../controller/BusController");
const AuthController = require("../controller/Authcontoller");
const ReviewController = require("../controller/ReviewController");

router.route('/').get(BusController.getBus).post(BusController.addBus);
router.route("/:id").get(BusController.getbusById).patch(BusController.getbusById);    
router.route('/:busId/reviews').post(AuthController.protect ,AuthController.restrictTo('user') , ReviewController.createReview);
module.exports = router;
