var express = require("express");
var router = express.Router();
const DriversController = require("../controller/DriversController");
const AuthContoller = require("../controller/Authcontoller");

router
  .route("/")
  .post(DriversController.Drivers)
  .get(AuthContoller.protect, DriversController.GetDrivers);
router.route("/:id").delete(AuthContoller.protect ,AuthContoller.restrictTo("admin" , "manager") , DriversController.deleteDrivers)
module.exports = router;
